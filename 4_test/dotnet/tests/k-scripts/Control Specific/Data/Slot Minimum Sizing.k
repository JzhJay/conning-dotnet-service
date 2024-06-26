/3 slots sets with different input types
/a given set must have all the same input type

p:.()
p..j.c:`panel
p..j.xy:300 510

p.tbSplit..j.c: `split
p.tbSplit..j.dir:`v

p.tbSplit.slot:.((`Type;`Stock;.())
  (`Repeats;`None;.()))

p.tbSplit.slot..j.cell:.((`Type
   .((`c;`combo;)
     (`o
      `Stock `Flow `Rate
      ))
   )
  (`Repeats
   .((`c;`combo;)
     (`o
      `Last `All `None
      )
     (`ol
      (`Last `All `None
       `"Repeat Last Path" `"Repeat All Paths" `"Unspecified Paths are Zero")
      ))
   ))

p.tbSplit.right:!10
p.tbSplit.right..j.c:`vector

.j.Java {
  if[`p _in !.k; .j.c`p]
}

p..j.z: {
 / Comment this out/in to see autosize behavior
/ p..j.xy:: 400 200

 if[1~.k[`autoExit]; _exit 0]
}
p..j.close:{_exit 0}
