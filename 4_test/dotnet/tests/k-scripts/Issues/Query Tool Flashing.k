m: .()
m..j.c: `panel
m.t.c: _n
m.t..j.c: `tab
m.t.c..j.c: `split
m.t.c..j.dir:`v
m.t.c..j.a: (`r`a)
m.t.c..j.h: 20
m.t.c..j.font: `"Courier 0 14"
m.t.c..j.lfont: `"Dialog 0 12"

m.t.c.a: .()
m.t.c.a..j.c: `panel
m.t.c.a..j.l: `Arguments
m.t.c.a..j.h: 20
m.t.c.a..j.font:`"Courier 0 14"
m.t.c.a..j.lfont: `"Dialog 0 12"

m.t.c.r: 0#`
m.t.c.r..j.l: `"Resize the window, then click on the window edge as if you're going to resize it, the bottom panel will flash"

.j.Java {
  .j.c`m
}
m..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
