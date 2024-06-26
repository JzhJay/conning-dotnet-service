import * as React from 'react';
import type {ToolbarItemProps} from '../highchartsToolbar';
import {bp, IconButton} from 'components'
import {IO, i18n} from 'stores';
import {Popover, Button, ButtonGroup, Position, PopoverInteractionKind, Menu, MenuItem, MenuDivider, IconName} from '@blueprintjs/core';
import {appIcons} from "../../../../../stores/site/iconography/icons";
import * as css from './ChartMenuToolbarItem.css';

export class ChartMenuToolbarItem extends React.Component<ToolbarItemProps, {}> {
	constructor(props, state) {
		super(props, state);
	}

	print = () => {
		this.props.chartComponent.chart.print();
	}

	exportChart = (type) => {
		const {chart} = this.props.chartComponent;
		this.props.chartComponent.chart.legend.options.symbolPadding = 5;
		!(window["jsPDF"]) && (window["jsPDF"] = require('highcharts/lib/jspdf.js'));
		!(window["svg2pdf"]) && (window["svg2pdf"] = require('highcharts/lib/svg2pdf.js'));
		chart.exportChartLocal({type: type, sourceHeight: chart.chartHeight, sourceWidth: chart.chartWidth});
	}

	render() {
		const {chartType} = this.props;

		return (
			<ButtonGroup className="chart-menu-toolbar-item">
				<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.FILE_CTRL.PRINT}>
					<Button icon={appIcons.chart.toolbar.print.name as IconName} onClick={this.print} />
				</bp.Tooltip>
				<bp.Tooltip position={bp.Position.BOTTOM} content={i18n.common.FILE_CTRL.DOWNLOAD}>
					<Popover position={Position.BOTTOM}
					         interactionKind={PopoverInteractionKind.CLICK}
					         content={<Menu>
						         <bp.MenuDivider title={i18n.common.FILE_CTRL.IMAGE} />
						         <MenuItem text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.PNG)} onClick={() => {this.exportChart(null)}}/>
						         <MenuItem text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.JPEG)} onClick={() => {this.exportChart("image/jpeg")}}/>
						         <MenuItem text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.SVG)} onClick={() => {this.exportChart('image/svg+xml')}}/>
						         <bp.MenuDivider/>
						         <MenuItem disabled={chartType == "scatter" || chartType == "efficientFrontier"} text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.PDF)} onClick={() => {this.exportChart('application/pdf')}}/>
								 <MenuItem disabled={chartType != "efficientFrontier"} text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.CSV)} onClick={() => {IO.exportEvaluations(this.props.queryResult as IO, this.props.userOptions)}}/>
					         </Menu>}>
						<IconButton  icon={appIcons.investmentOptimizationTool.download} target="download"/>
					</Popover>
				</bp.Tooltip>
			</ButtonGroup>);
	}
}
