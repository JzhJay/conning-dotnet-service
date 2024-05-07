/ tree-table gadget

\d .j

treetable.scroll:{[tree;junk].[`;(-3_.j.v),(~tree),`j`vscrollp;:;`..j.v];}

treetable.redefine_n:{[v]
 np:.u.treepaths n:`. jd[v],`n
 tp:.u.treepaths t:`. v
 i:tp?/:np
 if[0 _in>':i
  a:ad'np j:<i
  nn:./[_n;a;:;n ./:a]
  .[`;jd[v],`n;:;nn]]
}

treetable.closed:{[table;junk]
 dot:`$-1!,/$~:
 v:.j.v
 d:-1_ v
 i:.j.i
 t:`. v
 treetable.redefine_n v
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
 d:-1_ v
 i:.j.i
 t:`. v
 treetable.redefine_n v
 n:`. jd[v],`n
 m:n . i
 p:i,/::[_n~m;!t . i;.u.treepaths treetable.visible m]
 a:`. d,(~table),`j`a
 u:`. d,table
 ut:`. d,(~table),`j`paths
 U:`. d,(~table),`j`table
 Ut:`. d,(~table),`j`table.`j`paths
 if[&/p _lin ut;:_n]
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
 s:^x;c:(240230140;);v:.j.v;i:.j.i;t:(-1_ v),tree;u:`. jd[v],`paths
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
 d[~tree;`j;`c]:`tree
 if[_n~c:d[~table;`j;`c];d[~table;`j;`c]:c:`table]
 d[~tree;`j;`opened]:treetable.opened[table]
 d[~tree;`j;`closed]:treetable.closed[table]
 d[~tree;`j;`scrollable]:0
 if[~`bg _in!d[~tree;`j];d[~tree;`j;`bg]:`w]
 if[~`mg _in!d[~tree;`j];d[~tree;`j;`mg]:`w]
 if[~`l _in!d[~tree;`j];d[~tree;`j;`l]:`"+"]
 p:.u.treepaths d tree
 d[~table;`j;`table]:d table
 d[~table;`j;`table.;`j]:d[~table;`j]_di`table
 d[~table;`j;`table.;`j;`paths]:p
 i:p?/:+,!d tree
 d[table]:@[d table;_n;@[;i]]
 e:d[~table;`j;`table.;`j]
 d[~table;`j;`paths]:p i
 d[~table;`j;`vscroll]:1
 d[~table;`j;`vscrollp.;`j;`t]:treetable.scroll[tree]
 d[~table;`j;`t]:treetable.set
 d[~table;`j;`a]::[`a _in!e;e`a;!d table]
 d[~table;`j;`border]::[`border _in!e;e`border;0]
 d[~table;`j;`sg]::[`sg _in!e;e`sg;`w]
 d[~table;`j;`clbg]::[`clbg _in!e;e`clbg;`n]
 d[~table;`j;`bg]::[c=`Table_;;`bg _in!e;treetable.atomic[e`bg;i];treetable.bg[tree]]
 if[c=`Table_
  d[~table;`j;`table.;`j;`bg]:@[d[~table;`j;`table];_n;:[;((^d[~table;`j;`table;])1)#False]]
  d[~table;`j;`bg.;`j;`t]:treetable.setbg]
 f:`fg`font`b`e`align`f`g`trip`tip`cell
 if[#f@:&f _lin!e;d[~table;`j;f]:treetable.atomic[;i]'e f]
 (d;dd)}

treetable.insert:{[d;o;p;r]treetable[`append`prepend][d][o;p;r]}

treetable.append:{[o;p;r]
 p:(),p
 tree:(!o)o[.;`j;`c]?`tree
 if[p _in .u.treepaths o tree;:_n]
 v:~_n~.[o;(~tree),`j`n,ad[-1_ p],`n]
 table:*(!o)_dv tree
 .[o;tree,p;:;_n]
 q:.u.treepaths o tree
 i:q?p
 t:.[o;(~table),`j`table]
 t:@[t;_n;{(i#x),y,i _ x};r]
 .[o;(~table),`j`table;:;t]
 .[o;(~table),`j`table.`j`paths;:;q]
 if[v
  .[o;(~tree),`j`n,ad[-1_ p],`n;:;1]
  .[o;(~tree),`j`n,ad[p],`n;:;-1]
  u:.u.treepaths@.[./[_n;.[o;(~table),`j`paths];:;_n];p;:;_n]
  .[o;(~table),`j`paths;:;u]
  :[(#u)=1+j:u?p
   .j.app.row[`$($o),".",$table;+,r]
   .j.ins.row[`$($o),".",$table;j;+,r]]]
}

treetable.prepend:{[o;p;r]
 p:(),p
 tree:(!o)o[.;`j;`c]?`tree
 if[p _in .u.treepaths o tree;:_n]
 v:~_n~.[o;(~tree),`j`n,ad[-1_ p],`n]
 table:*(!o)_dv tree
 s:o . tree,-1_ p
 s:.+((-1#p),!s;_n,s[])
 .[o;tree,-1_ p;:;s]
 q:.u.treepaths o tree
 i:q?p
 t:.[o;(~table),`j`table]
 t:@[t;_n;{(i#x),y,i _ x};r]
 .[o;(~table),`j`table;:;t]
 .[o;(~table),`j`table.`j`paths;:;q]
 if[v
  .[o;(~tree),`j`n,ad[-1_ p],`n;:;1]
  .[o;(~tree),`j`n,ad[p],`n;:;-1]
  u:.[o;(~table),`j`paths]
  j:1+u?-1_ p
  u:(j#u),(,p),j _ u
  .[o;(~table),`j`paths;:;u]
  :[(#u)=1+k:u?p
   .j.app.row[`$($o),".",$table;+,r]
   .j.ins.row[`$($o),".",$table;k;+,r]]]
}

treetable.update:{[o;p;f;d]
 p:(),p
 tree:(!o)o[.;`j;`c]?`tree
 table:*(!o)_dv tree
 q:.u.treepaths o tree
 .[o;(~table),`j`table,(f;q?p);:;d]
 u:.[o;(~table),`j`paths]
 if[(#u)>j:u?p;.[o;(table;f;j);:;d]]
}

treetable.delete:{[o;p]}

\

\d .k

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

