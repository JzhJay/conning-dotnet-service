import {AnchorButton, ButtonGroup, Menu, MenuItem, Popover, PopoverInteractionKind, Position, Tooltip} from '@blueprintjs/core';
import {ControlGroup, Label} from '@blueprintjs/core/lib/cjs/components';
import {setThroughTimeStatisticsObjectSeriesOpacity} from 'components/system/highcharts/dataTemplates/throughTimeStatisticsTemplate';
import {GridlinesType} from '../../../../../stores/charting';
import {ClimateRiskAnalysis} from '../../../../../stores/climateRiskAnalysis';
import {appIcons} from '../../../../../stores/site/iconography';
import {AppIcon, bp} from '../../../../index';
import {getHighchartsDistributionsAtHorizonObject} from '../../dataTemplates/distributionsAtHorizonTemplate';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {observer} from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import * as css from './SliderInputToolbarItem.css';

@observer
export class FillOpacityToolbarItem extends React.Component<ToolbarItemProps, {}> {
	input;

	render() {
		const chartType = this.props.chartType;
		let maxOpacity = 1;

		let fillOpacity = this.props.userOptions.fillOpacity;
		if (!_.isNumber(fillOpacity)) {
			fillOpacity = maxOpacity;
		}

		return (
			<span className={css.root}>
				<label><FormattedMessage defaultMessage="Fill:" description="[highcharts] Label of adjusting fill opacity" /></label>
				<div>
					<input
						type="range"
						min={0}
						max={maxOpacity}
						step={`${maxOpacity/10}`}
						defaultValue={`${fillOpacity}`}
						ref={input => this.input = input}
						onChange={(e) => this.valueChanged(e.target.value)}
					/>
				</div>
			</span>
		)
	}

	setOpacity = (opacity: number) => {
		const {chartComponent:{chart}, chartType} = this.props;

		this.props.chartComponent.onUpdateUserOptions({fillOpacity: opacity});

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
