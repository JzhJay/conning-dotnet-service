p: .()
p..j.c: `panel
p..j.l: "KMatrix Test"
p..j.xy: (700;600)
p..j.loc: (200;50)

/Combo
p.combo: 1
p.combo..j.l: "Matrix Complexity:"
p.combo..j.o: (0;1;2;3;4)
p.combo..j.ol: ((0;1;2;3;4);`"Small - 3 x 3"`"Medium - 50 x 30"`"Big - 1000 x 50"`"Huge - 10,000 x 500"`"Gigantic - 100,000 x 1,000")

CreateMatrix: {[rows;cols](cols;rows)#!cols*rows}
p.combo..j.t: {
	:[p.combo=0;p.matrix::CreateMatrix[3;3]]
	:[p.combo=1;p.matrix::CreateMatrix[50;30]]
	:[p.combo=2;p.matrix::CreateMatrix[1000;50]]
	:[p.combo=3;p.matrix::CreateMatrix[10000;500]]
	:[p.combo=4;p.matrix::CreateMatrix[100000;1000]] }

p.matrix..j.l: `"Result:"
p.matrix..j.c: `matrix

p.combo..j.t[]

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
