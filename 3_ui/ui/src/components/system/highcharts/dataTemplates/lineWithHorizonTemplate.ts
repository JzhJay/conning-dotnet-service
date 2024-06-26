import {CRA_COLORS, CRA_COLORS_RAW} from 'components/system/highcharts/chartConstants';
import {ClimateRiskAnalysis} from 'stores';
import {HighchartDataTemplate} from "./highchartDataTemplate";
import type {ChartUserOptions} from 'stores/queryResult';

export function getHighchartsLineChartWithHorizonObject(chartType:string, climateRiskAnalysis: ClimateRiskAnalysis, userOptions: ChartUserOptions) {
	let title, yAxis = [], series = [];

	const rawDataAry = climateRiskAnalysis.output.financialDamageAndVolatilityShock;
	const rawData = rawDataAry[rawDataAry.length-1];

	switch (chartType) {
		case 'financialDamage':
			title = "Financial Damage Function";
			yAxis.push({
				opposite: true,
				title: {
					text: "Cumulative Damage",
					style: {color: CRA_COLORS[1]}
				},
				labels: {
					style: {color: `rgba(${CRA_COLORS_RAW[1]}, .8)`}
				},
				gridLineColor: `rgba(${CRA_COLORS_RAW[1]}, .15)`
			})
			yAxis.push({
				title: {
					text: "Return Shock",
					style: {color: CRA_COLORS[0]}
				},
				labels: {
					style: {color: `rgba(${CRA_COLORS_RAW[0]}, .8)`}
				},
				gridLineColor: `rgba(${CRA_COLORS_RAW[0]}, .15)`
			})

			series.push({
				name: "Return Shock",
				data: rawData.returnDeltas,
				yAxis: 1
			})
			let sum = 0;
			series.push({
				name: "Cumulative Damage",
				data: rawData.returnDeltas.map( rd => sum += rd ),
				//dashStyle: "Dash",
				yAxis: 0
			})
			break;
		case 'volatilityShock':
			title = "Volatility Shock";
			yAxis.push({
				title: {text: title}
			})
			series.push({
				name: title ,
				data: rawData.volatilityFactors
			})
			break;
	}

	let result = {
		title: {text: title},
		colors: CRA_COLORS,
		chart: {
			type: 'line',
			inverted: userOptions.isInverted
		},
		xAxis: [{
			title: {text: "Horizon (Years)"},
			tickInterval: 1,
			min: 0,
			max: userOptions.horizon
		}],
		yAxis: yAxis,
		plotOptions: {
			series: {
				boostThreshold: Number.MAX_VALUE,
				lineWidth: 3,
				marker: { enabled: false }
			}
		},
		tooltip: {
			shared: true
		},
		legend: {
			layout: 'horizontal',
			align: 'center',
			verticalAlign: 'bottom',
			symbolWidth: 30,
			// enabled: series.length > 1
			enabled: false
		},
		series: series
	};

	return _.merge({}, new HighchartDataTemplate(userOptions), userOptions.highchartsOptions, result);
}

export function setLineChartWithHorizonSeriesExtremes(chart, horizon?:number) {
	const {yAxis, series} = chart;

	if (horizon == null) {
		horizon = chart.xAxis[0].userOptions.connInitialMax;
	} else {
		chart.xAxis[0].userOptions.connInitialMin = 0;
		chart.xAxis[0].userOptions.connInitialMax = horizon;
	}
	chart.xAxis[0].setExtremes(0, horizon, false, false);

	const formatNumber = (n: number, round_function: (number) => number =Math.round) => round_function(n*10000)/10000;

	_.forEach( yAxis , (y,i) => {
		const relatedSeries = series.filter(s => (_.isNumber(s.options.yAxis) ? s.options.yAxis : 0) == i );
		const data = _.flatMap( relatedSeries, s => s.options.data.slice(0, horizon+1) );

		let yMax = formatNumber(Math.max(...data), Math.ceil);
		let yMin = formatNumber(Math.min(...data), Math.floor);

		if ( yMax == yMin) {
			// let line on the center of the chart when there has no slope.
			let minFirstDiff = Math.min(
				...(_.map(relatedSeries, (s:any) => formatNumber(Math.abs((_.find(s.options.data , d => d != yMin) as number) - yMin))))
			);
			yMax = yMax + minFirstDiff;
			yMin = yMin - minFirstDiff;
		}

		if (yAxis.length > 1) {
			const containerHeight = chart.plotHeight || chart.chartHeight;
			const splitBlock = Math.ceil(containerHeight / 80);

			let yInterval = formatNumber(Math.abs(yMax - yMin) / splitBlock, Math.ceil);
			// yInterval = formatNumber(Math.ceil(yInterval / 0.005) * 0.005);

			let firstTick, tickPositions;
			if (yMax == 0) {
				firstTick = 0;

				tickPositions = [firstTick];
				for (let j = 0; j < splitBlock; j++) {
					let p = formatNumber(firstTick - yInterval * (j + 1));
					tickPositions.unshift(p);
				}
			} else {
				firstTick = formatNumber(Math.floor(yMin / yInterval) * yInterval );

				tickPositions = [firstTick];
				for (let j = 0; j < splitBlock; j++) {
					let p = formatNumber(firstTick + yInterval * (j + 1));
					tickPositions.push(p);
				}
			}
			firstTick = tickPositions[0];
			const lastTick = tickPositions[tickPositions.length-1];
			y.userOptions.connInitialMin = firstTick;
			y.userOptions.connInitialMax = lastTick;
			y.setExtremes(firstTick, lastTick, false, false);
			y.update({"tickPositions": tickPositions}, false);
		} else {
			//yMin = formatNumber(yMin - Math.abs(yMin * 0.01), Math.floor);
			//yMax = formatNumber(yMax + Math.abs(yMax * 0.01), Math.ceil);
			y.userOptions.connInitialMin = yMin;
			y.userOptions.connInitialMax = yMax;
			y.setExtremes(yMin, yMax, false, false);
		}

		chart.redraw(false);
	});
}