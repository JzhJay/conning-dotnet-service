p..j.c: `panel
p..j.l: "Panels and weighting 2"
p..j.xy: (1250;500)
p..j.a: ,`p1`p2`p3`p4

// Does content affect weighting?

p.p1..j.c: `panel
p.p1..j.l: "All panels have wy of 1.0"
p.p1.p1: !2
p.p1.p2: !2
p.p1.p3: !10

p.p2..j.c: `panel
p.p2..j.l: "All panels have wy of NoExtraSpace"
p.p2.p1: !2
p.p2.p1..j.wy: .j.NoExtraSpace
p.p2.p2: !2
p.p2.p2..j.wy: .j.NoExtraSpace
p.p2.p3: !10
p.p2.p3..j.wy: .j.NoExtraSpace


p.p3..j.c: `panel
p.p3..j.l: "First two .1, last NoExtraSpace"
p.p3.p1: !2
p.p3.p1..j.wy: .1
p.p3.p2: !2
p.p3.p2..j.wy: .1
p.p3.p3: !10
p.p3.p3..j.wy: .j.NoExtraSpace


p.p4..j.c: `panel
p.p4..j.l: "First three 1, last .3"
p.p4.p1: !3
p.p4.p1..j.wy: 1
p.p4.p2: !1
p.p4.p2..j.wy: 1
p.p4.p3: !1
p.p4.p3..j.wy: 1
p.p4.p4..j.c: `panel
p.p4.p4..j.wy: .3

/ renders different
p.p4.p4.tab..j.c: `tab
p.p4.p4.tab.v: !3

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
