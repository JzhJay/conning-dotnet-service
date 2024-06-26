items: 5

p:.()
p..j.c: `panel
p..j.close: {_exit 0}
p..j.xy: 800 350

p.pivot: (1.2*!items) 	/Pivot data
p.pivot..j.l: `$($items)," Values x 2 Axes Pivot Table"
p.pivot..j.c: `Pivot_
p.pivot..j.ax.FTime:`$"f",'$!items /Axis values for FTime data
p.pivot..j.ax.Path: !items /Axis values for Path data
p.pivot..j.a:(,`FTime;,`Path) / axis locations: rows, then columns

.j.Java {
  .j.c`p
}

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
