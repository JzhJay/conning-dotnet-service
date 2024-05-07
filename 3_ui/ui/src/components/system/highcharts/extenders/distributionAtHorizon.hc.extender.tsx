import * as ReactDOMServer from 'react-dom/server';
import {HighchartsComponent} from '../highchartsComponent';
import {DistributionAtHorizonTooltip} from '../internal-components/tooltips/DistricutionAtHorizonTooltip';
import {HighchartsExtender} from './highchartsExtender';
import {i18n} from 'stores';
import { RawIntlProvider } from 'react-intl';

export class DistributionAtHorizonHighchartsExtender extends HighchartsExtender {

	constructor(protected chartComponent: HighchartsComponent, protected highchartsOptions) {
		super(chartComponent, highchartsOptions, false);

		this.automaticDisplayUnitsEnabled = true;
	}

	/**
	 * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
	 * @returns the formatted tooltip string
	 */
	toolTipFormatter(p): any {
		const {chart, chartComponent} = this;
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><DistributionAtHorizonTooltip point={p} chart={chart} getPrecisionFromAxis={this.getPrecisionFromAxis}/></RawIntlProvider>);
	}
}