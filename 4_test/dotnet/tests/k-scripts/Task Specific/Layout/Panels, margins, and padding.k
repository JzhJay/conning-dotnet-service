p..j.c: `panel
p..j.l: "Panels, margins, and padding"
p..j.xy: (500;750)
p..j.a: ,`panel`panel2

/ panel with a border
p.panel..j.c: `panel
p.panel..j.l: "Outer panel"

/ panel without a border
p.panel.panel..j.c: `panel
p.panel.panel..j.border: 0

/ panel with a border again
p.panel.panel.panel..j.c: `panel
p.panel.panel.panel..j.l: "Inner panel"
p.panel.panel.button..j.c: `button
p.panel.panel.button..j.l: "Whatever you do, don't press me"
p.panel.panel.button..j.fill: `h
p.panel.panel.button..j.anchor: `n
p.panel.panel.button..j.bg: `b   / give us a color so we render as a square to make it easier to check sizing
p.panel.panel.button..j.lfg: `w
p.panel.panel.text: "some text"
p.panel.panel.text..j.l: "Textbox border"
p.panel.panel.text2: "some more text"
p.panel.panel.text2..j.border: 0
p.panel.panel.check: 0
p.panel.panel.check..j.l: "Wanna cracker?"
p.panel.panel.check2: 0
p.panel.panel.check2..j.l: "Wanna Polly?"
p.panel.panel.cmb..j.border: 0
p.panel.panel.cmb..j.o: (0;1;2;3)
p.panel.panel.cmb..j.ol: ((0;1;2;3);`Frazier`Ali`"Sugar Ray"`Pacquiao)
p.panel.panel.cmb..j.c: `combo
p.panel.panel.radio: 0
p.panel.panel.radio..j.c: `radiobutton
p.panel.panel.radio..j.l: "combo 2"
p.panel.panel.radio..j.group: `lonely
p.panel.panel.string: "I'm a frayed knot."
p.panel.panel.string..j.border: 0
p.panel.panel.panel..j.c: `panel
p.panel.panel.panel..j.wy: 0.0
p.panel.panel.panel.label1: "Polo"
p.panel.panel.panel.label1..j.c: `label
p.panel.panel.panel.label1..j.fill: `n
p.panel.panel.panel.label1..j.anchor: `nw
p.panel.panel.panel.label2: "Izod"
p.panel.panel.panel.label2..j.c: `label
p.panel.panel.panel.label2..j.fill: `n
p.panel.panel.panel.label2..j.anchor: `nw

p.panel2..j.c: `panel
p.panel2..j.l: "panel"
p.panel2.p1..j.c: `panel
p.panel2.p1..j.l: "borders with labels"
p.panel2.p1..j.wy: .j.NoExtraSpace
p.panel2.p1.num1: 0
p.panel2.p1.num1..j.fill: `h
p.panel2.p1.num2: 0
p.panel2.p1.num2..j.fill: `h

p.panel2.p2..j.c: `panel
p.panel2.p2..j.l: "borders without labels"
p.panel2.p2..j.wy: .j.NoExtraSpace
p.panel2.p2.num1: 0
p.panel2.p2.num1..j.fill: `h
p.panel2.p2.num1..j.l: ""
p.panel2.p2.num1..j.border: 1
p.panel2.p2.num2: 0
p.panel2.p2.num2..j.fill: `h
p.panel2.p2.num2..j.l: ""
p.panel2.p2.num2..j.border: 1

p.panel2.p3..j.c: `panel

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
