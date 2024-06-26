p..j.c: `panel
p..j.l: "Layout"
p..j.xy: (550;750)

p.panel..j.c: `panel
p.panel..j.l: "Outer panel"


p.panel.panel1..j.c: `panel
p.panel.panel1..j.l: "Panel 1"
p.panel.panel1..j.a: ,`panel11`panel12

p.panel.panel1.panel11..j.c: `panel
p.panel.panel1.panel11..j.l: "Panel 1.1: contents within should be vertically centered"

p.panel.panel1.panel11.p1..j.c: `panel
p.panel.panel1.panel11.p1..j.wy: 0.0
p.panel.panel1.panel11.p1..j..fill: `h
p.panel.panel1.panel11.p1..j.anchor: `n
p.panel.panel1.panel11.p1..j.border: 1
p.panel.panel1.panel11.p1.label: "Hello"

p.panel.panel1.panel11.p2..j.c: `panel
p.panel.panel1.panel11.p2..j.wy: 0.0
p.panel.panel1.panel11.p2..j..fill: `h
p.panel.panel1.panel11.p2..j.anchor: `n
p.panel.panel1.panel11.p2..j.border:1
p.panel.panel1.panel11.p2..j.insets:0 0 10 0
p.panel.panel1.panel11.p2.label: "My"
p.panel.panel1.panel11.p2.choices..j.c:`panel
p.panel.panel1.panel11.p2.choices..j.fill:`n
p.panel.panel1.panel11.p2.choices..j.anchor:`w
p.panel.panel1.panel11.p2.choices..j.border:0
p.panel.panel1.panel11.p2.choices..j.insets:0 70 0 0
p.panel.panel1.panel11.p2.choices..j.a: (`LPI_Swaps`Derivatives;`Recalibration)
p.panel.panel1.panel11.p2.choices.LPI_Swaps: "LPI Swaps"
p.panel.panel1.panel11.p2.choices.LPI_Swaps..j.c:`label
p.panel.panel1.panel11.p2.choices.LPI_Swaps..j.anchor:`w
p.panel.panel1.panel11.p2.choices.LPI_Swaps..j.insets:0 0 0 30
p.panel.panel1.panel11.p2.choices.Derivatives: "Derivatives"
p.panel.panel1.panel11.p2.choices.Derivatives..j.c:`label
p.panel.panel1.panel11.p2.choices.Derivatives..j.anchor:`w
p.panel.panel1.panel11.p2.choices.Derivatives..j.insets:0 0 0 30
p.panel.panel1.panel11.p2.choices.Recalibration: "Recalibration"
p.panel.panel1.panel11.p2.choices.Recalibration..j.c:`label
p.panel.panel1.panel11.p2.choices.Recalibration..j.anchor:`w
p.panel.panel1.panel11.p2.choices.Recalibration..j.insets:0 0 0 30

p.panel.panel1.panel11.p3..j.c: `panel
p.panel.panel1.panel11.p3..j.wy: 0.0
p.panel.panel1.panel11.p3..j..fill: `h
p.panel.panel1.panel11.p3..j.anchor: `n
p.panel.panel1.panel11.p3..j.border: 1
p.panel.panel1.panel11.p3.label: "Darling"


p.panel.panel1.panel12..j.c: `panel
p.panel.panel1.panel12..j.l: "Panel 1.2: middle panel should expand to fill space"

p.panel.panel1.panel12.p1..j.c: `panel
p.panel.panel1.panel12.p1..j.wy: 0.0
p.panel.panel1.panel12.p1..j..fill: `h
p.panel.panel1.panel12.p1..j.anchor: `n
p.panel.panel1.panel12.p1..j.border: 1
p.panel.panel1.panel12.p1.label: "Hello"

p.panel.panel1.panel12.p2..j.c: `panel
p.panel.panel1.panel12.p2..j.wy: 1.0
p.panel.panel1.panel12.p2..j..fill: `h
p.panel.panel1.panel12.p2..j.anchor: `n
p.panel.panel1.panel12.p2..j.border:1
p.panel.panel1.panel12.p2..j.insets:0 0 10 0
p.panel.panel1.panel12.p2.label: "My"
p.panel.panel1.panel12.p2.choices..j.c:`panel
p.panel.panel1.panel12.p2.choices..j.fill:`n
p.panel.panel1.panel12.p2.choices..j.anchor:`w
p.panel.panel1.panel12.p2.choices..j.border:0
p.panel.panel1.panel12.p2.choices..j.insets:0 70 0 0
p.panel.panel1.panel12.p2.choices..j.a: (`LPI_Swaps`Derivatives;`Recalibration)
p.panel.panel1.panel12.p2.choices.LPI_Swaps: "LPI Swaps"
p.panel.panel1.panel12.p2.choices.LPI_Swaps..j.c:`label
p.panel.panel1.panel12.p2.choices.LPI_Swaps..j.anchor:`w
p.panel.panel1.panel12.p2.choices.LPI_Swaps..j.insets:0 0 0 30
p.panel.panel1.panel12.p2.choices.Derivatives: "Derivatives"
p.panel.panel1.panel12.p2.choices.Derivatives..j.c:`label
p.panel.panel1.panel12.p2.choices.Derivatives..j.anchor:`w
p.panel.panel1.panel12.p2.choices.Derivatives..j.insets:0 0 0 30
p.panel.panel1.panel12.p2.choices.Recalibration: "Recalibration"
p.panel.panel1.panel12.p2.choices.Recalibration..j.c:`label
p.panel.panel1.panel12.p2.choices.Recalibration..j.anchor:`w
p.panel.panel1.panel12.p2.choices.Recalibration..j.insets:0 0 0 30

p.panel.panel1.panel12.p3..j.c: `panel
p.panel.panel1.panel12.p3..j.wy: 0.0
p.panel.panel1.panel12.p3..j..fill: `h
p.panel.panel1.panel12.p3..j.anchor: `n
p.panel.panel1.panel12.p3..j.border: 1
p.panel.panel1.panel12.p3.label: "Darling"


p.panel.panel2..j.c: `panel
p.panel.panel2..j.l: "Panel 2: contents within should be vertically centered"

p.panel.panel2.p2..j.c: `panel
p.panel.panel2.p2..j.wy: 0.0
p.panel.panel2.p2..j..fill: `h
p.panel.panel2.p2..j.anchor: `n
p.panel.panel2.p2..j.border:1
p.panel.panel2.p2..j.insets:0 0 10 0
p.panel.panel2.p2.label: "My"
p.panel.panel2.p2.choices..j.c:`panel
p.panel.panel2.p2.choices..j.fill:`n
p.panel.panel2.p2.choices..j.anchor:`w
p.panel.panel2.p2.choices..j.border:0
p.panel.panel2.p2.choices..j.insets:0 70 0 0
p.panel.panel2.p2.choices.LPI_Swaps: "LPI Swaps"
p.panel.panel2.p2.choices.LPI_Swaps..j.c:`label
p.panel.panel2.p2.choices.LPI_Swaps..j.anchor:`w
p.panel.panel2.p2.choices.LPI_Swaps..j.insets:0 0 0 30
p.panel.panel2.p2.choices.Derivatives: "Derivatives"
p.panel.panel2.p2.choices.Derivatives..j.c:`label
p.panel.panel2.p2.choices.Derivatives..j.anchor:`w
p.panel.panel2.p2.choices.Derivatives..j.insets:0 0 0 30
p.panel.panel2.p2.choices.Recalibration: "Recalibration"
p.panel.panel2.p2.choices.Recalibration..j.c:`label
p.panel.panel2.p2.choices.Recalibration..j.anchor:`w
p.panel.panel2.p2.choices.Recalibration..j.insets:0 0 0 30


p.panel.label: "I should be centered vertically within my space."

p.panel.panel3..j.c: `panel
p.panel.panel3..j.wy: 0.0
p.panel.panel3..j.border: 0
p.panel.panel3.label2: "I should be flush against the bottom and left aligned with label above."
p.panel.panel3.label2..j.c: `label

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}

