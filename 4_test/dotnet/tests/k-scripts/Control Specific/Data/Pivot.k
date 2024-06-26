\l main\j\j

p: .()
p..j.c: `panel
p..j.l: "Pivot Table Test"
p..j.xy: (700;600)
p..j.loc: (200;50)

VerifyPivot:{[pvalues;pattributes] /VerifyPivot
 /Test a java GUI Pivot table to make sure its a valid table.  Returns 0 if good pivot table else returns various error codes
 rc:0 /default to good pivot table
 r:(^pattributes[`j;`ax][])1 /set r to the number of entries in the ax attribute
 m: "Pivot Error: Pivot table value rows don't equal the number of entries in pivot attribute ax."
 if[~r=#pvalues; rc:1; .j.e m]
 m: "Pivot Error: Pivot table ax attribute does not have correct number of unique values."
 if[~r=#?+pattributes[`j;`ax][]; rc:2; .j.e m]
 rc} /return the return code


/         pivot           a:pivot`v or (p;p.)     (matrix;row-labels;col-labels;row-axes;col-axes)

n: 250000

/ Pivot Values
p.Pivot..j.c:`pivot
// So that we get sort up and down in our context menu

classes:  `B`BB`BBB`"A with long name"`AA`AAA`Junk
economies:`"US with very long name"`AU`"GB with long name"`UK`GB`GU
times:2011 2012 2013 2014 2015 2016
paths:!1000
p.Pivot..j.ax[`"Path_With_Underscores"`Time`Class`Economy]:+,/paths,\:/:,/times,\:/:,/classes,/:\:economies


/ p.Pivot:!#p.Pivot..j.ax[`"Path_With_Underscores"]
nValues: #p.Pivot..j.ax[`"Path_With_Underscores"]

p.Pivot:(nValues _draw 1000) + (nValues _draw 0)
p.Pivot..j.f: 8.8

//p.Pivot..j.al:(`"Class"`"Economy (Long)"`"Time")

/ axis locations: rows, then columns
//p.Pivot..j.a:(`"Path_With_Underscores"`Time`Economy;0#`)
p.Pivot..j.a:(`Economy`Class`"Path_With_Underscores";`Time) /`Time)
/p.Pivot..j.a:(0#`;`"Path_With_Underscores")
p.Pivot..j.l: `"Pivot Table"

/p.Pivot..j.rclbg: .(`Time;n#`w)
/p.Pivot..j.ax.Time..j.bg[&(!n)!2]: `scrollbarblue		/ set even cells

/p.Pivot..j.bg: n # `w						/ set all cells to white
/p.Pivot..j.bg[&(!n)!2]: `r		/ set even cell backgrounds to off-color

p.Pivot..j.kk: { _n }  / .j.True / .j.Null

p..j.close:{_exit 0}

.j.Java {
  .j.c`p

  / Select a bunch of values
  .k.p.Pivot..j.s: !_(n%10)
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
