"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.isDarkTheme=void 0;var tslib_1=require("tslib");require("../configureDom4");var Classes=tslib_1.__importStar(require("../classes"));function isDarkTheme(e){return null!=e&&e instanceof Element&&null!=e.closest("."+Classes.DARK)}exports.isDarkTheme=isDarkTheme;