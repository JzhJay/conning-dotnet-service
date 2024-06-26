import {FormatAxisDrawer} from 'components/system/highcharts/internal-components/FormatAxisDrawer';
import * as React from 'react';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {action, computed, makeObservable, observable} from 'mobx';
import {observer} from 'mobx-react';
import {AppIcon, bp} from 'components';
import {i18n} from 'stores';

@observer
export class FormatAxisPaneToolbarItem extends React.Component<ToolbarItemProps, any> {

	constructor(props) {
		super(props);
		makeObservable(this);
	}

	@observable isTooltipOpen = false;

	@computed get selectedAxis() {
		const chart = this.props.chartComponent.chart;
		const selectedAxes = _.filter(chart.selections, s => !!s?.target?.parentAxis);
		return selectedAxes.length == 1 ? selectedAxes[0].target.parentAxis : null;
	}

	@computed get disabled() {
		const {selectedAxis} = this;
		return !selectedAxis || !this.props.chartComponent.axisDrawer || !FormatAxisDrawer.canModify(selectedAxis);
	}

	render() {
		if (this.disabled) {
			return null;
		}
		return <>
			<bp.Tooltip content={i18n.intl.formatMessage({defaultMessage:'Format Axis', description: '[highcharts] Tooltip for button Format Axis'})} disabled={this.disabled} isOpen={this.isTooltipOpen} onInteraction={action((s,e) => {
				if (!e || e.type == 'focus') {
					return; // block tooltip after drawer close.
				}
				this.isTooltipOpen = s;
			})} >
				<bp.Button icon={<AppIcon icon={FormatAxisDrawer.ICON} />} disabled={this.disabled} onClick={action(() => {
					this.props.chartComponent.axisDrawer.axis = this.selectedAxis;
				})}/>
			</bp.Tooltip>
			<span className={bp.Classes.NAVBAR_DIVIDER}/>
		</>;
	}
}