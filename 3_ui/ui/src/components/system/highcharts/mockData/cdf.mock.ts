import {Utility} from 'utility';

const rawData = require('./CDFSeries.json');
const rgbColors = utility.mapHexColorsToRgb(['#7cb5ec', '#90ed7d', '#434348', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']);

export function getMockCdfData(id:number) {
    const seriesData = _.cloneDeep(rawData);  // Clone the JSON data as we modify it in place

    if (id === 1) {
        seriesData.length = 2;
        seriesData.splice(0, 1);
    }
    else if (id === 2) {
        seriesData.length = 4;
    }
    else if (id === 3) {
        seriesData.length = 8;
    }

    let dashStyles = [
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

    for (let i = 0; i < seriesData.length; i++) {
        seriesData[i].data.splice(seriesData.length - 1, 1);
        seriesData[i].data.splice(0, 1);

        for (let j = 0; j < seriesData[i].data.length / 2; j++) {
            seriesData[i].data[j][0] = seriesData[i].data[j * 2][0];
        }

        seriesData[i].data.length = seriesData[i].data.length / 2;

        seriesData[i].columnCoordinates = ["US", seriesData[i].name];

        if (id === 3) {
            if (i < seriesData.length / 3) {
                seriesData[i].dashStyle = dashStyles[0];
                seriesData[i].color = "rgb(" + rgbColors[i] + ")";
            }
            else if (i < seriesData.length / 1.5) {
                seriesData[i].dashStyle = dashStyles[1];
                seriesData[i].name = seriesData[i - Math.ceil(seriesData.length / 3)].name;
                seriesData[i].color = "rgb(" + rgbColors[i - Math.ceil(seriesData.length / 3)] + ")";
                seriesData[i].columnCoordinates = ["GB", seriesData[i].name];
            }
            else {
                seriesData[i].dashStyle = dashStyles[2];
                seriesData[i].name = seriesData[i - Math.ceil(seriesData.length / 1.5)].name;
                seriesData[i].color = "rgb(" + rgbColors[i - Math.ceil(seriesData.length / 1.5)] + ")";
                seriesData[i].columnCoordinates = ["DE", seriesData[i].name];
            }

        }

    }

    /*for (let i = 0; i < seriesData[2].data.length / 2; i++)
     {
     seriesData[2].data[i][0] = seriesData[2].data[i * 2][0];
     }

     seriesData[2].data.length = seriesData[2].data.length/2;
     */

    /*
     for (let i = 0; i < seriesData[2].data.length; i++)
     {
     seriesData[2].data[i][1] = i/seriesData[2].data.length;
     }*/

    let result = {
        statistics: {mean: .05, standardDeviation: .012, skewness: 1.0, kurtosis: 1.0},
        axisNames: ["Economy", "Time"],
        percentilesData: [{
            percentile: 5,
            xValue: -.005,
            CTEGreater: 123.456,
            CTELess: 123.456,
            density: 123,
            densityFraction: .5
        },
            {percentile: 25, xValue: .005, CTEGreater: 123.456, CTELess: 123.456, density: 123, densityFraction: .5},
            {percentile: 50, xValue: .022, CTEGreater: 123.456, CTELess: 123.456, density: 123, densityFraction: .5},
            {percentile: 75, xValue: .035, CTEGreater: 123.456, CTELess: 123.456, density: 123, densityFraction: .5},
            {percentile: 95, xValue: .050, CTEGreater: 123.456, CTELess: 123.456, density: 123, densityFraction: .5}],

        chart: {
            type: "line",
            ignoreHiddenSeries: false,
            animation: true,
            inverted: null,
            zoomType: "xy",
            panning: "xy",
            panKey: "buttonPan"
        },
        title: {text: "Conning Module=GEMS"},
        subtitle: {text: "RCMS"},
        credits: {
            text: "Credits",
            enabled: true
        },
        xAxis: {
            // reversed: false,
            gridLineWidth: 0,
            minRange: -1, // allows zooming in on small ranges
            //categories: category,
            tickmarkPlacement: "on",
            title: {text: "Value"}
        },
        plotOptions: {
            series: {
                getExtremesFromAll: true,
                cursor: "pointer",
                turboThreshold: 1000000,
                allowPointSelect: true,
                stickyTracking: false,
                //lineWidth: 1,
                //lineColor: "rgb(255,255,255)"
            }
        },
        yAxis: {
            title: {text: "Cumulative Density %"},
            minRange: -1, // allows zooming in on small ranges
            min: 0,
            max: 100
        },
        series: seriesData,
        legend: {
            align: "right",
            verticalAlign: "middle",
            layout: "vertical",
            enabled: true,
            "symbolHeight": 18,
            labelFormatter: function () {
                return this.name + (this.options.stack ? (" " + this.options.stack) : "");
            }
        },
        tooltip: {
            distance: 10,
            animation: false,
            followPointer: false,
            hideDelay: 0,
            //shared: true,
            crosshairs: [{width: 2}, {width: 2}],
            shape: "square", //prevent callout on tooltip
            backgroundColor: "#ffffff"
        }
    };

    return result;
}
