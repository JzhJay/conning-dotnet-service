// recursive tree

\d .j

/ shown variables go here
rtree.VARS:.()

/ right-click down event
rtree.kd:{
 v:.j.v
 i:.j.i
 l:att[v;`nl]
 j:l[1;l[0]?i]
 if[t:7=4:s:. j;s:rtree.html@5:s]
 f:`$"c",$#!rtree.VARS
 w:`j`rtree`VARS
 .[`;w,f;:;s]
 a:.(`e,0;`l,j;(`xy;1000 400);`v,0)
 if[t;a[`c]:`html]
 .[`;w,(~f),`j;:;a]
 .j.c b:dot w,f
 if[`tree=class b;.[`;w,(~f),`j`c;:;`Tree]]
 if[`map=class b;.[`;w,(~f),`j`c;:;`Map]]
 .[`;w,(~f),`j`v;:;1]
}

rtree.html:{[s]
 "<html><body><pre>",s,"</pre></body></html>"}

/ node-opened event
rtree.opened:{
 v:.j.v
 i:.j.i
 if[rtree.RECURSE~`. v,i
  c:att[v;`RECURSE]
  l:att[v;`nl]
  m:att[v;`nlfg]
  j:l[1;l[0]?i]
  a:rtree.node[i;?*c;{x@<x}@?c[1;&c[0]=j]]
  t:*a
  l:l,'a 1
  m:m,'a 2
  .[`;jd[v],`nl;:;l]
  .[`;jd[v],`nlfg;:;m]
  .[`;v,i;:;t]]
}

/ find all occurrences of variable
rtree.find:{
 v:ad@-2_.j.v
 s:att[v;`SELECTED]
 c:att[v;`RECURSE]
 l:att[v;`nl]
 f:l[1;l[0]?s]
 rtree.Input:f
 g:Input[f;"Variable to find:";"Find"]
 if[~_n~g
  h:?c[0;&g=c 1]
  b:.:'h
  j:&7=4::'b
  h@:j;b@:j
  b:5::'b
  t:.j.rtree.html@,/.j.rtree.find_html[c;g]'[h;b]
  a:.(`c;`html;`e,0;`l,j;(`xy;1000 400);`v,0)
  !-1]
}

rtree.find_html:{[c;g;h;b]
 f:c[2;i:&(h=*c)&g=c 1]
 b:1_'(&b="\n")_ b:"\n",b
 t:b l:_ss[b]'f
 u:$(#:'l)#'f
 !-1
}


/   p:,/.j.rtree.paths[c;()]'[?*c;c[1;=*c]]
/   p@:&f _in/:p

rtree.paths:{[c;p;a;b]
 p,:a
 b@:&~b _in\:p
 if[~#b;:,p]
 i:&c[0]_lin b
 if[~#i;:,p]
 a:?c[0;i]
 b:c[1;i][=c[0;i]]
 ,/_f[c;p]'[a;b]}

/ prompt for variable to find
rtree.Input:`

/ open all paths under SELECTED node
rtree.open:{
}

/ close all paths
rtree.close_all:{
 tree.Close dot ad@-2_.j.v
}

/ close all paths under SELECTED node
rtree.close:{
 i:att[v;`SELECTED]
 tree.close[dot ad@-2_.j.v;i]
}

rtree.script:{
}

rtree.krd:{
 v:.j.v
 i:.j.i
 m:att[v;`nlfg]
 m[1;&`b~'m 1]:_n
 m[1;m[0]?i]:`b
 .[`;jd[v],`nlfg;:;m]
 .[`;jd[v],`SELECTED;:;i]
}

/ recursion marker
rtree.RECURSE:.,(`RECURSE;)

/ contents of node
rtree.node:{[i;c;d]
 n:`$"n",/:$!#d
 b:d _lin c
 k:i,/:n
 l:(k;d)
 m:(k;(#k)#_n)
 (.+(n;(;rtree.RECURSE)b);l;m)}

/ create a recursive tree
rtree.create:{[c]
 v:?,//c;v@:&7=(4:.:)'v;v@:<v
 a:rtree.node[();*c;v]
 t:*a
 td:_n
 td.j.nl:a 1
 a[2;1;0]:`b
 td.j.nlfg:a 2
 td.j.krd:rtree.krd
 td.j.popup[`Find`Open`Close`Close_All`Script]:rtree`find`open`close`close_all`script
 td.j.popup..j.async:2
 td.j.RECURSE:c
 td.j.SELECTED:,`n0
 td.j.c:`tree
 td.j.opened:rtree.opened
 td.j.kd:rtree.kd
 td.j.xy:600 700
 (t;td)}


