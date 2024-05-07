import {ResizeSensorComponent} from 'components';
import * as React from 'react';

export class HighchartsLegend extends React.Component<{series: {name: string, color: string}[], chartHeight?: number}, any> {

	chartDiv: HTMLElement;
	chart: HighchartsChartObject;

	componentDidMount() {
		this.chart = new Highcharts.Chart(this.chartDiv as any, {
			chart: { type: 'column' },
			series: this.props.series,
			xAxis: {
				title: { text: null },
				width: 0
			},
			yAxis: {
				title: { text: null },
			},
			plotOptions: {
				series: {
					events: {
						legendItemClick: function(e) {
							e.preventDefault();
						}
					}
				}
			},
			legend: {
				align: 'left',
				verticalAlign: 'center',
				layout: 'vertical',
				symbolRadius: 0,
				itemStyle: {cursor: 'default'}

			},
			title: { text: null },
			credits: { enabled: false },
			exporting: { enabled: false }
		} as any );
	}

	get chartHeight() {
		return this.props.chartHeight || $(this.chartDiv).height() || null;
	}

	get chartWidth(){
		return $(this.chartDiv).width() || null;
	}

	resize = () => {
		if (!this.chart) {
			return;
		}
		let redraw = false;

		if (Math.abs(this.chartWidth - this.chart.chartWidth) > 5) {
			this.chart.update({chart: {width: this.chartWidth}}, false);
			redraw = true;
		}
		if (Math.abs(this.chartHeight - this.chart.chartHeight) > 5) {
			this.chart.update({chart: {height: this.chartHeight}}, false);
			redraw = true;
		}
		if (redraw) {
			this.chart.redraw(true);
		}
	}

	render() {
		return <div style={Object.assign({}, {overflow: 'none'})}>
			<div ref={r => this.chartDiv = r} />
			<ResizeSensorComponent onResize={this.resize} />
		</div>;;
	}
}