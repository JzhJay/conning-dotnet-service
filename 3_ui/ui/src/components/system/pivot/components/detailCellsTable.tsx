import type { PivotTablePartProps } from '../index'
import { PivotDetailCell, DataFormat, copyToClipboard } from 'stores';
import { SheetClip } from 'utility';
import { FlexGridWrapperController, FlexGridWrapper, IFlexGrid, bp } from 'components';
import { observable, reaction, computed, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';

/// <reference path="../../../lib/wijmo/controls/wijmo.grid.d.ts" />

interface MyProps extends PivotTablePartProps<DetailCellsTable> {
	onSetComponentInstance: (DetailCellsTable) => void;
	getCellData: (row: number, column: number) => any;
	getCell: (row: number, column: number, enableFetch: boolean) => PivotDetailCell;
}

@observer
export class DetailCellsTable extends React.Component<MyProps, {}> implements IFlexGrid {
    @observable grid: wijmo.grid.FlexGrid;
    flexController: FlexGridWrapperController;

    node: Element;

    @observable rendered?: boolean;
    gridOptions = {
		alternatingRowStep: 0,
		autoClipboard: false,
		headersVisibility: wijmo.grid.HeadersVisibility.None,
		allowResizing: wijmo.grid.AllowResizing.None,
		allowDragging: wijmo.grid.AllowDragging.None
	}

	constructor(props) {
		super(props);

        makeObservable(this);
    }

    @computed
	get window() {
		const { windows } = this.props.pivot;

		return windows ? windows.detailWindow : null;
	}

    setFlexController = (ctrl) => {
		this.flexController = ctrl;
	}

    componentDidMount() {
		this.node = ReactDOM.findDOMNode(this) as Element;
		this.props.onSetComponentInstance(this);
	}

    componentWillUnmount() {
		if (this.grid) {
			this.grid.itemFormatter = null
			//this.grid.copying.removeHandler(this.grid_onCopying);
		}

		this.props.onSetComponentInstance(null); // Any stored reference to this object must be rleased to avoid memory leaks.
	}

    render() {
		const { window, gridOptions, props, props: { isContextMenuTarget, queryResult: { pivotMetadata }, onSetComponentInstance } } = this;

		return (
			<div className="detail-cells">
				{pivotMetadata && window &&
				 <FlexGridWrapper
					 className={classNames({'is-context-menu-target': isContextMenuTarget})}
					 gridOptions={gridOptions}
					 getCellData={props.getCellData}
					 window={window}
					 onController={this.setFlexController}
					 rowCount={pivotMetadata.rows}
					 colCount={pivotMetadata.columns}
					 constrainWidthToContainer={false}
					 onInitialized={this.grid_onInitialized}/>
				}
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

    private grid_itemFormatter = (panel: wijmo.grid.GridPanel, row: number, column: number, cell: HTMLElement) => {
		const { pivot } = this.props;
		if (!pivot || !pivot.cache) return;

		// const pivotCell = this.props.getCell(row, column, false);
		// Optimization to pull directly from the cache instead of through getCell() which was 2-5x faster in testing.
		let entry = pivot.cache.getCell(row, column, false);
		let pivotCell = entry && entry.detailCell;

		// 'wj-state-multi-selected'
		const className = classNames(
			'wj-cell',
			pivotCell != null && !IS_PROD ? `format-${DataFormat[pivotCell.format]}` : '',
			{
				'wj-state-selected': cell.classList.contains('wj-state-selected'),
				'wj-state-multi-selected': cell.classList.contains('wj-state-multi-selected'),
				'first-column': column === 0,
				undefined: pivotCell === undefined,
				empty: (pivotCell == null || pivotCell.data == null) && cell.innerHTML == "", // Don't mark cells empty if FlexGrid already has the data on hand.
				unselected: pivotCell != null && pivotCell.data != null && !pivotCell.selected
			}
		);

		if (cell.className !== className) {
			cell.className = className;
		}
	};

    refresh() {
		this.grid && this.grid.refresh(false);
	}
}
