import {IO} from 'stores';
import {add, divide, multiple, subtract} from 'utility';
import {HighchartDataTemplate} from './highchartDataTemplate'
import type {ChartUserOptions} from 'stores';

export function getHighchartsAssetClassesReturnObject(io: IO, userOptions: ChartUserOptions) {
	const usingAdjustmentsByAssetClass = _.get(io, "optimizationInputs.dataSources.useAdditiveMultiplicativeAdjustmentsByAssetClass");
	const annualizedReturns = _.get(userOptions, "annualizedReturns", true);
	const adjustmentReturns = _.get(userOptions, "adjustmentReturns", true);
	let x_series_key, y_series_key;
	if (annualizedReturns) {
		if (usingAdjustmentsByAssetClass && adjustmentReturns) {
			x_series_key = "adjAnnualizedStdTotalReturns";
			y_series_key = "adjAnnualizedAvgTotalReturns";
		} else {
			x_series_key = "annualizedStdTotalReturns";
			y_series_key = "annualizedAvgTotalReturns";
		}
	} else {
		if (usingAdjustmentsByAssetClass && adjustmentReturns) {
			x_series_key = "adjCumulativeStdTotalReturns";
			y_series_key = "adjCumulativeAvgTotalReturns";
		} else {
			x_series_key = "cumulativeStdTotalReturns";
			y_series_key = "cumulativeAvgTotalReturns";
		}
	}

	let series = _.map(io.getAssetClassInputWithoutGroups() , (allocation, i) => ({
		name: allocation.name,
		color: allocation.color,
		data: [[
			_.get(io, `returnOutputs.${x_series_key}.${i}`), // xValue
			_.get(io, `returnOutputs.${y_series_key}.${i}`)  // yValue
		]],
		showInLegend: true
	}))

	// Account for mismatch between the allocations in Julia mock AO and getReturnsOutputsData() test data
	KARMA && (series = _.filter(series,s => !_.includes(s.data[0], null)));

	const xMax = Math.max(...(_.map(series, s => s.data[0][0])));
	const xMin = Math.min(...(_.map(series, s => s.data[0][0])));
	const yMax = Math.max(...(_.map(series, s => s.data[0][1])));
	const yMin = Math.min(...(_.map(series, s => s.data[0][1])));

	/* if using max/min as value of the axis strange directly, the point will stick on the edge of chart.
	   calculated the max/min value for add some space between point and edge.
	 */
	const calLimits = (max: number, min: number) : {max: number, min: number} => {

		if (!_.isFinite(max) || !_.isFinite(min) || max < min ) {
			return {max: null, min: null};
		}
		const diff = subtract(max,min);
		const edge = divide(Math.abs(diff) ,10);

		const round = (n: number, roundFunc: (n:number) => number): number => {
			let fractionDigits = 0;
			if (n >= 1 || n <= -1) {
				fractionDigits = 1;
			} else {
				const testAllocationIncrement = `${n}`.match(/-?\d*(\.(0*)\d+)?/);
				fractionDigits = testAllocationIncrement && testAllocationIncrement[2] ? testAllocationIncrement[2].length : 0;
				fractionDigits = fractionDigits + 2;
			}
			return divide(
				roundFunc(multiple(n, Math.pow(10, fractionDigits))),
				Math.pow(10, fractionDigits)
			);
		}

		return {
			max: max < 0 && -max < edge ? 0 : round(add(max, edge), Math.ceil),
			min: min > 0 && min < edge ? 0 : round(subtract(min, edge), Math.floor)
		}
	}

	let result = {
		chart: {
			type: 'scatter',
			inverted: userOptions.isInverted
		},
		title: {text: "Asset Class Risk vs. Reward"},
		xAxis: [{
			gridLineWidth: 1,
			title: { text: 'Risk (StDev.S)' },
			showFirstLabel:true,
			startOnTick: true,
			labels: { format: null, formatter: () => { return "x"; } },
			...calLimits(xMax, xMin)
		}],
		yAxis: [{
			title: { text: 'Reward (Mean)'},
			showFirstLabel:true,
			startOnTick: true,
			labels: { format: null, formatter: () => { return "y"; } },
			...calLimits(yMax, yMin)
		}],
		legend: {
			itemMarginBottom: 5
		},
		plotOptions: {
			scatter: {
				marker: {
					radius: 5,
					symbol: 'circle'
				}
			}
		},

		series: series
	}

	return _.merge(new HighchartDataTemplate(userOptions), userOptions.highchartsOptions, result);
}