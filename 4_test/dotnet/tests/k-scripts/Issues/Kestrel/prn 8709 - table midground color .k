
\l main\j\j
\l main/i/shown
.k.PROGRESS..j.killpids:_n

p: .()
p..j.c: `panel
rows: 20
p.table: .+(`col1`col2`col3;(1.0*!rows;2.0*!rows;5.0*!rows))
p.table..j.l: `"Large Editable Table"
p.table..j.c: `Table
.j.c`p

p.table..j.mg: `y /should see yellow around the table

.j.Java {
  .j.c`p
}
