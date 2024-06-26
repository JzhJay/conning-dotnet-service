import {HighchartDataTemplate} from "./highchartDataTemplate";
import type {ChartUserOptions} from 'stores/queryResult';

export interface RSSimulationReportChartData {
	chartTitle: string;
	categories: string[];
	xAxisTitle: string;
	yAxisTitle: string;
	series: {
		label: string;
		data: any;
		uiCustomSeries?: string;
	}[],
}

export function getHighchartsRSSimulationReportObject(chartData: RSSimulationReportChartData, userOptions: ChartUserOptions) {

	const series = _.map(chartData.series, series => {
		if (_.get(series, "uiCustomSeries") == "violations") {
			return {
				type: 'scatter',
				name: series.label,
				data: [series.data]
			}
		} else {
			return {
				type: 'line',
				name: series.label,
				data: series.data
			}
		}
	}) as any;

	let result: HighchartsOptions = {
		chart: {
			inverted: userOptions.isInverted
		},
		title: {
			text: chartData.chartTitle
		},
		xAxis: [{
			title: { text: chartData.xAxisTitle },
			categories: chartData.categories
		}],
		yAxis: [{
			title: { text: chartData.yAxisTitle },
			tickPixelInterval: 50
		}],
		plotOptions: {
			series: {
				boostThreshold: Number.MAX_VALUE,
				states: {
					hover: {
						enabled: false,
						marker:	{ enabled: false }
					},
					select: {
						enabled: false,
						marker:	{ enabled: false }
					},
					inactive: { enabled: false }
				} as any
			},
			line: {
				marker: { enabled: false }
			},
			scatter: {
				marker: { symbol: "circle" }
			}
		},
		series: series
	};
	return _.merge({}, new HighchartDataTemplate(userOptions), result, userOptions.highchartsOptions);

}
