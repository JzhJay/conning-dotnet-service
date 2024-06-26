p..j.c: `panel
p..j.l: "Layout"
p..j.xy: (550;750)

p.panel..j.c: `panel
p.panel..j.l: "Outer panel"
p.panel..j.a: (`panel1`panel2;`panel3`panel4)

p.panel.panel1..j.c: `panel
p.panel.panel1..j.wy: 0.0
p.panel.panel1..j.fill: `h
p.panel.panel1..j.anchor: `n
p.panel.panel1..j.border: 1
p.panel.panel1..j.insets: 0 0 10 0
p.panel.panel1.choices..j.c:`panel
p.panel.panel1.choices..j.fill:`n
p.panel.panel1.choices..j.anchor:`n
p.panel.panel1.choices..j.border:0
p.panel.panel1.choices..j.insets:0 70 0 0
p.panel.panel1.choices..j.a: (`c1`Derivatives;`c2)
p.panel.panel1.choices.c1: "Helvetica 0 14"
p.panel.panel1.choices.c1..j.font: `"Helvetica 0 14"
p.panel.panel1.choices.c1..j.c:`label
p.panel.panel1.choices.c1..j.anchor:`w
p.panel.panel1.choices.c1..j.insets:0 0 0 30
p.panel.panel1.choices.Derivatives: "Derivatives"
p.panel.panel1.choices.Derivatives..j.c:`label
p.panel.panel1.choices.Derivatives..j.anchor:`w
p.panel.panel1.choices.Derivatives..j.insets:0 0 0 30
p.panel.panel1.choices.c2: "Helvetica 2 13"
p.panel.panel1.choices.c2..j.font:`"Helvetica 2 13"
p.panel.panel1.choices.c2..j.c:`label
p.panel.panel1.choices.c2..j.anchor:`w
p.panel.panel1.choices.c2..j.insets:0 0 0 30


p.panel.panel2..j.c: `panel
p.panel.panel2..j.wy: 0.0
p.panel.panel2..j.fill: `h
p.panel.panel2..j.anchor: `n
p.panel.panel2..j.border: 1
p.panel.panel2..j.insets: 0 0 10 0
p.panel.panel2.choices..j.c:`panel
p.panel.panel2.choices..j.fill:`n
p.panel.panel2.choices..j.anchor:`w
p.panel.panel2.choices..j.border:0
p.panel.panel2.choices..j.insets:0 70 0 0
p.panel.panel2.choices..j.a: (`c1`Derivatives;`c2)
p.panel.panel2.choices.c1: "Courier 0 14"
p.panel.panel2.choices.c1..j.font: `"Courier 0 14"

p.panel.panel2.choices.c1..j.c:`label
p.panel.panel2.choices.c1..j.anchor:`w
p.panel.panel2.choices.c1..j.insets:0 0 0 30
p.panel.panel2.choices.Derivatives: "Derivatives"
p.panel.panel2.choices.Derivatives..j.c:`label
p.panel.panel2.choices.Derivatives..j.anchor:`w
p.panel.panel2.choices.Derivatives..j.insets:0 0 0 30
p.panel.panel2.choices.c2: "Courier 2 13"
p.panel.panel2.choices.c2..j.font:`"Courier 2 13"
p.panel.panel2.choices.c2..j.c:`label
p.panel.panel2.choices.c2..j.anchor:`w
p.panel.panel2.choices.c2..j.insets:0 0 0 30

p.panel.panel3..j.c: `panel
p.panel.panel3..j.wy: 0.0
p.panel.panel3..j.fill: `h
p.panel.panel3..j.anchor: `n
p.panel.panel3..j.border: 1
p.panel.panel3..j.insets: 0 0 10 0
p.panel.panel3.choices..j.c:`panel
p.panel.panel3.choices..j.fill:`n
p.panel.panel3.choices..j.anchor:`s
p.panel.panel3.choices..j.border:0
p.panel.panel3.choices..j.insets:0 70 0 0
p.panel.panel3.choices..j.a: (`c1`Derivatives;`c2)
p.panel.panel3.choices.c1: "Dialog 0 14"
p.panel.panel3.choices.c1..j.font: `"Dialog 0 14"
p.panel.panel3.choices.c1..j.c:`label
p.panel.panel3.choices.c1..j.anchor:`w
p.panel.panel3.choices.c1..j.insets:0 0 0 30
p.panel.panel3.choices.Derivatives: "Derivatives"
p.panel.panel3.choices.Derivatives..j.c:`label
p.panel.panel3.choices.Derivatives..j.anchor:`w
p.panel.panel3.choices.Derivatives..j.insets:0 0 0 30
p.panel.panel3.choices.c2: "Dialog 2 13"
p.panel.panel3.choices.c2..j.c:`label
p.panel.panel3.choices.c2..j.font:`"Dialog 2 13"
p.panel.panel3.choices.c2..j.anchor:`w
p.panel.panel3.choices.c2..j.insets:0 0 0 30

p.panel.panel4..j.c: `panel
p.panel.panel4..j.wy: 0.0
p.panel.panel4..j.fill: `h
p.panel.panel4..j.anchor: `n
p.panel.panel4..j.border: 1
p.panel.panel4..j.insets: 0 0 10 0
p.panel.panel4.choices..j.c:`panel
p.panel.panel4.choices..j.fill:`n
p.panel.panel4.choices..j.anchor:`e
p.panel.panel4.choices..j.border:0
p.panel.panel4.choices..j.insets:0 70 0 0
p.panel.panel4.choices..j.a: (`c1`Derivatives;`c2)
p.panel.panel4.choices.c1: "Value 1"
p.panel.panel4.choices.c1..j.c:`label
p.panel.panel4.choices.c1..j.anchor:`w
p.panel.panel4.choices.c1..j.insets:0 0 0 30
p.panel.panel4.choices.Derivatives: "Derivatives"
p.panel.panel4.choices.Derivatives..j.c:`label
p.panel.panel4.choices.Derivatives..j.anchor:`w
p.panel.panel4.choices.Derivatives..j.insets:0 0 0 30
p.panel.panel4.choices.c2: "Value 2"
p.panel.panel4.choices.c2..j.c:`label
p.panel.panel4.choices.c2..j.anchor:`w
p.panel.panel4.choices.c2..j.insets:0 0 0 30

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}

