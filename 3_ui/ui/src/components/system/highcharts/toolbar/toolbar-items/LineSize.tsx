import type {ToolbarItemProps} from '../highchartsToolbar';
import {getMarkerObject} from "../../dataTemplates/highchartDataTemplate";
import {AnchorButton, Button, ButtonGroup} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import {bp} from 'components'
import {i18n} from 'stores';

@observer
export class LineSizeToolbarItem extends React.Component<ToolbarItemProps, {}> {
	render() {
		const {showLines} = this.props.userOptions;
		return (
			showLines &&
			(<ButtonGroup className="adjust-line-sizes">
				<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({ defaultMessage: 'Increase Line Size', description: '[highcharts] Tooltip of increasing line size in Line size Toolbar'})}>
					<Button
						className={"increase-marker-size"}
						onClick={e => this.adjustLineSize(true)}>
						<span>__</span>
						<i className="fa fa-sort-up"/>
					</Button>
				</bp.Tooltip>
				<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.intl.formatMessage({ defaultMessage: 'Reduce Line Size', description: '[highcharts] Tooltip of reducing line size in Line size Toolbar'})}>
					<Button
						className={"reduce-marker-size"}
						onClick={e => this.adjustLineSize(false)}>
						<span>__</span>
						<i className="fa fa-sort-down"/>
					</Button>
				</bp.Tooltip>
			</ButtonGroup>)
		);
	}

	adjustLineSize = (increase: boolean) => {
		if (this.props.chartComponent.chart != null) {
			const {chartComponent} = this.props;
			const {chart}          = chartComponent;
			const {showMarkers}    = this.props.userOptions;

			let size = (chart.series[0].options.lineWidth || this.props.userOptions.lineWidth || 2)
			if (increase)
				size *= 1.2;
			else
				size *= 1 / 1.2;
			this.setLineSize(size, showMarkers);
			this.props.onUpdateUserOptions({lineWidth: size});
		}
	}

	setLineSize(size: number, showMarkers: boolean) {
		const {chartComponent} = this.props;
		const {chart}          = chartComponent;

		// Hack - reset chart type to scatter then back to line to prevent Boost from attempting to fill in line area.
		chart.update({chart: {type: 'scatter'}, plotOptions: {series: {marker: {enabled: false}, lineWidth: 1}}})
		chart.update({chart: {type: 'line'}, plotOptions: {series: {marker: {enabled: showMarkers}, lineWidth: size}}})
	}
}