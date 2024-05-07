InitialTableComplexity: 1

options: ((5000 1;`"1-d - 5000 x 1")
	  (4 4;`"Small - 4 x 4")
	  (500 100;`"Medium - 500 x 100")
	  (500 2500;`"Medium (lots of columns) - 500 x 2500")
	  (1000 500;`"Large - 1,000 x 500")
	  (5000 1000;`"Huge - 2,000 x 1000"))
p: .()
p..j.c: `panel
p..j.l: "`table Test"
p..j.xy: (1200;800)

p.toolbar..j.border:0
p.toolbar.edit:{p[`table.;`j;`e`bg;*!.k.p.table]:(1;`w)}  / Make the first column editable/white
p.toolbar.edit..j.l: "Make 1st Column Editable"
p.toolbar.append:{.j.app.row[`.k.p.table;Prototype];FixRowCounts[p.table]}
p.toolbar.append..j.l: "Append Row"
p.toolbar.insert:{.j.ins.row[`.k.p.table;p.rowNum;Prototype];FixRowCounts[p.table]}
p.toolbar.insert..j.l: "Insert Row"
p.toolbar.delete:{if[#p.table[*!p.table];GrabPrototype[p.table];.j.del.row[`.k.p.table;p.rowNum+!p.numRows];FixRowCounts[p.table]]}
p.toolbar.delete..j.l: "Delete Row"
p.toolbar.scrollUp:{p[`table.;`j;`vscrollp]-:.05}
p.toolbar.scrollUp..j.l: "Scroll Up"
p.toolbar.scrollDown:{p[`table.;`j;`vscrollp]+:.05}
p.toolbar.scrollDown..j.l: "Scroll Down"

/ Number of rows to append / insert / delete.
p.rowNum: 0
p.rowNum..j.fill:`h
p.rowNum..j.l:"First row number to append / insert / delete"
p.rowNum..j.t:{FixRowCounts[p.table];GrabPrototype[p.table]}
p.numRows: 1
p.numRows..j.fill:`h
p.numRows..j.l:"Number of Rows to append / insert / delete"
p.numRows..j.t:{FixRowCounts[p.table];GrabPrototype[p.table]}

/ Table complexity dropdown
p.cmbTableComplexity: InitialTableComplexity
p.cmbTableComplexity..j.c: `combo
p.cmbTableComplexity..j.l: "Table Complexity:"
p.cmbTableComplexity..j.o: !#options
p.cmbTableComplexity..j.ol: (!#options;options[;1])
p.cmbTableComplexity..j.async:2

/ Selection Mode
p.cmbSelectionMode: 1
p.cmbSelectionMode..j.c: `combo
p.cmbSelectionMode..j.l: "Selection Mode:"
p.cmbSelectionMode..j.o: (0;1;2)
p.cmbSelectionMode..j.ol: ((0;1;2);`Column`Row`Cell)
p.cmbSelectionMode..j.t: { p[`table.;`j;`selmode]: (`c;`r;_n)[p[`cmbSelectionMode]] }

/ Interval Selection Mode
p.cmbRowIntervalMode: 0
p.cmbRowIntervalMode..j.c: `combo
p.cmbRowIntervalMode..j.l: "Row Interval Selection Mode:"
p.cmbRowIntervalMode..j.o: (0;1;2)
p.cmbRowIntervalMode..j.ol: ((0;1;2);`"Single Interval"`"Single"`"Multiple Interval")
p.cmbRowIntervalMode..j.t: { p[`table.;`j;`rsel]:`i`s`m[p[`cmbRowIntervalMode]] }

p.cmbColIntervalMode: 0
p.cmbColIntervalMode..j.c: `combo
p.cmbColIntervalMode..j.l: "Column Interval Selection Mode:"
p.cmbColIntervalMode..j.o: (0;1;2)
p.cmbColIntervalMode..j.ol: ((0;1;2);`"Single Interval"`"Single"`"Multiple Interval")
p.cmbColIntervalMode..j.t: { p[`table.;`j;`csel]:`i`s`m[p[`cmbColIntervalMode]] }

p.fixedColumns: 1
p.fixedColumns..j.l: `"Frozen Columns:"
p.fixedColumns..j.fill:`h
p.fixedColumns..j.t: { p[`table.;`j;`fixed]:: (#!p[`table]) & p[`fixedColumns] }

// todo: trigger min-max range
/p.fixedColumns..j.max:


CreateTable: { [rows;cols]  .+( {`$"C_",$(1+x)}'(!cols);{x+(x + 1)*(1+!y)}'[(!cols);rows]) }

// Select a cols x rows block of cells
 SelectBlockOfCells:{[rows;cols]
 	p[`table;j;s]:: ,/(cols#!p.table),/:\:(!rows)
 }

// When the table changes size, insure that the rowNum and numRows fields remain legal.
FixRowCounts:{[table]
  numRows:#table[*!table]
  if[#(p[`rowNum]+!p[`numRows])_dvl !numRows
    p[`rowNum]:0
    p[`numRows]:1]}


GrabPrototype:{ [x] if[#x[*!x];Prototype::x[;p[`rowNum]+!p[`numRows]]]}  / use this row during a delete / append

/////////////////////
// Recreate p.table table
/////////////////////
p.cmbTableComplexity..j.t: {
	.j.stop[]
	// Copy table's attribute dictionary to local
	j: p[`table.;`j]

	/ clear selection
	j[`s]: _n
	j[`a]: _n

	// Recreate locally
	table:CreateTable . options[;0][p[`cmbTableComplexity]]
	j[`cl;`C_1]:"Multi\nLine\n(with `tip)"
	j[`cltip;`C_1]: `"This is a tooltip"
	j[`clbg;`C_1]:`b
	j[`clfg;`C_1]:`w
	j[`hscrollp]:.0
	j[`vscrollp]:.0

	// Freeze columns.
	j[`fixed]: (#!table) & p[`fixedColumns]

	j[`popup;`Action;`Hello_World]: {.j.ok.I"Hello, world"}
	j[`popup.;`async]: 2
	/\0
	// Make some cells readonly
	/j[`e`bg;!.k.p.table]:(0;`n)
	/ Make some columns editable/white
	/.k.p.table..j[`e;*+-1 2#!p.table]:1
	/.k.p.table..j[`bg;*+-1 2#!p.table]:`w


	/ Zebra stripingote
	/.k.p.table..j[`bg`fg]:{@[_n;!x;:[;(#*x[])#y]]}[p.table]'(`w`z;`z`w)

	FixRowCounts[table]
	GrabPrototype[table]
	SelectBlockOfCells[InitiallySelectedCellRange]

	/p[`sliderFixedColumns.;`j;`max]:#!table

	// Null out existing global table
	p[`table.;`j;`c]: `null

	// Copy our table in
	p[`table`table.]:(table;.,(`j;j))

	/ Trigger our selection modes
	p[`cmbColIntervalMode.;`j;`t][]
	p[`cmbRowIntervalMode.;`j;`t][]
	p[`cmbSelectionMode.;`j;`t][]

	.j.flush[]
	.j.go[]
}


p.table..j.l: `"p.table:"
p.table..j.c: `table

p.cmbTableComplexity..j.t[]

p..j.a: (`toolbar`toolbar`toolbar`toolbar
	 `cmbTableComplexity`cmbSelectionMode`cmbRowIntervalMode`cmbColIntervalMode
	 `rowNum`numRows`fixedColumns`
	 `table`table`table`table)


.j.Java {
  .j.c`p
  GrabPrototype[p[`table]]
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}

p..j.close:{_exit 0}
