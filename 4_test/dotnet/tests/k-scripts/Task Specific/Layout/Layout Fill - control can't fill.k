p: .()
p..j.c: `panel
p..j.l: "Layout Fill - control can't fill"
p..j.xy: (850;550)

p..j.a: ((`top1`top2`top3`top4)
		 (`bottom1`bottom2`bottom3`bottom4)
		 (`default))

/ `check, `label, and `radiobutton behave the same

p.top1..j.c: `panel
p.top1..j.l: "Fill, 0 0"
p.top1.button: 0
p.top1.button..j.c: `check
p.top1.button..j.border: 0
p.top1.button..j.wx: 0.0
p.top1.button..j.wy: 0.0
p.top1.button..j.fill: `b

p.top2..j.c: `panel
p.top2..j.l: "Fill, NoExtraSpace 0"
p.top2.button: 0
p.top2.button..j.c: `check
p.top2.button..j.border: 0
p.top2.button..j.wx: .j.NoExtraSpace
p.top2.button..j.wy: 0.0
p.top2.button..j.fill: `b

p.top3..j.c: `panel
p.top3..j.l: "Fill, 0 NoExtraSpace"
p.top3.button: 0
p.top3.button..j.c: `check
p.top3.button..j.border: 0
p.top3.button..j.wx: 0.0
p.top3.button..j.wy: .j.NoExtraSpace
p.top3.button..j.fill: `b

p.top4..j.c: `panel
p.top4..j.l: "Fill, 1 1"
p.top4.button: 0
p.top4.button..j.c: `check
p.top4.button..j.border: 0
p.top4.button..j.wx: 1.0
p.top4.button..j.wy: 1.0
p.top4.button..j.fill: `b


p.bottom1..j.c: `panel
p.bottom1..j.l: "No fill, 0 0"
p.bottom1.button: 0
p.bottom1.button..j.c: `check
p.bottom1.button..j.border: 0
p.bottom1.button..j.wx: 0.0
p.bottom1.button..j.wy: 0.0
p.bottom1.button..j.fill: `n

p.bottom2..j.c: `panel
p.bottom2..j.l: "No fill, NoExtraSpace 0"
p.bottom2.button: 0
p.bottom2.button..j.c: `check
p.bottom2.button..j.border: 0
p.bottom2.button..j.wx: .j.NoExtraSpace
p.bottom2.button..j.wy: 0.0
p.bottom2.button..j.fill: `n

p.bottom3..j.c: `panel
p.bottom3..j.l: "No fill, 0 NoExtraSpace"
p.bottom3.button: 0
p.bottom3.button..j.c: `check
p.bottom3.button..j.border: 0
p.bottom3.button..j.wx: 0.0
p.bottom3.button..j.wy: .j.NoExtraSpace
p.bottom3.button..j.fill: `n

p.bottom4..j.c: `panel
p.bottom4..j.l: "No fill, 1 1"
p.bottom4.button: 0
p.bottom4.button..j.border: 0
p.bottom4.button..j.c: `check
p.bottom4.button..j.wx: 1.0
p.bottom4.button..j.wy: 1.0
p.bottom4.button..j.fill: `n


p.default..j.c: `panel
p.default..j.l: "Default"

/p.default.button: 0
/p.default.button..j.c: `radiobutton
/p.default.button..j.group: `group

p.default.button: 0
p.default.button..j.c: `check

/p.default.button: "label"
/p.default.button..j.c: `label


.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
