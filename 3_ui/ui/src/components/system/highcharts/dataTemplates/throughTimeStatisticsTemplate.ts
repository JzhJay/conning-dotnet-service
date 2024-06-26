import {getFullPercentileValues} from 'components/system/highcharts/chartUtils';
import {makeOpaque} from 'utility';
import type {ChartUserOptions} from '../../../../stores/charting';
import {ClimateRiskAnalysis} from '../../../../stores/climateRiskAnalysis';
import {CRA_COLORS} from '../chartConstants';
import {getPercentileColorAndOpacity, HighchartDataTemplate} from './highchartDataTemplate';

export function getHighchartsThroughTimeStatisticsObject(climateRiskAnalysis: ClimateRiskAnalysis, userOptions: ChartUserOptions) {
	let {basecase,adjusted} = climateRiskAnalysis.output.throughTimeStatistics;

	const category = ['Base Case', 'Adjusted'];
	const colors = [CRA_COLORS[0], CRA_COLORS[1]];
	const dashStyle = ['LongDash', 'Dash', 'ShortDash', 'ShortDashDot', 'ShortDot', 'dot'];
	let percentilesKeys = Object.keys(basecase).filter(k => k != "Mean").reverse();

	const xMax = userOptions.horizon;
	let yMax = null, yMin = null;
	_.forEach( [...Object.values(basecase), ...Object.values(adjusted)], arr => {
		const data = arr.slice(0,xMax+1);
		yMax = Math.ceil(yMax ? Math.max(yMax, ...data) : Math.max(...data));
		yMin = Math.floor( Math.min(yMin || yMax, ...data));
	});
	yMin = Math.floor(yMin - Math.abs(yMin * 0.01));
	yMax = Math.ceil(yMax + Math.abs(yMax * 0.01));

	let iconningMaxZoomingUnits = -6;
	// if the maximum and minimum diff over 10^6, locked the zooming level not too small to avoid the browser memory leak.
	// e.g. the maximum value is 10^10, the yAxis ticks will not under 10^4
	let yMaxValue = Math.max(
		...(_.map(Object.values(basecase), n => Math.abs(_.last(n)))),
		...(_.map(Object.values(adjusted), n => Math.abs(_.last(n))))
	);
	while (yMaxValue > 1 ) {
		iconningMaxZoomingUnits++;
		yMaxValue = yMaxValue / 10;
	}

	if (iconningMaxZoomingUnits > 0) {
		const zoomUnit = Number(`1e+${iconningMaxZoomingUnits}`);
		if (Math.abs(yMax) < zoomUnit) {
			yMax =  yMax > 0 ? zoomUnit : 0;
		}
	}

	const basecaseStyle = { colorIndex: 0 }
	const adjustedStyle = { colorIndex: 1 }

	const legendNameFormatter = ( a , b ) => `${b}% to ${a}%`;

	const lineSeries = [], areaRangeSeries = [];
	const legends = [];

	lineSeries.push({
		name: `${category[0]} Mean`,
		type: "line",
		data:basecase["Mean"],
		stack: `${category[0]},Mean`,
		...basecaseStyle
	})
	lineSeries.push({
		name: `${category[1]} Mean`,
		type: "line",
		data: adjusted["Mean"],
		stack: `${category[1]},Mean`,
		...adjustedStyle
	})

	if (percentilesKeys.length > 0) {
		const percentileToNumeric = (p) => Number(/=(\d+(\.\d+)?)%/.exec(p)[1]);

		let percentilesKeyPairs = percentilesKeys.map( p => {
			const _p = percentileToNumeric(p);
			return Math.max(_p, 100 - _p);
		}).sort();
		percentilesKeyPairs = percentilesKeyPairs.filter((p, i) => i < 1 || p != percentilesKeyPairs[i-1]);

		let colors = _.clone(userOptions.colorSet).reverse();

		percentilesKeys.forEach((percentilesKey, j) => {

			const percentile = percentileToNumeric(percentilesKey);
			let indexFromMiddle = _.indexOf(percentilesKeyPairs, Math.max(percentile, 100 - percentile));
			let colorAndOpacity = getPercentileColorAndOpacity(userOptions.percentiles, percentilesKeys.length - j - 1, percentilesKeys.length, colors); // Reverse direction to match box NQT and box opacities
			const dStyle = dashStyle[indexFromMiddle < dashStyle.length ? indexFromMiddle : dashStyle.length - 1];

			lineSeries.push({
				name:      `${category[0]} ${percentile}`,
				type:      "line",
				data:      basecase[percentilesKey],
				dashStyle: dStyle,
				stack:     `${category[0]},${percentile}`,
				...basecaseStyle
			})

			lineSeries.push({
				name:      `${category[1]} ${percentile}`,
				type:      "line",
				data:      adjusted[percentilesKey],
				dashStyle: dStyle,
				stack:     `${category[1]},${percentile}`,
				...adjustedStyle
			})

			legends.push({type: "line", name: `${percentile}`, color: `#000`, dashStyle: dStyle, connShowLineOnly: true})

			if ( j == percentilesKeys.length - 1) { return; }

			const next_percentilesKey = percentilesKeys[j+1];
			const next_percentile = percentileToNumeric(next_percentilesKey);
			const arearangeStack = legendNameFormatter(percentile,next_percentile);
			const opacity = colorAndOpacity.opacity;

			areaRangeSeries.push({
				name:  `${category[0]} ${percentile}/${next_percentile}%`,
				type:  "arearange",
				data:  basecase[percentilesKey].map((v, i) => [i, v, basecase[next_percentilesKey][i]]),
				stack: `${category[0]},${arearangeStack}`,
				iconnOpacity: opacity,
				...basecaseStyle
			});

			areaRangeSeries.push({
				name:  `${category[1]} ${percentile}/${next_percentile}%`,
				type:  "arearange",
				data:  adjusted[percentilesKey].map((v, i) => [i, v, adjusted[next_percentilesKey][i]]),
				stack: `${category[1]},${arearangeStack}`,
				iconnOpacity: opacity,
				...adjustedStyle
			});

			legends.push({type: "arearange",name: arearangeStack, color: `rgba(0,0,0,${opacity})`, connSizeSymbolToHeight: true})


		});
		legends[legends.length-1].connLastPercentile = true;
	}

	legends.push({type: 'line', name: `Mean`, color: '#000', dashStyle: 'solid'});
	legends.push({type: 'area', name: `${category[0]}`, color: colors[0], height: '8px'});
	legends.push({type: 'area', name: `${category[1]}`, color: colors[1] });


	const outputSeries = setThroughTimeStatisticsObjectSeriesOpacity(userOptions, [...areaRangeSeries, ...lineSeries]);

	let result = {
		chart: {
			inverted: userOptions.isInverted
		},
		colors: colors,
		plotOptions: {
			arearange: {
				lineWidth: 0,
			},
			series: {
				marker: {
					enabled: false,
					states: { hover: { enabled: false}}
				},
				states: { hover: { enabled: false}}
			}
		},
		xAxis: [{
			title: {text: "Horizon (Years)"},
			tickInterval: 1,
			min: 0,
			max: xMax
		}],
		yAxis: [{
			title: {text: "Market Value"},
			min: yMin,
			max: yMax
		}],
		legend: {
			symbolWidth: 30, // use a bigger symbol width ine line charts to allow dashed legend symbols to show a more complete period
			enabled: outputSeries.length > 1
		},
		series: outputSeries,
		tooltip: {
			enable: false,
			shape: "square", //prevent callout on tooltip
			crosshairs: true,
			shared: true,
			valueSuffix: '°C',
			xDateFormat: '%A, %b %e'
		},
		iconningLegend: legends,
		iconningMaxZoomingUnits: iconningMaxZoomingUnits,
	}

	return _.merge(new HighchartDataTemplate(userOptions), userOptions.highchartsOptions, result);
}

export function setThroughTimeStatisticsObjectSeriesExtremes(chart, horizon?:number) {
	const {series, userOptions: {iconningMaxZoomingUnits} } = chart;

	if (horizon == null) {
		horizon = chart.xAxis[0].userOptions.connInitialMax;
	} else {
		chart.xAxis[0].userOptions.connInitialMin = 0;
		chart.xAxis[0].userOptions.connInitialMax = horizon;
	}

	let yMax = null, yMin = null;
	_.forEach( series, s => {
		let data = s.options.data.slice(0, horizon+1);
		if (s.options.type == "arearange") {
			data = _.flatMap(data , (d: number[]) => d.slice(1));
		}
		else if (chart.options.chart.type == "columnrange") {
			if (s.options.type == null)
				data = _.flatMap(data , (d) => d.high);
			else
				return;
		}
		yMax = Math.ceil(yMax ? Math.max(yMax, ...data) : Math.max(...data));
		yMin = Math.floor( yMin ? Math.min(yMin, ...data) : Math.min(...data));
	});

	yMax = Math.ceil(yMax + Math.abs(yMax * 0.01));
	yMin = Math.floor(yMin - Math.abs(yMin * 0.01));

	if (iconningMaxZoomingUnits > 0) {
		const zoomUnit = Number(`1e+${iconningMaxZoomingUnits}`);
		if (Math.abs(yMax) < zoomUnit) {
			yMax =  yMax > 0 ? zoomUnit : 0;
		}
	}

	chart.yAxis[0].userOptions.connInitialMin = yMin;
	chart.yAxis[0].userOptions.connInitialMax = yMax;

	chart.xAxis[0].setExtremes(0, horizon, false, false);
    chart.yAxis[0].setExtremes(yMin, yMax, false, false);

	chart.redraw(false);
}

export function setThroughTimeStatisticsObjectSeriesOpacity(userOptions: ChartUserOptions, series: any[]) {

	const {seriesSwitch, fillOpacity, lineOpacity} = userOptions;

	const counter = (opacities: number[]) : number => {
		let rtn = 1;
		_.forEach(opacities, (o,i)=>{
			rtn = rtn * (_.isNumber(o) ? o : 1);
		})
		return parseFloat(rtn.toFixed(2));

	}

	let series_0_fill_opacity = 1, series_0_line_opacity = 1,
		series_1_fill_opacity = 1, series_1_line_opacity = 1;
	if (seriesSwitch < 0) {
		series_0_fill_opacity = counter([fillOpacity]);
		series_0_line_opacity = counter([lineOpacity]);
		series_1_fill_opacity = counter([fillOpacity, 1 - Math.abs(seriesSwitch)]);
		series_1_line_opacity = counter([lineOpacity, 1 - Math.abs(seriesSwitch)]);
	} else if (seriesSwitch > 0) {
		series_0_fill_opacity = counter([fillOpacity, 1 - seriesSwitch]);
		series_0_line_opacity = counter([lineOpacity, 1 - seriesSwitch]);
		series_1_fill_opacity = counter([fillOpacity]);
		series_1_line_opacity = counter([lineOpacity]);
	} else {
		series_0_fill_opacity = counter([fillOpacity]);
		series_0_line_opacity = counter([lineOpacity]);
		series_1_fill_opacity = counter([fillOpacity]);
		series_1_line_opacity = counter([lineOpacity]);
	}

	const updateFillOpacity = (series, newOpacity) => _.isFunction(series.update) ? series.update({'fillOpacity': newOpacity}, false) : (series.fillOpacity = newOpacity);
	const updateLineOpacity = (series, newOpacity) => _.isFunction(series.update) ? series.update({'opacity': newOpacity}, false) : (series['opacity'] = newOpacity);
	_.forEach(series, s => {
		const type = s.type;
		const iconnOpacity = s.iconnOpacity || s.options?.iconnOpacity || 1;

		const colorIndex = s["colorIndex"];
		if (colorIndex == 0 && type == "line") {
			updateLineOpacity(s, series_0_line_opacity);
		} else if (colorIndex == 0 && type == "arearange") {
			updateFillOpacity(s, series_0_fill_opacity * iconnOpacity);
		} else if (colorIndex == 1 && type == "line") {
			updateLineOpacity(s, series_1_line_opacity);
		} else if (colorIndex == 1 && type == "arearange") {
			updateFillOpacity(s, series_1_fill_opacity * iconnOpacity);
		}
	});

	return series;
}
