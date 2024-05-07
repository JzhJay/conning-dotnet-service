import {sendNativeEventToElement, JULIA_TAG, get$Container} from 'test'
import { QueryResult } from "../../../../stores/queryResult/models/QueryResult";
import { queryResultStore } from 'stores';
import { QueryResultStore } from "../../../../stores/queryResult/QueryResultStore";
import {HighchartsComponent} from "../highchartsComponent";
import type { ChartUserOptions } from "../../../../stores/charting/chartComponentModels";
import { GridlinesType, VerticalAxisDirection } from "../../../../stores/charting/chartComponentModels";
import { reactionToPromise, sleep, waitAction, waitCondition } from "../../../../utility/utility";
import * as highchartsToolbarCss from './../../highcharts/toolbar/highchartsToolbar.css';


export function runCommonChartTests(getEnzymeContainer, expect, canUpdatePlotArea, chartType) {
	//Common chart tests
	// it('should display right toolbar', function (done) {
	// 	let moreButton = getEnzymeContainer().find('.more-button');
	//
	// 	if (moreButton.length > 0) {
	// 		// get$Container().find('.highchartsToolbar').get(0).onClick = function () {};
	// 		// sendNativeEventToElement($moreButton.get(0), 'click');
	// 		moreButton.simulate('click');
	// 		expect(get$Container().find('.highchartsToolbar > .right').hasClass('showing')).to.equal(true);
	// 	}
	// 	else
	// 		expect(get$Container().find('.highchartsToolbar > .right')).to.have.length(1);
	//
	// 	done();
	// })

	/*
		the box chart needs longer time to redraw on highcharts 9.
		create a new method to make sure it can got the target element.
	*/
	async function getChart$Element(selection) {
		let $elem = null;
		await waitCondition(() => {
			$elem = get$Container().find(selection);
			return $elem.length > 0;
		});
		return $elem;
	}

	it('should increase font size', async function () {
		this.timeout(60000); // slow in line chart, 29 max time on TeamCity. TODO: need to optimize
		const $increaseFontSizeButton = $('.font-size .increase-font-size');

		let $axisLabel = await getChart$Element('.highcharts-yaxis-labels > text, .highcharts-xaxis-labels > text');
		const beforeFontSize = parseInt($axisLabel.css('fontSize'));

		sendNativeEventToElement($increaseFontSizeButton.get(0), 'click');
		$axisLabel = await getChart$Element('.highcharts-yaxis-labels > text, .highcharts-xaxis-labels > text');

		expect(parseInt($axisLabel.css('fontSize'))).to.be.above(beforeFontSize);
	})

	it('should be able to adjust grid lines', function () {
		let $gridLineButton = $('.grid-lines');

		if ($gridLineButton.length > 0) {

			for (let i = 0; i < 3; i++) {
				sendNativeEventToElement($gridLineButton.get(0), 'click');

				const gridlineDirection = $gridLineButton.find('>svg').attr("data-grid-direction")

				if (gridlineDirection === "horizontal" || gridlineDirection === "both") {
					expect(get$Container().find('.highcharts-yaxis-grid > path').first().css('stroke')).to.not.equal("none");
				}

				if (gridlineDirection === "vertical" || gridlineDirection === "both") {
					expect(get$Container().find('.highcharts-xaxis-grid > path').first().css('stroke')).to.not.equal("none");
				}

				if (gridlineDirection === "none") {
					expect(get$Container().find('.highcharts-xaxis-grid > path').first().css('stroke')).to.equal("none");
					expect(get$Container().find('.highcharts-yaxis-grid > path').first().css('stroke')).to.equal("none");
				}
			}
		}
	})

	if (canUpdatePlotArea) {
		it('should flip vertical axis', async function () {
			this.timeout(60 * 1000); // flipping a line is slow.
			const flipVerticalAxisButton = (await getChart$Element('.verticalAxisDirection')).get(0);

			let areYPositionsIncreasing = async () => {
				let $yAxisLabel = await getChart$Element('.highcharts-yaxis-labels > text');
				return parseInt($yAxisLabel.first().attr("y")) < parseInt($($yAxisLabel.get(1)).attr("y"));
			}

			sendNativeEventToElement(flipVerticalAxisButton, 'click');
			expect(await areYPositionsIncreasing()).to.be.true;

			sendNativeEventToElement(flipVerticalAxisButton, 'click');
			expect(await areYPositionsIncreasing()).to.be.false;
		})

		it('should flip horizontal axis', async function () {
			this.timeout(60 * 1000); // flipping a line is slow.
			const flipHorizontalAxisButton = (await getChart$Element('.horizontalAxisDirection')).get(0);

			let areXPositionsIncreasing = async () => {
				let $xAxisLabel = await getChart$Element('.highcharts-xaxis-labels > text');
				return parseInt($xAxisLabel.first().attr("x")) < parseInt($($xAxisLabel.get(1)).attr("x"));
			}

			sendNativeEventToElement(flipHorizontalAxisButton, 'click');
			expect(await areXPositionsIncreasing()).to.be.false;

			sendNativeEventToElement(flipHorizontalAxisButton, 'click');
			expect(await areXPositionsIncreasing()).to.be.true;
		})

		it('should toggle inversion', async function () {
			this.timeout(10000);

			const toggleInversionButton = $('.invert').get(0);

			let areXPositionsConstant = async () => {
				let $yAxisLabel = await getChart$Element('.highcharts-yaxis-labels > text');
				return parseInt($yAxisLabel.first().attr("x")) === parseInt($($yAxisLabel.get(1)).attr("x"));
			}

			// If the y axis has labels with the same x coordinates we know it is the vertical axis. If it has labels
			// with the same y coordinate then it is the horizontal axis.
			sendNativeEventToElement(toggleInversionButton, 'click');
			expect(await areXPositionsConstant()).to.be.false;

			sendNativeEventToElement(toggleInversionButton, 'click');
			expect(await areXPositionsConstant()).to.be.true;
		})

		it(`should zoom in, out and reset ${JULIA_TAG}`, async function () {
			this.timeout(5000);

			const zoomInButton = $('.zoom-buttons .zoom-in').get(0);
			const zoomOutButton = $('.zoom-buttons .zoom-out').get(0);
			const resetZoom = $('.reset-zoom').get(0);

			let _savedYAxisMax;
			let getYAxisMax = async (valueShouldChange:boolean = true, deep: number = 0) => {

				if (deep > 0) {
					await sleep(50);
				}

				let yAxis = (await getChart$Element('.highcharts-yaxis-labels')).get(0);

				let yAxisLabels = [].slice.call(yAxis.children).map((child) => {
					return parseFloat(child.innerHTML);
				});

				const maxYAxisLabel = _.sortBy(yAxisLabels).pop();
				// console.log(`getYAxisMax = ${maxYAxisLabel}, deep = ${deep}, (${yAxisLabels}/${_savedYAxisMax})`);
				return  _savedYAxisMax = (valueShouldChange && maxYAxisLabel === _savedYAxisMax && deep < 5 ? (await getYAxisMax(valueShouldChange, ++deep)) : maxYAxisLabel);
			}

			const startingYAxisMax = await getYAxisMax();

			// Zoom multi-times make sure the rate changed
			sendNativeEventToElement(zoomInButton, 'click');
			sendNativeEventToElement(zoomInButton, 'click');
			sendNativeEventToElement(zoomInButton, 'click');
			sendNativeEventToElement(zoomInButton, 'click');
			const yAxisMaxAfterZoomIn = await getYAxisMax();
			expect(yAxisMaxAfterZoomIn).to.be.below(startingYAxisMax);

			sendNativeEventToElement(zoomOutButton, 'click');
			sendNativeEventToElement(zoomOutButton, 'click');
			expect(await getYAxisMax()).to.be.above(yAxisMaxAfterZoomIn);

			sendNativeEventToElement(resetZoom, 'click');
			expect(await getYAxisMax(false)).to.be.equal(startingYAxisMax);
		})
	}

	switch (chartType) {
		case "cdf":
		case "box":
		case "pdf":
		case "histogram": {
			testBootstrap(getEnzymeContainer, expect);
			break;
		}
	}
}

export function runSensitivityTests(getEnzymeContainer, expect, chartType) {
	switch (chartType) {
		case "cdf":
		case "pdf":
		case "histogram": {
			testSensitivity(getEnzymeContainer, expect);
			break;
		}
	}
};

export function testPersistence(getEnzymeContainer, expect, renderChart, chartType) {
	it(`common chart changes can be persisted ${JULIA_TAG}`, async function () {
		this.timeout(30000)

		// Update the userOptions with the new values
		let queryResult:QueryResult = getEnzymeContainer().instance().props.queryResult;
		let userOptions:ChartUserOptions = Object.assign({}, getEnzymeContainer().instance().userOptions);
		userOptions.isInverted = true;
		userOptions.fontSize = 20;
		userOptions.highchartsOptions.chart.style.fontSize = "20px"
		userOptions.gridLine = GridlinesType.None;
		userOptions.highchartsOptions.xAxis[0].gridlineWidth = 0;
		userOptions.highchartsOptions.yAxis[0].gridlineWidth = 0;
		userOptions.verticalAxisDirection = "bottom";
		await queryResult.updateUserOptions(chartType, userOptions);

		// Reload the query result from the backend, re-create the chart and verify that the user options were correctly applied.
		let resultStore = new QueryResultStore();
		let qr = await resultStore.loadResult(queryResult.id);
		await qr.loadMetadata();
		let result = await renderChart(qr, chartType);
		let chart = result.find(HighchartsComponent).instance().chart;

		expect(chart.inverted).to.be.equal(userOptions.isInverted, "chart should match persisted inversion");
		expect(parseInt(chart.options.chart.style.fontSize)).to.be.equal(userOptions.fontSize, "chart should match persisted font size");
		expect(chart.options.xAxis[0].gridlineWidth == 0 && chart.options.yAxis[0].gridlineWidth == 0).to.be.equal(true, "chart should match persisted gridlines");
		expect(chart.options.xAxis[0].reversed).to.be.equal(true, "chart should match persisted vertical axis direction");
	})
}

export function testPercentileColor(targetSelector, expect){
	let $percentileColorButton = $('.percentile-colors .color-boxes');

	if ($percentileColorButton.length > 0) {

		for (let i = 0; i < 4; i++) {
			sendNativeEventToElement($percentileColorButton.get(0), 'click');

			let colorButtons = $percentileColorButton.find('> div')
			let colors = colorButtons.map((i, colorButton:any) => {
				let color = colorButton.style.backgroundColor;
				return color.substring(color.indexOf("(") + 1, color.indexOf(")")).replace(/\s/g, "").replace("255,255,255", "none")
			});

			// verify that first and second colors are used for atleast 1 path in chart
			if (colors[0] as any !== "none")
			{
				expect($(get$Container().find(`.highcharts-container > svg ${targetSelector}[fill*="${colors[0]}"]`))).to.have.length.of.at.least(1);
				expect($(get$Container().find(`.highcharts-container > svg ${targetSelector}[fill*="${colors[colors.length - 1]}"]`))).to.have.length.of.at.least(1);
			}
		}

	}
}

export function testMean(expect){
	it('should be able to add means', function () {
		this.timeout(10000);

		let $statsButton = $('.stats');

		if ($statsButton.length > 0) {
			let startingPathCount = get$Container().find('path').length;

			for (let i = 0; i < 3; i++) {
				sendNativeEventToElement($statsButton.get(0), 'click');
				//Should add 2 new lines but might only add 1 if the minimum is fixed thus causing the line to be clipped.
				expect(get$Container().find('path')).to.have.length.of.at.least(startingPathCount + 1);
				startingPathCount = get$Container().find('path').length;
			}
		}
	})
}

export function testMoments(expect){
	it('should match selected moments', function () {
		this.timeout(10000);

		let $momentsButton = $('.moments');

		//TODO: check actual moments: mean, stddev, skewness, kurtosis
		if ($momentsButton.length > 0) {
			for (let i = 0; i <= 4; i++) {
				sendNativeEventToElement($momentsButton.get(0), 'click');
				expect(get$Container().find('.moments-box tr')).to.have.length(i);
			}
		}
	})
}

export function testAreaOpacity(getEnzymeContainer, targetSelector, expect){
	it('should be able to adjust area opacity', function () {
		this.timeout(10000);

		let percentileTextBox = getEnzymeContainer(true).find('.area-opacity > input');
		percentileTextBox.getDOMNode().value = "0";
		percentileTextBox.simulate('change');

		expect(get$Container().find(targetSelector).attr('fill')).to.have.string("0)");

		percentileTextBox.getDOMNode().value = "1";
		percentileTextBox.simulate('change');
		expect(get$Container().find(targetSelector).attr('fill')).to.have.string("1)");

	})
}

export function testBootstrap(getEnzymeContainer, expect){
	it(`should be able to enable bootstrap mode ${JULIA_TAG}`, async function () {
		this.timeout(10000);

		let chartComponent = getEnzymeContainer().find(HighchartsComponent).instance();
		let queryResult:QueryResult = getEnzymeContainer().getElement().props.queryResult;

		await waitAction(() => getEnzymeContainer(true).find('.toggle-bootstrap').at(0).simulate('click'), reactionToPromise(() => queryResult.bootstrapEnabled, true));

		//console.log(getEnzymeContainer().find('.bootstrap-statistics-select .Select-value-label').length)
		//await waitCondition(() => getEnzymeContainer().find('.bootstrap-statistics-select .Select-value-label').length != 0, 1000);

		// Verify defaults
		const {bootstrap, bootstrap:{bootstrapOptions}} = queryResult;
		let bootStrapStatistics = bootstrap.bootstrapStatistics;
		const root = getEnzymeContainer().getDOMNode();

		expect($('.bootstrap-statistic-select .bp3-button-text').text() == (bootStrapStatistics[bootstrapOptions.statistic].label), "should match default statistic").to.be.true;
		expect($('.bootstrap-number-resamples input').val() == `${bootstrapOptions.numberResamples}`, "should match default number of resamples").to.be.true;
		expect($('.bootstrap-resample-size input').val() == `${bootstrapOptions.resampleSize}`, "should match default resampleSize").to.be.true;
		expect($('.bootstrap-seed input').val() == `${bootstrapOptions.seed}`, "should match default seed").to.be.true;

		// Verify view availability - not rendered with charting component
		/*
		expect(getEnzymeContainer().find('.QueryPanel__toolbar .pivot a').hasClass("disabled")).to.equal(true, "pivot should be disabled");

		["box", "histogram", "cdf", "pdf"].forEach((view) => {
			expect(getEnzymeContainer().find(`.QueryPanel__toolbar .${view} a`).hasClass("disabled")).to.equal(false, `${view} should not be disabled`);
		})*/
	})


	it(`should be able to run bootstrap ${JULIA_TAG}`, async function () {
		this.timeout(10000);
		const root = getEnzymeContainer().getDOMNode();
		let chartComponent = getEnzymeContainer().find(HighchartsComponent).instance();
		let getChartData = () => chartComponent.chart.series.map(s => s.userOptions.data);
		let beforeChartData = _.cloneDeep(getChartData());

		//await waitAction(() => getEnzymeContainer().find('.run-bootstrap a').simulate('click'), reactionToPromise(() => chartComponent.busy, false))
		sendNativeEventToElement($('.run-bootstrap button')[0], 'click');
		await waitCondition(() => {
			const updateChartData = getChartData();
			return !_.isEqual(updateChartData, beforeChartData)
		});


		expect(beforeChartData).to.deep.not.equal(getChartData(), "chart data should have been updated");

		// Leave bootstrap mode
		let queryResult:QueryResult = getEnzymeContainer().getElement().props.queryResult;
		await waitAction(() => sendNativeEventToElement($(root).find('.toggle-bootstrap')[0], 'click'), reactionToPromise(() => chartComponent.busy, false));
	})
}

export function testSensitivity(getEnzymeContainer, expect){
	function getChartData() {
		const chartComponent = getEnzymeContainer().find(HighchartsComponent).instance();
		return chartComponent.chart.series.map(s => s.userOptions.data);
	}

	let originalChartData;
	before(function() {
		originalChartData = getChartData();
	});

	it(`should be able to enable sensitivty ${JULIA_TAG}`, async function () {
		this.timeout(10000);

		const queryResult: QueryResult = getEnzymeContainer().getElement().props.queryResult;

		await waitAction(() => getEnzymeContainer(true).find('.toggle-sensitivty').at(0).simulate('click'), reactionToPromise(() => queryResult.sensitivityEnabled, true));

		// Verify defaults
		expect($('.toggle-sensitivty').hasClass('bp3-active')).to.be.true;

		expect($('.sensitivity-column-select .bp3-button-text').text()).equal('Compounding=Annual,Economy=DE,Quarter=2016Q1', 'should select first column as default option');

		await waitCondition(() => $('.sensitivity-reference-mean-input input').val() !== '');

		expect($('.sensitivity-reference-mean-input input').val()).equal('-0.004195823719596592', 'should set reference mean value');

		expect($('.sensitivity-shifted-mean-input input').val()).equal('0', 'should set shifted mean value');

		expect($('.sensitivity-reference-sd-input input').val()).equal('0', 'should set reference standard deviation value');

		expect($('.sensitivity-shifted-sd-input input').val()).equals('0', 'should set shifted standard deviation value');
	});

	it(`should be able to run sensitivity ${JULIA_TAG}`, async function () {
		this.timeout(150000);

		const $columnSelect = $('.sensitivity-column-select .bp3-button-text');
		sendNativeEventToElement($columnSelect.get(0), 'click');

		const optionText = 'Compounding=Continuous,Economy=US,Quarter=2018Q1';
		const $selectOptions = $(`.sensitivity-column-select-popover .bp3-menu-item-label:contains("${optionText}")`);
		sendNativeEventToElement($selectOptions.get(0), 'click');

		await waitCondition(() => $('.sensitivity-column-select .bp3-button-text').text() === optionText);

		expect($('.sensitivity-column-select .bp3-button-text').text()).equal(optionText, `should change option to ${optionText}`);

		expect($('.sensitivity-reference-mean-input input').val()).equal('0.020423604980335706', 'should set reference mean value');

		expect($('.sensitivity-reference-sd-input input').val()).equal('0.008395735060584048', 'should set reference standard deviation value');

		const queryResult : QueryResult = getEnzymeContainer().getElement().props.queryResult;
		const beforeChartData = _.cloneDeep(getChartData());
		const shiftedMeanInput = getEnzymeContainer(true).find('.sensitivity-shifted-mean-input input');
		shiftedMeanInput.getDOMNode().value = '0.03';
		shiftedMeanInput.simulate('change');

		const shiftedSdInput = getEnzymeContainer(true).find('.sensitivity-shifted-sd-input input');
		shiftedSdInput.getDOMNode().value = '0.01';
		shiftedSdInput.simulate('change');

		sendNativeEventToElement($('button.run-sensitivity')[0], 'click');

		await reactionToPromise(() => queryResult.sensitivity.shiftedMean !== null, true);

		expect(queryResult.sensitivity.columnIndex).equal(17, 'should change column index');
		expect(queryResult.sensitivity.shiftedMean).equal(0.03, 'should change shifted mean');
		expect(queryResult.sensitivity.shiftedStandardDeviation).equal(0.01, 'should change shifted standard deviation');
		expect(queryResult.sensitivity.unshiftedMean).equal(0.020423604980335706, 'should change reference mean');
		expect(queryResult.sensitivity.unshiftedStandardDeviation).equal(0.008395735060584048, 'should change reference standard devaition');

		let updateChartData;
		await waitCondition(() => {
			updateChartData = getChartData();
			return !_.isEqual(updateChartData, beforeChartData)
		});

		expect(beforeChartData).to.deep.not.equal(updateChartData, 'chart data should have been updated');
	});

	it(`should be able to close sensitivity ${JULIA_TAG}`, async function () {
		this.timeout(150000);

		const beforeChartData = _.cloneDeep(getChartData());

		// Leave sensitivity mode
		const queryResult : QueryResult = getEnzymeContainer().getElement().props.queryResult;
		await waitAction(() => getEnzymeContainer(true).find('.toggle-sensitivty').at(0).simulate('click'),reactionToPromise(() => queryResult.sensitivityEnabled, false));

		expect($('.toggle-sensitivty').hasClass('bp3-active')).to.be.false;

		let updateChartData;
		await waitCondition(() => {
			updateChartData = getChartData();
			return !_.isEqual(updateChartData, beforeChartData)
		});

		expect(beforeChartData).to.deep.not.equal(updateChartData, 'chart data should have been updated');
		expect(originalChartData).to.deep.equal(updateChartData, 'chart data should have been as same as originalChartData');
	});
}