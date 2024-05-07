import {HighchartsComponent} from "components";
import * as ReactDOMServer from 'react-dom/server';
import {LineTooltip} from "../internal-components/tooltips/LineTooltip";
import {PointsExtender} from "./points.hc.extender";
import {i18n} from 'stores';
import { RawIntlProvider } from "react-intl";

export class LineChartExtender extends PointsExtender {

	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions, shouldGroupLegendItem = true) {
		super(chartComponent, highchartsOptions, shouldGroupLegendItem)
	}

	/**
	 * Extend existing highchart methods/functionality by wrapping the methods
	 */
	wrapHighchart() {
		super.wrapHighchart();

		//wrap the line series drawLegendSymbol to cap the lineWidth.
		this.wrap("chart", Highcharts.seriesTypes.line.prototype, "drawLegendSymbol", function (p, legend, item ) {
			let lineWidthBack = this.options.lineWidth;

			if (this.options.lineWidth > 10)
				this.options.lineWidth = 10;

			p.call(this, legend, item);
			this.options.lineWidth = lineWidthBack;
		});

		// line charts rerenders with markers and animation are expensive so lets restrict animation to small charts
		this.wrap("", Highcharts.Chart.prototype, "redraw", function (p, animation) {
			if (this.series[0].options.marker.enabled && this.series.length * this.series[0].options.data.length > 2000)
				animation = false

			p.call(this, animation);
		});
	}


	/**
	 * Point mouse over callback. Fired when the mouse enters the areas close to the point.
	 * @param point The target point
	 * @returns {undefined}
	 */
	pointMouseOver(point) {
		let name = point.series.name;

		point.series.chart.series.forEach( s => {
			// lessen the opacity of the series, so highlighted points can be more easily seen
			if (s.visible) {
				s.markerGroup.attr({
					opacity: s.name === name ? 1 : .25
				});


			}
		});

		if (point.series.chart.tooltip.label)
			point.series.chart.tooltip.label.toFront(); // display tooltip over all
	}

	/**
	 * Sticky the tooltip for the indicated point.
	 * @param point The point whose tooltip is be stickied.
	 */
	stickyPointTooltip(point)
	{
		let chart = point.series.chart;
		chart.forExport = false;
		chart.tooltip.refresh(point);
		chart.tooltip.label.attr({opacity: 1});
		let clonedTooltip = chart.tooltip.label.element.cloneNode(true);
		chart.container.firstChild.appendChild(clonedTooltip);

		chart.options.customTooltips[point.x+'-'+point.series.name] = {
			customTooltip: clonedTooltip,
			hasCustomTooltip: true,
			seriesIndex: point.series.index,
			name: point.x
		};
		chart.options.customTooltips.iterator ++;
	}

	/**
	 * Point click callback. Fired when a point is clicked.
	 * @param {type} event  common event information
	 * @returns {undefined}
	 */
	pointClick(point) {
		let chart = point.series.chart,
			pointIndex = point.x+'-'+point.series.name,
			customPoint = chart.options.customTooltips[pointIndex];

		if (customPoint && customPoint.hasCustomTooltip) {
			chart.container.firstChild.removeChild(customPoint.customTooltip);
			chart.tooltip.hide();

			chart.options.customTooltips[pointIndex] = null;
			chart.options.customTooltips.iterator --;
		} else {
			this.stickyPointTooltip(point);
		}

		this.chartComponent.canRemoveTooltips = chart.options.customTooltips.iterator !== 0;

		this.updateTooltipsUserOptions();
	}

	pointMouseOut(point) {
		Highcharts.each(point.series.chart.series, function (s) {
			s.markerGroup.attr({
				opacity: 1
			});
		});
	}

	/**
	 * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
	 * @returns the formatted tooltip string
	 */
	toolTipFormatter(p):any {
		const {chart} = this;
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><LineTooltip point={p} chart={chart} getPrecisionFromAxis={this.getPrecisionFromAxis}/></RawIntlProvider>);
	}
}