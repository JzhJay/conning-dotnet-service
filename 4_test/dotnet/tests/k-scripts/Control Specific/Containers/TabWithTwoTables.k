p: .()
p..j.c: `panel
p..j.l: "KTable Test"
p..j.xy: (700;600)
p..j.loc: (200;50)

CreateTable: { [rows;cols]  .+( {`$"C_",$x}'(!cols);{x+(1+x)*!y}'[(!cols);rows]) }

p.tab[`Tab1`Tab2]:_n
p.tab.Tab1..j.l:"Two Tables in a panel"
p.tab.Tab2..j.l:"Check that table 2 has a multiline column"


p.tab.Tab1: .();
p.tab.Tab1..j.c:`panel
p.tab.Tab1.left:CreateTable[10;1]
p.tab.Tab1.left..j.border:0
p.tab.Tab1.right:CreateTable[10;6]
p.tab.Tab1.right..j.border:0
p.tab.Tab1.right..j.cl.C_0:"Big\nmulti-line\ncolumn"
p.tab.Tab1..j.a: (`left`right;`left`right)

p,tab.Tab2: .();
p.tab.Tab2..j.c:`panel
p.tab.Tab2.left:CreateTable[10;1]
p.tab.Tab2.left..j.border:0
p.tab.Tab2.right:CreateTable[10;6]
p.tab.Tab2.right..j.border:0
p.tab.Tab2.right..j.cl.C_0:"Big\nmulti-line\ncolumn"
p.tab.Tab2..j.a: (`left`right;`left`right)

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
