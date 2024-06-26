import {AnchorButton, ButtonGroup, Menu, MenuItem, Popover, PopoverInteractionKind, Position, Tooltip} from '@blueprintjs/core';
import {setThroughTimeStatisticsObjectSeriesOpacity} from 'components/system/highcharts/dataTemplates/throughTimeStatisticsTemplate';
import {bp} from '../../../../index';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {observer} from 'mobx-react';
import * as css from './SliderInputToolbarItem.css';

@observer
export class SeriesSwitchToolbarItem extends React.Component<ToolbarItemProps, {}> {
	input;

	render() {
		const chartType = this.props.chartType;
		const colors = this.props.chartComponent.chart.options["colors"] as string[];
		let seriesSwitch = this.props.userOptions.seriesSwitch;
		if (!_.isNumber(seriesSwitch)) {
			seriesSwitch = 0;
		}

		return (
			<span className={css.root}>
				<div>
					<input
						className={css.leftRightSwitch}
						style={{background: `linear-gradient(90deg, ${colors[0]} 10%, ${colors[1]} 90%)`}}
						type="range"
						min={-1}
						max={1}
						step={"0.1"}
						defaultValue={`${seriesSwitch}`}
						ref={input => this.input = input}
						onChange={(e) => this.valueChanged(e.target.value)}
						onDoubleClick={e => {
							this.input.value = 0;
							this.setOpacity(0)
						}}
					/>
				</div>
			</span>
		)
	}

	setOpacity = (seriesSwitch: number) => {
		const {chartComponent:{chart}, chartType} = this.props;
		const {fillOpacity, lineOpacity} = this.props.userOptions;

		this.props.chartComponent.onUpdateUserOptions({seriesSwitch: seriesSwitch});

		// Save the last option set by dropdown so the slider can be synced. This approach is a lot smoother than making the slider a controlled component.
		if (chartType === "throughTimeStatistics") {
			setThroughTimeStatisticsObjectSeriesOpacity(this.props.userOptions, chart.series);
			chart.redraw();
		}
	}

	valueChanged = _.debounce((v) => {
		//this.input.value = value;
		const value = this.input.value;
		this.setOpacity(parseFloat(value));
	}, 10);
}
