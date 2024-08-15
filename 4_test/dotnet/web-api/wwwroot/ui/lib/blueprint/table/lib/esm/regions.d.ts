import { IFocusedCellCoordinates } from "./common/cell";
/**
 * `Region`s contain sets of cells. Additionally, a distinction is drawn, for
 * example, between all cells within a column and the whole column itself.
 * The `RegionCardinality` enum represents these distinct types of `Region`s.
 */
export declare enum RegionCardinality {
    /**
     * A region that contains a finite rectangular group of table cells
     */
    CELLS = "cells",
    /**
     * A region that represents all cells within 1 or more rows.
     */
    FULL_ROWS = "full-rows",
    /**
     * A region that represents all cells within 1 or more columns.
     */
    FULL_COLUMNS = "full-columns",
    /**
     * A region that represents all cells in the table.
     */
    FULL_TABLE = "full-table"
}
/**
 * A convenience object for subsets of `RegionCardinality` that are commonly
 * used as the `selectionMode` prop of the `<Table>`.
 */
export declare const SelectionModes: {
    ALL: RegionCardinality[];
    COLUMNS_AND_CELLS: RegionCardinality[];
    COLUMNS_ONLY: RegionCardinality[];
    NONE: RegionCardinality[];
    ROWS_AND_CELLS: RegionCardinality[];
    ROWS_ONLY: RegionCardinality[];
};
export declare enum ColumnLoadingOption {
    CELLS = "cells",
    HEADER = "column-header"
}
export declare enum RowLoadingOption {
    CELLS = "cells",
    HEADER = "row-header"
}
export declare enum TableLoadingOption {
    CELLS = "cells",
    COLUMN_HEADERS = "column-header",
    ROW_HEADERS = "row-header"
}
/** @deprecated use StyledRegionGroup */
export interface IStyledRegionGroup {
    className?: string;
    regions: Region[];
}
export declare type StyledRegionGroup = IStyledRegionGroup;
/**
 * An _inclusive_ interval of ZERO-indexed cell indices.
 *
 * @deprecated use CellInterval
 */
export declare type ICellInterval = [number, number];
export declare type CellInterval = ICellInterval;
/**
 * Small datastructure for storing cell coordinates [row, column]
 *
 * @deprecated use CellCoordinate
 */
export declare type ICellCoordinate = [number, number];
export declare type CellCoordinate = ICellCoordinate;
/**
 * @see Regions.getRegionCardinality for more about the format of this object.
 * @deprecated use Region
 */
export interface IRegion {
    /**
     * The first and last row indices in the region, inclusive and zero-indexed.
     * If `rows` is `null`, then all rows are understood to be included in the
     * region.
     */
    rows?: CellInterval | null;
    /**
     * The first and last column indices in the region, inclusive and
     * zero-indexed. If `cols` is `null`, then all columns are understood to be
     * included in the region.
     */
    cols?: CellInterval | null;
}
export declare type Region = IRegion;
export declare class Regions {
    /**
     * Determines the cardinality of a region. We use null values to indicate
     * an unbounded interval. Therefore, an example of a region containing the
     * second and third columns would be:
     *
     * ```js
     * { rows: null, cols: [1, 2] }
     * ```
     *
     * In this case, this method would return `RegionCardinality.FULL_COLUMNS`.
     *
     * If both rows and columns are unbounded, then the region covers the
     * entire table. Therefore, a region like this:
     *
     * ```js
     * { rows: null, cols: null }
     * ```
     *
     * will return `RegionCardinality.FULL_TABLE`.
     *
     * An example of a region containing a single cell in the table would be:
     *
     * ```js
     * { rows: [5, 5], cols: [2, 2] }
     * ```
     *
     * In this case, this method would return `RegionCardinality.CELLS`.
     */
    static getRegionCardinality(region: Region): RegionCardinality;
    static getFocusCellCoordinatesFromRegion(region: Region): {
        col: number;
        row: number;
    };
    /**
     * Returns a deep copy of the provided region.
     */
    static copy(region: Region): Region;
    /**
     * Returns a region containing one or more cells.
     */
    static cell(row: number, col: number, row2?: number, col2?: number): Region;
    /**
     * Returns a region containing one or more full rows.
     */
    static row(row: number, row2?: number): Region;
    /**
     * Returns a region containing one or more full columns.
     */
    static column(col: number, col2?: number): Region;
    /**
     * Returns a region containing the entire table.
     */
    static table(): Region;
    /**
     * Adds the region to the end of a cloned copy of the supplied region
     * array.
     */
    static add(regions: Region[], region: Region): IRegion[];
    /**
     * Replaces the region at the end of a cloned copy of the supplied region
     * array, or at the specific index if one is provided.
     */
    static update(regions: Region[], region: Region, index?: number): IRegion[];
    /**
     * Clamps the region's start and end indices between 0 and the provided
     * maximum values.
     */
    static clampRegion(region: Region, maxRowIndex: number, maxColumnIndex: number): IRegion;
    /**
     * Returns true iff the specified region is equal to the last region in
     * the region list. This allows us to avoid immediate additive re-selection.
     */
    static lastRegionIsEqual(regions: Region[], region: Region): boolean;
    /**
     * Returns the index of the region that is equal to the supplied
     * parameter. Returns -1 if no such region is found.
     */
    static findMatchingRegion(regions: Region[], region: Region): number;
    /**
     * Returns the index of the region that wholly contains the supplied
     * parameter. Returns -1 if no such region is found.
     */
    static findContainingRegion(regions: Region[], region: Region): number;
    /**
     * Returns true if the regions contain a region that has FULL_COLUMNS
     * cardinality and contains the specified column index.
     */
    static hasFullColumn(regions: Region[], col: number): boolean;
    /**
     * Returns true if the regions contain a region that has FULL_ROWS
     * cardinality and contains the specified row index.
     */
    static hasFullRow(regions: Region[], row: number): boolean;
    /**
     * Returns true if the regions contain a region that has FULL_TABLE cardinality
     */
    static hasFullTable(regions: Region[]): boolean;
    /**
     * Returns true if the regions fully contain the query region.
     */
    static containsRegion(regions: Region[], query: Region): boolean;
    /**
     * Returns true if the regions at least partially overlap the query region.
     */
    static overlapsRegion(regions: Region[], query: Region, allowPartialOverlap?: boolean): boolean;
    static eachUniqueFullColumn(regions: Region[], iteratee: (col: number) => void): void;
    static eachUniqueFullRow(regions: Region[], iteratee: (row: number) => void): void;
    /**
     * Using the supplied array of non-contiguous `Region`s, this method
     * returns an ordered array of every unique cell that exists in those
     * regions.
     */
    static enumerateUniqueCells(regions: Region[], numRows: number, numCols: number): CellCoordinate[];
    /**
     * Using the supplied region, returns an "equivalent" region of
     * type CELLS that define the bounds of the given region
     */
    static getCellRegionFromRegion(region: Region, numRows: number, numCols: number): IRegion;
    /**
     * Maps a dense array of cell coordinates to a sparse 2-dimensional array
     * of cell values.
     *
     * We create a new 2-dimensional array representing the smallest single
     * contiguous `Region` that contains all cells in the supplied array. We
     * invoke the mapper callback only on the cells in the supplied coordinate
     * array and store the result. Returns the resulting 2-dimensional array.
     */
    static sparseMapCells<T>(cells: CellCoordinate[], mapper: (row: number, col: number) => T): T[][];
    /**
     * Returns the smallest single contiguous `Region` that contains all cells in the
     * supplied array.
     */
    static getBoundingRegion(cells: CellCoordinate[]): Region;
    static isValid(region: Region): boolean;
    static isRegionValidForTable(region: Region, numRows: number, numCols: number): boolean;
    static joinStyledRegionGroups(selectedRegions: Region[], otherRegions: StyledRegionGroup[], focusedCell: IFocusedCellCoordinates): IStyledRegionGroup[];
    static regionsEqual(regionA: Region, regionB: Region): boolean;
    /**
     * Expands an old region to the minimal bounding region that also contains
     * the new region. If the regions have different cardinalities, then the new
     * region is returned. Useful for expanding a selected region on
     * shift+click, for instance.
     */
    static expandRegion(oldRegion: Region, newRegion: Region): Region;
    /**
     * Iterates over the cells within an `Region`, invoking the callback with
     * each cell's coordinates.
     */
    private static eachCellInRegion;
    private static regionContains;
    private static intervalsEqual;
    private static intervalContainsIndex;
    private static intervalContains;
    private static intervalOverlaps;
    private static rowFirstComparator;
    private static numericalComparator;
    private static normalizeInterval;
}
