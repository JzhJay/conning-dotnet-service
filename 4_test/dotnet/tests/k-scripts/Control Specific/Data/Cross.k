\l main\j\j

p: .()
p..j.c: `panel
p..j.l: "KCross Test"
p..j.xy: (700;600)
p..j.loc: (200;50)
p..j.close:{_exit 0}


/Combo
p.combo: 1
p.combo..j.l: "Cross Complexity:"
p.combo..j.o: (0;1;2;3;4)
p.combo..j.ol: ((0;1;2;3;4);`"Small - 3 x 3"`"Medium - 500 x 100"`"Big - 10000 x 250"`"Huge - 10,000 x 500"`"Gigantic - 100,000 x 1,000")

CreateCross: {[rows;cols]
				cross:_n
				cross[`$"C_",/:$!cols;`$"R_",/:$!rows]:(cols;rows)#!cols*rows

				cross}

p.combo..j.t: {
	:[p.combo=0;p.cross::CreateCross[3;3]]
	:[p.combo=1;p.cross::CreateCross[500;100]]
	:[p.combo=2;p.cross::CreateCross[10000;250]]
	:[p.combo=3;p.cross::CreateCross[10000;500]]
	:[p.combo=4;p.cross::CreateCross[100000;1000]] }

p.cross..j.l: `"Result:"
p.cross..j.c: `cross

p.combo..j.t[]

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
