import {ButtonGroup} from '@blueprintjs/core';
import * as React from 'react';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {getMarkerObject} from "../../dataTemplates/highchartDataTemplate";
import {bp} from 'components';
import {observer} from 'mobx-react';
import { i18n } from 'stores';

@observer
export class MarkerSizeToolbarItem extends React.Component<ToolbarItemProps, {}> {
	render() {
		const {showMarkers} = this.props.userOptions;
		const { formatMessage } = i18n.intl;
		return (
			showMarkers &&
				<ButtonGroup className="adjust-marker-sizes">
					<bp.Tooltip position={bp.Position.BOTTOM} content={formatMessage({ defaultMessage: 'Increase Marker Size', description: '[hightcharts] Tooltip for increase marker size function'})}>
						<bp.Button
							className={"increase-marker-size"}
							onClick={e => this.adjustMarkerSize(true)}>
							<i className="fa fa-circle"/>
							<i className="fa fa-sort-up"/>
						</bp.Button>
					</bp.Tooltip>

					<bp.Tooltip position={bp.Position.BOTTOM} content={formatMessage({ defaultMessage: 'Reduce Marker Size', description: '[hightcharts] Tooltip for reduce marker size function'})}>
						<bp.Button
							className={"reduce-marker-size"}
							onClick={e => this.adjustMarkerSize(false)}>
							<i className="fa fa-circle"/>
							<i className="fa fa-sort-down"/>
						</bp.Button>
					</bp.Tooltip>
				</ButtonGroup>
		);
	}

	adjustMarkerSize = (increase: boolean) => {
		if (this.props.chartComponent.chart != null) {
			const {chartComponent} = this.props;
			const {chart}          = chartComponent;
			const {showMarkers} = this.props.userOptions;

			let size =  (chart.series[0].options.marker.radius || this.props.userOptions.markerSize || 5) //? (chart.series[0].options.lineWidth || this.props.userOptions.lineWidth || 2) : //chart.series[0].options.marker.radius || 5;

			if (increase)
				size *= 1.2;
			else
				size *= 1 / 1.2;
			this.setMarkerSize(size);
			this.props.onUpdateUserOptions({markerSize: size});
		}
	}

	setMarkerSize(size: number) {
		const {chartComponent} = this.props;
		const {chart}          = chartComponent;

		chart.series.forEach((series: any) => {
			if (!series.userOptions.isRegressionLine)
				series.update(getMarkerObject(size, series.color.substring(series.color.indexOf("(") + 1, series.color.lastIndexOf(","))), false);
		});

		chart.redraw();
	}
}
