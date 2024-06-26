import { ChartAxisMaximumType } from 'stores';
import ComparisonChartBase from './ComparisonChartBase';

class AssetAllocationsChart extends ComparisonChartBase {
    getUpdateChartData() {
		const { evaluation1, evaluation2 } = this.props;
		
		return {
			title: { 
				text: 'Asset Allocation Comparison'
			},
			xAxis: {
				categories: this.assetCategories,
			},
			series: [{
				name: evaluation1.name,
				data: evaluation1.allocations.map((value) => ({ y: value })), // avoid highcharts updates original asset allocations when update data
				dataLabels: {
					enabled: false
				}
			}, {
				name: evaluation2.name,
				data: evaluation2.allocations.map((value) => ({ y: value })),
				dataLabels: {
					enabled: false
				}	
			}]
		};
	}	

	getChartAxisConstraint(chartData, type: ChartAxisMaximumType) {
		if (type === ChartAxisMaximumType.Dynamic) {
			return {
				min: null,
				max: null
			};
		} else if (type === ChartAxisMaximumType.Fixed100) {
			return {
				min: 0,
				max: 1
			};
		} 
		return chartData.series.reduce((constraint, s) => {
				s.data.forEach((point) => {
					if (point.y > constraint.max) {
						constraint.max = point.y;
					}
				});
				return constraint;
			}, { min: 0, max: 0 });
	}
}

export default AssetAllocationsChart;