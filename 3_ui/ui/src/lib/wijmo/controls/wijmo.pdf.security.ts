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


    module wijmo.pdf.security {
    declare var Symbol;
declare var SharedArrayBuffer;

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict';

var K_MAX_LENGTH = 0x7fffffff;

function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    // Return an augmented `Uint8Array` instance
    var buf = new Uint8Array(length);
    (<any>Object).setPrototypeOf(buf, Buffer.prototype);
    return <any>buf;
}

/*
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

export function Buffer(arg, encodingOrOffset?, length?): void {
    // Common case.
    if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
            throw new TypeError(
                'The "string" argument must be of type string. Received type number'
            );
        }
        return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
}

function from(value, encodingOrOffset, length) {
    if (ArrayBuffer.isView(value)) {
        return fromArrayLike(value);
    }

    if (value == null) {
        throw new TypeError(
            'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
            'or Array-like Object. Received type ' + (typeof value)
        );
    }

    if (isInstance(value, ArrayBuffer) ||
        (value && isInstance(value.buffer, ArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
    }

    if (typeof SharedArrayBuffer !== 'undefined' &&
        (isInstance(value, SharedArrayBuffer) ||
            (value && isInstance(value.buffer, SharedArrayBuffer)))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
    }

    if (typeof value === 'number') {
        throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
        );
    }

    var valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) {
        return (<any>Buffer).from(valueOf, encodingOrOffset, length)
    };

    var b = fromObject(value);
    if (b) return b;

    if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
        typeof value[Symbol.toPrimitive] === 'function') {
        return (<any>Buffer).from(
            value[Symbol.toPrimitive]('string'), encodingOrOffset, length
        );
    }

    throw new TypeError(
        'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
        'or Array-like Object. Received type ' + (typeof value)
    );
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
(<any>Buffer).from = function (value, encodingOrOffset?, length?) {
    return from(value, encodingOrOffset, length);
};

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
(<any>Object).setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
(<any>Object).setPrototypeOf(Buffer, Uint8Array);

function assertSize(size) {
    if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be of type number');
    } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
}

function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

function fromArrayLike(array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0
    var buf = createBuffer(length)
    for (var i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255
    }
    return buf
}

function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds')
    }

    if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds')
    }

    var buf
    if (byteOffset === undefined && length === undefined) {
        buf = new Uint8Array(array)
    } else if (length === undefined) {
        buf = new Uint8Array(array, byteOffset)
    } else {
        buf = new Uint8Array(array, byteOffset, length)
    }

    // Return an augmented `Uint8Array` instance
    (<any>Object).setPrototypeOf(buf, Buffer.prototype);

    return buf
}

function fromObject(obj) {
    if ((<any>Buffer).isBuffer(obj)) {
        var len = checked(obj.length) | 0
        var buf = createBuffer(len)

        if (buf.length === 0) {
            return buf
        }

        obj.copy(buf, 0, 0, len)
        return buf
    }

    if (obj.length !== undefined) {
        if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
            return createBuffer(0)
        }
        return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data)
    }
}

function checked(length) {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
            'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
    }
    return length | 0
}

(<any>Buffer).isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true &&
        b !== Buffer.prototype; // so Buffer.isBuffer(Buffer.prototype) will be false
};

function slowToString(encoding, start, end) {
    var loweredCase = false

    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.

    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    if (start === undefined || start < 0) {
        start = 0
    }
    // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.
    if (start > this.length) {
        return ''
    }

    if (end === undefined || end > this.length) {
        end = this.length
    }

    if (end <= 0) {
        return ''
    }

    // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
    end >>>= 0
    start >>>= 0

    if (end <= start) {
        return ''
    }

    if (!encoding) encoding = 'utf8'

    while (true) {
        switch (encoding) {
            case 'hex':
                return hexSlice(this, start, end)

            case 'utf8':
            case 'utf-8':
                return utf8Slice(this, start, end)

            case 'ascii':
                return asciiSlice(this, start, end)

            case 'latin1':
            case 'binary':
                return latin1Slice(this, start, end)

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return utf16leSlice(this, start, end)

            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                encoding = (encoding + '').toLowerCase()
                loweredCase = true
        }
    }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;

Buffer.prototype.toString = function toString() {
    var length = this.length
    if (length === 0) return ''
    if (arguments.length === 0) return utf8Slice(this, 0, length)
    return slowToString.apply(this, arguments)
};

function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end)
    var res = []

    var i = start
    while (i < end) {
        var firstByte = buf[i]
        var codePoint = null
        var bytesPerSequence = (firstByte > 0xEF) ? 4
            : (firstByte > 0xDF) ? 3
                : (firstByte > 0xBF) ? 2
                    : 1

        if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint

            switch (bytesPerSequence) {
                case 1:
                    if (firstByte < 0x80) {
                        codePoint = firstByte
                    }
                    break
                case 2:
                    secondByte = buf[i + 1]
                    if ((secondByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                        if (tempCodePoint > 0x7F) {
                            codePoint = tempCodePoint
                        }
                    }
                    break
                case 3:
                    secondByte = buf[i + 1]
                    thirdByte = buf[i + 2]
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                            codePoint = tempCodePoint
                        }
                    }
                    break
                case 4:
                    secondByte = buf[i + 1]
                    thirdByte = buf[i + 2]
                    fourthByte = buf[i + 3]
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                            codePoint = tempCodePoint
                        }
                    }
            }
        }

        if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD
            bytesPerSequence = 1
        } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000
            res.push(codePoint >>> 10 & 0x3FF | 0xD800)
            codePoint = 0xDC00 | codePoint & 0x3FF
        }

        res.push(codePoint)
        i += bytesPerSequence
    }

    return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray(codePoints) {
    var len = codePoints.length
    if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
    }

    // Decode in chunks to avoid "call stack size exceeded".
    var res = ''
    var i = 0
    while (i < len) {
        res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        )
    }
    return res
}

function asciiSlice(buf, start, end) {
    var ret = ''
    end = Math.min(buf.length, end)

    for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 0x7F)
    }
    return ret
}

function latin1Slice(buf, start, end) {
    var ret = ''
    end = Math.min(buf.length, end)

    for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i])
    }
    return ret
}

function hexSlice(buf, start, end) {
    var len = buf.length

    if (!start || start < 0) start = 0
    if (!end || end < 0 || end > len) end = len

    var out = ''
    for (var i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]]
    }
    return out
}

function utf16leSlice(buf, start, end) {
    var bytes = buf.slice(start, end)
    var res = ''
    for (var i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
    }
    return res
}

Buffer.prototype.slice = function slice(start, end) {
    var len = this.length
    start = ~~start
    end = end === undefined ? len : ~~end

    if (start < 0) {
        start += len
        if (start < 0) start = 0
    } else if (start > len) {
        start = len
    }

    if (end < 0) {
        end += len
        if (end < 0) end = 0
    } else if (end > len) {
        end = len
    }

    if (end < start) end = start

    var newBuf = this.subarray(start, end)
        // Return an augmented `Uint8Array` instance
        (<any>Object).setPrototypeOf(newBuf, Buffer.prototype);

    return newBuf
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!(<any>Buffer).isBuffer(target)) throw new TypeError('argument should be a Buffer')
    if (!start) start = 0
    if (!end && end !== 0) end = this.length
    if (targetStart >= target.length) targetStart = target.length
    if (!targetStart) targetStart = 0
    if (end > 0 && end < start) end = start

    // Copy 0 bytes; we're done
    if (end === start) return 0
    if (target.length === 0 || this.length === 0) return 0

    // Fatal error conditions
    if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds')
    }
    if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
    if (end < 0) throw new RangeError('sourceEnd out of bounds')

    // Are we oob?
    if (end > this.length) end = this.length
    if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start
    }

    var len = end - start

    if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
        // Use built-in when available, missing from IE11
        this.copyWithin(targetStart, start, end)
    } else if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (var i = len - 1; i >= 0; --i) {
            target[i + targetStart] = this[i + start]
        }
    } else {
        Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
        )
    }

    return len
}

// HELPER FUNCTIONS
// ================

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance(obj, type) {
    return obj instanceof type ||
        (obj != null && obj.constructor != null && obj.constructor.name != null &&
            obj.constructor.name === type.name)
}
function numberIsNaN(obj) {
    // For IE11 support
    return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = (function () {
    var alphabet = '0123456789abcdef'
    var table = new Array(256)
    for (var i = 0; i < 16; ++i) {
        var i16 = i * 16
        for (var j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j]
        }
    }
    return table
})();
    }
    


    module wijmo.pdf.security {
    /*
 * Check if value is in a range group.
 * @param {number} value
 * @param {number[]} rangeGroup
 * @returns {boolean}
 */
export function inRange(value, rangeGroup) {
  if (value < rangeGroup[0]) return false;
  let startRange = 0;
  let endRange = rangeGroup.length / 2;
  while (startRange <= endRange) {
    const middleRange = Math.floor((startRange + endRange) / 2);

    // actual array index
    const arrayIndex = middleRange * 2;

    // Check if value is in range pointed by actual index
    if (
      value >= rangeGroup[arrayIndex] &&
      value <= rangeGroup[arrayIndex + 1]
    ) {
      return true;
    }

    if (value > rangeGroup[arrayIndex + 1]) {
      // Search Right Side Of Array
      startRange = middleRange + 1;
    } else {
      // Search Left Side Of Array
      endRange = middleRange - 1;
    }
  }
  return false;
}
    }
    


    module wijmo.pdf.security {
    

/* eslint-disable prettier/prettier */
/**
 * A.1 Unassigned code points in Unicode 3.2
 * @link https://tools.ietf.org/html/rfc3454#appendix-A.1
 */
const unassigned_code_points = [
  0x0221,
  0x0221,
  0x0234,
  0x024f,
  0x02ae,
  0x02af,
  0x02ef,
  0x02ff,
  0x0350,
  0x035f,
  0x0370,
  0x0373,
  0x0376,
  0x0379,
  0x037b,
  0x037d,
  0x037f,
  0x0383,
  0x038b,
  0x038b,
  0x038d,
  0x038d,
  0x03a2,
  0x03a2,
  0x03cf,
  0x03cf,
  0x03f7,
  0x03ff,
  0x0487,
  0x0487,
  0x04cf,
  0x04cf,
  0x04f6,
  0x04f7,
  0x04fa,
  0x04ff,
  0x0510,
  0x0530,
  0x0557,
  0x0558,
  0x0560,
  0x0560,
  0x0588,
  0x0588,
  0x058b,
  0x0590,
  0x05a2,
  0x05a2,
  0x05ba,
  0x05ba,
  0x05c5,
  0x05cf,
  0x05eb,
  0x05ef,
  0x05f5,
  0x060b,
  0x060d,
  0x061a,
  0x061c,
  0x061e,
  0x0620,
  0x0620,
  0x063b,
  0x063f,
  0x0656,
  0x065f,
  0x06ee,
  0x06ef,
  0x06ff,
  0x06ff,
  0x070e,
  0x070e,
  0x072d,
  0x072f,
  0x074b,
  0x077f,
  0x07b2,
  0x0900,
  0x0904,
  0x0904,
  0x093a,
  0x093b,
  0x094e,
  0x094f,
  0x0955,
  0x0957,
  0x0971,
  0x0980,
  0x0984,
  0x0984,
  0x098d,
  0x098e,
  0x0991,
  0x0992,
  0x09a9,
  0x09a9,
  0x09b1,
  0x09b1,
  0x09b3,
  0x09b5,
  0x09ba,
  0x09bb,
  0x09bd,
  0x09bd,
  0x09c5,
  0x09c6,
  0x09c9,
  0x09ca,
  0x09ce,
  0x09d6,
  0x09d8,
  0x09db,
  0x09de,
  0x09de,
  0x09e4,
  0x09e5,
  0x09fb,
  0x0a01,
  0x0a03,
  0x0a04,
  0x0a0b,
  0x0a0e,
  0x0a11,
  0x0a12,
  0x0a29,
  0x0a29,
  0x0a31,
  0x0a31,
  0x0a34,
  0x0a34,
  0x0a37,
  0x0a37,
  0x0a3a,
  0x0a3b,
  0x0a3d,
  0x0a3d,
  0x0a43,
  0x0a46,
  0x0a49,
  0x0a4a,
  0x0a4e,
  0x0a58,
  0x0a5d,
  0x0a5d,
  0x0a5f,
  0x0a65,
  0x0a75,
  0x0a80,
  0x0a84,
  0x0a84,
  0x0a8c,
  0x0a8c,
  0x0a8e,
  0x0a8e,
  0x0a92,
  0x0a92,
  0x0aa9,
  0x0aa9,
  0x0ab1,
  0x0ab1,
  0x0ab4,
  0x0ab4,
  0x0aba,
  0x0abb,
  0x0ac6,
  0x0ac6,
  0x0aca,
  0x0aca,
  0x0ace,
  0x0acf,
  0x0ad1,
  0x0adf,
  0x0ae1,
  0x0ae5,
  0x0af0,
  0x0b00,
  0x0b04,
  0x0b04,
  0x0b0d,
  0x0b0e,
  0x0b11,
  0x0b12,
  0x0b29,
  0x0b29,
  0x0b31,
  0x0b31,
  0x0b34,
  0x0b35,
  0x0b3a,
  0x0b3b,
  0x0b44,
  0x0b46,
  0x0b49,
  0x0b4a,
  0x0b4e,
  0x0b55,
  0x0b58,
  0x0b5b,
  0x0b5e,
  0x0b5e,
  0x0b62,
  0x0b65,
  0x0b71,
  0x0b81,
  0x0b84,
  0x0b84,
  0x0b8b,
  0x0b8d,
  0x0b91,
  0x0b91,
  0x0b96,
  0x0b98,
  0x0b9b,
  0x0b9b,
  0x0b9d,
  0x0b9d,
  0x0ba0,
  0x0ba2,
  0x0ba5,
  0x0ba7,
  0x0bab,
  0x0bad,
  0x0bb6,
  0x0bb6,
  0x0bba,
  0x0bbd,
  0x0bc3,
  0x0bc5,
  0x0bc9,
  0x0bc9,
  0x0bce,
  0x0bd6,
  0x0bd8,
  0x0be6,
  0x0bf3,
  0x0c00,
  0x0c04,
  0x0c04,
  0x0c0d,
  0x0c0d,
  0x0c11,
  0x0c11,
  0x0c29,
  0x0c29,
  0x0c34,
  0x0c34,
  0x0c3a,
  0x0c3d,
  0x0c45,
  0x0c45,
  0x0c49,
  0x0c49,
  0x0c4e,
  0x0c54,
  0x0c57,
  0x0c5f,
  0x0c62,
  0x0c65,
  0x0c70,
  0x0c81,
  0x0c84,
  0x0c84,
  0x0c8d,
  0x0c8d,
  0x0c91,
  0x0c91,
  0x0ca9,
  0x0ca9,
  0x0cb4,
  0x0cb4,
  0x0cba,
  0x0cbd,
  0x0cc5,
  0x0cc5,
  0x0cc9,
  0x0cc9,
  0x0cce,
  0x0cd4,
  0x0cd7,
  0x0cdd,
  0x0cdf,
  0x0cdf,
  0x0ce2,
  0x0ce5,
  0x0cf0,
  0x0d01,
  0x0d04,
  0x0d04,
  0x0d0d,
  0x0d0d,
  0x0d11,
  0x0d11,
  0x0d29,
  0x0d29,
  0x0d3a,
  0x0d3d,
  0x0d44,
  0x0d45,
  0x0d49,
  0x0d49,
  0x0d4e,
  0x0d56,
  0x0d58,
  0x0d5f,
  0x0d62,
  0x0d65,
  0x0d70,
  0x0d81,
  0x0d84,
  0x0d84,
  0x0d97,
  0x0d99,
  0x0db2,
  0x0db2,
  0x0dbc,
  0x0dbc,
  0x0dbe,
  0x0dbf,
  0x0dc7,
  0x0dc9,
  0x0dcb,
  0x0dce,
  0x0dd5,
  0x0dd5,
  0x0dd7,
  0x0dd7,
  0x0de0,
  0x0df1,
  0x0df5,
  0x0e00,
  0x0e3b,
  0x0e3e,
  0x0e5c,
  0x0e80,
  0x0e83,
  0x0e83,
  0x0e85,
  0x0e86,
  0x0e89,
  0x0e89,
  0x0e8b,
  0x0e8c,
  0x0e8e,
  0x0e93,
  0x0e98,
  0x0e98,
  0x0ea0,
  0x0ea0,
  0x0ea4,
  0x0ea4,
  0x0ea6,
  0x0ea6,
  0x0ea8,
  0x0ea9,
  0x0eac,
  0x0eac,
  0x0eba,
  0x0eba,
  0x0ebe,
  0x0ebf,
  0x0ec5,
  0x0ec5,
  0x0ec7,
  0x0ec7,
  0x0ece,
  0x0ecf,
  0x0eda,
  0x0edb,
  0x0ede,
  0x0eff,
  0x0f48,
  0x0f48,
  0x0f6b,
  0x0f70,
  0x0f8c,
  0x0f8f,
  0x0f98,
  0x0f98,
  0x0fbd,
  0x0fbd,
  0x0fcd,
  0x0fce,
  0x0fd0,
  0x0fff,
  0x1022,
  0x1022,
  0x1028,
  0x1028,
  0x102b,
  0x102b,
  0x1033,
  0x1035,
  0x103a,
  0x103f,
  0x105a,
  0x109f,
  0x10c6,
  0x10cf,
  0x10f9,
  0x10fa,
  0x10fc,
  0x10ff,
  0x115a,
  0x115e,
  0x11a3,
  0x11a7,
  0x11fa,
  0x11ff,
  0x1207,
  0x1207,
  0x1247,
  0x1247,
  0x1249,
  0x1249,
  0x124e,
  0x124f,
  0x1257,
  0x1257,
  0x1259,
  0x1259,
  0x125e,
  0x125f,
  0x1287,
  0x1287,
  0x1289,
  0x1289,
  0x128e,
  0x128f,
  0x12af,
  0x12af,
  0x12b1,
  0x12b1,
  0x12b6,
  0x12b7,
  0x12bf,
  0x12bf,
  0x12c1,
  0x12c1,
  0x12c6,
  0x12c7,
  0x12cf,
  0x12cf,
  0x12d7,
  0x12d7,
  0x12ef,
  0x12ef,
  0x130f,
  0x130f,
  0x1311,
  0x1311,
  0x1316,
  0x1317,
  0x131f,
  0x131f,
  0x1347,
  0x1347,
  0x135b,
  0x1360,
  0x137d,
  0x139f,
  0x13f5,
  0x1400,
  0x1677,
  0x167f,
  0x169d,
  0x169f,
  0x16f1,
  0x16ff,
  0x170d,
  0x170d,
  0x1715,
  0x171f,
  0x1737,
  0x173f,
  0x1754,
  0x175f,
  0x176d,
  0x176d,
  0x1771,
  0x1771,
  0x1774,
  0x177f,
  0x17dd,
  0x17df,
  0x17ea,
  0x17ff,
  0x180f,
  0x180f,
  0x181a,
  0x181f,
  0x1878,
  0x187f,
  0x18aa,
  0x1dff,
  0x1e9c,
  0x1e9f,
  0x1efa,
  0x1eff,
  0x1f16,
  0x1f17,
  0x1f1e,
  0x1f1f,
  0x1f46,
  0x1f47,
  0x1f4e,
  0x1f4f,
  0x1f58,
  0x1f58,
  0x1f5a,
  0x1f5a,
  0x1f5c,
  0x1f5c,
  0x1f5e,
  0x1f5e,
  0x1f7e,
  0x1f7f,
  0x1fb5,
  0x1fb5,
  0x1fc5,
  0x1fc5,
  0x1fd4,
  0x1fd5,
  0x1fdc,
  0x1fdc,
  0x1ff0,
  0x1ff1,
  0x1ff5,
  0x1ff5,
  0x1fff,
  0x1fff,
  0x2053,
  0x2056,
  0x2058,
  0x205e,
  0x2064,
  0x2069,
  0x2072,
  0x2073,
  0x208f,
  0x209f,
  0x20b2,
  0x20cf,
  0x20eb,
  0x20ff,
  0x213b,
  0x213c,
  0x214c,
  0x2152,
  0x2184,
  0x218f,
  0x23cf,
  0x23ff,
  0x2427,
  0x243f,
  0x244b,
  0x245f,
  0x24ff,
  0x24ff,
  0x2614,
  0x2615,
  0x2618,
  0x2618,
  0x267e,
  0x267f,
  0x268a,
  0x2700,
  0x2705,
  0x2705,
  0x270a,
  0x270b,
  0x2728,
  0x2728,
  0x274c,
  0x274c,
  0x274e,
  0x274e,
  0x2753,
  0x2755,
  0x2757,
  0x2757,
  0x275f,
  0x2760,
  0x2795,
  0x2797,
  0x27b0,
  0x27b0,
  0x27bf,
  0x27cf,
  0x27ec,
  0x27ef,
  0x2b00,
  0x2e7f,
  0x2e9a,
  0x2e9a,
  0x2ef4,
  0x2eff,
  0x2fd6,
  0x2fef,
  0x2ffc,
  0x2fff,
  0x3040,
  0x3040,
  0x3097,
  0x3098,
  0x3100,
  0x3104,
  0x312d,
  0x3130,
  0x318f,
  0x318f,
  0x31b8,
  0x31ef,
  0x321d,
  0x321f,
  0x3244,
  0x3250,
  0x327c,
  0x327e,
  0x32cc,
  0x32cf,
  0x32ff,
  0x32ff,
  0x3377,
  0x337a,
  0x33de,
  0x33df,
  0x33ff,
  0x33ff,
  0x4db6,
  0x4dff,
  0x9fa6,
  0x9fff,
  0xa48d,
  0xa48f,
  0xa4c7,
  0xabff,
  0xd7a4,
  0xd7ff,
  0xfa2e,
  0xfa2f,
  0xfa6b,
  0xfaff,
  0xfb07,
  0xfb12,
  0xfb18,
  0xfb1c,
  0xfb37,
  0xfb37,
  0xfb3d,
  0xfb3d,
  0xfb3f,
  0xfb3f,
  0xfb42,
  0xfb42,
  0xfb45,
  0xfb45,
  0xfbb2,
  0xfbd2,
  0xfd40,
  0xfd4f,
  0xfd90,
  0xfd91,
  0xfdc8,
  0xfdcf,
  0xfdfd,
  0xfdff,
  0xfe10,
  0xfe1f,
  0xfe24,
  0xfe2f,
  0xfe47,
  0xfe48,
  0xfe53,
  0xfe53,
  0xfe67,
  0xfe67,
  0xfe6c,
  0xfe6f,
  0xfe75,
  0xfe75,
  0xfefd,
  0xfefe,
  0xff00,
  0xff00,
  0xffbf,
  0xffc1,
  0xffc8,
  0xffc9,
  0xffd0,
  0xffd1,
  0xffd8,
  0xffd9,
  0xffdd,
  0xffdf,
  0xffe7,
  0xffe7,
  0xffef,
  0xfff8,
  0x10000,
  0x102ff,
  0x1031f,
  0x1031f,
  0x10324,
  0x1032f,
  0x1034b,
  0x103ff,
  0x10426,
  0x10427,
  0x1044e,
  0x1cfff,
  0x1d0f6,
  0x1d0ff,
  0x1d127,
  0x1d129,
  0x1d1de,
  0x1d3ff,
  0x1d455,
  0x1d455,
  0x1d49d,
  0x1d49d,
  0x1d4a0,
  0x1d4a1,
  0x1d4a3,
  0x1d4a4,
  0x1d4a7,
  0x1d4a8,
  0x1d4ad,
  0x1d4ad,
  0x1d4ba,
  0x1d4ba,
  0x1d4bc,
  0x1d4bc,
  0x1d4c1,
  0x1d4c1,
  0x1d4c4,
  0x1d4c4,
  0x1d506,
  0x1d506,
  0x1d50b,
  0x1d50c,
  0x1d515,
  0x1d515,
  0x1d51d,
  0x1d51d,
  0x1d53a,
  0x1d53a,
  0x1d53f,
  0x1d53f,
  0x1d545,
  0x1d545,
  0x1d547,
  0x1d549,
  0x1d551,
  0x1d551,
  0x1d6a4,
  0x1d6a7,
  0x1d7ca,
  0x1d7cd,
  0x1d800,
  0x1fffd,
  0x2a6d7,
  0x2f7ff,
  0x2fa1e,
  0x2fffd,
  0x30000,
  0x3fffd,
  0x40000,
  0x4fffd,
  0x50000,
  0x5fffd,
  0x60000,
  0x6fffd,
  0x70000,
  0x7fffd,
  0x80000,
  0x8fffd,
  0x90000,
  0x9fffd,
  0xa0000,
  0xafffd,
  0xb0000,
  0xbfffd,
  0xc0000,
  0xcfffd,
  0xd0000,
  0xdfffd,
  0xe0000,
  0xe0000,
  0xe0002,
  0xe001f,
  0xe0080,
  0xefffd
];
/* eslint-enable */

export const isUnassignedCodePoint = character =>
  inRange(character, unassigned_code_points);

/* eslint-disable prettier/prettier */
/**
 * B.1 Commonly mapped to nothing
 * @link https://tools.ietf.org/html/rfc3454#appendix-B.1
 */
const commonly_mapped_to_nothing = [
  0x00ad,
  0x00ad,
  0x034f,
  0x034f,
  0x1806,
  0x1806,
  0x180b,
  0x180b,
  0x180c,
  0x180c,
  0x180d,
  0x180d,
  0x200b,
  0x200b,
  0x200c,
  0x200c,
  0x200d,
  0x200d,
  0x2060,
  0x2060,
  0xfe00,
  0xfe00,
  0xfe01,
  0xfe01,
  0xfe02,
  0xfe02,
  0xfe03,
  0xfe03,
  0xfe04,
  0xfe04,
  0xfe05,
  0xfe05,
  0xfe06,
  0xfe06,
  0xfe07,
  0xfe07,
  0xfe08,
  0xfe08,
  0xfe09,
  0xfe09,
  0xfe0a,
  0xfe0a,
  0xfe0b,
  0xfe0b,
  0xfe0c,
  0xfe0c,
  0xfe0d,
  0xfe0d,
  0xfe0e,
  0xfe0e,
  0xfe0f,
  0xfe0f,
  0xfeff,
  0xfeff
];
/* eslint-enable */

export const isCommonlyMappedToNothing = character =>
  inRange(character, commonly_mapped_to_nothing);

/* eslint-disable prettier/prettier */
/**
 * C.1.2 Non-ASCII space characters
 * @link https://tools.ietf.org/html/rfc3454#appendix-C.1.2
 */
const non_ASCII_space_characters = [
  0x00a0,
  0x00a0 /* NO-BREAK SPACE */,
  0x1680,
  0x1680 /* OGHAM SPACE MARK */,
  0x2000,
  0x2000 /* EN QUAD */,
  0x2001,
  0x2001 /* EM QUAD */,
  0x2002,
  0x2002 /* EN SPACE */,
  0x2003,
  0x2003 /* EM SPACE */,
  0x2004,
  0x2004 /* THREE-PER-EM SPACE */,
  0x2005,
  0x2005 /* FOUR-PER-EM SPACE */,
  0x2006,
  0x2006 /* SIX-PER-EM SPACE */,
  0x2007,
  0x2007 /* FIGURE SPACE */,
  0x2008,
  0x2008 /* PUNCTUATION SPACE */,
  0x2009,
  0x2009 /* THIN SPACE */,
  0x200a,
  0x200a /* HAIR SPACE */,
  0x200b,
  0x200b /* ZERO WIDTH SPACE */,
  0x202f,
  0x202f /* NARROW NO-BREAK SPACE */,
  0x205f,
  0x205f /* MEDIUM MATHEMATICAL SPACE */,
  0x3000,
  0x3000 /* IDEOGRAPHIC SPACE */
];
/* eslint-enable */

export const isNonASCIISpaceCharacter = character =>
  inRange(character, non_ASCII_space_characters);

/* eslint-disable prettier/prettier */
const non_ASCII_controls_characters = [
  /**
   * C.2.2 Non-ASCII control characters
   * @link https://tools.ietf.org/html/rfc3454#appendix-C.2.2
   */
  0x0080,
  0x009f /* [CONTROL CHARACTERS] */,
  0x06dd,
  0x06dd /* ARABIC END OF AYAH */,
  0x070f,
  0x070f /* SYRIAC ABBREVIATION MARK */,
  0x180e,
  0x180e /* MONGOLIAN VOWEL SEPARATOR */,
  0x200c,
  0x200c /* ZERO WIDTH NON-JOINER */,
  0x200d,
  0x200d /* ZERO WIDTH JOINER */,
  0x2028,
  0x2028 /* LINE SEPARATOR */,
  0x2029,
  0x2029 /* PARAGRAPH SEPARATOR */,
  0x2060,
  0x2060 /* WORD JOINER */,
  0x2061,
  0x2061 /* FUNCTION APPLICATION */,
  0x2062,
  0x2062 /* INVISIBLE TIMES */,
  0x2063,
  0x2063 /* INVISIBLE SEPARATOR */,
  0x206a,
  0x206f /* [CONTROL CHARACTERS] */,
  0xfeff,
  0xfeff /* ZERO WIDTH NO-BREAK SPACE */,
  0xfff9,
  0xfffc /* [CONTROL CHARACTERS] */,
  0x1d173,
  0x1d17a /* [MUSICAL CONTROL CHARACTERS] */
];

const non_character_codepoints = [
  /**
   * C.4 Non-character code points
   * @link https://tools.ietf.org/html/rfc3454#appendix-C.4
   */
  0xfdd0,
  0xfdef /* [NONCHARACTER CODE POINTS] */,
  0xfffe,
  0xffff /* [NONCHARACTER CODE POINTS] */,
  0x1fffe,
  0x1ffff /* [NONCHARACTER CODE POINTS] */,
  0x2fffe,
  0x2ffff /* [NONCHARACTER CODE POINTS] */,
  0x3fffe,
  0x3ffff /* [NONCHARACTER CODE POINTS] */,
  0x4fffe,
  0x4ffff /* [NONCHARACTER CODE POINTS] */,
  0x5fffe,
  0x5ffff /* [NONCHARACTER CODE POINTS] */,
  0x6fffe,
  0x6ffff /* [NONCHARACTER CODE POINTS] */,
  0x7fffe,
  0x7ffff /* [NONCHARACTER CODE POINTS] */,
  0x8fffe,
  0x8ffff /* [NONCHARACTER CODE POINTS] */,
  0x9fffe,
  0x9ffff /* [NONCHARACTER CODE POINTS] */,
  0xafffe,
  0xaffff /* [NONCHARACTER CODE POINTS] */,
  0xbfffe,
  0xbffff /* [NONCHARACTER CODE POINTS] */,
  0xcfffe,
  0xcffff /* [NONCHARACTER CODE POINTS] */,
  0xdfffe,
  0xdffff /* [NONCHARACTER CODE POINTS] */,
  0xefffe,
  0xeffff /* [NONCHARACTER CODE POINTS] */,
  0x10fffe,
  0x10ffff /* [NONCHARACTER CODE POINTS] */
];

/**
 * 2.3.  Prohibited Output
 */
const prohibited_characters = [
  /**
   * C.2.1 ASCII control characters
   * @link https://tools.ietf.org/html/rfc3454#appendix-C.2.1
   */
  0,
  0x001f /* [CONTROL CHARACTERS] */,
  0x007f,
  0x007f /* DELETE */,

  /**
   * C.8 Change display properties or are deprecated
   * @link https://tools.ietf.org/html/rfc3454#appendix-C.8
   */
  0x0340,
  0x0340 /* COMBINING GRAVE TONE MARK */,
  0x0341,
  0x0341 /* COMBINING ACUTE TONE MARK */,
  0x200e,
  0x200e /* LEFT-TO-RIGHT MARK */,
  0x200f,
  0x200f /* RIGHT-TO-LEFT MARK */,
  0x202a,
  0x202a /* LEFT-TO-RIGHT EMBEDDING */,
  0x202b,
  0x202b /* RIGHT-TO-LEFT EMBEDDING */,
  0x202c,
  0x202c /* POP DIRECTIONAL FORMATTING */,
  0x202d,
  0x202d /* LEFT-TO-RIGHT OVERRIDE */,
  0x202e,
  0x202e /* RIGHT-TO-LEFT OVERRIDE */,
  0x206a,
  0x206a /* INHIBIT SYMMETRIC SWAPPING */,
  0x206b,
  0x206b /* ACTIVATE SYMMETRIC SWAPPING */,
  0x206c,
  0x206c /* INHIBIT ARABIC FORM SHAPING */,
  0x206d,
  0x206d /* ACTIVATE ARABIC FORM SHAPING */,
  0x206e,
  0x206e /* NATIONAL DIGIT SHAPES */,
  0x206f,
  0x206f /* NOMINAL DIGIT SHAPES */,

  /**
   * C.7 Inappropriate for canonical representation
   * @link https://tools.ietf.org/html/rfc3454#appendix-C.7
   */
  0x2ff0,
  0x2ffb /* [IDEOGRAPHIC DESCRIPTION CHARACTERS] */,

  /**
   * C.5 Surrogate codes
   * @link https://tools.ietf.org/html/rfc3454#appendix-C.5
   */
  0xd800,
  0xdfff,

  /**
   * C.3 Private use
   * @link https://tools.ietf.org/html/rfc3454#appendix-C.3
   */
  0xe000,
  0xf8ff /* [PRIVATE USE, PLANE 0] */,

  /**
   * C.6 Inappropriate for plain text
   * @link https://tools.ietf.org/html/rfc3454#appendix-C.6
   */
  0xfff9,
  0xfff9 /* INTERLINEAR ANNOTATION ANCHOR */,
  0xfffa,
  0xfffa /* INTERLINEAR ANNOTATION SEPARATOR */,
  0xfffb,
  0xfffb /* INTERLINEAR ANNOTATION TERMINATOR */,
  0xfffc,
  0xfffc /* OBJECT REPLACEMENT CHARACTER */,
  0xfffd,
  0xfffd /* REPLACEMENT CHARACTER */,

  /**
   * C.9 Tagging characters
   * @link https://tools.ietf.org/html/rfc3454#appendix-C.9
   */
  0xe0001,
  0xe0001 /* LANGUAGE TAG */,
  0xe0020,
  0xe007f /* [TAGGING CHARACTERS] */,

  /**
   * C.3 Private use
   * @link https://tools.ietf.org/html/rfc3454#appendix-C.3
   */

  0xf0000,
  0xffffd /* [PRIVATE USE, PLANE 15] */,
  0x100000,
  0x10fffd /* [PRIVATE USE, PLANE 16] */
];
/* eslint-enable */

export const isProhibitedCharacter = character =>
  inRange(character, non_ASCII_space_characters) ||
  inRange(character, prohibited_characters) ||
  inRange(character, non_ASCII_controls_characters) ||
  inRange(character, non_character_codepoints);

/* eslint-disable prettier/prettier */
/**
 * D.1 Characters with bidirectional property "R" or "AL"
 * @link https://tools.ietf.org/html/rfc3454#appendix-D.1
 */
const bidirectional_r_al = [
  0x05be,
  0x05be,
  0x05c0,
  0x05c0,
  0x05c3,
  0x05c3,
  0x05d0,
  0x05ea,
  0x05f0,
  0x05f4,
  0x061b,
  0x061b,
  0x061f,
  0x061f,
  0x0621,
  0x063a,
  0x0640,
  0x064a,
  0x066d,
  0x066f,
  0x0671,
  0x06d5,
  0x06dd,
  0x06dd,
  0x06e5,
  0x06e6,
  0x06fa,
  0x06fe,
  0x0700,
  0x070d,
  0x0710,
  0x0710,
  0x0712,
  0x072c,
  0x0780,
  0x07a5,
  0x07b1,
  0x07b1,
  0x200f,
  0x200f,
  0xfb1d,
  0xfb1d,
  0xfb1f,
  0xfb28,
  0xfb2a,
  0xfb36,
  0xfb38,
  0xfb3c,
  0xfb3e,
  0xfb3e,
  0xfb40,
  0xfb41,
  0xfb43,
  0xfb44,
  0xfb46,
  0xfbb1,
  0xfbd3,
  0xfd3d,
  0xfd50,
  0xfd8f,
  0xfd92,
  0xfdc7,
  0xfdf0,
  0xfdfc,
  0xfe70,
  0xfe74,
  0xfe76,
  0xfefc
];
/* eslint-enable */

export const isBidirectionalRAL = character => inRange(character, bidirectional_r_al);

/* eslint-disable prettier/prettier */
/**
 * D.2 Characters with bidirectional property "L"
 * @link https://tools.ietf.org/html/rfc3454#appendix-D.2
 */
const bidirectional_l = [
  0x0041,
  0x005a,
  0x0061,
  0x007a,
  0x00aa,
  0x00aa,
  0x00b5,
  0x00b5,
  0x00ba,
  0x00ba,
  0x00c0,
  0x00d6,
  0x00d8,
  0x00f6,
  0x00f8,
  0x0220,
  0x0222,
  0x0233,
  0x0250,
  0x02ad,
  0x02b0,
  0x02b8,
  0x02bb,
  0x02c1,
  0x02d0,
  0x02d1,
  0x02e0,
  0x02e4,
  0x02ee,
  0x02ee,
  0x037a,
  0x037a,
  0x0386,
  0x0386,
  0x0388,
  0x038a,
  0x038c,
  0x038c,
  0x038e,
  0x03a1,
  0x03a3,
  0x03ce,
  0x03d0,
  0x03f5,
  0x0400,
  0x0482,
  0x048a,
  0x04ce,
  0x04d0,
  0x04f5,
  0x04f8,
  0x04f9,
  0x0500,
  0x050f,
  0x0531,
  0x0556,
  0x0559,
  0x055f,
  0x0561,
  0x0587,
  0x0589,
  0x0589,
  0x0903,
  0x0903,
  0x0905,
  0x0939,
  0x093d,
  0x0940,
  0x0949,
  0x094c,
  0x0950,
  0x0950,
  0x0958,
  0x0961,
  0x0964,
  0x0970,
  0x0982,
  0x0983,
  0x0985,
  0x098c,
  0x098f,
  0x0990,
  0x0993,
  0x09a8,
  0x09aa,
  0x09b0,
  0x09b2,
  0x09b2,
  0x09b6,
  0x09b9,
  0x09be,
  0x09c0,
  0x09c7,
  0x09c8,
  0x09cb,
  0x09cc,
  0x09d7,
  0x09d7,
  0x09dc,
  0x09dd,
  0x09df,
  0x09e1,
  0x09e6,
  0x09f1,
  0x09f4,
  0x09fa,
  0x0a05,
  0x0a0a,
  0x0a0f,
  0x0a10,
  0x0a13,
  0x0a28,
  0x0a2a,
  0x0a30,
  0x0a32,
  0x0a33,
  0x0a35,
  0x0a36,
  0x0a38,
  0x0a39,
  0x0a3e,
  0x0a40,
  0x0a59,
  0x0a5c,
  0x0a5e,
  0x0a5e,
  0x0a66,
  0x0a6f,
  0x0a72,
  0x0a74,
  0x0a83,
  0x0a83,
  0x0a85,
  0x0a8b,
  0x0a8d,
  0x0a8d,
  0x0a8f,
  0x0a91,
  0x0a93,
  0x0aa8,
  0x0aaa,
  0x0ab0,
  0x0ab2,
  0x0ab3,
  0x0ab5,
  0x0ab9,
  0x0abd,
  0x0ac0,
  0x0ac9,
  0x0ac9,
  0x0acb,
  0x0acc,
  0x0ad0,
  0x0ad0,
  0x0ae0,
  0x0ae0,
  0x0ae6,
  0x0aef,
  0x0b02,
  0x0b03,
  0x0b05,
  0x0b0c,
  0x0b0f,
  0x0b10,
  0x0b13,
  0x0b28,
  0x0b2a,
  0x0b30,
  0x0b32,
  0x0b33,
  0x0b36,
  0x0b39,
  0x0b3d,
  0x0b3e,
  0x0b40,
  0x0b40,
  0x0b47,
  0x0b48,
  0x0b4b,
  0x0b4c,
  0x0b57,
  0x0b57,
  0x0b5c,
  0x0b5d,
  0x0b5f,
  0x0b61,
  0x0b66,
  0x0b70,
  0x0b83,
  0x0b83,
  0x0b85,
  0x0b8a,
  0x0b8e,
  0x0b90,
  0x0b92,
  0x0b95,
  0x0b99,
  0x0b9a,
  0x0b9c,
  0x0b9c,
  0x0b9e,
  0x0b9f,
  0x0ba3,
  0x0ba4,
  0x0ba8,
  0x0baa,
  0x0bae,
  0x0bb5,
  0x0bb7,
  0x0bb9,
  0x0bbe,
  0x0bbf,
  0x0bc1,
  0x0bc2,
  0x0bc6,
  0x0bc8,
  0x0bca,
  0x0bcc,
  0x0bd7,
  0x0bd7,
  0x0be7,
  0x0bf2,
  0x0c01,
  0x0c03,
  0x0c05,
  0x0c0c,
  0x0c0e,
  0x0c10,
  0x0c12,
  0x0c28,
  0x0c2a,
  0x0c33,
  0x0c35,
  0x0c39,
  0x0c41,
  0x0c44,
  0x0c60,
  0x0c61,
  0x0c66,
  0x0c6f,
  0x0c82,
  0x0c83,
  0x0c85,
  0x0c8c,
  0x0c8e,
  0x0c90,
  0x0c92,
  0x0ca8,
  0x0caa,
  0x0cb3,
  0x0cb5,
  0x0cb9,
  0x0cbe,
  0x0cbe,
  0x0cc0,
  0x0cc4,
  0x0cc7,
  0x0cc8,
  0x0cca,
  0x0ccb,
  0x0cd5,
  0x0cd6,
  0x0cde,
  0x0cde,
  0x0ce0,
  0x0ce1,
  0x0ce6,
  0x0cef,
  0x0d02,
  0x0d03,
  0x0d05,
  0x0d0c,
  0x0d0e,
  0x0d10,
  0x0d12,
  0x0d28,
  0x0d2a,
  0x0d39,
  0x0d3e,
  0x0d40,
  0x0d46,
  0x0d48,
  0x0d4a,
  0x0d4c,
  0x0d57,
  0x0d57,
  0x0d60,
  0x0d61,
  0x0d66,
  0x0d6f,
  0x0d82,
  0x0d83,
  0x0d85,
  0x0d96,
  0x0d9a,
  0x0db1,
  0x0db3,
  0x0dbb,
  0x0dbd,
  0x0dbd,
  0x0dc0,
  0x0dc6,
  0x0dcf,
  0x0dd1,
  0x0dd8,
  0x0ddf,
  0x0df2,
  0x0df4,
  0x0e01,
  0x0e30,
  0x0e32,
  0x0e33,
  0x0e40,
  0x0e46,
  0x0e4f,
  0x0e5b,
  0x0e81,
  0x0e82,
  0x0e84,
  0x0e84,
  0x0e87,
  0x0e88,
  0x0e8a,
  0x0e8a,
  0x0e8d,
  0x0e8d,
  0x0e94,
  0x0e97,
  0x0e99,
  0x0e9f,
  0x0ea1,
  0x0ea3,
  0x0ea5,
  0x0ea5,
  0x0ea7,
  0x0ea7,
  0x0eaa,
  0x0eab,
  0x0ead,
  0x0eb0,
  0x0eb2,
  0x0eb3,
  0x0ebd,
  0x0ebd,
  0x0ec0,
  0x0ec4,
  0x0ec6,
  0x0ec6,
  0x0ed0,
  0x0ed9,
  0x0edc,
  0x0edd,
  0x0f00,
  0x0f17,
  0x0f1a,
  0x0f34,
  0x0f36,
  0x0f36,
  0x0f38,
  0x0f38,
  0x0f3e,
  0x0f47,
  0x0f49,
  0x0f6a,
  0x0f7f,
  0x0f7f,
  0x0f85,
  0x0f85,
  0x0f88,
  0x0f8b,
  0x0fbe,
  0x0fc5,
  0x0fc7,
  0x0fcc,
  0x0fcf,
  0x0fcf,
  0x1000,
  0x1021,
  0x1023,
  0x1027,
  0x1029,
  0x102a,
  0x102c,
  0x102c,
  0x1031,
  0x1031,
  0x1038,
  0x1038,
  0x1040,
  0x1057,
  0x10a0,
  0x10c5,
  0x10d0,
  0x10f8,
  0x10fb,
  0x10fb,
  0x1100,
  0x1159,
  0x115f,
  0x11a2,
  0x11a8,
  0x11f9,
  0x1200,
  0x1206,
  0x1208,
  0x1246,
  0x1248,
  0x1248,
  0x124a,
  0x124d,
  0x1250,
  0x1256,
  0x1258,
  0x1258,
  0x125a,
  0x125d,
  0x1260,
  0x1286,
  0x1288,
  0x1288,
  0x128a,
  0x128d,
  0x1290,
  0x12ae,
  0x12b0,
  0x12b0,
  0x12b2,
  0x12b5,
  0x12b8,
  0x12be,
  0x12c0,
  0x12c0,
  0x12c2,
  0x12c5,
  0x12c8,
  0x12ce,
  0x12d0,
  0x12d6,
  0x12d8,
  0x12ee,
  0x12f0,
  0x130e,
  0x1310,
  0x1310,
  0x1312,
  0x1315,
  0x1318,
  0x131e,
  0x1320,
  0x1346,
  0x1348,
  0x135a,
  0x1361,
  0x137c,
  0x13a0,
  0x13f4,
  0x1401,
  0x1676,
  0x1681,
  0x169a,
  0x16a0,
  0x16f0,
  0x1700,
  0x170c,
  0x170e,
  0x1711,
  0x1720,
  0x1731,
  0x1735,
  0x1736,
  0x1740,
  0x1751,
  0x1760,
  0x176c,
  0x176e,
  0x1770,
  0x1780,
  0x17b6,
  0x17be,
  0x17c5,
  0x17c7,
  0x17c8,
  0x17d4,
  0x17da,
  0x17dc,
  0x17dc,
  0x17e0,
  0x17e9,
  0x1810,
  0x1819,
  0x1820,
  0x1877,
  0x1880,
  0x18a8,
  0x1e00,
  0x1e9b,
  0x1ea0,
  0x1ef9,
  0x1f00,
  0x1f15,
  0x1f18,
  0x1f1d,
  0x1f20,
  0x1f45,
  0x1f48,
  0x1f4d,
  0x1f50,
  0x1f57,
  0x1f59,
  0x1f59,
  0x1f5b,
  0x1f5b,
  0x1f5d,
  0x1f5d,
  0x1f5f,
  0x1f7d,
  0x1f80,
  0x1fb4,
  0x1fb6,
  0x1fbc,
  0x1fbe,
  0x1fbe,
  0x1fc2,
  0x1fc4,
  0x1fc6,
  0x1fcc,
  0x1fd0,
  0x1fd3,
  0x1fd6,
  0x1fdb,
  0x1fe0,
  0x1fec,
  0x1ff2,
  0x1ff4,
  0x1ff6,
  0x1ffc,
  0x200e,
  0x200e,
  0x2071,
  0x2071,
  0x207f,
  0x207f,
  0x2102,
  0x2102,
  0x2107,
  0x2107,
  0x210a,
  0x2113,
  0x2115,
  0x2115,
  0x2119,
  0x211d,
  0x2124,
  0x2124,
  0x2126,
  0x2126,
  0x2128,
  0x2128,
  0x212a,
  0x212d,
  0x212f,
  0x2131,
  0x2133,
  0x2139,
  0x213d,
  0x213f,
  0x2145,
  0x2149,
  0x2160,
  0x2183,
  0x2336,
  0x237a,
  0x2395,
  0x2395,
  0x249c,
  0x24e9,
  0x3005,
  0x3007,
  0x3021,
  0x3029,
  0x3031,
  0x3035,
  0x3038,
  0x303c,
  0x3041,
  0x3096,
  0x309d,
  0x309f,
  0x30a1,
  0x30fa,
  0x30fc,
  0x30ff,
  0x3105,
  0x312c,
  0x3131,
  0x318e,
  0x3190,
  0x31b7,
  0x31f0,
  0x321c,
  0x3220,
  0x3243,
  0x3260,
  0x327b,
  0x327f,
  0x32b0,
  0x32c0,
  0x32cb,
  0x32d0,
  0x32fe,
  0x3300,
  0x3376,
  0x337b,
  0x33dd,
  0x33e0,
  0x33fe,
  0x3400,
  0x4db5,
  0x4e00,
  0x9fa5,
  0xa000,
  0xa48c,
  0xac00,
  0xd7a3,
  0xd800,
  0xfa2d,
  0xfa30,
  0xfa6a,
  0xfb00,
  0xfb06,
  0xfb13,
  0xfb17,
  0xff21,
  0xff3a,
  0xff41,
  0xff5a,
  0xff66,
  0xffbe,
  0xffc2,
  0xffc7,
  0xffca,
  0xffcf,
  0xffd2,
  0xffd7,
  0xffda,
  0xffdc,
  0x10300,
  0x1031e,
  0x10320,
  0x10323,
  0x10330,
  0x1034a,
  0x10400,
  0x10425,
  0x10428,
  0x1044d,
  0x1d000,
  0x1d0f5,
  0x1d100,
  0x1d126,
  0x1d12a,
  0x1d166,
  0x1d16a,
  0x1d172,
  0x1d183,
  0x1d184,
  0x1d18c,
  0x1d1a9,
  0x1d1ae,
  0x1d1dd,
  0x1d400,
  0x1d454,
  0x1d456,
  0x1d49c,
  0x1d49e,
  0x1d49f,
  0x1d4a2,
  0x1d4a2,
  0x1d4a5,
  0x1d4a6,
  0x1d4a9,
  0x1d4ac,
  0x1d4ae,
  0x1d4b9,
  0x1d4bb,
  0x1d4bb,
  0x1d4bd,
  0x1d4c0,
  0x1d4c2,
  0x1d4c3,
  0x1d4c5,
  0x1d505,
  0x1d507,
  0x1d50a,
  0x1d50d,
  0x1d514,
  0x1d516,
  0x1d51c,
  0x1d51e,
  0x1d539,
  0x1d53b,
  0x1d53e,
  0x1d540,
  0x1d544,
  0x1d546,
  0x1d546,
  0x1d54a,
  0x1d550,
  0x1d552,
  0x1d6a3,
  0x1d6a8,
  0x1d7c9,
  0x20000,
  0x2a6d6,
  0x2f800,
  0x2fa1d,
  0xf0000,
  0xffffd,
  0x100000,
  0x10fffd
];
/* eslint-enable */

export const isBidirectionalL = character => inRange(character, bidirectional_l);
    }
    


    module wijmo.pdf.security {
    

// 2.1.  Mapping

/**
 * non-ASCII space characters [StringPrep, C.1.2] that can be
 * mapped to SPACE (U+0020)
 */
const mapping2space = isNonASCIISpaceCharacter;

/**
 * the "commonly mapped to nothing" characters [StringPrep, B.1]
 * that can be mapped to nothing.
 */
const mapping2nothing = isCommonlyMappedToNothing;

// utils
const getCodePoint = character => character.codePointAt(0);
const first = x => x[0];
const last = x => x[x.length - 1];

/**
 * Convert provided string into an array of Unicode Code Points.
 * Based on https://stackoverflow.com/a/21409165/1556249
 * and https://www.npmjs.com/package/code-point-at.
 * @param {string} input
 * @returns {number[]}
 */
function toCodePoints(input) {
  const codepoints = [];
  const size = input.length;

  for (let i = 0; i < size; i += 1) {
    const before = input.charCodeAt(i);

    if (before >= 0xd800 && before <= 0xdbff && size > i + 1) {
      const next = input.charCodeAt(i + 1);

      if (next >= 0xdc00 && next <= 0xdfff) {
        codepoints.push((before - 0xd800) * 0x400 + next - 0xdc00 + 0x10000);
        i += 1;
        continue;
      }
    }

    codepoints.push(before);
  }

  return codepoints;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint#Polyfill
function fromCodePoint() {
  if ((<any>String).fromCodePoint) {
    return (<any>String).fromCodePoint.apply(null, arguments);
  } else {
    var codeUnits = [], codeLen = 0, result = "";
    for (var index = 0, len = arguments.length; index !== len; ++index) {
      var codePoint = +arguments[index];
      // correctly handles all cases including `NaN`, `-Infinity`, `+Infinity`
      // The surrounding `!(...)` is required to correctly handle `NaN` cases
      // The (codePoint>>>0) === codePoint clause handles decimals and negatives
      if (!(codePoint < 0x10FFFF && (codePoint >>> 0) === codePoint))
        throw RangeError('Invalid code point: ' + codePoint);
      if (codePoint <= 0xFFFF) { // BMP code point
        codeLen = codeUnits.push(codePoint);
      } else { // Astral code point; split in surrogate halves
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        codePoint -= 0x10000;
        codeLen = codeUnits.push(
          (codePoint >> 10) + 0xD800,  // highSurrogate
          (codePoint % 0x400) + 0xDC00 // lowSurrogate
        );
      }
      if (codeLen >= 0x3fff) {
        result += String.fromCharCode.apply(null, codeUnits);
        codeUnits.length = 0;
      }
    }
    return result + String.fromCharCode.apply(null, codeUnits);
  }
}

/*
 * SASLprep.
 * @param {string} input
 * @param {Object} opts
 * @param {boolean} opts.allowUnassigned
 * @returns {string}
 */
export function saslprep(input, opts: any = {}) {
  if (typeof input !== 'string') {
    throw new TypeError('Expected string.');
  }

  if (input.length === 0) {
    return '';
  }

  // 1. Map
  const mapped_input = toCodePoints(input)
    // 1.1 mapping to space
    .map(character => (mapping2space(character) ? 0x20 : character))
    // 1.2 mapping to nothing
    .filter(character => !mapping2nothing(character));

  // 2. Normalize
  const normalized_input = fromCodePoint
    .apply(null, mapped_input)
    .normalize('NFKC');

  const normalized_map = toCodePoints(normalized_input);

  // 3. Prohibit
  const hasProhibited = normalized_map.some(isProhibitedCharacter);

  if (hasProhibited) {
    throw new Error(
      'Prohibited character, see https://tools.ietf.org/html/rfc4013#section-2.3'
    );
  }

  // Unassigned Code Points
  if (opts.allowUnassigned !== true) {
    const hasUnassigned = normalized_map.some(isUnassignedCodePoint);

    if (hasUnassigned) {
      throw new Error(
        'Unassigned code point, see https://tools.ietf.org/html/rfc4013#section-2.5'
      );
    }
  }

  // 4. check bidi

  const hasBidiRAL = normalized_map.some(isBidirectionalRAL);

  const hasBidiL = normalized_map.some(isBidirectionalL);

  // 4.1 If a string contains any RandALCat character, the string MUST NOT
  // contain any LCat character.
  if (hasBidiRAL && hasBidiL) {
    throw new Error(
      'String must not contain RandALCat and LCat at the same time,' +
      ' see https://tools.ietf.org/html/rfc3454#section-6'
    );
  }

  /**
   * 4.2 If a string contains any RandALCat character, a RandALCat
   * character MUST be the first character of the string, and a
   * RandALCat character MUST be the last character of the string.
   */

  const isFirstBidiRAL = isBidirectionalRAL(
    getCodePoint(first(normalized_input))
  );
  const isLastBidiRAL = isBidirectionalRAL(
    getCodePoint(last(normalized_input))
  );

  if (hasBidiRAL && !(isFirstBidiRAL && isLastBidiRAL)) {
    throw new Error(
      'Bidirectional RandALCat character must be the first and the last' +
      ' character of the string, see https://tools.ietf.org/html/rfc3454#section-6'
    );
  }

  return normalized_input;
}

    }
    


    module wijmo.pdf.security {
    /*
* CryptoJS core components.
*/
export var CryptoJS = function (Math, undefined) {

	var crypto;

	// Native crypto from window (Browser)
	if (typeof window !== 'undefined' && window.crypto) {
		crypto = window.crypto;
	}

	// Native (experimental IE 11) crypto from window (Browser)
	if (!crypto && typeof window !== 'undefined' && (<any>window).msCrypto) {
		crypto = (<any>window).msCrypto;
	}

	// Native crypto from global (NodeJS)
	// if (!crypto && typeof global !== 'undefined' && global.crypto) {
	// 	crypto = global.crypto;
	// }

	/*
* Cryptographically secure pseudorandom number generator
*
* As Math.random() is cryptographically not safe to use
*/
	var cryptoSecureRandomInt = function () {
		if (crypto) {
			// Use getRandomValues method (Browser)
			if (typeof crypto.getRandomValues === 'function') {
				try {
					return crypto.getRandomValues(new Uint32Array(1))[0];
				} catch (err) { }
			}

			// Use randomBytes method (NodeJS)
			if (typeof crypto.randomBytes === 'function') {
				try {
					return crypto.randomBytes(4).readInt32LE();
				} catch (err) { }
			}
		}

		throw new Error('Native crypto module could not be used to get secure random number.');
	};

	/*
* Local polyfill of Object.create
*/
	var create = Object.create || function () {
		function F() { }

		return function (obj) {
			var subtype;

			F.prototype = obj;

			subtype = new F();

			F.prototype = null;

			return subtype;
		};
	}();

	/**
* CryptoJS namespace.
*/
	var C: any = {};

	/**
* Library namespace.
*/
	var C_lib: any = C.lib = {};

	/**
* Base object for prototypal inheritance.
*/
	var Base = C_lib.Base = function () {

		return {
			/**
 * Creates a new object that inherits from this object.
 *
 * @param {Object} overrides Properties to copy into the new object.
 *
 * @return {Object} The new object.
 *
 * @static
 *
 * @example
 *
 *     var MyType = CryptoJS.lib.Base.extend({
 *         field: 'value',
 *
 *         method: function () {
 *         }
 *     });
 */
			extend: function (overrides?) {
				// Spawn
				var subtype = create(this);

				// Augment
				if (overrides) {
					subtype.mixIn(overrides);
				}

				// Create default initializer
				if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
					subtype.init = function () {
						subtype.$super.init.apply(this, arguments);
					};
				}

				// Initializer's prototype is the subtype object
				subtype.init.prototype = subtype;

				// Reference supertype
				subtype.$super = this;

				return subtype;
			},

			/**
 * Extends this object and runs the init method.
 * Arguments to create() will be passed to init().
 *
 * @return {Object} The new object.
 *
 * @static
 *
 * @example
 *
 *     var instance = MyType.create();
 */
			create: function () {
				var instance = this.extend();
				instance.init.apply(instance, arguments);

				return instance;
			},

			/**
 * Initializes a newly created object.
 * Override this method to add some logic when your objects are created.
 *
 * @example
 *
 *     var MyType = CryptoJS.lib.Base.extend({
 *         init: function () {
 *             // ...
 *         }
 *     });
 */
			init: function () { },

			/**
 * Copies properties into this object.
 *
 * @param {Object} properties The properties to mix in.
 *
 * @example
 *
 *     MyType.mixIn({
 *         field: 'value'
 *     });
 */
			mixIn: function (properties) {
				for (var propertyName in properties) {
					if (properties.hasOwnProperty(propertyName)) {
						this[propertyName] = properties[propertyName];
					}
				}

				// IE won't copy toString using the loop above
				if (properties.hasOwnProperty('toString')) {
					this.toString = properties.toString;
				}
			},

			/**
 * Creates a copy of this object.
 *
 * @return {Object} The clone.
 *
 * @example
 *
 *     var clone = instance.clone();
 */
			clone: function () {
				return this.init.prototype.extend(this);
			}
		};
	}();

	/**
* An array of 32-bit words.
*
* @property {Array} words The array of 32-bit words.
* @property {number} sigBytes The number of significant bytes in this word array.
*/
	var WordArray = C_lib.WordArray = Base.extend({
		/**
* Initializes a newly created word array.
*
* @param {Array} words (Optional) An array of 32-bit words.
* @param {number} sigBytes (Optional) The number of significant bytes in the words.
*
* @example
*
*     var wordArray = CryptoJS.lib.WordArray.create();
*     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
*     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
*/
		init: function (words, sigBytes) {
			words = this.words = words || [];

			if (sigBytes != undefined) {
				this.sigBytes = sigBytes;
			} else {
				this.sigBytes = words.length * 4;
			}
		},

		/**
* Converts this word array to a string.
*
* @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
*
* @return {string} The stringified word array.
*
* @example
*
*     var string = wordArray + '';
*     var string = wordArray.toString();
*     var string = wordArray.toString(CryptoJS.enc.Utf8);
*/
		toString: function (encoder) {
			return (encoder || Hex).stringify(this);
		},

		/**
* Concatenates a word array to this word array.
*
* @param {WordArray} wordArray The word array to append.
*
* @return {WordArray} This word array.
*
* @example
*
*     wordArray1.concat(wordArray2);
*/
		concat: function (wordArray) {
			// Shortcuts
			var thisWords = this.words;
			var thatWords = wordArray.words;
			var thisSigBytes = this.sigBytes;
			var thatSigBytes = wordArray.sigBytes;

			// Clamp excess bits
			this.clamp();

			// Concat
			if (thisSigBytes % 4) {
				// Copy one byte at a time
				for (var i = 0; i < thatSigBytes; i++) {
					var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
					thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
				}
			} else {
				// Copy one word at a time
				for (var i = 0; i < thatSigBytes; i += 4) {
					thisWords[thisSigBytes + i >>> 2] = thatWords[i >>> 2];
				}
			}
			this.sigBytes += thatSigBytes;

			// Chainable
			return this;
		},

		/**
* Removes insignificant bits.
*
* @example
*
*     wordArray.clamp();
*/
		clamp: function () {
			// Shortcuts
			var words = this.words;
			var sigBytes = this.sigBytes;

			// Clamp
			words[sigBytes >>> 2] &= 0xffffffff << 32 - sigBytes % 4 * 8;
			words.length = Math.ceil(sigBytes / 4);
		},

		/**
* Creates a copy of this word array.
*
* @return {WordArray} The clone.
*
* @example
*
*     var clone = wordArray.clone();
*/
		clone: function () {
			var clone = Base.clone.call(this);
			clone.words = this.words.slice(0);

			return clone;
		},

		/**
* Creates a word array filled with random bytes.
*
* @param {number} nBytes The number of random bytes to generate.
*
* @return {WordArray} The random word array.
*
* @static
*
* @example
*
*     var wordArray = CryptoJS.lib.WordArray.random(16);
*/
		random: function (nBytes) {
			var words = [];

			for (var i = 0; i < nBytes; i += 4) {
				words.push(cryptoSecureRandomInt());
			}

			return new WordArray.init(words, nBytes);
		}
	});

	/**
* Encoder namespace.
*/
	var C_enc: any = C.enc = {};

	/**
* Hex encoding strategy.
*/
	var Hex = C_enc.Hex = {
		/**
* Converts a word array to a hex string.
*
* @param {WordArray} wordArray The word array.
*
* @return {string} The hex string.
*
* @static
*
* @example
*
*     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
*/
		stringify: function (wordArray) {
			// Shortcuts
			var words = wordArray.words;
			var sigBytes = wordArray.sigBytes;

			// Convert
			var hexChars = [];
			for (var i = 0; i < sigBytes; i++) {
				var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
				hexChars.push((bite >>> 4).toString(16));
				hexChars.push((bite & 0x0f).toString(16));
			}

			return hexChars.join('');
		},

		/**
* Converts a hex string to a word array.
*
* @param {string} hexStr The hex string.
*
* @return {WordArray} The word array.
*
* @static
*
* @example
*
*     var wordArray = CryptoJS.enc.Hex.parse(hexString);
*/
		parse: function (hexStr) {
			// Shortcut
			var hexStrLength = hexStr.length;

			// Convert
			var words = [];
			for (var i = 0; i < hexStrLength; i += 2) {
				words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
			}

			return new WordArray.init(words, hexStrLength / 2);
		}
	};

	/**
* Latin1 encoding strategy.
*/
	var Latin1 = C_enc.Latin1 = {
		/**
* Converts a word array to a Latin1 string.
*
* @param {WordArray} wordArray The word array.
*
* @return {string} The Latin1 string.
*
* @static
*
* @example
*
*     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
*/
		stringify: function (wordArray) {
			// Shortcuts
			var words = wordArray.words;
			var sigBytes = wordArray.sigBytes;

			// Convert
			var latin1Chars = [];
			for (var i = 0; i < sigBytes; i++) {
				var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
				latin1Chars.push(String.fromCharCode(bite));
			}

			return latin1Chars.join('');
		},

		/**
* Converts a Latin1 string to a word array.
*
* @param {string} latin1Str The Latin1 string.
*
* @return {WordArray} The word array.
*
* @static
*
* @example
*
*     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
*/
		parse: function (latin1Str) {
			// Shortcut
			var latin1StrLength = latin1Str.length;

			// Convert
			var words = [];
			for (var i = 0; i < latin1StrLength; i++) {
				words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << 24 - i % 4 * 8;
			}

			return new WordArray.init(words, latin1StrLength);
		}
	};

	/**
* UTF-8 encoding strategy.
*/
	var Utf8 = C_enc.Utf8 = {
		/**
* Converts a word array to a UTF-8 string.
*
* @param {WordArray} wordArray The word array.
*
* @return {string} The UTF-8 string.
*
* @static
*
* @example
*
*     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
*/
		stringify: function (wordArray) {
			try {
				return decodeURIComponent(escape(Latin1.stringify(wordArray)));
			} catch (e) {
				throw new Error('Malformed UTF-8 data');
			}
		},

		/**
* Converts a UTF-8 string to a word array.
*
* @param {string} utf8Str The UTF-8 string.
*
* @return {WordArray} The word array.
*
* @static
*
* @example
*
*     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
*/
		parse: function (utf8Str) {
			return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
		}
	};

	/**
* Abstract buffered block algorithm template.
*
* The property blockSize must be implemented in a concrete subtype.
*
* @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
*/
	var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
		/**
* Resets this block algorithm's data buffer to its initial state.
*
* @example
*
*     bufferedBlockAlgorithm.reset();
*/
		reset: function () {
			// Initial values
			this._data = new WordArray.init();
			this._nDataBytes = 0;
		},

		/**
* Adds new data to this block algorithm's buffer.
*
* @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
*
* @example
*
*     bufferedBlockAlgorithm._append('data');
*     bufferedBlockAlgorithm._append(wordArray);
*/
		_append: function (data) {
			// Convert string to WordArray, else assume WordArray already
			if (typeof data == 'string') {
				data = Utf8.parse(data);
			}

			// Append
			this._data.concat(data);
			this._nDataBytes += data.sigBytes;
		},

		/**
* Processes available data blocks.
*
* This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
*
* @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
*
* @return {WordArray} The processed data.
*
* @example
*
*     var processedData = bufferedBlockAlgorithm._process();
*     var processedData = bufferedBlockAlgorithm._process(!!'flush');
*/
		_process: function (doFlush) {
			var processedWords;

			// Shortcuts
			var data = this._data;
			var dataWords = data.words;
			var dataSigBytes = data.sigBytes;
			var blockSize = this.blockSize;
			var blockSizeBytes = blockSize * 4;

			// Count blocks ready
			var nBlocksReady = dataSigBytes / blockSizeBytes;
			if (doFlush) {
				// Round up to include partial blocks
				nBlocksReady = Math.ceil(nBlocksReady);
			} else {
				// Round down to include only full blocks,
				// less the number of blocks that must remain in the buffer
				nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
			}

			// Count words ready
			var nWordsReady = nBlocksReady * blockSize;

			// Count bytes ready
			var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

			// Process blocks
			if (nWordsReady) {
				for (var offset = 0; offset < nWordsReady; offset += blockSize) {
					// Perform concrete-algorithm logic
					this._doProcessBlock(dataWords, offset);
				}

				// Remove processed words
				processedWords = dataWords.splice(0, nWordsReady);
				data.sigBytes -= nBytesReady;
			}

			// Return processed words
			return new WordArray.init(processedWords, nBytesReady);
		},

		/**
* Creates a copy of this object.
*
* @return {Object} The clone.
*
* @example
*
*     var clone = bufferedBlockAlgorithm.clone();
*/
		clone: function () {
			var clone = Base.clone.call(this);
			clone._data = this._data.clone();

			return clone;
		},

		_minBufferSize: 0
	});

	/**
* Abstract hasher template.
*
* @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
*/
	var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
		/**
* Configuration options.
*/
		cfg: Base.extend(),

		/**
* Initializes a newly created hasher.
*
* @param {Object} cfg (Optional) The configuration options to use for this hash computation.
*
* @example
*
*     var hasher = CryptoJS.algo.SHA256.create();
*/
		init: function (cfg) {
			// Apply config defaults
			this.cfg = this.cfg.extend(cfg);

			// Set initial values
			this.reset();
		},

		/**
* Resets this hasher to its initial state.
*
* @example
*
*     hasher.reset();
*/
		reset: function () {
			// Reset data buffer
			BufferedBlockAlgorithm.reset.call(this);

			// Perform concrete-hasher logic
			this._doReset();
		},

		/**
* Updates this hasher with a message.
*
* @param {WordArray|string} messageUpdate The message to append.
*
* @return {Hasher} This hasher.
*
* @example
*
*     hasher.update('message');
*     hasher.update(wordArray);
*/
		update: function (messageUpdate) {
			// Append
			this._append(messageUpdate);

			// Update the hash
			this._process();

			// Chainable
			return this;
		},

		/**
* Finalizes the hash computation.
* Note that the finalize operation is effectively a destructive, read-once operation.
*
* @param {WordArray|string} messageUpdate (Optional) A final message update.
*
* @return {WordArray} The hash.
*
* @example
*
*     var hash = hasher.finalize();
*     var hash = hasher.finalize('message');
*     var hash = hasher.finalize(wordArray);
*/
		finalize: function (messageUpdate) {
			// Final message update
			if (messageUpdate) {
				this._append(messageUpdate);
			}

			// Perform concrete-hasher logic
			var hash = this._doFinalize();

			return hash;
		},

		blockSize: 512 / 32,

		/**
* Creates a shortcut function to a hasher's object interface.
*
* @param {Hasher} hasher The hasher to create a helper for.
*
* @return {Function} The shortcut function.
*
* @static
*
* @example
*
*     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
*/
		_createHelper: function (hasher) {
			return function (message, cfg) {
				return new hasher.init(cfg).finalize(message);
			};
		},

		/**
* Creates a shortcut function to the HMAC's object interface.
*
* @param {Hasher} hasher The hasher to use in this HMAC helper.
*
* @return {Function} The shortcut function.
*
* @static
*
* @example
*
*     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
*/
		_createHmacHelper: function (hasher) {
			return function (message, key) {
				return new C_algo.HMAC.init(hasher, key).finalize(message);
			};
		}
	});

	/**
* Algorithm namespace.
*/
	var C_algo: any = C.algo = {};

	return C;
}(Math);

(function (Math) {
	// Shortcuts
	var C = CryptoJS;
	var C_lib = C.lib;
	var WordArray = C_lib.WordArray;
	var Hasher = C_lib.Hasher;
	var C_algo = C.algo;

	// Constants table
	var T = [];

	// Compute constants
	(function () {
		for (var i = 0; i < 64; i++) {
			T[i] = Math.abs(Math.sin(i + 1)) * 0x100000000 | 0;
		}
	})();

	/**
* MD5 hash algorithm.
*/
	var MD5 = C_algo.MD5 = Hasher.extend({
		_doReset: function () {
			this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
		},

		_doProcessBlock: function (M, offset) {
			// Swap endian
			for (var i = 0; i < 16; i++) {
				// Shortcuts
				var offset_i = offset + i;
				var M_offset_i = M[offset_i];

				M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
			}

			// Shortcuts
			var H = this._hash.words;

			var M_offset_0 = M[offset + 0];
			var M_offset_1 = M[offset + 1];
			var M_offset_2 = M[offset + 2];
			var M_offset_3 = M[offset + 3];
			var M_offset_4 = M[offset + 4];
			var M_offset_5 = M[offset + 5];
			var M_offset_6 = M[offset + 6];
			var M_offset_7 = M[offset + 7];
			var M_offset_8 = M[offset + 8];
			var M_offset_9 = M[offset + 9];
			var M_offset_10 = M[offset + 10];
			var M_offset_11 = M[offset + 11];
			var M_offset_12 = M[offset + 12];
			var M_offset_13 = M[offset + 13];
			var M_offset_14 = M[offset + 14];
			var M_offset_15 = M[offset + 15];

			// Working varialbes
			var a = H[0];
			var b = H[1];
			var c = H[2];
			var d = H[3];

			// Computation
			a = FF(a, b, c, d, M_offset_0, 7, T[0]);
			d = FF(d, a, b, c, M_offset_1, 12, T[1]);
			c = FF(c, d, a, b, M_offset_2, 17, T[2]);
			b = FF(b, c, d, a, M_offset_3, 22, T[3]);
			a = FF(a, b, c, d, M_offset_4, 7, T[4]);
			d = FF(d, a, b, c, M_offset_5, 12, T[5]);
			c = FF(c, d, a, b, M_offset_6, 17, T[6]);
			b = FF(b, c, d, a, M_offset_7, 22, T[7]);
			a = FF(a, b, c, d, M_offset_8, 7, T[8]);
			d = FF(d, a, b, c, M_offset_9, 12, T[9]);
			c = FF(c, d, a, b, M_offset_10, 17, T[10]);
			b = FF(b, c, d, a, M_offset_11, 22, T[11]);
			a = FF(a, b, c, d, M_offset_12, 7, T[12]);
			d = FF(d, a, b, c, M_offset_13, 12, T[13]);
			c = FF(c, d, a, b, M_offset_14, 17, T[14]);
			b = FF(b, c, d, a, M_offset_15, 22, T[15]);

			a = GG(a, b, c, d, M_offset_1, 5, T[16]);
			d = GG(d, a, b, c, M_offset_6, 9, T[17]);
			c = GG(c, d, a, b, M_offset_11, 14, T[18]);
			b = GG(b, c, d, a, M_offset_0, 20, T[19]);
			a = GG(a, b, c, d, M_offset_5, 5, T[20]);
			d = GG(d, a, b, c, M_offset_10, 9, T[21]);
			c = GG(c, d, a, b, M_offset_15, 14, T[22]);
			b = GG(b, c, d, a, M_offset_4, 20, T[23]);
			a = GG(a, b, c, d, M_offset_9, 5, T[24]);
			d = GG(d, a, b, c, M_offset_14, 9, T[25]);
			c = GG(c, d, a, b, M_offset_3, 14, T[26]);
			b = GG(b, c, d, a, M_offset_8, 20, T[27]);
			a = GG(a, b, c, d, M_offset_13, 5, T[28]);
			d = GG(d, a, b, c, M_offset_2, 9, T[29]);
			c = GG(c, d, a, b, M_offset_7, 14, T[30]);
			b = GG(b, c, d, a, M_offset_12, 20, T[31]);

			a = HH(a, b, c, d, M_offset_5, 4, T[32]);
			d = HH(d, a, b, c, M_offset_8, 11, T[33]);
			c = HH(c, d, a, b, M_offset_11, 16, T[34]);
			b = HH(b, c, d, a, M_offset_14, 23, T[35]);
			a = HH(a, b, c, d, M_offset_1, 4, T[36]);
			d = HH(d, a, b, c, M_offset_4, 11, T[37]);
			c = HH(c, d, a, b, M_offset_7, 16, T[38]);
			b = HH(b, c, d, a, M_offset_10, 23, T[39]);
			a = HH(a, b, c, d, M_offset_13, 4, T[40]);
			d = HH(d, a, b, c, M_offset_0, 11, T[41]);
			c = HH(c, d, a, b, M_offset_3, 16, T[42]);
			b = HH(b, c, d, a, M_offset_6, 23, T[43]);
			a = HH(a, b, c, d, M_offset_9, 4, T[44]);
			d = HH(d, a, b, c, M_offset_12, 11, T[45]);
			c = HH(c, d, a, b, M_offset_15, 16, T[46]);
			b = HH(b, c, d, a, M_offset_2, 23, T[47]);

			a = II(a, b, c, d, M_offset_0, 6, T[48]);
			d = II(d, a, b, c, M_offset_7, 10, T[49]);
			c = II(c, d, a, b, M_offset_14, 15, T[50]);
			b = II(b, c, d, a, M_offset_5, 21, T[51]);
			a = II(a, b, c, d, M_offset_12, 6, T[52]);
			d = II(d, a, b, c, M_offset_3, 10, T[53]);
			c = II(c, d, a, b, M_offset_10, 15, T[54]);
			b = II(b, c, d, a, M_offset_1, 21, T[55]);
			a = II(a, b, c, d, M_offset_8, 6, T[56]);
			d = II(d, a, b, c, M_offset_15, 10, T[57]);
			c = II(c, d, a, b, M_offset_6, 15, T[58]);
			b = II(b, c, d, a, M_offset_13, 21, T[59]);
			a = II(a, b, c, d, M_offset_4, 6, T[60]);
			d = II(d, a, b, c, M_offset_11, 10, T[61]);
			c = II(c, d, a, b, M_offset_2, 15, T[62]);
			b = II(b, c, d, a, M_offset_9, 21, T[63]);

			// Intermediate hash value
			H[0] = H[0] + a | 0;
			H[1] = H[1] + b | 0;
			H[2] = H[2] + c | 0;
			H[3] = H[3] + d | 0;
		},

		_doFinalize: function () {
			// Shortcuts
			var data = this._data;
			var dataWords = data.words;

			var nBitsTotal = this._nDataBytes * 8;
			var nBitsLeft = data.sigBytes * 8;

			// Add padding
			dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;

			var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
			var nBitsTotalL = nBitsTotal;
			dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 0x00ff00ff | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 0xff00ff00;
			dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 0x00ff00ff | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 0xff00ff00;

			data.sigBytes = (dataWords.length + 1) * 4;

			// Hash final blocks
			this._process();

			// Shortcuts
			var hash = this._hash;
			var H = hash.words;

			// Swap endian
			for (var i = 0; i < 4; i++) {
				// Shortcut
				var H_i = H[i];

				H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
			}

			// Return final computed hash
			return hash;
		},

		clone: function () {
			var clone = Hasher.clone.call(this);
			clone._hash = this._hash.clone();

			return clone;
		}
	});

	function FF(a, b, c, d, x, s, t) {
		var n = a + (b & c | ~b & d) + x + t;
		return (n << s | n >>> 32 - s) + b;
	}

	function GG(a, b, c, d, x, s, t) {
		var n = a + (b & d | c & ~d) + x + t;
		return (n << s | n >>> 32 - s) + b;
	}

	function HH(a, b, c, d, x, s, t) {
		var n = a + (b ^ c ^ d) + x + t;
		return (n << s | n >>> 32 - s) + b;
	}

	function II(a, b, c, d, x, s, t) {
		var n = a + (c ^ (b | ~d)) + x + t;
		return (n << s | n >>> 32 - s) + b;
	}

	/**
* Shortcut function to the hasher's object interface.
*
* @param {WordArray|string} message The message to hash.
*
* @return {WordArray} The hash.
*
* @static
*
* @example
*
*     var hash = CryptoJS.MD5('message');
*     var hash = CryptoJS.MD5(wordArray);
*/
	C.MD5 = Hasher._createHelper(MD5);

	/**
* Shortcut function to the HMAC's object interface.
*
* @param {WordArray|string} message The message to hash.
* @param {WordArray|string} key The secret key.
*
* @return {WordArray} The HMAC.
*
* @static
*
* @example
*
*     var hmac = CryptoJS.HmacMD5(message, key);
*/
	C.HmacMD5 = Hasher._createHmacHelper(MD5);
})(Math);

(function (Math) {
	// Shortcuts
	var C = CryptoJS;
	var C_lib = C.lib;
	var WordArray = C_lib.WordArray;
	var Hasher = C_lib.Hasher;
	var C_algo = C.algo;

	// Initialization and round constants tables
	var H = [];
	var K = [];

	// Compute constants
	(function () {
		function isPrime(n) {
			var sqrtN = Math.sqrt(n);
			for (var factor = 2; factor <= sqrtN; factor++) {
				if (!(n % factor)) {
					return false;
				}
			}

			return true;
		}

		function getFractionalBits(n) {
			return (n - (n | 0)) * 0x100000000 | 0;
		}

		var n = 2;
		var nPrime = 0;
		while (nPrime < 64) {
			if (isPrime(n)) {
				if (nPrime < 8) {
					H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
				}
				K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

				nPrime++;
			}

			n++;
		}
	})();

	// Reusable object
	var W = [];

	/**
* SHA-256 hash algorithm.
*/
	var SHA256 = C_algo.SHA256 = Hasher.extend({
		_doReset: function () {
			this._hash = new WordArray.init(H.slice(0));
		},

		_doProcessBlock: function (M, offset) {
			// Shortcut
			var H = this._hash.words;

			// Working variables
			var a = H[0];
			var b = H[1];
			var c = H[2];
			var d = H[3];
			var e = H[4];
			var f = H[5];
			var g = H[6];
			var h = H[7];

			// Computation
			for (var i = 0; i < 64; i++) {
				if (i < 16) {
					W[i] = M[offset + i] | 0;
				} else {
					var gamma0x = W[i - 15];
					var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;

					var gamma1x = W[i - 2];
					var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;

					W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
				}

				var ch = e & f ^ ~e & g;
				var maj = a & b ^ a & c ^ b & c;

				var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
				var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);

				var t1 = h + sigma1 + ch + K[i] + W[i];
				var t2 = sigma0 + maj;

				h = g;
				g = f;
				f = e;
				e = d + t1 | 0;
				d = c;
				c = b;
				b = a;
				a = t1 + t2 | 0;
			}

			// Intermediate hash value
			H[0] = H[0] + a | 0;
			H[1] = H[1] + b | 0;
			H[2] = H[2] + c | 0;
			H[3] = H[3] + d | 0;
			H[4] = H[4] + e | 0;
			H[5] = H[5] + f | 0;
			H[6] = H[6] + g | 0;
			H[7] = H[7] + h | 0;
		},

		_doFinalize: function () {
			// Shortcuts
			var data = this._data;
			var dataWords = data.words;

			var nBitsTotal = this._nDataBytes * 8;
			var nBitsLeft = data.sigBytes * 8;

			// Add padding
			dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
			dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
			dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
			data.sigBytes = dataWords.length * 4;

			// Hash final blocks
			this._process();

			// Return final computed hash
			return this._hash;
		},

		clone: function () {
			var clone = Hasher.clone.call(this);
			clone._hash = this._hash.clone();

			return clone;
		}
	});

	/**
* Shortcut function to the hasher's object interface.
*
* @param {WordArray|string} message The message to hash.
*
* @return {WordArray} The hash.
*
* @static
*
* @example
*
*     var hash = CryptoJS.SHA256('message');
*     var hash = CryptoJS.SHA256(wordArray);
*/
	C.SHA256 = Hasher._createHelper(SHA256);

	/**
* Shortcut function to the HMAC's object interface.
*
* @param {WordArray|string} message The message to hash.
* @param {WordArray|string} key The secret key.
*
* @return {WordArray} The HMAC.
*
* @static
*
* @example
*
*     var hmac = CryptoJS.HmacSHA256(message, key);
*/
	C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
})(Math);

(function () {
	// Shortcuts
	var C = CryptoJS;
	var C_lib = C.lib;
	var Base = C_lib.Base;
	var C_enc = C.enc;
	var Utf8 = C_enc.Utf8;
	var C_algo = C.algo;

	/**
* HMAC algorithm.
*/
	var HMAC = C_algo.HMAC = Base.extend({
		/**
* Initializes a newly created HMAC.
*
* @param {Hasher} hasher The hash algorithm to use.
* @param {WordArray|string} key The secret key.
*
* @example
*
*     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
*/
		init: function (hasher, key) {
			// Init hasher
			hasher = this._hasher = new hasher.init();

			// Convert string to WordArray, else assume WordArray already
			if (typeof key == 'string') {
				key = Utf8.parse(key);
			}

			// Shortcuts
			var hasherBlockSize = hasher.blockSize;
			var hasherBlockSizeBytes = hasherBlockSize * 4;

			// Allow arbitrary length keys
			if (key.sigBytes > hasherBlockSizeBytes) {
				key = hasher.finalize(key);
			}

			// Clamp excess bits
			key.clamp();

			// Clone key for inner and outer pads
			var oKey = this._oKey = key.clone();
			var iKey = this._iKey = key.clone();

			// Shortcuts
			var oKeyWords = oKey.words;
			var iKeyWords = iKey.words;

			// XOR keys with pad constants
			for (var i = 0; i < hasherBlockSize; i++) {
				oKeyWords[i] ^= 0x5c5c5c5c;
				iKeyWords[i] ^= 0x36363636;
			}
			oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

			// Set initial values
			this.reset();
		},

		/**
* Resets this HMAC to its initial state.
*
* @example
*
*     hmacHasher.reset();
*/
		reset: function () {
			// Shortcut
			var hasher = this._hasher;

			// Reset
			hasher.reset();
			hasher.update(this._iKey);
		},

		/**
* Updates this HMAC with a message.
*
* @param {WordArray|string} messageUpdate The message to append.
*
* @return {HMAC} This HMAC instance.
*
* @example
*
*     hmacHasher.update('message');
*     hmacHasher.update(wordArray);
*/
		update: function (messageUpdate) {
			this._hasher.update(messageUpdate);

			// Chainable
			return this;
		},

		/**
* Finalizes the HMAC computation.
* Note that the finalize operation is effectively a destructive, read-once operation.
*
* @param {WordArray|string} messageUpdate (Optional) A final message update.
*
* @return {WordArray} The HMAC.
*
* @example
*
*     var hmac = hmacHasher.finalize();
*     var hmac = hmacHasher.finalize('message');
*     var hmac = hmacHasher.finalize(wordArray);
*/
		finalize: function (messageUpdate) {
			// Shortcut
			var hasher = this._hasher;

			// Compute HMAC
			var innerHash = hasher.finalize(messageUpdate);
			hasher.reset();
			var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

			return hmac;
		}
	});
})();

/**
* Cipher core components.
*/
CryptoJS.lib.Cipher || function (undefined) {
	// Shortcuts
	var C = CryptoJS;
	var C_lib = C.lib;
	var Base = C_lib.Base;
	var WordArray = C_lib.WordArray;
	var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
	var C_enc = C.enc;
	var Utf8 = C_enc.Utf8;
	var Base64 = C_enc.Base64;
	var C_algo = C.algo;
	var EvpKDF = C_algo.EvpKDF;

	/**
* Abstract base cipher template.
*
* @property {number} keySize This cipher's key size. Default: 4 (128 bits)
* @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
* @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
* @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
*/
	var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
		/**
* Configuration options.
*
* @property {WordArray} iv The IV to use for this operation.
*/
		cfg: Base.extend(),

		/**
* Creates this cipher in encryption mode.
*
* @param {WordArray} key The key.
* @param {Object} cfg (Optional) The configuration options to use for this operation.
*
* @return {Cipher} A cipher instance.
*
* @static
*
* @example
*
*     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
*/
		createEncryptor: function (key, cfg) {
			return this.create(this._ENC_XFORM_MODE, key, cfg);
		},

		/**
* Creates this cipher in decryption mode.
*
* @param {WordArray} key The key.
* @param {Object} cfg (Optional) The configuration options to use for this operation.
*
* @return {Cipher} A cipher instance.
*
* @static
*
* @example
*
*     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
*/
		createDecryptor: function (key, cfg) {
			return this.create(this._DEC_XFORM_MODE, key, cfg);
		},

		/**
* Initializes a newly created cipher.
*
* @param {number} xformMode Either the encryption or decryption transormation mode constant.
* @param {WordArray} key The key.
* @param {Object} cfg (Optional) The configuration options to use for this operation.
*
* @example
*
*     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
*/
		init: function (xformMode, key, cfg) {
			// Apply config defaults
			this.cfg = this.cfg.extend(cfg);

			// Store transform mode and key
			this._xformMode = xformMode;
			this._key = key;

			// Set initial values
			this.reset();
		},

		/**
* Resets this cipher to its initial state.
*
* @example
*
*     cipher.reset();
*/
		reset: function () {
			// Reset data buffer
			BufferedBlockAlgorithm.reset.call(this);

			// Perform concrete-cipher logic
			this._doReset();
		},

		/**
* Adds data to be encrypted or decrypted.
*
* @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
*
* @return {WordArray} The data after processing.
*
* @example
*
*     var encrypted = cipher.process('data');
*     var encrypted = cipher.process(wordArray);
*/
		process: function (dataUpdate) {
			// Append
			this._append(dataUpdate);

			// Process available blocks
			return this._process();
		},

		/**
* Finalizes the encryption or decryption process.
* Note that the finalize operation is effectively a destructive, read-once operation.
*
* @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
*
* @return {WordArray} The data after final processing.
*
* @example
*
*     var encrypted = cipher.finalize();
*     var encrypted = cipher.finalize('data');
*     var encrypted = cipher.finalize(wordArray);
*/
		finalize: function (dataUpdate) {
			// Final data update
			if (dataUpdate) {
				this._append(dataUpdate);
			}

			// Perform concrete-cipher logic
			var finalProcessedData = this._doFinalize();

			return finalProcessedData;
		},

		keySize: 128 / 32,

		ivSize: 128 / 32,

		_ENC_XFORM_MODE: 1,

		_DEC_XFORM_MODE: 2,

		/**
* Creates shortcut functions to a cipher's object interface.
*
* @param {Cipher} cipher The cipher to create a helper for.
*
* @return {Object} An object with encrypt and decrypt shortcut functions.
*
* @static
*
* @example
*
*     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
*/
		_createHelper: function () {
			function selectCipherStrategy(key) {
				if (typeof key == 'string') {
					return PasswordBasedCipher;
				} else {
					return SerializableCipher;
				}
			}

			return function (cipher) {
				return {
					encrypt: function (message, key, cfg) {
						return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
					},

					decrypt: function (ciphertext, key, cfg) {
						return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
					}
				};
			};
		}()
	});

	/**
* Abstract base stream cipher template.
*
* @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
*/
	var StreamCipher = C_lib.StreamCipher = Cipher.extend({
		_doFinalize: function () {
			// Process partial blocks
			var finalProcessedBlocks = this._process(!!'flush');

			return finalProcessedBlocks;
		},

		blockSize: 1
	});

	/**
* Mode namespace.
*/
	var C_mode: any = C.mode = {};

	/**
* Abstract base block cipher mode template.
*/
	var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
		/**
* Creates this mode for encryption.
*
* @param {Cipher} cipher A block cipher instance.
* @param {Array} iv The IV words.
*
* @static
*
* @example
*
*     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
*/
		createEncryptor: function (cipher, iv) {
			return this.Encryptor.create(cipher, iv);
		},

		/**
* Creates this mode for decryption.
*
* @param {Cipher} cipher A block cipher instance.
* @param {Array} iv The IV words.
*
* @static
*
* @example
*
*     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
*/
		createDecryptor: function (cipher, iv) {
			return this.Decryptor.create(cipher, iv);
		},

		/**
* Initializes a newly created mode.
*
* @param {Cipher} cipher A block cipher instance.
* @param {Array} iv The IV words.
*
* @example
*
*     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
*/
		init: function (cipher, iv) {
			this._cipher = cipher;
			this._iv = iv;
		}
	});

	/**
* Cipher Block Chaining mode.
*/
	var CBC = C_mode.CBC = function () {
		/**
* Abstract base CBC mode.
*/
		var CBC = BlockCipherMode.extend();

		/**
* CBC encryptor.
*/
		CBC.Encryptor = CBC.extend({
			/**
 * Processes the data block at offset.
 *
 * @param {Array} words The data words to operate on.
 * @param {number} offset The offset where the block starts.
 *
 * @example
 *
 *     mode.processBlock(data.words, offset);
 */
			processBlock: function (words, offset) {
				// Shortcuts
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;

				// XOR and encrypt
				xorBlock.call(this, words, offset, blockSize);
				cipher.encryptBlock(words, offset);

				// Remember this block to use with next block
				this._prevBlock = words.slice(offset, offset + blockSize);
			}
		});

		/**
* CBC decryptor.
*/
		CBC.Decryptor = CBC.extend({
			/**
 * Processes the data block at offset.
 *
 * @param {Array} words The data words to operate on.
 * @param {number} offset The offset where the block starts.
 *
 * @example
 *
 *     mode.processBlock(data.words, offset);
 */
			processBlock: function (words, offset) {
				// Shortcuts
				var cipher = this._cipher;
				var blockSize = cipher.blockSize;

				// Remember this block to use with next block
				var thisBlock = words.slice(offset, offset + blockSize);

				// Decrypt and XOR
				cipher.decryptBlock(words, offset);
				xorBlock.call(this, words, offset, blockSize);

				// This block becomes the previous block
				this._prevBlock = thisBlock;
			}
		});

		function xorBlock(words, offset, blockSize) {
			var block;

			// Shortcut
			var iv = this._iv;

			// Choose mixing block
			if (iv) {
				block = iv;

				// Remove IV for subsequent blocks
				this._iv = undefined;
			} else {
				block = this._prevBlock;
			}

			// XOR blocks
			for (var i = 0; i < blockSize; i++) {
				words[offset + i] ^= block[i];
			}
		}

		return CBC;
	}();

	/**
* Padding namespace.
*/
	var C_pad: any = C.pad = {};

	/**
* PKCS #5/7 padding strategy.
*/
	var Pkcs7 = C_pad.Pkcs7 = {
		/**
* Pads data using the algorithm defined in PKCS #5/7.
*
* @param {WordArray} data The data to pad.
* @param {number} blockSize The multiple that the data should be padded to.
*
* @static
*
* @example
*
*     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
*/
		pad: function (data, blockSize) {
			// Shortcut
			var blockSizeBytes = blockSize * 4;

			// Count padding bytes
			var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

			// Create padding word
			var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;

			// Create padding
			var paddingWords = [];
			for (var i = 0; i < nPaddingBytes; i += 4) {
				paddingWords.push(paddingWord);
			}
			var padding = WordArray.create(paddingWords, nPaddingBytes);

			// Add padding
			data.concat(padding);
		},

		/**
* Unpads data that had been padded using the algorithm defined in PKCS #5/7.
*
* @param {WordArray} data The data to unpad.
*
* @static
*
* @example
*
*     CryptoJS.pad.Pkcs7.unpad(wordArray);
*/
		unpad: function (data) {
			// Get number of padding bytes from last byte
			var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff;

			// Remove padding
			data.sigBytes -= nPaddingBytes;
		}
	};

	/**
* Abstract base block cipher template.
*
* @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
*/
	var BlockCipher = C_lib.BlockCipher = Cipher.extend({
		/**
* Configuration options.
*
* @property {Mode} mode The block mode to use. Default: CBC
* @property {Padding} padding The padding strategy to use. Default: Pkcs7
*/
		cfg: Cipher.cfg.extend({
			mode: CBC,
			padding: Pkcs7
		}),

		reset: function () {
			var modeCreator;

			// Reset cipher
			Cipher.reset.call(this);

			// Shortcuts
			var cfg = this.cfg;
			var iv = cfg.iv;
			var mode = cfg.mode;

			// Reset block mode
			if (this._xformMode == this._ENC_XFORM_MODE) {
				modeCreator = mode.createEncryptor;
			} else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
				modeCreator = mode.createDecryptor;
				// Keep at least one block in the buffer for unpadding
				this._minBufferSize = 1;
			}

			if (this._mode && this._mode.__creator == modeCreator) {
				this._mode.init(this, iv && iv.words);
			} else {
				this._mode = modeCreator.call(mode, this, iv && iv.words);
				this._mode.__creator = modeCreator;
			}
		},

		_doProcessBlock: function (words, offset) {
			this._mode.processBlock(words, offset);
		},

		_doFinalize: function () {
			var finalProcessedBlocks;

			// Shortcut
			var padding = this.cfg.padding;

			// Finalize
			if (this._xformMode == this._ENC_XFORM_MODE) {
				// Pad data
				padding.pad(this._data, this.blockSize);

				// Process final blocks
				finalProcessedBlocks = this._process(!!'flush');
			} else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
				// Process final blocks
				finalProcessedBlocks = this._process(!!'flush');

				// Unpad data
				padding.unpad(finalProcessedBlocks);
			}

			return finalProcessedBlocks;
		},

		blockSize: 128 / 32
	});

	/**
* A collection of cipher parameters.
*
* @property {WordArray} ciphertext The raw ciphertext.
* @property {WordArray} key The key to this ciphertext.
* @property {WordArray} iv The IV used in the ciphering operation.
* @property {WordArray} salt The salt used with a key derivation function.
* @property {Cipher} algorithm The cipher algorithm.
* @property {Mode} mode The block mode used in the ciphering operation.
* @property {Padding} padding The padding scheme used in the ciphering operation.
* @property {number} blockSize The block size of the cipher.
* @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
*/
	var CipherParams = C_lib.CipherParams = Base.extend({
		/**
* Initializes a newly created cipher params object.
*
* @param {Object} cipherParams An object with any of the possible cipher parameters.
*
* @example
*
*     var cipherParams = CryptoJS.lib.CipherParams.create({
*         ciphertext: ciphertextWordArray,
*         key: keyWordArray,
*         iv: ivWordArray,
*         salt: saltWordArray,
*         algorithm: CryptoJS.algo.AES,
*         mode: CryptoJS.mode.CBC,
*         padding: CryptoJS.pad.PKCS7,
*         blockSize: 4,
*         formatter: CryptoJS.format.OpenSSL
*     });
*/
		init: function (cipherParams) {
			this.mixIn(cipherParams);
		},

		/**
* Converts this cipher params object to a string.
*
* @param {Format} formatter (Optional) The formatting strategy to use.
*
* @return {string} The stringified cipher params.
*
* @throws Error If neither the formatter nor the default formatter is set.
*
* @example
*
*     var string = cipherParams + '';
*     var string = cipherParams.toString();
*     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
*/
		toString: function (formatter) {
			return (formatter || this.formatter).stringify(this);
		}
	});

	/**
* Format namespace.
*/
	var C_format: any = C.format = {};

	/**
* OpenSSL formatting strategy.
*/
	var OpenSSLFormatter = C_format.OpenSSL = {
		/**
* Converts a cipher params object to an OpenSSL-compatible string.
*
* @param {CipherParams} cipherParams The cipher params object.
*
* @return {string} The OpenSSL-compatible string.
*
* @static
*
* @example
*
*     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
*/
		stringify: function (cipherParams) {
			var wordArray;

			// Shortcuts
			var ciphertext = cipherParams.ciphertext;
			var salt = cipherParams.salt;

			// Format
			if (salt) {
				wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
			} else {
				wordArray = ciphertext;
			}

			return wordArray.toString(Base64);
		},

		/**
* Converts an OpenSSL-compatible string to a cipher params object.
*
* @param {string} openSSLStr The OpenSSL-compatible string.
*
* @return {CipherParams} The cipher params object.
*
* @static
*
* @example
*
*     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
*/
		parse: function (openSSLStr) {
			var salt;

			// Parse base64
			var ciphertext = Base64.parse(openSSLStr);

			// Shortcut
			var ciphertextWords = ciphertext.words;

			// Test for salt
			if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
				// Extract salt
				salt = WordArray.create(ciphertextWords.slice(2, 4));

				// Remove salt from ciphertext
				ciphertextWords.splice(0, 4);
				ciphertext.sigBytes -= 16;
			}

			return CipherParams.create({ ciphertext: ciphertext, salt: salt });
		}
	};

	/**
* A cipher wrapper that returns ciphertext as a serializable cipher params object.
*/
	var SerializableCipher = C_lib.SerializableCipher = Base.extend({
		/**
* Configuration options.
*
* @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
*/
		cfg: Base.extend({
			format: OpenSSLFormatter
		}),

		/**
* Encrypts a message.
*
* @param {Cipher} cipher The cipher algorithm to use.
* @param {WordArray|string} message The message to encrypt.
* @param {WordArray} key The key.
* @param {Object} cfg (Optional) The configuration options to use for this operation.
*
* @return {CipherParams} A cipher params object.
*
* @static
*
* @example
*
*     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
*     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
*     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
*/
		encrypt: function (cipher, message, key, cfg) {
			// Apply config defaults
			cfg = this.cfg.extend(cfg);

			// Encrypt
			var encryptor = cipher.createEncryptor(key, cfg);
			var ciphertext = encryptor.finalize(message);

			// Shortcut
			var cipherCfg = encryptor.cfg;

			// Create and return serializable cipher params
			return CipherParams.create({
				ciphertext: ciphertext,
				key: key,
				iv: cipherCfg.iv,
				algorithm: cipher,
				mode: cipherCfg.mode,
				padding: cipherCfg.padding,
				blockSize: cipher.blockSize,
				formatter: cfg.format
			});
		},

		/**
* Decrypts serialized ciphertext.
*
* @param {Cipher} cipher The cipher algorithm to use.
* @param {CipherParams|string} ciphertext The ciphertext to decrypt.
* @param {WordArray} key The key.
* @param {Object} cfg (Optional) The configuration options to use for this operation.
*
* @return {WordArray} The plaintext.
*
* @static
*
* @example
*
*     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
*     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
*/
		decrypt: function (cipher, ciphertext, key, cfg) {
			// Apply config defaults
			cfg = this.cfg.extend(cfg);

			// Convert string to CipherParams
			ciphertext = this._parse(ciphertext, cfg.format);

			// Decrypt
			var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

			return plaintext;
		},

		/**
* Converts serialized ciphertext to CipherParams,
* else assumed CipherParams already and returns ciphertext unchanged.
*
* @param {CipherParams|string} ciphertext The ciphertext.
* @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
*
* @return {CipherParams} The unserialized ciphertext.
*
* @static
*
* @example
*
*     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
*/
		_parse: function (ciphertext, format) {
			if (typeof ciphertext == 'string') {
				return format.parse(ciphertext, this);
			} else {
				return ciphertext;
			}
		}
	});

	/**
* Key derivation function namespace.
*/
	var C_kdf: any = C.kdf = {};

	/**
* OpenSSL key derivation function.
*/
	var OpenSSLKdf = C_kdf.OpenSSL = {
		/**
* Derives a key and IV from a password.
*
* @param {string} password The password to derive from.
* @param {number} keySize The size in words of the key to generate.
* @param {number} ivSize The size in words of the IV to generate.
* @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
*
* @return {CipherParams} A cipher params object with the key, IV, and salt.
*
* @static
*
* @example
*
*     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
*     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
*/
		execute: function (password, keySize, ivSize, salt) {
			// Generate random salt
			if (!salt) {
				salt = WordArray.random(64 / 8);
			}

			// Derive key and IV
			var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

			// Separate key and IV
			var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
			key.sigBytes = keySize * 4;

			// Return params
			return CipherParams.create({ key: key, iv: iv, salt: salt });
		}
	};

	/**
* A serializable cipher wrapper that derives the key from a password,
* and returns ciphertext as a serializable cipher params object.
*/
	var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
		/**
* Configuration options.
*
* @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
*/
		cfg: SerializableCipher.cfg.extend({
			kdf: OpenSSLKdf
		}),

		/**
* Encrypts a message using a password.
*
* @param {Cipher} cipher The cipher algorithm to use.
* @param {WordArray|string} message The message to encrypt.
* @param {string} password The password.
* @param {Object} cfg (Optional) The configuration options to use for this operation.
*
* @return {CipherParams} A cipher params object.
*
* @static
*
* @example
*
*     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
*     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
*/
		encrypt: function (cipher, message, password, cfg) {
			// Apply config defaults
			cfg = this.cfg.extend(cfg);

			// Derive key and other params
			var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

			// Add IV to config
			cfg.iv = derivedParams.iv;

			// Encrypt
			var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

			// Mix in derived params
			ciphertext.mixIn(derivedParams);

			return ciphertext;
		},

		/**
* Decrypts serialized ciphertext using a password.
*
* @param {Cipher} cipher The cipher algorithm to use.
* @param {CipherParams|string} ciphertext The ciphertext to decrypt.
* @param {string} password The password.
* @param {Object} cfg (Optional) The configuration options to use for this operation.
*
* @return {WordArray} The plaintext.
*
* @static
*
* @example
*
*     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
*     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
*/
		decrypt: function (cipher, ciphertext, password, cfg) {
			// Apply config defaults
			cfg = this.cfg.extend(cfg);

			// Convert string to CipherParams
			ciphertext = this._parse(ciphertext, cfg.format);

			// Derive key and other params
			var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

			// Add IV to config
			cfg.iv = derivedParams.iv;

			// Decrypt
			var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

			return plaintext;
		}
	});
}();

(function () {
	// Check if typed arrays are supported
	if (typeof ArrayBuffer != 'function') {
		return;
	}

	// Shortcuts
	var C = CryptoJS;
	var C_lib = C.lib;
	var WordArray = C_lib.WordArray;

	// Reference original init
	var superInit = WordArray.init;

	// Augment WordArray.init to handle typed arrays
	var subInit = WordArray.init = function (typedArray) {
		// Convert buffers to uint8
		if (typedArray instanceof ArrayBuffer) {
			typedArray = new Uint8Array(typedArray);
		}

		// Convert other array views to uint8
		if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
			typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
		}

		// Handle Uint8Array
		if (typedArray instanceof Uint8Array) {
			// Shortcut
			var typedArrayByteLength = typedArray.byteLength;

			// Extract bytes
			var words = [];
			for (var i = 0; i < typedArrayByteLength; i++) {
				words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
			}

			// Initialize this word array
			superInit.call(this, words, typedArrayByteLength);
		} else {
			// Else call normal init
			superInit.apply(this, arguments);
		}
	};

	subInit.prototype = WordArray;
})();

/**
* A noop padding strategy.
*/
CryptoJS.pad.NoPadding = {
	pad: function () { },

	unpad: function () { }
};

(function () {
	// Shortcuts
	var C = CryptoJS;
	var C_lib = C.lib;
	var WordArray = C_lib.WordArray;
	var C_enc = C.enc;

	/**
* Base64 encoding strategy.
*/
	var Base64 = C_enc.Base64 = {
		/**
* Converts a word array to a Base64 string.
*
* @param {WordArray} wordArray The word array.
*
* @return {string} The Base64 string.
*
* @static
*
* @example
*
*     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
*/
		stringify: function (wordArray) {
			// Shortcuts
			var words = wordArray.words;
			var sigBytes = wordArray.sigBytes;
			var map = this._map;

			// Clamp excess bits
			wordArray.clamp();

			// Convert
			var base64Chars = [];
			for (var i = 0; i < sigBytes; i += 3) {
				var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
				var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 0xff;
				var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 0xff;

				var triplet = byte1 << 16 | byte2 << 8 | byte3;

				for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
					base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 0x3f));
				}
			}

			// Add padding
			var paddingChar = map.charAt(64);
			if (paddingChar) {
				while (base64Chars.length % 4) {
					base64Chars.push(paddingChar);
				}
			}

			return base64Chars.join('');
		},

		/**
* Converts a Base64 string to a word array.
*
* @param {string} base64Str The Base64 string.
*
* @return {WordArray} The word array.
*
* @static
*
* @example
*
*     var wordArray = CryptoJS.enc.Base64.parse(base64String);
*/
		parse: function (base64Str) {
			// Shortcuts
			var base64StrLength = base64Str.length;
			var map = this._map;
			var reverseMap = this._reverseMap;

			if (!reverseMap) {
				reverseMap = this._reverseMap = [];
				for (var j = 0; j < map.length; j++) {
					reverseMap[map.charCodeAt(j)] = j;
				}
			}

			// Ignore padding
			var paddingChar = map.charAt(64);
			if (paddingChar) {
				var paddingIndex = base64Str.indexOf(paddingChar);
				if (paddingIndex !== -1) {
					base64StrLength = paddingIndex;
				}
			}

			// Convert
			return parseLoop(base64Str, base64StrLength, reverseMap);
		},

		_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	};

	function parseLoop(base64Str, base64StrLength, reverseMap) {
		var words = [];
		var nBytes = 0;
		for (var i = 0; i < base64StrLength; i++) {
			if (i % 4) {
				var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
				var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
				var bitsCombined = bits1 | bits2;
				words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
				nBytes++;
			}
		}
		return WordArray.create(words, nBytes);
	}
})();

(function () {
	// Shortcuts
	var C = CryptoJS;
	var C_lib = C.lib;
	var Base = C_lib.Base;
	var WordArray = C_lib.WordArray;
	var C_algo = C.algo;
	var MD5 = C_algo.MD5;

	/**
* This key derivation function is meant to conform with EVP_BytesToKey.
* www.openssl.org/docs/crypto/EVP_BytesToKey.html
*/
	var EvpKDF = C_algo.EvpKDF = Base.extend({
		/**
* Configuration options.
*
* @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
* @property {Hasher} hasher The hash algorithm to use. Default: MD5
* @property {number} iterations The number of iterations to perform. Default: 1
*/
		cfg: Base.extend({
			keySize: 128 / 32,
			hasher: MD5,
			iterations: 1
		}),

		/**
* Initializes a newly created key derivation function.
*
* @param {Object} cfg (Optional) The configuration options to use for the derivation.
*
* @example
*
*     var kdf = CryptoJS.algo.EvpKDF.create();
*     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
*     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
*/
		init: function (cfg) {
			this.cfg = this.cfg.extend(cfg);
		},

		/**
* Derives a key from a password.
*
* @param {WordArray|string} password The password.
* @param {WordArray|string} salt A salt.
*
* @return {WordArray} The derived key.
*
* @example
*
*     var key = kdf.compute(password, salt);
*/
		compute: function (password, salt) {
			var block;

			// Shortcut
			var cfg = this.cfg;

			// Init hasher
			var hasher = cfg.hasher.create();

			// Initial values
			var derivedKey = WordArray.create();

			// Shortcuts
			var derivedKeyWords = derivedKey.words;
			var keySize = cfg.keySize;
			var iterations = cfg.iterations;

			// Generate key
			while (derivedKeyWords.length < keySize) {
				if (block) {
					hasher.update(block);
				}
				block = hasher.update(password).finalize(salt);
				hasher.reset();

				// Iterations
				for (var i = 1; i < iterations; i++) {
					block = hasher.finalize(block);
					hasher.reset();
				}

				derivedKey.concat(block);
			}
			derivedKey.sigBytes = keySize * 4;

			return derivedKey;
		}
	});

	/**
* Derives a key from a password.
*
* @param {WordArray|string} password The password.
* @param {WordArray|string} salt A salt.
* @param {Object} cfg (Optional) The configuration options to use for this computation.
*
* @return {WordArray} The derived key.
*
* @static
*
* @example
*
*     var key = CryptoJS.EvpKDF(password, salt);
*     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
*     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
*/
	C.EvpKDF = function (password, salt, cfg) {
		return EvpKDF.create(cfg).compute(password, salt);
	};
})();

(function () {
	// Shortcuts
	var C = CryptoJS;
	var C_lib = C.lib;
	var BlockCipher = C_lib.BlockCipher;
	var C_algo = C.algo;

	// Lookup tables
	var SBOX = [];
	var INV_SBOX = [];
	var SUB_MIX_0 = [];
	var SUB_MIX_1 = [];
	var SUB_MIX_2 = [];
	var SUB_MIX_3 = [];
	var INV_SUB_MIX_0 = [];
	var INV_SUB_MIX_1 = [];
	var INV_SUB_MIX_2 = [];
	var INV_SUB_MIX_3 = [];

	// Compute lookup tables
	(function () {
		// Compute double table
		var d = [];
		for (var i = 0; i < 256; i++) {
			if (i < 128) {
				d[i] = i << 1;
			} else {
				d[i] = i << 1 ^ 0x11b;
			}
		}

		// Walk GF(2^8)
		var x = 0;
		var xi = 0;
		for (var i = 0; i < 256; i++) {
			// Compute sbox
			var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
			sx = sx >>> 8 ^ sx & 0xff ^ 0x63;
			SBOX[x] = sx;
			INV_SBOX[sx] = x;

			// Compute multiplication
			var x2 = d[x];
			var x4 = d[x2];
			var x8 = d[x4];

			// Compute sub bytes, mix columns tables
			var t = d[sx] * 0x101 ^ sx * 0x1010100;
			SUB_MIX_0[x] = t << 24 | t >>> 8;
			SUB_MIX_1[x] = t << 16 | t >>> 16;
			SUB_MIX_2[x] = t << 8 | t >>> 24;
			SUB_MIX_3[x] = t;

			// Compute inv sub bytes, inv mix columns tables
			var t = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
			INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
			INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
			INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
			INV_SUB_MIX_3[sx] = t;

			// Compute next counter
			if (!x) {
				x = xi = 1;
			} else {
				x = x2 ^ d[d[d[x8 ^ x2]]];
				xi ^= d[d[xi]];
			}
		}
	})();

	// Precomputed Rcon lookup
	var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

	/**
* AES block cipher algorithm.
*/
	var AES = C_algo.AES = BlockCipher.extend({
		_doReset: function () {
			var t;

			// Skip reset of nRounds has been set before and key did not change
			if (this._nRounds && this._keyPriorReset === this._key) {
				return;
			}

			// Shortcuts
			var key = this._keyPriorReset = this._key;
			var keyWords = key.words;
			var keySize = key.sigBytes / 4;

			// Compute number of rounds
			var nRounds = this._nRounds = keySize + 6;

			// Compute number of key schedule rows
			var ksRows = (nRounds + 1) * 4;

			// Compute key schedule
			var keySchedule = this._keySchedule = [];
			for (var ksRow = 0; ksRow < ksRows; ksRow++) {
				if (ksRow < keySize) {
					keySchedule[ksRow] = keyWords[ksRow];
				} else {
					t = keySchedule[ksRow - 1];

					if (!(ksRow % keySize)) {
						// Rot word
						t = t << 8 | t >>> 24;

						// Sub word
						t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff];

						// Mix Rcon
						t ^= RCON[ksRow / keySize | 0] << 24;
					} else if (keySize > 6 && ksRow % keySize == 4) {
						// Sub word
						t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff];
					}

					keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
				}
			}

			// Compute inv key schedule
			var invKeySchedule = this._invKeySchedule = [];
			for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
				var ksRow = ksRows - invKsRow;

				if (invKsRow % 4) {
					var t = keySchedule[ksRow];
				} else {
					var t = keySchedule[ksRow - 4];
				}

				if (invKsRow < 4 || ksRow <= 4) {
					invKeySchedule[invKsRow] = t;
				} else {
					invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 0xff]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
				}
			}
		},

		encryptBlock: function (M, offset) {
			this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
		},

		decryptBlock: function (M, offset) {
			// Swap 2nd and 4th rows
			var t = M[offset + 1];
			M[offset + 1] = M[offset + 3];
			M[offset + 3] = t;

			this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

			// Inv swap 2nd and 4th rows
			var t = M[offset + 1];
			M[offset + 1] = M[offset + 3];
			M[offset + 3] = t;
		},

		_doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
			// Shortcut
			var nRounds = this._nRounds;

			// Get input, add round key
			var s0 = M[offset] ^ keySchedule[0];
			var s1 = M[offset + 1] ^ keySchedule[1];
			var s2 = M[offset + 2] ^ keySchedule[2];
			var s3 = M[offset + 3] ^ keySchedule[3];

			// Key schedule row counter
			var ksRow = 4;

			// Rounds
			for (var round = 1; round < nRounds; round++) {
				// Shift rows, sub bytes, mix columns, add round key
				var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[s1 >>> 16 & 0xff] ^ SUB_MIX_2[s2 >>> 8 & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
				var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[s2 >>> 16 & 0xff] ^ SUB_MIX_2[s3 >>> 8 & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
				var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[s3 >>> 16 & 0xff] ^ SUB_MIX_2[s0 >>> 8 & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
				var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[s0 >>> 16 & 0xff] ^ SUB_MIX_2[s1 >>> 8 & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

				// Update state
				s0 = t0;
				s1 = t1;
				s2 = t2;
				s3 = t3;
			}

			// Shift rows, sub bytes, add round key
			var t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 0xff] << 16 | SBOX[s2 >>> 8 & 0xff] << 8 | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
			var t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 0xff] << 16 | SBOX[s3 >>> 8 & 0xff] << 8 | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
			var t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 0xff] << 16 | SBOX[s0 >>> 8 & 0xff] << 8 | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
			var t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 0xff] << 16 | SBOX[s1 >>> 8 & 0xff] << 8 | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

			// Set output
			M[offset] = t0;
			M[offset + 1] = t1;
			M[offset + 2] = t2;
			M[offset + 3] = t3;
		},

		keySize: 256 / 32
	});

	/**
* Shortcut functions to the cipher's object interface.
*
* @example
*
*     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
*     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
*/
	C.AES = BlockCipher._createHelper(AES);
})();

(function () {
	// Shortcuts
	var C = CryptoJS;
	var C_lib = C.lib;
	var StreamCipher = C_lib.StreamCipher;
	var C_algo = C.algo;

	/**
* RC4 stream cipher algorithm.
*/
	var RC4 = C_algo.RC4 = StreamCipher.extend({
		_doReset: function () {
			// Shortcuts
			var key = this._key;
			var keyWords = key.words;
			var keySigBytes = key.sigBytes;

			// Init sbox
			var S = this._S = [];
			for (var i = 0; i < 256; i++) {
				S[i] = i;
			}

			// Key setup
			for (var i = 0, j = 0; i < 256; i++) {
				var keyByteIndex = i % keySigBytes;
				var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 0xff;

				j = (j + S[i] + keyByte) % 256;

				// Swap
				var t = S[i];
				S[i] = S[j];
				S[j] = t;
			}

			// Counters
			this._i = this._j = 0;
		},

		_doProcessBlock: function (M, offset) {
			M[offset] ^= generateKeystreamWord.call(this);
		},

		keySize: 256 / 32,

		ivSize: 0
	});

	function generateKeystreamWord() {
		// Shortcuts
		var S = this._S;
		var i = this._i;
		var j = this._j;

		// Generate keystream word
		var keystreamWord = 0;
		for (var n = 0; n < 4; n++) {
			i = (i + 1) % 256;
			j = (j + S[i]) % 256;

			// Swap
			var t = S[i];
			S[i] = S[j];
			S[j] = t;

			keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
		}

		// Update counters
		this._i = i;
		this._j = j;

		return keystreamWord;
	}

	/**
* Shortcut functions to the cipher's object interface.
*
* @example
*
*     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
*     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
*/
	C.RC4 = StreamCipher._createHelper(RC4);

	/**
* Modified RC4 stream cipher algorithm.
*/
	var RC4Drop = C_algo.RC4Drop = RC4.extend({
		/**
* Configuration options.
*
* @property {number} drop The number of keystream words to drop. Default 192
*/
		cfg: RC4.cfg.extend({
			drop: 192
		}),

		_doReset: function () {
			RC4._doReset.call(this);

			// Drop
			for (var i = this.cfg.drop; i > 0; i--) {
				generateKeystreamWord.call(this);
			}
		}
	});

	/**
* Shortcut functions to the cipher's object interface.
*
* @example
*
*     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
*     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
*/
	C.RC4Drop = StreamCipher._createHelper(RC4Drop);
})();

/**
* Electronic Codebook block mode.
*/
CryptoJS.mode.ECB = function () {
	var ECB = CryptoJS.lib.BlockCipherMode.extend();

	ECB.Encryptor = ECB.extend({
		processBlock: function (words, offset) {
			this._cipher.encryptBlock(words, offset);
		}
	});

	ECB.Decryptor = ECB.extend({
		processBlock: function (words, offset) {
			this._cipher.decryptBlock(words, offset);
		}
	});

	return ECB;
}();

    }
    


    module wijmo.pdf.security {
    

/*
   PDFSecurity - represents PDF security settings
   By Yang Liu <hi@zesik.com>
 */





export class _PDFSecurity {
  static generateFileID(info: any = {}) {
    let infoStr = `${info.CreationDate.getTime()}\n`;

    for (let key in info) {
      if (!info.hasOwnProperty(key)) {
        continue;
      }
      infoStr += `${key}: ${info[key]}\n`;
    }

    return wordArrayToBuffer(CryptoJS.MD5(infoStr));
  }

  static generateRandomWordArray(bytes) {
    return CryptoJS.lib.WordArray.random(bytes);
  }

  static create(document, options: any = {}) {
    if (!options.ownerPassword && !options.userPassword) {
      return null;
    }
    return new _PDFSecurity(document, options);
  }

  private document: any;
  private version: number;
  private dictionary: any;
  private keyBits: number;
  private encryptionKey: any;

  constructor(document, options: any = {}) {
    if (!options.ownerPassword && !options.userPassword) {
      throw new Error('None of owner password and user password is defined.');
    }

    this.document = document;
    this._setupEncryption(options);
  }

  _setupEncryption(options) {
    switch (options.pdfVersion) {
      case '1.4':
      case '1.5':
        this.version = 2;
        break;
      case '1.6':
      case '1.7':
        this.version = 4;
        break;
      case '1.7ext3':
        this.version = 5;
        break;
      default:
        this.version = 1;
        break;
    }

    const encDict = {
      Filter: 'Standard'
    };

    switch (this.version) {
      case 1:
      case 2:
      case 4:
        this._setupEncryptionV1V2V4(this.version, encDict, options);
        break;
      case 5:
        this._setupEncryptionV5(encDict, options);
        break;
    }

    this.dictionary = this.document.ref(encDict);
  }

  _setupEncryptionV1V2V4(v, encDict, options) {
    let r, permissions;
    switch (v) {
      case 1:
        r = 2;
        this.keyBits = 40;
        permissions = getPermissionsR2(options.permissions);
        break;
      case 2:
        r = 3;
        this.keyBits = 128;
        permissions = getPermissionsR3(options.permissions);
        break;
      case 4:
        r = 4;
        this.keyBits = 128;
        permissions = getPermissionsR3(options.permissions);
        break;
    }

    const paddedUserPassword = processPasswordR2R3R4(options.userPassword);
    const paddedOwnerPassword = options.ownerPassword
      ? processPasswordR2R3R4(options.ownerPassword)
      : paddedUserPassword;

    const ownerPasswordEntry = getOwnerPasswordR2R3R4(
      r,
      this.keyBits,
      paddedUserPassword,
      paddedOwnerPassword
    );
    this.encryptionKey = getEncryptionKeyR2R3R4(
      r,
      this.keyBits,
      this.document._id,
      paddedUserPassword,
      ownerPasswordEntry,
      permissions
    );
    let userPasswordEntry;
    if (r === 2) {
      userPasswordEntry = getUserPasswordR2(this.encryptionKey);
    } else {
      userPasswordEntry = getUserPasswordR3R4(
        this.document._id,
        this.encryptionKey
      );
    }

    encDict.V = v;
    if (v >= 2) {
      encDict.Length = this.keyBits;
    }
    if (v === 4) {
      encDict.CF = {
        StdCF: {
          AuthEvent: 'DocOpen',
          CFM: 'AESV2',
          Length: this.keyBits / 8
        }
      };
      encDict.StmF = 'StdCF';
      encDict.StrF = 'StdCF';
    }
    encDict.R = r;
    encDict.O = wordArrayToBuffer(ownerPasswordEntry);
    encDict.U = wordArrayToBuffer(userPasswordEntry);
    encDict.P = permissions;
  }

  _setupEncryptionV5(encDict, options) {
    this.keyBits = 256;
    const permissions = getPermissionsR3(options.permissions);

    const processedUserPassword = processPasswordR5(options.userPassword);
    const processedOwnerPassword = options.ownerPassword
      ? processPasswordR5(options.ownerPassword)
      : processedUserPassword;

    this.encryptionKey = getEncryptionKeyR5(
      _PDFSecurity.generateRandomWordArray
    );
    const userPasswordEntry = getUserPasswordR5(
      processedUserPassword,
      _PDFSecurity.generateRandomWordArray
    );
    const userKeySalt = CryptoJS.lib.WordArray.create(
      userPasswordEntry.words.slice(10, 12),
      8
    );
    const userEncryptionKeyEntry = getUserEncryptionKeyR5(
      processedUserPassword,
      userKeySalt,
      this.encryptionKey
    );
    const ownerPasswordEntry = getOwnerPasswordR5(
      processedOwnerPassword,
      userPasswordEntry,
      _PDFSecurity.generateRandomWordArray
    );
    const ownerKeySalt = CryptoJS.lib.WordArray.create(
      ownerPasswordEntry.words.slice(10, 12),
      8
    );
    const ownerEncryptionKeyEntry = getOwnerEncryptionKeyR5(
      processedOwnerPassword,
      ownerKeySalt,
      userPasswordEntry,
      this.encryptionKey
    );
    const permsEntry = getEncryptedPermissionsR5(
      permissions,
      this.encryptionKey,
      _PDFSecurity.generateRandomWordArray
    );

    encDict.V = 5;
    encDict.Length = this.keyBits;
    encDict.CF = {
      StdCF: {
        AuthEvent: 'DocOpen',
        CFM: 'AESV3',
        Length: this.keyBits / 8
      }
    };
    encDict.StmF = 'StdCF';
    encDict.StrF = 'StdCF';
    encDict.R = 5;
    encDict.O = wordArrayToBuffer(ownerPasswordEntry);
    encDict.OE = wordArrayToBuffer(ownerEncryptionKeyEntry);
    encDict.U = wordArrayToBuffer(userPasswordEntry);
    encDict.UE = wordArrayToBuffer(userEncryptionKeyEntry);
    encDict.P = permissions;
    encDict.Perms = wordArrayToBuffer(permsEntry);
  }

  getEncryptFn(obj, gen) {
    let digest;
    if (this.version < 5) {
      digest = this.encryptionKey
        .clone()
        .concat(
          CryptoJS.lib.WordArray.create(
            [
              ((obj & 0xff) << 24) |
                ((obj & 0xff00) << 8) |
                ((obj >> 8) & 0xff00) |
                (gen & 0xff),
              (gen & 0xff00) << 16
            ],
            5
          )
        );
    }

    if (this.version === 1 || this.version === 2) {
      let key = CryptoJS.MD5(digest);
      key.sigBytes = Math.min(16, this.keyBits / 8 + 5);
      return buffer =>
        wordArrayToBuffer(
          CryptoJS.RC4.encrypt(CryptoJS.lib.WordArray.create(buffer), key)
            .ciphertext
        );
    }

    let key;
    if (this.version === 4) {
      key = CryptoJS.MD5(
        digest.concat(CryptoJS.lib.WordArray.create([0x73416c54], 4))
      );
    } else {
      key = this.encryptionKey;
    }

    const iv = _PDFSecurity.generateRandomWordArray(16);
    const options = {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv
    };

    return buffer =>
      wordArrayToBuffer(
        iv
          .clone()
          .concat(
            CryptoJS.AES.encrypt(
              CryptoJS.lib.WordArray.create(buffer),
              key,
              options
            ).ciphertext
          )
      );
  }

  end() {
    this.dictionary.end();
  }
}

function getPermissionsR2(permissionObject: any = {}) {
  let permissions = 0xffffffc0 >> 0;
  if (permissionObject.printing) {
    permissions |= 0b000000000100;
  }
  if (permissionObject.modifying) {
    permissions |= 0b000000001000;
  }
  if (permissionObject.copying) {
    permissions |= 0b000000010000;
  }
  if (permissionObject.annotating) {
    permissions |= 0b000000100000;
  }
  return permissions;
}

function getPermissionsR3(permissionObject: any = {}) {
  let permissions = 0xfffff0c0 >> 0;
  if (permissionObject.printing === 'lowResolution') {
    permissions |= 0b000000000100;
  }
  if (permissionObject.printing === 'highResolution') {
    permissions |= 0b100000000100;
  }
  if (permissionObject.modifying) {
    permissions |= 0b000000001000;
  }
  if (permissionObject.copying) {
    permissions |= 0b000000010000;
  }
  if (permissionObject.annotating) {
    permissions |= 0b000000100000;
  }
  if (permissionObject.fillingForms) {
    permissions |= 0b000100000000;
  }
  if (permissionObject.contentAccessibility) {
    permissions |= 0b001000000000;
  }
  if (permissionObject.documentAssembly) {
    permissions |= 0b010000000000;
  }
  return permissions;
}

function getUserPasswordR2(encryptionKey) {
  return CryptoJS.RC4.encrypt(processPasswordR2R3R4(), encryptionKey)
    .ciphertext;
}

function getUserPasswordR3R4(documentId, encryptionKey) {
  const key = encryptionKey.clone();
  let cipher = CryptoJS.MD5(
    processPasswordR2R3R4().concat(CryptoJS.lib.WordArray.create(documentId))
  );
  for (let i = 0; i < 20; i++) {
    const xorRound = Math.ceil(key.sigBytes / 4);
    for (let j = 0; j < xorRound; j++) {
      key.words[j] =
        encryptionKey.words[j] ^ (i | (i << 8) | (i << 16) | (i << 24));
    }
    cipher = CryptoJS.RC4.encrypt(cipher, key).ciphertext;
  }
  return cipher.concat(CryptoJS.lib.WordArray.create(null, 16));
}

function getOwnerPasswordR2R3R4(
  r,
  keyBits,
  paddedUserPassword,
  paddedOwnerPassword
) {
  let digest = paddedOwnerPassword;
  let round = r >= 3 ? 51 : 1;
  for (let i = 0; i < round; i++) {
    digest = CryptoJS.MD5(digest);
  }

  const key = digest.clone();
  key.sigBytes = keyBits / 8;
  let cipher = paddedUserPassword;
  round = r >= 3 ? 20 : 1;
  for (let i = 0; i < round; i++) {
    const xorRound = Math.ceil(key.sigBytes / 4);
    for (let j = 0; j < xorRound; j++) {
      key.words[j] = digest.words[j] ^ (i | (i << 8) | (i << 16) | (i << 24));
    }
    cipher = CryptoJS.RC4.encrypt(cipher, key).ciphertext;
  }
  return cipher;
}

function getEncryptionKeyR2R3R4(
  r,
  keyBits,
  documentId,
  paddedUserPassword,
  ownerPasswordEntry,
  permissions
) {
  let key = paddedUserPassword
    .clone()
    .concat(ownerPasswordEntry)
    .concat(CryptoJS.lib.WordArray.create([lsbFirstWord(permissions)], 4))
    .concat(CryptoJS.lib.WordArray.create(documentId));
  const round = r >= 3 ? 51 : 1;
  for (let i = 0; i < round; i++) {
    key = CryptoJS.MD5(key);
    key.sigBytes = keyBits / 8;
  }
  return key;
}

function getUserPasswordR5(processedUserPassword, generateRandomWordArray) {
  const validationSalt = generateRandomWordArray(8);
  const keySalt = generateRandomWordArray(8);
  return CryptoJS.SHA256(processedUserPassword.clone().concat(validationSalt))
    .concat(validationSalt)
    .concat(keySalt);
}

function getUserEncryptionKeyR5(
  processedUserPassword,
  userKeySalt,
  encryptionKey
) {
  const key = CryptoJS.SHA256(
    processedUserPassword.clone().concat(userKeySalt)
  );
  const options = {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.NoPadding,
    iv: CryptoJS.lib.WordArray.create(null, 16)
  };
  return CryptoJS.AES.encrypt(encryptionKey, key, options).ciphertext;
}

function getOwnerPasswordR5(
  processedOwnerPassword,
  userPasswordEntry,
  generateRandomWordArray
) {
  const validationSalt = generateRandomWordArray(8);
  const keySalt = generateRandomWordArray(8);
  return CryptoJS.SHA256(
    processedOwnerPassword
      .clone()
      .concat(validationSalt)
      .concat(userPasswordEntry)
  )
    .concat(validationSalt)
    .concat(keySalt);
}

function getOwnerEncryptionKeyR5(
  processedOwnerPassword,
  ownerKeySalt,
  userPasswordEntry,
  encryptionKey
) {
  const key = CryptoJS.SHA256(
    processedOwnerPassword
      .clone()
      .concat(ownerKeySalt)
      .concat(userPasswordEntry)
  );
  const options = {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.NoPadding,
    iv: CryptoJS.lib.WordArray.create(null, 16)
  };
  return CryptoJS.AES.encrypt(encryptionKey, key, options).ciphertext;
}

function getEncryptionKeyR5(generateRandomWordArray) {
  return generateRandomWordArray(32);
}

function getEncryptedPermissionsR5(
  permissions,
  encryptionKey,
  generateRandomWordArray
) {
  const cipher = CryptoJS.lib.WordArray.create(
    [lsbFirstWord(permissions), 0xffffffff, 0x54616462],
    12
  ).concat(generateRandomWordArray(4));
  const options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding
  };
  return CryptoJS.AES.encrypt(cipher, encryptionKey, options).ciphertext;
}

function processPasswordR2R3R4(password = '') {
  const out = new Buffer(32);
  const length = password.length;
  let index = 0;
  while (index < length && index < 32) {
    const code = password.charCodeAt(index);
    if (code > 0xff) {
      throw new Error('Password contains one or more invalid characters.');
    }
    out[index] = code;
    index++;
  }
  while (index < 32) {
    out[index] = PASSWORD_PADDING[index - length];
    index++;
  }
  return CryptoJS.lib.WordArray.create(out);
}

function processPasswordR5(password = '') {
  password = unescape(encodeURIComponent(saslprep(password)));
  const length = Math.min(127, password.length);
  const out = new Buffer(length);

  for (let i = 0; i < length; i++) {
    out[i] = password.charCodeAt(i);
  }

  return CryptoJS.lib.WordArray.create(out);
}

function lsbFirstWord(data) {
  return (
    ((data & 0xff) << 24) |
    ((data & 0xff00) << 8) |
    ((data >> 8) & 0xff00) |
    ((data >> 24) & 0xff)
  );
}

function wordArrayToBuffer(wordArray) {
  const byteArray = [];
  for (let i = 0; i < wordArray.sigBytes; i++) {
    byteArray.push(
      (wordArray.words[Math.floor(i / 4)] >> (8 * (3 - (i % 4)))) & 0xff
    );
  }
  return (<any>Buffer).from(byteArray);
}

const PASSWORD_PADDING = [
  0x28,
  0xbf,
  0x4e,
  0x5e,
  0x4e,
  0x75,
  0x8a,
  0x41,
  0x64,
  0x00,
  0x4e,
  0x56,
  0xff,
  0xfa,
  0x01,
  0x08,
  0x2e,
  0x2e,
  0x00,
  0xb6,
  0xd0,
  0x68,
  0x3e,
  0x80,
  0x2f,
  0x0c,
  0xa9,
  0xfe,
  0x64,
  0x53,
  0x69,
  0x7a
];
    }
    


    module wijmo.pdf.security {
    

wijmo._registerModule('wijmo.pdf.security', wijmo.pdf.security);


    }
    