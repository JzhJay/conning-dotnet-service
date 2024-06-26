p: .()
p..j.c: `panel
p..j.border: 1   // to give room for layout helpers
p..j.l: "Spanning"
p..j.a: ((`p1`p2`p3)
		 (`p4`p5`p6)
		 (`p7`p8`p9))
p..j.xy: (750;750)


p.p1..j.c: `panel
p.p1..j.l: "Combo spans 2"
p.p1..j.a: ((`combo`combo)
			(`checkbox`radioPanel))

p.p1.combo: 0
p.p1.combo..j.l: "`combo:"
p.p1.combo..j.o: (0;1;2;3)
p.p1.combo..j.ol: ((0;1;2;3);`"Item 1"`"Item 2"`"Item 3"`"Item 4")

p.p1.checkbox: 0
p.p1.checkbox..j.c:`check
p.p1.checkbox..j.l: "`check:"

p.p1.radioPanel..j.c: `panel
p.p1.radioPanel..j.l: "`radiobutton:"

p.p1.radioPanel.radio1:1
p.p1.radioPanel.radio1..j.c: `radiobutton
p.p1.radioPanel.radio1..j.l: "First"
p.p1.radioPanel.radio1..j.group: `group1

p.p1.radioPanel.radio2:0
p.p1.radioPanel.radio2..j.c: `radiobutton
p.p1.radioPanel.radio2..j.l: "Second"
p.p1.radioPanel.radio2..j.group: `group1

p.p1.radioPanel.radio3:0
p.p1.radioPanel.radio3..j.c: `radiobutton
p.p1.radioPanel.radio3..j.l: "Third"
p.p1.radioPanel.radio3..j.group: `group1


p.p2..j.c: `panel
p.p2..j.l: "Combo spans 3, radio spans 2"
p.p2..j.a: ((`combo`combo`combo)
			(`checkbox`radioPanel`radioPanel))

p.p2.combo: 0
p.p2.combo..j.l: "`combo:"
p.p2.combo..j.o: (0;1;2;3)
p.p2.combo..j.ol: ((0;1;2;3);`"Item 1"`"Item 2"`"Item 3"`"Item 4")

p.p2.checkbox: 0
p.p2.checkbox..j.c:`check
p.p2.checkbox..j.l: "`check:"

p.p2.radioPanel..j.c: `panel
p.p2.radioPanel..j.l: "`radiobutton:"

p.p2.radioPanel.radio1:1
p.p2.radioPanel.radio1..j.c: `radiobutton
p.p2.radioPanel.radio1..j.l: "First"
p.p2.radioPanel.radio1..j.group: `group1

p.p2.radioPanel.radio2:0
p.p2.radioPanel.radio2..j.c: `radiobutton
p.p2.radioPanel.radio2..j.l: "Second"
p.p2.radioPanel.radio2..j.group: `group1

p.p2.radioPanel.radio3:0
p.p2.radioPanel.radio3..j.c: `radiobutton
p.p2.radioPanel.radio3..j.l: "Third"
p.p2.radioPanel.radio3..j.group: `group1


p.p3..j.c: `panel
p.p3..j.l: "Combo spans 3, checkbox spans 2"
p.p3..j.a: ((`combo`combo`combo)
			(`checkbox`checkbox`radioPanel))

p.p3.combo: 0
p.p3.combo..j.l: "`combo:"
p.p3.combo..j.o: (0;1;2;3)
p.p3.combo..j.ol: ((0;1;2;3);`"Item 1"`"Item 2"`"Item 3"`"Item 4")

p.p3.checkbox: 0
p.p3.checkbox..j.c:`check
p.p3.checkbox..j.l: "`check:"

p.p3.radioPanel..j.c: `panel
p.p3.radioPanel..j.l: "`radiobutton:"

p.p3.radioPanel.radio1:1
p.p3.radioPanel.radio1..j.c: `radiobutton
p.p3.radioPanel.radio1..j.l: "First"
p.p3.radioPanel.radio1..j.group: `group1

p.p3.radioPanel.radio2:0
p.p3.radioPanel.radio2..j.c: `radiobutton
p.p3.radioPanel.radio2..j.l: "Second"
p.p3.radioPanel.radio2..j.group: `group1

p.p3.radioPanel.radio3:0
p.p3.radioPanel.radio3..j.c: `radiobutton
p.p3.radioPanel.radio3..j.l: "Third"
p.p3.radioPanel.radio3..j.group: `group1



p.p4..j.c: `panel
p.p4..j.l: "Combo spans 2"
p.p4..j.a: ((`combo`radioPanel)
			(`checkbox`radioPanel))

p.p4.combo: 0
p.p4.combo..j.l: "`combo:"
p.p4.combo..j.o: (0;1;2;3)
p.p4.combo..j.ol: ((0;1;2;3);`"Item 1"`"Item 2"`"Item 3"`"Item 4")

p.p4.checkbox: 0
p.p4.checkbox..j.c:`check
p.p4.checkbox..j.l: "`check:"

p.p4.radioPanel..j.c: `panel
p.p4.radioPanel..j.l: "`radiobutton:"

p.p4.radioPanel.radio1:1
p.p4.radioPanel.radio1..j.c: `radiobutton
p.p4.radioPanel.radio1..j.l: "First"
p.p4.radioPanel.radio1..j.group: `group1

p.p4.radioPanel.radio2:0
p.p4.radioPanel.radio2..j.c: `radiobutton
p.p4.radioPanel.radio2..j.l: "Second"
p.p4.radioPanel.radio2..j.group: `group1

p.p4.radioPanel.radio3:0
p.p4.radioPanel.radio3..j.c: `radiobutton
p.p4.radioPanel.radio3..j.l: "Third"
p.p4.radioPanel.radio3..j.group: `group1


p.p5..j.c: `panel
p.p5..j.l: "Combo spans 3, radio spans 2"
p.p5..j.a: ((`combo`radioPanel)
			(`checkbox`radioPanel)
			(`checkbox`radioPanel))

p.p5.combo: 0
p.p5.combo..j.l: "`combo:"
p.p5.combo..j.o: (0;1;2;3)
p.p5.combo..j.ol: ((0;1;2;3);`"Item 1"`"Item 2"`"Item 3"`"Item 4")

p.p5.checkbox: 0
p.p5.checkbox..j.c:`check
p.p5.checkbox..j.l: "`check:"

p.p5.radioPanel..j.c: `panel
p.p5.radioPanel..j.l: "`radiobutton:"

p.p5.radioPanel.radio1:1
p.p5.radioPanel.radio1..j.c: `radiobutton
p.p5.radioPanel.radio1..j.l: "First"
p.p5.radioPanel.radio1..j.group: `group1

p.p5.radioPanel.radio2:0
p.p5.radioPanel.radio2..j.c: `radiobutton
p.p5.radioPanel.radio2..j.l: "Second"
p.p5.radioPanel.radio2..j.group: `group1

p.p5.radioPanel.radio3:0
p.p5.radioPanel.radio3..j.c: `radiobutton
p.p5.radioPanel.radio3..j.l: "Third"
p.p5.radioPanel.radio3..j.group: `group1


p.p6..j.c: `panel
p.p6..j.l: "Top row redundant"
p.p6..j.a: ((`combo`radioPanel)
			(`combo`radioPanel)
			(`checkbox`radioPanel))

p.p6.combo: 0
p.p6.combo..j.l: "`combo:"
p.p6.combo..j.o: (0;1;2;3)
p.p6.combo..j.ol: ((0;1;2;3);`"Item 1"`"Item 2"`"Item 3"`"Item 4")

p.p6.checkbox: 0
p.p6.checkbox..j.c:`check
p.p6.checkbox..j.l: "`check:"

p.p6.radioPanel..j.c: `panel
p.p6.radioPanel..j.l: "`radiobutton:"

p.p6.radioPanel.radio1:1
p.p6.radioPanel.radio1..j.c: `radiobutton
p.p6.radioPanel.radio1..j.l: "First"
p.p6.radioPanel.radio1..j.group: `group1

p.p6.radioPanel.radio2:0
p.p6.radioPanel.radio2..j.c: `radiobutton
p.p6.radioPanel.radio2..j.l: "Second"
p.p6.radioPanel.radio2..j.group: `group1

p.p6.radioPanel.radio3:0
p.p6.radioPanel.radio3..j.c: `radiobutton
p.p6.radioPanel.radio3..j.l: "Third"
p.p6.radioPanel.radio3..j.group: `group1




p.p7..j.c: `panel
p.p7..j.l: "Bottom row redundant"
p.p7..j.a: ((`radioPanel`combo)
			(`radioPanel`checkbox)
			(`radioPanel`checkbox))

p.p7.combo: 0
p.p7.combo..j.l: "`combo:"
p.p7.combo..j.o: (0;1;2;3)
p.p7.combo..j.ol: ((0;1;2;3);`"Item 1"`"Item 2"`"Item 3"`"Item 4")

p.p7.checkbox: 0
p.p7.checkbox..j.c:`check
p.p7.checkbox..j.l: "`check:"

p.p7.radioPanel..j.c: `panel
p.p7.radioPanel..j.l: "`radiobutton:"

p.p7.radioPanel.radio1:1
p.p7.radioPanel.radio1..j.c: `radiobutton
p.p7.radioPanel.radio1..j.l: "First"
p.p7.radioPanel.radio1..j.group: `group1

p.p7.radioPanel.radio2:0
p.p7.radioPanel.radio2..j.c: `radiobutton
p.p7.radioPanel.radio2..j.l: "Second"
p.p7.radioPanel.radio2..j.group: `group1

p.p7.radioPanel.radio3:0
p.p7.radioPanel.radio3..j.c: `radiobutton
p.p7.radioPanel.radio3..j.l: "Third"
p.p7.radioPanel.radio3..j.group: `group1


p.p8..j.c: `panel
p.p8..j.l: "Radio spans 2x2 in upper right"
p.p8..j.a: ((`combo`radioPanel`radioPanel)
			(`checkbox`radioPanel`radioPanel)
			(`checkbox`checkbox2`checkbox3))

p.p8.combo: 0
p.p8.combo..j.l: "`combo:"
p.p8.combo..j.o: (0;1;2;3)
p.p8.combo..j.ol: ((0;1;2;3);`"Item 1"`"Item 2"`"Item 3"`"Item 4")

p.p8.checkbox: 0
p.p8.checkbox..j.c:`check
p.p8.checkbox..j.l: "`check:"

p.p8.checkbox2: 0
p.p8.checkbox2..j.c:`check
p.p8.checkbox2..j.l: "`check:"

p.p8.checkbox3: 0
p.p8.checkbox3..j.c:`check
p.p8.checkbox3..j.l: "`check:"

p.p8.radioPanel..j.c: `panel
p.p8.radioPanel..j.l: "`radiobutton:"

p.p8.radioPanel.radio1:1
p.p8.radioPanel.radio1..j.c: `radiobutton
p.p8.radioPanel.radio1..j.l: "First"
p.p8.radioPanel.radio1..j.group: `group1

p.p8.radioPanel.radio2:0
p.p8.radioPanel.radio2..j.c: `radiobutton
p.p8.radioPanel.radio2..j.l: "Second"
p.p8.radioPanel.radio2..j.group: `group1

p.p8.radioPanel.radio3:0
p.p8.radioPanel.radio3..j.c: `radiobutton
p.p8.radioPanel.radio3..j.l: "Third"
p.p8.radioPanel.radio3..j.group: `group1


p.p9..j.c: `panel
p.p9..j.l: "Radio spans 2x2 in upper left"
p.p9..j.a: ((`radioPanel`radioPanel`combo)
			(`radioPanel`radioPanel`checkbox)
			(`checkbox2`checkbox3`checkbox))

p.p9.combo..j.c: `combo
p.p9.combo: 0
p.p9.combo..j.l: "`combo:"
p.p9.combo..j.o: (0;1;2;3)
p.p9.combo..j.ol: ((0;1;2;3);`"Item 1"`"Item 2"`"Item 3"`"Item 4")

p.p9.checkbox: 0
p.p9.checkbox..j.c:`check
p.p9.checkbox..j.l: "`check:"

p.p9.checkbox2: 0
p.p9.checkbox2..j.c:`check
p.p9.checkbox2..j.l: "`check:"

p.p9.checkbox3: 0
p.p9.checkbox3..j.c:`check
p.p9.checkbox3..j.l: "`check:"

p.p9.radioPanel..j.c: `panel
p.p9.radioPanel..j.l: "`radiobutton:"

p.p9.radioPanel.radio1:1
p.p9.radioPanel.radio1..j.c: `radiobutton
p.p9.radioPanel.radio1..j.l: "First"
p.p9.radioPanel.radio1..j.group: `group1

p.p9.radioPanel.radio2:0
p.p9.radioPanel.radio2..j.c: `radiobutton
p.p9.radioPanel.radio2..j.l: "Second"
p.p9.radioPanel.radio2..j.group: `group1

p.p9.radioPanel.radio3:0
p.p9.radioPanel.radio3..j.c: `radiobutton
p.p9.radioPanel.radio3..j.l: "Third"
p.p9.radioPanel.radio3..j.group: `group1


.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
