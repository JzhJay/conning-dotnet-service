import{__assign,__decorate,__extends,__spreadArrays}from"tslib";import classNames from"classnames";import*as React from"react";import DayPicker from"react-day-picker";import{polyfill}from"react-lifecycles-compat";import{AbstractPureComponent2,Boundary,DISPLAYNAME_PREFIX,Divider}from"@blueprintjs/core";import*as DateClasses from"./common/classes";import*as DateUtils from"./common/dateUtils";import*as Errors from"./common/errors";import{MonthAndYear}from"./common/monthAndYear";import{DatePickerCaption}from"./datePickerCaption";import{combineModifiers,getDefaultMaxDate,getDefaultMinDate,HOVERED_RANGE_MODIFIER,SELECTED_RANGE_MODIFIER}from"./datePickerCore";import{DatePickerNavbar}from"./datePickerNavbar";import{DateRangeSelectionStrategy}from"./dateRangeSelectionStrategy";import{Shortcuts}from"./shortcuts";import{TimePicker}from"./timePicker";var DateRangePicker=function(e){function t(t,a){var n,r=e.call(this,t,a)||this;r.modifiers=((n={})[SELECTED_RANGE_MODIFIER]=function(e){var t=r.state.value;return null!=t[0]&&null!=t[1]&&DateUtils.isDayInRange(e,t,!0)},n[SELECTED_RANGE_MODIFIER+"-start"]=function(e){return DateUtils.areSameDay(r.state.value[0],e)},n[SELECTED_RANGE_MODIFIER+"-end"]=function(e){return DateUtils.areSameDay(r.state.value[1],e)},n[HOVERED_RANGE_MODIFIER]=function(e){var t=r.state,a=t.hoverValue,n=t.value,o=n[0],i=n[1];return(null!=o||null!=i)&&null!=a&&null!=a[0]&&null!=a[1]&&DateUtils.isDayInRange(e,a,!0)},n[HOVERED_RANGE_MODIFIER+"-start"]=function(e){var t=r.state.hoverValue;return null!=t&&null!=t[0]&&DateUtils.areSameDay(t[0],e)},n[HOVERED_RANGE_MODIFIER+"-end"]=function(e){var t=r.state.hoverValue;return null!=t&&null!=t[1]&&DateUtils.areSameDay(t[1],e)},n),r.shouldHighlightCurrentDay=function(e){return r.props.highlightCurrentDay&&DateUtils.isToday(e)},r.getDateRangePickerModifiers=function(){var e=r.props.modifiers;return combineModifiers(r.modifiers,__assign({isToday:r.shouldHighlightCurrentDay},e))},r.renderDay=function(e){var t=e.getDate();return React.createElement("div",{className:DateClasses.DATEPICKER_DAY_WRAPPER},t)},r.disabledDays=function(e){return!DateUtils.isDayInRange(e,[r.props.minDate,r.props.maxDate])},r.getDisabledDaysModifier=function(){var e=r.props.dayPickerProps.disabledDays;return e instanceof Array?__spreadArrays([r.disabledDays],e):[r.disabledDays,e]},r.handleTimeChange=function(e,t){var a,n,o,i;null===(n=null===(a=r.props.timePickerProps)||void 0===a?void 0:a.onChange)||void 0===n||n.call(a,e);var s=r.state,l=s.value,h=s.time,u=DateUtils.getDateTime(null!=l[t]?DateUtils.clone(l[t]):new Date,e),c=[l[0],l[1]];c[t]=u;var d=[h[0],h[1]];d[t]=e,null===(i=(o=r.props).onChange)||void 0===i||i.call(o,c),r.setState({value:c,time:d})},r.handleTimeChangeLeftCalendar=function(e){r.handleTimeChange(e,0)},r.handleTimeChangeRightCalendar=function(e){r.handleTimeChange(e,1)},r.renderSingleNavbar=function(e){return React.createElement(DatePickerNavbar,__assign({},e,{maxDate:r.props.maxDate,minDate:r.props.minDate}))},r.renderLeftNavbar=function(e){return React.createElement(DatePickerNavbar,__assign({},e,{hideRightNavButton:r.props.contiguousCalendarMonths,maxDate:r.props.maxDate,minDate:r.props.minDate}))},r.renderRightNavbar=function(e){return React.createElement(DatePickerNavbar,__assign({},e,{hideLeftNavButton:r.props.contiguousCalendarMonths,maxDate:r.props.maxDate,minDate:r.props.minDate}))},r.renderSingleCaption=function(e){return React.createElement(DatePickerCaption,__assign({},e,{maxDate:r.props.maxDate,minDate:r.props.minDate,onMonthChange:r.handleLeftMonthSelectChange,onYearChange:r.handleLeftYearSelectChange,reverseMonthAndYearMenus:r.props.reverseMonthAndYearMenus}))},r.renderLeftCaption=function(e){return React.createElement(DatePickerCaption,__assign({},e,{maxDate:DateUtils.getDatePreviousMonth(r.props.maxDate),minDate:r.props.minDate,onMonthChange:r.handleLeftMonthSelectChange,onYearChange:r.handleLeftYearSelectChange,reverseMonthAndYearMenus:r.props.reverseMonthAndYearMenus}))},r.renderRightCaption=function(e){return React.createElement(DatePickerCaption,__assign({},e,{maxDate:r.props.maxDate,minDate:DateUtils.getDateNextMonth(r.props.minDate),onMonthChange:r.handleRightMonthSelectChange,onYearChange:r.handleRightYearSelectChange,reverseMonthAndYearMenus:r.props.reverseMonthAndYearMenus}))},r.handleDayMouseEnter=function(e,t,a){var n,o,i,s;if(null===(o=(n=r.props.dayPickerProps).onDayMouseEnter)||void 0===o||o.call(n,e,t,a),!t.disabled){var l=DateRangeSelectionStrategy.getNextState(r.state.value,e,r.props.allowSingleDayRange,r.props.boundaryToModify),h=l.dateRange,u=l.boundary;r.setState({hoverValue:h}),null===(s=(i=r.props).onHoverChange)||void 0===s||s.call(i,h,e,u)}},r.handleDayMouseLeave=function(e,t,a){var n,o,i,s;null===(o=(n=r.props.dayPickerProps).onDayMouseLeave)||void 0===o||o.call(n,e,t,a),t.disabled||(r.setState({hoverValue:void 0}),null===(s=(i=r.props).onHoverChange)||void 0===s||s.call(i,void 0,e,void 0))},r.handleDayClick=function(e,t,a){var n,o;if(null===(o=(n=r.props.dayPickerProps).onDayClick)||void 0===o||o.call(n,e,t,a),t.disabled)r.forceUpdate();else{var i=DateRangeSelectionStrategy.getNextState(r.state.value,e,r.props.allowSingleDayRange,r.props.boundaryToModify).dateRange;r.handleDayMouseEnter(e,t,a),r.handleNextState(i)}},r.handleShortcutClick=function(e,t){var a=r.props,n=a.onChange,o=a.contiguousCalendarMonths,i=a.onShortcutChange,s=e.dateRange;if(e.includeTime){var l=[s[0],s[1]],h=[s[0],s[1]],u=getStateChange(r.state.value,s,r.state,o);r.setState(__assign(__assign({},u),{time:h})),null==n||n(l)}else r.handleNextState(s);void 0===r.props.selectedShortcutIndex&&r.setState({selectedShortcutIndex:t}),null==i||i(e,t)},r.handleNextState=function(e){var t,a,n=r.state.value;e[0]=DateUtils.getDateTime(e[0],r.state.time[0]),e[1]=DateUtils.getDateTime(e[1],r.state.time[1]);var o=getStateChange(n,e,r.state,r.props.contiguousCalendarMonths);null==r.props.value&&r.setState(o),null===(a=(t=r.props).onChange)||void 0===a||a.call(t,e)},r.handleLeftMonthChange=function(e){var t,a,n=MonthAndYear.fromDate(e);null===(a=(t=r.props.dayPickerProps).onMonthChange)||void 0===a||a.call(t,n.getFullDate()),r.updateLeftView(n)},r.handleRightMonthChange=function(e){var t,a,n=MonthAndYear.fromDate(e);null===(a=(t=r.props.dayPickerProps).onMonthChange)||void 0===a||a.call(t,n.getFullDate()),r.updateRightView(n)},r.handleLeftMonthSelectChange=function(e){var t,a,n=new MonthAndYear(e,r.state.leftView.getYear());null===(a=(t=r.props.dayPickerProps).onMonthChange)||void 0===a||a.call(t,n.getFullDate()),r.updateLeftView(n)},r.handleRightMonthSelectChange=function(e){var t,a,n=new MonthAndYear(e,r.state.rightView.getYear());null===(a=(t=r.props.dayPickerProps).onMonthChange)||void 0===a||a.call(t,n.getFullDate()),r.updateRightView(n)},r.handleLeftYearSelectChange=function(e){var t,a,n=new MonthAndYear(r.state.leftView.getMonth(),e);null===(a=(t=r.props.dayPickerProps).onMonthChange)||void 0===a||a.call(t,n.getFullDate());var o=r.props,i=o.minDate,s=o.maxDate,l=DateUtils.getDatePreviousMonth(s),h=new MonthAndYear(i.getMonth(),i.getFullYear()),u=new MonthAndYear(l.getMonth(),l.getFullYear());n.isBefore(h)?n=h:n.isAfter(u)&&(n=u);var c=r.state.rightView.clone();n.isBefore(c)&&!r.props.contiguousCalendarMonths||(c=n.getNextMonth()),r.setViews(n,c)},r.handleRightYearSelectChange=function(e){var t,a,n=new MonthAndYear(r.state.rightView.getMonth(),e);null===(a=(t=r.props.dayPickerProps).onMonthChange)||void 0===a||a.call(t,n.getFullDate());var o=r.props,i=o.minDate,s=o.maxDate,l=DateUtils.getDateNextMonth(i),h=MonthAndYear.fromDate(l),u=MonthAndYear.fromDate(s);n.isBefore(h)?n=h:n.isAfter(u)&&(n=u);var c=r.state.leftView.clone();n.isAfter(c)&&!r.props.contiguousCalendarMonths||(c=n.getPreviousMonth()),r.setViews(c,n)};var o=getInitialValue(t),i=o,s=getInitialMonth(t,o),l=DateUtils.areSameMonth(s,t.minDate),h=DateUtils.areSameMonth(s,t.maxDate);t.singleMonthOnly||l||!h||s.setMonth(s.getMonth()-1);var u=MonthAndYear.fromDate(s),c=o[1],d=t.contiguousCalendarMonths||null==c||DateUtils.areSameMonth(s,c)?u.getNextMonth():MonthAndYear.fromDate(c);return r.state={hoverValue:[null,null],leftView:u,rightView:d,selectedShortcutIndex:void 0!==r.props.selectedShortcutIndex?r.props.selectedShortcutIndex:-1,time:i,value:o},r}var a;return __extends(t,e),a=t,t.prototype.render=function(){var e,t=this.props,a=t.className,n=t.contiguousCalendarMonths,r=t.singleMonthOnly||DateUtils.areSameMonth(this.props.minDate,this.props.maxDate),o=classNames(DateClasses.DATEPICKER,DateClasses.DATERANGEPICKER,a,((e={})[DateClasses.DATERANGEPICKER_CONTIGUOUS]=n,e[DateClasses.DATERANGEPICKER_SINGLE_MONTH]=r,e));return React.createElement("div",{className:o},this.maybeRenderShortcuts(),React.createElement("div",null,this.renderCalendars(r),this.maybeRenderTimePickers()))},t.prototype.componentDidUpdate=function(t,a){if(e.prototype.componentDidUpdate.call(this,t,a),!DateUtils.areRangesEqual(t.value,this.props.value)||t.contiguousCalendarMonths!==this.props.contiguousCalendarMonths){var n=getStateChange(t.value,this.props.value,this.state,t.contiguousCalendarMonths);this.setState(n)}this.props.selectedShortcutIndex!==t.selectedShortcutIndex&&this.setState({selectedShortcutIndex:this.props.selectedShortcutIndex})},t.prototype.validateProps=function(e){var t=e.defaultValue,a=e.initialMonth,n=e.maxDate,r=e.minDate,o=e.boundaryToModify,i=e.value,s=[r,n];null==t||DateUtils.isDayRangeInRange(t,s)||console.error(Errors.DATERANGEPICKER_DEFAULT_VALUE_INVALID),null==a||DateUtils.isMonthInRange(a,s)||console.error(Errors.DATERANGEPICKER_INITIAL_MONTH_INVALID),null!=n&&null!=r&&n<r&&!DateUtils.areSameDay(n,r)&&console.error(Errors.DATERANGEPICKER_MAX_DATE_INVALID),null==i||DateUtils.isDayRangeInRange(i,s)||console.error(Errors.DATERANGEPICKER_VALUE_INVALID),null!=o&&o!==Boundary.START&&o!==Boundary.END&&console.error(Errors.DATERANGEPICKER_PREFERRED_BOUNDARY_TO_MODIFY_INVALID)},t.prototype.maybeRenderShortcuts=function(){var e=this.props.shortcuts;if(null==e||!1===e)return null;var t=this.state.selectedShortcutIndex,a=this.props,n=a.allowSingleDayRange,r=a.maxDate,o=a.minDate,i=a.timePrecision;return[React.createElement(Shortcuts,__assign({key:"shortcuts"},{allowSingleDayRange:n,maxDate:r,minDate:o,selectedShortcutIndex:t,shortcuts:e,timePrecision:i},{onShortcutClick:this.handleShortcutClick})),React.createElement(Divider,{key:"div"})]},t.prototype.maybeRenderTimePickers=function(){var e=this.props,t=e.timePrecision,n=e.timePickerProps;return null==t&&n===a.defaultProps.timePickerProps?null:React.createElement("div",{className:DateClasses.DATERANGEPICKER_TIMEPICKERS},React.createElement(TimePicker,__assign({precision:t},n,{onChange:this.handleTimeChangeLeftCalendar,value:this.state.time[0]})),React.createElement(TimePicker,__assign({precision:t},n,{onChange:this.handleTimeChangeRightCalendar,value:this.state.time[1]})))},t.prototype.renderCalendars=function(e){var t,a,n,r=this.props,o=r.dayPickerProps,i=r.locale,s=r.localeUtils,l=r.maxDate,h=r.minDate,u=__assign(__assign({locale:i,localeUtils:s,modifiers:this.getDateRangePickerModifiers(),showOutsideDays:!0},o),{disabledDays:this.getDisabledDaysModifier(),onDayClick:this.handleDayClick,onDayMouseEnter:this.handleDayMouseEnter,onDayMouseLeave:this.handleDayMouseLeave,selectedDays:this.state.value});return e?React.createElement(DayPicker,__assign({},u,{captionElement:this.renderSingleCaption,navbarElement:this.renderSingleNavbar,fromMonth:h,month:this.state.leftView.getFullDate(),numberOfMonths:1,onMonthChange:this.handleLeftMonthChange,toMonth:l,renderDay:null!==(t=null==o?void 0:o.renderDay)&&void 0!==t?t:this.renderDay})):[React.createElement(DayPicker,__assign({key:"left"},u,{canChangeMonth:!0,captionElement:this.renderLeftCaption,navbarElement:this.renderLeftNavbar,fromMonth:h,month:this.state.leftView.getFullDate(),numberOfMonths:1,onMonthChange:this.handleLeftMonthChange,toMonth:DateUtils.getDatePreviousMonth(l),renderDay:null!==(a=null==o?void 0:o.renderDay)&&void 0!==a?a:this.renderDay})),React.createElement(DayPicker,__assign({key:"right"},u,{canChangeMonth:!0,captionElement:this.renderRightCaption,navbarElement:this.renderRightNavbar,fromMonth:DateUtils.getDateNextMonth(h),month:this.state.rightView.getFullDate(),numberOfMonths:1,onMonthChange:this.handleRightMonthChange,toMonth:l,renderDay:null!==(n=null==o?void 0:o.renderDay)&&void 0!==n?n:this.renderDay}))]},t.prototype.updateLeftView=function(e){var t=this.state.rightView.clone();e.isBefore(t)&&!this.props.contiguousCalendarMonths||(t=e.getNextMonth()),this.setViews(e,t)},t.prototype.updateRightView=function(e){var t=this.state.leftView.clone();e.isAfter(t)&&!this.props.contiguousCalendarMonths||(t=e.getPreviousMonth()),this.setViews(t,e)},t.prototype.setViews=function(e,t){this.setState({leftView:e,rightView:t})},t.defaultProps={allowSingleDayRange:!1,contiguousCalendarMonths:!0,dayPickerProps:{},maxDate:getDefaultMaxDate(),minDate:getDefaultMinDate(),reverseMonthAndYearMenus:!1,shortcuts:!0,singleMonthOnly:!1,timePickerProps:{}},t.displayName=DISPLAYNAME_PREFIX+".DateRangePicker",a=__decorate([polyfill],t)}(AbstractPureComponent2);export{DateRangePicker};function getStateChange(e,t,a,n){if(null!=e&&null==t)return{value:[null,null]};if(null!=t){var r=a.leftView.clone(),o=a.rightView.clone(),i=MonthAndYear.fromDate(t[0]),s=MonthAndYear.fromDate(t[1]);return null==i&&null!=s?s.isSame(r)||s.isSame(o)||(o=s,r.isBefore(o)||(r=o.getPreviousMonth())):null!=i&&null==s?i.isSame(r)||i.isSame(o)||(r=i,o.isAfter(r)||(o=r.getNextMonth())):null!=i&&null!=s&&(i.isSame(s)?r.isSame(i)||o.isSame(i)||(r=i,o=i.getNextMonth()):(r.isSame(i)||(r=i,o=i.getNextMonth()),!1!==n||o.isSame(s)||(o=s))),{leftView:r,rightView:o,value:t}}return!0!==n||a.leftView.getNextMonth().isSameMonth(a.rightView)?{}:{rightView:a.leftView.getNextMonth()}}function getInitialValue(e){return null!=e.value?e.value:null!=e.defaultValue?e.defaultValue:[null,null]}function getInitialMonth(e,t){var a=new Date;if(null!=e.initialMonth)return e.initialMonth;if(null!=t[0])return DateUtils.clone(t[0]);if(null!=t[1]){var n=DateUtils.clone(t[1]);return DateUtils.areSameMonth(n,e.minDate)||n.setMonth(n.getMonth()-1),n}return DateUtils.isDayInRange(a,[e.minDate,e.maxDate])?a:DateUtils.getDateBetween([e.minDate,e.maxDate])}