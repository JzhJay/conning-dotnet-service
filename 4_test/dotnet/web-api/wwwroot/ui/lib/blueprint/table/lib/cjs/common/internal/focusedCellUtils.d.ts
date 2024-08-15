import { Region } from "../../regions";
import { CellCoordinates, FocusedCellCoordinates } from "../cell";
/**
 * Returns the `focusedSelectionIndex` if both the focused cell and that
 * property are defined, or the last index of `selectedRegions` otherwise. If
 * `selectedRegions` is empty, the function always returns `undefined`.
 */
export declare function getFocusedOrLastSelectedIndex(selectedRegions: Region[], focusedCell?: FocusedCellCoordinates): number;
/**
 * Returns the proper focused cell for the given set of initial conditions.
 */
export declare function getInitialFocusedCell(enableFocusedCell: boolean, focusedCellFromProps: FocusedCellCoordinates, focusedCellFromState: FocusedCellCoordinates, selectedRegions: Region[]): FocusedCellCoordinates;
/**
 * Returns `true` if the focused cell is located along the top boundary of the
 * provided region, or `false` otherwise.
 */
export declare function isFocusedCellAtRegionTop(region: Region, focusedCell: FocusedCellCoordinates): boolean;
/**
 * Returns `true` if the focused cell is located along the bottom boundary of
 * the provided region, or `false` otherwise.
 */
export declare function isFocusedCellAtRegionBottom(region: Region, focusedCell: FocusedCellCoordinates): boolean;
/**
 * Returns `true` if the focused cell is located along the left boundary of the
 * provided region, or `false` otherwise.
 */
export declare function isFocusedCellAtRegionLeft(region: Region, focusedCell: FocusedCellCoordinates): boolean;
/**
 * Returns `true` if the focused cell is located along the right boundary of the
 * provided region, or `false` otherwise.
 */
export declare function isFocusedCellAtRegionRight(region: Region, focusedCell: FocusedCellCoordinates): boolean;
/**
 * Returns a new cell-coordinates object that includes a focusSelectionIndex property.
 * The returned object will have the proper FocusedCellCoordinates type.
 */
export declare function toFullCoordinates(cellCoords: CellCoordinates, focusSelectionIndex?: number): FocusedCellCoordinates;
/**
 * Expands an existing region to new region based on the current focused cell.
 * The focused cell is an invariant and should not move as a result of this
 * operation. This function is used, for instance, to expand a selected region
 * on shift+click.
 */
export declare function expandFocusedRegion(focusedCell: FocusedCellCoordinates, newRegion: Region): import("../../regions").IRegion;
