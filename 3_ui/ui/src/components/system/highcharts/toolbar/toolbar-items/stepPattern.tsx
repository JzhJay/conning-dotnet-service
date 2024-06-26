import type {ToolbarItemProps} from '../highchartsToolbar';
import {getSeriesData} from '../../dataTemplates/cdfTemplate';
import {StepPattern} from 'stores/queryResult';
import {observer} from 'mobx-react';
import {bp} from 'components';
import {Button, ButtonGroup} from '@blueprintjs/core';
import { AppIcon } from "../../../../widgets/AppIcon";
import { appIcons } from "../../../../../stores/site/iconography/icons";

@observer
export class StepPatternToolbarItem extends React.Component<ToolbarItemProps, {}> {
	render() {
		const {stepPattern} = this.props.userOptions;

		return (
				<ButtonGroup>
					<bp.Tooltip position={bp.Position.BOTTOM} content="Step Pattern">
						<Button className="step-pattern " active={stepPattern == StepPattern.Vertical} onClick={this.switchPattern}>
							<AppIcon className="iconic-sm"  icon={appIcons.chart.toolbar.cdfStepped}/>
						</Button>
					</bp.Tooltip>
					<bp.Tooltip position={bp.Position.BOTTOM} content="Smooth Pattern">
						<Button className="step-pattern" active={stepPattern == StepPattern.Horizontal} onClick={this.switchPattern}>
							<AppIcon className="iconic-sm"  icon={appIcons.chart.toolbar.cdfSmooth}/>
						</Button>
					</bp.Tooltip>
				</ButtonGroup>
)
	}

	switchPattern = () => {
		const stepPattern = this.props.userOptions.stepPattern === StepPattern.Horizontal ? StepPattern.Vertical : StepPattern.Horizontal;

		this.props.onUpdateUserOptions({stepPattern: stepPattern})
		this.updateChart(stepPattern);
	}

	updateChart = (stepPattern: StepPattern) => {
		const {chartComponent: {chart}} = this.props;

		this.props.chartData.originalSeriesData.forEach((s, index) => {
			let newData = getSeriesData(s, stepPattern === StepPattern.Vertical);

			if (chart) {
				chart.series[index].setData(newData, false, false, false);
			}
		});

		chart.redraw(false)
	}
}
