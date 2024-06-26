export default {
	"axes":               {
		"additionalAllocation": {
			"orderIndices": [],
			"values":       {},
			"paths":        [
				[
					"additionalAllocations"
				],
				[
					"assetClasses",
					"additionalAllocations"
				]
			]
		},
		"fooAxis":              {
			"orderIndices": [
				0,
				1
			],
			"values":       {
				"0": "Untitled",
				"1": "Untitled 0"
			},
			"paths":        [
				[
					"optimizationTarget",
					"ui4",
					"parent",
					"goo",
					"hoo"
				],
				[
					"optimizationTarget",
					"ui4",
					"parent",
					"goo",
					"koo"
				],
				[
					"optimizationTarget",
					"ui4",
					"parent",
					"goo",
					"loo"
				],
				[
					"optimizationTarget",
					"ui4",
					"parent",
					"foobar"
				],
				[
					"optimizationTarget",
					"ui5",
					"parent",
					"goo",
					"hoo"
				],
				[
					"optimizationTarget",
					"ui5",
					"parent",
					"goo",
					"koo"
				],
				[
					"optimizationTarget",
					"ui5",
					"parent",
					"goo",
					"loo"
				],
				[
					"optimizationTarget",
					"ui5",
					"parent",
					"foobar"
				],
				[
					"optimizationTarget",
					"ui6",
					"parent",
					"goo"
				],
				[
					"optimizationTarget",
					"ui6",
					"parent",
					"foobar"
				]
			]
		},
		"gooAxis":              {
			"orderIndices": [
				0,
				1,
				2
			],
			"values":       {
				"0": "goo1",
				"1": "goo2",
				"2": "goo3"
			},
			"paths":        [
				[
					"optimizationTarget",
					"ui6",
					"parent",
					"goo"
				],
				[
					"optimizationTarget",
					"ui7",
					"parent",
					"goo"
				]
			]
		},
		"quadraticFactor":      {
			"orderIndices": [],
			"values":       {},
			"paths":        [
				[
					"assetClasses",
					"riskBasedCapital",
					"generalizedQuadraticQuadraticConstantFactors"
				],
				[
					"assetClasses",
					"riskBasedCapital",
					"generalizedQuadraticQuadraticUserValueFactors"
				],
				[
					"assetClasses",
					"riskBasedCapital",
					"generalizedQuadraticQuadraticRepositoryFactors"
				],
				[
					"riskBasedCapital",
					"generalizedQuadratic",
					"componentConstants"
				],
				[
					"riskBasedCapital",
					"generalizedQuadratic",
					"correlationMatrix"
				],
				[
					"riskBasedCapital",
					"generalizedQuadratic",
					"correlationMatrix"
				]
			]
		},
		"multiClassConstraint": {
			"orderIndices": [],
			"values":       {},
			"paths":        [
				[
					"assetClasses",
					"constraintsAndDuration",
					"multiClassConstraints"
				],
				[
					"constraintsAndDuration",
					"multiClassConstraints"
				]
			]
		},
		"modelAxis":            {
			"orderIndices": [
				0,
				1
			],
			"values":       {
				"0": "Model1",
				"1": "Model2"
			},
			"paths":        [
				[
					"optimizationTarget",
					"ui7",
					"parent",
					"goo",
					"device",
					"model"
				],
				[
					"optimizationTarget",
					"ui7",
					"parent",
					"foobar",
					"device",
					"model"
				]
			]
		},
		"deviceAxis":           {
			"orderIndices": [
				0,
				1,
				2
			],
			"values":       {
				"0": "Computers",
				"1": "Tablets",
				"2": "Phones"
			},
			"paths":        [
				[
					"optimizationTarget",
					"ui7",
					"parent",
					"goo",
					"device"
				],
				[
					"optimizationTarget",
					"ui7",
					"parent",
					"foobar",
					"device"
				]
			]
		},
		"limitAxis":            {
			"orderIndices": [
				0,
				1
			],
			"values":       {
				"0": "Untitled",
				"1": "Untitled 0"
			},
			"paths":        [
				[
					"riskBasedCapital",
					"rbcRatioLimits",
					"pathStatistic",
					"statistic"
				],
				[
					"riskBasedCapital",
					"rbcRatioLimits",
					"pathStatistic",
					"area"
				],
				[
					"riskBasedCapital",
					"rbcRatioLimits",
					"pathStatistic",
					"percentile"
				],
				[
					"riskBasedCapital",
					"rbcRatioLimits",
					"mustBe"
				],
				[
					"riskBasedCapital",
					"rbcRatioLimits",
					"limit"
				],
				[
					"riskBasedCapital",
					"rbcRatioLimits",
					"from"
				],
				[
					"riskBasedCapital",
					"rbcRatioLimits",
					"fromSelectedValue"
				],
				[
					"riskBasedCapital",
					"rbcRatioLimits",
					"to"
				],
				[
					"riskBasedCapital",
					"rbcRatioLimits",
					"toSelectedValue"
				]
			]
		}
	},
	"inputOptions":       {
		"examples": {
			"name":        "examples",
			"title":       "Examples",
			"description": "",
			"applicable":  true,
			"options":     [
				{
					"name":        "ui3",
					"title":       "Ui3",
					"description": "",
					"applicable":  true,
					"options":     [
						{
							"name":        "parent",
							"title":       "Parent",
							"description": "",
							"applicable":  true,
							"hints":       {
								"dimension": 1
							},
							"options":     [
								{
									"name":        "goo",
									"title":       "Goo",
									"description": "",
									"applicable":  true,
									"options":     [
										{
											"name":         "hoo",
											"title":        "Hoo",
											"description":  "",
											"applicable":   true,
											"inputType":    "float",
											"defaultValue": 0,
											"allowNull":    false
										},
										{
											"name":         "koo",
											"title":        "Koo",
											"description":  "",
											"applicable":   true,
											"inputType":    "float",
											"defaultValue": 0,
											"allowNull":    false
										},
										{
											"name":         "loo",
											"title":        "Loo other input is kind of long",
											"description":  "",
											"applicable":   true,
											"inputType":    "float",
											"defaultValue": 0,
											"allowNull":    false
										}
									]
								},
								{
									"name":         "foobar",
									"title":        "Foobar",
									"description":  "",
									"applicable":   true,
									"inputType":    "float",
									"defaultValue": 0,
									"allowNull":    false
								}
							]
						}
					]
				},
				{
					"name":        "ui4",
					"title":       "Ui4",
					"description": "",
					"applicable":  true,
					"options":     [
						{
							"name":        "parent",
							"title":       "Parent",
							"description": "",
							"applicable":  true,
							"hints":       {
								"dimension": 1
							},
							"options":     [
								{
									"name":        "goo",
									"title":       "Goo",
									"description": "",
									"applicable":  true,
									"options":     [
										{
											"name":         "hoo",
											"title":        "Hoo",
											"description":  "",
											"applicable":   true,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "fooAxis",
											"hints":        {
												"dimension": 2
											},
											"options":      [
												{
													"name":         null,
													"title":        "",
													"description":  "",
													"applicable":   true,
													"inputType":    "float",
													"defaultValue": 0,
													"allowNull":    false
												}
											]
										},
										{
											"name":         "koo",
											"title":        "Koo",
											"description":  "",
											"applicable":   true,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "fooAxis",
											"hints":        {
												"dimension": 2
											},
											"options":      [
												{
													"name":         null,
													"title":        "",
													"description":  "",
													"applicable":   true,
													"inputType":    "float",
													"defaultValue": 0,
													"allowNull":    false
												}
											]
										},
										{
											"name":         "loo",
											"title":        "Loo other input is kind of long",
											"description":  "",
											"applicable":   true,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "fooAxis",
											"hints":        {
												"dimension": 2
											},
											"options":      [
												{
													"name":         null,
													"title":        "",
													"description":  "",
													"applicable":   true,
													"inputType":    "float",
													"defaultValue": 0,
													"allowNull":    false
												}
											]
										}
									]
								},
								{
									"name":         "foobar",
									"title":        "Foobar",
									"description":  "",
									"applicable":   true,
									"inputType":    "expandable",
									"defaultValue": [],
									"axis":         "fooAxis",
									"hints":        {
										"dimension": 2
									},
									"options":      [
										{
											"name":         null,
											"title":        "",
											"description":  "",
											"applicable":   true,
											"inputType":    "float",
											"defaultValue": 0,
											"allowNull":    false
										}
									]
								}
							]
						}
					]
				},
				{
					"name":        "ui5",
					"title":       "Ui5",
					"description": "",
					"applicable":  true,
					"options":     [
						{
							"name":        "parent",
							"title":       "Parent",
							"description": "",
							"applicable":  true,
							"hints":       {
								"dimension": 2
							},
							"options":     [
								{
									"name":        "goo",
									"title":       "Goo",
									"description": "",
									"applicable":  true,
									"options":     [
										{
											"name":         "hoo",
											"title":        "Hoo",
											"description":  "",
											"applicable":   true,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "fooAxis",
											"hints":        {
												"dimension": 1
											},
											"options":      [
												{
													"name":         null,
													"title":        "",
													"description":  "",
													"applicable":   true,
													"inputType":    "float",
													"defaultValue": 0,
													"allowNull":    false
												}
											]
										},
										{
											"name":         "koo",
											"title":        "Koo",
											"description":  "",
											"applicable":   true,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "fooAxis",
											"hints":        {
												"dimension": 1
											},
											"options":      [
												{
													"name":         null,
													"title":        "",
													"description":  "",
													"applicable":   true,
													"inputType":    "float",
													"defaultValue": 0,
													"allowNull":    false
												}
											]
										},
										{
											"name":         "loo",
											"title":        "Loo other input is kind of long",
											"description":  "",
											"applicable":   true,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "fooAxis",
											"hints":        {
												"dimension": 1
											},
											"options":      [
												{
													"name":         null,
													"title":        "",
													"description":  "",
													"applicable":   true,
													"inputType":    "float",
													"defaultValue": 0,
													"allowNull":    false
												}
											]
										}
									]
								},
								{
									"name":         "foobar",
									"title":        "Foobar",
									"description":  "",
									"applicable":   true,
									"inputType":    "expandable",
									"defaultValue": [],
									"axis":         "fooAxis",
									"hints":        {
										"dimension": 1
									},
									"options":      [
										{
											"name":         null,
											"title":        "",
											"description":  "",
											"applicable":   true,
											"inputType":    "float",
											"defaultValue": 0,
											"allowNull":    false
										}
									]
								}
							]
						}
					]
				},
				{
					"name":        "ui6",
					"title":       "Ui6",
					"description": "",
					"applicable":  true,
					"options":     [
						{
							"name":        "parent",
							"title":       "Parent",
							"description": "",
							"applicable":  true,
							"hints":       {
								"dimension": 2
							},
							"options":     [
								{
									"name":         "goo",
									"title":        "Goo",
									"description":  "",
									"applicable":   true,
									"inputType":    "expandable",
									"defaultValue": [],
									"axis":         "gooAxis",
									"options":      [
										{
											"name":         null,
											"title":        "",
											"description":  "",
											"applicable":   true,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "fooAxis",
											"hints":        {
												"dimension": 1
											},
											"options":      [
												{
													"name":         null,
													"title":        "",
													"description":  "",
													"applicable":   true,
													"inputType":    "float",
													"defaultValue": 0,
													"allowNull":    false
												}
											]
										}
									]
								},
								{
									"name":         "foobar",
									"title":        "Foobar",
									"description":  "",
									"applicable":   true,
									"inputType":    "expandable",
									"defaultValue": [],
									"axis":         "fooAxis",
									"hints":        {
										"dimension": 1
									},
									"options":      [
										{
											"name":         null,
											"title":        "",
											"description":  "",
											"applicable":   true,
											"inputType":    "float",
											"defaultValue": 0,
											"allowNull":    false
										}
									]
								}
							]
						}
					]
				},
				{
					"name":        "ui7",
					"title":       "Ui7",
					"description": "",
					"applicable":  true,
					"options":     [
						{
							"name":        "parent",
							"title":       "Parent",
							"description": "",
							"applicable":  true,
							"hints":       {
								"dimension": 2
							},
							"options":     [
								{
									"name":         "goo",
									"title":        "Goo",
									"description":  "",
									"applicable":   true,
									"inputType":    "expandable",
									"defaultValue": [],
									"axis":         "gooAxis",
									"hints":        {
										"dimension": 1
									},
									"options":      [
										{
											"name":         "device",
											"title":        "Device",
											"description":  "",
											"applicable":   true,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "deviceAxis",
											"options":      [
												{
													"name":         "model",
													"title":        "Model",
													"description":  "",
													"applicable":   true,
													"inputType":    "expandable",
													"defaultValue": [],
													"axis":         "modelAxis",
													"options":      [
														{
															"name":         null,
															"title":        "",
															"description":  "",
															"applicable":   true,
															"inputType":    "float",
															"defaultValue": 0,
															"allowNull":    false
														}
													]
												}
											]
										},
										{
											"name":         "minimum",
											"title":        "Minimum",
											"description":  "",
											"applicable":   true,
											"inputType":    "float",
											"defaultValue": 0,
											"allowNull":    false
										},
										{
											"name":         "maximum",
											"title":        "Maximum",
											"description":  "",
											"applicable":   true,
											"inputType":    "float",
											"defaultValue": 0,
											"allowNull":    false
										}
									]
								},
								{
									"name":        "foobar",
									"title":       "Foobar",
									"description": "",
									"applicable":  true,
									"hints":       {
										"dimension": 1
									},
									"options":     [
										{
											"name":         "device",
											"title":        "Device",
											"description":  "",
											"applicable":   true,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "deviceAxis",
											"options":      [
												{
													"name":         "model",
													"title":        "Model",
													"description":  "",
													"applicable":   true,
													"inputType":    "expandable",
													"defaultValue": [],
													"axis":         "modelAxis",
													"options":      [
														{
															"name":         null,
															"title":        "",
															"description":  "",
															"applicable":   true,
															"inputType":    "float",
															"defaultValue": 0,
															"allowNull":    false
														}
													]
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					"name":        "ui8",
					"title":       "Ui8",
					"description": "",
					"applicable":  true,
					"options":     [
						{
							"name":        "parent",
							"title":       "RBC Ratio Limits",
							"description": "The RBC Ratio Limits allow investment strategies which breach a specified RBC ratio to be excluded from the optimization results, where RBC ratio = market value of assets / RBC requirement.",
							"applicable":  true,
							"hints":       {
								"dimension": 2
							},
							"options":     [
								{
									"name":        "pathStatistic",
									"title":       "Path Statistic",
									"description": "",
									"applicable":  true,
									"options":     [
										{
											"name":         "statistic",
											"title":        "Statistic",
											"description":  "",
											"applicable":   true,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "limitAxis",
											"hints":        {
												"dimension": 1
											},
											"options":      [
												{
													"name":         null,
													"title":        "",
													"description":  "",
													"applicable":   true,
													"inputType":    "exclusive",
													"defaultValue": "min",
													"options":      [
														{
															"name":        "min",
															"title":       "Minimum",
															"description": "",
															"applicable":  true,
															"inputType":   "string"
														},
														{
															"name":        "max",
															"title":       "Maximum",
															"description": "",
															"applicable":  true,
															"inputType":   "string"
														},
														{
															"name":        "mean",
															"title":       "Mean",
															"description": "",
															"applicable":  true,
															"inputType":   "string"
														},
														{
															"name":        "percentile",
															"title":       "Percentile",
															"description": "",
															"applicable":  true,
															"inputType":   "string"
														},
														{
															"name":        "cte",
															"title":       "CTE",
															"description": "",
															"applicable":  true,
															"inputType":   "string"
														}
													]
												}
											]
										},
										{
											"name":         "area",
											"title":        "Area",
											"description":  "",
											"applicable":   false,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "limitAxis",
											"hints":        {
												"dimension": 1
											},
											"options":      [
												{
													"name":         null,
													"title":        "",
													"description":  "",
													"applicable":   true,
													"inputType":    "exclusive",
													"defaultValue": null,
													"options":      [
														{
															"name":        "under",
															"title":       "Under",
															"description": "",
															"applicable":  true,
															"inputType":   "string"
														},
														{
															"name":        "over",
															"title":       "Over",
															"description": "",
															"applicable":  true,
															"inputType":   "string"
														}
													]
												}
											]
										},
										{
											"name":         "percentile",
											"title":        "Percentile",
											"description":  "",
											"applicable":   false,
											"inputType":    "expandable",
											"defaultValue": [],
											"axis":         "limitAxis",
											"hints":        {
												"dimension": 1
											},
											"options":      [
												{
													"name":         null,
													"title":        "",
													"description":  "",
													"applicable":   true,
													"inputType":    "float",
													"defaultValue": null,
													"minimum":      0,
													"maximum":      1,
													"allowNull":    true,
													"hints":        {
														"percent": true
													}
												}
											]
										}
									]
								},
								{
									"name":         "mustBe",
									"title":        "Must Be",
									"description":  "",
									"applicable":   true,
									"inputType":    "expandable",
									"defaultValue": [],
									"axis":         "limitAxis",
									"hints":        {
										"dimension": 1
									},
									"options":      [
										{
											"name":         null,
											"title":        "",
											"description":  "",
											"applicable":   true,
											"inputType":    "exclusive",
											"defaultValue": ">",
											"options":      [
												{
													"name":        ">",
													"title":       ">",
													"description": "",
													"applicable":  true,
													"inputType":   "string"
												},
												{
													"name":        "<",
													"title":       "<",
													"description": "",
													"applicable":  true,
													"inputType":   "string"
												}
											]
										}
									]
								},
								{
									"name":         "limit",
									"title":        "Limit",
									"description":  "",
									"applicable":   true,
									"inputType":    "expandable",
									"defaultValue": [],
									"axis":         "limitAxis",
									"hints":        {
										"dimension": 1
									},
									"options":      [
										{
											"name":         null,
											"title":        "",
											"description":  "",
											"applicable":   true,
											"inputType":    "float",
											"defaultValue": 1,
											"minimum":      0,
											"maximum":      1,
											"allowNull":    false,
											"hints":        {
												"percent": true
											}
										}
									]
								},
								{
									"name":         "from",
									"title":        "From",
									"description":  "",
									"applicable":   true,
									"inputType":    "expandable",
									"defaultValue": [],
									"axis":         "limitAxis",
									"hints":        {
										"dimension": 1
									},
									"options":      [
										{
											"name":         null,
											"title":        "",
											"description":  "",
											"applicable":   true,
											"inputType":    "exclusive",
											"defaultValue": "startOfSimulation",
											"options":      [
												{
													"name":        "startOfSimulation",
													"title":       "Start Of Simulation",
													"description": "",
													"applicable":  true,
													"inputType":   "string"
												},
												{
													"name":        "selectedValue",
													"title":       "Selected Value",
													"description": "",
													"applicable":  true,
													"inputType":   "string"
												}
											]
										}
									]
								},
								{
									"name":         "fromSelectedValue",
									"title":        "Start Period",
									"description":  "",
									"applicable":   false,
									"inputType":    "expandable",
									"defaultValue": [],
									"axis":         "limitAxis",
									"hints":        {
										"dimension": 1
									},
									"options":      [
										{
											"name":         null,
											"title":        "",
											"description":  "",
											"applicable":   true,
											"inputType":    "exclusive",
											"defaultValue": 1,
											"globalListId": "timeHorizon"
										}
									]
								},
								{
									"name":         "to",
									"title":        "To",
									"description":  "",
									"applicable":   true,
									"inputType":    "expandable",
									"defaultValue": [],
									"axis":         "limitAxis",
									"hints":        {
										"dimension": 1
									},
									"options":      [
										{
											"name":         null,
											"title":        "",
											"description":  "",
											"applicable":   true,
											"inputType":    "exclusive",
											"defaultValue": "optimizationHorizon",
											"options":      [
												{
													"name":        "optimizationHorizon",
													"title":       "Optimization Horizon",
													"description": "",
													"applicable":  true,
													"inputType":   "string"
												},
												{
													"name":        "selectedValue",
													"title":       "Selected Value",
													"description": "",
													"applicable":  true,
													"inputType":   "string"
												}
											]
										}
									]
								},
								{
									"name":         "toSelectedValue",
									"title":        "End Period",
									"description":  "",
									"applicable":   false,
									"inputType":    "expandable",
									"defaultValue": [],
									"axis":         "limitAxis",
									"hints":        {
										"dimension": 1
									},
									"options":      [
										{
											"name":         null,
											"title":        "",
											"description":  "",
											"applicable":   true,
											"inputType":    "exclusive",
											"defaultValue": 1,
											"globalListId": "timeHorizon"
										}
									]
								}
							]
						}
					]
				}
			]
		}
	},
	"inputs":             {
		"examples": {
			"ui6": {
				"parent": {
					"goo":    [
						[
							6.7,
							7.7
						],
						[
							3.3,
							4.3
						],
						[
							8.9834,
							9.9834
						]
					],
					"foobar": [
						19.2,
						20.2
					]
				}
			},
			"ui4": {
				"parent": {
					"goo":    {
						"hoo": [
							0,
							0
						],
						"loo": [
							0,
							0
						],
						"koo": [
							0,
							0
						]
					},
					"foobar": [
						0,
						0
					]
				}
			},
			"ui5": {
				"parent": {
					"goo":    {
						"hoo": [
							0,
							0
						],
						"loo": [
							0,
							0
						],
						"koo": [
							0,
							0
						]
					},
					"foobar": [
						0,
						0
					]
				}
			},
			"ui7": {
				"parent": {
					"goo":    [
						{
							"minimum": 0,
							"device":  [
								{
									"model": [
										0,
										0
									]
								},
								{
									"model": [
										0,
										0
									]
								},
								{
									"model": [
										0,
										0
									]
								}
							],
							"maximum": 0
						},
						{
							"minimum": 0,
							"device":  [
								{
									"model": [
										0,
										0
									]
								},
								{
									"model": [
										0,
										0
									]
								},
								{
									"model": [
										0,
										0
									]
								}
							],
							"maximum": 0
						},
						{
							"minimum": 0,
							"device":  [
								{
									"model": [
										0,
										0
									]
								},
								{
									"model": [
										0,
										0
									]
								},
								{
									"model": [
										0,
										0
									]
								}
							],
							"maximum": 0
						}
					],
					"foobar": {
						"device": [
							{
								"model": [
									0,
									0
								]
							},
							{
								"model": [
									0,
									0
								]
							},
							{
								"model": [
									0,
									0
								]
							}
						]
					}
				}
			},
			"ui3": {
				"parent": {
					"goo":    {
						"hoo": 0,
						"loo": 0,
						"koo": 0
					},
					"foobar": 0
				}
			},
			"ui8": {
				"parent": {
					"mustBe":            [
						">",
						">"
					],
					"fromSelectedValue": [
						"1",
						"1"
					],
					"to":                [
						"optimizationHorizon",
						"optimizationHorizon"
					],
					"from":              [
						"startOfSimulation",
						"startOfSimulation"
					],
					"toSelectedValue":   [
						"1",
						"1"
					],
					"pathStatistic":     {
						"percentile": [
							null,
							null
						],
						"area":       [
							null,
							null
						],
						"statistic":  [
							"min",
							"min"
						]
					},
					"limit":             [
						1,
						1
					]
				}
			}
		}
	},
	"globalLists":        {
		"timeHorizon": [
			{
				"name":  1,
				"title": "Unspecified ..."
			}
		]
	},
	"validationMessages": [
		{
			"messageText": "Test Validation",
			"messageType": "Error",
			"paths":       [
				[
					"examples",
					"ui6",
					"parent",
					"goo",
					0,
					0
				]
			]
		}
	]
}

// The examples (excluding the RBC Table example) are generated from following Julia code

/*


using JSON
using OrderedCollections
using UserInterfaces

example_1 =
Node(
    Parent,
    :ui1,
    nodes =
    Node(
        Parent,
        :parent,
        nodes = [
            Node(
                Parent,
                :goo,
                nodes = [
                    Node(
                        Float64,
                        :hoo
                    ),
                    Node(
                        Float64,
                        :koo
                    ),
                    Node(
                        Float64,
                        :loo,
                        name = "loo other input is kind of long"
                    ),
                ]
            ),
            Node(
                Float64,
                :foobar
            )
        ]
    )
)
ui_1 = UserInterface(example_1[2])
set_data!(ui_1, Path([:parent, :goo, :hoo]), 6.7)
set_data!(ui_1, Path([:parent, :goo, :koo]), 3.3)
set_data!(ui_1, Path([:parent, :goo, :loo]), 8.9834)
set_data!(ui_1, Path([:parent, :foobar]), 19.2)
json_1 = JSON.json(get_ui_state(ui_1))

example_2 =
Node(
    Parent,
    :ui2,
    nodes =
    Node(
        Parent,
        :parent,
        nodes = [
            Node(
                Parent,
                :goo,
                hints = :dimension => 1,
                nodes = [
                    Node(
                        Float64,
                        :hoo
                    ),
                    Node(
                        Float64,
                        :koo
                    ),
                    Node(
                        Float64,
                        :loo,
                        name = "Loo other input is kind of long"
                    ),
                ]
            ),
            Node(
                Float64,
                :foobar
            )
        ]
    )
)

ui_2 = UserInterface(example_2[2])
set_data!(ui_2, Path([:parent, :goo, :hoo]), 6.7)
set_data!(ui_2, Path([:parent, :goo, :koo]), 3.3)
set_data!(ui_2, Path([:parent, :goo, :loo]), 8.9834)
set_data!(ui_2, Path([:parent, :foobar]), 19.2)
json_2 = JSON.json(get_ui_state(ui_2))

example_3 =
Node(
    Parent,
    :ui3,
    nodes =
    Node(
        Parent,
        :parent,
        hints = :dimension => 1,
        nodes = [
            Node(
                Parent,
                :goo,
                nodes = [
                    Node(
                        Float64,
                        :hoo
                    ),
                    Node(
                        Float64,
                        :koo
                    ),
                    Node(
                        Float64,
                        :loo,
                        name = "Loo other input is kind of long"
                    ),
                ]
            ),
            Node(
                Float64,
                :foobar
            )
        ]
    )
)
ui_3 = UserInterface(example_3[2])
set_data!(ui_3, Path([:parent, :goo, :hoo]), 6.7)
set_data!(ui_3, Path([:parent, :goo, :koo]), 3.3)
set_data!(ui_3, Path([:parent, :goo, :loo]), 8.9834)
set_data!(ui_3, Path([:parent, :foobar]), 19.2)
json_3 = JSON.json(get_ui_state(ui_3))

example_4 =
Node(
    Parent,
    :ui4,
    nodes =
    Node(
        Parent,
        :parent,
        hints = :dimension => 1,
        nodes = [
            Node(
                Parent,
                :goo,
                nodes = [
                    Node(
                        Vector{Float64},
                        :hoo,
                        axis    = :foo_axis,
                        hints   = :dimension => 2,
                        nodes   = Node(Float64, nothing)
                    ),
                    Node(
                        Vector{Float64},
                        :koo,
                        axis    = :foo_axis,
                        hints   = :dimension => 2,
                        nodes   = Node(Float64, nothing)
                    ),
                    Node(
                        Vector{Float64},
                        :loo,
                        name = "Loo other input is kind of long",
                        axis    = :foo_axis,
                        hints   = :dimension => 2,
                        nodes   = Node(Float64, nothing)
                    ),
                ]
            ),
            Node(
                Vector{Float64},
                :foobar,
                axis    = :foo_axis,
                hints   = :dimension => 2,
                nodes   = Node(Float64, nothing)
            )
        ]
    )
)

ui_4 = UserInterface(example_4[2])
add_row!(ui_4, :foo_axis)
add_row!(ui_4, :foo_axis)
set_data!(ui_4, Path([:parent, :goo, :hoo, 1]), 6.7)
set_data!(ui_4, Path([:parent, :goo, :koo, 1]), 3.3)
set_data!(ui_4, Path([:parent, :goo, :loo, 1]), 8.9834)
set_data!(ui_4, Path([:parent, :foobar, 1]), 19.2)
set_data!(ui_4, Path([:parent, :goo, :hoo, 2]), 7.7)
set_data!(ui_4, Path([:parent, :goo, :koo, 2]), 4.3)
set_data!(ui_4, Path([:parent, :goo, :loo, 2]), 9.9834)
set_data!(ui_4, Path([:parent, :foobar, 2]), 20.2)
json_4 = JSON.json(get_ui_state(ui_4))

example_5 =
Node(
    Parent,
    :ui5,
    nodes =
    Node(
        Parent,
        :parent,
        hints = :dimension => 2,
        nodes = [
            Node(
                Parent,
                :goo,
                nodes = [
                    Node(
                        Vector{Float64},
                        :hoo,
                        axis    = :foo_axis,
                        hints   = :dimension => 1,
                        nodes   = Node(Float64, nothing)
                    ),
                    Node(
                        Vector{Float64},
                        :koo,
                        axis    = :foo_axis,
                        hints   = :dimension => 1,
                        nodes   = Node(Float64, nothing)
                    ),
                    Node(
                        Vector{Float64},
                        :loo,
                        name = "Loo other input is kind of long",
                        axis    = :foo_axis,
                        hints   = :dimension => 1,
                        nodes   = Node(Float64, nothing)
                    ),
                ]
            ),
            Node(
                Vector{Float64},
                :foobar,
                axis    = :foo_axis,
                hints   = :dimension => 1,
                nodes   = Node(Float64, nothing)
            )
        ]
    )
)

ui_5 = UserInterface(example_5[2])
add_row!(ui_5, :foo_axis)
add_row!(ui_5, :foo_axis)
set_data!(ui_5, Path([:parent, :goo, :hoo, 1]), 6.7)
set_data!(ui_5, Path([:parent, :goo, :koo, 1]), 3.3)
set_data!(ui_5, Path([:parent, :goo, :loo, 1]), 8.9834)
set_data!(ui_5, Path([:parent, :foobar, 1]), 19.2)
set_data!(ui_5, Path([:parent, :goo, :hoo, 2]), 7.7)
set_data!(ui_5, Path([:parent, :goo, :koo, 2]), 4.3)
set_data!(ui_5, Path([:parent, :goo, :loo, 2]), 9.9834)
set_data!(ui_5, Path([:parent, :foobar, 2]), 20.2)
json_5 = JSON.json(get_ui_state(ui_5))

example_6 =
Node(
    Parent,
    :ui6,
    nodes =
    Node(
        Parent,
        :parent,
        hints = :dimension => 2,
        nodes = [
            Node(
                Vector{Vector{Float64}},
                :goo,
                axis    = :goo_axis,
                nodes = Node(
                    Vector{Float64},
                    nothing;
                    axis    = :foo_axis,
                    hints   = :dimension => 1,
                    nodes   = Node(Float64, nothing)
                )
            ),
            Node(
                Vector{Float64},
                :foobar,
                axis    = :foo_axis,
                hints   = :dimension => 1,
                nodes   = Node(Float64, nothing)
            )
        ]
    )
)

ui_6 = UserInterface(example_6[2])
add_row!(ui_6, :goo_axis, :goo1)
add_row!(ui_6, :goo_axis, :goo2)
add_row!(ui_6, :goo_axis, :goo3)
add_row!(ui_6, :foo_axis)
add_row!(ui_6, :foo_axis)
set_data!(ui_6, Path([:parent, :goo, 1, 1]), 6.7)                                        # goo1, 1
set_data!(ui_6, Path([:parent, :goo, 2, 1]), 3.3)                                        # goo2, 1
set_data!(ui_6, Path([:parent, :goo, 3, 1]), 8.9834)                                     # goo3, 1
set_data!(ui_6, Path([:parent, :foobar, 1]), 19.2)
set_data!(ui_6, Path([:parent, :goo, 1, 2]), 7.7)
set_data!(ui_6, Path([:parent, :goo, 2, 2]), 4.3)
set_data!(ui_6, Path([:parent, :goo, 3, 2]), 9.9834)
set_data!(ui_6, Path([:parent, :foobar, 2]), 20.2)
json_6 = JSON.json(get_ui_state(ui_6))

# example_7 =
# Node(
#     Parent,
#     :parent,
#     hints = :dimension => 2,
#     nodes = [
#         Node(
#             Vector{OrderedDict{Symbol, Any}},
#             :goo,
#             axis    = :goo_axis;
#             hints   = :dimension => 1,
#             nodes   = Node(
#                 Parent,
#                 nothing;
#                 nodes = [
#                     Node(
#                         Vector{Float64},
#                         :device;
#                         axis = :device_axis,
#                         nodes = Node(Float64, nothing)
#                     ),
#                     Node(Float64, :minimum),
#                     Node(Float64, :maximum)
#                 ]
#             )
#         ),
#         Node(
#             Vector{Float64},
#             :foobar;
#             axis    = :device_axis,
#             hints   = :dimension => 1,
#             nodes   = Node(Float64, nothing)
#         ),
#     ]
# )
#
# ui_7 = UserInterface(example_7[2])
# add_row!(ui_7, :goo_axis, :goo1)
# add_row!(ui_7, :goo_axis, :goo2)
# add_row!(ui_7, :goo_axis, :goo3)
# add_row!(ui_7, :device_axis, :Computers)
# add_row!(ui_7, :device_axis, :Tablets)
# add_row!(ui_7, :device_axis, :Phones)
# set_data!(ui_7, Path([:parent, :goo, 1, :device, 1]), 6.7)
# set_data!(ui_7, Path([:parent, :goo, 1, :device, 2]), 7.7)
# set_data!(ui_7, Path([:parent, :goo, 1, :device, 3]), 6.7)
# set_data!(ui_7, Path([:parent, :goo, 1, :minimum]), 2.2)
# set_data!(ui_7, Path([:parent, :goo, 1, :maximum]), 2.3)
# set_data!(ui_7, Path([:parent, :goo, 2, :device, 1]), 3.3)
# set_data!(ui_7, Path([:parent, :goo, 2, :device, 2]), 4.3)
# set_data!(ui_7, Path([:parent, :goo, 2, :device, 3]), 3.3)
# set_data!(ui_7, Path([:parent, :goo, 2, :minimum]), 4.3)
# set_data!(ui_7, Path([:parent, :goo, 2, :maximum]), 2.1)
# set_data!(ui_7, Path([:parent, :foobar, 1]), 20.2)
# set_data!(ui_7, Path([:parent, :foobar, 2]), 20.2)
# set_data!(ui_7, Path([:parent, :foobar, 3]), 20.2)


example_7 =
Node(
    Parent,
    :ui7,
    nodes =
    Node(
        Parent,
        :parent,
        hints = :dimension => 2,
        nodes = [
            Node(
                Vector{OrderedDict{Symbol, Any}},
                :goo,
                axis    = :goo_axis;
                hints   = :dimension => 1,
                nodes   = Node(
                    Parent,
                    nothing;
                    nodes = [
                        Node(
                            Vector{OrderedDict{Symbol, Any}},
                            :device;
                            axis = :device_axis,
                            nodes = Node(
                                Parent,
                                nothing;
                                nodes = [
                                    Node(
                                        Vector{Float64},
                                        :model;
                                        axis = :model_axis,
                                        nodes = Node(Float64, nothing)
                                    )
                                ]
                            )
                        ),
                        Node(Float64, :minimum),
                        Node(Float64, :maximum)
                    ]
                )
            ),
            Node(
                Parent,
                :foobar;
                hints   = :dimension => 1,
                nodes   =
                    Node(
                        Vector{OrderedDict{Symbol, Any}},
                        :device;
                        axis = :device_axis,
                        nodes = Node(
                            Parent,
                            nothing;
                            nodes = [
                                Node(
                                    Vector{Float64},
                                    :model;
                                    axis = :model_axis,
                                    nodes = Node(Float64, nothing)
                                )
                            ]
                        )
                    ),
                )
        ]
    )
)

ui_7 = UserInterface(example_7[2])
add_row!(ui_7, :goo_axis, :goo1)
add_row!(ui_7, :goo_axis, :goo2)
add_row!(ui_7, :goo_axis, :goo3)
add_row!(ui_7, :device_axis, :Computers)
add_row!(ui_7, :device_axis, :Tablets)
add_row!(ui_7, :device_axis, :Phones)
add_row!(ui_7, :model_axis, :Model1)
add_row!(ui_7, :model_axis, :Model2)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 1, :model, 1]), 6.7)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 1, :model, 2]), 6.7)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 2, :model, 1]), 6.7)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 2, :model, 2]), 6.7)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 3, :model, 1]), 6.7)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 3, :model, 2]), 6.7)
set_data!(ui_7, Path([:parent, :goo, 1, :minimum]), 2.2)
set_data!(ui_7, Path([:parent, :goo, 1, :maximum]), 2.3)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 1, :model, 1]), 3.3)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 1, :model, 2]), 4.3)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 2, :model, 1]), 3.3)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 2, :model, 2]), 4.3)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 3, :model, 1]), 3.3)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 3, :model, 2]), 4.3)
set_data!(ui_7, Path([:parent, :goo, 1, :minimum]), 2.0)
set_data!(ui_7, Path([:parent, :goo, 1, :maximum]), 2.3)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 1, :model, 1]), 9.0)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 1, :model, 2]), 10.0)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 2, :model, 1]), 9.0)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 2, :model, 2]), 10.0)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 3, :model, 1]), 9.0)
set_data!(ui_7, Path([:parent, :goo, 1, :device, 3, :model, 2]), 10.0)
set_data!(ui_7, Path([:parent, :goo, 1, :minimum]), 10.0)
set_data!(ui_7, Path([:parent, :goo, 1, :maximum]), 11.0)
set_data!(ui_7, Path([:parent, :foobar, :device, 1, :model, 1]), 1)
set_data!(ui_7, Path([:parent, :foobar, :device, 1, :model, 2]), 2)
set_data!(ui_7, Path([:parent, :foobar, :device, 2, :model, 1]), 3)
set_data!(ui_7, Path([:parent, :foobar, :device, 2, :model, 2]), 4)
set_data!(ui_7, Path([:parent, :foobar, :device, 3, :model, 1]), 5)
set_data!(ui_7, Path([:parent, :foobar, :device, 3, :model, 2]), 6)
json_7 = JSON.json(get_ui_state(ui_7))

all_json = JSON.json(OrderedDict(
    :example1 => get_ui_state(ui_1),
    :example2 => get_ui_state(ui_2),
    :example3 => get_ui_state(ui_3),
    :example4 => get_ui_state(ui_4),
    :example5 => get_ui_state(ui_5),
    :example6 => get_ui_state(ui_6),
    :example7 => get_ui_state(ui_7),
), 4)
open("json_examples.json","w") do io
   write(io, all_json)
end


In IOMonitor.js
    add_row!(user_interface, :goo_axis, :goo1)
    add_row!(user_interface, :goo_axis, :goo2)
    add_row!(user_interface, :goo_axis, :goo3)
    add_row!(user_interface, :foo_axis)
    add_row!(user_interface, :foo_axis)
    set_data!(user_interface, Path([:optimization_target, :ui6, :parent, :goo, 1, 1]), 6.7)                                        # goo1, 1
    set_data!(user_interface, Path([:optimization_target,:ui6, :parent, :goo, 2, 1]), 3.3)                                        # goo2, 1
    set_data!(user_interface, Path([:optimization_target,:ui6, :parent, :goo, 3, 1]), 8.9834)                                     # goo3, 1
    set_data!(user_interface, Path([:optimization_target,:ui6, :parent, :foobar, 1]), 19.2)
    set_data!(user_interface, Path([:optimization_target,:ui6, :parent, :goo, 1, 2]), 7.7)
    set_data!(user_interface, Path([:optimization_target,:ui6, :parent, :goo, 2, 2]), 4.3)
    set_data!(user_interface, Path([:optimization_target,:ui6, :parent, :goo, 3, 2]), 9.9834)
    set_data!(user_interface, Path([:optimization_target,:ui6, :parent, :foobar, 2]), 20.2)

    add_row!(user_interface, :device_axis, :Computers)
    add_row!(user_interface, :device_axis, :Tablets)
    add_row!(user_interface, :device_axis, :Phones)
    add_row!(user_interface, :model_axis, :Model1)
    add_row!(user_interface, :model_axis, :Model2)


 */