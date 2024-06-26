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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var wijmo;
(function (wijmo) {
    var undo;
    (function (undo) {
        /**
         * Base class for undoable actions.
         */
        var UndoableAction = /** @class */ (function () {
            /**
             * Initializes a new instance of an {@link UndoableAction}.
             *
             * @param target Object that the action applies to.
             */
            function UndoableAction(target) {
                this._target = target;
            }
            /**
             * Undoes the action.
             */
            UndoableAction.prototype.undo = function () {
                // undo child actions (in reverse order)
                if (this._actions) {
                    for (var i = this._actions.length - 1; i >= 0; i--) {
                        this._actions[i].undo();
                    }
                }
                // undo parent action
                this.applyState(this._oldState);
            };
            /**
             * Redoes the action.
             */
            UndoableAction.prototype.redo = function () {
                // redo main action
                this.applyState(this._newState);
                // redo child actions
                if (this._actions) {
                    this._actions.forEach(function (action) {
                        action.redo();
                    });
                }
            };
            /**
             * Closes the action by saving the new state.
             * Returns true if the new state is different from the old state.
             */
            UndoableAction.prototype.close = function () {
                return true;
            };
            /**
             * Applies a given state to the target object.
             * @param state State to apply to the target object.
             */
            UndoableAction.prototype.applyState = function (state) {
            };
            /**
             * Gets a value that determines whether a given action should
             * be added as a child action or as a new independent action.
             *
             * @param action {@link UndoableAction} to add to this action's
             * child action list.
             */
            UndoableAction.prototype.shouldAddAsChildAction = function (action) {
                return false;
            };
            /**
             * Adds a child action to this action's child list.
             *
             * @param action {@link UndoableAction} to add to this action's
             * child action list.
             */
            UndoableAction.prototype.addChildAction = function (action) {
                if (!this._actions) {
                    this._actions = [];
                }
                this._actions.push(action);
            };
            Object.defineProperty(UndoableAction.prototype, "target", {
                /**
                 * Gets a reference to the action's target object.
                 */
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            return UndoableAction;
        }());
        undo.UndoableAction = UndoableAction;
    })(undo = wijmo.undo || (wijmo.undo = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var undo;
    (function (undo) {
        // adds HTMLElement targets to the UndoStack
        var _UndoStackHTML = /** @class */ (function () {
            function _UndoStackHTML() {
            }
            // add HTMLElements to the UntoStack context
            _UndoStackHTML.addTarget = function (stack, target) {
                var US = _UndoStackHTML;
                if (target instanceof HTMLInputElement) {
                    return US._addInputElement(stack, target);
                }
                else if (target instanceof HTMLTextAreaElement) {
                    return US._addTextAreaElement(stack, target);
                }
                else if (target instanceof HTMLSelectElement) {
                    return US._addSelectElement(stack, target);
                }
                else {
                    var added = false;
                    for (var i = 0; i < target.children.length; i++) {
                        var e = target.children[i];
                        if (e instanceof HTMLElement && stack.addTarget(e)) {
                            added = true;
                        }
                    }
                    return added;
                }
            };
            // add an input element to the UndoStack context
            _UndoStackHTML._addInputElement = function (stack, input) {
                var action = null;
                if (input.type == 'checkbox') {
                    // checkboxes are easy
                    input.addEventListener('click', function (e) {
                        stack.pushAction(new CheckboxClickAction(e));
                    });
                }
                else if (input.type == 'radio') {
                    // radios are harder: to work in IE, we have to handle mousedown
                    // on the element and on the label it refers to
                    input.addEventListener('mousedown', function (e) {
                        action = new RadioClickAction(e);
                    }, true);
                    var lbl = _UndoStackHTML._getLabel(input);
                    if (lbl) {
                        lbl.addEventListener('mousedown', function (e) {
                            action = new RadioClickAction({ target: input });
                        }, true);
                    }
                    input.addEventListener('focus', function (e) {
                        if (!(action instanceof RadioClickAction) || action.target != e.target) {
                            action = new RadioClickAction(e);
                        }
                    });
                    input.addEventListener('click', function (e) {
                        if (action instanceof RadioClickAction) {
                            stack.pushAction(action);
                            action = null;
                        }
                    });
                    return true;
                }
                else {
                    // input range elements don't get the focus on touch devices (TFS 277531)
                    if (input.type == 'range') {
                        input.addEventListener('mousedown', function (e) {
                            var ae = wijmo.getActiveElement();
                            if (ae instanceof HTMLElement && ae != input) {
                                ae.blur(); // close pending actions on other elements
                            }
                            action = new InputChangeAction(e);
                        });
                        input.addEventListener('mouseup', function (e) {
                            if (action instanceof InputChangeAction && wijmo.getActiveElement() != input) {
                                action._focus = false; // don't get the focus when applying the state
                                stack.pushAction(action); // close action if we don't have the focus
                                action = null;
                            }
                        });
                    }
                    // regular text (and range arrow keys): handle focus and blur
                    input.addEventListener('focus', function (e) {
                        if (action == null) { // start an action now if we didn't on mousedown
                            action = new InputChangeAction(e);
                        }
                    });
                    input.addEventListener('blur', function (e) {
                        if (action instanceof InputChangeAction) {
                            stack.pushAction(action);
                            action = null;
                        }
                    });
                }
                return true;
            };
            // add a textarea element to the UndoStack context
            _UndoStackHTML._addTextAreaElement = function (stack, target) {
                var action = null;
                target.addEventListener('focus', function (e) {
                    action = new InputChangeAction(e);
                });
                target.addEventListener('blur', function (e) {
                    if (action instanceof InputChangeAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                return true;
            };
            // add a select element to the UndoStack context
            _UndoStackHTML._addSelectElement = function (stack, target) {
                var action = null;
                target.addEventListener('focus', function (e) {
                    action = new InputChangeAction(e);
                });
                target.addEventListener('blur', function (e) {
                    if (action instanceof InputChangeAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                return true;
            };
            // get the label associated with an input element
            _UndoStackHTML._getLabel = function (e) {
                var lbl = e.parentElement;
                if (!(lbl instanceof HTMLLabelElement)) {
                    lbl = document.querySelector('label[for="' + e.id + '"');
                }
                return lbl;
            };
            return _UndoStackHTML;
        }());
        undo._UndoStackHTML = _UndoStackHTML;
        var InputChangeAction = /** @class */ (function (_super) {
            __extends(InputChangeAction, _super);
            function InputChangeAction(e) {
                var _this = _super.call(this, e.target) || this;
                _this._focus = true;
                _this._oldState = _this._target.value;
                return _this;
            }
            InputChangeAction.prototype.close = function () {
                this._newState = this._target.value;
                return this._newState != this._oldState;
            };
            InputChangeAction.prototype.applyState = function (state) {
                var target = this._target;
                target.value = state;
                target.dispatchEvent(undo.UndoStack._evtInput);
                if (this._focus) {
                    if (wijmo.isFunction(target.select)) {
                        target.select();
                    }
                    else {
                        target.focus();
                    }
                }
            };
            return InputChangeAction;
        }(undo.UndoableAction));
        undo.InputChangeAction = InputChangeAction;
        var CheckboxClickAction = /** @class */ (function (_super) {
            __extends(CheckboxClickAction, _super);
            function CheckboxClickAction(e) {
                var _this = _super.call(this, e.target) || this;
                wijmo.assert(_this._target.type == 'checkbox', 'checkbox expected');
                _this._newState = _this._target.checked;
                _this._oldState = !_this._newState;
                return _this;
            }
            CheckboxClickAction.prototype.applyState = function (state) {
                this._target.checked = state;
                this._target.focus();
            };
            return CheckboxClickAction;
        }(undo.UndoableAction));
        undo.CheckboxClickAction = CheckboxClickAction;
        var RadioClickAction = /** @class */ (function (_super) {
            __extends(RadioClickAction, _super);
            function RadioClickAction(e) {
                var _this = _super.call(this, e.target) || this;
                var inputType = _this._target.type;
                wijmo.assert(inputType == 'radio', 'radio button expected');
                _this._oldState = _this._getState();
                return _this;
            }
            RadioClickAction.prototype.close = function () {
                this._newState = this._getState();
                return this._newState != this._oldState;
            };
            RadioClickAction.prototype.applyState = function (state) {
                if (state) {
                    state.checked = true;
                    state.focus();
                }
            };
            RadioClickAction.prototype._getState = function () {
                var selector = 'input[name="' + this._target.name + '"]', btns = document.querySelectorAll(selector);
                for (var i = 0; i < btns.length; i++) {
                    if (btns[i].checked) {
                        return btns[i];
                    }
                }
                return null;
            };
            return RadioClickAction;
        }(undo.UndoableAction));
        undo.RadioClickAction = RadioClickAction;
    })(undo = wijmo.undo || (wijmo.undo = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var undo;
    (function (undo) {
        // details and background:
        // https://www.grapecity.com/blogs/easy-undo-redo-for-html-forms
        //
        // nice docs from Apple:
        // https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/UndoArchitecture/UndoArchitecture.html#//apple_ref/doc/uid/10000010-SW1
        /**
         * Class that provides undo/redo functionality for
         * input elements and Wijmo controls.
         */
        var UndoStack = /** @class */ (function () {
            /**
             * Initializes a new instance of the {@link UndoStack} class.
             *
             * @param target The DOM element or CSS selector for the DOM elements to be added to
             * {@link UndoStack} context. If not provided, the whole document body is added to
             * the context.
             * @param options The JavaScript object containing initialization data for the
             * {@link UndoStack}.
             */
            function UndoStack(target, options) {
                var _this = this;
                this._autoKbd = true;
                this._stack = [];
                this._maxActions = 1000;
                this._ptr = 0;
                // ** events
                /**
                 * Occurs when an element is about to be added to the {@link UndoStack} context.
                 *
                 * Listeners may prevent the element from being added to the context
                 * by setting the cancel parameter to true.
                 */
                this.addingTarget = new wijmo.Event();
                /**
                 * Occurs after an element has been added to the {@link UndoStack} context.
                 */
                this.addedTarget = new wijmo.Event();
                /**
                 * Occurs when an {@link UndoableAction} is about to be added to the stack.
                 */
                this.addingAction = new wijmo.Event();
                /**
                 * Occurs after an {@link UndoableAction} had been added to the stack.
                 */
                this.addedAction = new wijmo.Event();
                /**
                 * Occurs when an {@link UndoableAction} is about to be undone.
                 */
                this.undoingAction = new wijmo.Event();
                /**
                 * Occurs after an {@link UndoableAction} has been undone.
                 *
                 * @param e {@link UndoActionEventArgs} that contains the event data.
                 */
                this.undoneAction = new wijmo.Event();
                /**
                 * Occurs when an {@link UndoableAction} is about to be redone.
                 */
                this.redoingAction = new wijmo.Event();
                /**
                 * Occurs after an {@link UndoableAction} has been redone.
                 *
                 * @param e {@link UndoActionEventArgs} that contains the event data.
                 */
                this.redoneAction = new wijmo.Event();
                /**
                 * Occurs when the state of the {@link UndoStack} changes.
                 *
                 * Use this event to update UI elements that reflect the state of the
                 * {@link UndoStack}. For example, to enable or disable undo/redo buttons.
                 */
                this.stateChanged = new wijmo.Event();
                // initialize input event dispatcher
                if (!UndoStack._evtInput) {
                    var evt = document.createEvent('HTMLEvents');
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
                document.addEventListener('keydown', function (e) {
                    if (_this._autoKbd && e.ctrlKey && !e.defaultPrevented) {
                        if (wijmo.contains(target, e.target)) { // TFS 275107
                            switch (e.keyCode) {
                                case 90: // ctrl+Z => undo
                                    if (_this.canUndo) {
                                        wijmo.getActiveElement().blur(); // TFS 436233
                                        setTimeout(function () { return _this.undo(); }, 100);
                                    }
                                    e.preventDefault();
                                    break;
                                case 89: // ctrl+Y => redo
                                    if (_this.canRedo) {
                                        wijmo.getActiveElement().blur(); // TFS 436233
                                        setTimeout(function () { return _this.redo(); }, 100);
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
            UndoStack.prototype.addTarget = function (target) {
                var added = false;
                // selectors
                if (wijmo.isString(target)) {
                    var targets = document.querySelectorAll(target), added_1 = false;
                    for (var i = 0; i < targets.length; i++) {
                        if (this.addTarget(targets[i])) {
                            added_1 = true;
                        }
                    }
                    return added_1;
                }
                // sanity
                wijmo.assert(target instanceof HTMLElement, 'Undo target should be an HTML element');
                // add target
                var e = new AddTargetEventArgs(target);
                e.cancel = wijmo.hasClass(target, 'wj-no-undo');
                if (this.onAddingTarget(e)) {
                    // Wijmo controls
                    var ctl = wijmo.Control.getControl(target);
                    if (ctl) {
                        added = undo._UndoStackWijmo.addTarget(this, ctl);
                    }
                    // HTML elements
                    if (!added) { // && !closest(target, '.wj-control')) { // TFS 472192
                        added = undo._UndoStackHTML.addTarget(this, target);
                    }
                    // done adding target
                    if (added) {
                        this.onAddedTarget(e);
                    }
                }
                return added;
            };
            Object.defineProperty(UndoStack.prototype, "autoKeyboard", {
                /**
                 * Gets or sets a value that determines whether the {@link UndoStack}
                 * should monitor the keyboard and handle the undo/redo keys (ctrl+Z/ctrl+Y)
                 * automatically.
                 */
                get: function () {
                    return this._autoKbd;
                },
                set: function (value) {
                    this._autoKbd = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UndoStack.prototype, "isDisabled", {
                /**
                 * Gets or sets a vlue that determines whether the {@link UndoStack} is currently disabled.
                 */
                get: function () {
                    return this._disabled;
                },
                set: function (value) {
                    this._disabled = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UndoStack.prototype, "maxActions", {
                /**
                 * Gets or sets the maximum number of actions to store in the {@link UndoStack}.
                 *
                 * The default value for this property is **1,000** actions.
                 */
                get: function () {
                    return this._maxActions;
                },
                set: function (value) {
                    if (value != this._maxActions) {
                        this._maxActions = wijmo.asNumber(value, false, true);
                        this.clear();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UndoStack.prototype, "actionCount", {
                /**
                 * Gets the number of actions currently stored in the {@link UndoStack}.
                 */
                get: function () {
                    return this._stack.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UndoStack.prototype, "canUndo", {
                /**
                 * Gets a value that determines whether the {@link UndoStack} is ready to undo an action.
                 */
                get: function () {
                    return this._stack.length > 0 && this._ptr > 0 && !this._disabled;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UndoStack.prototype, "canRedo", {
                /**
                 * Gets a value that determines whether the {@link UndoStack} is ready to redo an action.
                 */
                get: function () {
                    return this._stack.length > 0 && this._ptr < this._stack.length && !this._disabled;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Undoes the last action recorded.
             */
            UndoStack.prototype.undo = function () {
                if (this.canUndo) {
                    var action = this._stack[this._ptr - 1], e = new UndoActionEventArgs(action);
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
            };
            /**
             * Redoes the last action undone.
             */
            UndoStack.prototype.redo = function () {
                if (this.canRedo) {
                    var action = this._stack[this._ptr], e = new UndoActionEventArgs(action);
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
            };
            /**
             * Clears the {@link UndoStack}.
             */
            UndoStack.prototype.clear = function () {
                this._ptr = 0;
                this._stack.splice(0, this._stack.length);
                this.onStateChanged();
            };
            /**
             * Pushes a new undoable action onto the stack.
             *
             * @param action {@link UndoableAction} to add to the stack.
             */
            UndoStack.prototype.pushAction = function (action) {
                this._pendingAction = action;
                this.pushPendingAction();
            };
            /**
             * Raises the {@link addingTarget} event.
             *
             * @param e {@link AddTargetEventArgs} that contains the event data.
             * @return True if the event was not canceled.
             */
            UndoStack.prototype.onAddingTarget = function (e) {
                this.addingTarget.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {link @addedTarget} event.
             *
             * @param e {@link AddTargetEventArgs} that contains the event data.
             */
            UndoStack.prototype.onAddedTarget = function (e) {
                this.addedTarget.raise(this, e);
            };
            /**
             * Raises the {@link addingAction} event.
             *
             * @param e {@link UndoActionEventArgs} that contains the event data.
             * @return True if the event was not canceled.
             */
            UndoStack.prototype.onAddingAction = function (e) {
                this.addingAction.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link addedAction} event.
             *
             * @param e {@link UndoActionEventArgs} that contains the event data.
             */
            UndoStack.prototype.onAddedAction = function (e) {
                this.addedAction.raise(this, e);
            };
            /**
             * Raises the {@link undoingAction} event.
             *
             * @param e {@link UndoActionEventArgs} that contains the event data.
             * @return True if the event was not canceled.
             */
            UndoStack.prototype.onUndoingAction = function (e) {
                this.undoingAction.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link undoneAction} event.
             *
             * @param e {@link UndoActionEventArgs} that contains the event data.
             */
            UndoStack.prototype.onUndoneAction = function (e) {
                this.undoneAction.raise(this, e);
            };
            /**
             * Raises the {@link redoingAction} event.
             *
             * @param e {@link UndoActionEventArgs} that contains the event data.
             * @return True if the event was not canceled.
             */
            UndoStack.prototype.onRedoingAction = function (e) {
                this.redoingAction.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link redoneAction} event.
             *
             * @param e {@link UndoActionEventArgs} that contains the event data.
             */
            UndoStack.prototype.onRedoneAction = function (e) {
                this.redoneAction.raise(this, e);
            };
            /**
             * Raises the {@link stateChanged} event.
             */
            UndoStack.prototype.onStateChanged = function () {
                this.stateChanged.raise(this, wijmo.EventArgs.empty);
            };
            // ** implementation
            // close the current action and push it onto the undo stack
            UndoStack.prototype.pushPendingAction = function () {
                if (!this._disabled && !this._undoing && this._pendingAction && this._pendingAction.close()) {
                    // discard any actions after the pointer (redo list)
                    this._stack.splice(this._ptr, this._stack.length - this._ptr);
                    wijmo.assert(this._stack.length == this._ptr, 'should be at the end of the stack');
                    // accumulate with last action
                    if (this._stack.length) {
                        var lastAction = this._stack[this._ptr - 1];
                        if (lastAction.shouldAddAsChildAction(this._pendingAction)) {
                            lastAction.addChildAction(this._pendingAction);
                            this._pendingAction = null;
                            this.onStateChanged();
                            return;
                        }
                    }
                    // raise addingUndoAction
                    var e = new UndoActionEventArgs(this._pendingAction);
                    if (!this.onAddingAction(e)) {
                        return;
                    }
                    // push the current pending action
                    this._stack.push(this._pendingAction);
                    this._ptr++;
                    this._pendingAction = null;
                    // limit stack size
                    var extra = this._stack.length - this._maxActions;
                    if (extra > 0) {
                        this._stack.splice(0, extra);
                        this._ptr -= extra;
                        wijmo.assert(this._ptr >= 0, 'pointer should not be negative');
                    }
                    // state has changed
                    this.onStateChanged();
                }
            };
            return UndoStack;
        }());
        undo.UndoStack = UndoStack;
        /**
         * Provides arguments for the {@link UndoStack.addingTarget} and {@link UndoStack.addedTarget}
         * events.
         */
        var AddTargetEventArgs = /** @class */ (function (_super) {
            __extends(AddTargetEventArgs, _super);
            /**
             * Initializes a new instance of the {@link AddTargetEventArgs} class.
             *
             * @param target HTMLElement being added to the {@link UndoStack} context.
             */
            function AddTargetEventArgs(target) {
                var _this = _super.call(this) || this;
                _this._target = target;
                return _this;
            }
            Object.defineProperty(AddTargetEventArgs.prototype, "target", {
                /**
                 * Gets a reference to the HTMLElement being added to the {@link UndoStack} context.
                 */
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            return AddTargetEventArgs;
        }(wijmo.CancelEventArgs));
        undo.AddTargetEventArgs = AddTargetEventArgs;
        /**
         * Provides arguments for the {@link UndoStack.undoingAction}, {@link UndoStack.undoneAction},
         * {@link UndoStack.redoingAction}, and {@link UndoStack.redoneAction} events.
         */
        var UndoActionEventArgs = /** @class */ (function (_super) {
            __extends(UndoActionEventArgs, _super);
            /**
             * Initializes a new instance of the {@link AddTargetEventArgs} class.
             *
             * @param action {@link UndoableAction} being added to the {@link UndoStack}.
             */
            function UndoActionEventArgs(action) {
                var _this = _super.call(this) || this;
                _this._action = action;
                return _this;
            }
            Object.defineProperty(UndoActionEventArgs.prototype, "action", {
                /**
                 * Gets a reference to the {@link UndoableAction} that this event refers to.
                 */
                get: function () {
                    return this._action;
                },
                enumerable: true,
                configurable: true
            });
            return UndoActionEventArgs;
        }(wijmo.CancelEventArgs));
        undo.UndoActionEventArgs = UndoActionEventArgs;
    })(undo = wijmo.undo || (wijmo.undo = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var undo;
    (function (undo) {
        function softInput() {
            return wijmo._getModule('wijmo.input');
        }
        undo.softInput = softInput;
        function softGrid() {
            return wijmo._getModule('wijmo.grid');
        }
        undo.softGrid = softGrid;
        function softGauge() {
            return wijmo._getModule('wijmo.gauge');
        }
        undo.softGauge = softGauge;
        function softNav() {
            return wijmo._getModule('wijmo.nav');
        }
        undo.softNav = softNav;
    })(undo = wijmo.undo || (wijmo.undo = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var undo;
    (function (undo) {
        // adds Wijmo control targets to the UndoStack
        var _UndoStackWijmo = /** @class */ (function () {
            function _UndoStackWijmo() {
            }
            // adds a Wijmo Control target to the UndoStack
            _UndoStackWijmo.addTarget = function (stack, ctl) {
                var US = _UndoStackWijmo;
                if (undo.softGrid() && ctl instanceof undo.softGrid().FlexGrid) {
                    return US._addFlexGrid(stack, ctl);
                }
                else if (undo.softGauge() && ctl instanceof undo.softGauge().Gauge) {
                    return US._addGauge(stack, ctl);
                }
                else if (undo.softNav() && ctl instanceof undo.softNav().TreeView) {
                    return US._addTreeView(stack, ctl);
                }
                else if (US._isInputControl(ctl)) {
                    return US._addInputControl(stack, ctl);
                }
                return false;
            };
            _UndoStackWijmo._isInputControl = function (ctl) {
                var wjInput = undo.softInput();
                if (wjInput) {
                    return ctl instanceof wjInput.DropDown || ctl instanceof wjInput.InputMask ||
                        ctl instanceof wjInput.InputNumber || ctl instanceof wjInput.Calendar ||
                        ctl instanceof wjInput.ColorPicker;
                }
                return false;
            };
            // add an input-based Wijmo control to the UndoStack context
            _UndoStackWijmo._addInputControl = function (stack, ctl) {
                var action = null;
                ctl.gotFocus.addHandler(function () {
                    action = new InputControlChangeAction({ target: ctl });
                });
                ctl.lostFocus.addHandler(function () {
                    if (action instanceof InputControlChangeAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                return true;
            };
            // add a Gauge control to the UndoStack context 
            _UndoStackWijmo._addGauge = function (stack, gauge) {
                if (!gauge.isReadOnly) {
                    var action_1 = null;
                    gauge.hostElement.addEventListener('focus', function () {
                        if (!action_1) {
                            action_1 = new GaugeChangeAction(gauge);
                        }
                    });
                    //gauge.gotFocus.addHandler(() => { // too late, the value has already changed
                    //    action = new GaugeChangeAction(gauge);
                    //});
                    gauge.lostFocus.addHandler(function () {
                        if (action_1 instanceof GaugeChangeAction) {
                            stack.pushAction(action_1);
                            action_1 = null;
                        }
                    });
                    return true;
                }
                return false;
            };
            // add a TreeView control to the UndoStack context
            _UndoStackWijmo._addTreeView = function (stack, tree) {
                var action = null;
                // edit nodes
                tree.nodeEditStarted.addHandler(function (s, e) {
                    action = new TreeViewEditAction(s, e);
                });
                tree.nodeEditEnded.addHandler(function (s, e) {
                    if (action instanceof TreeViewEditAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                // check/uncheck nodes
                tree.isCheckedChanging.addHandler(function (s, e) {
                    action = new TreeViewCheckAction(s, e);
                });
                tree.isCheckedChanged.addHandler(function (s, e) {
                    if (action instanceof TreeViewCheckAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                return true;
            };
            // add a FlexGrid control to the UndoStack context
            _UndoStackWijmo._addFlexGrid = function (stack, grid) {
                var action = null;
                // edit/clear actions
                grid.beginningEdit.addHandler(function (s, e) {
                    action = (e.getRow() instanceof wijmo.grid._NewRowTemplate) // TFS 391704
                        ? null
                        : new GridEditAction(s, e);
                });
                grid.cellEditEnded.addHandler(function (s, e) {
                    if (action instanceof GridEditAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                // paste
                grid.pastingCell.addHandler(function (s, e) {
                    action = new GridEditAction(s, e);
                });
                grid.pastedCell.addHandler(function (s, e) {
                    if (action instanceof GridEditAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                // sort actions
                grid.sortingColumn.addHandler(function (s, e) {
                    action = new GridSortAction(s, e);
                });
                grid.sortedColumn.addHandler(function (s, e) {
                    if (action instanceof GridSortAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                // resize/autosize columns
                grid.resizingColumn.addHandler(function (s, e) {
                    if (!(action instanceof GridResizeAction)) {
                        action = new GridResizeAction(s, e);
                    }
                });
                grid.resizedColumn.addHandler(function () {
                    if (action instanceof GridResizeAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                grid.autoSizingColumn.addHandler(function (s, e) {
                    action = new GridResizeAction(s, e);
                });
                grid.autoSizedColumn.addHandler(function () {
                    if (action instanceof GridResizeAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                // drag columns
                grid.draggingColumn.addHandler(function (s, e) {
                    action = new GridDragAction(s, e);
                });
                grid.draggedColumn.addHandler(function (s, e) {
                    if (action instanceof GridDragAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                // add/remove rows
                grid.rowAdded.addHandler(function (s, e) {
                    if (!e.cancel) {
                        stack.pushAction(new GridAddRowAction(s, e));
                    }
                });
                grid.deletingRow.addHandler(function (s, e) {
                    if (!e.cancel) {
                        stack.pushAction(new GridRemoveRowAction(s, e));
                    }
                });
                // expand/collapse columnGroups
                grid.columnGroupCollapsedChanging.addHandler(function (s, e) {
                    action = new ExpandCollapseColumnGroupAction(s, e);
                });
                grid.columnGroupCollapsedChanged.addHandler(function (s, e) {
                    if (action instanceof ExpandCollapseColumnGroupAction) {
                        stack.pushAction(action);
                        action = null;
                    }
                });
                // TODO: filter, collapse/expand nodes
                return true;
            };
            return _UndoStackWijmo;
        }());
        undo._UndoStackWijmo = _UndoStackWijmo;
        // input control actions
        var InputControlChangeAction = /** @class */ (function (_super) {
            __extends(InputControlChangeAction, _super);
            function InputControlChangeAction(e) {
                var _this = _super.call(this, e) || this;
                _this._ctl = e.target;
                _this._oldState = _this._getControlState();
                return _this;
            }
            Object.defineProperty(InputControlChangeAction.prototype, "control", {
                // expose action parameters
                get: function () {
                    return this._ctl;
                },
                enumerable: true,
                configurable: true
            });
            // close the action saving the new value
            InputControlChangeAction.prototype.close = function () {
                this._timeStamp = Date.now();
                this._newState = this._getControlState();
                return !this._sameContent(this._oldState, this._newState);
            };
            // accumulate edits that happen in a quick succession 
            // (e.g. incrementing a number with the inc/dec buttons)
            InputControlChangeAction.prototype.shouldAddAsChildAction = function (action) {
                if (action instanceof InputControlChangeAction && action.target == this.target) {
                    if (action._timeStamp - this._timeStamp < 500) {
                        this._timeStamp = Date.now();
                        return true;
                    }
                }
                return false;
            };
            // apply state (old or new) to target
            InputControlChangeAction.prototype.applyState = function (state) {
                var ctl = this._ctl, wjInput = undo.softInput();
                if (wjInput) {
                    var dateRange = ctl instanceof wjInput.Calendar || ctl instanceof wjInput.InputDate;
                    if (dateRange && ctl.selectionMode != wjInput.DateSelectionMode.Range) {
                        dateRange = false;
                    }
                    if (ctl instanceof wjInput.MultiSelect) {
                        ctl.checkedItems = state;
                    }
                    else if (ctl instanceof wjInput.MultiAutoComplete) {
                        ctl.selectedItems = state;
                    }
                    else if (dateRange) {
                        ctl.value = state[0];
                        ctl.rangeEnd = state[1];
                    }
                    else if ('value' in ctl) {
                        ctl.value = state;
                    }
                    else if ('text' in ctl) {
                        ctl.text = state;
                    }
                    else {
                        wijmo.assert(false, 'can\'t apply control state?');
                    }
                    ctl.focus();
                }
            };
            // get the control state
            InputControlChangeAction.prototype._getControlState = function () {
                var ctl = this._ctl, wjInput = undo.softInput();
                if (wjInput) {
                    var dateRange = ctl instanceof wjInput.Calendar || ctl instanceof wjInput.InputDate;
                    if (dateRange && ctl.selectionMode != wjInput.DateSelectionMode.Range) {
                        dateRange = false;
                    }
                    if (ctl instanceof wjInput.MultiSelect) {
                        return ctl.checkedItems.slice();
                    }
                    else if (ctl instanceof wjInput.MultiAutoComplete) {
                        return ctl.selectedItems.slice();
                    }
                    else if (dateRange) {
                        return [ctl.value, ctl.rangeEnd];
                    }
                    else if ('value' in ctl) {
                        return ctl.value;
                    }
                    else if ('text' in ctl) {
                        return ctl.text;
                    }
                    wijmo.assert(false, 'can\'t get control state?');
                }
            };
            // compare two values for equality
            InputControlChangeAction.prototype._sameContent = function (obj1, obj2) {
                // compare two arrays by content
                if (wijmo.isArray(obj1) && wijmo.isArray(obj2)) {
                    if (obj1.length != obj2.length) {
                        return false;
                    }
                    for (var i = 0; i < obj1.length; i++) {
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
            };
            return InputControlChangeAction;
        }(undo.InputChangeAction));
        // gauge control actions
        var GaugeChangeAction = /** @class */ (function (_super) {
            __extends(GaugeChangeAction, _super);
            // create a new GaugeChangeAction saving the original gauge value
            function GaugeChangeAction(gauge) {
                var _this = _super.call(this, gauge) || this;
                _this._oldState = gauge.value;
                return _this;
            }
            Object.defineProperty(GaugeChangeAction.prototype, "control", {
                // expose action parameters
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            // close and remember the new gauge value
            GaugeChangeAction.prototype.close = function () {
                this._newState = this._target.value;
                return this._newState != this._oldState;
            };
            // apply state (old or new) to target
            GaugeChangeAction.prototype.applyState = function (state) {
                var ctl = this._target;
                ctl.value = state;
                ctl.focus();
            };
            return GaugeChangeAction;
        }(undo.UndoableAction));
        // FlexGrid control actions
        var GridEditAction = /** @class */ (function (_super) {
            __extends(GridEditAction, _super);
            // create a new GridEditAction including the cell range and content
            function GridEditAction(grid, e) {
                var _this = _super.call(this, grid) || this;
                _this._dataItems = [];
                var cv = grid.collectionView;
                var rng = _this._rng = e.range;
                for (var i = rng.topRow; i <= rng.bottomRow; i++) {
                    _this._dataItems.push(grid.rows[i].dataItem);
                }
                _this._page = cv instanceof wijmo.collections.CollectionView ? cv.pageIndex : -1;
                _this._oldState = grid.getCellData(e.row, e.col, false);
                return _this;
            }
            Object.defineProperty(GridEditAction.prototype, "control", {
                // expose action parameters
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridEditAction.prototype, "range", {
                get: function () {
                    return this._rng.clone();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridEditAction.prototype, "row", {
                get: function () {
                    return this._rng.topRow;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridEditAction.prototype, "col", {
                get: function () {
                    return this._rng.leftCol;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridEditAction.prototype, "dataItem", {
                get: function () {
                    return this._dataItems[0];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridEditAction.prototype, "dataItems", {
                get: function () {
                    return this._dataItems;
                },
                enumerable: true,
                configurable: true
            });
            // close the action saving the new value
            GridEditAction.prototype.close = function () {
                var cv = this._target.collectionView;
                if (cv && cv.currentAddItem) { // not while adding items
                    return false;
                }
                this._timeStamp = Date.now();
                this._newState = this._target.getCellData(this.row, this.col, false);
                return this._newState != this._oldState;
            };
            // apply a saved cell value (state)
            GridEditAction.prototype.applyState = function (state) {
                var _this = this;
                // apply the binding directly to the data item
                // (could be on a different row or out of view)
                var g = this._target, ecv = g.editableCollectionView;
                if (ecv) {
                    // switch pages if necessary
                    if (ecv instanceof wijmo.collections.CollectionView && this._page > -1) {
                        ecv.moveToPage(this._page);
                    }
                    // apply the state (value) to each data item
                    g.deferUpdate(function () {
                        _this._dataItems.forEach(function (item) {
                            ecv.editItem(item); // TFS 399689
                            for (var c = _this._rng.leftCol; c <= _this._rng.rightCol; c++) {
                                var col = g.columns[c], bCol = g._getBindingColumn(g.cells, _this.row, col);
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
            };
            // accumulate edits that happen in a quick succession 
            // (e.g. pasting or clearing several cells at once)
            GridEditAction.prototype.shouldAddAsChildAction = function (action) {
                if (action instanceof GridEditAction && action.target == this.target) {
                    return action._timeStamp - this._timeStamp < 100;
                }
                return false;
            };
            return GridEditAction;
        }(undo.UndoableAction));
        var GridSortAction = /** @class */ (function (_super) {
            __extends(GridSortAction, _super);
            function GridSortAction(grid, e) {
                var _this = _super.call(this, grid) || this;
                var cv = _this._target.collectionView;
                if (cv) {
                    _this._oldState = cv.sortDescriptions.slice();
                }
                return _this;
            }
            Object.defineProperty(GridSortAction.prototype, "control", {
                // expose action parameters
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            // close the action saving the new value
            GridSortAction.prototype.close = function () {
                var cv = this._target.collectionView;
                if (cv) {
                    this._newState = cv.sortDescriptions.slice();
                    return true;
                }
                return false;
            };
            // apply state (old or new) to target
            GridSortAction.prototype.applyState = function (state) {
                var cv = this._target.collectionView;
                if (cv) {
                    cv.deferUpdate(function () {
                        var sd = cv.sortDescriptions;
                        sd.clear();
                        state.forEach(function (sortDesc) {
                            sd.push(sortDesc);
                        });
                    });
                }
                this._target.focus();
            };
            return GridSortAction;
        }(undo.UndoableAction));
        var GridResizeAction = /** @class */ (function (_super) {
            __extends(GridResizeAction, _super);
            function GridResizeAction(grid, e) {
                var _this = _super.call(this, grid) || this;
                _this._col = grid.columns[e.col];
                _this._oldState = _this._col.renderWidth;
                return _this;
            }
            ;
            Object.defineProperty(GridResizeAction.prototype, "control", {
                // expose action parameters
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridResizeAction.prototype, "col", {
                get: function () {
                    return this._col;
                },
                enumerable: true,
                configurable: true
            });
            // close the action saving the new value
            GridResizeAction.prototype.close = function () {
                this._timeStamp = Date.now();
                this._newState = this._col.renderWidth;
                return this._newState != this._oldState;
            };
            // apply state (old or new) to target
            GridResizeAction.prototype.applyState = function (state) {
                this._col.width = state;
                this._target.focus();
            };
            // accumulate resize actions that happen in a quick succession 
            // (e.g. resizing a group of columns)
            GridResizeAction.prototype.shouldAddAsChildAction = function (action) {
                if (action instanceof GridResizeAction && action.target == this.target) {
                    return action._timeStamp - this._timeStamp < 100;
                }
                return false;
            };
            return GridResizeAction;
        }(undo.UndoableAction));
        var GridDragAction = /** @class */ (function (_super) {
            __extends(GridDragAction, _super);
            function GridDragAction(grid, e) {
                var _this = _super.call(this, grid) || this;
                _this._col = e.getColumn(true);
                _this._oldState = _this._getState(_this._col);
                return _this;
            }
            Object.defineProperty(GridDragAction.prototype, "control", {
                // expose action parameters
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridDragAction.prototype, "col", {
                get: function () {
                    return this._col;
                },
                enumerable: true,
                configurable: true
            });
            // close the action saving the new value
            GridDragAction.prototype.close = function () {
                this._newState = this._getState(this._col);
                return !this._areStatesEqual(this._newState, this._oldState);
            };
            // apply state (old or new) to target
            GridDragAction.prototype.applyState = function (state) {
                var _this = this;
                var col = this._col;
                col.grid.deferUpdate(function () {
                    var currentState = _this._getState(col);
                    currentState.coll.splice(currentState.idx, 1);
                    state.coll.splice(state.idx, 0, col);
                });
                this._target.focus();
            };
            GridDragAction.prototype._getState = function (col) {
                var coll = (col instanceof wijmo.grid.ColumnGroup)
                    ? (col.parentGroup ? col.parentGroup.columns : this.target.getColumnGroups())
                    : col.grid.columns;
                return {
                    coll: coll,
                    idx: coll.indexOf(col),
                };
            };
            GridDragAction.prototype._areStatesEqual = function (s1, s2) {
                return (s1.coll === s2.coll) && (s1.idx === s2.idx);
            };
            return GridDragAction;
        }(undo.UndoableAction));
        var GridAddRowAction = /** @class */ (function (_super) {
            __extends(GridAddRowAction, _super);
            function GridAddRowAction(grid, e) {
                var _this = _super.call(this, grid) || this;
                var cv = _this._target.collectionView;
                if (cv && cv.currentAddItem) {
                    var item = cv.currentAddItem;
                    var index = cv.sourceCollection.indexOf(item);
                    var position = cv.currentPosition;
                    _this._oldState = {
                        item: item,
                        index: index,
                        position: position
                    };
                    _this._newState = {
                        index: index,
                        position: position
                    };
                }
                return _this;
            }
            Object.defineProperty(GridAddRowAction.prototype, "control", {
                // expose action parameters
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            // close the action saving the new value
            GridAddRowAction.prototype.close = function () {
                return this._oldState != null;
            };
            // apply state (old or new) to target
            GridAddRowAction.prototype.applyState = function (state) {
                var cv = this._target.collectionView;
                if (cv) {
                    var arr = cv.sourceCollection;
                    if (state.item) {
                        // undo: remove the new item from the collection
                        arr.splice(state.index, 1);
                        // and remove it from itemsAdded tracking list
                        if (cv instanceof wijmo.collections.CollectionView && cv.trackChanges) {
                            var item = state.item;
                            wijmo.assert(cv.itemsAdded.indexOf(item) > -1, 'item should be in the itemsAdded list');
                            cv.itemsAdded.remove(item);
                        }
                    }
                    else {
                        // redo: add item back to the collection
                        var item = this._oldState.item;
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
            };
            return GridAddRowAction;
        }(undo.UndoableAction));
        var GridRemoveRowAction = /** @class */ (function (_super) {
            __extends(GridRemoveRowAction, _super);
            function GridRemoveRowAction(grid, e) {
                var _this = _super.call(this, grid) || this;
                _this._edtIndex = -1;
                var cv = _this._target.collectionView;
                if (cv) {
                    var item = grid.rows[e.row].dataItem;
                    var index = cv.sourceCollection.indexOf(item);
                    var position = cv.currentPosition;
                    if (cv instanceof wijmo.collections.CollectionView && cv.trackChanges) {
                        _this._edtIndex = cv.itemsEdited.indexOf(item);
                    }
                    _this._oldState = {
                        item: item,
                        index: index,
                        position: position
                    };
                    _this._newState = {
                        index: index,
                        position: position
                    };
                }
                return _this;
            }
            Object.defineProperty(GridRemoveRowAction.prototype, "control", {
                // expose action parameters
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridRemoveRowAction.prototype, "dataItem", {
                get: function () {
                    return this._oldState.item;
                },
                enumerable: true,
                configurable: true
            });
            // close the action saving the new value
            GridRemoveRowAction.prototype.close = function () {
                this._timeStamp = Date.now();
                return this._oldState != null;
            };
            // apply state (old or new) to target
            GridRemoveRowAction.prototype.applyState = function (state) {
                var g = this._target, cv = g.collectionView;
                if (cv) {
                    var arr = cv.sourceCollection;
                    if (state.item) {
                        // undo: add removed item back to the collection
                        arr.splice(state.index, 0, state.item);
                        // tracking changes?
                        if (cv instanceof wijmo.collections.CollectionView && cv.trackChanges) {
                            // remove item from itemsRemoved tracking list
                            var item = state.item;
                            wijmo.assert(cv.itemsRemoved.indexOf(item) > -1, 'item should be in the itemsRemoved list');
                            cv.itemsRemoved.remove(item);
                            // add item back to edited list                    
                            if (this._edtIndex > -1 && cv.itemsEdited.indexOf(item) < 0) {
                                cv.itemsEdited.push(item);
                            }
                        }
                    }
                    else {
                        // redo: remove item from the collection again
                        arr.splice(state.index, 1);
                        // add add it back to the itemsRemoved tracking list
                        if (cv instanceof wijmo.collections.CollectionView && cv.trackChanges) {
                            var item = this._oldState.item;
                            wijmo.assert(cv.itemsRemoved.indexOf(item) < 0, 'item should not be in the itemsRemoved list');
                            cv.itemsRemoved.push(item);
                        }
                    }
                    cv.refresh();
                    cv.moveCurrentToPosition(state.position);
                    var rng = new (undo.softGrid().CellRange)(state.position, 0, state.position, g.columns.length - 1);
                    g.select(rng);
                    g.focus();
                }
            };
            // accumulate row deletions that happen in a quick succession 
            // (e.g. removing a row range)
            GridRemoveRowAction.prototype.shouldAddAsChildAction = function (action) {
                if (action instanceof GridRemoveRowAction && action.target == this.target) {
                    return action._timeStamp - this._timeStamp < 100;
                }
                return false;
            };
            return GridRemoveRowAction;
        }(undo.UndoableAction));
        var ExpandCollapseColumnGroupAction = /** @class */ (function (_super) {
            __extends(ExpandCollapseColumnGroupAction, _super);
            function ExpandCollapseColumnGroupAction(grid, e) {
                var _this = _super.call(this, grid) || this;
                _this._group = e.data;
                _this._oldState = _this._group.isCollapsed;
                return _this;
            }
            Object.defineProperty(ExpandCollapseColumnGroupAction.prototype, "control", {
                // expose action parameters
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ExpandCollapseColumnGroupAction.prototype, "group", {
                get: function () {
                    return this._group;
                },
                enumerable: true,
                configurable: true
            });
            // close the action saving the new value
            ExpandCollapseColumnGroupAction.prototype.close = function () {
                this._newState = this._group.isCollapsed;
                return this._newState != this._oldState;
            };
            // apply state (old or new) to target
            ExpandCollapseColumnGroupAction.prototype.applyState = function (state) {
                this._group.isCollapsed = state;
                this._target.focus();
            };
            return ExpandCollapseColumnGroupAction;
        }(undo.UndoableAction));
        // TreeView control actions
        var TreeViewEditAction = /** @class */ (function (_super) {
            __extends(TreeViewEditAction, _super);
            function TreeViewEditAction(tree, e) {
                var _this = _super.call(this, tree) || this;
                _this._nd = e.node;
                _this._oldState = _this._getNodeText();
                return _this;
            }
            Object.defineProperty(TreeViewEditAction.prototype, "control", {
                // expose action parameters
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeViewEditAction.prototype, "node", {
                get: function () {
                    return this._nd;
                },
                enumerable: true,
                configurable: true
            });
            // close the action saving the new value
            TreeViewEditAction.prototype.close = function () {
                this._newState = this._getNodeText();
                return this._newState != this._oldState;
            };
            // apply a saved node value (state)
            TreeViewEditAction.prototype.applyState = function (state) {
                this._nd.select(); // show node
                this._setNodeText(state);
                this._target.focus();
            };
            // implementation
            TreeViewEditAction.prototype._getNodeText = function () {
                var item = this._nd.dataItem, path = this._getDisplayMemberPath(), val = item[path];
                return val != null ? val.toString() : '';
            };
            TreeViewEditAction.prototype._setNodeText = function (state) {
                var nd = this._nd, item = nd.dataItem, path = this._getDisplayMemberPath(), span = nd.element.querySelector('.wj-node-text');
                item[path] = state; // save bound data
                if (nd.treeView.isContentHtml) { // update the node content
                    span.innerHTML = state;
                }
                else {
                    span.textContent = state;
                }
            };
            TreeViewEditAction.prototype._getDisplayMemberPath = function () {
                var nd = this._nd, path = nd.treeView.displayMemberPath;
                if (path instanceof Array) {
                    path = path[nd.level];
                }
                return path;
            };
            return TreeViewEditAction;
        }(undo.UndoableAction));
        var TreeViewCheckAction = /** @class */ (function (_super) {
            __extends(TreeViewCheckAction, _super);
            function TreeViewCheckAction(tree, e) {
                var _this = _super.call(this, tree) || this;
                _this._nd = e.node;
                _this._oldState = _this._nd.isChecked;
                return _this;
            }
            Object.defineProperty(TreeViewCheckAction.prototype, "control", {
                // expose action parameters
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TreeViewCheckAction.prototype, "node", {
                get: function () {
                    return this._nd;
                },
                enumerable: true,
                configurable: true
            });
            // close the action saving the new value
            TreeViewCheckAction.prototype.close = function () {
                this._newState = this._nd.isChecked;
                return this._newState != this._oldState;
            };
            // apply a saved cell value (state)
            TreeViewCheckAction.prototype.applyState = function (state) {
                this._nd.select(); // show node
                this._nd.isChecked = state;
                this._target.focus();
            };
            return TreeViewCheckAction;
        }(undo.UndoableAction));
    })(undo = wijmo.undo || (wijmo.undo = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var undo;
    (function (undo) {
        // Entry file. All real code files should be re-exported from here.
        wijmo._registerModule('wijmo.undo', wijmo.undo);
    })(undo = wijmo.undo || (wijmo.undo = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.undo.js.map