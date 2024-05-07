import {HighchartsComponent} from "components";
import {setLineChartWithHorizonSeriesExtremes} from 'components/system/highcharts/dataTemplates/lineWithHorizonTemplate';
import {LineChartExtender} from 'components/system/highcharts/extenders/line.hc.extender';
import {LineWithHorizonTooltip} from 'components/system/highcharts/internal-components/tooltips/LineWithHorizonTooltip';
import * as ReactDOMServer from 'react-dom/server';
import { RawIntlProvider } from "react-intl";
import {i18n} from 'stores';

export class LineWithHorizonChartExtender extends LineChartExtender {

	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions, shouldGroupLegendItem = true) {
		super(chartComponent, highchartsOptions, shouldGroupLegendItem)
	}

	load(chart) {
		super.load(chart);
		this.chart = chart;

		if (!this.isForExport(chart)) {
			setTimeout( ()=>setLineChartWithHorizonSeriesExtremes(chart), 1);
		}
	}

	resize(){
		setLineChartWithHorizonSeriesExtremes(this.chart)
	}

	pointClick(point) {}

	/**
	 * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
	 * @returns the formatted tooltip string
	 */
	toolTipFormatter(p):any {
		const {chart} = this;
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><LineWithHorizonTooltip point={p} chart={chart} getPrecisionFromAxis={this.getPrecisionFromAxis}/></RawIntlProvider>);
	}
}