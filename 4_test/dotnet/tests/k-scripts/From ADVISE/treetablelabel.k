/ labelled tree-table gadget

\d .j

treetable.scroll:{[tree;junk].[`;(-3_.j.v),`panel,(~tree),`j`vscrollp;:;`..j.v];}

treetable.closed:{[table;junk]
 dot:`$-1!,/$~:
 v:.j.v
 d:-2_ v
 i:.j.i
 t:`. v
 p:i,/:.u.treepaths t . i
 u:`. d,(~table),`j`paths
 p@:&p _lin u
 j:(!#p)+u?*p
 u:u _di j
 .[`;d,(~table),`j`paths;:;u]
 del.row[dot d,table;j]
 f:`bg`fg`font`b`e`align`f`g`trip`tip`cell
 treetable.closeatomic[d,(~table),`j;j]'f
}

treetable.opened:{[table;junk]
 dot:`$-1!,/$~:
 v:.j.v
 d:-2_ v
 i:.j.i
 t:`. v
 n:`. jd[v],`n
 m:n . i
 p:i,/::[_n~m;!t . i;.u.treepaths treetable.visible m]
 a:`. d,(~table),`j`a
 u:`. d,table
 ut:`. d,(~table),`j`paths
 U:`. d,(~table),`j`table
 Ut:`. d,(~table),`j`table.`j`paths
 k:Ut?/:p
 j:1+ut?i
 o:j=(^u[])1
 :[o;app.row[dot d,table;#p];ins.row[dot d,table;j;#p]]
 q:`. d,(~table),`j`paths
 :[o;q,:Ut k;q:(j#q),Ut[k],j _ q]
 .[`;d,(~table),`j`paths;:;q]
 .[`;d,table,(a;j+!#p);:;U[a;k]]
 f:`bg`fg`font`b`e`align`f`g`trip`tip`cell
 treetable.openatomic[d,(~table),`j;o;j;k]'f
}

treetable.openatomic:{[v;o;j;k;f]
 if[(4:a:`. v,`table.`j,f)_in 0 5
  b:@[`. v,f;_n;{:[@x;x;o;x,y k;(j#x),y[k],j _ x]};a[]]
  .[`;v,f;:;b]]
}

treetable.closeatomic:{[v;j;f]
 if[(4:a:`. v,f)_in 0 5
  b:@[`. v,f;_n;{:[@x;x;x _di j]}]
  .[`;v,f;:;b]]
}

treetable.bg:{[tree;x]
 l:{[v;p]_n~`. v,p}
 s:^x;c:(240230140;);v:.j.v;i:.j.i;t:(-1_ v),`panel,tree;u:`. jd[v],`paths
 :[_n~i;(s[0],-1)#(*/s)#c@l[t]'u;c l[t]u i 1]}

treetable.visible:{[n]:[5=4:n;. 2#'.[.[m;(&~a;1);:;_n];(&1=a:(m:. n).(;2;`n);1);_f]]}

treetable.set:{
 v:.j.v
 i:.j.i
 ut:`. jd[v],`paths
 Ut:`. jd[v],`table.`j`paths
 j:Ut?ut i 1
 .[`;jd[v],`table,(*i;j);:;`. v,i]
}

treetable.atomic:{[d;i]:[(4:d)_in 0 5;@[d;_n;{:[@x;x;x i]}];d]}

treetable.setbg:{
 v:-1_.j.v
 d:`..j.v
 p:`. v,`paths
 P:`. v,`table.`j`paths
 e:`. v,`table.`j`bg
 e[;P?/:p]:d[]
 .[`;v,`table.`j`bg;:;e]
}

treetable.create:{[d;dd]
 a::[`a _in!dd`j;dd[`j;`a];!d]
 b:d[~a;`j;`c]
 tree::[`tree _in b;a b?`tree;*a]
 table:*a _dv tree
 r:_n
 r[`panel.;`j;`c]:`panel
 r[`panel.;`j;`border]:0
 r[`panel.;`j;`a]:`label,tree
 r[`panel;`label]::[`l _in!d[~tree;`j];d[~tree;`j;`l];`tree]
 r[`panel;`label.;`j;`border]:0
 r[`panel;`label.;`j;`b]:`B
 r[`panel;`label.;`j;`bg]:`n
 r[`panel;`label.;`j;`fill]:`h
 r[`panel;`label.;`j;`font]:.j.FONT`l
 r[`panel;`label.;`j;`align]:`c
 r[`panel;tree,~tree]:d@tree,~tree
 r[table,~table]:d@table,~table
 rr:dd
 r[`panel;~tree;`j;`c]:`tree
 if[_n~c:r[~table;`j;`c];r[~table;`j;`c]:c:`table]
 r[`panel;~tree;`j;`opened]:treetable.opened[table]
 r[`panel;~tree;`j;`closed]:treetable.closed[table]
 r[`panel;~tree;`j;`scrollable]:0
 r[`panel;~tree;`j;`border]:0
 if[~`noimage _in!r[`panel;~tree;`j];r[`panel;~tree;`j;`noimage]:`horizontal.jpg]
 if[~`ncimage _in!r[`panel;~tree;`j];r[`panel;~tree;`j;`ncimage]:`horizontal.jpg]
 if[~`nlimage _in!r[`panel;~tree;`j];r[`panel;~tree;`j;`nlimage]:`horizontal.jpg]
 if[~`bg _in!r[`panel;~tree;`j];r[`panel;~tree;`j;`bg]:`w]
 if[~`mg _in!r[`panel;~tree;`j];r[`panel;~tree;`j;`mg]:`w]
 p:.u.treepaths r.panel tree
 r[~table;`j;`table]:r table
 r[~table;`j;`table.;`j]:r[~table;`j]
 r[~table;`j;`table.;`j;`paths]:p
 i:p?/:+,!r.panel tree
 r[table]:@[r table;_n;@[;i]]
 e:r[~table;`j;`table.;`j]
 r[~table;`j;`paths]:p i
 r[~table;`j;`vscroll]:1
 r[~table;`j;`vscrollp.;`j;`t]:treetable.scroll[tree]
 r[~table;`j;`t]:treetable.set
 r[~table;`j;`a]::[`a _in!e;e`a;!r table]
 r[~table;`j;`border]::[`border _in!e;e`border;0]
 r[~table;`j;`sg]::[`sg _in!e;e`sg;`w]
 r[~table;`j;`clbg]::[`clbg _in!e;e`clbg;`n]
 r[~table;`j;`bg]::[c=`Table_;;`bg _in!e;treetable.atomic[e`bg;i];treetable.bg[tree]]
 if[c=`Table_
  r[~table;`j;`table.;`j;`bg]:@[r[~table;`j;`table];_n;:[;((^r[~table;`j;`table;])1)#False]]
  r[~table;`j;`bg.;`j;`t]:treetable.setbg]
 f:`fg`font`b`e`align`f`g`trip`tip`cell
 if[#f@:&f _lin!e;r[~table;`j;f]:treetable.atomic[;i]'e f]
 (r;rr)}

\

\l common/java/j
\l common/java/k/treetablelabel

s.a[`a`b`c;`d`e;`f`g`h`i;`j`k`l`m`n;`o`p`q]:_n
s.b[`f`g`h]:3 513#!3*513
s.b..j.fg[`f]:`r
s.b..j.fg[`g]:513#`g`b
s.b..j.c:`Table_
s..j.div:200
s..j.xy:600 400
s..j.c:`split

t:.j.treetable.create[s;s.]
q:t 0;q.:t 1
.j.c`q

