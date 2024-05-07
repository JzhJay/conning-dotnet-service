/// <reference path="../../../../lib/wijmo/controls/wijmo.grid.d.ts" />

import type {PivotTablePartProps} from '../index'
import {PivotTable} from "../pivotTable";
import {PivotCoordinateCell, AxisType, simulationStore} from 'stores';
import {FlexGridWrapper, FlexGridWrapperController, IFlexGrid} from 'components';
import { reaction, action, autorun, computed, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react'

const MAX_VALUES_TO_MEASURE = 10;

interface MyProps extends PivotTablePartProps<ColumnAxesTable> {
	headerWidth?: number;
	onSetComponentInstance: (ColumnAxesTable) => void;
	getCellData: (row: number, column: number) => any;
	getCell: (row: number, column: number, enableFetch:boolean) => PivotCoordinateCell;
}

@observer
export class ColumnAxesTable extends React.Component<MyProps, {}> implements IFlexGrid {
    gridOptions = {
		selectionMode:     wijmo.grid.SelectionMode.CellRange,
		headersVisibility: wijmo.grid.HeadersVisibility.Row,
		allowDragging:     wijmo.grid.AllowDragging.Rows,
		autoClipboard: false
	}

    @observable emptyColumnAxes_dataWidth: number;
    @observable rendered = false;

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed get window() {
		const {windows} = this.props.pivot;

		return windows ? windows.columnWindow : null;
	}

    flexController: FlexGridWrapperController;

    setFlexController = (ctrl) => {
		this.flexController = ctrl;
	}

    maxColumnWidth: number;

    @computed get rowHeaders() {
		this.maxColumnWidth                                                                     = FlexGridWrapper.DefaultCellWidth;
		const {queryResult, queryResult: {pivotMetadata, pivotMetadata: {columnAxes, rowAxes}}} = this.props;

		return queryResult.pivotMetadata ? queryResult.arrangement.columnAxes.map(a => a.groupName.label) : null;
	}

    componentDidMount() {
		this.props.onSetComponentInstance(this);

		if (this.rowHeaders.length === 0) {
			this.grid_onInitialized(null);
		}
	}

    componentWillUnmount() {
		this.props.onSetComponentInstance(null); // Any stored reference to this object must be rleased to avoid memory leaks.
		this.grid = null;
		this.flexController = null;
	}

    // componentDidUpdate() {
    // 	if (this.props.queryResult.arrangement.columnAxes.length === 0) {
    // 		this.emptyColumnAxes_dataWidth = $(this.pivot.pivotParts.details.node).find(`[wj-part="cells"]`).width();
    // 	}
    // }

    render() {
		const {
			      props: {isContextMenuTarget, headerWidth, onSetComponentInstance, queryResult: {pivotMetadata: {columns, columnAxes}}, getCellData, ...props},
			      rowHeaders, window, emptyColumnAxes_dataWidth, gridOptions
		      } = this;

		return (
			<div className="column-axes">
				{rowHeaders && window != null
					? (columnAxes.length > 0
						? <FlexGridWrapper
						   className={classNames({'is-context-menu-target': isContextMenuTarget})}
						   onController={this.setFlexController}
						   getCellData={getCellData}
						   rowHeaders={rowHeaders}
						   constrainWidthToContainer={false}
						   clipHeightToContainer={false}
						   constrainHeightToContainer={false}
						   rowCount={columnAxes.length > 0 ? columnAxes.length : 1}
						   colCount={columns > 0 ? columns : 1}
						   gridOptions={gridOptions}
						   window={window}
						   onInitialized={this.grid_onInitialized}
					   />
						: <div className="empty-column-axes">
						   <div className="header" style={{width: FlexGridWrapper.RowHeaderWidth * 2}}></div>
						   <div className="data" style={{width: emptyColumnAxes_dataWidth}}></div>
					   </div>)
					: null}
			</div>
		)
	}

    @action grid_onInitialized = (grid: wijmo.grid.FlexGrid) => {
		this.grid = grid;

		if (grid != null) {
			grid.alternatingRowStep = 0;

			grid.itemFormatter = this.grid_itemFormatter;

			grid.select(-1, -1);
		}

		this.rendered = true;
	}

    autosizeColumns = () => {
		const {grid, flexController, props: {pivot, pivot: {pivotParts: {details}}, queryResult, queryResult: {pivotMetadata, pivotMetadata: {columnAxes, axes}}}} = this;
		const {minimumAxisWidth}                                                                                                                      = this.props;

		const measureColumns = () => {
			// Set our column axis row header to the width of our longest axis name
			const labels = _.map(columnAxes, axis => axes[axis].groupName.label);

			if (grid) {
				// Autosize the row headers (axis labels)
				grid.rowHeaders.columns[0].width = _.max([minimumAxisWidth, ..._.map(labels, (label, index) => flexController.measureText(label, true))]);
			}

			// Measure each axis value and take the longest one and use that as our uniform column width
			let measured = flexController ? flexController.measureTextList( _.flatten(_.map(columnAxes, axisId => {
				let axis = axes[axisId];
				// For numeric axes we want to only measure the last item in the list
				return _.includes([AxisType.scenario, AxisType.time], axis.groupType)
					? [axis.groupMembers[axis.groupMembers.length - 1]].toString()
				       : axis.groupName.label == 'Simulation'
					       ? _.map(axis.groupMembers, (m: any) => m.label)
					: _.map(axis.groupMembers, (m: any) => m.label != null ? m.label : m.toString());
			})), false) : [0];

			const {cache} = pivot;
			if (cache) {
				let cells = [];
				for (let r = 0; r < Math.min(pivotMetadata.rows, MAX_VALUES_TO_MEASURE); r++)
					for (let c = 0; c < Math.min(details.grid.columns.length, MAX_VALUES_TO_MEASURE); c++) {
						const cell = cache.getCell(r, c, false);
						cells.push(cell ? cell.detailCell : null)
					}

				// Measure detail cells - but only unique values
				let uniqueValues = _.uniqBy(cells, 'data');

				measured = [...measured, ...uniqueValues.map(c => pivot.formatDetailCell(c)).map(label => details.flexController.measureText(label))];
			}

			const maxColumnWidth = _.max(measured);

			if (maxColumnWidth > this.maxColumnWidth) {
				this.maxColumnWidth = maxColumnWidth;

				// Update the column cells (if we have any)
				if (grid) {
					grid.beginUpdate();
					for (let c = 0; c < grid.columns.length; c++) {
						grid.columns[c].width = maxColumnWidth;
					}
					grid.endUpdate();
				}

				// Update the detail cells
				details.grid.beginUpdate();
				for (let c = 0; c < details.grid.columns.length; c++) {
					details.grid.columns[c].width = maxColumnWidth;
				}
				details.grid.endUpdate();
			}
		}

		if (grid != null) {
			grid.deferUpdate(measureColumns);
			flexController.onResize();
			grid.refresh(true);
		}
		else {
			measureColumns();
			this.emptyColumnAxes_dataWidth = pivot.$nodes.detailsTable.find(`[wj-part="cells"]`).width();
		}
	}

    private grid_itemFormatter = (panel: wijmo.grid.GridPanel, row: number, column: number, cell: HTMLElement) => {
		let unselected  = false;
		let lastAxis    = false;
		let allSelected = false;
		let anySelected = false;

		const {queryResult: {pivotMetadata: {columnAxes}}} = this.props;

		if (panel.cellType === wijmo.grid.CellType.RowHeader) {
			lastAxis = (row + 1 === columnAxes.length)
		}
		else if (panel.cellType === wijmo.grid.CellType.Cell && columnAxes.length === row + 1) {
			lastAxis = true;
		}

		// Coordinate Selection Handling
		const coordinate = this.props.getCell(row, column, false) as PivotCoordinateCell;

		if (coordinate) {
			unselected  = !coordinate.anySelected;
			allSelected = coordinate.allSelected;
			anySelected = coordinate.anySelected;
		}


		const className = classNames(cell.className, {'last-axis': lastAxis, 'unselected': unselected, 'all-selected': allSelected, 'any-selected': anySelected});
		if (cell.className !== className) {
			cell.className = className;
		}
	};

    grid: wijmo.grid.FlexGrid;

    refresh() {
		this.grid && this.grid.refresh(false);
	}
}
