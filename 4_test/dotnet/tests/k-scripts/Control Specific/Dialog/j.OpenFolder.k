\l main\j\j

p: .()
p..j.c: `panel
p..j.close: {_exit 0}

p.OpenFolder: {res:: .j.Open `.k.TestChooser}
p.OpenFolder..j.c: `button
p.OpenFolder..j.async: 2

res:: ""

.j.Java {
  .j.c`p
}
TestChooser: .f.cd[]
TestChooser..j.filetype:`d
TestChooser..j.multiple: 1
TestChooser..j.l:"Chooser Folder"

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}

