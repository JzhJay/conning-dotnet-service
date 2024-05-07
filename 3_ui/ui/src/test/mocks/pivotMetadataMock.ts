export const mockPivotMetaData = {
	"arrangementUID": 1,
	"selectionUID": 1,
	"formats": [
	"Currency",
	"Return",
	"Rate",
	"Margin",
	"Fraction",
	"Factor",
	"Ratio",
	"Draw",
	"Integer",
	"Integer_Small",
	"Exposure",
	"Currency_PUE",
	"Frequency",
	"Frequency_PUE",
	"Mean_Frequency",
	"Price",
	"Price_2",
	"Price_Short",
	"Years",
	"Years_Short",
	"Years_Squared",
	"Boolean",
	"Transgressions",
	"Shares",
	"Area",
	"User_Value",
	"ID",
	"ID_Short",
	"Error",
	"SID",
	"User_ID",
	"Security",
	"CMO_User_ID",
	"Economy",
	"Symbol",
	"Accounting_Treatment",
	"Property",
	"Quality",
	"Portfolio",
	"Entity",
	"Common_Stock",
	"Market_Index",
	"Instrument",
	"Credit_Rating",
	"Rating",
	"Special_Category",
	"OID_Flag",
	"Class",
	"Class_Short",
	"Pool",
	"Prepayment_Model",
	"CMO_Rating",
	"PAC",
	"Group",
	"Level",
	"Jump",
	"Spread",
	"Rating_M",
	"Forward_Object",
	"Strategy",
	"f9_6",
	"f10_2",
	"f4_0",
	"GDP"
],
	"allSelected": true,
	"rows": 5000,
	"axes": [
	{
		"groupName": {
			"label": "Economy",
			"description": "Economy description"
		},
		"groupMembers": [
			{
				"label": "CH",
				"description": "CH description"
			},
			{
				"label": "DE",
				"description": "DE description"
			},
			{
				"label": "GB",
				"description": "GB description"
			},
			{
				"label": "US",
				"description": "US description"
			}
		],
		"groupType": "Generic",
		"id":0
	},
	{
		"groupName": {
			"label": "Path",
			"description": "Path description"
		},
		"groupMembers": _.range(5000),
		"groupType": "Scenario",
		"id":1
	},
	{
		"groupName": {
			"label": "Price_Index",
			"description": "Price_Index description"
		},
		"groupMembers": [
			{
				"label": "Consumer_Prices",
				"description": "Consumer_Prices description"
			},
			{
				"label": "Consumer_Prices_VEC",
				"description": "Consumer_Prices_VEC description"
			},
			{
				"label": "New_Vehicle",
				"description": "New_Vehicle description"
			},
			{
				"label": "Motors",
				"description": "Motors description"
			},
			{
				"label": "Professional",
				"description": "Professional description"
			},
			{
				"label": "Hospital",
				"description": "Hospital description"
			},
			{
				"label": "Construction",
				"description": "Construction description"
			},
			{
				"label": "Wages",
				"description": "Wages description"
			}
		],
		"groupType": "Generic",
		"id":2
	},
	{
		"groupName": {
			"label": "Time",
			"description": "Time description"
		},
		"groupMembers": [
			"2014",
			"2015",
			"2016",
			"2017",
			"2018",
			"2019",
			"2020",
			"2021",
			"2022",
			"2023",
			"2024",
			"2025",
			"2026",
			"2027",
			"2028",
			"2029",
			"2030",
			"2031",
			"2032",
			"2033",
			"2034"
		],
		"groupType": "Time",
		"id":3
	}
],
	"availableViews": [
	"query",
	"pivot"
],
	"rowAxes": [
	1
],
	"columnAxes": [
	0,
	2,
	3
],
	"columns": 231
}