import {CRABoxTooltip} from '../internal-components/tooltips';
import {BoxChartHighchartsExtender} from './box.hc.extender';
import {HighchartsComponent} from '../highchartsComponent';
import * as ReactDOMServer from 'react-dom/server';
import {i18n} from 'stores';
import {RawIntlProvider} from 'react-intl';

export class CRABoxChartHighchartsExtender extends BoxChartHighchartsExtender{
	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
		super(chartComponent, highchartsOptions);

		this.automaticDisplayUnitsEnabled = true;
	}

	/**
	 * Adds callback methods to the chart. These callbacks will be fired by HighCharts and allows us to extend the built it functionality.
	 * @param {type} chartInit    The object that will be passed to highchart to create chart
	 * @returns {undefined}
	 */
	addChartCallbacks(chartInit) {
		super.addChartCallbacks(chartInit)

		chartInit.legend.labelFormatter = function () {
			return this.name == "mean" ? "Mean" : this.name;
		}
	}

	/**
	 * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
	 * @param pointFormat An object holding the point that the tooltip is being generated for
	 * @returns The formatted tooltip string, or false to dismiss.
	 */
	toolTipFormatter(pointFormat): any {
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><CRABoxTooltip pointFormat={pointFormat} chart={this.chart} chartComponent={this.chartComponent} getPrecisionFromAxis={this.getPrecisionFromAxis}/></RawIntlProvider>)
	}

}
