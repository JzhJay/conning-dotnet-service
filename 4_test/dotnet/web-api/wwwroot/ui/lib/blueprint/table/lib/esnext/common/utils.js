import{IconSize}from"@blueprintjs/core";export const CLASSNAME_EXCLUDED_FROM_TEXT_MEASUREMENT="bp-table-text-no-measure";const EXCLUDED_ICON_PLACEHOLDER_WIDTH=IconSize.STANDARD,CSS_FONT_PROPERTIES=["font-style","font-variant","font-weight","font-size","font-family"];export const Utils={times(e,t){if(e<0)throw new Error("[Blueprint] times() cannot be called with negative numbers.");const n=Array(e);for(let r=0;r<e;r++)n[r]=t(r);return n},accumulate(e){const t=[];let n=0;for(const r of e)n+=r,t.push(n);return t},toBase26Alpha:e=>{let t="";for(;;){const n=e%26;if(t=String.fromCharCode(65+n)+t,(e-=n)<=0)return t;e=e/26-1}},toBase26CellName:(e,t)=>`${Utils.toBase26Alpha(t)}${e+1}`,binarySearch(e,t,n){let r=0;for(;r<t;){const o=Math.floor((r+t)/2);n(o)<e?r=o+1:t=o}return t},arrayOfLength(e,t,n){if(e.length>t)return e.slice(0,t);for(e=e.slice();e.length<t;)e.push(n);return e},assignSparseValues(e,t){if(null==t||e.length!==t.length)return e;e=e.slice();for(let n=0;n<e.length;n++){const r=t[n];null!=r&&(e[n]=r)}return e},measureElementTextContent(e){const t=document.createElement("canvas").getContext("2d"),n=getComputedStyle(e,null);return t.font=CSS_FONT_PROPERTIES.map((e=>n.getPropertyValue(e))).join(" "),measureTextContentWithExclusions(t,e)},clamp:(e,t,n)=>(null!=t&&e<t&&(e=t),null!=n&&e>n&&(e=n),e),guideIndexToReorderedIndex:(e,t,n)=>t<e?t:e<=t&&t<e+n?e:Math.max(0,t-n),reorderedIndexToGuideIndex:(e,t,n)=>t<=e?t:t+n,reorderArray(e,t,n,r=1){if(0===r||r===e.length||t===n)return e.slice();if(r<0||r>e.length||t+r>e.length)return;const o=e.slice(0,t),l=e.slice(t,t+r),s=e.slice(t+r),u=[];let i=0,a=0,c=0,h=0;for(;i<n;)a<o.length?(u.push(o[a]),a+=1):(u.push(s[h]),h+=1),i+=1;for(;c<r;)u.push(l[c]),c+=1,i+=1;for(;i<e.length;)a<o.length?(u.push(o[a]),a+=1):(u.push(s[h]),h+=1),i+=1;return u},isLeftClick:e=>0===e.button,getApproxCellHeight(e,t,n,r,o,l){const s=null==e?0:e.length,u=(t-o)/n;return(Math.ceil(s/u)+l)*r}};function measureTextContentWithExclusions(e,t){const n=t.querySelectorAll(".bp-table-text-no-measure");let r=0;n&&n.length&&n.forEach((t=>{const n=e.measureText(t.textContent);r+=n.width-EXCLUDED_ICON_PLACEHOLDER_WIDTH}));const o=e.measureText(t.textContent);return{...o,width:o.width-r}}