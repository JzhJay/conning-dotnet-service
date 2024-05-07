items: 500

p:.()
p..j.c: `window
p..j.xy: (200;200)

p..j.close: {_exit 0}

p.items..j.l: `$($items)," Slots"
p.items: .+(`$"Slot",/:$!items;!items)
p.items..j.c:`slot

.j.Java {
  .j.c`p
}

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
