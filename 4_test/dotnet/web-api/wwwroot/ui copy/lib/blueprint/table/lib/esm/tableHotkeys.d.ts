import { IFocusedCellCoordinates } from "./common/cell";
import { Grid } from "./common/grid";
import { Region, RegionCardinality } from "./regions";
import type { TableProps } from "./tableProps";
import type { TableState, TableSnapshot } from "./tableState";
export interface TableHandlers {
    handleSelection: (selectedRegions: Region[]) => void;
    handleFocus: (focusedCell: IFocusedCellCoordinates) => void;
    getEnabledSelectionHandler: (selectionMode: RegionCardinality) => (selectedRegions: Region[]) => void;
    syncViewportPosition: (snapshot: TableSnapshot) => void;
}
export declare class TableHotkeys {
    private props;
    private state;
    private grid;
    private tableHandlers;
    constructor(props: TableProps, state: TableState, grid: Grid, tableHandlers: TableHandlers);
    setGrid(grid: Grid): void;
    setProps(props: TableProps): void;
    setState(state: TableState): void;
    private selectAll;
    handleSelectAllHotkey: (e: KeyboardEvent) => void;
    handleSelectionResizeUp: (e: KeyboardEvent) => void;
    handleSelectionResizeDown: (e: KeyboardEvent) => void;
    handleSelectionResizeLeft: (e: KeyboardEvent) => void;
    handleSelectionResizeRight: (e: KeyboardEvent) => void;
    private handleSelectionResize;
    /**
     * Replaces the selected region at the specified array index, with the
     * region provided.
     */
    private updateSelectedRegionAtIndex;
    handleFocusMoveLeft: (e: KeyboardEvent) => void;
    handleFocusMoveLeftInternal: (e: KeyboardEvent) => void;
    handleFocusMoveRight: (e: KeyboardEvent) => void;
    handleFocusMoveRightInternal: (e: KeyboardEvent) => void;
    handleFocusMoveUp: (e: KeyboardEvent) => void;
    handleFocusMoveUpInternal: (e: KeyboardEvent) => void;
    handleFocusMoveDown: (e: KeyboardEvent) => void;
    handleFocusMoveDownInternal: (e: KeyboardEvent) => void;
    private handleFocusMove;
    private handleFocusMoveInternal;
    private scrollBodyToFocusedCell;
    private moveFocusCell;
    handleCopy: (e: KeyboardEvent) => void;
}
