/// <reference types="react" />
import { AbstractPureComponent2, InputGroupProps2, IPopoverProps } from "@blueprintjs/core";
import { IListItemsProps } from "../../common";
export declare type SelectProps<T> = ISelectProps<T>;
/** @deprecated use SelectProps */
export interface ISelectProps<T> extends IListItemsProps<T> {
    /**
     * Whether the component should take up the full width of its container.
     * This overrides `popoverProps.fill`. You also have to ensure that the child
     * component has `fill` set to `true` or is styled appropriately.
     */
    fill?: boolean;
    /**
     * Whether the dropdown list can be filtered.
     * Disabling this option will remove the `InputGroup` and ignore `inputProps`.
     *
     * @default true
     */
    filterable?: boolean;
    /**
     * Whether the component is non-interactive.
     * If true, the list's item renderer will not be called.
     * Note that you'll also need to disable the component's children, if appropriate.
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * Props to spread to the query `InputGroup`. Use `query` and
     * `onQueryChange` instead of `inputProps.value` and `inputProps.onChange`
     * to control this input.
     */
    inputProps?: InputGroupProps2;
    /**
     * Whether the select popover should be styled so that it matches the width of the target.
     * This is done using a popper.js modifier passed through `popoverProps`.
     *
     * Note that setting `matchTargetWidth={true}` will also set `popoverProps.usePortal={false}` and `popoverProps.wrapperTagName="div"`.
     *
     * @default false
     */
    matchTargetWidth?: boolean;
    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;
    /**
     * Whether the active item should be reset to the first matching item _when
     * the popover closes_. The query will also be reset to the empty string.
     *
     * @default false
     */
    resetOnClose?: boolean;
}
export interface ISelectState {
    isOpen: boolean;
}
export declare class Select<T> extends AbstractPureComponent2<SelectProps<T>, ISelectState> {
    static displayName: string;
    static ofType<U>(): new (props: SelectProps<U>) => Select<U>;
    state: ISelectState;
    private TypedQueryList;
    inputElement: HTMLInputElement | null;
    private queryList;
    private previousFocusedElement;
    private handleInputRef;
    private handleQueryListRef;
    render(): JSX.Element;
    componentDidUpdate(prevProps: SelectProps<T>, prevState: ISelectState): void;
    private renderQueryList;
    private maybeRenderClearButton;
    private handleTargetKeyDown;
    private handleItemSelect;
    private handlePopoverInteraction;
    private handlePopoverOpening;
    private handlePopoverOpened;
    private handlePopoverClosing;
    private resetQuery;
}
