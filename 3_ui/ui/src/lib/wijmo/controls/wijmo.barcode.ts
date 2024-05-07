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


    module wijmo.barcode {
    /**
 * Defines the options to set the size of the quiet zone on all the sides of the barcode symbol. 
 *
 * The default unit of it will be Pixel if value type is number.
*/
export interface IQuietZone{
    /** 
     * The size of the quiet zone on the left side of the barcode symbol.
     * 
     * The default value for this property is <b>0</b>.
    */
    left?: string | number;
    /** 
     *  The size of the quiet zone on the right side of the barcode symbol.
     * 
     * The default value for this property is <b>0</b>.
    */
    right?: string | number;
    /** 
     *  The size of the quiet zone on the top side of the barcode symbol.
     * 
     * The default value for this property is <b>0</b>.
    */
    top?: string | number;
    /** 
     *  The size of the quiet zone on the bottom of the barcode symbol.
     * 
     * The default value for this property is <b>0</b>.
    */
    bottom?: string | number;
}

/**
 * Defines the option for quiet zone to include addOn symbol. The default unit will be Pixel if value type is number.
 */
export interface IQuietZoneWithAddOn extends IQuietZone{
    /** 
     * Add on is the size of quiet zone between main symbol and add on symbol.
     * 
     * The default value for this property is <b>0</b>.
    */
    addOn?: string | number;
}

/**
 * Defines the font settings which can be applied on barcode value.
 */
export interface IBarcodeFont{
    /** 
     * Gets or Sets the family of the font for the barcode value. 
     * 
     * The default value for this property is <b>sans-serif</b>.
    */
    fontFamily?: string;
    /** 
     * Gets or Sets the style of the font for the barcode value.
     * 
     * The default value for this property is <b>normal</b>.
    */
    fontStyle?: string;
    /** 
     * Gets or Sets the weight of the font for the barcode value.
     * 
     * The default value for this property is <b>normal</b>.
    */
    fontWeight?: string;
    /** 
     * Gets or Sets the decoration for the text in the barcode value. 
     * 
     * The default value for this property is <b>none</b>.
    */
    textDecoration?: string;
    /** 
     * Gets or Sets the alignment of the text in the barcode value.
     * 
     * The default value for this property is <b>center</b>.
    */
    textAlign?: string;
    /** 
     * Gets or Sets the size of font for the barcode value.
     * 
     * The default value for this property is <b>12px</b>.
    */
    fontSize?: number | string;
}

/**
 * Defines the settings which automatically changes the width of the barcode
 * 
 * on changing the length of the its value.
 */
export interface IVariableWidthBarcode {
    /**
     * Gets or sets a value specifying whether the control width should automatically
     *
     * change on changing the length of barcode value.
     */
    autoWidth: boolean;

    /**
     * Gets or sets a zoom factor that is applied to the automatically calculated control width.
     */
    autoWidthZoom: number;
}
    }
    


    module wijmo.barcode {
    const alignmentMap = {
    center: 'middle',
    left: 'start',
    right: 'end'
};

export class SVGRenderContext {
    private dom: any;
    private style: any;
    private scale: any;
    private color: any;
    private g: any;
    constructor (dom, style, scale){
        this.dom = dom;
        this.style = style;
        this.scale = scale;
        this.color = 'rgb(0,0,0)';
        this.addGroup();
    }
  
    setColor (color) {
        this.color = color;
    }

    setBackgroundColor (color) {
        const {dom} = this;
        dom.style.backgroundColor = color;
    }

    addGroup () {
        const {dom} = this;
        this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.g.setAttribute('shape-rendering', 'crispEdges');
        dom.appendChild(this.g);
    }

    drawRect (shape: any) {
        const {g, scale, color} = this;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', (shape.x * scale).toString());
        rect.setAttribute('y', (shape.y * scale).toString());
        rect.setAttribute('width', (shape.width * scale).toString());
        rect.setAttribute('height', (shape.height * scale).toString());
        rect.style.fill = color;
        g.appendChild(rect);
    }

    drawText (shape) {
        const {g, scale, color, style} = this;
        const textNode = document.createElementNS('http://www.w3.org/2000/svg','text');
        
        textNode.style.fill = color;
        textNode.style.fontSize = style.fontSize;
        textNode.style.fontFamily = style.fontFamily;
        textNode.style.fontStyle = shape.fontStyle || style.fontStyle;
        textNode.style.fontWeight = shape.fontWeight || style.fontWeight;
        textNode.style.textDecoration = shape.textDecoration || style.textDecoration;
        textNode.style.textAnchor = alignmentMap[shape.textAlign || style.textAlign];
        textNode.textContent = shape.text;
        textNode.textContent = this.clipString(shape, textNode);
        const textSize = this._measureText(textNode);
        textNode.setAttribute('y', (shape.y * scale + Math.abs(textSize.y)).toString());
        textNode.setAttribute('x', (shape.x * scale).toString());
        g.appendChild(textNode);
    }

    clipString(shape, textNode) {
        const {scale} = this;
        let {text, maxWidth} = shape;
        const textSize = this._measureText(textNode);
        maxWidth *= scale;
        if (textSize.width > maxWidth) {
            const capacity = Math.floor(maxWidth / textSize.width * text.length);
            return shape.text.substr(0, capacity);
        }

        return text;
    }

    clear () {
        const {dom} = this;
        dom.removeChild(this.g);
        this.addGroup();
    }

    _measureText(textNode) {
        const dummySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        dummySvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        dummySvg.style.visibility = 'hidden';
        dummySvg.style.position = 'absolute';
        textNode.setAttribute('x', 0);
        textNode.setAttribute('y', 0);
        dummySvg.appendChild(textNode);

        document.body.appendChild(dummySvg);
        const size = textNode.getBBox();
        document.body.removeChild(dummySvg);
        return size;
    }

    getDataUrl () {
        // let serializer = new XMLSerializer();
        // let svgStr = serializer.serializeToString(this.dom);
        return 'data:image/svg+xml;base64,' + btoa(this.dom.outerHTML);
    }
}
    }
    


    module wijmo.barcode {
    export class CanvasRenderContext {
    private dom: any;
    private style: any;
    private ctx: any;
    private scale: any;
    constructor (dom, style, scale){
        this.dom = dom;
        this.style = style;
        this.ctx = this.dom.getContext('2d');
        this.scale = scale;
    }
  
    setColor (color) {
        this.ctx.fillStyle = color;
    }

    setBackgroundColor (color) {
        const {ctx, dom} = this;
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, dom.width, dom.height);
        ctx.restore();
    }

    drawRect (shape) {
        const {ctx, scale} = this;
        ctx.fillRect(shape.x * scale, shape.y * scale, shape.width * scale, shape.height * scale);
    }

    drawText (shape) {
        const {ctx, style, scale} = this;
    
        ctx.save();
        ctx.font = `${shape.fontStyle || style.fontStyle} ${shape.fontWeight || style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        ctx.textAlign = shape.textAlign || style.textAlign;
        ctx.textBaseline = 'bottom';
        const x = shape.x * scale;
        const y = shape.y * scale;
        const text = this.clipString(shape);
        ctx.fillText(text, x, y + style.fontHeight);
        
        this.drawTextDecorationLine(text, x, y, shape.textDecoration || style.textDecoration);
        
        ctx.restore();
    }

    clipString(shape) {
        const {ctx, scale} = this;
        let {text, maxWidth} = shape;
        const textSize = ctx.measureText(text);
        maxWidth *= scale;
        if (textSize.width > maxWidth) {
            const capacity = Math.floor(maxWidth / textSize.width * text.length);
            return shape.text.substr(0, capacity);
        }

        return text;
    }

    drawTextDecorationLine(text, x, y, textDecoration) {
        let ratio;

        switch(textDecoration){
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

        const {ctx, style: {fontHeight}} = this;
        let width = ctx.measureText(text).width;
        switch(ctx.textAlign){
        case 'center':
            x -= ( width / 2 ); 
            break;
        case 'right':
            x -= width;
            break;
        }
        ctx.lineWidth = 1;
        ctx.beginPath();
        let _y = fontHeight * ratio  + y;
        ctx.moveTo(x, _y);
        ctx.lineTo(x + width, _y);
        ctx.stroke();
    }

    clear () {
        const {ctx, dom} = this;
        ctx.clearRect(0, 0, dom.width, dom.height);
    }

    getImageData () {
        const {ctx, dom} = this;
        return ctx.getImageData(0, 0, dom.width, dom.height);
    }

    getDataUrl () {
        return this.dom.toDataURL();
    }
}
    }
    


    module wijmo.barcode {
    export enum _errorCode {
    Unknown,
    InvalidOptions,
    InvalidBarcodeType,
    InvalidRenderType,
    MethodNotImplement,
    InvalidText,
    InvalidCharacter,
    TextTooLong,
    GroupSizeOverflow,
}

interface IErrorDescriptor {
    source: any;
    message: string;
}

export class BaseException extends Error {
    public code: _errorCode;
    public descriptor: IErrorDescriptor;

    constructor (errorCode?: _errorCode) {
        super();
        this.code = errorCode || _errorCode.Unknown;
    }
}

    }
    


    module wijmo.barcode {
    

export const ErrorCode = _errorCode;

export class InvalidOptionsException extends BaseException {
    constructor (arg, reason = '') {
        super(_errorCode.InvalidOptions);
        this.name = 'InvalidOptionsException';
        this.message = `${JSON.stringify(arg)} is not valid options. ${reason}`;
        this.descriptor = {
            source: arg,
            message: this.message,
        };
    }
}

// invalid barcode type
export class InvalidBarcodeTypeException extends BaseException {
    constructor (type) {
        super(_errorCode.InvalidBarcodeType);
        this.name = 'InvalidBarcodeTypeException';
        this.message = `${type} is not support!`;
        this.descriptor = {
            source: type,
            message: this.message,
        };
    }
}

// invalid render type
export class InvalidRenderException extends BaseException {
    constructor (type) {
        super(_errorCode.InvalidRenderType);
        this.name = 'InvalidRenderException';
        this.message = `${type} is not support!`;
        this.descriptor = {
            source: type,
            message: this.message,
        };
    }
}

// render doesnt have getImageData function 
export class MethodNotImplementException extends BaseException {
    constructor (name, reason) {
        super(_errorCode.MethodNotImplement);
        this.name = 'MethodNotImplementException';
        this.message = `${name} is not a method! ${reason}`;

        this.descriptor = {
            source: name,
            message: this.message,
        };
    }
}

// invalid text
export class InvalidTextException extends BaseException {
    constructor (text?, reason = '') {
        super(_errorCode.InvalidText);
        this.name = 'InvalidTextException';
        if (!text) {
            this.message = 'Text is required.'
        } else {
            this.message = `${text} is invalid. ${reason}`;
        }
        this.descriptor = {
            source: text,
            message: this.message,
        };
    }
}

export class InvalidCharacterException extends BaseException {
    constructor (char) {
        super(_errorCode.InvalidCharacter);
        this.name = 'InvalidCharacterException';
        this.message = `${char} is invalid.`;

        this.descriptor = {
            source: char,
            message: this.message,
        };
    }
}

export class TextTooLongException extends BaseException {
    constructor () {
        super(_errorCode.TextTooLong);
        this.name = 'TextTooLongException';
        this.message = 'Text is too long to encode';

        this.descriptor = {
            source: null,
            message: this.message,
        };
    }
}

export class GroupSizeOverflowException extends BaseException {
    constructor (num) {
        super(_errorCode.GroupSizeOverflow);
        this.name = 'GroupSizeOverflowException';
        this.message = `Group size is ${num}. The max group size is 9.`;

        this.descriptor = {
            source: num,
            message: this.message,
        };
    }
}
    }
    


    module wijmo.barcode {
    



function createRenderDom (type, size) {
    let dom;
    if (type === 'svg') {
        dom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        dom.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    } else {
        dom = document.createElement('canvas');
    }

    dom.setAttribute('width', size.width);
    dom.setAttribute('height', size.height);

    return dom;
}

export class BarcodeRender {
    private container: any;
    private barcode: any;
    private style: any;
    private size: any;
    private context: any;
    private renderDom: any;
    constructor (container, barcode){
        this.container = container;
        barcode.toSymbol();
        this.barcode = barcode;
        this.style = barcode.style;

        let scale = this.style.unitValue;

        this.size = {
            width: barcode.size.width * scale,
            height: barcode.size.height * scale
        };
        
        let renderDom = createRenderDom(this.style.renderType, this.size);

        switch (this.style.renderType) {
        case 'svg':
            this.context = new SVGRenderContext(renderDom, this.style, scale);
            break;
        case 'canvas':
            this.context = new CanvasRenderContext(renderDom, this.style, scale);
            break;
        default:
            throw new InvalidRenderException(this.style.renderType);
        }
        if (container) {
            container.appendChild(renderDom);
        }
        this.renderDom = renderDom;
    }

    render () {
        const {style, barcode: {shapes}} = this;
        const context = this.context;
        context.clear();

        context.setColor(style.color);
        context.setBackgroundColor(style.backgroundColor);

        shapes.forEach((shape) => {
            if (shape.type === 'rect') {
                context.drawRect(shape);
            }
            if (shape.type === 'text') {
                context.drawText(shape);
            }
        });

        return this;
    }

    getImageData () {
        if (!this.context.getImageData) {
            throw new MethodNotImplementException('getImageData', 'You are working with svg render.');
        }
        return this.context.getImageData();
    }

    getDataUrl () {
        return this.context.getDataUrl();
    }

    destroy () {
        if (this.container) {
            this.container.removeChild(this.renderDom);
        }
    }

    getSize() {
        return this.size;
    }
}
    }
    


    module wijmo.barcode {
    function isFunction(value) {
    return typeof value === 'function';
}

function isWindow(obj) {
    return !!obj && obj === obj.window;
}

function isDefined (value) {
    return typeof value !== 'undefined';
}

function isNaN (value) {
    if (isFunction(Number.isNaN)) {
        return Number.isNaN(value);
    } else {
        return value !== value;
    }
}

function isNumberLike (value) {
    return !isNaN(+value);
}

function sliceString (text = '', step = 1, fn) {
    let index = 0,
        length = text.length;

    let count = 0;
    while (index < length) {
        fn(text.substring(index, index + step), count);
        index += step;
        count++;
    }
}

function sliceArray (arr = [], step = 1, fn) {
    let index = 0,
        length = arr.length;

    let count = 0;
    while (index < length) {
        fn(arr.slice(index, index + step), count);
        index += step;
        count++;
    }
}

function str2Array (text = '') {
    if (isFunction(Array.from)) {
        return Array.from(text);
    } else {
        return Array.prototype.slice.call(text);
    }
}

function combineTruthy(text = '') {
    let chars = str2Array(text),
        stack = [];
    
    chars.forEach((char) => {
        if (char === '0') {
            stack.push(0);
        } else {
            if (stack[stack.length - 1] && stack[stack.length] !== 0) {
                let top = stack.pop();
                stack.push(++top);
            } else {
                stack.push(1);
            }
        }
    });

    return stack;
}

function convertRadix(num, radix = 2) {
    num = +num;
    return num.toString(radix);
}

function isEven(number) {
    return number % 2 === 0;
}

function isOdd(number) {
    return number % 2 === 1;
}

function toNumber (str = '', defaultValue = 0) {
    if (typeof str === 'number') {
        return str;
    }

    let value = parseFloat(str);

    return isNaN(value) ? defaultValue : value;
}

function getUnit (str = '') {
    let result = /[a-zA-Z]+/.exec(str);

    return result ? result[0] : 'px';
}

function getMaxValue (arr, field = 'length') {
    let max = 0;
    arr.forEach((item) => {
        if (item[field] > max) {
            max = item[field];
        }
    });

    return max;
}

function assign (target, ...varArgs) {
    if (isFunction(Object.assign)) {
        return Object.assign(target, ...varArgs);
    }

    if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
    }

    let to = Object(target);

    for (let index = 0; index < varArgs.length; index++) {
        let nextSource = varArgs[index];

        if (nextSource != null) { // Skip over if undefined or null
            for (let nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
}

function deepMerge (target, ...srcs) {
    if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
    }

    srcs.forEach((src) => {
        if (src) {
            for (let key in src) {
                if (Object.prototype.hasOwnProperty.call(src, key)) {
                    if (src[key] != null && typeof src[key] === 'object' && typeof target[key] === 'object') {
                        target[key] = deepMerge({}, target[key] || {}, src[key]);
                    } else {
                        target[key] = src[key];
                    }
                }
            }
        }
    });
    return target;
}

function deepMergeAll(...srcs) {
    return deepMerge({}, ...srcs);
}

function strRepeat (text, count) {
    if (isFunction(text.repeat)) {
        return text.repeat(count);
    }

    let str = '' + text;
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
    let rpt = '';
    for (let i = 0; i < count; i++) {
        rpt += str;
    }
    return rpt;
} 

function isInteger (value) {
    if (isFunction(Number.isInteger)) {
        return Number.isInteger(value);
    }
    return typeof value === 'number' && 
    isFinite(value) && 
    Math.floor(value) === value;
}

function fillArray (arr, value) {
    if (isFunction(arr.fill)) {
        return arr.fill(value);
    }

    for (let i = 0; i < arr.length; i++) {
        arr[i] = value;
    }
    return arr;
}

function strPadStart (str, targetLength, padString) {
    if (isFunction(str.padStart)) {
        return str.padStart(targetLength,padString);
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

const plugins:any = {};
function registerPlugin (name, fn) {
    plugins[name] = fn;
}

function _defaultMeasureText (text, style) {
    const num = toNumber(style.fontSize, 12);
    return num * 1.4;
}

function measureText (text, style) {
    if (isFunction(plugins.measureText)) {
        return plugins.measureText(text, style);
    }

    return _defaultMeasureText(text, style);
}


function _defaultConvertUnit (size) {
    const num = toNumber(size, 12);
    return num;
}

function convertUnit (size) {
    if (isFunction(plugins.convertUnit)) {
        if (isNumberLike(size)) {
            return toNumber(size, 12);
        }
        return plugins.convertUnit(size);
    }
    return _defaultConvertUnit(size);
}

function fixSize2PixelDefault (size) {
    if (isNumberLike(size)) {
        return size + 'px';
    }

    return size;
}

function loop(cb, range) {
    let i, length;
    if (isFinite(range)) {
        i = 0;
        length = range;
    } else {
        i = range.from;
        length = range.to + 1;
    }
    for (; i < length; i++) {
        cb(i);
    }
}

function toZeroOnePattern(data, evenIsBar?) {
    const func = evenIsBar ? isEven : isOdd;
    return data.reduce((res, item, i) => {
        if (func(i)) {
            res += strRepeat('1', item);
        } else {
            res += strRepeat('0', item);
        }
        return res;
    }, '');
}

function range(from , to) {
    const result = [];
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
        value: function(v) {
            return this.$br[v];
        }
    });

    const br = Object.keys(mapping).reduce((obj, key) => {
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

export const Utils = {isFunction, isWindow, isDefined, isNaN, isNumberLike, sliceString, sliceArray, str2Array, combineTruthy, convertRadix, isEven, isOdd, toNumber,
    getUnit, getMaxValue, assign, deepMerge, deepMergeAll, strRepeat, isInteger, fillArray, strPadStart, registerPlugin, measureText, convertUnit,
    fixSize2PixelDefault, loop, toZeroOnePattern, range, makeEnums};
    }
    


    module wijmo.barcode {
    


export class Option {
    static DefaultOptions = {
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
        // desiredSize: {
        //     width: 0,
        //     height: 0,
        //     forceRounding: true
        // }
    };
    static CustomDefaultOptions = {};

    static setCustomDefaultOptions(customDefaultOptions) {
        Option.CustomDefaultOptions = customDefaultOptions;
    }

    private originConfig: any;
    private type: any;
    private penddingMerge: any;
    constructor (options = {}){
        this.originConfig = options;
        this.type = (options as any).type;
        this.penddingMerge = [];
    }

    spawn(partialOption): Option {
        return new Option(Utils.deepMergeAll(this.originConfig, partialOption));
    }

    merge(options) {
        this.penddingMerge.unshift(options);
    }

    _getUnitValue(unitSize) {
        unitSize = Utils.fixSize2PixelDefault(unitSize);
        return Utils.convertUnit(unitSize);
    }

    getMergedOption() {
        return Utils.deepMergeAll(Option.DefaultOptions, ...this.penddingMerge, Option.CustomDefaultOptions, this.originConfig);
    }

    getConfig(unitValue) {
        const mergedConfig = this.getMergedOption();
        let { text, quietZone, height, labelPosition, desiredSize, showLabel, font, backgroundColor, color, renderType, unitSize, hideExtraChecksum } = mergedConfig;
        const encodeConfig: any = {
            text,
            isLabelBottom: false,
            hideExtraChecksum,
        };
        if (Utils.isDefined(text)) {
            encodeConfig.text += '';
        } else {
            throw new InvalidTextException();
        }
        if (Utils.isDefined(labelPosition)) {
            encodeConfig.isLabelBottom = labelPosition !== 'top';
        }

        font = Utils.deepMergeAll(font);
        font.fontSize = Utils.fixSize2PixelDefault(font.fontSize);
        const fontHeight = Utils.measureText(text, font);
        encodeConfig.showLabel = showLabel;

        unitValue = unitValue || this._getUnitValue(unitSize);
        const fontSizeInUnit = showLabel ? fontHeight / unitValue : 0;
        encodeConfig.fontSizeInUnit = fontSizeInUnit;

        const newQuietZone: any = {};
        for (let key in quietZone) {
            if (quietZone.hasOwnProperty(key)) {
                let item = quietZone[key];
                if (Utils.isNumberLike(item)) {
                    const value = +item;
                    newQuietZone[key] = value;
                } else {
                    let pixelValue = Utils.convertUnit(item);
                    newQuietZone[key] = pixelValue / unitValue;
                }
            }
        }
        encodeConfig.quietZone = newQuietZone;

        if (desiredSize) {
            encodeConfig.containerWidth = Utils.convertUnit(Utils.fixSize2PixelDefault(desiredSize.width));
            encodeConfig.containerHeight = Utils.convertUnit(Utils.fixSize2PixelDefault(desiredSize.height));
            encodeConfig.desiredSize = desiredSize;
        }

        if (Utils.isDefined(height)) {
            if (desiredSize) {
                let barAbsHeight = showLabel ? (encodeConfig.containerHeight - fontHeight) : encodeConfig.containerHeight;
                encodeConfig.height = barAbsHeight / unitValue - newQuietZone.top - newQuietZone.bottom;
            } else if (Utils.isNumberLike(height)) {
                encodeConfig.height = +height - fontSizeInUnit - newQuietZone.top - newQuietZone.bottom;
            } else {
                encodeConfig.height = Utils.convertUnit(height) / unitValue - fontSizeInUnit - newQuietZone.top - newQuietZone.bottom;
            }
        }

        const style = Utils.deepMergeAll({
            backgroundColor, color, renderType, unitValue, fontSize: font.fontSize, fontHeight,
        }, font);

        return {
            config: mergedConfig,
            encodeConfig, 
            style,
        };
    }

    getOriginConfig() {
        return this.originConfig;
    }

    getType(): string {
        return this.type;
    }
}
    }
    


    module wijmo.barcode {
     


function _getProtos(targetClass: any): any[]{
    var protos = [];
    if(targetClass && targetClass instanceof Function){
        let baseClass = targetClass;
        protos.push(baseClass);
        while (baseClass){
            const newBaseClass = Object.getPrototypeOf(baseClass);
            if(newBaseClass && newBaseClass !== Object && newBaseClass !== Function.prototype){
              baseClass = newBaseClass;
              protos.push(baseClass);
            }else{
              break;
            }
          }
    }
    return protos;
}

export function _getDefaultConfig(encoder, type){
  var penddingMerge = [{'type': type}];
  var protolist = _getProtos(encoder);
  protolist.forEach((_proto)=>{
    //checked the minify result, static props will not be minified, so use both ['DefaultConfig'] and .DefaultConfig is fine.
    if(_proto['DefaultConfig']){
        penddingMerge.unshift(_proto['DefaultConfig']);
    }
  })
  return Utils.deepMergeAll(Option.DefaultOptions, ...penddingMerge, Option.CustomDefaultOptions);
}

export class _EnumDictionary {
  private _keys: { [key: number]: string } = {};
  private _values: { [key: string]: number } = {};
  
  constructor(enumType, func) {   
    for(let enumValue in enumType){
      if(typeof enumType[enumValue] == "string"){
        var enumNumber = parseInt(enumValue);
        var bcValue = func(enumType[enumNumber]);
        this._keys[enumNumber] = bcValue;
        this._values[bcValue] = enumNumber;
      }
    }
  }

  getEnumByString(value: string): number{
     var enumStr = this._values[value];
     if(enumStr === undefined){
      throw `Unknown Barcode internal value '${value}'`;
     }
     return enumStr;
  }

  getStringByEnum(key: number): string{
    return this._keys[key];
  }
}
    }
    


    module wijmo.barcode {
    

export class Area {

    private x: number = 0;
    private y: number = 0;
    private width: number;
    private height: number;
    protected children: object[];
    protected style = {
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
    protected offsetBox: any;
    protected contentBox: any;
    constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
        this.children = [];
        this._updateBox();
    }

    append(element) {
        this.children.push(element);
    }

    _makeRect(x, y, width, height) {
        return {
            x,
            y,
            height,
            width,
            type: 'rect',
        };
    }

    toShapes() {
        const { x, y, width, height, style: { border, margin } } = this;

        const result = [];
        const _width = border.left + border.right +  width;
        const _height = border.top + border.bottom + height;
        const startX = x + margin.left;
        const startY = y + margin.top;
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
    }

    getSize() {
        const { width, height, offsetBox } = this;
        return {
            width: width + offsetBox.width,
            height: height + offsetBox.height,
        };
    }

    visiable() {
        return this.width > 0 && this.height > 0;
    }

    setX(x) {
        this.x = x;
        this._updateBox();
    }
    setY(y) {
        this.y = y;
        this._updateBox();
    }
    updateContentSize(w, h) {
        this.width = w;
        this.height = h;
        this._updateBox();
    }

    _fixOpt(style, key) {
        if (Utils.isNumberLike(style[key])) {
            const value = style[key];
            style[key] = {
                top: value, right: value, bottom: value, left: value,
            };
        }
    }
    setStyle(style) {
        this._fixOpt(style, 'padding');
        this._fixOpt(style, 'border');
        this._fixOpt(style, 'margin');
        this.style = Utils.deepMergeAll(this.style, style);
        this._updateBox();
    }

    _updateBox() {
        const { x, y, width, height, style: { padding, border, margin } } = this;

        this.offsetBox = {
            x: x + padding.left + border.left + margin.left,
            y: y + padding.top + border.top + margin.top,
            width: margin.left + border.left + border.right + margin.right,
            height: margin.top + border.top + border.bottom + margin.bottom,
        };
        const contentW = width - padding.left - padding.right;
        const contentH = height - padding.top - padding.bottom;
        this.contentBox = {
            width: contentW >= 0 ? contentW : 0,
            height: contentH >= 0 ? contentH : 0,
        };
    }
}
    }
    


    module wijmo.barcode {
    

export class HorizontalLayoutArea extends Area {
    toShapes() {
        this._updateContentSize();
        const { children, offsetBox } = this;
        let result = super.toShapes();
        const deltaY = offsetBox.y;
        let position = 0;
        children.forEach((item) => {
            const deltaX = offsetBox.x + position;
            const shapes = (item as any).toShapes();
            shapes.forEach((shape) => {
                shape.x += deltaX;
                shape.y += deltaY;
                result.push(shape);
            });
            const itemSize = (item as any).getSize();
            position += itemSize.width;
        });

        return result; 
    }

    getSize() {
        this._updateContentSize();
        return super.getSize();
    }

    _updateContentSize() {
        const { children, style: { padding } } = this;

        const contentSize = children.reduce((result, item) => {
            const size = (item as any).getSize();
            (result as any).height = Math.max(size.height, (result as any).height);
            (result as any).width += size.width;
            return result;
        }, {
            width: 0,
            height: 0,
        });

        this.updateContentSize((contentSize as any).width + padding.left + padding.right, (contentSize as any).height + padding.top + padding.bottom);
    }
}
    }
    


    module wijmo.barcode {
    

export class VerticalLayoutArea extends Area {
    toShapes(): any[] {
        this._updateContentSize();
        const { children, offsetBox } = this;
        let result = super.toShapes();
        const deltaX = offsetBox.x;
        let position = 0;
        children.forEach((item) => {
            const deltaY = offsetBox.y + position;
            const shapes = (item as any).toShapes();
            shapes.forEach((shape) => {
                shape.x += deltaX;
                shape.y += deltaY;
                result.push(shape);
            });
            const itemSize = (item as any).getSize();
            position += itemSize.height;
        });

        return result; 
    }

    getSize() {
        this._updateContentSize();
        return super.getSize();
    }

    _updateContentSize() {
        const { children, style: { padding } } = this;

        const contentSize = children.reduce((result, item) => {
            const size = (item as any).getSize();
            (result as any).width = Math.max(size.width, (result as any).width);
            (result as any).height += size.height;
            return result;
        }, {
            width: 0,
            height: 0,
        });

        this.updateContentSize((contentSize as any).width + padding.left + padding.right, (contentSize as any).height + padding.top + padding.bottom);
    }
}
    }
    


    module wijmo.barcode {
    

export class MatrixSymbolArea extends Area {
    private _xPosition: number = 0;
    private _yPosition: number = 0;
    private _lastMaxHeight = 0;
    private _rowHeight = 0;
    constructor(width, height, rowHeight?) {
        super(width, height);
        this._rowHeight = rowHeight;
    }

    append(width?, height?) {
        if (!width || !height) {
            return;
        }
        
        this._autoWrap(width);
        const { children, _xPosition, _yPosition } = this;
        const element = {
            width, height, x: _xPosition, y: _yPosition,
        };
        children.push(element);
        this._xPosition += width;

        if (!this._rowHeight) {
            this._lastMaxHeight = Math.max(this._lastMaxHeight, height);
        }
        
    }

    _autoWrap(width) {
        if (this._checkNeedWrap(width)) {
            this._yPosition += (this._rowHeight || this._lastMaxHeight);
            this._xPosition = 0;
            this._lastMaxHeight = 0;
        }
    }
    _checkNeedWrap(eleWidth) {
        const { _xPosition, contentBox: { width } } = this;
        return width - _xPosition - eleWidth < 0;
    }

    space(width = 1) {
        this._autoWrap(width);
        this._xPosition += width;
    }

    toShapes() {
        if (!this.visiable()) {
            return [];
        }
        const { offsetBox, children } = this;
        const result = super.toShapes();
        children.forEach((item: any) => {
            item.x += offsetBox.x;
            item.y += offsetBox.y;
            item.type = 'rect';
            result.push(item);
        });

        return result;
    }
}
    }
    


    module wijmo.barcode {
    


export class SymbolArea extends Area {
    private _lastIsBar: boolean = false;
    private _cacheNumber: number = 0;
    private _position: number = 0;
    constructor(width, height) {
        super(width, height);
    }

    append(barWidth, barHeight?, offsetY?) {
        if (!barWidth) {
            return;
        }
        const { children, _position } = this;
        const element = {
            width: barWidth, x: _position, barHeight, offsetY,
        };
        
        children.push(element);
        this._position += barWidth;
    }

    space(n = 1) {
        this._position += n;
    }

    _appendModule(flag) {
        const isBar = flag === '1';
        if (isBar !== this._lastIsBar) {
            this._flash();
            this._lastIsBar = isBar;
        }
        this._cacheNumber++;
    }

    _flash() {
        if (this._cacheNumber > 0) {
            if (this._lastIsBar) {
                this.append(this._cacheNumber);
            } else {
                this.space(this._cacheNumber);
            }
            this._cacheNumber = 0;
        }
    }

    fromPattern(str) {
        Utils.str2Array(str).forEach((num) => this._appendModule(num));
        this._flash();
    }

    getContentBox() {
        return this.contentBox;
    }

    toShapes() {
        if (!this.visiable()) {
            return [];
        } 
        const { offsetBox, children, contentBox: { height } } = this;
        const result = super.toShapes();
        children.forEach((item) => {
            result.push({
                type: 'rect',
                x: (item as any).x + offsetBox.x,
                y: offsetBox.y + ((item as any).offsetY || 0),
                width: (item as any).width,
                height: (item as any).barHeight || height,
            });
        });

        return result;
    }
}
    }
    


    module wijmo.barcode {
    

export class LabelArea extends Area {
    private _textAlign: string;
    constructor(width, height, textAlign) {
        super(width, height);
        this._textAlign = textAlign;
    }

    toShapes() {
        if (!this.visiable()) {
            return [];
        }
        const { offsetBox, children, _textAlign, contentBox: { width } } = this;
        const result = super.toShapes();
        children.forEach((item) => {
            let deltaX = offsetBox.x;
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
                x: deltaX + ((item as any).x || 0),
                y: offsetBox.y + ((item as any).y || 0),
                textAlign: _textAlign,
                maxWidth: width,
                type: 'text',
                text: (item as any).text,
            });
        });

        return result;
    }
}
    }
    


    module wijmo.barcode {
    





    }
    


    module wijmo.barcode {
    

export class MatrixBuilder {
    private data:any = [];
    private row: any;
    private col: any;
    constructor (row, col) {
        this.data = [];
        this.row = row;
        this.col = col;
    }

    add(row, col, data) {
        const mRow = this.data[row] || Utils.fillArray(new Array(this.col), null);
        mRow[col] = data;
        this.data[row] = [];
    }

    toMatrix() {
        const result = [];
        Utils.loop((i) => {
            result.push(this.data[i] || Utils.fillArray(new Array(this.col), null));
        }, this.row);
        return result;
    }
}
    }
    


    module wijmo.barcode {
    export class BitBuffer {
    private buffer: any;
    private length: any;
    private index: number;
    constructor (buffer = []) {
        this.buffer = buffer;
        this.length = buffer.length * 8;
        this.index = 0;
    }
    
    putBit (bit) {
        let bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
            this.buffer.push(0);
        }

        if (bit) {
            this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
        }
        this.length += 1;
    }

    putBitAt(bit, pos) {
        const { length: len } = this;
        const newBuffer = new BitBuffer();

        for(let i = 0; i < len; i++) {
            if (i === pos) {
                newBuffer.putBit(bit);
            } else {
                newBuffer.putBit(this.getAt(i));
            }
        }

        this.buffer = newBuffer.buffer;
        this.length = newBuffer.length;
    }

    put (num, length) {
        for (let i = 0; i < length; i += 1) {
            this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
        }
    }

    putBits(bits) {
        this.put(parseInt(bits, 2), bits.length);
    }

    getAt (index) {
        const bufIndex = Math.floor(index / 8);
        return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    }

    getBuffer () {
        return this.buffer;
    }

    getGroupedBits(size) {
        let pos = 0;
        const result = [];
        while (pos < this.length) {
            let item = '', i = pos, len = pos + size;
            for (; i < len; i++) {
                item += this.getAt(i) ? 1 : 0;
            }
            pos = len;
            result.push(parseInt(item, 2));
        }

        return result;
    }

    next () {
        this.index++;
        return this.getAt(this.index-1);
    }
}
    }
    


    module wijmo.barcode {
    export abstract class BarcodeEncoder {
    private _option: any;
    private useDesiredSize: boolean;

    protected shapes:any[];
    protected size: any;
    protected style: any;
    protected encodeConfig: any;
    protected config: any;

    constructor (option){
        this._option = option;
        this.shapes = [];
        this.size = {
            width: 0,
            height: 0
        };
        this.applyDesiredSize();
    }

    validate () {}

    abstract calculateData ();

    abstract adjustDesiredSize ();

    abstract convertToShape (data?, forMeasure?);

    applyDesiredSize(unitValue?) {
        const { config, encodeConfig, style } = this._option.getConfig(unitValue);

        this.config = config;
        this.encodeConfig = encodeConfig;
        this.style = style;
        this.useDesiredSize = !!encodeConfig.desiredSize;
    }

    afterApplyDesiredSize() {
        // noop
    }

    toSymbol() {
        this.validate();
        const data = this.calculateData();
        if (this.useDesiredSize) {
            this.convertToShape(data, true);
            this.adjustDesiredSize();
            this.afterApplyDesiredSize();
        }
        this.convertToShape(data);
    }
}
    }
    


    module wijmo.barcode {
    


export abstract class TwoDimensionalBarcode extends BarcodeEncoder {
    adjustDesiredSize () {
        const { width, height } = this.size;
        const { desiredSize, containerWidth, containerHeight } = this.encodeConfig;
        let unitValue = Math.min(containerWidth / width, containerHeight / height);
        if (desiredSize.forceRounding) {
            unitValue = ~~unitValue;
            unitValue = unitValue < 1 ? 1 : unitValue;
        }

        this.applyDesiredSize(unitValue);
    }

    convertToShape (matrix?, forMeasure?) {
        const { quietZone } = this.encodeConfig;

        const symbolWidth = matrix[0].length + quietZone.right + quietZone.left;
        const symbolHeight = matrix.length + quietZone.top + quietZone.bottom;
        const mainArea = new VerticalLayoutArea();
        const symbolArea = new MatrixSymbolArea(symbolWidth, symbolHeight, 1);
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
            matrix.forEach((row) => {
                row.forEach((cell) => {
                    if (cell) {
                        symbolArea.append(1, 1);
                    } else {
                        symbolArea.space();
                    }
                });
            });
            this.shapes = mainArea.toShapes();
        }

        this.size = mainArea.getSize();
    }
}
    }
    


    module wijmo.barcode {
    


export abstract class OneDimensionalBarcode extends BarcodeEncoder {
    public label: string;
    public text: string;
    static DefaultConfig: any = {
        height: 60,
        showLabel: true,
        labelPosition: 'bottom',
    };

    constructor(option) {
        option.merge(OneDimensionalBarcode.DefaultConfig);
        super(option);
        this.label = '';
    }

    adjustDesiredSize() {
        const { width } = this.size;
        let { desiredSize, containerWidth } = this.encodeConfig;

        let unitValue = containerWidth / width;
        if (desiredSize.forceRounding) {
            unitValue = ~~unitValue;
            unitValue = unitValue < 1 ? 1 : unitValue;
        }

        this.applyDesiredSize(unitValue);
    }

    convertToShape(data?, forMeasure?) {
        let { label, encodeConfig: { quietZone, isLabelBottom, height, showLabel, fontSizeInUnit }, style: { textAlign } } = this;

        let labelHeight = 0;
        if (label && showLabel) {
            labelHeight = fontSizeInUnit;
        }
        const symbolWidth = data.length + quietZone.right + quietZone.left;
        const symbolHeight = height + quietZone.top + quietZone.bottom;

        const mainArea = new VerticalLayoutArea();
        const symbolArea = new SymbolArea(symbolWidth, symbolHeight);
        symbolArea.setStyle({
            padding: {
                top: quietZone.top,
                right: quietZone.right,
                bottom: quietZone.bottom,
                left: quietZone.left,
            },
        });
        
        const symbolSize = symbolArea.getSize();
        const labelArea = new LabelArea(symbolSize.width, labelHeight, textAlign);
        if (isLabelBottom) {
            mainArea.append(symbolArea);
            mainArea.append(labelArea);
        } else {
            mainArea.append(labelArea);
            mainArea.append(symbolArea);
        }

        if (!forMeasure) {
            symbolArea.fromPattern(data);
            labelArea.append({ text: label });
            this.shapes = mainArea.toShapes();
        }

        this.size = mainArea.getSize();
    }
}
    }
    


    module wijmo.barcode {
    const FNC1 = '\u00cf';
const FNC2 = '\u00ca';
const FNC3 = '\u00c9';
const DataMatrixFNC1 = '\u2000';
const DataMatrixMacro05 = '\u2004';
const DataMatrixMacro06 = '\u2005';

export const Constants = {
    FNC1, FNC2, FNC3, DataMatrixFNC1, DataMatrixMacro05, DataMatrixMacro06,
};

    }
    


    module wijmo.barcode {
    





export const encoders = {};

export class Barcode {
    static supportType = [];
    static constants = Constants;
    static ErrorCode = ErrorCode;

    private dom: HTMLElement;
    private callback: any;
    private option: Option;
    private render: BarcodeRender;
    static getImageData (option = {}) {
        const instance = new Barcode(option);
        return instance.getImageData();
    }

    static getDataUrl (option = {}) {
        const instance = new Barcode(option);
        return instance.getDataUrl();
    }

    //set default options global
    static setDefaultOptions (option = {}) {
        Option.setCustomDefaultOptions(option);
    }

    //private
    static registerEncoder (name, encoder) {
        encoders[name] = encoder;
        Barcode.supportType.push(name);
    }

    static registerPlugin (name, fn) {
        Utils.registerPlugin(name, fn);
    }

    //3 Overloadeds 
    constructor (...args){
        let dom, option, callback;

        if (args.length >= 3) {
            [dom, option, callback] = args;
        } else if (args.length === 2) {
            if (Utils.isFunction(args[1])) {
                [option, callback] = args;
            } else {
                [dom, option] = args;
            }
        } else if (args.length === 1) {
            [option] = args;
        } else {
            throw new MethodNotImplementException('constructor', 'The arguments is invalid.');
        }

        if (typeof dom === 'string') {
            this.dom = document.querySelector(dom);
        } else {
            this.dom = dom;
        }

        this.callback = callback && callback.bind(this);
        this.setOption(option);
    }

    mergeOption (option) {
        const newOpt = this.option.spawn(option);
        this.update(newOpt);
        return this;
    }

    /**
   * set barcode options
   * @access public
   * @param {object} option
   */
    setOption (option) {
        this.update(new Option(option));
        return this;
    }

    getOption() {
        return this.option.getMergedOption();
    }
  
    private update (option: Option) {
        const type = option.getType();
        const Encoder = encoders[type];
  
        if (!Encoder) {
            throw new InvalidBarcodeTypeException(type);
        }

        const encoder = new Encoder(option);
        this.destroy();
        const render = new BarcodeRender(this.dom, encoder);
        render.render();

        this.render = render;
        this.option = option;

        if (Utils.isFunction(this.callback)) {
            this.callback();
        }
    }

    refresh() {
        this.render.render();
        if (Utils.isFunction(this.callback)) {
            this.callback();
        }
    }

    getImageData () {
        return this.render.getImageData();
    }

    getDataUrl () {
        return this.render.getDataUrl();
    }

    getSize () {
        return this.render.getSize();
    }

    destroy () {
        if (this.render) {
            this.render.destroy();
            this.render = null;
        }
    }
}

    }
    


    module wijmo.barcode {
    

Barcode.registerPlugin('measureText', function (text, style) {
    const spanDom = document.createElement('span');
    spanDom.style.visibility = 'hidden';
    spanDom.style.position = 'absolute';
    spanDom.style.lineHeight = 'normal';
    spanDom.textContent = text;
    Object.keys(style).forEach(item => {
        spanDom.style[item] = style[item];
    });
    document.body.appendChild(spanDom);
    const info = spanDom.getBoundingClientRect();
    document.body.removeChild(spanDom);
    return info.height;
});
    }
    


    module wijmo.barcode {
    

 Barcode.registerPlugin('convertUnit', function (num) {
    const divDom = document.createElement('div');
    divDom.style.visibility = 'hidden';
    divDom.style.position = 'fixed';
    divDom.style.padding = '0';
    divDom.style.border = '0';
    divDom.style.width = num;
    document.body.appendChild(divDom);
    const info = divDom.getBoundingClientRect();
    document.body.removeChild(divDom);
    return info.width;
});
    }
    


    module wijmo.barcode {
    /**
 * Specifies the type of rendering for all type of Barcodes.
 */
export enum RenderType {
    /**
     * Uses <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank">Canvas</a> 
     * to render a barcode.
     */
    Canvas,
    /**
     * Uses <a href="https://developer.mozilla.org/en-US/docs/Web/SVG" target="_blank">SVG</a> 
     * to render a barcode.
     */
    Svg
}

/**
 * Defines the position of the label that displays the Barcode value.
 */
export enum LabelPosition {
    /**
     * Renders the barcode label at the top of the barcode.
     */
    Top,
    /**
     * Renders the barcode label at the bottom of the barcode.
     */
    Bottom
}

/** Defines the ratio between narrow and wide bars. */
export enum NarrowToWideRatio{
    /** The ratio between narrow and wide bars is 1:2 */
    OneToTwo,
    /** The ratio between narrow and wide bars is 1:3 */
    OneToThree
}

    }
    


    module wijmo.barcode {
    


export class _RenderTypeConvertor{
    static stringToEnum(bcVal): number{
        switch (bcVal) {
            case 'canvas':
                return RenderType.Canvas;
            case 'svg':
                return RenderType.Svg;
        }
        throw `Unknown Barcode internal renderType '${bcVal}'`;
    };

    static enumToString(value): string{
        return RenderType[wijmo.asEnum(value, RenderType)].toLowerCase();
    } 
}

export class _LabelPositionConvertor{
    static stringToEnum(value): number{
        switch (value) {
            case 'top':
                return LabelPosition.Top;
            case 'bottom':
                return LabelPosition.Bottom;
        }
        throw `Unknown Barcode internal labelPosition '${value}'`;
    };

    static enumToString(value): string{
        return LabelPosition[wijmo.asEnum(value, LabelPosition)].toLowerCase();
    }
}

export class _NarrowWideRatioConvertor{
    static stringToEnum(value: number): number{
        switch (value.toString()) {
            case '2':
                return NarrowToWideRatio.OneToTwo;
            case '3':
                return NarrowToWideRatio.OneToThree;
        }
        throw `Unknown nwRatio internal value '${value}'`;
    };

    static enumToString(value): string{
        let enumVal = wijmo.asEnum(value, NarrowToWideRatio),
        bcVal: string;
        switch (enumVal) {
            case NarrowToWideRatio.OneToTwo:
                bcVal = '2';
                break;
            case NarrowToWideRatio.OneToThree:
                bcVal = '3';
                break;
        }
        return bcVal;
    }
}

    }
    


    module wijmo.barcode {
    


//import { InvalidTextException } from './shared/exceptions/index';








/**
 * Base (abstract) class for all barcode control classes.
 */
export class BarcodeBase extends wijmo.Control{
    /**
     * Gets or sets the template used to instantiate Barcode controls.
     */
    static controlTemplate = '';
    static readonly type: string;
    private static _defaults: any;

    //private element: HTMLElement;
    //protected option: any;
    // the underlying Barcode instance
    protected _bc: Barcode;
    // wrapper's state in Barcode property/value format
    // TBD: is it possible to retrieve default values for the Barcode class?
    private _state: any = {}
    // previous desiredSize
    private _prevSz: wijmo.Size;
    // previous height
    private _prevH: number;
    private _isUpd = 0;
    private _isValid = true;
    // autoWidth
    private _aw = false;
    // autoWidthZoom
    private _wZoom = 1;
    // Make "this.constructor" expression typed, for the convenient access to the overridden static members
    ['constructor']: typeof BarcodeBase;

    /**
     * Initializes a new instance of the {@link BarcodeBase} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param options The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any){
        super(element, null, true);
        let tpl = this.getTemplate();
        this.applyTemplate('wj-barcode wj-control', tpl, {});
        // When div's display=inline-block, the nested canvas makes its height 5px bigger
        // then the canvas height. This may cause an infinite loop in the size propagation 
        // to the underlying barcode object logic, in case if wijmo.css is not loaded yet
        // at the moment when underlying barcode is already instantiated. 
        // To prevent this 5px height increase, we set css line-height to zero, as suggested
        // in this discussion:
        // https://stackoverflow.com/questions/15807833/div-containing-canvas-have-got-a-strange-bottom-margin-of-5px

        // Fix Bug 445038. In IE 10(didn't check other version), line-height = '0px' will be inherited by text element in svg, then text hight will be 0px and looks disappear.
        // So, only add this setting to non-IE browsers. Ps, infinite loop didn't appear in IE and old Edge, so it's safe to add this condition.
        if(!wijmo.isIE()){
            this.hostElement.style.lineHeight = '0px';
        }
        
        // initialize default options
        //TBD: we need to switch to _getDefaults() after Barcode.encoders become public
        this._state = this._getDefaults();
        
        // Initialization with options goes through property setters, to maintain 
        // property/value mapping between Wijmo wrapper and Barcode. Immediate update
        // of Barcode options is suspended, for the performance sake.
        this._isUpd++;
        this.initialize(options); 
        this._updateSize();
        this._isUpd--;
        // trigger real update of the Barcode options
        this._mergeOptions({});
        // to check/update content size in case if css affecting it is loaded later
        this.invalidate();
    }

    initialize(options: any) {
        this._isUpd++;
        try {
            super.initialize(options); 
        } finally {
            this._isUpd--;
        }
        if (!this._isUpd && options && Object.keys(options).length) {
            this._mergeOptions({});
        }
    }

    // Gets class default options in the Barcode property/value format for the (derived) class 
    // this method is called on.
    // Can be overridden in the derived classes to provide wrapper class specific defaults.
    protected static _getClassDefaults() {
        let type = this.type;
        return _getDefaultConfig(encoders[type], type);
    }

    // Gets control default options specific to the control's class.
    // If necessary, initializes and caches class default options using the 
    // _getClassDefaults() method.
    private _getDefaults() {
        let classRef = this.constructor;
        if (!classRef._defaults) {
            classRef._defaults = classRef._getClassDefaults();
        }
        return Utils.deepMergeAll(classRef._defaults);
    }

    /**
     * Gets or sets the current code value rendered by the control.
     */
    get value(): string | number {
        return this._getProp('text');
    }
    set value(value: string | number) {
        this._setProp('text', value);
    }

    /**
     * Gets or sets the size of quiet zone (the blank margin) around the barcode symbol.
     */
    get quietZone(): IQuietZone {
        return this._getProp('quietZone');
    }
    set quietZone(value: IQuietZone) {
        this._setProp('quietZone', value);
    }

    /**
     * Gets or sets the rendering type of the control.
     * 
     * The default value for this property is {@link RenderType.Canvas}.
     */
    get renderType(): RenderType {
        return _RenderTypeConvertor.stringToEnum(this._getProp('renderType'));
    }
    set renderType(value: RenderType ){
        this._setProp('renderType', _RenderTypeConvertor.enumToString(value));
    }

    /**
     * Gets or sets the forecolor to render the control.
     * 
     * The default value for this property is <b>rgb(0,0,0)</b>.
     */
    get color(): string {
        return this._getProp('color');
    }
    set color(value: string ){
        this._setProp('color', value);
    }

    /**
     * Gets or sets the background color to render the control.
     * 
     * The default value for this property is <b>rgb(255,255,255)</b>.
     */
    get backgroundColor(): string {
        return this._getProp('backgroundColor');
    }
    set backgroundColor(value: string ){
        this._setProp('backgroundColor', value);
    }

    /**
     * Indicates whether to show the check digit in the label text of the control.
     * 
     * The default value for this property is <b>false</b>.
     */
    get hideExtraChecksum(): boolean {
        return this._getProp('hideExtraChecksum');
    }
    set hideExtraChecksum(value: boolean ){
        this._setProp('hideExtraChecksum', value);
    }

    /**
     * Gets or sets font info for the label text of the control.
     */
    get font(): IBarcodeFont {
        return this._getProp('font');
    }
    set font(value: IBarcodeFont ){
        this._setProp('font', value);
    }

    /**
     * Indicates whether the current {@link value} property value is valid.
     * 
     * When this property changes its value, the {@link isValidChanged} event
     * gets triggered.
     */
    get isValid(): boolean {
        return this._isValid;
    }
 
    /**
     * Occurs when the {@link isValid} property value changes.
     */
    readonly isValidChanged = new wijmo.Event<BarcodeBase, wijmo.EventArgs>();
    /**
     * Raises the {@link isValidChanged} event.
     */
    onIsValidChanged(e?: wijmo.EventArgs) {
        this.isValidChanged.raise(this, e);
    }

    /**
     * Refreshes the barcode image.
     *
     * @param fullUpdate Specifies whether to recalculate the barcode size.
     */
    refresh(fullUpdate = true) {
        super.refresh(fullUpdate);
        if (fullUpdate) {
            // update _bc's desiredSize
            this._updateSize();
        } else {
            // re-renders barcode
            // barcode team made update() to private method, then we asked for a public refresh() to re-render.
            this._bc.refresh();
        }
    }

    /**
     * Gets the barcode image data info; only supported for canvas rendering.
     */
    getImageData(): ImageData {
        return this._bc.getImageData();
    }

    /**
     * Gets base64 string of the barcode.
     */
    getDataUrl(): string {
        return this._bc.getDataUrl();
    }

    /**
     * Gets the size of barcode symbol.
     */
    getSize (): wijmo.Size {
        var sz = new wijmo.Size();
        var renderSize = this._bc.getSize();
        if(renderSize){
            sz.width = renderSize.width; 
            sz.height = renderSize.height; 
        }
        return sz;
    }

    // Updates internal and Barcode's state, maintains Barcode lifecycle.
    // 'options' are in the Barcode format
    protected _mergeOptions (options) {
        let bc = this._bc,
            newState = _copyObj(this._state, options),
            ex: any;
        if (!this._isUpd) {
            // check text
            let text = newState.text;
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
                    } else {
                        this._bc = bc = new Barcode(this.hostElement, newState);
                    }
                }
                catch (e) {
                    ex = e;
                }
            }
        }
        let isValid = true;
        if (ex) {
            if (bc) {
                bc.destroy();
                this._bc = bc = null;
            }
            // instanceof doesn't work here, because all barcode exception classes
            // are inherited from native Error. See for the details:
            // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
            //if (ex instanceof InvalidTextException) {
            if ((<BaseException>ex).code === _errorCode.InvalidText) {
                // we'll not throw here, so we'll update state with invalid values
                isValid = false;
            } else {
                // throw and don't update state
                throw ex;
            }
        }
        // if everything went well (without exceptions), update the state
        this._state = newState;
        this._setValid(isValid);
    }

    private _setValid(isValid: boolean) {
        if (this._isValid !== isValid) {
            this._isValid = isValid;
            wijmo.toggleClass(this.hostElement, 'wj-state-invalid', !isValid);
            this.onIsValidChanged();
        }
    }

    // prop/value are in Barcode format
    protected _setProp(prop: string, value: any) {
        this._mergeOptions({[prop]: value});
        // try{
        //     this._mergeOptions({[prop]: value});
        // }
        // catch(err){
        //     BarcodeBase.onErrorResolve(new ErrorResolveEventArgs(this, err.message));
        // }
    }

    // prop/return value are in Barcode format
    protected _getProp(prop: string): any {
        let bc = this._bc;
        // TBD: bad, need a single source of truth, how to get default values to _state? 
        return this._state[prop] || bc && bc.getOption()[prop];
    }

    // setOption (option) {
    //     this._bc.setOption(option);
    // }

    // Updates _bc.desiredSize with the size of the host element content.

    //Do we have to initialize a desiredSize at the beginning? If host element has width/height, this is reasonable, what if there's no settings for width/height?
    //I think use defaultConfig is the best choice to avoid given a specific width/height in css file.
    //If there's no default width/height in css file and no desireSize in following code, then we'll got a reasonable size of current barcode, the render size 
    //will only related to unitSize = 1 in defaultConfig. 
    private _updateSize() {
        if (!this.hostElement) return;
        let sz = BarcodeBase._getContentSize(this.hostElement),
            prevSz = this._prevSz,
            desiredSize = null,
            height: number = null,
            unitSize = 1,
            ignore = true;
        if (this._getAw()) {
            unitSize = this._getWzoom();
            height = sz.height / unitSize;
            ignore = height === this._prevH;
            this._prevH = height;
            prevSz = this._prevSz = null;
        } else if (!(prevSz && sz.equals(prevSz))) {
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
            this._mergeOptions({ desiredSize, height, unitSize });
        }
        
        // if (!(prevSz && sz.equals(prevSz))) {
        //     this._prevSz = sz;
        //     this._mergeOptions({desiredSize: {
        //         width: sz.width + 'px',
        //         height: sz.height + 'px',
        //         forceRounding: false
        //     }});
        // }
    }

    // Returns a content size of the element (excludes border and padding)
    private static _getContentSize(el: HTMLElement): wijmo.Size {
        let cs = getComputedStyle(el);
        return new wijmo.Size(
            el.offsetWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 
                parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth),
            el.offsetHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 
                parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth)
        );
    }

    protected _getAw(): boolean {
        return this._aw;
    }
    protected _setAw(value: boolean) {
        if (this._aw !== value) {
            this._aw = value;
            this._updateSize();
        }
    }

    protected _getWzoom(): number {
        return this._wZoom;
    }
    protected _setWzoom(value: number) {
        wijmo.asNumber(value);
        wijmo.assert(value >= 1, 'autoWidthZoom value should be equal or greater than 1');
        if (this._wZoom !== value) {
            this._wZoom = value;
            if (this._getAw()) {
                this._updateSize();
            }
        }
    }

}

const _copyObj = typeof Object.assign === 'function' ? Object.assign :
    function (target: any, ...src: any[]): any {
        for (let curSrc of src) {
            if (curSrc != null) {
                for (let prop in curSrc) {
                    target[prop] = curSrc[prop];
                }
            }
        }
        return target;
    }


    }
    


    module wijmo.barcode {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.barcode', wijmo.barcode);

















    }
    