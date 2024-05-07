import {HighchartsExtender} from "./highchartsExtender";
import {Statistics, StatisticsType, MomentsBox, ChartTargetType } from 'stores/queryResult';
import {HighchartsComponent} from '../highchartsComponent';

type Constructor<T> = new(...args: any[]) => T;


export function DensityHighchartsExtender<T extends Constructor<HighchartsExtender>>(Base: T) {
	return class extends Base {

		constructor(...args: any[]) {
			super(...args)
		}

		moments: MomentsBox = { moment: 4, fontSize: 12 };
		momentsBox = null;
		color: string;
		previousMomentIndex: number = 0;

		/**
		 * Load Callback. Fires when the chart is finished loading.
		 * @returns {undefined}
		 */
		load(chart) {
			super.load(chart);

			if (this.momentsBox != null) {
				this.momentsBox.destroy();
				this.momentsBox = null;
			}
		}

		/**
		 * Draws plot lines for the mean and standard deviation based on the statistics type
		 * @param statisticType StatisticType that specifies which lines to draw
		 * @param statistics    statistic values.
		 */
		setStatistics(statisticType, statistics) {
			let chart = this.chartComponent.chart;
			let lineTag = "Statistics";

			// Remove any existing plot line
			for (let i = chart.xAxis[0].plotLinesAndBands.length - 1; i >= 0; i--) {
				if (chart.xAxis[0].plotLinesAndBands[i].id.startsWith(lineTag))
					chart.xAxis[0].removePlotLine(chart.xAxis[0].plotLinesAndBands[i].id);
			}

			if (statisticType >= StatisticsType.MeanOnly) {
				chart.xAxis[0].addPlotLine({ value: statistics.mean, color: 'black', width: 2, zIndex: 5, id: lineTag + chart.xAxis[0].plotLinesAndBands.length })
			}

			let numSD = 0;
			switch (parseInt(statisticType)) {
				case StatisticsType.MeanAnd1SD:
					numSD = 1;
					break;
				case StatisticsType.MeanAnd2SD:
					numSD = 2;
					break;
				case StatisticsType.MeanAnd3SD:
					numSD = 3;
					break;
			}

			for (let i = 1; i <= numSD; i++) {
				chart.xAxis[0].addPlotLine({
					                           value: statistics.mean + i * statistics.standardDeviation,
					                           color: 'black',
					                           width: 1,
					                           zIndex: 5,
					                           dashStyle: "Dash",
					                           id: lineTag + chart.xAxis[0].plotLinesAndBands.length
				                           })
				chart.xAxis[0].addPlotLine({
					                           value: statistics.mean - i * statistics.standardDeviation,
					                           color: 'black',
					                           width: 1,
					                           zIndex: 5,
					                           dashStyle: "Dash",
					                           id: lineTag + chart.xAxis[0].plotLinesAndBands.length
				                           })
			}
		}

		/**
		 * Destroy the moments box selection border
		 * @param chart The chart being updated
		 */
		destroyMomentsBoxSelection(chart) {
			let destroyed = false;
			$.each(chart.selections, function (index, selection) {
				if (selection.border && selection.target.targetType === ChartTargetType.StatisticsBox) {
					selection.border.destroy();
					chart.selections.splice(index, 1);
					destroyed = true;
					return false;
				}
			});
			return destroyed;
		}

		/**
		 * Redraw the moments box selection border
		 * @param chart The chart being updated
		 */
		redrawMomentsBoxSelection() {
			if (this.destroyMomentsBoxSelection(this.chartComponent.chart)) {
				let selection = { target: { label: this.momentsBox, targetType: ChartTargetType.StatisticsBox } };
				this.chartComponent.extender.drawTargetSelection(this.chartComponent.chart, selection);
				this.chartComponent.chart.selections.push(selection);
			}
		}

		/**
		 *
		 * @param x The intended new x position
		 * @param y The intended new y position
		 * @param save If true, update the moments
		 */
		updateMomentsBoxPosition(x: number, y: number, save: boolean) {
			const bounds = this.momentsBox.div.getBoundingClientRect();
			const newX = Math.min(isNaN(x) || x < 0 ? 0 : x, $(this.chart.container).width() - bounds.width);
			const newY = Math.min(isNaN(y) || y < 0 ? 0 : y, $(this.chart.container).height() - bounds.height);
			this.momentsBox.attr({ x: newX, y: newY });

			if (save) {
				this.moments.x = newX;
				this.moments.y = newY;
			}
		}

		/**
		 * Shows a statistics panel that can be repositioned.
		 * @param moments    Number of moments to display
		 * @param statistics    Statistics object
		 */
		showMomentsBox(moment: number, x: number, y: number, fontSize: number, statistics) {
			this.previousMomentIndex = this.moments.moment

			let chart = this.chartComponent.chart;
			let downX, downY, currentX, currentY, isDragging = false;
			let _thisClass = this;
			this.moments = { moment, x, y, fontSize };

			const component = <MomentsBoxComponent statistics={statistics} moments={this.moments}/>;
			if (!this.momentsBox) {
				const momentsBox = this.momentsBox = chart.renderer.label('', x, y, "callout", null, null, true)
				                                          .attr({ zIndex: 6 })
				                                          .add();

				this.updateMomentsBoxPosition(x, y, true);
				this.chartComponent.onUpdateUserOptions({ moments: this.moments });

				//, "font-size": "12px", fill: "white", "stroke-width": 1, stroke: "black"}).css({cursor: 'move'}).add();
				ReactDOM.render(component, momentsBox.div);

				let mousedown = (e) => {
					e = chart.pointer.normalize(e);
					downX = e.chartX;
					downY = e.chartY;
					currentX = isNaN(momentsBox.x) ? 0 : momentsBox.x;
					currentY = isNaN(momentsBox.y) ? 0 : momentsBox.y;
					isDragging = true;
				}


				Highcharts.addEvent(momentsBox.div, 'mousedown', function (e) {
					mousedown(e);
				});

				Highcharts.addEvent(momentsBox.element, 'mousedown', function (e) {
					mousedown(e);
				});

				// Divert clicks on the table to the actual element
				Highcharts.addEvent(this.momentsBox.div, 'click', (e) => {
					$(momentsBox.element).click();
				});

				Highcharts.addEvent(chart.container, 'mousemove', (e) => {
					if (isDragging) {
						e = chart.pointer.normalize(e);

						this.updateMomentsBoxPosition(currentX + (e.chartX - downX), currentY + (e.chartY - downY), true)

						this.chartComponent.onUpdateUserOptions({ moments: this.moments });

						if (chart.pointer.selectionMarker) {
							chart.pointer.selectionMarker = chart.pointer.selectionMarker.destroy();
						}

						_thisClass.destroyMomentsBoxSelection(chart);
					}
				});

				Highcharts.addEvent(document, 'mouseup', function () {
					isDragging = false;
				});

				let labelTarget = { label: momentsBox, targetType: ChartTargetType.StatisticsBox };
				this.addLabelSelectionCallback(chart, labelTarget);

				this.additionalSelectableTargets.push({ target: labelTarget });
			}
			else {
				ReactDOM.render(component, this.momentsBox.div, function () {
					if (_thisClass.previousMomentIndex !== moment && moment !== 0) {
						_thisClass.updateMomentsBoxPosition(_thisClass.moments.x, _thisClass.moments.y, false);
						_thisClass.redrawMomentsBoxSelection();
					}
				});
			}
			// https://jira.advise-conning.com/browse/WEB-447
			// Hide the moments box when moments === 0
			if (this.moments.moment === 0 && this.momentsBox) {
				this.destroyMomentsBoxSelection(chart);
			}
		}

		getFormattedLegendItem(item, inStack) {
			if (inStack)
				return this.createLegendItem(item.chart, { name: item.options.stack, color: "rgb(0,0,0)", dashStyle: item.options.dashStyle });
			else
				return this.createLegendItem(item.chart, { name: item.name, color: item.color, borderColor: item.options.borderColor, });
		}

		/**
		 * Redraw callback. Called everytime the chart is redrawn. e.g. because of a resizing or zooming.
		 * @param {type} e  redraw event
		 * @returns {undefined}
		 */
		redraw(chart, e) {
			super.redraw(chart, e);
			let _thisClass = this;
			if (_thisClass.momentsBox) {
				_thisClass.updateMomentsBoxPosition(_thisClass.moments.x, _thisClass.moments.y, false);
				_thisClass.redrawMomentsBoxSelection();
			}
		}
	}
}

interface MomentsBoxProps {moments: MomentsBox, statistics: Statistics
}

class MomentsBoxComponent extends React.Component<MomentsBoxProps, {}> {

	renderRow(label, value) {
		// Render negative sign in a separate columns to keep values aligned when a sign is present.
		return <tr key={label}>
			<td>{label}</td>
			<td>{value < 0 ? "-" : ""}</td>
			<td>{Math.abs(value).toPrecision(3)}</td>
		</tr>
	}


	render() {
		const { statistics, moments } = this.props;
		const rows = [
			this.renderRow("Mean", statistics.mean),
			this.renderRow("StdDev", statistics.standardDeviation),
			this.renderRow("Skewness", statistics.skewness),
			this.renderRow("Kurtosis", statistics.kurtosis)]

		return <table className={classNames("moments-box", { hidden: moments.moment === 0 })}>
			<tbody style={{ fontSize: moments.fontSize + "px" }}>
			{_.take(rows, moments.moment)}
			</tbody>
		</table>

	}
}
