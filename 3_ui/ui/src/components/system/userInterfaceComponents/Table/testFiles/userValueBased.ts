// TRAC-9277
export default {
	"inputOptions": {
	"name": "User_Value_Based",
		"title": "User Value Based",
		"path": [
		"A",
		"User",
		"Investments",
		"Asset_Classes",
		"Asset_Class_1",
		"Market_Index"
	],
		"class": "cross",
		"tag": [
		"A",
		"Investments",
		"Asset_Classes",
		"Asset_Class_1",
		"Market_Index",
		"User_Value_Based"
	],
		"filePath": [
		"A",
		"USER",
		"INVES",
		"ASSET",
		"ASSET",
		"INDEX",
		"VALUE"
	],
		"orientation": "column",
		"options": [
		{
			"name": "Price",
			"description": "Price level",
			"title": "Price",
			"defaultValue": "One",
			"type": "String",
			"options": [
				{
					"name": "User_Value",
					"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"User_Value",
						"Price"
					],
					"description": "User Value",
					"title": "User Value",
					"class": "combo",
					"comboList": "user_value_1",
					"defaultValue": "One",
					"type": "String",
					"options": [
						{
							"name": "Zero",
							"title": "Zero",
							"applicable": true
						},
						{
							"name": "One",
							"title": "One",
							"applicable": true
						},
						{
							"name": "Period",
							"title": "Period",
							"applicable": true
						},
						{
							"name": "User_Value_1",
							"title": "User Value 1",
							"applicable": true
						},
						{
							"name": "New_Element_",
							"title": "New User Value ...",
							"applicable": true
						},
						{
							"name": "Unspecified_",
							"title": "Unspecified ...",
							"applicable": true
						}
					],
					"inputType": "exclusive",
					"applicable": true
				},
				{
					"name": "Argument",
					"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"Argument",
						"Price"
					],
					"description": "User Value Argument Use empty to indicate using the Result ",
					"title": "Argument",
					"defaultValue": "",
					"type": "String",
					"utf8Encode": 1,
					"applicable": true
				}
			],
			"hints": {
				"gridLayoutDimension": 1,
				"dimension": 2
			},
			"applicable": true
		},
		{
			"name": "Dividend",
			"description": "Price level",
			"title": "Dividend",
			"defaultValue": "Zero",
			"type": "String",
			"options": [
				{
					"name": "User_Value",
					"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"User_Value",
						"Dividend"
					],
					"description": "User Value",
					"title": "User Value",
					"class": "combo",
					"comboList": "user_value_1",
					"defaultValue": "Zero",
					"type": "String",
					"options": [
						{
							"name": "Zero",
							"title": "Zero",
							"applicable": true
						},
						{
							"name": "One",
							"title": "One",
							"applicable": true
						},
						{
							"name": "Period",
							"title": "Period",
							"applicable": true
						},
						{
							"name": "User_Value_1",
							"title": "User Value 1",
							"applicable": true
						},
						{
							"name": "New_Element_",
							"title": "New User Value ...",
							"applicable": true
						},
						{
							"name": "Unspecified_",
							"title": "Unspecified ...",
							"applicable": true
						}
					],
					"inputType": "exclusive",
					"applicable": true
				},
				{
					"name": "Argument",
					"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"Argument",
						"Dividend"
					],
					"description": "User Value Argument Use empty to indicate using the Result ",
					"title": "Argument",
					"defaultValue": "",
					"type": "String",
					"utf8Encode": 1,
					"applicable": true
				}
			],
			"hints": {
				"gridLayoutDimension": 1,
				"dimension": 2
			},
			"applicable": true
		}
	],
		"applicable": true,
		"hints": {
		"dimension": 1,
			"gridLayoutDimension": 1
	},
	"children": {
		"Price": {
			"name": "Price",
				"description": "Price level",
				"title": "Price",
				"defaultValue": "One",
				"type": "String",
				"options": [
				{
					"name": "User_Value",
					"title": "User Value",
					"class": "combo",
					"type": "String",
					"inputType": "exclusive",
					"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"User_Value",
						"Price"
					],
					"defaultValue": "One",
					"description": "User Value",
					"comboList": "user_value_1"
				},
				{
					"name": "Argument",
					"title": "Argument",
					"class": "scalar",
					"type": "String",
					"inputType": "string",
					"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"Argument",
						"Price"
					],
					"defaultValue": "",
					"description": "User Value Argument Use empty to indicate using the Result "
				}
			],
				"hints": {
				"dimension": 2
			},
			"children": {
				"UserValue": {
					"name": "User_Value",
						"title": "User Value",
						"class": "combo",
						"type": "String",
						"inputType": "exclusive",
						"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"User_Value",
						"Price"
					],
						"defaultValue": "One",
						"description": "User Value",
						"comboList": "user_value_1"
				},
				"Argument": {
					"name": "Argument",
						"title": "Argument",
						"class": "scalar",
						"type": "String",
						"inputType": "string",
						"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"Argument",
						"Price"
					],
						"defaultValue": "",
						"description": "User Value Argument Use empty to indicate using the Result "
				}
			}
		},
		"Dividend": {
			"name": "Dividend",
				"description": "Price level",
				"title": "Dividend",
				"defaultValue": "Zero",
				"type": "String",
				"options": [
				{
					"name": "User_Value",
					"title": "User Value",
					"class": "combo",
					"type": "String",
					"inputType": "exclusive",
					"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"User_Value",
						"Dividend"
					],
					"defaultValue": "Zero",
					"description": "User Value",
					"comboList": "user_value_1"
				},
				{
					"name": "Argument",
					"title": "Argument",
					"class": "scalar",
					"type": "String",
					"inputType": "string",
					"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"Argument",
						"Dividend"
					],
					"defaultValue": "",
					"description": "User Value Argument Use empty to indicate using the Result "
				}
			],
				"hints": {
				"dimension": 2
			},
			"children": {
				"UserValue": {
					"name": "User_Value",
						"title": "User Value",
						"class": "combo",
						"type": "String",
						"inputType": "exclusive",
						"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"User_Value",
						"Dividend"
					],
						"defaultValue": "Zero",
						"description": "User Value",
						"comboList": "user_value_1"
				},
				"Argument": {
					"name": "Argument",
						"title": "Argument",
						"class": "scalar",
						"type": "String",
						"inputType": "string",
						"tag": [
						"A",
						"Investments",
						"Asset_Classes",
						"Asset_Class_1",
						"Market_Index",
						"User_Value_Based",
						"Argument",
						"Dividend"
					],
						"defaultValue": "",
						"description": "User Value Argument Use empty to indicate using the Result "
				}
			}
		}
	},
	"applicability": {
		"model": [
			"User_Value_Based"
		]
	}
},
	"axes": {},
	"userInputs": {
	"User_Value_Based": {
		"Price": {
			"User_Value": "Zero",
				"Argument": ""
		},
		"Dividend": {
			"User_Value": "Zero",
				"Argument": ""
		}
	}
},
	"notes": []
}