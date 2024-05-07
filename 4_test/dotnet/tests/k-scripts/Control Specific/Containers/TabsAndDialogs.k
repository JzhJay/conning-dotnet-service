p: .()
p..j.c:`panel

p.combo: 0
p.combo..j.l: "Tab Location with a very, very long name:"
p.combo..j.o: (0;1;2;3)
p.combo..j.ol: ((0;1;2;3);`Left`Top`Right`Bottom)
p.combo..j.t: {p.tab..j.tabs::TabPositions[p.combo]}
TabPositions: (`l;`t;`r;`b)

p.tab[`Alpha`Beta`Gamma`Delta]:_n
p.tab..j.border: 1

p.tab.Alpha: !5

p.tab.Beta..j.c: `button

p.tab.Gamma: "a string"
p.tab.Gamma..j.c: `string

p.combo..j.t[]

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
