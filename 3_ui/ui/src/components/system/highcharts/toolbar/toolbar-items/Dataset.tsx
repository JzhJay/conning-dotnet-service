import {AppIcon, bp} from "components";
import * as React from 'react';
import {DatasetToolbarItemBase} from '../../../IO/toolbar/DatasetToolbarItemBase';
import {EfficientFrontierChartExtender} from '../../extenders';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {utility, appIcons, ChartDataRef, ChartData, IO} from 'stores';
import {GridlinesType} from 'stores/queryResult'
import { observable, autorun, reaction, toJS, computed, action, makeObservable } from 'mobx';
import {observer} from 'mobx-react';
import {DropdownCycleButton} from '../../../../widgets';
import {Menu, MenuItem, Button} from '@blueprintjs/core';

@observer
export class DatasetToolbarItem extends React.Component<ToolbarItemProps, {}> {
    allowBothOff: boolean = true;

    constructor(props: ToolbarItemProps) {
        super(props);
        makeObservable(this);

		this._toDispose.push(reaction(() => this.datasetTrigger, () => {
			const {userOptions} = this.props;

			if (userOptions.shouldInheritData) {
				this.props.chartComponent.onUpdateUserOptions({showEfficientFrontier: this.props.userOptions.showEfficientFrontier, showAdditionalPoints: this.props.userOptions.showAdditionalPoints});
				this.refetch();
			}
		}))
	}
    _toDispose = [];

    @computed get datasetTrigger() {
		return `${this.props.userOptions.showEfficientFrontier} ${this.props.userOptions.showAdditionalPoints}`;
	}

    render() {
		return <DatasetToolbarItemBase userOptions={this.props.userOptions}
			                        toggleInherit={this.toggleInherit}
			                        toggleFrontier={this.toggleFrontierAndLambda}
									toggleLambda={this.toggleFrontierAndLambda}
			                        toggleAdditionalPoints={this.toggleAdditionalPoints}
									allowBothOff={this.allowBothOff}
									additionalItems={<></>} />;
	}

    @action
	toggleInherit = async () => {
		this.props.chartComponent.onUpdateUserOptions({shouldInheritData: !this.props.userOptions.shouldInheritData});

		if (this.props.userOptions.shouldInheritData) {
			// Going from not inheriting to inherting requies us to reget the userOption which will take into account any inheritance targets.
			let userOptions = this.props.chartComponent.props.page.getViewUserOptions(this.props.id);
			this.props.chartComponent.onUpdateUserOptions({showEfficientFrontier: userOptions.showEfficientFrontier, showAdditionalPoints:  userOptions.showAdditionalPoints});
		}

		this.refetch();

		//this.props.onUpdateUserOptions({colorSet: this.colors[index]});
		//this.selectedIndex = index;
	}

    @action toggleFrontierAndLambda = async ( updatedProps ) => {

		this.props.chartComponent.onUpdateUserOptions(updatedProps);

		const {chartComponent:{extender, chart}, chartComponent} = this.props;
		if (extender instanceof EfficientFrontierChartExtender) {
			const isFrontierSeries = s => s.name == "underlyingDonutSeries" && !s.userOptions.connIsAdditionalPointSeries;
			const chartData = await this.props.chartComponent.fetchChartData();
			let newSeries = chartData.series.filter(s => s.name == "underlyingDonutSeries" && !s.connIsAdditionalPointSeries)[0];
			let series = chart.series.filter(isFrontierSeries)[0];
			series.setData(newSeries.data, true, false, false);
		}
		else
			this.refetch();
	}

    @action
	toggleAdditionalPoints = async () => {
		const {userOptions, userOptions: {showAdditionalPoints}, chartComponent, chartComponent: {chart}, chartType} = this.props;
		this.props.chartComponent.onUpdateUserOptions({showAdditionalPoints: !showAdditionalPoints});

		let data      = await chartComponent.highchartsStore.getPrebuiltDataTemplate(chartType, userOptions);
		let chartData = (_.values(data)[0] as ChartDataRef).chartData as ChartData;

		chartComponent.updateChartData(chartData);

		if (chartComponent.extender instanceof EfficientFrontierChartExtender) {
			chartComponent.extender.enableAdditionalPoints(chartData.series.filter(s => s.connIsAdditionalPointSeries)[0]);
		} else {
			chart.xAxis[0].update({categories: chartData.xAxis[0].categories, max: chartData.xAxis[0].categories.length - 1});
			chart.series.forEach((s, i) => {
				s.setData(chartData.series[i].data, false);
			})
			chartComponent.extender.resetToDefaultAxisLimits();
		}

		chart.redraw();
	}

    refetch() {
		const { chartComponent, userOptions, chartType } = this.props;
		chartComponent.performBusyAction(() => chartComponent.refetchData(false));

		//if (chartComponent.extender instanceof EfficientFrontierChartExtender)
		//	chartComponent.extender.addDonuts();
	}

    componentWillUnmount(): void {
		this._toDispose.forEach(f => f());
	}
}
