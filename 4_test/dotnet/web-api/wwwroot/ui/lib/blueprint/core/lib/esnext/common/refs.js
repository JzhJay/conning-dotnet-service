export function isRefObject(e){return null!=e&&"function"!=typeof e}export function isRefCallback(e){return"function"==typeof e}export function setRef(e,t){isRefObject(e)?e.current=t:isRefCallback(e)&&e(t)}export function combineRefs(e,t){return mergeRefs(e,t)}export function mergeRefs(...e){return t=>{e.forEach((e=>{setRef(e,t)}))}}export function getRef(e){return null===e?null:e.current??e}export function refHandler(e,t,n){return r=>{e[t]=r,setRef(n,r)}}