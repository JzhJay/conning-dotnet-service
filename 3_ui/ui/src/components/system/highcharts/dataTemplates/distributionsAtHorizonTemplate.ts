import type {ChartUserOptions} from '../../../../stores/charting';
import {ClimateRiskAnalysis} from '../../../../stores/climateRiskAnalysis';
import {CRA_COLORS} from '../chartConstants';
import {HighchartDataTemplate} from './highchartDataTemplate';

export function getHighchartsDistributionsAtHorizonObject(climateRiskAnalysis: ClimateRiskAnalysis, userOptions: ChartUserOptions) {
	let {pdfs, xMin, xMax, yMin, yMax} = climateRiskAnalysis.output.distributionsAtHorizon;
	let horizonSeries = pdfs[userOptions.horizon];
	let series = [{name: "Base Case", data: horizonSeries.basecase, color: CRA_COLORS[0]}, {name: "Adjusted", data: horizonSeries.adjusted, color: CRA_COLORS[1]}];


	let result = {
		chart: {
			type: "area",
			inverted: userOptions.isInverted
		},
		title: {text: `Market Value at +${userOptions.horizon} ` + (userOptions.horizon > 1 ? 'Years' : 'Year')},
		plotOptions: {
			series: {
				// boostThreshold: 1000000,
				marker: {enabled: false},
				animation: false
			}
		},
		xAxis: [{
			//min: xMin,
			//max: xMax
			labels: {
				//padding: 500, // Ensure whitespace between labels
				autoRotation: false,
				//align: 'center',
			}
		}],
		yAxis: [{
			labels: {
				enabled: false,
			},
			tickLength: 0,
			gridLineWidth: 0
			//min: yMin,
			//max: yMax
		}],
		legend: {
			symbolWidth: 30, // use a bigger symbol width ine line charts to allow dashed legend symbols to show a more complete period
			enabled: series.length > 1,
			layout: "horizontal",
			align: "center",
			verticalAlign: "bottom"
		},
		series: series,
		tooltip: {
			shape: "square", //prevent callout on tooltip
		}
	}

	return _.merge(new HighchartDataTemplate(userOptions), result, userOptions.highchartsOptions);
}