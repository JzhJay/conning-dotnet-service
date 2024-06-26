p: .()
p..j.c: `panel
p..j.l: "Layout"
p..j.xy: (450;550)

p.p..j.c: `panel
p.p..j.wy: 0.5
p.p.panel..j.c: `panel
p.p.panel..j.wx: 0.0
p.p.panel..j.wy: .j.NoExtraSpace
p.p.panel..j.fill: `b
p.p.panel..j.anchor: `n
p.p.panel..j.l: "Vertical content"
p.p.panel.label: "My"
p.p.panel.choices..j.c:`panel
p.p.panel.choices..j.fill:`n
p.p.panel.choices..j.anchor:`w
p.p.panel.choices..j.border:0
p.p.panel.choices..j.insets:0 70 0 0
p.p.panel.choices.LPI_Swaps:1
p.p.panel.choices.LPI_Swaps..j.c:`check
p.p.panel.choices.LPI_Swaps..j.anchor:`w
p.p.panel.choices.LPI_Swaps..j.insets:0 0 0 30
p.p.panel.choices.Derivatives:1
p.p.panel.choices.Derivatives..j.c:`check
p.p.panel.choices.Derivatives..j.anchor:`w
p.p.panel.choices.Derivatives..j.insets:0 0 0 30
p.p.panel.choices.Recalibration:1
p.p.panel.choices.Recalibration..j.c:`check
p.p.panel.choices.Recalibration..j.anchor:`w
p.p.panel.choices.Recalibration..j.insets:0 0 0 30

p.p2..j.c: `panel
p.p2..j.wy: 0.5
p.p2.panel2..j.c: `panel
p.p2.panel2..j.wx: .j.NoExtraSpace
p.p2.panel2..j.wy: 0.0
p.p2.panel2..j.fill: `b
p.p2.panel2..j.anchor: `n
p.p2.panel2..j.l: "Horizontal content"
p.p2.panel2.label: "My"
p.p2.panel2.choices..j.c:`panel
p.p2.panel2.choices..j.fill:`n
p.p2.panel2.choices..j.anchor:`w
p.p2.panel2.choices..j.border:0
p.p2.panel2.choices..j.insets:0 70 0 0
p.p2.panel2.choices.LPI_Swaps:1
p.p2.panel2.choices.LPI_Swaps..j.c:`check
p.p2.panel2.choices.LPI_Swaps..j.anchor:`w
p.p2.panel2.choices.LPI_Swaps..j.insets:0 0 0 30
p.p2.panel2.choices.Derivatives:1
p.p2.panel2.choices.Derivatives..j.c:`check
p.p2.panel2.choices.Derivatives..j.anchor:`w
p.p2.panel2.choices.Derivatives..j.insets:0 0 0 30
p.p2.panel2.choices.Recalibration:1
p.p2.panel2.choices.Recalibration..j.c:`check
p.p2.panel2.choices.Recalibration..j.anchor:`w
p.p2.panel2.choices.Recalibration..j.insets:0 0 0 30


.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
