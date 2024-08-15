import * as React from "react";
import { AbstractPureComponent2, Props } from "@blueprintjs/core";
import { IHeaderCellProps } from "./headerCell";
export declare type RowHeaderCellProps = IRowHeaderCellProps;
export interface IRowHeaderCellProps extends IHeaderCellProps, Props {
    /**
     * Specifies if the row is reorderable.
     */
    enableRowReordering?: boolean;
    /**
     * Specifies whether the full row is part of a selection.
     */
    isRowSelected?: boolean;
    /**
     * A callback to override the default name rendering behavior. The default
     * behavior is to simply use the `RowHeaderCell`s name prop.
     *
     * This render callback can be used, for example, to provide a
     * `EditableName` component for editing row names.
     *
     * The callback will also receive the row index if an `index` was originally
     * provided via props.
     */
    nameRenderer?: (name: string, index?: number) => React.ReactElement<Props>;
}
export declare class RowHeaderCell extends AbstractPureComponent2<IRowHeaderCellProps> {
    render(): JSX.Element;
}
