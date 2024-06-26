export interface InputOption {
	name: string;
	title?: string;
	description?: string;
	applicable?: boolean;
	options?: Array<InputOption>;
	inputType?: "float" | "integer" | "percentage" | "boolean" | "exclusive" | "simulation" | "repository" | "repositoryValue" | "userValue" | "assetClassValue";
	defaultValue?: number | string | boolean;
	minimum?: number;
	maximum?: number;
	details?: any;
}

export const mockInputOptions: {[key: string]: InputOption} = {
	assetClasses: {
		name: "assetClasses",
		applicable: true,
		options: [
			{
				name: "color",
				title: "Color",
				applicable: true
			},
			{
				name: "returnSource",
				title: "Return Source",
				inputType: "assetClassValue",
				applicable: true
			},
			{
				name: "constraintsAndDuration",
				title:"Constraints and Duration",
				applicable: true,
				options: [
					{
						name: "classConstraints",
						title:"Class Constraints",
						applicable: true,
						options: [
							{
								name: "minimum",
								title:"Minimum Allocation (%)",
								applicable: true
							},
							{
								name: "maximum",
								title:"Maximum Allocation (%)",
								applicable: true
							}
						]
					},
					{
						name: "duration",
						title: "Duration (Years)",
						applicable: true,
					},
					{
						name: "multiClassConstraints",
						title:"Multi-Class Constraints",
						applicable: true,
					}
				]
			},
			{
				name: "additionalAllocations",
				title: "Additional Allocations (%)",
				applicable: true,
			},
			{
				name: "values",
				title: "Values",
				applicable: true,
				options: [
					{
						name: "marketValue",
						title: "Market Value",
						applicable: true,
					},
					{
						name: "bookValue",
						title: "Book Value",
						applicable: true,
					},
					{
						name: "bookValueHAC",
						title: "Book Value HAC",
						applicable: true,
					}
				]
			},
			{
				name: "taxes",
				title: "Taxes",
				applicable: true,
				options: [
					{
						name: "taxBasis",
						title: "Tax Basis",
						applicable: true
					},
					{
						name: "taxExemptShare",
						title: "Tax Exempt Share (%)",
						applicable: true
					}
				]
			},
			{
				name: "bondCreditRisk",
				title: "Bond Credit Risk",
				applicable: true,
				options: [
					{
						name: "rating",
						title: "Rating",
						applicable: true
					},
					{
						name: "defaultMarketValueAdjustment",
						title: "Default Market Value Adjustment",
						applicable: true
					}
				]
			},
			{
				name: "tradingAndTurnover",
				title: "Trading and Turnover",
				applicable: true,
				options: [
					{
						name: "assetManagementFees",
						title: "Asset Management Fees (%)",
						applicable: true
					},
					{
						name: "transactionCosts",
						title: "Transaction Costs (%)",
						applicable: true
					},
					{
						name: "turnoverShare",
						title: "Turnover Share (%)",
						applicable: true
					},
					{
						name: "turnoverAtCostValue",
						title: "Turnover at Cost Value",
						applicable: true
					},
					{
						name: "maintainAtCostValue",
						title: "Maintain at Cost Value",
						applicable: true
					},
					{
						name: "migrationShare",
						title: "Migration Share (%)",
						applicable: true
					},
					{
						name: "migrationTargetAssetClass",
						title: "Migration Target Asset Class",
						inputType: "assetClassValue",
						applicable: true
					},
					{
						name: "upTolerance",
						title: "Up Tolerance (%)",
						applicable: true
					},
					{
						name: "downTolerance",
						title: "Down Tolerance (%)",
						applicable: true
					}
				]
			},
			{
				name: "imrAmoritizationSchedule",
				title: "IMR Amortization Schedule (by year)",
				applicable: true,
			},
			{
				name: "allocationTolerances",
				title: "Allocation Tolerances",
				applicable: true,
				options: [
					{
						name: "down",
						title: "Down",
						applicable: true
					},
					{
						name: "up",
						title: "Up",
						applicable: true
					}
				]
			},
			{
				name: "buySellSequences",
				title: "Buy/Sell Sequences",
				applicable: true,
				options: [
					{
						name: "buy",
						title: "Buy",
						applicable: true
					},
					{
						name: "sell",
						title: "Sell",
						applicable: true
					}
				]
			}
		]
	},
	surplusManagement: {
		name: "surplusManagement",
		description: "",
		applicable: true,
		options: [
			{
				name: "surplusRBC",
				title: "Surplus as a function of RBC:",
				description: "Surplus is managed by specifying a minimum value (that must be maintained at all times), a target value and a maximum value (that must never be exceeded). These values are specified as a function of Risk-Based Capital (RBC). Two equivalent functions are available for ease of input, and both are displayed and kept in sync. These two functions are the simple ratio, Surplus / RBC, and “BCAR-style”, (Surplus – RBC) / Surplus. The latter can be thought of as the fraction of total surplus not needed to satisfy RBC.\n" +
					             "\n" +
					             "If and when surplus would otherwise fall below the minimum a capital infusion will be used, if necessary, to achieve the minimum (expressed as a negative value for distribution of earnings). To the extent that cash is available it will be invested up to the point where the target is achieved. Cash available above that required to achieve target is distributed (positive value for distribution of earnings). To the extent that the distribution of available cash still leaves surplus above the maximum, sufficient assets are sold and the proceeds distributed (positive value for distribution of earnings) to achieve the maximum.\n",
				applicable: true,
				options: [
					{name: "minimum", inputType: "float", defaultValue: 0.0, minimum: 0, maximum: 1},
					{name: "target",  inputType: "float", defaultValue: 0.0, minimum: 0, maximum: 1},
					{name: "maximum", inputType: "float", defaultValue: 0.0, minimum: 0, maximum: 1}
				]
			},
			{
				name: "effectiveMinimumSurplus",
				title: "Minimum Surplus Becomes Effective: ",
				description: "The effect of the minimum surplus (capital infusion) can be optionally delayed. When delayed, a minimum Surplus / RBC ratio of 1 is still enforced.",
				applicable: true,
				inputType: "exclusive",
				options:  [
					{
						name:       "immediately",
						title:       "Immediately",
						description: "Capital infusions (expressed as a negative value for distribution of earnings) will always be used as necessary to achieve the minimum surplus (as minimum surplus is defined above and relative to RBC."
					},
					{
						name:        "minimumSurplusReached",
						title:       "Once Minimum Surplus is Reached",
						description: "Cashflow will be used to increase surplus. Once the minimum surplus is achieved, from that point forward capital infusions will be used as necessary to achieve the minimum surplus. Until such time, capital infusions will only be used as necessary to achieve a Surplus / RBC ratio of 1."
					},
					{
						name:        "targetSurplusReached",
						title:       "Once Target Surplus is Reached",
						description: "Cashflow will be used to increase surplus. Once the target surplus is achieved, from that point forward capital infusions will be used as necessary to achieve the minimum surplus. Until such time, capital infusions will only be used as necessary to achieve a Surplus / RBC ratio of 1."
					}
				]
			},
			{
				name:           "estimatedRBCBasis",
				title:          "Estimated RBC is based on the Asset Allocation:",
				description:    "The minimum, target and maximum surplus values depend on RBC which in turn depends on the asset portfolio. For the purpose of surplus management an estimate of RBC used. Choices are available that range from the least expensive (shorted run-time) and least accurate to the most expensive (longest run-time) and most accurate. Caution should be used when using any choice other than the most expensive Expected End of Period option (which is the default).",
				inputType:      "exclusive",
				applicable:     true,
				options:        [
					{
						name:       "startOfPeriod",
						title:       "At Start of Period",
						description: "RBC is computed based on the asset allocation at the start of the period before any price returns, turnovers or migrations."
					},
					{
						name:       "afterPriceReturns",
						title:       "After Price Returns before Turnover",
						description: "RBC is computed based on the asset allocation at the start of the period plus any price returns on marked-to-market asset classes but before any turnovers or migrations."
					},
					{
						name:       "afterTurnover",
						title:       "After Turnover before Migration",
						description: "RBC is computed based on the asset allocation at the start of the period plus any price returns on marked-to-market asset classes and after any turnovers but before any migrations."
					},
					{
						name:       "afterMigration",
						title:       "After Migration",
						description: "RBC is computed based on the asset allocation at the start of the period plus any price returns on marked-to-market asset classes, any turnovers and any migrations."
					},
					{
						name:       "endOfPeriod",
						title:       "Expected at End of Period",
						description: "RBC is computed based on a good estimate of the ending asset allocation considering price returns, turnovers, migrations and the approximate effects of any portfolio rebalancing."
					},
				]
			}
		]
	},
	optimizationTarget: {
		name:   "optimizationTarget",
		applicable: true,
		options: [
			{
				name:    "outcome",
				title:   "Outcome:",
				inputType: "exclusive",
				applicable: true,
				description: "Asset optimization results in an efficient frontier of possible asset allocations ranging from low-risk asset allocations to high-reward asset allocations. This requires definitions of risk and reward. A specified outcome is evaluated on each of a number of future scenarios, producing a vector of outcomes. " +
					             "Functions are then applied to this vector of outcomes to reduce this vector down to two values, the risk and the reward. \n\n First, an Outcome must be chosen from the list below.",
				options:    [
					{
						name:       "assetValue",
						title:       "Asset Value",
						description: "The value of the asset portfolio at the end of the simulation horizon."
					},
					{
						name:       "economicValue",
						title:       "Economic Value",
						description: "The economic value of the enterprise (assets minus liabilities) at the end of the simulation horizon."
					},
					{
						name:       "presentValueOfDistributableEarnings",
						title:       "Present Value of Distributable Earnings",
						description: "The present value of the future cash flows to shareholders from earnings that may be distributed."
					},
					{
						name:       "presentValueOfProfitsAfterRiskCapital",
						title:       "Present Value Of Profits After Risk Capital",
						description: "The present value of future profits after allowing for risk capital."
					},
					{
						name:       "bookValue",
						title:       "Book Value",
						description: "The book value of the enterprise (assets minus liabilities) at the end of the simulation horizon.",
					},
					{
						name:       "bookReturn",
						title:       "Book Return",
						description: "The book return of the enterprise (assets minus liabilities) over the span of the simulation to the horizon."
					}
				]
			},
			{
				name:    "accountingStandard",
				title:   "Accounting Standard:",
				inputType: "exclusive",
				applicable: true,
				options: [
					{name: "USGAAP", title: "US GAAP"},
					{name: null, title: "Unspecified"}
				]
			},
			{
				name:            "rewardMeasure",
				title:           "Reward Measure:",
				description: "Next, the functions for the risk and reward measures are specified, together with any required parameters to those functions:",
				applicable: true,
				options: [{
					name:    "function",
					inputType: "exclusive",
					applicable: true,
					options: [
						{name: "average", title: "Average"},
						{name: "percentile", title: "Percentile"},
					]
				},
				{
					name: "percentile",
					inputType: "percentage",
					title: "Percentile",
					applicable: true,
					defaultValue: 50
				}]
			},
			{
				name:            "riskMeasure",
				title:           "Risk Measure:",
				applicable: true,
				options:         [
					{
						name:    "function",
						inputType: "exclusive",
						applicable: true,
						options: [
							{name: "average", title: "Average"},
							{name: "standardDeviation", title: "Standard Deviation"},
							{name: "coefficientOfVariation ", title: "Coefficient of Variation"},
							{name: "percentage", title: "Percentile"},
							{name: "semiStandardDeviation", title: "Semi Standard Deviation"},
							{name: "conditionalStandardDeviation", title: "Conditional Standard Deviation"}
						]
					},
					{
						name: "area",
						inputType: "exclusive",
						applicable: true,
						options: [
							{
								name:   "over",
								title:   "Over"
							},
							{
								name: "under",
								title: "Under"
							}
						]
					},
					{
						name: "thresholdType",
						inputType: "exclusive",
						applicable: true,
						options: [
							{name: "average", title: "Average"},
							{name: "percentile", title: "Percentile"},
							{name: "fixed", title: "Fixed"},
						]
					},
					{
						name: "percentage",
						title: "Percentile",
						inputType: "percentage",
						applicable: true,
						defaultValue: 50
					},
					{
						name: "fixed",
						title: "Fixed",
						inputType: "float",
						applicable: true,
						defaultValue: 0
					}
				]
			}
		]
	},
	dataSources: {
		name: "dataSources",
		title: "Data Sources",
		applicable: true,
		options: [
			{
				name: "assetReturns",
				title: "Asset Returns:",
				applicable: true,
				options: [
					{
						name: "sourceType",
						inputType: "exclusive",
						applicable: true,
						options: [{name: "simulation", title: "Simulation"}, {name: "repository", title: "Repository"}]
					},
					{
						name: "simulation",
						inputType: "simulation",
						applicable: true
					},
					{
						name: "repository",
						inputType: "repository",
						applicable: true,
					}
				]
			},
			{
				name: "companyData",
				title: "Company Data (Mock):",
				applicable: true,
				options: [
					{
						name: "useSimulation",
						inputType: "boolean",
						applicable: true
					},
					{
						name: "useRepository",
						inputType: "boolean",
						applicable: true
					},
					{
						name: "simulation",
						inputType: "simulation",
						applicable: true,
					},
					{
						name: "repository",
						inputType: "repository",
						applicable: true
					},
					{
						name: "entity",
						applicable: true,
						options: [{name: "USLife", title: "US Life"}, {name: "US Life2", title: "US Life2"}]
					},
					{
						name: "portfolio",
						applicable: true,
						options: [{name: "US Holdings", title: "US Holdings"}, {name: "aggregateHoldings", title: "Aggregate Holdings"}]
					}
				],
			},
			{
				name: "timeHorizon",
				title: "Time Horizon (Mock):",
				applicable: true,
				options: [{name: "periods", minimum: 0, maximum: 20}],
				details: {
					periodicity: "years",
				}
			},
			{
				name: "scenarios",
				title: "Scenarios (Mock):",
				applicable: true,
				options: [{name: "scenarios", minimum: 0, maximum: 1000}]
			}
		]
	},
	optimizationControls: {
		name:    "optimizationControls",
		title:   "Optimization Controls",
		applicable: true,
		options: [
			{
				name: "lambdas",
				title: "Lambdas:",
				applicable: true,
				options: [
					{
						name: "from",
						inputType: "percentage",
						applicable: true,
						defaultValue: 0
					},
					{
						name: "to",
						inputType: "percentage",
						applicable: true,
						defaultValue: 100
					},
					{
						name: "increment",
						inputType: "percentage",
						applicable: true,
						defaultValue: 2
					},
					{
						name: "total",
						inputType: "integer",
						applicable: true,
						defaultValue: 2
					}
				]
			},
			{
				name: "maximumEvaluationsPerOptimizer",
				title: "Maximum Evaluations Per Optimizer:",
				inputType: "integer",
				applicable: true,
				defaultValue: 10000
			},
			{
				name: "allocationIncrement",
				title: "Allocation Increment:",
				inputType: "percentage",
				applicable: true,
				defaultValue: 1
			},
			{
				name: "numberOfRandomAllocations",
				title: "Number of Random Allocations:",
				applicable: true,
				options: [
					{
						name: "perAssetClass",
						inputType: "integer",
						applicable: true,
						defaultValue: 50
					},
					{
						name: "total",
						inputType: "integer",
						applicable: true
					}
				]
			},
			{
				name: "randomAllocationIncrement",
				title: "Random Allocation Increment:",
				inputType: "percentage",
				applicable: true,
				defaultValue: 1
			},
			{
				name: "randomSeed",
				title: "Random Seed:",
				inputType: "integer",
				applicable: true,
				defaultValue: 0
			}
		]
	},
	optimizationResources: {
		name:    "optimizationResources",
		title:   "Optimization Resources",
		applicable: true,
		options: [
			{
				name: "instance",
				title: "AWS EC2 Instance Type and Size (Mock):",
				applicable: true,
				options:
				[
					{
						name: "type",
						inputType: "exclusive",
						applicable: true,
						options: [
							{
								name: "c5",
								title: "c5"
							},
							{
								name: "r4",
								title: "r4"
							}
						]
					},
					{
						name: "size",
						inputType: "exclusive",
						applicable: true,
						options: [
							{
								name: "4",
								title: "4"
							},
							{
								name: "8",
								title: "8"
							}
						]
					}
				]
			},
			{
				name: "numberOfOptimizers",
				title: "Number of Optimizers (AWS EC2 Instances) :",
				inputType: "integer",
				applicable: true,
				defaultValue: 10
			}
		]
	},
	efficientFrontierSampling: {
		name:    "efficientFrontierSampling",
		title:   "Efficient Frontier Sampling",
		applicable: true,
		options: [
			{
				name: "approximateNumber",
				title: "Approximate Number:",
				inputType: "integer",
				defaultValue: 10,
				applicable: true
			},
			{
				name: "spacing",
				title: "Spacing:",
				inputType: "exclusive",
				applicable: true,
				options: [
					{
						name: "distanceAlongFrontier",
						title: "Distance along Frontier"
					},
					{
						name: "returnLevels",
						title: "Return Levels"
					},
					{
						name: "riskLevels",
						title: "Risk Levels"
					},
					{
						name: "all",
						title: "Show All"
					}
				]
			},
			{
				name: "slopeTolerance",
				title: "Slope Tolerance:",
				inputType: "float",
				applicable: true,
				defaultValue: 0
			}
		]
	},
	nonAssetFlowsAndValues: {
		name: "nonAssetFlowsAndValues",
		title: "Non-Asset Flows And Values",
		applicable: true,
		options: [
			{
				name: "netCashFlow",
				title: "Net:",
				applicable: true,
				options: [
					{
						name: "net",
						inputType: "exclusive",
						applicable: true,
						options: [
							{
								name: "before",
								title: "Before-Tax",
							},
							{
								name: "after",
								title: "After-Tax",
							}
						]
					},
					{
						name: "source",
						inputType: "exclusive",
						applicable: true,
						options: [
							{
								name:  "repository",
								title: "Repository"
							},
							{
								name:  "simulation",
								title: "Simulation"
							}
						]
					},
					{
						name: "simulationModule",
						inputType: "exclusive",
						applicable: true,
						options: [
							{
								name:  "cash",
								title: "Cash Accounting Module"
							},
							{
								name:  "userValue",
								title: "User Value"
							}
						]
					},
					{
						name: "repositoryValue",
						inputType: "repositoryValue",
						applicable: true
					},
					{
						name: "userValue",
						inputType: "userValue",
						applicable: true
					},
				]
			},
			{
				name: "netEconomicValue",
				title: "Net Economic Value:",
				applicable: true,
				options: [
					{
						name: "source",
						inputType: "exclusive",
						applicable: true,
						options: [
							{
								name:  "repository",
								title: "Repository"
							},
							{
								name:  "simulation",
								title: "Simulation"
							}
						]
					},
					{
						name: "simulationModule",
						inputType: "exclusive",
						applicable: true,
						options: [
							{
								name:  "economic",
								title: "Economic Accounting Module"
							},
							{
								name:  "userValue",
								title: "User Value"
							}
						]
					},
					{
						name: "userValue",
						inputType: "userValue",
						applicable: true
					},
					{
						name: "repositoryValue",
						inputType: "repositoryValue",
						applicable: true
					}
				]
			}
		]
	},
	interestRates: {
		name: "interestRates",
		title: "Interest Rates",
		applicable: true,
		options: [
			{
				name: "riskFreeRate",
				title: "Risk Free Rate(Mock):",
				applicable: true,
				options: [
					{
						name: "method",
						title: "Method",
						inputType: "exclusive",
						defaultValue: "fixedRate",
						applicable: true,
						options: [
							{
								name: "fixedRate",
								title: "Fixed Rate"
							},
							{
								name: "pointOnStartingYieldCurve",
								title: "Point on Starting Yield Curve"
							},
							{
								name: "pathSpecificPointOnYieldCurve",
								title: "Path Specific Point on Yield Curve"
							}
						]
					},
					{
						name: "interestRate",
						title: "Interest Rate",
						inputType: "float",
						defaultValue: 1,
						applicable: true
					},
					{
						name: "additiveSpread",
						title: "Additive Spread",
						inputType: "float",
						defaultValue: 1,
						applicable: true
					},
					{
						name: "multiplicativeFactor",
						title: "Multiplicative Factor",
						inputType: "float",
						defaultValue: 1,
						applicable: true
					},
					{
						name: "economy",
						title: "Economy",
						inputType: "exclusive",
						applicable: true,
						options: [
							{
								name: "us",
								title: "United States"
							},
							{
								name: "gb",
								title: "Great Britain"
							}
						]
					},
					{
						name: "tenor",
						title: "Tenor",
						inputType: "exclusive",
						applicable: true,
						options: [
							{
								name: "unspecified",
								title: "Unspecified"
							},
							{
								name: "overnight",
								title: "Overnight Rate"
							},
							{
								name: "1",
								title: "1 Year"
							},
							{
								name: "2",
								title: "2 Year"
							},
							{
								name: "3",
								title: "4 Year"
							}
						]
					}
				]
			},
			{
				name: "hurdleRate",
				title: "Hurdle Rate:",
				applicable: true,
				options: [
					{
						name:  "additiveSpread",
						title: "Additive Spread",
						inputType: "float",
						defaultValue: 1,
						applicable: true
					},
					{
						name:  "multiplicativeFactor",
						title: "Multiplicative Factor",
						inputType: "float",
						defaultValue: 1,
						applicable: true
					}
				]
			},
			{
				name: "borrowingRate",
				title: "Borrowing Rate:",
				applicable: true,
				options: [
					{
						name:  "additiveSpread",
						title: "Additive Spread",
						inputType: "float",
						defaultValue: 1,
						applicable: true
					},
					{
						name:  "multiplicativeFactor",
						title: "Multiplicative Factor",
						inputType: "float",
						defaultValue: 1,
						applicable: true
					}
				]
			}
		]
	},
	assetsAndTrading: {
		name: "assetsAndTrading",
		title: "Assets and Trading",
		applicable: true,
		options: [
			{
				name:  "useStartingMarketValues",
				title: "Use Starting Market Values from the Company Data",
				inputType: "boolean",
				defaultValue: true,
				applicable: true
			},
			{
				name:  "useStartingBookValues",
				title: "Use Starting Book Values from the Company Data",
				inputType: "boolean",
				defaultValue: true,
				applicable: true
			},
			{
				name:  "useStartingHACBookValues",
				title: "Use Starting HAC Book Values from the Company Data",
				inputType: "boolean",
				defaultValue: true,
				applicable: true
			},
			{
				name:  "useStartingIncomeTaxBasis",
				title: "Use Starting Income / Tax Basis from the Company Data",
				inputType: "boolean",
				defaultValue: true,
				applicable: true
			},
			{
				name:  "initialAssetValueScale",
				title: "Scale Initial Asset Values",
				applicable: true,
				options: [
					{
						name:  "initialAssetValueScale",
						title: "Scale Initial Asset Values",
						inputType: "boolean",
						defaultValue: true,
						applicable: true,
					},
					{
						name:  "multiplier",
						title: "Multiplier",
						inputType: "float",
						defaultValue: 1.5,
						applicable: true,
					},
					{
						name:  "additiveValueFrom",
						title: "Additive Value from",
						applicable: true,
						options: [
							{
								name: "source",
								applicable: true,
								inputType: "exclusive",
								options: [
									{
										name: "companyData",
										title: "Company Data"
									},
									{
										name: "repository",
										title: "Repository"
									}
								]
							},
							{
								name: "userValue",
								inputType: "userValue",
								applicable: true
							},
							{
								name: "repositoryValue",
								inputType: "repositoryValue",
								applicable: true
							}
						]
					},
					{
						name: "additiveValue",
						title: "Additive Value:",
						inputType: "integer",
						defaultValue: 0,
						applicable: true,
					}
				]
			},
			{
				name:  "assetAllocationTolerances",
				title: "Asset Allocation Tolerances",
				inputType: "exclusive",
				applicable: true,
				options: [
					{
						name: "none",
						title: "None"
					},
					{
						name: "byAssetClass",
						title: "by Asset Class"
					},
					{
						name: "byAssetClassbyTime",
						title: "by Asset Class by Time"
					}
				]
			},
			{
				name:  "applyAssetAllocationConstraints",
				title: "Apply Individual Asset Allocation Constraints to Holdings beyond Initial Allocation",
				inputType: "boolean",
				defaultValue: true,
				applicable: true
			},
			{
				name:  "sellAllAssets",
				title: "Sell All Assets as part of Initial Re-balancing to Target Allocation",
				inputType: "boolean",
				defaultValue: true,
				applicable: true
			},
			{
				name:  "enableIMR",
				title: "Enable Interest Maintenance Reserve",
				inputType: "boolean",
				defaultValue: true,
				applicable: true
			},
			{
				name:  "sellAssetsIfNegativeNetCashFlow",
				title: "Sell Assets if Net Cash Flow is Negative:",
				inputType: "exclusive",
				applicable: true,
				options: [
					{
						name: "never",
						title: "Never"
					},
					{
						name: "downToMinimumSurplus",
						title: "Down to Minimum Surplus"
					},
					{
						name: "downToTargetSurplus",
						title: "Down to Target Surplus"
					}
				]
			},
			{
				name:  "borrowMoney",
				title: "Borrow Money if Remaining Net Class Flow is Negative",
				inputType: "boolean",
				defaultValue: true,
				applicable: true
			},
			{
				name:  "sellAssetsToPayOutstandingDebt",
				title: "Sell Assets to Pay Outstanding Debt: by Asset Class: ",
				inputType: "exclusive",
				applicable: true,
				options: [
					{
						name: "never",
						title: "Never"
					},
					{
						name: "downToMinimumSurplus",
						title: "Down to Minimum Surplus"
					},
					{
						name: "downToTargetSurplus",
						title: "Down to Target Surplus"
					}
				]
			},
			{
				name:  "holdDistributionEarningsUntilFinalPeriod",
				title: "Hold Distribution of Earnings Until the Final Period",
				inputType: "boolean",
				defaultValue: true,
				applicable: true
			},
			{
				name:  "buySequence",
				title: "Buy Sequence: ",
				inputType: "exclusive",
				applicable: true,
				options: [
					{
						name: "distanceFromTarget",
						title: "Based on Distance from Target"
					},
					{
						name: "byAssetClass",
						title: "by Asset Class"
					},
					{
						name: "byAssetClassbyTime",
						title: "by Asset Class by Time"
					}
				]
			},
			{
				name:  "sellSequence",
				title: "Sell Sequence: ",
				inputType: "exclusive",
				applicable: true,
				options: [
					{
						name: "distanceFromTarget",
						title: "Based on Distance from Target"
					},
					{
						name: "byAssetClass",
						title: "by Asset Class"
					},
					{
						name: "byAssetClassbyTime",
						title: "by Asset Class by Time"
					}
				]
			},
			{
				name:  "bondDefaultRecoveryFraction",
				title: "Bond Default Recovery Fraction",
				inputType: "percentage",
				defaultValue: 65,
				applicable: true
			}
		]
	},
	taxes: {
		name: "taxes",
		applicable: true,
		options: [
			{
				name: "incomeTaxRate",
				title: "Income Tax Rate:",
				inputType: "float",
				applicable: true,
				defaultValue: .35
			}
		]
	}
}
