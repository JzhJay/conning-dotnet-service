import {AppIcon, bp} from "components";
import type {ToolbarItemProps} from '../highchartsToolbar';
import {appIcons, i18n} from 'stores';
import {observer} from 'mobx-react';
import {AnchorButton, Button, ButtonGroup} from '@blueprintjs/core';
import { getLineMarkerOptions } from "../../dataTemplates/highchartDataTemplate";


@observer
export class LineMarkerToolbarItem extends React.Component<ToolbarItemProps, {}> {

	render() {
		const {chartComponent:{chart:{series}}, chartType} = this.props;
		const showMarkers = this.props.userOptions.showMarkers;
		const disableScatterLine = chartType == "scatter" && ((series.length / 2) * series[0].userOptions.data.length > 1000);
		const { formatMessage } = i18n.intl;
		const lineModeTooltip = disableScatterLine ? formatMessage({ defaultMessage: 'Line Mode is disabled when there are more than 1000 points', description: '[highcharts] Tooltip for marker mode while there are more than 1000 points'}) : formatMessage({ defaultMessage: 'Line Mode', description: '[highcharts] Tooltip for line marker mode'});
		
		return (<ButtonGroup className="marker-line-style">
			<bp.Tooltip position={bp.Position.BOTTOM} content={formatMessage({ defaultMessage: 'Marker Mode', description: '[highcharts] Tooltip for line marker tool'})}>
				<Button className='marker' active={showMarkers}
						onClick={e => this.setLineMarker(true)}>
					<AppIcon icon={appIcons.chart.toolbar.markerStyle}/>
				</Button>
			</bp.Tooltip>

			<bp.Tooltip position={bp.Position.BOTTOM} content={lineModeTooltip}>
				<AnchorButton className={classNames("line")}
				        disabled={disableScatterLine}
						active={!showMarkers}
						onClick={e => !disableScatterLine && this.setLineMarker(false)}>
					<AppIcon icon={appIcons.chart.toolbar.lineStyle}/>
				</AnchorButton>
			</bp.Tooltip>
		</ButtonGroup>);
	}

	setLineMarker = (enableMarker:boolean) => {
		const {chartType, chartComponent:{chart}} = this.props
		const options = getLineMarkerOptions(enableMarker, this.props.chartType, this.props.userOptions.lineWidth)
		options && chart.update(options);
		!enableMarker && chart.redraw(false); // Force a redraw when swithing to line mode. There is a bug in highcharts that renders with boost for the first render even though we tell it not to.
		this.props.onUpdateUserOptions({showMarkers: enableMarker, showLines: chartType === 'line' || !enableMarker})
	}
}
