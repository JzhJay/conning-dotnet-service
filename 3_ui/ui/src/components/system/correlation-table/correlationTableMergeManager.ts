/// <reference path="../../../lib/wijmo/controls/wijmo.grid.d.ts" />

export class CorrelationMergeManager extends wijmo.grid.MergeManager {
    headersRanges;

    constructor(headerRanges) {
        super();
        this.headersRanges = headerRanges;
    }

    getMergedRange(panel, r, c) {
        if (panel.cellType === wijmo.grid.CellType.ColumnHeader) {
            let range = this.headersRanges[r][c];
            if (range) {
                return new wijmo.grid.CellRange(r, range.start, r, range.end);
            }
        }
        else if (panel.cellType === wijmo.grid.CellType.RowHeader) {
            let range = this.headersRanges[c][r];
            if (range) {
                return new wijmo.grid.CellRange(range.start, c, range.end, c);
            }
        }
        else if (panel.cellType === wijmo.grid.CellType.TopLeft) {
            if (r < panel.rows.length - 1 && c >= r) {
                return new wijmo.grid.CellRange(r, r, r, panel.columns.length - 1);
            }
        }
        return null;
    };
}
