import {reaction} from 'mobx';
import {observer} from "mobx-react";
import * as React from 'react';
import {LoadingIndicator, ResizeSensorComponent, sem} from 'components'
import type {ProgressMessage} from './model';
import * as css from './Progress.css';

export interface HighchartsProgessSeriesConfig {
	name?: string;
	color?: string;
	dataFormatter?: boolean | string | ( (data) => string )
}

const defaultCompletedConfig = { name: "completed" , color: "#004990"};
const defaultUncompletedConfig = { name: "uncompleted" , color: "#4D90CD"};

interface MyProps {
	title?: string;
	progressDescription?: string;
	progressMessages: ProgressMessage[];
	convertPercent?: boolean;

	completedConfig?: HighchartsProgessSeriesConfig;
	uncompletedConfig?: HighchartsProgessSeriesConfig;
	maxOfValues?: number;
	tickAmount?: number;
}

@observer
export class HighchartsProgess extends React.Component<MyProps, {}> {

	defaultDisplayFormat = this.props.convertPercent !== false ? '{point.y:.0f}%':'{point.y:.2f}';

	_toDispose = [];

	containerId = `__HighchartsProgess_${parseInt((Math.random()*100000000)+'')}`;
	chartDiv: HTMLElement;
	chart;

	convertPercent: boolean = this.props.convertPercent === true;
	maxOfYAxis =  this.props.maxOfValues || ( this.convertPercent ? 100:0 );
	tickAmount : number = this.props.tickAmount || 6;

	completedConfig:HighchartsProgessSeriesConfig = Object.assign( {}, defaultCompletedConfig, this.props.completedConfig);
	uncompletedConfig:HighchartsProgessSeriesConfig = Object.assign( {}, defaultUncompletedConfig, this.props.uncompletedConfig);

	 get completedSeries() {
		const {progressMessages} = this.props;
		const rtn = progressMessages.map( pm => {
			let y;
			if (pm.progress.denominator == 0)
				y = null;
			else if (this.convertPercent)
				y = (pm.progress.numerator / pm.progress.denominator * 100) || null;
			else
				y = pm.progress.numerator || null;

			return Object.assign({y:y}, pm.extendData);
		});
		// console.log("  completed: " + rtn);
		return rtn;

	}

	get uncompletedSeries() {
		const {progressMessages} = this.props;
		const rtn = progressMessages.map( pm => {
			let y;
			if (pm.progress.denominator == 0)
				y = this.convertPercent ? 100 : 0;
			else if (this.convertPercent)
				y = (( 1 - pm.progress.numerator / pm.progress.denominator ) * 100);
			else
				y = (pm.progress.denominator - pm.progress.numerator);
			return Object.assign({y:y}, pm.extendData);
		})
		// console.log("uncompleted: " + rtn);
		return rtn;
	}

	updateSeries( series , newDatas ){
	 	if( series.data.length != newDatas.length ){
		    series.update({ data: newDatas}, false );
	    } else {
			series.setData(newDatas, false);
	    }
	}

	/*
	// Removing the below block to resolve a MobX warning. If its still needed then we need to remove the @observer decorator or re-architect to split into 2 components.
	shouldComponentUpdate(nextProps, nextState: Readonly<{}>, nextContext: any): boolean {
		if (!this.props.progressMessages || ( nextProps.progressMessages && this.props.progressMessages.length != nextProps.progressMessages.length)) {
			return true;
		}
		let result = false;
		this.props.progressMessages.forEach( (pp,i) => {
			result = result || ( pp.progress.numerator != nextProps.progressMessages[i].progress.numerator ) || ( pp.progress.denominator != nextProps.progressMessages[i].progress.denominator );
		});
		// console.log(`is updated? ${result}`)
		return result;
	}*/

	componentDidUpdate(prevProps: Readonly<MyProps>, prevState: Readonly<{}>, snapshot?: any): void {
		if (!this.props.maxOfValues) {
			let maxOfYAxis = Math.max(...this.props.progressMessages.map(pm => pm.progress.denominator));
			if (maxOfYAxis && maxOfYAxis != this.maxOfYAxis) {
				this.maxOfYAxis = maxOfYAxis;
				this.chart.yAxis[0].update({max: maxOfYAxis}, false);
			}
		}
		let uncompletedSeries = this.uncompletedSeries;
		let completedSeries = this.completedSeries;
		this.updateSeries(this.chart.series[0], uncompletedSeries);
		this.updateSeries(this.chart.series[1], completedSeries);
		this.resize();
		this.chart.redraw();
	}

	componentDidMount() {
		let {progressMessages, title, progressDescription} = this.props;

		const series = [
			this.formatSetting(this.uncompletedConfig, this.uncompletedSeries),
			this.formatSetting(this.completedConfig, this.completedSeries),
		];

		const data = {
			chart: {
				renderTo: this.chartDiv,
				type: "bar",
				height: this.highchartsWidth,
				width: this.highchartsHeight
			},
			boost: {
				enabled: false
			},
			title: {
				enabled: !(title == null || title === ""),
				text: title
			},
			xAxis: {
				categories: progressMessages.map(pm => pm.label)
			},
			yAxis: {
				opposite: true,
				min: 0,
				max: this.maxOfYAxis,
				title: {
					enabled: !(progressDescription == null || progressDescription === ""),
					text: progressDescription
				},
				showEmpty:false,
				tickAmount: this.tickAmount,
			},
			series: series,
			legend:      {
				reversed: true
			},
			plotOptions: {
				series: {
					stacking: 'normal',
					enableMouseTracking: false,
					pointWidth: 25
				}
			},
			tooltip:     {
				enabled: false
			},
			credits:     {
				enabled: false
			},
			exporting:   {
				enabled: false
			}

		};

		this.chart = new Highcharts.Chart(data as any);

		this._toDispose.push(reaction(() => this.props.progressMessages.length, async () => {
			this.chart.xAxis[0].update( { categories : this.props.progressMessages.map(pm => pm.label) } , false);
			this.resize();
		}));
	}

	componentWillUnmount(): void {
		this._toDispose.forEach( e => e());
	}

	formatSetting(config:HighchartsProgessSeriesConfig , dataArray?: Array<any>){
	 	const formatter = config.dataFormatter;
	 	let dataLabels = {
		    enabled: true,
		    crop: false,
		    color: '#FFFFFF',
		    align: 'right',
		    x: -5,
		    style: { fontSize: '13px', textOutline: '0px' }
	    };

	 	if (formatter === true) {
		    dataLabels['format'] = this.defaultDisplayFormat;
	    } else if (typeof formatter == 'string') {
		    dataLabels['format'] = formatter || this.defaultDisplayFormat;
	    } else if (typeof formatter == 'function') {
	 	    dataLabels['formatter'] = function(option){ return formatter(this); };
	    } else {
		    dataLabels.enabled = false;
	    }

	 	let rtn = {
	 		dataLabels: dataLabels
	 	};

		config.name != null && (rtn['name'] = config.name);
		config.color != null && (rtn['color'] = config.color);
		dataArray != null && (rtn['data'] = dataArray);

	 	return rtn;
	}

	get highchartsHeight(){
		return ( this.props.progressMessages.length * 30 ) + 150;
	}

	get highchartsWidth(){
		let width = $(`#${this.containerId}`).width();
	 	if(width > 0 ) {
		    return width - 10;
		}
	 	return null;
	}

	resize = () => {
	 	if (!this.chart) {
	 		return;
	    }
		let  width = this.highchartsWidth;
		width = width != this.chart.chartWidth ? width : null;

	 	let height = this.highchartsHeight;
	 	height = height != this.chart.chartHeight ? height : null;

		(!!width || !!height) && this.chart.setSize(width, height, false);
	}

	render() {
		return <div className={classNames([css.root])}>
			<sem.StepGroup>
				<sem.Step className={css.highcharts} id={this.containerId}>
					<div ref={r => this.chartDiv = r}></div>
					<ResizeSensorComponent onResize={this.resize} />
					<LoadingIndicator active={!this.props.progressMessages.length}></LoadingIndicator>
				</sem.Step>
			</sem.StepGroup>
		</div>;
	}
}
