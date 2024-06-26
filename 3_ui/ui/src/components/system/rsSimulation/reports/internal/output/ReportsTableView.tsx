import {bp, ErrorMessage} from 'components';
import {ReportsOutputView} from '../ReportsOutputPage';
import {TableCopier} from 'components/system/userInterfaceComponents/Table/TableCopier';
import {observer} from 'mobx-react';
import * as React from 'react';
import {api, DataFormatNameMapping, i18n} from 'stores';

import * as css from './ReportsTableView.css';

interface headerData {label: string, values: string[]}

@observer
export class ReportsTableView extends React.Component<{view: ReportsOutputView}, any>{

	static COLUMN_HEADERS_DATA_KEY = "columnHeaders";
	static ROW_HEADERS_DATA_KEY = "rowHeaders";
	static DETAIL_DATA_KEY = "detailCells";

	wijmoGrid: wijmo.grid.FlexGrid;
	private _dispose: Function[] = [];

	constructor(props) {
		super(props);
		//makeObservable(this);
	}

	componentWillUnmount() {
		_.forEach(this._dispose, d => d());
	}

	onInitialized = (grid: wijmo.grid.FlexGrid) => {
		this.wijmoGrid = grid;
		this.wijmoGrid.mergeManager = new CustomizeMergeManager();

		const rowAxesLength = this.rowAxesLength;
		if (rowAxesLength == 0) {
			this.wijmoGrid.rowHeaders.columns.splice(0, 1);
		} else {
			_.forEach(_.range(1, rowAxesLength), () => {
				this.wijmoGrid.rowHeaders.columns.push(new wijmo.grid.Column());
			});
			_.forEach(this.wijmoGrid.rowHeaders.columns, column => {
				column.allowResizing = false;
				column.allowDragging = false;
				column.allowSorting = false;
			})
		}
		this.wijmoGrid.autoSizeColumns(null, null, true); // for row headers
		this.wijmoGrid.autoSizeColumns(); // for detail cells and column headers
	}


	get itemSource(): {format: string, data: number}[][] {
		const rtn = [[]];
		const detailCells = _.get<any, string, headerData[]>(this.props.view.viewData, ReportsTableView.DETAIL_DATA_KEY, []);
		_.forEach(detailCells, (cells) => rtn.push([null, ...cells]));
		return rtn;
	}

	get rowHeaders(): headerData[] {
		return _.get<any, string, headerData[]>(this.props.view.viewData, ReportsTableView.ROW_HEADERS_DATA_KEY, [])
	}

	get columnHeaders(): headerData[] {
		return _.get<any, string, headerData[]>(this.props.view.viewData, ReportsTableView.COLUMN_HEADERS_DATA_KEY, [])
	}

	get rowAxesLength(): number {
		return _.size(this.rowHeaders);
	}

	get columnAxesLength(): number {
		return _.size(this.columnHeaders);
	}

	get columnCoordinateLength(): number {
		return Math.max(..._.map(this.columnHeaders, (data) => _.size(data.values)));
	}

	get columns(): any[] {
		const headerData = this.columnHeaders;
		let headerCollection  = [];

		let targetHeader = null;
		_.forEach(headerData, (data) => {
			let headerCell = {
				header: data.label,
				width:25,
				maxWidth: 25,
				allowDragging: false,
				allowResizing: false,
				allowSorting: false
			};
			if (targetHeader) {
				targetHeader["columns"] = [headerCell];
			} else {
				headerCollection.push(headerCell);
			}
			targetHeader = headerCell;
		});

		const maxValueLength = this.columnCoordinateLength;
		_.forEach(_.range(0, maxValueLength), i => {
			targetHeader = null;
			_.forEach(headerData, (data) => {
				let headerCell = {
					header: _.get(data.values, i, ""),
					allowDragging: false,
					allowResizing: false,
					allowSorting: false
				}
				if (targetHeader) {
					targetHeader["columns"] = [headerCell];
				} else {
					headerCollection.push(headerCell);
				}
				targetHeader = headerCell;
			});
			targetHeader.binding = `${i+1}.data`;
			targetHeader.cellTemplate = (ctx:wijmo.grid.ICellTemplateContext ) => {
				const rowIndex = ctx.row.index;
				const colIndex = ctx.col.index;
				if (rowIndex == 0 || colIndex == 0) {
					return '';
				}
				const sourceData = this.itemSource[rowIndex][colIndex];
				const data = sourceData.data;
				const formattingCode = _.get(DataFormatNameMapping, sourceData.format);
				const formatting = _.get(api.queryResultStore.formats, formattingCode);

				let result;
				if (formatting?.precision == null) {
					return isNaN(data) ? data : api.utility.formatNumberWithCommas(data);
				}
				if (!isNaN(data)) {
					let formatted = api.utility.formatNumberWithCommas(data * (formatting.scale ? formatting.scale : 1), formatting.precision);
					if (formatted === "-0") {
						formatted = "0"
					}
					result = formatted;
				}
				else {
					result = data;
				}
				return _.padStart(result, Math.abs(formatting.paddedLength));
			}
		});

		return headerCollection;
	}

	itemFormatter: wijmo.grid.IItemFormatter = (panel, r, c, cell) => {
		// $(cell).attr('data-row-column', `${r}-${c}`);
		switch (panel.cellType) {
			case wijmo.grid.CellType.ColumnHeader:
				$(cell).addClass('wj-align-center');
				$(cell).addClass(c == 0 ? css.headerCellAxis : css.headerCellCoordinate);
				break;

			case wijmo.grid.CellType.RowHeader:
				$(cell).addClass('wj-align-center');
				$(cell).addClass(r == 0 ? css.headerCellAxis : css.headerCellCoordinate);
				const rHeaderData = this.rowHeaders;
				if (r == 0) {
					$(cell).html(rHeaderData[c].label);
				} else {
					$(cell).html(_.get(rHeaderData[c].values, r - 1, ""));
				}
				break;

			case wijmo.grid.CellType.Cell:
				if (r == 0 || c == 0) {
					$(cell).addClass(css.detailCellEmpty);
				} else {
					$(cell).addClass('wj-align-right');
				}
				break;

			case wijmo.grid.CellType.TopLeft:
				$(cell).addClass(css.headerCellAxis);
				$(cell).addClass('wj-align-center');
				if (c == panel.columns.length - 1) {
					const innerDiv = $('<div>').appendTo(cell);
					innerDiv.addClass(css.topLeftCell);
					innerDiv.html(this.columnHeaders[r].label);
				}
				break;

			// default:
				// console.log(panel);
		}

	}

	onCopying = (e?: wijmo.grid.CellRangeEventArgs) => {
		wijmo.Clipboard.copy(this.wijmoGrid.getClipString(null, wijmo.grid.ClipStringOptions.Unformatted, false, false));
		e && (e.cancel = true);
	}

	render() {

		if (this.columnAxesLength <= 0 || this.columnCoordinateLength <= 0) {
			return <ErrorMessage message={'Wrong Table Definition.'} />
		}
		return <div className={css.root} onContextMenu={this.onContextMenu}>
			<Wj.FlexGrid
				columns={this.columns}
				itemsSource={this.itemSource}
				itemFormatter={this. itemFormatter}
				initialized={this.onInitialized}
				alternatingRowStep={0}
				frozenColumns={1}
				frozenRows={1}
				onCopying={this.onCopying}
				isReadOnly={true}
				autoClipboard={true}
				autoGenerateColumns={false}
				allowAddNew={false}
				allowDelete={false}
				allowPinning={false}
			/>
		</div>
	}

	onContextMenu = (e) => {
		if (!this.wijmoGrid) {
			return;
		}
		// prevent the browser's native context menu
		e.preventDefault();
		let canCopy = this.wijmoGrid.selection.row2 > 0 || this.wijmoGrid.selection.col2 > 0;
		if (canCopy) {
			this.wijmoGrid.selection = new wijmo.grid.CellRange (
				Math.max(1, this.wijmoGrid.selection.row),
				Math.max(1, this.wijmoGrid.selection.col),
				Math.max(1, this.wijmoGrid.selection.row2),
				Math.max(1, this.wijmoGrid.selection.col2),
			)
		}
		bp.ContextMenu.show(<bp.Menu>
			<bp.MenuItem icon={TableCopier.ICONS.COPY} text={i18n.common.OBJECT_CTRL.COPY} onClick={() => this.onCopying()} disabled={!canCopy}/>
		</bp.Menu>, { left: e.clientX, top: e.clientY })

	}
}

class CustomizeMergeManager extends wijmo.grid.MergeManager {
	getMergedRange(panel, r, c, clip = true) {
		const range = new wijmo.grid.CellRange(r,c,r,c);
		switch (panel.cellType) {
			case wijmo.grid.CellType.Cell:
				if (c == 0) {
					if (r == 0) {
						range.col2 = c + panel.columns.length - 1;
					} else if (r == 1) {
						range.row2 = r + panel.rows.length - 2;
					}
				}
				break;
			case wijmo.grid.CellType.TopLeft:
				if (c == 0 && r == 0 && panel.columns.length > 1) {
					range.col2 = c + panel.columns.length - 2;
					range.row2 = r + panel.rows.length - 1;
				}
				break;
		}
		return range;
	}
}