p: .()
p..j.c: `panel
p..j.l: "Layout"
p..j.xy: (850;550)

p..j.a: ((`top1`top2`top3`top4)
		 (`bottom1`bottom2`bottom3`bottom4))


/ `button, `text, `panel behave the same

p.top1..j.c: `panel
p.top1..j.l: "Fill, 0 0"
p.top1.text..j.l: "panel"
p.top1.text..j.wx: 0.0
p.top1.text..j.wy: 0.0
p.top1.text..j.fill: `b

p.top2..j.c: `panel
p.top2..j.l: "Fill, NoExtraSpace 0"
p.top2.text..j.l: "panel"
p.top2.text..j.wx: .j.NoExtraSpace
p.top2.text..j.wy: 0.0
p.top2.text..j.fill: `b

p.top3..j.c: `panel
p.top3..j.l: "Fill, 0 NoExtraSpace"
p.top3.text..j.l: "panel"
p.top3.text..j.wx: 0.0
p.top3.text..j.wy: .j.NoExtraSpace
p.top3.text..j.fill: `b

p.top4..j.c: `panel
p.top4..j.l: "Fill, 1 1"
p.top4.text..j.l: "panel"
p.top4.text..j.wx: 1.0
p.top4.text..j.wy: 1.0
p.top4.text..j.fill: `b


p.bottom1..j.c: `panel
p.bottom1..j.l: "No fill, 0 0"
p.bottom1.text..j.l: "panel"
p.bottom1.text..j.wx: 0.0
p.bottom1.text..j.wy: 0.0
p.bottom1.text..j.fill: `n

p.bottom2..j.c: `panel
p.bottom2..j.l: "No fill, NoExtraSpace 0"
p.bottom2.text..j.l: "panel"
p.bottom2.text..j.wx: .j.NoExtraSpace
p.bottom2.text..j.wy: 0.0
p.bottom2.text..j.fill: `n

p.bottom3..j.c: `panel
p.bottom3..j.l: "No fill, 0 NoExtraSpace"
p.bottom3.text..j.l: "panel"
p.bottom3.text..j.wx: 0.0
p.bottom3.text..j.wy: .j.NoExtraSpace
p.bottom3.text..j.fill: `n

p.bottom4..j.c: `panel
p.bottom4..j.l: "No fill, 1 1"
p.bottom4.text..j.l: "panel"
p.bottom4.text..j.wx: 1.0
p.bottom4.text..j.wy: 1.0
p.bottom4.text..j.fill: `n


.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
