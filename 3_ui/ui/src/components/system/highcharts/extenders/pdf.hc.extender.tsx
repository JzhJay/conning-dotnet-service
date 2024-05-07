import {DensityHighchartsExtender} from './density.hc.extender'
import {getPercentileSecondaryXAxis} from "../dataTemplates/pdfTemplate";
import * as ReactDOMServer from 'react-dom/server';
import {api, i18n} from 'stores';
import {PdfTooltip} from '../internal-components/tooltips';
import {PercentileData} from 'stores/queryResult';
import { HighchartsExtender } from "./highchartsExtender";
import { RawIntlProvider } from 'react-intl';


type Constructor<T> = new(...args: any[]) => T;


export function PDFChartHighchartsExtender<T extends Constructor<HighchartsExtender>>(Base: T) {
	return class extends Base {

    /**
     * Adds callback methods to the chart. These callbacks will be fired by HighCharts and allows us to extend the built it functionality.
     * @param {type} chartInit    The object that will be passed to highchart to create chart
     * @returns {undefined}
     */
    addChartCallbacks(chartInit) {
        super.addChartCallbacks(chartInit)

        if (chartInit.xAxis.length > 1) {
            this.addPercentileSecondaryXAxisCallbacks(chartInit.xAxis[1], chartInit.percentilesData);
        }
    }

    /**
     * Updates a chart to reflect a percentiles change.
     * @param percentileValues  the new percentile values.
     */
    setPercentiles(percentileValues) {
        this.setSecondaryAxisPercentileValues(this.chartComponent.chartData.percentilesData);
    }

    /**
     * Sets the secondary axis percentile values to the provided values.
     * @param percentileValues      The values that should be used for the axis labels.
     */
    setSecondaryAxisPercentileValues(percentilesData:PercentileData[]) {
        let chart = this.chartComponent.chart;

        //TODO look for ways to consolidate code with CDF chart.
        if (percentilesData.length > 0) {
            let xAxis = {};
            this.addPercentileSecondaryXAxisCallbacks(xAxis, percentilesData);
            chart.xAxis[1].update(xAxis);
        }
    }

    /**
     * Ads the required callback to the specified axis in order to display percentiles.
     * @param xAxis The axis to update
     * @param percentiles   The percentiles to add
     */
    addPercentileSecondaryXAxisCallbacks(xAxis:HighchartsAxisOptions, percentilesData: PercentileData[]) {
        let _this = this;
        xAxis.tickPositioner = function () {
            return _this.tickPositioner(this, percentilesData)
        };

        if (!xAxis.labels)
            xAxis.labels = {};

        xAxis.labels.formatter = function () {
            return _this.labelsFormatter(this, percentilesData)}
    }

    /**
     * Highcharts callback that returns the values that should be used for tick marks
     * @param axis          Axis that owns the tick marks
     * @param percentiles   The percentiles from which the labels are to be calculated.
     * @returns {Array}     Tick mark values
     */
    tickPositioner(axis:HighchartsAxisObject, percentilesData:PercentileData[]) {
        let newValues = [];

        axis.min = axis.chart.xAxis[0].min;
        axis.max = axis.chart.xAxis[0].max;

        // Include only the visible percentiles in the new values. xValues on the primary axis map to a given percentile
        // so we also use xValues on this axis but show the corresponding percentile label through the label formatter.
        // Note: the min/must be added to reflect the primary axis range. e.g. after zooming
        // range should still match.
        newValues.push(axis.min);
        for (let i = 0; i < percentilesData.length; i++) {
            if (percentilesData[i].xValue > axis.min && percentilesData[i].xValue < axis.max)
                newValues.push(percentilesData[i].xValue);
        }
        newValues.push(axis.max);

        return newValues;
    }

    /**
     * Highcharts label formatter callback to ignore values that are not in the percentile ranges, e.g. 0 and 100 if not specified
     * @param label         The label being formatted
     * @param percentiles   The percentile values on the axis
     * @returns {string}    The formatted value.
     */
    labelsFormatter(label:{value}, percentilesData: PercentileData[]):string {
        // add a formatter to avoid showing unwanted values
        let foundIndex = -1;
        let value = label.value;

        $.each(percentilesData, function (index, percentileData) {
            if (value === percentileData.xValue) {
                foundIndex = index;
                return false;
            }
        })

        // show the actual percentile
        return foundIndex === -1 ? "" : percentilesData[foundIndex].percentile.toString();
    }


    /**
     * Axis label on mouse over callback. Fired when the mouse enters the areas close to the axis label.
     * Only functional for the secondary x-axis when there is a single series
     * @params axis         The target axis
     * @params axisLabel    The target label
     * @params e            The associated event
     * @returns {undefined}
     */
    axisLabelOnMouseOver(axis, axisLabel, e) {

        if (!axis.isXAxis || !axis.opposite)
            return;

        e = this.positionAxisLabelTooltip(axis, axisLabel, e);

        let chart = axis.chart;
        let plotX = chart.inverted ? chart.plotHeight - (e.chartY - chart.plotTop) : e.chartX - chart.plotLeft;

        axis = chart.xAxis[0];
        axis.crosshair = {width: 2};
        axis.drawCrosshair(e, {plotX: plotX});
        axis.crosshair = false;

        // Find the percentile data to show
        let percentileData = null;
        Highcharts.each(this.chartComponent.chartData.percentilesData, function (pD) {
            if (pD.percentile === parseFloat(axisLabel.textContent)) {
                percentileData = pD;
                return false;
            }
        });

        this.refresh(chart.tooltip, percentileData, e);

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

        if (axis.coll === "yAxis" || !axis.opposite)
            return;

        axisLabel.chart.tooltip.hide();
        axis.chart.xAxis[0].hideCrosshair();
        axisLabel.style["font-weight"] = "";
    }

    /**
     * Extend existing highchart methods/functionality by wrapping the methods
     */
    wrapHighchart() {
        super.wrapHighchart();

        //wrap the area series drawLegendSymbol so it draws a line marker.
        this.wrap("chart", Highcharts.seriesTypes.area.prototype, "drawLegendSymbol", function (p, legend, item) {
	        Highcharts.seriesTypes.line.prototype.drawLegendSymbol.call(this, legend);
        });
    }

    /**
     * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
     * @returns the formatted tooltip string
     */
    toolTipFormatter(p):any {
	    return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><PdfTooltip point={p} chart={this.chart} getPrecisionFromAxis={this.getPrecisionFromAxis} /></RawIntlProvider>)
    }

	afterSetExtremes(axis, e) {
    	super.afterSetExtremes(axis, e);
		axis.chart.hoverPoints && axis.chart.hoverPoints.forEach(p => p.onMouseOut());
	}
}
}
