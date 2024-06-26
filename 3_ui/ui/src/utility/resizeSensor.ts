/**
 * Adapted from:  https://github.com/flowkey/resize-sensor/blob/master/ResizeSensor.js
 *
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 *
 * MIT License
 */



/**
 * Class for dimension change detection.
 *
 * @param {Element|Element[]|Elements|jQuery} element
 * @param {Function} callback
 *
 * @constructor
 */
export class ResizeSensor {
    constructor(private element, callback) {
        let requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
	        (window as any).webkitRequestAnimationFrame ||
            function (fn) {
                return window.setTimeout(fn, 20);
            };

        /**
         *
         * @constructor
         */
        function EventQueue() {
            this.q = [];
            this.add = function (ev) {
                this.q.push(ev);
            };

            let i, j;
            this.call = function () {
                for (i = 0, j = this.q.length; i < j; i++) {
                    this.q[i].call();
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {String}      prop
         * @returns {String|Number}
         */
        function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @param {Function}    resized
         */
        function attachResizeEvent(element, resized) {
			if (!element) {
				return;
            } else if (!element.resizedAttached) {
                element.resizedAttached = new EventQueue();
                element.resizedAttached.add(resized);
            } else if (element.resizedAttached) {
                element.resizedAttached.add(resized);
                return;
            }

            element.resizeSensor = document.createElement('div');
            element.resizeSensor.className = 'resize-sensor';
            let style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;';
            let styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';

            element.resizeSensor.style.cssText = style;
            element.resizeSensor.innerHTML =
                '<div class="resize-sensor-expand" style="' + style + '">' +
                '<div style="' + styleChild + '"></div>' +
                '</div>' +
                '<div class="resize-sensor-shrink" style="' + style + '">' +
                '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
                '</div>';
            element.appendChild(element.resizeSensor);

            if (getComputedStyle(element, 'position') === 'static') {
                element.style.position = 'relative';
            }

            let expand = element.resizeSensor.childNodes[0];
            let expandChild = expand.childNodes[0] as HTMLElement;
            let shrink = element.resizeSensor.childNodes[1];

            let reset = function () {
                expandChild.style.width = 100000 + 'px';
                expandChild.style.height = 100000 + 'px';

                expand.scrollLeft = 100000;
                expand.scrollTop = 100000;

                shrink.scrollLeft = 100000;
                shrink.scrollTop = 100000;
            };

            reset();
            let dirty = false;

            let dirtyChecking = function () {
                if (!element.resizedAttached) return;

                if (dirty) {
                    element.resizedAttached.call();
                    dirty = false;
                }

                requestAnimationFrame(dirtyChecking);
            };

            requestAnimationFrame(dirtyChecking);
            let lastWidth, lastHeight;
            let cachedWidth, cachedHeight; //useful to not query offsetWidth twice

            let onScroll = function () {
                if ((cachedWidth = element.offsetWidth) !== lastWidth || (cachedHeight = element.offsetHeight) !== lastHeight) {
                    dirty = true;

                    lastWidth = cachedWidth;
                    lastHeight = cachedHeight;
                }
                reset();
            };

            let addEvent = function (el, name, cb) {
                if (el.attachEvent) {
                    el.attachEvent('on' + name, cb);
                } else {
                    el.addEventListener(name, cb);
                }
            };

            addEvent(expand, 'scroll', onScroll);
            addEvent(shrink, 'scroll', onScroll);
        }

        let elementType = Object.prototype.toString.call(element);
        let isCollectionTyped = ('[object Array]' === elementType
            || ('[object NodeList]' === elementType)
            || ('[object HTMLCollection]' === elementType)
            || ('undefined' !== typeof jQuery && element instanceof jQuery) //jquery
        );

        if (isCollectionTyped) {
            let i = 0, j = element.length;
            for (; i < j; i++) {
                attachResizeEvent(element[i], callback);
            }
        } else {
            attachResizeEvent(element, callback);
        }
    };

    detach = () => {
        if (this.element.resizeSensor) {
            this.element.removeChild(this.element.resizeSensor);
            delete this.element.resizeSensor;
            delete this.element.resizedAttached;
        }
    };
}
