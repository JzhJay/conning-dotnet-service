items: 500

p:.()
p..j.c: `window
p..j.xy: (200;200)
p..j.close: {_exit 0}
p..j.l: `$($items)," Buttons"

labels: "Button",/:$!items
p: .+(`$labels;items#{})
p[~`$labels;`j;`c]: `button

.j.Java {
  .j.c`p
}

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
