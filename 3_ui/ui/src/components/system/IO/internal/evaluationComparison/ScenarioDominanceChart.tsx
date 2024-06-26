import { Colors } from 'themes/themes';
import DominanceChartBase from './DominanceChartBase';

class ScenarioDominanceChart extends DominanceChartBase  {
	renderChart() {
		const { evaluation1, evaluation2, comparisonResult, targetIndex = 2 } = this.props;
		const { scenarioDominancePdf, scenarioDominanceFraction } = comparisonResult;
		const chartColors = this.getChartColors();
		const chartGradientOpacity = [0.5, 0];

		const series = scenarioDominancePdf[targetIndex].reduce((accu, point) => {
			point[0] < 0 ? accu[0].push(point) : accu[1].push(point);
			return accu;
		}, [[],[]]).map((data, i)=> {
			return {
				name: i === 0 ? `${evaluation2.name} > ${evaluation1.name}` : `${evaluation1.name} > ${evaluation2.name}`,
				fillColor: {
					linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
					stops: [
						[0, Highcharts.color(chartColors[i]).setOpacity(chartGradientOpacity[0]).get('rgba')],
						[1, Highcharts.color(chartColors[i]).setOpacity(chartGradientOpacity[1]).get('rgba')]
					]
				},
				data
			}
		});
		const percentage = `${(scenarioDominanceFraction * 100).toFixed(0)}%`;
		const subtitle =  { text: evaluation1.name === evaluation2.name ? '' : `${evaluation1.name} > ${evaluation2.name} ${percentage} of the scenarios` };

		if (!this.chart) {
			const options = {
				chart: {
					type: 'area',
					renderTo: this.chartDiv.current
				},
				colors: chartColors,
				title: {
					text: 'Scenario Dominance'
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
					}
				},
				plotOptions: {
					line: {
						marker: {
							enabled: false
						}
					}
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
			this.chart.update({
				subtitle,
				series
			});
		}
	}
}

export default ScenarioDominanceChart;
