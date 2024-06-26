import {getHighchartsThroughTimeStatisticsObject, setThroughTimeStatisticsObjectSeriesExtremes} from 'components/system/highcharts/dataTemplates/throughTimeStatisticsTemplate';
import {BoxChartHighchartsExtender} from 'components/system/highcharts/extenders';
import {PercentilesToolbarItem as CommonPercentilesToolbarItem} from 'components/system/common/Percentiles';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {getFullPercentileValues} from "../../chartUtils";
import {IO, ClimateRiskAnalysis} from 'stores/index';
import { ChartData, ChartDataRef } from 'stores/queryResult';
import { observer } from 'mobx-react';


/**
 * A dropdown button for choosing the percentile colors
 *
 * Shown Left | Right when normal
 *
 *           Top
 * Shown     ---      when inverted
 *          Bottom
 **/
@observer
export class PercentilesToolbarItem extends React.Component<ToolbarItemProps, {}> {

	render() {
		return <CommonPercentilesToolbarItem
			userOptions={this.props.userOptions}
			updateUserOptions={this.props.onUpdateUserOptions}
			updatePercentiles={() => this.updateExtender()}
			// semicolonToDisableMirroring={this.props.chartType != 'cdf'}
		/>
	}

	async updateExtender() {
		const { chartComponent, userOptions, chartType, guid } = this.props;
		const { percentiles }                                  = userOptions;

		if (this.props.chartComponent.chart) {
			chartComponent.busy = true;
			let fullPercentiles = getFullPercentileValues(percentiles);

			if (chartComponent && chartComponent.extender) {
				if (chartType === 'pdf' || chartType === 'beeswarm') {
					let data = await chartComponent.highchartsStore.getPrebuiltDataTemplate(chartType, userOptions)
					let chartData = (_.values(data)[0] as ChartDataRef).chartData as ChartData;
					if (chartData.series.length === 1) {
						chartComponent.updateChartData({ percentilesData: (chartData as any).percentilesData });
						chartComponent.extender.setPercentiles(fullPercentiles);
					}
				}
				else if (chartType === 'cone' || chartType === 'box' || chartType === 'ioBox' || chartType === 'craBox') {

					if (chartType === 'ioBox') {
						await (chartComponent.props.chartingResult as IO).updatePercentiles();
					}

					let data = await chartComponent.highchartsStore.getPrebuiltDataTemplate(chartType, userOptions)
					let chartData = (_.values(data)[0] as ChartDataRef).chartData as ChartData;

					chartComponent.updateChartData({ series: chartData.series });

					this.updateSeries(chartData.series);

					if (this.props.chartType === 'box' || chartType === 'craBox') {
						chartComponent.extender.renderNewLegend();
					}
				}
				else if (chartType === 'throughTimeStatistics') {
					const climateRiskAnalysis = this.props.queryResult as ClimateRiskAnalysis;
					await climateRiskAnalysis.getThroughTimeStatisticsData(fullPercentiles);

					let newData = await getHighchartsThroughTimeStatisticsObject(climateRiskAnalysis, userOptions);
					const newSeries = newData.series;
					const diffLength = newSeries.length - chartComponent.chart.series.length;
					chartComponent.chart.options["iconningLegend"] = newData.iconningLegend;
					chartComponent.chart.userOptions["iconningLegend"] = newData.iconningLegend;
					if ( diffLength != 0) {
						while (chartComponent.chart.series.length) {
							chartComponent.chart.series[0].remove(false);
						}
						newSeries.forEach( s => chartComponent.chart.addSeries(s as any, false, false));
						chartComponent.chart.redraw(true);
					} else {
						chartComponent.chart.update({series: newSeries}, true);
					}
				} else {
					chartComponent.extender.setPercentiles(fullPercentiles);
				}

				if (chartType === 'craBox' || chartType === 'throughTimeStatistics') {
					setThroughTimeStatisticsObjectSeriesExtremes(chartComponent.chart, userOptions.horizon);
				}
			}

			chartComponent.busy = false;
		}
	}

	updateSeries(newSeries) {
		const chart = this.props.chartComponent.chart;

		// Remove all series except for the hover/stickied scenarios
		for (let i = chart.series.length - 1; i >= 0; i--) {
			if (chart.series[i].userOptions.connFakeHoverSeriesIndex == null) {
				chart.series[i].remove(false);
			}
		}


		for (let i = 0; i < newSeries.length; i++) {
			//if (_.find(chart.series, (series) => newSeries[i].name === series.name) == null)
			newSeries[i].index = i;
			chart.addSeries(newSeries[i], false);
		}

		// Update hover/stickied scenarios to have the correct indices so they appear after the new/update series
		let scenariosSeriesCount = 0;
		for (let i = 0; i < chart.series.length; i++) {
			if (chart.series[i].userOptions.connFakeHoverSeriesIndex != null) {
				chart.series[i].update({ index: newSeries.length + scenariosSeriesCount, zIndex: 1 });
				scenariosSeriesCount++;
			}
		}

		chart.redraw();

		this.props.chartComponent.extender.adjustStoredAxisLimits();
	}
}
