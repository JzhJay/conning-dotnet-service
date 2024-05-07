import type {ToolbarItemProps} from '../highchartsToolbar';
import {observer} from 'mobx-react';
import {Button} from '@blueprintjs/core';
import {bp} from 'components'
import {i18n} from 'stores';

@observer
export class InvertToolbarItem extends React.Component<ToolbarItemProps, {}> {
	render() {
		const {isInverted} = this.props.userOptions;

		return <bp.Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({ defaultMessage: 'Toggle Inversion', description: '[highcharts] Toolbar function - Inverse horizontal and vertical axis in chart' })}>
			<Button active={isInverted}
			              className="invert"
			              icon="pivot-table"
			              disabled={this.props.chartType == "beeswarm" }
			              onClick={e => this.props.chartComponent.toggleInversion()}/>
		</bp.Tooltip>

	}
}
