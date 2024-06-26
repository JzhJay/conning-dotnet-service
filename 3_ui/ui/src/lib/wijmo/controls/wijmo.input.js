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
    var input;
    (function (input) {
        'use strict';
        // globalization info
        wijmo._addCultureInfo('InputNumber', {
            ariaLabels: {
                incVal: 'Increase Value',
                decVal: 'Decrease Value'
            }
        });
        /**
         * The {@link InputNumber} control allows users to enter numbers.
         *
         * The control prevents users from accidentally entering invalid data and
         * formats the number as it is edited.
         *
         * Pressing the minus key reverses the sign of the value being edited,
         * regardless of cursor position.
         *
         * You may use the {@link min} and {@link max} properties to limit the range of
         * acceptable values, and the {@link step} property to provide spinner buttons
         * that increase or decrease the value with a click.
         *
         * For details about using the {@link min} and {@link max} properties, please see
         * the <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
         *
         * Use the {@link value} property to get or set the currently selected number.
         *
         * The example below creates several {@link InputNumber} controls and shows
         * the effect of using different formats.
         *
         * {@sample Input/InputNumber/Formatting/purejs Example}
         */
        var InputNumber = /** @class */ (function (_super) {
            __extends(InputNumber, _super);
            /**
             * Initializes a new instance of the {@link InputNumber} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function InputNumber(element, options) {
                var _this = _super.call(this, element) || this;
                // property storage
                _this._value = null;
                _this._min = null;
                _this._max = null;
                _this._format = '';
                _this._step = null;
                _this._showBtn = true;
                _this._readOnly = false;
                _this._handleWheel = true;
                // private stuff
                _this._oldText = ''; // TFS 436917
                // ** events
                /**
                 * Occurs when the value of the {@link text} property changes.
                 */
                _this.textChanged = new wijmo.Event();
                /**
                 * Occurs when the value of the {@link value} property changes, either
                 * as a result of user actions or by assignment in code.
                 */
                _this.valueChanged = new wijmo.Event();
                // accessibility: 
                // https://www.w3.org/TR/wai-aria-1.1/#spinbutton
                // http://oaa-accessibility.org/example/33/
                var host = _this.hostElement;
                wijmo.setAttribute(host, 'role', 'spinbutton', true);
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-content wj-inputnumber', tpl, {
                    _tbx: 'input',
                    _btnUp: 'btn-inc',
                    _btnDn: 'btn-dec'
                }, 'input');
                // label button elements
                var labels = wijmo.culture.InputNumber.ariaLabels;
                wijmo.setAriaLabel(_this._btnUp.querySelector('button'), labels.incVal);
                wijmo.setAriaLabel(_this._btnDn.querySelector('button'), labels.decVal);
                // don't use 'number' input type (TFS 84900)
                if (_this._tbx.type.match(/number/i)) {
                    _this.inputType = '';
                }
                // disable autocomplete/spellcheck (important for mobile browsers including Chrome/Android)
                var tbx = _this._tbx;
                tbx.autocomplete = 'off';
                tbx.spellcheck = false;
                // update localized decimal and currency symbols
                _this._updateSymbols();
                // connect event handlers
                var addListener = _this.addEventListener.bind(_this);
                addListener(tbx, 'keypress', _this._keypress.bind(_this));
                addListener(tbx, 'keydown', _this._keydown.bind(_this));
                addListener(tbx, 'input', _this._input.bind(_this));
                addListener(tbx, 'blur', function () {
                    if (_this.text != _this._oldText) {
                        _this._setText(_this.text); // commit text immediately (no timeOut: TFS 354382)
                    }
                });
                addListener(tbx, 'compositionstart', function () {
                    _this._composing = true;
                });
                addListener(tbx, 'compositionend', function () {
                    _this._composing = false;
                    setTimeout(function () {
                        var text = _this.text, old = _this._oldText, pct = _this._chrPct;
                        if (old && old.indexOf(pct) > -1) { // if we had a percentage
                            if (text.indexOf(pct) < 0) { // but it's gone after composition
                                text += pct; // add it back (TFS 311154)
                            }
                        }
                        _this._setText(text);
                    });
                });
                // inc/dec buttons: change value
                // if this was a tap, keep focus on button; OW transfer to textbox
                var cs = _this._clickSpinner.bind(_this);
                addListener(_this._btnUp, 'click', cs);
                addListener(_this._btnDn, 'click', cs);
                // inc/dec buttons: repeatButtons
                _this._rptUp = new wijmo._ClickRepeater(_this._btnUp.querySelector('button'));
                _this._rptDn = new wijmo._ClickRepeater(_this._btnDn.querySelector('button'));
                // use wheel to increase/decrease the value (on input element, TFS 417458)
                addListener(tbx, 'wheel', function (e) {
                    if (_this.handleWheel && !e.defaultPrevented && !e.ctrlKey && _this._isEditable() && _this.containsFocus()) {
                        var step = wijmo.clamp(-e.deltaY, -1, +1);
                        _this._increment((_this.step || 1) * step);
                        setTimeout(function () { return _this.selectAll(); });
                        e.preventDefault();
                    }
                });
                // initialize value
                _this.value = 0;
                // initialize control options
                _this.isRequired = true;
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(InputNumber.prototype, "inputElement", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets the HTML input element hosted by the control.
                 *
                 * Use this property in situations where you want to customize the
                 * attributes of the input element.
                 */
                get: function () {
                    return this._tbx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "inputType", {
                /**
                 * Gets or sets the "type" attribute of the HTML input element hosted by the control.
                 *
                 * By default, this property is set to "tel", a value that causes mobile devices to
                 * show a numeric keypad that includes a negative sign and a decimal separator.
                 *
                 * Use this property to change the default setting if the default does not work well
                 * for the current culture, device, or application. In those cases, try changing
                 * the value to "number" or "text."
                 *
                 * Note that input elements with type "number" prevent selection in Chrome and
                 * therefore that type is not recommended. For more details, see this link:
                 * https://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
                 */
                get: function () {
                    return this._tbx.type;
                },
                set: function (value) {
                    this._tbx.type = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "value", {
                /**
                 * Gets or sets the current value of the control.
                 */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value != this._value) {
                        value = wijmo.asNumber(value, !this.isRequired || (value == null && this._value == null));
                        if (value == null) {
                            this._setText('');
                        }
                        else if (!isNaN(value)) {
                            var text = wijmo.Globalize.format(value, this.format);
                            this._setText(text);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "isRequired", {
                /**
                 * Gets or sets a value indicating whether the control value must be
                 * a number or whether it can be set to null (by deleting the content
                 * of the control).
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._tbx.required;
                },
                set: function (value) {
                    this._tbx.required = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "isReadOnly", {
                /**
                 * Gets or sets a value that indicates whether the user can modify
                 * the control value using the mouse and keyboard.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._readOnly;
                },
                set: function (value) {
                    this._readOnly = wijmo.asBoolean(value);
                    this.inputElement.readOnly = this._readOnly;
                    wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "handleWheel", {
                /**
                 * Gets or sets a value that determines whether the user can edit the
                 * value using the mouse wheel.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._handleWheel;
                },
                set: function (value) {
                    this._handleWheel = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "min", {
                /**
                 * Gets or sets the smallest number that the user can enter.
                 *
                 * For details about using the {@link min} and {@link max} properties, please see the
                 * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    if (value != this._min) {
                        this._min = wijmo.asNumber(value, true);
                        this._updateAria();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "max", {
                /**
                 * Gets or sets the largest number that the user can enter.
                 *
                 * For details about using the {@link min} and {@link max} properties, please see the
                 * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    if (value != this._max) {
                        this._max = wijmo.asNumber(value, true);
                        this._updateAria();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "step", {
                /**
                 * Gets or sets the amount to add or subtract to the {@link value} property
                 * when the user clicks the spinner buttons.
                 *
                 * The default value for this property is **null**, which hides the spinner
                 * buttons from the control.
                 */
                get: function () {
                    return this._step;
                },
                set: function (value) {
                    this._step = wijmo.asNumber(value, true);
                    this._updateBtn();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "format", {
                /**
                 * Gets or sets the format used to display the number being edited (see {@link Globalize}).
                 *
                 * The format string is expressed as a .NET-style
                 * <a href="https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-numeric-format-strings" target="_blank">
                 * standard numeric format string</a>.
                 */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this.format) {
                        this._format = wijmo.asString(value);
                        this.refresh();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "text", {
                /**
                 * Gets or sets the text shown in the control.
                 */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._oldText = null;
                        this._setText(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "placeholder", {
                /**
                 * Gets or sets the string shown as a hint when the control is empty.
                 */
                get: function () {
                    return this._tbx.placeholder;
                },
                set: function (value) {
                    this._tbx.placeholder = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "showSpinner", {
                /**
                 * Gets or sets a value indicating whether the control displays spinner buttons
                 * to increment or decrement the value (the step property must be set to a
                 * value other than zero).
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._showBtn;
                },
                set: function (value) {
                    this._showBtn = wijmo.asBoolean(value);
                    this._updateBtn();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "repeatButtons", {
                /**
                 * Gets or sets a value that determines whether the spinner buttons
                 * should act as repeat buttons, firing repeatedly as long as the
                 * button remains pressed.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return !this._rptUp.disabled;
                },
                set: function (value) {
                    this._rptUp.disabled = this._rptDn.disabled = !wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Sets the focus to the control and selects all its content.
             */
            InputNumber.prototype.selectAll = function () {
                var tbx = this._tbx;
                wijmo.setSelectionRange(tbx, 0, tbx.value.length);
            };
            /**
             * Returns a value within the range defined by the {@link min} and {@link max}
             * properties.
             *
             * @param value Value to clamp.
             */
            InputNumber.prototype.clamp = function (value) {
                return wijmo.clamp(value, this.min, this.max);
            };
            /**
             * Raises the {@link textChanged} event.
             */
            InputNumber.prototype.onTextChanged = function (e) {
                this.textChanged.raise(this, e);
                this._updateState();
            };
            /**
             * Raises the {@link valueChanged} event.
             */
            InputNumber.prototype.onValueChanged = function (e) {
                this._updateAria();
                this.valueChanged.raise(this, e);
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** overrides
            // disconnect button repeaters
            InputNumber.prototype.dispose = function () {
                this._rptUp.element = null;
                this._rptDn.element = null;
                _super.prototype.dispose.call(this);
            };
            // save current value and transfer focus to input element
            InputNumber.prototype.onGotFocus = function (e) {
                // save value to restore if user presses Escape
                this._oldValue = this.value;
                // give focus to textbox unless touching
                if (!this.isTouching) {
                    this._tbx.focus();
                    this.selectAll();
                }
                // allow base class
                _super.prototype.onGotFocus.call(this, e);
            };
            // enforce min/max when losing focus
            InputNumber.prototype.onLostFocus = function (e) {
                // Safari does not finish composition on blur (TFS 236810)
                if (this._composing) {
                    this._composing = false;
                    this._setText(this.text);
                }
                // enforce min/max
                if (this._isEditable()) { // TFS 429349, 444394
                    var value = this.clamp(this.value);
                    if (value == this.value || this.onInvalidInput(new wijmo.CancelEventArgs())) {
                        var text = wijmo.Globalize.format(value, this.format);
                        this._setText(text);
                    }
                }
                // allow base class
                _super.prototype.onLostFocus.call(this, e);
            };
            // update culture symbols and display text when refreshing
            InputNumber.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.hostElement) {
                    this._updateSymbols();
                    var text = wijmo.Globalize.format(this.value, this.format);
                    this._setText(text);
                }
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // returns true if the control is not read-only and not disabled (TFS 444279)
            InputNumber.prototype._isEditable = function () {
                return !this.isReadOnly && !this.isDisabled;
            };
            // update culture/format symbols
            InputNumber.prototype._updateSymbols = function () {
                var nf = wijmo.culture.Globalize.numberFormat, info = wijmo.Globalize._parseNumericFormat(this.format); // TFS 442149
                this._chrDec = nf['.'] || '.';
                this._chrTho = nf[','] || ',';
                this._chrNeg = nf['-'] || '-';
                this._chrPls = nf['+'] || '+';
                this._chrPct = nf['%'] || '%';
                this._chrCur = info.curr || nf.currency.symbol || '$'; // TFS 386975
                this._fmtSpc = info.spec;
                this._fmtPrc = info.prec;
                this._rxSym = new RegExp('^[%+\\-() ' +
                    '\\' + this._chrDec + // TFS 306807
                    '\\' + this._chrCur +
                    '\\' + this._chrNeg +
                    '\\' + this._chrPls +
                    '\\' + this._chrPct + ']*$');
                this._rxNeg = new RegExp('(\\-|\\(|' +
                    '\\' + this._chrNeg + ')');
            };
            // checks whether a character is a digit, sign, or decimal point
            InputNumber.prototype._isNumeric = function (chr, digitsOnly) {
                var isNum = (chr == this._chrDec) || (chr >= '0' && chr <= '9'), hex = this._fmtSpc == 'x';
                if (!isNum && hex) {
                    isNum = (chr >= 'a' && chr <= 'f') || (chr >= 'A' && chr <= 'F');
                }
                if (!isNum && !digitsOnly && !hex) {
                    isNum = chr == this._chrPls || chr == this._chrNeg || chr == '(' || chr == ')';
                }
                return isNum;
            };
            // get the range of numeric characters within the current text
            InputNumber.prototype._getInputRange = function (digitsOnly) {
                var rng = [0, 0], text = this.text, hasStart = false;
                for (var i = 0; i < text.length; i++) {
                    if (this._isNumeric(text[i], digitsOnly)) {
                        if (!hasStart) {
                            rng[0] = i;
                            hasStart = true;
                        }
                        rng[1] = i + 1;
                    }
                }
                return rng;
            };
            // flip the current value between positive and negative
            // keeping the cursor position
            InputNumber.prototype._flipSign = function () {
                var start = this._getSelStartDigits();
                this.value *= -1;
                this._setSelStartDigits(start);
            };
            // get selection start counting digits and decimals only
            InputNumber.prototype._getSelStartDigits = function () {
                var start = 0, selStart = this._tbx.selectionStart, str = this._tbx.value;
                for (var i = 0; i < str.length && i < selStart; i++) {
                    if (this._isNumeric(str[i], true)) {
                        start++;
                    }
                }
                return start;
            };
            // set selection start counting digits and decimals only
            InputNumber.prototype._setSelStartDigits = function (start) {
                var str = this._tbx.value;
                for (var i = 0; i < str.length && start >= 0; i++) {
                    if (this._isNumeric(str[i], true)) {
                        if (!start) {
                            wijmo.setSelectionRange(this._tbx, i);
                            break;
                        }
                        start--;
                    }
                    else if (!start) {
                        wijmo.setSelectionRange(this._tbx, i);
                        break;
                    }
                }
            };
            // apply increment with rounding (not truncating): TFS 142618, 145814, 153300
            InputNumber.prototype._increment = function (step) {
                if (step) {
                    var value = this.clamp(wijmo.isNumber(this.value) ? this.value + step : 0), text = wijmo.Globalize.format(value, this.format, false, false);
                    this._setText(text);
                }
            };
            // update spinner button visibility
            InputNumber.prototype._updateBtn = function () {
                var showBtn = this.showSpinner && !!this.step, enableBtn = showBtn;
                wijmo.setCss([this._btnUp, this._btnDn], {
                    display: showBtn ? '' : 'none'
                });
                wijmo.toggleClass(this.hostElement, 'wj-input-show-spinner', showBtn);
                wijmo.enable(this._btnUp, enableBtn);
                wijmo.enable(this._btnDn, enableBtn);
                this._updateAria();
            };
            // update text in textbox
            InputNumber.prototype._setText = function (text) {
                // not while composing IME text...
                if (this._composing)
                    return;
                // save state
                var tbx = this._tbx, chrDec = this._chrDec, isNegative = this._rxNeg.test(text), delKey = this._delKey, focused = this.containsFocus();
                // handle strings composed only of non-digit chars (TFS 143559, 141501)
                // while editing (TFS 373546)
                if (text && this._rxSym.test(text) && focused) {
                    text = (this.isRequired || !delKey)
                        ? (isNegative ? '-0' : '0') + (text.indexOf(chrDec) > -1 ? chrDec : '')
                        : '';
                }
                // delete/backspace keys clear non-required zeros to null
                this._delKey = false;
                if (delKey && this.value == 0 && !this.isRequired) {
                    text = '';
                }
                // handle nulls
                if (!text) {
                    // if value is not required, setting to null is OK
                    if (!this.isRequired) {
                        tbx.value = '';
                        if (this._value != null) {
                            this._value = null;
                            this.onValueChanged();
                        }
                        if (this._oldText) {
                            this._oldText = text;
                            this.onTextChanged();
                        }
                        this._updateBtn();
                        return;
                    }
                    // value is required, so change text to zero
                    text = '0';
                }
                // parse input
                var indexDec = text.indexOf(chrDec), fmt = this._format || (indexDec > -1 ? 'n2' : 'n0');
                // get value, clamp infinite/ridiculous values
                var value = wijmo.Globalize.parseFloat(text, fmt);
                if (!isFinite(value)) {
                    value = this.clamp(value);
                }
                // handle invalid input
                if (isNaN(value)) {
                    if (this.onInvalidInput(new wijmo.CancelEventArgs())) {
                        tbx.value = this._oldText;
                    }
                    else {
                        this.focus(); // invalid input canceled, keep value and focus
                    }
                    return;
                }
                // get formatted value (TFS 467853)
                var defPrec = focused && indexDec > -1 ? 2 : null, fval = wijmo.Globalize.format(value, fmt, false, false, defPrec);
                // allow for '-0.00' (TFS 299899)
                if (isNegative && value >= 0 && !delKey) {
                    fval = this._chrNeg + fval;
                }
                // allow trailing decimal/zeros if we have the focus and the format is 'g'
                // (TFS 140302, 145764, 295990, 304407, 386975, 467556)
                if (focused && indexDec > -1 && this._fmtSpc == 'g' && this._fmtPrc != 0) {
                    fval = text;
                    if (fval.indexOf(chrDec) < 0) {
                        fval += chrDec;
                    }
                }
                // update text and value with formatted value
                if (tbx.value != fval) {
                    tbx.value = fval;
                    value = wijmo.Globalize.parseFloat(fval, fmt);
                }
                // update value, raise valueChanged
                if (value != this._value) {
                    this._value = value;
                    this.onValueChanged();
                }
                // raise textChanged
                if (this.text != this._oldText) {
                    this._oldText = this.text;
                    this.onTextChanged();
                }
                // update spinner button visibility and control state
                this._updateBtn();
                this._updateState();
            };
            // handle the keypress events
            InputNumber.prototype._keypress = function (e) {
                // ignore the key if handled, composing, or if the control is not editable (TFS 199438)
                if (e.defaultPrevented || this._composing || !this._isEditable()) {
                    return;
                }
                // if char pressed, not ctrl/command key // TFS 193087, 234934
                if (e.charCode && !e.ctrlKey && !e.metaKey) {
                    // prevent invalid chars/validate cursor position (TFS 80733)
                    var tbx = this._tbx, chr = String.fromCharCode(e.charCode);
                    if (!this._isNumeric(chr, false)) {
                        e.preventDefault();
                    }
                    else {
                        // honor maxLength attribute: TFS 379388, 379627
                        var maxLen = tbx.maxLength;
                        if (maxLen > -1 && tbx.value.length >= maxLen) {
                            if (tbx.selectionEnd == tbx.selectionStart) { // TFS 395542
                                e.preventDefault();
                                return;
                            }
                        }
                        // validate cursor position
                        var rng = this._getInputRange(true), start = tbx.selectionStart, end = tbx.selectionEnd;
                        if (start < rng[0] && end < tbx.value.length) { // TFS 295998
                            end = Math.max(end, rng[0]); // TFS 312918
                            wijmo.setSelectionRange(tbx, rng[0], end);
                        }
                        // ignore input after valid range to prevent rounding (TFS 205653, 270431, 276538)
                        if (start >= rng[1]) {
                            var prc = this._fmtPrc != null ? this._fmtPrc : 2, idx = tbx.value.indexOf(this._chrDec);
                            if (idx > -1 && start - idx > prc) {
                                e.preventDefault();
                            }
                        }
                    }
                    // handle special characters
                    switch (chr) {
                        // flip sign
                        case '-':
                        case this._chrNeg:
                            if (this.clamp(-1) >= 0) { // TFS 395558
                                if (this.value < 0) {
                                    this._flipSign();
                                }
                            }
                            else {
                                if (this.value && tbx.selectionStart == tbx.selectionEnd) {
                                    this._flipSign();
                                }
                                else {
                                    // just show the minus sign (TFS 299899)
                                    if (this.clamp(-1) < 0) {
                                        tbx.value = this._chrNeg;
                                        wijmo.setSelectionRange(tbx, 1);
                                    }
                                }
                            }
                            e.preventDefault();
                            break;
                        // make positive
                        case '+':
                        case this._chrPls:
                            if (this.value < 0) {
                                this._flipSign();
                            }
                            e.preventDefault();
                            break;
                        // prevent decimal points altogether, or multiple instances
                        case '.': // TFS 359099
                        case this._chrDec:
                            if (this._fmtPrc == 0) { // prevent decimal points
                                e.preventDefault();
                            }
                            else { // only one decimal point
                                var dec = tbx.value.indexOf(this._chrDec);
                                if (dec > -1) {
                                    if (tbx.selectionStart <= dec) {
                                        dec++;
                                    }
                                    wijmo.setSelectionRange(tbx, dec);
                                    e.preventDefault();
                                }
                            }
                            break;
                    }
                    // disable overwrite mode (needed only in IE)
                    if (!e.defaultPrevented && wijmo.isIE()) {
                        var val = tbx.value, start = tbx.selectionStart, end = tbx.selectionEnd;
                        if (start == end) {
                            tbx.value = val.substr(0, start) + chr + val.substr(end);
                            wijmo.setSelectionRange(tbx, start + 1);
                            e.preventDefault();
                            this._input(); // handle thousand seps, leading zeros etc
                        }
                    }
                }
            };
            // handle the keydown event
            InputNumber.prototype._keydown = function (e) {
                var _this = this;
                this._delKey = false;
                // ignore the key if handled or composing
                if (e.defaultPrevented || this._composing) {
                    return;
                }
                // ignore keys while we are hidden (inactive grid editor, TFS 466837)
                if (wijmo.hasClass(this._tbx, 'wj-grid-ime')) {
                    return;
                }
                // handle the key
                var tbx = this._tbx, text = tbx.value, selStart = tbx.selectionStart, selEnd = tbx.selectionEnd;
                switch (e.keyCode) {
                    // customize select all behavior
                    case 65: // A
                        if (e.ctrlKey) {
                            setTimeout(function () {
                                _this.selectAll();
                            });
                            e.preventDefault();
                        }
                        break;
                    // apply increment when user presses up/down
                    case wijmo.Key.Up:
                    case wijmo.Key.Down:
                        if (this.step && this._isEditable()) {
                            this._increment(this.step * (e.keyCode == wijmo.Key.Up ? +1 : -1));
                            setTimeout(function () {
                                _this.selectAll();
                            });
                            e.preventDefault();
                        }
                        break;
                    // Back skips over decimal points, thousand separators, '%', and ')' signs
                    // (TFS 80472, 143665, 267528, 281341)
                    case wijmo.Key.Back:
                        this._delKey = true;
                        if (selEnd - selStart < 2 && this._isEditable()) {
                            var chr_1 = text[selEnd - 1];
                            if (chr_1 == this._chrDec || chr_1 == this._chrPct || chr_1 == this._chrTho || chr_1 == ')') {
                                setTimeout(function () {
                                    selEnd = chr_1 == _this._chrPct
                                        ? _this._getInputRange(true)[1] // after the percentage
                                        : selEnd - 1; // before the decimal/parenthesis (TFS 283792)
                                    wijmo.setSelectionRange(tbx, selEnd);
                                });
                                e.preventDefault();
                            }
                        }
                        break;
                    // Delete skips over decimal points, and '%' signs (TFS 80472, 267528, 281341)
                    case wijmo.Key.Delete:
                        this._delKey = true;
                        if (selEnd - selStart < 2 && this._isEditable()) {
                            if (text == '0' && selStart == 1) {
                                wijmo.setSelectionRange(tbx, 0);
                            }
                            else {
                                var chr = text[selStart];
                                if (chr == this._chrDec || chr == this._chrPct) {
                                    setTimeout(function () {
                                        wijmo.setSelectionRange(tbx, selStart + 1);
                                    });
                                    e.preventDefault();
                                }
                            }
                        }
                        break;
                    // Escape cancels current edits and restores the original value
                    case wijmo.Key.Escape:
                        this.value = this._oldValue;
                        this.selectAll();
                        break;
                }
            };
            // handle user input (keypress or paste)
            InputNumber.prototype._input = function () {
                var _this = this;
                // not while composing IME text...
                if (this._composing)
                    return;
                // this timeOut is **important** for Windows Phone/Android/Safari
                setTimeout(function () {
                    // remember cursor position
                    var tbx = _this._tbx, text = tbx.value, dec = text.indexOf(_this._chrDec), sel = tbx.selectionStart, pos = _this._getSelStartDigits();
                    // preserve percentage sign for percentage formats
                    if (_this._fmtSpc == 'p' && text.length && text.indexOf(_this._chrPct) < 0) {
                        text += _this._chrPct;
                    }
                    // set the text
                    _this._setText(text);
                    // update cursor position if we have the focus (TFS 136134)
                    if (_this.containsFocus()) {
                        // get updated values
                        var newText = tbx.value, newDec = newText.indexOf(_this._chrDec), rng = _this._getInputRange(true);
                        // handle case where the user types '-.'
                        if (text == _this._chrNeg + _this._chrDec && newDec > -1) {
                            wijmo.setSelectionRange(tbx, newDec + 1);
                            return;
                        }
                        // handle case where user types "-*" and the control switches to
                        // parenthesized values
                        if (text[0] == _this._chrNeg && newText[0] != _this._chrNeg) {
                            if (newText.length == 1) {
                                wijmo.setSelectionRange(tbx, 1);
                            }
                            else {
                                _this._setSelStartDigits(pos);
                            }
                            return;
                        }
                        // try to keep cursor offset from the right (TFS 136392, 143553)
                        if (text) {
                            if (text == _this._chrDec && newDec > -1) {
                                sel = newDec + 1; // user just typed a decimal point (TFS 236650)
                            }
                            else if ((sel <= dec && newDec > -1) || (dec < 0 && newDec < 0)) {
                                sel += newText.length - text.length; // cursor was on the left of the decimal
                            }
                            else if (dec < 0 && newDec > -1) {
                                sel = newDec; // there was no decimal, but now there is
                            }
                        }
                        else { // position at decimal or at end of valid range (TFS 277434)
                            sel = newDec > -1 ? newDec : rng[1];
                        }
                        // make sure it's within the valid range
                        sel = wijmo.clamp(sel, rng[0], rng[1]);
                        // set cursor position
                        wijmo.setSelectionRange(tbx, sel);
                    }
                });
            };
            // handle clicks on the spinner buttons
            InputNumber.prototype._clickSpinner = function (e) {
                var _this = this;
                if (!e.defaultPrevented && this._isEditable() && this.step) {
                    this._increment(this.step * (wijmo.contains(this._btnUp, e.target) ? +1 : -1));
                    if (!this.isTouching) {
                        setTimeout(function () { return _this.selectAll(); });
                    }
                }
            };
            // update ARIA attributes for this control
            InputNumber.prototype._updateAria = function () {
                var host = this.hostElement;
                if (host) {
                    // update ARIA attributes
                    wijmo.setAttribute(host, 'aria-valuemin', this.min);
                    wijmo.setAttribute(host, 'aria-valuemax', this.max);
                    wijmo.setAttribute(host, 'aria-valuenow', this.value);
                    // disable spinner buttons when value reaches min/max
                    wijmo.enable(this._btnDn, this.min == null || this.value > this.min);
                    wijmo.enable(this._btnUp, this.max == null || this.value < this.max);
                }
            };
            /**
             * Gets or sets the template used to instantiate {@link InputNumber} controls.
             */
            InputNumber.controlTemplate = '<div class="wj-template">' + // TFS 307664, 395028
                '<div class="wj-input">' +
                '<div class="wj-input-group">' +
                '<span wj-part="btn-dec" class="wj-input-group-btn" tabindex="-1">' +
                '<button class="wj-btn wj-btn-default" tabindex="-1">-</button>' +
                '</span>' +
                '<input type="tel" wj-part="input" class="wj-form-control wj-numeric"/>' +
                '<span wj-part="btn-inc" class="wj-input-group-btn" tabindex="-1">' +
                '<button class="wj-btn wj-btn-default" tabindex="-1">+</button>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>';
            return InputNumber;
        }(wijmo.Control));
        input.InputNumber = InputNumber;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The {@link InputMask} control provides a way to govern what a user is allowed
         * to enter.
         *
         * The control prevents users from accidentally entering invalid data and
         * saves time by skipping over literals (such as slashes in dates) as the
         * user types.
         *
         * The mask used to validate the input is defined by the {@link InputMask.mask}
         * property, which may contain one or more of the following special
         * characters:
         *
         *  <dl class="dl-horizontal">
         *      <dt>0</dt>      <dd>Digit.</dd>
         *      <dt>9</dt>      <dd>Digit or space.</dd>
         *      <dt>#</dt>      <dd>Digit, sign, or space.</dd>
         *      <dt>L</dt>      <dd>Letter.</dd>
         *      <dt>l</dt>      <dd>Letter or space.</dd>
         *      <dt>A</dt>      <dd>Alphanumeric.</dd>
         *      <dt>a</dt>      <dd>Alphanumeric or space.</dd>
         *      <dt>.</dt>      <dd>Localized decimal point.</dd>
         *      <dt>,</dt>      <dd>Localized thousand separator.</dd>
         *      <dt>:</dt>      <dd>Localized time separator.</dd>
         *      <dt>/</dt>      <dd>Localized date separator.</dd>
         *      <dt>$</dt>      <dd>Localized currency symbol.</dd>
         *      <dt>&lt;</dt>   <dd>Converts characters that follow to lowercase.</dd>
         *      <dt>&gt;</dt>   <dd>Converts characters that follow to uppercase.</dd>
         *      <dt>|</dt>      <dd>Disables case conversion.</dd>
         *      <dt>\</dt>      <dd>Escapes any character, turning it into a literal.</dd>
         *      <dt>９ (\uff19)</dt>    <dd>DBCS Digit.</dd>
         *      <dt>Ｊ (\uff2a)</dt>    <dd>DBCS Hiragana.</dd>
         *      <dt>Ｇ (\uff27)</dt>    <dd>DBCS big Hiragana.</dd>
         *      <dt>Ｋ (\uff2b)</dt>    <dd>DBCS Katakana. </dd>
         *      <dt>Ｎ (\uff2e)</dt>    <dd>DBCS big Katakana.</dd>
         *      <dt>K</dt>              <dd>SBCS Katakana.</dd>
         *      <dt>N</dt>              <dd>SBCS big Katakana.</dd>
         *      <dt>Ｚ (\uff3a)</dt>    <dd>Any DBCS character.</dd>
         *      <dt>H</dt>              <dd>Any SBCS character.</dd>
         *      <dt>All others</dt>     <dd>Literals.</dd>
         *  </dl>
         *
         * The example below shows how you can use the {@link InputMask} control to
         * edit strings with custom formats:
         *
         * {@sample Input/InputMask/Overview Example}
         */
        var InputMask = /** @class */ (function (_super) {
            __extends(InputMask, _super);
            /**
             * Initializes a new instance of the {@link InputMask} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function InputMask(element, options) {
                var _this = _super.call(this, element) || this;
                // ** events
                /**
                 * Occurs when the value of the {@link value} property changes, either
                 * as a result of user actions or by assignment in code.
                 */
                _this.valueChanged = new wijmo.Event();
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-content wj-inputmask', tpl, {
                    _tbx: 'input'
                }, 'input');
                // initialize value from <input> tag
                if (_this._orgTag == 'INPUT') {
                    var value = _this._tbx.getAttribute('value');
                    if (value) {
                        _this.value = value;
                    }
                }
                // create mask provider
                _this._msk = new wijmo._MaskProvider(_this._tbx);
                // initialize control options
                _this.isRequired = true;
                _this.initialize(options);
                // update mask on input
                _this.addEventListener(_this._tbx, 'input', function () {
                    _this.onValueChanged();
                });
                // raise invalidInput event on blur/Enter
                _this.addEventListener(_this._tbx, 'blur', _this._commitText.bind(_this));
                _this.addEventListener(_this._tbx, 'keydown', function (e) {
                    if (e.keyCode == wijmo.Key.Enter) {
                        _this._commitText();
                    }
                });
                return _this;
            }
            Object.defineProperty(InputMask.prototype, "inputElement", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets the HTML input element hosted by the control.
                 *
                 * Use this property in situations where you want to customize the
                 * attributes of the input element.
                 */
                get: function () {
                    return this._tbx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMask.prototype, "inputType", {
                /**
                 * Gets or sets the "type" attribute of the HTML input element hosted
                 * by the control.
                 *
                 * The default value for this property is **'text'**.
                 */
                get: function () {
                    return this._tbx.type;
                },
                set: function (value) {
                    this._tbx.type = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMask.prototype, "value", {
                /**
                 * Gets or sets the text currently shown in the control.
                 */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.value) {
                        // assign unmasked value to input element
                        this._tbx.value = wijmo.asString(value);
                        // update masked value
                        value = this._msk._applyMask();
                        // update input element
                        this._tbx.value = value;
                        this.onValueChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMask.prototype, "rawValue", {
                /**
                 * Gets or sets the raw value of the control (excluding mask literals).
                 *
                 * The raw value of the control excludes prompt and literal characters.
                 * For example, if the {@link mask} property is set to "AA-9999" and the
                 * user enters the value "AB-1234", the {@link rawValue} property will
                 * return "AB1234", excluding the hyphen that is part of the mask.
                 */
                get: function () {
                    return this._msk.getRawValue();
                },
                set: function (value) {
                    if (value != this.rawValue) {
                        this.value = wijmo.asString(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMask.prototype, "mask", {
                /**
                 * Gets or sets the mask used to validate the input as the user types.
                 *
                 * The mask is defined as a string with one or more of the masking
                 * characters listed in the {@link InputMask} topic.
                 *
                 * The default value for this property is the empty string **''**.
                 */
                get: function () {
                    return this._msk.mask || '';
                },
                set: function (value) {
                    var oldValue = this.value;
                    this._msk.mask = wijmo.asString(value);
                    if (this.value != oldValue) {
                        this.onValueChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMask.prototype, "promptChar", {
                /**
                 * Gets or sets the symbol used to show input positions in the control.
                 */
                get: function () {
                    return this._msk.promptChar;
                },
                set: function (value) {
                    var oldValue = this.value;
                    this._msk.promptChar = value;
                    if (this.value != oldValue) {
                        this.onValueChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMask.prototype, "overwriteMode", {
                /**
                 * Gets or sets a value that determines whether the input element handles input in
                 * overwrite mode.
                 *
                 * In **overwrite mode**, every character you type is displayed at the cursor position.
                 * If a character is already at that position, it is replaced.
                 *
                 * In **insert mode**, each character you type is inserted at the cursor position.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._msk.overwriteMode;
                },
                set: function (value) {
                    this._msk.overwriteMode = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMask.prototype, "placeholder", {
                /**
                 * Gets or sets the string shown as a hint when the control is empty.
                 */
                get: function () {
                    return this._tbx.placeholder;
                },
                set: function (value) {
                    this._tbx.placeholder = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMask.prototype, "maskFull", {
                /**
                 * Gets a value that indicates whether the mask has been completely filled.
                 */
                get: function () {
                    return this._msk.maskFull;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMask.prototype, "isRequired", {
                /**
                 * Gets or sets a value indicating whether the control value
                 * must be a non-empty string.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._tbx.required;
                },
                set: function (value) {
                    this._tbx.required = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMask.prototype, "isReadOnly", {
                /**
                 * Gets or sets a value that indicates whether the user can modify
                 * the control value using the mouse and keyboard.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._tbx.readOnly;
                },
                set: function (value) {
                    this._tbx.readOnly = wijmo.asBoolean(value);
                    wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Sets the focus to the control and selects all its content.
             */
            InputMask.prototype.selectAll = function () {
                var rng = this._msk.getMaskRange();
                wijmo.setSelectionRange(this._tbx, rng[0], rng[1] + 1);
            };
            /**
             * Raises the {@link valueChanged} event.
             */
            InputMask.prototype.onValueChanged = function (e) {
                if (this.value != this._oldValue) {
                    this._oldValue = this.value;
                    this.valueChanged.raise(this, e);
                }
                this._updateState();
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** overrides
            // mark partially full input as invalid
            //_updateState() {
            //    super._updateState();
            //    let invalid = !this._pristine && this._tbx.value && !this.maskFull;
            //    toggleClass(this.hostElement, 'wj-state-invalid', invalid);
            //}
            // raise invalidInput event on blur/Enter
            InputMask.prototype._commitText = function () {
                if (this.value || this.isRequired) {
                    if (!this.maskFull && !this.onInvalidInput(new wijmo.CancelEventArgs())) {
                        // mask not full, keep editing
                        var tbx = this._tbx, value = tbx.value, index = value.indexOf(this.promptChar);
                        if (index > -1) {
                            wijmo.setSelectionRange(tbx, index, value.length);
                        }
                    }
                }
                this._updateState();
            };
            // disconnect mask provider
            InputMask.prototype.dispose = function () {
                this._msk.input = null;
                _super.prototype.dispose.call(this);
            };
            // apply mask when refreshing
            InputMask.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.hostElement) {
                    this._msk.refresh();
                }
            };
            // select all when getting the focus
            InputMask.prototype.onGotFocus = function (e) {
                _super.prototype.onGotFocus.call(this, e);
                this.selectAll();
            };
            /**
             * Gets or sets the template used to instantiate {@link InputMask} controls.
             */
            InputMask.controlTemplate = '<div class="wj-input">' +
                '<div class="wj-input-group">' +
                '<input wj-part="input" class="wj-form-control"/>' +
                '</div>' +
                '</div>';
            return InputMask;
        }(wijmo.Control));
        input.InputMask = InputMask;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The {@link ColorPicker} control allows users to select a color by clicking
         * on panels to adjust color channels (hue, saturation, brightness, alpha).
         *
         * Use the {@link value} property to get or set the currently selected color.
         *
         * The control is used as a drop-down for the {@link InputColor} control.
         *
         * {@sample Input/InputColor/Overview/purejs Example}
         */
        var ColorPicker = /** @class */ (function (_super) {
            __extends(ColorPicker, _super);
            /**
             * Initializes a new instance of the {@link ColorPicker} class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function ColorPicker(element, options) {
                var _this = _super.call(this, element) || this;
                _this._hsb = [.5, 1, 1];
                _this._alpha = 1;
                /**
                 * Occurs when the value of the {@link value} property changes, either
                 * as a result of user actions or by assignment in code.
                 */
                _this.valueChanged = new wijmo.Event();
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-content wj-colorpicker', tpl, {
                    _eSB: 'div-sb',
                    _eHue: 'div-hue',
                    _eAlpha: 'div-alpha',
                    _ePreview: 'div-pv',
                    _ePal: 'div-pal',
                    _eText: 'div-text'
                });
                // build palette
                _this._palette = '#FFF,#000,#F00,#FFC000,#FFFF00,#92D050,#00B050,#00B0F0,#0070C0,#7030A0'.split(',');
                _this._updatePalette();
                // build hue gradient 
                // (use an image since IE9 doesn't support multi-stop gradients)
                _this._eHue.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAD4CAIAAACi6hsPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAGvSURBVDhPXdBPaM9xHMfxz4pWaxcmtoOhpdXSVpiyHWxqmVpDjaU5rK34XfypjTJ/p+ZPay6jhsOsRrKwaJElf9IQq03WIkv4FeMwMq221tfje1ByeFzfvd7PEKWGEKWTQRZLySWfVRRTQjmVbKWGOhLsZT+HaeY0bbTTQSfdXOcWffTzmAFeMcwoYyT5ygS/mA5hNgphip98J8kHRnnNSwZ4yH1uc4OrdHGR87RximYO0cgedlLLdqqoYAPrWMtKVrCcJSxiPmnMJUQp/Bsyk2xyyKOAQooopYwKtlDNDur5G7SBJo7RQiv/B+2hl3s84CkvGGKEOOYnxolj/mYmhBmDJ5ngCx95xxsGecYj4pB3iENeoZMO2mmlhaMcpIE4ZII6aqhmM3HMMkooopB88sghm0wySCeVlCjMCVFIYx4LWUwOeRSwhmLWU84mqqihll3sppEmjnOSs5zjEl1c4yZ99POE5wwxwns+840fTDFLFKaZZIJxkozxlmEGGSC+GF++Sy89dHOZC8Rr4lVnOMERDrCPBPXEX22jko2UEn+/mnxyWUYWC0gnNUQh/AEc0HJs6cex0gAAAABJRU5ErkJggg==)';
                _this._eHue.style.backgroundSize = 'contain';
                // add filter gradients to IE 9
                if (navigator.appVersion.indexOf('MSIE 9') > -1) {
                    _this._eSB.children[0].style.filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffffffff,endColorstr=#00ffffff,GradientType=1)';
                    _this._eSB.children[1].style.filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=#ff000000,GradientType=0)';
                }
                // add cursors to panels
                tpl = ColorPicker._tplCursor;
                _this._cSB = wijmo.createElement(tpl);
                _this._cHue = wijmo.createElement(tpl);
                _this._cHue.style.width = '100%';
                _this._cAlpha = wijmo.createElement(tpl);
                _this._cAlpha.style.height = '100%';
                _this._eSB.appendChild(_this._cSB);
                _this._eHue.appendChild(_this._cHue);
                _this._eAlpha.appendChild(_this._cAlpha);
                // shorthand (TFS 408423)
                var addListener = _this.addEventListener.bind(_this);
                var rmvListener = _this.removeEventListener.bind(_this);
                var doc = document;
                // handle mouse
                addListener(_this.hostElement, 'mousedown', function (e) {
                    addListener(doc, 'mousemove', mouseMove);
                    addListener(doc, 'mouseup', mouseUp);
                    _this._mouseDown(e);
                });
                addListener(_this.hostElement, 'touchstart', function (e) {
                    addListener(doc, 'touchmove', mouseMove);
                    addListener(doc, 'touchend', mouseUp);
                    _this._mouseDown(e);
                });
                var mouseMove = function (e) {
                    _this._mouseMove(e);
                };
                var mouseUp = function (e) {
                    rmvListener(doc, 'mousemove', mouseMove);
                    rmvListener(doc, 'mouseup', mouseUp);
                    rmvListener(doc, 'touchmove', mouseMove);
                    rmvListener(doc, 'touchend', mouseUp);
                    _this._mouseUp(e);
                };
                // handle clicks on the palette
                addListener(_this.hostElement, 'click', function (e) {
                    var el = e.target;
                    if (el && el.tagName == 'DIV' && wijmo.contains(_this._ePal, el)) {
                        var color = el.style.backgroundColor;
                        if (color) {
                            _this.value = new wijmo.Color(color).toString();
                        }
                    }
                });
                // initialize value to white
                _this.value = '#ffffff';
                // initialize control options
                _this.initialize(options);
                // initialize control (TFS 466721)
                _this._updatePanels();
                return _this;
            }
            Object.defineProperty(ColorPicker.prototype, "showAlphaChannel", {
                /**
                 * Gets or sets a value indicating whether the {@link ColorPicker} allows users
                 * to edit the color's alpha channel (transparency).
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._eAlpha.parentElement.style.display != 'none';
                },
                set: function (value) {
                    this._eAlpha.parentElement.style.display = wijmo.asBoolean(value) ? '' : 'none';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColorPicker.prototype, "showColorString", {
                /**
                 * Gets or sets a value indicating whether the {@link ColorPicker} shows a string representation
                 * of the current color.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._eText.style.display != 'none';
                },
                set: function (value) {
                    this._eText.style.display = wijmo.asBoolean(value) ? '' : 'none';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColorPicker.prototype, "value", {
                /**
                 * Gets or sets the currently selected color.
                 *
                 * The default value for this property is **"#ffffff"** (white).
                 *
                 * Setting this property to a string that cannot be interpreted as
                 * a color causes the assignment to be ignored (no exceptions are
                 * thrown).
                 */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value != this.value) {
                        // parse new value as a color
                        value = wijmo.asString(value);
                        var c = wijmo.Color.fromString(value);
                        if (c) { // color is valid, update value based on text
                            // save new value
                            this._value = value;
                            this._eText.innerText = value;
                            // check whether the color really changed
                            var hsb = c.getHsb();
                            if (this._hsb[0] != hsb[0] || this._hsb[1] != hsb[1] ||
                                this._hsb[2] != hsb[2] || this._alpha != c.a) {
                                // update hsb channels (but keep hue when s/b go to zero)
                                if (hsb[2] == 0) {
                                    hsb[0] = this._hsb[0];
                                    hsb[1] = this._hsb[1];
                                }
                                else if (hsb[1] == 0) {
                                    hsb[0] = this._hsb[0];
                                }
                                this._hsb = hsb;
                                this._alpha = c.a;
                                this._updatePanels();
                                // raise valueChanged event
                                this.onValueChanged();
                            }
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColorPicker.prototype, "palette", {
                /**
                 * Gets or sets an array that contains the colors in the palette.
                 *
                 * The default palette contains up to ten colors, represented by
                 * an array with color strings.
                 *
                 * For each color in the palette, the control generates six buttons
                 * ranging from light to dark versions of the main color. Users
                 * may click these color buttons to select the color they want.
                 *
                 * You may customize the palette by providing the color string array
                 * you want to use. Palettes contain up to ten colors, and the first
                 * two are usually white and black.
                 *
                 * Palette arrays with more than 10 colors are truncated, and
                 * arrays with values that do not represent colors are ignored.
                 * No exceptions are thrown in these cases.
                 */
                get: function () {
                    return this._palette;
                },
                set: function (value) {
                    value = wijmo.asArray(value);
                    value = value.slice(0, 10);
                    if (value.every(function (entry) { return wijmo.Color.fromString(entry) != null; })) { // valid colors
                        this._palette = value;
                        this._updatePalette();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link valueChanged} event.
             */
            ColorPicker.prototype.onValueChanged = function (e) {
                this._updatePanels();
                this.valueChanged.raise(this, e);
            };
            // ** event handlers
            ColorPicker.prototype._mouseDown = function (e) {
                this._htDown = this._getTargetPanel(e);
                if (this._htDown) {
                    e.preventDefault();
                    this.focus();
                    this._mouseMove(e);
                }
            };
            ColorPicker.prototype._mouseMove = function (e) {
                var evt = e['touches'] ? e['touches'][0] : e, // support touch (TFS 403537)
                htDown = this._htDown;
                if (htDown) {
                    var rc = htDown.getBoundingClientRect(), hsb = this._hsb;
                    if (htDown == this._eHue) {
                        hsb[0] = wijmo.clamp((evt.clientY - rc.top) / rc.height, 0, .99);
                    }
                    else if (htDown == this._eSB) {
                        hsb[1] = wijmo.clamp((evt.clientX - rc.left) / rc.width, 0, 1);
                        hsb[2] = wijmo.clamp(1 - (evt.clientY - rc.top) / rc.height, 0, 1);
                    }
                    else if (htDown == this._eAlpha) {
                        this._alpha = wijmo.clamp((evt.clientX - rc.left) / rc.width, 0, 1);
                    }
                    this._updateColor();
                }
            };
            ColorPicker.prototype._mouseUp = function (e) {
                this._htDown = null;
            };
            // update color value to reflect new hsb values
            ColorPicker.prototype._updateColor = function () {
                var c = wijmo.Color.fromHsb(this._hsb[0], this._hsb[1], this._hsb[2], this._alpha);
                this.value = c.toString();
                this._updatePanels();
            };
            // updates the color elements in the palette
            ColorPicker.prototype._updatePalette = function () {
                var white = new wijmo.Color('#fff'), black = new wijmo.Color('#000');
                // clear the current palette
                this._ePal.innerHTML = '';
                // add one column per palette color
                for (var i = 0; i < this._palette.length; i++) {
                    var div = wijmo.createElement('<div style="float:left;width:10%;box-sizing:border-box;padding:1px">'), clr = new wijmo.Color(this._palette[i]), hsb = clr.getHsb();
                    // add palette color
                    div.appendChild(this._makePalEntry(clr, 4));
                    // add six shades for this color
                    for (var r = 0; r < 5; r++) {
                        if (hsb[1] == 0) { // grey tone (no saturation)
                            var pct = r * .1 + (hsb[2] > .5 ? .05 : .55);
                            clr = wijmo.Color.interpolate(white, black, pct);
                        }
                        else {
                            clr = wijmo.Color.fromHsb(hsb[0], 0.1 + r * 0.2, 1 - r * 0.1);
                        }
                        div.appendChild(this._makePalEntry(clr, 0));
                    }
                    // add color and shades to palette
                    this._ePal.appendChild(div);
                }
            };
            // creates a palette entry with the given color
            ColorPicker.prototype._makePalEntry = function (color, margin) {
                var e = document.createElement('div');
                wijmo.setCss(e, {
                    cursor: 'pointer',
                    backgroundColor: color.toString(),
                    marginBottom: margin ? margin : ''
                });
                e.innerHTML = '&nbsp';
                return e;
            };
            // update color and cursor on all panels
            ColorPicker.prototype._updatePanels = function () {
                var clrHue = wijmo.Color.fromHsb(this._hsb[0], 1, 1, 1), clrSolid = wijmo.Color.fromHsb(this._hsb[0], this._hsb[1], this._hsb[2], 1);
                this._eSB.style.backgroundColor = clrHue.toString();
                this._eAlpha.style.background = 'linear-gradient(to right, transparent 0%, ' + clrSolid.toString() + ' 100%)';
                if (navigator.appVersion.indexOf('MSIE 9') > -1) {
                    this._eAlpha.style.filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=' + clrSolid.toString() + ', GradientType = 1)';
                }
                this._ePreview.style.backgroundColor = this.value;
                this._cHue.style.top = (this._hsb[0] * 100).toFixed(0) + '%';
                this._cSB.style.left = (this._hsb[1] * 100).toFixed(0) + '%';
                this._cSB.style.top = (100 - this._hsb[2] * 100).toFixed(0) + '%';
                this._cAlpha.style.left = (this._alpha * 100).toFixed(0) + '%';
            };
            // gets the design panel that contains the mouse target
            ColorPicker.prototype._getTargetPanel = function (e) {
                var target = e.target;
                if (wijmo.contains(this._eSB, target))
                    return this._eSB;
                if (wijmo.contains(this._eHue, target))
                    return this._eHue;
                if (wijmo.contains(this._eAlpha, target))
                    return this._eAlpha;
                return null;
            };
            /**
             * Gets or sets the template used to instantiate {@link ColorPicker} controls.
             */
            ColorPicker.controlTemplate = '<div style="position:relative;width:100%;height:100%">' +
                '<div style="float:left;width:50%;height:100%;box-sizing:border-box;padding:2px">' +
                '<div wj-part="div-pal">' +
                '<div style="float:left;width:10%;box-sizing:border-box;padding:2px">' +
                '<div style="background-color:black;width:100%">&nbsp;</div>' +
                '<div style="height:6px"></div>' +
                '</div>' +
                '</div>' +
                '<div wj-part="div-text" style="position:absolute;bottom:0px;display:none"></div>' +
                '</div>' +
                '<div style="float:left;width:50%;height:100%;box-sizing:border-box;padding:2px">' +
                '<div wj-part="div-sb" class="wj-colorbox" style="float:left;width:89%;height:89%">' +
                '<div style="position:absolute;width:100%;height:100%;background:linear-gradient(to right, white 0%,transparent 100%)"></div>' +
                '<div style="position:absolute;width:100%;height:100%;background:linear-gradient(to top, black 0%,transparent 100%)"></div>' +
                '</div>' +
                '<div style="float:left;width:1%;height:89%"></div>' +
                '<div style="float:left;width:10%;height:89%">' +
                '<div wj-part="div-hue" class="wj-colorbox"></div>' +
                '</div>' +
                '<div style="float:left;width:89%;height:1%"></div>' +
                '<div style="float:left;width:89%;height:10%">' +
                '<div style="width:100%;height:100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAAcSURBVBhXY/iPBBYgAWpKQGkwgMqDAdUk/v8HAM7Mm6GatDUYAAAAAElFTkSuQmCC)">' +
                '<div wj-part="div-alpha" class="wj-colorbox"></div>' +
                '</div>' +
                '</div>' +
                '<div style="float:left;width:1%;height:10%"></div>' +
                '<div style="float:left;width:10%;height:10%">' +
                '<div wj-part="div-pv" class="wj-colorbox" style="position:static"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            ColorPicker._tplCursor = '<div style="position:absolute;left:50%;top:50%;width:7px;height:7px;transform:translate(-50%,-50%);border:2px solid #f0f0f0;border-radius:50px;box-shadow:0px 0px 4px 2px #0f0f0f"></div>';
            return ColorPicker;
        }(wijmo.Control));
        input.ColorPicker = ColorPicker;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The {@link CollectionViewNavigator} control provides a UI for navigating
         * through the data items or pages in a {@link CollectionView} object.
         *
         * Use the navigator's {@link cv} property to bind it to a {@link CollectionView},
         * and the {@link byPage} property to define whether the navigator should show
         * data items or pages.
         *
         * The navigator shows VCR-like buttons that allow users to select the
         * first/previous/next/last data item (or page) in the {@link CollectionView},
         * and some text showing the current index and total count.
         *
         * You may use the {@link headerFormat} property to customize the text displayed
         * by the navigator.
         */
        var CollectionViewNavigator = /** @class */ (function (_super) {
            __extends(CollectionViewNavigator, _super);
            /**
             * Initializes a new instance of the {@link CollectionViewNavigator} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function CollectionViewNavigator(element, options) {
                var _this = _super.call(this, element) || this;
                // property storage
                _this._view = null;
                _this._byPage = false;
                _this._fmt = '{current:n0} / {count:n0}';
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-content wj-pager wj-collectionview-navigator', tpl, {
                    _btnFirst: 'btn-first',
                    _btnPrev: 'btn-prev',
                    _txtCurr: 'txt-curr',
                    _btnNext: 'btn-next',
                    _btnLast: 'btn-last',
                }, 'input');
                // TODO: label button elements
                //let labels = culture.InputNumber.ariaLabels;
                //setAriaLabel(this._btnUp.querySelector('button'), labels.incVal);
                //setAriaLabel(this._btnDn.querySelector('button'), labels.decVal);
                // prev/next buttons: repeatButtons
                _this._rptNext = new wijmo._ClickRepeater(_this._btnNext.querySelector('button'));
                _this._rptPrev = new wijmo._ClickRepeater(_this._btnPrev.querySelector('button'));
                // connect event handlers
                _this.addEventListener(_this.hostElement, 'click', _this._click.bind(_this));
                // initialize control options
                _this.initialize(options);
                _this._update();
                return _this;
            }
            Object.defineProperty(CollectionViewNavigator.prototype, "cv", {
                /**
                 * Gets or sets the {@link CollectionView} controlled by this {@link CollectionViewNavigator}.
                 */
                get: function () {
                    return this._view;
                },
                set: function (value) {
                    if (value != this._view) {
                        // unhook old handlers
                        var cv = this._view;
                        if (cv) {
                            cv.collectionChanged.removeHandler(this._collectionChanged);
                            cv.currentChanged.removeHandler(this._currentChanged);
                        }
                        // assign value
                        cv = this._view = wijmo.asType(value, 'ICollectionView', true);
                        this._update();
                        // hook new handlers
                        if (cv) {
                            cv.collectionChanged.addHandler(this._collectionChanged, this);
                            cv.currentChanged.addHandler(this._currentChanged, this);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewNavigator.prototype, "byPage", {
                /**
                 * Gets or sets a value that determines whether this {@link CollectionViewNavigator} should
                 * navigate items or pages.
                 *
                 * To navigate pages, the {@link CollectionView} associated with the navigator should
                 * have it's {@link CollectionView.pageSize} property set to a value greater than zero.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._byPage;
                },
                set: function (value) {
                    if (value != this._byPage) {
                        this._byPage = wijmo.asBoolean(value);
                        this._update();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewNavigator.prototype, "headerFormat", {
                /**
                 * Gets or sets the format string used to display the current
                 * total item/page values in the control header.
                 *
                 * The format string may contain the '{current}' and '{count}'
                 * replacement strings, which are replaced with values that
                 * depend on the value of the {@link byPage} property.
                 *
                 * The format string may also contain the following replacement
                 * strings: '{currentItem}', '{itemCount}', '{currentPage}', and
                 * '{pageCount}', which are replaced with values that do not
                 * depend on the value of the {@link byPage} property.
                 *
                 * The default value for this property is the string
                 * **"{current:n0} / {count:n0}"**.
                 *
                 * The control header element is an input element and contains
                 * plain text (HTML is not supported).
                 */
                get: function () {
                    return this._fmt;
                },
                set: function (value) {
                    if (value != this._fmt) {
                        this._fmt = wijmo.asString(value);
                        this._update();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewNavigator.prototype, "repeatButtons", {
                /**
                 * Gets or sets a value that determines whether the next/previous buttons
                 * should act as repeat buttons, firing repeatedly as long as the button
                 * remains pressed.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return !this._rptNext.disabled;
                },
                set: function (value) {
                    this._rptNext.disabled = this._rptPrev.disabled = !wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            // ** implementation
            // enable/disable buttons, update current item/page count
            CollectionViewNavigator.prototype._update = function () {
                // update button state
                var cv = this._view, pg = this._byPage, curr = cv ? (pg ? cv.pageIndex : cv.currentPosition) : 0, cnt = cv ? (pg ? cv.pageCount : cv.itemCount) : 0;
                wijmo.enable(this._btnFirst, cv && curr > 0);
                wijmo.enable(this._btnPrev, cv && curr > 0);
                wijmo.enable(this._txtCurr, cv != null);
                wijmo.enable(this._btnNext, cv && curr < cnt - 1);
                wijmo.enable(this._btnLast, cv && curr < cnt - 1);
                // update current item/page
                this._txtCurr.value = wijmo.format(this._fmt, {
                    current: cv ? curr + 1 : 0,
                    count: cv ? cnt : 0,
                    currentItem: cv ? cv.currentPosition + 1 : 0,
                    itemCount: cv ? cv.itemCount : 0,
                    currentPage: cv ? cv.pageIndex + 1 : 0,
                    pageCount: cv ? cv.pageCount : 0
                });
            };
            CollectionViewNavigator.prototype._currentChanged = function () {
                this._update();
            };
            CollectionViewNavigator.prototype._collectionChanged = function () {
                this._update();
            };
            // navigate on clicks
            CollectionViewNavigator.prototype._click = function (e) {
                var target = e.target, cv = this._view, pg = this._byPage;
                if (cv) {
                    if (wijmo.contains(this._btnFirst, target)) {
                        pg ? cv.moveToFirstPage() : cv.moveCurrentToFirst();
                    }
                    else if (wijmo.contains(this._btnPrev, target)) {
                        pg ? cv.moveToPreviousPage() : cv.moveCurrentToPrevious();
                    }
                    else if (wijmo.contains(this._btnNext, target)) {
                        pg ? cv.moveToNextPage() : cv.moveCurrentToNext();
                    }
                    else if (wijmo.contains(this._btnLast, target)) {
                        pg ? cv.moveToLastPage() : cv.moveCurrentToLast();
                    }
                    e.preventDefault();
                }
            };
            /**
             * Gets or sets the template used to instantiate {@link  CollectionViewNavigator} controls.
             */
            CollectionViewNavigator.controlTemplate = '<div class="wj-input-group">' +
                '<span wj-part="btn-first" class="wj-input-group-btn">' +
                '<button class="wj-btn wj-btn-default" tabindex="-1">' +
                '<span class="wj-glyph-step-backward"></span>' +
                '</button>' +
                '</span>' +
                '<span wj-part="btn-prev" class="wj-input-group-btn"> ' +
                '<button class="wj-btn wj-btn-default" tabindex="-1">' +
                '<span class="wj-glyph-left"></span> ' +
                '</button>' +
                '</span>' +
                '<input wj-part="txt-curr" class="wj-form-control" readonly>' +
                '<span wj-part="btn-next" class="wj-input-group-btn">' +
                '<button class="wj-btn wj-btn-default" tabindex="-1">' +
                '<span class="wj-glyph-right"></span>' +
                '</button>' +
                '</span>' +
                '<span wj-part="btn-last" class="wj-input-group-btn">' +
                '<button class="wj-btn wj-btn-default" tabindex="-1">' +
                '<span class="wj-glyph-step-forward"></span>' +
                '</button>' +
                '</span>' +
                '</div>';
            return CollectionViewNavigator;
        }(wijmo.Control));
        input.CollectionViewNavigator = CollectionViewNavigator;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The {@link ListBox} control displays a list of items which may contain
         * plain text or HTML, and allows users to select items with the mouse
         * or the keyboard.
         *
         * Use the {@link ListBox.selectedIndex} property to determine which item
         * is currently selected.
         *
         * You can populate a {@link ListBox} using an array of strings or you can
         * use an array of objects, in which case the {@link ListBox.displayMemberPath}
         * property determines which object property is displayed on the list.
         *
         * To display items that contain HTML rather than plain text, set the
         * {@link ListBox.isContentHtml} property to true.
         *
         * The {@link ListBox} control supports the following keyboard commands:
         *
         * <table>
         *   <thead>
         *     <tr><th>Key Combination</th><th>Action</th></tr>
         *   </thead>
         *   <tbody>
         *     <tr><td>Up/Down</td><td>Select the previous/next item</td></tr>
         *     <tr><td>PageUp/Down</td><td>Select the item one page above or below the selection</td></tr>
         *     <tr><td>Home/End</td><td>Select the first/last items</td></tr>
         *     <tr><td>Space</td><td>Toggle the checkbox in the current item (see the {@link checkedMemberPath} property)</td></tr>
         *     <tr><td>Other characters</td><td>Search for items that contain the text typed (multi-character auto-search)</td></tr>
         *   </tbody>
         * </table>
         *
         * The example below creates a {@link ListBox} control and populates it using
         * a 'countries' array. The control updates its {@link ListBox.selectedIndex}
         * and {@link ListBox.selectedItem} properties as the user moves the selection.
         *
         * {@sample Input/ListBox/Overview/purejs Example}
         */
        var ListBox = /** @class */ (function (_super) {
            __extends(ListBox, _super);
            /**
             * Initializes a new instance of the {@link ListBox} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function ListBox(element, options) {
                var _this = _super.call(this, element, null, true) || this;
                _this._cv = null;
                _this._itemFormatter = null;
                _this._pathDisplay = new wijmo.Binding('');
                _this._pathValue = new wijmo.Binding('');
                _this._pathChecked = new wijmo.Binding('');
                _this._html = false;
                _this._shGroups = false;
                _this._checkedItems = null;
                _this._itemRole = 'option';
                _this._caseSensitive = false;
                // virtualization
                _this._vThreshold = ListBox._VTHRESH;
                _this._isVirtual = false;
                _this._children = [];
                _this._clientHeight = -1;
                _this._itemHeight = 30;
                _this._itemsAbove = -1;
                _this._itemsBelow = -1;
                _this._eSizer = document.createElement('div');
                _this._ePadTop = document.createElement('div');
                _this._ePadBot = document.createElement('div');
                // work variables
                _this._checking = false;
                _this._search = '';
                _this._fmtItemHandlers = 0;
                _this._itemCount = 0;
                _this._oldSel = null;
                // ** events
                /**
                 * Occurs when the value of the {@link selectedIndex} property changes.
                 */
                _this.selectedIndexChanged = new wijmo.Event();
                /**
                 * Occurs when the list of items changes.
                 */
                _this.itemsChanged = new wijmo.Event();
                /**
                 * Occurs before the list items are generated.
                 */
                _this.loadingItems = new wijmo.Event();
                /**
                 * Occurs after the list items have been generated.
                 */
                _this.loadedItems = new wijmo.Event();
                /**
                 * Occurs when the current item is checked or unchecked by the user.
                 *
                 * This event is raised when the {@link checkedMemberPath} is set to
                 * the name of a property to add check boxes to each item in the control.
                 *
                 * Use the {@link selectedItem} property to retrieve the item that was
                 * checked or unchecked.
                 */
                _this.itemChecked = new wijmo.Event();
                /**
                 * Occurs when the value of the {@link checkedItems} property changes.
                 */
                _this.checkedItemsChanged = new wijmo.Event();
                /**
                 * Occurs when an element representing a list item has been created.
                 *
                 * This event can be used to format list items for display. It is similar
                 * in purpose to the {@link itemFormatter} property, but has the advantage
                 * of allowing multiple independent handlers.
                 *
                 * The {@link FormatItemEventArgs} object passed as a parameter has
                 * a **data** property that refers to the data item bound to the
                 * item and an **index** property that provides the item index into
                 * the current view.
                 *
                 * If the {@link showGroups} property is set to **true** and
                 * the item represents a group header, then the **data** property
                 * contains a reference to a {@link CollectionViewGroup} object
                 * represents the group. This object contains the group's **name**,
                 * **items**, and **groupDescription**.
                 * Since group headers do not correspond to actual data items,
                 * the **index** property in this case is set to **-1**.
                 */
                _this.formatItem = new wijmo.Event(function () {
                    _this.invalidate();
                });
                // instantiate and apply template
                _this.applyTemplate('wj-control wj-content wj-listbox', null, null);
                // accessibility: https://www.w3.org/TR/wai-aria-1.1/#listbox
                var host = _this.hostElement;
                wijmo.setAttribute(host, 'role', 'listbox', true);
                // initializing from <select> tag
                if (_this._orgTag == 'SELECT') {
                    _this._initFromSelect(_this.hostElement);
                }
                // handle mouse and keyboard
                _this.addEventListener(host, 'click', _this._click.bind(_this));
                _this.addEventListener(host, 'keydown', _this._keydown.bind(_this));
                _this.addEventListener(host, 'keypress', _this._keypress.bind(_this));
                // prevent wheel from propagating to parent elements
                _this.addEventListener(host, 'wheel', function (e) {
                    if (host.scrollHeight > host.offsetHeight) {
                        if ((e.deltaY < 0 && host.scrollTop == 0) ||
                            (e.deltaY > 0 && host.scrollTop + host.offsetHeight >= host.scrollHeight)) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                        }
                    }
                });
                // initialize virtualization sizer/padding elements
                [_this._eSizer, _this._ePadTop, _this._ePadBot].forEach(function (e) {
                    e.tabIndex = -1;
                    wijmo.setAttribute(e, 'aria-hidden', true);
                    wijmo.setCss(e, {
                        pointerEvents: 'none',
                        opacity: '0',
                    });
                });
                // initialize control options
                _this.initialize(options);
                // initialize the view range
                _this._updateViewRange();
                _this.hostElement.addEventListener('scroll', function (e) {
                    _this._updateViewRange();
                });
                return _this;
            }
            Object.defineProperty(ListBox.prototype, "itemsSource", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the array or {@link ICollectionView} object that contains
                 * the list items.
                 */
                get: function () {
                    return this._items;
                },
                set: function (value) {
                    var chi = this.checkedItems;
                    if (this._items != value) {
                        // unbind current collection view
                        if (this._cv) {
                            this._cv.currentChanged.removeHandler(this._cvCurrentChanged, this);
                            this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                            this._cv = null;
                        }
                        // save new data source and collection view
                        this._items = value;
                        this._checkedItems = null;
                        this._cv = wijmo.asCollectionView(value);
                        // bind new collection view
                        if (this._cv != null) {
                            this._cv.currentChanged.addHandler(this._cvCurrentChanged, this);
                            this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                        }
                        // update the list
                        this._populateList();
                        this.onItemsChanged();
                        this.onSelectedIndexChanged();
                        if (!this._arrayEquals(chi, this.checkedItems)) { //WJM-20321  checkedItemsChanged event when set items
                            this.onCheckedItemsChanged();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "collectionView", {
                /**
                 * Gets the {@link ICollectionView} object used as the item source.
                 */
                get: function () {
                    return this._cv;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "virtualizationThreshold", {
                /**
                 * Gets or sets the minimum number of rows and/or columns required to enable
                 * virtualization.
                 *
                 * When the {@link ListBox} is virtualized, only the items that are currently
                 * visible are added to the DOM. This makes a huge difference in performance
                 * when the {@link ListBox} contains a large number of items (say 1,000 or so).
                 *
                 * The default value for this property is a very big number, meaning virtualization is
                 * disabled. To enable virtualization, set its value to 0 or a positive number.
                 *
                 * Virtualization assumes a vertically stacked layout, so it is automatically
                 * disabled if the {@link ListBox} uses a multi-column display (such as a
                 * flexbox or grid layout).
                 */
                get: function () {
                    return this._vThreshold;
                },
                set: function (value) {
                    if (value != this._vThreshold) {
                        var virtual = this._getVirtual();
                        this._vThreshold = wijmo.asNumber(value, false, true);
                        if (virtual != this._getVirtual()) {
                            this._populateList();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "showGroups", {
                /**
                 * Gets or sets a value that determines whether the {@link ListBox} should
                 * include group header items to delimit data groups.
                 *
                 * Data groups are created by modifying the {@link ICollectionView.groupDescriptions}
                 * property of the {@link ICollectionView} object used as an {@link itemsSource}.
                 *
                 * The {@link ListBox} only shows the first level of grouping.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._shGroups;
                },
                set: function (value) {
                    if (value != this._shGroups) {
                        this._shGroups = wijmo.asBoolean(value);
                        this._populateList();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "isContentHtml", {
                /**
                 * Gets or sets a value indicating whether items contain plain
                 * text or HTML.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._html;
                },
                set: function (value) {
                    if (value != this._html) {
                        this._html = wijmo.asBoolean(value);
                        this._populateList();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "itemFormatter", {
                /**
                 * Gets or sets a function used to customize the values shown on
                 * the list.
                 *
                 * The function takes two arguments, the item index and the default
                 * text or html, and returns the new text or html to display.
                 *
                 * If the formatting function needs a scope (i.e. a meaningful
                 * 'this' value), then remember to set the filter using the 'bind'
                 * function to specify the 'this' object. For example:
                 *
                 * ```typescript
                 * listBox.itemFormatter = customItemFormatter.bind(this);
                 * function customItemFormatter(index, content) {
                 *     if (this.makeItemBold(index)) {
                 *         content = '&lt;b&gt;' + content + '&lt;/b&gt;';
                 *     }
                 *     return content;
                 * }
                 * ```
                 */
                get: function () {
                    return this._itemFormatter;
                },
                set: function (value) {
                    if (value != this._itemFormatter) {
                        this._itemFormatter = wijmo.asFunction(value);
                        this._populateList();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "displayMemberPath", {
                /**
                 * Gets or sets the name of the property to use as the visual
                 * representation of the items.
                 *
                 * The default value for this property is the empty string **''**.
                 */
                get: function () {
                    return this._pathDisplay.path;
                },
                set: function (value) {
                    if (value != this.displayMemberPath) {
                        this._pathDisplay.path = wijmo.asString(value);
                        this._populateList();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "selectedValuePath", {
                /**
                 * Gets or sets the name of the property used to get the
                 * {@link selectedValue} from the {@link selectedItem}.
                 *
                 * The default value for this property is the empty string **''**.
                 */
                get: function () {
                    return this._pathValue.path;
                },
                set: function (value) {
                    this._pathValue.path = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "checkedMemberPath", {
                /**
                 * Gets or sets the name of the property used to control
                 * check boxes placed next to each item.
                 *
                 * Use this property to create multi-select ListBoxes.
                 *
                 * When an item is checked or unchecked, the control raises the
                 * {@link itemChecked} event.
                 *
                 * Use the {@link selectedItem} property to retrieve the item that
                 * was checked or unchecked, or use the {@link checkedItems} property
                 * to retrieve the list of items that are currently checked.
                 *
                 * The default value for this property is the empty string **''**.
                 */
                get: function () {
                    return this._pathChecked.path;
                },
                set: function (value) {
                    if (value != this.checkedMemberPath) {
                        this._pathChecked.path = wijmo.asString(value);
                        this._populateList();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "caseSensitiveSearch", {
                /**
                 * Gets or sets a value that determines whether searches performed
                 * while the user types should case-sensitive.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._caseSensitive;
                },
                set: function (value) {
                    this._caseSensitive = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "itemRole", {
                /**
                 * Gets or sets the value or the "role" attribute added to the
                 * list items.
                 *
                 * The default value for this property is the string **"option"**.
                 */
                get: function () {
                    return this._itemRole;
                },
                set: function (value) {
                    if (value != this.itemRole) {
                        this._itemRole = wijmo.asString(value);
                        this._populateList();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the string displayed for the item at a given index.
             *
             * The string may be plain text or HTML, depending on the setting
             * of the {@link isContentHtml} property.
             *
             * @param index The index of the item in the {@link itemsSource}.
             */
            ListBox.prototype.getDisplayValue = function (index) {
                // get the text or html
                var item = null;
                if (index > -1 && wijmo.hasItems(this._cv)) {
                    item = this._cv.items[index];
                    if (this.displayMemberPath) {
                        item = this._pathDisplay.getValue(item);
                    }
                }
                var text = item != null ? item.toString() : '';
                // allow caller to override/modify the text or html
                if (this._itemFormatter) {
                    text = this._itemFormatter(index, text);
                }
                // return the result
                return text;
            };
            /**
             * Gets the text displayed for the item at a given index (as plain text).
             *
             * @param index The index of the item in the {@link itemsSource}.
             */
            ListBox.prototype.getDisplayText = function (index) {
                var item = this._getChild(index);
                return item != null ? item.textContent : '';
            };
            /**
             * Gets a value that determines whether the item at a given index is enabled.
             *
             * @param index The index of the item in the {@link itemsSource}.
             */
            ListBox.prototype.isItemEnabled = function (index) {
                var item = this._getChild(index);
                return item != null &&
                    !item.hasAttribute('disabled') &&
                    !wijmo.hasClass(item, 'wj-state-disabled') &&
                    !wijmo.hasClass(item, 'wj-separator');
            };
            Object.defineProperty(ListBox.prototype, "selectedIndex", {
                /**
                 * Gets or sets the index of the currently selected item.
                 */
                get: function () {
                    return this._cv ? this._cv.currentPosition : -1;
                },
                set: function (value) {
                    if (this._cv) {
                        this._cv.moveCurrentToPosition(wijmo.asNumber(value));
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "selectedItem", {
                /**
                 * Gets or sets the item that is currently selected.
                 */
                get: function () {
                    return this._cv ? this._cv.currentItem : null;
                },
                set: function (value) {
                    if (this._cv) {
                        this._cv.moveCurrentTo(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "selectedValue", {
                /**
                 * Gets or sets the value of the {@link selectedItem} obtained using
                 * the {@link selectedValuePath}.
                 */
                get: function () {
                    var item = this.selectedItem;
                    if (item && this.selectedValuePath) {
                        item = this._pathValue.getValue(item);
                    }
                    return item;
                },
                set: function (value) {
                    var cv = this._cv, items = cv ? cv.items : null, path = this.selectedValuePath, index = -1;
                    if (items) {
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i], itemValue = path ? this._pathValue.getValue(item) : item;
                            if (itemValue === value || wijmo.DateTime.equals(itemValue, value)) { // support dates as well
                                index = i;
                                break;
                            }
                            if (this.isContentHtml && wijmo.isString(itemValue) && itemValue.indexOf('<') > -1) {
                                if (wijmo.toPlainText(itemValue) === value) { // and HTML
                                    index = i;
                                    break;
                                }
                            }
                        }
                        this.selectedIndex = index;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListBox.prototype, "maxHeight", {
                /**
                 * Gets or sets the maximum height of the list (in pixels).
                 *
                 * The default value for this property is **null**, which
                 * means the {@link ListBox} has no maximum height limit.
                 */
                get: function () {
                    var host = this.hostElement, height = host ? parseFloat(host.style.maxHeight) : null;
                    return isNaN(height) ? null : height;
                },
                set: function (value) {
                    var host = this.hostElement;
                    if (host) {
                        value = wijmo.asNumber(value, true);
                        host.style.maxHeight = (value == null) ? '' : value + 'px';
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Highlights the selected item and scrolls it into view.
             *
             * @param setFocus Whether to set the focus to the list after scrolling
             * the selected item into view.
             */
            ListBox.prototype.showSelection = function (setFocus) {
                if (setFocus === void 0) { setFocus = this.containsFocus(); }
                var host = this.hostElement, children = this._children, eSel = this._getSelectedElement(false), // virtualized or not
                rcItem = new wijmo.Rect(0, 0, 0, 0);
                // update selection attributes
                if (eSel != this._oldSel) {
                    this._updateItemAttributes(eSel, true);
                    this._updateItemAttributes(this._oldSel, false);
                    this._oldSel = eSel;
                }
                // scroll into view
                // WJM-1974
                if (eSel instanceof HTMLElement) { // if the Selected Element exists
                    rcItem = this._getBoundingClientRect(eSel);
                }
                else if (this._children.length > 0) { // if there is no selected element, but there are children
                    rcItem = this._getBoundingClientRect(this._getChild(0));
                }
                // get rectangles
                var rcHost = this._getBoundingClientRect(host), hdrHei = 0;
                // account for group headers
                if (this._shGroups) {
                    hdrHei = this._itemHeight;
                    if (!this._isVirtual) {
                        var eHdr = children[0];
                        if (eHdr.offsetHeight && wijmo.hasClass(eHdr, 'wj-header')) {
                            hdrHei = eHdr.offsetHeight;
                        }
                    }
                }
                // scroll the host
                if (rcItem.bottom > rcHost.bottom) {
                    host.scrollTop += rcItem.bottom - rcHost.bottom;
                }
                else if (rcItem.top < rcHost.top + hdrHei) {
                    host.scrollTop -= rcHost.top + hdrHei - rcItem.top;
                }
                // and update the viewRange immediately
                this._updateViewRange();
                // get selected element (not virtualized)
                eSel = this._getSelectedElement(true); // not virtualized
                // make sure the selected element has the focus (TFS 135278)
                if (setFocus) {
                    var ae = (eSel && !wijmo.contains(eSel, wijmo.getActiveElement())) ? eSel : host;
                    ae.focus();
                }
                // update control's tabIndex
                host.tabIndex = eSel ? -1 : this._orgTabIndex;
            };
            /**
             * Loads the list with items from the current {@link itemsSource}.
             */
            ListBox.prototype.loadList = function () {
                this._populateList();
            };
            /**
             * Gets the checked state of an item on the list.
             *
             * This method can be used with multi-select ListBoxes
             * (see the {@link checkedMemberPath} property).
             *
             * @param index Item index.
             */
            ListBox.prototype.getItemChecked = function (index) {
                var item = this._cv.items[index], bnd = this._pathChecked;
                if (wijmo.isObject(item) && bnd.path) {
                    return bnd.getValue(item);
                }
                var cb = this._getCheckbox(index);
                return cb ? cb.checked : false;
            };
            /**
             * Sets the checked state of an item on the list.
             *
             * This method is applicable only on multi-select ListBoxes
             * (see the {@link checkedMemberPath} property).
             *
             * If the checked state of the item changes, the item becomes
             * selected.
             *
             * @param index Item index.
             * @param checked Item's new checked state.
             */
            ListBox.prototype.setItemChecked = function (index, checked) {
                this._setItemChecked(index, checked, true);
            };
            /**
             * Toggles the checked state of an item on the list.
             * This method is applicable only to multi-select ListBoxes
             * (see the {@link checkedMemberPath} property).
             *
             * @param index Item index.
             */
            ListBox.prototype.toggleItemChecked = function (index) {
                this.setItemChecked(index, !this.getItemChecked(index));
            };
            Object.defineProperty(ListBox.prototype, "checkedItems", {
                /**
                 * Gets or sets an array containing the items that are currently checked.
                 *
                 * Setting this property does not change the value of the
                 * {@link selectedIndex} property.
                 */
                get: function () {
                    if (this._checkedItems == null) {
                        this._checkedItems = this._getCheckedItems();
                    }
                    return this._checkedItems;
                },
                set: function (value) {
                    var _this = this;
                    var arr = wijmo.asArray(value, false);
                    // same items? no work, no events (TFS 441665)
                    if (this._arrayEquals(arr, this.checkedItems)) {
                        return;
                    }
                    // build a map of checked items and update the bound checked values
                    var cv = this._cv, bnd = this._pathChecked, map = new Map();
                    if (bnd && cv) {
                        var src = cv.sourceCollection;
                        if (src && src.length) {
                            // ignore binding if items are not objects (e.g. strings)
                            if (!wijmo.isObject(src[0])) {
                                bnd = null;
                            }
                            // build checked item map
                            arr.forEach(function (item) { return map.set(item, true); });
                            // check/uncheck and re-order the items
                            this._checking = true;
                            var ordered_1 = [];
                            src.forEach(function (item) {
                                // if the object is checked, add to sorted list
                                var checked = map.has(item);
                                if (checked) {
                                    ordered_1.push(item);
                                }
                                // if binding to objects, update bound value
                                if (bnd) {
                                    bnd.setValue(item, checked);
                                }
                            });
                            this._checking = false;
                            // save ordered array
                            arr = ordered_1;
                        }
                        // use the map to update the checkboxes (C1WEB-27652)
                        cv.items.forEach(function (item, index) {
                            _this._setItemChecked(index, map.has(item), false);
                        });
                    }
                    // save new value and raise event
                    if (!this._arrayEquals(arr, this._checkedItems)) {
                        this._checkedItems = arr;
                        this.onCheckedItemsChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the data index of an element within the list.
             *
             * @param e Element to search for.
             * @return The index of the element in the list, or -1 if the element
             * is not a member of the list.
             */
            ListBox.prototype.indexOf = function (e) {
                e = wijmo.closest(e, '.wj-listbox-item');
                return e ? e[ListBox._DIDX_KEY] : -1;
            };
            /**
             * Raises the {@link selectedIndexChanged} event.
             */
            ListBox.prototype.onSelectedIndexChanged = function (e) {
                this.selectedIndexChanged.raise(this, e);
            };
            /**
             * Raises the {@link itemsChanged} event.
             */
            ListBox.prototype.onItemsChanged = function (e) {
                this.itemsChanged.raise(this, e);
            };
            /**
             * Raises the {@link loadingItems} event.
             */
            ListBox.prototype.onLoadingItems = function (e) {
                this.loadingItems.raise(this, e);
            };
            /**
             * Raises the {@link loadedItems} event.
             */
            ListBox.prototype.onLoadedItems = function (e) {
                this.loadedItems.raise(this, e);
            };
            /**
             * Raises the {@link itemChecked} event.
             */
            ListBox.prototype.onItemChecked = function (e) {
                this.itemChecked.raise(this, e);
            };
            /**
             * Raises the {@link checkedItemsChanged} event.
             */
            ListBox.prototype.onCheckedItemsChanged = function (e) {
                this.checkedItemsChanged.raise(this, e);
            };
            /**
             * Raises the {@link formatItem} event.
             *
             * @param e {@link FormatItemEventArgs} that contains the event data.
             */
            ListBox.prototype.onFormatItem = function (e) {
                this.formatItem.raise(this, e);
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** overrides
            /**
             * Refreshes the control.
             *
             * @param fullUpdate Whether to update the control layout as well as the content.
             */
            ListBox.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.hostElement) {
                    // get current record and formatItem handler counts
                    var itemCount = this._cv ? this._cv.items.length : 0, fmtCount = this.formatItem.handlerCount;
                    // populate the list if either one changed (TFS 330302, 330312)
                    // do no test for visibility (TFS 374532)
                    if (itemCount != this._itemCount || fmtCount != this._fmtItemHandlers) {
                        this._fmtItemHandlers = fmtCount;
                        this._populateList();
                    }
                }
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // get a (possibly virtualized) items's bounding rectangle
            ListBox.prototype._getBoundingClientRect = function (e) {
                if (!e.offsetHeight) { //this._isVirtual) {
                    var index = this.indexOf(e), host = this.hostElement;
                    if (index > -1 && host) {
                        index = this._getElementIndex(index);
                        var rcHost = host.getBoundingClientRect(), rcItem = new wijmo.Rect(0, rcHost.top - host.scrollTop + index * this._itemHeight, rcHost.width, this._itemHeight);
                        return rcItem;
                    }
                }
                return wijmo.Rect.fromBoundingRect(e.getBoundingClientRect());
            };
            // update selection attributes for an item
            ListBox.prototype._updateItemAttributes = function (e, selected) {
                if (e) {
                    var cb = this.checkedMemberPath ? this._getCheckbox(this.indexOf(e)) : null, isChecked = cb ? cb.checked : null;
                    wijmo.toggleClass(e, 'wj-state-selected', selected);
                    wijmo.setAttribute(e, 'aria-selected', this._getAriaSelected(selected, isChecked));
                    e.tabIndex = selected ? this._orgTabIndex : -1;
                }
            };
            // gets the currently checked items
            ListBox.prototype._getCheckedItems = function () {
                var _this = this;
                var cv = this._cv, bnd = this._pathChecked, items = [];
                if (cv && bnd && bnd.path) {
                    items = cv.sourceCollection.filter(function (item, index) {
                        if (cv.filter && !cv.filter(item)) { // filtered out
                            return false;
                        }
                        else if (wijmo.isObject(item)) { // use binding value
                            return bnd.getValue(item);
                        }
                        else { // use checkbox
                            var itemIndex = cv.items[index] == item ? index : cv.items.indexOf(item);
                            return _this.getItemChecked(itemIndex);
                        }
                    });
                }
                return items;
            };
            // checks whether two arrays have the same content
            ListBox.prototype._arrayEquals = function (arr1, arr2) {
                if (arr1 == arr2) {
                    return true; // same object (array, null)
                }
                if (!arr1 || !arr2 || arr1.length != arr2.length) {
                    return false; // different lengths (or one is null)
                }
                for (var i = 0; i < arr1.length; i++) {
                    if (arr1[i] != arr2[i]) {
                        return false; // different content
                    }
                }
                return true; // same length/content
            };
            // gets a child element item given a data index
            ListBox.prototype._getChild = function (index) {
                index = this._getElementIndex(index);
                return this._children[index];
            };
            // convert data index into element index
            ListBox.prototype._getElementIndex = function (index) {
                if (this._shGroups) {
                    var children = this._children;
                    for (var i = 0; i <= index && i < children.length; i++) {
                        var e = children[i];
                        if (wijmo.hasClass(e, 'wj-header')) {
                            index++;
                        }
                    }
                }
                return index;
            };
            // sets the checked state of an item on the list
            ListBox.prototype._setItemChecked = function (index, checked, notify) {
                if (notify === void 0) { notify = true; }
                // update data item
                var item = this._cv.items[index], bnd = this._pathChecked, changed = false, oldIndex = this.selectedIndex, wasChecking = this._checking;
                if (wijmo.isObject(item) && bnd.path) {
                    if (bnd.getValue(item) != checked) {
                        var ecv = wijmo.tryCast(this._cv, 'IEditableCollectionView');
                        changed = true;
                        this._checking = true;
                        if (ecv) {
                            ecv.editItem(item);
                            bnd.setValue(item, checked);
                            ecv.commitEdit();
                        }
                        else {
                            bnd.setValue(item, checked);
                            ecv.refresh();
                        }
                        this._checking = wasChecking;
                    }
                }
                else { // bound to strings (TFS 353398)
                    changed = true;
                }
                // update checkbox value and checked pseudo-class
                var cb = this._getCheckbox(index);
                if (cb) {
                    cb.checked = checked;
                    var e = wijmo.closest(cb, '.wj-listbox-item');
                    if (e) {
                        wijmo.toggleClass(e, 'wj-state-checked', checked);
                        wijmo.setAttribute(e, 'aria-selected', checked ? true : null);
                    }
                }
                // fire events
                if (notify) {
                    if (changed) {
                        this._checkedItems = null;
                        this.onItemChecked();
                        this.onCheckedItemsChanged();
                    }
                    if (oldIndex != this.selectedIndex) {
                        this.onSelectedIndexChanged();
                    }
                }
                // done
                return changed;
            };
            // handle changes to the data source
            ListBox.prototype._cvCollectionChanged = function () {
                if (!this._checking) {
                    this._populateList();
                    this.onItemsChanged();
                }
            };
            ListBox.prototype._cvCurrentChanged = function () {
                if (!this._checking) { // TFS 294202
                    this.showSelection();
                    this.onSelectedIndexChanged();
                }
            };
            // populate the list from the current itemsSource
            ListBox.prototype._populateList = function () {
                // get ready to populate
                var host = this.hostElement, cv = this._cv;
                this._itemCount = cv ? cv.items.length : 0;
                this._isVirtual = this._getVirtual();
                this._oldSel = null;
                this._itemsAbove = -1;
                this._itemsBelow = -1;
                if (host) {
                    // remember if we have focus, initialize work vars
                    var focus_1 = this.containsFocus(), groups = void 0;
                    // fire event so user can clean up any current items
                    this.onLoadingItems();
                    // empty list (faster/safer than setting HTML to empty string)
                    var children = this._children = [];
                    host.textContent = '';
                    // populate list
                    if (cv) {
                        var index = 0, item = void 0, frag = [];
                        if (this._shGroups && cv.groups && cv.groups.length) { // create grouped view
                            groups = {};
                            for (var g = 0; g < cv.groups.length; g++) {
                                var group = cv.groups[g];
                                groups[index] = group;
                                item = this._createHeaderItem(group);
                                frag.push(item);
                                for (var i = 0; i < group.items.length; i++, index++) {
                                    item = this._createItem(index);
                                    frag.push(item);
                                }
                            }
                        }
                        else { // create flat view
                            for (var i = 0; i < cv.items.length; i++, index++) {
                                item = this._createItem(index);
                                frag.push(item);
                            }
                        }
                        // save items and their data indices
                        var p = this._isVirtual ? document.createElement('div') : host, dIndex = 0;
                        p.innerHTML = frag.join('');
                        for (var i = 0; i < p.children.length; i++) {
                            var e = p.children[i];
                            if (dIndex == cv.currentPosition) { // keep track of current selection
                                this._oldSel = e;
                            }
                            e[ListBox._DIDX_KEY] = (e.className.indexOf('wj-header') < 0) // update data index
                                ? dIndex++
                                : -1;
                            children.push(e); // add to list
                        }
                    }
                    // call formatItem on all items
                    if (this.formatItem.hasHandlers && cv) {
                        var index = 0, items = cv.items, e = new FormatItemEventArgs(0, null, null);
                        for (var i = 0; i < children.length; i++) {
                            e._item = children[i];
                            if (this._shGroups && wijmo.hasClass(e._item, 'wj-header')) { // group headers
                                e._index = -1;
                                e._data = groups[index]; // CollectionViewGroup
                            }
                            else { // regular items
                                e._index = index;
                                e._data = items[index++];
                            }
                            this.onFormatItem(e);
                        }
                    }
                    // prepare virtualization
                    if (this._isVirtual) {
                        // measure the items
                        var ctx = this._getCanvasContext(), widest = null, maxWidth = 0;
                        for (var i = 0; i < children.length; i++) {
                            var item = children[i];
                            var tm = ctx.measureText(item.textContent);
                            if (tm.width > maxWidth) {
                                widest = item;
                                maxWidth = tm.width;
                            }
                        }
                        // save max item width, item height
                        if (widest) {
                            // add host to DOM if necessary
                            var removeHost = false, display = host.style.display, position = host.style.position;
                            if (!host.parentElement) {
                                removeHost = true;
                                document.body.appendChild(host);
                                wijmo.setCss(host, {
                                    display: '',
                                    position: 'absolute'
                                });
                            }
                            // measure widest child's width and height
                            host.appendChild(widest);
                            var whiteSpace = widest.style.whiteSpace;
                            widest.style.whiteSpace = 'nowrap';
                            this._ePadTop.style.width = widest.offsetWidth + 'px';
                            this._itemHeight = widest.offsetHeight || this._itemHeight;
                            widest.style.whiteSpace = whiteSpace;
                            // done measuring, restore state
                            if (removeHost) {
                                wijmo.removeChild(host);
                                wijmo.setCss(host, {
                                    display: display,
                                    position: position
                                });
                            }
                            wijmo.removeChild(widest);
                        }
                        else {
                            this._ePadTop.style.width = '';
                        }
                        // save required client height
                        this._eSizer.style.height = (children.length * this._itemHeight) + 'px';
                        host.appendChild(this._eSizer);
                        this._clientHeight = host.clientHeight;
                        wijmo.removeChild(this._eSizer);
                        // update the view range
                        this._updateViewRange();
                    }
                    // update checked items (after filtering etc)
                    this.checkedItems = this._getCheckedItems();
                    // update focus/tabIndex (TFS 339998)
                    var eSel = this._getSelectedElement(true);
                    if (focus_1) {
                        var ae = eSel || host;
                        ae.focus();
                    }
                    else if (eSel) {
                        this.showSelection();
                    }
                    host.tabIndex = eSel ? -1 : this._orgTabIndex;
                    // done loading items
                    this.onLoadedItems();
                }
            };
            // gets a 2d canvas context to measure strings
            ListBox.prototype._getCanvasContext = function () {
                var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d'), cs = getComputedStyle(this.hostElement);
                if (cs.fontSize && cs.fontFamily) {
                    ctx.font = cs.fontSize + ' ' + cs.fontFamily.split(',')[0];
                }
                return ctx;
            };
            // gets a value that determines whether the list should be virtualized
            ListBox.prototype._getVirtual = function () {
                if (this._itemCount <= this._vThreshold) {
                    return false;
                }
                var host = this.hostElement;
                if (host) { // don't virtualize multi-column/ not stacked
                    var cs = getComputedStyle(host);
                    if (parseInt(cs.columnCount) > 1 || cs.display.indexOf('flex') > -1 || cs.display.indexOf('grid') > -1) {
                        return false;
                    }
                }
                return true;
            };
            // get limit css height based on browser
            ListBox.prototype._getMaxSupportedCssHeight = function () {
                var maxHeight = 26500000; // Chrome 77, 2e6 fixes blurry borders (but screws up scrolling!)
                if (wijmo.isIE()) {
                    maxHeight = 1500000; // IE 11
                }
                else if (wijmo.isFirefox()) {
                    maxHeight = 17500000; // Firefox 71
                }
                return maxHeight;
            };
            // re-populate the control when the size or scroll position change
            ListBox.prototype._updateViewRange = function () {
                var host = this.hostElement, scrollTop = host.scrollTop, itemHeight = this._itemHeight, children = this._children;
                // not in the DOM? no work
                if (!host || !host.parentElement || !this._isVirtual || !this._children) {
                    return false;
                }
                //WJM-19665, WJM-19695
                wijmo.assert(itemHeight * children.length < this._getMaxSupportedCssHeight(), "The number of items (" + children.length + ") exceeds the maximum number of items (" + Math.floor(this._getMaxSupportedCssHeight() / itemHeight) + ") allowed for this browser.");
                // get current client height and item counts
                var clientHeight = Math.max(host.clientHeight, this._clientHeight);
                var itemsAbove = Math.floor(scrollTop / itemHeight);
                var itemsShown = Math.min(children.length, Math.ceil((scrollTop + clientHeight) / itemHeight) - itemsAbove); //WJM - 19600
                var itemsBelow = Math.max(0, children.length - itemsAbove - itemsShown);
                // no change? no work
                if (itemsAbove == this._itemsAbove && itemsBelow == this._itemsBelow) {
                    return false;
                }
                this._itemsAbove = itemsAbove;
                this._itemsBelow = itemsBelow;
                // prepare to populate the list
                var frag = document.createDocumentFragment(), focus = this.containsFocus();
                // add top padding
                this._ePadTop.style.height = (itemsAbove * itemHeight) + 'px';
                frag.appendChild(this._ePadTop);
                // add previous group header
                if (this.showGroups && !wijmo.hasClass(children[itemsAbove], 'wj-header')) {
                    for (var i = itemsAbove; i >= 0; i--) {
                        if (wijmo.hasClass(children[i], 'wj-header')) {
                            frag.appendChild(children[i]);
                            break;
                        }
                    }
                }
                // add the items
                for (var i = itemsAbove; i <= itemsAbove + itemsShown && i < children.length; i++) {
                    frag.appendChild(children[i]);
                }
                // add bottom padding
                this._ePadBot.style.height = (itemsBelow * itemHeight) + 'px';
                frag.appendChild(this._ePadBot);
                //add all items at once
                host.textContent = ''; // WJM-19658
                host.appendChild(frag);
                // adjust bottom padding to account for itemHeight variation/round-off
                var calcHeight = (itemsAbove + itemsShown + itemsBelow) * itemHeight, actualHeight = host.scrollHeight, delta = calcHeight - actualHeight;
                this._ePadBot.style.height = (this._ePadBot.offsetHeight - delta) + 'px';
                // update focus/tabIndex (TFS 339998)
                var eSel = this._getSelectedElement(true);
                if (focus) { //WJM-19661
                    var ae = eSel || host;
                    ae.focus({ preventScroll: true });
                }
                host.tabIndex = eSel ? -1 : this._orgTabIndex;
                // all done
                return true;
            };
            // gets the currently selected element
            ListBox.prototype._getSelectedElement = function (visible) {
                var index = this.selectedIndex, aeIndex = this._getElementIndex(index), eSel = aeIndex > -1 ? this._children[aeIndex] : null;
                if (visible && eSel && !eSel.offsetHeight) {
                    eSel = null;
                }
                return eSel;
            };
            // update the view range when the control size changes
            ListBox.prototype._handleResize = function () {
                this._updateViewRange();
            };
            // create an HTML item for the ListBox
            ListBox.prototype._createItem = function (i) {
                // get data item
                var item = this._cv.items[i], isSelected = (i == this._cv.currentPosition);
                // get item text
                var text = this.getDisplayValue(i);
                if (this._html != true) {
                    text = wijmo.escapeHtml(text);
                }
                // add checkbox (with tabindex -1 for accessibility: TFS 135857?)
                var isChecked = null;
                if (this.checkedMemberPath) {
                    isChecked = false; // TFS 467914
                    if (wijmo.isObject(item)) {
                        isChecked = !!this._pathChecked.getValue(item); // items are objects
                    }
                    else if (this._checkedItems) {
                        isChecked = this._checkedItems.indexOf(item) > -1; // items are strings (TFS 466722)
                    }
                    text = '<label>' +
                        '<input type="checkbox" tabindex="-1"' + (isChecked ? ' checked' : '') + '>' +
                        '<span></span> ' +
                        text +
                        '</label>';
                }
                // get class name
                var clsName = 'wj-listbox-item';
                if (isSelected) {
                    clsName += ' wj-state-selected';
                }
                if (isChecked) {
                    clsName += ' wj-state-checked';
                }
                if (this._html) { // TFS 270104
                    var sepCls = ['wj-separator', 'wj-state-disabled'];
                    if (text.indexOf(sepCls[0]) > -1 || text.indexOf(sepCls[1]) > -1) {
                        var sepItem_1 = wijmo.createElement(text);
                        sepCls.forEach(function (cls) {
                            if (wijmo.hasClass(sepItem_1, cls)) {
                                clsName += ' ' + cls;
                            }
                        });
                    }
                }
                // build item
                var html = '<div class="' + clsName + '" ' +
                    'role="' + this.itemRole + '" ' +
                    (this._getAriaSelected(isSelected, isChecked) ? 'aria-selected="true" ' : '') +
                    'tabindex="' + (isSelected ? this._orgTabIndex : -1) + '">' +
                    text +
                    '</div>';
                // done
                return html;
            };
            // returns the checked state if the item has a checkbox, the selected state otherwise:
            // https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
            ListBox.prototype._getAriaSelected = function (isSelected, isChecked) {
                var sel = isChecked != null ? isChecked : isSelected; // TFS 467914
                return sel ? true : null;
            };
            // create an HTML item for a group header in the ListBox
            ListBox.prototype._createHeaderItem = function (group) {
                // build ListBox item
                var html = '<div class="wj-listbox-item wj-header wj-state-disabled" role="presentation" tabindex="-1">' +
                    wijmo.escapeHtml(group.name) +
                    '</div>';
                // done
                return html;
            };
            // click to select elements
            ListBox.prototype._click = function (e) {
                if (e.button == 0 && !e.defaultPrevented) {
                    var index = this.indexOf(e.target);
                    if (index > -1) {
                        // select the item that was clicked
                        this.selectedIndex = index;
                        // handle checkboxes
                        // TFS 351162: looking for clicks on the checkbox or on the item
                        if (this.checkedMemberPath) {
                            var cb = this._getCheckbox(index), item = wijmo.closest(cb, '.wj-listbox-item');
                            if (e.target == cb || e.target == item) {
                                item.focus({ preventScroll: true }); // take focus from the checkbox (Firefox, TFS 135857)
                                this.setItemChecked(index, cb.checked);
                            }
                        }
                    }
                }
            };
            // handle keydown (cursor keys)
            ListBox.prototype._keydown = function (e) {
                var index = this.selectedIndex;
                // honor defaultPrevented
                if (e.defaultPrevented)
                    return;
                // ctrl+A toggles all checkboxes
                if (e.keyCode == 65 && (e.ctrlKey || e.metaKey)) {
                    var cv = this.collectionView;
                    if (this.checkedMemberPath && wijmo.hasItems(cv)) {
                        this.checkedItems = this.checkedItems.length != cv.items.length // TFS 422143
                            ? cv.items // not all items were selected, select them all now
                            : []; // all items were selected, de-select them all
                        e.preventDefault();
                        return;
                    }
                }
                // not interested in other meta keys
                if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)
                    return;
                // handle the event
                switch (e.keyCode) {
                    case wijmo.Key.Down:
                        e.preventDefault();
                        this._selectNext();
                        break;
                    case wijmo.Key.Up:
                        e.preventDefault();
                        this._selectPrev();
                        break;
                    case wijmo.Key.Home:
                        e.preventDefault();
                        this._selectFirst();
                        break;
                    case wijmo.Key.End:
                        e.preventDefault();
                        this._selectLast();
                        break;
                    case wijmo.Key.PageDown:
                        e.preventDefault();
                        this._selectNextPage();
                        break;
                    case wijmo.Key.PageUp:
                        e.preventDefault();
                        this._selectPrevPage();
                        break;
                    case wijmo.Key.Space:
                        if (this.checkedMemberPath && index > -1) {
                            var cb = this._getCheckbox(index);
                            if (cb && this.isItemEnabled(index)) {
                                this.setItemChecked(index, !cb.checked);
                                e.preventDefault();
                            }
                        }
                        break;
                }
            };
            // handle keypress (select/search)
            ListBox.prototype._keypress = function (e) {
                var _this = this;
                // honor defaultPrevented
                if (e.defaultPrevented)
                    return;
                // don't interfere with inner input elements (TFS 132081)
                if (e.target instanceof HTMLInputElement)
                    return;
                // auto search
                if (e.charCode > 32 || (e.charCode == 32 && this._search)) {
                    e.preventDefault();
                    // update search string
                    this._search += String.fromCharCode(e.charCode);
                    //console.log('looking for ' + this._search);
                    if (this._toSearch) {
                        clearTimeout(this._toSearch);
                    }
                    this._toSearch = setTimeout(function () {
                        _this._toSearch = null;
                        _this._search = '';
                    }, wijmo.Control._SEARCH_DELAY);
                    // perform search
                    var index = this._findNext(); // multi-char search
                    if (index < 0 && this._search.length > 1) {
                        this._search = this._search[this._search.length - 1];
                        index = this._findNext(); // single-char search
                    }
                    if (index > -1) {
                        this.selectedIndex = index;
                    }
                }
            };
            // move the selection to the next enabled item
            ListBox.prototype._selectNext = function () {
                for (var i = this.selectedIndex + 1; i < this._children.length; i++) {
                    if (this.isItemEnabled(i)) {
                        this.selectedIndex = i;
                        return true;
                    }
                }
                return false;
            };
            // move the selection to the previous enabled item
            ListBox.prototype._selectPrev = function () {
                for (var i = this.selectedIndex - 1; i >= 0; i--) {
                    if (this.isItemEnabled(i)) {
                        this.selectedIndex = i;
                        return true;
                    }
                }
                return false;
            };
            // select the first enabled item
            ListBox.prototype._selectFirst = function () {
                for (var i = 0; i < this._children.length; i++) {
                    if (this.isItemEnabled(i)) {
                        this.selectedIndex = i;
                        return true;
                    }
                }
                return false;
            };
            // select the last enabled item
            ListBox.prototype._selectLast = function () {
                for (var i = this._children.length - 1; i >= 0; i--) {
                    if (this.isItemEnabled(i)) {
                        this.selectedIndex = i;
                        return true;
                    }
                }
                return false;
            };
            // select the first valid item in the next page
            ListBox.prototype._selectNextPage = function () {
                var host = this.hostElement, height = host.offsetHeight, children = this._children, cnt = this._cv ? this._cv.items.length : 0, offset = 0;
                if (height > 0) { //WJN-19994 height == 0 for example if closed the DropDown
                    for (var i = this.selectedIndex + 1; i < cnt; i++) {
                        var itemHeight = children[i].scrollHeight || this._itemHeight;
                        if (offset + itemHeight > height && this.isItemEnabled(i)) {
                            this.selectedIndex = i;
                            return true;
                        }
                        offset += itemHeight;
                    }
                }
                return this._selectLast();
            };
            // select the first valid item in the previous page
            ListBox.prototype._selectPrevPage = function () {
                var host = this.hostElement, height = host.offsetHeight, children = this._children, offset = 0;
                if (height > 0) { //WJN-19994 height == 0 for example if closed the DropDown
                    for (var i = this.selectedIndex - 1; i > 0; i--) {
                        var itemHeight = children[i].scrollHeight || this._itemHeight;
                        if (offset + itemHeight > height && this.isItemEnabled(i)) {
                            this.selectedIndex = i;
                            return true;
                        }
                        offset += itemHeight;
                    }
                }
                return this._selectFirst();
            };
            // look for the '_search' string from the current position
            ListBox.prototype._findNext = function () {
                if (this.hostElement) {
                    var cnt = this._children.length, start = this.selectedIndex;
                    // start searching from current or next item
                    if (start < 0 || this._search.length == 1) {
                        start++;
                    }
                    // string to search for
                    var search = this._search, caseSensitive = this.caseSensitiveSearch;
                    if (!caseSensitive) {
                        search = search.toLowerCase();
                    }
                    // search through the items (with wrapping)
                    for (var off = 0; off < cnt; off++) {
                        var index = (start + off) % cnt;
                        if (this.isItemEnabled(index)) {
                            var txt = this.getDisplayText(index).trim();
                            if (!caseSensitive) {
                                txt = txt.toLowerCase();
                            }
                            if (txt.indexOf(search) == 0) {
                                return index;
                            }
                        }
                    }
                }
                // not found
                return -1;
            };
            // gets the checkbox element in a given ListBox item
            ListBox.prototype._getCheckbox = function (index) {
                var children = this._children;
                index = this._getElementIndex(index);
                return (this.hostElement && index > -1 && index < children.length)
                    ? children[index].querySelector('input[type=checkbox]')
                    : null;
            };
            // build collectionView from OPTION elements items in a SELECT element
            // this is used by the ComboBox
            ListBox.prototype._initFromSelect = function (hostElement) {
                var children = hostElement.children, items = [], selIndex = -1;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    if (child.tagName == 'OPTION') {
                        // keep track of selected item
                        if (child.hasAttribute('selected')) {
                            selIndex = items.length;
                        }
                        // add option to collectionView
                        if (child.innerHTML) {
                            items.push({
                                hdr: child.innerHTML,
                                val: child.getAttribute('value'),
                                cmdParam: child.getAttribute('cmd-param')
                            });
                        }
                        else {
                            items.push({
                                hdr: '<div class="wj-separator"></div>'
                            });
                        }
                        // remove child from host
                        hostElement.removeChild(child);
                        i--;
                    }
                }
                // apply items to control
                if (items) {
                    this.displayMemberPath = 'hdr';
                    this.selectedValuePath = 'val';
                    this.itemsSource = items;
                    this.selectedIndex = selIndex;
                }
            };
            ListBox._DIDX_KEY = '$WJ-DIDX'; // data index for a list item
            //static _VTHRESH = 200; // default virtualization threshold
            ListBox._VTHRESH = Number.MAX_VALUE / 2; // virtualization is disabled by default
            return ListBox;
        }(wijmo.Control));
        input.ListBox = ListBox;
        /**
         * Provides arguments for the {@link ListBox.formatItem} event.
         */
        var FormatItemEventArgs = /** @class */ (function (_super) {
            __extends(FormatItemEventArgs, _super);
            /**
             * Initializes a new instance of the {@link FormatItemEventArgs} class.
             *
             * @param index Index of the item being formatted in the source {@link ICollectionView}, or -1 if the item is a group header.
             * @param data Data item being formatted, or a {@link CollectionViewGroup} object if the item is a group header.
             * @param item Element that represents the list item to be formatted.
             */
            function FormatItemEventArgs(index, data, item) {
                var _this = _super.call(this) || this;
                _this._index = wijmo.asNumber(index);
                _this._data = data;
                _this._item = wijmo.asType(item, HTMLElement, true);
                return _this;
            }
            Object.defineProperty(FormatItemEventArgs.prototype, "index", {
                /**
                 * Gets the index of the data item in the list.
                 */
                get: function () {
                    return this._index;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormatItemEventArgs.prototype, "data", {
                /**
                 * Gets the data item being formatted.
                 */
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FormatItemEventArgs.prototype, "item", {
                /**
                 * Gets a reference to the element that represents the list item to be formatted.
                 */
                get: function () {
                    return this._item;
                },
                enumerable: true,
                configurable: true
            });
            return FormatItemEventArgs;
        }(wijmo.EventArgs));
        input.FormatItemEventArgs = FormatItemEventArgs;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        // globalization info
        wijmo._addCultureInfo('MultiSelectListBox', {
            filterPlaceholder: 'Filter',
            selectAll: 'Select All'
        });
        /**
         * The {@link MultiSelectListBox} control contains a {@link ListBox} with
         * a "Select All" button and a "Filter" input.
         *
         * The "Select All" and "Filter" elements can be shown or hidden using
         * the {@link showSelectAllCheckbox} and {@link showFilterInput} properties.
         *
         * The {@link MultiSelectListBox} control is used as a drop-down by the
         * {@link MultiSelect} control.
         */
        var MultiSelectListBox = /** @class */ (function (_super) {
            __extends(MultiSelectListBox, _super);
            /**
             * Initializes a new instance of the {@link MultiSelectListBox} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function MultiSelectListBox(element, options) {
                var _this = _super.call(this, element) || this;
                // property storage
                _this._selectAllLabel = null;
                _this._filterPlaceholder = null;
                _this._filterText = ''; // TFS 421442
                _this._checkOnFilter = true;
                _this._delay = wijmo.Control._SEARCH_DELAY;
                // ** events
                /**
                 * Occurs when the value of the {@link checkedItems} property changes.
                 */
                _this.checkedItemsChanged = new wijmo.Event();
                /**
                 * Occurs when the value of the {@link selectedIndex} property changes.
                 */
                _this.selectedIndexChanged = new wijmo.Event();
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-content wj-multiselectlistbox', tpl, {
                    _selectAll: 'select-all',
                    _filter: 'filter',
                    _lbHost: 'list-box'
                });
                // set styles in code (to avoid CSP issues)
                _this._selectAll.style.display = 'none';
                _this._filter.style.display = 'none';
                // initialize control components
                _this._lbx = new input.ListBox(_this._lbHost, {
                    checkedMemberPath: MultiSelectListBox._DEF_CHECKED_PATH,
                    loadedItems: function () { return _this._updateCheckAllCheckbox(); },
                    checkedItemsChanged: function () { return _this.onCheckedItemsChanged(); },
                    selectedIndexChanged: function () { return _this.onSelectedIndexChanged(); }
                });
                _this._cbSelectAll = _this._selectAll.querySelector('input[type=checkbox]');
                _this._spSelectAll = _this._selectAll.querySelector('label>span');
                var str = wijmo.culture.MultiSelectListBox;
                wijmo.setText(_this._spSelectAll, str.selectAll);
                _this._filter.placeholder = str.filterPlaceholder;
                // initialize control options
                _this.initialize(options);
                // update filter on input
                _this.addEventListener(_this._filter, 'input', function () {
                    if (_this._filter.value != _this._filterText) { // make sure it changed (IE is flaky: TFS 420583, 421442)
                        _this._filterText = _this._filter.value;
                        if (_this._toSearch) {
                            clearTimeout(_this._toSearch);
                        }
                        _this._toSearch = setTimeout(function () {
                            _this._toSearch = null;
                            _this._applyFilter();
                        }, _this.delay);
                    }
                });
                // handle clicks on the select all button
                _this.addEventListener(_this._cbSelectAll, 'click', function (e) {
                    var view = _this._lbx.collectionView;
                    if (wijmo.hasItems(view)) {
                        _this.checkedItems = e.target.checked ? view.items : [];
                    }
                });
                // use F3 to search/filter
                _this.addEventListener(_this.hostElement, 'keydown', function (e) {
                    var filter = _this.showFilterInput ? _this._filter : null, lbx = _this._lbx;
                    if (filter && e.keyCode == wijmo.Key.F3) { // F3 focuses on the filter
                        wijmo.setSelectionRange(filter, 0, filter.value.length);
                        e.preventDefault();
                    }
                    if (wijmo.getActiveElement() == filter) { // stop most keys from reaching the ListBox (space, ctrl+A, search)
                        var stopPropagation = !e.altKey; // TFS 467404
                        switch (e.keyCode) {
                            case wijmo.Key.Escape:
                            case wijmo.Key.F4:
                                stopPropagation = false;
                                break;
                        }
                        if (stopPropagation) {
                            e.stopPropagation();
                        }
                    }
                    if (!lbx.containsFocus()) { // cursor keys move focus to listbox (TFS 433522)
                        switch (e.keyCode) {
                            case wijmo.Key.Up:
                            case wijmo.Key.Down:
                                _this._lbx.focus();
                                var index = lbx.selectedIndex + (e.keyCode == wijmo.Key.Up ? -1 : +1);
                                lbx.selectedIndex = Math.max(0, index);
                                e.preventDefault();
                                break;
                        }
                    }
                }, true);
                return _this;
            }
            Object.defineProperty(MultiSelectListBox.prototype, "itemsSource", {
                //--------------------------------------------------------------------------
                // ** object model
                /**
                 * Gets or sets the array or {@link ICollectionView} object that contains
                 * the list items.
                 */
                get: function () {
                    return this._lbx.itemsSource;
                },
                set: function (value) {
                    this._lbx.itemsSource = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "collectionView", {
                /**
                 * Gets the {@link ICollectionView} object used as the item source.
                 */
                get: function () {
                    return this._lbx.collectionView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "virtualizationThreshold", {
                /**
                 * Gets or sets the minimum number of rows and/or columns required to enable
                 * virtualization in the drop-down {@link ListBox}.
                 *
                 * The default value for this property is a very big number, meaning virtualization is
                 * disabled. To enable virtualization, set its value to 0 or a positive number.
                 *
                 * For more detals, please see the {@link ListBox.virtializationThreshold}
                 * property.
                 */
                get: function () {
                    return this._lbx.virtualizationThreshold;
                },
                set: function (value) {
                    this._lbx.virtualizationThreshold = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "displayMemberPath", {
                /**
                 * Gets or sets the name of the property to use as the visual
                 * representation of the items.
                 */
                get: function () {
                    return this._lbx.displayMemberPath;
                },
                set: function (value) {
                    this._lbx.displayMemberPath = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "isContentHtml", {
                /**
                 * Gets or sets a value indicating whether items contain plain
                 * text or HTML.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._lbx.isContentHtml;
                },
                set: function (value) {
                    this._lbx.isContentHtml = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "caseSensitiveSearch", {
                /**
                 * Gets or sets a value that determines whether searches performed
                 * while the user types should case-sensitive.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._lbx.caseSensitiveSearch;
                },
                set: function (value) {
                    this._lbx.caseSensitiveSearch = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "delay", {
                /**
                 * Gets or sets the delay, in milliseconds, between when a keystroke occurs
                 * and when the search is performed to update the filter.
                 *
                 * This property is relevant only when the {@link showFilterInput}
                 * property is set to **true**.
                 *
                 * The default value for this property is **500** milliseconds.
                 */
                get: function () {
                    return this._delay;
                },
                set: function (value) {
                    this._delay = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "showGroups", {
                /**
                 * Gets or sets a value that determines whether the {@link MultiSelectListBox} should
                 * include group header items to delimit data groups.
                 *
                 * Data groups are created by modifying the {@link ICollectionView.groupDescriptions}
                 * property of the {@link ICollectionView} object used as an {@link itemsSource}.
                 *
                 * The {@link MultiSelectListBox} only shows the first level of grouping.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._lbx.showGroups;
                },
                set: function (value) {
                    this._lbx.showGroups = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "checkOnFilter", {
                /**
                 * Gets or sets a value that determines whether the {@link MultiSelectListBox}
                 * should automatically check all filtered items when the filter text changes.
                 *
                 * The default value for this property is **true**, which causes the control
                 * to behave like Excel and check all visible items when the filter is applied.
                 *
                 * For example, in a control with three items "Alice", "Bob", and "Mary",
                 * typing "a" into the filter would cause the control to show items "Alice"
                 * and "Mary", and both would be checked.
                 *
                 * Setting this property to **false** prevents the control from automatically
                 * checking filtered items, and to keep checked items visible regardless of the
                 * filter value.
                 *
                 * For example, in a control with three items "Alice", "Bob", and "Mary",
                 * typing "a" into the filter would cause the control to show items "Alice"
                 * and "Mary", but neither would be checked.
                 * If the user then checked "Mary", and typed "b" into the filter, the list
                 * would show items "Mary" (still checked) and "Bob" (unchecked).
                 */
                get: function () {
                    return this._checkOnFilter;
                },
                set: function (value) {
                    if (value != this.checkOnFilter) {
                        this._checkOnFilter = wijmo.asBoolean(value);
                        this.checkedItems = [];
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "selectedIndex", {
                /**
                 * Gets or sets the index of the currently selected item.
                 */
                get: function () {
                    return this._lbx.selectedIndex;
                },
                set: function (value) {
                    this._lbx.selectedIndex = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "listBox", {
                /**
                 * Gets a reference to the {@link ListBox} control hosted by this
                 * {@link MultiSelectListBox}.
                 */
                get: function () {
                    return this._lbx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "showFilterInput", {
                /**
                 * Gets or sets whether the control should display a "filter" input
                 * above the items to filter the items displayed.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._filter.style.display == '';
                },
                set: function (value) {
                    if (value != this.showFilterInput) {
                        this._filter.style.display = wijmo.asBoolean(value) ? '' : 'none';
                        if (!this.showFilterInput) {
                            this._filter.value = '';
                            this._applyFilter();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "filterInputPlaceholder", {
                /**
                 * Gets or sets the string used as a placeholder for the filter input element.
                 *
                 * The default value for this property is **null**, which causes the control
                 * to show a localized version of the string "Filter".
                 */
                get: function () {
                    return this._filterPlaceholder;
                },
                set: function (value) {
                    if (value != this._filterPlaceholder) {
                        this._filterPlaceholder = wijmo.asString(value);
                        this.refresh();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "showSelectAllCheckbox", {
                /**
                 * Gets or sets whether the control should display a "Select All" checkbox
                 * above the items to select or de-select all items.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._selectAll.style.display == '';
                },
                set: function (value) {
                    this._selectAll.style.display = wijmo.asBoolean(value) ? '' : 'none';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "selectAllLabel", {
                /**
                 * Gets or sets the string to be used as a label for the "Select All"
                 * checkbox that is displayed when the {@link showSelectAllCheckbox}
                 * property is set to true.
                 *
                 * The default value for this property is **null**, which causes the control
                 * to show a localized version of the string "Select All".
                 */
                get: function () {
                    return this._selectAllLabel;
                },
                set: function (value) {
                    if (value != this._selectAllLabel) {
                        this._selectAllLabel = wijmo.asString(value);
                        this.refresh();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "checkedMemberPath", {
                /**
                 * Gets or sets the name of the property used to control the checkboxes
                 * placed next to each item.
                 */
                get: function () {
                    var p = this.listBox.checkedMemberPath;
                    return p != MultiSelectListBox._DEF_CHECKED_PATH ? p : null;
                },
                set: function (value) {
                    value = wijmo.asString(value);
                    this.listBox.checkedMemberPath = value ? value : MultiSelectListBox._DEF_CHECKED_PATH;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelectListBox.prototype, "checkedItems", {
                /**
                 * Gets or sets an array containing the items that are currently checked.
                 */
                get: function () {
                    return this.listBox.checkedItems;
                },
                set: function (value) {
                    this.listBox.checkedItems = wijmo.asArray(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link checkedItemsChanged} event.
             */
            MultiSelectListBox.prototype.onCheckedItemsChanged = function (e) {
                this._updateCheckAllCheckbox();
                this.checkedItemsChanged.raise(this, e);
            };
            /**
             * Raises the {@link selectedIndexChanged} event.
             */
            MultiSelectListBox.prototype.onSelectedIndexChanged = function (e) {
                this.selectedIndexChanged.raise(this, e);
            };
            //--------------------------------------------------------------------------
            // ** overrides
            // update localized header and selectAll checkbox
            MultiSelectListBox.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.hostElement) {
                    // apply culture strings
                    var str = wijmo.culture.MultiSelectListBox;
                    this._filter.placeholder = this._filterPlaceholder != null
                        ? this._filterPlaceholder
                        : str.filterPlaceholder;
                    if (this._spSelectAll) {
                        wijmo.setText(this._spSelectAll, this._selectAllLabel != null
                            ? this._selectAllLabel
                            : str.selectAll);
                    }
                    // update selectAll checkbox (TFS 436123)
                    this._updateCheckAllCheckbox();
                }
            };
            // dispose of the ListBox
            MultiSelectListBox.prototype.dispose = function () {
                this.listBox.dispose();
                _super.prototype.dispose.call(this);
            };
            //--------------------------------------------------------------------------
            //** implementation
            // apply the filter based on the current filter text
            MultiSelectListBox.prototype._applyFilter = function () {
                var _this = this;
                var lbx = this._lbx, view = lbx.collectionView, filterText = this._filter.value;
                // build filter regex
                var rx = filterText
                    ? new RegExp(wijmo.escapeRegExp(filterText), lbx.caseSensitiveSearch ? '' : 'i')
                    : null;
                // support deep bindings
                var dmp = this.displayMemberPath, binding = dmp ? new wijmo.Binding(dmp) : null;
                // keep checked items in view if checkOnFilter == false (TFS 460594)
                // http://demos.codexworld.com/multi-select-dropdown-list-with-checkbox-jquery/
                var checkedItems = this.checkOnFilter ? null : this.checkedItems;
                // apply filter
                view.filter = function (item) {
                    if (rx != null) {
                        // keep checked items in view if checkOnFilter == false
                        if (checkedItems && checkedItems.indexOf(item) > -1) {
                            return true;
                        }
                        // test item content
                        if (binding) {
                            item = binding.getValue(item);
                        }
                        if (_this.isContentHtml) {
                            item = wijmo.toPlainText(item);
                        }
                        return item != null && rx.test(item.toString()); // TFS 454879
                    }
                    return true;
                };
                // make sure something is selected (TFS 417012)
                lbx.selectedIndex = Math.max(0, lbx.selectedIndex);
                // check all filtered items, or none if the filter was cleared
                if (this._checkOnFilter) {
                    this.checkedItems = rx ? view.items : [];
                }
            };
            // update check all checkbox to reflect the state of the list
            MultiSelectListBox.prototype._updateCheckAllCheckbox = function () {
                var view = this._lbx.collectionView, cb = this._cbSelectAll;
                if (wijmo.hasItems(view)) {
                    var cntAll = view.items.length, cntChecked = this.checkedItems.length;
                    wijmo.setChecked(cb, cntChecked == cntAll ? true : cntChecked == 0 ? false : null);
                    cb.disabled = false;
                }
                else {
                    wijmo.setChecked(cb, false);
                    cb.checked = false;
                    cb.disabled = true;
                }
            };
            MultiSelectListBox._DEF_CHECKED_PATH = '$checked';
            /**
             * Gets or sets the template used to instantiate {@link MultiSelectListBox} controls.
             */
            MultiSelectListBox.controlTemplate = '<div class="wj-template wj-listbox">' +
                '<input wj-part="filter" class="wj-form-control">' +
                '<div wj-part="select-all" class="wj-header wj-select-all wj-listbox-item">' +
                '<label>' +
                '<input type="checkbox" tabindex="-1"> <span></span>' +
                '</label>' +
                '</div>' +
                '<div wj-part="list-box"/>' +
                '</div>';
            return MultiSelectListBox;
        }(wijmo.Control));
        input.MultiSelectListBox = MultiSelectListBox;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        // globalization info
        wijmo._addCultureInfo('Calendar', {
            ariaLabels: {
                calendar: 'Calendar',
                monthView: 'Month View',
                yearView: 'Year View',
                prvMo: 'Previous Month',
                today: 'Today',
                nxtMo: 'Next Month',
                prvYr: 'Previous Year',
                currMo: 'Current Month',
                nxtYr: 'Next Year'
            }
        });
        /**
         * Specifies constants that define the date selection behavior.
         */
        var DateSelectionMode;
        (function (DateSelectionMode) {
            /** The user cannot change the current value using the mouse or keyboard. */
            DateSelectionMode[DateSelectionMode["None"] = 0] = "None";
            /** The user can select days. */
            DateSelectionMode[DateSelectionMode["Day"] = 1] = "Day";
            /** The user can select months. */
            DateSelectionMode[DateSelectionMode["Month"] = 2] = "Month";
            /**
             * The user can select ranges.
             *
             * Ranges are defined by the {@link value} and {@link rangeEnd})
             * properties.
             *
             * To select a date range with the mouse, the user should click
             * the starting date ({@link value} property) and then the
             * ending date ({@link rangeEnd} property.
             *
             * To select a date range with the keyobard, the user should
             * use the cursor keys to select the starting date, then press
             * the shift key and extend the selection to select the ending
             * date.
             */
            DateSelectionMode[DateSelectionMode["Range"] = 3] = "Range";
        })(DateSelectionMode = input.DateSelectionMode || (input.DateSelectionMode = {}));
        /**
         * Specifies constants that define whether the control should
         * display month navigation elements.
         *
         * The month navigation elements include a drop-down button to
         * switch between month and year views
         * (see the {@link monthView} property)
         * and buttons to navigate to the previous and next months
         * (see the {@link displayMonth} property).
         *
         * The month navigation elements can be displayed on one or more of
         * the {@link monthCount} in the control.
         */
        var ShowMonthPicker;
        (function (ShowMonthPicker) {
            /** No month navigation. */
            ShowMonthPicker[ShowMonthPicker["None"] = 0] = "None";
            /** Show month navigation elements on the first month. */
            ShowMonthPicker[ShowMonthPicker["FirstMonth"] = 1] = "FirstMonth";
            /** Show month navigation elements on the last month. */
            ShowMonthPicker[ShowMonthPicker["LastMonth"] = 2] = "LastMonth";
            /** Show month navigation elements on the first and last months. */
            ShowMonthPicker[ShowMonthPicker["FirstAndLastMonths"] = 3] = "FirstAndLastMonths";
            /** Show month navigation elements on all months. */
            ShowMonthPicker[ShowMonthPicker["AllMonths"] = 4] = "AllMonths";
            /** Show month navigation buttons next to the edges of the calendar. */
            ShowMonthPicker[ShowMonthPicker["Outside"] = 5] = "Outside";
        })(ShowMonthPicker = input.ShowMonthPicker || (input.ShowMonthPicker = {}));
        /**
         * The {@link Calendar} control displays a table with one or more months
         * and allows users to view and select dates.
         *
         * You may use the {@link min} and {@link max} properties to restrict
         * the range of dates that the user can select.
         *
         * For details about using the {@link min} and {@link max} properties,
         * please see the
         * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
         *
         * Use the {@link value} property to get or set the currently selected date.
         *
         * Use the {@link selectionMode} property to determine whether users should
         * be allowed to select days, ranges, months, or no values at all.
         *
         * The {@link Calendar} control supports the following keyboard commands:
         *
         * <table>
         *   <thead>
         *     <tr><th>Key Combination</th><th>Moves Selection To</th></tr>
         *   </thead>
         *   <tbody>
         *     <tr><td>Left</td><td>Previous day</td></tr>
         *     <tr><td>Right</td><td>Next day</td></tr>
         *     <tr><td>Up</td><td>Previous week</td></tr>
         *     <tr><td>Down</td><td>Next week</td></tr>
         *     <tr><td>PgUp</td><td>Previous month</td></tr>
         *     <tr><td>PgDn</td><td>Next month</td></tr>
         *     <tr><td>Alt+PgUp</td><td>Previous year</td></tr>
         *     <tr><td>Alt+PgDn</td><td>Next year</td></tr>
         *     <tr><td>Home</td><td>First valid day of the month</td></tr>
         *     <tr><td>End</td><td>Last valid day of the month</td></tr>
         *     <tr><td>Alt+End</td><td>Today's date</td></tr>
         *   </tbody>
         * </table>
         *
         * The example below shows a {@link Calendar} control that allows
         * users to select the date with a single click.
         *
         * {@sample Input/Calendar/Overview/purejs Example}
         */
        var Calendar = /** @class */ (function (_super) {
            __extends(Calendar, _super);
            /**
             * Initializes a new instance of the {@link Calendar} class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function Calendar(element, options) {
                var _this = _super.call(this, element) || this;
                _this._yrPicker = true;
                _this._mtPicker = ShowMonthPicker.FirstMonth;
                _this._wksBefore = 0;
                _this._wksAfter = 0;
                _this._rngMin = 0;
                _this._rngMax = 0;
                _this._min = null; // minimum value
                _this._max = null; // maximum value
                _this._readOnly = false; // editable
                _this._handleWheel = true; // handle wheel to switch months
                _this._fdw = null; // first day of week (0 is Sunday, null to use current culture)
                _this._selMode = DateSelectionMode.Day;
                // work variables
                _this._tmYrHidden = 0;
                // formats used to display calendar elements
                _this._fmtYrMo = 'y';
                _this._fmtYr = 'yyyy';
                _this._fmtDayHdr = 'ddd';
                _this._fmtDay = 'd ';
                _this._fmtMonths = 'MMM';
                // ** events
                /**
                 * Occurs when the value of the {@link value} property changes.
                 */
                _this.valueChanged = new wijmo.Event();
                /**
                 * Occurs when the value of the {@link rangeEnd} property changes.
                 */
                _this.rangeEndChanged = new wijmo.Event();
                /**
                 * Occurs when the value of the {@link rangeEnd} property changes
                 * into a non-null value, indicating a data range has been selected.
                 */
                _this.rangeChanged = new wijmo.Event();
                /**
                 * Occurs after the {@link displayMonth} property changes.
                 */
                _this.displayMonthChanged = new wijmo.Event();
                /**
                 * Occurs when an element representing a day in the calendar has been created.
                 *
                 * This event can be used to format calendar items for display. It is similar
                 * in purpose to the {@link itemFormatter} property, but has the advantage
                 * of allowing multiple independent handlers.
                 *
                 * For example, the code below uses the {@link formatItem} event to disable weekends
                 * so they appear dimmed in the calendar:
                 * ```typescript
                 * // disable Sundays and Saturdays
                 * calendar.formatItem.addHandler((s, e) => {
                 *     let day = e.data.getDay();
                 *     if (day == 0 || day == 6) {
                 *       addClass(e.item, 'wj-state-disabled');
                 *     }
                 * });
                 * ```
                 */
                _this.formatItem = new wijmo.Event(function () {
                    _this.invalidate();
                });
                // initialize value (current date)
                _this._value = _this._rngEnd = wijmo.DateTime.newDate();
                _this._month = _this._getMonth(_this._value);
                // create child elements
                _this._cals = [_this];
                _this._createChildren();
                // create year picker
                _this._createYearPicker();
                // handle mouse and keyboard
                var host = _this.hostElement, addListener = _this.addEventListener.bind(_this);
                addListener(host, 'keydown', _this._keydown.bind(_this));
                addListener(host, 'click', _this._click.bind(_this));
                // inc/dec buttons: repeatButtons
                _this._rptUp = new wijmo._ClickRepeater(_this._btnPrv);
                _this._rptDn = new wijmo._ClickRepeater(_this._btnNxt);
                // use wheel to move to the previous/next month
                _this.addEventListener(host, 'wheel', function (e) {
                    if (_this.handleWheel && !e.defaultPrevented && !_this.isReadOnly && _this.containsFocus()) {
                        if (e.deltaY < 0) {
                            _this._btnPrv.click();
                        }
                        else {
                            _this._btnNxt.click();
                        }
                        e.preventDefault();
                    }
                });
                // initialize control options
                _this.initialize(options);
                // update the control
                _this.refresh(true);
                return _this;
            }
            Object.defineProperty(Calendar.prototype, "value", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the currently selected date.
                 *
                 * The default value for this property is the current date.
                 *
                 * When editing ranges, the current range is defined by the interval between
                 * the {@link value} and {@link rangeEnd} properties.
                 *
                 * Setting the {@link value} property automatically resets the {@link rangeEnd}
                 * property to null, so the user can click the range end value on the calendar
                 * to finish a range selection.
                 *
                 * Because setting the {@link value} property resets {@link rangeEnd}, to define
                 * a range in code you must set the {@link value} first, and then {@link rangeEnd}.
                 * For example:
                 *
                 * ```typescript
                 * // this selects a range from 'start' to 'end':
                 * cal.value = start; // rangeEnd == null
                 * cal.rangeEnd = end; // rangeEnd == 'end'
                 *
                 * // **this doesn't work**
                 * cal.rangeEnd = end; // rangeEnd == 'end'
                 * cal.value = start; // rangeEnd == null
                 */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    // ignore if setting to the same Date object
                    // **REVIEW: this is needed to support two-way bindings in the Vue interop
                    if (value === this._value) {
                        return;
                    }
                    // always reset rangeEnd
                    // but if the new value is not the same as the current, 
                    // set a flag so InputDate won't update its text twice
                    this._clearingRangeEnd = !wijmo.DateTime.equals(this._value, value);
                    this.rangeEnd = null;
                    this._clearingRangeEnd = false;
                    // coerce value to a date within the valid range (keeping the time)
                    value = wijmo.asDate(value, true);
                    value = this._clamp(value);
                    // apply new value
                    if (this._valid(value) || value == null) { // TFS 310871
                        //this.displayMonth = this._getMonth(value);
                        this.ensureVisible(value); // TFS 461624, 467135
                        if (!wijmo.DateTime.equals(this._value, value)) {
                            this._value = value;
                            this.invalidate(false);
                            this.onValueChanged();
                        }
                    }
                    // if we have no value, make sure displayMonth is within min/max bounds (TFS 467728)
                    if (!this.value) {
                        var min = this.min, max = this.max, dm = this.displayMonth;
                        if (max && max < dm) {
                            this.ensureVisible(max);
                        }
                        else if (min && min > dm) {
                            this.ensureVisible(min);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "rangeEnd", {
                /**
                 * Gets or sets the last selected date in a range selection.
                 *
                 * To enable date range selection, set the {@link selectionMode} property
                 * to **DateSelectionMode.Range**.
                 *
                 * Once you do that, the selection range will be defined by the {@link value}
                 * and {@link rangeEnd} properties.
                 *
                 * If not null, the {@link rangeEnd} date must be greater than  or equal to
                 * the {@link value} date, which represents the range start.
                 */
                get: function () {
                    return this._rngEnd;
                },
                set: function (value) {
                    value = wijmo.asDate(value, true);
                    // honor ranges (but keep the time)
                    value = this._clamp(value);
                    // honor range limits
                    if (value && this._value && this._rngMode()) {
                        if (value < this._value) {
                            value = this._value;
                        }
                        var min = this._rngMin, max = this._rngMax;
                        if ((min && min > 0) || (max && max > 0)) {
                            var start = this._value, diff = Math.ceil((value.getTime() - start.getTime()) / (24 * 3600 * 1000)), len = diff + 1;
                            if (min && min > 0 && len < min) {
                                value = wijmo.DateTime.addDays(start, min - 1);
                            }
                            if (max && max > 0 && len > max) {
                                value = wijmo.DateTime.addDays(start, max - 1);
                            }
                        }
                    }
                    // update control
                    if (this._valid(value) || value == null) { // TFS 310871
                        if (!wijmo.DateTime.equals(this._rngEnd, value)) {
                            this._rngEnd = value;
                            this.ensureVisible(value); // TFS 467202
                            this.invalidate(false);
                            this.onRangeEndChanged();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "rangeMin", {
                /**
                 * Gets or sets the minimum number of days allowed when editing date ranges.
                 *
                 * This property is used only when the {@link selectionMode} property
                 * is set to {@link DateSelectionMode.Range}.
                 *
                 * The default value for this property is **0**, which means there is
                 * no minimum value for range lengths.
                 */
                get: function () {
                    return this._rngMin;
                },
                set: function (value) {
                    value = wijmo.asNumber(value, true, true);
                    if (value != this._rngMin) {
                        this._rngMin = value;
                        this._syncProp(this, 'rangeMin');
                        if (this._rngMode() && this._rngEnd) {
                            this.rangeEnd = this._rngEnd; // TFS 467500
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "rangeMax", {
                /**
                 * Gets or sets the maximum length allowed when editing date ranges.
                 *
                 * This property is used only when the {@link selectionMode} property
                 * is set to {@link DateSelectionMode.Range}.
                 *
                 * The default value for this property is **0**, which means there
                 * is no maximum value for range lengths.
                 */
                get: function () {
                    return this._rngMax;
                },
                set: function (value) {
                    value = wijmo.asNumber(value, true, true);
                    if (value != this._rngMax) {
                        this._rngMax = value;
                        this._syncProp(this, 'rangeMax');
                        if (this._rngMode() && this._rngEnd) {
                            this.rangeEnd = this._rngEnd; // TFS 467500
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "min", {
                /**
                 * Gets or sets the earliest date that the user can select in the calendar.
                 *
                 * The default value for this property is **null**, which means no earliest
                 * date is defined.
                 *
                 * For details about using the {@link min} and {@link max} properties, please see the
                 * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    value = wijmo.asDate(value, true);
                    if (value != this.min) {
                        this._min = value;
                        this._syncProp(this, 'min');
                        this.refresh();
                        if (!this.value && value && value > this.displayMonth) { // TFS 467184
                            this.ensureVisible(value);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "max", {
                /**
                 * Gets or sets the latest date that the user can select in the calendar.
                 *
                 * The default value for this property is **null**, which means no latest
                 * date is defined.
                 *
                 * For details about using the {@link min} and {@link max} properties, please see the
                 * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    value = wijmo.asDate(value, true);
                    if (value != this.max) {
                        this._max = value;
                        this._syncProp(this, 'max');
                        this.refresh();
                        if (!this.value && value && value < this.displayMonth) { // TFS 467184
                            this.ensureVisible(value);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "selectionMode", {
                /**
                 * Gets or sets a value that determines whether users should be
                 * able to select days, day ranges, months, or no values at all.
                 *
                 * The default value for this property is **DateSelectionMode.Day**.
                 */
                get: function () {
                    return this._selMode;
                },
                set: function (value) {
                    var DSM = DateSelectionMode;
                    value = wijmo.asEnum(value, DSM);
                    if (value != this._selMode) {
                        // apply new setting
                        this._selMode = value;
                        // update monthView
                        if (this._mthMode()) {
                            this.monthView = false;
                        }
                        // initialize rangeEnd
                        this._rngEnd = value == DSM.Range
                            ? this._value // range mode: start with value
                            : null; // other modes: rangeEnd is always null
                        // refresh to show/hide the selection
                        this.refresh();
                        // apply new setting to all calendars
                        this._syncProp(this, 'selectionMode');
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "isReadOnly", {
                /**
                 * Gets or sets a value that determines whether users can modify
                 * the control value using the mouse and keyboard.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._readOnly;
                },
                set: function (value) {
                    this._readOnly = wijmo.asBoolean(value);
                    wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
                    this._syncProp(this, 'isReadOnly');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "handleWheel", {
                /**
                 * Gets or sets a value that determines whether the user can change
                 * the current {@link displayMonth} using the mouse wheel.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._handleWheel;
                },
                set: function (value) {
                    this._handleWheel = wijmo.asBoolean(value);
                    this._syncProp(this, 'handleWheel'); // TFS 470044
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "repeatButtons", {
                /**
                 * Gets or sets a value that determines whether the calendar buttons
                 * should act as repeat buttons, firing repeatedly as the button
                 * remains pressed.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return !this._rptUp.disabled;
                },
                set: function (value) {
                    this._rptUp.disabled = this._rptDn.disabled = !wijmo.asBoolean(value);
                    this._syncProp(this, 'repeatButtons');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "showYearPicker", {
                /**
                 * Gets or sets a value that determines whether the calendar should
                 * display a list of years when the user clicks the header element
                 * on the year calendar.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._yrPicker;
                },
                set: function (value) {
                    if (value != this._yrPicker) {
                        this._yrPicker = wijmo.asBoolean(value);
                        this._syncProp(this, 'showYearPicker');
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "showMonthPicker", {
                /**
                 * Gets or sets a value that determines whether the calendar should
                 * display a list of months when the user clicks the header element
                 * on the month calendar, and buttons for navigating to the next
                 * or previous months.
                 *
                 * The default value for this property is **ShowMonthPicker.FirstMonth**.
                 */
                get: function () {
                    return this._mtPicker;
                },
                set: function (value) {
                    if (value != this._mtPicker) {
                        // save new setting
                        var SMP = ShowMonthPicker;
                        if (wijmo.isBoolean(value)) {
                            value = value ? SMP.FirstMonth : SMP.None;
                        }
                        this._mtPicker = wijmo.asEnum(value, SMP);
                        // update class used to render buttons 'outside'
                        wijmo.toggleClass(this.hostElement, 'wj-btns-outside', this._getShowMonthPicker() == SMP.Outside);
                        // update the control
                        this.refresh();
                        this._syncProp(this, 'showMonthPicker');
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "firstDayOfWeek", {
                /**
                 * Gets or sets a value that represents the first day of the week,
                 * the one displayed in the first column of the calendar.
                 *
                 * The default value for this property is **null**, which causes
                 * the calendar to use the default for the current culture.
                 *
                 * In the English culture, the first day of the week is Sunday (0);
                 * in most European cultures, the first day of the week is Monday (1).
                 */
                get: function () {
                    return this._fdw;
                },
                set: function (value) {
                    if (value != this._fdw) {
                        value = wijmo.asNumber(value, true);
                        if (value && (value > 6 || value < 0)) {
                            throw 'firstDayOfWeek must be between 0 and 6 (Sunday to Saturday).';
                        }
                        this._fdw = value;
                        this.refresh();
                        this._syncProp(this, 'firstDayOfWeek');
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "displayMonth", {
                /**
                 * Gets or sets the month displayed in the calendar.
                 */
                get: function () {
                    return this._month;
                },
                set: function (value) {
                    // get new value as a Month
                    value = wijmo.asDate(value);
                    value = this._getMonth(value);
                    // clamp it // TFS 208757
                    var rng = this._getDisplayMonthRange();
                    if (rng.to && value > rng.to) {
                        value = rng.to;
                    }
                    if (rng.from && value < rng.from) {
                        value = rng.from;
                    }
                    // and set it
                    if (!wijmo.DateTime.equals(this.displayMonth, value)) {
                        this._month = value;
                        this.invalidate(true);
                        this.onDisplayMonthChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "monthCount", {
                /**
                 * Gets or sets the number of months to display within the calendar.
                 *
                 * The default value for this property is **1**.
                 *
                 * When you set this property to a value greater than 1, extra child
                 * calendars are added to the control displaying consecutive months.
                 *
                 * All calendars within the control are synchronized, so changing
                 * any property on the main calendar automatically updates all
                 * child calendars. This includes the {@link value}, {@link rangeEnd},
                 * and {@link selectionMode} properties.
                 *
                 * When multiple months are shown, the main control's host element
                 * gets a "wj-calendar-multimonth" class which is used in CSS to
                 * switch the display to "flex".
                 *
                 * The "flex" container is very versatile. You can limit the width
                 * of the outer control and have the months wrap horizontally or
                 * vertically, align the months within the main control, align and
                 * justify them, etc.
                 */
                get: function () {
                    var host = this.hostElement;
                    return host ? host.querySelectorAll('.wj-calendar').length + 1 : 0;
                },
                set: function (value) {
                    var _this = this;
                    var host = this.hostElement;
                    if (value != this.monthCount && host) {
                        var cals = host.querySelectorAll('.wj-calendar');
                        // sanity
                        value = wijmo.asInt(value, false);
                        wijmo.assert(value > 0, 'monthCount must be >= 1.');
                        wijmo.assert(value == 1 || !wijmo.closest(host.parentElement, '.wj-calendar'), 'Only top-level calendars can set monthCount.');
                        // remove old calendars
                        for (var i = 0; i < cals.length; i++) {
                            var cal = cals[i];
                            wijmo.removeChild(cal);
                            this._getCalendar(cal).dispose();
                        }
                        // add new calendars
                        this._cals = [this];
                        for (var i = 1; i < value; i++) {
                            // create the extra calendar
                            var cal = new Calendar(document.createElement('div'), {
                                itemFormatter: this.itemFormatter,
                                itemValidator: this.itemValidator,
                                formatItem: function (s, e) { return _this.onFormatItem(e); }
                            });
                            // copy main properties from this calendar (order matters here TFS 468120)
                            cal._selMode = this._selMode;
                            cal._value = this._value;
                            cal._rngEnd = this._rngEnd;
                            // copy other properties from this calendar
                            for (var prop in this) {
                                if (!/^(_.*|constructor|displayMonth|monthCount|hostElement|rightToLeft|isUpdating|isTouching)$/.test(prop)) {
                                    var val = this[prop];
                                    if (!wijmo.isFunction(val) && !(val instanceof wijmo.Event)) {
                                        cal[prop] = val;
                                    }
                                }
                            }
                            // add to host
                            this._cals.push(cal);
                            host.appendChild(cal.hostElement);
                        }
                        // update multi-month class (for styling and syncing)
                        wijmo.toggleClass(host, 'wj-calendar-multimonth', value > 1);
                        // synchronize displayMonth
                        this._syncProp(this, 'displayMonth');
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "formatYearMonth", {
                /**
                 * Gets or sets the format used to display the month and year
                 * above the calendar in month view.
                 *
                 * The default value for this property is **'y'**.
                 */
                get: function () {
                    return this._fmtYrMo;
                },
                set: function (value) {
                    if (value != this._fmtYrMo) {
                        this._fmtYrMo = wijmo.asString(value);
                        this._syncProp(this, 'formatYearMonth'); // WJM-19507
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "formatDayHeaders", {
                /**
                 * Gets or sets the format used to display the headers
                 * above the days in month view.
                 *
                 * The default value for this property is **'ddd'**.
                 */
                get: function () {
                    return this._fmtDayHdr;
                },
                set: function (value) {
                    if (value != this._fmtDayHdr) {
                        this._fmtDayHdr = wijmo.asString(value);
                        this._syncProp(this, 'formatDayHeaders'); // WJM-19507
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "formatDays", {
                /**
                 * Gets or sets the format used to display the days
                 * in month view.
                 *
                 * The default value for this property is 'd ' (the space after the 'd'
                 * prevents the format from being interpreted as 'd', the standard format
                 * used to represent the short date pattern).
                 */
                get: function () {
                    return this._fmtDay;
                },
                set: function (value) {
                    if (value != this._fmtDay) {
                        this._fmtDay = wijmo.asString(value);
                        this._syncProp(this, 'formatDays'); // WJM-19507
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "formatYear", {
                /**
                 * Gets or sets the format used to display the year
                 * above the months in year view.
                 *
                 * The default value for this property is **'yyyy'**.
                 */
                get: function () {
                    return this._fmtYr;
                },
                set: function (value) {
                    if (value != this._fmtYr) {
                        this._fmtYr = wijmo.asString(value);
                        this._syncProp(this, 'formatYear'); // WJM-19507
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "formatMonths", {
                /**
                 * Gets or sets the format used to display the months
                 * in year view.
                 *
                 * The default value for this property is **'MMM'**.
                 */
                get: function () {
                    return this._fmtMonths;
                },
                set: function (value) {
                    if (value != this._fmtMonths) {
                        this._fmtMonths = wijmo.asString(value);
                        this._syncProp(this, 'formatMonths'); // WJM-19507
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "showHeader", {
                /**
                 * Gets or sets a value that determines whether the control should
                 * display a header area with the current month and navigation buttons.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._tbHdr.style.display != 'none';
                },
                set: function (value) {
                    if (value != this.showHeader) {
                        this._tbHdr.style.display = wijmo.asBoolean(value) ? '' : 'none';
                        this._syncProp(this, 'showHeader');
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "monthView", {
                /**
                 * Gets or sets a value that determines whether the calendar should
                 * display a month view (one day per cell) or a year view (one month per cell).
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._tbMth.style.display != 'none';
                },
                set: function (value) {
                    if (value != this.monthView) {
                        this._tbMth.style.display = value ? '' : 'none';
                        this._tbYr.style.display = value ? 'none' : '';
                        this.refresh();
                        // update aria labels (prv/next month or year)
                        var labels = wijmo.culture.Calendar.ariaLabels;
                        wijmo.setAriaLabel(this._btnPrv, value ? labels.prvMo : labels.prvYr);
                        wijmo.setAriaLabel(this._btnTdy, value ? labels.today : labels.currMo);
                        wijmo.setAriaLabel(this._btnNxt, value ? labels.nxtMo : labels.nxtYr);
                        wijmo.setAriaLabel(this._btnMth, value ? labels.monthView : labels.yearView);
                        // apply new setting to all calendars
                        this._syncProp(this, 'monthView');
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "weeksBefore", {
                /**
                 * Gets or sets the number of weeks to show on the calendar
                 * before the current month.
                 *
                 * The default value for this property is **zero**.
                 */
                get: function () {
                    return this._wksBefore;
                },
                set: function (value) {
                    if (value != this._wksBefore) {
                        this._wksBefore = Math.floor(wijmo.asNumber(value, false, true));
                        this._syncProp(this, 'weeksBefore');
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "weeksAfter", {
                /**
                 * Gets or sets the number of weeks to show on the calendar
                 * after the current month.
                 *
                 * The default value for this property is **zero**.
                 */
                get: function () {
                    return this._wksAfter;
                },
                set: function (value) {
                    if (value != this._wksAfter) {
                        this._wksAfter = Math.floor(wijmo.asNumber(value, false, true));
                        this._syncProp(this, 'weeksAfter');
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "itemFormatter", {
                /**
                 * Gets or sets a formatter function to customize dates in the calendar.
                 *
                 * The formatter function can add any content to any date. It allows
                 * complete customization of the appearance and behavior of the calendar.
                 *
                 * If specified, the function takes two parameters:
                 * <ul>
                 *     <li>the date being formatted </li>
                 *     <li>the HTML element that represents the date</li>
                 * </ul>
                 *
                 * For example, the code below shows weekends with a yellow background:
                 * ```typescript
                 * calendar.itemFormatter = (date, element) => {
                 *     let day = date.getDay();
                 *     element.style.backgroundColor = (day == 0 || day == 6) ? 'yellow' : '';
                 * }
                 * ```
                 */
                get: function () {
                    return this._itemFormatter;
                },
                set: function (value) {
                    if (value != this._itemFormatter) {
                        this._itemFormatter = wijmo.asFunction(value);
                        this._syncProp(this, 'itemFormatter');
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "itemValidator", {
                /**
                 * Gets or sets a validator function to determine whether dates are valid for selection.
                 *
                 * If specified, the validator function should take one parameter representing the
                 * date to be tested, and should return false if the date is invalid and should not
                 * be selectable.
                 *
                 * For example, the code below shows weekends in a disabled state and prevents users
                 * from selecting those dates:
                 * ```typescript
                 * calendar.itemValidator = date => {
                 *     let weekday = date.getDay();
                 *     return weekday != 0 && weekday != 6;
                 * }
                 * ```
                 */
                get: function () {
                    return this._itemValidator;
                },
                set: function (value) {
                    if (value != this._itemValidator) {
                        this._itemValidator = wijmo.asFunction(value);
                        this._syncProp(this, 'itemValidator');
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the date at a given mouse position or represented
             * by a given HTML element.
             *
             * @param e Element to test.
             * @returns The date represented by the element, or null if the
             * element does not represent a date.
             */
            Calendar.prototype.hitTest = function (e) {
                var target = (e instanceof MouseEvent) ? e.target
                    : e instanceof Element ? e
                        : null;
                wijmo.assert(target != null, 'MouseEvent or Element expected');
                return target
                    ? target[Calendar._DATE_KEY]
                    : null;
            };
            /**
             * Adjusts the {@see displayMonth} value as needed to ensure
             * a given date is visible on the calendar.
             *
             * @param date Date to display.
             */
            Calendar.prototype.ensureVisible = function (date) {
                if (date != null) {
                    var arr = this._getCalendars(), index = arr.indexOf(this), firstCal = arr[0], lastCal = arr[arr.length - 1];
                    if (date < firstCal.displayMonth) {
                        this.displayMonth = wijmo.DateTime.addMonths(this._getMonth(date), index);
                    }
                    else if (date > lastCal.displayMonth) {
                        this.displayMonth = wijmo.DateTime.addMonths(this._getMonth(date), index - arr.length + 1);
                    }
                }
            };
            /**
             * Raises the {@link valueChanged} event.
             */
            Calendar.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
                this._syncProp(this, 'value');
            };
            /**
             * Raises the {@link rangeEndChanged} event.
             */
            Calendar.prototype.onRangeEndChanged = function (e) {
                this.rangeEndChanged.raise(this, e);
                this._syncProp(this, 'rangeEnd');
                if (this._value && this._rngEnd) {
                    this.onRangeChanged(e);
                }
            };
            /**
             * Raises the {@link rangeChanged} event.
             */
            Calendar.prototype.onRangeChanged = function (e) {
                this.rangeChanged.raise(this, e);
            };
            /**
             * Raises the {@link displayMonthChanged} event.
             */
            Calendar.prototype.onDisplayMonthChanged = function (e) {
                this.displayMonthChanged.raise(this, e);
                this._syncProp(this, 'displayMonth');
            };
            /**
             * Raises the {@link formatItem} event.
             *
             * @param e {@link FormatItemEventArgs} that contains the event data.
             */
            Calendar.prototype.onFormatItem = function (e) {
                this.formatItem.raise(this, e);
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** overrides
            // override to account for the year picker popup.
            // containsFocus(): boolean {
            //     return super.containsFocus() || this._lbYears.containsFocus();
            // }
            Calendar.prototype._containsFocusImpl = function (activeElement) {
                return _super.prototype._containsFocusImpl.call(this, activeElement) || this._lbYears._containsFocusImpl(activeElement);
            };
            // disconnect button repeaters, dispose of year picker
            Calendar.prototype.dispose = function () {
                this._rptUp.element = null;
                this._rptDn.element = null;
                this._lbYears.dispose();
                _super.prototype.dispose.call(this);
            };
            // refresh the control
            Calendar.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                var host = this.hostElement, hadFocus = this.containsFocus();
                // disposed?
                if (!host) {
                    return;
                }
                // call base class to suppress any pending invalidations
                _super.prototype.refresh.call(this, fullUpdate);
                // update content and selection
                if (fullUpdate) {
                    this._updateContent();
                }
                this._updateSelection();
                // update prev/next month buttons
                var rng = this._getDisplayMonthRange(), dm = this.displayMonth;
                wijmo.enable(this._btnPrv, rng.from == null || dm > rng.from);
                wijmo.enable(this._btnNxt, rng.to == null || dm < rng.to);
                // update focus/tabindex (TFS 433507)
                if (hadFocus) {
                    var tbl = this.monthView ? this._tbMth : this._tbYr, newFocus = (tbl.querySelector('td.wj-state-selected') || host);
                    if (newFocus) { // TFS 395995, 397780
                        newFocus.focus(); // always close year picker (TFS 350745)
                    }
                }
                // refresh extra months in multi-month calendars
                var cals = this._getCalendars();
                if (cals.length > 1 && this == cals[0]) {
                    cals.forEach(function (cal, index) {
                        if (index > 0) {
                            cal.refresh(fullUpdate);
                        }
                    });
                }
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // determines whether to show the month picker elements for this calendar
            Calendar.prototype._getShowMonthPicker = function () {
                var SMP = ShowMonthPicker, arr = this._getCalendars(), index = arr.indexOf(this), val = this.showMonthPicker;
                switch (val) {
                    case SMP.FirstMonth:
                    case SMP.Outside:
                        return index == 0 ? val : 0;
                    case SMP.LastMonth:
                        return index == arr.length - 1 ? val : 0;
                    case SMP.FirstAndLastMonths:
                        return index == 0 || index == arr.length - 1 ? val : 0;
                    case SMP.AllMonths:
                        return val;
                }
                return 0; // SMP.None
            };
            // gets the display month range limited by the control's min/max properties
            Calendar.prototype._getDisplayMonthRange = function () {
                var rng = {
                    from: null,
                    to: null
                };
                if (this.min || this.max) {
                    var arr = this._getCalendars(), index = arr.indexOf(this), dmStep = this._mthMode() ? wijmo.DateTime.addYears : wijmo.DateTime.addMonths;
                    if (this.min) {
                        rng.from = dmStep(this._getMonth(this.min), index);
                    }
                    if (this.max) {
                        rng.to = dmStep(this._getMonth(this.max), index - arr.length + 1);
                    }
                }
                return rng;
            };
            // gets the calendar control hosted in a given element
            Calendar.prototype._getCalendar = function (host) {
                return wijmo.Control.getControl(host);
            };
            // gets an array with all the calendars in a multi-month control
            Calendar.prototype._getCalendars = function () {
                var host = wijmo.closest(this.hostElement, '.wj-calendar-multimonth'), cal = host ? this._getCalendar(host) : this;
                return cal._cals;
            };
            // synchronize a property among all calendars
            Calendar.prototype._syncProp = function (src, prop) {
                var _this = this;
                if (!this._syncing) {
                    var arr_1 = this._getCalendars();
                    if (arr_1 && arr_1.length > 1) {
                        // adjust displayMonth value to refer to the first calendar
                        var value_1 = src[prop], dmStep_1 = this._mthMode() ? wijmo.DateTime.addYears : wijmo.DateTime.addMonths;
                        if (prop == 'displayMonth') {
                            value_1 = dmStep_1(value_1, -arr_1.indexOf(src));
                        }
                        // apply the new value to all calendars
                        arr_1[0].deferUpdate(function () {
                            _this._syncing = true;
                            arr_1.forEach(function (cal, index) {
                                if (cal != src) {
                                    var dm = cal.displayMonth;
                                    cal[prop] = prop == 'displayMonth' ? dmStep_1(value_1, index) : value_1;
                                    if (prop == 'value') {
                                        cal.displayMonth = dm;
                                        if (_this._rngMode()) {
                                            cal.rangeEnd = null;
                                        }
                                    }
                                }
                            });
                            _this._syncing = false;
                        });
                    }
                }
            };
            // update the content of the control
            Calendar.prototype._updateContent = function () {
                var month = this.displayMonth, fmt = wijmo.Globalize.format, dt = wijmo.DateTime, showMonthPicker = this._getShowMonthPicker();
                // update current display month (e.g. January 2014)
                wijmo.setText(this._spMth, fmt(month, this._fmtYrMo));
                // update month picker glyph and class
                var mthGlyph = this._btnMth.querySelector('.wj-glyph-down');
                if (mthGlyph) {
                    mthGlyph.style.display = (this._mthMode() || !showMonthPicker) ? 'none' : '';
                }
                // update month navigation buttons
                var btnGroup = wijmo.closest(this._btnTdy, '.wj-btn-group'); // TFS 466636
                if (btnGroup) {
                    btnGroup.style.display = (!showMonthPicker) ? 'none' : '';
                }
                // calculate first and last days of the month calendar
                var fdw = this._fdw != null ? this._fdw : wijmo.Globalize.getFirstDayOfWeek(), firstDay = dt.addDays(month, -(month.getDay() - fdw + 7) % 7), lastDay = dt.monthLast(month);
                // update week day headers (they are localizable)
                var cells = this._tbMth.querySelectorAll('td');
                for (var i = 0; i < 7 && i < cells.length; i++) {
                    var day_1 = dt.addDays(firstDay, i);
                    wijmo.setText(cells[i], fmt(day_1, this._fmtDayHdr));
                }
                // remove all weeks
                var weeks = this._tbMth.querySelectorAll('tr');
                for (var i = 1; i < weeks.length; i++) {
                    wijmo.removeChild(weeks[i]);
                }
                // add weeks before, on, and after this month
                var day = dt.addDays(firstDay, -7 * this._wksBefore);
                for (var i = 0; i < this._wksBefore; i++) {
                    day = this._addWeek(day, 'wj-week-before');
                }
                while (day <= lastDay) {
                    day = this._addWeek(day);
                }
                for (var i = 0; i < this._wksAfter; i++) {
                    day = this._addWeek(day, 'wj-week-after');
                }
                // update year calendar
                cells = this._tbYr.querySelectorAll('td');
                if (cells.length) {
                    wijmo.setText(cells[0], fmt(month, this._fmtYr));
                }
                for (var i = 1; i < cells.length; i++) {
                    day = dt.newDate(month.getFullYear(), i - 1, 1);
                    var cell = cells[i], invalid = !this._monthInValidRange(day);
                    cell[Calendar._DATE_KEY] = day;
                    wijmo.setText(cell, fmt(day, this._fmtMonths));
                    wijmo.toggleClass(cell, 'wj-state-disabled', invalid);
                    wijmo.setAriaLabel(cell, wijmo.Globalize.format(day, 'MMMM yyyy')); // accessibility
                }
            };
            // update the selected state for days and months
            Calendar.prototype._updateSelection = function () {
                var key = Calendar._DATE_KEY, dt = wijmo.DateTime;
                // update day cells
                var cells = this._tbMth.querySelectorAll('td');
                for (var i = 7; i < cells.length; i++) {
                    var cell = cells[i], day = cell[key], value = this.value, rngEnd = this.rangeEnd, selected = this._selMode && value != null && dt.sameDate(day, value), // TFS 469114
                    selLast = this._selMode && value != null && dt.sameDate(day, rngEnd), selMulti = this._selMode && value != null && day > value && rngEnd != null && day <= rngEnd;
                    wijmo.toggleClass(cell, 'wj-state-selected', selected);
                    wijmo.toggleClass(cell, 'wj-state-multi-selected', selMulti);
                    wijmo.toggleClass(cell, 'wj-state-last-selected', selLast);
                    wijmo.setAttribute(cell, 'aria-selected', selected ? true : null);
                    this._customizeCell(i, day, cell);
                }
                // update month cells
                cells = this._tbYr.querySelectorAll('td');
                for (var i = 0; i < cells.length; i++) {
                    var cell = cells[i], day = cell[key], selected = this._sameMonth(day, this.value);
                    wijmo.toggleClass(cell, 'wj-state-selected', selected);
                    wijmo.setAttribute(cell, 'aria-selected', selected ? true : null);
                }
            };
            // adds a week to the month calendar
            Calendar.prototype._addWeek = function (start, className) {
                var week = this._createElement('tr', this._tbMth, className), dt = wijmo.DateTime;
                for (var i = 0; i < 7; i++) {
                    // create the cell
                    var cell = this._createElement('td', week), day = dt.addDays(start, i);
                    cell[Calendar._DATE_KEY] = day;
                    wijmo.setText(cell, wijmo.Globalize.format(day, this._fmtDay));
                    wijmo.setAriaLabel(cell, wijmo.Globalize.format(day, 'D')); // accessibility
                    // add classes and attributes
                    var invalid = !this._valid(day), weekDay = day.getDay(), otherMonth = day.getMonth() != this.displayMonth.getMonth();
                    wijmo.toggleClass(cell, 'wj-day-today', dt.sameDate(day, dt.newDate()));
                    wijmo.toggleClass(cell, 'wj-day-weekend', weekDay == 0 || weekDay == 6);
                    wijmo.toggleClass(cell, 'wj-day-othermonth', otherMonth || !this._inValidRange(day) || invalid);
                    wijmo.toggleClass(cell, 'wj-state-invalid', invalid);
                }
                return dt.addDays(start, 7);
            };
            // customize the cell
            Calendar.prototype._customizeCell = function (index, day, cell) {
                if (wijmo.isFunction(this.itemFormatter)) {
                    this.itemFormatter(day, cell);
                }
                if (this.formatItem.hasHandlers) {
                    var e = new input.FormatItemEventArgs(index, day, cell);
                    this.onFormatItem(e);
                }
            };
            // checks whether the control can change the current value
            Calendar.prototype._canChangeValue = function () {
                return !this._readOnly && this._selMode != DateSelectionMode.None;
            };
            // check whether a date should be selectable by the user
            Calendar.prototype._valid = function (date) {
                if (!wijmo.isDate(date) || !wijmo.DateTime.sameDate(date, this._clamp(date))) {
                    return false; // wrong type, out of range
                }
                if (wijmo.isFunction(this.itemValidator)) {
                    return this.itemValidator(date); // custom validation
                }
                return true; // seems valid
            };
            // check whether a day is within the valid range
            Calendar.prototype._inValidRange = function (date) {
                var fdt = wijmo.DateTime.fromDateTime;
                if (this.min && date < fdt(this.min, date))
                    return false;
                if (this.max && date > fdt(this.max, date))
                    return false;
                return true;
            };
            // check whether a month contains days in the valid range
            // get the month's first and last days, then test whether
            // the min is after the last or the max is before the first
            // to detect invalid months (TFS 221061)
            Calendar.prototype._monthInValidRange = function (month) {
                if (this.min || this.max) {
                    var y = month.getFullYear(), m = month.getMonth(), dt = wijmo.DateTime, first = dt.newDate(y, m, 1), last = dt.newDate(y, m + 1, 0); // TFS 276518
                    if (this.min && this.min > last)
                        return false;
                    if (this.max && this.max < first)
                        return false;
                }
                return true;
            };
            // checks whether a date is in the current month
            Calendar.prototype._sameMonth = function (date, month) {
                return wijmo.isDate(date) && wijmo.isDate(month) &&
                    date.getMonth() == month.getMonth() &&
                    date.getFullYear() == month.getFullYear();
            };
            // gets the first or last valid dates within a given month
            Calendar.prototype._getValidDate = function (month, first) {
                // find valid date within the given month
                if (wijmo.isDate(month)) {
                    // select first/last day of the month
                    var yr = month.getFullYear(), mo = month.getMonth() + (first ? 0 : 1), day = first ? 1 : 0, dt = wijmo.DateTime, value = dt.newDate(yr, mo, day), step = first ? +1 : -1;
                    // skip over invalid dates
                    for (var cnt = 0; cnt < 31; cnt++) {
                        if (this._valid(value)) {
                            return value;
                        }
                        value = dt.addDays(value, step);
                    }
                }
                return null;
            };
            // honor min/max range (keeping the time)
            Calendar.prototype._clamp = function (value) {
                if (value) {
                    var fdt = wijmo.DateTime.fromDateTime;
                    if (this.min) {
                        var min = fdt(this.min, value);
                        if (value < min) {
                            value = min;
                        }
                    }
                    if (this.max) {
                        var max = fdt(this.max, value);
                        if (value > max) {
                            value = max;
                        }
                    }
                }
                return value;
            };
            // create child elements
            Calendar.prototype._createChildren = function () {
                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-calendar', tpl, {
                    _tbHdr: 'tbl-header',
                    _btnMth: 'btn-month',
                    _spMth: 'span-month',
                    _btnPrv: 'btn-prev',
                    _btnTdy: 'btn-today',
                    _btnNxt: 'btn-next',
                    _tbMth: 'tbl-month',
                    _tbYr: 'tbl-year'
                });
                // set styles in code (to avoid CSP issues)
                this._tbYr.style.display = 'none';
                // label button elements
                var labels = wijmo.culture.Calendar.ariaLabels;
                wijmo.setAriaLabel(this._tbMth, labels.calendar);
                wijmo.setAriaLabel(this._tbYr, labels.calendar);
                wijmo.setAriaLabel(this._btnPrv, labels.calendar);
                wijmo.setAriaLabel(this._btnMth, labels.monthView);
                wijmo.setAriaLabel(this._btnPrv, labels.prvMo);
                wijmo.setAriaLabel(this._btnTdy, labels.today);
                wijmo.setAriaLabel(this._btnNxt, labels.nxtMo);
                // add header cells to month calendar
                var tr = this._createElement('tr', this._tbMth, 'wj-header');
                for (var d = 0; d < 7; d++) { // day headers
                    this._createElement('td', tr);
                }
                // populate year calendar
                tr = this._createElement('tr', this._tbYr, 'wj-header');
                this._createElement('td', tr).setAttribute('colspan', '4');
                for (var i = 0; i < 3; i++) {
                    tr = this._createElement('tr', this._tbYr);
                    for (var j = 0; j < 4; j++) {
                        this._createElement('td', tr);
                    }
                }
            };
            // create year picker
            Calendar.prototype._createYearPicker = function () {
                var _this = this;
                var host = this.hostElement, lbHost = this._createElement('div', null, 'wj-dropdown-panel wj-yearpicker');
                lbHost.tabIndex = this._orgTabIndex;
                this._lbYears = new input.ListBox(lbHost, {
                    lostFocus: function (s) {
                        wijmo.hidePopup(lbHost);
                        _this._tmYrHidden = Date.now();
                        _this.removeEventListener(window, 'touchstart');
                        if (s.selectedIndex > -1) {
                            var dm = wijmo.DateTime.clone(_this.displayMonth);
                            dm.setFullYear(s.selectedIndex + s.itemsSource[0]);
                            _this.displayMonth = dm;
                        }
                    }
                });
                this.addEventListener(lbHost, 'keydown', function (e) {
                    switch (e.keyCode) {
                        case wijmo.Key.Enter:
                            host.focus();
                            break;
                        case wijmo.Key.Escape:
                            _this._lbYears.selectedIndex = -1;
                            host.focus();
                            break;
                    }
                    if (e.defaultPrevented) {
                        e.stopPropagation(); // TFS 344829, bootstrap issue
                    }
                });
                this.addEventListener(lbHost, 'click', function (e) {
                    host.focus();
                });
            };
            // create an element, set its class name, append it to another element
            Calendar.prototype._createElement = function (tag, parent, className) {
                var el = document.createElement(tag);
                if (className) {
                    wijmo.addClass(el, className);
                }
                if (parent) {
                    parent.appendChild(el);
                }
                return el;
            };
            // handle clicks on the calendar
            Calendar.prototype._click = function (e) {
                var _this = this;
                // start actions on left button only: TFS 114623
                if (!e.defaultPrevented && e.button == 0) {
                    // get element that was clicked
                    var handled = false, target = e.target;
                    // switch month/year view
                    if (wijmo.contains(this._btnMth, target) && !this._mthMode() && this._getShowMonthPicker()) {
                        this.monthView = !this.monthView;
                        handled = true;
                    }
                    // navigate month/year
                    else if (wijmo.contains(this._btnPrv, target)) {
                        this._navigate(-1);
                        handled = true;
                    }
                    else if (wijmo.contains(this._btnNxt, target)) {
                        this._navigate(+1);
                        handled = true;
                    }
                    else if (wijmo.contains(this._btnTdy, target)) {
                        this._navigate(0);
                        handled = true;
                    }
                    // show year picker
                    if (target && !handled && this._yrPicker) {
                        if (wijmo.contains(this._tbYr, target) && wijmo.closest(target, '.wj-header')) {
                            // don't show twice when closing with click (TFS 350575)
                            if (Date.now() - this._tmYrHidden < 600) {
                                e.preventDefault();
                                return;
                            }
                            // get valid years
                            var baseYear = this.displayMonth.getFullYear(), min = this.min ? this.min.getFullYear() : baseYear - 100, max = this.max ? this.max.getFullYear() : baseYear + 100, years = [];
                            for (var year = min; year <= max; year++) {
                                years.push(year);
                            }
                            // show the popup
                            var lb_1 = this._lbYears, lbHost_1 = lb_1.hostElement, hdr = wijmo.closest(target, '.wj-header'), host = this.hostElement, cssHost = wijmo.closest(host, '.wj-inputdate-dropdown') || host;
                            lb_1.itemsSource = years;
                            lb_1.selectedIndex = baseYear - years[0];
                            wijmo.setAttribute(lbHost_1, 'dir', this.rightToLeft ? 'rtl' : null);
                            wijmo.setCss(lbHost_1, {
                                minWidth: '',
                                width: hdr.offsetWidth
                            });
                            wijmo.showPopup(lbHost_1, hdr, false, false, cssHost); // TFS 345197
                            requestAnimationFrame(function () {
                                lb_1.showSelection(true);
                            });
                            //lb.focus();
                            // work around Safari/IOS bug (TFS 321525, 349367)
                            // https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile
                            this.addEventListener(window, 'touchstart', function (e) {
                                if (!wijmo.contains(lbHost_1, e.target)) {
                                    wijmo.hidePopup(lbHost_1);
                                    _this._tmYrHidden = Date.now();
                                    _this.removeEventListener(window, 'touchstart');
                                }
                            });
                            // done (don't fall through to avoid returning the focus to the calendar)
                            e.preventDefault();
                            return;
                        }
                    }
                    // select day/month
                    if (target && !handled) {
                        var td = wijmo.closest(target, 'td');
                        if (td) {
                            var dtCell = this.hitTest(td), fdt = wijmo.DateTime.fromDateTime;
                            if (this.monthView) {
                                if (dtCell && this._canChangeValue()) {
                                    var value = fdt(dtCell, this._value);
                                    if (this._inValidRange(value) && this._valid(value)) {
                                        if (this._rngMode() && this.value && !this.rangeEnd && value >= this.value) {
                                            this.rangeEnd = value; // apply new rangeEnd
                                        }
                                        else {
                                            this.value = value; // apply new value
                                        }
                                    }
                                    handled = true;
                                }
                            }
                            else {
                                if (dtCell) {
                                    this.displayMonth = dtCell;
                                    if (this._mthMode()) {
                                        if (this._canChangeValue()) {
                                            var value = fdt(this.displayMonth, this.value);
                                            if (this._inValidRange(value)) {
                                                this.value = value;
                                            }
                                        }
                                    }
                                    else {
                                        this.monthView = true;
                                    }
                                    handled = true;
                                }
                            }
                        }
                    }
                    // if we handled the mouse, prevent browser from seeing it
                    if (handled) {
                        e.preventDefault();
                        this.focus();
                    }
                }
            };
            // handle keyboard events
            Calendar.prototype._keydown = function (e) {
                // honor defaultPrevented
                if (e.defaultPrevented)
                    return;
                // alt up/down: open/close popup
                if (e.altKey) {
                    switch (e.keyCode) {
                        case wijmo.Key.Up:
                        case wijmo.Key.Down:
                            return;
                        case wijmo.Key.End: // alt End: today's date
                            this._navigate(0);
                            e.preventDefault();
                            return;
                    }
                }
                // not interested in meta keys
                if (e.ctrlKey || e.metaKey || (e.shiftKey && !this._rngMode())) {
                    return;
                }
                // perform date navigation
                var keyCode = this._getKeyCode(e), addDays = 0, addMonths = 0, handled = true;
                // add/subtract days/weeks/months
                if (this.monthView) { // add days
                    switch (keyCode) {
                        case wijmo.Key.Left:
                            addDays = -1;
                            break;
                        case wijmo.Key.Right:
                            addDays = +1;
                            break;
                        case wijmo.Key.Up:
                            addDays = -7;
                            break;
                        case wijmo.Key.Down:
                            addDays = +7;
                            break;
                        case wijmo.Key.PageDown:
                            addMonths = e.altKey ? +12 : +1; // year/month
                            break;
                        case wijmo.Key.PageUp:
                            addMonths = e.altKey ? -12 : -1; // year/month
                            break;
                        case wijmo.Key.Home: // min/first of the month
                        case wijmo.Key.End: // max/last of the month
                            if (this._canChangeValue() && !e.shiftKey) {
                                var month = this.value || this.displayMonth, // TFS 343324
                                dt = this._getValidDate(month, keyCode == wijmo.Key.Home);
                                if (dt) {
                                    this.value = wijmo.DateTime.fromDateTime(dt, this.value);
                                    this._rngEnd = null;
                                }
                            }
                            break;
                        default:
                            handled = false;
                            break;
                    }
                }
                else { // add months
                    switch (keyCode) {
                        case wijmo.Key.Left:
                            addMonths = -1;
                            break;
                        case wijmo.Key.Right:
                            addMonths = +1;
                            break;
                        case wijmo.Key.Up:
                            addMonths = -4;
                            break;
                        case wijmo.Key.Down:
                            addMonths = +4;
                            break;
                        case wijmo.Key.PageDown:
                            addMonths = e.altKey ? +120 : +12; // decade/year
                            break;
                        case wijmo.Key.PageUp:
                            addMonths = e.altKey ? -120 : -12; // decade/year
                            break;
                        case wijmo.Key.Home: // jan
                            addMonths = this.value ? -this.value.getMonth() : 0;
                            break;
                        case wijmo.Key.End: // dec
                            addMonths = this.value ? 11 - this.value.getMonth() : 0;
                            break;
                        case wijmo.Key.Enter: // back to month view
                            if (!this._mthMode()) {
                                this.monthView = true;
                            }
                            else {
                                handled = false;
                            }
                            break;
                        default:
                            handled = false;
                            break;
                    }
                }
                // apply the change
                if (this._canChangeValue() && (addDays || addMonths)) {
                    // selecting or extending
                    var value = e.shiftKey && this.rangeEnd != null
                        ? this.rangeEnd
                        : this.value;
                    // add days/months
                    var dt = wijmo.DateTime;
                    if (value) {
                        value = dt.addDays(value, addDays);
                        value = dt.addMonths(value, addMonths);
                    }
                    else {
                        value = this._getValidDate(new Date(), true);
                    }
                    // skip over invalid dates when skipping months (TFS 299440)
                    if (addMonths && !this._valid(value)) {
                        var month = value.getMonth();
                        for (var cnt = 1; cnt < 31 && !this._valid(value); cnt++) {
                            var dt1 = dt.addDays(value, +cnt), dt2 = dt.addDays(value, -cnt);
                            if (this._valid(dt1) && dt1.getMonth() == month) {
                                value = dt1;
                            }
                            else if (this._valid(dt2) && dt2.getMonth() == month) {
                                value = dt2;
                            }
                        }
                    }
                    // skip over invalid dates (TFS 223913)
                    for (var cnt = 0; cnt < 31 && !this._valid(value); cnt++) {
                        value = dt.addDays(value, addDays > 0 || addMonths > 0 ? +1 : -1);
                    }
                    // set the new value
                    if (e.shiftKey && value > this.value) {
                        this.rangeEnd = value;
                    }
                    else {
                        this.value = value;
                    }
                }
                // if we handled the key, prevent browser from seeing it
                if (handled) {
                    e.preventDefault();
                }
            };
            // gets the month being displayed in the calendar
            Calendar.prototype._getMonth = function (date) {
                var dt = wijmo.DateTime;
                date = date || dt.newDate();
                return dt.newDate(date.getFullYear(), date.getMonth(), 1);
            };
            // returns true in month selection mode
            /*internal*/ Calendar.prototype._mthMode = function () {
                return this.selectionMode == DateSelectionMode.Month;
            };
            // returns true in range selection mode
            /*internal*/ Calendar.prototype._rngMode = function () {
                return this.selectionMode == DateSelectionMode.Range;
            };
            // change display month by a month or a year, or skip to the current
            Calendar.prototype._navigate = function (skip) {
                var monthView = this.monthView, dispMonth = this.displayMonth, dt = wijmo.DateTime;
                switch (skip) {
                    // today/this month
                    case 0:
                        var today = dt.newDate();
                        if (this._canChangeValue()) {
                            if (monthView) {
                                this.value = dt.fromDateTime(today, this.value); // select today's date
                            }
                            else { // year view
                                this.value = this._getMonth(today); // select today's month
                            }
                        }
                        dispMonth = this._getMonth(today); // show today's month
                        break;
                    // show next month/year (keeping current value)
                    case +1:
                        dispMonth = dt.addMonths(dispMonth, monthView ? +1 : +12);
                        break;
                    // show previous month/year (keeping current value)
                    case -1:
                        dispMonth = dt.addMonths(dispMonth, monthView ? -1 : -12);
                        break;
                }
                // apply new displayMonth
                this.displayMonth = dispMonth;
            };
            Calendar._DATE_KEY = '$WJ-DATE'; // key used to store date in calendar elements
            /**
             * Gets or sets the template used to instantiate {@link Calendar} controls.
             */
            Calendar.controlTemplate = '<div class="wj-content wj-calendar-outer">' +
                '<div wj-part="tbl-header" class="wj-calendar-header">' +
                '<div wj-part="btn-month" class="wj-month-select" role="button">' +
                '<span wj-part="span-month"></span> <span class="wj-glyph-down"></span>' +
                '</div>' +
                '<div class="wj-btn-group">' +
                '<button wj-part="btn-prev" class="wj-btn wj-btn-default" tabindex="-1"><span class="wj-glyph-left"></span></button>' +
                '<button wj-part="btn-today" class="wj-btn wj-btn-default" tabindex="-1"><span class="wj-glyph-circle"></span></button>' +
                '<button wj-part="btn-next" class="wj-btn wj-btn-default" tabindex="-1"><span class="wj-glyph-right"></span></button>' +
                '</div>' +
                '</div>' +
                '<table wj-part="tbl-month" class="wj-calendar-month" role="grid"></table>' +
                '<table wj-part="tbl-year" class="wj-calendar-year" role="grid"></table>' +
                '</div>';
            return Calendar;
        }(wijmo.Control));
        input.Calendar = Calendar;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        // globalization info
        wijmo._addCultureInfo('DropDown', {
            ariaLabels: {
                tgl: 'Toggle Dropdown'
            }
        });
        /**
         * Specifies constants that define the action to perform when the
         * user clicks the input element in the control.
         */
        var ClickAction;
        (function (ClickAction) {
            /** Selects the input element content. */
            ClickAction[ClickAction["Select"] = 0] = "Select";
            /** Open the drop-down. */
            ClickAction[ClickAction["Open"] = 1] = "Open";
            /** Toggle the drop-down. */
            ClickAction[ClickAction["Toggle"] = 2] = "Toggle";
        })(ClickAction = input.ClickAction || (input.ClickAction = {}));
        /**
         * DropDown control (abstract).
         *
         * Contains an input element and a button used to show or hide the drop-down.
         *
         * Derived classes must override the _createDropDown method to create whatever
         * editor they want to show in the drop down area (a list of items, a calendar,
         * a color editor, etc).
         */
        var DropDown = /** @class */ (function (_super) {
            __extends(DropDown, _super);
            /**
             * Initializes a new instance of the {@link DropDown} class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function DropDown(element, options) {
                var _this = _super.call(this, element) || this;
                // property storage
                _this._clickAction = ClickAction.Select;
                _this._showBtn = true;
                _this._autoExpand = true;
                _this._animate = false;
                // private stuff
                _this._oldText = '';
                // ** events
                /**
                 * Occurs when the value of the {@link text} property changes.
                 */
                _this.textChanged = new wijmo.Event();
                /**
                 * Occurs before the drop down is shown or hidden.
                 */
                _this.isDroppedDownChanging = new wijmo.Event();
                /**
                 * Occurs after the drop down is shown or hidden.
                 */
                _this.isDroppedDownChanged = new wijmo.Event();
                // instantiate and apply template
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-control wj-content wj-dropdown', tpl, {
                    _tbx: 'input',
                    _btn: 'btn',
                    _dropDown: 'dropdown'
                }, 'input');
                // set styles in code (to avoid CSP issues)
                _this._dropDown.style.display = 'none';
                // label button element
                var labels = wijmo.culture.DropDown.ariaLabels;
                wijmo.setAriaLabel(_this._btn.querySelector('button'), labels.tgl);
                // set reference element (used for positioning the drop-down)
                var tbx = _this._elRef = _this._tbx;
                // disable autocomplete/correct/capitalize
                // (important for mobile browsers including Chrome/ Android)
                // https://davidwalsh.name/disable-autocorrect
                wijmo.disableAutoComplete(tbx);
                // create drop-down element, update button display
                _this._createDropDown();
                _this._updateBtn();
                // start collapsed
                var host = _this.hostElement;
                wijmo.addClass(host, 'wj-state-collapsed');
                // reposition dropdown when window size changes
                _this.addEventListener(window, 'resize', function () {
                    if (_this.isDroppedDown /* && !this.isTouching */) { // TFS 429764
                        _this.invalidate();
                    }
                });
                // update focus state when the drop-down gets or loses focus
                var dropDown = _this.dropDown, addListener = _this.addEventListener.bind(_this), fs = _this._updateFocusState.bind(_this); // TFS 153367
                addListener(dropDown, 'blur', fs, true);
                addListener(dropDown, 'focus', fs);
                // keyboard events (the same handlers are used for the control and for the drop-down)
                var kd = _this._keydown.bind(_this);
                addListener(host, 'keydown', kd);
                addListener(dropDown, 'keydown', kd);
                var kp = _this._keypress.bind(_this);
                addListener(host, 'keypress', kp, true);
                addListener(dropDown, 'keypress', kp, true);
                // textbox events
                addListener(tbx, 'input', function () {
                    _this._setText(_this.text, false);
                });
                addListener(tbx, 'blur', function () {
                    // commit text immediately (no timeOut: TFS 354382)
                    // prevent from setting focus back to input (WJM-19943)
                    _this._commitText(true);
                }, true);
                addListener(tbx, 'click', function () {
                    if (_this._autoExpand) {
                        _this._expandSelection(); // expand the selection to the whole number/word that was clicked
                    }
                });
                // honor the clickAction property
                addListener(tbx, 'mousedown', function (e) {
                    switch (_this._clickAction) {
                        case ClickAction.Open:
                            if (!_this.isDroppedDown) {
                                e.preventDefault();
                                _this.focus();
                                _this.isDroppedDown = true;
                            }
                            break;
                        case ClickAction.Toggle:
                            e.preventDefault();
                            _this.focus();
                            _this.isDroppedDown = !_this.isDroppedDown;
                            break;
                    }
                });
                // toggle the drop-down on mousedown (used to be on click)
                addListener(_this._btn, 'mousedown', function (e) {
                    _this._btnclick(e);
                });
                // remove drop-down from DOM (so IE/Edge can print properly)
                // NOTE: this causes some accessibility warnings
                wijmo.removeChild(dropDown);
                // workaround for IE bug (TFS 343324, 327660)
                // it gives the focus to the input element when the mouse goes up
                // after clicking one of the drop-down buttons
                if (wijmo.isIE() && _this._elRef == _this._tbx) {
                    addListener(host, 'mouseup', function (e) {
                        if (!e.defaultPrevented && e.button == 0) {
                            if (wijmo.hasClass(e.target, 'wj-btn')) { // any drop-down button
                                var ae_1 = wijmo.getActiveElement(); // save focus
                                if (ae_1 && ae_1 != e.target) {
                                    setTimeout(function () {
                                        ae_1.focus(); // restore focus
                                    });
                                }
                            }
                        }
                    });
                }
                // IE 9 does not fire an input event when the user removes characters
                // from input filled by keyboard, cut, or drag operations.
                // https://developer.mozilla.org/en-US/docs/Web/Events/input
                // so subscribe to keyup and set the text just in case (TFS 111189)
                if (wijmo.isIE9()) {
                    addListener(tbx, 'keyup', function () {
                        _this._setText(_this.text, false);
                    });
                }
                // stop propagation of click events on the drop-down element
                // they are not children of the hostElement, which can confuse Bootstrap popups
                addListener(dropDown, 'click', _this._dropDownClick.bind(_this));
                return _this;
            }
            Object.defineProperty(DropDown.prototype, "text", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the text shown on the control.
                 */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._setText(value, true);
                        this._commitText();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "inputElement", {
                /**
                 * Gets the HTML input element hosted by the control.
                 *
                 * Use this property in situations where you want to customize the
                 * attributes of the input element.
                 */
                get: function () {
                    return this._tbx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "inputType", {
                /**
                 * Gets or sets the "type" attribute of the HTML input element hosted
                 * by the control.
                 *
                 * The default value for this property is **'text'**.
                 */
                get: function () {
                    return this._tbx.type;
                },
                set: function (value) {
                    this._tbx.type = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "isReadOnly", {
                /**
                 * Gets or sets a value that indicates whether the user can modify
                 * the control value using the mouse and keyboard.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._tbx.readOnly;
                },
                set: function (value) {
                    this._tbx.readOnly = wijmo.asBoolean(value);
                    wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "isRequired", {
                /**
                 * Gets or sets a value that determines whether the control value must be
                 * set to a non-null value or whether it can be set to null
                 * (by deleting the content of the control).
                 *
                 * This property defaults to true for most controls, including {@link ComboBox},
                 * {@link InputDate}, {@link InputTime}, {@link InputDateTime}, and {@link InputColor}.
                 * It defaults to false for the {@link AutoComplete} control.
                 */
                get: function () {
                    return this._tbx.required;
                },
                set: function (value) {
                    this._tbx.required = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "placeholder", {
                /**
                 * Gets or sets the string shown as a hint when the control is empty.
                 */
                get: function () {
                    return this._tbx.placeholder;
                },
                set: function (value) {
                    this._tbx.placeholder = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "clickAction", {
                /**
                 * Gets or sets a value that specifies the action to perform when the
                 * user clicks the input element in the control.
                 *
                 * For most drop-down controls, this property is set to {@link ClickAction.Select}
                 * by default. This setting allows users to select portions of the text with the mouse.
                 *
                 * For drop-down controls that display non-editable text (such as the {@link MultiSelect}),
                 * this property is set to {@link ClickAction.Toggle} by default.
                 */
                get: function () {
                    return this._clickAction;
                },
                set: function (value) {
                    this._clickAction = wijmo.asEnum(value, ClickAction);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "isDroppedDown", {
                /**
                 * Gets or sets a value that indicates whether the drop down is currently
                 * visible.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    var dd = this._dropDown;
                    return dd && dd.style.display != 'none';
                },
                set: function (value) {
                    var _this = this;
                    var host = this.hostElement, dd = this._dropDown, hadFocus = this.containsFocus();
                    // sanity...
                    if (!host || !dd) {
                        return;
                    }
                    // get new value and apply it
                    value = wijmo.asBoolean(value) && !this.isDisabled && !this.isReadOnly && host.offsetWidth > 0; // TFS 444315
                    if (value != this.isDroppedDown && this.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                        if (value) {
                            // save minWidth when showing
                            this._minWidthDropdown = dd.style.minWidth;
                            // show drop-down
                            dd.style.display = ''; //'block'; // TFS 467610
                            this._updateDropDown();
                            // work around Safari/IOS bug (TFS 321525)
                            // https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile
                            this.addEventListener(window, 'touchstart', function (e) {
                                // touched this control, ignore event
                                for (var target = e.target; target;) {
                                    if (target == host) {
                                        return;
                                    }
                                    target = target[wijmo.Control._OWNR_KEY] || target.parentNode; // TFS 338519
                                }
                                // touched something else, close this
                                wijmo.Control._touching = true;
                                _this.isDroppedDown = false;
                                wijmo.Control._touching = false;
                            });
                        }
                        else {
                            // work around Safari/IOS bug (TFS 321525)
                            // https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile
                            this.removeEventListener(window, 'touchstart');
                            // hide drop-down
                            wijmo.hidePopup(dd);
                            // restore minWidth after hiding
                            dd.style.minWidth = this._minWidthDropdown;
                        }
                        // update focus
                        if (hadFocus) {
                            if (!this.isTouching || !this.showDropDownButton) {
                                this.selectAll();
                            }
                            else {
                                host.focus();
                            }
                        }
                        this._updateFocusState();
                        // done
                        wijmo.toggleClass(host, 'wj-state-collapsed', !this.isDroppedDown);
                        this.onIsDroppedDownChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "dropDown", {
                /**
                 * Gets the drop down element shown when the {@link isDroppedDown}
                 * property is set to true.
                 */
                get: function () {
                    return this._dropDown;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "dropDownCssClass", {
                /**
                 * Gets or sets a CSS class name to add to the control's drop-down element.
                 *
                 * This property is useful when styling the drop-down element, because it is
                 * shown as a child of the document body rather than as a child of the control
                 * itself, which prevents using CSS selectors based on the parent control.
                 */
                get: function () {
                    return this._cssClass;
                },
                set: function (value) {
                    if (value != this._cssClass) {
                        wijmo.removeClass(this._dropDown, this._cssClass);
                        this._cssClass = wijmo.asString(value);
                        wijmo.addClass(this._dropDown, this._cssClass);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "showDropDownButton", {
                /**
                 * Gets or sets a value that indicates whether the control should
                 * display a drop-down button.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._showBtn;
                },
                set: function (value) {
                    this._showBtn = wijmo.asBoolean(value);
                    this._updateBtn();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "autoExpandSelection", {
                /**
                 * Gets or sets a value that indicates whether the control should
                 * automatically expand the selection to whole words/numbers when
                 * the control is clicked.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._autoExpand;
                },
                set: function (value) {
                    this._autoExpand = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "isAnimated", {
                /**
                 * Gets or sets a value that indicates whether the control should use a fade-in animation
                 * when displaying the drop-down.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._animate;
                },
                set: function (value) {
                    this._animate = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Sets the focus to the control and selects all its content.
             */
            DropDown.prototype.selectAll = function () {
                var tbx = this._tbx;
                if (this._elRef == tbx) {
                    wijmo.setSelectionRange(tbx, 0, this.text.length);
                }
                if (!this.containsFocus()) { // TFS 299776, 243195
                    this.focus();
                }
            };
            /**
             * Raises the {@link textChanged} event.
             */
            DropDown.prototype.onTextChanged = function (e) {
                this.textChanged.raise(this, e);
                this._updateState();
            };
            /**
             * Raises the {@link isDroppedDownChanging} event.
             */
            DropDown.prototype.onIsDroppedDownChanging = function (e) {
                this.isDroppedDownChanging.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link isDroppedDownChanged} event.
             */
            DropDown.prototype.onIsDroppedDownChanged = function (e) {
                this.isDroppedDownChanged.raise(this, e);
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** overrides
            // transfer focus from control to textbox
            // (but don't show the soft keyboard when the user touches the drop-down button)
            DropDown.prototype.onGotFocus = function (e) {
                if (!this.isTouching && !wijmo.contains(this._dropDown, wijmo.getActiveElement())) {
                    this.selectAll();
                }
                _super.prototype.onGotFocus.call(this, e);
            };
            // close the drop-down when losing focus
            DropDown.prototype.onLostFocus = function (e) {
                this._commitText();
                this.isDroppedDown = false; // TFS 355284
                _super.prototype.onLostFocus.call(this, e);
            };
            // check whether this control or its drop-down contain the focused element.
            // this is needed mostly for context menus, where the drop-down's owner
            // is not a child of the control (TFS 268503).
            // containsFocus(): boolean {
            //     return super.containsFocus() ||
            //         (this.isDroppedDown && contains(this._dropDown, getActiveElement()));
            // }
            DropDown.prototype._containsFocusImpl = function (activeElement) {
                return _super.prototype._containsFocusImpl.call(this, activeElement) ||
                    (this.isDroppedDown && wijmo.contains(this._dropDown, activeElement));
            };
            // close and dispose drop-down when disposing the control
            DropDown.prototype.dispose = function () {
                this.isDroppedDown = false;
                var dd = this._dropDown;
                if (dd) {
                    this._dropDown = null; // TFS 139396
                    wijmo.removeChild(dd); // before disposing
                    var ctl = wijmo.Control.getControl(dd);
                    if (ctl) {
                        ctl.dispose();
                    }
                }
                _super.prototype.dispose.call(this);
            };
            // reposition dropdown when refreshing
            DropDown.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                // update popup/focus (TFS 421678)
                var host = this.hostElement;
                if (host && host.offsetHeight && this.isDroppedDown) {
                    var ae = wijmo.getActiveElement();
                    if (!this.isAnimated || this._dropDown.style.opacity == '') { // TFS 346860
                        wijmo.showPopup(this._dropDown, host, false, false, this.dropDownCssClass == null);
                    }
                    if (ae instanceof HTMLElement && ae != wijmo.getActiveElement()) {
                        ae.focus();
                    }
                }
            };
            // reposition dropdown when window size changes
            DropDown.prototype._handleResize = function () {
                if (this.isDroppedDown) {
                    this.refresh();
                }
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // stop propagation of click events on the drop-down element
            // they are not children of the hostElement, which can confuse Bootstrap popups
            DropDown.prototype._dropDownClick = function (e) {
                e.stopPropagation();
            };
            // expand the current selection to the entire number/string that was clicked
            DropDown.prototype._expandSelection = function () {
                var tbx = this._tbx, val = tbx.value, start = tbx.selectionStart, end = tbx.selectionEnd;
                if (val && start == end) {
                    var ct = this._getCharType(val, start);
                    if (ct > -1) {
                        for (; end < val.length; end++) {
                            if (this._getCharType(val, end) != ct) {
                                break;
                            }
                        }
                        for (; start > 0; start--) {
                            if (this._getCharType(val, start - 1) != ct) {
                                break;
                            }
                        }
                        if (start != end) {
                            wijmo.setSelectionRange(tbx, start, end);
                        }
                    }
                }
            };
            // get the type of character (digit, letter, other) at a given position
            DropDown.prototype._getCharType = function (text, pos) {
                var chr = text[pos];
                if (chr >= '0' && chr <= '9')
                    return 0;
                if ((chr >= 'a' && chr <= 'z') || (chr >= 'A' && chr <= 'Z'))
                    return 1;
                return -1;
            };
            // handle keyboard events
            DropDown.prototype._keydown = function (e) {
                // ignore if default prevented
                if (e.defaultPrevented)
                    return;
                // ignore if we're a hidden grid editor
                if (this._isHiddenEditor())
                    return;
                // handle key
                switch (e.keyCode) {
                    // close dropdown on tab, escape, enter
                    case wijmo.Key.Tab:
                    case wijmo.Key.Escape:
                    case wijmo.Key.Enter:
                        if (this.isDroppedDown) {
                            this.isDroppedDown = false;
                            if (e.keyCode != wijmo.Key.Tab && !this.containsFocus()) {
                                this.focus();
                            }
                            e.preventDefault(); // this key has been handled
                        }
                        break;
                    // toggle drop-down on F4, alt up/down
                    case wijmo.Key.F4:
                    case wijmo.Key.Up:
                    case wijmo.Key.Down:
                        if (e.keyCode == wijmo.Key.F4 || e.altKey) {
                            var host = this.hostElement;
                            if (host && host.offsetHeight) { // TFS 142447, 153078
                                this.isDroppedDown = !this.isDroppedDown;
                                e.preventDefault(); // this key has been handled
                            }
                        }
                        break;
                }
                // special handling for IE messing up the input element when user presses ESC (TFS 458959)
                if (!e.defaultPrevented && e.keyCode == wijmo.Key.Escape && wijmo.isIE()) {
                    var tbx = this._tbx;
                    if (e.target == tbx) {
                        var val = tbx.value;
                        tbx.value = val + ' '; // change the value
                        tbx.value = val; // and restore it immediately
                    }
                }
            };
            // ignore keys while we are hidden (inactive grid editor, TFS 466837)
            DropDown.prototype._isHiddenEditor = function () {
                return wijmo.hasClass(this._tbx, 'wj-grid-ime');
            };
            // prevent smiley and other funky chars when user releases the alt key
            DropDown.prototype._keypress = function (e) {
                if (e.code == 'AltLeft' || e.code == 'AltRight') {
                    e.preventDefault();
                }
            };
            // handle clicks on the drop-down button
            DropDown.prototype._btnclick = function (e) {
                if (!e.defaultPrevented && e.button == 0) { // TFS 353420
                    e.preventDefault();
                    // don't set focus to input element on touch, which would cause soft keyboard appearance 
                    if (this.isTouching) {
                        if (!this._containsFocus()) {
                            this.hostElement.focus();
                        }
                    }
                    else {
                        this.focus();
                    }
                    this.isDroppedDown = !this.isDroppedDown;
                }
            };
            // update text in textbox
            DropDown.prototype._setText = function (text, fullMatch) {
                // make sure we have a string
                text = (text || '').toString();
                // update element
                if (text != this._tbx.value) {
                    this._tbx.value = text;
                }
                // fire change event
                if (text != this._oldText) {
                    this._oldText = text;
                    this.onTextChanged();
                }
                // update state
                this._updateState();
            };
            // update drop-down button visibility
            DropDown.prototype._updateBtn = function () {
                this._btn.style.display = this._showBtn ? '' : 'none';
            };
            // create the drop-down element
            DropDown.prototype._createDropDown = function () {
                // override in derived classes
            };
            // commit the text in the value element
            // canFocus - whether focus/selection can be set to the input element; e.g., when
            //   this method is called from input.blur, we normally can't set focus back to input
            DropDown.prototype._commitText = function (noFocus) {
                // override in derived classes
            };
            // update drop down content and position it (used by Popup, TFS 465000)
            /*protected*/ DropDown.prototype._updateDropDown = function () {
                if (this.isDroppedDown) {
                    // commit the current selection
                    this._commitText();
                    // update the dir attribute to support RTL
                    var dropDown = this.dropDown;
                    wijmo.setAttribute(dropDown, 'dir', this.rightToLeft ? 'rtl' : null);
                    // and show the popup
                    wijmo.showPopup(dropDown, this.hostElement, false, this._animate, this.dropDownCssClass == null);
                }
            };
            /**
             * Gets or sets the template used to instantiate {@link DropDown} controls.
             */
            DropDown.controlTemplate = '<div class="wj-template">' +
                '<div class="wj-input">' +
                '<div class="wj-input-group wj-input-btn-visible">' +
                '<input wj-part="input" type="text" class="wj-form-control">' +
                '<span wj-part="btn" class="wj-input-group-btn">' +
                '<button class="wj-btn wj-btn-default" tabindex="-1">' +
                '<span class="wj-glyph-down"></span>' +
                '</button>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div wj-part="dropdown" class="wj-content wj-dropdown-panel"></div>' +
                '</div>';
            return DropDown;
        }(wijmo.Control));
        input.DropDown = DropDown;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * Specifies actions that trigger showing and hiding {@link Popup} controls.
         *
         * The {@link PopupTrigger} actions are flags that may be combined using binary
         * operators. For example:
         *
         * ```typescript
         * let popup = new Popup('#popup', {
         *
         *     // set popup owner to 'show' button
         *     owner: '#btn-show'
         *
         *     // show the popup when clicking the button
         *     showTrigger: PopupTrigger.ClickOwner,
         *
         *     // hide the popup when clicking the button or when the mouse leaves the popup
         *     hideTrigger: PopupTrigger.ClickOwner | PopupTrigger.LeavePopup,
         * });
         * ```
         */
        var PopupTrigger;
        (function (PopupTrigger) {
            /** No triggers; popups must be shown and hidden using code. */
            PopupTrigger[PopupTrigger["None"] = 0] = "None";
            /** When the user clicks the owner element. */
            PopupTrigger[PopupTrigger["ClickOwner"] = 1] = "ClickOwner";
            /** When the user clicks the popup. */
            PopupTrigger[PopupTrigger["ClickPopup"] = 2] = "ClickPopup";
            /** When the user clicks the owner element or the popup. */
            PopupTrigger[PopupTrigger["Click"] = 3] = "Click";
            /** When the owner element loses focus. */
            PopupTrigger[PopupTrigger["BlurOwner"] = 4] = "BlurOwner";
            /** When the popup loses focus. */
            PopupTrigger[PopupTrigger["BlurPopup"] = 8] = "BlurPopup";
            /** When the owner element or the popup lose focus. */
            PopupTrigger[PopupTrigger["Blur"] = 12] = "Blur";
            /** When the owner element or the popup are clicked or lose focus. */
            PopupTrigger[PopupTrigger["ClickOrBlur"] = 15] = "ClickOrBlur";
            /** When the mouse button is pressed over the owner element. */
            PopupTrigger[PopupTrigger["DownOwner"] = 16] = "DownOwner";
            /** When the mouse button is pressed over the popup. */
            PopupTrigger[PopupTrigger["DownPopup"] = 32] = "DownPopup";
            /** When the mouse button is pressed over the owner element or the popup. */
            PopupTrigger[PopupTrigger["Down"] = 48] = "Down";
            /** When the mouse enters the owner element. */
            PopupTrigger[PopupTrigger["EnterOwner"] = 64] = "EnterOwner";
            /** When the mouse enters the popup. */
            PopupTrigger[PopupTrigger["EnterPopup"] = 128] = "EnterPopup";
            /** When the mouse enters the owner element or the popup. */
            PopupTrigger[PopupTrigger["Enter"] = 192] = "Enter";
            /** When the mouse leaves the owner element. */
            PopupTrigger[PopupTrigger["LeaveOwner"] = 256] = "LeaveOwner";
            /** When the mouse leaves the popup. */
            PopupTrigger[PopupTrigger["LeavePopup"] = 512] = "LeavePopup";
            /** When the mouse leaves the owner element or the popup. */
            PopupTrigger[PopupTrigger["Leave"] = 768] = "Leave";
        })(PopupTrigger = input.PopupTrigger || (input.PopupTrigger = {}));
        // popup edges (used for resizing)
        var _Edges;
        (function (_Edges) {
            _Edges[_Edges["None"] = 0] = "None";
            _Edges[_Edges["Left"] = 1] = "Left";
            _Edges[_Edges["Top"] = 2] = "Top";
            _Edges[_Edges["Right"] = 4] = "Right";
            _Edges[_Edges["Bottom"] = 8] = "Bottom";
            _Edges[_Edges["LeftTop"] = 3] = "LeftTop";
            _Edges[_Edges["RightTop"] = 6] = "RightTop";
            _Edges[_Edges["RightBottom"] = 12] = "RightBottom";
            _Edges[_Edges["LeftBottom"] = 9] = "LeftBottom";
        })(_Edges || (_Edges = {}));
        /**
         * Class that shows an element as a popup.
         *
         * Popups may be have {@link owner} elements, in which case they behave
         * as rich tooltips that may be shown or hidden based on actions
         * specified by the {@link Popup.showTrigger} and {@link Popup.hideTrigger}
         * properties.
         *
         * Popups with no owner elements behave like dialogs. They are centered
         * on the screen and displayed using the {@link show} method.
         *
         * To close a {@link Popup}, call the {@link Popup.hide} method.
         *
         * Alternatively, any clickable elements within a {@link Popup} that have
         * the classes starting with the 'wj-hide' string will hide the {@link Popup}
         * when clicked and will set the {@link Popup.dialogResult} property to the
         * class name so the caller may take appropriate action.
         *
         * For example, the {@link Popup} below will be hidden when the user presses
         * the OK or Cancel buttons, and the {@link Popup.dialogResult} property will
         * be set to either 'wj-hide-cancel' or 'wj-hide-ok':
         *
         * ```html
         * <button id="btn-show-popup">
         *     Show Popup
         * </button>
         * <div id="thePopup" class="wj-dialog">
         *     <div class="wj-dialog-header">
         *         Welcome to the popup.
         *     </div>
         *     <div class="wj-dialog-body">
         *         Click one of the buttons below to close the popup.
         *     </div>
         *     <div class="wj-dialog-footer">
         *         <button class="wj-hide-ok">
         *             OK
         *         </button>
         *         <button class="wj-hide-cancel">
         *             Cancel
         *         </button>
         *     </div>
         * </div>
         * ```
         * ```typescript
         * new Popup('#thePopup', {
         *     owner: '#btn-show-popup',
         *     hidden: s => console.log('popup closed with result', s.dialogResult)
         * });
         * ```
         *
         * The example below shows how you can use the {@link Popup} control to implement
         * popups attached to owner elements and dialogs:
         *
         * {@sample Input/Popup/PopupsWithOwnerElements/purejs}
         */
        var Popup = /** @class */ (function (_super) {
            __extends(Popup, _super);
            /**
             * Initializes a new instance of the {@link Popup} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function Popup(element, options) {
                var _this = _super.call(this, element) || this;
                _this._owner = null;
                _this._modal = false;
                _this._position = wijmo.PopupPosition.BelowLeft;
                _this._showTrigger = PopupTrigger.ClickOwner; // TFS 433511
                _this._hideTrigger = PopupTrigger.Blur;
                _this._hideAnim = []; // hide animation intervals
                _this._fadeIn = true;
                _this._fadeOut = true;
                _this._removeOnHide = true;
                _this._draggable = false;
                _this._resizable = false;
                _this._result = null;
                _this._resultEnter = null;
                _this._resultSubmit = null;
                _this._callback = null;
                _this._visible = false; // to report correctly while fading out
                _this._ownerClickBnd = _this._ownerClick.bind(_this);
                _this._ownerDownBnd = _this._ownerDown.bind(_this);
                _this._ownerBlurBnd = _this._ownerBlur.bind(_this);
                _this._ownerEnterBnd = _this._ownerEnter.bind(_this);
                _this._ownerLeaveBnd = _this._ownerLeave.bind(_this);
                _this._mousedownBnd = _this._mousedown.bind(_this);
                _this._mousemoveBnd = _this._mousemove.bind(_this);
                _this._mousedragBnd = _this._mousedrag.bind(_this);
                _this._mouseupBnd = _this._mouseup.bind(_this);
                _this._hideBnd = _this.hide.bind(_this);
                _this._lastShow = 0;
                /**
                 * Occurs before the {@link Popup} is shown.
                 */
                _this.showing = new wijmo.Event();
                /**
                 * Occurs after the {@link Popup} has been shown.
                 */
                _this.shown = new wijmo.Event();
                /**
                 * Occurs before the {@link Popup} is hidden.
                 */
                _this.hiding = new wijmo.Event();
                /**
                 * Occurs after the {@link Popup} has been hidden.
                 */
                _this.hidden = new wijmo.Event();
                /**
                 * Occurs when the {@link Popup} is about to be resized.
                 *
                 * See also the {@link isResizable} property.
                 */
                _this.resizing = new wijmo.Event();
                /**
                 * Occurs after the {@link Popup} has been resized.
                 *
                 * See also the {@link isResizable} property.
                 */
                _this.resized = new wijmo.Event();
                /**
                 * Occurs when the {@link Popup} is about to be dragged.
                 *
                 * See also the {@link isDraggable} property.
                 */
                _this.dragging = new wijmo.Event();
                /**
                 * Occurs after the {@link Popup} has been dragged.
                 *
                 * See also the {@link isDraggable} property.
                 */
                _this.dragged = new wijmo.Event();
                /**
                 * Occurs while the user resizes the {@link Popup}, between the
                 * {@link resizing} and {@link resized} events.
                 *
                 * When the user drags the {@link Popup}, it raises the following events:
                 * - {@link resizing} (once, cancelable)
                 * - {@link sizeChanging} (several times while the user moves the mouse, cancelable)
                 * - {@link sizeChanged} (several times while the user moves the mouse)
                 * - {@link resized} (once, at the end of the resizing process)
                 *
                 * See also the {@link isResizable} property.
                 */
                _this.sizeChanging = new wijmo.Event();
                /**
                 * Occurs while the user resizes the {@link Popup}, between the
                 * {@link resizing} and {@link resized} events.
                 *
                 * When the user resizes the {@link Popup}, it raises the following events:
                 * - {@link resizing} (once, cancelable)
                 * - {@link sizeChanging} (several times while the user moves the mouse, cancelable)
                 * - {@link sizeChanged} (several times while the user moves the mouse)
                 * - {@link resized} (once, at the end of the resizing process)
                 *
                 * See also the {@link isResizable} property.
                 */
                _this.sizeChanged = new wijmo.Event();
                /**
                 * Occurs while the user moves the {@link Popup}, between the
                 * {@link dragging} and {@link dragged} events.
                 *
                 * When the user drags the {@link Popup}, it raises the following events:
                 * - {@link dragging} (once, cancelable)
                 * - {@link positionChanging} (several times while the user moves the mouse, cancelable)
                 * - {@link positionChanged} (several times while the user moves the mouse)
                 * - {@link dragged} (once, at the end of the resizing process)
                 *
                 * See also the {@link isDraggable} property.
                 *
                 * You can use the {@link positionChanging} event to cancel or to modify
                 * the {@link Popup} bounds as the user drags the control.
                 *
                 * For example, the code keeps the popup in full view, preventing users
                 * from dragging parts of the {@link Popup} off the screen:
                 *
                 * ```typescript
                 * new Popup('#thePopup', {
                 *     isDraggable: true,
                 *     isResizable: true,
                 *     hideTrigger: 'None',
                 *
                 *     // keep popup fully within the browser window
                 *     positionChanging: (s: Popup, e: PopupBoundsChangingEventArgs) => {
                 *         let bnd = e.bounds;
                 *         bnd.left = Math.max(Math.min(bnd.left, innerWidth + scrollX - bnd.width), scrollX);
                 *         bnd.top = Math.max(Math.min(bnd.top, innerHeight + scrollY - bnd.height), scrollY);
                 *     }
                 * });
                 * ```
                 */
                _this.positionChanging = new wijmo.Event();
                /**
                 * Occurs while the user moves the {@link Popup}, between the
                 * {@link dragging} and {@link dragged} events.
                 *
                 * When the user drags the {@link Popup}, it raises the following events:
                 * - {@link dragging} (once, cancelable)
                 * - {@link positionChanging} (several times while the user moves the mouse)
                 * - {@link positionChanged} (several times while the user moves the mouse)
                 * - {@link dragged} (once, at the end of the resizing process)
                 *
                 * See also the {@link isDraggable} property.
                 */
                _this.positionChanged = new wijmo.Event();
                var host = _this.hostElement;
                // add classes
                wijmo.addClass(host, 'wj-control wj-content wj-popup');
                // ensure the host element can get the focus (TFS 199312)
                if (!host.getAttribute('tabindex')) {
                    host.tabIndex = 0;
                }
                // start hidden, but don't remove from the DOM (TFS 470639, 470612)
                wijmo.hidePopup(host, false);
                // keep track of IME composition status
                var addListener = _this.addEventListener.bind(_this);
                addListener(host, 'compositionstart', function () {
                    _this._composing = true;
                });
                addListener(host, 'compositionend', function () {
                    _this._composing = false;
                });
                // reposition Popup when window size changes 
                // (unless the user has dragged the dialog)
                // (and unless the user just opened a soft keyboard: TFS 357261)
                addListener(window, 'resize', function () {
                    if (_this.isVisible && !_this._dragged && !_this.isTouching) {
                        _this.invalidate();
                    }
                });
                // hide Popup when user presses Escape or Enter keys
                addListener(host, 'keydown', function (e) {
                    if (!e.defaultPrevented) {
                        // Escape: hide the popup with no dialogResult
                        // (if not composing: TFS 286794)
                        if (e.keyCode == wijmo.Key.Escape && !_this._composing) {
                            // hide the popup
                            e.preventDefault();
                            _this.hide();
                        }
                        // Enter: hide the popup and provide a dialogResult
                        // (if not composing: TFS 414983)
                        if (e.keyCode == wijmo.Key.Enter && !_this._composing) {
                            var result = _this.dialogResultEnter;
                            if (result) {
                                e.preventDefault();
                                _this._validateAndHide(result);
                            }
                        }
                        // Tab: keep focus within modal popups (TFS 148651)
                        if (e.keyCode == wijmo.Key.Tab && _this.modal) {
                            e.preventDefault();
                            wijmo.moveFocus(host, e.shiftKey ? -1 : +1);
                        }
                    }
                });
                // hide Popup when user clicks an element with the 'wj-hide' class
                addListener(host, 'click', function (e) {
                    var target = e.target;
                    if (target instanceof HTMLElement) {
                        // hide when clicking on submit buttons
                        if (target instanceof HTMLButtonElement && target.type == 'submit') {
                            var form = _this.hostElement, result = _this.dialogResultSubmit;
                            if (form instanceof HTMLFormElement && result) {
                                if (form.reportValidity()) {
                                    e.preventDefault();
                                    _this.hide(result);
                                }
                            }
                        }
                        // hide when clicking on 'wj-hide' buttons
                        var match = target.className.match(/\bwj-hide[\S]*\b/);
                        if (match && match.length > 0) {
                            e.preventDefault(); // cancel any navigation
                            e.stopPropagation();
                            _this.hide(match[0]); // hide and pass the attribute as the dialogResult
                        }
                    }
                });
                // hook up popup triggers
                var toggle = _this._toggle.bind(_this), pt = PopupTrigger;
                _this.addEventListener(host, 'click', function (e) {
                    if (!_this._ignoreClick) { // ignore click if we dragged/moved the popup (TFS 417861)
                        toggle(e, pt.ClickPopup);
                    }
                }, true);
                _this.addEventListener(host, 'mousedown', function (e) {
                    _this._ignoreClick = false;
                    toggle(e, pt.DownPopup);
                }, true);
                _this.addEventListener(host, 'mouseenter', function (e) {
                    if (e.target == host) {
                        toggle(e, pt.EnterPopup);
                    }
                }, true);
                _this.addEventListener(host, 'mouseleave', function (e) {
                    if (e.target == host) {
                        toggle(e, pt.LeavePopup);
                    }
                }, true);
                _this.addEventListener(host, 'blur', function (e) {
                    if (!_this.containsFocus()) {
                        toggle(e, pt.BlurPopup);
                    }
                }, true);
                // limit wheel propagation while modals are open
                // (so users can't scroll the modal off view)
                addListener(document, 'wheel', function (e) {
                    if (_this.isVisible && _this._modal) {
                        for (var t = e.target; t && t != document.body; t = t.parentElement) {
                            if (t.scrollHeight > t.clientHeight) {
                                return;
                            }
                        }
                        e.preventDefault();
                    }
                });
                // apply options after control is fully initialized
                _this.initialize(options);
                return _this;
                // do *not* remove the host from the DOM (removeOnHide is not removeOnCreate: TFS 470612)
                // start hidden (and remove if needed, TFS 467013, 470181)
                //if (this.removeOnHide) {
                //    removeChild(host);
                //}
            }
            Object.defineProperty(Popup.prototype, "owner", {
                // ** object model
                /**
                 * Gets or sets the element that owns this {@link Popup}.
                 *
                 * If the {@link owner} is null, the {@link Popup} behaves like a dialog.
                 * It is centered on the screen and must be shown using the
                 * {@link show} method.
                 */
                get: function () {
                    return this._owner;
                },
                set: function (value) {
                    // disconnect previous owner
                    var owner = this._owner;
                    if (owner) {
                        this.removeEventListener(owner, 'click');
                        this.removeEventListener(owner, 'mousedown');
                        this.removeEventListener(owner, 'mouseenter');
                        this.removeEventListener(owner, 'mouseleave');
                        this.removeEventListener(owner, 'blur');
                    }
                    // set new owner
                    owner = this._owner = value != null ? wijmo.getElement(value) : null;
                    // connect new owner
                    if (owner) {
                        this.addEventListener(owner, 'click', this._ownerClickBnd, true);
                        this.addEventListener(owner, 'mousedown', this._ownerDownBnd, true);
                        this.addEventListener(owner, 'mouseenter', this._ownerEnterBnd, true);
                        this.addEventListener(owner, 'mouseleave', this._ownerLeaveBnd, true);
                        this.addEventListener(owner, 'blur', this._ownerBlurBnd, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "position", {
                /**
                 * Gets or sets the {@link PopupPosition} where the popup should be
                 * displayed with respect to the owner element.
                 *
                 * The default value for this property is **PopupPosition.BelowLeft**.
                 */
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    this._position = wijmo.asEnum(value, wijmo.PopupPosition);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "content", {
                /**
                 * Gets or sets the HTML element contained in this {@link Popup}.
                 */
                get: function () {
                    return this.hostElement.firstElementChild;
                },
                set: function (value) {
                    if (value != this.content) {
                        this.hostElement.innerHTML = '';
                        if (value instanceof HTMLElement) {
                            this.hostElement.appendChild(value);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "showTrigger", {
                /**
                 * Gets or sets the actions that show the {@link Popup}.
                 *
                 * The default value for this property is **PopupTrigger.ClickOwner**,
                 * which causes the popup to appear when the user clicks the owner element.
                 *
                 * If you set the {@link showTrigger} property to {@link PopupTrigger.None},
                 * the popup will be shown only when the {@link show} method is called.
                 */
                get: function () {
                    return this._showTrigger;
                },
                set: function (value) {
                    this._showTrigger = wijmo.asEnum(value, PopupTrigger);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "hideTrigger", {
                /**
                 * Gets or sets the actions that hide the {@link Popup}.
                 *
                 * The default value for this property is **PopupTrigger.Blur**,
                 * which causes the popup to hide when it loses focus.
                 *
                 * If you set the {@link hideTrigger} property to {@link PopupTrigger.Click},
                 * the popup will be hidden when the user clicks the popup or its owner element.
                 *
                 * If you set the {@link hideTrigger} property to {@link PopupTrigger.Leave}, the
                 * popup will be hidden a short interval after the mouse leaves the popup or its
                 * owner element, unless the user moves the mouse back into the popup before the
                 * interval elapses.
                 *
                 * If you set the {@link hideTrigger} property to {@link PopupTrigger.None}, the
                 * popup will be hidden only when the {@link hide} method is called
                 * (or when the user presses the Escape key).
                 */
                get: function () {
                    return this._hideTrigger;
                },
                set: function (value) {
                    this._hideTrigger = wijmo.asEnum(value, PopupTrigger);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "fadeIn", {
                /**
                 * Gets or sets a value that determines whether the {@link Popup} should
                 * use a fade-in animation when it is shown.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._fadeIn;
                },
                set: function (value) {
                    this._fadeIn = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "fadeOut", {
                /**
                 * Gets or sets a value that determines whether the {@link Popup} should
                 * use a fade-out animation when it is hidden.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._fadeOut;
                },
                set: function (value) {
                    this._fadeOut = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "removeOnHide", {
                /**
                 * Gets or sets a value that determines whether the {@link Popup} host
                 * element should be hidden and removed from the DOM when the {@link Popup}
                 * is hidden, as opposed to simply being hidden.
                 *
                 * The default value for this property is **true**.
                 *
                 * Note that {@link removeOnHide} removes the {@link Popup} element from
                 * the DOM when the {@link Popup} is hidden, but not when it is created.
                 *
                 * If the {@link Popup} contains elements with access keys (**accesskey**
                 * attributes) that should not be activated when the {@link Popup} is not
                 * visible, you should remove the {@link Popup} from the DOM after it is
                 * created. For example:
                 * ```typesript
                 * import { Popup} from '@grapecity/wijmo.input';
                 * import { removeChild } from '@grapecity/wijmo';
                 * // create the Popup
                 * let popup = new Popup('#popup', {
                 *     owner: '#show'
                 * });
                 *
                 * // add event listeners to accesskey elements (accesskey element is in the DOM)
                 * document.getElementById('alert').addEventListener('click', e => alert('hi'));
                 *
                 * // remove Popup (and accesskey element) from DOM
                 * // so accesskey will not work until the Popup is visible
                 * removeChild(popup.hostElement);
                 * ```
                 */
                get: function () {
                    return this._removeOnHide;
                },
                set: function (value) {
                    value = wijmo.asBoolean(value);
                    if (value != this.removeOnHide) {
                        this._removeOnHide = value;
                        // if not visible, honor new setting now (TFS 467552)
                        if (!this.isVisible) {
                            var host = this.hostElement;
                            if (value) {
                                wijmo.removeChild(host);
                            }
                            else if (host && document.body) {
                                host.style.display = 'none';
                                document.body.appendChild(host);
                            }
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "modal", {
                /**
                 * Gets or sets a value that determines whether the {@link Popup} should
                 * be displayed as a modal dialog.
                 *
                 * Modal dialogs show a dark backdrop that makes the {@link Popup} stand
                 * out from other content on the page.
                 *
                 * If you want to make a dialog truly modal, also set the {@link Popup.hideTrigger}
                 * property to {@link PopupTrigger.None}, so users won't be able to click the
                 * backdrop to dismiss the dialog. In this case, the dialog will close only
                 * when the {@link hide} method is called (or when the user presses the Escape key).
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._modal;
                },
                set: function (value) {
                    this._modal = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "isDraggable", {
                /**
                 * Gets or sets a value that determines whether the popup can be dragged
                 * with the mouse by its header.
                 *
                 * The header is identified by the '.wj-dialog-header' or '.modal-header'
                 * CSS selectors.
                 * If the dialog does not contain any elements with the 'wj-dialog-header'
                 * or 'modal-header' classes, users will not be able to drag the popup.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._draggable;
                },
                set: function (value) {
                    this._draggable = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "isResizable", {
                /**
                 * Gets or sets a value that determines whether the popup can be resized
                 * by dragging its edges with the mouse.
                 *
                 * You can limit the size of the popup by setting the host element's
                 * max-width, min-width, max-height, and min-height CSS properties.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._resizable;
                },
                set: function (value) {
                    this._resizable = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "dialogResult", {
                /**
                 * Gets or sets a value used as a return value for the {@link Popup} after
                 * it is hidden.
                 *
                 * This property is set to **null** when the {@link Popup} is displayed.
                 *
                 * It can be set in response to button click events or in the call to the
                 * {@link hide} method to provide a result value to callers.
                 */
                get: function () {
                    return this._result;
                },
                set: function (value) {
                    this._result = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "dialogResultEnter", {
                /**
                 * Gets or sets a value to be used as a {@link dialogResult} when the user presses
                 * the Enter key while the {@link Popup} is visible.
                 *
                 * The default value for this property is **null**.
                 *
                 * If the user presses Enter and the {@link dialogResultEnter} property is not
                 * **null**, the popup checks whether all its child elements are in a valid state.
                 * If so, the popup is closed and the {@link dialogResult} property is set to
                 * the value of the {@link dialogResultEnter} property.
                 */
                get: function () {
                    return this._resultEnter;
                },
                set: function (value) {
                    this._resultEnter = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "dialogResultSubmit", {
                /**
                 * Gets or sets a string to be used as a {@link dialogResult} when the dialog
                 * is hosted by a form element and the user submits the form.
                 *
                 * The default value for this property is **null**.
                 *
                 * If you set this property to a non-empty string, the control will handle
                 * the form's submit event, validating the fields and closing the form with
                 * a {@link dialogResult} set to the specified value. For example:
                 *
                 * ```typescript
                 * let dlg = new Popup('#theForm', {
                 *     dialogResultSubmit: 'ok'
                 * });
                 * dlg.show(true, () => {
                 *     if (dlg.dialogResult == dlg.dialogResultSubmit) {
                 *         // form is valid, handle results here
                 *     }
                 * });
                 * ```
                 *
                 * See also the {@link dialogResultEnter} property, which can be used
                 * when the {@link Popup} is hosted in elements that are not forms.
                 */
                get: function () {
                    return this._resultSubmit;
                },
                set: function (value) {
                    this._resultSubmit = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Popup.prototype, "isVisible", {
                /**
                 * Gets a value that determines whether the {@link Popup} is currently visible.
                 */
                get: function () {
                    var host = this.hostElement;
                    return this._visible && host != null && host.offsetHeight > 0;
                    //return this._visible && host && host.parentElement && host.style.display != 'none';
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Shows the {@link Popup}.
             *
             * @param modal Whether to show the popup as a modal dialog. If provided, this
             * sets the value of the {@link modal} property.
             * @param handleResult Callback invoked when the popup is hidden. If provided,
             * this should be a function that receives the popup as a parameter.
             *
             * The **handleResult** callback allows callers to handle the result of modal
             * dialogs without attaching handlers to the {@link hidden} event. For example,
             * the code below shows a dialog used to edit the current item in a
             * {@link CollectionView}. The edits are committed or canceled depending on the
             * {@link Popup.dialogResult} value. For example:
             *
             * ```typescript
             * function editCurrentItem(popupEditor: Popup, view: CollectionView) {
             *     view.editItem(view.currentItem);
             *     popupEditor.show(true, (e: Popup) => {
             *         if (e.dialogResult == 'wj-hide-ok') {
             *             view.commitEdit();
             *         } else {
             *             view.cancelEdit();
             *         }
             *     });
             * }
             * ```
             */
            Popup.prototype.show = function (modal, handleResult) {
                var _this = this;
                // remember last show time to ignore redundant mouseenter events
                this._lastShow = Date.now();
                if (!this.isVisible) {
                    var host_1 = this.hostElement;
                    // reset dialog result/callback
                    this.dialogResult = null;
                    this._callback = null;
                    this._oldFocus = null;
                    this._myFocus = null;
                    // suspend any pending hide animations (TFS 294608, 363187)
                    this._hideAnim.forEach(function (anim) {
                        clearInterval(anim);
                    });
                    this._hideAnim.length = 0;
                    // raise the event
                    var e = new wijmo.CancelEventArgs();
                    if (this.onShowing(e)) {
                        // honor parameters
                        if (modal != null) {
                            this.modal = wijmo.asBoolean(modal);
                        }
                        if (handleResult != null) {
                            this._callback = wijmo.asFunction(handleResult);
                        }
                        // save old focus to restore later (TFS 421230)
                        this._oldFocus = wijmo.getActiveElement();
                        // show the popup
                        wijmo.showPopup(host_1, this._owner, this._position, this._fadeIn, false, // fade-in, copyStyles,
                        this._hideBnd); // hideOnScroll (TFS 418240)
                        // show modal backdrop behind the popup
                        if (this._modal) {
                            this._showBackdrop();
                        }
                        // raise shown event
                        this._composing = false;
                        this._visible = true;
                        this.onShown(e);
                        // cancel any pending show/hide
                        this._clearTimeouts();
                        // if modal, get the focus when the window does (TFS 267199)
                        if (this.modal) {
                            this.addEventListener(window, 'focus', function () {
                                if (!_this.containsFocus()) {
                                    var lastFocus = _this._myFocus;
                                    if (lastFocus && lastFocus.offsetHeight) {
                                        lastFocus.focus();
                                    }
                                    else {
                                        wijmo.moveFocus(host_1, 0);
                                    }
                                }
                            });
                            this.addEventListener(host_1, 'focusin', function () {
                                var ae = wijmo.getActiveElement();
                                if (ae && wijmo.contains(host_1, ae)) {
                                    if (ae.tabIndex > -1 || !_this._myFocus) {
                                        _this._myFocus = ae;
                                    }
                                }
                            });
                        }
                        // handle dragging/resizing
                        this._resized = this._dragged = this._ignoreClick = false;
                        this._handleDragResize(true);
                        // work around Safari/IOS bug (TFS 321525, 361500)
                        // https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile
                        this.addEventListener(window, 'touchstart', function (e) {
                            if ((_this._hideTrigger & PopupTrigger.Blur) && !wijmo.contains(host_1, e.target, true)) {
                                _this.hide();
                            }
                        });
                        // hide disabled popup ( WJM-19677 )  
                        setTimeout(function () {
                            _this.addEventListener(window, 'click', function (e) {
                                if ((_this._hideTrigger & PopupTrigger.BlurPopup) && (_this.isDisabled) && !wijmo.contains(host_1, e.target, true)) {
                                    _this.hide();
                                }
                            });
                        });
                        // and get the focus
                        setTimeout(function () {
                            // if this is not a touch event, set the focus to the 'autofocus' element 
                            // or to the first focusable element on the popup
                            if (!_this.isDisabled && !_this.containsFocus() && !_this.isTouching) {
                                var el = host_1.querySelector('[autofocus]'); // TFS 412379
                                if (el && el.clientHeight > 0 && // ignore disabled, unfocusable, hidden
                                    !el.disabled && el.tabIndex > -1 &&
                                    !wijmo.closest(el, '[disabled],.wj-state-disabled')) {
                                    el.focus();
                                    if (wijmo.isFunction(el.select)) {
                                        el.select(); // TFS 190336
                                    }
                                }
                                else {
                                    wijmo.moveFocus(host_1, 0);
                                }
                            }
                            // make sure the popup has the focus (no input elements/touch: TFS 143114)
                            if (!_this.isDisabled && !_this.containsFocus()) {
                                host_1.tabIndex = 0;
                                host_1.focus();
                            }
                        }, 100);
                    }
                }
            };
            /**
             * Hides the {@link Popup}.
             *
             * @param dialogResult Optional value assigned to the {@link dialogResult} property
             * before closing the {@link Popup}.
             */
            Popup.prototype.hide = function (dialogResult) {
                var _this = this;
                // no longer draggable
                this._handleDragResize(false);
                // remove Safari workaround (TFS 321525)
                this.removeEventListener(window, 'touchstart');
                // remove  hide disabled popup ( WJM-19677 )  
                this.removeEventListener(window, 'click');
                // hide if visible
                if (this.isVisible) {
                    if (!wijmo.isUndefined(dialogResult)) {
                        this.dialogResult = dialogResult;
                    }
                    var e_1 = new wijmo.CancelEventArgs(), host = this.hostElement;
                    if (this.onHiding(e_1)) {
                        // prepare to restore focus to original element (TFS 421230)
                        var oldFocus = this.containsFocus() ? this._oldFocus : null;
                        // close any open drop-downs (just in case, TFS 152950)
                        var ddh = host.querySelectorAll('.wj-control.wj-dropdown');
                        for (var i = 0; i < ddh.length; i++) {
                            var dd = wijmo.Control.getControl(ddh[i]);
                            if (dd instanceof input.DropDown) {
                                dd.isDroppedDown = false;
                            }
                        }
                        // hide the popup
                        var remove = this.removeOnHide, fadeOut = this.fadeOut;
                        if (this._bkDrop) {
                            this._hideAnim.push(wijmo.hidePopup(this._bkDrop, remove, fadeOut));
                        }
                        this._hideAnim.push(wijmo.hidePopup(host, remove, fadeOut));
                        this._visible = false;
                        this._oldFocus = null;
                        this._myFocus = null;
                        // clean up/update state (TFS 269434)
                        this.removeEventListener(window, 'focus');
                        this.removeEventListener(host, 'focusin');
                        if (this.containsFocus()) {
                            wijmo.getActiveElement().blur();
                        }
                        setTimeout(function () {
                            _this._updateState();
                            _this.onHidden(e_1);
                            if (_this._callback) {
                                _this._callback(_this);
                            }
                            // hide ancestor popups with Leave trigger
                            if (_this.hideTrigger & PopupTrigger.LeavePopup) {
                                var pop = wijmo.Control.getControl(wijmo.closest(_this.owner, '.wj-popup'));
                                if (pop instanceof Popup && (pop.hideTrigger & PopupTrigger.Leave) != 0) {
                                    var e_2 = Popup._evtHover, efp = e_2 ? document.elementFromPoint(e_2.clientX, e_2.clientY) : null, pfp = wijmo.Control.getControl(wijmo.closest(efp, '.wj-popup'));
                                    // if the element at the mouse is a popup that was just hidden, ignore it
                                    if (pfp instanceof Popup && !pfp.isVisible) {
                                        efp = null;
                                    }
                                    // no element at point or it doesn't contain the popup? hide it
                                    if (!efp || !wijmo.contains(pop.hostElement, efp, true)) {
                                        pop.hide();
                                    }
                                }
                            }
                        });
                        // cancel any pending show/hide timeouts
                        this._clearTimeouts();
                        // restore the original focus (TFS 421230, 467656, 466729)
                        if (!this.isVisible && oldFocus && oldFocus.offsetHeight) {
                            oldFocus.focus();
                        }
                    }
                }
            };
            /**
             * Raises the {@link showing} event.
             *
             * @param e {@link CancelEventArgs} that contains the event data.
             * @return True if the event was not canceled.
             */
            Popup.prototype.onShowing = function (e) {
                this.showing.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link shown} event.
             */
            Popup.prototype.onShown = function (e) {
                this.shown.raise(this, e);
            };
            /**
             * Raises the {@link hiding} event.
             *
             * @param e {@link CancelEventArgs} that contains the event data.
             * @return True if the event was not canceled.
             */
            Popup.prototype.onHiding = function (e) {
                this.hiding.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link hidden} event.
             */
            Popup.prototype.onHidden = function (e) {
                this._wasVisible = false;
                this.hidden.raise(this, e);
            };
            /**
             * Raises the {@link resizing} event.
             *
             * @param e {@link CancelEventArgs} that contains the event data.
             * @return True if the event was not canceled.
             */
            Popup.prototype.onResizing = function (e) {
                this.resizing.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link resized} event.
             */
            Popup.prototype.onResized = function (e) {
                this.resized.raise(this, e);
            };
            /**
             * Raises the {@link dragging} event.
             *
             * @param e {@link CancelEventArgs} that contains the event data.
             * @return True if the event was not canceled.
             */
            Popup.prototype.onDragging = function (e) {
                this.dragging.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link dragged} event.
             */
            Popup.prototype.onDragged = function (e) {
                this.dragged.raise(this, e);
            };
            /**
             * Raises the {@link sizeChanging} event.
             *
             * @param e {@link PopupBoundsChangingEventArgs} that contains the event data.
             * @return True if the event was not canceled.
             */
            Popup.prototype.onSizeChanging = function (e) {
                this.sizeChanging.raise(this, e);
                return !e.cancel;
            };
            /**
             *
             * @param e Raises the {@link sizeChanged} event.
             */
            Popup.prototype.onSizeChanged = function (e) {
                this.sizeChanged.raise(this, e);
            };
            /**
             * Raises the {@link positionChanging} event.
             *
             * @param e {@link PopupBoundsChangingEventArgs} that contains the event data.
             * @return True if the event was not canceled.
             */
            Popup.prototype.onPositionChanging = function (e) {
                this.positionChanging.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the {@link positionChanged} event.
             */
            Popup.prototype.onPositionChanged = function (e) {
                this.positionChanged.raise(this, e);
            };
            // ** overrides
            // safer than listening to blur event: TFS 434909
            Popup.prototype.onLostFocus = function (e) {
                _super.prototype.onLostFocus.call(this, e);
                if (this._hideTrigger & PopupTrigger.BlurPopup) {
                    if (!this.containsFocus()) {
                        var e_3 = document.createEvent('Event');
                        e_3.initEvent('blur', true, true);
                        this._toggle(e_3, PopupTrigger.BlurPopup);
                    }
                }
            };
            // release owner when disposing
            Popup.prototype.dispose = function () {
                this.owner = null;
                _super.prototype.dispose.call(this);
            };
            // reposition Popup when refreshing
            Popup.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                var host = this.hostElement;
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.isVisible && !this._refreshing && host) {
                    this._refreshing = true;
                    // prepare to work
                    var ae = wijmo.getActiveElement(), ref = this._owner ? this._owner.getBoundingClientRect() : null, openDropDowns = [], ddHost = host.querySelectorAll('.wj-dropdown');
                    // make a list of open DropDown controls, hide them until done
                    for (var i = 0; i < ddHost.length; i++) {
                        var dd = wijmo.Control.getControl(ddHost[i]);
                        if (dd instanceof input.DropDown && dd.isDroppedDown) {
                            openDropDowns.push(dd);
                            dd.dropDown.style.display = 'none';
                        }
                    }
                    // update popup position
                    wijmo.showPopup(host, ref, this._position);
                    // restore and update the drop-downs that were open (TFS 465000)
                    openDropDowns.forEach(function (dd) {
                        dd.dropDown.style.display = '';
                        dd._updateDropDown();
                    });
                    // restore focus and be done
                    if (this._modal && ae instanceof HTMLElement && ae != wijmo.getActiveElement()) {
                        ae.focus();
                    }
                    this._refreshing = false;
                }
            };
            // ** implementation
            // clear any pending show/hide timeouts
            Popup.prototype._clearTimeouts = function () {
                if (this._toShow) {
                    clearTimeout(this._toShow);
                    this._toShow = null;
                }
                if (this._toHideLeave) {
                    clearTimeout(this._toHideLeave);
                    this._toHideLeave = null;
                }
                if (this._toHideBlur) {
                    clearTimeout(this._toHideBlur);
                    this._toHideBlur = null;
                }
            };
            // make dialog draggable/resizable
            Popup.prototype._handleDragResize = function (on) {
                var host = this.hostElement, hdr = this._draggable ? this._getHeaderElement() : null, addListener = this.addEventListener.bind(this), rmvListener = this.removeEventListener.bind(this), mm = this._mousemoveBnd, md = this._mousedownBnd;
                if (on) {
                    addListener(host, 'mousemove', mm);
                    addListener(host, 'mousedown', md);
                    addListener(host, 'touchstart', md);
                    if (hdr) {
                        hdr.style.touchAction = 'none';
                    }
                }
                else {
                    this._mousedownEvt = null;
                    this._rcBounds = null;
                    rmvListener(host, 'mousemove', mm);
                    rmvListener(host, 'mousedown', md);
                    rmvListener(host, 'touchstart', md);
                    rmvListener(document, 'mousemove', this._mousedragBnd);
                    rmvListener(document, 'mouseup', this._mouseupBnd);
                    if (hdr) {
                        hdr.style.touchAction = '';
                    }
                }
            };
            // offer to resize the dialog
            Popup.prototype._mousemove = function (e) {
                if (!this._mousedownEvt) {
                    var host = this.hostElement, edges = this._getEdges(host, e), cursor = '', ED = _Edges;
                    this._edges = edges;
                    if (this._resizable) {
                        if (edges == ED.LeftTop || edges == ED.RightBottom) {
                            cursor = 'nwse-resize';
                        }
                        else if (edges == ED.LeftBottom || edges == ED.RightTop) {
                            cursor = 'nesw-resize';
                        }
                        else if (edges == ED.Left || edges == ED.Right) {
                            cursor = 'ew-resize';
                        }
                        else if (edges == ED.Top || edges == ED.Bottom) {
                            cursor = 'ns-resize';
                        }
                    }
                    if (this._draggable) {
                        if (!cursor && this._getClosestHeader(e.target)) {
                            cursor = 'move';
                        }
                    }
                    host.style.cursor = cursor;
                }
            };
            // start dragging/resizing the popup
            Popup.prototype._mousedown = function (e) {
                if (!e.defaultPrevented) {
                    var evt = (e.touches && e.touches.length > 0) ? e.touches[0] : e;
                    this._edges = this._getEdges(this.hostElement, evt);
                    if (this._edges || (this._draggable && this._getClosestHeader(e.target))) {
                        var args = new wijmo.CancelEventArgs(), start = this._edges
                            ? this.onResizing(args)
                            : this.onDragging(args);
                        if (start) {
                            this._mousedownEvt = evt;
                            this._rcBounds = this.hostElement.getBoundingClientRect();
                            var addListener = this.addEventListener.bind(this), doc = document, md = this._mousedragBnd, mu = this._mouseupBnd;
                            addListener(doc, 'mousemove', md);
                            addListener(doc, 'touchmove', md);
                            addListener(doc, 'mouseup', mu);
                            addListener(doc, 'touchend', mu);
                        }
                    }
                    this._ignoreClick = false; // do not ignore this click
                }
            };
            // stop dragging/resizing
            Popup.prototype._mouseup = function () {
                this._mousedownEvt = null;
                this._rcBounds = null;
                var rmvListener = this.removeEventListener.bind(this), doc = document, md = this._mousedragBnd, mu = this._mouseupBnd;
                rmvListener(doc, 'mousemove', md);
                rmvListener(doc, 'touchmove', md);
                rmvListener(doc, 'mouseup', mu);
                rmvListener(doc, 'touchend', mu);
                if (this._resized) {
                    this.onResized();
                }
                else if (this._dragged) {
                    this.onDragged();
                }
                this._resized = this._dragged = this._ignoreClick = false; // TFS 439965
            };
            // drag/resize
            Popup.prototype._mousedrag = function (e) {
                if (!e.defaultPrevented) {
                    var host = this.hostElement, mde = this._mousedownEvt, evt = (e.touches && e.touches.length > 0) ? e.touches[0] : e, dx = evt.clientX - mde.clientX, dy = evt.clientY - mde.clientY, rc = this._rcBounds, edges = this._edges, sz = Popup._SZ_MIN, bounds = wijmo.Rect.fromBoundingRect(rc);
                    if (edges) {
                        // resize the popup
                        if (edges & _Edges.Left) { // resize left/right
                            bounds.left = rc.left + dx + (evt.pageX - evt.clientX);
                            bounds.width = Math.max(rc.width - dx, sz);
                        }
                        else if (edges & _Edges.Right) { // right
                            bounds.left = rc.left;
                            bounds.width = Math.max(rc.width + dx, sz);
                        }
                        if (edges & _Edges.Top) { // resize top/bottom
                            bounds.top = rc.top + dy + (evt.pageY - evt.clientY);
                            bounds.height = Math.max(rc.height - dy, sz);
                        }
                        else if (edges & _Edges.Bottom) {
                            bounds.top = rc.top;
                            bounds.height = Math.max(rc.height + dy, sz);
                        }
                        if (this.onSizeChanging(new PopupBoundsChangingEventArgs(bounds))) {
                            wijmo.setCss(host, {
                                left: bounds.left,
                                top: bounds.top,
                                width: bounds.width,
                                height: bounds.height
                            });
                            this._resized = this._dragged = this._ignoreClick = true;
                            this.onSizeChanged();
                        }
                        // invalidate popup content we don't have a resizeObserver (TFS 414615)
                        if (!window['ResizeObserver']) {
                            var children = this.hostElement.children;
                            for (var i = 0; i < children.length; i++) {
                                wijmo.Control.invalidateAll(children[i]);
                            }
                        }
                    }
                    else if (this._draggable) {
                        // drag the popup
                        if (this._dragged || (Math.abs(dx) + Math.abs(dy)) > Popup._DRAG_THRESHOLD) {
                            bounds.left = Math.max(rc.left + dx + (evt.pageX - evt.clientX), 50 - rc.width);
                            bounds.top = Math.max(rc.top + dy + (evt.pageY - evt.clientY), 0);
                            if (this.onPositionChanging(new PopupBoundsChangingEventArgs(bounds))) {
                                wijmo.setCss(host, {
                                    left: bounds.left,
                                    top: bounds.top
                                });
                                this._dragged = this._ignoreClick = true;
                                this.onPositionChanged();
                            }
                        }
                    }
                }
            };
            // gets the edges at a point around the (resizable) popup
            Popup.prototype._getEdges = function (host, e) {
                var edges = 0;
                if (this._resizable) { // TFS 385083
                    var rc = host.getBoundingClientRect(), sz = Popup._SZ_EDGE;
                    if (e.clientX - rc.left < sz)
                        edges |= _Edges.Left;
                    if (e.clientY - rc.top < sz)
                        edges |= _Edges.Top;
                    if (rc.right - e.clientX < sz)
                        edges |= _Edges.Right;
                    if (rc.bottom - e.clientY < sz)
                        edges |= _Edges.Bottom;
                }
                return edges;
            };
            // handle owner triggers
            Popup.prototype._ownerClick = function (e) {
                this._toggle(e, PopupTrigger.ClickOwner);
            };
            Popup.prototype._ownerDown = function (e) {
                this._wasVisible = this.isVisible; // remember visible state
                this._toggle(e, PopupTrigger.DownOwner);
            };
            Popup.prototype._ownerBlur = function (e) {
                if (!wijmo.contains(this._owner, wijmo.getActiveElement())) {
                    this._toggle(e, PopupTrigger.BlurOwner);
                }
            };
            Popup.prototype._ownerEnter = function (e) {
                if (e.target == this._owner) {
                    this._toggle(e, PopupTrigger.EnterOwner);
                }
            };
            Popup.prototype._ownerLeave = function (e) {
                if (e.target == this._owner) {
                    this._toggle(e, PopupTrigger.LeaveOwner);
                }
            };
            // toggle the drop down visibility based on a trigger event
            Popup.prototype._toggle = function (e, trigger) {
                var _this = this;
                // save mouse position to hide popups later        
                if (e instanceof MouseEvent) {
                    Popup._evtHover = e;
                }
                // ignore redundant/wrong mouseenter events (TFS 434778)
                // https://stackoverflow.com/questions/47649442/click-event-affects-mouseenter-and-mouseleave-on-chrome-is-it-a-bug
                if (e.type == 'mouseenter' && Date.now() - this._lastShow < 300) {
                    return;
                }
                // handle the event
                if (!e.defaultPrevented) {
                    var hide = (this._hideTrigger & trigger) != 0, show = (this._showTrigger & trigger) != 0, PT = PopupTrigger;
                    // cancel pending hide/show timeouts
                    if (hide || show) {
                        this._clearTimeouts();
                    }
                    // hide the popup
                    if (hide) {
                        if (this.isVisible) {
                            if (trigger & PT.Leave) {
                                this._toHideLeave = setTimeout(function () {
                                    var e = Popup._evtHover, // check that we are still off the element
                                    efp = e ? document.elementFromPoint(e.clientX, e.clientY) : null;
                                    if (!efp || !wijmo.contains(_this.hostElement, efp, true)) {
                                        _this.hide();
                                    }
                                }, wijmo.Control._LEAVE_DELAY);
                            }
                            else if (trigger & PT.Blur) {
                                this._toHideBlur = setTimeout(function () {
                                    if (!_this.containsFocus() && !wijmo.contains(_this._owner, wijmo.getActiveElement())) {
                                        _this.hide();
                                    }
                                }, wijmo.Control._FOCUS_INTERVAL + 50);
                            }
                            else {
                                this.hide();
                            }
                        }
                    }
                    // show the popup
                    if (show && trigger != PT.ClickPopup) { // click popup to show popup doesn't make sense... (TFS 433511)
                        if (!this._wasVisible) {
                            if (trigger & PT.Enter) { // use timeOut for enter so we can cancel when leaving
                                this._toShow = setTimeout(function () {
                                    _this.show();
                                }, wijmo.Control._HOVER_DELAY);
                            }
                            else {
                                this.show();
                            }
                        }
                    }
                }
            };
            // gets the popup's child header
            Popup.prototype._getHeaderElement = function () {
                var host = this.hostElement;
                return host.querySelector('.wj-dialog-header') ||
                    host.querySelector('.modal-header');
            };
            // gets the closest header element to a given element
            Popup.prototype._getClosestHeader = function (e) {
                return wijmo.closest(e, '.wj-dialog-header') ||
                    wijmo.closest(e, '.modal-header');
            };
            // show/hide modal popup backdrop
            Popup.prototype._showBackdrop = function () {
                var _this = this;
                if (!this._bkDrop) {
                    // create backdrop element
                    this._bkDrop = document.createElement('div');
                    this._bkDrop.tabIndex = -1;
                    wijmo.addClass(this._bkDrop, 'wj-popup-backdrop');
                    // background is not clickable
                    this.addEventListener(this._bkDrop, 'mousedown', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.hostElement.focus(); // close any open menus/popups TFS 152950
                        if (_this.hideTrigger & PopupTrigger.Blur) {
                            _this.hide(); // hide if trigger has blur: TFS 245415, 245953
                        }
                    });
                }
                wijmo.setCss(this._bkDrop, {
                    zIndex: wijmo.Control._POPUP_ZINDEX,
                    display: ''
                });
                // insert background behind the popup (TFS 205400)
                var host = this.hostElement;
                host.parentElement.insertBefore(this._bkDrop, host);
            };
            // validate the dialog and hide it if there are no errors
            Popup.prototype._validateAndHide = function (result) {
                var host = this.hostElement;
                if (host instanceof HTMLFormElement) { // hosted in a form, validate
                    if (host.reportValidity()) {
                        this.hide(result); //  no errors
                    }
                }
                else { // not a form, validate elements
                    var invalid = this.hostElement.querySelector(':invalid');
                    if (invalid) {
                        invalid.focus(); // focus to invalid field
                    }
                    else {
                        this.hide(result); // no errors
                    }
                }
            };
            Popup._DRAG_THRESHOLD = 6; // TFS 335657
            Popup._SZ_EDGE = 10;
            Popup._SZ_MIN = 40;
            return Popup;
        }(wijmo.Control));
        input.Popup = Popup;
        /**
         * Provides arguments for the {@link Popup} control's {@link sizeChanging} and
         * {@link positionChanging} events.
         */
        var PopupBoundsChangingEventArgs = /** @class */ (function (_super) {
            __extends(PopupBoundsChangingEventArgs, _super);
            /**
             * Initializes a new instance of the {@link PopupBoundsChangingEventArgs} class.
             */
            function PopupBoundsChangingEventArgs(bounds) {
                var _this = _super.call(this) || this;
                _this._rc = bounds;
                return _this;
            }
            Object.defineProperty(PopupBoundsChangingEventArgs.prototype, "bounds", {
                /**
                 * Gets a {@link Rect} that represents the bounds of the {@link Popup} control.
                 */
                get: function () {
                    return this._rc;
                },
                enumerable: true,
                configurable: true
            });
            return PopupBoundsChangingEventArgs;
        }(wijmo.CancelEventArgs));
        input.PopupBoundsChangingEventArgs = PopupBoundsChangingEventArgs;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The {@link InputDate} control allows users to type in dates using any format
         * supported by the {@link Globalize} class, or to pick dates from a drop-down
         * that contains a {@link Calendar} control.
         *
         * Use the {@link min} and {@link max} properties to restrict the range of
         * values that the user can enter.
         *
         * For details about using the {@link min} and {@link max} properties, please see the
         * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a>
         * topic.
         *
         * Use the {@link value} property to get or set the currently selected date.
         *
         * Use the {@link autoExpandSelection} property to determine whether the control
         * should automatically expand the selection to entire words, numbers, or dates
         * when the user clicks the input element.
         *
         * The example below shows how to edit a **Date** value using an {@link InputDate}
         * control.
         *
         * {@sample Input/InputDate/Overview/purejs Example}
         *
         * The {@link InputDate} and {@link Calendar} controls have built-in accessibility
         * support. They support keyboard commands and provide aria-label attributes for
         * all elements on the calendar. You can improve accessibility by adding your own
         * application-specific aria-label attributes to the main input element of your
         * {@link InputDate} controls. For example:
         * ```typescript
         * // create an InputDate control and add an aria-label for improved accessibility
         * let inputDate = new InputDate('#theInputDate');
         * inputDate.inputElement.setAttribute('aria-label', 'enter trip start date in the format month/day/year')
         * ```
         */
        var InputDate = /** @class */ (function (_super) {
            __extends(InputDate, _super);
            /**
             * Initializes a new instance of the {@link InputDate} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function InputDate(element, options) {
                var _this = _super.call(this, element) || this;
                // property storage
                _this._fmt = 'd';
                _this._sep = ' - ';
                _this._rngs = null;
                _this._showCal = false;
                _this._clsOnSel = true;
                _this._handleWheel = true;
                // work variables
                _this._clicked = false;
                _this._rangeChanged = false;
                // ** events
                /**
                 * Occurs when the value of the {@link value} property changes.
                 */
                _this.valueChanged = new wijmo.Event();
                /**
                 * Occurs when the value of the {@link rangeEnd} property changes.
                 */
                _this.rangeEndChanged = new wijmo.Event();
                /**
                 * Occurs when the value of the {@link rangeEnd} property changes
                 * into a non-null value, indicating a data range has been selected.
                 */
                _this.rangeChanged = new wijmo.Event();
                wijmo.addClass(_this.hostElement, 'wj-inputdate');
                // initialize mask provider
                _this._msk = new wijmo._MaskProvider(_this._tbx);
                // default to numeric keyboard (like InputNumber), unless this is IE9...
                if (!wijmo.isIE9()) {
                    _this.inputType = 'tel';
                }
                // don't use any input types other than 'tel' or 'text' (TFS 84901, 401017)
                if (!_this._tbx.type.match(/^(tel|text|)$/i)) {
                    _this.inputType = 'text';
                }
                // use wheel to increase/decrease the date (TFS 460437)
                _this.addEventListener(_this.hostElement, 'wheel', function (e) {
                    if (_this.handleWheel && !e.defaultPrevented && !_this.isDroppedDown && _this.containsFocus()) {
                        if (_this.value != null && _this._canChangeValue()) {
                            var step = wijmo.clamp(-e.deltaY, -1, +1), value = _this.value;
                            _this.value = _this.selectionMode == input.DateSelectionMode.Month
                                ? wijmo.DateTime.addMonths(value, step)
                                : wijmo.DateTime.addDays(value, step);
                            _this.selectAll();
                            e.preventDefault();
                        }
                    }
                });
                // create the predefined range ListBox
                var lbx = _this._lbx = new input.ListBox(document.createElement('div'), {
                    displayMemberPath: 'name',
                    selectedIndexChanged: function (s) {
                        var rng = s.selectedItem, fdt = wijmo.DateTime.fromDateTime;
                        if (rng && rng.from && rng.to) {
                            var value = _this.value;
                            _this.value = fdt(rng.from, value);
                            _this.rangeEnd = fdt(rng.to, value);
                            _this._selectAll();
                        }
                        else {
                            _this._cal.hostElement.style.display = '';
                        }
                    }
                });
                // create the calendar
                var cal = _this._cal = new input.Calendar(document.createElement('div'));
                // create the dropdown
                var dd = _this._dropDown;
                wijmo.addClass(dd, 'wj-inputdate-dropdown');
                dd.appendChild(lbx.hostElement);
                dd.appendChild(cal.hostElement);
                // keep track of clicks in the dropdown (to close automatically)
                _this.addEventListener(dd, 'click', function () {
                    _this._clicked = true;
                    setTimeout(function () {
                        _this._clicked = false;
                    }, 50);
                }, true);
                // initializing from <input> tag
                if (_this._orgTag == 'INPUT') {
                    var value = _this._tbx.getAttribute('value');
                    if (value) {
                        cal.value = cal.rangeEnd = wijmo.Globalize.parseDate(value, 'yyyy-MM-dd');
                    }
                }
                // initialize control options
                _this.isRequired = true;
                _this.initialize(options);
                _this._tbx.value = _this._oldText = _this._getText();
                _this._updateState(); // update state (TFS 461967)
                // handle calendar events
                cal.valueChanged.addHandler(function (s, e) {
                    _this._refreshText(); //WJM-19952
                    _this.onValueChanged(e);
                    _this._closeOnChange();
                    //this._refreshText();
                });
                cal.rangeEndChanged.addHandler(function (s, e) {
                    if (cal._rngMode()) {
                        _this.onRangeEndChanged(e);
                        _this._closeOnChange();
                        if (!cal._clearingRangeEnd) {
                            _this._refreshText();
                        }
                    }
                });
                // close the drop-down when user clicks on the same date 
                // or on the today button (no change in value): TFS 132689
                cal.hostElement.addEventListener('click', function (e) {
                    if (cal.selectionMode && !cal._rngMode()) {
                        var target = e.target, dt = cal.hitTest(target);
                        if (wijmo.DateTime.sameDate(_this.value, dt) || wijmo.closest(target, '[wj-part=btn-today]')) {
                            _this._closeOnChange();
                        }
                    }
                });
                return _this;
            }
            Object.defineProperty(InputDate.prototype, "value", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the currently selected date.
                 *
                 * The default value for this property is the current date.
                 */
                get: function () {
                    return this._cal.value;
                },
                set: function (value) {
                    this._cal.value = value;
                    this._refreshText(); // in case the value is the same
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "rangeEnd", {
                /**
                 * Gets or sets the last selected date in a range selection.
                 *
                 * To enable date range selection, set the {@link selectionMode}
                 * property to **DateSelectionMode.Range**.
                 *
                 * Once you do that, the selection range will be defined by
                 * the {@link value} and {@link rangeEnd} properties.
                 */
                get: function () {
                    return this._cal.rangeEnd;
                },
                set: function (value) {
                    this._cal.rangeEnd = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "rangeMin", {
                /**
                 * Gets or sets the minimum number of days allowed when editing date ranges.
                 *
                 * This property is used only when the {@link selectionMode} property
                 * is set to {@link DateSelectionMode.Range}.
                 *
                 * The default value for this property is **0**, which means
                 * there is no minimum value for range lengths.
                 */
                get: function () {
                    return this._cal.rangeMin;
                },
                set: function (value) {
                    this._cal.rangeMin = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "rangeMax", {
                /**
                 * Gets or sets the maximum length allowed when editing date ranges.
                 *
                 * This property is used only when the {@link selectionMode} property
                 * is set to {@link DateSelectionMode.Range}.
                 *
                 * The default value for this property is **0**, which means
                 * there is no maximum value for range lengths.
                 */
                get: function () {
                    return this._cal.rangeMax;
                },
                set: function (value) {
                    this._cal.rangeMax = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "text", {
                /**
                 * Gets or sets the text shown on the control.
                 */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        var text = value;
                        text = (text || '').toString();
                        // update element
                        if (text != this._tbx.value) {
                            this._tbx.value = text;
                        }
                        // fire change event
                        if (text != this._oldText) {
                            this._oldText = text;
                        }
                        this._commitText();
                        this.onTextChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "format", {
                /**
                 * Gets or sets the format used to display the selected date.
                 *
                 * The format string is expressed as a .NET-style
                 * <a href="https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings" target="_blank">
                 * Date format string</a>.
                 *
                 * The default value for this property is **'d'**, the culture-dependent
                 * short date pattern (e.g. 6/15/2020 in the US, 15/6/2020 in France, or
                 * 2020/6/15 in Japan).
                 */
                get: function () {
                    return this._fmt;
                },
                set: function (value) {
                    if (value != this.format) {
                        this._fmt = wijmo.asString(value);
                        this._refreshText();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "separator", {
                /**
                 * Gets or sets a string used as a separator between the {@link value} and
                 * {@link rangeEnd} values shown by the control.
                 *
                 * This property is used only when the {@link selectionMode} property is set to
                 * {@link DateSelectionMode.Range}.
                 *
                 * The default value for this property is a **' - '**.
                 */
                get: function () {
                    return this._sep;
                },
                set: function (value) {
                    if (value != this._sep) {
                        this._sep = wijmo.asString(value, false);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "mask", {
                /**
                 * Gets or sets a mask to use while editing.
                 *
                 * The mask format is the same one that the {@link wijmo.input.InputMask}
                 * control uses.
                 *
                 * If specified, the mask must be compatible with the value of
                 * the {@link format} and {@link separator} properties.
                 *
                 * For example, the mask '99/99/9999 - 99/99/9999' can be used for
                 * entering date ranges formatted as 'MM/dd/yyyy' with a ' - '
                 * separator.
                 */
                get: function () {
                    return this._msk.mask;
                },
                set: function (value) {
                    this._msk.mask = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "closeOnSelection", {
                /**
                 * Gets or sets a value that determines whether the control should
                 * automatically close the drop-down when the user makes a selection.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._clsOnSel;
                },
                set: function (value) {
                    this._clsOnSel = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "handleWheel", {
                /**
                 * Gets or sets a value that determines whether the user can edit the
                 * current value using the mouse wheel.
                 *
                 * The default value for this property is **true**.
                 *
                 * Setting this property to **false** also disables the custom wheel
                 * handling for the control's drop-down {@link calendar}.
                 */
                get: function () {
                    return this._handleWheel;
                },
                set: function (value) {
                    value = wijmo.asBoolean(value);
                    this._handleWheel = value;
                    if (!value) {
                        this.calendar.handleWheel = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "predefinedRanges", {
                /**
                 * Gets or sets an object that defines predefined ranges.
                 *
                 * This property is useful only when the {@link selectionMode}
                 * property is set to {@link DateSelectionMode.Range}.
                 *
                 * Each property in the object represents a predefined range,
                 * identified by the property name and defined by an array with
                 * two dates (range start and end).
                 *
                 * Properties with null values represent custom ranges to be defined
                 * by users by clicking on the calendar.
                 *
                 * For example:
                 * ```typescript
                 * import { DateTime } from '@grapecity/wijmo';
                 * import { InputDate } from '@grapecity/wijmo.input';
                 *
                 * new InputDate(host, {
                 *     selectionMode: 'Range',
                 *     predefinedRanges: getRanges()
                 * });
                 *
                 * function getRanges() {
                 *     let dt = DateTime,
                 *         now = new Date();
                 *     return {
                 *         'This Week': [dt.weekFirst(now), dt.weekLast(now)],
                 *         'Last Week': [dt.weekFirst(dt.addDays(now, -7)), dt.weekLast(dt.addDays(now, -7))],
                 *         'Next Week': [dt.weekFirst(dt.addDays(now, +7)), dt.weekLast(dt.addDays(now, +7))],
                 *
                 *         'This Month': [dt.monthFirst(now), dt.monthLast(now)],
                 *         'Last Month': [dt.monthFirst(dt.addMonths(now, -1)), dt.monthLast(dt.addMonths(now, -1))],
                 *         'Next Month': [dt.monthFirst(dt.addMonths(now, +1)), dt.monthLast(dt.addMonths(now, +1))],
                 *         'Custom Range': null
                 *     };
                 * }
                 * ```
                 */
                get: function () {
                    return this._rngs;
                },
                set: function (value) {
                    if (this._rngs != value) {
                        wijmo.assert(value == null || wijmo.isObject(value), 'Object expected');
                        this._rngs = value;
                        this._lbx.itemsSource = this._getRanges(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "alwaysShowCalendar", {
                /**
                 * Gets or sets a value that determines whether the calendar
                 * should remain visible in the dropdown even when there are
                 * selected predefined ranges.
                 *
                 * The default value for this property is **false**, which
                 * causes the control to hide the calendar if one of the
                 * predefined ranges is selected.
                 */
                get: function () {
                    return this._showCal;
                },
                set: function (value) {
                    this._showCal = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "min", {
                /**
                 * Gets or sets the earliest date that the user can enter.
                 *
                 * The default value for this property is **null**, which
                 * means no earliest date is defined.
                 *
                 * For details about using the {@link min} and {@link max}
                 * properties, please see the
                 * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._cal.min;
                },
                set: function (value) {
                    this._cal.min = wijmo.asDate(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "max", {
                /**
                 * Gets or sets the latest date that the user can enter.
                 *
                 * The default value for this property is **null**, which means no latest
                 * date is defined.
                 *
                 * For details about using the {@link min} and {@link max} properties, please see the
                 * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._cal.max;
                },
                set: function (value) {
                    this._cal.max = wijmo.asDate(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "repeatButtons", {
                /**
                 * Gets or sets a value that determines whether the calendar buttons
                 * should act as repeat buttons, firing repeatedly as the button
                 * remains pressed.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._cal.repeatButtons;
                },
                set: function (value) {
                    this._cal.repeatButtons = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "showYearPicker", {
                /**
                 * Gets or sets a value that determines whether the drop-down
                 * calendar should display a list of years when the user clicks
                 * the header element on the year calendar.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._cal.showYearPicker;
                },
                set: function (value) {
                    this._cal.showYearPicker = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "showMonthPicker", {
                /**
                 * Gets or sets a value that determines whether the calendar should
                 * display a list of months when the user clicks the header element
                 * on the month calendar.
                 *
                 * The default value for this property is **ShowMonthPicker.First**.
                 */
                get: function () {
                    return this._cal.showMonthPicker;
                },
                set: function (value) {
                    this._cal.showMonthPicker = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "showHeader", {
                /**
                 * Gets or sets a value that determines whether the calendar should
                 * display an area with the current month and navigation buttons.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._cal.showHeader;
                },
                set: function (value) {
                    this._cal.showHeader = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "weeksBefore", {
                /**
                 * Gets or sets the number of weeks to show on the calendar
                 * before the current month.
                 *
                 * The default value for this property is **zero**.
                 */
                get: function () {
                    return this._cal.weeksBefore;
                },
                set: function (value) {
                    this._cal.weeksBefore = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "weeksAfter", {
                /**
                 * Gets or sets the number of weeks to show on the calendar
                 * after the current month.
                 *
                 * The default value for this property is **zero**.
                 */
                get: function () {
                    return this._cal.weeksAfter;
                },
                set: function (value) {
                    this._cal.weeksAfter = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "selectionMode", {
                /**
                 * Gets or sets a value that determines whether users can select
                 * days, ranges, months, or no values at all.
                 *
                 * This property affects the behavior of the drop-down calendar,
                 * but not the format used to display dates.
                 * If you set {@link selectionMode} to 'Month', you should normally
                 * set the {@link format} property to 'MMM yyyy' or some format that
                 * does not include the day. For example:
                 *
                 * ```typescript
                 * import { InputDate } from '@grapecity/wijmo.input';
                 * var inputDate = new InputDate('#el, {
                 *   selectionMode: 'Month',
                 *   format: 'MMM yyyy'
                 * });
                 * ```
                 *
                 * The default value for this property is **DateSelectionMode.Day**.
                 */
                get: function () {
                    return this._cal.selectionMode;
                },
                set: function (value) {
                    if (value != this.selectionMode) {
                        this._cal.selectionMode = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "monthCount", {
                /**
                 * Gets or sets the number of months to display in the drop-down calendar.
                 *
                 * The default value for this property is **1**.
                 *
                 * For more details on this property, please see the {@link Calendar.monthCount}
                 * property.
                 *
                 * When showing multiple months in the same calendar, months will be shown
                 * using a wrapping flex-box container. You may use CSS to limit the number
                 * of months shown per row in the drop-down.
                 *
                 * For example this code creates an {@link InputDate} control with a drop-down
                 * that shows three months per row:
                 * ```typescript
                 * import { InputDate } from '@grapecity/wijmo.input';
                 * let idt = new InputDate(document.createElement('#theInputDate'), {
                 *     monthCount: 6,
                 *     dropDownCssClass: 'three-months-per-row'
                 * });
                 * ```
                 * ```
                 * .three-months-per-row .wj-calendar-multimonth {
                 *     width: calc(3 * 21em);
                 * }
                 * ```
                 */
                get: function () {
                    return this._cal.monthCount;
                },
                set: function (value) {
                    this._cal.monthCount = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "calendar", {
                /**
                 * Gets a reference to the {@link Calendar} control shown in the drop-down box.
                 */
                get: function () {
                    return this._cal;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "inputElement", {
                /**
                 * Gets the HTML input element hosted by the control.
                 *
                 * Use this property in situations where you want to customize the attributes
                 * of the input element.
                 *
                 * For example, the code below uses the {@link inputElement} property to
                 * improve accessibility by adding an aria-label attribute to the control's
                 * input element:
                 * ```typescript
                 * // create an InputDate control and add an aria-label for improved accessibility
                 * let inputDate = new InputDate('#theInputDate');
                 * inputDate.inputElement.setAttribute('aria-label', 'enter trip start date in the format month/day/year')
                 * ```
                 */
                get: function () {
                    return this._tbx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "inputType", {
                /**
                 * Gets or sets the "type" attribute of the HTML input element hosted by the control.
                 *
                 * Use this property to change the default setting if the default does not work well
                 * for the current culture, device, or application. In those cases, try changing
                 * the value to "number" or "text."
                 *
                 * Note that input elements with type "number" prevent selection in Chrome and therefore
                 * is not recommended. For more details, see this link:
                 * https://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
                 */
                get: function () {
                    return this._tbx.type;
                },
                set: function (value) {
                    this._tbx.type = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "itemValidator", {
                /**
                 * Gets or sets a validator function to determine whether dates are valid for selection.
                 *
                 * If specified, the validator function should take one parameter representing the
                 * date to be tested, and should return false if the date is invalid and should not
                 * be selectable.
                 *
                 * For example, the code below prevents users from selecting dates that fall on
                 * weekends:
                 *
                 * ```typescript
                 * inputDate.itemValidator = date => {
                 *     const weekday = date.getDay();
                 *     return weekday != 0 && weekday != 6;
                 * }
                 * ```
                 */
                get: function () {
                    return this._cal.itemValidator;
                },
                set: function (value) {
                    if (value != this.itemValidator) {
                        this._cal.itemValidator = wijmo.asFunction(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "itemFormatter", {
                /**
                 * Gets or sets a formatter function to customize dates in the drop-down calendar.
                 *
                 * The formatter function can add any content to any date. It allows
                 * complete customization of the appearance and behavior of the calendar.
                 *
                 * If specified, the function takes two parameters:
                 * <ul>
                 *     <li>the date being formatted </li>
                 *     <li>the HTML element that represents the date</li>
                 * </ul>
                 *
                 * For example, the code below shows weekends with a yellow background:
                 *
                 * ```typescript
                 * inputDate.itemFormatter = (date, element) => {
                 *     const day = date.getDay();
                 *     element.style.backgroundColor = day == 0 || day == 6 ? 'yellow' : '';
                 * }
                 * ```
                 */
                get: function () {
                    return this._cal.itemFormatter;
                },
                set: function (value) {
                    this._cal.itemFormatter = wijmo.asFunction(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link valueChanged} event.
             */
            InputDate.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };
            /**
             * Raises the {@link rangeEndChanged} event.
             */
            InputDate.prototype.onRangeEndChanged = function (e) {
                this.rangeEndChanged.raise(this, e);
                if (this.rangeEnd) {
                    if (this.isDroppedDown) {
                        this._rangeChanged = true;
                    }
                    else {
                        this.onRangeChanged(e);
                    }
                }
            };
            /**
             * Raises the {@link rangeChanged} event.
             */
            InputDate.prototype.onRangeChanged = function (e) {
                this._rangeChanged = false;
                this.rangeChanged.raise(this, e);
            };
            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // update value display in case culture changed
            InputDate.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.hostElement) {
                    if (this._msk) {
                        this._msk.refresh();
                    }
                    if (this._cal) {
                        this._cal.refresh();
                    }
                    this._refreshText();
                }
            };
            // overridden to update calendar when dropping down
            InputDate.prototype.onIsDroppedDownChanging = function (e) {
                if (this.isDroppedDown) {
                    // closing: make sure the range is fully defined
                    var cal = this._cal;
                    if (cal._rngMode()) {
                        if (cal.value && !cal.rangeEnd) {
                            cal.rangeEnd = cal.value;
                        }
                    }
                }
                else {
                    // opening: update predefined range list, monthView, displayMonth
                    var lbx = this._lbx, cal = this._cal, view = lbx.collectionView, lbxStyle = lbx.hostElement.style, calStyle = cal.hostElement.style;
                    if (cal._rngMode() && wijmo.hasItems(view)) {
                        // we have a list, so update the selection and show it
                        var rng = this._updateRangeSelection();
                        lbxStyle.display = '';
                        // also show the calendar if:
                        // (1) showCal or (2) no current range or (3) no custom range option
                        calStyle.display = this._showCal || !rng || !rng.from || !view.items.some(function (rng) { return !rng.to; })
                            ? ''
                            : 'none';
                    }
                    else {
                        // no range mode or no list, so hide it and show calendar
                        lbxStyle.display = 'none';
                        calStyle.display = '';
                    }
                    // no month selection mode, so show month view
                    if (!cal._mthMode()) {
                        cal.monthView = true;
                    }
                    // display the month that corresponds to the current value
                    // in case the user scrolled off while the calendar was visible
                    // no, keep things simple and consistent: TFS 467213
                    ////if (cal.value) { 
                    ////    cal.displayMonth = cal.value;
                    ////}
                }
                return _super.prototype.onIsDroppedDownChanging.call(this, e);
            };
            // overridden to update calendar when dropping down
            InputDate.prototype.onIsDroppedDownChanged = function (e) {
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                var focus = this.containsFocus();
                if (this.isDroppedDown) {
                    if (focus) {
                        if (!this._tryFocus(this._cal) && !this._tryFocus(this._lbx)) {
                            this.dropDown.focus(); // could be a time picker... (TFS 351440)
                        }
                    }
                    this._lbx.showSelection();
                    this._cal.refresh();
                }
                else {
                    this._commitText();
                    if (this._rangeChanged) {
                        this.onRangeChanged();
                    }
                }
            };
            // update drop down content and position before showing it
            /*protected*/ InputDate.prototype._updateDropDown = function () {
                // update value
                this._commitText();
                // update size
                var cs = getComputedStyle(this.hostElement);
                this._dropDown.style.minWidth = parseFloat(cs.fontSize) * 18 + 'px';
                this._cal.refresh(); // update layout/size now
                // let base class update position
                _super.prototype._updateDropDown.call(this);
            };
            // override to commit text on Enter, cancel on Escape, and to tab within date ranges
            InputDate.prototype._keydown = function (e) {
                if (!e.defaultPrevented && !e.altKey && !e.ctrlKey && !e.metaKey) { // TFS 199387
                    // not if we are a hidden grid editor ()
                    if (this._isHiddenEditor())
                        return;
                    switch (e.keyCode) {
                        case wijmo.Key.Enter:
                            this._commitText();
                            break;
                        case wijmo.Key.Escape:
                            this.text = this._getText();
                            this.selectAll();
                            break;
                        case wijmo.Key.Tab:
                            if (this._cal._rngMode()) {
                                var tbx = this._tbx, sep = this._sep, val = tbx.value, index = val.indexOf(sep);
                                if (index > -1) { // has separator?
                                    // figure out if selecting range start or end
                                    var len = val.length, start = tbx.selectionStart, end = tbx.selectionEnd, rngStart = null;
                                    if (tbx.selectionEnd <= index && !e.shiftKey) { // tabbing forward, left of separator
                                        rngStart = (start == 0 && end == 0); // start if at start, else end
                                    }
                                    else if (e.shiftKey && tbx.selectionStart >= index + sep.length) { // tabbing back, right of separator
                                        rngStart = (start < len || end < len); // start if not at end, else end
                                    }
                                    // select range start or end
                                    if (rngStart != null) {
                                        if (rngStart) {
                                            wijmo.setSelectionRange(tbx, 0, index); // select range start
                                        }
                                        else {
                                            wijmo.setSelectionRange(tbx, index + sep.length, len); // select range end
                                        }
                                        e.preventDefault();
                                    }
                                }
                            }
                            break;
                        case wijmo.Key.Up:
                        case wijmo.Key.Down:
                            if (!this.isDroppedDown && this.value && this._canChangeValue()) { // TFS 460380
                                var step = e.keyCode == wijmo.Key.Up ? +1 : -1, value = this.selectionMode == input.DateSelectionMode.Month
                                    ? wijmo.DateTime.addMonths(this.value, step)
                                    : wijmo.DateTime.addDays(this.value, step);
                                this.value = this._fromDateTime(value); // set date, keep time
                                this.selectAll();
                                e.preventDefault();
                            }
                            break;
                    }
                }
                _super.prototype._keydown.call(this, e);
            };
            // expand the current selection to the entire from/to values
            InputDate.prototype._expandSelection = function () {
                if (this._cal._rngMode()) {
                    var tbx = this._tbx, val = tbx.value, start = tbx.selectionStart, end = tbx.selectionEnd, sep = this._sep, index = val.indexOf(sep);
                    if (index > -1 && start == end) { // has separator?
                        if (end <= index) { // left of separator?
                            wijmo.setSelectionRange(tbx, 0, index); // select range start
                        }
                        else if (start >= index + sep.length) { // right of separator?
                            wijmo.setSelectionRange(tbx, index + sep.length, tbx.value.length); // select range end
                        }
                    }
                }
                else {
                    _super.prototype._expandSelection.call(this);
                }
            };
            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // refresh the text in the control, raise textChanged if necessary
            InputDate.prototype._refreshText = function () {
                var txt = this._getText();
                if (txt != this.text) {
                    this._tbx.value = this._oldText = txt;
                    this.onTextChanged(); // TFS 403020
                }
            };
            // selects all content if focused, closed, and not touching (TFS 456059, 456451)
            InputDate.prototype._selectAll = function () {
                if (!this.isDroppedDown && this.containsFocus() && !this.isTouching) {
                    this.selectAll();
                }
            };
            // close the drop-down after a change caused by a click
            InputDate.prototype._closeOnChange = function () {
                var _this = this;
                if (this._clsOnSel && this._clicked) {
                    var cal = this._cal;
                    if (!cal._rngMode() || (cal.value && cal.rangeEnd)) {
                        setTimeout(function () {
                            _this.isDroppedDown = false;
                        });
                    }
                }
            };
            // set the focus to a control if it is visible
            InputDate.prototype._tryFocus = function (ctl) {
                var host = ctl.hostElement;
                if (host && host.offsetHeight) {
                    host.focus();
                    return true;
                }
                return false;
            };
            // honor min/max range
            InputDate.prototype._clamp = function (value) {
                return this._cal._clamp(value);
            };
            // gets the text to show in the control
            InputDate.prototype._getText = function () {
                var gf = wijmo.Globalize.format, fmt = this._fmt, txt = gf(this.value, fmt);
                if (this._cal._rngMode() && txt) {
                    txt += this._sep + gf(this.rangeEnd, fmt);
                }
                return txt;
            };
            // parse date, commit date part (no time) if successful or revert
            InputDate.prototype._commitText = function (noFocus) {
                var txt = this._tbx.value;
                // do this only if we have to
                // avoids extra work and redundant rangeEndChanged events
                if (txt != this._getText()) {
                    var valid = false, fmt = this._fmt, cal = this._cal, pdt = wijmo.Globalize.parseDate;
                    if (!txt && !this.isRequired) {
                        this.value = this.rangeEnd = null; // no text, no value
                        valid = true; // and we're OK (TFS 473036)
                    }
                    else {
                        if (cal._rngMode()) { // parse range                   
                            var vals = txt.split(this._sep);
                            if (vals.length == 2 && vals[0]) {
                                var value = pdt(vals[0], fmt, this.value);
                                if (value) { // got a value (no range checking here: TFS 461675)                            
                                    var rngEnd = pdt(vals[1], fmt, this.value);
                                    cal.value = this._fromDateTime(value);
                                    cal.rangeEnd = rngEnd && rngEnd >= value
                                        ? this._fromDateTime(rngEnd)
                                        : value;
                                    valid = true;
                                }
                            }
                        }
                        else { // parse single value                    
                            var value = pdt(txt, fmt, this.value);
                            if (value) {
                                this.value = this._fromDateTime(value);
                                valid = true;
                            }
                        }
                    }
                    // // update the text
                    // if (valid || this.onInvalidInput(new CancelEventArgs())) {
                    //     this.text = this._getText();
                    // }
                    if (valid || !this._containsFocus() && this.onInvalidInput(new wijmo.CancelEventArgs())) {
                        this.text = this._getText();
                    }
                }
                // select the whole content
                if (!noFocus) { // WJM-19943
                    this._selectAll();
                }
            };
            // convert date, keep the time (TFS 460378)
            InputDate.prototype._fromDateTime = function (value) {
                return wijmo.DateTime.fromDateTime(value, this.value);
            };
            // checks whether the control can change the current value
            InputDate.prototype._canChangeValue = function () {
                return !this.isReadOnly && !this.isDisabled && this.selectionMode != input.DateSelectionMode.None;
            };
            // check whether a date should be selectable by the user
            InputDate.prototype._isValidDate = function (value) {
                if (value) {
                    if (this._clamp(value) != value) {
                        return false; // out of range
                    }
                    if (this.itemValidator && !this.itemValidator(value)) {
                        return false; // invalid
                    }
                }
                return true;
            };
            // parses an object into a set of predefined ranges
            InputDate.prototype._getRanges = function (value) {
                var arr = [];
                if (wijmo.isObject(value)) {
                    for (var k in value) {
                        var rng = value[k];
                        arr.push({
                            name: k,
                            from: rng ? rng[0] : null,
                            to: rng ? rng[1] : null
                        });
                    }
                }
                return new wijmo.collections.CollectionView(arr, {
                    currentItem: null
                });
            };
            // updates the currently selected predefined range
            InputDate.prototype._updateRangeSelection = function () {
                var lbx = this._lbx, index = -1;
                if (wijmo.hasItems(lbx.collectionView)) {
                    var items = this._lbx.collectionView.items, sameDate = wijmo.DateTime.sameDate;
                    for (var i = 0; i < items.length; i++) {
                        var rng = items[i];
                        if (!rng.from) {
                            index = i;
                        }
                        else if (sameDate(rng.from, this.value) && sameDate(rng.to, this.rangeEnd)) {
                            index = i;
                            break;
                        }
                    }
                }
                lbx.selectedIndex = index;
                return lbx.selectedItem;
            };
            return InputDate;
        }(input.DropDown));
        input.InputDate = InputDate;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The {@link InputDateRange} control extends the {@link InputDate}
         * control and sets
         * the {@link selectionMode} property to {@link DateSelectionMode.Range},
         * the {@link monthCount} property to **2**, and
         * the {@link showMonthPicker} property to **ShowMonthPicker.Outside**.
         *
         * Use the {@link value} and {@link rangeEnd} properties to access
         * the currently selected date range.
         *
         * Use the {@link predefinedRanges} property to add pre-defined
         * ranges that users can select from.
         */
        var InputDateRange = /** @class */ (function (_super) {
            __extends(InputDateRange, _super);
            /**
             * Initializes a new instance of the {@link InputDateRange} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function InputDateRange(element, options) {
                var _this = _super.call(this, element, {
                    selectionMode: input.DateSelectionMode.Range,
                    showMonthPicker: 'Outside',
                    monthCount: 2
                }) || this;
                wijmo.addClass(_this.hostElement, 'wj-inputdaterange');
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(InputDateRange.prototype, "selectionMode", {
                // overridden, should always be Range
                get: function () {
                    return this.calendar.selectionMode;
                },
                set: function (value) {
                    value = wijmo.asEnum(value, input.DateSelectionMode);
                    wijmo.assert(value == input.DateSelectionMode.Range, 'InputDateRange.selectionMode must be "Range"');
                    this.calendar.selectionMode = value;
                },
                enumerable: true,
                configurable: true
            });
            return InputDateRange;
        }(input.InputDate));
        input.InputDateRange = InputDateRange;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The {@link InputColor} control allows users to select colors by typing in
         * HTML-supported color strings, or to pick colors from a drop-down
         * that shows a {@link ColorPicker} control.
         *
         * Use the {@link value} property to get or set the currently selected color.
         *
         * {@sample Input/InputColor/Overview/purejs Example}
         */
        var InputColor = /** @class */ (function (_super) {
            __extends(InputColor, _super);
            /**
             * Initializes a new instance of the {@link InputColor} class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function InputColor(element, options) {
                var _this = _super.call(this, element) || this;
                // ** events
                /**
                 * Occurs when the value of the {@link value} property changes, either
                 * as a result of user actions or by assignment in code.
                 */
                _this.valueChanged = new wijmo.Event();
                wijmo.addClass(_this.hostElement, 'wj-inputcolor');
                // create preview element
                var icb = '<div class="wj-inputcolorbox"></div>';
                _this._ePreview = wijmo.createElement(icb, _this.hostElement.firstElementChild);
                // initializing from <input> tag
                if (_this._orgTag == 'INPUT') {
                    _this._tbx.type = '';
                    _this._commitText();
                }
                // initialize value to white
                _this.value = '#ffffff';
                // initialize control options
                _this.isRequired = true;
                _this.initialize(options);
                // close drop-down when user clicks a palette entry or the preview element
                _this.addEventListener(_this._colorPicker.hostElement, 'click', function (e) {
                    var el = e.target;
                    if (el && el.tagName == 'DIV') {
                        if (wijmo.closest(el, '[wj-part="div-pal"]') || wijmo.closest(el, '[wj-part="div-pv"]')) {
                            var color = el.style.backgroundColor;
                            if (color) {
                                _this.isDroppedDown = false;
                            }
                        }
                    }
                });
                return _this;
            }
            Object.defineProperty(InputColor.prototype, "value", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the currently selected color.
                 *
                 * The default value for this property is **"#ffffff"** (white).
                 *
                 * Setting this property to a string that cannot be interpreted as
                 * a color causes the assignment to be ignored. No exceptions are
                 * thrown in this case.
                 */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    this.text = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputColor.prototype, "text", {
                /**
                 * Gets or sets the text shown on the control.
                 */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    value = wijmo.asString(value);
                    if (value != this.text) { // different
                        if (value || !this.isRequired) { // check isRequired
                            if (!value || wijmo.Color.fromString(value)) { // check value is a color
                                this._setText(value, true);
                                this._commitText();
                            }
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputColor.prototype, "showAlphaChannel", {
                /**
                 * Gets or sets a value indicating whether the {@link ColorPicker}
                 * allows users to edit the color's alpha channel (transparency).
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._colorPicker.showAlphaChannel;
                },
                set: function (value) {
                    this._colorPicker.showAlphaChannel = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputColor.prototype, "showColorString", {
                /**
                 * Gets or sets a value indicating whether the {@link ColorPicker}
                 * shows a string representation of the current color.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._colorPicker.showColorString;
                },
                set: function (value) {
                    this._colorPicker.showColorString = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputColor.prototype, "palette", {
                /**
                 * Gets or sets an array that contains the colors in the palette.
                 *
                 * The palette contains ten colors, represented by an array with
                 * ten strings. The first two colors are usually white and black.
                 */
                get: function () {
                    return this._colorPicker.palette;
                },
                set: function (value) {
                    this._colorPicker.palette = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputColor.prototype, "colorPicker", {
                /**
                 * Gets a reference to the {@link ColorPicker} control shown in the drop-down.
                 */
                get: function () {
                    return this._colorPicker;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link valueChanged} event.
             */
            InputColor.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };
            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // select the whole text when dropping down (TFS 346858)
            InputColor.prototype.onIsDroppedDownChanged = function (e) {
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                if (this.isDroppedDown && !this.isTouching) {
                    this.selectAll();
                }
            };
            // create the drop-down element
            InputColor.prototype._createDropDown = function () {
                var _this = this;
                // create the drop-down element
                this._colorPicker = new input.ColorPicker(this._dropDown);
                wijmo.setCss(this._dropDown, {
                    minWidth: 420,
                    minHeight: 200
                });
                // update our value to match colorPicker's
                this._colorPicker.valueChanged.addHandler(function () {
                    _this.value = _this._colorPicker.value;
                });
            };
            // override to commit/cancel edits
            InputColor.prototype._keydown = function (e) {
                if (!e.defaultPrevented) {
                    switch (e.keyCode) {
                        case wijmo.Key.Enter:
                            this._commitText();
                            this.selectAll();
                            break;
                        case wijmo.Key.Escape:
                            this.text = this.value;
                            this.selectAll();
                            break;
                    }
                }
                _super.prototype._keydown.call(this, e);
            };
            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // assign new color to ColorPicker
            InputColor.prototype._commitText = function () {
                if (this._value != this.text) {
                    // allow empty values
                    if (!this.isRequired && !this.text) {
                        this._value = this.text;
                        this._ePreview.style.backgroundColor = '';
                        this.onValueChanged(); // TFS 443678
                        return;
                    }
                    // parse and assign color to control
                    var c = wijmo.Color.fromString(this.text);
                    if (c) { // color is valid, update value based on text
                        var picker = this._colorPicker;
                        picker.value = this.text;
                        this._value = picker.value;
                        this._ePreview.style.backgroundColor = this.value;
                        this.onValueChanged();
                    }
                    else { // color is invalid, restore text and keep value
                        if (this.onInvalidInput(new wijmo.CancelEventArgs())) {
                            this.text = this._value ? this._value : '';
                        }
                    }
                }
            };
            return InputColor;
        }(input.DropDown));
        input.InputColor = InputColor;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The {@link ComboBox} control allows users to pick strings from lists.
         *
         * The control automatically completes entries as the user types, and
         * allows users to show a drop-down list with the items available.
         *
         * Use the {@link ComboBox.itemsSource} property to populate the list of
         * options.
         * The items may be strings or objects. If the items are objects, use
         * the {@link ComboBox.displayMemberPath} to define which property of the
         * items will be displayed in the list and use the {@link ComboBox.selectedValuePath}
         * property to define which property of the items will be used to set the
         * combo's {@link ComboBox.selectedValue} property.
         *
         * Use the {@link ComboBox.selectedIndex} or the {@link ComboBox.text} properties
         * to determine which item is currently selected.
         *
         * The {@link ComboBox.isRequired} property determines whether the control
         * must have a non-null value or whether it can be set to null
         * (by deleting the content of the control). If the value is set to null,
         * the {@link ComboBox.selectedIndex} is set to -1.
         *
         * The {@link ComboBox.isEditable} property determines whether users can enter
         * values that are not present in the list.
         *
         * The example below creates a {@link ComboBox} control and populates it with
         * a list of countries. The {@link ComboBox} searches for the country as the
         * user types.
         * The {@link ComboBox.isEditable} property is set to false, so the user must
         * select one of the items in the list.
         *
         * {@sample Input/ComboBox/Overview/purejs Example}
         */
        var ComboBox = /** @class */ (function (_super) {
            __extends(ComboBox, _super);
            /**
             * Initializes a new instance of the {@link ComboBox} class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function ComboBox(element, options) {
                var _this = _super.call(this, element) || this;
                // property storage
                _this._editable = false;
                _this._trimText = true;
                _this._handleWheel = true;
                // private stuff
                _this._delKey = 0;
                _this._pathHdr = new wijmo.Binding(null);
                _this._bsCollapse = true;
                _this._fmtItemHandlers = 0;
                /**
                 * Occurs when the value of the {@link itemsSource} property changes.
                 */
                _this.itemsSourceChanged = new wijmo.Event();
                /**
                 * Occurs when the value of the {@link selectedIndex} property changes.
                 */
                _this.selectedIndexChanged = new wijmo.Event();
                // add wj-combobox class to host element
                var host = _this.hostElement;
                wijmo.addClass(host, 'wj-combobox');
                // give the drop-down a unique ID
                _this.dropDown.id = wijmo.getUniqueId(host.id + '_dropdown');
                // disable auto-expand by default
                _this.autoExpandSelection = false;
                // handle IME
                var tbx = _this._tbx;
                _this.addEventListener(tbx, 'compositionstart', function () {
                    _this._composing = true;
                    // remove current selection (TFS 456866)
                    var start = tbx.selectionStart, end = tbx.selectionEnd;
                    if (end > start) {
                        var val = tbx.value;
                        tbx.value = val.substring(0, start) + val.substring(end, val.length);
                    }
                });
                _this.addEventListener(tbx, 'compositionend', function () {
                    _this._composing = false;
                    //setTimeout(() => { //// REVIEW: is this necessary?
                    _this._setText(_this.text, true);
                    //});
                });
                // use wheel to scroll through the items
                _this.addEventListener(host, 'wheel', _this._wheel.bind(_this));
                // initializing from <select> tag
                if (_this._orgTag == 'SELECT') {
                    _this._lbx._initFromSelect(host);
                }
                // refresh text after CollectionView updates
                var lbx = _this._lbx;
                lbx.loadedItems.addHandler(function (s) {
                    if (_this.selectedIndex > -1) {
                        _this.selectedIndex = lbx.selectedIndex;
                    }
                });
                // initialize control options
                _this.isRequired = true;
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(ComboBox.prototype, "itemsSource", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the array or {@link ICollectionView} object that contains
                 * the items to select from.
                 *
                 * Setting this property to an array causes the {@link ComboBox} to create
                 * an internal {@link ICollectionView} object that is exposed by the
                 * {@link ComboBox.collectionView} property.
                 *
                 * The {@link ComboBox} selection is determined by the current item in its
                 * {@link ComboBox.collectionView}. By default, this is the first item in
                 * the collection. You may change this behavior by setting the
                 * {@link wijmo.CollectionView.currentItem} property of the
                 * {@link ComboBox.collectionView} to null.
                 */
                get: function () {
                    return this._lbx.itemsSource;
                },
                set: function (value) {
                    if (this._lbx.itemsSource != value) {
                        this._lbx.itemsSource = value;
                        this.onItemsSourceChanged();
                    }
                    this._updateBtn();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "collectionView", {
                /**
                 * Gets the {@link ICollectionView} object used as the item source.
                 */
                get: function () {
                    return this._lbx.collectionView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "virtualizationThreshold", {
                /**
                 * Gets or sets the minimum number of rows and/or columns required to enable
                 * virtualization in the drop-down {@link ListBox}.
                 *
                 * The default value for this property is a very big number, meaning virtualization is
                 * disabled. To enable virtualization, set its value to 0 or a positive number.
                 *
                 * For more detals, please see the {@link ListBox.virtializationThreshold}
                 * property.
                 */
                get: function () {
                    return this._lbx.virtualizationThreshold;
                },
                set: function (value) {
                    this._lbx.virtualizationThreshold = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "showGroups", {
                /**
                 * Gets or sets a value that determines whether the drop-down {@link ListBox}
                 * should include group header items to delimit data groups.
                 *
                 * Data groups are created by modifying the {@link ICollectionView.groupDescriptions}
                 * property of the {@link ICollectionView} object used as an {@link itemsSource}.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._lbx.showGroups;
                },
                set: function (value) {
                    this._lbx.showGroups = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "displayMemberPath", {
                /**
                 * Gets or sets the name of the property to use as the visual
                 * representation of the items.
                 */
                get: function () {
                    return this._lbx.displayMemberPath;
                },
                set: function (value) {
                    this._lbx.displayMemberPath = value;
                    var text = this.getDisplayText();
                    if (this.text != text) {
                        this._setText(text, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "headerPath", {
                /**
                 * Gets or sets the name of a property to use for getting the value
                 * displayed in the control's input element.
                 *
                 * The default value for this property is **null**, which causes the
                 * control to display the same content in the input element as in the
                 * selected item of the drop-down list.
                 *
                 * Use this property if you want to decouple the value shown in the
                 * input element from the values shown in the drop-down list. For example,
                 * the input element could show an item's name and the drop-down list
                 * could show additional detail.
                 */
                get: function () {
                    return this._pathHdr.path;
                },
                set: function (value) {
                    this._pathHdr.path = wijmo.asString(value);
                    var text = this.getDisplayText();
                    if (this.text != text) {
                        this._setText(text, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedValuePath", {
                /**
                 * Gets or sets the name of the property used to get the
                 * {@link selectedValue} from the {@link selectedItem}.
                 */
                get: function () {
                    return this._lbx.selectedValuePath;
                },
                set: function (value) {
                    this._lbx.selectedValuePath = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "isContentHtml", {
                /**
                 * Gets or sets a value indicating whether the drop-down list displays
                 * items as plain text or as HTML.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._lbx.isContentHtml;
                },
                set: function (value) {
                    if (value != this.isContentHtml) {
                        this._lbx.isContentHtml = wijmo.asBoolean(value);
                        var text = this.getDisplayText();
                        if (this.text != text) {
                            this._setText(text, true);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "caseSensitiveSearch", {
                /**
                 * Gets or sets a value that determines whether searches performed
                 * while the user types should case-sensitive.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._lbx.caseSensitiveSearch;
                },
                set: function (value) {
                    this._lbx.caseSensitiveSearch = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "trimText", {
                /**
                 * Gets or sets a value that determines whether values in the
                 * control's input element should be trimmed by removing leading
                 * and trailing spaces.
                 *
                 * The default value for this property is **true**.
                 *
                 * To see leading and trailing spaces in the drop-down list items,
                 * you may have to apply a CSS rule such as this one:
                 *
                 * ```css
                 * .wj-listbox-item {
                 *     white-space: pre;
                 * }
                 * ```
                 * </pre>
                 */
                get: function () {
                    return this._trimText;
                },
                set: function (value) {
                    if (value != this._trimText) {
                        this._trimText = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "itemFormatter", {
                /**
                 * Gets or sets a function used to customize the values shown in
                 * the drop-down list.
                 * The function takes two arguments, the item index and the default
                 * text or html, and returns the new text or html to display.
                 *
                 * If the formatting function needs a scope (i.e. a meaningful 'this'
                 * value), then remember to set the filter using the 'bind' function
                 * to specify the 'this' object. For example:
                 *
                 * ```typescript
                 * comboBox.itemFormatter = customItemFormatter.bind(this);
                 * function customItemFormatter(index, content) {
                 *     if (this.makeItemBold(index)) {
                 *         content = '&lt;b&gt;' + content + '&lt;/b&gt;';
                 *     }
                 *     return content;
                 * }
                 * ```
                 */
                get: function () {
                    return this._lbx.itemFormatter;
                },
                set: function (value) {
                    this._lbx.itemFormatter = wijmo.asFunction(value); // update drop-down
                    this.selectedIndex = this._lbx.selectedIndex; // update control
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "formatItem", {
                /**
                 * Event that fires when items in the drop-down list are created.
                 *
                 * You can use this event to modify the HTML in the list items.
                 * For details, see the {@link ListBox.formatItem} event.
                 */
                get: function () {
                    return this._lbx.formatItem;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedIndex", {
                /**
                 * Gets or sets the index of the currently selected item in
                 * the drop-down list.
                 */
                get: function () {
                    return this._lbx.selectedIndex;
                },
                set: function (value) {
                    if (value != this.selectedIndex && wijmo.isNumber(value)) { // TFS 232968
                        this._lbx.selectedIndex = value;
                    }
                    value = this.selectedIndex; // TFS 214555
                    var text = this.getDisplayText(value);
                    if (this.text != text) {
                        this._setText(text, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedItem", {
                /**
                 * Gets or sets the item that is currently selected in
                 * the drop-down list.
                 */
                get: function () {
                    return this._lbx.selectedItem;
                },
                set: function (value) {
                    this._lbx.selectedItem = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedValue", {
                /**
                 * Gets or sets the value of the {@link selectedItem}, obtained
                 * using the {@link selectedValuePath}.
                 *
                 * If the {@link selectedValuePath} property is not set, gets or
                 * sets the value of the control's {@link selectedItem} property.
                 *
                 * If the {@link itemsSource} property is not set, gets or sets
                 * the value of the control's {@link text} property.
                 */
                get: function () {
                    return this.collectionView
                        ? this._lbx.selectedValue
                        : this.text;
                },
                set: function (value) {
                    if (this.collectionView) {
                        this._lbx.selectedValue = value;
                    }
                    else if (value != null) {
                        this.text = value.toString();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "isEditable", {
                /**
                 * Gets or sets a value that determines whether the content of the
                 * input element should be restricted to items in the {@link itemsSource}
                 * collection.
                 *
                 * The default value for this property is **false** on the {@link ComboBox} control, and
                 * **true** on the {@link AutoComplete} and {@link InputTime} controls.
                 */
                get: function () {
                    return this._editable;
                },
                set: function (value) {
                    this._editable = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "handleWheel", {
                /**
                 * Gets or sets a value that determines whether the user can use
                 * the mouse wheel to change the currently selected item.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._handleWheel;
                },
                set: function (value) {
                    this._handleWheel = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "maxDropDownHeight", {
                /**
                 * Gets or sets the maximum height of the drop-down list, in pixels.
                 *
                 * The default value for this property is **200** pixels.
                 */
                get: function () {
                    return this._lbx.maxHeight;
                },
                set: function (value) {
                    this._lbx.maxHeight = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "maxDropDownWidth", {
                /**
                 * Gets or sets the maximum width of the drop-down list.
                 *
                 * The width of the drop-down list is also limited by the width of
                 * the control itself (that value represents the drop-down's
                 * minimum width).
                 *
                 * The default value for this property is **null**, which
                 * means the drop-down has no maximum width limit.
                 */
                get: function () {
                    var lbx = this._dropDown, width = lbx ? parseInt(lbx.style.maxWidth) : null;
                    return isNaN(width) ? null : width;
                },
                set: function (value) {
                    var lbx = this._dropDown, style = lbx.style;
                    value = wijmo.asNumber(value, true);
                    style.maxWidth = (value == null) ? '' : value + 'px';
                    style.minWidth = ''; // TFS 342335
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the string displayed in the input element for the item at a
             * given index (always plain text).
             *
             * @param index The index of the item to retrieve the text for.
             * @param trimText Optionally override the value of the {@link trimText} property.
             */
            ComboBox.prototype.getDisplayText = function (index, trimText) {
                if (index === void 0) { index = this.selectedIndex; }
                if (trimText === void 0) { trimText = this._trimText; }
                var text, view = this.collectionView;
                if (this.headerPath && index > -1 && wijmo.hasItems(view)) {
                    var item = view.items[index];
                    text = item ? this._pathHdr.getValue(item) : null;
                    text = text != null ? text.toString() : '';
                    if (this.isContentHtml) {
                        text = wijmo.toPlainText(text);
                    }
                }
                else {
                    text = this._lbx.getDisplayText(index);
                }
                return trimText ? text.trim() : text;
            };
            /**
             * Gets the index of the first item that matches a given string.
             *
             * @param search String to search for.
             * @param fullMatch Whether to look for a full match or just the start of the string.
             * @return The index of the item, or -1 if not found.
             */
            ComboBox.prototype.indexOf = function (search, fullMatch) {
                var cv = this.collectionView, caseSensitive = this.caseSensitiveSearch;
                if (wijmo.hasItems(cv) && search != null) { // OK to search for empty strings (TFS 221701)
                    // string to search for
                    search = search.toString();
                    if (!caseSensitive) {
                        search = search.toLowerCase();
                    }
                    // preserve the current selection if possible
                    // http://wijmo.com/topic/wj-combo-box-bug/#post-76154
                    var index = this.selectedIndex, text = this.getDisplayText(index);
                    if (fullMatch) {
                        if (!caseSensitive) {
                            text = text.toLowerCase();
                        }
                        if (search == text) { // TFS 253162
                            return index;
                        }
                    }
                    // scan the list from the start
                    for (var i = 0; i < cv.items.length; i++) {
                        if (this._lbx.isItemEnabled(i)) { // skip disabled items
                            text = this.getDisplayText(i);
                            if (!caseSensitive) {
                                text = text.toLowerCase();
                            }
                            if (fullMatch) {
                                if (text == search) { // TFS 436721
                                    return i;
                                }
                            }
                            else {
                                if (search && text.indexOf(search) == 0) {
                                    return i;
                                }
                            }
                        }
                    }
                }
                // not found
                return -1;
            };
            Object.defineProperty(ComboBox.prototype, "listBox", {
                /**
                 * Gets the {@link ListBox} control shown in the drop-down.
                 */
                get: function () {
                    return this._lbx;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link itemsSourceChanged} event.
             */
            ComboBox.prototype.onItemsSourceChanged = function (e) {
                this.itemsSourceChanged.raise(this, e);
            };
            /**
             * Raises the {@link selectedIndexChanged} event.
             */
            ComboBox.prototype.onSelectedIndexChanged = function (e) {
                this._updateBtn();
                this.selectedIndexChanged.raise(this, e);
            };
            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // update the content when refreshing
            ComboBox.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.hostElement && wijmo.hasItems(this.collectionView)) { // TFS 201563
                    this._lbx.refresh();
                    if (this.selectedIndex > -1) {
                        this.selectedIndex = this._lbx.selectedIndex;
                    }
                }
            };
            // prevent empty values if editable and required
            ComboBox.prototype.onLostFocus = function (e) {
                // Safari does not finish composition on blur (TFS 236810)
                if (this._composing) {
                    this._composing = false;
                    this._setText(this.text, true);
                }
                // prevent empty values if editable and required (TFS 138025)
                if (this.isEditable && this.isRequired && !this.text) {
                    if (wijmo.hasItems(this.collectionView)) {
                        this.selectedIndex = 0;
                    }
                }
                // raise event as usual
                _super.prototype.onLostFocus.call(this, e);
            };
            // prevent dropping down with no items
            ComboBox.prototype.onIsDroppedDownChanging = function (e) {
                if (!this.isDroppedDown && !this._hasItems()) {
                    e.cancel = true;
                    return false; // TFS 252531
                }
                return _super.prototype.onIsDroppedDownChanging.call(this, e);
            };
            // show current selection when dropping down
            ComboBox.prototype.onIsDroppedDownChanged = function (e) {
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                if (this.isDroppedDown) {
                    this._fmtItemHandlers = this.formatItem.handlerCount;
                    this._lbx.showSelection();
                }
                this._updateAria();
            };
            // update button visibility and state
            ComboBox.prototype._updateBtn = function () {
                var cv = this.collectionView, tbx = this._tbx, hasItems = this._hasItems();
                // allow base class
                _super.prototype._updateBtn.call(this);
                // show button if the 'showButton' property is true and we have an itemsSource
                this._btn.style.display = (this._showBtn && cv != null) ? '' : 'none';
                // enable the button if the itemsSource has more than one item
                wijmo.enable(this._btn, hasItems);
                // update aria attributes to match drop-down state
                // accessibility: 
                // https://www.w3.org/TR/wai-aria-1.1/#combobox
                // http://oaa-accessibility.org/examples/role/77/
                wijmo.setAttribute(tbx, 'role', hasItems ? 'combobox' : null);
                wijmo.setAttribute(tbx, 'aria-autocomplete', hasItems ? 'both' : null);
                this._updateAria();
            };
            // check whether we have items to show on the drop-down
            ComboBox.prototype._hasItems = function () {
                return wijmo.hasItems(this.collectionView);
            };
            // update aria-owns and expanded attributes
            ComboBox.prototype._updateAria = function () {
                var tbx = this._tbx, ddDown = this.isDroppedDown, ddId = this.dropDown ? this.dropDown.id : null, // TFS 422904
                hasList = ddId && wijmo.hasItems(this.collectionView);
                wijmo.setAttribute(tbx, 'aria-owns', hasList && ddDown ? ddId : null);
                wijmo.setAttribute(tbx, 'aria-expanded', hasList ? ddDown : null);
            };
            // create the drop-down element
            ComboBox.prototype._createDropDown = function () {
                var _this = this;
                // create the drop-down element
                if (!this._lbx) {
                    this._lbx = new input.ListBox(this._dropDown);
                }
                // limit the size of the drop-down
                this._lbx.maxHeight = 200;
                // update our selection when user picks an item from the ListBox
                // or when the selected index changes because the list changed
                this._lbx.selectedIndexChanged.addHandler(function () {
                    // update the drop-down button
                    _this._updateBtn();
                    // update the aria-activedescendant attribute
                    var index = _this._lbx.selectedIndex, children = _this._lbx.hostElement.children, id = index > -1 && index < children.length ? children[index].id : null;
                    wijmo.setAttribute(_this._tbx, 'aria-activedescendant', id && id.length ? id : null);
                    // update index and raise event
                    _this.selectedIndex = index;
                    _this.onSelectedIndexChanged();
                });
                // update button display when item list changes
                this._lbx.itemsChanged.addHandler(function () {
                    _this._updateBtn();
                });
            };
            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // use wheel to change selection
            ComboBox.prototype._wheel = function (e) {
                if (this.handleWheel && !e.defaultPrevented && !this.isDroppedDown && !this.isReadOnly && this.containsFocus()) {
                    if (this.selectedIndex > -1) {
                        var index = this._findNext('', e.deltaY > 0 ? +1 : -1); // TFS 418707
                        if (index > -1) {
                            this.selectedIndex = index;
                        }
                        e.preventDefault();
                    }
                }
            };
            // close the drop-down when the user clicks to select an item
            ComboBox.prototype._dropDownClick = function (e) {
                if (!e.defaultPrevented) {
                    if (e.target != this._dropDown) { // an item, not the list itself...
                        this.isDroppedDown = false;
                    }
                }
                _super.prototype._dropDownClick.call(this, e); // allow base class
            };
            // update text in textbox
            ComboBox.prototype._setText = function (text, fullMatch) {
                // not while composing IME text (TFS 442594)
                if (this._composing) {
                    return;
                }
                // prevent reentrant calls while moving CollectionView cursor
                if (this._settingText) {
                    return;
                }
                this._settingText = true;
                // make sure list is up-to-date
                // (in case user added formatItem and did not open the drop-down)
                if (this.containsFocus()) {
                    var cnt = this.formatItem.handlerCount;
                    if (this._fmtItemHandlers != cnt) {
                        this._fmtItemHandlers = cnt;
                        this._lbx.loadList();
                    }
                }
                // make sure we have a string
                if (text == null)
                    text = '';
                text = text.toString();
                // get variables we need
                var index = this.selectedIndex, cv = this.collectionView, start = this._getSelStart(), len = -1, autoComplete = true;
                // allow user to edit values without auto-completion
                if (this.isEditable) {
                    if (this._delKey || // let user enter anything after deleting
                        this._getSelEnd() < text.length || // allow entering "auto" with "Austria"
                        !this.containsFocus()) { // TFS 313812
                        fullMatch = true;
                        autoComplete = false;
                    }
                }
                // search for the index
                index = this.indexOf(text, fullMatch);
                if (autoComplete) {
                    if (index < 0 && fullMatch) { // not found, try partial match
                        index = this.indexOf(text, false);
                    }
                    if (index < 0 && start > 0) { // not found, try up to cursor
                        index = this.indexOf(text.substr(0, start), false);
                    }
                }
                // not found and not editable? restore old text and move cursor to matching part
                if (index < 0 && !this.isEditable && wijmo.hasItems(cv)) {
                    if (this.isRequired || text) { // allow removing the value if not required
                        var oldText = this._oldText || ''; // TFS 233094
                        index = Math.max(0, this.indexOf(oldText, false));
                        start = 0; // WJM-20141
                        for (var i = 0; i < text.length && i < oldText.length; i++) {
                            if (text[i] != oldText[i]) {
                                start = i;
                                break;
                            }
                        }
                    }
                }
                if (index > -1) {
                    len = start;
                    text = this.getDisplayText(index);
                }
                // update element
                var tbx = this._tbx;
                if (text != tbx.value) {
                    tbx.value = text;
                }
                // update text selection
                if (len > -1 && this.containsFocus() && !this.isTouching) {
                    this._updateInputSelection(len);
                }
                // update collectionView
                if (cv) {
                    cv.moveCurrentToPosition(index);
                }
                // clear flags
                this._delKey = 0;
                this._settingText = false;
                // call base class to fire textChanged event
                _super.prototype._setText.call(this, text, fullMatch);
            };
            // skip to the next/previous item that starts with a given string
            ComboBox.prototype._findNext = function (search, step, start) {
                if (start === void 0) { start = this.selectedIndex; }
                var view = this.collectionView, len = view ? view.items.length : 0, listBox = this._lbx, caseSensitive = this.caseSensitiveSearch;
                if (view && len && step) {
                    // honor caseSensitiveSearch property
                    if (!caseSensitive) {
                        search = search.toLowerCase();
                    }
                    // no wrapping here. 
                    // to enable wrapping, start with "(selIndex + step + len) % len"
                    // instead of "selIndex + step"
                    for (var index = start + step; index > -1 && index < len; index += step) {
                        var txt = this.getDisplayText(index);
                        if (!caseSensitive) {
                            txt = txt.toLowerCase();
                        }
                        if (txt.indexOf(search) == 0) { // look for a match (TFS 347473)
                            var item = this.dropDown.children[index];
                            if (!item || listBox.isItemEnabled(index)) { // skip disabled items
                                return index;
                            }
                        }
                    }
                }
                return start;
            };
            // override to select items with the keyboard
            ComboBox.prototype._keydown = function (e) {
                // allow base class
                _super.prototype._keydown.call(this, e);
                // done if default prevented or read-only
                if (e.defaultPrevented || this.isReadOnly) {
                    return;
                }
                // not if the alt key is pressed (TFS 273476/272449)
                if (e.altKey) {
                    return;
                }
                // not if we have no items
                if (!wijmo.hasItems(this.collectionView)) {
                    return;
                }
                // if the input element is not visible, we're done (e.g. menu)
                if (this._elRef != this._tbx) {
                    return;
                }
                // not if we are a hidden grid editor ()
                if (this._isHiddenEditor()) {
                    return;
                }
                // special handling for Back/Delete/Up/Down keys (TFS 153089, 200212, 279218)
                this._delKey = 0;
                var start = this._getSelStart();
                switch (e.keyCode) {
                    // remember Back/Delete for use later in _setText
                    case wijmo.Key.Back:
                        if (this._bsCollapse && !this.isEditable) { // make sure the cursor moves
                            var end = this._getSelEnd();
                            if (start > 0 && end == this._tbx.value.length && wijmo.hasItems(this.collectionView)) {
                                this._setSelRange(start - 1, end);
                            }
                        }
                        this._delKey = e.keyCode;
                        break;
                    case wijmo.Key.Delete:
                        this._delKey = e.keyCode;
                        break;
                    // move up/down the list
                    case wijmo.Key.Up:
                    case wijmo.Key.Down:
                        if (start == this.text.length) {
                            start = 0;
                        }
                        this.selectedIndex = this._findNext(this.text.substr(0, start), e.keyCode == wijmo.Key.Up ? -1 : +1);
                        this._setSelRange(start, this.text.length);
                        e.preventDefault();
                        break;
                    case wijmo.Key.PageUp:
                        this._lbx._selectPrevPage();
                        this.selectAll(); // TFS 324167
                        e.preventDefault();
                        break;
                    case wijmo.Key.PageDown:
                        this._lbx._selectNextPage();
                        this.selectAll(); // TFS 324167
                        e.preventDefault();
                        break;
                }
            };
            // set selection range in input element (if it is visible)
            ComboBox.prototype._updateInputSelection = function (start) {
                var tbx = this._tbx;
                if (this._elRef == tbx) {
                    this._setSelRange(start, tbx.value.length);
                }
            };
            // get selection start in an extra-safe way (TFS 82372)
            ComboBox.prototype._getSelStart = function () {
                var tbx = this._tbx;
                return tbx && tbx.value ? tbx.selectionStart : 0;
            };
            // get selection end in an extra-safe way
            ComboBox.prototype._getSelEnd = function () {
                var tbx = this._tbx;
                return tbx && tbx.value ? tbx.selectionEnd : 0;
            };
            // set selection range in an extra-safe way
            ComboBox.prototype._setSelRange = function (start, end) {
                var tbx = this._tbx;
                if (this._elRef == tbx && !tbx.readOnly) {
                    wijmo.setSelectionRange(tbx, start, end);
                }
            };
            return ComboBox;
        }(input.DropDown));
        input.ComboBox = ComboBox;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        // globalization info
        wijmo._addCultureInfo('MultiSelect', {
            itemsSelected: '{count:n0} items selected',
            selectAll: 'Select All'
        });
        /**
         * The {@link MultiSelect} control allows users to select multiple items from
         * drop-down lists that contain custom objects or simple strings.
         *
         * The {@link MultiSelect} control extends {@link ComboBox}, with all the usual
         * properties, including {@link MultiSelect.itemsSource} and
         * {@link MultiSelect.displayMemberPath}.
         *
         * Like the {@link ListBox} control, it has a {@link MultiSelect.checkedMemberPath}
         * property that defines the name of the property that determines whether an
         * item is checked or not.
         *
         * The items currently checked (selected) can be obtained using the
         * {@link MultiSelect.checkedItems} property.
         *
         * The control header is fully customizable. By default, it shows up to two items
         * selected and the item count after that. You can change the maximum number of
         * items to display ({@link MultiSelect.maxHeaderItems}), the message shown when no
         * items are selected ({@link MultiSelect.placeholder}), and the format string used to
         * show the item count ({@link MultiSelect.headerFormat}).
         *
         * Alternatively, you can provide a function to generate the header content based
         * on whatever criteria your application requires ({@link MultiSelect.headerFormatter}).
         *
         * The example below shows how you can use a {@link MultiSelect} control to select
         * multiple items from a drop-down list:
         *
         * {@sample Input/MultiSelect/Overview Example}
         */
        var MultiSelect = /** @class */ (function (_super) {
            __extends(MultiSelect, _super);
            /**
             * Initializes a new instance of the {@link MultiSelect} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function MultiSelect(element, options) {
                var _this = _super.call(this, element) || this;
                _this._maxHdrItems = 2;
                _this._readOnly = false;
                _this._hdrFmt = null;
                // ** events
                /**
                 * Occurs when the value of the {@link checkedItems} property changes.
                 */
                _this.checkedItemsChanged = new wijmo.Event();
                wijmo.addClass(_this.hostElement, 'wj-multiselect');
                // make header element read-only, ListBox a multi-select
                _this._tbx.readOnly = true;
                _this.checkedMemberPath = null;
                // do NOT close the drop-down when the user clicks to select an item
                _this.removeEventListener(_this.dropDown, 'click');
                // update header when the itemsSource changes and when items are selected
                _this._lbx.itemsChanged.addHandler(function () {
                    _this._updateHeader();
                });
                _this._lbx.checkedItemsChanged.addHandler(function () {
                    _this._updateHeader();
                    _this.onCheckedItemsChanged();
                });
                // the default clickAction is Toggle (TFS 424882)
                _this.clickAction = input.ClickAction.Toggle;
                // initialize control options
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(MultiSelect.prototype, "showSelectAllCheckbox", {
                //** object model
                /**
                 * Gets or sets whether the control should display a "Select All" checkbox
                 * above the items to select or de-select all items.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._msLbx.showSelectAllCheckbox;
                },
                set: function (value) {
                    this._msLbx.showSelectAllCheckbox = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelect.prototype, "showFilterInput", {
                /**
                 * Gets or sets whether the control should display a "filter" input
                 * above the items to filter the items displayed.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._msLbx.showFilterInput;
                },
                set: function (value) {
                    this._msLbx.showFilterInput = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelect.prototype, "delay", {
                /**
                 * Gets or sets the delay, in milliseconds, between when a keystroke occurs
                 * and when the search is performed to update the filter.
                 *
                 * This property is relevant only when the {@link showFilterInput}
                 * property is set to **true**.
                 *
                 * The default value for this property is **500** milliseconds.
                 */
                get: function () {
                    return this._msLbx.delay;
                },
                set: function (value) {
                    this._msLbx.delay = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelect.prototype, "caseSensitiveSearch", {
                /**
                 * Gets or sets a value that determines whether searches performed
                 * while the user types should case-sensitive.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._msLbx.caseSensitiveSearch;
                },
                set: function (value) {
                    this._msLbx.caseSensitiveSearch = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelect.prototype, "filterInputPlaceholder", {
                /**
                 * Gets or sets the string used as a placeholder for the filter input
                 * element on the {@link MultiSelectListBox} drop-down.
                 *
                 * The default value for this property is **null**, which causes the
                 * control to use a localized version of the string "Filter".
                 */
                get: function () {
                    return this._msLbx.filterInputPlaceholder;
                },
                set: function (value) {
                    this._msLbx.filterInputPlaceholder = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelect.prototype, "checkOnFilter", {
                /**
                 * Gets or sets a value that determines whether the {@link MultiSelectListBox}
                 * in the drop-down should automatically select all the filtered items when the
                 * filter text changes.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._msLbx.checkOnFilter;
                },
                set: function (value) {
                    if (value != this.checkOnFilter) {
                        this._msLbx.checkOnFilter = wijmo.asBoolean(value);
                        this.checkedItems = [];
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelect.prototype, "selectAllLabel", {
                /**
                 * Gets or sets the string to be used as a label for the "Select All"
                 * checkbox that is displayed when the {@link showSelectAllCheckbox}
                 * property is set to true.
                 *
                 * The default value for this property is **null**, which causes the
                 * control to use a localized version of the string "Select All".
                 */
                get: function () {
                    return this._msLbx.selectAllLabel;
                },
                set: function (value) {
                    this._msLbx.selectAllLabel = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelect.prototype, "checkedMemberPath", {
                /**
                 * Gets or sets the name of the property used to control the checkboxes
                 * placed next to each item.
                 */
                get: function () {
                    return this._msLbx.checkedMemberPath;
                },
                set: function (value) {
                    this._msLbx.checkedMemberPath = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelect.prototype, "maxHeaderItems", {
                /**
                 * Gets or sets the maximum number of items to display on the control header.
                 *
                 * If no items are selected, the header displays the text specified by the
                 * {@link placeholder} property.
                 *
                 * If the number of selected items is smaller than or equal to the value of the
                 * {@link maxHeaderItems} property, the selected items are shown in the header.
                 *
                 * If the number of selected items is greater than {@link maxHeaderItems}, the
                 * header displays the selected item count instead.
                 *
                 * The default value for this property is **2**.
                 */
                get: function () {
                    return this._maxHdrItems;
                },
                set: function (value) {
                    if (this._maxHdrItems != value) {
                        this._maxHdrItems = wijmo.asNumber(value);
                        this._updateHeader();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelect.prototype, "headerFormat", {
                /**
                 * Gets or sets the format string used to create the header content
                 * when the control has more than {@link maxHeaderItems} items checked.
                 *
                 * The format string may contain the '{count}' replacement string
                 * which gets replaced with the number of items currently checked.
                 *
                 * The default value for this property is **null**, which causes the
                 * control to use a localized version of the string "{count:n0} items selected".
                 */
                get: function () {
                    return this._hdrFmt;
                },
                set: function (value) {
                    if (value != this._hdrFmt) {
                        this._hdrFmt = wijmo.asString(value);
                        this._updateHeader();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelect.prototype, "headerFormatter", {
                /**
                 * Gets or sets a function that gets the text displayed in the control
                 * header.
                 *
                 * By default, the control header content is determined based on the
                 * {@link placeholder}, {@link maxHeaderItems}, and on the current selection.
                 *
                 * You may customize the header content by specifying a function that
                 * returns a custom string based on whatever criteria your application
                 * requires.
                 */
                get: function () {
                    return this._hdrFormatter;
                },
                set: function (value) {
                    if (value != this._hdrFormatter) {
                        this._hdrFormatter = wijmo.asFunction(value);
                        this._updateHeader();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiSelect.prototype, "checkedItems", {
                /**
                 * Gets or sets an array containing the items that are currently checked.
                 */
                get: function () {
                    return this._msLbx.checkedItems;
                },
                set: function (value) {
                    this._msLbx.checkedItems = value == null ? [] : wijmo.asArray(value); // TFS 466864
                    this._updateHeader(); // TFS 462152
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link checkedItemsChanged} event.
             */
            MultiSelect.prototype.onCheckedItemsChanged = function (e) {
                this.checkedItemsChanged.raise(this, e);
            };
            //** overrides
            // dispose of drop-down listbox (contained in the drop-down, TFS 387515)
            MultiSelect.prototype.dispose = function () {
                this._lbx.dispose();
                _super.prototype.dispose.call(this);
            };
            // focus on ListBox after dropping down
            MultiSelect.prototype.onIsDroppedDownChanged = function (e) {
                var _this = this;
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                setTimeout(function () {
                    if (_this.isDroppedDown && _this.containsFocus()) {
                        if (_this.showFilterInput && !_this.isTouching) {
                            _this._msLbx._filter.focus();
                        }
                        else {
                            var lbx = _this.listBox;
                            // select the first checked item if we have no selection,
                            // or item 0 if there are no checked items (TFS 467046)
                            if (lbx.selectedIndex < 0) {
                                var index = 0, items = lbx.checkedItems;
                                if (items.length) {
                                    index = lbx.collectionView.items.indexOf(items[0]);
                                }
                                lbx.selectedIndex = Math.max(0, index);
                            }
                            // now show selection and get the focus
                            lbx.showSelection(true);
                            lbx.focus();
                        }
                    }
                });
            };
            // create the drop-down element
            MultiSelect.prototype._createDropDown = function () {
                // create child MultiSelectListBox control
                var msLbxHost = wijmo.createElement('<div></div>', this._dropDown);
                this._msLbx = new input.MultiSelectListBox(msLbxHost);
                // let base class do its thing
                this._lbx = this._msLbx.listBox;
                _super.prototype._createDropDown.call(this);
            };
            Object.defineProperty(MultiSelect.prototype, "isReadOnly", {
                // override since our input is always read-only
                get: function () {
                    return this._readOnly;
                },
                set: function (value) {
                    this._readOnly = wijmo.asBoolean(value);
                    wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
                },
                enumerable: true,
                configurable: true
            });
            // update header when refreshing
            MultiSelect.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.hostElement) {
                    this._updateHeader();
                }
            };
            // our textbox is read-only!
            MultiSelect.prototype._setText = function (text, fullMatch) {
                // keep existing text
            };
            // override to toggle checkboxes and to show drop-down
            MultiSelect.prototype._keydown = function (e) {
                _super.prototype._keydown.call(this, e);
                // ignore keys while we are hidden (inactive grid editor, TFS 466837)
                if (wijmo.hasClass(this._tbx, 'wj-grid-ime')) {
                    return;
                }
                if (!e.defaultPrevented && wijmo.hasItems(this.collectionView)) {
                    if (e.keyCode > 32) {
                        this.isDroppedDown = true;
                    }
                }
            };
            // if we're filtering the data and get no matches, we still have items...
            MultiSelect.prototype._hasItems = function () {
                var view = this.collectionView, src = view ? view.sourceCollection : null;
                return wijmo.hasItems(view) || (src && src.length && this.showFilterInput);
            };
            //** implementation
            // update the value of the control header
            MultiSelect.prototype._updateHeader = function () {
                // update the header
                var hdr = '';
                if (wijmo.isFunction(this._hdrFormatter)) {
                    hdr = this._hdrFormatter(this);
                }
                else {
                    var items = this.checkedItems;
                    if (items.length > 0) {
                        if (items.length <= this._maxHdrItems) {
                            if (this.headerPath) { // TFS 139319
                                var binding_1 = new wijmo.Binding(this.headerPath);
                                items = items.map(function (item) { return binding_1.getValue(item); });
                            }
                            else if (this.displayMemberPath) {
                                var binding_2 = new wijmo.Binding(this.displayMemberPath);
                                items = items.map(function (item) { return binding_2.getValue(item); });
                            }
                            if (this.isContentHtml) { // TFS 367510
                                items = items.map(function (item) { return wijmo.toPlainText(item); });
                            }
                            if (this.trimText) { // TFS 417095
                                items = items.map(function (item) { return item ? item.toString().trim() : ''; });
                            }
                            hdr = items.join(', ');
                        }
                        else {
                            hdr = wijmo.format(this.headerFormat || wijmo.culture.MultiSelect.itemsSelected, {
                                count: items.length
                            });
                        }
                    }
                }
                // apply the updated header
                var tbx = this.inputElement;
                if (hdr != tbx.value) {
                    tbx.value = hdr;
                    this.onTextChanged();
                }
                // update wj-state attributes
                this._updateState();
            };
            MultiSelect._DEF_CHECKED_PATH = '$checked';
            return MultiSelect;
        }(input.ComboBox));
        input.MultiSelect = MultiSelect;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The {@link Menu} control shows a text element with a drop-down list of commands that
         * the user can invoke by click or touch.
         *
         * The {@link Menu} control inherits from {@link ComboBox}, so you populate and style it
         * in the same way that you do the {@link ComboBox} (see the {@link Menu.itemsSource}
         * property).
         *
         * The {@link Menu} control adds an {@link Menu.itemClicked} event that fires when the user
         * selects an item from the menu. The event handler can inspect the {@link Menu} control
         * to determine which item was clicked. For example:
         *
         * ```typescript
         * import { Menu } from '@grapecity/wijmo.input';
         * let menu = new Menu('#theMenu', {
         *     header: 'Main Menu',
         *     itemsSource: ['option 1', 'option 2', 'option 3'],
         *     itemClicked: s => {
         *         alert('Thanks for selecting item ' + s.selectedIndex + ' from menu ' + s.header + '!');
         *     }
         * });
         * ```
         *
         * The example below shows how you can create menus that handle the
         * {@link itemClicked} event.
         *
         * {@sample Input/Menu/Overview Example}
         */
        var Menu = /** @class */ (function (_super) {
            __extends(Menu, _super);
            /**
             * Initializes a new instance of the {@link Menu} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function Menu(element, options) {
                var _this = _super.call(this, element) || this;
                _this._closing = false;
                _this._cmd = null;
                _this._cmdPath = null;
                _this._cmdParamPath = null;
                _this._subPath = null;
                _this._owner = null;
                _this._isButton = false;
                _this._openOnHover = false;
                _this._closeOnLeave = true;
                _this._subMenu = null;
                _this._hoverEnterBnd = _this._hoverEnter.bind(_this);
                _this._hoverLeaveBnd = _this._hoverLeave.bind(_this);
                _this._hoverOverBnd = _this._hoverOver.bind(_this);
                /**
                 * Occurs when the user picks an item from the menu.
                 *
                 * The handler can determine which item was picked by reading the event sender's
                 * {@link selectedIndex} property.
                 */
                _this.itemClicked = new wijmo.Event();
                // add css class name
                var host = _this.hostElement, tbx = _this._tbx, lbx = _this._lbx, dropDown = _this.dropDown;
                wijmo.addClass(host, 'wj-menu');
                // replace textbox with header div
                tbx.style.display = 'none';
                var tpl = '<div wj-part="header" class="wj-form-control"/>';
                _this._hdr = _this._elRef = wijmo.createElement(tpl);
                tbx.parentElement.insertBefore(_this._hdr, _this._tbx);
                // restore original tabIndex (or zero) since applyTemplate set it to -1
                var rxIdx = _this._orgOuter.match(/tabindex="?(-?\d+)"?/i);
                host.tabIndex = rxIdx ? parseInt(rxIdx[1]) : 0;
                // this is not required
                _this.isRequired = false;
                // accessibility:
                // https://www.w3.org/TR/wai-aria-1.1/#menu
                // http://oaa-accessibility.org/examples/role/85/
                wijmo.setAttribute(host, 'role', 'menubar', true);
                wijmo.setAttribute(tbx, 'role', null);
                wijmo.setAttribute(tbx, 'aria-autocomplete', null);
                wijmo.setAttribute(tbx, 'aria-owns', null);
                wijmo.setAttribute(dropDown, 'role', 'menu');
                lbx.itemRole = 'menuitem';
                // initializing from <select> tag
                if (_this._orgTag == 'SELECT') {
                    _this.header = host.getAttribute('header');
                    if (_this._lbx.itemsSource) {
                        _this.commandParameterPath = 'cmdParam';
                    }
                }
                // change some defaults
                _this.isContentHtml = true;
                _this.maxDropDownHeight = 500;
                // toggle drop-down when clicking on the header
                // or fire the click event if this menu is a split-button
                _this.addEventListener(_this._hdr, 'click', function (e) {
                    if (!e.defaultPrevented) {
                        _this._clearHover(e);
                        if (_this._isButton) {
                            _this.isDroppedDown = false;
                            _this._raiseCommand();
                        }
                        else {
                            _this.isDroppedDown = !_this.isDroppedDown;
                        }
                    }
                });
                // close menu when dropdown loses focus (TFS 302760)
                lbx.lostFocus.addHandler(function () {
                    if (!_this.containsFocus()) {
                        _this.isDroppedDown = false;
                    }
                });
                // custom item formatter
                wijmo.addClass(dropDown, 'wj-menu-items');
                lbx.formatItem.addHandler(_this._formatMenuItem.bind(_this));
                // initialize control options
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(Menu.prototype, "header", {
                /**
                 * Gets or sets the HTML text shown in the {@link Menu} element.
                 *
                 * The default value for this property is an empty string (**''**).
                 */
                get: function () {
                    return this._hdr.innerHTML;
                },
                set: function (value) {
                    this._hdr.innerHTML = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Menu.prototype, "command", {
                /**
                 * Gets or sets the command object that determines whether menu items
                 * should be enabled and what actions they should perform when selected.
                 *
                 * Command objects implement the {@link ICommand} interface.
                 *
                 * You can also set commands on individual items using the {@link commandPath}
                 * property.
                 *
                 * The default value for this property is **null**.
                 */
                get: function () {
                    return this._cmd;
                },
                set: function (value) {
                    this._cmd = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Menu.prototype, "commandPath", {
                /**
                 * Gets or sets the name of the property that contains the command to
                 * execute when the user clicks an item.
                 *
                 * Command objects implement the {@link ICommand} interface.
                 *
                 * This property overrides the {@link command} property for specific
                 * menu items.
                 *
                 * The default value for this property is **null**.
                 */
                get: function () {
                    return this._cmdPath;
                },
                set: function (value) {
                    this._cmdPath = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Menu.prototype, "commandParameterPath", {
                /**
                 * Gets or sets the name of the property that contains a parameter to use with
                 * the command specified by the {@link commandPath} property.
                 *
                 * Command objects implement the {@link ICommand} interface.
                 *
                 * The default value for this property is **null**.
                 */
                get: function () {
                    return this._cmdParamPath;
                },
                set: function (value) {
                    this._cmdParamPath = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Menu.prototype, "subItemsPath", {
                /**
                 * Gets or sets the name of the property that contains an array with items
                 * to be displayed in a sub-menu.
                 *
                 * The default value for this property is **null**.
                 */
                get: function () {
                    return this._subPath;
                },
                set: function (value) {
                    if (value != this._subPath) {
                        this._subPath = value;
                        this.refresh(true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Menu.prototype, "openOnHover", {
                /**
                 * Gets or sets a value that determines whether the menu (and any sub-menus)
                 * should open automatically when the mouse hovers over the items.
                 *
                 * See also the {@link closeOnLeave} property, which determines whether the
                 * menu should close automatically when the mouse leaves the menu.
                 *
                 * The default value for this property is **false**.
                 */
                get: function () {
                    return this._openOnHover;
                },
                set: function (value) {
                    this._openOnHover = wijmo.asBoolean(value);
                    this._updateHoverEvents();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Menu.prototype, "closeOnLeave", {
                /**
                 * Gets or sets a value that determines whether the menu (and any sub-menus)
                 * should close automatically when the mouse leaves the menu.
                 *
                 * This property is applicable only when the {@link openOnHover} is set to true.
                 *
                 * The default value for this property is **true**.
                 */
                get: function () {
                    return this._closeOnLeave;
                },
                set: function (value) {
                    this._closeOnLeave = wijmo.asBoolean(value);
                    this._updateHoverEvents();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Menu.prototype, "isButton", {
                /**
                 * Gets or sets a value that determines whether this {@link Menu} should act
                 * as a split button instead of a regular menu.
                 *
                 * The default value for this property is **false**.
                 *
                 * The difference between regular menus and split buttons is what happens
                 * when the user clicks the menu header.
                 * In regular menus, clicking the header shows or hides the menu options.
                 * In split buttons, clicking the header raises the {@link Menu.itemClicked}
                 * event and/or invokes the command associated with the last option selected by
                 * the user as if the user had picked the item from the drop-down list.
                 *
                 * If you want to differentiate between clicks on menu items and the button
                 * part of a split button, check the value of the {@link Menu.isDroppedDown}
                 * property of the event sender. If that is true, then a menu item was clicked;
                 * if it is false, then the button was clicked.
                 *
                 * For example, the code below implements a split button that uses the drop-down
                 * list only to change the default item/command, and triggers actions only when
                 * the button is clicked:
                 *
                 * ```typescript
                 * import { Menu } from '@grapecity/wijmo.input';
                 * let theMenu = new Menu('#theMenu', {
                 *     isButton: true,
                 *     itemClicked: s => {
                 *         if (!s.isDroppedDown) { // header/button click
                 *             console.log('running ', s.selectedItem.browser);
                 *         }
                 *     },
                 *     selectedIndexChanged: s => { // update header text
                 *         if (s.selectedItem != null) {
                 *             s.header = 'Run ' + s.selectedItem.browser;
                 *         }
                 *     },
                 *     selectedValuePath: 'id',
                 *     displayMemberPath: 'browser',
                 *     itemsSource: [
                 *         { id: 0, browser: 'Chrome' },
                 *         { id: 1, browser: 'Edge' },
                 *         { id: 2, browser: 'Firefox' },
                 *         { id: 3, browser: 'Internet Explorer' }
                 *     ],
                 * });
                 * ```
                 */
                get: function () {
                    return this._isButton;
                },
                set: function (value) {
                    this._isButton = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Menu.prototype, "owner", {
                /**
                 * Gets or sets the element that owns this {@link Menu}.
                 *
                 * This property is set by the wj-context-menu directive in case a
                 * single  menu is used as a context menu for several different
                 * elements.
                 *
                 * The default value for this property is **null**.
                 */
                get: function () {
                    return this._owner;
                },
                set: function (value) {
                    this._owner = wijmo.asType(value, HTMLElement, true);
                    this._enableDisableItems(); // TFS 122978
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Shows the menu at a given location.
             *
             * @param position An optional **MouseEvent** or reference element
             * that determines the position where the menu should be displayed.
             * If not provided, the menu is displayed at the center of the screen.
        
             * This method is useful if you want to use the menu as a context
             * menu attached to one or more elements on the page. For example:
             *
             * ```typescript
             * import { Menu } from '@grapecity/wijmo.input';
             * let theMenu = new Menu(document.createElement('div'), {
             *     itemsSource: 'New,Open,Save,Exit'.split(','),
             *     itemClicked: s => {
             *         alert('thanks for picking ' + s.selectedIndex);
             *     }
             * });
             *
             * // use it as a context menu for one or more elements
             * let element = document.getElementById('btn');
             * element.addEventListener('contextmenu', e => {
             *     e.preventDefault();
             *     theMenu.show(e);
             * });
             * ```
             * You can adjust the position of the menu by setting the margin of
             * the menu's dropdown. For example, the code below causes the menu
             * to be displayed 20 pixels away from the point that was clicked:
             *
             * ```typescript
             * // add 20-pixel offset to the menu
             * theMenu.dropDown.style.margin = '20px';
             *
             * // show menu as a context menu
             * let element = document.getElementById('btn');
             * element.addEventListener('contextmenu', e => {
             *     e.preventDefault();
             *     theMenu.show(e);
             * });
             * ```
             */
            Menu.prototype.show = function (position) {
                if (!this.isDroppedDown) {
                    this.selectedIndex = -1;
                    if (this.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                        var dd = this.dropDown, owner = this.owner;
                        // set owner
                        if (!owner && position instanceof MouseEvent) { // TFS 378213
                            owner = position.target;
                        }
                        if (owner instanceof HTMLElement) {
                            dd[wijmo.Control._OWNR_KEY] = owner;
                        }
                        // if openOnHover and closeOnLeave are true, menu should 
                        // cover the current mouse position (TFS 415135, 444762)
                        if (position instanceof MouseEvent) {
                            if (this.openOnHover && this.closeOnLeave) {
                                var offset = 2;
                                position = new wijmo.Point(position.pageX - pageXOffset - offset, position.pageY - pageYOffset - offset);
                            }
                        }
                        // show the menu
                        wijmo.showPopup(dd, position, false, this.isAnimated);
                        this.onIsDroppedDownChanged();
                        dd.focus();
                    }
                }
            };
            /**
             * Hides the menu.
             *
             * This method is useful if you want to hide a context menu displayed
             * with the {@link show} method.
             */
            Menu.prototype.hide = function () {
                if (this.isDroppedDown) {
                    if (this.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                        wijmo.hidePopup(this.dropDown);
                        this.onIsDroppedDownChanged();
                    }
                }
            };
            /**
             * Raises the {@link itemClicked} event.
             */
            Menu.prototype.onItemClicked = function (e) {
                this.itemClicked.raise(this, e);
            };
            // ** overrides
            // override refresh to enable/disable items (TFS 302993)
            Menu.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.hostElement) {
                    this._enableDisableItems();
                }
            };
            // override onIsDroppedDownChanged to clear the selection when showing the menu
            Menu.prototype.onIsDroppedDownChanged = function (e) {
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                if (this.isDroppedDown) {
                    // suspend events
                    this._closing = true;
                    // save current item in case the user presses the split button
                    // while the drop-down is open (TFS 119513)
                    this._defaultItem = this.selectedItem;
                    // reset menu
                    this.isRequired = false;
                    this.selectedIndex = -1;
                    // enable/disable items
                    this._enableDisableItems();
                    // restore events
                    this._closing = false;
                    // move focus to the list so users can select with the keyboard
                    this.dropDown.focus();
                }
                else {
                    // closed the drop-down, make sure we have a selected item (TFS 122720)
                    if (!this.selectedItem) {
                        this.selectedItem = this._defaultItem;
                    }
                    // and make sure any sub-menus are closed (TFS 385244)
                    var subMenu = this._subMenu;
                    if (subMenu) {
                        subMenu.isDroppedDown = false;
                    }
                }
            };
            // ** implementation
            // update enter/leave events
            Menu.prototype._updateHoverEvents = function () {
                // remove event listeners just in case
                var host = this.hostElement, dropDown = this.dropDown, addListener = this.addEventListener.bind(this), removeListener = this.removeEventListener.bind(this), enter = 'mouseenter', over = 'mouseover', leave = 'mouseleave';
                // always remove event listeners just in case
                removeListener(host, enter, this._hoverEnterBnd);
                removeListener(host, leave, this._hoverLeaveBnd);
                removeListener(dropDown, over, this._hoverOverBnd);
                removeListener(dropDown, leave, this._hoverLeaveBnd);
                // add event listeners if necessary
                if (this._openOnHover) {
                    addListener(host, enter, this._hoverEnterBnd);
                    addListener(dropDown, over, this._hoverOverBnd);
                    if (this._closeOnLeave) {
                        addListener(host, leave, this._hoverLeaveBnd);
                        addListener(dropDown, leave, this._hoverLeaveBnd);
                    }
                }
            };
            // get the current menu item's sub-items
            Menu.prototype._getSubItems = function (item) {
                var path = this.subItemsPath, items = item && path ? item[path] : null;
                return wijmo.isArray(items) && items.length ? items : null;
            };
            // to support sub-menus and separators
            Menu.prototype._formatMenuItem = function (s, e) {
                var item = e.item, items = this._getSubItems(e.data);
                if (items) {
                    wijmo.addClass(item, 'wj-subitems');
                }
                else if (item.innerHTML == '-') {
                    item.innerHTML = '';
                    wijmo.addClass(item, 'wj-separator');
                }
            };
            // override to raise itemClicked on Enter (when open) or 
            // to open the drop-down (when closed) TFS 206344
            // also open/close sub-menus on enter/right/left keys.
            Menu.prototype._keydown = function (e) {
                if (!e.defaultPrevented) {
                    // handle RTL
                    var keyCode = this._getKeyCode(e);
                    // expand sub-menus on Enter/Right, collapse on Left
                    if (this.isDroppedDown) {
                        switch (keyCode) {
                            case wijmo.Key.Enter:
                            case wijmo.Key.Right:
                                if (this._showSubMenu()) {
                                    e.preventDefault();
                                    return;
                                }
                                break;
                            case wijmo.Key.Left:
                                var owner = wijmo.Control.getControl(this.owner);
                                if (owner instanceof Menu) {
                                    var dd = owner.dropDown, idx = owner.selectedIndex, item = idx > -1 ? dd.children[idx] : dd;
                                    item.focus();
                                    e.preventDefault();
                                    return;
                                }
                                break;
                        }
                    }
                    // regular handling: open/close the menu on enter
                    if (keyCode == wijmo.Key.Enter) {
                        if (this.isDroppedDown) {
                            if (this.selectedIndex > -1) { // TFS 438532
                                this._raiseCommand();
                            }
                        }
                        else {
                            this.isDroppedDown = true;
                            e.preventDefault();
                        }
                    }
                }
                _super.prototype._keydown.call(this, e);
            };
            // raise command and close drop-down when an item is clicked
            Menu.prototype._dropDownClick = function (e) {
                if (!e.defaultPrevented && e.target != this.dropDown) { // TFS 254447
                    this._clearHover(e);
                    // handle sub-menus
                    if (this._showSubMenu()) {
                        e.preventDefault();
                        return;
                    }
                    // raise command
                    if (this.selectedIndex > -1) { // TFS 438532, 444296
                        this._raiseCommand();
                    }
                }
                _super.prototype._dropDownClick.call(this, e); // allow base class
            };
            // show a sub-menu
            Menu.prototype._showSubMenu = function () {
                var _this = this;
                // get sub-items, bail if none
                var items = this._getSubItems(this.selectedItem);
                if (!items) {
                    return null;
                }
                // calculate sub-menu position, bail if none
                var target = this.dropDown.children[this.selectedIndex], rc = target.getBoundingClientRect(), pt = new wijmo.Point(rc.right, rc.top);
                if (rc.height == 0) {
                    return null; // parent item not visible
                }
                // account for RTL
                var rtl = this.rightToLeft || this.dropDown.getAttribute('dir') == 'rtl';
                if (rtl) {
                    pt.x = rc.left;
                }
                // close any previous submenus (TFS 385244)
                var subMenu = this._subMenu;
                if (subMenu) {
                    subMenu.isDroppedDown = false;
                }
                // create sub-menu
                subMenu = new Menu(document.createElement('div'), {
                    owner: this.hostElement,
                    itemsSource: items,
                    itemClicked: function (s, e) {
                        _this.itemClicked.raise(s, e); // propagate itemClicked to parent menu
                    },
                    formatItem: function (s, e) {
                        _this.formatItem.raise(s, e); // propagate formatItem to parent menu (TFS 470600)
                    }
                });
                // if we have a filter, apply it to the sub-menu
                var cv = this.collectionView, cvSub = subMenu.collectionView;
                if (cv && cv.filter && cvSub && !cvSub.filter) {
                    cvSub.filter = cv.filter;
                }
                // copy relevant properties from main menu
                var props = 'displayMemberPath,selectedValuePath,isContentHtml,command,commandPath,commandParameterPath,maxDropDownWidth,maxDropDownHeight,dropDownCssClass,isAnimated,subItemsPath,openOnHover,closeOnLeave'.split(',');
                props.forEach(function (prop) {
                    subMenu[prop] = _this[prop];
                });
                // show the sub-menu
                var dd = subMenu.dropDown;
                wijmo.setAttribute(dd, 'dir', rtl ? 'rtl' : null);
                subMenu.show(pt);
                dd[wijmo.Control._OWNR_KEY] = this.dropDown;
                dd.focus();
                // done
                return subMenu;
            };
            // raise itemClicked and/or invoke the current command
            Menu.prototype._raiseCommand = function (e) {
                // execute command if available
                var item = this.selectedItem, items = this._getSubItems(item), cmd = this._getCommand(item);
                if (cmd && !items) {
                    var parm = this._getCommandParm(item);
                    if (!this._canExecuteCommand(cmd, parm)) {
                        return; // command not currently available
                    }
                    this._executeCommand(cmd, parm);
                }
                // update header
                var hdrPath = this.headerPath;
                if (hdrPath) {
                    var bnd = new wijmo.Binding(hdrPath), hdr = bnd.getValue(item);
                    hdr = (hdr == null) ? '' : hdr.toString(); // TFS 139319
                    this.header = this.isContentHtml ? hdr : wijmo.escapeHtml(hdr);
                }
                // raise itemClicked
                this.onItemClicked(e);
                // keep focus on the menu after clicking on an item
                if (this.containsFocus()) {
                    // find top-level menu
                    var menu = this;
                    while (menu && menu.owner) {
                        var topMenu = wijmo.Control.getControl(menu.owner);
                        if (!(topMenu instanceof Menu)) {
                            break;
                        }
                        menu = topMenu;
                    }
                    // get menu owner (context-sensitive menu)
                    var owner = menu.owner;
                    if (!owner && menu.dropDown) {
                        owner = menu.dropDown[wijmo.Control._OWNR_KEY];
                    }
                    // close menu and give it the focus
                    menu.isDroppedDown = false;
                    menu.focus();
                    // context menus can't get focus when closed... (TFS 361606)
                    if (!menu.containsFocus()) {
                        if (owner instanceof HTMLElement && owner.offsetHeight) {
                            if (wijmo.isIE) { // C1WEB_27346
                                var doc = document.documentElement, x = doc.scrollLeft, y = doc.scrollTop;
                                owner.focus();
                                doc.scrollLeft = x, // scrollTo not supported in IE
                                    doc.scrollTop = y;
                            }
                            else {
                                owner.focus();
                            }
                        }
                    }
                }
            };
            // gets the command to be executed when an item is clicked
            Menu.prototype._getCommand = function (item) {
                var cmd = item && this._cmdPath ? item[this._cmdPath] : null;
                return cmd ? cmd : this._cmd;
            };
            Menu.prototype._getCommandParm = function (item) {
                var key = this._cmdParamPath;
                return item && key ? item[key] : item;
            };
            // execute a command
            // cmd may be an object that implements the ICommand interface or it may be just a function
            // parm is an optional parameter passed to the command.
            Menu.prototype._executeCommand = function (cmd, parm) {
                if (cmd && !wijmo.isFunction(cmd)) {
                    cmd = cmd['executeCommand'];
                }
                if (wijmo.isFunction(cmd)) {
                    cmd(parm);
                }
            };
            // checks whether a command can be executed
            Menu.prototype._canExecuteCommand = function (cmd, parm) {
                if (cmd) {
                    var x = cmd['canExecuteCommand'];
                    if (wijmo.isFunction(x)) {
                        return x(parm);
                    }
                }
                return true;
            };
            // enable/disable the menu options
            Menu.prototype._enableDisableItems = function () {
                if (this.collectionView && (this._cmd || this._cmdPath)) {
                    var items = this.collectionView.items;
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i], cmd = this._getCommand(item);
                        if (cmd) {
                            var el = this._lbx.hostElement.children[i], parm = this._getCommandParm(item);
                            wijmo.toggleClass(el, 'wj-state-disabled', !this._canExecuteCommand(cmd, parm));
                        }
                    }
                }
            };
            // open/close on hover
            Menu.prototype._clearHover = function (e) {
                if (this._toHover) {
                    clearTimeout(this._toHover);
                }
                this._toHover = null;
                Menu._evtHover = e;
            };
            Menu.prototype._isTargetDisabled = function (e) {
                return wijmo.hasClass(e.target, 'wj-state-disabled');
            };
            Menu.prototype._hoverEnter = function (e) {
                var _this = this;
                this._clearHover(e);
                this._toHover = setTimeout(function () {
                    _this._toHover = null;
                    _this.isDroppedDown = true;
                }, wijmo.Control._HOVER_DELAY);
            };
            Menu.prototype._hoverOver = function (e) {
                var _this = this;
                this._clearHover(e);
                this._toHover = setTimeout(function () {
                    _this._toHover = null;
                    var index = _this.listBox.indexOf(e.target);
                    if (index > -1 && !wijmo.hasClass(e.target, 'wj-state-disabled')) {
                        _this.selectedIndex = index;
                        _this._subMenu = _this._showSubMenu();
                    }
                }, wijmo.Control._HOVER_DELAY);
            };
            Menu.prototype._hoverLeave = function (e) {
                var _this = this;
                this._clearHover(e);
                if (this.isDroppedDown) {
                    this._toHover = setTimeout(function () {
                        e = Menu._evtHover;
                        var efp = e ? document.elementFromPoint(e.clientX, e.clientY) : null, menu = wijmo.closest(efp, '.wj-listbox.wj-menu-items'), subMenu = _this._subMenu;
                        if (!menu && !wijmo.contains(_this.hostElement, efp, true)) {
                            _this.isDroppedDown = false;
                            if (subMenu) {
                                subMenu.isDroppedDown = false;
                            }
                        }
                    }, wijmo.Control._LEAVE_DELAY);
                }
            };
            return Menu;
        }(input.ComboBox));
        input.Menu = Menu;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The {@link InputTime} control allows users to enter times using any format
         * supported by the {@link Globalize} class, or to pick times from a drop-down
         * list.
         *
         * The {@link min}, {@link max}, and {@link step} properties determine the values shown
         * in the list.
         *
         * For details about using the {@link min} and {@link max} properties, please see the
         * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
         *
         * The {@link value} property gets or sets a {@link Date} object that represents the time
         * selected by the user.
         *
         * The example below shows a **Date** value (that includes date and time information)
         * using an {@link InputDate} and an {@link InputTime} control. Notice how both controls
         * are bound to the same controller variable, and each edits the appropriate information
         * (either date or time).
         *
         * {@sample Input/InputTime/Overview/purejs Example}
         */
        var InputTime = /** @class */ (function (_super) {
            __extends(InputTime, _super);
            /**
             * Initializes a new instance of the {@link InputTime} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function InputTime(element, options) {
                var _this = _super.call(this, element) || this;
                _this._format = 't';
                /**
                 * Occurs when the value of the {@link value} property changes, either
                 * as a result of user actions or by assignment in code.
                 */
                _this.valueChanged = new wijmo.Event();
                wijmo.addClass(_this.hostElement, 'wj-inputtime');
                // editable by default
                _this.isEditable = true;
                // initialize value (current date)
                _this._value = wijmo.DateTime.newDate();
                _this._min = _this._max = null;
                // initialize mask provider
                _this._msk = new wijmo._MaskProvider(_this._tbx);
                // default to numeric keyboard (like InputNumber), unless this is IE9...
                if (!wijmo.isIE9()) {
                    _this._tbx.type = 'tel';
                }
                // initializing from <input> tag
                if (_this._orgTag == 'INPUT') {
                    var value = _this._tbx.getAttribute('value');
                    if (value) {
                        _this.value = wijmo.Globalize.parseDate(value, 'HH:mm:ss');
                    }
                }
                // friendly defaults
                _this.step = 15;
                _this.autoExpandSelection = true;
                // initialize control options
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(InputTime.prototype, "inputElement", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets the HTML input element hosted by the control.
                 *
                 * Use this property in situations where you want to customize the
                 * attributes of the input element.
                 */
                get: function () {
                    return this._tbx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "inputType", {
                /**
                 * Gets or sets the "type" attribute of the HTML input element hosted by the control.
                 *
                 * By default, this property is set to "tel", a value that causes mobile devices to
                 * show a numeric keypad that includes a negative sign and a decimal separator.
                 *
                 * Use this property to change the default setting if the default does not work well
                 * for the current culture, device, or application. In those cases, try changing
                 * the value to "number" or "text."
                 *
                 * Note that input elements with type "number" prevent selection in Chrome and therefore
                 * is not recommended. For more details, see this link:
                 * https://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
                 */
                get: function () {
                    return this._tbx.type;
                },
                set: function (value) {
                    this._tbx.type = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "value", {
                /**
                 * Gets or sets the current input time.
                 */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    // check type
                    value = wijmo.asDate(value, !this.isRequired);
                    // honor ranges (but keep the dates)
                    if (value) {
                        value = this._clamp(value);
                    }
                    // update control
                    this._setText(value ? wijmo.Globalize.format(value, this.format) : '', true);
                    if (this.selectedItem && this.selectedItem.value) { // TFS 302483
                        value = wijmo.DateTime.fromDateTime(value, this.selectedItem.value);
                    }
                    if (value != this._value && !wijmo.DateTime.equals(value, this._value)) {
                        this._value = value;
                        this.onValueChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "text", {
                /**
                 * Gets or sets the text shown in the control.
                 */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._setText(value, true);
                        this._commitText();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "min", {
                /**
                 * Gets or sets the earliest time that the user can enter.
                 *
                 * For details about using the {@link min} and {@link max} properties, please see the
                 * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    this._min = wijmo.asDate(value, true);
                    this.isDroppedDown = false;
                    this._updateItems();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "max", {
                /**
                 * Gets or sets the latest time that the user can enter.
                 *
                 * For details about using the {@link min} and {@link max} properties, please see the
                 * <a href="/wijmo/docs/Topics/Input/Using-Min-Max">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    this._max = wijmo.asDate(value, true);
                    this.isDroppedDown = false;
                    this._updateItems();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "step", {
                /**
                 * Gets or sets the number of minutes between entries in the drop-down list.
                 *
                 * The default value for this property is **15** minutes.
                 *
                 * Setting it to **null**, zero, or any negative value disables the drop-down.
                 *
                 * Only the integer part of the step value is used. Setting **step** to
                 * **30.5** for example will create **30** minute intervals.
                 */
                get: function () {
                    return this._step;
                },
                set: function (value) {
                    if (value != this.step) {
                        this._step = wijmo.asNumber(value, true);
                        this.isDroppedDown = false;
                        this._updateItems();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "format", {
                /**
                 * Gets or sets the format used to display the selected time (see {@link Globalize}).
                 *
                 * The format string is expressed as a .NET-style
                 * <a href="https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings" target="_blank">
                 * time format string</a>.
                 *
                 * The default value for this property is **'t'** (short time pattern).
                 */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this.format) {
                        this._format = wijmo.asString(value);
                        this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                        if (wijmo.hasItems(this.collectionView)) {
                            this._updateItems();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "mask", {
                /**
                 * Gets or sets a mask to use while the user is editing.
                 *
                 * The mask format is the same used by the {@link wijmo.input.InputMask}
                 * control.
                 *
                 * If specified, the mask must be compatible with the value of
                 * the {@link format} property. For example, you can use the mask '99:99 >LL'
                 * for entering short times (format 't').
                 */
                get: function () {
                    return this._msk.mask;
                },
                set: function (value) {
                    this._msk.mask = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link valueChanged} event.
             */
            InputTime.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };
            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // remember whether we have custom items on the list
            InputTime.prototype.onItemsSourceChanged = function (e) {
                _super.prototype.onItemsSourceChanged.call(this, e);
                this._hasCustomItems = this.itemsSource != null;
            };
            // update value display in case culture changed
            InputTime.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.hostElement) {
                    this._msk.refresh();
                    this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                    this._updateItems();
                }
            };
            // commit changes when the user picks a value from the list
            InputTime.prototype.onSelectedIndexChanged = function (e) {
                if (this.selectedIndex > -1 && !this._settingText) {
                    var value = this.value ? this.value : wijmo.DateTime.newDate(), selValue = this.selectedItem.value != null
                        ? this.selectedItem.value
                        : wijmo.Globalize.parseDate(this.text, this.format, this.value);
                    this.value = wijmo.DateTime.fromDateTime(value, selValue);
                }
                _super.prototype.onSelectedIndexChanged.call(this, e);
            };
            // clamps a date to a value between min and max
            InputTime.prototype._clamp = function (value) {
                if (this._min != null && this._getTime(value) < this._getTime(this._min)) {
                    value = wijmo.DateTime.fromDateTime(value, this._min);
                }
                if (this._max != null && this._getTime(value) > this._getTime(this._max)) {
                    value = wijmo.DateTime.fromDateTime(value, this._max);
                }
                return value;
            };
            // honor wheel when there's no selected item (TFS 320721)
            InputTime.prototype._wheel = function (e) {
                if (!e.defaultPrevented && !this.isDroppedDown && !this.isReadOnly && this.containsFocus()) {
                    if (this.selectedIndex < 0 && this.value && wijmo.isNumber(this.step) && this.step > 0) {
                        var value = wijmo.DateTime.addMinutes(this.value, this.step * wijmo.clamp(e.deltaY, -1, +1));
                        this.value = this._clamp(value);
                        this.selectAll();
                        e.preventDefault();
                    }
                }
                _super.prototype._wheel.call(this, e);
            };
            // set selection range in input element (if it is visible)
            InputTime.prototype._updateInputSelection = function (start) {
                if (this._delKey) {
                    _super.prototype._updateInputSelection.call(this, start);
                }
                else {
                    var val = this._tbx.value;
                    while (start < val.length && !val[start].match(/[a-z0-9]/i)) {
                        start++;
                    }
                    wijmo.setSelectionRange(this._tbx, start, this._tbx.value.length);
                }
            };
            // update items in drop-down list
            InputTime.prototype._updateItems = function () {
                // not if we have custom items
                if (this._hasCustomItems) {
                    return;
                }
                // populate the list
                var items = [], min = new Date(2020, 0), // WJM-16549
                max = new Date(2020, 0, 1, 23, 59, 59), step = this.step;
                if (this.min) {
                    min.setHours(this.min.getHours(), this.min.getMinutes(), this.min.getSeconds());
                }
                if (this.max) {
                    max.setHours(this.max.getHours(), this.max.getMinutes(), this.max.getSeconds());
                }
                if (wijmo.isNumber(step) && step >= 1) {
                    for (var dt = min; dt <= max; dt = wijmo.DateTime.addMinutes(dt, step)) {
                        items.push({ value: dt, text: wijmo.Globalize.format(dt, this.format) });
                    }
                }
                // save current value
                var value = this.value;
                this._settingText = true;
                // update item source
                this.displayMemberPath = 'text';
                this.selectedValuePath = 'text';
                this.itemsSource = items;
                this._hasCustomItems = false;
                // restore value
                this._settingText = false;
                if (value || !this.isRequired) {
                    this.value = value;
                }
            };
            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // gets the time of day in seconds
            InputTime.prototype._getTime = function (value) {
                return value.getHours() * 3600 + value.getMinutes() * 60 + value.getSeconds();
            };
            // override to commit text on Enter and cancel on Escape
            InputTime.prototype._keydown = function (e) {
                _super.prototype._keydown.call(this, e);
                if (!e.defaultPrevented) {
                    switch (e.keyCode) {
                        case wijmo.Key.Enter:
                            if (!this.isDroppedDown) {
                                this._commitText();
                                this.selectAll();
                            }
                            break;
                        case wijmo.Key.Escape:
                            this.text = wijmo.Globalize.format(this.value, this.format);
                            this.selectAll();
                            break;
                    }
                }
            };
            // parse time, commit if successful or revert
            InputTime.prototype._commitText = function () {
                if (!this.text && !this.isRequired) {
                    this.value = null;
                }
                else {
                    var text = this.value ? wijmo.Globalize.format(this.value, this.format) : ''; // TFS 441624
                    if (this.text != text) { // change only if needed (TFS 265289)
                        var value = this.selectedItem && this.selectedItem.value
                            ? this.selectedItem.value // TFS 290187
                            : wijmo.Globalize.parseDate(this.text, this.format, this.value);
                        if (value) {
                            if (!wijmo.DateTime.sameTime(value, this._clamp(value)) && !this.onInvalidInput(new wijmo.CancelEventArgs())) {
                                // invalid input canceled
                            }
                            else {
                                this.value = wijmo.DateTime.fromDateTime(this.value, value);
                            }
                        }
                        else {
                            if (!this.onInvalidInput(new wijmo.CancelEventArgs())) {
                                // invalid input canceled
                            }
                            else {
                                this.text = text; // TFS 321540
                                //this._tbx.value = text;
                            }
                        }
                    }
                }
            };
            return InputTime;
        }(input.ComboBox));
        input.InputTime = InputTime;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        // globalization info
        wijmo._addCultureInfo('InputDateTime', {
            ariaLabels: {
                tglDate: 'Toggle Calendar',
                tglTime: 'Toggle Time List'
            }
        });
        /**
         * The {@link InputDateTime} control extends the {@link InputDate} control to allows users
         * to input dates and times, either by typing complete date/time values in any format
         * supported by the {@link Globalize} class, or by picking dates from a drop-down calendar
         * and times from a drop-down list.
         *
         * Use the {@link InputDateTime.min} and {@link InputDateTime.max} properties to restrict
         * the range of dates that the user can enter.
         *
         * Use the {@link InputDateTime.timeMin} and {@link InputDateTime.timeMax} properties to
         * restrict the range of times that the user can enter.
         *
         * Use the {@link InputDateTime.value} property to gets or set the currently selected
         * date/time.
         *
         * The example below shows how you can use an {@link InputDateTime} control to edit
         * dates and times using a single control:
         *
         * {@sample Input/InputDateTime/Overview Example}
         */
        var InputDateTime = /** @class */ (function (_super) {
            __extends(InputDateTime, _super);
            //--------------------------------------------------------------------------
            //#region ** ctor
            /**
             * Initializes a new instance of the {@link InputDateTime} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function InputDateTime(element, options) {
                var _this = _super.call(this, element) || this;
                // add control class name
                wijmo.addClass(_this.hostElement, 'wj-inputdatetime');
                // label button elements
                var labels = wijmo.culture.InputDateTime.ariaLabels;
                wijmo.setAriaLabel(_this._btn, labels.tglDate);
                wijmo.setAriaLabel(_this._btnTm, labels.tglTime);
                // change default value and format to show date and time
                _this.value = new Date();
                _this.format = 'g';
                // create InputTime control (with additional drop-down)
                _this._inputTime = new input.InputTime(document.createElement('div'), {
                    valueChanged: function (s) {
                        var rangeEnd = _this.rangeEnd; // save rangeEnd
                        _this.value = wijmo.DateTime.fromDateTime(_this.value, s.value); // this changes rangeEnd
                        if (_this.calendar._rngMode() && rangeEnd) {
                            _this.rangeEnd = wijmo.DateTime.fromDateTime(rangeEnd, s.value);
                        }
                    },
                    isDroppedDownChanged: function (s) {
                        if (s.listBox.containsFocus()) {
                            _this.inputElement.focus();
                        }
                        _this._selectAll(); // if focused, closed, not touching...
                    }
                });
                // connect input time button
                var addListener = _this.addEventListener.bind(_this);
                _this._btnTm = _this.hostElement.querySelector('[wj-part="btn-tm"]');
                addListener(_this._btnTm, 'mousedown', function (e) {
                    _this._btnclick(e);
                });
                // hook up the time picker drop-down
                _this._ddDate = _this._dropDown;
                var ddTime = _this._ddTime = _this._inputTime.dropDown;
                // handle keyboard on time picker drop-down (open/close/commit, F4/Enter/Escape etc)
                addListener(ddTime, 'keydown', _this._keydown.bind(_this), true);
                // handle focus (we have an extra drop-down)
                addListener(ddTime, 'blur', function () {
                    _this._updateFocusState();
                }, true);
                // keep focus when the user clicks the InputTime drop-down (TFS 369655)
                addListener(ddTime, 'click', function (e) {
                    if (!e.defaultPrevented) {
                        if (e.target != ddTime) {
                            _this.hostElement.focus();
                        }
                    }
                }, true);
                // initialize control options
                _this.initialize(options);
                _this.text = _this._getText();
                return _this;
            }
            Object.defineProperty(InputDateTime.prototype, "timeMin", {
                //#endregion
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the earliest time that the user can enter.
                 *
                 * The default value for this property is **null**, which means there
                 * is no earliest time limit.
                 */
                get: function () {
                    return this._inputTime.min;
                },
                set: function (value) {
                    this._inputTime.min = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDateTime.prototype, "timeMax", {
                /**
                 * Gets or sets the latest time that the user can enter.
                 *
                 * The default value for this property is **null**, which means there
                 * is no latest time limit.
                 */
                get: function () {
                    return this._inputTime.max;
                },
                set: function (value) {
                    this._inputTime.max = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDateTime.prototype, "timeFormat", {
                /**
                 * Gets or sets the format used to display times in the drop-down list.
                 *
                 * This property does not affect the value shown in the control's input element.
                 * That value is formatted using the {@link format} property.
                 *
                 * The format string is expressed as a .NET-style
                 * <a href="https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings" target="_blank">
                 * time format string</a>.
                 *
                 * The default value for this property is **'t'** (short time pattern).
                 */
                get: function () {
                    return this._inputTime.format;
                },
                set: function (value) {
                    this._inputTime.format = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDateTime.prototype, "timeStep", {
                /**
                 * Gets or sets the number of minutes between entries in the
                 * drop-down list of times.
                 *
                 * The default value for this property is **15** minutes.
                 *
                 * Setting this property to **null**, zero, or any negative value
                 * disables the time-picker and hides the time drop-down button.
                 *
                 * Only the integer part of the step value is used. Setting
                 * **timeStep** to **30.5** for example will create **30**
                 * minute intervals.
                 */
                get: function () {
                    return this._inputTime.step;
                },
                set: function (value) {
                    this._inputTime.step = value;
                    this._btnTm.style.display = (wijmo.isNumber(value) && value > 0) // TFS 143657
                        ? ''
                        : 'none';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDateTime.prototype, "inputTime", {
                /**
                 * Gets a reference to the inner {@link InputTime} control so you can access its
                 * full object model.
                 */
                get: function () {
                    return this._inputTime;
                },
                enumerable: true,
                configurable: true
            });
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** overrides
            // keep the date and time (TFS 460378)
            InputDateTime.prototype._fromDateTime = function (value) {
                return value;
            };
            // handle both buttons (TFS 377882, 353420)
            InputDateTime.prototype._btnclick = function (e) {
                var dd = (wijmo.closest(e.target, 'button')) == this._btn
                    ? this._ddDate
                    : this._ddTime;
                this._setDropdown(dd);
                _super.prototype._btnclick.call(this, e);
            };
            // dispose of InputTime and Calendar controls
            InputDateTime.prototype.dispose = function () {
                this._setDropdown(this._ddDate);
                _super.prototype.dispose.call(this); // Date
                this._inputTime.dispose(); // Time
            };
            // update value display in case culture changed
            InputDateTime.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                this._inputTime.refresh(); // Time
                _super.prototype.refresh.call(this, fullUpdate);
            };
            // update drop-down button visibility
            InputDateTime.prototype._updateBtn = function () {
                _super.prototype._updateBtn.call(this);
                if (this._btnTm) {
                    this._btnTm.tabIndex = this._btn.tabIndex;
                    this._btnTm.parentElement.style.display = this._btn.style.display;
                }
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // selects a drop-down element (date/time)
            InputDateTime.prototype._setDropdown = function (e) {
                // no change
                if (this._dropDown == e) {
                    return false;
                }
                // close the dropdown
                if (this.isDroppedDown) {
                    this.isDroppedDown = false;
                }
                // update the dropdown and css class (TFS 324768)
                var ddc = this.dropDownCssClass;
                this.dropDownCssClass = '';
                this._dropDown = e;
                this.dropDownCssClass = ddc;
                // drop-down has changed
                return true;
            };
            // update drop down content before showing it
            /*protected*/ InputDateTime.prototype._updateDropDown = function () {
                var tm = this._inputTime;
                if (this._dropDown == tm.dropDown) {
                    this._commitText();
                    _super.prototype._updateDropDown.call(this);
                    tm.isRequired = this.isRequired && this.value != null; // TFS 142464
                    tm.value = this.value;
                    if (this.isDroppedDown) {
                        tm.listBox.showSelection();
                    }
                }
                else {
                    _super.prototype._updateDropDown.call(this);
                }
            };
            /**
             * Gets or sets the template used to instantiate {@link InputDateTime} controls.
             */
            InputDateTime.controlTemplate = '<div class="wj-template">' +
                '<div class="wj-input">' +
                '<div class="wj-input-group wj-input-btn-visible">' +
                '<input wj-part="input" type="text" class="wj-form-control"/>' +
                '<span class="wj-input-group-btn">' +
                '<button wj-part="btn" class="wj-btn wj-btn-default" tabindex="-1">' +
                '<span class="wj-glyph-calendar"></span>' +
                '</button>' +
                '<button wj-part="btn-tm" class="wj-btn wj-btn-default" tabindex="-1">' +
                '<span class="wj-glyph-clock"></span>' +
                '</button>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div wj-part="dropdown" class="wj-content wj-dropdown-panel"></div>' +
                '</div>';
            return InputDateTime;
        }(input.InputDate));
        input.InputDateTime = InputDateTime;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The {@link AutoComplete} control is an input control that allows callers
         * to customize the item list as the user types.
         *
         * The control is similar to the {@link ComboBox}, except the item source is a
         * function ({@link itemsSourceFunction}) rather than a static list. For example,
         * you can look up items on remote databases as the user types.
         *
         * The example below creates an {@link AutoComplete} control and populates it using
         * a 'countries' array. The {@link AutoComplete} searches for the country as the user
         * types, and narrows down the list of countries that match the current input.
         *
         * {@sample Input/AutoComplete/Overview/purejs Example}
         */
        var AutoComplete = /** @class */ (function (_super) {
            __extends(AutoComplete, _super);
            /**
             * Initializes a new instance of the {@link AutoComplete} class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function AutoComplete(element, options) {
                var _this = _super.call(this, element) || this;
                // property storage
                _this._cssMatch = 'wj-state-match';
                _this._minLength = 2;
                _this._maxItems = 6;
                _this._itemCount = 0;
                _this._beginsWith = false;
                _this._delay = wijmo.Control._SEARCH_DELAY;
                _this._query = '';
                _this._inCallback = false;
                _this._srchProps = [];
                wijmo.addClass(_this.hostElement, 'wj-autocomplete');
                _this._bsCollapse = false; // do not collapse selection on Backspace
                _this.isEditable = true;
                _this.isRequired = false; // TFS 142492
                //this.isContentHtml = true; // default to false for safety
                _this.listBox.formatItem.addHandler(_this._formatListItem, _this);
                _this._itemsSourceFnCallbackBnd = _this._itemSourceFunctionCallback.bind(_this);
                _this.initialize(options);
                return _this;
            }
            Object.defineProperty(AutoComplete.prototype, "minLength", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the minimum input length to trigger auto-complete suggestions.
                 *
                 * The default value for this property is **2**.
                 */
                get: function () {
                    return this._minLength;
                },
                set: function (value) {
                    this._minLength = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "beginsWithSearch", {
                /**
                 * Gets or sets a value that determines whether to search for items
                 * that begin with the given search term.
                 *
                 * The default value for this property is **false**, which causes
                 * the control to search for items that contain the given search
                 * terms.
                 */
                get: function () {
                    return this._beginsWith;
                },
                set: function (value) {
                    this._beginsWith = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "maxItems", {
                /**
                 * Gets or sets the maximum number of items to display in the drop-down list.
                 *
                 * The default value for this property is **6**.
                 */
                get: function () {
                    return this._maxItems;
                },
                set: function (value) {
                    this._maxItems = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "delay", {
                /**
                 * Gets or sets the delay, in milliseconds, between when a keystroke occurs
                 * and when the search is performed.
                 *
                 * The default value for this property is **500** milliseconds.
                 */
                get: function () {
                    return this._delay;
                },
                set: function (value) {
                    this._delay = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "searchMemberPath", {
                /**
                 * Gets or sets a string containing a comma-separated list of properties to use
                 * when searching for items.
                 *
                 * By default, the {@link AutoComplete} control searches for matches against the
                 * property specified by the {@link displayMemberPath} property.
                 * The {@link searchMemberPath} property allows you to search using additional
                 * properties.
                 *
                 * For example, the code below would cause the control to display the company
                 * name and search by company name, symbol, and country:
                 *
                 * ```typescript
                 * import { AutoComplete } from '@grapecity/wijmo.input';
                 * var ac = new AutoComplete('#autoComplete', {
                 *   itemsSource: companies,
                 *   displayMemberPath: 'name',
                 *   searchMemberPath: 'symbol,country'
                 * });
                 * ```
                 */
                get: function () {
                    return this._srchProp;
                },
                set: function (value) {
                    this._srchProp = wijmo.asString(value);
                    this._srchProps = value ? value.trim().split(/\s*,\s*/) : [];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "itemsSourceFunction", {
                /**
                 * Gets or sets a function that provides list items dynamically as the user types.
                 *
                 * The function takes three parameters:
                 * <ul>
                 *     <li>the query string typed by the user</li>
                 *     <li>the maximum number of items to return</li>
                 *     <li>the callback function to call when the results become available</li>
                 * </ul>
                 *
                 * For example:
                 *
                 * ```typescript
                 * autoComplete.itemsSourceFunction: (query: string, max: number, callback: Function) => {
                 *
                 *     // query the server
                 *     httpRequest('https://services.odata.org/Northwind/Northwind.svc/Products', {
                 *         data: {
                 *             $format: 'json',
                 *             $select: 'ProductID,ProductName',
                 *             $filter: 'indexof(ProductName, \'' + query + '\') gt -1'
                 *         },
                 *         success: (xhr: XMLHttpRequest) => {
                 *
                 *             // return results to AutoComplete control
                 *             let response = JSON.parse(xhr.response);
                 *             callback(response.d ? response.d.results : response.value);
                 *         }
                 *     });
                 * }
                 * ```
                 */
                get: function () {
                    return this._itemsSourceFn;
                },
                set: function (value) {
                    this._itemsSourceFn = wijmo.asFunction(value);
                    if (wijmo.isFunction(this._itemsSourceFn)) {
                        this.itemsSourceFunction(this.text, this.maxItems, this._itemsSourceFnCallbackBnd);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "cssMatch", {
                /**
                 * Gets or sets the name of the CSS class used to highlight any parts
                 * of the content that match the search terms.
                 *
                 * The default value for this property is **wj-state-match**.
                 */
                get: function () {
                    return this._cssMatch;
                },
                set: function (value) {
                    this._cssMatch = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // override to make up/down keys work properly
            AutoComplete.prototype._keydown = function (e) {
                if (!e.defaultPrevented && this.isDroppedDown) {
                    switch (e.keyCode) {
                        case wijmo.Key.Up:
                        case wijmo.Key.Down:
                            this.selectAll();
                            break;
                    }
                }
                _super.prototype._keydown.call(this, e);
            };
            // update text in textbox
            AutoComplete.prototype._setText = function (text) {
                // don't call base class (to avoid autocomplete)
                var _this = this;
                // not while handling the itemsSourcefunction callback
                // or while composing IME text (TFS 377455, 377456)
                // or while moving the selectedIndex to -1 (TFS 444238)
                if (this._inCallback || this._composing || this._settingText) {
                    return;
                }
                // allow setting text that is not on the list
                if (this.selectedIndex > -1 && this.getDisplayText() != text) { // TFS 344788, 438180
                    this._settingText = true; // TFS 444238
                    this.selectedIndex = -1;
                    this._settingText = false;
                }
                // raise textChanged
                if (text != this._oldText) {
                    // assign only if necessary to prevent occasionally swapping chars (Android 4.4.2)
                    var tbx = this._tbx;
                    if (tbx.value != text) {
                        tbx.value = text;
                    }
                    this._oldText = text;
                    this.onTextChanged();
                    // no text? no filter...
                    var cv = this.collectionView;
                    if (!text && cv) {
                        // no local filter
                        if (this._query || this.selectedIndex < 0) { // TFS 344788, 351246, 440606
                            this.isDroppedDown = false;
                        }
                        this._query = this._rxHighlight = null; // TFS 278848
                        cv.filter = null;
                        // no filter with source function either
                        var srcFn = this.itemsSourceFunction;
                        if (wijmo.isFunction(srcFn)) {
                            this.isDroppedDown = false;
                            srcFn(this._query, this.maxItems, this._itemsSourceFnCallbackBnd); // TFS 399671
                        }
                        return;
                    }
                }
                // update list when user types in some text
                if (this._toSearch) {
                    clearTimeout(this._toSearch);
                }
                if (text != this.getDisplayText()) {
                    // get new search terms on a timeOut (so the control doesn't update too often)
                    this._toSearch = setTimeout(function () {
                        _this._toSearch = null;
                        // get search terms
                        var terms = _this.text.trim(); // TFS 355463
                        if (terms.length >= _this._minLength && terms != _this._query) {
                            // save new search terms
                            _this._query = terms;
                            // escape RegExp characters in the terms string
                            terms = wijmo.escapeRegExp(terms);
                            //terms = terms.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
                            // escape HTML characters in the terms string
                            var termsEscaped = wijmo.escapeHtml(terms);
                            // build regular expressions for searching and highlighting the items
                            // when searching, match *all* terms on the string
                            // when highlighting, match *any* terms on the string
                            var flags = _this.caseSensitiveSearch ? '' : 'i'; // case
                            if (!_this._beginsWith)
                                flags += 'g'; // global
                            _this._rxSrch = _this._beginsWith
                                ? new RegExp('^' + terms + '.*', flags)
                                : new RegExp('(?=.*' + terms.replace(/ /g, ')(?=.*') + ')', flags);
                            _this._rxHighlight = new RegExp('(' + termsEscaped.replace(/\s+/g, '|') + ')', flags); // TFS 392512
                            // update list
                            //this.isDroppedDown = false;
                            var srcFn = _this.itemsSourceFunction;
                            if (wijmo.isFunction(srcFn)) {
                                srcFn(_this._query, _this.maxItems, _this._itemsSourceFnCallbackBnd); // TFS 399671
                            }
                            else {
                                _this._updateItems();
                            }
                        }
                    }, this._delay);
                }
            };
            // populate list with results from itemSourceFunction
            AutoComplete.prototype._itemSourceFunctionCallback = function (result) {
                // update list
                this._inCallback = true;
                var cv = wijmo.asCollectionView(result || []);
                cv.moveCurrentToPosition(-1);
                this.itemsSource = cv;
                this._inCallback = false;
                // show list at the proper place if we have the focus (TFS 202912)
                // (while keeping the selection: TFS 355463)
                if (this.containsFocus()) {
                    var tbx = this._tbx, start = tbx.selectionStart, end = tbx.selectionEnd, cv_1 = this.collectionView;
                    this.isDroppedDown = (cv_1 != null && cv_1.items.length > 0); // TFS 441383
                    wijmo.setSelectionRange(tbx, start, end);
                    this.refresh();
                }
            };
            // update text/selection when opening or closing the drop-down
            AutoComplete.prototype.onIsDroppedDownChanged = function (e) {
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                if (this.containsFocus() && !this.isTouching) {
                    var cv = this.collectionView;
                    if (this.selectedIndex < 0 && cv) { // TFS 289104
                        var items = cv.items, text = this.text;
                        if (items.length == 1 && items[0] == text) {
                            this.selectedIndex = 0; // text matches the only item, so select it
                        }
                        else {
                            wijmo.setSelectionRange(this._tbx, text.length); // let the user keep typing
                        }
                    }
                }
                // clear query string
                this._query = '';
                // remove the filter if the dropdown is closed (or not: TFS 284543)
                //if (!this.isDroppedDown && this.collectionView) {
                //    this._query = this._rxHighlight = null;
                //    this.collectionView.filter = null;
                //}
            };
            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // apply the filter to show only the matches
            AutoComplete.prototype._updateItems = function () {
                var cv = this.collectionView;
                if (cv) {
                    // apply the filter
                    this._inCallback = true;
                    cv.beginUpdate();
                    this._itemCount = 0;
                    cv.filter = this._filter.bind(this);
                    cv.moveCurrentToPosition(-1);
                    cv.endUpdate();
                    this._inCallback = false;
                    // show/hide the drop-down
                    var cnt = cv.items.length, tbx = this._tbx, start = tbx.selectionStart, end = tbx.selectionEnd;
                    this.isDroppedDown = cnt > 0 && this.containsFocus();
                    if (!cnt && !this.isEditable) { // honor isEditable: TFS 81936, 275758
                        this.selectedIndex = -1;
                    }
                    // if there is only one item to show and it's a full match, select it (TFS 469893)
                    if (cnt == 1 && this.selectedIndex < 0) {
                        var itemText = this._getItemText(cv.items[0], false), tbxText = tbx.value;
                        if (!this.caseSensitiveSearch) {
                            itemText = itemText.toLowerCase();
                            tbxText = tbxText.toLowerCase();
                        }
                        if (itemText == tbxText) {
                            this.selectedIndex = 0;
                        }
                    }
                    // restore original selection (TFS 359702)
                    if (this.isDroppedDown) {
                        wijmo.setSelectionRange(tbx, start, end);
                    }
                    // refresh to update the drop-down position
                    this.refresh();
                }
            };
            // filter the items and show only the matches
            AutoComplete.prototype._filter = function (item) {
                // honor maxItems
                if (this._itemCount >= this._maxItems) {
                    return false;
                }
                // build list of strings to test (WJM-19424)
                var strings = [this._getItemText(item, false)];
                if (this._srchProps) {
                    this._srchProps.forEach(function (prop) {
                        var val = item[prop];
                        if (val != null) { // ignore null/undefined
                            strings.push(val);
                        }
                    });
                }
                // remove html tags and entities for matching // TFS 392512
                if (this.isContentHtml) {
                    strings = strings.map(function (item) { return item.replace(/(<[^>]*>|&[^;]*;)/g, ''); });
                }
                // count matches
                for (var i = 0; i < strings.length; i++) {
                    if (this._rxSrch.test(strings[i])) {
                        this._itemCount++;
                        return true;
                    }
                }
                // no pass
                return false;
            };
            // gets the text to display for a given item (TFS 253890)
            AutoComplete.prototype._getItemText = function (item, header) {
                var text = item ? item.toString() : '', binding = header && this.headerPath
                    ? this._pathHdr
                    : this._lbx._pathDisplay;
                if (binding) {
                    text = binding.getValue(item);
                    text = text != null ? text.toString() : ''; // TFS 268268
                }
                return text;
            };
            // ListBox item formatter: show matches in bold
            // using replacer to prevent replacing content enclosed in <*> or &*; // TFS 392512
            AutoComplete.prototype._formatListItem = function (sender, e) {
                var _this = this;
                if (this._cssMatch && this._rxHighlight) {
                    e.item.innerHTML = e.item.innerHTML.replace(this._rxHighlight, function (match, p1, offset, str) {
                        return _this._enclosed(str, offset, '<', '>') || _this._enclosed(str, offset, '&', ';')
                            ? match
                            : '<span class="' + _this._cssMatch + '">' + match + '</span>';
                    });
                }
            };
            AutoComplete.prototype._enclosed = function (str, offset, start, end) {
                for (var i = offset; i >= 0 && str[i] != end; i--) {
                    if (str[i] == start) { // found start
                        for (var j = offset; j < str.length && str[j] != start; j++) {
                            if (str[j] == end) { // found end
                                return true; // enclosed
                            }
                        }
                    }
                }
                return false; // not enclosed
            };
            return AutoComplete;
        }(input.ComboBox));
        input.AutoComplete = AutoComplete;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input_1) {
        'use strict';
        /**
         * The {@link MultiAutoComplete} control allows users to pick items from lists
         * that contain custom objects or simple strings.
         *
         * The example below shows how you can use a {@link MultiAutoComplete} to
         * enter multiple items picked from a single list:
         *
         * {@sample Input/MultiAutoComplete/Overview Example}
         */
        var MultiAutoComplete = /** @class */ (function (_super) {
            __extends(MultiAutoComplete, _super);
            /**
             * Initializes a new instance of the {@link MultiAutoComplete} class.
             *
             * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function MultiAutoComplete(element, options) {
                var _this = _super.call(this, element) || this;
                _this._selItems = [];
                _this._maxSelItems = null;
                _this._lastInputValue = '';
                _this._selPath = new wijmo.Binding(null);
                _this._notAddItm = false;
                // ** events
                /**
                 * Occurs when the value of the {@link selectedItems} property changes.
                 */
                _this.selectedItemsChanged = new wijmo.Event();
                // initialize control, get references
                wijmo.addClass(_this.hostElement, 'wj-multi-autocomplete');
                _this._wjTpl = _this.hostElement.querySelector('.wj-template');
                _this._wjInput = _this.hostElement.querySelector('.wj-input');
                // initialize control options
                _this.showDropDownButton = false;
                _this.initialize(options);
                // add event handlers
                _this.addEventListener(_this.hostElement, 'keyup', _this._keyup.bind(_this), true);
                _this.addEventListener(window, 'resize', _this._adjustInputWidth.bind(_this));
                _this.addEventListener(_this._tbx, 'focus', function () {
                    _this._itemOff(); // deactivate token field when input gets the focus
                });
                // add helper input element to handle focus
                _this._addHelperInput();
                // refresh header now, when items are selected
                _this._initSeltems();
                // when loading the first item will show in the header, so clear it.
                //if (this._selItems.length === 0) {
                //    setTimeout(() => {
                //        this._clearSelIndex();
                //    }, 0);
                //}
                _this.listBox.itemsChanged.addHandler(function () { return _this.selectedIndex = -1; });
                _this._refreshHeader();
                return _this;
            }
            Object.defineProperty(MultiAutoComplete.prototype, "showDropDownButton", {
                //** object model
                /**
                 * Overridden to prevent the control from showing the drop-down button.
                 */
                set: function (value) {
                    this._showBtn = false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiAutoComplete.prototype, "maxSelectedItems", {
                /**
                 * Gets or sets the maximum number of items that can be selected.
                 *
                 * The default value for this property is **null**, which allows
                 * users to pick any number of items.
                 */
                get: function () {
                    return this._maxSelItems;
                },
                set: function (value) {
                    if (this._maxSelItems != value) {
                        this._maxSelItems = wijmo.asNumber(value, true);
                        this._updateMaxItems();
                        this._refreshHeader();
                        this._clearSelIndex();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiAutoComplete.prototype, "selectedMemberPath", {
                /**
                 * Gets or sets the name of the property used to control which
                 * item will be selected.
                 */
                get: function () {
                    return this._selPath.path;
                },
                set: function (value) {
                    value = wijmo.asString(value);
                    if (value !== this.selectedMemberPath) {
                        this._selPath.path = value;
                        this._initSeltems();
                        this._refreshHeader();
                        this.onSelectedItemsChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MultiAutoComplete.prototype, "selectedItems", {
                /**
                 * Gets or sets an array containing the items that are currently
                 * selected.
                 */
                get: function () {
                    return this._selItems;
                },
                set: function (value) {
                    // save the new value
                    this._selItems = wijmo.asArray(value);
                    // update the data source
                    if (this.selectedMemberPath && this.selectedMemberPath !== '') {
                        if (this._selItems) {
                            for (var i = 0; i < this._selItems.length; i++) {
                                var item = this._selItems[i];
                                this._setSelItem(item, false);
                            }
                        }
                    }
                    // update everything else
                    this._updateMaxItems();
                    this.onSelectedItemsChanged();
                    this._refreshHeader();
                    this._clearSelIndex();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link selectedItemsChanged} event.
             */
            MultiAutoComplete.prototype.onSelectedItemsChanged = function (e) {
                this.selectedItemsChanged.raise(this, e);
            };
            //** overrides
            // give focus to list when dropping down
            MultiAutoComplete.prototype.onIsDroppedDownChanged = function (e) {
                if (!this.isDroppedDown && this.selectedIndex > -1 && !this._notAddItm) {
                    this._addItem(true);
                }
                this._notAddItm = false;
                _super.prototype.onIsDroppedDownChanged.call(this, e);
            };
            // update the header when refreshing
            MultiAutoComplete.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this.hostElement) {
                    this._initSeltems();
                    // _itemSourceFunctionCallback call the refresh method,
                    // so when dropdown list is close state, then refresh the header
                    if (!this.isDroppedDown) {
                        this._refreshHeader();
                    }
                }
            };
            // override keydown handle: BackSpace, Up, Down etc
            MultiAutoComplete.prototype._keydown = function (e) {
                if (this.isReadOnly) {
                    return;
                }
                if (!e.defaultPrevented) {
                    switch (e.keyCode) {
                        // remember last text value
                        case wijmo.Key.Back:
                            this._lastInputValue = this._tbx.value;
                            break;
                        // add selected item and close dropdown
                        case wijmo.Key.Enter:
                            this._itemOff();
                            this._addItem(true);
                            if (wijmo.isIE()) { // IE cannot get focus when added item
                                wijmo.setSelectionRange(this._tbx, this._tbx.textContent.length, this._tbx.textContent.length);
                            }
                            break;
                        // add item and keep dropdown open
                        case wijmo.Key.Tab:
                            if (this.isDroppedDown) {
                                this._addItem(false);
                                this._tbx.value = '';
                                this._lbx.selectedIndex = -1;
                                e.preventDefault();
                            }
                            else {
                                this._updateFocus();
                            }
                            break;
                        // open dropdown list
                        case wijmo.Key.Space:
                            if (this._tbx.value !== '') {
                                return;
                            }
                            if (!this.isDroppedDown && !this._tbx.disabled) {
                                this.isDroppedDown = true;
                                this._clearSelIndex();
                            }
                            break;
                        // don't add item and close dropdown
                        case wijmo.Key.Escape:
                            if (this.isDroppedDown) {
                                this._notAddItm = true;
                            }
                            break;
                        // activate previous item
                        case wijmo.Key.Left:
                            this._itemOn(this.rightToLeft ? false : true);
                            break;
                        // activate next item
                        case wijmo.Key.Right:
                            this._itemOn(this.rightToLeft ? true : false);
                            break;
                        // return if input element is not active element
                        case wijmo.Key.Up:
                        case wijmo.Key.Down:
                            var ae = wijmo.getActiveElement();
                            if (e.altKey) {
                                if (this._tbx == ae) { // TFS 237696
                                    this.isDroppedDown = !this.isDroppedDown;
                                    if (!this.isDroppedDown) {
                                        this._tbx.focus();
                                    }
                                    e.preventDefault();
                                    return;
                                }
                            }
                            else if (this._tbx !== ae) {
                                return;
                            }
                        // all other keys
                        default:
                            if (e.keyCode === wijmo.Key.Back || e.keyCode === wijmo.Key.Delete) {
                                return;
                            }
                            this._itemOff();
                            if (this._maxSelItems != null &&
                                this._selItems.length >= this._maxSelItems) {
                                e.preventDefault();
                            }
                            break;
                    }
                }
                // allow base class if the input element is not disabled: TFS 286036
                if (!this._tbx.disabled) {
                    _super.prototype._keydown.call(this, e);
                }
            };
            // override to deactivate the item
            MultiAutoComplete.prototype._updateState = function () {
                _super.prototype._updateState.call(this);
                // deactivate the item
                if (!this._wjTpl) {
                    return;
                }
                if (!wijmo.hasClass(this.hostElement, 'wj-state-focused')) {
                    this._itemOff();
                }
            };
            // handle the key up event: Back & Delete
            MultiAutoComplete.prototype._keyup = function (e) {
                if (this.isReadOnly) {
                    return;
                }
                if (!e.defaultPrevented) {
                    switch (e.keyCode) {
                        case wijmo.Key.Back:
                            if (this._tbx.value.length === 0 &&
                                this._lastInputValue.length === 0) {
                                this._delItem(false);
                            }
                            break;
                        case wijmo.Key.Delete:
                            this._delItem(true);
                            break;
                    }
                }
            };
            // add helper input element to handle focus
            MultiAutoComplete.prototype._addHelperInput = function () {
                var input = document.createElement("input");
                input.type = 'text';
                input.tabIndex = -1;
                input.className = 'wj-token-helper';
                input.readOnly = true;
                this._wjTpl.insertBefore(input, this._wjInput);
                this._helperInput = input;
            };
            // refresh the header to display the selected items
            MultiAutoComplete.prototype._refreshHeader = function () {
                // clear the token fields
                var tokenFields = this.hostElement.querySelectorAll('.wj-token');
                for (var i = 0; i < tokenFields.length; i++) {
                    this._wjTpl.removeChild(tokenFields[i]);
                }
                // when loading the first item will show in the header, so clear it.
                var items = this.selectedItems;
                if (!items || items.length === 0) {
                    this._wjInput.style.cssFloat = this.rightToLeft ? 'right' : 'left';
                    this._adjustInputWidth();
                    return;
                }
                // add items to wj-template part
                for (var i = 0; i < items.length; i++) {
                    this._insertToken(items[i]);
                }
                this._wjInput.style.cssFloat = this.rightToLeft ? 'right' : 'left';
                // adjust input width and be done
                this._adjustInputWidth();
            };
            // insert token into template
            MultiAutoComplete.prototype._insertToken = function (item) {
                var tokenTxt = this._getItemText(item, true); // TFS 253890
                if (!this.isContentHtml) { // TFS 237683
                    tokenTxt = wijmo.escapeHtml(tokenTxt);
                }
                this._wjTpl.insertBefore(this._createItem(tokenTxt), this._wjInput);
            };
            // enforce maximum number of selected items
            MultiAutoComplete.prototype._updateMaxItems = function () {
                if (this._maxSelItems == null || !this._selItems) {
                    return;
                }
                if (this._selItems.length > this._maxSelItems) {
                    this._selItems = this._selItems.slice(0, this._maxSelItems);
                }
            };
            // update the control focus state
            MultiAutoComplete.prototype._updateFocus = function () {
                var _this = this;
                var activeToken = this._wjTpl.querySelector('.' + MultiAutoComplete._clsActive);
                if (activeToken) { // focus in the input element
                    wijmo.removeClass(activeToken, MultiAutoComplete._clsActive);
                    setTimeout(function () {
                        _this._tbx.focus();
                    });
                }
                else { // clear the text input
                    this._clearSelIndex();
                    // TFS 436233, 275040: do not remove the 'wj-state-focused' class,
                    // it screws up focus handling and prevents the control from raising
                    // the got/lostFocus events properly
                    ////removeClass(this.hostElement, 'wj-state-focused');
                }
            };
            // add an item
            MultiAutoComplete.prototype._addItem = function (clearSelected) {
                // filter duplicate items
                if (this.selectedItems.indexOf(this.selectedItem) > -1) {
                    this._clearSelIndex();
                    return;
                }
                if (this.selectedIndex > -1) {
                    this._updateSelItems(this.selectedItem, true);
                    this._refreshHeader();
                    if (clearSelected) {
                        this._clearSelIndex();
                    }
                    this._disableInput(true);
                }
            };
            // delete an item
            MultiAutoComplete.prototype._delItem = function (isDelKey) {
                // get active token
                var activeToken = this._wjTpl.querySelector('.' + MultiAutoComplete._clsActive), delItem, curIdx, selectedItmsChanged = false;
                // sanity
                if (isDelKey && !activeToken) {
                    return;
                }
                if (activeToken) {
                    curIdx = this._getItemIndex(activeToken);
                    if (curIdx > -1) { // Delete: delete active token and remove from selectedItems
                        delItem = this._selItems[curIdx];
                        selectedItmsChanged = true;
                    }
                }
                else { // BackSpace: delete last token and remove from selectedItems
                    if (this._selItems.length > 0) {
                        delItem = this._selItems[this._selItems.length - 1];
                        selectedItmsChanged = true;
                    }
                }
                // update selectedItems and refresh header
                if (selectedItmsChanged) {
                    this._updateSelItems(delItem, false);
                    this._refreshHeader();
                    this._clearSelIndex();
                    this._disableInput(false);
                }
                // focus back to input element
                this._tbx.focus();
            };
            // update the selected items
            MultiAutoComplete.prototype._updateSelItems = function (itm, isAdd) {
                if (isAdd) { // add selected item
                    if (!this._selItems || this._selItems.length === 0) {
                        this._selItems = [];
                    }
                    if (this._maxSelItems != null &&
                        this._selItems.length >= this._maxSelItems) {
                        return;
                    }
                    this._selItems.push(itm);
                }
                else { // delete selected item
                    var idx = this._selItems.indexOf(itm);
                    this._selItems.splice(idx, 1);
                }
                if (this._hasSelectedMemeberPath()) {
                    this._setSelItem(itm, isAdd);
                }
                this.onSelectedItemsChanged();
            };
            // create a single item
            MultiAutoComplete.prototype._createItem = function (tokenTxt) {
                var _this = this;
                var container = document.createElement("div"), tSpan = document.createElement("span"), closeBtn = document.createElement("a");
                container.appendChild(tSpan);
                container.appendChild(closeBtn);
                container.className = 'wj-token';
                tSpan.className = 'wj-token-label';
                tSpan.innerHTML = tokenTxt;
                closeBtn.className = 'wj-token-close';
                closeBtn.href = '#';
                closeBtn.tabIndex = -1;
                closeBtn.text = '×';
                container.style.cssFloat = this.rightToLeft ? 'right' : 'left';
                this.addEventListener(container, 'click', function (e) {
                    _this._helperInput.focus();
                    var activeToken = _this._wjTpl.querySelector('.' + MultiAutoComplete._clsActive);
                    if (activeToken) {
                        wijmo.removeClass(activeToken, MultiAutoComplete._clsActive);
                    }
                    wijmo.addClass(container, MultiAutoComplete._clsActive);
                    e.stopPropagation();
                    e.preventDefault();
                });
                this.addEventListener(closeBtn, 'click', function (e) {
                    if (_this.isReadOnly) {
                        return;
                    }
                    var idx = _this._getItemIndex(container);
                    if (idx > -1) {
                        var delItem = _this._selItems[idx];
                        _this._updateSelItems(delItem, false);
                    }
                    _this._wjTpl.removeChild(container);
                    _this._adjustInputWidth();
                    _this._disableInput(false);
                    _this._tbx.focus();
                    e.stopPropagation();
                    e.preventDefault();
                });
                return container;
            };
            // activate the item
            MultiAutoComplete.prototype._itemOn = function (isPrev) {
                var ae = wijmo.getActiveElement(), tokes, activeToken, activeTokenIdx;
                if (this._tbx == ae &&
                    this._tbx.value.length !== 0) {
                    return;
                }
                // get all tokens
                tokes = this._wjTpl.querySelectorAll('.wj-token');
                if (tokes.length === 0) {
                    return;
                }
                // get active tokens
                activeToken = this._wjTpl.querySelector('.' + MultiAutoComplete._clsActive);
                activeTokenIdx = this._getItemIndex(activeToken);
                if (isPrev) {
                    if (activeTokenIdx === 0) {
                        return;
                    }
                    if (activeTokenIdx === -1) { // activate last token
                        wijmo.addClass(tokes[tokes.length - 1], MultiAutoComplete._clsActive);
                        this._helperInput.focus();
                    }
                    else { // active previous token
                        wijmo.removeClass(activeToken, MultiAutoComplete._clsActive);
                        wijmo.addClass(tokes[activeTokenIdx - 1], MultiAutoComplete._clsActive);
                        this._helperInput.focus();
                    }
                }
                else if (!isPrev) {
                    if (activeTokenIdx === -1) {
                        return;
                    }
                    if (activeTokenIdx !== tokes.length - 1) { // activate last token
                        wijmo.removeClass(activeToken, MultiAutoComplete._clsActive);
                        wijmo.addClass(tokes[activeTokenIdx + 1], MultiAutoComplete._clsActive);
                        this._helperInput.focus();
                    }
                    else { // activate input
                        wijmo.removeClass(activeToken, MultiAutoComplete._clsActive);
                        this._tbx.focus();
                    }
                }
            };
            // deactivate the currently active item
            MultiAutoComplete.prototype._itemOff = function () {
                var token = this._wjTpl.querySelector('.' + MultiAutoComplete._clsActive);
                if (token) {
                    wijmo.removeClass(token, MultiAutoComplete._clsActive);
                }
            };
            // initialize the selectedItems when control initializes
            MultiAutoComplete.prototype._initSeltems = function () {
                if (this.selectedMemberPath) {
                    this._selItems.splice(0, this._selItems.length);
                    var view = this.collectionView; // .itemsSource; TFS 406341
                    if (view) {
                        for (var i = 0; i < view.sourceCollection.length; i++) {
                            if (this._getSelItem(i)) {
                                this._selItems.push(view.sourceCollection[i]);
                            }
                        }
                    }
                }
            };
            // get selected item
            MultiAutoComplete.prototype._getSelItem = function (index) {
                var view = this.collectionView, item = view ? view.sourceCollection[index] : null; // TFS 406341
                if (wijmo.isObject(item) && this.selectedMemberPath) {
                    return this._selPath.getValue(item);
                }
                return false;
            };
            // set selected item
            MultiAutoComplete.prototype._setSelItem = function (item, selected) {
                var cv = this.itemsSource;
                if (wijmo.isObject(item)) {
                    if (this._selPath.getValue(item) != selected) {
                        this._selPath.setValue(item, selected);
                        //cv.refresh();
                    }
                }
            };
            // clear the selected index
            MultiAutoComplete.prototype._clearSelIndex = function () {
                this.selectedIndex = -1;
            };
            // check the SelectedMemeberPath
            MultiAutoComplete.prototype._hasSelectedMemeberPath = function () {
                return this.selectedMemberPath && this.selectedMemberPath !== '';
            };
            // disable the input field
            MultiAutoComplete.prototype._disableInput = function (disabled) {
                if (this._maxSelItems != null) {
                    if (this._selItems.length < this._maxSelItems) {
                        this._tbx.disabled = false;
                        this._tbx.focus();
                    }
                    else {
                        this._tbx.disabled = true;
                        this.hostElement.focus();
                    }
                }
            };
            // adjust the input width
            MultiAutoComplete.prototype._adjustInputWidth = function () {
                // first set the input width to min width
                this._tbx.style.width = '60px';
                var width, offsetHost = wijmo.getElementRect(this.hostElement), offsetInput = wijmo.getElementRect(this._tbx), inputCss = getComputedStyle(this._tbx), inputPaddingLeft = parseInt(inputCss.paddingLeft, 10), inputPaddingRight = parseInt(inputCss.paddingRight, 10);
                if (this.rightToLeft) {
                    width = offsetInput.left + offsetInput.width - offsetHost.left -
                        inputPaddingLeft - inputPaddingRight - 8;
                }
                else {
                    width = offsetHost.left + offsetHost.width - offsetInput.left -
                        inputPaddingLeft - inputPaddingRight - 8;
                }
                this._tbx.style.width = width + 'px';
            };
            // get the index of an item
            MultiAutoComplete.prototype._getItemIndex = function (token) {
                var items = this.hostElement.querySelectorAll('.wj-token');
                for (var i = 0; i < items.length; i++) {
                    if (token === items[i]) {
                        return i;
                    }
                }
                return -1;
            };
            MultiAutoComplete._clsActive = 'wj-token-active';
            return MultiAutoComplete;
        }(input_1.AutoComplete));
        input_1.MultiAutoComplete = MultiAutoComplete;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var input;
    (function (input) {
        // Entry file. All real code files should be re-exported from here.
        wijmo._registerModule('wijmo.input', wijmo.input);
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.input.js.map