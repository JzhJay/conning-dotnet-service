import {ChartTooltipBox, ChartTooltipTitle, ChartTooltipValueSet} from 'components/system/highcharts/internal-components/tooltips/ChartTooltips.base';
import type {ChartUserOptions} from 'stores';
import {IO} from 'stores';
import {createGroupedDetail} from './GroupDetailTooltip';
import {i18n} from 'stores';

/* Note that we MUST use inline styles here as the chart won't format correctly otherwise when it measures before loading .css */
// See http://api.highcharts.com/highcharts/tooltip.formatter for more details
interface MyProps {
	chart: HighchartsChartObject;
	point: any;
	assets: Array<{name: string, color:string}>;
	getPrecisionFromAxis?: (value, axis) => number;
	chartingResult: IO;
	userOptions: ChartUserOptions;
}

export class EfficientFrontierTooltip extends React.Component<MyProps, {}> {

	renderAsset(asset) {
		return <ChartTooltipValueSet label={asset.name} value={asset.value} />
	}

	assetRenderObject(assets, allocation, index) {
		return {name: assets[index].name, value: allocation, color:assets[index].color};
	}

	additionalPointName(evaluationIndex) {
		const chartingResult = this.props.chartingResult;
		if (chartingResult.isAdditionalPoint(evaluationIndex)) {
			return chartingResult.additionalPoints.filter(a => a.evaluationIndex == evaluationIndex)[0].name;
		}
	}

	render() {
		const {point, chart, assets, getPrecisionFromAxis} = this.props;
		const series = point.series;
		const isPieSeries = series.type == "pie";
		const identificationName = !isPieSeries && (this.additionalPointName(point.point.options.connEvalIndex) || point.key);
		const io = this.props.chartingResult;
		const duration = !isPieSeries && io.computeDuration(io.evaluations[point.point.options.connEvalIndex]).toFixed(2);
		const renderAssets = !isPieSeries && point.point.options.connAssetAllocation.map((a, i) => ({name: assets[i].name, value: a, color:assets[i].color})).filter(a => a.value != 0);

		return (
			<ChartTooltipBox>

				{identificationName && <>
					<ChartTooltipTitle>{i18n.highcharts.tooltipTitle.identification}</ChartTooltipTitle>
					<ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.name} value={identificationName} />
				</>}

				<ChartTooltipTitle>{i18n.highcharts.tooltipTitle.assetAllocation}</ChartTooltipTitle>
	            {!isPieSeries && renderAssets.map(asset => <ChartTooltipValueSet
					key={asset.name}
					customFront={!isPieSeries && <span style={{color:asset.color, fontFamily:"Helvetica, sans-serif"}}>&#9608; </span>}
					label={asset.name}
					value={`${(asset.value * 100).toFixed(2)}%`}
				/>)}

				{!isPieSeries && <>
					<ChartTooltipTitle>
						{i18n.highcharts.tooltipTitle.metrics}
					</ChartTooltipTitle>
					<ChartTooltipValueSet label={chart.xAxis[0].userOptions.title.text} value={getPrecisionFromAxis(point.point.x, chart.xAxis[0])} />
					<ChartTooltipValueSet label={chart.yAxis[0].userOptions.title.text} value={getPrecisionFromAxis(point.point.y, chart.yAxis[0])} />
					<ChartTooltipValueSet label={i18n.highcharts.tooltipValueSet.duration} value={duration} />
				</>}

				{isPieSeries && createGroupedDetail(this.props, point.point.series.name, point.key)}

			</ChartTooltipBox>);
	}
}
