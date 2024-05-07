\l main\j\j

p: .()
p..j.c: `panel
p..j.xy: 400 500
p..j.close:{_exit 0}

p.text.chkSave: 1
p.text.chkSave..j[`c`l]: (`check;`"`save")
p.text.chkSave..j.t:{p[`text;`text.;`j;`save]::.[`;.j.v]}

p.text.chkEditable: 1
p.text.chkEditable..j[`c`l]: (`check;`"`e")
p.text.chkEditable..j.t:{p[`text;`text.;`j;`e]::.[`;.j.v]}

p.text.text: "Initial Value"
p.text.text..j.l: `"`text"
p.text.text..j.save: p.text.chkSave

p.text..j.c:`panel
p.text..j.a:(`text`text
	`chkSave`chkEditable)

p.text2: "`text2 Initial Value"
p.text2..j.l: `"`text 2 (unaffected by option checkboxes, ..j.save:0)"
p.text2..j.c: `text

.j.Java {
  .j.c`p
}

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}

