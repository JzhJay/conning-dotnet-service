\l main\j\j

p: .()
p..j.c: `panel
p..j.l: "Modal Dialog Test"
p..j.close:{_exit 0}

p.button:{.j.c`modal}
p.button..j.async: 1
p.button..j.l: "Show modal dialog"

modal: .()
modal..j.c:`panel
modal..j.modal:1
modal.v:!10
modal.v1:!10
modal.ok:{.j.d`modal}
modal.cancel:{.j.d`modal}

modal.ok..j.c:`button
modal.cancel..j.c:`button
modal..j.loc:100 100

p2: .()
p2..j.c: `panel
p2..j.l: "2nd window"
p2..j.loc: 300 0
p2.v: !10

.j.Java {
  .j.c`p
  .j.c`p2
}
p..j.z: {
  /Wait for p2 to be shown
  while[~.j.showing `p2
    .u.sleep[500]
  ]
 if[1~.k[`autoExit]; _exit 0]
}
