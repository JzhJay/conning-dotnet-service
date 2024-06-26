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


    module wijmo {
    //
// IE9 polyfills


'use strict';

// browser detection
const _agent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
const _isMobile = _agent.match(/iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone/i) != null;
export function isMobile(): boolean {
    return _isMobile;
}
const _isiOS = _agent.match(/iPad|iPhone|iPod/i) != null;
export function isiOS(): boolean {
    return _isiOS;
}
const _isFF = _agent.match(/Firefox\//) != null;
export function isFirefox(): boolean {
    return _isFF;
}
const _isSafari = _agent.match(/^((?!Chrome|Android).)*safari/i) != null;
export function isSafari(): boolean {
    return _isSafari;
}
const _isEdge = _agent.match(/Edge\//) != null;
export function isEdge(): boolean {
    return _isEdge;
}
const _isIE = _agent.match(/MSIE |Trident\/|Edge\//) != null;
export function isIE(): boolean {
    return _isIE;
}
let _isIE9 = false; // set later
export function isIE9(): boolean {
    return _isIE9;
}
let _isIE10 = false; // set later
export function isIE10(): boolean {
    return _isIE10;
}

// detect passive event support
// https://developers.google.com/web/updates/2016/06/passive-event-listeners
let _supportsPassive = false;
if (typeof document !== 'undefined') {
    document.addEventListener('test', _ => {}, <any> {
        get passive() {
            _supportsPassive = true;
            return true;
        }
    });
}
export function getEventOptions(capture: boolean, passive: boolean): any {
    return _supportsPassive
        ? { capture: capture, passive: passive }
        : capture
}

// detect focus options support
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
var _supportsFocusOptions = false;
if (typeof document !== 'undefined') {
    (document.createElement('div') as any).focus({
        get preventScroll() {
            _supportsFocusOptions = true;
            return true;
        }
    });
}
export function supportsFocusOptions() {
    return _supportsFocusOptions;
}

// set allowed effect, data
export function _startDrag(dataTransfer, effectAllowed: string) {
    dataTransfer.effectAllowed = effectAllowed;
    if (isFirefox()) { // setData is required in Firefox, but clears the clipboard in IE...
        dataTransfer.setData('text', '');
    }
}

// implement HTML5 drag-drop behavior in IE9.
if (typeof document !== 'undefined' && document.doctype) {

    if (navigator.appVersion.indexOf('MSIE 10') > -1) {
        _isIE10 = true;
    }

    if (navigator.appVersion.indexOf('MSIE 9') > -1) {
        _isIE9 = true;

        // TFS 140812: 'selectstart' does not work in popup dialogs, so use 'mousemove'
        // instead. It's less efficient but it works, and this only matters in IE9.
        document.addEventListener('mousemove', (e: MouseEvent) => {
            if (e.which == 1) {
                let ctl = closest(e.target, '.wj-control') as HTMLElement;
                if (ctl && !ctl.style.cursor) { // TFS 256634
                    for (let el = e.target as HTMLElement; el; el = el.parentElement) {
                        if (el.attributes && el.attributes['draggable']) {
                            (el as any).dragDrop();
                            return false;
                        }
                    }
                }
            }
        });
    }
}

// check for headless browsers
if (typeof window !== 'undefined') {

    // requestAnimationFrame/cancelAnimationFrame polyfill for IE9.
    // https://gist.github.com/rma4ok/3371337
    let raf = 'requestAnimationFrame',
        caf = 'cancelAnimationFrame';
    if (!window[raf]) {
        let expectedTime = 0;
        window[raf] = callback => {
            let currentTime = Date.now(),
                adjustedDelay = 16 - (currentTime - expectedTime),
                delay = adjustedDelay > 0 ? adjustedDelay : 0;
            expectedTime = currentTime + delay;
            return setTimeout(() => {
                callback(expectedTime);
            }, delay);
        };
        window[caf] = clearTimeout;
    }

    // atob and btoa polyfills for IE9
    if (!window.atob) {
        let keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
            keysRe = new RegExp('[^' + keys + ']');
        window.atob = input => {
            let output = [], buf, buffB, chars, idx = 0, idxB, len = input.length;
            if ((keysRe.test(input)) || (/=/.test(input) && (/=[^=]/.test(input) || /={3}/.test(input)))) {
                throw new Error('Invalid base64 data');
            }
            if (len % 4 > 0) {
                input += Array(4 - len % 4 + 1).join("=");
                len = input.length;
            }
            while (idx < len) {
                for (buffB = [], idxB = idx; idx < idxB + 4;) {
                    buffB.push(keys.indexOf(input.charAt(idx++)));
                }
                buf = (buffB[0] << 18) + (buffB[1] << 12) + ((buffB[2] & 63) << 6) + (buffB[3] & 63);
                chars = [(buf & (255 << 16)) >> 16, buffB[2] === 64 ? -1 : (buf & (255 << 8)) >> 8, buffB[3] === 64 ? -1 : buf & 255];
                for (idxB = 0; idxB < 3; ++idxB) {
                    if (chars[idxB] >= 0 || idxB === 0) {
                        output.push(String.fromCharCode(chars[idxB]));
                    }
                }
            }
            return output.join('');
        }
        window.btoa = input => {
            let output = [], buffer, chrs, index = 0, length = input.length;
            while (index < length) {
                chrs = [input.charCodeAt(index++), input.charCodeAt(index++), input.charCodeAt(index++)];
                buffer = (chrs[0] << 16) + ((chrs[1] || 0) << 8) + (chrs[2] || 0);
                output.push(
                    keys.charAt((buffer & (63 << 18)) >> 18),
                    keys.charAt((buffer & (63 << 12)) >> 12),
                    keys.charAt(isNaN(chrs[1]) ? 64 : (buffer & (63 << 6)) >> 6),
                    keys.charAt(isNaN(chrs[2]) ? 64 : (buffer & 63))
                );
            }
            return output.join('');
        }
    }
}

    }
    


    module wijmo {
    // IE11 polyfills

// Symbol: https://www.npmjs.com/package/es6-symbol
// npm install es6-symbol
//import 'es6-symbol'; DOESNT WORK???

// Proxy: https://www.npmjs.com/package/proxy-polyfill
// npm install proxy-polyfill
// NOTE: had to replace some backticks in the source code (silly)
//import 'proxy-polyfill';

// IE requires Proxy polyfill, which is not 100% complete


// symbol used to get the proxy target object
const _getProxyTarget = typeof window !== 'undefined' && window['Symbol'] ? Symbol('_getProxyTarget') : '\t_get\tProxy\tTarget\t';

// wraps an array to return item proxies from getter
export function _getCalculatedArray(arr: any[], calculatedFields: any, newItem?: any): any[] {

    // cache wrapped objects so we re-use proxies and comparisons work, e.g.
    //
    //  let view = theGrid.collectionView;
    //  let items = view.items;
    //  console.log(items[0] == items[0]); // true with cache, false without...
    //
    // NOTE: using a WeakMap so if nobody is using the proxy it can go away.
    //
    let cache = new WeakMap();

    // compute new item if not provided
    if (!newItem) {
        let obj = {} as any;
        if (arr.length) {
            let item = arr[0];
            for (let key in item) {
                let propType = typeof item[key];
                obj[key] = (propType == 'string') ? '' : (propType == 'number') ? 0 : null;
            }
            newItem = obj;
        }
    }

    // return array proxy
    return new Proxy(arr, {
        get(target, key) {

            // get proxy target
            // https://stackoverflow.com/questions/36372611/how-to-test-if-an-object-is-a-proxy#:~:text=So%20to%20determine%20if%20object,does%20not%20contain%20any%20functions.
            if (key === _getProxyTarget) {
                return target;
            }

            // get unwrapped item index, wrapped array item
            if (typeof key === 'string' || typeof key === 'number') {

                // support indexOf with un-wrapped items (important for addNew)
                if (key == 'indexOf') {
                    return (item: any, fromIndex?: number) => {
                        let index = target.indexOf(item, fromIndex); // look for proxy item
                        if (index < 0 && item) { // TFS 458999
                            item = item[_getProxyTarget]; // not found, look for un-wrapped item
                            if (item) {
                                index = target.indexOf(item, fromIndex);
                            }
                        }
                        return index;
                    }
                }

                // get wrapped array item
                let index = parseInt(key as string);
                if (!isNaN(index)) {
                    let item = target[index] as any;
                    if (item && !item[_getProxyTarget]) {
                        let proxy = cache.get(item);
                        if (!proxy) {
                            proxy = _createItemProxy(item, calculatedFields, newItem);
                            cache.set(item, proxy);
                        }
                        item = proxy;
                    }
                    return item;
                }
            }

            // get other values
            return Reflect.get(target, key);
        }
    });
}

// wraps an array item in a Proxy with calculated fields
function _createItemProxy(item: any, calculatedFields: any, newItem?: any): any {
    if (!item[_getProxyTarget]) {

        // Proxy polyfill needs all fields to be defined in the object,
        // so add the calculated fields to the object now
        if (isIE()) {
            for (let k in calculatedFields) {
                item[k] = null;
            }
        }

        // define proxy traps
        let traps: any = {};
        traps.get = (target: any, key: any, receiver: any) => {

            // get proxy target
            if (key === _getProxyTarget) {
                return target;
            }

            // constructor
            if (key === 'constructor') {
                return () => Object.assign({}, newItem || {});
            }

            // get calculated properties
            let expr = calculatedFields[key];
            if (expr) {
                switch (typeof expr) {

                    // functions are faster, offer intellisense, can be checked at compile time,
                    // and can use other calculated properties.
                    case 'function':
                        return expr(receiver);
                        
                    // string expressions can be persisted to JSON, can be edited by users,
                    // and have a sligthly nicer syntax.
                    case 'string':
                        return _eval(expr, receiver);
                }
            }
    
            // get other values
            return target[key];
        }

        // add traps that are not supported by the Proxy polyfill
        if (!isIE()) {

            // enumerate properties
            traps.ownKeys = (target: any) => {
                return Object.keys(target).concat(Object.keys(calculatedFields))
            };

            // support read-only calculated properties
            traps.getOwnPropertyDescriptor = (target: any, prop: any) => {

                // calculated properties are read-only
                if (prop in calculatedFields) {
                    return {
                        enumerable: true,
                        configurable: true,
                        writable: false // **
                    };

                }

                // others are not ours
                return Reflect.getOwnPropertyDescriptor(target, prop);
            };
        }

        // create the proxy
        item = new Proxy(item as any, traps);
    }
    return item;
}

// gets the object that is wrapped by a proxy item
export function _getTargetObject(item: any) {
    let target = item ? item[_getProxyTarget] : null;
    return target || item;
}

// evaluates an expression in the context of a data item
function _eval(expr: string, proxy: any): string {

    // variable '$' contains the proxy (all native and calculated items)
    let keys = ['$'];
    let vals = [proxy];

    // define and evaluate function
    let fn = new Function(...keys, 'return ' + expr);
    return fn(...vals);
}

    }
    


    module wijmo {
    

class _FocusService {
    // Indicates whether the browser supports the Document interface.
    // IE9/10 doesn't support HTMLDocument, so we use Document, and
    // this is a "paranoid" protection against the case where some browser misses
    // Document as well.
    private readonly _hasDoc: boolean;
    private _ae: HTMLElement;
    // A special value of this._ae, indicating that it was impossible to read document.activeElement 
    // before this moment (WJM-20587).
    private static readonly _noAe = {};

    constructor() {
        // typeof Document can be "function", or "object" (in IE), so we test just for "undefined"
        this._hasDoc = typeof Document !== 'undefined';
        this._ae = <HTMLElement>this._nativeAe();
        let root = window;
        let onBlur = this._onBlur.bind(this),
            onFocus = this._onFocus.bind(this);
        
        root.addEventListener('focusout', onBlur, true);
        root.addEventListener('focusin', onFocus, true);
        // In IE's blur/focus events, FocusEvent.relatedTarget is always null
        // TBD: maybe do nothing in IE, and just always return document.activeElement? 
        // Looks like it always correct.
        if (!isIE()) {
            root.addEventListener('blur', onBlur, true);
            root.addEventListener('focus', onFocus, true);
        }
    }

    get activeElement(): HTMLElement {
        //TBD: what if document.activeElement changed without any event
        let ae = this._ae,
            docAe = <HTMLElement>this._nativeAe();
        // check case when document.activeElement was changed without triggering any event,
        // like after removing focused element from the DOM in FireFox/Safari/Chrome-iOS
        if (ae === _FocusService._noAe) {
            ae = this._ae = docAe;
        } else if (ae != docAe) {
            // if focus was in a "true" element
            if (!this._isSpecialRoot(ae)) {
                // if it's not in the DOM
                if (!document.body.contains(ae)) {
                    // then document.activeElement is a real new focus
                    ae = this._ae = docAe;
                }
            }                  
        }
        return ae !== _FocusService._noAe ? ae : null;
    }

    private _onBlur(e: FocusEvent) {
        // ignore if this is from the user code's dispatchEvent
        if (e.isTrusted) {
            let newFocus = e.relatedTarget;
            // New focus may be null when focus is moved to nowhere, or if event has triggered because
            // browser lost a focus. In this case, document.activeElement knows better which element
            // is active on this page.
            this._ae = <HTMLElement>(this._isSpecialRoot(newFocus) ? this._nativeAe() : newFocus);
        }
    }

    private _onFocus(e: FocusEvent) {
        // ignore if this is from the user code's dispatchEvent
        if (e.isTrusted) {
            // when receiving focus, document.activeElement is always correct
            this._ae = <HTMLElement>this._nativeAe();
        }
    }

    private _isSpecialRoot(el: EventTarget) {
        return el == null || el === document.body || this._hasDoc && (el instanceof Document);
    }

    // Safely returns document.activeElement or _FocusService._noAe, avoiding problems with reading this 
    // property under the following conditions (WJM-20587):
    // - IE11
    // - page is loaded in iFrame
    // - <script> that loads 'wijmo' is in the <head> of the page (not an issue if it's in <body>)
    // If it's impossible to read document.activeElement, the special _FocusService._noAe value is returned.
    private _nativeAe(): any {
        let ret;
        try {
            // typeof document.activeElement returns 'unknown' in IE (non-standard typeof value!),
            // we utilize it to try to manage without exception handling
            ret = typeof document.activeElement !== <any>'unknown' ? document.activeElement : _FocusService._noAe;
        }
        catch (e) {
            ret = _FocusService._noAe;
        }
        return ret;
    }

}

// Init focus service if we are in a browser
export var _focusSrv: _FocusService;
if (typeof window !== 'undefined') {
    _focusSrv = new _FocusService();
}


    }
    


    module wijmo {
    'use strict';

/**
 * Provides binding to complex properties (e.g. 'customer.address.city')
 */
export class Binding {
    _path: string;
    _parts: any[];
    _key: string;

    /**
     * Initializes a new instance of the {@link Binding} class.
     *
     * @param path Name of the property to bind to.
     */
    constructor(path: string) {
        this.path = path;
    }

    /**
     * Gets or sets the path for the binding.
     * 
     * In the simplest case, the path is the name of the property of the source 
     * object to use for the binding (e.g. 'street').
     *
     * Sub-properties of a property can be specified by a syntax similar to that 
     * used in JavaScript (e.g. 'address.street').
     */
    get path(): string {
        return this._path;
    }
    set path(value: string) {
        this._path = value;
        this._parts = value ? value.split('.') : []; // e.g. 'customer.balance'
        for (let i = 0; i < this._parts.length; i++) {
            let part = this._parts[i],
                ib = part.indexOf('['); // e.g. 'customer.balance[0]'
            if (ib > -1) {
                this._parts[i] = part.substr(0, ib);
                this._parts.splice(++i, 0, parseInt(part.substr(ib + 1)));
            }
        }
        this._key = this._parts.length == 1 ? this._parts[0] : null;
    }
    /**
     * Gets the binding value for a given object.
     *
     * If the object does not contain the property specified by the
     * binding {@link path}, the method returns null.
     *
     * @param object The object that contains the data to be retrieved.
     */
    getValue(object: any): any {
        if (object) {

            // optimize common case
            if (this._key) {
                return object[this._key];
            }

            // handle case where property name has a decimal point (TFS 139176, 257829)
            if (this._path && this._path in object) {
                return object[this._path];
            }

            // traverse path for complex properties
            for (let i = 0; i < this._parts.length && object; i++) {
                object = object[this._parts[i]];
            }
        }
        return object;
    }
    /**
     * Sets the binding value on a given object.
     *
     * If the object does not contain the property specified by the
     * binding {@link path}, the value is not set.
     *
     * @param object The object that contains the data to be set.
     * @param value Data value to set.
     * @returns True if the value was assigned correctly, false otherwise.
     */
    setValue(object: any, value: any): boolean {
        if (object) {
            try {

                // handle simple cases (and cases where the property name has a decimal point)
                let path = this._path;
                if (path in object) {
                    object[path] = value;
                    return object[path] == value;
                }

                // traverse parts for complex properties
                for (let i = 0; i < this._parts.length - 1; i++) {
                    object = object[this._parts[i]];
                    if (object == null) {
                        return false; // invalid path
                    }
                }

                // make the assignment
                path = this._parts[this._parts.length - 1];
                object[path] = value;
                return object[path] == value;

            } catch (x) {

                // read-only, frozen, etc
                return false;
            }
        }

        // no object
        return false;
    }
}

    }
    


    module wijmo {
    

'use strict';

/**
 * Represents an event handler.
 *
 * Event handlers are functions invoked when events are raised.
 *
 * Every event handler has two arguments:
 * <ul>
 *   <li><b>sender</b> is the object that raised the event, and</li>
 *   <li><b>args</b> is an optional object that contains the event parameters.</li>
 * </ul>
 * 
 * Read more about <a href="https://www.grapecity.com/blogs/html-and-wijmo-events" target="_blank">Wijmo Events</a>.
 * 
 */
export interface IEventHandler<S = any, T = EventArgs> {
    (sender: S, args: T): void;
}
/*
 * Represents an event handler (private class)
 */
class EventHandler<S = any, T = EventArgs> {
    handler: IEventHandler<S, T>;
    self: any;
    constructor(handler: IEventHandler<S, T>, self: any) {
        this.handler = handler;
        this.self = self;
    }
}
/**
 * Represents an event.
 *
 * Wijmo events are similar to .NET events. Any class may define events by 
 * declaring them as fields. Any class may subscribe to events using the 
 * event's {@link addHandler} method and unsubscribe using the {@link removeHandler} 
 * method.
 * 
 * Wijmo event handlers take two parameters: <i>sender</i> and <i>args</i>. 
 * The first is the object that raised the event, and the second is an object 
 * that contains the event parameters.
 *
 * Classes that define events follow the .NET pattern where for every event 
 * there is an <i>on[EVENTNAME]</i> method that raises the event. This pattern 
 * allows derived classes to override the <i>on[EVENTNAME]</i> method and 
 * handle the event before and/or after the base class raises the event. 
 * Derived classes may even suppress the event by not calling the base class 
 * implementation.
 *
 * For example, the TypeScript code below overrides the <b>onValueChanged</b>
 * event for a control to perform some processing before and after the 
 * <b>valueChanged</b> event fires:
 *
 * <pre>// override base class
 * onValueChanged(e: EventArgs) {
 *   // execute some code before the event fires
 *   console.log('about to fire valueChanged');
 *   // optionally, call base class to fire the event
 *   super.onValueChanged(e);
 *   // execute some code after the event fired
 *   console.log('valueChanged event just fired');
 * }</pre>
 */
export class Event<S = any, T = EventArgs> {
    private _handlers: EventHandler<S, T>[] = [];
    private _handlersChanged: Function;

    /**
     * Initializes a new instance of an {@link Event}.
     * 
     * @param handlersChanged Optional callback invoked when handlers are 
     * added or removed from this {@link Event}.
     */
    constructor(handlersChanged?: Function) {
        this._handlersChanged = handlersChanged;
    }

    /**
     * Adds a handler to this event.
     *
     * @param handler Function invoked when the event is raised.
     * @param self Object that defines the event handler 
     * (accessible as 'this' from the handler code).
     */
    addHandler(handler: IEventHandler<S, T>, self?: any) {
        handler = asFunction(handler) as IEventHandler<S, T>;
        this._handlers.push(new EventHandler<S, T>(handler, self));
        if (isFunction(this._handlersChanged)) {
            this._handlersChanged();
        }
    }
    /**
     * Removes a handler from this event.
     *
     * @param handler Function invoked when the event is raised.
     * @param self Object that owns the event handler (accessible as 'this' from the handler code).
     */
    removeHandler(handler: IEventHandler<S, T>, self?: any) {
        let changed = false;
        handler = asFunction(handler) as IEventHandler<S, T>;
        for (let i = 0; i < this._handlers.length; i++) {
            let l = this._handlers[i];
            if (l.handler == handler || handler == null) {
                if (l.self == self || self == null) {
                    this._handlers.splice(i--, 1); // i-- in case we';'re removing null
                    changed = true;
                    if (handler && self) {
                        break;
                    }
                }
            }
        }
        if (changed && isFunction(this._handlersChanged)) {
            this._handlersChanged();
        }
    }
    /**
     * Removes all handlers associated with this event.
     */
    removeAllHandlers() {
        let changed = this._handlers.length > 0;
        this._handlers.length = 0;
        if (changed && isFunction(this._handlersChanged)) {
            this._handlersChanged();
        }
    }
    /**
     * Raises this event, causing all associated handlers to be invoked.
     *
     * @param sender Source object.
     * @param args Event parameters. 
     */
    raise(sender: any, args = EventArgs.empty) {
        let handlers = this._handlers;
        for (let i = 0; i < handlers.length; i++) {
            let l = handlers[i];
            l.handler.call(l.self, sender, args);
            if (handlers[i] !== l) { // in case user removed the handler
                i--;
            }
        }
    }
    /**
     * Gets a value that indicates whether this event has any handlers.
     */
    get hasHandlers(): boolean {
        return this._handlers.length > 0;
    }
    /**
     * Gets the number of handlers added to this event.
     */
    get handlerCount(): number {
        return this._handlers.length;
    }
}
/**
 * Base class for event arguments.
 */
export class EventArgs {
    /**
     * Provides a value to use with events that do not have event data.
     */
    static empty = new EventArgs();
}
/**
 * Provides arguments for cancellable events.
 */
export class CancelEventArgs extends EventArgs {
    /**
     * Gets or sets a value that indicates whether the event should be canceled.
     */
    cancel = false;
}
/**
 * Provides arguments for property change events.
 */
export class PropertyChangedEventArgs extends EventArgs {
    _name: string;
    _oldVal: any;
    _newVal: any;

    /**
     * Initializes a new instance of the {@link PropertyChangedEventArgs} class.
     *
     * @param propertyName The name of the property whose value changed.
     * @param oldValue The old value of the property.
     * @param newValue The new value of the property.
     */
    constructor(propertyName: string, oldValue: any, newValue: any) {
        super();
        this._name = propertyName;
        this._oldVal = oldValue;
        this._newVal = newValue;
    }
    /**
     * Gets the name of the property whose value changed.
     */
    get propertyName(): string {
        return this._name;
    }
    /**
     * Gets the old value of the property.
     */
    get oldValue(): any {
        return this._oldVal;
    }
    /**
     * Gets the new value of the property.
     */
    get newValue(): any {
        return this._newVal;
    }
}
/**
 * Provides arguments for 
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest" target="_blank">XMLHttpRequest</a>
 * error events.
 */
export class RequestErrorEventArgs extends CancelEventArgs {
    _xhr: XMLHttpRequest;
    _msg: string;

    /**
     * Initializes a new instance of the {@link RequestErrorEventArgs} class.
     *
     * @param xhr The <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest" target="_blank">XMLHttpRequest</a> 
     * that detected the error.
     * The 'status' and 'statusText' properties of the request object contain details about the error.
     * @param msg Optional error message.
     */
    constructor(xhr: XMLHttpRequest, msg?: string) {
        super();
        this._xhr = xhr;
        this._msg = msg;
    }
    /**
     * Gets a reference to the <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest" target="_blank">XMLHttpRequest</a> 
     * that detected the error.
     *
     * The status and statusText properties of the request object contain
     * details about the error.
     */
    get request(): XMLHttpRequest {
        return this._xhr;
    }
    /**
     * Gets or sets an error message to display to the user.
     */
    get message(): string {
        return this._msg;
    }
    set message(value: string) {
        this._msg = value;
    }
}

    }
    


    module wijmo.collections {
    




'use strict';

/**
 * Notifies listeners of dynamic changes, such as when items get added and 
 * removed or when the collection is sorted, filtered, or grouped.
 */
export interface INotifyCollectionChanged {
    /**
     * Occurs when the collection changes.
     */
    collectionChanged: wijmo.Event<INotifyCollectionChanged, NotifyCollectionChangedEventArgs>;
}
/**
 * Describes the action that caused the {@link INotifyCollectionChanged.collectionChanged}
 * event to fire.
 */
export enum NotifyCollectionChangedAction {
    /** An item was added to the collection. */
    Add,
    /** An item was removed from the collection. */
    Remove,
    /** An item was changed or replaced. */
    Change,
    /** 
     * Several items changed simultaneously 
     * (for example, the collection was sorted, filtered, or grouped). 
     */
    Reset
}
/**
 * Provides data for the {@link INotifyCollectionChanged.collectionChanged} event.
 */
export class NotifyCollectionChangedEventArgs<T = any> extends wijmo.EventArgs {

    /**
     * Provides a reset notification.
     */
    static reset = new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset);
    /**
     * Gets the action that caused the event to fire.
     */
    action: NotifyCollectionChangedAction;
    /**
     * Gets the item that was added, removed, or changed.
     */
    item: T;
    /**
     * Gets the index at which the change occurred.
     */
    index: number;
    /**
     * Initializes a new instance of the {@link NotifyCollectionChangedEventArgs} class.
     *
     * @param action Type of action that caused the event to fire.
     * @param item Item that was added or changed.
     * @param index Index of the item.
     */
    constructor(action = NotifyCollectionChangedAction.Reset, item: T = null, index = -1) {
        super();
        this.action = action;
        this.item = item;
        this.index = index;
    }
}

/**
 * Represents a method that takes an item of any type and returns a 
 * boolean that indicates whether the object meets a set of criteria.
 */
export interface IPredicate<T = any> {
    /**
     * @param item Data item to test.
     * @returns true if the item passes the test, false otherwise.
     */
    (item: T): boolean
}

/**
 * Represents a method that compares two objects.
 */
export interface IComparer<T = any> {
    /**
     * @param: item1 First object to compare.
     * @param: item2 Second object to compare.
     * @returns -1, 0, or +1 to indicate that the first item is smaller than, equal to, or created than the second.
     */
    (item1: T, item2: T): number;
}

/**
 * Represents a method that takes an item and a property name
 * and returns a group name.
 */
export interface IGroupConverter<T = any> {
    /**
     * @param item Data item being grouped.
     * @param property Name of the property being grouped on.
     * @return Name of the group to use for this data item.
     */
    (item: T, property: string): string;
}

/**
 * Describes a sorting criterion.
 */
export class SortDescription {
    _bnd: wijmo.Binding;
    _asc: boolean;

    /**
     * Initializes a new instance of the {@link SortDescription} class.
     *
     * @param property Name of the property to sort on.
     * @param ascending Whether to sort in ascending order.
     */
    constructor(property: string, ascending: boolean) {
        this._bnd = new wijmo.Binding(property);
        this._asc = ascending;
    }
    /**
     * Gets the name of the property used to sort.
     */
    get property(): string {
        return this._bnd.path;
    }
    /**
     * Gets a value that determines whether to sort the values in ascending order.
     */
    get ascending(): boolean {
        return this._asc;
    }
}

/**
 * Enables collections to have the functionalities of current record management, 
 * custom sorting, filtering, and grouping.
 *
 * This is a JavaScript version of the <b>ICollectionView</b> interface used in 
 * Microsoft's XAML platform. It provides a consistent, powerful, and  MVVM-friendly 
 * way to bind data to UI elements.
 *
 * Wijmo includes several classes that implement {@link ICollectionView}. The most 
 * common is {@link CollectionView}, which works based on regular JavsScript 
 * arrays.
 */
export interface ICollectionView<T = any> extends INotifyCollectionChanged, wijmo.IQueryInterface {

    /**
     * Gets a value that indicates whether this view supports filtering via the 
     * {@link filter} property.
     */
    canFilter: boolean;
    /**
     * Gets a value that indicates whether this view supports grouping via the 
     * {@link groupDescriptions} property.
     */
    canGroup: boolean;
    /**
     * Gets a value that indicates whether this view supports sorting via the 
     * {@link sortDescriptions} property.
     */
    canSort: boolean;
    /**
     * Gets the current item in the view.
     */
    currentItem: T;
    /**
     * Gets the ordinal position of the current item in the view.
     */
    currentPosition: number;
    /**
     * Gets or sets a callback used to determine if an item is suitable for 
     * inclusion in the view.
     *
     * NOTE: If the filter function needs a scope (i.e. a meaningful 'this'
     * value), then remember to set the filter using the 'bind' function to
     * specify the 'this' object. For example:
     * <pre>
     *   collectionView.filter = this._filter.bind(this);
     * </pre>
     */
    filter: IPredicate<T> | null;
    /**
     * Gets a collection of {@link GroupDescription} objects that describe how the 
     * items in the collection are grouped in the view.
     */
    groupDescriptions: ObservableArray<GroupDescription>;
    /**
     * Gets the top-level groups.
     */
    groups: any[];
    /**
     * Gets a value that indicates whether this view contains no items.
     */
    isEmpty: boolean;
    /**
     * Gets a collection of {@link SortDescription} objects that describe how the items 
     * in the collection are sorted in the view.
     */
    sortDescriptions: ObservableArray<SortDescription>;
    /**
     * Gets or sets the collection object from which to create this view.
     */
    sourceCollection: any;
    /**
     * Returns a value that indicates whether a given item belongs to this view.
     *
     * @param item The item to locate in the collection.
     */
    contains(item: T): boolean;
    /**
     * Sets the specified item to be the current item in the view.
     *
     * @param item The item to set as the {@link currentItem}.
     */
    moveCurrentTo(item: T): boolean;
    /**
     * Sets the first item in the view as the current item.
     */
    moveCurrentToFirst(): boolean;
    /**
     * Sets the last item in the view as the current item.
     */
    moveCurrentToLast(): boolean;
    /**
     * Sets the item after the current item in the view as the current item.
     */
    moveCurrentToNext(): boolean;
    /**
     * Sets the item at the specified index in the view as the current item.
     *
     * @param index The index of the item to set as the {@link currentItem}.
     */
    moveCurrentToPosition(index: number): boolean;
    /**
     * Sets the item before the current item in the view as the current item.
     */
    moveCurrentToPrevious(): boolean;
    /**
     * Re-creates the view using the current sort, filter, and group parameters.
     */
    refresh(): void;
    /**
     * Occurs after the current item changes.
     */
    currentChanged: wijmo.Event<ICollectionView, wijmo.EventArgs>;
    /**
     * Occurs before the current item changes.
     */
    currentChanging: wijmo.Event<ICollectionView, wijmo.EventArgs>;

    // since we don't have IDisposable/using:

    /**
     * Suspends refreshes until the next call to {@link endUpdate}.
     */
    beginUpdate(): void;
    /**
     * Resumes refreshes suspended by a call to {@link beginUpdate}.
     * 
     * @param force Whether to force a refresh when ending the update.
     */
    endUpdate(force?: boolean): void;
    /**
     * Executes a function within a beginUpdate/endUpdate block.
     *
     * The collection will not be refreshed until the function has been executed.
     * This method ensures endUpdate is called even if the function throws.
     *
     * @param fn Function to be executed within the beginUpdate/endUpdate block.
     * @param force Whether to force a refresh when ending the update.
     */
    deferUpdate(fn: Function, force?: boolean): void;

    // since we don't have IEnumerable:

    /**
     * Gets the filtered, sorted, grouped items in the view.
     */
    items: T[];
}

/**
 * Defines methods and properties that extend {@link ICollectionView} to provide 
 * editing capabilities.
 */
export interface IEditableCollectionView extends ICollectionView {
    /**
     * Gets a value that indicates whether a new item can be added to the collection.
     */
    canAddNew: boolean;
    /**
     * Gets a value that indicates whether the collection view can discard pending changes 
     * and restore the original values of an edited object.
     */
    canCancelEdit: boolean;
    /**
     * Gets a value that indicates whether items can be removed from the collection.
     */
    canRemove: boolean;
    /**
     * Gets the item that is being added during the current add transaction.
     */
    currentAddItem: any;
    /**
     * Gets the item that is being edited during the current edit transaction.
     */
    currentEditItem: any;
    /**
     * Gets a value that indicates whether an add transaction is in progress.
     */
    isAddingNew: boolean;
    /**
     * Gets a value that indicates whether an edit transaction is in progress.
     */
    isEditingItem: boolean;
    /**
     * Adds a new item to the collection.
     *
     * @return The item that was added to the collection.
     */
    addNew(): any;
    /**
     * Ends the current edit transaction and, if possible, 
     * restores the original value to the item.
     */
    cancelEdit(): void;
    /**
     * Ends the current add transaction and discards the pending new item.
     */
    cancelNew(): void;
    /**
     * Ends the current edit transaction and saves the pending changes.
     */
    commitEdit(): void;
    /**
     * Ends the current add transaction and saves the pending new item.
     */
    commitNew(): void;
    /**
     * Begins an edit transaction of the specified item.
     *
     * @param item Item to edit.
     */
    editItem(item: any): void;
    /**
     * Removes the specified item from the collection.
     *
     * @param item Item to remove from the collection.
     */
    remove(item: any): void;
    /**
     * Removes the item at the specified index from the collection.
     *
     * @param index Index of the item to remove from the collection.
     */
    removeAt(index: number): void;
}

/**
 * Defines methods and properties that extend {@link ICollectionView} to provide 
 * paging capabilities.
 */
export interface IPagedCollectionView extends ICollectionView {
    /**
     * Gets a value that indicates whether the {@link pageIndex} value can change.
     */
    canChangePage: boolean;
    /**
     * Gets a value that indicates whether the index is changing.
     */
    isPageChanging: boolean;
    /**
     * Gets the number of items in the view taking paging into account.
     *
     * To get the total number of items, use the {@link totalItemCount} property.
     *
     * Notice that this is different from the .NET <b>IPagedCollectionView</b>,
     * where <b>itemCount</b> and <b>totalItemCount</b> both return the count
     * before paging is applied.
     */
    itemCount: number;
    /**
     * Gets the zero-based index of the current page.
     */
    pageIndex: number;
    /**
     * Gets or sets the number of items to display on each page.
     */
    pageSize: number;
    /**
     * Gets the total number of items in the view before paging is applied.
     *
     * To get the number of items in the current view taking paging into
     * account, use the {@link itemCount} property.
     *
     * Notice that this is different from the .NET <b>IPagedCollectionView</b>,
     * where <b>itemCount</b> and <b>totalItemCount</b> both return the count
     * before paging is applied.
     */
    totalItemCount: number;
    /**
     * Sets the first page as the current page.
     */
    moveToFirstPage(): boolean;
    /**
     * Sets the last page as the current page.
     */
    moveToLastPage(): boolean;
    /**
     * Moves to the page after the current page.
     */
    moveToNextPage(): boolean;
    /**
     * Moves to the page at the specified index.
     *
     * @param index Index of the page to move to.
     */
    moveToPage(index: number): boolean;
    /**
     * Moves to the page before the current page.
     */
    moveToPreviousPage(): boolean;
    /**
    * Occurs after the page index changes.
    */
    pageChanged: wijmo.Event<IPagedCollectionView, wijmo.EventArgs>;
    /**
     * Occurs before the page index changes.
     */
    pageChanging: wijmo.Event<IPagedCollectionView, PageChangingEventArgs>;
}

/**
 * Provides data for the {@link IPagedCollectionView.pageChanging} event
 */
export class PageChangingEventArgs extends wijmo.CancelEventArgs
{
    /**
     * Gets the index of the page that is about to become current.
     */
    newPageIndex: number;

    /**
     * Initializes a new instance of the {@link PageChangingEventArgs} class.
     *
     * @param newIndex Index of the page that is about to become current.
     */
    constructor(newIndex: number) {
        super();
        this.newPageIndex = newIndex;
    }
}

/**
 * Represents a base class for types defining grouping conditions. 
 *
 * The concrete class which is commonly used for this purpose is 
 * {@link PropertyGroupDescription}.
 */
export class GroupDescription {

    /**
     * Returns the group name for the given item.
     *
     * @param item The item to get group name for.
     * @param level The zero-based group level index.
     * @return The name of the group the item belongs to.
     */
    public groupNameFromItem(item: any, level: number): any {
        return '';
    }
    /**
     * Returns a value that indicates whether the group name and the item name
     * match (which implies that the item belongs to the group).
     *
     * @param groupName The name of the group.
     * @param itemName The name of the item.
     * @return True if the names match; otherwise, false.
     */
    public namesMatch(groupName: any, itemName: any): boolean {
        return groupName === itemName;
    }
}

/**
 * Describes the grouping of items using a property name as the criterion.
 *
 * For example, the code below causes a {@link CollectionView} to group items 
 * by the value of their 'country' property:
 * <pre>
 * var cv = new wijmo.collections.CollectionView(items);
 * var gd = new wijmo.collections.PropertyGroupDescription('country');
 * cv.groupDescriptions.push(gd);
 * </pre>
 *
 * You may also specify a callback function that generates the group name.
 * For example, the code below causes a {@link CollectionView} to group items 
 * by the first letter of the value of their 'country' property:
 * <pre>
 * var cv = new wijmo.collections.CollectionView(items);
 * var gd = new wijmo.collections.PropertyGroupDescription('country', 
 *   function(item, propName) {
 *     return item[propName][0]; // return country's initial
 * });
 * cv.groupDescriptions.push(gd);
 * </pre>
 */
export class PropertyGroupDescription extends GroupDescription {
    _bnd: wijmo.Binding;
    _converter: IGroupConverter;

    /**
     * Initializes a new instance of the {@link PropertyGroupDescription} class.
     *
     * @param property The name of the property that specifies
     * which group an item belongs to.
     * @param converter A callback function that takes an item and 
     * a property name and returns the group name. If not specified, 
     * the group name is the property value for the item.
     */
    constructor(property: string, converter?: IGroupConverter) {
        super();
        this._bnd = new wijmo.Binding(property);
        this._converter = converter;
    }
    /**
     * Gets the name of the property that is used to determine which 
     * group an item belongs to.
     */
    get propertyName(): string {
        return this._bnd.path;
    }
    /**
     * Returns the group name for the given item.
     *
     * @param item The item to get group name for.
     * @param level The zero-based group level index.
     * @return The name of the group the item belongs to.
     */
    public groupNameFromItem(item: any, level: number): any {
        return this._converter
            ? this._converter(item, this.propertyName)
            : this._bnd.getValue(item);
    }
    /**
     * Returns a value that indicates whether the group name and the item name
     * match (which implies that the item belongs to the group).
     *
     * @param groupName The name of the group.
     * @param itemName The name of the item.
     * @return True if the names match; otherwise, false.
     */
    public namesMatch(groupName: any, itemName: any): boolean {
        return groupName === itemName;
    }
}

    }
    


    module wijmo {
    










'use strict';

// major (ECMAScript version required).
// year/trimester.
// sequential
var _VERSION = '5.20212.812';

/**
 * Gets the version of the Wijmo library that is currently loaded.
 */
export function getVersion(): string {
    return _VERSION;
}

/**
 * Sets the license key that identifies licensed Wijmo applications.
 * 
 * If you do not set the license key, Wijmo will run in evaluation mode,
 * adding a watermark element to the page.
 * 
 * Licensed users may obtain keys at the 
 * <a href="https://www.grapecity.com/my-account" target="_blank">My Account</a>
 * section of the Wijmo site.
 * 
 * Note that Wijmo does not send keys or any licensing information to any servers. 
 * It only checks the internal consistency of the key provided.
 * 
 * @param licenseKey String containing the license key to use in this application.
 */
export function setLicenseKey(licenseKey: string): void {
    Control._licKey = licenseKey;
}

/**
 * Specifies constants that represent keyboard codes.
 *
 * This enumeration is useful when handling <b>keyDown</b> events.
 */
export enum Key {
    /** The backspace key. */
    Back = 8,
    /** The tab key. */
    Tab = 9,
    /** The enter key. */
    Enter = 13,
    /** The escape key. */
    Escape = 27,
    /** The space key. */
    Space = 32,
    /** The page up key. */
    PageUp = 33,
    /** The page down key. */
    PageDown = 34,
    /** The end key. */
    End = 35,
    /** The home key. */
    Home = 36,
    /** The left arrow key. */
    Left = 37,
    /** The up arrow key. */
    Up = 38,
    /** The right arrow key. */
    Right = 39,
    /** The down arrow key. */
    Down = 40,
    /** The delete key. */
    Delete = 46,
    /** The F1 key. */
    F1 = 112,
    /** The F2 key. */
    F2 = 113,
    /** The F3 key. */
    F3 = 114,
    /** The F4 key. */
    F4 = 115,
    /** The F5 key. */
    F5 = 116,
    /** The F6 key. */
    F6 = 117,
    /** The F7 key. */
    F7 = 118,
    /** The F8 key. */
    F8 = 119,
    /** The F9 key. */
    F9 = 120,
    /** The F10 key. */
    F10 = 121,
    /** The F11 key. */
    F11 = 122,
    /** The F12 key. */
    F12 = 123,
}

/**
 * Specifies constants that represent data types.
 *
 * Use the {@link getType} method to get a {@link DataType} from a value.
 */
export enum DataType {
    /** Object (anything). */
    Object,
    /** String. */
    String,
    /** Number. */
    Number,
    /** Boolean. */
    Boolean,
    /** Date (date and time). */
    Date,
    /** Array. */
    Array
}

// general-purpose utilities.
// note: avoid letting this grow too much!!!

/**
 * Allows callers to verify whether an object implements an interface.
 */
export interface IQueryInterface {
    /**
     * Returns true if the object implements a given interface.
     *
     * @param interfaceName Name of the interface to look for.
     */
    implementsInterface(interfaceName: string): boolean;
}
/**
 * Casts a value to a type if possible.
 *
 * @param value Value to cast.
 * @param type Type or interface name to cast to.
 * @return The value passed in if the cast was successful, null otherwise.
 */
export function tryCast(value: any, type: any): any {

    // null doesn't implement anything
    if (value == null) {
        return null;
    }

    // test for interface implementation (IQueryInterface)
    if (isString(type)) {
        return isFunction(value.implementsInterface) && value.implementsInterface(type) ? value : null;
    }

    // regular type test
    return value instanceof type ? value : null;
}
/**
 * Determines whether an object is a primitive type (string, number, Boolean, or Date).
 *
 * @param value Value to test.
 */
export function isPrimitive(value: any): value is string | number | Boolean | Date {
    return isString(value) || isNumber(value) || isBoolean(value) || isDate(value);
}
/**
 * Determines whether an object is a string.
 *
 * @param value Value to test.
 */
export function isString(value: any): value is string {
    return typeof (value) == 'string';
}
/**
 * Determines whether a string is null, empty, or whitespace only.
 *
 * @param value Value to test.
 */
export function isNullOrWhiteSpace(value: string): boolean {
    //return value == null ? true : value.replace(/\s/g, '').length < 1; // slow
    //return !value || !value.trim(); // fast
    return !value || !/\S/.test(value); // even faster (usually)
}
/**
 * Determines whether an object is a number.
 *
 * @param value Value to test.
 */
export function isNumber(value: any): value is number {
    return typeof (value) == 'number';
}
/**
 * Determines whether an object is an integer.
 *
 * @param value Value to test.
 */
export function isInt(value: any): value is number {
    return isNumber(value) && value == Math.round(value);
}
/**
 * Determines whether an object is a Boolean.
 *
 * @param value Value to test.
 */
export function isBoolean(value: any): value is boolean {
    return typeof (value) == 'boolean';
}
/**
 * Determines whether an object is a function.
 *
 * @param value Value to test.
 */
export function isFunction(value: any): value is Function {
    return typeof (value) == 'function';
}
/**
 * Determines whether an object is undefined.
 *
 * @param value Value to test.
 */
export function isUndefined(value: any): value is undefined {
    return typeof (value) == 'undefined'
}
/**
 * Determines whether an object is a Date.
 *
 * @param value Value to test.
 */
export function isDate(value: any): value is Date {
    return (value instanceof Date || Object.prototype.toString.call(value) === '[object Date]')
        ? !isNaN(value.getTime())
        : false;

    // for a detailed discussion see
    // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
}
/**
 * Determines whether an object is an Array.
 *
 * @param value Value to test.
 */
export function isArray(value: any): value is Array<any> {
    return value instanceof Array || // doesn't work on different windows
        Array.isArray(value) || // doesn't work on derived classes
        Object.prototype.toString.call(value) === '[object Array]'; // always works

    // for a detailed discussion see
    // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
}
/**
 * Determines whether a value is an object
 * (as opposed to a value type, an array, or a Date).
 *
 * @param value Value to test.
 */
export function isObject(value: any): boolean {
    return value != null && typeof (value) == 'object' && !isDate(value) && !isArray(value);
}
/**
 * Determines whether an object is empty
 * (contains no enumerable properties).
 *
 * @param obj Object to test.
 */
export function isEmpty(obj: any): boolean {
    for (var k in obj) return false;
    return true;
}

/**
 * Creates a new unique id for an element by adding sequential
 * numbers to a given base id.
 *
 * @param baseId String to use as a basis for generating the unique id.
 */
export function getUniqueId(baseId: string): string {
    let newId = baseId;
    for (let i = 0; document.getElementById(newId) != null; i++) {
        newId = baseId + i; // new unique id
    }
    return newId;
}

/**
 * Converts mouse or touch event arguments into a {@link Point} in page coordinates.
 */
export function mouseToPage(e: any): Point {

    // accept Point objects
    if (e instanceof Point) {
        return e;
    }

    // accept touch events
    if (e && e.touches && e.touches.length > 0) {
        e = e.touches[0];
    }

    // accept mouse events
    // The pageX/Y properties may return wrong values (e.g. Android with zoomed screens); 
    // so we get the client coordinates and apply the page offset ourselves instead.
    if (isNumber(e.clientX) && isNumber(e.clientY)) {
        return new Point(e.clientX + pageXOffset, e.clientY + pageYOffset);
    }
    //if (isNumber(e.pageX) && isNumber(e.pageY)) {
    //    return new Point(e.pageX, e.pageY);
    //}

    // wrong parameter type...
    throw 'Mouse or touch event expected.';
}

/**
 * Gets the type of a value.
 *
 * @param value Value to test.
 * @return A {@link DataType} value representing the type of the value passed in.
 */
export function getType(value: any): DataType {
    if (isNumber(value)) return DataType.Number;
    if (isBoolean(value)) return DataType.Boolean;
    if (isDate(value)) return DataType.Date;
    if (isString(value)) return DataType.String;
    if (isArray(value)) return DataType.Array;
    return DataType.Object;
}
/**
 * Provides binding information for object properties.
 */
export interface IBindingInfo {
    binding: string;
    dataType: DataType;
    isReadOnly?: boolean;
}
/**
 * Gets an array containing the names and types of items in an array.
 *
 * @param arr Array containing data items.
 * @return An array containing objects with the binding and type of each
 * primitive property in the items found in the input array.
 */
export function getTypes(arr: any[]): IBindingInfo[] {
    let types: IBindingInfo[] = [];
    if (arr && arr.length > 0) {
        let item = arr[0];
        for (let key in item) {
            let value = null; // scan to find a non-null value so we can get the type
            for (let i = 0; i < arr.length && i < 1000 && value == null; i++) {
                value = arr[i][key];
                if (isPrimitive(value)) {
                    let pd = Object.getOwnPropertyDescriptor(arr[i], key);
                    types.push({
                        binding: key,
                        dataType: getType(value),
                        isReadOnly: pd && !pd.writable && !pd.set
                    });
                }
            }
        }
    }
    return types;
}
/**
 * Changes the type of a value.
 *
 * If the conversion fails, the original value is returned. To check if a
 * conversion succeeded, you should check the type of the returned value.
 *
 * @param value Value to convert.
 * @param type {@link DataType} to convert the value to.
 * @param format Format to use when converting to or from strings.
 * @param refDate Reference date to use when parsing strings with missing information.
 * @return The converted value, or the original value if a conversion was not possible.
 */
export function changeType(value: any, type: DataType, format?: string, refDate?: Date): any {
    if (value != null) {
        let DT = DataType;

        // convert strings to numbers, dates, or booleans
        if (isString(value)) {
            switch (type) {

                case DT.Number:
                    let num = Globalize.parseFloat(value, format);
                    return isNaN(num) ? value : num;

                case DT.Date:
                    let date = Globalize.parseDate(value, format, isDate(refDate) ? refDate : null);
                    if (!date && !format && value) {
                        date = new Date(value); // fall back on JavaScript parser
                    }
                    return date && isFinite(date.getTime()) ? date : value;

                case DT.Boolean:
                    switch ((value as string).toLowerCase()) {
                        case 'true': return true;
                        case 'false': return false;
                    }
                    return value; // TFS 125067
                
                case DT.Array: // TFS 465920
                    try {
                        let items = value.split(','),
                            arr = items.map(item => {
                                item = item.trim();
                                return item.match(/^(\+|\-)?\d+\.?\d*$/)
                                    ? item
                                    : '"' + item + '"'
                            });
                        return JSON.parse('[' + arr.join(',') + ']');
                    } catch (x) { }
                    break;
            }
        }

        // convert anything to string
        if (type == DataType.String) {
            return Globalize.format(value, format);
        }
    }

    // did not convert...
    //console.log('did not convert "' + value + '" to type ' + DataType[type]);
    return value;
}
/**
 * Rounds or truncates a number to a specified precision.
 *
 * @param value Value to round or truncate.
 * @param prec Number of decimal digits for the result.
 * @param truncate Whether to truncate or round the original value.
 */
export function toFixed(value: number, prec: number, truncate: boolean): number {
    if (truncate) {
        let str = value.toString(),
            decPos = str.indexOf('.');
        if (str.indexOf('e') < 0 && decPos > -1) {
            str = str.substr(0, decPos + 1 + prec);
            value = parseFloat(str);
        }
    } else {
        let str = value.toFixed(prec);
        value = parseFloat(str);
    }
    return value;
}
/**
 * Replaces each format item in a specified string with the text equivalent of an
 * object's value.
 *
 * The function works by replacing parts of the <b>formatString</b> with the pattern
 * '{name:format}' with properties of the <b>data</b> parameter. For example:
 *
 * ```typescript
 * import { format } from '@grapecity/wijmo';
 * let data = { name: 'Joe', amount: 123456 },
 *     msg = format('Hello {name}, you won {amount:n2}!', data);
 * ```
 *
 * The {@link format} function supports pluralization. If the format string is a
 * JSON-encoded object with 'count' and 'when' properties, the method uses
 * the 'count' parameter of the data object to select the appropriate format
 * from the 'when' property. For example:
 *
 * ```typescript
 * import { format } from '@grapecity/wijmo';
 * fmtObj fmt = {
 *     count: 'count',
 *     when: {
 *         0: 'No items selected.',
 *         1: 'One item is selected.',
 *         2: 'A pair is selected.',
 *         'other': '{count:n0} items are selected.'
 *     }
 * };
 * let fmt = JSON.stringify(fmtObj);
 * console.log(format(fmt, { count: 0 }));  // No items selected.
 * console.log(format(fmt, { count: 1 }));  // One item is selected.
 * console.log(format(fmt, { count: 2 }));  // A pair is selected.
 * console.log(format(fmt, { count: 12 })); // 12 items are selected.
 * ```
 *
 * The optional <b>formatFunction</b> allows you to customize the content by
 * providing context-sensitive formatting. If provided, the format function
 * gets called for each format element and gets passed the data object, the
 * parameter name, the format, and the value; it should return an output string.
 * For example:
 *
 * ```typescript
 * import { format, isString, escapeHtml } from '@grapecity/wijmo';
 * let data = { name: 'Joe', amount: 123456 },
 *     msg = format('Hello {name}, you won {amount:n2}!', data,
 *     (data, name, fmt, val) => {
 *         if (isString(data[name])) {
 *             val = escapeHtml(data[name]);
 *         }
 *         return val;
 *     }
 * );
 * ```
 *
 * @param format A composite format string.
 * @param data The data object used to build the string.
 * @param formatFunction An optional function used to format items in context.
 * @return The formatted string.
 */
export function format(format: string, data: any, formatFunction?: Function): string {
    format = asString(format);

    // pluralize
    if (format.match(/\{.*"count".*:.*"when".*:.*\}/)) {
        try {
            let pluralized = JSON.parse(format);
            if (isString(pluralized.count)) {
                let count = data[pluralized.count],
                    when = pluralized.when;
                if (isNumber(count) && isObject(when)) {
                    let pluralizedFormat = when[count] || when.other;
                    if (isString(pluralizedFormat)) {
                        format = pluralizedFormat;
                    }
                }
            }
        } catch (x) { }
    }

    // apply format
    return format.replace(/\{(.*?)(:(.*?))?\}/g, (match, name, x, fmt) => {
        let val = match;
        if (name && name[0] != '{' && data) {

            // get the value
            val = new Binding(name).getValue(data); // to support deep bindings
            //val = data[name];

            // apply static format
            if (fmt) {
                val = Globalize.format(val, fmt);
            }

            // apply format function
            if (formatFunction) {
                val = formatFunction(data, name, fmt, val);
            }
        }
        return val == null ? '' : val;
    });
}
/**
 * Tag function for use with template literals.
 * 
 * The {@link glbz} tag function allows you to specify formatting for
 * variables in template literal expressions.
 * 
 * To format a variable in a template literal using {@link glbz}, add a
 * colon and the format string after the name of the variable you want
 * to format.
 * 
 * For example:
 * 
 * ```typescript
 * import { glbz } from '@grapecity/wijmo';
 * let num = 42,
 *     dt = new Date(),
 *     msg = glbz`the number is ${num}:n2, and the date is ${dt}:'MMM d, yyyy'!`;
 * ```
 */
export function glbz(...args: any[]): string {
    let result = [],
        skipIndex = -1;
    args[0].forEach((part: string, index: number) => {
        if (index > 0 && index != skipIndex) {
            let val = args[index];
            let match = part.match(/^:([a-z][0-9]*\b)/i) || // unquoted format ${foo}:n0 
                part.match(/^:'(.+?)'/) || // single-quoted format ${foo}:'n0' 
                part.match(/^:"(.+?)"/); // double-quoted format ${foo}:"n0"
            if (match) {
                val = Globalize.format(val, match[1]);
                part = part.substr(match[0].length);
            } else if (part == ':' && index < args.length - 1) { // variable format ${foo}:${fmt}
                if (isNumber(val) || isDate(val)) {
                    val = Globalize.format(val, args[index + 1]);
                    part = '';
                    skipIndex = index + 1;
                }
            }
            result.push(val); // push interpolation
        }
        if (part) {
            result.push(part); // push string part
        }
    });
    return result.join(''); // return the result as a string
}
/**
 * Evaluates a string in template literal notation.
 * 
 * This function allows you to evaluate template literals on-demand,
 * rather than when they are declared.
 * 
 * The template string uses the standard template literal syntax, 
 * except it is a regular string (enclosed in single or double
 * quotes) rather than a template literal (enclosed in back-quotes).
 * 
 * The template string may contain references to variables provided
 * in a context object passed as a parameter.
 * 
 * The template string may contain formatting information as 
 * used with the {@link glbz} tag function.
 * 
 * For example:
 * ```typescript
 * import { evalTemplate } from '@grapecity/wijmo';
 * const msg = evalTemplate('hello ${user}, want some ${Math.PI}:n2?', { user: 'Chris' }));
 * console.log(msg);
 * > hello Chris, want some 3.14?
 * ```
 * 
 * @param template String in template literal notation.
 * @param ctx Object with properties acessible to the template.
 * @returns A string containing the result.
 */
export function evalTemplate(template: string, ctx?: any): string {
    if (isIE()) {

        // handle tagged formats first (e.g. ${foo}:${col.format} => ${foo}:n2) (TFS 408814)
        let rxFmt = /:\${([^}]*)}/g;
        template = template.replace(rxFmt, (tag, expr) => {
            return ':' + _evalExpression(expr, ctx);
        });

        // handle regular and formatted tags (${foo}:n2 => 12.23)
        let rx = /\${([^}]*)}(:(([A-Za-z]\d*)|"([^"]+)"|'([^']+)'))?/g;
        return template.replace(rx, (tag, expr, fmtq, fmt, fmtRaw, fmtQ2, fmtQ1) => {
            let result = _evalExpression(expr, ctx);
            return fmt ? Globalize.format(result, fmtRaw || fmtQ2 || fmtQ1) : result;
        });
    } else {
        return _evalExpression(template, ctx)
    }
}
function _evalExpression(expr: string, ctx: any): string {
    ctx = ctx || {};
    ctx.glbz = glbz;
    let keys = Object.keys(ctx);
    let vals = keys.map(e => ctx[e]);
    let fn = isIE()
        ? new Function(...keys, 'return ' + expr)
        : new Function(...keys, 'return glbz`' + expr + '`');
    return fn(...vals);
}
/**
 * Clamps a value between a minimum and a maximum.
 *
 * @param value Original value.
 * @param min Minimum allowed value.
 * @param max Maximum allowed value.
 */
export function clamp(value: number, min: number, max: number): number {
    if (value != null) {
        if (max != null && value > max) value = max;
        if (min != null && value < min) value = min;
    }
    return value;
}
/**
 * Copies properties from an object to another.
 *
 * This method is typically used to initialize controls and other Wijmo objects
 * by setting their properties and assigning event handlers.
 *
 * The destination object must define all the properties defined in the source,
 * or an error will be thrown.
 *
 * @param dst The destination object.
 * @param src The source object.
 * @returns The destination object.
 */
export function copy(dst: any, src: any): any {
    if (src) {
        for (let key in src) {
            if (key[0] != '_') { // skip non-public properties
                assert(key in dst, 'Unknown property "' + key + '".');
                let value = src[key];
                if (!dst._copy || !dst._copy(key, value)) { // allow overrides
                    if (dst[key] instanceof Event) {
                        if (isFunction(value)) {
                            dst[key].addHandler(value); // add event handler
                        }
                    } else if (isObject(value) && (typeof (Element) === 'undefined' || !(value instanceof Element)) && dst[key] && key != 'itemsSource') {
                        copy(dst[key], value); // copy sub-objects
                    } else {
                        dst[key] = value; // assign values
                    }
                }
            }
        }
    }
    return dst;
}
/**
 * Throws an exception if a condition is false.
 *
 * @param condition Condition expected to be true.
 * @param msg Message of the exception if the condition is not true.
 */
export function assert(condition: boolean, msg: string): void {
    if (!condition) {
        msg = '** Assertion failed in Wijmo: ' + msg;
        let err = new Error(); // add stack trace to message (TFS 387296)
        if (isString(err.stack)) {
            msg += ' ' + err.stack;
        }
        //console.error(msg);
        throw msg;
    }
}
/**
 * Outputs a message to indicate a member has been deprecated.
 *
 * @param oldMember Member that has been deprecated.
 * @param newMember Member that replaces the one that has been deprecated.
 */
export function _deprecated(oldMember: string, newMember: string): void {
    console.error('** WARNING: "' + oldMember + '" has been deprecated; please use "' + newMember + '" instead.');
}
/**
 * Asserts that a value is a string.
 *
 * @param value Value supposed to be a string.
 * @param nullOK Whether null values are acceptable.
 * @return The string passed in.
 */
export function asString(value: string, nullOK = true): string {
    if (isUndefined(value)) {
        value = null; // not 'undefined'...
    }
    assert((nullOK && value == null) || isString(value), 'String expected.');
    return value;
}
/**
 * Asserts that a value is a number.
 *
 * @param value Value supposed to be numeric.
 * @param nullOK Whether null values are acceptable.
 * @param positive Whether to accept only positive numeric values.
 * @return The number passed in.
 */
export function asNumber(value: number, nullOK = false, positive = false): number {
    assert((nullOK && value == null) || isNumber(value), 'Number expected.');
    if (positive && value && value < 0) {
        throw 'Positive number expected.';
    }
    return value;
}
/**
 * Asserts that a value is an integer.
 *
 * @param value Value supposed to be an integer.
 * @param nullOK Whether null values are acceptable.
 * @param positive Whether to accept only positive integers.
 * @return The number passed in.
 */
export function asInt(value: number, nullOK = false, positive = false): number {
    assert((nullOK && value == null) || isInt(value), 'Integer expected.');
    if (positive && value && value < 0) {
        throw 'Positive integer expected.';
    }
    return value;
}
/**
 * Asserts that a value is a Boolean.
 *
 * @param value Value supposed to be Boolean.
 * @param nullOK Whether null values are acceptable.
 * @return The Boolean passed in.
 */
export function asBoolean(value: boolean, nullOK = false): boolean {
    assert((nullOK && value == null) || isBoolean(value), 'Boolean expected.');
    return value;
}
/**
 * Asserts that a value is a Date.
 *
 * @param value Value supposed to be a Date.
 * @param nullOK Whether null values are acceptable.
 * @return The Date passed in.
 */
export function asDate(value: Date, nullOK = false): Date {

    // parse strings into dates using RFC 3339 pattern ([yyyy-MM-dd] [hh:mm[:ss]])
    if (isString(value)) {
        let dt = changeType(value, DataType.Date, 'r');
        if (isDate(dt)) {
            value = dt;
        }
    }

    assert((nullOK && value == null) || isDate(value), 'Date expected.');
    return value;
}
/**
 * Asserts that a value is a function.
 *
 * @param value Value supposed to be a function.
 * @param nullOK Whether null values are acceptable.
 * @return The function passed in.
 */
export function asFunction(value: any, nullOK = true): Function {
    assert((nullOK && value == null) || isFunction(value), 'Function expected.');
    return value;
}
/**
 * Asserts that a value is an array.
 *
 * @param value Value supposed to be an array.
 * @param nullOK Whether null values are acceptable.
 * @return The array passed in.
 */
export function asArray(value: any, nullOK = true): any[] {
    assert((nullOK && value == null) || isArray(value), 'Array expected.');
    return value;
}
/**
 * Asserts that a value is an instance of a given type.
 *
 * @param value Value to be checked.
 * @param type Type of value expected.
 * @param nullOK Whether null values are acceptable.
 * @return The value passed in.
 */
export function asType(value: any, type: any, nullOK = false): any {
    value = tryCast(value, type);
    assert(nullOK || value != null, type + ' expected.');
    return value;
}
/**
 * Asserts that a value is a valid setting for an enumeration.
 *
 * @param value Value supposed to be a member of the enumeration.
 * @param enumType Enumeration to test for.
 * @param nullOK Whether null values are acceptable.
 * @return The value passed in.
 */
export function asEnum(value: number, enumType: any, nullOK = false): number {
    if (value == null && nullOK) return null;
    let e = isString(value) ? enumType[value] : value; // don't check numeric ranges, it can fail with flags
    assert(e != null, 'Invalid enum value: "' + value + '"');
    return isNumber(e) ? e : value;
}
/**
 * Asserts that a value is an {@link ICollectionView} or an Array.
 *
 * @param value Array or {@link ICollectionView}.
 * @param nullOK Whether null values are acceptable.
 * @return The {@link ICollectionView} that was passed in or a {@link CollectionView}
 * created from the array that was passed in.
 */
export function asCollectionView(value: any, nullOK = true): wijmo.collections.ICollectionView {
    if (value == null && nullOK) {
        return null;
    }
    let cv = tryCast(value, 'ICollectionView');
    if (cv != null) {
        return cv;
    }
    if (!isArray(value)) {
        assert(false, 'Array or ICollectionView expected.');
    }
    return new wijmo.collections.CollectionView(value);
}
/**
 * Checks whether an {@link ICollectionView} is defined and not empty.
 *
 * @param value {@link ICollectionView} to check.
 */
export function hasItems(value: wijmo.collections.ICollectionView): boolean {
    return value != null && value.items != null && value.items.length > 0;
}
/**
 * Converts a camel-cased string into a header-type string by capitalizing the first letter
 * and adding spaces before uppercase characters preceded by lower-case characters.
 *
 * For example, 'somePropertyName' becomes 'Some Property Name'.
 *
 * @param text String to convert to header case.
 */
export function toHeaderCase(text: string): string {
    return text && text.length
        ? text[0].toUpperCase() + text.substr(1).replace(/([a-z])([A-Z])/g, '$1 $2')
        : '';
}
/**
 * Escapes a string by replacing HTML characters with text entities.
 *
 * Strings entered by users should always be escaped before they are displayed
 * in HTML pages. This helps ensure page integrity and prevent HTML/javascript
 * injection attacks.
 *
 * @param text Text to escape.
 * @return An HTML-escaped version of the original string.
 */
export function escapeHtml(text: string): string {
    if (text && isString(text)) {
        text = text.replace(/[&<>"'\/]/g, (s) => {
            return _ENTITYMAP[s];
        });
    }
    return text != null ? text.toString() : ''; // always return a string
}
const _ENTITYMAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
};
/**
 * Escapes a string by prefixing special regular expression characters 
 * with backslashes.
 * 
 * @param text Text to escape.
 * @return A RegExp-escaped version of the original string.
 */
export function escapeRegExp(text: string): string {
    return text.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}
/**
 * Converts an HTML string into plain text.
 *
 * @param html HTML string to convert to plain text.
 * @return A plain-text version of the string.
 */
export function toPlainText(html: string): string {
    let text = asString(html);
    if (isString(text) && text.indexOf('<') > -1) { // TFS 439134
        if (!_plainText) {
            _plainText = document.createElement('div'); // TFS 399900
        }
        _plainText.innerHTML = text;
        text = _plainText.textContent;
    }
    return text;
}
var _plainText: HTMLDivElement;
/**
 * Checks whether an element has a class.
 *
 * @param e Element to check.
 * @param className Class to check for.
 */
export function hasClass(e: Element, className: string): boolean {
    if (e && className) {

        // use classList if possible (not supported in IE9, IE/SvgElement)
        if (e instanceof HTMLElement && e.classList && !isIE9()) {
            return e.classList.contains(className);
        }

        // NOTE: using e.getAttribute('class') instead of e.classNames
        // so this works with SVG as well as regular HTML elements.
        // NOTE: don't use word boundaries because class names may have 
        // hyphens and other non-word boundary characters
        if (e.getAttribute) {
            let rx = new RegExp('(\\s|^)' + className + '(\\s|$)');
            return e && rx.test(e.getAttribute('class'));
        }
    }
    return false;
}
/**
 * Adds a class to an element.
 *
 * @param e Element that will have the class added.
 * @param className Class (or space-separated list of classes) to add to the element.
 */
export function addClass(e: Element, className: string): void {
    if (e && className) {

        // use classList if possible (not supported in IE9, IE/SvgElement)
        if (e instanceof HTMLElement && e.classList && !isIE9()) {
            if (className.indexOf(' ') < 0) {
                e.classList.add(className);
            } else {
                className.split(' ').forEach(cls => {
                    e.classList.add(cls);
                });
            }
            return;
        }

        // use regex otherwise (slower)
        if (e.setAttribute) {
            className.split(' ').forEach(cls => {
                if (!hasClass(e, cls)) {
                    let cn = e.getAttribute('class');
                    e.setAttribute('class', cn ? cn + ' ' + cls : cls);
                }
            });
        }
    }
}
/**
 * Removes a class from an element.
 *
 * @param e Element that will have the class removed.
 * @param className Class (or space-separated list of classes) to remove from the element.
 */
export function removeClass(e: Element, className: string): void {
    if (e && className) {

        // use classList if possible (not supported in IE9, IE/SvgElement)
        if (e instanceof HTMLElement && e.classList && !isIE9()) {
            if (className.indexOf(' ') < 0) {
                e.classList.remove(className);
            } else {
                className.split(' ').forEach(cls => {
                    e.classList.remove(cls);
                });
            }
            return;
        }

        // use regex otherwise (slower)
        if (e.setAttribute) {
            className.split(' ').forEach(cls => {
                if (hasClass(e, cls)) {
                    let rx = new RegExp('((\\s|^)' + cls + '(\\s|$))', 'g'),
                        cn = e.getAttribute('class');
                    cn = cn.replace(rx, ' ').replace(/ +/g, ' ').trim();
                    if (cn) {
                        e.setAttribute('class', cn);
                    } else {
                        e.removeAttribute('class');
                    }
                }
            });
        }
    }
}
/**
 * Adds or removes a class to or from an element.
 *
 * @param e Element that will have the class added.
 * @param className Class to add or remove.
 * @param addOrRemove Whether to add or remove the class. If not provided, toggle the class.
 */
export function toggleClass(e: Element, className: string, addOrRemove?: boolean): void {
    if (addOrRemove == null) {
        addOrRemove = !hasClass(e, className);
    }
    if (addOrRemove) {
        addClass(e, className);
    } else {
        removeClass(e, className);
    }
}
/**
 * Sets or clears an attribute on an element.
 *
 * @param e Element that will be updated.
 * @param name Name of the attribute to add or remove.
 * @param value Value of the attribute, or null to remove the attribute
 * from the element.
 * @param keep Whether to keep original attribute if present.
 */
export function setAttribute(e: Element, name: string, value?: any, keep?: boolean): void {
    if (e) {
        if (value != null) {
            if (!keep || !e.getAttribute(name)) {
                e.setAttribute(name, value.toString());
            }
        } else {
            e.removeAttribute(name);
        }
    }
}
/**
 * Sets the checked and indeterminate properties of a checkbox input
 * element.
 * 
 * @param cb Checkbox element.
 * @param checked True, false, or null for checked, unchecked, or indeterminate.
 */
export function setChecked(cb: HTMLInputElement, checked: boolean) {
    let indet = checked == null;
    cb.checked = isIE() ? (checked || indet) : checked; // TFS 456565
    cb.indeterminate = indet;
}
/**
 * Sets or clears an element's <b>aria-label</b> attribute.
 *
 * @param e Element that will be updated.
 * @param value Value of the aria label, or null to remove the label
 * from the element.
 */
export function setAriaLabel(e: Element, value?: string): void {
    setAttribute(e, 'aria-label', value);
}
/**
 * Sets the start and end positions of a selection in a text field.
 *
 * This method is similar to the native {@link setSelectionRange} method
 * in HTMLInputElement objects, except it checks for conditions that
 * may cause exceptions (element not in the DOM, disabled, or hidden).
 *
 * @param e HTMLInputElement or HTMLTextAreaElement to select.
 * @param start Offset into the text field for the start of the selection.
 * @param end Offset into the text field for the end of the selection.
 */
export function setSelectionRange(e: any, start: number, end = start): boolean {
    assert(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement, 'INPUT or TEXTAREA element expected');
    if (contains(document.body, e) && !e.disabled && e.offsetHeight) {

        // keep selection start in view (TFS 228053)
        // setSelectionRange is allowed only for certain input types
        // (text, search, URL, tel, and password, notably not 'number')
        try {
            e.setSelectionRange(start, end, 'backward');
        } catch (x) { }

        // always set the focus (even if setSelectionRange didn't work) // TFS 392458
        // needed in Chrome (TFS 124102, 142672, 228053)
        try {
            e.focus();
            return true;
        } catch (x) { }
    }
    return false;
}
/**
 * Disables the autocomplete, autocorrect, autocapitalize, and spellcheck
 * properties of an input element.
 * 
 * @param e The input element.
 */
export function disableAutoComplete(e: HTMLInputElement): void {
    // (important for mobile browsers including Chrome/ Android)
    // https://davidwalsh.name/disable-autocorrect
    let att = 'autocomplete', // keep autocomplete values other than 'on' and empty
        val = e.getAttribute(att);
    if (!val || val == 'on') {
        e.setAttribute(att, 'off');
    }
    'autocorrect,autocapitalize,spellcheck'.split(',').forEach(att => {
        e.setAttribute(att, att == 'spellcheck' ? 'false' : 'off');
    });
}
/**
 * Safely removes an element from the DOM tree.
 *
 * @param e Element to remove from the DOM tree.
 */
export function removeChild(e: Node): Node {
    return e && e.parentNode
        ? e.parentNode.removeChild(e)
        : null;
}
/**
 * Gets a reference to the element that contains the focus,
 * accounting for shadow document fragments.
 */
export function getActiveElement(): HTMLElement {
    let ae = document.activeElement as HTMLElement;
    if (ae) {
        // account for shadowRoot: https://github.com/w3c/webcomponents/issues/358)
        let shadowRoot = ae['shadowRoot'];
        if (shadowRoot && shadowRoot.activeElement) {
            ae = shadowRoot.activeElement as HTMLElement;
        }
    }
    return ae;
}
/*
 * An alternative for the getActiveElement function, which returns
 * a correct result (new focused element) even when called from the
 * blur/focusout events in evergreen browsers.
 */
 export function _getActiveElement(): HTMLElement {
    let ae = _focusSrv.activeElement;
    if (ae) {
        // account for shadowRoot: https://github.com/w3c/webcomponents/issues/358)
        let shadowRoot = ae['shadowRoot'];
        if (shadowRoot && shadowRoot.activeElement) {
            ae = shadowRoot.activeElement as HTMLElement;
        }
    }
    return ae;
}

/**
 * Moves the focus to the next/previous/first focusable child within
 * a given parent element.
 *
 * @param parent Parent element.
 * @param offset Offset to use when moving the focus (use zero to focus on the first focusable child).
 * @return True if the focus was set, false if a focusable element was not found.
 */
export function moveFocus(parent: HTMLElement, offset: number): boolean {

    // build array of focusable elements (including divs but not spans: TFS 255732)
    let focusable = _getFocusableElements(parent);

    // calculate focus index
    let index = 0;
    if (offset) {
        let i = focusable.indexOf(getActiveElement());
        if (i > -1) {
            index = (i + offset + focusable.length) % focusable.length; // TFS 152269, 152163
        }
    }

    // move focus to element at the focus index
    if (index < focusable.length) {
        let el = focusable[index] as HTMLInputElement;
        el.focus();
        if (el instanceof HTMLInputElement) {
            el.select(); // TFS 190336
        }
        return true;
    }
    return false;
}

// get an array with focusable child elements
function _getFocusableElements(parent: HTMLElement): any[] {
    let focusable = [],
        tags = 'input,select,textarea,button,a,div', // TFS 255732: divs, no spans
        elements = Array.prototype.slice.call(parent.querySelectorAll(tags)) as HTMLElement[];
    
    // sort by tabindex (TFS 466739)
    elements.sort((a, b) => a.tabIndex - b.tabIndex);
    
    // scan all the elements
    for (let i = 0; i < elements.length; i++) {
        let el = elements[i] as HTMLInputElement;

        // check that the element is visible and focusable
        if (el.offsetHeight > 0 && el.tabIndex > -1 &&
            !el.disabled &&
            // skip element if one of it's parent is invisible, WJM-20207
            window.getComputedStyle(el).visibility !== 'hidden' &&
            !closest(el, '[disabled],.wj-state-disabled')) {

            // skip anchor elements with no href (they are not focusable)
            if (el instanceof HTMLAnchorElement && !el.hasAttribute('href')) {
                continue;
            }

            // IE defaults tabindex to zero, other browsers to -1
            if (isIE() && !el.hasAttribute('tabindex')) {

                // skip divs without explicit tab index
                if (el instanceof HTMLDivElement) {
                    continue;
                }

                // skip cell elements with no tabindex in FlexGrid controls
                // with keyActionTab set to 'None'
                let grid = Control.getControl(closest(el, '.wj-flexgrid'));
                if (grid && grid['keyActionTab'] == 0) {
                    continue;
                }
            }

            // add controls and elements without child focusable elements
            if (Control.getControl(el) || !_getFocusableElements(el).length) {
                focusable.push(el);
            }
        }
    }
    return focusable;
}
/**
 * Saves content to a file.
 * 
 * @param content String to be saved to a file.
 * @param fileName Name of the file to save, including extension.
 * @param type Optional file MIME type.
 * 
 * The {@link saveFile} method can be used to create text files 
 * (txt, csv, html) as well as image files.
 * 
 * For example, this code saves the current selection of a FlexGrid to a CSV file:
 * 
 * ```typescript
 * import { saveFile } from '@grapecity/wijmo';
 * const clipString = theGrid.getClipString(null, true, true, false);
 * saveFile(clipString, 'grid.csv', 'text/csv');
 * ```
 * 
 * And this code saves the content of a canvas element to a JPG file:
 * 
 * ```typescript
 * import { saveFile } from '@grapecity/wijmo';
 * let dataUrl = canvas.toDataURL('image/jpg', 0.95),
 *     match = dataUrl.match(/^data:([^,]+),(.*)$/i);
 * saveFile(match[2], 'canvas.jpg', match[1]);
 * ```
 */
export function saveFile(content: string, fileName: string, type = 'text/plain'): void {

    // add BOM marker to csv files so Excel loads Unicode characters properly
    // https://stackoverflow.com/questions/42462764/javascript-export-csv-encoding-utf-8-issue
    if (type.match(/\bcsv\b/i) || fileName.match(/\.csv$/i)) {
        content = '\uFEFF' + content;
    }

    // save the content as a file
    let blob = new Blob([content], { type: type });
    if (isFunction(navigator.msSaveBlob)) { // IE
        navigator.msSaveBlob(blob, fileName); // call navigator object directly, no function reference (TFS 416195)
    } else {
        let url = URL.createObjectURL(blob), // supports large files (TFS 413382)
            a = createElement('<a href="' + url + '" download="' + fileName + '"></a>', document.body, {
                display: 'none'
            });
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
}

// ** jQuery replacement methods

/**
 * Gets an element from a query selector.
 *
 * @param selector An element, a query selector string, or a jQuery object.
 */
export function getElement(selector: any): HTMLElement {

    // check if the selector is an instance of Element rather than HTMLElement,
    // so this works with SVG elements too (TFS 216148)
    if (selector instanceof Element) {
        return selector as HTMLElement;
    }

    // try selecting an element, but ignore invalid selectors
    if (isString(selector)) {
        try {
            return document.querySelector(selector) as HTMLElement;
        } catch (x) { }
    }

    // jQuery support
    if (selector && selector.jquery) {
        return selector[0] as HTMLElement;
    }

    // no dice...
    return null;
}
/**
 * Creates an element from an HTML string.
 *
 * @param html HTML fragment to convert into an HTMLElement.
 * @param appendTo Optional HTMLElement to append the new element to.
 * @param css Optional CSS attributes to apply to the root of the new element.
 * @return The new element.
 */
export function createElement(html: string, appendTo?: HTMLElement, css?: any): HTMLElement {

    // replace 'style' attribute with '_wj-style' (handled later, to keep CSP happy)
    let styleAtt = '_wj-style';
    html = html.replace(/\bstyle\s*=\s*"/g, styleAtt + '="');

    // create the element
    let div = document.createElement('div') as HTMLElement;
    div.innerHTML = html;

    // apply styleAtt attribute
    if (html.indexOf(styleAtt) > -1) {
        let styled = div.querySelectorAll('[' + styleAtt + ']');
        for (let i = 0; i < styled.length; i++) {
            let e = styled[i] as HTMLElement,
                style = e.getAttribute(styleAtt).split(';');
            style.forEach(propVal => {
                let pv = propVal.split(':');
                if (pv.length == 2) {
                    e.style[pv[0].trim()] = pv[1].trim();
                }
            });
            e.removeAttribute(styleAtt);
        }
    }

    // if we have a single child, that's the element
    if (div.children.length == 1) { // TFS 275182
        div = div.children[0] as HTMLElement;
    }

    // apply CSS
    if (css) {
        setCss(div, css);
    }

    // append to parent
    if (appendTo) {
        appendTo = getElement(appendTo);
        appendTo.appendChild(div);
    }

    // all done
    return div;
}
/**
 * Sets the text content of an element.
 *
 * @param e Element that will have its content updated.
 * @param text Plain text to be assigned to the element.
 */
export function setText(e: HTMLElement, text: string): void {
    e.textContent = text || ''; // TFS 285180 (keep it simple)
}
/**
 * Checks whether an HTML element contains another.
 *
 * @param parent Parent element.
 * @param child Child element.
 * @param popup Whether to take Wijmo popups into account.
 * @return True if the parent element contains the child element.
 */
export function contains(parent: any, child: any, popup?: boolean): boolean {
    for (let e = child as Node; e && parent;) {
        if (e === parent) return true; // found!
        e = (popup ? e[Control._OWNR_KEY] : null) || // popup owner
            e.parentNode || // DOM parent
            e['host']; // shadow DOM
    }
    return false;
}
/**
 * Finds the closest ancestor (including the original element) that satisfies a selector.
 *
 * @param e Element where the search should start.
 * @param selector A string containing a selector expression to match elements against.
 * @return The closest ancestor that satisfies the selector, or null if not found.
 */
export function closest(e: any, selector: string): Element {
    if (e) {

        // everyone but IE implements "closest"
        if (isFunction(e.closest)) {
            return e.closest(selector);
        }

        // polyfill: slower, but works with all browsers
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
        let matches = e.matches || e.webkitMatchesSelector || e.msMatchesSelector || e['mozMatchesSelector'];
        if (matches) {
            for (; e && e.nodeType === 1; e = e.parentElement || e.parentNode) {
                if (matches.call(e, selector)) {
                    return e;
                }
            }
        }
    }
    return null;
}
/**
 * Finds the closest ancestor (including the original element) that satisfies a class selector.
 *
 * @param e Element where the search should start.
 * @param className A string containing the class name to match elements against.
 * @return The closest ancestor that has the specified class name, or null if not found.
 */
export function closestClass(e: any, className: string): Node {
    return closest(e, '.' + className);
}
/**
 * Enables or disables an element.
 *
 * @param e Element to enable or disable.
 * @param value Whether to enable or disable the element.
 */
export function enable(e: HTMLElement, value: boolean): void {

    // update wj-state-disabled class and disabled attribute on the element
    let disabled = !value,
        att = 'disabled';
    toggleClass(e, 'wj-state-disabled', disabled);
    setAttribute(e, att, disabled ? att : null);

    // update disabled attribute on inner input and button elements (TFS 190939, 376384)
    let inputs = e.querySelectorAll('input,button');
    for (let i = 0; i < inputs.length; i++) {
        setAttribute(inputs[i], att, disabled ? att : null);
    }
}
/**
 * Gets the bounding rectangle of an element in page coordinates.
 *
 * This is similar to the <b>getBoundingClientRect</b> function,
 * except that uses viewport coordinates, which change when the
 * document scrolls.
 */
export function getElementRect(e: Element): Rect {
    let rc = e.getBoundingClientRect();
    return new Rect(rc.left + pageXOffset, rc.top + pageYOffset, rc.width, rc.height);
}
/**
 * Modifies the style of an element by applying the properties specified in an object.
 *
 * @param e Element or array of elements whose style will be modified.
 * @param css Object containing the style properties to apply to the element.
 */
export function setCss(e: any, css: any): void {

    // sanity
    assert(isObject(css), 'css parameter should be an object');

    // apply to arrays
    if (e instanceof Array) {
        for (let i = 0; i < e.length; i++) {
            setCss(e[i], css);
        }
        return;
    }

    // apply to elements
    if (e && e.style) {
        let s = e.style;
        for (let p in css) {

            // add pixel units to numeric geometric properties
            let val = css[p];
            if (typeof (val) == 'number' &&
                p.match(/width|height|left|top|right|bottom|size|padding|margin'/i)) {
                val = val + 'px';
            }

            // set the attribute if it changed
            if (s[p] !== val) { // TFS 312890
                s[p] = val;
            }
        }
    }
}

/**
 * Represents a method called periodically while handling calls to 
 * the {@link animate} method.
 */
export interface IAnimateCallback {
    /**
     * @param percentage Value ranging from zero to one that indicates how
     * far along the animation is.
     */
    (percentage: number): void;
}
/**
 * Calls a function on a timer with a parameter varying between zero and one.
 *
 * Use this function to create animations by modifying document properties
 * or styles on a timer.
 *
 * For example, the code below changes the opacity of an element from zero
 * to one in one second:
 * 
 * ```typescript
 * import { animate } from '@grapecity/wijmo';
 * const element = document.getElementById('someElement');
 * animate(pct => {
 *     element.style.opacity = pct;
 * }, 1000);
 * ```
 *
 * The function returns an interval ID that you can use to stop the
 * animation. This is typically done when you are starting a new animation
 * and wish to suspend other on-going animations on the same element.
 * For example, the code below keeps track of the interval ID and clears
 * if before starting a new animation:
 * 
 * ```typescript
 * import { animate } from '@grapecity/wijmo';
 * const element = document.getElementById('someElement');
 * if (this._animInterval) {
 *     clearInterval(this._animInterval);
 * }
 * this._animInterval = animate(pct => {
 *     element.style.opacity = pct;
 *     if (pct == 1) {
 *         self._animInterval = null;
 *     }
 * }, 1000);
 * ```
 *
 * @param apply Callback function that modifies the document.
 * The function takes a single parameter that represents a percentage.
 * @param duration The duration of the animation, in milliseconds.
 * @param step The interval between animation frames, in milliseconds.
 * @return An interval id that you can use to suspend the animation.
 */
export function animate(apply: IAnimateCallback, duration?: number, step?: number): any {

    // set defaults (doing it this way to avoid screwing the docs)
    if (duration == null) {
        duration = Control._ANIM_DEF_DURATION;
    }
    if (step == null) {
        step = Control._ANIM_DEF_STEP;
    }

    // type-checking
    apply = asFunction(apply) as IAnimateCallback;
    duration = asNumber(duration, false, true);
    step = asNumber(step, false, true);

    // perform the animation
    let start = Date.now(),
        animFrame: any;
    let anim = setInterval(() => {
        let pct = Math.min(1, (Date.now() - start) / duration); // linear
        pct = Math.sin(pct * Math.PI / 2); // easeOutSin
        pct *= pct; // swing
        if (animFrame) {
            cancelAnimationFrame(animFrame);
        }
        animFrame = requestAnimationFrame(() => {
            animFrame = null;
            apply(pct);
        });
        if (pct >= 1) { // done!
            clearInterval(anim);
        }
    }, step);
    return anim;
}


// ** utility classes

/**
 * Class that represents a point (with x and y coordinates).
 */
export class Point {
    /**
     * Gets or sets the x coordinate of this {@link Point}.
     */
    x: number;
    /**
     * Gets or sets the y coordinate of this {@link Point}.
     */
    y: number;
    /**
     * Initializes a new instance of the {@link Point} class.
     *
     * @param x X coordinate of the new Point.
     * @param y Y coordinate of the new Point.
     */
    constructor(x: number = 0, y: number = 0) {
        this.x = asNumber(x);
        this.y = asNumber(y);
    }
    /**
     * Returns true if a {@link Point} has the same coordinates as this {@link Point}.
     *
     * @param pt {@link Point} to compare to this {@link Point}.
     */
    equals(pt: Point): boolean {
        return (pt instanceof Point) && this.x == pt.x && this.y == pt.y;
    }
    /**
     * Creates a copy of this {@link Point}.
     */
    clone(): Point {
        return new Point(this.x, this.y);
    }
}

/**
 * Class that represents a size (with width and height).
 */
export class Size {
    /**
     * Gets or sets the width of this {@link Size}.
     */
    width: number;
    /**
     * Gets or sets the height of this {@link Size}.
     */
    height: number;
    /**
     * Initializes a new instance of the {@link Size} class.
     *
     * @param width Width of the new {@link Size}.
     * @param height Height of the new {@link Size}.
     */
    constructor(width = 0, height = 0) {
        this.width = asNumber(width);
        this.height = asNumber(height);
    }
    /**
     * Returns true if a {@link Size} has the same dimensions as this {@link Size}.
     *
     * @param sz {@link Size} to compare to this {@link Size}.
     */
    equals(sz: Size): boolean {
        return (sz instanceof Size) && this.width == sz.width && this.height == sz.height;
    }
    /**
     * Creates a copy of this {@link Size}.
     */
    clone(): Size {
        return new Size(this.width, this.height);
    }
}

/**
 * Class that represents a rectangle (with left, top, width, and height).
 */
export class Rect {
    /**
     * Gets or sets the left coordinate of this {@link Rect}.
     */
    left: number;
    /**
     * Gets or sets the top coordinate of this {@link Rect}.
     */
    top: number;
    /**
     * Gets or sets the width of this {@link Rect}.
     */
    width: number;
    /**
     * Gets or sets the height of this {@link Rect}.
     */
    height: number;
    /**
     * Initializes a new instance of the {@link Rect} class.
     *
     * @param left Left coordinate of the new {@link Rect}.
     * @param top Top coordinate of the new {@link Rect}.
     * @param width Width of the new {@link Rect}.
     * @param height Height of the new {@link Rect}.
     */
    constructor(left: number, top: number, width: number, height: number) {
        this.left = asNumber(left);
        this.top = asNumber(top);
        this.width = asNumber(width);
        this.height = asNumber(height);
    }
    /**
     * Gets the right coordinate of this {@link Rect}.
     */
    get right(): number {
        return this.left + this.width;
    }
    /**
     * Gets the bottom coordinate of this {@link Rect}.
     */
    get bottom(): number {
        return this.top + this.height;
    }
    /**
     * Returns true if a {@link Rect} has the same coordinates and dimensions
     * as this {@link Rect}.
     *
     * @param rc {@link Rect} to compare to this {@link Rect}.
     */
    equals(rc: Rect): boolean {
        return (rc instanceof Rect) && this.left == rc.left && this.top == rc.top && this.width == rc.width && this.height == rc.height;
    }
    /**
     * Creates a copy of this {@link Rect}.
     */
    clone(): Rect {
        return new Rect(this.left, this.top, this.width, this.height);
    }
    /**
     * Creates a {@link Rect} from <b>ClientRect</b> or <b>SVGRect</b> objects.
     *
     * @param rc Rectangle obtained by a call to the DOM's <b>getBoundingClientRect</b>
     * or <b>GetBoundingBox</b> methods.
     */
    static fromBoundingRect(rc: any): Rect {
        if (rc.left != null) {
            return new Rect(rc.left, rc.top, rc.width, rc.height);
        } else if (rc.x != null) {
            return new Rect(rc.x, rc.y, rc.width, rc.height);
        } else {
            assert(false, 'Invalid source rectangle.');
        }
    }
    /**
     * Gets a rectangle that represents the union of two rectangles.
     *
     * @param rc1 First rectangle.
     * @param rc2 Second rectangle.
     */
    static union(rc1: Rect, rc2: Rect): Rect {
        let x = Math.min(rc1.left, rc2.left),
            y = Math.min(rc1.top, rc2.top),
            right = Math.max(rc1.right, rc2.right),
            bottom = Math.max(rc1.bottom, rc2.bottom);
        return new Rect(x, y, right - x, bottom - y);
    }
    /**
     * Gets a rectangle that represents the intersection of two rectangles.
     *
     * @param rc1 First rectangle.
     * @param rc2 Second rectangle.
     */
    static intersection(rc1: Rect, rc2: Rect): Rect {
        let x = Math.max(rc1.left, rc2.left),
            y = Math.max(rc1.top, rc2.top),
            right = Math.min(rc1.right, rc2.right),
            bottom = Math.min(rc1.bottom, rc2.bottom);
        return new Rect(x, y, right - x, bottom - y);
    }
    /**
     * Determines whether the rectangle contains a given point or rectangle.
     *
     * @param pt The {@link Point} or {@link Rect} to ckeck.
     */
    contains(pt: any): boolean {
        if (pt instanceof Point) {
            return pt.x >= this.left && pt.x <= this.right &&
                pt.y >= this.top && pt.y <= this.bottom;
        } else if (pt instanceof Rect) {
            let rc2 = pt as Rect;
            return rc2.left >= this.left && rc2.right <= this.right &&
                rc2.top >= this.top && rc2.bottom <= this.bottom;
        } else {
            assert(false, 'Point or Rect expected.');
        }
    }
    /**
     * Creates a rectangle that results from expanding or shrinking a rectangle by the specified amounts.
     *
     * @param dx The amount by which to expand or shrink the left and right sides of the rectangle.
     * @param dy The amount by which to expand or shrink the top and bottom sides of the rectangle.
     */
    inflate(dx: number, dy: number): Rect {
        return new Rect(this.left - dx, this.top - dy, this.width + 2 * dx, this.height + 2 * dy);
    }
}

/**
 * Provides date and time utilities.
 */
export class DateTime {

    /**
     * Gets a new Date that adds the specified number of days to a given Date.
     *
     * @param value Original date.
     * @param days Number of days to add to the given date.
     */
    static addDays(value: Date, days: number): Date {
        value = new Date(value.getTime());
        value.setDate(value.getDate() + days);
        return value;
    }
    /**
     * Gets a new Date that adds the specified number of months to a given Date.
     *
     * @param value Original date.
     * @param months Number of months to add to the given date.
     */
    static addMonths(value: Date, months: number): Date {
        value = new Date(value.getTime());
        var d = value.getDate();
        value.setMonth(value.getMonth() + months);
        if (value.getDate() != d) { // TFS 466776
            value.setDate(0);
        }
        return value;        
    }
    /**
     * Gets a new Date that adds the specified number of years to a given Date.
     *
     * @param value Original date.
     * @param years Number of years to add to the given date.
     */
    static addYears(value: Date, years: number): Date {
        value = new Date(value.getTime());
        value.setFullYear(value.getFullYear() + years);
        return value;
    }
    /**
     * Gets a new Date that adds the specified number of hours to a given Date.
     *
     * @param value Original date.
     * @param hours Number of hours to add to the given date.
     */
    static addHours(value: Date, hours: number): Date {
        value = new Date(value.getTime());
        value.setHours(value.getHours() + hours);
        return value;
    }
    /**
     * Gets a new Date that adds the specified number of minutes to a given Date.
     *
     * @param value Original date.
     * @param minutes Number of minutes to add to the given date.
     */
    static addMinutes(value: Date, minutes: number): Date {
        value = new Date(value.getTime());
        value.setMinutes(value.getMinutes() + minutes);
        return value;
    }
    /**
     * Gets a new Date that adds the specified number of seconds to a given Date.
     *
     * @param value Original date.
     * @param seconds Number of seconds to add to the given date.
     */
    static addSeconds(value: Date, seconds: number): Date {
        value = new Date(value.getTime());
        value.setSeconds(value.getSeconds() + seconds);
        return value;
    }
    /**
     * Gets the first day of the week for a given Date.
     *
     * @param value Original date.
     * @param firstDayOfWeek First day of week (0 for Sunday, 1 for Monday, etc). 
     * Defaults to first day of week for the current culture.
     */
    static weekFirst(value: Date, firstDayOfWeek = Globalize.getFirstDayOfWeek()): Date {
        return DateTime.addDays(value, -(value.getDay() - firstDayOfWeek));
    }
    /**
     * Gets the last day of the week for a given Date.
     *
     * @param value Original date.
     * @param firstDayOfWeek First day of week (0 for Sunday, 1 for Monday, etc). 
     * Defaults to first day of week for the current culture.
     */
    static weekLast(value: Date, firstDayOfWeek = Globalize.getFirstDayOfWeek()): Date {
        value = DateTime.weekFirst(value, firstDayOfWeek);
        return DateTime.addDays(value, 6);
    }
    /**
     * Gets the first day of the month for a given Date.
     *
     * @param value Original date.
     */
    static monthFirst(value: Date): Date {
        return DateTime.addDays(value, -value.getDate() + 1);
    }
    /**
     * Gets the last day of the month for a given Date.
     *
     * @param value Original date.
     */
    static monthLast(value: Date): Date {
        value = DateTime.monthFirst(value);
        value = DateTime.addMonths(value, 1);
        return DateTime.addDays(value, -1);
    }
    /**
     * Gets the first day of the year for a given Date.
     *
     * @param value Original date.
     */
    static yearFirst(value: Date): Date {
        return new Date(value.getFullYear(), 0, 1);
    }
    /**
     * Gets the last day of the year for a given Date.
     *
     * @param value Original date.
     */
    static yearLast(value: Date): Date {
        return new Date(value.getFullYear(), 11, 31);
    }
    /**
     * Returns true if two Date objects refer to the same date (ignoring time).
     *
     * @param d1 First date.
     * @param d2 Second date.
     */
    static sameDate(d1: Date, d2: Date): boolean {
        return isDate(d1) && isDate(d2) &&
            d1.getFullYear() == d2.getFullYear() &&
            d1.getMonth() == d2.getMonth() &&
            d1.getDate() == d2.getDate();
    }
    /**
     * Returns true if two Date objects refer to the same time (ignoring date).
     *
     * @param d1 First date.
     * @param d2 Second date.
     */
    static sameTime(d1: Date, d2: Date): boolean {
        return isDate(d1) && isDate(d2) &&
            d1.getHours() == d2.getHours() &&
            d1.getMinutes() == d2.getMinutes() &&
            d1.getSeconds() == d2.getSeconds() &&
            d1.getMilliseconds() == d2.getMilliseconds();
    }
    /**
     * Returns true if two Date objects refer to the same date and time
     * (or if both are null).
     *
     * @param d1 First date.
     * @param d2 Second date.
     */
    static equals(d1: Date | null, d2: Date | null): boolean {
        return (d1 == null && d2 == null) || // DateTime.equals(null, null) == true
            isDate(d1) && isDate(d2) && d1.getTime() == d2.getTime();
    }
    /**
     * Gets a Date object with the date and time set on two Date objects.
     *
     * @param date Date object that contains the date (day/month/year).
     * @param time Date object that contains the time (hour:minute:second.millisecond).
     */
    static fromDateTime(date: Date, time: Date): Date {
        if (!date && !time) return null;
        if (!date) date = time;
        if (!time) time = date;
        return DateTime.newDate(
            date.getFullYear(), date.getMonth(), date.getDate(),
            time.getHours(), time.getMinutes(), time.getSeconds(),
            time.getMilliseconds());
    }
    /**
     * Converts a calendar date to a fiscal date using the current culture.
     *
     * @param date Calendar date.
     * @param govt Whether to use the government or corporate fiscal year.
     */
    static toFiscal(date: Date, govt: boolean) {
        let cal = culture.Globalize.calendar;
        return isArray(cal.fiscalYearOffsets)
            ? DateTime.addMonths(date, -cal.fiscalYearOffsets[govt ? 0 : 1])
            : date;
    }
    /**
     * Converts a fiscal year date to a calendar date using the current culture.
     *
     * @param date Fiscal year date.
     * @param govt Whether to use the government or corporate fiscal year.
     */
    static fromFiscal(date: Date, govt: boolean) {
        let cal = culture.Globalize.calendar;
        return isArray(cal.fiscalYearOffsets)
            ? DateTime.addMonths(date, +cal.fiscalYearOffsets[govt ? 0 : 1])
            : date;
    }
    /**
     * Gets a new Date object instance.
     *
     * @param year Integer value representing the year, defaults to current year.
     * @param month Integer value representing the month (0-11), defaults to current month.
     * @param day Integer value representing the day (1-31), defaults to current day.
     * @param hour Integer value representing the hour, defaults to zero.
     * @param min Integer value representing the minute, defaults to zero.
     * @param sec Integer value representing the second, defaults to zero.
     * @param ms Integer value representing the millisecond, defaults to zero.
     */
    static newDate(year?: number, month?: number, day?: number, hour?: number, min?: number, sec?: number, ms?: number): Date {

        // get defaults
        if (year == null || month == null || day == null) {
            let today = new Date();
            if (year == null) year = today.getFullYear();
            if (month == null) month = today.getMonth();
            if (day == null) day = today.getDate();
        }
        if (hour == null) hour = 0;
        if (min == null) min = 0;
        if (sec == null) sec = 0;
        if (ms == null) ms = 0;

        // create date
        let dt = new Date(year, month, day, hour, min, sec, ms);

        // fix year adjustment in JavaScript's Date constructor
        let dty = dt.getFullYear();
        if (year < 100 && dty >= 1900) {
            dt.setFullYear(dt.getFullYear() - 1900)
        }

        // return the new date
        return dt;
    }
    /**
     * Creates a copy of a given Date object.
     *
     * @param date Date object to copy.
     */
    static clone(date: Date): Date {
        return DateTime.fromDateTime(date, date);
    }
}

/**
 * Represents a set of options to be used with the {@link httpRequest} method.
 */
export interface IHttpRequestOptions {
    /**
     * The HTTP method to use for the request (e.g. "POST", "GET", "PUT").
     * The default is "GET".
     */
    method?: string;
    /**
     * Data to be sent to the server. It is appended to the url for GET requests,
     * and converted to a JSON string for other requests.
     */
    data?: any;
    /**
     * A JavaScript object containing key/value pairs to be added to the request headers.
     */
    requestHeaders?: any,
    /**
     * By default, all requests are sent asynchronously (i.e. this is set to true by default).
     * If you need to make synchronous requests, set this option to false.
     */
    async?: boolean;
    /**
     * The number of milliseconds the request can take before automatically being terminated.
     * The default value is 0, which means there is no timeout.
     */
    timeout?: number;
    /**
     * Function to be called if the request succeeds.
     * The function has a single parameter of type <b>XMLHttpRequest</b> that represents the request.
     */
    success?: (x: XMLHttpRequest) => void,
    /**
     * Function to be called if the request fails.
     * The function has a single parameter of type <b>XMLHttpRequest</b> that represents the request.
     */
    error?: (x: XMLHttpRequest) => void,
    /**
     * Function to be called when the request finishes (after success and error callbacks are executed).
     * The function has a single parameter of type <b>XMLHttpRequest</b> that represents the request.
     */
    complete?: (x: XMLHttpRequest) => void,
    /**
     * Function to be called immediately before the request is sent.
     * The function has a single parameter of type <b>XMLHttpRequest</b> that represents the request.
     */
    beforeSend?: (x: XMLHttpRequest) => void,
    /**
     * A username to be used with <b>XMLHttpRequest</b> in response to an HTTP access
     * authentication request.
     */
    user?: string,
    /**
     * A password to be used with <b>XMLHttpRequest</b> in response to an HTTP access
     * authentication request.
     */
    password?: string
}

/**
 * Performs HTTP requests.
 *
 * Use the <b>success</b> method to obtain the result of the request which is provided in
 * the callback's <b>XMLHttpRequest</b> parameter. For example, the code below uses
 * the {@link httpRequest} method to retrieve a list of customers from an OData service:
 *
 * ```typescript
 * import { httpRequest } from '@grapecity/wijmo';
 * httpRequest('https://services.odata.org/Northwind/Northwind.svc/Customers?$format=json', {
 *   success: xhr => {
 *     let response = JSON.parse(xhr.responseText),
 *         customers = response.value;
 *     // do something with the customers...
 *   }
 * });
 * ```
 * 
 * @param url String containing the URL to which the request is sent.
 * @param options An optional {@link IHttpRequestOptions} object used to configure the request.
 * @return The <b>XMLHttpRequest</b> object used to perform the request.
 */
export function httpRequest(url: string, options?: IHttpRequestOptions): XMLHttpRequest {
    let o = options || {};

    // select method and basic options
    let method = o.method ? asString(o.method).toUpperCase() : 'GET',
        asynk = o.async != null ? asBoolean(o.async) : true,
        data = o.data;

    // convert data to url parameters for GET requests
    if (data != null && method == 'GET') {
        let s = [];
        for (let k in data) {
            let val = data[k];
            if (isDate(val)) {
                val = val.toJSON();
            }
            //s.push(k + '=' + encodeURI(val)); // TFS 397393
            s.push(k + '=' + encodeURIComponent(val)); // TFS 441284
        }
        if (s.length) {
            let sep = url.indexOf('?') < 0 ? '?' : '&';
            url += sep + s.join('&');
        }
        data = null;
    }

    // create the request
    let xhr = new XMLHttpRequest();
    xhr['URL_DEBUG'] = url; // add some debug info

    // if the data is not a string, stringify it
    let isJson = false;
    if (data != null && !isString(data)) {
        isJson = isObject(data);
        data = JSON.stringify(data);
    }

    // callbacks
    xhr.onload = function () {
        if (xhr.readyState == 4) {
            if (xhr.status < 300) {
                if (o.success) {
                    asFunction(o.success)(xhr);
                }
            } else if (o.error) {
                asFunction(o.error)(xhr);
            }
            if (o.complete) {
                asFunction(o.complete)(xhr);
            }
        }
    };
    xhr.onerror = function () {
        if (isFunction(o.error)) {
            o.error(xhr);
        } else {
            throw 'HttpRequest Error: ' + xhr.status + ' ' + xhr.statusText;
        }
    };

    // send the request
    xhr.open(method, url, asynk, o.user, o.password);
    if (o.user && o.password) {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(o.user + ':' + o.password))
    }
    if (isJson) {
        xhr.setRequestHeader('Content-Type', 'application/json');
    }
    if (o.requestHeaders) {
        for (let key in o.requestHeaders) {
            xhr.setRequestHeader(key, o.requestHeaders[key])
        }
    }
    if (isNumber(o.timeout)) {
        xhr.timeout = o.timeout;
    }
    if (isFunction(o.beforeSend)) {
        o.beforeSend(xhr);
    }
    xhr.send(data);

    // return the request
    return xhr;
}

//// soft module reference management
let _modules = {};
// Register the specified module with the specified name. The name should not
// include scope prefix, i.e. it should be 'core', 'common-input', etc.
export function _registerModule(name: string, ref: any): void {
    _modules[name] = ref;
    // create global ns to support cultures (and Vue)
    if (name === 'wijmo') {
        let glob = typeof (window) !== 'undefined' ? window :
            (typeof (self) !== 'undefined' ? self : null);
        if (glob) {
            glob['wijmo'] = ref;
        }
    }

    // let glob = typeof(window) !== 'undefined' ? window :
    //     (typeof(self) !== 'undefined' ? self : null);
    // if (glob) {
    //     let nsParts = name.split('.'),
    //         parLen = nsParts.length - 1,
    //         cur = glob;
    //     for (let i = 0; i < parLen; i++) {
    //         let curPart = nsParts[i];
    //         cur = cur[curPart] = cur[curPart] || {};
    //     }
    //     cur[nsParts[parLen]] = ref;
    // }
}
// Returns the specified module reference if it was registered before, or an
// undefined value if not yet. The name should not
// include scope prefix, i.e. it should be 'core', 'common-input', etc.
export function _getModule(name: string): any {
    return _modules[name];
}

    }
    


    module wijmo {
    

interface _IMap<K, V> {
    clear(): void;
    //delete(key: K): boolean;
    // it doesn't return boolean like in Map, because in case of POJO hash this will require 
    // additional "has" check with corresponding performance penalties.
    delete(key: K);
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
    readonly size: number;
}

// Represents a safe wrapper for the native Map class. If browser doesn't
// implement Map interface then this class switches to the custom array based
// implementation (_ArrayMap class).
// By default this class uses POJO ({}) as a hash table.
// To force it to use Map, pass false to the pojoHash constructor parameter.
export class _Map<K = any, V = any> {
    // The Map, native or custom implementation
    readonly _m: _IMap<K,V>;
    // POJO {}
    _h: any;

    /**
     * Creates an instance of the Map class wrapper.
     * @param pojoHash If true (default), then POJO hash object is used; otherwise, the Map is used.
     */
    constructor(pojoHash = true) {
        if (pojoHash) {
            this._h = {};
        } else {
            let g = _getGlobal(),
                map = g && g['Map'];
            this._m = map && new Map() || new _ArrayMap();
        }
    }

    get isPojoHash(): boolean {
        return this._h != null;
    }

    get size(): number {
        return this._h && Object.keys(this._h).length || this._m.size;
    }

    clear() {
        if (this._h) {
            this._h = {};
        } else {
            this._m.clear();
        }
    }
    // it doesn't return boolean like in Map, because in case of POJO hash this will require 
    // additional "has" check with corresponding performance penalties.
    delete(key: K) {
        if (this._h) {
            delete this._h[<any>key];
        } else {
            this._m.delete(key);
        }
    }
    get(key: K): V | undefined {
        return this._h ? this._h[<any>key] : this._m.get(key);
    }
    has(key: K): boolean {
        return this._h ? (<any>key in this._h) : this._m.has(key);
    }
    set(key: K, value: V): this {
        if (this._h) {
            this._h[<any>key] = value;
        } else {
            this._m.set(key, value);
        }
        return this;
    }

}

class _ArrayMap<K = any, V = any> implements _IMap<K,V> {
    private _d: {k: K, v: V}[] = [];

    get size(): number {
        return this._d.length;
    }

    clear() {
        this._d = [];
    }
    delete(key: K): boolean {
        let idx = this._kIdx(key);
        if (idx > -1) {
            this._d.splice(idx, 1);
            return true;
        }
        return false;
    }
    get(key: K): V | undefined {
        let idx = this._kIdx(key);
        return idx > -1 ? this._d[idx].v : undefined;
    }
    has(key: K): boolean {
        return this._kIdx(key) > -1;
    }
    set(key: K, value: V): this {
        let idx = this._kIdx(key);
        if (idx > -1) {
            this._d[idx].v = value;
        } else {
            this._d.push({k: key, v: value});
        }
        return this;
    }

    private _kIdx(key: K) {
        let arr = this._d,
            len = arr.length;
        // NOTE: we intentionally duplicate "for loop" implementations here for the performance sake
        if (key === key) { // not NaN
            for (let i = 0; i < len; i++) {
                if (arr[i].k === key) {
                    return i;
                }
            }
        } else { // key is NaN
            for (let i = 0; i < len; i++) {
                let curKey = arr[i].k;
                if (curKey !== curKey) {
                    return i;
                }
            }
        }

        return -1;
    }
}

//TBD: must be in util.ts, shared with another modules?
function _getGlobal(): any {
    let ret = null;
    if (typeof window !== "undefined") {
        ret = window;
    } else if (typeof global !== "undefined") {
        ret = global;
    } else if (typeof self !== "undefined") {
        ret = self;
    };
    return ret;
}
    }
    


    module wijmo {
    

'use strict';

/**
 * Represents a color.
 *
 * The {@link Color} class parses colors specified as CSS strings and exposes
 * their red, green, blue, and alpha channels as read-write properties.
 *
 * The {@link Color} class also provides {@link fromHsb} and {@link fromHsl} methods 
 * for creating colors using the HSB and HSL color models instead of RGB, 
 * as well as {@link getHsb} and {@link getHsl} methods for retrieving the color
 * components using those color models.
 *
 * Finally, the {@link Color} class provides an {@link interpolate} method that 
 * creates colors by interpolating between two colors using the HSL model.
 * This method is especially useful for creating color animations with the
 * {@link animate} method.
 * 
 * The example below shows how this works:
 * 
 * {@sample Core/Color Example}
 */
export class Color {

    // fields
    _r = 0;
    _g = 0;
    _b = 0;
    _a = 1;

    /**
     * Initializes a new {@link Color} from a CSS color specification.
     *
     * @param color CSS color specification.
     */
    constructor(color: string) {
        if (color) {
            this._parse(color);
        }
    }

    /**
     * Gets or sets the red component of this {@link Color},
     * in a range from 0 to 255.
     */
    get r(): number {
        return this._r;
    }
    set r(value: number) {
        this._r = clamp(asNumber(value), 0, 255);
    }
    /**
     * Gets or sets the green component of this {@link Color},
     * in a range from 0 to 255.
     */
    get g(): number {
        return this._g;
    }
    set g(value: number) {
        this._g = clamp(asNumber(value), 0, 255);
    }
    /**
     * Gets or sets the blue component of this {@link Color},
     * in a range from 0 to 255.
     */
    get b(): number {
        return this._b;
    }
    set b(value: number) {
        this._b = clamp(asNumber(value), 0, 255);
    }
    /**
     * Gets or sets the alpha component of this {@link Color},
     * in a range from 0 to 1 (zero is transparent, one is solid).
     */
    get a(): number {
        return this._a;
    }
    set a(value: number) {
        this._a = clamp(asNumber(value), 0, 1);
    }
    /**
     * Returns true if a {@link Color} has the same value as this {@link Color}.
     *
     * @param clr {@link Color} to compare to this {@link Color}.
     */
    equals(clr: Color): boolean {
        return (clr instanceof Color) &&
            this.r == clr.r && this.g == clr.g && this.b == clr.b &&
            this.a == clr.a;
    }
    /**
     * Gets a string representation of this {@link Color}.
     */
    toString(): string {
        let a = Math.round(this.a * 100);
        return a > 99
            ? '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1)
            : 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + (a / 100) +')';
    }
    /**
     * Creates a new {@link Color} using the specified RGBA color channel values.
     *
     * @param r Value for the red channel, from 0 to 255.
     * @param g Value for the green channel, from 0 to 255.
     * @param b Value for the blue channel, from 0 to 255.
     * @param a Value for the alpha channel, from 0 to 1.
     */
    static fromRgba(r: number, g: number, b: number, a = 1): Color {
        let c = new Color(null);
        c.r = Math.round(clamp(asNumber(r), 0, 255));
        c.g = Math.round(clamp(asNumber(g), 0, 255));
        c.b = Math.round(clamp(asNumber(b), 0, 255));
        c.a = clamp(asNumber(a), 0, 1);
        return c;
    }
    /**
     * Creates a new {@link Color} using the specified HSB values.
     *
     * @param h Hue value, from 0 to 1.
     * @param s Saturation value, from 0 to 1.
     * @param b Brightness value, from 0 to 1.
     * @param a Alpha value, from 0 to 1.
     */
    static fromHsb(h: number, s: number, b: number, a = 1): Color {
        let rgb = Color._hsbToRgb(clamp(asNumber(h), 0, 1), clamp(asNumber(s), 0, 1), clamp(asNumber(b), 0, 1));
        return Color.fromRgba(rgb[0], rgb[1], rgb[2], a);
    }
    /**
     * Creates a new {@link Color} using the specified HSL values.
     *
     * @param h Hue value, from 0 to 1.
     * @param s Saturation value, from 0 to 1.
     * @param l Lightness value, from 0 to 1.
     * @param a Alpha value, from 0 to 1.
     */
    static fromHsl(h: number, s: number, l: number, a = 1): Color {
        let rgb = Color._hslToRgb(clamp(asNumber(h), 0, 1), clamp(asNumber(s), 0, 1), clamp(asNumber(l), 0, 1));
        return Color.fromRgba(rgb[0], rgb[1], rgb[2], a);
    }
    /**
     * Creates a new {@link Color} from a CSS color string.
     *
     * @param value String containing a CSS color specification.
     * @return A new {@link Color}, or null if the string cannot be parsed into a color.
     */
    static fromString(value: string): Color {
        let c = new Color(null);
        return c._parse(asString(value)) ? c : null;
    }
    /**
     * Gets an array with this color's HSB components.
     */
    getHsb(): number[] {
        return Color._rgbToHsb(this.r, this.g, this.b)
    }
    /**
     * Gets an array with this color's HSL components.
     */
    getHsl(): number[] {
        return Color._rgbToHsl(this.r, this.g, this.b)
    }
    /**
     * Creates a {@link Color} by interpolating between two colors.
     *
     * @param c1 First color.
     * @param c2 Second color.
     * @param pct Value between zero and one that determines how close the
     * interpolation should be to the second color.
     */
    static interpolate(c1: Color, c2: Color, pct: number): Color {

        // sanity
        pct = clamp(asNumber(pct), 0, 1);

        // convert rgb to hsl
        let h1 = Color._rgbToHsl(c1.r, c1.g, c1.b),
            h2 = Color._rgbToHsl(c2.r, c2.g, c2.b);

        // interpolate
        let qct = 1 - pct,
            alpha = c1.a * qct + c2.a * pct,
            h3 = [
                h1[0] * qct + h2[0] * pct,
                h1[1] * qct + h2[1] * pct,
                h1[2] * qct + h2[2] * pct
            ];

        // convert back to rgb
        let rgb = Color._hslToRgb(h3[0], h3[1], h3[2]);
        return Color.fromRgba(rgb[0], rgb[1], rgb[2], alpha);
    }
    /**
     * Gets the closest opaque color to a given color.
     *
     * @param c {@link Color} to be converted to an opaque color 
     * (the color may also be specified as a string).
     * @param bkg Background color to use when removing the transparency
     * (defaults to white).
     */
    static toOpaque(c: any, bkg?: any): Color {

        // get color
        c = isString(c) ? Color.fromString(c) : asType(c, Color);

        // no alpha? no work
        if (c.a == 1) return c;

        // get background
        bkg = bkg == null ? Color.fromRgba(255, 255, 255, 1) :
                isString(bkg) ? Color.fromString(bkg) :
                <Color>asType(bkg, Color);

        // interpolate in RGB space
        let p = c.a,
            q = 1 - p;
        return Color.fromRgba(c.r * p + bkg.r * q, c.g * p + bkg.g * q, c.b * p + bkg.b * q);
    }

    // ** implementation

    // parses a color string into r/b/g/a
    _parse(c: string): boolean {

        // case-insensitive
        c = c.toLowerCase();

        // 'transparent' is a special case:
        // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
        if (c == 'transparent') {
            this._r = this._g = this._b = this._a = 0;
            return true;
        }

        // let browser parse stuff we don't handle
        if (c && c.indexOf('#') != 0 && c.indexOf('rgb') != 0 && c.indexOf('hsl') != 0) {
            let e = document.createElement('div');
            e.style.color = c;
            let cc = e.style.color;
            if (cc == c) {                                  // same value? 
                cc = window.getComputedStyle(e).color;      // then get computed style
                if (!cc) {                                  // not yet? (Chrome/named colors)
                    document.body.appendChild(e);           // then add element to document
                    cc = window.getComputedStyle(e).color;  // and try again
                    removeChild(e);
                }
            }
            c = cc.toLowerCase();
        }

        // parse #RGB/#RRGGBB
        if (c.indexOf('#') == 0) {
            if (c.length == 4) {
                this.r = parseInt(c[1] + c[1], 16);
                this.g = parseInt(c[2] + c[2], 16);
                this.b = parseInt(c[3] + c[3], 16);
                this.a = 1;
                return true;
            } else if (c.length == 7) {
                this.r = parseInt(c.substr(1, 2), 16);
                this.g = parseInt(c.substr(3, 2), 16);
                this.b = parseInt(c.substr(5, 2), 16);
                this.a = 1;
                return true;
            }
            return false;
        }

        // parse rgb/rgba
        if (c.indexOf('rgb') == 0) {
            let op = c.indexOf('('),
                ep = c.indexOf(')');
            if (op > -1 && ep > -1) {
                let p = c.substr(op + 1, ep - (op + 1)).split(',');
                if (p.length > 2) {
                    this.r = parseInt(p[0]);
                    this.g = parseInt(p[1]);
                    this.b = parseInt(p[2]);
                    this.a = p.length > 3 ? parseFloat(p[3]) : 1;
                    return true;
                }
            }
        }

        // parse hsl/hsla
        if (c.indexOf('hsl') == 0) {
            let op = c.indexOf('('),
                ep = c.indexOf(')');
            if (op > -1 && ep > -1) {
                let p = c.substr(op + 1, ep - (op + 1)).split(',');
                if (p.length > 2) {
                    let h = parseInt(p[0]) / 360,
                        s = parseInt(p[1]),
                        l = parseInt(p[2]);
                    if (p[1].indexOf('%') > -1) s /= 100;
                    if (p[2].indexOf('%') > -1) l /= 100;
                    let rgb = Color._hslToRgb(h, s, l);
                    this.r = rgb[0];
                    this.g = rgb[1];
                    this.b = rgb[2];
                    this.a = p.length > 3 ? parseFloat(p[3]) : 1;
                    return true;
                }
            }
        }

        // failed to parse
        return false;
    }
    /**
     * Converts an HSL color value to RGB.
     *
     * @param h The hue (between zero and one).
     * @param s The saturation (between zero and one).
     * @param l The lightness (between zero and one).
     * @return An array containing the R, G, and B values (between zero and 255).
     */
    static _hslToRgb(h: number, s: number, l: number): number[] {
        assert(h >= 0 && h <= 1 && s >= 0 && s <= 1 && l >= 0 && l <= 1, 'bad HSL values');
        let r: number,
            g: number,
            b: number;
        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = Color._hue2rgb(p, q, h + 1 / 3);
            g = Color._hue2rgb(p, q, h);
            b = Color._hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    static _hue2rgb(p: number, q: number, t: number): number {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    /**
     * Converts an RGB color value to HSL.
     *
     * @param r The value of the red channel (between zero and 255).
     * @param g The value of the green channel (between zero and 255).
     * @param b The value of the blue channel (between zero and 255).
     * @return An array containing the H, S, and L values (between zero and one).
     */
    static _rgbToHsl(r: number, g: number, b: number): number[] {
        assert(r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255, 'bad RGB values');
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, l];
    }
    /**
     * Converts an RGB color value to HSB.
     *
     * @param r The value of the red channel (between zero and 255).
     * @param g The value of the green channel (between zero and 255).
     * @param b The value of the blue channel (between zero and 255).
     * @return An array containing the H, S, and B values (between zero and one).
     */
    static _rgbToHsb(r: number, g: number, b: number): number[]{
        assert(r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255, 'bad RGB values');
        let hsl = Color._rgbToHsl(r, g, b);
        return Color._hslToHsb(hsl[0], hsl[1], hsl[2]);
    }
    /**
     * Converts an HSB color value to RGB.
     *
     * @param h The hue (between zero and one).
     * @param s The saturation (between zero and one).
     * @param b The brightness (between zero and one).
     * @return An array containing the R, G, and B values (between zero and 255).
     */
    static _hsbToRgb(h: number, s: number, b: number): number[] {
        //assert(h >= 0 && h <= 1 && s >= 0 && s <= 1 && b >= 0 && b <= 1, 'bad HSB values');
        let hsl = Color._hsbToHsl(h, s, b);
        return Color._hslToRgb(hsl[0], hsl[1], hsl[2]);
    }
    /**
     * Converts an HSB color value to HSL.
     *
     * @param h The hue (between zero and one).
     * @param s The saturation (between zero and one).
     * @param b The brightness (between zero and one).
     * @return An array containing the H, S, and L values (between zero and one).
     */
    static _hsbToHsl(h: number, s: number, b: number): number[]{
        assert(h >= 0 && h <= 1 && s >= 0 && s <= 1 && b >= 0 && b <= 1, 'bad HSB values');
        let ll = clamp(b * (2 - s) / 2, 0, 1),
            div = 1 - Math.abs(2 * ll - 1),
            ss = clamp(div > 0 ? b * s / div : s/*0*/, 0, 1);
        assert(!isNaN(ll) && !isNaN(ss), 'bad conversion to HSL');
        return [h, ss, ll];
    }
    /**
     * Converts an HSL color value to HSB.
     *
     * @param h The hue (between zero and one).
     * @param s The saturation (between zero and one).
     * @param l The lightness (between zero and one).
     * @return An array containing the H, S, and B values (between zero and one).
     */
    static _hslToHsb(h: number, s: number, l: number): number[] {
        assert(h >= 0 && h <= 1 && s >= 0 && s <= 1 && l >= 0 && l <= 1, 'bad HSL values');
        let bb = clamp(l == 1 ? 1 : (2 * l + s * (1 - Math.abs(2 * l - 1))) / 2, 0, 1),
            ss = clamp(bb > 0 ? 2 * (bb - l) / bb : s/*0*/, 0, 1);
        assert(!isNaN(bb) && !isNaN(ss), 'bad conversion to HSB');
        return [h, ss, bb];
    }
}


    }
    


    module wijmo {
    

'use strict';

/**
 * Contains information used to format numbers
 */
interface _INumFormatInfo {
    /** String to display before the formatted value */
    prefix: string;
    /** Format specifier (N, n, D, d, C, c, P, p, X, x, etc) */
    specRaw: string;
    /** Format specifier as lower-case (n, d, c, p, x, etc) */
    spec: string;
    /** Precision (number of decimal places to display) */
    prec: number;
    /** Scale (3 for thousands, 6 for millions, etc) */
    scale: number;
    /** String to display after the formatted value */
    suffix: string;
    /** Currency sign */
    curr: string;
}

/**
 * Gets or sets an object that contains all localizable strings in the Wijmo library.
 *
 * The culture selector is a two-letter string that represents an 
 * <a href='https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes'>ISO 639 culture</a>.
 */
export var culture: any = (typeof window !== 'undefined' && window['wijmo'] && window['wijmo'].culture) || {
    Globalize: {
        numberFormat: {
            '.': '.',
            ',': ',',
            '-': '-',
            '+': '+',
            '%': '%',
            percent: { pattern: ['-n%', 'n%'] },
            currency: { decimals: 2, symbol: '$', pattern: ['($n)', '$n'] }
        },
        calendar: {
            '/': '/',
            ':': ':',
            firstDay: 0,
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            daysAbbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthsAbbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            am: ['AM', 'A'],
            pm: ['PM', 'P'],
            eras: ['A.D.', 'B.C.'],
            patterns: {
                d: 'M/d/yyyy', D: 'dddd, MMMM dd, yyyy',
                f: 'dddd, MMMM dd, yyyy h:mm tt', F: 'dddd, MMMM dd, yyyy h:mm:ss tt',
                t: 'h:mm tt', T: 'h:mm:ss tt',
                M: 'MMMM d', m: 'MMMM d',
                Y: 'MMMM, yyyy', y: 'MMMM, yyyy',
                g: 'M/d/yyyy h:mm tt', G: 'M/d/yyyy h:mm:ss tt',
                s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss',
                o: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss"."fffffffK',
                O: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss"."fffffffK',
                U: 'dddd, MMMM dd, yyyy h:mm:ss tt'
            },
            fiscalYearOffsets: [-3, -3]
        }
    }
};

/**
 * Class that implements formatting and parsing of numbers and Dates.
 *
 * By default, {@link Globalize} uses the American English culture.
 * To switch cultures, include the appropriate **wijmo.culture**
 * file after the wijmo files.
 * 
 * The example below shows how you can use the {@link Globalize} class
 * to format dates, times, and numbers in different cultures:
 * 
 * {@sample Core/Globalization/Formatting Example}
 */
export class Globalize {

    /**
     * Formats a number or a date.
     *
     * The format strings used with the {@link format} function are similar to 
     * the ones used by the .NET Globalization library.
     * The tables below contains links that describe the formats available:
     *
     * <ul>
     * <li><a href="https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-numeric-format-strings">
     *      Standard Numeric Format Strings</a></li>
     * <li><a href="https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings">
     *      Standard Date and Time Format Strings</a></li>
     * <li><a href="https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings">
     *      Custom Date and Time Format Strings</a></li>
     * </ul>
     *
     * @param value Number or Date to format (all other types are converted to strings).
     * @param format Format string to use when formatting numbers or dates.
     * @param trim Whether to remove trailing zeros from numeric results.
     * @param truncate Whether to truncate the numeric values rather than round them.
     * @param defaultPrec Precision to use if not specified in the format string.
     * @return A string representation of the given value.
     */
    static format(value: any, format: string, trim?: boolean, truncate?: boolean, defaultPrec?: number): string {

        // format numbers and dates, convert others to string
        if (isString(value)) {
            return value;
        } else if (isNumber(value)) {
            format = format || (value == Math.round(value) ? 'n0' : 'n2');
            return Globalize.formatNumber(value, format, trim, truncate, defaultPrec);
        } else if (isDate(value)) {
            format = format || 'd';
            return Globalize.formatDate(value, format);
        } else {
            return value != null ? value.toString() : '';
        }
    }
    /**
     * Formats a number using the current culture.
     *
     * The {@link formatNumber} method accepts all .NET-style 
     * <a href="https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-numeric-format-strings">
     * Standard Numeric Format Strings</a> and provides support
     * for scaling, prefixes, suffixes, and custom currency symbols.
     *
     * Numeric format strings take the form <i>Axxsscc</i>, where:
     * <ul>
     * <li>
     *  <i>A</i> is a single alphabetic character called the format 
     *  specifier (described below).</li>
     * <li>
     *  <i>xx</i> is an optional integer called the precision specifier. 
     *  The precision specifier affects the number of digits in the result.</li>
     * <li>
     *  <i>ss</i> is an optional string used to scale the number. If provided,
     *  it must consist of commas. The number is divided by 1000 for each comma
     *  specified.</li>
     * <li>
     *  <i>cc</i> is an optional string used to override the currency symbol 
     *  when formatting currency values. This is useful when formatting 
     *  currency values for cultures different than the current default 
     *  (for example, when formatting Euro or Yen values in applications
     *  that use the English culture).</li>
     * </ul>
     *
     * The following table describes the standard numeric format specifiers and 
     * displays sample output produced by each format specifier for the default
     * culture.
     *
     * <b>c</b> Currency: <code>formatNumber(1234, 'c') => '$1,234.00'</code><br/>
     * <b>d</b> Decimal (integers): <code>formatNumber(-1234, 'd6') => '-001234'</code><br/>
     * <b>e</b> Scientific Notation (lower-case 'e'): <code>formatNumber(123.456, 'e6') => '1.234560e+2'</code>
     * <b>E</b> Scientific Notation (upper-case 'e'): <code>formatNumber(123.456, 'E6') => '1.234560E+2'</code>
     * <b>f</b> Fixed-point: <code>formatNumber(1234.5, 'f2') => '1234.50'</code><br/>
     * <b>F</b> Fixed-point (with thousand separators): <code>formatNumber(1234.5, 'F2') => '1,234.50'</code><br/>
     * <b>g</b> General (no trailing zeros): <code>formatNumber(1234.50, 'g2') => '1234.5'</code><br/>
     * <b>G</b> General (no trailing zeros, thousand separators): <code>formatNumber(1234.5, 'G2') => '1,234.5'</code><br/>
     * <b>n</b> Number: <code>formatNumber(1234.5, 'n2') => '1,234.50'</code><br/>
     * <b>p</b> Percent: <code>formatNumber(0.1234, 'p2') => '12.34%'</code>
     * <b>P</b> Percent (no thousand separators): <code>formatNumber(12.34, 'P2') => '1234%'</code>
     * <b>r</b> Round-trip (same as g15): <code>formatNumber(0.1234, 'r') => '0.1234'</code>
     * <b>x</b> Hexadecimal (integers): <code>formatNumber(1234, 'x6') => '0004d2'</code><br/>
     *
     * The scaling specifier is especially useful when charting large values. For 
     * example, the markup below creates a chart that plots population versus GDP.
     * The raw data expresses the population is units and the GDP in millions.
     * The scaling specified in the axes formats causes the chart to show population
     * in millions and GDP in trillions:
     *
     * ```typescript
     * import { FlexChart} from '@grapecity/wijmo.chart';
     * new FlexChart('#theChart', {
     *     itemsSource: countriesGDP,
     *     bindingX: 'pop',
     *     chartType: 'Scatter',
     *     series: [
     *         { name: 'GDP', binding: 'gdp' }
     *     ],
     *     axisX: {
     *         title: 'Population (millions)'
     *         format: 'n0,,'
     *     },
     *     axisY: {
     *         title: 'GDP (US$ trillions)'
     *         format: 'c0,,'
     *     }
     * });
     * ```
     * 
     * The format string may also include constant prefix and suffix
     * strings to be added to the output. 
     * If present, the prefix and suffix are specified as *double-quoted*
     * strings at the start and end of the format string:
     * 
     * ```typescript
     * import { Globalize } from '@grapecity/wijmo';
     * console.log(Globalize.formatNumber(value, '"thousands: "c3," k"'));
     * console.log(Globalize.formatNumber(value, '"millions: "c1,," M"'));
     * ```
     * 
     * @param value Number to format.
     * @param format .NET-style standard numeric format string (e.g. 'n2', 'c4', 'p0', 'g2', 'd2').
     * @param trim Whether to remove trailing zeros from the result.
     * @param truncate Whether to truncate the value rather than round it.
     * @param defaultPrec Precision to use if not specified in the format string.
     * @return A string representation of the given number.
     */
    static formatNumber(value: number, format: string, trim?: boolean, truncate?: boolean, defaultPrec?: number): string {
        value = asNumber(value);
        format = asString(format);
        let nf = culture.Globalize.numberFormat,
            info = Globalize._parseNumericFormat(format),
            spec = info.spec,
            prec = info.prec,
            dp = nf['.'] || '.',
            ts = nf[','] || ',',
            neg = nf['-'] || '-',
            result: string,
            math = Math;

        // handle default precision
        if (prec == null) {
            prec = defaultPrec != null ? defaultPrec
                : spec == 'c' ? nf.currency.decimals
                : spec == 'e' ? 6
                : spec == 'r' ? 15
                : value == math.round(value) ? 0 : 2
        }

        // scale (,:thousands ,,:millions ,,,:billions)
        if (info.scale) {
            value /= math.pow(10, info.scale);
        }

        // d, x: integers/hexadecimal
        if (spec == 'd' || spec == 'x') {
            // honour 'truncate' for 'd'/'x' formats too (WJM-19675)
            let fRound = truncate ? math.floor : math.round;
            result = fRound(math.abs(value)).toString(spec == 'd' ? 10 : 16);
            while (result.length < prec) {
                result = '0' + result;
            }
            if (value < 0) {
                result = neg + result;
            }
            return info.specRaw == 'X'
                ? result.toUpperCase()
                : result;
        }

        // p: percentage
        if (spec == 'p') {
            value = Globalize._shiftDecimal(value, 2); // TFS 210383
            value = toFixed(value, prec, truncate); // TFS 227998
        }

        // truncate value
        if (truncate && spec != 'p' && spec != 'e') {
            value = toFixed(value, prec, true);
        }

        // get the result
        switch (spec) {
            case 'e': // scientific notation
                result = value.toExponential(prec);
                if (info.specRaw == 'E') {
                    result = result.replace('e', 'E');
                }
                break;
            case 'c': // absolute value (and currency pattern)
            case 'p': // absolute value (and percentage pattern)
                result = Globalize._toFixedStr(math.abs(value), prec);
                break;
            default: // everything else
                result = Globalize._toFixedStr(value, prec);
                if (result[0] == '-' && !result.match(/[1-9]/)) { // no -0, -0.00, etc
                    result = result.substr(1);
                }
                break;
        }

        // g, r: remove trailing zeros
        if ((trim || spec == 'g' || spec == 'r') && result.indexOf('.') > -1) {
            result = result
                .replace(/(\.\d*?)0+$/g, '$1')
                .replace(/\.$/, '');
        }

        // replace decimal point
        if (dp != '.') {
            result = result.replace('.', dp);
        }

        // replace negative character
        if (neg != '-') {
            result = result.replace('-', neg);
        }

        // n/N, c/C, p, F, G: insert thousand separators (before decimal/neg replacements)
        if (ts) {
            if (spec == 'n' || spec == 'c' || info.specRaw == 'p' || info.specRaw == 'F' || info.specRaw == 'G') {
                let idx = result.indexOf(dp),
                    rx = /\B(?=(\d\d\d)+(?!\d))/g;
                result = idx > -1
                    ? result.substr(0, idx).replace(rx, ts) + result.substr(idx)
                    : result.replace(rx, ts);
            }
        }

        // apply currency pattern
        if (spec == 'c') {
            let patIndex = value < 0 && result.match(/[1-9]/) ? 0 : 1, // no ($0), ($0.00), etc
                pat = nf.currency.pattern[patIndex],
                curr = info.curr || nf.currency.symbol;
            if (curr == '\u200B') { // invisible space: TFS 295426
                curr = '';
            }
            result = pat.replace('n', result).replace('$', curr);
        }

        // apply percentage pattern
        if (spec == 'p') {
            let patIndex = value < 0 && result.match(/[1-9]/) ? 0 : 1, // no -0%, -0.00%, etc
                pat = nf.percent.pattern[patIndex],
                pct = nf['%'] || '%';
            result = pat.replace('n', result);
            if (pct != '%') {
                result = result.replace('%', pct);
            }
            if (neg != '-' && patIndex == 0) {
                result = result.replace('-', neg);
            }
        }

        // done
        return info.prefix || info.suffix
            ? info.prefix + result + info.suffix
            : result;
    }
    /**
     * Formats a date using the current culture.
     *
     * The {@link format} parameter contains a .NET-style 
     * <a href="https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings">Date format string</a>
     * with the following additions:
     * <ul>
     *  <li><i>Q, q</i> Calendar quarter.</li>
     *  <li><i>U</i> Fiscal quarter (government).</li>
     *  <li><i>u</i> Fiscal quarter (private sector).</li>
     *  <li><i>EEEE, EEE, EE, E</i> Fiscal year (government).</li>
     *  <li><i>eeee, eee, ee, e</i> Fiscal year (private sector).</li>
     * </ul>
     *
     * For example:
     *
     * ```typescript
     * import { Globalize } from '@grapecity/wijmo';
     * let dt = new Date(2015, 9, 1); // Oct 1, 2015
     * console.log('result', Globalize.format(dt, '"FY"EEEE"Q"U') + ' (US culture)');
     * **result** FY2016Q1 (US culture)
     * ```
     * 
     * Another addition is available for dealing with complex eras such 
     * as those defined in the Japanese culture:
     * 
     * <ul>
     *  <li><i>ggg</i> Era name (e.g. '平成', '昭和', '大正', or '明治').</li>
     *  <li><i>gg</i> Era initial (e.g. '平', '昭', '大', or '明').</li>
     *  <li><i>g</i> Era symbol (e.g. 'H', 'S', 'T', or 'M').</li>
     * </ul>
     *
     * {@sample Core/Globalization/Formatting/purejs Example}
     *
     * @param value Number or Date to format.
     * @param format .NET-style Date format string.
     * @return A string representation of the given date.
     */
    static formatDate(value: Date, format: string): string {
        value = asDate(value);

        // culture-invariant formats
        switch (format) {
            case 'r':
            case 'R':
                return value.toUTCString();
            case 'u':
                return value.toISOString().replace(/\.\d{3}/, '');
        }

        // expand pre-defined formats
        format = Globalize._expandFormat(format);

        // parse the format string and build return value
        let parts = Globalize._parseDateFormat(format),
            formatted = parts.map(part => Globalize._formatDatePart(value, format, part)),
            str = formatted.join('');

        // all done
        return str;
    }
    /**
     * Parses a string into an integer.
     *
     * @param value String to convert to an integer.
     * @param format Format to use when parsing the number.
     * @return The integer represented by the given string, 
     * or **NaN** if the string cannot be parsed into an integer.
     */
    static parseInt(value: string, format?: string): number {
        return Math.round(Globalize.parseFloat(value, format));
    }
    /**
     * Parses a string into a floating point number.
     *
     * @param value String to convert to a number.
     * @param format Format to use when parsing the number.
     * @return The floating point number represented by the given string, 
     * or **NaN** if the string cannot be parsed into a floating point number.
     */
    static parseFloat(value: string, format?: string): number {

        // remove prefix/suffix
        let info = Globalize._parseNumericFormat(format);
        let prefix = info.prefix;
        if (prefix && value.indexOf(prefix) == 0) {
            value = value.substring(prefix.length);
        }
        let suffix = info.suffix;
        if (suffix) {
            let index = value.lastIndexOf(suffix);
            if (index > -1 && index == value.length - suffix.length) {
                value = value.substring(0, value.length - suffix.length);
            }
        }

        // get constants
        let nf = culture.Globalize.numberFormat,
            dp = nf['.'] || '.',
            ts = nf[','] || ',',
            neg = nf['-'] || '-',
            pct = nf['%'] || '%',
            curr = info.curr || nf.currency.symbol || '$',
            isPct = value.indexOf(pct) > -1,
            isNeg = value.indexOf('(') > -1 && value.indexOf(')') > -1,
            val = 0;

        // parse value
        if (info.spec == 'x') {
            val = parseInt(value, 16);
        } else {

            // remove *one instance* of currency/percentage/parentheses
            [curr, pct, '(', ')'].forEach(symbol => {
                value = value.replace(symbol, '');
            });

            // if the thousand separator is some kind of whitespace, remove all whitespace 
            // our culture files use char(160) instead of regular spaces (char(32)) (TFS 460513).
            if (/\s/.test(ts)) {
                value = value.replace(/\s+/g, '');
            }

            // remove thousand separators, spaces after +/-, unlocalize minus and decimal point
            value = value
                .replace(new RegExp('\\' + ts, 'g'), '') // no thousands
                .replace(new RegExp('\\' + neg, 'g'), '-') // regular minus (possibly more than one: -10e-5)
                .replace(/(\+|\-)\s+/g, '$1') // parseFloat doesn't like '- 123'
                .replace(dp, '.')
                .trim();

            // handle trailing negative signs (valid in some currency/percentage patterns)
            let len = value.length;
            if (!isNeg && len && value[len - 1] == '-') {
                isNeg = true;
                value = value.substring(0, len - 1);
            }
            
            // check the value and parse
            // ws + sign? + digits + (. digits)? + (ws e sign? digits)? + ws
            val = /^\s*(\+|\-)?\d*(\.\d*)?(\s*E(\+|\-)?\d+)?\s*$/i.test(value)
                ? parseFloat(value)
                : Number.NaN;
        }

        // apply sign, percentage, parenthesized sign, scale
        if (!isNaN(val)) {

            // handle sign (TFS 457652)
            isNeg = isNeg || val < 0;
            val = Math.abs(val);

            if (isPct) {
                val = Globalize._shiftDecimal(val, -2);
            }
            if (isNeg) {
                val = -val;
            }
            if (info.scale) {
                val *= Math.pow(10, info.scale);
            }
        }

        // done
        return val;
    }
    /**
     * Parses a string into a Date.
     *
     * Two-digit years are converted to full years based on the value of the
     * calendar's **twoDigitYearMax** property. By default, this is set to
     * 2029, meaning two-digit values of 30 to 99 are parsed as 19xx, and values
     * from zero to 29 are parsed as 20xx.
     *
     * You can change this threshold by assigning a new value to the calendar.
     * For example:
     *
     * <pre>// get calendar
     * var cal = wijmo.culture.Globalize.calendar;
     *
     * // default threshold is 2029, so "30" is parsed as 1930
     * cal.twoDigitYearMax = 2029;
     * var d1 = wijmo.Globalize.parseDate('30/12', 'yy/MM'); // dec 1930
     *
     * // changing threshold to 2100, so all values are parsed as 20**
     * cal.twoDigitYearMax = 2100;
     * var d2 = wijmo.Globalize.parseDate('30/12', 'yy/MM'); // dec 2030</pre>
     *
     * @param value String to convert to a Date.
     * @param format Format string used to parse the date.
     * @param refDate Date to use as a reference in case date or time
     * parts are not specified in the format string (e.g. format = 'MM/dd').
     * @return The Date object represented by the given string, or null 
     * if the string cannot be parsed into a Date.
     */
    static parseDate(value: string, format: string, refDate?: Date): Date {

        // make sure we have a value
        value = asString(value);
        if (!value) {
            return null;
        }

        // culture-invariant formats
        if (format == 'u') {
            return new Date(value);
        }

        // return value
        let date: Date;

        // parse using RFC 3339 pattern ([yyyy-MM-dd] [hh:mm[:ss]])
        if (format == 'R' || format == 'r') {
            let rx = /((\d+)\-(\d+)\-(\d+))?\s?((\d+):(\d+)(:(\d+))?)?/,
                match = value.match(rx);
            if (match[1] || match[5]) {
                date = match[1] // parse date
                    ? new Date(parseInt(match[2]), parseInt(match[3]) - 1, parseInt(match[4]))
                    : new Date();
                if (match[5]) { // parse time
                    date.setHours(parseInt(match[6]));
                    date.setMinutes(parseInt(match[7]));
                    date.setSeconds(match[8] ? parseInt(match[9]) : 0);
                }
            } else {
                date = new Date(value);
            }
            return !isNaN(date.getTime()) ? date : null;
        }

        // expand the format
        format = Globalize._expandFormat(format ? format : 'd');

        // get format and data parts
        //
        // cjk: chars, http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
        // rxf: format (no dots in strings: 'mm.dd.yyyy' => ['mm', 'dd', 'yyyy']).
        // rxv: value (dots OK in strings: 'A.D' => 'A.D', but not by themselves)
        let cal = culture.Globalize.calendar,
            cjk = Globalize._CJK,
            rxv = new RegExp(
                '(\\' + cal['/'] + ')|(\\' + cal[':'] + ')|' + // date/time separators
                '(\\d+)|' + // digits
                '([' + cjk + '\\.]{2,})|' + // strings with dots
                '([' + cjk + ']+)', // strings with no dots
                'gi'),
            vparts = value.match(rxv),
            fparts = Globalize._parseDateFormat(format),
            offset = 0;
        
        // basic validation (TFS 81465, 128359)
        if (!vparts || !vparts.length || !fparts || !fparts.length) {
            return null;
        }

        // initialize date/time part values
        let year = -1, month = 0, day = 1, hour = 0, min = 0, sec = 0, ms = 0, tzm = 0, qtr = -1, era = null,
            hasDayName: boolean, hasDay: boolean, hasMonth: boolean, hasFullYear: boolean, fiscalFmt: string;

        // use refDate to get default values for all parts except year (TFS 464865)
        refDate = asDate(refDate, true);
        if (refDate) {
            //year = refDate.getFullYear();
            month = refDate.getMonth();
            day = refDate.getDate();
            hour = refDate.getHours();
            min = refDate.getMinutes();
            sec = refDate.getSeconds();
            ms = refDate.getMilliseconds();
        }

        // parse each date/time part
        for (let i = 0; i < fparts.length && vparts; i++) {
            let vpi = i - offset,
                pval = (vpi > -1 && vpi < vparts.length) ? vparts[vpi] : '',
                plen = fparts[i].length;
            switch (fparts[i]) {

                // ** year
                case 'EEEE': case 'EEE': case 'EE': case 'E': // fiscal (govt)
                case 'eeee': case 'eee': case 'ee': case 'e': // fiscal (corp)
                    fiscalFmt = fparts[i];
                // ** fall through **
                case 'yyyy': case 'yyy': case 'yy': case 'y': // calendar
                    if (plen > 1 && pval.length > plen) {
                        vparts[vpi] = pval.substr(plen);
                        pval = pval.substr(0, plen);
                        offset++;
                    }
                    year = parseInt(pval);
                    hasFullYear = pval.length == 4; // TFS 279266
                    break;

                // ** month
                case 'MMMM': case 'MMM':
                    hasMonth = true;
                    month = -1;
                    let monthName = pval.toLowerCase(),
                        monthNames = (fparts[i] == 'MMMM') ? cal.months : cal.monthsAbbr; // WJM-19429
                    for (let j = 0; j < 12; j++) {
                        if (monthNames[j].toLowerCase().indexOf(monthName) == 0) {
                            month = j;
                            break;
                        }
                    }
                    if (month > -1) {
                        break;
                    }
                // FALL THROUGH: 
                // and try parsing month as a number
                // so users can type "1/2" instead of "1/February"
                case 'MM': case 'M':
                    hasMonth = true;
                    if (plen > 1 && pval.length > plen) {
                        vparts[vpi] = pval.substr(plen);
                        pval = pval.substr(0, plen);
                        offset++;
                    }
                    month = parseInt(pval) - 1;
                    break;

                // ** day
                case 'dddd':
                case 'ddd':
                    hasDayName = true;
                    break; // skip day names
                case 'dd': case 'd':
                    if (plen > 1 && pval.length > plen) {
                        vparts[vpi] = pval.substr(plen);
                        pval = pval.substr(0, plen);
                        offset++;
                    }
                    day = parseInt(pval);
                    hasDay = true;
                    break;

                // ** hour
                case 'hh': case 'h':
                    if (plen > 1 && pval.length > plen) {
                        vparts[vpi] = pval.substr(plen);
                        pval = pval.substr(0, plen);
                        offset++;
                    }
                    hour = parseInt(pval);
                    hour = hour == 12 ? 0 : hour; // 0-12, 12 == midnight
                    break;
                case 'HH':
                    if (plen > 1 && pval.length > plen) {
                        vparts[vpi] = pval.substr(plen);
                        pval = pval.substr(0, plen);
                        offset++;
                    }
                    hour = parseInt(pval); // 0-24
                    break;
                case 'H':
                    hour = parseInt(pval); // 0-24
                    break;

                // ** minute
                case 'mm': case 'm':
                    if (plen > 1 && pval.length > plen) {
                        vparts[vpi] = pval.substr(plen);
                        pval = pval.substr(0, plen);
                        offset++;
                    }
                    min = parseInt(pval);
                    break;

                // ** second
                case 'ss': case 's':
                    if (plen > 1 && pval.length > plen) {
                        vparts[vpi] = pval.substr(plen);
                        pval = pval.substr(0, plen);
                        offset++;
                    }
                    sec = parseInt(pval);
                    break;

                // ** millisecond
                case 'fffffff': case 'FFFFFFF':
                case 'ffffff': case 'FFFFFF':
                case 'fffff': case 'FFFFF':
                case 'ffff': case 'FFFF':
                case 'fff': case 'FFF':
                case 'ff': case 'FF':
                case 'f': case 'F':
                    ms = parseInt(pval) / Math.pow(10, plen - 3);
                    break;

                // ** am/pm
                case 'tt': case 't':
                    pval = pval.toUpperCase();
                    if (hour < 12 && cal.pm.indexOf(pval) > -1) {
                        hour += 12;
                    }
                    break;

                // ** quarter
                case 'q': case 'Q': case 'u': case 'U':
                    qtr = parseInt(pval);
                    break;

                // ** era
                case 'ggg': case 'gg': case 'g':
                    era = cal.eras.length > 1 ? Globalize._getEra(pval, cal) : null;
                    if (cal.eras.length > 0 && !era) { // invalid era? fail
                        return null;
                    }
                    break;

                // ** localizable separators (TFS 131320, 339426)
                case '/':
                case ':':
                    if (pval && pval != cal[fparts[i]]) {
                        return null; // present but wrong separator
                    }
                    break;

                // ** localized separators
                case cal['/']:
                case cal[':']:
                    if (pval && pval != fparts[i]) {
                        return null; // present but wrong separator
                    }
                    break;

                // ** time zone (skip )
                case 'K':
                    break;

                // ** all else: if not a match, keep using the same pval
                default:
                    if (Globalize._unquote(fparts[i]).trim() != pval.trim()) {
                        offset++;
                    }
                    break;
            }
        }

        // allow dates with no times even if the format requires times
        if (hasMonth && hasDay) {
            if (isNaN(hour)) hour = 0;
            if (isNaN(min)) min = 0;
            if (isNaN(sec)) sec = 0;
        }

        // basic validation
        if (month < 0 || month > 11 || isNaN(month) ||
            day < 1 || day > 31 || isNaN(day) ||
            hour < 0 || hour >= 24 || isNaN(hour) || // TFS 431557: >= 24 instead of > 24
            min < 0 || min >= 60 || isNaN(min) || // TFS 431557: >= 60 instead of > 60
            sec < 0 || sec >= 60 || isNaN(sec)) {
            return null;
        }

        // check that all the input was used (vparts.length should be <= fparts.length)
        // some fparts can be missing (and get default values), but all vparts should be used.
        // e.g. '2020/10/2a' should fail (TFS 467774)
        if (vparts.length + offset > fparts.length) {
            return null;
        }

        // convert fiscal year to calendar year
        if (fiscalFmt) {
            if (!hasMonth) { // need year and month to convert fiscal to calendar
                return null;
            }
            let cal = culture.Globalize.calendar;
            if (isArray(cal.fiscalYearOffsets)) {
                let govt = fiscalFmt[0] == 'E',
                    fiscalMonth = month - cal.fiscalYearOffsets[govt ? 0 : 1];
                year += (fiscalMonth > 11) ? -1 : (fiscalMonth < 0) ? +1 : 0;
            }
        }

        // if the day name was specified but the day wasn't, the result is meaningless
        if (hasDayName && !hasDay) {
            return null;
        }

        // if the month was not specified but the quarter was, honor quarter (TFS 400030)
        if (!hasMonth && qtr >= 1 && qtr <= 4) {
            month = (qtr - 1) * 3;
        }

        // if the year was not specified, use the reference date or the current year
        if (isNaN(year) || year < 0) {
            year = refDate ? refDate.getFullYear() : new Date().getFullYear();
        } else { // TFS 339403, 279266

            // if the year was specified, apply era offset or
            // adjust for two-digit years (see Calendar.TwoDigitYearMax)
            if (era && era.start) {
                year = year + era.start.getFullYear() - 1;
            } else if (year < 100 && !hasFullYear) {
                let max = isNumber(cal.twoDigitYearMax) ? cal.twoDigitYearMax : 2029;
                if (max > 99) {
                    year += (year + 2000 <= max) ? 2000 : 1900; // TFS 330699
                }
            }
        }

        // create the date
        date = DateTime.newDate(year, month, day, hour, min + tzm, sec, ms);

        // make sure day is valid for the current month (TFS 310036)
        if (date.getMonth() != month || date.getDate() != day) {
            return null;
        }

        // return result
        return isNaN(date.getTime()) ? null : date;
    }

    // Chinese/Japanese/Korean characters
    // http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
    // http://www.programminginkorean.com/programming/hangul-in-unicode/
    // NOTE: using 'replace' to keep minifier from switching the escaped Unicode chars into real Unicode.
    // NOTE: will have to expand for other cultures? (Arabic/Hebrew/Hindi etc?)
    static _CJK = 'a-z' +
        'u00c0-u017fu3000-u30ffu4e00-u9faf'.replace(/u/g, '\\u') + // cj
        'u1100-u11ffu3130-u318fua960-ua97fuac00-ud7afud7b0-ud7ff'.replace(/u/g, '\\u'); // k

    /**
     * Gets the first day of the week according to the current culture.
     *
     * The value returned is between zero (Sunday) and six (Saturday).
     */
    static getFirstDayOfWeek(): number {
        let fdw = culture.Globalize.calendar.firstDay;
        return fdw ? fdw : 0;
    }
    /**
     * Gets the symbol used as a decimal separator in numbers.
     */
    static getNumberDecimalSeparator(): string {
        let ndc = culture.Globalize.numberFormat['.'];
        return ndc ? ndc : '.';
    }

    // ** implementation

    // similar to JavaScript's toFixed, but 
    // 1) smarter about appending zeros when that's all that's needed (TFS 286926), and
    // 2) round numbers correctly and consistently (0.35 => 0.4 even in Chrome)
    // https://stackoverflow.com/questions/10015027/javascript-tofixed-not-rounding
    private static _toFixedStr(num: number, digits: number) {
        let str = num.toString(),
            decPos = str.indexOf('.'),
            xZeros = digits - (str.length - decPos) + 1,
            sciNot = str.indexOf('e') > -1;

        // got enough digits, trim or add trailing zeros
        if (!sciNot && decPos > -1 && xZeros >= 0) {
            return str + Array(xZeros + 1).join('0');
        }

        // consistent rounding (3.5 => 4: TFS 356688)
        // relevant in some versions of Chrome and Firefox
        // https://github.com/d3/d3-format/issues/27
        //(+(Math.round(+(num + 'e' + digits)) + 'e' + -digits)).toFixed(digits);
        if (decPos > -1 && !sciNot && str[str.length - 1] == '5') { // TFS 433406
            let rnd = Math.round(+(Math.abs(num) + 'e' + digits)),
                sign = num < 0 ? -1 : 1;
            num = +(rnd + 'e' + -digits) * sign;
        }

        // use toFixed on rounded value
        return num.toFixed(digits);
    }

    // unquotes a string
    private static _unquote(s: string): string {
        if (s.length > 1 && s[0] == s[s.length - 1]) {
            if (s[0] == '\'' || s[0] == '\"') {
                return s.substr(1, s.length - 2);
            }
        }
        return s;
    }

    // parse a numeric format string into its parts
    private static _numFormatInfo = {};
    /*private*/ static _parseNumericFormat(format: string): _INumFormatInfo {

        // get info from cache
        let info = Globalize._numFormatInfo[format] as _INumFormatInfo;

        // parse the format string if not in cache
        if (!info) {
            let m = format
                    ? format.match(/(\"(.*?)\"\s*)?([a-z]+)\s*(\d*)\s*(,*)(\s*\"(.*?)\"\s*)?(.*)/i) || []
                    : [],
                spec = m[3] ? m[3] : 'n';
            
            // invalid spec? clear format (TFS 466946)
            if (spec.length > 1) {
                m = [];
                spec = 'n';
            }

            // set and store info
            info = {
                prefix: m[2] || '',
                spec: spec.toLowerCase(),
                specRaw: spec,
                prec: m[4] ? parseInt(m[4]) : null,
                scale: m[5] ? 3 * m[5].length : 0,
                suffix: m[7] || '',
                curr: m[8] || null // TFS 444394
            };
            Globalize._numFormatInfo[format] = info;
        }

        // done
        return info;
    }

    // parse a date format string into its parts
    private static _dateFormatParts = {};
    /*private*/ static _parseDateFormat(format: string): string[] {

        // get parts from cache
        let parts = Globalize._dateFormatParts[format] as string[];

        // parse the format string if not in cache
        if (!parts) {
            parts = [];
            if (format) { // TFS 288799
                let start: number,
                    end: number;
                for (start = 0; start > -1 && start < format.length; start++) {
                    let c = format[start];

                    // handle quoted parts (e.g. 'foo', "foo")
                    if (c == '\'' || c == '"') {
                        end = format.indexOf(c, start + 1); // keep quotes to distinguish from regular date parts
                        if (end > -1) {
                            parts.push(format.substring(start, end + 1));
                            start = end;
                            continue;
                        }
                    }

                    // handle escaped chars (e.g. \h, \m, \@)
                    if (c == '\\' && start < format.length - 1) {
                        start++;
                        parts.push('"' + format[start] + '"'); // add quotes to distinguish from regular date parts
                        continue;
                    }

                    // combine repeated runs (e.g. yyyy, mmm, dd)
                    end = start + 1;
                    for (; end < format.length; end++) {
                        if (format[end] != c) break;
                    }
                    parts.push(format.substring(start, end));
                    start = end - 1;
                }
            }
            Globalize._dateFormatParts[format] = parts;
        }

        // done
        return parts;
    }

    // format a date part into a string
    private static _formatDatePart(d: Date, format: string, part: string): string {
        let cal = culture.Globalize.calendar,
            era = null, year = 0, ff = 0, fd,
            plen = part.length;
        switch (part) {

            // ** year
            case 'yyyy': case 'yyy': case 'yy': case 'y': // calendar year
            case 'EEEE': case 'EEE': case 'EE': case 'E': // fiscal year (govt)
            case 'eeee': case 'eee': case 'ee': case 'e': // fiscal year (corporate)

                // get the year (calendar or fiscal)
                fd = part[0] == 'E' ? DateTime.toFiscal(d, true) :
                     part[0] == 'e' ? DateTime.toFiscal(d, false) :
                     d;
                year = fd.getFullYear();

                // if the calendar has multiple eras and the format specifies an era,
                // then adjust the year to count from the start of the era.
                // if the format has no era, then use the regular (Western) year.
                if (cal.eras.length > 1 && format.indexOf('g') > -1) {
                    era = Globalize._getEra(d, cal);
                    if (era) {
                        if (isDate(era.start)) {
                            year = year - era.start.getFullYear() + 1;
                        } else {
                            year = Math.abs(year); // render negative years as xx BC
                        }
                    }
                }

                // adjust number of digits (TFS 276489)
                let y = part.length < 3 ? year % 100
                      : part.length == 3 ? year % 1000
                      : year;
                return Globalize._zeroPad(y, part.length);

            // ** month
            case 'MMMMM':
                return cal.monthsAbbr[d.getMonth()][0]; // Month initial (not in .NET, but may be useful)
            case 'MMMM':
                return cal.months[d.getMonth()];
            case 'MMM':
                return cal.monthsAbbr[d.getMonth()];
            case 'MM': case 'M':
                return Globalize._zeroPad(d.getMonth() + 1, plen);

            // ** day
            case 'dddd':
                return cal.days[d.getDay()];
            case 'ddd':
                return cal.daysAbbr[d.getDay()];
            case 'dd':
                return Globalize._zeroPad(d.getDate(), 2);
            case 'd':
                return d.getDate().toString();

            // ** hour
            case 'hh': case 'h':
                return Globalize._zeroPad(Globalize._h12(d), plen);
            case 'HH': case 'H':
                return Globalize._zeroPad(d.getHours(), plen);

            // ** minute
            case 'mm': case 'm':
                return Globalize._zeroPad(d.getMinutes(), plen);

            // ** second
            case 'ss': case 's':
                return Globalize._zeroPad(d.getSeconds(), plen);

            // ** millisecond
            case 'fffffff': case 'FFFFFFF':
            case 'ffffff': case 'FFFFFF':
            case 'fffff': case 'FFFFF':
            case 'ffff': case 'FFFF':
            case 'fff': case 'FFF':
            case 'ff': case 'FF':
            case 'f': case 'F':
                ff = d.getMilliseconds() * Math.pow(10, plen - 3);
                return part[0] == 'f' ? Globalize._zeroPad(ff, plen) : ff.toFixed(0);

            // ** am/pm
            case 'tt':
                return d.getHours() < 12 ? cal.am[0] : cal.pm[0];
            case 't':
                return d.getHours() < 12 ? cal.am[1] : cal.pm[1];

            // ** quarter
            case 'q': case 'Q': // quarter (calendar)
                return (Math.floor(d.getMonth() / 3) + 1).toString();

            case 'u': case 'U': // quarter (fiscal: U: govt; u: corp)
                fd = DateTime.toFiscal(d, part == 'U');
                return (Math.floor(fd.getMonth() / 3) + 1).toString();

            // ** era
            case 'ggg': case 'gg': case 'g':
                if (cal.eras.length > 1) {
                    era = Globalize._getEra(d, cal);
                    if (era) { // TFS 387283
                        if (isString(era)) {
                            return era;
                        } else {
                            switch (part) {
                                case 'gg':
                                    return era.name[0];
                                case 'g':
                                    return era.symbol;
                                default: // 'ggg'
                                    return era.name;
                            }
                        }
                    }
                }
                return cal.eras[0];

            // ** localized separators
            case ':':
            case '/':
                return cal[part];

            // ** time zone
            case 'K':
                let tz = d.toString().match(/(\+|\-)(\d{2})(\d{2})/);
                return tz ? tz[1] + tz[2] + tz[3] : '';
            case 'zzz':
            case 'zz':
            case 'z':
                let tzo = -d.getTimezoneOffset(),
                    tzoa = Math.abs(tzo), // WJM-16549
                    fmt = Globalize.formatNumber,
                    ret: string;
                switch (part) {
                    case 'zzz': // Hours and minutes offset from UTC ('-07:00')
                        ret = fmt(tzoa / 60, 'd2', false, true) + cal[':'] + fmt(tzoa % 60, 'd2', false, true);
                        break;
                    case 'zz': // Hours offset from UTC, with a leading zero for a single- digit value ('07')
                        ret = fmt(tzoa / 60, 'd2', false, true);
                        break;
                    case 'z':
                        ret = fmt(tzoa / 60, 'd1', false, true); // TFS 436299
                        break;
                }
                return (tzo >= 0 ? '+': '-') + ret; // always add sign: WJM-16549
        }

        // unquote part
        if (plen > 1 && part[0] == part[plen - 1]) {
            if (part[0] == '\"' || part[0] == '\'') {
                return part.substr(1, plen - 2);
            }
        }

        // return part
        return part;
    }

    // get a date's era
    private static _getEra(d: any, cal: any): any {
        if (cal.eras) {
            let eras = cal.eras,
                len = cal.eras.length;
            if (isDate(d)) { // find era by start date

                // common case: AD/BC
                if (isString(eras[0])) {
                    return eras[d.getFullYear() >= 0 ? 0 : 1];
                }

                // search by era/start (Japanese calendar)
                // findIndex not supported in IE (TFS 387283)
                if (isDate(eras[0].start)) {
                    for (let i = 0; i < len; i++) {
                        if (d >= eras[i].start) {
                            return eras[i];
                        }
                    }
                    return eras[len - 1]; // return last era (not -1: TFS 387283)
                }

            } else if (isString(d) && d.length > 0) { // find era by name or symbol
                d = d.toLowerCase(); // case-insensitive: TFS 385369
                for (let i = 0; i < len; i++) { // findIndex not supported in IE (TFS 387283)
                    let era = eras[i];
                    if (isString(era)) {
                        if (era.toLowerCase().indexOf(d) == 0) {
                            return era;
                        }
                    } else {
                        if ((era.name && era.name.toLowerCase().indexOf(d) == 0) ||
                            (era.symbol && era.symbol.toLowerCase().indexOf(d) == 0)) {
                            return era;
                        }
                    }
                }
            }
        }

        // era not found
        return null;
    }

    // expand date pattern into full date format
    private static _expandFormat(format: string): string {
        let fmt = culture.Globalize.calendar.patterns[format];
        return fmt ? fmt : format;
    }

    // format a number with leading zeros
    private static _zeroPad(num: number, places: number) {
        let n = num.toFixed(0),
            zero = places - n.length + 1;
        return zero > 0 ? Array(zero).join('0') + n : n;
    }

    // format an hour to 12 or 24 hour base depending on the calendar
    private static _h12(d: Date) {
        let cal = culture.Globalize.calendar,
            h = d.getHours();
        if (cal.am && cal.am[0]) {
            h = h % 12;
            if (h == 0) h = 12;
        }
        return h;
    }

    // multiply or divide a number by a power of 10 using string operations
    // for improved precision (TFS 197687, 210383)
    /*private*/ static _shiftDecimal(val, shift) {

        // trivial cases (TFS 365659)
        if (shift == 0 || isNaN(val)) {
            return val;
        }

        // we don't do scientific notation
        let str = val.toString();
        if (str.indexOf('e') > -1) {
            return val * Math.pow(10, shift);
        }

        // pad string and get decimal position
        let pad = Array(Math.abs(shift) + 1).join('0');
        if (shift < 0) {
            str = pad + str;
        }
        var pos = str.indexOf('.');
        if (pos < 0) {
            str += '.';
            pos = str.indexOf('.');
        }
        if (shift > 0) {
            str = str + pad;
        }

        // move the decimal point
        pos += shift;
        str = str.replace('.', '');
        str = str.substr(0, pos) + '.' + str.substr(pos);

        // parse and return
        return parseFloat(str);
    }
}

// Destined for external modules support. 
// Called by culture files to sync global and local 'culture' vars.
export function _updateCulture(c: any) {
    culture = c;
    //culture = window['wijmo'].culture;
}

// adds information to the current culture
export function _addCultureInfo(member: string, info: any) {
    let wj = typeof window !== 'undefined' ? window['wijmo'] : null,
        wjc = wj ? wj.culture : null,
        wjcm = wjc ? wjc[member] : null;
    culture[member] = wjcm || info;
    //culture[member] = info;
}

    }
    


    module wijmo {
    


'use strict';

/**
 * Class that provides masking services to an HTMLInputElement.
 */
export class _MaskProvider {
    _tbx: HTMLInputElement;
    _msk: string;
    _promptChar = '_';
    _mskArr: _MaskElement[] = [];
    _firstPos: number;
    _lastPos: number;
    _backSpace: boolean;
    _composing: boolean;
    _overWrite = false;
    _full = true;
    _matchEnd: number;
    _autoComplete: string;
    _spellCheck: boolean;
    _inputBnd = this._input.bind(this);
    _keydownBnd = this._keydown.bind(this);
    _keypressBnd = this._keypress.bind(this);
    _cmpstartBnd = this._cmpstart.bind(this);
    _cmpendBnd = this._cmpend.bind(this);
    _evtInput: any;

    // big DBCS/SBCS exception lists
    static _X_DBCS_BIG_HIRA = '\u3041\u3043\u3045\u3047\u3049\u3063\u3083\u3085\u3087\u308e\u3095\u3096';
    static _X_DBCS_BIG_KATA = '\u30a1\u30a3\u30a5\u30a7\u30a9\u30c3\u30e3\u30e5\u30e7\u30ee\u30f5\u30f6';
    static _X_SBCS_BIG_KATA = '\uff67\uff68\uff69\uff6a\uff6b\uff6c\uff6d\uff6e\uff6f';

    /**
     * Initializes a new instance of the {@link _MaskProvider} class.
     * 
     * @param input Input element to be masked.
     * @param mask Input mask.
     * @param promptChar Character used to indicate input positions.
     */
    constructor(input: HTMLInputElement, mask = '', promptChar = '_') {
        this.mask = asString(mask);
        this.input = input;
        this.promptChar = asString(promptChar, false);
        this._connect(true);

        // raise input event on input element after applying mask (TFS 298529)
        let evt = this._evtInput = document.createEvent('HTMLEvents');
        evt.initEvent('input', true, false);
    }

    /**
     * Gets or sets the Input element to be masked.
     */
    get input(): HTMLInputElement {
        return this._tbx;
    }
    set input(value: HTMLInputElement) {
        this._connect(false);
        this._tbx = value;
        this._connect(true);
    }
    /**
     * Gets or sets the input mask used to validate input.
     */
    get mask(): string {
        return this._msk;
    }
    set mask(value: string) {
        if (value != this._msk) {
            this._msk = asString(value, true);
            this._parseMask();
            this._valueChanged();
        }
    }
    /**
     * Gets or sets the input mask used to validate input.
     */
    get promptChar(): string {
        return this._promptChar;
    }
    set promptChar(value: string) {
        if (value != this._promptChar) {

            // validate new prompt char
            value = asString(value, false);
            assert(value.length == 1, 'promptChar must be a string with length 1.');

            // replace in string (don't call _applyMask: WJM-19508)
            //WJM-19678
            let tbx = this._tbx;
            let tbxVal = tbx.value,
                newVal = '',
                mskArr = this._mskArr,
                oldPc = this._promptChar;
            for (let i = 0; i < tbxVal.length; i++) {
                let mskEl = mskArr[i], // can be undefined if the mask is shorter than the value
                    c = tbxVal[i];
                // if this is a not filled wildchar, change it to the new prompt char
                if (!(mskEl && mskEl.literal) && c === oldPc) {
                    c = value;
                }
                newVal += c;
            }
            tbx.value = newVal;           

            // save new prompt char
            this._promptChar = value;
        }
    }
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
    get overwriteMode(): boolean {
        return this._overWrite;
    }
    set overwriteMode(value: boolean) {
        this._overWrite = asBoolean(value);
    }
    /**
     * Gets a value that indicates whether the mask has been completely filled.
     */
    get maskFull(): boolean {
        return this._full;
    }
    /**
     * Gets an array with the position of the first and last wildcard characters in the mask.
     */
    getMaskRange(): number[] {
        return this._mskArr.length
            ? [this._firstPos, this._lastPos]
            : [0, this._tbx.value.length - 1];
    }
    /**
     * Gets the raw value of the editor, excluding prompts and literals.
     */
    getRawValue(): string {
        let text = this._tbx ? this._tbx.value : ''; // TFS 347135

        // no mask? it's all raw
        if (!this.mask) {
            return text;
        }

        // get raw input (no literals or prompts)
        let ret = '';
        for (let i = 0; i < this._mskArr.length && i < text.length; i++) {
            if (!this._mskArr[i].literal && text[i] != this._promptChar) {
                ret += text[i];
            }
        }

        // done
        return ret;
    }
    /**
     * Updates the control mask and content.
     */
    refresh() {
        this._parseMask();
        this._valueChanged();
    }

    // ** event handlers

    // apply mask and update cursor position after any changes
    _input(e: KeyboardEvent) {
        if (this._msk && !this._composing && e != this._evtInput) { // TFS 277471

            // cancel 'real' input event
            e.preventDefault();
            e.stopImmediatePropagation();

            // wait until the browser moves the cursor
            // (important for Android/iOS and others: TFS 419980, 421516)
            setTimeout(() => {

                // apply mask, update cursor position
                this._valueChanged();

                // raise 'replacement' input event
                if (this._tbx) {
                    this._tbx.dispatchEvent(this._evtInput);
                }

            });//, Control._FOCUS_INTERVAL);
        }
    }

    // special handling for backspacing over literals
    _keydown(e: KeyboardEvent) {

        // ignore backspaces before first wildcard (TFS 199372, 199901)
        if (e.keyCode == Key.Back) {
            let start = this._tbx.selectionStart,
                end = this._tbx.selectionEnd;
            if (start <= this._firstPos && end == start) {
                e.preventDefault();
                this._backSpace = false;
                return;
            }
        }

        // handle backspacing over literals
        this._backSpace = (e.keyCode == Key.Back);
    }

    // prevent flicker when invalid keys are pressed
    // NOTE: IE on Windows Phone 8.x does not raise keypress!!!
    _keypress(e: KeyboardEvent) {
        if (!e.ctrlKey && !e.metaKey && !e.altKey && !this._composing && this._preventKey(e.charCode)) {
            e.preventDefault();
        }
    }

    // handle IME composition
    _cmpstart(e: CompositionEvent) {
        this._composing = true;
    }
    _cmpend(e: CompositionEvent) {
        if (this._composing) {
            this._composing = false;
            setTimeout(() => {

                // composition is done, apply mask and raise input event
                // TFS 344129, 346097, 377454, 316164
                let tbx = this._tbx;
                if (tbx && this._valueChanged()) {
                    tbx.dispatchEvent(this._evtInput);
                }
            });
        }
    }

    // ** implementation

    // prevent a key from being handled if it is invalid
    _preventKey(charCode: number): boolean {
        if (charCode && this._mskArr.length) {
            let tbx = this._tbx,
                start = tbx.selectionStart,
                key = String.fromCharCode(charCode);

            // make sure we're at a placeholder
            if (start < this._firstPos) {
                start = this._firstPos;
                setSelectionRange(tbx, start);
            }

            // past the end?
            if (start >= this._mskArr.length) {
                return true;
            }

            // skip over literals and validate templates (TFS 117584)
            let m = this._mskArr[start];
            if (m.literal) {
                this._validatePosition(start);
            } else if (m.wildCard != key && !this._isCharValid(m.wildCard, key)) {
                return true;
            }
        }

        // key seems OK, do not prevent
        return false;
    }

    // connect or disconnect event handlers for the input element
    _connect(connect: boolean) {
        let tbx = this._tbx;
        if (tbx) {
            assert(
                tbx instanceof HTMLInputElement || (tbx as any) instanceof HTMLTextAreaElement,
                'INPUT or TEXTAREA element expected.');
            if (connect) {
                this._autoComplete = tbx.autocomplete;
                this._spellCheck = tbx.spellcheck;
                tbx.autocomplete = 'off'; // important for mobile browsers (including Chrome/Android)
                tbx.spellcheck = false; // no spell-checking on masked inputs
                tbx.addEventListener('input', this._inputBnd, true); // TFS 344129
                tbx.addEventListener('keydown', this._keydownBnd, true);
                tbx.addEventListener('keypress', this._keypressBnd, true);
                tbx.addEventListener('compositionstart', this._cmpstartBnd, true);
                tbx.addEventListener('compositionend', this._cmpendBnd, true);
                tbx.addEventListener('blur', this._cmpendBnd, true); // Safari does not finish composition on blur (TFS 236810)
                this._valueChanged();
            } else {
                tbx.autocomplete = this._autoComplete;
                tbx.spellcheck = this._spellCheck;
                tbx.removeEventListener('input', this._inputBnd, true);
                tbx.removeEventListener('keydown', this._keydownBnd, true);
                tbx.removeEventListener('keypress', this._keypressBnd, true);
                tbx.removeEventListener('compositionstart', this._cmpstartBnd, true);
                tbx.removeEventListener('compositionend', this._cmpendBnd, true);
                tbx.removeEventListener('blur', this._cmpendBnd, true);
            }
        }
    }

    // apply the mask keeping the cursor position and the focus
    _valueChanged(): boolean {

        // sanity
        if (!this._tbx || !this._msk) {
            return false;
        }

        // keep track of selection start, character at selection
        let tbx = this._tbx,
            start = tbx.selectionStart,
            oldChar = (start > 0) ? tbx.value[start - 1] : '',
            oldValue = tbx.value;

        // apply the mask
        tbx.value = this._applyMask();

        // handle case when the string was empty and the mask
        // doesn't start with a wildcard (e.g. "(000)-0000")
        if (oldValue == '') { // TFS 467951
            start = this._firstPos + 1;
        }

        // backtrack if the original character was replaced with a prompt
        let newChar = (start > 0) ? tbx.value[start - 1] : '';
        if (start > 0 && newChar == this._promptChar && oldChar != this.promptChar) {
            start--;
        }

        // if the start was at the end of the original value, move it
        // to where the match ended (e.g. "123456" -> "0000-0000-0000")
        if (start == oldValue.length) {
            start = this._matchEnd;
        }

        // validate the position based on the cursor position or on
        // where the match ended
        this._validatePosition(start);

        // done
        return oldValue != tbx.value;
    }

    // applies the mask to the current text content, returns the result 
    // this is usually a valid string with the same length as the mask, unless 
    // (a) there's no mask, or 
    // (b) there's no text and the input is not required
    _applyMask(): string {
        let tbx = this._tbx,
            text = tbx.value;


        // assume we're complete
        this._full = true;
        this._matchEnd = 0;

        // no mask? accept everything
        if (!this._msk) {
            return text;
        }

        // no text OK if not required
        if (!text && !tbx.required) {
            return text;
        }

        // overwrite mode (TFS 457623)
        if (this._overWrite && text.length == this.mask.length + 1) {
            let start = tbx.selectionStart;
            if (tbx == document.activeElement && tbx.selectionEnd == start) {
                text = text.substr(0, start) + text.substr(start + 1);
            }
        }

        // handle ambiguous literals (could be interpreted as content)

        text = this._handleVagueLiterals(text);

        // build output string based on current content and mask
        let ret = '',
            pos = 0,
            promptChar = this._promptChar;
        for (let i = 0; i < this._mskArr.length; i++) {

            // get mask element
            let m = this._mskArr[i],
                c = m.literal;

            // if this is a literal, match with text at cursor
            if (c && c == text[pos]) {
                pos++;
            }

            // if it is a wildcard, match with text starting at the cursor
            if (m.wildCard) {
                c = promptChar;
                if (text) {
                    let j = pos;
                    for (; j < text.length; j++) {
                        if (this._isCharValid(m.wildCard, text[j])) {

                            // get character to add to return value
                            c = text[j];
                            switch (m.charCase) {
                                case '>':
                                    c = c.toUpperCase();
                                    break;
                                case '<':
                                    c = c.toLowerCase();
                                    break;
                            }

                            // keep track of where the matching ended
                            if (c != promptChar) {
                                this._matchEnd = ret.length + 1;
                            }

                            // move on
                            break;
                        }
                    }
                    pos = j + 1;
                }

                // still prompt? then the mask is not full
                if (c == promptChar) {
                    this._full = false;
                }
            }

            // add to output
            ret += c;
        }

        // done applying mask, return result
        return ret;
    }

    // fix text to handle ambiguous literals (that could be interpreted as content)
    _handleVagueLiterals(text: string): string {

        // looks like a paste, don't mess with it (TFS 139412, 145560)
        if (text.length > this._mskArr.length + 1) {
            return text;
        }

        // see if we're shrinking or growing
        let delta = text.length - this._mskArr.length;
        if (delta != 0 && text.length > 1) {

            // see if we have an ambiguous literal
            let badIndex = -1,
                tbx = this._tbx,
                cursor = tbx == getActiveElement() ? tbx.selectionStart : tbx.value.length, // TFS 316855
                start = Math.max(0, cursor - delta);
            for (let i = start; i < this._mskArr.length; i++) {
                if (this._mskArr[i].vague) {
                    badIndex = i;
                    break;
                }
            }

            // we do, so handle it
            if (badIndex > -1) {
                //console.log(' text: [' + text + ']');
                if (delta < 0) { // deleted: pad
                    let pad = Array(1 - delta).join(this._promptChar),
                        index = badIndex + delta;
                    if (index > -1) {
                        text = text.substr(0, index) + pad + text.substr(index);
                    }
                } else { // added: line up
                    while (badIndex > 0 && this._mskArr[badIndex - 1].literal) {
                        badIndex--;
                    }
                    text = text.substr(0, badIndex) + text.substr(badIndex + delta);
                }
                //console.log('fixed: [' + text + ']');
            }
        }

        // done
        return text;
    }

    // checks whether a character is valid for a given mask character
    _isCharValid(mask: string, c: string): boolean {

        // prompt char always valid
        if (c == this._promptChar) {
            return true;
        }

        // check wildcards
        switch (mask) {

            // regular wildcards
            case '0': // Digit
                return this._isDigit(c);
            case '9': // Digit or space
                return this._isDigit(c) || c == ' ';
            case '#': // Digit, sign, or space
                return this._isDigit(c) || c == ' ' || c == '+' || c == '-';
            case 'L': // Letter
                return this._isLetter(c);
            case 'l': // Letter or space
                return this._isLetter(c) || c == ' ';
            case 'A': // Alphanumeric
                return this._isDigit(c) || this._isLetter(c);
            case 'a': // Alphanumeric or space
                return this._isDigit(c) || this._isLetter(c) || c == ' ';

            // Katakana/Hiragana wildcards
            // http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
            case '\uff19': // DBCS Digit
                return (c >= '\uFF10' && c <= '\uff19');
            case '\uff2a': // DBCS Hiragana
            case '\uff27': // DBCS big Hiragana
                if (mask == '\uff27' && _MaskProvider._X_DBCS_BIG_HIRA.indexOf(c) > -1) return false;  // exceptions
                return (c >= '\u3041' && c <= '\u309f');
            case '\uff2b': // DBCS Katakana
            case '\uff2e': // DBCS big Katakana
                if (mask == '\uff2e' && _MaskProvider._X_DBCS_BIG_KATA.indexOf(c) > -1) return false; // exceptions
                return (c >= '\u30a0' && c <= '\u30ff');
            case '\uff3a': // Any DBCS
                if (c >= '\uff66' && c <= '\uff9f') return false; // exclude SBCS Katakana (TFS 444883)
                return (c <= '\u0021' || c >= '\u00ff');
            case 'H': // Any SBCS
                //return (c >= '\u0021' && c <= '\u00ff');
                //return (c >= '\uff00' && c <= '\uffef'); // TFS 399071 (bad, removed all ascii)
                //return this._isCharValid('A', c) || (c >= '\uff00' && c <= '\uffef'); // TFS 399071 (bad, added some ascii)
                //return (c >= '\u0021' && c <= '\u00ff') || (c >= '\uff00' && c <= '\uffef'); // TFS 418968
                return (c >= '\u0021' && c <= '\u00ff') || (c >= '\uff66' && c <= '\uff9f'); // TFS 444883
            case 'K': // SBCS Katakana
            case 'N': // SBCS big Katakana
                if (mask == 'N' && _MaskProvider._X_SBCS_BIG_KATA.indexOf(c) > -1) return false; // exceptions
                return (c >= '\uff66' && c <= '\uff9f');
        }

        // unknown wildcard, fail by default
        return false;
    }
    _isDigit(c: string): boolean {
        return c >= '0' && c <= '9';
    }
    _isLetter(c: string): boolean {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
    }

    // skip over literals
    _validatePosition(start: number) {
        let msk = this._mskArr;

        // skip left if the last key pressed was a backspace
        if (this._backSpace) {
            while (start > 0 && start < msk.length && msk[start - 1].literal) {
                start--;
            }
        }

        // skip right over literals
        if (start == 0 || !this._backSpace) {
            while (start < msk.length && msk[start].literal) {
                start++;
            }
        }

        // move selection to start
        if (getActiveElement() == this._tbx) {
            setSelectionRange(this._tbx, start);
        }

        // no longer backspacing
        this._backSpace = false;
    }

    // parse mask into internal mask, literals, and case
    _parseMask() {

        // clear internal mask info
        this._mskArr = [];
        this._firstPos = -1;
        this._lastPos = -1;

        // parse new mask
        let msk = this._msk,
            currCase = '|',
            c: string;
        for (let i = 0; msk && i < msk.length; i++) {
            switch (msk[i]) {

                // wildcards
                case '0': // digit.
                case '9': // Digit or space.
                case '#': // Digit, sign, or space.
                case 'A': // Alphanumeric.
                case 'a': // Alphanumeric or space.
                case 'L': // Letter.
                case 'l': // Letter or space.

                // Katakana/Hiragana wildcards
                case '\uff19': // DBCS Digit.
                case '\uff2a': // DBCS Hiragana.
                case '\uff27': // DBCS big Hiragana.
                case '\uff2b': // DBCS Katakana.
                case '\uff2e': // DBCS big Katakana.
                case '\uff3a': // Any DBCS
                case 'K': // SBCS Katakana.
                case 'N': // SBCS big Katakana.
                case 'H': // Any SBCS character.
                    if (this._firstPos < 0) {
                        this._firstPos = this._mskArr.length;
                    }
                    this._lastPos = this._mskArr.length;
                    this._mskArr.push(new _MaskElement(msk[i], currCase));
                    break;

                // localized literals
                case '.': // Decimal separator.
                case ',': // Thousands separator.
                case ':': // Time separator.
                case '/': // Date separator.
                case '$': // Currency symbol.
                    switch (msk[i]) {
                        case '.':
                        case ',':
                            c = culture.Globalize.numberFormat[msk[i]];
                            break;
                        case ':':
                        case '/':
                            c = culture.Globalize.calendar[msk[i]];
                            break;
                        case '$':
                            c = culture.Globalize.numberFormat.currency.symbol;
                            break;
                    }
                    for (let j = 0; j < c.length; j++) {
                        this._mskArr.push(new _MaskElement(c[j]));
                    }
                    break;

                // case-shifting
                case '<': // Shift down (converts characters that follow to lowercase).
                case '>': // Shift up (converts characters that follow to uppercase).
                case '|': // Disable any previous shifts.
                    currCase = msk[i];
                    break;

                // literals
                case '\\': // Escape next character into literal.
                    if (i < msk.length - 1) i++;
                    this._mskArr.push(new _MaskElement(msk[i]));
                    break;
                default: // All others: Literals.
                    this._mskArr.push(new _MaskElement(msk[i]));
                    break;
            }
        }

        // keep track of ambiguous literals
        for (let i = 0; i < this._mskArr.length; i++) {
            let elem = this._mskArr[i];
            if (elem.literal) {
                for (let j = 0; j < i; j++) {
                    let m = this._mskArr[j];
                    if (m.wildCard && this._isCharValid(m.wildCard, elem.literal)) {
                        elem.vague = true;
                        break;
                    }
                }
            }
        }
    }
}

/**
 * Class that contains information about a position in an input mask.
 */
export class _MaskElement {
    wildCard: string;   // wildcard to match
    charCase: string;   // upper/lower case
    literal: string;    // literal to match
    vague: boolean      // literal that can be interpreted as content

    /**
     * Initializes a new instance of the {@link _MaskElement} class.
     *
     * @param wildcardOrLiteral Wildcard or literal character
     * @param charCase Whether to convert wildcard matches to upper or lowercase.
     */
    constructor(wildcardOrLiteral: string, charCase?: string) {
        if (charCase) {
            this.wildCard = wildcardOrLiteral;
            this.charCase = charCase;
        } else {
            this.literal = wildcardOrLiteral;
        }
    }
}


    }
    


    module wijmo {
     


'use strict';

/**
 * Specifies the type of aggregate to calculate over a group of values.
 */
export enum Aggregate {
    /**
     * No aggregate.
     */
    None,
    /**
     * Returns the sum of the numeric values in the group.
     */
    Sum,
    /**
     * Returns the count of non-null values in the group.
     */
    Cnt,
    /**
     * Returns the average value of the numeric values in the group.
     */
    Avg,
    /**
     * Returns the maximum value in the group.
     */
    Max,
    /**
     * Returns the minimum value in the group.
     */
    Min,
    /**
     * Returns the difference between the maximum and minimum numeric values in the group.
     */
    Rng,
    /**
     * Returns the sample standard deviation of the numeric values in the group 
     * (uses the formula based on n-1).
     */
    Std,
    /**
     * Returns the sample variance of the numeric values in the group 
     * (uses the formula based on n-1).
     */
    Var,
    /**
     * Returns the population standard deviation of the values in the group 
     * (uses the formula based on n).
     */
    StdPop,
    /**
     * Returns the population variance of the values in the group 
     * (uses the formula based on n).
     */
    VarPop,
    /**
     * Returns the count of all values in the group (including nulls).
     */
    CntAll,
    /**
     * Returns the first non-null value in the group.
     */
    First,
    /**
     * Returns the last non-null value in the group.
     */
    Last
}
/**
 * Calculates an aggregate value from the values in an array.
 *
 * @param aggType Type of aggregate to calculate.
 * @param items Array with the items to aggregate.
 * @param binding Name of the property to aggregate on (in case the items are not simple values).
 */
export function getAggregate(aggType: Aggregate, items: any[], binding?: string) {
    let cnt = 0,
        cntn = 0,
        sum = 0,
        sum2 = 0,
        min = null,
        max = null,
        last = null,
        bnd = binding ? new Binding(binding) : null;

    // special case: overall count (including nulls)
    aggType = asEnum(aggType, Aggregate);
    if (aggType == Aggregate.CntAll) {
        return items.length;
    }

    // calculate aggregate
    for (let i = 0; i < items.length; i++) {

        // get item/value
        let val = items[i];
        if (bnd) {
            val = bnd.getValue(val);
            //assert(!isUndefined(val), 'item does not define property "' + binding + '".');
        }

        // aggregate
        if (val != null) {
            if (aggType == Aggregate.First) {
                return val;
            }
            cnt++;
            if (min == null || val < min) {
                min = val;
            }
            if (max == null || val > max) {
                max = val;
            }
            last = val;
            if (isNumber(val) && !isNaN(val)) {
                cntn++;
                sum += val;
                sum2 += val * val;
            } else if (isBoolean(val)) {
                cntn++;
                if (val == true) {
                    sum++;
                    sum2++;
                }
            }
        }
    }

    // return result
    let avg = cntn == 0 ? 0 : sum / cntn;
    switch (aggType) {
        case Aggregate.Avg:
            return avg;
        case Aggregate.Cnt:
            return cnt;
        case Aggregate.Max:
            return max;
        case Aggregate.Min:
            return min;
        case Aggregate.Rng:
            return max - min;
        case Aggregate.Sum:
            return sum;
        case Aggregate.VarPop:
            return cntn <= 1 ? 0 : sum2 / cntn - avg * avg;
        case Aggregate.StdPop:
            return cntn <= 1 ? 0 : Math.sqrt(sum2 / cntn - avg * avg);
        case Aggregate.Var:
            return cntn <= 1 ? 0 : (sum2 / cntn - avg * avg) * cntn / (cntn - 1);
        case Aggregate.Std:
            return cntn <= 1 ? 0 : Math.sqrt((sum2 / cntn - avg * avg) * cntn / (cntn - 1));
        case Aggregate.Last:
            return last;
    }

    // should never get here...
    throw 'Invalid aggregate type.';
}

    }
    


    module wijmo.collections {
    



'use strict';

/**
 * Base class for Array classes with notifications.
 */
export class ArrayBase<T = any> extends Array<T> {

    /**
     * Initializes a new instance of the {@link ArrayBase} class.
     */
    constructor() {
        if (!canChangePrototype) {
            super();
        } else {
            this.length = 0;
        }
    }

}
var canChangePrototype = true;
try {
    ArrayBase.prototype = Array.prototype;
    canChangePrototype = ArrayBase.prototype === Array.prototype; // check in case where assignment was just ignored
}
catch (e) {
    canChangePrototype = false;
}
// In ES6 without this Symbol.species property, the methods returning arrays
// will return instances of the derived class instead of a native Array.
var symb = typeof window !== 'undefined' ? window['Symbol'] : null;
if (!canChangePrototype && symb && symb.species) {
    Object.defineProperty(ArrayBase, symb.species, {
        get: function () { return Array; },
        enumerable: false,
        configurable: false
    });
}

/**
 * Array that sends notifications on changes.
 *
 * The class raises the {@link collectionChanged} event when changes are made with 
 * the push, pop, splice, shift, unshift, insert, or remove methods.
 *
 * Warning: Changes made by assigning values directly to array members or to the 
 * length of the array do not raise the {@link collectionChanged} event.
 */
export class ObservableArray<T = any> extends ArrayBase<T> implements INotifyCollectionChanged {
    private _updating = 0;

    /**
     * Initializes a new instance of the {@link ObservableArray} class.
     *
     * @param data Array containing items used to populate the {@link ObservableArray}.
     */
    constructor(data?: T[]) {
        super();

        // initialize the array
        if (data) {
            data = wijmo.asArray(data);
            this._updating++;
            for (let i = 0; i < data.length; i++) {
                this.push(data[i]);
            }
            this._updating--;
        }
    }

    /**
     * Adds one or more items to the end of the array.
     *
     * @param ...items One or more items to add to the array.
     * @return The new length of the array.
     */
    push(...items: T[]): number {
        items.forEach(item => {
            super.push(item);
            this._raiseCollectionChanged(NotifyCollectionChangedAction.Add, item, this.length - 1);
        });
        return this.length;
    }
    /**
     * Removes the first element from the array and returns that element.
     * 
     * This method changes the length of the array.
     */
    shift(): T {
        let item = super.shift();
        this._raiseCollectionChanged(NotifyCollectionChangedAction.Remove, item, 0);
        return item;
    }
    /**
     * Adds one or more elements to the beginning of the array and returns
     * the new length of the array.
     * 
     * @param ...items One or more items to add to the array.
     * @return The new length of the array.
     */
    unshift(...items: T[]): number {
        let len = super.unshift(...items);
        if (items.length == 1) {
            this._raiseCollectionChanged(NotifyCollectionChangedAction.Add, items[0], 0);
        } else {
            this._raiseCollectionChanged();
        }
        return len;
    }
    /*
     * Removes the last item from the array.
     *
     * @return The item that was removed from the array.
     */
    pop(): any {
        let item = super.pop();
        this._raiseCollectionChanged(NotifyCollectionChangedAction.Remove, item, this.length);
        return item;
    }
    /**
     * Removes and/or adds items to the array.
     *
     * @param index Position where items will be added or removed.
     * @param count Number of items to remove from the array.
     * @param  ...item One or more items to add to the array.
     * @return An array containing the removed elements.
     */
    splice(index: number, count: number, ...item: T[]): T[] {
        let action = NotifyCollectionChangedAction,
            raiseChange = this._raiseCollectionChanged.bind(this),
            rv: T[];
        
        if (count && item.length) { // add and remove items in the same call
            rv = super.splice(index, count, ...item);
            if (count == 1 && item.length == 1) {
                raiseChange(action.Change, item[0], index);
            } else {
                raiseChange();
            }
        } else if (item.length) { // add one or more items
            rv = super.splice(index, 0, ...item);
            if (item.length == 1) {
                raiseChange(action.Add, item[0], index);
            } else {
                raiseChange();
            }
        } else { // remove zero or more items
            rv = super.splice(index, count);
            if (count == 1) {
                raiseChange(action.Remove, rv[0], index);
            } else {
                raiseChange();
            }
        }
        return rv;
    }
    /**
     * Creates a shallow copy of a portion of an array.
     *
     * @param begin Position where the copy starts.
     * @param end Position where the copy ends.
     * @return A shallow copy of a portion of an array.
     */
    slice(begin?: number, end?: number): T[] {
        return super.slice(begin, end);
    }
    /**
     * Searches for an item in the array.
     *
     * @param searchElement Element to locate in the array.
     * @param fromIndex The index where the search should start.
     * @return The index of the item in the array, or -1 if the item was not found.
     */
    indexOf(searchElement: T, fromIndex?: number): number {
        return super.indexOf(searchElement, fromIndex);
    }
    /**
     * Sorts the elements of the array in place.
     *
     * @param compareFn Specifies a function that defines the sort order. 
     * If specified, the function should take two arguments and should return
     * -1, +1, or 0 to indicate the first argument is smaller, greater than,
     * or equal to the second argument.
     * If omitted, the array is sorted in dictionary order according to the 
     * string conversion of each element.
     * @return A copy of the sorted array.
     */
    sort(compareFn?: Function): this {
        let rv = super.sort(<(a: T, b: T) => number><any>compareFn);
        this._raiseCollectionChanged();
        return rv;
    }
    /**
     * Inserts an item at a specific position in the array.
     *
     * @param index Position where the item will be added.
     * @param item Item to add to the array.
     */
    insert(index: number, item: T) {
        this.splice(index, 0, item);
    }
    /**
     * Removes an item from the array.
     *
     * @param item Item to remove.
     * @return True if the item was removed, false if it wasn't found in the array.
     */
    remove(item: T): boolean {
        let index = this.indexOf(item);
        if (index > -1) {
            this.removeAt(index);
        }
        return index > -1;
    }
    /**
     * Removes an item at a specific position in the array.
     *
     * @param index Position of the item to remove.
     */
    removeAt(index: number) {
        this.splice(index, 1);
    }
    /**
     * Assigns an item at a specific position in the array.
     *
     * @param index Position where the item will be assigned.
     * @param item Item to assign to the array.
     */
    setAt(index: number, item: T) {

        // make sure we have enough elements to set at the right index!
        if (index >= this.length) {
            this.length = index + 1;
        }

        // go ahead and splice now
        this.splice(index, 1, item);
    }
    /**
     * Removes all items from the array.
     */
    clear() {
        if (this.length) {
            this.splice(0, this.length); // safer than setting length = 0
        }
    }
    /**
     * Suspends notifications until the next call to {@link endUpdate}.
     */
    beginUpdate() {
        this._updating++;
    }
    /**
     * Resumes notifications suspended by a call to {@link beginUpdate}.
     */
    endUpdate() {
        this._updating--;
        if (this._updating <= 0) {
            this._raiseCollectionChanged();
        }
    }
    /**
     * Gets a value that indicates whether notifications are currently suspended
     * (see {@link beginUpdate} and {@link endUpdate}).
     */
    get isUpdating() {
        return this._updating > 0;
    }
    /**
     * Executes a function within a {@link beginUpdate}/{@link endUpdate} block.
     *
     * The collection will not be refreshed until the function finishes. 
     * This method ensures {@link endUpdate} is called even if the function throws
     * an exception.
     *
     * @param fn Function to be executed without updates. 
     */
    deferUpdate(fn: Function) {
        try {
            this.beginUpdate();
            fn();
        } finally {
            this.endUpdate();
        }
    }

    // ** IQueryInterface

    /**
     * Returns true if the caller queries for a supported interface.
     *
     * @param interfaceName Name of the interface to look for.
     * @return True if the caller queries for a supported interface.
     */
    implementsInterface(interfaceName: string): boolean {
        return interfaceName == 'INotifyCollectionChanged';
    }

    // ** INotifyCollectionChanged

    /**
     * Occurs when the collection changes.
     */
    readonly collectionChanged = new wijmo.Event<ObservableArray<T>, NotifyCollectionChangedEventArgs<T>>();
    /**
     * Raises the {@link collectionChanged} event.
     *
     * @param e Contains a description of the change.
     */
    onCollectionChanged(e = NotifyCollectionChangedEventArgs.reset) {
        if (!this.isUpdating) {
            this.collectionChanged.raise(this, e);
        }
    }

    // call onCollectionChanged unless updating
    private _raiseCollectionChanged(action = NotifyCollectionChangedAction.Reset, item?: T, index?: number) {
        if (!this.isUpdating) {
            let e = new NotifyCollectionChangedEventArgs<T>(action, item, index);
            this.onCollectionChanged(e);
        }
    }
}

    }
    


    module wijmo.collections {
    






/**
 * Represents a method that takes no arguments and returns a new data object.
 */
export interface IItemCreator<T = any> {
    (): T;
}

/**
 * Represents a method that provides an alternate data item
 * to be used when sorting collections.
 */
export interface ISortConverter<T = any> {
    /**
     * @param sd {@link SortDescription} that describes the property being sorted and the sort direction.
     * @param item Data item being sorted.
     * @param value Value of the item property.
     * @param extra Optional parameter with custom information.
     * @returns The data item to use when sorting.
     */
    (sd: SortDescription, item: T, value: any, custom?: any): any;
}

/**
 * Represents a method that identifies errors in data items.
 */
export interface IGetError<T = any> {
    /**
     * @param item Item to be inspected.
     * @param property Property to be inspected, or null to inspect all properties.
     * @param parsing Whether the value is being edited and could not be parsed into the right data type.
     * @returns A string describing the error, if any, or null to indicate there are no errors.
     */
    (item: T, property: string | null, parsing?: boolean): string | null;
}

/**
 * Specifies constants that define how null values are sorted.
 */
export enum SortNulls {
    /** Null values are sorted in natural order (first in ascending, last in descending order). */
    Natural,
    /** Null values appear first (regardless of sort order). */
    First,
    /** Null values appear last (regardless of sort order). */
    Last
}

// maximum object depth for cloning/comparing
const _OBJ_DEPTH = 2;

/**
 * Class that implements the {@link ICollectionView} interface to expose data in
 * regular JavaScript arrays.
 *
 * The {@link CollectionView} class implements the following interfaces:
 * <ul>
 *   <li>{@link ICollectionView}: provides current record management, 
 *       custom sorting, filtering, and grouping.</li>
 *   <li>{@link IEditableCollectionView}: provides methods for editing,
 *       adding, and removing items.</li>
 *   <li>{@link IPagedCollectionView}: provides paging.</li>
 * </ul>
 *
 * To use the {@link CollectionView} class, start by declaring it and passing a 
 * regular array as a data source. Then configure the view using the 
 * {@link filter}, {@link sortDescriptions}, {@link groupDescriptions}, and 
 * {@link pageSize} properties. Finally, access the view using the {@link items}
 * property. For example:
 * 
 * ```typescript
 * import { CollectionView, SortDescription} from '@grapecity/wijmo';
 * 
 * // create a CollectionView based on a data array
 * let view = new CollectionView(dataArray);
 *
 * // sort items by amount in descending order
 * let sortDesc = new SortDescription('amount', false);
 * view.sortDescriptions.push(sortDesc);
 *
 * // show only items with amounts greater than 100
 * view.filter = (item) => { return item.amount > 100 };
 *
 * // show the sorted, filtered result on the console
 * view.items.forEach((item, index) => {
 *     console.log(index + ': ' + item.name + ' ' + item.amount);
 * });
 * ```
 * 
 * The example below shows how you can use a {@link CollectionView}
 * to provide sorted views of some raw data:
 * 
 * {@sample Core/CollectionView/CreatingViews/Sorting/Overview Example}
 */
export class CollectionView<T = any> implements IEditableCollectionView, IPagedCollectionView {
    _srcRaw: T[] = null;
    _src: T[] = null;
    _ncc: INotifyCollectionChanged = null;
    _view: T[] = null;
    _pgView: T[] = null;
    _groups: CollectionViewGroup[] | null = null;
    _fullGroups: CollectionViewGroup[] | null = null;
    _digest: string = '';
    _idx = -1;
    _filter: IPredicate = null;
    _filters = new ObservableArray<IPredicate>();
    _srtDsc = new ObservableArray<SortDescription>();
    _grpDesc = new ObservableArray<GroupDescription>();
    _newItem: T | null = null;
    _edtItem: T | null = null;
    _edtClone: any = null;
    _committing = false;
    _canceling = false;
    _pendingRefresh = false;
    _pendingRemove = false;
    _pgSz = 0;
    _pgIdx = 0;
    _updating = 0;
    _itemCreator: IItemCreator<T>;
    _stableSort = false; // no longer needed with modern browsers (only IE still needs this)
    _srtNulls = SortNulls.Last; // like Excel
    _canFilter = true;
    _canGroup = true;
    _canSort = true;
    _canAddNew = true;
    _canCancelEdit = true;
    _canRemove = true;
    _canChangePage = true;
    _refreshOnEdit = true;
    _trackChanges = false;
    _chgAdded = new ObservableArray<T>();
    _chgRemoved = new ObservableArray<T>();
    _chgEdited = new ObservableArray<T>();
    _orgVals = window['Map'] ? new Map() : null;
    _srtCvt: ISortConverter<T> | null = null;
    _srtCmp: IComparer<T> | null = null;
    _getError: IGetError<T> | null = null;
    _keepCurrentItem: boolean | null = null;
    _initializing = false;
    _calcFields: any;

    // use Intl.Collator to compare strings (not supported by IE9/SafariWin)
    static _collator = typeof window !== 'undefined' && window['Intl'] && Intl.Collator ? new Intl.Collator() : null;

    /**
     * Initializes a new instance of the {@link CollectionView} class.
     * 
     * @param sourceCollection Array that serves as a source for this 
     * {@link CollectionView}.
     * @param options JavaScript object containing initialization data for the control.
     */
    constructor(sourceCollection?: any, options?: any) {

        // check that sortDescriptions contains SortDescriptions
        this._srtDsc.collectionChanged.addHandler(() => {
            this._srtDsc.forEach(srt => {
                wijmo.assert(srt instanceof SortDescription, 'sortDescriptions array must contain SortDescription objects.');
            });
            if (this.canSort) {
                this._commitAndRefresh();
            }
        });

        // check that groupDescriptions contains GroupDescriptions
        this._grpDesc.collectionChanged.addHandler(() => {
            this._grpDesc.forEach(grp => {
                wijmo.assert(grp instanceof GroupDescription, 'groupDescriptions array must contain GroupDescription objects.');
            });
            if (this.canGroup) {
                this._commitAndRefresh();
            }
        });

        // check that filters contains predicates
        this._filters.collectionChanged.addHandler(() => {
            this._filters.forEach(filter => {
                wijmo.assert(wijmo.isFunction(filter), 'filters array must contain IPredicate functions.');
            });
            if (this.canFilter) {
                this._commitAndRefresh();
            }
        });

        // initialize the source collection (before applying options: TFS 374351)
        this.sourceCollection = sourceCollection || new ObservableArray();

        // apply options
        if (options) {
            this._initializing = true;
            this.deferUpdate(() => {
                wijmo.copy(this, options);
            });
            this._initializing = false;
        }

        // keep current item when sorting (not current index)
        if (this._keepCurrentItem == null) {
            this._keepCurrentItem = true;
        }
    }

    // method used in JSON-style initialization
    _copy(key: string, value: any): boolean {
        switch (key) {
            case 'sortDescriptions':
                let sd = this.sortDescriptions;
                sd.deferUpdate(() => {
                    sd.clear();
                    wijmo.asArray(value).forEach(val => {
                        if (wijmo.isString(val)) {
                            val = new SortDescription(val, true);
                        } else if (!(val instanceof SortDescription) && val.property) {
                            val = new SortDescription(val.property, val.ascending);
                        }
                        sd.push(val);
                    });
                });
                return true;

            case 'groupDescriptions':
                let gd = this.groupDescriptions;
                gd.deferUpdate(() => {
                    gd.clear();
                    value.forEach(val => {
                        if (wijmo.isString(val)) {
                            val = new PropertyGroupDescription(val);
                        }
                        gd.push(val);
                    });
                });
                return true;

            case 'currentItem': // TFS 324003
                this.currentItem = value;
                return true;
        }
        return false;
    }

    /**
     * Gets or sets an object where the keys represent calculated fields
     * and the values are expressions (functions or strings).
     * 
     * Calculated fields require proxies. To use them in IE11, you will 
     * need a polyfill such as this one: 
     * https://www.npmjs.com/package/proxy-polyfill.
     * 
     * Calculated fields can be useful when dealing with external data.
     * For example, you could add a per-capita income field (gnp/pop) or a 
     * profit field (revenue-expenses).
     * 
     * Calculated fields are dynamic. If you change the fields used in the
     * calculation, their values are updated automatically. They are also
     * read-only. You may change the value of the properties used to calculate
     * them, but you cannot directly edit the result.
     * 
     * Unlike {@link FlexGrid} cellTemplates, calculated fields can be used 
     * for sorting, filtering, and grouping. They can also be used with charts
     * and any other Wijmo controls.
     * 
     * Calculated fields can be defined as functions that take a data item
     * as an argument or as strings.
     * 
     * For example, if your data looked like this:
     * 
     * ```typescript
     * // regular data item
     * interface IDataItem {
     *       product: string,
     *       brand: string,
     *       unitPrice: number,
     *       qty: number,
     *       shipped: boolean
     * }
     * function getData(): IDataItem[] {
     *     return [
     *         { 
     *             product: 'Banana', 
     *             brand: 'Chiquita',
     *             unitPrice: 45.95,
     *             qty: 12,
     *             discount: .08,
     *             shipped: true
     *         }, ...
     *     ]
     * }
     * ```
     * 
     * You could add function-based calculated fields this way:
     * 
     * ```typescript
     * // add calculated properties to IDataItem
     * interface ICalcDataItem extends IDataItem {
     *     fullName: string;
     *     allCaps: string;
     *     totalPrice: number,
     *     tax: number;
     * }
     * 
     * let cv = new CollectionView<ICalcDataItem>(getData(), {
     *     calculatedFields: {
     *         fullName: ($: ICalcDataItem) => [$.brand, $.product].join(' '),
     *         allCaps: ($: ICalcDataItem) => $.fullName.toUpperCase(),
     *         totalPrice: ($: ICalcDataItem) => ($.unitPrice * $.qty) * (1 - $.discount),
     *         tax: ($: ICalcDataItem) => $.totalPrice * 0.12
     *     }
     * });
     * ```
     * **Function-based calculated fields** are usually a better choice than
     * string-based calculated fields because:
     * 
     * 1) They provide design-time error checking and command completion,
     * 2) They run faster, and
     * 3) They do not have any issues with content-security policy (CSP).
     * 
     * Alternatively, you could add string-based calculated fields:
     * 
     * ```typescript
     * let cv = new CollectionView<IDataItem>(getData(), {
     *   calculatedFields: {
     *     fullName: '[$.brand, $.product].join(" ")',
     *     allCaps: '$.fullNameStr.toUpperCase()',
     *     totalPrice: '($.unitPrice * $.qty) * (1 - $.discount)',
     *     tax: '$.totalPrice * 0.12'
     * });
     * ```
     * String expressions may refer to the current item via the context
     * variable '$', which contains the item's original and calculated
     * values.
     * 
     * **String-based calculated fields** have advantages over function-based
     * calculated fields that may be important in some scenarios:
     * 
     * 1) They are slightly more concise, and
     * 2) They can be stored as data and easily changed at run-time.
     */
    get calculatedFields(): any {
        return this._calcFields;
    }
    set calculatedFields(value: any) {
        if (value && !window['Proxy']) {
            console.warn('** Calculated fields require Proxy (see https://www.npmjs.com/package/proxy-polyfill).')
            value = null;
        }
        if (value != this._calcFields) {

            // save the new value
            this._calcFields = value;

            // force refresh
            let srcRaw = this._srcRaw;
            this._srcRaw = null;
            this.sourceCollection = srcRaw;
        }
    }
    /**
     * Gets or sets a function that creates new items for the collection.
     *
     * If the creator function is not supplied, the {@link CollectionView}
     * will try to create an uninitialized item of the appropriate type.
     *
     * If the creator function is supplied, it should be a function that 
     * takes no parameters and returns an initialized object of the proper 
     * type for the collection.
     */
    get newItemCreator(): IItemCreator<T> {
        return this._itemCreator;
    }
    set newItemCreator(value: IItemCreator<T>) {
        this._itemCreator = wijmo.asFunction(value) as IItemCreator<T>;
    }
    /**
     * Gets or sets a function used to convert values when sorting.
     *
     * If provided, the function should take as parameters a 
     * {@link SortDescription}, a data item, and a value to convert,
     * and should return the converted value.
     *
     * This property provides a way to customize sorting. For example,
     * the {@link FlexGrid} control uses it to sort mapped columns by 
     * display value instead of by raw value.
     *
     * For example, the code below causes a {@link CollectionView} to
     * sort the 'country' property, which contains country code integers,
     * using the corresponding country names:
     *
     * ```typescript
     * const countries = 'US,Germany,UK,Japan,Italy,Greece'.split(',');
     * view.sortConverter = (sd: SortDescription, item: any, value: any) => {
     *     return sd.property === 'countryMapped'
     *         ? countries[value]; // convert country id into name
     *         : value;
     * }
     * ```
     * 
     * The next example combines two values so when sorting by country,
     * the view will break ties by city:
     * 
     * ```typescript
     * view.sortConverter: (sd: SortDescription, item: any, value: any) => {
     *     if (sd.property == 'country') {
     *         value = item.country + '\t' + item.city;
     *     }
     *     return value;
     * }
     * ```
     */
    get sortConverter(): ISortConverter {
        return this._srtCvt;
    }
    set sortConverter(value: ISortConverter) {
        if (value != this._srtCvt) {
            this._srtCvt = wijmo.asFunction(value, true) as ISortConverter;
        }
    }
    /**
     * Gets or sets a function used to compare values when sorting.
     *
     * If provided, the sort comparer function should take as parameters
     * two values of any type, and should return -1, 0, or +1 to indicate
     * whether the first value is smaller than, equal to, or greater than
     * the second. If the sort comparer returns null, the standard built-in
     * comparer is used.
     *
     * This {@link sortComparer} property allows you to use custom comparison
     * algorithms that in some cases result in sorting sequences that are
     * more consistent with user's expectations than plain string comparisons.
     *
     * For example, see
     * <a href="http://www.davekoelle.com/alphanum.html">Dave Koele's Alphanum algorithm</a>.
     * It breaks up strings into chunks composed of strings or numbers, then
     * sorts number chunks in value order and string chunks in ASCII order.
     * Dave calls the result a "natural sorting order".
     *
     * The example below shows a typical use for the {@link sortComparer} property:
     * 
     * ```typescript
     * import { CollectionView, isString } from '@grapecity/wijmo';
     * 
     * // create a CollectionView with a custom sort comparer
     * const view = new CollectionView(data, {
     *     sortComparer: (a: any, b: any) => {
     *         return isString(a) && isString(b)
     *             ? alphanum(a, b) // use custom comparer for strings
     *             : null; // use default comparer for everything else
     *     }
     * });
     * ```
     * 
     * The example below shows how you can use an 
     * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator">Intl.Collator</a>
     * to control the sort order:
     * 
     * ```typescript
     * import { CollectionView, isString } from '@grapecity/wijmo';
     * 
     * // create a CollectionView that uses an Intl.Collator to sort
     * const collator = window.Intl ? new Intl.Collator() : null;
     * let view = new CollectionView(data, {
     *     sortComparer: (a, b) => {
     *         return isString(a) && isString(b) && collator
     *             ? collator.compare(a, b) // use collator for strings
     *             : null; // use default comparer for everything else
     *     }
     * });
     * ```
     */
    get sortComparer(): IComparer<T> {
        return this._srtCmp;
    }
    set sortComparer(value: IComparer<T>) {
        if (value != this._srtCmp) {
            this._srtCmp = wijmo.asFunction(value, true) as IComparer<T>;
        }
    }
    /**
     * Gets or sets whether to use a stable sort algorithm.
     *
     * Stable sorting algorithms maintain the relative order of records with equal keys.
     * For example, consider a collection of objects with an "Amount" field. 
     * If you sort the collection by "Amount", a stable sort will keep the original
     * order of records with the same Amount value.
     * 
     * The default value for this property is **false**, which causes the 
     * {@link CollectionView} to use JavaScript's built-in sort method, which is fast
     * and usually stable.
     * 
     * Chrome provides stable sorting since version 70, and Firefox since version 3.
     * As of ES2019, sort is **required** to be stable. In ECMAScript 1st edition through
     * ES2018, it was allowed to be unstable.
     * 
     * Setting the {@link useStableSort} property to true ensures stable sorts on all 
     * browsers (even IE 11), but increases sort times by 30% to 50%.
     */
    get useStableSort(): boolean {
        return this._stableSort;
    }
    set useStableSort(value: boolean) {
        if (value != this._stableSort) {
            this._stableSort = wijmo.asBoolean(value);
            this.refresh();
        }
    }
    /**
     * Gets or sets a value that determines how null values should be sorted.
     * 
     * This property is set to **SortNulls.Last** by default, which causes null values 
     * to appear last on the sorted collection, regardless of sort direction.
     * This is also the default behavior in Excel.
     */
    get sortNulls(): SortNulls {
        return this._srtNulls;
    }
    set sortNulls(value: SortNulls) {
        value = wijmo.asEnum(value, SortNulls);
        if (value != this._srtNulls) {
            this._srtNulls = value;
            this.refresh();
        }
    }
    // deprecated...
    get sortNullsFirst(): boolean {
        return this.sortNulls != SortNulls.Last;
    }
    set sortNullsFirst(value: boolean) {
        wijmo._deprecated('sortNullsFirst', 'sortNulls');
        this.sortNulls = wijmo.asBoolean(value) ? SortNulls.First : SortNulls.Last;
    }
    /**
     * Calculates an aggregate value for the items in this collection.
     *
     * @param aggType Type of aggregate to calculate.
     * @param binding Property to aggregate on.
     * @param currentPage Whether to include only items on the current page.
     * @return The aggregate value.
     */
    getAggregate(aggType: wijmo.Aggregate, binding: string, currentPage?: boolean) {
        let items = currentPage ? this._pgView : this._view;
        return wijmo.getAggregate(aggType, items, binding);
    }
    /**
     * Gets or sets a value that determines whether the control should
     * track changes to the data.
     *
     * The default value for this property is **false**, so the {@link CollectionView} 
     * does not keep track of which data items have changed.
     * 
     * If you set this property to **true**, the {@link CollectionView} will keep
     * track of changes to the data and will expose them through the {@link itemsAdded},
     * {@link itemsRemoved}, and {@link itemsEdited} collections.
     *
     * Tracking changes is useful in situations where you need to update 
     * the server after the user has confirmed that the modifications are 
     * valid.
     *
     * After committing or cancelling changes, use the {@link clearChanges} method
     * to clear the {@link itemsAdded}, {@link itemsRemoved}, and {@link itemsEdited} 
     * collections.
     *
     * The {@link CollectionView} only tracks changes made when the proper 
     * {@link CollectionView} methods are used ({@link editItem}/{@link commitEdit}, 
     * {@link addNew}/{@link commitNew}, and {@link remove}). 
     * Changes made directly to the data are not tracked.
     */
    get trackChanges(): boolean {
        return this._trackChanges;
    }
    set trackChanges(value: boolean) {
        this._trackChanges = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets a value that determines whether the {@link CollectionView} 
     * should automatically refresh its results (by applying the sort, filter,
     * and grouping operations) after items are edited.
     * 
     * The default value for this property is **true**, which ensures the 
     * collection is always sorted, filtered, and grouped correctly after any
     * edit operations.
     * 
     * Set it to **false** if you want updates to be deferred when items 
     * are edited. In this case, the collection will not be refreshed until 
     * the sorting, filtering, and grouping criteria change or until the 
     * {@link refresh} method is called (Excel behavior).
     */
    get refreshOnEdit(): boolean {
        return this._refreshOnEdit;
    }
    set refreshOnEdit(value: boolean) {
        this._refreshOnEdit = wijmo.asBoolean(value);
    }
    /** 
     * Gets an {@link ObservableArray} containing the records that were added to
     * the collection since {@link trackChanges} was enabled.
     */
    get itemsAdded(): ObservableArray {
        return this._chgAdded;
    }
    /** 
     * Gets an {@link ObservableArray} containing the records that were removed from
     * the collection since {@link trackChanges} was enabled.
     */
    get itemsRemoved(): ObservableArray {
        return this._chgRemoved;
    }
    /** 
     * Gets an {@link ObservableArray} containing the records that were edited in
     * the collection since {@link trackChanges} was enabled.
     */
    get itemsEdited(): ObservableArray {
        return this._chgEdited;
    }
    /**
     * Clears all changes by removing all items in the {@link itemsAdded}, 
     * {@link itemsRemoved}, and {@link itemsEdited} collections.
     *
     * Call this method after committing changes to the server or 
     * after refreshing the data from the server.
     */
    clearChanges() {
        this._chgAdded.clear();
        this._chgRemoved.clear();
        this._chgEdited.clear();
        if (this._orgVals) {
            this._orgVals.clear();
        }
    }

    // ** IQueryInterface

    /**
     * Returns true if this object supports a given interface.
     *
     * @param interfaceName Name of the interface to look for.
     */
    implementsInterface(interfaceName: string): boolean {
        switch (interfaceName) {
            case 'ICollectionView':
            case 'IEditableCollectionView':
            case 'IPagedCollectionView':
            case 'INotifyCollectionChanged':
                return true;
        }
        return false;
    }

    // ** INotifyDataErrorInfo

    /**
     * Gets or sets a callback that determines whether a specific property
     * of an item contains validation errors.
     *
     * The method takes as parameters a data item, the property being validated,
     * and a parsing parameter that describes whether the data has already been
     * parsed and applied to the data item (parsing == false), or whether the user 
     * was trying to edit the value and entered a value that could not be parsed
     * into the data type expected (parsing == true).
     * 
     * The method returns a string containing an error message, or null if no
     * errors were detected.
     * 
     * For example, 
     * 
     * ```typescript
     * view = new CollectionView(data, {
     *     getError: (item: any, prop: string, parsing: boolean) => {
     * 
     *         // parsing failed, show message
     *         if (parsing) {
     *             if (prop == 'date') {
     *                 return 'Please enter a valid date in the format "MM/dd/yyyy"';
     *             } else if (prop == 'id') {
     *                 return 'Please enter a positive number';
     *             }
     *         }
     * 
     *         // check that stored (parsed) data is valid
     *         if (prop == 'date' && item.date < minDate) {
     *             return 'Please enter a date after ' + Globalize.formatDate(minDate, 'd');
     *         } else if (prop == 'id' && item.id < 0) {
     *             return 'Please enter a positive number';
     *         }
     *     }
     * });
     * ```
     */
    get getError(): IGetError | null {
        return this._getError;
    }
    set getError(value: IGetError | null) {
        if (this._getError != value) {
            this._getError = wijmo.asFunction(value) as IGetError;
            this._raiseCollectionChanged(); // TFS 299026
        }
    }

    // ** INotifyCollectionChanged

    /**
     * Occurs when the collection changes.
     */
    readonly collectionChanged = new wijmo.Event<ICollectionView<T>, NotifyCollectionChangedEventArgs<T>>();
    /**
     * Raises the {@link collectionChanged} event.
     *
     * @param e Contains a description of the change.
     */
    onCollectionChanged(e = NotifyCollectionChangedEventArgs.reset) {

        // track changes applied to items outside of edit/add/commitEdit blocks (TFS 204805, 264395)
        if (e.action == NotifyCollectionChangedAction.Change &&
            !this._committing && !this._canceling &&
            e.item != this.currentEditItem &&
            e.item != this.currentAddItem) {
            this._trackItemChanged(e.item);
        }

        // if not updating, raise the event as usual (TFS 402474)
        if (!this._updating) {
            this.collectionChanged.raise(this, e);
        }
    }

    // creates event args and calls onCollectionChanged
    protected _raiseCollectionChanged(action = NotifyCollectionChangedAction.Reset, item?: T, index?: number): void {
        let e = new NotifyCollectionChangedEventArgs<T>(action, item, index);
        this.onCollectionChanged(e);
    }

    // notify of changes to an item
    //protected _raiseItemChanged(item: T): void {
    //    let index = this.items.indexOf(item),
    //        e = new NotifyCollectionChangedEventArgs<T>(NotifyCollectionChangedAction.Change, item, index);
    //    this.onCollectionChanged(e);
    //}

    /**
     * Occurs before the value of the {@link sourceCollection} property changes.
     */
    readonly sourceCollectionChanging = new wijmo.Event<ICollectionView<T>, wijmo.CancelEventArgs>();
    /**
     * Raises the {@link sourceCollectionChanging} event.
     *
     * @param e {@link CancelEventArgs} that contains the event data.
     */
    onSourceCollectionChanging(e: wijmo.CancelEventArgs): boolean {
        this.sourceCollectionChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Occurs after the value of the {@link sourceCollection} property changes.
     */
    readonly sourceCollectionChanged = new wijmo.Event<ICollectionView<T>, wijmo.EventArgs>();
    /**
     * Raises the {@link sourceCollectionChanged} event.
     */
    onSourceCollectionChanged(e?: wijmo.EventArgs) {
        this.sourceCollectionChanged.raise(this, e);
    }

    // ** ICollectionView

    /**
     * Gets a value that indicates whether this view supports filtering via the 
     * {@link filter} property.
     * 
     * This property does not affect the {@link filters} property, which are
     * always applied.
     */
    get canFilter(): boolean {
        return this._canFilter;
    }
    set canFilter(value: boolean) {
        this._canFilter = wijmo.asBoolean(value);
    }
    /**
     * Gets a value that indicates whether this view supports grouping via the 
     * {@link groupDescriptions} property.
     */
    get canGroup(): boolean {
        return this._canGroup;
    }
    set canGroup(value: boolean) {
        this._canGroup = wijmo.asBoolean(value);
    }
    /**
     * Gets a value that indicates whether this view supports sorting via the 
     * {@link sortDescriptions} property.
     */
    get canSort(): boolean {
        return this._canSort;
    }
    set canSort(value: boolean) {
        this._canSort = wijmo.asBoolean(value);
    }
    /**
     * Gets or sets the current item in the view.
     */
    get currentItem(): T {
        return this._pgView && this._idx > -1 && this._idx < this._pgView.length
            ? this._pgView[this._idx]
            : null;
    }
    set currentItem(value: T) {
        this.moveCurrentTo(value);
    }
    /**
     * Gets the ordinal position of the current item in the view.
     */
    get currentPosition(): number {
        return this._idx;
    }
    set currentPosition(value: number) {
        this.moveCurrentToPosition(wijmo.asNumber(value));
    }
    /**
     * Gets or sets a callback used to determine if an item is suitable for 
     * inclusion in the view.
     *
     * The callback should return true if the item passed in as a parameter
     * should be included in the view.
     * 
     * The default value for this property is **null**, which means the
     * data is not filtered.
     */
    get filter(): IPredicate | null {
        return this._filter;
    }
    set filter(value: IPredicate | null) {
        if (this._filter != value) {
            this._filter = wijmo.asFunction(value) as IPredicate;
            if (this.canFilter) {
                this.refresh();
            }
        }
    }
    /**
     * Gets an array of {@link IPredicate} functions used as filters
     * on this {@link CollectionView}.
     * 
     * To be included in the view, an item has to pass the predicate
     * in the {@link filter} property as well as all predicates in
     * the {@link filters} collection.
     */
    get filters(): ObservableArray<IPredicate> {
        return this._filters;
    }
    /**
     * Gets a collection of {@link GroupDescription} objects that describe how the 
     * items in the collection are grouped in the view.
     */
    get groupDescriptions(): ObservableArray<GroupDescription> {
        return this._grpDesc;
    }
    /**
     * Gets an array of {@link CollectionViewGroup} objects that represents the 
     * top-level groups.
     */
    get groups(): CollectionViewGroup[] {
        return this._groups;
    }
    /**
     * Gets a value that indicates whether this view contains no items.
     */
    get isEmpty(): boolean {
        return !this._pgView || !this._pgView.length;
    }
    /**
     * Gets an array of {@link SortDescription} objects that describe how the items 
     * in the collection are sorted in the view.
     */
    get sortDescriptions(): ObservableArray<SortDescription> {
        return this._srtDsc;
    }
    /**
     * Gets or sets the underlying (unfiltered and unsorted) collection.
     */
    get sourceCollection(): any {
        return this._src;
    }
    set sourceCollection(value: any) {
        if (value != this._srcRaw) {

            // raise changing event
            if (!this.onSourceCollectionChanging(new wijmo.CancelEventArgs())) {
                return;
            }

            // keep track of current index
            let index = this.currentPosition;

            // commit pending changes
            this.commitEdit();

            // disconnect old source
            if (this._ncc != null) {
                this._ncc.collectionChanged.removeHandler(this._sourceChanged);
            }

            // connect new source
            this._srcRaw = value;
            this._src = wijmo.asArray(value, false);
            if (this._calcFields) {
                this._src = wijmo._getCalculatedArray(this._src, this._calcFields);
            }
            this._ncc = wijmo.tryCast(this._src, 'INotifyCollectionChanged') as INotifyCollectionChanged;
            if (this._ncc) {
                this._ncc.collectionChanged.addHandler(this._sourceChanged, this);
            }

            // clear any changes
            this.clearChanges();

            // refresh view
            this.refresh();
            this.moveCurrentToFirst();

            // raise changed event
            this.onSourceCollectionChanged();

            // if we have no items, notify listeners that the current index changed
            if (this.currentPosition < 0 && index > -1) {
                this.onCurrentChanged();
            }
        }
    }
    // handle notifications from the source collection
    private _sourceChanged(s: INotifyCollectionChanged, e: NotifyCollectionChangedEventArgs<T>) {
        if (this._updating <= 0) {
            this.refresh(); // TODO: optimize
        }
    }
    /**
     * Returns a value indicating whether a given item belongs to this view.
     *
     * @param item Item to seek.
     */
    contains(item: T): boolean {
        return this._pgView.indexOf(item) > -1;
    }
    /**
     * Sets the specified item to be the current item in the view.
     *
     * @param item Item that will become current.
     */
    moveCurrentTo(item: T): boolean {
        return this.moveCurrentToPosition(this._pgView.indexOf(item));
    }
    /**
     * Sets the first item in the view as the current item.
     */
    moveCurrentToFirst(): boolean {
        return this.moveCurrentToPosition(0);
    }
    /**
     * Sets the last item in the view as the current item.
     */
    moveCurrentToLast(): boolean {
        return this.moveCurrentToPosition(this._pgView.length - 1);
    }
    /**
     * Sets the item before the current item in the view as the current item.
     */
    moveCurrentToPrevious(): boolean {
        return this._idx > 0 ?
            this.moveCurrentToPosition(this._idx - 1)
            : false;
    }
    /**
     * Sets the item after the current item in the view as the current item.
     */
    moveCurrentToNext(): boolean {
        return this.moveCurrentToPosition(this._idx + 1);
    }
    /**
     * Sets the item at the specified index in the view as the current item.
     *
     * @param index Index of the item that will become current.
     */
    moveCurrentToPosition(index: number): boolean {
        if (index >= -1 && index < this._pgView.length && index != this._idx) {
            let e = new wijmo.CancelEventArgs();
            if (this.onCurrentChanging(e)) {

                // commit when moving away from current edit/new item
                let item = this._pgView[index],
                    target = wijmo._getTargetObject(item),
                    edtItem = this._edtItem,
                    newItem = this._newItem;
                if (edtItem && edtItem != item && edtItem != target) {
                    this.commitEdit();
                } else if (newItem && newItem != item && newItem != target) {
                    this.commitNew();
                }

                // update currency
                this._idx = index;
                this.onCurrentChanged();
            }
        }
        return this._idx == index;
    }
    /**
     * Re-creates the view using the current sort, filter, and group parameters.
     */
    refresh(): void {

        // not while adding/editing/updating
        if (this._newItem || this._edtItem || this._updating > 0) { 
            this._pendingRefresh = true;
        } else { 

            // remember current item before the refresh
            let current = this.currentItem;
            this._performRefresh();
            this.onCollectionChanged();

            // raise currentChanged after filtering the current item out of view
            // but not while initializing the CollectionView (TFS 467091)
            if (current != this.currentItem && !this._initializing) {
                this.onCurrentChanged(); 
            }
        }
    }

    // commit any pending edits/adds and fully refresh the view
    _commitAndRefresh() {
        if (this.currentEditItem || this.currentAddItem) {
            this._pendingRefresh = true; // TFS 318475
            this.commitEdit();
        } else {
            this.refresh();
        }
    }

    // perform the refresh (without issuing notifications)
    _performRefresh(): void {

        // not while updating...
        if (this._updating > 0) {
            this._pendingRefresh = true; // TFS 403947
            return;
        }

        // benchmark
        //let start = new Date();

        // no more pending refreshes/deletes
        this._pendingRefresh = false;
        this._pendingRemove = false;

        // save current item
        let current = this.currentItem;

        // apply filter
        this._view = this._src
            ? this._performFilter(this._src)
            : []; // no source: empty view

        // apply sort
        if (this.canSort && this._srtDsc.length > 0) {
            if (this._view == this._src) {
                this._view = this._src.slice();
            }
            this._performSort(this._view);
        }

        // apply grouping
        this._groups = this.canGroup ? this._createGroups(this._view) : null;
        this._fullGroups = this._groups;
        if (this._groups) {
            this._view = this._mergeGroupItems(this._groups);
        }

        // apply paging
        this._pgIdx = wijmo.clamp(this._pgIdx, 0, this.pageCount - 1);
        this._pgView = this._getPageView();

        // update groups to take paging into account
        if (this._groups && this.pageCount > 1) {
            this._groups = this._createGroups(this._pgView);
            this._mergeGroupItems(this._groups);
        }

        // update index to keep the current item or index
        let index = this._keepCurrentItem && current != null
            ? this._pgView.indexOf(current) // keep current item
            : -1; // keep current index
        if (index < 0) {
            index = Math.min(this._idx, this._pgView.length - 1);
        }
        this._idx = index;

        // save group digest to optimize updates (TFS 109119)
        this._digest = this._getGroupsDigest(this.groups);

        //let now = new Date();
        //console.log('refreshed in ' + (now.getTime() - start.getTime()) / 1000 + ' seconds');
    }

    // sorts an array in-place using the current sort descriptions
    _performSort(items: any[]): void {

        // stable sort: nice but 30-50% slower than normal sort
        // https://bugs.chromium.org/p/v8/issues/detail?id=90
        // note: all modern browsers now provide stable sorting by default (IE is the exception).
        if (this._stableSort) {
            let arrIndexed = items.map((item, index) => { return { item: item, index: index } }),
                compare = this._compareItems();
            arrIndexed.sort((a, b) => {
                let r = compare(a.item, b.item);
                return r == 0 ? a.index - b.index : r;
            });
            for (let i = 0; i < items.length; i++) {
                items[i] = arrIndexed[i].item;
            }
        } else {
            items.sort(this._compareItems()); // normal sort
        }
    }

    // this function is used in some of our samples, so
    // if we remove it or change its name some things will break...
    _compareItems() {
        let srtDsc = this._srtDsc,
            srtCvt = this._srtCvt,
            srtCmp = this._srtCmp,
            collator = CollectionView._collator,
            init = true,
            cmp = 0;
        return (a: any, b: any) => {
            for (let i = 0; i < srtDsc.length; i++) {

                // get values
                let sd = srtDsc[i] as SortDescription,
                    v1 = sd._bnd.getValue(a),
                    v2 = sd._bnd.getValue(b);

                // custom converter function (before changing case! TFS 149638)
                if (srtCvt) {
                    v1 = srtCvt(sd, a, v1, init);
                    v2 = srtCvt(sd, b, v2, false);
                    init = false;
                }

                // custom comparison function (TFS 151665)
                if (srtCmp) {
                    cmp = srtCmp(v1, v2);
                    if (cmp != null) { // use custom function result
                        if (cmp != 0) { // done if not equal
                            return sd.ascending ? +cmp : -cmp;
                        }
                        continue; // equal, continue to the next SortDescription (TFS 402256)
                    }
                }

                // check for NaN (isNaN returns true for NaN but also for non-numbers)
                if (v1 !== v1) v1 = null;
                if (v2 !== v2) v2 = null;

                // nulls are special: by default, always at the bottom like excel (TFS 414491)
                if (v1 !== v2 && (v1 == null || v2 == null)) { // one (and only one) of the values is null
                    switch (this._srtNulls) {
                        case SortNulls.First: // nulls come first
                            return v1 == null ? -1 : +1;
                        case SortNulls.Last: // nulls come last
                            return v1 == null ? +1 : -1;
                        default: // nulls come first or last, depending on sort order
                            cmp = v1 == null ? -1 : +1;
                            return sd.ascending ? +cmp : -cmp;
                    }
                }

                // strings are special
                if (typeof (v1) === 'string' && typeof (v2) === 'string') {

                    // use collator if available (fast and handles diacritics)
                    if (collator) {
                        cmp = collator.compare(v1, v2);
                        if (cmp != 0) {
                            return sd.ascending ? +cmp : -cmp;
                        }
                        continue;
                    }

                    // ignore case when sorting unless the values are strings that only 
                    // differ in case (to keep the sort consistent, TFS 131135)
                    let lc1 = v1.toLowerCase(),
                        lc2 = v2.toLowerCase();
                    if (lc1 != lc2) {
                        v1 = lc1;
                        v2 = lc2;
                    }
                }

                // compare the values (at last!)
                cmp = (v1 < v2) ? -1 : (v1 > v2) ? +1 : 0;
                if (cmp != 0) {
                    return sd.ascending ? +cmp : -cmp;
                }
            }
            return 0;
        }
    }

    // returns an array filtered using the current filter definition
    _performFilter(items: any[]): any[] {
        return ((this.canFilter && this._filter) || this._filters.length)
            ? items.filter(this._filterItem, this)
            : items;
    }

    // applies the 'filter' and 'filters' predicates to an item
    _filterItem(item: any): boolean {

        // apply main filter
        var value = this.canFilter && this._filter
            ? this._filter(item)
            : true;
        
        // apply extra filters (regardless of the setting of the canFilter property)
        for (let i = 0; i < this._filters.length && value; i++) {
            value = this._filters[i](item);
        }

        // done
        return value;
    }

    /**
     * Occurs after the current item changes.
     */
    readonly currentChanged = new wijmo.Event<ICollectionView<T>, wijmo.EventArgs>();
    /**
     * Raises the {@link currentChanged} event.
     */
    onCurrentChanged(e?: wijmo.EventArgs) {
        this.currentChanged.raise(this, e);
    }
    /**
     * Occurs before the current item changes.
     */
    readonly currentChanging = new wijmo.Event<ICollectionView<T>, wijmo.CancelEventArgs>();
    /**
     * Raises the {@link currentChanging} event.
     *
     * @param e {@link CancelEventArgs} that contains the event data.
     */
    onCurrentChanging(e: wijmo.CancelEventArgs): boolean {
        this.currentChanging.raise(this, e);
        return !e.cancel;
    }
    /**
     * Gets items in the view.
     */
    get items(): T[] {
        return this._pgView;
    }
    /**
     * Suspend refreshes until the next call to {@link endUpdate}.
     */
    beginUpdate() {
        this._updating++;
    }
    /**
     * Resume refreshes suspended by a call to {@link beginUpdate}.
     * 
     * @param force Whether to force a refresh when ending the update. 
     */
    endUpdate(force = true) {
        this._updating--;
        if (force) { // TFS 408286
            this._pendingRefresh = true;
        }
        if (this._updating <= 0) {
            if (this._pendingRefresh) {
                this.refresh();
            }
            if (this._pendingRemove) { // TFS 439324
                this._pendingRemove = false;
                this._raiseCollectionChanged();
            }
        }
    }
    /**
     * Gets a value that indicates whether notifications are currently suspended
     * (see {@link beginUpdate} and {@link endUpdate}).
     */
    get isUpdating() {
        return this._updating > 0;
    }
    /**
     * Executes a function within a {@link beginUpdate}/{@link endUpdate} block.
     *
     * The collection will not be refreshed until the function finishes. 
     * 
     * The {@link deferUpdate} method ensures {@link endUpdate} is called even 
     * if the update function throws an exception.
     *
     * @param fn Function to be executed without updates. 
     * @param force Whether to force a refresh when ending the update. 
     */
    deferUpdate(fn: Function, force = true) {
        try {
            this.beginUpdate();
            fn();
        } finally {
            this.endUpdate(force);
        }
    }

    // ** IEditableCollectionView

    /**
     * Gets a value that indicates whether a new item can be added to the collection.
     */
    get canAddNew(): boolean {
        return this._canAddNew;
    }
    set canAddNew(value: boolean) {
        if (value != this._canAddNew) {
            this._canAddNew = wijmo.asBoolean(value);
            this._raiseCollectionChanged(); // update new row template, if any
        }
    }
    /**
     * Gets a value that indicates whether the collection view can discard pending changes 
     * and restore the original values of an edited object.
     */
    get canCancelEdit(): boolean {
        return this._canCancelEdit;
    }
    set canCancelEdit(value: boolean) {
        this._canCancelEdit = wijmo.asBoolean(value);
    }
    /**
     * Gets a value that indicates whether items can be removed from the collection.
     */
    get canRemove(): boolean {
        return this._canRemove;
    }
    set canRemove(value: boolean) {
        this._canRemove = wijmo.asBoolean(value);
    }
    /**
     * Gets the item that is being added during the current add transaction.
     */
    get currentAddItem(): T {
        return this._newItem;
    }
    /**
     * Gets the item that is being edited during the current edit transaction.
     */
    get currentEditItem(): T {
        return this._edtItem;
    }
    /**
     * Gets a value that indicates whether an add transaction is in progress.
     */
    get isAddingNew(): boolean {
        return this._newItem != null;
    }
    /**
     * Gets a value that indicates whether an edit transaction is in progress.
     */
    get isEditingItem(): boolean {
        return this._edtItem != null;
    }
    /**
     * Begins an edit transaction of the specified item.
     *
     * @param item Item to be edited.
     */
    editItem(item: T) {

        // commit pending changes if not already editing/adding this item
        if (item != this._edtItem && this.moveCurrentTo(item)) {
            this.commitEdit();
            this._edtItem = item;
            this._edtClone = this._extend({}, this._edtItem);
        }
    }
    /**
     * Ends the current edit transaction and saves the pending changes.
     */
    commitEdit(): void {

        // get current edit item and its clone (TFS 328731)
        let item = this._edtItem,
            clone = this._edtClone;
        if (item != null) {

            // start committing
            this._committing = true;

            // check if anything really changed
            let changedFields = this._getChangedFields(item, clone),
                pendingRefresh = this._pendingRefresh;

            // clean up state
            this._edtItem = null;
            this._edtClone = null;

            // refresh to update the edited item
            let index = this._pgView.indexOf(item),
                digest = this._digest;
            if (this._needRefresh(changedFields) && this._refreshOnEdit) {
                this._performRefresh();
            }

            // track changes (before notifying)
            if (changedFields) {
                this._trackItemChanged(item, clone);
            }

            // notify (single item change or full refresh)
            if (this._pgView.indexOf(item) == index && digest == this._digest && !pendingRefresh) {
                this._raiseCollectionChanged(NotifyCollectionChangedAction.Change, item, index);
            } else {
                this._raiseCollectionChanged(); // full refresh
            }

            // commit new if any (TFS 324596)
            this.commitNew();

            // done committing
            this._committing = false;

            // raise collectionChanged on observable source array
            if (this.sourceCollection instanceof ObservableArray) {
                this._updating++;
                let e = new NotifyCollectionChangedEventArgs<T>(NotifyCollectionChangedAction.Change, item);
                this.sourceCollection.onCollectionChanged(e);
                this._updating--;
            }
        }
    }
    /**
     * Ends the current edit transaction and, if possible, 
     * restores the original value to the item.
     */
    cancelEdit(): void {
        let item = this._edtItem;
        if (item != null) {
            this._edtItem = null;

            // honor canCancelEdit
            if (!this.canCancelEdit) {
                //assert(false, 'cannot cancel edits.');
                return;
            }

            // check that we can do this (TFS 110168)
            let index = this._src.indexOf(item);
            if (index >= 0 && this._edtClone) {

                // restore original item value
                this._extend(this._src[index], this._edtClone);
                this._edtClone = null;

                // notify listeners
                this._canceling = true;
                this._raiseCollectionChanged(NotifyCollectionChangedAction.Change, item, index);
                this._canceling = false;

                // handle pending refreshes (TFS 257894)
                if (this._pendingRefresh && this._refreshOnEdit) {
                    this._performRefresh();
                    this._raiseCollectionChanged();
                }
            }
        }
    }
    /**
     * Adds a new item to the collection.
     *
     * Calling this methods without any parameters creates a new item, adds it to the
     * collection, and defers refresh operations until the new item is committed using
     * the {@link commitNew} method or canceled using the {@link cancelNew} method.
     *
     * The code below shows how the {@link addNew} method is typically used:
     *
     * ```typescript
     * // create the new item, add it to the collection
     * var newItem = view.addNew();
     * 
     * // initialize the new item
     * newItem.id = getFreshId();
     * newItem.name = 'New Customer';
     * 
     * // commit the new item so the view can be refreshed
     * view.commitNew();
     * ```
     *
     * You can also add new items by pushing them into the {@link sourceCollection}
     * and then calling the {@link refresh} method. The main advantage of {@link addNew}
     * is in user-interactive scenarios (like adding new items in a data grid),
     * because it gives users the ability to cancel the add operation. It also
     * prevents the new item from being sorted or filtered out of view until the 
     * transaction is committed.
     * 
     * New items are empty objects by default, unless the colletion has
     * {@link calculatedFields}, in which case the new items will have properties
     * set to values that depend on their data types (empty strings for string
     * properties, zero for numeric properties, and null for other data types).
     * 
     * This behavior is convenient since in many cases the calculated fields 
     * depend on expressions that rely on strings not being null. But you can
     * customize this behavior by setting the {@link newItemCreator} property
     * to a function that creates the new items and initializes them in any
     * way you want.
     *
     * @param item Item to be added to the collection (optional).
     * @param commit Whether to commit the new item immediately.
     * @return The item that was added to the collection, or null if the transaction 
     * failed.
     */
    addNew(item?: T, commit = false): T {

        // commit pending changes
        this.commitEdit();

        // honor canAddNew
        if (!this.canAddNew) {
            //assert(false, 'cannot add items.');
            return null;
        }

        // create the new item
        let src = this.sourceCollection;
        if (item == null) {
            if (this.newItemCreator) {
                item = this.newItemCreator();
            } else if (src && src.length) {
                item = new src[0].constructor();
            } else {
                item = {} as T;
            }
        }

        // add it to the collection
        if (item != null) {

            // add the new item to the collection
            this._updating++;
            src.push(item); // **
            this._updating--;

            // take item from sourceCollection as it can be modified after addition
            // (for example by vue3 reactive Proxy)
            item = src[src.length - 1];

            // remember the new item
            this._newItem = item;

            // add the new item to the bottom of the current view
            if (this._pgView != this._src) {
                this._pgView.push(item);
            }

            // add the new item to the last group and to the data items
            if (this.groups && this.groups.length) {
                let g = this.groups[this.groups.length - 1];
                g.items.push(item);
                while (g.groups && g.groups.length) {
                    g = g.groups[g.groups.length - 1];
                    g.items.push(item);
                }
            }

            // notify listeners
            this._raiseCollectionChanged(NotifyCollectionChangedAction.Add, item, this._pgView.length - 1);

            // select the new item
            this.moveCurrentTo(item);

            // commit new item immediately
            if (commit) {
                this.commitNew();
            }
        }

        // done
        return this._newItem;
    }
    /**
     * Ends the current add transaction and saves the pending new item.
     */
    commitNew(): void {
        let item = this._newItem;
        if (item != null) {

            // clean up state
            this._newItem = null;

            // refresh to update the new item
            let index = this._pgView.indexOf(item),
                digest = this._digest;
            if (this._refreshOnEdit) {
                this._performRefresh();
            }

            // track changes (before notifying)
            if (this._trackChanges) {
                let idx = this._chgEdited.indexOf(item);
                if (idx > -1) { // remove from changed if it's there
                    this._chgEdited.removeAt(idx);
                }
                if (this._chgAdded.indexOf(item) < 0) { // add to added if not there
                    this._chgAdded.push(item);
                }
            }

            // notify (full refresh if the item moved or if we have calculated fields: TFS 458999)
            if (this._pgView.indexOf(item) == index && digest == this._digest && !this.calculatedFields) {
                this._raiseCollectionChanged(NotifyCollectionChangedAction.Change, item, index);
            } else {
                this._raiseCollectionChanged(); // full refresh
            }
        }
    }
    /**
     * Ends the current add transaction and discards the pending new item.
     */
    cancelNew(): void {
        let item = this._newItem;
        if (item != null) {
            this.remove(item);
        }
    }
    /**
     * Removes the specified item from the collection.
     *
     * @param item Item to be removed from the collection.
     */
    remove(item: T): void {

        // handle cases where the user is adding or editing items
        let pendingNew = (item == this._newItem);
        if (pendingNew) {
            this._newItem = null;
        }
        if (item == this._edtItem) {
            this.cancelEdit();
        }

        // honor canRemove
        if (!this.canRemove) {
            //assert(false, 'cannot remove items.');
            return;
        }

        // find item
        let index = this._src.indexOf(item);
        if (index > -1) {

            // get current item to notify later
            let current = this.currentItem;

            // remove item from source collection
            this._updating++;
            this._src.splice(index, 1); // **
            this._updating--;

            // refresh to update the removed item
            let digest = this._digest;
            if (this._refreshOnEdit) {
                this._performRefresh();
            } else {
                if (this._updating > 0) { // remember this so we can notify later (TFS 439324)
                    this._pendingRemove = true;
                }
                let index = this._pgView.indexOf(item); // remove item from view without refreshing (TFS 408418)
                if (index >= 0) {
                    this._pgView.splice(index, 1);
                }
            }

            // track changes (before notifying)
            if (this._trackChanges) {

                // removing something that was added
                let idxAdded = this._chgAdded.indexOf(item);
                if (idxAdded > -1) {
                    this._chgAdded.removeAt(idxAdded);
                }

                // removing something that was edited
                let idxEdited = this._chgEdited.indexOf(item);
                if (idxEdited > -1) {
                    this._chgEdited.removeAt(idxEdited);
                }

                // add to removed list unless it was pending and not added in this session
                let idxRemoved = this._chgRemoved.indexOf(item);
                if (idxRemoved < 0 && !pendingNew && idxAdded < 0) {
                    this._chgRemoved.push(item);
                }

                // item is gone, but keep original value
                // in case the remove action is undone
                //if (this._orgVals) {
                //    this._orgVals.delete(item);
                //}
            }

            // notify (item removed or full refresh) (TFS 85001)
            let sorted = this.sortDescriptions.length > 0, // JavaScript sort is not stable...
                paged = this.pageSize > 0 && this._pgIdx > -1;
            if (sorted || paged || digest != this._getGroupsDigest(this.groups)) {
                this._raiseCollectionChanged();
            } else {
                this._raiseCollectionChanged(NotifyCollectionChangedAction.Remove, item, index);
            }

            // raise currentChanged if needed
            if (this.currentItem !== current) {
                this.onCurrentChanged();
            }
        }
    }
    /**
     * Removes the item at the specified index from the collection.
     *
     * @param index Index of the item to be removed from the collection.
     * The index is relative to the view, not to the source collection.
     */
    removeAt(index: number): void {
        index = wijmo.asInt(index);
        this.remove(this._pgView[index]);
    }

    // track changes applied to an item (not necessarily the current edit item)
    _trackItemChanged(item: T, clone?: any): void {
        if (this._trackChanges) {

            // make sure the item is in the collection (TFS 256563)
            let items = this.sourceCollection;
            if (items && items.indexOf(item) > -1) {

                // get/save the item's original value
                let orgVals = this._orgVals,
                    orgVal = orgVals ? orgVals.get(item) : null;
                if (clone && !orgVal && orgVals) {
                    orgVals.set(item, clone);
                    orgVal = clone;
                }

                // get the item's index in the edited collection                
                let idx = this._chgEdited.indexOf(item),
                    chg = NotifyCollectionChangedAction.Change;

                // remove item from changed list if content == original value
                let sameContent = orgVal && this._sameContent(item, orgVal);
                if (sameContent && idx > -1) {
                    this._chgEdited.removeAt(idx);
                    orgVals.delete(item);
                    return;
                }
                
                // if not on edited/added lists, add to edited list
                if (idx < 0 && this._chgAdded.indexOf(item) < 0) {
                    this._chgEdited.push(item);
                } else if (idx > -1) { // if already on edited list, notify of change
                    let e = new NotifyCollectionChangedEventArgs<T>(chg, item, idx);
                    this._chgEdited.onCollectionChanged(e);
                } else { // if already on added list, notify of change
                    idx = this._chgAdded.indexOf(item);
                    if (idx > -1) { 
                        let e = new NotifyCollectionChangedEventArgs<T>(chg, item, idx);
                        this._chgAdded.onCollectionChanged(e);
                    }
                }
            }
        }
    }

    // extends an object (two levels deep by default)
    _extend(dst: any, src: any, level = _OBJ_DEPTH): any {
        for (let key in src) {
            try {
                let val = src[key];
                if (level > 0 && wijmo.isObject(val)) { // TFS 442474, 472553
                    dst[key] = {};
                    this._extend(dst[key], val, level - 1);
                } else {
                    dst[key] = val;
                }
            } catch (x) { } // failed to read src[key] // TFS 442711
        }
        return dst;
    }

    // gets a list of the fields that have differences
    // with level parameter to avoid circular references
    _getChangedFields(dst: any, src: any, level = _OBJ_DEPTH): string[] | null {
        wijmo.assert(src != null && dst != null, 'Two objects expected.'); // TFS 328731
        let changes = {};
        for (let key in src) {
            try {
                if (!this._sameValue(dst[key], src[key], level)) {
                    changes[key] = true;
                }
            } catch (x) { } // failed to read src[key] // TFS 442711
        }
        for (let key in dst) {
            try {
                if (!changes[key] && !this._sameValue(dst[key], src[key], level)) {
                    changes[key] = true;
                }
            } catch (x) { } // failed to read src[key] // TFS 442711
        }
        let keys = Object.keys(changes);
        return keys.length ? keys : null;
    }

    // checks whether two values are the same
    // with level parameter to avoid circular references
    _sameValue(v1: any, v2: any, level = _OBJ_DEPTH): boolean {
        if (v1 === v2 || wijmo.DateTime.equals(v1, v2)) { // value comparison
            return true;
        };
        if (wijmo.isObject(v1) && wijmo.isObject(v2)) { // object comparison: TFS 442474
            return level > 0 // TFS 472553
                ? this._getChangedFields(v1, v2, level - 1) == null
                : true;
        }
        return false; // not the same...
    }

    // checks whether two objects have the same content
    _sameContent(dst: any, src: any): boolean {
        return this._getChangedFields(dst, src) == null;
    }

    // checks whether a refresh is needed after an item change
    _needRefresh(changedFields: string[]): boolean {

        // pending refreshes? do it now (TFS 418294)
        if (this._pendingRefresh) {
            return true;
        }

        // no changes? no need to refresh
        if (!changedFields) {
            return false;
        }

        // filtering?
        if (this._filter) {
            return true;
        }

        // changed a sort field?
        for (let i = 0; i < this._srtDsc.length; i++) {
            let prop = this._getBindingRoot(this._srtDsc[i].property); // TFS 429745
            if (changedFields.indexOf(prop) > -1) {
                return true;
            }
        }

        // changed a grouping property? 
        for (let i = 0; i < this._grpDesc.length; i++) {
            let gd = this._grpDesc[i];
            if (!(gd instanceof PropertyGroupDescription)) {
                return true;
            }
            let prop = this._getBindingRoot(gd.propertyName); // TFS 429745
            if (changedFields.indexOf(prop) > -1) {
                return true;
            }
        }

        // doesn't look like a refresh is needed
        return false;
    }

    // gets a 'root' property name (accounting for deep bindings)
    _getBindingRoot(name: string): string {
        let index = name.indexOf('.');
        return index > -1
            ? name.substr(0, index)
            : name
    }

    // ** IPagedCollectionView

    /**
     * Gets a value that indicates whether the {@link pageIndex} value can change.
     */
    get canChangePage(): boolean {
        return this._canChangePage;
    }
    set canChangePage(value: boolean) {
        this._canChangePage = wijmo.asBoolean(value);
    }
    /**
     * Gets a value that indicates whether the page index is changing.
     */
    get isPageChanging(): boolean {
        return false;
    }
    /**
     * Gets the total number of items in the view taking paging into account.
     */
    get itemCount(): number {
        return this._pgView.length;
    }
    /**
     * Gets the zero-based index of the current page.
     */
    get pageIndex(): number {
        return this._pgIdx;
    }
    /**
     * Gets or sets the number of items to display on each page.
     * 
     * The default value for this property is **zero**, which
     * disables paging.
     */
    get pageSize(): number {
        return this._pgSz;
    }
    set pageSize(value: number) {
        if (value != this._pgSz) {
            this._pgSz = wijmo.asInt(value);
            this.refresh();
        }
    }
    /**
     * Gets the total number of items in the view before paging is applied.
     */
    get totalItemCount(): number {
        return this._view.length;
    }
    /**
     * Gets the total number of pages.
     */
    get pageCount(): number {
        return this.pageSize ? Math.ceil(this.totalItemCount / this.pageSize) : 1;
    }
    /**
     * Sets the first page as the current page.
     *
     * @return True if the page index was changed successfully.
     */
    moveToFirstPage(): boolean {
        return this.moveToPage(0);
    }
    /**
     * Sets the last page as the current page.
     *
     * @return True if the page index was changed successfully.
     */
    moveToLastPage(): boolean {
        return this.moveToPage(this.pageCount - 1);
    }
    /**
     * Moves to the page before the current page.
     *
     * @return True if the page index was changed successfully.
     */
    moveToPreviousPage(): boolean {
        return this.moveToPage(this.pageIndex - 1);
    }
    /**
     * Moves to the page after the current page.
     *
     * @return True if the page index was changed successfully.
     */
    moveToNextPage(): boolean {
        return this.moveToPage(this.pageIndex + 1);
    }
    /**
     * Moves to the page at the specified index.
     *
     * @param index Index of the page to move to.
     * @return True if the page index was changed successfully.
     */
    moveToPage(index: number): boolean {
        let newIndex = wijmo.clamp(index, 0, this.pageCount - 1);
        if (newIndex != this._pgIdx) {

            // honor canChangePage
            if (!this.canChangePage) {
                //assert(false, 'cannot change pages.');
                return false;
            }

            // raise pageChanging
            let e = new PageChangingEventArgs(newIndex);
            if (this.onPageChanging(e) && this.onCurrentChanging(e)) {

                // commit any pending edit/new items
                this.commitEdit();
                this.commitNew();

                // remember the current item (to raise currentChanged, TFS 466635)
                let current = this.currentItem;

                // change the page
                this._pgIdx = newIndex;
                this._pgView = this._getPageView();
                this._idx = 0;

                // raise collectionChanged, or refresh if grouping
                if (!this.groupDescriptions || this.groupDescriptions.length == 0) {
                    this.onCollectionChanged();
                    if (current != this.currentItem) { // TFS 466635
                        this.onCurrentChanged();
                    }
                } else {
                    this.refresh();
                }

                // raise pageChanged
                this.onPageChanged();
            }
        }
        return this._pgIdx == index;
    }
    /**
     * Occurs after the page index changes.
     */
    readonly pageChanged = new wijmo.Event<IPagedCollectionView, wijmo.EventArgs>();
    /**
     * Raises the {@link pageChanged} event.
     */
    onPageChanged(e?: wijmo.EventArgs) {
        this.pageChanged.raise(this, e);
    }
    /**
     * Occurs before the page index changes.
     */
    readonly pageChanging = new wijmo.Event<IPagedCollectionView, PageChangingEventArgs>();
    /**
     * Raises the {@link pageChanging} event.
     *
     * @param e {@link PageChangingEventArgs} that contains the event data.
     */
    onPageChanging(e: PageChangingEventArgs): boolean {
        this.pageChanging.raise(this, e);
        return !e.cancel;
    }

    // gets the full group that corresponds to a paged group view
    _getFullGroup(g: CollectionViewGroup): CollectionViewGroup {

        // look for the group by level and name
        // this gets the full (unpaged) and updated group (TFS 109119)
        let fg = this._getGroupByPath(this._fullGroups, g.level, g._path);
        if (fg != null) {
            g = fg;
        }

        // return the group
        return g;
    }

    // gets a group from a collection by path
    _getGroupByPath(groups: CollectionViewGroup[], level: number, path: string) {
        if (groups) {
            for (let i = 0; i < groups.length; i++) {
                let g = groups[i];
                if (g.level == level && g._path == path) {
                    return g;
                }
                if (g.level < level && path.indexOf(g._path) == 0) { // TFS 139570
                    g = this._getGroupByPath(g.groups, level, path);
                    if (g != null) {
                        return g;
                    }
                }
            }
        }
        return null;
    }

    // gets the list that corresponds to the current page
    _getPageView() {

        // not paging? return the whole view
        if (this.pageSize <= 0 || this._pgIdx < 0) {
            return this._view;
        }

        // slice the current page out of the view
        let start = this._pgSz * this._pgIdx,
            end = Math.min(start + this._pgSz, this._view.length);
        return this._view.slice(start, end);
    }

    // creates a grouped view of the current page
    _createGroups(items: any[]): CollectionViewGroup[] | null {

        // not grouping? return null
        if (!this._grpDesc || !this._grpDesc.length) {
            return null;
        }

        // build group tree
        let root: CollectionViewGroup[] = [],
            maps = {},
            map: any = null;
        items.forEach(item => {
            let groups = root,
                levels = this._grpDesc.length;

            // add this item to the tree
            let path = '';
            for (let level = 0; level < levels; level++) {

                // get the group name for this level
                let gd = this._grpDesc[level],
                    name = gd.groupNameFromItem(item, level),
                    last = level == levels - 1;

                // get the group map for this level (optimization)
                map = maps[path];
                if (!map && wijmo.isPrimitive(name)) {
                    map = {};
                    maps[path] = map;
                }

                // get or create the group
                let group = this._getGroup(gd, groups, map, name, level, last);

                // keep group path (all names in the hierarchy)
                path += '/' + name;
                group._path = path;

                // add data items to last level groups
                if (last) {
                    group.items.push(item);
                }

                // move on to the next group
                groups = group.groups;
            }
        });

        // done
        return root;
    }

    // gets a string digest of the current groups 
    // this is used to check whether changes require a full refresh
    private _getGroupsDigest(groups): string {
        let digest = '';
        for (let i = 0; groups != null && i < groups.length; i++) {
            let g = groups[i];
            digest += '{' + g.name + ':' + (g.items ? g.items.length : '*');
            if (g.groups.length > 0) {
                digest += ',';
                digest += this._getGroupsDigest(g.groups);
            }
            digest += '}';
        }
        return digest;
    }

    // gets an array that contains all the children for a list of groups
    // NOTE: use "push.apply" instead of "concat" for much better performance
    // NOTE2: use explicit loop for even better performance and to avoid stack overflows (TFS 15921)
    private _mergeGroupItems(groups: CollectionViewGroup[]): any[] {
        let items = [];
        for (let i = 0; i < groups.length; i++) {
            let g = groups[i];
            if (!g._isBottomLevel) {
                let groupItems = this._mergeGroupItems(g.groups);
                //g._items.push.apply(g._items, groupItems);
                for (let a = 0, len = groupItems.length; a < len; a++) {
                    g._items.push(groupItems[a]);
                }
            }
            //items.push.apply(items, g._items);
            for (let a = 0, len = g._items.length; a < len; a++) {
                items.push(g._items[a]);
            }
        }
        return items;
    }

    // finds or creates a group
    private _getGroup(gd: GroupDescription, groups: CollectionViewGroup[], map: any, name: string, level: number, isBottomLevel: boolean): CollectionViewGroup {
        let g: CollectionViewGroup;

        // find existing group
        if (map && wijmo.isPrimitive(name)) {
            g = map[name];
            if (g) {
                return g;
            }
        } else {
            for (let i = 0; i < groups.length; i++) {
                if (gd.namesMatch(groups[i].name, name)) {
                    return groups[i];
                }
            }
        }

        // not found, create now
        let group = new CollectionViewGroup(gd, name, level, isBottomLevel);
        groups.push(group);

        // add group to map
        if (map) {
            map[name] = group;
        }

        // done
        return group;
    }
}

/**
 * Represents a group created by a {@link CollectionView} object based on
 * its {@link CollectionView.groupDescriptions} property.
 */
export class CollectionViewGroup {
    _gd: GroupDescription;
    _name: string;
    _path: string;
    _level: number;
    _isBottomLevel: boolean;
    _groups: CollectionViewGroup[];
    _items: any[];

    /**
     * Initializes a new instance of the {@link CollectionViewGroup} class.
     *
     * @param groupDescription {@link GroupDescription} that owns the new group.
     * @param name Name of the new group.
     * @param level Level of the new group.
     * @param isBottomLevel Whether this group has any subgroups.
     */
    constructor(groupDescription: GroupDescription, name: string, level: number, isBottomLevel: boolean) {
        this._gd = groupDescription;
        this._name = name;
        this._level = level;
        this._isBottomLevel = isBottomLevel;
        this._groups = [];
        this._items = [];
    }
    /**
     * Gets the name of this group.
     */
    get name(): string {
        return this._name;
    }
    /**
     * Gets the level of this group.
     */
    get level(): number {
        return this._level;
    }
    /**
     * Gets a value that indicates whether this group has any subgroups.
     */
    get isBottomLevel(): boolean {
        return this._isBottomLevel;
    }
    /**
     * Gets an array containing the items included in this group (including all subgroups).
     */
    get items(): any[] {
        return this._items;
    }
    /**
     * Gets an array containing this group's subgroups.
     */
    get groups(): CollectionViewGroup[] {
        return this._groups;
    }
    /**
     * Gets the {@link GroupDescription} that owns this group.
     */
    get groupDescription(): GroupDescription {
        return this._gd;
    }
    /**
     * Calculates an aggregate value for the items in this group.
     *
     * @param aggType Type of aggregate to calculate.
     * @param binding Property to aggregate on.
     * @param view CollectionView that owns this group.
     * @return The aggregate value.
     */
    getAggregate(aggType: wijmo.Aggregate, binding: string, view?: ICollectionView) {
        let cv = wijmo.tryCast(view, CollectionView) as CollectionView,
            group = cv ? cv._getFullGroup(this) : this;
        return wijmo.getAggregate(aggType, group.items, binding);
    }
}

    }
    


    module wijmo {
    




'use strict';

export var controlBaseClass = <ObjectConstructor><any>(typeof window !== 'undefined' && window['wj-control-is-element'] ? HTMLElement : Object);
// Determine whether ControlBase should call super().
// In ES5 we should call super() only if ControlBase extends HTMLElement. 
// Calling super when extending Object will result in an exception.
// In ES6 we must call super() always, otherwise we get an exception.
// We recognize ES6 mode by an attempt to change dummy class' 'prototype' 
// property - it's prohibited in ES6 strict mode.
var __isES6Mode = false;
try {
    let f = class __c { };
    f.prototype = Array.prototype;
    __isES6Mode = f.prototype !== Array.prototype; // check in case where assignment was just ignored
}
catch (e) {
    __isES6Mode = true;
}
var __callSuper = __isES6Mode || controlBaseClass !== Object;

export class ControlBase extends controlBaseClass {
    constructor() {
        if (__callSuper) {
            super();
        }
    }
}

/**
 * Base class for all Wijmo controls.
 *
 * The {@link Control} class handles the association between DOM elements and the
 * actual control. Use the {@link hostElement} property to get the DOM element 
 * that is hosting a control, or the {@link getControl} method to get the control 
 * hosted in a given DOM element.
 *
 * The {@link Control} class also provides a common pattern for invalidating and
 * refreshing controls, for updating the control layout when its size changes, 
 * and for handling the HTML templates that define the control structure.
 */
export class Control extends ControlBase {
    static _licKey: string;             // license key
    static _wme: HTMLElement;           // watermark element
    static _toWme: any = {};            // watermark timeouts
    static _ctlCnt = 0;                 // total control cont
    static _touching = false;           // the current event is a touch event
    static _toTouch: any;               // timeout for resetting _touching member
    static _tsInvalidInput = 0;         // time stamp of last invalid input cancel (TFS 470599)
    static _toInvalidInput: any;        // timeout for handing invalid input focus (TFS 470599)
    static _REFRESH_INTERVAL = 10;      // interval between invalidation and refresh (ms)
    static _FOCUS_INTERVAL = 5;         // interval between focus/blur events and state update (ms): >=5, <200: TFS 361606/100250/112599/115816/195150
    static _ANIM_DEF_DURATION = 400;    // default animation duration (ms)
    static _ANIM_DEF_STEP = 35;         // default animation step (ms)
    static _CLICK_DELAY = 800;          // interval before repeat-clicking starts (ms)
    static _CLICK_REPEAT = 75;          // interval between repeat-clicks (ms)
    static _CLIPBOARD_DELAY = 100;      // interval used for clipboard operations (ms)
    static _POPUP_ZINDEX = 1500;        // Bootstrap dialogs use 1050
    static _SEARCH_DELAY = 500;         // interval used for search/filter operations (ms)
    static _HOVER_DELAY = 400;          // interval before showing a popup after the mouse enters it (ms) 
    static _LEAVE_DELAY = 600;          // interval before hiding a popup after the mouse leaves it (ms) 
    static _DRAG_SCROLL_EDGE = 15;      // drag auto-scroll edge size (px)
    static _DRAG_SCROLL_STEP = 20;      // drag auto-scroll step size (px)
    static _CTRL_KEY = '$WJ-CTRL';      // key used to store control reference in host element
    static _OWNR_KEY = '$WJ-OWNR';      // popup owner key
    static _SCRL_KEY = '$WJ-SCRL';      // popup scroll listener key
    static _TTIP_KEY = '$WJ-TTIP';      // element that the tool tip refers to
    static _DSBL_KEY = '$WJ-DSBL';      // element was disabled

    // attributes to be copied from host element to inner input element
    // tabindex requires some extra handling, see applyTemplate for details
    // aria attributes (e.g. aria-label, labelledby) are copied
    static _rxInputAtts = /name|tabindex|placeholder|autofocus|autocomplete|autocorrect|autocapitalize|spellcheck|readonly|minlength|maxlength|pattern|type|aria-.+/i;

    // use ResizeObserver if possible (Chrome 64, Opera 51)
    // this allows controls to update their layout without relying on
    // window resize events.
    // one per control, static version caused leaks in Angular (TFS 387882)
    protected _szObserver: any; // ResizeObserver;

    protected _e: HTMLElement;              // host element
    protected _orgTabIndex: number;         // host element's original tabIndex
    // If to set it to null, host outerHTML will not be restored on dispose.
    // This can be necessary in some interops.
    // IMPORTANT: do it right before dispose(), because some controls process this field during their lifecycle.
    /*protected*/ _orgOuter: string;            // host element's original outerHTML
    protected _orgTag: string;              // host element's original tagName
    protected _orgAtts: NamedNodeMap;       // host element's original attributes
    protected _listeners = [];              // list of event listeners attached to this control
    protected _pristine = true;             // the control value has not been changed
    protected _focus = false;               // whether the control currently contains the focus
    protected _updating = 0;                // update count (no refreshes while > 0)
    protected _fullUpdate = false;          // in case there are multiple calls to invalidate(x)
    protected _toInv: any;                  // invalidation timeout
    protected _toFocus: any;                // focus timeout
    protected _szCtl: Size;                 // current control size
    protected _rtlDir: boolean;             // whether the control is hosted in an element with RightToLeft layout

    /**
     * Initializes a new instance of the {@link Control} class and attaches it to a DOM element.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     * @param options JavaScript object containing initialization data for the control.
     * @param invalidateOnResize Whether the control should be invalidated when it is resized.
     */
    constructor(element: any, options = null, invalidateOnResize = false) {
        super();
        this._updateWme();

        // check that the element is not in use
        assert(Control.getControl(element) == null, 'Element is already hosting a control.');

        // get the host element
        let host = getElement(element);
        assert(host != null, 'Cannot find the host element.');

        // save host's original tabindex (to implement roving tabs)
        this._orgTabIndex = host.hasAttribute('tabindex')
            ? host.tabIndex
            : 0;

        // save host info (to restore on dispose)
        this._orgOuter = host.outerHTML;
        this._orgTag = host.tagName;
        this._orgAtts = host.attributes;

        // save host attributes, replace <input> and <select> elements with <div>
        if (host.tagName == 'INPUT' || host.tagName == 'SELECT') {
            host = this._replaceWithDiv(host);
        }

        // save host element and store control instance in element
        // (to retrieve with Control.getControl(element))
        this._e = host;
        host[Control._CTRL_KEY] = this;

        // update layout when user resizes the browser
        let addListener = this.addEventListener.bind(this);
        if (invalidateOnResize == true) {
            this._szCtl = new Size(host.offsetWidth, host.offsetHeight);

            // create ResizeObserver (if the browser supports it)
            let ResizeObserver = window['ResizeObserver'],
                szo = null;
            if (ResizeObserver) {
                szo = this._szObserver = new ResizeObserver(entries => {
                    entries.forEach(entry => {
                        let ctl = Control.getControl(entry.target);
                        if (ctl) {
                            ctl._handleResize();
                        }
                    });
                });
            }

            // use ResizeObserver if possible, fall back on window resize event
            if (szo) {
                szo.observe(host);
            } else {
                addListener(window, 'resize', this._handleResize.bind(this));
            }
        }

        // update focus state on focus and blur events
        let hfb = this._handleFocusBlur.bind(this);
        addListener(host, 'focus', hfb, true);
        addListener(host, 'blur', hfb, true);

        // handle disabled controls
        let hd = this._handleDisabled.bind(this);
        addListener(host, 'mousedown', hd, true);
        addListener(host, 'mouseup', hd, true);
        addListener(host, 'click', hd, true);
        addListener(host, 'dblclick', hd, true);
        addListener(host, 'wheel', hd, getEventOptions(true, true));

        // handle disabled controls
        // (in case they have children that got the focus via keyboard)
        addListener(host, 'keydown', (e) => {
            if (this.isDisabled && e.keyCode != Key.Tab) { // tabbing out is OK
                e.preventDefault();
            }
        });

        // keep track of touch actions at the document level
        // (no need to add/remove event handlers to every Wijmo control)
        if (Control._ctlCnt == 0) {
            _detectTouch(true);
        }

        // count how many cotrols are alive
        Control._ctlCnt++;
    }

    /**
     * Gets the HTML template used to create instances of the control.
     *
     * This method traverses up the class hierarchy to find the nearest 
     * ancestor that specifies a control template. For example, if you 
     * specify a prototype for the {@link ComboBox} control, which does
     * not specify a template, it will override the template defined 
     * by the {@link DropDown} base class (the nearest ancestor that does
     * specify a template).
     */
    getTemplate(): string {
        for (let p = Object.getPrototypeOf(this); p; p = Object.getPrototypeOf(p)) {
            let tpl = p.constructor.controlTemplate;
            if (tpl) {
                return tpl;
            }
        }
        return null;
    }
    /**
     * Applies the template to a new instance of a control, and returns the root element.
     *
     * This method should be called by constructors of templated controls.
     * It is responsible for binding the template parts to the corresponding control
     * members.
     *
     * For example, the code below applies a template to an instance of an 
     * {@link InputNumber} control. The template must contain elements with the
     * 'wj-part' attribute set to 'input', 'btn-inc', and 'btn-dec'.
     * The control members '_tbx', '_btnUp', and '_btnDn' will be assigned
     * references to these elements.
     *
     * ```typescript
     * this.applyTemplate('wj-control wj-inputnumber', templateString, {
     *   _tbx: 'input',
     *   _btnUp: 'btn-inc',
     *   _btnDn: 'btn-dec'
     * }, 'input');
     * ``````
     *
     * @param classNames Names of classes to add to the control's host element.
     * @param template An HTML string that defines the control template.
     * @param parts A dictionary of part variables and their names.
     * @param namePart Name of the part to be named after the host element. This
     * determines how the control submits data when used in forms.
     */
    applyTemplate(classNames: string, template: string, parts: Object, namePart?: string): HTMLElement {
        let host = this._e;

        // apply standard classes to host element
        if (classNames) {
            addClass(host, classNames);
        }

        // convert string into HTML template and append to host
        let tpl = null;
        if (template) {
            tpl = createElement(template, host);
        }

        // customize A elements with a wj-btn class (REVIEW: bad idea, should deprecate)
        let aBtns = host.querySelectorAll('a.wj-btn');
        for (var i = 0; i < aBtns.length; i++) {
            let aBtn = aBtns[i];
            setAttribute(aBtn, 'role', 'button', true);
            setAttribute(aBtn, 'href', '', true);
            setAttribute(aBtn, 'draggable', false, true);
        }

        // make sure buttons have type set to 'button' (the default is 'submit')
        let btns = host.querySelectorAll('button');
        for (var i = 0; i < btns.length; i++) {
            setAttribute(btns[i], 'type', 'button', true);
        }

        // copy key attributes from the host element (name, validation)
        // to inner input element
        // NOTE 1: do this only if there is a single input element in the template
        // NOTE 2: do not copy 'type' since it causes issues in Chrome: TFS 84900, 84901
        let inputs = host.querySelectorAll('input'),
            input = (inputs.length == 1 ? inputs[0] : null) as HTMLInputElement;
        if (input) {
            let rx = Control._rxInputAtts;
            this._copyAttributes(input, host.attributes, rx);
            this._copyAttributes(input, this._orgAtts, rx);
        }

        // change 'for' attribute of labels targeting the host element 
        // to target the inner input element instead (needed for Chrome and FF)
        if (input && host.id) {

            // get root element (may be a component not yet in the DOM)
            let root = host;
            while (root.parentElement) {
                root = root.parentElement;
            }

            // look for a label that targets this control
            let label = root.querySelector('label[for="' + host.id + '"]') as HTMLLabelElement;
            if (label instanceof HTMLLabelElement) {
                let newId = getUniqueId(host.id + '_input');
                input.id = newId; // set id of inner input element
                label.htmlFor = newId; // change 'for' attribute to match new id
            }
        }

        // raise 'change' events on behalf of inner input elements (TFS 190946)
        if (input) {
            let orgVal = input.value,
                evtChange = document.createEvent('HTMLEvents');
            evtChange.initEvent('change', true, false);

            // update orgVal when we get the focus and after input events
            this.gotFocus.addHandler(() => orgVal = input.value);
            this.addEventListener(input, 'focus', () => orgVal = input.value); // TFS 455501
            this.addEventListener(input, 'input', () => {
                this._pristine = false;
                setTimeout(() => orgVal = input.value); // in case there's a mask provider
            });

            // lost focus: update state and raise change event if the input changed (without input events)
            this.addEventListener(host, 'blur', () => { // no timeOut (TFS 370855)
                if (!this.containsFocus()) {
                    if (this._pristine) {
                        this._pristine = false;
                        this._updateState(); // to update wj-state-invalid
                    }
                    if (orgVal != input.value) { // change event needed
                        //console.log('raising change (from [' + orgVal + '] to [' + input.value + ']')
                        orgVal = input.value;
                        input.dispatchEvent(evtChange);
                    }
                }
            }, true);
        }

        // if the control has an input element, set its tabindex to -1
        // so the back tab key works properly.
        // otherwise, make sure the host can get the focus
        // http://wijmo.com/topic/shift-tab-not-working-for-input-controls-in-ff-and-chrome/, TFS 123457
        if (input) {
            host.tabIndex = -1;
        } else if (!host.getAttribute('tabindex')) {
            host.tabIndex = 0;
        }

        // initialize state (empty/invalid)
        this._updateState();

        // bind control variables to template parts
        if (parts) {
            for (let part in parts) {
                let wjPart = parts[part];
                this[part] = tpl.querySelector('[wj-part="' + wjPart + '"]');

                // look in the root as well (querySelector doesn't...)
                if (this[part] == null && tpl.getAttribute('wj-part') == wjPart) {
                    this[part] = tpl;
                }

                // make sure we found the part
                if (this[part] == null) {
                    throw 'Missing template part: "' + wjPart + '"';
                }

                // copy/move attributes from host to input element
                if (wjPart == namePart) {

                    // copy parent element's name attribute to the namePart element
                    // (to send data when submitting forms).
                    let key = 'name',
                        att = host.attributes[key];
                    if (att && att.value) {
                        this[part].setAttribute(key, att.value);
                    }

                    // transfer access key
                    key = 'accesskey';
                    att = host.attributes[key];
                    if (att && att.value) {
                        this[part].setAttribute(key, att.value);
                        host.removeAttribute(key);
                    }
                }
            }
        }

        // return template
        return tpl;
    }
    /**
     * Disposes of the control by removing its association with the host element.
     *
     * The {@link dispose} method automatically removes any event listeners added
     * with the {@link addEventListener} method.
     *
     * Calling the {@link dispose} method is important in applications that create
     * and remove controls dynamically. Failing to dispose of the controls may
     * cause memory leaks.
     */
    dispose() {

        // in case the control has already been disposed (TFS 347135)
        if (!this._e) {
            return;
        }

        // dispose of any child controls
        let cc = this._e.querySelectorAll('.wj-control');
        for (let i = 0; i < cc.length; i++) {
            let ctl = Control.getControl(cc[i]);
            if (ctl) {
                ctl.dispose();
            }
        }

        // cancel any pending refreshes
        if (this._toInv) {
            clearTimeout(this._toInv);
            this._toInv = null;
        }

        // cancel any pending focus updates
        if (this._toFocus) {
            clearTimeout(this._toFocus);
            this._toFocus = null;
        }

        // stop observing the control
        let szo = this._szObserver;
        if (szo) {
            szo.disconnect();
        }

        // remove all HTML event listeners
        this.removeEventListener();

        // remove all Wijmo event listeners 
        // (without getting the value for all properties)
        for (let prop in this) {
            if (prop.length > 2 && prop.indexOf('on') == 0) {
                let evt = this[prop[2].toLowerCase() + prop.substr(3)] as Event;
                if (evt instanceof Event) {
                    evt.removeAllHandlers();
                }
            }
        }

        // if the control has a collectionView property, remove handlers to stop receiving notifications
        // REVIEW: perhaps optimize by caching the CollectionView properties?
        let cv = this['collectionView'] as wijmo.collections.CollectionView;
        if (cv instanceof wijmo.collections.CollectionView) {
            for (let prop in cv) {
                let evt = cv[prop] as Event;
                if (evt instanceof Event) {
                    evt.removeHandler(null, this);
                }
            }
        }

        // restore original content
        if (this._e.parentNode && this._orgOuter != null) {
            this._e.outerHTML = this._orgOuter;
        }

        // done
        this._e[Control._CTRL_KEY] = null;
        this._e = this._orgOuter = this._orgTag = this._szObserver = null;

        // decrement count, remove touch listeners
        Control._ctlCnt--;
        if (Control._ctlCnt == 0) {
            _detectTouch(false);
        }
    }
    /**
     * Gets the control that is hosted in a given DOM element.
     *
     * @param element The DOM element that hosts the control, or a CSS selector for the host element (e.g. '#theCtrl').
     */
    static getControl(element: any): Control {
        let e = getElement(element);
        return e ? asType(e[Control._CTRL_KEY], Control, true) : null;
    }
    /**
     * Gets the DOM element that is hosting the control.
     */
    get hostElement(): HTMLElement {
        return this._e;
    }
    /**
     * Gets a value indicating whether the control is hosted in an element
     * with right-to-left layout.
     */
    get rightToLeft(): boolean {
        if (this._rtlDir == null) {
            this._rtlDir = this._e
                ? getComputedStyle(this._e).direction == 'rtl'
                : false;
        }
        return this._rtlDir;
    }
    /**
     * Sets the focus to this control.
     */
    focus() {
        let host = this._e;
        if (host && host.offsetHeight) { // test for disposed/hidden controls (C1WEB_27346)
            if (host.tabIndex >= 0 || !moveFocus(host, 0)) { // TFS 321472
                host.focus();
            }
        }
    }
    /**
     * Checks whether this control contains the focused element.
     */
    containsFocus(): boolean {
        //return contains(this._e, getActiveElement(), true);
        return this._containsFocusImpl(getActiveElement());
    }
    // Variation of containsFocus() that works based on _getActiveElement()
    // (correct value in blur/focusout).
    _containsFocus(): boolean {
        return this._containsFocusImpl(_getActiveElement());
    }
    // Implementation of containsFocus/_containsFocus, this is the method
    // that must be overridden in derived classes.
    _containsFocusImpl(activeElement: HTMLElement): boolean {
        return contains(this._e, activeElement, true);
    }
    /**
     * Invalidates the control causing an asynchronous refresh.
     *
     * @param fullUpdate Whether to update the control layout as well as the content.
     */
    invalidate(fullUpdate = true) {
        this._rtlDir = null;
        this._fullUpdate = this._fullUpdate || fullUpdate;
        if (this._toInv) {
            clearTimeout(this._toInv);
            this._toInv = null;
        }
        if (!this.isUpdating) {
            this._toInv = setTimeout(() => {
                this.refresh(this._fullUpdate);
                this._toInv = null;
            }, Control._REFRESH_INTERVAL);
        }
    }
    /**
     * Refreshes the control.
     *
     * @param fullUpdate Whether to update the control layout as well as the content.
     */
    refresh(fullUpdate = true) {

        // raise refreshing/ed events
        if (!this.isUpdating) {
            this.onRefreshing();
            if (this.refreshed.hasHandlers) { // avoid timeOut if possible (TFS 469800)
                setTimeout(() => {
                    this.onRefreshed();
                });
            }
        }

        // update internal variables
        if (!this.isUpdating && this._toInv) {
            clearTimeout(this._toInv);
            this._toInv = null;
            this._fullUpdate = false;
        }

        // update state
        this._updateState();
        this._updateWme();

        // derived classes should override this...
    }
    /**
     * Invalidates all Wijmo controls contained in an HTML element.
     *
     * Use this method when your application has dynamic panels that change
     * the control's visibility or dimensions. For example, splitters, accordions,
     * and tab controls usually change the visibility of its content elements.
     * In this case, failing to notify the controls contained in the element
     * may cause them to stop working properly.
     *
     * If this happens, you must handle the appropriate event in the dynamic
     * container and call the {@link Control.invalidateAll} method so the contained
     * Wijmo controls will update their layout information properly.
     *
     * @param e Container element. If set to null, all Wijmo controls
     * on the page will be invalidated.
     */
    static invalidateAll(e?: HTMLElement) {
        if (!e) e = document.body;
        let children = e.children;
        if (children) {
            for (let i = 0; i < children.length; i++) {
                Control.invalidateAll(children[i] as HTMLElement);
            }
        }
        let ctl = Control.getControl(e);
        if (ctl) {
            ctl.invalidate();
        }
    }
    /**
     * Refreshes all Wijmo controls contained in an HTML element.
     *
     * This method is similar to {@link invalidateAll}, except the controls
     * are updated immediately rather than after an interval.
     *
     * @param e Container element. If set to null, all Wijmo controls
     * on the page will be invalidated.
     */
    static refreshAll(e?: HTMLElement) {
        if (!e) e = document.body;
        if (e.children) {
            for (let i = 0; i < e.children.length; i++) {
                Control.refreshAll(e.children[i] as HTMLElement);
            }
        }
        let ctl = Control.getControl(e);
        if (ctl) {
            ctl.refresh();
        }
    }
    /**
     * Disposes of all Wijmo controls contained in an HTML element.
     *
     * @param e Container element.
     */
    static disposeAll(e?: HTMLElement) {
        let ctl = Control.getControl(e);
        if (ctl) {
            ctl.dispose();
        } else if (e.children) {
            for (let i = 0; i < e.children.length; i++) {
                Control.disposeAll(e.children[i] as HTMLElement);
            }
        }
    }
    /**
     * Suspends notifications until the next call to {@link endUpdate}.
     */
    beginUpdate() {
        this._updating++;
    }
    /**
     * Resumes notifications suspended by calls to {@link beginUpdate}.
     */
    endUpdate() {
        this._updating--;
        if (this._updating <= 0) {
            this.invalidate();
        }
    }
    /**
     * Gets a value that indicates whether the control is currently being updated.
     */
    get isUpdating(): boolean {
        return this._updating > 0;
    }
    /**
     * Executes a function within a {@link beginUpdate}/{@link endUpdate} block.
     *
     * The control will not be updated until the function has been executed.
     * This method ensures {@link endUpdate} is called even if the function throws
     * an exception.
     *
     * @param fn Function to be executed. 
     */
    deferUpdate(fn: Function) {
        try {
            this.beginUpdate();
            fn();
        } finally {
            this.endUpdate();
        }
    }
    /**
     * Gets a value that indicates whether the control is currently handling 
     * a touch event.
     */
    get isTouching(): boolean {
        return Control._touching;
    }
    /**
     * Gets or sets a value that determines whether the control is disabled.
     *
     * Disabled controls cannot get mouse or keyboard events.
     */
    get isDisabled(): boolean {
        return this._e && this._e.getAttribute('disabled') != null;
    }
    set isDisabled(value: boolean) {
        value = !!asBoolean(value, true);  //WJM-20185 to convert undefined and null to false
        if (value != this.isDisabled) {
            let host = this._e;
            if (host) {

                // update wj-state-disabled class and disabled attribute on the element
                let att = 'disabled';
                toggleClass(host, 'wj-state-disabled', value);
                setAttribute(host, att, value ? att : null);
                
                // set tabIndex to -1 if the control is disabled 
                // or if it contains input elements (so back-tab works properly: TFS 387283)
                host.tabIndex = this.isDisabled || host.querySelector('input')
                    ? -1
                    : this._orgTabIndex;
                
                // update disabled property on child input elements (TFS 190939, 376384, 436752)
                let inputs = host.querySelectorAll('input,textarea,button,command,fieldset,keygen,optgroup,option,select'),
                    key = Control._DSBL_KEY;
                for (let i = 0; i < inputs.length; i++) {
                    let input = inputs[i] as HTMLInputElement;
                    if (value) { // disabling
                        input[key] = input.disabled; // save current value
                        input.disabled = true; // apply new value
                    } else { // enabling (unless contained in a disabled control)
                        let disabled = closest(input, '.wj-control.wj-state-disabled')
                            ? true
                            : false;
                        if (disabled) { // disabling
                            input[key] = input.disabled; // save current value
                            input.disabled = true; // apply new value
                        } else { // enabling (restoring)
                            let disabled = input[key];
                            if (!isBoolean(disabled)) {
                                disabled = false;
                            }
                            input.disabled = disabled; // restore
                            delete input[key]; // and forget until next time
                        }
                    }
                }
            }
        }
    }
    /**
     * Initializes the control by copying the properties from a given object.
     *
     * This method allows you to initialize controls using plain data objects
     * instead of setting the value of each property in code. 
     * 
     * For example:
     * 
     * ```typescript
     * grid.initialize({
     *   itemsSource: myList,
     *   autoGenerateColumns: false,
     *   columns: [
     *     { binding: 'id', header: 'Code', width: 130 },
     *     { binding: 'name', header: 'Name', width: 60 } 
     *   ]
     * });
     * 
     * // is equivalent to
     * grid.itemsSource = myList;
     * grid.autoGenerateColumns = false;
     * // etc.
     * ```
     *
     * The initialization data is type-checked as it is applied. If the 
     * initialization object contains unknown property names or invalid
     * data types, this method will throw.
     *
     * @param options Object that contains the initialization data.
     */
    initialize(options: any) {
        copy(this, options); // no deferUpdate/async stuff here!
    }
    /**
     * Adds an event listener to an element owned by this {@link Control}.
     *
     * The control keeps a list of attached listeners and their handlers,
     * making it easier to remove them when the control is disposed (see the
     * {@link dispose} and {@link removeEventListener} methods).
     *
     * Failing to remove event listeners may cause memory leaks.
     *
     * The <b>passive</b> parameter is set to false by default, which means
     * the event handler may call <b>event.preventDefault()</b>.
     * If you are adding passive handlers to touch or wheel events, setting
     * this parameter to true will improve application performance.
     * 
     * For details on passive event listeners, please see 
     * <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners">Improving scrolling performance with passive listeners</a>.
     * 
     * @param target Target element for the event.
     * @param type String that specifies the event.
     * @param fn Function to execute when the event occurs.
     * @param capture Whether the listener should be handled by the control before it is handled by the target element.
     * @param passive Indicates that the handler will never call <b>preventDefault()</b>.
     */
    addEventListener(target: EventTarget, type: string, fn: any, capture?: boolean, passive?: boolean) {
        if (target) {

            // capture is false by default 
            if (capture == null) {
                capture = false;
            }

            // passive is false by default (for touch/wheel events)
            if (isBoolean(capture) && passive == null) {
                if (type.indexOf('touch') > -1 || type.indexOf('wheel') > -1) { // *much* faster than .match
                    passive = false;
                }
            }

            // options is an object or a boolean
            let options = isBoolean(capture) && isBoolean(passive)
                ? getEventOptions(capture, passive)
                : capture;

            // add listener
            target.addEventListener(type, fn, options);
            this._listeners.push({ target: target, type: type, fn: fn, capture: capture });
        }
    }
    /**
     * Removes one or more event listeners attached to elements owned by this {@link Control}.
     *
     * @param target Target element for the event. If null, removes listeners attached to all targets.
     * @param type String that specifies the event. If null, removes listeners attached to all events.
     * @param fn Handler to remove. If null, removes all handlers.
     * @param capture Whether the listener is capturing. If null, removes capturing and non-capturing listeners.
     * @return The number of listeners removed.
     */
    removeEventListener(target?: EventTarget, type?: string, fn?: any, capture?: boolean): number {
        let cnt = 0;
        for (let i = 0; i < this._listeners.length; i++) {
            let l = this._listeners[i];
            if (target == null || target == l.target) {
                if (type == null || type == l.type) {
                    if (fn == null || fn == l.fn) {
                        // TFS 356533: bound functions return '[native code]'!!!
                        //(fn && l.fn && fn.prototype && l.fn.prototype && fn.toString() == l.fn.toString())) { // closures
                        if (capture == null || capture == l.capture) {
                            l.target.removeEventListener(l.type, l.fn, l.capture);
                            this._listeners.splice(i, 1);
                            i--;
                            cnt++;
                        }
                    }
                }
            }
        }
        return cnt;
    }
    /**
     * Occurs when the control gets the focus.
     */
    readonly gotFocus = new Event<Control, EventArgs>();
    /**
     * Raises the {@link gotFocus} event.
     */
    onGotFocus(e?: EventArgs) {
        this.gotFocus.raise(this, e);
    }
    /**
     * Occurs when the control loses the focus.
     */
    readonly lostFocus = new Event<Control, EventArgs>();
    /**
     * Raises the {@link lostFocus} event.
     */
    onLostFocus(e?: EventArgs) {
        this.lostFocus.raise(this, e);
    }
    /**
     * Occurs when invalid input is detected.
     * 
     * Invalid input may occur when the user types or pastes a value that
     * cannot be converted to the proper type, or a value that is outside
     * the valid range.
     * 
     * If the event handler cancels the event, the control will retain
     * the invalid content and the focus, so users can correct the error.
     * 
     * If the event is not canceled, the control will ignore the invalid
     * input and will retain the original content.
     */
    readonly invalidInput = new Event<Control, CancelEventArgs>();
    /**
     * Raises the {@link invalidInput} event.
     * 
     * If the event handler cancels the event, the control will keep
     * the invalid input and the focus.
     */
    onInvalidInput(e: CancelEventArgs) {
        this.invalidInput.raise(this, e);
        if (e.cancel) {
            let interval = Control._FOCUS_INTERVAL + 50;
            if (Date.now() - Control._tsInvalidInput > interval + 50) { // TFS 470599
                if (Control._toInvalidInput) {
                    clearTimeout(Control._toInvalidInput);
                }
                Control._toInvalidInput = setTimeout(() => { // TFS 466777
                    Control._toInvalidInput = null;
                    Control._tsInvalidInput = Date.now();
                    this.focus();
                }, interval);
            }
        }
        this._updateState();
        return !e.cancel;
    }
    /**
     * Occurs when the control is about to refresh its contents.
     */
    readonly refreshing = new Event<Control, EventArgs>();
    /**
     * Raises the {@link refreshing} event.
     */
    onRefreshing(e?: EventArgs) {
        this.refreshing.raise(this, e);
    }
    /**
     * Occurs after the control has refreshed its contents.
     */
    readonly refreshed = new Event<Control, EventArgs>();
    /**
     * Raises the {@link refreshed} event.
     */
    onRefreshed(e?: EventArgs) {
        this.refreshed.raise(this, e);
    }

    // ** implementation

    // gets the control's product code
    _getProductInfo(): string {
        return 'B0C3,Control';
    }

    // update watermark element
    private _updateWme() {
    }

    // check whether the control has pending updates
    _hasPendingUpdates() {
        return this._toInv != null;
    }

    // invalidates the control when its size changes
    protected _handleResize() {
        if (this._e.parentElement) {
            let sz = new Size(this._e.offsetWidth, this._e.offsetHeight);
            if (!sz.equals(this._szCtl)) {
                this._szCtl = sz;
                if (sz.width || sz.height) {
                    this.invalidate();
                }
            }
        }
    }

    // handle focus and blur events on a timeout
    _handleFocusBlur() {
        if (!this._toFocus) {
            this._toFocus = setTimeout(() => {
                this._toFocus = null;
                this._updateFocusState();
            }, Control._FOCUS_INTERVAL);
        }
    }

    // update focus state and raise got/lost focus events
    // for this control and all its ancestors in the DOM tree
    protected _updateFocusState() {

        // Chrome requires a timeout here because activeElement is set to
        // the document body when elements receive the blur event (TFS 255011)
        // https://bugzilla.mozilla.org/show_bug.cgi?id=452307
        setTimeout(() => {
            let e = EventArgs.empty;

            // losing focus
            let hadFocus = document.body.querySelectorAll('.wj-state-focused');
            for (let i = 0; i < hadFocus.length; i++) {
                let ctl = Control.getControl(hadFocus[i]);
                if (ctl && ctl._focus && !ctl.containsFocus()) {
                    removeClass(ctl._e, 'wj-state-focus');
                    ctl._focus = false;
                    ctl._updateState();
                    ctl.onLostFocus(e);
                }
            }

            // getting focus
            let ae = getActiveElement();
            if (ae) {
                let innermost = true;
                for (let host = ae; host;) {
                    let ctl = Control.getControl(host);
                    if (ctl && !ctl._focus && ctl.containsFocus()) {
                        if (innermost) {
                            addClass(host, 'wj-state-focus');
                            innermost = false;
                        }
                        ctl._focus = true;
                        ctl._updateState();
                        ctl.onGotFocus(e);
                    }
                    host = host[Control._OWNR_KEY] || host.parentNode; // TFS 338519
                }
            }
        });
    }

    // update state attributes for this control (focused, empty, invalid)
    protected _updateState() {
        let host = this.hostElement;
        if (host) {

            // focused
            toggleClass(host, 'wj-state-focused', this._focus);

            // rtl (TFS 334764)
            this._rtlDir = getComputedStyle(host).direction == 'rtl';
            toggleClass(host, 'wj-rtl', this._rtlDir);

            // input: empty, readonly, invalid
            let input = host.querySelector('input') as HTMLInputElement;
            if (input instanceof HTMLInputElement) {
                toggleClass(host, 'wj-state-empty', input.value.length == 0);
                toggleClass(host, 'wj-state-readonly', input.readOnly);
                let vm = input.validationMessage; // may be null in IE9 (TFS 204492)
                toggleClass(host, 'wj-state-invalid', !this._pristine && vm != null && vm.length > 0);

                // ** don't: the control might be editable even if the input element isn't
                //setAttribute(host, 'aria-readonly', input.readOnly ? true : null);
            }
        }
    }

    // suppress mouse and keyboard events if the control is disabled
    // (pointer-events requires IE11, doesn't prevent wheel at all)
    // also check for state-disabled on target element (TFS 344812)
    private _handleDisabled(e: any) {
        if (this.isDisabled || closest(e.target, '.wj-state-disabled')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }

    // replaces an element with a div element, copying the child elements 
    // and the 'id' and 'style' attributes from the original element
    private _replaceWithDiv(element: HTMLElement) {

        // replace the element
        let div = document.createElement('div');
        element.parentElement.replaceChild(div, element);

        // copy children
        div.innerHTML = element.innerHTML;

        // copy original attributes to host element
        this._copyAttributes(div, element.attributes, /id|style|class/i);

        // return new div
        return div;
    }

    // apply given attributes to an input element
    private _copyAttributes(e: HTMLElement, atts: NamedNodeMap, names: RegExp) {
        if (e) {
            for (let i = 0; i < atts.length; i++) {
                let name = atts[i].name;
                if (name.match(names)) {
                    e.setAttribute(name, atts[i].value);
                }
            }
        }
    }

    // get key code accounting for RTL
    _getKeyCode(e: KeyboardEvent) {
        let keyCode = e.keyCode;
        if (this.rightToLeft) {
            switch (keyCode) {
                case Key.Right:
                    keyCode = Key.Left;
                    break;
                case Key.Left:
                    keyCode = Key.Right;
                    break;
            }
        }
        return keyCode;
    }
}

// keep track of touch events (out of Control class: TFS 469800)
function _detectTouch(connect: boolean) {
    if ('ontouchstart' in window || 'onpointerdown' in window) {
        let doc = document,
            opt = getEventOptions(true, true),
            ts = _handleTouchStart,
            te = _handleTouchEnd,
            addRemove = connect
                ? doc.addEventListener.bind(doc)
                : doc.removeEventListener.bind(doc);
        if ('ontouchstart' in window) { // Chrome, Firefox, Safari
            addRemove('touchstart', ts, opt);
            addRemove('touchend', te, opt);
            addRemove('touchcancel', te, opt);
        } else if ('onpointerdown' in window) { // IE
            addRemove('pointerdown', ts, opt);
            addRemove('pointerup', te, opt);
            addRemove('pointercancel', te, opt);
        }
    }
}
function _handleTouchStart(e) {
    if (e.pointerType == null || e.pointerType == 'touch') {

        // cancel touch-end timeOut
        if (Control._toTouch) {
            clearTimeout(Control._toTouch);
            Control._toTouch = null;
        }

        // user is touching
        Control._touching = true;

        // to raise lostFocus before any clicks (TFS 424981)
        let target = e.target,
            ae = getActiveElement();
        if (ae && !contains(ae, target)) {
            let ctl = Control.getControl(closest(ae, '.wj-control'));
            if (ctl) {
                target.focus();
            }
        }
    }
}
function _handleTouchEnd(e) {
    if (e.pointerType == null || e.pointerType == 'touch') {
        Control._toTouch = setTimeout(function () {
            Control._toTouch = null;
            Control._touching = false; // no longer touching
        }, 900); // >600 on Android: TFS 281356

        // workaround for Ionic/IOS issue (TFS 390662)
        let ionApp = document.querySelector('ion-app');
        if (ionApp) {
            let target = e.target,
                dropDown = closest(target, '.wj-dropdown-panel,.wj-dropdown');
            if (dropDown) {
                target.focus();
                //e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
}

    }
    


    module wijmo {
    



'use strict';

/**
 * Class that enables the creation of custom documents for printing.
 *
 * The {@link PrintDocument} class makes it easy to create documents 
 * for printing or exporting to PDF. Most browsers allow you to select
 * the paper size, orientation, margins, and whether to include page 
 * headers and footers.
 *
 * To use, instantiate a {@link PrintDocument}, add content using the
 * {@link append} method, and finish by calling the {@link print} 
 * method.
 *
 * For example:
 * ```typescript
 * import { PrintDocument } from '@grapecity/wijmo';
 * 
 * // create the document
 * var doc = new PrintDocument({
 *   title: 'PrintDocument Test'
 * });
 * 
 * // add some simple text
 * doc.append('&lt;h1&gt;Printing Example&lt;/h1&gt;');
 * doc.append('&lt;p&gt;This document was created using the &lt;b&gt;PrintDocument&lt;/b&gt; class.&lt;/p&gt;');
 * 
 * // add some existing elements
 * doc.append(document.getElementById('gaugeControl'));
 * 
 * // print the document (or export it to PDF)
 * doc.print();
 * ```
 * 
 * The example below shows how you can create a printer-friendly version of
 * a document which can be printed or exported to PDF and other formats 
 * directly from the browser:
 * 
 * {@sample Core/PrintDocument Example}
 */
export class PrintDocument {
    _iframe: HTMLIFrameElement;
    _title: string = null;
    _css: string[];
    _copyCss = true;

    // ** ctor

    /**
     * Initializes a new instance of the {@link PrintDocument} class.
     *
     * @param options JavaScript object containing initialization data for the {@link PrintDocument}.
     */
    constructor(options?: any) {
        if (options != null) {
            copy(this, options);
        }
    }

    // ** object model

    /**
     * Gets or sets the document title.
     *
     * The default value for this property is **null**, which causes the
     * {@link PrintDocument} to use the title from the current document's
     * **title** tag.
     */
    get title(): string {
        return this._title;
    }
    set title(value: string) {
        this._title = asString(value);
    }
    /**
     * Gets or sets a value that determines whether the {@link PrintDocument} 
     * should include the CSS style sheets defined in the main document.
     * 
     * The default value for the property is **true**.
     */
    get copyCss(): boolean {
        return this._copyCss;
    }
    set copyCss(value: boolean) {
        this._copyCss = asBoolean(value);
    }
    /**
     * Adds a CSS style sheet to the document.
     *
     * @param href URL of the CSS file that should be added to the document.
     */
    addCSS(href: string) {
        if (!this._css) {
            this._css = [];
        }
        this._css.push(href);
    }
    /**
     * Appends an HTML string or an element to the document.
     *
     * @param content HTML string or Element to append to the document.
     */
    append(content: string | Element) {
        let doc = this._getDocument();
        if (isString(content)) {
            doc.write(content);
        } else if (content instanceof Element) {

            // make sure controls are up-to-date before cloning them
            if (content instanceof HTMLElement) {
                Control.refreshAll(content);
            }

            // assign value/checked attributes to input elements (TFS 466810)
            let clone = content.cloneNode(true) as Element,
                inputs = clone.querySelectorAll('input');
            for (let i = 0; i < inputs.length; i++) {
                let input = inputs[i] as HTMLInputElement;
                switch (input.type) {
                    case 'checkbox':
                        setAttribute(input, 'checked', input.checked ? true: null);
                        setAttribute(input, 'indeterminate', input.indeterminate ? true : null);
                        break;
                    case 'radio':
                        setAttribute(input, 'checked', input.checked ? true : null);
                        break;
                    default:
                        setAttribute(input, 'value', input.value || null);
                        break;
                }
            }

            // write out clone with value attributes
            doc.write(clone.outerHTML);
        } else {
            assert(false, 'content should be an HTML string or an Element.');
        }
    }
    /**
     * Prints the document.
     * 
     * @param callback Optional callback invoked after the document
     * finishes printing.
     */
    print(callback?: Function) {
        if (this._iframe) {

            // close the document
            this._close();

            // give it some time before printing/disposing (important!!!)
            setTimeout(() => {

                // clean up using afterprint event if possible (not in FireFox: TFS 260289, 376518)
                let wnd = this._iframe.contentWindow,
                    afterprint = 'onafterprint' in wnd && !isFirefox();
                if (afterprint) {
                    wnd.onafterprint = () => {
                        this._afterPrint(callback);
                    };
                }

                // print the document

                // use execCommand if possible (TFS 277516, 277894, 371692)
                // doesn't seem to work in IE/Edge when the document has no body
                let useCommand = !(isIE() && wnd.document.body == null);
                if (useCommand && document.queryCommandSupported('print')) {
                    wnd.document.execCommand('print', true, null);
                } else {
                    wnd.focus();
                    wnd.print();
                }

                // clean up after printing if afterprint event is not available (Chrome)
                if (!afterprint) {
                    this._afterPrint(callback);
                }
            }, 100);
        }
    }

    // ** implementation

    // clean up when done printing
    _afterPrint(callback?: Function) {
        document.body.removeChild(this._iframe);
        this._iframe = null;
        if (isFunction(callback)) {
            callback();
        }
    }

    // gets a reference to the print document
    _getDocument(): Document {
        if (!this._iframe) {
            let iframe = this._iframe = document.createElement('iframe');
            addClass(iframe, 'wj-printdocument');
            setCss(iframe, {
                position: 'fixed',
                left: 32000,
                top: 32000
            });
            document.body.appendChild(iframe);
        }
        return this._iframe.contentDocument;
    }

    // closes the print document before printing
    _close() {

        // close document before applying title and style sheets
        let doc = this._getDocument();
        doc.close();

        // add title
        doc.title = this.title != null
            ? this.title
            : document.title;

        // replace whitespace-only title with non-breaking space (TFS 281035, 292059)
        // https://stackoverflow.com/questions/23556255/how-can-i-have-a-blank-title-page
        if (!doc.title || !doc.title.trim()) {
            doc.title = '\u00A0';
        }

        // add main document style sheets
        if (this._copyCss) {
            let links = document.head.querySelectorAll('LINK');
            for (let i = 0; i < links.length; i++) {
                let link = links[i] as HTMLLinkElement;
                if (link.href.match(/\.css$/i) && link.rel.match(/stylesheet/i)) {
                    let xhr = httpRequest(link.href, { async: false });
                    this._addStyle(xhr.responseText);
                }
            }
            let styles = document.head.querySelectorAll('STYLE');
            for (let i = 0; i < styles.length; i++) {
                this._addStyle(styles[i].textContent);
            }
        }

        // add extra style sheets
        if (this._css) {
            for (let i = 0; i < this._css.length; i++) {
                let es = doc.createElement('style'),
                    xhr = httpRequest(this._css[i], { async: false });
                es.textContent = xhr.responseText;
                doc.head.appendChild(es);
            }
        }
    }
    _addStyle(style: string) {
        let doc = this._getDocument(),
            es = doc.createElement('style');
        es.textContent = style;
        doc.head.appendChild(es);
    }
}
    }
    


    module wijmo {
    


'use strict';

/**
 * Static class that provides utility methods for clipboard operations.
 *
 * The {@link Clipboard} class provides static {@link copy} and {@link paste} methods
 * that can be used by controls to customize the clipboard content during
 * clipboard operations.
 *
 * For example, the code below shows how a control could intercept the
 * clipboard shortcut keys and provide custom clipboard handling:
 *
 * ```typescript
 * rootElement.addEventListener('keydown', (e: KeyboardEvent) {
 * 
 *     // copy: ctrl+c or ctrl+Insert
 *     if (e.ctrlKey && (e.keyCode == 67 || e.keyCode == 45)) {
 *         let text = this.getClipString();
 *         Clipboard.copy(text);
 *         return;
 *     }
 * 
 *     // paste: ctrl+v or shift+Insert
 *     if ((e.ctrlKey && e.keyCode == 86) || (e.shiftKey && e.keyCode == 45)) {
 *         Clipboard.paste(text => {
 *             this.setClipString(text);
 *         });
 *         return;
 *      }
 * });
 * ```
 * 
 * The example below shows how you can customize the behavior of the clipboard
 * paste command when the target is a {@link FlexGrid} control:
 * 
 * {@sample Core/Clipboard Example}
 */
export class Clipboard {

    /**
     * Copies a string to the clipboard.
     *
     * This method only works if invoked immediately after the user 
     * pressed a clipboard copy command (such as ctrl+c).
     *
     * @param text Text to copy to the clipboard.
     */
    static copy(text: string) {

        /*
        // use system clipboard if available
        // no need to mess with DOM, focus, selection (TFS 456957)
        let clip = navigator['clipboard'];
        if (clip && isFunction(clip.writeText)) {
            try {
                clip.writeText(text);
            } catch (x) { // no permissions (TFS 457125)
                Clipboard._copyPaste(asString(text), null);
            }
            return;
        }
        */

        // no system clipboard
        Clipboard._copyPaste(asString(text), null);
    }
    /**
     * Gets a string from the clipboard.
     *
     * This method only works if invoked immediately after the user 
     * pressed a clipboard paste command (such as ctrl+v).
     *
     * @param callback Function called when the clipboard content
     * has been retrieved. The function receives the clipboard
     * content as a parameter.
     */
    static paste(callback: Function) {
        callback = asFunction(callback);

        /*
        // use system clipboard if available
        // no need to mess with DOM, focus, selection (TFS 456957)
        let clip = navigator['clipboard'];
        if (clip && isFunction(clip.readText)) {
            try {
                clip.readText()
                    .then(text => callback(text))
                    .catch(err => Clipboard._copyPaste(null, callback));
            } catch (x) { // no permissions (TFS 457125)
                Clipboard._copyPaste(null, callback);
            }
            return;
        }
        */
        
        // no system clipboard
        Clipboard._copyPaste(null, callback);
    }

    // ** implementation

    private static _copyPaste(copyText: string, pasteCallback: Function) {

        // get active element to restore later
        let ae = getActiveElement();

        // find parent for temporary input element
        // (body may not be focusable when modal dialogs are used: TFS 202992)
        let parent = closest(ae, '.wj-control') as HTMLElement;
        while (parent && Control.getControl(parent)) {
            parent = parent.parentElement;
        }
        parent = parent || document.body;

        // if we have a parent, add hidden textarea to copy/paste
        if (parent) {

            // create, initialize, select hidden textarea
            let done = false,
                html = '<textarea class="wj-clipboard">',
                el = createElement(html, parent, {
                    position: 'fixed',
                    opacity: '0'
                }) as HTMLTextAreaElement;

            // ignore keyboard input to hidden textarea (TFS 151939)
            el.onkeydown = e => e.preventDefault();

            // prevent change events on forms (TFS 343377)
            el.onchange = e => e.stopImmediatePropagation();

            // copy or paste
            if (isString(copyText)) {
                el.value = copyText;
                el.select();
                if (document.execCommand('copy')) {
                    done = true;
                }
            } else {
                el.select();
                if (isFunction(pasteCallback) && document.execCommand('paste')) {
                    pasteCallback(el.value);
                    done = true;
                }
            }

            // wait, clean up, invoke paste callback if not done
            setTimeout(() => {
                (ae as any).focus({ preventScroll: true }); // TFS 434734
                removeChild(el);
                if (!done && isFunction(pasteCallback)) {
                    pasteCallback(el.value);
                }
            }, Control._CLIPBOARD_DELAY);
        }
    }
}


    }
    


    module wijmo {
    


'use strict';

/**
 * Class that provides repeat-clicking on behalf of an HTMLElement
 * (typically a button).
 */
export class _ClickRepeater {
    private static _startEvents = ['mousedown', 'touchstart']; // TFS 396835
    private static _stopEvents = ['mouseup', 'mouseout', 'keydown', 'touchend', 'touchcancel'];
    private _e: HTMLElement;
    private _disabled: boolean;
    private _isDown = false;
    private _clicked: boolean;
    private _toDelay: any;
    private _toRepeat: any;
    private _mousedownBnd = this._mousedown.bind(this);
    private _mouseupBnd = this._mouseup.bind(this);
    private _clickBnd = this._click.bind(this);

    /**
     * Initializes a new instance of the {@link _ClickRepeater} class.
     * 
     * @param element Element that will raise click events while the mouse is down.
     */
    constructor(element: HTMLElement) {
        this.element = element;
        this._connect(true);
    }

    /**
     * Gets or sets the element that will raise click events while the mouse is down.
     */
    get element(): HTMLElement {
        return this._e;
    }
    set element(value: HTMLElement) {
        this._connect(false);
        this._e = asType(value, HTMLElement, true);
        this._connect(true);
    }
    /**
     * Gets or sets a value that determines whether this repeater is disabled.
     */
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = asBoolean(value);
    }

    // ** implementation

    // connect or disconnect event handlers for the input element
    _connect(connect: boolean) {
        if (this._e) {
            _ClickRepeater._startEvents.forEach(evt => {
                if (connect) {
                    this._e.addEventListener(evt, this._mousedownBnd);
                } else {
                    this._e.removeEventListener(evt, this._mousedownBnd);
                }
            });
        }
    }

    // clear any pending timeOuts
    _clearTimeouts() {
        if (this._toRepeat) {
            clearTimeout(this._toRepeat); // TFS 430772
            this._toRepeat = null;
        }
        if (this._toDelay) {
            clearTimeout(this._toDelay); // TFS 430772
            this._toDelay = null;
        }
    }

    // start clicking on mousedown
    _mousedown(e: MouseEvent) {
        if (this._isDown) { // sanity
            this._mouseup(null);
        }
        if (!this._disabled) {
            this._isDown = true;
            _ClickRepeater._stopEvents.forEach(evt => {
                document.addEventListener(evt, this._mouseupBnd);
            })
            this._clearTimeouts();
            this._toDelay = setTimeout(() => {
                if (this._isDown) {
                    this._click();
                    this._toRepeat = setTimeout(this._clickBnd, Control._CLICK_REPEAT);
                }
            }, Control._CLICK_DELAY);
        }
    }

    // stop clicking on mouseup, touchent, etc
    _mouseup(e: MouseEvent) {
        if (this._isDown && e && e.type != 'keydown' && this._clicked) {
            e.preventDefault();
        }
        _ClickRepeater._stopEvents.forEach(evt => {
            document.removeEventListener(evt, this._mouseupBnd);
        })
        this._clearTimeouts();
        this._isDown = false;
        this._clicked = false;
    }

    // raise click event
    _click() {
        this._clicked = true;
        this._clearTimeouts();
        if (this._e) { // TFS 299760
            this._e.click();
            if (this._isDown) {
                this._toRepeat = setTimeout(this._clickBnd, Control._CLICK_REPEAT);
            }
        }
    }
}

    }
    


    module wijmo {
    




'use strict';

/**
 * Represents the position of a popup element with respect to a
 * reference element.
 */
export enum PopupPosition {

    /** Above the reference element. */
    Above = 0,
    /** Above and aligned to the right of the reference element. */
    AboveRight = 1,

    /** To the right and aligned to the top of the reference element. */
    RightTop = 2,
    /** To the right of the reference element. */
    Right = 3,
    /** To the right and aligned to the bottom of the reference element. */
    RightBottom = 4,

    /** Below and aligned to the right of the reference element. */
    BelowRight = 5,
    /** Below the reference element. */
    Below = 6,
    /** Below and aligned to the left of the reference element. */
    BelowLeft = 7,

    /** To the left and aligned to the bottom of the reference element. */
    LeftBottom = 8,
    /** To the left of the reference element. */
    Left = 9,
    /** To the left and aligned to the top of the reference element. */
    LeftTop = 10,

    /** Above and aligned to the left of the reference element. */
    AboveLeft = 11
}

/**
 * Shows an element as a popup.
 *
 * The popup element becomes a child of the body element, and is positioned
 * with respect to reference rectangle according to the given {@link PopupPosition}.
 *
 * The reference rectangle may be specified as one of the following:
 *
 * <dl class="dl-horizontal">
 *   <dt>HTMLElement</dt>
 *   <dd>The bounding rectangle of the element.</dd>
 *   <dt>MouseEvent</dt>
 *   <dd>The bounding rectangle of the event's target element.</dd>
 *   <dt>Rect</dt>
 *   <dd>The given rectangle.</dd>
 *   <dt>null</dt>
 *   <dd>No reference rectangle; the popup is centered on the window.</dd>
 * </dl>
 *
 * Call the {@link hidePopup} method to hide the popup.
 *
 * @param popup Element to show as a popup.
 * @param ref Reference element or rectangle used to position the popup.
 * @param position Position of the popup with respect to the reference element.
 * @param fadeIn Use a fade-in animation to make the popup appear gradually.
 * @param copyStyles Whether to copy font and color styles from the reference element, or an element to use as the style source.
 * @param hideOnScroll An optional function called when the popup is hidden as a result of a parent element scrolling.
 * @return An interval ID that can be used to suspend the fade-in animation.
 */
export function showPopup(popup: HTMLElement, ref?: any, position?: PopupPosition | Boolean, fadeIn?: boolean, copyStyles: any = true, hideOnScroll?: Function): any {

    // remember if the popup was visible (TFS 435394)
    let wasVisible = popup.offsetHeight || popup.offsetWidth;

    // accepting 'above' boolean parameter to avoid breaking code
    let pp = position as PopupPosition;
    if (isBoolean(position) || position == null) {
        pp = position ? PopupPosition.AboveLeft : PopupPosition.BelowLeft;
    }

    // calculate popup's parent element, add it to DOM, apply styles, refresh
    let parent = _getPopupParent(ref);
    _addPopupToDOM(popup, parent);
    _copyPopupStyles(popup, ref, copyStyles);
    Control.refreshAll(popup);

    // requestAnimationFrame is bad, but required in some exotic Firefox scenarios (TFS 385944, 433430)
    if (isFirefox()) {
        requestAnimationFrame(() => {
            _updatePopupPosition(popup, ref, pp);
        });
    } else {
        _updatePopupPosition(popup, ref, pp);
    }

    // save owner element information
    if (ref instanceof HTMLElement) {
        popup[Control._OWNR_KEY] = ref;
    }

    // show the popup if it wasn't visible (TFS 435394)
    if (!wasVisible) {

        // hide the popup if the user scrolls an ancestor other than the body (TFS 284767)
        _hidePopupOnscroll(popup, ref, hideOnScroll);

        // show the popup with animation
        if (fadeIn) {
            return animate(pct => popup.style.opacity = (pct < 1) ? pct.toString() : '');
        }

        // show the popup without animation
        popup.style.opacity = '';
    }

    // no animation
    return null;
}

/**
 * Hides a popup element previously displayed with the {@link showPopup}
 * method.
 *
 * @param popup Popup element to hide.
 * @param remove Whether to remove the popup from the DOM or just to hide it.
 * This parameter may be a boolean or a callback function that gets invoked
 * after the popup has been removed from the DOM.
 * @param fadeOut Whether to use a fade-out animation to make the popup disappear gradually.
 * @return An interval id that you can use to suspend the fade-out animation.
 */
export function hidePopup(popup: HTMLElement, remove: any = true, fadeOut = false): any {
    let anim = null;
    if (fadeOut) {
        anim = animate((pct: number) => {
            popup.style.opacity = (1 - pct).toString();
            if (pct == 1) {
                _hidePopup(popup, remove);
                popup.style.opacity = '';
            }
        });
    } else {
        _hidePopup(popup, remove);
    }
    return anim;
}

// ** implementation

// updates the popup position (may be called in a requestAnimationFrame)
function _updatePopupPosition(popup: HTMLElement, ref: any, pp: PopupPosition) {

    // get reference rect, popup offset, popup position
    let bounds = _getReferenceRect(popup, ref);
    let ptOffset = _getPopupOffset(popup);
    let pos = _getPopupPosition(popup, bounds, pp, ptOffset);

    // update popup position
    let css: any = {
        position: 'absolute',
        zIndex: Control._POPUP_ZINDEX
    };
    let usePos = ptOffset.x == 0;
    if (usePos) {
        css.left = pos.x;
        css.top = pos.y;
    } else { // use transform to keep element width (TFS: 341039)
        css.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
    }
    let popupWidth = popup.getBoundingClientRect().width;
    setCss(popup, css);
    // WJM-19606
    // At bigger zoom factors (devicePixelRatio > 1.3), caused by OS level custom screen
    // scale settings, or browser's zoom in, we can get to the pixel roundoff problems
    // when calculating x position (in _getPopupPosition) for popup which is at the right 
    // edge of the viewport, based on the popup actual width. 
    // In this case we can get a slightly bigger pos.x, and because of absolute positioning
    // of the popup element, browser will try to fit popup into the viewport boundaries by
    // decreasing its actual width, which may cause unwanted wrapping of the popup content.
    // NOTE: this is not an issue when we use transform:translate to position popup, which can 
    // easily go beyond the viewport boundaries.
    // To cope with this problem, in case where we use css.left to position popup, we check
    // its width before and after setting popup.style.left. If widths are different, we decrease 
    // popup.style.left to the difference between initial (correct) and actual widths (var diff).
    // Note that its crucial to use getBoundingClientRect to compare widths, which returns 
    // floating point width, instead of integer properties like offsetWidth that return integers
    // and make calculations not precise enough.
    if (usePos) {
        let diff = popupWidth - popup.getBoundingClientRect().width;
        if (diff > 0) {
            popup.style.left = (pos.x - Math.ceil(diff)) + 'px';
        }
    }
}

// hide the popup, dispose of scroll handler
function _hidePopup(popup: HTMLElement, remove: any) {

    // hide the popup
    popup.style.display = 'none';
    if (remove && popup.parentElement) {
        setTimeout(() => { // wait for blur event handler before removing (TFS 269434)
            if (popup.style.display == 'none') { // check that we're still hidden
                removeChild(popup);
                if (isFunction(remove)) {
                    remove();
                }
            }
        }, Control._FOCUS_INTERVAL + 50); // focus interval not quite enough (TFS 380552)
    }

    // remove scroll event handler
    let scrollHandler = popup[Control._SCRL_KEY];
    if (scrollHandler instanceof Control) {
        scrollHandler.dispose();
    }

    // remove popup keys
    delete popup[Control._SCRL_KEY];
    delete popup[Control._OWNR_KEY];
}

// checks whether an element is a jQuery dialog (TFS 274224)
// https://stackoverflow.com/questions/1505270/need-to-know-if-a-jquery-ui-widget-has-been-applied-to-a-dom-object
function _isjQueryDialog(e: HTMLElement): boolean {
    let jQuery = window['jQuery'],
        query = isFunction(jQuery) ? jQuery(e) : null;
    //return query && isFunction(query.dialog) && query.dialog('instance') != null;
    return query && isFunction(query.dialog) && hasClass(e, 'ui-dialog'); // TFS 325183
}

// get the element to use as a parent for the popup
function _getPopupParent(ref: any): HTMLElement {

    // calculate popup's parent element
    let parent = document.body;
    if (ref instanceof HTMLElement) {

        // 1 - make sure the reference is in the DOM
        if (!contains(document.body, ref)) {
            return parent;
        }

        // 2 - adjust the parent to account for ancestors with fixed position
        // or jQuery dialogs (which have special focus handling TFS 243224)
        // or native HTML dialogs (not supported in IE/Edge TFS 335828)
        // or Ionic app content (TFS 390662)
        for (let e = ref as HTMLElement; e; e = e.parentElement) {
            if (e.tagName == 'DIALOG' || e.tagName == 'ION-CONTENT' || // TFS 390662
                getComputedStyle(e).position == 'fixed') {
                parent = e;
                break;
            }
            if (_isjQueryDialog(e)) { // TFS 379125
                parent = e.querySelector('.ui-dialog-content') || e;
                break;
            }
        }
    }

    // done
    return parent;
}

// make popup visible and add it to DOM so it can be measured
function _addPopupToDOM(popup: HTMLElement, parent: HTMLElement): void {

    // do this only if necessary, otherwise there will be flicker
    // TFS 268902, 305094, 313367, 330715
    if (!popup.offsetHeight || !popup.offsetWidth || popup.parentElement != parent) {
        setCss(popup, {
            opacity: '0', // no flicker
            position: 'fixed', // no scrollbars
            left: 0,
            top: 0,
            transform: '',
            display: '' // visible
        });
        parent.appendChild(popup);
    }
}

// compute popup offset accounting for scroll/pinch zoom
// nasty: TFS 202906, 274224, 300174, 303015, 303317, 304114, 309199, 310245, 312929, 313367
function _getPopupOffset(popup: HTMLElement): Point {
    let body = document.body,
        doc = document.documentElement,
        parent = popup.parentElement,
        ptOffset = new Point(
            body.scrollLeft || pageXOffset, // TFS 310245: in Edge, body.scroll* is correct; everywhere else,
            body.scrollTop || pageYOffset   // body.scroll* is zero and page*Offset == docElement.scroll*
        );
    if (parent != body) {

        // handle offset when parent is not the body
        let elParent = (parent == body) ? doc : (popup.offsetParent || parent);
        if (elParent == body) { // needed in Firefox: TFS 336053
            elParent = parent;
        }
        // don't do this: TFS 336455, 274224
        //if (_isjQueryDialog(parent) && parent.offsetParent) {
        //    elParent = parent.offsetParent;
        //}
        if (elParent) {
            let rc = elParent.getBoundingClientRect();
            ptOffset = new Point(elParent.scrollLeft - rc.left, elParent.scrollTop - rc.top);
        }
    }

    // account for parent borders (TFS 335828)
    if (parent instanceof HTMLElement) { // TFS 439969
        let cs = getComputedStyle(parent);
        ptOffset.x -= parseFloat(cs.borderLeftWidth);
        ptOffset.y -= parseFloat(cs.borderTopWidth);
    }

    // done
    return ptOffset;
}

// copy main popup styles from ref or custom element
function _copyPopupStyles(popup: HTMLElement, ref: any, copyStyles: any) {
    if (ref instanceof HTMLElement && copyStyles) {
        let styleRef = copyStyles instanceof HTMLElement ? copyStyles : ref,
            csRef = getComputedStyle(styleRef),
            bkg = new Color(csRef.backgroundColor);
        if (bkg.a == 1) { // copy styles only if the background is solid
            setCss(popup, {
                color: csRef.color,
                backgroundColor: csRef.backgroundColor,
                fontFamily: csRef.fontFamily,
                fontSize: csRef.fontSize,
                fontWeight: csRef.fontWeight,
                fontStyle: csRef.fontStyle
            });
        }
    }
}

// hide the popup when a parent element scrolls
function _hidePopupOnscroll(popup: HTMLElement, ref: any, hideOnScroll: any) {
    let anchor = ref instanceof MouseEvent ? ref.target : ref;
    if (anchor instanceof HTMLElement && anchor.parentElement != document.body) {
        let start = Date.now(),
            bounds = anchor.getBoundingClientRect(),
            scrollHandler = new Control(document.createElement('div'));
        popup[Control._SCRL_KEY] = scrollHandler;
        scrollHandler.addEventListener(document, 'scroll', (e: UIEvent) => {
            if (e.target != popup.parentElement) { // TFS 335797
                if (Date.now() - start > 100) { // in case the popup caused the scroll (TFS 281046, 284767)
                    if (contains(document, anchor) && !contains(popup, e.target)) {
                        if (e.target != document || (ref != null && popup.style.position == 'fixed')) {
                            let newBounds = anchor.getBoundingClientRect(),
                                dx = Math.abs(newBounds.left - bounds.left),
                                dy = Math.abs(newBounds.top - bounds.top);
                            if (dx > 1 || dy > 1) { // TFS 269510, 270802

                                // call hideOnScroll function if provided
                                if (isFunction(hideOnScroll)) {
                                    hideOnScroll();
                                }

                                // hide the popup and remove it from the document
                                _hidePopup(popup, true);
                                scrollHandler.dispose(); // safety
                            }
                        }
                    }
                }
            }
        }, true);
    }
}

// compute the popup position
function _getPopupPosition(popup: HTMLElement, bounds: Rect, position: PopupPosition, ptOffset: Point): Point {

    // get reference rect
    let doc = document.documentElement,
        scrWid = doc.clientWidth, //innerWidth,
        scrHei = doc.clientHeight; //innerHeight;

    // apply minWidth to match bounds rect
    let PP = PopupPosition;
    switch (position) {
        case PP.AboveLeft: case PP.AboveRight:
        case PP.BelowLeft: case PP.BelowRight:
            if (bounds) {
                let minWidth = bounds.width;
                if (minWidth) { // TFS 457789, 458044
                    if (isIE()) { // discount scrollbar width in IE
                        minWidth -= (popup.offsetWidth - popup.clientWidth);
                    }
                    popup.style.minWidth = minWidth + 'px';
                }
            }
            break;
    }

    // compute popup margins, size, min width (TFS 433456)
    let csPopup = getComputedStyle(popup),
        my = parseFloat(csPopup.marginTop) + parseFloat(csPopup.marginBottom),
        mx = parseFloat(csPopup.marginLeft) + parseFloat(csPopup.marginRight),
        sz = new Size(popup.offsetWidth + mx, popup.offsetHeight + my);
    // center popup on the screen
    let pos = new Point((scrWid - sz.width) / 2, Math.round((scrHei - sz.height) / 2 * .7));

    // position popup with respect to reference rect
    if (bounds) {

        // handle RTL
        if (csPopup.direction == 'rtl') {
            position = _getRtlPosition(position);
        }

        // calculate popup's horizontal position
        let spcLeft = bounds.left,
            spcRight = scrWid - bounds.right;
        pos.x = bounds.left;
        switch (position) {
            case PP.Above: case PP.Below:
                pos.x = bounds.left + (bounds.width - sz.width) / 2;
                break;
            case PP.AboveLeft: case PP.BelowLeft:
                pos.x = bounds.left;
                break;
            case PP.AboveRight: case PP.BelowRight:
                pos.x = bounds.right - sz.width;
                break;
            case PP.Left: case PP.LeftTop: case PP.LeftBottom:
                pos.x = spcLeft >= sz.width || spcLeft >= spcRight ? bounds.left - sz.width : bounds.right;
                break;
            case PP.RightTop: case PP.RightBottom: case PP.Right:
                pos.x = spcRight >= sz.width || spcRight >= spcLeft ? bounds.right : bounds.left - sz.width;
                break;
        }

        // calculate popup's vertical position
        let spcAbove = bounds.top,
            spcBelow = scrHei - bounds.bottom;
        switch (position) {
            case PP.Above: case PP.AboveLeft: case PP.AboveRight:
                pos.y = spcAbove > sz.height || spcAbove > spcBelow ? bounds.top - sz.height : bounds.bottom;
                break;
            case PP.Below: case PP.BelowLeft: case PP.BelowRight:
                pos.y = spcBelow > sz.height || spcBelow > spcAbove ? bounds.bottom : bounds.top - sz.height;
                break;
            case PP.LeftTop: case PP.RightTop:
                pos.y = bounds.top;
                break;
            case PP.LeftBottom: case PP.RightBottom:
                pos.y = bounds.bottom - sz.height;
                break;
            case PP.Left: case PP.Right:
                pos.y = bounds.bottom - sz.height + (sz.height - bounds.height) / 2;
                break;
        }
    }

    // make sure the popup is on the screen
    pos.x = Math.min(pos.x, scrWid - sz.width);
    pos.y = Math.min(pos.y, scrHei - sz.height);
    pos.x = Math.max(0, pos.x) + ptOffset.x;
    pos.y = Math.max(0, pos.y) + ptOffset.y;
    // done
    return pos;
}

// switches a regular position to an RTL position
function _getRtlPosition(position: PopupPosition): PopupPosition {
    let PP = PopupPosition;
    switch (position) {
        case PP.AboveLeft: return PP.AboveRight;
        case PP.AboveRight: return PP.AboveLeft;
        case PP.BelowLeft: return PP.BelowRight;
        case PP.BelowRight: return PP.BelowLeft;
        case PP.Left: return PP.Right;
        case PP.LeftTop: return PP.RightTop;
        case PP.LeftBottom: return PP.RightBottom;
        case PP.Right: return PP.Left;
        case PP.RightTop: return PP.LeftTop;
        case PP.RightBottom: return PP.LeftBottom;
    }
    return position;
}

// gets the reference rectangle to use when positioning the popup
function _getReferenceRect(popup: HTMLElement, ref: any): Rect {

    if (ref instanceof MouseEvent) {
        if (ref.clientX <= 0 && ref.clientY <= 0 && ref.target instanceof HTMLElement) {
            // this looks like a fake mouse event (e.g. context menu key),
            // so use the event target as a reference TFS 117115
            return Rect.fromBoundingRect(ref.target.getBoundingClientRect());
        }

        // use ref.page*-page*Offset instead of ref.client*,
        // which should be the same but gives wrong results in some scenarios
        // (e.g. pinch-zoomed Chrome/Android)
        return new Rect(ref.pageX - pageXOffset, ref.pageY - pageYOffset, 0, 0);
    }

    if (ref instanceof Point) {
        return new Rect(ref.x, ref.y, 0, 0);
    }

    if (ref instanceof HTMLElement) {
        return Rect.fromBoundingRect(ref.getBoundingClientRect());
    }

    if (ref && ref.top != null && ref.left != null) {
        return ref as Rect;
    }

    // no reference rect
    return null;
}

    }
    


    module wijmo {
    




'use strict';

// information used to attach tooltips to elements
interface _ITooltipInfo {
    element: HTMLElement,
    content: string,
    position: PopupPosition
}

/**
 * Provides a pop-up window that displays additional information about 
 * elements on the page.
 *
 * The {@link Tooltip} class can be used in two modes:
 * 
 * **Automatic Mode:** Use the {@link setTooltip} method to connect 
 * the {@link Tooltip} to one or more elements on the page. The {@link Tooltip} 
 * will automatically monitor events and display the tooltips when the 
 * user performs actions that trigger the tooltip.
 * For example:
 *
 * ```typescript
 * import { Tooltip } from '@grapecity/wijmo';
 * let tt = new Tooltip();
 * tt.setTooltip('#menu', 'Select commands.');
 * tt.setTooltip('#tree', 'Explore the hierarchy.');
 * tt.setTooltip('#chart', '#idChartTooltip');
 * ```
 *
 * **Manual Mode:** The caller is responsible for showing and hiding 
 * the tooltip using the {@link show} and {@link hide} methods. For example:
 *
 * ```typescript
 * import { Tooltip } from '@grapecity/wijmo';
 * let tt = new Tooltip();
 * element.addEventListener('click', () => {
 *     if (tt.isVisible) {
 *         tt.hide();
 *     } else {
 *         tt.show(element, 'This is an important element!');
 *     }
 * });
 * ```
 * 
 * The example below shows how you can use the {@link Tooltip} class 
 * to add Excel-style notes to cells in a {@link FlexGrid} control:
 * 
 * {@sample Grid/CustomCells/CellNotes/purejs Example}
 */
export class Tooltip {

    // tooltip element
    /*private*/ static _eTip: HTMLElement;

    // private stuff
    private _toShow: any;
    private _toHide: any;
    private _showAutoTipBnd = this._showAutoTip.bind(this);
    private _hideAutoTipBnd = this._hideAutoTip.bind(this);
    private _mousemoveBnd = this._mousemove.bind(this);
    private _eMouse: MouseEvent;

    // property storage
    private _html = true;
    private _cssClass = '';
    private _gap = 6;
    private _isAnimated = false;
    private _position = PopupPosition.Above;
    private _showAtMouse = false;
    private _showDelay = 500;   // http://msdn.microsoft.com/en-us/library/windows/desktop/bb760404(v=vs.85).aspx
    private _hideDelay = 0;     // do not hide
    /*private*/ _tips: _ITooltipInfo[] = [];     // visible to FlexGrid

    /**
     * Initializes a new instance of the {@link Tooltip} class.
     *
     * @param options JavaScript object containing initialization data for the {@link Tooltip}.
     */
    constructor(options?: any) {
        copy(this, options);
    }

    // object model

    /**
     * Gets or sets the {@link PopupPosition} where the tooltip should be
     * displayed with respect to the owner element.
     * 
     * The default value for this property is **PopupPosition.Above**.
     */
    get position(): PopupPosition {
        return this._position;
    }
    set position(value: PopupPosition) {
        this._position = asEnum(value, PopupPosition);
    }
    /**
     * Gets or sets a value that determines whether tooltips should use a
     * fade-in animation when shown.
     * 
     * The default value for this property is **false**.
     */
    get isAnimated(): boolean {
        return this._isAnimated;
    }
    set isAnimated(value: boolean) {
        this._isAnimated = asBoolean(value);
    }
    /**
     * Assigns tooltip content to a given element on the page.
     *
     * The same tooltip may be used to display information for any number
     * of elements on the page. To remove the tooltip from an element, 
     * call {@link setTooltip} and specify null for the content.
     * 
     * To remove the tooltips for all elements, call the {@link dispose} method.
     *
     * @param element Element, single element CSS selector, or control that the tooltip explains.
     * @param content Tooltip content or ID of the element that contains the tooltip content.
     * @param position Position where the tooltip should be displayed with respect to the owner element.
     */
    setTooltip(element: any, content: string | null, position?: PopupPosition) {

        // get element and tooltip content
        element = getElement(element);
        content = this._getContent(content);

        // remove old version from list
        let i = this._indexOf(element);
        if (i > -1) {
            this._detach(element);
            this._tips.splice(i, 1);
        }

        // add new version to list
        if (content) {
            this._attach(element);
            this._tips.push({
                element: element,
                content: content,
                position: position
            });
        }

        // update the current tooltip if it refers to the given element
        let tip = Tooltip._eTip;
        if (tip && tip[Control._TTIP_KEY] == element) {
            if (content) {
                this._setContent(content);
            } else {
                this._hideAutoTip();
            }
        }
    }
    /**
     * Gets the tooltip content associated with a given element.
     *
     * @param element Element, element ID, or control that the tooltip explains.
     * @return Tooltip content associated with the given element.
     */
    getTooltip(element: any): string | null {
        element = getElement(element);
        let tips = this._tips;
        for (let i = 0; i < tips.length; i++) {
            if (tips[i].element == element) {
                return tips[i].content;
            }
        }
        return null;
    }
    /**
     * Shows a tooltip with the specified content next to the specified element.
     *
     * @param element Element, element ID, or control that the tooltip explains.
     * @param content Tooltip content or ID of the element that contains the tooltip content.
     * @param bounds Optional parameter that defines the bounds of the area that the tooltip 
     * targets. If not provided, the element bounds are used.
     * @param position Optional parameter that specifies the position of the tooltip
     * with respect to the reference bounds. If provided, this value overrides the setting
     * of the {@link position} property.
     */
    show(element: any, content: string, bounds?: Rect, position?: PopupPosition) {

        // get element and tooltip content
        element = getElement(element);
        content = this._getContent(content);

        // no element? can't show (TFS 422871)
        if (!element) {
            return;
        }

        // get tooltip position from property if not provided
        if (position == null) {
            position = this.position;
        }

        // create tooltip element if necessary
        let tip = Tooltip._eTip;
        if (!tip) {
            tip = Tooltip._eTip = document.createElement('div');
            addClass(tip, 'wj-tooltip');
            tip.style.visibility = 'none';
        }

        // set tooltip content
        addClass(tip, this.cssClass);
        this._setContent(content);

        // remember who owns this tooltip
        tip[Control._TTIP_KEY] = element;

        // fire event to allow customization
        let e = new TooltipEventArgs(content, element);
        this.onPopup(e);

        // if not canceled and content is present, show tooltip
        if (e.content && !e.cancel) {
            
            // update tooltip content with custom content, if any
            this._setContent(e.content);

            // get element bounds
            if (!bounds) {
                bounds = Rect.fromBoundingRect(element.getBoundingClientRect());
            }

            // add tooltip gap
            let gap = this.gap,
                PP = PopupPosition;
            if (gap) {
                switch (position) {
                    case PP.Above: case PP.AboveLeft: case PP.AboveRight:
                    case PP.Below: case PP.BelowLeft: case PP.BelowRight:
                        bounds = bounds.inflate(0, gap);
                        break;
                    default:
                        bounds = bounds.inflate(gap, 0);
                }
            }

            // show tooltip
            showPopup(tip, bounds, position, this.isAnimated);

            // hide when the mouse goes down
            document.addEventListener('mousedown', this._hideAutoTipBnd);
        }
    }
    /**
     * Hides the tooltip if it is currently visible.
     */
    hide() {

        // hide the tip
        let tip = Tooltip._eTip;
        if (tip) {
            removeChild(tip);
            removeClass(tip, this.cssClass);
            tip.innerHTML = '';
        }

        // remove the event listener we added on show (TFS 288390)
        document.removeEventListener('mousedown', this._hideAutoTipBnd);
    }
    /**
     * Removes all tooltips associated with this {@link Tooltip} instance.
     */
    dispose() {
        if (this.isVisible) {
            this.hide();
        }
        let tips = this._tips;
        if (tips.length) {
            tips.forEach(tip => {
                this._detach(tip.element);
            });
            tips.splice(0, tips.length);
        }
        this._clearTimeouts();
    }
    /**
     * Gets a value that determines whether the tooltip is currently visible.
     */
    get isVisible(): boolean {
        let tip = Tooltip._eTip;
        return tip != null && tip.parentElement != null && tip.offsetWidth > 0; // TFS 302981
    }
    /**
     * Gets or sets a value that determines whether the tooltip contents 
     * should be displayed as plain text or as HTML.
     * 
     * The default value for the property is **true**.
     */
    get isContentHtml(): boolean {
        return this._html;
    }
    set isContentHtml(value: boolean) {
        this._html = asBoolean(value);
    }
    /**
     * Gets or sets a CSS class name to add to the tooltip.
     * 
     * The default value for this property is an empty string.
     */
    get cssClass(): string {
        return this._cssClass;
    }
    set cssClass(value: string) {
        this._cssClass = asString(value);
    }
    /**
     * Gets or sets the distance between the tooltip and the target element.
     * 
     * The default value for the property is **6** pixels.
     */
    get gap(): number {
        return this._gap;
    }
    set gap(value: number) {
        this._gap = asNumber(value);
    }
    /**
     * Gets or sets a value that determines whether the tooltip should be
     * calculated based on the mouse position rather than the target element.
     * 
     * The default value for the property is **false**, which means
     * the tooltip position is calculated based on the target element.
     * 
     * The {@link position} property is used to determine the tooltip
     * position in respect to the target element or to the mouse 
     * position.
     */
    get showAtMouse(): boolean {
        return this._showAtMouse;
    }
    set showAtMouse(value: boolean) {
        this._showAtMouse = asBoolean(value);
    }
    /**
     * Gets or sets the delay, in milliseconds, before showing the tooltip 
     * after the mouse enters the target element.
     * 
     * The default value for the property is **500** milliseconds.
     */
    get showDelay(): number {
        return this._showDelay;
    }
    set showDelay(value: number) {
        this._showDelay = asInt(value);
    }
    /**
     * Gets or sets the delay, in milliseconds, before hiding the tooltip
     * if the mouse remains over the element.
     * 
     * The default value for the property is **zero** milliseconds,
     * which causes the tip to remain visible until the mouse moves
     * away from the element.
     */
    get hideDelay(): number {
        return this._hideDelay;
    }
    set hideDelay(value: number) {
        this._hideDelay = asInt(value);
    }

    /**
     * Occurs before the tooltip content is displayed.
     * 
     * The event handler may customize the tooltip content or suppress 
     * the tooltip display by changing the event parameters.
     */
    readonly popup = new Event<Tooltip, TooltipEventArgs>();
    /**
     * Raises the {@link popup} event.
     *
     * @param e {@link TooltipEventArgs} that contains the event data.
     */
    onPopup(e: TooltipEventArgs): boolean {
        if (this.popup) {
            this.popup.raise(this, e);
        }
        return !e.cancel;
    }

    // implementation

    // finds an element in the auto-tooltip list
    private _indexOf(e: Element): number {
        for (let i = 0; i < this._tips.length; i++) {
            if (this._tips[i].element == e) {
                return i;
            }
        }
        return -1;
    }

    // add event listeners to show and hide tooltips for an element
    private _attach(e: HTMLElement) {
        e.addEventListener('mouseenter', this._showAutoTipBnd);
        e.addEventListener('mouseleave', this._hideAutoTipBnd);
        e.addEventListener('click', this._showAutoTipBnd);
        if (this.showAtMouse) {
            e.addEventListener('mousemove', this._mousemoveBnd);
        }
    }

    // remove event listeners used to show and hide tooltips for an element
    private _detach(e: HTMLElement) {
        e.removeEventListener('mouseenter', this._showAutoTipBnd);
        e.removeEventListener('mouseleave', this._hideAutoTipBnd);
        e.removeEventListener('click', this._showAutoTipBnd);
        e.removeEventListener('mousemove', this._mousemoveBnd);
    }

    // shows an automatic tooltip
    private _showAutoTip(e: MouseEvent) {

        // not if prevented
        if (e.defaultPrevented) {
            return;
        }

        // hide and close if click is not a touch
        if (e.type == 'click' && !Control._touching) {
            this._hideAutoTip();
            return;
        }

        // show tip
        let showDelay = e.type == 'mouseenter' ? this._showDelay : 0,
            hideDelay = this._hideDelay;
        this._clearTimeouts();
        this._eMouse = e;
        this._toShow = setTimeout(() => {
            let i = this._indexOf(e.target as Element);
            if (i > -1) {
                let tip = this._tips[i],
                    evt = this._eMouse,
                    bounds = this._showAtMouse ? new Rect(evt.clientX, evt.clientY, 0, 0) : null;
                

                // make sure the target element is still visible (TFS 457750)
                const el = tip && tip.element;
                // using offsetHeight instead of scrollHeight, etc.,
                // this makes tooltips working on inline elements (span, b, ...) in Chrome Browser (JWM-20244)
                if (el && (el.offsetHeight || el.offsetWidth)) {
                    let ctl = Control.getControl(tip.element) as any;
                    if (ctl == null || ctl.isVisible != false) { // handle popups being hidden with a delay (TFS 457750)
                        this.show(tip.element, tip.content, bounds, tip.position);
                        if (hideDelay > 0) {
                            this._toHide = setTimeout(() => {
                                this.hide();
                            }, hideDelay);
                        }
                    }
                }
            }
        }, showDelay);
    }

    // keep track of mouse position before showing the tip
    _mousemove(e: MouseEvent) {
        this._eMouse = e;
    }

    // hides an automatic tooltip
    private _hideAutoTip() {
        this._clearTimeouts();
        this.hide();
    }

    // clears the timeouts used to show and hide automatic tooltips
    private _clearTimeouts() {
        if (this._toShow) {
            clearTimeout(this._toShow);
            this._toShow = null;
        }
        if (this._toHide) {
            clearTimeout(this._toHide);
            this._toHide = null;
        }
    }

    // gets content that may be a string or an element id
    private _getContent(content: string): string {
        content = asString(content);
        if (content && content[0] == '#') {
            let e = getElement(content);
            if (e) {
                content = e.innerHTML;
            }
        }
        return content;
    }

    // assigns content to the tooltip element
    private _setContent(content: string) {
        let tip = Tooltip._eTip;
        if (tip) {
            if (this._html) {
                tip.innerHTML = content;
            } else {
                tip.textContent = content;
            }
        }
    }
}

/**
 * Provides arguments for the {@link Tooltip.popup} event.
 */
export class TooltipEventArgs extends CancelEventArgs {
    private _content: string;
    private _e: HTMLElement;

    /**
     * Initializes a new instance of the {@link TooltipEventArgs} class.
     *
     * @param content String to show in the tooltip.
     * @param element HTMLElement that the tip refers to.
     */
    constructor(content: string, element?: HTMLElement) {
        super();
        this._content = asString(content);
        this._e = element;
    }

    /**
     * Gets a reference to the tooltip element.
     */
    get tip(): HTMLElement {
        return Tooltip._eTip;
    }
    /**
     * Gets a reference to the element that the tooltip refers to.
     */
    get element(): HTMLElement {
        return this._e;
    }
    /**
     * Gets or sets the content to show in the tooltip.
     *
     * This parameter can be used while handling the {@link Tooltip.popup}
     * event to modify the content of the tooltip.
     */
    get content(): string {
        return this._content;
    }
    set content(value: string) {
        this._content = asString(value);
    }
}

    }
    


    module wijmo {
    

_registerModule('wijmo', wijmo);




















    }
    


    module wijmo {

    }
    