p: .()
p..j.c: `panel
p..j.l: "Pivot Table Test"
p..j.xy: (700;600)
p..j.loc: (200;50)

n:4000

p.Pivot:n _draw 0
p.Pivot..j.c: `Pivot_
p.Pivot..j.ax.EconomyLongName:n#,/10#'`AU`CA`CH`DE`DK`GB`JP`NO`SE`US
p.Pivot..j.ax.Type:n#,/100#'`"Annualized"`"Level"`"Trailing_YOY"
p.Pivot..j.ax.Path:n#!10
p.Pivot..j.a:(,`Path;`EconomyLongName`Type)
p.Pivot..j.f:n#9.6
p.Pivot..j.rclfont:`"Dialog 0 12"

scale:&p.Pivot..j.ax.Type=`Trailing_YOY
p.Pivot[scale]*:100000000
p.Pivot..j.f[scale]:12.2

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
p..j.close:{_exit 0}
