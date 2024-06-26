import * as ReactDOMServer from 'react-dom/server';
import { computed, makeObservable } from 'mobx';

import { ChartAxisMaximumType } from 'stores';
import { Colors } from 'themes/themes';
import type { EvaluationDetail } from '../../../../../stores/io';
import { IO } from '../../../../../stores/io';

interface MyProps {
	className?: string;
	io: IO;
	evaluation1: EvaluationDetail;
	evaluation2: EvaluationDetail;
	chartAxisMaximum: ChartAxisMaximumType;
}

class ComparisonChartBase extends React.Component<MyProps, {}> {
    chartDiv = React.createRef<HTMLDivElement>();
    chart;

	constructor(props) {
		super(props);

		makeObservable(this);
	}

    @computed get assetCategories(): string[] {
		return this.props.io.getAssetClassInputWithoutGroups().map((asset) => asset.name);
	}

    getChartBaseOptions() {
		const chartHeight = this.assetCategories.length * 50 +100;

		return {
			chart: {
				type: 'bar',
				renderTo: this.chartDiv,
				height: `${chartHeight}px`
			},
			title: {
				text: ''
			},
			colors: [Colors.light.primary, Colors.light.secondary],
			xAxis: {
				categories: this.assetCategories,
				title: {
					text: null
				}
			},
			yAxis: {
				title: {
					text: null
				},
				labels: {
					overflow: 'justify',
					align: 'right',
					formatter: function() {
						return `${(this.value*100).toFixed(0)}%`;
					}
				},
				opposite: true
			},
			series: [],
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			tooltip: {
				pointFormatter: function() {
					const point = this;

					return ReactDOMServer.renderToStaticMarkup(
						<>
							<span style={{ color: point.color, fontFamily: 'Helvetica, sans-serif' }}>&#9608; </span>
							{point.series.name}: <b>{(point.y*100).toFixed(2)}%</b><br/>
						</>
					);
				}
			},
			legend: {
				enabled: true,
				layout: 'horizontal',
				align: 'center',
				verticalAlign: 'bottom',
				symbolRadius: 0
			},
			credits: {
				enabled: false
			},
			exporting: {
				enabled: false
			}
		};
	}

    getUpdateChartData() {
		// must be implemented in derived classes
		return {};
	}

    getChartAxisConstraint(chartData, type: ChartAxisMaximumType) {
		// must be implemented in derived classes
		return {};
	}

    renderChart() {
		if (this.props.evaluation1 && this.props.evaluation2) {
			if (!this.chart) {
				const { chartAxisMaximum } = this.props;
				const chartData = Object.assign(this.getChartBaseOptions(), this.getUpdateChartData());
				const axisConstraint = this.getChartAxisConstraint(chartData, chartAxisMaximum);
				Object.assign(chartData.yAxis, axisConstraint);
				chartData.chart.renderTo = this.chartDiv.current;
				this.chart = new Highcharts.Chart(chartData);
			} else {
				this.chart.update(this.getUpdateChartData());
			}
		}
	}

    componentDidUpdate(prevProps) {
		if (prevProps.evaluation1 !== this.props.evaluation1 || prevProps.evaluation2 !== this.props.evaluation2) {
			this.renderChart();
		} else if (prevProps.chartAxisMaximum !== this.props.chartAxisMaximum) {
			const axisConstraint = this.getChartAxisConstraint(this.chart, this.props.chartAxisMaximum);
			this.chart?.update({
				yAxis: axisConstraint
			});
		}
	}

    componentDidMount() {
		this.renderChart();
	}

    componentWillUnmount() {
		if (this.chart) {
			this.chart.destroy();
			this.chart = null;
		}
	}

    render() {
		const { className } = this.props;

        return (
			<div className={className} ref={this.chartDiv} />
        );
    }
}

export default ComparisonChartBase;