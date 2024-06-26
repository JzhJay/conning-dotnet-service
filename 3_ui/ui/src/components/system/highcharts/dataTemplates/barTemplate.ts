import type {PivotData, PivotMetadata, ChartUserOptions} from 'stores/queryResult'
import {
	getColCoordinateNames, getRowAxisNames, getRowCoordinateNames,
	HighchartDataTemplate,
	getAxisNames, getHighchartsSeriesObject, getCoordinateNames,
} from "./highchartDataTemplate";

export function getHighchartsBarChartObject(data: PivotData, metadata: PivotMetadata, userOptions: ChartUserOptions) {
	let axisNames = getCoordinateNames(metadata, data)
	let rowNames = axisNames["rows"]
	let colNames = axisNames["cols"]

	let bars = data.detailCells.map((r, i) => {
		return {
			data: r.map(pt => {return pt.data}),
			name: rowNames[i],
			rowCoordinates: data.rowCoords[i].map(obj => obj.coordinate)
		}
	});

	let groupedSeries = getHighchartsSeriesObject(bars, metadata, false, true)

	let result = {
		chart: {
			type: 'column',
			ignoreHiddenSeries: true,
			inverted: userOptions.isInverted
		},

		xAxis: [{
			title: {text: getAxisNames(metadata).join(", ")},
			categories: colNames
		}],
		yAxis : {
			max: Number.MAX_VALUE,
			min: Number.MIN_VALUE
		},
		plotOptions: {
			column: {
				stacking: userOptions.columnMode
			},
			series: {
				groupPadding: 0.1,
			}
		},
		legend: {
			title: {text: metadata.rowAxes.length === 1 ? getRowAxisNames(metadata).join(", ") : "\0"}
		},
		series: groupedSeries
	};

	return _.merge({}, new HighchartDataTemplate(userOptions), result, userOptions.highchartsOptions);
}