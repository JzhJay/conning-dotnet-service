"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.normalizeKeyCombo=exports.getKeyCombo=exports.getKeyComboString=exports.parseKeyCombo=exports.comboMatches=exports.ShiftKeys=exports.Aliases=exports.ModifierBitMasks=exports.Modifiers=exports.KeyCodes=void 0,exports.KeyCodes={8:"backspace",9:"tab",13:"enter",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},exports.Modifiers={16:"shift",17:"ctrl",18:"alt",91:"meta",93:"meta",224:"meta"},exports.ModifierBitMasks={alt:1,ctrl:2,meta:4,shift:8},exports.Aliases={cmd:"meta",command:"meta",escape:"esc",minus:"-",mod:isMac()?"meta":"ctrl",option:"alt",plus:"+",return:"enter",win:"meta"},exports.ShiftKeys={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=","{":"[","}":"]","|":"\\",":":";",'"':"'","<":",",">":".","?":"/"};for(var i=1;i<=12;++i)exports.KeyCodes[111+i]="f"+i;for(i=0;i<=9;++i)exports.KeyCodes[96+i]="num"+i.toString();function comboMatches(e,o){return e.modifiers===o.modifiers&&e.key===o.key}exports.comboMatches=comboMatches;var parseKeyCombo=function(e){for(var o,t=0,s=0,r=e.replace(/\s/g,"").toLowerCase().split("+");s<r.length;s++){var i=r[s];if(""===i)throw new Error('Failed to parse key combo "'+e+'".\n                Valid key combos look like "cmd + plus", "shift+p", or "!"');null!=exports.Aliases[i]&&(i=exports.Aliases[i]),null!=exports.ModifierBitMasks[i]?t+=exports.ModifierBitMasks[i]:null!=exports.ShiftKeys[i]?(t+=exports.ModifierBitMasks.shift,o=exports.ShiftKeys[i]):o=i.toLowerCase()}return{modifiers:t,key:o}};exports.parseKeyCombo=parseKeyCombo;var getKeyComboString=function(e){var o=[];e.ctrlKey&&o.push("ctrl"),e.altKey&&o.push("alt"),e.shiftKey&&o.push("shift"),e.metaKey&&o.push("meta");var t=e.which;return null!=exports.Modifiers[t]||(null!=exports.KeyCodes[t]?o.push(exports.KeyCodes[t]):o.push(String.fromCharCode(t).toLowerCase())),o.join(" + ")};exports.getKeyComboString=getKeyComboString;var getKeyCombo=function(e){var o,t=e.which;null!=exports.Modifiers[t]||(o=null!=exports.KeyCodes[t]?exports.KeyCodes[t]:String.fromCharCode(t).toLowerCase());var s=0;return e.altKey&&(s+=exports.ModifierBitMasks.alt),e.ctrlKey&&(s+=exports.ModifierBitMasks.ctrl),e.metaKey&&(s+=exports.ModifierBitMasks.meta),e.shiftKey&&(s+=exports.ModifierBitMasks.shift),{modifiers:s,key:o}};exports.getKeyCombo=getKeyCombo;var normalizeKeyCombo=function(e,o){return e.replace(/\s/g,"").split("+").map((function(e){var t=null!=exports.Aliases[e]?exports.Aliases[e]:e;return"meta"===t?isMac(o)?"cmd":"ctrl":t}))};function isMac(e){var o=null!=e?e:"undefined"!=typeof navigator?navigator.platform:void 0;return null!=o&&/Mac|iPod|iPhone|iPad/.test(o)}exports.normalizeKeyCombo=normalizeKeyCombo;