import*as React from"react";import*as Errors from"../../common/errors";import{isNodeEnv}from"../../common/utils";import{useHotkeys}from"../../hooks";export var HotkeysTarget2=function(o){var e=o.children,r=o.hotkeys,n=o.options,t=useHotkeys(r,n),s=t.handleKeyDown,i=t.handleKeyUp;return React.useEffect((function(){isNodeEnv("production")||"function"!=typeof e&&r.some((function(o){return!o.global}))&&console.error(Errors.HOTKEYS_TARGET2_CHILDREN_LOCAL_HOTKEYS)}),[r]),"function"==typeof e?e({handleKeyDown:s,handleKeyUp:i}):e};