p: .()
p..j.c: `panel
p..j.l: "Vector Test"
p..j.xy: (1000;600)
p..j.loc: (200;50)
p..j.

p.tbSplit..j.c: `panel
/p.tbSplit..j.dir:`v

/ Sans Serif
p.tbSplit.v1:`$$!10000  // Symbols `"0" `"1"...
p.tbSplit.v1[0]: `"Withholding Tax Paid"  / g gets cutoff
p.tbSplit.v1..j.c:`vector
p.tbSplit.v1..j.font: `"Dialog 0 14"
p.tbSplit.v2..j.l:`"Courier (Sans Serif)"

/ Courier
p.tbSplit.v2:`$$!500  // Symbols `"0" `"1"...
p.tbSplit.v2[0]: `"Withholding Tax Paid"  / g gets cutoff
p.tbSplit.v2..j.c:`vector
p.tbSplit.v2..j.l:`"Courier (monospaced)"

/p.v1..j.popup.Action.HelloWorld: {.j.ok.I"Hello, world"}
/p.v1..j.popup..j.async: 2

/p.v2:2*!401
/p.v3:2*!801
/p.v4:2*!950
/p.v5:2*!1025
/p.v6:2*!1202
/p.v7:2*!1000
/p.v8:2*!200
/p.v9:2*!2
/p.v10:2*!42

/p..j.a: (`v1`v2`v3`v4`v5`v6`v7`v8`v9`v10
/         `v1`v2`v3`v4`v5`v6`v7`v8`v9`v10
/         `v1`v2`v3`v4`v5`v6`v7`v8`v9`v10
/         `v1`v2`v3`v4`v5`v6`v7`v8`v9`v10
/         `v1`v2`v3`v4`v5`v6`v7`v8`v9`v10
/         `v1`v2`v3`v4`v5`v6`v7`v8`v9`v10
/         `v1`v2`v3`v4`v5`v6`v7`v8`v9`v10
/         `v1`v2`v3`v4`v5`v6`v7`v8`v9`v10
/         `v1`v2`v3`v4`v5`v6`v7`v8`v9`v10
/         `v1`v2`v3`v4`v5`v6`v7`v8`v9`v10)

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
p..j.close:{_exit 0}
