export const histogramChartTestData = {
	chartData:{
		"chartType": "Histogram",
		"granularity": {
			"coarse": {
				"range": {
					"length": 7,
					"step": 0.002,
					"start": 0.002
				},
				"series": [
					{
						"columnCoordinates": [
							0
						],
						"data": [
							0,
							0,
							0,
							0,
							10,
							0,
							0
						],
						"moments": {
							"standardDeviation": 1.828559098217032e-18,
							"skewness": 1,
							"kurtosis": -2,
							"mean": 0.010306551699251919
						}
					},
					{
						"columnCoordinates": [
							1
						],
						"data": [
							0,
							0,
							3,
							0,
							3,
							2,
							2
						],
						"moments": {
							"standardDeviation": 0.0029180120610004753,
							"skewness": -0.14779522146996898,
							"kurtosis": -0.9720391038291765,
							"mean": 0.010761774156087848
						}
					},
					{
						"columnCoordinates": [
							2
						],
						"data": [
							1,
							0,
							1,
							1,
							5,
							2,
							0
						],
						"moments": {
							"standardDeviation": 0.0028576177761601364,
							"skewness": -1.2588638251996553,
							"kurtosis": 0.5900137068076772,
							"mean": 0.009800021541920539
						}
					}
				]
			}
		}
	},
	pivotMetadata:{
		"allSelected": false,
		"rows": 10,
		"axes": [
			{
				"groupName": {
					"label": "Quarter",
					"description": "Quarter description"
				},
				"groupMembers": [
					{
						"label": "2016Q1",
						"description": "2016Q1 description"
					},
					{
						"label": "2016Q2",
						"description": "2016Q2 description"
					},
					{
						"label": "2016Q3",
						"description": "2016Q3 description"
					}
				],
				"groupType": "Generic"
			},
			{}
		],
		"availableViews": ["histogram"],
		"rowAxes": [
			1
		],
		"columnAxes": [
			0
		],
		"columns": 3
	}
}