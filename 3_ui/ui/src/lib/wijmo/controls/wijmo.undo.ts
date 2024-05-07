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


    module wijmo.undo {
    

/**
 * Base class for undoable actions.
 */
export class UndoableAction {
    protected _target: any;
    protected _oldState: any;
    protected _newState: any;
    protected _actions: UndoableAction[];

    /**
     * Initializes a new instance of an {@link UndoableAction}.
     *
     * @param target Object that the action applies to.
     */
    constructor(target: any) {
        this._target = target;
    }
    
    /**
     * Undoes the action.
     */
    undo() {

        // undo child actions (in reverse order)
        if (this._actions) {
            for (var i = this._actions.length - 1; i >= 0; i--) {
                this._actions[i].undo();
            }
        }

        // undo parent action
        this.applyState(this._oldState);
    }
    /**
     * Redoes the action.
     */
    redo() {

        // redo main action
        this.applyState(this._newState);

        // redo child actions
        if (this._actions) {
            this._actions.forEach((action) => {
                action.redo();
            });
        }
    }
    /**
     * Closes the action by saving the new state.
     * Returns true if the new state is different from the old state.
     */
    close(): boolean {
        return true;
    }
    /**
     * Applies a given state to the target object.
     * @param state State to apply to the target object.
     */
    applyState(state: any) {
    }
    /**
     * Gets a value that determines whether a given action should
     * be added as a child action or as a new independent action.
     *
     * @param action {@link UndoableAction} to add to this action's
     * child action list.
     */
    shouldAddAsChildAction(action: UndoableAction): boolean {
        return false;
    }
    /**
     * Adds a child action to this action's child list.
     *
     * @param action {@link UndoableAction} to add to this action's
     * child action list.
     */
    addChildAction(action: UndoableAction) {
        if (!this._actions) {
            this._actions = [];
        }
        this._actions.push(action);
    }
    /**
     * Gets a reference to the action's target object.
     */
    get target(): any {
        return this._target;
    }
}

    }
    


    module wijmo.undo {
    




// adds HTMLElement targets to the UndoStack
export class _UndoStackHTML {

    // add HTMLElements to the UntoStack context
    static addTarget(stack: UndoStack, target: HTMLElement): boolean {
        const US = _UndoStackHTML;
        if (target instanceof HTMLInputElement) {
            return US._addInputElement(stack, target);
        } else if (target instanceof HTMLTextAreaElement) {
            return US._addTextAreaElement(stack, target);
        } else if (target instanceof HTMLSelectElement) {
            return US._addSelectElement(stack, target);
        } else {
            let added = false;
            for (let i = 0; i < target.children.length; i++) {
                let e = target.children[i] as HTMLElement;
                if (e instanceof HTMLElement && stack.addTarget(e)) {
                    added = true;
                }
            }
            return added;
        }
    }

    // add an input element to the UndoStack context
    private static _addInputElement(stack: UndoStack, input: HTMLInputElement): boolean {
        let action: UndoableAction = null;
        if (input.type == 'checkbox') {

            // checkboxes are easy
            input.addEventListener('click', e => {
                stack.pushAction(new CheckboxClickAction(e));
            });

        } else if (input.type == 'radio') {

            // radios are harder: to work in IE, we have to handle mousedown
            // on the element and on the label it refers to
            input.addEventListener('mousedown', e => {
                action = new RadioClickAction(e);
            }, true);
            let lbl = _UndoStackHTML._getLabel(input);
            if (lbl) {
                lbl.addEventListener('mousedown', e => {
                    action = new RadioClickAction({ target: input });
                }, true);
            }
            input.addEventListener('focus', e => {
                if (!(action instanceof RadioClickAction) || action.target != e.target) {
                    action = new RadioClickAction(e);
                }
            });
            input.addEventListener('click', e => {
                if (action instanceof RadioClickAction) {
                    stack.pushAction(action);
                    action = null;
                }
            });
            return true;

        } else {

            // input range elements don't get the focus on touch devices (TFS 277531)
            if (input.type == 'range') {
                input.addEventListener('mousedown', e => {
                    let ae = wijmo.getActiveElement();
                    if (ae instanceof HTMLElement && ae != input) {
                        ae.blur(); // close pending actions on other elements
                    }
                    action = new InputChangeAction(e);
                });
                input.addEventListener('mouseup', e => {
                    if (action instanceof InputChangeAction && wijmo.getActiveElement() != input) {
                        action._focus = false; // don't get the focus when applying the state
                        stack.pushAction(action); // close action if we don't have the focus
                        action = null;
                    }
                });
            }

            // regular text (and range arrow keys): handle focus and blur
            input.addEventListener('focus', e => {
                if (action == null) { // start an action now if we didn't on mousedown
                    action = new InputChangeAction(e);
                }
            });
            input.addEventListener('blur', e => {
                if (action instanceof InputChangeAction) {
                    stack.pushAction(action);
                    action = null;
                }
            });
        }
        return true;
    }

    // add a textarea element to the UndoStack context
    private static _addTextAreaElement(stack: UndoStack, target: HTMLTextAreaElement): boolean {
        let action: UndoableAction = null;
        target.addEventListener('focus', e => {
            action = new InputChangeAction(e);
        });
        target.addEventListener('blur', e => {
            if (action instanceof InputChangeAction) {
                stack.pushAction(action);
                action = null;
            }
        });
        return true;
    }

    // add a select element to the UndoStack context
    private static _addSelectElement(stack: UndoStack, target: HTMLSelectElement): boolean {
        let action: UndoableAction = null;
        target.addEventListener('focus', e => {
            action = new InputChangeAction(e);
        });
        target.addEventListener('blur', e => {
            if (action instanceof InputChangeAction) {
                stack.pushAction(action);
                action = null;
            }
        });
        return true;
    }

    // get the label associated with an input element
    private static _getLabel(e: HTMLElement): HTMLLabelElement {
        let lbl = e.parentElement;
        if (!(lbl instanceof HTMLLabelElement)) {
            lbl = document.querySelector('label[for="' + e.id + '"');
        }
        return lbl as HTMLLabelElement;
    }
}

export class InputChangeAction extends UndoableAction {
    _focus = true;

    constructor(e: any) {
        super(e.target);
        this._oldState = this._target.value;
    }

    close(): boolean {
        this._newState = this._target.value;
        return this._newState != this._oldState;
    }
    applyState(state: any) {
        let target = this._target;
        target.value = state;
        target.dispatchEvent(UndoStack._evtInput);
        if (this._focus) {
            if (wijmo.isFunction(target.select)) {
                target.select();
            } else {
                target.focus();
            }
        }
    }
}

export class CheckboxClickAction extends UndoableAction {
    constructor(e: MouseEvent) {
        super(e.target);
        wijmo.assert(this._target.type == 'checkbox', 'checkbox expected');
        this._newState = this._target.checked;
        this._oldState = !this._newState;
    }

    applyState(state: any) {
        this._target.checked = state;
        this._target.focus();
    }
}

export class RadioClickAction extends UndoableAction {
    constructor(e: any) {
        super(e.target);
        let inputType = this._target.type;
        wijmo.assert(inputType == 'radio', 'radio button expected');
        this._oldState = this._getState();
    }

    close(): boolean {
        this._newState = this._getState();
        return this._newState != this._oldState;
    }
    applyState(state: any) {
        if (state) {
            state.checked = true;
            state.focus();
        }
    }
    _getState() {
        let selector = 'input[name="' + this._target.name + '"]',
            btns = document.querySelectorAll(selector);
        for (let i = 0; i < btns.length; i++) {
            if ((btns[i] as HTMLInputElement).checked) {
                return btns[i];
            }
        }
        return null;
    }
}

    }
    


    module wijmo.undo {
    







// details and background:
// https://www.grapecity.com/blogs/easy-undo-redo-for-html-forms
//
// nice docs from Apple:
// https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/UndoArchitecture/UndoArchitecture.html#//apple_ref/doc/uid/10000010-SW1

/**
 * Class that provides undo/redo functionality for 
 * input elements and Wijmo controls.
 */
export class UndoStack {
    static _evtInput: any;

    _autoKbd = true;
    _disabled: boolean;
    _undoing: boolean;
    _stack: UndoableAction[] = [];
    _maxActions = 1000;
    _pendingAction: UndoableAction;
    _ptr = 0;

    /**
     * Initializes a new instance of the {@link UndoStack} class.
     *
     * @param target The DOM element or CSS selector for the DOM elements to be added to
     * {@link UndoStack} context. If not provided, the whole document body is added to
     * the context.
     * @param options The JavaScript object containing initialization data for the 
     * {@link UndoStack}.
     */
    constructor(target?: any, options?: any) {

        // initialize input event dispatcher
        if (!UndoStack._evtInput) {
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', true, false);
            UndoStack._evtInput = evt;            
        }

        // apply options (mainly event handlers)
        wijmo.copy(this, options);

        // get undo scope (target)
        target = wijmo.getElement(target || document.body);

        // add undo targets
        this.addTarget(target);

        // handle undo/redo keys
        document.addEventListener('keydown', e => {
            if (this._autoKbd && e.ctrlKey && !e.defaultPrevented) {
                if (wijmo.contains(target, e.target)) { // TFS 275107
                    switch (e.keyCode) {
                        case 90: // ctrl+Z => undo
                            if (this.canUndo) {
                                wijmo.getActiveElement().blur(); // TFS 436233
                                setTimeout(() => this.undo(), 100);
                            }
                            e.preventDefault();
                            break;
                        case 89: // ctrl+Y => redo
                            if (this.canRedo) {
                                wijmo.getActiveElement().blur(); // TFS 436233
                                setTimeout(() => this.redo(), 100);
                            }
                            e.preventDefault();
                            break;
                    }
                }
            }
        }, wijmo.getEventOptions(true, false)); // TFS 395667
    }

    /**
     * Adds an undo/redo target to the {@link UndoStack} context.
     *
     * @param target Query selector or element to add to the {@link UndoStack} context.
     */
    addTarget(target: any): boolean {
        let added = false;

        // selectors
        if (wijmo.isString(target)) {
            let targets = document.querySelectorAll(target),
                added = false;
            for (let i = 0; i < targets.length; i++) {
                if (this.addTarget(targets[i])) {
                    added = true;
                }
            }
            return added;
        }

        // sanity
        wijmo.assert(target instanceof HTMLElement, 'Undo target should be an HTML element');

        // add target
        let e = new AddTargetEventArgs(target);
        e.cancel = wijmo.hasClass(target, 'wj-no-undo');
        if (this.onAddingTarget(e)) {

            // Wijmo controls
            let ctl = wijmo.Control.getControl(target);
            if (ctl) {
                added = _UndoStackWijmo.addTarget(this, ctl);
            }

            // HTML elements
            if (!added) { // && !closest(target, '.wj-control')) { // TFS 472192
                added = _UndoStackHTML.addTarget(this, target);
            }

            // done adding target
            if (added) {
                this.onAddedTarget(e)
            }
        }
        return added;
    }
    /**
     * Gets or sets a value that determines whether the {@link UndoStack}
     * should monitor the keyboard and handle the undo/redo keys (ctrl+Z/ctrl+Y)
     * automatically.
     */
    get autoKeyboard(): boolean {
        return this._autoKbd;
    }
    set autoKeyboard(value: boolean) {
        this._autoKbd = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a vlue that determines whether the {@link UndoStack} is currently disabled.
     */
    get isDisabled(): boolean {
        return this._disabled;
    }
    set isDisabled(value: boolean) {
        this._disabled = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets the maximum number of actions to store in the {@link UndoStack}.
     * 
     * The default value for this property is **1,000** actions.
     */
    get maxActions(): number {
        return this._maxActions;
    }
    set maxActions(value: number) {
        if (value != this._maxActions) {
            this._maxActions = wijmo.asNumber(value, false, true);
            this.clear();
        }
    }
    /**
     * Gets the number of actions currently stored in the {@link UndoStack}.
     */
    get actionCount(): number {
        return this._stack.length;
    }
    /**
     * Gets a value that determines whether the {@link UndoStack} is ready to undo an action.
     */
    get canUndo(): boolean {
        return this._stack.length > 0 && this._ptr > 0 && !this._disabled;
    }
    /**
     * Gets a value that determines whether the {@link UndoStack} is ready to redo an action.
     */
    get canRedo(): boolean {
        return this._stack.length > 0 && this._ptr < this._stack.length && !this._disabled;
    }
    /**
     * Undoes the last action recorded.
     */
    undo() {
        if (this.canUndo) {
            let action = this._stack[this._ptr - 1],
                e = new UndoActionEventArgs(action);
            if (this.onUndoingAction(e)) {
                this._ptr--;
                this._undoing = true;
                action.undo();
                this._undoing = false;
                this._pendingAction = null;
                this.onUndoneAction(e);
                this.onStateChanged();
            }
        }
    }
    /**
     * Redoes the last action undone.
     */
    redo() {
        if (this.canRedo) {
            let action = this._stack[this._ptr],
                e = new UndoActionEventArgs(action);
            if (this.onRedoingAction(e)) {
                this._ptr++;
                this._undoing = true;
                action.redo();
                this._undoing = false;
                this._pendingAction = null;
                this.onRedoneAction(e);
                this.onStateChanged();
            }
        }
    }
    /**
     * Clears the {@link UndoStack}.
     */
    clear() {
        this._ptr = 0;
        this._stack.splice(0, this._stack.length);
        this.onStateChanged();
    }
    /**
     * Pushes a new undoable action onto the stack.
     * 
     * @param action {@link UndoableAction} to add to the stack.
     */
    pushAction(action: UndoableAction) {
        this._pendingAction = action;
        this.pushPendingAction();
    }

    // ** events

    /**
     * Occurs when an element is about to be added to the {@link UndoStack} context.
     * 
     * Listeners may prevent the element from being added to the context
     * by setting the cancel parameter to true.
     */
    readonly addingTarget = new wijmo.Event<UndoStack, AddTargetEventArgs>();
    /**
     * Raises the {@link addingTarget} event.
     * 
     * @param e {@link AddTargetEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onAddingTarget(e: AddTargetEventArgs): boolean {
        this.addingTarget.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after an element has been added to the {@link UndoStack} context.
     */
    readonly addedTarget = new wijmo.Event<UndoStack, AddTargetEventArgs>();
    /**
     * Raises the {link @addedTarget} event.
     * 
     * @param e {@link AddTargetEventArgs} that contains the event data.
     */
    onAddedTarget(e: AddTargetEventArgs): void {
        this.addedTarget.raise(this, e);
    }
    /**
     * Occurs when an {@link UndoableAction} is about to be added to the stack.
     */
    readonly addingAction = new wijmo.Event<UndoStack, UndoActionEventArgs>();
    /**
     * Raises the {@link addingAction} event.
     * 
     * @param e {@link UndoActionEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onAddingAction(e: UndoActionEventArgs): boolean {
        this.addingAction.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after an {@link UndoableAction} had been added to the stack.
     */
    readonly addedAction = new wijmo.Event<UndoStack, UndoActionEventArgs>();
    /**
     * Raises the {@link addedAction} event.
     * 
     * @param e {@link UndoActionEventArgs} that contains the event data.
     */
    onAddedAction(e: UndoActionEventArgs): void {
        this.addedAction.raise(this, e);
    }
    /**
     * Occurs when an {@link UndoableAction} is about to be undone.
     */
    readonly undoingAction = new wijmo.Event<UndoStack, UndoActionEventArgs>();
    /**
     * Raises the {@link undoingAction} event.
     * 
     * @param e {@link UndoActionEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onUndoingAction(e: UndoActionEventArgs): boolean {
        this.undoingAction.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after an {@link UndoableAction} has been undone.
     * 
     * @param e {@link UndoActionEventArgs} that contains the event data.
     */
    readonly undoneAction = new wijmo.Event<UndoStack, UndoActionEventArgs>();
    /**
     * Raises the {@link undoneAction} event.
     * 
     * @param e {@link UndoActionEventArgs} that contains the event data.
     */
    onUndoneAction(e: UndoActionEventArgs): void {
        this.undoneAction.raise(this, e);
    }
    /**
     * Occurs when an {@link UndoableAction} is about to be redone.
     */
    readonly redoingAction = new wijmo.Event<UndoStack, UndoActionEventArgs>();
    /**
     * Raises the {@link redoingAction} event.
     * 
     * @param e {@link UndoActionEventArgs} that contains the event data.
     * @return True if the event was not canceled.
     */
    onRedoingAction(e: UndoActionEventArgs): boolean {
        this.redoingAction.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after an {@link UndoableAction} has been redone.
     * 
     * @param e {@link UndoActionEventArgs} that contains the event data.
     */
    readonly redoneAction = new wijmo.Event<UndoStack, UndoActionEventArgs>();
    /**
     * Raises the {@link redoneAction} event.
     * 
     * @param e {@link UndoActionEventArgs} that contains the event data.
     */
    onRedoneAction(e: UndoActionEventArgs): void {
        this.redoneAction.raise(this, e);
    }
    /**
     * Occurs when the state of the {@link UndoStack} changes.
     *
     * Use this event to update UI elements that reflect the state of the
     * {@link UndoStack}. For example, to enable or disable undo/redo buttons.
     */
    readonly stateChanged = new wijmo.Event<UndoStack, wijmo.EventArgs>();
    /**
     * Raises the {@link stateChanged} event.
     */
    onStateChanged() {
        this.stateChanged.raise(this, wijmo.EventArgs.empty);
    }

    // ** implementation

    // close the current action and push it onto the undo stack
    pushPendingAction() {
        if (!this._disabled && !this._undoing && this._pendingAction && this._pendingAction.close()) {

            // discard any actions after the pointer (redo list)
            this._stack.splice(this._ptr, this._stack.length - this._ptr);
            wijmo.assert(this._stack.length == this._ptr, 'should be at the end of the stack');

            // accumulate with last action
            if (this._stack.length) {
                let lastAction = this._stack[this._ptr - 1];
                if (lastAction.shouldAddAsChildAction(this._pendingAction)) {
                    lastAction.addChildAction(this._pendingAction);
                    this._pendingAction = null;
                    this.onStateChanged();
                    return;
                }
            }

            // raise addingUndoAction
            let e = new UndoActionEventArgs(this._pendingAction);
            if (!this.onAddingAction(e)) {
                return;
            }

            // push the current pending action
            this._stack.push(this._pendingAction);
            this._ptr++;
            this._pendingAction = null;

            // limit stack size
            let extra = this._stack.length - this._maxActions;
            if (extra > 0) {
                this._stack.splice(0, extra);
                this._ptr -= extra;
                wijmo.assert(this._ptr >= 0, 'pointer should not be negative');
            }

            // state has changed
            this.onStateChanged();
        }
    }
}

/**
 * Provides arguments for the {@link UndoStack.addingTarget} and {@link UndoStack.addedTarget}
 * events.
 */
export class AddTargetEventArgs extends wijmo.CancelEventArgs {
    _target: HTMLElement;

    /**
     * Initializes a new instance of the {@link AddTargetEventArgs} class.
     * 
     * @param target HTMLElement being added to the {@link UndoStack} context.
     */
    constructor(target: HTMLElement) {
        super();
        this._target = target;
    }
    /**
     * Gets a reference to the HTMLElement being added to the {@link UndoStack} context.
     */
    get target(): HTMLElement {
        return this._target;
    }
}
/**
 * Provides arguments for the {@link UndoStack.undoingAction}, {@link UndoStack.undoneAction}, 
 * {@link UndoStack.redoingAction}, and {@link UndoStack.redoneAction} events.
 */
export class UndoActionEventArgs extends wijmo.CancelEventArgs {
    _action: UndoableAction;

    /**
     * Initializes a new instance of the {@link AddTargetEventArgs} class.
     * 
     * @param action {@link UndoableAction} being added to the {@link UndoStack}.
     */
    constructor(action: UndoableAction) {
        super();
        this._action = action;
    }
    /**
     * Gets a reference to the {@link UndoableAction} that this event refers to.
     */
    get action(): UndoableAction {
        return this._action;
    }
}
    }
    


    module wijmo.undo {
    







export function softInput(): typeof wijmo.input {
    return wijmo._getModule('wijmo.input');
}
export function softGrid(): typeof wijmo.grid {
    return wijmo._getModule('wijmo.grid');
}
export function softGauge(): typeof wijmo.gauge {
    return wijmo._getModule('wijmo.gauge');
}
export function softNav(): typeof wijmo.nav {
    return wijmo._getModule('wijmo.nav');
}

    }
    


    module wijmo.undo {
    










// adds Wijmo control targets to the UndoStack
export class _UndoStackWijmo {

    // adds a Wijmo Control target to the UndoStack
    static addTarget(stack: UndoStack, ctl: wijmo.Control): boolean {
        const US = _UndoStackWijmo;
        if (softGrid() && ctl instanceof softGrid().FlexGrid) {
            return US._addFlexGrid(stack, ctl);
        } else if (softGauge() && ctl instanceof softGauge().Gauge) {
            return US._addGauge(stack, ctl);
        } else if (softNav() && ctl instanceof softNav().TreeView) {
            return US._addTreeView(stack, ctl);
        } else if (US._isInputControl(ctl)) {
            return US._addInputControl(stack, ctl);
        }
        return false;
    }
    private static _isInputControl(ctl: wijmo.Control): boolean {
        const wjInput = softInput();
        if (wjInput) {
            return ctl instanceof wjInput.DropDown || ctl instanceof wjInput.InputMask ||
                ctl instanceof wjInput.InputNumber || ctl instanceof wjInput.Calendar ||
                ctl instanceof wjInput.ColorPicker;
        }
        return false;
    }

    // add an input-based Wijmo control to the UndoStack context
    private static _addInputControl(stack: UndoStack, ctl: wijmo.Control): boolean {
        let action = null;
        ctl.gotFocus.addHandler(() => {
            action = new InputControlChangeAction({ target: ctl });
        })
        ctl.lostFocus.addHandler(() => {
            if (action instanceof InputControlChangeAction) {
                stack.pushAction(action);
                action = null;
            }
        });
        return true;
    }

    // add a Gauge control to the UndoStack context 
    private static _addGauge(stack: UndoStack, gauge: wijmo.gauge.Gauge): boolean {
        if (!gauge.isReadOnly) {
            let action: UndoableAction = null;
            gauge.hostElement.addEventListener('focus', () => { // TFS 472392
                if (!action) {
                    action = new GaugeChangeAction(gauge);
                }
            });
            //gauge.gotFocus.addHandler(() => { // too late, the value has already changed
            //    action = new GaugeChangeAction(gauge);
            //});
            gauge.lostFocus.addHandler(() => {
                if (action instanceof GaugeChangeAction) {
                    stack.pushAction(action);
                    action = null;
                }
            });
            return true;
        }
        return false;
    }

    // add a TreeView control to the UndoStack context
    private static _addTreeView(stack: UndoStack, tree: wijmo.nav.TreeView): boolean {
        let action: UndoableAction = null;

        // edit nodes
        tree.nodeEditStarted.addHandler((s: wijmo.nav.TreeView, e: wijmo.nav.TreeNodeEventArgs) => {
            action = new TreeViewEditAction(s, e);
        });
        tree.nodeEditEnded.addHandler((s: wijmo.nav.TreeView, e: wijmo.nav.TreeNodeEventArgs) => {
            if (action instanceof TreeViewEditAction) {
                stack.pushAction(action);
                action = null;
            }
        });

        // check/uncheck nodes
        tree.isCheckedChanging.addHandler((s: wijmo.nav.TreeView, e: wijmo.nav.TreeNodeEventArgs) => {
            action = new TreeViewCheckAction(s, e);
        });
        tree.isCheckedChanged.addHandler((s: wijmo.nav.TreeView, e: wijmo.nav.TreeNodeEventArgs) => {
            if (action instanceof TreeViewCheckAction) {
                stack.pushAction(action);
                action = null;
            }
        });

        return true;
    }

    // add a FlexGrid control to the UndoStack context
    private static _addFlexGrid(stack: UndoStack, grid: wijmo.grid.FlexGrid): boolean {
        let action: UndoableAction = null;

        // edit/clear actions
        grid.beginningEdit.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            action = (e.getRow() instanceof wijmo.grid._NewRowTemplate) // TFS 391704
                ? null
                : new GridEditAction(s, e);
        });
        grid.cellEditEnded.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            if (action instanceof GridEditAction) {
                stack.pushAction(action);
                action = null;
            }
        });

        // paste
        grid.pastingCell.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            action = new GridEditAction(s, e);
        });
        grid.pastedCell.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            if (action instanceof GridEditAction) {
                stack.pushAction(action);
                action = null;
            }
        });

        // sort actions
        grid.sortingColumn.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            action = new GridSortAction(s, e);
        });
        grid.sortedColumn.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            if (action instanceof GridSortAction) {
                stack.pushAction(action);
                action = null;
            }
        });

        // resize/autosize columns
        grid.resizingColumn.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            if (!(action instanceof GridResizeAction)) {
                action = new GridResizeAction(s, e);
            }
        });
        grid.resizedColumn.addHandler(() => {
            if (action instanceof GridResizeAction) {
                stack.pushAction(action);
                action = null;
            }
        });
        grid.autoSizingColumn.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            action = new GridResizeAction(s, e);
        });
        grid.autoSizedColumn.addHandler(() => {
            if (action instanceof GridResizeAction) {
                stack.pushAction(action);
                action = null;
            }
        });

        // drag columns
        grid.draggingColumn.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            action = new GridDragAction(s, e);
        });
        grid.draggedColumn.addHandler((s, e) => {
            if (action instanceof GridDragAction) {
                stack.pushAction(action);
                action = null;
            }
        });

        // add/remove rows
        grid.rowAdded.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            if (!e.cancel) {
                stack.pushAction(new GridAddRowAction(s, e));
            }
        });
        grid.deletingRow.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            if (!e.cancel) {
                stack.pushAction(new GridRemoveRowAction(s, e));
            }
        });

        // expand/collapse columnGroups
        grid.columnGroupCollapsedChanging.addHandler((s, e: wijmo.grid.CellRangeEventArgs) => {
            action = new ExpandCollapseColumnGroupAction(s, e);
        });
        grid.columnGroupCollapsedChanged.addHandler((s, e) => {
            if (action instanceof ExpandCollapseColumnGroupAction) {
                stack.pushAction(action);
                action = null;
            }
        });

        // TODO: filter, collapse/expand nodes
        return true;
    }
}

// input control actions
class InputControlChangeAction extends InputChangeAction {
    _ctl: wijmo.Control;
    _timeStamp: number;

    constructor(e: any) {
        super(e);
        this._ctl = e.target;
        this._oldState = this._getControlState();
    }

    // expose action parameters
    get control(): wijmo.Control {
        return this._ctl;
    }

    // close the action saving the new value
    close(): boolean {
        this._timeStamp = Date.now();
        this._newState = this._getControlState();
        return !this._sameContent(this._oldState, this._newState);
    }

    // accumulate edits that happen in a quick succession 
    // (e.g. incrementing a number with the inc/dec buttons)
    shouldAddAsChildAction(action: UndoableAction): boolean {
        if (action instanceof InputControlChangeAction && action.target == this.target) {
            if (action._timeStamp - this._timeStamp < 500) {
                this._timeStamp = Date.now();
                return true;
            }
        }
        return false;
    }

    // apply state (old or new) to target
    applyState(state: any) {
        let ctl = this._ctl as any,
            wjInput = softInput();
        if (wjInput) {
            let dateRange = ctl instanceof wjInput.Calendar || ctl instanceof wjInput.InputDate;
            if (dateRange && ctl.selectionMode != wjInput.DateSelectionMode.Range) {
                dateRange = false;
            }
            if (ctl instanceof wjInput.MultiSelect) {
                ctl.checkedItems = state;
            } else if (ctl instanceof wjInput.MultiAutoComplete) {
                ctl.selectedItems = state;
            } else if (dateRange) {
                ctl.value = state[0];
                ctl.rangeEnd = state[1];
            } else if ('value' in ctl) {
                ctl.value = state;
            } else if ('text' in ctl) {
                ctl.text = state;
            } else {
                wijmo.assert(false, 'can\'t apply control state?');
            }
            ctl.focus();
        }
    }

    // get the control state
    _getControlState(): any {
        let ctl = this._ctl as any,
            wjInput = softInput();
        if (wjInput) {
            let dateRange = ctl instanceof wjInput.Calendar || ctl instanceof wjInput.InputDate;
            if (dateRange && ctl.selectionMode != wjInput.DateSelectionMode.Range) {
                dateRange = false;
            }
            if (ctl instanceof wjInput.MultiSelect) {
                return ctl.checkedItems.slice();
            } else if (ctl instanceof wjInput.MultiAutoComplete) {
                return ctl.selectedItems.slice();
            } else if (dateRange) {
                return [ctl.value, ctl.rangeEnd];
            } else if ('value' in ctl) {
                return ctl.value;
            } else if ('text' in ctl) {
                return ctl.text;
            }
            wijmo.assert(false, 'can\'t get control state?');
        }
    }

    // compare two values for equality
    _sameContent(obj1: any, obj2: any): boolean {

        // compare two arrays by content
        if (wijmo.isArray(obj1) && wijmo.isArray(obj2)) {
            if (obj1.length != obj2.length) {
                return false;
            }
            for (let i = 0; i < obj1.length; i++) {
                if (obj1[i] != obj2[i]) {
                    return false;
                }
            }
            return true;
        }

        // compare dates
        if (wijmo.isDate(obj1) || wijmo.isDate(obj2)) {
            return wijmo.DateTime.sameDate(obj1, obj2);
        }

        // compare everything else
        return obj1 == obj2;
    }
}

// gauge control actions
class GaugeChangeAction extends UndoableAction {

    // create a new GaugeChangeAction saving the original gauge value
    constructor(gauge: wijmo.gauge.Gauge) {
        super(gauge);
        this._oldState = gauge.value;
    }

    // expose action parameters
    get control(): wijmo.Control {
        return this._target as wijmo.gauge.Gauge;
    }

    // close and remember the new gauge value
    close(): boolean {
        this._newState = this._target.value;
        return this._newState != this._oldState;
    }

    // apply state (old or new) to target
    applyState(state: any) {
        let ctl = this._target;
        ctl.value = state;
        ctl.focus();
    }
}

// FlexGrid control actions
class GridEditAction extends UndoableAction {
    _rng: wijmo.grid.CellRange;
    _dataItems: any[] = [];
    _timeStamp: number;
    _page: number;

    // create a new GridEditAction including the cell range and content
    constructor(grid: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        super(grid);
        let cv = grid.collectionView as wijmo.collections.CollectionView;
        let rng = this._rng = e.range;
        for (let i = rng.topRow; i <= rng.bottomRow; i++) {
            this._dataItems.push(grid.rows[i].dataItem);
        }
        this._page = cv instanceof wijmo.collections.CollectionView ? cv.pageIndex : -1;
        this._oldState = grid.getCellData(e.row, e.col, false);
    }

    // expose action parameters
    get control(): wijmo.Control {
        return this._target as wijmo.gauge.Gauge;
    }
    get range(): wijmo.grid.CellRange {
        return this._rng.clone();
    }
    get row(): number {
        return this._rng.topRow;
    }
    get col(): number {
        return this._rng.leftCol;
    }
    get dataItem(): any {
        return this._dataItems[0];
    }
    get dataItems(): any[] {
        return this._dataItems;
    }

    // close the action saving the new value
    close(): boolean {
        let cv = this._target.collectionView;
        if (cv && cv.currentAddItem) { // not while adding items
            return false;
        }
        this._timeStamp = Date.now();
        this._newState = this._target.getCellData(this.row, this.col, false);
        return this._newState != this._oldState;
    }

    // apply a saved cell value (state)
    applyState(state: any) {

        // apply the binding directly to the data item
        // (could be on a different row or out of view)
        let g = this._target as wijmo.grid.FlexGrid,
            ecv = g.editableCollectionView;
        if (ecv) {

            // switch pages if necessary
            if (ecv instanceof wijmo.collections.CollectionView && this._page > -1) {
                ecv.moveToPage(this._page);
            }

            // apply the state (value) to each data item
            g.deferUpdate(() => { // prevent flicker (TFS 469575)
                this._dataItems.forEach(item => {
                    ecv.editItem(item); // TFS 399689
                    for (let c = this._rng.leftCol; c <= this._rng.rightCol; c++) {
                        let col = g.columns[c],
                            bCol = g._getBindingColumn(g.cells, this.row, col);
                        if (bCol && bCol._binding) {
                            bCol._binding.setValue(item, state);
                        }
                    }
                    ecv.commitEdit(); // TFS 399689
                });
            });

            // update the view
            //ecv.refresh();
            //ecv.moveCurrentTo(this._dataItems[0]);
        }

        // update the grid selection (TFS 467579)
        g.select(g.selection.row, this.col);

        // done
        g.focus();
    }

    // accumulate edits that happen in a quick succession 
    // (e.g. pasting or clearing several cells at once)
    shouldAddAsChildAction(action: UndoableAction): boolean {
        if (action instanceof GridEditAction && action.target == this.target) {
            return action._timeStamp - this._timeStamp < 100;
        }
        return false;
    }
}
class GridSortAction extends UndoableAction {
    constructor(grid: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        super(grid);
        let cv = this._target.collectionView;
        if (cv) {
            this._oldState = cv.sortDescriptions.slice();
        }
    }

    // expose action parameters
    get control(): wijmo.Control {
        return this._target as wijmo.grid.FlexGrid;
    }

    // close the action saving the new value
    close(): boolean {
        let cv = this._target.collectionView;
        if (cv) {
            this._newState = cv.sortDescriptions.slice();
            return true;
        }
        return false;
    }

    // apply state (old or new) to target
    applyState(state: any[]) {
        let cv = this._target.collectionView;
        if (cv) {
            cv.deferUpdate(() => {
                let sd = cv.sortDescriptions;
                sd.clear();
                state.forEach(sortDesc => {
                    sd.push(sortDesc);
                });
            })
        }
        this._target.focus();
    }
}
class GridResizeAction extends UndoableAction {
    _col: wijmo.grid.Column;
    _timeStamp: number;

    constructor(grid: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        super(grid);
        this._col = grid.columns[e.col];
        this._oldState = this._col.renderWidth;
    };

    // expose action parameters
    get control(): wijmo.Control {
        return this._target as wijmo.grid.FlexGrid;
    }
    get col(): wijmo.grid.Column {
        return this._col;
    }

    // close the action saving the new value
    close(): boolean {
        this._timeStamp = Date.now();
        this._newState = this._col.renderWidth;
        return this._newState != this._oldState;
    }

    // apply state (old or new) to target
    applyState(state: any) {
        this._col.width = state;
        this._target.focus();
    }

    // accumulate resize actions that happen in a quick succession 
    // (e.g. resizing a group of columns)
    shouldAddAsChildAction(action: UndoableAction): boolean {
        if (action instanceof GridResizeAction && action.target == this.target) {
            return action._timeStamp - this._timeStamp < 100;
        }
        return false;
    }
}
class GridDragAction extends UndoableAction {
    _col: wijmo.grid.Column;

    constructor(grid: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        super(grid);
        this._col = e.getColumn(true);
        this._oldState = this._getState(this._col);
    }

    // expose action parameters
    get control(): wijmo.Control {
        return this._target as wijmo.grid.FlexGrid;
    }
    get col(): wijmo.grid.Column {
        return this._col;
    }

    // close the action saving the new value
    close(): boolean {
        this._newState = this._getState(this._col);
        return !this._areStatesEqual(this._newState, this._oldState);
    }

    // apply state (old or new) to target
    applyState(state: any) {
        const col = this._col;
        col.grid.deferUpdate(() => {
            const currentState = this._getState(col);
            currentState.coll.splice(currentState.idx, 1);
            state.coll.splice(state.idx, 0, col);
        })
        this._target.focus();
    }

    private _getState(col: wijmo.grid.Column): any {
        const coll = (col instanceof wijmo.grid.ColumnGroup)
            ? (col.parentGroup ? col.parentGroup.columns : this.target.getColumnGroups())
            : col.grid.columns;
        return {
            coll,
            idx: coll.indexOf(col),
        };
    }

    private _areStatesEqual(s1: any, s2: any): boolean {
        return (s1.coll === s2.coll) && (s1.idx === s2.idx);
    }
}
class GridAddRowAction extends UndoableAction {
    constructor(grid: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        super(grid);
        let cv = this._target.collectionView;
        if (cv && cv.currentAddItem) {
            let item = cv.currentAddItem;
            let index = cv.sourceCollection.indexOf(item);
            let position = cv.currentPosition;
            this._oldState = {
                item: item,
                index: index,
                position: position
            };
            this._newState = {
                index: index,
                position: position
            };
        }
    }

    // expose action parameters
    get control(): wijmo.Control {
        return this._target as wijmo.grid.FlexGrid;
    }

    // close the action saving the new value
    close(): boolean {
        return this._oldState != null;
    }

    // apply state (old or new) to target
    applyState(state: any) {
        let cv = this._target.collectionView;
        if (cv) {
            let arr = cv.sourceCollection;
            if (state.item) {

                // undo: remove the new item from the collection
                arr.splice(state.index, 1);

                // and remove it from itemsAdded tracking list
                if (cv instanceof wijmo.collections.CollectionView && cv.trackChanges) {
                    let item = state.item;
                    wijmo.assert(cv.itemsAdded.indexOf(item) > -1, 'item should be in the itemsAdded list');
                    cv.itemsAdded.remove(item);
                }

            } else {

                // redo: add item back to the collection
                let item = this._oldState.item;
                arr.splice(state.index, 0, item);

                // add add it back to the itemsAdded tracking list
                if (cv instanceof wijmo.collections.CollectionView && cv.trackChanges) {
                    wijmo.assert(cv.itemsAdded.indexOf(item) < 0, 'item should not be in the itemsAdded list');
                    cv.itemsAdded.push(item);
                }
            }
            cv.refresh();
            cv.moveCurrentToPosition(state.position);
            this._target.focus();
        }
    }
}
class GridRemoveRowAction extends UndoableAction {
    _timeStamp: number;
    _edtIndex = -1;

    constructor(grid: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        super(grid);
        let cv = this._target.collectionView;
        if (cv) {
            let item = grid.rows[e.row].dataItem;
            let index = cv.sourceCollection.indexOf(item);
            let position = cv.currentPosition;
            if (cv instanceof wijmo.collections.CollectionView && cv.trackChanges) {
                this._edtIndex = cv.itemsEdited.indexOf(item);
            }

            this._oldState = {
                item: item,
                index: index,
                position: position
            };
            this._newState = {
                index: index,
                position: position
            };
        }
    }

    // expose action parameters
    get control(): wijmo.Control {
        return this._target as wijmo.gauge.Gauge;
    }
    get dataItem(): any {
        return this._oldState.item;
    }

    // close the action saving the new value
    close(): boolean {
        this._timeStamp = Date.now();
        return this._oldState != null;
    }

    // apply state (old or new) to target
    applyState(state: any) {
        let g = this._target,
            cv = g.collectionView;
        if (cv) {
            let arr = cv.sourceCollection;
            if (state.item) {

                // undo: add removed item back to the collection
                arr.splice(state.index, 0, state.item);

                // tracking changes?
                if (cv instanceof wijmo.collections.CollectionView && cv.trackChanges) {

                    // remove item from itemsRemoved tracking list
                    let item = state.item;
                    wijmo.assert(cv.itemsRemoved.indexOf(item) > -1, 'item should be in the itemsRemoved list');
                    cv.itemsRemoved.remove(item);

                    // add item back to edited list                    
                    if (this._edtIndex > -1 && cv.itemsEdited.indexOf(item) < 0) {
                        cv.itemsEdited.push(item);
                    }
                }

            } else {

                // redo: remove item from the collection again
                arr.splice(state.index, 1);

                // add add it back to the itemsRemoved tracking list
                if (cv instanceof wijmo.collections.CollectionView && cv.trackChanges) {
                    let item = this._oldState.item;
                    wijmo.assert(cv.itemsRemoved.indexOf(item) < 0, 'item should not be in the itemsRemoved list');
                    cv.itemsRemoved.push(item);
                }
            }
            cv.refresh();
            cv.moveCurrentToPosition(state.position);
            let rng = new (softGrid().CellRange)(state.position, 0, state.position, g.columns.length - 1);
            g.select(rng);
            g.focus();
        }
    }

    // accumulate row deletions that happen in a quick succession 
    // (e.g. removing a row range)
    shouldAddAsChildAction(action: UndoableAction): boolean {
        if (action instanceof GridRemoveRowAction && action.target == this.target) {
            return action._timeStamp - this._timeStamp < 100;
        }
        return false;
    }
}
class ExpandCollapseColumnGroupAction extends UndoableAction {
    protected _group: wijmo.grid.ColumnGroup;

    constructor(grid: wijmo.grid.FlexGrid, e: wijmo.grid.CellRangeEventArgs) {
        super(grid);
        this._group = e.data;
        this._oldState = this._group.isCollapsed;
    }

    // expose action parameters
    get control(): wijmo.Control {
        return this._target as wijmo.grid.FlexGrid;
    }
    get group(): wijmo.grid.Column {
        return this._group;
    }

    // close the action saving the new value
    close(): boolean {
        this._newState = this._group.isCollapsed;
        return this._newState != this._oldState;
    }

    // apply state (old or new) to target
    applyState(state: any) {
        this._group.isCollapsed = state;
        this._target.focus();
    }
}

// TreeView control actions
class TreeViewEditAction extends UndoableAction {
    _nd: wijmo.nav.TreeNode;

    constructor(tree: wijmo.nav.TreeView, e: wijmo.nav.TreeNodeEventArgs) {
        super(tree);
        this._nd = e.node;
        this._oldState = this._getNodeText();
    }

    // expose action parameters
    get control(): wijmo.Control {
        return this._target as wijmo.nav.TreeView;
    }
    get node(): wijmo.nav.TreeNode {
        return this._nd;
    }

    // close the action saving the new value
    close(): boolean {
        this._newState = this._getNodeText();
        return this._newState != this._oldState;
    }

    // apply a saved node value (state)
    applyState(state: any) {
        this._nd.select(); // show node
        this._setNodeText(state as string);
        this._target.focus();
    }

    // implementation
    _getNodeText(): string {
        let item = this._nd.dataItem,
            path = this._getDisplayMemberPath(),
            val = item[path];
        return val != null ? val.toString() : '';
    }
    _setNodeText(state: string) {
        let nd = this._nd,
            item = nd.dataItem,
            path = this._getDisplayMemberPath(),
            span = nd.element.querySelector('.wj-node-text');
        item[path] = state; // save bound data
        if (nd.treeView.isContentHtml) { // update the node content
            span.innerHTML = state;
        } else {
            span.textContent = state;
        }
    }
    _getDisplayMemberPath(): string {
        let nd = this._nd,
            path = nd.treeView.displayMemberPath;
        if (path instanceof Array) {
            path = path[nd.level];
        }
        return path;
    }
}
class TreeViewCheckAction extends UndoableAction {
    _nd: wijmo.nav.TreeNode;

    constructor(tree: wijmo.nav.TreeView, e: wijmo.nav.TreeNodeEventArgs) {
        super(tree);
        this._nd = e.node;
        this._oldState = this._nd.isChecked;
    }

    // expose action parameters
    get control(): wijmo.Control {
        return this._target as wijmo.nav.TreeView;
    }
    get node(): wijmo.nav.TreeNode {
        return this._nd;
    }

    // close the action saving the new value
    close(): boolean {
        this._newState = this._nd.isChecked;
        return this._newState != this._oldState;
    }

    // apply a saved cell value (state)
    applyState(state: any) {
        this._nd.select(); // show node
        this._nd.isChecked = state as boolean;
        this._target.focus();
    }
}

    }
    


    module wijmo.undo {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.undo', wijmo.undo);






    }
    