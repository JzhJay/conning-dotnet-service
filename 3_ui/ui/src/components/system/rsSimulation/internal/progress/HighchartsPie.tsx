import {CSSProperties} from 'react';
import * as React from 'react';


interface MyProps {
	data: number[];
	colors: string[];
	categories: string[];
	className?: string;
	style?: CSSProperties;
	tooltip?: (point: any) => string;
	heightWidth: number;
	title?: string | JSX.Element;
}

export class HighchartsPie extends React.Component<MyProps, {}> {

	chartDiv: HTMLElement;
	chart: HighchartsChartObject;

	getColor(i) {
		const {colors} = this.props;
		if (i < colors.length) {
			return colors[i];
		} else {
			const highChartsColors = Highcharts.getOptions().colors; //get colors from highcharts default setting;
			return highChartsColors[i-colors.length];
		}
	}

	get series() {
		return [{
			colorByPoint: true,
			data: _.map(this.props.data, (v,i) => ({
				y: v,
				color: this.getColor(i),
				name: this.props.categories[i]
			}))
		}];
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any): void {
		if (!_.isEqual(this.props.data, prevProps.data)) {
			// console.log(`old: ${JSON.stringify(prevProps.data)} , new: ${this.props.data}, diff: ${_.difference(this.props.data, prevProps.data)}`)
			this.chart.series[0].setData(this.series[0].data);
		}
	}

	componentDidMount() {
		const {tooltip } = this.props;

		const data = {
			chart: {
				type: "pie",
				height: this.chartHeightWidth,
				width: this.chartHeightWidth,
				spacing: [0,0,0,0],
				marginLeft: 0,
				marginRight: 0,
			},
			series: this.series,
			plotOptions: {
				pie: {
					allowPointSelect: false,
					dataLabels: { enabled: false },
					animation: false
				}
			},
			tooltip: {
				enabled: !!tooltip,
				formatter: function () {
					return tooltip && tooltip(this);
				}
			},
			title: { text: null },
			boost: { enabled: false },
			legend: { enabled: false },
			credits: { enabled: false },
			exporting: { enabled: false }
		};

		this.chart = new Highcharts.Chart(this.chartDiv as any, data as any);

	}

	componentWillUnmount(): void {
		this.chart && this.chart.destroy();
	}

	get chartHeightWidth() {
		if (_.isFinite(this.props.heightWidth)) {
			return this.props.heightWidth;
		}
		const width = $(this.chartDiv).width() || 200;
		const height = $(this.chartDiv).height() || 200;
		return Math.min(width, height);
	}

	render() {
		return <div className={this.props.className} style={Object.assign({}, this.props.style, {overflow: 'none'})}>
			<div ref={r => this.chartDiv = r} />
			{this.props.title && <div data-role={"title"}>{this.props.title}</div>}
		</div>;
	}
}
