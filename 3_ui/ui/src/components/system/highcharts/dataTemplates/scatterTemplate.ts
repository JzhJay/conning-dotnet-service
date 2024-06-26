import { HighchartDataTemplate, getAxisNames, rgbColors, getCoordinateName, getRowAxisNames, getRowCoordinateNames, getLineMarkerOptions, getMarkerObject } from "./highchartDataTemplate";
import type {CompactPivotData, PivotMetadata, ChartUserOptions} from 'stores/queryResult';

interface ScatterSeries {
    color?: any;
    regression?: boolean;
    regressionSettings?: any;
    name: string;
    data: any;
}
export function getHighchartsScatterObject(data: CompactPivotData, metadata: PivotMetadata, userOptions: ChartUserOptions) {
    let xAxisTitle, yAxisTitle;

    let doesAxisAlternate = (axisIndex: number) => {
        let coords = _.map(data.colCoords, row => row[axisIndex]);

        //console.log(coords)
        // Do they perfectly repeat as alternating tuples?

        const first = coords[0], second = coords[1];

        for (let i = 2; i < coords.length; i += 2) {
            if (coords[i] !== first || coords[i + 1] !== second) {
                return false;
            }
        }

        return true;
    }

    // Step 1: Throw out all axes that have the same coordinate in every column.
    //console.trace('Step 1: Throw out all axes that have the same coordinate in every column.')

    // Step 2: Does the final (bottom) axis alternate? Yes, proceed to Step 3, else proceed to Step Punt.
    //console.trace('Step 2: Does the final (bottom) axis alternate? Yes, proceed to Step 3, else proceed to Step Punt.')

    let punt = true;
    let walkIndex = metadata.columnAxes.length - 1;
    while (walkIndex >= 0 &&
        (_.uniq(_.map(data.colCoords, row => row[walkIndex])).length === 1 || doesAxisAlternate(walkIndex))) {
        //console.log('Step 2:  Proceed')
        punt = false;
        // Step 3: Proceed up to prior axes, until the alternating stops.
        //console.log('Step 3: Proceed up to prior axes, until the alternating stops.', metadata.axes[metadata.columnAxes[walkIndex]]);
        walkIndex--;
    }

    if (punt) {
        //console.log('Step 2:  Punt!')
    }

    if (!punt && walkIndex >= 0) {
        // Step 4: Do the coordinates for the other axes have the same values for each pair? Yes, proceed to Step 5, else proceed to Step Punt
       // console.log("Step 4: Do the coordinates for the other axes have the same values for each pair? Yes, proceed to Step 5, else proceed to Step Punt");

        let allOtherCoordsAreSame = true;
        for (let i = 0; i <= walkIndex; i++) {

            for (let c = 0; c < data.colCoords.length; c += 2) {
                if (data.colCoords[c][walkIndex] !== data.colCoords[c + 1][walkIndex]) {
                    allOtherCoordsAreSame = false;
                    break;
                }
            }
        }

        if (!allOtherCoordsAreSame) {
        //    console.log('Step 4: Punt!')
            punt = true;
        }
        else {
        //    console.log('Step 4: Proceed!')
        }
    }

    // TODO - One last thing: All effectively redundant axes should always be combined, though of as one. An axis is redundant to another if it is true that every unique coordinate of one is always paired with the same equally unique value of the other. For example:

    if (!punt) {
        // Step 5: We have met the criteria for doing a nice job in labeling.
        //console.log('Step 5: We have met the criteria for doing a nice job in labeling.');

        // The alternating axes define the X and Y axis labels:

        let xAxisLabel = '';
        let yAxisLabel = '';

        // One and only one alternating coordinate axis?
        if (metadata.columnAxes.length === 1 || walkIndex + 1 === metadata.columnAxes.length - 1) {
            // We know this row is made up of exactly two alternating coordinate values
            let axis = metadata.axes[metadata.columnAxes[walkIndex + 1]]
	        xAxisLabel = getCoordinateName(axis, data.colCoords[0][walkIndex + 1]) as any
	        yAxisLabel = getCoordinateName(axis, data.colCoords[1][walkIndex + 1]) as any
        }
        // Multiple axes with exactly 2 alternating coordinates
        else {
            let xLabels = [], yLabels = [];

            // Multiple axes
            for (let i = walkIndex + 1; i < metadata.columnAxes.length; i++) {
                // Skip if all values are the same
                if (_.uniq(_.map(data.colCoords, row => row[i])).length !== 1) {
                    let axis = metadata.axes[metadata.columnAxes[i]]

                    xLabels.push(`${axis.groupName.label}=${getCoordinateName(axis, data.colCoords[0][i])}`);
                    yLabels.push(`${axis.groupName.label}=${getCoordinateName(axis, data.colCoords[1][i])}`);

                }
            }

            xAxisLabel = xLabels.join(', ')
            yAxisLabel = yLabels.join(', ')
        }

        xAxisTitle = xAxisLabel;
        yAxisTitle = yAxisLabel;
    }
    else { // Punt
        xAxisTitle = 'X';
        yAxisTitle = 'Y';
    }

    // Figure out the series names

    let series : Array<ScatterSeries> = [];
    if (walkIndex < 0) { walkIndex = 0 }

    if (!punt) {
        for (let c = 0; c < data.colCoords.length; c += 2) {
            for (let r = 0; r <= walkIndex; r++) {
                const axis = metadata.axes[metadata.columnAxes[r]];

                const xAxisCoord: any = getCoordinateName(axis, data.colCoords[c][r]);
                const yAxisCoord: any = getCoordinateName(axis, data.colCoords[c + 1][r]);

                //assert(xAxisCoord === yAxisCoord);
                const seriesName =
                          walkIndex === 0 ?
                            xAxisCoord === yAxisCoord
                                ? `${xAxisCoord}`
                                : `${xAxisCoord} vs ${yAxisCoord}`
                            : xAxisCoord;

                series.push({
                    name: seriesName,

                    // color: "rgba(  0, 73,144,.5)",
                    // "states": {
                    //     "hover": {
                    //         "halo": {
                    //             "attributes": {
                    //                 "fill": "rgb(0, 73,144)",
                    //                 "stroke": "rgba(0, 73,144, 0.25)"
                    //             }
                    //         }
                    //     }
                    // },
                    // "regression": true,
                    // "regressionSettings": {
                    //     "type": "linear",
                    //     "color": "rgba(0, 73,144,.5)"
                    // },
                    // "dataLabels": {
                    //     "borderColor": "rgba(  0, 73,144,.5)"
                    // },

                    data: _.map(data.detailCells, (r, index) => ({ x: r[c], y: r[c + 1], name: index }))
                })
            }
        }
    }
    else {
        /* "punt"
         Legend title:		Time, Tenor, Item, Economy
         Series 1 label:	l	X: 2016, 1, Yield, US vs. Y: 2016, 1, Price, GB
         Series 2 label:	l	X: 2016, 2, Yield, DE vs. Y: 2016, 2, Price, US
         Series 3 label:	l	X: 2016, 3, Yield, DE vs. Y: 2017, 1, Price, US
         Series 4 label:	l	X: 2017, 2, Yield, GB vs. Y: 2017, 2, Price, DE
         */
        for (let c = 0; c < data.colCoords.length; c += 2) {
            // Figure out the series label
            let xCoords = [], yCoords = [];

            for (let r = 0; r < metadata.columnAxes.length; r++) {
                let axis = metadata.axes[metadata.columnAxes[r]]

                xCoords.push(getCoordinateName(axis, data.colCoords[c][r]));
                yCoords.push(getCoordinateName(axis, data.colCoords[c + 1][r]));
            }

            const seriesName = `X: ${xCoords.join(', ')} vs. Y: ${yCoords.join(', ')}`;
            //console.log(seriesName);

            series.push({
                name: seriesName,
                data: _.map(data.detailCells, (r, index) => {
                    return { x: r[c], y: r[c + 1], name: index }
                })
            })
        }
    }

    // Format the series, add regression lines and markers.
    series.forEach((s, i) => {
        let color = rgbColors[i % rgbColors.length];
        s.color = `rgba(${color}, .5)`;
        s.regression = true;
        s.regressionSettings = {
            type: "linear",
            color: `rgba(${color}, 1)`,
            zIndex: 10,
	        visible: userOptions.showRegressionLine,
	        showInLegend: userOptions.showRegressionLine
        };
        return _.merge(s,  getMarkerObject(userOptions.markerSize, color))
    })

    let result = {
        axisNames: getAxisNames(metadata),
	    rowNames: data.rowCoords ? getRowCoordinateNames(metadata, _.zip.apply(_, data.rowCoords.map(a => a.map(v => v)))) : undefined,
	    rowAxisNames: getRowAxisNames(metadata),

        chart: {
            type: "scatter",
	        inverted: userOptions.isInverted
        },
        plotOptions: {
            series: {
                marker: {
                    symbol: "circle"
                },
                boostThreshold: 1,
            }
        },
        xAxis: [{
            gridLineWidth: 0,
            title: {text: xAxisTitle},
        }],
        yAxis: [{
            title: {text: yAxisTitle},
        }],
        series: series
    }


    result.series = series;

    if (userOptions.showLines) {
	    _.merge(result, getLineMarkerOptions(false, "scatter", userOptions.lineWidth));
    }

    return _.merge({}, new HighchartDataTemplate(userOptions), result, userOptions.highchartsOptions);
}
