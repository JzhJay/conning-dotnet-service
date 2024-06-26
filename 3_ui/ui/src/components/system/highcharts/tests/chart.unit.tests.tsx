import {findOption} from 'components/system/IO/internal/inputs/utility';
import {IOApplicationBarItems} from 'components/system/IO/IOApplicationBarItems';
import {IO, ioTestData, OptimizationTarget} from 'stores';
import { isPhantomJS, testScheduler, ITestable, expect } from 'test'
import { QueryResult, queryResultStore as queryResultStore, ChartData } from 'stores/queryResult';
import {sleep} from 'utility/utility';
import { getHighchartsBoxObject } from '../dataTemplates/boxTemplate'
import { getHighchartsPDFObject } from '../dataTemplates/pdfTemplate'
import { getHighchartsHistogramObject } from '../dataTemplates/histogramTemplate'
import { getHighchartsScatterObject } from '../dataTemplates/scatterTemplate'

import { percentileChartTestData } from './percentileChartTestData'
import { pdfChartTestData } from './pdfChartTestData'
import { histogramChartTestData } from './histogramChartTestData'
import { beeswarmChartTestData } from './beeswarmChartTestData'
import { scatterChartTestData } from './scatterChartTestData'
import { getHighchartsLineChartObject } from "../dataTemplates/lineTemplate";
import { lineChartTestData } from "./lineChartTestData";
import { getHighchartsBarChartObject } from "../dataTemplates/barTemplate";
import { getHighchartsBeeswarmObject } from "../dataTemplates/beeswarmTemplate";
import { getStatisticTitle } from "../dataTemplates/efficientFrontierTemplate";

function barlineUnitTest(result, highchartsOptions, expectedSeriesNames, isBar) {
	it(`should have applied highcharts user options`, function () {
		expect(result.chart.inverted).to.equal(highchartsOptions.chart.inverted)
		expect(result.xAxis[0].min).to.equal(highchartsOptions.xAxis[0].min)
	})

	it(`should match axis titles`, function () {
		expect(result.xAxis[0].title.text).to.equal("Scenario");
	})

	it(`should match expected series`, function () {
		//TODO refactor the series name code into a separate function and test other series name and axis labeling options.
		let expectedSeriesData = [];

		lineChartTestData.chartData.detailCells.forEach(row => {
			expectedSeriesData.push(row);
		});

		expectedSeriesData = expectedSeriesData.map(row => row.map((d, i) => {return isBar ? d.data : { x: i, y: d.data }}))


		expect(result.series.length).to.equal(expectedSeriesNames.length);


		// Compare series
		result.series.map((series, i) => {
			expect(series.name).to.equal(expectedSeriesNames[i])
			expect(series.data).to.deep.equal(expectedSeriesData[i]);

		})
	})
}

class ChartTemplateTests implements ITestable {
	describeTests = () => {
		describe(`Chart Templates`, function () {
			this.timeout(10000);

			//TODO: Test multiple axes box chart.
			describe(`Box chart`, function () {
				const chartType                    = "box";
				const highchartsOptions            = { chart: { inverted: true }, xAxis: [{ min: .5 }], yAxis: [{ max: 2 }], showMeanValues: true }
				const { chartData, pivotMetadata } = percentileChartTestData;
				const result: ChartData            = getHighchartsBoxObject(chartData as any, pivotMetadata as any, Object.assign({}, queryResultStore.charting.defaultUserOptions(chartType), { highchartsOptions }));

				//console.log(result);

				it(`should match axis name`, function () {
					const axisName = "Economy"
					expect(result.axisNames).to.deep.equal([axisName]);
					expect(result.xAxis[0].title.text).to.equal(axisName);
				})

				it(`should have applied highcharts user options`, function () {
					expect(result.chart.inverted).to.equal(highchartsOptions.chart.inverted)
					expect(result.xAxis[0].min).to.equal(highchartsOptions.xAxis[0].min)
					expect(result.yAxis[0].max).to.equal(highchartsOptions.yAxis[0].max)
				})

				it(`should match legend title`, function () {
					expect(result.legend.title.text).to.deep.equal("Percentile Ranges")
				})

				it(`should match row names`, function () {
					const pathAxis = pivotMetadata.axes[1];
					expect(result.rowAxisNames).to.deep.equal([pathAxis.groupName.label])
					expect(result.rowNames).to.deep.equal((pathAxis.groupMembers as Array<number>).map((g) => [g]))
				})

				it(`should match series data`, function () {
					const expectedSeriesData = [
						{ "data": [[0.0562464015669194, 0.06225383991659594], [0.08374881895519587, 0.09635125342584439], [0.09953224473048872, 0.12041314083257815], [0.09269651890420438, 0.11011457436413674]] },
						{ "data": [[0.0471359239284711, 0.0562464015669194], [0.06826840599343786, 0.08374881895519587], [0.08488996149487582, 0.09953224473048872], [0.07601698094362896, 0.09269651890420438]] },
						{ "data": [[0.03451623524144393, 0.0471359239284711], [0.05017190464075533, 0.06826840599343786], [0.07855856721982485, 0.08488996149487582], [0.06220195412993518, 0.07601698094362896]] },
						{ "data": [[0.027142612291236157, 0.03451623524144393], [0.04196484264264155, 0.05017190464075533], [0.07567728380949346, 0.07855856721982485], [0.050708378802791554, 0.06220195412993518]] }
					]
					let withoutMeans = result.series.filter(({name}) => name !== 'mean');
					expect(withoutMeans.length).to.equal(expectedSeriesData.length);

					// Compare series data
					withoutMeans.map((series, i) => {
						expect((series.data as any).map((d) => [d.low, d.high])).to.deep.equal(expectedSeriesData[i].data)
					})
				})
				it(`should add mean series`, function () {
					const expectedMeanSeries = [
						{data: [
							{x: 0, y: 0.0454590025889333},
							{x: 1, y: 0.068101045131575},
							{x: 2, y: 0.09181423961745219},
							{x: 3, y: 0.07834768142893936}
						]}
					];

					let meanSeries = result.series.filter(({name}) => name === 'mean');
					expect(meanSeries.length).to.equal(1);

					expect(meanSeries[0].data).to.deep.equal(expectedMeanSeries[0].data);
				});
			});

			describe(`PDF chart`, function () {
				const chartType                    = "pdf";
				const highchartsOptions            = { chart: { inverted: true }, xAxis: [{ min: .5 }], yAxis: [{ max: 2 }] }
				const { chartData, pivotMetadata } = pdfChartTestData;
				const result: ChartData            = getHighchartsPDFObject(chartData as any, pivotMetadata as any, Object.assign({}, queryResultStore.charting.defaultUserOptions(chartType), { highchartsOptions }));

				it(`should have applied highcharts user options`, function () {
					expect(result.chart.inverted).to.equal(highchartsOptions.chart.inverted)
					expect(result.xAxis[0].min).to.equal(highchartsOptions.xAxis[0].min)
					expect(result.yAxis[0].max).to.equal(highchartsOptions.yAxis[0].max)
				})

				it(`should match legend title`, function () {
					expect(result.legend.title.text).to.deep.equal("Quarter")
				})

				it(`should match expected series`, function () {
					const expectedSeriesData = [
						{ "data": [], columnCoordinates: ["2016Q1"] },
						{ "data": [[0.0060290779420702776, 48.72487214343369], [0.006047381793874555, 49.04391010036669], [0.006065685645678832, 49.36224394917066], [0.006083989497483109, 49.679850336280246]], columnCoordinates: ["2016Q2"] }]

					expect(result.series.length).to.equal(expectedSeriesData.length);

					// Compare series
					result.series.map((series, i) => {
						expect(series.data).to.deep.equal(expectedSeriesData[i].data)
						expect(series.columnCoordinates).to.deep.equal(expectedSeriesData[i].columnCoordinates)
						expect(series.name).to.equal(expectedSeriesData[i].columnCoordinates[0])
					})

				})
			});

			describe(`Histogram chart`, function () {
				const chartType                    = "histogram";
				const highchartsOptions            = { chart: { inverted: true }, xAxis: [{ min: .5 }], yAxis: [{ max: 2 }] }
				const { chartData, pivotMetadata } = histogramChartTestData;
				const result: ChartData            = getHighchartsHistogramObject(chartData as any,
				                                                                  pivotMetadata as any,
				                                                                  Object.assign({}, queryResultStore.charting.defaultUserOptions(chartType), { highchartsOptions }, { degreeOfSmoothingIndex: 2 })
				);

				it(`should have applied highcharts user options`, function () {
					expect(result.chart.inverted).to.equal(highchartsOptions.chart.inverted)
					expect(result.xAxis[0].min).to.equal(highchartsOptions.xAxis[0].min)
					expect(result.yAxis[0].max).to.equal(highchartsOptions.yAxis[0].max)
				})

				it(`should match legend title`, function () {
					expect(result.legend.title.text).to.deep.equal("Quarter")
				})

				it(`should match expected series`, function () {
					const expectedSeriesData = [
						{
							columnCoordinates: ["2016Q1"],
							data             : [{ x: 0.003, y: 0, name: "0.00:0.00" }, { x: 0.005, y: 0, name: "0.00:0.01" }, { x: 0.007, y: 0, name: "0.01:0.01" }, { x: 0.009000000000000001, y: 0, name: "0.01:0.01" },
							                    { x: 0.011, y: 10, name: "0.01:0.01" }, { x: 0.013000000000000001, y: 0, name: "0.01:0.01" }, { x: 0.015, y: 0, name: "0.01:0.02" }],
							name             : "2016Q1"
						},
						{
							columnCoordinates: ["2016Q2"],
							data             : [{ x: 0.003, y: 0, name: "0.00:0.00" }, { x: 0.005, y: 0, name: "0.00:0.01" }, { x: 0.007, y: 3, name: "0.01:0.01" }, { x: 0.009000000000000001, y: 0, name: "0.01:0.01" },
							                    { x: 0.011, y: 3, name: "0.01:0.01" }, { x: 0.013000000000000001, y: 2, name: "0.01:0.01" }, { x: 0.015, y: 2, name: "0.01:0.02" }],
							name             : "2016Q2"
						},
						{
							columnCoordinates: ["2016Q3"],
							data             : [{ x: 0.003, y: 1, name: "0.00:0.00" }, { x: 0.005, y: 0, name: "0.00:0.01" }, { x: 0.007, y: 1, name: "0.01:0.01" }, { x: 0.009000000000000001, y: 1, name: "0.01:0.01" },
							                    { x: 0.011, y: 5, name: "0.01:0.01" }, { x: 0.013000000000000001, y: 2, name: "0.01:0.01" }, { x: 0.015, y: 0, name: "0.01:0.02" }],
							name             : "2016Q3"
						}]

					expect(result.series.length).to.equal(expectedSeriesData.length);

					// Compare series
					result.series.map((series, i) => {
						expect(series.data).to.deep.equal(expectedSeriesData[i].data)
						expect(series.columnCoordinates).to.deep.equal(expectedSeriesData[i].columnCoordinates)
						expect(series.name).to.equal(expectedSeriesData[i].columnCoordinates[0])
					})

				})
			});

			describe(`Scatter chart`, function () {
				const chartType                    = "scatter";
				const highchartsOptions            = { chart: { inverted: true }, xAxis: [{ min: .5 }], yAxis: [{ max: 2 }] }
				const { chartData, pivotMetadata } = scatterChartTestData;
				const result: ChartData            = getHighchartsScatterObject(chartData as any, pivotMetadata as any, Object.assign({}, queryResultStore.charting.defaultUserOptions(chartType), { highchartsOptions }));

				it(`should have applied highcharts user options`, function () {
					expect(result.chart.inverted).to.equal(highchartsOptions.chart.inverted)
					expect(result.xAxis[0].min).to.equal(highchartsOptions.xAxis[0].min)
					expect(result.yAxis[0].max).to.equal(highchartsOptions.yAxis[0].max)
				})

				it(`should match axis titles`, function () {
					expect(result.xAxis[0].title.text).to.equal("X");
					expect(result.yAxis[0].title.text).to.equal("Y");
				})

				it(`should match expected series`, function () {
					//TODO refactor the series name code into a separate function and test other series name and axis labeling options.
					const expectedSeriesNames = ["X: Continuous, US, 2016Q1 vs. Y: Continuous, US, 2016Q2",
					                             "X: Continuous, US, 2016Q3 vs. Y: Continuous, US, 2016Q4",
					                             "X: Continuous, US, 2017Q1 vs. Y: Continuous, US, 2017Q2",
					                             "X: Continuous, US, 2017Q3 vs. Y: Continuous, US, 2017Q4",
					                             "X: Continuous, US, 2018Q1 vs. Y: Annual, DE, 2016Q1",
					                             "X: Annual, DE, 2016Q2 vs. Y: Annual, DE, 2016Q3",
					                             "X: Annual, DE, 2016Q4 vs. Y: Annual, DE, 2017Q1"]
					let expectedSeriesData    = [];

					scatterChartTestData.chartData.detailCells.forEach((row, rowIndex) => {
						let rowData = []
						for (let i = 0; i < row.length / 2; i++) {
							rowData.push({ name: rowIndex, x: row[i * 2], y: row[i * 2 + 1] });
						}

						expectedSeriesData.push(rowData);
					});

					expectedSeriesData = _.zip.apply(_, expectedSeriesData);

					expect(result.series.length).to.equal(expectedSeriesNames.length);


					// Compare series
					result.series.map((series, i) => {
						expect((series as any).regression).to.equal(true)
						expect(series.name).to.equal(expectedSeriesNames[i])
						expect(series.data).to.deep.equal(expectedSeriesData[i]);

					})
				})
			});

			describe(`Line chart`, function () {
				const chartType                    = "line";
				const highchartsOptions            = { chart: { inverted: false }, xAxis: [{ min: .5 }] }
				const { chartData, pivotMetadata } = lineChartTestData;
				const result: ChartData            = getHighchartsLineChartObject(chartData as any, pivotMetadata as any, Object.assign({}, queryResultStore.charting.defaultUserOptions(chartType), { highchartsOptions }));
				const expectedSeriesNames          = ["Continuous, US", "Continuous, US", "Continuous, US",
				                                      "Continuous, US", "Continuous, US", "Continuous, US", "Continuous, US",
				                                      "Continuous, US", "Continuous, US", "Annual, DE", "Annual, DE",
				                                      "Annual, DE", "Annual, DE", "Annual, DE", "Annual, DE",
				                                      "Annual, DE", "Annual, DE", "Annual, DE"]

				barlineUnitTest(result, highchartsOptions, expectedSeriesNames, false);
			});

			describe(`Bar chart`, function () {
				const chartType                    = "bar";
				const highchartsOptions            = { chart: { inverted: false }, xAxis: [{ min: .5 }] }
				const { chartData, pivotMetadata } = lineChartTestData;
				const result: ChartData            = getHighchartsBarChartObject(chartData as any, pivotMetadata as any, Object.assign({}, queryResultStore.charting.defaultUserOptions(chartType), { highchartsOptions }));
				const expectedSeriesNames          = ["Continuous, US, 2016Q1", "Continuous, US, 2016Q2", "Continuous, US, 2016Q3",
				                                      "Continuous, US, 2016Q4", "Continuous, US, 2017Q1", "Continuous, US, 2017Q2",
				                                      "Continuous, US, 2017Q3", "Continuous, US, 2017Q4", "Continuous, US, 2018Q1",
				                                      "Annual, DE, 2016Q1", "Annual, DE, 2016Q2", "Annual, DE, 2016Q3", "Annual, DE, 2016Q4",
				                                      "Annual, DE, 2017Q1", "Annual, DE, 2017Q2", "Annual, DE, 2017Q3", "Annual, DE, 2017Q4", "Annual, DE, 2018Q1"]

				barlineUnitTest(result, highchartsOptions, expectedSeriesNames, true);
			});


			describe(`Beeswarm chart`, function () {
				const chartType                    = "beeswarm";
				const highchartsOptions            = { chart: { inverted: true }, xAxis: [{ min: .5 }], percentiles: [0, 2, 7, 30, 50] }
				const { chartData, pivotMetadata } = beeswarmChartTestData;
				const result: ChartData            = getHighchartsBeeswarmObject(chartData as any,
				                                                                 pivotMetadata as any,
				                                                                 Object.assign({}, queryResultStore.charting.defaultUserOptions(chartType), { highchartsOptions }, { degreeOfSmoothingIndex: 2 })
				);

				it(`should have applied highcharts user options`, function () {
					expect(result.chart.inverted).to.equal(highchartsOptions.chart.inverted)

					// Should ignore x axis min/max
					expect(result.xAxis[0].min).to.not.equal(highchartsOptions.xAxis[0].min)
				})

				it(`should match plot options`, function () {
					expect(result.plotOptions.series.marker.radius).to.equal(beeswarmChartTestData.chartData.radius, "should match radius")
					expect(result.plotOptions.series.boostThreshold).to.equal(1, "boost should be enabled")
					expect(result.yAxis[0].min).to.equal(0, "y axis min should be 0")
					expect(result.yAxis[0].max).to.equal(1, "y axis max should be 1")
					expect(result.xAxis[0].min).to.equal(beeswarmChartTestData.chartData.x_min, "should match x axis min")
					expect(result.xAxis[0].max).to.equal(beeswarmChartTestData.chartData.x_max, "should match y axis min")
				})

				it(`should match expected series`, function () {
					let expectedSeriesData = [
						{ columnCoordinates: ["2016Q1"], name: "2016Q1" },
						{ columnCoordinates: ["2016Q2"], name: "2016Q2" },
						{ columnCoordinates: ["2016Q3"], name: "2016Q3" }]

					expect(result.series.length).to.equal(expectedSeriesData.length, "series length should match");
					expect((result.series[0] as HighchartsScatterChartSeriesOptions).visible).to.equal(false, "series with no unique points should be disabled")

					// Compare series
					result.series.forEach((series, i) => {
						expect(series.columnCoordinates).to.deep.equal(expectedSeriesData[i].columnCoordinates, "should match column coordiantes")
						expect(series.name).to.equal(expectedSeriesData[i].columnCoordinates[0], "should match series name")
						expect(['x', 'y', 'name', '0', '1'].every(k => k in (series.data[0] as any))).to.equal(true, "should match series data format")
					})

				})
			});

		});
	}
}

testScheduler.register(new ChartTemplateTests());

class StatisticTitleTests implements ITestable {
	describeTests = () => {
		describe("StatisticTitle unit test", function () {
			this.timeout(180 * 1000);
			let result = null;
			let io: IO = null;
			let optimizationTarget  = null;
			let riskMeasure = null;

			before(async function() {
				io = await ioTestData.loadTestData();
				optimizationTarget = io.optimizationInputs.optimizationTarget;
				riskMeasure = optimizationTarget.riskMeasure;
			})

			after(function (done) {
				done();
			})

			it(`Statistic is neither percentile or cte or semistdev, statistic equals 'mean'`, function () {
				riskMeasure.statistic = 'mean';
				const title = findOption(io.inputOptions.optimizationTarget, ["riskMeasure", "statistic"]).options.find(o => o.name == riskMeasure.statistic).title;
				result = getStatisticTitle(io, optimizationTarget, title, true);
				expect(result).to.equal('Mean');
			})

			it(`Statistic is 'semistdev', thresholdType is Average`, function () {
				riskMeasure.statistic = 'semistdev';
				riskMeasure.thresholdType = 'average';
				riskMeasure.area = 'under';
				const title = findOption(io.inputOptions.optimizationTarget, ["riskMeasure", "statistic"]).options.find(o => o.name == riskMeasure.statistic).title;
				result = getStatisticTitle(io, optimizationTarget, title, true);
				expect(result).to.equal('SemiStDev under Average');
			})

			it(`Statistic is 'semistdev', thresholdType is Percentile`, function () {
				riskMeasure.statistic = 'semistdev';
				riskMeasure.thresholdType = 'percentile';
				riskMeasure.area = 'under';
				riskMeasure.percentile = 0.51;
				const title = findOption(io.inputOptions.optimizationTarget, ["riskMeasure", "statistic"]).options.find(o => o.name == riskMeasure.statistic).title;
				result = getStatisticTitle(io, optimizationTarget, title, true);
				expect(result).to.equal('SemiStDev under 51st Percentile');
			})

			it(`Statistic is 'semistdev', thresholdType is Fixed`, function () {
				riskMeasure.statistic = 'semistdev';
				riskMeasure.thresholdType = 'fixed';
				riskMeasure.area = 'under';
				riskMeasure.fixedThreshold = 60;
				const title = findOption(io.inputOptions.optimizationTarget, ["riskMeasure", "statistic"]).options.find(o => o.name == riskMeasure.statistic).title;
				result = getStatisticTitle(io, optimizationTarget, title, true);
				expect(result).to.equal('SemiStDev under Fixed 60');
			})

			it(`Statistic is 'CTE' percentile is decimal`, function () {
				riskMeasure.statistic = 'cte';
				riskMeasure.area = 'under';
				riskMeasure.percentile = 0.023;
				const title = findOption(io.inputOptions.optimizationTarget, ["riskMeasure", "statistic"]).options.find(o => o.name == riskMeasure.statistic).title;
				result = getStatisticTitle(io, optimizationTarget, title, true);
				expect(result).to.equal('CTE under 2.3th Percentile');
			})

			it(`Reward Title: Statistic is 'CTE'`, function () {
				let rewardMeasure = optimizationTarget.rewardMeasure;
				rewardMeasure.statistic = 'cte';
				rewardMeasure.area = 'over';
				rewardMeasure.percentile = 0.23;
				const title = findOption(io.inputOptions.optimizationTarget, ["rewardMeasure", "statistic"]).options.find(o => o.name == rewardMeasure.statistic).title;
				result = getStatisticTitle(io, optimizationTarget, title, false);
				expect(result).to.equal('CTE over 23rd Percentile');
			})
		})
	}
}
testScheduler.register(new StatisticTitleTests());