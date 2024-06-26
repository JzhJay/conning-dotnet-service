p: .()
p..j.c: `panel
p..j.l: "Combobox Demo"
p..j.xy: (300;500)
p..j.loc: (0;100)

/p.label: "Initial value"
/p.label..j.c: `label

p.panel..j.c: `panel
p.panel..j.l: "Panel surrounding combo"
p.panel.cmb: 0
p.panel.cmb..j.border: 1
p.panel.cmb..j.l: "Border surrounding combo"
p.panel.cmb..j.o: (0;1;2;3)
p.panel.cmb..j.ol: ((0;1;2;3);`Frazier`Ali`"Sugar Ray"`Pacquiao)
p.panel.cmb..j.c: `combo
p.panel.cmb..j.bg: `y

p.panel2..j.c: `panel
p.panel2..j.l: "Panel surrounding radio"
p.panel2..j.bg: `y
p.panel2.cmb: 0
p.panel2.cmb..j.c: `radiobutton
p.panel2.cmb..j.border: 1
p.panel2.cmb..j.l: "combo 2"
p.panel2.cmb..j.group: `lonely

p.panel2a..j.c: `panel
p.panel2a..j.l: "Second panel surrounding radio"
p.panel2a.cmb: 0
p.panel2a.cmb..j.c: `radiobutton
p.panel2a.cmb..j.border: 1
p.panel2a.cmb..j.l: "combo 2"
p.panel2a.cmb..j.group: `lonely
p.panel2a.cmb..j.bg: `b

p.panel3..j.c: `panel
p.panel3..j.l: "Panel 3"
p.panel3.panel..j.c: `panel
p.panel3.panel..j.l: "Inner Panel"
p.panel3.panel..j.bg: `r
p.panel3.panel.text: "hello"
p.panel3.panel.text..j.c: `text
p.panel3.panel.text2: "dolly"
p.panel3.panel.text2..j.c: `text
p.panel3.panel.text2..j.bg: `y
p.panel3.panel.text3: "mimosa"
p.panel3.panel.text3..j.c: `text
p.panel3.panel.text3..j.border: 0
p.panel3.text3: "mimosa"
p.panel3.text3..j.l: "String"
p.panel3.text3..j.c: `string
p.panel3.text3..j.bg: `g
p.panel3.check: 0
p.panel3.check..j.l: "Wanna cracker?"
p.panel3.check..j.border: 1
p.panel3.check..j.bg: `y
p.panel3.label: "a label"
p.panel3.label..j.border: 1
p.panel3.label..j.bg: `y
p.panel3.button..j.c: `button
p.panel3.button..j.border: 1
p.panel3.button..j.bg: `y



.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
