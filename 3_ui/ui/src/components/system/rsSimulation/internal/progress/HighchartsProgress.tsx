import {ResizeSensorComponent} from 'components';
import {CSSProperties} from 'react';
import * as React from 'react';


interface MyProps {
	data: number[];
	colors: string[];
	max: number;
	categories: string[];
	stackCategory?: string;
	axisTitle?: string;
	axisTickEnable?: boolean;
	className?: string;
	style?: CSSProperties;
	categoryPlace?: 'left' | 'right';
	categorySpace?: number;
	tickAmount?: number;
	tooltip?: (point: any, isStacked: boolean) => string;
}

export class HighchartsProgress extends React.Component<MyProps, {}> {

	_toDispose = [];

	chartDiv: HTMLElement;
	chart: HighchartsChartObject;

	get stacked() {
		return !_.isEmpty(this.props.stackCategory);
	}

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
		if (!this.stacked) {
			return [{
				data: _.map(this.props.data, (v,i) => {
					return {x: i, y: v || 0, color: this.getColor(i)};
				})
			}];
		} else {
			return _.map(this.props.data, (v,i) => {
				return {data: [v || 0], color: this.getColor(i), stack: 'stack', name: this.props.categories[i]};
			});
		}
	}

	get categories () {
		const stacked = this.stacked;
		const {categories, stackCategory} = this.props;
		return stacked ? [stackCategory] : categories;
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any): void {
		let redraw = false;
		if (this.chart.yAxis[0].max != this.props.max) {
			this.chart.yAxis[0].update({max: this.props.max, title: {text: this.props.axisTitle}}, false);
			redraw = true;
		}

		const isCategoryChanged = this.props.stackCategory != prevProps.stackCategory;
		if (isCategoryChanged) {
			this.chart.update({chart: {height: this.chartHeight}}, false);
			this.chart.xAxis[0].update({categories: this.categories}, false);

			while (this.chart.series.length > 0) {
				this.chart.series[0].remove(false);
			}
			_.forEach(this.series, s => this.chart.addSeries(s as any, false));
			redraw = true;

		} else if (!_.isEqual(this.props.data, prevProps.data)) {
			_.forEach(this.series, (s, i) => this.chart.series[i].setData((s as any).data, false));
			redraw = true;
		}

		if (redraw) {
			this.chart.update({chart: {animation: (!isCategoryChanged || this.stacked)}, plotOptions: {bar: {animation: !isCategoryChanged}}}, false);
			this.chart.yAxis[0].update({max: this.props.max, tickInterval: this.tickInterval}, false);
			this.chart.redraw();
		}
	}

	get tickInterval(): number {
		const max = this.props.max;
		let testTickAmount = this.props.tickAmount ? this.props.tickAmount - 1 : Math.floor(this.chartWidth / 25);
		const testMax = max * (max < testTickAmount ? 100 : 1 );
		if (testMax > testTickAmount) {
			while ((testMax % testTickAmount != 0) && testTickAmount > 1) {
				testTickAmount--;
			}
		}
		return this.props.max / testTickAmount;
	}

	componentDidMount() {
		const _this = this;
		const {max, axisTitle, categoryPlace, categorySpace, tooltip } = this.props;
		const axisTickEnable = this.props.axisTickEnable !== false;

		const data = {
			chart: {
				type: "bar",
				spacing: [0,1,0,1],
				height: this.chartHeight,
				width: this.chartWidth,
				marginLeft: categoryPlace != 'right' ? categorySpace : null,
				marginRight: categoryPlace == 'right' ? categorySpace : null,
			},
			xAxis: [{
				categories: this.categories,
				opposite: categoryPlace == 'right',
				tickLength: 0,
				title: { text: null },
			}],
			yAxis: [{
				min: 0,
				max: max,
				title: { text: axisTitle },
				endOnTick: true,
				tickInterval: this.tickInterval,
				labels: { enabled: axisTickEnable },
				tickLength: axisTickEnable ? 10 : 0
			}],
			series: this.series,
			plotOptions: {
				bar: {
					stacking: 'normal',
					enableMouseTracking: !!tooltip,
					pointPadding: 0,
					pointWidth: 25,
					animation: false
				}
			},
			tooltip: {
				enabled: !!tooltip,
				formatter: function () {
					return tooltip && tooltip(this, _this.stacked);
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
		this._toDispose.forEach( e => e());
		this.chart && this.chart.destroy();
	}

	get chartHeight() {
		const {axisTitle, axisTickEnable} = this.props;
		const numOfBars = this.stacked ? 1 : this.props.categories.length;

		return ( numOfBars * 25 ) + ((numOfBars + 1) * 6 ) + ( axisTickEnable !== false ? 21 : 0) + ( axisTitle ? 25 : 0);
	}

	get chartWidth(){
		return $(this.chartDiv).width() || null;
	}

	resize = () => {
	 	if (!this.chart) {
	 		return;
	    }
		if (Math.abs( this.chartWidth - this.chart.chartWidth) > 5) {
			this.chart.update({chart: {width: this.chartWidth }}, true);
		}
	}

	render() {
		return <div className={this.props.className} style={Object.assign({}, this.props.style, {overflow: 'none'})}>
			<div ref={r => this.chartDiv = r} />
			<ResizeSensorComponent onResize={this.resize} />
		</div>;
	}
}
