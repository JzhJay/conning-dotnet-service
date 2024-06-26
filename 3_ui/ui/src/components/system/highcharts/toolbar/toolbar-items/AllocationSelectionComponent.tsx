import {DropdownCycleButton, bp} from "components";
import { action, observable, makeObservable } from 'mobx';
import * as React from 'react';
import {ChartDataRef, ChartData, IO, PointStyle, i18n} from 'stores';
import {observer} from 'mobx-react';
import {Switch} from '@blueprintjs/core';
import type {ToolbarItemProps} from '../highchartsToolbar';
import * as css from './AllocationSelectionComponent.css'
import {EfficientFrontierChartExtender} from '../../extenders';
import {asyncAction} from 'utility';
import {DatasetToolbarItemBase} from '../../../IO/toolbar/DatasetToolbarItemBase';
import {PointFormatter} from '.';
import {getSeriesData} from "components/system/highcharts/dataTemplates/efficientFrontierTemplate";

@observer
export class AllocationSelectionComponent extends React.Component<ToolbarItemProps, {}> {
    constructor(props: ToolbarItemProps) {
        super(props);
        makeObservable(this);
    }

    renderAdditionalMenuItems() {
		const {userOptions: {showFullFrontier, showAdditionalPoints, showEfficientFrontier, shouldInheritData, showLambdaPoints, showFrontierLine, showIterationPoints, showIterationLines, showDirectionPoints, showDistancePoints, showHistoricalPoints, showRandomPoints, fullFrontierPointStyle, iterationPointStyle, directionPointStyle, distancePointStyle, historicalPointStyle, randomPointStyle}, chartComponent} = this.props;

		return (
			<>
				<bp.MenuDivider/>
				<Switch defaultChecked={showFullFrontier} label={i18n.intl.formatMessage({ defaultMessage: 'Efficient Frontier Points', description: '[highcharts] Switch text for toggling Efficient Frontier Points'})} onChange={asyncAction(this.toggleFullFrontier)} id="toggleFullFrontier" labelElement={<PointFormatter pointStyle={fullFrontierPointStyle} updateStyle={(pointStyle: PointStyle) => this.updateSeriesStyle("fullFrontier", pointStyle, showFullFrontier)}/>} />
				<Switch defaultChecked={showFrontierLine} label={i18n.intl.formatMessage({ defaultMessage: 'Efficient Frontier Line', description: '[highcharts] Switch text for toggling Efficient Frontier Line'})} onChange={asyncAction(this.toggleFrontierLine)} id="toggleFrontierLine"/>
				<bp.MenuDivider/>
				<Switch defaultChecked={showIterationPoints} label={i18n.intl.formatMessage({ defaultMessage: 'Optimization Iteration Points', description: '[highcharts] Switch text for toggling Optimization Iteration Points'})} onChange={asyncAction(this.toggleIterationPoints)} id="toggleIterationPoints" labelElement={<PointFormatter pointStyle={iterationPointStyle} updateStyle={(pointStyle: PointStyle) => this.updateSeriesStyle("iteration", pointStyle, showIterationPoints)}/>} />
				<Switch defaultChecked={showIterationLines} label={i18n.intl.formatMessage({ defaultMessage: 'Optimization Iteration Lines', description: '[highcharts] Switch text for toggling Optimization Iteration Lines'})} onChange={asyncAction(this.toggleIterationLines)} id="toggleIterationLines"/>
				<bp.MenuDivider/>
				<Switch defaultChecked={showDistancePoints} label={i18n.intl.formatMessage({ defaultMessage: 'Optimization Distance Search Points', description: '[highcharts] Switch text for toggling Optimization Distance Search Points'})} onChange={asyncAction(() =>this.toggleSeriesVisibility("distanceSeries", "showDistancePoints"))} id="toggleDistancePoints" labelElement={<PointFormatter pointStyle={distancePointStyle} updateStyle={(pointStyle: PointStyle) => this.updateSeriesStyle("distance", pointStyle, showDistancePoints)}/>} />
				<Switch defaultChecked={showDirectionPoints} label={i18n.intl.formatMessage({ defaultMessage: 'Optimization Direction Search Points', description: '[highcharts] Switch text for toggling Optimization Direction Search Points'})} onChange={asyncAction(() => this.toggleSeriesVisibility("directionSeries", "showDirectionPoints"))} id="toggleDirectionPoints" labelElement={<PointFormatter pointStyle={directionPointStyle} updateStyle={(pointStyle: PointStyle) => this.updateSeriesStyle("direction", pointStyle, showDirectionPoints)}/>} />
				<Switch defaultChecked={showHistoricalPoints} label={i18n.intl.formatMessage({ defaultMessage: 'Historical Points', description: '[highcharts] Switch text for toggling Historical Points'})} onChange={asyncAction(() => this.toggleSeriesVisibility("historicalSeries", "showHistoricalPoints"))} id="toggleHistoricalPoints" labelElement={<PointFormatter pointStyle={historicalPointStyle} updateStyle={(pointStyle: PointStyle) => this.updateSeriesStyle("historical", pointStyle, showHistoricalPoints)}/>} />
				<Switch defaultChecked={showRandomPoints} label={i18n.intl.formatMessage({ defaultMessage: 'Random Points', description: '[highcharts] Switch text for toggling Random Points'})} onChange={asyncAction(() => this.toggleSeriesVisibility("randomSeries", "showRandomPoints") )} id="toggleRandomPoints" labelElement={<PointFormatter pointStyle={randomPointStyle} updateStyle={(pointStyle: PointStyle) => this.updateSeriesStyle("random", pointStyle, showRandomPoints)}/>} />
			</>
		);
	}

    render() {
		return (
			<DatasetToolbarItemBase userOptions={this.props.userOptions}
			                        toggleInherit={this.toggleInherit}
			                        toggleFrontier={this.toggleFrontierAndLambda}
									toggleLambda={this.toggleFrontierAndLambda}
									toggleAdditionalPoints={this.toggleAdditionalPoints}
									toggleGroupAdditionalPoints={this.toggleGroupAdditionalPoints}
									allowBothOff={true}
									additionalItems={this.renderAdditionalMenuItems()} />
		);
	}

    getSeriesByName(chart, name:string) {
		const nameFilter = s => s.name == name;
		return chart.series.filter(nameFilter);
	}

    updateSeriesStyle = (seriesName: string, pointStyle: PointStyle, pointVisibility: boolean) => {
		const {chartComponent, chartComponent: {chart}} = this.props;
		let updateOption = {}
		updateOption[`${seriesName}PointStyle`] = pointStyle
		this.props.chartComponent.onUpdateUserOptions(updateOption);
		let series = this.getSeriesByName(chart, `${seriesName}Series`);
		series.map((s, i) => s.update({marker: {radius: pointVisibility ? pointStyle.radius : 0, fillColor: `rgba(${pointStyle.color}, ${pointStyle.opacity})`, symbol: pointStyle.symbol}}, i == series.length - 1));
	}

    @action
	toggleFullFrontier = async () => {
		const {userOptions: {showFullFrontier, fullFrontierPointStyle: {radius}}, chartComponent, chartComponent: {extender, chart}, chartType} = this.props;
		this.props.chartComponent.onUpdateUserOptions({showFullFrontier: !showFullFrontier});
		let series = this.getSeriesByName(chart, "fullFrontierSeries")[0];
		if (series.data.length == 0 && !showFullFrontier) {
			this.fillSeriesData(series, "fullFrontierSeries");
		}
		series.update({marker: {radius: !showFullFrontier ? radius : 0}}, true);
	}

    @action
	toggleFrontierLine = async () => {
		const {userOptions: {showFrontierLine}, chartComponent, chartComponent: {extender, chart}, chartType} = this.props;
		this.props.chartComponent.onUpdateUserOptions({showFrontierLine: !showFrontierLine});
		let series = this.getSeriesByName(chart, "fullFrontierSeries")[0];
		if (series.data.length == 0 && !showFrontierLine) {
			this.fillSeriesData(series, "fullFrontierSeries");
		}
		// Setting lineWidth of 0 doesn't result in the update being processed so lets set it to some small value.
		series.update({lineWidth: !showFrontierLine ? 3 : 0.0001}, true);
	}

    @action
	toggleIterationPoints = async () => {
		const {userOptions: {showIterationPoints, iterationPointStyle: {radius}}, chartComponent, chartComponent: {extender, chart}, chartType} = this.props;
		this.props.chartComponent.onUpdateUserOptions({showIterationPoints: !showIterationPoints});
		let series = this.getSeriesByName(chart, "iterationSeries");
		if (series[0].data.length == 0 && !showIterationPoints) {
			this.fillIterationSeriesData(series);
		}
		series.map((s, i) => s.update({marker: {radius: !showIterationPoints ? radius : 0}}, i == series.length - 1));
	}

    @action
	toggleSeriesVisibility = async (seriesName: string, userOptionName: string) => {
		const {userOptions, chartComponent: {chart}, chartComponent, queryResult} = this.props;
		const newVisibility = !userOptions[userOptionName];

		chartComponent.onUpdateUserOptions({[userOptionName]: newVisibility});
		let series = this.getSeriesByName(chart, seriesName);

		if (series[0].xData.length == 0 && newVisibility) { // series[0].data is not set after setData, but xData and yData are
			this.fillSeriesData(series[0], seriesName);
		}

		// fix a bug where highhcarts inserts series with zIndex of 0 after the tracker series which is at the end of series list in the DOM but doesn't have a z-index.
		// In effect our z-indices aren't respected because of the tracker. Fix: Set a high explict z-index
		$(".highcharts-tracker").attr("data-z-index", 10);

		series.map((s, i) => s.update({visible: newVisibility, zIndex: newVisibility ? -1 : 1}, i == series.length - 1));
	}

    @action
	toggleIterationLines = async () => {
		const {userOptions: {showIterationLines}, chartComponent, chartComponent: {extender, chart}, chartType} = this.props;
		this.props.chartComponent.onUpdateUserOptions({showIterationLines: !showIterationLines});
		let series = this.getSeriesByName(chart, "iterationSeries");
		if (series[0].data.length == 0 && !showIterationLines) {
			this.fillIterationSeriesData(series);
		}
		// Setting lineWidth of 0 doesn't result in the update being processed so lets set it to some small value.
		series.map((s, i) => s.update({lineWidth: !showIterationLines ? 2 : 0.0001}, i == series.length - 1));
	}

    @action
	toggleInherit = async () => {
		this.props.chartComponent.onUpdateUserOptions({shouldInheritData: !this.props.userOptions.shouldInheritData});

		if (this.props.userOptions.shouldInheritData) {
			// Going from not inheriting to inherting requires us to re-get the userOption which will take into account any inheritance targets.
			let userOptions = this.props.chartComponent.props.page.getViewUserOptions(this.props.id);
			this.props.chartComponent.onUpdateUserOptions({showEfficientFrontier: userOptions.showEfficientFrontier,
														   showLambdaPoints: userOptions.showLambdaPoints,
														   showAdditionalPoints:  userOptions.showAdditionalPoints});
		}

		this.refetch();

		//this.props.onUpdateUserOptions({colorSet: this.colors[index]});
		//this.selectedIndex = index;
	}

    @action
	updateDonutSeries = async (showEfficientFrontier:boolean, showLambdaPoints:boolean) => {
		this.props.chartComponent.onUpdateUserOptions({showEfficientFrontier: showEfficientFrontier,
														showLambdaPoints: showLambdaPoints});

		const {chartComponent:{extender, chart}, chartComponent} = this.props;
		if (extender instanceof EfficientFrontierChartExtender) {
			const isFrontierSeries = s => s.name == "underlyingDonutSeries" && !s.userOptions.connIsAdditionalPointSeries;
			const chartData = await this.props.chartComponent.fetchChartData();
			let newSeries = chartData.series.filter(s => s.name == "underlyingDonutSeries" && !s.connIsAdditionalPointSeries)[0];
			let series = chart.series.filter(isFrontierSeries)[0];
			series.setData(newSeries.data, false, false, false);

			chart.series.forEach((s, i) => {
				if (s.type == "columnrange" && !s.userOptions["connIsAdditionalPointLegend"]) {
					extender.syncLegendSeries(chartData.series[i], s);
				}
			})

			chart.redraw();
		}
		else
			this.refetch();
	}

    @action
	toggleFrontierAndLambda = async ( updatedProps ) => {
		this.updateDonutSeries(updatedProps.showEfficientFrontier, updatedProps.showLambdaPoints)
	}

    @action
	toggleAdditionalPoints = async () => {
		const {userOptions, userOptions: {showAdditionalPoints, showGroupAdditionalPoints}, chartComponent, chartComponent: {chart}, chartType} = this.props;
		const newValue = !showAdditionalPoints;
		this.props.chartComponent.onUpdateUserOptions({showAdditionalPoints: newValue});

		let data      = await chartComponent.highchartsStore.getPrebuiltDataTemplate(chartType, userOptions);
		let chartData = (_.values(data)[0] as ChartDataRef).chartData as ChartData;

		chartComponent.updateChartData(chartData);

		if (chartComponent.extender instanceof EfficientFrontierChartExtender) {
			chartComponent.extender.enableAdditionalPoints(chartData.series.filter(s => s.connIsAdditionalPointSeries)[0]);
			chartComponent.extender.toggleGroupedAdditionalPoints(showGroupAdditionalPoints && newValue);
		} else {
			chart.xAxis[0].update({categories: chartData.xAxis[0].categories, max: chartData.xAxis[0].categories.length - 1});
			chart.series.forEach((s, i) => {
				s.setData(chartData.series[i].data, false);
			})
			chartComponent.extender.resetToDefaultAxisLimits();
			chart.redraw();
		}
	}

    @action
	toggleGroupAdditionalPoints = async () => {
		const {userOptions, userOptions: {showAdditionalPoints, showGroupAdditionalPoints}, chartComponent, chartComponent: {chart}, chartType} = this.props;
		const newValue = !showGroupAdditionalPoints;
		this.props.chartComponent.onUpdateUserOptions({ showGroupAdditionalPoints: newValue });

		let data      = await chartComponent.highchartsStore.getPrebuiltDataTemplate(chartType, userOptions);
		let chartData = (_.values(data)[0] as ChartDataRef).chartData as ChartData;

		chartComponent.updateChartData(chartData);

		if (chartComponent.extender instanceof EfficientFrontierChartExtender) {
			chartComponent.extender.toggleGroupedAdditionalPoints(showAdditionalPoints && newValue, true);
		}

		chart.redraw();
	}

    fillSeriesData = (series, name) => {
		const {userOptions, queryResult} = this.props;
		let io = queryResult as IO;
		let data = getSeriesData(io, userOptions, name, true);
		series.setData(data, false, false, false);
	}

    fillIterationSeriesData = (series) => {
		const {userOptions, queryResult} = this.props;
		let io = queryResult as IO;
		let data = getSeriesData(io, userOptions, "iterationSeries", true) as Array<any>;
		data.forEach((d,i) => {
			series[i].setData(d, false, false, false)
		});
	}

    refetch() {
		const { chartComponent, userOptions, chartType } = this.props;
		chartComponent.performBusyAction(() => chartComponent.refetchData(false));

		//if (chartComponent.extender instanceof EfficientFrontierChartExtender)
		//	chartComponent.extender.addDonuts();
	}
}
