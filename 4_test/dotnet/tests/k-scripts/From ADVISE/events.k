\d .j

/ tt:.j.events.get[]
/ t:*tt;t.:tt 1
/ .j.c`t

events.get:{
 i:&~{`"*" _in(),x}'Name.v
 v:Name.v i;c:Name.c i
 P:.u.paths[`;()]
 D:`./:P
 i:&7=4::'D
 D@:i
 P@:i
 (.+(`v`c`e`f;+,/events.get_[P;D]'[v;c]);.,`j,.+(`e`kk;0,events.kk))}

events.kk:{
 if[`f=*.j.i
  d:`..j.v,.j.i
  f:`..j.v,`v,*|.j.i
  if[4=4:d;d:. d]
  k:events.set[f;d]
  .j.c k]
}

events.set:{[f;d]
 i:`$"i",$1+#!events.Events
 .[`.j.events.Events;i;:;"<html><body><pre>",(5:d),"</pre></body></html>"]
 .[`.j.events.Events;(~i),`j`c;:;`html]
 .[`.j.events.Events;(~i),`j`l;:;$f]
 dot`j`events`Events,i}

events.Events:.()

events.get_:{[P;D;v;c]
 if[c=`button;:,(dot v;c;`;events.nameof[P;D;v;`. v])]
 if[c _in`menu`popup`tray;:events.menu[P;D;c;v]]
 if[#f@:i:&(f:!d:`. jd v)_lin EVENTS;:+(dot v;c;f;events.nameof[P;D;v]'d f)]
 ()}

events.menu:{[P;D;c;v]
 :[5=t:4:d:`. v;,/_f[P;D;c]'v,/:!d;7=t;,dot[v],c,`,events.nameof[P;D;v;d];()]}

events.nameof:{[P;D;v;f]
 if[(#P)>i:P?v;P:P _di i;D:D _di i]
 :[(#D)>i:D?f;dot P i;f]}
 
 
 

