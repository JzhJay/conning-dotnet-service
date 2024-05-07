p: .()
p..j.c: `panel
p..j.l: "4-19-2011 Kui Demo"
p..j.xy: (300;400)
p..j.loc: (200;50)

/Menu
/Save: {_n}
/SaveAs: {_n}
/p..j.menu.File.Save: Save
/p..j.menu.File.Save_As: SaveAs
/p..j.menu..j.async: 2

/Combo
p.combo: 0
p.combo..j.l: "Combo:"
p.combo..j.o: (0;1;2;3)
p.combo..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)
p.combo..j.t: { `0 }

p.v: !10
p.v..j.l: "Vector:"
/p.v..j.bg: `c

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
