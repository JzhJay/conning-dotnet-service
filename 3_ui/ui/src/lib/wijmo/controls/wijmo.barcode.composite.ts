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


    module wijmo.barcode.composite {
    /**
 * Structured append optional fields. Currently only supports segmentCount.
 */
export interface IOptionalFields {
    /** 
     * Indicates whether the segment count field is used.
     * The segment count field (identifying the total number of Structured Append symbols 
     * in the distributed file) can contain values from 1 to 99 999 and shall be encoded as two codewords. If the optional
     * segment count field is used, that field shall appear in every segment.
     * 
     * The default value for this property is <b>true</b>.
    */
    segmentCount?: boolean;
}
    }
    


    module wijmo.barcode.composite {
    

export class ISO646Encoder {
    static Table = {
        '!': '11101000',
        '"': '11101001',
        '%': '11101010',
        '&': '11101011',
        '\'': '11101100',
        '(': '11101101',
        ')': '11101110',
        '*': '11101111',
        '+': '11110000',
        ',': '11110001',
        '-': '11110010',
        '.': '11110011',
        '/': '11110100',
        ':': '11110101',
        ';': '11110110',
        '<': '11110111',
        '=': '11111000',
        '>': '11111001',
        '?': '11111010',
        '_': '11111011',
        ' ': '11111100',
        'FNC1NumericLatch': '01111',
        'NumericLatch': '000',
        'AlphanumericLatch': '00100',
    };
    static ISO646 = 'abcdefghijklmnopqrstuvwxyz!"%&\'()+:;<=>?_ ';
    static isISO646Only(str) {
        return ISO646Encoder.ISO646.indexOf(str) > -1;
    }

    protected bitBuffer: any;
    constructor (bitBuffer) {
        this.bitBuffer = bitBuffer;
    }

    encode(char) {
        let result = ISO646Encoder.Table[char];

        if (!result) {
            const code = char.charCodeAt(0);
            if (code >= 48 && code <= 57) {
                this.bitBuffer.put(code - 43, 5);
            } else if (char >= 'A' && char <= 'Z') {
                this.bitBuffer.put(code - 1, 7);
            } else if (char >= 'a' && char <= 'z') {
                this.bitBuffer.put(code - 7, 7);
            } else {
                throw new wijmo.barcode.InvalidCharacterException(char);
            }
        } else {
            this.bitBuffer.putBits(result);
        }
    }

    FNC1NumericLatch() {
        this.bitBuffer.putBits(ISO646Encoder.Table.FNC1NumericLatch);
    }

    NumericLatch() {
        this.bitBuffer.putBits(ISO646Encoder.Table.NumericLatch);
    }

    AlphanumericLatch() {
        this.bitBuffer.putBits(ISO646Encoder.Table.AlphanumericLatch);
    }
}
    }
    


    module wijmo.barcode.composite {
    

export class AlphanumericEncoder {
    static Table = {
        '*': '111010',
        ',': '111011',
        '-': '111100',
        '.': '111101',
        '/': '111110',
        'FNC1NumericLatch': '01111',
        'NumericLatch': '000',
        'ISO646Latch': '00100',
    };
    static isUpperCase (char) {
        return char >= 'A' && char <= 'Z';
    }
    static isLowerCase (char) {
        return char >= 'a' && char <= 'z';
    }

    private bitBuffer: any;

    constructor (bitBuffer) {
        this.bitBuffer = bitBuffer;
    }

    encode(char) {
        let result = AlphanumericEncoder.Table[char];

        if (!result) {
            const code = char.charCodeAt(0);
            if (code >= 48 && code <= 57) {
                this.bitBuffer.put(code - 43, 5);
            } else if (AlphanumericEncoder.isUpperCase(char)) {
                this.bitBuffer.put(code - 33, 6);
            } else {
                throw new wijmo.barcode.InvalidCharacterException(char);
            }
        } else {
            this.bitBuffer.putBits(result);
        }
    }

    FNC1NumericLatch() {
        this.bitBuffer.putBits(AlphanumericEncoder.Table.FNC1NumericLatch);
    }

    NumericLatch() {
        this.bitBuffer.putBits(AlphanumericEncoder.Table.NumericLatch);
    }

    ISO646Latch() {
        this.bitBuffer.putBits(AlphanumericEncoder.Table.ISO646Latch);
    }
}
    }
    


    module wijmo.barcode.composite {
    

export class NumericEncoder {
    static isNumericOrFNC1(char) {
        const code = char.charCodeAt(0);
        return char === wijmo.barcode.Constants.FNC1 || (code >= 48 && code <= 57);
    }

    static isNumeric(char) {
        const code = char.charCodeAt(0);
        return code >= 48 && code <= 57;
    }

    protected bitBuffer: any;
    constructor (bitBuffer) {
        this.bitBuffer = bitBuffer;
    }

    encode(char1, char2) {
        let d1, d2;
        if (char1 === wijmo.barcode.Constants.FNC1) {
            d1 = 10;
        } else {
            d1 = char1.charCodeAt(0) - 48;
        }
        if (char2 === wijmo.barcode.Constants.FNC1) {
            d2 = 10;
        } else {
            d2 = char2.charCodeAt(0) - 48;
        }
        
        const value = 11 * d1 + d2 + 8;
        this.bitBuffer.put(value, 7);
    }

    encodeOne(char) {
        let d;
        if (char === wijmo.barcode.Constants.FNC1) {
            d = 10;
        } else {
            d = char.charCodeAt(0) - 48 + 1;
        }
        this.bitBuffer.put(d, 4);
    }

    AlphanumericLatch() {
        this.bitBuffer.put(0, 4);
    }
}
    }
    


    module wijmo.barcode.composite {
    




export class GS1GeneralPurposeDataEncodation {
    static EncodeMod = {
        Numeric: 'Numeric',
        Alphanumeric: 'Alphanumeric',
        ISO646: 'ISO646',
    };
    private text: any;
    protected mode: any;
    protected bitBuffer: any;
    private needExtraPadding: any;
    constructor(bitBuffer, needExtraPadding = false) {
        this.text = '';
        this.mode = GS1GeneralPurposeDataEncodation.EncodeMod.Numeric;
        this.bitBuffer = bitBuffer;
        this.needExtraPadding = needExtraPadding;
    }

    encodeGeneralData(str) {
        if (!str) {
            return;
        }
        const { bitBuffer } = this;
        let mode = GS1GeneralPurposeDataEncodation.EncodeMod.Numeric;
        for (let remain = str.length, pos = 0; remain > 0; remain = str.length - pos) {
            const char = str[pos];
            switch (mode) {
                case GS1GeneralPurposeDataEncodation.EncodeMod.Numeric: {
                    const encoder = new NumericEncoder(bitBuffer);
                    const size = bitBuffer.length;
                    if (remain === 1) {
                        if (NumericEncoder.isNumeric(char)) {
                            if (size > 12 * 2 && size % 12 <= 8 && size % 12 > 5) {
                                encoder.encodeOne(char);
                            } else {
                                encoder.encode(char, wijmo.barcode.Constants.FNC1);
                            }
                            pos++;
                        } else {
                            encoder.AlphanumericLatch();
                            mode = GS1GeneralPurposeDataEncodation.EncodeMod.Alphanumeric;
                        }
                    } else if (NumericEncoder.isNumericOrFNC1(char) && NumericEncoder.isNumericOrFNC1(str[pos + 1]) && (char !== wijmo.barcode.Constants.FNC1 || str[pos + 1] !== wijmo.barcode.Constants.FNC1)) {
                        encoder.encode(char, str[pos + 1]);
                        pos += 2;
                    } else {
                        encoder.AlphanumericLatch();
                        mode = GS1GeneralPurposeDataEncodation.EncodeMod.Alphanumeric;
                    }
                    break;
                }
                case GS1GeneralPurposeDataEncodation.EncodeMod.Alphanumeric: {
                    const encoder = new AlphanumericEncoder(bitBuffer);
                    if (char === wijmo.barcode.Constants.FNC1) {
                        encoder.FNC1NumericLatch();
                        mode = GS1GeneralPurposeDataEncodation.EncodeMod.Numeric;
                        pos++;
                    } else if (NumericEncoder.isNumeric(char)) {
                        let pos2 = pos + 1;
                        for (; pos2 < str.length && NumericEncoder.isNumeric(str[pos2]); pos2++);
                        if (pos2 - pos >= 6 || (pos2 - pos >= 4 && pos2 === str.length)) {
                            encoder.NumericLatch();
                            mode = GS1GeneralPurposeDataEncodation.EncodeMod.Numeric;
                        } else {
                            encoder.encode(char);
                            pos++;
                        }
                    } else if (ISO646Encoder.isISO646Only(char)) {
                        encoder.ISO646Latch();
                        mode = GS1GeneralPurposeDataEncodation.EncodeMod.ISO646;
                    } else {
                        encoder.encode(char);
                        pos++;
                    }
                    break;
                }
                case GS1GeneralPurposeDataEncodation.EncodeMod.ISO646: {
                    const encoder = new ISO646Encoder(bitBuffer);
                    if (NumericEncoder.isNumericOrFNC1(char)) {
                        let pos2 = pos + 1;
                        for (; pos2 < str.length && NumericEncoder.isNumericOrFNC1(str[pos2]); pos2++);
                        if (pos2 - pos >= 4) {
                            for (; pos2 < str.length && !ISO646Encoder.isISO646Only(str[pos2]); pos2++);
                            if (pos2 == str.length || pos2 - pos > 10) {
                                encoder.NumericLatch();
                                mode = GS1GeneralPurposeDataEncodation.EncodeMod.Numeric;
                                break;
                            }
                        }
                    } else {
                        let pos2 = pos;
                        for (; pos2 < str.length && !ISO646Encoder.isISO646Only(str[pos2]); pos2++);
                        if (pos2 - pos > 10) {
                            encoder.AlphanumericLatch();
                            mode = GS1GeneralPurposeDataEncodation.EncodeMod.Alphanumeric;
                            break;
                        }
                    }

                    if (char === wijmo.barcode.Constants.FNC1) {
                        encoder.FNC1NumericLatch();
                        mode = GS1GeneralPurposeDataEncodation.EncodeMod.Numeric;
                        pos++;
                    } else {
                        encoder.encode(char);
                        pos++;
                    }
                    break;
                }
            }
        }
        this.mode = mode;
    }
    padTo(size) {
        const { bitBuffer } = this;
        const remain = size - bitBuffer.length;
        this._pad(remain);
    }

    _pad(remain) {
        const { bitBuffer } = this;
        while (remain > 0) {
            if (this.mode === GS1GeneralPurposeDataEncodation.EncodeMod.Numeric) {
                this.mode = GS1GeneralPurposeDataEncodation.EncodeMod.Alphanumeric;
                if (remain >= 4) {
                    bitBuffer.put(0, 4);
                    remain -= 4;
                } else {
                    bitBuffer.put(0, remain);
                    remain = 0;
                }
            } else {
                if (remain >= 5) {
                    bitBuffer.put(4, 5);
                    remain -= 5;
                } else {
                    if (remain === 4) {
                        bitBuffer.put(2, remain);
                    } else if (remain === 3) {
                        bitBuffer.put(1, remain);
                    } else {
                        bitBuffer.put(0, remain);
                    }
                    remain = 0;
                }
            }
        }
    }

    encode(text = '') {
        const { bitBuffer, needExtraPadding } = this;
        this.encodeGeneralData(text);
        let remain;
        let n = ~~((bitBuffer.length + 11) / 12);
        n = n < 3 ? 3 : n;
        remain = 12 * n - bitBuffer.length;

        if (needExtraPadding) {
            remain += 12;
        }

        this._pad(remain);
    }
}
    }
    


    module wijmo.barcode.composite {
    

const mb = new wijmo.barcode.MatrixBuilder(69, 7);
const pwr928 = mb.toMatrix();

function init928() {
    let i, j, v;
    let cw = wijmo.barcode.Utils.fillArray(new Array(7), 0);
    cw[6] = 1;
    for (i = 0; i < 7; i++) {
        pwr928[0][i] = cw[i];
    }

    for (j = 1; j < 69; j++) {
        for (v = 0, i = 6; i >= 1; i--) {
            v = (2 * cw[i]) + ~~(v / 928);
            pwr928[j][i] = cw[i] = v % 928;
        }
        pwr928[j][0] = cw[0] = (2 * cw[0]) + ~~(v / 928);
    }

    return;
}
init928();
function getBit(bitStr, bitPos) {
    return (((bitStr[~~(bitPos / 16)] & (0x8000 >> (bitPos % 16))) == 0) ? 0 : 1);
}
export function encode928(bitString, codeWords, bitLng) {
    let i, j, b, bitCnt, cwNdx, cwCnt, cwLng;
    for (cwNdx = cwLng = b = 0; b < bitLng; b += 69, cwNdx += 7) {
        bitCnt = Math.min(bitLng - b, 69);
        cwLng += cwCnt = ~~(bitCnt / 10) + 1;
        for (i = 0; i < cwCnt; i++) {
            codeWords[cwNdx + i] = 0; /* init 0 */
        }

        for (i = 0; i < bitCnt; i++) {
            if (getBit(bitString, b + bitCnt - i - 1)) {
                for (j = 0; j < cwCnt; j++)
                    codeWords[cwNdx + j] += pwr928[i][j + 7 - cwCnt];
            }
        }
        for (i = cwCnt - 1; i > 0; i--) {
            /* add "carries" */
            codeWords[cwNdx + i - 1] += ~~(codeWords[cwNdx + i] / 928);
            codeWords[cwNdx + i] %= 928;
        }
    }
    return cwLng;
}
    }
    


    module wijmo.barcode.composite {
    

function makeRange_CCA(start, length) {
    const result = [];
    let i = 0, n = start;
    while (i < length) {
        if (n > 52) {
            n = n % 52;
        }
        result.push(n);
        i++;
        n++;
    }
    return result;
}
export function findVersionTable_CCA(table, func) {
    for (let i = 0, len = table.length; i < len; i++) {
        let item = table[i];
        const [cols, rows, ecCws, bits, leftStart, rightStart, centerStart] = item;
        const total = rows * cols;
        const nonEcCw = total - ecCws;
        item = {
            rows,
            cols,
            total,
            ecCws,
            nonEcCw,
            bits
        };
        if (func(item)) {
            item.rowAssignment = {
                left: makeRange_CCA(leftStart, rows),
                right: makeRange_CCA(rightStart, rows),
                center: centerStart ? makeRange_CCA(centerStart, rows) : null,
            };
            const cluster = [];
            let i = 0;
            while (i <= rows) {
                const n = (leftStart + i - 1) % 3;
                cluster.push(n);
                i++;
            }
            item.cluster = cluster;
            return item;
        }
    }

    return null;
}
export function getVersionVariant_CCA(col, bits) {
    const VersionTable = [
        [2, 5, 4, 59, 39, 19], // col row ecc bit leftrap rightrap centerrap
        [2, 6, 4, 78, 1, 33],
        [2, 7, 5, 88, 32, 12],
        [2, 8, 5, 108, 8, 40],
        [2, 9, 6, 118, 14, 46],
        [2, 10, 6, 138, 43, 23],
        [2, 12, 7, 167, 20, 52],
    
        [3, 4, 4, 78, 11, 23, 43],
        [3, 5, 5, 98, 1, 13, 33],
        [3, 6, 6, 118, 3, 17, 37],
        [3, 7, 7, 138, 15, 27, 47],
        [3, 8, 7, 167, 21, 33, 1],
    
        [4, 3, 4, 78, 40, 52, 20],
        [4, 4, 5, 108, 43, 3, 23],
        [4, 5, 6, 138, 46, 6, 26],
        [4, 6, 7, 167, 34, 46, 14],
        [4, 7, 8, 197, 29, 41, 9]
    ];
    return findVersionTable_CCA(VersionTable, (item) => item.cols === col && item.bits >= bits);
}

const SupportedUppercaseAlphabetic = 'BDHIJKLNPQRSTVWZ';

export function getSupportedUppercaseAlphabetic(letter) {
    const index = SupportedUppercaseAlphabetic.indexOf(letter);

    if (index === -1) {
        return null;
    }

    const v = wijmo.barcode.Utils.convertRadix(index);
    return wijmo.barcode.Utils.strPadStart(v, 4, '0');
}
    }
    


    module wijmo.barcode.composite {
    







const EncodeMod = GS1GeneralPurposeDataEncodation.EncodeMod;
export class GeneralPurposeDataEncodation extends GS1GeneralPurposeDataEncodation {
    encodeGeneralData(str, columns?) {
        if (!str) {
            return;
        }
        const { bitBuffer } = this;
        let mode = EncodeMod.Numeric;

        for (let remain = str.length, pos = 0; remain > 0; remain = str.length - pos) {
            const char = str[pos];
            switch (mode) {
                case EncodeMod.Numeric: {
                    const encoder = new NumericEncoder(bitBuffer);
                    const code = char[0].charCodeAt(0);
                    if (remain === 1) {
                        if (NumericEncoder.isNumeric(char)) {
                            const variant = getVersionVariant_CCA(columns, bitBuffer.length);
                            if (!variant) {
                                throw new wijmo.barcode.TextTooLongException();
                            }
                            const remainBits = variant.bits - bitBuffer.length;

                            if (remainBits >= 4 && remainBits <= 6) {
                                encoder.encodeOne(char);
                                bitBuffer.put(0, remainBits - 4);
                            }  else {
                                bitBuffer.put(11 * (code - 48) + 10 + 8, 7);
                            }
                            pos++;
                        } else {
                            encoder.AlphanumericLatch();
                            mode = EncodeMod.Alphanumeric;
                        }
                    } else if (NumericEncoder.isNumericOrFNC1(char) && NumericEncoder.isNumericOrFNC1(str[pos + 1]) && (char !== wijmo.barcode.Constants.FNC1 || str[pos + 1] !== wijmo.barcode.Constants.FNC1)) {
                        encoder.encode(char, str[pos + 1]);
                        pos += 2;
                    } else {
                        encoder.AlphanumericLatch();
                        mode = EncodeMod.Alphanumeric;
                    }
                    break;
                }
                case EncodeMod.Alphanumeric: {
                    const encoder = new AlphanumericEncoder(bitBuffer);
                    if (char === wijmo.barcode.Constants.FNC1) {
                        encoder.FNC1NumericLatch();
                        mode = EncodeMod.Numeric;
                        pos++;
                    } else if (NumericEncoder.isNumeric(char)) {
                        let pos2 = pos + 1;
                        for (; pos2 < str.length && NumericEncoder.isNumericOrFNC1(str[pos2]); pos2++);
                        if (pos2 - pos >= 6 || (pos2 - pos >= 4 && pos2 === str.length)) {
                            encoder.NumericLatch();
                            mode = EncodeMod.Numeric;
                        } else {
                            encoder.encode(char);
                            pos++;
                        }
                    } else if (ISO646Encoder.isISO646Only(char)) {
                        encoder.ISO646Latch();
                        mode = EncodeMod.ISO646;
                    } else {
                        encoder.encode(char);
                        pos++;
                    }
                    break;
                }
                case EncodeMod.ISO646: {
                    const encoder = new ISO646Encoder(bitBuffer);
                    if (NumericEncoder.isNumericOrFNC1(char)) {
                        let pos2 = pos + 1;
                        for (; pos2 < str.length && NumericEncoder.isNumericOrFNC1(str[pos2]); pos2++);
                        if (pos2 - pos >= 4) {
                            for (; pos2 < str.length && !ISO646Encoder.isISO646Only(str[pos2]); pos2++);
                            if (pos2 == str.length || pos2 - pos > 10) {
                                encoder.NumericLatch();
                                mode = EncodeMod.Numeric;
                                break;
                            }
                        }
                    } else {
                        let pos2 = pos;
                        for (; pos2 < str.length && !ISO646Encoder.isISO646Only(str[pos2]); pos2++);
                        if (pos2 - pos > 10) {
                            encoder.AlphanumericLatch();
                            mode = EncodeMod.Alphanumeric;
                            break;
                        }
                    }

                    if (char === wijmo.barcode.Constants.FNC1) {
                        encoder.FNC1NumericLatch();
                        mode = EncodeMod.Numeric;
                        pos++;
                    } else {
                        encoder.encode(char);
                        pos++;
                    }
                    break;
                }
            }
        }
        this.mode = mode;
    }
}
    }
    


    module wijmo.barcode.composite {
    

const EccCoefficientTable = [
    [0x01b,0x395],                                                                                    
    [0x20a,0x238,0x2d3,0x329],                                                                        
    [0x0ed,0x134,0x1b4,0x11c,0x286,0x28d,0x1ac,0x17b],                                                
    [0x112,0x232,0x0e8,0x2f3,0x257,0x20c,0x321,0x084,0x127,0x074,0x1ba,0x1ac,0x127,0x02a,0x0b0,0x041],
    [0x169,0x23f,0x39a,0x20d,0x0b0,0x24a,0x280,0x141,0x218,0x2e6,0x2a5,0x2e6,0x2af,0x11c,0x0c1,0x205, 
        0x111,0x1ee,0x107,0x093,0x251,0x320,0x23b,0x140,0x323,0x085,0x0e7,0x186,0x2ad,0x14a,0x03f,0x19a],
    [0x21b,0x1a6,0x006,0x05d,0x35e,0x303,0x1c5,0x06a,0x262,0x11f,0x06b,0x1f9,0x2dd,0x36d,0x17d,0x264,
        0x2d3,0x1dc,0x1ce,0x0ac,0x1ae,0x261,0x35a,0x336,0x21f,0x178,0x1ff,0x190,0x2a0,0x2fa,0x11b,0x0b8,
        0x1b8,0x023,0x207,0x01f,0x1cc,0x252,0x0e1,0x217,0x205,0x160,0x25d,0x09e,0x28b,0x0c9,0x1e8,0x1f6,
        0x288,0x2dd,0x2cd,0x053,0x194,0x061,0x118,0x303,0x348,0x275,0x004,0x17d,0x34b,0x26f,0x108,0x21f],
    [0x209,0x136,0x360,0x223,0x35a,0x244,0x128,0x17b,0x035,0x30b,0x381,0x1bc,0x190,0x39d,0x2ed,0x19f,
        0x336,0x05d,0x0d9,0x0d0,0x3a0,0x0f4,0x247,0x26c,0x0f6,0x094,0x1bf,0x277,0x124,0x38c,0x1ea,0x2c0,
        0x204,0x102,0x1c9,0x38b,0x252,0x2d3,0x2a2,0x124,0x110,0x060,0x2ac,0x1b0,0x2ae,0x25e,0x35c,0x239,
        0x0c1,0x0db,0x081,0x0ba,0x0ec,0x11f,0x0c0,0x307,0x116,0x0ad,0x028,0x17b,0x2c8,0x1cf,0x286,0x308,
        0x0ab,0x1eb,0x129,0x2fb,0x09c,0x2dc,0x05f,0x10e,0x1bf,0x05a,0x1fb,0x030,0x0e4,0x335,0x328,0x382,
        0x310,0x297,0x273,0x17a,0x17e,0x106,0x17c,0x25a,0x2f2,0x150,0x059,0x266,0x057,0x1b0,0x29e,0x268,
        0x09d,0x176,0x0f2,0x2d6,0x258,0x10d,0x177,0x382,0x34d,0x1c6,0x162,0x082,0x32e,0x24b,0x324,0x022,
        0x0d3,0x14a,0x21b,0x129,0x33b,0x361,0x025,0x205,0x342,0x13b,0x226,0x056,0x321,0x004,0x06c,0x21b],
    [0x20c,0x37e,0x04b,0x2fe,0x372,0x359,0x04a,0x0cc,0x052,0x24a,0x2c4,0x0fa,0x389,0x312,0x08a,0x2d0,
        0x35a,0x0c2,0x137,0x391,0x113,0x0be,0x177,0x352,0x1b6,0x2dd,0x0c2,0x118,0x0c9,0x118,0x33c,0x2f5,
        0x2c6,0x32e,0x397,0x059,0x044,0x239,0x00b,0x0cc,0x31c,0x25d,0x21c,0x391,0x321,0x2bc,0x31f,0x089,
        0x1b7,0x1a2,0x250,0x29c,0x161,0x35b,0x172,0x2b6,0x145,0x0f0,0x0d8,0x101,0x11c,0x225,0x0d1,0x374,
        0x13b,0x046,0x149,0x319,0x1ea,0x112,0x36d,0x0a2,0x2ed,0x32c,0x2ac,0x1cd,0x14e,0x178,0x351,0x209,
        0x133,0x123,0x323,0x2c8,0x013,0x166,0x18f,0x38c,0x067,0x1ff,0x033,0x008,0x205,0x0e1,0x121,0x1d6,
        0x27d,0x2db,0x042,0x0ff,0x395,0x10d,0x1cf,0x33e,0x2da,0x1b1,0x350,0x249,0x088,0x21a,0x38a,0x05a,
        0x002,0x122,0x2e7,0x0c7,0x28f,0x387,0x149,0x031,0x322,0x244,0x163,0x24c,0x0bc,0x1ce,0x00a,0x086,
        0x274,0x140,0x1df,0x082,0x2e3,0x047,0x107,0x13e,0x176,0x259,0x0c0,0x25d,0x08e,0x2a1,0x2af,0x0ea,
        0x2d2,0x180,0x0b1,0x2f0,0x25f,0x280,0x1c7,0x0c1,0x2b1,0x2c3,0x325,0x281,0x030,0x03c,0x2dc,0x26d,
        0x37f,0x220,0x105,0x354,0x28f,0x135,0x2b9,0x2f3,0x2f4,0x03c,0x0e7,0x305,0x1b2,0x1a5,0x2d6,0x210,
        0x1f7,0x076,0x031,0x31b,0x020,0x090,0x1f4,0x0ee,0x344,0x18a,0x118,0x236,0x13f,0x009,0x287,0x226,
        0x049,0x392,0x156,0x07e,0x020,0x2a9,0x14b,0x318,0x26c,0x03c,0x261,0x1b9,0x0b4,0x317,0x37d,0x2f2,
        0x25d,0x17f,0x0e4,0x2ed,0x2f8,0x0d5,0x036,0x129,0x086,0x036,0x342,0x12b,0x39a,0x0bf,0x38e,0x214,
        0x261,0x33d,0x0bd,0x014,0x0a7,0x01d,0x368,0x1c1,0x053,0x192,0x029,0x290,0x1f9,0x243,0x1e1,0x0ad,
        0x194,0x0fb,0x2b0,0x05f,0x1f1,0x22b,0x282,0x21f,0x133,0x09f,0x39c,0x22e,0x288,0x037,0x1f1,0x00a],
    [   0x160,0x04d,0x175,0x1f8,0x023,0x257,0x1ac,0x0cf,0x199,0x23e,0x076,0x1f2,0x11d,0x17c,0x15e,0x1ec,
        0x0c5,0x109,0x398,0x09b,0x392,0x12b,0x0e5,0x283,0x126,0x367,0x132,0x058,0x057,0x0c1,0x160,0x30d,
        0x34e,0x04b,0x147,0x208,0x1b3,0x21f,0x0cb,0x29a,0x0f9,0x15a,0x30d,0x26d,0x280,0x10c,0x31a,0x216,
        0x21b,0x30d,0x198,0x186,0x284,0x066,0x1dc,0x1f3,0x122,0x278,0x221,0x025,0x35a,0x394,0x228,0x029,
        0x21e,0x121,0x07a,0x110,0x17f,0x320,0x1e5,0x062,0x2f0,0x1d8,0x2f9,0x06b,0x310,0x35c,0x292,0x2e5,
        0x122,0x0cc,0x2a9,0x197,0x357,0x055,0x063,0x03e,0x1e2,0x0b4,0x014,0x129,0x1c3,0x251,0x391,0x08e,
        0x328,0x2ac,0x11f,0x218,0x231,0x04c,0x28d,0x383,0x2d9,0x237,0x2e8,0x186,0x201,0x0c0,0x204,0x102,
        0x0f0,0x206,0x31a,0x18b,0x300,0x350,0x033,0x262,0x180,0x0a8,0x0be,0x33a,0x148,0x254,0x312,0x12f,
        0x23a,0x17d,0x19f,0x281,0x09c,0x0ed,0x097,0x1ad,0x213,0x0cf,0x2a4,0x2c6,0x059,0x0a8,0x130,0x192,
        0x028,0x2c4,0x23f,0x0a2,0x360,0x0e5,0x041,0x35d,0x349,0x200,0x0a4,0x1dd,0x0dd,0x05c,0x166,0x311,
        0x120,0x165,0x352,0x344,0x33b,0x2e0,0x2c3,0x05e,0x008,0x1ee,0x072,0x209,0x002,0x1f3,0x353,0x21f,
        0x098,0x2d9,0x303,0x05f,0x0f8,0x169,0x242,0x143,0x358,0x31d,0x121,0x033,0x2ac,0x1d2,0x215,0x334,
        0x29d,0x02d,0x386,0x1c4,0x0a7,0x156,0x0f4,0x0ad,0x023,0x1cf,0x28b,0x033,0x2bb,0x24f,0x1c4,0x242,
        0x025,0x07c,0x12a,0x14c,0x228,0x02b,0x1ab,0x077,0x296,0x309,0x1db,0x352,0x2fc,0x16c,0x242,0x38f,
        0x11b,0x2c7,0x1d8,0x1a4,0x0f5,0x120,0x252,0x18a,0x1ff,0x147,0x24d,0x309,0x2bb,0x2b0,0x02b,0x198,
        0x34a,0x17f,0x2d1,0x209,0x230,0x284,0x2ca,0x22f,0x03e,0x091,0x369,0x297,0x2c9,0x09f,0x2a0,0x2d9,
        0x270,0x03b,0x0c1,0x1a1,0x09e,0x0d1,0x233,0x234,0x157,0x2b5,0x06d,0x260,0x233,0x16d,0x0b5,0x304,
        0x2a5,0x136,0x0f8,0x161,0x2c4,0x19a,0x243,0x366,0x269,0x349,0x278,0x35c,0x121,0x218,0x023,0x309,
        0x26a,0x24a,0x1a8,0x341,0x04d,0x255,0x15a,0x10d,0x2f5,0x278,0x2b7,0x2ef,0x14b,0x0f7,0x0b8,0x02d, 
        0x313,0x2a8,0x012,0x042,0x197,0x171,0x036,0x1ec,0x0e4,0x265,0x33e,0x39a,0x1b5,0x207,0x284,0x389,
        0x315,0x1a4,0x131,0x1b9,0x0cf,0x12c,0x37c,0x33b,0x08d,0x219,0x17d,0x296,0x201,0x038,0x0fc,0x155,
        0x0f2,0x31d,0x346,0x345,0x2d0,0x0e0,0x133,0x277,0x03d,0x057,0x230,0x136,0x2f4,0x299,0x18d,0x328,
        0x353,0x135,0x1d9,0x31b,0x17a,0x01f,0x287,0x393,0x1cb,0x326,0x24e,0x2db,0x1a9,0x0d8,0x224,0x0f9,
        0x141,0x371,0x2bb,0x217,0x2a1,0x30e,0x0d2,0x32f,0x389,0x12f,0x34b,0x39a,0x119,0x049,0x1d5,0x317,
        0x294,0x0a2,0x1f2,0x134,0x09b,0x1a6,0x38b,0x331,0x0bb,0x03e,0x010,0x1a9,0x217,0x150,0x11e,0x1b5,
        0x177,0x111,0x262,0x128,0x0b7,0x39b,0x074,0x29b,0x2ef,0x161,0x03e,0x16e,0x2b3,0x17b,0x2af,0x34a,
        0x025,0x165,0x2d0,0x2e6,0x14a,0x005,0x027,0x39b,0x137,0x1a8,0x0f2,0x2ed,0x141,0x036,0x29d,0x13c,
        0x156,0x12b,0x216,0x069,0x29b,0x1e8,0x280,0x2a0,0x240,0x21c,0x13c,0x1e6,0x2d1,0x262,0x02e,0x290,
        0x1bf,0x0ab,0x268,0x1d0,0x0be,0x213,0x129,0x141,0x2fa,0x2f0,0x215,0x0af,0x086,0x00e,0x17d,0x1b1,
        0x2cd,0x02d,0x06f,0x014,0x254,0x11c,0x2e0,0x08a,0x286,0x19b,0x36d,0x29d,0x08d,0x397,0x02d,0x30c,
        0x197,0x0a4,0x14c,0x383,0x0a5,0x2d6,0x258,0x145,0x1f2,0x28f,0x165,0x2f0,0x300,0x0df,0x351,0x287,
        0x03f,0x136,0x35f,0x0fb,0x16e,0x130,0x11a,0x2e2,0x2a3,0x19a,0x185,0x0f4,0x01f,0x079,0x12f,0x107]
];

const MicroEccCoefficientTable = [
    // Coefficient table for k = 3 
    [890, 351, 200,],
    // Coefficient table for k = 4
    [809, 723, 568, 522,],
    // Coefficient table for k = 5
    [566, 155, 460, 919, 427,],
    // Coefficient table for k = 6
    [766, 17, 803, 19, 285, 861,],
    // Coefficient table for k = 7
    [437, 691, 784, 597, 537, 925, 76,],
    // Coefficient table for k = 8 
    [379, 428, 653, 646, 284, 436, 308, 237,],
    // Coefficient table for k = 9
    [205, 441, 501, 362, 289, 257, 622, 527, 567,],
    // Coefficient table for k = 10
    [612, 266, 691, 818, 841, 826, 244, 64, 457, 377,],
    // Coefficient table for k = 11
    [904, 602, 327, 68, 15, 213, 825, 708, 565, 45, 462,],
    // Coefficient table for k = 12
    [851, 69, 7, 388, 127, 347, 684, 646, 201, 757, 864, 597,],
    // Coefficient table for k = 13
    [692, 394, 184, 204, 678, 592, 322, 583, 606, 384, 342, 713, 764,],
    // Coefficient table for k = 14
    [215, 105, 833, 691, 915, 478, 354, 274, 286, 241, 187, 154, 677, 669,],
    // Coefficient table for k = 15
    [642, 868, 147, 575, 550, 74, 80, 5, 230, 664, 904, 109, 476, 829, 460, ],
    // Coefficient table for k = 16
    [65, 176, 42, 295, 428, 442, 116, 295, 132, 801, 524, 599, 755, 232, 562, 274,],
    // Coefficient table for k = 18
    [573, 760, 756, 233, 321, 560, 202, 312, 297, 120, 739, 275, 855, 37, 624, 315, 577, 279,],
    // Coefficient table for k = 21
    [568, 259, 193, 165, 347, 691, 310, 610, 624, 693, 763, 716, 422, 553, 681, 425, 129, 534, 781, 519, 108,],
    // Coefficient table for k = 26
    [169, 764, 847, 131, 858, 325, 454, 441, 245, 699, 893, 446, 830, 159, 121, 269, 608, 331, 760, 477, 93, 788, 544, 887, 284, 443,],
    // Coefficient table for k = 32  
    [410, 63, 330, 685, 390, 231, 133, 803, 320, 571, 800, 593, 147, 263, 494, 273, 517, 193, 284, 687, 742, 677, 742, 536, 321, 640, 586, 176, 525, 922, 575, 361,],
    // Coefficient table for k = 38 
    [518, 117, 125, 231, 289, 554, 771, 920, 689, 95, 229, 745, 658, 284, 32, 812, 233, 614, 595, 245, 680, 445, 684, 388, 586, 738, 159, 280, 322, 788, 721, 529, 703, 133, 848, 438, 228, 234,],
    // Coefficient table for k = 44 
    [285, 82, 730, 339, 436, 572, 271, 103, 758, 231, 560, 31, 213, 272, 267, 569, 773, 3, 21, 446, 706, 413, 97, 376, 60, 714, 436, 417, 405, 632, 25, 109, 876, 470, 915, 157, 840, 764, 64, 678, 848, 659, 36, 476,],
    // Coefficient table for k = 50 
    [435, 718, 820, 427, 876, 920, 477, 211, 244, 71, 127, 246, 739, 10, 146, 766, 623, 579, 26, 865, 593, 919, 233, 264, 102, 575, 96, 534, 230, 637, 155, 909, 535, 188, 303, 205, 50, 778, 416, 411, 874, 257, 81, 63, 706, 156, 875, 576, 797, 923,],
];
MicroEccCoefficientTable.forEach(item => item.reverse());

function encode(codewords, eccCount, coefficients) {
    let ecc = wijmo.barcode.Utils.fillArray(new Array(eccCount), 0);
    codewords.forEach((c) => {
        let t1 = c + ecc[eccCount - 1], t2, t3;
        for (let j = eccCount - 1; j > 0; --j) {
            t2 = (t1 * coefficients[j]) % 929;
            t3 = 929 - t2;
            ecc[j] = (ecc[(j - 1)] + t3) % 929;
        }
        t2 = (t1 * coefficients[0]) % 929;
        t3 = 929 - t2;
        ecc[0] = t3 % 929;
    });

    ecc.forEach((c, i) => {
        if (c != 0) {
            ecc[i] = 929 - c;
        }
    });
            
    return ecc.reverse();
}

export function generateECC (codewords, ecl) {
    const coefficients = EccCoefficientTable[ecl];
    const eccCount = Math.pow(2, ecl + 1);
    return encode(codewords, eccCount, coefficients);
}

export function generateECCForMicro (codewords, eccCount) {
    let i = 0, coefficients;
    while(i < MicroEccCoefficientTable.length) {
        const item = MicroEccCoefficientTable[i];
        if (item.length === eccCount) {
            coefficients = item;
            break;
        }
        i++;
    }
    return encode(codewords, eccCount, coefficients);
}
    }
    


    module wijmo.barcode.composite {
    

export const SymbolVersion = {
    ColumnPriorAuto: 'columnPriorAuto',
    RowPriorAuto: 'rowPriorAuto',
    V1X11: '1*11',
    V1X14: '1*14',
    V1X17: '1*17',
    V1X20: '1*20',
    V1X24: '1*24',
    V1X28: '1*28',
    V2X8: '2*8',
    V2X11: '2*11',
    V2X14: '2*14',
    V2X17: '2*17',
    V2X20: '2*20',
    V2X23: '2*23',
    V2X26: '2*26',
    V3X6: '3*6',
    V3X8: '3*8',
    V3X10: '3*10',
    V3X12: '3*12',
    V3X15: '3*15',
    V3X20: '3*20',
    V3X26: '3*26',
    V3X32: '3*32',
    V3X38: '3*38',
    V3X44: '3*44',
    V4X4: '4*4',
    V4X6: '4*6',
    V4X8: '4*8',
    V4X10: '4*10',
    V4X12: '4*12',
    V4X15: '4*15',
    V4X20: '4*20',
    V4X26: '4*26',
    V4X32: '4*32',
    V4X38: '4*38',
    V4X44: '4*44',
};
wijmo.barcode.Utils.makeEnums(SymbolVersion);

export const CompactionMode = {
    Auto: 'auto',
    Text: 'text',
    Byte: 'byte',
    Numeric: 'numeric',
};
wijmo.barcode.Utils.makeEnums(CompactionMode);

    }
    


    module wijmo.barcode.composite {
    


export const CLUSTERS = [
    // cluster 0
    [0x1d5c0, 0x1eaf0, 0x1f57c, 0x1d4e0, 0x1ea78, 0x1f53e, 0x1a8c0, 0x1d470, 0x1a860, 0x15040, //  10
        0x1a830, 0x15020, 0x1adc0, 0x1d6f0, 0x1eb7c, 0x1ace0, 0x1d678, 0x1eb3e, 0x158c0, 0x1ac70, //  20
        0x15860, 0x15dc0, 0x1aef0, 0x1d77c, 0x15ce0, 0x1ae78, 0x1d73e, 0x15c70, 0x1ae3c, 0x15ef0, //  30
        0x1af7c, 0x15e78, 0x1af3e, 0x15f7c, 0x1f5fa, 0x1d2e0, 0x1e978, 0x1f4be, 0x1a4c0, 0x1d270, //  40
        0x1e93c, 0x1a460, 0x1d238, 0x14840, 0x1a430, 0x1d21c, 0x14820, 0x1a418, 0x14810, 0x1a6e0, //  50
        0x1d378, 0x1e9be, 0x14cc0, 0x1a670, 0x1d33c, 0x14c60, 0x1a638, 0x1d31e, 0x14c30, 0x1a61c, //  60
        0x14ee0, 0x1a778, 0x1d3be, 0x14e70, 0x1a73c, 0x14e38, 0x1a71e, 0x14f78, 0x1a7be, 0x14f3c, //  70
        0x14f1e, 0x1a2c0, 0x1d170, 0x1e8bc, 0x1a260, 0x1d138, 0x1e89e, 0x14440, 0x1a230, 0x1d11c, //  80
        0x14420, 0x1a218, 0x14410, 0x14408, 0x146c0, 0x1a370, 0x1d1bc, 0x14660, 0x1a338, 0x1d19e, //  90
        0x14630, 0x1a31c, 0x14618, 0x1460c, 0x14770, 0x1a3bc, 0x14738, 0x1a39e, 0x1471c, 0x147bc, // 100
        0x1a160, 0x1d0b8, 0x1e85e, 0x14240, 0x1a130, 0x1d09c, 0x14220, 0x1a118, 0x1d08e, 0x14210, // 110
        0x1a10c, 0x14208, 0x1a106, 0x14360, 0x1a1b8, 0x1d0de, 0x14330, 0x1a19c, 0x14318, 0x1a18e, // 120
        0x1430c, 0x14306, 0x1a1de, 0x1438e, 0x14140, 0x1a0b0, 0x1d05c, 0x14120, 0x1a098, 0x1d04e, // 130
        0x14110, 0x1a08c, 0x14108, 0x1a086, 0x14104, 0x141b0, 0x14198, 0x1418c, 0x140a0, 0x1d02e, // 140
        0x1a04c, 0x1a046, 0x14082, 0x1cae0, 0x1e578, 0x1f2be, 0x194c0, 0x1ca70, 0x1e53c, 0x19460, // 150
        0x1ca38, 0x1e51e, 0x12840, 0x19430, 0x12820, 0x196e0, 0x1cb78, 0x1e5be, 0x12cc0, 0x19670, // 160
        0x1cb3c, 0x12c60, 0x19638, 0x12c30, 0x12c18, 0x12ee0, 0x19778, 0x1cbbe, 0x12e70, 0x1973c, // 170
        0x12e38, 0x12e1c, 0x12f78, 0x197be, 0x12f3c, 0x12fbe, 0x1dac0, 0x1ed70, 0x1f6bc, 0x1da60, // 180
        0x1ed38, 0x1f69e, 0x1b440, 0x1da30, 0x1ed1c, 0x1b420, 0x1da18, 0x1ed0e, 0x1b410, 0x1da0c, // 190
        0x192c0, 0x1c970, 0x1e4bc, 0x1b6c0, 0x19260, 0x1c938, 0x1e49e, 0x1b660, 0x1db38, 0x1ed9e, // 200
        0x16c40, 0x12420, 0x19218, 0x1c90e, 0x16c20, 0x1b618, 0x16c10, 0x126c0, 0x19370, 0x1c9bc, // 210
        0x16ec0, 0x12660, 0x19338, 0x1c99e, 0x16e60, 0x1b738, 0x1db9e, 0x16e30, 0x12618, 0x16e18, // 220
        0x12770, 0x193bc, 0x16f70, 0x12738, 0x1939e, 0x16f38, 0x1b79e, 0x16f1c, 0x127bc, 0x16fbc, // 230
        0x1279e, 0x16f9e, 0x1d960, 0x1ecb8, 0x1f65e, 0x1b240, 0x1d930, 0x1ec9c, 0x1b220, 0x1d918, // 240
        0x1ec8e, 0x1b210, 0x1d90c, 0x1b208, 0x1b204, 0x19160, 0x1c8b8, 0x1e45e, 0x1b360, 0x19130, // 250
        0x1c89c, 0x16640, 0x12220, 0x1d99c, 0x1c88e, 0x16620, 0x12210, 0x1910c, 0x16610, 0x1b30c, // 260
        0x19106, 0x12204, 0x12360, 0x191b8, 0x1c8de, 0x16760, 0x12330, 0x1919c, 0x16730, 0x1b39c, // 270
        0x1918e, 0x16718, 0x1230c, 0x12306, 0x123b8, 0x191de, 0x167b8, 0x1239c, 0x1679c, 0x1238e, // 280
        0x1678e, 0x167de, 0x1b140, 0x1d8b0, 0x1ec5c, 0x1b120, 0x1d898, 0x1ec4e, 0x1b110, 0x1d88c, // 290
        0x1b108, 0x1d886, 0x1b104, 0x1b102, 0x12140, 0x190b0, 0x1c85c, 0x16340, 0x12120, 0x19098, // 300
        0x1c84e, 0x16320, 0x1b198, 0x1d8ce, 0x16310, 0x12108, 0x19086, 0x16308, 0x1b186, 0x16304, // 310
        0x121b0, 0x190dc, 0x163b0, 0x12198, 0x190ce, 0x16398, 0x1b1ce, 0x1638c, 0x12186, 0x16386, // 320
        0x163dc, 0x163ce, 0x1b0a0, 0x1d858, 0x1ec2e, 0x1b090, 0x1d84c, 0x1b088, 0x1d846, 0x1b084, // 330
        0x1b082, 0x120a0, 0x19058, 0x1c82e, 0x161a0, 0x12090, 0x1904c, 0x16190, 0x1b0cc, 0x19046, // 340
        0x16188, 0x12084, 0x16184, 0x12082, 0x120d8, 0x161d8, 0x161cc, 0x161c6, 0x1d82c, 0x1d826, // 350
        0x1b042, 0x1902c, 0x12048, 0x160c8, 0x160c4, 0x160c2, 0x18ac0, 0x1c570, 0x1e2bc, 0x18a60, // 360
        0x1c538, 0x11440, 0x18a30, 0x1c51c, 0x11420, 0x18a18, 0x11410, 0x11408, 0x116c0, 0x18b70, // 370
        0x1c5bc, 0x11660, 0x18b38, 0x1c59e, 0x11630, 0x18b1c, 0x11618, 0x1160c, 0x11770, 0x18bbc, // 380
        0x11738, 0x18b9e, 0x1171c, 0x117bc, 0x1179e, 0x1cd60, 0x1e6b8, 0x1f35e, 0x19a40, 0x1cd30, // 390
        0x1e69c, 0x19a20, 0x1cd18, 0x1e68e, 0x19a10, 0x1cd0c, 0x19a08, 0x1cd06, 0x18960, 0x1c4b8, // 400
        0x1e25e, 0x19b60, 0x18930, 0x1c49c, 0x13640, 0x11220, 0x1cd9c, 0x1c48e, 0x13620, 0x19b18, // 410
        0x1890c, 0x13610, 0x11208, 0x13608, 0x11360, 0x189b8, 0x1c4de, 0x13760, 0x11330, 0x1cdde, // 420
        0x13730, 0x19b9c, 0x1898e, 0x13718, 0x1130c, 0x1370c, 0x113b8, 0x189de, 0x137b8, 0x1139c, // 430
        0x1379c, 0x1138e, 0x113de, 0x137de, 0x1dd40, 0x1eeb0, 0x1f75c, 0x1dd20, 0x1ee98, 0x1f74e, // 440
        0x1dd10, 0x1ee8c, 0x1dd08, 0x1ee86, 0x1dd04, 0x19940, 0x1ccb0, 0x1e65c, 0x1bb40, 0x19920, // 450
        0x1eedc, 0x1e64e, 0x1bb20, 0x1dd98, 0x1eece, 0x1bb10, 0x19908, 0x1cc86, 0x1bb08, 0x1dd86, // 460
        0x19902, 0x11140, 0x188b0, 0x1c45c, 0x13340, 0x11120, 0x18898, 0x1c44e, 0x17740, 0x13320, // 470
        0x19998, 0x1ccce, 0x17720, 0x1bb98, 0x1ddce, 0x18886, 0x17710, 0x13308, 0x19986, 0x17708, // 480
        0x11102, 0x111b0, 0x188dc, 0x133b0, 0x11198, 0x188ce, 0x177b0, 0x13398, 0x199ce, 0x17798, // 490
        0x1bbce, 0x11186, 0x13386, 0x111dc, 0x133dc, 0x111ce, 0x177dc, 0x133ce, 0x1dca0, 0x1ee58, // 500
        0x1f72e, 0x1dc90, 0x1ee4c, 0x1dc88, 0x1ee46, 0x1dc84, 0x1dc82, 0x198a0, 0x1cc58, 0x1e62e, // 510
        0x1b9a0, 0x19890, 0x1ee6e, 0x1b990, 0x1dccc, 0x1cc46, 0x1b988, 0x19884, 0x1b984, 0x19882, // 520
        0x1b982, 0x110a0, 0x18858, 0x1c42e, 0x131a0, 0x11090, 0x1884c, 0x173a0, 0x13190, 0x198cc, // 530
        0x18846, 0x17390, 0x1b9cc, 0x11084, 0x17388, 0x13184, 0x11082, 0x13182, 0x110d8, 0x1886e, // 540
        0x131d8, 0x110cc, 0x173d8, 0x131cc, 0x110c6, 0x173cc, 0x131c6, 0x110ee, 0x173ee, 0x1dc50, // 550
        0x1ee2c, 0x1dc48, 0x1ee26, 0x1dc44, 0x1dc42, 0x19850, 0x1cc2c, 0x1b8d0, 0x19848, 0x1cc26, // 560
        0x1b8c8, 0x1dc66, 0x1b8c4, 0x19842, 0x1b8c2, 0x11050, 0x1882c, 0x130d0, 0x11048, 0x18826, // 570
        0x171d0, 0x130c8, 0x19866, 0x171c8, 0x1b8e6, 0x11042, 0x171c4, 0x130c2, 0x171c2, 0x130ec, // 580
        0x171ec, 0x171e6, 0x1ee16, 0x1dc22, 0x1cc16, 0x19824, 0x19822, 0x11028, 0x13068, 0x170e8, // 590
        0x11022, 0x13062, 0x18560, 0x10a40, 0x18530, 0x10a20, 0x18518, 0x1c28e, 0x10a10, 0x1850c, // 600
        0x10a08, 0x18506, 0x10b60, 0x185b8, 0x1c2de, 0x10b30, 0x1859c, 0x10b18, 0x1858e, 0x10b0c, // 610
        0x10b06, 0x10bb8, 0x185de, 0x10b9c, 0x10b8e, 0x10bde, 0x18d40, 0x1c6b0, 0x1e35c, 0x18d20, // 620
        0x1c698, 0x18d10, 0x1c68c, 0x18d08, 0x1c686, 0x18d04, 0x10940, 0x184b0, 0x1c25c, 0x11b40, // 630
        0x10920, 0x1c6dc, 0x1c24e, 0x11b20, 0x18d98, 0x1c6ce, 0x11b10, 0x10908, 0x18486, 0x11b08, // 640
        0x18d86, 0x10902, 0x109b0, 0x184dc, 0x11bb0, 0x10998, 0x184ce, 0x11b98, 0x18dce, 0x11b8c, // 650
        0x10986, 0x109dc, 0x11bdc, 0x109ce, 0x11bce, 0x1cea0, 0x1e758, 0x1f3ae, 0x1ce90, 0x1e74c, // 660
        0x1ce88, 0x1e746, 0x1ce84, 0x1ce82, 0x18ca0, 0x1c658, 0x19da0, 0x18c90, 0x1c64c, 0x19d90, // 670
        0x1cecc, 0x1c646, 0x19d88, 0x18c84, 0x19d84, 0x18c82, 0x19d82, 0x108a0, 0x18458, 0x119a0, // 680
        0x10890, 0x1c66e, 0x13ba0, 0x11990, 0x18ccc, 0x18446, 0x13b90, 0x19dcc, 0x10884, 0x13b88, // 690
        0x11984, 0x10882, 0x11982, 0x108d8, 0x1846e, 0x119d8, 0x108cc, 0x13bd8, 0x119cc, 0x108c6, // 700
        0x13bcc, 0x119c6, 0x108ee, 0x119ee, 0x13bee, 0x1ef50, 0x1f7ac, 0x1ef48, 0x1f7a6, 0x1ef44, // 710
        0x1ef42, 0x1ce50, 0x1e72c, 0x1ded0, 0x1ef6c, 0x1e726, 0x1dec8, 0x1ef66, 0x1dec4, 0x1ce42, // 720
        0x1dec2, 0x18c50, 0x1c62c, 0x19cd0, 0x18c48, 0x1c626, 0x1bdd0, 0x19cc8, 0x1ce66, 0x1bdc8, // 730
        0x1dee6, 0x18c42, 0x1bdc4, 0x19cc2, 0x1bdc2, 0x10850, 0x1842c, 0x118d0, 0x10848, 0x18426, // 740
        0x139d0, 0x118c8, 0x18c66, 0x17bd0, 0x139c8, 0x19ce6, 0x10842, 0x17bc8, 0x1bde6, 0x118c2, // 750
        0x17bc4, 0x1086c, 0x118ec, 0x10866, 0x139ec, 0x118e6, 0x17bec, 0x139e6, 0x17be6, 0x1ef28, // 760
        0x1f796, 0x1ef24, 0x1ef22, 0x1ce28, 0x1e716, 0x1de68, 0x1ef36, 0x1de64, 0x1ce22, 0x1de62, // 770
        0x18c28, 0x1c616, 0x19c68, 0x18c24, 0x1bce8, 0x19c64, 0x18c22, 0x1bce4, 0x19c62, 0x1bce2, // 780
        0x10828, 0x18416, 0x11868, 0x18c36, 0x138e8, 0x11864, 0x10822, 0x179e8, 0x138e4, 0x11862, // 790
        0x179e4, 0x138e2, 0x179e2, 0x11876, 0x179f6, 0x1ef12, 0x1de34, 0x1de32, 0x19c34, 0x1bc74, // 800
        0x1bc72, 0x11834, 0x13874, 0x178f4, 0x178f2, 0x10540, 0x10520, 0x18298, 0x10510, 0x10508, // 810
        0x10504, 0x105b0, 0x10598, 0x1058c, 0x10586, 0x105dc, 0x105ce, 0x186a0, 0x18690, 0x1c34c, // 820
        0x18688, 0x1c346, 0x18684, 0x18682, 0x104a0, 0x18258, 0x10da0, 0x186d8, 0x1824c, 0x10d90, // 830
        0x186cc, 0x10d88, 0x186c6, 0x10d84, 0x10482, 0x10d82, 0x104d8, 0x1826e, 0x10dd8, 0x186ee, // 840
        0x10dcc, 0x104c6, 0x10dc6, 0x104ee, 0x10dee, 0x1c750, 0x1c748, 0x1c744, 0x1c742, 0x18650, // 850
        0x18ed0, 0x1c76c, 0x1c326, 0x18ec8, 0x1c766, 0x18ec4, 0x18642, 0x18ec2, 0x10450, 0x10cd0, // 860
        0x10448, 0x18226, 0x11dd0, 0x10cc8, 0x10444, 0x11dc8, 0x10cc4, 0x10442, 0x11dc4, 0x10cc2, // 870
        0x1046c, 0x10cec, 0x10466, 0x11dec, 0x10ce6, 0x11de6, 0x1e7a8, 0x1e7a4, 0x1e7a2, 0x1c728, // 880
        0x1cf68, 0x1e7b6, 0x1cf64, 0x1c722, 0x1cf62, 0x18628, 0x1c316, 0x18e68, 0x1c736, 0x19ee8, // 890
        0x18e64, 0x18622, 0x19ee4, 0x18e62, 0x19ee2, 0x10428, 0x18216, 0x10c68, 0x18636, 0x11ce8, // 900
        0x10c64, 0x10422, 0x13de8, 0x11ce4, 0x10c62, 0x13de4, 0x11ce2, 0x10436, 0x10c76, 0x11cf6, // 910
        0x13df6, 0x1f7d4, 0x1f7d2, 0x1e794, 0x1efb4, 0x1e792, 0x1efb2, 0x1c714, 0x1cf34, 0x1c712, // 920
        0x1df74, 0x1cf32, 0x1df72, 0x18614, 0x18e34, 0x18612, 0x19e74, 0x18e32, 0x1bef4],        // 929
    // cluster 3
    [0x1f560, 0x1fab8, 0x1ea40, 0x1f530, 0x1fa9c, 0x1ea20, 0x1f518, 0x1fa8e, 0x1ea10, 0x1f50c, //  10
        0x1ea08, 0x1f506, 0x1ea04, 0x1eb60, 0x1f5b8, 0x1fade, 0x1d640, 0x1eb30, 0x1f59c, 0x1d620, //  20
        0x1eb18, 0x1f58e, 0x1d610, 0x1eb0c, 0x1d608, 0x1eb06, 0x1d604, 0x1d760, 0x1ebb8, 0x1f5de, //  30
        0x1ae40, 0x1d730, 0x1eb9c, 0x1ae20, 0x1d718, 0x1eb8e, 0x1ae10, 0x1d70c, 0x1ae08, 0x1d706, //  40
        0x1ae04, 0x1af60, 0x1d7b8, 0x1ebde, 0x15e40, 0x1af30, 0x1d79c, 0x15e20, 0x1af18, 0x1d78e, //  50
        0x15e10, 0x1af0c, 0x15e08, 0x1af06, 0x15f60, 0x1afb8, 0x1d7de, 0x15f30, 0x1af9c, 0x15f18, //  60
        0x1af8e, 0x15f0c, 0x15fb8, 0x1afde, 0x15f9c, 0x15f8e, 0x1e940, 0x1f4b0, 0x1fa5c, 0x1e920, //  70
        0x1f498, 0x1fa4e, 0x1e910, 0x1f48c, 0x1e908, 0x1f486, 0x1e904, 0x1e902, 0x1d340, 0x1e9b0, //  80
        0x1f4dc, 0x1d320, 0x1e998, 0x1f4ce, 0x1d310, 0x1e98c, 0x1d308, 0x1e986, 0x1d304, 0x1d302, //  90
        0x1a740, 0x1d3b0, 0x1e9dc, 0x1a720, 0x1d398, 0x1e9ce, 0x1a710, 0x1d38c, 0x1a708, 0x1d386, // 100
        0x1a704, 0x1a702, 0x14f40, 0x1a7b0, 0x1d3dc, 0x14f20, 0x1a798, 0x1d3ce, 0x14f10, 0x1a78c, // 110
        0x14f08, 0x1a786, 0x14f04, 0x14fb0, 0x1a7dc, 0x14f98, 0x1a7ce, 0x14f8c, 0x14f86, 0x14fdc, // 120
        0x14fce, 0x1e8a0, 0x1f458, 0x1fa2e, 0x1e890, 0x1f44c, 0x1e888, 0x1f446, 0x1e884, 0x1e882, // 130
        0x1d1a0, 0x1e8d8, 0x1f46e, 0x1d190, 0x1e8cc, 0x1d188, 0x1e8c6, 0x1d184, 0x1d182, 0x1a3a0, // 140
        0x1d1d8, 0x1e8ee, 0x1a390, 0x1d1cc, 0x1a388, 0x1d1c6, 0x1a384, 0x1a382, 0x147a0, 0x1a3d8, // 150
        0x1d1ee, 0x14790, 0x1a3cc, 0x14788, 0x1a3c6, 0x14784, 0x14782, 0x147d8, 0x1a3ee, 0x147cc, // 160
        0x147c6, 0x147ee, 0x1e850, 0x1f42c, 0x1e848, 0x1f426, 0x1e844, 0x1e842, 0x1d0d0, 0x1e86c, // 170
        0x1d0c8, 0x1e866, 0x1d0c4, 0x1d0c2, 0x1a1d0, 0x1d0ec, 0x1a1c8, 0x1d0e6, 0x1a1c4, 0x1a1c2, // 180
        0x143d0, 0x1a1ec, 0x143c8, 0x1a1e6, 0x143c4, 0x143c2, 0x143ec, 0x143e6, 0x1e828, 0x1f416, // 190
        0x1e824, 0x1e822, 0x1d068, 0x1e836, 0x1d064, 0x1d062, 0x1a0e8, 0x1d076, 0x1a0e4, 0x1a0e2, // 200
        0x141e8, 0x1a0f6, 0x141e4, 0x141e2, 0x1e814, 0x1e812, 0x1d034, 0x1d032, 0x1a074, 0x1a072, // 210
        0x1e540, 0x1f2b0, 0x1f95c, 0x1e520, 0x1f298, 0x1f94e, 0x1e510, 0x1f28c, 0x1e508, 0x1f286, // 220
        0x1e504, 0x1e502, 0x1cb40, 0x1e5b0, 0x1f2dc, 0x1cb20, 0x1e598, 0x1f2ce, 0x1cb10, 0x1e58c, // 230
        0x1cb08, 0x1e586, 0x1cb04, 0x1cb02, 0x19740, 0x1cbb0, 0x1e5dc, 0x19720, 0x1cb98, 0x1e5ce, // 240
        0x19710, 0x1cb8c, 0x19708, 0x1cb86, 0x19704, 0x19702, 0x12f40, 0x197b0, 0x1cbdc, 0x12f20, // 250
        0x19798, 0x1cbce, 0x12f10, 0x1978c, 0x12f08, 0x19786, 0x12f04, 0x12fb0, 0x197dc, 0x12f98, // 260
        0x197ce, 0x12f8c, 0x12f86, 0x12fdc, 0x12fce, 0x1f6a0, 0x1fb58, 0x16bf0, 0x1f690, 0x1fb4c, // 270
        0x169f8, 0x1f688, 0x1fb46, 0x168fc, 0x1f684, 0x1f682, 0x1e4a0, 0x1f258, 0x1f92e, 0x1eda0, // 280
        0x1e490, 0x1fb6e, 0x1ed90, 0x1f6cc, 0x1f246, 0x1ed88, 0x1e484, 0x1ed84, 0x1e482, 0x1ed82, // 290
        0x1c9a0, 0x1e4d8, 0x1f26e, 0x1dba0, 0x1c990, 0x1e4cc, 0x1db90, 0x1edcc, 0x1e4c6, 0x1db88, // 300
        0x1c984, 0x1db84, 0x1c982, 0x1db82, 0x193a0, 0x1c9d8, 0x1e4ee, 0x1b7a0, 0x19390, 0x1c9cc, // 310
        0x1b790, 0x1dbcc, 0x1c9c6, 0x1b788, 0x19384, 0x1b784, 0x19382, 0x1b782, 0x127a0, 0x193d8, // 320
        0x1c9ee, 0x16fa0, 0x12790, 0x193cc, 0x16f90, 0x1b7cc, 0x193c6, 0x16f88, 0x12784, 0x16f84, // 330
        0x12782, 0x127d8, 0x193ee, 0x16fd8, 0x127cc, 0x16fcc, 0x127c6, 0x16fc6, 0x127ee, 0x1f650, // 340
        0x1fb2c, 0x165f8, 0x1f648, 0x1fb26, 0x164fc, 0x1f644, 0x1647e, 0x1f642, 0x1e450, 0x1f22c, // 350
        0x1ecd0, 0x1e448, 0x1f226, 0x1ecc8, 0x1f666, 0x1ecc4, 0x1e442, 0x1ecc2, 0x1c8d0, 0x1e46c, // 360
        0x1d9d0, 0x1c8c8, 0x1e466, 0x1d9c8, 0x1ece6, 0x1d9c4, 0x1c8c2, 0x1d9c2, 0x191d0, 0x1c8ec, // 370
        0x1b3d0, 0x191c8, 0x1c8e6, 0x1b3c8, 0x1d9e6, 0x1b3c4, 0x191c2, 0x1b3c2, 0x123d0, 0x191ec, // 380
        0x167d0, 0x123c8, 0x191e6, 0x167c8, 0x1b3e6, 0x167c4, 0x123c2, 0x167c2, 0x123ec, 0x167ec, // 390
        0x123e6, 0x167e6, 0x1f628, 0x1fb16, 0x162fc, 0x1f624, 0x1627e, 0x1f622, 0x1e428, 0x1f216, // 400
        0x1ec68, 0x1f636, 0x1ec64, 0x1e422, 0x1ec62, 0x1c868, 0x1e436, 0x1d8e8, 0x1c864, 0x1d8e4, // 410
        0x1c862, 0x1d8e2, 0x190e8, 0x1c876, 0x1b1e8, 0x1d8f6, 0x1b1e4, 0x190e2, 0x1b1e2, 0x121e8, // 420
        0x190f6, 0x163e8, 0x121e4, 0x163e4, 0x121e2, 0x163e2, 0x121f6, 0x163f6, 0x1f614, 0x1617e, // 430
        0x1f612, 0x1e414, 0x1ec34, 0x1e412, 0x1ec32, 0x1c834, 0x1d874, 0x1c832, 0x1d872, 0x19074, // 440
        0x1b0f4, 0x19072, 0x1b0f2, 0x120f4, 0x161f4, 0x120f2, 0x161f2, 0x1f60a, 0x1e40a, 0x1ec1a, // 450
        0x1c81a, 0x1d83a, 0x1903a, 0x1b07a, 0x1e2a0, 0x1f158, 0x1f8ae, 0x1e290, 0x1f14c, 0x1e288, // 460
        0x1f146, 0x1e284, 0x1e282, 0x1c5a0, 0x1e2d8, 0x1f16e, 0x1c590, 0x1e2cc, 0x1c588, 0x1e2c6, // 470
        0x1c584, 0x1c582, 0x18ba0, 0x1c5d8, 0x1e2ee, 0x18b90, 0x1c5cc, 0x18b88, 0x1c5c6, 0x18b84, // 480
        0x18b82, 0x117a0, 0x18bd8, 0x1c5ee, 0x11790, 0x18bcc, 0x11788, 0x18bc6, 0x11784, 0x11782, // 490
        0x117d8, 0x18bee, 0x117cc, 0x117c6, 0x117ee, 0x1f350, 0x1f9ac, 0x135f8, 0x1f348, 0x1f9a6, // 500
        0x134fc, 0x1f344, 0x1347e, 0x1f342, 0x1e250, 0x1f12c, 0x1e6d0, 0x1e248, 0x1f126, 0x1e6c8, // 510
        0x1f366, 0x1e6c4, 0x1e242, 0x1e6c2, 0x1c4d0, 0x1e26c, 0x1cdd0, 0x1c4c8, 0x1e266, 0x1cdc8, // 520
        0x1e6e6, 0x1cdc4, 0x1c4c2, 0x1cdc2, 0x189d0, 0x1c4ec, 0x19bd0, 0x189c8, 0x1c4e6, 0x19bc8, // 530
        0x1cde6, 0x19bc4, 0x189c2, 0x19bc2, 0x113d0, 0x189ec, 0x137d0, 0x113c8, 0x189e6, 0x137c8, // 540
        0x19be6, 0x137c4, 0x113c2, 0x137c2, 0x113ec, 0x137ec, 0x113e6, 0x137e6, 0x1fba8, 0x175f0, // 550
        0x1bafc, 0x1fba4, 0x174f8, 0x1ba7e, 0x1fba2, 0x1747c, 0x1743e, 0x1f328, 0x1f996, 0x132fc, // 560
        0x1f768, 0x1fbb6, 0x176fc, 0x1327e, 0x1f764, 0x1f322, 0x1767e, 0x1f762, 0x1e228, 0x1f116, // 570
        0x1e668, 0x1e224, 0x1eee8, 0x1f776, 0x1e222, 0x1eee4, 0x1e662, 0x1eee2, 0x1c468, 0x1e236, // 580
        0x1cce8, 0x1c464, 0x1dde8, 0x1cce4, 0x1c462, 0x1dde4, 0x1cce2, 0x1dde2, 0x188e8, 0x1c476, // 590
        0x199e8, 0x188e4, 0x1bbe8, 0x199e4, 0x188e2, 0x1bbe4, 0x199e2, 0x1bbe2, 0x111e8, 0x188f6, // 600
        0x133e8, 0x111e4, 0x177e8, 0x133e4, 0x111e2, 0x177e4, 0x133e2, 0x177e2, 0x111f6, 0x133f6, // 610
        0x1fb94, 0x172f8, 0x1b97e, 0x1fb92, 0x1727c, 0x1723e, 0x1f314, 0x1317e, 0x1f734, 0x1f312, // 620
        0x1737e, 0x1f732, 0x1e214, 0x1e634, 0x1e212, 0x1ee74, 0x1e632, 0x1ee72, 0x1c434, 0x1cc74, // 630
        0x1c432, 0x1dcf4, 0x1cc72, 0x1dcf2, 0x18874, 0x198f4, 0x18872, 0x1b9f4, 0x198f2, 0x1b9f2, // 640
        0x110f4, 0x131f4, 0x110f2, 0x173f4, 0x131f2, 0x173f2, 0x1fb8a, 0x1717c, 0x1713e, 0x1f30a, // 650
        0x1f71a, 0x1e20a, 0x1e61a, 0x1ee3a, 0x1c41a, 0x1cc3a, 0x1dc7a, 0x1883a, 0x1987a, 0x1b8fa, // 660
        0x1107a, 0x130fa, 0x171fa, 0x170be, 0x1e150, 0x1f0ac, 0x1e148, 0x1f0a6, 0x1e144, 0x1e142, // 670
        0x1c2d0, 0x1e16c, 0x1c2c8, 0x1e166, 0x1c2c4, 0x1c2c2, 0x185d0, 0x1c2ec, 0x185c8, 0x1c2e6, // 680
        0x185c4, 0x185c2, 0x10bd0, 0x185ec, 0x10bc8, 0x185e6, 0x10bc4, 0x10bc2, 0x10bec, 0x10be6, // 690
        0x1f1a8, 0x1f8d6, 0x11afc, 0x1f1a4, 0x11a7e, 0x1f1a2, 0x1e128, 0x1f096, 0x1e368, 0x1e124, // 700
        0x1e364, 0x1e122, 0x1e362, 0x1c268, 0x1e136, 0x1c6e8, 0x1c264, 0x1c6e4, 0x1c262, 0x1c6e2, // 710
        0x184e8, 0x1c276, 0x18de8, 0x184e4, 0x18de4, 0x184e2, 0x18de2, 0x109e8, 0x184f6, 0x11be8, // 720
        0x109e4, 0x11be4, 0x109e2, 0x11be2, 0x109f6, 0x11bf6, 0x1f9d4, 0x13af8, 0x19d7e, 0x1f9d2, // 730
        0x13a7c, 0x13a3e, 0x1f194, 0x1197e, 0x1f3b4, 0x1f192, 0x13b7e, 0x1f3b2, 0x1e114, 0x1e334, // 740
        0x1e112, 0x1e774, 0x1e332, 0x1e772, 0x1c234, 0x1c674, 0x1c232, 0x1cef4, 0x1c672, 0x1cef2, // 750
        0x18474, 0x18cf4, 0x18472, 0x19df4, 0x18cf2, 0x19df2, 0x108f4, 0x119f4, 0x108f2, 0x13bf4, // 760
        0x119f2, 0x13bf2, 0x17af0, 0x1bd7c, 0x17a78, 0x1bd3e, 0x17a3c, 0x17a1e, 0x1f9ca, 0x1397c, // 770
        0x1fbda, 0x17b7c, 0x1393e, 0x17b3e, 0x1f18a, 0x1f39a, 0x1f7ba, 0x1e10a, 0x1e31a, 0x1e73a, // 780
        0x1ef7a, 0x1c21a, 0x1c63a, 0x1ce7a, 0x1defa, 0x1843a, 0x18c7a, 0x19cfa, 0x1bdfa, 0x1087a, // 790
        0x118fa, 0x139fa, 0x17978, 0x1bcbe, 0x1793c, 0x1791e, 0x138be, 0x179be, 0x178bc, 0x1789e, // 800
        0x1785e, 0x1e0a8, 0x1e0a4, 0x1e0a2, 0x1c168, 0x1e0b6, 0x1c164, 0x1c162, 0x182e8, 0x1c176, // 810
        0x182e4, 0x182e2, 0x105e8, 0x182f6, 0x105e4, 0x105e2, 0x105f6, 0x1f0d4, 0x10d7e, 0x1f0d2, // 820
        0x1e094, 0x1e1b4, 0x1e092, 0x1e1b2, 0x1c134, 0x1c374, 0x1c132, 0x1c372, 0x18274, 0x186f4, // 830
        0x18272, 0x186f2, 0x104f4, 0x10df4, 0x104f2, 0x10df2, 0x1f8ea, 0x11d7c, 0x11d3e, 0x1f0ca, // 840
        0x1f1da, 0x1e08a, 0x1e19a, 0x1e3ba, 0x1c11a, 0x1c33a, 0x1c77a, 0x1823a, 0x1867a, 0x18efa, // 850
        0x1047a, 0x10cfa, 0x11dfa, 0x13d78, 0x19ebe, 0x13d3c, 0x13d1e, 0x11cbe, 0x13dbe, 0x17d70, // 860
        0x1bebc, 0x17d38, 0x1be9e, 0x17d1c, 0x17d0e, 0x13cbc, 0x17dbc, 0x13c9e, 0x17d9e, 0x17cb8, // 870
        0x1be5e, 0x17c9c, 0x17c8e, 0x13c5e, 0x17cde, 0x17c5c, 0x17c4e, 0x17c2e, 0x1c0b4, 0x1c0b2, // 880
        0x18174, 0x18172, 0x102f4, 0x102f2, 0x1e0da, 0x1c09a, 0x1c1ba, 0x1813a, 0x1837a, 0x1027a, // 890
        0x106fa, 0x10ebe, 0x11ebc, 0x11e9e, 0x13eb8, 0x19f5e, 0x13e9c, 0x13e8e, 0x11e5e, 0x13ede, // 900
        0x17eb0, 0x1bf5c, 0x17e98, 0x1bf4e, 0x17e8c, 0x17e86, 0x13e5c, 0x17edc, 0x13e4e, 0x17ece, // 910
        0x17e58, 0x1bf2e, 0x17e4c, 0x17e46, 0x13e2e, 0x17e6e, 0x17e2c, 0x17e26, 0x10f5e, 0x11f5c, // 920
        0x11f4e, 0x13f58, 0x19fae, 0x13f4c, 0x13f46, 0x11f2e, 0x13f6e, 0x13f2c, 0x13f26],        // 929
    // cluster 6
    [0x1abe0, 0x1d5f8, 0x153c0, 0x1a9f0, 0x1d4fc, 0x151e0, 0x1a8f8, 0x1d47e, 0x150f0, 0x1a87c, //  10
        0x15078, 0x1fad0, 0x15be0, 0x1adf8, 0x1fac8, 0x159f0, 0x1acfc, 0x1fac4, 0x158f8, 0x1ac7e, //  20
        0x1fac2, 0x1587c, 0x1f5d0, 0x1faec, 0x15df8, 0x1f5c8, 0x1fae6, 0x15cfc, 0x1f5c4, 0x15c7e, //  30
        0x1f5c2, 0x1ebd0, 0x1f5ec, 0x1ebc8, 0x1f5e6, 0x1ebc4, 0x1ebc2, 0x1d7d0, 0x1ebec, 0x1d7c8, //  40
        0x1ebe6, 0x1d7c4, 0x1d7c2, 0x1afd0, 0x1d7ec, 0x1afc8, 0x1d7e6, 0x1afc4, 0x14bc0, 0x1a5f0, //  50
        0x1d2fc, 0x149e0, 0x1a4f8, 0x1d27e, 0x148f0, 0x1a47c, 0x14878, 0x1a43e, 0x1483c, 0x1fa68, //  60
        0x14df0, 0x1a6fc, 0x1fa64, 0x14cf8, 0x1a67e, 0x1fa62, 0x14c7c, 0x14c3e, 0x1f4e8, 0x1fa76, //  70
        0x14efc, 0x1f4e4, 0x14e7e, 0x1f4e2, 0x1e9e8, 0x1f4f6, 0x1e9e4, 0x1e9e2, 0x1d3e8, 0x1e9f6, //  80
        0x1d3e4, 0x1d3e2, 0x1a7e8, 0x1d3f6, 0x1a7e4, 0x1a7e2, 0x145e0, 0x1a2f8, 0x1d17e, 0x144f0, //  90
        0x1a27c, 0x14478, 0x1a23e, 0x1443c, 0x1441e, 0x1fa34, 0x146f8, 0x1a37e, 0x1fa32, 0x1467c, // 100
        0x1463e, 0x1f474, 0x1477e, 0x1f472, 0x1e8f4, 0x1e8f2, 0x1d1f4, 0x1d1f2, 0x1a3f4, 0x1a3f2, // 110
        0x142f0, 0x1a17c, 0x14278, 0x1a13e, 0x1423c, 0x1421e, 0x1fa1a, 0x1437c, 0x1433e, 0x1f43a, // 120
        0x1e87a, 0x1d0fa, 0x14178, 0x1a0be, 0x1413c, 0x1411e, 0x141be, 0x140bc, 0x1409e, 0x12bc0, // 130
        0x195f0, 0x1cafc, 0x129e0, 0x194f8, 0x1ca7e, 0x128f0, 0x1947c, 0x12878, 0x1943e, 0x1283c, // 140
        0x1f968, 0x12df0, 0x196fc, 0x1f964, 0x12cf8, 0x1967e, 0x1f962, 0x12c7c, 0x12c3e, 0x1f2e8, // 150
        0x1f976, 0x12efc, 0x1f2e4, 0x12e7e, 0x1f2e2, 0x1e5e8, 0x1f2f6, 0x1e5e4, 0x1e5e2, 0x1cbe8, // 160
        0x1e5f6, 0x1cbe4, 0x1cbe2, 0x197e8, 0x1cbf6, 0x197e4, 0x197e2, 0x1b5e0, 0x1daf8, 0x1ed7e, // 170
        0x169c0, 0x1b4f0, 0x1da7c, 0x168e0, 0x1b478, 0x1da3e, 0x16870, 0x1b43c, 0x16838, 0x1b41e, // 180
        0x1681c, 0x125e0, 0x192f8, 0x1c97e, 0x16de0, 0x124f0, 0x1927c, 0x16cf0, 0x1b67c, 0x1923e, // 190
        0x16c78, 0x1243c, 0x16c3c, 0x1241e, 0x16c1e, 0x1f934, 0x126f8, 0x1937e, 0x1fb74, 0x1f932, // 200
        0x16ef8, 0x1267c, 0x1fb72, 0x16e7c, 0x1263e, 0x16e3e, 0x1f274, 0x1277e, 0x1f6f4, 0x1f272, // 210
        0x16f7e, 0x1f6f2, 0x1e4f4, 0x1edf4, 0x1e4f2, 0x1edf2, 0x1c9f4, 0x1dbf4, 0x1c9f2, 0x1dbf2, // 220
        0x193f4, 0x193f2, 0x165c0, 0x1b2f0, 0x1d97c, 0x164e0, 0x1b278, 0x1d93e, 0x16470, 0x1b23c, // 230
        0x16438, 0x1b21e, 0x1641c, 0x1640e, 0x122f0, 0x1917c, 0x166f0, 0x12278, 0x1913e, 0x16678, // 240
        0x1b33e, 0x1663c, 0x1221e, 0x1661e, 0x1f91a, 0x1237c, 0x1fb3a, 0x1677c, 0x1233e, 0x1673e, // 250
        0x1f23a, 0x1f67a, 0x1e47a, 0x1ecfa, 0x1c8fa, 0x1d9fa, 0x191fa, 0x162e0, 0x1b178, 0x1d8be, // 260
        0x16270, 0x1b13c, 0x16238, 0x1b11e, 0x1621c, 0x1620e, 0x12178, 0x190be, 0x16378, 0x1213c, // 270
        0x1633c, 0x1211e, 0x1631e, 0x121be, 0x163be, 0x16170, 0x1b0bc, 0x16138, 0x1b09e, 0x1611c, // 280
        0x1610e, 0x120bc, 0x161bc, 0x1209e, 0x1619e, 0x160b8, 0x1b05e, 0x1609c, 0x1608e, 0x1205e, // 290
        0x160de, 0x1605c, 0x1604e, 0x115e0, 0x18af8, 0x1c57e, 0x114f0, 0x18a7c, 0x11478, 0x18a3e, // 300
        0x1143c, 0x1141e, 0x1f8b4, 0x116f8, 0x18b7e, 0x1f8b2, 0x1167c, 0x1163e, 0x1f174, 0x1177e, // 310
        0x1f172, 0x1e2f4, 0x1e2f2, 0x1c5f4, 0x1c5f2, 0x18bf4, 0x18bf2, 0x135c0, 0x19af0, 0x1cd7c, // 320
        0x134e0, 0x19a78, 0x1cd3e, 0x13470, 0x19a3c, 0x13438, 0x19a1e, 0x1341c, 0x1340e, 0x112f0, // 330
        0x1897c, 0x136f0, 0x11278, 0x1893e, 0x13678, 0x19b3e, 0x1363c, 0x1121e, 0x1361e, 0x1f89a, // 340
        0x1137c, 0x1f9ba, 0x1377c, 0x1133e, 0x1373e, 0x1f13a, 0x1f37a, 0x1e27a, 0x1e6fa, 0x1c4fa, // 350
        0x1cdfa, 0x189fa, 0x1bae0, 0x1dd78, 0x1eebe, 0x174c0, 0x1ba70, 0x1dd3c, 0x17460, 0x1ba38, // 360
        0x1dd1e, 0x17430, 0x1ba1c, 0x17418, 0x1ba0e, 0x1740c, 0x132e0, 0x19978, 0x1ccbe, 0x176e0, // 370
        0x13270, 0x1993c, 0x17670, 0x1bb3c, 0x1991e, 0x17638, 0x1321c, 0x1761c, 0x1320e, 0x1760e, // 380
        0x11178, 0x188be, 0x13378, 0x1113c, 0x17778, 0x1333c, 0x1111e, 0x1773c, 0x1331e, 0x1771e, // 390
        0x111be, 0x133be, 0x177be, 0x172c0, 0x1b970, 0x1dcbc, 0x17260, 0x1b938, 0x1dc9e, 0x17230, // 400
        0x1b91c, 0x17218, 0x1b90e, 0x1720c, 0x17206, 0x13170, 0x198bc, 0x17370, 0x13138, 0x1989e, // 410
        0x17338, 0x1b99e, 0x1731c, 0x1310e, 0x1730e, 0x110bc, 0x131bc, 0x1109e, 0x173bc, 0x1319e, // 420
        0x1739e, 0x17160, 0x1b8b8, 0x1dc5e, 0x17130, 0x1b89c, 0x17118, 0x1b88e, 0x1710c, 0x17106, // 430
        0x130b8, 0x1985e, 0x171b8, 0x1309c, 0x1719c, 0x1308e, 0x1718e, 0x1105e, 0x130de, 0x171de, // 440
        0x170b0, 0x1b85c, 0x17098, 0x1b84e, 0x1708c, 0x17086, 0x1305c, 0x170dc, 0x1304e, 0x170ce, // 450
        0x17058, 0x1b82e, 0x1704c, 0x17046, 0x1302e, 0x1706e, 0x1702c, 0x17026, 0x10af0, 0x1857c, // 460
        0x10a78, 0x1853e, 0x10a3c, 0x10a1e, 0x10b7c, 0x10b3e, 0x1f0ba, 0x1e17a, 0x1c2fa, 0x185fa, // 470
        0x11ae0, 0x18d78, 0x1c6be, 0x11a70, 0x18d3c, 0x11a38, 0x18d1e, 0x11a1c, 0x11a0e, 0x10978, // 480
        0x184be, 0x11b78, 0x1093c, 0x11b3c, 0x1091e, 0x11b1e, 0x109be, 0x11bbe, 0x13ac0, 0x19d70, // 490
        0x1cebc, 0x13a60, 0x19d38, 0x1ce9e, 0x13a30, 0x19d1c, 0x13a18, 0x19d0e, 0x13a0c, 0x13a06, // 500
        0x11970, 0x18cbc, 0x13b70, 0x11938, 0x18c9e, 0x13b38, 0x1191c, 0x13b1c, 0x1190e, 0x13b0e, // 510
        0x108bc, 0x119bc, 0x1089e, 0x13bbc, 0x1199e, 0x13b9e, 0x1bd60, 0x1deb8, 0x1ef5e, 0x17a40, // 520
        0x1bd30, 0x1de9c, 0x17a20, 0x1bd18, 0x1de8e, 0x17a10, 0x1bd0c, 0x17a08, 0x1bd06, 0x17a04, // 530
        0x13960, 0x19cb8, 0x1ce5e, 0x17b60, 0x13930, 0x19c9c, 0x17b30, 0x1bd9c, 0x19c8e, 0x17b18, // 540
        0x1390c, 0x17b0c, 0x13906, 0x17b06, 0x118b8, 0x18c5e, 0x139b8, 0x1189c, 0x17bb8, 0x1399c, // 550
        0x1188e, 0x17b9c, 0x1398e, 0x17b8e, 0x1085e, 0x118de, 0x139de, 0x17bde, 0x17940, 0x1bcb0, // 560
        0x1de5c, 0x17920, 0x1bc98, 0x1de4e, 0x17910, 0x1bc8c, 0x17908, 0x1bc86, 0x17904, 0x17902, // 570
        0x138b0, 0x19c5c, 0x179b0, 0x13898, 0x19c4e, 0x17998, 0x1bcce, 0x1798c, 0x13886, 0x17986, // 580
        0x1185c, 0x138dc, 0x1184e, 0x179dc, 0x138ce, 0x179ce, 0x178a0, 0x1bc58, 0x1de2e, 0x17890, // 590
        0x1bc4c, 0x17888, 0x1bc46, 0x17884, 0x17882, 0x13858, 0x19c2e, 0x178d8, 0x1384c, 0x178cc, // 600
        0x13846, 0x178c6, 0x1182e, 0x1386e, 0x178ee, 0x17850, 0x1bc2c, 0x17848, 0x1bc26, 0x17844, // 610
        0x17842, 0x1382c, 0x1786c, 0x13826, 0x17866, 0x17828, 0x1bc16, 0x17824, 0x17822, 0x13816, // 620
        0x17836, 0x10578, 0x182be, 0x1053c, 0x1051e, 0x105be, 0x10d70, 0x186bc, 0x10d38, 0x1869e, // 630
        0x10d1c, 0x10d0e, 0x104bc, 0x10dbc, 0x1049e, 0x10d9e, 0x11d60, 0x18eb8, 0x1c75e, 0x11d30, // 640
        0x18e9c, 0x11d18, 0x18e8e, 0x11d0c, 0x11d06, 0x10cb8, 0x1865e, 0x11db8, 0x10c9c, 0x11d9c, // 650
        0x10c8e, 0x11d8e, 0x1045e, 0x10cde, 0x11dde, 0x13d40, 0x19eb0, 0x1cf5c, 0x13d20, 0x19e98, // 660
        0x1cf4e, 0x13d10, 0x19e8c, 0x13d08, 0x19e86, 0x13d04, 0x13d02, 0x11cb0, 0x18e5c, 0x13db0, // 670
        0x11c98, 0x18e4e, 0x13d98, 0x19ece, 0x13d8c, 0x11c86, 0x13d86, 0x10c5c, 0x11cdc, 0x10c4e, // 680
        0x13ddc, 0x11cce, 0x13dce, 0x1bea0, 0x1df58, 0x1efae, 0x1be90, 0x1df4c, 0x1be88, 0x1df46, // 690
        0x1be84, 0x1be82, 0x13ca0, 0x19e58, 0x1cf2e, 0x17da0, 0x13c90, 0x19e4c, 0x17d90, 0x1becc, // 700
        0x19e46, 0x17d88, 0x13c84, 0x17d84, 0x13c82, 0x17d82, 0x11c58, 0x18e2e, 0x13cd8, 0x11c4c, // 710
        0x17dd8, 0x13ccc, 0x11c46, 0x17dcc, 0x13cc6, 0x17dc6, 0x10c2e, 0x11c6e, 0x13cee, 0x17dee, // 720
        0x1be50, 0x1df2c, 0x1be48, 0x1df26, 0x1be44, 0x1be42, 0x13c50, 0x19e2c, 0x17cd0, 0x13c48, // 730
        0x19e26, 0x17cc8, 0x1be66, 0x17cc4, 0x13c42, 0x17cc2, 0x11c2c, 0x13c6c, 0x11c26, 0x17cec, // 740
        0x13c66, 0x17ce6, 0x1be28, 0x1df16, 0x1be24, 0x1be22, 0x13c28, 0x19e16, 0x17c68, 0x13c24, // 750
        0x17c64, 0x13c22, 0x17c62, 0x11c16, 0x13c36, 0x17c76, 0x1be14, 0x1be12, 0x13c14, 0x17c34, // 760
        0x13c12, 0x17c32, 0x102bc, 0x1029e, 0x106b8, 0x1835e, 0x1069c, 0x1068e, 0x1025e, 0x106de, // 770
        0x10eb0, 0x1875c, 0x10e98, 0x1874e, 0x10e8c, 0x10e86, 0x1065c, 0x10edc, 0x1064e, 0x10ece, // 780
        0x11ea0, 0x18f58, 0x1c7ae, 0x11e90, 0x18f4c, 0x11e88, 0x18f46, 0x11e84, 0x11e82, 0x10e58, // 790
        0x1872e, 0x11ed8, 0x18f6e, 0x11ecc, 0x10e46, 0x11ec6, 0x1062e, 0x10e6e, 0x11eee, 0x19f50, // 800
        0x1cfac, 0x19f48, 0x1cfa6, 0x19f44, 0x19f42, 0x11e50, 0x18f2c, 0x13ed0, 0x19f6c, 0x18f26, // 810
        0x13ec8, 0x11e44, 0x13ec4, 0x11e42, 0x13ec2, 0x10e2c, 0x11e6c, 0x10e26, 0x13eec, 0x11e66, // 820
        0x13ee6, 0x1dfa8, 0x1efd6, 0x1dfa4, 0x1dfa2, 0x19f28, 0x1cf96, 0x1bf68, 0x19f24, 0x1bf64, // 830
        0x19f22, 0x1bf62, 0x11e28, 0x18f16, 0x13e68, 0x11e24, 0x17ee8, 0x13e64, 0x11e22, 0x17ee4, // 840
        0x13e62, 0x17ee2, 0x10e16, 0x11e36, 0x13e76, 0x17ef6, 0x1df94, 0x1df92, 0x19f14, 0x1bf34, // 850
        0x19f12, 0x1bf32, 0x11e14, 0x13e34, 0x11e12, 0x17e74, 0x13e32, 0x17e72, 0x1df8a, 0x19f0a, // 860
        0x1bf1a, 0x11e0a, 0x13e1a, 0x17e3a, 0x1035c, 0x1034e, 0x10758, 0x183ae, 0x1074c, 0x10746, // 870
        0x1032e, 0x1076e, 0x10f50, 0x187ac, 0x10f48, 0x187a6, 0x10f44, 0x10f42, 0x1072c, 0x10f6c, // 880
        0x10726, 0x10f66, 0x18fa8, 0x1c7d6, 0x18fa4, 0x18fa2, 0x10f28, 0x18796, 0x11f68, 0x18fb6, // 890
        0x11f64, 0x10f22, 0x11f62, 0x10716, 0x10f36, 0x11f76, 0x1cfd4, 0x1cfd2, 0x18f94, 0x19fb4, // 900
        0x18f92, 0x19fb2, 0x10f14, 0x11f34, 0x10f12, 0x13f74, 0x11f32, 0x13f72, 0x1cfca, 0x18f8a, // 910
        0x19f9a, 0x10f0a, 0x11f1a, 0x13f3a, 0x103ac, 0x103a6, 0x107a8, 0x183d6, 0x107a4, 0x107a2, // 920
        0x10396, 0x107b6, 0x187d4, 0x187d2, 0x10794, 0x10fb4, 0x10792, 0x10fb2, 0x1c7ea]         // 929 
];

const mode_ll = '\u2000', mode_ps = '\u2001', mode_ml = '\u2002', mode_al = '\u2003', mode_pl = '\u2004', mode_as = '\u2005';

export const subModeMap = {
    ll: mode_ll,
    ps: mode_ps,
    ml: mode_ml,
    al: mode_al,
    pl: mode_pl,
    as: mode_as
};

const TEXT_MAP = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ ' + mode_ll + mode_ml + mode_ps,
    'abcdefghijklmnopqrstuvwxyz ' + mode_as + mode_ml + mode_ps,
    '0123456789&\r\t,:#-.$/+%*=^\u2004 ' + mode_ll + mode_al + mode_ps,
    ';<>@[\\]_`~!\r\t,:\n-.$/"|*()?{}\'' + mode_al
];

export const MODE_TC = 900, MODE_BC = 901, MODE_NC = 902, MODE_BC6 = 924, MODE_BC_SHIFT = 913;

function isAlpha(c) {
    return TEXT_MAP[0].indexOf(c) > -1;
}
function isLower(c) {
    return TEXT_MAP[1].indexOf(c) > -1;
}
function isMixed(c) {
    return TEXT_MAP[2].indexOf(c) > -1;
}
function isPunctuation(c) {
    return TEXT_MAP[3].indexOf(c) > -1;
}

function isTC(c) {
    return isAlpha(c) || isLower(c) || isMixed(c) || isPunctuation(c);
}

function nextTC(text, pos) {
    let i = pos, len = text.length, nCount = 0;

    while (i < len) {
        if (text[i] >= '0' && text[i] <= '9') {
            nCount++;
        } else {
            nCount = 0;
        }
        if (!isTC(text[i])) {
            break;
        }
        if (nCount >= 13) {
            i -= --nCount;
            break;
        }
        i++;
    }

    return text.substring(pos, i);
}

function nextNC(text, pos) {
    let i = pos, len = text.length;
    while (i < len) {
        if (text[i] < '0' || text[i] > '9') {
            break;
        }
        i++;
    }
    return text.substring(pos, i);
}

function nextBC(text, pos) {
    let i = pos, len = text.length, nCount = 0, tCount = 0, lastIsText = false;
    while (i < len) {
        if (text[i] >= '0' && text[i] <= '9') {
            nCount++;
            if (lastIsText) {
                tCount = 0;
                lastIsText = false;
            }
        } else if (isTC(text[i])) {
            tCount++;

            if (!lastIsText) {
                nCount = 0;
                lastIsText = true;
            }
        }

        if (tCount >= 5) {
            i -= --tCount;
            break;
        }
        if (nCount >= 13) {
            i -= --nCount;
            break;
        }
        
        i++;
    }
    return text.substring(pos, i);
}

export function compaction(text, mode = CompactionMode.Auto) {
    let groups = [];

    if (mode === CompactionMode.Text) {
        groups = [{ mode: MODE_TC, text }];
    } else if (mode === CompactionMode.Byte) {
        groups = [{ mode: text.length % 6 === 0 ? MODE_BC6 : MODE_BC, text }];
    } else if (mode === CompactionMode.Numeric) {
        groups = [{ mode: MODE_NC, text }];
    } else {
        let pos = 0, len = text.length;
        let g = { mode: MODE_TC, text: '' };
        while (pos < len) {
            let numStr = nextNC(text, pos);

            if (numStr.length >= 13) {
                g = { mode: MODE_NC, text: numStr };
                groups.push(g);
                pos += numStr.length;
            } else {
                let tcStr = nextTC(text, pos);

                if (tcStr.length >= 5) {
                    g = { mode: MODE_TC, text: tcStr };
                    groups.push(g);
                    pos += tcStr.length;
                } else {
                    let bcStr = nextBC(text, pos);

                    if (bcStr.length === 1 && g.mode == MODE_TC) {
                        g = { mode: MODE_BC_SHIFT, text: bcStr };
                        groups.push(g);
                    } else {
                        if (bcStr.length % 6 === 0) {
                            g = { mode: MODE_BC6, text: bcStr };
                        } else {
                            g = { mode: MODE_BC, text: bcStr };
                        }
                        groups.push(g);
                    }
                    pos += bcStr.length;
                }
            }
        }
    }

    groups.forEach((g) => {
        if (g.mode == MODE_TC) {
            let currentSubMode = { mode: 'al', text: '' };
            let subModes = [currentSubMode];
            g.subModes = subModes;
            for (let i = 0, len = g.text.length; i < len; i++) {
                let c = g.text[i];

                if (isAlpha(c)) {
                    if (i === 0 || currentSubMode.mode === 'al') {
                        currentSubMode.text += c;
                    } else {
                        let nextC = g.text[i + 1];
                        if (isAlpha(nextC)) {
                            currentSubMode = { mode: 'al', text: c };
                        } else {
                            if (currentSubMode.mode === 'll') {
                                currentSubMode = { mode: 'as', text: c };
                            } else {
                                currentSubMode = { mode: 'al', text: c };
                            }
                        }
                        subModes.push(currentSubMode);
                    }
                } else if (isLower(c)) {
                    if (currentSubMode.mode === 'll') {
                        currentSubMode.text += c;
                    } else {
                        currentSubMode = { mode: 'll', text: c };
                        subModes.push(currentSubMode);
                    }
                } else if (isMixed(c)) {
                    if (currentSubMode.mode === 'pl' && isPunctuation(c)) {
                        currentSubMode.text += c;
                    } else if (currentSubMode.mode === 'ml') {
                        currentSubMode.text += c;
                    } else {
                        currentSubMode = { mode: 'ml', text: c };
                        subModes.push(currentSubMode);
                    }
                } else if (isPunctuation(c)) {
                    if (currentSubMode.mode === 'pl') {
                        currentSubMode.text += c;
                    } else {
                        let nextC = g.text[i + 1];
                        if (isPunctuation(nextC)) {
                            currentSubMode = { mode: 'pl', text: c };
                        } else {
                            currentSubMode = { mode: 'ps', text: c };
                        }
                        subModes.push(currentSubMode);
                    }
                }
            }
        }
    });

    return groups;
}

export function getIndicator(rowIndex, rowCount, ecl, col, isRight?) {
    let x = ~~(rowIndex / 3),
        y = ~~((rowCount - 1) / 3),
        z = ecl * 3 + (rowCount - 1) % 3,
        v = col - 1,
        c = rowIndex % 3 * 3,
        temp;
    switch (c) {
        case 0:
            if (!isRight) {
                temp = y;
            } else {
                temp = v;
            }
            break;
        case 3:
            if (!isRight) {
                temp = z;
            } else {
                temp = y;
            }
            break;
        case 6:
            if (!isRight) {
                temp = v;
            } else {
                temp = z;
            }
            break;
    }
    return 30 * x + temp;
}

export function getPattern_PDF417(row, value) {
    let cluster = CLUSTERS[row % 3];
    return cluster[value];
}

export function getTCValue(char, mode) {
    let result;
    switch (mode) {
        case 'll':
            result = TEXT_MAP[1].indexOf(char);
            break;
        case 'ml':
            result = TEXT_MAP[2].indexOf(char);
            break;
        case 'al':
        case 'as':
            result = TEXT_MAP[0].indexOf(char);
            break;
        case 'pl':
        case 'ps':
            result = TEXT_MAP[3].indexOf(char);
            break;
    }

    return result;
}

const subModeTable = {
    al: {
        ll: [27],
        ml: [28],
        pl: [28, 25]
    },
    ll: {
        al: [28, 28],
        ml: [28],
        pl: [28, 25]
    },
    ml: {
        al: [28],
        ll: [27],
        pl: [25]
    },
    pl: {
        al: [29],
        ll: [29, 27],
        ml: [29, 28]
    }
};
export function getTCSubModeValue(targetMode, lastMode) {
    let index = getTCValue(subModeMap[targetMode], lastMode);
    if (index > -1) {
        return [index];
    }

    return subModeTable[lastMode][targetMode];
}

export function createModules(row, col) {
    let arr = [];
    for (let i = 0; i < row; i++) {
        arr.push(wijmo.barcode.Utils.fillArray(new Array(col), null));
    }
    return arr;
}

export function getAutoECL(cws) {
    const len = cws.length;

    if (len <= 40) {
        return 2;
    } else if (len <= 160) {
        return 3;
    } else if (len <= 320) {
        return 4;
    } else {
        return 5;
    }
}

export function getAutoRowAndCol(length) {
    let col = 31, row, ratio;

    do {
        col--;
        row = Math.ceil(length / col);
        ratio = row / col;
        if (col < 2) {
            break;
        }
    } while (ratio < 4);
    if (row < 3) {
        row = 3;
    }
    return { col, row };
}
    }
    


    module wijmo.barcode.composite {
    
 

const LRRowAddressPatterns = [
    '221311', '311311', '312211', '222211', '213211', '214111', '223111', '313111', '322111', '412111', // 10
    '421111', '331111', '241111', '232111', '231211', '321211', '411211', '411121', '411112', '321112', // 20
    '312112', '311212', '311221', '311131', '311122', '311113', '221113', '221122', '221131', '221221', // 30
    '222121', '312121', '321121', '231121', '231112', '222112', '213112', '212212', '212221', '212131', // 40
    '212122', '212113', '211213', '211123', '211132', '211141', '211231', '211222', '211312', '211321', // 50
    '211411', '212311', // 52
];

const CRowAddressPatterns = [
    '112231', '121231', '122131', '131131', '131221', '132121', '141121', '141211', '142111', '133111', // 10
    '132211', '131311', '122311', '123211', '124111', '115111', '114211', '114121', '123121', '123112', // 20
    '122212', '122221', '121321', '121411', '112411', '113311', '113221', '113212', '113122', '122122', // 30
    '131122', '131113', '122113', '113113', '112213', '112222', '112312', '112321', '111421', '111331', // 40
    '111322', '111232', '111223', '111133', '111124', '111214', '112114', '121114', '121123', '121132', // 50
    '112132', '112141', // 52
];

const VersionTable = [
    [1, 11, 7, 1, 9], // col row ecc leftrap rightrap centerrap
    [1, 14, 7, 8, 8],
    [1, 17, 7, 36, 36],
    [1, 20, 8, 19, 19],
    [1, 24, 8, 9, 17],
    [1, 28, 8, 25, 33],

    [2, 8, 8, 1, 1],
    [2, 11, 9, 1, 9],
    [2, 14, 9, 8, 8],
    [2, 17, 10, 36, 36],
    [2, 20, 11, 19, 19],
    [2, 23, 13, 9, 17],
    [2, 26, 15, 27, 35],

    [3, 6, 12, 1, 1, 1],
    [3, 8, 14, 7, 7, 7],
    [3, 10, 16, 15, 15, 15],
    [3, 12, 18, 25, 25, 25],
    [3, 15, 21, 37, 37, 37],
    [3, 20, 26, 1, 33, 17],
    [3, 26, 32, 1, 17, 9],
    [3, 32, 38, 21, 37, 29],
    [3, 38, 44, 15, 47, 31],
    [3, 44, 50, 1, 9, 49],

    [4, 4, 8, 47, 43, 19],
    [4, 6, 12, 1, 1, 1],
    [4, 8, 14, 7, 7, 7],
    [4, 10, 16, 15, 15, 15],
    [4, 12, 18, 25, 25, 25],
    [4, 15, 21, 37, 37, 37],
    [4, 20, 26, 1, 33, 17],
    [4, 26, 32, 1, 17, 9],
    [4, 32, 38, 21, 37, 29],
    [4, 38, 44, 15, 47, 31],
    [4, 44, 50, 1, 9, 49],
];

function makeRange(start, length) {
    const result = [];
    let i = 0, n = start;
    while (i < length) {
        if (n > 52) {
            n = n % 52;
        }
        result.push(n);
        i++;
        n++;
    }
    return result;
}
export function findVersionTable(table, func) {
    for (let i = 0, len = table.length; i < len; i++) {
        let item = table[i];
        const [cols, rows, ecCws, leftStart, rightStart, centerStart] = item;
        const total = rows * cols;
        const nonEcCw = total - ecCws;
        const dcw = rows * cols - ecCws - 2;
        const bits = ((~~(dcw / 5)) * 6 + dcw % 5) * 8;
        item = {
            rows,
            cols,
            total,
            ecCws,
            nonEcCw,
            bits,
        };
        if (func(item)) {
            item.rowAssignment = {
                left: makeRange(leftStart, rows),
                right: makeRange(rightStart, rows),
                center: centerStart ? makeRange(centerStart, rows) : null,
            };
            const cluster = [];
            let i = 0;
            while (i <= rows) {
                const n = (leftStart + i - 1) % 3;
                cluster.push(n);
                i++;
            }
            item.cluster = cluster;
            return item;
        }
    }

    return null;
}
export function getVersionVariantColPrior(n) {
    let col = 1;
    let result = null;
    while (col <= 4) {
        const info = findVersionTable(VersionTable, (item) => item.cols === col && item.nonEcCw >= n);
        if (!result) {
            result = info;
        } else if (info && info.rows > result.rows) {
            result = info;
        }
        col++;
    }
    return result;
}
export function getVersionVariantRowPrior(n) {
    return findVersionTable(VersionTable, (item) => item.cols === 4 && item.nonEcCw >= n);
}
export function getVersionVariant(row, col) {
    return findVersionTable(VersionTable, (item) => item.cols === col && item.rows === row);
}
export function getVersionVariantByCol(col, n) {
    return findVersionTable(VersionTable, (item) => item.cols === col && item.nonEcCw >= n);
}
export function getECCBVersionVariantByCol(col, n) {
    return findVersionTable(VersionTable, (item) => item.cols === col && item.bits >= n);
}

export function getRowAddressPatterns(rowAssignment, type, i) {
    let str;
    switch (type) {
        case 'L':
            str = LRRowAddressPatterns[rowAssignment.left[i] - 1];
            break;
        case 'R':
            str = LRRowAddressPatterns[rowAssignment.right[i] - 1];
            break;
        default:
            str = CRowAddressPatterns[rowAssignment.center[i] - 1];
    }
    return wijmo.barcode.Utils.toZeroOnePattern(wijmo.barcode.Utils.str2Array(str), true);
}

export function getPattern(n, value) {
    let cluster = CLUSTERS[n];
    return cluster[value];
}
    }
    


    module wijmo.barcode.composite {
    const testDigit = function (digit) {
    return (/^\d$/.test(digit));
};

const abs = function (number) {
    var bigNumber;
    if (typeof number === 'undefined') {
        return;
    }
    bigNumber = new BigNumber(number);
    bigNumber.sign = 1;
    return bigNumber;
};

const isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

const isValidType = function (number) {
    return [
        typeof number === 'number',
        typeof number === 'string' && number.length > 0,
        isArray(number) && number.length > 0,
        number instanceof BigNumber
    ].some(function (bool) {
        return bool === true;
    });
};

const errors = {
    'invalid': 'Invalid Number',
    'division by zero': 'Invalid Number - Division By Zero'
};

export class BigNumber {
    private number;
    private sign;
    private rest;

    constructor(initialNumber) {
        var index;

        this.number = [];
        this.sign = 1;
        this.rest = 0;

        // The initial number can be an array, string, number of another big number
        // e.g. array     : [3,2,1], ['+',3,2,1], ['-',3,2,1]
        //      number    : 312
        //      string    : '321', '+321', -321'
        //      BigNumber : BigNumber(321)
        // Every character except the first must be a digit

        if (!isValidType(initialNumber)) {
            this.number = errors['invalid'];
            return;
        }

        if (isArray(initialNumber)) {
            if (initialNumber.length && initialNumber[0] === '-' || initialNumber[0] === '+') {
                this.sign = initialNumber[0] === '+' ? 1 : -1;
                initialNumber.shift(0);
            }
            for (index = initialNumber.length - 1; index >= 0; index--) {
                if (!this.addDigit(initialNumber[index]))
                    return;
            }
        } else {
            initialNumber = initialNumber.toString();
            if (initialNumber.charAt(0) === '-' || initialNumber.charAt(0) === '+') {
                this.sign = initialNumber.charAt(0) === '+' ? 1 : -1;
                initialNumber = initialNumber.substring(1);
            }

            for (index = initialNumber.length - 1; index >= 0; index--) {
                if (!this.addDigit(parseInt(initialNumber.charAt(index), 10))) {
                    return;
                }
            }
        }
    }

    public addDigit(digit) {
        if (testDigit(digit)) {
            this.number.push(digit);
        } else {
            this.number = errors['invalid'];
            return false;
        }

        return this;
    }

    public isEven() {
        return this.number[0] % 2 === 0;
    }

    private _compare(number) {
        var bigNumber;
        var index;

        if (!isValidType(number)) {
            return null;
        }

        bigNumber = new BigNumber(number);

        // If the numbers have different signs, then the positive
        // number is greater
        if (this.sign !== bigNumber.sign) {
            return this.sign;
        }

        // Else, check the length
        if (this.number.length > bigNumber.number.length) {
            return this.sign;
        } else if (this.number.length < bigNumber.number.length) {
            return this.sign * (-1);
        }

        // If they have similar length, compare the numbers
        // digit by digit
        for (index = this.number.length - 1; index >= 0; index--) {
            if (this.number[index] > bigNumber.number[index]) {
                return this.sign;
            } else if (this.number[index] < bigNumber.number[index]) {
                return this.sign * (-1);
            }
        }

        return 0;
    }

    public gt(number) {
        return this._compare(number) > 0;
    }

    public gte(number) {
        return this._compare(number) >= 0;
    }

    public equals(number) {
        return this._compare(number) === 0;
    }

    public lte(number) {
        return this._compare(number) <= 0;
    }

    public lt(number) {
        return this._compare(number) < 0;
    }

    public add(number) {
        var bigNumber;
        if (typeof number === 'undefined') {
            return this;
        }
        bigNumber = new BigNumber(number);

        if (this.sign !== bigNumber.sign) {
            if (this.sign > 0) {
                bigNumber.sign = 1;
                return this.minus(bigNumber);
            }
            else {
                this.sign = 1;
                return bigNumber.minus(this);
            }
        }

        this.number = BigNumber._add(this, bigNumber);
        return this;
    }

    public minus(number) {
        var bigNumber;
        if (typeof number === 'undefined') {
            return this;
        }
        bigNumber = new BigNumber(number);

        if (this.sign !== bigNumber.sign) {
            this.number = BigNumber._add(this, bigNumber);
            return this;
        }

        // If current number is lesser than the given bigNumber, the result will be negative
        this.sign = (this.lt(bigNumber)) ? -1 : 1;
        this.number = (abs(this).lt(abs(bigNumber)))
            ? BigNumber._subtract(bigNumber, this)
            : BigNumber._subtract(this, bigNumber);

        return this;
    }

    private static _add(a: BigNumber, b: BigNumber) {
        var index;
        var remainder = 0;
        var length = Math.max(a.number.length, b.number.length);

        for (index = 0; index < length || remainder > 0; index++) {
            a.number[index] = (remainder += (a.number[index] || 0) + (b.number[index] || 0)) % 10;
            remainder = Math.floor(remainder / 10);
        }

        return a.number;
    }

    private static _subtract(a: BigNumber, b: BigNumber) {
        var index;
        var remainder = 0;
        var length = a.number.length;

        for (index = 0; index < length; index++) {
            a.number[index] -= (b.number[index] || 0) + remainder;
            a.number[index] += (remainder = (a.number[index] < 0) ? 1 : 0) * 10;
        }
        // Count the zeroes which will be removed
        index = 0;
        length = a.number.length - 1;
        while (a.number[length - index] === 0 && length - index > 0) {
            index++;
        }
        if (index > 0) {
            a.number.splice(-index);
        }
        return a.number;
    }

    public multiply(number) {
        if (typeof number === 'undefined') {
            return this;
        }
        var bigNumber = new BigNumber(number);
        var index;
        var givenNumberIndex;
        var remainder = 0;
        var result = [];

        if (this.isZero() || bigNumber.isZero()) {
            return new BigNumber(0);
        }

        this.sign *= bigNumber.sign;

        // multiply the numbers
        for (index = 0; index < this.number.length; index++) {
            for (remainder = 0, givenNumberIndex = 0; givenNumberIndex < bigNumber.number.length || remainder > 0; givenNumberIndex++) {
                result[index + givenNumberIndex] = (remainder += (result[index + givenNumberIndex] || 0) + this.number[index] * (bigNumber.number[givenNumberIndex] || 0)) % 10;
                remainder = Math.floor(remainder / 10);
            }
        }

        this.number = result;
        return this;
    }

    public divide(number) {
        if (typeof number === 'undefined') {
            return this;
        }

        var bigNumber = new BigNumber(number);
        var index;
        var length;
        var result = [];
        var rest = new BigNumber(0);

        // test if one of the numbers is zero
        if (bigNumber.isZero()) {
            this.number = errors['division by zero'];
            return this;
        } else if (this.isZero()) {
            this.rest = new BigNumber(0);
            return this;
        }

        this.sign *= bigNumber.sign;
        bigNumber.sign = 1;

        // Skip division by 1
        if (bigNumber.number.length === 1 && bigNumber.number[0] === 1) {
            this.rest = new BigNumber(0);
            return this;
        }

        for (index = this.number.length - 1; index >= 0; index--) {
            rest.multiply(10);
            rest.number[0] = this.number[index];
            result[index] = 0;
            while (bigNumber.lte(rest)) {
                result[index]++;
                rest.minus(bigNumber);
            }
        }

        index = 0;
        length = result.length - 1;
        while (result[length - index] === 0 && length - index > 0) {
            index++;
        }
        if (index > 0) {
            result.splice(-index);
        }

        this.rest = rest;
        this.number = result;
        return this;
    }

    public mod(number) {
        return this.divide(number).rest;
    }

    public power(number) {
        if (typeof number === 'undefined')
            return;
        var bigNumber;
        var bigNumberPower;
        // Convert the argument to a big number
        if (!isValidType(number)) {
            this.number = errors['invalid'];
            return;
        }
        bigNumberPower = new BigNumber(number);
        if (bigNumberPower.isZero()) {
            return new BigNumber(1);
        }
        if (bigNumberPower.val() === '1') {
            return this;
        }

        bigNumber = new BigNumber(this);

        this.number = [1];
        while (bigNumberPower.gt(0)) {
            if (!bigNumberPower.isEven()) {
                this.multiply(bigNumber);
                bigNumberPower.subtract(1);
                continue;
            }
            bigNumber.multiply(bigNumber);
            bigNumberPower.div(2);
        }

        return this;
    }

    public abs() {
        this.sign = 1;
        return this;
    }

    public isZero() {
        var index;
        for (index = 0; index < this.number.length; index++) {
            if (this.number[index] !== 0) {
                return false;
            }
        }

        return true;
    }

    public toString() {
        var index;
        var str = '';
        if (typeof this.number === 'string') {
            return this.number;
        }

        for (index = this.number.length - 1; index >= 0; index--) {
            str += this.number[index];
        }

        return (this.sign > 0) ? str : ('-' + str);
    }
}
    }
    


    module wijmo.barcode.composite {
    



export abstract class PDF417Base extends wijmo.barcode.TwoDimensionalBarcode {
    static PAD = 900;

    protected text: any;
    protected versionMeta: any;
    protected columns: any;
    protected data: any;
    protected ecc: any;
    protected rows: any;

    private mainArea: any;
    validate () {
        const { text } = this.encodeConfig;
        const reg = /^[\x00-\xFF]+$/;  //eslint-disable-line
        if (!reg.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text);
        }
    }

    encodeNC (group) {
        let text = group.text;
        let result = [];
        wijmo.barcode.Utils.sliceString(text, 44, (str) => {
            let sum = new BigNumber('1' + str);
            const groupResult = [];
            while (true) { //eslint-disable-line
               let codeword = new BigNumber(sum).mod(900);
                sum.divide(new BigNumber(900));
                groupResult.unshift(+codeword.toString());
                if (sum.lt(1)) {
                    break;
                }
            }
            result = result.concat(groupResult);
        });
        
        result.unshift(MODE_NC);
        return result;
    }

    encodeBC (group) {
        let text = group.text;
        let result = [];
        wijmo.barcode.Utils.sliceString(text, 6, (str) => {
            if (str.length === 6) {
                let p = 5, sum = 0;
                const _arr = [];
                wijmo.barcode.Utils.sliceString(str, 1, (c) => {
                    sum += c.charCodeAt(0) * Math.pow(256, p--);
                });
        
                let i = 0, t = Math.floor(sum / Math.pow(900, i)) % 900;
                do {
                    _arr.unshift(t);
                    t = Math.floor(sum / Math.pow(900, ++i)) % 900;
                } while (t > 0);

                while(_arr.length < 5) {
                    _arr.unshift(0);
                }
                result = result.concat(_arr);
            } else {
                wijmo.barcode.Utils.sliceString(str, 1, (c) => {
                    result.push(c.charCodeAt(0));
                });
            }
        });

        result.unshift(group.mode);
        return result;
    }

    encodeTC (group) {
        let codes = [];
        let lastMode = 'al';
        group.subModes.forEach((s) => {
            if (lastMode !== s.mode) {
                codes = codes.concat(getTCSubModeValue(s.mode, lastMode));
            }
            
            wijmo.barcode.Utils.sliceString(s.text, 1, (c) => {
                codes.push(getTCValue(c, s.mode));
            });

            if (s.mode !== 'ps' && s.mode !== 'as') {
                lastMode = s.mode;
            }
        });
        
        let result = [MODE_TC];
        wijmo.barcode.Utils.sliceArray(codes, 2, (arr) => {
            if (arr.length === 2) {
                result.push(arr[0] * 30 + arr[1]);
            } else {
                result.push(arr[0] * 30 + 29);
            }
        });

        return result;
    }

    encode (modes) {
        let data = [];
        modes.forEach((g) => {
            switch (g.mode) {
                case MODE_TC:
                    data = data.concat(this.encodeTC(g));
                    break;
                case MODE_BC:
                case MODE_BC6:
                case MODE_BC_SHIFT:
                    data = data.concat(this.encodeBC(g));
                    break;
                case MODE_NC:
                    data = data.concat(this.encodeNC(g));
                    break;
            }
        });
        return data;
    }

    convertToShape (matrix, forMeasure) {
        const { height, quietZone } = this.encodeConfig;
        const rowHeight = height / matrix.length;

        const symbolWidth = matrix[0].reduce((sum, item) => {
            sum += item.length;
            return sum;
        }, 0) + quietZone.right + quietZone.left;
        const symbolHeight = matrix.length * rowHeight + quietZone.top + quietZone.bottom;
        
        const mainArea = new wijmo.barcode.VerticalLayoutArea();
        const symbolArea = new wijmo.barcode.MatrixSymbolArea(symbolWidth, symbolHeight, rowHeight);
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
                row.forEach((pattern) => {
                    wijmo.barcode.Utils.combineTruthy(pattern).forEach((num) => {
                        if (num !== 0) {
                            symbolArea.append(num, rowHeight);
                        } else {
                            symbolArea.space();
                        }
                    });
                });
            });
            this.shapes = mainArea.toShapes();
        }

        this.mainArea = mainArea;
        this.size = mainArea.getSize();
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

    getMainArea() {
        return this.mainArea;
    }
}

    }
    


    module wijmo.barcode.composite {
    




export class PDF417Encoder extends PDF417Base {
    static DefaultConfig = {
        errorCorrectionLevel: 'auto',
        columns: 'auto',
        rows: 'auto',
        compact: false,
        height: 60,
        quietZone: {
            top: 2,
            left: 2,
            right: 2,
            bottom: 2
        }
    };
    static START = '11111111010101000';
    static END = '111111101000101001';
    static COMPACT_END = '1';
    static MAX_DATA_NUM = 925;
    private ecl: any;
    private compact: any;

    constructor (option) {
        option.merge(PDF417Encoder.DefaultConfig);
        super(option);
        let { errorCorrectionLevel, columns, rows, compact } = this.config;
        let { text } = this.encodeConfig;
        this.text = text;
        this.ecl = errorCorrectionLevel === 'auto' ? errorCorrectionLevel : +errorCorrectionLevel;
        this.columns = columns === 'auto' ? columns : +columns;
        this.rows = rows === 'auto' ? rows : +rows;
        this.compact = !!compact;
    }

    validate () {
        super.validate();

        const { errorCorrectionLevel, rows, columns } = this.config;
        if (wijmo.barcode.Utils.isNumberLike(errorCorrectionLevel) && (errorCorrectionLevel < 0 || errorCorrectionLevel > 8)) {
            throw new wijmo.barcode.InvalidOptionsException({errorCorrectionLevel}, 'ErrorCorrectionLevel is from 0 - 8.');
        }
        if (wijmo.barcode.Utils.isNumberLike(rows) && (rows < 3 || rows > 90)) {
            throw new wijmo.barcode.InvalidOptionsException({rows}, 'Rows is from 3 - 90.');
        }
        if (wijmo.barcode.Utils.isNumberLike(columns) && (columns < 1 || columns > 30)) {
            throw new wijmo.barcode.InvalidOptionsException({columns}, 'Columns is from 1 - 30.');
        }
    }

    genEcc () {
        let {data, ecl, columns, rows} = this;
        if (data[0] === MODE_TC) {
            data.shift();
        }
        if (ecl === 'auto') {
            this.ecl = ecl = getAutoECL(data);
        }
        let eccLength = Math.pow(2, ecl + 1);
        
        let totalLength = data.length + 1 + eccLength;

        if (rows === 'auto' && columns === 'auto') {
            let {col, row} = getAutoRowAndCol(totalLength);
            this.columns = columns = col;
            this.rows = rows = row;
        } else {
            if (rows === 'auto') {
                rows = Math.ceil(totalLength / columns);
                if (rows > 90) {
                    throw new wijmo.barcode.InvalidOptionsException({columns}, 'Columns is not large enough');
                }
                rows = rows < 3 ? 3 : rows;
                this.rows = rows;
            } else if (columns === 'auto') {
                columns = Math.ceil(totalLength / rows);
                if (columns > 30) {
                    throw new wijmo.barcode.InvalidOptionsException({rows}, 'Rows is not large enough');
                }
                this.columns = columns;
            }
        }
        let dataSize = columns * rows - eccLength;
        data.unshift(dataSize);
        
        if (data.length > PDF417Encoder.MAX_DATA_NUM || data.length > dataSize) {
            throw new wijmo.barcode.TextTooLongException();
        }

        while (data.length < dataSize) {
            data.push(PDF417Base.PAD);
        }

        this.ecc = generateECC(data, this.ecl);
    }

    calculateData () {
        let modes = compaction(this.text);
        this.data = this.encode(modes);
        this.genEcc();

        let {data, ecc, columns, rows, ecl, compact} = this;
        
        let cws = data.concat(ecc);

        let values = createModules(rows, columns);
        cws.forEach((c, index) => {
            let row = Math.floor(index / columns);
            let col = index % columns;
            values[row][col] = getPattern_PDF417(row, c);
        });

        let matrix = [];
        values.forEach((row, rowIndex) => {
            let leftIndicator = getPattern_PDF417(rowIndex, getIndicator(rowIndex, rows, ecl, columns)),
                rightIndicator = getPattern_PDF417(rowIndex, getIndicator(rowIndex, rows, ecl, columns, true));
            let pattern = [PDF417Encoder.START, leftIndicator.toString(2)];
            row.forEach((v) => {
                pattern.push(v.toString(2));
            });
            if (!compact) {
                pattern.push(rightIndicator.toString(2));
                pattern.push(PDF417Encoder.END);
            } else {
                pattern.push(PDF417Encoder.COMPACT_END);
            }
            
            matrix.push(pattern);
        });

        return matrix;
    }
}

    }
    


    module wijmo.barcode.composite {
    






export class MicroPDF417Encoder extends PDF417Base {
    static DefaultConfig = {
        symbolVersion: SymbolVersion.ColumnPriorAuto,
        compactionMode: CompactionMode.Auto,
        structuredAppend: false,
        segmentIndex: 0, // 0 99998
        fileID: 0, // 0 - 899
        height: 60,
        quietZone: {
            top: 1,
            left: 1,
            right: 1,
            bottom: 1
        },
        optionalFields: {
            segmentCount: true,
        }
    };
    static StopBar = '1';
    static StructuredAppendMarker = 928;
    static StructuredAppendOptionalFieldsMarker = 923;
    static StructuredAppendTerminator = 922;
    static StructuredAppendOptionalFieldTags = {
        SegmentCount: 1,
    };

    private symbolVersion: any;
    private compactionMode: any;
    private structuredAppendEnabled: any;
    private segmentIndex: any;
    private fileID: any;
    private optionalFields: any;
    private segmentCount: any;
    private structuredAppendCws: any;
    constructor(option) {
        option.merge(MicroPDF417Encoder.DefaultConfig);
        super(option);
        let { symbolVersion, compactionMode, segmentIndex, fileID, structuredAppend, optionalFields } = this.config;
        let { text } = this.encodeConfig;
        this.text = text;
        
        this.symbolVersion = symbolVersion;
        this.versionMeta = null;
        this.compactionMode = compactionMode;

        this.structuredAppendEnabled = structuredAppend;
        this.segmentIndex = segmentIndex;
        this.fileID = fileID;
        this.optionalFields = optionalFields;
        this.segmentCount = 0;

        this.structuredAppendCws = [];
    }

    validate () {
        super.validate();
        const { compactionMode, symbolVersion, segmentIndex, fileID } = this.config;
        const { text } = this.encodeConfig;
        const isNumber = /^[\d]*$/;
        if (compactionMode === CompactionMode.Numeric && !isNumber.test(text)) {
            throw new wijmo.barcode.InvalidOptionsException({ compactionMode, text }, 'CompactionMode is numeric, but the text is not.');
        }
        if (!(CompactionMode as any).has(compactionMode)) {
            throw new wijmo.barcode.InvalidOptionsException({compactionMode});
        }
        if (!(SymbolVersion as any).has(symbolVersion)) {
            throw new wijmo.barcode.InvalidOptionsException({symbolVersion});
        }

        if (segmentIndex < 0 || segmentIndex > 99998 || fileID < 0 || fileID > 899) {
            throw new wijmo.barcode.InvalidOptionsException({ segmentIndex }, 'SegmentIndex should in range 0 - 99998');
        }
    }

    _buildRow(row, rowIndex) {
        const { columns, versionMeta: { rowAssignment, cluster } } = this;

        let leftRAP = getRowAddressPatterns(rowAssignment, 'L', rowIndex);
        let rightRAP = getRowAddressPatterns(rowAssignment, 'R', rowIndex);
        let result = [leftRAP];
        const clusterNo = cluster[rowIndex];
        const patterns = row.map(item => getPattern(clusterNo, item));
        switch(columns) {
            case 1: {
                result.push(patterns[0].toString(2));
                break;
            }
            case 2: {
                result.push(patterns[0].toString(2));
                result.push(patterns[1].toString(2));
                break;
            }
            case 3: {
                result.push(patterns[0].toString(2));
                result.push(getRowAddressPatterns(rowAssignment, 'C', rowIndex));
                result.push(patterns[1].toString(2));
                result.push(patterns[2].toString(2));
                break;
            }
            default: {
                result.push(patterns[0].toString(2));
                result.push(patterns[1].toString(2));
                result.push(getRowAddressPatterns(rowAssignment, 'C', rowIndex));
                result.push(patterns[2].toString(2));
                result.push(patterns[3].toString(2));
                break;
            }
        }

        result = [...result, rightRAP, MicroPDF417Encoder.StopBar];
        return result;
    }

    _buildStructAppend() {
        const { segmentIndex, segmentCount, fileID, optionalFields } = this;
        let result = [MicroPDF417Encoder.StructuredAppendMarker];

        let segIndex = this.encodeNC({text: wijmo.barcode.Utils.strPadStart(segmentIndex + '', 5, '0')});
        segIndex.shift();
        result.push(...segIndex);

        result.push(fileID);

        if (optionalFields.segmentCount) {
            result.push(MicroPDF417Encoder.StructuredAppendOptionalFieldsMarker);
            result.push(MicroPDF417Encoder.StructuredAppendOptionalFieldTags.SegmentCount);

            let segCnt = this.encodeNC({text: wijmo.barcode.Utils.strPadStart(segmentCount + '', 5, '0')});
            segCnt.shift();
            result.push(...segCnt);
        }

        if (segmentIndex === segmentCount - 1) {
            result.push(MicroPDF417Encoder.StructuredAppendTerminator);
        }

        return result;
    }

    _splitStruct(data) {
        let {  symbolVersion, segmentIndex } = this;
        let variantInfo;
        if (symbolVersion === SymbolVersion.RowPriorAuto || symbolVersion === SymbolVersion.ColumnPriorAuto) {
            variantInfo = getVersionVariant(44, 4);
        } else {
            let [col, row] = symbolVersion.split('*');
            variantInfo = getVersionVariant(+row, +col);
        }

        const dymmyStructAppendCws = this._buildStructAppend();
        
        const capacity = variantInfo.nonEcCw - dymmyStructAppendCws.length;
        if (capacity < 0) {
            throw new wijmo.barcode.TextTooLongException();
        }

        let blockCnt = Math.ceil(data.length / capacity);
        const lastOneBlockData = data.length - capacity * (blockCnt - 1);
        if (lastOneBlockData === capacity) {
            blockCnt++;
        }

        if (segmentIndex >= blockCnt) {
            throw new wijmo.barcode.InvalidOptionsException({segmentIndex}, `The max segment index is ${blockCnt - 1}.`);
        }
        if (blockCnt > 99999) {
            throw new wijmo.barcode.TextTooLongException();
        }

        let thisBlockData;
        if (segmentIndex === blockCnt - 1) {
            thisBlockData = data.slice(capacity * segmentIndex);
        } else {
            thisBlockData = data.slice(capacity * segmentIndex, capacity * (segmentIndex + 1));
        }

        this.segmentCount = blockCnt;

        return thisBlockData;
    }

    genEcc() {
        let { data, symbolVersion, structuredAppendCws } = this;
        
        let info, totalLength = data.length + structuredAppendCws.length;
        if (symbolVersion === SymbolVersion.RowPriorAuto) {
            info = getVersionVariantRowPrior(totalLength);
        } else if (symbolVersion === SymbolVersion.ColumnPriorAuto) {
            info = getVersionVariantColPrior(totalLength);
        } else {
            let [col, row] = symbolVersion.split('*');
            info = getVersionVariant(+row, +col);
        }
        
        const dataSize = info.rows * info.cols - info.ecCws;
        if (dataSize < totalLength) {
            throw new wijmo.barcode.TextTooLongException();
        }

        let delta = dataSize - totalLength;
        while (delta > 0) {
            data.push(PDF417Base.PAD);
            delta--;
        }

        this.versionMeta = info;
        this.ecc = generateECCForMicro([...data, ...structuredAppendCws], info.ecCws);
        this.rows = info.rows;
        this.columns = info.cols;
    }

    calculateData () {
        let modes = compaction(this.text, this.compactionMode);
        let dataCws = this.encode(modes);
        if (this.structuredAppendEnabled) {
            this.data = this._splitStruct(dataCws);
            this.structuredAppendCws = this._buildStructAppend();
        } else {
            this.data = dataCws;
        }

        this.genEcc();

        let {data, ecc, columns, rows, structuredAppendCws} = this;

        let cws = data.concat(structuredAppendCws).concat(ecc);

        let values = createModules(rows, columns);
        cws.forEach((c, index) => {
            let row = Math.floor(index / columns);
            let col = index % columns;
            values[row][col] = c;
        });
        
        let matrix = [];
        values.forEach((row, rowIndex) => {           
            matrix.push(this._buildRow(row, rowIndex));
        });

        return matrix;
    }
}
    }
    


    module wijmo.barcode.composite {
    



wijmo.barcode.Barcode.registerEncoder('PDF417', PDF417Encoder);
wijmo.barcode.Barcode.registerEncoder('MicroPDF417', MicroPDF417Encoder);
    }
    


    module wijmo.barcode.composite {
    









export class CCA  extends PDF417Base {
    protected bitBuffer: any;
    private aiGroup: any;
    private method: any;
    private _gpdEncodation: any;
    private autoHeight: boolean;

    constructor (linkageText, columns = 4, unitSize = 1, height) {
        const cfg: any = {
            text: linkageText,
            unitSize,
            quietZone: {
                top: 0, right: 0, left: 0, bottom: 0,
            },
        };
        if (!!height) {
            cfg.height = height;
        }
        super(new wijmo.barcode.Option(cfg));
        this.columns = columns; // 2 - 4
        let { text } = this.encodeConfig;
        this.text = text.replace(/\(|\)/g, '');
        this.bitBuffer = new wijmo.barcode.BitBuffer();
        this._gpdEncodation = new GeneralPurposeDataEncodation(this.bitBuffer);
        
        const res = text.split(/\(|\)/);
        res.shift();
        let i = 0;
        const aiGroup = [];
        while(i < res.length) {
            aiGroup.push({
                ai: res[i++],
                data: res[i++],
            });
        }
        this.aiGroup = aiGroup;
        this.autoHeight = !height;
    }

    _buildRow(row, rowIndex) {
        const { columns, versionMeta: { rowAssignment, cluster } } = this;

        let leftRAP = getRowAddressPatterns(rowAssignment, 'L', rowIndex);
        let rightRAP = getRowAddressPatterns(rowAssignment, 'R', rowIndex);
        let result = columns === 3 ? [] : [leftRAP];
        const clusterNo = cluster[rowIndex];
        const patterns = row.map(item => getPattern(clusterNo, item));
        switch(columns) {
            case 2: {
                result.push(patterns[0].toString(2));
                result.push(patterns[1].toString(2));
                break;
            }
            case 3: {
                result.push(patterns[0].toString(2));
                result.push(getRowAddressPatterns(rowAssignment, 'C', rowIndex));
                result.push(patterns[1].toString(2));
                result.push(patterns[2].toString(2));
                break;
            }
            default: {
                result.push(patterns[0].toString(2));
                result.push(patterns[1].toString(2));
                result.push(getRowAddressPatterns(rowAssignment, 'C', rowIndex));
                result.push(patterns[2].toString(2));
                result.push(patterns[3].toString(2));
                break;
            }
        }

        result = [...result, rightRAP, MicroPDF417Encoder.StopBar];
        return result;
    }

    _encode_10Date(str) {
        const { bitBuffer, text } = this;
        // ProductDate or ExpireDate
        const year = +str.substr(0, 2);
        const month = +str.substr(2, 2);
        const day = +str.substr(4, 2);
        const value = year * 384 + (month - 1) * 32 + day;
        if (isNaN(value)) {
            throw new wijmo.barcode.InvalidTextException(text, 'The text doesn\'t contains a vaild product date or expire date');
        }
        bitBuffer.put(value, 16);
    }
    _getMethod_11Mode(str) {
        let alpha = 0;
        let numeric = 0;
        const alphanumericOnly = '*,-./';
        for (let i = 0, len = str.length; i < len; i++) {
            const ch = str[i];
            if (alphanumericOnly.indexOf(ch) > -1) {
                return 'Alphanumeric';
            }
            if (ch >= 'A' && ch <= 'Z') {
                alpha++;
            }
            if (ch >= '0' && ch <= '9') {
                numeric++;
            }
        }
        if (alpha > numeric) {
            return 'Alpha';
        }
  
        return 'Numeric';
    }
    
    _encode_11() {
        const { bitBuffer, aiGroup } = this;
        let restStr = '';
        const ai1 = aiGroup[0];
        bitBuffer.putBits('11');
        const result = /^([1-9][0-9]?[0-9]?)?([A-Z][0-9A-Z*,-./]*)/.exec(ai1.data);
        let numeric: any = result[1] || '';
        let uppercase = result[2][0];
        const specificStr = numeric + uppercase;
        numeric = numeric ? +numeric : 0;
        const ai1RestStr = ai1.data.substr(specificStr.length);
        const mode = this._getMethod_11Mode(ai1RestStr);

        switch(mode) {
            case 'Alphanumeric':
                bitBuffer.putBits('0');
                break;
            case 'Alpha':
                bitBuffer.putBits('11');
                break;
            case 'Numeric':
                bitBuffer.putBits('10');
        }

        const ai2 = aiGroup[1];
        if (ai2) {
            switch (ai2.ai) {
                case '21':
                    restStr = ai1RestStr + wijmo.barcode.Constants.FNC1 + ai2.data; 
                    bitBuffer.putBits('10');
                    break;
                case '8004':
                    restStr = ai1RestStr + wijmo.barcode.Constants.FNC1 + ai2.data; 
                    bitBuffer.putBits('11');
                    break;
                default:
                    restStr = ai1RestStr + wijmo.barcode.Constants.FNC1 + ai2.ai + ai2.data;
                    bitBuffer.putBits('0');
            }
        } else {
            restStr = ai1RestStr;
            bitBuffer.putBits('0');
        }

        if (aiGroup.length > 2) {
            wijmo.barcode.Utils.loop((i) => {
                const ai = aiGroup[i];
                restStr = restStr + wijmo.barcode.Constants.FNC1 + ai.ai + ai.data;
            }, {from: 2, to: aiGroup.length - 1 });
        }

        const uppercaseSupport = getSupportedUppercaseAlphabetic(uppercase);
        if (numeric < 31 && uppercaseSupport) {
            bitBuffer.putBit(numeric, 5);
            bitBuffer.putBits(uppercaseSupport);
        } else {
            bitBuffer.putBits('11111');
            bitBuffer.put(numeric, 10);
            bitBuffer.put(uppercase.charCodeAt(0) - 65, 5);
        }

        return restStr;
    }
    _encode_10() {
        const { bitBuffer, aiGroup } = this;
        let restText = '';
        const first = aiGroup[0];
        bitBuffer.putBits('10');
        if (first.ai === '11' || first.ai === '17') {
            this._encode_10Date(first.data);
            bitBuffer.putBit(first.ai === '17');

            if (aiGroup.length > 1) {
                const hasLotNumber = aiGroup[1] && aiGroup[1].ai === '10';

                if (hasLotNumber) {
                    restText = aiGroup[1].data;

                    if (aiGroup.length > 2) {
                        wijmo.barcode.Utils.loop((i) => {
                            const ai = aiGroup[i];
                            restText = restText + wijmo.barcode.Constants.FNC1 + ai.ai + ai.data;
                        }, {from: 2, to: aiGroup.length - 1 });
                    }
                } else {
                    restText = wijmo.barcode.Constants.FNC1;
                    wijmo.barcode.Utils.loop((i) => {
                        const ai = aiGroup[i];
                        restText = restText + ai.ai + ai.data;
                    }, {from: 1, to: aiGroup.length - 1 });
                }

            } else {
                restText = wijmo.barcode.Constants.FNC1;
            }
        } else if (first.ai === '10') {
            // NoDate
            bitBuffer.putBits('11');
            
            restText = first.data;
            if (aiGroup.length > 1) {
                wijmo.barcode.Utils.loop((i) => {
                    const ai = aiGroup[i];
                    restText = restText + wijmo.barcode.Constants.FNC1 + ai.ai + ai.data;
                }, {from: 1, to: aiGroup.length - 1 });
            }
        }
        return restText;
    }

    _encode_0() {
        const { bitBuffer,aiGroup, text } = this;       
        bitBuffer.putBits('0');
        if (!aiGroup.length) {
            return text;
        }
        let restText = '';
        restText = aiGroup[0].ai + aiGroup[0].data;
        if (aiGroup.length > 1) {
            wijmo.barcode.Utils.loop((i) => {
                const ai = aiGroup[i];
                restText = restText + wijmo.barcode.Constants.FNC1 + ai.ai + ai.data;
            }, {from: 1, to: aiGroup.length - 1 });
        }

        return restText;
    }

    _encodeMethod() {
        const { text, aiGroup } = this;
        const first = aiGroup[0];
        if (!first) {
            this.method = '0';
        } else if (first.ai === '10' || first.ai === '11' || first.ai === '17') {
            this.method = '10';
        } else if (first.ai === '90') {
            const is90 = /^90(?:[1-9][0-9]?[0-9]?)?[A-Z]/.test(text);
            if (is90) {
                this.method = '11';
            } else {
                this.method = '0';
            }
        } else {
            this.method = '0';
        }
    }

    getVersionVariant() {
        const { bitBuffer, columns } = this;
        this.versionMeta = getVersionVariant_CCA(columns, bitBuffer.length);
    }

    _encode() {
        this._encodeMethod();
        const { method, columns } = this;
        let restText = '';
        switch(method) {
            case '10': {
                restText = this._encode_10();
                break;
            }
            case '11':{
                restText = this._encode_11();
                break;
            }
            case '0': {
                restText = this._encode_0();
            }
        }

        this._gpdEncodation.encodeGeneralData(restText, columns);
        this.getVersionVariant();
        if (!this.versionMeta) {
            throw new wijmo.barcode.TextTooLongException();
        }
        this._gpdEncodation.padTo(this.versionMeta.bits);
    }

    genEcc() {
        const { bitBuffer, versionMeta } = this;

        const bytes = bitBuffer.getGroupedBits(16);
        const cws = [];
        encode928(bytes, cws, bitBuffer.length);
        this.data = cws;
        this.ecc = generateECCForMicro(cws, versionMeta.ecCws);
        this.rows = versionMeta.rows;

        if (this.autoHeight) {
            this.encodeConfig.height = versionMeta.rows * 2;
        }
    }

    calculateData () {
        this._encode();
        this.genEcc();

        let {data, ecc, columns, rows} = this;
        let cws = data.concat(ecc);
        let values = createModules(rows, columns);
        cws.forEach((c, index) => {
            let row = Math.floor(index / columns);
            let col = index % columns;
            values[row][col] = c;
        });
        let matrix = [];
        values.forEach((row, rowIndex) => {           
            matrix.push(this._buildRow(row, rowIndex));
        });
        return matrix;
    }
}

    }
    


    module wijmo.barcode.composite {
    








class CCBInnerEncoder extends CCA {
    getVersionVariant() {
        const { bitBuffer, columns } = this;
        this.versionMeta = getECCBVersionVariantByCol(columns, bitBuffer.length);
    }

    getBytes() {
        this._encode();
        return this.bitBuffer.getGroupedBits(8);
    }
}

export class CCB extends MicroPDF417Encoder {
    private bytes: any;
    private autoHeight: boolean;

    constructor(linkageText, columns = 4, unitSize = 1, height) {
        const cfg: any = {
            text: linkageText,
            unitSize,
            compactionMode: 'byte',
            quietZone: {
                top: 0, right: 0, left: 0, bottom: 0,
            },
        };
        if (!!height) {
            cfg.height = height;
        }

        super(new wijmo.barcode.Option(cfg));
        this.columns = columns;
        const ccbInnerEncoder = new CCBInnerEncoder(linkageText, columns, unitSize, height);
        this.bytes = ccbInnerEncoder.getBytes();
        this.autoHeight = !height;
    }

    genEcc() {
        let { data, columns } = this;

        let totalLength = data.length;

        const info = getVersionVariantByCol(columns, totalLength);
        const dataSize = info.rows * info.cols - info.ecCws;
        if (dataSize < totalLength) {
            throw new wijmo.barcode.TextTooLongException();
        }

        let delta = dataSize - totalLength;
        while (delta > 0) {
            data.push(PDF417Base.PAD);
            delta--;
        }

        this.versionMeta = info;
        this.ecc = generateECCForMicro(data, info.ecCws);
        this.rows = info.rows;
        this.columns = info.cols;
        if (this.autoHeight) {
            this.encodeConfig.height = info.rows * 2;
        }
    }

    encode() {
        const { bytes } = this;
        let result = [];
        wijmo.barcode.Utils.sliceArray(bytes, 6, (arr) => {
            if (arr.length === 6) {
                let p = 5, sum = 0;
                const _arr = [];
                arr.forEach((c) => {
                    sum += c * Math.pow(256, p--);
                });

                let i = 0, t = Math.floor(sum / Math.pow(900, i)) % 900;
                do {
                    _arr.unshift(t);
                    t = Math.floor(sum / Math.pow(900, ++i)) % 900;
                } while (t > 0);

                while (_arr.length < 5) {
                    _arr.unshift(0);
                }
                result = result.concat(_arr);
            } else {
                arr.forEach((c) => {
                    result.push(c);
                });
            }
        });

        result.unshift(bytes.length % 6 === 0 ? MODE_BC6 : MODE_BC);
        result.unshift(920);
        return result;
    }

    calculateData() {
        this.data = this.encode();
        this.genEcc();

        let { data, ecc, columns, rows } = this;

        let cws = data.concat(ecc);

        let values = createModules(rows, columns);
        cws.forEach((c, index) => {
            let row = Math.floor(index / columns);
            let col = index % columns;
            values[row][col] = c;
        });

        let matrix = [];
        values.forEach((row, rowIndex) => {
            matrix.push(this._buildRow(row, rowIndex));
        });

        return matrix;
    }
}
    }
    


    module wijmo.barcode.composite {
    



const LinkageVersion = {
    CCA: 'CCA',
    CCB: 'CCB',
};

export abstract class GS1DataBarBase extends wijmo.barcode.OneDimensionalBarcode {
    static DefaultConfig = {
        linkage: '',
        linkageVersion: 'CCA',
        hideLinkageText: false,
        hideAIText: false,
    };

    static LinkageVersion = LinkageVersion;

    static combins(n, r) {
        let i, j;
        let maxDenom, minDenom;
        let val;
        if (n - r > r) {
            minDenom = r;
            maxDenom = n - r;
        }
        else {
            minDenom = n - r;
            maxDenom = r;
        }
        val = 1;
        j = 1;
        for (i = n; i > maxDenom; i--) {
            val *= i;
            if (j <= minDenom) {
                val /= j;
                j++;
            }
        }
        for (; j <= minDenom; j++) {
            val /= j;
        }
        return val;
    }
    static getRSSwidths(val, n, elements, maxWidth, noNarrow) {
        let bar;
        let elmWidth;
        let mxwElement;
        let subVal, lessVal;
        let narrowMask = 0;
        const widths = [];
        for (bar = 0; bar < elements - 1; bar++) {
            for (elmWidth = 1, narrowMask |= (1 << bar);
                ;
                elmWidth++ , narrowMask &= ~(1 << bar)) {
                /* get all combinations */
                subVal = GS1DataBarBase.combins(n - elmWidth - 1, elements - bar - 2);
                /* less combinations with no single-module element */
                if ((!noNarrow) && (narrowMask == 0) &&
                    (n - elmWidth - (elements - bar - 1) >= elements - bar - 1)) {
                    subVal -= GS1DataBarBase.combins(n - elmWidth - (elements - bar), elements - bar - 2);
                }
                /* less combinations with elements > maxVal */
                if (elements - bar - 1 > 1) {
                    lessVal = 0;
                    for (mxwElement = n - elmWidth - (elements - bar - 2);
                        mxwElement > maxWidth;
                        mxwElement--) {
                        lessVal += GS1DataBarBase.combins(n - elmWidth - mxwElement - 1, elements - bar - 3);
                    }
                    subVal -= lessVal * (elements - 1 - bar);
                }
                else if (n - elmWidth > maxWidth) {
                    subVal--;
                }
                val -= subVal;
                if (val < 0) break;
            }
            val += subVal;
            n -= elmWidth;
            widths[bar] = elmWidth;
        }
        widths[bar] = n;
        return widths;
    }
    static getRSSvalue(widths, elements, maxWidth, noNarrow) {
        let val = 0;
        let n;
        let bar;
        let elmWidth;
        let i;
        let mxwElement;
        let subVal, lessVal;
        let narrowMask = 0;
        for (n = i = 0; i < elements; i++) {
            n += widths[i];
        }
        for (bar = 0; bar < elements - 1; bar++) {
            for (elmWidth = 1, narrowMask |= (1 << bar); elmWidth < widths[bar]; elmWidth++ , narrowMask &= ~(1 << bar)) {
                /* get all nk combinations */
                subVal = GS1DataBarBase.combins(n - elmWidth - 1, elements - bar - 2);
            }
            /* less combinations with no narrow */
            if ((!noNarrow) && (narrowMask == 0) && (n - elmWidth - (elements - bar - 1) >= elements - bar - 1)) {
                subVal -= GS1DataBarBase.combins(n - elmWidth - (elements - bar), elements - bar - 2);
            }
            /* less combinations with elements > maxVal */
            if (elements - bar - 1 > 1) {
                lessVal = 0;
                for (mxwElement = n - elmWidth - (elements - bar - 2); mxwElement > maxWidth; mxwElement--) {
                    lessVal += GS1DataBarBase.combins(n - elmWidth - mxwElement - 1, elements - bar - 3);
                }
                subVal -= lessVal * (elements - 1 - bar);
            } else if (n - elmWidth > maxWidth) {
                subVal--;
                val += subVal;
            }
            n -= elmWidth;
        }
        return val;
    }
    static getGroup(collection, value) {
        for (let i = 0, len = collection.length; i < len; i++) {
            const item = collection[i];
            if (value >= item[0] && value <= item[1]) {
                return {
                    range: {
                        from: item[0],
                        to: item[1],
                    },
                    preTotal: item[2],
                    oddModules: item[3],
                    evenModules: item[4],
                    oddElements: item[5],
                    evenElements: item[6],
                    oddTotal: item[7],
                    evenTotal: item[8],
                };
            }
        }
    }
    static getChecksum(width, weights) {
        return width.reduce((sum, item, i) => {
            sum += item * weights[i];
            return sum;
        }, 0);
    }
    static makeComplementPattern(str) {
        let result = '';
        wijmo.barcode.Utils.loop((i) => {
            result += str[i] === '1' ? '0' : '1';
        }, str.length);
        return result;
    }
    static makeAlternatePattern(length, spaceFirst?) {
        let result = '';
        let flag = !spaceFirst;
        wijmo.barcode.Utils.loop(() => {
            result += flag ? '1' : '0';
            flag = !flag;
        }, length);
        return result;
    }
    static makeComplexPattern(str) {
        let result = '';
        let lastGroup = '';
        let lastFlag = false;
        wijmo.barcode.Utils.loop((i) => {
            if (str[i] === '0') {
                if (lastFlag) {
                    result += wijmo.barcode.Utils.strRepeat('0', lastGroup.length);
                    lastGroup = '';
                }
                lastGroup += '0';
                lastFlag = false;
            } else {
                if (!lastFlag) {
                    result += GS1DataBarBase.makeAlternatePattern(lastGroup.length);
                    lastGroup = '';
                }
                lastGroup += '1';
                lastFlag = true;
            }
        }, str.length);

        if (lastFlag) {
            result += wijmo.barcode.Utils.strRepeat('0', lastGroup.length);
        } else {
            result += GS1DataBarBase.makeAlternatePattern(lastGroup.length);
        }
        
        return result;
    }

    protected linkageText: any;
    protected linkage: any;
    protected hideLinkageText: any;
    protected hideAIText: any;
    protected linkageColumnCnt: any;
    constructor(option) {
        option.merge(GS1DataBarBase.DefaultConfig);
        super(option);
        let { config: { linkage, hideLinkageText, hideAIText } } = this;
        this.linkageText = linkage;
        this.linkage = !!linkage;
        this.hideLinkageText = hideLinkageText;
        this.hideAIText = hideAIText;
    }

    convertToShape(data, forMeasure) {
        if (!this.linkage) {
            super.convertToShape(data, forMeasure);
        } else {
            this._convertToShapeForLinkage(data, forMeasure);
        }
    }

    getLinkageOffset(data, linkageWidth) {
    }

    getLinkageSepPattern(data?){    
    }

    _convertToShapeForLinkage(data, forMeasure) {
        let { label, encodeConfig: { quietZone, isLabelBottom, height, showLabel, fontSizeInUnit }, style: { textAlign, unitValue }, linkageText, config: { linkageVersion, linkageHeight }, linkageColumnCnt } = this;
        const sepHeight = 1;

        const linkageEncoder = linkageVersion === LinkageVersion.CCA ? new CCA(linkageText, linkageColumnCnt, unitValue, linkageHeight) : new CCB(linkageText, linkageColumnCnt, unitValue, linkageHeight);
        linkageEncoder.toSymbol();

        const linkageArea = linkageEncoder.getMainArea();
        const linkageSepPattern = this.getLinkageSepPattern(data);
        const linkageSize = linkageArea.getSize();

        let labelHeight = 0;
        if (label && showLabel) {
            labelHeight = fontSizeInUnit;
        }
        height = height - linkageSize.height - sepHeight;
        const symbolWidth = data.length;
        const symbolHeight = height;
        const offset: any= this.getLinkageOffset(data, linkageSize.width);

        const mainArea = new wijmo.barcode.VerticalLayoutArea();
        const symbolArea = new wijmo.barcode.SymbolArea(symbolWidth, symbolHeight);
        const sepArea = new wijmo.barcode.SymbolArea(symbolWidth, sepHeight);

        mainArea.setStyle({
            padding: {
                top: quietZone.top,
                right: quietZone.right,
                bottom: quietZone.bottom,
                left: quietZone.left,
            }
        });
        symbolArea.setStyle({
            margin: {
                left: offset.symbolOffset,
            },
        });
        sepArea.setStyle({
            margin: {
                left: offset.symbolOffset,
            },
        });

        linkageArea.setStyle({
            margin: {
                left: offset.linkageOffset,
            },
        });
        
        const symbolSize = symbolArea.getSize();
        const labelArea = new wijmo.barcode.LabelArea(symbolSize.width, labelHeight, textAlign);
        if (isLabelBottom) {
            mainArea.append(linkageArea);
            mainArea.append(sepArea);
            mainArea.append(symbolArea);
            mainArea.append(labelArea);
        } else {
            mainArea.append(labelArea);
            mainArea.append(linkageArea);
            mainArea.append(sepArea);
            mainArea.append(symbolArea);
        }

        if (!forMeasure) {
            sepArea.fromPattern(linkageSepPattern);
            symbolArea.fromPattern(data);
            labelArea.append({ text: label });
            this.shapes = mainArea.toShapes();
        }

        this.size = mainArea.getSize();
    }
}

    }
    


    module wijmo.barcode.composite {
    



export class Expanded extends GS1DataBarBase {
    static Guard = [1, 1];

    static Group = [
        [0,    347,  0,    12, 5,  7, 2, 87, 4],
        [348,  1387, 348,  10, 7,  5, 4, 52, 20],
        [1388, 2947, 1388, 8,  9,  4, 5, 30, 52],
        [2948, 3987, 2948, 6,  11, 3, 6, 10, 104],
        [3988, 4191, 3988, 4,  13, 1, 8, 1,  204],
    ];

    static FinderPattern = {
        A1: [1, 8, 4, 1, 1],
        B1: [3, 6, 4, 1, 1],
        C1: [3, 4, 6, 1, 1],
        D1: [3, 2, 8, 1, 1],
        E1: [2, 6, 5, 1, 1],
        F1: [2, 2, 9, 1, 1],
        A2: [1, 1, 4, 8, 1],
        B2: [1, 1, 4, 6, 3],
        C2: [1, 1, 6, 4, 3],
        D2: [1, 1, 8, 2, 3],
        E2: [1, 1, 5, 6, 2],
        F2: [1, 1, 9, 2, 2],
    };

    static ChecksumWeight = {
        A1: {
            right: [1,3,9,27,81,32,96,77],
        },
        A2: {
            left: [20,60,180,118,143,7,21,63],
            right: [189,145,13,39,117,140,209,205],
        },
        B1: {
            left: [193,157,49,147,19,57,171,91],
            right: [62,186,136,197,169,85,44,132],
        },
        B2: {
            left: [185,133,188,142,4,12,36,108],
            right: [113,128,173,97,80,29,87,50],
        },
        C1: {
            left: [150,28,84,41,123,158,52,156],
            right: [46,138,203,187,139,206,196,166],
        },
        C2: {
            left: [76,17,51,153,37,111,122,155],
            right: [43,129,176,106,107,110,119,146],
        },
        D1: {
            left: [16,48,144,10,30,90,59,177],
            right: [109,116,137,200,178,112,125,164],
        },
        D2: {
            left: [70,210,208,202,184,130,179,115],
            right: [134,191,151,31,93,68,204,190],
        },
        E1: {
            left: [148,22,66,198,172,94,71,2],
            right: [6,18,54,162,64,192,154,40],
        },
        E2: {
            left: [120,149,25,75,14,42,126,167],
            right: [79,26,78,23,69,207,199,175],
        },
        F1: {
            left: [103,98,83,38,114,131,182,124],
            right: [161,61,183,127,170,88,53,159],
        },
        F2: {
            left: [55,165,73,8,24,72,5,15],
            right: [45,135,194,160,58,174,100,89],
        }
    };

    static FinderPatternSeq = [
        ['A1', 'A2'],
        ['A1', 'B2', 'B1'],
        ['A1', 'C2', 'B1', 'D2'],
        ['A1', 'E2', 'B1', 'D2', 'C1'],
        ['A1', 'E2', 'B1', 'D2', 'D1', 'F2'],
        ['A1', 'E2', 'B1', 'D2', 'E1', 'F2', 'F1'],

        ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'],
        ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'E2', 'E1'],
        ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'E2', 'F1', 'F2'],
        ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'E2', 'E1', 'F2', 'F1'],
    ];

    static getFinderPatternSeq(symbolCnt) {
        const seq = ~~((symbolCnt - 3) / 2);
        return Expanded.FinderPatternSeq[seq];
    }

    static isVersion1Finder(n) {
        return ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'].indexOf(n) > -1;
    }

    static MethodReg_0100 = /^([01])19([0-9]{12})(.)3103([0-9]{6})$/;
    static MethodReg_0101 = /^([01])19([0-9]{12})(.)320([23])0([0-9]{5})$/;
    static MethodReg_0111000_0111111= /^([01])19([0-9]{12})(.)(3[12]0[0-9])0([0-9]{5})(1[1357])([0-9]{6})$/;
    static MethodReg_01100 = /^([01])19([0-9]{12})(.)392([0-3])(.+)$/;
    static MethodReg_01101 = /^([01])19([0-9]{12})(.)393([0-3])([0-9]{3})(.+)$/;
    static MethodReg_1 = /([01])1([0-9]{13})(.)(.*)$/;

    protected _bitBuffer: any;
    protected _gpdEncodation: any;
    protected finderPatternSeq: any;
    protected symbolContentSize: any;

    constructor(option) {
        super(option);
        let { encodeConfig: { text }, linkage, hideLinkageText, linkageText, hideAIText } = this;
        this.text = text.replace(/\(|\)/g, '');
        this.label = text;
        if (linkage && !hideLinkageText) {
            this.label += linkageText;
        }

        if (hideAIText) {
            this.label = this.label.replace(/\(\w*\)/g, '');
        }
        this._bitBuffer = new wijmo.barcode.BitBuffer();
        this._gpdEncodation = new GS1GeneralPurposeDataEncodation(this._bitBuffer);
        this.finderPatternSeq = null;
        this.symbolContentSize = null;
        this.linkageColumnCnt = 4;
    }

    _getSubsetWidth(number, orderLeftToRight = false) {
        const group = GS1DataBarBase.getGroup(Expanded.Group, number);

        const odd = ~~((number - group.preTotal) / group.evenTotal);
        const even = (number - group.preTotal) % group.evenTotal;
        const oddValues = GS1DataBarBase.getRSSwidths(odd, group.oddModules, 4, group.oddElements, false);
        const evenValues = GS1DataBarBase.getRSSwidths(even, group.evenModules, 4, group.evenElements, true);
 
        const result = [];
        wijmo.barcode.Utils.loop((i) => {
            result.push(oddValues[i]);
            result.push(evenValues[i]);          
        }, 4);
        return orderLeftToRight ? result : result.reverse();
    }
    _getChecksum(widths){
        let checksum = 0;
        widths.forEach((width, i) => {
            let finderPattern, isLeft;
            if (i === 0) {
                finderPattern = this.finderPatternSeq[0];
                isLeft = false;
            } else {
                const pos = i - 1;
                finderPattern = this.finderPatternSeq[1 + ~~(pos / 2)];
                isLeft = wijmo.barcode.Utils.isEven(pos);
            }

            let checksumWeight = Expanded.ChecksumWeight[finderPattern][isLeft ? 'left' : 'right'];
            checksumWeight = isLeft ? checksumWeight : checksumWeight.concat().reverse(); // reverse copy
            checksum += GS1DataBarBase.getChecksum(width, checksumWeight);
        });

        checksum = checksum % 211 + (this.symbolContentSize - 4) * 211;
        return checksum;
    }
    _getContent(dataWidths) {
        const result = [];
        dataWidths.forEach((item, i) => {
            if (wijmo.barcode.Utils.isEven(i)) {
                result.push(...item);
                const finderPattern = this.finderPatternSeq[~~(i / 2)];
                result.push(...Expanded.FinderPattern[finderPattern]);
            } else {
                result.push(...item);
            }
        });
        return result;
    }

    _addLength(methodLength) {
        const { _bitBuffer: bitBuffer } = this;
        const symbolCnt = ~~((bitBuffer.length + 11) / 12) + 1;
        bitBuffer.putBitAt(!wijmo.barcode.Utils.isEven(symbolCnt), 1 + methodLength);
        bitBuffer.putBitAt(symbolCnt > 14, 2 + methodLength);
    }

    //#region encode method
    _encode() {
        const { text } = this;
        if (Expanded.MethodReg_0100.test(text)) {
            this._encode_0100();
        } else if (Expanded.MethodReg_0101.test(text)) {
            this._encode_0101();
        } else if (Expanded.MethodReg_0111000_0111111.test(text)) {
            this._encode_0111000_0111111();
        } else if (Expanded.MethodReg_01100.test(text)) {
            this._encode_01100();
        } else if (Expanded.MethodReg_01101.test(text)) {
            this._encode_01101();
        } else if (Expanded.MethodReg_1.test(text)) {
            this._encode_1();
        } else {
            this._encode_00();
        }
    }
    _encode_1() {
        const { text, _bitBuffer: bitBuffer, _gpdEncodation } = this;
        const result = Expanded.MethodReg_1.exec(text);
        const AI = result[2];
        bitBuffer.putBits('1');
        bitBuffer.putBits('00');
        bitBuffer.put(+AI[0], 4);

        wijmo.barcode.Utils.sliceString(AI.substr(1), 3, (str) => {
            bitBuffer.put(+str, 10);
        });
        _gpdEncodation.encode(result[4]);
        this._addLength(1);
    }
    _encode_0100() {
        const { text, _bitBuffer: bitBuffer } = this;
        const result = Expanded.MethodReg_0100.exec(text);
        const AI9 = result[2], weight = +result[4];
        if (weight > 32767) {
            throw new wijmo.barcode.InvalidTextException(text, 'With method 0100, the weight should not larger than 32767.');
        }
        bitBuffer.putBits('0100');
        wijmo.barcode.Utils.sliceString(AI9, 3, (str) => {
            bitBuffer.put(+str, 10);
        });
        bitBuffer.put(weight, 15);
    }
    _encode_0101() {
        const { text, _bitBuffer: bitBuffer } = this;
        const result = Expanded.MethodReg_0101.exec(text);
        const AI9 = result[2], is3202 = result[4][0] == '2', weight = +result[5];

        if ((is3202 && weight > 999) || (!is3202 && weight > 22767)) {
            throw new wijmo.barcode.InvalidTextException(text, `With method 0101, the weight should not larger than ${weight}.`);
        }
        bitBuffer.putBits('0101');
        wijmo.barcode.Utils.sliceString(AI9, 3, (str) => {
            bitBuffer.put(+str, 10);
        });
        bitBuffer.put(is3202 ? weight : weight + 10000, 15);
    }
    _encode_0111000_0111111() {
        const { text, _bitBuffer: bitBuffer } = this;
        const result = Expanded.MethodReg_0111000_0111111.exec(text);
        const AI9 = result[2];

        let code = +result[6][1];
        if (result[4][1] === '1') {
            code--;
        }
        code += 0x38;
        bitBuffer.put(code, 7);

        wijmo.barcode.Utils.sliceString(AI9, 3, (str) => {
            bitBuffer.put(+str, 10);
        });
        bitBuffer.put(+(result[4][3] + result[5]), 20);
        const date = /^(\d{2})(\d{2})(\d{2})$/.exec(result[7]);
        bitBuffer.put((+date[1] * 384) + (+date[2] - 1) * 32 + (+date[3]) ,  16);
    }
    _encode_01100() {
        const { text, _bitBuffer: bitBuffer, _gpdEncodation } = this;
        const result = Expanded.MethodReg_01100.exec(text);
        const AI9 = result[2];

        bitBuffer.putBits('01100');
        bitBuffer.putBits('00');
        wijmo.barcode.Utils.sliceString(AI9, 3, (str) => {
            bitBuffer.put(+str, 10);
        });
        bitBuffer.put(+result[4], 2);
        _gpdEncodation.encode(result[5]);
        this._addLength(5);
    }
    _encode_01101() {
        const { text, _bitBuffer: bitBuffer, _gpdEncodation } = this;
        const result = Expanded.MethodReg_01101.exec(text);
        const AI9 = result[2];

        bitBuffer.putBits('01101');
        bitBuffer.putBits('00');
        wijmo.barcode.Utils.sliceString(AI9, 3, (str) => {
            bitBuffer.put(+str, 10);
        });

        bitBuffer.put(+result[4], 2);
        bitBuffer.put(+result[5], 10);
        _gpdEncodation.encode(result[6]);
        this._addLength(5);
    }
    _encode_00() {
        const { text, _bitBuffer: bitBuffer, _gpdEncodation } = this;

        bitBuffer.putBits('00');
        bitBuffer.putBits('00');
        _gpdEncodation.encode(text);
        this._addLength(2);
    }
    // #endregion

    makeDataWidth() {
        const { _bitBuffer: bitBuffer, linkage } = this;
        bitBuffer.putBit(linkage);

        this._encode();

        const symbolCnt = ~~((bitBuffer.length + 11) / 12) + 1;
        const characters = bitBuffer.getGroupedBits(12);
        const dataWidth = characters.map((c, i) => this._getSubsetWidth(c, !wijmo.barcode.Utils.isEven(i)));
        this.finderPatternSeq = Expanded.getFinderPatternSeq(symbolCnt);
        this.symbolContentSize = symbolCnt;

        const checksum = this._getChecksum(dataWidth);
        const checksumWidth = this._getSubsetWidth(checksum, true);
        dataWidth.unshift(checksumWidth);
        return this._getContent(dataWidth);
    }

    calculateData() {
        let datas = this.makeDataWidth();
        datas = [...Expanded.Guard, ...datas, ...Expanded.Guard];
        return wijmo.barcode.Utils.toZeroOnePattern(datas);
    }

    getLinkageSepPattern(data) {
        const pattern = data.substr(2, data.length - 4);
        const size = 17 + 15 + 17;
        let linkageSepPattern = '';

        wijmo.barcode.Utils.sliceString(pattern, size, (str, i) => {
            const finderPattern = this.finderPatternSeq[i];
            const fp = Expanded.FinderPattern[finderPattern];
            linkageSepPattern += GS1DataBarBase.makeComplementPattern(str.substr(0, 17));

            if (Expanded.isVersion1Finder(finderPattern)) {
                const n1 = fp[0] + fp[1] + fp[2];
                const n2 = fp[3] + fp[4];
                linkageSepPattern += GS1DataBarBase.makeComplexPattern(str.substr(17, n1));
                linkageSepPattern += GS1DataBarBase.makeComplementPattern(str.substr(17 + n1, n2));
            } else {
                const n1 = fp[0] + fp[1];
                const n2 = fp[2] + fp[3] + fp[4];
                linkageSepPattern += GS1DataBarBase.makeComplementPattern(str.substr(17, n1));
                linkageSepPattern +=  GS1DataBarBase.makeComplexPattern(str.substr(17 + n1, n2));
            }

            if (str.length === size) {
                linkageSepPattern += GS1DataBarBase.makeComplementPattern(str.substr(32, 17));
            }
        });

        return '0000' + linkageSepPattern.substr(2, linkageSepPattern.length - 4) + '0000';
    }
    getLinkageOffset(data) {
        let offset = 1;
        while(data[offset] === '1') {
            offset++;
        }

        return {
            linkageOffset: offset,
            symbolOffset: 0,
        };
    }
}
    }
    


    module wijmo.barcode.composite {
    


export class GS1DataBarFirstType extends GS1DataBarBase {
    static LeftGuard = '01';
    static RightGuard = '01';
    static Group = {
        OutSide: [
            [0, 160, 0, 12, 4, 8, 1, 161, 1],
            [161, 960, 161, 10, 6, 6, 3, 80, 10],
            [961, 2014, 961, 8, 8, 4, 5, 31, 34],
            [2015, 2714, 2015, 6, 10, 3, 6, 10, 70],
            [2715, 2840, 2715, 4, 12, 1, 8, 1, 126],
        ],
        InSide: [
            [0, 335, 0, 5, 10, 2, 7, 4, 84],
            [336, 1035, 336, 7, 8, 4, 5, 20, 35],
            [1036, 1515, 1036, 9, 6, 6, 3, 48, 10],
            [1516, 1596, 1516, 11, 4, 8, 1, 81, 1],
        ],
    };
    static ChecksumWeight = [
        [1, 3, 9, 27, 2, 6, 18, 54],
        [4, 12, 36, 29, 8, 24, 72, 58],
        [16, 48, 65, 37, 32, 17, 51, 74],
        [64, 34, 23, 69, 49, 68, 46, 59]
    ];
    static FinderPattern = [
        [3, 8, 2, 1, 1],
        [3, 5, 5, 1, 1],
        [3, 3, 7, 1, 1],
        [3, 1, 9, 1, 1],
        [2, 7, 4, 1, 1],
        [2, 5, 6, 1, 1],
        [2, 3, 8, 1, 1],
        [1, 5, 7, 1, 1],
        [1, 3, 9, 1, 1]
    ];

    protected linkageColumnCnt: any;
    constructor(option) {
        super(option);
        let { encodeConfig: { text, hideExtraChecksum }, hideLinkageText, linkageText, linkage, hideAIText } = this;
        this.label = text;
        if (text.length < 18) {
            text += this._getCheckDigit(text);

            if (!hideExtraChecksum) {
                this.label = text;
            }
        }

        if (linkage && !hideLinkageText) {
            this.label += linkageText;
        }

        if (hideAIText) {
            this.label = this.label.replace(/\(\w*\)/g, '');
        }
        this.text = text;
        this.linkageColumnCnt = 4;
    }

    validate() {
        const { text } = this.encodeConfig;

        const reg = /^\(01\)(\d{13}|\d{14})$/;
        if (!reg.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text, 'Text should be numbers. The length should be 17 or 18.');
        }

        if (text.length === 18) {
            let checkDigit = this._getCheckDigit(text);

            if (checkDigit != text[17]) {
                throw new wijmo.barcode.InvalidTextException(text, 'Check digit is invalid.');
            }
        }
    }

    _getCheckDigit(text) {
        let numberArray = wijmo.barcode.Utils.str2Array(text.substr(4, 13));

        let sum = numberArray.reduce((sum, num, index) => {
            num = +num;
            sum += wijmo.barcode.Utils.isOdd(index) ? num : num * 3;
            return sum;
        }, 0);
        let remainder = sum % 10;
        if (remainder === 0) {
            return 0;
        }

        return 10 - remainder;
    }
    _getSubsetWidth(data, isInside) {
        const collection = isInside ? GS1DataBarFirstType.Group.InSide : GS1DataBarFirstType.Group.OutSide;
        const group = GS1DataBarBase.getGroup(collection, data);
        const v = isInside ? group.oddTotal : group.evenTotal;
        let odd, even;
        if (isInside) {
            even = ~~((data - group.preTotal) / v);
            odd = (data - group.preTotal) % v;
        } else {
            odd = ~~((data - group.preTotal) / v);
            even = (data - group.preTotal) % v;
        }

        const oddValues = GS1DataBarBase.getRSSwidths(odd, group.oddModules, 4, group.oddElements, !isInside);
        const evenValues = GS1DataBarBase.getRSSwidths(even, group.evenModules, 4, group.evenElements, isInside);
        const result = [];
        wijmo.barcode.Utils.loop((i) => {
            result.push(oddValues[i]);
            result.push(evenValues[i]);
        }, 4);

        return result;
    }
    _getFinderPatternWidth(value) {
        const row = GS1DataBarFirstType.FinderPattern[value];
        let result = '';
        wijmo.barcode.Utils.loop((i) => {
            result += row[i];
        }, 5);

        return wijmo.barcode.Utils.str2Array(result);
    }
    _getChecksum({ width1, width2, width3, width4 }) {
        let checksum = 0;
        checksum += GS1DataBarBase.getChecksum(width1, GS1DataBarFirstType.ChecksumWeight[0]);
        checksum += GS1DataBarBase.getChecksum(width2, GS1DataBarFirstType.ChecksumWeight[1]);
        checksum += GS1DataBarBase.getChecksum(width3, GS1DataBarFirstType.ChecksumWeight[2]);
        checksum += GS1DataBarBase.getChecksum(width4, GS1DataBarFirstType.ChecksumWeight[3]);
        checksum %= 79;

        if (checksum >= 8) {
            checksum++;
        }

        if (checksum >= 72) {
            checksum++;
        }

        return checksum;
    }
    _getSymbolCharacterWidth(symbolValue) {
        const left = ~~(symbolValue / 4537077);
        const right = symbolValue % 4537077;
        const data1 = ~~(left / 1597);
        const data2 = left % 1597;
        const data3 = ~~(right / 1597);
        const data4 = right % 1597;

        const width1 = this._getSubsetWidth(data1, false);
        const width2 = this._getSubsetWidth(data2, true);
        const width3 = this._getSubsetWidth(data3, false);
        const width4 = this._getSubsetWidth(data4, true);

        return { width1, width2, width3, width4 };
    }

    getSymbolStructure() {
        const { text, linkage } = this;
        const content = text.substr(4, 13);
        const number = linkage ? +content + 10000000000000 : +content;
        const scWidth = this._getSymbolCharacterWidth(number);
        const checksum = this._getChecksum(scWidth);
        const leftCheck = ~~(checksum / 9);
        const rightCheck = checksum % 9;
        const leftFinderPattern = this._getFinderPatternWidth(leftCheck);
        const rightFinderPattern = this._getFinderPatternWidth(rightCheck);
        const { width1, width2, width3, width4 } = scWidth;
        return {
            width1, width2, width3, width4, leftFinderPattern, rightFinderPattern,
        };
    }

    getLinkageSepPattern(str) {
        let separator = '';
        separator += GS1DataBarBase.makeComplementPattern(str.substr(2, 16));
        separator += GS1DataBarBase.makeComplexPattern(str.substr(18, 13));
        separator += GS1DataBarBase.makeComplementPattern(str.substr(31, 34));
        separator += GS1DataBarBase.makeComplexPattern(str.substr(65, 13));
        separator += GS1DataBarBase.makeComplementPattern(str.substr(78, 16));

        return '0000' + separator.substr(2, separator.length - 2) + '0000';
    }

    calculateData() {
        const { width1, width2, width3, width4, leftFinderPattern, rightFinderPattern } = this.getSymbolStructure();
        const data = [
            ...width1,
            ...leftFinderPattern,
            ...width2.reverse(),
            ...width4,
            ...rightFinderPattern.reverse(),
            ...width3.reverse(),
        ];
        return GS1DataBarFirstType.LeftGuard + wijmo.barcode.Utils.toZeroOnePattern(data) + GS1DataBarFirstType.RightGuard;
    }
}

    }
    


    module wijmo.barcode.composite {
    



export class Limited extends GS1DataBarFirstType {
    static LeftGuard = '01';
    static RightGuard = '0100000';
    static Group : any = [
        [0,       183063,  0,       17,  9,  6, 3, 6538,  28],
        [183064,  820063,  183064,  13,  13, 5, 4, 875,   728],
        [820064,  1000775, 820064,  9,   17, 3, 6, 28,    6454],
        [1000776, 1491020, 1000776, 15,  11, 5, 4, 2415,  203],
        [1491021, 1979844, 1491021, 11,  15, 4, 5, 203,   2408],
        [1979845, 1996938, 1979845, 19,  7,  8, 1, 17094, 1],
        [1996939, 2013570, 1996939, 7,   19, 1, 8, 1,     16632]
    ];
    static ChecksumWeight = [
        [1,3,9,27,81,65,17,51,64,14,42,37,22,66],//left data character
        [20,60,2,6,18,54,73,41,34,13,39,28,84,74],//right data character
    ];
    static ChecksumWidth = [
        [1,1,1,1,1,1,1,1,1,1,3,3,1,1],//0
        [1,1,1,1,1,1,1,1,1,2,3,2,1,1],//1
        [1,1,1,1,1,1,1,1,1,3,3,1,1,1],//2
        [1,1,1,1,1,1,1,2,1,1,3,2,1,1],//3
        [1,1,1,1,1,1,1,2,1,2,3,1,1,1],//4
        [1,1,1,1,1,1,1,3,1,1,3,1,1,1],//5
        [1,1,1,1,1,2,1,1,1,1,3,2,1,1],//6
        [1,1,1,1,1,2,1,1,1,2,3,1,1,1],//7
        [1,1,1,1,1,2,1,2,1,1,3,1,1,1],//8
        [1,1,1,1,1,3,1,1,1,1,3,1,1,1],//9
        [1,1,1,2,1,1,1,1,1,1,3,2,1,1],//10
        [1,1,1,2,1,1,1,1,1,2,3,1,1,1],//11
        [1,1,1,2,1,1,1,2,1,1,3,1,1,1],//12
        [1,1,1,2,1,2,1,1,1,1,3,1,1,1],//13
        [1,1,1,3,1,1,1,1,1,1,3,1,1,1],//14
        [1,2,1,1,1,1,1,1,1,1,3,2,1,1],//15
        [1,2,1,1,1,1,1,1,1,2,3,1,1,1],//16
        [1,2,1,1,1,1,1,2,1,1,3,1,1,1],//17
        [1,2,1,1,1,2,1,1,1,1,3,1,1,1],//18
        [1,2,1,2,1,1,1,1,1,1,3,1,1,1],//19
        [1,3,1,1,1,1,1,1,1,1,3,1,1,1],//20
        [1,1,1,1,1,1,1,1,2,1,2,3,1,1],//21
        [1,1,1,1,1,1,1,1,2,2,2,2,1,1],//22
        [1,1,1,1,1,1,1,1,2,3,2,1,1,1],//23
        [1,1,1,1,1,1,1,2,2,1,2,2,1,1],//24
        [1,1,1,1,1,1,1,2,2,2,2,1,1,1],//25
        [1,1,1,1,1,1,1,3,2,1,2,1,1,1],//26
        [1,1,1,1,1,2,1,1,2,1,2,2,1,1],//27
        [1,1,1,1,1,2,1,1,2,2,2,1,1,1],//28
        [1,1,1,1,1,2,1,2,2,1,2,1,1,1],//29
        [1,1,1,1,1,3,1,1,2,1,2,1,1,1],//30
        [1,1,1,2,1,1,1,1,2,1,2,2,1,1],//31
        [1,1,1,2,1,1,1,1,2,2,2,1,1,1],//32
        [1,1,1,2,1,1,1,2,2,1,2,1,1,1],//33
        [1,1,1,2,1,2,1,1,2,1,2,1,1,1],//34
        [1,1,1,3,1,1,1,1,2,1,2,1,1,1],//35
        [1,2,1,1,1,1,1,1,2,1,2,2,1,1],//36
        [1,2,1,1,1,1,1,1,2,2,2,1,1,1],//37
        [1,2,1,1,1,1,1,2,2,1,2,1,1,1],//38
        [1,2,1,1,1,2,1,1,2,1,2,1,1,1],//39
        [1,2,1,2,1,1,1,1,2,1,2,1,1,1],//40
        [1,3,1,1,1,1,1,1,2,1,2,1,1,1],//41
        [1,1,1,1,1,1,1,1,3,1,1,3,1,1],//42
        [1,1,1,1,1,1,1,1,3,2,1,2,1,1],//43
        [1,1,1,1,1,1,1,2,3,1,1,2,1,1],//44
        [1,1,1,2,1,1,1,1,3,1,1,2,1,1],//45
        [1,2,1,1,1,1,1,1,3,1,1,2,1,1],//46
        [1,1,1,1,1,1,2,1,1,1,2,3,1,1],//47
        [1,1,1,1,1,1,2,1,1,2,2,2,1,1],//48
        [1,1,1,1,1,1,2,1,1,3,2,1,1,1],//49
        [1,1,1,1,1,1,2,2,1,1,2,2,1,1],//50
        [1,1,1,2,1,1,2,1,1,1,2,2,1,1],//51
        [1,1,1,2,1,1,2,1,1,2,2,1,1,1],//52
        [1,1,1,2,1,1,2,2,1,1,2,1,1,1],//53
        [1,1,1,2,1,2,2,1,1,1,2,1,1,1],//54
        [1,1,1,3,1,1,2,1,1,1,2,1,1,1],//55
        [1,2,1,1,1,1,2,1,1,1,2,2,1,1],//56
        [1,2,1,1,1,1,2,1,1,2,2,1,1,1],//57
        [1,2,1,2,1,1,2,1,1,1,2,1,1,1],//58
        [1,1,1,1,2,1,1,1,1,1,2,3,1,1],//59
        [1,1,1,1,2,1,1,1,1,2,2,2,1,1],//60
        [1,1,1,1,2,1,1,1,1,3,2,1,1,1],//61
        [1,1,1,1,2,1,1,2,1,1,2,2,1,1],//62
        [1,1,1,1,2,1,1,2,1,2,2,1,1,1],//63
        [1,1,1,1,2,2,1,1,1,1,2,2,1,1],//64
        [1,2,1,1,2,1,1,1,1,1,2,2,1,1],//65
        [1,2,1,1,2,1,1,1,1,2,2,1,1,1],//66
        [1,2,1,1,2,1,1,2,1,1,2,1,1,1],//67
        [1,2,1,1,2,2,1,1,1,1,2,1,1,1],//68
        [1,2,1,2,2,1,1,1,1,1,2,1,1,1],//69
        [1,3,1,1,2,1,1,1,1,1,2,1,1,1],//70
        [1,1,2,1,1,1,1,1,1,1,2,3,1,1],//71
        [1,1,2,1,1,1,1,1,1,2,2,2,1,1],//72
        [1,1,2,1,1,1,1,1,1,3,2,1,1,1],//73
        [1,1,2,1,1,1,1,2,1,1,2,2,1,1],//74
        [1,1,2,1,1,1,1,2,1,2,2,1,1,1],//75
        [1,1,2,1,1,1,1,3,1,1,2,1,1,1],//76
        [1,1,2,1,1,2,1,1,1,1,2,2,1,1],//77
        [1,1,2,1,1,2,1,1,1,2,2,1,1,1],//78
        [1,1,2,2,1,1,1,1,1,1,2,2,1,1],//79
        [2,1,1,1,1,1,1,1,1,2,2,2,1,1],//80
        [2,1,1,1,1,1,1,1,1,3,2,1,1,1],//81
        [2,1,1,1,1,1,1,2,1,1,2,2,1,1],//82
        [2,1,1,1,1,1,1,2,1,2,2,1,1,1],//83
        [2,1,1,1,1,1,1,3,1,1,2,1,1,1],//84
        [2,1,1,1,1,2,1,1,1,2,2,1,1,1],//85
        [2,1,1,1,1,2,1,2,1,1,2,1,1,1],//86
        [2,1,1,2,1,1,1,1,1,2,2,1,1,1],//87
        [2,1,1,1,1,1,1,1,2,2,1,2,1,1],//88
    ];

    linkageColumnCnt = 3;
    _getSubsetWidth(number) {
        const group = GS1DataBarBase.getGroup(Limited.Group, number);
        const odd = ~~((number - group.preTotal) / group.evenTotal);
        const even = (number - group.preTotal) % group.evenTotal;
        const oddValues = GS1DataBarBase.getRSSwidths(odd, group.oddModules, 7, group.oddElements, true);
        const evenValues = GS1DataBarBase.getRSSwidths(even, group.evenModules, 7, group.evenElements, false);
        const result = [];
        wijmo.barcode.Utils.loop((i) => {
            result.push(oddValues[i]);
            result.push(evenValues[i]);
        }, 7);
        return result;
    }
    _getChecksum({ leftWidth, rightWidth }: any){
        let checksum = 0;
        checksum += GS1DataBarBase.getChecksum(leftWidth, Limited.ChecksumWeight[0]);
        checksum += GS1DataBarBase.getChecksum(rightWidth, Limited.ChecksumWeight[1]);
        checksum %= 89;
        return checksum;
    }
    _getSymbolCharacterWidth(number) : any{
        const left = ~~(number / 2013571);
        const right = number % 2013571;
        const leftWidth = this._getSubsetWidth(left);
        const rightWidth = this._getSubsetWidth(right);

        return { leftWidth, rightWidth };
    }

    getLinkageSepPattern(str) {
        str = str.substr(0, str.length - 5);
        const separator = GS1DataBarBase.makeComplementPattern(str);
        return '0000' + separator.substr(4, separator.length - 8) + '0000';
    }

    getSymbolStructure() : any{
        const { text, linkage } = this;
        const content = text.substr(4, 13);
        const number = linkage ? +content + 2015133531096 : +content;

        const scWidth = this._getSymbolCharacterWidth(number);
        const checksum = this._getChecksum(scWidth);
        const checksumWidth = Limited.ChecksumWidth[checksum];
        const { leftWidth, rightWidth } = scWidth;
        return {
            leftWidth, rightWidth, checksumWidth,
        };
    }

    getLinkageOffset(data, linkageWidth) {
        let linkageRightPos = data.length - 1 - 5;
        while(data[linkageRightPos] === '1') {
            linkageRightPos--;
        }
        return {
            linkageOffset: 0,
            symbolOffset: linkageWidth - linkageRightPos - 1,
        };
    }

    calculateData() {
        const { leftWidth, rightWidth, checksumWidth } = this.getSymbolStructure();
        const data = [...leftWidth, ...checksumWidth, ...rightWidth];
        return Limited.LeftGuard + wijmo.barcode.Utils.toZeroOnePattern(data) + Limited.RightGuard;
    }
}

    }
    


    module wijmo.barcode.composite {
    





export abstract class StackedBase extends GS1DataBarFirstType {
    static DefaultConfig: any = {
        showLabel: false,
        ratio: 0.4,
    };
    constructor(option) {
        option.merge(StackedBase.DefaultConfig);
        super(option);
        this.linkageColumnCnt = 2;
    }

    static RightGuard = '10';
    static LeftGuard = '10';

    calculateData(): any {
        const { width1, width2, width3, width4, leftFinderPattern, rightFinderPattern } = this.getSymbolStructure();
        let topRow: any = [...width1, ...leftFinderPattern, ...width2.reverse()];
        let bottomRow: any = [...width4, ...rightFinderPattern.reverse(), ...width3.reverse()];
        topRow = GS1DataBarFirstType.LeftGuard + wijmo.barcode.Utils.toZeroOnePattern(topRow) + StackedBase.RightGuard;
        bottomRow = StackedBase.LeftGuard + wijmo.barcode.Utils.toZeroOnePattern(bottomRow, true) + GS1DataBarFirstType.RightGuard;

        return {
            topRow, bottomRow, separators: this.getSeparator(topRow, bottomRow),
        };
    }

    abstract getSeparator(topRow, bottomRow);

    getLinkageSepPattern(str) {
        let separator = '';
        separator += GS1DataBarBase.makeComplementPattern(str.substr(2, 16));
        separator += GS1DataBarBase.makeComplexPattern(str.substr(18, 13));
        separator += GS1DataBarBase.makeComplementPattern(str.substr(31, 15));

        return '0000' + separator.substr(2, separator.length - 2) + '0000';
    }

    convertToShape(data, forMeasure) {
        if (!this.linkage) {
            this._convertToShape(data, forMeasure);
        } else {
            this._convertToShapeForLinkage(data, forMeasure);
        }
    }

    getLinkageOffset(data) {
        let linkageOffset = 0;
        while(data[linkageOffset] === '1') {
            linkageOffset++;
        }

        linkageOffset++;

        return {
            linkageOffset,
            symbolOffset: 0,
        };
    }

    _convertToShapeForLinkage(data, forMeasure) {
        let { label, encodeConfig: { quietZone, isLabelBottom, height, showLabel, fontSizeInUnit }, config: { ratio }, style: { textAlign, unitValue }, linkageText, config: { linkageVersion, linkageHeight }, linkageColumnCnt } = this;

        const linkageEncoder = linkageVersion === GS1DataBarBase.LinkageVersion.CCA ? 
            new CCA(linkageText, linkageColumnCnt, unitValue, linkageHeight) : new CCB(linkageText, linkageColumnCnt, unitValue, linkageHeight);
        (linkageEncoder as any).toSymbol();

        const linkageArea = (linkageEncoder as any).getMainArea();
        const linkageSepPattern = this.getLinkageSepPattern(data.topRow);

        let labelHeight = 0;
        if (label && showLabel) {
            labelHeight = fontSizeInUnit;
        }
        const symbolWidth = 50;
        const separatorHeight = data.separators.length;

        const offset = this.getLinkageOffset(data);

        const mainArea = new wijmo.barcode.VerticalLayoutArea();
        
        const labelArea = new wijmo.barcode.LabelArea(symbolWidth, labelHeight, textAlign);
        const topSymbolArea = new wijmo.barcode.SymbolArea(symbolWidth, (height - separatorHeight) * ratio);
        const bottomSymbolArea = new wijmo.barcode.SymbolArea(symbolWidth, (height - separatorHeight) * (1 - ratio));
        const sepArea = new wijmo.barcode.SymbolArea(symbolWidth, 1);

        mainArea.setStyle({
            padding: {
                top: quietZone.top,
                right: quietZone.right,
                bottom: quietZone.bottom,
                left: quietZone.left,
            },
        });
        linkageArea.setStyle({
            margin: {
                left: offset.linkageOffset,
            },
        });

        if (!isLabelBottom) {
            mainArea.append(labelArea);
        }
        mainArea.append(linkageArea);
        mainArea.append(sepArea);
        mainArea.append(topSymbolArea);
        const separatorAreas = [];
        data.separators.forEach(() => {
            const s = new wijmo.barcode.SymbolArea(symbolWidth, 1);
            separatorAreas.push(s);
            mainArea.append(s);
        });
        mainArea.append(bottomSymbolArea);
        if (isLabelBottom) {
            mainArea.append(labelArea);
        }

        if (!forMeasure) {
            sepArea.fromPattern(linkageSepPattern);
            topSymbolArea.fromPattern(data.topRow);
            bottomSymbolArea.fromPattern(data.bottomRow);
            separatorAreas.forEach((s, i) => {
                s.fromPattern(data.separators[i]);
            });
            labelArea.append({ text: label });
            this.shapes = mainArea.toShapes();
        }

        this.size = mainArea.getSize();
    } 
    _convertToShape(data, forMeasure) {
        let { label, encodeConfig: { quietZone, isLabelBottom, height, showLabel, fontSizeInUnit }, config: { ratio }, style: { textAlign } } = this;

        let labelHeight = 0;
        if (label && showLabel) {
            labelHeight = fontSizeInUnit;
        }

        const symbolWidth = 50;
        const separatorHeight = data.separators.length;

        const mainArea = new wijmo.barcode.VerticalLayoutArea();
        mainArea.setStyle({
            padding: {
                top: quietZone.top,
                right: quietZone.right,
                bottom: quietZone.bottom,
                left: quietZone.left,
            },
        });
    
        const labelArea = new wijmo.barcode.LabelArea(symbolWidth, labelHeight, textAlign);
        const topSymbolArea = new wijmo.barcode.SymbolArea(symbolWidth, (height - separatorHeight) * ratio);
        const bottomSymbolArea = new wijmo.barcode.SymbolArea(symbolWidth, (height - separatorHeight) * (1 - ratio));
        
        if (!isLabelBottom) {
            mainArea.append(labelArea);
        }
        mainArea.append(topSymbolArea);

        const separatorAreas = [];
        data.separators.forEach(() => {
            const s = new wijmo.barcode.SymbolArea(symbolWidth, 1);
            separatorAreas.push(s);
            mainArea.append(s);
        });
        mainArea.append(bottomSymbolArea);
        if (isLabelBottom) {
            mainArea.append(labelArea);
        }

        if (!forMeasure) {
            labelArea.append({ text: label });
            topSymbolArea.fromPattern(data.topRow);
            bottomSymbolArea.fromPattern(data.bottomRow);
            separatorAreas.forEach((s, i) => {
                s.fromPattern(data.separators[i]);
            });
            this.shapes = mainArea.toShapes();
        }

        this.size = mainArea.getSize();
    }
}

    }
    


    module wijmo.barcode.composite {
    







export class ExpandedStacked extends Expanded {
    static DefaultConfig : any = {
        rowCount: 'auto',
    };

    static SegmentWidth = 17 * 2 + 15;
    static SegmentSize = 8 + 5 + 8;

    private _hasExtraPadding: any;
    protected rowCount: any;
    protected rowSegmentCount: any;

    constructor(option) {
        option.merge(ExpandedStacked.DefaultConfig);
        super(option);
        let { config: { rowCount } } = this;
        this.rowCount = rowCount;
        this._hasExtraPadding = false;
        this.linkageColumnCnt = 4;
    }

    _makeStacked(content) {
        const symbolCnt = this.symbolContentSize;
        if (!this._hasExtraPadding) {
            const segmentCount = ~~(content.length / ExpandedStacked.SegmentSize);
            let rowSegmentCount;

            if (this.rowCount === 'auto') {
                let rowCount = 2;
                if (rowCount > segmentCount) {
                    rowCount = segmentCount;
                }
                rowSegmentCount = Math.ceil(segmentCount / rowCount);
                this.rowCount = rowCount;
            } else {
                let rowCount = this.rowCount;
                rowSegmentCount = Math.ceil(segmentCount / rowCount);
            }
            
            if (this.rowCount > 11) {
                throw new wijmo.barcode.TextTooLongException();
            }
            const lastRowCharCount = symbolCnt % (2 * rowSegmentCount);
            
            this.rowSegmentCount = rowSegmentCount;
            if (lastRowCharCount === 1) {
                this._bitBuffer = new wijmo.barcode.BitBuffer();
                this._gpdEncodation = new GS1GeneralPurposeDataEncodation(this._bitBuffer, true);
                this._hasExtraPadding = true;
                return this.calculateData();
            }
        }

        const rowSegmentCount = this.rowSegmentCount;
        const lastRowFinderCount = Math.ceil((symbolCnt % (2 * rowSegmentCount)) / 2);
        const evenShouldReverse = wijmo.barcode.Utils.isEven(rowSegmentCount);
        const step = rowSegmentCount * ExpandedStacked.SegmentSize;
        const data = [];

        wijmo.barcode.Utils.sliceArray(content, step, (arr, i) => {
            const row = [...Expanded.Guard, ...arr, ...Expanded.Guard];
            let pattern;
            if (wijmo.barcode.Utils.isEven(i)) {
                pattern = wijmo.barcode.Utils.toZeroOnePattern(row);
            } else {
                if (evenShouldReverse) {
                    if (arr.length < step && wijmo.barcode.Utils.isOdd(lastRowFinderCount)) {
                        pattern = '0' + wijmo.barcode.Utils.toZeroOnePattern(row);
                    } else {
                        row.reverse();
                        pattern = wijmo.barcode.Utils.toZeroOnePattern(row, true);
                    }
                } else {
                    pattern = wijmo.barcode.Utils.toZeroOnePattern(row, true);
                }
            }
            data.push({ pattern , role: 'row'});
        });
        this.rowCount = data.length;

        const items = [];
        let i = 1;
        while(i < data.length) {
            const top = data[i - 1];
            const below = data[i];

            items.push(top);
            const seps = this._getSeparators(top.pattern, below.pattern, i - 1);

            items.push(...seps);
            i++;
        }
        items.push(data[i - 1]);
        return items;
    }
    _isVersion1Finder(prevFinderCnt, i) {
        const finderPattern = this.finderPatternSeq[~~((prevFinderCnt + 1 + i) / 2)];
        return ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'].indexOf(finderPattern) > -1;
    }
    _makeSepPattern(str, prevFinderCnt) {
        const finderCnt = Math.ceil((str.length - 4) / ExpandedStacked.SegmentWidth);
        str = str.substring(2, str.length - 2);
        let pattern = '', i = 0, pos = 0;
        while(i < finderCnt) {
            const segmentStart = pos;
            const segmentEnd = pos + ExpandedStacked.SegmentWidth;

            const isVerison1 = this._isVersion1Finder(prevFinderCnt, i);
            let complexStart = segmentStart + 17;
            if (!isVerison1) {
                complexStart += 2;
            }

            pattern += GS1DataBarBase.makeComplementPattern(str.substr(segmentStart, complexStart - segmentStart));
            pattern += GS1DataBarBase.makeComplexPattern(str.substr(complexStart, 13));
            pattern += GS1DataBarBase.makeComplementPattern(str.substr(complexStart + 13, segmentEnd - complexStart - 13));

            i++;
            pos = segmentEnd;
        }
        
        pattern = pattern.replace(/^(.){2}|(.){2}$/g, '0000');

        return pattern;
    }
    _getSeparators(topRow, bottomRow, index) {
        const topRowFinderCnt = (topRow.length - 4) / ExpandedStacked.SegmentWidth;
        const prevFinderCnt = index * topRowFinderCnt;

        const top = this._makeSepPattern(topRow, prevFinderCnt);
        const middle = '0000' + StackedBase.makeAlternatePattern(topRow.length - 8, true) + '0000';
        const bottom = this._makeSepPattern(bottomRow, prevFinderCnt);

        return [{ pattern: top },{ pattern: middle },{ pattern: bottom }];
    }

    calculateData() {
        const datas = this.makeDataWidth();
        return this._makeStacked(datas);
    }

    getLinkageOffset(data) {
        let offset = 1;
        while(data[offset] === '1') {
            offset++;
        }

        return {
            linkageOffset: offset,
            symbolOffset: 0,
        };
    }
    convertToShape(data, forMeasure) {
        if (!this.linkage) {
            this._convertToShape(data, forMeasure);
        } else {
            this._convertToShapeForLinkage(data, forMeasure);
        }
    }
    _convertToShapeForLinkage(data, forMeasure) {
        let { label, encodeConfig: { quietZone, isLabelBottom, height, showLabel, fontSizeInUnit }, rowCount, style: { textAlign, unitValue }, linkageText, config: { linkageVersion, linkageHeight }, linkageColumnCnt } = this;

        const linkageEncoder = linkageVersion === GS1DataBarBase.LinkageVersion.CCA ? new CCA(linkageText, linkageColumnCnt, unitValue, linkageHeight) : new CCB(linkageText, linkageColumnCnt, unitValue, linkageHeight);
        linkageEncoder.toSymbol();
        const linkageArea = linkageEncoder.getMainArea();
        const linkageSepPattern = this.getLinkageSepPattern(data[0].pattern);
        const linkageSize = linkageArea.getSize();

        const separatorHeight = 1, sepCount = rowCount - 1;
        const rowHeight = (height - 3 * sepCount - 1 - linkageSize.height) / rowCount;
        const symbolWidth = data[0].pattern.length;

        let labelHeight = 0;
        if (label && showLabel) {
            labelHeight = fontSizeInUnit;
        }
        const offset = this.getLinkageOffset(data[0].pattern);

        const mainArea = new wijmo.barcode.VerticalLayoutArea();
        const sepArea = new wijmo.barcode.SymbolArea(symbolWidth, 1);
        const labelArea = new wijmo.barcode.LabelArea(symbolWidth, labelHeight, textAlign);

        mainArea.setStyle({
            padding: {
                top: quietZone.top,
                right: quietZone.right,
                bottom: quietZone.bottom,
                left: quietZone.left,
            },
        });

        sepArea.setStyle({
            margin: {
                left: offset.symbolOffset,
            },
        });
        linkageArea.setStyle({
            margin: {
                left: offset.linkageOffset,
            },
        });
        if (!isLabelBottom) {
            mainArea.append(labelArea);
        }
        mainArea.append(linkageArea);
        mainArea.append(sepArea);
        const areas = [];
        data.forEach((d) => {
            const area = new wijmo.barcode.SymbolArea(symbolWidth, d.role === 'row' ? rowHeight : separatorHeight);
            mainArea.append(area);
            areas.push({ area, pattern: d.pattern});
        });

        if (isLabelBottom) {
            mainArea.append(labelArea);
        }

        if (!forMeasure) {
            sepArea.fromPattern(linkageSepPattern);
            labelArea.append({ text: label });
            areas.forEach((s) => {
                s.area.fromPattern(s.pattern);
            });
            this.shapes = mainArea.toShapes();
        }

        this.size = mainArea.getSize();
    }
    _convertToShape(data, forMeasure) {
        let { label, encodeConfig: { quietZone, isLabelBottom, height, showLabel, fontSizeInUnit }, rowCount, style: { textAlign } } = this;
        const separatorHeight = 1, sepCount = rowCount - 1;
        const rowHeight = (height - 3 * sepCount) / rowCount;
        const symbolWidth = data[0].pattern.length;

        let labelHeight = 0;
        if (label && showLabel) {
            labelHeight = fontSizeInUnit;
        }

        const mainArea = new wijmo.barcode.VerticalLayoutArea();
        mainArea.setStyle({
            padding: {
                top: quietZone.top,
                right: quietZone.right,
                bottom: quietZone.bottom,
                left: quietZone.left,
            },
        });

        const labelArea = new wijmo.barcode.LabelArea(symbolWidth, labelHeight, textAlign);

        if (!isLabelBottom) {
            mainArea.append(labelArea);
        }

        const areas = [];
        data.forEach((d) => {
            const area = new wijmo.barcode.SymbolArea(symbolWidth, d.role === 'row' ? rowHeight : separatorHeight);
            mainArea.append(area);
            areas.push({ area, pattern: d.pattern});
        });

        if (isLabelBottom) {
            mainArea.append(labelArea);
        }

        if (!forMeasure) {
            labelArea.append({ text: label });
            areas.forEach((s) => {
                s.area.fromPattern(s.pattern);
            });
            this.shapes = mainArea.toShapes();
        }

        this.size = mainArea.getSize();
    }
}
    }
    


    module wijmo.barcode.composite {
    


export class StackedOmnidirectional extends StackedBase {
    getSeparator(topRow, bottomRow) {
        const result = [];
        // top row
        let separator = '0000';
        separator += GS1DataBarBase.makeComplementPattern(topRow.substr(4, 14));
        separator += GS1DataBarBase.makeComplexPattern(topRow.substr(18, 13));
        separator += GS1DataBarBase.makeComplementPattern(topRow.substr(31, 15));
        separator += '0000';
        result.push(separator);

        // center row
        separator = '0000';
        separator += GS1DataBarBase.makeAlternatePattern(42, true);
        separator += '0000';
        result.push(separator);

        //bottom row
        separator = '0000';
        separator += GS1DataBarBase.makeComplementPattern(bottomRow.substr(4, 15));
        separator += GS1DataBarBase.makeComplexPattern(bottomRow.substr(19, 13));
        separator += GS1DataBarBase.makeComplementPattern(bottomRow.substr(32, 14));
        separator += '0000';
        result.push(separator);

        return result;
    }
}

    }
    


    module wijmo.barcode.composite {
    


export class Stacked extends StackedBase {
    static DefaultConfig: any = {
        height: 13,
    };
    constructor(option) {
        option.merge(Stacked.DefaultConfig);
        super(option);
    }

    getSeparator(topRow, bottomRow) {
        let separator = '';
        let last = 0;
        wijmo.barcode.Utils.loop((i) => {
            if (topRow[i] !== bottomRow[i]) {
                if (last === 1) {
                    separator += '0';
                    last = 0;
                } else {
                    separator += '1';
                    last = 1;
                }
            } else if (topRow[i] === '0') {
                separator += '1';
                last = 1;
            } else {
                separator += '0';
                last = 0;
            }
        }, { from: 4, to: topRow.length - 4 });
        return ['0000' + separator + '0000'];
    }
}

    }
    


    module wijmo.barcode.composite {
    

export class Omnidirectional extends GS1DataBarFirstType {
    getLinkageOffset(data, linkageWidth) {
        let linkageRightPos = data.length - 1;
        while(data[linkageRightPos] === '1') {
            linkageRightPos--;
        }
        return {
            linkageOffset: 0,
            symbolOffset: linkageWidth - linkageRightPos - 1,
        };
    }
}
    }
    


    module wijmo.barcode.composite {
    

export class Truncated extends Omnidirectional {
    static DefaultConfig : any = {
        height: 13,
        showLabel: false,
    };

    constructor(option) {
        option.merge(Truncated.DefaultConfig);
        super(option);
    }
}
    }
    


    module wijmo.barcode.composite {
    








wijmo.barcode.Barcode.registerEncoder('GS1 DataBar Omnidirectional', Omnidirectional);
wijmo.barcode.Barcode.registerEncoder('GS1 DataBar Truncated', Truncated);
wijmo.barcode.Barcode.registerEncoder('GS1 DataBar Stacked', Stacked);
wijmo.barcode.Barcode.registerEncoder('GS1 DataBar StackedOmnidirectional', StackedOmnidirectional);
wijmo.barcode.Barcode.registerEncoder('GS1 DataBar Limited', Limited);
wijmo.barcode.Barcode.registerEncoder('GS1 DataBar Expanded', Expanded);
wijmo.barcode.Barcode.registerEncoder('GS1 DataBar Expanded Stacked', ExpandedStacked);
    }
    


    module wijmo.barcode.composite {
    /**
 * Defines the composite barcode component symbology that can be used in linkage.
 */
export enum Gs1DataBarLinkageVersion{
    /** CCA components have two ,three ,or four data columns, and range in size from three to twelve rows high.*/
    Cca,
    /** CCB is multi-row symbology component which can encode up to 338 digits. 
     * CCB components have two, three, or four data columns, and range in size from 4 to 44 rows high. 
    */
    Ccb
}

/** Defines symbology of MicroPDF encoding method*/
export enum MicroPdfCompactionMode{
    /** */
    Auto,
    /** Include all printable ASCII characters and three ASCII control characters. */
    Text,
    /** 8-bit bytes*/
    Numeric,
    /** Long strings of consecutive numeric digits*/
    Byte
}

/** Defines the symbol row and column count*/
export enum MicroPdfDimensions{
    ColumnPriority, 
    RowPriority, 
    Dim1x11 ,
    Dim1x14 , 
    Dim1x17 , 
    Dim1x20 , 
    Dim1x24 , 
    Dim1x28 , 
    Dim2x8 , 
    Dim2x11 , 
    Dim2x14 , 
    Dim2x17 , 
    Dim2x20 , 
    Dim2x23 , 
    Dim2x26 , 
    Dim3x6 , 
    Dim3x8 , 
    Dim3x10 , 
    Dim3x12 , 
    Dim3x15 , 
    Dim3x20 , 
    Dim3x26 , 
    Dim3x32 , 
    Dim3x38 , 
    Dim3x44 , 
    Dim4x4 ,
    Dim4x6 , 
    Dim4x8 , 
    Dim4x10 , 
    Dim4x12 , 
    Dim4x15 , 
    Dim4x20 , 
    Dim4x26 , 
    Dim4x32 , 
    Dim4x38 , 
    Dim4x44
}


    }
    


    module wijmo.barcode.composite {
    


export class _LinkageVersionConvertor{
    static stringToEnum(value): number{
        switch (value) {
            case 'CCA':
                return Gs1DataBarLinkageVersion.Cca;
            case 'CCB':
                return Gs1DataBarLinkageVersion.Ccb;
        }
        throw `Unknown Barcode internal linkageVersion '${value}'`;
    };

    static enumToString(value): string{
        return Gs1DataBarLinkageVersion[wijmo.asEnum(value, Gs1DataBarLinkageVersion)].toUpperCase();
    }
}

export class _CompactionModeConvertor{
    static stringToEnum(value): number{
        switch (value) {
            case 'auto':
                return MicroPdfCompactionMode.Auto;
            case 'text':
                return MicroPdfCompactionMode.Text;
            case 'numeric':
                return MicroPdfCompactionMode.Numeric;
            case 'byte':
                return MicroPdfCompactionMode.Byte;
        }
        throw `Unknown Barcode internal compactionMode '${value}'`;
    };

    static enumToString(value): string{
        return MicroPdfCompactionMode[wijmo.asEnum(value, MicroPdfCompactionMode)].toLowerCase();
    }
}

export function _MicroPdfDimensionsConvertor(enumStr: string): string{
    const dimPrefix = "Dim";
    switch(enumStr){
        case 'ColumnPriority':
            return 'columnPriorAuto';
        case 'RowPriority':
            return 'rowPriorAuto';
        default:
            return enumStr.substr(dimPrefix.length).replace('x', '*');
    }
}


    }
    


    module wijmo.barcode.composite {
    








/**
 * Base abstract class for all GS1 DataBar control classes.
 */
export abstract class Gs1DataBarBase extends wijmo.barcode.BarcodeBase {
    /**
     * Abstract class constructor; never called.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-gs1databar');
    }

    // Set showLabel to true by default. 
    protected static _getClassDefaults() {
        let ret = super._getClassDefaults();
        ret['showLabel'] = true;
        return ret;
    }

    /**
     * Indicates whether the value is rendered under the symbol.
     * 
     * The default value for this property is <b>true</b>.
     */
    get showLabel(): boolean {
        return this._getProp('showLabel');
    }
    set showLabel(value: boolean ){
        this._setProp('showLabel', value);
    }

    /**
     * Gets or sets where to render the value of the control.
     * 
     * The default value for this property is {@link LabelPosition.Bottom}.
     */
    get labelPosition(): wijmo.barcode.LabelPosition {
        return wijmo.barcode._LabelPositionConvertor.stringToEnum(this._getProp('labelPosition'));
    }
    set labelPosition(value: wijmo.barcode.LabelPosition ){
        this._setProp('labelPosition', wijmo.barcode._LabelPositionConvertor.enumToString(value));
    }

    /**
     * Gets or sets a 2D Composite Component and its separator pattern are printed 
     * above the GS1 DataBar symbol with the separator pattern aligned 
     * and contiguous to the GS1 DataBar symbol. 
     */
    get linkage(): string {
        return this._getProp('linkage');
    }
    set linkage(value: string ){
        this._setProp('linkage', value);
    }

    /**
     * Gets or sets the composite barcode component that can be used in linkage.
     * 
     * The default value for this property is {@link Gs1DataBarLinkageVersion.Cca}.
     */
    get linkageVersion(): Gs1DataBarLinkageVersion {
        return _LinkageVersionConvertor.stringToEnum(this._getProp('linkageVersion'));
    }
    set linkageVersion(value: Gs1DataBarLinkageVersion ){
        this._setProp('linkageVersion', _LinkageVersionConvertor.enumToString(value));
    }

    /**Gets or sets the linkage symbol height. */
    get linkageHeight(): string | number {
        return this._getProp('linkageHeight');
    }
    set linkageHeight(value: string | number ){
        this._setProp('linkageHeight', value);
    }

    /**
     * Indicates whether to show the linkage in the label text.
     * 
     * The default value for this property is <b>false</b>.
     */
    get hideLinkageText(): boolean {
        return this._getProp('hideLinkageText');
    }
    set hideLinkageText(value: boolean ){
        this._setProp('hideLinkageText', value);
    }

    /**
     * Indicates whether to show the Application Identifier in the label text.
     * 
     * The default value for this property is <b>false</b>.
     */
    get hideAiText(): boolean {
        return this._getProp('hideAIText');
    }
    set hideAiText(value: boolean ){
        this._setProp('hideAIText', value);
    }

}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a> 
 * barcode type.
 */
export class Gs1DataBarOmnidirectional extends Gs1DataBarBase {
    static readonly type: string = 'GS1 DataBar Omnidirectional';

    /**
     * Initializes a new instance of the {@link Gs1DataBarOmnidirectional} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-gs1databar-omnidirectional');
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a> 
 * barcode type.
 */
export class Gs1DataBarTruncated extends Gs1DataBarBase {
    static readonly type: string = 'GS1 DataBar Truncated';

    /**
     * Initializes a new instance of the {@link Gs1DataBarTruncated} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-gs1databar-truncated');
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a> 
 * barcode type.
 */
export class Gs1DataBarStacked extends Gs1DataBarBase {
    static readonly type: string = 'GS1 DataBar Stacked';

    /**
     * Initializes a new instance of the {@link Gs1DataBarStacked} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-gs1databar-stacked');
    }

    /**
     * Gets or sets the height of symbol top row ratio; supports any number.
     * 
     * The default value for this property is <b>0.4</b>.
     */
    get ratio(): number {
        return this._getProp('ratio');
    }
    set ratio(value: number ){
        this._setProp('ratio', value);
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a> 
 * barcode type.
 */
export class Gs1DataBarStackedOmnidirectional extends Gs1DataBarBase {
    static readonly type: string = 'GS1 DataBar StackedOmnidirectional';

    /**
     * Initializes a new instance of the {@link Gs1DataBarStackedOmnidirectional} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-gs1databar-stacked-omnidirectional');
    }

    /**
     * Gets or sets the height of symbol top row ratio; supports any number.
     * 
     * The default value for this property is <b>0.4</b>.
     */
    get ratio(): number {
        return this._getProp('ratio');
    }
    set ratio(value: number ){
        this._setProp('ratio', value);
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a> 
 * barcode type.
 */
export class Gs1DataBarLimited extends Gs1DataBarBase {
    static readonly type: string = 'GS1 DataBar Limited';

    /**
     * Initializes a new instance of the {@link Gs1DataBarLimited} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-gs1databar-limited');
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a> 
 * barcode type.
 * 
 * This is a variable width barcode, the width of which automatically changes 
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export class Gs1DataBarExpanded extends Gs1DataBarBase implements wijmo.barcode.IVariableWidthBarcode {
    static readonly type: string = 'GS1 DataBar Expanded';

    /**
     * Initializes a new instance of the {@link Gs1DataBarExpanded} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element);
        wijmo.addClass(this.hostElement, 'wj-barcode-gs1databar-expanded');
        this._setAw(true);
        this.initialize(option);
    }

    /**
     * Gets or sets a value indicating whether the control width should automatically
     * change along with the {@link value} length.
     * 
     * If you set this property value to false, you should ensure that the control has some
     * reasonable *CSS width*.
     * 
     * The default value for this property is **true**.
     */
    get autoWidth(): boolean {
        return this._getAw();
    }
    set autoWidth(value: boolean) {
        this._setAw(value);
    }

    /**
     * Gets or sets a zoom factor applied to the automatically calculated control width.
     * 
     * This property makes effect only if the {@link autoWidth} property is set to true.
     * It can take any numeric value equal or greater than 1.
     * 
     * The default value for this property is **1**.
     */
    get autoWidthZoom(): number {
        return this._getWzoom();
    }
    set autoWidthZoom(value: number) {
        this._setWzoom(value);
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1_DataBar" target="_blank">GS1 DataBar</a> 
 * barcode type.
 * 
 * This is a variable-width barcode, the width of which automatically changes 
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export class Gs1DataBarExpandedStacked extends Gs1DataBarBase implements wijmo.barcode.IVariableWidthBarcode {
    static readonly type: string = 'GS1 DataBar Expanded Stacked';

    /**
     * Initializes a new instance of the {@link Gs1DataBarExpandedStacked} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element);
        wijmo.addClass(this.hostElement, 'wj-barcode-gs1databar-expanded-stacked');
        this._setAw(true);
        this.initialize(option);
    }

    /**
     * Gets or sets a value indicating whether the control width should automatically
     * change along with the {@link value} length.
     * 
     * If you set this property value to false, you should ensure that the control has some
     * reasonable *CSS width*.
     * 
     * The default value for this property is **true**.
     */
    get autoWidth(): boolean {
        return this._getAw();
    }
    set autoWidth(value: boolean) {
        this._setAw(value);
    }

    /**
     * Gets or sets a zoom factor applied to the automatically calculated control width.
     * 
     * This property makes effect only if the {@link autoWidth} property is set to true.
     * It can take any numeric value equal or greater than 1.
     * 
     * The default value for this property is **1**.
     */
    get autoWidthZoom(): number {
        return this._getWzoom();
    }
    set autoWidthZoom(value: number) {
        this._setWzoom(value);
    }

    /**
     * Gets or sets how many row count of the RSS Expanded will be stacked in.
     * 
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    get rowCount(): number {
        let ret = this._getProp('rowCount');
        return ret === 'auto' ? null : ret;
    }
    set rowCount(value: number ){
        this._setProp('rowCount', value == null ? 'auto' : value);
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/PDF417" target="_blank">PDF417</a> 
 * barcode type.
 * 
 * This is a variable-width barcode, the width of which automatically changes 
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export class Pdf417 extends wijmo.barcode.BarcodeBase implements wijmo.barcode.IVariableWidthBarcode {
    static readonly type: string = 'PDF417';

    /**
     * Initializes a new instance of the {@link Pdf417} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element);
        wijmo.addClass(this.hostElement, 'wj-barcode-pdf417');
        this._setAw(true);
        this.initialize(option);
    }

    /**
     * Gets or sets a value indicating whether the control width should automatically
     * change along with the {@link value} length.
     * 
     * If you set this property value to false, you should ensure that the control has some
     * reasonable *CSS width*.
     * 
     * The default value for this property is **true**.
     */
    get autoWidth(): boolean {
        return this._getAw();
    }
    set autoWidth(value: boolean) {
        this._setAw(value);
    }

    /**
     * Gets or sets a zoom factor applied to the automatically calculated control width.
     * 
     * This property makes effect only if the {@link autoWidth} property is set to true.
     * It can take any numeric value equal or greater than 1.
     * 
     * The default value for this property is **1**.
     */
    get autoWidthZoom(): number {
        return this._getWzoom();
    }
    set autoWidthZoom(value: number) {
        this._setWzoom(value);
    }

    /**
     * Gets or sets the error correction level of this control.
     * PDF417 symbology supports 9 levels of error correction, 
     * with 0 being the least thorough and 8 being the most thorough. 
     * When the correction level is set to 0, very little redundant information is encoded and the scanner 
     * can perform little more than correct for the very simplest of errors. 
     * When set to 8, significant scanning problems can be corrected.
     * The default error correction for PDF417 is "auto." This automatically specifies a 
     * correction level based on the amount of information encoded into each PDF417 symbol.
     * 
     * The possible property values are null | undefined | 0 - 8.
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    get errorCorrectionLevel(): number {
        let ret = this._getProp('errorCorrectionLevel');
        return ret === 'auto' ? null : ret;
    }
    set errorCorrectionLevel(value: number ){
        this._setProp('errorCorrectionLevel', value == null ? 'auto' : value);
    }


    /**
     * Gets or sets the number of columns in the symbol.
     * 
     * The possible property values are null | undefined | 0 - 30.
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    get columns(): number {
        let ret = this._getProp('columns');
        return ret === 'auto' ? null : ret;
    }
    set columns(value: number ){
        this._setProp('columns', value == null ? 'auto' : value);
    }

    /**
     * Gets or sets the number of rows in the symbol.
     * 
     * The possible property values are null | undefined | 3 - 90.
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    get rows(): number {
        let ret = this._getProp('rows');
        return ret === 'auto' ? null : ret;
    }
    set rows(value: number ){
        this._setProp('rows', value == null ? 'auto' : value);
    }

    /**
     * Indicates whether it is a compact PDF417 symbol.
     * 
     * The default value for this property is <b>false</b>.
     */
    get compact(): boolean {
        return this._getProp('compact');
    }
    set compact(value: boolean ){
        this._setProp('compact', value);
    }
}

/**
 * Represents a control for drawing <a href="https://www.iso.org/standard/38838.html" target="_blank">MicroPDF417</a> 
 * barcode type.
 */
export class MicroPdf417 extends wijmo.barcode.BarcodeBase {
    static readonly type: string = 'MicroPDF417';
    private static _dimensionsDictionary: wijmo.barcode._EnumDictionary;

    /**
     * Initializes a new instance of the {@link MicroPdf417} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        MicroPdf417._getEnumDictionary();
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-micropdf417');
    }

    private static _getEnumDictionary(){
        if(!MicroPdf417._dimensionsDictionary){
            MicroPdf417._dimensionsDictionary = new wijmo.barcode._EnumDictionary(MicroPdfDimensions, _MicroPdfDimensionsConvertor);
        }
    }

    /**
     * Gets or sets the symbol row and column count.
     * 
     * The default value for this property is {@link MicroPdfDimensions.ColumnPriority}.
     */
    get dimensions(): MicroPdfDimensions {
        return MicroPdf417._dimensionsDictionary.getEnumByString(this._getProp('symbolVersion'));
    }
    set dimensions(value: MicroPdfDimensions ){
        this._setProp('symbolVersion', MicroPdf417._dimensionsDictionary.getStringByEnum(value));
    }

    /**
     * Gets or sets the symbol encode method.
     * 
     * The default value for this property is {@link MicroPdfCompactionMode.Auto}.
     */
    get compactionMode(): MicroPdfCompactionMode {
        return _CompactionModeConvertor.stringToEnum(this._getProp('compactionMode'));
    }
    set compactionMode(value: MicroPdfCompactionMode ){
        this._setProp('compactionMode', _CompactionModeConvertor.enumToString(value));
    }

    /**
     * Indicates whether the structure append is enabled.
     * 
     * The default value for this property is <b>false</b>.
     */
    get structuredAppend(): boolean {
        return this._getProp('structuredAppend');
    }
    set structuredAppend(value: boolean ){
        this._setProp('structuredAppend', value);
    }

    /**
     * Gets or sets the structure append index.
     * 
     * The default value for this property is <b>0</b>.
     */
    get segmentIndex(): number {
        return this._getProp('segmentIndex');
    }
    set segmentIndex(value: number ){
        this._setProp('segmentIndex', value);
    }

    /**
     * Gets or sets the structure file ID.
     * 
     * The default value for this property is <b>0</b>.
     */
    get fileId(): number {
        return this._getProp('fileID');
    }
    set fileId(value: number ){
        this._setProp('fileID', value);
    }

    /**
     * Gets or sets structured append optional fields. Only supports segmentCount for now.
     */
    get optionalFields(): IOptionalFields {
        return this._getProp('optionalFields');
    }
    set optionalFields(value: IOptionalFields ){
        this._setProp('optionalFields', value);
    }
}
    }
    


    module wijmo.barcode.composite {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.barcode.composite', wijmo.barcode.composite);





    }
    