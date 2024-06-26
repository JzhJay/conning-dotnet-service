import DominanceChartBase from './DominanceChartBase';

class StatisticalDominanceChart extends DominanceChartBase {
	renderChart() {
		const {
			evaluation1,
			evaluation2,
			comparisonResult,
		} = this.props;

		const { statisticalDominanceCdfMinuend, statisticalDominanceCdfSubtrahend, statisticalDominanceFraction } = comparisonResult;
		const series = [{
			name: `${evaluation2.name}`,
			data: statisticalDominanceCdfSubtrahend,
		}, {
			name: `${evaluation1.name}`,
			data: statisticalDominanceCdfMinuend,
		}];

		// temporary solution for handling if some data points are missing
		const data = [];
		for (let i=0; i <= 100; i++) {
			data.push([null, null]);
		}
		statisticalDominanceCdfMinuend.forEach(([y, x]) => { data[Math.floor(x*100)][0] = y; });
		statisticalDominanceCdfSubtrahend.forEach(([y, x]) => { data[Math.floor(x*100)][1] = y; });
		const percentage = `${(statisticalDominanceFraction * 100).toFixed(0)}%`;
		const subtitle =  { text: evaluation1.name === evaluation2.name ? '' : `SORT(${evaluation1.name}) > SORT(${evaluation2.name}) ${percentage} of the scenarios` };

		if (!this.chart) {
			const options = {
				chart: {
					type: 'line',
					renderTo: this.chartDiv.current,
				},
				colors: this.getChartColors(),
				title: {
					text: 'Statistical Dominance'
				},
				subtitle,
				xAxis: {
					title: {
						text: null
					}
				},
				yAxis: {
					title: {
						text: null
					},
					min: 0,
					max: 1
				},
				series,
				credits: {
					enabled: false
				},
				exporting: {
					enabled: false
				}
			};

			this.chart = new Highcharts.Chart(options);
		} else {
			while (this.chart.series.length) {
				this.chart.series[0].remove();
			}
			series.forEach((s)=> {
				this.chart.addSeries(s);
			})
			this.chart.update({ subtitle });
		}
	}
}

export default StatisticalDominanceChart;
