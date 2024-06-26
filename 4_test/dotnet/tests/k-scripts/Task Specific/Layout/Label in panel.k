p..j.c: `panel
p..j.l: "Label in panel"
p..j.a: ,`p1`p2

p.p1..j.c: `panel
p.p1.label..j.c: `label
p.p1.label: "All your base are belong to us."

p.p2..j.c: `panel
p.p2..j.border: 0
p.p2.label..j.c: `label
p.p2.label: "All your base are belong to us."

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
