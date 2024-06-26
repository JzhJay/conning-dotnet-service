/ DAG demonstration widget

\l common/java/j
Dag[`a`b`c`Z]:(();`a;`a`b;())
Dag..j.nx[`a`b`c`Z]:100 200 300 0
Dag..j.ny[`a`b`c`Z]:400 200 400 0
Dag..j.nr[`a`b`c`Z]:15 15 15 0
Dag..j.ng[`a`b`c`Z]:`b`b`b`t
Dag..j.xy:500 600
Nodes..d:"Dag..j[`nx`ny;]"
Lines..d:"+(!Dag)?/:/:,/(!Dag),/:'(),/:Dag[]"
.j.c`Dag;

Line:_n
Line..t:".k.set_line .._v"
set_line:{[r;s]}
Node:_n
Node..t:".k.set_node@._v"
set_node:{[n]Dag..j.ng[n]::[_n~n;`b;`g]}
Dag..j.m..j.t:{mouse .`..j.v}

mouse:{[p;b]:[_n~b;select;`l~b;drag_node;`r~b;drag_line]p}
         				
select:{[p]
 Node:::[1 _in b:{pc[p;x,y;z]}'[Dag..j.nx[];Dag..j.ny[];Dag..j.nr[]];(!Dag)b?1]
 :[_n~Line;start_line;end_line]p
}

start_line:{[p]
 Dag..j[`nx`ny;`Z]:p
 Line::nl p
 Dag[*Line]:Dag[*Line]_dv Line 1
 Dag.Z::Line 1
}

end_line:{[p]}

nl:{[p](!Dag)Lines[;d?&/d:dpl[p].'+(+Nodes)Lines]}
 
drag_node:{[p]if[~_n~n:Node;Dag..j[`nx`ny;n]:p]}
/ drag_line:{[p]:[~_n~n:Line]}
 
cc:{[d;c;r]_sqr[r*2]>+/_sqr d-c}				/ circles overlap?
pc:{[p;c;r]_sqr[r]>+/_sqr p-c}					/ point in circle?
dpp:{[p;q]_sqrt+/_sqr p-q}					/ dist point to point
dpc:{[p;c;r]dpp[p;c]-r}						/ dist point to circle
dpl:{[p;s;e]dpp[p]ip[p;s;e]}					/ dist point to line
nc:{(!Dag)e?&/e:dpc[x,y;Nodes]z}				/ nearest circle to point
/ nl:{(!Dag)Lines d?&/d:dpl[x,y].'+(+Nodes)Lines} 		/ nearest line to point
sl:%/|-   							/ slope of line

ip:{[p;s;e]							/ point on line
 if[s[0]=*e;:s[0],p 1]
 if[s[1]=e 1;:p[0],s 1]
 i:-%k:sl[e]s
 x:(p[1]+(k**s)-s[1]+i**p)%k-i
 y:s[1]+k*x-*s
 x,y}

icr:{[c;p;r]							/ point on circle w/radius
 if[c[0]=*p;:c[0],:[c[1]>p 1;c[1]-r;r+c 1]]
 if[c[1]=p 1;::[c[0]>*p;c[0]-r;r+*c],c 1]
 t:r%_sqrt 1+_sqr m:sl[p]c
 x1:c[0]+t;y1:c[1]+m*x1-*c;p1:x1,y1
 x2:c[0]-t;y2:c[1]+m*x2-*c;p2:x2,y2
 :[dpp[p1;p]<dpp[p2]p;p1;p2]}

