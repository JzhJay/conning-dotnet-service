p..j.c: `panel
p..j.l: "Layout"
p..j.xy: (550;750)

p.panel..j.c: `panel
p.panel..j.l: "Outer panel"
p.panel..j.a: (`nw`n`ne;`w`c`e;`sw`s`se)

p.panel.nw..j.c: `panel
p.panel.nw..j.fill: `b
p.panel.nw..j.border: 1
p.panel.nw.label: "dog"
p.panel.nw.label..j.fill: `n
p.panel.nw.label..j.anchor: `nw

p.panel.n..j.c: `panel
p.panel.n..j.fill: `b
p.panel.n..j.border: 1
p.panel.n.label: "dog"
p.panel.n.label..j.fill: `n
p.panel.n.label..j.anchor: `n

p.panel.ne..j.c: `panel
p.panel.ne..j.fill: `b
p.panel.ne..j.border: 1
p.panel.ne.label: "dog"
p.panel.ne.label..j.fill: `n
p.panel.ne.label..j.anchor: `ne

p.panel.w..j.c: `panel
p.panel.w..j.fill: `b
p.panel.w..j.border: 1
p.panel.w.label: "dog"
p.panel.w.label..j.fill: `n
p.panel.w.label..j.anchor: `w

p.panel.c..j.c: `panel
p.panel.c..j.fill: `b
p.panel.c..j.border: 1
p.panel.c.label: "dog"
p.panel.c.label..j.fill: `n
p.panel.c.label..j.anchor: `c

p.panel.e..j.c: `panel
p.panel.e..j.fill: `b
p.panel.e..j.border: 1
p.panel.e.label: "dog"
p.panel.e.label..j.fill: `n
p.panel.e.label..j.anchor: `e

p.panel.sw..j.c: `panel
p.panel.sw..j.fill: `b
p.panel.sw..j.border: 1
p.panel.sw.label: "dog"
p.panel.sw.label..j.fill: `n
p.panel.sw.label..j.anchor: `sw

p.panel.s..j.c: `panel
p.panel.s..j.fill: `b
p.panel.s..j.border: 1
p.panel.s.label: "dog"
p.panel.s.label..j.fill: `n
p.panel.s.label..j.anchor: `s

p.panel.se..j.c: `panel
p.panel.se..j.fill: `b
p.panel.se..j.border: 1
p.panel.se.label: "dog"
p.panel.se.label..j.fill: `n
p.panel.se.label..j.anchor: `se

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
