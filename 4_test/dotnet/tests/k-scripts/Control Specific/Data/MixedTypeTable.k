//  'cell' is defined for scalar, vector, matrix, slot, table, and cross.
//  c = v..j.cell can be _n or a single dictionary of depth 1 (e.g. .,`c`check or .+(`c`o;(`combo;`a`b`c))
//  for vector, c can be a list of cells
//  for matrix, c can be a matrix of cells or a list l of cells s.t. (#l) = #matrix
//  for slot, c can be a slot of cells s.t. !c is a subset of !slot
//  for table, c can be a slot of cells or a table of cells s.t. !c is a subset of !table
//  for cross, c can be a slot of cells s.t. !c is a subset of !cross, or a cross of cells (etc.)

//  cell                                                          value
//  ----                                                          -----
//  .,`c`text                                                     anything
//  .(`c`combo;(`o;`a`b`c);(`ol;.(`a`foo;`b`goo;`c`hoo)))         in `a`b`c (ol optional)
//  .,`c`check                                                    bool
//  .(`c`check;(`l;"text" or `text))                              bool
//  .,`c`image                                                    `"xyz.gif" | `"xyz.jpg"
//  .(`c`image;(`l;"text" or `text)))                             `"xyz.gif" | `"xyz.jpg"


p: .()
p..j.c: `panel
p..j.l: "Mixed Cell Types"
p..j.xy: (600;300)

\d p

CreateTable: { [rows;cols]  .+( {`$"C_",$x}'(!cols);{x+!y}'[(3*!cols);rows]) }
CreateTable..j.c: `null

mixedTable: CreateTable[3;5]
mixedTable..j.csel: `m
mixedTable..j.editor: 1

/ Text
mixedTable[`C_0]: `"String Data"`"String Data"`"String Data"

/ Numeric - currently marked in jk as a `text cell which is validated by K
mixedTable[`C_1]: 10 15 20

/ Checkbox
mixedTable[`C_2]: 0 1 0
mixedTable..j.cell[`C_2;`c]: `check
/mixedTable..j.cell[`C_2;`l]: ((0;1;2);`"Readonly"`"Check 2 2"`"Check 3")
mixedTable..j.e[`C_2]:0 1 1

/ Combobox
mixedTable[`C_3]:`a`b`b
mixedTable..j.cell[`C_3;`c`o`ol]: (`combo;`a`b`c;(`a`b`c;`"Choice 1"`"Choice 2"`"Super long Combobox Choice 3"))
mixedTable..j.e[`C_3]:1 0 1

/ Image
mixedTable[`C_4]:`"toolbarButtonGraphics/media/StepBack16.gif"`"toolbarButtonGraphics/media/StepBack16.gif"`"toolbarButtonGraphics/media/StepBack16.gif" /cell value(s) must be a list of symbol image path/names
mixedTable..j.cell[`C_4;`c`l]: (`image;"Image cell with label")

mixedTable..j.c: `table
mixedTable..j.border: 0
mixedTable..j.cl: .+(`C_0`C_1`C_2`C_3`C_4;`"Multi\nline"`"Simulation:\nGEMS Scenarios\nWeight Set:\nUniform\n[Double-click to edit]"`Col2`Col3`Col4)

\d ^
p..j.a:(`mixedTable)

p..j.close:{_exit 0}

.j.Java {
  if[`p _in !.k; .j.c`p]
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
