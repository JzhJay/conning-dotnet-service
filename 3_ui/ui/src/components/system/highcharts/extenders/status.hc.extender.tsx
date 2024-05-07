import {reaction} from 'mobx';
import {IO, IOStatus} from '../../../../stores/io';
import {getStatusPoints, getYMaximum} from '../dataTemplates/statusTemplate';
import {HighchartsComponent} from '../highchartsComponent';
import * as ReactDOMServer from 'react-dom/server';
import {StatusTooltip} from '../internal-components/tooltips/StatusTooltip';
import {HoverColumn} from './helper/HoverColumn';
import {HighchartsExtender} from './highchartsExtender';
import {i18n} from 'stores';
import { RawIntlProvider } from 'react-intl';

export class StatusChartHighchartsExtender extends HighchartsExtender{
    constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
        super(chartComponent, highchartsOptions, false);

	    this.hoverColumn = new HoverColumn(chartComponent);

	    // Process push updates
	    const io = this.chartComponent.props.chartingResult as IO;
	    this._toDispose.push(reaction(() => io.updateCount, io.sequencedUpdate(async () => {
		    if (this.chartComponent.isUnmounting)
			    return;

	    	console.time("status")
		    this.chart.series.forEach((s, i) => {
		    	s.setData(getStatusPoints(io, s.name), false);
		    })

		    // let yAxis = this.chart.yAxis[0];
		    //
		    // //let xAxisExtremes = xAxis.getExtremes();
		    // let yAxisExtremes = yAxis.getExtremes();
		    // //xAxis.userOptions.connInitialMin = xAxis.dataMin;
		    // //xAxis.userOptions.connInitialMax = xAxis.dataMax;
		    // //yAxis.userOptions.connInitialMin = yAxis.dataMin;
		    // yAxis.userOptions.connInitialMax = yAxis.dataMax;
		    //
		    // //xAxis.setExtremes(xAxis.userOptions.connInitialMin, xAxis.userOptions.connInitialMax);
		    // yAxis.setExtremes(yAxis.userOptions.connInitialMin, yAxis.userOptions.connInitialMax);

		    if (io.status == IOStatus.running)
		        this.resetToDefaultAxisLimits();

		    const yAxis = this.chart.yAxis[0];
		    yAxis.userOptions.connInitialMin = 0;
		    yAxis.userOptions.connInitialMax = getYMaximum(io, this.chart.series.map(s => s.userOptions));
		    yAxis.setExtremes(0, yAxis.userOptions.connInitialMax, false);

		    this.chart.redraw();
		    console.timeEnd("status")
	    })))
    }

    hoverColumn;

	/**
	 * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
	 * @returns the formatted tooltip string
	 */
	toolTipFormatter(p):any {
		if (p.points && p.points.length) {
			p.point = p.points[0].point;
		}
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><StatusTooltip point={p} chart={this.chart} chartComponent={this.chartComponent}/></RawIntlProvider>);
	}

	/**
	 * Axis label on mouse over callback. Fired when the mouse enters the areas close to the axis label.
	 * @params axis         The target axis
	 * @params axisLabel    The target label
	 * @params e            The associated event
	 * @returns {undefined}
	 */
	axisLabelOnMouseOver(axis, axisLabel, e) {

		if (axis.coll === "yAxis")
			return;

		this.showSharedTooltip(axisLabel.chart, e, axisLabel.textContent);

		axisLabel.style["font-weight"] = "bold";
	}

	/**
	 * Axis label on mouse out callback. Fired when the mouse leaves the areas close to the axis label.
	 * @params axis         The target axis
	 * @params axisLabel    The target label
	 * @params e            The associated event
	 * @returns {undefined}
	 */
	axisLabelOnMouseOut(axis, axisLabel, e) {
		if (axis.coll === "yAxis")
			return;

		axisLabel.chart.tooltip.hide();
		axisLabel.style["font-weight"] = "";
	}

	/**
	 * Shows a shared tooltip. Similiar to highchart's base implementation in runPointActions.
	 * @param chart
	 * @param e
	 */
	showSharedTooltip(chart, e, category) {
		// temporarily enable shared tooltips to enable highchart calls to work as though we were
		// really in the sharedTooltips mode
		chart.tooltip.shared = true;

		let kdpoints = this.findMatchingCategoryPoints(chart, category);

		chart.tooltip.refresh(kdpoints, e);

		// Disable shared tooltips to allow for more discrete series interactions
		chart.tooltip.shared = false;
	}

	canUseSavedZoom() {
		const io = this.chartComponent.props.chartingResult as IO;
		return io.isOptimizationComplete();
	}

	cleanup() {
		super.cleanup();
		this.hoverColumn.cleanup();
	}
}
