import { ChartAxisMaximumType } from 'stores';
import { Colors } from 'themes/themes';
import ComparisonChartBase from './ComparisonChartBase';

class AssetAllocationsDiffChart extends ComparisonChartBase {
    getUpdateChartData() {
		const { evaluation1, evaluation2 } = this.props;
		const { allocations: allocations2 } = evaluation2;
		const greaterSeries = {
			name: `${evaluation1.name} > ${evaluation2.name}`,
			color: Colors.light.primary,
			data: [],
			dataLabels: {
				enabled: false
			}
		};
		const lessSeries = {
			name: `${evaluation1.name} < ${evaluation2.name}`,
			color: Colors.light.secondary,
			data: [],
			dataLabels: {
				enabled: false
			}
		};

		evaluation1.allocations.forEach((allocation, i) => {
			const value = allocation - allocations2[i];
			if (value > 0) {
				greaterSeries.data.push({ y: value});
				lessSeries.data.push({ y: 0});
			} else {
				greaterSeries.data.push({ y: 0});
				lessSeries.data.push({ y: value});
			}
		});

		return {
			title: {
				text: 'Asset Allocation Differences'
			},
			xAxis: {
				categories: this.assetCategories,
			},
			plotOptions: {
				series: {
					stacking: 'normal'
				}
			},
			series :[greaterSeries, lessSeries]
		}
	}	

	getChartAxisConstraint(chartData, type: ChartAxisMaximumType) {
		if (type === ChartAxisMaximumType.Dynamic) {
			return {
				min: null,
				max: null
			};
		} else if (type === ChartAxisMaximumType.Fixed100) {
			return {
				min: -1,
				max: 1
			};
		} 
		return chartData.series.reduce((constraint, s) => {
				s.data.forEach((point) => {
					if (point.y > constraint.max) {
						constraint.max = point.y;
					} else if (point.y < constraint.min) {
						constraint.min = point.y;
					}
				});
				return constraint;
			}, { min: 0, max: 0 });
	}
}

export default AssetAllocationsDiffChart;