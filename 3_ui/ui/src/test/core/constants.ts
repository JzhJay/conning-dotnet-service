export const queryResults = [
	{guid:"45942327-4aa5-477b-b9ba-ce849df2f1a7", availableViews: ["correlation", "box"], hasMultipleColumnAxes:true},
	{guid:"6a1388c1-07bc-429c-8429-85efa893d8ff", availableViews: ["correlation", "cdf", "cone", "box"]},
	{guid:"b950fc91-f746-4c5e-854d-735bebf4a6cf", availableViews: ["correlation", "cdf", "cone", "box"]},
	{guid:"16849618-40cc-4730-a7ac-abc2525a23b9", availableViews: ["correlation"]},
	{guid:"29b62fbf-a900-4792-be1f-f8e650e13c1a", availableViews: ["cdf"]},
	{guid:"65eaeb5b-f488-4295-97e9-ad1ed15fd095", availableViews: ["cdf"]}
]

export const JULIA_TAG = "@Julia";

//TODO: use axes names to specify arrangement instead of ID
// Used for view component tests
export const sampleQueries = [
	{
		id: 0, // Multiple column axes, legend grouping
		selections: [{panel:"variables", axis:"FTime", coordinate:["+12 Periods"]}],
		arrangement: {columnAxes:[10, 11, 12], rowAxes:[13]},
		availableViews: ["pivot", "box", "cdf", "correlation", "histogram", "line", "pdf", "scatter", "bar", "beeswarm"]
	},
	{
		id: 1, // scenario/path selection in box/cone, no grouping
		selections: [{panel:"variables", axis:"FTime", coordinate:["+12 Periods"]}, {panel:"variables", axis:"Compounding", coordinate:["Continuous"]}],
		arrangement: {columnAxes:[12], rowAxes:[13]},
		availableViews: ["box", "cdf", "cone", "pdf"]
	},
	{
		id: 2, // Special behaviour with single column axes, e.g. showing moment boxes and deviations
		selections: [{panel:"variables", axis:"FTime", coordinate:["+12 Periods"]}, {panel:"variables", axis:"Compounding", coordinate:["Continuous"]}],
		arrangement: {columnAxes:[], rowAxes:[13, 12]},
		availableViews: ["box", "cdf", "histogram", "pdf", "beeswarm"]
	},
	{ // export from QueryTool instead
		id: 3, // Anthony's recommended filters
		disabled: true,
		selections: [
			{panel:"variables",
				axis:"Market",
				coordinate:["Bonds"]},
			{panel:"variables",
				axis:"BondMarkets",
				coordinate:["Sovereign"]},
			{panel:"variables",
				axis:"Measure",
				coordinate:["Price"]},
			{panel:"variables",
				axis:"FTime",
				coordinate:["+5 Periods"]},
			{panel:"variables",
				axis:"Sector",
				coordinate:["Default Free"]}
		],
		arrangement: {columnAxes:[], rowAxes:[13, 12]},
		availableViews: ["box", "cdf", "histogram", "pdf", "beeswarm"]
	}
]

export const testQueries = [
	// {
	// 	id:             0,
	// 	selections:     [{panel: "variables", axis: "Module", coordinate: ["Economies"]}, {panel: "variables", axis: "FTime", coordinate: ["+1 Period"]}],
	// 	arrangement:    {columnAxes: [10, 11, 12], rowAxes: [13]},
	// 	availableViews: ["query", "pivot", "bootstrap", "box", "cdf", "correlation", "histogram", "line", "line2", "pdf", "scatter", "sensitivity"],
	// 	benchMarkNum:   1
	// },
	{
		id:             1,
		selections:     [{panel: "variables", axis: "Module", coordinate: ["Economies"]}, {panel: "variables", axis: "FTime", coordinate: ["+1 Period"]}],
		statistics:     [{axis: 24, stats: [10]}, {axis: 3, stats: [11]}, {axis:23, stats: [2, 7]}, {axis: 6, stats: [9]}],
		arrangement:    {columnAxes: [], rowAxes: [13]},
		benchMarkNum:   2
	},
	// {
	// 	id: 2,
	// 	selections:     [{panel: "variables", axis: "Module", coordinate: ["Securities"]},
	// 					 {panel: "variables", axis: "Market", coordinate: ["Bonds"]},
	// 					 {panel: "variables", axis: "Component", coordinate: ["Income", "Price"]}],
	// 	arrangement:    {columnAxes: [7, 8, 9], rowAxes: [10]},
	// 	benchMarkNum:   10
	// },
	// {
	// 	id:3,
	// 	selections: [{panel: "variables", axis: "Measure", coordinate: ["Return", "Sector"]},
	// 				 {panel: "variables", axis: "Security", coordinate: ["T000_BND_Security_1", "T000_BND_Security_2", "T000_BND_Security_3"]}],
	// 	arrangement: {columnAxes: [], rowAxes: []},
	// 	benchMarkNum: 19
	// },
	// {
	// 	id: 4,
	// 	selections: [{panel: "variables", axis: "Measure", coordinate: ["Income_Basis"]}],
	// 	arrangement: {columnAxes: [], rowAxes: []},
	// 	benchMarkNum: 22
	// }
]
