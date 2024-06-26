export const percentileChartTestData = {
	chartData:     {
		chartType:                 "percentileChart",
		underlyingData:            [
			[
				0.06225383991659594,
				0.08584316345102505,
				0.10226843979604672,
				0.09016661598682041
			],
			[
				0.030579974668460075,
				0.04466261976753905,
				0.07567728380949346,
				0.050708378802791554
			],
			[
				0.03277472055164843,
				0.0481189711391814,
				0.0867516817295726,
				0.06065416357830378
			],
			[
				0.03974077931083042,
				0.05633070514547711,
				0.07742511073194858,
				0.06684532578482938
			],
			[
				0.0584726886889948,
				0.08889976700680702,
				0.09132365953381472,
				0.09353981987666571
			],
			[
				0.04765306549645065,
				0.07746578546770833,
				0.08195893668345366,
				0.08452481775959986
			],
			[
				0.06084792601974165,
				0.09635125342584439,
				0.12041314083257815,
				0.10868853253121569
			],
			[
				0.027142612291236157,
				0.04196484264264155,
				0.08302824126017905,
				0.05658956563124651
			],
			[
				0.049567540200693205,
				0.07535893563585394,
				0.115666122971809,
				0.11011457436413674
			],
			[
				0.04661878236049155,
				0.06117787635102179,
				0.07668556538205373,
				0.06750914412765807
			]
		],
		rowCoordinates:            [
			[
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9
			]
		],
		underlyingDataPermutation: [
			[
				7,
				1,
				2,
				3,
				9,
				5,
				8,
				4,
				6,
				0
			],
			[
				7,
				1,
				2,
				3,
				9,
				8,
				5,
				0,
				4,
				6
			],
			[
				1,
				9,
				3,
				5,
				7,
				2,
				4,
				0,
				8,
				6
			],
			[
				1,
				7,
				2,
				3,
				9,
				5,
				0,
				4,
				6,
				8
			]
		],
		params:                    {
			percentiles: [
				0,
				25,
				50,
				75,
				100
			]
		},
		series:                    [
			{
				columnCoordinates: [
					0
				],
				data: [
					0.027142612291236157,
					0.03451623524144393,
					0.0471359239284711,
					0.0562464015669194,
					0.06225383991659594
				],
				moments: {
					mean: 0.0454590025889333,
					standardDeviation: 0.013088016759698598
				}
			},
			{
				columnCoordinates: [
					1
				],
				data: [
					0.04196484264264155,
					0.05017190464075533,
					0.06826840599343786,
					0.08374881895519587,
					0.09635125342584439
				],
				moments: {
					mean: 0.068101045131575,
					standardDeviation: 0.02023615706227329
				}
			},
			{
				columnCoordinates: [
					2
				],
				data: [
					0.07567728380949346,
					0.07855856721982485,
					0.08488996149487582,
					0.09953224473048872,
					0.12041314083257815
				],
				moments: {
					mean: 0.09181423961745219,
					standardDeviation: 0.01650166400468397
				}
			},
			{
				columnCoordinates: [
					3
				],
				data: [
					0.050708378802791554,
					0.06220195412993518,
					0.07601698094362896,
					0.09269651890420438,
					0.11011457436413674
				],
				moments: {
					mean: 0.07834768142893936,
					standardDeviation: 0.02118996152933591
				}
			}
		]
	},
	pivotMetadata: {
		rows:           10,
		axes:           [
			{
				groupName:    {
					label:       "Economy",
					description: "Economy description"
				},
				groupMembers: [
					{
						label:       "CH",
						description: "CH description"
					},
					{
						label:       "DE",
						description: "DE description"
					},
					{
						label:       "GB",
						description: "GB description"
					},
					{
						label:       "US",
						description: "US description"
					}
				],
				groupType:    "Generic"
			},
			{
				groupName:    {
					label:       "Path",
					description: "Path description"
				},
				groupMembers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
				groupType:    "Scenario"
			}
		],
		availableViews: [
			"query",
			"pivot",
			"bar",
			"bootstrap",
			"box",
			"cdf",
			"cone",
			"correlation",
			"histogram",
			"line",
			"line2",
			"pdf",
			"scatter",
			"sensitivity"
		],
		rowAxes:        [
			1
		],
		columnAxes:     [
			0
		],
		columns:        4
	}
}