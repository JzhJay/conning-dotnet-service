import{clamp}from"../../common/utils";function getDecimalSeparator(t){const r=1.9.toLocaleString(t),e=1..toLocaleString(t),n=9..toLocaleString(t),o=new RegExp(`${e}(.+)${n}`).exec(r);return o&&o[1]||"."}export function toLocaleString(t,r="en-US"){return sanitizeNumericInput(t.toLocaleString(r),r)}export function clampValue(t,r,e){return clamp(t,null!=r?r:-1/0,null!=e?e:1/0)}export function getValueOrEmptyValue(t=""){return t.toString()}function transformLocalizedNumberToStringNumber(t,r){const e=[0,1,2,3,4,5,6,7,8,9].map((t=>t.toLocaleString(r))).indexOf(t);return-1!==e?e:t}export function parseStringToStringNumber(t,r){const e=""+t;if(parseFloat(e).toString()===t.toString())return t.toString();if(void 0!==r){const t=getDecimalSeparator(r);return sanitizeNumericInput(e,r).split("").map((t=>transformLocalizedNumberToStringNumber(t,r))).join("").replace(t,".")}return t.toString()}export function isValueNumeric(t,r){const e=parseStringToStringNumber(t,r);return null!=t&&e-parseFloat(e)+1>=0}export function isValidNumericKeyboardEvent(t,r){return null==t.key||(!!(t.ctrlKey||t.altKey||t.metaKey)||(!(1===t.key.length)||isFloatingPointNumericCharacter(t.key,r)))}function isFloatingPointNumericCharacter(t,r){if(void 0!==r){const e=getDecimalSeparator(r).replace(".","\\."),n=[0,1,2,3,4,5,6,7,8,9].map((t=>t.toLocaleString(r))).join("");return new RegExp("^[Ee"+n+"\\+\\-"+e+"]$").test(t)}return/^[Ee0-9\+\-\.]$/.test(t)}export function toMaxPrecision(t,r){const e=Math.pow(10,r);return Math.round(t*e)/e}function convertFullWidthNumbersToAscii(t){return t.replace(/[\uFF10-\uFF19]/g,(t=>String.fromCharCode(t.charCodeAt(0)-65248)))}export function sanitizeNumericInput(t,r){return convertFullWidthNumbersToAscii(t).split("").filter((t=>isFloatingPointNumericCharacter(t,r))).join("")}