const MESSAGE_EVENT_DATA="blueprint-table-post-message",IDLE_STATE={callbacks:[],triggered:!1},handleIdle=e=>{if(e.source!==window||e.data!==MESSAGE_EVENT_DATA)return;IDLE_STATE.triggered=!1;let t=null;IDLE_STATE.callbacks.length>0&&(t=IDLE_STATE.callbacks.shift()),IDLE_STATE.callbacks.length>0&&triggerIdleFrame(),t&&t()};"undefined"!=typeof window&&null!=window.addEventListener&&window.addEventListener("message",handleIdle,!1);const triggerIdleFrame=()=>{IDLE_STATE.triggered||(IDLE_STATE.triggered=!0,requestAnimationFrame((()=>{requestAnimationFrame((()=>{postMessage(MESSAGE_EVENT_DATA,"*")}))})))};export const requestIdleCallback=e=>{IDLE_STATE.callbacks.push(e),triggerIdleFrame()};