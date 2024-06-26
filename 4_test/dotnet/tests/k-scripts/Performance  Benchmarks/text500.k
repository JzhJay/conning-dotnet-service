items: 500

p:.()
p..j.c: `window
p..j.xy: (200;200)

p..j.close: {_exit 0}
p..j.l: `$($items)," Text Boxes"

labels: "TextBox",/:$!items
p: .+(`$labels;labels)
p[~`$labels;`j;`c]: `text

.j.Java {
  .j.c`p
}

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
