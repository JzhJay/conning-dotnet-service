/// <reference path="../highcharts-extensions.d.ts" />

import {mapHexColorsToRgb} from 'utility';
import type {PivotMetadata, GroupMember, Series, Axis} from 'stores/queryResult'
import type { PivotData } from "../../../../stores/queryResult/models/pivot/pivotJuliaModels";
import type { ChartType } from "../../../../stores/charting/chartJuliaModels";
import type { ChartUserOptions } from "../../../../stores/queryResult/index";

export class HighchartDataTemplate {

	constructor(userOptions:ChartUserOptions) {
		if (userOptions.verticalAxisDirection === "bottom") {
			(this[userOptions.isInverted ? "xAxis" : "yAxis"] as HighchartsAxisOptions[]).forEach((axis) => (axis.reversed = true))
		}

		if (userOptions.horizontalAxisDirection === "right") {
			(this[userOptions.isInverted ? "yAxis" : "xAxis"] as HighchartsAxisOptions[]).forEach((axis) => (axis.reversed = true))
		}

		if(userOptions.dataLabels === true) {
			this.plotOptions.series.dataLabels.enabled = true;
		}

		const defaultFontSize = userOptions.fontSize + "px";
		const defaultAxisLabelFontSize = userOptions.fontSize * (6/7) + "px"; // Default 14 for title, 12 for labels

		const axisSizes = () => ({
			style: {
				fontSize: defaultFontSize
			},
			title: {
				style: {
					fontSize: defaultFontSize
				}
			},
			labels: {
				style: {
					fontSize: defaultAxisLabelFontSize
				}
			}
		})

		const fontSizes = {
			chart: {
				style: {
					fontSize: defaultFontSize
				}
			},
			legend: {
				title: {
					style: {
						fontSize: defaultFontSize
					}
				},
				itemStyle: {
					fontSize: defaultFontSize
				},
				itemHiddenStyle: {
					fontSize: defaultFontSize
				}
			},
			xAxis: [axisSizes()],
			yAxis: [axisSizes()]
		}

		_.merge(this, fontSizes);
	}

    chart = {
        ignoreHiddenSeries: false,
        animation: true,
        inverted: null,
        zoomType: "xy",
        panning: "xy",
        panKey: "buttonPan"
    }
	boost = {seriesThreshold: Number.MAX_VALUE};
    title = {text:null};
    //subtitle: string;
    credits = {
        text: "",
        enabled: false
    }

    xAxis = [{
        gridLineWidth: 0,
        minRange: -1, // allows zooming in on small ranges
        tickmarkPlacement: "on",
        title: {text: ""}
    }]

    series: HighchartsSeriesOptions[] = [];

    plotOptions = {
        series: {
            getExtremesFromAll: true,
            cursor: "pointer",
            turboThreshold: Number.MAX_VALUE,
            allowPointSelect: false,
            stickyTracking: false,
	        dataLabels: {
		        enabled: false
	        }
        }
    }

    yAxis = [{
        title: {text: ""},
        minRange: -1, // allows zooming in on small ranges
    }]

    legend = {
        align: "right",
        verticalAlign: "middle",
        layout: "vertical",
        symbolRadius: 0, // rectangle symbols
        enabled: true,
    }

    tooltip = {
        distance: 10,
        animation: true,
        followPointer: false,
        hideDelay: 50,
        backgroundColor: "#ffffff"
    }

    exporting = {
	    fallbackToExportServer: false
    }
}

export const rgbColors = mapHexColorsToRgb(['#7cb5ec', '#90ed7d', '#434348', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']);
export const dashStyles = [
    'Solid',
    'ShortDash',
    'ShortDot',
    'ShortDashDot',
    'ShortDashDotDot',
    'Dot',
    'Dash',
    'LongDash',
    'DashDot',
    'LongDashDot',
    'LongDashDotDot'
];

/*
export function getBaseHighchartsObject(userOptions: ChartOptions)
{
    return _.merge(new HighchartDataTemplate(), userOptions);
}*/

export function getHighchartsSeriesObject(series:Series[], pivotMetadata: PivotMetadata, setStyle:boolean, isRows: boolean = false):HighchartsSeriesChart[]
{
    let usedDashStyles = {};
    let usedColors = {};

    const coord = isRows ? "rowCoordinates" : "columnCoordinates"
	const axes = isRows ? "rowAxes" : "columnAxes"
	const legendGroups = getSeriesGroups(series, false, isRows);

    return series.map((s, sIndex) => {

        let names = s[coord].map((c, i) => getCoordinateName(pivotMetadata.axes[pivotMetadata[axes][i]], c))

		// @ts-ignore
        let highchartsSeries =  _.merge({}, s, {name:names.join(", "), [coord]:names}) as HighchartsSeriesChart;

        if (setStyle && legendGroups != null) {
            let dashKey = getCoordinates(highchartsSeries, legendGroups.bottomIndices, isRows);
            if (usedDashStyles[dashKey] == null)
                usedDashStyles[dashKey] = dashStyles[Object.keys(usedDashStyles).length % dashStyles.length];

            let colorKey = getCoordinates(highchartsSeries, legendGroups.topIndices, isRows);
            if (usedColors[colorKey] == null)
                usedColors[colorKey] = rgbColors[Object.keys(usedColors).length % rgbColors.length];

            highchartsSeries.dashStyle = usedDashStyles[dashKey];
            highchartsSeries.color = "rgb(" + usedColors[colorKey] + ")";
            highchartsSeries.stack = dashKey;
	        highchartsSeries.name = colorKey;
        }
        else
        {
            highchartsSeries.color = "rgb(" + rgbColors[sIndex % rgbColors.length] + ")";
        }

        return highchartsSeries;
    })
}

export function getSeriesColor(i) {
	return rgbColors[i % rgbColors.length];
}

export function getCoordinates(series, indices, isRows: boolean = false) {
	const coord = isRows ? "rowCoordinates" : "columnCoordinates"
	return _.at(series[coord], indices).join(", ");
}

/**
 * Finds a series grouping that minimizes the amount of legend items in a chart
 * @param series
 * @param shouldOptimize if true, grouping that yields the least amount of legend items
 * @param isRows if true, get series grouping over rows instead of columns
 * @returns The legend grouping or null if there is a single axis or if grouping cannot be performed
 */
export function getSeriesGroups(series, shouldOptimize, isRows: boolean = false): {topIndices:number[], bottomIndices:number[]} {

	const firstSeries = series[0];
	const coord = isRows ? "rowCoordinates" : "columnCoordinates"

	if (firstSeries[coord].length == 1)
		return null;

	if (shouldOptimize) {
		let minimizedGroup = null;
		let minimizedCount = 999999;
		let numAxes        = firstSeries[coord].length;

		// Loop through all the unique permutation (e.g. 2^numAxes) of the axis arrangements and find the grouping that generates the least amount items in a grouped legend
		for (let i = 1; i < Math.pow(2, numAxes); i++) {
			let combination = _.padStart(i.toString(2), numAxes, "0"); // convert the counter to binary and pad with 0s, 1 digit for each axis

			// Create the permutation group based on the binary combination where 1 represents an axis that should be in the top group and 0 represents an axis that should be in the bottom group
			let topIndices    = [];
			let bottomIndices = [];
			for (let c = 0; c < firstSeries[coord].length; c++) {
				if (combination[c] === "1")
					topIndices.push(c);
				else
					bottomIndices.push(c);
			}

			// Generate a representation of the coordinates(e.g. series name) in each series that we can check for uniqueness and count
			let topCoordinates    = [];
			let bottomCoordinates = [];
			series.forEach((s) => {
				topCoordinates.push(topIndices.map((c) => s[coord][c]).join(","));
				bottomCoordinates.push(bottomIndices.map((c) => s[coord][c]).join(","));
			})

			let uniqueTopCoordinateCount    = _.uniq(topCoordinates).length;
			let uniqueBottomCoordinateCount = _.uniq(bottomCoordinates).length;
			let count                       = uniqueTopCoordinateCount + uniqueBottomCoordinateCount;

			// Store off the configuration that yields the least amount of legend items
			if (count < minimizedCount) {
				minimizedCount = count;
				minimizedGroup = uniqueTopCoordinateCount > uniqueBottomCoordinateCount ? {topIndices, bottomIndices} : {topIndices: bottomIndices, bottomIndices: topIndices};
			}
		}

		return minimizedGroup

	}
	else {
		let stackIndex = null;
		for (let i = 0; i < firstSeries[coord].length; i++)
		{
			let uniques = _.uniq(series.map((s) => s[coord].slice(0, i + 1).join(","))) as any;

			// Stop when the coordinate groupings are all unique
			if (uniques.length == series.length) {
				if (i > 0)
					return {topIndices: _.range(0, i), bottomIndices: _.range(i, firstSeries[coord].length)};
				else
					return null;
			}
		}

		return null;
	}

}

export function getCoordinateName(axis:Axis, coordIndex:number) {
	let name = coordIndex == -1 ? "" : axis.groupMembers[coordIndex];

	if (axis.groupType === "Generic" && (name as GroupMember).label)
		name = (name as GroupMember).label;

	return name;
}

export function getAxisNames(pivotMetadata:PivotMetadata): string[] {
    return pivotMetadata.columnAxes.map((c) => pivotMetadata.axes[c].groupName.label);
}

export function getRowAxisNames(pivotMetadata:PivotMetadata){
    return pivotMetadata.rowAxes.map((r) => pivotMetadata.axes[r].groupName.label);
}

export function getRowCoordinateNames(pivotMetadata:PivotMetadata, rowCoordinates:Array<number[]>){
    let names = rowCoordinates.map((axisRows, i)=>{
        return axisRows.map((coordinate) => getCoordinateName(pivotMetadata.axes[pivotMetadata.rowAxes[i]], coordinate));
    })

    return _.zip.apply(_, names);
}

export function getColCoordinateNames(pivotMetadata:PivotMetadata, colCoordinates:Array<number[]>){
	let names = colCoordinates.map((axisCols, i)=>{
		return axisCols.map((coordinate) => getCoordinateName(pivotMetadata.axes[pivotMetadata.columnAxes[i]], coordinate));
	})

	return _.zip.apply(_, names);
}

export function getCoordinateNames(pivotMetadata:PivotMetadata, data:PivotData){
	let rowNames = getRowCoordinateNames(pivotMetadata, _.zip.apply(_, data.rowCoords.map(a => a.map(v => v.coordinate))))

	let colNames = getColCoordinateNames(pivotMetadata, _.zip.apply(_, data.colCoords.map(a => a.map(v => v.coordinate)))).map(
		labels => labels.join(", ")
	)
	return {rows: rowNames, cols:colNames}
}

export function getPercentileColorAndOpacity(userPercentiles:number[], percentileIndex:number, numPercentiles:number, colorSet:string[]) {
	const lastPercentiles = userPercentiles[userPercentiles.length - 1];
	let supportsReflection = `${lastPercentiles}` != ';' && lastPercentiles <= 50;

    let color, opacity;
    if (!supportsReflection) {
        color = colorSet[0];
        opacity = (percentileIndex + 1) / numPercentiles;
    }
    else if (percentileIndex < numPercentiles / 2) {
        color = colorSet[0];
        opacity = (percentileIndex + 1) / Math.ceil(numPercentiles / 2);
    }
    else {
        color = colorSet[1];
        opacity = (numPercentiles - percentileIndex + 1) / Math.ceil(numPercentiles / 2);
    }

    return {color:color, opacity:.10 + .90 * Math.pow(opacity, 3)};
}

export function mergeWithUserOptions(template, userOptions) {
    return _.mergeWith(template, userOptions, (objValue, srcValue, key) =>{
        if (_.isArray(srcValue) && key === "xAxis" || key === "yAxis")
        {
        	// Ignore saved xAxis limits,
	        if (key === "xAxis")
		        delete srcValue[0]["max"];

            // Only merge axis present in the template since re-arrangement might have allowed setting axis options
            // that are not applicable to the current arrangement.
            return _.merge([], _.isArray(objValue) ? objValue : [objValue], srcValue.slice(0, _.isArray(objValue) ? objValue.length : 1));
        }
        else if(key === "title")
	    {
	    	if (srcValue["text"] == null)
	    	    delete srcValue["text"];
	    }
    });
}

export function getLineMarkerOptions(enableMarker:boolean, chartType:ChartType, lineWidth:number) {
	let markerOptions = null;

	if (chartType === 'line') {
		markerOptions = { chart: {type: 'line'},  plotOptions: {series: {marker: {enabled: enableMarker}, lineWidth: lineWidth, boostThreshold: Number.MAX_VALUE}} }
	} else if (chartType === "scatter") {
		if (enableMarker)
			markerOptions = {chart: {type: 'scatter'}, plotOptions: {series: {marker: {enabled: true}, lineWidth: 0, boostThreshold: 1}} }
		else
			markerOptions = {chart: {type: 'line'}, plotOptions: {series: {marker: {enabled: false}, lineWidth: lineWidth, boostThreshold:Number.MAX_VALUE}} }
	}
	else
		console.error("highchartDataTemplate::getLineMarkerOptions() unsupported chartType")

	return markerOptions;
}

export function getMarkerObject(size, color)
{
	return {
		marker: {radius: size},
		states: {
			hover: {
				halo: {
					size: size,
					attributes: {
						"stroke-width": size * 2,
						fill: `rgb(${color})`,
						stroke: `rgba(${color}, 0.25)`
					}
				}
			}
		}
	};
}

export function getMeanMarker(data, stackName, userOptions) {
	return {
		name:         'mean',
		className:    'mean-line',
		data:         data,
		stack:        stackName,
		stacking:     false,
		type:         'line',
		lineWidth:    0,
		states:       {
			hover: {
				enabled: false,
			},
		},
		marker:       {
			symbol:    'cross',
			lineColor: 'rgba(255, 192, 0, 1)',
			lineWidth: 2,
			enabled:   true
		},
		showInLegend: true,
		visible:      userOptions.showMeanValues,
	}
}

