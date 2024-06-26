numPoints: (10;50;250;500;2500;5000;10000;25000;50000;100000;250000)

p: .()
p..j.c: `panel
p..j.l: "Chart Performance Testing"
p..j.xy: (1200;800)

/ Chart Type complexity dropdown
chartTypes: `gcrossscatter`gline
p.cmbChartType: 0
p.cmbChartType..j.c: `combo
p.cmbChartType..j.l: "Chart Type:"
p.cmbChartType..j.o: !#chartTypes
p.cmbChartType..j.ol: (!#chartTypes;chartTypes)
p.cmbChartType..j.async:2
p.cmbChartType..j.t:{RebuildChart[]}

/ # of series
p.numSeries: 5
p.numSeries..j.fill:`h
p.numSeries..j.l:"# of series:"
p.numSeries..j.t:{RebuildChart[]}

/ Chart complexity dropdown

p.cmbNumPoints: 0
p.cmbNumPoints..j[`c`l`async]: (`combo;"# of points per series:";2)
p.cmbNumPoints..j.o: !#numPoints
p.cmbNumPoints..j.ol: (!#numPoints;numPoints)
p.cmbNumPoints..j.t:{RebuildChart[]}

p.chkTransparency: 0
p.chkTransparency..j[`c`l]: (`check;`"Transparency?")

p.chkBorders: 0
p.chkBorders..j[`c`l]: (`check;`"Point Borders?")

p.chkAnnotations: 0
p.chkAnnotations..j[`c`l]: (`check;`"Annotations?")

p.chart: p.numSeries#

p.chart..j.c: chartTypes[p.cmbChartType]

// This function controls the chart values
setvals:{[sernum;pts]((_cos 5%sernum)+_sin(1.1*!pts);(_sin 5%sernum)+_cos(1.5*!pts))}
RebuildChart:{
				ser:p.numSeries
				pts:numPoints[p.cmbNumPoints]

				/ .j.d`.k.p.chart
				.k.p.chart.[`j;`c]:`null
				.j.flush[]

				chartType: chartTypes[p.cmbChartType]				

				.j.stop[]
				
				if[`gcrossscatter~chartType
						p.chart::,/{[seriesNum;pointsPerSeries]setvals[seriesNum;pointsPerSeries]}'[1+!ser;ser#pts]
						p.chart.[`j;`vars]:(ser;2)#!2*ser]
				
				if[`gline~chartType
						p.chart::{[seriesNum;pointsPerSeries]*setvals[seriesNum;pointsPerSeries]}'[1+!ser;ser#pts]
						p.chart.[`j;`vars]:: _n
						p.chart.[`j;`voi;`drawline]::ser#1
						p.chart.[`j;`voi;`drawpoint]::ser#0]

				p.chart.[`j;`c]:chartType
				
				.j.go[]
				
				}

/draws:{[x](#!x) _draw 0}
/UpdateChart:{[p;ser;pts]p:@[p;`chart;:;,/{[seriesNum;pointsPerSeries](,draws[pointsPerSeries]),,draws[pointsPerSeries]}'[1+!ser;ser#pts]]; p:.[p;(`chart.`j`vars);:;(ser;2)#!2*ser];.[`;`k`p`chart;:;p[`chart]];.[`;`k`p`chart.`j`vars;:;p[`chart.;`j;`vars]]}

RebuildChart[]

p..j.a: (`cmbChartType`numSeries`cmbNumPoints
	 `chkTransparency`chkBorders`chkAnnotations
	 `chart`chart`chart)

.j.Java {
  .j.c`p
}

p..j.z: {
 if[1~.k[`autoExit]; _exit 0]
}

p..j.close:{_exit 0}
