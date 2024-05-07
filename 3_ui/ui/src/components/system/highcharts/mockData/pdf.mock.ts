import {Utility} from "utility";

export function getMockPdfData(id: number) {
    let seriesData = _.cloneDeep(require('./PDFSeries.json'));

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

    let hexColors = ['#7cb5ec', '#90ed7d', '#434348', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];
    let rgbColors = utility.mapHexColorsToRgb(hexColors);

    for (let i = 0; i < seriesData.length; i++) {

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

    let result = {
        statistics: {mean: .02, standardDeviation: .012, skewness: 1.0, kurtosis: 1.0},
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
        axisNames: ["Economy", "Time"],

        chart: {
            type: "area",
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
            title: {text: "Probability Density"},
            minRange: -1, // allows zooming in on small ranges
            //min: 0,
            //max: 100
        },
        series: seriesData,
        legend: {
            align: "right",
            verticalAlign: "middle",
            layout: "vertical",
            enabled: true,
            //symbol:"line",
            //"symbolHeight": 18,
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
            //crosshairs: {width: 2},
            shape: "square", //prevent callout on tooltip
            backgroundColor: "#ffffff"
        }
    }

    return result;
}
