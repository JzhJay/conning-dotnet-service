import {HighchartsExtender} from "./highchartsExtender";
import {PathSearcher} from '../PathSearcher';
import {PercentileTooltip} from '../internal-components/tooltips';
import * as ReactDOMServer from 'react-dom/server';
import {toJS} from 'mobx';
import {i18n, settings} from 'stores';
import { getSeriesColor } from "../dataTemplates/highchartDataTemplate";
import {RawIntlProvider} from 'react-intl';

export class PercentileChartHighchartsExtender extends HighchartsExtender {

    nextSeriesColor(chart) {
        return `rgb(${getSeriesColor(_.filter(chart.series, (s:any) => s.userOptions.connIsFakeHoverSeriesStickied).length)})`;
    }

    /**
     * Series click callback. Fired when the series is clicked.
     * @param series   The target series
     * @returns {undefined}
     */
    seriesClick(series) {
        if (series.userOptions.connFakeHoverSeriesIndex != null && !series.userOptions.connIsFakeHoverSeriesStickied) {

            let lineColor = this.nextSeriesColor(series.chart);
           
            //NOTE: setting the index explictly to preserve it, not setting an index in the update cause highcharts to use the array index
            // which is most likely a bug. related to https://github.com/highcharts/highcharts/issues/5960
            series.update({index:series.options.index, color: lineColor, lineColor: lineColor, lineWidth: 2, states: {hover: {lineWidth: 2}}});

            // set custom values
            series.userOptions.connIsFakeHoverSeriesStickied = true;

            this.chartComponent.onUpdateUserOptions({paths: [...this.chartComponent.userOptions.paths, this.chartComponent.chartData.rowNames[series.userOptions.connFakeHoverSeriesIndex]]});
        }
    }

    /**
     * Adds a path to the chart
     * @param chart             The chart to add the path to
     * @param individualScenarios The array of individual scenario numbers
     * @param pathIndex         The index of the path being added
     * @param category          The category of the point that should be selected
     * @param stickied          true to sticky the path, false otherwise.
     * @returns {boolean}       True if the path was added, false otherwise.
     */
    addPathSeries(chart, individualScenarios, pathIndex, category, stickied) {
        if (pathIndex >= 0 && pathIndex < individualScenarios.length) {
            let seriesColor = stickied ? this.nextSeriesColor(chart) : "rgba(255, 192, 0, 1)";
            let lineWidth = stickied ? 2 : 4;
            let chartData = this.chartComponent.chartData;

            // Workaround to fix https://github.com/highcharts/highcharts/issues/5960
            // When series are removed it leaves a gap in the sort indices and highcharts will add new series in that gap.
            // But we want new series to always be added as the last series.
            let maxSeriesIndex = -1;
            chart.series.forEach(s => {
                maxSeriesIndex = Math.max(s._i, s.options.index != null ? s.options.index : -1, maxSeriesIndex);
            })

            let seriesAdded = chart.addSeries({
                type: 'line',
                states: {hover: {lineWidth: lineWidth}},
                lineWidth: lineWidth,
                name: chartData.rowAxisNames.map((axisName, i) => `${axisName}:${chartData.rowNames.length > 0 ? chartData.rowNames[pathIndex][i] : ""}`).join(", "),
                color: seriesColor,
                lineColor: seriesColor,
                marker: {symbol:"circle", enabled:true},
                data: toJS(individualScenarios[pathIndex]),
                animation: false,
                index: maxSeriesIndex + 1
            }, true, false);


            if (!stickied) {
                // Set hover information so that the path can be stickied on a click
                seriesAdded.setState("hover");
                chart.hoverSeries = seriesAdded;
                chart.hoverPoint = seriesAdded.points[category];
            }

            seriesAdded.userOptions.connFakeHoverSeriesIndex = pathIndex;
            seriesAdded.userOptions.connIsFakeHoverSeriesStickied = stickied;
        }
        else {
            return false;
        }
    }

    private _pathSearcher : PathSearcher = null;
        pathSearcher(chartData):PathSearcher {
            if (this._pathSearcher == null) {
                this._pathSearcher = new PathSearcher(chartData);
            }

            return this._pathSearcher;
        }


    /**
     * Provides the expected/extended functionality for the runPointActions Highchart's method.
     * @param originalFunction  The original Highchart's runPointActions method
     * @param pointer           The pointer object
     * @param e                 The associated event
     * @param point             Point being hovered or null
     * @returns {undefined}
     */
    runPointActions(originalFunction, pointer, e, point) {
        let chart = pointer.chart,
            chartData = this.chartComponent.chartData;

        e = chart.pointer.normalize(e);

        if (chartData.individualScenarios) {
            let addFakeSeries = true;
            let chartX = chart.inverted ? e.chartY : e.chartX;
            let chartY = chart.inverted ? e.chartX : e.chartY;

            const closestX = Math.max(0, Math.min(Math.round(chart.xAxis[0].toValue(chartX)), chart.xAxis[0].categories.length - 1));
            const closestY = chart.yAxis[0].toValue(chartY);

            const closestIndex = this.pathSearcher(chartData).findClosestPath(closestX, closestY);

            //asyncFindClosestPath(this.chartComponent.props.chartData.chartType, this.chartComponent.props.chartData.id, closestX, closestY)
            //    .then(closestIndex => {
            // Scan the series list to remove unstickied paths and determine if a new path should be added
            // Note: only 1 unstickied path can exist at a time and its always the last series if present, in other words
            // there isn't a need to loop backwards to delete.
            Highcharts.each(chart.series, function (s) {
                if (s.userOptions.connFakeHoverSeriesIndex != null) {
                    if (s.userOptions.connFakeHoverSeriesIndex !== closestIndex) {

                        if (!s.userOptions.connIsFakeHoverSeriesStickied) {
                            s.remove(false);
                        }
                    }
                    else {
                        // reset the hover point in case a mouse out was triggered but we are keeping the existing
                        // rendered series.
                        chart.hoverPoint = s.points[closestX];

                        addFakeSeries = false;
                    }
                }
            })

            if (addFakeSeries) {
                this.addPathSeries(chart, chartData.individualScenarios, closestIndex, closestX, false);
            }
//            });

        }

        chart.tooltip.hide();
        chart.axes[0].hideCrosshair();
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

        if (!chart.hoverSeries || !chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
            // If there is no hover series set nor are we in a container then unsticked paths should be removed.
            Highcharts.each(chart.series, function (s) {
                if (s.userOptions.connFakeHoverSeriesIndex != null) {
                    if (!s.userOptions.connIsFakeHoverSeriesStickied) {
                        s.remove(false);
                    }
                }
            })
        }
    }

    /**
     * Update the chart stickied paths to reflect the state of the provided showPathList.
     * @param list  The showPathList which indicates the paths that should be sticked.
     */
    updateChartToMatchShowPathList(list) {
        let chart = this.chartComponent.chart;

        // Add new series
        for (let i = 0; i < list.length; i++) {
            let path = list[i];

            let foundSeries = false;
            Highcharts.each(chart.series, function (s) {
                if (s.userOptions.connFakeHoverSeriesIndex != null) {
                    if (s.userOptions.connFakeHoverSeriesIndex === path) {
                        foundSeries = true;
                    }
                }
            })

            if (!foundSeries) {
                this.addPathSeries(chart, this.chartComponent.chartData.individualScenarios, path, -1, true);
            }
        }

        // Remove old series that were not specified in the new list
        for (let seriesIndex = chart.series.length - 1; seriesIndex >= 0; seriesIndex--) {
            let series = chart.series[seriesIndex];

            if (series.userOptions.connFakeHoverSeriesIndex != null) {

                let foundSeries = false;
                for (let i = 0; i < list.length; i++) {
                    if (series.userOptions.connFakeHoverSeriesIndex === list[i]) {
                        foundSeries = true;
                    }
                }

                if (!foundSeries)
                    series.remove(false);
            }
        }
        chart.redraw();
    }

    /**
     * Sets the percentile colors
     * @param colorSet          Array of 2 colors to set.
     */
    setPercentileColor(colorSet:string[]) {
        let chart = this.chartComponent.chart;
        let color = [];
        let percentileSeriesCount = 0;

        $.each(chart.series, function (index, series) {
            if (series.userOptions.connFakeHoverSeriesIndex == null && series.name !== 'mean')
                percentileSeriesCount++;
        });

        for (let i = 0; i < percentileSeriesCount; i++) {
            let series = chart.series[i];

            if (i < percentileSeriesCount / 2) {
                color = colorSet[0].split(",");
            }
            else
                color = colorSet[1].split(",");

            series.update({color: "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + series.color.split(",")[3]});
        }
    }

    /**
     * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
     * @param group The point(s) to be included in the tooltip
     * @returns The formatted tooltip string, or false to dismiss.
     */
    toolTipFormatter(group):any {
        if (group.points == null) {
            return false;
        }

	    return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><PercentileTooltip group={group} chart={this.chart} chartComponent={this.chartComponent} getPrecisionFromAxis={this.getPrecisionFromAxis}/></RawIntlProvider>)
    }

    /**
     * Axis label on mouse over callback. Fired when the mouse enters the areas close to the axis label.
     * @params axis         The target axis
     * @params axisLabel    The target label
     * @params e            The associated event
     * @returns {undefined}
     */
    axisLabelOnMouseOver(axis, axisLabel, e) {

        if (axis.coll === "yAxis")
            return;

        e = this.positionAxisLabelTooltip(axis, axisLabel, e);
        this.showSharedTooltip(axisLabel.chart, e, axisLabel.textContent);

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
        if (axis.coll === "yAxis")
            return;

        axisLabel.chart.tooltip.hide();
        axisLabel.chart.axes[0].hideCrosshair();
        axisLabel.style["font-weight"] = "";
        // axisLabel.style["fill"] = axisLabel.connOnMouseOutRestore.fill;
    }

    /**
     * Shows a shared tooltip. Similiar to highchart's base implementation in runPointActions.
     * @param chart
     * @param e
     */
    showSharedTooltip(chart, e, category) {
        // temporarily enable shared tooltips to enable highchart calls to work as though we were
        // really in the sharedTooltips mode
        chart.tooltip.shared = true;

        let kdpoints = this.findMatchingCategoryPoints(chart, category);

        if (kdpoints.length > 0) {
            e.chartX += 10;

            // Crosshair
            Highcharts.each(chart.axes, function (axis) {
                axis.drawCrosshair(e, kdpoints[0]);
                if (axis.cross)
                    axis.cross.toFront();
            });

            chart.tooltip.refresh(kdpoints, e);
            //this.refresh(chart.tooltip, null, e);
            chart.tooltip.label.toFront();
        }

        // Disable shared tooltips to allow for more discrete series interactions
        chart.tooltip.shared = false;
    }

    drawLegendSymbol(originalFunction, series, legend, item) {
        legend.symbolHeight = legend.fontMetrics.h;

        // If no legend item height was already set, force the height to match the symbol height to make sure there are no overlaps or spaces between percentiles
        if (!item.legendItemHeight)
            item.legendItemHeight = legend.symbolHeight;

        originalFunction.apply(series, [].slice.call(arguments, 2));
    }
}
