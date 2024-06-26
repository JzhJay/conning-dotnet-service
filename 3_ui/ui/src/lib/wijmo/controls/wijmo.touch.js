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
var wijmo;
(function (wijmo) {
    var touch;
    (function (touch) {
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
        var DataTransfer = /** @class */ (function () {
            function DataTransfer() {
                this._dropEffect = 'move';
                this._effectAllowed = 'all';
                this._data = {};
            }
            Object.defineProperty(DataTransfer.prototype, "dropEffect", {
                /**
                 * Gets or sets the type of drag-and-drop operation currently selected.
                 * The value must be 'none',  'copy',  'link', or 'move'.
                 */
                get: function () {
                    return this._dropEffect;
                },
                set: function (value) {
                    this._dropEffect = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTransfer.prototype, "effectAllowed", {
                /**
                 * Gets or sets the types of operations that are possible.
                 * Must be one of 'none', 'copy', 'copyLink', 'copyMove', 'link',
                 * 'linkMove', 'move', 'all' or 'uninitialized'.
                 */
                get: function () {
                    return this._effectAllowed;
                },
                set: function (value) {
                    this._effectAllowed = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataTransfer.prototype, "types", {
                /**
                 * Gets an array of strings giving the formats that were set in the
                 * **dragstart** event.
                 */
                get: function () {
                    return Object.keys(this._data);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Removes the data associated with a given type.
             *
             * The type argument is optional. If the type is empty or not specified, the data
             * associated with all types is removed. If data for the specified type does not exist,
             * or the data transfer contains no data, this method will have no effect.
             *
             * @param type Type of data to remove.
             */
            DataTransfer.prototype.clearData = function (type) {
                if (type != null) {
                    delete this._data[type];
                }
                else {
                    this._data = null;
                }
            };
            /**
             * Retrieves the data for a given type, or an empty string if data for that type does
             * not exist or the data transfer contains no data.
             *
             * @param type Type of data to retrieve.
             */
            DataTransfer.prototype.getData = function (type) {
                return this._data[type] || '';
            };
            /**
             * Set the data for a given type.
             *
             * For a list of recommended drag types, please see
             * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Recommended_Drag_Types.
             *
             * @param type Type of data to add.
             * @param value Data to add.
             */
            DataTransfer.prototype.setData = function (type, value) {
                this._data[type] = value;
            };
            /**
             * Set the image to be used for dragging if a custom one is desired.
             *
             * @param img An image element to use as the drag feedback image.
             * @param offsetX The horizontal offset within the image.
             * @param offsetY The vertical offset within the image.
             */
            DataTransfer.prototype.setDragImage = function (img, offsetX, offsetY) {
                var ddt = DragDropTouch._instance;
                ddt._imgCustom = img;
                ddt._imgOffset = new wijmo.Point(offsetX, offsetY);
            };
            return DataTransfer;
        }());
        touch.DataTransfer = DataTransfer;
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
        var DragDropTouch = /** @class */ (function () {
            /**
             * Initializes the single instance of the {@link DragDropTouch} class.
             */
            function DragDropTouch() {
                this._lastClick = 0;
                // enforce singleton pattern
                wijmo.assert(!DragDropTouch._instance, 'DragDropTouch instance already created.');
                // detect passive event support
                // https://github.com/Modernizr/Modernizr/issues/1894
                var supportsPassive = false;
                document.addEventListener('test', function () { }, {
                    get passive() {
                        supportsPassive = true;
                        return true;
                    }
                });
                // listen to touch events
                var d = document, ts = this._touchstart.bind(this), tm = this._touchmove.bind(this), te = this._touchend.bind(this), opt = supportsPassive ? { passive: false, capture: false } : false;
                d.addEventListener('touchstart', ts, opt);
                d.addEventListener('touchmove', tm, opt);
                d.addEventListener('touchend', te);
                d.addEventListener('touchcancel', te);
            }
            /**
             * Gets a reference to the {@link DragDropTouch} singleton.
             */
            DragDropTouch.getInstance = function () {
                return DragDropTouch._instance;
            };
            // ** event handlers
            DragDropTouch.prototype._touchstart = function (e) {
                if (this._shouldHandle(e)) {
                    var target = e.target;
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
                        var src = wijmo.closest(e.target, '[draggable]');
                        if (src && src.draggable) {
                            this._dragSource = src;
                            this._ptDown = this._getPoint(e);
                        }
                    }
                }
            };
            DragDropTouch.prototype._touchmove = function (e) {
                if (this._shouldHandle(e)) {
                    this._lastTouch = e;
                    // see if target wants to handle move
                    var target = this._getTarget(e);
                    if (this._dispatchEvent(e, 'mousemove', target)) {
                        e.preventDefault();
                        return;
                    }
                    // start dragging
                    if (this._dragSource && !this._img) {
                        var delta = this._getDelta(e);
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
            };
            DragDropTouch.prototype._touchend = function (e) {
                if (this._shouldHandle(e)) {
                    var target = e.target, evt = this._lastTouch;
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
            };
            // ** utilities
            // ignore events that have been handled or that involve more than one touch
            DragDropTouch.prototype._shouldHandle = function (e) {
                return e &&
                    !e.defaultPrevented &&
                    e.touches && e.touches.length < 2;
            };
            // clear all members
            DragDropTouch.prototype._reset = function () {
                this._destroyImage();
                this._dragSource = null;
                this._lastTouch = null;
                this._lastTarget = null;
                this._ptDown = null;
                this._dataTransfer = new DataTransfer();
            };
            // get point for a touch event
            DragDropTouch.prototype._getPoint = function (e, page) {
                if (e && e.touches) {
                    e = e.touches[0];
                }
                wijmo.assert(e && ('clientX' in e), 'invalid event?');
                if (page == true) {
                    return new wijmo.Point(e.pageX, e.pageY);
                }
                else {
                    return new wijmo.Point(e.clientX, e.clientY);
                }
            };
            // get distance between the current touch event and the first one
            DragDropTouch.prototype._getDelta = function (e) {
                var p = this._getPoint(e);
                return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
            };
            // get the element at a given touch event
            DragDropTouch.prototype._getTarget = function (e) {
                var pt = this._getPoint(e), el = document.elementFromPoint(pt.x, pt.y);
                while (el && getComputedStyle(el).pointerEvents == 'none') {
                    el = el.parentElement;
                }
                return el;
            };
            // create drag image from source element
            DragDropTouch.prototype._createImage = function (e) {
                // just in case...
                if (this._img) {
                    this._destroyImage();
                }
                // create drag image from custom element or drag source
                var src = this._imgCustom || this._dragSource;
                this._img = src.cloneNode(true);
                this._copyStyle(src, this._img);
                this._img.style.top = this._img.style.left = '-9999px';
                // if creating from drag source, apply offset and opacity
                if (!this._imgCustom) {
                    var rc = src.getBoundingClientRect(), pt = this._getPoint(e);
                    this._imgOffset = new wijmo.Point(pt.x - rc.left, pt.y - rc.top);
                    this._img.style.opacity = DragDropTouch._OPACITY.toString();
                }
                // add image to document
                this._moveImage(e);
                document.body.appendChild(this._img);
            };
            // dispose of drag image element
            DragDropTouch.prototype._destroyImage = function () {
                if (this._img && this._img.parentElement) {
                    this._img.parentElement.removeChild(this._img);
                }
                this._img = null;
                this._imgCustom = null;
            };
            // move the drag image element
            DragDropTouch.prototype._moveImage = function (e) {
                var _this = this;
                requestAnimationFrame(function () {
                    if (_this._img) {
                        var pt = _this._getPoint(e, true);
                        wijmo.setCss(_this._img, {
                            position: 'absolute',
                            pointerEvents: 'none',
                            zIndex: 999999,
                            left: Math.round(pt.x - _this._imgOffset.x),
                            top: Math.round(pt.y - _this._imgOffset.y)
                        });
                    }
                });
            };
            // copy properties from an object to another
            DragDropTouch.prototype._copyProps = function (dst, src, props) {
                for (var prop in src) {
                    if (props.test(prop)) {
                        dst[prop] = src[prop];
                    }
                }
            };
            // copy styles/attributes from drag source to drag image element
            DragDropTouch.prototype._copyStyle = function (src, dst) {
                // remove potentially troublesome attributes
                ['id', 'class', 'style', 'draggable'].forEach(function (att) {
                    dst.removeAttribute(att);
                });
                // copy canvas content
                if (src instanceof HTMLCanvasElement) {
                    var cSrc = src, cDst = dst;
                    cDst.width = cSrc.width;
                    cDst.height = cSrc.height;
                    cDst.getContext('2d').drawImage(cSrc, 0, 0);
                }
                // copy style (without transitions)
                var cs = getComputedStyle(src);
                for (var i = 0; i < cs.length; i++) {
                    var key = cs[i];
                    if (key.indexOf('transition') < 0 && key.indexOf('transform') < 0) {
                        dst.style[key] = cs[key];
                    }
                }
                dst.style.pointerEvents = 'none';
                // and repeat for all children
                for (var i = 0; i < src.children.length; i++) {
                    this._copyStyle(src.children[i], dst.children[i]);
                }
            };
            // synthesize and dispatch an event
            // returns true if the event has been handled (e.preventDefault == true)
            DragDropTouch.prototype._dispatchEvent = function (e, type, target) {
                if (e && target) {
                    var evt = document.createEvent('Event'), t = e.touches ? e.touches[0] : e;
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
            };
            /*private*/ DragDropTouch._instance = new DragDropTouch(); // singleton
            // constants
            DragDropTouch._THRESHOLD = 5; // pixels to move before drag starts
            DragDropTouch._OPACITY = 0.5; // drag image opacity
            DragDropTouch._DBLCLICK = 500; // max ms between clicks in a double click
            DragDropTouch._CTXMENU = 900; // ms to hold before raising 'contextmenu' event
            return DragDropTouch;
        }());
        touch.DragDropTouch = DragDropTouch;
    })(touch = wijmo.touch || (wijmo.touch = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var touch;
    (function (touch) {
        // Entry file. All real code files should be re-exported from here.
        wijmo._registerModule('wijmo.touch', wijmo.touch);
    })(touch = wijmo.touch || (wijmo.touch = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.touch.js.map