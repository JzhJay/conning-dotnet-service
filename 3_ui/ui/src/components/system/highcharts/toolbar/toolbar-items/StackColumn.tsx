import {AppIcon, bp} from "components";
import {action} from 'mobx';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {appIcons} from 'stores';
import {observer} from 'mobx-react';
import {Button, ButtonGroup} from '@blueprintjs/core';
import { BeeswarmChartExtender } from "../../extenders/beeswarm.hc.extender";

enum ColumnType {regular, stacked, percent};

let highchartsBarchartName = {
	0: '',
	1: 'normal',
	2: 'percent'
};

let columnTypeLookup = {}
for (var k in highchartsBarchartName){
	columnTypeLookup[highchartsBarchartName[k]] = parseInt(k);
}


@observer
export class StackColumnToolbarItem extends React.Component<ToolbarItemProps, {}> {
	private originalData = this.props.chartComponent.chart.series.map(r => r.yData.map(d => d));

	render() {
		const {chartComponent:{chart:{series}}, chartType} = this.props;
		const isBar = chartType == "bar";
		let columnMode = columnTypeLookup[this.props.userOptions.columnMode];

		return (<ButtonGroup className="stack-column">
			<bp.Tooltip position={bp.Position.BOTTOM} content={chartType == "beeswarm" ? "Superimpose" : "Cluster Columns"}>
				<Button className='toggle-cluster' active={columnMode === ColumnType.regular} onClick={e => this.setColumnType(ColumnType.regular)}>
					<AppIcon icon={isBar ?  appIcons.chart.toolbar.bar : appIcons.chart.toolbar.beeswarmOverlap}/>
				</Button>
			</bp.Tooltip>
			<bp.Tooltip position={bp.Position.BOTTOM} content={chartType == "beeswarm" ? "Stack" : "Stack Columns"}>
				<Button className='toggle-stack' active={columnMode === ColumnType.stacked} onClick={e => this.setColumnType(ColumnType.stacked)}>
					<AppIcon icon={isBar ?  appIcons.chart.toolbar.stackedBar : appIcons.chart.toolbar.beeswarmSeparate}/>
				</Button>
			</bp.Tooltip>
			{isBar && <bp.Tooltip position={bp.Position.BOTTOM} content="Stack Columns as Percentages">
				<Button className='toggle-percent' active={columnMode === ColumnType.percent} onClick={e => this.setColumnType(ColumnType.percent)}>
					<AppIcon icon={appIcons.chart.toolbar.percentBar}/>
				</Button>
			</bp.Tooltip>}
		</ButtonGroup>);
	}

	@action setColumnType = async (type:ColumnType) => {
		let {chartComponent, chartComponent:{chart}} = this.props;
		let {chartType} = this.props;

		chartComponent.busy = true;

		if (chartType == 'beeswarm')
		{
			if (this.props.onUpdateUserOptions) {
				// Calling onUpdateUserOptions here produces a weird JS crash saying onUpdateUserOptions is not defined
				this.props.chartComponent.userOptions.columnMode = highchartsBarchartName[type];
				await (this.props.chartComponent.extender as BeeswarmChartExtender).updateChartData(true);
			}
		}
		else {
			chart.update({
				             plotOptions: { column: { stacking: highchartsBarchartName[type] } }
			             }, false);

			if (type === ColumnType.regular) {
				let maxDataPt = 0;
				let minDataPt = 0;

				chart.series.forEach((r, i) => r.setData(this.originalData[i], false));

				chart.series.forEach(r => r.yData.forEach(pt => {
					maxDataPt = Math.max(maxDataPt, pt);
					minDataPt = Math.min(minDataPt, pt);
				}));

				chart.yAxis[0].userOptions.connInitialMin = minDataPt;
				chart.yAxis[0].userOptions.connInitialMax = maxDataPt;
			} else if (type === ColumnType.stacked) {
				let posStacks = new Array(chart.series[0].yData.length).fill(0);
				let negStacks = new Array(chart.series[0].yData.length).fill(0);

				chart.series.forEach((r, i) => r.setData(this.originalData[i], false));

				chart.series.forEach(r => r.yData.forEach((pt, i) => {
					pt < 0 ? negStacks[i] += pt : posStacks[i] += pt;
				}));

				chart.yAxis[0].userOptions.connInitialMin = _.min(negStacks);
				chart.yAxis[0].userOptions.connInitialMax = _.max(posStacks);
			} else if (type === ColumnType.percent) {
				chart.yAxis[0].userOptions.connInitialMin = 0;
				chart.yAxis[0].userOptions.connInitialMax = 100;
				chart.series.forEach(r => r.setData(r.yData.map(Math.abs), false));
			}

			chart.yAxis[0].setExtremes(chart.yAxis[0].userOptions.connInitialMin, chart.yAxis[0].userOptions.connInitialMax);
		}

		this.props.onUpdateUserOptions({columnMode: highchartsBarchartName[type]})

		chartComponent.busy = false;
	}
}
