import * as React from "react";
import { AbstractComponent2 } from "@blueprintjs/core";
import { IColumnProps } from "./column";
import { IFocusedCellCoordinates } from "./common/cell";
import { IColumnInteractionBarContextTypes } from "./common/context";
import { Grid, ICellMapper } from "./common/grid";
import { Locator } from "./locator";
import { IRegion } from "./regions";
import { IResizeRowsByApproximateHeightOptions } from "./resizeRows";
import type { TableProps } from "./tableProps";
import type { TableState, TableSnapshot } from "./tableState";
/** @deprecated use Table2, which supports usage of the new hotkeys API in the same application */
export declare class Table extends AbstractComponent2<TableProps, TableState, TableSnapshot> {
    static displayName: string;
    static defaultProps: TableProps;
    static childContextTypes: React.ValidationMap<IColumnInteractionBarContextTypes>;
    static getDerivedStateFromProps(props: TableProps, state: TableState): {
        childrenArray: React.ReactElement<IColumnProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>[];
        columnIdToIndex: {
            [key: string]: number;
        };
        columnWidths: number[];
        focusedCell: IFocusedCellCoordinates;
        numFrozenColumnsClamped: number;
        numFrozenRowsClamped: number;
        rowHeights: number[];
        selectedRegions: IRegion[];
    };
    private static SHALLOW_COMPARE_PROP_KEYS_DENYLIST;
    private static SHALLOW_COMPARE_STATE_KEYS_DENYLIST;
    private static createColumnIdIndex;
    private static isSelectionModeEnabled;
    private hotkeysImpl;
    grid: Grid;
    locator: Locator;
    private resizeSensorDetach;
    private refHandlers;
    private cellContainerElement;
    private columnHeaderElement;
    private quadrantStackInstance;
    private rootTableElement;
    private rowHeaderElement;
    private scrollContainerElement;
    private didCompletelyMount;
    constructor(props: TableProps, context?: any);
    /**
     * __Experimental!__ Resizes all rows in the table to the approximate
     * maximum height of wrapped cell content in each row. Works best when each
     * cell contains plain text of a consistent font style (though font style
     * may vary between cells). Since this function uses approximate
     * measurements, results may not be perfect.
     *
     * Approximation parameters can be configured for the entire table or on a
     * per-cell basis. Default values are fine-tuned to work well with default
     * Table font styles.
     */
    resizeRowsByApproximateHeight(getCellText: ICellMapper<string>, options?: IResizeRowsByApproximateHeightOptions): void;
    /**
     * Resize all rows in the table to the height of the tallest visible cell in the specified columns.
     * If no indices are provided, default to using the tallest visible cell from all columns in view.
     */
    resizeRowsByTallestCell(columnIndices?: number | number[]): void;
    /**
     * Scrolls the table to the target region in a fashion appropriate to the target region's
     * cardinality:
     *
     * - CELLS: Scroll the top-left cell in the target region to the top-left corner of the viewport.
     * - FULL_ROWS: Scroll the top-most row in the target region to the top of the viewport.
     * - FULL_COLUMNS: Scroll the left-most column in the target region to the left side of the viewport.
     * - FULL_TABLE: Scroll the top-left cell in the table to the top-left corner of the viewport.
     *
     * If there are active frozen rows and/or columns, the target region will be positioned in the
     * top-left corner of the non-frozen area (unless the target region itself is in the frozen
     * area).
     *
     * If the target region is close to the bottom-right corner of the table, this function will
     * simply scroll the target region as close to the top-left as possible until the bottom-right
     * corner is reached.
     */
    scrollToRegion(region: IRegion): void;
    getChildContext(): IColumnInteractionBarContextTypes;
    shouldComponentUpdate(nextProps: TableProps, nextState: TableState): boolean;
    render(): JSX.Element;
    renderHotkeys(): JSX.Element;
    /**
     * When the component mounts, the HTML Element refs will be available, so
     * we constructor the Locator, which queries the elements' bounding
     * ClientRects.
     */
    componentDidMount(): void;
    componentWillUnmount(): void;
    getSnapshotBeforeUpdate(): {
        nextScrollLeft: number;
        nextScrollTop: number;
    };
    componentDidUpdate(prevProps: TableProps, prevState: TableState, snapshot: TableSnapshot): void;
    protected validateProps(props: TableProps): void;
    private gridDimensionsMatchProps;
    private maybeRenderCopyHotkey;
    private maybeRenderSelectionResizeHotkeys;
    private maybeRenderFocusHotkeys;
    private maybeRenderSelectAllHotkey;
    private shouldDisableVerticalScroll;
    private shouldDisableHorizontalScroll;
    private renderMenu;
    private handleMenuMouseDown;
    private selectAll;
    private getColumnProps;
    private columnHeaderCellRenderer;
    private renderColumnHeader;
    private renderRowHeader;
    private bodyCellRenderer;
    private renderBody;
    private isGuidesShowing;
    private getEnabledSelectionHandler;
    private invalidateGrid;
    private validateGrid;
    /**
     * Renders a `RegionLayer`, applying styles to the regions using the
     * supplied `RegionStyler`. `RegionLayer` is a `PureRender` component, so
     * the `RegionStyler` should be a new instance on every render if we
     * intend to redraw the region layer.
     */
    private maybeRenderRegions;
    private handleCompleteRender;
    private styleBodyRegion;
    private styleMenuRegion;
    private styleColumnHeaderRegion;
    private styleRowHeaderRegion;
    private handleColumnWidthChanged;
    private handleRowHeightChanged;
    private handleRootScroll;
    private handleBodyScroll;
    private clearSelection;
    private syncViewportPosition;
    private handleFocus;
    private handleSelection;
    private handleColumnsReordering;
    private handleColumnsReordered;
    private handleRowsReordering;
    private handleRowsReordered;
    private handleLayoutLock;
    private updateLocator;
    private updateViewportRect;
    private invokeOnVisibleCellsChangeCallback;
    private getMaxFrozenColumnIndex;
    private getMaxFrozenRowIndex;
    /**
     * Normalizes RenderMode.BATCH_ON_UPDATE into RenderMode.{BATCH,NONE}. We do
     * this because there are actually multiple updates required before the
     * <Table> is considered fully "mounted," and adding that knowledge to child
     * components would lead to tight coupling. Thus, keep it simple for them.
     */
    private getNormalizedRenderMode;
    private handleColumnResizeGuide;
    private handleRowResizeGuide;
}
