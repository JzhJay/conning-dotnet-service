export function isFunction(n){return"function"==typeof n}export function safeInvoke(n,...t){if(isFunction(n))return n(...t)}export function safeInvokeOrValue(n,...t){return isFunction(n)?n(...t):n}