p..j.c: `panel

p.check: 0
p.label: "a label"

p.button: {
	p.check..j.font:: `"Courier 0 15"
	p.check..j.lfont:: `"Courier 0 25"
	p.check..j.l:: "Re-check"
	p.label..j.font:: `"Courier 0 25"
	p.label:: "another label"
	p.button..j.lfont:: `"Courier 0 25"
	p.button..j.l:: "Does nothing"
}

p.button..j.l: "Change font"
p.button..j.fill: `n

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
