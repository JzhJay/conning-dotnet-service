p: .()
p..j.c: `panel
p..j.l: "Spanning 2.k"
p..j.a: ,(`p1`p2)
p..j.xy: (550;300)

p.p1..j.c:`panel
p.p1..j.l:"Scalars should be horizontally centered"
p.p1..j.a:(`min`max;`speed`speed)

p.p1.min: 0
p.p1.min..j.c:`scalar

p.p1.max: 0
p.p1.max..j.c:`scalar

p.p1.speed..j.c:`panel
p.p1.speed..j.border:1


p.p2..j.c:`panel
p.p2..j.l:"Scalars should be vertically centered"
p.p2..j.a:(`speed`min;`speed`max)

p.p2.min: 0
p.p2.min..j.c:`scalar
p.p2.min..j.anchor: `w

p.p2.max: 0
p.p2.max..j.c:`scalar
p.p2.max..j.anchor: `w

p.p2.speed..j.c:`panel
p.p2.speed..j.border:1

.j.Java {
  .j.c`p
}
p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}
