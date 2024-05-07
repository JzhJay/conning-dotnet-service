import {AnchorButton, ButtonGroup, Menu, MenuItem, Popover, PopoverInteractionKind, Position, Tooltip} from '@blueprintjs/core';
import {getFullPercentileValues} from 'components/system/highcharts/chartUtils';
import {setLineChartWithHorizonSeriesExtremes} from 'components/system/highcharts/dataTemplates/lineWithHorizonTemplate';
import {setThroughTimeStatisticsObjectSeriesExtremes} from 'components/system/highcharts/dataTemplates/throughTimeStatisticsTemplate';
import {GridlinesType} from '../../../../../stores/charting';
import {ClimateRiskAnalysis} from '../../../../../stores/climateRiskAnalysis';
import {appIcons} from '../../../../../stores/site/iconography';
import {AppIcon, bp} from '../../../../index';
import {HorizonToolbarItem} from '../../../common/HorizonToolbarItem';
import {getHighchartsDistributionsAtHorizonObject} from '../../dataTemplates/distributionsAtHorizonTemplate';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {observer} from 'mobx-react';

@observer
export class ChartHorizonToolbarItem extends React.Component<ToolbarItemProps, {}> {
	constructor(props, state) {
		super(props, state);
	}

	render() {
		const chartType = this.props.chartType;
		const climateRiskAnalysis = this.props.queryResult as ClimateRiskAnalysis;
		let startFrom = 0;
		let numHorizons = 0;
		if (chartType === "distributionsAtHorizon") {
			numHorizons = climateRiskAnalysis.output.distributionsAtHorizon.pdfs.length;
		} else if (chartType === "throughTimeStatistics" || chartType === "craBox") {
			numHorizons = climateRiskAnalysis.output.throughTimeStatistics.basecase["Mean"].length;
		} else if  (chartType === "financialDamage" || chartType === "volatilityShock") {
			numHorizons = climateRiskAnalysis.output.financialDamageAndVolatilityShock[0]?.returnDeltas.length;
		}

		return <HorizonToolbarItem userOptions={this.props.userOptions} numberOfHorizons={numHorizons} setHorizon={this.setHorizon}/>
	}

	setHorizon = (horizon: number) => {
		const {chartComponent: {chart}, chartType} = this.props;

		this.props.chartComponent.onUpdateUserOptions({horizon: horizon});

		if (chartType === "distributionsAtHorizon") {
			chart.selections && this.props.chartComponent.clearSelections();
			const newData = getHighchartsDistributionsAtHorizonObject(this.props.queryResult as ClimateRiskAnalysis, this.props.userOptions);
			chart.update({series: newData.series, title: newData.title});

			const xAxis = chart.xAxis[0], yAxis = chart.yAxis[0];
			const yEx = yAxis.getExtremes();
			const xEx = xAxis.getExtremes();

			// Update initial extremes that are used to reset the zoom
			yAxis.userOptions.connInitialMin = yEx.dataMin;
			yAxis.userOptions.connInitialMax = yEx.dataMax + (yEx.dataMax * 0.01);
			xAxis.userOptions.connInitialMin = xEx.dataMin;
			xAxis.userOptions.connInitialMax = xEx.dataMax;

			yAxis.setExtremes(yEx.dataMin, yAxis.userOptions.connInitialMax, false, false);
			xAxis.setExtremes(xEx.dataMin, xEx.dataMax, false, false);
			chart.redraw(false);

		} else if (chartType === "throughTimeStatistics" || chartType === "craBox" ) {
			setThroughTimeStatisticsObjectSeriesExtremes( chart, horizon);
		} else if  (chartType === "financialDamage" || chartType === "volatilityShock") {
			setLineChartWithHorizonSeriesExtremes( chart, horizon );

		}
	}
}
