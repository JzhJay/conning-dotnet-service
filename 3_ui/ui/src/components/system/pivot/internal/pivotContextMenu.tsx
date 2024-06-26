/**
 * Context Menu for the Pivot Control
 *
 * Right-Click Actions:
 *      - When triggered from an axis panel:
 *          - Sort Axis Names
 *              - Ascending
 *              - Descending
 *          - Sort "Price Index" Coordinates
 *              - Ascending
 *              - Descending
 *          - Arrangement
 *             - Flip, All to Rows, All to Columns
 *      - When triggered from the detail table cells (selection)
 *          - Select
 *              - All, Only, Except, With, Without, In
 *          - Arrangement actions from above
 **/

import { appIcons, i18n } from 'stores';
import { bp, QueryContextMenu, AvailableQueryViewMenuItems} from 'components'
import {downloadFile} from 'utility';
import type { PivotPart, Axis, SelectOperation } from 'stores/queryResult';
import type { PivotTablePartProps } from "../pivotTable";
import { observer } from 'mobx-react';
import { AppIcon } from "../../../widgets/AppIcon";
import { queryMessages } from './../../../../stores/i18n/queryMessages';

interface MyProps extends PivotTablePartProps<PivotContextMenu> {
	target?: PivotPart;
	targetAxis?: Axis;
	isTargetHeader?: boolean;
}

@observer
export class PivotContextMenu extends React.Component<MyProps, {}> {
	get flexGrid(): wijmo.grid.FlexGrid {
		const { props: { target, pivot } } = this;

		switch (target) {
			case 'details':
				return pivot.pivotParts.details.grid;
			case 'rows':
				return pivot.pivotParts.rows.grid;
			case 'columns':
				return pivot.pivotParts.columns.grid;
			default: {
				return null;
			}
		}
	}

	componentWillUnmount() {
		this.props.pivot.contextMenuTarget = null;
	}

	render() {
		const {
			pivot,
			pivot: { selectCells, pivotParts, flexGrids, isPivotFullyRendered },
			      query,
			queryResult, queryResult: { pivotMetadata, arrangement }, target, isTargetHeader
		} = this.props;

		if (!pivot || pivot.unmounted || !pivotMetadata || !isPivotFullyRendered) { return null }

		const rowAxesGrid = flexGrids['rows'];
		const columnAxesGrid = flexGrids['columns'];

		const { flexGrid } = this;

		const showSelectionMenuItems = (target === 'details' || target === 'columns' || target === 'rows') && !isTargetHeader && !queryResult.showStatisticsPivot;

		return (<QueryContextMenu location='builder' query={query} currentView="pivot" className={classNames("pivot-context-menu", target)}>
			{showSelectionMenuItems && (<div>
				<bp.MenuDivider title={target == 'columns' ? i18n.intl.formatMessage({ defaultMessage: 'Column Coordinate Selection', description: '[Query] Pivot table context menu function - Column Coordinate Selection'}) : target == 'rows' ? i18n.intl.formatMessage({ defaultMessage: 'Row Coordinate Selection', description: '[Query] Pivot table context menu function - Row Coordinate Selection'}) : i18n.intl.formatMessage({ defaultMessage: 'Pivot Selection', description: '[Query] Pivot table context menu function -Pivot Selection'})} />
				<bp.MenuItem icon='blank' onClick={() => this.selectCells("All")} text={i18n.intl.formatMessage({ defaultMessage: 'All', description: '[Query] Pivot table context menu function - All'})}/>
				{flexGrid && flexGrid.selection.isValid && <>
					<bp.MenuItem icon='blank' onClick={() => this.selectCells("Only")} text={i18n.intl.formatMessage({ defaultMessage: 'Only', description: '[Query] Pivot table context menu function - Only'})}/>
					<bp.MenuItem icon='blank' onClick={() => this.selectCells("Except")} text={i18n.intl.formatMessage({ defaultMessage: 'Except', description: '[Query] Pivot table context menu function - Except'})}/>
					<bp.MenuItem icon='blank' onClick={() => this.selectCells("With")} text={i18n.intl.formatMessage({ defaultMessage: 'With', description: '[Query] Pivot table context menu function - With'})}/>
					<bp.MenuItem icon='blank' onClick={() => this.selectCells("Without")} text={i18n.intl.formatMessage({ defaultMessage: 'Without', description: '[Query] Pivot table context menu function - Without'})}/>
					<bp.MenuItem icon='blank' onClick={() => this.selectCells("In")} text={i18n.intl.formatMessage({ defaultMessage: 'In', description: '[Query] Pivot table context menu function - In'})}/>
					<bp.MenuDivider />
					<bp.MenuItem icon="duplicate" onClick={() => pivot.clipboard.copy(false, target)} text={i18n.intl.formatMessage({ defaultMessage: 'Copy', description: '[Query] Pivot table context menu function - Copy'})}/>
					<bp.MenuItem icon="duplicate" onClick={() => pivot.clipboard.copy(true, target)} text={i18n.intl.formatMessage({ defaultMessage: 'Copy Special', description: '[Query] Pivot table context menu function - Copy Special'})}/>
				</>}
				<bp.MenuDivider />
			</div>).props.children}

			{(target === 'rows' && pivotMetadata.rowAxes.length > 1)
			 || (target === 'columns' && pivotMetadata.columnAxes.length > 1)
			    && (<div>
				<bp.MenuItem onClick={this.sortAxesAscending}
				             icon='sort-asc'
				             text="Sort Ascending"/>
				<bp.MenuItem onClick={this.sortAxesDescending}
				             icon='sort-desc'
				             text="Sort Descending"/>
				<bp.MenuDivider />
			</div>).props.children}

			<bp.MenuItem text={i18n.intl.formatMessage(queryMessages.allToRowsTooltip)}
			             icon={<AppIcon icon={appIcons.queryTool.arrangement.allToRows}/>}
			             onClick={arrangement.allToRows}/>
			<bp.MenuItem text={i18n.intl.formatMessage(queryMessages.swapRowsAndColumnsTooltip)}
			             icon={<AppIcon icon={appIcons.queryTool.arrangement.flip}/>}
			             onClick={arrangement.flip}/>
			<bp.MenuItem text={i18n.intl.formatMessage(queryMessages.allToColumnsTooltip)}
			             icon={<AppIcon icon={appIcons.queryTool.arrangement.allToColumns}/>}
			             onClick={arrangement.allToColumns}/>
			<bp.MenuDivider />

			<bp.MenuItem icon={<AppIcon icon={appIcons.queryTool.download}/>} text={i18n.common.FILE_CTRL.WITH_VARIABLES.DOWNLOAD(i18n.common.FILE_CTRL.CSV)} onClick={() => downloadFile(query.CSVDownloadLinkUrl)}/>
			{!arrangement.isDefault && <bp.MenuDivider/>}
			{!arrangement.isDefault && <bp.MenuItem
				icon='history'
				text={i18n.intl.formatMessage({ defaultMessage: 'Reset Arrangement', description: '[Query] Pivot table context menu function - Reset Arrangement'})}
				onClick={arrangement.reset}/>}

		</QueryContextMenu>)
	}

	sortAxesAscending = () => {
		const { props: { target, queryResult: { arrangement } } } = this;

		if (target === 'columns') {
			arrangement.rearrange({ columnAxes: _.orderBy(arrangement.columnAxes, axis => axis.groupName.label).map(axis => axis.id) });
		}
		else if (target === 'rows') {
			arrangement.rearrange({ rowAxes: _.orderBy(arrangement.rowAxes, axis => axis.groupName.label).map(axis => axis.id) });
		}
	}

	sortAxesDescending = () => {
		const { props: { target, queryResult: { arrangement } } } = this;

		if (target === 'columns') {
			arrangement.rearrange({ columnAxes: _.reverse(_.orderBy(arrangement.columnAxes, axis => axis.groupName.label).map(axis => axis.id)) });
		}
		else if (target === 'rows') {
			arrangement.rearrange({ rowAxes: _.reverse(_.orderBy(arrangement.rowAxes, axis => axis.groupName.label).map(axis => axis.id)) });
		}
	}

	sortCoordinatesAscending = () => {
		//this.props.debug(`Sort ${this.state.targetAxis.groupName.label} coordinates ascending`);
	}

	sortCoordinatesDescending = () => {
		//this.props.debug(`Sort ${this.state.targetAxis.groupName.label} coordinates descending`);
	}

	selectCells = (operation: SelectOperation) => {
		this.props.pivot.selectCells(this.props.target, operation);
	}
}
