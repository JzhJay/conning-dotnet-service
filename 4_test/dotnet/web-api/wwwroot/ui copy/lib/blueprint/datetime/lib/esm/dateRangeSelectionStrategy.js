import{Boundary}from"@blueprintjs/core";import{areSameDay}from"./common/dateUtils";var DateRangeSelectionStrategy=function(){function e(){}return e.getNextState=function(e,a,n,r){return null!=r?this.getNextStateForBoundary(e,a,n,r):this.getDefaultNextState(e,a,n)},e.getNextStateForBoundary=function(e,a,n,r){var t,u,l=this.getBoundaryDate(r,e),o=this.getOtherBoundary(r),i=this.getBoundaryDate(o,e);if(null==l&&null==i)t=r,u=this.createRangeForBoundary(r,a,null);else if(null!=l&&null==i){var y=areSameDay(l,a)?null:a;t=r,u=this.createRangeForBoundary(r,y,null)}else if(null==l&&null!=i)if(areSameDay(a,i)){var d=void 0;n?(t=r,d=i):(t=o,d=null),u=this.createRangeForBoundary(r,d,d)}else this.isOverlappingOtherBoundary(r,a,i)?(t=o,u=this.createRangeForBoundary(r,i,a)):(t=r,u=this.createRangeForBoundary(r,a,i));else if(areSameDay(l,a)){var g=areSameDay(l,i)?null:i;t=r,u=this.createRangeForBoundary(r,null,g)}else if(areSameDay(a,i)){var s=n?[i,i]:[l,null];y=s[0],g=s[1],t=n?r:o,u=this.createRangeForBoundary(r,y,g)}else this.isOverlappingOtherBoundary(r,a,i)?(t=r,u=this.createRangeForBoundary(r,a,null)):(t=r,u=this.createRangeForBoundary(r,a,i));return{dateRange:u,boundary:t}},e.getDefaultNextState=function(e,a,n){var r,t=e[0],u=e[1];if(null==t&&null==u)r=[a,null];else if(null!=t&&null==u)r=this.createRange(a,t,n);else if(null==t&&null!=u)r=this.createRange(a,u,n);else{var l=areSameDay(t,a),o=areSameDay(u,a);r=l&&o?[null,null]:l?[null,u]:o?[t,null]:[a,null]}return{dateRange:r}},e.getOtherBoundary=function(e){return e===Boundary.START?Boundary.END:Boundary.START},e.getBoundaryDate=function(e,a){return e===Boundary.START?a[0]:a[1]},e.isOverlappingOtherBoundary=function(e,a,n){return e===Boundary.START?a>n:a<n},e.createRangeForBoundary=function(e,a,n){return e===Boundary.START?[a,n]:[n,a]},e.createRange=function(e,a,n){return!n&&areSameDay(e,a)?[null,null]:e<a?[e,a]:[a,e]},e}();export{DateRangeSelectionStrategy};