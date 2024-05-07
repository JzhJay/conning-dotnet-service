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


    module wijmo.barcode.common {
    const EXP_TABLE = new Array(256);
for (let i = 0; i < 8; i++ ) {
    EXP_TABLE[i] = 1 << i;
}
for (let i = 8; i < 256; i++ ) {
    EXP_TABLE[i] = EXP_TABLE[i - 4] ^
        EXP_TABLE[i - 5] ^
        EXP_TABLE[i - 6] ^
        EXP_TABLE[i - 8];
}
const LOG_TABLE = new Array(256);
for (let i = 0; i < 255; i += 1) {
    LOG_TABLE[EXP_TABLE[i]] = i;
}

const RS_COEFFICIENTS = [
    null, null, null, null, null, null, null, 
    //  7
    [0, 87,229,146,149,238,102, 21], null, null, 
    // 10
    [0,251, 67, 46, 61,118, 70, 64, 94, 32, 45], null, null,
    // 13
    [0, 74,152,176,100, 86,100,106,104,130,218,206,140, 78], null,
    // 15
    [0,  8,183, 61, 91,202, 37, 51, 58, 58,237,140,124,  5, 99,105],
    // 16
    [0,120,104,107,109,102,161, 76  ,3, 91,191,147,169,182,194,225,120],
    // 17
    [0, 43,139,206, 78, 43,239,123,206,214,147, 24, 99,150, 39,243,163,136],
    // 18
    [0,215,234,158, 94,184, 97,118,170, 79,187,152,148,252,179,  5, 98, 96,153], null,
    // 20
    [0, 17, 60, 79, 50, 61,163, 26,187,202,180,221,225, 83,239,156,164,212,212,188,190], null,
    // 22
    [0,210,171,247,242, 93,230, 14,109,221, 53,200, 74,  8,172, 98, 80,219,134,160,105,165,231], null,
    // 24
    [0,229,121,135, 48,211,117,251,126,159,180,169,152,192,226,228,218,111,  0,117,232, 87, 96,227, 21], null,
    // 26
    [0,173,125,158,  2,103,182,118, 17,145,201,111, 28,165, 53,161, 21,245,142, 13,102, 48,227,153,145,218, 70], null,
    // 28
    [0,168,223,200,104,224,234,108,180,110,190,195,147,205, 27,232,201, 21, 43,245, 87, 42,195,212,119,242, 37,  9,123], null,
    // 30
    [0, 41,173,145,152,216, 31,179,182, 50, 48,110, 86,239, 96,222,125, 42,173,226,193,224,130,156, 37,251,216,238, 40,192,180], null,
    // 32
    [0, 10,  6,106,190,249,167,  4, 67,209,138,138, 32,242,123, 89, 27,120,185, 80,156, 38, 69,171, 60, 28,222, 80, 52,254,185,220,241], null,
    // 34
    [0,111, 77,146, 94, 26, 21,108, 19,105, 94,113,193, 86,140,163,125, 58,158,229,239,218,103, 56, 70,114, 61,183,129,167, 13, 98, 62,129, 51], null,
    // 36
    [0,200,183, 98, 16,172, 31,246,234, 60,152,115,  0,167,152,113,248,238,107, 18, 63,218, 37, 87,210,105,177,120, 74,121,196,117,251,113,233, 30,120], null, null, null,
    // 40
    [0, 59,116, 79,161,252, 98,128,205,128,161,247, 57,163, 56,235,106, 53, 26,187,174,226,104,170,  7,175, 35,181,114, 88, 41, 47,163,125,134, 72, 20,232, 53, 35, 15], null,
    // 42
    [0,250,103,221,230, 25, 18,137,231,  0,  3, 58,242,221,191,110, 84,230,  8,188,106, 96,147, 15,131,139, 34,101,223, 39,101,213,199,237,254,201,123,171,162,194,117, 50, 96], null,
    // 44
    [0,190,  7, 61,121, 71,246, 69, 55,168,188, 89,243,191, 25, 72,123,  9,145, 14,247,  1,238, 44, 78,143, 62,224,126,118,114, 68,163, 52,194,217,147,204,169, 37,130,113,102, 73,181], null,
    // 46
    [0,112, 94, 88,112,253,224,202,115,187, 99, 89,  5, 54,113,129, 44, 58, 16,135,216,169,211, 36,  1,  4, 96, 60,241, 73,104,234,  8,249,245,119,174, 52, 25,157,224, 43,202,223, 19, 82, 15], null,
    // 48
    [0,228, 25,196,130,211,146, 60, 24,251, 90, 39,102,240, 61,178, 63, 46,123,115, 18,221,111,135,160,182,205,107,206, 95,150,120,184, 91, 21,247,156,140,238,191, 11, 94,227, 84, 50,163, 39, 34,108,], null,
    // 50
    [0,232,125,157,161,164,  9,118, 46,209, 99,203,193, 35,  3,209,111,195,242,203,225, 46, 13, 32,160,126,209,130,160,242,215,242, 75, 77, 42,189, 32,113, 65,124, 69,228,114,235,175,124,170,215,232,133,205], null,
    // 52
    [0,116, 50, 86,186, 50,220,251, 89,192, 46, 86,127,124, 19,184,233,151,215, 22, 14, 59,145, 37,242,203,134,254, 89,190, 94, 59, 65,124,113,100,233,235,121, 22, 76, 86, 97, 39,242,200,220,101, 33,239,254,116, 51], null,
    // 54
    [0,183, 26,201, 87,210,221,113, 21, 46, 65, 45, 50,238,184,249,225,102, 58,209,218,109,165, 26, 95,184,192, 52,245, 35,254,238,175,172, 79,123, 25,122, 43,120,108,215, 80,128,201,235,  8,153, 59,101, 31,198, 76, 31,156], null,
    // 56
    [0,106,120,107,157,164,216,112,116,  2, 91,248,163, 36,201,202,229,  6,144,254,155,135,208,170,209, 12,139,127,142,182,249,177,174,190, 28, 10, 85,239,184,101,124,152,206, 96, 23,163, 61, 27,196,247,151,154,202,207, 20, 61, 10], null,
    // 58
    [0, 82,116, 26,247, 66, 27, 62,107,252,182,200,185,235, 55,251,242,210,144,154,237,176,141,192,248,152,249,206, 85,253,142, 65,165,125, 23, 24, 30,122,240,214,  6,129,218, 29,145,127,134,206,245,117, 29, 41, 63,159,142,233,125,148,123], null,
    // 60
    [0,107,140, 26, 12,  9,141,243,197,226,197,219, 45,211,101,219,120, 28,181,127,  6,100,247,  2,205,198, 57,115,219,101,109,160, 82, 37, 38,238, 49,160,209,121, 86, 11,124, 30,181, 84, 25,194, 87, 65,102,190,220, 70, 27,209, 16, 89,  7, 33,240], null,
    // 62
    [0, 65,202,113, 98, 71,223,248,118,214, 94,  1,122, 37, 23,  2,228, 58,121,  7,105,135, 78,243,118, 70, 76,223, 89, 72, 50, 70,111,194, 17,212,126,181, 35,221,117,235, 11,229,149,147,123,213, 40,115,  6,200,100, 26,246,182,218,127,215, 36,186,110,106], null,
    // 64
    [0, 45, 51,175,  9,  7,158,159, 49, 68,119, 92,123,177,204,187,254,200, 78,141,149,119, 26,127, 53,160, 93,199,212, 29, 24,145,156,208,150,218,209,  4,216, 91, 47,184,146, 47,140,195,195,125,242,238, 63, 99,108,140,230,242, 31,204, 11,178,243,217,156,213,231], null,
    // 66
    [0,  5,118,222,180,136,136,162, 51, 46,117, 13,215, 81, 17,139,247,197,171, 95,173, 65,137,178, 68,111, 95,101, 41, 72,214,169,197, 95,  7, 44,154, 77,111,236, 40,121,143, 63, 87, 80,253,240,126,217, 77, 34,232,106, 50,168, 82, 76,146, 67,106,171, 25,132, 93, 45,105], null,
    // 68
    [0,247,159,223, 33,224, 93, 77, 70, 90,160, 32,254, 43,150, 84,101,190,205,133, 52, 60,202,165,220,203,151, 93, 84, 15, 84,253,173,160, 89,227, 52,199, 97, 95,231, 52,177, 41,125,137,241,166,225,118,  2, 54, 32, 82,215,175,198, 43,238,235, 27,101,184,127,  3,  5,  8,163,238], null
];

export function generateErrorCorrectionCode (codewords, ecCount, dataCount) {
    let kd = [];
    const coefficients = RS_COEFFICIENTS[ecCount];

    let copy = codewords.slice(0);
    for (let i = 0; i < dataCount; i++) {
        if (copy[0] != 0) {
            let exp = LOG_TABLE[copy[0]];

            for( let i = 0; i <= coefficients.length - 1; i++ ) {
                let kk = coefficients[i]+ exp;
                while ( kk >= 255 )
                    kk -= 255;
                kd[i]= EXP_TABLE[kk];
            }

            for( let i = 0; i <= coefficients.length - 1; i++ ) {
                copy[i]= copy[i] ^ kd[i];
            }
        }

        for( let i = 1; i < copy.length; i++ ) {
            copy[i - 1]= copy[i];
        }
        copy[copy.length - 1]= 0; 
    }

    return copy.slice(0, ecCount);
}
    }
    


    module wijmo.barcode.common {
    const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
const MODEL2_G15_MASK = 0b101010000010010;
const MODEL1_G15_MASK = 0b010100000100101;

function getBCHDigit (data) {
    let digit = 0;
    while (data != 0) {
        digit += 1;
        data >>>= 1;
    }
    return digit;
}

export function getBCH15(data, model) {
    let G15_MASK = model === 2 ? MODEL2_G15_MASK : MODEL1_G15_MASK;
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
    }
    return ( (data << 10) | d) ^ G15_MASK;
}

export function getBCH18 (data) {
    let d = data << 12;
    while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
    }
    return (data << 12) | d;
}
    }
    


    module wijmo.barcode.common {
    


export const MODE_INDICATOR = {
    ECI: 7, //todo
    Numeric: 1,
    Alphanumeric: 2,
    '8BitByte': 4,
    Kanji: 8,
    StructuredAppend: 3,
    FNC1First: 5, //todo
    FNC2Second: 9, //todo
    Terminator: 0
};

export const EC_INDICATOR = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2
};

function isNumericMode(cc) {
    return cc >= 0x30 && cc <= 0x39;
}

function isAlphanumericMode(cc) {
    let symbols = ' $%*+-./:';
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

const checkFns = {
    Numeric: isNumericMode,
    Alphanumeric: isAlphanumericMode,
    '8BitByte': is8BitByteMode,
    Kanji: isKanjiMode
};

export function isMode(mode, charcode) {
    let checkFn = checkFns[mode];

    if (charcode.length === 1) {
        return checkFn(charcode);
    }
    return charcode.every((c) => {
        return checkFn(c);
    });
}

export function getCharMode (code, charset = 'UTF-8') {
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

export const getSizeByVersion = version => {
    return version * 4 + 17;
};

export function getCharacterCountIndicatorbitsNumber(version) {
    if (version >= 1 && version <= 9) {
        return {
            Numeric: 10,
            Alphanumeric: 9,
            '8BitByte': 8,
            Kanji: 8
        };
    } else if (version >= 10 && version <= 26) {
        return {
            Numeric: 12,
            Alphanumeric: 11,
            '8BitByte': 16,
            Kanji: 10
        };

    } else {
        return {
            Numeric: 14,
            Alphanumeric: 13,
            '8BitByte': 16,
            Kanji: 12
        };
    }
}

const SYMBOL_MAP = {
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

export function getAlphanumericCharValue(cc) {
    if (cc >= 0x30 && cc <= 0x39) {
        return +String.fromCharCode(cc);
    }

    if (cc >= 0x41 && cc <= 0x5a) {
        return cc - 0x41 + 10;
    }

    const result = SYMBOL_MAP[String.fromCharCode(cc)];

    if (!result) {
        throw new wijmo.barcode.InvalidTextException(String.fromCharCode(cc));
    } else {
        return result;
    }

}

export function createModules (size) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(wijmo.barcode.Utils.fillArray(new Array(size), null));
    }
    return arr;
}

const alignmentPatterns = [
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

export function getAlignmentPattersPos (version) {
    return alignmentPatterns[version - 1];
}

export const padCodewords0 = 0xEC;
export const padCodewords1 = 0x11;
export const maskFuncs = [
    (i, j) => (i + j) % 2 === 0,
    (i) => i % 2 === 0,
    (i, j) => j % 3 === 0,
    (i, j) => (i + j) % 3 === 0,
    (i, j) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0,
    (i, j) => (i * j) % 2 + (i * j) % 3 === 0,
    (i, j) => ((i * j) % 2 + (i * j) % 3) % 2 === 0,
    (i, j) => ((i * j) % 3 + (i + j) % 2) % 2 === 0
];

const MODEL2_1ERROR_CORRECTION_CHARACTERISTICS = [
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
const MODEL1_ERROR_CORRECTION_CHARACTERISTICS = [
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

export function getErrorCorrectionCharacteristics (version, ecLevel, model = 2) {
    let index;
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
    let table = model === 2 ? MODEL2_1ERROR_CORRECTION_CHARACTERISTICS : MODEL1_ERROR_CORRECTION_CHARACTERISTICS;
    const info = table[(version - 1) * 4 + index];
    const result = [];
    const length = info.length / 3;

    for (let i = 0; i < length; i++) {
        let blockCount = info[i * 3];

        for (let j = 0; j < blockCount; j++) {
            result.push({
                total: info[i * 3 + 1],
                data: info[i * 3 + 2],
                ec: info[i * 3 + 1] - info[i * 3 + 2]
            });
        }
        
    }

    return result;
}

export function getMaskFunc (type) {
    return maskFuncs[type];
}

function cloneModules (modules) {
    return modules.reduce((arr, row) => {
        arr.push(row.slice(0));
        return arr;
    }, []);
}

export function getMaskScore (modules) {
    const moduleCount = modules.length;
    let score = 0;

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            let sameCount = 0;
            let dark = modules[row][col];

            for (let r = -1; r <= 1; r++) {
                if (row + r < 0 || moduleCount <= row + r) {
                    continue;
                }
                for (let c = -1; c <= 1; c++) {
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

    for (let row = 0; row < moduleCount - 1; row++) {
        for (let col = 0; col < moduleCount - 1; col++) {
            let count = 0;
            if (modules[row][col] ) count += 1;
            if (modules[row + 1][col]) count += 1;
            if (modules[row][col + 1]) count += 1;
            if (modules[row + 1][col + 1]) count += 1;
            if (count == 0 || count == 4) {
                score += 3;
            }
        }
    }

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount - 6; col++) {
            if (modules[row][col]
              && !modules[row][col + 1]
              &&  modules[row][col + 2]
              &&  modules[row][col + 3]
              &&  modules[row][col + 4]
              && !modules[row][col + 5]
              &&  modules[row][col + 6]) {
                score += 40;
            }
        }
    }

    for (let col = 0; col < moduleCount; col++) {
        for (let row = 0; row < moduleCount - 6; row++) {
            if (modules[row][col]
              && !modules[row + 1][col]
              &&  modules[row + 2][col]
              &&  modules[row + 3][col]
              &&  modules[row + 4][col]
              && !modules[row + 5][col]
              &&  modules[row + 6][col]) {
                score += 40;
            }
        }
    }

    let darkCount = 0;

    for (let col = 0; col < moduleCount; col++) {
        for (let row = 0; row < moduleCount; row++) {
            if (modules[row][col]) {
                darkCount += 1;
            }
        }
    }

    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    score += ratio * 10;

    return score;
}

export function addFormatInformation (originModules, maskPattern, ec, model) {
    const modulesCount = originModules.length;
    const modules = cloneModules(originModules);
    const ecIndicator = wijmo.barcode.Utils.strPadStart(wijmo.barcode.Utils.convertRadix(ec, 2), 2, 0);
    const mask = wijmo.barcode.Utils.strPadStart(wijmo.barcode.Utils.convertRadix(maskPattern, 2), 3, 0);
    const data = ecIndicator + mask;
    const format = getBCH15(parseInt(data, 2), model);
    
    modules[modulesCount - 8][8] = 1;

    for (let i = 15; i > 0; i--) {
        let dark = ((format >> i - 1) & 1);
        if (i > 9) {
            modules[8][15 - i] = dark;
            modules[modulesCount - 1 - 15 + i][8] = dark;
        } else if (i > 8) {
            modules[8][15 - i + 1] = dark;
            modules[modulesCount - 1 - 15 + i][8] = dark;
        } else if (i > 6) {
            modules[i][8] = dark;
            modules[8][modulesCount - i] = dark;
        } else {
            modules[i - 1][8] = dark;
            modules[8][modulesCount - i] = dark;
        }
    }
    
    return modules;
}

export function getEstimatedVersion(ec, charCode, model) {
    let numCount = 0, alphaCount = 0, byteCount = 0, kanjiCount = 0;

    charCode.forEach((cc) => {
        if (isNumericMode(cc)) {
            numCount++;
        } else if (isAlphanumericMode(cc)) {
            alphaCount++;
        }  else if (isKanjiMode(cc)) {
            kanjiCount++;
        } else if (is8BitByteMode(cc)) {
            byteCount++;
        }
    });

    let size = Math.ceil((alphaCount * 5 + numCount * 3 + kanjiCount * 13 + byteCount * 8) / 8);

    for (let ver = 1; ver <= 40; ver++) {
        let blocks = getErrorCorrectionCharacteristics(ver, ec, model);
        let dataCapacity = blocks.reduce((sum, b) => sum += b.data, 0);
        if (size <= dataCapacity) {
            return ver;
        }
    }

    throw new wijmo.barcode.TextTooLongException();
}

const MODE_CHECK_INFO = {
    Alphanumeric: [[6, 11], [7, 15], [8, 16]],
    Numeric:[[4, 6, 6, 13], [4, 7, 8, 15], [5, 8, 9, 17]]
};

export function getModeCheckInfo (mode, version) {
    let modeInfo = MODE_CHECK_INFO[mode];

    if (version <= 9) {
        return modeInfo[0];
    } else if (version <= 26) {
        return modeInfo[1];
    } else {
        return modeInfo[2];
    }
}

export function utf8Encode (charCode) {
    const bytes = [];
    for (let i = 0, len = charCode.length; i < len; i++) {
        let c = charCode[i];
        if (c < 0x80) {
            bytes.push(c);
        } else if (c < 0x800) {
            bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
        } else if (c < 0xd800 || c >= 0xe000) {
            bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
        } else {
            i++;
            c = 0x10000 + (((c & 0x3ff)<<10) | (charCode[i] & 0x3ff));
            bytes.push(0xf0 | (c >>18), 0x80 | ((c>>12) & 0x3f), 0x80 | ((c>>6) & 0x3f), 0x80 | (c & 0x3f));
        }
    }
        
    return bytes;
}

export function getParityData (charCode) {
    let bytes = utf8Encode(charCode);
    let result = bytes[0];
    for (let i = 1, len = bytes.length; i < len; i++) {
        result ^= bytes[i];
    }
    return result;
}

export function getCharCode (text) {
    let result = [];
    wijmo.barcode.Utils.sliceString(text, 1, (c) => {
        result.push(c.charCodeAt(0));
    });
    return result;
}
    }
    


    module wijmo.barcode.common {
    

export class ModeKanji {
    private mode: any;
    private data: any;
    constructor (data) {
        this.mode = 'Kanji';
        this.data = data;
    }

    getMode () {
        return MODE_INDICATOR['Kanji'];
    }

    getLength () {
        return this.data.length;
    }

    write (buffer) {
        this.data.forEach((d) => {
            let result;
            if (d > 0x8140 && d < 0x9FFC) {
                d -= 0x8140;
                let first = d >>> 8;
                let second = d & 0xff;
                result = first * 0xC0 + second;
            } else if (d > 0xE040 && d < 0xEBBF) {
                d -= 0xC140;
                let first = d >>> 8;
                let second = d & 0xff;
                result = first * 0xC0 + second;
            }

            buffer.put(result, 13);
        });
    }
}
    }
    


    module wijmo.barcode.common {
    


export class ModeAlphanumeric {
    private mode: any;
    private data: any;
    constructor (data) {
        this.mode = 'Alphanumeric';
        this.data = data;
    }

    getMode () {
        return MODE_INDICATOR['Alphanumeric'];
    }

    getLength () {
        return this.data.length;
    }

    write (buffer) {
        wijmo.barcode.Utils.sliceArray(this.data, 2, (arr) => {
            let first = getAlphanumericCharValue(arr[0]);

            if (arr.length === 2) {
                let second = getAlphanumericCharValue(arr[1]);
                let num = first * 45 + second;
                buffer.put(num, 11);
            } else {
                buffer.put(first, 6);
            }
        });
    }
}
    }
    


    module wijmo.barcode.common {
    


export class ModeNumeric {
    private mode: any;
    private data: any;
    constructor (data) {
        this.mode = 'Numeric';
        this.data = data;
    }

    getMode () {
        return MODE_INDICATOR['Numeric'];
    }

    getLength () {
        return this.data.length;
    }

    write (buffer) {
        wijmo.barcode.Utils.sliceArray(this.data, 3, (arr) => {
            const num = parseInt(arr.reduce((str, item) => str += String.fromCharCode(item), ''));
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
    }
}
    }
    


    module wijmo.barcode.common {
    

export class Mode8BitByte {
    private mode: any;
    private data: any;
    private bytes: any;
    constructor (data) {
        this.mode = '8BitByte';
        this.data = data;
        this.bytes = utf8Encode(data);
    }

    getMode () {
        return MODE_INDICATOR['8BitByte'];
    }

    getLength () {
        return this.bytes.length;
    }

    write (buffer) {
        this.bytes.forEach((b) => {
            buffer.put(b, 8);
        });
    }
}
    }
    


    module wijmo.barcode.common {
    



export abstract class QRCodeBase {
    protected charCode: any;
    protected config: any;
    protected errorCorrectionLevel: any;
    protected model: any;
    protected version: any;
    protected modulesCount: any;
    protected charCountIndicatorBitsNumber: any;
    protected modules: any;
    protected maskPattern: any;
    
    private errorCorrectionCharacteristics: any;
    private totalDataCount: any;
    private totalDataBits: any;

    constructor(text, config) {
        let { version, model, charCode } = config;

        this.charCode = charCode ? charCode : getCharCode(text);
        const errorCorrectionLevel = EC_INDICATOR[config.errorCorrectionLevel];

        this.config = config;

        this.errorCorrectionLevel = errorCorrectionLevel;

        this.model = +model;
        
        if (version === 'auto') {
            version = this.getAutoVersion();
        } else {
            version = +version;
        }
        this.version = version;

        this.modulesCount = getSizeByVersion(version);
        this.charCountIndicatorBitsNumber = getCharacterCountIndicatorbitsNumber(version);
        this.errorCorrectionCharacteristics = getErrorCorrectionCharacteristics(version, errorCorrectionLevel, this.model);

        this.totalDataCount = this.errorCorrectionCharacteristics.reduce((result, item) => result += item.data, 0);
        this.totalDataBits = 8 * this.totalDataCount;
    }

    getConnections () {
        const { totalDataBits, charCode } = this;
        let maxBit = totalDataBits - 20;
        let len = charCode.length;
        let start = 0, end = 1;
        let results = [];
        let last = charCode[0];
        while (end <= len) {
            let code = charCode.slice(start, end);
            
            let sets = this.analysisData(code);
            let buffer = this.encodeData(sets);
            if ((buffer as any).length > maxBit) {
                results.push(last);
                start = end - 1;
            } else if (end === len) {
                results.push(code);
            }
            last = code;
            end++;
        }
        return results;
    }
    processConnection (buffer) {
        let { totalDataBits,  config: {connection, connectionNo}} = this;
        connectionNo = +connectionNo;
        if (connection) {
            let connectionCnt = Math.ceil(buffer.length / (totalDataBits - 20));
            if (connectionNo > connectionCnt - 1) {
                throw new wijmo.barcode.InvalidOptionsException({connectionNo}, `Max connection number is ${connectionCnt - 1}`);
            }
            
            let connections = this.getConnections();
            let substr = connections[connectionNo];
            let sets = this.analysisData(substr);
            let _buffer = this.encodeData(sets, {connectionNo, connectionCnt});
            return _buffer;
        } else {
            if (buffer.length > totalDataBits) {
                throw new wijmo.barcode.TextTooLongException();
            }
            return buffer;
        }
    }
    padBuffer (buffer) {
        const { totalDataBits } = this;

        if (buffer.length + 4 <= totalDataBits) {
            buffer.put(MODE_INDICATOR.Terminator, 4);
        }
         
        while (buffer.length % 8 != 0) {
            buffer.putBit(false);
        } 

        while (true) { //eslint-disable-line
            if (buffer.length >= totalDataBits) {
                break;
            }
            buffer.put(padCodewords0, 8);
            if (buffer.length >= totalDataBits) {
                break;
            }
            buffer.put(padCodewords1, 8);
        }
    }
    
    getAutoVersion () {
        let { errorCorrectionLevel, charCode, model } = this;
        let estimatedVersion = getEstimatedVersion(errorCorrectionLevel, charCode, model);
        for (let v = estimatedVersion; v < 40; v++) {
            this.version = v;
            this.modulesCount = getSizeByVersion(this.version);
            this.charCountIndicatorBitsNumber = getCharacterCountIndicatorbitsNumber(this.version);
            this.errorCorrectionCharacteristics = getErrorCorrectionCharacteristics(this.version, errorCorrectionLevel);
            this.totalDataCount = this.errorCorrectionCharacteristics.reduce((result, item) => result += item.data, 0);
            this.totalDataBits = 8 * this.totalDataCount;
            let datas = this.analysisData(charCode);
            let buffer = this.encodeData(datas);
            if ((buffer as any).length > this.totalDataBits) {
                continue;
            }

            return v;
        }

        throw new wijmo.barcode.TextTooLongException();
    }

    //encode text content
    analysisData (charCode) {
        const { version, config: {charset}} = this;
        
        let initMode = getCharMode(charCode[0], charset);

        switch (initMode) {
            case 'Alphanumeric': //eslint-disable-line
                let info1 = getModeCheckInfo(initMode, version);
                let remainderStr = charCode.slice(1, 1 + info1[0]);
                if (isMode('8BitByte', remainderStr)) {
                    initMode = '8BitByte';
                }
                break;
            case 'Numeric': //eslint-disable-line
                let info2 = getModeCheckInfo(initMode, version);
                let remainderStr1 = charCode.slice(1, 1 + info2[0]),
                    remainderStr2 = charCode.slice(1, 1 + info2[1]);
                if (isMode('8BitByte', remainderStr1)) {
                    initMode = '8BitByte';
                } else if (isMode('Alphanumeric', remainderStr2)) {
                    initMode = 'Alphanumeric';
                }
                break;
        }
        let lastMode = {mode: initMode, code: []};
        const sets = [lastMode];
        charCode.forEach((cc, index) => {
            let mode = getCharMode(cc, charset);
            
            if (lastMode.mode === mode) {
                lastMode.code.push(cc);
            } else {
                if (lastMode.mode === '8BitByte') {
                    if (mode === 'Kanji') {
                        lastMode = {mode, code: [cc]};
                        sets.push(lastMode);
                    } else if (mode === 'Numeric') {
                        let info = getModeCheckInfo(mode, version);
                        if (isMode(mode, charCode.slice(index, index + info[2]))) {
                            lastMode = {mode, code: [cc]};
                            sets.push(lastMode);
                        } else {
                            lastMode.code.push(cc);
                        }
                    } else if (mode === 'Alphanumeric') {
                        let info = getModeCheckInfo(mode, version);
                        if (isMode(mode, charCode.slice(index, index + info[1]))) {
                            lastMode = {mode, code: [cc]};
                            sets.push(lastMode);
                        } else {
                            lastMode.code.push(cc);
                        } 
                    } else {
                        lastMode.code.push(cc);
                    }
                } else if (lastMode.mode === 'Alphanumeric') {
                    if (mode === 'Kanji' || mode === '8BitByte') {
                        lastMode = {mode, code: [cc]};
                        sets.push(lastMode);
                    } else if (mode === 'Numeric') {
                        let info = getModeCheckInfo(mode, version);
                        if (isMode(mode, charCode.slice(index, index + info[2]))) {
                            lastMode = {mode, code: [cc]};
                            sets.push(lastMode);
                        } else {
                            lastMode.code.push(cc);
                        }
                    } else {
                        lastMode.code.push(cc);
                    }

                } else {
                    lastMode = {mode, code: [cc]};
                    sets.push(lastMode);
                }
            } 
        });
        return sets;
    }
    
    abstract encodeData (data?, info?);
    
    generateErrorCorrectionCode(buffer) {
        const { errorCorrectionCharacteristics } = this;
        
        const blocks = [];
        let pos = 0;
        errorCorrectionCharacteristics.forEach((item) => {
            let cw = buffer.getBuffer().slice(pos, pos + item.data);
            blocks.push({
                data: cw,
                ec: generateErrorCorrectionCode(cw, item.ec, item.data)
            });
            pos += item.data;
        });

        return blocks;
    }

    abstract getFinalMessage ();
    
    // Module placement in matrix
    abstract setModules ();

    abstract maskModules ();

    abstract autoMask ();

    //Function pattern placement
    addRectModule (x, y, w, h, flag = false) {
        const {modules} = this;
        const height = h + y,
            width = w + x;
        for (;y < height; y++) {
            let _x = x;
            for (;_x < width; _x++) {
                modules[y][_x] = +flag;
            }
        }
    }

    addPositionDetectionPattern() {
        const {modules} = this;
        const modulesCount = modules.length;

        //top-left
        this.addPattern(0, 0, 7);
        //separator
        this.addRectModule(7, 0, 1, 8, false);
        this.addRectModule(0, 7, 8, 1, false);

        //top-right
        let trX = modulesCount - 7;
        this.addPattern(trX, 0, 7);
        //separator
        this.addRectModule(trX - 1, 0, 1, 8, false);
        this.addRectModule(trX - 1, 7, 8, 1, false);
        
        //bottom-left
        let blY = modulesCount - 7;
        this.addPattern(0, blY, 7);
        //separator
        this.addRectModule(7, blY - 1, 1, 8, false);
        this.addRectModule(0, blY - 1, 8, 1, false);
    }

    addTimingPattern() {
        const {modules} = this;
        const modulesCount = modules.length;
        let dark = true;
        for (let i = 8;i < modulesCount - 7; i++) {
            modules[6][i] = +dark;
            modules[i][6] = +dark;
            dark = !dark;
        } 
    }

    addPattern (x, y, s) {
        this.addRectModule(x, y, s, s, true);
        this.addRectModule(x + 1, y + 1, s - 2, s - 2, false);
        this.addRectModule(x + 2, y + 2, s - 4, s - 4, true);
    }

    abstract getMatrix ();
}
    }
    


    module wijmo.barcode.common {
    








export class QRCodeModel2 extends QRCodeBase{
    
    encodeData (sets?, connectionInfo?) {
        const {charCountIndicatorBitsNumber, charCode} = this;
        let buffer = new wijmo.barcode.BitBuffer();
        if (connectionInfo) {
            buffer.put(MODE_INDICATOR.StructuredAppend, 4);
            buffer.put(connectionInfo.connectionNo, 4);
            buffer.put(connectionInfo.connectionCnt - 1, 4);
            buffer.put(getParityData(charCode), 8);
        }

        sets.forEach((set) => {
            if (!set.code) {
                return;
            }
            let data;
            switch (set.mode) {
            case 'Numeric':
                data = new ModeNumeric(set.code);
                break;
            case 'Alphanumeric':
                data = new ModeAlphanumeric(set.code);
                break;
            case '8BitByte':
                data = new Mode8BitByte(set.code);
                break;
            case 'Kanji':
                data = new ModeKanji(set.code);
                break;
            }

            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), charCountIndicatorBitsNumber[data.mode]);
            data.write(buffer);
        });

        return buffer;
    }

    getFinalMessage (blocks?) {
        const data = [];

        const dataBlocks = blocks.map(block => block.data);
        const ecBlocks = blocks.map(block => block.ec);

        const dcMaxNum = wijmo.barcode.Utils.getMaxValue(dataBlocks);
        const ecMaxNum = wijmo.barcode.Utils.getMaxValue(ecBlocks);

        for (let i = 0; i < dcMaxNum; i++) {
            dataBlocks.forEach((dbk) => {
                if (wijmo.barcode.Utils.isDefined(dbk[i])) {
                    data.push(dbk[i]);
                }
            });
        }

        for (let i = 0; i < ecMaxNum; i++) {
            ecBlocks.forEach((ebk) => {
                if (wijmo.barcode.Utils.isDefined(ebk[i])) {
                    data.push(ebk[i]);
                }
            });
        }

        return data;
    }
    
    // Module placement in matrix
    setModules (data?) {
        let { modulesCount, version} = this;
        this.modules = createModules(modulesCount);
        this.addPositionDetectionPattern();

        this.addAlignmentPattern();
        
        this.addTimingPattern();
        if ( version > 6) {
            this.addVersionInformation();
        }
        this.maskModules(data);
    }

    maskModules (data?) {
        const {modules, errorCorrectionLevel, model, config: { mask }} = this;
        if (mask ==='auto') {
            this.autoMask(data);
        } else {
            let maskFunc = getMaskFunc(mask);
            this.maskPattern = mask;
            let newModules = addFormatInformation(modules, mask, errorCorrectionLevel, model);
            this.modules = this.fillDataModules(newModules, data, maskFunc);
        }
    }

    autoMask (data?) {
        const { modules, errorCorrectionLevel, model } = this;
        let result, score, pattern;

        maskFuncs.forEach((fn, i) => {
            let newModules = addFormatInformation(modules, i, errorCorrectionLevel, model);
            let _mod = this.fillDataModules(newModules, data, fn);
            let _score = getMaskScore(_mod);
            //
            if (!score || _score < score) {
                result = _mod;
                score = _score;
                pattern = i;
            }
        });

        this.modules = result;
        this.maskPattern = pattern;
    }

    addAlignmentPattern() {
        const {modules, version} = this;
        const pos = getAlignmentPattersPos(version);
        pos.forEach((row) => {
            pos.forEach((col) => {
                if (modules[row][col] === null) {
                    this.addPattern(col - 2, row - 2, 5);
                }
            });
        });
    }
    
    addVersionInformation () {
        const {modulesCount, modules, version} = this;
        const data = getBCH18(version);

        for (let i = 0; i < 18; i++) {
            let dark = ((data >> i) & 1);
            modules[Math.floor(i / 3)][i % 3 + modulesCount - 8 - 3] = dark;
            modules[i % 3 + modulesCount - 8 - 3][Math.floor(i / 3)] = dark;
        }
    }

    fillDataModules (modules, data, maskFunc) {
        
        const modulesCount = modules.length;
        let inc = -1;
        let row = modulesCount - 1;
        let bitIndex = 7;
        let byteIndex = 0;

        for (let col = modulesCount - 1; col > 0; col -= 2) {

            if (col == 6) col -= 1;

            while (true) { //eslint-disable-line
                for (let c = 0; c < 2; c += 1) {
                    if (modules[row][col - c] == null) {

                        let dark = false;

                        if (byteIndex < data.length) {
                            dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
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
    }

    getMatrix () {
        let { charCode } = this;
        let datas = this.analysisData(charCode);
        let buffer = this.encodeData(datas);
        let newBuffer = this.processConnection(buffer);

        this.padBuffer(newBuffer);
        let blocks = this.generateErrorCorrectionCode(newBuffer);
        let data = this.getFinalMessage(blocks);

        this.setModules(data);
        return this.modules;
    }
}
    }
    


    module wijmo.barcode.common {
    







export class QRCodeModel1 extends QRCodeBase{
    encodeData (sets?, connectionInfo?) {
        const {charCountIndicatorBitsNumber, charCode} = this;
        let buffer = new wijmo.barcode.BitBuffer();
        buffer.put(0, 4);
        if (connectionInfo) {
            buffer.put(MODE_INDICATOR.StructuredAppend, 4);
            buffer.put(connectionInfo.connectionNo, 4);
            buffer.put(connectionInfo.connectionCnt - 1, 4);
            buffer.put(getParityData(charCode), 8);
        }
        
        sets.forEach((set) => {
            if (!set.code) {
                return;
            }
            let data;
            switch (set.mode) {
            case 'Numeric':
                data = new ModeNumeric(set.code);
                break;
            case 'Alphanumeric':
                data = new ModeAlphanumeric(set.code);
                break;
            case '8BitByte':
                data = new Mode8BitByte(set.code);
                break;
            case 'Kanji':
                data = new ModeKanji(set.code);
                break;
            }

            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), charCountIndicatorBitsNumber[data.mode]);
            data.write(buffer);
        });

        return buffer;
    }

    getFinalMessage (blocks?) {
        let data = [];

        const dataBlocks = blocks.map(block => block.data);
        const ecBlocks = blocks.map(block => block.ec);

        dataBlocks.forEach((db) => data = data.concat(db));
        ecBlocks.forEach((db) => data = data.concat(db));
        return data;
    }
    
    // Module placement in matrix
    setModules (data?) {
        let { modulesCount} = this;
        this.modules = createModules(modulesCount);
        this.addPositionDetectionPattern();

        this.addExtensionPattern();
        
        this.addTimingPattern();

        this.maskModules(data);
    }

    maskModules (data?) {
        const {modules, errorCorrectionLevel, model, config: { mask }} = this;
        if (mask ==='auto') {
            this.autoMask(data);
        } else {
            let maskFunc = getMaskFunc(mask);
            this.maskPattern = mask;
            let newModules = addFormatInformation(modules, mask, errorCorrectionLevel, model);
            this.modules = this.fillDataModules(newModules, data, maskFunc);
        }
    }

    autoMask (data?) {
        const { modules, errorCorrectionLevel, model } = this;
        let result, score, pattern;

        maskFuncs.forEach((fn, i) => {
            let newModules = addFormatInformation(modules, i, errorCorrectionLevel, model);
            let _mod = this.fillDataModules(newModules, data, fn);
            let _score = getMaskScore(_mod);
            //
            if (!score || _score < score) {
                result = _mod;
                score = _score;
                pattern = i;
            }
        });

        this.modules = result;
        this.maskPattern = pattern;
    }
    
    addExtensionPattern ()  {
        const {modules, version} = this;
        const modulesCount = modules.length;
        //Extension Data at the corner
        modules[modulesCount - 1][modulesCount - 1] = 1;
        modules[modulesCount - 2][modulesCount - 1] = 0;
        modules[modulesCount - 1][modulesCount - 2] = 0;
        modules[modulesCount - 2][modulesCount - 2] = 0;
        
        let count = Math.floor(version / 2);
        if (wijmo.barcode.Utils.isEven(version)) {
            for (let i = 0; i < count; i++) {
                this.addBaseExtension(13 + i * 8);
                this.addRightExtension(13 + i * 8 );
            }
        } else {
            for (let i = 0; i < count; i++) {
                this.addBaseExtension(17 + i * 8 );
                this.addRightExtension(17 + i * 8);
            }
        }
    }
    addBaseExtension (x) {
        const {modules} = this;
        const modulesCount = modules.length;
        let lightRow = modulesCount - 2,
            darkRow = modulesCount - 1;
        modules[lightRow][x] = 0;
        modules[lightRow][x + 1] = 0;
        modules[lightRow][x + 2] = 0;
        modules[lightRow][x + 3] = 0;
        modules[darkRow][x] = 1;
        modules[darkRow][x + 1] = 1;
        modules[darkRow][x + 2] = 1;
        modules[darkRow][x + 3] = 1;
    }
    addRightExtension (x) {
        const {modules} = this;
        const modulesCount = modules.length;
        let lightCol = modulesCount - 2,
            darkCol = modulesCount - 1;
        modules[x][lightCol] = 0;
        modules[x + 1][lightCol] = 0;
        modules[x + 2][lightCol] = 0;
        modules[x + 3][lightCol] = 0;
        modules[x][darkCol] = 1;
        modules[x + 1][darkCol] = 1;
        modules[x + 2][darkCol] = 1;
        modules[x + 3][darkCol] = 1;
    }

    fillDataModules (modules, data, maskFunc) {
        const modulesCount = modules.length;
        let x, y;
        x = y = modulesCount - 1;
        let xmax = 2;
        let bf = new wijmo.barcode.BitBuffer(data);
        bf.next();
        bf.next();
        bf.next();
        bf.next();
        while (x >= 0) {
            if( x == modulesCount - 5 ) {
                xmax = 4;
            } else if( x == 8 ) {
                xmax = 2;
            } else if( x == 6 ) {
                x--;
                continue;
            } 
            while (y >= 0) {
                if (modules[y][x] !== null) {
                    y--;
                    continue;
                } else {
                    for (let i = 0; i < xmax; i++) {
                        let dark = bf.next();

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
    }

    getMatrix () {
        let { charCode } = this;
        let datas = this.analysisData(charCode);
        let buffer = this.encodeData(datas);
        let newBuffer = this.processConnection(buffer);
        this.padBuffer(newBuffer);
        let blocks = this.generateErrorCorrectionCode(newBuffer);
        let data = this.getFinalMessage(blocks);

        this.setModules(data);
        return this.modules;
    }
}
    }
    


    module wijmo.barcode.common {
    



export class QRCodeEncoder extends wijmo.barcode.TwoDimensionalBarcode {
    static DefaultConfig = {
        version: 'auto',
        errorCorrectionLevel: 'L',
        model: 2,
        mask: 'auto',
        connection: false,
        connectionNo: 0,
        charCode: undefined,
        charset: 'UTF-8', //'Shift_JIS'
        quietZone: {
            top: 4,
            left: 4,
            right: 4,
            bottom: 4
        }
    };

    private innerQRCode: any;
    constructor(option) {
        option.merge(QRCodeEncoder.DefaultConfig);
        super(option);
        const { encodeConfig: { text }, config } = this;
        let innerQRCode;
        if (config.model == '2') {
            innerQRCode = new QRCodeModel2(text, config);
        } else {
            innerQRCode = new QRCodeModel1(text, config);
        }

        this.innerQRCode = innerQRCode;
    }

    calculateData() {
        return this.innerQRCode.getMatrix();
    }

    validate() {
        const { version, model, charset, charCode, connectionNo } = this.config;
        const { text } = this.encodeConfig;
        //text or charCode is require

        if (!text && (!charCode || charCode.length === 0)) {
            throw new wijmo.barcode.InvalidTextException(text);
        }
        if (model != '1' && model != '2') {
            throw new wijmo.barcode.InvalidOptionsException({ model });
        }

        if (charset != 'UTF-8' && charset != 'Shift_JIS') {
            throw new wijmo.barcode.InvalidOptionsException({ charset });
        }

        if (model == '1' && wijmo.barcode.Utils.isNumberLike(version) && (version < 1 || version > 14)) {
            throw new wijmo.barcode.InvalidOptionsException({ version }, 'Model 1 only support version 1 - 14.');
        }
        if (model == '2' && wijmo.barcode.Utils.isNumberLike(version) && (version < 1 || version > 40)) {
            throw new wijmo.barcode.InvalidOptionsException({ version }, 'Model 2 only support version 1 - 40.');
        }

        if (connectionNo > 15 || connectionNo < 0) {
            throw new wijmo.barcode.InvalidOptionsException({ connectionNo }, 'ConnectionNo is in range 0 - 15.');
        }
    }
}

    }
    


    module wijmo.barcode.common {
    


wijmo.barcode.Barcode.registerEncoder('QRCode', QRCodeEncoder);
    }
    


    module wijmo.barcode.common {
    

const TableCode128A = [
    ' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', // 0
    '*', '+', ',', '-', '.', '/', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', ':', ';', '<', '=',
    '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
    'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', // 5
    '\\', ']', '^', '_',
    '\u0000', '\u0001', '\u0002', '\u0003', '\u0004', '\u0005', '\u0006', '\u0007', '\u0008', '\u0009',
    '\u000a', '\u000b', '\u000c', '\u000d', '\u000e', '\u000f', '\u0010', '\u0011', '\u0012', '\u0013',
    '\u0014', '\u0015', '\u0016', '\u0017', '\u0018', '\u0019', '\u001a', '\u001b', '\u001c', '\u001d',
    '\u001e', '\u001f',
    ' ', ' ', ' ', ' ', ' ',
    ' ', ' ', ' ', ' ', ' '
];

const TableCode128B = [
    ' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', // 0
    '*', '+', ',', '-', '.', '/', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', ':', ';', '<', '=',
    '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
    'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', // 5
    '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e',
    'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
    'z', '{', '|', '}', '~', '\u007f', ' ', ' ', ' ', ' ',
    ' ', ' ', ' ', ' ', ' ', ' '
];

const TableCode128Data = [
    '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213', // 0
    '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
    '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
    '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
    '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
    '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111', // 5
    '314111', '221411', '431111', '111224',
    '111422', '121124', '121421', '141122', '141221', '112214',
    '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
    '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
    '214121', '412121', '111143', '111341', '131141',
    '114113', // /DEL
    '114311', // FNC3
    '411113', // FNC2
    '411311', // SHIFT
    '113141', // CODEC

    '114131', // 100    CODEB/FNC4/CODEB
    '311141', // FNC4/CODEA/CODEA
    '411131', // FNC1

    '211412', // START (Code A) 103
    '211214', // START (Code B) 104
    '211232' // START (Code C)  105
];

export const stopPattern = '2331112';

export const Code128Sym = {
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

export const Code128Char = {
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

export function getCharValue (str, table) {
    if (str === Code128Char.FNC1) {
        return Code128Sym.FNC1;
    } else if (str === Code128Char.FNC2) {
        return Code128Sym.FNC2;
    } else if (str === Code128Char.FNC3) {
        return Code128Sym.FNC3;
    }
    let value;
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

export function getCharPattern (str, table) {
    const result = TableCode128Data[getCharValue(str, table)];
    if (!result) {
        throw new wijmo.barcode.InvalidCharacterException(str);
    }
    return result;
}

export function getPatternByIndex (index) {
    return TableCode128Data[index];
} 

export function encode (str) {
    let data = '';

    wijmo.barcode.Utils.str2Array(str).forEach((n, index) => {
        if (wijmo.barcode.Utils.isEven(index)) {
            data += wijmo.barcode.Utils.strRepeat('1', +n);
        } else {
            data += wijmo.barcode.Utils.strRepeat('0', +n);
        }
    });

    return data;
}
    }
    


    module wijmo.barcode.common {
    


const CODE_SET_A = 'A', CODE_SET_B = 'B', CODE_SET_C = 'C';

export class Code128Auto {
    private text: any;
    private isUccEan128: any;
    constructor (text, isUccEan128 = false) {
        this.text = text;
        this.isUccEan128 = isUccEan128;
        this.validate();
    }

    validate() {
        let { text } = this;

        const reg = /^[\x00-\x7F\xC8-\xD3]+$/;  //eslint-disable-line
        if (!reg.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text);
        }
    }

    calculateGroup () {
        let { text, isUccEan128 } = this;

        // GS1-128 (former UCC-128 or EAN-128) barcode assumes, that it started from code C: http://www.idautomation.com/barcode-faq/code-128/
        // assume code B is default code for code128auto, we'll use this
        let last = {code: isUccEan128 ? CODE_SET_C : CODE_SET_B, text: ''}, groups = [];
        groups.push(last);
        
        for (let i = 0, len = text.length; i < len; i++) {
            let newCode = last.code, str = text[i];

            // attempt to switch to code C if there 4 subsequent digits or
            // ... stay with CodeC if there're 2 more digits
            if (last.code !== CODE_SET_C && i + 3 < len && wijmo.barcode.Utils.isNumberLike(text.substr(i , 4)) || last.code === CODE_SET_C && i + 1 < len && wijmo.barcode.Utils.isNumberLike(text.substr(i , 2))) {
                newCode = CODE_SET_C;
                str += text[++i];
            } else {
                newCode = last.code === CODE_SET_C ? CODE_SET_B : last.code;

                if (getCharValue(str, newCode) < 0) {
                    newCode = last.code === CODE_SET_A ? CODE_SET_B : CODE_SET_A;

                    if (getCharValue(str, newCode) < 0) {
                        continue;
                    }
                }
            }

            if (last.code !== newCode) {
                last = {code: newCode, text: str};
                groups.push(last);
            } else {
                last.text += str;
            }
        }

        return groups.filter(g => g.text);
    }

    getData () {
        const groups = this.calculateGroup();
        const checkDigit = this.checksum(groups);
        let data = '';
        
        groups.forEach((g, i) => {
            if (i === 0) {
                let pattern = getPatternByIndex(Code128Sym['Start' + g.code]);
                data += encode(pattern);
            } else {
                let pattern = getPatternByIndex(Code128Sym['Code' + g.code]);
                data += encode(pattern);
            }

            if (g.code === CODE_SET_C) {
                wijmo.barcode.Utils.sliceString(g.text, 2, (char) => {
                    data += encode(getCharPattern(char, g.code));
                });
            } else {
                wijmo.barcode.Utils.sliceString(g.text, 1, (char) => {
                    data += encode(getCharPattern(char, g.code));
                });
            }
        });

        data += encode(getPatternByIndex(checkDigit));

        data += encode(stopPattern);

        return data;
    }

    checksum (groups) {
        let weight = 0, sum = 0;

        groups.forEach((chunk, i) => {
            let { code, text } = chunk;
            if (i === 0) {
                sum += Code128Sym['Start' + code];
            } else {
                let value = Code128Sym['Code' + code];
                sum += value * ++weight;
            }

            if (code === CODE_SET_C) {
                wijmo.barcode.Utils.sliceString(text, 2, (char) => {
                    sum += getCharValue(char, code) * (++weight);
                });
            } else {
                wijmo.barcode.Utils.sliceString(text, 1, (char) => {
                    sum += getCharValue(char, code) * (++weight);
                });
            }

        });

        return sum % 103;
    }
}
    }
    


    module wijmo.barcode.common {
    


export class Code128C {
    private text: any;
    constructor (text) {
        this.text = text;
        this.validate();
    }

    validate() {
        let { text } = this;

        const reg = /^(\xCF*[0-9]{2}\xCF*)+$/;  //eslint-disable-line
        if (!reg.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text);
        }
    }

    getData () {
        let {text} = this;
        const checkDigit = this.checksum();
        let data = '';
        let startPattern = getPatternByIndex(Code128Sym.StartC);
        data += encode(startPattern);
        wijmo.barcode.Utils.sliceString(text, 2, (char) => {
            let pattern = getCharPattern(char, 'C');
            data += encode(pattern);
        });
        
        data += encode(getPatternByIndex(checkDigit));

        data += encode(stopPattern);

        return data;
    }

    checksum () {
        let {text} = this;
        let weight = 0, sum = 0;
        wijmo.barcode.Utils.sliceString(text, 2, (char) => {
            sum += getCharValue(char, 'C') * (++weight);
        });
        sum += Code128Sym.StartC;
        return sum % 103;
    }
}
    }
    


    module wijmo.barcode.common {
    


export class Code128B {
    private text: any;
    constructor (text) {
        this.text = text;
        this.validate();
    }

    validate() {
        let { text } = this;

        const reg = /^[\x20-\x7F\xC8-\xCF]+$/;  //eslint-disable-line
        if (!reg.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text);
        }
    }

    getData () {
        let {text} = this;
        const checkDigit = this.checksum();
        let data = '';
        let startPattern = getPatternByIndex(Code128Sym.StartB);
        data += encode(startPattern);

        wijmo.barcode.Utils.sliceString(text, 1, (char) => {
            let pattern = getCharPattern(char, 'B');
            data += encode(pattern);
        });
        
        data += encode(getPatternByIndex(checkDigit));

        data += encode(stopPattern);

        return data;
    }

    checksum () {
        let {text} = this;
        let weight = 0, sum = 0;
        wijmo.barcode.Utils.sliceString(text, 1, (char) => {
            sum += getCharValue(char, 'B') * (++weight);
        });

        sum += Code128Sym.StartB;
        return sum % 103;
    }
}
    }
    


    module wijmo.barcode.common {
    


export class Code128A {
    private text: any;
    constructor (text) {
        this.text = text;
        this.validate();
    }

    validate () {
        let { text } = this;

        const reg = /^[\x00-\x5F\xC8-\xCF]+$/;  //eslint-disable-line
        if (!reg.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text);
        }
    }

    getData () {
        let {text} = this;
        const checkDigit = this.checksum();
        let data = '';
        let startPattern = getPatternByIndex(Code128Sym.StartA);
        data += encode(startPattern);

        wijmo.barcode.Utils.sliceString(text, 1, (char) => {
            let pattern = getCharPattern(char, 'A');
            data += encode(pattern);
        });
        
        data += encode(getPatternByIndex(checkDigit));

        data += encode(stopPattern);
        return data;
    }

    checksum () {
        let {text} = this;
        let weight = 0, sum = 0;

        wijmo.barcode.Utils.sliceString(text, 1, (char) => {
            sum += getCharValue(char, 'A') * (++weight);
        });
        sum += Code128Sym.StartA;
        return sum % 103;
    }
}
    }
    


    module wijmo.barcode.common {
    






export class Code128Encoder extends wijmo.barcode.OneDimensionalBarcode {
    static DefaultConfig = {
        codeSet: 'auto', //A B C auto
        quietZone: {
            right: 10,
            left: 10
        },
    };

    private isUccEan128: boolean;
    constructor (option, isUccEan128 = false) {
        option.merge(Code128Encoder.DefaultConfig);
        super(option);
        let { text } = this.encodeConfig;

        this.isUccEan128 = isUccEan128;
        if (isUccEan128 && text[0] !== Code128Char.FNC1) {
            text = Code128Char.FNC1 + text;
        }

        this.text = text;
        this.label = text.replace(/[^\x20-\x7E]/g, '');
    }

    validate () {
        return;
    }

    calculateData () {
        let { config: { codeSet }, text, isUccEan128 } = this;
        let innerEncoder;
        if (isUccEan128) {
            innerEncoder = new Code128Auto(text);
        } else {
            switch (codeSet) {
            case 'A':
                innerEncoder = new Code128A(text);
                break;
            case 'B':
                innerEncoder = new Code128B(text);
                break;
            case 'C':
                innerEncoder = new Code128C(text);
                break;
            default:
                innerEncoder = new Code128Auto(text);
            }
        }
        
        return innerEncoder.getData();
    }
}

    }
    


    module wijmo.barcode.common {
    

export class GS1_128Encoder extends Code128Encoder {
    constructor (option) {
        super(option, true);
    }
}

    }
    


    module wijmo.barcode.common {
    


wijmo.barcode.Barcode.registerEncoder('GS1_128', GS1_128Encoder);

    }
    


    module wijmo.barcode.common {
    


wijmo.barcode.Barcode.registerEncoder('Code128', Code128Encoder);

    }
    


    module wijmo.barcode.common {
    

export class EncodeTable_Code39 {
    static TABLE = {
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

    static MODULO_43_CHECK_TABLE = wijmo.barcode.Utils.str2Array('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%');

    static FULL_ASCII_TABLE = [
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

    static getMod43Val (text) {
        let sum = 0;
    
        wijmo.barcode.Utils.sliceString(text, 1, (char) => {
            sum += EncodeTable_Code39.MODULO_43_CHECK_TABLE.indexOf(char);
        });
        return EncodeTable_Code39.MODULO_43_CHECK_TABLE[sum % 43];
    }

    static getFullASCIIChar (text) {
        let str = '';
        wijmo.barcode.Utils.sliceString(text, 1, (char) => {
            let c = EncodeTable_Code39.FULL_ASCII_TABLE[char.charCodeAt(0)];
            if (c) {
                str += c;
            } else {
                throw new wijmo.barcode.InvalidTextException(text);
            }
        });
    
        return str;
    }
}
    }
    


    module wijmo.barcode.common {
    


export class Code39Encoder extends wijmo.barcode.OneDimensionalBarcode {
    static DefaultConfig = {
        checkDigit: false,
        fullASCII: false,
        nwRatio: 3,
        labelWithStartAndStopCharacter: false,
        quietZone: {
            right: 10,
            left: 10
        }
    };

    static START_STOP_CHARACTERS = '*';

    private nwRatio: any;
    constructor (option) {
        option.merge(Code39Encoder.DefaultConfig);
        super(option);
        let { encodeConfig: { text, hideExtraChecksum } , config: { checkDigit, fullASCII, nwRatio, labelWithStartAndStopCharacter }} = this;
        
        let _text = fullASCII ? EncodeTable_Code39.getFullASCIIChar(text) : text;

        if (checkDigit) {
            const checkDigit = EncodeTable_Code39.getMod43Val(_text);
            this.text = Code39Encoder.START_STOP_CHARACTERS + _text + checkDigit + Code39Encoder.START_STOP_CHARACTERS;
            const labelWithoutPattern = hideExtraChecksum ? text : text + checkDigit;
            const labelWithPattern = Code39Encoder.START_STOP_CHARACTERS + labelWithoutPattern + Code39Encoder.START_STOP_CHARACTERS;
            this.label = labelWithStartAndStopCharacter ? labelWithPattern : labelWithoutPattern;
        } else {
            this.text = Code39Encoder.START_STOP_CHARACTERS + _text + Code39Encoder.START_STOP_CHARACTERS;
            const labelWithoutPattern = text;
            const labelWithPattern = Code39Encoder.START_STOP_CHARACTERS + labelWithoutPattern + Code39Encoder.START_STOP_CHARACTERS;
            this.label = labelWithStartAndStopCharacter ? labelWithPattern : labelWithoutPattern;
        }

        this.nwRatio = +nwRatio;
    }

    validate () {
        let { encodeConfig: { text } , config: { fullASCII, nwRatio }} = this;
        //A-Z 0 - 9  space $ % + - . /
        const reg = /^[0-9A-Z\-\.\ \$\/\+\%]+$/;  //eslint-disable-line
        if (!fullASCII && !reg.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text);
        }

        if (nwRatio != 2 && nwRatio != 3) {
            throw new wijmo.barcode.InvalidOptionsException({nwRatio}, 'NwRatio is 2 or 3');
        }
    }

    encode (str) {
        let { nwRatio } = this;
        let data = '';
        const pattern1 = wijmo.barcode.Utils.strRepeat('1', nwRatio);
        const pattern0 = wijmo.barcode.Utils.strRepeat('0', nwRatio);
        wijmo.barcode.Utils.str2Array(str).forEach((item , index) => {
            if (wijmo.barcode.Utils.isEven(index)) {
                if (item === '1') {
                    data += pattern1;
                } else {
                    data += '1';
                }
            } else {
                if (item === '1') {
                    data += pattern0;
                } else {
                    data += '0';
                }
            }
        });

        return data;
    }

    calculateData () {
        let { text } = this;
        let data = '';

        wijmo.barcode.Utils.sliceString(text, 1, (char) => {
            data = data + this.encode(EncodeTable_Code39.TABLE[char]) + '0';
        });

        data = data.substr(0, data.length - 1);
        return data;
    }
}

    }
    


    module wijmo.barcode.common {
    


wijmo.barcode.Barcode.registerEncoder('Code39', Code39Encoder);
    }
    


    module wijmo.barcode.common {
    

export class EncodeTable {
    static TABLE = {
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

    static encodeCharByTable(char, tableName) {
        return EncodeTable.TABLE[tableName][char];
    }

    static encodeByStructure(text, structure) {
        let texts = wijmo.barcode.Utils.str2Array(text);
        return texts.reduce((result, char, index) => {
            result += EncodeTable.encodeCharByTable(char, structure[index]);
            return result;
        }, '');
    }

    static encodeByTable(text, tableName) {
        if (text.length > 1) {
            let texts = wijmo.barcode.Utils.str2Array(text);
            return texts.reduce((result, char) => {
                result += EncodeTable.encodeCharByTable(char, tableName);
                return result;
            }, '');
        }

        return EncodeTable.encodeCharByTable(text, tableName);
    }
}
    }
    


    module wijmo.barcode.common {
    


export class AddOnSymbol {
    private addOn: any;
    private isTextGroup: any;
    private addOnHeight: any;

    static fiveDigitAddOnStructure = [
        'BBAAA', 'BABAA', 'BAABA', 'BAAAB', 'ABBAA', 'AABBA', 'AAABB', 'ABABA', 'ABAAB', 'AABAB'
    ];
    static ADD_ON_GUARD = '1011';
    static ADD_ON_DELINEATOR = '01';

    static get2DigitAddOnTable(num) {
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
    }

    static get5DigitAddOnTable(num) {
        num += '';

        const a = (+num[0]) + (+num[2]) + (+num[4]);
        const b = 3 * a;
        const c = (+num[1]) + (+num[3]);
        const d = 9 * c;
        const e = b + d;

        return AddOnSymbol.fiveDigitAddOnStructure[e % 10];
    }

    constructor(addOn, addOnHeight, isTextGroup, unitValue) {
        this.isTextGroup = isTextGroup;
        this.addOn = '' + addOn;
        if (addOnHeight !== 'auto') {
            if (wijmo.barcode.Utils.isNumberLike(addOnHeight)) {
                addOnHeight = +addOnHeight;
            } else {
                addOnHeight = wijmo.barcode.Utils.convertUnit(wijmo.barcode.Utils.fixSize2PixelDefault(addOnHeight));
                addOnHeight = addOnHeight / unitValue;
            }
        }

        this.addOnHeight = addOnHeight;
        this.validate();
    }

    validate() {
        const { addOn } = this;
        if (addOn.length !== 2 && addOn.length !== 5) {
            throw new wijmo.barcode.InvalidOptionsException({addOn}, 'Add on length should be 2 or 5.');
        }
    }

    _encode2DigitAddOn() {
        let { addOn, isTextGroup } = this;
        const data = [];
        let structure, leftBinary, rightBinary;
        structure = AddOnSymbol.get2DigitAddOnTable(addOn);
        leftBinary = EncodeTable.encodeByTable(addOn[0], structure.leftStructure[0]);
        rightBinary = EncodeTable.encodeByTable(addOn[1], structure.rightStructure[0]);

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
        } else {
            data.push({
                binary: AddOnSymbol.ADD_ON_GUARD + leftBinary + AddOnSymbol.ADD_ON_DELINEATOR + rightBinary,
                text: addOn,
                role: 'ADDON'
            });
        }

        return data;
    }

    _encode5DigitAddOn() {
        let { addOn, isTextGroup } = this;
        const data = [];
        let structure = AddOnSymbol.get5DigitAddOnTable(addOn);

        if (isTextGroup) {
            data.push({
                binary: AddOnSymbol.ADD_ON_GUARD,
                role: 'ADDON'
            });

            wijmo.barcode.Utils.str2Array(addOn).forEach((char, index) => {
                data.push({
                    binary: EncodeTable.encodeByTable(char, structure[index]),
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
        } else {
            let binary = wijmo.barcode.Utils.str2Array(addOn).reduce((result, char, index) => {
                result += EncodeTable.encodeByTable(char, structure[index]);
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
    }

    calculateData() {
        let { addOn } = this;
        let data = [];
        if (addOn.length === 2) {
            data = this._encode2DigitAddOn();
        } else if (addOn.length === 5) {
            data = this._encode5DigitAddOn();
        }

        data.push({
            text: '>',
            role: 'ADDON_RIGHT_QUIET_ZONE'
        });

        return data;
    }
}
    }
    


    module wijmo.barcode.common {
    


export abstract class EANBase extends wijmo.barcode.OneDimensionalBarcode {
    static NORMAL_GUARD = '101';
    static CENTRE_GUARD = '01010';
    static DefaultConfig: any = {
        quietZone: {
            right: 7,
            left: 11,
        },
    };
    protected isTextGroup: boolean;
    private isAddOnLabelBottom: boolean;
    protected addOn: AddOnSymbol;
    private addOnHeight: number|string;

    constructor(option) {
        option.merge(EANBase.DefaultConfig);
        super(option);
        let { style: { textAlign, unitValue }, config: { addOnLabelPosition, addOn, addOnHeight } } = this;
        this.isTextGroup = textAlign === 'group';
        this.isAddOnLabelBottom = addOnLabelPosition !== 'top';
        this._setAddOn(addOn, addOnHeight, unitValue);
    }

    _setAddOn(addOn, addOnHeight, unitValue) {
        if (wijmo.barcode.Utils.isDefined(addOn)) {
            this.addOn = new AddOnSymbol(addOn, addOnHeight, this.isTextGroup, unitValue);
            this.addOnHeight = (this.addOn as any).addOnHeight;
        } else {
            this.addOnHeight = 0;
        }
    }

    checksum(number, evenMultiply3 = false) {
        let numberArray = wijmo.barcode.Utils.str2Array(number);
        let fn = evenMultiply3 ? wijmo.barcode.Utils.isOdd : wijmo.barcode.Utils.isEven;

        let sum = numberArray.reduce((sum, num, index) => {
            num = +num;
            sum += fn(index) ? num : num * 3;
            return sum;
        }, 0);
        let remainder = sum % 10;
        if (remainder === 0) {
            return 0;
        }

        return 10 - remainder;
    }

    convertToShape(data) {
        let { isTextGroup, addOnHeight, isAddOnLabelBottom, style: { textAlign }, encodeConfig: { isLabelBottom, height, quietZone, showLabel, fontSizeInUnit } } = this;

        if (!showLabel) {
            fontSizeInUnit = 0;
        }
        addOnHeight = addOnHeight || 0;

        const shapes = [];

        let guardHeight;

        let startX = quietZone.left,
            startY = quietZone.top,
            textY, totalMainHeight,
            addOnY, addOnLabelY, addOnBarHeight, totalAddOnHeight;

        if (isLabelBottom) {
            guardHeight = height + 5;
            textY = startY + height;
            totalMainHeight = showLabel ? (height + fontSizeInUnit) : guardHeight;
            if (isAddOnLabelBottom) {
                addOnY = startY;
                if (addOnHeight === 'auto') {
                    addOnBarHeight = showLabel ? height : guardHeight;
                } else {
                    addOnBarHeight = addOnHeight;
                }
                addOnLabelY = addOnY + addOnBarHeight;
            } else {
                addOnLabelY = startY;
                addOnY = startY + fontSizeInUnit;

                if (addOnHeight === 'auto') {
                    addOnBarHeight = guardHeight - fontSizeInUnit;
                } else {
                    addOnBarHeight = addOnHeight;
                }
            }
        } else {
            guardHeight = height;
            height = height - 5;
            textY = startY;
            startY = startY + fontSizeInUnit;

            totalMainHeight = showLabel ? (guardHeight + fontSizeInUnit) : guardHeight;
            if (isAddOnLabelBottom) {
                addOnY = quietZone.top;
                if (addOnHeight === 'auto') {
                    addOnBarHeight = showLabel ? height : guardHeight;
                } else {
                    addOnBarHeight = addOnHeight;
                }
                addOnLabelY = addOnY + addOnBarHeight;
            } else {
                addOnLabelY = quietZone.top;
                addOnY = quietZone.top + fontSizeInUnit;
                if (addOnHeight === 'auto') {
                    addOnBarHeight = guardHeight;
                } else {
                    addOnBarHeight = addOnHeight;
                }
            }
        }

        totalAddOnHeight = showLabel ? (addOnBarHeight + fontSizeInUnit) : addOnBarHeight;

        data.forEach((item) => {
            let y0 = startY, h = height, textY0 = textY, _textAlign = isTextGroup ? 'center' : textAlign,
                width, textX = startX;

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

                const textShape = {
                    type: 'text',
                    x: textX,
                    y: textY0,
                    text: item.text,
                    textAlign: _textAlign,
                    maxWidth: width
                };

                if (item.role === 'NO_ADDON_RIGHT_QUIET_ZONE' || item.role === 'ADDON_RIGHT_QUIET_ZONE') {
                    (textShape as any).fontStyle = 'normal';
                    (textShape as any).fontWeight = 'normal';
                    (textShape as any).textDecoration = 'none';
                }

                shapes.push(textShape);
            }

            if (item.binary) {
                wijmo.barcode.Utils.combineTruthy(item.binary)
                    .forEach((num) => {
                        if (num !== 0) {
                            shapes.push({
                                type: 'rect',
                                x: startX,
                                y: y0,
                                width: num,
                                height: h
                            });
                            startX += num;
                        } else {
                            startX++;
                        }
                    });
            } else {
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
    }

    afterApplyDesiredSize() {
        let { config: { addOn, addOnHeight }, style: { unitValue } } = this;
        this._setAddOn(addOn, addOnHeight, unitValue);
        if (this.addOnHeight > this.encodeConfig.height) {
            this.addOnHeight = this.encodeConfig.height;
        }
    }
}
    }
    


    module wijmo.barcode.common {
    



export class UPC_E extends EANBase {
    static DefaultConfig = {
        addOnHeight: 'auto',
        addOnLabelPosition: 'top',
        quietZone: {
            left: 9,
            addOn: 5
        },
    };

    static SPECIAL_GUARD = '010101';
    private prefix: any;
    private tableStructure: any;
    constructor(option, prefix, tableStructure) {
        option.merge(UPC_E.DefaultConfig);
        super(option);
        let { text, hideExtraChecksum } = this.encodeConfig;
        this.prefix = prefix;
        let label = text;
        if (text.length < 7) {
            text += this.checksum(text);
            if (!hideExtraChecksum) {
                label = text;
            }
        }
        
        this.label = label;
        this.text = text;
        this.tableStructure = tableStructure;
    }

    validate() {
        const { text } = this.encodeConfig;

        const reg = /^(\d{6}|\d{7})$/;
        if (!reg.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text, 'Text should be numbers. The length should be 6 or 7.');
        }

        if (text.length === 7) {
            let checkDigit = this.checksum(text.substr(0, 6));

            if (checkDigit != text[6]) {
                throw new wijmo.barcode.InvalidTextException(text, 'Check digit is invalid.');
            }
        }
    }

    checksum(text){
        let str;
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

        return super.checksum(str, true);
    }

    calculateData() {
        let { text, addOn, isTextGroup, prefix, tableStructure, label } = this;

        const checkDigit = text[6];
        const checkDigitLabel = label[6];
        text = text.substr(0, 6);
        const labelWithoutCheckDigit = label.substr(0, 6);
        const structure = tableStructure[checkDigit];

        let data = [];
        data.push({
            text: prefix,
            role: 'LEFT_QUIET_ZONE'
        });
        data.push({
            binary: EANBase.NORMAL_GUARD,
            role: 'GUARD'
        });

        if (isTextGroup) {
            wijmo.barcode.Utils.str2Array(text).forEach((c, i) => {
                data.push({
                    binary: EncodeTable.encodeByTable(c, structure[i]),
                    text: labelWithoutCheckDigit[i]
                });
            });
        } else {
            data.push({
                binary: EncodeTable.encodeByStructure(text, structure),
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
        } else {
            data.push({
                text: checkDigitLabel,
                role: 'ADDON_QUIET_ZONE'
            });
            data = data.concat(addOn.calculateData());
        }

        return data;
    }
}
    }
    


    module wijmo.barcode.common {
    

export class UPC_E1_Encoder extends UPC_E {
    static structure = [
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
    constructor(option) {
        super(option, '1', UPC_E1_Encoder.structure);
    }
}
    }
    


    module wijmo.barcode.common {
    

export class UPC_E0_Encoder extends UPC_E {
    static structure = [
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
    constructor(option) {
        super(option, '0', UPC_E0_Encoder.structure);
    }
}
    }
    


    module wijmo.barcode.common {
    



export class UPC_A_Encoder extends EANBase {
    static DefaultConfig = {
        addOnHeight: 'auto',
        addOnLabelPosition: 'top',
        quietZone: {
            right: 9,
            left: 9,
            addOn: 5,
        },
    };

    constructor(option) {
        option.merge(UPC_A_Encoder.DefaultConfig);
        super(option);
        let { text, hideExtraChecksum } = this.encodeConfig;
        let label = text;
        if (text.length < 12) {
            text += this.checksum(text, true);
            if (!hideExtraChecksum) {
                label = text;
            }
        }

        this.label = label;
        this.text = text;
    }

    validate() {
        const { text } = this.encodeConfig;

        const reg = /^(\d{11}|\d{12})$/;
        if (!reg.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text, 'Text should be numbers. The length should be 11 or 12.');
        }

        if (text.length === 12) {
            let checkDigit = this.checksum(text.substr(0, 11), true);

            if (checkDigit != text[11]) {
                throw new wijmo.barcode.InvalidTextException(text, 'Check digit is invalid.');
            }
        }
    }

    calculateData() {
        let { text, addOn, isTextGroup, label } = this;
        const firstNumber = text[0];
        const lastNumber = text[11];
        const lastLabel = label[11];
        let leftStr = text.substr(1, 5);
        let rightStr = text.substr(6, 5);
        let leftLabel = label.substr(1, 5);
        let rightLabel = label.substr(6, 5);
        let data = [];
        data.push({
            text: firstNumber,
            role: 'LEFT_QUIET_ZONE'
        });
        data.push({
            binary: EANBase.NORMAL_GUARD + EncodeTable.encodeByTable(firstNumber, 'A'),
            role: 'GUARD'
        });

        if (isTextGroup) {
            wijmo.barcode.Utils.str2Array(leftStr).forEach((c, i) => {
                data.push({
                    binary: EncodeTable.encodeByTable(c, 'A'),
                    text: leftLabel[i]
                });
            });
        } else {
            data.push({
                binary: EncodeTable.encodeByTable(leftStr, 'A'),
                text: leftLabel
            });
        }

        data.push({
            binary: EANBase.CENTRE_GUARD,
            role: 'GUARD'
        });

        if (isTextGroup) {
            wijmo.barcode.Utils.str2Array(rightStr).forEach((c, i) => {
                data.push({
                    binary: EncodeTable.encodeByTable(c, 'C'),
                    text: rightLabel[i]
                });
            });
        } else {
            data.push({
                binary: EncodeTable.encodeByTable(rightStr, 'C'),
                text: rightLabel
            });
        }

        data.push({
            binary: EncodeTable.encodeByTable(lastNumber, 'C') + EANBase.NORMAL_GUARD,
            role: 'GUARD'
        });

        if (!addOn) {
            data.push({
                text: lastLabel,
                role: 'NO_ADDON_RIGHT_QUIET_ZONE'
            });
        } else {
            data.push({
                text: lastLabel,
                role: 'ADDON_QUIET_ZONE'
            });
            data = data.concat(addOn.calculateData());
        }

        return data;
    }
}
    }
    


    module wijmo.barcode.common {
    




wijmo.barcode.Barcode.registerEncoder('UPC-A', UPC_A_Encoder);
wijmo.barcode.Barcode.registerEncoder('UPC-E0', UPC_E0_Encoder);
wijmo.barcode.Barcode.registerEncoder('UPC-E1', UPC_E1_Encoder);
    }
    


    module wijmo.barcode.common {
    



export class EAN13Encoder extends EANBase {
    static leftStructure = [
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

    static DefaultConfig: any = {
        addOnHeight: 'auto',
        addOnLabelPosition: 'top',
        quietZone: {
            addOn: 5
        },
    };

    constructor(option) {
        option.merge(EAN13Encoder.DefaultConfig);
        super(option);
        let { text, hideExtraChecksum } = this.encodeConfig;
        let label = text;
        if (text.length < 13) {
            text += this.checksum(text);
            if (!hideExtraChecksum) {
                label = text;
            }
        }

        this.label = label;
        this.text = text;
    }

    validate() {
        const { text } = this.encodeConfig;

        //first char is 1-9
        const reg = /^[1-9](\d{11}|\d{12})$/;
        if (!reg.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text, 'Text should be numbers. And it should not start with 0. The length should be 12 or 13.');
        }

        if (text.length === 13) {
            let checkDigit = this.checksum(text.substr(0, 12));

            if (checkDigit != text[12]) {
                throw new wijmo.barcode.InvalidTextException(text, 'Check digit is invalid.');
            }
        }
    }

    calculateData() {
        let { text, addOn, isTextGroup, label } = this;
        let leftStr = text.substr(1, 6);
        let rightStr = text.substr(7, 6);
        let leftLabel = label.substr(1, 6);
        let rightLabel = label.substr(7, 6);
        const leftStructure = EAN13Encoder.leftStructure[text[0]];
        let data = [];
        data.push({
            text: text[0],
            role: 'LEFT_QUIET_ZONE'
        });
        data.push({
            binary: EANBase.NORMAL_GUARD,
            role: 'GUARD'
        });

        if (isTextGroup) {
            wijmo.barcode.Utils.str2Array(leftStr).forEach((c, i) => {
                data.push({
                    binary: EncodeTable.encodeByTable(c, leftStructure[i]),
                    text: leftLabel[i]
                });
            });
        } else {
            data.push({
                binary: EncodeTable.encodeByStructure(leftStr, leftStructure),
                text: leftLabel
            });
        }

        data.push({
            binary: EANBase.CENTRE_GUARD,
            role: 'GUARD'
        });

        if (isTextGroup) {
            wijmo.barcode.Utils.str2Array(rightStr).forEach((c, i) => {
                data.push({
                    binary: EncodeTable.encodeByTable(c, 'C'),
                    text: rightLabel[i]
                });
            });
        } else {
            data.push({
                binary: EncodeTable.encodeByTable(rightStr, 'C'),
                text: rightLabel
            });
        }

        data.push({
            binary: EANBase.NORMAL_GUARD,
            role: 'GUARD'
        });

        if (!addOn) {
            data.push({
                text: '>',
                role: 'NO_ADDON_RIGHT_QUIET_ZONE'
            });
        } else {
            data.push({
                role: 'ADDON_QUIET_ZONE'
            });
            data = data.concat(addOn.calculateData());
        }

        return data;
    }
}
    }
    


    module wijmo.barcode.common {
    



export class EAN8Encoder extends EANBase {
    static DefaultConfig = {
        quietZone: {
            left: 7,
        },
    };

    constructor(option) {
        option.merge(EAN8Encoder.DefaultConfig);
        super(option);
        let { text, hideExtraChecksum } = this.encodeConfig;
        let label = text;
        if (text.length < 8) {
            text += this.checksum(text, true);

            if (!hideExtraChecksum) {
                label = text;
            }
        }

        this.label = label;
        this.text = text;
    }

    validate() {
        const { text } = this.encodeConfig;

        const reg = /^[0-9](\d{6}|\d{7})$/;
        if (!reg.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text, 'Text should be numbers. The length should be 7 or 8.');
        }

        if (text.length === 8) {
            let checkDigit = this.checksum(text.substr(0, 7), true);

            if (checkDigit != text[7]) {
                throw new wijmo.barcode.InvalidTextException(text, 'Check digit is invalid.');
            }
        }
    }

    calculateData() {
        let { text, label, isTextGroup } = this;
        let leftStr = text.substr(0, 4);
        let rightStr = text.substr(4, 4);
        let leftLabel = label.substr(0, 4);
        let rightLabel = label.substr(4, 4);

        const data = [];
        data.push({
            text: '<',
            role: 'LEFT_QUIET_ZONE'
        });
        data.push({
            binary: EANBase.NORMAL_GUARD,
            role: 'GUARD'
        });

        if (isTextGroup) {
            wijmo.barcode.Utils.str2Array(leftStr).forEach((c, i) => {
                data.push({
                    binary: EncodeTable.encodeByTable(c, 'A'),
                    text: leftLabel[i]
                });
            });
        } else {
            data.push({
                binary: EncodeTable.encodeByTable(leftStr, 'A'),
                text: leftLabel
            });
        }

        data.push({
            binary: EANBase.CENTRE_GUARD,
            role: 'GUARD'
        });

        if (isTextGroup) {
            wijmo.barcode.Utils.str2Array(rightStr).forEach((c, i) => {
                data.push({
                    binary: EncodeTable.encodeByTable(c, 'C'),
                    text: rightLabel[i]
                });
            });
        } else {
            data.push({
                binary: EncodeTable.encodeByTable(rightStr, 'C'),
                text: rightLabel
            });
        }

        data.push({
            binary: EANBase.NORMAL_GUARD,
            role: 'GUARD'
        });

        data.push({
            text: '>',
            role: 'RIGHT_QUIET_ZONE'
        });

        return data;
    }
}
    }
    


    module wijmo.barcode.common {
    



wijmo.barcode.Barcode.registerEncoder('EAN8', EAN8Encoder);
wijmo.barcode.Barcode.registerEncoder('EAN13', EAN13Encoder);

    }
    


    module wijmo.barcode.common {
    

const REG = /^([A-D]?)([0-9\-\$\:\.\+\/]+)([A-D]?)$/; //eslint-disable-line

export class CodabarEncoder extends wijmo.barcode.OneDimensionalBarcode {
    static DefaultConfig = {
        checkDigit: false,
        quietZone: {
            right: 10,
            left: 10
        },
        nwRatio: 3
    };

    static TABLE = {
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

    private nwRatio: any;
    constructor (option) {
        option.merge(CodabarEncoder.DefaultConfig);
        super(option);
        let { config: { checkDigit, nwRatio }, encodeConfig: { text, hideExtraChecksum } } = this;

        const {originStartPattern, startPattern, content, originStopPattern, stopPattern} = this.getTextEntity(text);

        this.label = text;
        if (checkDigit) {
            let checksum = this.checksum(content);
            this.text = startPattern + content + checksum + stopPattern;

            if (!hideExtraChecksum) {
                this.label = originStartPattern + content + checksum + originStopPattern;
            }
        } else {
            this.text = startPattern + content + stopPattern;
        }

        this.nwRatio = +nwRatio;
    }

    validate () {
        let { config: { nwRatio }, encodeConfig: { text } } = this;
        // [0-9] - $ : / . + A B C D
        if (!REG.test(text)) {
            throw new wijmo.barcode.InvalidTextException(text);
        }

        if (nwRatio != 2 && nwRatio != 3) {
            throw new wijmo.barcode.InvalidOptionsException({nwRatio}, 'NwRatio is 2 or 3');
        }
    }

    getTextEntity (text) {
        const res = REG.exec(text);

        if(!res) {
            throw new wijmo.barcode.InvalidTextException(text);
        }

        const originStartPattern = res[1];
        const startPattern = originStartPattern || 'A';
        const content = res[2];
        const originStopPattern = res[3];
        const stopPattern = originStopPattern || 'B';
        return {originStartPattern, startPattern, content, originStopPattern, stopPattern};
    }

    encode (str) {
        let {nwRatio} = this;
        let data = '';
        const pattern1 = wijmo.barcode.Utils.strRepeat('1', nwRatio);
        const pattern0 = wijmo.barcode.Utils.strRepeat('0', nwRatio);
        wijmo.barcode.Utils.str2Array(str).forEach((item , index) => {
            if (wijmo.barcode.Utils.isEven(index)) {
                if (item === '1') {
                    data += pattern1; // wide/narrow ratio
                } else {
                    data += '1';
                }
            } else {
                if (item === '1') {
                    data += pattern0;
                } else {
                    data += '0';
                }
            }
        });

        return data;
    }

    calculateData () {
        let { text } = this;
        let data = '';

        wijmo.barcode.Utils.sliceString(text, 1, (char) => {
            data = data + this.encode(CodabarEncoder.TABLE[char]) + '0';
        });

        data = data.substr(0, data.length - 1);
        return data;
    }

    //Luhn algorithm
    checksum (text) {
        let checksum = wijmo.barcode.Utils.str2Array(text)
            .filter(ch => wijmo.barcode.Utils.isInteger(+ch))
            .reverse()
            .reduce((result, ch, index) => {
                let num = wijmo.barcode.Utils.toNumber(ch);
                if (wijmo.barcode.Utils.isEven(index)) {
                    let _num = 2 * num;
                    result += _num > 9 ? _num - 9 : _num;
                } else {
                    result += num;
                }
                return result;
            }, 0) % 10;
        if (checksum !== 0) {
            checksum = 10 - checksum;
        }
        return checksum;
    }
}

    }
    


    module wijmo.barcode.common {
    


wijmo.barcode.Barcode.registerEncoder('Codabar', CodabarEncoder);

    }
    


    module wijmo.barcode.common {
    /**
 * Defines encoding charset type for barcode.
 */
export enum QrCodeCharset{
    /** Uses UTF-8 charset for encoding */
    Utf8,
    /** Uses Shift_JIS charset for encoding */
    ShiftJis
}

/**
 * Defines QRCode Error Correction level to restore data if the code is dirty or damaged.
 * Please refer to the details about <a href="https://www.qrcode.com/en/about/error_correction.html" target="_blank">ErrorCorrectionLevel</a>
 */
export enum QrCodeCorrectionLevel{
    /** It corrects code approx 7% */
    Low,
    /** It corrects code approx 15% */
    Medium,
    /** It corrects code approx 25% */
    Quartile,
    /** It corrects code approx 30% */
    High
}

/** Indicates the model style of QRCode used. */
export enum QrCodeModel{
    /** QRCode model1:Original model. Model1 is the prototype of Model2 and 
     * Micro QR.1 to 14 versions are registered to the AIMI standard.
    */
    Model1,
    /** QRCode model2:Extended model. Model2 has an alignment pattern for better 
     * position adjustment and contains larger data than Model 1. 
     * 1 to 40 version are registered to the AIMI standard.
    */
    Model2
}

/**
 * Defines which code set is used to create Code128.
 * Please refer to the details about <a href="https://www.qrcode.com/en/about/error_correction.html" target="_blank">CodeSet</a>
 */
export enum Code128CodeSet{
    /** */
    Auto,
    /** 128A (Code Set A) – Uses ASCII characters 00 to 95 (0–9, A–Z and control codes), special characters, and FNC 1–4 */
    A,
    /** 128B (Code Set B) – Uses ASCII characters 32 to 127 (0–9, A–Z, a–z), special characters, and FNC 1–4 */
    B,
    /** 128C (Code Set C) – Uses 00–99 (encodes two digits with a single code point) and FNC1 */
    C
}


    }
    


    module wijmo.barcode.common {
    


export class _QrCodeModelConvertor{
    static stringToEnum(value: number): number{
        switch (value.toString()) {
            case '1':
                return QrCodeModel.Model1;
            case '2':
                return QrCodeModel.Model2;
        }
        throw `Unknown QRCode internal model '${value}'`;
    };

    static enumToString(value): string{
        var enumStr = QrCodeModel[wijmo.asEnum(value, QrCodeModel)];
        return enumStr.charAt(enumStr.length - 1);
    }
}

export class _CharsetTypeConvertor{
    static stringToEnum(value): number{
        switch (value) {
            case 'UTF-8':
                return QrCodeCharset.Utf8;
            case 'Shift_JIS':
                return QrCodeCharset.ShiftJis;
        }
        throw `Unknown Barcode internal charset '${value}'`;
    };

    static enumToString(value): string{
        let enumVal = wijmo.asEnum(value, QrCodeCharset),
            bcVal: string;
        switch (enumVal) {
            case QrCodeCharset.Utf8:
                bcVal = 'UTF-8';
                break;
            case QrCodeCharset.ShiftJis:
                bcVal = 'Shift_JIS';
                break;
        }
        return bcVal;
    }
}

export class _CorrectionLevelConvertor{
    static stringToEnum(value): number{
        switch (value) {
            case 'L':
                return QrCodeCorrectionLevel.Low;
            case 'M':
                return QrCodeCorrectionLevel.Medium;
            case 'Q':
                return QrCodeCorrectionLevel.Quartile;
            case 'H':
                return QrCodeCorrectionLevel.High;
        }
        throw `Unknown barcode internal errorCorrectionLevel '${value}'`;
    };

    static enumToString(value): string{
        return QrCodeCorrectionLevel[wijmo.asEnum(value, QrCodeCorrectionLevel)].charAt(0);
    }
}

export class _CodeSetTypeConvertor{
    static stringToEnum(value): number{
        switch (value) {
            case 'auto':
                return Code128CodeSet.Auto;
            case 'A':
                return Code128CodeSet.A;
            case 'B':
                return Code128CodeSet.B;
            case 'C':
                return Code128CodeSet.C;
        }
        throw `Unknown barcode internal codeSet '${value}'`;
    };

    static enumToString(value): string{
        let enumVal = wijmo.asEnum(value, Code128CodeSet),
            bcVal: string;
        switch (enumVal) {
            case Code128CodeSet.Auto:
                bcVal = 'auto';
                break;
            case Code128CodeSet.A:
            case Code128CodeSet.B:
            case Code128CodeSet.C:
                bcVal = Code128CodeSet[enumVal];
                break;
        }
        return bcVal;
    }
}


    }
    


    module wijmo.barcode.common {
    













/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Codabar" target="_blank">Codabar</a> 
 * barcode type.
 * 
 * This is a variable-width barcode, the width of which automatically changes 
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export class Codabar extends wijmo.barcode.BarcodeBase implements wijmo.barcode.IVariableWidthBarcode {
    static readonly type: string = 'Codabar';

    /**
     * Initializes a new instance of the {@link Codabar} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element);
        wijmo.addClass(this.hostElement, 'wj-barcode-codabar');
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
     * Indicates whether the symbol needs a check digit with the Luhn algorithm.
     * 
     * The default value for this property is <b>false</b>.
     */
    get checkDigit(): boolean {
        return this._getProp('checkDigit');
    }
    set checkDigit(value: boolean ){
        this._setProp('checkDigit', value);
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
     * Gets or sets the narrow and wide bar ratio of the control.
     * 
     * The possible property values are 1:2 or 1:3.
     * The default value for this property is {@link NarrowWideRatio.OneToThree}.
     */
    get nwRatio(): wijmo.barcode.NarrowToWideRatio {
        return wijmo.barcode._NarrowWideRatioConvertor.stringToEnum(this._getProp('nwRatio'));
    }
    set nwRatio(value: wijmo.barcode.NarrowToWideRatio ){
        this._setProp('nwRatio', wijmo.barcode._NarrowWideRatioConvertor.enumToString(value));
    }
}

/**
 * Base abstract class for Ean8 and Ean13 control classes.
 */
export abstract class EanBase extends wijmo.barcode.BarcodeBase{

    /**
     * Abstract class constructor, never called.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-ean');
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
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/EAN-8" target="_blank">EAN-8</a> 
 * barcode type.
 */
export class Ean8 extends EanBase{
    static readonly type: string = 'EAN8';

    /**
     * Initializes a new instance of the {@link Ean8} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-ean8');
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/International_Article_Number" target="_blank">EAN-13</a> 
 * barcode type.
 */
export class Ean13 extends EanBase{
    static readonly type = 'EAN13'

    /**
     * Initializes a new instance of the {@link Ean13} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, options?: any){
        super(element, options);
        wijmo.addClass(this.hostElement, 'wj-barcode-ean13');
    }

    /**
     * Gets or sets the addOn value of the control.
     * 
     * The possible length of this property should be 2 or 5.
     */
    get addOn(): string | number {
        return this._getProp('addOn');
    }
    set addOn(value: string | number ){
        this._setProp('addOn', value);
    }
    
    /**
     * Gets or sets the height of addOn symbol of the control.
     * 
     * The default value for this property is <b>auto</b>.
     */
    get addOnHeight(): string | number {
        return this._getProp('addOnHeight');
    }
    set addOnHeight(value: string | number ){
        this._setProp('addOnHeight', value);
    }

    /**
     * Gets or sets where to render the addOn value of the control.
     * 
     * The default value for this property is {@link LabelPosition.Top}.
     */
    get addOnLabelPosition(): wijmo.barcode.LabelPosition {
        return wijmo.barcode._LabelPositionConvertor.stringToEnum(this._getProp('addOnLabelPosition'));
    }
    set addOnLabelPosition(value: wijmo.barcode.LabelPosition ){
        this._setProp('addOnLabelPosition', wijmo.barcode._LabelPositionConvertor.enumToString(value));
    }

    /**
     * Gets or sets the size of quiet zone (the blank margin) around the barcode symbol.
     */
    get quietZone(): wijmo.barcode.IQuietZoneWithAddOn {
        return this._getProp('quietZone');
    }
    set quietZone(value: wijmo.barcode.IQuietZoneWithAddOn) {
        this._setProp('quietZone', value);
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Code_39" target="_blank">Code39</a> 
 * barcode type.
 * 
 * This is a variable-width barcode, the width of which automatically changes 
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export class Code39 extends wijmo.barcode.BarcodeBase implements wijmo.barcode.IVariableWidthBarcode {
    static readonly type: string = 'Code39';

    /**
     * Initializes a new instance of the {@link Code39} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element);
        wijmo.addClass(this.hostElement, 'wj-barcode-code39');
        this._setAw(true);
        this.initialize(option);
    }

    /**
     * Gets or sets a value indicating whether the control width should automatically
     * change along with the {@link value} length.
     * 
     * If you set this property to false, you should ensure that the control has some
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
     * This property takes effect only if the {@link autoWidth} property is set to true.
     * It can take any numeric value equal to or greater than 1.
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
     * Indicates whether the symbol needs a <a href="https://en.wikipedia.org/wiki/Modulo_operation" target="_blank">modulo</a> 43 <a href="https://en.wikipedia.org/wiki/Checksum" target="_blank">check digit</a>.
     * 
     * The default value for this property is <b>false</b>.
     */
    get checkDigit(): boolean {
        return this._getProp('checkDigit');
    }
    set checkDigit(value: boolean ){
        this._setProp('checkDigit', value);
    }

    /**
     * Indicates whether the symbol enables encoding of all 128 ASCII characters.
     * 
     * The default value for this property is <b>false</b>.
     */
    get fullAscii(): boolean {
        return this._getProp('fullASCII');
    }
    set fullAscii(value: boolean ){
        this._setProp('fullASCII', value);
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
     * Gets or sets the narrow and wide bar ratio of the control.
     * 
     * The possible property values are 1:2 or 1:3.
     * The default value for this property is {@link NarrowWideRatio.OneToThree}.
     */
    get nwRatio(): wijmo.barcode.NarrowToWideRatio {
        return wijmo.barcode._NarrowWideRatioConvertor.stringToEnum(this._getProp('nwRatio'));
    }
    set nwRatio(value: wijmo.barcode.NarrowToWideRatio ){
        this._setProp('nwRatio', wijmo.barcode._NarrowWideRatioConvertor.enumToString(value));
    }

    /**
     * Indicates whether to show the start and stop character in the label.
     * 
     * The default value for this property is <b>false</b>.
     */
    get labelWithStartAndStopCharacter(): boolean {
        return this._getProp('labelWithStartAndStopCharacter');
    }
    set labelWithStartAndStopCharacter(value: boolean ){
        this._setProp('labelWithStartAndStopCharacter', value);
    }
}


/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Code_128" target="_blank">Code128</a> 
 * barcode type.
 * 
 * This is a variable-width barcode, the width of which automatically changes 
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export class Code128 extends wijmo.barcode.BarcodeBase implements wijmo.barcode.IVariableWidthBarcode {
    static readonly type: string = 'Code128';

    /**
     * Initializes a new instance of the {@link Code128} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element);
        wijmo.addClass(this.hostElement, 'wj-barcode-code128');
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
     * It can take any numeric value equal to or greater than 1.
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
     * Gets or sets which kind of code set is used in this control.
     * 
     * The default value for this property is {@link Code128CodeSet.Auto}.
     */
    get codeSet(): Code128CodeSet {
        return _CodeSetTypeConvertor.stringToEnum(this._getProp('codeSet'));
    }
    set codeSet(value: Code128CodeSet ){
        this._setProp('codeSet', _CodeSetTypeConvertor.enumToString(value));
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
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/GS1-128" target="_blank">GS1_128</a> 
 * barcode type.
 * 
 * This is a variable-width barcode, the width of which automatically changes 
 * along with the length of the {@link value}. The {@link autoWidthZoom} property
 * can be used to zoom the automatically calculated width. The {@link autoWidth}
 * property can be used to disable this behavior.
 */
export class Gs1_128 extends wijmo.barcode.BarcodeBase implements wijmo.barcode.IVariableWidthBarcode {
    static readonly type: string = 'GS1_128';

    /**
     * Initializes a new instance of the {@link Gs1_128} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element);
        wijmo.addClass(this.hostElement, 'wj-barcode-gs1_128');
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
     * It can take any numeric value equal to or greater than 1.
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
}

/**
 * Base abstract class for all UPC barcode control classes.
 */
export class UpcBase extends wijmo.barcode.BarcodeBase{

    /**
     * Abstract class constructor, never call.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-upc');
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
     * Gets or sets the addOn value of the control.
     * 
     * The possible length of this property should be 2 or 5.
     */
    get addOn(): string | number {
        return this._getProp('addOn');
    }
    set addOn(value: string | number ){
        this._setProp('addOn', value);
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
     * Gets or sets the height of addOn symbol of the control.
     * 
     * The default value for this property is <b>auto</b>.
     */
    get addOnHeight(): string | number {
        return this._getProp('addOnHeight');
    }
    set addOnHeight(value: string | number ){
        this._setProp('addOnHeight', value);
    }

    /**
     * Gets or sets where to render the addOn value of the control.
     * 
     * The default value for this property is {@link LabelPosition.Top}.
     */
    get addOnLabelPosition(): wijmo.barcode.LabelPosition {
        return wijmo.barcode._LabelPositionConvertor.stringToEnum(this._getProp('addOnLabelPosition'));
    }
    set addOnLabelPosition(value: wijmo.barcode.LabelPosition ){
        this._setProp('addOnLabelPosition', wijmo.barcode._LabelPositionConvertor.enumToString(value));
    }

    /**
     * Gets or sets the size of quiet zone (the blank margin) around the barcode symbol.
     */
    get quietZone(): wijmo.barcode.IQuietZoneWithAddOn {
        return this._getProp('quietZone');
    }
    set quietZone(value: wijmo.barcode.IQuietZoneWithAddOn) {
        this._setProp('quietZone', value);
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Universal_Product_Code" target="_blank">UPC-A</a> 
 * barcode type.
 */
export class UpcA extends UpcBase{
    static readonly type: string = 'UPC-A';

    /**
     * Initializes a new instance of the {@link UpcA} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-upca');
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Universal_Product_Code" target="_blank">UPC-E0</a> 
 * barcode type.
 */
export class UpcE0 extends UpcBase{
    static readonly type: string = 'UPC-E0';

    /**
     * Initializes a new instance of the {@link UpcE0} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-upce0');
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Universal_Product_Code" target="_blank">UPC-E1</a> 
 * barcode type.
 */
export class UpcE1 extends UpcBase{
    static readonly type: string = 'UPC-E1';

    /**
     * Initializes a new instance of the {@link UpcE1} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-upce1');
    }
}

/**
 * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/QR_code" target="_blank">QRCode</a> 
 * barcode type.
 */
export class QrCode extends wijmo.barcode.BarcodeBase{
    static readonly type: string = 'QRCode';

    /**
     * Initializes a new instance of the {@link QrCode} class.
     * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
     * @param option The JavaScript object containing initialization data for the control.
     */
    constructor(element: any, option?: any){
        super(element, option);
        wijmo.addClass(this.hostElement, 'wj-barcode-qrcode');
    }

    /**
     * Gets or sets the collection of characters associated with the charset.
     */
    get charCode(): number[] {
        return this._getProp('charCode');
    }
    set charCode(value: number[] ){
        this._setProp('charCode', value);
    }

    /**
     * Gets or sets which charset to encode this control.
     * 
     * The default value for this property is {@link QrCodeCharset.Utf8}.
     */
    get charset(): QrCodeCharset {
        return _CharsetTypeConvertor.stringToEnum(this._getProp('charset'));
    }
    set charset(value: QrCodeCharset ){
        this._setProp('charset', _CharsetTypeConvertor.enumToString(value));
    }

    /**
     * Gets or sets the model style of the control used.
     * 
     * The default value for this property is {@link QrCodeModel.Model2}.
     */
    get model(): QrCodeModel {
        return _QrCodeModelConvertor.stringToEnum(this._getProp('model'));
    }
    set model(value: QrCodeModel ){
        this._setProp('model', _QrCodeModelConvertor.enumToString(value));
    }

    /**
     * Gets or sets the different module configuration of the control.
     * The versions of QRCode range from version 1 to version 40.
     * Each version has a different module configuration or number of modules.
     * (The module refers to the black and white dots that make up QRCode.)
     * 
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    get version(): number {
        let ret = this._getProp('version');
        return ret === 'auto' ? null : ret;
    }
    set version(value: number ){
        this._setProp('version', value == null ? 'auto' : value);
    }

    /**
     * Gets or sets the restoration ability of QRCode.
     * 
     * The default value for this property is {@link QrCodeCorrectionLevel.Low}.
     */
    get errorCorrectionLevel(): QrCodeCorrectionLevel {
        return _CorrectionLevelConvertor.stringToEnum(this._getProp('errorCorrectionLevel'));
    }
    set errorCorrectionLevel(value: QrCodeCorrectionLevel ){
        this._setProp('errorCorrectionLevel', _CorrectionLevelConvertor.enumToString(value));
    }

    /**
     * Gets or sets the patterns that are defined on a grid, which are repeated as necessary to cover the whole symbol.
     * 
     * The default value for this property is <b>null</b> or <b>undefined</b>.
     */
    get mask(): number {
        let ret = this._getProp('mask');
        return ret === 'auto' ? null : ret;
    }
    set mask(value: number ){
        this._setProp('mask', value == null ? 'auto' : value);
    }

    /**
     * Indicates whether the symbol is a part of a structured append message.
     * 
     * The default value for this property is <b>false</b>.
     */
    get connection(): boolean {
        return this._getProp('connection');
    }
    set connection(value: boolean ){
        this._setProp('connection', value);
    }

    /**
     * Gets or sets the index of the symbol block in the structured append message.
     * 
     * The possible property values are 0 - 15.
     * The default value for this property is <b>0</b>.
     */
    get connectionIndex(): number {
        return this._getProp('connectionNo');
    }
    set connectionIndex(value: number ){
        this._setProp('connectionNo', value);
    }
}
    }
    


    module wijmo.barcode.common {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.barcode.common', wijmo.barcode.common);



    }
    