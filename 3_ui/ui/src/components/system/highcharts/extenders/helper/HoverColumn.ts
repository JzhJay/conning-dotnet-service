import { computed, reaction, makeObservable } from 'mobx';
import {IO} from '../../../../../stores/io';
import {getFullPercentileValues} from '../../chartUtils';
import {HighchartsComponent} from '../../highchartsComponent';
import {HighchartsExtender} from '../highchartsExtender';

export class HoverColumn {
	constructor(protected chartComponent:HighchartsComponent) {
        makeObservable(this);

        const io = this.chartComponent.props.chartingResult as IO;
        const {chartType, id, page} = chartComponent.props;

        this._toDispose.push(reaction(() => io.hoverEvalIndex, () => {
			const userOptions = this.chartComponent.userOptions;
			const series = this.chart.series; //.filter(s => s.options.type != "line");
			const hoverName = "hoverPoint";
			//const isHovering =  (series[0].options.data as HighchartsDataPoint[]).find(d => d.name == hoverName) != null;

			// No hover updates when page is offscreen
			if (io.currentPage != page)
				return;

			if (io.hoverEvalIndex == null) {
				// Remove hover point
				series.forEach(s => {
					s.setData((s.options.data as HighchartsDataPoint[]).filter(d => d.name != hoverName).map(p => Object.assign({}, p, {color: null})), false)

					if (s.userOptions.connForceShowInLegend)
						s.update({showInLegend: false, connForceShowInLegend: null}, false);

				})
				this.chart.redraw();
			} else if (page.allowShowHover(id)) {
				const {hoverEvalIndex, evaluations} = io;
				const evaluation                    = evaluations[hoverEvalIndex];
				const displayEvaluations            = io.datasetEvaluations(userOptions).map(e => e.evaluationNumber);
				const matchingCategoryIndex         = displayEvaluations.indexOf(hoverEvalIndex);

				if (chartType == "ioBox") {
					const hoverPercentiles     = evaluation.percentiles;
					const percentileSeries     = series.filter(s => s.name != "mean");

					// Add hover point
					percentileSeries.forEach((s, i) => {
						let colorSplit = s.options.color.split(",");
						colorSplit[3] = parseFloat(colorSplit[3]) * .4 + ")";

						const data: HighchartsDataPoint[] = (s.options.data as HighchartsDataPoint[]).map((p, i) => {
							return Object.assign(
								{},
								p,
								{color: matchingCategoryIndex == i ? null : colorSplit.join(",")})
						});

						s.setData(data.concat([
							{
								x:    data.length,
								low:  hoverPercentiles[this.percentileIndicies[percentileSeries.length - (i + 1)]],
								high: hoverPercentiles[this.percentileIndicies[percentileSeries.length - i]],
								name: hoverName
							}
						]), false);
					});

					// Add mean
					const meanSeries = series.filter(s => s.name == "mean")[0];
					meanSeries.setData((meanSeries.options.data as HighchartsDataPoint[]).concat([{x: meanSeries.options.data.length, y: evaluation.mean, name: hoverName}]), false);
				}
				else if (chartType == "status" || chartType == "assetAllocation") {
					series.forEach((s, i) => {
						let rgb = s.options.color.replace(/[^\d.,]/g, '').split(',');
						rgb[3] = ".4";

						const data: HighchartsDataPoint[] = (s.options.data as HighchartsDataPoint[]).map((p, i) => Object.assign({}, p, {color: matchingCategoryIndex == p.x ? null : "rgba(" + rgb.join(",") + ")"}));

						if (chartType == "assetAllocation") {
							const y = io.allocationsAtLevel(userOptions.assetGroupLevel, evaluation.assetAllocation)[i] * 100
							s.setData(data.concat([
								{
									x:    displayEvaluations.length, // Can't user data.length because of a push optimization that only updates visible points. So there might be holes in the data for newly added points with missing series data.
									y:    y,
									name: hoverName,
								}
							]), false);

							if (y > 0 && s.userOptions.showInLegend == false)
								s.update({showInLegend: true, connForceShowInLegend: true}, false);
						}
						else {
							s.setData(data, false);
						}
					});
				}

				this.chart.redraw();
			}
		}));

        this._toDispose.push(reaction(() => page.canShowHoverPoint, () => {
			const xAxis = this.chart.xAxis[0];
			const categories = xAxis.userOptions.categories;
			const hoverText = chartType == "status" ? "" : "Hover";
			const hasHoverCategory = categories.indexOf(hoverText) != -1;

			if (page.canShowHoverPoint) {
				if (!hasHoverCategory) {
					xAxis.update({categories: categories.concat([hoverText])});
					xAxis.userOptions.connInitialMin = 0;
					xAxis.userOptions.connInitialMax = categories.length;
					xAxis.setExtremes(0, categories.length);
				}
			}
			else {
				if (hasHoverCategory) {
					xAxis.userOptions.connInitialMin = 0;
					xAxis.userOptions.connInitialMax = categories.length - 2;
					xAxis.setExtremes(0, categories.length - 2);
					// setTimeout not strickly required but the axis animation is a lot nicer if we allow the old category to animate out before removing it.
					setTimeout(() => !page.canShowHoverPoint && xAxis.update({categories: categories.slice(0, -1)}), 500);
				}
			}
		}));
    }

	/*
		Maps view percentiles to their corresponding index in the global percentile list which is the union of all percentiles.
	 */
	@computed get percentileIndicies() {
		const io = this.chartComponent.props.chartingResult as IO;
		return getFullPercentileValues(this.chartComponent.userOptions.percentiles).map(p => io.outputControls.percentiles.indexOf(p));
	}

	get chart() {
		return this.chartComponent.chart;
	}

	_toDispose = [];

	cleanup() {
		this._toDispose.forEach(f => f());
	}

}