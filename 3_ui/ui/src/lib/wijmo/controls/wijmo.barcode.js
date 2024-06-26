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
    var barcode;
    (function (barcode) {
        var alignmentMap = {
            center: 'middle',
            left: 'start',
            right: 'end'
        };
        var SVGRenderContext = /** @class */ (function () {
            function SVGRenderContext(dom, style, scale) {
                this.dom = dom;
                this.style = style;
                this.scale = scale;
                this.color = 'rgb(0,0,0)';
                this.addGroup();
            }
            SVGRenderContext.prototype.setColor = function (color) {
                this.color = color;
            };
            SVGRenderContext.prototype.setBackgroundColor = function (color) {
                var dom = this.dom;
                dom.style.backgroundColor = color;
            };
            SVGRenderContext.prototype.addGroup = function () {
                var dom = this.dom;
                this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                this.g.setAttribute('shape-rendering', 'crispEdges');
                dom.appendChild(this.g);
            };
            SVGRenderContext.prototype.drawRect = function (shape) {
                var _a = this, g = _a.g, scale = _a.scale, color = _a.color;
                var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', (shape.x * scale).toString());
                rect.setAttribute('y', (shape.y * scale).toString());
                rect.setAttribute('width', (shape.width * scale).toString());
                rect.setAttribute('height', (shape.height * scale).toString());
                rect.style.fill = color;
                g.appendChild(rect);
            };
            SVGRenderContext.prototype.drawText = function (shape) {
                var _a = this, g = _a.g, scale = _a.scale, color = _a.color, style = _a.style;
                var textNode = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                textNode.style.fill = color;
                textNode.style.fontSize = style.fontSize;
                textNode.style.fontFamily = style.fontFamily;
                textNode.style.fontStyle = shape.fontStyle || style.fontStyle;
                textNode.style.fontWeight = shape.fontWeight || style.fontWeight;
                textNode.style.textDecoration = shape.textDecoration || style.textDecoration;
                textNode.style.textAnchor = alignmentMap[shape.textAlign || style.textAlign];
                textNode.textContent = shape.text;
                textNode.textContent = this.clipString(shape, textNode);
                var textSize = this._measureText(textNode);
                textNode.setAttribute('y', (shape.y * scale + Math.abs(textSize.y)).toString());
                textNode.setAttribute('x', (shape.x * scale).toString());
                g.appendChild(textNode);
            };
            SVGRenderContext.prototype.clipString = function (shape, textNode) {
                var scale = this.scale;
                var text = shape.text, maxWidth = shape.maxWidth;
                var textSize = this._measureText(textNode);
                maxWidth *= scale;
                if (textSize.width > maxWidth) {
                    var capacity = Math.floor(maxWidth / textSize.width * text.length);
                    return shape.text.substr(0, capacity);
                }
                return text;
            };
            SVGRenderContext.prototype.clear = function () {
                var dom = this.dom;
                dom.removeChild(this.g);
                this.addGroup();
            };
            SVGRenderContext.prototype._measureText = function (textNode) {
                var dummySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                dummySvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                dummySvg.style.visibility = 'hidden';
                dummySvg.style.position = 'absolute';
                textNode.setAttribute('x', 0);
                textNode.setAttribute('y', 0);
                dummySvg.appendChild(textNode);
                document.body.appendChild(dummySvg);
                var size = textNode.getBBox();
                document.body.removeChild(dummySvg);
                return size;
            };
            SVGRenderContext.prototype.getDataUrl = function () {
                // let serializer = new XMLSerializer();
                // let svgStr = serializer.serializeToString(this.dom);
                return 'data:image/svg+xml;base64,' + btoa(this.dom.outerHTML);
            };
            return SVGRenderContext;
        }());
        barcode.SVGRenderContext = SVGRenderContext;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var CanvasRenderContext = /** @class */ (function () {
            function CanvasRenderContext(dom, style, scale) {
                this.dom = dom;
                this.style = style;
                this.ctx = this.dom.getContext('2d');
                this.scale = scale;
            }
            CanvasRenderContext.prototype.setColor = function (color) {
                this.ctx.fillStyle = color;
            };
            CanvasRenderContext.prototype.setBackgroundColor = function (color) {
                var _a = this, ctx = _a.ctx, dom = _a.dom;
                ctx.save();
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, dom.width, dom.height);
                ctx.restore();
            };
            CanvasRenderContext.prototype.drawRect = function (shape) {
                var _a = this, ctx = _a.ctx, scale = _a.scale;
                ctx.fillRect(shape.x * scale, shape.y * scale, shape.width * scale, shape.height * scale);
            };
            CanvasRenderContext.prototype.drawText = function (shape) {
                var _a = this, ctx = _a.ctx, style = _a.style, scale = _a.scale;
                ctx.save();
                ctx.font = (shape.fontStyle || style.fontStyle) + " " + (shape.fontWeight || style.fontWeight) + " " + style.fontSize + " " + style.fontFamily;
                ctx.textAlign = shape.textAlign || style.textAlign;
                ctx.textBaseline = 'bottom';
                var x = shape.x * scale;
                var y = shape.y * scale;
                var text = this.clipString(shape);
                ctx.fillText(text, x, y + style.fontHeight);
                this.drawTextDecorationLine(text, x, y, shape.textDecoration || style.textDecoration);
                ctx.restore();
            };
            CanvasRenderContext.prototype.clipString = function (shape) {
                var _a = this, ctx = _a.ctx, scale = _a.scale;
                var text = shape.text, maxWidth = shape.maxWidth;
                var textSize = ctx.measureText(text);
                maxWidth *= scale;
                if (textSize.width > maxWidth) {
                    var capacity = Math.floor(maxWidth / textSize.width * text.length);
                    return shape.text.substr(0, capacity);
                }
                return text;
            };
            CanvasRenderContext.prototype.drawTextDecorationLine = function (text, x, y, textDecoration) {
                var ratio;
                switch (textDecoration) {
                    case 'underline':
                        ratio = 0.9;
                        break;
                    case 'overline':
                        ratio = 0.1;
                        break;
                    case 'line-through':
                        ratio = 0.5;
                        break;
                    default:
                        return;
                }
                var _a = this, ctx = _a.ctx, fontHeight = _a.style.fontHeight;
                var width = ctx.measureText(text).width;
                switch (ctx.textAlign) {
                    case 'center':
                        x -= (width / 2);
                        break;
                    case 'right':
                        x -= width;
                        break;
                }
                ctx.lineWidth = 1;
                ctx.beginPath();
                var _y = fontHeight * ratio + y;
                ctx.moveTo(x, _y);
                ctx.lineTo(x + width, _y);
                ctx.stroke();
            };
            CanvasRenderContext.prototype.clear = function () {
                var _a = this, ctx = _a.ctx, dom = _a.dom;
                ctx.clearRect(0, 0, dom.width, dom.height);
            };
            CanvasRenderContext.prototype.getImageData = function () {
                var _a = this, ctx = _a.ctx, dom = _a.dom;
                return ctx.getImageData(0, 0, dom.width, dom.height);
            };
            CanvasRenderContext.prototype.getDataUrl = function () {
                return this.dom.toDataURL();
            };
            return CanvasRenderContext;
        }());
        barcode.CanvasRenderContext = CanvasRenderContext;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var _errorCode;
        (function (_errorCode) {
            _errorCode[_errorCode["Unknown"] = 0] = "Unknown";
            _errorCode[_errorCode["InvalidOptions"] = 1] = "InvalidOptions";
            _errorCode[_errorCode["InvalidBarcodeType"] = 2] = "InvalidBarcodeType";
            _errorCode[_errorCode["InvalidRenderType"] = 3] = "InvalidRenderType";
            _errorCode[_errorCode["MethodNotImplement"] = 4] = "MethodNotImplement";
            _errorCode[_errorCode["InvalidText"] = 5] = "InvalidText";
            _errorCode[_errorCode["InvalidCharacter"] = 6] = "InvalidCharacter";
            _errorCode[_errorCode["TextTooLong"] = 7] = "TextTooLong";
            _errorCode[_errorCode["GroupSizeOverflow"] = 8] = "GroupSizeOverflow";
        })(_errorCode = barcode._errorCode || (barcode._errorCode = {}));
        var BaseException = /** @class */ (function (_super) {
            __extends(BaseException, _super);
            function BaseException(errorCode) {
                var _this = _super.call(this) || this;
                _this.code = errorCode || _errorCode.Unknown;
                return _this;
            }
            return BaseException;
        }(Error));
        barcode.BaseException = BaseException;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        barcode.ErrorCode = barcode._errorCode;
        var InvalidOptionsException = /** @class */ (function (_super) {
            __extends(InvalidOptionsException, _super);
            function InvalidOptionsException(arg, reason) {
                if (reason === void 0) { reason = ''; }
                var _this = _super.call(this, barcode._errorCode.InvalidOptions) || this;
                _this.name = 'InvalidOptionsException';
                _this.message = JSON.stringify(arg) + " is not valid options. " + reason;
                _this.descriptor = {
                    source: arg,
                    message: _this.message,
                };
                return _this;
            }
            return InvalidOptionsException;
        }(barcode.BaseException));
        barcode.InvalidOptionsException = InvalidOptionsException;
        // invalid barcode type
        var InvalidBarcodeTypeException = /** @class */ (function (_super) {
            __extends(InvalidBarcodeTypeException, _super);
            function InvalidBarcodeTypeException(type) {
                var _this = _super.call(this, barcode._errorCode.InvalidBarcodeType) || this;
                _this.name = 'InvalidBarcodeTypeException';
                _this.message = type + " is not support!";
                _this.descriptor = {
                    source: type,
                    message: _this.message,
                };
                return _this;
            }
            return InvalidBarcodeTypeException;
        }(barcode.BaseException));
        barcode.InvalidBarcodeTypeException = InvalidBarcodeTypeException;
        // invalid render type
        var InvalidRenderException = /** @class */ (function (_super) {
            __extends(InvalidRenderException, _super);
            function InvalidRenderException(type) {
                var _this = _super.call(this, barcode._errorCode.InvalidRenderType) || this;
                _this.name = 'InvalidRenderException';
                _this.message = type + " is not support!";
                _this.descriptor = {
                    source: type,
                    message: _this.message,
                };
                return _this;
            }
            return InvalidRenderException;
        }(barcode.BaseException));
        barcode.InvalidRenderException = InvalidRenderException;
        // render doesnt have getImageData function 
        var MethodNotImplementException = /** @class */ (function (_super) {
            __extends(MethodNotImplementException, _super);
            function MethodNotImplementException(name, reason) {
                var _this = _super.call(this, barcode._errorCode.MethodNotImplement) || this;
                _this.name = 'MethodNotImplementException';
                _this.message = name + " is not a method! " + reason;
                _this.descriptor = {
                    source: name,
                    message: _this.message,
                };
                return _this;
            }
            return MethodNotImplementException;
        }(barcode.BaseException));
        barcode.MethodNotImplementException = MethodNotImplementException;
        // invalid text
        var InvalidTextException = /** @class */ (function (_super) {
            __extends(InvalidTextException, _super);
            function InvalidTextException(text, reason) {
                if (reason === void 0) { reason = ''; }
                var _this = _super.call(this, barcode._errorCode.InvalidText) || this;
                _this.name = 'InvalidTextException';
                if (!text) {
                    _this.message = 'Text is required.';
                }
                else {
                    _this.message = text + " is invalid. " + reason;
                }
                _this.descriptor = {
                    source: text,
                    message: _this.message,
                };
                return _this;
            }
            return InvalidTextException;
        }(barcode.BaseException));
        barcode.InvalidTextException = InvalidTextException;
        var InvalidCharacterException = /** @class */ (function (_super) {
            __extends(InvalidCharacterException, _super);
            function InvalidCharacterException(char) {
                var _this = _super.call(this, barcode._errorCode.InvalidCharacter) || this;
                _this.name = 'InvalidCharacterException';
                _this.message = char + " is invalid.";
                _this.descriptor = {
                    source: char,
                    message: _this.message,
                };
                return _this;
            }
            return InvalidCharacterException;
        }(barcode.BaseException));
        barcode.InvalidCharacterException = InvalidCharacterException;
        var TextTooLongException = /** @class */ (function (_super) {
            __extends(TextTooLongException, _super);
            function TextTooLongException() {
                var _this = _super.call(this, barcode._errorCode.TextTooLong) || this;
                _this.name = 'TextTooLongException';
                _this.message = 'Text is too long to encode';
                _this.descriptor = {
                    source: null,
                    message: _this.message,
                };
                return _this;
            }
            return TextTooLongException;
        }(barcode.BaseException));
        barcode.TextTooLongException = TextTooLongException;
        var GroupSizeOverflowException = /** @class */ (function (_super) {
            __extends(GroupSizeOverflowException, _super);
            function GroupSizeOverflowException(num) {
                var _this = _super.call(this, barcode._errorCode.GroupSizeOverflow) || this;
                _this.name = 'GroupSizeOverflowException';
                _this.message = "Group size is " + num + ". The max group size is 9.";
                _this.descriptor = {
                    source: num,
                    message: _this.message,
                };
                return _this;
            }
            return GroupSizeOverflowException;
        }(barcode.BaseException));
        barcode.GroupSizeOverflowException = GroupSizeOverflowException;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode_1) {
        function createRenderDom(type, size) {
            var dom;
            if (type === 'svg') {
                dom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                dom.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            }
            else {
                dom = document.createElement('canvas');
            }
            dom.setAttribute('width', size.width);
            dom.setAttribute('height', size.height);
            return dom;
        }
        var BarcodeRender = /** @class */ (function () {
            function BarcodeRender(container, barcode) {
                this.container = container;
                barcode.toSymbol();
                this.barcode = barcode;
                this.style = barcode.style;
                var scale = this.style.unitValue;
                this.size = {
                    width: barcode.size.width * scale,
                    height: barcode.size.height * scale
                };
                var renderDom = createRenderDom(this.style.renderType, this.size);
                switch (this.style.renderType) {
                    case 'svg':
                        this.context = new barcode_1.SVGRenderContext(renderDom, this.style, scale);
                        break;
                    case 'canvas':
                        this.context = new barcode_1.CanvasRenderContext(renderDom, this.style, scale);
                        break;
                    default:
                        throw new barcode_1.InvalidRenderException(this.style.renderType);
                }
                if (container) {
                    container.appendChild(renderDom);
                }
                this.renderDom = renderDom;
            }
            BarcodeRender.prototype.render = function () {
                var _a = this, style = _a.style, shapes = _a.barcode.shapes;
                var context = this.context;
                context.clear();
                context.setColor(style.color);
                context.setBackgroundColor(style.backgroundColor);
                shapes.forEach(function (shape) {
                    if (shape.type === 'rect') {
                        context.drawRect(shape);
                    }
                    if (shape.type === 'text') {
                        context.drawText(shape);
                    }
                });
                return this;
            };
            BarcodeRender.prototype.getImageData = function () {
                if (!this.context.getImageData) {
                    throw new barcode_1.MethodNotImplementException('getImageData', 'You are working with svg render.');
                }
                return this.context.getImageData();
            };
            BarcodeRender.prototype.getDataUrl = function () {
                return this.context.getDataUrl();
            };
            BarcodeRender.prototype.destroy = function () {
                if (this.container) {
                    this.container.removeChild(this.renderDom);
                }
            };
            BarcodeRender.prototype.getSize = function () {
                return this.size;
            };
            return BarcodeRender;
        }());
        barcode_1.BarcodeRender = BarcodeRender;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        function isFunction(value) {
            return typeof value === 'function';
        }
        function isWindow(obj) {
            return !!obj && obj === obj.window;
        }
        function isDefined(value) {
            return typeof value !== 'undefined';
        }
        function isNaN(value) {
            if (isFunction(Number.isNaN)) {
                return Number.isNaN(value);
            }
            else {
                return value !== value;
            }
        }
        function isNumberLike(value) {
            return !isNaN(+value);
        }
        function sliceString(text, step, fn) {
            if (text === void 0) { text = ''; }
            if (step === void 0) { step = 1; }
            var index = 0, length = text.length;
            var count = 0;
            while (index < length) {
                fn(text.substring(index, index + step), count);
                index += step;
                count++;
            }
        }
        function sliceArray(arr, step, fn) {
            if (arr === void 0) { arr = []; }
            if (step === void 0) { step = 1; }
            var index = 0, length = arr.length;
            var count = 0;
            while (index < length) {
                fn(arr.slice(index, index + step), count);
                index += step;
                count++;
            }
        }
        function str2Array(text) {
            if (text === void 0) { text = ''; }
            if (isFunction(Array.from)) {
                return Array.from(text);
            }
            else {
                return Array.prototype.slice.call(text);
            }
        }
        function combineTruthy(text) {
            if (text === void 0) { text = ''; }
            var chars = str2Array(text), stack = [];
            chars.forEach(function (char) {
                if (char === '0') {
                    stack.push(0);
                }
                else {
                    if (stack[stack.length - 1] && stack[stack.length] !== 0) {
                        var top_1 = stack.pop();
                        stack.push(++top_1);
                    }
                    else {
                        stack.push(1);
                    }
                }
            });
            return stack;
        }
        function convertRadix(num, radix) {
            if (radix === void 0) { radix = 2; }
            num = +num;
            return num.toString(radix);
        }
        function isEven(number) {
            return number % 2 === 0;
        }
        function isOdd(number) {
            return number % 2 === 1;
        }
        function toNumber(str, defaultValue) {
            if (str === void 0) { str = ''; }
            if (defaultValue === void 0) { defaultValue = 0; }
            if (typeof str === 'number') {
                return str;
            }
            var value = parseFloat(str);
            return isNaN(value) ? defaultValue : value;
        }
        function getUnit(str) {
            if (str === void 0) { str = ''; }
            var result = /[a-zA-Z]+/.exec(str);
            return result ? result[0] : 'px';
        }
        function getMaxValue(arr, field) {
            if (field === void 0) { field = 'length'; }
            var max = 0;
            arr.forEach(function (item) {
                if (item[field] > max) {
                    max = item[field];
                }
            });
            return max;
        }
        function assign(target) {
            var varArgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                varArgs[_i - 1] = arguments[_i];
            }
            if (isFunction(Object.assign)) {
                return Object.assign.apply(Object, [target].concat(varArgs));
            }
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var to = Object(target);
            for (var index = 0; index < varArgs.length; index++) {
                var nextSource = varArgs[index];
                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        }
        function deepMerge(target) {
            var srcs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                srcs[_i - 1] = arguments[_i];
            }
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }
            srcs.forEach(function (src) {
                if (src) {
                    for (var key in src) {
                        if (Object.prototype.hasOwnProperty.call(src, key)) {
                            if (src[key] != null && typeof src[key] === 'object' && typeof target[key] === 'object') {
                                target[key] = deepMerge({}, target[key] || {}, src[key]);
                            }
                            else {
                                target[key] = src[key];
                            }
                        }
                    }
                }
            });
            return target;
        }
        function deepMergeAll() {
            var srcs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                srcs[_i] = arguments[_i];
            }
            return deepMerge.apply(void 0, [{}].concat(srcs));
        }
        function strRepeat(text, count) {
            if (isFunction(text.repeat)) {
                return text.repeat(count);
            }
            var str = '' + text;
            count = +count;
            if (count != count) {
                count = 0;
            }
            if (count < 0) {
                throw new RangeError('repeat count must be non-negative');
            }
            if (count == Infinity) {
                throw new RangeError('repeat count must be less than infinity');
            }
            count = Math.floor(count);
            if (str.length == 0 || count == 0) {
                return '';
            }
            // Ensuring count is a 31-bit integer allows us to heavily optimize the
            // main part. But anyway, most current (August 2014) browsers can't handle
            // strings 1 << 28 chars or longer, so:
            if (str.length * count >= 1 << 28) {
                throw new RangeError('repeat count must not overflow maximum string size');
            }
            var rpt = '';
            for (var i = 0; i < count; i++) {
                rpt += str;
            }
            return rpt;
        }
        function isInteger(value) {
            if (isFunction(Number.isInteger)) {
                return Number.isInteger(value);
            }
            return typeof value === 'number' &&
                isFinite(value) &&
                Math.floor(value) === value;
        }
        function fillArray(arr, value) {
            if (isFunction(arr.fill)) {
                return arr.fill(value);
            }
            for (var i = 0; i < arr.length; i++) {
                arr[i] = value;
            }
            return arr;
        }
        function strPadStart(str, targetLength, padString) {
            if (isFunction(str.padStart)) {
                return str.padStart(targetLength, padString);
            }
            targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
            padString = String((typeof padString !== 'undefined' ? padString : ' '));
            if (str.length > targetLength) {
                return str;
            }
            else {
                targetLength = targetLength - str.length;
                if (targetLength > padString.length) {
                    padString += strRepeat(padString, targetLength / padString.length); //append to original to ensure we are longer than needed
                }
                return padString.slice(0, targetLength) + String(str);
            }
        }
        var plugins = {};
        function registerPlugin(name, fn) {
            plugins[name] = fn;
        }
        function _defaultMeasureText(text, style) {
            var num = toNumber(style.fontSize, 12);
            return num * 1.4;
        }
        function measureText(text, style) {
            if (isFunction(plugins.measureText)) {
                return plugins.measureText(text, style);
            }
            return _defaultMeasureText(text, style);
        }
        function _defaultConvertUnit(size) {
            var num = toNumber(size, 12);
            return num;
        }
        function convertUnit(size) {
            if (isFunction(plugins.convertUnit)) {
                if (isNumberLike(size)) {
                    return toNumber(size, 12);
                }
                return plugins.convertUnit(size);
            }
            return _defaultConvertUnit(size);
        }
        function fixSize2PixelDefault(size) {
            if (isNumberLike(size)) {
                return size + 'px';
            }
            return size;
        }
        function loop(cb, range) {
            var i, length;
            if (isFinite(range)) {
                i = 0;
                length = range;
            }
            else {
                i = range.from;
                length = range.to + 1;
            }
            for (; i < length; i++) {
                cb(i);
            }
        }
        function toZeroOnePattern(data, evenIsBar) {
            var func = evenIsBar ? isEven : isOdd;
            return data.reduce(function (res, item, i) {
                if (func(i)) {
                    res += strRepeat('1', item);
                }
                else {
                    res += strRepeat('0', item);
                }
                return res;
            }, '');
        }
        function range(from, to) {
            var result = [];
            while (from < to) {
                result.push(from);
                from++;
            }
            result.push(to);
            return result;
        }
        function makeEnums(mapping) {
            Object.defineProperty(mapping, 'has', {
                configurable: false,
                enumerable: false,
                writable: false,
                value: function (v) {
                    return this.$br[v];
                }
            });
            var br = Object.keys(mapping).reduce(function (obj, key) {
                obj[mapping[key]] = key;
                return obj;
            }, {});
            Object.defineProperty(mapping, '$br', {
                configurable: false,
                enumerable: false,
                writable: false,
                value: br,
            });
        }
        barcode.Utils = { isFunction: isFunction, isWindow: isWindow, isDefined: isDefined, isNaN: isNaN, isNumberLike: isNumberLike, sliceString: sliceString, sliceArray: sliceArray, str2Array: str2Array, combineTruthy: combineTruthy, convertRadix: convertRadix, isEven: isEven, isOdd: isOdd, toNumber: toNumber,
            getUnit: getUnit, getMaxValue: getMaxValue, assign: assign, deepMerge: deepMerge, deepMergeAll: deepMergeAll, strRepeat: strRepeat, isInteger: isInteger, fillArray: fillArray, strPadStart: strPadStart, registerPlugin: registerPlugin, measureText: measureText, convertUnit: convertUnit,
            fixSize2PixelDefault: fixSize2PixelDefault, loop: loop, toZeroOnePattern: toZeroOnePattern, range: range, makeEnums: makeEnums };
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var Option = /** @class */ (function () {
            function Option(options) {
                if (options === void 0) { options = {}; }
                this.originConfig = options;
                this.type = options.type;
                this.penddingMerge = [];
            }
            Option.setCustomDefaultOptions = function (customDefaultOptions) {
                Option.CustomDefaultOptions = customDefaultOptions;
            };
            Option.prototype.spawn = function (partialOption) {
                return new Option(barcode.Utils.deepMergeAll(this.originConfig, partialOption));
            };
            Option.prototype.merge = function (options) {
                this.penddingMerge.unshift(options);
            };
            Option.prototype._getUnitValue = function (unitSize) {
                unitSize = barcode.Utils.fixSize2PixelDefault(unitSize);
                return barcode.Utils.convertUnit(unitSize);
            };
            Option.prototype.getMergedOption = function () {
                return barcode.Utils.deepMergeAll.apply(barcode.Utils, [Option.DefaultOptions].concat(this.penddingMerge, [Option.CustomDefaultOptions, this.originConfig]));
            };
            Option.prototype.getConfig = function (unitValue) {
                var mergedConfig = this.getMergedOption();
                var text = mergedConfig.text, quietZone = mergedConfig.quietZone, height = mergedConfig.height, labelPosition = mergedConfig.labelPosition, desiredSize = mergedConfig.desiredSize, showLabel = mergedConfig.showLabel, font = mergedConfig.font, backgroundColor = mergedConfig.backgroundColor, color = mergedConfig.color, renderType = mergedConfig.renderType, unitSize = mergedConfig.unitSize, hideExtraChecksum = mergedConfig.hideExtraChecksum;
                var encodeConfig = {
                    text: text,
                    isLabelBottom: false,
                    hideExtraChecksum: hideExtraChecksum,
                };
                if (barcode.Utils.isDefined(text)) {
                    encodeConfig.text += '';
                }
                else {
                    throw new barcode.InvalidTextException();
                }
                if (barcode.Utils.isDefined(labelPosition)) {
                    encodeConfig.isLabelBottom = labelPosition !== 'top';
                }
                font = barcode.Utils.deepMergeAll(font);
                font.fontSize = barcode.Utils.fixSize2PixelDefault(font.fontSize);
                var fontHeight = barcode.Utils.measureText(text, font);
                encodeConfig.showLabel = showLabel;
                unitValue = unitValue || this._getUnitValue(unitSize);
                var fontSizeInUnit = showLabel ? fontHeight / unitValue : 0;
                encodeConfig.fontSizeInUnit = fontSizeInUnit;
                var newQuietZone = {};
                for (var key in quietZone) {
                    if (quietZone.hasOwnProperty(key)) {
                        var item = quietZone[key];
                        if (barcode.Utils.isNumberLike(item)) {
                            var value = +item;
                            newQuietZone[key] = value;
                        }
                        else {
                            var pixelValue = barcode.Utils.convertUnit(item);
                            newQuietZone[key] = pixelValue / unitValue;
                        }
                    }
                }
                encodeConfig.quietZone = newQuietZone;
                if (desiredSize) {
                    encodeConfig.containerWidth = barcode.Utils.convertUnit(barcode.Utils.fixSize2PixelDefault(desiredSize.width));
                    encodeConfig.containerHeight = barcode.Utils.convertUnit(barcode.Utils.fixSize2PixelDefault(desiredSize.height));
                    encodeConfig.desiredSize = desiredSize;
                }
                if (barcode.Utils.isDefined(height)) {
                    if (desiredSize) {
                        var barAbsHeight = showLabel ? (encodeConfig.containerHeight - fontHeight) : encodeConfig.containerHeight;
                        encodeConfig.height = barAbsHeight / unitValue - newQuietZone.top - newQuietZone.bottom;
                    }
                    else if (barcode.Utils.isNumberLike(height)) {
                        encodeConfig.height = +height - fontSizeInUnit - newQuietZone.top - newQuietZone.bottom;
                    }
                    else {
                        encodeConfig.height = barcode.Utils.convertUnit(height) / unitValue - fontSizeInUnit - newQuietZone.top - newQuietZone.bottom;
                    }
                }
                var style = barcode.Utils.deepMergeAll({
                    backgroundColor: backgroundColor, color: color, renderType: renderType, unitValue: unitValue, fontSize: font.fontSize, fontHeight: fontHeight,
                }, font);
                return {
                    config: mergedConfig,
                    encodeConfig: encodeConfig,
                    style: style,
                };
            };
            Option.prototype.getOriginConfig = function () {
                return this.originConfig;
            };
            Option.prototype.getType = function () {
                return this.type;
            };
            Option.DefaultOptions = {
                renderType: 'canvas',
                unitSize: '1px',
                color: 'rgb(0,0,0)',
                backgroundColor: 'rgb(255,255,255)',
                font: {
                    fontFamily: 'sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '12px',
                },
                hideExtraChecksum: false,
                quietZone: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            };
            Option.CustomDefaultOptions = {};
            return Option;
        }());
        barcode.Option = Option;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        function _getProtos(targetClass) {
            var protos = [];
            if (targetClass && targetClass instanceof Function) {
                var baseClass = targetClass;
                protos.push(baseClass);
                while (baseClass) {
                    var newBaseClass = Object.getPrototypeOf(baseClass);
                    if (newBaseClass && newBaseClass !== Object && newBaseClass !== Function.prototype) {
                        baseClass = newBaseClass;
                        protos.push(baseClass);
                    }
                    else {
                        break;
                    }
                }
            }
            return protos;
        }
        function _getDefaultConfig(encoder, type) {
            var penddingMerge = [{ 'type': type }];
            var protolist = _getProtos(encoder);
            protolist.forEach(function (_proto) {
                //checked the minify result, static props will not be minified, so use both ['DefaultConfig'] and .DefaultConfig is fine.
                if (_proto['DefaultConfig']) {
                    penddingMerge.unshift(_proto['DefaultConfig']);
                }
            });
            return barcode.Utils.deepMergeAll.apply(barcode.Utils, [barcode.Option.DefaultOptions].concat(penddingMerge, [barcode.Option.CustomDefaultOptions]));
        }
        barcode._getDefaultConfig = _getDefaultConfig;
        var _EnumDictionary = /** @class */ (function () {
            function _EnumDictionary(enumType, func) {
                this._keys = {};
                this._values = {};
                for (var enumValue in enumType) {
                    if (typeof enumType[enumValue] == "string") {
                        var enumNumber = parseInt(enumValue);
                        var bcValue = func(enumType[enumNumber]);
                        this._keys[enumNumber] = bcValue;
                        this._values[bcValue] = enumNumber;
                    }
                }
            }
            _EnumDictionary.prototype.getEnumByString = function (value) {
                var enumStr = this._values[value];
                if (enumStr === undefined) {
                    throw "Unknown Barcode internal value '" + value + "'";
                }
                return enumStr;
            };
            _EnumDictionary.prototype.getStringByEnum = function (key) {
                return this._keys[key];
            };
            return _EnumDictionary;
        }());
        barcode._EnumDictionary = _EnumDictionary;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var Area = /** @class */ (function () {
            function Area(width, height) {
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                this.x = 0;
                this.y = 0;
                this.style = {
                    padding: {
                        top: 0, right: 0, bottom: 0, left: 0,
                    },
                    border: {
                        top: 0, right: 0, bottom: 0, left: 0,
                    },
                    margin: {
                        top: 0, right: 0, bottom: 0, left: 0,
                    },
                };
                this.width = width;
                this.height = height;
                this.children = [];
                this._updateBox();
            }
            Area.prototype.append = function (element) {
                this.children.push(element);
            };
            Area.prototype._makeRect = function (x, y, width, height) {
                return {
                    x: x,
                    y: y,
                    height: height,
                    width: width,
                    type: 'rect',
                };
            };
            Area.prototype.toShapes = function () {
                var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height, _b = _a.style, border = _b.border, margin = _b.margin;
                var result = [];
                var _width = border.left + border.right + width;
                var _height = border.top + border.bottom + height;
                var startX = x + margin.left;
                var startY = y + margin.top;
                if (border.top) {
                    result.push(this._makeRect(startX, startY, _width, border.top));
                }
                if (border.right) {
                    result.push(this._makeRect(startX + _width - border.right, startY, border.right, _height));
                }
                if (border.bottom) {
                    result.push(this._makeRect(startX, startY + _height - border.bottom, _width, border.bottom));
                }
                if (border.left) {
                    result.push(this._makeRect(startX, startY, border.left, _height));
                }
                return result;
            };
            Area.prototype.getSize = function () {
                var _a = this, width = _a.width, height = _a.height, offsetBox = _a.offsetBox;
                return {
                    width: width + offsetBox.width,
                    height: height + offsetBox.height,
                };
            };
            Area.prototype.visiable = function () {
                return this.width > 0 && this.height > 0;
            };
            Area.prototype.setX = function (x) {
                this.x = x;
                this._updateBox();
            };
            Area.prototype.setY = function (y) {
                this.y = y;
                this._updateBox();
            };
            Area.prototype.updateContentSize = function (w, h) {
                this.width = w;
                this.height = h;
                this._updateBox();
            };
            Area.prototype._fixOpt = function (style, key) {
                if (barcode.Utils.isNumberLike(style[key])) {
                    var value = style[key];
                    style[key] = {
                        top: value, right: value, bottom: value, left: value,
                    };
                }
            };
            Area.prototype.setStyle = function (style) {
                this._fixOpt(style, 'padding');
                this._fixOpt(style, 'border');
                this._fixOpt(style, 'margin');
                this.style = barcode.Utils.deepMergeAll(this.style, style);
                this._updateBox();
            };
            Area.prototype._updateBox = function () {
                var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height, _b = _a.style, padding = _b.padding, border = _b.border, margin = _b.margin;
                this.offsetBox = {
                    x: x + padding.left + border.left + margin.left,
                    y: y + padding.top + border.top + margin.top,
                    width: margin.left + border.left + border.right + margin.right,
                    height: margin.top + border.top + border.bottom + margin.bottom,
                };
                var contentW = width - padding.left - padding.right;
                var contentH = height - padding.top - padding.bottom;
                this.contentBox = {
                    width: contentW >= 0 ? contentW : 0,
                    height: contentH >= 0 ? contentH : 0,
                };
            };
            return Area;
        }());
        barcode.Area = Area;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var HorizontalLayoutArea = /** @class */ (function (_super) {
            __extends(HorizontalLayoutArea, _super);
            function HorizontalLayoutArea() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            HorizontalLayoutArea.prototype.toShapes = function () {
                this._updateContentSize();
                var _a = this, children = _a.children, offsetBox = _a.offsetBox;
                var result = _super.prototype.toShapes.call(this);
                var deltaY = offsetBox.y;
                var position = 0;
                children.forEach(function (item) {
                    var deltaX = offsetBox.x + position;
                    var shapes = item.toShapes();
                    shapes.forEach(function (shape) {
                        shape.x += deltaX;
                        shape.y += deltaY;
                        result.push(shape);
                    });
                    var itemSize = item.getSize();
                    position += itemSize.width;
                });
                return result;
            };
            HorizontalLayoutArea.prototype.getSize = function () {
                this._updateContentSize();
                return _super.prototype.getSize.call(this);
            };
            HorizontalLayoutArea.prototype._updateContentSize = function () {
                var _a = this, children = _a.children, padding = _a.style.padding;
                var contentSize = children.reduce(function (result, item) {
                    var size = item.getSize();
                    result.height = Math.max(size.height, result.height);
                    result.width += size.width;
                    return result;
                }, {
                    width: 0,
                    height: 0,
                });
                this.updateContentSize(contentSize.width + padding.left + padding.right, contentSize.height + padding.top + padding.bottom);
            };
            return HorizontalLayoutArea;
        }(barcode.Area));
        barcode.HorizontalLayoutArea = HorizontalLayoutArea;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var VerticalLayoutArea = /** @class */ (function (_super) {
            __extends(VerticalLayoutArea, _super);
            function VerticalLayoutArea() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            VerticalLayoutArea.prototype.toShapes = function () {
                this._updateContentSize();
                var _a = this, children = _a.children, offsetBox = _a.offsetBox;
                var result = _super.prototype.toShapes.call(this);
                var deltaX = offsetBox.x;
                var position = 0;
                children.forEach(function (item) {
                    var deltaY = offsetBox.y + position;
                    var shapes = item.toShapes();
                    shapes.forEach(function (shape) {
                        shape.x += deltaX;
                        shape.y += deltaY;
                        result.push(shape);
                    });
                    var itemSize = item.getSize();
                    position += itemSize.height;
                });
                return result;
            };
            VerticalLayoutArea.prototype.getSize = function () {
                this._updateContentSize();
                return _super.prototype.getSize.call(this);
            };
            VerticalLayoutArea.prototype._updateContentSize = function () {
                var _a = this, children = _a.children, padding = _a.style.padding;
                var contentSize = children.reduce(function (result, item) {
                    var size = item.getSize();
                    result.width = Math.max(size.width, result.width);
                    result.height += size.height;
                    return result;
                }, {
                    width: 0,
                    height: 0,
                });
                this.updateContentSize(contentSize.width + padding.left + padding.right, contentSize.height + padding.top + padding.bottom);
            };
            return VerticalLayoutArea;
        }(barcode.Area));
        barcode.VerticalLayoutArea = VerticalLayoutArea;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var MatrixSymbolArea = /** @class */ (function (_super) {
            __extends(MatrixSymbolArea, _super);
            function MatrixSymbolArea(width, height, rowHeight) {
                var _this = _super.call(this, width, height) || this;
                _this._xPosition = 0;
                _this._yPosition = 0;
                _this._lastMaxHeight = 0;
                _this._rowHeight = 0;
                _this._rowHeight = rowHeight;
                return _this;
            }
            MatrixSymbolArea.prototype.append = function (width, height) {
                if (!width || !height) {
                    return;
                }
                this._autoWrap(width);
                var _a = this, children = _a.children, _xPosition = _a._xPosition, _yPosition = _a._yPosition;
                var element = {
                    width: width, height: height, x: _xPosition, y: _yPosition,
                };
                children.push(element);
                this._xPosition += width;
                if (!this._rowHeight) {
                    this._lastMaxHeight = Math.max(this._lastMaxHeight, height);
                }
            };
            MatrixSymbolArea.prototype._autoWrap = function (width) {
                if (this._checkNeedWrap(width)) {
                    this._yPosition += (this._rowHeight || this._lastMaxHeight);
                    this._xPosition = 0;
                    this._lastMaxHeight = 0;
                }
            };
            MatrixSymbolArea.prototype._checkNeedWrap = function (eleWidth) {
                var _a = this, _xPosition = _a._xPosition, width = _a.contentBox.width;
                return width - _xPosition - eleWidth < 0;
            };
            MatrixSymbolArea.prototype.space = function (width) {
                if (width === void 0) { width = 1; }
                this._autoWrap(width);
                this._xPosition += width;
            };
            MatrixSymbolArea.prototype.toShapes = function () {
                if (!this.visiable()) {
                    return [];
                }
                var _a = this, offsetBox = _a.offsetBox, children = _a.children;
                var result = _super.prototype.toShapes.call(this);
                children.forEach(function (item) {
                    item.x += offsetBox.x;
                    item.y += offsetBox.y;
                    item.type = 'rect';
                    result.push(item);
                });
                return result;
            };
            return MatrixSymbolArea;
        }(barcode.Area));
        barcode.MatrixSymbolArea = MatrixSymbolArea;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var SymbolArea = /** @class */ (function (_super) {
            __extends(SymbolArea, _super);
            function SymbolArea(width, height) {
                var _this = _super.call(this, width, height) || this;
                _this._lastIsBar = false;
                _this._cacheNumber = 0;
                _this._position = 0;
                return _this;
            }
            SymbolArea.prototype.append = function (barWidth, barHeight, offsetY) {
                if (!barWidth) {
                    return;
                }
                var _a = this, children = _a.children, _position = _a._position;
                var element = {
                    width: barWidth, x: _position, barHeight: barHeight, offsetY: offsetY,
                };
                children.push(element);
                this._position += barWidth;
            };
            SymbolArea.prototype.space = function (n) {
                if (n === void 0) { n = 1; }
                this._position += n;
            };
            SymbolArea.prototype._appendModule = function (flag) {
                var isBar = flag === '1';
                if (isBar !== this._lastIsBar) {
                    this._flash();
                    this._lastIsBar = isBar;
                }
                this._cacheNumber++;
            };
            SymbolArea.prototype._flash = function () {
                if (this._cacheNumber > 0) {
                    if (this._lastIsBar) {
                        this.append(this._cacheNumber);
                    }
                    else {
                        this.space(this._cacheNumber);
                    }
                    this._cacheNumber = 0;
                }
            };
            SymbolArea.prototype.fromPattern = function (str) {
                var _this = this;
                barcode.Utils.str2Array(str).forEach(function (num) { return _this._appendModule(num); });
                this._flash();
            };
            SymbolArea.prototype.getContentBox = function () {
                return this.contentBox;
            };
            SymbolArea.prototype.toShapes = function () {
                if (!this.visiable()) {
                    return [];
                }
                var _a = this, offsetBox = _a.offsetBox, children = _a.children, height = _a.contentBox.height;
                var result = _super.prototype.toShapes.call(this);
                children.forEach(function (item) {
                    result.push({
                        type: 'rect',
                        x: item.x + offsetBox.x,
                        y: offsetBox.y + (item.offsetY || 0),
                        width: item.width,
                        height: item.barHeight || height,
                    });
                });
                return result;
            };
            return SymbolArea;
        }(barcode.Area));
        barcode.SymbolArea = SymbolArea;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var LabelArea = /** @class */ (function (_super) {
            __extends(LabelArea, _super);
            function LabelArea(width, height, textAlign) {
                var _this = _super.call(this, width, height) || this;
                _this._textAlign = textAlign;
                return _this;
            }
            LabelArea.prototype.toShapes = function () {
                if (!this.visiable()) {
                    return [];
                }
                var _a = this, offsetBox = _a.offsetBox, children = _a.children, _textAlign = _a._textAlign, width = _a.contentBox.width;
                var result = _super.prototype.toShapes.call(this);
                children.forEach(function (item) {
                    var deltaX = offsetBox.x;
                    switch (_textAlign) {
                        case 'center':
                            deltaX += width / 2;
                            break;
                        case 'right':
                            deltaX += width;
                            break;
                        default:
                    }
                    result.push({
                        x: deltaX + (item.x || 0),
                        y: offsetBox.y + (item.y || 0),
                        textAlign: _textAlign,
                        maxWidth: width,
                        type: 'text',
                        text: item.text,
                    });
                });
                return result;
            };
            return LabelArea;
        }(barcode.Area));
        barcode.LabelArea = LabelArea;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var MatrixBuilder = /** @class */ (function () {
            function MatrixBuilder(row, col) {
                this.data = [];
                this.data = [];
                this.row = row;
                this.col = col;
            }
            MatrixBuilder.prototype.add = function (row, col, data) {
                var mRow = this.data[row] || barcode.Utils.fillArray(new Array(this.col), null);
                mRow[col] = data;
                this.data[row] = [];
            };
            MatrixBuilder.prototype.toMatrix = function () {
                var _this = this;
                var result = [];
                barcode.Utils.loop(function (i) {
                    result.push(_this.data[i] || barcode.Utils.fillArray(new Array(_this.col), null));
                }, this.row);
                return result;
            };
            return MatrixBuilder;
        }());
        barcode.MatrixBuilder = MatrixBuilder;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var BitBuffer = /** @class */ (function () {
            function BitBuffer(buffer) {
                if (buffer === void 0) { buffer = []; }
                this.buffer = buffer;
                this.length = buffer.length * 8;
                this.index = 0;
            }
            BitBuffer.prototype.putBit = function (bit) {
                var bufIndex = Math.floor(this.length / 8);
                if (this.buffer.length <= bufIndex) {
                    this.buffer.push(0);
                }
                if (bit) {
                    this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
                }
                this.length += 1;
            };
            BitBuffer.prototype.putBitAt = function (bit, pos) {
                var len = this.length;
                var newBuffer = new BitBuffer();
                for (var i = 0; i < len; i++) {
                    if (i === pos) {
                        newBuffer.putBit(bit);
                    }
                    else {
                        newBuffer.putBit(this.getAt(i));
                    }
                }
                this.buffer = newBuffer.buffer;
                this.length = newBuffer.length;
            };
            BitBuffer.prototype.put = function (num, length) {
                for (var i = 0; i < length; i += 1) {
                    this.putBit(((num >>> (length - i - 1)) & 1) == 1);
                }
            };
            BitBuffer.prototype.putBits = function (bits) {
                this.put(parseInt(bits, 2), bits.length);
            };
            BitBuffer.prototype.getAt = function (index) {
                var bufIndex = Math.floor(index / 8);
                return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1;
            };
            BitBuffer.prototype.getBuffer = function () {
                return this.buffer;
            };
            BitBuffer.prototype.getGroupedBits = function (size) {
                var pos = 0;
                var result = [];
                while (pos < this.length) {
                    var item = '', i = pos, len = pos + size;
                    for (; i < len; i++) {
                        item += this.getAt(i) ? 1 : 0;
                    }
                    pos = len;
                    result.push(parseInt(item, 2));
                }
                return result;
            };
            BitBuffer.prototype.next = function () {
                this.index++;
                return this.getAt(this.index - 1);
            };
            return BitBuffer;
        }());
        barcode.BitBuffer = BitBuffer;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var BarcodeEncoder = /** @class */ (function () {
            function BarcodeEncoder(option) {
                this._option = option;
                this.shapes = [];
                this.size = {
                    width: 0,
                    height: 0
                };
                this.applyDesiredSize();
            }
            BarcodeEncoder.prototype.validate = function () { };
            BarcodeEncoder.prototype.applyDesiredSize = function (unitValue) {
                var _a = this._option.getConfig(unitValue), config = _a.config, encodeConfig = _a.encodeConfig, style = _a.style;
                this.config = config;
                this.encodeConfig = encodeConfig;
                this.style = style;
                this.useDesiredSize = !!encodeConfig.desiredSize;
            };
            BarcodeEncoder.prototype.afterApplyDesiredSize = function () {
                // noop
            };
            BarcodeEncoder.prototype.toSymbol = function () {
                this.validate();
                var data = this.calculateData();
                if (this.useDesiredSize) {
                    this.convertToShape(data, true);
                    this.adjustDesiredSize();
                    this.afterApplyDesiredSize();
                }
                this.convertToShape(data);
            };
            return BarcodeEncoder;
        }());
        barcode.BarcodeEncoder = BarcodeEncoder;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var TwoDimensionalBarcode = /** @class */ (function (_super) {
            __extends(TwoDimensionalBarcode, _super);
            function TwoDimensionalBarcode() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TwoDimensionalBarcode.prototype.adjustDesiredSize = function () {
                var _a = this.size, width = _a.width, height = _a.height;
                var _b = this.encodeConfig, desiredSize = _b.desiredSize, containerWidth = _b.containerWidth, containerHeight = _b.containerHeight;
                var unitValue = Math.min(containerWidth / width, containerHeight / height);
                if (desiredSize.forceRounding) {
                    unitValue = ~~unitValue;
                    unitValue = unitValue < 1 ? 1 : unitValue;
                }
                this.applyDesiredSize(unitValue);
            };
            TwoDimensionalBarcode.prototype.convertToShape = function (matrix, forMeasure) {
                var quietZone = this.encodeConfig.quietZone;
                var symbolWidth = matrix[0].length + quietZone.right + quietZone.left;
                var symbolHeight = matrix.length + quietZone.top + quietZone.bottom;
                var mainArea = new barcode.VerticalLayoutArea();
                var symbolArea = new barcode.MatrixSymbolArea(symbolWidth, symbolHeight, 1);
                symbolArea.setStyle({
                    padding: {
                        top: quietZone.top,
                        right: quietZone.right,
                        bottom: quietZone.bottom,
                        left: quietZone.left,
                    },
                });
                mainArea.append(symbolArea);
                if (!forMeasure) {
                    matrix.forEach(function (row) {
                        row.forEach(function (cell) {
                            if (cell) {
                                symbolArea.append(1, 1);
                            }
                            else {
                                symbolArea.space();
                            }
                        });
                    });
                    this.shapes = mainArea.toShapes();
                }
                this.size = mainArea.getSize();
            };
            return TwoDimensionalBarcode;
        }(barcode.BarcodeEncoder));
        barcode.TwoDimensionalBarcode = TwoDimensionalBarcode;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var OneDimensionalBarcode = /** @class */ (function (_super) {
            __extends(OneDimensionalBarcode, _super);
            function OneDimensionalBarcode(option) {
                var _this = this;
                option.merge(OneDimensionalBarcode.DefaultConfig);
                _this = _super.call(this, option) || this;
                _this.label = '';
                return _this;
            }
            OneDimensionalBarcode.prototype.adjustDesiredSize = function () {
                var width = this.size.width;
                var _a = this.encodeConfig, desiredSize = _a.desiredSize, containerWidth = _a.containerWidth;
                var unitValue = containerWidth / width;
                if (desiredSize.forceRounding) {
                    unitValue = ~~unitValue;
                    unitValue = unitValue < 1 ? 1 : unitValue;
                }
                this.applyDesiredSize(unitValue);
            };
            OneDimensionalBarcode.prototype.convertToShape = function (data, forMeasure) {
                var _a = this, label = _a.label, _b = _a.encodeConfig, quietZone = _b.quietZone, isLabelBottom = _b.isLabelBottom, height = _b.height, showLabel = _b.showLabel, fontSizeInUnit = _b.fontSizeInUnit, textAlign = _a.style.textAlign;
                var labelHeight = 0;
                if (label && showLabel) {
                    labelHeight = fontSizeInUnit;
                }
                var symbolWidth = data.length + quietZone.right + quietZone.left;
                var symbolHeight = height + quietZone.top + quietZone.bottom;
                var mainArea = new barcode.VerticalLayoutArea();
                var symbolArea = new barcode.SymbolArea(symbolWidth, symbolHeight);
                symbolArea.setStyle({
                    padding: {
                        top: quietZone.top,
                        right: quietZone.right,
                        bottom: quietZone.bottom,
                        left: quietZone.left,
                    },
                });
                var symbolSize = symbolArea.getSize();
                var labelArea = new barcode.LabelArea(symbolSize.width, labelHeight, textAlign);
                if (isLabelBottom) {
                    mainArea.append(symbolArea);
                    mainArea.append(labelArea);
                }
                else {
                    mainArea.append(labelArea);
                    mainArea.append(symbolArea);
                }
                if (!forMeasure) {
                    symbolArea.fromPattern(data);
                    labelArea.append({ text: label });
                    this.shapes = mainArea.toShapes();
                }
                this.size = mainArea.getSize();
            };
            OneDimensionalBarcode.DefaultConfig = {
                height: 60,
                showLabel: true,
                labelPosition: 'bottom',
            };
            return OneDimensionalBarcode;
        }(barcode.BarcodeEncoder));
        barcode.OneDimensionalBarcode = OneDimensionalBarcode;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var FNC1 = '\u00cf';
        var FNC2 = '\u00ca';
        var FNC3 = '\u00c9';
        var DataMatrixFNC1 = '\u2000';
        var DataMatrixMacro05 = '\u2004';
        var DataMatrixMacro06 = '\u2005';
        barcode.Constants = {
            FNC1: FNC1, FNC2: FNC2, FNC3: FNC3, DataMatrixFNC1: DataMatrixFNC1, DataMatrixMacro05: DataMatrixMacro05, DataMatrixMacro06: DataMatrixMacro06,
        };
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        barcode.encoders = {};
        var Barcode = /** @class */ (function () {
            //3 Overloadeds 
            function Barcode() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var dom, option, callback;
                if (args.length >= 3) {
                    dom = args[0], option = args[1], callback = args[2];
                }
                else if (args.length === 2) {
                    if (barcode.Utils.isFunction(args[1])) {
                        option = args[0], callback = args[1];
                    }
                    else {
                        dom = args[0], option = args[1];
                    }
                }
                else if (args.length === 1) {
                    option = args[0];
                }
                else {
                    throw new barcode.MethodNotImplementException('constructor', 'The arguments is invalid.');
                }
                if (typeof dom === 'string') {
                    this.dom = document.querySelector(dom);
                }
                else {
                    this.dom = dom;
                }
                this.callback = callback && callback.bind(this);
                this.setOption(option);
            }
            Barcode.getImageData = function (option) {
                if (option === void 0) { option = {}; }
                var instance = new Barcode(option);
                return instance.getImageData();
            };
            Barcode.getDataUrl = function (option) {
                if (option === void 0) { option = {}; }
                var instance = new Barcode(option);
                return instance.getDataUrl();
            };
            //set default options global
            Barcode.setDefaultOptions = function (option) {
                if (option === void 0) { option = {}; }
                barcode.Option.setCustomDefaultOptions(option);
            };
            //private
            Barcode.registerEncoder = function (name, encoder) {
                barcode.encoders[name] = encoder;
                Barcode.supportType.push(name);
            };
            Barcode.registerPlugin = function (name, fn) {
                barcode.Utils.registerPlugin(name, fn);
            };
            Barcode.prototype.mergeOption = function (option) {
                var newOpt = this.option.spawn(option);
                this.update(newOpt);
                return this;
            };
            /**
           * set barcode options
           * @access public
           * @param {object} option
           */
            Barcode.prototype.setOption = function (option) {
                this.update(new barcode.Option(option));
                return this;
            };
            Barcode.prototype.getOption = function () {
                return this.option.getMergedOption();
            };
            Barcode.prototype.update = function (option) {
                var type = option.getType();
                var Encoder = barcode.encoders[type];
                if (!Encoder) {
                    throw new barcode.InvalidBarcodeTypeException(type);
                }
                var encoder = new Encoder(option);
                this.destroy();
                var render = new barcode.BarcodeRender(this.dom, encoder);
                render.render();
                this.render = render;
                this.option = option;
                if (barcode.Utils.isFunction(this.callback)) {
                    this.callback();
                }
            };
            Barcode.prototype.refresh = function () {
                this.render.render();
                if (barcode.Utils.isFunction(this.callback)) {
                    this.callback();
                }
            };
            Barcode.prototype.getImageData = function () {
                return this.render.getImageData();
            };
            Barcode.prototype.getDataUrl = function () {
                return this.render.getDataUrl();
            };
            Barcode.prototype.getSize = function () {
                return this.render.getSize();
            };
            Barcode.prototype.destroy = function () {
                if (this.render) {
                    this.render.destroy();
                    this.render = null;
                }
            };
            Barcode.supportType = [];
            Barcode.constants = barcode.Constants;
            Barcode.ErrorCode = barcode.ErrorCode;
            return Barcode;
        }());
        barcode.Barcode = Barcode;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        barcode.Barcode.registerPlugin('measureText', function (text, style) {
            var spanDom = document.createElement('span');
            spanDom.style.visibility = 'hidden';
            spanDom.style.position = 'absolute';
            spanDom.style.lineHeight = 'normal';
            spanDom.textContent = text;
            Object.keys(style).forEach(function (item) {
                spanDom.style[item] = style[item];
            });
            document.body.appendChild(spanDom);
            var info = spanDom.getBoundingClientRect();
            document.body.removeChild(spanDom);
            return info.height;
        });
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        barcode.Barcode.registerPlugin('convertUnit', function (num) {
            var divDom = document.createElement('div');
            divDom.style.visibility = 'hidden';
            divDom.style.position = 'fixed';
            divDom.style.padding = '0';
            divDom.style.border = '0';
            divDom.style.width = num;
            document.body.appendChild(divDom);
            var info = divDom.getBoundingClientRect();
            document.body.removeChild(divDom);
            return info.width;
        });
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        /**
     * Specifies the type of rendering for all type of Barcodes.
     */
        var RenderType;
        (function (RenderType) {
            /**
             * Uses <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank">Canvas</a>
             * to render a barcode.
             */
            RenderType[RenderType["Canvas"] = 0] = "Canvas";
            /**
             * Uses <a href="https://developer.mozilla.org/en-US/docs/Web/SVG" target="_blank">SVG</a>
             * to render a barcode.
             */
            RenderType[RenderType["Svg"] = 1] = "Svg";
        })(RenderType = barcode.RenderType || (barcode.RenderType = {}));
        /**
         * Defines the position of the label that displays the Barcode value.
         */
        var LabelPosition;
        (function (LabelPosition) {
            /**
             * Renders the barcode label at the top of the barcode.
             */
            LabelPosition[LabelPosition["Top"] = 0] = "Top";
            /**
             * Renders the barcode label at the bottom of the barcode.
             */
            LabelPosition[LabelPosition["Bottom"] = 1] = "Bottom";
        })(LabelPosition = barcode.LabelPosition || (barcode.LabelPosition = {}));
        /** Defines the ratio between narrow and wide bars. */
        var NarrowToWideRatio;
        (function (NarrowToWideRatio) {
            /** The ratio between narrow and wide bars is 1:2 */
            NarrowToWideRatio[NarrowToWideRatio["OneToTwo"] = 0] = "OneToTwo";
            /** The ratio between narrow and wide bars is 1:3 */
            NarrowToWideRatio[NarrowToWideRatio["OneToThree"] = 1] = "OneToThree";
        })(NarrowToWideRatio = barcode.NarrowToWideRatio || (barcode.NarrowToWideRatio = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var _RenderTypeConvertor = /** @class */ (function () {
            function _RenderTypeConvertor() {
            }
            _RenderTypeConvertor.stringToEnum = function (bcVal) {
                switch (bcVal) {
                    case 'canvas':
                        return barcode.RenderType.Canvas;
                    case 'svg':
                        return barcode.RenderType.Svg;
                }
                throw "Unknown Barcode internal renderType '" + bcVal + "'";
            };
            ;
            _RenderTypeConvertor.enumToString = function (value) {
                return barcode.RenderType[wijmo.asEnum(value, barcode.RenderType)].toLowerCase();
            };
            return _RenderTypeConvertor;
        }());
        barcode._RenderTypeConvertor = _RenderTypeConvertor;
        var _LabelPositionConvertor = /** @class */ (function () {
            function _LabelPositionConvertor() {
            }
            _LabelPositionConvertor.stringToEnum = function (value) {
                switch (value) {
                    case 'top':
                        return barcode.LabelPosition.Top;
                    case 'bottom':
                        return barcode.LabelPosition.Bottom;
                }
                throw "Unknown Barcode internal labelPosition '" + value + "'";
            };
            ;
            _LabelPositionConvertor.enumToString = function (value) {
                return barcode.LabelPosition[wijmo.asEnum(value, barcode.LabelPosition)].toLowerCase();
            };
            return _LabelPositionConvertor;
        }());
        barcode._LabelPositionConvertor = _LabelPositionConvertor;
        var _NarrowWideRatioConvertor = /** @class */ (function () {
            function _NarrowWideRatioConvertor() {
            }
            _NarrowWideRatioConvertor.stringToEnum = function (value) {
                switch (value.toString()) {
                    case '2':
                        return barcode.NarrowToWideRatio.OneToTwo;
                    case '3':
                        return barcode.NarrowToWideRatio.OneToThree;
                }
                throw "Unknown nwRatio internal value '" + value + "'";
            };
            ;
            _NarrowWideRatioConvertor.enumToString = function (value) {
                var enumVal = wijmo.asEnum(value, barcode.NarrowToWideRatio), bcVal;
                switch (enumVal) {
                    case barcode.NarrowToWideRatio.OneToTwo:
                        bcVal = '2';
                        break;
                    case barcode.NarrowToWideRatio.OneToThree:
                        bcVal = '3';
                        break;
                }
                return bcVal;
            };
            return _NarrowWideRatioConvertor;
        }());
        barcode._NarrowWideRatioConvertor = _NarrowWideRatioConvertor;
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        //import { InvalidTextException } from './shared/exceptions/index';
        /**
         * Base (abstract) class for all barcode control classes.
         */
        var BarcodeBase = /** @class */ (function (_super) {
            __extends(BarcodeBase, _super);
            /**
             * Initializes a new instance of the {@link BarcodeBase} class.
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function BarcodeBase(element, options) {
                var _this = _super.call(this, element, null, true) || this;
                // wrapper's state in Barcode property/value format
                // TBD: is it possible to retrieve default values for the Barcode class?
                _this._state = {};
                _this._isUpd = 0;
                _this._isValid = true;
                // autoWidth
                _this._aw = false;
                // autoWidthZoom
                _this._wZoom = 1;
                /**
                 * Occurs when the {@link isValid} property value changes.
                 */
                _this.isValidChanged = new wijmo.Event();
                var tpl = _this.getTemplate();
                _this.applyTemplate('wj-barcode wj-control', tpl, {});
                // When div's display=inline-block, the nested canvas makes its height 5px bigger
                // then the canvas height. This may cause an infinite loop in the size propagation 
                // to the underlying barcode object logic, in case if wijmo.css is not loaded yet
                // at the moment when underlying barcode is already instantiated. 
                // To prevent this 5px height increase, we set css line-height to zero, as suggested
                // in this discussion:
                // https://stackoverflow.com/questions/15807833/div-containing-canvas-have-got-a-strange-bottom-margin-of-5px
                // Fix Bug 445038. In IE 10(didn't check other version), line-height = '0px' will be inherited by text element in svg, then text hight will be 0px and looks disappear.
                // So, only add this setting to non-IE browsers. Ps, infinite loop didn't appear in IE and old Edge, so it's safe to add this condition.
                if (!wijmo.isIE()) {
                    _this.hostElement.style.lineHeight = '0px';
                }
                // initialize default options
                //TBD: we need to switch to _getDefaults() after Barcode.encoders become public
                _this._state = _this._getDefaults();
                // Initialization with options goes through property setters, to maintain 
                // property/value mapping between Wijmo wrapper and Barcode. Immediate update
                // of Barcode options is suspended, for the performance sake.
                _this._isUpd++;
                _this.initialize(options);
                _this._updateSize();
                _this._isUpd--;
                // trigger real update of the Barcode options
                _this._mergeOptions({});
                // to check/update content size in case if css affecting it is loaded later
                _this.invalidate();
                return _this;
            }
            BarcodeBase.prototype.initialize = function (options) {
                this._isUpd++;
                try {
                    _super.prototype.initialize.call(this, options);
                }
                finally {
                    this._isUpd--;
                }
                if (!this._isUpd && options && Object.keys(options).length) {
                    this._mergeOptions({});
                }
            };
            // Gets class default options in the Barcode property/value format for the (derived) class 
            // this method is called on.
            // Can be overridden in the derived classes to provide wrapper class specific defaults.
            BarcodeBase._getClassDefaults = function () {
                var type = this.type;
                return barcode._getDefaultConfig(barcode.encoders[type], type);
            };
            // Gets control default options specific to the control's class.
            // If necessary, initializes and caches class default options using the 
            // _getClassDefaults() method.
            BarcodeBase.prototype._getDefaults = function () {
                var classRef = this.constructor;
                if (!classRef._defaults) {
                    classRef._defaults = classRef._getClassDefaults();
                }
                return barcode.Utils.deepMergeAll(classRef._defaults);
            };
            Object.defineProperty(BarcodeBase.prototype, "value", {
                /**
                 * Gets or sets the current code value rendered by the control.
                 */
                get: function () {
                    return this._getProp('text');
                },
                set: function (value) {
                    this._setProp('text', value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BarcodeBase.prototype, "quietZone", {
                /**
                 * Gets or sets the size of quiet zone (the blank margin) around the barcode symbol.
                 */
                get: function () {
                    return this._getProp('quietZone');
                },
                set: function (value) {
                    this._setProp('quietZone', value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BarcodeBase.prototype, "renderType", {
                /**
                 * Gets or sets the rendering type of the control.
                 *
                 * The default value for this property is {@link RenderType.Canvas}.
                 */
                get: function () {
                    return barcode._RenderTypeConvertor.stringToEnum(this._getProp('renderType'));
                },
                set: function (value) {
                    this._setProp('renderType', barcode._RenderTypeConvertor.enumToString(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BarcodeBase.prototype, "color", {
                /**
                 * Gets or sets the forecolor to render the control.
                 *
                 * The default value for this property is <b>rgb(0,0,0)</b>.
                 */
                get: function () {
                    return this._getProp('color');
                },
                set: function (value) {
                    this._setProp('color', value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BarcodeBase.prototype, "backgroundColor", {
                /**
                 * Gets or sets the background color to render the control.
                 *
                 * The default value for this property is <b>rgb(255,255,255)</b>.
                 */
                get: function () {
                    return this._getProp('backgroundColor');
                },
                set: function (value) {
                    this._setProp('backgroundColor', value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BarcodeBase.prototype, "hideExtraChecksum", {
                /**
                 * Indicates whether to show the check digit in the label text of the control.
                 *
                 * The default value for this property is <b>false</b>.
                 */
                get: function () {
                    return this._getProp('hideExtraChecksum');
                },
                set: function (value) {
                    this._setProp('hideExtraChecksum', value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BarcodeBase.prototype, "font", {
                /**
                 * Gets or sets font info for the label text of the control.
                 */
                get: function () {
                    return this._getProp('font');
                },
                set: function (value) {
                    this._setProp('font', value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BarcodeBase.prototype, "isValid", {
                /**
                 * Indicates whether the current {@link value} property value is valid.
                 *
                 * When this property changes its value, the {@link isValidChanged} event
                 * gets triggered.
                 */
                get: function () {
                    return this._isValid;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the {@link isValidChanged} event.
             */
            BarcodeBase.prototype.onIsValidChanged = function (e) {
                this.isValidChanged.raise(this, e);
            };
            /**
             * Refreshes the barcode image.
             *
             * @param fullUpdate Specifies whether to recalculate the barcode size.
             */
            BarcodeBase.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (fullUpdate) {
                    // update _bc's desiredSize
                    this._updateSize();
                }
                else {
                    // re-renders barcode
                    // barcode team made update() to private method, then we asked for a public refresh() to re-render.
                    this._bc.refresh();
                }
            };
            /**
             * Gets the barcode image data info; only supported for canvas rendering.
             */
            BarcodeBase.prototype.getImageData = function () {
                return this._bc.getImageData();
            };
            /**
             * Gets base64 string of the barcode.
             */
            BarcodeBase.prototype.getDataUrl = function () {
                return this._bc.getDataUrl();
            };
            /**
             * Gets the size of barcode symbol.
             */
            BarcodeBase.prototype.getSize = function () {
                var sz = new wijmo.Size();
                var renderSize = this._bc.getSize();
                if (renderSize) {
                    sz.width = renderSize.width;
                    sz.height = renderSize.height;
                }
                return sz;
            };
            // Updates internal and Barcode's state, maintains Barcode lifecycle.
            // 'options' are in the Barcode format
            BarcodeBase.prototype._mergeOptions = function (options) {
                var bc = this._bc, newState = _copyObj(this._state, options), ex;
                if (!this._isUpd) {
                    // check text
                    var text = newState.text;
                    // for empty text, ensure that barcode is destroyed
                    if (text == null || text === '') {
                        if (bc) {
                            bc.destroy();
                            this._bc = bc = null;
                        }
                    }
                    // for non-empty text, update the barcode with new options, or create
                    // a new one if not yet (if possible)
                    else {
                        try {
                            if (bc) {
                                //bc.mergeOption(newState);
                                bc.setOption(newState);
                            }
                            else {
                                this._bc = bc = new barcode.Barcode(this.hostElement, newState);
                            }
                        }
                        catch (e) {
                            ex = e;
                        }
                    }
                }
                var isValid = true;
                if (ex) {
                    if (bc) {
                        bc.destroy();
                        this._bc = bc = null;
                    }
                    // instanceof doesn't work here, because all barcode exception classes
                    // are inherited from native Error. See for the details:
                    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
                    //if (ex instanceof InvalidTextException) {
                    if (ex.code === barcode._errorCode.InvalidText) {
                        // we'll not throw here, so we'll update state with invalid values
                        isValid = false;
                    }
                    else {
                        // throw and don't update state
                        throw ex;
                    }
                }
                // if everything went well (without exceptions), update the state
                this._state = newState;
                this._setValid(isValid);
            };
            BarcodeBase.prototype._setValid = function (isValid) {
                if (this._isValid !== isValid) {
                    this._isValid = isValid;
                    wijmo.toggleClass(this.hostElement, 'wj-state-invalid', !isValid);
                    this.onIsValidChanged();
                }
            };
            // prop/value are in Barcode format
            BarcodeBase.prototype._setProp = function (prop, value) {
                var _a;
                this._mergeOptions((_a = {}, _a[prop] = value, _a));
                // try{
                //     this._mergeOptions({[prop]: value});
                // }
                // catch(err){
                //     BarcodeBase.onErrorResolve(new ErrorResolveEventArgs(this, err.message));
                // }
            };
            // prop/return value are in Barcode format
            BarcodeBase.prototype._getProp = function (prop) {
                var bc = this._bc;
                // TBD: bad, need a single source of truth, how to get default values to _state? 
                return this._state[prop] || bc && bc.getOption()[prop];
            };
            // setOption (option) {
            //     this._bc.setOption(option);
            // }
            // Updates _bc.desiredSize with the size of the host element content.
            //Do we have to initialize a desiredSize at the beginning? If host element has width/height, this is reasonable, what if there's no settings for width/height?
            //I think use defaultConfig is the best choice to avoid given a specific width/height in css file.
            //If there's no default width/height in css file and no desireSize in following code, then we'll got a reasonable size of current barcode, the render size 
            //will only related to unitSize = 1 in defaultConfig. 
            BarcodeBase.prototype._updateSize = function () {
                if (!this.hostElement)
                    return;
                var sz = BarcodeBase._getContentSize(this.hostElement), prevSz = this._prevSz, desiredSize = null, height = null, unitSize = 1, ignore = true;
                if (this._getAw()) {
                    unitSize = this._getWzoom();
                    height = sz.height / unitSize;
                    ignore = height === this._prevH;
                    this._prevH = height;
                    prevSz = this._prevSz = null;
                }
                else if (!(prevSz && sz.equals(prevSz))) {
                    desiredSize = {
                        width: sz.width + 'px',
                        height: sz.height + 'px',
                        forceRounding: false
                    };
                    ignore = false;
                    this._prevSz = sz;
                    this._prevH = null;
                }
                if (!ignore) {
                    this._mergeOptions({ desiredSize: desiredSize, height: height, unitSize: unitSize });
                }
                // if (!(prevSz && sz.equals(prevSz))) {
                //     this._prevSz = sz;
                //     this._mergeOptions({desiredSize: {
                //         width: sz.width + 'px',
                //         height: sz.height + 'px',
                //         forceRounding: false
                //     }});
                // }
            };
            // Returns a content size of the element (excludes border and padding)
            BarcodeBase._getContentSize = function (el) {
                var cs = getComputedStyle(el);
                return new wijmo.Size(el.offsetWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) -
                    parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth), el.offsetHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) -
                    parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth));
            };
            BarcodeBase.prototype._getAw = function () {
                return this._aw;
            };
            BarcodeBase.prototype._setAw = function (value) {
                if (this._aw !== value) {
                    this._aw = value;
                    this._updateSize();
                }
            };
            BarcodeBase.prototype._getWzoom = function () {
                return this._wZoom;
            };
            BarcodeBase.prototype._setWzoom = function (value) {
                wijmo.asNumber(value);
                wijmo.assert(value >= 1, 'autoWidthZoom value should be equal or greater than 1');
                if (this._wZoom !== value) {
                    this._wZoom = value;
                    if (this._getAw()) {
                        this._updateSize();
                    }
                }
            };
            /**
             * Gets or sets the template used to instantiate Barcode controls.
             */
            BarcodeBase.controlTemplate = '';
            return BarcodeBase;
        }(wijmo.Control));
        barcode.BarcodeBase = BarcodeBase;
        var _copyObj = typeof Object.assign === 'function' ? Object.assign :
            function (target) {
                var src = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    src[_i - 1] = arguments[_i];
                }
                for (var _a = 0, src_1 = src; _a < src_1.length; _a++) {
                    var curSrc = src_1[_a];
                    if (curSrc != null) {
                        for (var prop in curSrc) {
                            target[prop] = curSrc[prop];
                        }
                    }
                }
                return target;
            };
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        // Entry file. All real code files should be re-exported from here.
        wijmo._registerModule('wijmo.barcode', wijmo.barcode);
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.barcode.js.map