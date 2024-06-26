\l main\j\j

p..j.c: `panel
p..j.l: "`password Test"
p..j.border:0
p..j.wy:1.0

p.pwinput: "qwerty"
p.pwinput..j.l:`"GEMS TSDB Browser - Enter edit password (..j.save:0)"
p.pwinput..j.c:`password
p.pwinput..j.modal:1
p.pwinput..j.async:2
p.pwinput..j.anchor:`c

p.pwSave: "qwerty"
p.pwSave..j.l:`"..j.save: 1"
p.pwSave..j.c:`password
p.pwSave..j.modal:1
p.pwSave..j.async:2
p.pwSave..j.anchor:`c
p.pwSave..j.save:1


.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
