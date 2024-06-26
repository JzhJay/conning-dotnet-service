/ Copyright (c) 2005-2012 Conning Services (Ireland) Limited
/ Jay Sacco

\l main\j\j

p: .()
p..j.c: `panel
p..j.close:{_exit 0}

/One column editable Table
rows: 275
p.table: .+(,`col1;,!rows)
p.table..j.l: `"Large Editable Table"
p.table..j.c: `table

.j.Java {
  .j.c`p
}

