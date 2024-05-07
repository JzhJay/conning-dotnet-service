import * as css from 'components/system/Progress/Progress.css';
import {observer} from "mobx-react";
import * as React from 'react';
import {LoadingIndicator, sem} from 'components'
import type {ProgressMessage} from './model';

(require('highcharts/modules/solid-gauge.src.js') as any)(Highcharts);

interface MyProps {
	progressMessage: ProgressMessage;
	progressDescription?: string;
	convertPercent?: boolean;
	noStepBoarder?: boolean;

	completedColor?: string;
	uncompletedColor?: string;
	displayFormat?: string;
	maxOfValues?: number;
}

@observer
export class SolidGaugeMonitor extends React.Component<MyProps, {}> {

	chartDiv: HTMLElement;
	chart;

	convertPercent: boolean = this.props.convertPercent === true;

	completedColor: string = this.props.completedColor || "#004990";
	uncompletedColor: string = this.props.uncompletedColor || "#4D90CD"

	progressMessageSetted: boolean = !!this.props.progressMessage;

	get max() {
		if (this.props.maxOfValues) {
			return this.props.maxOfValues;
		}
		if (!this.progressMessageSetted) {
			return 0;
		}
		let {numerator, denominator} = this.props.progressMessage.progress;
		if (!this.convertPercent) {
			return Math.ceil( (numerator > denominator ? numerator : denominator ) * 10 ) / 10;
		}
		return Math.ceil( Math.max( 1, denominator > 0 ? numerator/denominator : 0 ) * 1000 ) / 10;
	}

	get numerator() {
		if (!this.progressMessageSetted) {
			return 0;
		}
		let {numerator} = this.props.progressMessage.progress;
		if (!numerator) {
			return 0;
		}
		if (!this.convertPercent) {
			return numerator;
		}
		const max = this.max;
		return numerator / max * 100;
	}

	get denominator() {
		if (!this.progressMessageSetted) {
			return 0;
		}
		let {denominator} = this.props.progressMessage.progress;
		if (!denominator) {
			return 0;
		}
		const max = this.max;
		if( !this.props.maxOfValues ){
			return Math.max(max,!!this.chart ? this.chart.yAxis[0].max : 0);
		}
		if (!this.convertPercent) {
			return denominator;
		}
		return denominator / max * 100;
	}

	get stepsColors(){
		if (!this.progressMessageSetted) {
			return [[0,'#FFF']]
		}
		const max = this.max;
		const numerator = this.numerator;
		const denominator = this.denominator;
		const completedPercent = numerator / max;
		const uncompletedPercent = denominator / max;
		return [
			[completedPercent, this.completedColor],
			[completedPercent + 0.01, this.uncompletedColor],
			[uncompletedPercent, this.uncompletedColor]
		]
	}

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any): void {
		const progressMessage = this.props.progressMessage;
		if (!progressMessage || !this.chart)
			return;

		let updateData  = false
		const max = this.max;
		const numerator = this.numerator;
		const denominator = this.denominator;

		if (!this.props.maxOfValues && this.chart.yAxis[0].max != max) {
			this.chart.yAxis[0].update({max: max , tickPositions: [0, max]}, false);
			updateData = true;
		}


		if (this.chart.series[0].points[0].y != denominator) {
			this.chart.series[0].points[0].update(denominator, false);
			updateData = true;
		}

		if (this.chart.series[1].points[0].y != numerator) {
			this.chart.series[1].points[0].update(numerator , false);
			updateData = true;
		}

		if (updateData)
			this.chart.yAxis[0].update({stops:this.stepsColors}, false);


		if (!this.progressMessageSetted) {
			this.progressMessageSetted = true;
			this.chart.yAxis[0].setTitle({
				enabled: !(progressMessage.label == null || progressMessage.label === ""),
				text: progressMessage.label
			},false);
			updateData = true;
		}

		updateData && this.chart.redraw();
	}

	componentDidMount() {
		let {progressMessage, progressDescription, displayFormat} = this.props;

		displayFormat = displayFormat || ( this.convertPercent ? '{point.y:.0f}%':'{point.y:.2f}' );

		const yAxisTitle = this.progressMessageSetted ? {
			enabled: !(progressMessage.label == null || progressMessage.label === ""),
			text: progressMessage.label
		} : null;

		const config = {
			chart: {
				renderTo: this.chartDiv,
				type: 'solidgauge'
			},
			title: null,
			pane: {
				center: ['50%', '85%'],
				size: '140%',
				startAngle: -90,
				endAngle: 90,
				background: {
					backgroundColor: '#FFF',
					innerRadius: '60%',
					outerRadius: '100%',
					shape: 'arc'
				}
			},

			exporting: {
				enabled: false
			},

			tooltip: {
				enabled: false
			},
			credits: {
				enabled: false
			},
			yAxis: {
				min: 0,
				max: this.max,
				title: Object.assign({ y: -70 }, yAxisTitle),
				stops: this.stepsColors,
				lineWidth: 0,
				tickWidth: 0,
				minorTickInterval: null,
				tickAmount: 2,
				labels: { y: 16 }
			},
			series: [{
				data: this.props.maxOfValues && this.progressMessageSetted ? [progressMessage.progress.denominator] :[0],
				dataLabels: {
					enabled: false
				}
			},
			{
				data: this.progressMessageSetted ? [progressMessage.progress.numerator] :[0],
				dataLabels: {
					format:
						'<div style="text-align:center">' +
						`<span style="font-size:16px">${progressDescription}</span><br/>` +
						(false ? `<span style="font-size:12px;opacity:0.4">${displayFormat}</span>` : '') +
						'</div>'
				}
			}],
			plotOptions: {
				solidgauge: {
					dataLabels: {
						y: 5,
						borderWidth: 0,
						useHTML: true
					}
				},
				series: {
					enableMouseTracking: false,
					animation: false
				}
			}
		};

		this.chart = new Highcharts.Chart(config as any);
	}

	render() {
		if (this.props.noStepBoarder) {
			return <div className={classNames([css.root])}>
				<div style={{width: 300, height: 200}} ref={r => this.chartDiv = r}></div>
				<LoadingIndicator active={!this.progressMessageSetted}></LoadingIndicator>
			</div>;
		} else {
			return <div className={classNames([css.root, {[css.hide]: !this.progressMessageSetted}])}>
				<sem.StepGroup>
					<sem.Step className={css.highcharts}>
						<div style={{width: 300, height: 200}} ref={r => this.chartDiv = r}></div>
					</sem.Step>
				</sem.StepGroup>
			</div>;
		}
	}
}
