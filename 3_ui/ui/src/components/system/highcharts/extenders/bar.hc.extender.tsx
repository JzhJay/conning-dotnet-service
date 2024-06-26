import {HighchartsComponent} from "components";
import * as ReactDOMServer from 'react-dom/server';
import {HighchartsExtender} from "./highchartsExtender";
import {BarTooltip} from "../internal-components/tooltips/BarTooltip";
import {i18n} from 'stores';
import {RawIntlProvider} from 'react-intl';

export class BarChartExtender extends HighchartsExtender {

	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
		super(chartComponent, highchartsOptions, false)
	}

	/**
	 * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
	 * @returns the formatted tooltip string
	 */
	toolTipFormatter(p):any {
		const {chart, chartComponent} = this;
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><BarTooltip point={p} chart={chart} chartComponent={chartComponent} getPrecisionFromAxis={this.getPrecisionFromAxis}/></RawIntlProvider>);
	}

	enableAxisLabelAction() {
		return this.chartComponent.userOptions.columnMode !== '';
	}


	/**
	 * Axis label on mouse over callback. Fired when the mouse enters the areas close to the axis label.
	 * @params axis         The target axis
	 * @params axisLabel    The target label
	 * @params e            The associated event
	 * @returns {undefined}
	 */
	axisLabelOnMouseOver(axis, axisLabel, e) {

		if (axis.coll === "yAxis" || !this.enableAxisLabelAction())
			return;

		e = this.positionAxisLabelTooltip(axis, axisLabel, e);
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
		if (axis.coll === "yAxis" || !this.enableAxisLabelAction())
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

		if (kdpoints.length > 0) {
			chart.tooltip.refresh(kdpoints, null);
			chart.tooltip.label.toFront();
		}

		// Disable shared tooltips to allow for more discrete series interactions
		chart.tooltip.shared = false;
	}
}