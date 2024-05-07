import {DensityHighchartsExtender} from "./density.hc.extender";
import {HighchartsComponent} from "../highchartsComponent";
import {getPercentileColorAndOpacity} from '../dataTemplates/highchartDataTemplate';
import {getPercentileSecondaryYAxis} from "../dataTemplates/cdfTemplate";
import * as ReactDOMServer from 'react-dom/server';
import {getFullPercentileValues} from "../chartUtils";
import {CdfTooltip} from '../internal-components/tooltips';
import {getSeriesData} from '../dataTemplates/cdfTemplate'
import {StepPattern} from 'stores/queryResult';
import { HighchartsExtender } from "./highchartsExtender";
import {i18n} from 'stores';
import { RawIntlProvider } from "react-intl";

export class CDFChartHighchartsExtender extends DensityHighchartsExtender(HighchartsExtender) {
    constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
        super(chartComponent, highchartsOptions, true)

        // Need to access before data is set on the chartComponent, so let's store a reference.
        this.reset(highchartsOptions);
    }

    originalSeriesData;
	showYAxisCrosshair = true;

	/**
	 * Sets the data of the chart.
	 * @param highchartsOptions   The HighchartsOptions containing the new data
	 */
	reset(highchartsOptions: HighchartsOptions) {
		this.originalSeriesData = highchartsOptions.originalSeriesData;
	}

    /**
     * Adds callback methods to the chart. These callbacks will be fired by HighCharts and allows us to extend the built it functionality.
     * @param {type} chartInit    The object that will be passed to highchart to create chart
     * @returns {undefined}
     */
    addChartCallbacks(chartInit) {
        super.addChartCallbacks(chartInit)

        if (chartInit.yAxis.length > 1) {
            let percentiles = getFullPercentileValues(this.chartComponent.userOptions.percentiles);
            this.addPercentileSecondaryYAxisCallbacks(chartInit.yAxis[1], percentiles);
        }
    }

    /**
     * Updates a chart to reflect a percentiles change.
     * @param percentileValues  the new percentile values.
     */
    setPercentiles(percentileValues) {
        this.setSecondaryAxisPercentileValues(percentileValues);

        if (this.originalSeriesData.length === 1)
            this.setPercentileColor(this.chartComponent.userOptions.colorSet);
    }

    /**
     * Sets the percentile colors
     * @param colorSet  Array of 2 colors to set.
     */
    setPercentileColor(colorSet:string[]) {
        let chart = this.chart;
        const {percentiles: userPercentiles} = this.chartComponent.userOptions;
        let hasCenterPercentile = userPercentiles[userPercentiles.length - 1] === 50;

        const percentiles = getFullPercentileValues(userPercentiles);
        let lastBandX = 0;

        let bandTag = "PercentileColor";

        // Remove any existing plot band
        for (let i = chart.xAxis[0].plotLinesAndBands.length - 1; i >= 0; i--) {
            if (chart.xAxis[0].plotLinesAndBands[i].id.startsWith(bandTag))
                chart.xAxis[0].removePlotBand(chart.xAxis[0].plotLinesAndBands[i].id);
        }

        for (let i = 0; i < percentiles.length && colorSet; i++) {

            let yValue = percentiles[i];
            let lastYValue = -1;

            let value = this.getValueFromPD(0, yValue);

            // Add the percentile bands
            if (i > 0) {
                let colorAndOpacity = getPercentileColorAndOpacity(userPercentiles, i, percentiles.length, colorSet);

                // Remove the center percentile border when the 50% wasn't explictly specified
                // Since these lines are actual border a hack is used to move the bands 1 pixel to cover the previous line.
                let removeLines = (i - 1 === Math.floor(percentiles.length / 2)) && !hasCenterPercentile;

                chart.xAxis[0].addPlotBand({
                    color: "rgba(" + colorAndOpacity.color + ", " + colorAndOpacity.opacity + ")",
                    borderColor: "rgba(255,255,255,1)",
                    borderWidth: removeLines ? 0 : 1,
                    from: lastBandX - (removeLines ? (chart.xAxis[0].toValue(2) - chart.xAxis[0].toValue(1)) : 0),
                    to: value,
                    id: bandTag + chart.xAxis[0].plotLinesAndBands.length.toString()
                });
            }

            lastBandX = value;
            lastYValue = yValue;
        }
    }

    /**
     * Sets the secondary axis percentile values to the provided values.
     * @param chart                 The chart to add the axis to
     * @param percentileValues      The values that should be used for the axis labels.
     */
    setSecondaryAxisPercentileValues(percentileValues) {
        let chart = this.chartComponent.chart;

        if (percentileValues.length > 0) {
            let yAxis = {};
            this.addPercentileSecondaryYAxisCallbacks(yAxis, percentileValues);
            chart.yAxis[1].update(yAxis);
        }
    }

    /**
     * Ads the required callback to the specified axis in order to display percentiles.
     * @param yAxis The axis to udpate
     * @param percentiles   The percentiles to add
     */
    addPercentileSecondaryYAxisCallbacks(yAxis:HighchartsAxisOptions, percentiles:number[]) {
        let _that = this;
        let scaledPercentiles = percentiles.map(p => p / 100);
        yAxis.tickPositioner = function () {
            return _that.tickPositioner(this, scaledPercentiles)
        };

        if (!yAxis.labels)
            yAxis.labels = {};

        yAxis.labels.formatter = function () {
            return _that.labelsFormatter(this, scaledPercentiles, percentiles)}
    }

    /**
     * Highcharts callback that returns the values that should be used for tick marks
     * @param axis          Axis that owns the tick marks
     * @param percentiles   The percentiles from which the labels are to be calculated.
     * @returns {Array}     Tick mark values
     */
    tickPositioner(axis:HighchartsAxisObject, percentiles:number[]) {
        let newValues = [];

        axis.min = axis.chart.yAxis[0].min;
        axis.max = axis.chart.yAxis[0].max;

        // Include only the visible percentiles in the new values
        // Note: the min/max be added to reflect the primary axis range. e.g. after zooming
        // range should still match.
        newValues.push(axis.min);
        for (let i = 0; i < percentiles.length; i++) {
            if (percentiles[i] > axis.min && percentiles[i] < axis.max)
                newValues.push(percentiles[i]);
        }
        newValues.push(axis.max);

        return newValues;
    }

    /**
     * Highcharts label formatter callback to ignore values that are not in the percentile ranges, e.g. 0 and 100 if not specified
     * @param label             The label being formatted
     * @param scaledPercentiles The corresponding scaled decimal percentile values. 0 -1
     * @param percentiles       The percentile values to be rendered on the axis. 0 - 100
     * @returns {string}        The formatted value.
     */
    labelsFormatter(label:{value}, scaledPercentiles:number[], percentiles:number[]):string {
        // add a formatter to avoid showing unwanted values
	    let index = _.findIndex(scaledPercentiles, (p) => p == label.value);
	    return index === -1 ? "" : percentiles[index].toString();
    }


    /**
     * chart click callback. Fired when the chart is clicked.
     * @param {type} event  common event information
     * @returns {undefined}
     */
    chartClick(event) {
    	const xAxis = event.xAxis[0].axis;
	    const yAxis = event.yAxis[0].axis;

	    xAxis.hideCrosshair();
	    yAxis.hideCrosshair();

	    this.showYAxisCrosshair = !this.showYAxisCrosshair;
	    this.showSharedTooltip(xAxis.chart, event, null, null);
    }

	onDrag() {
		this.chart.xAxis[0].hideCrosshair();
		this.chart.yAxis[0].hideCrosshair();
	}



    /**
     * Gets a x axis value from a given percentile density. That is, the x value for the point on the series that intersects y=yValue.
     * @param series The series being examined
     * @param yValue The yValue/PD for which the x value is desired.
     */
    getValueFromPD(seriesIndex, yValue) {
	    const series = this.originalSeriesData[seriesIndex];
	    yValue     = yValue / 100;
	    const {data} = this.chart.series[seriesIndex].userOptions;
	    let insertPosition = _.sortedIndexBy(data as number[][], [null, yValue], (d) => d[1]); // Locate the index of matching y value or insertion index if not found.

    	if (this.isStepEnabled()) {
    		// If the value at the insertion position matches the y value exactly we use the next x value (index + 1) since all
		    // y values come in pairs (first point being start(fake) of horizontal step line and second being the last(real) point). If it doesn't match then use previous x value (index - 1)
		    // which is first point in vertical step line. Essentially step from X1, Y1 to X2, Y2 requires adding an intermediate point at X1, Y2 that needs to be ignored.
		    let index          = insertPosition < data.length && data[insertPosition][1] == yValue ? insertPosition + 1 : Math.max(0, insertPosition - 1);

		    return data[index][0];
	    }
	    else {
		    let lower          = data[insertPosition][1] == yValue ? insertPosition : Math.max(0, insertPosition - 1); // if the value at insertPosition matches the yValue, use it, otherwise the previous index is our lowest
		    let upper          = Math.min(lower + 1, data.length - 1);
		    let weight         = lower == upper ? 0 : (yValue - data[lower][1]) / (data[upper][1] - data[lower][1]); // calculate the weight
		    let value          = (data[lower][0] * (1 - weight)) + (data[upper][0] * weight);

		    return value;
	    }
    }

    /**
     * Load Callback. Fires when the chart is finished loading.
     * @returns {undefined}
     */
    load(chart) {
        super.load(chart);

        if (this.originalSeriesData.length === 1)
            this.setPercentileColor(this.chartComponent.userOptions.colorSet);
    }

    /**
     * Provides the expected/extended functionality for the runPointActions Highchart's method.
     * @param originalFunction  The original Highchart's runPointActions method
     * @param pointer           The pointer object
     * @param e                 The associated event
     * @returns {undefined}
     */
    runPointActions(originalFunction, pointer, e) {
        let chart = pointer.chart;

        if (chart.pointer.hasDragged) {
        	// runPointActions is no longer triggered while dragging.
            //chart.tooltip.hide();
            //chart.axes[0].hideCrosshair();
        }
        else {
            this.showSharedTooltip(chart, e, null, null);
        }
    }

    /**
     * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
     * @param group The point(s) to be included in the tooltip
     * @returns The formatted tooltip string, or false to dismiss.
     */
    toolTipFormatter(group):any {
	    return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><CdfTooltip chart={this.chart} group={group} /></RawIntlProvider>);
    }

    /**
     * Shows a shared customized tooltip.
     * @param chart
     * @param e
     * @param xValue The xValue we care about. Null if not desired
     * @param yValue The yvalue we care about. Null if not desired or to use the current pointer y location.
     * @param value to use when displaying the x or y value in a tooltip.
     */
    showSharedTooltip(chart, e, xValue, yValue, displayValue = null) {
        let _thisClass = this;
        let series = chart.series;
        let textConfig;
        let axis;
        let insidePlotaArea = false;

        chart.tooltip.connInsideTooltip = false;

        if (yValue == null && xValue == null) {
            insidePlotaArea = true;

            if (this.showYAxisCrosshair || this.showYAxisCrosshair == null) {
                yValue = chart.yAxis[0].toValue(chart.inverted ? e.chartX : e.chartY);
            }
            else {
                xValue = chart.xAxis[0].toValue(chart.inverted ? e.chartY : e.chartX);
            }
            chart.tooltip.connInsideTooltip = true;

        }

        if (xValue != null) {
            let displayXValue = insidePlotaArea ? this.getPrecisionFromAxis(xValue, chart.xAxis[0]) : xValue;

            textConfig = {groupName: 'Value', groupValue: displayXValue, items: []};

            // Find the points below and above this x value
	        series.forEach((s) => {
                let lowPoint;
                let highPoint;

                $.each(s.options.data, function (index, point) {

                    if (point[0] >= xValue) {
                        if (index !== 0)
                            lowPoint = s.options.data[index - 1];
                        else
                            lowPoint = point;

                        highPoint = point;
                        return false;
                    }
                });

                let value = NaN;
                // Interpolate the value
                if (lowPoint && highPoint) {
                    let weight = (xValue - lowPoint[0]) / (highPoint[0] - lowPoint[0]);
                    value = 100 * ((lowPoint[1] * (1 - weight)) + (weight !== 0 ? (highPoint[1] * weight) : 0));
                }

                textConfig.items.push({names: s.options.columnCoordinates, value: isNaN(value) ? value : Highcharts.numberFormat(value, 2)});
            });
        }
        else {
            let displayYValue;

            if (insidePlotaArea) {
                displayYValue = Highcharts.numberFormat(yValue*100, 2);
            }
            else {
                // displayYValue = Highcharts.numberFormat(yValue, Math.min(2, HighchartsExtender.decimalPlaces(yValue*100)));
                displayYValue = displayValue != null ? displayValue : yValue*100;
            }

            textConfig = {
                groupName: 'Percentile',
                groupValue: displayYValue,
                items: []
            };

	        series.forEach((s, index) => {
                let value = _thisClass.getValueFromPD(index, yValue*100);
                textConfig.items.push({names: s.options.columnCoordinates, value: this.getPrecisionFromAxis(value, chart.xAxis[0])});
            });
        }

        let plotX = chart.inverted ? chart.plotHeight - (e.chartY - chart.plotTop) : e.chartX - chart.plotLeft;
        let plotY = chart.inverted ? chart.plotWidth - (e.chartX - chart.plotLeft) : e.chartY - chart.plotTop;

        if (xValue != null) {
            axis = chart.xAxis[0];
            axis.drawCrosshair(e, {plotX: plotX});
        }
        else {
            axis = chart.yAxis[0];
            axis.drawCrosshair(e, {plotY: plotY});
        }

        this.refresh(chart.tooltip, textConfig, e);
        chart.tooltip.label.toFront();
    }

    /**
     * Axis label on mouse over callback. Fired when the mouse enters the areas close to the axis label.
     * @params axis         The target axis
     * @params axisLabel    The target label
     * @params e            The associated event
     * @returns {undefined}
     */
    axisLabelOnMouseOver(axis, axisLabel, e) {

        e = this.positionAxisLabelTooltip(axis, axisLabel, e);
        let axisLabelValue = this.parseLocaleFloat(axisLabel.textContent);

        if (axis.coll === 'xAxis') {
            this.showSharedTooltip(axisLabel.chart, e, axisLabelValue, null);
        }
        else if (axis.opposite) {
            this.showSharedTooltip(axisLabel.chart, e, null, axisLabelValue/100, axisLabelValue);
        }
        else {
            this.showSharedTooltip(axisLabel.chart, e, null, axisLabelValue);
        }
        axisLabel.style["font-weight"] = "bold";
    }

    /**
     * Axis label on mouse out callback. Fired when the mouse leaves the areas close to the axis label.
     * @params axis         The target axis
     * @params axisLabel    The target label
     * @params e            The associated event
     * @returns {undefined}
     */
    axisLabelOnMouseOut(axis, axisLabel, e) {
        axisLabel.chart.tooltip.hide();
        axis.chart.yAxis[0].hideCrosshair();
        axis.chart.xAxis[0].hideCrosshair();
        axisLabel.style["font-weight"] = "";
    }

    /**
     * Provides the expected functionality when the mouse leaves a container
     * @param originalFunction  The original Highchart's onContainerMouseMove method
     * @param pointer           The pointer object
     * @param e                 The associated event
     * @returns {undefined}
     */
    onContainerMouseMove(originalFunction, pointer, e) {
        originalFunction.call(pointer, e);

        let chart = pointer.chart;

        if (!chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
            // Ensure the tooltip is dismissed when outside of the plot area.
            if (chart.tooltip.connInsideTooltip) {
                chart.tooltip.hide();
                chart.axes[0].hideCrosshair();
                chart.axes[1].hideCrosshair();
                chart.tooltip.connInsideTooltip = false;
            }
        }
    }

	isBlocked = false;
	wasSkipped = false;
    _fetchCDFData = async (xE) => {
	    if (!this.isBlocked) {
		    this.wasSkipped = false;
		    let {chartComponent} = this;
		    const yAxis     = this.chartComponent.chart.yAxis[0];
		    let yE          = yAxis.getExtremes();

		    this.isBlocked = true;
		    const newChartDataKey = chartComponent.getChartDataKeyFromCurrentState();
		    const data = await chartComponent.highchartsStore.getCdfData(xE.min, xE.max, yE.min, yE.max);

			if (this.chartComponent.isUnmounting)
				return;

		    chartComponent.updateChartData({originalSeriesData: data.series}, newChartDataKey);
		    this.originalSeriesData = data.series;
		    this.updateSeries(data.series);
		    this.isBlocked = false;

		    // Process the current zoom level if requests where skipped. This ensures that the current zoom level is always processed.
		    if (this.wasSkipped) {
			    this._fetchCDFData(this.chartComponent.chart.xAxis[0].getExtremes())
		    }
	    }
	    else {
	        this.wasSkipped = true;
        }
    }

	afterSetExtremes(axis, e) {
    	super.afterSetExtremes(axis, e);

		if (axis.coll === "xAxis") {
			this.chartComponent.syncActions(() => this._fetchCDFData(e))
		}
	}

	isStepEnabled() {
    	return this.chartComponent.userOptions.stepPattern === StepPattern.Vertical;
	}

	updateSeries(newSeries) {
		let {chart, chartComponent} = this;

		for (let i = 0; i < chart.series.length; i++) {
			chart.series[i].setData(getSeriesData(newSeries[i], this.isStepEnabled()), false, false, false);
		}

		chart.redraw(false);
	}
}
