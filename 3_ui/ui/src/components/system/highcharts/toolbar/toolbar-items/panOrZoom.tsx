import type {ToolbarItemProps} from '../highchartsToolbar';
import * as React from 'react';
import {AnchorButton, Button, ButtonGroup} from '@blueprintjs/core';
import {bp} from 'components'
import {observer} from 'mobx-react';
import InlineSVG  from 'react-inlinesvg';
import {i18n} from 'stores';

@observer
export class PanOrZoomToolbarItem extends React.Component<ToolbarItemProps, {}> {
	render() {
		const {userOptions, chartComponent: {extender}} = this.props;
		const disableZoom = !extender || !extender.canZoom;
		const { formatMessage } = i18n.intl;

		return (
			<ButtonGroup className="pan-or-zoom">
				<bp.Tooltip position={bp.Position.BOTTOM} content={formatMessage({
					defaultMessage: 'Pan Mode',
					description: '[Highcharts] Toolbar function - Enable or disable Pan Mode'
				})}>
					{/* todo updated to AppIcon */}
					<Button className="pan"
					        disabled={ disableZoom }
					        active={!disableZoom && userOptions.panOrZoom === 'pan'}
					        onClick={e => this.props.onUpdateUserOptions({panOrZoom: 'pan'})}>
						<InlineSVG src="/images/advise/queryTool/chart-pan-mode.svg"/>
					</Button>
				</bp.Tooltip>

				<bp.Tooltip position={bp.Position.BOTTOM} content={formatMessage({
					defaultMessage: 'Zoom Mode',
					description: '[Highcharts] Toolbar function - Enable or disable Zoom Mode'
				})}>
					<Button className='zoom' active={userOptions.panOrZoom === 'zoom'}
					        disabled={ disableZoom }
					        onClick={e => this.props.onUpdateUserOptions({panOrZoom: 'zoom'})}>
						<InlineSVG src="/images/advise/queryTool/chart-zoom-mode.svg"/>
					</Button>
				</bp.Tooltip>
			</ButtonGroup>);
	}
}
