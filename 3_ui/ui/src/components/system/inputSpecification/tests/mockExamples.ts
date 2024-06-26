export const specification = {
	"mockInputs": {
		"name":        "mockSection",
		"title":       "Mock Section",
		"description": "",
		"applicable":  true,
		"options":     [
			{
				"name":         "stringInput",
				"title":        "String Input",
				"description":  "A simple string input",
				"applicable":   true,
				"inputType":    "string",
				"dataType":     "Symbol",
				"defaultValue": "ABC"
			},
			{
				"name":         "integerInput",
				"title":        "Integer Input",
				"description":  "A simple integer input",
				"applicable":   true,
				"inputType":    "integer",
				"dataType":     "Int64",
				"defaultValue": 0,
				"minimum":      0,
				"allowNull":    true
			},
			{
				"name":         "floatInput",
				"title":        "Float Input",
				"description":  "A simple float input",
				"applicable":   true,
				"inputType":    "float",
				"dataType":     "Float64",
				"defaultValue": 1,
				"minimum":      0,
				"maximum":      1,
				"allowNull":    true
			},
			{
				"name":         "floatInput2",
				"title":        "Float Input with percent",
				"description":  "A simple percent input",
				"applicable":   true,
				"inputType":    "float",
				"dataType":     "Float64",
				"defaultValue": 1,
				"minimum":      0,
				"maximum":      1,
				"allowNull":    true,
				"hints":        {
					"percent": true
				}
			},
			{
				"name":         "floatInput3",
				"title":        "Float Input max 5 decimal",
				"description":  "A simple float with  max 5 decimal",
				"applicable":   true,
				"inputType":    "float",
				"dataType":     "Float64",
				"defaultValue": 1,
				"minimum":      0,
				"maximum":      1,
				"allowNull":    true,
				"hints":        {
					"decimalPlaces": 5
				}
			},
			{
				"name":         "selection",
				"title":        "selection",
				"description":  "A simple select input with string value",
				"applicable":   true,
				"inputType":    "exclusive",
				"dataType":     "Symbol",
				"defaultValue": "option2",
				"options":      [
					{
						"name":        "option1",
						"title":       "Option 1",
						"description": "Option Description",
						"applicable":  true,
						"inputType":   "string",
						"dataType":    "Symbol"
					},
					{
						"name":        "option2",
						"title":       "Option 2",
						"description": "Option Description",
						"applicable":  true,
						"inputType":   "string",
						"dataType":    "Symbol"
					},
					{
						"name":       "option3",
						"title":      "Option 3",
						"applicable": true,
						"inputType":  "string",
						"dataType":   "Symbol"
					},
					{
						"name":       "option4",
						"title":      "Option 4",
						"applicable": false,
						"inputType":  "string",
						"dataType":   "Symbol"
					},
				]
			},
			{
				"name":         "selection2",
				"title":        "selection (hints: renderAsButtons)",
				"description":  "A simple select input with integer value",
				"applicable":   true,
				"inputType":    "exclusive",
				"dataType":     "Int64",
				"defaultValue": "3",
				"hints": {"renderAsButtons": true},
				"options":      [
					{
						"name":        "1",
						"title":       "Option 1",
						"description": "Option Description",
						"applicable":  true,
						"inputType":   "integer",
						"dataType":    "Int64"
					},
					{
						"name":        "2",
						"title":       "Option 2",
						"description": "Option Description",
						"applicable":  true,
						"inputType":   "integer",
						"dataType":    "Int64"
					},
					{
						"name":       "3",
						"title":      "Option 3",
						"applicable": true,
						"inputType":  "integer",
						"dataType":   "Int64"
					},
					{
						"name":       "4",
						"title":      "Option 4",
						"applicable": false,
						"inputType":  "integer",
						"dataType":   "Int64"
					}
				]
			},
			{
				"name":         "booleanInput1",
				"title":        "Boolean Input (default: false)",
				"description":  "A simple boolean input with default false value",
				"applicable":   true,
				"inputType":    "boolean",
				"dataType":     "Bool",
				"defaultValue": false,
				"allowNull":    false
			},
			{
				"name":         "booleanInput2",
				"title":        "Boolean Input (default: true)",
				"description":  "A simple boolean input with default true value",
				"applicable":   true,
				"inputType":    "boolean",
				"dataType":     "Bool",
				"defaultValue": true,
				"allowNull":    false
			}
		]
	},
	"mockGrids": {
		"name":        "mockGrids",
		"title":       "Mock Grids",
		"description": "",
		"applicable":  true,
		"options": [
			{
				"name":       "mockGrid1",
				"title":      "Mock Grid 1",
				"applicable": true,
				"hints":      {"gridLayoutDimension": 2},
				"options":    [
					{
						"name":       "row1",
						"title":      "Row 1",
						"description": "gridLayoutDimension unset",
						"applicable": true,
						"options":    [
							{
								"name":         "stringInput1",
								"title":        "text",
								"applicable":   true,
								"inputType":    "string",
								"dataType":     "Symbol",
								"defaultValue": "TEXT",
								"inline": true
							},
							{
								"name":         "selection",
								"title":        "selection",
								"description":  "A simple select input with string value",
								"applicable":   true,
								"inputType":    "exclusive",
								"dataType":     "Symbol",
								"inline": true,
								"defaultValue": "option2",
								"options":      [
									{
										"name":        "option1",
										"title":       "Option 1",
										"description": "Option Description",
										"applicable":  true,
										"inputType":   "string",
										"dataType":    "Symbol"
									},
									{
										"name":        "option2",
										"title":       "Option Option Option Option Option Option Option 2",
										"description": "Option Description",
										"applicable":  true,
										"inputType":   "string",
										"dataType":    "Symbol"
									}
								]
							},
							{
								"name":         "booleanInput1",
								"title":        "Boolean",
								"description":  "A simple boolean input with default false value",
								"applicable":   true,
								"inputType":    "boolean",
								"dataType":     "Bool",
								"defaultValue": false,
								"allowNull":    false
							},
						]
					},
					{
						"name":       "row2",
						"title":      "Row 2",
						"description": "gridLayoutDimension = 1",
						"applicable": true,
						"hints":      {"gridLayoutDimension": 1},
						"options":    [
							{
								"name":         "stringInput1",
								"title":        "text",
								"applicable":   true,
								"inputType":    "string",
								"dataType":     "Symbol",
								"defaultValue": "TEXT",
								"inline": true
							},
							{
								"name":         "selection",
								"title":        "selection",
								"description":  "A simple select input with string value",
								"applicable":   true,
								"inputType":    "exclusive",
								"dataType":     "Symbol",
								"inline": true,
								"defaultValue": "option2",
								"options":      [
									{
										"name":        "option1",
										"title":       "Option 1",
										"description": "Option Description",
										"applicable":  true,
										"inputType":   "string",
										"dataType":    "Symbol"
									},
									{
										"name":        "option2",
										"title":       "Option Option Option Option Option Option Option 2",
										"description": "Option Description",
										"applicable":  true,
										"inputType":   "string",
										"dataType":    "Symbol"
									}
								]
							},
							{
								"name":         "booleanInput1",
								"title":        "Boolean",
								"description":  "A simple boolean input with default false value",
								"applicable":   true,
								"inputType":    "boolean",
								"dataType":     "Bool",
								"defaultValue": false,
								"allowNull":    false
							},
						]
					},
					{
						"name":       "row3",
						"title":      "Row 3",
						"description": "gridLayoutDimension = false",
						"applicable": true,
						"hints":      {"gridLayoutDimension": false},
						"options":    [
							{
								"name":         "stringInput1",
								"title":        "text",
								"applicable":   true,
								"inputType":    "string",
								"dataType":     "Symbol",
								"defaultValue": "TEXT",
								"inline": true
							},
							{
								"name":         "selection",
								"title":        "selection",
								"description":  "A simple select input with string value",
								"applicable":   true,
								"inputType":    "exclusive",
								"dataType":     "Symbol",
								"inline": true,
								"defaultValue": "option2",
								"options":      [
									{
										"name":        "option1",
										"title":       "Option 1",
										"description": "Option Description",
										"applicable":  true,
										"inputType":   "string",
										"dataType":    "Symbol"
									},
									{
										"name":        "option2",
										"title":       "Option Option Option Option Option Option Option 2",
										"description": "Option Description",
										"applicable":  true,
										"inputType":   "string",
										"dataType":    "Symbol"
									}
								]
							},
							{
								"name":         "booleanInput1",
								"title":        "Boolean",
								"description":  "A simple boolean input with default false value",
								"applicable":   true,
								"inputType":    "boolean",
								"dataType":     "Bool",
								"defaultValue": false,
								"allowNull":    false
							},
						]
					}

				]
			},
			{
				"name":       "mockGrid2",
				"title":      "Mock Grid 2",
				"description": "gridLayoutDimension = 1",
				"applicable": true,
				"hints":      {"gridLayoutDimension": 1},
				"options":    [
					{
						"name":         "stringInput1",
						"title":        "text",
						"applicable":   true,
						"inputType":    "string",
						"dataType":     "Symbol",
						"defaultValue": "TEXT",
						"inline": true
					},
					{
						"name":         "selection",
						"title":        "selection",
						"description":  "A simple select input with string value",
						"applicable":   true,
						"inputType":    "exclusive",
						"dataType":     "Symbol",
						"inline": true,
						"defaultValue": "option2",
						"options":      [
							{
								"name":        "option1",
								"title":       "Option 1",
								"description": "Option Description",
								"applicable":  true,
								"inputType":   "string",
								"dataType":    "Symbol"
							},
							{
								"name":        "option2",
								"title":       "Option Option Option Option Option Option Option 2",
								"description": "Option Description",
								"applicable":  true,
								"inputType":   "string",
								"dataType":    "Symbol"
							}
						]
					},
					{
						"name":         "booleanInput1",
						"title":        "Boolean",
						"description":  "A simple boolean input with default false value",
						"applicable":   true,
						"inputType":    "boolean",
						"dataType":     "Bool",
						"defaultValue": false,
						"allowNull":    false
					},
				]
			}
		]
	},
	"mockTables": {
		"name": "mockTables",
		"title": "Mock Tables",
		"description": "",
		"applicable": true,
		"options": [
			{
				"name": "inputTable",
				"title": "Simple input table",
				"description": "",
				"applicable": true,
				"inputType": "expandable",
				"dataType": "Vector{OrderedCollections.OrderedDict{Symbol, Any}}",
				"defaultValue": [],
				"hints": {
					"dimension": 2
				},
				"options": [
					{
						"name": "string",
						"title": "String Column",
						"description": "string column",
						"applicable": true,
						"inputType": "string",
						"dataType": "Symbol",
						"defaultValue": "V0"
					},
					{
						"name": "boolean",
						"title": "Boolean Column",
						"description": "Determines whether the state is active.",
						"applicable": true,
						"inputType": "boolean",
						"dataType": "Bool",
						"defaultValue": true,
						"allowNull": false
					},
					{
						"name": "integer",
						"title": "Integer Column",
						"description": "",
						"applicable": true,
						"inputType": "integer",
						"dataType": "Int64",
						"defaultValue": 3,
						"allowNull": false
					},
					{
						"name": "float",
						"title": "Float Column",
						"description": "",
						"applicable": true,
						"inputType": "float",
						"dataType": "Float64",
						"defaultValue": 0.5,
						"allowNull": false
					},
					{
						"name":         "stringSelection",
						"title":        "selection (string)",
						"description":  "A simple select input with string value",
						"applicable":   true,
						"inputType":    "exclusive",
						"dataType":     "Symbol",
						"defaultValue": "option2",
						"options":      [
							{
								"name":        "option1",
								"title":       "Option 1",
								"description": "Option Description",
								"applicable":  true,
								"inputType":   "string",
								"dataType":    "Symbol"
							},
							{
								"name":        "option2",
								"title":       "Option 2",
								"description": "Option Description",
								"applicable":  true,
								"inputType":   "string",
								"dataType":    "Symbol"
							},
							{
								"name":       "option3",
								"title":      "Option 3",
								"applicable": true,
								"inputType":  "string",
								"dataType":   "Symbol"
							},
							{
								"name":       "option4",
								"title":      "Option 4",
								"applicable": false,
								"inputType":  "string",
								"dataType":   "Symbol"
							},
						]
					},
				]
			},
			{
				"name": "inputTable2",
				"title": "Simple input table 2",
				"description": "",
				"applicable": true,
				"defaultValue": [],
				"hints": {
					"dimension": 1
				},
				"options": [
					{
						"name": "string",
						"title": "String Column",
						"description": "string column",
						"applicable": true,
						"inputType": "string",
						"dataType": "Symbol",
						"defaultValue": "V0"
					},
					{
						"name": "integer",
						"title": "Integer Column",
						"description": "",
						"applicable": true,
						"inputType": "integer",
						"dataType": "Int64",
						"defaultValue": 3,
						"allowNull": false
					},
					{
						"name": "float",
						"title": "Float Column",
						"description": "",
						"applicable": true,
						"inputType": "float",
						"dataType": "Float64",
						"defaultValue": 0.5,
						"allowNull": false
					}
				]
			}
		]
	},
	"interpolate": {
		"name":        "mockSection",
		"title":       "Mock Section",
		"description": "",
		"applicable":  true,
		"options": [
			{
				"name": "lambdas",
				"title": "Lambdas",
				"description": " An Asset Optimization combines the result of many individual optimizations to produce the efficient frontier of possible asset allocations for consideration. Each of these individual optimizations test many asset allocations, each of which produces a number of variables, each of which is in turn a vector of values by scenario. One such vector is distilled into a risk measure one such vector is distilled into a reward measure. The difference between the individual optimizers arises from their different objective functions which amount to varying weightings between the importance of risk versus reward. The weighting is referred to as “lambda” (λ). Precisely, the objective that is minimized is:\n\nRISK - λ x (REWARD + RISK)   which is equivalent to:   (1 - λ) x RISK - λ x REWARD\n\nUsually, the set of values for lambda range from 0% (solely minimize risk) to 100% (solely maximize reward). Constraining the range can sometimes increase performance with little to no effect on the quality of the result in the relevant portion of the efficient frontier. Whether or not this can be safely done for any particular class of problem can only be determined via experimentation. Other things being equal, more lambdas will produce a higher quality result at additional cost. ",
				"applicable": true,
				"inline":true,
				"interpolate": "From {from} to {to} in increments of {increment} for a total of {quantity} lambdas",
				"options": [
					{
						"name": "from",
						"title": "From",
						"description": "",
						"applicable": true,
						"inputType": "float",
						"dataType": "Float64",
						"defaultValue": 0,
						"minimum": 0,
						"maximum": 1,
						"allowNull": false
					},
					{
						"name": "to",
						"title": "To",
						"description": "",
						"applicable": true,
						"inputType": "float",
						"dataType": "Float64",
						"defaultValue": 1,
						"minimum": 0,
						"maximum": 1,
						"allowNull": false
					},
					{
						"name": "incrementPrecedence",
						"title": "Increment Precedence",
						"description": "",
						"applicable": true,
						"inputType": "boolean",
						"dataType": "Bool",
						"defaultValue": false,
						"allowNull": false
					},
					{
						"name": "increment",
						"title": "Increment",
						"description": "",
						"applicable": true,
						"inputType": "float",
						"dataType": "Float64",
						"defaultValue": 0.05,
						"minimum": 0.001,
						"maximum": 1,
						"allowNull": false
					},
					{
						"name": "quantityPrecedence",
						"title": "Quantity Precedence",
						"description": "",
						"applicable": true,
						"inputType": "boolean",
						"dataType": "Bool",
						"defaultValue": true,
						"allowNull": false
					},
					{
						"name": "quantity",
						"title": "Quantity",
						"description": "",
						"applicable": true,
						"inputType": "integer",
						"dataType": "Int64",
						"defaultValue": 21,
						"minimum": 1,
						"maximum": 1000,
						"allowNull": false
					}
				]
			}
		]
	},
	"noTitle": {
		"name":        "mockSection",
		"title":       "Mock Section",
		"description": "",
		"applicable":  true,
		"options": [
			{
				"name":         "stringInput",
				"title":        "String Input",
				"description":  "A simple string input",
				"applicable":   true,
				"inputType":    "string",
				"dataType":     "Symbol",
				"defaultValue": "ABC",
				"hints" : { "showTitle" : false}
			},
		]
	}
}

export const initValue = {
	"mockTables": {
		"inputTable": [
			{string: "V1", boolean: true},
			{string: "V2", boolean: true},
			{string: "V3", boolean: false}
		],
		"inputTable2": {string: "V1"}
	}
}