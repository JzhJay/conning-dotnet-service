import {HighchartsComponent} from "components";
import {setThroughTimeStatisticsObjectSeriesExtremes} from 'components/system/highcharts/dataTemplates/throughTimeStatisticsTemplate';
import {HighchartsExtender} from 'components/system/highcharts/extenders/highchartsExtender';
import {RSSimulationReportsTooltip} from 'components/system/highcharts/internal-components/tooltips/RSSimulationReportsTooltip';
import {ThroughTimeStatisticsTooltip} from 'components/system/highcharts/internal-components/tooltips/ThroughTimeStatisticsTooltip';
import * as ReactDOMServer from 'react-dom/server';
import {LineTooltip} from "../internal-components/tooltips/LineTooltip";
import {PointsExtender} from "./points.hc.extender";
import {i18n} from 'stores';
import { RawIntlProvider } from "react-intl";

export class RSSimulationReportsChartExtender extends HighchartsExtender {
	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
		super(chartComponent, highchartsOptions, false);
		this.automaticDisplayUnitsEnabled = true;
	}

	toolTipFormatter(pointFormat): any {
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}>
				<RSSimulationReportsTooltip
					pointFormat={pointFormat}
					chart={this.chart}
					chartComponent={this.chartComponent}
					getPrecisionFromAxis={this.getPrecisionFromAxis}/>
			</RawIntlProvider>
		);
	}
}