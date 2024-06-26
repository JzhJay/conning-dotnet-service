//if[*r:.[f;a;:]; handle error]
//.[function;arglist;:]
//(1;value)
//(0;data)
//if[*r:.[f;a;:]; `0:,"error! ",r 1] 

make_dv:{[x]
	:[x~_n; (`;.j.v); x]}

DataTypes: `pivot`table`matrix`vector`cross
InitialDataType: `vector

// undot last item
ReverseAttr:{[path] (-1_ path), ~*|path}


// Todo: replace with a "complexity" slider
Cols:5;Rows:500
	
DataPath: `k `frm `split `pnlData `data
ChartPath: `k `frm `split `pnlChart `chart
	
UpdateSampleData:{[parent;dataType]
		data: 0
		attr:.()
										
		// `table
		if[dataType~`table;		r:CreateTable[Cols;Rows]]
		if[dataType~`pivot;		r:CreatePivot[Rows*Cols]]
		if[dataType~`vector;	r:CreateVector[Rows]]

		// r is data;attr
		data: r[0]
		attr: r[1]
					
		attr[`j;`wy`anchor`f]:(.2;`n;9.8)
	
		// Trigger on s
		attr[`j;`s.;`t]: ".k.data_SelectionChanged[-2_ .j.v]"

		// Update the variable `data in our parent panel
		.[`;parent,,`data`data.;:;(data;attr)]

		// Update the chart
		.[`;ChartPath;:;data]

		CreateSampleChart[]}

data_SelectionChanged:{[sender]			/ /sender is attribute dictionary
	// non null data?
	if[~_n~sender
		attr:.[`;sender]
		data:.[`;ReverseAttr[sender]]
		
// Update chart with selection - eat exception
		.[r:.[`;ChartPath;:;data[attr.j.s]];]
	]
}		


CreateVector: {[rows] 
	vector:1.1*!rows
	attr: .()
	attr[`j;`c]:`vector
	(vector;attr)}

CreateTable: {[rows;cols] 
	table:.+( {`$"C_",$(1+x)}'(!cols);{x+(100*x)*!y}'[(!cols);rows])
	attr: .()
	attr[`j;`c]:`table
	(table;attr)}

// p = number of paths
CreatePivot: {[p]
	attr: .()
	attr[`j;`c`border]:(`Pivot_;0)

	classes:  `B`BB`BBB`A`AA`AAA
	economies:`US`AU
	times:2011 2012 2013 2014
	paths:!p
	
	attr[`j;`ax;`"Path_With_Underscores"`Time`Class`Economy]:+,/paths,\:/:,/times,\:/:,/classes,/:\:economies
	pivot:(#attr[`j;`ax;`"Path_With_Underscores"]) _draw 0
	attr[`j;`a]:(`Economy`Class;`"Path_With_Underscores"`Time)
	(pivot;attr)}

BuildDataPanel:{
	panel: .()
	attr: .()
	attr[`j;`c`l`wx`f]: (`panel;	`"Input Data:";	.j.NoExtraSpace;	`n)		
	
	panel[`lblDataType]: "K Data Types:"
	
	// `lblDataType - `label										`c		`wx					`wy					`insets		`fill	`anchor		`h		`valign
	panel[`lblDataType.;`j;`c`wx`wy`insets`fill`anchor`h`valign]: (	`label;	.j.NoExtraSpace;	.j.NoExtraSpace;	(0;0;0;0);	`n;		`nw;		29;		`c)
	
	//	`cmbDataType 
	panel[`cmbDataType]: DataTypes ? InitialDataType   // Set to initial index
	//	`cmbDataType - `combo									`c				`border		`o				`ol			`wx		`wy				`fill	`anchor
	panel[`cmbDataType.;`j;`c`border`o`ol`wx`wy`fill`anchor]:	(`combo;		0;			!#DataTypes;	DataTypes;	.2;		.j.NoExtraSpace;`n;		`nw)
	
	// cmbDataType - Trigger to change data			Parent  	dataType
	panel[`cmbDataType.;`j;`t]: {UpdateSampleData[	-1_.j.v;	DataTypes[.j.i]]}

	// Arrangement
	attr[`j;`a]: (`lblDataType`cmbDataType
				`data`data
				`data`data)
	
	// Return
	(panel;attr)}

////////////////////  End Data panel ///////////////



////////////////////  Chart panel //////////////////

SetChartType:{[chart;toggle]
	/ toggling on?
	if[.[`;toggle]	
		chartType:	.[`;.j.attrpath toggle][`tag;`ChartType]

		/ Set ..j.c and ..j.l
		{.[`;.j.attrpath[chart],`j,x;:;chartType]}'`c`l

// How to eat exception?  .j.e"Unable to set chart type"]
		chartType
	]
}

// Trigger for ..j.title textbox changing
// x is _n during real trigger
SetLegendTitle:{[title;chart]
	.[`;attrpath[chart],`j,`title;:;title]}

BuildChartPanel:{
	panel:.()
	panelA:.()
	panelA[`j;`c`l]: (`panel;	`"Charting:")

	//  Chart Toolbar
	panel.toolbar..j[`c`border`anchor`wy`fill]:	(`toolbar;0;`n;.j.NoExtraSpace;`b)

	// Another option:   .+(`btnLine`btnBar;(,"Line";,"Bar"))
	toolbarButtons: .(	(`btnLine;("<html>Line</html>";`gline))
						(`btnBar;("<html>Bar</html>";`gbar))
						(`btnCrossScatter;("<html>Cross/Scatter</html>";`gcrossscatter))
						(`btn3dCrossScatter;("<html>3d<br>CrossScatter</html>";`gcrossscatter3))
						(`btnPieScatter;("<html>Pie<br>Scatter</html>";`gpiescatter))
						(`btn3dPieScatter;("<html>3d Pie<br>Scatter</html>";`gpiescatter3))
						(`btn3dCrossBubbleScatter;("<html>Cross/Bubble<br>Scatter</html>";`gcrossbubblescatter)))
 
	count: (#!toolbarButtons)
	names: !toolbarButtons

	panel.toolbar[names]: count#0
	
	panel.toolbar[~names;`j;`c`group]: count#,(`togglebutton`graphType)
	panel.toolbar[~names;`j;`l]: toolbarButtons[names;0]
	panel.toolbar[~names;`tag;`ChartType]: toolbarButtons[names;1]
	panel.toolbar[~names;`j;`t]: { SetChartType[(-2_ .j.v),`chart;.j.v] }
		
	panel.toolbar[*names]: 1  // Turn on the first chart toggle
		
	// End Chart Toolbar

	// Chart Options
	
	panel.options..j[`c`l]: (`panel;`"Options:")
	
	panel.options.title: "`title:"
	panel.options.title..j.c:`label
	panel.options.legend..j[`c`border`save`echo]: (`string;0;0;0)
	panel.options.legend: "<font size=3><font class=\"Helvetica\">This is a chart<br>with a long title<br>in Helvetica</font></font>"
	panel.options.legend..j.t: { SetLegendTitle[(`. .j.v;(-1_ .j.v),`chart)] }
	SetLegendTitle[panel.options.legend;panel.chart]

	panelA.j.a:(`chkShowLegend`lblLegend`txtLegend
					```)
	
	
	// End Chart Options

	panel.chart: 0
	
	panel.options..j.wx:.25
	panel.chart..j.wx:.75

	panelA.j.a: (	`toolbar		`toolbar	
					`options		`chart	)

	// Return charting panel
	(panel;panelA)}

////////////////////  End Chart panel //////////////////


Main:{
	// Main Form
	frm:: .()
	frm.[`j;`c`l`xy]: (`panel;	"ADVISE Query: GEMS Simulation.dfs";	(1300;700))
	frm.[`j;`close]: { _exit 0 }

	// Split panel
	// Data <-> Chart
	frm[`split.;`j;`c`dir`divweight]::(`split;`v;.25)

	frm[`split;`pnlData`pnlData.]::		BuildDataPanel[]
	frm[`split;`pnlChart`pnlChart.]::	BuildChartPanel[]
	
	UpdateSampleData[(`k`frm`split`pnlData);InitialDataType]
	SetChartType[`k`frm`split`pnlChart`chart;`k`frm`split`pnlChart`toolbar`btnLine]

	_n}



Main[]
// JK startup
.j.Java {
	.j.c`frm	
}

frm..j.z: {
	if[1~.k[`autoExit]; _exit 0]
	}
