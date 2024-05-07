const hexColors = ['#7cb5ec', '#90ed7d', '#434348', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];
const rgbColors =
    hexColors.map(color => parseInt(color.substring(1, 3), 16) + "," + parseInt(color.substring(3, 5), 16) + "," + parseInt(color.substring(5, 7), 16));


export function getMockHistogramData(id:number) {
    let category, series;

    category = ["0", "2.5", "5", "7.5", "10", "12.5", "15", "17.5", "20", "22.5", "25", "27.5", "30"];

    let result = {
        chart: {
            type: "column",
            ignoreHiddenSeries: false,
            inverted: null,
            zoomType: "xy",
            panning: "xy",
            panKey: "buttonPan"
        },
        title: {text: null},
        subtitle: {text: null},
        credits: {
            text: "Credits",
            enabled: true
        },
        xAxis: {
            // reversed: false,
            gridLineWidth: 0,
            minRange: -1, // allows zooming in on small ranges
            categories: category,
            //tickmarkPlacement: "on",
            title: {text: "Buckets"}
        },
        plotOptions: {
            series: {
                getExtremesFromAll: true,
                cursor: "pointer",
                turboThreshold: 1000000,
                allowPointSelect: true,
                stickyTracking: false,
                animation: true,
                groupPadding: 0,
                borderWidth: 0,
                //lineColor: "rgb(255,255,255)",
                grouping: false,
                //stacking: multipleGroupings ? "normal" : null
            }
        },
        yAxis: {
            title: {text: "Probability"},
            minRange: -1, // allows zooming in on small ranges
            //min:0,
            // max:1,
        },
        series: [
            {
                name: "Large Cap 2014",
                data: [0, .5, .5, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: "Large Cap 2015",
                data: [0.013333333, 0.973333333, 0.013333333, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: "Large Cap 2016",
                data: [0.03, 0.81, 0.16, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: "Large Cap 2017",
                data: [0.093333333, 0.633333333, 0.25, 0.023333333, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: "Large Cap 2018",
                data: [0.123333333, 0.53, 0.296666667, 0.05, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: "Large Cap 2019",
                data: [0.113333333, 0.456666667, 0.343333333, 0.073333333, 0.01, 0.003333333, 0, 0, 0, 0, 0, 0]
            },
            {
                name: "Other Sector 2014",
                data: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: "Other Sector 2015",
                data: [0, 0.08, 0.706666667, 0.21, 0.003333333, 0, 0, 0, 0, 0, 0, 0]
            },
            {
                name: "Other Sector 2016",
                data: [0.003333333, 0.13, 0.45, 0.343333333, 0.063333333, 0.01, 0, 0, 0, 0, 0, 0]
            },
            {
                name: "Other Sector 2017",
                data: [0.016666667, 0.143333333, 0.34, 0.313333333, 0.14, 0.036666667, 0.006666667, 0.003333333, 0, 0, 0, 0]
            },
            {
                name: "Other Sector 2018",
                data: [0.016666667, 0.17, 0.246666667, 0.3, 0.156666667, 0.07, 0.03, 0.006666667, 0, 0, 0, 0.003333333]
            },
            {
                name: "Other Sector 2019",
                data: [0.03, 0.163333333, 0.216666667, 0.253333333, 0.166666667, 0.093333333, 0.043333333, 0.013333333, 0.01, 0.006666667, 0, 0.003333333]
            }
        ],
        legend: {align: "right", verticalAlign: "middle", layout: "vertical", enabled: true},
        tooltip: {
            distance: 10,
            animation: false,
            followPointer: true,
            hideDelay: 0,
            shared: false,
            //crosshairs: {width: 3, color:'rgba(255, 255, 255, .1'},
            shape: "square", //prevent callout on tooltip
            backgroundColor: "#ffffff"
        }
    };

    if (id === 1) {
        result.series.length = 2;
    }

    let start = .05;
    let end = .5;

    for (let i = 0; i < result.series.length; i++) {
        let series:any = result.series[i];
        series.pointPadding = start + (end - start) * (i / (result.series.length - 1)) * (1 - Math.sqrt(1 / result.series.length));
        series.color = "rgba(" + rgbColors[i % rgbColors.length] + ",.6)";
    }

    return result;
}
