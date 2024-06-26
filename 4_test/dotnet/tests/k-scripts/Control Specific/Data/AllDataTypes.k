dataDemoFrame: .()
dataDemoFrame..j.c: `panel
dataDemoFrame..j.l: "Data Types (`slot, `table, `pivot)"
dataDemoFrame..j.xy: (700;600)
dataDemoFrame..j.loc: (200;50)

\d dataDemoFrame

/3 slots sets with different input types
/a given set must have all the same input type
 
slotPanel:.()
slotPanel..j.c:`panel

\d slotPanel

slot1.integer1:1
slot1.integer2:2
slot1..j.c:`slot
slot1..j.l:"Integers:"

slot2.text1:`"hi there" /note, text is represented by symbol, not character string
slot2.text2:`"hello world"
slot2..j.c:`slot
slot2..j.l:"Symbols:"

slot3.float1: 1.5
slot3.float2: 2.325
slot3..j.c:`slot
slot3..j.l:"Floats:"

slot4.combo1: `a
slot4..j.cell.combo1:  .(`c`combo;(`o;`a`b`c);(`ol;.(`a`foo;`b`goo;`c`hoo)))
slot4.combo2: `b
slot4..j.cell.combo2:  .(`c`combo;(`o;`a`b`c);(`ol;.(`a`foo;`b`goo;`c`hoo)))
slot4..j.c:`slot
slot4..j.l:"Combobox:"
\d ^

slotPanel..j.a:(`slot1`slot2`slot3`slot4)

dynamicTablePanel: .()
dynamicTablePanel..j.c: `panel
dynamicTablePanel..j.l: "`table Test"

\d dynamicTablePanel

tableSizes: (4 4;2000 100;10000 500;25000 1000)

toolbar.button:{table..j[`e`bg;*!table]:(1;`w)}  / Make the first column editable/white
toolbar.button..j.l: "Make 1st Column Editable"

/ Selection Behavior Dropdowns

/ Selection Mode
cmbSelectionMode: 2
cmbSelectionMode..j.c: `combo
cmbSelectionMode..j.l: "Selection Mode:"
cmbSelectionMode..j.o: (0;1;2)
cmbSelectionMode..j.ol: ((0;1;2);`Column`Row`Cell)

/ Interval Selection Mode
cmbRowIntervalMode: 0
cmbRowIntervalMode..j.c: `combo
cmbRowIntervalMode..j.l: "Row Interval Selection Mode:"
cmbRowIntervalMode..j.o: (0;1;2)
cmbRowIntervalMode..j.ol: ((0;1;2);`"Single Interval"`"Single"`"Multiple Interval")

cmbColIntervalMode: 0
cmbColIntervalMode..j.c: `combo
cmbColIntervalMode..j.l: "Column Interval Selection Mode:"
cmbColIntervalMode..j.o: (0;1;2)
cmbColIntervalMode..j.ol: ((0;1;2);`"Single Interval"`"Single"`"Multiple Interval")

// Setup the trigger on the selection mode combos

\d ^
dynamicTablePanel[~`cmbSelectionMode`cmbRowIntervalMode`cmbColIntervalMode;`j;`t]: {
		dynamicTablePanel.table..j.selmode:(`c;`r;_n)[dynamicTablePanel.cmbSelectionMode]
		dynamicTablePanel.table..j.rsel:`i`s`m[dynamicTablePanel.cmbRowIntervalMode]
		dynamicTablePanel.table..j.csel:`i`s`m[dynamicTablePanel.cmbColIntervalMode]
	}
\d dynamicTablePanel

// Dropdown for table complexity
cmbTableComplexity: 1
cmbTableComplexity..j.c: `combo
cmbTableComplexity..j.l: "Table Complexity:"
cmbTableComplexity..j.o: (0;1;2;3)
cmbTableComplexity..j.ol: ((0;1;2;3);`"Small - 4 x 4"`"Medium - 2000 x 100"`"Large - 10,000 x 500"`"Huge - 25,000 x 1000")
cmbTableComplexity..j.async:1

table..j.l: `"Result:"
table..j.c: `table

cmbTableComplexity..j.t: {
	CreateTable: { [rows;cols]  .+( {`$"C_",$x}'(!cols);{x+(1+x)*!y}'[(!cols);rows]) }
	
	table:: CreateTable . (tableSizes)cmbTableComplexity;

	table..j.cl.C_0::"foo\nbar"

    table..j.c:: `null
	table..j[`e`bg;!table]:: (0;`n)
	table..j[`e;*+-1 2#!table]:: 1
    .table..j.c:: `table

	/ Zebra striping
	/table..j[`bg`fg]:: {@[_n;!x;:[;(#*x[])#y]]}[_d[table]'(`w`z;`z`w)

	cmbSelectionMode..j.t[]
}

cmbTableComplexity..j.t[]

\d ^
dynamicTablePanel..j.a: (`toolbar
		`cmbTableComplexity
		`cmbSelectionMode
		`cmbRowIntervalMode
		`cmbColIntervalMode
		`table)
\d ^

dataDemoFrame..j.a: (`slotPanel
			`dynamicTablePanel)

.j.Java {
   if[`dataDemoFrame _in !.k; .j.c`dataDemoFrame]
}
dataDemoFrame..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
