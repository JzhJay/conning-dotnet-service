/3 slots sets with different input types
/a given set must have all the same input type

p:.()
p..j.c:`panel
p..j.xy:530 640

p.toolbar..j.border:0
p.toolbar.ToggleVisibility:{p[`slot1.;j;`rv;`integer1]:~p[`slot1.;j;`rv;`integer1withaverylongname]}  / Flip the first slot item's visibility
p.toolbar.ToggleVisibility..j.l: "Toggle `integer1withaverylongname's row visibility (`rv)"

p.slot1.integer1:1
p.slot1..j.rv.integer1:1
p.slot1..j.rl.integer1:`"this is a long name:"
p.slot1.integer2:2000000
p.slot1.integer3:3
p.slot1..j.c:`slot
p.slot1..j.l:"`slot with integers:"
p.slot1..j.s: `integer2

p.slot2.text1:`"hi there" /note, text is represented by symbol, not character string
p.slot2..j.rl.text1:`"this is\na multi-line\nlabel"
p.slot2.text2:`"This is some pretty long text"
p.slot2.text3:`"I SHOULD NOT BE VISIBLE"
p.slot2..j.c:`slot
p.slot2..j.l:"Symbols:"

p.slot3.float1: 1.5
p.slot3.float2: 2.325
p.slot3..j.c:`slot
p.slot3..j.l:"Floats:"
p.slot3..j.s: `float1

p.slot4.float1: 1.5
p.slot4.combo1: `a
p.slot4..j.cell.combo1:  .(`c`combo;(`o;`a`b`c);(`ol;.(`a`"This is a very long line";`b`"combo1 - option 2";`c`"combo1 - option 3")))
p.slot4.combo2: `b
p.slot4..j.cell.combo2:  .(`c`combo;(`o;`a`b`c);(`ol;.(`a`Option1;`b`Option2;`c`option3)))
p.slot4..j.c:`slot
p.slot4..j.l:"Combobox:"
p.slot4..j.t: { .j.ok.i `"Combo changed" }

p.slot5.check1: 0
p.slot5.check2: 1
p.slot5.check3: 1

p.slot5..j.cell.check1:  .(`c`check;(`l;`"Unchecked at startup"))
p.slot5..j.cell.check2:  .(`c`check;(`l;`"Checked at startup"))
p.slot5..j.cell.check3.c:`check

p.slot5..j.c:`slot
p.slot5..j.l:"Checkboxes:"



/ .j.h `p.slot3
/ .j.s `p.slot3
/ .j.repaint `p
.j.Java {
  if[`p _in !.k; .j.c`p]
  /Make slot3 text3 invisible, need to do this after .j.c`p in order for it to take affect
  p[`slot2.;`j;`rv;`text3]: 0
}

p..j.z: {
 / Comment this out/in to see autosize behavior
/ p..j.xy:: 400 200

 if[1~.k[`autoExit]; _exit 0]
}
p..j.close:{_exit 0}
