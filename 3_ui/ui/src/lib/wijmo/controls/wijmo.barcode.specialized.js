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
        var specialized;
        (function (specialized) {
            var CodeMap = /** @class */ (function () {
                function CodeMap(b1, b2, b3) {
                    this.Maps = [b1, b2, b3];
                }
                CodeMap.Datas = [
                    new CodeMap(1, 4, 4),
                    new CodeMap(1, 1, 4),
                    new CodeMap(1, 3, 2),
                    new CodeMap(3, 1, 2),
                    new CodeMap(1, 2, 3),
                    new CodeMap(1, 4, 1),
                    new CodeMap(3, 2, 1),
                    new CodeMap(2, 1, 3),
                    new CodeMap(2, 3, 1),
                    new CodeMap(4, 1, 1),
                    new CodeMap(4, 1, 4),
                    new CodeMap(3, 2, 4),
                    new CodeMap(3, 4, 2),
                    new CodeMap(2, 3, 4),
                    new CodeMap(4, 3, 2),
                    new CodeMap(2, 4, 3),
                    new CodeMap(4, 2, 3),
                    new CodeMap(4, 4, 1),
                    new CodeMap(1, 1, 1),
                    new CodeMap(0, 1, 3),
                    new CodeMap(3, 1, 0),
                ];
                return CodeMap;
            }());
            specialized.CodeMap = CodeMap;
            specialized.ND = 0xff;
            specialized.CODE_CC4 = 14;
            var CharMap = /** @class */ (function () {
                function CharMap(ch, val1, val2) {
                    this.Char = ch;
                    this.Val1 = val1;
                    this.Val2 = val2;
                }
                CharMap.Datas = [
                    new CharMap('0', 0, specialized.ND),
                    new CharMap('1', 1, specialized.ND),
                    new CharMap('2', 2, specialized.ND),
                    new CharMap('3', 3, specialized.ND),
                    new CharMap('4', 4, specialized.ND),
                    new CharMap('5', 5, specialized.ND),
                    new CharMap('6', 6, specialized.ND),
                    new CharMap('7', 7, specialized.ND),
                    new CharMap('8', 8, specialized.ND),
                    new CharMap('9', 9, specialized.ND),
                    new CharMap('-', 10, specialized.ND),
                    new CharMap(String.fromCharCode(0xC1), 11, specialized.ND),
                    new CharMap(String.fromCharCode(0xC2), 12, specialized.ND),
                    new CharMap(String.fromCharCode(0xC3), 13, specialized.ND),
                    new CharMap(String.fromCharCode(0xC4), 14, specialized.ND),
                    new CharMap(String.fromCharCode(0xC5), 15, specialized.ND),
                    new CharMap(String.fromCharCode(0xC6), 16, specialized.ND),
                    new CharMap(String.fromCharCode(0xC7), 17, specialized.ND),
                    new CharMap(String.fromCharCode(0xC8), 18, specialized.ND),
                    new CharMap('A', 11, 0),
                    new CharMap('B', 11, 1),
                    new CharMap('C', 11, 2),
                    new CharMap('D', 11, 3),
                    new CharMap('E', 11, 4),
                    new CharMap('F', 11, 5),
                    new CharMap('G', 11, 6),
                    new CharMap('H', 11, 7),
                    new CharMap('I', 11, 8),
                    new CharMap('J', 11, 9),
                    new CharMap('K', 12, 0),
                    new CharMap('L', 12, 1),
                    new CharMap('M', 12, 2),
                    new CharMap('N', 12, 3),
                    new CharMap('O', 12, 4),
                    new CharMap('P', 12, 5),
                    new CharMap('Q', 12, 6),
                    new CharMap('R', 12, 7),
                    new CharMap('S', 12, 8),
                    new CharMap('T', 12, 9),
                    new CharMap('U', 13, 0),
                    new CharMap('V', 13, 1),
                    new CharMap('W', 13, 2),
                    new CharMap('X', 13, 3),
                    new CharMap('Y', 13, 4),
                    new CharMap('Z', 13, 5),
                    new CharMap('a', 11, 0),
                    new CharMap('b', 11, 1),
                    new CharMap('c', 11, 2),
                    new CharMap('d', 11, 3),
                    new CharMap('e', 11, 4),
                    new CharMap('f', 11, 5),
                    new CharMap('g', 11, 6),
                    new CharMap('h', 11, 7),
                    new CharMap('i', 11, 8),
                    new CharMap('j', 11, 9),
                    new CharMap('k', 12, 0),
                    new CharMap('l', 12, 1),
                    new CharMap('m', 12, 2),
                    new CharMap('n', 12, 3),
                    new CharMap('o', 12, 4),
                    new CharMap('p', 12, 5),
                    new CharMap('q', 12, 6),
                    new CharMap('r', 12, 7),
                    new CharMap('s', 12, 8),
                    new CharMap('t', 12, 9),
                    new CharMap('u', 13, 0),
                    new CharMap('v', 13, 1),
                    new CharMap('w', 13, 2),
                    new CharMap('x', 13, 3),
                    new CharMap('y', 13, 4),
                    new CharMap('z', 13, 5),
                    new CharMap(String.fromCharCode(0), 0, 0),
                ];
                return CharMap;
            }());
            specialized.CharMap = CharMap;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var BarEnum = {
                Long: 1,
                Upward: 2,
                Downward: 3,
                Timing: 4,
            };
            var JapanesePost4StateCustomerCode = /** @class */ (function (_super) {
                __extends(JapanesePost4StateCustomerCode, _super);
                function JapanesePost4StateCustomerCode(option) {
                    var _this = _super.call(this, option) || this;
                    var text = _this.encodeConfig.text;
                    _this.text = text;
                    _this.label = text;
                    return _this;
                }
                JapanesePost4StateCustomerCode.prototype.validate = function () {
                    var text = this.encodeConfig.text;
                    if (text.length > 20) {
                        throw new wijmo.barcode.TextTooLongException();
                    }
                };
                JapanesePost4StateCustomerCode.prototype.checksum = function (n, tmp) {
                    var nSum = 0;
                    for (var i = 0; i < n; i++) {
                        nSum += tmp[i];
                    }
                    var cdc = nSum % 19;
                    if (cdc != 0) {
                        cdc = 19 - cdc;
                    }
                    return cdc;
                };
                JapanesePost4StateCustomerCode.prototype.calculateData = function () {
                    var _a = this, text = _a.text, hideExtraChecksum = _a.encodeConfig.hideExtraChecksum;
                    var tmp = [];
                    var i, j, codeCnt = 0;
                    tmp[codeCnt++] = 19;
                    var char0 = String.fromCharCode(0);
                    for (i = 0; i < text.length; i++) {
                        for (j = 0; specialized.CharMap.Datas[j].Char != char0 && specialized.CharMap.Datas[j].Char != text[i]; j++)
                            ;
                        if (specialized.CharMap.Datas[j].Char == char0) {
                            throw new wijmo.barcode.InvalidCharacterException(text[i]);
                        }
                        tmp[codeCnt++] = specialized.CharMap.Datas[j].Val1;
                        if (specialized.CharMap.Datas[j].Val2 != specialized.ND) {
                            tmp[codeCnt++] = specialized.CharMap.Datas[j].Val2;
                        }
                        if (codeCnt > 21) {
                            break;
                        }
                    }
                    for (; codeCnt < 21; codeCnt++) {
                        tmp[codeCnt] = specialized.CODE_CC4;
                    }
                    codeCnt = 21;
                    var checkDigit = this.checksum(codeCnt, tmp);
                    if (!hideExtraChecksum) {
                        this.label = text + checkDigit;
                    }
                    tmp[codeCnt++] = checkDigit;
                    tmp[codeCnt] = 20;
                    return tmp;
                };
                JapanesePost4StateCustomerCode.prototype._fillSymbol = function (data, symbolArea) {
                    var box = symbolArea.getContentBox();
                    var stepHeight = box.height / 3;
                    data.forEach(function (n) {
                        var codes = specialized.CodeMap.Datas[n].Maps;
                        codes.forEach(function (code) {
                            switch (code) {
                                case BarEnum.Long:
                                    symbolArea.append(1, stepHeight * 3, 0);
                                    break;
                                case BarEnum.Upward:
                                    symbolArea.append(1, stepHeight * 2, 0);
                                    break;
                                case BarEnum.Downward:
                                    symbolArea.append(1, stepHeight * 2, stepHeight);
                                    break;
                                case BarEnum.Timing:
                                    symbolArea.append(1, stepHeight, stepHeight);
                                    break;
                                default:
                                    return;
                            }
                            symbolArea.space();
                        });
                    });
                    symbolArea.space(-1);
                };
                JapanesePost4StateCustomerCode.prototype.convertToShape = function (data, forMeasure) {
                    var _a = this, label = _a.label, _b = _a.encodeConfig, quietZone = _b.quietZone, isLabelBottom = _b.isLabelBottom, height = _b.height, showLabel = _b.showLabel, fontSizeInUnit = _b.fontSizeInUnit, textAlign = _a.style.textAlign;
                    var labelHeight = 0;
                    if (label && showLabel) {
                        labelHeight = fontSizeInUnit;
                    }
                    // start and stop bar has a zero in codeMap, so we should minus 2.
                    var symbolWidth = (data.length * 3 - 2) * 2 - 1 + quietZone.right + quietZone.left;
                    var symbolHeight = height + quietZone.top + quietZone.bottom;
                    var mainArea = new wijmo.barcode.VerticalLayoutArea();
                    var symbolArea = new wijmo.barcode.SymbolArea(symbolWidth, symbolHeight);
                    symbolArea.setStyle({
                        padding: {
                            top: quietZone.top,
                            right: quietZone.right,
                            bottom: quietZone.bottom,
                            left: quietZone.left,
                        },
                    });
                    var symbolSize = symbolArea.getSize();
                    var labelArea = new wijmo.barcode.LabelArea(symbolSize.width, labelHeight, textAlign);
                    labelArea.setStyle({
                        padding: {
                            left: quietZone.left,
                            right: quietZone.right,
                        },
                    });
                    if (isLabelBottom) {
                        mainArea.append(symbolArea);
                        mainArea.append(labelArea);
                    }
                    else {
                        mainArea.append(labelArea);
                        mainArea.append(symbolArea);
                    }
                    if (!forMeasure) {
                        this._fillSymbol(data, symbolArea);
                        labelArea.append({ text: label });
                        this.shapes = mainArea.toShapes();
                    }
                    this.size = mainArea.getSize();
                };
                return JapanesePost4StateCustomerCode;
            }(wijmo.barcode.OneDimensionalBarcode));
            specialized.JapanesePost4StateCustomerCode = JapanesePost4StateCustomerCode;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            wijmo.barcode.Barcode.registerEncoder('Japanese Postal', specialized.JapanesePost4StateCustomerCode);
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var ITFBase = /** @class */ (function (_super) {
                __extends(ITFBase, _super);
                function ITFBase(option) {
                    var _this = this;
                    option.merge(ITFBase.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this, text = _a.encodeConfig.text, _b = _a.config, nwRatio = _b.nwRatio, bearerBar = _b.bearerBar;
                    _this.text = text;
                    _this.label = text;
                    _this.ratio = nwRatio;
                    _this.bearerBar = bearerBar;
                    return _this;
                }
                ITFBase.prototype.checksum = function (text) {
                    var numberArray = wijmo.barcode.Utils.str2Array(text).reverse();
                    var sum = numberArray.reduce(function (sum, num, index) {
                        num = +num;
                        sum += wijmo.barcode.Utils.isOdd(index) ? num : num * 3;
                        return sum;
                    }, 0);
                    var remainder = sum % 10;
                    if (remainder === 0) {
                        return 0;
                    }
                    return 10 - remainder;
                };
                ITFBase.prototype._toPairs = function () {
                    var text = this.text;
                    var pairs = [];
                    wijmo.barcode.Utils.sliceString(text, 2, function (str) {
                        pairs.push(str);
                    });
                    return pairs;
                };
                ITFBase.prototype._toPattern = function (str) {
                    var leading = ITFBase.Table[str[0]];
                    var second = ITFBase.Table[str[1]];
                    var result = '';
                    wijmo.barcode.Utils.loop(function (i) {
                        result = result + leading[i] + second[i];
                    }, leading.length);
                    return result;
                };
                ITFBase.prototype._toZeroOnePattern = function (pattern) {
                    var ratio = this.ratio;
                    var result = '';
                    wijmo.barcode.Utils.loop(function (i) {
                        var flag = wijmo.barcode.Utils.isOdd(i) ? '0' : '1';
                        result += wijmo.barcode.Utils.strRepeat(flag, pattern[i] === 'W' ? ratio : 1);
                    }, pattern.length);
                    return result;
                };
                ITFBase.prototype.calculateData = function () {
                    var _this = this;
                    var pairs = this._toPairs();
                    var result = ITFBase.StartPattern;
                    pairs.forEach(function (item) {
                        result += _this._toPattern(item);
                    });
                    result += ITFBase.StopPattern;
                    return this._toZeroOnePattern(result);
                };
                ITFBase.prototype.afterApplyDesiredSize = function () {
                    var bearerBar = this.bearerBar;
                    if (bearerBar) {
                        this.encodeConfig.height -= (ITFBase.BearerBarWidth * 2);
                    }
                };
                ITFBase.prototype.convertToShape = function (data, forMeasure) {
                    var _a = this, label = _a.label, bearerBar = _a.bearerBar, _b = _a.encodeConfig, quietZone = _b.quietZone, isLabelBottom = _b.isLabelBottom, height = _b.height, showLabel = _b.showLabel, fontSizeInUnit = _b.fontSizeInUnit, textAlign = _a.style.textAlign;
                    var labelHeight = 0;
                    if (label && showLabel) {
                        labelHeight = fontSizeInUnit;
                    }
                    var symbolWidth = data.length + quietZone.right + quietZone.left;
                    var symbolHeight = height + quietZone.top + quietZone.bottom;
                    var mainArea = new wijmo.barcode.VerticalLayoutArea();
                    var symbolArea = new wijmo.barcode.SymbolArea(symbolWidth, symbolHeight);
                    symbolArea.setStyle({
                        padding: {
                            top: quietZone.top,
                            right: quietZone.right,
                            bottom: quietZone.bottom,
                            left: quietZone.left,
                        },
                        border: bearerBar ? ITFBase.BearerBarWidth : 0,
                    });
                    var symbolSize = symbolArea.getSize();
                    var labelArea = new wijmo.barcode.LabelArea(symbolSize.width, labelHeight, textAlign);
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
                ITFBase.StartPattern = 'nnnn';
                ITFBase.StopPattern = 'Wnn';
                ITFBase.DefaultConfig = {
                    quietZone: {
                        right: 10,
                        left: 10,
                    },
                    nwRatio: 3,
                    bearerBar: false
                };
                ITFBase.Table = [
                    'nnWWn',
                    'WnnnW',
                    'nWnnW',
                    'WWnnn',
                    'nnWnW',
                    'WnWnn',
                    'nWWnn',
                    'nnnWW',
                    'WnnWn',
                    'nWnWn',
                ];
                ITFBase.Weight = [1, 2, 4, 7, 0];
                ITFBase.BearerBarWidth = 3;
                return ITFBase;
            }(wijmo.barcode.OneDimensionalBarcode));
            specialized.ITFBase = ITFBase;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var Interleaved2of5Encoder = /** @class */ (function (_super) {
                __extends(Interleaved2of5Encoder, _super);
                function Interleaved2of5Encoder(option) {
                    var _this = this;
                    option.merge(Interleaved2of5Encoder.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this, _b = _a.encodeConfig, text = _b.text, hideExtraChecksum = _b.hideExtraChecksum, checkCharacter = _a.config.checkCharacter;
                    var label = text;
                    if (checkCharacter) {
                        text += _this.checksum(text);
                        if (!hideExtraChecksum) {
                            label = text;
                        }
                    }
                    if (wijmo.barcode.Utils.isOdd(text.length)) {
                        text = '0' + text;
                        label = '0' + label;
                    }
                    _this.text = text;
                    _this.label = label;
                    return _this;
                }
                Interleaved2of5Encoder.prototype.validate = function () {
                    var text = this.encodeConfig.text;
                    var reg = /^[0-9]+$/;
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text, 'Text should be numbers.');
                    }
                    if (text.length > 16) {
                        throw new wijmo.barcode.TextTooLongException();
                    }
                };
                Interleaved2of5Encoder.DefaultConfig = {
                    checkCharacter: false,
                };
                return Interleaved2of5Encoder;
            }(specialized.ITFBase));
            specialized.Interleaved2of5Encoder = Interleaved2of5Encoder;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            wijmo.barcode.Barcode.registerEncoder('Interleaved2of5', specialized.Interleaved2of5Encoder);
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var ITF_14_Encoder = /** @class */ (function (_super) {
                __extends(ITF_14_Encoder, _super);
                function ITF_14_Encoder(option) {
                    var _this = _super.call(this, option) || this;
                    var _a = _this.encodeConfig, text = _a.text, hideExtraChecksum = _a.hideExtraChecksum;
                    _this.label = text;
                    if (text.length === 13) {
                        text += _this.checksum(text);
                        if (!hideExtraChecksum) {
                            _this.label = text;
                        }
                    }
                    _this.text = text;
                    return _this;
                }
                ITF_14_Encoder.prototype.validate = function () {
                    var text = this.encodeConfig.text;
                    var reg = /^(\d{13}|\d{14})$/;
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text, 'Text should be numbers. The length should be 13 or 14.');
                    }
                    if (text.length === 14) {
                        var checkDigit = this.checksum(text.substr(0, 13));
                        if (checkDigit != text[13]) {
                            throw new wijmo.barcode.InvalidTextException(text, 'Check digit is invalid.');
                        }
                    }
                };
                return ITF_14_Encoder;
            }(specialized.ITFBase));
            specialized.ITF_14_Encoder = ITF_14_Encoder;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            wijmo.barcode.Barcode.registerEncoder('ITF-14', specialized.ITF_14_Encoder);
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var EncodeTable_Code93 = /** @class */ (function () {
                function EncodeTable_Code93() {
                }
                EncodeTable_Code93.getCode93Code = function (char) {
                    var index = EncodeTable_Code93.TABLE_CH.indexOf(char);
                    if (index === -1) {
                        throw new wijmo.barcode.InvalidCharacterException(char);
                    }
                    return EncodeTable_Code93.TABLE_CODE[index];
                };
                EncodeTable_Code93.getCode93Value = function (char) {
                    var index = EncodeTable_Code93.TABLE_CH.indexOf(char);
                    if (index === -1) {
                        throw new wijmo.barcode.InvalidCharacterException(char);
                    }
                    return index;
                };
                EncodeTable_Code93.getCharByValue = function (index) {
                    return EncodeTable_Code93.TABLE_CH[index];
                };
                EncodeTable_Code93.getFullASCIIChar = function (text) {
                    var str = '';
                    wijmo.barcode.Utils.sliceString(text, 1, function (char) {
                        var c = EncodeTable_Code93.TABLE_FULL_ASCII[char.charCodeAt(0)];
                        if (c) {
                            str += c;
                        }
                        else {
                            throw new wijmo.barcode.InvalidTextException(text);
                        }
                    });
                    return str;
                };
                EncodeTable_Code93.TABLE_CH = [
                    '0', '1', '2', '3',
                    '4', '5', '6', '7',
                    '8', '9', 'A', 'B',
                    'C', 'D', 'E', 'F',
                    'G', 'H', 'I', 'J',
                    'K', 'L', 'M', 'N',
                    'O', 'P', 'Q', 'R',
                    'S', 'T', 'U', 'V',
                    'W', 'X', 'Y', 'Z',
                    '-', '.', ' ', '$',
                    '/', '+', '%',
                    '[',
                    ']', '{', '}', '*'
                ];
                EncodeTable_Code93.TABLE_CODE = [
                    '131112', '111213', '111312', '111411',
                    '121113', '121212', '121311', '111114',
                    '131211', '141111', '211113', '211212',
                    '211311', '221112', '221211', '231111',
                    '112113', '112212', '112311', '122112',
                    '132111', '111123', '111222', '111321',
                    '121122', '131121', '212112', '212211',
                    '211122', '211221', '221121', '222111',
                    '112122', '112221', '122121', '123111',
                    '121131', '311112', '311211', '321111',
                    '112131', '113121', '211131',
                    '121221',
                    '312111', '311121', '122211', '111141'
                ];
                EncodeTable_Code93.TABLE_FULL_ASCII = [
                    ']U', '[A', '[B', '[C', '[D', '[E', '[F', '[G',
                    '[H', '[I', '[J', '[K', '[L', '[M', '[N', '[O',
                    '[P', '[Q', '[R', '[S', '[T', '[U', '[V', '[W',
                    '[X', '[Y', '[Z', ']A', ']B', ']C', ']D', ']E',
                    ' ', '{A', '{B', '{C', '{D', '{E', '{F', '{G',
                    '{H', '{I', '{J', '{K', '{L', '{M', '{N', '{O',
                    '0', '1', '2', '3', '4', '5', '6', '7',
                    '8', '9', '{Z', ']F', ']G', ']H', ']I', ']J',
                    ']V', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
                    'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
                    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
                    'X', 'Y', 'Z', ']K', ']L', ']M', ']N', ']O',
                    ']W', '}A', '}B', '}C', '}D', '}E', '}F', '}G',
                    '}H', '}I', '}J', '}K', '}L', '}M', '}N', '}O',
                    '}P', '}Q', '}R', '}S', '}T', '}U', '}V', '}W',
                    '}X', '}Y', '}Z', ']P', ']Q', ']R', ']S', ']T'
                ];
                return EncodeTable_Code93;
            }());
            specialized.EncodeTable_Code93 = EncodeTable_Code93;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var Code93Encoder = /** @class */ (function (_super) {
                __extends(Code93Encoder, _super);
                function Code93Encoder(option) {
                    var _this = this;
                    option.merge(Code93Encoder.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this, _b = _a.encodeConfig, text = _b.text, hideExtraChecksum = _b.hideExtraChecksum, _c = _a.config, fullASCII = _c.fullASCII, checkDigit = _c.checkDigit;
                    var _text = fullASCII ? specialized.EncodeTable_Code93.getFullASCIIChar(text) : text;
                    _this.label = text;
                    if (checkDigit) {
                        var checkDigit_c = _this.checksum(_text);
                        var checkDigit_k = _this.checksum(_text + checkDigit_c);
                        _this.text = Code93Encoder.START_STOP_CHARACTERS + _text + checkDigit_c + checkDigit_k + Code93Encoder.START_STOP_CHARACTERS;
                        if (!hideExtraChecksum) {
                            _this.label = text + checkDigit_c + checkDigit_k;
                        }
                    }
                    else {
                        _this.text = Code93Encoder.START_STOP_CHARACTERS + _text + Code93Encoder.START_STOP_CHARACTERS;
                    }
                    return _this;
                }
                Code93Encoder.prototype.validate = function () {
                    var _a = this, text = _a.encodeConfig.text, fullASCII = _a.config.fullASCII;
                    //A-Z 0 - 9  space $ % + - . /
                    var reg = /^[0-9A-Z\-\.\ \$\/\+\%]+$/; //eslint-disable-line
                    if (!fullASCII && !reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                };
                Code93Encoder.prototype.encode = function (str) {
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
                };
                Code93Encoder.prototype.calculateData = function () {
                    var _this = this;
                    var text = this.text;
                    var data = '';
                    wijmo.barcode.Utils.sliceString(text, 1, function (char) {
                        data += _this.encode(specialized.EncodeTable_Code93.getCode93Code(char));
                    });
                    data += Code93Encoder.TERMINATION;
                    return data;
                };
                Code93Encoder.prototype.checksum = function (str) {
                    var weight = 1;
                    var weightSum = wijmo.barcode.Utils.str2Array(str).reduceRight(function (sum, char) {
                        var value = specialized.EncodeTable_Code93.getCode93Value(char);
                        if (weight > 20) {
                            weight = 1;
                        }
                        sum += weight * value;
                        weight++;
                        return sum;
                    }, 0);
                    return specialized.EncodeTable_Code93.getCharByValue(weightSum % 47);
                };
                Code93Encoder.DefaultConfig = {
                    checkDigit: false,
                    fullASCII: false,
                    quietZone: {
                        right: 10,
                        left: 10
                    },
                };
                Code93Encoder.START_STOP_CHARACTERS = '*';
                Code93Encoder.TERMINATION = '1';
                return Code93Encoder;
            }(wijmo.barcode.OneDimensionalBarcode));
            specialized.Code93Encoder = Code93Encoder;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            wijmo.barcode.Barcode.registerEncoder('Code93', specialized.Code93Encoder);
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var ODD_TABLE = [
                0xC940, 0xF250, 0xECA0, 0xFB28, 0xE5A0, 0xF968, 0xDB40, 0xF6D0, 0xFDB4, 0xC4A0, 0xF128, 0x9940, 0xE650, 0xF994, 0xDCA0, 0xF728, 0xFDCA, 0x8B40, 0xE2D0, 0xCDA0,
                0xF368, 0xBB40, 0xEED0, 0xFBB4, 0xC250, 0x8CA0, 0xE328, 0xCE50, 0xF394, 0xBCA0, 0xEF28, 0xFBCA, 0x85A0, 0xE168, 0xC6D0, 0xF1B4, 0x9DA0, 0xE768, 0xF9DA, 0xDED0,
                0xF7B4, 0xC128, 0x8650, 0xE194, 0xC728, 0xF1CA, 0x9E50, 0xE794, 0xDF28, 0xF7CA, 0x82D0, 0xC368, 0x8ED0, 0xE3B4, 0xCF68, 0xF3DA, 0xBED0, 0xEFB4, 0x8328, 0xC394,
                0x8F28, 0xE3CA, 0xCF94, 0x8168, 0xC1B4, 0x8768, 0xE1DA, 0xC7B4, 0x9F68, 0xE7DA, 0xDFB4, 0xD140, 0xF450, 0xFD14, 0xE9A0, 0xFA68, 0xD740, 0xF5D0, 0xFD74, 0xC8A0,
                0xF228, 0xB140, 0xEC50, 0xFB14, 0x9340, 0xE4D0, 0xF934, 0xD9A0, 0xF668, 0xFD9A, 0xCBA0, 0xF2E8, 0xB740, 0xEDD0, 0xFB74, 0xC450, 0xF114, 0x98A0, 0xE628, 0xF98A,
                0xDC50, 0xF714, 0x89A0, 0xE268, 0xCCD0, 0xF334, 0xB9A0, 0xEE68, 0xFB9A, 0xC5D0, 0xF174, 0x9BA0, 0xE6E8, 0xF9BA, 0xDDD0, 0xF774, 0xC228, 0x8C50, 0xE314, 0xCE28,
                0xF38A, 0xBC50, 0xEF14, 0x84D0, 0xE134, 0xC668, 0xF19A, 0x9CD0, 0xE734, 0xDE68, 0xF79A, 0xC2E8, 0x8DD0, 0xE374, 0xCEE8, 0xF3BA, 0xBDD0, 0xEF74, 0xC114, 0x8628,
                0xE18A, 0xC714, 0x9E28, 0xE78A, 0x8268, 0xC334, 0x8E68, 0xE39A, 0xCF34, 0xBE68, 0xEF9A, 0xC174, 0x86E8, 0xE1BA, 0xC774, 0x9EE8, 0xE7BA, 0xDF74, 0x8314, 0xC38A,
                0x8F14, 0x8134, 0xC19A, 0x8734, 0xC79A, 0x9F34, 0x8374, 0xC3BA, 0x8F74, 0xCFBA, 0xBF74, 0xD0A0, 0xF428, 0xFD0A, 0xA340, 0xE8D0, 0xFA34, 0xD3A0, 0xF4E8, 0xFD3A,
                0xAF40, 0xEBD0, 0xFAF4, 0xC850, 0xF214, 0xB0A0, 0xEC28, 0xFB0A, 0x91A0, 0xE468, 0xF91A, 0xD8D0, 0xF634, 0xC9D0, 0xF274, 0xB3A0, 0xECE8, 0xFB3A, 0x97A0, 0xE5E8,
                0xF97A, 0xDBD0, 0xF6F4, 0xC428, 0xF10A, 0x9850, 0xE614, 0xDC28, 0xF70A, 0x88D0, 0xE234, 0xCC68, 0xF31A, 0xB8D0, 0xEE34, 0xC4E8, 0xF13A, 0x99D0, 0xE674, 0xDCE8,
                0xF73A, 0x8BD0, 0xE2F4, 0xCDE8, 0xF37A, 0xBBD0, 0xEEF4, 0xC214, 0x8C28, 0xE30A, 0xCE14, 0x8468, 0xE11A, 0xC634, 0x9C68, 0xE71A, 0xDE34, 0xC274, 0x8CE8, 0xE33A,
                0xCE74, 0xBCE8, 0xEF3A, 0x85E8, 0xE17A, 0xC6F4, 0x9DE8, 0xE77A, 0xDEF4, 0xC10A, 0x8614, 0xC70A, 0x8234, 0xC31A, 0x8E34, 0xCF1A, 0xC13A, 0x8674, 0xC73A, 0x9E74,
                0xDF3A, 0x82F4, 0xC37A, 0x8EF4, 0xCF7A, 0xBEF4, 0x830A, 0x811A, 0x871A, 0x833A, 0x8F3A, 0x817A, 0x877A, 0x9F7A, 0xD050, 0xF414, 0xA1A0, 0xE868, 0xFA1A, 0xD1D0,
                0xF474, 0xA7A0, 0xE9E8, 0xFA7A, 0xD7D0, 0xF5F4, 0xC828, 0xF20A, 0xB050, 0xEC14, 0x90D0, 0xE434, 0xD868, 0xF61A, 0xC8E8, 0xF23A, 0xB1D0, 0xEC74, 0x93D0, 0xE4F4,
                0xD9E8, 0xF67A, 0xCBE8, 0xF2FA, 0xB7D0, 0xEDF4, 0xC414, 0x9828, 0xE60A, 0x8868, 0xE21A, 0xCC34, 0xB868, 0xEE1A, 0xC474, 0x98E8, 0xE63A, 0xDC74, 0x89E8, 0xE27A,
                0xCCF4, 0xB9E8, 0xEE7A, 0xC5F4, 0x9BE8, 0xE6FA, 0xDDF4, 0xC20A, 0x8C14, 0x8434, 0xC61A, 0x9C34, 0xC23A, 0x8C74, 0xCE3A, 0xBC74, 0x84F4, 0xC67A, 0x9CF4, 0xDE7A,
                0xC2FA, 0x8DF4, 0xCEFA, 0xBDF4, 0x860A, 0x821A, 0x8E1A, 0x863A, 0x9E3A, 0x827A, 0x8E7A, 0xBE7A, 0x86FA, 0x9EFA, 0xD028, 0xF40A, 0xA0D0, 0xE834, 0xD0E8, 0xF43A,
                0xA3D0, 0xE8F4, 0xD3E8, 0xF4FA, 0xAFD0, 0xEBF4, 0xC814, 0x9068, 0xE41A, 0xD834, 0xC874, 0xB0E8, 0xEC3A, 0x91E8, 0xE47A, 0xD8F4, 0xC9F4, 0xB3E8, 0xECFA, 0x97E8,
                0xE5FA, 0xDBF4, 0xC40A, 0x8834, 0xCC1A, 0xC43A, 0x9874, 0xDC3A, 0x88F4, 0xCC7A, 0xB8F4, 0xC4FA, 0x99F4, 0xDCFA, 0x8BF4, 0xCDFA, 0xBBF4, 0x841A, 0x8C3A, 0x847A,
                0x9C7A, 0x8CFA, 0xBCFA, 0x85FA, 0x9DFA, 0xF520, 0xFD48, 0xDAC0, 0xF6B0, 0xFDAC, 0xCA40, 0xF290, 0xED20, 0xFB48, 0xCD60, 0xF358, 0xBAC0, 0xEEB0, 0xFBAC, 0xC520,
                0xF148, 0x9A40, 0xE690, 0xF9A4, 0xDD20, 0xF748, 0xFDD2, 0xC6B0, 0xF1AC, 0x9D60, 0xE758, 0xF9D6, 0xDEB0, 0xF7AC, 0xC290, 0x8D20, 0xE348, 0xCE90, 0xF3A4, 0xBD20,
                0xEF48, 0xFBD2, 0xC358, 0x8EB0, 0xE3AC, 0xCF58, 0xF3D6, 0xBEB0, 0xEFAC, 0xC148, 0x8690, 0xE1A4, 0xC748, 0xF1D2, 0x9E90, 0xE7A4, 0xDF48, 0xF7D2, 0xC1AC, 0x8758,
                0xE1D6, 0xC7AC, 0x9F58, 0xE7D6, 0xDFAC, 0x8348, 0xC3A4, 0x8F48, 0xE3D2, 0xCFA4, 0xBF48, 0xEFD2, 0xE960, 0xFA58, 0xD6C0, 0xF5B0, 0xFD6C, 0xD240, 0xF490, 0xFD24,
                0xEB20, 0xFAC8, 0x92C0, 0xE4B0, 0xF92C, 0xD960, 0xF658, 0xFD96, 0xCB60, 0xF2D8, 0xB6C0, 0xC920, 0xF248, 0xB240, 0xEC90, 0xFB24, 0x9640, 0xE590, 0xF964, 0xDB20,
                0xF6C8, 0xFDB2, 0x8960, 0xE258, 0xCCB0, 0xF32C, 0xB960, 0xEE58, 0xFB96, 0xC5B0, 0xF16C, 0x9B60, 0xC490, 0xF124, 0x9920, 0xE648, 0xF992, 0xDC90, 0xF724, 0x8B20,
                0xE2C8, 0xCD90, 0xF364, 0xBB20, 0xEEC8, 0xFBB2, 0x84B0, 0xE12C, 0xC658, 0xF196, 0x9CB0, 0xE72C, 0xDE58, 0xF796, 0xC2D8, 0x8DB0, 0xC248, 0x8C90, 0xE324, 0xBDB0,
                0xCE48, 0xF392, 0xBC90, 0xEF24, 0x8590, 0xE164, 0xC6C8, 0xF1B2, 0x9D90, 0xE764, 0xDEC8, 0xF7B2, 0x8258, 0xC32C, 0x8E58, 0xE396, 0xCF2C, 0xBE58, 0xEF96, 0xC16C,
                0x86D8, 0xC124, 0x8648, 0xE192, 0x9ED8, 0xC724, 0x9E48, 0xE792, 0xDF24, 0x82C8, 0xC364, 0x8EC8, 0xE3B2, 0xCF64, 0xBEC8, 0xEFB2, 0x812C, 0xC196, 0x872C, 0xC796,
                0x9F2C, 0x836C, 0x8324, 0x8F6C, 0xC392, 0x8F24, 0xBF6C, 0xCF92, 0x8164, 0xC1B2, 0x8764, 0xC7B2, 0x9F64, 0xDFB2, 0xA2C0, 0xE8B0, 0xFA2C, 0xD360, 0xF4D8, 0xFD36,
                0xD120, 0xF448, 0xFD12, 0xAEC0, 0xEBB0, 0xFAEC, 0xA640, 0xE990, 0xFA64, 0xD720, 0xF5C8, 0xFD72, 0x9160, 0xE458, 0xF916, 0xD8B0, 0xF62C, 0xC9B0, 0xF26C, 0xB360,
                0xC890, 0xF224, 0xB120, 0xEC48, 0xFB12, 0x9760, 0xE5D8, 0xF976, 0x9320, 0xE4C8, 0xF932, 0xD990, 0xF664, 0xCB90, 0xF2E4, 0xB720, 0xEDC8, 0xFB72, 0x88B0, 0xE22C,
                0xCC58, 0xF316, 0xB8B0, 0xEE2C, 0xC4D8, 0xF136, 0x99B0, 0xC448, 0xF112, 0x9890, 0xE624, 0xDC48, 0xF712, 0x8BB0, 0xE2EC, 0x8990, 0xE264, 0xBBB0, 0xCCC8, 0xF332,
                0xB990, 0xEE64, 0xC5C8, 0xF172, 0x9B90, 0xE6E4, 0xDDC8, 0xF772, 0x8458, 0xE116, 0xC62C, 0x9C58, 0xE716, 0xDE2C, 0xC26C, 0x8CD8, 0xC224, 0x8C48, 0xE312, 0xBCD8,
                0xCE24, 0xBC48, 0xEF12, 0x85D8, 0xE176, 0x84C8, 0xE132, 0x9DD8, 0xC664, 0x9CC8, 0xE732, 0xDE64, 0xC2E4, 0x8DC8, 0xE372, 0xCEE4, 0xBDC8, 0xEF72, 0x822C, 0xC316,
                0x8E2C, 0xCF16, 0xC136, 0x866C, 0xC112, 0x8624, 0x9E6C, 0xC712, 0x9E24, 0x82EC, 0x8264, 0x8EEC, 0xC332, 0x8E64, 0xBEEC, 0xCF32, 0xBE64, 0xC172, 0x86E4, 0xC772,
                0x9EE4, 0xDF72, 0x8116, 0x8716, 0x8336, 0x8312, 0x8F36, 0x8F12, 0x8176, 0x8132, 0x8776, 0x8732, 0x9F76, 0x9F32, 0x8372, 0x8F72, 0xBF72, 0xA160, 0xE858, 0xFA16,
                0xD1B0, 0xF46C, 0xD090, 0xF424, 0xA760, 0xE9D8, 0xFA76, 0xA320, 0xE8C8, 0xFA32, 0xD7B0, 0xF5EC, 0xD390, 0xF4E4, 0xAF20, 0xEBC8, 0xFAF2, 0x90B0, 0xE42C, 0xD858,
                0xF616, 0xC8D8, 0xF236, 0xB1B0, 0xC848, 0xF212, 0xB090, 0xEC24, 0x93B0, 0xE4EC, 0x9190, 0xE464, 0xD8C8, 0xF632, 0xCBD8, 0xF2F6, 0xB7B0, 0xC9C8, 0xF272, 0xB390,
                0xECE4, 0x9790, 0xE5E4, 0xDBC8, 0xF6F2, 0x8858, 0xE216, 0xCC2C, 0xB858, 0xEE16, 0xC46C, 0x98D8, 0xC424, 0x9848, 0xE612, 0xDC24, 0x89D8, 0xE276, 0x88C8, 0xE232,
                0xB9D8, 0xCC64, 0xB8C8, 0xEE32, 0xC5EC, 0x9BD8, 0xC4E4, 0x99C8, 0xE672, 0xDCE4, 0x8BC8, 0xE2F2, 0xCDE4, 0xBBC8, 0xEEF2, 0x842C, 0xC616, 0x9C2C, 0xC236, 0x8C6C,
                0xC212, 0x8C24, 0xBC6C, 0xCE12, 0x84EC, 0x8464, 0x9CEC, 0xC632, 0x9C64, 0xDE32, 0xC2F6, 0x8DEC, 0xC272, 0x8CE4, 0xBDEC, 0xCE72, 0xBCE4, 0x85E4, 0xC6F2, 0x9DE4,
                0xDEF2, 0x8216, 0x8E16, 0x8636, 0x8612, 0x9E36, 0x8276, 0x8232, 0x8E76, 0x8E32, 0xBE76, 0x86F6, 0x8672, 0x9EF6, 0x9E72, 0x82F2, 0x8EF2, 0xBEF2, 0xA0B0, 0xE82C,
                0xD0D8, 0xF436, 0xD048, 0xF412, 0xA3B0, 0xE8EC, 0xA190, 0xE864, 0xD3D8, 0xF4F6, 0xD1C8, 0xF472, 0xAFB0, 0xEBEC, 0xA790, 0xE9E4, 0xD7C8, 0xF5F2, 0x9058, 0xE416,
                0xD82C, 0xC86C, 0xB0D8, 0xC824, 0xB048, 0xEC12, 0x91D8, 0xE476, 0x90C8, 0xE432, 0xD864, 0xC9EC, 0xB3D8, 0xC8E4, 0xB1C8, 0xEC72, 0x97D8, 0xE5F6, 0x93C8, 0xE4F2,
                0xD9E4, 0xCBE4, 0xB7C8, 0xEDF2, 0x882C, 0xCC16, 0xC436, 0x986C, 0xC412, 0x9824, 0x88EC, 0x8864, 0xB8EC, 0xCC32, 0xB864, 0xC4F6, 0x99EC, 0xC472, 0x98E4, 0xDC72,
                0x8BEC, 0x89E4, 0xBBEC, 0xCCF2, 0xB9E4, 0xC5F2, 0x9BE4, 0xDDF2, 0x8416, 0x8C36, 0x8C12, 0x8476, 0x8432, 0x9C76, 0x9C32, 0x8CF6, 0x8C72, 0xBCF6, 0xBC72, 0x85F6,
                0x84F2, 0x9DF6, 0x9CF2, 0x8DF2, 0xBDF2, 0xA058, 0xE816, 0xD06C, 0xD024, 0xA1D8, 0xE876, 0xA0C8, 0xE832, 0xD1EC, 0xD0E4, 0xA7D8, 0xE9F6, 0xA3C8, 0xE8F2, 0xD7EC,
                0xD3E4, 0x902C, 0xC836, 0xB06C, 0xC812, 0x90EC, 0x9064, 0xD832, 0xC8F6, 0xB1EC, 0xC872, 0xB0E4, 0x93EC, 0x91E4, 0xD8F2, 0xCBF6, 0xB7EC, 0xC9F2, 0xB3E4, 0x8816,
                0x9836, 0x8876, 0x8832, 0xB876, 0x98F6, 0x9872, 0x89F6, 0x88F2, 0xB9F6, 0xB8F2, 0x9BF6, 0x99F2, 0xEA60, 0xFA98, 0xD440, 0xF510, 0xFD44, 0xED70, 0xFB5C, 0x94C0,
                0xE530, 0xF94C, 0xDA60, 0xF698, 0xFDA6, 0xCA20, 0xF288, 0xB440, 0xED10, 0xFB44, 0x9AE0, 0xE6B8, 0xF9AE, 0xDD70, 0xF75C, 0x8A60, 0xE298, 0xCD30, 0xF34C, 0xBA60,
                0xEE98, 0xFBA6, 0xC510, 0xF144, 0x9A20, 0xE688, 0xF9A2, 0xDD10, 0xF744, 0x8D70, 0xE35C, 0xCEB8, 0xF3AE, 0xBD70, 0xEF5C, 0x8530, 0xE14C, 0xC698, 0xF1A6, 0x9D30,
                0xE74C, 0xDE98, 0xF7A6, 0xC288, 0x8D10, 0xE344, 0xCE88, 0xF3A2, 0xBD10, 0xEF44, 0x86B8, 0xE1AE, 0xC75C, 0x9EB8, 0xE7AE, 0xDF5C, 0x8298, 0xC34C, 0x8E98, 0xE3A6,
                0xCF4C, 0xBE98, 0xEFA6, 0xC144, 0x8688, 0xE1A2, 0xC744, 0x9E88, 0xE7A2, 0xDF44, 0x835C, 0xC3AE, 0x8F5C, 0xCFAE, 0xBF5C, 0x814C, 0xC1A6, 0x874C, 0xC7A6, 0x9F4C,
                0xDFA6, 0x8344, 0xC3A2, 0x8F44, 0xCFA2, 0xBF44, 0xD2E0, 0xF4B8, 0xFD2E, 0xADC0, 0xEB70, 0xFADC, 0xA4C0, 0xE930, 0xFA4C, 0xD660, 0xF598, 0xFD66, 0xD220, 0xF488,
                0xFD22, 0xAC40, 0xEB10, 0xFAC4, 0xC970, 0xF25C, 0xB2E0, 0xECB8, 0xFB2E, 0x96E0, 0xE5B8, 0xF96E, 0x9260, 0xE498, 0xF926, 0xD930, 0xF64C, 0xCB30, 0xF2CC, 0xB660,
                0xC910, 0xF244, 0xB220, 0xEC88, 0xFB22, 0x9620, 0xE588, 0xF962, 0xDB10, 0xF6C4, 0xC4B8, 0xF12E, 0x9970, 0xE65C, 0xDCB8, 0xF72E, 0x8B70, 0xE2DC, 0x8930, 0xE24C,
                0xBB70, 0xCC98, 0xF326, 0xB930, 0xEE4C, 0xC598, 0xF166, 0x9B30, 0xC488, 0xF122, 0x9910, 0xE644, 0xDC88, 0xF722, 0x8B10, 0xE2C4, 0xCD88, 0xF362, 0xBB10, 0xEEC4,
                0xC25C, 0x8CB8, 0xE32E, 0xCE5C, 0xBCB8, 0xEF2E, 0x85B8, 0xE16E, 0x8498, 0xE126, 0x9DB8, 0xC64C, 0x9C98, 0xE726, 0xDE4C, 0xC2CC, 0x8D98, 0xC244, 0x8C88, 0xE322,
                0xBD98, 0xCE44, 0xBC88, 0xEF22, 0x8588, 0xE162, 0xC6C4, 0x9D88, 0xE762, 0xDEC4, 0xC12E, 0x865C, 0xC72E, 0x9E5C, 0xDF2E, 0x82DC, 0x824C, 0x8EDC, 0xC326, 0x8E4C,
                0xBEDC, 0xCF26, 0xBE4C, 0xC166, 0x86CC, 0xC122, 0x8644, 0x9ECC, 0xC722, 0x9E44, 0xDF22, 0x82C4, 0xC362, 0x8EC4, 0xCF62, 0xBEC4, 0x832E, 0x8F2E, 0x816E, 0x8126,
                0x876E, 0x8726, 0x9F6E, 0x9F26, 0x8366, 0x8322, 0x8F66, 0x8F22, 0xBF66, 0x8162, 0x8762, 0x9F62, 0xD170, 0xF45C, 0xA6E0, 0xE9B8, 0xFA6E, 0xA260, 0xE898, 0xFA26,
                0xD770, 0xF5DC, 0xD330, 0xF4CC, 0xD110, 0xF444, 0xAE60, 0xEB98, 0xFAE6, 0xA620, 0xE988, 0xFA62, 0xD710, 0xF5C4, 0xC8B8, 0xF22E, 0xB170, 0xEC5C, 0x9370, 0xE4DC,
                0x9130, 0xE44C, 0xD898, 0xF626, 0xCBB8, 0xF2EE, 0xB770, 0xC998, 0xF266, 0xB330, 0xC888, 0xF222, 0xB110, 0xEC44, 0x9730, 0xE5CC, 0x9310, 0xE4C4, 0xD988, 0xF662,
                0xCB88, 0xF2E2, 0xB710, 0xEDC4, 0xC45C, 0x98B8, 0xE62E, 0xDC5C, 0x89B8, 0xE26E, 0x8898, 0xE226, 0xB9B8, 0xCC4C, 0xB898, 0xEE26, 0xC5DC, 0x9BB8, 0xC4CC, 0x9998,
                0xC444, 0x9888, 0xE622, 0xDC44, 0x8B98, 0xE2E6, 0x8988, 0xE262, 0xBB98, 0xCCC4, 0xB988, 0xEE62, 0xC5C4, 0x9B88, 0xE6E2, 0xDDC4, 0xC22E, 0x8C5C, 0xCE2E, 0xBC5C,
                0x84DC, 0x844C, 0x9CDC, 0xC626, 0x9C4C, 0xDE26, 0xC2EE, 0x8DDC, 0xC266, 0x8CCC, 0xC222, 0xBDDC, 0x8C44, 0xBCCC, 0xCE22, 0xBC44, 0x85CC, 0x84C4, 0x9DCC, 0xC662,
                0x9CC4, 0xDE62, 0xC2E2, 0x8DC4, 0xCEE2, 0xBDC4, 0x862E, 0x9E2E, 0x826E, 0x8226, 0x8E6E, 0x8E26, 0xBE6E, 0x86EE, 0x8666, 0x9EEE, 0x8622, 0x9E66, 0x9E22, 0x82E6,
                0x8262, 0x8EE6, 0x8E62, 0xBEE6, 0xBE62, 0x86E2, 0x9EE2, 0xD0B8, 0xF42E, 0xA370, 0xE8DC, 0xA130, 0xE84C, 0xD3B8, 0xF4EE, 0xD198, 0xF466, 0xD088, 0xF422, 0xAF70,
                0xEBDC, 0xA730, 0xE9CC, 0xA310, 0xE8C4, 0xD798, 0xF5E6, 0xD388, 0xF4E2, 0xAF10, 0xEBC4, 0xC85C, 0xB0B8, 0xEC2E, 0x91B8, 0xE46E, 0x9098, 0xE426, 0xD84C, 0xC9DC,
                0xB3B8, 0xC8CC, 0xB198, 0xC844, 0xB088, 0xEC22, 0x97B8, 0xE5EE, 0x9398, 0xE4E6, 0x9188, 0xE462, 0xD8C4, 0xCBCC, 0xB798, 0xC9C4, 0xB388, 0xECE2, 0x9788, 0xE5E2,
                0xDBC4, 0xC42E, 0x985C, 0xDC2E, 0x88DC, 0x884C, 0xB8DC, 0xCC26, 0xB84C, 0xC4EE, 0x99DC, 0xC466, 0x98CC, 0xC422, 0x9844, 0xDC22, 0x8BDC, 0x89CC, 0xBBDC, 0x88C4,
                0xB9CC, 0xCC62, 0xB8C4, 0xC5E6, 0x9BCC, 0xC4E2, 0x99C4, 0xDCE2, 0x8BC4, 0xCDE2, 0xBBC4, 0x8C2E, 0x846E, 0x8426, 0x9C6E, 0x9C26, 0x8CEE, 0x8C66, 0xBCEE, 0x8C22,
                0xBC66, 0x85EE, 0x84E6, 0x9DEE, 0x8462, 0x9CE6, 0x9C62, 0x8DE6, 0x8CE2, 0xBDE6, 0xBCE2, 0x85E2, 0x9DE2, 0xD05C, 0xA1B8, 0xE86E, 0xA098, 0xE826, 0xD1DC, 0xD0CC,
                0xD044, 0xA7B8, 0xE9EE, 0xA398, 0xE8E6, 0xA188, 0xE862, 0xD7DC, 0xD3CC, 0xD1C4, 0xAF98, 0xEBE6, 0xA788, 0xE9E2, 0xC82E, 0xB05C, 0x90DC, 0x904C, 0xD826, 0xC8EE,
                0xB1DC, 0xC866, 0xB0CC, 0xC822, 0xB044, 0x93DC, 0x91CC, 0x90C4, 0xD862, 0xCBEE, 0xB7DC, 0xC9E6, 0xB3CC, 0xC8E2, 0xB1C4, 0x97CC, 0x93C4, 0xD9E2, 0x982E, 0x886E,
                0x8826, 0xB86E, 0x98EE, 0x9866, 0x9822, 0x89EE, 0x88E6, 0xB9EE, 0x8862, 0xB8E6, 0xB862, 0x9BEE, 0x99E6, 0x98E2, 0x8BE6, 0x89E2, 0xBBE6, 0xB9E2, 0xD02E, 0xA0DC,
                0xA04C, 0xD0EE, 0xD066, 0xD022, 0xA3DC, 0xA1CC, 0xA0C4, 0xD3EE, 0xD1E6, 0xD0E2, 0xAFDC, 0xA7CC, 0xA3C4, 0x906E, 0x9026, 0xB0EE, 0xB066, 0x91EE, 0x90E6, 0x9062,
                0xB3EE, 0xB1E6, 0xB0E2, 0x97EE, 0x93E6, 0x91E2, 0xD4E0, 0xF538, 0xFD4E, 0xA8C0, 0xEA30, 0xFA8C, 0xD420, 0xF508, 0xFD42, 0xDAF0, 0xF6BC, 0xCA70, 0xF29C, 0xB4E0,
                0xED38, 0xFB4E, 0x9460, 0xE518, 0xF946, 0xDA30, 0xF68C, 0xCA10, 0xF284, 0xB420, 0xED08, 0xFB42, 0xCD78, 0xF35E, 0xBAF0, 0xEEBC, 0xC538, 0xF14E, 0x9A70, 0xE69C,
                0xDD38, 0xF74E, 0x8A30, 0xE28C, 0xCD18, 0xF346, 0xBA30, 0xEE8C, 0xC508, 0xF142, 0x9A10, 0xE684, 0xDD08, 0xF742, 0xC6BC, 0x9D78, 0xE75E, 0xDEBC, 0xC29C, 0x8D38,
                0xE34E, 0xCE9C, 0xBD38, 0xEF4E, 0x8518, 0xE146, 0xC68C, 0x9D18, 0xE746, 0xDE8C, 0xC284, 0x8D08, 0xE342, 0xCE84, 0xBD08, 0xEF42, 0xC35E, 0x8EBC, 0xCF5E, 0xBEBC,
                0xC14E, 0x869C, 0xC74E, 0x9E9C, 0xDF4E, 0x828C, 0xC346, 0x8E8C, 0xCF46, 0xBE8C, 0xC142, 0x8684, 0xC742, 0x9E84, 0xDF42, 0x875E, 0x9F5E, 0x834E, 0x8F4E, 0xBF4E,
                0x8146, 0x8746, 0x9F46, 0x8342, 0x8F42, 0xBF42, 0xE978, 0xFA5E, 0xD6F0, 0xF5BC, 0xD270, 0xF49C, 0xACE0, 0xEB38, 0xFACE, 0xA460, 0xE918, 0xFA46, 0xD630, 0xF58C,
                0xD210, 0xF484, 0xAC20, 0xEB08, 0xFAC2, 0x92F0, 0xE4BC, 0xD978, 0xF65E, 0xCB78, 0xF2DE, 0xB6F0, 0xC938, 0xF24E, 0xB270, 0xEC9C, 0x9670, 0xE59C, 0x9230, 0xE48C,
                0xD918, 0xF646, 0xCB18, 0xF2C6, 0xB630, 0xC908, 0xF242, 0xB210, 0xEC84, 0x9610, 0xE584, 0xDB08, 0xF6C2, 0x8978, 0xE25E, 0xCCBC, 0xB978, 0xEE5E, 0xC5BC, 0x9B78,
                0xC49C, 0x9938, 0xE64E, 0xDC9C, 0x8B38, 0xE2CE, 0x8918, 0xE246, 0xBB38, 0xCC8C, 0xB918, 0xEE46, 0xC58C, 0x9B18, 0xC484, 0x9908, 0xE642, 0xDC84, 0x8B08, 0xE2C2,
                0xCD84, 0xBB08, 0xEEC2, 0x84BC, 0xC65E, 0x9CBC, 0xDE5E, 0xC2DE, 0x8DBC, 0xC24E, 0x8C9C, 0xBDBC, 0xCE4E, 0xBC9C, 0x859C, 0x848C, 0x9D9C, 0xC646, 0x9C8C, 0xDE46,
                0xC2C6, 0x8D8C, 0xC242, 0x8C84, 0xBD8C, 0xCE42, 0xBC84, 0x8584, 0xC6C2, 0x9D84, 0xDEC2, 0x825E, 0x8E5E, 0xBE5E, 0x86DE, 0x864E, 0x9EDE, 0x9E4E, 0x82CE, 0x8246,
                0x8ECE, 0x8E46, 0xBECE, 0xBE46, 0x86C6, 0x8642, 0x9EC6, 0x9E42, 0x82C2, 0x8EC2, 0xBEC2, 0xA2F0, 0xE8BC, 0xD378, 0xF4DE, 0xD138, 0xF44E, 0xAEF0, 0xEBBC, 0xA670,
                0xE99C, 0xA230, 0xE88C, 0xD738, 0xF5CE, 0xD318, 0xF4C6, 0xD108, 0xF442, 0xAE30, 0xEB8C, 0xA610, 0xE984, 0xD708, 0xF5C2, 0x9178, 0xE45E, 0xD8BC, 0xC9BC, 0xB378,
                0xC89C, 0xB138, 0xEC4E, 0x9778, 0xE5DE, 0x9338, 0xE4CE, 0x9118, 0xE446, 0xD88C, 0xCB9C, 0xB738, 0xC98C, 0xB318, 0xC884, 0xB108, 0xEC42, 0x9718, 0xE5C6, 0x9308,
                0xE4C2, 0xD984, 0xCB84, 0xB708, 0xEDC2, 0x88BC, 0xCC5E, 0xB8BC, 0xC4DE, 0x99BC, 0xC44E, 0x989C, 0xDC4E, 0x8BBC, 0x899C, 0xBBBC, 0x888C, 0xB99C, 0xCC46, 0xB88C,
                0xC5CE, 0x9B9C, 0xC4C6, 0x998C, 0xC442, 0x9884, 0xDC42, 0x8B8C, 0x8984, 0xBB8C, 0xCCC2, 0xB984, 0xC5C2, 0x9B84, 0xDDC2, 0x845E, 0x9C5E, 0x8CDE, 0x8C4E, 0xBCDE,
                0xBC4E, 0x85DE, 0x84CE, 0x9DDE, 0x8446, 0x9CCE, 0x9C46, 0x8DCE, 0x8CC6, 0xBDCE, 0x8C42, 0xBCC6, 0xBC42, 0x85C6, 0x84C2, 0x9DC6, 0x9CC2, 0x8DC2, 0xBDC2, 0xA178,
                0xE85E, 0xD1BC, 0xD09C, 0xA778, 0xE9DE, 0xA338, 0xE8CE, 0xA118, 0xE846, 0xD7BC, 0xD39C, 0xD18C, 0xD084, 0xAF38, 0xEBCE, 0xA718, 0xE9C6, 0xA308, 0xE8C2, 0xD78C,
                0xD384, 0x90BC, 0xD85E, 0xC8DE, 0xB1BC, 0xC84E, 0xB09C, 0x93BC, 0x919C, 0x908C, 0xD846, 0xCBDE, 0xB7BC, 0xC9CE, 0xB39C, 0xC8C6, 0xB18C, 0xC842, 0xB084, 0x979C,
                0x938C, 0x9184, 0xD8C2, 0xCBC6, 0xB78C, 0xC9C2, 0xB384, 0x885E, 0xB85E, 0x98DE, 0x984E, 0x89DE, 0x88CE, 0xB9DE, 0x8846, 0xB8CE, 0xB846, 0x9BDE, 0x99CE, 0x98C6,
                0x9842, 0x8BCE, 0x89C6, 0xBBCE, 0x88C2, 0xB9C6, 0xB8C2, 0x9BC6, 0x99C2, 0xA0BC, 0xD0DE, 0xD04E, 0xA3BC, 0xA19C, 0xA08C, 0xD3DE, 0xD1CE, 0xD0C6, 0xD042, 0xAFBC,
                0xA79C, 0xA38C, 0xA184, 0xD7CE, 0xD3C6, 0xD1C2, 0x905E, 0xB0DE, 0xB04E, 0x91DE, 0x90CE, 0x9046, 0xB3DE, 0xB1CE, 0xB0C6, 0xB042, 0x97DE, 0x93CE, 0x91C6, 0x90C2,
                0xB7CE, 0xB3C6, 0xB1C2, 0xA05E, 0xA1DE, 0xA0CE, 0xA046, 0xA7DE, 0xA3CE, 0xA1C6, 0xA0C2, 0xA9E0, 0xEA78, 0xFA9E, 0xD470, 0xF51C, 0xA860, 0xEA18, 0xFA86, 0xD410,
                0xF504, 0xED7C, 0x94F0, 0xE53C, 0xDA78, 0xF69E, 0xCA38, 0xF28E, 0xB470, 0xED1C, 0x9430, 0xE50C, 0xDA18, 0xF686, 0xCA08, 0xF282, 0xB410, 0xED04, 0x9AF8, 0xE6BE,
                0xDD7C, 0x8A78, 0xE29E, 0xCD3C, 0xBA78, 0xEE9E, 0xC51C, 0x9A38, 0xE68E, 0xDD1C, 0x8A18, 0xE286, 0xCD0C, 0xBA18, 0xEE86, 0xC504, 0x9A08, 0xE682, 0xDD04, 0x8D7C,
                0xCEBE, 0xBD7C, 0x853C, 0xC69E, 0x9D3C, 0xDE9E, 0xC28E, 0x8D1C, 0xCE8E, 0xBD1C, 0x850C, 0xC686, 0x9D0C, 0xDE86, 0xC282, 0x8D04, 0xCE82, 0xBD04, 0x86BE, 0x9EBE,
                0x829E, 0x8E9E, 0xBE9E, 0x868E, 0x9E8E, 0x8286, 0x8E86, 0xBE86, 0x8682, 0x9E82, 0xD2F8, 0xF4BE, 0xADF0, 0xEB7C, 0xA4F0, 0xE93C, 0xD678, 0xF59E, 0xD238, 0xF48E,
                0xAC70, 0xEB1C, 0xA430, 0xE90C, 0xD618, 0xF586, 0xD208, 0xF482, 0xAC10, 0xEB04, 0xC97C, 0xB2F8, 0xECBE, 0x96F8, 0xE5BE, 0x9278, 0xE49E, 0xD93C, 0xCB3C, 0xB678,
                0xC91C, 0xB238, 0xEC8E, 0x9638, 0xE58E, 0x9218, 0xE486, 0xD90C, 0xCB0C, 0xB618, 0xC904, 0xB208, 0xEC82, 0x9608, 0xE582, 0xDB04, 0xC4BE, 0x997C, 0xDCBE, 0x8B7C,
                0x893C, 0xBB7C, 0xCC9E, 0xB93C, 0xC59E, 0x9B3C, 0xC48E, 0x991C, 0xDC8E, 0x8B1C, 0x890C, 0xBB1C, 0xCC86, 0xB90C, 0xC586, 0x9B0C, 0xC482, 0x9904, 0xDC82, 0x8B04,
                0xCD82, 0xBB04, 0x8CBE, 0xBCBE, 0x85BE, 0x849E, 0x9DBE, 0x9C9E, 0x8D9E, 0x8C8E, 0xBD9E, 0xBC8E, 0x858E, 0x8486, 0x9D8E, 0x9C86, 0x8D86, 0x8C82, 0xBD86, 0xBC82,
                0x8582, 0x9D82, 0xD17C, 0xA6F8, 0xE9BE, 0xA278, 0xE89E, 0xD77C, 0xD33C, 0xD11C, 0xAE78, 0xEB9E, 0xA638, 0xE98E, 0xA218, 0xE886, 0xD71C, 0xD30C, 0xD104, 0xAE18,
                0xEB86, 0xA608, 0xE982, 0xC8BE, 0xB17C, 0x937C, 0x913C, 0xD89E, 0xCBBE, 0xB77C, 0xC99E, 0xB33C, 0xC88E, 0xB11C, 0x973C, 0x931C, 0x910C, 0xD886, 0xCB8E, 0xB71C,
                0xC986, 0xB30C, 0xC882, 0xB104, 0x970C, 0x9304, 0xD982, 0x98BE, 0x89BE, 0x889E, 0xB9BE, 0xB89E, 0x9BBE, 0x999E, 0x988E, 0x8B9E, 0x898E, 0xBB9E, 0x8886, 0xB98E,
                0xB886, 0x9B8E, 0x9986, 0x9882, 0x8B86, 0x8982, 0xBB86, 0xB982, 0xD0BE, 0xA37C, 0xA13C, 0xD3BE, 0xD19E, 0xD08E, 0xAF7C, 0xA73C, 0xA31C, 0xA10C, 0xD79E, 0xD38E,
                0xD186, 0xD082, 0xAF1C, 0xA70C, 0xA304, 0xB0BE, 0x91BE, 0x909E, 0xB3BE, 0xB19E, 0xB08E, 0x97BE, 0x939E, 0x918E, 0x9086, 0xB79E, 0xB38E, 0xB186, 0xB082, 0x978E,
                0x9386, 0x9182, 0xA1BE, 0xA09E, 0xA7BE, 0xA39E, 0xA18E, 0xA086, 0xAF9E, 0xA78E, 0xA386, 0xA182, 0xD4F8, 0xF53E, 0xA8F0, 0xEA3C, 0xD438, 0xF50E, 0xA830, 0xEA0C,
                0xD408, 0xF502, 0xDAFC, 0xCA7C, 0xB4F8, 0xED3E, 0x9478, 0xE51E, 0xDA3C, 0xCA1C, 0xB438, 0xED0E, 0x9418, 0xE506, 0xDA0C, 0xCA04, 0xB408, 0xED02, 0xCD7E, 0xBAFC,
                0xC53E, 0x9A7C, 0xDD3E, 0x8A3C, 0xCD1E, 0xBA3C, 0xC50E, 0x9A1C, 0xDD0E, 0x8A0C, 0xCD06, 0xBA0C, 0xC502, 0x9A04, 0xDD02, 0x9D7E, 0x8D3E, 0xBD3E, 0x851E, 0x9D1E,
                0x8D0E, 0xBD0E, 0x8506, 0x9D06, 0x8D02, 0xBD02, 0xE97E, 0xD6FC, 0xD27C, 0xACF8, 0xEB3E, 0xA478, 0xE91E, 0xD63C, 0xD21C, 0xAC38, 0xEB0E, 0xA418, 0xE906, 0xD60C,
                0xD204, 0x92FC, 0xD97E, 0xCB7E, 0xB6FC, 0xC93E, 0xB27C, 0x967C, 0x923C, 0xD91E, 0xCB1E, 0xB63C, 0xC90E, 0xB21C, 0x961C, 0x920C, 0xD906, 0xCB06, 0xB60C, 0xC902,
                0xB204, 0x897E, 0xB97E, 0x9B7E, 0x993E, 0x8B3E, 0x891E, 0xBB3E, 0xB91E, 0x9B1E, 0x990E, 0x8B0E, 0x8906, 0xBB0E, 0xB906, 0x9B06, 0x9902, 0xA2FC, 0xD37E, 0xD13E,
                0xAEFC
            ];
            var EVEN_TABLE = [
                0xBE5C, 0xC16E, 0x86DC, 0xC126, 0x864C, 0x9EDC, 0xC726, 0x9E4C, 0xDF26, 0x82CC, 0x8244, 0x8ECC, 0xC322, 0x8E44, 0xBECC, 0xCF22, 0xBE44, 0xC162, 0x86C4, 0xC762,
                0x9EC4, 0xDF62, 0x812E, 0x872E, 0x9F2E, 0x836E, 0x8326, 0x8F6E, 0x8F26, 0xBF6E, 0x8166, 0x8122, 0x8766, 0x8722, 0x9F66, 0x9F22, 0x8362, 0x8F62, 0xBF62, 0xA2E0,
                0xE8B8, 0xFA2E, 0xD370, 0xF4DC, 0xD130, 0xF44C, 0xAEE0, 0xEBB8, 0xFAEE, 0xA660, 0xE998, 0xFA66, 0xA220, 0xE888, 0xFA22, 0xD730, 0xF5CC, 0xD310, 0xF4C4, 0xAE20,
                0xEB88, 0xFAE2, 0x9170, 0xE45C, 0xD8B8, 0xF62E, 0xC9B8, 0xF26E, 0xB370, 0xC898, 0xF226, 0xB130, 0xEC4C, 0x9770, 0xE5DC, 0x9330, 0xE4CC, 0x9110, 0xE444, 0xD888,
                0xF622, 0xCB98, 0xF2E6, 0xB730, 0xC988, 0xF262, 0xB310, 0xECC4, 0x9710, 0xE5C4, 0xDB88, 0xF6E2, 0x88B8, 0xE22E, 0xCC5C, 0xB8B8, 0xEE2E, 0xC4DC, 0x99B8, 0xC44C,
                0x9898, 0xE626, 0xDC4C, 0x8BB8, 0xE2EE, 0x8998, 0xE266, 0xBBB8, 0x8888, 0xE222, 0xB998, 0xCC44, 0xB888, 0xEE22, 0xC5CC, 0x9B98, 0xC4C4, 0x9988, 0xE662, 0xDCC4,
                0x8B88, 0xE2E2, 0xCDC4, 0xBB88, 0xEEE2, 0x845C, 0xC62E, 0x9C5C, 0xDE2E, 0xC26E, 0x8CDC, 0xC226, 0x8C4C, 0xBCDC, 0xCE26, 0xBC4C, 0x85DC, 0x84CC, 0x9DDC, 0x8444,
                0x9CCC, 0xC622, 0x9C44, 0xDE22, 0xC2E6, 0x8DCC, 0xC262, 0x8CC4, 0xBDCC, 0xCE62, 0xBCC4, 0x85C4, 0xC6E2, 0x9DC4, 0xDEE2, 0x822E, 0x8E2E, 0x866E, 0x8626, 0x9E6E,
                0x9E26, 0x82EE, 0x8266, 0x8EEE, 0x8222, 0x8E66, 0xBEEE, 0x8E22, 0xBE66, 0x86E6, 0x8662, 0x9EE6, 0x9E62, 0x82E2, 0x8EE2, 0xBEE2, 0xA170, 0xE85C, 0xD1B8, 0xF46E,
                0xD098, 0xF426, 0xA770, 0xE9DC, 0xA330, 0xE8CC, 0xA110, 0xE844, 0xD7B8, 0xF5EE, 0xD398, 0xF4E6, 0xD188, 0xF462, 0xAF30, 0xEBCC, 0xA710, 0xE9C4, 0xD788, 0xF5E2,
                0x90B8, 0xE42E, 0xD85C, 0xC8DC, 0xB1B8, 0xC84C, 0xB098, 0xEC26, 0x93B8, 0xE4EE, 0x9198, 0xE466, 0x9088, 0xE422, 0xD844, 0xCBDC, 0xB7B8, 0xC9CC, 0xB398, 0xC8C4,
                0xB188, 0xEC62, 0x9798, 0xE5E6, 0x9388, 0xE4E2, 0xD9C4, 0xCBC4, 0xB788, 0xEDE2, 0x885C, 0xCC2E, 0xB85C, 0xC46E, 0x98DC, 0xC426, 0x984C, 0xDC26, 0x89DC, 0x88CC,
                0xB9DC, 0x8844, 0xB8CC, 0xCC22, 0xB844, 0xC5EE, 0x9BDC, 0xC4E6, 0x99CC, 0xC462, 0x98C4, 0xDC62, 0x8BCC, 0x89C4, 0xBBCC, 0xCCE2, 0xB9C4, 0xC5E2, 0x9BC4, 0xDDE2,
                0x842E, 0x9C2E, 0x8C6E, 0x8C26, 0xBC6E, 0x84EE, 0x8466, 0x9CEE, 0x8422, 0x9C66, 0x9C22, 0x8DEE, 0x8CE6, 0xBDEE, 0x8C62, 0xBCE6, 0xBC62, 0x85E6, 0x84E2, 0x9DE6,
                0x9CE2, 0x8DE2, 0xBDE2, 0xA0B8, 0xE82E, 0xD0DC, 0xD04C, 0xA3B8, 0xE8EE, 0xA198, 0xE866, 0xA088, 0xE822, 0xD3DC, 0xD1CC, 0xD0C4, 0xAFB8, 0xEBEE, 0xA798, 0xE9E6,
                0xA388, 0xE8E2, 0xD7CC, 0xD3C4, 0x905C, 0xD82E, 0xC86E, 0xB0DC, 0xC826, 0xB04C, 0x91DC, 0x90CC, 0x9044, 0xD822, 0xC9EE, 0xB3DC, 0xC8E6, 0xB1CC, 0xC862, 0xB0C4,
                0x97DC, 0x93CC, 0x91C4, 0xD8E2, 0xCBE6, 0xB7CC, 0xC9E2, 0xB3C4, 0x882E, 0x986E, 0x9826, 0x88EE, 0x8866, 0xB8EE, 0x8822, 0xB866, 0x99EE, 0x98E6, 0x9862, 0x8BEE,
                0x89E6, 0xBBEE, 0x88E2, 0xB9E6, 0xB8E2, 0x9BE6, 0x99E2, 0xA05C, 0xD06E, 0xD026, 0xA1DC, 0xA0CC, 0xA044, 0xD1EE, 0xD0E6, 0xD062, 0xA7DC, 0xA3CC, 0xA1C4, 0xD7EE,
                0xD3E6, 0xD1E2, 0x902E, 0xB06E, 0x90EE, 0x9066, 0x9022, 0xB1EE, 0xB0E6, 0xB062, 0x93EE, 0x91E6, 0x90E2, 0xB7EE, 0xB3E6, 0xB1E2, 0xA9C0, 0xEA70, 0xFA9C, 0xD460,
                0xF518, 0xFD46, 0xA840, 0xEA10, 0xFA84, 0xED78, 0xFB5E, 0x94E0, 0xE538, 0xF94E, 0xDA70, 0xF69C, 0xCA30, 0xF28C, 0xB460, 0xED18, 0xFB46, 0x9420, 0xE508, 0xF942,
                0xDA10, 0xF684, 0x9AF0, 0xE6BC, 0xDD78, 0xF75E, 0x8A70, 0xE29C, 0xCD38, 0xF34E, 0xBA70, 0xEE9C, 0xC518, 0xF146, 0x9A30, 0xE68C, 0xDD18, 0xF746, 0x8A10, 0xE284,
                0xCD08, 0xF342, 0xBA10, 0xEE84, 0x8D78, 0xE35E, 0xCEBC, 0xBD78, 0xEF5E, 0x8538, 0xE14E, 0xC69C, 0x9D38, 0xE74E, 0xDE9C, 0xC28C, 0x8D18, 0xE346, 0xCE8C, 0xBD18,
                0xEF46, 0x8508, 0xE142, 0xC684, 0x9D08, 0xE742, 0xDE84, 0x86BC, 0xC75E, 0x9EBC, 0xDF5E, 0x829C, 0xC34E, 0x8E9C, 0xCF4E, 0xBE9C, 0xC146, 0x868C, 0xC746, 0x9E8C,
                0xDF46, 0x8284, 0xC342, 0x8E84, 0xCF42, 0xBE84, 0x835E, 0x8F5E, 0xBF5E, 0x814E, 0x874E, 0x9F4E, 0x8346, 0x8F46, 0xBF46, 0x8142, 0x8742, 0x9F42, 0xD2F0, 0xF4BC,
                0xADE0, 0xEB78, 0xFADE, 0xA4E0, 0xE938, 0xFA4E, 0xD670, 0xF59C, 0xD230, 0xF48C, 0xAC60, 0xEB18, 0xFAC6, 0xA420, 0xE908, 0xFA42, 0xD610, 0xF584, 0xC978, 0xF25E,
                0xB2F0, 0xECBC, 0x96F0, 0xE5BC, 0x9270, 0xE49C, 0xD938, 0xF64E, 0xCB38, 0xF2CE, 0xB670, 0xC918, 0xF246, 0xB230, 0xEC8C, 0x9630, 0xE58C, 0x9210, 0xE484, 0xD908,
                0xF642, 0xCB08, 0xF2C2, 0xB610, 0xED84, 0xC4BC, 0x9978, 0xE65E, 0xDCBC, 0x8B78, 0xE2DE, 0x8938, 0xE24E, 0xBB78, 0xCC9C, 0xB938, 0xEE4E, 0xC59C, 0x9B38, 0xC48C,
                0x9918, 0xE646, 0xDC8C, 0x8B18, 0xE2C6, 0x8908, 0xE242, 0xBB18, 0xCC84, 0xB908, 0xEE42, 0xC584, 0x9B08, 0xE6C2, 0xDD84, 0xC25E, 0x8CBC, 0xCE5E, 0xBCBC, 0x85BC,
                0x849C, 0x9DBC, 0xC64E, 0x9C9C, 0xDE4E, 0xC2CE, 0x8D9C, 0xC246, 0x8C8C, 0xBD9C, 0xCE46, 0xBC8C, 0x858C, 0x8484, 0x9D8C, 0xC642, 0x9C84, 0xDE42, 0xC2C2, 0x8D84,
                0xCEC2, 0xBD84, 0x865E, 0x9E5E, 0x82DE, 0x824E, 0x8EDE, 0x8E4E, 0xBEDE, 0xBE4E, 0x86CE, 0x8646, 0x9ECE, 0x9E46, 0x82C6, 0x8242, 0x8EC6, 0x8E42, 0xBEC6, 0xBE42,
                0x86C2, 0x9EC2, 0xD178, 0xF45E, 0xA6F0, 0xE9BC, 0xA270, 0xE89C, 0xD778, 0xF5DE, 0xD338, 0xF4CE, 0xD118, 0xF446, 0xAE70, 0xEB9C, 0xA630, 0xE98C, 0xA210, 0xE884,
                0xD718, 0xF5C6, 0xD308, 0xF4C2, 0xAE10, 0xEB84, 0xC8BC, 0xB178, 0xEC5E, 0x9378, 0xE4DE, 0x9138, 0xE44E, 0xD89C, 0xCBBC, 0xB778, 0xC99C, 0xB338, 0xC88C, 0xB118,
                0xEC46, 0x9738, 0xE5CE, 0x9318, 0xE4C6, 0x9108, 0xE442, 0xD884, 0xCB8C, 0xB718, 0xC984, 0xB308, 0xECC2, 0x9708, 0xE5C2, 0xDB84, 0xC45E, 0x98BC, 0xDC5E, 0x89BC,
                0x889C, 0xB9BC, 0xCC4E, 0xB89C, 0xC5DE, 0x9BBC, 0xC4CE, 0x999C, 0xC446, 0x988C, 0xDC46, 0x8B9C, 0x898C, 0xBB9C, 0x8884, 0xB98C, 0xCC42, 0xB884, 0xC5C6, 0x9B8C,
                0xC4C2, 0x9984, 0xDCC2, 0x8B84, 0xCDC2, 0xBB84, 0x8C5E, 0xBC5E, 0x84DE, 0x844E, 0x9CDE, 0x9C4E, 0x8DDE, 0x8CCE, 0xBDDE, 0x8C46, 0xBCCE, 0xBC46, 0x85CE, 0x84C6,
                0x9DCE, 0x8442, 0x9CC6, 0x9C42, 0x8DC6, 0x8CC2, 0xBDC6, 0xBCC2, 0x85C2, 0x9DC2, 0xD0BC, 0xA378, 0xE8DE, 0xA138, 0xE84E, 0xD3BC, 0xD19C, 0xD08C, 0xAF78, 0xEBDE,
                0xA738, 0xE9CE, 0xA318, 0xE8C6, 0xA108, 0xE842, 0xD79C, 0xD38C, 0xD184, 0xAF18, 0xEBC6, 0xA708, 0xE9C2, 0xC85E, 0xB0BC, 0x91BC, 0x909C, 0xD84E, 0xC9DE, 0xB3BC,
                0xC8CE, 0xB19C, 0xC846, 0xB08C, 0x97BC, 0x939C, 0x918C, 0x9084, 0xD842, 0xCBCE, 0xB79C, 0xC9C6, 0xB38C, 0xC8C2, 0xB184, 0x978C, 0x9384, 0xD9C2, 0x985E, 0x88DE,
                0x884E, 0xB8DE, 0xB84E, 0x99DE, 0x98CE, 0x9846, 0x8BDE, 0x89CE, 0xBBDE, 0x88C6, 0xB9CE, 0x8842, 0xB8C6, 0xB842, 0x9BCE, 0x99C6, 0x98C2, 0x8BC6, 0x89C2, 0xBBC6,
                0xB9C2, 0xD05E, 0xA1BC, 0xA09C, 0xD1DE, 0xD0CE, 0xD046, 0xA7BC, 0xA39C, 0xA18C, 0xA084, 0xD7DE, 0xD3CE, 0xD1C6, 0xD0C2, 0xAF9C, 0xA78C, 0xA384, 0xB05E, 0x90DE,
                0x904E, 0xB1DE, 0xB0CE, 0xB046, 0x93DE, 0x91CE, 0x90C6, 0x9042, 0xB7DE, 0xB3CE, 0xB1C6, 0xB0C2, 0x97CE, 0x93C6, 0x91C2, 0xA0DE, 0xA04E, 0xA3DE, 0xA1CE, 0xA0C6,
                0xA042, 0xAFDE, 0xA7CE, 0xA3C6, 0xA1C2, 0xD4F0, 0xF53C, 0xA8E0, 0xEA38, 0xFA8E, 0xD430, 0xF50C, 0xA820, 0xEA08, 0xFA82, 0xDAF8, 0xF6BE, 0xCA78, 0xF29E, 0xB4F0,
                0xED3C, 0x9470, 0xE51C, 0xDA38, 0xF68E, 0xCA18, 0xF286, 0xB430, 0xED0C, 0x9410, 0xE504, 0xDA08, 0xF682, 0xCD7C, 0xBAF8, 0xEEBE, 0xC53C, 0x9A78, 0xE69E, 0xDD3C,
                0x8A38, 0xE28E, 0xCD1C, 0xBA38, 0xEE8E, 0xC50C, 0x9A18, 0xE686, 0xDD0C, 0x8A08, 0xE282, 0xCD04, 0xBA08, 0xEE82, 0xC6BE, 0x9D7C, 0xDEBE, 0xC29E, 0x8D3C, 0xCE9E,
                0xBD3C, 0x851C, 0xC68E, 0x9D1C, 0xDE8E, 0xC286, 0x8D0C, 0xCE86, 0xBD0C, 0x8504, 0xC682, 0x9D04, 0xDE82, 0x8EBE, 0xBEBE, 0x869E, 0x9E9E, 0x828E, 0x8E8E, 0xBE8E,
                0x8686, 0x9E86, 0x8282, 0x8E82, 0xBE82, 0xE97C, 0xD6F8, 0xF5BE, 0xD278, 0xF49E, 0xACF0, 0xEB3C, 0xA470, 0xE91C, 0xD638, 0xF58E, 0xD218, 0xF486, 0xAC30, 0xEB0C,
                0xA410, 0xE904, 0xD608, 0xF582, 0x92F8, 0xE4BE, 0xD97C, 0xCB7C, 0xB6F8, 0xC93C, 0xB278, 0xEC9E, 0x9678, 0xE59E, 0x9238, 0xE48E, 0xD91C, 0xCB1C, 0xB638, 0xC90C,
                0xB218, 0xEC86, 0x9618, 0xE586, 0x9208, 0xE482, 0xD904, 0xCB04, 0xB608, 0xED82, 0x897C, 0xCCBE, 0xB97C, 0xC5BE, 0x9B7C, 0xC49E, 0x993C, 0xDC9E, 0x8B3C, 0x891C,
                0xBB3C, 0xCC8E, 0xB91C, 0xC58E, 0x9B1C, 0xC486, 0x990C, 0xDC86, 0x8B0C, 0x8904, 0xBB0C, 0xCC82, 0xB904, 0xC582, 0x9B04, 0xDD82, 0x84BE, 0x9CBE, 0x8DBE, 0x8C9E,
                0xBDBE, 0xBC9E, 0x859E, 0x848E, 0x9D9E, 0x9C8E, 0x8D8E, 0x8C86, 0xBD8E, 0xBC86, 0x8586, 0x8482, 0x9D86, 0x9C82, 0x8D82, 0xBD82, 0xA2F8, 0xE8BE, 0xD37C, 0xD13C,
                0xAEF8, 0xEBBE, 0xA678, 0xE99E, 0xA238, 0xE88E, 0xD73C, 0xD31C, 0xD10C, 0xAE38, 0xEB8E, 0xA618, 0xE986, 0xA208, 0xE882, 0xD70C, 0xD304, 0x917C, 0xD8BE, 0xC9BE,
                0xB37C, 0xC89E, 0xB13C, 0x977C, 0x933C, 0x911C, 0xD88E, 0xCB9E, 0xB73C, 0xC98E, 0xB31C, 0xC886, 0xB10C, 0x971C, 0x930C, 0x9104, 0xD882, 0xCB86, 0xB70C, 0xC982,
                0xB304, 0x88BE, 0xB8BE, 0x99BE, 0x989E, 0x8BBE, 0x899E, 0xBBBE, 0x888E, 0xB99E, 0xB88E, 0x9B9E, 0x998E, 0x9886, 0x8B8E, 0x8986, 0xBB8E, 0x8882, 0xB986, 0xB882,
                0x9B86, 0x9982, 0xA17C, 0xD1BE, 0xD09E, 0xA77C, 0xA33C, 0xA11C, 0xD7BE, 0xD39E, 0xD18E, 0xD086, 0xAF3C, 0xA71C, 0xA30C, 0xA104, 0xD78E, 0xD386, 0xD182, 0x90BE,
                0xB1BE, 0xB09E, 0x93BE, 0x919E, 0x908E, 0xB7BE, 0xB39E, 0xB18E, 0xB086, 0x979E, 0x938E, 0x9186, 0x9082, 0xB78E, 0xB386, 0xB182, 0xA0BE, 0xA3BE, 0xA19E, 0xA08E,
                0xAFBE, 0xA79E, 0xA38E, 0xA186, 0xA082, 0xA9F0, 0xEA7C, 0xD478, 0xF51E, 0xA870, 0xEA1C, 0xD418, 0xF506, 0xA810, 0xEA04, 0xED7E, 0x94F8, 0xE53E, 0xDA7C, 0xCA3C,
                0xB478, 0xED1E, 0x9438, 0xE50E, 0xDA1C, 0xCA0C, 0xB418, 0xED06, 0x9408, 0xE502, 0xDA04, 0x9AFC, 0xDD7E, 0x8A7C, 0xCD3E, 0xBA7C, 0xC51E, 0x9A3C, 0xDD1E, 0x8A1C,
                0xCD0E, 0xBA1C, 0xC506, 0x9A0C, 0xDD06, 0x8A04, 0xCD02, 0xBA04, 0x8D7E, 0xBD7E, 0x853E, 0x9D3E, 0x8D1E, 0xBD1E, 0x850E, 0x9D0E, 0x8D06, 0xBD06, 0x8502, 0x9D02,
                0xD2FC, 0xADF8, 0xEB7E, 0xA4F8, 0xE93E, 0xD67C, 0xD23C, 0xAC78, 0xEB1E, 0xA438, 0xE90E, 0xD61C, 0xD20C, 0xAC18, 0xEB06, 0xA408, 0xE902, 0xC97E, 0xB2FC, 0x96FC,
                0x927C, 0xD93E, 0xCB3E, 0xB67C, 0xC91E, 0xB23C, 0x963C, 0x921C, 0xD90E, 0xCB0E, 0xB61C, 0xC906, 0xB20C, 0x960C, 0x9204, 0xD902, 0x997E, 0x8B7E, 0x893E, 0xBB7E,
                0xB93E, 0xE4A0, 0xF928, 0xD940, 0xF650, 0xFD94, 0xCB40, 0xF2D0, 0xEDA0, 0xFB68, 0x8940, 0xE250, 0xCCA0, 0xF328, 0xB940, 0xEE50, 0xFB94, 0xC5A0, 0xF168, 0x9B40,
                0xE6D0, 0xF9B4, 0xDDA0, 0xF768, 0xFDDA, 0x84A0, 0xE128, 0xC650, 0xF194, 0x9CA0, 0xE728, 0xF9CA, 0xDE50, 0xF794, 0xC2D0, 0x8DA0, 0xE368, 0xCED0, 0xF3B4, 0xBDA0,
                0xEF68, 0xFBDA, 0x8250, 0xC328, 0x8E50, 0xE394, 0xCF28, 0xF3CA, 0xBE50, 0xEF94, 0xC168, 0x86D0, 0xE1B4, 0xC768, 0xF1DA, 0x9ED0, 0xE7B4, 0xDF68, 0xF7DA, 0x8128,
                0xC194, 0x8728, 0xE1CA, 0xC794, 0x9F28, 0xE7CA, 0x8368, 0xC3B4, 0x8F68, 0xE3DA, 0xCFB4, 0xBF68, 0xEFDA, 0xE8A0, 0xFA28, 0xD340, 0xF4D0, 0xFD34, 0xEBA0, 0xFAE8,
                0x9140, 0xE450, 0xF914, 0xD8A0, 0xF628, 0xFD8A, 0xC9A0, 0xF268, 0xB340, 0xECD0, 0xFB34, 0x9740, 0xE5D0, 0xF974, 0xDBA0, 0xF6E8, 0xFDBA, 0x88A0, 0xE228, 0xCC50,
                0xF314, 0xB8A0, 0xEE28, 0xFB8A, 0xC4D0, 0xF134, 0x99A0, 0xE668, 0xF99A, 0xDCD0, 0xF734, 0x8BA0, 0xE2E8, 0xCDD0, 0xF374, 0xBBA0, 0xEEE8, 0xFBBA, 0x8450, 0xE114,
                0xC628, 0xF18A, 0x9C50, 0xE714, 0xDE28, 0xF78A, 0xC268, 0x8CD0, 0xE334, 0xCE68, 0xF39A, 0xBCD0, 0xEF34, 0x85D0, 0xE174, 0xC6E8, 0xF1BA, 0x9DD0, 0xE774, 0xDEE8,
                0xF7BA, 0x8228, 0xC314, 0x8E28, 0xE38A, 0xCF14, 0xC134, 0x8668, 0xE19A, 0xC734, 0x9E68, 0xE79A, 0xDF34, 0x82E8, 0xC374, 0x8EE8, 0xE3BA, 0xCF74, 0xBEE8, 0xEFBA,
                0x8114, 0xC18A, 0x8714, 0xC78A, 0x8334, 0xC39A, 0x8F34, 0xCF9A, 0x8174, 0xC1BA, 0x8774, 0xC7BA, 0x9F74, 0xDFBA, 0xA140, 0xE850, 0xFA14, 0xD1A0, 0xF468, 0xFD1A,
                0xA740, 0xE9D0, 0xFA74, 0xD7A0, 0xF5E8, 0xFD7A, 0x90A0, 0xE428, 0xF90A, 0xD850, 0xF614, 0xC8D0, 0xF234, 0xB1A0, 0xEC68, 0xFB1A, 0x93A0, 0xE4E8, 0xF93A, 0xD9D0,
                0xF674, 0xCBD0, 0xF2F4, 0xB7A0, 0xEDE8, 0xFB7A, 0x8850, 0xE214, 0xCC28, 0xF30A, 0xB850, 0xEE14, 0xC468, 0xF11A, 0x98D0, 0xE634, 0xDC68, 0xF71A, 0x89D0, 0xE274,
                0xCCE8, 0xF33A, 0xB9D0, 0xEE74, 0xC5E8, 0xF17A, 0x9BD0, 0xE6F4, 0xDDE8, 0xF77A, 0x8428, 0xE10A, 0xC614, 0x9C28, 0xE70A, 0xC234, 0x8C68, 0xE31A, 0xCE34, 0xBC68,
                0xEF1A, 0x84E8, 0xE13A, 0xC674, 0x9CE8, 0xE73A, 0xDE74, 0xC2F4, 0x8DE8, 0xE37A, 0xCEF4, 0xBDE8, 0xEF7A, 0x8214, 0xC30A, 0x8E14, 0xC11A, 0x8634, 0xC71A, 0x9E34,
                0x8274, 0xC33A, 0x8E74, 0xCF3A, 0xBE74, 0xC17A, 0x86F4, 0xC77A, 0x9EF4, 0xDF7A, 0x810A, 0x870A, 0x831A, 0x8F1A, 0x813A, 0x873A, 0x9F3A, 0x837A, 0x8F7A, 0xBF7A,
                0xA0A0, 0xE828, 0xFA0A, 0xD0D0, 0xF434, 0xA3A0, 0xE8E8, 0xFA3A, 0xD3D0, 0xF4F4, 0xAFA0, 0xEBE8, 0xFAFA, 0x9050, 0xE414, 0xD828, 0xF60A, 0xC868, 0xF21A, 0xB0D0,
                0xEC34, 0x91D0, 0xE474, 0xD8E8, 0xF63A, 0xC9E8, 0xF27A, 0xB3D0, 0xECF4, 0x97D0, 0xE5F4, 0xDBE8, 0xF6FA, 0x8828, 0xE20A, 0xCC14, 0xC434, 0x9868, 0xE61A, 0xDC34,
                0x88E8, 0xE23A, 0xCC74, 0xB8E8, 0xEE3A, 0xC4F4, 0x99E8, 0xE67A, 0xDCF4, 0x8BE8, 0xE2FA, 0xCDF4, 0xBBE8, 0xEEFA, 0x8414, 0xC60A, 0xC21A, 0x8C34, 0xCE1A, 0x8474,
                0xC63A, 0x9C74, 0xDE3A, 0xC27A, 0x8CF4, 0xCE7A, 0xBCF4, 0x85F4, 0xC6FA, 0x9DF4, 0xDEFA, 0x820A, 0x861A, 0x823A, 0x8E3A, 0x867A, 0x9E7A, 0x82FA, 0x8EFA, 0xBEFA,
                0xA050, 0xE814, 0xD068, 0xF41A, 0xA1D0, 0xE874, 0xD1E8, 0xF47A, 0xA7D0, 0xE9F4, 0xD7E8, 0xF5FA, 0x9028, 0xE40A, 0xC834, 0xB068, 0xEC1A, 0x90E8, 0xE43A, 0xD874,
                0xC8F4, 0xB1E8, 0xEC7A, 0x93E8, 0xE4FA, 0xD9F4, 0xCBF4, 0xB7E8, 0xEDFA, 0x8814, 0xC41A, 0x9834, 0x8874, 0xCC3A, 0xB874, 0xC47A, 0x98F4, 0xDC7A, 0x89F4, 0xCCFA,
                0xB9F4, 0xC5FA, 0x9BF4, 0xDDFA, 0x840A, 0x8C1A, 0x843A, 0x9C3A, 0x8C7A, 0xBC7A, 0x84FA, 0x9CFA, 0x8DFA, 0xBDFA, 0xEA40, 0xFA90, 0xED60, 0xFB58, 0xE520, 0xF948,
                0xDA40, 0xF690, 0xFDA4, 0x9AC0, 0xE6B0, 0xF9AC, 0xDD60, 0xF758, 0xFDD6, 0x8A40, 0xE290, 0xCD20, 0xF348, 0xBA40, 0xEE90, 0xFBA4, 0x8D60, 0xE358, 0xCEB0, 0xF3AC,
                0xBD60, 0xEF58, 0xFBD6, 0x8520, 0xE148, 0xC690, 0xF1A4, 0x9D20, 0xE748, 0xF9D2, 0xDE90, 0xF7A4, 0x86B0, 0xE1AC, 0xC758, 0xF1D6, 0x9EB0, 0xE7AC, 0xDF58, 0xF7D6,
                0x8290, 0xC348, 0x8E90, 0xE3A4, 0xCF48, 0xF3D2, 0xBE90, 0xEFA4, 0x8358, 0xC3AC, 0x8F58, 0xE3D6, 0xCFAC, 0xBF58, 0xEFD6, 0x8148, 0xC1A4, 0x8748, 0xE1D2, 0xC7A4,
                0x9F48, 0xE7D2, 0xDFA4, 0xD2C0, 0xF4B0, 0xFD2C, 0xEB60, 0xFAD8, 0xE920, 0xFA48, 0xD640, 0xF590, 0xFD64, 0xC960, 0xF258, 0xB2C0, 0xECB0, 0xFB2C, 0x96C0, 0xE5B0,
                0xF96C, 0x9240, 0xE490, 0xF924, 0xD920, 0xF648, 0xFD92, 0xCB20, 0xF2C8, 0xB640, 0xED90, 0xFB64, 0xC4B0, 0xF12C, 0x9960, 0xE658, 0xF996, 0xDCB0, 0xF72C, 0x8B60,
                0xE2D8, 0x8920, 0xE248, 0xBB60, 0xCC90, 0xF324, 0xB920, 0xEE48, 0xFB92, 0xC590, 0xF164, 0x9B20, 0xE6C8, 0xF9B2, 0xDD90, 0xF764, 0xC258, 0x8CB0, 0xE32C, 0xCE58,
                0xF396, 0xBCB0, 0xEF2C, 0x85B0, 0xE16C, 0x8490, 0xE124, 0x9DB0, 0xC648, 0xF192, 0x9C90, 0xE724, 0xDE48, 0xF792, 0xC2C8, 0x8D90, 0xE364, 0xCEC8, 0xF3B2, 0xBD90,
                0xEF64, 0xC12C, 0x8658, 0xE196, 0xC72C, 0x9E58, 0xE796, 0xDF2C, 0x82D8, 0x8248, 0x8ED8, 0xC324, 0x8E48, 0xE392, 0xBED8, 0xCF24, 0xBE48, 0xEF92, 0xC164, 0x86C8,
                0xE1B2, 0xC764, 0x9EC8, 0xE7B2, 0xDF64, 0x832C, 0xC396, 0x8F2C, 0xCF96, 0x816C, 0x8124, 0x876C, 0xC192, 0x8724, 0x9F6C, 0xC792, 0x9F24, 0x8364, 0xC3B2, 0x8F64,
                0xCFB2, 0xBF64, 0xD160, 0xF458, 0xFD16, 0xA6C0, 0xE9B0, 0xFA6C, 0xA240, 0xE890, 0xFA24, 0xD760, 0xF5D8, 0xFD76, 0xD320, 0xF4C8, 0xFD32, 0xAE40, 0xEB90, 0xFAE4,
                0xC8B0, 0xF22C, 0xB160, 0xEC58, 0xFB16, 0x9360, 0xE4D8, 0xF936, 0x9120, 0xE448, 0xF912, 0xD890, 0xF624, 0xCBB0, 0xF2EC, 0xB760, 0xC990, 0xF264, 0xB320, 0xECC8,
                0xFB32, 0x9720, 0xE5C8, 0xF972, 0xDB90, 0xF6E4, 0xC458, 0xF116, 0x98B0, 0xE62C, 0xDC58, 0xF716, 0x89B0, 0xE26C, 0x8890, 0xE224, 0xB9B0, 0xCC48, 0xF312, 0xB890,
                0xEE24, 0xC5D8, 0xF176, 0x9BB0, 0xC4C8, 0xF132, 0x9990, 0xE664, 0xDCC8, 0xF732, 0x8B90, 0xE2E4, 0xCDC8, 0xF372, 0xBB90, 0xEEE4, 0xC22C, 0x8C58, 0xE316, 0xCE2C,
                0xBC58, 0xEF16, 0x84D8, 0xE136, 0x8448, 0xE112, 0x9CD8, 0xC624, 0x9C48, 0xE712, 0xDE24, 0xC2EC, 0x8DD8, 0xC264, 0x8CC8, 0xE332, 0xBDD8, 0xCE64, 0xBCC8, 0xEF32,
                0x85C8, 0xE172, 0xC6E4, 0x9DC8, 0xE772, 0xDEE4, 0xC116, 0x862C, 0xC716, 0x9E2C, 0x826C, 0x8224, 0x8E6C, 0xC312, 0x8E24, 0xBE6C, 0xCF12, 0xC176, 0x86EC, 0xC132,
                0x8664, 0x9EEC, 0xC732, 0x9E64, 0xDF32, 0x82E4, 0xC372, 0x8EE4, 0xCF72, 0xBEE4, 0x8316, 0x8F16, 0x8136, 0x8112, 0x8736, 0x8712, 0x9F36, 0x8376, 0x8332, 0x8F76,
                0x8F32, 0xBF76, 0x8172, 0x8772, 0x9F72, 0xD0B0, 0xF42C, 0xA360, 0xE8D8, 0xFA36, 0xA120, 0xE848, 0xFA12, 0xD3B0, 0xF4EC, 0xD190, 0xF464, 0xAF60, 0xEBD8, 0xFAF6,
                0xA720, 0xE9C8, 0xFA72, 0xD790, 0xF5E4, 0xC858, 0xF216, 0xB0B0, 0xEC2C, 0x91B0, 0xE46C, 0x9090, 0xE424, 0xD848, 0xF612, 0xC9D8, 0xF276, 0xB3B0, 0xC8C8, 0xF232,
                0xB190, 0xEC64, 0x97B0, 0xE5EC, 0x9390, 0xE4E4, 0xD9C8, 0xF672, 0xCBC8, 0xF2F2, 0xB790, 0xEDE4, 0xC42C, 0x9858, 0xE616, 0xDC2C, 0x88D8, 0xE236, 0x8848, 0xE212,
                0xB8D8, 0xCC24, 0xB848, 0xEE12, 0xC4EC, 0x99D8, 0xC464, 0x98C8, 0xE632, 0xDC64, 0x8BD8, 0xE2F6, 0x89C8, 0xE272, 0xBBD8, 0xCCE4, 0xB9C8, 0xEE72, 0xC5E4, 0x9BC8,
                0xE6F2, 0xDDE4, 0xC216, 0x8C2C, 0xCE16, 0x846C, 0x8424, 0x9C6C, 0xC612, 0x9C24, 0xC276, 0x8CEC, 0xC232, 0x8C64, 0xBCEC, 0xCE32, 0xBC64, 0x85EC, 0x84E4, 0x9DEC,
                0xC672, 0x9CE4, 0xDE72, 0xC2F2, 0x8DE4, 0xCEF2, 0xBDE4, 0x8616, 0x8236, 0x8212, 0x8E36, 0x8E12, 0x8676, 0x8632, 0x9E76, 0x9E32, 0x82F6, 0x8272, 0x8EF6, 0x8E72,
                0xBEF6, 0xBE72, 0x86F2, 0x9EF2, 0xD058, 0xF416, 0xA1B0, 0xE86C, 0xA090, 0xE824, 0xD1D8, 0xF476, 0xD0C8, 0xF432, 0xA7B0, 0xE9EC, 0xA390, 0xE8E4, 0xD7D8, 0xF5F6,
                0xD3C8, 0xF4F2, 0xAF90, 0xEBE4, 0xC82C, 0xB058, 0xEC16, 0x90D8, 0xE436, 0x9048, 0xE412, 0xD824, 0xC8EC, 0xB1D8, 0xC864, 0xB0C8, 0xEC32, 0x93D8, 0xE4F6, 0x91C8,
                0xE472, 0xD8E4, 0xCBEC, 0xB7D8, 0xC9E4, 0xB3C8, 0xECF2, 0x97C8, 0xE5F2, 0xDBE4, 0xC416, 0x982C, 0x886C, 0x8824, 0xB86C, 0xCC12, 0xC476, 0x98EC, 0xC432, 0x9864,
                0xDC32, 0x89EC, 0x88E4, 0xB9EC, 0xCC72, 0xB8E4, 0xC5F6, 0x9BEC, 0xC4F2, 0x99E4, 0xDCF2, 0x8BE4, 0xCDF2, 0xBBE4, 0x8C16, 0x8436, 0x8412, 0x9C36, 0x8C76, 0x8C32,
                0xBC76, 0x84F6, 0x8472, 0x9CF6, 0x9C72, 0x8DF6, 0x8CF2, 0xBDF6, 0xBCF2, 0x85F2, 0x9DF2, 0xD02C, 0xA0D8, 0xE836, 0xA048, 0xE812, 0xD0EC, 0xD064, 0xA3D8, 0xE8F6,
                0xA1C8, 0xE872, 0xD3EC, 0xD1E4, 0xAFD8, 0xEBF6, 0xA7C8, 0xE9F2, 0xC816, 0x906C, 0x9024, 0xC876, 0xB0EC, 0xC832, 0xB064, 0x91EC, 0x90E4, 0xD872, 0xC9F6, 0xB3EC,
                0xC8F2, 0xB1E4, 0x97EC, 0x93E4, 0xD9F2, 0x8836, 0x8812, 0x9876, 0x9832, 0x88F6, 0x8872, 0xB8F6, 0xB872, 0x99F6, 0x98F2, 0x8BF6, 0x89F2, 0xBBF6, 0xB9F2, 0xD4C0,
                0xF530, 0xFD4C, 0xEA20, 0xFA88, 0xDAE0, 0xF6B8, 0xFDAE, 0xCA60, 0xF298, 0xB4C0, 0xED30, 0xFB4C, 0x9440, 0xE510, 0xF944, 0xDA20, 0xF688, 0xFDA2, 0xCD70, 0xF35C,
                0xBAE0, 0xEEB8, 0xFBAE, 0xC530, 0xF14C, 0x9A60, 0xE698, 0xF9A6, 0xDD30, 0xF74C, 0x8A20, 0xE288, 0xCD10, 0xF344, 0xBA20, 0xEE88, 0xFBA2, 0xC6B8, 0xF1AE, 0x9D70,
                0xE75C, 0xDEB8, 0xF7AE, 0xC298, 0x8D30, 0xE34C, 0xCE98, 0xF3A6, 0xBD30, 0xEF4C, 0x8510, 0xE144, 0xC688, 0xF1A2, 0x9D10, 0xE744, 0xDE88, 0xF7A2, 0xC35C, 0x8EB8,
                0xE3AE, 0xCF5C, 0xBEB8, 0xEFAE, 0xC14C, 0x8698, 0xE1A6, 0xC74C, 0x9E98, 0xE7A6, 0xDF4C, 0x8288, 0xC344, 0x8E88, 0xE3A2, 0xCF44, 0xBE88, 0xEFA2, 0xC1AE, 0x875C,
                0xC7AE, 0x9F5C, 0xDFAE, 0x834C, 0xC3A6, 0x8F4C, 0xCFA6, 0xBF4C, 0x8144, 0xC1A2, 0x8744, 0xC7A2, 0x9F44, 0xDFA2, 0xE970, 0xFA5C, 0xD6E0, 0xF5B8, 0xFD6E, 0xD260,
                0xF498, 0xFD26, 0xACC0, 0xEB30, 0xFACC, 0xA440, 0xE910, 0xFA44, 0xD620, 0xF588, 0xFD62, 0x92E0, 0xE4B8, 0xF92E, 0xD970, 0xF65C, 0xCB70, 0xF2DC, 0xB6E0, 0xC930,
                0xF24C, 0xB260, 0xEC98, 0xFB26, 0x9660, 0xE598, 0xF966, 0x9220, 0xE488, 0xF922, 0xD910, 0xF644, 0xCB10, 0xF2C4, 0xB620, 0xED88, 0xFB62, 0x8970, 0xE25C, 0xCCB8,
                0xF32E, 0xB970, 0xEE5C, 0xC5B8, 0xF16E, 0x9B70, 0xC498, 0xF126, 0x9930, 0xE64C, 0xDC98, 0xF726, 0x8B30, 0xE2CC, 0x8910, 0xE244, 0xBB30, 0xCC88, 0xF322, 0xB910,
                0xEE44, 0xC588, 0xF162, 0x9B10, 0xE6C4, 0xDD88, 0xF762, 0x84B8, 0xE12E, 0xC65C, 0x9CB8, 0xE72E, 0xDE5C, 0xC2DC, 0x8DB8, 0xC24C, 0x8C98, 0xE326, 0xBDB8, 0xCE4C,
                0xBC98, 0xEF26, 0x8598, 0xE166, 0x8488, 0xE122, 0x9D98, 0xC644, 0x9C88, 0xE722, 0xDE44, 0xC2C4, 0x8D88, 0xE362, 0xCEC4, 0xBD88, 0xEF62, 0x825C, 0xC32E, 0x8E5C, 0xCF2E
            ];
            var WEIGHT = [
                [
                    [20, 16, 38]
                ],
                [
                    [1, 9, 31],
                    [9, 31, 26],
                    [31, 26, 2],
                    [26, 2, 12]
                ],
                [
                    [2, 12, 17],
                    [12, 17, 23],
                    [17, 23, 37],
                    [23, 37, 18]
                ],
                [
                    [37, 18, 22],
                    [18, 22, 6],
                    [22, 6, 27],
                    [6, 27, 44]
                ],
                [
                    [27, 44, 15],
                    [44, 15, 43],
                    [15, 43, 39],
                    [43, 39, 11]
                ],
                [
                    [39, 11, 13],
                    [11, 13, 5],
                    [13, 5, 41],
                    [5, 41, 33]
                ],
                [
                    [41, 33, 36],
                    [33, 36, 8],
                    [36, 8, 4],
                    [8, 4, 32]
                ],
                [
                    [4, 32, 3],
                    [32, 3, 19],
                    [3, 19, 40],
                    [19, 40, 25]
                ],
                [
                    [40, 25, 29],
                    [25, 29, 10],
                    [29, 10, 24],
                    [10, 24, 30]
                ],
                [
                    [20, 16, 38],
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ]
            ];
            var PARITY = [
                [1, 0, 0, 1],
                [0, 1, 0, 1],
                [1, 1, 0, 0],
                [0, 0, 1, 1],
                [1, 0, 1, 0],
                [0, 1, 1, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ];
            var ALPHA_TABLE = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '.', ' ', '$', '/', '+', '%', '\u2000', '\u2001', wijmo.barcode.Constants.FNC1, wijmo.barcode.Constants.FNC2, wijmo.barcode.Constants.FNC3, '\u2005'];
            var ASCII_TABLE = ['\u2000 ', '\u2000A', '\u2000B', '\u2000C', '\u2000D', '\u2000E', '\u2000F', '\u2000G', '\u2000H', '\u2000I', '\u2000J', '\u2000K', '\u2000L', '\u2000M', '\u2000N', '\u2000O', '\u2000P', '\u2000Q', '\u2000R', '\u2000S', '\u2000T', '\u2000U', '\u2000V', '\u2000W', '\u2000X', '\u2000Y', '\u2000Z', '\u20001', '\u20002', '\u20003', '\u20004', '\u20005', ' ', '\u20006', '\u20007', '\u20008', '$', '%', '\u20009', '\u20000', '\u2000-', '\u2000.', '\u2000$', '+', '\u2000/', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '\u2000+', '\u20011', '\u20012', '\u20013', '\u20014', '\u20015', '\u20016', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '\u20017', '\u20018', '\u20019', '\u20010', '\u2001-', '\u2001.', '\u2001A', '\u2001B', '\u2001C', '\u2001D', '\u2001E', '\u2001F', '\u2001G', '\u2001H', '\u2001I', '\u2001J', '\u2001K', '\u2001L', '\u2001M', '\u2001N', '\u2001O', '\u2001P', '\u2001Q', '\u2001R', '\u2001S', '\u2001T', '\u2001U', '\u2001V', '\u2001W', '\u2001X', '\u2001Y', '\u2001Z', '\u2001$', '\u2001/', '\u2001+', '\u2001%', '\u2001 '];
            function isNumericOnly(text) {
                var reg = /^\d{5,81}$/;
                return reg.test(text);
            }
            specialized.isNumericOnly = isNumericOnly;
            function getCharValue_Code49(char) {
                var v = ALPHA_TABLE.indexOf(char);
                if (v > -1) {
                    return [v];
                }
                var index = char.charCodeAt(0);
                var str = ASCII_TABLE[index];
                return wijmo.barcode.Utils.str2Array(str).map(function (c) { return ALPHA_TABLE.indexOf(c); });
            }
            specialized.getCharValue_Code49 = getCharValue_Code49;
            function getWeight(row, col) {
                var v = WEIGHT[row][col];
                return { x: v[0], y: v[1], z: v[2] };
            }
            specialized.getWeight = getWeight;
            function getParityPattern(value, row, col, rowCount) {
                var isLastRow = row === (rowCount - 1);
                var isOdd, hex;
                if (isLastRow) {
                    isOdd = false;
                }
                else {
                    isOdd = PARITY[row][col];
                }
                if (isOdd) {
                    hex = ODD_TABLE[value];
                }
                else {
                    hex = EVEN_TABLE[value];
                }
                return hex.toString(2);
            }
            specialized.getParityPattern = getParityPattern;
            function getGroupInfo(groupNo, groupCount) {
                var i = 2, value = 1;
                while (i < groupCount) {
                    value += i;
                    i++;
                }
                return value + groupNo;
            }
            specialized.getGroupInfo = getGroupInfo;
            function getDataLength(text) {
                return wijmo.barcode.Utils.str2Array(text).reduce(function (v, c) {
                    if (ALPHA_TABLE.indexOf(c) > -1) {
                        v++;
                    }
                    else {
                        v += 2;
                    }
                    return v;
                }, 0);
            }
            function getTextGroup(text) {
                var i = 0, j = 1, len = text.length;
                var result = [];
                while (j < len) {
                    var str = text.substring(i, j);
                    if (getDataLength(str) > 48) {
                        result.push(text.substring(i, j - 1));
                        i = j - 1;
                    }
                    j++;
                }
                result.push(text.substring(i, j));
                return result;
            }
            specialized.getTextGroup = getTextGroup;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var Code49Encoder = /** @class */ (function (_super) {
                __extends(Code49Encoder, _super);
                function Code49Encoder(option) {
                    var _this = this;
                    option.merge(Code49Encoder.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var text = _this.encodeConfig.text;
                    _this.text = text;
                    _this.label = text.replace(/[\xc9-\xcf]/g, '');
                    _this.mode = specialized.isNumericOnly(text) ? 2 : 0;
                    _this.getModes();
                    return _this;
                }
                Code49Encoder.prototype.validate = function () {
                    var _a = this, text = _a.encodeConfig.text, grouping = _a.config.grouping;
                    var reg = /^[\x00-\x80\xcf\xca\xc9]+$/; //eslint-disable-line
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                    if (!grouping && text.length > 81) {
                        throw new wijmo.barcode.TextTooLongException();
                    }
                };
                Code49Encoder.prototype.getModes = function () {
                    var _a = this, text = _a.text, _b = _a.config, grouping = _b.grouping, groupNo = _b.groupNo;
                    if (grouping) {
                        var groups = specialized.getTextGroup(text);
                        if (groups.length > 1) {
                            if (groups.length > 9) {
                                throw new wijmo.barcode.GroupSizeOverflowException(groups.length);
                            }
                            if (groupNo > groups.length - 1) {
                                throw new wijmo.barcode.InvalidOptionsException({ groupNo: groupNo }, "Max group number is " + (groups.length - 1));
                            }
                            this.groupCount = groups.length;
                            this.mode = 3;
                            text = groups[groupNo];
                        }
                    }
                    var modes = [];
                    var i = 0, j = 0, len = text.length;
                    while (i < len) {
                        while (j < len) {
                            if (text[j] < '0' || text[j] > '9') {
                                break;
                            }
                            j++;
                        }
                        if (j - i >= 5) {
                            modes.push({ mode: 'number', text: text.substring(i, j) });
                            i = j;
                        }
                        else {
                            var lastGroup = modes[modes.length - 1];
                            if (lastGroup && lastGroup.mode === 'alpha') {
                                lastGroup.text += text.substring(i, j + 1);
                            }
                            else {
                                modes.push({ mode: 'alpha', text: text.substring(i, j + 1) });
                            }
                            i = ++j;
                        }
                    }
                    this.modes = modes;
                };
                Code49Encoder.prototype.encodeNumeric = function (text) {
                    var num1, num2;
                    switch (text.length) {
                        case 3:
                            num1 = +text;
                            return [~~(num1 / 48), num1 % 48];
                        case 4:
                            num1 = +text + 100000;
                            return [~~(num1 / (48 * 48)), ~~((num1 % (48 * 48)) / 48), num1 % 48];
                        case 5:
                            num1 = +text;
                            return [~~(num1 / (48 * 48)), ~~((num1 % (48 * 48)) / 48), num1 % 48];
                        case 6:
                            num1 = text.substr(0, 5);
                            return this.encodeNumeric(num1).concat([+text[5]]);
                        case 7:
                            num1 = text.substr(0, 4);
                            num2 = text.substr(4, 3);
                            return this.encodeNumeric(num1).concat(this.encodeNumeric(num2));
                        case 8:
                            num1 = text.substr(0, 5);
                            num2 = text.substr(5, 3);
                            return this.encodeNumeric(num1).concat(this.encodeNumeric(num2));
                        case 9:
                            num1 = text.substr(0, 5);
                            num2 = text.substr(5, 4);
                            return this.encodeNumeric(num1).concat(this.encodeNumeric(num2));
                        default:
                            num1 = text.substr(0, 5);
                            num2 = text.substr(5, text.length);
                            return this.encodeNumeric(num1).concat(this.encodeNumeric(num2));
                    }
                };
                Code49Encoder.prototype.encodeAlpha = function (text) {
                    return wijmo.barcode.Utils.str2Array(text)
                        .reduce(function (result, ch) {
                        result = result.concat(specialized.getCharValue_Code49(ch));
                        return result;
                    }, []);
                };
                Code49Encoder.prototype.calculateData = function () {
                    var _this = this;
                    var _a = this, modes = _a.modes, mode = _a.mode, groupCount = _a.groupCount, groupNo = _a.config.groupNo;
                    var vals = modes.reduce(function (arr, item, index) {
                        if (item.mode === 'number') {
                            if (index === 0 && mode !== 2) {
                                arr.push(Code49Encoder.CODE_NS);
                            }
                            arr = arr.concat(_this.encodeNumeric(item.text));
                        }
                        else {
                            arr = arr.concat(_this.encodeAlpha(item.text));
                        }
                        arr.push(Code49Encoder.CODE_NS);
                        return arr;
                    }, []);
                    vals.pop();
                    if (mode === 3) {
                        vals.unshift(specialized.getGroupInfo(groupNo, groupCount));
                    }
                    var wl = vals.length % 7;
                    while (vals.length % 7 !== 0) {
                        vals.push(Code49Encoder.CODE_NS);
                    }
                    var list = [];
                    wijmo.barcode.Utils.sliceArray(vals, 7, function (next) {
                        var sum = next.reduce(function (r, v) { return r += v; }, 0);
                        next.push(sum % 49);
                        list = list.concat(next);
                    });
                    var totalRowCount = vals.length / 7;
                    if (totalRowCount % 8 >= 6 || (wl > 2 || wl == 0 || (totalRowCount % 8) === 1)) {
                        list = list.concat(wijmo.barcode.Utils.fillArray(new Array(8), Code49Encoder.CODE_NS));
                        totalRowCount++;
                    }
                    if (totalRowCount > 8) {
                        throw new wijmo.barcode.TextTooLongException();
                    }
                    var cr7 = 7 * (totalRowCount - 2) + mode;
                    list[list.length - 2] = cr7;
                    var factor00 = specialized.getWeight(0, 0);
                    var wr1 = cr7 * factor00.z, wr2 = cr7 * factor00.y, wr3 = cr7 * factor00.x;
                    var dcnt = (totalRowCount - 1) * 8 / 2;
                    if (totalRowCount > 6) {
                        for (var j = 0, p = 0; j < dcnt; j++, p += 2) {
                            var factor = specialized.getWeight(~~(j / 4) + 1, j % 4);
                            wr1 += factor.z * (list[p] * 49 + list[p + 1]);
                        }
                        wr1 %= 2401;
                        list[list.length - 8] = ~~(wr1 / 49);
                        list[list.length - 7] = ~~(wr1 % 49);
                    }
                    dcnt++;
                    for (var j = 0, p = 0; j < dcnt; j++, p += 2) {
                        var factor = specialized.getWeight(~~(j / 4) + 1, j % 4);
                        wr2 += factor.y * (list[p] * 49 + list[p + 1]);
                    }
                    wr2 %= 2401;
                    list[list.length - 6] = ~~(wr2 / 49);
                    list[list.length - 5] = ~~(wr2 % 49);
                    dcnt++;
                    for (var j = 0, p = 0; j < dcnt; j++, p += 2) {
                        var factor = specialized.getWeight(~~(j / 4) + 1, j % 4);
                        wr3 += factor.x * (list[p] * 49 + list[p + 1]);
                    }
                    wr3 %= 2401;
                    list[list.length - 4] = ~~(wr3 / 49);
                    list[list.length - 3] = ~~(wr3 % 49);
                    var lastRow = list.slice(totalRowCount * 8 - 8, totalRowCount * 8 - 1);
                    list[list.length - 1] = lastRow.reduce(function (r, v) { return r += v; }, 0) % 49;
                    var matrix = [];
                    for (var i = 0, len = list.length, row = 0; i < len; i += 8, row++) {
                        var subArr = list.slice(i, i + 8);
                        var rowArr = [];
                        matrix.push(rowArr);
                        for (var j = 0, col = 0; j < 8; j += 2, col++) {
                            var num = subArr[j] * 49 + subArr[j + 1];
                            rowArr.push(specialized.getParityPattern(num, row, col, totalRowCount));
                        }
                        rowArr.unshift(Code49Encoder.START_PATTERN);
                        rowArr.push(Code49Encoder.STOP_PATTERN);
                    }
                    return matrix;
                };
                //overwrite
                Code49Encoder.prototype.convertToShape = function (matrix, forMeasure) {
                    var _a = this, label = _a.label, _b = _a.encodeConfig, fontSizeInUnit = _b.fontSizeInUnit, isLabelBottom = _b.isLabelBottom, height = _b.height, quietZone = _b.quietZone, showLabel = _b.showLabel, textAlign = _a.style.textAlign;
                    var labelHeight = 0;
                    if (label && showLabel) {
                        labelHeight = fontSizeInUnit;
                    }
                    var sepHeight = 1;
                    var rowHeight = (height - sepHeight) / matrix.length - sepHeight;
                    var symbolWidth = 70 + quietZone.right + quietZone.left;
                    var symbolHeight = height + quietZone.top + quietZone.bottom - sepHeight * 2;
                    var mainArea = new wijmo.barcode.VerticalLayoutArea();
                    var symbolArea = new wijmo.barcode.MatrixSymbolArea(symbolWidth, symbolHeight);
                    symbolArea.setStyle({
                        padding: {
                            top: quietZone.top,
                            right: quietZone.right,
                            bottom: quietZone.bottom,
                            left: quietZone.left,
                        },
                        border: {
                            top: sepHeight, bottom: sepHeight,
                        }
                    });
                    var symbolSize = symbolArea.getSize();
                    var labelArea = new wijmo.barcode.LabelArea(symbolSize.width, labelHeight, textAlign);
                    if (isLabelBottom) {
                        mainArea.append(symbolArea);
                        mainArea.append(labelArea);
                    }
                    else {
                        mainArea.append(labelArea);
                        mainArea.append(symbolArea);
                    }
                    if (!forMeasure) {
                        matrix.forEach(function (row, index) {
                            row.forEach(function (pattern) {
                                wijmo.barcode.Utils.combineTruthy(pattern).forEach(function (num) {
                                    if (num !== 0) {
                                        symbolArea.append(num, rowHeight);
                                    }
                                    else {
                                        symbolArea.space();
                                    }
                                });
                            });
                            if (index !== 0 || index !== matrix.length - 1) {
                                symbolArea.append(70, sepHeight);
                            }
                        });
                        labelArea.append({ text: label });
                        this.shapes = mainArea.toShapes();
                    }
                    this.size = mainArea.getSize();
                };
                //overwrite
                Code49Encoder.prototype.adjustDesiredSize = function () {
                    var width = this.size.width;
                    var _a = this.encodeConfig, desiredSize = _a.desiredSize, containerWidth = _a.containerWidth;
                    var unitValue = containerWidth / width;
                    if (desiredSize.forceRounding) {
                        unitValue = ~~unitValue;
                        unitValue = unitValue < 1 ? 1 : unitValue;
                    }
                    this.applyDesiredSize(unitValue);
                };
                Code49Encoder.DefaultConfig = {
                    showLabel: true,
                    grouping: false,
                    groupNo: 0,
                    labelPosition: 'bottom',
                    height: 60,
                    quietZone: {
                        right: 1,
                        left: 10
                    }
                };
                Code49Encoder.CODE_NS = 48;
                Code49Encoder.START_PATTERN = '10';
                Code49Encoder.STOP_PATTERN = '1111';
                return Code49Encoder;
            }(wijmo.barcode.TwoDimensionalBarcode));
            specialized.Code49Encoder = Code49Encoder;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            wijmo.barcode.Barcode.registerEncoder('Code49', specialized.Code49Encoder);
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var BitwiseIterator = /** @class */ (function () {
                function BitwiseIterator(data, offset) {
                    this._data = data;
                    this.offset = offset || 0;
                }
                Object.defineProperty(BitwiseIterator.prototype, "bitLength", {
                    get: function () {
                        return this._data.length * 8;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BitwiseIterator.prototype, "currentBit", {
                    get: function () {
                        return this.getBit(this.offset);
                    },
                    enumerable: true,
                    configurable: true
                });
                BitwiseIterator.prototype.fetchBit = function () {
                    return this.getBit(this.offset++);
                };
                BitwiseIterator.prototype.getBit = function (offset) {
                    if (offset >= this.bitLength) {
                        return false;
                    }
                    return (this._data[~~(offset / 8)] & (0x80 >> (offset % 8))) != 0;
                };
                BitwiseIterator.prototype.setBit = function (offset, bit) {
                    var index = ~~(offset / 8);
                    var mask = (0x80 >> (offset % 8)) % 256;
                    this._data[index] &= (this._data[index] & ~mask) % 256;
                    if (bit) {
                        this._data[index] |= mask;
                    }
                };
                BitwiseIterator.prototype.putBit = function (bit) {
                    this.setBit(this.offset, bit);
                    this.offset++;
                };
                BitwiseIterator.prototype.putBitsMSF = function (data, bits, offset) {
                    var hasOffset = !!offset;
                    if (!hasOffset) {
                        offset = this.offset;
                    }
                    var mask = 0x80000000;
                    for (var i = 0; i < bits; ++i) {
                        this.setBit(offset + i, (data & mask) != 0);
                        mask /= 2;
                    }
                    if (!hasOffset) {
                        this.offset += bits;
                    }
                };
                BitwiseIterator.prototype.putBitsLSF = function (data, bits, offset) {
                    var hasOffset = !!offset;
                    if (!hasOffset) {
                        offset = this.offset;
                    }
                    var mask = 1;
                    for (var i = 0; i < bits; ++i) {
                        this.setBit(offset + i, (data & mask) != 0);
                        mask <<= 1;
                    }
                    if (!hasOffset) {
                        this.offset += bits;
                    }
                };
                return BitwiseIterator;
            }());
            specialized.BitwiseIterator = BitwiseIterator;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var EncodationScheme = {
                Base11: 0,
                Base27: 1,
                Base37: 2,
                Base41: 3,
                ASCII: 4,
                Byte: 5
            };
            function getEncodationScheme(value) {
                var ASCIIMax = 0x7f;
                if (value >= 48 && value <= 57 || value == 32)
                    return EncodationScheme.Base11;
                if (value >= 65 && value <= 90)
                    return EncodationScheme.Base27;
                if (value >= 44 && value <= 47)
                    return EncodationScheme.Base41;
                if (value <= ASCIIMax)
                    return EncodationScheme.ASCII;
                return EncodationScheme.Byte;
            }
            function chooseEncodationScheme(data) {
                var scheme = EncodationScheme.Base11;
                for (var i = 0, len = data.length; i < len; i++) {
                    scheme = updateEncodationScheme(scheme, getEncodationScheme(data[i]));
                    if (scheme === EncodationScheme.Byte) {
                        break;
                    }
                }
                return scheme;
            }
            specialized.chooseEncodationScheme = chooseEncodationScheme;
            function updateEncodationScheme(oldScheme, newScheme) {
                if (oldScheme == newScheme) {
                    return oldScheme;
                }
                if (oldScheme == EncodationScheme.Byte || newScheme == EncodationScheme.Byte) {
                    return EncodationScheme.Byte;
                }
                var scheme = oldScheme;
                switch (oldScheme) {
                    case EncodationScheme.Base11:
                        if (newScheme == EncodationScheme.Base27) {
                            scheme = EncodationScheme.Base37;
                        }
                        else if (newScheme > scheme) {
                            scheme = newScheme;
                        }
                        break;
                    case EncodationScheme.Base27:
                        if (newScheme == EncodationScheme.Base11) {
                            scheme = EncodationScheme.Base37;
                        }
                        else if (newScheme > scheme) {
                            scheme = newScheme;
                        }
                        break;
                    case EncodationScheme.Base37:
                    case EncodationScheme.Base41:
                        if (newScheme > scheme) {
                            scheme = newScheme;
                        }
                        break;
                }
                return scheme;
            }
            function mod256_140(num) {
                return num % 256;
            }
            function getCodeWord(scheme, value) {
                if (scheme == EncodationScheme.Byte) {
                    return value;
                }
                if (scheme == EncodationScheme.ASCII) {
                    return mod256_140(value & 0x7f);
                }
                var result = 0;
                if (value == 32) {
                    return result;
                }
                if (value >= 48 && value <= 57) {
                    result = mod256_140(value - 47);
                }
                if (scheme == EncodationScheme.Base11) {
                    return result;
                }
                result += 26;
                if (value >= 65 && value <= 90) {
                    result = mod256_140(value - 64);
                }
                if (scheme != EncodationScheme.Base41) {
                    return result;
                }
                switch (value) {
                    case 44:
                        return 38;
                    case 45:
                        return 39;
                    case 46:
                        return 37;
                    case 47:
                        return 40;
                }
                return result;
            }
            specialized.getCodeWord = getCodeWord;
            function setBit(value, bitLS, bitValue) {
                var mask = 1 << bitLS;
                value &= ~mask;
                if (bitValue) {
                    value |= mask;
                }
                return value;
            }
            specialized.setBit = setBit;
            function RegisterMask(registerNumber, bitLSF) {
                this.registerNumber = registerNumber;
                this.mask = 1 << bitLSF;
            }
            specialized.Constants_140 = {
                BaseValues: [11, 27, 37, 41, 128, 256],
                GroupLengths: [6, 5, 4, 4, 1, 1],
                HeaderBits: [126, 57358, 465934, 523278, 517006],
                BitLengths: [
                    [21, 4, 7, 11, 14, 18, 21],
                    [24, 5, 10, 15, 20, 24],
                    [21, 6, 11, 16, 21],
                    [22, 6, 11, 17, 22],
                    [7, 7],
                    [8, 8]
                ],
                SymbolCapacities: (function () {
                    var capacities = [];
                    for (var i = 7; i < 50; i += 2) {
                        capacities.push(i * i);
                    }
                    return capacities;
                })(),
                getFormatID: function (scheme) {
                    if (scheme === EncodationScheme.Base37) {
                        ++scheme;
                    }
                    else if (scheme === EncodationScheme.Base41) {
                        --scheme;
                    }
                    return scheme;
                },
                ECCInfos: [
                    { inputBits: 1, registerBits: [0], outputBits: 1, outputMasks: null },
                    {
                        inputBits: 3,
                        registerBits: [3, 3, 3],
                        outputBits: 4,
                        outputMasks: [
                            [new RegisterMask(0, 3), new RegisterMask(1, 0), new RegisterMask(2, 2), new RegisterMask(2, 1), new RegisterMask(2, 0)],
                            [new RegisterMask(0, 1), new RegisterMask(0, 0), new RegisterMask(1, 3), new RegisterMask(1, 2), new RegisterMask(1, 0)],
                            [new RegisterMask(0, 2), new RegisterMask(0, 1), new RegisterMask(0, 0), new RegisterMask(1, 2), new RegisterMask(2, 3), new RegisterMask(2, 2)],
                            [new RegisterMask(0, 3), new RegisterMask(0, 2), new RegisterMask(1, 3), new RegisterMask(1, 2), new RegisterMask(1, 1), new RegisterMask(2, 3), new RegisterMask(2, 2), new RegisterMask(2, 0)]
                        ]
                    },
                    {
                        inputBits: 2,
                        registerBits: [10, 11],
                        outputBits: 3,
                        outputMasks: [
                            [new RegisterMask(0, 10), new RegisterMask(0, 9), new RegisterMask(0, 7), new RegisterMask(0, 5), new RegisterMask(0, 4), new RegisterMask(0, 3), new RegisterMask(0, 0), new RegisterMask(1, 8), new RegisterMask(1, 4), new RegisterMask(1, 3), new RegisterMask(1, 0)],
                            [new RegisterMask(0, 9), new RegisterMask(0, 6), new RegisterMask(0, 5), new RegisterMask(0, 2), new RegisterMask(0, 1), new RegisterMask(0, 0), new RegisterMask(1, 11), new RegisterMask(1, 8), new RegisterMask(1, 5), new RegisterMask(1, 3), new RegisterMask(1, 2)],
                            [new RegisterMask(0, 10), new RegisterMask(0, 5), new RegisterMask(0, 4), new RegisterMask(0, 3), new RegisterMask(1, 11), new RegisterMask(1, 10), new RegisterMask(1, 9), new RegisterMask(1, 7), new RegisterMask(1, 4), new RegisterMask(1, 2), new RegisterMask(1, 0)]
                        ]
                    },
                    {
                        inputBits: 1,
                        registerBits: [15],
                        outputBits: 2,
                        outputMasks: [
                            [new RegisterMask(0, 15), new RegisterMask(0, 13), new RegisterMask(0, 10), new RegisterMask(0, 9), new RegisterMask(0, 8), new RegisterMask(0, 7), new RegisterMask(0, 6), new RegisterMask(0, 5), new RegisterMask(0, 0)],
                            [new RegisterMask(0, 15), new RegisterMask(0, 14), new RegisterMask(0, 12), new RegisterMask(0, 11), new RegisterMask(0, 9), new RegisterMask(0, 4), new RegisterMask(0, 2), new RegisterMask(0, 1), new RegisterMask(0, 0)]
                        ]
                    },
                    {
                        inputBits: 1,
                        registerBits: [13],
                        outputBits: 4,
                        outputMasks: [
                            [new RegisterMask(0, 13), new RegisterMask(0, 9), new RegisterMask(0, 6), new RegisterMask(0, 3), new RegisterMask(0, 1), new RegisterMask(0, 0)],
                            [new RegisterMask(0, 13), new RegisterMask(0, 10), new RegisterMask(0, 9), new RegisterMask(0, 6), new RegisterMask(0, 5), new RegisterMask(0, 4), new RegisterMask(0, 3), new RegisterMask(0, 2), new RegisterMask(0, 0)],
                            [new RegisterMask(0, 13), new RegisterMask(0, 12), new RegisterMask(0, 11), new RegisterMask(0, 9), new RegisterMask(0, 8), new RegisterMask(0, 6), new RegisterMask(0, 4), new RegisterMask(0, 2), new RegisterMask(0, 1), new RegisterMask(0, 0)],
                            [new RegisterMask(0, 13), new RegisterMask(0, 12), new RegisterMask(0, 11), new RegisterMask(0, 9), new RegisterMask(0, 8), new RegisterMask(0, 6), new RegisterMask(0, 4), new RegisterMask(0, 3), new RegisterMask(0, 2), new RegisterMask(0, 1), new RegisterMask(0, 0)]
                        ]
                    }
                ],
                RandomizeBytes: [
                    0x05, 0xff, 0xc7, 0x31, 0x88, 0xa8, 0x83, 0x9c, 0x64, 0x87, 0x9f, 0x64, 0xb3, 0xe0, 0x4d, 0x9c, 0x80, 0x29, 0x3a, 0x90,
                    0xb3, 0x8b, 0x9e, 0x90, 0x45, 0xbf, 0xf5, 0x68, 0x4b, 0x08, 0xcf, 0x44, 0xb8, 0xd4, 0x4c, 0x5b, 0xa0, 0xab, 0x72, 0x52,
                    0x1c, 0xe4, 0xd2, 0x74, 0xa4, 0xda, 0x8a, 0x08, 0xfa, 0xa7, 0xc7, 0xdd, 0x00, 0x30, 0xa9, 0xe6, 0x64, 0xab, 0xd5, 0x8b,
                    0xed, 0x9c, 0x79, 0xf8, 0x08, 0xd1, 0x8b, 0xc6, 0x22, 0x64, 0x0b, 0x33, 0x43, 0xd0, 0x80, 0xd4, 0x44, 0x95, 0x2e, 0x6f,
                    0x5e, 0x13, 0x8d, 0x47, 0x62, 0x06, 0xeb, 0x80, 0x82, 0xc9, 0x41, 0xd5, 0x73, 0x8a, 0x30, 0x23, 0x24, 0xe3, 0x7f, 0xb2,
                    0xa8, 0x0b, 0xed, 0x38, 0x42, 0x4c, 0xd7, 0xb0, 0xce, 0x98, 0xbd, 0xe1, 0xd5, 0xe4, 0xc3, 0x1d, 0x15, 0x4a, 0xcf, 0xd1,
                    0x1f, 0x39, 0x26, 0x18, 0x93, 0xfc, 0x19, 0xb2, 0x2d, 0xab, 0xf2, 0x6e, 0xa1, 0x9f, 0xaf, 0xd0, 0x8a, 0x2b, 0xa0, 0x56,
                    0xb0, 0x41, 0x6d, 0x43, 0xa4, 0x63, 0xf3, 0xaa, 0x7d, 0xaf, 0x35, 0x57, 0xc2, 0x94, 0x4a, 0x65, 0x0b, 0x41, 0xde, 0xb8,
                    0xe2, 0x30, 0x12, 0x27, 0x9b, 0x66, 0x2b, 0x34, 0x5b, 0xb8, 0x99, 0xe8, 0x28, 0x71, 0xd0, 0x95, 0x6b, 0x07, 0x4d, 0x3c,
                    0x7a, 0xb3, 0xe5, 0x29, 0xb3, 0xba, 0x8c, 0xcc, 0x2d, 0xe0, 0xc9, 0xc0, 0x22, 0xec, 0x4c, 0xde, 0xf8, 0x58, 0x07, 0xfc,
                    0x19, 0xf2, 0x64, 0xe2, 0xc3, 0xe2, 0xd8, 0xb9, 0xfd, 0x67, 0xa0, 0xbc, 0xf5, 0x2e, 0xc9, 0x49, 0x75, 0x62, 0x82, 0x27,
                    0x10, 0xf4, 0x19, 0x6f, 0x49, 0xf7, 0xb3, 0x84, 0x14, 0xea, 0xeb, 0xe1, 0x2a, 0x31, 0xab, 0x47, 0x7d, 0x08, 0x29, 0xac,
                    0xbb, 0x72, 0xfa, 0xfa, 0x62, 0xb8, 0xc8, 0xd3, 0x86, 0x89, 0x95, 0xfd, 0xdf, 0xcc, 0x9c, 0xad, 0xf1, 0xd4, 0x6c, 0x64,
                    0x23, 0x24, 0x2a, 0x56, 0x1f, 0x36, 0xeb, 0xb7, 0xd6, 0xff, 0xda, 0x57, 0xf4, 0x50, 0x79, 0x08, 0x0
                ],
                ModuleMapping: [
                    [2, 45, 10, 38, 24, 21, 1,
                        12, 40, 26, 5, 33, 19, 47,
                        22, 31, 29, 15, 43, 8, 36,
                        34, 20, 48, 13, 41, 27, 6,
                        44, 9, 37, 23, 17, 30, 16,
                        39, 25, 4, 32, 18, 46, 11,
                        0, 28, 14, 42, 7, 35, 3
                    ],
                    // 11
                    [2, 19, 55, 10, 46, 28, 64, 73, 1,
                        62, 17, 53, 35, 71, 8, 80, 44, 26,
                        49, 31, 67, 4, 76, 40, 22, 58, 13,
                        69, 6, 78, 42, 24, 60, 15, 51, 33,
                        74, 38, 20, 56, 11, 47, 29, 65, 37,
                        25, 61, 16, 52, 34, 70, 7, 79, 43,
                        12, 48, 30, 66, 63, 75, 39, 21, 57,
                        32, 68, 5, 77, 41, 23, 59, 14, 50,
                        0, 72, 36, 18, 54, 9, 45, 27, 3
                    ],
                    // 13
                    [2, 26, 114, 70, 15, 103, 59, 37, 81, 4, 1,
                        117, 73, 18, 106, 62, 40, 84, 7, 95, 51, 29,
                        12, 100, 56, 34, 78, 92, 89, 45, 23, 111, 67,
                        65, 43, 87, 10, 98, 54, 32, 120, 76, 21, 109,
                        82, 5, 93, 49, 27, 115, 71, 16, 104, 60, 38,
                        96, 52, 30, 118, 74, 19, 107, 63, 41, 85, 8,
                        24, 112, 68, 13, 101, 57, 35, 79, 48, 90, 46,
                        75, 20, 108, 64, 42, 86, 9, 97, 53, 31, 119,
                        102, 58, 36, 80, 77, 91, 47, 25, 113, 69, 14,
                        39, 83, 6, 94, 50, 28, 116, 72, 17, 105, 61,
                        0, 88, 44, 22, 110, 66, 11, 99, 55, 33, 3
                    ],
                    // 15
                    [2, 159, 29, 133, 81, 16, 120, 68, 42, 146, 94, 91, 1,
                        37, 141, 89, 24, 128, 76, 50, 154, 102, 11, 115, 63, 167,
                        83, 18, 122, 70, 44, 148, 96, 5, 109, 57, 161, 31, 135,
                        125, 73, 47, 151, 99, 8, 112, 60, 164, 34, 138, 86, 21,
                        40, 144, 92, 107, 105, 53, 157, 27, 131, 79, 14, 118, 66,
                        103, 12, 116, 64, 168, 38, 142, 90, 25, 129, 77, 51, 155,
                        110, 58, 162, 32, 136, 84, 19, 123, 71, 45, 149, 97, 6,
                        165, 35, 139, 87, 22, 126, 74, 48, 152, 100, 9, 113, 61,
                        132, 80, 15, 119, 67, 41, 145, 93, 55, 106, 54, 158, 28,
                        23, 127, 75, 49, 153, 101, 10, 114, 62, 166, 36, 140, 88,
                        69, 43, 147, 95, 4, 108, 56, 160, 30, 134, 82, 17, 121,
                        150, 98, 7, 111, 59, 163, 33, 137, 85, 20, 124, 72, 46,
                        0, 104, 52, 156, 26, 130, 78, 13, 117, 65, 39, 143, 3
                    ],
                    // 17
                    [2, 187, 37, 157, 97, 217, 22, 142, 82, 202, 52, 172, 112, 7, 1,
                        41, 161, 101, 221, 26, 146, 86, 206, 56, 176, 116, 11, 131, 71, 191,
                        93, 213, 18, 138, 78, 198, 48, 168, 108, 105, 123, 63, 183, 33, 153,
                        28, 148, 88, 208, 58, 178, 118, 13, 133, 73, 193, 43, 163, 103, 223,
                        80, 200, 50, 170, 110, 5, 125, 65, 185, 35, 155, 95, 215, 20, 140,
                        54, 174, 114, 9, 129, 69, 189, 39, 159, 99, 219, 24, 144, 84, 204,
                        106, 127, 121, 61, 181, 31, 151, 91, 211, 16, 136, 76, 196, 46, 166,
                        134, 74, 194, 44, 164, 104, 224, 29, 149, 89, 209, 59, 179, 119, 14,
                        186, 36, 156, 96, 216, 21, 141, 81, 201, 51, 171, 111, 6, 126, 66,
                        160, 100, 220, 25, 145, 85, 205, 55, 175, 115, 10, 130, 70, 190, 40,
                        212, 17, 137, 77, 197, 47, 167, 107, 67, 122, 62, 182, 32, 152, 92,
                        147, 87, 207, 57, 177, 117, 12, 132, 72, 192, 42, 162, 102, 222, 27,
                        199, 49, 169, 109, 4, 124, 64, 184, 34, 154, 94, 214, 19, 139, 79,
                        173, 113, 8, 128, 68, 188, 38, 158, 98, 218, 23, 143, 83, 203, 53,
                        0, 120, 60, 180, 30, 150, 90, 210, 15, 135, 75, 195, 45, 165, 3
                    ],
                    // 19
                    [2, 69, 205, 35, 171, 103, 239, 18, 154, 86, 222, 52, 188, 120, 256, 273, 1,
                        220, 50, 186, 118, 254, 33, 169, 101, 237, 67, 203, 135, 271, 16, 288, 152, 84,
                        178, 110, 246, 25, 161, 93, 229, 59, 195, 127, 263, 8, 280, 144, 76, 212, 42,
                        250, 29, 165, 97, 233, 63, 199, 131, 267, 12, 284, 148, 80, 216, 46, 182, 114,
                        157, 89, 225, 55, 191, 123, 259, 4, 276, 140, 72, 208, 38, 174, 106, 242, 21,
                        235, 65, 201, 133, 269, 14, 286, 150, 82, 218, 48, 184, 116, 252, 31, 167, 99,
                        193, 125, 261, 6, 278, 142, 74, 210, 40, 176, 108, 244, 23, 159, 91, 227, 57,
                        265, 10, 282, 146, 78, 214, 44, 180, 112, 248, 27, 163, 95, 231, 61, 197, 129,
                        274, 138, 70, 206, 36, 172, 104, 240, 19, 155, 87, 223, 53, 189, 121, 257, 137,
                        83, 219, 49, 185, 117, 253, 32, 168, 100, 236, 66, 202, 134, 270, 15, 287, 151,
                        41, 177, 109, 245, 24, 160, 92, 228, 58, 194, 126, 262, 7, 279, 143, 75, 211,
                        113, 249, 28, 164, 96, 232, 62, 198, 130, 266, 11, 283, 147, 79, 215, 45, 181,
                        20, 156, 88, 224, 54, 190, 122, 258, 255, 275, 139, 71, 207, 37, 173, 105, 241,
                        98, 234, 64, 200, 132, 268, 13, 285, 149, 81, 217, 47, 183, 115, 251, 30, 166,
                        56, 192, 124, 260, 5, 277, 141, 73, 209, 39, 175, 107, 243, 22, 158, 90, 226,
                        128, 264, 9, 281, 145, 77, 213, 43, 179, 111, 247, 26, 162, 94, 230, 60, 196,
                        0, 272, 136, 68, 204, 34, 170, 102, 238, 17, 153, 85, 221, 51, 187, 119, 3
                    ],
                    // 21
                    [2, 82, 234, 44, 348, 196, 120, 272, 25, 329, 177, 101, 253, 63, 215, 139, 291, 6, 1,
                        239, 49, 353, 201, 125, 277, 30, 334, 182, 106, 258, 68, 220, 144, 296, 11, 315, 163, 87,
                        343, 191, 115, 267, 20, 324, 172, 96, 248, 58, 210, 134, 286, 310, 305, 153, 77, 229, 39,
                        132, 284, 37, 341, 189, 113, 265, 75, 227, 151, 303, 18, 322, 170, 94, 246, 56, 360, 208,
                        28, 332, 180, 104, 256, 66, 218, 142, 294, 9, 313, 161, 85, 237, 47, 351, 199, 123, 275,
                        185, 109, 261, 71, 223, 147, 299, 14, 318, 166, 90, 242, 52, 356, 204, 128, 280, 33, 337,
                        251, 61, 213, 137, 289, 4, 308, 156, 80, 232, 42, 346, 194, 118, 270, 23, 327, 175, 99,
                        225, 149, 301, 16, 320, 168, 92, 244, 54, 358, 206, 130, 282, 35, 339, 187, 111, 263, 73,
                        292, 7, 311, 159, 83, 235, 45, 349, 197, 121, 273, 26, 330, 178, 102, 254, 64, 216, 140,
                        316, 164, 88, 240, 50, 354, 202, 126, 278, 31, 335, 183, 107, 259, 69, 221, 145, 297, 12,
                        78, 230, 40, 344, 192, 116, 268, 21, 325, 173, 97, 249, 59, 211, 135, 287, 158, 306, 154,
                        55, 359, 207, 131, 283, 36, 340, 188, 112, 264, 74, 226, 150, 302, 17, 321, 169, 93, 245,
                        198, 122, 274, 27, 331, 179, 103, 255, 65, 217, 141, 293, 8, 312, 160, 84, 236, 46, 350,
                        279, 32, 336, 184, 108, 260, 70, 222, 146, 298, 13, 317, 165, 89, 241, 51, 355, 203, 127,
                        326, 174, 98, 250, 60, 212, 136, 288, 285, 307, 155, 79, 231, 41, 345, 193, 117, 269, 22,
                        110, 262, 72, 224, 148, 300, 15, 319, 167, 91, 243, 53, 357, 205, 129, 281, 34, 338, 186,
                        62, 214, 138, 290, 5, 309, 157, 81, 233, 43, 347, 195, 119, 271, 24, 328, 176, 100, 252,
                        143, 295, 10, 314, 162, 86, 238, 48, 352, 200, 124, 276, 29, 333, 181, 105, 257, 67, 219,
                        0, 304, 152, 76, 228, 38, 342, 190, 114, 266, 19, 323, 171, 95, 247, 57, 209, 133, 3
                    ],
                    // 23
                    [2, 88, 424, 256, 46, 382, 214, 130, 298, 25, 361, 193, 109, 277, 67, 403, 235, 151, 319, 4, 1,
                        437, 269, 59, 395, 227, 143, 311, 38, 374, 206, 122, 290, 80, 416, 248, 164, 332, 17, 353, 185, 101,
                        49, 385, 217, 133, 301, 28, 364, 196, 112, 280, 70, 406, 238, 154, 322, 7, 343, 175, 91, 427, 259,
                        222, 138, 306, 33, 369, 201, 117, 285, 75, 411, 243, 159, 327, 12, 348, 180, 96, 432, 264, 54, 390,
                        295, 22, 358, 190, 106, 274, 64, 400, 232, 148, 316, 340, 337, 169, 85, 421, 253, 43, 379, 211, 127,
                        377, 209, 125, 293, 83, 419, 251, 167, 335, 20, 356, 188, 104, 440, 272, 62, 398, 230, 146, 314, 41,
                        115, 283, 73, 409, 241, 157, 325, 10, 346, 178, 94, 430, 262, 52, 388, 220, 136, 304, 31, 367, 199,
                        78, 414, 246, 162, 330, 15, 351, 183, 99, 435, 267, 57, 393, 225, 141, 309, 36, 372, 204, 120, 288,
                        236, 152, 320, 5, 341, 173, 89, 425, 257, 47, 383, 215, 131, 299, 26, 362, 194, 110, 278, 68, 404,
                        333, 18, 354, 186, 102, 438, 270, 60, 396, 228, 144, 312, 39, 375, 207, 123, 291, 81, 417, 249, 165,
                        344, 176, 92, 428, 260, 50, 386, 218, 134, 302, 29, 365, 197, 113, 281, 71, 407, 239, 155, 323, 8,
                        97, 433, 265, 55, 391, 223, 139, 307, 34, 370, 202, 118, 286, 76, 412, 244, 160, 328, 13, 349, 181,
                        254, 44, 380, 212, 128, 296, 23, 359, 191, 107, 275, 65, 401, 233, 149, 317, 172, 338, 170, 86, 422,
                        397, 229, 145, 313, 40, 376, 208, 124, 292, 82, 418, 250, 166, 334, 19, 355, 187, 103, 439, 271, 61,
                        135, 303, 30, 366, 198, 114, 282, 72, 408, 240, 156, 324, 9, 345, 177, 93, 429, 261, 51, 387, 219,
                        35, 371, 203, 119, 287, 77, 413, 245, 161, 329, 14, 350, 182, 98, 434, 266, 56, 392, 224, 140, 308,
                        192, 108, 276, 66, 402, 234, 150, 318, 315, 339, 171, 87, 423, 255, 45, 381, 213, 129, 297, 24, 360,
                        289, 79, 415, 247, 163, 331, 16, 352, 184, 100, 436, 268, 58, 394, 226, 142, 310, 37, 373, 205, 121,
                        405, 237, 153, 321, 6, 342, 174, 90, 426, 258, 48, 384, 216, 132, 300, 27, 363, 195, 111, 279, 69,
                        158, 326, 11, 347, 179, 95, 431, 263, 53, 389, 221, 137, 305, 32, 368, 200, 116, 284, 74, 410, 242,
                        0, 336, 168, 84, 420, 252, 42, 378, 210, 126, 294, 21, 357, 189, 105, 273, 63, 399, 231, 147, 3
                    ],
                    // 25
                    [2, 102, 470, 286, 56, 424, 240, 148, 516, 332, 33, 401, 217, 125, 493, 309, 79, 447, 263, 171, 355, 10, 1,
                        476, 292, 62, 430, 246, 154, 522, 338, 39, 407, 223, 131, 499, 315, 85, 453, 269, 177, 361, 16, 384, 200, 108,
                        50, 418, 234, 142, 510, 326, 27, 395, 211, 119, 487, 303, 73, 441, 257, 165, 349, 4, 372, 188, 96, 464, 280,
                        249, 157, 525, 341, 42, 410, 226, 134, 502, 318, 88, 456, 272, 180, 364, 19, 387, 203, 111, 479, 295, 65, 433,
                        513, 329, 30, 398, 214, 122, 490, 306, 76, 444, 260, 168, 352, 7, 375, 191, 99, 467, 283, 53, 421, 237, 145,
                        36, 404, 220, 128, 496, 312, 82, 450, 266, 174, 358, 13, 381, 197, 105, 473, 289, 59, 427, 243, 151, 519, 335,
                        208, 116, 484, 300, 70, 438, 254, 162, 346, 378, 369, 185, 93, 461, 277, 47, 415, 231, 139, 507, 323, 24, 392,
                        505, 321, 91, 459, 275, 183, 367, 22, 390, 206, 114, 482, 298, 68, 436, 252, 160, 528, 344, 45, 413, 229, 137,
                        80, 448, 264, 172, 356, 11, 379, 195, 103, 471, 287, 57, 425, 241, 149, 517, 333, 34, 402, 218, 126, 494, 310,
                        270, 178, 362, 17, 385, 201, 109, 477, 293, 63, 431, 247, 155, 523, 339, 40, 408, 224, 132, 500, 316, 86, 454,
                        350, 5, 373, 189, 97, 465, 281, 51, 419, 235, 143, 511, 327, 28, 396, 212, 120, 488, 304, 74, 442, 258, 166,
                        388, 204, 112, 480, 296, 66, 434, 250, 158, 526, 342, 43, 411, 227, 135, 503, 319, 89, 457, 273, 181, 365, 20,
                        100, 468, 284, 54, 422, 238, 146, 514, 330, 31, 399, 215, 123, 491, 307, 77, 445, 261, 169, 353, 8, 376, 192,
                        290, 60, 428, 244, 152, 520, 336, 37, 405, 221, 129, 497, 313, 83, 451, 267, 175, 359, 14, 382, 198, 106, 474,
                        416, 232, 140, 508, 324, 25, 393, 209, 117, 485, 301, 71, 439, 255, 163, 347, 194, 370, 186, 94, 462, 278, 48,
                        159, 527, 343, 44, 412, 228, 136, 504, 320, 90, 458, 274, 182, 366, 21, 389, 205, 113, 481, 297, 67, 435, 251,
                        331, 32, 400, 216, 124, 492, 308, 78, 446, 262, 170, 354, 9, 377, 193, 101, 469, 285, 55, 423, 239, 147, 515,
                        406, 222, 130, 498, 314, 84, 452, 268, 176, 360, 15, 383, 199, 107, 475, 291, 61, 429, 245, 153, 521, 337, 38,
                        118, 486, 302, 72, 440, 256, 164, 348, 345, 371, 187, 95, 463, 279, 49, 417, 233, 141, 509, 325, 26, 394, 210,
                        317, 87, 455, 271, 179, 363, 18, 386, 202, 110, 478, 294, 64, 432, 248, 156, 524, 340, 41, 409, 225, 133, 501,
                        443, 259, 167, 351, 6, 374, 190, 98, 466, 282, 52, 420, 236, 144, 512, 328, 29, 397, 213, 121, 489, 305, 75,
                        173, 357, 12, 380, 196, 104, 472, 288, 58, 426, 242, 150, 518, 334, 35, 403, 219, 127, 495, 311, 81, 449, 265,
                        0, 368, 184, 92, 460, 276, 46, 414, 230, 138, 506, 322, 23, 391, 207, 115, 483, 299, 69, 437, 253, 161, 3
                    ],
                    // 27
                    [2, 603, 103, 503, 303, 53, 453, 253, 153, 553, 353, 28, 428, 228, 128, 528, 328, 78, 478, 278, 178, 578, 378, 375, 1,
                        123, 523, 323, 73, 473, 273, 173, 573, 373, 48, 448, 248, 148, 548, 348, 98, 498, 298, 198, 598, 398, 23, 423, 223, 623,
                        311, 61, 461, 261, 161, 561, 361, 36, 436, 236, 136, 536, 336, 86, 486, 286, 186, 586, 386, 11, 411, 211, 611, 111, 511,
                        467, 267, 167, 567, 367, 42, 442, 242, 142, 542, 342, 92, 492, 292, 192, 592, 392, 17, 417, 217, 617, 117, 517, 317, 67,
                        155, 555, 355, 30, 430, 230, 130, 530, 330, 80, 480, 280, 180, 580, 380, 5, 405, 205, 605, 105, 505, 305, 55, 455, 255,
                        370, 45, 445, 245, 145, 545, 345, 95, 495, 295, 195, 595, 395, 20, 420, 220, 620, 120, 520, 320, 70, 470, 270, 170, 570,
                        433, 233, 133, 533, 333, 83, 483, 283, 183, 583, 383, 8, 408, 208, 608, 108, 508, 308, 58, 458, 258, 158, 558, 358, 33,
                        139, 539, 339, 89, 489, 289, 189, 589, 389, 14, 414, 214, 614, 114, 514, 314, 64, 464, 264, 164, 564, 364, 39, 439, 239,
                        326, 76, 476, 276, 176, 576, 376, 403, 401, 201, 601, 101, 501, 301, 51, 451, 251, 151, 551, 351, 26, 426, 226, 126, 526,
                        499, 299, 199, 599, 399, 24, 424, 224, 624, 124, 524, 324, 74, 474, 274, 174, 574, 374, 49, 449, 249, 149, 549, 349, 99,
                        187, 587, 387, 12, 412, 212, 612, 112, 512, 312, 62, 462, 262, 162, 562, 362, 37, 437, 237, 137, 537, 337, 87, 487, 287,
                        393, 18, 418, 218, 618, 118, 518, 318, 68, 468, 268, 168, 568, 368, 43, 443, 243, 143, 543, 343, 93, 493, 293, 193, 593,
                        406, 206, 606, 106, 506, 306, 56, 456, 256, 156, 556, 356, 31, 431, 231, 131, 531, 331, 81, 481, 281, 181, 581, 381, 6,
                        621, 121, 521, 321, 71, 471, 271, 171, 571, 371, 46, 446, 246, 146, 546, 346, 96, 496, 296, 196, 596, 396, 21, 421, 221,
                        509, 309, 59, 459, 259, 159, 559, 359, 34, 434, 234, 134, 534, 334, 84, 484, 284, 184, 584, 384, 9, 409, 209, 609, 109,
                        65, 465, 265, 165, 565, 365, 40, 440, 240, 140, 540, 340, 90, 490, 290, 190, 590, 390, 15, 415, 215, 615, 115, 515, 315,
                        252, 152, 552, 352, 27, 427, 227, 127, 527, 327, 77, 477, 277, 177, 577, 377, 203, 402, 202, 602, 102, 502, 302, 52, 452,
                        572, 372, 47, 447, 247, 147, 547, 347, 97, 497, 297, 197, 597, 397, 22, 422, 222, 622, 122, 522, 322, 72, 472, 272, 172,
                        35, 435, 235, 135, 535, 335, 85, 485, 285, 185, 585, 385, 10, 410, 210, 610, 110, 510, 310, 60, 460, 260, 160, 560, 360,
                        241, 141, 541, 341, 91, 491, 291, 191, 591, 391, 16, 416, 216, 616, 116, 516, 316, 66, 466, 266, 166, 566, 366, 41, 441,
                        529, 329, 79, 479, 279, 179, 579, 379, 4, 404, 204, 604, 104, 504, 304, 54, 454, 254, 154, 554, 354, 29, 429, 229, 129,
                        94, 494, 294, 194, 594, 394, 19, 419, 219, 619, 119, 519, 319, 69, 469, 269, 169, 569, 369, 44, 444, 244, 144, 544, 344,
                        282, 182, 582, 382, 7, 407, 207, 607, 107, 507, 307, 57, 457, 257, 157, 557, 357, 32, 432, 232, 132, 532, 332, 82, 482,
                        588, 388, 13, 413, 213, 613, 113, 513, 313, 63, 463, 263, 163, 563, 363, 38, 438, 238, 138, 538, 338, 88, 488, 288, 188,
                        0, 400, 200, 600, 100, 500, 300, 50, 450, 250, 150, 550, 350, 25, 425, 225, 125, 525, 325, 75, 475, 275, 175, 575, 3
                    ],
                    // 29
                    [2, 658, 118, 550, 334, 64, 496, 280, 712, 172, 604, 388, 37, 469, 253, 685, 145, 577, 361, 91, 523, 307, 199, 631, 415, 10, 1,
                        125, 557, 341, 71, 503, 287, 719, 179, 611, 395, 44, 476, 260, 692, 152, 584, 368, 98, 530, 314, 206, 638, 422, 17, 449, 233, 665,
                        327, 57, 489, 273, 705, 165, 597, 381, 30, 462, 246, 678, 138, 570, 354, 84, 516, 300, 192, 624, 408, 405, 435, 219, 651, 111, 543,
                        511, 295, 727, 187, 619, 403, 52, 484, 268, 700, 160, 592, 376, 106, 538, 322, 214, 646, 430, 25, 457, 241, 673, 133, 565, 349, 79,
                        714, 174, 606, 390, 39, 471, 255, 687, 147, 579, 363, 93, 525, 309, 201, 633, 417, 12, 444, 228, 660, 120, 552, 336, 66, 498, 282,
                        613, 397, 46, 478, 262, 694, 154, 586, 370, 100, 532, 316, 208, 640, 424, 19, 451, 235, 667, 127, 559, 343, 73, 505, 289, 721, 181,
                        32, 464, 248, 680, 140, 572, 356, 86, 518, 302, 194, 626, 410, 5, 437, 221, 653, 113, 545, 329, 59, 491, 275, 707, 167, 599, 383,
                        265, 697, 157, 589, 373, 103, 535, 319, 211, 643, 427, 22, 454, 238, 670, 130, 562, 346, 76, 508, 292, 724, 184, 616, 400, 49, 481,
                        143, 575, 359, 89, 521, 305, 197, 629, 413, 8, 440, 224, 656, 116, 548, 332, 62, 494, 278, 710, 170, 602, 386, 35, 467, 251, 683,
                        366, 96, 528, 312, 204, 636, 420, 15, 447, 231, 663, 123, 555, 339, 69, 501, 285, 717, 177, 609, 393, 42, 474, 258, 690, 150, 582,
                        514, 298, 190, 622, 406, 442, 433, 217, 649, 109, 541, 325, 55, 487, 271, 703, 163, 595, 379, 28, 460, 244, 676, 136, 568, 352, 82,
                        215, 647, 431, 26, 458, 242, 674, 134, 566, 350, 80, 512, 296, 728, 188, 620, 404, 53, 485, 269, 701, 161, 593, 377, 107, 539, 323,
                        418, 13, 445, 229, 661, 121, 553, 337, 67, 499, 283, 715, 175, 607, 391, 40, 472, 256, 688, 148, 580, 364, 94, 526, 310, 202, 634,
                        452, 236, 668, 128, 560, 344, 74, 506, 290, 722, 182, 614, 398, 47, 479, 263, 695, 155, 587, 371, 101, 533, 317, 209, 641, 425, 20,
                        654, 114, 546, 330, 60, 492, 276, 708, 168, 600, 384, 33, 465, 249, 681, 141, 573, 357, 87, 519, 303, 195, 627, 411, 6, 438, 222,
                        563, 347, 77, 509, 293, 725, 185, 617, 401, 50, 482, 266, 698, 158, 590, 374, 104, 536, 320, 212, 644, 428, 23, 455, 239, 671, 131,
                        63, 495, 279, 711, 171, 603, 387, 36, 468, 252, 684, 144, 576, 360, 90, 522, 306, 198, 630, 414, 9, 441, 225, 657, 117, 549, 333,
                        286, 718, 178, 610, 394, 43, 475, 259, 691, 151, 583, 367, 97, 529, 313, 205, 637, 421, 16, 448, 232, 664, 124, 556, 340, 70, 502,
                        164, 596, 380, 29, 461, 245, 677, 137, 569, 353, 83, 515, 299, 191, 623, 407, 226, 434, 218, 650, 110, 542, 326, 56, 488, 272, 704,
                        402, 51, 483, 267, 699, 159, 591, 375, 105, 537, 321, 213, 645, 429, 24, 456, 240, 672, 132, 564, 348, 78, 510, 294, 726, 186, 618,
                        470, 254, 686, 146, 578, 362, 92, 524, 308, 200, 632, 416, 11, 443, 227, 659, 119, 551, 335, 65, 497, 281, 713, 173, 605, 389, 38,
                        693, 153, 585, 369, 99, 531, 315, 207, 639, 423, 18, 450, 234, 666, 126, 558, 342, 72, 504, 288, 720, 180, 612, 396, 45, 477, 261,
                        571, 355, 85, 517, 301, 193, 625, 409, 4, 436, 220, 652, 112, 544, 328, 58, 490, 274, 706, 166, 598, 382, 31, 463, 247, 679, 139,
                        102, 534, 318, 210, 642, 426, 21, 453, 237, 669, 129, 561, 345, 75, 507, 291, 723, 183, 615, 399, 48, 480, 264, 696, 156, 588, 372,
                        304, 196, 628, 412, 7, 439, 223, 655, 115, 547, 331, 61, 493, 277, 709, 169, 601, 385, 34, 466, 250, 682, 142, 574, 358, 88, 520,
                        635, 419, 14, 446, 230, 662, 122, 554, 338, 68, 500, 284, 716, 176, 608, 392, 41, 473, 257, 689, 149, 581, 365, 95, 527, 311, 203,
                        0, 432, 216, 648, 108, 540, 324, 54, 486, 270, 702, 162, 594, 378, 27, 459, 243, 675, 135, 567, 351, 81, 513, 297, 189, 621, 3
                    ],
                    // 31
                    [2, 703, 123, 587, 355, 819, 65, 529, 297, 761, 181, 645, 413, 36, 500, 268, 732, 152, 616, 384, 94, 558, 326, 790, 210, 674, 442, 7, 1,
                        141, 605, 373, 837, 83, 547, 315, 779, 199, 663, 431, 54, 518, 286, 750, 170, 634, 402, 112, 576, 344, 808, 228, 692, 460, 25, 489, 257, 721,
                        359, 823, 69, 533, 301, 765, 185, 649, 417, 40, 504, 272, 736, 156, 620, 388, 98, 562, 330, 794, 214, 678, 446, 11, 475, 243, 707, 127, 591,
                        76, 540, 308, 772, 192, 656, 424, 47, 511, 279, 743, 163, 627, 395, 105, 569, 337, 801, 221, 685, 453, 18, 482, 250, 714, 134, 598, 366, 830,
                        293, 757, 177, 641, 409, 32, 496, 264, 728, 148, 612, 380, 90, 554, 322, 786, 206, 670, 438, 435, 467, 235, 699, 119, 583, 351, 815, 61, 525,
                        201, 665, 433, 56, 520, 288, 752, 172, 636, 404, 114, 578, 346, 810, 230, 694, 462, 27, 491, 259, 723, 143, 607, 375, 839, 85, 549, 317, 781,
                        419, 42, 506, 274, 738, 158, 622, 390, 100, 564, 332, 796, 216, 680, 448, 13, 477, 245, 709, 129, 593, 361, 825, 71, 535, 303, 767, 187, 651,
                        513, 281, 745, 165, 629, 397, 107, 571, 339, 803, 223, 687, 455, 20, 484, 252, 716, 136, 600, 368, 832, 78, 542, 310, 774, 194, 658, 426, 49,
                        730, 150, 614, 382, 92, 556, 324, 788, 208, 672, 440, 5, 469, 237, 701, 121, 585, 353, 817, 63, 527, 295, 759, 179, 643, 411, 34, 498, 266,
                        632, 400, 110, 574, 342, 806, 226, 690, 458, 23, 487, 255, 719, 139, 603, 371, 835, 81, 545, 313, 777, 197, 661, 429, 52, 516, 284, 748, 168,
                        96, 560, 328, 792, 212, 676, 444, 9, 473, 241, 705, 125, 589, 357, 821, 67, 531, 299, 763, 183, 647, 415, 38, 502, 270, 734, 154, 618, 386,
                        335, 799, 219, 683, 451, 16, 480, 248, 712, 132, 596, 364, 828, 74, 538, 306, 770, 190, 654, 422, 45, 509, 277, 741, 161, 625, 393, 103, 567,
                        204, 668, 436, 471, 465, 233, 697, 117, 581, 349, 813, 59, 523, 291, 755, 175, 639, 407, 30, 494, 262, 726, 146, 610, 378, 88, 552, 320, 784,
                        463, 28, 492, 260, 724, 144, 608, 376, 840, 86, 550, 318, 782, 202, 666, 434, 57, 521, 289, 753, 173, 637, 405, 115, 579, 347, 811, 231, 695,
                        478, 246, 710, 130, 594, 362, 826, 72, 536, 304, 768, 188, 652, 420, 43, 507, 275, 739, 159, 623, 391, 101, 565, 333, 797, 217, 681, 449, 14,
                        717, 137, 601, 369, 833, 79, 543, 311, 775, 195, 659, 427, 50, 514, 282, 746, 166, 630, 398, 108, 572, 340, 804, 224, 688, 456, 21, 485, 253,
                        586, 354, 818, 64, 528, 296, 760, 180, 644, 412, 35, 499, 267, 731, 151, 615, 383, 93, 557, 325, 789, 209, 673, 441, 6, 470, 238, 702, 122,
                        836, 82, 546, 314, 778, 198, 662, 430, 53, 517, 285, 749, 169, 633, 401, 111, 575, 343, 807, 227, 691, 459, 24, 488, 256, 720, 140, 604, 372,
                        532, 300, 764, 184, 648, 416, 39, 503, 271, 735, 155, 619, 387, 97, 561, 329, 793, 213, 677, 445, 10, 474, 242, 706, 126, 590, 358, 822, 68,
                        771, 191, 655, 423, 46, 510, 278, 742, 162, 626, 394, 104, 568, 336, 800, 220, 684, 452, 17, 481, 249, 713, 133, 597, 365, 829, 75, 539, 307,
                        640, 408, 31, 495, 263, 727, 147, 611, 379, 89, 553, 321, 785, 205, 669, 437, 239, 466, 234, 698, 118, 582, 350, 814, 60, 524, 292, 756, 176,
                        55, 519, 287, 751, 171, 635, 403, 113, 577, 345, 809, 229, 693, 461, 26, 490, 258, 722, 142, 606, 374, 838, 84, 548, 316, 780, 200, 664, 432,
                        273, 737, 157, 621, 389, 99, 563, 331, 795, 215, 679, 447, 12, 476, 244, 708, 128, 592, 360, 824, 70, 534, 302, 766, 186, 650, 418, 41, 505,
                        164, 628, 396, 106, 570, 338, 802, 222, 686, 454, 19, 483, 251, 715, 135, 599, 367, 831, 77, 541, 309, 773, 193, 657, 425, 48, 512, 280, 744,
                        381, 91, 555, 323, 787, 207, 671, 439, 4, 468, 236, 700, 120, 584, 352, 816, 62, 526, 294, 758, 178, 642, 410, 33, 497, 265, 729, 149, 613,
                        573, 341, 805, 225, 689, 457, 22, 486, 254, 718, 138, 602, 370, 834, 80, 544, 312, 776, 196, 660, 428, 51, 515, 283, 747, 167, 631, 399, 109,
                        791, 211, 675, 443, 8, 472, 240, 704, 124, 588, 356, 820, 66, 530, 298, 762, 182, 646, 414, 37, 501, 269, 733, 153, 617, 385, 95, 559, 327,
                        682, 450, 15, 479, 247, 711, 131, 595, 363, 827, 73, 537, 305, 769, 189, 653, 421, 44, 508, 276, 740, 160, 624, 392, 102, 566, 334, 798, 218,
                        0, 464, 232, 696, 116, 580, 348, 812, 58, 522, 290, 754, 174, 638, 406, 29, 493, 261, 725, 145, 609, 377, 87, 551, 319, 783, 203, 667, 3
                    ],
                    // 33
                    [2, 759, 139, 635, 387, 883, 77, 573, 325, 821, 201, 697, 449, 945, 46, 542, 294, 790, 170, 666, 418, 914, 108, 604, 356, 852, 232, 728, 480, 15, 1,
                        147, 643, 395, 891, 85, 581, 333, 829, 209, 705, 457, 953, 54, 550, 302, 798, 178, 674, 426, 922, 116, 612, 364, 860, 240, 736, 488, 23, 519, 271, 767,
                        379, 875, 69, 565, 317, 813, 193, 689, 441, 937, 38, 534, 286, 782, 162, 658, 410, 906, 100, 596, 348, 844, 224, 720, 472, 7, 503, 255, 751, 131, 627,
                        89, 585, 337, 833, 213, 709, 461, 957, 58, 554, 306, 802, 182, 678, 430, 926, 120, 616, 368, 864, 244, 740, 492, 27, 523, 275, 771, 151, 647, 399, 895,
                        321, 817, 197, 693, 445, 941, 42, 538, 290, 786, 166, 662, 414, 910, 104, 600, 352, 848, 228, 724, 476, 11, 507, 259, 755, 135, 631, 383, 879, 73, 569,
                        205, 701, 453, 949, 50, 546, 298, 794, 174, 670, 422, 918, 112, 608, 360, 856, 236, 732, 484, 19, 515, 267, 763, 143, 639, 391, 887, 81, 577, 329, 825,
                        437, 933, 34, 530, 282, 778, 158, 654, 406, 902, 96, 592, 344, 840, 220, 716, 468, 465, 499, 251, 747, 127, 623, 375, 871, 65, 561, 313, 809, 189, 685,
                        60, 556, 308, 804, 184, 680, 432, 928, 122, 618, 370, 866, 246, 742, 494, 29, 525, 277, 773, 153, 649, 401, 897, 91, 587, 339, 835, 215, 711, 463, 959,
                        292, 788, 168, 664, 416, 912, 106, 602, 354, 850, 230, 726, 478, 13, 509, 261, 757, 137, 633, 385, 881, 75, 571, 323, 819, 199, 695, 447, 943, 44, 540,
                        176, 672, 424, 920, 114, 610, 362, 858, 238, 734, 486, 21, 517, 269, 765, 145, 641, 393, 889, 83, 579, 331, 827, 207, 703, 455, 951, 52, 548, 300, 796,
                        408, 904, 98, 594, 346, 842, 222, 718, 470, 5, 501, 253, 749, 129, 625, 377, 873, 67, 563, 315, 811, 191, 687, 439, 935, 36, 532, 284, 780, 160, 656,
                        118, 614, 366, 862, 242, 738, 490, 25, 521, 273, 769, 149, 645, 397, 893, 87, 583, 335, 831, 211, 707, 459, 955, 56, 552, 304, 800, 180, 676, 428, 924,
                        350, 846, 226, 722, 474, 9, 505, 257, 753, 133, 629, 381, 877, 71, 567, 319, 815, 195, 691, 443, 939, 40, 536, 288, 784, 164, 660, 412, 908, 102, 598,
                        234, 730, 482, 17, 513, 265, 761, 141, 637, 389, 885, 79, 575, 327, 823, 203, 699, 451, 947, 48, 544, 296, 792, 172, 668, 420, 916, 110, 606, 358, 854,
                        466, 511, 497, 249, 745, 125, 621, 373, 869, 63, 559, 311, 807, 187, 683, 435, 931, 32, 528, 280, 776, 156, 652, 404, 900, 94, 590, 342, 838, 218, 714,
                        526, 278, 774, 154, 650, 402, 898, 92, 588, 340, 836, 216, 712, 464, 960, 61, 557, 309, 805, 185, 681, 433, 929, 123, 619, 371, 867, 247, 743, 495, 30,
                        758, 138, 634, 386, 882, 76, 572, 324, 820, 200, 696, 448, 944, 45, 541, 293, 789, 169, 665, 417, 913, 107, 603, 355, 851, 231, 727, 479, 14, 510, 262,
                        642, 394, 890, 84, 580, 332, 828, 208, 704, 456, 952, 53, 549, 301, 797, 177, 673, 425, 921, 115, 611, 363, 859, 239, 735, 487, 22, 518, 270, 766, 146,
                        874, 68, 564, 316, 812, 192, 688, 440, 936, 37, 533, 285, 781, 161, 657, 409, 905, 99, 595, 347, 843, 223, 719, 471, 6, 502, 254, 750, 130, 626, 378,
                        584, 336, 832, 212, 708, 460, 956, 57, 553, 305, 801, 181, 677, 429, 925, 119, 615, 367, 863, 243, 739, 491, 26, 522, 274, 770, 150, 646, 398, 894, 88,
                        816, 196, 692, 444, 940, 41, 537, 289, 785, 165, 661, 413, 909, 103, 599, 351, 847, 227, 723, 475, 10, 506, 258, 754, 134, 630, 382, 878, 72, 568, 320,
                        700, 452, 948, 49, 545, 297, 793, 173, 669, 421, 917, 111, 607, 359, 855, 235, 731, 483, 18, 514, 266, 762, 142, 638, 390, 886, 80, 576, 328, 824, 204,
                        932, 33, 529, 281, 777, 157, 653, 405, 901, 95, 591, 343, 839, 219, 715, 467, 263, 498, 250, 746, 126, 622, 374, 870, 64, 560, 312, 808, 188, 684, 436,
                        555, 307, 803, 183, 679, 431, 927, 121, 617, 369, 865, 245, 741, 493, 28, 524, 276, 772, 152, 648, 400, 896, 90, 586, 338, 834, 214, 710, 462, 958, 59,
                        787, 167, 663, 415, 911, 105, 601, 353, 849, 229, 725, 477, 12, 508, 260, 756, 136, 632, 384, 880, 74, 570, 322, 818, 198, 694, 446, 942, 43, 539, 291,
                        671, 423, 919, 113, 609, 361, 857, 237, 733, 485, 20, 516, 268, 764, 144, 640, 392, 888, 82, 578, 330, 826, 206, 702, 454, 950, 51, 547, 299, 795, 175,
                        903, 97, 593, 345, 841, 221, 717, 469, 4, 500, 252, 748, 128, 624, 376, 872, 66, 562, 314, 810, 190, 686, 438, 934, 35, 531, 283, 779, 159, 655, 407,
                        613, 365, 861, 241, 737, 489, 24, 520, 272, 768, 148, 644, 396, 892, 86, 582, 334, 830, 210, 706, 458, 954, 55, 551, 303, 799, 179, 675, 427, 923, 117,
                        845, 225, 721, 473, 8, 504, 256, 752, 132, 628, 380, 876, 70, 566, 318, 814, 194, 690, 442, 938, 39, 535, 287, 783, 163, 659, 411, 907, 101, 597, 349,
                        729, 481, 16, 512, 264, 760, 140, 636, 388, 884, 78, 574, 326, 822, 202, 698, 450, 946, 47, 543, 295, 791, 171, 667, 419, 915, 109, 605, 357, 853, 233,
                        0, 496, 248, 744, 124, 620, 372, 868, 62, 558, 310, 806, 186, 682, 434, 930, 31, 527, 279, 775, 155, 651, 403, 899, 93, 589, 341, 837, 217, 713, 3
                    ],
                    // 35
                    [2, 265, 793, 133, 661, 397, 925, 67, 595, 331, 859, 199, 727, 463, 991, 34, 562, 298, 826, 166, 694, 430, 958, 100, 628, 364, 892, 232, 760, 496, 1024, 1057, 1,
                        824, 164, 692, 428, 956, 98, 626, 362, 890, 230, 758, 494, 1022, 65, 593, 329, 857, 197, 725, 461, 989, 131, 659, 395, 923, 263, 791, 527, 1055, 32, 1088, 560, 296,
                        676, 412, 940, 82, 610, 346, 874, 214, 742, 478, 1006, 49, 577, 313, 841, 181, 709, 445, 973, 115, 643, 379, 907, 247, 775, 511, 1039, 16, 1072, 544, 280, 808, 148,
                        948, 90, 618, 354, 882, 222, 750, 486, 1014, 57, 585, 321, 849, 189, 717, 453, 981, 123, 651, 387, 915, 255, 783, 519, 1047, 24, 1080, 552, 288, 816, 156, 684, 420,
                        602, 338, 866, 206, 734, 470, 998, 41, 569, 305, 833, 173, 701, 437, 965, 107, 635, 371, 899, 239, 767, 503, 1031, 8, 1064, 536, 272, 800, 140, 668, 404, 932, 74,
                        886, 226, 754, 490, 1018, 61, 589, 325, 853, 193, 721, 457, 985, 127, 655, 391, 919, 259, 787, 523, 1051, 28, 1084, 556, 292, 820, 160, 688, 424, 952, 94, 622, 358,
                        738, 474, 1002, 45, 573, 309, 837, 177, 705, 441, 969, 111, 639, 375, 903, 243, 771, 507, 1035, 12, 1068, 540, 276, 804, 144, 672, 408, 936, 78, 606, 342, 870, 210,
                        1010, 53, 581, 317, 845, 185, 713, 449, 977, 119, 647, 383, 911, 251, 779, 515, 1043, 20, 1076, 548, 284, 812, 152, 680, 416, 944, 86, 614, 350, 878, 218, 746, 482,
                        565, 301, 829, 169, 697, 433, 961, 103, 631, 367, 895, 235, 763, 499, 1027, 4, 1060, 532, 268, 796, 136, 664, 400, 928, 70, 598, 334, 862, 202, 730, 466, 994, 37,
                        855, 195, 723, 459, 987, 129, 657, 393, 921, 261, 789, 525, 1053, 30, 1086, 558, 294, 822, 162, 690, 426, 954, 96, 624, 360, 888, 228, 756, 492, 1020, 63, 591, 327,
                        707, 443, 971, 113, 641, 377, 905, 245, 773, 509, 1037, 14, 1070, 542, 278, 806, 146, 674, 410, 938, 80, 608, 344, 872, 212, 740, 476, 1004, 47, 575, 311, 839, 179,
                        979, 121, 649, 385, 913, 253, 781, 517, 1045, 22, 1078, 550, 286, 814, 154, 682, 418, 946, 88, 616, 352, 880, 220, 748, 484, 1012, 55, 583, 319, 847, 187, 715, 451,
                        633, 369, 897, 237, 765, 501, 1029, 6, 1062, 534, 270, 798, 138, 666, 402, 930, 72, 600, 336, 864, 204, 732, 468, 996, 39, 567, 303, 831, 171, 699, 435, 963, 105,
                        917, 257, 785, 521, 1049, 26, 1082, 554, 290, 818, 158, 686, 422, 950, 92, 620, 356, 884, 224, 752, 488, 1016, 59, 587, 323, 851, 191, 719, 455, 983, 125, 653, 389,
                        769, 505, 1033, 10, 1066, 538, 274, 802, 142, 670, 406, 934, 76, 604, 340, 868, 208, 736, 472, 1000, 43, 571, 307, 835, 175, 703, 439, 967, 109, 637, 373, 901, 241,
                        1041, 18, 1074, 546, 282, 810, 150, 678, 414, 942, 84, 612, 348, 876, 216, 744, 480, 1008, 51, 579, 315, 843, 183, 711, 447, 975, 117, 645, 381, 909, 249, 777, 513,
                        1058, 530, 266, 794, 134, 662, 398, 926, 68, 596, 332, 860, 200, 728, 464, 992, 35, 563, 299, 827, 167, 695, 431, 959, 101, 629, 365, 893, 233, 761, 497, 1025, 529,
                        295, 823, 163, 691, 427, 955, 97, 625, 361, 889, 229, 757, 493, 1021, 64, 592, 328, 856, 196, 724, 460, 988, 130, 658, 394, 922, 262, 790, 526, 1054, 31, 1087, 559,
                        147, 675, 411, 939, 81, 609, 345, 873, 213, 741, 477, 1005, 48, 576, 312, 840, 180, 708, 444, 972, 114, 642, 378, 906, 246, 774, 510, 1038, 15, 1071, 543, 279, 807,
                        419, 947, 89, 617, 353, 881, 221, 749, 485, 1013, 56, 584, 320, 848, 188, 716, 452, 980, 122, 650, 386, 914, 254, 782, 518, 1046, 23, 1079, 551, 287, 815, 155, 683,
                        73, 601, 337, 865, 205, 733, 469, 997, 40, 568, 304, 832, 172, 700, 436, 964, 106, 634, 370, 898, 238, 766, 502, 1030, 7, 1063, 535, 271, 799, 139, 667, 403, 931,
                        357, 885, 225, 753, 489, 1017, 60, 588, 324, 852, 192, 720, 456, 984, 126, 654, 390, 918, 258, 786, 522, 1050, 27, 1083, 555, 291, 819, 159, 687, 423, 951, 93, 621,
                        209, 737, 473, 1001, 44, 572, 308, 836, 176, 704, 440, 968, 110, 638, 374, 902, 242, 770, 506, 1034, 11, 1067, 539, 275, 803, 143, 671, 407, 935, 77, 605, 341, 869,
                        481, 1009, 52, 580, 316, 844, 184, 712, 448, 976, 118, 646, 382, 910, 250, 778, 514, 1042, 19, 1075, 547, 283, 811, 151, 679, 415, 943, 85, 613, 349, 877, 217, 745,
                        36, 564, 300, 828, 168, 696, 432, 960, 102, 630, 366, 894, 234, 762, 498, 1026, 1023, 1059, 531, 267, 795, 135, 663, 399, 927, 69, 597, 333, 861, 201, 729, 465, 993,
                        326, 854, 194, 722, 458, 986, 128, 656, 392, 920, 260, 788, 524, 1052, 29, 1085, 557, 293, 821, 161, 689, 425, 953, 95, 623, 359, 887, 227, 755, 491, 1019, 62, 590,
                        178, 706, 442, 970, 112, 640, 376, 904, 244, 772, 508, 1036, 13, 1069, 541, 277, 805, 145, 673, 409, 937, 79, 607, 343, 871, 211, 739, 475, 1003, 46, 574, 310, 838,
                        450, 978, 120, 648, 384, 912, 252, 780, 516, 1044, 21, 1077, 549, 285, 813, 153, 681, 417, 945, 87, 615, 351, 879, 219, 747, 483, 1011, 54, 582, 318, 846, 186, 714,
                        104, 632, 368, 896, 236, 764, 500, 1028, 5, 1061, 533, 269, 797, 137, 665, 401, 929, 71, 599, 335, 863, 203, 731, 467, 995, 38, 566, 302, 830, 170, 698, 434, 962,
                        388, 916, 256, 784, 520, 1048, 25, 1081, 553, 289, 817, 157, 685, 421, 949, 91, 619, 355, 883, 223, 751, 487, 1015, 58, 586, 322, 850, 190, 718, 454, 982, 124, 652,
                        240, 768, 504, 1032, 9, 1065, 537, 273, 801, 141, 669, 405, 933, 75, 603, 339, 867, 207, 735, 471, 999, 42, 570, 306, 834, 174, 702, 438, 966, 108, 636, 372, 900,
                        512, 1040, 17, 1073, 545, 281, 809, 149, 677, 413, 941, 83, 611, 347, 875, 215, 743, 479, 1007, 50, 578, 314, 842, 182, 710, 446, 974, 116, 644, 380, 908, 248, 776,
                        0, 1056, 528, 264, 792, 132, 660, 396, 924, 66, 594, 330, 858, 198, 726, 462, 990, 33, 561, 297, 825, 165, 693, 429, 957, 99, 627, 363, 891, 231, 759, 495, 3
                    ],
                    // 37
                    [2, 290, 850, 150, 710, 430, 990, 80, 1200, 640, 360, 920, 220, 780, 500, 1060, 45, 1165, 605, 325, 885, 185, 745, 465, 1025, 115, 675, 395, 955, 255, 815, 535, 1095, 10, 1,
                        859, 159, 719, 439, 999, 89, 1209, 649, 369, 929, 229, 789, 509, 1069, 54, 1174, 614, 334, 894, 194, 754, 474, 1034, 124, 684, 404, 964, 264, 824, 544, 1104, 19, 1139, 579, 299,
                        701, 421, 981, 71, 1191, 631, 351, 911, 211, 771, 491, 1051, 36, 1156, 596, 316, 876, 176, 736, 456, 1016, 106, 666, 386, 946, 246, 806, 526, 1086, 1130, 1121, 561, 281, 841, 141,
                        1014, 104, 1224, 664, 384, 944, 244, 804, 524, 1084, 69, 1189, 629, 349, 909, 209, 769, 489, 1049, 139, 699, 419, 979, 279, 839, 559, 1119, 34, 1154, 594, 314, 874, 174, 734, 454,
                        1207, 647, 367, 927, 227, 787, 507, 1067, 52, 1172, 612, 332, 892, 192, 752, 472, 1032, 122, 682, 402, 962, 262, 822, 542, 1102, 17, 1137, 577, 297, 857, 157, 717, 437, 997, 87,
                        376, 936, 236, 796, 516, 1076, 61, 1181, 621, 341, 901, 201, 761, 481, 1041, 131, 691, 411, 971, 271, 831, 551, 1111, 26, 1146, 586, 306, 866, 166, 726, 446, 1006, 96, 1216, 656,
                        218, 778, 498, 1058, 43, 1163, 603, 323, 883, 183, 743, 463, 1023, 113, 673, 393, 953, 253, 813, 533, 1093, 8, 1128, 568, 288, 848, 148, 708, 428, 988, 78, 1198, 638, 358, 918,
                        520, 1080, 65, 1185, 625, 345, 905, 205, 765, 485, 1045, 135, 695, 415, 975, 275, 835, 555, 1115, 30, 1150, 590, 310, 870, 170, 730, 450, 1010, 100, 1220, 660, 380, 940, 240, 800,
                        48, 1168, 608, 328, 888, 188, 748, 468, 1028, 118, 678, 398, 958, 258, 818, 538, 1098, 13, 1133, 573, 293, 853, 153, 713, 433, 993, 83, 1203, 643, 363, 923, 223, 783, 503, 1063,
                        617, 337, 897, 197, 757, 477, 1037, 127, 687, 407, 967, 267, 827, 547, 1107, 22, 1142, 582, 302, 862, 162, 722, 442, 1002, 92, 1212, 652, 372, 932, 232, 792, 512, 1072, 57, 1177,
                        879, 179, 739, 459, 1019, 109, 669, 389, 949, 249, 809, 529, 1089, 4, 1124, 564, 284, 844, 144, 704, 424, 984, 74, 1194, 634, 354, 914, 214, 774, 494, 1054, 39, 1159, 599, 319,
                        767, 487, 1047, 137, 697, 417, 977, 277, 837, 557, 1117, 32, 1152, 592, 312, 872, 172, 732, 452, 1012, 102, 1222, 662, 382, 942, 242, 802, 522, 1082, 67, 1187, 627, 347, 907, 207,
                        1030, 120, 680, 400, 960, 260, 820, 540, 1100, 15, 1135, 575, 295, 855, 155, 715, 435, 995, 85, 1205, 645, 365, 925, 225, 785, 505, 1065, 50, 1170, 610, 330, 890, 190, 750, 470,
                        689, 409, 969, 269, 829, 549, 1109, 24, 1144, 584, 304, 864, 164, 724, 444, 1004, 94, 1214, 654, 374, 934, 234, 794, 514, 1074, 59, 1179, 619, 339, 899, 199, 759, 479, 1039, 129,
                        951, 251, 811, 531, 1091, 6, 1126, 566, 286, 846, 146, 706, 426, 986, 76, 1196, 636, 356, 916, 216, 776, 496, 1056, 41, 1161, 601, 321, 881, 181, 741, 461, 1021, 111, 671, 391,
                        833, 553, 1113, 28, 1148, 588, 308, 868, 168, 728, 448, 1008, 98, 1218, 658, 378, 938, 238, 798, 518, 1078, 63, 1183, 623, 343, 903, 203, 763, 483, 1043, 133, 693, 413, 973, 273,
                        1096, 11, 1131, 571, 291, 851, 151, 711, 431, 991, 81, 1201, 641, 361, 921, 221, 781, 501, 1061, 46, 1166, 606, 326, 886, 186, 746, 466, 1026, 116, 676, 396, 956, 256, 816, 536,
                        1140, 580, 300, 860, 160, 720, 440, 1000, 90, 1210, 650, 370, 930, 230, 790, 510, 1070, 55, 1175, 615, 335, 895, 195, 755, 475, 1035, 125, 685, 405, 965, 265, 825, 545, 1105, 20,
                        282, 842, 142, 702, 422, 982, 72, 1192, 632, 352, 912, 212, 772, 492, 1052, 37, 1157, 597, 317, 877, 177, 737, 457, 1017, 107, 667, 387, 947, 247, 807, 527, 1087, 570, 1122, 562,
                        173, 733, 453, 1013, 103, 1223, 663, 383, 943, 243, 803, 523, 1083, 68, 1188, 628, 348, 908, 208, 768, 488, 1048, 138, 698, 418, 978, 278, 838, 558, 1118, 33, 1153, 593, 313, 873,
                        436, 996, 86, 1206, 646, 366, 926, 226, 786, 506, 1066, 51, 1171, 611, 331, 891, 191, 751, 471, 1031, 121, 681, 401, 961, 261, 821, 541, 1101, 16, 1136, 576, 296, 856, 156, 716,
                        95, 1215, 655, 375, 935, 235, 795, 515, 1075, 60, 1180, 620, 340, 900, 200, 760, 480, 1040, 130, 690, 410, 970, 270, 830, 550, 1110, 25, 1145, 585, 305, 865, 165, 725, 445, 1005,
                        637, 357, 917, 217, 777, 497, 1057, 42, 1162, 602, 322, 882, 182, 742, 462, 1022, 112, 672, 392, 952, 252, 812, 532, 1092, 7, 1127, 567, 287, 847, 147, 707, 427, 987, 77, 1197,
                        939, 239, 799, 519, 1079, 64, 1184, 624, 344, 904, 204, 764, 484, 1044, 134, 694, 414, 974, 274, 834, 554, 1114, 29, 1149, 589, 309, 869, 169, 729, 449, 1009, 99, 1219, 659, 379,
                        782, 502, 1062, 47, 1167, 607, 327, 887, 187, 747, 467, 1027, 117, 677, 397, 957, 257, 817, 537, 1097, 12, 1132, 572, 292, 852, 152, 712, 432, 992, 82, 1202, 642, 362, 922, 222,
                        1071, 56, 1176, 616, 336, 896, 196, 756, 476, 1036, 126, 686, 406, 966, 266, 826, 546, 1106, 21, 1141, 581, 301, 861, 161, 721, 441, 1001, 91, 1211, 651, 371, 931, 231, 791, 511,
                        1158, 598, 318, 878, 178, 738, 458, 1018, 108, 668, 388, 948, 248, 808, 528, 1088, 1085, 1123, 563, 283, 843, 143, 703, 423, 983, 73, 1193, 633, 353, 913, 213, 773, 493, 1053, 38,
                        346, 906, 206, 766, 486, 1046, 136, 696, 416, 976, 276, 836, 556, 1116, 31, 1151, 591, 311, 871, 171, 731, 451, 1011, 101, 1221, 661, 381, 941, 241, 801, 521, 1081, 66, 1186, 626,
                        189, 749, 469, 1029, 119, 679, 399, 959, 259, 819, 539, 1099, 14, 1134, 574, 294, 854, 154, 714, 434, 994, 84, 1204, 644, 364, 924, 224, 784, 504, 1064, 49, 1169, 609, 329, 889,
                        478, 1038, 128, 688, 408, 968, 268, 828, 548, 1108, 23, 1143, 583, 303, 863, 163, 723, 443, 1003, 93, 1213, 653, 373, 933, 233, 793, 513, 1073, 58, 1178, 618, 338, 898, 198, 758,
                        110, 670, 390, 950, 250, 810, 530, 1090, 5, 1125, 565, 285, 845, 145, 705, 425, 985, 75, 1195, 635, 355, 915, 215, 775, 495, 1055, 40, 1160, 600, 320, 880, 180, 740, 460, 1020,
                        412, 972, 272, 832, 552, 1112, 27, 1147, 587, 307, 867, 167, 727, 447, 1007, 97, 1217, 657, 377, 937, 237, 797, 517, 1077, 62, 1182, 622, 342, 902, 202, 762, 482, 1042, 132, 692,
                        254, 814, 534, 1094, 9, 1129, 569, 289, 849, 149, 709, 429, 989, 79, 1199, 639, 359, 919, 219, 779, 499, 1059, 44, 1164, 604, 324, 884, 184, 744, 464, 1024, 114, 674, 394, 954,
                        543, 1103, 18, 1138, 578, 298, 858, 158, 718, 438, 998, 88, 1208, 648, 368, 928, 228, 788, 508, 1068, 53, 1173, 613, 333, 893, 193, 753, 473, 1033, 123, 683, 403, 963, 263, 823,
                        0, 1120, 560, 280, 840, 140, 700, 420, 980, 70, 1190, 630, 350, 910, 210, 770, 490, 1050, 35, 1155, 595, 315, 875, 175, 735, 455, 1015, 105, 665, 385, 945, 245, 805, 525, 3
                    ],
                    // 39
                    [2, 302, 894, 154, 1338, 746, 450, 1042, 80, 1264, 672, 376, 968, 228, 820, 524, 1116, 43, 1227, 635, 339, 931, 191, 783, 487, 1079, 117, 1301, 709, 413, 1005, 265, 857, 561, 1153, 6, 1,
                        917, 177, 1361, 769, 473, 1065, 103, 1287, 695, 399, 991, 251, 843, 547, 1139, 66, 1250, 658, 362, 954, 214, 806, 510, 1102, 140, 1324, 732, 436, 1028, 288, 880, 584, 1176, 29, 1213, 621, 325,
                        1343, 751, 455, 1047, 85, 1269, 677, 381, 973, 233, 825, 529, 1121, 48, 1232, 640, 344, 936, 196, 788, 492, 1084, 122, 1306, 714, 418, 1010, 270, 862, 566, 1158, 11, 1195, 603, 307, 899, 159,
                        464, 1056, 94, 1278, 686, 390, 982, 242, 834, 538, 1130, 57, 1241, 649, 353, 945, 205, 797, 501, 1093, 131, 1315, 723, 427, 1019, 279, 871, 575, 1167, 20, 1204, 612, 316, 908, 168, 1352, 760,
                        75, 1259, 667, 371, 963, 223, 815, 519, 1111, 38, 1222, 630, 334, 926, 186, 778, 482, 1074, 112, 1296, 704, 408, 1000, 260, 852, 556, 1148, 1190, 1185, 593, 297, 889, 149, 1333, 741, 445, 1037,
                        702, 406, 998, 258, 850, 554, 1146, 73, 1257, 665, 369, 961, 221, 813, 517, 1109, 147, 1331, 739, 443, 1035, 295, 887, 591, 1183, 36, 1220, 628, 332, 924, 184, 1368, 776, 480, 1072, 110, 1294,
                        980, 240, 832, 536, 1128, 55, 1239, 647, 351, 943, 203, 795, 499, 1091, 129, 1313, 721, 425, 1017, 277, 869, 573, 1165, 18, 1202, 610, 314, 906, 166, 1350, 758, 462, 1054, 92, 1276, 684, 388,
                        841, 545, 1137, 64, 1248, 656, 360, 952, 212, 804, 508, 1100, 138, 1322, 730, 434, 1026, 286, 878, 582, 1174, 27, 1211, 619, 323, 915, 175, 1359, 767, 471, 1063, 101, 1285, 693, 397, 989, 249,
                        1119, 46, 1230, 638, 342, 934, 194, 786, 490, 1082, 120, 1304, 712, 416, 1008, 268, 860, 564, 1156, 9, 1193, 601, 305, 897, 157, 1341, 749, 453, 1045, 83, 1267, 675, 379, 971, 231, 823, 527,
                        1253, 661, 365, 957, 217, 809, 513, 1105, 143, 1327, 735, 439, 1031, 291, 883, 587, 1179, 32, 1216, 624, 328, 920, 180, 1364, 772, 476, 1068, 106, 1290, 698, 402, 994, 254, 846, 550, 1142, 69,
                        347, 939, 199, 791, 495, 1087, 125, 1309, 717, 421, 1013, 273, 865, 569, 1161, 14, 1198, 606, 310, 902, 162, 1346, 754, 458, 1050, 88, 1272, 680, 384, 976, 236, 828, 532, 1124, 51, 1235, 643,
                        208, 800, 504, 1096, 134, 1318, 726, 430, 1022, 282, 874, 578, 1170, 23, 1207, 615, 319, 911, 171, 1355, 763, 467, 1059, 97, 1281, 689, 393, 985, 245, 837, 541, 1133, 60, 1244, 652, 356, 948,
                        485, 1077, 115, 1299, 707, 411, 1003, 263, 855, 559, 1151, 4, 1188, 596, 300, 892, 152, 1336, 744, 448, 1040, 78, 1262, 670, 374, 966, 226, 818, 522, 1114, 41, 1225, 633, 337, 929, 189, 781,
                        145, 1329, 737, 441, 1033, 293, 885, 589, 1181, 34, 1218, 626, 330, 922, 182, 1366, 774, 478, 1070, 108, 1292, 700, 404, 996, 256, 848, 552, 1144, 71, 1255, 663, 367, 959, 219, 811, 515, 1107,
                        719, 423, 1015, 275, 867, 571, 1163, 16, 1200, 608, 312, 904, 164, 1348, 756, 460, 1052, 90, 1274, 682, 386, 978, 238, 830, 534, 1126, 53, 1237, 645, 349, 941, 201, 793, 497, 1089, 127, 1311,
                        1024, 284, 876, 580, 1172, 25, 1209, 617, 321, 913, 173, 1357, 765, 469, 1061, 99, 1283, 691, 395, 987, 247, 839, 543, 1135, 62, 1246, 654, 358, 950, 210, 802, 506, 1098, 136, 1320, 728, 432,
                        858, 562, 1154, 7, 1191, 599, 303, 895, 155, 1339, 747, 451, 1043, 81, 1265, 673, 377, 969, 229, 821, 525, 1117, 44, 1228, 636, 340, 932, 192, 784, 488, 1080, 118, 1302, 710, 414, 1006, 266,
                        1177, 30, 1214, 622, 326, 918, 178, 1362, 770, 474, 1066, 104, 1288, 696, 400, 992, 252, 844, 548, 1140, 67, 1251, 659, 363, 955, 215, 807, 511, 1103, 141, 1325, 733, 437, 1029, 289, 881, 585,
                        1196, 604, 308, 900, 160, 1344, 752, 456, 1048, 86, 1270, 678, 382, 974, 234, 826, 530, 1122, 49, 1233, 641, 345, 937, 197, 789, 493, 1085, 123, 1307, 715, 419, 1011, 271, 863, 567, 1159, 12,
                        317, 909, 169, 1353, 761, 465, 1057, 95, 1279, 687, 391, 983, 243, 835, 539, 1131, 58, 1242, 650, 354, 946, 206, 798, 502, 1094, 132, 1316, 724, 428, 1020, 280, 872, 576, 1168, 21, 1205, 613,
                        150, 1334, 742, 446, 1038, 76, 1260, 668, 372, 964, 224, 816, 520, 1112, 39, 1223, 631, 335, 927, 187, 779, 483, 1075, 113, 1297, 705, 409, 1001, 261, 853, 557, 1149, 598, 1186, 594, 298, 890,
                        775, 479, 1071, 109, 1293, 701, 405, 997, 257, 849, 553, 1145, 72, 1256, 664, 368, 960, 220, 812, 516, 1108, 146, 1330, 738, 442, 1034, 294, 886, 590, 1182, 35, 1219, 627, 331, 923, 183, 1367,
                        1053, 91, 1275, 683, 387, 979, 239, 831, 535, 1127, 54, 1238, 646, 350, 942, 202, 794, 498, 1090, 128, 1312, 720, 424, 1016, 276, 868, 572, 1164, 17, 1201, 609, 313, 905, 165, 1349, 757, 461,
                        1284, 692, 396, 988, 248, 840, 544, 1136, 63, 1247, 655, 359, 951, 211, 803, 507, 1099, 137, 1321, 729, 433, 1025, 285, 877, 581, 1173, 26, 1210, 618, 322, 914, 174, 1358, 766, 470, 1062, 100,
                        378, 970, 230, 822, 526, 1118, 45, 1229, 637, 341, 933, 193, 785, 489, 1081, 119, 1303, 711, 415, 1007, 267, 859, 563, 1155, 8, 1192, 600, 304, 896, 156, 1340, 748, 452, 1044, 82, 1266, 674,
                        253, 845, 549, 1141, 68, 1252, 660, 364, 956, 216, 808, 512, 1104, 142, 1326, 734, 438, 1030, 290, 882, 586, 1178, 31, 1215, 623, 327, 919, 179, 1363, 771, 475, 1067, 105, 1289, 697, 401, 993,
                        531, 1123, 50, 1234, 642, 346, 938, 198, 790, 494, 1086, 124, 1308, 716, 420, 1012, 272, 864, 568, 1160, 13, 1197, 605, 309, 901, 161, 1345, 753, 457, 1049, 87, 1271, 679, 383, 975, 235, 827,
                        59, 1243, 651, 355, 947, 207, 799, 503, 1095, 133, 1317, 725, 429, 1021, 281, 873, 577, 1169, 22, 1206, 614, 318, 910, 170, 1354, 762, 466, 1058, 96, 1280, 688, 392, 984, 244, 836, 540, 1132,
                        632, 336, 928, 188, 780, 484, 1076, 114, 1298, 706, 410, 1002, 262, 854, 558, 1150, 1147, 1187, 595, 299, 891, 151, 1335, 743, 447, 1039, 77, 1261, 669, 373, 965, 225, 817, 521, 1113, 40, 1224,
                        958, 218, 810, 514, 1106, 144, 1328, 736, 440, 1032, 292, 884, 588, 1180, 33, 1217, 625, 329, 921, 181, 1365, 773, 477, 1069, 107, 1291, 699, 403, 995, 255, 847, 551, 1143, 70, 1254, 662, 366,
                        792, 496, 1088, 126, 1310, 718, 422, 1014, 274, 866, 570, 1162, 15, 1199, 607, 311, 903, 163, 1347, 755, 459, 1051, 89, 1273, 681, 385, 977, 237, 829, 533, 1125, 52, 1236, 644, 348, 940, 200,
                        1097, 135, 1319, 727, 431, 1023, 283, 875, 579, 1171, 24, 1208, 616, 320, 912, 172, 1356, 764, 468, 1060, 98, 1282, 690, 394, 986, 246, 838, 542, 1134, 61, 1245, 653, 357, 949, 209, 801, 505,
                        1300, 708, 412, 1004, 264, 856, 560, 1152, 5, 1189, 597, 301, 893, 153, 1337, 745, 449, 1041, 79, 1263, 671, 375, 967, 227, 819, 523, 1115, 42, 1226, 634, 338, 930, 190, 782, 486, 1078, 116,
                        435, 1027, 287, 879, 583, 1175, 28, 1212, 620, 324, 916, 176, 1360, 768, 472, 1064, 102, 1286, 694, 398, 990, 250, 842, 546, 1138, 65, 1249, 657, 361, 953, 213, 805, 509, 1101, 139, 1323, 731,
                        269, 861, 565, 1157, 10, 1194, 602, 306, 898, 158, 1342, 750, 454, 1046, 84, 1268, 676, 380, 972, 232, 824, 528, 1120, 47, 1231, 639, 343, 935, 195, 787, 491, 1083, 121, 1305, 713, 417, 1009,
                        574, 1166, 19, 1203, 611, 315, 907, 167, 1351, 759, 463, 1055, 93, 1277, 685, 389, 981, 241, 833, 537, 1129, 56, 1240, 648, 352, 944, 204, 796, 500, 1092, 130, 1314, 722, 426, 1018, 278, 870,
                        0, 1184, 592, 296, 888, 148, 1332, 740, 444, 1036, 74, 1258, 666, 370, 962, 222, 814, 518, 1110, 37, 1221, 629, 333, 925, 185, 777, 481, 1073, 111, 1295, 703, 407, 999, 259, 851, 555, 3
                    ],
                    // 41
                    [2, 328, 952, 172, 1420, 796, 484, 1108, 94, 1342, 718, 406, 1030, 250, 1498, 874, 562, 1186, 55, 1303, 679, 367, 991, 211, 1459, 835, 523, 1147, 133, 1381, 757, 445, 1069, 289, 913, 601, 1225, 16, 1,
                        962, 182, 1430, 806, 494, 1118, 104, 1352, 728, 416, 1040, 260, 1508, 884, 572, 1196, 65, 1313, 689, 377, 1001, 221, 1469, 845, 533, 1157, 143, 1391, 767, 455, 1079, 299, 923, 611, 1235, 26, 1274, 650, 338,
                        1410, 786, 474, 1098, 84, 1332, 708, 396, 1020, 240, 1488, 864, 552, 1176, 45, 1293, 669, 357, 981, 201, 1449, 825, 513, 1137, 123, 1371, 747, 435, 1059, 279, 903, 591, 1215, 6, 1254, 630, 318, 942, 162,
                        499, 1123, 109, 1357, 733, 421, 1045, 265, 1513, 889, 577, 1201, 70, 1318, 694, 382, 1006, 226, 1474, 850, 538, 1162, 148, 1396, 772, 460, 1084, 304, 928, 616, 1240, 31, 1279, 655, 343, 967, 187, 1435, 811,
                        89, 1337, 713, 401, 1025, 245, 1493, 869, 557, 1181, 50, 1298, 674, 362, 986, 206, 1454, 830, 518, 1142, 128, 1376, 752, 440, 1064, 284, 908, 596, 1220, 11, 1259, 635, 323, 947, 167, 1415, 791, 479, 1103,
                        723, 411, 1035, 255, 1503, 879, 567, 1191, 60, 1308, 684, 372, 996, 216, 1464, 840, 528, 1152, 138, 1386, 762, 450, 1074, 294, 918, 606, 1230, 21, 1269, 645, 333, 957, 177, 1425, 801, 489, 1113, 99, 1347,
                        1015, 235, 1483, 859, 547, 1171, 40, 1288, 664, 352, 976, 196, 1444, 820, 508, 1132, 118, 1366, 742, 430, 1054, 274, 898, 586, 1210, 1264, 1249, 625, 313, 937, 157, 1405, 781, 469, 1093, 79, 1327, 703, 391,
                        1520, 896, 584, 1208, 77, 1325, 701, 389, 1013, 233, 1481, 857, 545, 1169, 155, 1403, 779, 467, 1091, 311, 935, 623, 1247, 38, 1286, 662, 350, 974, 194, 1442, 818, 506, 1130, 116, 1364, 740, 428, 1052, 272,
                        565, 1189, 58, 1306, 682, 370, 994, 214, 1462, 838, 526, 1150, 136, 1384, 760, 448, 1072, 292, 916, 604, 1228, 19, 1267, 643, 331, 955, 175, 1423, 799, 487, 1111, 97, 1345, 721, 409, 1033, 253, 1501, 877,
                        68, 1316, 692, 380, 1004, 224, 1472, 848, 536, 1160, 146, 1394, 770, 458, 1082, 302, 926, 614, 1238, 29, 1277, 653, 341, 965, 185, 1433, 809, 497, 1121, 107, 1355, 731, 419, 1043, 263, 1511, 887, 575, 1199,
                        672, 360, 984, 204, 1452, 828, 516, 1140, 126, 1374, 750, 438, 1062, 282, 906, 594, 1218, 9, 1257, 633, 321, 945, 165, 1413, 789, 477, 1101, 87, 1335, 711, 399, 1023, 243, 1491, 867, 555, 1179, 48, 1296,
                        1009, 229, 1477, 853, 541, 1165, 151, 1399, 775, 463, 1087, 307, 931, 619, 1243, 34, 1282, 658, 346, 970, 190, 1438, 814, 502, 1126, 112, 1360, 736, 424, 1048, 268, 1516, 892, 580, 1204, 73, 1321, 697, 385,
                        1457, 833, 521, 1145, 131, 1379, 755, 443, 1067, 287, 911, 599, 1223, 14, 1262, 638, 326, 950, 170, 1418, 794, 482, 1106, 92, 1340, 716, 404, 1028, 248, 1496, 872, 560, 1184, 53, 1301, 677, 365, 989, 209,
                        531, 1155, 141, 1389, 765, 453, 1077, 297, 921, 609, 1233, 24, 1272, 648, 336, 960, 180, 1428, 804, 492, 1116, 102, 1350, 726, 414, 1038, 258, 1506, 882, 570, 1194, 63, 1311, 687, 375, 999, 219, 1467, 843,
                        121, 1369, 745, 433, 1057, 277, 901, 589, 1213, 4, 1252, 628, 316, 940, 160, 1408, 784, 472, 1096, 82, 1330, 706, 394, 1018, 238, 1486, 862, 550, 1174, 43, 1291, 667, 355, 979, 199, 1447, 823, 511, 1135,
                        777, 465, 1089, 309, 933, 621, 1245, 36, 1284, 660, 348, 972, 192, 1440, 816, 504, 1128, 114, 1362, 738, 426, 1050, 270, 1518, 894, 582, 1206, 75, 1323, 699, 387, 1011, 231, 1479, 855, 543, 1167, 153, 1401,
                        1070, 290, 914, 602, 1226, 17, 1265, 641, 329, 953, 173, 1421, 797, 485, 1109, 95, 1343, 719, 407, 1031, 251, 1499, 875, 563, 1187, 56, 1304, 680, 368, 992, 212, 1460, 836, 524, 1148, 134, 1382, 758, 446,
                        924, 612, 1236, 27, 1275, 651, 339, 963, 183, 1431, 807, 495, 1119, 105, 1353, 729, 417, 1041, 261, 1509, 885, 573, 1197, 66, 1314, 690, 378, 1002, 222, 1470, 846, 534, 1158, 144, 1392, 768, 456, 1080, 300,
                        1216, 7, 1255, 631, 319, 943, 163, 1411, 787, 475, 1099, 85, 1333, 709, 397, 1021, 241, 1489, 865, 553, 1177, 46, 1294, 670, 358, 982, 202, 1450, 826, 514, 1138, 124, 1372, 748, 436, 1060, 280, 904, 592,
                        1280, 656, 344, 968, 188, 1436, 812, 500, 1124, 110, 1358, 734, 422, 1046, 266, 1514, 890, 578, 1202, 71, 1319, 695, 383, 1007, 227, 1475, 851, 539, 1163, 149, 1397, 773, 461, 1085, 305, 929, 617, 1241, 32,
                        324, 948, 168, 1416, 792, 480, 1104, 90, 1338, 714, 402, 1026, 246, 1494, 870, 558, 1182, 51, 1299, 675, 363, 987, 207, 1455, 831, 519, 1143, 129, 1377, 753, 441, 1065, 285, 909, 597, 1221, 12, 1260, 636,
                        178, 1426, 802, 490, 1114, 100, 1348, 724, 412, 1036, 256, 1504, 880, 568, 1192, 61, 1309, 685, 373, 997, 217, 1465, 841, 529, 1153, 139, 1387, 763, 451, 1075, 295, 919, 607, 1231, 22, 1270, 646, 334, 958,
                        782, 470, 1094, 80, 1328, 704, 392, 1016, 236, 1484, 860, 548, 1172, 41, 1289, 665, 353, 977, 197, 1445, 821, 509, 1133, 119, 1367, 743, 431, 1055, 275, 899, 587, 1211, 640, 1250, 626, 314, 938, 158, 1406,
                        1129, 115, 1363, 739, 427, 1051, 271, 1519, 895, 583, 1207, 76, 1324, 700, 388, 1012, 232, 1480, 856, 544, 1168, 154, 1402, 778, 466, 1090, 310, 934, 622, 1246, 37, 1285, 661, 349, 973, 193, 1441, 817, 505,
                        1344, 720, 408, 1032, 252, 1500, 876, 564, 1188, 57, 1305, 681, 369, 993, 213, 1461, 837, 525, 1149, 135, 1383, 759, 447, 1071, 291, 915, 603, 1227, 18, 1266, 642, 330, 954, 174, 1422, 798, 486, 1110, 96,
                        418, 1042, 262, 1510, 886, 574, 1198, 67, 1315, 691, 379, 1003, 223, 1471, 847, 535, 1159, 145, 1393, 769, 457, 1081, 301, 925, 613, 1237, 28, 1276, 652, 340, 964, 184, 1432, 808, 496, 1120, 106, 1354, 730,
                        242, 1490, 866, 554, 1178, 47, 1295, 671, 359, 983, 203, 1451, 827, 515, 1139, 125, 1373, 749, 437, 1061, 281, 905, 593, 1217, 8, 1256, 632, 320, 944, 164, 1412, 788, 476, 1100, 86, 1334, 710, 398, 1022,
                        891, 579, 1203, 72, 1320, 696, 384, 1008, 228, 1476, 852, 540, 1164, 150, 1398, 774, 462, 1086, 306, 930, 618, 1242, 33, 1281, 657, 345, 969, 189, 1437, 813, 501, 1125, 111, 1359, 735, 423, 1047, 267, 1515,
                        1183, 52, 1300, 676, 364, 988, 208, 1456, 832, 520, 1144, 130, 1378, 754, 442, 1066, 286, 910, 598, 1222, 13, 1261, 637, 325, 949, 169, 1417, 793, 481, 1105, 91, 1339, 715, 403, 1027, 247, 1495, 871, 559,
                        1310, 686, 374, 998, 218, 1466, 842, 530, 1154, 140, 1388, 764, 452, 1076, 296, 920, 608, 1232, 23, 1271, 647, 335, 959, 179, 1427, 803, 491, 1115, 101, 1349, 725, 413, 1037, 257, 1505, 881, 569, 1193, 62,
                        354, 978, 198, 1446, 822, 510, 1134, 120, 1368, 744, 432, 1056, 276, 900, 588, 1212, 1209, 1251, 627, 315, 939, 159, 1407, 783, 471, 1095, 81, 1329, 705, 393, 1017, 237, 1485, 861, 549, 1173, 42, 1290, 666,
                        230, 1478, 854, 542, 1166, 152, 1400, 776, 464, 1088, 308, 932, 620, 1244, 35, 1283, 659, 347, 971, 191, 1439, 815, 503, 1127, 113, 1361, 737, 425, 1049, 269, 1517, 893, 581, 1205, 74, 1322, 698, 386, 1010,
                        834, 522, 1146, 132, 1380, 756, 444, 1068, 288, 912, 600, 1224, 15, 1263, 639, 327, 951, 171, 1419, 795, 483, 1107, 93, 1341, 717, 405, 1029, 249, 1497, 873, 561, 1185, 54, 1302, 678, 366, 990, 210, 1458,
                        1156, 142, 1390, 766, 454, 1078, 298, 922, 610, 1234, 25, 1273, 649, 337, 961, 181, 1429, 805, 493, 1117, 103, 1351, 727, 415, 1039, 259, 1507, 883, 571, 1195, 64, 1312, 688, 376, 1000, 220, 1468, 844, 532,
                        1370, 746, 434, 1058, 278, 902, 590, 1214, 5, 1253, 629, 317, 941, 161, 1409, 785, 473, 1097, 83, 1331, 707, 395, 1019, 239, 1487, 863, 551, 1175, 44, 1292, 668, 356, 980, 200, 1448, 824, 512, 1136, 122,
                        459, 1083, 303, 927, 615, 1239, 30, 1278, 654, 342, 966, 186, 1434, 810, 498, 1122, 108, 1356, 732, 420, 1044, 264, 1512, 888, 576, 1200, 69, 1317, 693, 381, 1005, 225, 1473, 849, 537, 1161, 147, 1395, 771,
                        283, 907, 595, 1219, 10, 1258, 634, 322, 946, 166, 1414, 790, 478, 1102, 88, 1336, 712, 400, 1024, 244, 1492, 868, 556, 1180, 49, 1297, 673, 361, 985, 205, 1453, 829, 517, 1141, 127, 1375, 751, 439, 1063,
                        605, 1229, 20, 1268, 644, 332, 956, 176, 1424, 800, 488, 1112, 98, 1346, 722, 410, 1034, 254, 1502, 878, 566, 1190, 59, 1307, 683, 371, 995, 215, 1463, 839, 527, 1151, 137, 1385, 761, 449, 1073, 293, 917,
                        0, 1248, 624, 312, 936, 156, 1404, 780, 468, 1092, 78, 1326, 702, 390, 1014, 234, 1482, 858, 546, 1170, 39, 1287, 663, 351, 975, 195, 1443, 819, 507, 1131, 117, 1365, 741, 429, 1053, 273, 897, 585, 3
                    ],
                    // 43
                    [2, 332, 1644, 988, 168, 1480, 824, 496, 1152, 86, 1398, 742, 414, 1070, 250, 1562, 906, 578, 1234, 45, 1357, 701, 373, 1029, 209, 1521, 865, 537, 1193, 127, 1439, 783, 455, 1111, 291, 1603, 947, 619, 1275, 4, 1,
                        1677, 1021, 201, 1513, 857, 529, 1185, 119, 1431, 775, 447, 1103, 283, 1595, 939, 611, 1267, 78, 1390, 734, 406, 1062, 242, 1554, 898, 570, 1226, 160, 1472, 816, 488, 1144, 324, 1636, 980, 652, 1308, 37, 1349, 693, 365,
                        181, 1493, 837, 509, 1165, 99, 1411, 755, 427, 1083, 263, 1575, 919, 591, 1247, 58, 1370, 714, 386, 1042, 222, 1534, 878, 550, 1206, 140, 1452, 796, 468, 1124, 304, 1616, 960, 632, 1288, 17, 1329, 673, 345, 1657, 1001,
                        847, 519, 1175, 109, 1421, 765, 437, 1093, 273, 1585, 929, 601, 1257, 68, 1380, 724, 396, 1052, 232, 1544, 888, 560, 1216, 150, 1462, 806, 478, 1134, 314, 1626, 970, 642, 1298, 27, 1339, 683, 355, 1667, 1011, 191, 1503,
                        1155, 89, 1401, 745, 417, 1073, 253, 1565, 909, 581, 1237, 48, 1360, 704, 376, 1032, 212, 1524, 868, 540, 1196, 130, 1442, 786, 458, 1114, 294, 1606, 950, 622, 1278, 7, 1319, 663, 335, 1647, 991, 171, 1483, 827, 499,
                        1426, 770, 442, 1098, 278, 1590, 934, 606, 1262, 73, 1385, 729, 401, 1057, 237, 1549, 893, 565, 1221, 155, 1467, 811, 483, 1139, 319, 1631, 975, 647, 1303, 32, 1344, 688, 360, 1672, 1016, 196, 1508, 852, 524, 1180, 114,
                        422, 1078, 258, 1570, 914, 586, 1242, 53, 1365, 709, 381, 1037, 217, 1529, 873, 545, 1201, 135, 1447, 791, 463, 1119, 299, 1611, 955, 627, 1283, 12, 1324, 668, 340, 1652, 996, 176, 1488, 832, 504, 1160, 94, 1406, 750,
                        268, 1580, 924, 596, 1252, 63, 1375, 719, 391, 1047, 227, 1539, 883, 555, 1211, 145, 1457, 801, 473, 1129, 309, 1621, 965, 637, 1293, 22, 1334, 678, 350, 1662, 1006, 186, 1498, 842, 514, 1170, 104, 1416, 760, 432, 1088,
                        903, 575, 1231, 42, 1354, 698, 370, 1026, 206, 1518, 862, 534, 1190, 124, 1436, 780, 452, 1108, 288, 1600, 944, 616, 1272, 1316, 1313, 657, 329, 1641, 985, 165, 1477, 821, 493, 1149, 83, 1395, 739, 411, 1067, 247, 1559,
                        1270, 81, 1393, 737, 409, 1065, 245, 1557, 901, 573, 1229, 163, 1475, 819, 491, 1147, 327, 1639, 983, 655, 1311, 40, 1352, 696, 368, 1680, 1024, 204, 1516, 860, 532, 1188, 122, 1434, 778, 450, 1106, 286, 1598, 942, 614,
                        1373, 717, 389, 1045, 225, 1537, 881, 553, 1209, 143, 1455, 799, 471, 1127, 307, 1619, 963, 635, 1291, 20, 1332, 676, 348, 1660, 1004, 184, 1496, 840, 512, 1168, 102, 1414, 758, 430, 1086, 266, 1578, 922, 594, 1250, 61,
                        399, 1055, 235, 1547, 891, 563, 1219, 153, 1465, 809, 481, 1137, 317, 1629, 973, 645, 1301, 30, 1342, 686, 358, 1670, 1014, 194, 1506, 850, 522, 1178, 112, 1424, 768, 440, 1096, 276, 1588, 932, 604, 1260, 71, 1383, 727,
                        215, 1527, 871, 543, 1199, 133, 1445, 789, 461, 1117, 297, 1609, 953, 625, 1281, 10, 1322, 666, 338, 1650, 994, 174, 1486, 830, 502, 1158, 92, 1404, 748, 420, 1076, 256, 1568, 912, 584, 1240, 51, 1363, 707, 379, 1035,
                        896, 568, 1224, 158, 1470, 814, 486, 1142, 322, 1634, 978, 650, 1306, 35, 1347, 691, 363, 1675, 1019, 199, 1511, 855, 527, 1183, 117, 1429, 773, 445, 1101, 281, 1593, 937, 609, 1265, 76, 1388, 732, 404, 1060, 240, 1552,
                        1204, 138, 1450, 794, 466, 1122, 302, 1614, 958, 630, 1286, 15, 1327, 671, 343, 1655, 999, 179, 1491, 835, 507, 1163, 97, 1409, 753, 425, 1081, 261, 1573, 917, 589, 1245, 56, 1368, 712, 384, 1040, 220, 1532, 876, 548,
                        1460, 804, 476, 1132, 312, 1624, 968, 640, 1296, 25, 1337, 681, 353, 1665, 1009, 189, 1501, 845, 517, 1173, 107, 1419, 763, 435, 1091, 271, 1583, 927, 599, 1255, 66, 1378, 722, 394, 1050, 230, 1542, 886, 558, 1214, 148,
                        456, 1112, 292, 1604, 948, 620, 1276, 5, 1317, 661, 333, 1645, 989, 169, 1481, 825, 497, 1153, 87, 1399, 743, 415, 1071, 251, 1563, 907, 579, 1235, 46, 1358, 702, 374, 1030, 210, 1522, 866, 538, 1194, 128, 1440, 784,
                        325, 1637, 981, 653, 1309, 38, 1350, 694, 366, 1678, 1022, 202, 1514, 858, 530, 1186, 120, 1432, 776, 448, 1104, 284, 1596, 940, 612, 1268, 79, 1391, 735, 407, 1063, 243, 1555, 899, 571, 1227, 161, 1473, 817, 489, 1145,
                        961, 633, 1289, 18, 1330, 674, 346, 1658, 1002, 182, 1494, 838, 510, 1166, 100, 1412, 756, 428, 1084, 264, 1576, 920, 592, 1248, 59, 1371, 715, 387, 1043, 223, 1535, 879, 551, 1207, 141, 1453, 797, 469, 1125, 305, 1617,
                        1299, 28, 1340, 684, 356, 1668, 1012, 192, 1504, 848, 520, 1176, 110, 1422, 766, 438, 1094, 274, 1586, 930, 602, 1258, 69, 1381, 725, 397, 1053, 233, 1545, 889, 561, 1217, 151, 1463, 807, 479, 1135, 315, 1627, 971, 643,
                        1320, 664, 336, 1648, 992, 172, 1484, 828, 500, 1156, 90, 1402, 746, 418, 1074, 254, 1566, 910, 582, 1238, 49, 1361, 705, 377, 1033, 213, 1525, 869, 541, 1197, 131, 1443, 787, 459, 1115, 295, 1607, 951, 623, 1279, 8,
                        361, 1673, 1017, 197, 1509, 853, 525, 1181, 115, 1427, 771, 443, 1099, 279, 1591, 935, 607, 1263, 74, 1386, 730, 402, 1058, 238, 1550, 894, 566, 1222, 156, 1468, 812, 484, 1140, 320, 1632, 976, 648, 1304, 33, 1345, 689,
                        997, 177, 1489, 833, 505, 1161, 95, 1407, 751, 423, 1079, 259, 1571, 915, 587, 1243, 54, 1366, 710, 382, 1038, 218, 1530, 874, 546, 1202, 136, 1448, 792, 464, 1120, 300, 1612, 956, 628, 1284, 13, 1325, 669, 341, 1653,
                        1499, 843, 515, 1171, 105, 1417, 761, 433, 1089, 269, 1581, 925, 597, 1253, 64, 1376, 720, 392, 1048, 228, 1540, 884, 556, 1212, 146, 1458, 802, 474, 1130, 310, 1622, 966, 638, 1294, 23, 1335, 679, 351, 1663, 1007, 187,
                        494, 1150, 84, 1396, 740, 412, 1068, 248, 1560, 904, 576, 1232, 43, 1355, 699, 371, 1027, 207, 1519, 863, 535, 1191, 125, 1437, 781, 453, 1109, 289, 1601, 945, 617, 1273, 660, 1314, 658, 330, 1642, 986, 166, 1478, 822,
                        121, 1433, 777, 449, 1105, 285, 1597, 941, 613, 1269, 80, 1392, 736, 408, 1064, 244, 1556, 900, 572, 1228, 162, 1474, 818, 490, 1146, 326, 1638, 982, 654, 1310, 39, 1351, 695, 367, 1679, 1023, 203, 1515, 859, 531, 1187,
                        757, 429, 1085, 265, 1577, 921, 593, 1249, 60, 1372, 716, 388, 1044, 224, 1536, 880, 552, 1208, 142, 1454, 798, 470, 1126, 306, 1618, 962, 634, 1290, 19, 1331, 675, 347, 1659, 1003, 183, 1495, 839, 511, 1167, 101, 1413,
                        1095, 275, 1587, 931, 603, 1259, 70, 1382, 726, 398, 1054, 234, 1546, 890, 562, 1218, 152, 1464, 808, 480, 1136, 316, 1628, 972, 644, 1300, 29, 1341, 685, 357, 1669, 1013, 193, 1505, 849, 521, 1177, 111, 1423, 767, 439,
                        1567, 911, 583, 1239, 50, 1362, 706, 378, 1034, 214, 1526, 870, 542, 1198, 132, 1444, 788, 460, 1116, 296, 1608, 952, 624, 1280, 9, 1321, 665, 337, 1649, 993, 173, 1485, 829, 501, 1157, 91, 1403, 747, 419, 1075, 255,
                        608, 1264, 75, 1387, 731, 403, 1059, 239, 1551, 895, 567, 1223, 157, 1469, 813, 485, 1141, 321, 1633, 977, 649, 1305, 34, 1346, 690, 362, 1674, 1018, 198, 1510, 854, 526, 1182, 116, 1428, 772, 444, 1100, 280, 1592, 936,
                        55, 1367, 711, 383, 1039, 219, 1531, 875, 547, 1203, 137, 1449, 793, 465, 1121, 301, 1613, 957, 629, 1285, 14, 1326, 670, 342, 1654, 998, 178, 1490, 834, 506, 1162, 96, 1408, 752, 424, 1080, 260, 1572, 916, 588, 1244,
                        721, 393, 1049, 229, 1541, 885, 557, 1213, 147, 1459, 803, 475, 1131, 311, 1623, 967, 639, 1295, 24, 1336, 680, 352, 1664, 1008, 188, 1500, 844, 516, 1172, 106, 1418, 762, 434, 1090, 270, 1582, 926, 598, 1254, 65, 1377,
                        1028, 208, 1520, 864, 536, 1192, 126, 1438, 782, 454, 1110, 290, 1602, 946, 618, 1274, 1271, 1315, 659, 331, 1643, 987, 167, 1479, 823, 495, 1151, 85, 1397, 741, 413, 1069, 249, 1561, 905, 577, 1233, 44, 1356, 700, 372,
                        1553, 897, 569, 1225, 159, 1471, 815, 487, 1143, 323, 1635, 979, 651, 1307, 36, 1348, 692, 364, 1676, 1020, 200, 1512, 856, 528, 1184, 118, 1430, 774, 446, 1102, 282, 1594, 938, 610, 1266, 77, 1389, 733, 405, 1061, 241,
                        549, 1205, 139, 1451, 795, 467, 1123, 303, 1615, 959, 631, 1287, 16, 1328, 672, 344, 1656, 1000, 180, 1492, 836, 508, 1164, 98, 1410, 754, 426, 1082, 262, 1574, 918, 590, 1246, 57, 1369, 713, 385, 1041, 221, 1533, 877,
                        149, 1461, 805, 477, 1133, 313, 1625, 969, 641, 1297, 26, 1338, 682, 354, 1666, 1010, 190, 1502, 846, 518, 1174, 108, 1420, 764, 436, 1092, 272, 1584, 928, 600, 1256, 67, 1379, 723, 395, 1051, 231, 1543, 887, 559, 1215,
                        785, 457, 1113, 293, 1605, 949, 621, 1277, 6, 1318, 662, 334, 1646, 990, 170, 1482, 826, 498, 1154, 88, 1400, 744, 416, 1072, 252, 1564, 908, 580, 1236, 47, 1359, 703, 375, 1031, 211, 1523, 867, 539, 1195, 129, 1441,
                        1138, 318, 1630, 974, 646, 1302, 31, 1343, 687, 359, 1671, 1015, 195, 1507, 851, 523, 1179, 113, 1425, 769, 441, 1097, 277, 1589, 933, 605, 1261, 72, 1384, 728, 400, 1056, 236, 1548, 892, 564, 1220, 154, 1466, 810, 482,
                        1610, 954, 626, 1282, 11, 1323, 667, 339, 1651, 995, 175, 1487, 831, 503, 1159, 93, 1405, 749, 421, 1077, 257, 1569, 913, 585, 1241, 52, 1364, 708, 380, 1036, 216, 1528, 872, 544, 1200, 134, 1446, 790, 462, 1118, 298,
                        636, 1292, 21, 1333, 677, 349, 1661, 1005, 185, 1497, 841, 513, 1169, 103, 1415, 759, 431, 1087, 267, 1579, 923, 595, 1251, 62, 1374, 718, 390, 1046, 226, 1538, 882, 554, 1210, 144, 1456, 800, 472, 1128, 308, 1620, 964,
                        0, 1312, 656, 328, 1640, 984, 164, 1476, 820, 492, 1148, 82, 1394, 738, 410, 1066, 246, 1558, 902, 574, 1230, 41, 1353, 697, 369, 1025, 205, 1517, 861, 533, 1189, 123, 1435, 779, 451, 1107, 287, 1599, 943, 615, 3
                    ],
                    // 45
                    [2, 359, 1735, 1047, 187, 1563, 875, 531, 1219, 101, 1477, 789, 445, 1821, 1133, 273, 1649, 961, 617, 1305, 58, 1434, 746, 402, 1778, 1090, 230, 1606, 918, 574, 1262, 144, 1520, 832, 488, 1176, 316, 1692, 1004, 660, 1348, 15, 1,
                        1746, 1058, 198, 1574, 886, 542, 1230, 112, 1488, 800, 456, 1832, 1144, 284, 1660, 972, 628, 1316, 69, 1445, 757, 413, 1789, 1101, 241, 1617, 929, 585, 1273, 155, 1531, 843, 499, 1187, 327, 1703, 1015, 671, 1359, 26, 1402, 714, 370,
                        176, 1552, 864, 520, 1208, 90, 1466, 778, 434, 1810, 1122, 262, 1638, 950, 606, 1294, 47, 1423, 735, 391, 1767, 1079, 219, 1595, 907, 563, 1251, 133, 1509, 821, 477, 1165, 305, 1681, 993, 649, 1337, 4, 1380, 692, 348, 1724, 1036,
                        899, 555, 1243, 125, 1501, 813, 469, 1845, 1157, 297, 1673, 985, 641, 1329, 82, 1458, 770, 426, 1802, 1114, 254, 1630, 942, 598, 1286, 168, 1544, 856, 512, 1200, 340, 1716, 1028, 684, 1372, 39, 1415, 727, 383, 1759, 1071, 211, 1587,
                        1222, 104, 1480, 792, 448, 1824, 1136, 276, 1652, 964, 620, 1308, 61, 1437, 749, 405, 1781, 1093, 233, 1609, 921, 577, 1265, 147, 1523, 835, 491, 1179, 319, 1695, 1007, 663, 1351, 18, 1394, 706, 362, 1738, 1050, 190, 1566, 878, 534,
                        1491, 803, 459, 1835, 1147, 287, 1663, 975, 631, 1319, 72, 1448, 760, 416, 1792, 1104, 244, 1620, 932, 588, 1276, 158, 1534, 846, 502, 1190, 330, 1706, 1018, 674, 1362, 29, 1405, 717, 373, 1749, 1061, 201, 1577, 889, 545, 1233, 115,
                        437, 1813, 1125, 265, 1641, 953, 609, 1297, 50, 1426, 738, 394, 1770, 1082, 222, 1598, 910, 566, 1254, 136, 1512, 824, 480, 1168, 308, 1684, 996, 652, 1340, 7, 1383, 695, 351, 1727, 1039, 179, 1555, 867, 523, 1211, 93, 1469, 781,
                        1152, 292, 1668, 980, 636, 1324, 77, 1453, 765, 421, 1797, 1109, 249, 1625, 937, 593, 1281, 163, 1539, 851, 507, 1195, 335, 1711, 1023, 679, 1367, 34, 1410, 722, 378, 1754, 1066, 206, 1582, 894, 550, 1238, 120, 1496, 808, 464, 1840,
                        1646, 958, 614, 1302, 55, 1431, 743, 399, 1775, 1087, 227, 1603, 915, 571, 1259, 141, 1517, 829, 485, 1173, 313, 1689, 1001, 657, 1345, 12, 1388, 700, 356, 1732, 1044, 184, 1560, 872, 528, 1216, 98, 1474, 786, 442, 1818, 1130, 270,
                        625, 1313, 66, 1442, 754, 410, 1786, 1098, 238, 1614, 926, 582, 1270, 152, 1528, 840, 496, 1184, 324, 1700, 1012, 668, 1356, 23, 1399, 711, 367, 1743, 1055, 195, 1571, 883, 539, 1227, 109, 1485, 797, 453, 1829, 1141, 281, 1657, 969,
                        44, 1420, 732, 388, 1764, 1076, 216, 1592, 904, 560, 1248, 130, 1506, 818, 474, 1162, 302, 1678, 990, 646, 1334, 1391, 1377, 689, 345, 1721, 1033, 173, 1549, 861, 517, 1205, 87, 1463, 775, 431, 1807, 1119, 259, 1635, 947, 603, 1291,
                        773, 429, 1805, 1117, 257, 1633, 945, 601, 1289, 171, 1547, 859, 515, 1203, 343, 1719, 1031, 687, 1375, 42, 1418, 730, 386, 1762, 1074, 214, 1590, 902, 558, 1246, 128, 1504, 816, 472, 1848, 1160, 300, 1676, 988, 644, 1332, 85, 1461,
                        1784, 1096, 236, 1612, 924, 580, 1268, 150, 1526, 838, 494, 1182, 322, 1698, 1010, 666, 1354, 21, 1397, 709, 365, 1741, 1053, 193, 1569, 881, 537, 1225, 107, 1483, 795, 451, 1827, 1139, 279, 1655, 967, 623, 1311, 64, 1440, 752, 408,
                        247, 1623, 935, 591, 1279, 161, 1537, 849, 505, 1193, 333, 1709, 1021, 677, 1365, 32, 1408, 720, 376, 1752, 1064, 204, 1580, 892, 548, 1236, 118, 1494, 806, 462, 1838, 1150, 290, 1666, 978, 634, 1322, 75, 1451, 763, 419, 1795, 1107,
                        913, 569, 1257, 139, 1515, 827, 483, 1171, 311, 1687, 999, 655, 1343, 10, 1386, 698, 354, 1730, 1042, 182, 1558, 870, 526, 1214, 96, 1472, 784, 440, 1816, 1128, 268, 1644, 956, 612, 1300, 53, 1429, 741, 397, 1773, 1085, 225, 1601,
                        1284, 166, 1542, 854, 510, 1198, 338, 1714, 1026, 682, 1370, 37, 1413, 725, 381, 1757, 1069, 209, 1585, 897, 553, 1241, 123, 1499, 811, 467, 1843, 1155, 295, 1671, 983, 639, 1327, 80, 1456, 768, 424, 1800, 1112, 252, 1628, 940, 596,
                        1521, 833, 489, 1177, 317, 1693, 1005, 661, 1349, 16, 1392, 704, 360, 1736, 1048, 188, 1564, 876, 532, 1220, 102, 1478, 790, 446, 1822, 1134, 274, 1650, 962, 618, 1306, 59, 1435, 747, 403, 1779, 1091, 231, 1607, 919, 575, 1263, 145,
                        500, 1188, 328, 1704, 1016, 672, 1360, 27, 1403, 715, 371, 1747, 1059, 199, 1575, 887, 543, 1231, 113, 1489, 801, 457, 1833, 1145, 285, 1661, 973, 629, 1317, 70, 1446, 758, 414, 1790, 1102, 242, 1618, 930, 586, 1274, 156, 1532, 844,
                        306, 1682, 994, 650, 1338, 5, 1381, 693, 349, 1725, 1037, 177, 1553, 865, 521, 1209, 91, 1467, 779, 435, 1811, 1123, 263, 1639, 951, 607, 1295, 48, 1424, 736, 392, 1768, 1080, 220, 1596, 908, 564, 1252, 134, 1510, 822, 478, 1166,
                        1029, 685, 1373, 40, 1416, 728, 384, 1760, 1072, 212, 1588, 900, 556, 1244, 126, 1502, 814, 470, 1846, 1158, 298, 1674, 986, 642, 1330, 83, 1459, 771, 427, 1803, 1115, 255, 1631, 943, 599, 1287, 169, 1545, 857, 513, 1201, 341, 1717,
                        1352, 19, 1395, 707, 363, 1739, 1051, 191, 1567, 879, 535, 1223, 105, 1481, 793, 449, 1825, 1137, 277, 1653, 965, 621, 1309, 62, 1438, 750, 406, 1782, 1094, 234, 1610, 922, 578, 1266, 148, 1524, 836, 492, 1180, 320, 1696, 1008, 664,
                        1406, 718, 374, 1750, 1062, 202, 1578, 890, 546, 1234, 116, 1492, 804, 460, 1836, 1148, 288, 1664, 976, 632, 1320, 73, 1449, 761, 417, 1793, 1105, 245, 1621, 933, 589, 1277, 159, 1535, 847, 503, 1191, 331, 1707, 1019, 675, 1363, 30,
                        352, 1728, 1040, 180, 1556, 868, 524, 1212, 94, 1470, 782, 438, 1814, 1126, 266, 1642, 954, 610, 1298, 51, 1427, 739, 395, 1771, 1083, 223, 1599, 911, 567, 1255, 137, 1513, 825, 481, 1169, 309, 1685, 997, 653, 1341, 8, 1384, 696,
                        1067, 207, 1583, 895, 551, 1239, 121, 1497, 809, 465, 1841, 1153, 293, 1669, 981, 637, 1325, 78, 1454, 766, 422, 1798, 1110, 250, 1626, 938, 594, 1282, 164, 1540, 852, 508, 1196, 336, 1712, 1024, 680, 1368, 35, 1411, 723, 379, 1755,
                        1561, 873, 529, 1217, 99, 1475, 787, 443, 1819, 1131, 271, 1647, 959, 615, 1303, 56, 1432, 744, 400, 1776, 1088, 228, 1604, 916, 572, 1260, 142, 1518, 830, 486, 1174, 314, 1690, 1002, 658, 1346, 13, 1389, 701, 357, 1733, 1045, 185,
                        540, 1228, 110, 1486, 798, 454, 1830, 1142, 282, 1658, 970, 626, 1314, 67, 1443, 755, 411, 1787, 1099, 239, 1615, 927, 583, 1271, 153, 1529, 841, 497, 1185, 325, 1701, 1013, 669, 1357, 24, 1400, 712, 368, 1744, 1056, 196, 1572, 884,
                        88, 1464, 776, 432, 1808, 1120, 260, 1636, 948, 604, 1292, 45, 1421, 733, 389, 1765, 1077, 217, 1593, 905, 561, 1249, 131, 1507, 819, 475, 1163, 303, 1679, 991, 647, 1335, 703, 1378, 690, 346, 1722, 1034, 174, 1550, 862, 518, 1206,
                        815, 471, 1847, 1159, 299, 1675, 987, 643, 1331, 84, 1460, 772, 428, 1804, 1116, 256, 1632, 944, 600, 1288, 170, 1546, 858, 514, 1202, 342, 1718, 1030, 686, 1374, 41, 1417, 729, 385, 1761, 1073, 213, 1589, 901, 557, 1245, 127, 1503,
                        1826, 1138, 278, 1654, 966, 622, 1310, 63, 1439, 751, 407, 1783, 1095, 235, 1611, 923, 579, 1267, 149, 1525, 837, 493, 1181, 321, 1697, 1009, 665, 1353, 20, 1396, 708, 364, 1740, 1052, 192, 1568, 880, 536, 1224, 106, 1482, 794, 450,
                        289, 1665, 977, 633, 1321, 74, 1450, 762, 418, 1794, 1106, 246, 1622, 934, 590, 1278, 160, 1536, 848, 504, 1192, 332, 1708, 1020, 676, 1364, 31, 1407, 719, 375, 1751, 1063, 203, 1579, 891, 547, 1235, 117, 1493, 805, 461, 1837, 1149,
                        955, 611, 1299, 52, 1428, 740, 396, 1772, 1084, 224, 1600, 912, 568, 1256, 138, 1514, 826, 482, 1170, 310, 1686, 998, 654, 1342, 9, 1385, 697, 353, 1729, 1041, 181, 1557, 869, 525, 1213, 95, 1471, 783, 439, 1815, 1127, 267, 1643,
                        1326, 79, 1455, 767, 423, 1799, 1111, 251, 1627, 939, 595, 1283, 165, 1541, 853, 509, 1197, 337, 1713, 1025, 681, 1369, 36, 1412, 724, 380, 1756, 1068, 208, 1584, 896, 552, 1240, 122, 1498, 810, 466, 1842, 1154, 294, 1670, 982, 638,
                        1433, 745, 401, 1777, 1089, 229, 1605, 917, 573, 1261, 143, 1519, 831, 487, 1175, 315, 1691, 1003, 659, 1347, 14, 1390, 702, 358, 1734, 1046, 186, 1562, 874, 530, 1218, 100, 1476, 788, 444, 1820, 1132, 272, 1648, 960, 616, 1304, 57,
                        412, 1788, 1100, 240, 1616, 928, 584, 1272, 154, 1530, 842, 498, 1186, 326, 1702, 1014, 670, 1358, 25, 1401, 713, 369, 1745, 1057, 197, 1573, 885, 541, 1229, 111, 1487, 799, 455, 1831, 1143, 283, 1659, 971, 627, 1315, 68, 1444, 756,
                        1078, 218, 1594, 906, 562, 1250, 132, 1508, 820, 476, 1164, 304, 1680, 992, 648, 1336, 1333, 1379, 691, 347, 1723, 1035, 175, 1551, 863, 519, 1207, 89, 1465, 777, 433, 1809, 1121, 261, 1637, 949, 605, 1293, 46, 1422, 734, 390, 1766,
                        1629, 941, 597, 1285, 167, 1543, 855, 511, 1199, 339, 1715, 1027, 683, 1371, 38, 1414, 726, 382, 1758, 1070, 210, 1586, 898, 554, 1242, 124, 1500, 812, 468, 1844, 1156, 296, 1672, 984, 640, 1328, 81, 1457, 769, 425, 1801, 1113, 253,
                        576, 1264, 146, 1522, 834, 490, 1178, 318, 1694, 1006, 662, 1350, 17, 1393, 705, 361, 1737, 1049, 189, 1565, 877, 533, 1221, 103, 1479, 791, 447, 1823, 1135, 275, 1651, 963, 619, 1307, 60, 1436, 748, 404, 1780, 1092, 232, 1608, 920,
                        157, 1533, 845, 501, 1189, 329, 1705, 1017, 673, 1361, 28, 1404, 716, 372, 1748, 1060, 200, 1576, 888, 544, 1232, 114, 1490, 802, 458, 1834, 1146, 286, 1662, 974, 630, 1318, 71, 1447, 759, 415, 1791, 1103, 243, 1619, 931, 587, 1275,
                        823, 479, 1167, 307, 1683, 995, 651, 1339, 6, 1382, 694, 350, 1726, 1038, 178, 1554, 866, 522, 1210, 92, 1468, 780, 436, 1812, 1124, 264, 1640, 952, 608, 1296, 49, 1425, 737, 393, 1769, 1081, 221, 1597, 909, 565, 1253, 135, 1511,
                        1194, 334, 1710, 1022, 678, 1366, 33, 1409, 721, 377, 1753, 1065, 205, 1581, 893, 549, 1237, 119, 1495, 807, 463, 1839, 1151, 291, 1667, 979, 635, 1323, 76, 1452, 764, 420, 1796, 1108, 248, 1624, 936, 592, 1280, 162, 1538, 850, 506,
                        1688, 1000, 656, 1344, 11, 1387, 699, 355, 1731, 1043, 183, 1559, 871, 527, 1215, 97, 1473, 785, 441, 1817, 1129, 269, 1645, 957, 613, 1301, 54, 1430, 742, 398, 1774, 1086, 226, 1602, 914, 570, 1258, 140, 1516, 828, 484, 1172, 312,
                        667, 1355, 22, 1398, 710, 366, 1742, 1054, 194, 1570, 882, 538, 1226, 108, 1484, 796, 452, 1828, 1140, 280, 1656, 968, 624, 1312, 65, 1441, 753, 409, 1785, 1097, 237, 1613, 925, 581, 1269, 151, 1527, 839, 495, 1183, 323, 1699, 1011,
                        0, 1376, 688, 344, 1720, 1032, 172, 1548, 860, 516, 1204, 86, 1462, 774, 430, 1806, 1118, 258, 1634, 946, 602, 1290, 43, 1419, 731, 387, 1763, 1075, 215, 1591, 903, 559, 1247, 129, 1505, 817, 473, 1161, 301, 1677, 989, 645, 3
                    ],
                    // 47
                    [2, 370, 1810, 1090, 190, 1630, 910, 550, 1990, 1270, 100, 1540, 820, 460, 1900, 1180, 280, 1720, 1000, 640, 1360, 55, 1495, 775, 415, 1855, 1135, 235, 1675, 955, 595, 1315, 145, 1585, 865, 505, 1945, 1225, 325, 1765, 1045, 685, 1405, 10, 1,
                        1838, 1118, 218, 1658, 938, 578, 2018, 1298, 128, 1568, 848, 488, 1928, 1208, 308, 1748, 1028, 668, 1388, 83, 1523, 803, 443, 1883, 1163, 263, 1703, 983, 623, 1343, 173, 1613, 893, 533, 1973, 1253, 353, 1793, 1073, 713, 1433, 38, 1478, 758, 398,
                        196, 1636, 916, 556, 1996, 1276, 106, 1546, 826, 466, 1906, 1186, 286, 1726, 1006, 646, 1366, 61, 1501, 781, 421, 1861, 1141, 241, 1681, 961, 601, 1321, 151, 1591, 871, 511, 1951, 1231, 331, 1771, 1051, 691, 1411, 16, 1456, 736, 376, 1816, 1096,
                        927, 567, 2007, 1287, 117, 1557, 837, 477, 1917, 1197, 297, 1737, 1017, 657, 1377, 72, 1512, 792, 432, 1872, 1152, 252, 1692, 972, 612, 1332, 162, 1602, 882, 522, 1962, 1242, 342, 1782, 1062, 702, 1422, 27, 1467, 747, 387, 1827, 1107, 207, 1647,
                        1984, 1264, 94, 1534, 814, 454, 1894, 1174, 274, 1714, 994, 634, 1354, 49, 1489, 769, 409, 1849, 1129, 229, 1669, 949, 589, 1309, 139, 1579, 859, 499, 1939, 1219, 319, 1759, 1039, 679, 1399, 4, 1444, 724, 364, 1804, 1084, 184, 1624, 904, 544,
                        131, 1571, 851, 491, 1931, 1211, 311, 1751, 1031, 671, 1391, 86, 1526, 806, 446, 1886, 1166, 266, 1706, 986, 626, 1346, 176, 1616, 896, 536, 1976, 1256, 356, 1796, 1076, 716, 1436, 41, 1481, 761, 401, 1841, 1121, 221, 1661, 941, 581, 2021, 1301,
                        829, 469, 1909, 1189, 289, 1729, 1009, 649, 1369, 64, 1504, 784, 424, 1864, 1144, 244, 1684, 964, 604, 1324, 154, 1594, 874, 514, 1954, 1234, 334, 1774, 1054, 694, 1414, 19, 1459, 739, 379, 1819, 1099, 199, 1639, 919, 559, 1999, 1279, 109, 1549,
                        1920, 1200, 300, 1740, 1020, 660, 1380, 75, 1515, 795, 435, 1875, 1155, 255, 1695, 975, 615, 1335, 165, 1605, 885, 525, 1965, 1245, 345, 1785, 1065, 705, 1425, 30, 1470, 750, 390, 1830, 1110, 210, 1650, 930, 570, 2010, 1290, 120, 1560, 840, 480,
                        277, 1717, 997, 637, 1357, 52, 1492, 772, 412, 1852, 1132, 232, 1672, 952, 592, 1312, 142, 1582, 862, 502, 1942, 1222, 322, 1762, 1042, 682, 1402, 7, 1447, 727, 367, 1807, 1087, 187, 1627, 907, 547, 1987, 1267, 97, 1537, 817, 457, 1897, 1177,
                        1025, 665, 1385, 80, 1520, 800, 440, 1880, 1160, 260, 1700, 980, 620, 1340, 170, 1610, 890, 530, 1970, 1250, 350, 1790, 1070, 710, 1430, 35, 1475, 755, 395, 1835, 1115, 215, 1655, 935, 575, 2015, 1295, 125, 1565, 845, 485, 1925, 1205, 305, 1745,
                        1363, 58, 1498, 778, 418, 1858, 1138, 238, 1678, 958, 598, 1318, 148, 1588, 868, 508, 1948, 1228, 328, 1768, 1048, 688, 1408, 13, 1453, 733, 373, 1813, 1093, 193, 1633, 913, 553, 1993, 1273, 103, 1543, 823, 463, 1903, 1183, 283, 1723, 1003, 643,
                        1509, 789, 429, 1869, 1149, 249, 1689, 969, 609, 1329, 159, 1599, 879, 519, 1959, 1239, 339, 1779, 1059, 699, 1419, 24, 1464, 744, 384, 1824, 1104, 204, 1644, 924, 564, 2004, 1284, 114, 1554, 834, 474, 1914, 1194, 294, 1734, 1014, 654, 1374, 69,
                        406, 1846, 1126, 226, 1666, 946, 586, 1306, 136, 1576, 856, 496, 1936, 1216, 316, 1756, 1036, 676, 1396, 1450, 1441, 721, 361, 1801, 1081, 181, 1621, 901, 541, 1981, 1261, 91, 1531, 811, 451, 1891, 1171, 271, 1711, 991, 631, 1351, 46, 1486, 766,
                        1169, 269, 1709, 989, 629, 1349, 179, 1619, 899, 539, 1979, 1259, 359, 1799, 1079, 719, 1439, 44, 1484, 764, 404, 1844, 1124, 224, 1664, 944, 584, 2024, 1304, 134, 1574, 854, 494, 1934, 1214, 314, 1754, 1034, 674, 1394, 89, 1529, 809, 449, 1889,
                        1687, 967, 607, 1327, 157, 1597, 877, 517, 1957, 1237, 337, 1777, 1057, 697, 1417, 22, 1462, 742, 382, 1822, 1102, 202, 1642, 922, 562, 2002, 1282, 112, 1552, 832, 472, 1912, 1192, 292, 1732, 1012, 652, 1372, 67, 1507, 787, 427, 1867, 1147, 247,
                        618, 1338, 168, 1608, 888, 528, 1968, 1248, 348, 1788, 1068, 708, 1428, 33, 1473, 753, 393, 1833, 1113, 213, 1653, 933, 573, 2013, 1293, 123, 1563, 843, 483, 1923, 1203, 303, 1743, 1023, 663, 1383, 78, 1518, 798, 438, 1878, 1158, 258, 1698, 978,
                        146, 1586, 866, 506, 1946, 1226, 326, 1766, 1046, 686, 1406, 11, 1451, 731, 371, 1811, 1091, 191, 1631, 911, 551, 1991, 1271, 101, 1541, 821, 461, 1901, 1181, 281, 1721, 1001, 641, 1361, 56, 1496, 776, 416, 1856, 1136, 236, 1676, 956, 596, 1316,
                        894, 534, 1974, 1254, 354, 1794, 1074, 714, 1434, 39, 1479, 759, 399, 1839, 1119, 219, 1659, 939, 579, 2019, 1299, 129, 1569, 849, 489, 1929, 1209, 309, 1749, 1029, 669, 1389, 84, 1524, 804, 444, 1884, 1164, 264, 1704, 984, 624, 1344, 174, 1614,
                        1952, 1232, 332, 1772, 1052, 692, 1412, 17, 1457, 737, 377, 1817, 1097, 197, 1637, 917, 557, 1997, 1277, 107, 1547, 827, 467, 1907, 1187, 287, 1727, 1007, 647, 1367, 62, 1502, 782, 422, 1862, 1142, 242, 1682, 962, 602, 1322, 152, 1592, 872, 512,
                        343, 1783, 1063, 703, 1423, 28, 1468, 748, 388, 1828, 1108, 208, 1648, 928, 568, 2008, 1288, 118, 1558, 838, 478, 1918, 1198, 298, 1738, 1018, 658, 1378, 73, 1513, 793, 433, 1873, 1153, 253, 1693, 973, 613, 1333, 163, 1603, 883, 523, 1963, 1243,
                        1040, 680, 1400, 5, 1445, 725, 365, 1805, 1085, 185, 1625, 905, 545, 1985, 1265, 95, 1535, 815, 455, 1895, 1175, 275, 1715, 995, 635, 1355, 50, 1490, 770, 410, 1850, 1130, 230, 1670, 950, 590, 1310, 140, 1580, 860, 500, 1940, 1220, 320, 1760,
                        1437, 42, 1482, 762, 402, 1842, 1122, 222, 1662, 942, 582, 2022, 1302, 132, 1572, 852, 492, 1932, 1212, 312, 1752, 1032, 672, 1392, 87, 1527, 807, 447, 1887, 1167, 267, 1707, 987, 627, 1347, 177, 1617, 897, 537, 1977, 1257, 357, 1797, 1077, 717,
                        1460, 740, 380, 1820, 1100, 200, 1640, 920, 560, 2000, 1280, 110, 1550, 830, 470, 1910, 1190, 290, 1730, 1010, 650, 1370, 65, 1505, 785, 425, 1865, 1145, 245, 1685, 965, 605, 1325, 155, 1595, 875, 515, 1955, 1235, 335, 1775, 1055, 695, 1415, 20,
                        391, 1831, 1111, 211, 1651, 931, 571, 2011, 1291, 121, 1561, 841, 481, 1921, 1201, 301, 1741, 1021, 661, 1381, 76, 1516, 796, 436, 1876, 1156, 256, 1696, 976, 616, 1336, 166, 1606, 886, 526, 1966, 1246, 346, 1786, 1066, 706, 1426, 31, 1471, 751,
                        1088, 188, 1628, 908, 548, 1988, 1268, 98, 1538, 818, 458, 1898, 1178, 278, 1718, 998, 638, 1358, 53, 1493, 773, 413, 1853, 1133, 233, 1673, 953, 593, 1313, 143, 1583, 863, 503, 1943, 1223, 323, 1763, 1043, 683, 1403, 8, 1448, 728, 368, 1808,
                        1656, 936, 576, 2016, 1296, 126, 1566, 846, 486, 1926, 1206, 306, 1746, 1026, 666, 1386, 81, 1521, 801, 441, 1881, 1161, 261, 1701, 981, 621, 1341, 171, 1611, 891, 531, 1971, 1251, 351, 1791, 1071, 711, 1431, 36, 1476, 756, 396, 1836, 1116, 216,
                        554, 1994, 1274, 104, 1544, 824, 464, 1904, 1184, 284, 1724, 1004, 644, 1364, 59, 1499, 779, 419, 1859, 1139, 239, 1679, 959, 599, 1319, 149, 1589, 869, 509, 1949, 1229, 329, 1769, 1049, 689, 1409, 14, 1454, 734, 374, 1814, 1094, 194, 1634, 914,
                        1285, 115, 1555, 835, 475, 1915, 1195, 295, 1735, 1015, 655, 1375, 70, 1510, 790, 430, 1870, 1150, 250, 1690, 970, 610, 1330, 160, 1600, 880, 520, 1960, 1240, 340, 1780, 1060, 700, 1420, 25, 1465, 745, 385, 1825, 1105, 205, 1645, 925, 565, 2005,
                        1532, 812, 452, 1892, 1172, 272, 1712, 992, 632, 1352, 47, 1487, 767, 407, 1847, 1127, 227, 1667, 947, 587, 1307, 137, 1577, 857, 497, 1937, 1217, 317, 1757, 1037, 677, 1397, 730, 1442, 722, 362, 1802, 1082, 182, 1622, 902, 542, 1982, 1262, 92,
                        493, 1933, 1213, 313, 1753, 1033, 673, 1393, 88, 1528, 808, 448, 1888, 1168, 268, 1708, 988, 628, 1348, 178, 1618, 898, 538, 1978, 1258, 358, 1798, 1078, 718, 1438, 43, 1483, 763, 403, 1843, 1123, 223, 1663, 943, 583, 2023, 1303, 133, 1573, 853,
                        1191, 291, 1731, 1011, 651, 1371, 66, 1506, 786, 426, 1866, 1146, 246, 1686, 966, 606, 1326, 156, 1596, 876, 516, 1956, 1236, 336, 1776, 1056, 696, 1416, 21, 1461, 741, 381, 1821, 1101, 201, 1641, 921, 561, 2001, 1281, 111, 1551, 831, 471, 1911,
                        1742, 1022, 662, 1382, 77, 1517, 797, 437, 1877, 1157, 257, 1697, 977, 617, 1337, 167, 1607, 887, 527, 1967, 1247, 347, 1787, 1067, 707, 1427, 32, 1472, 752, 392, 1832, 1112, 212, 1652, 932, 572, 2012, 1292, 122, 1562, 842, 482, 1922, 1202, 302,
                        639, 1359, 54, 1494, 774, 414, 1854, 1134, 234, 1674, 954, 594, 1314, 144, 1584, 864, 504, 1944, 1224, 324, 1764, 1044, 684, 1404, 9, 1449, 729, 369, 1809, 1089, 189, 1629, 909, 549, 1989, 1269, 99, 1539, 819, 459, 1899, 1179, 279, 1719, 999,
                        82, 1522, 802, 442, 1882, 1162, 262, 1702, 982, 622, 1342, 172, 1612, 892, 532, 1972, 1252, 352, 1792, 1072, 712, 1432, 37, 1477, 757, 397, 1837, 1117, 217, 1657, 937, 577, 2017, 1297, 127, 1567, 847, 487, 1927, 1207, 307, 1747, 1027, 667, 1387,
                        780, 420, 1860, 1140, 240, 1680, 960, 600, 1320, 150, 1590, 870, 510, 1950, 1230, 330, 1770, 1050, 690, 1410, 15, 1455, 735, 375, 1815, 1095, 195, 1635, 915, 555, 1995, 1275, 105, 1545, 825, 465, 1905, 1185, 285, 1725, 1005, 645, 1365, 60, 1500,
                        1871, 1151, 251, 1691, 971, 611, 1331, 161, 1601, 881, 521, 1961, 1241, 341, 1781, 1061, 701, 1421, 26, 1466, 746, 386, 1826, 1106, 206, 1646, 926, 566, 2006, 1286, 116, 1556, 836, 476, 1916, 1196, 296, 1736, 1016, 656, 1376, 71, 1511, 791, 431,
                        228, 1668, 948, 588, 1308, 138, 1578, 858, 498, 1938, 1218, 318, 1758, 1038, 678, 1398, 1395, 1443, 723, 363, 1803, 1083, 183, 1623, 903, 543, 1983, 1263, 93, 1533, 813, 453, 1893, 1173, 273, 1713, 993, 633, 1353, 48, 1488, 768, 408, 1848, 1128,
                        985, 625, 1345, 175, 1615, 895, 535, 1975, 1255, 355, 1795, 1075, 715, 1435, 40, 1480, 760, 400, 1840, 1120, 220, 1660, 940, 580, 2020, 1300, 130, 1570, 850, 490, 1930, 1210, 310, 1750, 1030, 670, 1390, 85, 1525, 805, 445, 1885, 1165, 265, 1705,
                        1323, 153, 1593, 873, 513, 1953, 1233, 333, 1773, 1053, 693, 1413, 18, 1458, 738, 378, 1818, 1098, 198, 1638, 918, 558, 1998, 1278, 108, 1548, 828, 468, 1908, 1188, 288, 1728, 1008, 648, 1368, 63, 1503, 783, 423, 1863, 1143, 243, 1683, 963, 603,
                        1604, 884, 524, 1964, 1244, 344, 1784, 1064, 704, 1424, 29, 1469, 749, 389, 1829, 1109, 209, 1649, 929, 569, 2009, 1289, 119, 1559, 839, 479, 1919, 1199, 299, 1739, 1019, 659, 1379, 74, 1514, 794, 434, 1874, 1154, 254, 1694, 974, 614, 1334, 164,
                        501, 1941, 1221, 321, 1761, 1041, 681, 1401, 6, 1446, 726, 366, 1806, 1086, 186, 1626, 906, 546, 1986, 1266, 96, 1536, 816, 456, 1896, 1176, 276, 1716, 996, 636, 1356, 51, 1491, 771, 411, 1851, 1131, 231, 1671, 951, 591, 1311, 141, 1581, 861,
                        1249, 349, 1789, 1069, 709, 1429, 34, 1474, 754, 394, 1834, 1114, 214, 1654, 934, 574, 2014, 1294, 124, 1564, 844, 484, 1924, 1204, 304, 1744, 1024, 664, 1384, 79, 1519, 799, 439, 1879, 1159, 259, 1699, 979, 619, 1339, 169, 1609, 889, 529, 1969,
                        1767, 1047, 687, 1407, 12, 1452, 732, 372, 1812, 1092, 192, 1632, 912, 552, 1992, 1272, 102, 1542, 822, 462, 1902, 1182, 282, 1722, 1002, 642, 1362, 57, 1497, 777, 417, 1857, 1137, 237, 1677, 957, 597, 1317, 147, 1587, 867, 507, 1947, 1227, 327,
                        698, 1418, 23, 1463, 743, 383, 1823, 1103, 203, 1643, 923, 563, 2003, 1283, 113, 1553, 833, 473, 1913, 1193, 293, 1733, 1013, 653, 1373, 68, 1508, 788, 428, 1868, 1148, 248, 1688, 968, 608, 1328, 158, 1598, 878, 518, 1958, 1238, 338, 1778, 1058,
                        0, 1440, 720, 360, 1800, 1080, 180, 1620, 900, 540, 1980, 1260, 90, 1530, 810, 450, 1890, 1170, 270, 1710, 990, 630, 1350, 45, 1485, 765, 405, 1845, 1125, 225, 1665, 945, 585, 1305, 135, 1575, 855, 495, 1935, 1215, 315, 1755, 1035, 675, 3
                    ],
                    // 49
                    [2, 398, 1902, 1150, 210, 1714, 962, 586, 2090, 1338, 116, 1620, 868, 492, 1996, 1244, 304, 1808, 1056, 680, 2184, 1432, 69, 1573, 821, 445, 1949, 1197, 257, 1761, 1009, 633, 2137, 1385, 163, 1667, 915, 539, 2043, 1291, 351, 1855, 1103, 727, 1479, 22, 1,
                        1914, 1162, 222, 1726, 974, 598, 2102, 1350, 128, 1632, 880, 504, 2008, 1256, 316, 1820, 1068, 692, 2196, 1444, 81, 1585, 833, 457, 1961, 1209, 269, 1773, 1021, 645, 2149, 1397, 175, 1679, 927, 551, 2055, 1303, 363, 1867, 1115, 739, 1491, 34, 1538, 786, 410,
                        198, 1702, 950, 574, 2078, 1326, 104, 1608, 856, 480, 1984, 1232, 292, 1796, 1044, 668, 2172, 1420, 57, 1561, 809, 433, 1937, 1185, 245, 1749, 997, 621, 2125, 1373, 151, 1655, 903, 527, 2031, 1279, 339, 1843, 1091, 715, 1467, 10, 1514, 762, 386, 1890, 1138,
                        980, 604, 2108, 1356, 134, 1638, 886, 510, 2014, 1262, 322, 1826, 1074, 698, 2202, 1450, 87, 1591, 839, 463, 1967, 1215, 275, 1779, 1027, 651, 2155, 1403, 181, 1685, 933, 557, 2061, 1309, 369, 1873, 1121, 745, 1497, 40, 1544, 792, 416, 1920, 1168, 228, 1732,
                        2084, 1332, 110, 1614, 862, 486, 1990, 1238, 298, 1802, 1050, 674, 2178, 1426, 63, 1567, 815, 439, 1943, 1191, 251, 1755, 1003, 627, 2131, 1379, 157, 1661, 909, 533, 2037, 1285, 345, 1849, 1097, 721, 1473, 16, 1520, 768, 392, 1896, 1144, 204, 1708, 956, 580,
                        122, 1626, 874, 498, 2002, 1250, 310, 1814, 1062, 686, 2190, 1438, 75, 1579, 827, 451, 1955, 1203, 263, 1767, 1015, 639, 2143, 1391, 169, 1673, 921, 545, 2049, 1297, 357, 1861, 1109, 733, 1485, 28, 1532, 780, 404, 1908, 1156, 216, 1720, 968, 592, 2096, 1344,
                        850, 474, 1978, 1226, 286, 1790, 1038, 662, 2166, 1414, 51, 1555, 803, 427, 1931, 1179, 239, 1743, 991, 615, 2119, 1367, 145, 1649, 897, 521, 2025, 1273, 333, 1837, 1085, 709, 1461, 4, 1508, 756, 380, 1884, 1132, 192, 1696, 944, 568, 2072, 1320, 98, 1602,
                        2017, 1265, 325, 1829, 1077, 701, 2205, 1453, 90, 1594, 842, 466, 1970, 1218, 278, 1782, 1030, 654, 2158, 1406, 184, 1688, 936, 560, 2064, 1312, 372, 1876, 1124, 748, 1500, 43, 1547, 795, 419, 1923, 1171, 231, 1735, 983, 607, 2111, 1359, 137, 1641, 889, 513,
                        301, 1805, 1053, 677, 2181, 1429, 66, 1570, 818, 442, 1946, 1194, 254, 1758, 1006, 630, 2134, 1382, 160, 1664, 912, 536, 2040, 1288, 348, 1852, 1100, 724, 1476, 19, 1523, 771, 395, 1899, 1147, 207, 1711, 959, 583, 2087, 1335, 113, 1617, 865, 489, 1993, 1241,
                        1065, 689, 2193, 1441, 78, 1582, 830, 454, 1958, 1206, 266, 1770, 1018, 642, 2146, 1394, 172, 1676, 924, 548, 2052, 1300, 360, 1864, 1112, 736, 1488, 31, 1535, 783, 407, 1911, 1159, 219, 1723, 971, 595, 2099, 1347, 125, 1629, 877, 501, 2005, 1253, 313, 1817,
                        2169, 1417, 54, 1558, 806, 430, 1934, 1182, 242, 1746, 994, 618, 2122, 1370, 148, 1652, 900, 524, 2028, 1276, 336, 1840, 1088, 712, 1464, 7, 1511, 759, 383, 1887, 1135, 195, 1699, 947, 571, 2075, 1323, 101, 1605, 853, 477, 1981, 1229, 289, 1793, 1041, 665,
                        84, 1588, 836, 460, 1964, 1212, 272, 1776, 1024, 648, 2152, 1400, 178, 1682, 930, 554, 2058, 1306, 366, 1870, 1118, 742, 1494, 37, 1541, 789, 413, 1917, 1165, 225, 1729, 977, 601, 2105, 1353, 131, 1635, 883, 507, 2011, 1259, 319, 1823, 1071, 695, 2199, 1447,
                        812, 436, 1940, 1188, 248, 1752, 1000, 624, 2128, 1376, 154, 1658, 906, 530, 2034, 1282, 342, 1846, 1094, 718, 1470, 13, 1517, 765, 389, 1893, 1141, 201, 1705, 953, 577, 2081, 1329, 107, 1611, 859, 483, 1987, 1235, 295, 1799, 1047, 671, 2175, 1423, 60, 1564,
                        1952, 1200, 260, 1764, 1012, 636, 2140, 1388, 166, 1670, 918, 542, 2046, 1294, 354, 1858, 1106, 730, 1482, 25, 1529, 777, 401, 1905, 1153, 213, 1717, 965, 589, 2093, 1341, 119, 1623, 871, 495, 1999, 1247, 307, 1811, 1059, 683, 2187, 1435, 72, 1576, 824, 448,
                        236, 1740, 988, 612, 2116, 1364, 142, 1646, 894, 518, 2022, 1270, 330, 1834, 1082, 706, 1458, 1526, 1505, 753, 377, 1881, 1129, 189, 1693, 941, 565, 2069, 1317, 95, 1599, 847, 471, 1975, 1223, 283, 1787, 1035, 659, 2163, 1411, 48, 1552, 800, 424, 1928, 1176,
                        1033, 657, 2161, 1409, 187, 1691, 939, 563, 2067, 1315, 375, 1879, 1127, 751, 1503, 46, 1550, 798, 422, 1926, 1174, 234, 1738, 986, 610, 2114, 1362, 140, 1644, 892, 516, 2020, 1268, 328, 1832, 1080, 704, 2208, 1456, 93, 1597, 845, 469, 1973, 1221, 281, 1785,
                        2138, 1386, 164, 1668, 916, 540, 2044, 1292, 352, 1856, 1104, 728, 1480, 23, 1527, 775, 399, 1903, 1151, 211, 1715, 963, 587, 2091, 1339, 117, 1621, 869, 493, 1997, 1245, 305, 1809, 1057, 681, 2185, 1433, 70, 1574, 822, 446, 1950, 1198, 258, 1762, 1010, 634,
                        176, 1680, 928, 552, 2056, 1304, 364, 1868, 1116, 740, 1492, 35, 1539, 787, 411, 1915, 1163, 223, 1727, 975, 599, 2103, 1351, 129, 1633, 881, 505, 2009, 1257, 317, 1821, 1069, 693, 2197, 1445, 82, 1586, 834, 458, 1962, 1210, 270, 1774, 1022, 646, 2150, 1398,
                        904, 528, 2032, 1280, 340, 1844, 1092, 716, 1468, 11, 1515, 763, 387, 1891, 1139, 199, 1703, 951, 575, 2079, 1327, 105, 1609, 857, 481, 1985, 1233, 293, 1797, 1045, 669, 2173, 1421, 58, 1562, 810, 434, 1938, 1186, 246, 1750, 998, 622, 2126, 1374, 152, 1656,
                        2062, 1310, 370, 1874, 1122, 746, 1498, 41, 1545, 793, 417, 1921, 1169, 229, 1733, 981, 605, 2109, 1357, 135, 1639, 887, 511, 2015, 1263, 323, 1827, 1075, 699, 2203, 1451, 88, 1592, 840, 464, 1968, 1216, 276, 1780, 1028, 652, 2156, 1404, 182, 1686, 934, 558,
                        346, 1850, 1098, 722, 1474, 17, 1521, 769, 393, 1897, 1145, 205, 1709, 957, 581, 2085, 1333, 111, 1615, 863, 487, 1991, 1239, 299, 1803, 1051, 675, 2179, 1427, 64, 1568, 816, 440, 1944, 1192, 252, 1756, 1004, 628, 2132, 1380, 158, 1662, 910, 534, 2038, 1286,
                        1110, 734, 1486, 29, 1533, 781, 405, 1909, 1157, 217, 1721, 969, 593, 2097, 1345, 123, 1627, 875, 499, 2003, 1251, 311, 1815, 1063, 687, 2191, 1439, 76, 1580, 828, 452, 1956, 1204, 264, 1768, 1016, 640, 2144, 1392, 170, 1674, 922, 546, 2050, 1298, 358, 1862,
                        1462, 5, 1509, 757, 381, 1885, 1133, 193, 1697, 945, 569, 2073, 1321, 99, 1603, 851, 475, 1979, 1227, 287, 1791, 1039, 663, 2167, 1415, 52, 1556, 804, 428, 1932, 1180, 240, 1744, 992, 616, 2120, 1368, 146, 1650, 898, 522, 2026, 1274, 334, 1838, 1086, 710,
                        1548, 796, 420, 1924, 1172, 232, 1736, 984, 608, 2112, 1360, 138, 1642, 890, 514, 2018, 1266, 326, 1830, 1078, 702, 2206, 1454, 91, 1595, 843, 467, 1971, 1219, 279, 1783, 1031, 655, 2159, 1407, 185, 1689, 937, 561, 2065, 1313, 373, 1877, 1125, 749, 1501, 44,
                        396, 1900, 1148, 208, 1712, 960, 584, 2088, 1336, 114, 1618, 866, 490, 1994, 1242, 302, 1806, 1054, 678, 2182, 1430, 67, 1571, 819, 443, 1947, 1195, 255, 1759, 1007, 631, 2135, 1383, 161, 1665, 913, 537, 2041, 1289, 349, 1853, 1101, 725, 1477, 20, 1524, 772,
                        1160, 220, 1724, 972, 596, 2100, 1348, 126, 1630, 878, 502, 2006, 1254, 314, 1818, 1066, 690, 2194, 1442, 79, 1583, 831, 455, 1959, 1207, 267, 1771, 1019, 643, 2147, 1395, 173, 1677, 925, 549, 2053, 1301, 361, 1865, 1113, 737, 1489, 32, 1536, 784, 408, 1912,
                        1700, 948, 572, 2076, 1324, 102, 1606, 854, 478, 1982, 1230, 290, 1794, 1042, 666, 2170, 1418, 55, 1559, 807, 431, 1935, 1183, 243, 1747, 995, 619, 2123, 1371, 149, 1653, 901, 525, 2029, 1277, 337, 1841, 1089, 713, 1465, 8, 1512, 760, 384, 1888, 1136, 196,
                        602, 2106, 1354, 132, 1636, 884, 508, 2012, 1260, 320, 1824, 1072, 696, 2200, 1448, 85, 1589, 837, 461, 1965, 1213, 273, 1777, 1025, 649, 2153, 1401, 179, 1683, 931, 555, 2059, 1307, 367, 1871, 1119, 743, 1495, 38, 1542, 790, 414, 1918, 1166, 226, 1730, 978,
                        1330, 108, 1612, 860, 484, 1988, 1236, 296, 1800, 1048, 672, 2176, 1424, 61, 1565, 813, 437, 1941, 1189, 249, 1753, 1001, 625, 2129, 1377, 155, 1659, 907, 531, 2035, 1283, 343, 1847, 1095, 719, 1471, 14, 1518, 766, 390, 1894, 1142, 202, 1706, 954, 578, 2082,
                        1624, 872, 496, 2000, 1248, 308, 1812, 1060, 684, 2188, 1436, 73, 1577, 825, 449, 1953, 1201, 261, 1765, 1013, 637, 2141, 1389, 167, 1671, 919, 543, 2047, 1295, 355, 1859, 1107, 731, 1483, 26, 1530, 778, 402, 1906, 1154, 214, 1718, 966, 590, 2094, 1342, 120,
                        472, 1976, 1224, 284, 1788, 1036, 660, 2164, 1412, 49, 1553, 801, 425, 1929, 1177, 237, 1741, 989, 613, 2117, 1365, 143, 1647, 895, 519, 2023, 1271, 331, 1835, 1083, 707, 1459, 774, 1506, 754, 378, 1882, 1130, 190, 1694, 942, 566, 2070, 1318, 96, 1600, 848,
                        1267, 327, 1831, 1079, 703, 2207, 1455, 92, 1596, 844, 468, 1972, 1220, 280, 1784, 1032, 656, 2160, 1408, 186, 1690, 938, 562, 2066, 1314, 374, 1878, 1126, 750, 1502, 45, 1549, 797, 421, 1925, 1173, 233, 1737, 985, 609, 2113, 1361, 139, 1643, 891, 515, 2019,
                        1807, 1055, 679, 2183, 1431, 68, 1572, 820, 444, 1948, 1196, 256, 1760, 1008, 632, 2136, 1384, 162, 1666, 914, 538, 2042, 1290, 350, 1854, 1102, 726, 1478, 21, 1525, 773, 397, 1901, 1149, 209, 1713, 961, 585, 2089, 1337, 115, 1619, 867, 491, 1995, 1243, 303,
                        691, 2195, 1443, 80, 1584, 832, 456, 1960, 1208, 268, 1772, 1020, 644, 2148, 1396, 174, 1678, 926, 550, 2054, 1302, 362, 1866, 1114, 738, 1490, 33, 1537, 785, 409, 1913, 1161, 221, 1725, 973, 597, 2101, 1349, 127, 1631, 879, 503, 2007, 1255, 315, 1819, 1067,
                        1419, 56, 1560, 808, 432, 1936, 1184, 244, 1748, 996, 620, 2124, 1372, 150, 1654, 902, 526, 2030, 1278, 338, 1842, 1090, 714, 1466, 9, 1513, 761, 385, 1889, 1137, 197, 1701, 949, 573, 2077, 1325, 103, 1607, 855, 479, 1983, 1231, 291, 1795, 1043, 667, 2171,
                        1590, 838, 462, 1966, 1214, 274, 1778, 1026, 650, 2154, 1402, 180, 1684, 932, 556, 2060, 1308, 368, 1872, 1120, 744, 1496, 39, 1543, 791, 415, 1919, 1167, 227, 1731, 979, 603, 2107, 1355, 133, 1637, 885, 509, 2013, 1261, 321, 1825, 1073, 697, 2201, 1449, 86,
                        438, 1942, 1190, 250, 1754, 1002, 626, 2130, 1378, 156, 1660, 908, 532, 2036, 1284, 344, 1848, 1096, 720, 1472, 15, 1519, 767, 391, 1895, 1143, 203, 1707, 955, 579, 2083, 1331, 109, 1613, 861, 485, 1989, 1237, 297, 1801, 1049, 673, 2177, 1425, 62, 1566, 814,
                        1202, 262, 1766, 1014, 638, 2142, 1390, 168, 1672, 920, 544, 2048, 1296, 356, 1860, 1108, 732, 1484, 27, 1531, 779, 403, 1907, 1155, 215, 1719, 967, 591, 2095, 1343, 121, 1625, 873, 497, 2001, 1249, 309, 1813, 1061, 685, 2189, 1437, 74, 1578, 826, 450, 1954,
                        1742, 990, 614, 2118, 1366, 144, 1648, 896, 520, 2024, 1272, 332, 1836, 1084, 708, 1460, 1457, 1507, 755, 379, 1883, 1131, 191, 1695, 943, 567, 2071, 1319, 97, 1601, 849, 473, 1977, 1225, 285, 1789, 1037, 661, 2165, 1413, 50, 1554, 802, 426, 1930, 1178, 238,
                        653, 2157, 1405, 183, 1687, 935, 559, 2063, 1311, 371, 1875, 1123, 747, 1499, 42, 1546, 794, 418, 1922, 1170, 230, 1734, 982, 606, 2110, 1358, 136, 1640, 888, 512, 2016, 1264, 324, 1828, 1076, 700, 2204, 1452, 89, 1593, 841, 465, 1969, 1217, 277, 1781, 1029,
                        1381, 159, 1663, 911, 535, 2039, 1287, 347, 1851, 1099, 723, 1475, 18, 1522, 770, 394, 1898, 1146, 206, 1710, 958, 582, 2086, 1334, 112, 1616, 864, 488, 1992, 1240, 300, 1804, 1052, 676, 2180, 1428, 65, 1569, 817, 441, 1945, 1193, 253, 1757, 1005, 629, 2133,
                        1675, 923, 547, 2051, 1299, 359, 1863, 1111, 735, 1487, 30, 1534, 782, 406, 1910, 1158, 218, 1722, 970, 594, 2098, 1346, 124, 1628, 876, 500, 2004, 1252, 312, 1816, 1064, 688, 2192, 1440, 77, 1581, 829, 453, 1957, 1205, 265, 1769, 1017, 641, 2145, 1393, 171,
                        523, 2027, 1275, 335, 1839, 1087, 711, 1463, 6, 1510, 758, 382, 1886, 1134, 194, 1698, 946, 570, 2074, 1322, 100, 1604, 852, 476, 1980, 1228, 288, 1792, 1040, 664, 2168, 1416, 53, 1557, 805, 429, 1933, 1181, 241, 1745, 993, 617, 2121, 1369, 147, 1651, 899,
                        1305, 365, 1869, 1117, 741, 1493, 36, 1540, 788, 412, 1916, 1164, 224, 1728, 976, 600, 2104, 1352, 130, 1634, 882, 506, 2010, 1258, 318, 1822, 1070, 694, 2198, 1446, 83, 1587, 835, 459, 1963, 1211, 271, 1775, 1023, 647, 2151, 1399, 177, 1681, 929, 553, 2057,
                        1845, 1093, 717, 1469, 12, 1516, 764, 388, 1892, 1140, 200, 1704, 952, 576, 2080, 1328, 106, 1610, 858, 482, 1986, 1234, 294, 1798, 1046, 670, 2174, 1422, 59, 1563, 811, 435, 1939, 1187, 247, 1751, 999, 623, 2127, 1375, 153, 1657, 905, 529, 2033, 1281, 341,
                        729, 1481, 24, 1528, 776, 400, 1904, 1152, 212, 1716, 964, 588, 2092, 1340, 118, 1622, 870, 494, 1998, 1246, 306, 1810, 1058, 682, 2186, 1434, 71, 1575, 823, 447, 1951, 1199, 259, 1763, 1011, 635, 2139, 1387, 165, 1669, 917, 541, 2045, 1293, 353, 1857, 1105,
                        0, 1504, 752, 376, 1880, 1128, 188, 1692, 940, 564, 2068, 1316, 94, 1598, 846, 470, 1974, 1222, 282, 1786, 1034, 658, 2162, 1410, 47, 1551, 799, 423, 1927, 1175, 235, 1739, 987, 611, 2115, 1363, 141, 1645, 893, 517, 2021, 1269, 329, 1833, 1081, 705, 3
                    ]
                ]
            };
            var ECCModeMap = {
                ECC000: 0,
                ECC050: 1,
                ECC080: 2,
                ECC100: 3,
                ECC140: 4
            };
            function getECC(mode) {
                var index = ECCModeMap[mode];
                return {
                    eccInfo: specialized.Constants_140.ECCInfos[index],
                    headerBits: specialized.Constants_140.HeaderBits[index]
                };
            }
            specialized.getECC = getECC;
            var SymbolSizeKeys = ['square9', 'square11', 'square13', 'square15', 'square17', 'square19', 'square21', 'square23', 'square25', 'square27', 'square29', 'square31', 'square33', 'square35', 'square37', 'square39', 'square41', 'square43', 'square45', 'square47', 'square49'];
            function getSymbolSizeInfo(key) {
                var index = SymbolSizeKeys.indexOf(key);
                if (index < 0) {
                    throw new wijmo.barcode.InvalidOptionsException({ ecc000_140SymbolSize: key });
                }
                return specialized.Constants_140.SymbolCapacities[index];
            }
            specialized.getSymbolSizeInfo = getSymbolSizeInfo;
            function getSymbolSizeValue(key) {
                return SymbolSizeKeys.indexOf(key);
            }
            specialized.getSymbolSizeValue = getSymbolSizeValue;
            function getProperSymbolSize(symbolSize, bitLength) {
                if (symbolSize == 'auto') {
                    symbolSize = 'square9';
                    for (var i = 0; i <= SymbolSizeKeys.length - 1; ++i) {
                        if (bitLength <= specialized.Constants_140.SymbolCapacities[i]) {
                            symbolSize = SymbolSizeKeys[i];
                            break;
                        }
                    }
                }
                return symbolSize;
            }
            specialized.getProperSymbolSize = getProperSymbolSize;
            function getModuleMapping(key) {
                var index = SymbolSizeKeys.indexOf(key);
                return specialized.Constants_140.ModuleMapping[index];
            }
            specialized.getModuleMapping = getModuleMapping;
            function setFinder_140(matrix, symbolRows) {
                var firstRow = matrix[0];
                for (var i = 0; i < symbolRows; i++) {
                    if (wijmo.barcode.Utils.isEven(i)) {
                        firstRow[i] = 1;
                    }
                    else {
                        firstRow[i] = 0;
                    }
                }
                var lastRow = matrix[symbolRows - 1];
                for (var i = 0; i < symbolRows; i++) {
                    lastRow[i] = 1;
                }
                for (var i = 1; i < symbolRows - 1; i++) {
                    matrix[i][0] = 1;
                    if (wijmo.barcode.Utils.isEven(i)) {
                        matrix[i][symbolRows - 1] = 1;
                    }
                    else {
                        matrix[i][symbolRows - 1] = 0;
                    }
                }
            }
            specialized.setFinder_140 = setFinder_140;
            function setRegionData_140(matrix, symbolRows, it) {
                symbolRows -= 2;
                for (var r = 0; r < symbolRows; ++r) {
                    for (var c = 0; c < symbolRows; ++c) {
                        matrix[1 + r][1 + c] = +it.getBit(r * symbolRows + c);
                    }
                }
            }
            specialized.setRegionData_140 = setRegionData_140;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var GEN_BIT_MASK = 0x2d;
            var MSB_MASK = 0x80;
            var GEN_SEED = 0x01;
            var _elements = wijmo.barcode.Utils.fillArray(new Array(256), 0);
            var _valToExp = wijmo.barcode.Utils.fillArray(new Array(256), 0);
            var seed = GEN_SEED, exp = 0;
            do {
                seed %= 256;
                var last = seed;
                _elements[exp] = seed;
                _valToExp[seed] = exp % 256;
                seed <<= 1;
                if ((last & MSB_MASK) != 0) {
                    seed ^= GEN_BIT_MASK;
                }
            } while (++exp <= 255);
            function GFSum(a, b) {
                return (a ^ b) % 256;
            }
            function GFMultiply(a, b) {
                if (a == 0 || b == 0) {
                    return 0;
                }
                return _elements[(_valToExp[a] + _valToExp[b]) % 255];
            }
            var Coefficients = [
                null, null, null, null, null,
                // parity = 5
                [228, 48, 15, 111, 62],
                null,
                // parity = 7
                [23, 68, 144, 134, 240, 92, 254],
                null, null,
                // parity = 10
                [28, 24, 185, 166, 223, 248, 116, 255, 110, 61],
                // parity = 11
                [175, 138, 205, 12, 194, 168, 39, 245, 60, 97, 120],
                // parity = 12
                [41, 153, 158, 91, 61, 42, 142, 213, 97, 178, 100, 242],
                null,
                // parity = 14
                [156, 97, 192, 252, 95, 9, 157, 119, 138, 45, 18, 186, 83, 185],
                null, null, null,
                // parity = 18
                [83, 195, 100, 39, 188, 75, 66, 61, 241, 213, 109, 129, 94, 254, 225, 48, 90, 188],
                null,
                // parity = 20
                [15, 195, 244, 9, 233, 71, 168, 2, 188, 160, 153, 145, 253, 79, 108, 82, 27, 174, 186, 172],
                null, null, null,
                // parity = 24
                [52, 190, 88, 205, 109, 39, 176, 21, 155, 197, 251, 223, 155, 21, 5, 172, 254, 124, 12, 181, 184, 96, 50, 193],
                null, null, null,
                // parity = 28
                [211, 231, 43, 97, 71, 96, 103, 174, 37, 151, 170, 53, 75, 34, 249, 121, 17, 138, 110, 213, 141, 136, 120, 151, 233, 168, 93, 255],
                null, null, null, null, null, null, null,
                // parity = 36
                [245, 127, 242, 218, 130, 250, 162, 181, 102, 120, 84, 179, 220, 251, 80, 182, 229, 18, 2, 4, 68, 33, 101, 137, 95, 119, 115, 44, 175, 184, 59, 25, 225, 98, 81, 112],
                null, null, null, null, null,
                // parity = 42
                [77, 193, 137, 31, 19, 38, 22, 153, 247, 105, 122, 2, 245, 133, 242, 8, 175, 95, 100, 9, 167, 105, 214, 111, 57, 121, 21, 1, 253, 57, 54, 101, 248, 202, 69, 50, 150, 177, 226, 5, 9, 5],
                null, null, null, null, null,
                // parity = 48
                [245, 132, 172, 223, 96, 32, 117, 22, 238, 133, 238, 231, 205, 188, 237, 87, 191, 106, 16, 147, 118, 23, 37, 90, 170, 205, 131, 88, 120, 100, 66, 138, 186, 240, 82, 44, 176, 87, 187, 147, 160, 175, 69, 213, 92, 253, 225, 19],
                null, null, null, null, null, null, null,
                // parity = 56
                [175, 9, 223, 238, 12, 17, 220, 208, 100, 29, 175, 170, 230, 192, 215, 235, 150, 159, 36, 223, 38, 200, 132, 54, 228, 146, 218, 234, 117, 203, 29, 232, 144, 238, 22, 150, 201, 117, 62, 207, 164, 13, 137, 245, 127, 67, 247, 28, 155, 43, 203, 107, 233, 53, 143, 46],
                null, null, null, null, null,
                // parity = 62
                [242, 93, 169, 50, 144, 210, 39, 118, 202, 188, 201, 189, 143, 108, 196, 37, 185, 112, 134, 230, 245, 63, 197, 190, 250, 106, 185, 221, 175, 64, 114, 71, 161, 44, 147, 6, 27, 218, 51, 63, 87, 10, 40, 130, 188, 17, 163, 31, 176, 170, 4, 107, 232, 7, 94, 166, 224, 124, 86, 47, 11, 204],
                null, null, null, null, null,
                // parity = 68
                [220, 228, 173, 89, 251, 149, 159, 56, 89, 33, 147, 244, 154, 36, 73, 127, 213, 136, 248, 180, 234, 197, 158, 177, 68, 122, 93, 213, 15, 160, 227, 236, 66, 139, 153, 185, 202, 167, 179, 25, 220, 232, 96, 210, 231, 136, 223, 239, 181, 241, 59, 52, 172, 25, 49, 232, 211, 189, 64, 54, 108, 153, 132, 63, 96, 103, 82, 186]
            ];
            function generateErrorCorrectionCode(message, m_start, m_len, e_len) {
                var d = wijmo.barcode.Utils.fillArray(new Array(e_len), 0);
                var g = Coefficients[e_len];
                for (var i = m_start; i < m_start + m_len; ++i) {
                    var f = GFSum(d[e_len - 1], message[i]);
                    for (var j = e_len - 1; j > 0; --j) {
                        d[j] = GFSum(GFMultiply(f, g[j]), d[j - 1]);
                    }
                    d[0] = GFMultiply(g[0], f);
                }
                d.reverse();
                return d;
            }
            specialized.generateErrorCorrectionCode = generateErrorCorrectionCode;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            specialized.CONSTANTS = {
                FNC1Input: wijmo.barcode.Constants.DataMatrixFNC1.charCodeAt(0),
                Macro05Input: wijmo.barcode.Constants.DataMatrixMacro05.charCodeAt(0),
                Macro06Input: wijmo.barcode.Constants.DataMatrixMacro06.charCodeAt(0),
                StructuredAppand: 233,
                FileIdentifierMax: 254,
                ASCIIPad: 129,
                ASCIIUpperShift: 235,
                ASCIIFNC1: 232,
                Macro05: 236,
                Macro06: 237,
                TripletUppershift: 158,
                TripletFNC1: 155,
                TripletPad: 0,
                InvalidTripletValue: 0xff,
                LatchToC40: 230,
                LatchToBase256: 231,
                LatchToX12: 238,
                LatchToText: 239,
                LatchToEDIFACT: 240,
                TripletUnlatch: 254,
                EDIFACTUnlatch: 31,
                PseudoRandomSeed: 149,
                PadRandomBase: 253,
                Base256RandomBase: 255,
                Base256SmallBlockSize: 249,
                EDIFACTMask: 0x3f,
                Unvisited: 0xff,
                TripletShifts: [255, 0, 1, 2],
                MaxCodeWrods: 2178,
                MaxStructures: 16,
                MaxLookAheadOffset: 50
            };
            var SymbolInfo = {
                keys: ['square10', 'square12', 'square14', 'square16', 'square18', 'square20', 'square22', 'square24', 'square26', 'square32', 'square36', 'square40', 'square44', 'square48', 'square52', 'square64', 'square72', 'square80', 'square88', 'square96', 'square104', 'square120', 'square132', 'square144', 'rectangular8x18', 'rectangular8x32', 'rectangular12x26', 'rectangular12x36', 'rectangular16x36', 'rectangular16x48'],
                values: [
                    [10, 10, 3, 5, 1, 1, 8, 8],
                    [12, 12, 5, 7, 1, 1, 10, 10],
                    [14, 14, 8, 10, 1, 1, 12, 12],
                    [16, 16, 12, 12, 1, 1, 14, 14],
                    [18, 18, 18, 14, 1, 1, 16, 16],
                    [20, 20, 22, 18, 1, 1, 18, 18],
                    [22, 22, 30, 20, 1, 1, 20, 20],
                    [24, 24, 36, 24, 1, 1, 22, 22],
                    [26, 26, 44, 28, 1, 1, 24, 24],
                    [32, 32, 62, 36, 1, 4, 14, 14],
                    [36, 36, 86, 42, 1, 4, 16, 16],
                    [40, 40, 114, 48, 1, 4, 18, 18],
                    [44, 44, 144, 56, 1, 4, 20, 20],
                    [48, 48, 174, 68, 1, 4, 22, 22],
                    [52, 52, 204, 84, 2, 4, 24, 24],
                    [64, 64, 280, 112, 2, 16, 14, 14],
                    [72, 72, 368, 144, 4, 16, 16, 16],
                    [80, 80, 456, 192, 4, 16, 18, 18],
                    [88, 88, 576, 224, 4, 16, 20, 20],
                    [96, 96, 696, 272, 4, 16, 22, 22],
                    [104, 104, 816, 336, 6, 16, 24, 24],
                    [120, 120, 1050, 408, 6, 36, 18, 18],
                    [132, 132, 1304, 496, 8, 36, 20, 20],
                    [144, 144, 1558, 620, 10, 36, 22, 22],
                    [8, 18, 5, 7, 1, 1, 6, 16],
                    [8, 32, 10, 11, 1, 2, 6, 14],
                    [12, 26, 16, 14, 1, 1, 10, 24],
                    [12, 36, 22, 18, 1, 2, 10, 16],
                    [16, 36, 32, 24, 1, 2, 14, 16],
                    [16, 48, 49, 28, 1, 2, 14, 22]
                ]
            };
            function getSymbolInfo(type) {
                var info = SymbolInfo.values[SymbolInfo.keys.indexOf(type)];
                if (!info) {
                    throw new wijmo.barcode.InvalidOptionsException({ ecc200SymbolSize: type });
                }
                return {
                    symbolRows: info[0],
                    symbolColumns: info[1],
                    symbolDataCapacity: info[2],
                    eccLength: info[3],
                    interleavedBlocks: info[4],
                    regions: info[5],
                    regionRows: info[6],
                    regionColumns: info[7]
                };
            }
            specialized.getSymbolInfo = getSymbolInfo;
            function getSuitableSymbolSize(prefered, codeLength) {
                if (prefered !== 'squareAuto' && prefered !== 'rectangularAuto') {
                    return getSymbolInfo(prefered);
                }
                for (var i = prefered == 'squareAuto' ? 0 : 24; i < SymbolInfo.keys.length; ++i) {
                    if (SymbolInfo.values[i][2] >= codeLength) {
                        return getSymbolInfo(SymbolInfo.keys[i]);
                    }
                }
                throw new wijmo.barcode.TextTooLongException();
            }
            specialized.getSuitableSymbolSize = getSuitableSymbolSize;
            function getInfoOfRegions(size) {
                var rowOfRegion, colOfRegion;
                switch (size) {
                    case 1:
                    case 2:
                        rowOfRegion = 1;
                        break;
                    case 4:
                        rowOfRegion = 2;
                        break;
                    case 16:
                        rowOfRegion = 4;
                        break;
                    case 36:
                        rowOfRegion = 6;
                }
                colOfRegion = ~~(size / rowOfRegion);
                return { rowOfRegion: rowOfRegion, colOfRegion: colOfRegion };
            }
            specialized.getInfoOfRegions = getInfoOfRegions;
            function createModules(row, col) {
                if (!col) {
                    col = row;
                }
                var arr = [];
                for (var i = 0; i < row; i++) {
                    arr.push(wijmo.barcode.Utils.fillArray(new Array(col), null));
                }
                return arr;
            }
            specialized.createModules = createModules;
            specialized.TripletUppershift = 158;
            specialized.TripletFNC1 = 155;
            specialized.ASCIIMax = 127;
            specialized.ExtendedASCIIMin = 128;
            specialized.Space = 32;
            specialized.NumericMin = 48;
            specialized.NumericMax = 57;
            specialized.LowerCasedLetterMin = 97;
            specialized.LowerCasedLetterMax = 122;
            specialized.UpperCasedLetterMin = 65;
            specialized.UpperCasedLetterMax = 90;
            function getCharType(value) {
                if (value > specialized.ASCIIMax) {
                    if (value == specialized.CONSTANTS.FNC1Input) {
                        return 'FNC1';
                    }
                    else {
                        return 'ExtendedASCII';
                    }
                }
                if (value >= specialized.NumericMin && value <= specialized.NumericMax) {
                    return 'Numeric';
                }
                if (value >= specialized.LowerCasedLetterMin && value <= specialized.LowerCasedLetterMax) {
                    return 'LowerCasedLetter';
                }
                if (value >= specialized.UpperCasedLetterMin && value <= specialized.UpperCasedLetterMax) {
                    return 'UpperCasedLetter';
                }
                return 'ASCIIOther';
            }
            specialized.getCharType = getCharType;
            function getX12Value(value) {
                var type = getCharType(value);
                switch (type) {
                    case 'Numeric':
                        return value - 44;
                    case 'UpperCasedLetter':
                        return value - 51;
                    default:
                        switch (value) {
                            case 13:
                                return 0;
                            case 42:
                                return 1;
                            case 62:
                                return 2;
                            case 32:
                                return 3;
                        }
                        break;
                }
                return specialized.CONSTANTS.InvalidTripletValue;
            }
            specialized.getX12Value = getX12Value;
            function getTripletCharValue(charSet, value) {
                if (charSet == 'X12') {
                    return getX12Value(value);
                }
                if (value < 32) {
                    return value;
                }
                if (value == 32) {
                    return 3;
                }
                if (value < 48) {
                    return value - 33;
                }
                if (value < 58) {
                    return value - 44;
                }
                if (value < 65) {
                    return value - 43;
                }
                if (value < 91) {
                    return charSet == 'C40' ? value - 51 : value - 64;
                }
                if (value < 96) {
                    return value - 69;
                }
                if (value == 96) {
                    return 0;
                }
                if (value < 123) {
                    return charSet == 'C40' ? value - 96 : value - 83;
                }
                if (value < 128) {
                    return value - 96;
                }
                if (value == specialized.TripletFNC1 || value == specialized.TripletUppershift) {
                    return value - 128;
                }
                throw new wijmo.barcode.InvalidCharacterException(String.fromCharCode(value));
            }
            specialized.getTripletCharValue = getTripletCharValue;
            function isDigit(value) {
                return value >= specialized.NumericMin && value <= specialized.NumericMax;
            }
            specialized.isDigit = isDigit;
            function getTripletCharSetChannel(charSet, value) {
                if (charSet === 'X12')
                    return 0;
                if (value < 32)
                    return 1;
                if (value == 32)
                    return 0;
                if (value < 48)
                    return 2;
                if (value < 58)
                    return 0;
                if (value < 65)
                    return 2;
                if (value < 91) {
                    return charSet == 'C40' ? 0 : 3;
                }
                if (value < 96) {
                    return 2;
                }
                if (value == 96) {
                    return 3;
                }
                if (value < 123) {
                    return charSet === 'C40' ? 3 : 0;
                }
                if (value == specialized.CONSTANTS.TripletFNC1 || value == specialized.CONSTANTS.TripletUppershift) {
                    return 2;
                }
                return 3;
            }
            specialized.getTripletCharSetChannel = getTripletCharSetChannel;
            function getTripletEncodeValues(charSet, symbol) {
                var values = [];
                if (symbol == specialized.CONSTANTS.FNC1Input) {
                    if (charSet == 'X12') {
                        throw new wijmo.barcode.InvalidCharacterException('FNC1');
                    }
                    symbol = specialized.CONSTANTS.TripletFNC1;
                }
                else if (symbol > specialized.ASCIIMax) {
                    if (charSet == 'C40' || charSet == 'Text') {
                        values.push(specialized.CONSTANTS.TripletShifts[2]);
                        values.push(getTripletCharValue(charSet, specialized.CONSTANTS.TripletUppershift));
                        symbol -= specialized.ExtendedASCIIMin;
                    }
                    else {
                        throw new wijmo.barcode.InvalidCharacterException(String.fromCharCode(symbol));
                    }
                }
                var shift = getTripletCharSetChannel(charSet, symbol);
                if (shift > 0) {
                    values.push(specialized.CONSTANTS.TripletShifts[shift]);
                }
                values.push(getTripletCharValue(charSet, symbol));
                return values;
            }
            specialized.getTripletEncodeValues = getTripletEncodeValues;
            function getEDIFACTValue(value) {
                if (value < 32 || value > 94) {
                    return specialized.CONSTANTS.InvalidTripletValue;
                }
                return (value & specialized.CONSTANTS.EDIFACTMask);
            }
            specialized.getEDIFACTValue = getEDIFACTValue;
            function getRandomizedValue(value, position, baseValue) {
                var tempValue = value + (specialized.CONSTANTS.PseudoRandomSeed * position) % baseValue + 1;
                return tempValue > baseValue + 1 ? tempValue - baseValue - 1 : tempValue;
            }
            specialized.getRandomizedValue = getRandomizedValue;
            function mergeUnits(units) {
                var mergedList = [];
                if (units.length > 0) {
                    var current = units[0];
                    for (var i = 1; i < units.length; ++i) {
                        if (units[i].charSet != current.charSet) {
                            if (current.length > 0) {
                                mergedList.push(wijmo.barcode.Utils.assign({}, current));
                            }
                            current.charSet = units[i].charSet;
                            current.start = units[i].start;
                            current.length = units[i].length;
                        }
                        else {
                            current.length += units[i].length;
                        }
                    }
                    if (current.length > 0) {
                        mergedList.push(current);
                    }
                }
                return mergedList;
            }
            specialized.mergeUnits = mergeUnits;
            function setFinder(matrix, info, rowOffset, colOffset) {
                var regionColumns = info.regionColumns, regionRows = info.regionRows;
                regionRows += 2;
                regionColumns += 2;
                rowOffset *= regionRows;
                colOffset *= regionColumns;
                var firstRow = matrix[rowOffset];
                for (var i = colOffset; i < colOffset + regionColumns; i++) {
                    if (wijmo.barcode.Utils.isEven(i)) {
                        firstRow[i] = 1;
                    }
                    else {
                        firstRow[i] = 0;
                    }
                }
                var lastRow = matrix[rowOffset + regionRows - 1];
                for (var i = colOffset; i < colOffset + regionColumns; i++) {
                    lastRow[i] = 1;
                }
                for (var i = rowOffset; i < rowOffset + regionRows; i++) {
                    matrix[i][colOffset] = 1;
                    if (wijmo.barcode.Utils.isEven(i)) {
                        matrix[i][colOffset + regionColumns - 1] = 0;
                    }
                    else {
                        matrix[i][colOffset + regionColumns - 1] = 1;
                    }
                }
            }
            specialized.setFinder = setFinder;
            function setRegionData(matrix, info, r, c, data) {
                var regionColumns = info.regionColumns, regionRows = info.regionRows;
                var targetRowOffset = r * (regionRows + 2) + 1;
                var targetColOffset = c * (regionColumns + 2) + 1;
                var orginRowOffset = r * regionRows;
                var originColOffset = c * regionColumns;
                for (var r_1 = 0; r_1 < regionRows; ++r_1) {
                    for (var c_1 = 0; c_1 < regionColumns; ++c_1) {
                        matrix[targetRowOffset + r_1][targetColOffset + c_1] = data[orginRowOffset + r_1][originColOffset + c_1];
                    }
                }
            }
            specialized.setRegionData = setRegionData;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var ECC000_140 = /** @class */ (function () {
                function ECC000_140(text, config) {
                    this.text = text;
                    this.m_symbol = wijmo.barcode.Utils.str2Array(text).map(function (c) { return c.charCodeAt(0); });
                    this.symbolSize = config.ecc000_140SymbolSize;
                    this.eccMode = config.eccMode;
                    this.m_code = [];
                    this.m_module = [];
                }
                ECC000_140.prototype.getMatrix = function () {
                    var _a = this, m_symbol = _a.m_symbol, symbolSize = _a.symbolSize, eccMode = _a.eccMode, m_code = _a.m_code;
                    if (m_symbol.length > 569) {
                        throw new wijmo.barcode.TextTooLongException();
                    }
                    var scheme = specialized.chooseEncodationScheme(m_symbol);
                    var headerBits = eccMode === 'ECC000' ? 7 : 19;
                    var dataBits = this.calculateDataBits(scheme);
                    var totalBits = this.calculateTotalBits(scheme, headerBits, dataBits);
                    var _symbolSize = this._symbolSize = specialized.getProperSymbolSize(symbolSize, totalBits);
                    if (totalBits > specialized.getSymbolSizeInfo(_symbolSize)) {
                        throw new wijmo.barcode.TextTooLongException();
                    }
                    dataBits += 5 + 16 + 9;
                    var encodedData = [];
                    var dataIterator = new specialized.BitwiseIterator(encodedData);
                    dataIterator.putBitsMSF(specialized.Constants_140.getFormatID(scheme) << 27, 5);
                    var crc = this.crcProcess(scheme);
                    dataIterator.putBitsLSF(crc, 16);
                    dataIterator.putBitsLSF(m_symbol.length, 9);
                    this.encode(scheme, dataIterator);
                    var symbolIterator = new specialized.BitwiseIterator(m_code);
                    symbolIterator.putBitsLSF(specialized.getECC(eccMode).headerBits, headerBits);
                    dataIterator.offset = 0;
                    this.eccProcess(symbolIterator, dataIterator, dataBits);
                    this.randomizeBits();
                    return this.placeModule();
                };
                ECC000_140.prototype.eccProcess = function (symbolIterator, dataIterator, dataBits) {
                    var eccMode = this.eccMode;
                    // ECC000 mode doesn't provide error checking and correction bits.
                    if (eccMode === 'ECC000') {
                        while (dataIterator.offset < dataBits) {
                            symbolIterator.putBit(dataIterator.fetchBit());
                        }
                        return;
                    }
                    var info = specialized.getECC(eccMode).eccInfo;
                    var registers = [info.inputBits];
                    var done = false;
                    do {
                        done = false;
                        // shifts input bits to registers.
                        for (var i = 0; i < info.inputBits; ++i) {
                            registers[i] >>= 1;
                            registers[i] = specialized.setBit(registers[i], info.registerBits[i], dataIterator.fetchBit());
                        }
                        // calculate each output gate's value and put to the related symbol position.
                        var bit = false;
                        for (var i = 0; i < info.outputBits; ++i) {
                            bit = false;
                            for (var j = 0; j < info.outputMasks[i].length; ++j) {
                                bit ^= ((registers[info.outputMasks[i][j].registerNumber] & info.outputMasks[i][j].mask) != 0);
                            }
                            symbolIterator.putBit(bit);
                        }
                        // check whether the ecc process should be ended.
                        if (dataIterator.offset >= dataBits) {
                            var i = 0;
                            for (; i < registers.length; ++i) {
                                if (registers[i] != 0) {
                                    break;
                                }
                            }
                            if (i == registers.length) {
                                done = true;
                            }
                        }
                    } while (!done);
                };
                ECC000_140.prototype.randomizeBits = function () {
                    var _a = this, m_code = _a.m_code, _symbolSize = _a._symbolSize;
                    var bytes = ~~((specialized.getSymbolSizeInfo(_symbolSize) + 7) / 8);
                    for (var i = 0; i < bytes; ++i) {
                        m_code[i] ^= specialized.Constants_140.RandomizeBytes[i];
                    }
                };
                ECC000_140.prototype.crcProcess = function (scheme) {
                    var m_symbol = this.m_symbol;
                    var register = 0;
                    var bytes = [];
                    // add the two crc header bytes before the data bytes.
                    bytes.push(specialized.Constants_140.getFormatID(scheme) + 1);
                    bytes.push(0);
                    bytes.push.apply(bytes, m_symbol);
                    var mask = 0x8408; // the polynominal is x^16 + x^12 + x^5 + 1;
                    for (var i = 0; i < bytes.length; ++i) {
                        for (var b = 0; b < 8; ++b) {
                            var lsb = (register & 1) != 0;
                            register >>= 1;
                            if (((bytes[i] & (1 << b)) != 0) ^ lsb) {
                                register ^= mask;
                            }
                        }
                    }
                    return register;
                };
                ECC000_140.prototype.calculateDataBits = function (scheme) {
                    var m_symbol = this.m_symbol;
                    var groupLength = specialized.Constants_140.GroupLengths[scheme];
                    return ~~(m_symbol.length / groupLength) * specialized.Constants_140.BitLengths[scheme][0]
                        + (m_symbol.length % groupLength == 0 ? 0 : specialized.Constants_140.BitLengths[scheme][m_symbol.length % groupLength]);
                };
                ECC000_140.prototype.calculateTotalBits = function (scheme, headerBits, dataBits) {
                    var eccMode = this.eccMode;
                    var unprotectedLength = 5 + 16 + 9 + dataBits;
                    var info = specialized.getECC(eccMode).eccInfo;
                    var protectedLength = (~~((unprotectedLength + info.inputBits - 1) / info.inputBits) + info.registerBits[info.inputBits - 1]) * info.outputBits;
                    return headerBits + protectedLength;
                };
                ECC000_140.prototype.encode = function (scheme, bf) {
                    var m_symbol = this.m_symbol;
                    var value = 0;
                    var s_num = scheme;
                    var g_len = specialized.Constants_140.GroupLengths[s_num];
                    var baseValue = specialized.Constants_140.BaseValues[s_num];
                    for (var i = 0; i < m_symbol.length;) {
                        value = 0;
                        var b = 1;
                        // encode input data by group.
                        do {
                            value += (specialized.getCodeWord(scheme, m_symbol[i++]) * b);
                            b *= baseValue;
                        } while (i % g_len != 0 && i < m_symbol.length);
                        var e_len = i % g_len;
                        bf.putBitsLSF(value, specialized.Constants_140.BitLengths[s_num][e_len]);
                    }
                };
                ECC000_140.prototype.placeModule = function () {
                    var _a = this, m_module = _a.m_module, _symbolSize = _a._symbolSize, m_code = _a.m_code;
                    var size = specialized.getSymbolSizeInfo(_symbolSize);
                    var m_iterator = new specialized.BitwiseIterator(m_module);
                    var c_iterator = new specialized.BitwiseIterator(m_code);
                    var mapping = specialized.getModuleMapping(_symbolSize);
                    for (var i = 0; i < size; ++i) {
                        m_iterator.putBit(c_iterator.getBit(mapping[i]));
                    }
                    var symbolRows = specialized.getSymbolSizeValue(_symbolSize) * 2 + 9;
                    var matrix = specialized.createModules(symbolRows);
                    specialized.setFinder_140(matrix, symbolRows);
                    specialized.setRegionData_140(matrix, symbolRows, m_iterator);
                    return matrix;
                };
                return ECC000_140;
            }());
            specialized.ECC000_140 = ECC000_140;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var SymbolCharacterPlacement = /** @class */ (function () {
                function SymbolCharacterPlacement(data, nrow, ncol) {
                    this.nrow = nrow;
                    this.ncol = ncol;
                    this.data = data;
                    this.matrix = specialized.createModules(nrow, ncol);
                }
                SymbolCharacterPlacement.prototype.ECC200 = function () {
                    var _a = this, nrow = _a.nrow, ncol = _a.ncol, matrix = _a.matrix;
                    var row = 4, col = 0, chr = 0;
                    do {
                        /* repeatedly first check for one of the special corner cases, then... */
                        if ((row == nrow) && (col == 0)) {
                            this.corner1(chr++);
                        }
                        if ((row == nrow - 2) && (col == 0) && (ncol % 4)) {
                            this.corner2(chr++);
                        }
                        if ((row == nrow - 2) && (col == 0) && (ncol % 8 == 4)) {
                            this.corner3(chr++);
                        }
                        if ((row == nrow + 4) && (col == 2) && (!(ncol % 8))) {
                            this.corner4(chr++);
                        }
                        /* sweep upward diagonally, inserting successive characters,... */
                        do {
                            if ((row < nrow) && (col >= 0) && (matrix[row][col] === null)) {
                                this.utah(row, col, chr++);
                            }
                            row -= 2;
                            col += 2;
                        } while ((row >= 0) && (col < ncol));
                        row += 1;
                        col += 3;
                        /* & then sweep downward diagonally, inserting successive characters,... */
                        do {
                            if ((row >= 0) && (col < ncol) && (matrix[row][col] === null)) {
                                this.utah(row, col, chr++);
                            }
                            row += 2;
                            col -= 2;
                        } while ((row < nrow) && (col >= 0));
                        row += 3;
                        col += 1;
                    } while ((row < nrow) || (col < ncol));
                    /* Lastly, if the lower righthand corner is untouched, fill in fixed pattern */
                    if (!matrix[nrow - 1][ncol - 1]) {
                        matrix[nrow - 1][ncol - 1] = matrix[nrow - 2][ncol - 2] = 1;
                        matrix[nrow - 2][ncol - 1] = matrix[nrow - 1][ncol - 2] = 0;
                    }
                    return matrix;
                };
                SymbolCharacterPlacement.prototype.module = function (row, col, chr, bit) {
                    var _a = this, nrow = _a.nrow, ncol = _a.ncol, matrix = _a.matrix, data = _a.data;
                    if (row < 0) {
                        row += nrow;
                        col += 4 - ((nrow + 4) % 8);
                    }
                    if (col < 0) {
                        col += ncol;
                        row += 4 - ((ncol + 4) % 8);
                    }
                    var bitMask = (1 << (8 - bit)) % 256;
                    matrix[row][col] = (data[chr] & bitMask) != 0 ? 1 : 0;
                };
                SymbolCharacterPlacement.prototype.utah = function (row, col, chr) {
                    this.module(row - 2, col - 2, chr, 1);
                    this.module(row - 2, col - 1, chr, 2);
                    this.module(row - 1, col - 2, chr, 3);
                    this.module(row - 1, col - 1, chr, 4);
                    this.module(row - 1, col, chr, 5);
                    this.module(row, col - 2, chr, 6);
                    this.module(row, col - 1, chr, 7);
                    this.module(row, col, chr, 8);
                };
                /* "cornerN" places 8 bits of the four special corner cases in ECC200 */
                SymbolCharacterPlacement.prototype.corner1 = function (chr) {
                    var _a = this, nrow = _a.nrow, ncol = _a.ncol;
                    this.module(nrow - 1, 0, chr, 1);
                    this.module(nrow - 1, 1, chr, 2);
                    this.module(nrow - 1, 2, chr, 3);
                    this.module(0, ncol - 2, chr, 4);
                    this.module(0, ncol - 1, chr, 5);
                    this.module(1, ncol - 1, chr, 6);
                    this.module(2, ncol - 1, chr, 7);
                    this.module(3, ncol - 1, chr, 8);
                };
                SymbolCharacterPlacement.prototype.corner2 = function (chr) {
                    var _a = this, nrow = _a.nrow, ncol = _a.ncol;
                    this.module(nrow - 3, 0, chr, 1);
                    this.module(nrow - 2, 0, chr, 2);
                    this.module(nrow - 1, 0, chr, 3);
                    this.module(0, ncol - 4, chr, 4);
                    this.module(0, ncol - 3, chr, 5);
                    this.module(0, ncol - 2, chr, 6);
                    this.module(0, ncol - 1, chr, 7);
                    this.module(1, ncol - 1, chr, 8);
                };
                SymbolCharacterPlacement.prototype.corner3 = function (chr) {
                    var _a = this, nrow = _a.nrow, ncol = _a.ncol;
                    this.module(nrow - 3, 0, chr, 1);
                    this.module(nrow - 2, 0, chr, 2);
                    this.module(nrow - 1, 0, chr, 3);
                    this.module(0, ncol - 2, chr, 4);
                    this.module(0, ncol - 1, chr, 5);
                    this.module(1, ncol - 1, chr, 6);
                    this.module(2, ncol - 1, chr, 7);
                    this.module(3, ncol - 1, chr, 8);
                };
                SymbolCharacterPlacement.prototype.corner4 = function (chr) {
                    var _a = this, nrow = _a.nrow, ncol = _a.ncol;
                    this.module(nrow - 1, 0, chr, 1);
                    this.module(nrow - 1, ncol - 1, chr, 2);
                    this.module(0, ncol - 3, chr, 3);
                    this.module(0, ncol - 2, chr, 4);
                    this.module(0, ncol - 1, chr, 5);
                    this.module(1, ncol - 3, chr, 6);
                    this.module(1, ncol - 2, chr, 7);
                    this.module(1, ncol - 1, chr, 8);
                };
                return SymbolCharacterPlacement;
            }());
            specialized.SymbolCharacterPlacement = SymbolCharacterPlacement;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            function mod256(num) {
                return num % 256;
            }
            function roundUpCodeLength(num) {
                return Math.ceil(num - 1e-5);
            }
            var ECC200 = /** @class */ (function () {
                function ECC200(text, config) {
                    this.text = text;
                    this.m_symbol = wijmo.barcode.Utils.str2Array(text).map(function (c) { return c.charCodeAt(0); });
                    this.symbolSize = config.ecc200SymbolSize;
                    this.encodingMode = config.ecc200EncodingMode;
                    this.structuredAppend = config.structuredAppend;
                    this.structureNumber = config.structureNumber;
                    this.fileIdentifier = config.fileIdentifier;
                    this.symbolInfo = specialized.getSymbolInfo('square144');
                    this.m_code = [];
                }
                ECC200.prototype.preEncode = function (c_pos, s_pos) {
                    var _a = this, m_symbol = _a.m_symbol, m_code = _a.m_code;
                    var first = m_symbol[0];
                    if (first == specialized.CONSTANTS.Macro05Input || first == specialized.CONSTANTS.Macro06Input) {
                        m_code[c_pos++] = first == specialized.CONSTANTS.Macro05Input ? specialized.CONSTANTS.Macro05 : specialized.CONSTANTS.Macro06;
                        s_pos++;
                    }
                    return { c_pos: c_pos, s_pos: s_pos };
                };
                ECC200.prototype.checkValue = function (start) {
                    var _a = this, encodingMode = _a.encodingMode, m_symbol = _a.m_symbol;
                    if (encodingMode == 'X12' || encodingMode == 'EDIFACT') {
                        for (var i = start; i < m_symbol.length; ++i)
                            if (specialized.getTripletCharValue(encodingMode, m_symbol[i]) == specialized.CONSTANTS.InvalidTripletValue)
                                return false;
                    }
                    return true;
                };
                ECC200.prototype.getEncodingLength = function (charSet, codeWords, start, length) {
                    var m_symbol = this.m_symbol;
                    if (codeWords < 0)
                        return -1;
                    var e_len = 0;
                    switch (charSet) {
                        case 'ASCII':
                            e_len = codeWords;
                            break;
                        case 'C40':
                        case 'Text':
                            e_len = ~~((codeWords + 2) / 3) * 2 + 2; // including latch and unlatch
                            break;
                        case 'X12':
                            e_len = ~~((codeWords + 2) / 3) * 2 + 2; // including latch and unlatch
                            if (codeWords % 3 == 1
                                || codeWords % 3 == 2 && specialized.isDigit(m_symbol[start + length - 2]) && specialized.isDigit(m_symbol[start + length - 1]))
                                --e_len;
                            break;
                        case 'EDIFACT':
                            ++codeWords;
                            e_len = ~~(codeWords / 4) * 3 + codeWords % 4 + 1;
                            break;
                        case 'Base256':
                            e_len = codeWords + 1 + (codeWords > specialized.CONSTANTS.Base256SmallBlockSize ? 2 : 1);
                            break;
                    }
                    return e_len;
                };
                ECC200.prototype.getMaxProperLength = function (start, maxLength) {
                    var _a = this, m_symbol = _a.m_symbol, encodingMode = _a.encodingMode;
                    var min = start + 1, max = m_symbol.length;
                    var curr = ~~((min + max) / 2);
                    var length = 0;
                    var ec_len = 0;
                    while (min < max) {
                        curr = ~~((min + max) / 2);
                        ec_len = this.getEncodingLength(encodingMode, this.getCodeWordLength(encodingMode, start, curr - start), start, curr - start);
                        if (ec_len < 0 || ec_len > maxLength) {
                            max = curr - 1;
                        }
                        else {
                            min = curr + 1;
                        }
                    }
                    if (min > start) {
                        if (curr < min) {
                            ec_len = this.getEncodingLength(encodingMode, this.getCodeWordLength(encodingMode, start, min - start), start, min - start);
                            if (ec_len < 0 || ec_len > maxLength) {
                                length = curr - start;
                            }
                            else {
                                length = min - start;
                            }
                        }
                        else {
                            curr = Math.min(curr, min);
                            ec_len = this.getEncodingLength(encodingMode, this.getCodeWordLength(encodingMode, start, curr - start), start, curr - start);
                            if (ec_len < 0 || ec_len > maxLength) {
                                length = curr - start - 1;
                            }
                            else {
                                length = curr - start;
                            }
                        }
                    }
                    return Math.max(0, length);
                };
                ECC200.prototype.getCodeWordLength = function (charSet, start, length) {
                    var m_symbol = this.m_symbol;
                    var codeWords = 0;
                    for (var i = start; i < start + length; ++i) {
                        var data = m_symbol[i];
                        switch (charSet) {
                            case 'ASCII':
                                codeWords += (data > specialized.ASCIIMax && data != specialized.CONSTANTS.FNC1Input) ? 2 : 1;
                                if (i < start + length - 1 && specialized.isDigit(data) && specialized.isDigit(m_symbol[i + 1])) {
                                    ++i;
                                }
                                break;
                            case 'C40':
                            case 'Text':
                                if (data == specialized.CONSTANTS.FNC1Input) {
                                    data = specialized.CONSTANTS.TripletFNC1;
                                }
                                else if (data > specialized.ASCIIMax) {
                                    codeWords += 2;
                                    data -= 128;
                                }
                                codeWords += specialized.getTripletCharSetChannel(charSet, data) == 0 ? 1 : 2;
                                break;
                            case 'X12':
                                if (specialized.getX12Value(data) == specialized.CONSTANTS.InvalidTripletValue) {
                                    codeWords = -1;
                                }
                                else {
                                    codeWords += 1;
                                }
                                break;
                            case 'EDIFACT':
                                if (specialized.getEDIFACTValue(data) == specialized.CONSTANTS.InvalidTripletValue) {
                                    codeWords = -1;
                                }
                                else {
                                    codeWords += 1;
                                }
                                break;
                            case 'Base256':
                                codeWords += 1;
                                break;
                        }
                        if (codeWords < 0)
                            return codeWords;
                    }
                    return codeWords;
                };
                ECC200.prototype.getCodeLength = function (unit) {
                    return this.getEncodingLength(unit.charSet, this.getCodeWordLength(unit.charSet, unit.start, unit.length), unit.start, unit.length);
                };
                ECC200.prototype.getEncodingUnitsInfomative = function (start, maxLength, s_taken) {
                    var _a;
                    var m_symbol = this.m_symbol;
                    s_taken = 0;
                    var sequence = [], currentUnit = {
                        charSet: 'ASCII',
                        start: start,
                        length: 0,
                        codeWords: 0,
                        encodingLength: 0
                    };
                    var currentLength = 0; // represents the current encoded code length.
                    var offset = start; // represents the current position of m_symbol.
                    var charSetShifted = false;
                    var symbolLength = m_symbol.length;
                    while (offset < symbolLength) {
                        charSetShifted = false;
                        switch (currentUnit.charSet) {
                            case 'ASCII': //eslint-disable-line
                                var c_Length = 0;
                                while (offset + c_Length < m_symbol.length - 1 && currentLength + ~~(c_Length / 2) < maxLength
                                    && specialized.isDigit(m_symbol[offset + c_Length]) && specialized.isDigit(m_symbol[offset + c_Length + 1])) {
                                    c_Length += 2;
                                }
                                if (c_Length > 0) {
                                    currentUnit.codeWords += c_Length >> 1;
                                    offset += c_Length;
                                    if (currentLength + ~~(c_Length / 2) >= maxLength) {
                                        break;
                                    }
                                    continue;
                                }
                                break;
                            case 'C40':
                            case 'Text':
                            case 'X12':
                                // finish current triplet before look ahead or shift encoding char set.
                                do {
                                    if (m_symbol[offset] > specialized.ASCIIMax) {
                                        currentUnit.codeWords += 2;
                                    }
                                    if (specialized.getTripletCharSetChannel(currentUnit.charSet, m_symbol[offset]) > 0) {
                                        ++currentUnit.codeWords;
                                    }
                                    ++currentUnit.codeWords;
                                    ++offset;
                                } while (currentUnit.codeWords % 3 != 0 && offset < symbolLength);
                                break;
                            case 'EDIFACT':
                                // finish current quaternion before look ahead or shift encoding char set.
                                do {
                                    ++currentUnit.codeWords;
                                    ++offset;
                                } while ((currentUnit.codeWords & 0x3) != 0 && offset < symbolLength);
                                break;
                            case 'Base256':
                                ++currentUnit.codeWords;
                                ++offset;
                                break;
                        }
                        var d_len = 0; // represents the data length processed by the look ahead method.
                        var r_len = maxLength - (currentLength + this.getEncodingLength(currentUnit.charSet, currentUnit.codeWords, currentUnit.start, offset - currentUnit.start));
                        var cr_len = r_len; // represents the max encoded length passed to the look ahead method,
                        // which will decrease until the encoded length of look ahead method processed data is not greater than current remaining code bytes.
                        var newCharset = currentUnit.charSet;
                        // this procedure calculates the proper encoding charset for the remaining input data.
                        do {
                            (_a = this.lookAhead(currentUnit.charSet, offset, cr_len, d_len), d_len = _a.d_len, newCharset = _a.newCharset);
                        } while (--cr_len > 0 && this.getEncodingLength(newCharset, this.getCodeWordLength(newCharset, offset, d_len), offset, d_len) > r_len);
                        if (cr_len <= 0) {
                            break;
                        }
                        // process char set shifting.
                        if (currentUnit.charSet != newCharset) {
                            currentUnit.length = offset - currentUnit.start;
                            if (currentUnit.length > 0) {
                                sequence.push(currentUnit);
                                currentLength += this.getEncodingLength(currentUnit.charSet, currentUnit.codeWords, currentUnit.start, currentUnit.length);
                            }
                            currentUnit = {
                                charSet: newCharset,
                                start: offset,
                                length: 0,
                                codeWords: 0,
                                encodingLength: 0
                            };
                            charSetShifted = true;
                        }
                        // because ASCII will be used instaed of some char set at the end of date bytes,
                        // end the loop calculating and looking ahead if the encoded code length reaches the very length.
                        var endPoint = maxLength - 1;
                        if (currentUnit.charSet == 'EDIFACT') {
                            --endPoint;
                        }
                        if (currentUnit.charSet == 'Base256') {
                            ++endPoint;
                        }
                        if (currentLength + this.getEncodingLength(currentUnit.charSet, currentUnit.codeWords, currentUnit.start, currentUnit.length) >= endPoint) {
                            break;
                        }
                        // process current symbol byte with ASCII by default.
                        if (!charSetShifted && currentUnit.charSet == 'ASCII') {
                            ++currentUnit.codeWords;
                            ++offset;
                        }
                    }
                    // finish current unit.
                    currentUnit.length = offset - currentUnit.start;
                    if (currentUnit.length > 0) {
                        sequence.push(currentUnit);
                        currentLength += this.getEncodingLength(currentUnit.charSet, currentUnit.codeWords, currentUnit.start, currentUnit.length);
                    }
                    // create a new unit for the remaining data.
                    currentUnit = {
                        charSet: 'ASCII',
                        start: offset,
                        length: 0,
                        codeWords: 0,
                        encodingLength: 0
                    };
                    while (currentLength < maxLength && offset < m_symbol.length) {
                        if (m_symbol[offset] > specialized.ASCIIMax && m_symbol[offset] != specialized.CONSTANTS.FNC1Input) {
                            if (currentLength < maxLength - 1) {
                                ++currentLength;
                            }
                            else {
                                break;
                            }
                        }
                        ++currentLength;
                        ++offset;
                    }
                    if (offset > currentUnit.start) {
                        currentUnit.length = offset - currentUnit.start;
                        sequence.push(currentUnit);
                    }
                    s_taken = offset - start;
                    return { s_taken: s_taken, units: specialized.mergeUnits(sequence) };
                };
                ECC200.prototype.getEncodingUnits = function (s_pos, maxLength) {
                    var _this = this;
                    var _a;
                    var _b = this, encodingMode = _b.encodingMode, m_symbol = _b.m_symbol;
                    var units;
                    var codeLength = 0, s_taken = 0;
                    if (s_pos < m_symbol.length) {
                        if (encodingMode !== 'auto') {
                            if (encodingMode === 'C40' || encodingMode == 'Text' || encodingMode == 'X12') {
                                maxLength++;
                            }
                            s_taken = this.getMaxProperLength(s_pos, maxLength);
                            var unit = {
                                charSet: encodingMode,
                                start: s_pos,
                                length: s_taken,
                                codeWords: 0,
                                encodingLength: 0
                            };
                            unit.codeWords = this.getCodeWordLength(unit.charSet, unit.start, unit.length);
                            unit.encodingLength = this.getEncodingLength(unit.charSet, unit.codeWords, unit.start, unit.length);
                            // under X12 charset, only when the remaining code words' count is 2, the unlatch cannot be ignored.
                            if (unit.charSet == 'X12' && unit.encodingLength == maxLength && unit.codeWords % 3 == 2) {
                                --s_taken;
                                --unit.length;
                                --unit.codeWords;
                                --unit.encodingLength;
                            }
                            units = [unit];
                        }
                        else {
                            (_a = this.getEncodingUnitsInfomative(s_pos, maxLength, s_taken), units = _a.units, s_taken = _a.s_taken);
                        }
                        units.forEach(function (unit, i) {
                            codeLength += _this.getCodeLength(unit);
                            if (i === units.length - 1 && (unit.charSet === 'C40' || unit.charSet === 'Text' || unit.charSet === 'X12' && (unit.codeWords & 1) === 1)) {
                                codeLength--;
                            }
                        });
                    }
                    return { c_length: codeLength, s_taken: s_taken, units: units };
                };
                ECC200.prototype.encodeStructureHeader = function (c_pos, structureCount, fileInfo) {
                    var _a = this, m_code = _a.m_code, structureNumber = _a.structureNumber;
                    m_code[c_pos++] = specialized.CONSTANTS.StructuredAppand;
                    m_code[c_pos++] = mod256((structureNumber << 4) | (16 - structureCount + 1));
                    var fi = this.generateFileIdentifier(structureCount, fileInfo);
                    m_code[c_pos++] = mod256(fi >> 8);
                    m_code[c_pos++] = mod256(fi);
                    return c_pos;
                };
                ECC200.prototype.generateFileIdentifier = function (structureCount, fileInfo) {
                    var _a = this, m_symbol = _a.m_symbol, fileIdentifier = _a.fileIdentifier;
                    var b1 = fileInfo % specialized.CONSTANTS.FileIdentifierMax + 1;
                    var b2 = fileIdentifier == 0 ?
                        (m_symbol.length % specialized.CONSTANTS.FileIdentifierMax + 1) : fileIdentifier;
                    return ((b1 << 8) | b2);
                };
                ECC200.prototype.encode = function (unit, c_pos) {
                    switch (unit.charSet) {
                        case 'ASCII':
                            return this.encodeASCII(unit.start, unit.length, c_pos);
                        case 'C40':
                            return this.encodeC40(unit.start, unit.length, c_pos);
                        case 'Text':
                            return this.encodeText(unit.start, unit.length, c_pos);
                        case 'X12':
                            return this.encodeX12(unit.start, unit.length, c_pos);
                        case 'EDIFACT':
                            return this.encodeEDIFACT(unit.start, unit.length, c_pos);
                        case 'Base256':
                            return this.encodeBase256(unit.start, unit.length, c_pos);
                    }
                };
                ECC200.prototype.encodeASCII = function (start, length, c_pos) {
                    var _a = this, m_code = _a.m_code, m_symbol = _a.m_symbol;
                    for (var i = start, len = start + length; i < len; i++) {
                        var type = specialized.getCharType(m_symbol[i]);
                        if (type === 'FNC1') {
                            m_code.push(specialized.CONSTANTS.ASCIIFNC1);
                            c_pos++;
                            continue;
                        }
                        else if (type === 'ExtendedASCII') {
                            m_code.push(specialized.CONSTANTS.ASCIIUpperShift);
                            m_code.push(m_symbol[i] - specialized.ASCIIMax);
                            c_pos += 2;
                            continue;
                        }
                        else if (i + 1 < len && type === 'Numeric' && specialized.getCharType(m_symbol[i + 1]) === 'Numeric') {
                            var n = ((m_symbol[i] - 48) * 10) + (m_symbol[i + 1] - 48) + 130;
                            m_code.push(n);
                            c_pos++;
                            i++;
                            continue;
                        }
                        m_code.push(m_symbol[i] + 1);
                        c_pos++;
                    }
                    return c_pos;
                };
                ECC200.prototype.encodeTriplet = function (charSet, start, length, c_pos) {
                    var _a = this, m_code = _a.m_code, m_symbol = _a.m_symbol, symbolInfo = _a.symbolInfo;
                    var eVal = 0, eLen = 0, values = null, penddingVals = [], index = start;
                    switch (charSet) {
                        case 'C40':
                            m_code[c_pos++] = specialized.CONSTANTS.LatchToC40;
                            break;
                        case 'Text':
                            m_code[c_pos++] = specialized.CONSTANTS.LatchToText;
                            break;
                        case 'X12':
                            m_code[c_pos++] = specialized.CONSTANTS.LatchToX12;
                            break;
                    }
                    while (index < start + length) {
                        values = specialized.getTripletEncodeValues(charSet, m_symbol[index++]);
                        penddingVals = penddingVals.concat(values);
                    }
                    while (c_pos <= symbolInfo.symbolDataCapacity - 2 && penddingVals.length >= 3) {
                        eVal = 0;
                        for (eLen = 0; eLen < 3; ++eLen) {
                            eVal *= 40;
                            eVal += penddingVals.length > 0 ? penddingVals.shift() : 0;
                        }
                        ++eVal;
                        m_code[c_pos++] = eVal >> 8;
                        m_code[c_pos++] = eVal & 0xff;
                    }
                    var unlatch = true;
                    if (penddingVals.length > 0) {
                        var capacity = symbolInfo.symbolDataCapacity - c_pos;
                        var currStart = start + length - penddingVals.length;
                        var currLength = penddingVals.length;
                        if (capacity === 0 || penddingVals.length > 3
                            || penddingVals.length >= 2 && capacity < 2
                            || charSet === 'X12' && this.getEncodingLength('ASCII', this.getCodeWordLength('ASCII', currStart, currLength), currStart, currLength) > (capacity == 1 ? 1 : capacity - 1)) {
                            throw new wijmo.barcode.TextTooLongException();
                        }
                        unlatch = false;
                        if (capacity >= 2) {
                            if (charSet == 'X12') {
                                m_code[c_pos++] = specialized.CONSTANTS.TripletUnlatch;
                                c_pos = this.encodeASCII(index - penddingVals.length, penddingVals.length, c_pos);
                            }
                            else {
                                unlatch = true;
                                for (eLen = 0, eVal = 0; eLen < 3; ++eLen) {
                                    eVal *= 40;
                                    eVal += penddingVals.length > 0 ? penddingVals.shift() : 0;
                                }
                                ++eVal;
                                m_code[c_pos++] = eVal >> 8;
                                m_code[c_pos++] = eVal & 0xff;
                            }
                        }
                        else {
                            var lastSymbol = m_symbol[index - 1];
                            if (charSet === 'X12') {
                                c_pos = this.encodeASCII(index - 1, 1, c_pos);
                            }
                            else {
                                if (lastSymbol > specialized.ASCIIMax) {
                                    m_code[c_pos - 2] = specialized.CONSTANTS.TripletUnlatch;
                                    --c_pos;
                                }
                                c_pos = this.encodeASCII(index - 1, 1, c_pos);
                            }
                        }
                    }
                    if (unlatch && c_pos < symbolInfo.symbolDataCapacity) {
                        m_code[c_pos++] = specialized.CONSTANTS.TripletUnlatch;
                    }
                    return c_pos;
                };
                ECC200.prototype.encodeC40 = function (start, length, c_pos) {
                    return this.encodeTriplet('C40', start, length, c_pos);
                };
                ECC200.prototype.encodeText = function (start, length, c_pos) {
                    return this.encodeTriplet('Text', start, length, c_pos);
                };
                ECC200.prototype.encodeX12 = function (start, length, c_pos) {
                    return this.encodeTriplet('X12', start, length, c_pos);
                };
                ECC200.prototype.encodeEDIFACT = function (start, length, c_pos) {
                    var _a = this, m_code = _a.m_code, m_symbol = _a.m_symbol, symbolInfo = _a.symbolInfo, text = _a.text;
                    m_code[c_pos++] = specialized.CONSTANTS.LatchToEDIFACT;
                    var eLen = 0, eVal = 0, index = start;
                    var unlatched = false;
                    for (; index < start + length && symbolInfo.symbolDataCapacity - c_pos > 2;) {
                        eLen = 0;
                        eVal = 0;
                        while (eLen < 4) {
                            ++eLen;
                            var value = 0;
                            if (index < start + length) {
                                value = specialized.getEDIFACTValue(m_symbol[index++]);
                                if (value == specialized.CONSTANTS.InvalidTripletValue) {
                                    throw new wijmo.barcode.InvalidTextException(text);
                                }
                            }
                            else if (index == start + length) {
                                value = specialized.CONSTANTS.EDIFACTUnlatch;
                                unlatched = true;
                                ++index;
                            }
                            else {
                                --eLen;
                                break;
                            }
                            eVal <<= 6;
                            eVal |= value;
                        }
                        switch (eLen) {
                            case 1:
                                m_code[c_pos++] = mod256(eVal << 2);
                                break;
                            case 2:
                                m_code[c_pos++] = mod256(eVal >> 4);
                                m_code[c_pos++] = mod256(eVal << 4);
                                break;
                            case 3:
                                m_code[c_pos++] = mod256(eVal >> 10);
                                m_code[c_pos++] = mod256(eVal >> 2);
                                m_code[c_pos++] = mod256(eVal << 6);
                                break;
                            case 4:
                                m_code[c_pos++] = mod256(eVal >> 16);
                                m_code[c_pos++] = mod256(eVal >> 8);
                                m_code[c_pos++] = mod256(eVal);
                                break;
                        }
                    }
                    if (index < start + length) {
                        c_pos = this.encodeASCII(index, m_symbol.length - index, c_pos);
                    }
                    else if (!unlatched && c_pos < symbolInfo.symbolDataCapacity - 2) {
                        m_code[c_pos++] = specialized.CONSTANTS.EDIFACTUnlatch << 2;
                    }
                    return c_pos;
                };
                ECC200.prototype.encodeBase256 = function (start, length, c_pos) {
                    var _a = this, m_code = _a.m_code, m_symbol = _a.m_symbol;
                    m_code[c_pos++] = specialized.CONSTANTS.LatchToBase256;
                    if (length > specialized.CONSTANTS.Base256SmallBlockSize) {
                        m_code[c_pos++] = specialized.getRandomizedValue((specialized.CONSTANTS.Base256SmallBlockSize + length / specialized.CONSTANTS.Base256SmallBlockSize), c_pos, specialized.CONSTANTS.Base256RandomBase);
                    }
                    m_code[c_pos++] = specialized.getRandomizedValue((length % (specialized.CONSTANTS.Base256SmallBlockSize + 1)), c_pos, specialized.CONSTANTS.Base256RandomBase);
                    for (var i = start; i < start + length; ++i) {
                        m_code[c_pos++] = specialized.getRandomizedValue(m_symbol[i], c_pos, specialized.CONSTANTS.Base256RandomBase);
                    }
                    return c_pos;
                };
                ECC200.prototype.padRight = function (c_pos) {
                    var _a = this, m_code = _a.m_code, symbolInfo = _a.symbolInfo;
                    for (var i = c_pos; i < symbolInfo.symbolDataCapacity; i++) {
                        m_code[i] = i == c_pos ? specialized.CONSTANTS.ASCIIPad : specialized.getRandomizedValue(specialized.CONSTANTS.ASCIIPad, i + 1, specialized.CONSTANTS.PadRandomBase);
                    }
                };
                ECC200.prototype.lookAhead = function (current, offset, codeLength, d_len) {
                    var CharSet = {
                        ASCII: 0,
                        C40: 1,
                        Text: 2,
                        X12: 3,
                        EDIFACT: 4,
                        Base256: 5
                    };
                    var CharSetName = ['ASCII', 'C40', 'Text', 'X12', 'EDIFACT', 'Base256'];
                    var m_symbol = this.m_symbol;
                    d_len = 0;
                    current = CharSet[current];
                    var forceBreak = false;
                    var start = offset;
                    var counts = [0, 1, 1, 1, 1, 1.25];
                    var winner = CharSet.C40;
                    if (current != CharSet.ASCII) {
                        counts = counts.map(function (c) { return ++c; });
                    }
                    counts[current] = 0;
                    var _loop_1 = function () {
                        ++d_len;
                        var data = m_symbol[offset];
                        var isFnc1 = data == specialized.CONSTANTS.FNC1Input;
                        var isExtAscii = data > specialized.ASCIIMax;
                        counts.forEach(function (c, i) {
                            switch (i) {
                                case CharSet.ASCII:
                                    if (isExtAscii && !isFnc1) {
                                        counts[i] = roundUpCodeLength(counts[i]) + 2;
                                    }
                                    else if (specialized.isDigit(data)) {
                                        counts[i] += 0.5;
                                    }
                                    else {
                                        counts[i] += 1;
                                    }
                                    break;
                                case CharSet.C40:
                                case CharSet.Text:
                                    if (isFnc1) {
                                        counts[i] += 4 / 3;
                                    }
                                    else if (isExtAscii) {
                                        counts[i] += 8 / 3;
                                    }
                                    else {
                                        counts[i] += specialized.getTripletCharSetChannel(CharSetName[i], data) == 0 ? 2 / 3 : 4 / 3;
                                    }
                                    break;
                                case CharSet.X12:
                                    if (isExtAscii) {
                                        counts[i] += 13 / 3;
                                    }
                                    else if (specialized.getX12Value(data) != specialized.CONSTANTS.InvalidTripletValue) {
                                        counts[i] += 2 / 3;
                                    }
                                    else {
                                        counts[i] += 10 / 3;
                                    }
                                    break;
                                case CharSet.EDIFACT:
                                    if (isExtAscii) {
                                        counts[i] += 17 / 4;
                                    }
                                    else if (specialized.getEDIFACTValue(data) != specialized.CONSTANTS.InvalidTripletValue) {
                                        counts[i] += 0.75;
                                    }
                                    else {
                                        counts[i] += 13 / 4;
                                    }
                                    break;
                                case CharSet.Base256:
                                    counts[i] += 1;
                                    break;
                            }
                        });
                        var indices = [CharSet.ASCII, CharSet.Base256, CharSet.EDIFACT, CharSet.Text, CharSet.X12, CharSet.C40];
                        if (d_len > 3) {
                            for (var i = 0; i < indices.length; ++i) {
                                var win = true, set = indices[i], value = counts[set] + 1;
                                for (var j = 0; j < counts.length; ++j) {
                                    switch (set) {
                                        case CharSet.ASCII:
                                            if (counts[j] < value) {
                                                win = false;
                                            }
                                            break;
                                        case CharSet.Base256:
                                            if (j == CharSet.ASCII && counts[j] < value || counts[j] <= value) {
                                                win = false;
                                            }
                                            break;
                                        case CharSet.EDIFACT:
                                        case CharSet.Text:
                                        case CharSet.X12:
                                            if (counts[j] <= value) {
                                                win = false;
                                            }
                                            break;
                                        case CharSet.C40:
                                            if (j != CharSet.X12 && counts[j] <= value) {
                                                win = false;
                                            }
                                            else {
                                                value -= 1;
                                                if (counts[j] < value) {
                                                    win = false;
                                                }
                                                else if (counts[j] == value) {
                                                    var index = start;
                                                    while (index <= offset) {
                                                        var x12value = specialized.getX12Value(m_symbol[index++]);
                                                        if (x12value < 3) {
                                                            return { value: CharSetName[CharSet.X12] };
                                                        }
                                                        else if (x12value == specialized.CONSTANTS.InvalidTripletValue) {
                                                            break;
                                                        }
                                                    }
                                                    return { value: CharSetName[CharSet.C40] };
                                                }
                                            }
                                            break;
                                    }
                                    if (!win) {
                                        break;
                                    }
                                }
                                if (win) {
                                    winner = set;
                                    break;
                                }
                            }
                        }
                        ++offset;
                        // the following condition is for structured append using.
                        var min = 0;
                        for (var i = 0; i < counts.length; ++i) {
                            if (roundUpCodeLength(counts[i]) < roundUpCodeLength(counts[min])) {
                                min = i;
                            }
                        }
                        if (offset < m_symbol.length && roundUpCodeLength(counts[min]) >= codeLength) {
                            forceBreak = true;
                            return "break";
                        }
                    };
                    while (offset < m_symbol.length && offset - start <= specialized.CONSTANTS.MaxLookAheadOffset) {
                        var state_1 = _loop_1();
                        if (typeof state_1 === "object")
                            return state_1.value;
                        if (state_1 === "break")
                            break;
                    }
                    if (offset == m_symbol.length || offset - start >= specialized.CONSTANTS.MaxLookAheadOffset || forceBreak) {
                        // already reached the end of input.
                        var min = 0;
                        for (var i = 0; i < counts.length; ++i) {
                            // round up all the counters.
                            counts[i] = roundUpCodeLength(counts[i]);
                            if (counts[i] < counts[min]) {
                                min = i;
                            }
                        }
                        if (min == 0 || min == CharSet.C40) {
                            // if ASCII or C40 encoding provides the sortest product, return;
                            winner = min;
                        }
                        else {
                            // check if other charsets provides explicitly longer prodect,
                            // if so, reutrn the charset provides the sortest, otherwise, return C40 instead.
                            var flag = true;
                            var minValue = counts[min];
                            for (var i = 0; i < counts.length; ++i) {
                                if (i != min && counts[i] <= minValue) {
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag) {
                                winner = min;
                            }
                        }
                    }
                    return { d_len: d_len, newCharset: CharSetName[winner] };
                };
                ECC200.prototype.getMatrix = function () {
                    var _this = this;
                    var _a;
                    var _b = this, text = _b.text, m_symbol = _b.m_symbol, symbolSize = _b.symbolSize, structuredAppend = _b.structuredAppend, structureNumber = _b.structureNumber, symbolInfo = _b.symbolInfo;
                    if (m_symbol.length > 3116 * (structuredAppend ? 16 : 1)) {
                        throw new wijmo.barcode.TextTooLongException();
                    }
                    var s_pos = 0, c_pos = 0, codeLength = 0, structureCount = 0, fileInfo = 0;
                    if (symbolSize !== 'squareAuto' && symbolSize !== 'rectangularAuto') {
                        symbolInfo = specialized.getSymbolInfo(symbolSize);
                    }
                    else if (symbolSize === 'rectangularAuto') {
                        symbolInfo = specialized.getSymbolInfo('rectangular16x48');
                    }
                    this.symbolInfo = symbolInfo;
                    if (!structuredAppend) {
                        (_a = this.preEncode(s_pos, c_pos), s_pos = _a.s_pos, c_pos = _a.c_pos);
                    }
                    var symbolCapacity = symbolInfo.symbolDataCapacity;
                    if (structuredAppend) {
                        symbolCapacity -= 4;
                        codeLength = 4;
                    }
                    else {
                        symbolCapacity -= c_pos;
                        codeLength = c_pos;
                    }
                    if (!this.checkValue(s_pos)) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                    var encodingUnits;
                    for (; structureCount < (structuredAppend ? specialized.CONSTANTS.MaxStructures : 1) && s_pos < m_symbol.length; structureCount++) {
                        fileInfo ^= m_symbol[s_pos];
                        var _c = this.getEncodingUnits(s_pos, symbolCapacity), s_taken = _c.s_taken, c_length = _c.c_length, units = _c.units;
                        s_pos += s_taken;
                        if (structureCount == structureNumber) {
                            encodingUnits = units;
                            codeLength += c_length;
                        }
                    }
                    if (encodingUnits == null) {
                        throw new wijmo.barcode.InvalidOptionsException({ structureNumber: structureNumber }, "Max structure number is " + structureCount);
                    }
                    if (s_pos < m_symbol.length) {
                        throw new wijmo.barcode.TextTooLongException();
                    }
                    if (symbolSize === 'squareAuto' || symbolSize === 'rectangularAuto') {
                        symbolInfo = specialized.getSuitableSymbolSize(symbolSize, codeLength);
                        this.symbolInfo = symbolInfo;
                    }
                    if (structuredAppend) {
                        c_pos = this.encodeStructureHeader(c_pos, structureCount, mod256(fileInfo ^ m_symbol[m_symbol.length - 1]));
                    }
                    encodingUnits.forEach(function (unit) { return c_pos = _this.encode(unit, c_pos); });
                    if (c_pos < symbolInfo.symbolDataCapacity) {
                        this.padRight(c_pos);
                    }
                    var code = this.eccProcess();
                    var _d = specialized.getInfoOfRegions(symbolInfo.regions), rowOfRegion = _d.rowOfRegion, colOfRegion = _d.colOfRegion;
                    var sp = new specialized.SymbolCharacterPlacement(code, symbolInfo.symbolRows - 2 * rowOfRegion, symbolInfo.symbolColumns - 2 * colOfRegion);
                    var data = sp.ECC200();
                    return this.placeModules(data);
                };
                ECC200.prototype.eccProcess = function () {
                    var _a = this, symbolInfo = _a.symbolInfo, m_code = _a.m_code;
                    var codeLength = symbolInfo.symbolDataCapacity / symbolInfo.interleavedBlocks;
                    var eccLength = symbolInfo.eccLength / symbolInfo.interleavedBlocks;
                    // When symbol size is 144*144, the data length of the last 2 interleaved blocks are smaller.
                    if (symbolInfo.symbolRows == 144) {
                        ++codeLength;
                    }
                    var code = [];
                    for (var i = 0; i < symbolInfo.interleavedBlocks; ++i) {
                        var cLen = 0;
                        var index = i;
                        for (; cLen < codeLength && index < symbolInfo.symbolDataCapacity; ++cLen, index += symbolInfo.interleavedBlocks) {
                            code[cLen] = m_code[index];
                        }
                        var eccValue = specialized.generateErrorCorrectionCode(code, 0, cLen, eccLength);
                        index = i;
                        for (var j = 0; j < eccValue.length; ++j, index += symbolInfo.interleavedBlocks) {
                            m_code[symbolInfo.symbolDataCapacity + index] = eccValue[j];
                        }
                    }
                    return m_code;
                };
                ECC200.prototype.placeModules = function (data) {
                    var symbolInfo = this.symbolInfo;
                    var matrix = specialized.createModules(symbolInfo.symbolRows, symbolInfo.symbolColumns);
                    var _a = specialized.getInfoOfRegions(symbolInfo.regions), rowOfRegion = _a.rowOfRegion, colOfRegion = _a.colOfRegion;
                    for (var r = 0; r < rowOfRegion; r++) {
                        for (var c = 0; c < colOfRegion; c++) {
                            specialized.setFinder(matrix, symbolInfo, r, c);
                            specialized.setRegionData(matrix, symbolInfo, r, c, data);
                        }
                    }
                    return matrix;
                };
                return ECC200;
            }());
            specialized.ECC200 = ECC200;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var DataMatrixEncoder = /** @class */ (function (_super) {
                __extends(DataMatrixEncoder, _super);
                function DataMatrixEncoder(option) {
                    var _this = this;
                    option.merge(DataMatrixEncoder.DefaultConfig);
                    _this = _super.call(this, option) || this;
                    var _a = _this.config, eccMode = _a.eccMode, ecc200SymbolSize = _a.ecc200SymbolSize, ecc200EncodingMode = _a.ecc200EncodingMode, structuredAppend = _a.structuredAppend, structureNumber = _a.structureNumber, fileIdentifier = _a.fileIdentifier, ecc000_140SymbolSize = _a.ecc000_140SymbolSize;
                    var text = _this.encodeConfig.text;
                    structureNumber = +structureNumber;
                    fileIdentifier = +fileIdentifier;
                    var innerEncoder;
                    switch (eccMode) {
                        case 'ECC200':
                            innerEncoder = new specialized.ECC200(text, { ecc200SymbolSize: ecc200SymbolSize, ecc200EncodingMode: ecc200EncodingMode, structuredAppend: structuredAppend, structureNumber: structureNumber, fileIdentifier: fileIdentifier });
                            break;
                        case 'ECC000':
                        case 'ECC050':
                        case 'ECC080':
                        case 'ECC100':
                        case 'ECC140':
                            innerEncoder = new specialized.ECC000_140(text, { ecc000_140SymbolSize: ecc000_140SymbolSize, structuredAppend: structuredAppend, structureNumber: structureNumber, fileIdentifier: fileIdentifier, eccMode: eccMode });
                            break;
                        default:
                            throw new wijmo.barcode.InvalidOptionsException({ eccMode: eccMode });
                    }
                    _this.innerEncoder = innerEncoder;
                    return _this;
                }
                DataMatrixEncoder.prototype.calculateData = function () {
                    return this.innerEncoder.getMatrix();
                };
                DataMatrixEncoder.prototype.validate = function () {
                    var _a = this, text = _a.encodeConfig.text, _b = _a.config, eccMode = _b.eccMode, structureNumber = _b.structureNumber, fileIdentifier = _b.fileIdentifier;
                    var reg;
                    if (eccMode === 'ECC200') {
                        reg = /^[\x00-\xFF\u2000\u2004\u2005]+$/; //eslint-disable-line
                    }
                    else {
                        reg = /^[\x00-\xFF]+$/; //eslint-disable-line
                    }
                    if (!reg.test(text)) {
                        throw new wijmo.barcode.InvalidTextException(text);
                    }
                    if (!wijmo.barcode.Utils.isNumberLike(structureNumber)) {
                        throw new wijmo.barcode.InvalidOptionsException({ structureNumber: structureNumber });
                    }
                    if (!wijmo.barcode.Utils.isNumberLike(fileIdentifier)) {
                        throw new wijmo.barcode.InvalidOptionsException({ fileIdentifier: fileIdentifier });
                    }
                };
                DataMatrixEncoder.DefaultConfig = {
                    eccMode: 'ECC200',
                    ecc200SymbolSize: 'squareAuto',
                    ecc200EncodingMode: 'auto',
                    ecc000_140SymbolSize: 'auto',
                    structuredAppend: false,
                    structureNumber: 0,
                    fileIdentifier: 0,
                    quietZone: {
                        top: 2,
                        left: 2,
                        right: 2,
                        bottom: 2
                    }
                };
                return DataMatrixEncoder;
            }(wijmo.barcode.TwoDimensionalBarcode));
            specialized.DataMatrixEncoder = DataMatrixEncoder;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            wijmo.barcode.Barcode.registerEncoder('DataMatrix', specialized.DataMatrixEncoder);
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            /** Indicates the symbol size in modules (excluding the quiet zone).*/
            var DataMatrixVersion;
            (function (DataMatrixVersion) {
                DataMatrixVersion[DataMatrixVersion["Ecc000"] = 0] = "Ecc000";
                DataMatrixVersion[DataMatrixVersion["Ecc050"] = 1] = "Ecc050";
                DataMatrixVersion[DataMatrixVersion["Ecc080"] = 2] = "Ecc080";
                DataMatrixVersion[DataMatrixVersion["Ecc100"] = 3] = "Ecc100";
                DataMatrixVersion[DataMatrixVersion["Ecc140"] = 4] = "Ecc140";
            })(DataMatrixVersion = specialized.DataMatrixVersion || (specialized.DataMatrixVersion = {}));
            var Ecc200EncodingMode;
            (function (Ecc200EncodingMode) {
                Ecc200EncodingMode[Ecc200EncodingMode["Auto"] = 0] = "Auto";
                Ecc200EncodingMode[Ecc200EncodingMode["Ascii"] = 1] = "Ascii";
                Ecc200EncodingMode[Ecc200EncodingMode["C40"] = 2] = "C40";
                Ecc200EncodingMode[Ecc200EncodingMode["Text"] = 3] = "Text";
                Ecc200EncodingMode[Ecc200EncodingMode["X12"] = 4] = "X12";
                Ecc200EncodingMode[Ecc200EncodingMode["Edifact"] = 5] = "Edifact";
                Ecc200EncodingMode[Ecc200EncodingMode["Base256"] = 6] = "Base256";
            })(Ecc200EncodingMode = specialized.Ecc200EncodingMode || (specialized.Ecc200EncodingMode = {}));
            var Ecc200SymbolSize;
            (function (Ecc200SymbolSize) {
                Ecc200SymbolSize[Ecc200SymbolSize["SquareAuto"] = 0] = "SquareAuto";
                Ecc200SymbolSize[Ecc200SymbolSize["RectangularAuto"] = 1] = "RectangularAuto";
                Ecc200SymbolSize[Ecc200SymbolSize["Square10"] = 2] = "Square10";
                Ecc200SymbolSize[Ecc200SymbolSize["Square12"] = 3] = "Square12";
                Ecc200SymbolSize[Ecc200SymbolSize["Square14"] = 4] = "Square14";
                Ecc200SymbolSize[Ecc200SymbolSize["Square16"] = 5] = "Square16";
                Ecc200SymbolSize[Ecc200SymbolSize["Square18"] = 6] = "Square18";
                Ecc200SymbolSize[Ecc200SymbolSize["Square20"] = 7] = "Square20";
                Ecc200SymbolSize[Ecc200SymbolSize["Square22"] = 8] = "Square22";
                Ecc200SymbolSize[Ecc200SymbolSize["Square24"] = 9] = "Square24";
                Ecc200SymbolSize[Ecc200SymbolSize["Square26"] = 10] = "Square26";
                Ecc200SymbolSize[Ecc200SymbolSize["Square32"] = 11] = "Square32";
                Ecc200SymbolSize[Ecc200SymbolSize["Square36"] = 12] = "Square36";
                Ecc200SymbolSize[Ecc200SymbolSize["Square40"] = 13] = "Square40";
                Ecc200SymbolSize[Ecc200SymbolSize["Square44"] = 14] = "Square44";
                Ecc200SymbolSize[Ecc200SymbolSize["Square48"] = 15] = "Square48";
                Ecc200SymbolSize[Ecc200SymbolSize["Square52"] = 16] = "Square52";
                Ecc200SymbolSize[Ecc200SymbolSize["Square64"] = 17] = "Square64";
                Ecc200SymbolSize[Ecc200SymbolSize["Square72"] = 18] = "Square72";
                Ecc200SymbolSize[Ecc200SymbolSize["Square80"] = 19] = "Square80";
                Ecc200SymbolSize[Ecc200SymbolSize["Square88"] = 20] = "Square88";
                Ecc200SymbolSize[Ecc200SymbolSize["Square96"] = 21] = "Square96";
                Ecc200SymbolSize[Ecc200SymbolSize["Square104"] = 22] = "Square104";
                Ecc200SymbolSize[Ecc200SymbolSize["Square120"] = 23] = "Square120";
                Ecc200SymbolSize[Ecc200SymbolSize["Square132"] = 24] = "Square132";
                Ecc200SymbolSize[Ecc200SymbolSize["Square144"] = 25] = "Square144";
                Ecc200SymbolSize[Ecc200SymbolSize["Rectangular8x18"] = 26] = "Rectangular8x18";
                Ecc200SymbolSize[Ecc200SymbolSize["Rectangular8x32"] = 27] = "Rectangular8x32";
                Ecc200SymbolSize[Ecc200SymbolSize["Rectangular12x26"] = 28] = "Rectangular12x26";
                Ecc200SymbolSize[Ecc200SymbolSize["Rectangular12x36"] = 29] = "Rectangular12x36";
                Ecc200SymbolSize[Ecc200SymbolSize["Rectangular16x36"] = 30] = "Rectangular16x36";
                Ecc200SymbolSize[Ecc200SymbolSize["Rectangular16x48"] = 31] = "Rectangular16x48";
            })(Ecc200SymbolSize = specialized.Ecc200SymbolSize || (specialized.Ecc200SymbolSize = {}));
            var Ecc000_140SymbolSize;
            (function (Ecc000_140SymbolSize) {
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Auto"] = 0] = "Auto";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square9"] = 1] = "Square9";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square11"] = 2] = "Square11";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square13"] = 3] = "Square13";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square15"] = 4] = "Square15";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square17"] = 5] = "Square17";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square19"] = 6] = "Square19";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square21"] = 7] = "Square21";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square23"] = 8] = "Square23";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square25"] = 9] = "Square25";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square27"] = 10] = "Square27";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square29"] = 11] = "Square29";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square31"] = 12] = "Square31";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square33"] = 13] = "Square33";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square35"] = 14] = "Square35";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square37"] = 15] = "Square37";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square39"] = 16] = "Square39";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square41"] = 17] = "Square41";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square43"] = 18] = "Square43";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square45"] = 19] = "Square45";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square47"] = 20] = "Square47";
                Ecc000_140SymbolSize[Ecc000_140SymbolSize["Square49"] = 21] = "Square49";
            })(Ecc000_140SymbolSize = specialized.Ecc000_140SymbolSize || (specialized.Ecc000_140SymbolSize = {}));
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            var _DataMatrixVersionConvertor = /** @class */ (function () {
                function _DataMatrixVersionConvertor() {
                }
                _DataMatrixVersionConvertor.stringToEnum = function (value) {
                    switch (value) {
                        case 'ECC000':
                            return specialized.DataMatrixVersion.Ecc000;
                        case 'ECC050':
                            return specialized.DataMatrixVersion.Ecc050;
                        case 'ECC080':
                            return specialized.DataMatrixVersion.Ecc080;
                        case 'ECC100':
                            return specialized.DataMatrixVersion.Ecc100;
                        case 'ECC140':
                            return specialized.DataMatrixVersion.Ecc140;
                    }
                    throw "Unknown Barcode internal eccMode '" + value + "'";
                };
                ;
                _DataMatrixVersionConvertor.enumToString = function (value) {
                    return specialized.DataMatrixVersion[wijmo.asEnum(value, specialized.DataMatrixVersion)].toUpperCase();
                };
                return _DataMatrixVersionConvertor;
            }());
            specialized._DataMatrixVersionConvertor = _DataMatrixVersionConvertor;
            var _Ecc200EncodingModeConvertor = /** @class */ (function () {
                function _Ecc200EncodingModeConvertor() {
                }
                _Ecc200EncodingModeConvertor.stringToEnum = function (value) {
                    switch (value) {
                        case 'auto':
                            return specialized.Ecc200EncodingMode.Auto;
                        case 'ASCII':
                            return specialized.Ecc200EncodingMode.Ascii;
                        case 'C40':
                            return specialized.Ecc200EncodingMode.C40;
                        case 'Text':
                            return specialized.Ecc200EncodingMode.Text;
                        case 'X12':
                            return specialized.Ecc200EncodingMode.X12;
                        case 'EDIFACT':
                            return specialized.Ecc200EncodingMode.Edifact;
                        case 'Base256':
                            return specialized.Ecc200EncodingMode.Base256;
                    }
                    throw "Unknown Barcode internal ECC200 encoding mode '" + value + "'";
                };
                ;
                _Ecc200EncodingModeConvertor.enumToString = function (value) {
                    var enumVal = wijmo.asEnum(value, specialized.Ecc200EncodingMode);
                    switch (enumVal) {
                        case specialized.Ecc200EncodingMode.Auto:
                            return 'auto';
                        case specialized.Ecc200EncodingMode.Ascii:
                        case specialized.Ecc200EncodingMode.Edifact:
                            return specialized.Ecc200EncodingMode[enumVal].toUpperCase();
                        default:
                            return specialized.Ecc200EncodingMode[enumVal];
                    }
                };
                return _Ecc200EncodingModeConvertor;
            }());
            specialized._Ecc200EncodingModeConvertor = _Ecc200EncodingModeConvertor;
            function _SymbolSizeConvertor(enumStr) {
                return enumStr.charAt(0).toLowerCase() + enumStr.slice(1);
            }
            specialized._SymbolSizeConvertor = _SymbolSizeConvertor;
            ;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            /**
             * Base abstract class for all DataMatrix barcode classes.
             */
            var DataMatrixBase = /** @class */ (function (_super) {
                __extends(DataMatrixBase, _super);
                /**
                 * Abstract class constructor, never call.
                 */
                function DataMatrixBase(element, option) {
                    var _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-datamatrix');
                    return _this;
                }
                DataMatrixBase.type = 'DataMatrix';
                return DataMatrixBase;
            }(wijmo.barcode.BarcodeBase));
            specialized.DataMatrixBase = DataMatrixBase;
            /**
             * Represents a control for drawing an old version of <a href="https://en.wikipedia.org/wiki/Data_Matrix" target="_blank">DataMatrix</a>
             * barcode by using ECC000 - ECC140.
             */
            var DataMatrixEcc000 = /** @class */ (function (_super) {
                __extends(DataMatrixEcc000, _super);
                /**
                 * Initializes a new instance of the {@link DataMatrixEcc000} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function DataMatrixEcc000(element, option) {
                    var _this = this;
                    DataMatrixEcc000._getEnumDictionary();
                    _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-datamatrix-ecc000');
                    return _this;
                }
                DataMatrixEcc000._getEnumDictionary = function () {
                    if (!DataMatrixEcc000._symbolSizeDictionary) {
                        DataMatrixEcc000._symbolSizeDictionary = new wijmo.barcode._EnumDictionary(specialized.Ecc000_140SymbolSize, specialized._SymbolSizeConvertor);
                    }
                };
                DataMatrixEcc000._getClassDefaults = function () {
                    var ret = _super._getClassDefaults.call(this);
                    ret['eccMode'] = 'ECC000';
                    return ret;
                };
                Object.defineProperty(DataMatrixEcc000.prototype, "version", {
                    /**
                     * Gets or sets the ECC version of DataMatrix to render the barcode.
                     *
                     * The default value for this property is {@link DataMatrixVersion.Ecc000}.
                     */
                    get: function () {
                        return specialized._DataMatrixVersionConvertor.stringToEnum(this._getProp('eccMode'));
                    },
                    set: function (value) {
                        this._setProp('eccMode', specialized._DataMatrixVersionConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DataMatrixEcc000.prototype, "symbolSize", {
                    /**
                     * Gets or sets the size of symbol.
                     *
                     * The default value for this property is {@link Ecc000_140SymbolSize.Auto}.
                     */
                    get: function () {
                        return DataMatrixEcc000._symbolSizeDictionary.getEnumByString(this._getProp('ecc000_140SymbolSize'));
                    },
                    set: function (value) {
                        this._setProp('ecc000_140SymbolSize', DataMatrixEcc000._symbolSizeDictionary.getStringByEnum(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                return DataMatrixEcc000;
            }(DataMatrixBase));
            specialized.DataMatrixEcc000 = DataMatrixEcc000;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Data_Matrix" target="_blank">DataMatrix</a>
             * barcode by using <a href="https://en.wikipedia.org/wiki/Reed%E2%80%93Solomon_error_correction" target="_blank">Reed-Solomon</a> codes of ECC200.
             */
            var DataMatrixEcc200 = /** @class */ (function (_super) {
                __extends(DataMatrixEcc200, _super);
                /**
                 * Initializes a new instance of the {@link DataMatrixEcc200} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function DataMatrixEcc200(element, option) {
                    var _this = this;
                    DataMatrixEcc200._getEnumDictionary();
                    _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-datamatrix-ecc200');
                    return _this;
                }
                DataMatrixEcc200._getEnumDictionary = function () {
                    if (!DataMatrixEcc200._symbolSizeDictionary) {
                        DataMatrixEcc200._symbolSizeDictionary = new wijmo.barcode._EnumDictionary(specialized.Ecc200SymbolSize, specialized._SymbolSizeConvertor);
                    }
                };
                // Ensure correct ECC version, despite the default Barcode. 
                DataMatrixEcc200._getClassDefaults = function () {
                    var ret = _super._getClassDefaults.call(this);
                    ret['eccMode'] = 'ECC200';
                    return ret;
                };
                Object.defineProperty(DataMatrixEcc200.prototype, "symbolSize", {
                    /**
                     * Gets or sets the size of symbol.
                     *
                     * The default value for this property is {@link Ecc200SymbolSize.SquareAuto}.
                     */
                    get: function () {
                        return DataMatrixEcc200._symbolSizeDictionary.getEnumByString(this._getProp('ecc200SymbolSize'));
                    },
                    set: function (value) {
                        this._setProp('ecc200SymbolSize', DataMatrixEcc200._symbolSizeDictionary.getStringByEnum(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DataMatrixEcc200.prototype, "encodingMode", {
                    /**
                     * Gets or sets the encoding mode.
                     *
                     * The default value for this property is {@link Ecc200EncodingMode.Auto}.
                     */
                    get: function () {
                        return specialized._Ecc200EncodingModeConvertor.stringToEnum(this._getProp('ecc200EncodingMode'));
                    },
                    set: function (value) {
                        this._setProp('ecc200EncodingMode', specialized._Ecc200EncodingModeConvertor.enumToString(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DataMatrixEcc200.prototype, "structuredAppend", {
                    /**
                     * Indicates whether the symbol is part of a structured append message.
                     *
                     * The default value for this property is <b>false</b>.
                     */
                    get: function () {
                        return this._getProp('structuredAppend');
                    },
                    set: function (value) {
                        this._setProp('structuredAppend', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DataMatrixEcc200.prototype, "structureNumber", {
                    /**
                     * Gets or sets the block in which the symbol is in the structured append message.
                     *
                     * The possible property values are 0 - 15.
                     * The default value for this property is <b>0</b>.
                     */
                    get: function () {
                        return this._getProp('structureNumber');
                    },
                    set: function (value) {
                        this._setProp('structureNumber', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DataMatrixEcc200.prototype, "fileIdentifier", {
                    /**
                     * Gets or sets the file identification of this control.
                     *
                     * The possible property values are 1 - 254.
                     * The default value for this property is <b>0</b>.
                     */
                    get: function () {
                        return this._getProp('fileIdentifier');
                    },
                    set: function (value) {
                        this._setProp('fileIdentifier', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                return DataMatrixEcc200;
            }(DataMatrixBase));
            specialized.DataMatrixEcc200 = DataMatrixEcc200;
            /**
             * Represents a control for drawing <a href="https://de.wikipedia.org/wiki/Code_49" target="_blank">Code49</a>
             * barcode type.
             */
            var Code49 = /** @class */ (function (_super) {
                __extends(Code49, _super);
                /**
                 * Initializes a new instance of the {@link Code49} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function Code49(element, option) {
                    var _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-code49');
                    return _this;
                }
                Object.defineProperty(Code49.prototype, "showLabel", {
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
                Object.defineProperty(Code49.prototype, "grouping", {
                    /**
                     * Indicates whether the symbol mode is Group Alphanumeric Mode.
                     *
                     * The default value for this property is <b>false</b>.
                     */
                    get: function () {
                        return this._getProp('grouping');
                    },
                    set: function (value) {
                        this._setProp('grouping', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code49.prototype, "groupIndex", {
                    /**
                     * Gets or sets the index of the symbol in group.
                     *
                     * The default value for this property is <b>0</b>.
                     */
                    get: function () {
                        return this._getProp('groupNo');
                    },
                    set: function (value) {
                        this._setProp('groupNo', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Code49.prototype, "labelPosition", {
                    /**
                     * Gets or sets the position to render the value of the control.
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
                Code49.type = 'Code49';
                return Code49;
            }(wijmo.barcode.BarcodeBase));
            specialized.Code49 = Code49;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Code_93" target="_blank">Code93</a>
             * barcode type.
             *
             * This is a variable-width barcode, the width of which automatically changes
             * along with the length of the {@link value}. The {@link autoWidthZoom} property
             * can be used to zoom the automatically calculated width. The {@link autoWidth}
             * property can be used to disable this behavior.
             */
            var Code93 = /** @class */ (function (_super) {
                __extends(Code93, _super);
                /**
                 * Initializes a new instance of the {@link code93} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function Code93(element, option) {
                    var _this = _super.call(this, element) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-code93');
                    _this._setAw(true);
                    _this.initialize(option);
                    return _this;
                }
                Object.defineProperty(Code93.prototype, "autoWidth", {
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
                Object.defineProperty(Code93.prototype, "autoWidthZoom", {
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
                Object.defineProperty(Code93.prototype, "showLabel", {
                    /**
                     * Gets or sets whether the value is rendered under the symbol.
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
                Object.defineProperty(Code93.prototype, "checkDigit", {
                    /**
                     * Indicates whether the symbol needs the check digit with the Luhn algorithm.
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
                Object.defineProperty(Code93.prototype, "fullAscii", {
                    /**
                     * Indicates whether the symbol enables encoding of all 93 ASCII characters.
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
                Object.defineProperty(Code93.prototype, "labelPosition", {
                    /**
                     * Gets or sets the position to render the value of the control.
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
                Code93.type = 'Code93';
                return Code93;
            }(wijmo.barcode.BarcodeBase));
            specialized.Code93 = Code93;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/ITF-14" target="_blank">ITF-14</a>
             * barcode type.
             */
            var Itf14 = /** @class */ (function (_super) {
                __extends(Itf14, _super);
                /**
                 * Initializes a new instance of the {@link Itf14} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function Itf14(element, option) {
                    var _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-itf14');
                    return _this;
                }
                Object.defineProperty(Itf14.prototype, "showLabel", {
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
                Object.defineProperty(Itf14.prototype, "nwRatio", {
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
                Object.defineProperty(Itf14.prototype, "bearerBar", {
                    /**
                     * Indicates whether to enable bearer bar (thick black border) around the symbol.
                     *
                     *
                     * The default value for this property is <b>false</b>.
                     */
                    get: function () {
                        return this._getProp('bearerBar');
                    },
                    set: function (value) {
                        this._setProp('bearerBar', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Itf14.prototype, "labelPosition", {
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
                Itf14.type = 'ITF-14';
                return Itf14;
            }(wijmo.barcode.BarcodeBase));
            specialized.Itf14 = Itf14;
            /**
             * Represents a control for drawing <a href="https://en.wikipedia.org/wiki/Interleaved_2_of_5" target="_blank">Interleaved2of5</a>
             * barcode type.
             *
             * This is a variable-width barcode, the width of which automatically changes
             * along with the length of the {@link value}. The {@link autoWidthZoom} property
             * can be used to zoom the automatically calculated width. The {@link autoWidth}
             * property can be used to disable this behavior.
             */
            var Interleaved2of5 = /** @class */ (function (_super) {
                __extends(Interleaved2of5, _super);
                /**
                 * Initializes a new instance of the {@link Interleaved2of5} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function Interleaved2of5(element, option) {
                    var _this = _super.call(this, element) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-interleaved2of5');
                    _this._setAw(true);
                    _this.initialize(option);
                    return _this;
                }
                Object.defineProperty(Interleaved2of5.prototype, "autoWidth", {
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
                Object.defineProperty(Interleaved2of5.prototype, "autoWidthZoom", {
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
                Object.defineProperty(Interleaved2of5.prototype, "showLabel", {
                    /**
                     * Indicates whether to render the value under the symbol.
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
                Object.defineProperty(Interleaved2of5.prototype, "nwRatio", {
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
                Object.defineProperty(Interleaved2of5.prototype, "bearerBar", {
                    /**
                     * Indicates whether to enable bearer bar (the thick black border) around the symbol.
                     *
                     *
                     * The default value for this property is <b>false</b>.
                     */
                    get: function () {
                        return this._getProp('bearerBar');
                    },
                    set: function (value) {
                        this._setProp('bearerBar', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Interleaved2of5.prototype, "labelPosition", {
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
                Object.defineProperty(Interleaved2of5.prototype, "checkCharacter", {
                    /**
                     * Indicates whether to enable the check character.
                     * Since Interleaved2of5 requires an even number of digits to “interleave”
                     * numbers, the data encoded must be an odd number of digits when using a check
                     * character, thus resulting in the required even number of digits.
                     *
                     * The default value for this property is <b>false</b>.
                     */
                    get: function () {
                        return this._getProp('checkCharacter');
                    },
                    set: function (value) {
                        this._setProp('checkCharacter', value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Interleaved2of5.type = 'Interleaved2of5';
                return Interleaved2of5;
            }(wijmo.barcode.BarcodeBase));
            specialized.Interleaved2of5 = Interleaved2of5;
            /**
             * Represents the Japanese Postal barcode type and any particular settings of this type.
             */
            var JapanesePostal = /** @class */ (function (_super) {
                __extends(JapanesePostal, _super);
                /**
                 * Initializes a new instance of the {@link JapanesePostal} class.
                 * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param option The JavaScript object containing initialization data for the control.
                 */
                function JapanesePostal(element, option) {
                    var _this = _super.call(this, element, option) || this;
                    wijmo.addClass(_this.hostElement, 'wj-barcode-japanese-postal');
                    return _this;
                }
                Object.defineProperty(JapanesePostal.prototype, "showLabel", {
                    /**
                     * Indicates whether to render the value under the symbol.
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
                Object.defineProperty(JapanesePostal.prototype, "labelPosition", {
                    /**
                     * Gets or sets the position to render the value of the control.
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
                JapanesePostal.type = 'Japanese Postal';
                return JapanesePostal;
            }(wijmo.barcode.BarcodeBase));
            specialized.JapanesePostal = JapanesePostal;
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
(function (wijmo) {
    var barcode;
    (function (barcode) {
        var specialized;
        (function (specialized) {
            // Entry file. All real code files should be re-exported from here.
            wijmo._registerModule('wijmo.barcode.specialized', wijmo.barcode.specialized);
        })(specialized = barcode.specialized || (barcode.specialized = {}));
    })(barcode = wijmo.barcode || (wijmo.barcode = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.barcode.specialized.js.map