import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import * as React from 'react';
import type {ChartUserOptions} from '../../../../../stores/charting';
import {IO, i18n} from 'stores';
import {createGroupedDetail} from './GroupDetailTooltip';

/* Note that we MUST use inline styles here as the chart won't format correctly otherwise when it measures before loading .css */
// See http://api.highcharts.com/highcharts/tooltip.formatter for more details
interface MyProps {
	chart: HighchartsChartObject;
	point: any;
	assets: Array<{name: string, color:string}>;
	chartingResult: IO;
	userOptions: ChartUserOptions;
	dataFormatter: (i:number) => string;
}

export class AssetAllocationTooltip extends React.Component<MyProps, {}> {

	assetRenderObject(assets, allocation, index) {
		return {name: assets[index].name, value: allocation, color:assets[index].color};
	}

	render() {
		let pointName, pointDetail;
		const {point} = this.props;
		if (this.props.chart.tooltip.shared) {
			pointName = point.x;
			const renderAssets = point.points.map((p, i) => ({name: p.series.name, value: p.y, color: p.series.color})).filter(p => p.value != 0);
			pointDetail = renderAssets.map((asset,i) => <ChartTooltipValueSet
				key={`${asset}_${i}`}
				customFront={<span style={{color:asset.color, fontFamily:"Helvetica, sans-serif"}}>&#9608; </span>}
				label={asset.name}
				value={this.props.dataFormatter(asset.value)}
			/>);
		} else {
			pointName = point.point.category;
			pointDetail = createGroupedDetail(this.props, this.props.point.key, point.point.series.name);
		}
		return (
		<ChartTooltipBox>
			<ChartTooltipTitle>
				{i18n.highcharts.tooltipTitle.identification}
			</ChartTooltipTitle>
            <ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.point} value={pointName} />
            <ChartTooltipTitle>
				{i18n.highcharts.tooltipTitle.assetAllocation}
			</ChartTooltipTitle>
            {pointDetail}
		</ChartTooltipBox>);
	}

}