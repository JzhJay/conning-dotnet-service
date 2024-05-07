import * as ReactDOMServer from 'react-dom/server';
import {ScatterChartExtender} from "./scatter.hc.extender";
import { getMarkerObject } from "../dataTemplates/highchartDataTemplate";
import {PDFChartHighchartsExtender} from "./pdf.hc.extender";
import {DensityHighchartsExtender} from "./density.hc.extender";
import { HighchartsComponent } from "../highchartsComponent";
import { ChartDataMap, ChartDataRef } from "../../../../stores/charting/chartComponentModels";
import { BeeswarmTooltip } from "../internal-components/tooltips/BeeswarmTooltip";
import {i18n} from 'stores';
import { RawIntlProvider } from 'react-intl';

export class BeeswarmChartExtender extends PDFChartHighchartsExtender(DensityHighchartsExtender(ScatterChartExtender)) {
	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions, shouldGroupLegendItem = false) {
		super(chartComponent, highchartsOptions);
		this.fullfilledLoadedRequirements = false;
	}

	wrapHighchart() {
		super.wrapHighchart();

		//this.wrap("chart", Highcharts.seriesTypes.scatter.prototype, "cvsMarkerCircle", function (p, ctx, clientX, plotY, r, i) {
		//	p.call(this, ctx, clientX, plotY, r);
			//return;
			//ctx.moveTo(clientX, plotY);

			/*
			r = r > 1 ? r - 1 : r // Make room for stroke if radius is big enough
			// +r to move to the end of the arc which
			ctx.moveTo(clientX + (this.chart.inverted ? 0 : r), plotY + (this.chart.inverted ? r : 0));
			ctx.arc(clientX, plotY, r, 0, 2 * Math.PI, false);

			if (i == this.userOptions.data.length - 1) {
				ctx.strokeStyle=this.userOptions.lineColor;
				ctx.stroke();
			}/*

			// This solution creates a new path and avoids using moveTo
			/*ctx.beginPath();
			ctx.arc(clientX, plotY, r, 0, 2 * Math.PI, false);
			ctx.fillStyle=this.color;
			ctx.fill();

			ctx.strokeStyle=this.userOptions.lineColor;
			ctx.stroke();

			// Move away from point. needed to avoid boost applying a second fill to last point
			ctx.beginPath();
			ctx.moveTo(0, 0);*/
		//});

	}

	zeroed_data = [];

	load(chart) {
		super.load(chart);
		this.zeroed_data = [];
		for (let i = 0; i < this.chart.series.length; i++) {
			//this.chart.series[i].setData(this.chart.series[i], false);
			let x = chart.series[i].xData
			let y = Array.apply(null, Array(x.length)).map(Number.prototype.valueOf, 0);
			let zeroed = []
			for (let j = 0; j < x.length; j++) {
				zeroed.push([x[j], y[j]])
			}
			this.zeroed_data.push(zeroed);
		}

		//this.chart.update.xAxis
	}


	get canZoom() {
		return false;
	}

	// temp - move later
	setMarkerSize(size:number)
	{
		const chart = this.chart;
		chart.series.forEach((series:any) => {
			if (!series.userOptions.isRegressionLine) {
				//const color = series.color.substring(series.color.indexOf("(") + 1, series.color.lastIndexOf(","))
				series.update(_.merge({}, getMarkerObject(size, Highcharts.color(series.color).rgba.slice(0, 3)), {marker:{lineWidth:1, lineColor:series.userOptions.lineColor}}), false);
			}
		});
		chart.redraw();
	}

	//wasResized = false
	resize() {
		//console.log(this);
		//this.wasResized = true;
		this.updateChartData()
	}


	renderedPlotHeight = 0;
	renderedPlotWidth = 0;

	async updateChartData(forceUpdate:boolean = false) {

		const {chart, chartComponent} = this;

		// TODO use refetchData() to fetch new beeswarm data
		// Await the first resize before proceeding to ensure that the chart is correctly sized, e.g. the size was adjusted to account for the toolbar
		// Update: Rendering toolbar immediatetly now so waiting for a resize shouldn't be needed.
		if (forceUpdate || (this.renderedPlotHeight != chart.plotHeight || this.renderedPlotWidth != chart.plotWidth)) {
			this.renderedPlotHeight = chart.plotHeight;
			this.renderedPlotWidth = chart.plotWidth;
			chartComponent.userOptions.plotWidth = chart.inverted ? chart.plotHeight : chart.plotWidth;
			chartComponent.userOptions.plotHeight = chart.inverted ? chart.plotWidth : chart.plotHeight;

			/*
			this.chartComponent.highchartsStore.getBeeswarmData(chart.plotHeight, chart.plotWidth, [0, 1, 5, 25, 50, 75, 95, 99, 100]).then(data => {
				const template = getHighchartsBeeswarmObject(data, this.chartComponent.pivotMetadata, this.chartComponent.userOptions)
				this.updateSeries(template.series);
				// this.chart.redraw()

				this.chartComponent.chart.xAxis[0].setExtremes(data.x_min, data.x_max);
				this.chartComponent.chart.xAxis[0].userOptions.connInitialMin = data.x_min;
				this.chartComponent.chart.xAxis[0].userOptions.connInitialMax = data.x_max;

				this.setMarkerSize(data.radius);

				this.fullfilledLoadedRequirements = true;
				this.isFullyLoaded = true;
			})*/


			await this.chartComponent.highchartsStore.getPrebuiltDataTemplate('beeswarm', chartComponent.userOptions).then((dataMap: ChartDataMap) => {
				let data = (_.values(dataMap)[0] as ChartDataRef).chartData as any;
				//const template = getHighchartsBeeswarmObject(data, this.chartComponent.pivotMetadata, this.chartComponent.userOptions)

				this.updateSeries(data.series);
				const xAxis = data.xAxis[0];
				// this.chart.redraw()

				this.chartComponent.chart.xAxis[0].setExtremes(xAxis.min, xAxis.max);
				this.chartComponent.chart.xAxis[0].userOptions.connInitialMin = xAxis.min;
				this.chartComponent.chart.xAxis[0].userOptions.connInitialMax = xAxis.max;

				const markerSize = data.plotOptions.series.marker.radius ? data.plotOptions.series.marker.radius : data.series[0].marker.radius
				this.setMarkerSize(markerSize);

				this.fullfilledLoadedRequirements = true;
				this.isFullyLoaded = true;
			})
		}
	}

	resetSeries() {
		this.updateSeries(this.zeroed_data);
	}


	updateSeries(newSeries) {

		for (let i = 0; i < this.chart.series.length; i++) {
			//console.log(i);
			//console.log(newSeries[i]);
			//console.log(this.chart.series[i]);
			this.chart.series[i].update({ data: newSeries[i].data, visible: newSeries[i].visible}, false)//setData(newSeries[i].data, false, false, false);
			//console.log(this.chart.series[i]);
		}
		this.chart.redraw();
		// this.chart.reflow();
		//this.chartComponent.extender.adjustStoredAxisLimits();
	}


	adjustStoredAxisLimits() {
		const yAxis = this.chartComponent.chart.yAxis[0];
		yAxis.userOptions.connInitialMax = 1;
		yAxis.userOptions.connInitialMin = 0;
		//this.chartComponent.onUpdateUserOptions({canResetZoom: true});
	}

	/**
	 * Redraw callback. Called everytime the chart is redrawn. e.g. because of a resizing or zooming.
	 * @param {type} e  redraw event
	 * @returns {undefined}
	 */
	redraw(chart, e) {
		super.redraw(chart, e);

		var _thisClass = this;
		var clonedTooltip,
			point,
			tooltip = chart.tooltip,
			tooltipPoint,
			currentSeries,
			anim;

		// Refresh the hover states of the forced hover points.
		// to prevent stale hover points from showing after they are shifted
		// e.g. after a zoom
		if(chart.forcedHovers && chart.forcedHovers.length > 0) {
			Highcharts.each(chart.forcedHovers, function(p) {
				_thisClass.setState(p[0], p[1], '', false);
				_thisClass.setState(p[0], p[1], 'hover', false);
			});
		}

		chart.options.exporting.sourceWidth = chart.chartWidth;
		chart.options.exporting.sourceHeight = chart.chartHeight;


		this.updateChartData();
	}

	/**
	 * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
	 * @returns the formatted tooltip string
	 */
	toolTipFormatter(p):any {
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><BeeswarmTooltip point={p} chart={this.chart} chartData={this.chartComponent.chartData} getPrecisionFromAxis={this.getPrecisionFromAxis} /></RawIntlProvider>)
	}

	axisLabelOnMouseOver(axis, axisLabel, e) {
		let chart = axis.chart;

		// Remove callout when hovering over labels
		chart.tooltip.options.shape = "square";
		chart.tooltip.destroy();

		super.axisLabelOnMouseOver(axis, axisLabel, e);
	}

	axisLabelOnMouseOut(axis, axisLabel, e) {
		super.axisLabelOnMouseOut(axis, axisLabel, e);

		// reset callout
		let chart = axis.chart;
		delete chart.tooltip.options.shape;
		chart.tooltip.destroy();
	}

}