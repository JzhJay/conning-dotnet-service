import {ChartType} from '../highchartsApi';
import {Utility} from "../../../../utility";

export interface MockBoxData extends HighchartsOptions{
    chartType:ChartType;
    id:number;
    multipleGroupings:boolean;
}

export const mockBoxData:{[id:number]:MockBoxData} = {}

setupExample1();
setupExample2();

function setupExample1() {
    let mock = require('./cone.mock.json');
    mockBoxData[1] = Object.assign({chartType: 'box', id: 1}, createChart(mock, 1));
}

function setupExample2() {
    let mock = groupedSeries();
    mockBoxData[2] = Object.assign({chartType: 'box', id: 2}, createChart(mock, 2));
}

function groupedSeries() {

    let hexColors = ['#7cb5ec', '#90ed7d', '#434348', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];
    let rgbColors = utility.mapHexColorsToRgb(hexColors);

    // Add a few "preferred" colors to the front of the array
    rgbColors.unshift("0,82,136", "138,32,3", "0,98,37");

    let series = [];

    ["US", "GB"].forEach((stackValue, index) => {
        series.push({
            name: "95% to 100%",
            color: "rgba(" + rgbColors[index] + ",.2)",
            stack: stackValue,
            data: [[0.0193963866878266, 0.0193963866878266], [0.0342513444167316, 0.0562633087974522], [0.0438822924893734, 0.0632453070081233], [0.0518779714420041, 0.068488886382215], [0.0603652968952832, 0.118478439841326], [0.0652618132162223, 0.119098724259489], [0.0740919167778206, 0.11962464608439], [0.0797898412530231, 0.124636937732019], [0.0832118891032987, 0.136205343484259], [0.0849093019506427, 0.147405383487499], [0.0897665557106459, 0.156910703357442], [0.0931020889633723, 0.144428923144121], [0.0935429802099388, 0.147585566324851], [0.0978312281227622, 0.153483071144831], [0.101777563620173, 0.164858499858792], [0.103678289107072, 0.199931929533798], [0.105299729809016, 0.179139765535538], [0.107566103803247, 0.179421705062561], [0.112451546435181, 0.206781289706595], [0.112183149757471, 0.200842068908447], [0.110108319841902, 0.202669663382588]]
        }, {
            name: "75% to 95%",
            color: "rgba(" + rgbColors[index] + ",.48)",
            stack: stackValue,
            data: [[0.0193963866878266, 0.0193963866878266], [0.027472103701183, 0.0342513444167316], [0.0335647226452207, 0.0438822924893734], [0.0386813796684711, 0.0518779714420041], [0.0433712102722496, 0.0603652968952832], [0.0474742139855451, 0.0652618132162223], [0.0516997381877083, 0.0740919167778206], [0.0553251567325989, 0.0797898412530231], [0.0582113139005214, 0.0832118891032987], [0.0604206768916189, 0.0849093019506427], [0.0629820184608317, 0.0897665557106459], [0.0652412224247065, 0.0931020889633723], [0.0670576240613239, 0.0935429802099388], [0.0692862838598599, 0.0978312281227622], [0.0707276285096527, 0.101777563620173], [0.0728567704852844, 0.103678289107072], [0.0745478492936436, 0.105299729809016], [0.0752655917660706, 0.107566103803247], [0.0757163525947999, 0.112451546435181], [0.0764709017687331, 0.112183149757471], [0.0757290980187471, 0.110108319841902]]
        }, {
            name: "50% to 75%",
            color: "rgba(" + rgbColors[index] + ",1.0)",
            stack: stackValue,
            data: [[0.0193963866878266, 0.0193963866878266], [0.0239720435886594, 0.027472103701183], [0.0280279975401551, 0.0335647226452207], [0.0317137704737228, 0.0386813796684711], [0.0349571992354134, 0.0433712102722496], [0.037693590474263, 0.0474742139855451], [0.0403337213837815, 0.0516997381877083], [0.0426622983601634, 0.0553251567325989], [0.0454540823588487, 0.0582113139005214], [0.0460355098438084, 0.0604206768916189], [0.0483918819452696, 0.0629820184608317], [0.050312301593666, 0.0652412224247065], [0.0513482568635824, 0.0670576240613239], [0.0518658123102621, 0.0692862838598599], [0.0534021398479528, 0.0707276285096527], [0.0546196102065031, 0.0728567704852844], [0.0547995993839455, 0.0745478492936436], [0.056201149935771, 0.0752655917660706], [0.0573203877705734, 0.0757163525947999], [0.0578260067634247, 0.0764709017687331], [0.0583963151828781, 0.0757290980187471]]
        }, {
            name: "25% to 50%",
            color: "rgba(" + rgbColors[index] + ",1.0)",
            //borderColor: "rgba(255, 255, 255, 1)",
            stack: stackValue,
            data: [[0.0193963866878266, 0.0193963866878266], [0.0209508272527058, 0.0239720435886594], [0.0234159436248789, 0.0280279975401551], [0.0258755203820238, 0.0317137704737228], [0.0281523933217058, 0.0349571992354134], [0.0302328318156343, 0.037693590474263], [0.0321448429127125, 0.0403337213837815], [0.0332494079858041, 0.0426622983601634], [0.0346421551624362, 0.0454540823588487], [0.0361422641778842, 0.0460355098438084], [0.0372633812688379, 0.0483918819452696], [0.0385029355457802, 0.050312301593666], [0.0391421824194915, 0.0513482568635824], [0.0395030791593325, 0.0518658123102621], [0.0400796836035117, 0.0534021398479528], [0.0405001981738609, 0.0546196102065031], [0.0422124867978018, 0.0547995993839455], [0.042431486053474, 0.056201149935771], [0.0419574826810791, 0.0573203877705734], [0.0420798433983469, 0.0578260067634247], [0.0428115461122648, 0.0583963151828781]]
        }, {
            name: "5% to 25%",
            color: "rgba(" + rgbColors[index] + ",.48)",
            stack: stackValue,
            data: [[0.0193963866878266, 0.0193963866878266], [0.0172294990995673, 0.0209508272527058], [0.0185308685006188, 0.0234159436248789], [0.0195498696546935, 0.0258755203820238], [0.0211250734047119, 0.0281523933217058], [0.0221185072031363, 0.0302328318156343], [0.0231925623022038, 0.0321448429127125], [0.023413104432371, 0.0332494079858041], [0.0240988120144963, 0.0346421551624362], [0.0250894078344775, 0.0361422641778842], [0.0263792887563078, 0.0372633812688379], [0.0261508773022543, 0.0385029355457802], [0.0271183170008294, 0.0391421824194915], [0.0281179873640252, 0.0395030791593325], [0.0286036476678859, 0.0400796836035117], [0.0289965903582912, 0.0405001981738609], [0.0282833890552894, 0.0422124867978018], [0.0282059471362889, 0.042431486053474], [0.028520447751965, 0.0419574826810791], [0.0284792136232148, 0.0420798433983469], [0.0276479252811806, 0.0428115461122648]]
        }, {
            name: "0% to 5%",
            color: "rgba(" + rgbColors[index] + ",.2)",
            stack: stackValue,
            data: [[0.0193963866878266, 0.0193963866878266], [0.0143190911424266, 0.0172294990995673], [0.0122338620502571, 0.0185308685006188], [0.0124750932444566, 0.0195498696546935], [0.012326315379739, 0.0211250734047119], [0.0161709002515639, 0.0221185072031363], [0.0138259895431047, 0.0231925623022038], [0.0153650698517451, 0.023413104432371], [0.0161266870927976, 0.0240988120144963], [0.0156199385015463, 0.0250894078344775], [0.0158539503198302, 0.0263792887563078], [0.0156985813882488, 0.0261508773022543], [0.0148880936896229, 0.0271183170008294], [0.0152842017926781, 0.0281179873640252], [0.0154766517367319, 0.0286036476678859], [0.0187343804734292, 0.0289965903582912], [0.0156257014783816, 0.0282833890552894], [0.015265488118126, 0.0282059471362889], [0.0155332698457737, 0.028520447751965], [0.0152811957077823, 0.0284792136232148], [0.0149744209288356, 0.0276479252811806]]
        })

        // Double all he values to add some variation
        if (index === 1) {
            for (let i = series.length / 2; i < series.length; i++) {
                for (let j = 0; j < series[i].data.length; j++) {
                    series[i].data[j][0] *= 2;
                    series[i].data[j][1] *= 2;
                }
            }
        }

    });

    return {
        "category": ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034"],
        "series": series
    };
}

export function createChart(mock, id) {
    const {category, series} = mock;
    const multipleGroupings = id === 2;

    return {
        multipleGroupings: multipleGroupings,
        chart: {
            type: "columnrange",
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
            tickmarkPlacement: "on",
            title: {text: "Time"}
        },
        plotOptions: {
            series: {
                getExtremesFromAll: true,
                cursor: "pointer",
                turboThreshold: 1000000,
                allowPointSelect: true,
                stickyTracking: false,
                animation: true,
                groupPadding: .05,
                borderWidth: 1,
                lineColor: "rgb(255,255,255)",
                grouping: multipleGroupings,
                stacking: multipleGroupings ? "normal" : null
            }
        },
        yAxis: {
            title: {text: "Data"},
            minRange: -1, // allows zooming in on small ranges
        },
        series: series,
        legend: {
            align: "right",
            verticalAlign: "middle",
            layout: "vertical",
            enabled: true,
            "symbolHeight": 18,
            itemHiddenStyle: {color: "#E6E6E6"}
        },
        tooltip: {
            distance: 10,
            animation: false,
            followPointer: multipleGroupings,
            hideDelay: 0,
            shared: false,
            //crosshairs: {width: 3, color:'rgba(255, 255, 255, .1'},
            shape: "square", //prevent callout on tooltip
            backgroundColor: "#ffffff"
        }
    }
}