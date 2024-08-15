import * as React from "react";
import { Props } from "@blueprintjs/core";
import { CellRenderer } from "./cell/cell";
import { ColumnHeaderRenderer } from "./headers/columnHeader";
import { IColumnNameProps } from "./headers/columnHeaderCell";
import { ColumnLoadingOption } from "./regions";
export declare type ColumnProps = IColumnProps;
export interface IColumnProps extends IColumnNameProps, Props {
    /**
     * A unique ID, similar to React's `key`. This is used, for example, to
     * maintain the width of a column between re-ordering and rendering. If no
     * IDs are provided, widths will be persisted across renders using a
     * column's index only. Columns widths can also be persisted outside the
     * `Table` component, then passed in with the `columnWidths` prop.
     */
    id?: string | number;
    /**
     * Set this prop to specify whether to render the loading state of the
     * column header and cells in this column. Column-level `loadingOptions`
     * override `Table`-level `loadingOptions`. For example, if you set
     * `loadingOptions=[ TableLoadingOption.CELLS ]` on `Table` and
     * `loadingOptions=[ ColumnLoadingOption.HEADER ]` on a `Column`, the cells
     * in that column will _not_ show their loading state.
     */
    loadingOptions?: ColumnLoadingOption[];
    /**
     * An instance of `CellRenderer`, a function that takes a row and column
     * index, and returns a `Cell` React element.
     */
    cellRenderer?: CellRenderer;
    /**
     * An instance of `ColumnHeaderRenderer`, a function that takes a column
     * index and returns a `ColumnHeaderCell` React element.
     */
    columnHeaderCellRenderer?: ColumnHeaderRenderer;
}
export declare class Column extends React.PureComponent<IColumnProps> {
    static displayName: string;
    static defaultProps: IColumnProps;
}
