import type {ToolbarItemProps} from '../highchartsToolbar';
import {bp} from 'components'
import {observer} from 'mobx-react';
import {AnchorButton} from '@blueprintjs/core';
import {i18n} from 'stores';

@observer
export class ResetZoomButtonToolbarItem extends React.Component<ToolbarItemProps, {}> {
	render() {
		const {chartComponent: {extender}} = this.props;
		const { formatMessage } = i18n.intl;

		return <bp.Tooltip position={bp.Position.BOTTOM} content={formatMessage({
					defaultMessage: 'Reset Zoom Level',
					description: '[Highcharts] Toolbar function - Reset zoom level of chart'
				})}>
			<AnchorButton className="reset-zoom"
			              disabled={!extender || !extender.canResetZoom }
			              onClick={this.props.onResetZoom} text={formatMessage({
							defaultMessage: 'Reset Zoom',
							description: '[Highcharts] Toolbar function - Reset zoom of chart'
						})} />
		</bp.Tooltip>
	}
}

