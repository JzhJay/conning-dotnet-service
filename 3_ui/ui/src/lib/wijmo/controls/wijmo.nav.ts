/*!
    *
    * Wijmo Library 5.20212.812
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    *
    * Licensed under the GrapeCity Commercial License.
    * sales@wijmo.com
    * wijmo.com/products/wijmo-5/license/
    *
    */


    module wijmo.nav {
    

'use strict';

/**
 * The {@link TabPanel} enables content organization at a high level, 
 * such as switching between views, data sets, or functional aspects 
 * of an application.
 * 
 * Tabs are presented as a single row above their associated content.
 * Tab headers succinctly describe the content within.
 * 
 * Tabs can be selected with the mouse or keyboard, and automatically
 * update the content to reflect the current selection.
 * 
 * The example below shows how you can use a {@link TabPanel} to organize
 * content into pages:
 * 
 * {@sample Nav/TabPanel/Overview Example}
 */
export class TabPanel extends wijmo.Control {

    // property storage
    private _tabs = new wijmo.collections.ObservableArray<Tab>();
    private _selectedIndex = -1;
    private _toAnim: any;
    private _eAnim: HTMLElement;
    private _animated = true;
    private _autoSwitch = true;

    // template parts
    private _dRoot: HTMLElement;
    private _dTabHeaders: HTMLElement;
    private _dTabPanes: HTMLElement;

    /**
     * Gets or sets the template used to instantiate {@link TabPanel} controls.
     */
    static controlTemplate = '<div wj-part="root">' +
        '<div wj-part="tabheaders" class="wj-tabheaders" role="tablist"></div>' +
        '<div wj-part="tabpanes" class="wj-tabpanes"></div>' +
        '</div>';

    /**
     * Initializes a new instance of the {@link TabPanel} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     * @param keepChildren Whether to keep child elements. If set to true, the caller becomes responsible for 
     * populating the {@link tabs} array based on the DOM).
     */
    constructor(element: any, options?, keepChildren?: boolean) {
        super(element, null, true);

        // accessibility: 
        // https://www.w3.org/TR/wai-aria-1.1/#tab
        // https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html

        // copy children before applying template
        let host = this.hostElement,
            children = [];
        if (!keepChildren) {
            while (host.firstElementChild) {
                let child = host.firstElementChild;
                host.removeChild(child);
                children.push(child);
            }
        }

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-tabpanel wj-animated', tpl, {
            _dRoot: 'root',
            _dTabHeaders: 'tabheaders',
            _dTabPanes: 'tabpanes'
        });

        // make host non-focusable
        host.tabIndex = -1;
        this._dRoot.tabIndex = this._dTabHeaders.tabIndex = this._dTabPanes.tabIndex = -1;

        // initialize isAnimated before populating the control (TFS 438995)
        if (options && wijmo.isBoolean(options.isAnimated)) {
            this.isAnimated = options.isAnimated;
        }

        // connect event handlers
        this.addEventListener(host, 'click', this._click.bind(this));
        this.addEventListener(host, 'keydown', this._keydown.bind(this));

        // listen to changes in the tabs array
        this._tabs.collectionChanged.addHandler(this._populateControl.bind(this));

        // add content (collection of divs, each with header and body elements)
        this.tabs.deferUpdate(() => {
            children.forEach(child => {
                wijmo.assert(child.childElementCount == 2, 'TabPanel children should contain header and pane elements');
                this.tabs.push(new Tab(child.children[0], child.children[1]));
            })
        });

        // initialize control options
        this.initialize(options);

        // select first tab
        if (this.selectedIndex < 0 && this.tabs.length) {
            this.selectedIndex = 0;
        } else {
            this.onSelectedIndexChanged(); // initialize detached tabs
        }
    }
    /**
     * Gets an array of {@link Tab} objects whose {@link Tab.header} and 
     * {@link Tab.pane} properties determine the content of the 
     * {@link TabPanel} control.
     */
    get tabs(): wijmo.collections.ObservableArray<Tab> {
        return this._tabs;
    }
    /**
     * Gets or sets the index of the currently selected (active) tab.
     */
    get selectedIndex(): number {
        return this._selectedIndex;
    }
    set selectedIndex(value: number) {
        value = wijmo.asInt(value, false);
        if (value != this._selectedIndex) {
            this._selectedIndex = value;
            this._updateContent();
            this.onSelectedIndexChanged();
        } else {
            this._updateContent(); // ensure current tab is visible
        }
    }
    /**
     * Gets or sets the {@link Tab} object that is currently selected.
     */
    get selectedTab(): Tab {
        let selIndex = this._selectedIndex;
        return selIndex > -1 ? this._tabs[selIndex] : null;
    }
    set selectedTab(value: Tab) {
        let selIndex = -1;
        for (let i = 0; i < this._tabs.length && selIndex < 0; i++) {
            if (this._tabs[i] == value) {
                selIndex = i;
            }
        }
        this.selectedIndex = selIndex;
    }
    /**
     * Gets or sets a value that determines whether tab changes should be animated
     * with a fade-in effect.
     * 
     * The default value for this property is **true**.
     */
    get isAnimated(): boolean {
        return this._animated;
    }
    set isAnimated(value: boolean) {
        this._animated = wijmo.asBoolean(value);
        wijmo.toggleClass(this.hostElement, 'wj-animated', this._animated); // TFS 438995
    }
    /**
     * Gets or sets a value that determines whether the control should switch
     * tabs automatically when the user selects a tab using the arrow keys.
     * 
     * The default value for this property is **true**, which causes the 
     * control to switch tabs when the user presses the arrow keys.
     * In this mode, the Tab key selects the next element in the tab sequence,
     * which excludes non-selected tab headers.
     * 
     * When {@link autoSwitch} is set to **false**, pressing the arrow keys
     * or the Tab key moves the focus to the next or previous tab header, 
     * but does not switch tabs. Pressing the **Enter** or **Space** keys
     * is required to activate the tab that has the focus.
     * 
     * In most cases, the default value provides adequate (accessible) 
     * behavior, but some users may prefer to set {@link autoSwitch} to false.
     * For a more detailed discussion of this topic, please see the
     * <a href="https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus" target="_blank">W3C ARIA practices</a>
     * and
     * <a href="http://simplyaccessible.com/article/danger-aria-tabs/" target="_blank">SimplyAccessible</a> articles.
     */
    get autoSwitch(): boolean {
        return this._autoSwitch;
    }
    set autoSwitch(value: boolean) {
        if (value != this._autoSwitch) {
            this._autoSwitch = wijmo.asBoolean(value);
            this._updateContent();
        }
    }
    /**
     * Gets a {@link Tab} by id or by header content.
     * 
     * @param id Id of the {@link Tab} to retrieve.
     */
    getTab(id: string): Tab {

        // by id
        for (let i = 0; i < this._tabs.length; i++) {
            let tab = this._tabs[i] as Tab;
            if (tab.header.id == id || tab.pane.id == id) {
                return tab;
            }
        }

        // by content
        for (let i = 0; i < this._tabs.length; i++) {
            let tab = this._tabs[i] as Tab;
            if (tab.header.textContent == id) {
                return tab;
            }
        }

        // not found
        return null;
    }

    /**
     * Occurs when the value of the {@link selectedIndex} property changes.
     */
    readonly selectedIndexChanged = new wijmo.Event<TabPanel, wijmo.EventArgs>();
    /**
     * Raises the {@link selectedIndexChanged} event.
     */
    onSelectedIndexChanged(e?: wijmo.EventArgs) {
        this.selectedIndexChanged.raise(this, e);
    }

    // ** internal stuff

    // fill header and pane elements based on the _tabs array
    _populateControl() {
        this._removeChildren(this._dTabHeaders);
        this._removeChildren(this._dTabPanes);
        let selIndex = -1;
        this._tabs.forEach((tab: Tab, index) => {
            wijmo.assert(tab instanceof Tab, 'tabs array must contain Tab objects.');
            tab._setPanel(this);

            // add header
            let hdr = tab.header;
            wijmo.addClass(hdr, 'wj-tabheader');
            wijmo.setAttribute(hdr, 'role', 'tab');
            // http://www.heydonworks.com/article/aria-controls-is-poop
            //setAttribute(hdr, 'aria-controls', pane.id ? pane.id : null);
            this._dTabHeaders.appendChild(hdr);

            // add pane
            let pane = tab.pane;
            wijmo.addClass(pane, 'wj-tabpane');
            wijmo.setAttribute(pane, 'role', 'tabpanel');
            wijmo.setAttribute(pane, 'aria-labelledby', hdr.id ? hdr.id : null);
            this._dTabPanes.appendChild(pane);

            // keep track of selected tab in the mark up
            if (selIndex < 0) {
                if (wijmo.hasClass(hdr, 'wj-state-active') || hdr.getAttribute('aria-selected') == 'true') {
                    selIndex = index;
                }
            }
        });

        // make sure a tab is selected
        if (selIndex < 0 && this._tabs.length > 0) {
            selIndex = 0;
        }

        // apply the selection
        if (selIndex > -1) {
            this.selectedIndex = selIndex;
        } else if (this.selectedIndex > -1 && this.selectedIndex < this._tabs.length) {
            this._updateContent();
        }

        // validate the selection
        this._validateSelection();
    }

    // ensure the current tab is not disabled or invisible
    _validateSelection() {
        let tab = this.selectedTab;
        if (tab) {
            if (tab.isDisabled || !tab.isVisible) {
                let index = this._getNextIndex(this.selectedIndex, 1);
                if (index < 0) index = this._getNextIndex(this.selectedIndex, -1);
                this.selectedIndex = index;
            }
        }
    }

    // update headers and panes based on the _tabs array and selected index
    private _updateContent() {
        let focus = wijmo.contains(this._dTabHeaders, wijmo.getActiveElement()),
            headers = this._dTabHeaders.children,
            panes = this._dTabPanes.children,
            selIndex = this._selectedIndex;

        // apply animation to selected pane
        if (selIndex > -1 && selIndex < panes.length) {
            let pane = panes[selIndex] as HTMLElement,
                style = pane.style;
            if (!this.isAnimated) {
                style.opacity = ''; // no animation: opaque
            } else {
                if (this._eAnim) { // TFS 429655
                    this._eAnim.style.opacity = '';
                }
                if (this._toAnim) {
                    clearInterval(this._toAnim);
                }
                style.opacity = '0'; // start transparent
                this._eAnim = pane;
                this._toAnim = wijmo.animate(pct => {
                    if (pct == 1) { // animation is done
                        this._eAnim = null;
                        this._toAnim = null;
                        style.opacity = '';
                    } else {
                        style.opacity = pct.toString(); // fade in
                    }
                });
            }
        }

        // update all tab headers and content
        for (let i = 0; i < headers.length; i++) {
            let sel = i == selIndex;

            // update header
            let hdr = headers[i] as HTMLElement;
            wijmo.setAttribute(hdr, 'aria-selected', sel);
            wijmo.toggleClass(hdr, 'wj-state-active', sel);

            // update panel
            let pane = panes[i] as HTMLElement;
            wijmo.toggleClass(pane, 'wj-state-active', sel);
            hdr.tabIndex = (sel || !this._autoSwitch) ? this._orgTabIndex : -1;

            // update focus, invalidate Wijmo controls
            if (sel) {
                if (focus) {
                    hdr.focus();
                }
                if (!this._szObserver) { // not needed if we have a ResizeObserver
                    wijmo.Control.invalidateAll(pane);
                }
            }
        }
    }

    // remove all children from an element
    // (setting innerHTML to '' doesn't work as expected in IE?)
    private _removeChildren(e: HTMLElement) {
        while (e.firstChild) {
            e.removeChild(e.firstChild);
        }
    }

    // handle clicks on the tab headers
    private _click(e: MouseEvent) {
        let i = this._getTabIndex(e.target as HTMLElement);
        if (i > -1) {
            let tab = this._tabs[i] as Tab;
            if (!tab.isDisabled && tab.isVisible) { // TFS 348667
                this.selectedIndex = i;
            }
        }
    }

    // handle cursor keys on the tab headers
    private _keydown(e: KeyboardEvent) {
        if (!e.defaultPrevented) {
            let index = this._getTabIndex(wijmo.getActiveElement());
            if (index > -1) {

                // reverse left/right keys when rendering in right-to-left
                let keyCode = this._getKeyCode(e);

                // go handle the key
                switch (keyCode) {
                    case wijmo.Key.Left:
                    case wijmo.Key.Up:
                    case wijmo.Key.Right:
                    case wijmo.Key.Down:
                    case wijmo.Key.Home:
                    case wijmo.Key.PageUp:
                    case wijmo.Key.End:
                    case wijmo.Key.PageDown:
                        switch (keyCode) {
                            case wijmo.Key.Left:
                            case wijmo.Key.Up:
                                index = this._getNextIndex(index, -1);
                                break;
                            case wijmo.Key.Right:
                            case wijmo.Key.Down:
                                index = this._getNextIndex(index, +1);
                                break;
                            case wijmo.Key.Home:
                            case wijmo.Key.PageUp:
                                index = this._getNextIndex(-1, +1);
                                break;
                            case wijmo.Key.End:
                            case wijmo.Key.PageDown:
                                index = this._getNextIndex(this._tabs.length, -1);
                                break;
                        }
                        if (index > -1) {
                            if (this._autoSwitch) {
                                this.selectedIndex = index;
                            } else {
                                this._tabs[index].header.focus();
                            }

                        }
                        e.preventDefault();
                        break;
                    case wijmo.Key.Enter:
                    case wijmo.Key.Space:
                        if (index > -1) {
                            let tab = this._tabs[index];
                            tab.header.click();
                        }
                        e.preventDefault();
                        break;
                }
            }
        }
    }

    // gets the tab index from an element in the tab header
    private _getTabIndex(e: HTMLElement): number {
        let hdr = wijmo.closest(e, '.wj-tabheader');
        if (hdr && wijmo.closest(hdr, '.wj-tabpanel') == this.hostElement) {
            for (let i = 0; i < this._tabs.length; i++) {
                if (this._tabs[i].header == hdr) {
                    return i;
                }
            }
        }
        return -1;
    }

    // gets a visible/enabled tab index given a start and a step
    private _getNextIndex(index: number, step: number): number {
        for (let i = index + step; i > -1 && i < this._tabs.length; i += step) {
            let tab = this._tabs[i] as Tab;
            if (!tab.isDisabled && tab.isVisible) {
                return i;
            }
        }
        return -1;
    }
}

/**
 * Represents a tab within a {@link TabPanel} control.
 * 
 * Tabs have two elements: a header and a pane. The header displays
 * the tab title and the pane represents the tab content.
 */
export class Tab {
    private _hdr: HTMLElement;
    private _pane: HTMLElement;
    private _p: TabPanel;

    /**
     * Initializes a new instance of the {@link Tab} class.
     * 
     * @param header Element or CSS selector for the element that contains the Tab header.
     * @param pane Element or CSS selector for the element that contains the Tab content.
     */
    constructor(header: any, pane: any) {
        this._hdr = wijmo.asType(wijmo.getElement(header), HTMLElement) as HTMLElement;
        this._pane = wijmo.asType(wijmo.getElement(pane), HTMLElement) as HTMLElement;
    }

    /**
     * Gets a reference to the {@link TabPanel} that contains this Tab.
     */
    get tabPanel(): TabPanel {
        return this._p;
    }
    /**
     * Gets the tab's header element.
     */
    get header(): HTMLElement {
        return this._hdr;
    }
    /**
     * Gets the tab's content element.
     */
    get pane(): HTMLElement {
        return this._pane;
    }
    /**
     * Gets or sets a value that determines whether this {@link Tab} is disabled.
     */
    get isDisabled(): boolean {
        return wijmo.hasClass(this._hdr, 'wj-state-disabled');
    }
    set isDisabled(value: boolean) {
        wijmo.toggleClass(this._hdr, 'wj-state-disabled', wijmo.asBoolean(value));
        this._p && this._p._validateSelection();
    }
    /**
     * Gets or sets a value that determines whether this {@link Tab} is visible.
     */
    get isVisible(): boolean {
        return this._hdr.style.display != 'none';
    }
    set isVisible(value: boolean) {
        this._hdr.style.display = wijmo.asBoolean(value) ? '' : 'none';
        this._p && this._p._validateSelection();
    }

    // ** implementation

    // changes header/pane property values
    _setParts(header: HTMLElement, pane: HTMLElement) {
        header = wijmo.asType(wijmo.getElement(header), HTMLElement) as HTMLElement;
        pane = wijmo.asType(wijmo.getElement(pane), HTMLElement, false) as HTMLElement;
        if (this._hdr !== header || this._pane !== pane) {

            // save element-based property values to propagate them to the new elements
            let saveIsDisabled = this.isDisabled,
                saveIsVisible = this.isVisible;
            this._hdr = header
            this._pane = pane;

            // propagate element-based property values
            this.isDisabled = saveIsDisabled;
            this.isVisible = saveIsVisible;

            // go populate the control
            let panel = this.tabPanel;
            if (panel && !panel.tabs.isUpdating) {
                panel._populateControl();
            }
        }
    }

    // changes the 'tabPanel' property value
    _setPanel(panel: TabPanel) {
        this._p = panel;
    }
}
    }
    


    module wijmo.nav {
    

'use strict';

// class names
const _CLS_ACTIVE = 'wj-state-active';

/**
 * The {@link Accordion} control is a vertically stacked set of
 * interactive headings that each contain a title.
 * 
 * The headings function as controls that enable users to reveal
 * or hide their associated sections of content.
 * 
 * Accordions are commonly used to reduce the need to scroll when 
 * presenting multiple sections of content on a single page.
 */
export class Accordion extends wijmo.Control {

    // property storage
    private _panes = new wijmo.collections.ObservableArray<AccordionPane>();
    private _selectedIndex = -1;
    private _animated = true;
    private _autoSwitch = true;
    private _alCollapseAll = false;
    private _alExpandMany = false;
    private _autoSwitching = false;
    private _hidePane: AccordionPane;

    /**
     * Initializes a new instance of the {@link Accordion} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     * @param keepChildren Whether to keep child elements. If set to true, the caller becomes responsible for 
     * populating the {@link tabs} array based on the DOM).
     */
    constructor(element: any, options?, keepChildren?: boolean) {
        super(element, null, true);

        // accessibility: 
        // https://www.w3.org/TR/wai-aria-practices/#accordion
        // https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html

        // copy children before applying template
        let host = this.hostElement,
            panes = this._panes,
            children = [];
        if (!keepChildren) {
            while (host.firstElementChild) {
                let child = host.firstElementChild;
                host.removeChild(child);
                children.push(child);
            }
        }

        // add classes to host element
        wijmo.addClass(host, 'wj-control wj-accordion wj-show-icons');

        // make host non-focusable
        host.tabIndex = -1;

        // connect event handlers
        this.addEventListener(host, 'click', this._click.bind(this));
        this.addEventListener(host, 'keydown', this._keydown.bind(this));

        // listen to changes in the items array
        panes.collectionChanged.addHandler(this._populateControl.bind(this));

        // add content (collection of divs, each with header and body elements)
        panes.deferUpdate(() => {
            children.forEach(child => {
                wijmo.assert(child.childElementCount == 2, 'Accordion children should contain header and pane elements');
                panes.push(new AccordionPane(child.children[0], child.children[1]));
            });
        });

        // initialize control options
        this.initialize(options);

        // select first tab
        let optionsIndex = options ? options.selectedIndex : null;
        if (this.selectedIndex != optionsIndex && this.selectedIndex < 0 && panes.length) {
            this.selectedIndex = 0;
        } else {
            this.onSelectedIndexChanged(); // initialize detached panes
        }
    }
    
    /**
     * Gets an array of {@link AccordionPane} objects whose {@link AccordionPane.header} and 
     * {@link AccordionPane.content} properties determine the content of the 
     * {@link Accordion} control.
     */
    get panes(): wijmo.collections.ObservableArray<AccordionPane> {
        return this._panes;
    }
    /**
     * Gets or sets the index of the currently selected (active) pane.
     */
    get selectedIndex(): number {
        return this._selectedIndex;
    }
    set selectedIndex(value: number) {
        value = wijmo.asInt(value, false);
        if (value != this._selectedIndex) {
            this._selectedIndex = value;
            this._updateContent();
            this.onSelectedIndexChanged();
        } else {
            this._updateContent(); // ensure current pane is visible
        }
    }
    /**
     * Gets or sets the {@link AccordionPane} object that is currently selected.
     */
    get selectedPane(): AccordionPane {
        let selIndex = this._selectedIndex;
        return selIndex > -1 ? this._panes[selIndex] : null;
    }
    set selectedPane(value: AccordionPane) {
        let selIndex = -1;
        for (let i = 0; i < this._panes.length && selIndex < 0; i++) {
            if (this._panes[i] == value) {
                selIndex = i;
            }
        }
        this.selectedIndex = selIndex;
    }
    /**
     * Gets or sets a value that determines whether collapsing or
     * expanding panes should be animated.
     * 
     * The default value for this property is **true**.
     */
    get isAnimated(): boolean {
        return this._animated;
    }
    set isAnimated(value: boolean) {
        this._animated = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the {@link Accordion}
     * shows collapsed/expanded icons in the pane headers.
     * 
     * The default value for this property is **true**.
     */
    get showIcons(): boolean {
        return wijmo.hasClass(this.hostElement, 'wj-show-icons');
    }
    set showIcons(value: boolean) {
        wijmo.toggleClass(this.hostElement, 'wj-show-icons', wijmo.asBoolean(value));
    }
    /**
     * Gets or sets a value that determines whether the control should switch
     * panes automatically when the user selects a tab using the arrow keys.
     * 
     * When {@link autoSwitch} is set to true (the default value), pressing the
     * arrow keys automatically switches panes. Pressing the tab key selects
     * the next element in the tab sequence, which excludes non-selected
     * pane headers.
     * 
     * When {@link autoSwitch} is set to false, pressing the arrow keys or the
     * tab key moves the focus to the next or previous pane header, but does 
     * not switch panes. Pressing the Enter or Space keys is required to 
     * activate the pane that has the focus.
     * 
     * In most cases, the default value provides adequate (accessible) 
     * behavior, but some users may prefer to set {@link autoSwitch} to false.
     * For a more detailed discussion of this topic, please see the
     * <a href="https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus" target="_blank">W3C ARIA practices</a>
     * and
     * <a href="http://simplyaccessible.com/article/danger-aria-tabs/" target="_blank">SimplyAccessible</a> articles.
     */
    get autoSwitch(): boolean {
        return this._autoSwitch;
    }
    set autoSwitch(value: boolean) {
        if (value != this._autoSwitch) {
            this._autoSwitch = wijmo.asBoolean(value);
            this._updateContent();
        }
    }
    /**
     * Gets or sets a value that determines whether users should be allowed
     * to collapse all the items.
     * 
     * The default value for this property is **false**, which ensures 
     * one item is always expanded.
     */
    get allowCollapseAll(): boolean {
        return this._alCollapseAll;
    }
    set allowCollapseAll(value: boolean) {
        this._alCollapseAll = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether users should be allowed
     * to expand multiple panes at a time.
     * 
     * The default value for this property is **false**, which ensures 
     * only one pane is expanded at a time.
     */
    get allowExpandMany(): boolean {
        return this._alExpandMany;
    }
    set allowExpandMany(value: boolean) {
        if (value != this._alExpandMany) {
            this._alExpandMany = value = wijmo.asBoolean(value);
            if (!value) { // close panes that are not selected (TFS 433551)
                this.panes.forEach((pane, index) => {
                    let sel = index == this.selectedIndex;
                    wijmo.toggleClass(pane.header, 'wj-state-active', sel);
                    wijmo.setAttribute(pane.header, 'aria-expanded', sel)
                });
            }
        }
    }
    /**
     * Gets an {@link AccordionPane} by id or by header content.
     * 
     * @param id Id of the {@link AccordionPane} to retrieve.
     */
    getPane(id: string): AccordionPane {

        // by id
        for (let i = 0; i < this._panes.length; i++) {
            let pane = this._panes[i] as AccordionPane;
            if (pane.header.id == id || pane.content.id == id) {
                return pane;
            }
        }

        // by content
        for (let i = 0; i < this._panes.length; i++) {
            let pane = this._panes[i] as AccordionPane;
            if (pane.header.textContent == id) {
                return pane;
            }
        }

        // not found
        return null;
    }

    /**
     * Occurs when the value of the {@link selectedIndex} property changes.
     */
    readonly selectedIndexChanged = new wijmo.Event<Accordion, wijmo.EventArgs>();
    /**
     * Raises the {@link selectedIndexChanged} event.
     */
    onSelectedIndexChanged(e?: wijmo.EventArgs) {
        this.selectedIndexChanged.raise(this, e);
    }

    // ** internal stuff

    // fill header and pane elements based on the _panes array
    _populateControl() {
        let selIndex = -1,
            host = this.hostElement;
        this._panes.forEach((pane: AccordionPane, index) => {
            wijmo.assert(pane instanceof AccordionPane, 'panes array must contain AccordionPane objects.');
            pane._setAccordion(this);

            // add pane header
            let hdr = pane.header;
            wijmo.addClass(hdr, 'wj-header');
            wijmo.setAttribute(hdr, 'role', 'button');
            // http://www.heydonworks.com/article/aria-controls-is-poop
            //setAttribute(hdr, 'aria-controls', pane.id ? pane.id : null);
            host.appendChild(hdr);

            // add pane content
            let content = pane.content;
            wijmo.addClass(content, 'wj-content');
            wijmo.setAttribute(content, 'role', 'region');
            wijmo.setAttribute(content, 'aria-labelledby', hdr.id ? hdr.id : null);
            host.appendChild(content);

            // keep track of selected pane in the mark up
            if (selIndex < 0) {
                if (wijmo.hasClass(hdr, _CLS_ACTIVE) || hdr.getAttribute('aria-expanded') == 'true') {
                    selIndex = index;
                }
            }
        });

        // make sure a pane is selected (causes flicker: TFS 432679)
        //if (selIndex < 0 && this._panes.length > 0) {
        //    selIndex = 0;
        //}

        // apply the selection
        if (selIndex > -1) {
            this.selectedIndex = selIndex;
        } else if (this.selectedIndex > -1 && this.selectedIndex < this._panes.length) {
            this._updateContent();
        }

        // validate the selection
        this._validateSelection();
    }

    // ensure the current tab is not disabled or invisible
    _validateSelection() {
        let pane = this.selectedPane;
        if (pane) {
            if (pane.isDisabled || !pane.isVisible) {
                let index = this._getNextIndex(this.selectedIndex, 1);
                if (index < 0) {
                    index = this._getNextIndex(this.selectedIndex, -1);
                }
                this.selectedIndex = index;
            }
        }
    }

    // update pane headers and content based on the _panes array and selected index
    private _updateContent() {
        let focus = wijmo.contains(this.hostElement, wijmo.getActiveElement()),
            selIndex = this._selectedIndex,
            panes = this._panes,
            animList = [];

        // update all pane headers and content
        panes.forEach((pane, index) => {
            let hdr = pane.header,
                sel = index == selIndex,
                visible = wijmo.hasClass(hdr, _CLS_ACTIVE),
                active = sel || (visible && this._alExpandMany && pane != this._hidePane);

            // build pane animation array
            let show = active && !visible,
                hide = visible && !active;
            if (this._animated) {
                if (show || hide) {
                    animList.push({
                        show: show,
                        pane: pane,
                    });
                }
            }
            
            // update header attributes and active class if not animating (less flicker)
            wijmo.setAttribute(hdr, 'aria-expanded', active);
            if (!this._animated) {
                wijmo.toggleClass(hdr, _CLS_ACTIVE, active);
            }
            hdr.tabIndex = (sel || !this._autoSwitch) ? this._orgTabIndex : -1;

            // update focus, invalidate Wijmo controls
            if (sel) {
                if (focus) {
                    hdr.focus();
                }
                if (!this._szObserver) {
                    wijmo.Control.invalidateAll(pane.content);
                }
            }
        });

        // animate panes
        if (this._animated && animList.length) {

            // get everyone's height, start animation
            animList.forEach(item => {
                wijmo.toggleClass(item.pane.header, _CLS_ACTIVE, true);
                item.height = item.pane.content.offsetHeight;
                if (item.show) {
                    item.pane.content.style.height = '0'
                }
            });

            // animate heights
            wijmo.animate(pct => {
                if (pct < 1) {
                    animList.forEach(item => {
                        let height = item.height * (item.show ? pct : (1 - pct));
                        item.pane.content.style.height = height.toFixed(0) + 'px';
                    });
                } else { // clean up
                    animList.forEach(item => {
                        item.pane.content.style.height = '';
                        wijmo.toggleClass(item.pane.header, _CLS_ACTIVE, item.show);
                    });
                }
            });
        }

        // done with hidePane...
        this._hidePane = null;
    }

    // handle clicks on the pane headers
    private _click(e: MouseEvent) {
        let index = this._getPaneIndex(e.target as HTMLElement);
        if (index > -1) {
            let panes = this._panes,
                pane = panes[index] as AccordionPane;
            if (!pane.isDisabled && pane.isVisible) { // TFS 348667
                let visible = wijmo.hasClass(pane.header, _CLS_ACTIVE);
                if (!visible || this._autoSwitching) {

                    // if the current pane is not visible, expand it
                    this.selectedIndex = index;

                } else {

                    // get the index of the pane that will become current
                    let newIndex = -1;
                    for (let i = 1; i < panes.length; i++) {
                        let j = (index + i) % panes.length;
                        let pane = panes[j];
                        if (wijmo.hasClass(pane.header, _CLS_ACTIVE)) {
                            newIndex = j;
                            break;
                        }
                    }

                    // show the new pane and hide this one
                    if (newIndex > -1 || this._alCollapseAll) {
                        this._hidePane = pane;
                        this.selectedIndex = newIndex;
                    }
                }
            }
        }
    }

    // handle cursor keys on the tab headers
    private _keydown(e: KeyboardEvent) {
        if (!e.defaultPrevented) {
            let index = this._getPaneIndex(wijmo.getActiveElement());
            if (index > -1) {

                // reverse left/right keys when rendering in right-to-left
                let keyCode = this._getKeyCode(e);

                // go handle the key
                switch (keyCode) {
                    case wijmo.Key.Left:
                    case wijmo.Key.Up:
                    case wijmo.Key.Right:
                    case wijmo.Key.Down:
                    case wijmo.Key.Home:
                    case wijmo.Key.PageUp:
                    case wijmo.Key.End:
                    case wijmo.Key.PageDown:
                        switch (keyCode) {
                            case wijmo.Key.Left:
                            case wijmo.Key.Up:
                                index = this._getNextIndex(index, -1);
                                break;
                            case wijmo.Key.Right:
                            case wijmo.Key.Down:
                                index = this._getNextIndex(index, +1);
                                break;
                            case wijmo.Key.Home:
                            case wijmo.Key.PageUp:
                                index = this._getNextIndex(-1, +1);
                                break;
                            case wijmo.Key.End:
                            case wijmo.Key.PageDown:
                                index = this._getNextIndex(this._panes.length, -1);
                                break;
                        }
                        if (index > -1) {
                            let pane = this._panes[index];
                            if (this._autoSwitch) {
                                this._autoSwitching = true;
                                pane.header.click();
                                this._autoSwitching = false;
                            } else {
                                pane.header.focus();
                            }
                        }
                        e.preventDefault();
                        break;
                    case wijmo.Key.Enter:
                    case wijmo.Key.Space:
                        if (index > -1) {
                            let pane = this._panes[index];
                            pane.header.click();
                        }
                        e.preventDefault();
                        break;
                }
            }
        }
    }

    // gets the pane index from an element in the pane header
    private _getPaneIndex(e: HTMLElement): number {
        let hdr = wijmo.closest(e, '.wj-header');
        if (hdr && wijmo.closest(hdr, '.wj-accordion') == this.hostElement) {
            for (let i = 0; i < this._panes.length; i++) {
                if (this._panes[i].header == hdr) {
                    return i;
                }
            }
        }
        return -1;
    }

    // gets a visible/enabled tab index given a start and a step
    private _getNextIndex(index: number, step: number): number {
        for (let i = index + step; i > -1 && i < this._panes.length; i += step) {
            let pane = this._panes[i] as AccordionPane;
            if (!pane.isDisabled && pane.isVisible) {
                return i;
            }
        }
        return -1;
    }
}

/**
 * Represents a pane in an {@link Accordion} control.
 * 
 * Panes have two elements: header and content. 
 * The header displays the pane title and the content is a 
 * collapsible element that shows the pane content.
 */
export class AccordionPane {
    private _hdr: HTMLElement;
    private _content: HTMLElement;
    private _acc: Accordion;

    /**
     * Initializes a new instance of the {@link AccordionPane} class.
     * 
     * @param header Element or CSS selector for the element that contains the pane header.
     * @param content Element or CSS selector for the element that contains the pane content.
     */
    constructor(header: any, content: any) {
        this._hdr = wijmo.asType(wijmo.getElement(header), HTMLElement) as HTMLElement;
        this._content = wijmo.asType(wijmo.getElement(content), HTMLElement) as HTMLElement;
    }

    /**
     * Gets a reference to the {@link Accordion} that contains this Tab.
     */
    get accordion(): Accordion {
        return this._acc;
    }
    /**
     * Gets the pane's header element.
     */
    get header(): HTMLElement {
        return this._hdr;
    }
    /**
     * Gets the panes's content element.
     */
    get content(): HTMLElement {
        return this._content;
    }
    /**
     * Gets or sets a value that determines whether this {@link AccordionPane} is disabled.
     */
    get isDisabled(): boolean {
        return wijmo.hasClass(this._hdr, 'wj-state-disabled');
    }
    set isDisabled(value: boolean) {
        wijmo.toggleClass(this._hdr, 'wj-state-disabled', wijmo.asBoolean(value));
        this._acc && this._acc._validateSelection();
    }
    /**
     * Gets or sets a value that determines whether this {@link AccordionPane} is visible.
     */
    get isVisible(): boolean {
        return this._hdr.style.display != 'none';
    }
    set isVisible(value: boolean) {
        this._hdr.style.display = wijmo.asBoolean(value) ? '' : 'none';
        this._acc && this._acc._validateSelection();
    }

    // ** implementation

    // changes header/content property values
    _setParts(header: HTMLElement, content: HTMLElement) {
        header = wijmo.asType(wijmo.getElement(header), HTMLElement) as HTMLElement;
        content = wijmo.asType(wijmo.getElement(content), HTMLElement, false) as HTMLElement;
        if (this._hdr !== header || this._content !== content) {

            // save element-based property values to propagate them to the new elements
            let saveIsDisabled = this.isDisabled,
                saveIsVisible = this.isVisible;
            this._hdr = header
            this._content = content;

            // propagate element-based property values
            this.isDisabled = saveIsDisabled;
            this.isVisible = saveIsVisible;

            // go populate the control
            let acc = this.accordion;
            if (acc && !acc.panes.isUpdating) {
                acc._populateControl();
            }
        }
    }

    // changes the 'accordion' property value
    _setAccordion(accordion: Accordion) {
        this._acc = accordion;
    }
}
    }
    


    module wijmo.nav {
    



/**
 * Provides arguments for the {@link TreeView.formatItem} event.
 */
export class FormatNodeEventArgs extends wijmo.EventArgs {
    _data: any;
    _e: HTMLElement;
    _level: number;

    /**
     * Initializes a new instance of the {@link FormatNodeEventArgs} class.
     *
     * @param dataItem Data item represented by the node.
     * @param element Element that represents the node being formatted.
     * @param level The outline level of the node being formatted.
     */
    constructor(dataItem: any, element: HTMLElement, level: number) {
        super();
        this._data = dataItem;
        this._e = wijmo.asType(element, HTMLElement);
        this._level = level;
    }
    /**
     * Gets the data item being formatted.
     */
    get dataItem(): any {
        return this._data;
    }
    /**
     * Gets a reference to the element that represents the node being formatted.
     */
    get element(): HTMLElement {
        return this._e;
    }
    /**
     * Gets the outline level of the node being formatted.
     */
    get level(): number {
        return this._level;
    }
}

/**
 * Provides arguments for {@link TreeNode}-related events.
 */
export class TreeNodeEventArgs extends wijmo.CancelEventArgs {
    _node: TreeNode;

    /**
     * Initializes a new instance of the {@link TreeNodeEventArgs} class.
     *
     * @param node {@link TreeNode} that this event refers to.
     */
    constructor(node: TreeNode) {
        super();
        this._node = node;
    }
    /**
     * Gets the {@link TreeNode} that this event refers to.
     */
    get node(): TreeNode {
        return this._node;
    }
}

/**
 * Provides arguments for {@link TreeNode} drag-drop events.
 */
export class TreeNodeDragDropEventArgs extends wijmo.CancelEventArgs {
    _src: TreeNode;
    _tgt: TreeNode;
    _pos: DropPosition;

    /**
     * Initializes a new instance of the {@link TreeNodeEventArgs} class.
     *
     * @param dragSource {@link TreeNode} being dragged.
     * @param dropTarget {@link TreeNode} where the source is being dropped.
     * @param position {@link DropPosition} that this event refers to.
     */
    constructor(dragSource: TreeNode, dropTarget: TreeNode, position: DropPosition) {
        super();
        this._src = wijmo.asType(dragSource, TreeNode);
        this._tgt = wijmo.asType(dropTarget, TreeNode)
        this._pos = position;
    }
    /**
     * Gets a reference to the {@link TreeNode} being dragged.
     */
    get dragSource(): TreeNode {
        return this._src;
    }
    /**
     * Gets a reference to the current {@link TreeNode} target.
     */
    get dropTarget(): TreeNode {
        return this._tgt;
    }
    /**
     * Gets or sets the {@link DropPosition} value that specifies where
     * the {@link TreeNode} will be dropped.
     */
    get position(): DropPosition {
        return this._pos;
    }
    set position(value: DropPosition) {
        this._pos = wijmo.asEnum(value, DropPosition);
    }
}

/**
 * Specifies the position where a {@link TreeNode} is being dropped during
 * a drag and drop operation.
 */
export enum DropPosition {
    /** The node will become the previous sibling of the target node. */
    Before,
    /** The node will become the next sibling of the target node. */
    After,
    /** The node will become the last child of the target node. */
    Into
}
    }
    


    module wijmo.nav {
    




/**
 * Class that represents a node in a {@link TreeView}.
 */
export class TreeNode {
    _t: TreeView;
    _e: HTMLElement;

    /**
     * Initializes a new instance of a {@link TreeNode}.
     *
     * @param treeView {@link TreeView} that contains the node.
     * @param nodeElement HTML element that represents the node on the {@link TreeView}.
     */
    constructor(treeView: TreeView, nodeElement: HTMLElement) {

        // special case: virtual node in empty tree
        if (wijmo.hasClass(nodeElement, 'wj-treeview')) {
            treeView = wijmo.Control.getControl(nodeElement) as TreeView;
            nodeElement = null;
        } else {
            TreeNode._assertNode(nodeElement);
        }

        this._t = treeView;
        this._e = nodeElement;
    }

    /**
     * Gets the data item that this node represents.
     */
    get dataItem(): any {
        return this._e[TreeView._DATAITEM_KEY]
    }
    /**
     * Gets the HTML element that represents this node on the {@link TreeView}.
     */
    get element(): HTMLElement {
        return this._e;
    }
    /**
     * Gets a reference to the {@link TreeView} that contains this node.
     */
    get treeView(): TreeView {
        return this._t;
    }
    /**
     * Ensures that a node is visible by expanding any collapsed
     * ancestors and scrolling the element into view.
     */
    ensureVisible() {

        // make sure all parents are expanded
        for (let p = this.parentNode; p; p = p.parentNode) {
            p.isCollapsed = false;
        }

        // scroll into view
        let host = this._t.hostElement,
            rco = this.element.getBoundingClientRect(),
            rcc = host.getBoundingClientRect();
        if (rco.bottom > rcc.bottom) {
            host.scrollTop += rco.bottom - rcc.bottom;
        } else if (rco.top < rcc.top) {
            host.scrollTop -= rcc.top - rco.top;
        }
    }
    /**
     * Checks whether this node refers to the same element as another node.
     *
     * @param node @TreeNode to compare with this one.
     */
    equals(node: TreeNode): boolean {
        return node != null && node.element == this.element;
    }
    /**
     * Selects this node.
     */
    select() {
        let tree = this._t;

        // remove selection from previously selected node
        let selNode = tree._selNode,
            ariaSelected = 'aria-selected';
        if (!this.equals(selNode)) {

            // de-select previous node
            if (selNode) {
                wijmo.removeClass(selNode.element, TreeView._CSEL);
                wijmo.setAttribute(selNode.element, ariaSelected, false);
            }

            // select this node
            tree._selNode = this;
            wijmo.addClass(this.element, TreeView._CSEL);
            wijmo.setAttribute(this.element, ariaSelected, true);
            this.ensureVisible();

            // update tree's tabindex/focus
            tree._updateFocus(selNode);

            // raise event
            tree.onSelectedItemChanged();
        }
    }
    /**
     * Gets this node's index within the parent's node collection.
     */
    get index(): number {
        let index = 0;
        for (let p = this._pse(this.element); p; p = this._pse(p)) {
            if (TreeNode._isNode(p)) {
                index++;
            }
        }
        return index;
    }
    /**
     * Gets this node's parent node.
     *
     * This property returns null for top-level nodes.
     */
    get parentNode(): TreeNode {
        let parent = null;
        if (this._e) {
            let nodeList = this._e.parentElement;
            TreeNode._assertNodeList(nodeList);
            parent = this._pse(nodeList);
        }
        return parent ? new TreeNode(this._t, parent) : null;
    }
    /**
     * Gets this node's level.
     *
     * Top-level nodes have level zero.
     */
    get level(): number {
        let level = -1;
        for (let e: TreeNode = this; e; e = e.parentNode) {
            level++;
        }
        return level;
    }
    /**
     * Gets a value that indicates whether this node has child nodes.
     */
    get hasChildren(): boolean {
        return TreeNode._isNode(this._e) && !TreeNode._isEmpty(this._e);
    }
    /**
     * Gets a value that indicates whether this node has pending child nodes
     * that will be lazy-loaded when the node is expanded.
     */
    get hasPendingChildren(): boolean {
        return this.isCollapsed && this.hasChildren &&
            !TreeNode._isNodeList(this.element.nextElementSibling as HTMLElement) &&
            wijmo.isFunction(this._t.lazyLoadFunction);
    }
    /**
     * Gets an array containing this node's child nodes.
     *
     * This property returns null if the node has no children.
     */
    get nodes(): TreeNode[] {
        return this.hasChildren
            ? TreeNode._getChildNodes(this._t, this._e.nextSibling as HTMLElement)
            : null;
    }
    /**
     * Gets the HTMLInputElement that represents the checkbox associated
     * with this node.
     */
    get checkBox(): HTMLInputElement {
        return this._e.querySelector('input.' + TreeView._CNDC) as HTMLInputElement;
    }
    /**
     * Gets or sets a value that determines whether this node is expanded or collapsed.
     */
    get isCollapsed(): boolean {
        return this.hasChildren && wijmo.hasClass(this._e, TreeView._CCLD);
    }
    set isCollapsed(value: boolean) {
        if (value != this.isCollapsed) {
            let tree = this._t,
                e = new TreeNodeEventArgs(this);
            if (tree.onIsCollapsedChanging(e)) {
                this.setCollapsed(wijmo.asBoolean(value), tree.isAnimated, tree.autoCollapse);
                tree.onIsCollapsedChanged(e);
            }
        }
    }
    /**
     * Gets or sets a value that determines whether this node is checked.
     *
     * When the value of this property changes, child and ancestor nodes
     * are automatically updated, and the parent {@link TreeView}'s
     * {@link TreeView.checkedItemsChanged} event is raised.
     */
    get isChecked(): boolean {
        let cb = this.checkBox;
        return cb && !cb.indeterminate ? cb.checked : null;
    }
    set isChecked(value: boolean) {
        if (value != this.isChecked) {
            let tree = this._t,
                e = new TreeNodeEventArgs(this);
            if (tree.onIsCheckedChanging(e)) {
                this.setChecked(wijmo.asBoolean(value), true);
                tree.onIsCheckedChanged(e);
            }
        }
    }
    /**
     * Gets or sets a value that determines whether this node is disabled.
     *
     * Disabled nodes cannot get mouse or keyboard events.
     * 
     * If the {@link collapseWhenDisabled} proprety is set to true, disabling
     * a node also collapses it.
     */
    get isDisabled(): boolean {
        return this._e && this._e.getAttribute('disabled') != null;
    }
    set isDisabled(value: boolean) {
        value = wijmo.asBoolean(value, true);
        if (value != this.isDisabled) {
            wijmo.enable(this._e, !value);
            if (this.isDisabled && this._t && this._t.collapseWhenDisabled) { // collapse disabled nodes (TFS 237382)
                this.isCollapsed = true;
            }
        }
    }
    /**
     * Gets a reference to the previous node in the view.
     *
     * @param visible Whether to return only visible nodes (whose ancestors are not collapsed).
     * @param enabled Whether to return only enabled nodes (whose ancestors are not disabled).
     */
    previous(visible?: boolean, enabled?: boolean): TreeNode {

        // get previous sibling
        let prev = this._pse(this._e);

        // handle first on a node list
        if (!prev && TreeNode._isNodeList(this._e.parentElement)) {
            prev = this._pse(this._e.parentElement);
        }

        // handle nodelists
        if (TreeNode._isNodeList(prev)) {
            while (TreeNode._isNodeList(prev) && prev.childElementCount) { // TFS 246982
                prev = prev.lastChild as HTMLElement;
            }
            if (TreeNode._isNodeList(prev)) {
                prev = this._pse(prev);
            }
        }

        // get previous node
        let node = TreeNode._isNode(prev) ? new TreeNode(this._t, prev) : null;

        // skip invisible and disabled nodes
        if (visible && node && !node.element.offsetHeight) {
            node = node.previous(visible, enabled);
        }
        if (enabled && node && node.isDisabled) {
            node = node.previous(visible, enabled);
        }

        // done
        return node;
    }
    /**
     * Gets a reference to the next node in the view.
     *
     * @param visible Whether to return only visible nodes (whose ancestors are not collapsed).
     * @param enabled Whether to return only enabled nodes (whose ancestors are not disabled).
     */
    next(visible?: boolean, enabled?: boolean): TreeNode {

        // get next sibling
        let next = this._e.nextSibling as HTMLElement;

        // handle nodelists
        if (TreeNode._isNodeList(next)) {
            next = next.childElementCount
                ? next.firstChild as HTMLElement// first node on the expanded list
                : next.nextSibling as HTMLElement; // next node after the collapsed list
        }

        // handle last on a node list (TFS 246982)
        if (!next) {
            for (let e = this._e.parentElement; !next && TreeNode._isNodeList(e); e = e.parentElement) {
                next = e.nextSibling as HTMLElement;
            }
        }

        // get next node
        let node = TreeNode._isNode(next) ? new TreeNode(this._t, next) : null;

        // skip invisible and disabled nodes
        if (visible && node && !node.element.offsetHeight) {
            node = node.next(visible, enabled);
        }
        if (enabled && node && node.isDisabled) {
            node = node.next(visible, enabled);
        }

        // done
        return node;
    }
    /**
     * Gets a reference to the previous sibling node in the view.
     */
    previousSibling(): TreeNode {
        let prev = this._pse(this.element);
        while (TreeNode._isNodeList(prev)) {
            prev = this._pse(prev);
        }
        return prev ? new TreeNode(this._t, prev) : null;
    }
    /**
     * Gets a reference to the next sibling node in the view.
     */
    nextSibling(): TreeNode {
        let next = this.element.nextSibling as HTMLElement;
        if (TreeNode._isNodeList(next)) {
            next = next.nextSibling as HTMLElement;
        }
        return next ? new TreeNode(this._t, next) : null;
    }
    /**
     * Sets the collapsed state of the node.
     *
     * @param collapsed Whether to collapse or expand the node.
     * @param animate Whether to use animation when applying the new state.
     * @param collapseSiblings Whether to collapse sibling nodes when expanding
     * this node.
     */
    setCollapsed(collapsed: boolean, animate?: boolean, collapseSiblings?: boolean) {

        // get node and child elements
        let tree = this._t,
            node = this._e,
            list = this._e.nextElementSibling as HTMLElement,
            hasList = TreeNode._isNodeList(list);

        // accessibility: https://www.w3.org/TR/wai-aria-1.1/#tree
        wijmo.setAttribute(node, 'aria-expanded', hasList ? (!collapsed).toString() : null)

        // don't waste time...
        if (collapsed == this.isCollapsed) {
            return;
        }

        // handle lazy-loading
        if (!collapsed && !hasList && wijmo.isFunction(tree.lazyLoadFunction)) {
            tree._lazyLoadNode(this);
            return;
        }

        // resolve default parameters
        if (animate == null) {
            animate = tree.isAnimated;
        }
        if (collapseSiblings == null) {
            collapseSiblings = tree.autoCollapse;
        }

        // update collapsed state
        if (!animate) {
            wijmo.toggleClass(node, TreeView._CCLD, collapsed);
        } else {
            if (hasList) {
                let h = list.offsetHeight,
                    s = list.style,
                    host = tree.hostElement,
                    treeStyle = host.style;

                // if we don't have a scrollbar now, hide overflow to prevent flicker
                // while expanding/collapsing (TFS 325989)
                if (host.scrollHeight <= host.clientHeight) {
                    treeStyle.overflowY = 'hidden';
                }

                if (!collapsed) { // expanding
                    wijmo.toggleClass(node, TreeView._CCLD, false);
                    s.height = s.opacity = '0';
                    wijmo.animate((pct: number) => {
                        if (pct >= 1) {
                            s.height = s.opacity = treeStyle.overflowY = '';
                        } else {
                            s.height = (pct * h).toFixed(0) + 'px';
                        }
                    }, TreeView._AN_DLY);
                } else { // collapsing
                    wijmo.toggleClass(node, TreeView._CCLG, true);
                    wijmo.animate((pct: number) => {
                        if (pct < 1) {
                            pct = 1 - pct;
                            s.height = (pct * h).toFixed(0) + 'px';
                        } else {
                            s.height = s.opacity = treeStyle.overflowY = '';
                            wijmo.toggleClass(node, TreeView._CCLD, true);
                            wijmo.toggleClass(node, TreeView._CCLG, false);
                        }
                    }, TreeView._AN_DLY);
                }
            }
        }

        // when expanding an item in a node list, collapse all siblings
        if (!collapsed && collapseSiblings) {
            let list = node.parentElement;
            if (TreeNode._isNodeList(list)) {
                for (let i = 0; i < list.children.length; i++) {
                    let sibling = list.children[i] as HTMLElement;
                    if (sibling != node && TreeNode._isNode(sibling)) {
                        wijmo.toggleClass(sibling, TreeView._CCLD, true);

                        // accessibility: https://www.w3.org/TR/wai-aria-1.1/#tree
                        sibling.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        }
    }
    /**
     * Sets the checked state of this node and its children.
     *
     * @param checked Whether to check or uncheck the node and its children.
     * @param updateParent Whether to update the checked state of this node's
     * ancestor nodes.
     */
    setChecked(checked: boolean, updateParent?: boolean) {

        // set this node's checkbox
        let cb = this.checkBox,
            changed = cb.checked != checked;
        wijmo.setChecked(cb, checked);

        // set direct children's checkboxes
        if (this.hasChildren) {
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].setChecked(checked, false);
            }
        }

        // honor checkedMemberPath binding
        let tree = this._t;
        if (tree && tree.checkedMemberPath) {
            tree._chkPath.setValue(this.dataItem, this.level, checked);
        }

        // update parent checkboxes
        if (updateParent) {
            let parent = this.parentNode;
            if (parent) {
                parent._updateCheckedState();
            }
        }

        // raise checkedItemsChanged event (once)
        if (tree && changed) {
            tree._raiseCheckedItemsChanged();
        }
    }
    /**
     * Removes this {@link TreeNode} from a {@link TreeView}.
     */
    remove() {
        let tree = this._t,
            parent = this.parentNode,
            arr = this._getArray(),
            index = arr.indexOf(this.dataItem);

        // if this is the selected node, select the next sibling (or previous or parent)
        if (tree.selectedNode == this) {
            tree.selectedNode = this.nextSibling() || this.previousSibling() || parent;
        }

        // remove the node element and its children from the DOM
        let next = this.element.nextSibling as HTMLElement;
        if (TreeNode._isNodeList(next)) {
            wijmo.removeChild(next);
        }
        wijmo.removeChild(this.element);

        // update parent state (hasChildren, checked)
        if (parent) {
            parent._updateState();
        }

        // update itemsSource
        arr.splice(index, 1);

        // update reference to parent TreeView
        this._t = null;
    }
    /**
     * Adds a child node at a specific position.
     *
     * @param index Index of the new child node.
     * @param dataItem Data item used to create the new node.
     * @return The {@link TreeNode} that was added.
     */
    addChildNode(index: number, dataItem: any): TreeNode {

        // create a new node
        let nd = this._t._createNode(dataItem);

        // move the node into position
        let nodes = this.nodes;
        if (!nodes) {
            nd.move(this, DropPosition.Into);
        } else if (index < nodes.length) {
            nd.move(nodes[index], DropPosition.Before);
        } else {
            nd.move(nodes[nodes.length - 1], DropPosition.After);
        }

        // return the new node
        return nd;
    }
    /**
     * Refreshes a node to reflect data changes.
     *
     * @param dataItem New node data. If not provided, the node is refreshed 
     * based on its original data item (which presumably has been updated).
     */
    refresh(dataItem?: any) {

        // save the new data item if provided, get the updated data item
        let arr = this._getArray();
        if (dataItem) {
            arr[this.index] = dataItem;
        }
        dataItem = arr[this.index];

        // create a new node based on the updated data
        let newNode = this._t._createNode(dataItem);

        // remove old children
        let nodeList = this.hasChildren && !this.hasPendingChildren
            ? this.element.nextSibling as HTMLElement
            : null;
        if (nodeList) {
            wijmo.removeChild(nodeList);
        }

        // add new children
        nodeList = newNode.hasChildren && !newNode.hasPendingChildren
            ? newNode.element.nextSibling as HTMLElement
            : null;
        if (nodeList) {
            this.element.parentElement.insertBefore(nodeList, this.element.nextSibling);
        }

        // replace the node content
        this.element.innerHTML = newNode.element.innerHTML;

        // update the node state
        this._updateState();
    }
    /**
     * Moves this {@link TreeNode} to a new position on the {@link TreeView}.
     *
     * @param refNode Reference {@link TreeNode} that defines the location
     * where the node will be moved.
     * @param position Whether to move the node before, after, or into
     * the reference node.
     * @return True if the node was moved successfully.
     */
    move(refNode: any, position: DropPosition): boolean {

        // check that the refNode is not a child of this node
        if (refNode instanceof TreeNode && this._contains(refNode)) {
            return false;
        }

        // save old parent, item array
        let parentOld = this.parentNode,
            arrOld = this._getArray();

        // move elements
        this._moveElements(refNode, position);

        // update tree reference (in case the node moved to a different onr)
        if (refNode.treeView) {
            this._t = refNode.treeView;
        }

        // update old and new parent's state (hasChildren, checked)
        if (parentOld) {
            parentOld._updateState();
        }
        let parentNew = this.parentNode;
        if (parentNew) {
            parentNew._updateState();
        }

        // update itemsSource arrays
        let item = this.dataItem,
            index = arrOld.indexOf(item),
            arrNew = this._getArray();
        arrOld.splice(index, 1);
        arrNew.splice(this.index, 0, item);

        // all done
        return true;
    }
    /**
     * Gets the array that contains the items for this {@link TreeNode}.
     *
     * This property is read-only. It returns an array that is a
     * member of the parent {@link TreeView}'s {@link TreeView.itemsSource} array.
     */
    get itemsSource(): any[] {
        return this._getArray();
    }

    // ** private stuff

    // gets an element's previous element sibling
    _pse(e: HTMLElement): HTMLElement {
        return e.previousElementSibling as HTMLElement;
    }

    // checks whether this node contains another
    _contains(node: TreeNode): boolean {
        for (; node; node = node.parentNode) {
            if (node.element == this.element) {
                return true;
            }
        }
        return false;
    }

    // gets the array that contains this node's data item
    _getArray(): any[] {
        let tree = this._t,
            parent = this.parentNode,
            arr: any = tree.itemsSource;
        if (parent) {
            let path = tree._itmPath;
            arr = path.getValue(parent.dataItem, this.level);
            if (!arr) {
                arr = [];
                path.setValue(parent.dataItem, this.level, arr);
            }
        }
        return arr;
    }

    // move node elements to a new position in the tree
    _moveElements(refNode: any, position: DropPosition) {

        // grab this node's elements into a fragment
        let frag = document.createDocumentFragment(),
            nodeList = this.hasChildren && !this.hasPendingChildren
                ? this.element.nextSibling as HTMLElement
                : null;
        frag.appendChild(this.element);
        if (nodeList) {
            TreeNode._assertNodeList(nodeList);
            frag.appendChild(nodeList);
        }

        // if the refNode is a TreeView, append and be done
        if (refNode instanceof TreeView) {
            refNode._root.insertBefore(frag, null);
            return;
        }

        // get reference node's parent so we can move this node into it
        let ref = refNode.element,
            parent = (ref ? ref.parentElement : refNode.treeView._root) as HTMLElement;
        TreeNode._assertNodeList(parent);

        // insert fragment at the proper position
        let dp = DropPosition;
        switch (position) {
            case dp.Before:
                parent.insertBefore(frag, ref);
                break;
            case dp.After:
                refNode = refNode.nextSibling();
                ref = refNode ? refNode.element : null;
                parent.insertBefore(frag, ref);
                break;
            case dp.Into:
                if (!refNode.hasChildren || refNode.hasPendingChildren) {
                    nodeList = document.createElement('div');
                    wijmo.addClass(nodeList, TreeView._CNDL);
                    parent.insertBefore(nodeList, ref.nextSibling);
                }
                parent = refNode.element.nextSibling as HTMLElement;
                TreeNode._assertNodeList(parent);
                parent.insertBefore(frag, null); // append to list
                break;
        }
    }

    // update node state after a move operation
    _updateState() {
        this._updateEmptyState();
        this._updateCheckedState();
    }

    // update node empty state
    _updateEmptyState() {

        // check whether we have child nodes, remove empty child lists
        let nodeList = this.element.nextSibling as HTMLElement,
            hasChildren = false;
        if (TreeNode._isNodeList(nodeList)) {
            if (nodeList.childElementCount) {
                hasChildren = true;
            } else {
                wijmo.removeChild(nodeList);
            }
        }

        // update the node's empty attribute
        wijmo.toggleClass(this.element, TreeView._CEMP, !hasChildren);

        // can't be expanded without children
        if (!hasChildren) {
            this.element.removeAttribute('aria-expanded');
        }

    }

    // update node checked state
    _updateCheckedState() {
        let tree = this._t,
            cb = this.checkBox,
            nodes = this.nodes,
            checked = 0,
            unchecked = 0,
            indeterminate = false; // TFS 466726

        // update this node's checked state
        if (cb && nodes) {
            for (let i = 0; i < nodes.length && !indeterminate; i++) {
                switch (nodes[i].isChecked) {
                    case true:
                        checked++;
                        break;
                    case false:
                        unchecked++;
                        break;
                    case null:
                        indeterminate = true;
                        break;
                }
                if (checked && unchecked) {
                    indeterminate = true; // no need to check everyone
                }
            }
            wijmo.setChecked(cb, indeterminate ? null : checked > 0);

            // honor checkedMemberPath binding
            if (tree && tree.checkedMemberPath) {
                let value = indeterminate ? null : cb.checked;
                tree._chkPath.setValue(this.dataItem, this.level, value);
            }
        }

        // move up one level
        let parent = this.parentNode;
        if (parent) {
            parent._updateCheckedState();
        }
    }

    // gets the child nodes from a nodeList
    static _getChildNodes(treeView: TreeView, nodeList: HTMLElement): TreeNode[] {
        let arr = [];
        if (TreeNode._isNodeList(nodeList)) {
            let children = nodeList.children;
            for (let i = 0; i < children.length; i++) {
                let child = children[i] as HTMLElement;
                if (TreeNode._isNode(child)) {
                    arr.push(new TreeNode(treeView, child));
                }
            }
        }
        return arr;
    }

    // static methods to check for node state/type based on their class
    static _isNode(e: HTMLElement): boolean {
        return e && wijmo.hasClass(e, TreeView._CND);
    }
    static _isNodeList(e: HTMLElement): boolean {
        return e && wijmo.hasClass(e, TreeView._CNDL);
    }
    static _isEmpty(node: HTMLElement): boolean {
        return TreeNode._isNode(node) && wijmo.hasClass(node, TreeView._CEMP);
    }
    static _isCollapsed(node: HTMLElement): boolean {
        return TreeNode._isNode(node) && !TreeNode._isEmpty(node) && wijmo.hasClass(node, TreeView._CCLD);
    }
    static _assertNode(node: HTMLElement) {
        wijmo.assert(TreeNode._isNode(node), 'node expected');
    }
    static _assertNodeList(nodeList: HTMLElement) {
        wijmo.assert(TreeNode._isNodeList(nodeList), 'nodeList expected');
    }
}
    }
    


    module wijmo.nav {
    

/**
 * Class that handles hierarchical (multi-level) bindings.
 */
export class _BindingArray {
    _path: any;
    _bindings: wijmo.Binding[];
    _maxLevel: number;

    /**
     * Initializes a new instance of a _BindingArray.
     *
     * @param path String or array of strings to create bindings from.
     */
    constructor(path?: any) {
        this.path = path;
    }

    /**
     * Gets or sets the names of the properties used for binding.
     */
    get path(): any {
        return this._path;
    }
    set path(value: any) {
        this._path = value;
        if (wijmo.isString(value)) {
            this._bindings = [
                new wijmo.Binding(value)
            ]
        } else if (wijmo.isArray(value)) {
            this._bindings = [];
            for (let i = 0; i < value.length; i++) {
                this._bindings.push(new wijmo.Binding(value[i]));
            }
        } else if (value != null) {
            wijmo.assert(false, 'Path should be a string or an array of strings.');
        }
        this._maxLevel = this._bindings ? this._bindings.length - 1 : -1;
    }
    /**
     * Gets the binding value for a given data item at a given level.
     *
     * @param dataItem Object that contains the data.
     * @param level Binding level to use for retrieving the data.
     */
    getValue(dataItem: any, level: number) {
        let index = Math.min(level, this._maxLevel);
        return index > -1 ? this._bindings[index].getValue(dataItem) : null;
    }
    /**
     * Sets the binding value on a given data item at a given level.
     *
     * @param dataItem Object that contains the data.
     * @param level Binding level to use for retrieving the data.
     * @param value Value to apply to the data item.
     */
    setValue(dataItem: any, level: number, value: any) {
        let index = Math.min(level, this._maxLevel);
        if (index > -1) {
            this._bindings[index].setValue(dataItem, value);
        }
    }
}

    }
    


    module wijmo.nav {
    








/**
 * Represents a function used to load child nodes asynchronously (lazy-load).
 */
export interface ILazyLoad {
    /**
     * @param node {@link TreeNode} being opened and populated.
     * @param callback {@link ILazyLoadCallback} to be invoked when the node data becomes available.
     */
    (node: TreeNode, callback: ILazyLoadCallback): void;
}
/**
 * Represents a callback method used to add lazy-loaded nodes to a {@link TreeNode}.
 */
export interface ILazyLoadCallback {
    /**
     * @param items Array containing child items for the node being lazy-loaded. 
     */
    (items: any[]): void
}

/**
 * The {@link TreeView} control displays a hierarchical list of {@link TreeNode} 
 * objects which may contain text, checkboxes, images, or arbitrary HTML 
 * content.
 *
 * A {@link TreeView} is typically used to display the headings in a document,
 * the entries in an index, the files and directories on a disk, or any other
 * kind of information that might usefully be displayed as a hierarchy.
 *
 * After creating a {@link TreeView}, you will typically set the following 
 * properties:
 *
 * <ol>
 *  <li>
 *      {@link itemsSource}: an array that contains the data to be displayed on the
 *      tree.</li>
 *  <li>
 *      {@link displayMemberPath}: the name of the data item property that contains
 *      the text to display on the nodes (defaults to 'header'), and</li>
 *  <li>
 *      {@link childItemsPath}: the name of the data item property that contains the
 *      node's child items (defaults to 'items').</li>
 * </ol>
 *
 * The {@link TreeView} control supports the following keyboard commands:
 *
 * <table>
 *   <thead>
 *     <tr><th>Key Combination</th><th>Action</th></tr>
 *   </thead>
 *   <tbody>
 *     <tr><td>Up/Down</td><td>Select the previous/next visible node</td></tr>
 *     <tr><td>Left</td><td>Collapse the selected node if it has child nodes, select the parent node otherwise</td></tr>
 *     <tr><td>Right</td><td>Expand the selected node if it has child nodes</td></tr>
 *     <tr><td>Home/End</td><td>Select the first/last visible nodes</td></tr>
 *     <tr><td>Space</td><td>Toggle the checkbox in the current node (see the {@link showCheckboxes} property)</td></tr>
 *     <tr><td>Other characters</td><td>Search for nodes that contain the text typed (multi-character auto-search)</td></tr>
 *   </tbody>
 * </table>
 *
 * The example below builds a simple tree and allows you to see the effect
 * of the TreeView's main properties:
 *
 * {@sample Nav/TreeView/Behavior/purejs Example}
 */
export class TreeView extends wijmo.Control {
    static _DATAITEM_KEY = 'wj-Data-Item'; // key used to store item reference in node elements
    static _AS_DLY = 600; // auto-search delay
    static _AN_DLY = 200; // animation delay (should match values in CSS)
    static _CND = 'wj-node';
    static _CNDL = 'wj-nodelist';
    static _CEMP = 'wj-state-empty';
    static _CNDT = 'wj-node-text';
    static _CNDC = 'wj-node-check';
    static _CSEL = 'wj-state-selected';
    static _CCLD = 'wj-state-collapsed';
    static _CCLG = 'wj-state-collapsing';
    static _CLDG = 'wj-state-loading';

    // template/parts
    /*private*/ _root: HTMLElement; // accessible to TreeNode

    // property storage
    private _items: any[];
    /*private*/ _selNode: TreeNode; // accessible to TreeNode
    /*private*/ _itmPath = new _BindingArray('items'); // accessible to TreeNode
    /*private*/ _chkPath = new _BindingArray(); // accessible to TreeNode
    private _prevSel: TreeNode;
    private _dspPath = new _BindingArray('header');
    private _imgPath = new _BindingArray();
    private _dd: _TreeDragDropManager;
    private _html = false;
    private _animated = true;
    private _chkOnClick = false;
    private _collOnClick = false;
    private _xpndOnClick = true;
    private _xpndOnLoad = true;
    private _autoColl = true;
    private _showChk = false;
    private _collapseWhenDisabled = true;
    private _chkItems: any[];
    private _ldLvl: number;
    private _srch = '';
    private _toSrch: any;
    private _lazyLoad: ILazyLoad;
    private _isDirty: boolean;
    private _srcChanged: boolean;
    private _isReadOnly = true;
    private _edtNode: TreeNode;
    private _toItemsChanged: any;

    /**
     * Gets or sets the template used to instantiate {@link TreeView} controls.
     */
    static controlTemplate = '<div wj-part="root"></div>'; // node container

    /**
     * Initializes a new instance of the {@link TreeView} class.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any) {
        super(element);

        // instantiate and apply template
        let tpl = this.getTemplate();
        this.applyTemplate('wj-control wj-content wj-treeview', tpl, {
            _root: 'root'
        });

        // accessibility: 
        // https://www.w3.org/TR/wai-aria-1.1/#tree
        // http://oaa-accessibility.org/examples/role/106/
        let host = this.hostElement;
        wijmo.setAttribute(host, 'role', 'tree', true);

        // configure root as nodeList
        wijmo.addClass(this._root, TreeView._CNDL);
        wijmo.setAttribute(this._root, 'role', 'group', true);

        // handle mouse and keyboard
        this.addEventListener(host, 'mousedown', this._mousedown.bind(this));
        this.addEventListener(host, 'click', this._click.bind(this));
        this.addEventListener(host, 'keydown', this._keydown.bind(this));
        this.addEventListener(host, 'keypress', this._keypress.bind(this));

        // prevent wheel from propagating to parent elements
        this.addEventListener(host, 'wheel', (e: WheelEvent) => {
            if (host.scrollHeight > host.offsetHeight) {
                if ((e.deltaY < 0 && host.scrollTop == 0) ||
                    (e.deltaY > 0 && host.scrollTop + host.offsetHeight >= host.scrollHeight)) {
                    e.preventDefault();
                }
            }
        });

        // finish editing when editor loses focus
        this.addEventListener(host, 'blur', () => {
            if (this._edtNode && !wijmo.contains(this._edtNode.element, wijmo.getActiveElement())) {
                this.finishEditing();
            }
        }, true);

        // prevent pasting HTML into editable nodes (TFS 383350)
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
        this.addEventListener(host, 'paste', (e: ClipboardEvent) => {
            if (this._edtNode && !this.isContentHtml) {
                let data = e.clipboardData || window['clipboardData'],
                    paste = data.getData('text'),
                    selection = window.getSelection();
                if (paste && selection.rangeCount) {
                    selection.deleteFromDocument();
                    selection.getRangeAt(0).insertNode(document.createTextNode(paste));
                    e.preventDefault();
                }
            }
        });

        // initialize control options
        this.initialize(options);

        // populate tree right away
        this.refresh();
    }

    //--------------------------------------------------------------------------
    //#region ** object model

    /**
     * Gets or sets the array that contains the {@link TreeView} items.
     *
     * {@link TreeView} #see:itemsSource arrays usually have a hierarchical
     * structure with items that contain child items. There is no fixed
     * limit to the depth of the items.
     *
     * For example, the array below would generate a tree with three
     * top-level nodes, each with two child nodes:
     *
     * ```typescript
     * import { TreeView } from '@grapecity/wijmo.nav';
     * var tree = new TreeView('#treeView', {
     *     displayMemberPath: 'header',
     *     childItemsPath: 'items',
     *     itemsSource: [
     *         { header: '1 first', items: [
     *             { header: '1.1 first child' },
     *             { header: '1.2 second child' },
     *         ] },
     *         { header: '2 second', items: [
     *             { header: '3.1 first child' },
     *             { header: '3.2 second child' },
     *         ] },
     *         { header: '3 third', items: [
     *             { header: '3.1 first child' },
     *             { header: '3.2 second child' },
     *         ] }
     *     ]
     * });
     * ```
     */
    get itemsSource(): any[] {
        return this._items;
    }
    set itemsSource(value: any[]) {
        if (this._items != value) {
            this._items = wijmo.asArray(value);
            this.onItemsSourceChanged();
            this._srcChanged = true;
            this._reload();
        }
    }
    /**
     * Gets or sets the name of the property (or properties) that contains
     * the child items for each node.
     *
     * The default value for this property is the string **"items"**.
     *
     * In most cases, the property that contains the child items is the
     * same for all data items on the tree. In these cases, set the
     * {@link childItemsPath} to that name.
     *
     * In some cases, however, items at different levels use different
     * properties to store their child items. For example, you could have
     * a tree with categories, products, and orders. In that case, you
     * would set the {@link childItemsPath} to an array such as this:
     *
     * <pre>// categories have products, products have orders:
     * tree.childItemsPath = [ 'Products', 'Orders' ];</pre>
     */
    get childItemsPath(): string | string[] {
        return this._itmPath.path;
    }
    set childItemsPath(value: string | string[]) {
        if (value != this.childItemsPath) {
            this._itmPath.path = value;
            this._reload();
        }
    }
    /**
     * Gets or sets the name of the property (or properties) to use as
     * the visual representation of the nodes.
     *
     * The default value for this property is the string **"header"**.
     *
     * In most cases, the property that contains the node text is the
     * same for all data items on the tree. In these cases, set the
     * {@link displayMemberPath} to that name.
     *
     * In some cases, however, items at different levels use different
     * properties to represent them. For example, you could have
     * a tree with categories, products, and orders. In that case, you
     * might set the {@link displayMemberPath} to an array such as this:
     *
     * <pre>// categories, products, and orders have different headers:
     * tree.displayMemberPath = [ 'CategoryName', 'ProductName', 'OrderID' ];</pre>
     */
    get displayMemberPath(): string | string[] {
        return this._dspPath.path;
    }
    set displayMemberPath(value: string | string[]) {
        if (value != this.displayMemberPath) {
            this._dspPath.path = value;
            this._reload();
        }
    }
    /**
     * Gets or sets the name of the property (or properties) to use as a
     * source of images for the nodes.
     * 
     * The default value for this property is an empty string, which 
     * means no images are added to the nodes.
     */
    get imageMemberPath(): string | string[] {
        return this._imgPath.path;
    }
    set imageMemberPath(value: string | string[]) {
        if (value != this.imageMemberPath) {
            this._imgPath.path = value;
            this._reload();
        }
    }
    /**
     * Gets or sets the name of the property (or properties) to bind
     * to the node's checked state.
     * 
     * See also the {@link showCheckboxes} property and the
     * {@link checkedItemsChanged} event.
     */
    get checkedMemberPath(): string | string[] {
        return this._chkPath.path;
    }
    set checkedMemberPath(value: string | string[]) {
        if (value != this.checkedMemberPath) {
            this._chkPath.path = value;
            this._reload();
        }
    }
    /**
     * Gets or sets a value indicating whether items are bound to 
     * plain text or HTML.
     *
     * The default value for this property is **false**.
     */
    get isContentHtml(): boolean {
        return this._html;
    }
    set isContentHtml(value: boolean) {
        if (value != this._html) {
            this._html = wijmo.asBoolean(value);
            this._reload();
        }
    }
    /**
     * Gets or sets a value that determines whether the {@link TreeView}
     * should add checkboxes to nodes and manage their state.
     *
     * This property can be used only on trees without lazy-loaded 
     * nodes (see the {@link lazyLoadFunction} property).
     *
     * See also the {@link checkedItems} property and {@link checkedItemsChanged}
     * event.
     *
     * The default value for this property is **false**.
     */
    get showCheckboxes(): boolean {
        return this._showChk;
    }
    set showCheckboxes(value: boolean) {
        if (value != this._showChk) {
            this._showChk = wijmo.asBoolean(value);
            this._reload();
        }
    }
    /**
     * Gets or sets a value that determines if sibling nodes should be 
     * collapsed when a node is expanded.
     *
     * The default value for this property is **true**, because in 
     * most cases  collapsing nodes that are not in use helps keep the 
     * UI clean.
     */
    get autoCollapse(): boolean {
        return this._autoColl;
    }
    set autoCollapse(value: boolean) {
        this._autoColl = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether nodes should be 
     * collapsed when they are disabled.
     * 
     * The default value for this property is **true**.
     */
    get collapseWhenDisabled(): boolean {
        return this._collapseWhenDisabled;
    }
    set collapseWhenDisabled(value: boolean) {
        this._collapseWhenDisabled = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that indicates whether to use animations when 
     * expanding or collapsing nodes.
     * 
     * The default value for this property is **true**.
     */
    get isAnimated(): boolean {
        return this._animated;
    }
    set isAnimated(value: boolean) {
        this._animated = wijmo.asBoolean(value);
        wijmo.toggleClass(this.hostElement, 'wj-animated', this._animated); // TFS 438995
    }
    /**
     * Gets or sets a value that determines whether users can edit the
     * text in the nodes.
     *
     * When the {@link isReadOnly} property is set to false, users may 
     * edit the content of the tree nodes by typing directly into the nodes. 
     * The F2 key can also be used to enter edit mode with the whole node 
     * content selected.
     *
     * You may customize the editing behavior using the following methods 
     * and events:
     *
     * **Methods**: {@link startEditing}, {@link finishEditing}.
     *
     * **Events**: {@link nodeEditStarting}, {@link nodeEditStarted}, 
     * {@link nodeEditEnding}, {@link nodeEditEnded}.
     *
     * The default value for this property is **true**.
     */
    get isReadOnly(): boolean {
        return this._isReadOnly;
    }
    set isReadOnly(value: boolean) {
        this._isReadOnly = wijmo.asBoolean(value);
        wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
    }
    /**
     * Starts editing a given {@link TreeNode}.
     *
     * @param node {@link TreeNode} to edit. If not provided, the currently
     * selected node is used.
     * 
     * @return True if the edit operation started successfully.
     */
    startEditing(node?: TreeNode): boolean {

        // not in read-only mode
        if (this.isReadOnly) {
            return false;
        }

        // get node to edit
        if (!node) {
            node = this.selectedNode;
        }
        if (!node || node.isDisabled) { // TFS 250004
            return false;
        }

        // finish pending edits
        if (!this.finishEditing()) {
            return false;
        }

        // get editor element
        let editor = node.element.querySelector('.' + TreeView._CNDT) as HTMLElement;
        if (!editor) {
            return false;
        }

        // starting
        let e = new TreeNodeEventArgs(node);
        if (!this.onNodeEditStarting(e)) {
            return false;
        }

        // make content editable and selected
        editor.tabIndex = 0; // important for Chrome (TFS 239219)
        editor.focus();
        editor.contentEditable = 'true';
        editor.style.cursor = 'auto';
        let rng = document.createRange();
        rng.selectNodeContents(editor);
        let sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(rng);
        editor.focus(); // important for FireFox (TFS 237528)

        // turn autocomplete/correct off (TFS 238164)
        // http://stackoverflow.com/questions/21163002/disable-autocorrect-autocompletion-in-content-editable-div
        wijmo.setAttribute(editor, 'autocomplete', 'off');
        wijmo.setAttribute(editor, 'autocorrect', 'off');

        // we are in edit mode
        this._edtNode = node;
        this.onNodeEditStarted(e);
        return true;
    }
    /**
     * Commits any pending edits and exits edit mode.
     *
     * @param cancel Whether pending edits should be canceled or committed.
     * @return True if the edit operation finished successfully.
     */
    finishEditing(cancel?: boolean): boolean {
        let node = this._edtNode;
        if (node) {

            // get editor element
            let editor = node.element.querySelector('.' + TreeView._CNDT) as HTMLElement;
            if (!editor) {
                return false;
            }

            // ending
            let e = new TreeNodeEventArgs(node);
            if (!this.onNodeEditEnding(e)) {
                return false;
            }

            // persist/restore value
            let item = node.dataItem,
                level = node.level;
            if (this.isContentHtml) {
                if (cancel) {
                    editor.innerHTML = this._dspPath.getValue(item, level);
                } else {
                    this._dspPath.setValue(item, level, editor.innerHTML);
                }
            } else {
                if (cancel) {
                    editor.textContent = this._dspPath.getValue(item, level);
                } else {
                    this._dspPath.setValue(item, level, editor.textContent);
                }
            }

            // remove selection
            let rng = document.createRange();
            rng.selectNodeContents(editor);
            let sel = getSelection();
            sel.removeAllRanges();

            // done editing
            editor.contentEditable = 'false';
            editor.style.cursor = '';
            this._edtNode = null;

            // ended
            this.onNodeEditEnded(e);
        }
        return true;
    }
    /**
     * Gets or sets a value that determines whether users can drag and drop nodes
     * within the {@link TreeView}.
     * 
     * The default value for this property is **false**.
     */
    get allowDragging(): boolean {
        return this._dd != null;
    }
    set allowDragging(value: boolean) {
        if (value != this.allowDragging) {

            // create/dispose of the _TreeViewDragDropManager
            if (wijmo.asBoolean(value)) {
                this._dd = new _TreeDragDropManager(this);
            } else {
                this._dd.dispose();
                this._dd = null;
            }

            // add/remove draggable attribute on node elements
            let nodes = this.hostElement.querySelectorAll('.' + TreeView._CND);
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                wijmo.setAttribute(node, 'draggable', this._dd ? true : null);
            }
        }
    }
    /**
     * Gets or sets a value that determines whether to toggle checkboxes 
     * when the user clicks the node header.
     *
     * The default value for this property is **false**, which causes 
     * checkboxes to be toggled only when the user clicks the checkbox
     * itself (not the node header).
     * 
     * See also the {@link showCheckboxes} property and the {@link checkedItemsChanged} event.
     */
    get checkOnClick(): boolean {
        return this._chkOnClick;
    }
    set checkOnClick(value: boolean) {
        this._chkOnClick = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether to expand collapsed 
     * nodes when the user clicks the node header.
     *
     * The default value for this property is **true**.
     * 
     * When this property is set to **false**, users have to click the
     * expand/collapse icons to collapse the node.
     * Clicking the node header will select the node if it is not selected,
     * and will start editing the node if it is selected (and if the
     * {@link isReadOnly} property is set to false).
     * 
     * See also the {@link collapseOnClick} property.
     */
    get expandOnClick(): boolean {
        return this._xpndOnClick;
    }
    set expandOnClick(value: boolean) {
        this._xpndOnClick = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether to collapse expanded 
     * nodes when the user clicks the node header.
     *
     * The default value for this property is **false**.
     * 
     * When this property is set to **false**, users have to click the
     * expand/collapse icons to collapse the node.
     * Clicking the node header will select the node if it is not selected,
     * and will start editing the node if it is selected (and if the
     * {@link isReadOnly} property is set to false).
     * 
     * See also the {@link expandOnClick} property.
     */
    get collapseOnClick(): boolean {
        return this._collOnClick;
    }
    set collapseOnClick(value: boolean) {
        this._collOnClick = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether to automatically expand the 
     * first node when the tree is loaded.
     *
     * The default value for this property is **true**. If you set it to false,
     * all nodes will be initially collapsed.
     */
    get expandOnLoad(): boolean {
        return this._xpndOnLoad;
    }
    set expandOnLoad(value: boolean) {
        this._xpndOnLoad = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets the data item that is currently selected.
     */
    get selectedItem(): any {
        return this._selNode ? this._selNode.dataItem : null;
    }
    set selectedItem(value: any) {
        if (value != this.selectedItem) {

            // load items if necessary
            if (this._isDirty) {
                this.refresh();
            }

            // apply new setting
            this.selectedNode = value ? this.getNode(value) : null;
        }
    }
    /**
     * Gets or sets the {@link TreeNode} that is currently selected.
     */
    get selectedNode(): TreeNode {
        return this._selNode;
    }
    set selectedNode(value: TreeNode) {
        if (value != this.selectedNode) {
            this._prevSel = this._selNode;
            if (value) {
                value.select();
            } else if (this._selNode) {
                var el = this._selNode.element;
                wijmo.removeClass(el, TreeView._CSEL);
                wijmo.setAttribute(el, 'aria-selected', false);
                this._selNode = null;
                this._updateFocus(this._prevSel);
                this.onSelectedItemChanged();
            }
        }
    }
    /**
     * Gets an array containing the text of all nodes from the root
     * to the currently selected node.
     */
    get selectedPath(): string[] {
        let path = [];
        for (let nd = this.selectedNode; nd; nd = nd.parentNode) {
            let text = this._dspPath.getValue(nd.dataItem, nd.level);
            path.splice(0, 0, text);
        }
        return path;
    }
    /**
     * Gets an array containing the items that are currently checked.
     *
     * The array returned includes only items that have no children.
     * This is because checkboxes in parent items are used to check
     * or uncheck the child items.
     *
     * See also the {@link showCheckboxes} property and the
     * {@link checkedItemsChanged} event.
     *
     * For example:
     *
     * ```typescript
     * import { TreeView } from '@grapecity/wijmo.nav';
     * var treeViewChk = new TreeView('#gsTreeViewChk', {
     *    displayMemberPath: 'header',
     *    childItemsPath: 'items',
     *    showCheckboxes: true,
     *    itemsSource: items,
     *    checkedItemsChanged: function (s, e) {
     *        var items = s.checkedItems,
     *            msg = '';
     *        if (items.length) {
     *            msg = '&lt;p&gt;&lt;b&gt;Selected Items:&lt;/b&gt;&lt;/p&gt;&lt;ol&gt;\r\n';
     *            for (var i = 0; i &lt; items.length; i++) {
     *                msg += '&lt;li&gt;' + items[i].header + '&lt;/li&gt;\r\n';
     *            }
     *            msg += '&lt;/ol&gt;';
     *        }
     *        document.getElementById('gsTreeViewChkStatus').innerHTML = msg;
     *    }
     * });
     * ```
     */
    get checkedItems(): any[] {
        if (this._chkItems == null) {
            let tv = TreeView,
                qry = '.' + tv._CND + '.' + tv._CEMP + ' > input:checked.' + tv._CNDC,
                chk = this._root.querySelectorAll(qry);
            this._chkItems = [];
            for (let i = 0; i < chk.length; i++) {
                let item = chk[i].parentElement[tv._DATAITEM_KEY];
                this._chkItems.push(item);
            }
        }
        return this._chkItems;
    }
    set checkedItems(value: any[]) {
        if (this.showCheckboxes) {

            // load items if necessary
            if (this._isDirty) {
                this.refresh();
            }

            // apply new setting
            let tv = TreeView,
                qry = '.' + tv._CND + '.' + tv._CEMP,
                chk = this._root.querySelectorAll(qry);
            for (let i = 0; i < chk.length; i++) {
                let node = new TreeNode(this, chk[i] as HTMLElement),
                    checked = value.indexOf(node.dataItem) > -1;
                if (node.isChecked != checked) {
                    node.isChecked = checked;
                }
            }
        }
    }
    /**
     * Checks or unchecks all checkboxes on the tree.
     *
     * @param check Whether to check or uncheck all checkboxes.
     */
    checkAllItems(check: boolean) {
        if (this.showCheckboxes) {
            let tv = TreeView,
                qry = '.' + tv._CND + '.' + tv._CEMP,
                chk = this._root.querySelectorAll(qry);
            for (let i = 0; i < chk.length; i++) {
                let node = new TreeNode(this, chk[i] as HTMLElement);
                if (node.isChecked != check) {
                    node.isChecked = check;
                }
            }
        }
    }
    /**
     * Gets the total number of items in the tree.
     */
    get totalItemCount(): number {
        let nodes = this.hostElement.querySelectorAll('.' + TreeView._CND);
        return nodes.length;
    }
    /**
     * Gets or sets a function that loads child nodes on demand.
     *
     * The {@link lazyLoadFunction} takes two parameters: the node being
     * expanded and a callback to be invoked when the data becomes
     * available.
     *
     * The callback function tells the {@link TreeView} that the node
     * loading process has been completed. It should always be called,
     * even if there are errors when loading the data.
     *
     * For example:
     *
     * ```typescript
     * import { TreeView } from '@grapecity/wijmo.nav';
     * var treeViewLazyLoad = new TreeView('#treeViewLazyLoad', {
     *    displayMemberPath: 'header',
     *    childItemsPath: 'items',
     *    itemsSource: [ // start with three lazy-loaded nodes
     *        { header: 'Lazy Node 1', items: []},
     *        { header: 'Lazy Node 2', items: [] },
     *        { header: 'Lazy Node 3', items: [] }
     *    ],
     *    lazyLoadFunction: function (node, callback) {
     *        setTimeout(function () { // simulate http delay
     *            var result = [ // simulate result
     *                { header: 'Another lazy node...', items: [] },
     *                { header: 'A non-lazy node without children' },
     *                { header: 'A non-lazy node with child nodes', items: [
     *                  { header: 'hello' },
     *                  { header: 'world' }
     *                ]}
     *            ];
     *            callback(result); // return result to control
     *        }, 2500); // simulated 2.5 sec http delay
     *    }
     *});
     * ```
     *
     * Trees with lazy-loaded nodes have some restrictions: their nodes
     * may not have checkboxes (see the {@link showCheckboxes} property) and
     * the {@link collapseToLevel} method will not expand collapsed nodes
     * that have not been loaded yet.
     */
    get lazyLoadFunction(): ILazyLoad {
        return this._lazyLoad;
    }
    set lazyLoadFunction(value: ILazyLoad) {
        if (value != this._lazyLoad) {
            this._lazyLoad = wijmo.asFunction(value) as ILazyLoad;
            this._reload();
        }
    }
    /**
     * Gets a reference to the first {@link TreeNode} in the {@link TreeView}.
     *
     * @param visible Whether to return only visible nodes (whose ancestors are not collapsed).
     * @param enabled Whether to return only enabled nodes (whose ancestors are not disabled).
     */
    getFirstNode(visible?: boolean, enabled?: boolean): TreeNode {
        let first = this.hostElement.querySelector('.' + TreeView._CND) as HTMLElement,
            node = first ? new TreeNode(this, first) : null;
        if (visible && node && !node.element.offsetHeight) {
            node = node.next(visible, enabled);
        }
        if (enabled && node && node.isDisabled) {
            node = node.next(visible, enabled);
        }
        return node;
    }
    /**
     * Gets a reference to the last {@link TreeNode} in the {@link TreeView}.
     *
     * @param visible Whether to return only visible nodes (whose ancestors are not collapsed).
     * @param enabled Whether to return only enabled nodes (whose ancestors are not disabled).
     */
    getLastNode(visible?: boolean, enabled?: boolean): TreeNode {
        let last = this.hostElement.querySelectorAll('.' + TreeView._CND + ':last-child'),
            node = last.length ? new TreeNode(this, last[last.length - 1] as HTMLElement) : null;
        if (visible && node && !node.element.offsetHeight) {
            node = node.previous(visible, enabled);
        }
        if (enabled && node && node.isDisabled) {
            node = node.previous(visible, enabled);
        }
        return node;
    }
    /**
     * Gets an array of {@link TreeNode} objects representing the nodes
     * currently loaded.
     */
    get nodes(): TreeNode[] {
        return TreeNode._getChildNodes(this, this._root);
    }
    /**
     * Gets the {@link TreeNode} object representing a given data item.
     *
     * @param item The data item to look for.
     */
    getNode(item: any): TreeNode {

        // load items if necessary
        if (this._isDirty) {
            this._loadTree();
        }

        // look for item in the tree
        let nodes = this.hostElement.querySelectorAll('.' + TreeView._CND);
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i] as HTMLElement;
            if (node[TreeView._DATAITEM_KEY] == item) {
                return new TreeNode(this, node);
            }
        }

        // not found...
        return null;
    }
    /**
     * Adds a child node at a specific position.
     *
     * @param index Index of the new child node.
     * @param dataItem Data item used to create the new node.
     * @return The {@link TreeNode} that was added.
     */
    addChildNode(index: number, dataItem: any): TreeNode {

        // create a new node
        let nd = this._createNode(dataItem);

        // move the node into position
        let nodes = this.nodes;
        if (!nodes) {
            nd.move(this, DropPosition.Into);
        } else if (index < nodes.length) {
            nd.move(nodes[index], DropPosition.Before);
        } else {
            nd.move(nodes[nodes.length - 1], DropPosition.After);
        }

        // return the new node
        return nd;
    }
    /**
     * Collapses all the tree items to a given level.
     *
     * This method will typically expand or collapse multiple nodes
     * at once. But it will not perform lazy-loading on any nodes,
     * so collapsed nodes that must be lazy-loaded will not be
     * expanded.
     *
     * @param level Maximum node level to show.
     */
    collapseToLevel(level: number) {

        // suspend animation/autoCollapse
        let animated = this._animated;
        let autoColl = this._autoColl;
        this._animated = this._autoColl = false;

        // collapse to level
        this._collapseToLevel(this.nodes, level, 0);

        // restore animation/autoCollapse
        this._animated = animated;
        this._autoColl = autoColl;
    }
    /**
     * Loads the tree using data from the current {@link itemsSource}.
     * 
     * @param preserveOutlineState Whether to preserve the outline state when loading the
     * tree data. Defaults to false.
     */
    loadTree(preserveOutlineState?: boolean) {
        this._loadTree(preserveOutlineState);
    }

    // ** events

    /**
     * Occurs when the value of the {@link itemsSource} property changes.
     */
    readonly itemsSourceChanged = new wijmo.Event<TreeView, wijmo.EventArgs>();
    /**
     * Raises the {@link itemsSourceChanged} event.
     */
    onItemsSourceChanged(e?: wijmo.EventArgs) {
        this.itemsSourceChanged.raise(this, e);
    }
    /**
     * Occurs before the tree items are generated.
     */
    readonly loadingItems = new wijmo.Event<TreeView, wijmo.CancelEventArgs>();
    /**
     * Raises the {@link loadingItems} event.
     * @return True if the event was not canceled.
     */
    onLoadingItems(e?: wijmo.CancelEventArgs): boolean {
        this.loadingItems.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the tree items have been generated.
     */
    readonly loadedItems = new wijmo.Event<TreeView, wijmo.EventArgs>();
    /**
     * Raises the {@link loadedItems} event.
     */
    onLoadedItems(e?: wijmo.EventArgs) {
        this.loadedItems.raise(this, e);
    }
    /**
     * Occurs when the user clicks an item or presses the Enter key and an item is selected.
     *
     * This event is typically used in navigation trees. Use the {@link selectedItem} property
     * to get the item that was clicked.
     */
    readonly itemClicked = new wijmo.Event<TreeView, wijmo.EventArgs>();
    /**
     * Raises the {@link itemClicked} event.
     */
    onItemClicked(e?: wijmo.EventArgs) {
        this.itemClicked.raise(this, e);
    }
    /**
     * Occurs when the value of the {@link selectedItem} property changes.
     */
    readonly selectedItemChanged = new wijmo.Event<TreeView, wijmo.EventArgs>();
    /**
     * Raises the {@link selectedItemChanged} event.
     */
    onSelectedItemChanged(e?: wijmo.EventArgs) {
        this.selectedItemChanged.raise(this, e)
    }
    /**
     * Occurs when the value of the {@link checkedItems} property changes.
     * 
     * See also the {@link showCheckboxes} and {@link checkOnClick}
     * properties.
     */
    readonly checkedItemsChanged = new wijmo.Event<TreeView, wijmo.EventArgs>();
    /**
     * Raises the {@link checkedItemsChanged} event.
     */
    onCheckedItemsChanged(e?: wijmo.EventArgs) {
        this._chkItems = null;
        this.checkedItemsChanged.raise(this, e);
    }
    /**
     * Occurs before the value of the {@link TreeNode.isCollapsed} property changes.
     */
    readonly isCollapsedChanging = new wijmo.Event<TreeView, TreeNodeEventArgs>();
    /**
     * Raises the {@link isCollapsedChanging} event.
     *
     * @param e {@link TreeNodeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onIsCollapsedChanging(e: TreeNodeEventArgs): boolean {
        this.isCollapsedChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the value of the {@link TreeNode.isCollapsed} property changes.
     */
    readonly isCollapsedChanged = new wijmo.Event<TreeView, TreeNodeEventArgs>();
    /**
     * Raises the {@link isCollapsedChanged} event.
     *
     * @param e {@link TreeNodeEventArgs} that contains the event data.
     */
    onIsCollapsedChanged(e: TreeNodeEventArgs) {
        this.isCollapsedChanged.raise(this, e);
    }
    /**
     * Occurs before the value of the {@link TreeNode.isChecked} property changes.
     */
    readonly isCheckedChanging = new wijmo.Event<TreeView, TreeNodeEventArgs>();
    /**
     * Raises the {@link isCheckedChanging} event.
     *
     * @param e {@link TreeNodeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onIsCheckedChanging(e: TreeNodeEventArgs): boolean {
        this.isCheckedChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the value of the {@link TreeNode.isChecked} property changes.
     */
    readonly isCheckedChanged = new wijmo.Event<TreeView, TreeNodeEventArgs>();
    /**
     * Raises the {@link isCheckedChanged} event.
     *
     * @param e {@link TreeNodeEventArgs} that contains the event data.
     */
    onIsCheckedChanged(e: TreeNodeEventArgs) {
        this.isCheckedChanged.raise(this, e);
    }
    /**
     * Occurs when an element representing a node has been created.
     *
     * This event can be used to format nodes for display.
     *
     * The example below uses the **formatItem** event to add a "new" 
     * badge to the right of new items on the tree.
     *
     * ```typescript
     * import { TreeView } from '@grapecity/wijmo.nav';
     * var treeViewFmtItem = new TreeView('#treeViewFmtItem', {
     *     displayMemberPath: 'header',
     *     childItemsPath: 'items',
     *     itemsSource: items,
     *     formatItem: function (s, e) {
     *         if (e.dataItem.newItem) {
     *             e.element.innerHTML +=
     *                 '&lt;img style="margin-left:6px" src="resources/new.png"/&gt;';
     *         }
     *     }
     * });
     * ```
     */
    readonly formatItem = new wijmo.Event<TreeView, FormatNodeEventArgs>(() => {
        this.invalidate();
    });
    /**
     * Raises the {@link formatItem} event.
     *
     * @param e {@link FormatNodeEventArgs} that contains the event data.
     */
    onFormatItem(e: FormatNodeEventArgs) {
        this.formatItem.raise(this, e);
    }

    // drag/drop events

    /**
     * Occurs when the user starts dragging a node.
     *
     * This event only occurs if the {@link allowDragging} property is set to true.
     *
     * You may prevent nodes from being dragged by setting the event's
     * **cancel** parameter to true.
     */
    readonly dragStart = new wijmo.Event<TreeView, TreeNodeEventArgs>();
    /**
     * Raises the {@link dragStart} event.
     *
     * @param e {@link TreeNodeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onDragStart(e: TreeNodeEventArgs): boolean {
        this.dragStart.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs while the user drags a node over other nodes on the {@link TreeView}.
     *
     * This event only occurs if the {@link allowDragging} property is set to true.
     *
     * You may prevent drop operations over certain nodes and/or positions by
     * setting the event's **cancel** parameter to true.
     */
    readonly dragOver = new wijmo.Event<TreeView, TreeNodeDragDropEventArgs>();
    /**
     * Raises the {@link dragOver} event.
     *
     * @param e {@link TreeNodeDragDropEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onDragOver(e: TreeNodeDragDropEventArgs): boolean {
        this.dragOver.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs when the user drops a on the {@link TreeView}.
     * @return True if the event was not canceled.
     */
    readonly drop = new wijmo.Event<TreeView, TreeNodeDragDropEventArgs>();
    /**
     * Raises the {@link drop} event.
     *
     * @param e {@link TreeNodeDragDropEventArgs} that contains the event data.
     */
    onDrop(e: TreeNodeDragDropEventArgs): boolean {
        this.drop.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs when the user finishes a drag/drop operation, either by dropping
     * a node into a new location or by canceling the operation with the mouse
     * or keyboard.
     */
    readonly dragEnd = new wijmo.Event<TreeView, wijmo.EventArgs>();
    /**
     * Raises the {@link dragEnd} event.
     */
    onDragEnd(e?: wijmo.EventArgs) {
        this.dragEnd.raise(this, e);
    }

    // editing events

    /**
     * Occurs before a {@link TreeNode} enters edit mode.
     */
    readonly nodeEditStarting = new wijmo.Event<TreeView, TreeNodeEventArgs>();
    /**
     * Raises the {@link nodeEditStarting} event.
     *
     * @param e {@link TreeNodeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
    */
    onNodeEditStarting(e: TreeNodeEventArgs): boolean {
        this.nodeEditStarting.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after a {@link TreeNode} has entered edit mode.
     */
    readonly nodeEditStarted = new wijmo.Event<TreeView, TreeNodeEventArgs>();
    /**
     * Raises the {@link nodeEditStarted} event.
     *
     * @param e {@link TreeNodeEventArgs} that contains the event data.
     */
    onNodeEditStarted(e: TreeNodeEventArgs) {
        this.nodeEditStarted.raise(this, e);
    }
    /**
     * Occurs before a {@link TreeNode} exits edit mode.
     */
    readonly nodeEditEnding = new wijmo.Event<TreeView, TreeNodeEventArgs>();
    /**
     * Raises the {@link nodeEditEnding} event.
     *
     * @param e {@link TreeNodeEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onNodeEditEnding(e: TreeNodeEventArgs): boolean {
        this.nodeEditEnding.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after a {@link TreeNode} has exited edit mode.
     */
    readonly nodeEditEnded = new wijmo.Event<TreeView, TreeNodeEventArgs>();
    /**
    * Raises the {@link nodeEditEnded} event.
    *
    * @param e {@link TreeNodeEventArgs} that contains the event data.
    */
    onNodeEditEnded(e: TreeNodeEventArgs) {
        this.nodeEditEnded.raise(this, e);
    }

    //--------------------------------------------------------------------------
    //#region ** overrides

    /**
     * Overridden to re-populate the tree.
     *
     * @param fullUpdate Indicates whether to update the control layout as well as the content.
     */
    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);
        if (!this.isUpdating && this._isDirty) {
            this._loadTree(true); // preserve outline state (TFS 377802)
        }
    }

    //--------------------------------------------------------------------------
    //#region ** private stuff

    // update roving focus after selection changes
    _updateFocus(oldNode: TreeNode) {
        let newNode = this._selNode;
        if (newNode) {
            newNode.element.tabIndex = this._orgTabIndex;
        }
        this.hostElement.tabIndex = newNode ? -1 : this._orgTabIndex;
        if (this.containsFocus()) {
            if (newNode) {
                newNode.element.focus();
            } else {
                this.hostElement.focus();
            }
        }
        if (oldNode) {
            oldNode.element.tabIndex = -1;
        }
    }

    // raise the checkedItemsChanged event after one or more nodes have been 
    // checked/unchecked
    _raiseCheckedItemsChanged() {
        if (this._toItemsChanged) {
            clearTimeout(this._toItemsChanged);
        }
        this._toItemsChanged = setTimeout(() => {
            this._toItemsChanged = null;
            this.onCheckedItemsChanged();
        }, 10);
    }

    // mark as dirty to reload data on the next refresh
    _reload() {
        this._isDirty = true;
        this.invalidate();
    }

    // create a new node based on a data item
    _createNode(dataItem): TreeNode {
        let t = new TreeView(document.createElement('div'), {
            expandOnLoad: this.expandOnLoad, // TFS 364722
            allowDragging: this.allowDragging, // TFS 417934
            lazyLoadFunction: this.lazyLoadFunction, // C1WEB_27541
            childItemsPath: this.childItemsPath,
            displayMemberPath: this.displayMemberPath,
            imageMemberPath: this.imageMemberPath,
            isContentHtml: this.isContentHtml,
            showCheckboxes: this.showCheckboxes,
            itemsSource: [dataItem]
        });
        return t.getFirstNode();
    }

    // select on mouse down
    private _mousedown(e: MouseEvent) {
        if (!e.defaultPrevented) {
            let ne = wijmo.closestClass(e.target, TreeView._CND) as HTMLElement,
                node = ne ? new TreeNode(this, ne) : null;
            if (node && !node.isDisabled) {
                this.selectedNode = node;
            }
        }
    }

    // click to toggle node collapsed state, to select, and to edit the node
    private _click(e: MouseEvent) {
        if (!e.defaultPrevented) {
            let nodeElement = wijmo.closestClass(e.target, TreeView._CND) as HTMLElement;
            if (nodeElement) {
                let node = new TreeNode(this, nodeElement),
                    cbSelector = 'input.' + TreeView._CNDC,
                    cb = wijmo.closest(e.target, cbSelector) as HTMLInputElement,
                    rc = nodeElement.getBoundingClientRect(),
                    offset = this.rightToLeft
                        ? rc.right - e.clientX
                        : e.clientX - rc.left;

                // ignore clicks on disabled nodes
                if (node.isDisabled) {
                    return;
                }

                // ignore clicks on nodes being edited
                if (!cb && node.equals(this._edtNode)) {
                    return;
                }

                // honor checkOnClick property
                if (!cb && this._chkOnClick) {
                    if (!node.hasChildren || offset > nodeElement.offsetHeight) {
                        cb = nodeElement.querySelector(cbSelector) as HTMLInputElement;
                    }
                }

                // save previous sel before updating the selection (TFS 467559)
                let prevSel = this._prevSel;

                // select the node and get the focus
                this.selectedNode = node;
                nodeElement.focus();

                // toggle isChecked
                if (cb) {

                    // prevent checkbox from handling the click
                    e.preventDefault();
                    e.stopPropagation();

                    // make sure checkbox is updated and raise checkedItemsChanged
                    setTimeout(() => {
                        node.isChecked = !node.isChecked;
                    });
                }

                // toggle isCollapsed or start editing
                if (!cb) {

                    // toggle isCollapsed
                    let ctrlKey = e.ctrlKey || e.metaKey,
                        collToLevel = ctrlKey && !node.hasPendingChildren,
                        isCollapsed = node.isCollapsed,
                        toggled = false;
                    if (node.hasChildren) {
                        if (offset <= nodeElement.offsetHeight) {
                            toggled = true;
                            if (collToLevel) {
                                this.collapseToLevel(isCollapsed ? node.level + 1 : node.level);
                            } else {
                                node.isCollapsed = !isCollapsed;
                            }
                        } else if (this.expandOnClick && isCollapsed) {
                            toggled = true;
                            if (collToLevel) {
                                this.collapseToLevel(node.level + 1);
                            } else {
                                node.isCollapsed = false;
                            }
                        } else if (this.collapseOnClick && !isCollapsed) {
                            toggled = true;
                            if (collToLevel) {
                                this.collapseToLevel(node.level);
                            } else {
                                node.isCollapsed = true;
                            }
                        }
                    }

                    // make sure the selected node is visible after big expand/collapse
                    if (toggled && collToLevel && this.selectedNode) {
                        this.selectedNode.ensureVisible();
                    }

                    // start editing if we didn't toggle and the selection didn't change
                    if (!toggled && !this.isReadOnly) {
                        let selNode = this.selectedNode;
                        if (selNode && selNode.equals(prevSel)) {
                            this.startEditing();
                        }
                    }
                }

                // raise itemClicked (for navigation)
                if (this.selectedItem) {
                    this.onItemClicked();
                }
            }
        }
    }

    // handle keydown (cursor keys)
    private _keydown(e: KeyboardEvent) {
        if (!e.defaultPrevented) {
            let keyCode = this._getKeyCode(e),
                node = this._selNode,
                newNode: TreeNode,
                handled = true;

            // start selection when no node is selected
            if (!node) {
                switch (keyCode) {
                    case wijmo.Key.Up:
                    case wijmo.Key.Down:
                    case wijmo.Key.Left:
                    case wijmo.Key.Right:
                    case wijmo.Key.Enter:
                    case wijmo.Key.Home:
                    case wijmo.Key.End:
                        newNode = this.getFirstNode(true, true);
                        if (newNode) {
                            this.selectedNode = newNode;
                            e.preventDefault();
                            return;
                        }
                        break;
                }
            }

            // navigate nodes
            if (node && !node.isDisabled) {

                // enter/exit editmode
                switch (keyCode) {
                    case wijmo.Key.F2:
                        this.startEditing();
                        e.preventDefault();
                        break;
                    case wijmo.Key.Escape:
                        this.finishEditing(true);
                        e.preventDefault();
                        break;
                    case wijmo.Key.Up:
                    case wijmo.Key.Down:
                        this.finishEditing();
                        break;
                    case wijmo.Key.Enter:
                        if (this._edtNode) {
                            this.finishEditing();
                            keyCode = wijmo.Key.Down;
                        } else {
                            this.startEditing()
                            e.preventDefault();
                        }
                        break;
                }

                // ignore other keys in editing mode
                if (this._edtNode) {
                    return;
                }

                // switch left/right keys in RTL mode
                if (this.rightToLeft) {
                    switch (keyCode) {
                        case wijmo.Key.Left:
                            keyCode = wijmo.Key.Right;
                            break;
                        case wijmo.Key.Right:
                            keyCode = wijmo.Key.Left;
                            break;
                    }
                }

                // handle key
                switch (keyCode) {

                    // collapse expanded nodes, select parent of collapsed/empty nodes
                    case wijmo.Key.Left:
                        if (!node.isCollapsed && node.hasChildren) {
                            node.isCollapsed = true;
                        } else {
                            node = node.parentNode;
                            if (node) {
                                node.select();
                            }
                        }
                        break;

                    // expand collapsed nodes
                    case wijmo.Key.Right:
                        if (node.isCollapsed && node.hasChildren) {
                            node.isCollapsed = false;
                        }
                        break;

                    // select previous/next
                    case wijmo.Key.Up:
                        newNode = node.previous(true, true);
                        break;
                    case wijmo.Key.Down:
                        newNode = node.next(true, true);
                        break;
                    case wijmo.Key.Home:
                        newNode = this.getFirstNode(true, true);
                        break;
                    case wijmo.Key.End:
                        newNode = this.getLastNode(true, true);
                        break;

                    // toggle checkbox on space
                    case wijmo.Key.Space:
                        if (this.selectedItem) {
                            let cb = node.checkBox;
                            if (cb) {
                                node.isChecked = cb.indeterminate || !cb.checked;
                            }
                        }
                        break;

                    // raise itemClicked on Enter
                    case wijmo.Key.Enter:
                        if (this.selectedItem) {
                            this.onItemClicked();
                        }
                        break;

                    // allow default handling
                    default:
                        handled = false;
                }
                if (handled) {

                    // ignore event
                    e.preventDefault();

                    // update selection
                    if (newNode) {
                        newNode.select();
                    }
                }
            }
        }
    }

    // handle keypress (select/search)
    private _keypress(e: KeyboardEvent) {
        if (!e.defaultPrevented) {

            // don't interfere with the browser (TFS 297316)
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            // don't interfere with inner input elements (TFS 132081)
            if (e.target instanceof HTMLInputElement) return;
            if (this._edtNode) return;

            // start editing?
            if (e.charCode > 32 && this.startEditing(this.selectedNode)) {

                // apply the character (needed in Firefox only: TFS 238554)
                let edt = wijmo.getActiveElement();
                if (wijmo.contains(this._edtNode.element, edt)) {

                    // apply new text and eat event
                    edt.textContent = String.fromCharCode(e.charCode);
                    e.preventDefault();

                    // move the cursor to the end of the new text
                    let rng = document.createRange();
                    rng.selectNodeContents(edt);
                    rng.collapse(false);
                    let sel = getSelection();
                    sel.removeAllRanges();
                    sel.addRange(rng);
                }

                // done here
                return;
            }

            // auto search
            if (e.charCode > 32 || (e.charCode == 32 && this._srch)) {
                e.preventDefault();

                // update search string
                this._srch += String.fromCharCode(e.charCode).toLowerCase();
                if (this._toSrch) {
                    clearTimeout(this._toSrch);
                }
                this._toSrch = setTimeout(() => {
                    this._toSrch = null;
                    this._srch = '';
                }, TreeView._AS_DLY);

                // perform search
                let item = this._findNext(); // multi-char search
                if (item == null && this._srch.length > 1) {
                    this._srch = this._srch[this._srch.length - 1];
                    item = this._findNext(); // single-char search
                }
                if (item != null) {
                    this.selectedItem = item;
                }
            }
        }
    }

    // look for the '_search' string from the current position
    private _findNext(): any {
        if (this.hostElement && this.selectedItem) {
            let start = this.getNode(this.selectedItem),
                node = start,
                wrapped = false,
                skip = false;

            // start searching from current or next item
            if (this._srch.length == 1) {
                skip = true; // TFS 250005
            }

            // search through the items (with wrapping)
            for (; node;) {

                // check this node
                if (!node.isDisabled && !skip) {
                    let txt = node.element.textContent.trim().toLowerCase();
                    if (txt.indexOf(this._srch) == 0) {
                        return node.dataItem;
                    }
                }

                // move on to next visible node
                let next = node.next(true, true);
                if (next == start && wrapped) {
                    break;
                }
                if (!next && !wrapped) {
                    next = this.getFirstNode(true, true);
                    wrapped = true;
                }
                node = next;
                skip = false;
            }
        }

        // not found
        return null;
    }

    // fill up the tree with node elements
    private _loadTree(preserveOutlineState?: boolean) {
        let root = this._root;
        if (root) {

            // allow user to cancel
            if (!this.onLoadingItems(new wijmo.CancelEventArgs())) {
                return;
            }

            // remember if we have focus and if the itemsSource changed (TFS 469517)
            let focus = this.containsFocus();
            let srcChanged = this._srcChanged;

            // we're not dirty anymore
            this._isDirty = false;
            this._srcChanged = false;

            // remember selected item
            let sel = this.selectedItem;
            this.selectedItem = null;

            // clear checkedItems array
            this._chkItems = null;

            // fire event so user can clean up any current items
            this._ldLvl = -1;

            // save collapsed state
            let collapsedMap;
            if (preserveOutlineState && wijmo.isFunction(window['Map']) && !srcChanged && this.nodes.length > 0) {
                collapsedMap = new Map();
                let nodes = this.hostElement.querySelectorAll('.' + TreeView._CND);
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    if (wijmo.hasClass(node, TreeView._CCLD)) {
                        collapsedMap.set(node[TreeView._DATAITEM_KEY], true);
                    }
                }
            }

            // populate the tree
            root.innerHTML = '';
            if (this._items) {
                this._items.forEach(item => {
                    this._addItem(root, 0, item);
                });
            }

            // restore outline state
            if (collapsedMap) {
                let nodes = this.hostElement.querySelectorAll('.' + TreeView._CND);
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i] as HTMLElement,
                        hasList = TreeNode._isNodeList(<HTMLElement>node.nextElementSibling),
                        isCollapsible = !TreeNode._isEmpty(node),
                        prevCollapsed = collapsedMap.get(node[TreeView._DATAITEM_KEY]);
                    // do not make node without a list expanded by removing wj-state-collapsed
                    // (not loaded lazyLoadFunction case)
                    if (isCollapsible && (prevCollapsed || hasList)) {
                        wijmo.toggleClass(node, TreeView._CCLD, prevCollapsed == true);
                    }
                    wijmo.setAttribute(node, 'aria-expanded', isCollapsible ? (!wijmo.hasClass(node, TreeView._CCLD)).toString() : null);
                }
            }

            // restore focus
            if (focus && !this.containsFocus()) {
                this.focus();
            }

            // try restoring the selection
            this.selectedItem = sel;

            // fire event so user can customize items as needed
            this.onLoadedItems();
            this._ldLvl = -1;
            this._srcChanged = false;
        }
    }

    // adds an item to the list
    private _addItem(host: HTMLElement, level: number, item: any) {

        // get node data
        let text = this._dspPath.getValue(item, level),
            imgSrc = this._imgPath.getValue(item, level),
            arr = wijmo.asArray(this._itmPath.getValue(item, level), true),
            cb: HTMLInputElement;

        // create the node
        let nodeElement = document.createElement('div');
        wijmo.addClass(nodeElement, TreeView._CND);
        nodeElement.tabIndex = -1;

        // accessibility
        wijmo.setAttribute(nodeElement, 'role', 'treeitem', true);
        wijmo.setAttribute(nodeElement, 'aria-selected', false);

        // set text
        let span = document.createElement('span');
        if (this.isContentHtml) {
            span.innerHTML = text;
        } else {
            span.textContent = text;
        }
        wijmo.addClass(span, TreeView._CNDT);
        nodeElement.appendChild(span);

        // add image
        if (imgSrc) {
            let img = document.createElement('img');
            img.src = imgSrc;
            nodeElement.insertBefore(img, nodeElement.firstChild);
        }

        // add checkbox
        if (this._showChk && !this._lazyLoad) {
            cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.tabIndex = -1;
            wijmo.addClass(cb, TreeView._CNDC);
            nodeElement.insertBefore(cb, nodeElement.firstChild);
        }

        // add draggable attribute
        if (this._dd) {
            nodeElement.setAttribute('draggable', 'true');
        }

        // add node to host
        host.appendChild(nodeElement);

        // store reference to item in the node element
        nodeElement[TreeView._DATAITEM_KEY] = item;

        // an array with no elements is like no array
        if (arr && arr.length == 0 && !this.lazyLoadFunction) {
            arr = null;
        }

        // load child nodes
        if (arr) {

            // initialize collapsed state
            let expanded = this.expandOnLoad;
            if (level > this._ldLvl && expanded) {
                this._ldLvl = level;

                // lazy load nodes start collapsed
                if (arr.length == 0) {
                    expanded = false;
                    wijmo.addClass(nodeElement, TreeView._CCLD);
                }
            } else {
                expanded = false;
                wijmo.addClass(nodeElement, TreeView._CCLD);
                if (level < this._ldLvl) {
                    this._ldLvl = 100;
                }
            }

            // add child nodes
            if (arr.length > 0) {

                // create nodeList
                let nodeList = document.createElement('div');
                nodeList.tabIndex = -1;
                wijmo.addClass(nodeList, TreeView._CNDL);
                for (let i = 0; i < arr.length; i++) {
                    this._addItem(nodeList, level + 1, arr[i]);
                }
                host.appendChild(nodeList);

                // accessibility
                //setAttribute(nodeElement, 'aria-expanded', expanded.toString(), true);
                wijmo.setAttribute(nodeList, 'role', 'group', true);
            } 
            wijmo.setAttribute(nodeElement, 'aria-expanded', expanded.toString(), true);
        } else {
            wijmo.addClass(nodeElement, TreeView._CEMP);
        }

        // initialize checkbox value from binding
        if (cb && this.checkedMemberPath) {
            if (!arr || !arr.length) {
                cb.checked = this._chkPath.getValue(item, level);
            } else {
                let node = new TreeNode(this, nodeElement);
                node._updateCheckedState();
            }
        }

        // format the node
        if (this.formatItem.hasHandlers) {
            this.onFormatItem(new FormatNodeEventArgs(item, nodeElement, level));
        }
    }

    // collapse all nodes on the list above the given level
    private _collapseToLevel(nodes: TreeNode[], maxLevel: number, currentLevel: number) {
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];

            // can't lazy-load multiple nodes at once (TFS 245116)
            if (node.hasPendingChildren) {
                continue;
            }

            // collapse/expand this node and all child nodes (TFS 242904)
            node.isCollapsed = currentLevel >= maxLevel;
            if (node.hasChildren) {
                this._collapseToLevel(node.nodes, maxLevel, currentLevel + 1);
            }
        }
    }

    // internal method called by lazy-loaded nodes being expanded
    _lazyLoadNode(node: TreeNode) {
        let host = this.hostElement;
        if (!wijmo.hasClass(host, TreeView._CLDG)) {
            wijmo.addClass(host, TreeView._CLDG);
            wijmo.addClass(node.element, TreeView._CLDG);
            this.lazyLoadFunction(node, this._lazyLoadCallback.bind(node));
        }
    }

    // populate node's children with lazy load results
    private _lazyLoadCallback(result) {
        let node: any = this,
            tree = node.treeView;
        tree._lazyLoadNodeDone(node, result);
    }

    // finish lazy loading
    private _lazyLoadNodeDone(node: TreeNode, result: any[]) {

        // done loading
        let tv = TreeView;
        wijmo.removeClass(node.element, tv._CLDG);
        wijmo.removeClass(this.hostElement, tv._CLDG);

        // if result is null or empty, this is an empty node
        let item = node.dataItem,
            level = node.level,
            arr = wijmo.asArray(result, true);
        if (arr == null || arr.length == 0) {

            // no data, this is an empty node
            this._itmPath.setValue(item, level, null);
            wijmo.addClass(node.element, tv._CEMP);
            wijmo.removeClass(node.element, tv._CCLD);

        } else if (arr.length) {

            // add dataItems to itemsSource
            this._itmPath.setValue(item, level, arr);

            // add elements to tree
            let nodeList = document.createElement('div') as HTMLElement,
                nodeElement = node.element;
            wijmo.addClass(nodeList, tv._CNDL);
            nodeElement.parentElement.insertBefore(nodeList, nodeElement.nextSibling);
            for (let i = 0; i < arr.length; i++) {
                this._addItem(nodeList, level + 1, arr[i]);
            }

            // expand the node once it's loaded
            node.isCollapsed = false;
        }
    }
}
    }
    


    module wijmo.nav {
    





/**
 * Class that handles drag/drop operations for a {@link TreeView}.
 */
export class _TreeDragDropManager {
    private _tree: TreeView;
    private _dragstartBnd: Function;
    private _dragoverBnd: Function;
    private _dragendBnd: Function;
    private _dropBnd: Function;

    // static members to allow drag/drop between trees (TFS 242905)
    private static _dMarker = <HTMLElement>(typeof window !== 'undefined' ? 
            wijmo.createElement('<div class="wj-marker">&nbsp;</div>') : null);
    private static _drgSrc: TreeNode;

    /**
     * Initializes a new instance of a {@link _TreeViewDragDropManager}.
     *
     * @param treeView {@link TreeView} managed by this {@link _TreeViewDragDropManager}.
     */
    constructor(treeView: TreeView) {
        this._tree = wijmo.asType(treeView, TreeView);
        this._dragstartBnd = this._dragstart.bind(this);
        this._dragoverBnd = this._dragover.bind(this);
        this._dropBnd = this._drop.bind(this);
        this._dragendBnd = this._dragend.bind(this);

        // add listeners
        let tree = this._tree,
            host = tree.hostElement;
        tree.addEventListener(host, 'dragstart', this._dragstartBnd);
        tree.addEventListener(host, 'dragover', this._dragoverBnd);
        tree.addEventListener(host, 'dragleave', this._dragoverBnd);
        tree.addEventListener(host, 'drop', this._dropBnd);
        tree.addEventListener(host, 'dragend', this._dragendBnd);
        tree.addEventListener(host, 'keydown', this._keydown);
    }

    /**
     * Disposes of this {@link _TreeViewDragDropManager}
     */
    dispose() {

        // remove event listeners
        let tree = this._tree,
            host = tree.hostElement;
        tree.removeEventListener(host, 'dragstart', this._dragstartBnd);
        tree.removeEventListener(host, 'dragover', this._dragoverBnd);
        tree.removeEventListener(host, 'dragleave', this._dragoverBnd);
        tree.removeEventListener(host, 'drop', this._dropBnd);
        tree.removeEventListener(host, 'dragend', this._dragendBnd);
        tree.removeEventListener(host, 'keydown', this._keydown);

        // dispose of marker
        this._showDragMarker();
    }

    // drag/drop event handlers
    private _dragstart(e: DragEvent) {
        if (!e.defaultPrevented) {

            // get the node being dragged
            let tree = this._tree,
                target = wijmo.closestClass(e.target, TreeView._CND) as HTMLElement,
                ddm = _TreeDragDropManager;
            ddm._drgSrc = TreeNode._isNode(target) ? new TreeNode(tree, target) : null;

            // raise event
            if (ddm._drgSrc) {
                let ee = new TreeNodeEventArgs(ddm._drgSrc);
                if (!tree.onDragStart(ee)) {
                    ddm._drgSrc = null;
                }
            }

            // start dragging or prevent default
            if (ddm._drgSrc && e.dataTransfer) {
                wijmo._startDrag(e.dataTransfer, 'copyMove');
                e.stopPropagation();
            } else {
                e.preventDefault();
            }
        }
    }
    private _dragover(e: DragEvent) {
        this._handleDragDrop(e, false);
    }
    private _drop(e: DragEvent) {
        this._handleDragDrop(e, true);
    }
    private _dragend(e: DragEvent) {
        _TreeDragDropManager._drgSrc = null;
        this._showDragMarker();
        this._tree.onDragEnd();
    }

    // cancel drag/drop if user presses Escape key
    private _keydown(e: KeyboardEvent) {
        if (!e.defaultPrevented) {
            if (e.keyCode == wijmo.Key.Escape) {
                this._dragendBnd(null);
            }
        }
    }

    // perform hit-testing to find the target node and position
    private _handleDragDrop(e: DragEvent, drop: boolean) {
        let tree = this._tree,
            ddm = _TreeDragDropManager,
            ee: TreeNodeDragDropEventArgs,
            dp = DropPosition,
            pos = dp.Into,
            rc: any;
        if (!e.defaultPrevented && ddm._drgSrc) {

            // get target node
            let element = document.elementFromPoint(e.clientX, e.clientY),
                target = wijmo.closestClass(element, TreeView._CND) as HTMLElement;

            // handle case where destination tree is empty
            if (target == null) {
                let tt = wijmo.Control.getControl(wijmo.closest(element, '.wj-treeview') as HTMLElement);
                if (tt instanceof TreeView && tt.totalItemCount == 0) {
                    target = tt.hostElement;
                }
            }

            // ensure target is not the source
            if (target == ddm._drgSrc.element) {
                target = null;
            }

            // calculate target details
            if (target) {

                // get drop position with respect to target node (before/after/into)
                // note: can't drop into lazy-loading nodes (TFS 246954)
                rc = target.getBoundingClientRect();
                let targetNode = new TreeNode(tree, target),
                    szCheck = targetNode.hasPendingChildren ? rc.height / 2 : rc.height / 3;
                if (targetNode.element == null) {

                    // dragging into an empty tree or node with lazy content
                    rc = wijmo.Rect.fromBoundingRect(rc);
                    rc.inflate(-12, -12);
                    pos = dp.Before;

                } else if (e.clientY < rc.top + szCheck) {

                    // before this node, easy
                    pos = dp.Before;

                } else if (e.clientY > rc.bottom - szCheck || targetNode.hasPendingChildren) {

                    // after this node
                    pos = dp.After;

                    // but if it has children and is not collapsed, 
                    // insert before the first child instead
                    if (targetNode.hasChildren && !targetNode.isCollapsed && !targetNode.hasPendingChildren) {
                        pos = dp.Before;
                        targetNode = targetNode.next(true, false);
                        target = targetNode.element;
                        rc = target.getBoundingClientRect();
                    }
                }

                // make sure target is not our child
                if (ddm._drgSrc._contains(targetNode)) {
                    target = null;
                } else {

                    // prevent dragging to different trees by default
                    ee = new TreeNodeDragDropEventArgs(ddm._drgSrc, targetNode, pos);
                    ee.cancel = ddm._drgSrc.treeView != targetNode.treeView;
                    if (!tree.onDragOver(ee)) {
                        target = null;
                    }
                }
            }

            // dragging before the next or after the previous sibling has no effect
            if (target) {
                pos = ee.position;
                if (pos == dp.Before) {
                    let next = ee.dragSource.next(true, false);
                    if (next && next.element == target) {
                        target = null;
                    }
                } else if (pos == dp.After) {
                    let prev = ee.dragSource.previous(true, false);
                    if (prev && prev.element == target) {
                        target = null;
                    }
                }
            }

            // update the drag marker
            if (target && !drop) {
                e.dataTransfer.dropEffect = 'move';
                e.preventDefault();
                e.stopPropagation(); // prevent scrolling on Android
                this._showDragMarker(rc, pos);
            } else {
                this._showDragMarker();
            }

            // make the drop
            if (target && drop) {
                if (tree.onDrop(ee)) {
                    tree.hostElement.focus(); // TFS 240438
                    let src = ee.dragSource;
                    src.move(ee.dropTarget, ee.position);
                    src.ensureVisible(); // TFS 384859
                    src.select();
                }
            }
        }
    }

    // show the drag marker at the given position or remove it from view
    private _showDragMarker(rc?: ClientRect, pos?: DropPosition) {
        let tree = this._tree,
            parent = _TreeDragDropManager._dMarker.parentElement;
        if (rc) {

            // position the marker (accounting for RTL)
            let rcHost = tree.hostElement.getBoundingClientRect(),
                top = pos == DropPosition.After ? rc.bottom : rc.top,
                css: any = {
                    top: Math.round(top - rcHost.top + tree.hostElement.scrollTop - 2),
                    width: '75%',
                    height: pos == DropPosition.Into ? rc.height : 4,
                    opacity: pos == DropPosition.Into ? '0.15' : ''
                };
            if (tree.rightToLeft) {
                css.right = Math.round(rcHost.right - rc.right);
            } else {
                css.left = Math.round(rc.left - rcHost.left);
            }
            wijmo.setCss(_TreeDragDropManager._dMarker, css);

            // make sure marker is in the DOM
            if (parent != tree._root) {
                tree._root.appendChild(_TreeDragDropManager._dMarker);
            }
        } else {

            // remove marker from the DOM
            if (parent) {
                parent.removeChild(_TreeDragDropManager._dMarker);
            }
        }
    }
}
    }
    


    module wijmo.nav {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.nav', wijmo.nav);









    }
    