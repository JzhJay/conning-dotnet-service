/**
 * Scott Lewis 2015-12-31
 *
 * This is a plugin for use with Iconic to avoid repeating a lot of code in
 * every SVG file. You should include this JS file in your HTML just before the
 * iconic.min.js is loaded.
 *
 * Usage:
 *
 *     $c(t).on(".selector-name");
 *     $c(t).on([".selector-one", ".selector-two"]);
 *     $c(t).off() ...
 *     $c().log("Your log message"); // Add window.logging = true; before calling
 */
window.$c = window.$c || function (svg) {
        //var debug = require('debug')('scott-iconic');
        
        var objects = {};
        
        objects.svg = svg;

        /**
         * Shows an element or array of elements
         * @param s (array|string) A string selector or list of string selectors
         * @return void
         */
        objects.on = function (s) {
            //debug("showing " + s);
            objects._(s, "display", "inline");
        }
        /**
         * Hides an element or array of elements
         * @param s (array|string) A string selector or list of string selectors
         * @return void
         */
        objects.off = function (s) {
            //debug("hiding " + s);
            objects._(s, "display", "none");
        }
        /**
         * Sets an attribute on an element or array of elements indicated by 's'
         * @param s (array|string) A string selector or list of string selectors
         * @return void
         */
        objects._ = function (s, k, v) {
            if (typeof(s) != "object") s = [s];
            for (x = 0; x < s.length; x++) {
                var e = objects.svg.querySelectorAll(s[x]);
                for (i = 0; i < e.length; i++) e[i].setAttribute(k, v);
            }
        }

        objects.log = function (m) {
            //if (!window.logging) return;
            //debug(m)
        }

        return objects;
    }
