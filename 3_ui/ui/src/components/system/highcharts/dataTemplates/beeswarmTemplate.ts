import type {PivotMetadata} from '../../../../stores/queryResult/models';
import { HighchartDataTemplate, getHighchartsSeriesObject, getAxisNames, mergeWithUserOptions, getRowAxisNames, getRowCoordinateNames } from './highchartDataTemplate'
import type {BeeswarmData, ChartUserOptions, ChartData} from 'stores/queryResult'

export function getHighchartsBeeswarmObject(chartData:BeeswarmData, pivotMetadata: PivotMetadata, userOptions: ChartUserOptions) : ChartData & any {
	var series = getHighchartsSeriesObject(chartData.series, pivotMetadata, false, false) as any;

	let axisNames = getAxisNames(pivotMetadata);
	let legendTitle = axisNames.join(", ");

	series.forEach(s => {
		if (s.data.length > 0 && s.data[0][0] == s.data[s.data.length - 1][0])
			s.visible = false;

		if (s.data.length == 0)
			s.data = [{x:0, y:0, name:0}]

		// NOTE: the 0, 1 keys is a hack to avoid breaking boost which fails in Canvas when using x/y. This bug is not found in the WebGL boost version.
		s.data = s.data.map((p, i) => {return {x: p[0], y: p[1], name:i, 0:p[0], 1:p[1]}})
		s.lineColor = s.color;
		//s.lineWidth = 1;

		// Boost has a bug that doesn't render points with matching y values if they are unsorted. https://jira.advise-conning.com/browse/WEB-1934
		// If reenabled need to look up custom tooltip points by name in points.hc.extender, however should only do that for beeswarm chart type since other chart types might have a name
		// This hack can be removed when Highcharts fixes the issue.
		//s.data = _.sortBy(s.data, "x");
	})

	var result = {
		statistics: series.length == 1 ? series[0].moments : null,
		axisNames: axisNames,
		rowAxisNames: getRowAxisNames(pivotMetadata),
		rowNames: chartData.rowCoordinates ? getRowCoordinateNames(pivotMetadata, chartData.rowCoordinates) : undefined,
		percentilesData: series.length == 1 ? series[0].percentiles : null,
		chart: {
			type: "scatter",
			zoomType: null,
			inverted: userOptions.isInverted
		},
		boost: {
			useGPUTranslations: true // Boost has a bug that doesn't render points with matching y values if they are unsorted. https://jira.advise-conning.com/browse/WEB-1934
		},
		plotOptions: {
			series: {
				marker: {
					symbol: "circle",
					radius: chartData.radius,
					//lineWidth: 1,
				},
				boostThreshold: 1,
				tooltip: {
					followTooltip: false,
				},
				stickyTracking: true, // false breaks hovering with boost.
			}
		},
		xAxis: [{
			title: {text: "Value"}
		}],
		yAxis: [{
			min: 0,
			max: 1,
			labels: {
				enabled: false,
			},
			tickInterval: 1,
			endOnTick: true,
			//minorTickInterval: 1/10,
		}],
		legend: {
			title: {
				text: legendTitle
			},
			enabled: series.length > 1
		},
		series: series,
		tooltip: {
			//shape: "square", //prevent callout on tooltip
		}
	}

	if (userOptions.percentiles.length > 0 && result.percentilesData)
		result.xAxis.push(getPercentileSecondaryXAxis() as any)

	result = mergeWithUserOptions(_.merge(new HighchartDataTemplate(userOptions), result), userOptions.highchartsOptions);

	// Ignore userOption min/max changes
	(result.xAxis[0] as any).min = chartData.x_min;
	(result.xAxis[0] as any).max = chartData.x_max;

	return result as ChartData;
}

export function getPercentileSecondaryXAxis():HighchartsAxisOptions {
	return {
		title: {text: 'Percentile'},
		min: 0,
		max: 100,
		gridLineWidth: 0,
		tickWidth: 0,
		lineWidth: 0,
		opposite: true,
	}
}