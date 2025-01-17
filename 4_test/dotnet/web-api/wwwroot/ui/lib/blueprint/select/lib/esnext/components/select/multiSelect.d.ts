import * as React from "react";
import { AbstractPureComponent2, IPopoverProps, TagInputProps } from "@blueprintjs/core";
import { IListItemsProps } from "../../common";
import { QueryList } from "../query-list/queryList";
export declare type MultiSelectProps<T> = IMultiSelectProps<T>;
/** @deprecated use MultiSelectProps */
export interface IMultiSelectProps<T> extends IListItemsProps<T> {
    /**
     * Whether the component should take up the full width of its container.
     * This overrides `popoverProps.fill` and `tagInputProps.fill`.
     */
    fill?: boolean;
    /**
     * Callback invoked when an item is removed from the selection by
     * removing its tag in the TagInput. This is generally more useful than
     * `tagInputProps.onRemove`  because it receives the removed value instead of
     * the value's rendered `ReactNode` tag.
     *
     * It is not recommended to supply _both_ this prop and `tagInputProps.onRemove`.
     */
    onRemove?: (value: T, index: number) => void;
    /**
     * If true, the component waits until a keydown event in the TagInput
     * before opening its popover.
     *
     * If false, the popover opens immediately after a mouse click focuses
     * the component's TagInput.
     *
     * N.B. the behavior of this prop differs slightly from the same one
     * in the Suggest component; see https://github.com/palantir/blueprint/issues/4152.
     *
     * @default false
     */
    openOnKeyDown?: boolean;
    /**
     * Input placeholder text. Shorthand for `tagInputProps.placeholder`.
     *
     * @default "Search..."
     */
    placeholder?: string;
    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;
    /** Controlled selected values. */
    selectedItems?: T[];
    /** Props to spread to `TagInput`. Use `query` and `onQueryChange` to control the input. */
    tagInputProps?: Partial<TagInputProps> & object;
    /** Custom renderer to transform an item into tag content. */
    tagRenderer: (item: T) => React.ReactNode;
}
export interface IMultiSelectState {
    isOpen: boolean;
}
export declare class MultiSelect<T> extends AbstractPureComponent2<MultiSelectProps<T>, IMultiSelectState> {
    static displayName: string;
    static defaultProps: {
        fill: boolean;
        placeholder: string;
    };
    static ofType<U>(): new (props: MultiSelectProps<U>) => MultiSelect<U>;
    state: IMultiSelectState;
    private TypedQueryList;
    input: HTMLInputElement | null;
    queryList: QueryList<T> | null;
    private refHandlers;
    componentDidUpdate(prevProps: MultiSelectProps<T>): void;
    render(): JSX.Element;
    private renderQueryList;
    private handleItemSelect;
    private handleQueryChange;
    private handlePopoverInteraction;
    private handlePopoverOpened;
    private handleTagRemove;
    private getTagInputKeyDownHandler;
    private getTagInputKeyUpHandler;
}
