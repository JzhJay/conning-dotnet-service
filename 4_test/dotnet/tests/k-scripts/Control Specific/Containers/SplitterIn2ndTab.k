\l main\j\j

p: .()
p..j.c: `panel
p..j.l: "KSplitter in 2nd Tab Test"
p..j.xy: (700;600)
p..j.loc: (200;50)
p..j.close:{_exit 0}


p.tab[`Tab1`Tab2]:_n
p.tab.Tab1..j.l:"Tab 1 gets display first"
p.tab.Tab2..j.l:"Check that table 2 has splitter in correct location after we switch to it"


p,tab.Tab1: .();
p.tab.Tab1..j.c:`panel
p.tab.Tab1.v: !10

p.tab.Tab2: .()
p.tab.Tab2..j.c:`panel
p.tab.Tab2.split..j.dir: `v
p.tab.Tab2.split.top: .()
p.tab.Tab2.split.bottom: .()
p.tab.Tab2.split..j.div: 400

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
