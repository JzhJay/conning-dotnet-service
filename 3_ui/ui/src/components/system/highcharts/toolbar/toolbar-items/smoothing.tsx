import { FormattedMessage } from 'react-intl';
import {AppIcon, bp} from 'components';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {getHistogramSeriesData, getGranularityFromIndex} from "../../dataTemplates/histogramTemplate"
import {getFullPercentileValues} from "../../chartUtils";
import {api, appIcons, i18n} from 'stores';
import {toJS} from 'mobx';
import {DropdownCycleButton} from '../../../../widgets';
import {Menu, MenuItem, Button} from '@blueprintjs/core';
import {observer} from 'mobx-react';

@observer
export class SmoothingToolbarItem extends React.Component<ToolbarItemProps, {}> {
	degreeOfSmoothing: Array<number>;
	smoothLevelLabel = {
		coarsest: i18n.intl.formatMessage({
			defaultMessage: 'Coarsest',
			description: '[highcharts] Smooth level text - coarsest for chart rendering'
		}),
		coarse: i18n.intl.formatMessage({
			defaultMessage: 'Coarse',
			description: '[highcharts] Smooth level text - coarse for chart rendering'
		}),
		medium: i18n.intl.formatMessage({
			defaultMessage: 'Medium',
			description: '[highcharts] Smooth level text - medium for chart rendering'
		}),
		fine: i18n.intl.formatMessage({
			defaultMessage: 'Fine',
			description: '[highcharts] Smooth level text - fine for chart rendering'
		}),
		finest: i18n.intl.formatMessage({
			defaultMessage: 'Finest',
			description: '[highcharts] Smooth level text - finest for chart rendering'
		})
	}

	get icon() { return this.props.chartType == 'histogram' ? appIcons.chart.toolbar.histogram :  appIcons.chart.toolbar.pdf };
		smoothingCache = Array(5);
		
	constructor(props, state) {
		super(props, state);

		if (props.chartType === 'histogram') {
			this.degreeOfSmoothing = [1, 0, -1];
		}
		else {
			this.degreeOfSmoothing = [-2, -1, 0, 1, 2];
		}
	}

	getDegreeOfSmoothingName = (isHist, index) => {
		if (isHist) {    // histogram
			switch (index) {
				case 0:
					return this.smoothLevelLabel.fine;
				case 1:
					return this.smoothLevelLabel.medium;
				case 2:
					return this.smoothLevelLabel.coarse;
			}
		}
		else {           // pdf
			switch (index) {
				case 0:
					return this.smoothLevelLabel.coarsest;
				case 1:
					return this.smoothLevelLabel.coarse;
				case 2:
					return this.smoothLevelLabel.medium;
				case 3:
					return this.smoothLevelLabel.fine;
				case 4:
					return this.smoothLevelLabel.finest;
			}
		}
	}

	// onCycle={() => this.set(null)}

	render() {
		const {icon, props: {chartType, userOptions: {degreeOfSmoothingIndex}}} = this;

		return (
			<div className={bp.Classes.BUTTON_GROUP}>
				<label className={classNames(bp.Classes.LABEL, bp.Classes.CONTROL)}>
					<FormattedMessage defaultMessage="Smoothing:" description="[highcharts] Input label for smooth degree setting" />
				</label>
				<DropdownCycleButton
					className="smoothing"
					title={chartType === 'histogram' ? 
					i18n.intl.formatMessage({ defaultMessage: 'Bin Width', description: '[highcharts] Tooltip for smooth degree setting in histogram chart' }) :
					i18n.intl.formatMessage({ defaultMessage: 'Degree of Smoothing', description: '[highcharts] Tooltip for smooth degree setting in other chart types' })}
					buttonContent={<Button onClick={() => this.set(null)}>
						<AppIcon className="iconic-sm" icon={this.icon}
						      iconicDataAttribute={{"data-degree-of-smoothing": this.degreeOfSmoothing[this.props.userOptions.degreeOfSmoothingIndex]}}/>
					</Button>}
					menu={<Menu>
						{_.map(this.degreeOfSmoothing, (smoothing, index) =>
							<bp.Tooltip key={smoothing.toString()}
							         content={_.capitalize(this.getDegreeOfSmoothingName(chartType == 'histogram', index))}
							          position={bp.Position.RIGHT}>
								<MenuItem onClick={() => this.set(index)}
								          key={index.toString()}
								          text=""
								          active={index == degreeOfSmoothingIndex}
								          labelElement={<AppIcon className="iconic-sm" icon={this.icon} iconicDataAttribute={{"data-degree-of-smoothing": smoothing}}/>}
								/>
							</bp.Tooltip>)}
					</Menu>}/>
			</div>
		)
	}

					/*
				*/

	set = async (index) => {
		let {guid, chartComponent, userOptions, chartType, chartComponent: {chart}} = this.props;

		chartComponent.syncActions(async () => {
			api.site.busy = true;
			chartComponent.busy = true;
			try {

				let smoothingIndex = (index == null) ? (this.props.userOptions.degreeOfSmoothingIndex + 1) % this.degreeOfSmoothing.length : index;

				if (chartType === 'histogram') {
					let selectedGranularity = chart.userOptions.granularity[getGranularityFromIndex(smoothingIndex)];

					let series = selectedGranularity.series.map((s) => {
						return getHistogramSeriesData(s, selectedGranularity.range);
					})

					this.updateSeries(series)

					// Scale the y axis proportionally to the change in bucket/step width
					let extremes            = chart.yAxis[0].getExtremes();
					let previousGranularity = chart.userOptions.granularity[getGranularityFromIndex(this.props.userOptions.degreeOfSmoothingIndex)];
					let scale               = selectedGranularity.range.step / previousGranularity.range.step;
					chart.yAxis[0].setExtremes(extremes.min, extremes.max * scale, true, false);
				}
				else {
					let fullPercentiles = getFullPercentileValues(userOptions.percentiles);

					if (this.smoothingCache[smoothingIndex] != null) {
						this.updateSeries(this.smoothingCache[smoothingIndex]);
					}
					else {
						const data = await chartComponent.highchartsStore.getPdfData(smoothingIndex, fullPercentiles);

						chartComponent.updateChartData({series: data.series});
						this.smoothingCache[smoothingIndex] = data.series;
						this.updateSeries(data.series);
					}
				}

				this.props.onUpdateUserOptions({degreeOfSmoothingIndex: smoothingIndex});
			}
			finally {
				api.site.busy = false;
				chartComponent.busy = false;
			}
		})
	}

	updateSeries = (newSeries) => {
		const {chartComponent: {chart}, chartType} = this.props;

		for (let i = 0; i < chart.series.length; i++) {

			if (chartType === 'histogram')
				chart.series[i].setData(toJS(newSeries[i]), false);
			else
				chart.series[i].setData(toJS(newSeries[i].data), false);
		}

		chart.redraw();

		this.props.chartComponent.extender.adjustStoredAxisLimits();
	}
}
