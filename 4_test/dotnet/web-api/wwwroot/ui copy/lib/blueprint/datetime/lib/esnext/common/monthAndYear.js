import{getDateNextMonth,getDatePreviousMonth}from"./dateUtils";export class MonthAndYear{constructor(t,e){this.date=null!==t&&null!==e?new Date(e,t):new Date}static fromDate(t){return null==t?void 0:new MonthAndYear(t.getMonth(),t.getFullYear())}clone(){return new MonthAndYear(this.getMonth(),this.getYear())}getFullDate(){return this.date}getMonth(){return this.date.getMonth()}getYear(){return this.date.getFullYear()}getPreviousMonth(){const t=getDatePreviousMonth(this.date);return new MonthAndYear(t.getMonth(),t.getFullYear())}getNextMonth(){const t=getDateNextMonth(this.date);return new MonthAndYear(t.getMonth(),t.getFullYear())}isBefore(t){return compareMonthAndYear(this,t)<0}isAfter(t){return compareMonthAndYear(this,t)>0}isSame(t){return 0===compareMonthAndYear(this,t)}isSameMonth(t){return this.getMonth()===t.getMonth()}}function compareMonthAndYear(t,e){const n=t.getMonth(),r=t.getYear(),o=e.getMonth(),a=e.getYear();return r===a?n-o:r-a}