export var Clipboard={applySelectableStyles:function(e){return e.style.overflow="hidden",e.style.height="0px",e.style.setProperty("-webkit-user-select","all"),e.style.setProperty("-moz-user-select","all"),e.style.setProperty("-ms-user-select","all"),e.style.setProperty("user-select","all"),e},copyCells:function(e){var t=document.createElement("table");Clipboard.applySelectableStyles(t);for(var l=0,r=e;l<r.length;l++)for(var n=r[l],o=t.appendChild(document.createElement("tr")),a=0,p=n;a<p.length;a++){var c=p[a];o.appendChild(document.createElement("td")).textContent=c}var d=e.map((function(e){return e.join("\t")})).join("\n");return Clipboard.copyElement(t,d)},copyString:function(e){var t=document.createElement("textarea");return Clipboard.applySelectableStyles(t),t.value=e,Clipboard.copyElement(t,e)},copyElement:function(e,t){if(!Clipboard.isCopySupported())return!1;document.body.appendChild(e);try{return window.getSelection().selectAllChildren(e),null!=t&&e.addEventListener("copy",(function(e){e.preventDefault();var l=e.clipboardData||window.clipboardData;null!=l&&l.setData("text",t)})),document.execCommand("copy")}catch(e){return!1}finally{document.body.removeChild(e)}},isCopySupported:function(){return null!=document.queryCommandSupported&&document.queryCommandSupported("copy")}};