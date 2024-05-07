import {ButtonGroup} from '@blueprintjs/core';
import {appIcons, i18n} from 'stores';
import {bp} from 'components'
import type {ToolbarItemProps} from '../highchartsToolbar';
import { IconButton } from "../../../../blueprintjs/IconButton";

export class ZoomButtonsToolbarItem extends React.Component<ToolbarItemProps, {}> {
	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	render() {
		const {chartComponent, chartComponent: {extender}} = this.props;
		const { formatMessage } = i18n.intl;

		return (
			<ButtonGroup className="zoom-buttons">
				<bp.Tooltip position={bp.Position.BOTTOM} content={formatMessage({
					defaultMessage: 'Zoom In',
					description: '[Highcharts] Toolbar function - Zoom in chart'
				})}>
					<IconButton icon={appIcons.chart.toolbar.zoom}
					        disabled={!extender || !extender.canZoom }
					              className="zoom-in"
					              onClick={e => chartComponent.zoomIn()}/>
				</bp.Tooltip>

				<bp.Tooltip position={bp.Position.BOTTOM} content={formatMessage({
					defaultMessage: 'Zoom Out',
					description: '[Highcharts] Toolbar function - Zoom out chart'
				})}>
					<IconButton icon={appIcons.chart.toolbar.zoom} className="zoom-out" iconicDataAttribute={{"data-state": "out"}}
					        disabled={!extender || !extender.canZoom }
					              onClick={e => chartComponent.zoomOut()}/>
				</bp.Tooltip>

			</ButtonGroup>);
	}
}
