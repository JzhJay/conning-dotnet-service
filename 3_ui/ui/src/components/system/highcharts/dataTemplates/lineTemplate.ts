import {
	HighchartDataTemplate, getAxisNames, rgbColors, getCoordinateName, getRowCoordinateNames, getColCoordinateNames,
	getRowAxisNames, getSeriesGroups, getHighchartsSeriesObject, getCoordinateNames, getLineMarkerOptions, getMarkerObject
} from "./highchartDataTemplate";
import type {PivotData, PivotMetadata, ChartUserOptions} from 'stores/queryResult';
import {LineSeries} from "../../../../stores/charting/chartJuliaModels";

export function getHighchartsLineChartObject(data: PivotData, metadata: PivotMetadata, userOptions: ChartUserOptions) {
	let axisNames = getCoordinateNames(metadata, data)
	let rowNames = axisNames["rows"]
	let colNames = axisNames["cols"]

	let lines:LineSeries[] = data.detailCells.map((r, i) => {
		return {
			data: r.map((pt, k) => {return {y: pt.data, x: k}}),
			name: rowNames[i],
			rowCoordinates: data.rowCoords[i].map(obj => obj.coordinate)
		}
	});

	let groupedSeries = getHighchartsSeriesObject(lines, metadata, true, true)

	groupedSeries.forEach((s) => {
		_.merge(s, getMarkerObject(userOptions.markerSize, s.color))
	})

	let result = {
		chart: {
			type: 'line',
			inverted: userOptions.isInverted
		},
		xAxis: [{
			title: {text: getAxisNames(metadata).join(", ")},
			categories: colNames
		}],
		plotOptions: {
			series: {
				boostThreshold: Number.MAX_VALUE,
				marker: {
					symbol: "circle"
				}
			}
		},
		legend: {
			title: {text: metadata.rowAxes.length === 1 ? getRowAxisNames(metadata).join(", ") : "\0"},
			symbolWidth: 30,
			enabled: groupedSeries.length > 1
		},
		series: groupedSeries
	};

	if (userOptions.showLines) {
		_.merge(result, getLineMarkerOptions(userOptions.showMarkers, "line", userOptions.lineWidth));
	}

	return _.merge({}, new HighchartDataTemplate(userOptions), result, userOptions.highchartsOptions);
}
