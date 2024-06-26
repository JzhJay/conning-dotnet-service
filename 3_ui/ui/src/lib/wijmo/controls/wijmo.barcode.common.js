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
        var common;
        (function (common) {
            var EXP_TABLE = new Array(256);
            for (var i = 0; i < 8; i++) {
                EXP_TABLE[i] = 1 << i;
            }
            for (var i = 8; i < 256; i++) {
                EXP_TABLE[i] = EXP_TABLE[i - 4] ^
                    EXP_TABLE[i - 5] ^
                    EXP_TABLE[i - 6] ^
                    EXP_TABLE[i - 8];
            }
            var LOG_TABLE = new Array(256);
            for (var i = 0; i < 255; i += 1) {
                LOG_TABLE[EXP_TABLE[i]] = i;
            }
            var RS_COEFFICIENTS = [
                null, null, null, null, null, null, null,
                //  7
                [0, 87, 229, 146, 149, 238, 102, 21], null, null,
                // 10
                [0, 251, 67, 46, 61, 118, 70, 64, 94, 32, 45], null, null,
                // 13
                [0, 74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78], null,
                // 15
                [0, 8, 183, 61, 91, 202, 37, 51, 58, 58, 237, 140, 124, 5, 99, 105],
                // 16
                [0, 120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120],
                // 17
                [0, 43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136],
                // 18
                [0, 215, 234, 158, 94, 184, 97, 118, 170, 79, 187, 152, 148, 252, 179, 5, 98, 96, 153], null,
                // 20
                [0, 17, 60, 79, 50, 61, 163, 26, 187, 202, 180, 221, 225, 83, 239, 156, 164, 212, 212, 188, 190], null,
                // 22
                [0, 210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231], null,
                // 24
                [0, 229, 121, 135, 48, 211, 117, 251, 126, 159, 180, 169, 152, 192, 226, 228, 218, 111, 0, 117, 232, 87, 96, 227, 21], null,
                // 26
                [0, 173, 125, 158, 2, 103, 182, 118, 17, 145, 201, 111, 28, 165, 53, 161, 21, 245, 142, 13, 102, 48, 227, 153, 145, 218, 70], null,
                // 28
                [0, 168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195, 212, 119, 242, 37, 9, 123], null,
                // 30
                [0, 41, 173, 145, 152, 216, 31, 179, 182, 50, 48, 110, 86, 239, 96, 222, 125, 42, 173, 226, 193, 224, 130, 156, 37, 251, 216, 238, 40, 192, 180], null,
                // 32
                [0, 10, 6, 106, 190, 249, 167, 4, 67, 209, 138, 138, 32, 242, 123, 89, 27, 120, 185, 80, 156, 38, 69, 171, 60, 28, 222, 80, 52, 254, 185, 220, 241], null,
                // 34
                [0, 111, 77, 146, 94, 26, 21, 108, 19, 105, 94, 113, 193, 86, 140, 163, 125, 58, 158, 229, 239, 218, 103, 56, 70, 114, 61, 183, 129, 167, 13, 98, 62, 129, 51], null,
                // 36
                [0, 200, 183, 98, 16, 172, 31, 246, 234, 60, 152, 115, 0, 167, 152, 113, 248, 238, 107, 18, 63, 218, 37, 87, 210, 105, 177, 120, 74, 121, 196, 117, 251, 113, 233, 30, 120], null, null, null,
                // 40
                [0, 59, 116, 79, 161, 252, 98, 128, 205, 128, 161, 247, 57, 163, 56, 235, 106, 53, 26, 187, 174, 226, 104, 170, 7, 175, 35, 181, 114, 88, 41, 47, 163, 125, 134, 72, 20, 232, 53, 35, 15], null,
                // 42
                [0, 250, 103, 221, 230, 25, 18, 137, 231, 0, 3, 58, 242, 221, 191, 110, 84, 230, 8, 188, 106, 96, 147, 15, 131, 139, 34, 101, 223, 39, 101, 213, 199, 237, 254, 201, 123, 171, 162, 194, 117, 50, 96], null,
                // 44
                [0, 190, 7, 61, 121, 71, 246, 69, 55, 168, 188, 89, 243, 191, 25, 72, 123, 9, 145, 14, 247, 1, 238, 44, 78, 143, 62, 224, 126, 118, 114, 68, 163, 52, 194, 217, 147, 204, 169, 37, 130, 113, 102, 73, 181], null,
                // 46
                [0, 112, 94, 88, 112, 253, 224, 202, 115, 187, 99, 89, 5, 54, 113, 129, 44, 58, 16, 135, 216, 169, 211, 36, 1, 4, 96, 60, 241, 73, 104, 234, 8, 249, 245, 119, 174, 52, 25, 157, 224, 43, 202, 223, 19, 82, 15], null,
                // 48
                [0, 228, 25, 196, 130, 211, 146, 60, 24, 251, 90, 39, 102, 240, 61, 178, 63, 46, 123, 115, 18, 221, 111, 135, 160, 182, 205, 107, 206, 95, 150, 120, 184, 91, 21, 247, 156, 140, 238, 191, 11, 94, 227, 84, 50, 163, 39, 34, 108,], null,
                // 50
                [0, 232, 125, 157, 161, 164, 9, 118, 46, 209, 99, 203, 193, 35, 3, 209, 111, 195, 242, 203, 225, 46, 13, 32, 160, 126, 209, 130, 160, 242, 215, 242, 75, 77, 42, 189, 32, 113, 65, 124, 69, 228, 114, 235, 175, 124, 170, 215, 232, 133, 205], null,
                // 52
                [0, 116, 50, 86, 186, 50, 220, 251, 89, 192, 46, 86, 127, 124, 19, 184, 233, 151, 215, 22, 14, 59, 145, 37, 242, 203, 134, 254, 89, 190, 94, 59, 65, 124, 113, 100, 233, 235, 121, 22, 76, 86, 97, 39, 242, 200, 220, 101, 33, 239, 254, 116, 51], null,
                // 54
                [0, 183, 26, 201, 87, 210, 221, 113, 21, 46, 65, 45, 50, 238, 184, 249, 225, 102, 58, 209, 218, 109, 165, 26, 95, 184, 192, 52, 245, 35, 254, 238, 175, 172, 79, 123, 25, 122, 43, 120, 108, 215, 80, 128, 201, 235, 8, 153, 59, 101, 31, 198, 76, 31, 156], null,
                // 56
                [0, 106, 120, 107, 157, 164, 216, 112, 116, 2, 91, 248, 163, 36, 201, 202, 229, 6, 144, 254, 155, 135, 208, 170, 209, 12, 139, 127, 142, 182, 249, 177, 174, 190, 28, 10, 85, 239, 184, 101, 124, 152, 206, 96, 23, 163, 61, 27, 196, 247, 151, 154, 202, 207, 20, 61, 10], null,
                // 58
                [0, 82, 116, 26, 247, 66, 27, 62, 107, 252, 182, 200, 185, 235, 55, 251, 242, 210, 144, 154, 237, 176, 141, 192, 248, 152, 249, 206, 85, 253, 142, 65, 165, 125, 23, 24, 30, 122, 240, 214, 6, 129, 218, 29, 145, 127, 134, 206, 245, 117, 29, 41, 63, 159, 142, 233, 125, 148, 123], null,
                // 60
                [0, 107, 140, 26, 12, 9, 141, 243, 197, 226, 197, 219, 45, 211, 101, 219, 120, 28, 181, 127, 6, 100, 247, 2, 205, 198, 57, 115, 219, 101, 109, 160, 82, 37, 38, 238, 49, 160, 209, 121, 86, 11, 124, 30, 181, 84, 25, 194, 87, 65, 102, 190, 220, 70, 27, 209, 16, 89, 7, 33, 240], null,
                // 62
                [0, 65, 202, 113, 98, 71, 223, 248, 118, 214, 94, 1, 122, 37, 23, 2, 228, 58, 121, 7, 105, 135, 78, 243, 118, 70, 76, 223, 89, 72, 50, 70, 111, 194, 17, 212, 126, 181, 35, 221, 117, 235, 11, 229, 149, 147, 123, 213, 40, 115, 6, 200, 100, 26, 246, 182, 218, 127, 215, 36, 186, 110, 106], null,
                // 64
                [0, 45, 51, 175, 9, 7, 158, 159, 49, 68, 119, 92, 123, 177, 204, 187, 254, 200, 78, 141, 149, 119, 26, 127, 53, 160, 93, 199, 212, 29, 24, 145, 156, 208, 150, 218, 209, 4, 216, 91, 47, 184, 146, 47, 140, 195, 195, 125, 242, 238, 63, 99, 108, 140, 230, 242, 31, 204, 11, 178, 243, 217, 156, 213, 231], null,
                // 66
                [0, 5, 118, 222, 180, 136, 136, 162, 51, 46, 117, 13, 215, 81, 17, 139, 247, 197, 171, 95, 173, 65, 137, 178, 68, 111, 95, 101, 41, 72, 214, 169, 197, 95, 7, 44, 154, 77, 111, 236, 40, 121, 143, 63, 87, 80, 253, 240, 126, 217, 77, 34, 232, 106, 50, 168, 82, 76, 146, 67, 106, 171, 25, 132, 93, 45, 105], null,
                // 68
                [0, 247, 159, 223, 33, 224, 93, 77, 70, 90, 160, 32, 254, 43, 150, 84, 101, 190, 205, 133, 52, 60, 202, 165, 220, 203, 151, 93, 84, 15, 84, 253, 173, 160, 89, 227, 52, 199, 97, 95, 231, 52, 177, 41, 125, 137, 241, 166, 225, 118, 2, 54, 32, 82, 215, 175, 198, 43, 238, 235, 27, 101, 184, 127, 3, 5, 8, 163, 238], null
            ];
            function generateErrorCorrectionCode(codewords, ecCount, dataCount) {
                var kd = [];
                var coefficients = RS_COEFFICIENTS[ecCount];
                var copy = codewords.slice(0);
                for (var i = 0; i < dataCount; i++) {
                    if (copy[0] != 0) {
                        var exp = LOG_TABLE[copy[0]];
                        for (var i_1 = 0; i_1 <= coefficients.length - 1; i_1++) {
                            var kk = coefficients[i_1] + exp;
                            while (kk >= 255)
                                kk -= 255;
                            kd[i_1] = EXP_TABLE[kk];
                        }
                        for (var i_2 = 0; i_2 <= coefficients.length - 1; i_2++) {
                            copy[i_2] = copy[i_2] ^ kd[i_2];
                        }
                    }
                    for (var i_3 = 1; i_3 < copy.length; i_3++) {
                        copy[i_3 - 1] = copy[i_3];
                    }
                    copy[copy.length - 1] = 0;
                }
                return copy.slice(0, ecCount);
            }
            common.generateErrorCorrectionCode = generateErrorCorrectionCode;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
            var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
            var MODEL2_G15_MASK = 21522;
            var MODEL1_G15_MASK = 10277;
            function getBCHDigit(data) {
                var digit = 0;
                while (data != 0) {
                    digit += 1;
                    data >>>= 1;
                }
                return digit;
            }
            function getBCH15(data, model) {
                var G15_MASK = model === 2 ? MODEL2_G15_MASK : MODEL1_G15_MASK;
                var d = data << 10;
                while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
                    d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15)));
                }
                return ((data << 10) | d) ^ G15_MASK;
            }
            common.getBCH15 = getBCH15;
            function getBCH18(data) {
                var d = data << 12;
                while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
                    d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18)));
                }
                return (data << 12) | d;
            }
            common.getBCH18 = getBCH18;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            common.MODE_INDICATOR = {
                ECI: 7,
                Numeric: 1,
                Alphanumeric: 2,
                '8BitByte': 4,
                Kanji: 8,
                StructuredAppend: 3,
                FNC1First: 5,
                FNC2Second: 9,
                Terminator: 0
            };
            common.EC_INDICATOR = {
                L: 1,
                M: 0,
                Q: 3,
                H: 2
            };
            function isNumericMode(cc) {
                return cc >= 0x30 && cc <= 0x39;
            }
            function isAlphanumericMode(cc) {
                var symbols = ' $%*+-./:';
                if (symbols.indexOf(String.fromCharCode(cc)) != -1) {
                    return true;
                }
                return (cc >= 0x30 && cc <= 0x39) || (cc >= 0x41 && cc <= 0x5a);
            }
            function is8BitByteMode(cc) {
                return cc >= 0x00 && cc <= 0xff;
            }
            function isKanjiMode(cc) {
                return cc >= 0x813f && cc <= 0xfc4b;
            }
            var checkFns = {
                Numeric: isNumericMode,
                Alphanumeric: isAlphanumericMode,
                '8BitByte': is8BitByteMode,
                Kanji: isKanjiMode
            };
            function isMode(mode, charcode) {
                var checkFn = checkFns[mode];
                if (charcode.length === 1) {
                    return checkFn(charcode);
                }
                return charcode.every(function (c) {
                    return checkFn(c);
                });
            }
            common.isMode = isMode;
            function getCharMode(code, charset) {
                if (charset === void 0) { charset = 'UTF-8'; }
                if (isNumericMode(code)) {
                    return 'Numeric';
                }
                if (isAlphanumericMode(code)) {
                    return 'Alphanumeric';
                }
                if (charset === 'Shift_JIS' && isKanjiMode(code)) {
                    return 'Kanji';
                }
                return '8BitByte';
            }
            common.getCharMode = getCharMode;
            common.getSizeByVersion = function (version) {
                return version * 4 + 17;
            };
            function getCharacterCountIndicatorbitsNumber(version) {
                if (version >= 1 && version <= 9) {
                    return {
                        Numeric: 10,
                        Alphanumeric: 9,
                        '8BitByte': 8,
                        Kanji: 8
                    };
                }
                else if (version >= 10 && version <= 26) {
                    return {
                        Numeric: 12,
                        Alphanumeric: 11,
                        '8BitByte': 16,
                        Kanji: 10
                    };
                }
                else {
                    return {
                        Numeric: 14,
                        Alphanumeric: 13,
                        '8BitByte': 16,
                        Kanji: 12
                    };
                }
            }
            common.getCharacterCountIndicatorbitsNumber = getCharacterCountIndicatorbitsNumber;
            var SYMBOL_MAP = {
                ' ': 36,
                '$': 37,
                '%': 38,
                '*': 39,
                '+': 40,
                '-': 41,
                '.': 42,
                '/': 43,
                ':': 44
            };
            function getAlphanumericCharValue(cc) {
                if (cc >= 0x30 && cc <= 0x39) {
                    return +String.fromCharCode(cc);
                }
                if (cc >= 0x41 && cc <= 0x5a) {
                    return cc - 0x41 + 10;
                }
                var result = SYMBOL_MAP[String.fromCharCode(cc)];
                if (!result) {
                    throw new wijmo.barcode.InvalidTextException(String.fromCharCode(cc));
                }
                else {
                    return result;
                }
            }
            common.getAlphanumericCharValue = getAlphanumericCharValue;
            function createModules(size) {
                var arr = [];
                for (var i = 0; i < size; i++) {
                    arr.push(wijmo.barcode.Utils.fillArray(new Array(size), null));
                }
                return arr;
            }
            common.createModules = createModules;
            var alignmentPatterns = [
                [],
                [6, 18],
                [6, 22],
                [6, 26],
                [6, 30],
                [6, 34],
                [6, 22, 38],
                [6, 24, 42],
                [6, 26, 46],
                [6, 28, 50],
                [6, 30, 54],
                [6, 32, 58],
                [6, 34, 62],
                [6, 26, 46, 66],
                [6, 26, 48, 70],
                [6, 26, 50, 74],
                [6, 30, 54, 78],
                [6, 30, 56, 82],
                [6, 30, 58, 86],
                [6, 34, 62, 90],
                [6, 28, 50, 72, 94],
                [6, 26, 50, 74, 98],
                [6, 30, 54, 78, 102],
                [6, 28, 54, 80, 106],
                [6, 32, 58, 84, 110],
                [6, 30, 58, 86, 114],
                [6, 34, 62, 90, 118],
                [6, 26, 50, 74, 98, 122],
                [6, 30, 54, 78, 102, 126],
                [6, 26, 52, 78, 104, 130],
                [6, 30, 56, 82, 108, 134],
                [6, 34, 60, 86, 112, 138],
                [6, 30, 58, 86, 114, 142],
                [6, 34, 62, 90, 118, 146],
                [6, 30, 54, 78, 102, 126, 150],
                [6, 24, 50, 76, 102, 128, 154],
                [6, 28, 54, 80, 106, 132, 158],
                [6, 32, 58, 84, 110, 136, 162],
                [6, 26, 54, 82, 110, 138, 166],
                [6, 30, 58, 86, 114, 142, 170]
            ];
            function getAlignmentPattersPos(version) {
                return alignmentPatterns[version - 1];
            }
            common.getAlignmentPattersPos = getAlignmentPattersPos;
            common.padCodewords0 = 0xEC;
            common.padCodewords1 = 0x11;
            common.maskFuncs = [
                function (i, j) { return (i + j) % 2 === 0; },
                function (i) { return i % 2 === 0; },
                function (i, j) { return j % 3 === 0; },
                function (i, j) { return (i + j) % 3 === 0; },
                function (i, j) { return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0; },
                function (i, j) { return (i * j) % 2 + (i * j) % 3 === 0; },
                function (i, j) { return ((i * j) % 2 + (i * j) % 3) % 2 === 0; },
                function (i, j) { return ((i * j) % 3 + (i + j) % 2) % 2 === 0; }
            ];
            var MODEL2_1ERROR_CORRECTION_CHARACTERISTICS = [
                [1, 26, 19],
                [1, 26, 16],
                [1, 26, 13],
                [1, 26, 9],
                // 2
                [1, 44, 34],
                [1, 44, 28],
                [1, 44, 22],
                [1, 44, 16],
                // 3
                [1, 70, 55],
                [1, 70, 44],
                [2, 35, 17],
                [2, 35, 13],
                // 4
                [1, 100, 80],
                [2, 50, 32],
                [2, 50, 24],
                [4, 25, 9],
                // 5
                [1, 134, 108],
                [2, 67, 43],
                [2, 33, 15, 2, 34, 16],
                [2, 33, 11, 2, 34, 12],
                // 6
                [2, 86, 68],
                [4, 43, 27],
                [4, 43, 19],
                [4, 43, 15],
                // 7
                [2, 98, 78],
                [4, 49, 31],
                [2, 32, 14, 4, 33, 15],
                [4, 39, 13, 1, 40, 14],
                // 8
                [2, 121, 97],
                [2, 60, 38, 2, 61, 39],
                [4, 40, 18, 2, 41, 19],
                [4, 40, 14, 2, 41, 15],
                // 9
                [2, 146, 116],
                [3, 58, 36, 2, 59, 37],
                [4, 36, 16, 4, 37, 17],
                [4, 36, 12, 4, 37, 13],
                // 10
                [2, 86, 68, 2, 87, 69],
                [4, 69, 43, 1, 70, 44],
                [6, 43, 19, 2, 44, 20],
                [6, 43, 15, 2, 44, 16],
                // 11
                [4, 101, 81],
                [1, 80, 50, 4, 81, 51],
                [4, 50, 22, 4, 51, 23],
                [3, 36, 12, 8, 37, 13],
                // 12
                [2, 116, 92, 2, 117, 93],
                [6, 58, 36, 2, 59, 37],
                [4, 46, 20, 6, 47, 21],
                [7, 42, 14, 4, 43, 15],
                // 13
                [4, 133, 107],
                [8, 59, 37, 1, 60, 38],
                [8, 44, 20, 4, 45, 21],
                [12, 33, 11, 4, 34, 12],
                // 14
                [3, 145, 115, 1, 146, 116],
                [4, 64, 40, 5, 65, 41],
                [11, 36, 16, 5, 37, 17],
                [11, 36, 12, 5, 37, 13],
                // 15
                [5, 109, 87, 1, 110, 88],
                [5, 65, 41, 5, 66, 42],
                [5, 54, 24, 7, 55, 25],
                [11, 36, 12, 7, 37, 13],
                // 16
                [5, 122, 98, 1, 123, 99],
                [7, 73, 45, 3, 74, 46],
                [15, 43, 19, 2, 44, 20],
                [3, 45, 15, 13, 46, 16],
                // 17
                [1, 135, 107, 5, 136, 108],
                [10, 74, 46, 1, 75, 47],
                [1, 50, 22, 15, 51, 23],
                [2, 42, 14, 17, 43, 15],
                // 18
                [5, 150, 120, 1, 151, 121],
                [9, 69, 43, 4, 70, 44],
                [17, 50, 22, 1, 51, 23],
                [2, 42, 14, 19, 43, 15],
                // 19
                [3, 141, 113, 4, 142, 114],
                [3, 70, 44, 11, 71, 45],
                [17, 47, 21, 4, 48, 22],
                [9, 39, 13, 16, 40, 14],
                // 20
                [3, 135, 107, 5, 136, 108],
                [3, 67, 41, 13, 68, 42],
                [15, 54, 24, 5, 55, 25],
                [15, 43, 15, 10, 44, 16],
                // 21
                [4, 144, 116, 4, 145, 117],
                [17, 68, 42],
                [17, 50, 22, 6, 51, 23],
                [19, 46, 16, 6, 47, 17],
                // 22
                [2, 139, 111, 7, 140, 112],
                [17, 74, 46],
                [7, 54, 24, 16, 55, 25],
                [34, 37, 13],
                // 23
                [4, 151, 121, 5, 152, 122],
                [4, 75, 47, 14, 76, 48],
                [11, 54, 24, 14, 55, 25],
                [16, 45, 15, 14, 46, 16],
                // 24
                [6, 147, 117, 4, 148, 118],
                [6, 73, 45, 14, 74, 46],
                [11, 54, 24, 16, 55, 25],
                [30, 46, 16, 2, 47, 17],
                // 25
                [8, 132, 106, 4, 133, 107],
                [8, 75, 47, 13, 76, 48],
                [7, 54, 24, 22, 55, 25],
                [22, 45, 15, 13, 46, 16],
                // 26
                [10, 142, 114, 2, 143, 115],
                [19, 74, 46, 4, 75, 47],
                [28, 50, 22, 6, 51, 23],
                [33, 46, 16, 4, 47, 17],
                // 27
                [8, 152, 122, 4, 153, 123],
                [22, 73, 45, 3, 74, 46],
                [8, 53, 23, 26, 54, 24],
                [12, 45, 15, 28, 46, 16],
                // 28
                [3, 147, 117, 10, 148, 118],
                [3, 73, 45, 23, 74, 46],
                [4, 54, 24, 31, 55, 25],
                [11, 45, 15, 31, 46, 16],
                // 29
                [7, 146, 116, 7, 147, 117],
                [21, 73, 45, 7, 74, 46],
                [1, 53, 23, 37, 54, 24],
                [19, 45, 15, 26, 46, 16],
                // 30
                [5, 145, 115, 10, 146, 116],
                [19, 75, 47, 10, 76, 48],
                [15, 54, 24, 25, 55, 25],
                [23, 45, 15, 25, 46, 16],
                // 31
                [13, 145, 115, 3, 146, 116],
                [2, 74, 46, 29, 75, 47],
                [42, 54, 24, 1, 55, 25],
                [23, 45, 15, 28, 46, 16],
                // 32
                [17, 145, 115],
                [10, 74, 46, 23, 75, 47],
                [10, 54, 24, 35, 55, 25],
                [19, 45, 15, 35, 46, 16],
                // 33
                [17, 145, 115, 1, 146, 116],
                [14, 74, 46, 21, 75, 47],
                [29, 54, 24, 19, 55, 25],
                [11, 45, 15, 46, 46, 16],
                // 34
                [13, 145, 115, 6, 146, 116],
                [14, 74, 46, 23, 75, 47],
                [44, 54, 24, 7, 55, 25],
                [59, 46, 16, 1, 47, 17],
                // 35
                [12, 151, 121, 7, 152, 122],
                [12, 75, 47, 26, 76, 48],
                [39, 54, 24, 14, 55, 25],
                [22, 45, 15, 41, 46, 16],
                // 36
                [6, 151, 121, 14, 152, 122],
                [6, 75, 47, 34, 76, 48],
                [46, 54, 24, 10, 55, 25],
                [2, 45, 15, 64, 46, 16],
                // 37
                [17, 152, 122, 4, 153, 123],
                [29, 74, 46, 14, 75, 47],
                [49, 54, 24, 10, 55, 25],
                [24, 45, 15, 46, 46, 16],
                // 38
                [4, 152, 122, 18, 153, 123],
                [13, 74, 46, 32, 75, 47],
                [48, 54, 24, 14, 55, 25],
                [42, 45, 15, 32, 46, 16],
                // 39
                [20, 147, 117, 4, 148, 118],
                [40, 75, 47, 7, 76, 48],
                [43, 54, 24, 22, 55, 25],
                [10, 45, 15, 67, 46, 16],
                // 40
                [19, 148, 118, 6, 149, 119],
                [18, 75, 47, 31, 76, 48],
                [34, 54, 24, 34, 55, 25],
                [20, 45, 15, 61, 46, 16]
            ];
            var MODEL1_ERROR_CORRECTION_CHARACTERISTICS = [
                [1, 26, 19],
                [1, 26, 16],
                [1, 26, 13],
                [1, 26, 9],
                // 2
                [1, 46, 36],
                [1, 46, 30],
                [1, 46, 24],
                [1, 46, 16],
                // 3
                [1, 72, 57],
                [1, 72, 44],
                [1, 72, 36],
                [1, 72, 24],
                // 4
                [1, 100, 80],
                [1, 100, 60],
                [1, 100, 50],
                [1, 100, 34],
                // 5
                [1, 134, 108],
                [1, 134, 82],
                [1, 134, 68],
                [2, 67, 23],
                // 6
                [1, 170, 136],
                [2, 85, 53],
                [2, 85, 43],
                [2, 85, 29],
                // 7
                [1, 212, 170],
                [2, 106, 66],
                [2, 106, 54],
                [3, 70, 24],
                // 8
                [2, 128, 104],
                [2, 128, 80],
                [2, 128, 64],
                [3, 85, 29],
                // 9
                [2, 153, 123],
                [2, 153, 93],
                [3, 102, 52],
                [3, 102, 34],
                // 10
                [2, 179, 145],
                [2, 179, 111],
                [3, 119, 61],
                [4, 89, 31],
                // 11
                [2, 208, 168],
                [4, 104, 64],
                [4, 104, 52],
                [5, 83, 29],
                // 12
                [2, 238, 192],
                [4, 119, 73],
                [4, 119, 61],
                [5, 95, 33],
                // 13
                [3, 180, 144],
                [4, 135, 83],
                [4, 135, 69],
                [6, 90, 32],
                // 14
                [3, 203, 163],
                [4, 152, 92],
                [5, 122, 62],
                [6, 101, 35]
            ];
            function getErrorCorrectionCharacteristics(version, ecLevel, model) {
                if (model === void 0) { model = 2; }
                var index;
                switch (ecLevel) {
                    case 1:
                        index = 0;
                        break;
                    case 0:
                        index = 1;
                        break;
                    case 3:
                        index = 2;
                        break;
                    case 2:
                        index = 3;
                        break;
                }
                var table = model === 2 ? MODEL2_1ERROR_CORRECTION_CHARACTERISTICS : MODEL1_ERROR_CORRECTION_CHARACTERISTICS;
                var info = table[(version - 1) * 4 + index];
                var result = [];
                var length = info.length / 3;
                for (var i = 0; i < length; i++) {
                    var blockCount = info[i * 3];
                    for (var j = 0; j < blockCount; j++) {
                        result.push({
                            total: info[i * 3 + 1],
                            data: info[i * 3 + 2],
                            ec: info[i * 3 + 1] - info[i * 3 + 2]
                        });
                    }
                }
                return result;
            }
            common.getErrorCorrectionCharacteristics = getErrorCorrectionCharacteristics;
            function getMaskFunc(type) {
                return common.maskFuncs[type];
            }
            common.getMaskFunc = getMaskFunc;
            function cloneModules(modules) {
                return modules.reduce(function (arr, row) {
                    arr.push(row.slice(0));
                    return arr;
                }, []);
            }
            function getMaskScore(modules) {
                var moduleCount = modules.length;
                var score = 0;
                for (var row = 0; row < moduleCount; row++) {
                    for (var col = 0; col < moduleCount; col++) {
                        var sameCount = 0;
                        var dark = modules[row][col];
                        for (var r = -1; r <= 1; r++) {
                            if (row + r < 0 || moduleCount <= row + r) {
                                continue;
                            }
                            for (var c = -1; c <= 1; c++) {
                                if (col + c < 0 || moduleCount <= col + c) {
                                    continue;
                                }
                                if (r == 0 && c == 0) {
                                    continue;
                                }
                                if (dark == modules[row + r][col + c]) {
                                    sameCount += 1;
                                }
                            }
                        }
                        if (sameCount > 5) {
                            score += (3 + sameCount - 5);
                        }
                    }
                }
                for (var row = 0; row < moduleCount - 1; row++) {
                    for (var col = 0; col < moduleCount - 1; col++) {
                        var count = 0;
                        if (modules[row][col])
                            count += 1;
                        if (modules[row + 1][col])
                            count += 1;
                        if (modules[row][col + 1])
                            count += 1;
                        if (modules[row + 1][col + 1])
                            count += 1;
                        if (count == 0 || count == 4) {
                            score += 3;
                        }
                    }
                }
                for (var row = 0; row < moduleCount; row++) {
                    for (var col = 0; col < moduleCount - 6; col++) {
                        if (modules[row][col]
                            && !modules[row][col + 1]
                            && modules[row][col + 2]
                            && modules[row][col + 3]
                            && modules[row][col + 4]
                            && !modules[row][col + 5]
                            && modules[row][col + 6]) {
                            score += 40;
                        }
                    }
                }
                for (var col = 0; col < moduleCount; col++) {
                    for (var row = 0; row < moduleCount - 6; row++) {
                        if (modules[row][col]
                            && !modules[row + 1][col]
                            && modules[row + 2][col]
                            && modules[row + 3][col]
                            && modules[row + 4][col]
                            && !modules[row + 5][col]
                            && modules[row + 6][col]) {
                            score += 40;
                        }
                    }
                }
                var darkCount = 0;
                for (var col = 0; col < moduleCount; col++) {
                    for (var row = 0; row < moduleCount; row++) {
                        if (modules[row][col]) {
                            darkCount += 1;
                        }
                    }
                }
                var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
                score += ratio * 10;
                return score;
            }
            common.getMaskScore = getMaskScore;
            function addFormatInformation(originModules, maskPattern, ec, model) {
                var modulesCount = originModules.length;
                var modules = cloneModules(originModules);
                var ecIndicator = wijmo.barcode.Utils.strPadStart(wijmo.barcode.Utils.convertRadix(ec, 2), 2, 0);
                var mask = wijmo.barcode.Utils.strPadStart(wijmo.barcode.Utils.convertRadix(maskPattern, 2), 3, 0);
                var data = ecIndicator + mask;
                var format = common.getBCH15(parseInt(data, 2), model);
                modules[modulesCount - 8][8] = 1;
                for (var i = 15; i > 0; i--) {
                    var dark = ((format >> i - 1) & 1);
                    if (i > 9) {
                        modules[8][15 - i] = dark;
                        modules[modulesCount - 1 - 15 + i][8] = dark;
                    }
                    else if (i > 8) {
                        modules[8][15 - i + 1] = dark;
                        modules[modulesCount - 1 - 15 + i][8] = dark;
                    }
                    else if (i > 6) {
                        modules[i][8] = dark;
                        modules[8][modulesCount - i] = dark;
                    }
                    else {
                        modules[i - 1][8] = dark;
                        modules[8][modulesCount - i] = dark;
                    }
                }
                return modules;
            }
            common.addFormatInformation = addFormatInformation;
            function getEstimatedVersion(ec, charCode, model) {
                var numCount = 0, alphaCount = 0, byteCount = 0, kanjiCount = 0;
                charCode.forEach(function (cc) {
                    if (isNumericMode(cc)) {
                        numCount++;
                    }
                    else if (isAlphanumericMode(cc)) {
                        alphaCount++;
                    }
                    else if (isKanjiMode(cc)) {
                        kanjiCount++;
                    }
                    else if (is8BitByteMode(cc)) {
                        byteCount++;
                    }
                });
                var size = Math.ceil((alphaCount * 5 + numCount * 3 + kanjiCount * 13 + byteCount * 8) / 8);
                for (var ver = 1; ver <= 40; ver++) {
                    var blocks = getErrorCorrectionCharacteristics(ver, ec, model);
                    var dataCapacity = blocks.reduce(function (sum, b) { return sum += b.data; }, 0);
                    if (size <= dataCapacity) {
                        return ver;
                    }
                }
                throw new wijmo.barcode.TextTooLongException();
            }
            common.getEstimatedVersion = getEstimatedVersion;
            var MODE_CHECK_INFO = {
                Alphanumeric: [[6, 11], [7, 15], [8, 16]],
                Numeric: [[4, 6, 6, 13], [4, 7, 8, 15], [5, 8, 9, 17]]
            };
            function getModeCheckInfo(mode, version) {
                var modeInfo = MODE_CHECK_INFO[mode];
                if (version <= 9) {
                    return modeInfo[0];
                }
                else if (version <= 26) {
                    return modeInfo[1];
                }
                else {
                    return modeInfo[2];
                }
            }
            common.getModeCheckInfo = getModeCheckInfo;
            function utf8Encode(charCode) {
                var bytes = [];
                for (var i = 0, len = charCode.length; i < len; i++) {
                    var c = charCode[i];
                    if (c < 0x80) {
                        bytes.push(c);
                    }
                    else if (c < 0x800) {
                        bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
                    }
                    else if (c < 0xd800 || c >= 0xe000) {
                        bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
                    }
                    else {
                        i++;
                        c = 0x10000 + (((c & 0x3ff) << 10) | (charCode[i] & 0x3ff));
                        bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
                    }
                }
                return bytes;
            }
            common.utf8Encode = utf8Encode;
            function getParityData(charCode) {
                var bytes = utf8Encode(charCode);
                var result = bytes[0];
                for (var i = 1, len = bytes.length; i < len; i++) {
                    result ^= bytes[i];
                }
                return result;
            }
            common.getParityData = getParityData;
            function getCharCode(text) {
                var result = [];
                wijmo.barcode.Utils.sliceString(text, 1, function (c) {
                    result.push(c.charCodeAt(0));
                });
                return result;
            }
            common.getCharCode = getCharCode;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var ModeKanji = /** @class */ (function () {
                function ModeKanji(data) {
                    this.mode = 'Kanji';
                    this.data = data;
                }
                ModeKanji.prototype.getMode = function () {
                    return common.MODE_INDICATOR['Kanji'];
                };
                ModeKanji.prototype.getLength = function () {
                    return this.data.length;
                };
                ModeKanji.prototype.write = function (buffer) {
                    this.data.forEach(function (d) {
                        var result;
                        if (d > 0x8140 && d < 0x9FFC) {
                            d -= 0x8140;
                            var first = d >>> 8;
                            var second = d & 0xff;
                            result = first * 0xC0 + second;
                        }
                        else if (d > 0xE040 && d < 0xEBBF) {
                            d -= 0xC140;
                            var first = d >>> 8;
                            var second = d & 0xff;
                            result = first * 0xC0 + second;
                        }
                        buffer.put(result, 13);
                    });
                };
                return ModeKanji;
            }());
            common.ModeKanji = ModeKanji;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var ModeAlphanumeric = /** @class */ (function () {
                function ModeAlphanumeric(data) {
                    this.mode = 'Alphanumeric';
                    this.data = data;
                }
                ModeAlphanumeric.prototype.getMode = function () {
                    return common.MODE_INDICATOR['Alphanumeric'];
                };
                ModeAlphanumeric.prototype.getLength = function () {
                    return this.data.length;
                };
                ModeAlphanumeric.prototype.write = function (buffer) {
                    wijmo.barcode.Utils.sliceArray(this.data, 2, function (arr) {
                        var first = common.getAlphanumericCharValue(arr[0]);
                        if (arr.length === 2) {
                            var second = common.getAlphanumericCharValue(arr[1]);
                            var num = first * 45 + second;
                            buffer.put(num, 11);
                        }
                        else {
                            buffer.put(first, 6);
                        }
                    });
                };
                return ModeAlphanumeric;
            }());
            common.ModeAlphanumeric = ModeAlphanumeric;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var ModeNumeric = /** @class */ (function () {
                function ModeNumeric(data) {
                    this.mode = 'Numeric';
                    this.data = data;
                }
                ModeNumeric.prototype.getMode = function () {
                    return common.MODE_INDICATOR['Numeric'];
                };
                ModeNumeric.prototype.getLength = function () {
                    return this.data.length;
                };
                ModeNumeric.prototype.write = function (buffer) {
                    wijmo.barcode.Utils.sliceArray(this.data, 3, function (arr) {
                        var num = parseInt(arr.reduce(function (str, item) { return str += String.fromCharCode(item); }, ''));
                        switch (arr.length) {
                            case 1:
                                buffer.put(num, 4);
                                return;
                            case 2:
                                buffer.put(num, 7);
                                return;
                            default:
                                buffer.put(num, 10);
                                return;
                        }
                    });
                };
                return ModeNumeric;
            }());
            common.ModeNumeric = ModeNumeric;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var Mode8BitByte = /** @class */ (function () {
                function Mode8BitByte(data) {
                    this.mode = '8BitByte';
                    this.data = data;
                    this.bytes = common.utf8Encode(data);
                }
                Mode8BitByte.prototype.getMode = function () {
                    return common.MODE_INDICATOR['8BitByte'];
                };
                Mode8BitByte.prototype.getLength = function () {
                    return this.bytes.length;
                };
                Mode8BitByte.prototype.write = function (buffer) {
                    this.bytes.forEach(function (b) {
                        buffer.put(b, 8);
                    });
                };
                return Mode8BitByte;
            }());
            common.Mode8BitByte = Mode8BitByte;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var QRCodeBase = /** @class */ (function () {
                function QRCodeBase(text, config) {
                    var version = config.version, model = config.model, charCode = config.charCode;
                    this.charCode = charCode ? charCode : common.getCharCode(text);
                    var errorCorrectionLevel = common.EC_INDICATOR[config.errorCorrectionLevel];
                    this.config = config;
                    this.errorCorrectionLevel = errorCorrectionLevel;
                    this.model = +model;
                    if (version === 'auto') {
                        version = this.getAutoVersion();
                    }
                    else {
                        version = +version;
                    }
                    this.version = version;
                    this.modulesCount = common.getSizeByVersion(version);
                    this.charCountIndicatorBitsNumber = common.getCharacterCountIndicatorbitsNumber(version);
                    this.errorCorrectionCharacteristics = common.getErrorCorrectionCharacteristics(version, errorCorrectionLevel, this.model);
                    this.totalDataCount = this.errorCorrectionCharacteristics.reduce(function (result, item) { return result += item.data; }, 0);
                    this.totalDataBits = 8 * this.totalDataCount;
                }
                QRCodeBase.prototype.getConnections = function () {
                    var _a = this, totalDataBits = _a.totalDataBits, charCode = _a.charCode;
                    var maxBit = totalDataBits - 20;
                    var len = charCode.length;
                    var start = 0, end = 1;
                    var results = [];
                    var last = charCode[0];
                    while (end <= len) {
                        var code = charCode.slice(start, end);
                        var sets = this.analysisData(code);
                        var buffer = this.encodeData(sets);
                        if (buffer.length > maxBit) {
                            results.push(last);
                            start = end - 1;
                        }
                        else if (end === len) {
                            results.push(code);
                        }
                        last = code;
                        end++;
                    }
                    return results;
                };
                QRCodeBase.prototype.processConnection = function (buffer) {
                    var _a = this, totalDataBits = _a.totalDataBits, _b = _a.config, connection = _b.connection, connectionNo = _b.connectionNo;
                    connectionNo = +connectionNo;
                    if (connection) {
                        var connectionCnt = Math.ceil(buffer.length / (totalDataBits - 20));
                        if (connectionNo > connectionCnt - 1) {
                            throw new wijmo.barcode.InvalidOptionsException({ connectionNo: connectionNo }, "Max connection number is " + (connectionCnt - 1));
                        }
                        var connections = this.getConnections();
                        var substr = connections[connectionNo];
                        var sets = this.analysisData(substr);
                        var _buffer = this.encodeData(sets, { connectionNo: connectionNo, connectionCnt: connectionCnt });
                        return _buffer;
                    }
                    else {
                        if (buffer.length > totalDataBits) {
                            throw new wijmo.barcode.TextTooLongException();
                        }
                        return buffer;
                    }
                };
                QRCodeBase.prototype.padBuffer = function (buffer) {
                    var totalDataBits = this.totalDataBits;
                    if (buffer.length + 4 <= totalDataBits) {
                        buffer.put(common.MODE_INDICATOR.Terminator, 4);
                    }
                    while (buffer.length % 8 != 0) {
                        buffer.putBit(false);
                    }
                    while (true) { //eslint-disable-line
                        if (buffer.length >= totalDataBits) {
                            break;
                        }
                        buffer.put(common.padCodewords0, 8);
                        if (buffer.length >= totalDataBits) {
                            break;
                        }
                        buffer.put(common.padCodewords1, 8);
                    }
                };
                QRCodeBase.prototype.getAutoVersion = function () {
                    var _a = this, errorCorrectionLevel = _a.errorCorrectionLevel, charCode = _a.charCode, model = _a.model;
                    var estimatedVersion = common.getEstimatedVersion(errorCorrectionLevel, charCode, model);
                    for (var v = estimatedVersion; v < 40; v++) {
                        this.version = v;
                        this.modulesCount = common.getSizeByVersion(this.version);
                        this.charCountIndicatorBitsNumber = common.getCharacterCountIndicatorbitsNumber(this.version);
                        this.errorCorrectionCharacteristics = common.getErrorCorrectionCharacteristics(this.version, errorCorrectionLevel);
                        this.totalDataCount = this.errorCorrectionCharacteristics.reduce(function (result, item) { return result += item.data; }, 0);
                        this.totalDataBits = 8 * this.totalDataCount;
                        var datas = this.analysisData(charCode);
                        var buffer = this.encodeData(datas);
                        if (buffer.length > this.totalDataBits) {
                            continue;
                        }
                        return v;
                    }
                    throw new wijmo.barcode.TextTooLongException();
                };
                //encode text content
                QRCodeBase.prototype.analysisData = function (charCode) {
                    var _a = this, version = _a.version, charset = _a.config.charset;
                    var initMode = common.getCharMode(charCode[0], charset);
                    switch (initMode) {
                        case 'Alphanumeric': //eslint-disable-line
                            var info1 = common.getModeCheckInfo(initMode, version);
                            var remainderStr = charCode.slice(1, 1 + info1[0]);
                            if (common.isMode('8BitByte', remainderStr)) {
                                initMode = '8BitByte';
                            }
                            break;
                        case 'Numeric': //eslint-disable-line
                            var info2 = common.getModeCheckInfo(initMode, version);
                            var remainderStr1 = charCode.slice(1, 1 + info2[0]), remainderStr2 = charCode.slice(1, 1 + info2[1]);
                            if (common.isMode('8BitByte', remainderStr1)) {
                                initMode = '8BitByte';
                            }
                            else if (common.isMode('Alphanumeric', remainderStr2)) {
                                initMode = 'Alphanumeric';
                            }
                            break;
                    }
                    var lastMode = { mode: initMode, code: [] };
                    var sets = [lastMode];
                    charCode.forEach(function (cc, index) {
                        var mode = common.getCharMode(cc, charset);
                        if (lastMode.mode === mode) {
                            lastMode.code.push(cc);
                        }
                        else {
                            if (lastMode.mode === '8BitByte') {
                                if (mode === 'Kanji') {
                                    lastMode = { mode: mode, code: [cc] };
                                    sets.push(lastMode);
                                }
                                else if (mode === 'Numeric') {
                                    var info = common.getModeCheckInfo(mode, version);
                                    if (common.isMode(mode, charCode.slice(index, index + info[2]))) {
                                        lastMode = { mode: mode, code: [cc] };
                                        sets.push(lastMode);
                                    }
                                    else {
                                        lastMode.code.push(cc);
                                    }
                                }
                                else if (mode === 'Alphanumeric') {
                                    var info = common.getModeCheckInfo(mode, version);
                                    if (common.isMode(mode, charCode.slice(index, index + info[1]))) {
                                        lastMode = { mode: mode, code: [cc] };
                                        sets.push(lastMode);
                                    }
                                    else {
                                        lastMode.code.push(cc);
                                    }
                                }
                                else {
                                    lastMode.code.push(cc);
                                }
                            }
                            else if (lastMode.mode === 'Alphanumeric') {
                                if (mode === 'Kanji' || mode === '8BitByte') {
                                    lastMode = { mode: mode, code: [cc] };
                                    sets.push(lastMode);
                                }
                                else if (mode === 'Numeric') {
                                    var info = common.getModeCheckInfo(mode, version);
                                    if (common.isMode(mode, charCode.slice(index, index + info[2]))) {
                                        lastMode = { mode: mode, code: [cc] };
                                        sets.push(lastMode);
                                    }
                                    else {
                                        lastMode.code.push(cc);
                                    }
                                }
                                else {
                                    lastMode.code.push(cc);
                                }
                            }
                            else {
                                lastMode = { mode: mode, code: [cc] };
                                sets.push(lastMode);
                            }
                        }
                    });
                    return sets;
                };
                QRCodeBase.prototype.generateErrorCorrectionCode = function (buffer) {
                    var errorCorrectionCharacteristics = this.errorCorrectionCharacteristics;
                    var blocks = [];
                    var pos = 0;
                    errorCorrectionCharacteristics.forEach(function (item) {
                        var cw = buffer.getBuffer().slice(pos, pos + item.data);
                        blocks.push({
                            data: cw,
                            ec: common.generateErrorCorrectionCode(cw, item.ec, item.data)
                        });
                        pos += item.data;
                    });
                    return blocks;
                };
                //Function pattern placement
                QRCodeBase.prototype.addRectModule = function (x, y, w, h, flag) {
                    if (flag === void 0) { flag = false; }
                    var modules = this.modules;
                    var height = h + y, width = w + x;
                    for (; y < height; y++) {
                        var _x = x;
                        for (; _x < width; _x++) {
                            modules[y][_x] = +flag;
                        }
                    }
                };
                QRCodeBase.prototype.addPositionDetectionPattern = function () {
                    var modules = this.modules;
                    var modulesCount = modules.length;
                    //top-left
                    this.addPattern(0, 0, 7);
                    //separator
                    this.addRectModule(7, 0, 1, 8, false);
                    this.addRectModule(0, 7, 8, 1, false);
                    //top-right
                    var trX = modulesCount - 7;
                    this.addPattern(trX, 0, 7);
                    //separator
                    this.addRectModule(trX - 1, 0, 1, 8, false);
                    this.addRectModule(trX - 1, 7, 8, 1, false);
                    //bottom-left
                    var blY = modulesCount - 7;
                    this.addPattern(0, blY, 7);
                    //separator
                    this.addRectModule(7, blY - 1, 1, 8, false);
                    this.addRectModule(0, blY - 1, 8, 1, false);
                };
                QRCodeBase.prototype.addTimingPattern = function () {
                    var modules = this.modules;
                    var modulesCount = modules.length;
                    var dark = true;
                    for (var i = 8; i < modulesCount - 7; i++) {
                        modules[6][i] = +dark;
                        modules[i][6] = +dark;
                        dark = !dark;
                    }
                };
                QRCodeBase.prototype.addPattern = function (x, y, s) {
                    this.addRectModule(x, y, s, s, true);
                    this.addRectModule(x + 1, y + 1, s - 2, s - 2, false);
                    this.addRectModule(x + 2, y + 2, s - 4, s - 4, true);
                };
                return QRCodeBase;
            }());
            common.QRCodeBase = QRCodeBase;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var QRCodeModel2 = /** @class */ (function (_super) {
                __extends(QRCodeModel2, _super);
                function QRCodeModel2() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                QRCodeModel2.prototype.encodeData = function (sets, connectionInfo) {
                    var _a = this, charCountIndicatorBitsNumber = _a.charCountIndicatorBitsNumber, charCode = _a.charCode;
                    var buffer = new wijmo.barcode.BitBuffer();
                    if (connectionInfo) {
                        buffer.put(common.MODE_INDICATOR.StructuredAppend, 4);
                        buffer.put(connectionInfo.connectionNo, 4);
                        buffer.put(connectionInfo.connectionCnt - 1, 4);
                        buffer.put(common.getParityData(charCode), 8);
                    }
                    sets.forEach(function (set) {
                        if (!set.code) {
                            return;
                        }
                        var data;
                        switch (set.mode) {
                            case 'Numeric':
                                data = new common.ModeNumeric(set.code);
                                break;
                            case 'Alphanumeric':
                                data = new common.ModeAlphanumeric(set.code);
                                break;
                            case '8BitByte':
                                data = new common.Mode8BitByte(set.code);
                                break;
                            case 'Kanji':
                                data = new common.ModeKanji(set.code);
                                break;
                        }
                        buffer.put(data.getMode(), 4);
                        buffer.put(data.getLength(), charCountIndicatorBitsNumber[data.mode]);
                        data.write(buffer);
                    });
                    return buffer;
                };
                QRCodeModel2.prototype.getFinalMessage = function (blocks) {
                    var data = [];
                    var dataBlocks = blocks.map(function (block) { return block.data; });
                    var ecBlocks = blocks.map(function (block) { return block.ec; });
                    var dcMaxNum = wijmo.barcode.Utils.getMaxValue(dataBlocks);
                    var ecMaxNum = wijmo.barcode.Utils.getMaxValue(ecBlocks);
                    var _loop_1 = function (i) {
                        dataBlocks.forEach(function (dbk) {
                            if (wijmo.barcode.Utils.isDefined(dbk[i])) {
                                data.push(dbk[i]);
                            }
                        });
                    };
                    for (var i = 0; i < dcMaxNum; i++) {
                        _loop_1(i);
                    }
                    var _loop_2 = function (i) {
                        ecBlocks.forEach(function (ebk) {
                            if (wijmo.barcode.Utils.isDefined(ebk[i])) {
                                data.push(ebk[i]);
                            }
                        });
                    };
                    for (var i = 0; i < ecMaxNum; i++) {
                        _loop_2(i);
                    }
                    return data;
                };
                // Module placement in matrix
                QRCodeModel2.prototype.setModules = function (data) {
                    var _a = this, modulesCount = _a.modulesCount, version = _a.version;
                    this.modules = common.createModules(modulesCount);
                    this.addPositionDetectionPattern();
                    this.addAlignmentPattern();
                    this.addTimingPattern();
                    if (version > 6) {
                        this.addVersionInformation();
                    }
                    this.maskModules(data);
                };
                QRCodeModel2.prototype.maskModules = function (data) {
                    var _a = this, modules = _a.modules, errorCorrectionLevel = _a.errorCorrectionLevel, model = _a.model, mask = _a.config.mask;
                    if (mask === 'auto') {
                        this.autoMask(data);
                    }
                    else {
                        var maskFunc = common.getMaskFunc(mask);
                        this.maskPattern = mask;
                        var newModules = common.addFormatInformation(modules, mask, errorCorrectionLevel, model);
                        this.modules = this.fillDataModules(newModules, data, maskFunc);
                    }
                };
                QRCodeModel2.prototype.autoMask = function (data) {
                    var _this = this;
                    var _a = this, modules = _a.modules, errorCorrectionLevel = _a.errorCorrectionLevel, model = _a.model;
                    var result, score, pattern;
                    common.maskFuncs.forEach(function (fn, i) {
                        var newModules = common.addFormatInformation(modules, i, errorCorrectionLevel, model);
                        var _mod = _this.fillDataModules(newModules, data, fn);
                        var _score = common.getMaskScore(_mod);
                        //
                        if (!score || _score < score) {
                            result = _mod;
                            score = _score;
                            pattern = i;
                        }
                    });
                    this.modules = result;
                    this.maskPattern = pattern;
                };
                QRCodeModel2.prototype.addAlignmentPattern = function () {
                    var _this = this;
                    var _a = this, modules = _a.modules, version = _a.version;
                    var pos = common.getAlignmentPattersPos(version);
                    pos.forEach(function (row) {
                        pos.forEach(function (col) {
                            if (modules[row][col] === null) {
                                _this.addPattern(col - 2, row - 2, 5);
                            }
                        });
                    });
                };
                QRCodeModel2.prototype.addVersionInformation = function () {
                    var _a = this, modulesCount = _a.modulesCount, modules = _a.modules, version = _a.version;
                    var data = common.getBCH18(version);
                    for (var i = 0; i < 18; i++) {
                        var dark = ((data >> i) & 1);
                        modules[Math.floor(i / 3)][i % 3 + modulesCount - 8 - 3] = dark;
                        modules[i % 3 + modulesCount - 8 - 3][Math.floor(i / 3)] = dark;
                    }
                };
                QRCodeModel2.prototype.fillDataModules = function (modules, data, maskFunc) {
                    var modulesCount = modules.length;
                    var inc = -1;
                    var row = modulesCount - 1;
                    var bitIndex = 7;
                    var byteIndex = 0;
                    for (var col = modulesCount - 1; col > 0; col -= 2) {
                        if (col == 6)
                            col -= 1;
                        while (true) { //eslint-disable-line
                            for (var c = 0; c < 2; c += 1) {
                                if (modules[row][col - c] == null) {
                                    var dark = false;
                                    if (byteIndex < data.length) {
                                        dark = (((data[byteIndex] >>> bitIndex) & 1) == 1);
                                    }
                                    if (maskFunc(row, col - c)) {
                                        dark = !dark;
                                    }
                                    modules[row][col - c] = +dark;
                                    bitIndex -= 1;
                                    if (bitIndex == -1) {
                                        byteIndex += 1;
                                        bitIndex = 7;
                                    }
                                }
                            }
                            row += inc;
                            if (row < 0 || modulesCount <= row) {
                                row -= inc;
                                inc = -inc;
                                break;
                            }
                        }
                    }
                    return modules;
                };
                QRCodeModel2.prototype.getMatrix = function () {
                    var charCode = this.charCode;
                    var datas = this.analysisData(charCode);
                    var buffer = this.encodeData(datas);
                    var newBuffer = this.processConnection(buffer);
                    this.padBuffer(newBuffer);
                    var blocks = this.generateErrorCorrectionCode(newBuffer);
                    var data = this.getFinalMessage(blocks);
                    this.setModules(data);
                    return this.modules;
                };
                return QRCodeModel2;
            }(common.QRCodeBase));
            common.QRCodeModel2 = QRCodeModel2;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var QRCodeModel1 = /** @class */ (function (_super) {
                __extends(QRCodeModel1, _super);
                function QRCodeModel1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                QRCodeModel1.prototype.encodeData = function (sets, connectionInfo) {
                    var _a = this, charCountIndicatorBitsNumber = _a.charCountIndicatorBitsNumber, charCode = _a.charCode;
                    var buffer = new wijmo.barcode.BitBuffer();
                    buffer.put(0, 4);
                    if (connectionInfo) {
                        buffer.put(common.MODE_INDICATOR.StructuredAppend, 4);
                        buffer.put(connectionInfo.connectionNo, 4);
                        buffer.put(connectionInfo.connectionCnt - 1, 4);
                        buffer.put(common.getParityData(charCode), 8);
                    }
                    sets.forEach(function (set) {
                        if (!set.code) {
                            return;
                        }
                        var data;
                        switch (set.mode) {
                            case 'Numeric':
                                data = new common.ModeNumeric(set.code);
                                break;
                            case 'Alphanumeric':
                                data = new common.ModeAlphanumeric(set.code);
                                break;
                            case '8BitByte':
                                data = new common.Mode8BitByte(set.code);
                                break;
                            case 'Kanji':
                                data = new common.ModeKanji(set.code);
                                break;
                        }
                        buffer.put(data.getMode(), 4);
                        buffer.put(data.getLength(), charCountIndicatorBitsNumber[data.mode]);
                        data.write(buffer);
                    });
                    return buffer;
                };
                QRCodeModel1.prototype.getFinalMessage = function (blocks) {
                    var data = [];
                    var dataBlocks = blocks.map(function (block) { return block.data; });
                    var ecBlocks = blocks.map(function (block) { return block.ec; });
                    dataBlocks.forEach(function (db) { return data = data.concat(db); });
                    ecBlocks.forEach(function (db) { return data = data.concat(db); });
                    return data;
                };
                // Module placement in matrix
                QRCodeModel1.prototype.setModules = function (data) {
                    var modulesCount = this.modulesCount;
                    this.modules = common.createModules(modulesCount);
                    this.addPositionDetectionPattern();
                    this.addExtensionPattern();
                    this.addTimingPattern();
                    this.maskModules(data);
                };
                QRCodeModel1.prototype.maskModules = function (data) {
                    var _a = this, modules = _a.modules, errorCorrectionLevel = _a.errorCorrectionLevel, model = _a.model, mask = _a.config.mask;
                    if (mask === 'auto') {
                        this.autoMask(data);
                    }
                    else {
                        var maskFunc = common.getMaskFunc(mask);
                        this.maskPattern = mask;
                        var newModules = common.addFormatInformation(modules, mask, errorCorrectionLevel, model);
                        this.modules = this.fillDataModules(newModules, data, maskFunc);
                    }
                };
                QRCodeModel1.prototype.autoMask = function (data) {
                    var _this = this;
                    var _a = this, modules = _a.modules, errorCorrectionLevel = _a.errorCorrectionLevel, model = _a.model;
                    var result, score, pattern;
                    common.maskFuncs.forEach(function (fn, i) {
                        var newModules = common.addFormatInformation(modules, i, errorCorrectionLevel, model);
                        var _mod = _this.fillDataModules(newModules, data, fn);
                        var _score = common.getMaskScore(_mod);
                        //
                        if (!score || _score < score) {
                            result = _mod;
                            score = _score;
                            pattern = i;
                        }
                    });
                    this.modules = result;
                    this.maskPattern = pattern;
                };
                QRCodeModel1.prototype.addExtensionPattern = function () {
                    var _a = this, modules = _a.modules, version = _a.version;
                    var modulesCount = modules.length;
                    //Extension Data at the corner
                    modules[modulesCount - 1][modulesCount - 1] = 1;
                    modules[modulesCount - 2][modulesCount - 1] = 0;
                    modules[modulesCount - 1][modulesCount - 2] = 0;
                    modules[modulesCount - 2][modulesCount - 2] = 0;
                    var count = Math.floor(version / 2);
                    if (wijmo.barcode.Utils.isEven(version)) {
                        for (var i = 0; i < count; i++) {
                            this.addBaseExtension(13 + i * 8);
                            this.addRightExtension(13 + i * 8);
                        }
                    }
                    else {
                        for (var i = 0; i < count; i++) {
                            this.addBaseExtension(17 + i * 8);
                            this.addRightExtension(17 + i * 8);
                        }
                    }
                };
                QRCodeModel1.prototype.addBaseExtension = function (x) {
                    var modules = this.modules;
                    var modulesCount = modules.length;
                    var lightRow = modulesCount - 2, darkRow = modulesCount - 1;
                    modules[lightRow][x] = 0;
                    modules[lightRow][x + 1] = 0;
                    modules[lightRow][x + 2] = 0;
                    modules[lightRow][x + 3] = 0;
                    modules[darkRow][x] = 1;
                    modules[darkRow][x + 1] = 1;
                    modules[darkRow][x + 2] = 1;
                    modules[darkRow][x + 3] = 1;
                };
                QRCodeModel1.prototype.addRightExtension = function (x) {
                    var modules = this.modules;
                    var modulesCount = modules.length;
                    var lightCol = modulesCount - 2, darkCol = modulesCount - 1;
                    modules[x][lightCol] = 0;
                    modules[x + 1][lightCol] = 0;
                    modules[x + 2][lightCol] = 0;
                    modules[x + 3][lightCol] = 0;
                    modules[x][darkCol] = 1;
                    modules[x + 1][darkCol] = 1;
                    modules[x + 2][darkCol] = 1;
                    modules[x + 3][darkCol] = 1;
                };
                QRCodeModel1.prototype.fillDataModules = function (modules, data, maskFunc) {
                    var modulesCount = modules.length;
                    var x, y;
                    x = y = modulesCount - 1;
                    var xmax = 2;
                    var bf = new wijmo.barcode.BitBuffer(data);
                    bf.next();
                    bf.next();
                    bf.next();
                    bf.next();
                    while (x >= 0) {
                        if (x == modulesCount - 5) {
                            xmax = 4;
                        }
                        else if (x == 8) {
                            xmax = 2;
                        }
                        else if (x == 6) {
                            x--;
                            continue;
                        }
                        while (y >= 0) {
                            if (modules[y][x] !== null) {
                                y--;
                                continue;
                            }
                            else {
                                for (var i = 0; i < xmax; i++) {
                                    var dark = bf.next();
                                    if (maskFunc(y, x - i)) {
                                        dark = !dark;
                                    }
                                    modules[y][x - i] = +dark;
                                }
                            }
                            y--;
                        }
                        x -= xmax;
                        y = modulesCount - 1;
                    }
                    return modules;
                };
                QRCodeModel1.prototype.getMatrix = function () {
                    var charCode = this.charCode;
                    var datas = this.analysisData(charCode);
                    var buffer = this.encodeData(datas);
                    var newBuffer = this.processConnection(buffer);
                    this.padBuffer(newBuffer);
                    var blocks = this.generateErrorCorrectionCode(newBuffer);
                    var data = this.getFinalMessage(blocks);
                    this.setModules(data);
                    return this.modules;
                };
                return QRCodeModel1;
            }(common.QRCodeBase));
            common.QRCodeModel1 = QRCodeModel1;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var QRCodeEncoder = /** @class */ (function (_super) {
                __extends(QRCodeEncoder, _super);
                function QRCodeEncoder(option) {
                    var _this = this;
                    option.merge(QRCodeEncoder.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this, text = _a.encodeConfig.text, config = _a.config;
                    var innerQRCode;
                    if (config.model == '2') {
                        innerQRCode = new common.QRCodeModel2(text, config);
                    }
                    else {
                        innerQRCode = new common.QRCodeModel1(text, config);
                    }
                    _this.innerQRCode = innerQRCode;
                    return _this;
                }
                QRCodeEncoder.prototype.calculateData = function () {
                    return this.innerQRCode.getMatrix();
                };
                QRCodeEncoder.prototype.validate = function () {
                    var _a = this.config, version = _a.version, model = _a.model, charset = _a.charset, charCode = _a.charCode, connectionNo = _a.connectionNo;
                    var text = this.encodeConfig.text;
                    //text or charCode is require
                    if (!text && (!charCode || charCode.length === 0)) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                    if (model != '1' && model != '2') {
                        throw new wijmo.barcode.InvalidOptionsException({ model: model });
                    }
                    if (charset != 'UTF-8' && charset != 'Shift_JIS') {
                        throw new wijmo.barcode.InvalidOptionsException({ charset: charset });
                    }
                    if (model == '1' && wijmo.barcode.Utils.isNumberLike(version) && (version < 1 || version > 14)) {
                        throw new wijmo.barcode.InvalidOptionsException({ version: version }, 'Model 1 only support version 1 - 14.');
                    }
                    if (model == '2' && wijmo.barcode.Utils.isNumberLike(version) && (version < 1 || version > 40)) {
                        throw new wijmo.barcode.InvalidOptionsException({ version: version }, 'Model 2 only support version 1 - 40.');
                    }
                    if (connectionNo > 15 || connectionNo < 0) {
                        throw new wijmo.barcode.InvalidOptionsException({ connectionNo: connectionNo }, 'ConnectionNo is in range 0 - 15.');
                    }
                };
                QRCodeEncoder.DefaultConfig = {
                    version: 'auto',
                    errorCorrectionLevel: 'L',
                    model: 2,
                    mask: 'auto',
                    connection: false,
                    connectionNo: 0,
                    charCode: undefined,
                    charset: 'UTF-8',
                    quietZone: {
                        top: 4,
                        left: 4,
                        right: 4,
                        bottom: 4
                    }
                };
                return QRCodeEncoder;
            }(wijmo.barcode.TwoDimensionalBarcode));
            common.QRCodeEncoder = QRCodeEncoder;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            wijmo.barcode.Barcode.registerEncoder('QRCode', common.QRCodeEncoder);
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var TableCode128A = [
                ' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')',
                '*', '+', ',', '-', '.', '/', '0', '1', '2', '3',
                '4', '5', '6', '7', '8', '9', ':', ';', '<', '=',
                '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
                'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
                'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[',
                '\\', ']', '^', '_',
                '\u0000', '\u0001', '\u0002', '\u0003', '\u0004', '\u0005', '\u0006', '\u0007', '\u0008', '\u0009',
                '\u000a', '\u000b', '\u000c', '\u000d', '\u000e', '\u000f', '\u0010', '\u0011', '\u0012', '\u0013',
                '\u0014', '\u0015', '\u0016', '\u0017', '\u0018', '\u0019', '\u001a', '\u001b', '\u001c', '\u001d',
                '\u001e', '\u001f',
                ' ', ' ', ' ', ' ', ' ',
                ' ', ' ', ' ', ' ', ' '
            ];
            var TableCode128B = [
                ' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')',
                '*', '+', ',', '-', '.', '/', '0', '1', '2', '3',
                '4', '5', '6', '7', '8', '9', ':', ';', '<', '=',
                '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
                'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
                'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[',
                '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e',
                'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
                'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
                'z', '{', '|', '}', '~', '\u007f', ' ', ' ', ' ', ' ',
                ' ', ' ', ' ', ' ', ' ', ' '
            ];
            var TableCode128Data = [
                '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
                '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
                '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
                '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
                '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
                '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
                '314111', '221411', '431111', '111224',
                '111422', '121124', '121421', '141122', '141221', '112214',
                '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
                '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
                '214121', '412121', '111143', '111341', '131141',
                '114113',
                '114311',
                '411113',
                '411311',
                '113141',
                '114131',
                '311141',
                '411131',
                '211412',
                '211214',
                '211232' // START (Code C)  105
            ];
            common.stopPattern = '2331112';
            common.Code128Sym = {
                CodeC: 99,
                CodeB: 100,
                CodeA: 101,
                FNC1: 102,
                FNC2: 97,
                FNC3: 96,
                StartA: 103,
                StartB: 104,
                StartC: 105
            };
            common.Code128Char = {
                CodeC: String.fromCharCode(204),
                CodeB: String.fromCharCode(205),
                CodeA: String.fromCharCode(206),
                FNC1: wijmo.barcode.Constants.FNC1,
                FNC2: wijmo.barcode.Constants.FNC2,
                FNC3: wijmo.barcode.Constants.FNC3,
                StartA: String.fromCharCode(208),
                StartB: String.fromCharCode(209),
                StartC: String.fromCharCode(210)
            };
            function getCharValue(str, table) {
                if (str === common.Code128Char.FNC1) {
                    return common.Code128Sym.FNC1;
                }
                else if (str === common.Code128Char.FNC2) {
                    return common.Code128Sym.FNC2;
                }
                else if (str === common.Code128Char.FNC3) {
                    return common.Code128Sym.FNC3;
                }
                var value;
                switch (table) {
                    case 'A':
                        value = TableCode128A.indexOf(str);
                        return value;
                    case 'B':
                        value = TableCode128B.indexOf(str);
                        return value;
                    case 'C':
                        return +str;
                }
            }
            common.getCharValue = getCharValue;
            function getCharPattern(str, table) {
                var result = TableCode128Data[getCharValue(str, table)];
                if (!result) {
                    throw new wijmo.barcode.InvalidCharacterException(str);
                }
                return result;
            }
            common.getCharPattern = getCharPattern;
            function getPatternByIndex(index) {
                return TableCode128Data[index];
            }
            common.getPatternByIndex = getPatternByIndex;
            function encode(str) {
                var data = '';
                wijmo.barcode.Utils.str2Array(str).forEach(function (n, index) {
                    if (wijmo.barcode.Utils.isEven(index)) {
                        data += wijmo.barcode.Utils.strRepeat('1', +n);
                    }
                    else {
                        data += wijmo.barcode.Utils.strRepeat('0', +n);
                    }
                });
                return data;
            }
            common.encode = encode;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var CODE_SET_A = 'A', CODE_SET_B = 'B', CODE_SET_C = 'C';
            var Code128Auto = /** @class */ (function () {
                function Code128Auto(text, isUccEan128) {
                    if (isUccEan128 === void 0) { isUccEan128 = false; }
                    this.text = text;
                    this.isUccEan128 = isUccEan128;
                    this.validate();
                }
                Code128Auto.prototype.validate = function () {
                    var text = this.text;
                    var reg = /^[\x00-\x7F\xC8-\xD3]+$/; //eslint-disable-line
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                };
                Code128Auto.prototype.calculateGroup = function () {
                    var _a = this, text = _a.text, isUccEan128 = _a.isUccEan128;
                    // GS1-128 (former UCC-128 or EAN-128) barcode assumes, that it started from code C: http://www.idautomation.com/barcode-faq/code-128/
                    // assume code B is default code for code128auto, we'll use this
                    var last = { code: isUccEan128 ? CODE_SET_C : CODE_SET_B, text: '' }, groups = [];
                    groups.push(last);
                    for (var i = 0, len = text.length; i < len; i++) {
                        var newCode = last.code, str = text[i];
                        // attempt to switch to code C if there 4 subsequent digits or
                        // ... stay with CodeC if there're 2 more digits
                        if (last.code !== CODE_SET_C && i + 3 < len && wijmo.barcode.Utils.isNumberLike(text.substr(i, 4)) || last.code === CODE_SET_C && i + 1 < len && wijmo.barcode.Utils.isNumberLike(text.substr(i, 2))) {
                            newCode = CODE_SET_C;
                            str += text[++i];
                        }
                        else {
                            newCode = last.code === CODE_SET_C ? CODE_SET_B : last.code;
                            if (common.getCharValue(str, newCode) < 0) {
                                newCode = last.code === CODE_SET_A ? CODE_SET_B : CODE_SET_A;
                                if (common.getCharValue(str, newCode) < 0) {
                                    continue;
                                }
                            }
                        }
                        if (last.code !== newCode) {
                            last = { code: newCode, text: str };
                            groups.push(last);
                        }
                        else {
                            last.text += str;
                        }
                    }
                    return groups.filter(function (g) { return g.text; });
                };
                Code128Auto.prototype.getData = function () {
                    var groups = this.calculateGroup();
                    var checkDigit = this.checksum(groups);
                    var data = '';
                    groups.forEach(function (g, i) {
                        if (i === 0) {
                            var pattern = common.getPatternByIndex(common.Code128Sym['Start' + g.code]);
                            data += common.encode(pattern);
                        }
                        else {
                            var pattern = common.getPatternByIndex(common.Code128Sym['Code' + g.code]);
                            data += common.encode(pattern);
                        }
                        if (g.code === CODE_SET_C) {
                            wijmo.barcode.Utils.sliceString(g.text, 2, function (char) {
                                data += common.encode(common.getCharPattern(char, g.code));
                            });
                        }
                        else {
                            wijmo.barcode.Utils.sliceString(g.text, 1, function (char) {
                                data += common.encode(common.getCharPattern(char, g.code));
                            });
                        }
                    });
                    data += common.encode(common.getPatternByIndex(checkDigit));
                    data += common.encode(common.stopPattern);
                    return data;
                };
                Code128Auto.prototype.checksum = function (groups) {
                    var weight = 0, sum = 0;
                    groups.forEach(function (chunk, i) {
                        var code = chunk.code, text = chunk.text;
                        if (i === 0) {
                            sum += common.Code128Sym['Start' + code];
                        }
                        else {
                            var value = common.Code128Sym['Code' + code];
                            sum += value * ++weight;
                        }
                        if (code === CODE_SET_C) {
                            wijmo.barcode.Utils.sliceString(text, 2, function (char) {
                                sum += common.getCharValue(char, code) * (++weight);
                            });
                        }
                        else {
                            wijmo.barcode.Utils.sliceString(text, 1, function (char) {
                                sum += common.getCharValue(char, code) * (++weight);
                            });
                        }
                    });
                    return sum % 103;
                };
                return Code128Auto;
            }());
            common.Code128Auto = Code128Auto;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var Code128C = /** @class */ (function () {
                function Code128C(text) {
                    this.text = text;
                    this.validate();
                }
                Code128C.prototype.validate = function () {
                    var text = this.text;
                    var reg = /^(\xCF*[0-9]{2}\xCF*)+$/; //eslint-disable-line
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                };
                Code128C.prototype.getData = function () {
                    var text = this.text;
                    var checkDigit = this.checksum();
                    var data = '';
                    var startPattern = common.getPatternByIndex(common.Code128Sym.StartC);
                    data += common.encode(startPattern);
                    wijmo.barcode.Utils.sliceString(text, 2, function (char) {
                        var pattern = common.getCharPattern(char, 'C');
                        data += common.encode(pattern);
                    });
                    data += common.encode(common.getPatternByIndex(checkDigit));
                    data += common.encode(common.stopPattern);
                    return data;
                };
                Code128C.prototype.checksum = function () {
                    var text = this.text;
                    var weight = 0, sum = 0;
                    wijmo.barcode.Utils.sliceString(text, 2, function (char) {
                        sum += common.getCharValue(char, 'C') * (++weight);
                    });
                    sum += common.Code128Sym.StartC;
                    return sum % 103;
                };
                return Code128C;
            }());
            common.Code128C = Code128C;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var Code128B = /** @class */ (function () {
                function Code128B(text) {
                    this.text = text;
                    this.validate();
                }
                Code128B.prototype.validate = function () {
                    var text = this.text;
                    var reg = /^[\x20-\x7F\xC8-\xCF]+$/; //eslint-disable-line
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                };
                Code128B.prototype.getData = function () {
                    var text = this.text;
                    var checkDigit = this.checksum();
                    var data = '';
                    var startPattern = common.getPatternByIndex(common.Code128Sym.StartB);
                    data += common.encode(startPattern);
                    wijmo.barcode.Utils.sliceString(text, 1, function (char) {
                        var pattern = common.getCharPattern(char, 'B');
                        data += common.encode(pattern);
                    });
                    data += common.encode(common.getPatternByIndex(checkDigit));
                    data += common.encode(common.stopPattern);
                    return data;
                };
                Code128B.prototype.checksum = function () {
                    var text = this.text;
                    var weight = 0, sum = 0;
                    wijmo.barcode.Utils.sliceString(text, 1, function (char) {
                        sum += common.getCharValue(char, 'B') * (++weight);
                    });
                    sum += common.Code128Sym.StartB;
                    return sum % 103;
                };
                return Code128B;
            }());
            common.Code128B = Code128B;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var Code128A = /** @class */ (function () {
                function Code128A(text) {
                    this.text = text;
                    this.validate();
                }
                Code128A.prototype.validate = function () {
                    var text = this.text;
                    var reg = /^[\x00-\x5F\xC8-\xCF]+$/; //eslint-disable-line
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                };
                Code128A.prototype.getData = function () {
                    var text = this.text;
                    var checkDigit = this.checksum();
                    var data = '';
                    var startPattern = common.getPatternByIndex(common.Code128Sym.StartA);
                    data += common.encode(startPattern);
                    wijmo.barcode.Utils.sliceString(text, 1, function (char) {
                        var pattern = common.getCharPattern(char, 'A');
                        data += common.encode(pattern);
                    });
                    data += common.encode(common.getPatternByIndex(checkDigit));
                    data += common.encode(common.stopPattern);
                    return data;
                };
                Code128A.prototype.checksum = function () {
                    var text = this.text;
                    var weight = 0, sum = 0;
                    wijmo.barcode.Utils.sliceString(text, 1, function (char) {
                        sum += common.getCharValue(char, 'A') * (++weight);
                    });
                    sum += common.Code128Sym.StartA;
                    return sum % 103;
                };
                return Code128A;
            }());
            common.Code128A = Code128A;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var Code128Encoder = /** @class */ (function (_super) {
                __extends(Code128Encoder, _super);
                function Code128Encoder(option, isUccEan128) {
                    if (isUccEan128 === void 0) { isUccEan128 = false; }
                    var _this = this;
                    option.merge(Code128Encoder.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var text = _this.encodeConfig.text;
                    _this.isUccEan128 = isUccEan128;
                    if (isUccEan128 && text[0] !== common.Code128Char.FNC1) {
                        text = common.Code128Char.FNC1 + text;
                    }
                    _this.text = text;
                    _this.label = text.replace(/[^\x20-\x7E]/g, '');
                    return _this;
                }
                Code128Encoder.prototype.validate = function () {
                    return;
                };
                Code128Encoder.prototype.calculateData = function () {
                    var _a = this, codeSet = _a.config.codeSet, text = _a.text, isUccEan128 = _a.isUccEan128;
                    var innerEncoder;
                    if (isUccEan128) {
                        innerEncoder = new common.Code128Auto(text);
                    }
                    else {
                        switch (codeSet) {
                            case 'A':
                                innerEncoder = new common.Code128A(text);
                                break;
                            case 'B':
                                innerEncoder = new common.Code128B(text);
                                break;
                            case 'C':
                                innerEncoder = new common.Code128C(text);
                                break;
                            default:
                                innerEncoder = new common.Code128Auto(text);
                        }
                    }
                    return innerEncoder.getData();
                };
                Code128Encoder.DefaultConfig = {
                    codeSet: 'auto',
                    quietZone: {
                        right: 10,
                        left: 10
                    },
                };
                return Code128Encoder;
            }(wijmo.barcode.OneDimensionalBarcode));
            common.Code128Encoder = Code128Encoder;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var GS1_128Encoder = /** @class */ (function (_super) {
                __extends(GS1_128Encoder, _super);
                function GS1_128Encoder(option) {
                    return _super.call(this, option, true) || this;
                }
                return GS1_128Encoder;
            }(common.Code128Encoder));
            common.GS1_128Encoder = GS1_128Encoder;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            wijmo.barcode.Barcode.registerEncoder('GS1_128', common.GS1_128Encoder);
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            wijmo.barcode.Barcode.registerEncoder('Code128', common.Code128Encoder);
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var EncodeTable_Code39 = /** @class */ (function () {
                function EncodeTable_Code39() {
                }
                EncodeTable_Code39.getMod43Val = function (text) {
                    var sum = 0;
                    wijmo.barcode.Utils.sliceString(text, 1, function (char) {
                        sum += EncodeTable_Code39.MODULO_43_CHECK_TABLE.indexOf(char);
                    });
                    return EncodeTable_Code39.MODULO_43_CHECK_TABLE[sum % 43];
                };
                EncodeTable_Code39.getFullASCIIChar = function (text) {
                    var str = '';
                    wijmo.barcode.Utils.sliceString(text, 1, function (char) {
                        var c = EncodeTable_Code39.FULL_ASCII_TABLE[char.charCodeAt(0)];
                        if (c) {
                            str += c;
                        }
                        else {
                            throw new wijmo.barcode.InvalidTextException(text);
                        }
                    });
                    return str;
                };
                EncodeTable_Code39.TABLE = {
                    '0': '000110100',
                    '1': '100100001',
                    '2': '001100001',
                    '3': '101100000',
                    '4': '000110001',
                    '5': '100110000',
                    '6': '001110000',
                    '7': '000100101',
                    '8': '100100100',
                    '9': '001100100',
                    'A': '100001001',
                    'B': '001001001',
                    'C': '101001000',
                    'D': '000011001',
                    'E': '100011000',
                    'F': '001011000',
                    'G': '000001101',
                    'H': '100001100',
                    'I': '001001100',
                    'J': '000011100',
                    'K': '100000011',
                    'L': '001000011',
                    'M': '101000010',
                    'N': '000010011',
                    'O': '100010010',
                    'P': '001010010',
                    'Q': '000000111',
                    'R': '100000110',
                    'S': '001000110',
                    'T': '000010110',
                    'U': '110000001',
                    'V': '011000001',
                    'W': '111000000',
                    'X': '010010001',
                    'Y': '110010000',
                    'Z': '011010000',
                    '-': '010000101',
                    '.': '110000100',
                    ' ': '011000100',
                    '$': '010101000',
                    '/': '010100010',
                    '+': '010001010',
                    '%': '000101010',
                    '*': '010010100'
                };
                EncodeTable_Code39.MODULO_43_CHECK_TABLE = wijmo.barcode.Utils.str2Array('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%');
                EncodeTable_Code39.FULL_ASCII_TABLE = [
                    '%U', '$A', '$B', '$C', '$D', '$E', '$F', '$G',
                    '$H', '$I', '$J', '$K', '$L', '$M', '$N', '$O',
                    '$P', '$Q', '$R', '$S', '$T', '$U', '$V', '$W',
                    '$X', '$Y', '$Z', '%A', '%B', '%C', '%D', '%E',
                    ' ', '/A', '/B', '/C', '/D', '/E', '/F', '/G',
                    '/H', '/I', '/J', '/K', '/L', '-', '.', '/O',
                    '0', '1', '2', '3', '4', '5', '6', '7',
                    '8', '9', '/Z', '%F', '%G', '%H', '%I', '%J',
                    '%V', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
                    'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
                    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
                    'X', 'Y', 'Z', '%K', '%L', '%M', '%N', '%O',
                    '%W', '+A', '+B', '+C', '+D', '+E', '+F', '+G',
                    '+H', '+I', '+J', '+K', '+L', '+M', '+N', '+O',
                    '+P', '+Q', '+R', '+S', '+T', '+U', '+V', '+W',
                    '+X', '+Y', '+Z', '%P', '%Q', '%R', '%S', '%T'
                ];
                return EncodeTable_Code39;
            }());
            common.EncodeTable_Code39 = EncodeTable_Code39;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var Code39Encoder = /** @class */ (function (_super) {
                __extends(Code39Encoder, _super);
                function Code39Encoder(option) {
                    var _this = this;
                    option.merge(Code39Encoder.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this, _b = _a.encodeConfig, text = _b.text, hideExtraChecksum = _b.hideExtraChecksum, _c = _a.config, checkDigit = _c.checkDigit, fullASCII = _c.fullASCII, nwRatio = _c.nwRatio, labelWithStartAndStopCharacter = _c.labelWithStartAndStopCharacter;
                    var _text = fullASCII ? common.EncodeTable_Code39.getFullASCIIChar(text) : text;
                    if (checkDigit) {
                        var checkDigit_1 = common.EncodeTable_Code39.getMod43Val(_text);
                        _this.text = Code39Encoder.START_STOP_CHARACTERS + _text + checkDigit_1 + Code39Encoder.START_STOP_CHARACTERS;
                        var labelWithoutPattern = hideExtraChecksum ? text : text + checkDigit_1;
                        var labelWithPattern = Code39Encoder.START_STOP_CHARACTERS + labelWithoutPattern + Code39Encoder.START_STOP_CHARACTERS;
                        _this.label = labelWithStartAndStopCharacter ? labelWithPattern : labelWithoutPattern;
                    }
                    else {
                        _this.text = Code39Encoder.START_STOP_CHARACTERS + _text + Code39Encoder.START_STOP_CHARACTERS;
                        var labelWithoutPattern = text;
                        var labelWithPattern = Code39Encoder.START_STOP_CHARACTERS + labelWithoutPattern + Code39Encoder.START_STOP_CHARACTERS;
                        _this.label = labelWithStartAndStopCharacter ? labelWithPattern : labelWithoutPattern;
                    }
                    _this.nwRatio = +nwRatio;
                    return _this;
                }
                Code39Encoder.prototype.validate = function () {
                    var _a = this, text = _a.encodeConfig.text, _b = _a.config, fullASCII = _b.fullASCII, nwRatio = _b.nwRatio;
                    //A-Z 0 - 9  space $ % + - . /
                    var reg = /^[0-9A-Z\-\.\ \$\/\+\%]+$/; //eslint-disable-line
                    if (!fullASCII && !reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                    if (nwRatio != 2 && nwRatio != 3) {
                        throw new wijmo.barcode.InvalidOptionsException({ nwRatio: nwRatio }, 'NwRatio is 2 or 3');
                    }
                };
                Code39Encoder.prototype.encode = function (str) {
                    var nwRatio = this.nwRatio;
                    var data = '';
                    var pattern1 = wijmo.barcode.Utils.strRepeat('1', nwRatio);
                    var pattern0 = wijmo.barcode.Utils.strRepeat('0', nwRatio);
                    wijmo.barcode.Utils.str2Array(str).forEach(function (item, index) {
                        if (wijmo.barcode.Utils.isEven(index)) {
                            if (item === '1') {
                                data += pattern1;
                            }
                            else {
                                data += '1';
                            }
                        }
                        else {
                            if (item === '1') {
                                data += pattern0;
                            }
                            else {
                                data += '0';
                            }
                        }
                    });
                    return data;
                };
                Code39Encoder.prototype.calculateData = function () {
                    var _this = this;
                    var text = this.text;
                    var data = '';
                    wijmo.barcode.Utils.sliceString(text, 1, function (char) {
                        data = data + _this.encode(common.EncodeTable_Code39.TABLE[char]) + '0';
                    });
                    data = data.substr(0, data.length - 1);
                    return data;
                };
                Code39Encoder.DefaultConfig = {
                    checkDigit: false,
                    fullASCII: false,
                    nwRatio: 3,
                    labelWithStartAndStopCharacter: false,
                    quietZone: {
                        right: 10,
                        left: 10
                    }
                };
                Code39Encoder.START_STOP_CHARACTERS = '*';
                return Code39Encoder;
            }(wijmo.barcode.OneDimensionalBarcode));
            common.Code39Encoder = Code39Encoder;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            wijmo.barcode.Barcode.registerEncoder('Code39', common.Code39Encoder);
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var EncodeTable = /** @class */ (function () {
                function EncodeTable() {
                }
                EncodeTable.encodeCharByTable = function (char, tableName) {
                    return EncodeTable.TABLE[tableName][char];
                };
                EncodeTable.encodeByStructure = function (text, structure) {
                    var texts = wijmo.barcode.Utils.str2Array(text);
                    return texts.reduce(function (result, char, index) {
                        result += EncodeTable.encodeCharByTable(char, structure[index]);
                        return result;
                    }, '');
                };
                EncodeTable.encodeByTable = function (text, tableName) {
                    if (text.length > 1) {
                        var texts = wijmo.barcode.Utils.str2Array(text);
                        return texts.reduce(function (result, char) {
                            result += EncodeTable.encodeCharByTable(char, tableName);
                            return result;
                        }, '');
                    }
                    return EncodeTable.encodeCharByTable(text, tableName);
                };
                EncodeTable.TABLE = {
                    A: [
                        '0001101',
                        '0011001',
                        '0010011',
                        '0111101',
                        '0100011',
                        '0110001',
                        '0101111',
                        '0111011',
                        '0110111',
                        '0001011'
                    ],
                    B: [
                        '0100111',
                        '0110011',
                        '0011011',
                        '0100001',
                        '0011101',
                        '0111001',
                        '0000101',
                        '0010001',
                        '0001001',
                        '0010111'
                    ],
                    C: [
                        '1110010',
                        '1100110',
                        '1101100',
                        '1000010',
                        '1011100',
                        '1001110',
                        '1010000',
                        '1000100',
                        '1001000',
                        '1110100'
                    ]
                };
                return EncodeTable;
            }());
            common.EncodeTable = EncodeTable;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var AddOnSymbol = /** @class */ (function () {
                function AddOnSymbol(addOn, addOnHeight, isTextGroup, unitValue) {
                    this.isTextGroup = isTextGroup;
                    this.addOn = '' + addOn;
                    if (addOnHeight !== 'auto') {
                        if (wijmo.barcode.Utils.isNumberLike(addOnHeight)) {
                            addOnHeight = +addOnHeight;
                        }
                        else {
                            addOnHeight = wijmo.barcode.Utils.convertUnit(wijmo.barcode.Utils.fixSize2PixelDefault(addOnHeight));
                            addOnHeight = addOnHeight / unitValue;
                        }
                    }
                    this.addOnHeight = addOnHeight;
                    this.validate();
                }
                AddOnSymbol.get2DigitAddOnTable = function (num) {
                    num = parseInt(num);
                    switch (num % 4) {
                        case 0:
                            return { leftStructure: 'A', rightStructure: 'A' };
                        case 1:
                            return { leftStructure: 'A', rightStructure: 'B' };
                        case 2:
                            return { leftStructure: 'B', rightStructure: 'A' };
                        case 3:
                            return { leftStructure: 'B', rightStructure: 'B' };
                    }
                };
                AddOnSymbol.get5DigitAddOnTable = function (num) {
                    num += '';
                    var a = (+num[0]) + (+num[2]) + (+num[4]);
                    var b = 3 * a;
                    var c = (+num[1]) + (+num[3]);
                    var d = 9 * c;
                    var e = b + d;
                    return AddOnSymbol.fiveDigitAddOnStructure[e % 10];
                };
                AddOnSymbol.prototype.validate = function () {
                    var addOn = this.addOn;
                    if (addOn.length !== 2 && addOn.length !== 5) {
                        throw new wijmo.barcode.InvalidOptionsException({ addOn: addOn }, 'Add on length should be 2 or 5.');
                    }
                };
                AddOnSymbol.prototype._encode2DigitAddOn = function () {
                    var _a = this, addOn = _a.addOn, isTextGroup = _a.isTextGroup;
                    var data = [];
                    var structure, leftBinary, rightBinary;
                    structure = AddOnSymbol.get2DigitAddOnTable(addOn);
                    leftBinary = common.EncodeTable.encodeByTable(addOn[0], structure.leftStructure[0]);
                    rightBinary = common.EncodeTable.encodeByTable(addOn[1], structure.rightStructure[0]);
                    if (isTextGroup) {
                        data.push({
                            binary: AddOnSymbol.ADD_ON_GUARD,
                            role: 'ADDON'
                        });
                        data.push({
                            binary: leftBinary,
                            text: addOn[0],
                            role: 'ADDON'
                        });
                        data.push({
                            binary: AddOnSymbol.ADD_ON_DELINEATOR,
                            role: 'ADDON'
                        });
                        data.push({
                            binary: rightBinary,
                            text: addOn[1],
                            role: 'ADDON'
                        });
                    }
                    else {
                        data.push({
                            binary: AddOnSymbol.ADD_ON_GUARD + leftBinary + AddOnSymbol.ADD_ON_DELINEATOR + rightBinary,
                            text: addOn,
                            role: 'ADDON'
                        });
                    }
                    return data;
                };
                AddOnSymbol.prototype._encode5DigitAddOn = function () {
                    var _a = this, addOn = _a.addOn, isTextGroup = _a.isTextGroup;
                    var data = [];
                    var structure = AddOnSymbol.get5DigitAddOnTable(addOn);
                    if (isTextGroup) {
                        data.push({
                            binary: AddOnSymbol.ADD_ON_GUARD,
                            role: 'ADDON'
                        });
                        wijmo.barcode.Utils.str2Array(addOn).forEach(function (char, index) {
                            data.push({
                                binary: common.EncodeTable.encodeByTable(char, structure[index]),
                                text: char,
                                role: 'ADDON'
                            });
                            if (index < addOn.length - 1) {
                                data.push({
                                    binary: AddOnSymbol.ADD_ON_DELINEATOR,
                                    role: 'ADDON'
                                });
                            }
                        });
                    }
                    else {
                        var binary = wijmo.barcode.Utils.str2Array(addOn).reduce(function (result, char, index) {
                            result += common.EncodeTable.encodeByTable(char, structure[index]);
                            if (index < addOn.length - 1) {
                                result += AddOnSymbol.ADD_ON_DELINEATOR;
                            }
                            return result;
                        }, '');
                        data.push({
                            binary: AddOnSymbol.ADD_ON_GUARD + binary,
                            text: addOn,
                            role: 'ADDON'
                        });
                    }
                    return data;
                };
                AddOnSymbol.prototype.calculateData = function () {
                    var addOn = this.addOn;
                    var data = [];
                    if (addOn.length === 2) {
                        data = this._encode2DigitAddOn();
                    }
                    else if (addOn.length === 5) {
                        data = this._encode5DigitAddOn();
                    }
                    data.push({
                        text: '>',
                        role: 'ADDON_RIGHT_QUIET_ZONE'
                    });
                    return data;
                };
                AddOnSymbol.fiveDigitAddOnStructure = [
                    'BBAAA', 'BABAA', 'BAABA', 'BAAAB', 'ABBAA', 'AABBA', 'AAABB', 'ABABA', 'ABAAB', 'AABAB'
                ];
                AddOnSymbol.ADD_ON_GUARD = '1011';
                AddOnSymbol.ADD_ON_DELINEATOR = '01';
                return AddOnSymbol;
            }());
            common.AddOnSymbol = AddOnSymbol;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var EANBase = /** @class */ (function (_super) {
                __extends(EANBase, _super);
                function EANBase(option) {
                    var _this = this;
                    option.merge(EANBase.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this, _b = _a.style, textAlign = _b.textAlign, unitValue = _b.unitValue, _c = _a.config, addOnLabelPosition = _c.addOnLabelPosition, addOn = _c.addOn, addOnHeight = _c.addOnHeight;
                    _this.isTextGroup = textAlign === 'group';
                    _this.isAddOnLabelBottom = addOnLabelPosition !== 'top';
                    _this._setAddOn(addOn, addOnHeight, unitValue);
                    return _this;
                }
                EANBase.prototype._setAddOn = function (addOn, addOnHeight, unitValue) {
                    if (wijmo.barcode.Utils.isDefined(addOn)) {
                        this.addOn = new common.AddOnSymbol(addOn, addOnHeight, this.isTextGroup, unitValue);
                        this.addOnHeight = this.addOn.addOnHeight;
                    }
                    else {
                        this.addOnHeight = 0;
                    }
                };
                EANBase.prototype.checksum = function (number, evenMultiply3) {
                    if (evenMultiply3 === void 0) { evenMultiply3 = false; }
                    var numberArray = wijmo.barcode.Utils.str2Array(number);
                    var fn = evenMultiply3 ? wijmo.barcode.Utils.isOdd : wijmo.barcode.Utils.isEven;
                    var sum = numberArray.reduce(function (sum, num, index) {
                        num = +num;
                        sum += fn(index) ? num : num * 3;
                        return sum;
                    }, 0);
                    var remainder = sum % 10;
                    if (remainder === 0) {
                        return 0;
                    }
                    return 10 - remainder;
                };
                EANBase.prototype.convertToShape = function (data) {
                    var _a = this, isTextGroup = _a.isTextGroup, addOnHeight = _a.addOnHeight, isAddOnLabelBottom = _a.isAddOnLabelBottom, textAlign = _a.style.textAlign, _b = _a.encodeConfig, isLabelBottom = _b.isLabelBottom, height = _b.height, quietZone = _b.quietZone, showLabel = _b.showLabel, fontSizeInUnit = _b.fontSizeInUnit;
                    if (!showLabel) {
                        fontSizeInUnit = 0;
                    }
                    addOnHeight = addOnHeight || 0;
                    var shapes = [];
                    var guardHeight;
                    var startX = quietZone.left, startY = quietZone.top, textY, totalMainHeight, addOnY, addOnLabelY, addOnBarHeight, totalAddOnHeight;
                    if (isLabelBottom) {
                        guardHeight = height + 5;
                        textY = startY + height;
                        totalMainHeight = showLabel ? (height + fontSizeInUnit) : guardHeight;
                        if (isAddOnLabelBottom) {
                            addOnY = startY;
                            if (addOnHeight === 'auto') {
                                addOnBarHeight = showLabel ? height : guardHeight;
                            }
                            else {
                                addOnBarHeight = addOnHeight;
                            }
                            addOnLabelY = addOnY + addOnBarHeight;
                        }
                        else {
                            addOnLabelY = startY;
                            addOnY = startY + fontSizeInUnit;
                            if (addOnHeight === 'auto') {
                                addOnBarHeight = guardHeight - fontSizeInUnit;
                            }
                            else {
                                addOnBarHeight = addOnHeight;
                            }
                        }
                    }
                    else {
                        guardHeight = height;
                        height = height - 5;
                        textY = startY;
                        startY = startY + fontSizeInUnit;
                        totalMainHeight = showLabel ? (guardHeight + fontSizeInUnit) : guardHeight;
                        if (isAddOnLabelBottom) {
                            addOnY = quietZone.top;
                            if (addOnHeight === 'auto') {
                                addOnBarHeight = showLabel ? height : guardHeight;
                            }
                            else {
                                addOnBarHeight = addOnHeight;
                            }
                            addOnLabelY = addOnY + addOnBarHeight;
                        }
                        else {
                            addOnLabelY = quietZone.top;
                            addOnY = quietZone.top + fontSizeInUnit;
                            if (addOnHeight === 'auto') {
                                addOnBarHeight = guardHeight;
                            }
                            else {
                                addOnBarHeight = addOnHeight;
                            }
                        }
                    }
                    totalAddOnHeight = showLabel ? (addOnBarHeight + fontSizeInUnit) : addOnBarHeight;
                    data.forEach(function (item) {
                        var y0 = startY, h = height, textY0 = textY, _textAlign = isTextGroup ? 'center' : textAlign, width, textX = startX;
                        switch (item.role) {
                            case 'GUARD':
                                h = guardHeight;
                                width = item.binary.length;
                                break;
                            case 'ADDON':
                                y0 = addOnY;
                                h = addOnBarHeight;
                                textY0 = addOnLabelY;
                                width = item.binary.length;
                                break;
                            case 'LEFT_QUIET_ZONE':
                                _textAlign = 'left';
                                width = quietZone.left;
                                textX = 0;
                                break;
                            case 'RIGHT_QUIET_ZONE':
                            case 'NO_ADDON_RIGHT_QUIET_ZONE':
                                _textAlign = 'right';
                                width = quietZone.right;
                                break;
                            case 'ADDON_QUIET_ZONE':
                                width = quietZone.addOn;
                                break;
                            case 'ADDON_RIGHT_QUIET_ZONE':
                                _textAlign = 'right';
                                textY0 = addOnLabelY;
                                width = quietZone.right;
                                break;
                            default:
                                width = item.binary.length;
                        }
                        if (showLabel && item.text) {
                            switch (_textAlign) {
                                case 'center':
                                    textX += width / 2;
                                    break;
                                case 'right':
                                    textX += width;
                                    break;
                                default:
                            }
                            var textShape = {
                                type: 'text',
                                x: textX,
                                y: textY0,
                                text: item.text,
                                textAlign: _textAlign,
                                maxWidth: width
                            };
                            if (item.role === 'NO_ADDON_RIGHT_QUIET_ZONE' || item.role === 'ADDON_RIGHT_QUIET_ZONE') {
                                textShape.fontStyle = 'normal';
                                textShape.fontWeight = 'normal';
                                textShape.textDecoration = 'none';
                            }
                            shapes.push(textShape);
                        }
                        if (item.binary) {
                            wijmo.barcode.Utils.combineTruthy(item.binary)
                                .forEach(function (num) {
                                if (num !== 0) {
                                    shapes.push({
                                        type: 'rect',
                                        x: startX,
                                        y: y0,
                                        width: num,
                                        height: h
                                    });
                                    startX += num;
                                }
                                else {
                                    startX++;
                                }
                            });
                        }
                        else {
                            if (item.role === 'ADDON_QUIET_ZONE') {
                                startX += width;
                            }
                        }
                    });
                    this.size = {
                        width: startX + quietZone.right,
                        height: Math.max(totalMainHeight, totalAddOnHeight) + quietZone.top + quietZone.bottom
                    };
                    this.shapes = shapes;
                };
                EANBase.prototype.afterApplyDesiredSize = function () {
                    var _a = this, _b = _a.config, addOn = _b.addOn, addOnHeight = _b.addOnHeight, unitValue = _a.style.unitValue;
                    this._setAddOn(addOn, addOnHeight, unitValue);
                    if (this.addOnHeight > this.encodeConfig.height) {
                        this.addOnHeight = this.encodeConfig.height;
                    }
                };
                EANBase.NORMAL_GUARD = '101';
                EANBase.CENTRE_GUARD = '01010';
                EANBase.DefaultConfig = {
                    quietZone: {
                        right: 7,
                        left: 11,
                    },
                };
                return EANBase;
            }(wijmo.barcode.OneDimensionalBarcode));
            common.EANBase = EANBase;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var UPC_E = /** @class */ (function (_super) {
                __extends(UPC_E, _super);
                function UPC_E(option, prefix, tableStructure) {
                    var _this = this;
                    option.merge(UPC_E.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this.encodeConfig, text = _a.text, hideExtraChecksum = _a.hideExtraChecksum;
                    _this.prefix = prefix;
                    var label = text;
                    if (text.length < 7) {
                        text += _this.checksum(text);
                        if (!hideExtraChecksum) {
                            label = text;
                        }
                    }
                    _this.label = label;
                    _this.text = text;
                    _this.tableStructure = tableStructure;
                    return _this;
                }
                UPC_E.prototype.validate = function () {
                    var text = this.encodeConfig.text;
                    var reg = /^(\d{6}|\d{7})$/;
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text, 'Text should be numbers. The length should be 6 or 7.');
                    }
                    if (text.length === 7) {
                        var checkDigit = this.checksum(text.substr(0, 6));
                        if (checkDigit != text[6]) {
                            throw new wijmo.barcode.InvalidTextException(text, 'Check digit is invalid.');
                        }
                    }
                };
                UPC_E.prototype.checksum = function (text) {
                    var str;
                    switch (text[5]) {
                        case '0':
                        case '1':
                        case '2':
                            str = text.substr(0, 2) + text[5] + '0000' + text.substr(2, 3);
                            break;
                        case '3':
                            str = text.substr(0, 3) + '00000' + text.substr(3, 2);
                            break;
                        case '4':
                            str = text.substr(0, 4) + '00000' + text[4];
                            break;
                        default:
                            str = text.substr(0, 5) + '0000' + text[5];
                            break;
                    }
                    str = this.prefix + str;
                    return _super.prototype.checksum.call(this, str, true);
                };
                UPC_E.prototype.calculateData = function () {
                    var _a = this, text = _a.text, addOn = _a.addOn, isTextGroup = _a.isTextGroup, prefix = _a.prefix, tableStructure = _a.tableStructure, label = _a.label;
                    var checkDigit = text[6];
                    var checkDigitLabel = label[6];
                    text = text.substr(0, 6);
                    var labelWithoutCheckDigit = label.substr(0, 6);
                    var structure = tableStructure[checkDigit];
                    var data = [];
                    data.push({
                        text: prefix,
                        role: 'LEFT_QUIET_ZONE'
                    });
                    data.push({
                        binary: common.EANBase.NORMAL_GUARD,
                        role: 'GUARD'
                    });
                    if (isTextGroup) {
                        wijmo.barcode.Utils.str2Array(text).forEach(function (c, i) {
                            data.push({
                                binary: common.EncodeTable.encodeByTable(c, structure[i]),
                                text: labelWithoutCheckDigit[i]
                            });
                        });
                    }
                    else {
                        data.push({
                            binary: common.EncodeTable.encodeByStructure(text, structure),
                            text: labelWithoutCheckDigit
                        });
                    }
                    data.push({
                        binary: UPC_E.SPECIAL_GUARD,
                        role: 'GUARD'
                    });
                    if (!addOn) {
                        data.push({
                            text: checkDigitLabel,
                            role: 'NO_ADDON_RIGHT_QUIET_ZONE'
                        });
                    }
                    else {
                        data.push({
                            text: checkDigitLabel,
                            role: 'ADDON_QUIET_ZONE'
                        });
                        data = data.concat(addOn.calculateData());
                    }
                    return data;
                };
                UPC_E.DefaultConfig = {
                    addOnHeight: 'auto',
                    addOnLabelPosition: 'top',
                    quietZone: {
                        left: 9,
                        addOn: 5
                    },
                };
                UPC_E.SPECIAL_GUARD = '010101';
                return UPC_E;
            }(common.EANBase));
            common.UPC_E = UPC_E;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var UPC_E1_Encoder = /** @class */ (function (_super) {
                __extends(UPC_E1_Encoder, _super);
                function UPC_E1_Encoder(option) {
                    return _super.call(this, option, '1', UPC_E1_Encoder.structure) || this;
                }
                UPC_E1_Encoder.structure = [
                    'AAABBB',
                    'AABABB',
                    'AABBAB',
                    'AABBBA',
                    'ABAABB',
                    'ABBAAB',
                    'ABBBAA',
                    'ABABAB',
                    'ABABBA',
                    'ABBABA',
                ];
                return UPC_E1_Encoder;
            }(common.UPC_E));
            common.UPC_E1_Encoder = UPC_E1_Encoder;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var UPC_E0_Encoder = /** @class */ (function (_super) {
                __extends(UPC_E0_Encoder, _super);
                function UPC_E0_Encoder(option) {
                    return _super.call(this, option, '0', UPC_E0_Encoder.structure) || this;
                }
                UPC_E0_Encoder.structure = [
                    'BBBAAA',
                    'BBABAA',
                    'BBAABA',
                    'BBAAAB',
                    'BABBAA',
                    'BAABBA',
                    'BAAABB',
                    'BABABA',
                    'BABAAB',
                    'BAABAB',
                ];
                return UPC_E0_Encoder;
            }(common.UPC_E));
            common.UPC_E0_Encoder = UPC_E0_Encoder;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var UPC_A_Encoder = /** @class */ (function (_super) {
                __extends(UPC_A_Encoder, _super);
                function UPC_A_Encoder(option) {
                    var _this = this;
                    option.merge(UPC_A_Encoder.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this.encodeConfig, text = _a.text, hideExtraChecksum = _a.hideExtraChecksum;
                    var label = text;
                    if (text.length < 12) {
                        text += _this.checksum(text, true);
                        if (!hideExtraChecksum) {
                            label = text;
                        }
                    }
                    _this.label = label;
                    _this.text = text;
                    return _this;
                }
                UPC_A_Encoder.prototype.validate = function () {
                    var text = this.encodeConfig.text;
                    var reg = /^(\d{11}|\d{12})$/;
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text, 'Text should be numbers. The length should be 11 or 12.');
                    }
                    if (text.length === 12) {
                        var checkDigit = this.checksum(text.substr(0, 11), true);
                        if (checkDigit != text[11]) {
                            throw new wijmo.barcode.InvalidTextException(text, 'Check digit is invalid.');
                        }
                    }
                };
                UPC_A_Encoder.prototype.calculateData = function () {
                    var _a = this, text = _a.text, addOn = _a.addOn, isTextGroup = _a.isTextGroup, label = _a.label;
                    var firstNumber = text[0];
                    var lastNumber = text[11];
                    var lastLabel = label[11];
                    var leftStr = text.substr(1, 5);
                    var rightStr = text.substr(6, 5);
                    var leftLabel = label.substr(1, 5);
                    var rightLabel = label.substr(6, 5);
                    var data = [];
                    data.push({
                        text: firstNumber,
                        role: 'LEFT_QUIET_ZONE'
                    });
                    data.push({
                        binary: common.EANBase.NORMAL_GUARD + common.EncodeTable.encodeByTable(firstNumber, 'A'),
                        role: 'GUARD'
                    });
                    if (isTextGroup) {
                        wijmo.barcode.Utils.str2Array(leftStr).forEach(function (c, i) {
                            data.push({
                                binary: common.EncodeTable.encodeByTable(c, 'A'),
                                text: leftLabel[i]
                            });
                        });
                    }
                    else {
                        data.push({
                            binary: common.EncodeTable.encodeByTable(leftStr, 'A'),
                            text: leftLabel
                        });
                    }
                    data.push({
                        binary: common.EANBase.CENTRE_GUARD,
                        role: 'GUARD'
                    });
                    if (isTextGroup) {
                        wijmo.barcode.Utils.str2Array(rightStr).forEach(function (c, i) {
                            data.push({
                                binary: common.EncodeTable.encodeByTable(c, 'C'),
                                text: rightLabel[i]
                            });
                        });
                    }
                    else {
                        data.push({
                            binary: common.EncodeTable.encodeByTable(rightStr, 'C'),
                            text: rightLabel
                        });
                    }
                    data.push({
                        binary: common.EncodeTable.encodeByTable(lastNumber, 'C') + common.EANBase.NORMAL_GUARD,
                        role: 'GUARD'
                    });
                    if (!addOn) {
                        data.push({
                            text: lastLabel,
                            role: 'NO_ADDON_RIGHT_QUIET_ZONE'
                        });
                    }
                    else {
                        data.push({
                            text: lastLabel,
                            role: 'ADDON_QUIET_ZONE'
                        });
                        data = data.concat(addOn.calculateData());
                    }
                    return data;
                };
                UPC_A_Encoder.DefaultConfig = {
                    addOnHeight: 'auto',
                    addOnLabelPosition: 'top',
                    quietZone: {
                        right: 9,
                        left: 9,
                        addOn: 5,
                    },
                };
                return UPC_A_Encoder;
            }(common.EANBase));
            common.UPC_A_Encoder = UPC_A_Encoder;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            wijmo.barcode.Barcode.registerEncoder('UPC-A', common.UPC_A_Encoder);
            wijmo.barcode.Barcode.registerEncoder('UPC-E0', common.UPC_E0_Encoder);
            wijmo.barcode.Barcode.registerEncoder('UPC-E1', common.UPC_E1_Encoder);
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var EAN13Encoder = /** @class */ (function (_super) {
                __extends(EAN13Encoder, _super);
                function EAN13Encoder(option) {
                    var _this = this;
                    option.merge(EAN13Encoder.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this.encodeConfig, text = _a.text, hideExtraChecksum = _a.hideExtraChecksum;
                    var label = text;
                    if (text.length < 13) {
                        text += _this.checksum(text);
                        if (!hideExtraChecksum) {
                            label = text;
                        }
                    }
                    _this.label = label;
                    _this.text = text;
                    return _this;
                }
                EAN13Encoder.prototype.validate = function () {
                    var text = this.encodeConfig.text;
                    //first char is 1-9
                    var reg = /^[1-9](\d{11}|\d{12})$/;
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text, 'Text should be numbers. And it should not start with 0. The length should be 12 or 13.');
                    }
                    if (text.length === 13) {
                        var checkDigit = this.checksum(text.substr(0, 12));
                        if (checkDigit != text[12]) {
                            throw new wijmo.barcode.InvalidTextException(text, 'Check digit is invalid.');
                        }
                    }
                };
                EAN13Encoder.prototype.calculateData = function () {
                    var _a = this, text = _a.text, addOn = _a.addOn, isTextGroup = _a.isTextGroup, label = _a.label;
                    var leftStr = text.substr(1, 6);
                    var rightStr = text.substr(7, 6);
                    var leftLabel = label.substr(1, 6);
                    var rightLabel = label.substr(7, 6);
                    var leftStructure = EAN13Encoder.leftStructure[text[0]];
                    var data = [];
                    data.push({
                        text: text[0],
                        role: 'LEFT_QUIET_ZONE'
                    });
                    data.push({
                        binary: common.EANBase.NORMAL_GUARD,
                        role: 'GUARD'
                    });
                    if (isTextGroup) {
                        wijmo.barcode.Utils.str2Array(leftStr).forEach(function (c, i) {
                            data.push({
                                binary: common.EncodeTable.encodeByTable(c, leftStructure[i]),
                                text: leftLabel[i]
                            });
                        });
                    }
                    else {
                        data.push({
                            binary: common.EncodeTable.encodeByStructure(leftStr, leftStructure),
                            text: leftLabel
                        });
                    }
                    data.push({
                        binary: common.EANBase.CENTRE_GUARD,
                        role: 'GUARD'
                    });
                    if (isTextGroup) {
                        wijmo.barcode.Utils.str2Array(rightStr).forEach(function (c, i) {
                            data.push({
                                binary: common.EncodeTable.encodeByTable(c, 'C'),
                                text: rightLabel[i]
                            });
                        });
                    }
                    else {
                        data.push({
                            binary: common.EncodeTable.encodeByTable(rightStr, 'C'),
                            text: rightLabel
                        });
                    }
                    data.push({
                        binary: common.EANBase.NORMAL_GUARD,
                        role: 'GUARD'
                    });
                    if (!addOn) {
                        data.push({
                            text: '>',
                            role: 'NO_ADDON_RIGHT_QUIET_ZONE'
                        });
                    }
                    else {
                        data.push({
                            role: 'ADDON_QUIET_ZONE'
                        });
                        data = data.concat(addOn.calculateData());
                    }
                    return data;
                };
                EAN13Encoder.leftStructure = [
                    'AAAAAA',
                    'AABABB',
                    'AABBAB',
                    'AABBBA',
                    'ABAABB',
                    'ABBAAB',
                    'ABBBAA',
                    'ABABAB',
                    'ABABBA',
                    'ABBABA'
                ];
                EAN13Encoder.DefaultConfig = {
                    addOnHeight: 'auto',
                    addOnLabelPosition: 'top',
                    quietZone: {
                        addOn: 5
                    },
                };
                return EAN13Encoder;
            }(common.EANBase));
            common.EAN13Encoder = EAN13Encoder;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var EAN8Encoder = /** @class */ (function (_super) {
                __extends(EAN8Encoder, _super);
                function EAN8Encoder(option) {
                    var _this = this;
                    option.merge(EAN8Encoder.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this.encodeConfig, text = _a.text, hideExtraChecksum = _a.hideExtraChecksum;
                    var label = text;
                    if (text.length < 8) {
                        text += _this.checksum(text, true);
                        if (!hideExtraChecksum) {
                            label = text;
                        }
                    }
                    _this.label = label;
                    _this.text = text;
                    return _this;
                }
                EAN8Encoder.prototype.validate = function () {
                    var text = this.encodeConfig.text;
                    var reg = /^[0-9](\d{6}|\d{7})$/;
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text, 'Text should be numbers. The length should be 7 or 8.');
                    }
                    if (text.length === 8) {
                        var checkDigit = this.checksum(text.substr(0, 7), true);
                        if (checkDigit != text[7]) {
                            throw new wijmo.barcode.InvalidTextException(text, 'Check digit is invalid.');
                        }
                    }
                };
                EAN8Encoder.prototype.calculateData = function () {
                    var _a = this, text = _a.text, label = _a.label, isTextGroup = _a.isTextGroup;
                    var leftStr = text.substr(0, 4);
                    var rightStr = text.substr(4, 4);
                    var leftLabel = label.substr(0, 4);
                    var rightLabel = label.substr(4, 4);
                    var data = [];
                    data.push({
                        text: '<',
                        role: 'LEFT_QUIET_ZONE'
                    });
                    data.push({
                        binary: common.EANBase.NORMAL_GUARD,
                        role: 'GUARD'
                    });
                    if (isTextGroup) {
                        wijmo.barcode.Utils.str2Array(leftStr).forEach(function (c, i) {
                            data.push({
                                binary: common.EncodeTable.encodeByTable(c, 'A'),
                                text: leftLabel[i]
                            });
                        });
                    }
                    else {
                        data.push({
                            binary: common.EncodeTable.encodeByTable(leftStr, 'A'),
                            text: leftLabel
                        });
                    }
                    data.push({
                        binary: common.EANBase.CENTRE_GUARD,
                        role: 'GUARD'
                    });
                    if (isTextGroup) {
                        wijmo.barcode.Utils.str2Array(rightStr).forEach(function (c, i) {
                            data.push({
                                binary: common.EncodeTable.encodeByTable(c, 'C'),
                                text: rightLabel[i]
                            });
                        });
                    }
                    else {
                        data.push({
                            binary: common.EncodeTable.encodeByTable(rightStr, 'C'),
                            text: rightLabel
                        });
                    }
                    data.push({
                        binary: common.EANBase.NORMAL_GUARD,
                        role: 'GUARD'
                    });
                    data.push({
                        text: '>',
                        role: 'RIGHT_QUIET_ZONE'
                    });
                    return data;
                };
                EAN8Encoder.DefaultConfig = {
                    quietZone: {
                        left: 7,
                    },
                };
                return EAN8Encoder;
            }(common.EANBase));
            common.EAN8Encoder = EAN8Encoder;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            wijmo.barcode.Barcode.registerEncoder('EAN8', common.EAN8Encoder);
            wijmo.barcode.Barcode.registerEncoder('EAN13', common.EAN13Encoder);
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var REG = /^([A-D]?)([0-9\-\$\:\.\+\/]+)([A-D]?)$/; //eslint-disable-line
            var CodabarEncoder = /** @class */ (function (_super) {
                __extends(CodabarEncoder, _super);
                function CodabarEncoder(option) {
                    var _this = this;
                    option.merge(CodabarEncoder.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this, _b = _a.config, checkDigit = _b.checkDigit, nwRatio = _b.nwRatio, _c = _a.encodeConfig, text = _c.text, hideExtraChecksum = _c.hideExtraChecksum;
                    var _d = _this.getTextEntity(text), originStartPattern = _d.originStartPattern, startPattern = _d.startPattern, content = _d.content, originStopPattern = _d.originStopPattern, stopPattern = _d.stopPattern;
                    _this.label = text;
                    if (checkDigit) {
                        var checksum = _this.checksum(content);
                        _this.text = startPattern + content + checksum + stopPattern;
                        if (!hideExtraChecksum) {
                            _this.label = originStartPattern + content + checksum + originStopPattern;
                        }
                    }
                    else {
                        _this.text = startPattern + content + stopPattern;
                    }
                    _this.nwRatio = +nwRatio;
                    return _this;
                }
                CodabarEncoder.prototype.validate = function () {
                    var _a = this, nwRatio = _a.config.nwRatio, text = _a.encodeConfig.text;
                    // [0-9] - $ : / . + A B C D
                    if (!REG.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                    if (nwRatio != 2 && nwRatio != 3) {
                        throw new wijmo.barcode.InvalidOptionsException({ nwRatio: nwRatio }, 'NwRatio is 2 or 3');
                    }
                };
                CodabarEncoder.prototype.getTextEntity = function (text) {
                    var res = REG.exec(text);
                    if (!res) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                    var originStartPattern = res[1];
                    var startPattern = originStartPattern || 'A';
                    var content = res[2];
                    var originStopPattern = res[3];
                    var stopPattern = originStopPattern || 'B';
                    return { originStartPattern: originStartPattern, startPattern: startPattern, content: content, originStopPattern: originStopPattern, stopPattern: stopPattern };
                };
                CodabarEncoder.prototype.encode = function (str) {
                    var nwRatio = this.nwRatio;
                    var data = '';
                    var pattern1 = wijmo.barcode.Utils.strRepeat('1', nwRatio);
                    var pattern0 = wijmo.barcode.Utils.strRepeat('0', nwRatio);
                    wijmo.barcode.Utils.str2Array(str).forEach(function (item, index) {
                        if (wijmo.barcode.Utils.isEven(index)) {
                            if (item === '1') {
                                data += pattern1; // wide/narrow ratio
                            }
                            else {
                                data += '1';
                            }
                        }
                        else {
                            if (item === '1') {
                                data += pattern0;
                            }
                            else {
                                data += '0';
                            }
                        }
                    });
                    return data;
                };
                CodabarEncoder.prototype.calculateData = function () {
                    var _this = this;
                    var text = this.text;
                    var data = '';
                    wijmo.barcode.Utils.sliceString(text, 1, function (char) {
                        data = data + _this.encode(CodabarEncoder.TABLE[char]) + '0';
                    });
                    data = data.substr(0, data.length - 1);
                    return data;
                };
                //Luhn algorithm
                CodabarEncoder.prototype.checksum = function (text) {
                    var checksum = wijmo.barcode.Utils.str2Array(text)
                        .filter(function (ch) { return wijmo.barcode.Utils.isInteger(+ch); })
                        .reverse()
                        .reduce(function (result, ch, index) {
                        var num = wijmo.barcode.Utils.toNumber(ch);
                        if (wijmo.barcode.Utils.isEven(index)) {
                            var _num = 2 * num;
                            result += _num > 9 ? _num - 9 : _num;
                        }
                        else {
                            result += num;
                        }
                        return result;
                    }, 0) % 10;
                    if (checksum !== 0) {
                        checksum = 10 - checksum;
                    }
                    return checksum;
                };
                CodabarEncoder.DefaultConfig = {
                    checkDigit: false,
                    quietZone: {
                        right: 10,
                        left: 10
                    },
                    nwRatio: 3
                };
                CodabarEncoder.TABLE = {
                    '0': '0000011',
                    '1': '0000110',
                    '2': '0001001',
                    '3': '1100000',
                    '4': '0010010',
                    '5': '1000010',
                    '6': '0100001',
                    '7': '0100100',
                    '8': '0110000',
                    '9': '1001000',
                    '-': '0001100',
                    '$': '0011000',
                    ':': '1000101',
                    '/': '1010001',
                    '.': '1010100',
                    '+': '0010101',
                    'A': '0011010',
                    'B': '0101001',
                    'C': '0001011',
                    'D': '0001110'
                };
                return CodabarEncoder;
            }(wijmo.barcode.OneDimensionalBarcode));
            common.CodabarEncoder = CodabarEncoder;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            wijmo.barcode.Barcode.registerEncoder('Codabar', common.CodabarEncoder);
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            /**
         * Defines encoding charset type for barcode.
         */
            var QrCodeCharset;
            (function (QrCodeCharset) {
                /** Uses UTF-8 charset for encoding */
                QrCodeCharset[QrCodeCharset["Utf8"] = 0] = "Utf8";
                /** Uses Shift_JIS charset for encoding */
                QrCodeCharset[QrCodeCharset["ShiftJis"] = 1] = "ShiftJis";
            })(QrCodeCharset = common.QrCodeCharset || (common.QrCodeCharset = {}));
            /**
             * Defines QRCode Error Correction level to restore data if the code is dirty or damaged.
             * Please refer to the details about <a href="https://www.qrcode.com/en/about/error_correction.html" target="_blank">ErrorCorrectionLevel</a>
             */
            var QrCodeCorrectionLevel;
            (function (QrCodeCorrectionLevel) {
                /** It corrects code approx 7% */
                QrCodeCorrectionLevel[QrCodeCorrectionLevel["Low"] = 0] = "Low";
                /** It corrects code approx 15% */
                QrCodeCorrectionLevel[QrCodeCorrectionLevel["Medium"] = 1] = "Medium";
                /** It corrects code approx 25% */
                QrCodeCorrectionLevel[QrCodeCorrectionLevel["Quartile"] = 2] = "Quartile";
                /** It corrects code approx 30% */
                QrCodeCorrectionLevel[QrCodeCorrectionLevel["High"] = 3] = "High";
            })(QrCodeCorrectionLevel = common.QrCodeCorrectionLevel || (common.QrCodeCorrectionLevel = {}));
            /** Indicates the model style of QRCode used. */
            var QrCodeModel;
            (function (QrCodeModel) {
                /** QRCode model1:Original model. Model1 is the prototype of Model2 and
                 * Micro QR.1 to 14 versions are registered to the AIMI standard.
                */
                QrCodeModel[QrCodeModel["Model1"] = 0] = "Model1";
                /** QRCode model2:Extended model. Model2 has an alignment pattern for better
                 * position adjustment and contains larger data than Model 1.
                 * 1 to 40 version are registered to the AIMI standard.
                */
                QrCodeModel[QrCodeModel["Model2"] = 1] = "Model2";
            })(QrCodeModel = common.QrCodeModel || (common.QrCodeModel = {}));
            /**
             * Defines which code set is used to create Code128.
             * Please refer to the details about <a href="https://www.qrcode.com/en/about/error_correction.html" target="_blank">CodeSet</a>
             */
            var Code128CodeSet;
            (function (Code128CodeSet) {
                /** */
                Code128CodeSet[Code128CodeSet["Auto"] = 0] = "Auto";
                /** 128A (Code Set A) – Uses ASCII characters 00 to 95 (0–9, A–Z and control codes), special characters, and FNC 1–4 */
                Code128CodeSet[Code128CodeSet["A"] = 1] = "A";
                /** 128B (Code Set B) – Uses ASCII characters 32 to 127 (0–9, A–Z, a–z), special characters, and FNC 1–4 */
                Code128CodeSet[Code128CodeSet["B"] = 2] = "B";
                /** 128C (Code Set C) – Uses 00–99 (encodes two digits with a single code point) and FNC1 */
                Code128CodeSet[Code128CodeSet["C"] = 3] = "C";
            })(Code128CodeSet = common.Code128CodeSet || (common.Code128CodeSet = {}));
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            var _QrCodeModelConvertor = /** @class */ (function () {
                function _QrCodeModelConvertor() {
                }
                _QrCodeModelConvertor.stringToEnum = function (value) {
                    switch (value.toString()) {
                        case '1':
                            return common.QrCodeModel.Model1;
                        case '2':
                            return common.QrCodeModel.Model2;
                    }
                    throw "Unknown QRCode internal model '" + value + "'";
                };
                ;
                _QrCodeModelConvertor.enumToString = function (value) {
                    var enumStr = common.QrCodeModel[wijmo.asEnum(value, common.QrCodeModel)];
                    return enumStr.charAt(enumStr.length - 1);
                };
                return _QrCodeModelConvertor;
            }());
            common._QrCodeModelConvertor = _QrCodeModelConvertor;
            var _CharsetTypeConvertor = /** @class */ (function () {
                function _CharsetTypeConvertor() {
                }
                _CharsetTypeConvertor.stringToEnum = function (value) {
                    switch (value) {
                        case 'UTF-8':
                            return common.QrCodeCharset.Utf8;
                        case 'Shift_JIS':
                            return common.QrCodeCharset.ShiftJis;
                    }
                    throw "Unknown Barcode internal charset '" + value + "'";
                };
                ;
                _CharsetTypeConvertor.enumToString = function (value) {
                    var enumVal = wijmo.asEnum(value, common.QrCodeCharset), bcVal;
                    switch (enumVal) {
                        case common.QrCodeCharset.Utf8:
                            bcVal = 'UTF-8';
                            break;
                        case common.QrCodeCharset.ShiftJis:
                            bcVal = 'Shift_JIS';
                            break;
                    }
                    return bcVal;
                };
                return _CharsetTypeConvertor;
            }());
            common._CharsetTypeConvertor = _CharsetTypeConvertor;
            var _CorrectionLevelConvertor = /** @class */ (function () {
                function _CorrectionLevelConvertor() {
                }
                _CorrectionLevelConvertor.stringToEnum = function (value) {
                    switch (value) {
                        case 'L':
                            return common.QrCodeCorrectionLevel.Low;
                        case 'M':
                            return common.QrCodeCorrectionLevel.Medium;
                        case 'Q':
                            return common.QrCodeCorrectionLevel.Quartile;
                        case 'H':
                            return common.QrCodeCorrectionLevel.High;
                    }
                    throw "Unknown barcode internal errorCorrectionLevel '" + value + "'";
                };
                ;
                _CorrectionLevelConvertor.enumToString = function (value) {
                    return common.QrCodeCorrectionLevel[wijmo.asEnum(value, common.QrCodeCorrectionLevel)].charAt(0);
                };
                return _CorrectionLevelConvertor;
            }());
            common._CorrectionLevelConvertor = _CorrectionLevelConvertor;
            var _CodeSetTypeConvertor = /** @class */ (function () {
                function _CodeSetTypeConvertor() {
                }
                _CodeSetTypeConvertor.stringToEnum = function (value) {
                    switch (value) {
                        case 'auto':
                            return common.Code128CodeSet.Auto;
                        case 'A':
                            return common.Code128CodeSet.A;
                        case 'B':
                            return common.Code128CodeSet.B;
                        case 'C':
                            return common.Code128CodeSet.C;
                    }
                    throw "Unknown barcode internal codeSet '" + value + "'";
                };
                ;
                _CodeSetTypeConvertor.enumToString = function (value) {
                    var enumVal = wijmo.asEnum(value, common.Code128CodeSet), bcVal;
                    switch (enumVal) {
                        case common.Code128CodeSet.Auto:
                            bcVal = 'auto';
                            break;
                        case common.Code128CodeSet.A:
                        case common.Code128CodeSet.B:
                        case common.Code128CodeSet.C:
                            bcVal = common.Code128CodeSet[enumVal];
                            break;
                    }
                    return bcVal;
                };
                return _CodeSetTypeConvertor;
            }());
            common._CodeSetTypeConvertor = _CodeSetTypeConvertor;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Codabar" target="_blank">Codabar</a>
             * barcode type.
             *
             * This is a variable-width barcode, the width of which automatically changes
             * along with the length of the {@link value}. The {@link autoWidthZoom} property
             * can be used to zoom the automatically calculated width. The {@link autoWidth}
             * property can be used to disable this behavior.
             */
            var Codabar = /** @class */ (function (_super) {
                __extends(Codabar, _super);
                /**
                 * Initializes a new instance of the {@link Codabar} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function Codabar(element, option) {
                    var _this = _super.call(this, element) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-codabar');
                    _this._setAw(true);
                    _this.initialize(option);
                    return _this;
                }
                Object.defineProperty(Codabar.prototype, "autoWidth", {
                    /**
                     * Gets or sets a value indicating whether the control width should automatically
                     * change along with the {@link value} length.
                     *
                     * If you set this property value to false, you should ensure that the control has some
                     * reasonable *CSS width*.
                     *
                     * The default value for this property is **true**.
                     */
                    get: function () {
                        return this._getAw();
                    },
                    set: function (value) {
                        this._setAw(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Codabar.prototype, "autoWidthZoom", {
                    /**
                     * Gets or sets a zoom factor applied to the automatically calculated control width.
                     *
                     * This property makes effect only if the {@link autoWidth} property is set to true.
                     * It can take any numeric value equal or greater than 1.
                     *
                     * The default value for this property is **1**.
                     */
                    get: function () {
                        return this._getWzoom();
                    },
                    set: function (value) {
                        this._setWzoom(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Codabar.prototype, "showLabel", {
                    /**
                     * Indicates whether the value is rendered under the symbol.
                     *
                     * The default value for this property is <b>true</b>.
                     */
                    get: function () {
                        return this._getProp('showLabel');
                    },
                    set: function (value) {
                        this._setProp('showLabel', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Codabar.prototype, "checkDigit", {
                    /**
                     * Indicates whether the symbol needs a check digit with the Luhn algorithm.
                     *
                     * The default value for this property is <b>false</b>.
                     */
                    get: function () {
                        return this._getProp('checkDigit');
                    },
                    set: function (value) {
                        this._setProp('checkDigit', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Codabar.prototype, "labelPosition", {
                    /**
                     * Gets or sets where to render the value of the control.
                     *
                     * The default value for this property is {@link LabelPosition.Bottom}.
                     */
                    get: function () {
                        return wijmo.barcode._LabelPositionConvertor.stringToEnum(this._getProp('labelPosition'));
                    },
                    set: function (value) {
                        this._setProp('labelPosition', wijmo.barcode._LabelPositionConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Codabar.prototype, "nwRatio", {
                    /**
                     * Gets or sets the narrow and wide bar ratio of the control.
                     *
                     * The possible property values are 1:2 or 1:3.
                     * The default value for this property is {@link NarrowWideRatio.OneToThree}.
                     */
                    get: function () {
                        return wijmo.barcode._NarrowWideRatioConvertor.stringToEnum(this._getProp('nwRatio'));
                    },
                    set: function (value) {
                        this._setProp('nwRatio', wijmo.barcode._NarrowWideRatioConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Codabar.type = 'Codabar';
                return Codabar;
            }(wijmo.barcode.BarcodeBase));
            common.Codabar = Codabar;
            /**
             * Base abstract class for Ean8 and Ean13 control classes.
             */
            var EanBase = /** @class */ (function (_super) {
                __extends(EanBase, _super);
                /**
                 * Abstract class constructor, never called.
                 */
                function EanBase(element, option) {
                    var _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-ean');
                    return _this;
                }
                Object.defineProperty(EanBase.prototype, "showLabel", {
                    /**
                     * Indicates whether the value is rendered under the symbol.
                     *
                     * The default value for this property is <b>true</b>.
                     */
                    get: function () {
                        return this._getProp('showLabel');
                    },
                    set: function (value) {
                        this._setProp('showLabel', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EanBase.prototype, "labelPosition", {
                    /**
                     * Gets or sets where to render the value of the control.
                     *
                     * The default value for this property is {@link LabelPosition.Bottom}.
                     */
                    get: function () {
                        return wijmo.barcode._LabelPositionConvertor.stringToEnum(this._getProp('labelPosition'));
                    },
                    set: function (value) {
                        this._setProp('labelPosition', wijmo.barcode._LabelPositionConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                return EanBase;
            }(wijmo.barcode.BarcodeBase));
            common.EanBase = EanBase;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/EAN-8" target="_blank">EAN-8</a>
             * barcode type.
             */
            var Ean8 = /** @class */ (function (_super) {
                __extends(Ean8, _super);
                /**
                 * Initializes a new instance of the {@link Ean8} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function Ean8(element, option) {
                    var _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-ean8');
                    return _this;
                }
                Ean8.type = 'EAN8';
                return Ean8;
            }(EanBase));
            common.Ean8 = Ean8;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/International_Article_Number" target="_blank">EAN-13</a>
             * barcode type.
             */
            var Ean13 = /** @class */ (function (_super) {
                __extends(Ean13, _super);
                /**
                 * Initializes a new instance of the {@link Ean13} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function Ean13(element, options) {
                    var _this = _super.call(this, element, options) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-ean13');
                    return _this;
                }
                Object.defineProperty(Ean13.prototype, "addOn", {
                    /**
                     * Gets or sets the addOn value of the control.
                     *
                     * The possible length of this property should be 2 or 5.
                     */
                    get: function () {
                        return this._getProp('addOn');
                    },
                    set: function (value) {
                        this._setProp('addOn', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Ean13.prototype, "addOnHeight", {
                    /**
                     * Gets or sets the height of addOn symbol of the control.
                     *
                     * The default value for this property is <b>auto</b>.
                     */
                    get: function () {
                        return this._getProp('addOnHeight');
                    },
                    set: function (value) {
                        this._setProp('addOnHeight', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Ean13.prototype, "addOnLabelPosition", {
                    /**
                     * Gets or sets where to render the addOn value of the control.
                     *
                     * The default value for this property is {@link LabelPosition.Top}.
                     */
                    get: function () {
                        return wijmo.barcode._LabelPositionConvertor.stringToEnum(this._getProp('addOnLabelPosition'));
                    },
                    set: function (value) {
                        this._setProp('addOnLabelPosition', wijmo.barcode._LabelPositionConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Ean13.prototype, "quietZone", {
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
                Ean13.type = 'EAN13';
                return Ean13;
            }(EanBase));
            common.Ean13 = Ean13;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Code_39" target="_blank">Code39</a>
             * barcode type.
             *
             * This is a variable-width barcode, the width of which automatically changes
             * along with the length of the {@link value}. The {@link autoWidthZoom} property
             * can be used to zoom the automatically calculated width. The {@link autoWidth}
             * property can be used to disable this behavior.
             */
            var Code39 = /** @class */ (function (_super) {
                __extends(Code39, _super);
                /**
                 * Initializes a new instance of the {@link Code39} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function Code39(element, option) {
                    var _this = _super.call(this, element) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-code39');
                    _this._setAw(true);
                    _this.initialize(option);
                    return _this;
                }
                Object.defineProperty(Code39.prototype, "autoWidth", {
                    /**
                     * Gets or sets a value indicating whether the control width should automatically
                     * change along with the {@link value} length.
                     *
                     * If you set this property to false, you should ensure that the control has some
                     * reasonable *CSS width*.
                     *
                     * The default value for this property is **true**.
                     */
                    get: function () {
                        return this._getAw();
                    },
                    set: function (value) {
                        this._setAw(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code39.prototype, "autoWidthZoom", {
                    /**
                     * Gets or sets a zoom factor applied to the automatically calculated control width.
                     *
                     * This property takes effect only if the {@link autoWidth} property is set to true.
                     * It can take any numeric value equal to or greater than 1.
                     *
                     * The default value for this property is **1**.
                     */
                    get: function () {
                        return this._getWzoom();
                    },
                    set: function (value) {
                        this._setWzoom(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code39.prototype, "showLabel", {
                    /**
                     * Indicates whether the value is rendered under the symbol.
                     *
                     * The default value for this property is <b>true</b>.
                     */
                    get: function () {
                        return this._getProp('showLabel');
                    },
                    set: function (value) {
                        this._setProp('showLabel', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code39.prototype, "checkDigit", {
                    /**
                     * Indicates whether the symbol needs a <a href="https://en.wikipedia.org/wiki/Modulo_operation" target="_blank">modulo</a> 43 <a href="https://en.wikipedia.org/wiki/Checksum" target="_blank">check digit</a>.
                     *
                     * The default value for this property is <b>false</b>.
                     */
                    get: function () {
                        return this._getProp('checkDigit');
                    },
                    set: function (value) {
                        this._setProp('checkDigit', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code39.prototype, "fullAscii", {
                    /**
                     * Indicates whether the symbol enables encoding of all 128 ASCII characters.
                     *
                     * The default value for this property is <b>false</b>.
                     */
                    get: function () {
                        return this._getProp('fullASCII');
                    },
                    set: function (value) {
                        this._setProp('fullASCII', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code39.prototype, "labelPosition", {
                    /**
                     * Gets or sets where to render the value of the control.
                     *
                     * The default value for this property is {@link LabelPosition.Bottom}.
                     */
                    get: function () {
                        return wijmo.barcode._LabelPositionConvertor.stringToEnum(this._getProp('labelPosition'));
                    },
                    set: function (value) {
                        this._setProp('labelPosition', wijmo.barcode._LabelPositionConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code39.prototype, "nwRatio", {
                    /**
                     * Gets or sets the narrow and wide bar ratio of the control.
                     *
                     * The possible property values are 1:2 or 1:3.
                     * The default value for this property is {@link NarrowWideRatio.OneToThree}.
                     */
                    get: function () {
                        return wijmo.barcode._NarrowWideRatioConvertor.stringToEnum(this._getProp('nwRatio'));
                    },
                    set: function (value) {
                        this._setProp('nwRatio', wijmo.barcode._NarrowWideRatioConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code39.prototype, "labelWithStartAndStopCharacter", {
                    /**
                     * Indicates whether to show the start and stop character in the label.
                     *
                     * The default value for this property is <b>false</b>.
                     */
                    get: function () {
                        return this._getProp('labelWithStartAndStopCharacter');
                    },
                    set: function (value) {
                        this._setProp('labelWithStartAndStopCharacter', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Code39.type = 'Code39';
                return Code39;
            }(wijmo.barcode.BarcodeBase));
            common.Code39 = Code39;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Code_128" target="_blank">Code128</a>
             * barcode type.
             *
             * This is a variable-width barcode, the width of which automatically changes
             * along with the length of the {@link value}. The {@link autoWidthZoom} property
             * can be used to zoom the automatically calculated width. The {@link autoWidth}
             * property can be used to disable this behavior.
             */
            var Code128 = /** @class */ (function (_super) {
                __extends(Code128, _super);
                /**
                 * Initializes a new instance of the {@link Code128} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function Code128(element, option) {
                    var _this = _super.call(this, element) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-code128');
                    _this._setAw(true);
                    _this.initialize(option);
                    return _this;
                }
                Object.defineProperty(Code128.prototype, "autoWidth", {
                    /**
                     * Gets or sets a value indicating whether the control width should automatically
                     * change along with the {@link value} length.
                     *
                     * If you set this property value to false, you should ensure that the control has some
                     * reasonable *CSS width*.
                     *
                     * The default value for this property is **true**.
                     */
                    get: function () {
                        return this._getAw();
                    },
                    set: function (value) {
                        this._setAw(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code128.prototype, "autoWidthZoom", {
                    /**
                     * Gets or sets a zoom factor applied to the automatically calculated control width.
                     *
                     * This property makes effect only if the {@link autoWidth} property is set to true.
                     * It can take any numeric value equal to or greater than 1.
                     *
                     * The default value for this property is **1**.
                     */
                    get: function () {
                        return this._getWzoom();
                    },
                    set: function (value) {
                        this._setWzoom(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code128.prototype, "showLabel", {
                    /**
                     * Indicates whether the value is rendered under the symbol.
                     *
                     * The default value for this property is <b>true</b>.
                     */
                    get: function () {
                        return this._getProp('showLabel');
                    },
                    set: function (value) {
                        this._setProp('showLabel', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code128.prototype, "codeSet", {
                    /**
                     * Gets or sets which kind of code set is used in this control.
                     *
                     * The default value for this property is {@link Code128CodeSet.Auto}.
                     */
                    get: function () {
                        return common._CodeSetTypeConvertor.stringToEnum(this._getProp('codeSet'));
                    },
                    set: function (value) {
                        this._setProp('codeSet', common._CodeSetTypeConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code128.prototype, "labelPosition", {
                    /**
                     * Gets or sets where to render the value of the control.
                     *
                     * The default value for this property is {@link LabelPosition.Bottom}.
                     */
                    get: function () {
                        return wijmo.barcode._LabelPositionConvertor.stringToEnum(this._getProp('labelPosition'));
                    },
                    set: function (value) {
                        this._setProp('labelPosition', wijmo.barcode._LabelPositionConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Code128.type = 'Code128';
                return Code128;
            }(wijmo.barcode.BarcodeBase));
            common.Code128 = Code128;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1-128" target="_blank">GS1_128</a>
             * barcode type.
             *
             * This is a variable-width barcode, the width of which automatically changes
             * along with the length of the {@link value}. The {@link autoWidthZoom} property
             * can be used to zoom the automatically calculated width. The {@link autoWidth}
             * property can be used to disable this behavior.
             */
            var Gs1_128 = /** @class */ (function (_super) {
                __extends(Gs1_128, _super);
                /**
                 * Initializes a new instance of the {@link Gs1_128} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function Gs1_128(element, option) {
                    var _this = _super.call(this, element) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-gs1_128');
                    _this._setAw(true);
                    _this.initialize(option);
                    return _this;
                }
                Object.defineProperty(Gs1_128.prototype, "autoWidth", {
                    /**
                     * Gets or sets a value indicating whether the control width should automatically
                     * change along with the {@link value} length.
                     *
                     * If you set this property value to false, you should ensure that the control has some
                     * reasonable *CSS width*.
                     *
                     * The default value for this property is **true**.
                     */
                    get: function () {
                        return this._getAw();
                    },
                    set: function (value) {
                        this._setAw(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Gs1_128.prototype, "autoWidthZoom", {
                    /**
                     * Gets or sets a zoom factor applied to the automatically calculated control width.
                     *
                     * This property makes effect only if the {@link autoWidth} property is set to true.
                     * It can take any numeric value equal to or greater than 1.
                     *
                     * The default value for this property is **1**.
                     */
                    get: function () {
                        return this._getWzoom();
                    },
                    set: function (value) {
                        this._setWzoom(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Gs1_128.prototype, "showLabel", {
                    /**
                     * Indicates whether the value is rendered under the symbol.
                     *
                     * The default value for this property is <b>true</b>.
                     */
                    get: function () {
                        return this._getProp('showLabel');
                    },
                    set: function (value) {
                        this._setProp('showLabel', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Gs1_128.prototype, "labelPosition", {
                    /**
                     * Gets or sets where to render the value of the control.
                     *
                     * The default value for this property is {@link LabelPosition.Bottom}.
                     */
                    get: function () {
                        return wijmo.barcode._LabelPositionConvertor.stringToEnum(this._getProp('labelPosition'));
                    },
                    set: function (value) {
                        this._setProp('labelPosition', wijmo.barcode._LabelPositionConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Gs1_128.type = 'GS1_128';
                return Gs1_128;
            }(wijmo.barcode.BarcodeBase));
            common.Gs1_128 = Gs1_128;
            /**
             * Base abstract class for all UPC barcode control classes.
             */
            var UpcBase = /** @class */ (function (_super) {
                __extends(UpcBase, _super);
                /**
                 * Abstract class constructor, never call.
                 */
                function UpcBase(element, option) {
                    var _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-upc');
                    return _this;
                }
                Object.defineProperty(UpcBase.prototype, "showLabel", {
                    /**
                     * Indicates whether the value is rendered under the symbol.
                     *
                     * The default value for this property is <b>true</b>.
                     */
                    get: function () {
                        return this._getProp('showLabel');
                    },
                    set: function (value) {
                        this._setProp('showLabel', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UpcBase.prototype, "addOn", {
                    /**
                     * Gets or sets the addOn value of the control.
                     *
                     * The possible length of this property should be 2 or 5.
                     */
                    get: function () {
                        return this._getProp('addOn');
                    },
                    set: function (value) {
                        this._setProp('addOn', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UpcBase.prototype, "labelPosition", {
                    /**
                     * Gets or sets where to render the value of the control.
                     *
                     * The default value for this property is {@link LabelPosition.Bottom}.
                     */
                    get: function () {
                        return wijmo.barcode._LabelPositionConvertor.stringToEnum(this._getProp('labelPosition'));
                    },
                    set: function (value) {
                        this._setProp('labelPosition', wijmo.barcode._LabelPositionConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UpcBase.prototype, "addOnHeight", {
                    /**
                     * Gets or sets the height of addOn symbol of the control.
                     *
                     * The default value for this property is <b>auto</b>.
                     */
                    get: function () {
                        return this._getProp('addOnHeight');
                    },
                    set: function (value) {
                        this._setProp('addOnHeight', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UpcBase.prototype, "addOnLabelPosition", {
                    /**
                     * Gets or sets where to render the addOn value of the control.
                     *
                     * The default value for this property is {@link LabelPosition.Top}.
                     */
                    get: function () {
                        return wijmo.barcode._LabelPositionConvertor.stringToEnum(this._getProp('addOnLabelPosition'));
                    },
                    set: function (value) {
                        this._setProp('addOnLabelPosition', wijmo.barcode._LabelPositionConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UpcBase.prototype, "quietZone", {
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
                return UpcBase;
            }(wijmo.barcode.BarcodeBase));
            common.UpcBase = UpcBase;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Universal_Product_Code" target="_blank">UPC-A</a>
             * barcode type.
             */
            var UpcA = /** @class */ (function (_super) {
                __extends(UpcA, _super);
                /**
                 * Initializes a new instance of the {@link UpcA} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function UpcA(element, option) {
                    var _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-upca');
                    return _this;
                }
                UpcA.type = 'UPC-A';
                return UpcA;
            }(UpcBase));
            common.UpcA = UpcA;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Universal_Product_Code" target="_blank">UPC-E0</a>
             * barcode type.
             */
            var UpcE0 = /** @class */ (function (_super) {
                __extends(UpcE0, _super);
                /**
                 * Initializes a new instance of the {@link UpcE0} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function UpcE0(element, option) {
                    var _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-upce0');
                    return _this;
                }
                UpcE0.type = 'UPC-E0';
                return UpcE0;
            }(UpcBase));
            common.UpcE0 = UpcE0;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Universal_Product_Code" target="_blank">UPC-E1</a>
             * barcode type.
             */
            var UpcE1 = /** @class */ (function (_super) {
                __extends(UpcE1, _super);
                /**
                 * Initializes a new instance of the {@link UpcE1} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function UpcE1(element, option) {
                    var _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-upce1');
                    return _this;
                }
                UpcE1.type = 'UPC-E1';
                return UpcE1;
            }(UpcBase));
            common.UpcE1 = UpcE1;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/QR_code" target="_blank">QRCode</a>
             * barcode type.
             */
            var QrCode = /** @class */ (function (_super) {
                __extends(QrCode, _super);
                /**
                 * Initializes a new instance of the {@link QrCode} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function QrCode(element, option) {
                    var _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-qrcode');
                    return _this;
                }
                Object.defineProperty(QrCode.prototype, "charCode", {
                    /**
                     * Gets or sets the collection of characters associated with the charset.
                     */
                    get: function () {
                        return this._getProp('charCode');
                    },
                    set: function (value) {
                        this._setProp('charCode', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(QrCode.prototype, "charset", {
                    /**
                     * Gets or sets which charset to encode this control.
                     *
                     * The default value for this property is {@link QrCodeCharset.Utf8}.
                     */
                    get: function () {
                        return common._CharsetTypeConvertor.stringToEnum(this._getProp('charset'));
                    },
                    set: function (value) {
                        this._setProp('charset', common._CharsetTypeConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(QrCode.prototype, "model", {
                    /**
                     * Gets or sets the model style of the control used.
                     *
                     * The default value for this property is {@link QrCodeModel.Model2}.
                     */
                    get: function () {
                        return common._QrCodeModelConvertor.stringToEnum(this._getProp('model'));
                    },
                    set: function (value) {
                        this._setProp('model', common._QrCodeModelConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(QrCode.prototype, "version", {
                    /**
                     * Gets or sets the different module configuration of the control.
                     * The versions of QRCode range from version 1 to version 40.
                     * Each version has a different module configuration or number of modules.
                     * (The module refers to the black and white dots that make up QRCode.)
                     *
                     * The default value for this property is <b>null</b> or <b>undefined</b>.
                     */
                    get: function () {
                        var ret = this._getProp('version');
                        return ret === 'auto' ? null : ret;
                    },
                    set: function (value) {
                        this._setProp('version', value == null ? 'auto' : value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(QrCode.prototype, "errorCorrectionLevel", {
                    /**
                     * Gets or sets the restoration ability of QRCode.
                     *
                     * The default value for this property is {@link QrCodeCorrectionLevel.Low}.
                     */
                    get: function () {
                        return common._CorrectionLevelConvertor.stringToEnum(this._getProp('errorCorrectionLevel'));
                    },
                    set: function (value) {
                        this._setProp('errorCorrectionLevel', common._CorrectionLevelConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(QrCode.prototype, "mask", {
                    /**
                     * Gets or sets the patterns that are defined on a grid, which are repeated as necessary to cover the whole symbol.
                     *
                     * The default value for this property is <b>null</b> or <b>undefined</b>.
                     */
                    get: function () {
                        var ret = this._getProp('mask');
                        return ret === 'auto' ? null : ret;
                    },
                    set: function (value) {
                        this._setProp('mask', value == null ? 'auto' : value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(QrCode.prototype, "connection", {
                    /**
                     * Indicates whether the symbol is a part of a structured append message.
                     *
                     * The default value for this property is <b>false</b>.
                     */
                    get: function () {
                        return this._getProp('connection');
                    },
                    set: function (value) {
                        this._setProp('connection', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(QrCode.prototype, "connectionIndex", {
                    /**
                     * Gets or sets the index of the symbol block in the structured append message.
                     *
                     * The possible property values are 0 - 15.
                     * The default value for this property is <b>0</b>.
                     */
                    get: function () {
                        return this._getProp('connectionNo');
                    },
                    set: function (value) {
                        this._setProp('connectionNo', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                QrCode.type = 'QRCode';
                return QrCode;
            }(wijmo.barcode.BarcodeBase));
            common.QrCode = QrCode;
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var common;
        (function (common) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.barcode.common', wijmo.barcode.common);
        })(common = barcode.common || (barcode.common = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.barcode.common.js.map