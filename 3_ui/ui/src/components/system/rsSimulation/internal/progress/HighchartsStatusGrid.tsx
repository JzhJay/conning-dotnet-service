import {ResizeSensorComponent} from 'components';
import {CSSProperties} from 'react';
import * as React from 'react';

interface MyProps {
	max: number;
	min?: number
	data: number[][];
	colors: string[];
	categories: string[];
	columnWidth?: number | ((plotWidth:number, plotHeight:number, axisDiff: number) => number );
	axisLabelEnabled?: boolean;
	tooltipEnabled?: boolean;
	chartHeight?: number;
	className?: string;
	style?: CSSProperties;
	minorTickInterval?: number | 'auto' | ((extremes: {max:number, min:number}) => (number | 'auto' | null));
	changeExtremesByData?: boolean;
	redraw?: (HighchartsChartObject) => void
}

export class HighChartsStatusGrid extends React.Component<MyProps, {}> {

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
		const data = this.props.data;
		return _.map(this.props.categories, (category, i) => {
			return {
				name: category,
				color: this.getColor(i),
				data: _.map(data, d => d[i]),
				stack: 'stack'
			}
		})
	}

	_extremes;
	get extremes() {
		let {max, min, changeExtremesByData, data} = this.props;
		if (changeExtremesByData !== true) {
			return {max, min}
		}
		_.forEach(data, d => {
			let dataMax = _.sum(_.filter(d, n => n > 0));
			let dataMin = _.sum(_.filter(d, n => n < 0));

			if (dataMax > max) {
				max = Math.max(max, Math.ceil(dataMax/10) *10 );
			}

			if (dataMin < min) {
				min = Math.min(min, Math.floor(dataMin/10) *10 );
			}
		})
		if (this._extremes) {
			max = Math.max(max, this._extremes.max );
			min = Math.min(min, this._extremes.min );
		}
		this._extremes = {max, min}
		return this._extremes;
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any): void {
		let redraw = false;

		if(!this.props.data.length) { return; }

		if (prevProps.data.length != this.props.data.length) {
			while (this.chart.series.length > 0) {
				this.chart.series[0].remove(false);
			}
			_.forEach(this.series, s => this.chart.addSeries(s, false, false));
			this.resize(true);
			redraw = false;
		} else {
			_.forEach(this.series, (s, i) => {
				let testSeries = this.chart.series[i];
				if (!_.isEqual(testSeries.userOptions.data as any, s.data)) {
					testSeries.setData(s.data, false);
					redraw = true;
				}
			})
		}
		if (redraw) {
			this.chart.yAxis[0].update({...this.extremes, minorTickInterval: this.minorTickInterval}, false);
			this.chart.redraw(true);
		}

	}

	componentDidMount() {
		const {redraw} = this.props;
		const extremes = this.extremes;

		const data = {
			chart: {
				type: 'column',
				margin: [ null, 1, null, (this.props.axisLabelEnabled !== false) ? null : 1],
				height: this.chartHeight,
				width: this.chartWidth,
				plotShadow: {
					color: 'gray',
					opacity: 0.5,
					width: 1,
					offsetX: 0,
					offsetY: 0
				},
				events: {
					load: () => {
						setTimeout(() => {
							this.chartDiv.style.overflowX = 'auto';
							this.resize(true);
						}, 100);
					},
					redraw: redraw ? function() { redraw(this); } : null
				}
			},
			xAxis: [{
				title: { text: null },
				labels: { enabled: false },
				tickLength: 0
			}],
			yAxis: [{
				min: extremes.min,
				max: extremes.max,
				title: { text: null },
				gridLineWidth: 0,
				gridZIndex: 5,
				tickLength: 0,
				minorTickInterval: this.minorTickInterval,
				minorGridLineColor: 'white',
				minorTickLength: 0,
				tickPositioner:  function () {
					const {max, min} = this;
					if (max == min) {
						return [min];
					}
					const middle = Math.round((max + min) / 2);
					if (middle == max || middle == min) {
						return [min, max];
					}
					return [min, middle, max];
				},
				labels: {
					enabled: this.props.axisLabelEnabled !== false,
					formatter: function() { return `${this.value}`; }
				}
			}],
			series: this.series,
			plotOptions: {
				column: {
					stacking: 'normal',
					pointPadding: 0,
					borderWidth: 1,
					enableMouseTracking: this.props.tooltipEnabled !== false,
					animation: false
				}
			},
			tooltip: {
				enabled: this.props.tooltipEnabled !== false,
				formatter: function () { return this.series.name; }
			},
			title: { text: null },
			legend: { enabled: false },
			credits: { enabled: false },
			exporting: { enabled: false }
		};

		this.chart = new Highcharts.Chart(this.chartDiv as any, data as any);

	}

	componentWillUnmount() {
		this.chart && this.chart.destroy();
	}

	get chartHeight() {
		return this.props.chartHeight || $(this.chartDiv).height() || null;
	}

	get chartWidth(){
		return $(this.chartDiv).width() || null;
	}

	get plotHeight() {
		return this.chartHeight - ((this.chart?.plotTop || 10) + ((this.chart as any)?.marginBottom || 15));
	}

	 get plotWidth() {
		return this.chartWidth - ((this.chart?.plotLeft || 32) + ((this.chart as any)?.marginRight || 1)) - 2;
	 }

	get columnWidth() {
		const minColumnWidth = 5;

		let propColumnWidth = this.props.columnWidth;

		const plotWidth = this.plotWidth;
		const plotHeight = this.plotHeight;
		const extremes = this.extremes;
		const yDiff = Math.ceil(extremes.max - extremes.min);
		if ( plotWidth == 0 || plotHeight == 0 || yDiff == 0) {
			return minColumnWidth;
		}
		if (_.isFunction(propColumnWidth)) {

			propColumnWidth = propColumnWidth((plotWidth - 1), plotHeight, yDiff);
		}
		if (_.isFinite(propColumnWidth)) {
			return Math.max(minColumnWidth, propColumnWidth);
		}

		const lengthOfSeries = this.props.data.length;
		return Math.max(minColumnWidth, Math.floor(( plotWidth - 1) / lengthOfSeries));
	}

	get axisOffset () {
		const chartWidth = this.chartWidth;
		const dataWidth = this.dataWidth;
		const plotLeft = ((this.chart as any).plotBox.x);
		return Math.floor(Math.max(chartWidth - plotLeft - 1 - dataWidth, 0) / 2) + plotLeft + 1;
	}

	get minorTickInterval() {
		let {minorTickInterval} = this.props;

		if (minorTickInterval == null) {
			return null;
		}
		if (_.isFunction(minorTickInterval)) {
			minorTickInterval = minorTickInterval(this.extremes);
		}
		return minorTickInterval;
	}

	get dataWidth() {
		const lengthOfSeries = this.props.data.length;
		return (this.columnWidth * lengthOfSeries);
	}

	resize = (force = false) => {
		if (!this.chart || !this.chart.chartHeight || !this.chart.chartWidth) {
			return;
		}
		const {chartHeight, chartWidth} = this;
		// console.log(`resize - height:${this.chart.chartHeight} ==> ${chartHeight} / width:${this.chart.chartWidth} ==> ${chartWidth}`);

		let shouldRedraw = false;
		if (force || chartHeight != this.chart.chartHeight) {
			this.chart.update({chart: {height: chartHeight}}, false);
			shouldRedraw = true;
		}
		if (force || chartWidth != this.chart.chartWidth) {
			const {dataWidth, columnWidth, axisOffset} = this;
			this.chart.update({chart: {width: Math.max(chartWidth, dataWidth)} as any, plotOptions: {column: {pointWidth: columnWidth}}}, false);
			this.chart.xAxis[0].update({width: dataWidth, left: axisOffset} as any, false);
			shouldRedraw = true;
		}
		if (shouldRedraw) {
			this.chart.redraw();
		}
	}

	resize_lock = false;
	resize_debounced(height?: number, width?: number) {
		if (this.resize_lock && !height && !width) {
			return;
		}
		this.resize_lock = true;
		const {chartHeight, chartWidth} = this;
		// console.log(`resize_debounced - height:${height} ==> ${chartHeight} / width:${width} ==> ${chartWidth} // ${(chartHeight == height && chartWidth == width)}`);
		if (chartHeight == height && chartWidth == width) {
			this.resize();
			this.resize_lock = false;
		} else {
			setTimeout( () => this.resize_debounced(chartHeight, chartWidth) , 500);
		}
	}

	render() {
		return <div className={classNames(this.props.className)} style={Object.assign({}, this.props.style, {})}>
			<div ref={r => this.chartDiv = r} />
			<ResizeSensorComponent onResize={() => this.resize_debounced()} />
		</div>;
	}
}
