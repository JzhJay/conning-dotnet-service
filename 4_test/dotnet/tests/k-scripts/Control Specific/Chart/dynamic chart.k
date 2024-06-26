gencolor:{0$,/{d: #x; ((3-d)#"0"),x}'$3 _draw 256}
p: .()
p..j.c: `panel
p..j.l: "`table Selection Tests"
p..j.xy: (1800;1000)
p..j.loc:(0;0)

p.toolbar..j.border:0
p.toolbar..j.fill:`n
p.toolbar..j.anchor:`w
p.toolbar.stop..j.image:"ps_32.png"
p.toolbar.stop..j.help:"Stop Updating Data"
p.toolbar.stop..j.c:`button
p.toolbar.stop..j.l:"Stop Updating Data"
p.toolbar.stop..j.async:2
p.toolbar.stop:{.u.setTimerEvent[0;`.k.doboth]}

p.tab..j.c:`tab
p.tab..j.border:0

p.tab.allocp..j.c:`panel
p.tab.allocp..j.l:"Allocation Panel for Chart and Label (Just has Chart for now)"
p.tab.allocp..j.a:`Chart

/p.tab.allocp.Chart: DYNAMIC
p.tab.allocp.Chart:(3 5)#100 _draw 0
p.tab.allocp.Chart..j.c:`gbar
p.tab.allocp.Chart..j.border:0
p.tab.allocp.Chart..j.wy:1.0
/p.tab.allocp.Chart..j.rownames: DYNAMIC : COUNT = ROW LENGTH OF DATA (# FRONT POINTS)
/p.tab.allocp.Chart..j.colnames: DYNAMIC : COUNT = # AREA COLORS (# ASSCL)
p.tab.allocp.Chart..j.rownames: `row1`row2`row3`row4`row5
p.tab.allocp.Chart..j.colnames: `col1`col2`col3
p.tab.allocp.Chart..j.pi.obsspacing:100
p.tab.allocp.Chart..j.axis.label.x:"x label"
p.tab.allocp.Chart..j.axis.label.y:"y label"
p.tab.allocp.Chart..j.aoi.drawgrid.x:1
p.tab.allocp.Chart..j.aoi.drawgrid.y:1
p.tab.allocp.Chart..j.acoi.gridcolor.x:210210210
p.tab.allocp.Chart..j.acoi.gridcolor.y:210210210
p.tab.allocp.Chart..j.oi.stacked:1
p.tab.allocp.Chart..j.oi.horizontal:0
p.tab.allocp.Chart..j.oi.drawlegend:0
p.tab.allocp.Chart..j.pi.obsspacing:100
p.tab.allocp.Chart..j.vcoi.areacolor: gencolor[],gencolor[],gencolor[]
/p.tab.allocp.Chart..j.vcoi.areacolor: DYNAMIC : COUNT = # COL NAMES
p[`tab;`allocp;`Chart.;`j;`afi;`axislabelfont]:`x`y,'`"Helvetica 1 12"
p[`tab;`allocp;`Chart.;`j;`afi;`ticklabelfont]:`x`y,'`"Helvetica 0 12"
p.tab.allocp.Chart..j.mousemode:,`leftclick `select

doweaddarow:{:[70<*1 _draw 101;1;0]}
genrandomrowdata:{[x] x _draw 0}

/adjustvalsby:{[x;y].01*({:[x>.5;1;-1]}''[(x y)#(x*y) _draw 0])*(x y)#(x*y) _draw 0}
adjustvalsby:{[x].01*({:[x>.5;1;-1]}''[x#(*/x) _draw 0])*x#(*/x) _draw 0}

/adjustvals:{p[`tab;`allocp;`Chart]+:adjustvalsby[#p[`tab;`allocp;`Chart.;`j;`rownames]; #p[`tab;`allocp;`Chart.;`j;`colnames]]}
adjustvals:{p[`tab;`allocp;`Chart]+:adjustvalsby[^p[`tab;`allocp;`Chart]]}

appendnewvals:{
	if[doweaddarow[]
		p[`tab;`allocp;`Chart.;`j;`c]:`null
		p[`tab;`allocp;`Chart.;`j;`rownames],:`$"row",$1+0$3_ $*|p[`tab;`allocp;`Chart.;`j;`rownames]
		p[`tab;`allocp;`Chart]:p[`tab;`allocp;`Chart],'genrandomrowdata[*^p[`tab;`allocp;`Chart]]
		p[`tab;`allocp;`Chart.;`j;`c]:`gbar
		]
		} /; p[`tab;`allocp;`Chart.;`j;`vcoi;`areacolor],:gencolor[]]}

doboth:{adjustvals[]; appendnewvals[]}

.j.Java {
	.j.c`p
}

.u.setTimerEvent[1;`.k.doboth]

p..j.close:{_exit 0}
p..j.z: {
  if[1~.k[`autoExit];_exit 0]
  }
