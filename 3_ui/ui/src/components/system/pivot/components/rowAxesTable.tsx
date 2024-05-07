/// <reference path="../../../../lib/wijmo/controls/wijmo.grid.d.ts" />
import type { PivotTablePartProps } from '../index'
import { DataWindow, AxisType, PivotCoordinateCell, simulationStore} from 'stores';
import { FlexGridWrapperController, FlexGridWrapper, IFlexGrid } from 'components';
import { autorun, action, computed, reaction, observable, makeObservable } from 'mobx';
import {observer} from 'mobx-react';

interface MyProps extends PivotTablePartProps<RowAxesTable> {
	onWheel: React.WheelEventHandler<HTMLElement>;
	onSetComponentInstance: (RowAxesTable) => void;
	getCellData: (row: number, column: number) => any;
	getCell: (row: number, column: number, enableFetch:boolean) => PivotCoordinateCell;
}

@observer
export class RowAxesTable extends React.Component<MyProps, {}> implements IFlexGrid {
    gridOptions = {
		isReadOnly:        true,
		selectionMode:     wijmo.grid.SelectionMode.CellRange,
		headersVisibility: wijmo.grid.HeadersVisibility.Column,
		allowResizing:     wijmo.grid.AllowResizing.None,
		allowDragging:     wijmo.grid.AllowDragging.Columns,
		autoClipboard: false
	};

    @observable rendered = false;

    flexController: FlexGridWrapperController;

    setFlexController = (ctrl) => {
		this.flexController = ctrl;
	}

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed get window() {
		const { windows } = this.props.pivot;

		return windows ? windows.rowWindow : null;
	}

    @computed get columnHeaders() {
		const {queryResult} = this.props;
		return queryResult.pivotMetadata ? queryResult.arrangement.rowAxes.map(a => a.groupName.label) : null;
	}

    componentDidMount() {
		this.props.onSetComponentInstance(this);

		// If we have no axes we still need to say that we rendered
		if (this.columnHeaders.length === 0) {
			this.grid_onInitialized(null);
		}
	}

    componentWillUnmount() {
		this.props.onSetComponentInstance(null); // Any stored reference to this object must be rleased to avoid memory leaks.
		this.grid = null;
	}

    grid: wijmo.grid.FlexGrid;

    render() {
		const { columnHeaders, gridOptions, window, props: { isContextMenuTarget, queryResult: { pivotMetadata: { rowAxes, rows } }, getCellData, ...props } } = this;

		return (
			<div className="row-axes" onWheel={this.props.onWheel}>
				{columnHeaders && window != null ?
				 (rowAxes.length > 0 ?
				  <FlexGridWrapper
					  className={classNames({'is-context-menu-target': isContextMenuTarget})}
					  window={window}
					  gridOptions={gridOptions}
					  getCellData={getCellData}
					  columnHeaders={columnHeaders}
					  key="flexGrid"
					  onController={this.setFlexController}
					  onInitialized={this.grid_onInitialized}
					  clipWidthToContainer={false}
					  rowCount={rows}
					  colCount={rowAxes.length}
					  constrainWidthToContainer={false}
					  constrainHeightToContainer={true}
				  /> :
				  <div key="empty" className="empty-row-axes">
					  <div className="header"></div>
					  <div className="data"></div>
				  </div>)
					: null}
			</div>
		)
	}

    @action grid_onInitialized = (grid: wijmo.grid.FlexGrid) => {
		const { pivotMetadata } = this.props.pivot.queryResult;

		this.grid = grid;

		if (grid != null) {
			grid.alternatingRowStep = 0;

			grid.itemFormatter = (this.grid_itemFormatter);

			grid.select(-1, -1);
		}

		this.rendered = true;
	}

    private grid_itemFormatter = (panel: wijmo.grid.GridPanel, row: number, column: number, cell: HTMLElement) => {
		let unselected = false;
		let allSelected = false;
		let anySelected = false;
		const { props: { queryResult }} = this;

		if (panel.cellType === wijmo.grid.CellType.Cell) {
			// Coordinate Selection Handling
			const coordinate = this.props.getCell(row, column, false) as PivotCoordinateCell;

			if (coordinate) {
				unselected  = !coordinate.anySelected;
				allSelected = coordinate.allSelected;
				anySelected = coordinate.anySelected;
			}

			const className = classNames(cell.className, {
				'last-axis':  queryResult.pivotMetadata.rowAxes.length === column + 1,
				'unselected': unselected, 'all-selected': allSelected, 'any-selected': anySelected
			});

			if (cell.className !== className) {
				cell.className = className;
			}
		}
	}

    autosizeColumns = () => {
		const { grid } = this;

		if (grid != null) {
			grid.deferUpdate(() => {
				const { flexController, flexController: {measureText},
					      window,
					      props: {pivot, getCellData, queryResult: {arrangement}} }           = this;

				// Resize the columns to fit our labels and/or data

				arrangement.rowAxes.forEach((axis, c) => {
					// Use the max of axis name / any axis value
					const gridColumn = grid.columns[c];

					//console.log(`rowAxes before autosizeColumns:  ${gridColumn.width}`)
					gridColumn.width = Math.max(gridColumn.width,
					...flexController.measureTextList(_.map([
													axis.groupName.label,
													// For numeric axes we want to only measure the last item in the list
													...(_.includes([AxisType.scenario, AxisType.time], axis.groupType)
														? [axis.groupMembers[axis.groupMembers.length - 1]]
														: axis.groupName.label == 'Simulation'
														    ? _.map(axis.groupMembers, (m: any) => m.label)
														    : _.map(axis.groupMembers, (m: any) => (m.label != null ? m.label : m.toString())))
												], ))
					);
					//console.log(`rowAxes after autosizeColumns:  ${gridColumn.width}`)

				});

				// This width can be overridden by the PivotTable's autosizePivotParts() method

				flexController.onResize();
			});

			grid.refresh(true);
		}
	}

    refresh() {
		this.grid && this.grid.refresh(false);
	}
}
