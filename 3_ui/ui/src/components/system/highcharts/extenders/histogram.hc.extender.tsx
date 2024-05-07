import {DensityHighchartsExtender} from "./density.hc.extender";
import {HighchartsExtender} from './highchartsExtender';
import {HighchartsComponent} from '../highchartsComponent';

export class HistogramChartHighchartsExtender extends DensityHighchartsExtender(HighchartsExtender) {

	constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
		super(chartComponent, highchartsOptions, false)
	}

    categories;

    getCategoryBucket(index)
    {
        return this.categories[index] + ";" + this.categories[index + 1];
    }

    /**
     * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
     * @param p The hover point or group of points.
     * @returns The formatted tooltip string, or false to dismiss.
     */
    toolTipFormatter(p): any {

        return false;

        // This was already commented out - NVS - 11/07
        /*
        let hasGroup = p.points;
        let points = hasGroup ? p.points : p.series.points;

        let    text = [
            '<div style="font-size:small; width:auto; white-space:pre; color:rgb(80,80,80)">',
            '<div style="text-anchor:middle;">',
            hasGroup ? 'Distribution Information' : 'Series Identification',
            '</div>',
            '<br>',
            '<div class="hc-left-col" style="width: 100px;"><b>',
            hasGroup ? 'Bucket' : 'Name',
            '</b></div>',
            '<div class="hc-right-col" style="text-align: right; text-anchor:end" dx="120" translate="transform(100, 0)"">',
            hasGroup ? p.points[0].x : p.series.name.replace(/, /g, '<br>'),
            '</div>',
            '<br>',

            '<div style="text-anchor:middle;">',
            'Values',
            '</div>',
            '<br>',

            '<div class="hc-left-col" style="width: 100px;"><b>',
            hasGroup ? 'Name' : 'Bucket',
            '</b></div>',
            '<div class="hc-right-col" style="text-align: right; text-anchor:end; font-weight:bold" dx="120" translate="transform(100, 0)"">',
            'Count',
            '</div>',
            '<br>',

            '<div>',
        ];

        $.each(points, (index, item) => {
            text.push('<div class="hc-left-col" style="width: 100px;"><b>',
                hasGroup ? item.series.name: item.name,
                '</b></div>',
                '<div class="hc-right-col" style="text-align: right; text-anchor:end" dx="120" translate="transform(100, 0)"">',
                Highcharts.numberFormat(item.y, 7),
                '</div>',
                '<br>');
        });

        text.push('</div>');

        return text.join('');
        */
    }

    /**
     * Axis label on mouse over callback. Fired when the mouse enters the areas close to the axis label.
     * @params axis         The target axis
     * @params axisLabel    The target label
     * @params e            The associated event
     * @returns {undefined}
     *
    axisLabelOnMouseOver(axis, axisLabel, e) {

        if (axis.coll === "yAxis")
            return;

        e = this.positionAxisLabelTooltip(axis, axisLabel, e);

        this.showSharedTooltip(axisLabel.chart, axisLabel.textContent, e);

        axisLabel.style["font-weight"] = "bold";
    }*/

    /**
     * Axis label on mouse out callback. Fired when the mouse leaves the areas close to the axis label.
     * @params axis         The target axis
     * @params axisLabel    The target label
     * @params e            The associated event
     * @returns {undefined}
     *
    axisLabelOnMouseOut(axis, axisLabel, e) {
        if (axis.coll === "yAxis")
            return;

        axisLabel.chart.tooltip.hide();
        axisLabel.chart.axes[0].hideCrosshair();
        axisLabel.style["font-weight"] = "";
    }*/

    /**
     * Shows a shared tooltip. Similiar to highchart's base implementation in runPointActions.
     * @param chart
     * @param e
     */
    showSharedTooltip(chart, value, e)
    {
        // temporarily enable shared tooltips to enable highchart calls to work as though we were
        // really in the sharedTooltips mode
        chart.tooltip.shared = true;

        let series = chart.series;
        let kdpoints = [];

        Highcharts.each(series, (s) => {
            Highcharts.each(s.points, (point) =>{
                if (point.x === value)
                    kdpoints.push(point);
            });

        });

        if (kdpoints.length > 0) {
            e.chartX += 10;

            // Crosshair
            Highcharts.each(chart.axes, function (axis) {
                axis.drawCrosshair(e, kdpoints[0]);
                if (axis.cross)
                    axis.cross.toFront();
            });

            chart.tooltip.refresh(kdpoints, e);
            chart.tooltip.label.toFront();
        }

        // Disable shared tooltips to allow for more discrete series interactions
        chart.tooltip.shared = false;
    }

    addChartCallbacks(chartParent) {
        super.addChartCallbacks(chartParent);

        /*
        if (!chartParent.xAxis.labels)
            chartParent.xAxis.labels = {};

        chartParent.xAxis.tickPositions = [];

        if (chartParent.xAxis.categories != null) {
            // Position the tickmarks to be on either side of the data points
            for (let i = 0; i < chartParent.xAxis.categories.length; i++) {
                chartParent.xAxis.tickPositions.push(i - .5);
            }

            // clear the category to allow for dynamic positioning
            let categories = this.categories = chartParent.xAxis.categories;
            chartParent.xAxis.categories = null;


            // map the positions to the actual category value.
            chartParent.xAxis.labels.formatter = function () {
                return categories[this.value + .5]
            }
        }*/
    }

    /**
     * Sets the opacity of all series based on the hover state
     * @param hoverSeries   Series being hovered or null if not in a hover sate
     * @param chart         Chart being updated.
     */
    setSeriesOpacity(hoverSeries:HighchartsSeriesObject, chart:HighchartsChartObject)
    {
        const opacity = hoverSeries ? .25: 1;

        Highcharts.each(chart.series, function (s) {
            // When hovering, lessen the opacity of the series so highlighted points can be more easily seen
            if (s.visible && hoverSeries !== s) {
                s.group.attr({
                    opacity: opacity
                });
            }
        });
    }

    wrapHighchart() {
        super.wrapHighchart();

        let _thisClass = this;

        this.wrap("chart", Highcharts.Series.prototype, 'setState', function (p, state) {
            p.apply(this, [].slice.call(arguments, 1));

            _thisClass.setSeriesOpacity(state === "hover" ? this : null, this.chart);
        })

        // wrap the colorizeItem method which is called to retrieve the colors to include in a legend.
	    // Add a border to the legend items, so the legend item is till visible when opacity is set to 0
        this.wrap("chart", Highcharts.Legend.prototype,  'colorizeItem', function(p, item, visible) {
            let width = Highcharts.pick(item.borderWidth, 1),
            crisp = -(width % 2) / 2;

            p.apply(this, [].slice.call(arguments, 1));

            if (item.legendSymbol) {
                if (visible) {
                    item.legendSymbol.attr({
                        'stroke-width': width,
                        'translateX': crisp,
                        'translateY': crisp,
                        'stroke': item.options.borderColor
                    });
                }
            }
        });

        // Work around code provided by BlackLabel to prevent the x-axis values from shifting
        // When the step/granularity changes and causes the point distances to change.
        this.wrap("chart", Highcharts.Axis.prototype, 'getClosest', function (p) {
            let ret = p.apply(this, [].slice.call(arguments, 1));

            this.origClose = ret;

            // Don't take the point distance into account when setting up the axis translation
            return 0;
        });

        this.wrap("chart", Highcharts.Axis.prototype, 'setAxisTranslation', function (p) {
            p.apply(this, [].slice.call(arguments, 1));

            // Reset the correct point range after the axis translation is setup.
            if (this.isXAxis) {
                this.closestPointRange = this.origClose;
            }
        });
    }
}
