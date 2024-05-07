/ Copyright (c) 2000-2008 Conning Services (Ireland) Limited
/ Jay Sacco

\d .j

/ click t.tree -> open or close if parent
tabletree.k:{ /tabletree.k
 tabletree.toggleNode[.j.v;.j.i 1;`visible] /.j.i holds the screen (visible) index of the table entry just clicked
}

/open or close node i assuming it's a visible parent.  Will crash if you try to open a non-visible node.  This isn't a problem for user clicks, but
/when trying to open nodes programmatically, you must emulate a user and open from the top down
/v is the global path to the tabletree, i is the node screen (visible or absolute) index to open or close, indexType is `visible or `absolute
tabletree.toggleNode:{[v;i;indexType] /tabletree.toggleNode
 w:att[v;`visible] /create a boolean vector for the visibility of each node
 :[indexType~`visible
     j:(&w)i /get the absolute index of the node by indexing the list of the visible nodes
   do[1 /assume indexType is absolute
     j: i
     i: #&w[!j] /determine the visible index
     ]]
 p:att[v;`parent] /get the parent node list
 if[j _in p /if this node is a parent, open or close it
  d:att[v;`depth]
  o:att[v;`open]
  t:att[v;`table]
  :[o j;tabletree.close;tabletree.open][v;i;j;t;p;d;o;w]]
}


/ close node
tabletree.close:{[v;i;j;t;p;d;o;w]
 if[#c:tabletree.children[p;j]
  c@:&w c
  k:(&w)?/:c
  o[j]:0
  w[c]:0
  .[`;jd[v],`s;:;_n]
  .j.del.row[dot v;k]
  tabletree.updateVisualStatus[v;i;"+"] /show this node as closed
  .[`;jd[v],`open;:;o]
  .[`;jd[v],`visible;:;w]]
}

/ children of node
tabletree.children:{[p;i]
 c,,/_f[p]'c:(&p=i)_dv i}

/ indent node names based on their depth
/parent: 1 if this node is a parent, 0 if it is a leaf; opened: open status of the node in the tree; depth of the node in the tree; and the node's name
tabletree.indent:{[parent;opened;depth;name] /tabletree.indent
 `$((4*depth)#" "),:[parent; :[opened;"-";"+"];""],$name}

/ open node
/v - global path to tabletree object
/i - visible (i.e. of those rows visible to the user) row index of node to be opened
/j - absolute (i.e. within the entire tree) row index of this node
/t - the tabletree object table
/p - parent attribute value
/o - opened attribute value
/w - visible attribute value
tabletree.open:{[v;i;j;t;p;d;o;w] /tabletree.open
 /c is an index list of all the node's visible children (those that are directly descendents of the node, plus any of their children that were previously opened by the user)
 if[#c:tabletree.visible[p;o;j]
  o[j]:1 /set the node that we're opening's opened attribute to opened
  b:(j+1)_ w /get a list of the visible attributes for the nodes below the node we're opening
  w[c]:1 /set the children's visibility to visible
  r:t[;c] /get the table rows for each child
  r[0]:tabletree.indent'[c _lin p;o[c];d[c];*r] /indent this node's children
  tabletree.updateVisualStatus[v;i;"-"] /show this node as opened
  :[|/b                 /if there are any visible nodes below the node we're opening
   ins.row[dot v;i+1;r] /  then insert the child rows
   app.row[dot v;r]]    /  else append them since there's nothing below the node being opened
  .[`;jd[v],`open;:;o] /update the open node attribute
  .[`;jd[v],`visible;:;w] /update the visible node attribute
  ]
}

tabletree.updateVisualStatus: {[v;i;c] /tabletree.updateVisualStatus: make this node appear opened or closed. v - global path to tabletree object, i is the index of node being updated, c: character to update with
  if[~i<#`. v,`tree; : _n] /if the node being indexed doesn't exist in the tree, just exit
  n: $`. v,`tree,i /get the name of the node
  /This method allows for leaves not to have a plus or a minus in front of their names, unless we've get a character to force
  ci: (*&~n=" ") /find the index of the first non-blank character
  n: :[n[ci] _in "+-" /If the leading character is a + or -
        @[n;ci;:;c] /replace  the character in front of the name with c
       ci=0 /else if there are no leading blanks
        c,n /insert that c in front of the name
       @[n;ci-1;:;c]] /else there are leading blanks, but no + or - replace the blank character in front of the name with c]
  .[`;v,`tree,i;:;`$n]
  }

/ return the visible nodes underneath parent node i
/p - parent attribute
/o - open attribute
/i - absolute index of the parent node
tabletree.visible:{[p;o;i] /tabletree.visible
 c:(&p=i)_dv i /get a list of all the children of node i
 {x@<x}@c,,/_f[p;o]'c@&o c} /recurse over each of the open children, return a list of the visible children

/ index of path
tabletree.index:{[t;p;j;i] /tabletree.index
 ((p=j)&t=i)?1}

/ insert record
tabletree.insert:{[v;i;r] /tabletree.insert
 v:undot v
 n:*-1#i                                                / leaf to insert
 i:-1_ i                                                / path to leaf
 t:att[v;`table]                                        / get attributes ...
 p:att[v;`parent]
 o:att[v;`open]
 d:att[v;`depth]
 w:att[v;`visible]
 j:1+k:tabletree.index[t`tree;p]/[t[`tree]?*i;1_ i]     / k is index of parent, j is index of child
 t:@[t;_n;{(j#x),(,y),j _ x};n,r]                       / insert into master table
 p[&p>k]+:1                                             / increment parent vector
 if[w[k]&~|/p=k;o[k]:1]                                 / if visible leaf, open the parent node
 l:w[k]&o k                                             / visible and open (see below)
 p:(j#p),k,j _ p                                        / insert into attributes ...
 d:(j#d),(1+d k),j _ d
 o:(j#o),0,j _ o
 w:(j#w),o[k],j _ w
 a:dot jd v                                             / attribute dictionary
 .[a;`table;:;t]                                        / update attributes ...
 .[a;`parent;:;p]
 .[a;`open;:;o]
 .[a;`depth;:;d]
 .[a;`visible;:;w]
 if[w[k];tabletree.updateVisualStatus[v;k;"-"]]         / if parent is visible, update the parent's visual status, forcing a plus sign if needed now that we know it's a parent
 if[l                                                   / if visible and open:
  m:tabletree.indent[0;1;d j;n]                         / indent name, it's always a leaf at this point since it can't have any children
  :[|/(j+1) _ w                                         / insert or append? If there are any visible nodes left after this child node, we insert, else we append
   ins.row[dot v;+/j#w;+,m,r]                           / insert into subtable
   app.row[dot v;+,m,r]]]                               / append to subtable
}

/ update cells
tabletree.update:{[v;i;f;d]
 v:undot v
 t:att[v;`table]                                        / get attributes ..
 p:att[v;`parent]
 o:att[v;`open]
 w:att[v;`visible]
 k:tabletree.index[t`tree;p]/[t[`tree]?*i;1_ i]         / index of node
 t:.[t;(f;k);:;d]                                       / update table attribute
 a:dot jd v                                             / attribute dictionary
 .[a;`table;:;t]                                        / update table attribute ...
 if[w k;.[dot v;(f;+/k#w);:;d]]                         / update sub-table
}

nullClass: {[v] /nullClass: set class to `null to prevent java from processing changes to widget v, (global path to widget e.g. `k`t`widget)
 .[`;(jd v),`c;:;`null]
}
setClass: {[v;cl] /setClass: set class to cl (symbol) to allow java to changes to widget v (global path to widget e.g.  `k`t`widget)
 .[`;(jd v),`c;:;cl]
}


/ open all nodes. v is global path (symbol list) to tabletree object
tabletree.openall:{[v] /tabletree.openall
 if[(`. v)~.(); : _n] /if the tree is empty, just return
 t:att[v;`table]
 d:att[v;`depth]
 p:att[v;`parent]
 parent: (!#p) _lin p /create a boolean vector that determines which node is a parent and which isn't
 if[1=#p; parent: ,0] /if the root node is the only node, then it's not really a parent (though it's listed as it's own parent)
 t[`tree]:tabletree.indent[;1;]'[parent;d;t`tree]
 nullClass v
 .[`;jd[v],`visible;:;(#d)#1]
 .[`;jd[v],`open;:;@[&#d;&p _lin?p;:;1]]
 .[`;v;:;t]
 setClass[v;`table]
}

/ close all nodes. v is global path (symbol list) to tabletree object
tabletree.closeall:{[v] /tabletree.closeall
 if[(`. v)~.(); : _n]  /if the tree is empty, just return
 t:att[v;`table]
 d:att[v;`depth]
 t:@[t;_n;@[;&~d]] /remove all nodes from t except the root node
 nullClass v
 .[`;jd[v],`s;:;_n]
 .[`;jd[v],`visible;:;~d] /make only the root node (which is at depth 0) visible
 .[`;jd[v],`open;:;&#d]   /close all nodes
 parent: 1<#d /the root node is only a parent if it has any children
 t[`tree]: ,tabletree.indent[parent;0;0;*t`tree]
 .[`;v;:;t]
 setClass[v;`table]
}

/ delete record
tabletree.delete:{[v;i]}

/ create tabletree
tabletree.create:{[t;p]
 d:-1+#:'p\'!#p
 o:&#p
 v:0=d
 r:_n
 r[!t]:t[;&v]
 rd:_n
 /put a plus sign in front of any visible node that is a parent
 /i: &(&v) _lin p /the indices of the visible parent nodes
 /nodeNames: r[`tree;i] /the names of each parent node
/r[`tree;i]: "+",'$nodeNames
 rd.j.table:t
 rd.j.parent:p
 rd.j.depth:d
 rd.j.open:o
 rd.j.visible:v
 rd.j.fixed:1
 rd.j.sg:`t /set the extra space below the table to transparent
 rd.j.e:0
 /rd.j.bg:tabletree.bg
 rd.j.k:tabletree.k
 (r;rd)}

/ background color
tabletree.bg:{ /tabletree.bg
 v:.j.v;i:*|.j.i
 p:att[v;`parent]
 d:att[v;`depth]
 j:&w:att[v;`visible]
 t:att[v;`table]
 if[_n~i
  s:#!t
  k:#w
  c:&(~(!#p)_lin p)j
  l:1000_sv 255 255 255-\:15*d j
  :(,l),(-1+s)#,@[k#`w;c;:;240230140]]
 (240230140;)j[i]_in p}


\

\d .k

t[`tree]:`a`b`c`d`e`f`g`y`h`i`j
t[`f`g`h]:(!11;11_draw 100;11_draw 0)
p:0 0 1 1 1 5 5 6 5 8 8

q:.j.tabletree.create[t;p]
table:*q;table.:q 1
.j.c`table;


