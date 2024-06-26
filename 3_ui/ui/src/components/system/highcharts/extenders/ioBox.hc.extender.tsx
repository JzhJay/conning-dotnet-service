import {reaction} from 'mobx';
import {ChartData, ChartDataRef} from '../../../../stores/charting';
import {IO} from '../../../../stores/io';
import {PercentileTooltip} from '../internal-components/tooltips';
import {HighchartsComponent} from '../highchartsComponent';
import * as ReactDOMServer from 'react-dom/server';
import {HoverColumn} from './helper/HoverColumn';
import {PercentileChartHighchartsExtender} from './percentile.hc.extender';
import {i18n} from 'stores';
import { RawIntlProvider } from 'react-intl';

export class IOBoxChartHighchartsExtender extends PercentileChartHighchartsExtender{
    constructor(protected chartComponent:HighchartsComponent, protected highchartsOptions) {
        super(chartComponent, highchartsOptions, false);

	    this.automaticDisplayUnitsEnabled = true;

        this.hoverColumn = new HoverColumn(chartComponent);

	    let _thisClass = this;
	    highchartsOptions.plotOptions.series.dataLabels.formatter = function () {
			// if not a columnRange series, no labels. (had custom series type.)
			if (!!this.series.options.type) { return null; }
			if (this.point.high == this.point.low) { return null; }

			const mean = _.find(_.find(this.series.yAxis.series, series => series.name == "mean")?.data, point => point.category == this.key)?.y || 0;
		    const isHigh = this.y == this.point.high;
			if (isHigh && this.y <= mean) {
				return null;
			}
		    if (!isHigh && this.y >= mean) {
				return null;
			}

			return _thisClass.getPrecisionFromAxis(this.y, this.series.yAxis);
	    };

	    const io = this.chartComponent.props.chartingResult as IO;
	    this._toDispose.push(reaction(() => io.updateCount, io.sequencedUpdate(async () => {
		    if (this.chartComponent.isUnmounting)
			    return;

		    let data      = await chartComponent.highchartsStore.getPrebuiltDataTemplate("ioBox", chartComponent.userOptions);
		    let chartData = (_.values(data)[0] as ChartDataRef).chartData as ChartData;

			console.time("ioBox")
		    //chartComponent.updateChartData(chartData);

		    this.chart.series.forEach((s, i) => {
			    s.setData(chartData.series[i].data, false);
		    })

		    this.chart.xAxis[0].update({categories: chartData.xAxis[0].categories, max: chartData.xAxis[0].categories.length - 1}, false);
		    this.resetToDefaultAxisLimits();

		    this.chart.redraw();
		    console.timeEnd("ioBox")
	    })))
    }

    hoverColumn;

	/**
	 * Provides the expected/extended functionality for the runPointActions Highchart's method.
	 * @param originalFunction  The original Highchart's runPointActions method
	 * @param pointer           The pointer object
	 * @param e                 The associated event
	 * @param point             Point being hovered or null
	 * @returns {undefined}
	 */
	runPointActions(originalFunction, pointer, e, point) {
		return originalFunction.call(pointer, e, point);
	}

	/**
	 * Tooltip formatter callback. Called to format the text of the tooltip. Return false to disable.
	 * @param group The point(s) to be included in the tooltip
	 * @returns The formatted tooltip string, or false to dismiss.
	 */
	toolTipFormatter(group):any {
		return ReactDOMServer.renderToStaticMarkup(<RawIntlProvider value={i18n.intl}><PercentileTooltip group={group} chart={this.chart} chartComponent={this.chartComponent} getPrecisionFromAxis={this.getPrecisionFromAxis}/></RawIntlProvider>)
	}

	axisLabelOnMouseOver(axis, axisLabel, e) {}
	axisLabelOnMouseOut(axis, axisLabel, e) {}

	cleanup() {
		super.cleanup();
		this.hoverColumn.cleanup();
	}

	/**
	 * Point mouse out callback. Fired when the mouse leaves the areas close to the point.
	 * @param point   The target point
	 * @returns {undefined}
	 */
	pointMouseOut(point) {
		this.chart.tooltip.hide();
	}
}
