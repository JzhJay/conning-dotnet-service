rows: 500
cols: 500

p:.()
p..j.c: `window
p..j.xy: (200;200)

p..j.close: {_exit 0}
p.table: .+(`$"Col",/:$!cols;(cols#(,1.0*!rows)))
p.table..j.l: `$($rows)," Rows x ",($cols)," Columns Table"
p.table..j.c: `table

.j.Java {
  .j.c`p
}

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
