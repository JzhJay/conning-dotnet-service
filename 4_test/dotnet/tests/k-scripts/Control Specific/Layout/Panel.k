\l main\j\j

p..j.c: `panel
p..j.l: "Panel"
p.p..j.c: `panel
p.p..j.l: "A panel label in blue courier"
p.p..j.lfg: `b
p.p..j.lfont: `"Courier 2 14"
p.p.combo: 0
p.p.combo..j.l: "Color Combo:"
p.p.combo..j.o: (0;1;2;3)
p.p.combo..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)
p.p.combo..j.olfont: ((0;1;2;3);`"Dialog 0 12"`"Arial 3 18"`"Dialog 2 10" `"Dialog 4 12"    )
p.p.combo..j.olfg: ((0;1;2;3);`r`b`r`b)
p.p.combo..j.olbg: ((0;1;2;3);`g`m`c`y)
p.p.combo..j.t: { }

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
