/3 slots sets with different input types
/a given set must have all the same input type

p:.()
p..j.c:`panel
p..j.l:`"`scalar test"
/p..j.xy:400 200

p.scalar1: 1112312321
p.scalar1.: .,(`j
   .((`c;`scalar;)
     (`halign;`l;)
     (`fill;`h;)
     (`f;10.0;)
     (`s;();.()))
   )

p.scalar2: 1000
p.scalar2.: .,(`j
   .((`c;`scalar;)
     (`halign;`l;)
     (`fill;`h;)
     (`f;10.0;)
     (`s;();.()))
   )


p.readonlyScalar: 1000
p.readonlyScalar.: .,(`j
   .((`c;`scalar;)
     (`halign;`l;)
     (`fill;`h;)
     (`f;10.0;)
     (`e;0;)
     (`bg;`n;))
   )

p.p:.()
p.p..j.c:`panel
p.p..j.border:0
p.p.label: "label:"
p.p.label..j.wx:.j.NoExtraSpace
p.p.label..j.valign:`m

p.p.scalar: 100
p.p.scalar..j.border:0

.j.Java {
  if[`p _in !.k; .j.c`p]
}

p..j.z: {
 / Comment this out/in to see autosize behavior
/ p..j.xy:: 400 200

 if[1~.k[`autoExit]; _exit 0]
}
p..j.close:{_exit 0}
