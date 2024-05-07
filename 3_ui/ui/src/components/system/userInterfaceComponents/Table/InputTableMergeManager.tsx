import {InputTable} from './InputTable';

export class InputTableMergeManager extends wijmo.grid.MergeManager {
	constructor(private inputTable: InputTable) {
		super();
	}

	getHeader(panel, r, c, secondaryDelta = 0) {
		return wijmo.grid.CellType.ColumnHeader === panel.cellType && this.inputTable.columnHeaders ? this.inputTable.columnHeaders[c][r + secondaryDelta] :
		       wijmo.grid.CellType.RowHeader === panel.cellType && this.inputTable.rowHeaders ? this.inputTable.rowHeaders[r][c + secondaryDelta] : null;
	}

	canMergeBetweenLevels(panel, r: number, c: number, delta: number): boolean {
		const current = this.getHeader(panel, r, c);
		const next = this.getHeader(panel, r, c, delta);

		// Must have the same editable state to support merging
		return next && current.editable == next.editable;
	}

	getMergedRange(panel, r, c, clip = true) {
		// create basic cell range
		let rg = new wijmo.grid.CellRange(r, c);
		const isCellPanel =  panel.cellType == wijmo.grid.CellType.Cell;
		const isColumnHeader = wijmo.grid.CellType.ColumnHeader === panel.cellType;
		const isRowHeader = wijmo.grid.CellType.RowHeader === panel.cellType;
		const header = this.getHeader(panel, r, c);


		// expand left/right
		if (header && !header.editable && header.allowMerging !== false) {
			for (let i = rg.col; i < panel.columns.length - 1; i++) {
				if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i + 1, true) || (isRowHeader && !this.canMergeBetweenLevels(panel, rg.row, i, 1)))
					break;
				rg.col2 = i + 1;
			}
			for (let i = rg.col; i > 0; i--) {
				if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i - 1, true) || (isRowHeader && !this.canMergeBetweenLevels(panel, rg.row, i, -1)))
					break;
				rg.col = i - 1;
			}
		}

		// expand up/down
		if (header != null) {
			for (let i = rg.row; i < panel.rows.length - 1; i++) {
				if (panel.getCellData(i, rg.col, true) != panel.getCellData(i + 1, rg.col, true) || (isColumnHeader && !this.canMergeBetweenLevels(panel, i, rg.col, 1)))
					break;
				rg.row2 = i + 1;
			}
			for (let i = rg.row; i > 0; i--) {
				if (panel.getCellData(i, rg.col, true) != panel.getCellData(i - 1, rg.col, true) || (isColumnHeader && !this.canMergeBetweenLevels(panel, i, rg.col, -1)))
					break;
				rg.row = i - 1;
			}
		}
		// done
		return rg;
	}
}