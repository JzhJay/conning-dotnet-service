export declare const Clipboard: {
    /**
     * Overrides the inherited CSS of the element to make sure it is
     * selectable. This method also makes the element pseudo-invisible.
     */
    applySelectableStyles(elem: HTMLElement): HTMLElement;
    /**
     * Copies table cells to the clipboard. The parameter is a row-major
     * 2-dimensional `Array` of strings and can contain nulls. We assume all
     * rows are the same length. If not, the cells will still be copied, but
     * the columns may not align. Returns a boolean indicating whether the
     * copy succeeded.
     *
     * See `Clipboard.copy`
     */
    copyCells(cells: string[][]): boolean;
    /**
     * Copies the text to the clipboard. Returns a boolean
     * indicating whether the copy succeeded.
     *
     * See `Clipboard.copy`
     */
    copyString(value: string): boolean;
    /**
     * Copies the element and its children to the clipboard. Returns a boolean
     * indicating whether the copy succeeded.
     *
     * If a plaintext argument is supplied, we add both the text/html and
     * text/plain mime types to the clipboard. This preserves the built in
     * semantics of copying elements to the clipboard while allowing custom
     * plaintext output for programs that can't cope with HTML data in the
     * clipboard.
     *
     * Verified on Firefox 47, Chrome 51.
     *
     * Note: Sometimes the copy does not succeed. Presumably, in order to
     * prevent memory issues, browsers will limit the total amount of data you
     * can copy to the clipboard. Based on ad hoc testing, we found an
     * inconsistent limit at about 300KB or 40,000 cells. Depending on the on
     * the content of cells, your limits may vary.
     */
    copyElement(elem: HTMLElement, plaintext?: string): boolean;
    /**
     * Returns a boolean indicating whether the current browser nominally
     * supports the `copy` operation using the `execCommand` API.
     */
    isCopySupported(): boolean;
};
