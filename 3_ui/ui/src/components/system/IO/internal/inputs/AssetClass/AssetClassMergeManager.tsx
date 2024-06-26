import {AssetClassInput} from './AssetClassInput';

export class AssetClassMergeManager extends wijmo.grid.MergeManager {
	constructor(private assetClassInput: AssetClassInput) {
		super();
	}

	canMergeColumnHeadersVertically(panel, r: number, c: number, delta: number): boolean {
		const currentRow = this.assetClassInput.columnHeaders[c][r];
		const nextRow = this.assetClassInput.columnHeaders[c][r + delta];

		// Must have the same editable state to support merging
		return wijmo.grid.CellType.ColumnHeader === panel.cellType && nextRow && currentRow.editable == nextRow.editable;
	}

	getMergedRange(panel, r, c, clip = true) {
		// create basic cell range
		let rg = new wijmo.grid.CellRange(r, c);
		const isCellPanel =  panel.cellType == wijmo.grid.CellType.Cell;
		let isMergeableExtremeCell = isCellPanel && this.assetClassInput.isExtremeRow(r) && !this.assetClassInput.columnHeaders[c][1].supportsExtreme
		// expand left/right



		if (((c < 3 && !this.assetClassInput.isSpacerCell(r, c)) || (wijmo.grid.CellType.ColumnHeader === panel.cellType && !this.assetClassInput.columnHeaders[c][r].editable && this.assetClassInput.columnHeaders[c][r].allowMerging !== false) || isMergeableExtremeCell)) {
			for (let i = rg.col; i < panel.columns.length - 1; i++) {
				if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i + 1, true))
					break;
				rg.col2 = i + 1;
			}
			for (let i = rg.col; i > 0; i--) {
				if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i - 1, true) || this.assetClassInput.isSpacerCell(rg.row, i -1))
					break;
				rg.col = i - 1;
			}
		}

		// expand up/down
		//this.assetClassInput.rows[r] && this.assetClassInput.rows[r].level != c
		if (isCellPanel && this.assetClassInput.rows[r].name != "total" && c < 3 && this.assetClassInput.rows[r] && c < this.assetClassInput.rows[r].level  ||
			wijmo.grid.CellType.ColumnHeader === panel.cellType) {
			for (let i = rg.row; i < panel.rows.length - 1; i++) {
				if (panel.getCellData(i, rg.col, true) != panel.getCellData(i + 1, rg.col, true) || !this.canMergeColumnHeadersVertically(panel, i, rg.col, 1))
					break;
				rg.row2 = i + 1;
			}
			for (let i = rg.row; i > 0; i--) {
				if (panel.getCellData(i, rg.col, true) != panel.getCellData(i - 1, rg.col, true) || !this.canMergeColumnHeadersVertically(panel, i, rg.col, -1))
					break;
				rg.row = i - 1;
			}
		}
		// done
		return rg;
	}
}