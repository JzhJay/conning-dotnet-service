p..j.c: `panel
p..j.l: "Cross with middleground color"
p..j.xy: (1200,250)
p..j.a: ((`p1`p2`p3`p4`p5`p6)
		 (`q1`q2`q3`q4`q5`q6))


p.p1..j.c: `panel
p.p1..j.l: "mg:`r"
p.p1.cross[`f`g`h;`i`j]:3 2#!6
p.p1.cross..j.mg:`r

p.p2..j.c: `panel
p.p2..j.l: "bg:`g"
p.p2.cross[`f`g`h;`i`j]:3 2#!6
p.p2.cross..j.bg:`g

p.p3..j.c: `panel
p.p3..j.l: "mg:`r, bg:`g"
p.p3.cross[`f`g`h;`i`j]:3 2#!6
p.p3.cross..j.mg:`r
p.p3.cross..j.bg:`g

p.p4..j.c: `panel
p.p4..j.l: "mg:`r (no border)"
p.p4.cross[`f`g`h;`i`j]:3 2#!6
p.p4.cross..j.mg:`r
p.p4.cross..j.border: 0

p.p5..j.c: `panel
p.p5..j.l: "bg:`g (no border)"
p.p5.cross[`f`g`h;`i`j]:3 2#!6
p.p5.cross..j.bg:`g
p.p5.cross..j.border: 0

p.p6..j.c: `panel
p.p6..j.l: "mg:`r, bg:`g (no border)"
p.p6.cross[`f`g`h;`i`j]:3 2#!6
p.p6.cross..j.mg:`r
p.p6.cross..j.bg:`g
p.p6.cross..j.border: 0


p.q1..j.c: `panel
p.q1..j.l: "mg:`r"
p.q1.scalar: 0
p.q1.scalar..j.mg:`r

p.q2..j.c: `panel
p.q2..j.l: "bg:`g"
p.q2.scalar: 0
p.q2.scalar..j.bg:`g

p.q3..j.c: `panel
p.q3..j.l: "mg:`r, bg:`g"
p.q3.scalar: 0
p.q3.scalar..j.mg:`r
p.q3.scalar..j.bg:`g

p.q4..j.c: `panel
p.q4..j.l: "mg:`r (no border)"
p.q4.scalar: 0
p.q4.scalar..j.mg:`r
p.q4.scalar..j.border: 0

p.q5..j.c: `panel
p.q5..j.l: "bg:`g (no border)"
p.q5.scalar: 0
p.q5.scalar..j.bg:`g
p.q5.scalar..j.border: 0

p.q6..j.c: `panel
p.q6..j.l: "mg:`r, bg:`g (no border)"
p.q6.scalar: 0
p.q6.scalar..j.mg:`r
p.q6.scalar..j.bg:`g
p.q6.scalar..j.border: 0


.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
