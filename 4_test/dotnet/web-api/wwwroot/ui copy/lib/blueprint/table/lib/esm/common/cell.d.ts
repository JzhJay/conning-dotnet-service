export declare type CellCoordinates = ICellCoordinates;
export interface ICellCoordinates {
    col: number;
    row: number;
}
export declare type FocusedCellCoordinates = IFocusedCellCoordinates;
export interface IFocusedCellCoordinates extends ICellCoordinates {
    focusSelectionIndex: number;
}
