import {AnchorButton, ButtonGroup, Menu, MenuItem, Popover, PopoverInteractionKind, Position, Tooltip} from '@blueprintjs/core';
import {setThroughTimeStatisticsObjectSeriesOpacity} from 'components/system/highcharts/dataTemplates/throughTimeStatisticsTemplate';
import {bp} from '../../../../index';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {observer} from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import * as css from './SliderInputToolbarItem.css';

@observer
export class LineOpacityToolbarItem extends React.Component<ToolbarItemProps, {}> {
	input;

	render() {
		const chartType = this.props.chartType;
		let maxOpacity = 1;

		let lineOpacity = this.props.userOptions.lineOpacity;
		if (!_.isNumber(lineOpacity)) {
			lineOpacity = maxOpacity;
		}

		return (
			<span className={css.root}>
				<label><FormattedMessage defaultMessage="Line:" description="[highcharts] Label of adjusting line's opacity" /></label>
				<div>
					<input
						type="range"
						min={0}
						max={maxOpacity}
						step={0.1}
						defaultValue={`${lineOpacity}`}
						ref={input => this.input = input}
						onChange={(e) => this.valueChanged(e.target.value)}
					/>
				</div>
			</span>
		)
	}

	setOpacity = (opacity: number) => {
		const {chartComponent:{chart}, chartType} = this.props;

		this.props.chartComponent.onUpdateUserOptions({lineOpacity: opacity});

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
