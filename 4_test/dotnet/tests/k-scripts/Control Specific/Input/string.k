\l main\j\j

p: .()
p..j.c: `panel
p..j.xy: 400 500
p..j.close:{_exit 0}

p.string.chkSave: 0
p.string.chkSave..j[`c`l]: (`check;`"`save")
p.string.chkSave..j.t:{p[`string;`string.;`j;`save]::.[`;.j.v]}

p.string.chkEditable: 1
p.string.chkEditable..j[`c`l]: (`check;`"`e")
p.string.chkEditable..j.t:{p[`string;`string.;`j;`e]::.[`;.j.v]}

p.string.string: "Initial Value"
p.string.string..j.l: `"`string"

p.string..j.c:`panel
p.string..j.a:(`string`string
	`chkSave`chkEditable)

p.string2: "`string2 Initial Value"
p.string2..j.l: `"`string 2 (unaffected by option checkboxes, ..j.save is unset)"
p.string2..j.c: `string

.j.Java {
  .j.c`p
}

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}

