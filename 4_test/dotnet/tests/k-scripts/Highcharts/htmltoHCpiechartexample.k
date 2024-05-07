\l common/k/env

p:.()
p..j.l:"Highcharts Pie Chart"
p..j.xy:800 400
p..j.c:`tab

/p.combo..j.l: "Combo:"
/p.combo..j.o: (0;1;2;3)
/p.combo..j.ol: ((0;1;2;3);`aaaa`bbbb`cccc`dddd)

htm:0:,/(`4:"cd"),"\\hccustompie.htm"
p.chart:-1 _ ,/htm,\:"\n"
p.chart..j.c:`html2
p.chart2:-1 _ ,/htm,\:"\n"
p.chart2..j.c:`html2


.j.Java{
  .j.c `p
}

p..j.close:{_exit 0}
p..j.z: {
  if[1~.k[`autoExit];_exit 0]
  }