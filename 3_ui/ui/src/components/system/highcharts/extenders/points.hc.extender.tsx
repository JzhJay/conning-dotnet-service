import {IO} from '../../../../stores/io';
import {HighchartsExtender} from "./highchartsExtender";
import {HighchartsComponent} from "../highchartsComponent";

export class PointsExtender extends HighchartsExtender {

	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions, shouldGroupLegendItem = true) {
		super(chartComponent, highchartsOptions, shouldGroupLegendItem)
	}

	getFormattedLegendItem(item, inStack) {
		if (inStack)
			return this.createLegendItem(item.chart, {name: item.options.stack, color: "rgb(0,0,0)", dashStyle: item.options.dashStyle});
		else
			return this.createLegendItem(item.chart, {name: item.name, color: item.color, borderColor:item.options.borderColor,});
	}

	seriesMouseOver(series) {
		series.chart.series.forEach((s) => {
			if (series != s) {
				s.graph.attr({
					opacity: .25
				});
			}
		});
	}

	seriesMouseOut(series) {
		series.chart.series.forEach((s) => {
			s.graph.attr({
				opacity: 1
			});
		});
	}


	removeTooltips()
	{
		let chart = this.chart;
		let customPoint;
		for (let name in chart.options.customTooltips) {
			customPoint = chart.options.customTooltips[name];
			if (customPoint && customPoint.customTooltip) {
				chart.container.firstChild.removeChild(customPoint.customTooltip);
			}
		}

		chart.options.customTooltips = {
			iterator: 0
		};

		this.chartComponent.canRemoveTooltips = false;

		this.updateTooltipsUserOptions();
	}

	updateTooltipsUserOptions()
	{
		let chart = this.chart;
		let userOptionProps = {};

		// Copy relevant settings that are needed to re-create tooltips.
		for (let obj in chart.options.customTooltips)
		{
			if (chart.options.customTooltips[obj] != null) {
				if (obj === "iterator")
					userOptionProps[obj] = chart.options.customTooltips[obj];
				else {
					let tooltip = chart.options.customTooltips[obj];
					userOptionProps[obj] = {
						hasCustomTooltip: tooltip.hasCustomTooltip,
						seriesIndex: tooltip.seriesIndex,
						name: tooltip.name
					}
				}
			}
		}

		this.updateHighchartsUserOptions({customTooltips:userOptionProps});
	}

	/**
	 * Load Callback. Fires when the chart is finished loading.
	 * @returns {undefined}
	 */
	load(chart)
	{
		super.load(chart);
		this.chartComponent.canRemoveTooltips = chart.options.customTooltips.iterator !== 0;

		// when exporting, restore previously stored tooltips
		if(chart.options.customTooltips && chart.options.chart.forExport) {
			let tooltip = chart.tooltip,
				series = chart.series,
				tooltipPoint,
				currentSeries,
				point;
		}

		if (chart.options.customTooltips)
			this.refreshCustomTooltips(chart);

		// hack to get scatter/beeswarm to render when zoom is re-applied. Probably related to Highcharts bug in printing https://jira.advise-conning.com/browse/WEB-1983
		// (No longer an issue with fix for TRAC-4487 but EF doesn't render donuts without this async redraw)
		if (!this.isForExport(chart)) {
			setTimeout(() => {
				this.chart.redraw()
			}, 1);
		}
	}
	/**
	 * Redraw callback. Called everytime the chart is redrawn. e.g. because of a resizing or zooming.
	 * @param {type} e  redraw event
	 * @returns {undefined}
	 */
	redraw(chart, e) {
		super.redraw(chart, e);

		let _thisClass = this;

		this.refreshCustomTooltips(chart);

		// Refresh the hover states of the forced hover points.
		// to prevent stale hover points from showing after they are shifted
		// e.g. after a zoom
		if(chart.forcedHovers && chart.forcedHovers.length > 0) {
			Highcharts.each(chart.forcedHovers, function(p) {
				_thisClass.setState(p[0], p[1], '', false);
				_thisClass.setState(p[0], p[1], 'hover', false);
			});
		}

		// Not sure why we need to set the source dimensions here since they get set in load(). But this breaks exports in the EF chart.
		// TODO: Investigate removing alltogether.
		if (!(this.chartComponent.props.chartingResult instanceof IO)) {
			chart.options.exporting.sourceWidth  = chart.chartWidth;
			chart.options.exporting.sourceHeight = chart.chartHeight;
		}
	}

	tooltipKey = (point) => null;

	refreshCustomTooltips(chart)
	{
		let clonedTooltip,
		    point,
		    tooltip = chart.tooltip,
		    tooltipPoint,
		    currentSeries,
		    anim;

		for (let name in chart.options.customTooltips) {
			point = chart.options.customTooltips[name];
			if (point && point.hasCustomTooltip) {
				currentSeries = chart.series[point.seriesIndex];

				if (currentSeries == null)
					continue;

				if (!currentSeries.visible) {
					point.customTooltip && (point.customTooltip.style.display = "none"); //hide tooltip
					continue; // don't add the tooltip when series is hidden
				}

				// remove previous tooltip:
				if (chart.options.chart.forExport) {
					if (point.customTooltipExport) {
						point.customTooltipExport.parentElement.removeChild(point.customTooltipExport);
						point.customTooltipExport = false;
					}
				} else if (point.customTooltip && point.customTooltip.parentElement) {
					point.customTooltip.parentElement.removeChild(point.customTooltip);
				}
				// disable temporary animation:
				anim = tooltip.options.animation;
				tooltip.options.animation = false;

				// update label - arrow position may be changed:
				const seriesPoint = Array.isArray(currentSeries.options.data) && !Number.isInteger(point.name) ? currentSeries.options.data.filter(p => p.name == point.name)[0] : currentSeries.options.data[point.name] ;

				if (seriesPoint == null || this.tooltipKey(seriesPoint) != point.key)
					return;

				tooltipPoint = (new currentSeries.pointClass()).init(currentSeries, seriesPoint);
				let x = chart.xAxis[0].toPixels(tooltipPoint.x, true);
				let y = chart.yAxis[0].toPixels(tooltipPoint.y, true);
				tooltipPoint.tooltipPos = [
					chart.inverted ? y : x,
					chart.inverted ? x : y
				];
				tooltip.refresh(tooltipPoint);

				// recreate tooltip:
				if (tooltip.label) {
					clonedTooltip = tooltip.label.element.cloneNode(true);

					chart.container.firstChild.insertBefore(clonedTooltip, tooltip.label.element);
					if (chart.options.chart.forExport) {
						point.customTooltipExport = clonedTooltip;
					} else {
						point.customTooltip = clonedTooltip;
					}
				}

				// restore animation:
				tooltip.options.animation = anim;
			}
		}
	}
}
