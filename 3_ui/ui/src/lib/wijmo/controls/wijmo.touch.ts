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


    module wijmo.touch {
    



/**
 * Object used to hold the data that is being dragged during drag and drop operations. 
 *
 * It may hold one or more data items of different types. For more information about 
 * drag and drop operations and data transfer objects, see 
 * [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer).
 *
 * This object is created automatically by the {@link DragDropTouch} singleton and is 
 * accessible through the {@link dataTransfer} property of all drag events.
 */
export class DataTransfer {
    private _dropEffect = 'move';
    private _effectAllowed = 'all';
    private _data = {};

    /**
     * Gets or sets the type of drag-and-drop operation currently selected.
     * The value must be 'none',  'copy',  'link', or 'move'.
     */
    get dropEffect(): string {
        return this._dropEffect;
    }
    set dropEffect(value: string) {
        this._dropEffect = wijmo.asString(value);
    }
    /**
     * Gets or sets the types of operations that are possible.
     * Must be one of 'none', 'copy', 'copyLink', 'copyMove', 'link', 
     * 'linkMove', 'move', 'all' or 'uninitialized'.
     */
    get effectAllowed(): string {
        return this._effectAllowed;
    }
    set effectAllowed(value: string) {
        this._effectAllowed = wijmo.asString(value);
    }
    /**
     * Gets an array of strings giving the formats that were set in the
     * **dragstart** event.
     */
    get types(): string[] {
        return Object.keys(this._data);
    }
    /**
     * Removes the data associated with a given type.
     *
     * The type argument is optional. If the type is empty or not specified, the data 
     * associated with all types is removed. If data for the specified type does not exist, 
     * or the data transfer contains no data, this method will have no effect.
     *
     * @param type Type of data to remove.
     */
    clearData(type?: string) {
        if (type != null) {
            delete this._data[type];
        } else {
            this._data = null;
        }
    }
    /**
     * Retrieves the data for a given type, or an empty string if data for that type does 
     * not exist or the data transfer contains no data.
     *
     * @param type Type of data to retrieve.
     */
    getData(type: string): string {
        return this._data[type] || '';
    }
    /**
     * Set the data for a given type.
     *
     * For a list of recommended drag types, please see
     * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Recommended_Drag_Types.
     *
     * @param type Type of data to add.
     * @param value Data to add.
     */
    setData(type: string, value: string) {
        this._data[type] = value;
    }
    /**
     * Set the image to be used for dragging if a custom one is desired.
     *  
     * @param img An image element to use as the drag feedback image.
     * @param offsetX The horizontal offset within the image.
     * @param offsetY The vertical offset within the image.
     */
    setDragImage(img: HTMLElement, offsetX: number, offsetY: number) {
        let ddt = DragDropTouch._instance;
        ddt._imgCustom = img;
        ddt._imgOffset = new wijmo.Point(offsetX, offsetY);
    }
}

/**
 * Defines a class that adds support for touch-based HTML5 drag/drop 
 * operations.
 *
 * The purpose of this class is to enable using existing, standard HTML5 
 * drag/drop code on mobile devices running IOS or Android.
 * 
 * To use it, import the module into your application using this statement:
 * 
 * ```typescript
 * import '@grapecity/wijmo.touch';
 * ```
 * 
 * This will create a single instance of a {@link DragDropTouch} that
 * listens to touch events and raises the appropriate HTML5 drag/drop
 * events as if they had been caused by mouse actions.
 *
 * For details and examples on HTML drag and drop, see
 * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations.
 */
export class DragDropTouch {
    private _dragSource: HTMLElement;
    private _img: HTMLElement;
    private _ptDown: wijmo.Point;
    private _lastTouch: TouchEvent;
    private _lastTarget: Element;
    private _lastClick = 0;
    private _dataTransfer: DataTransfer;
    /*private*/ _imgCustom: HTMLElement;
    /*private*/ _imgOffset: wijmo.Point;
    /*private*/ static _instance = new DragDropTouch(); // singleton

    // constants
    private static _THRESHOLD = 5;   // pixels to move before drag starts
    private static _OPACITY = 0.5;   // drag image opacity
    private static _DBLCLICK = 500;  // max ms between clicks in a double click
    private static _CTXMENU = 900;   // ms to hold before raising 'contextmenu' event

    /**
     * Initializes the single instance of the {@link DragDropTouch} class.
     */
    constructor() {

        // enforce singleton pattern
        wijmo.assert(!DragDropTouch._instance, 'DragDropTouch instance already created.');

        // detect passive event support
        // https://github.com/Modernizr/Modernizr/issues/1894
        let supportsPassive = false;
        document.addEventListener('test', () => { }, {
            get passive() {
                supportsPassive = true;
                return true;
            }
        } as any);

        // listen to touch events
        let d = document,
            ts = this._touchstart.bind(this),
            tm = this._touchmove.bind(this),
            te = this._touchend.bind(this),
            opt = supportsPassive ? { passive: false, capture: false } : false;
        d.addEventListener('touchstart', ts, opt as any);
        d.addEventListener('touchmove', tm, opt as any);
        d.addEventListener('touchend', te);
        d.addEventListener('touchcancel', te);
    }

    /**
     * Gets a reference to the {@link DragDropTouch} singleton.
     */
    public static getInstance(): DragDropTouch {
        return DragDropTouch._instance;
    }

    // ** event handlers
    _touchstart(e: any) {
        if (this._shouldHandle(e)) {
            let target = e.target;

            // raise double-click and prevent zooming
            if (Date.now() - this._lastClick < DragDropTouch._DBLCLICK) {
                if (this._dispatchEvent(e, 'dblclick', target)) {
                    e.preventDefault();
                    this._reset();
                    return;
                }
            }

            // clear all variables
            this._reset();

            // remember the touch event
            this._lastTouch = e;

            // give caller a chance to handle the hover/move events (TFS 469283)
            if (!this._dispatchEvent(e, 'mousemove', target) &&
                !this._dispatchEvent(e, 'mousedown', target)) {
                
                // get nearest draggable element and prepare to drag
                let src = wijmo.closest(e.target, '[draggable]') as HTMLElement;
                if (src && src.draggable) { 
                    this._dragSource = src;
                    this._ptDown = this._getPoint(e);
                }
            }

        }
    }
    _touchmove(e: any) {
        if (this._shouldHandle(e)) {
            this._lastTouch = e;

            // see if target wants to handle move
            let target = this._getTarget(e);
            if (this._dispatchEvent(e, 'mousemove', target)) {
                e.preventDefault();
                return;
            }

            // start dragging
            if (this._dragSource && !this._img) {
                let delta = this._getDelta(e);
                if (delta > DragDropTouch._THRESHOLD) {
                    this._dispatchEvent(e, 'dragstart', this._dragSource);
                    this._createImage(e);
                    this._dispatchEvent(e, 'dragenter', target);
                }
            }

            // continue dragging
            if (this._img) {
                e.preventDefault(); // prevent scrolling
                if (target != this._lastTarget) {
                    this._dispatchEvent(e, 'dragleave', this._lastTarget);
                    this._dispatchEvent(e, 'dragenter', target);
                    this._lastTarget = target;
                }
                this._moveImage(e);
                this._dispatchEvent(e, 'dragover', target);
            }
        }
    }
    _touchend(e: any) {
        if (this._shouldHandle(e)) {
            let target = e.target,
                evt = this._lastTouch;

            // see if target wants to handle up
            if (this._dispatchEvent(evt, 'mouseup', target)) {
                e.preventDefault();
                return;
            }

            // finish dragging
            this._destroyImage();
            if (this._dragSource) {
                if (e.type.indexOf('cancel') < 0) {
                    this._dispatchEvent(evt, 'drop', this._lastTarget);
                }
                this._dispatchEvent(evt, 'dragend', this._dragSource);
                this._reset();
            }
        }
    }

    // ** utilities

    // ignore events that have been handled or that involve more than one touch
    _shouldHandle(e: TouchEvent): boolean {
        return e &&
            !e.defaultPrevented &&
            e.touches && e.touches.length < 2;
    }

    // clear all members
    _reset() {
        this._destroyImage();
        this._dragSource = null;
        this._lastTouch = null;
        this._lastTarget = null;
        this._ptDown = null;
        this._dataTransfer = new DataTransfer();
    }

    // get point for a touch event
    _getPoint(e: any, page?: boolean): wijmo.Point {
        if (e && e.touches) {
            e = e.touches[0];
        }
        wijmo.assert(e && ('clientX' in e), 'invalid event?');
        if (page == true) {
            return new wijmo.Point(e.pageX, e.pageY);
        } else {
            return new wijmo.Point(e.clientX, e.clientY);
        }
    }

    // get distance between the current touch event and the first one
    _getDelta(e: any): number {
        let p = this._getPoint(e);
        return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
    }

    // get the element at a given touch event
    _getTarget(e: any) {
        let pt = this._getPoint(e),
            el = document.elementFromPoint(pt.x, pt.y);
        while (el && getComputedStyle(el).pointerEvents == 'none') {
            el = el.parentElement;
        }
        return el;
    }

    // create drag image from source element
    _createImage(e: any) {

        // just in case...
        if (this._img) {
            this._destroyImage();
        }

        // create drag image from custom element or drag source
        let src = this._imgCustom || this._dragSource;
        this._img = src.cloneNode(true) as HTMLElement;
        this._copyStyle(src, this._img);
        this._img.style.top = this._img.style.left = '-9999px';

        // if creating from drag source, apply offset and opacity
        if (!this._imgCustom) {
            let rc = src.getBoundingClientRect(),
                pt = this._getPoint(e);
            this._imgOffset = new wijmo.Point(pt.x - rc.left, pt.y - rc.top);
            this._img.style.opacity = DragDropTouch._OPACITY.toString();
        }

        // add image to document
        this._moveImage(e);
        document.body.appendChild(this._img);
    }

    // dispose of drag image element
    _destroyImage() {
        if (this._img && this._img.parentElement) {
            this._img.parentElement.removeChild(this._img);
        }
        this._img = null;
        this._imgCustom = null;
    }

    // move the drag image element
    _moveImage(e: any) {
        requestAnimationFrame(() => {
            if (this._img) {
                let pt = this._getPoint(e, true);
                wijmo.setCss(this._img, {
                    position: 'absolute',
                    pointerEvents: 'none',
                    zIndex: 999999,
                    left: Math.round(pt.x - this._imgOffset.x),
                    top: Math.round(pt.y - this._imgOffset.y)
                });
            }
        });
    }

    // copy properties from an object to another
    _copyProps(dst: any, src: any, props: RegExp) {
        for (let prop in src) {
            if (props.test(prop)) {
                dst[prop] = src[prop];
            }
        }
    }

    // copy styles/attributes from drag source to drag image element
    _copyStyle(src: HTMLElement, dst: HTMLElement) {

        // remove potentially troublesome attributes
        ['id', 'class', 'style', 'draggable'].forEach(att => {
            dst.removeAttribute(att);
        });

        // copy canvas content
        if (src instanceof HTMLCanvasElement) {
            let cSrc = src as HTMLCanvasElement,
                cDst = dst as HTMLCanvasElement;
            cDst.width = cSrc.width;
            cDst.height = cSrc.height;
            cDst.getContext('2d').drawImage(cSrc, 0, 0);
        }

        // copy style (without transitions)
        let cs = getComputedStyle(src);
        for (let i = 0; i < cs.length; i++) {
            let key = cs[i];
            if (key.indexOf('transition') < 0 && key.indexOf('transform') < 0) {
                dst.style[key] = cs[key];
            }
        }
        dst.style.pointerEvents = 'none';

        // and repeat for all children
        for (let i = 0; i < src.children.length; i++) {
            this._copyStyle(src.children[i] as HTMLElement, dst.children[i] as HTMLElement);
        }
    }

    // synthesize and dispatch an event
    // returns true if the event has been handled (e.preventDefault == true)
    _dispatchEvent(e: any, type: string, target: Element): boolean {
        if (e && target) {
            let evt = document.createEvent('Event') as any,
                t = e.touches ? e.touches[0] : e;
            evt.initEvent(type, true, true);
            evt.button = 0;
            evt.which = evt.buttons = 1;
            this._copyProps(evt, e, /Key$/);
            this._copyProps(evt, t, /(X|Y)$/);
            evt.dataTransfer = this._dataTransfer;
            target.dispatchEvent(evt);
            return evt.defaultPrevented;
        }
        return false;
    }
}

    }
    


    module wijmo.touch {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.touch', wijmo.touch);



    }
    