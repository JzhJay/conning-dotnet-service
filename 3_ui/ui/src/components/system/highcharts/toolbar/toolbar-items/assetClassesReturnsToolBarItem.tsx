import {bp, HighchartsComponent} from 'components';
import {getHighchartsAssetClassesReturnObject} from 'components/system/highcharts/dataTemplates/assetClassesReturnTemplate';
import {action, computed} from 'mobx';
import {observer} from 'mobx-react';
import * as React from "react";
import { FormattedMessage } from 'react-intl';
import {ChartUserOptions, i18n} from 'stores';

interface MyProps {
	onUpdateUserOptions: (userOptions: ChartUserOptions) => void;
	queryResult: any;
	userOptions: ChartUserOptions;
	chartComponent: HighchartsComponent;
}

@observer
export class AssetClassesReturnsToolBarItem extends React.Component<MyProps, {}> {

	@computed get usingAdjustmentsByAssetClass() {
		return _.get(this.props.queryResult, "optimizationInputs.dataSources.useAdditiveMultiplicativeAdjustmentsByAssetClass");
	}

	@computed get annualizedReturns() {
		return _.get(this.props.userOptions, "annualizedReturns", true);
	}

	@computed get adjustmentReturns() {
		return _.get(this.props.userOptions, "adjustmentReturns", true);
	}

	@action onToggle = _.debounce((annualizedReturns: boolean|null, adjustmentReturns: boolean|null) => {
		const updates = {
			annualizedReturns: annualizedReturns !== null ? annualizedReturns : this.annualizedReturns,
			adjustmentReturns: this.usingAdjustmentsByAssetClass ? (adjustmentReturns !== null ? adjustmentReturns : this.adjustmentReturns) : false
		} as any;

		if (_.eq( updates, {annualizedReturns: this.annualizedReturns, adjustmentReturns: this.adjustmentReturns})) {
			return;
		}
		const {queryResult, onUpdateUserOptions, chartComponent, chartComponent: {chart}} = this.props;

		onUpdateUserOptions( updates);

		//reset highcharts:
		const config = getHighchartsAssetClassesReturnObject(queryResult, updates);
		chart.update({series: config.series}, true);
		chart.xAxis[0].userOptions.connInitialMin = config.xAxis[0].min;
		chart.xAxis[0].userOptions.connInitialMax = config.xAxis[0].max;
		chart.yAxis[0].userOptions.connInitialMin = config.yAxis[0].min;
		chart.yAxis[0].userOptions.connInitialMax = config.yAxis[0].max;
		chartComponent.resetZoom();

	}, 300);

	render() {
		return <bp.Popover>
			<bp.Button>
				<FormattedMessage defaultMessage="Select Content" description="[highcharts] Button text for select asset classes return" />
			</bp.Button>
			<bp.Menu>
				<bp.Switch label={i18n.intl.formatMessage({defaultMessage: 'Cumulative Returns', description: '[highcharts] Switch text for toggling Cumulative Returns'})} checked={!this.annualizedReturns} onChange={() => this.onToggle(false, null)}/>
				<bp.Switch label={i18n.intl.formatMessage({defaultMessage: 'Annualized Returns', description: '[highcharts] Switch text for toggling Annualized Returns'})} checked={this.annualizedReturns} onChange={() => this.onToggle(true, null)}/>
				<bp.MenuDivider />
				<bp.Switch label={i18n.intl.formatMessage({defaultMessage: 'Pre-adjustment Returns', description: '[highcharts] Switch text for toggling Pre-adjustment Returns'})} checked={!this.usingAdjustmentsByAssetClass || !this.adjustmentReturns} onChange={() => this.onToggle(null, false)}/>
				<bp.Switch label={i18n.intl.formatMessage({defaultMessage: 'Post-adjustment Returns', description: '[highcharts] Switch text for toggling Post-adjustment Returns'})} checked={this.usingAdjustmentsByAssetClass && this.adjustmentReturns} disabled={!this.usingAdjustmentsByAssetClass} onChange={() => this.onToggle(null, true)}/>
			</bp.Menu>
		</bp.Popover>;
	}
}