/// <reference types="react" />
import type { ColumnProps } from "./column";
import type { Rect } from "./common";
import type { IFocusedCellCoordinates } from "./common/cell";
import type { Region } from "./regions";
export interface TableState {
    /**
     * An array of column widths. These are initialized from the column props
     * and updated when the user drags column header resize handles.
     */
    columnWidths?: number[];
    /**
     * The coordinates of the currently focused table cell
     */
    focusedCell?: IFocusedCellCoordinates;
    /**
     * An array of pixel offsets for resize guides, which are drawn over the
     * table body when a row is being resized.
     */
    horizontalGuides?: number[];
    /**
     * If `true`, will disable updates that will cause re-renders of children
     * components. This is used, for example, to disable layout updates while
     * the user is dragging a resize handle.
     */
    isLayoutLocked?: boolean;
    /**
     * Whether the user is currently dragging to reorder one or more elements.
     * Can be referenced to toggle the reordering-cursor overlay, which
     * displays a `grabbing` CSS cursor wherever the mouse moves in the table
     * for the duration of the dragging interaction.
     */
    isReordering?: boolean;
    /**
     * The number of frozen columns, clamped to [0, num <Column>s].
     */
    numFrozenColumnsClamped?: number;
    /**
     * The number of frozen rows, clamped to [0, numRows].
     */
    numFrozenRowsClamped?: number;
    /**
     * An array of row heights. These are initialized updated when the user
     * drags row header resize handles.
     */
    rowHeights?: number[];
    /**
     * An array of Regions representing the selections of the table.
     */
    selectedRegions?: Region[];
    /**
     * An array of pixel offsets for resize guides, which are drawn over the
     * table body when a column is being resized.
     */
    verticalGuides?: number[];
    /**
     * The `Rect` bounds of the viewport used to perform virtual viewport
     * performance enhancements.
     */
    viewportRect?: Rect;
    columnIdToIndex: {
        [key: string]: number;
    };
    childrenArray: Array<React.ReactElement<ColumnProps>>;
}
export interface TableSnapshot {
    nextScrollTop?: number;
    nextScrollLeft?: number;
}
