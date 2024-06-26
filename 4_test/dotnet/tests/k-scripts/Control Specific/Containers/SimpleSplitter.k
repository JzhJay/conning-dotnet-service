/ Copyright (c) 2005-2012 Conning Services (Ireland) Limited
/ Jay Sacco

\l main\j\j

p: .()
p..j.c: `panel
p..j.close:{_exit 0}
p..j.xy: 600 400

/set up vertical splitter
p.lrSplit..j.c: `split
p.lrSplit.tbSplit: .()
p.lrSplit.tbSplit..j.c: `panel
p.lrSplit.right: .()
p.lrSplit.right..j.c: `panel
/Set a divweight, this is required by the testcase
p.lrSplit..j.divweight: .4

/Add horizontal splitter in left panel
p.lrSplit.tbSplit..j.c: `split
p.lrSplit.tbSplit..j.dir: `v /yes this is correct.  See java.dfk
p.lrSplit.tbSplit.top: .()
p.lrSplit.tbSplit.top..j.c: `panel
p.lrSplit.tbSplit.bottom: .()
p.lrSplit.tbSplit.bottom..j.c: `panel
p.lrSplit.tbSplit..j.divweight: .8

/Put one column editable table in top left panel
rows: 20
p.lrSplit.tbSplit.top.table: .+(,`Top_Left;,!rows)
p.lrSplit.tbSplit.top.table..j.l: `"Top Left Panel Table"
p.lrSplit.tbSplit.top.table..j.c: `table
/Put one column editable table in top bottom panel
rows: 20
p.lrSplit.tbSplit.top.table: .+(,`Bottom_Left;,!rows)
p.lrSplit.tbSplit.top.table..j.l: `"Bottom Left Panel Table"
p.lrSplit.tbSplit.top.table..j.c: `table

/Put one column editable table in right panel
rows: 100
p.lrSplit.right.table: .+(,`Right;,!rows)
p.lrSplit.right.table..j.l: `"Right Panel Table"
p.lrSplit.right.table..j.c: `table

.j.Java {
  .j.c`p
}
