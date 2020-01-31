// Built by eustia.
(function(root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define([], factory);
    } else if (typeof module === 'object' && module.exports)
    {
        module.exports = factory();
    } else { root.util = factory(); }
}(this, function ()
{
    /* eslint-disable */

    var _ = {};

    if (typeof window === 'object' && window.util) _ = window.util;

    /* ------------------------------ noop ------------------------------ */

    var noop = _.noop = (function (exports) {
        /* A no-operation function.
         */

        /* example
         * noop(); // Does nothing
         */

        /* typescript
         * export declare function noop(): void;
         */
        exports = function() {};

        return exports;
    })({});

    /* ------------------------------ isObj ------------------------------ */

    var isObj = _.isObj = (function (exports) {
        /* Check if value is the language type of Object.
         *
         * |Name  |Type   |Desc                      |
         * |------|-------|--------------------------|
         * |val   |*      |Value to check            |
         * |return|boolean|True if value is an object|
         *
         * [Language Spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
         */

        /* example
         * isObj({}); // -> true
         * isObj([]); // -> true
         */

        /* typescript
         * export declare function isObj(val: any): boolean;
         */
        exports = function(val) {
            var type = typeof val;
            return !!val && (type === 'function' || type === 'object');
        };

        return exports;
    })({});

    /* ------------------------------ has ------------------------------ */

    var has = _.has = (function (exports) {
        /* Checks if key is a direct property.
         *
         * |Name  |Type   |Desc                            |
         * |------|-------|--------------------------------|
         * |obj   |object |Object to query                 |
         * |key   |string |Path to check                   |
         * |return|boolean|True if key is a direct property|
         */

        /* example
         * has({one: 1}, 'one'); // -> true
         */

        /* typescript
         * export declare function has(obj: {}, key: string): boolean;
         */
        var hasOwnProp = Object.prototype.hasOwnProperty;

        exports = function(obj, key) {
            return hasOwnProp.call(obj, key);
        };

        return exports;
    })({});

    /* ------------------------------ idxOf ------------------------------ */

    var idxOf = _.idxOf = (function (exports) {
        /* Get the index at which the first occurrence of value.
         *
         * |Name     |Type  |Desc                |
         * |---------|------|--------------------|
         * |arr      |array |Array to search     |
         * |val      |*     |Value to search for |
         * |fromIdx=0|number|Index to search from|
         * |return   |number|Value index         |
         */

        /* example
         * idxOf([1, 2, 1, 2], 2, 2); // -> 3
         */

        /* typescript
         * export declare function idxOf(arr: any[], val: any, fromIdx?: number): number;
         */
        exports = function(arr, val, fromIdx) {
            return Array.prototype.indexOf.call(arr, val, fromIdx);
        };

        return exports;
    })({});

    /* ------------------------------ isUndef ------------------------------ */

    var isUndef = _.isUndef = (function (exports) {
        /* Check if value is undefined.
         *
         * |Name  |Type   |Desc                      |
         * |------|-------|--------------------------|
         * |val   |*      |Value to check            |
         * |return|boolean|True if value is undefined|
         */

        /* example
         * isUndef(void 0); // -> true
         * isUndef(null); // -> false
         */

        /* typescript
         * export declare function isUndef(val: any): boolean;
         */
        exports = function(val) {
            return val === void 0;
        };

        return exports;
    })({});

    /* ------------------------------ create ------------------------------ */

    var create = _.create = (function (exports) {
        /* Create new object using given object as prototype.
         *
         * |Name   |Type  |Desc                   |
         * |-------|------|-----------------------|
         * |[proto]|object|Prototype of new object|
         * |return |object|Created object         |
         */

        /* example
         * const obj = create({ a: 1 });
         * console.log(obj.a); // -> 1
         */

        /* typescript
         * export declare function create(proto?: object): any;
         */

        /* dependencies
         * isObj 
         */

        exports = function(proto) {
            if (!isObj(proto)) return {};
            if (objCreate) return objCreate(proto);

            function noop() {}

            noop.prototype = proto;
            return new noop();
        };

        var objCreate = Object.create;

        return exports;
    })({});

    /* ------------------------------ inherits ------------------------------ */

    var inherits = _.inherits = (function (exports) {
        /* Inherit the prototype methods from one constructor into another.
         *
         * |Name      |Type    |Desc       |
         * |----------|--------|-----------|
         * |Class     |function|Child Class|
         * |SuperClass|function|Super Class|
         */

        /* example
         * function People(name) {
         *     this._name = name;
         * }
         * People.prototype = {
         *     getName: function () {
         *         return this._name;
         *     }
         * };
         * function Student(name) {
         *     this._name = name;
         * }
         * inherits(Student, People);
         * const s = new Student('RedHood');
         * s.getName(); // -> 'RedHood'
         */

        /* typescript
         * export declare function inherits(Class: Function, SuperClass: Function): void;
         */

        /* dependencies
         * create 
         */

        exports = function(Class, SuperClass) {
            Class.prototype = create(SuperClass.prototype);
        };

        return exports;
    })({});

    /* ------------------------------ ucs2 ------------------------------ */

    var ucs2 = _.ucs2 = (function (exports) {
        /* UCS-2 encoding and decoding.
         *
         * ### encode
         *
         * Create a string using an array of code point values.
         *
         * |Name  |Type  |Desc                |
         * |------|------|--------------------|
         * |arr   |array |Array of code points|
         * |return|string|Encoded string      |
         *
         * ### decode
         *
         * Create an array of code point values using a string.
         *
         * |Name  |Type  |Desc                |
         * |------|------|--------------------|
         * |str   |string|Input string        |
         * |return|array |Array of code points|
         */

        /* example
         * ucs2.encode([0x61, 0x62, 0x63]); // -> 'abc'
         * ucs2.decode('abc'); // -> [0x61, 0x62, 0x63]
         * '𝌆'.length; // -> 2
         * ucs2.decode('𝌆').length; // -> 1
         */

        /* typescript
         * export declare const ucs2: {
         *     encode(arr: number[]): string;
         *     decode(str: string): number[];
         * };
         */
        // https://mathiasbynens.be/notes/javascript-encoding
        exports = {
            encode: function(arr) {
                return String.fromCodePoint.apply(String, arr);
            },
            decode: function(str) {
                var ret = [];
                var i = 0;
                var len = str.length;

                while (i < len) {
                    var c = str.charCodeAt(i++); // A high surrogate

                    if (c >= 0xd800 && c <= 0xdbff && i < len) {
                        var tail = str.charCodeAt(i++); // nextC >= 0xDC00 && nextC <= 0xDFFF

                        if ((tail & 0xfc00) === 0xdc00) {
                            // C = (H - 0xD800) * 0x400 + L - 0xDC00 + 0x10000
                            ret.push(((c & 0x3ff) << 10) + (tail & 0x3ff) + 0x10000);
                        } else {
                            ret.push(c);
                            i--;
                        }
                    } else {
                        ret.push(c);
                    }
                }

                return ret;
            }
        };

        return exports;
    })({});

    /* ------------------------------ utf8 ------------------------------ */

    var utf8 = _.utf8 = (function (exports) {
        /* UTF-8 encoding and decoding.
         *
         * ### encode
         *
         * Turn any UTF-8 decoded string into UTF-8 encoded string.
         *
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |str   |string|String to encode|
         * |return|string|Encoded string  |
         *
         * ### decode
         *
         * Turn any UTF-8 encoded string into UTF-8 decoded string.
         *
         * |Name      |Type   |Desc                  |
         * |----------|-------|----------------------|
         * |str       |string |String to decode      |
         * |safe=false|boolean|Suppress error if true|
         * |return    |string |Decoded string        |
         */

        /* example
         * utf8.encode('\uD800\uDC00'); // ->  '\xF0\x90\x80\x80'
         * utf8.decode('\xF0\x90\x80\x80'); // -> '\uD800\uDC00'
         */

        /* typescript
         * export declare const utf8: {
         *     encode(str: string): string;
         *     decode(str: string, safe?: boolean): string;
         * };
         */

        /* dependencies
         * ucs2 
         */ // https://encoding.spec.whatwg.org/#utf-8

        exports = {
            encode: function(str) {
                var codePoints = ucs2.decode(str);
                var byteArr = '';

                for (var i = 0, len = codePoints.length; i < len; i++) {
                    byteArr += encodeCodePoint(codePoints[i]);
                }

                return byteArr;
            },
            decode: function(str, safe) {
                byteArr = ucs2.decode(str);
                byteIdx = 0;
                byteCount = byteArr.length;
                codePoint = 0;
                bytesSeen = 0;
                bytesNeeded = 0;
                lowerBoundary = 0x80;
                upperBoundary = 0xbf;
                var codePoints = [];
                var tmp;

                while ((tmp = decodeCodePoint(safe)) !== false) {
                    codePoints.push(tmp);
                }

                return ucs2.encode(codePoints);
            }
        };
        var fromCharCode = String.fromCharCode;

        function encodeCodePoint(codePoint) {
            // U+0000 to U+0080, ASCII code point
            if ((codePoint & 0xffffff80) === 0) {
                return fromCharCode(codePoint);
            }

            var ret = '',
                count,
                offset; // U+0080 to U+07FF, inclusive

            if ((codePoint & 0xfffff800) === 0) {
                count = 1;
                offset = 0xc0;
            } else if ((codePoint & 0xffff0000) === 0) {
                // U+0800 to U+FFFF, inclusive
                count = 2;
                offset = 0xe0;
            } else if ((codePoint & 0xffe00000) == 0) {
                // U+10000 to U+10FFFF, inclusive
                count = 3;
                offset = 0xf0;
            }

            ret += fromCharCode((codePoint >> (6 * count)) + offset);

            while (count > 0) {
                var tmp = codePoint >> (6 * (count - 1));
                ret += fromCharCode(0x80 | (tmp & 0x3f));
                count--;
            }

            return ret;
        }

        var byteArr,
            byteIdx,
            byteCount,
            codePoint,
            bytesSeen,
            bytesNeeded,
            lowerBoundary,
            upperBoundary;

        function decodeCodePoint(safe) {
            /* eslint-disable no-constant-condition */
            while (true) {
                if (byteIdx >= byteCount && bytesNeeded) {
                    if (safe) return goBack();
                    throw new Error('Invalid byte index');
                }

                if (byteIdx === byteCount) return false;
                var byte = byteArr[byteIdx];
                byteIdx++;

                if (!bytesNeeded) {
                    // 0x00 to 0x7F
                    if ((byte & 0x80) === 0) {
                        return byte;
                    } // 0xC2 to 0xDF

                    if ((byte & 0xe0) === 0xc0) {
                        bytesNeeded = 1;
                        codePoint = byte & 0x1f;
                    } else if ((byte & 0xf0) === 0xe0) {
                        // 0xE0 to 0xEF
                        if (byte === 0xe0) lowerBoundary = 0xa0;
                        if (byte === 0xed) upperBoundary = 0x9f;
                        bytesNeeded = 2;
                        codePoint = byte & 0xf;
                    } else if ((byte & 0xf8) === 0xf0) {
                        // 0xF0 to 0xF4
                        if (byte === 0xf0) lowerBoundary = 0x90;
                        if (byte === 0xf4) upperBoundary = 0x8f;
                        bytesNeeded = 3;
                        codePoint = byte & 0x7;
                    } else {
                        if (safe) return goBack();
                        throw new Error('Invalid UTF-8 detected');
                    }

                    continue;
                }

                if (byte < lowerBoundary || byte > upperBoundary) {
                    if (safe) {
                        byteIdx--;
                        return goBack();
                    }

                    throw new Error('Invalid continuation byte');
                }

                lowerBoundary = 0x80;
                upperBoundary = 0xbf;
                codePoint = (codePoint << 6) | (byte & 0x3f);
                bytesSeen++;
                if (bytesSeen !== bytesNeeded) continue;
                var tmp = codePoint;
                codePoint = 0;
                bytesNeeded = 0;
                bytesSeen = 0;
                return tmp;
            }
        }

        function goBack() {
            var start = byteIdx - bytesSeen - 1;
            byteIdx = start + 1;
            codePoint = 0;
            bytesNeeded = 0;
            bytesSeen = 0;
            lowerBoundary = 0x80;
            upperBoundary = 0xbf;
            return byteArr[start];
        }

        return exports;
    })({});

    /* ------------------------------ restArgs ------------------------------ */

    var restArgs = _.restArgs = (function (exports) {
        /* This accumulates the arguments passed into an array, after a given index.
         *
         * |Name        |Type    |Desc                                   |
         * |------------|--------|---------------------------------------|
         * |function    |function|Function that needs rest parameters    |
         * |[startIndex]|number  |The start index to accumulates         |
         * |return      |function|Generated function with rest parameters|
         */

        /* example
         * const paramArr = restArgs(function (rest) { return rest });
         * paramArr(1, 2, 3, 4); // -> [1, 2, 3, 4]
         */

        /* typescript
         * export declare function restArgs(fn: Function, startIndex?: number): Function;
         */
        exports = function(fn, startIdx) {
            startIdx = startIdx == null ? fn.length - 1 : +startIdx;
            return function() {
                var len = Math.max(arguments.length - startIdx, 0);
                var rest = new Array(len);
                var i;

                for (i = 0; i < len; i++) {
                    rest[i] = arguments[i + startIdx];
                } // Call runs faster than apply.

                switch (startIdx) {
                    case 0:
                        return fn.call(this, rest);

                    case 1:
                        return fn.call(this, arguments[0], rest);

                    case 2:
                        return fn.call(this, arguments[0], arguments[1], rest);
                }

                var args = new Array(startIdx + 1);

                for (i = 0; i < startIdx; i++) {
                    args[i] = arguments[i];
                }

                args[startIdx] = rest;
                return fn.apply(this, args);
            };
        };

        return exports;
    })({});

    /* ------------------------------ optimizeCb ------------------------------ */

    var optimizeCb = _.optimizeCb = (function (exports) {
        /* Used for function context binding.
         */

        /* typescript
         * export declare function optimizeCb(fn: Function, ctx: any, argCount?: number): Function;
         */

        /* dependencies
         * isUndef 
         */

        exports = function(fn, ctx, argCount) {
            if (isUndef(ctx)) return fn;

            switch (argCount == null ? 3 : argCount) {
                case 1:
                    return function(val) {
                        return fn.call(ctx, val);
                    };

                case 3:
                    return function(val, idx, collection) {
                        return fn.call(ctx, val, idx, collection);
                    };

                case 4:
                    return function(accumulator, val, idx, collection) {
                        return fn.call(ctx, accumulator, val, idx, collection);
                    };
            }

            return function() {
                return fn.apply(ctx, arguments);
            };
        };

        return exports;
    })({});

    /* ------------------------------ types ------------------------------ */

    var types = _.types = (function (exports) {
        /* Used for typescript definitions only.
         */

        /* typescript
         * export declare namespace types {
         *     interface Collection<T> {}
         *     interface List<T> extends Collection<T> {
         *         [index: number]: T;
         *         length: number;
         *     }
         *     interface ListIterator<T, TResult> {
         *         (value: T, index: number, list: List<T>): TResult;
         *     }
         *     interface Dictionary<T> extends Collection<T> {
         *         [index: string]: T;
         *     }
         *     interface ObjectIterator<T, TResult> {
         *         (element: T, key: string, list: Dictionary<T>): TResult;
         *     }
         *     interface MemoIterator<T, TResult> {
         *         (prev: TResult, curr: T, index: number, list: List<T>): TResult;
         *     }
         *     interface MemoObjectIterator<T, TResult> {
         *         (prev: TResult, curr: T, key: string, list: Dictionary<T>): TResult;
         *     }
         * }
         * export declare const types: {}
         */
        exports = {};

        return exports;
    })({});

    /* ------------------------------ endWith ------------------------------ */

    var endWith = _.endWith = (function (exports) {
        /* Check if string ends with the given target string.
         *
         * |Name  |Type   |Desc                           |
         * |------|-------|-------------------------------|
         * |str   |string |The string to search           |
         * |suffix|string |String suffix                  |
         * |return|boolean|True if string ends with target|
         */

        /* example
         * endWith('ab', 'b'); // -> true
         */

        /* typescript
         * export declare function endWith(str: string, suffix: string): boolean;
         */
        exports = function(str, suffix) {
            var idx = str.length - suffix.length;
            return idx >= 0 && str.indexOf(suffix, idx) === idx;
        };

        return exports;
    })({});

    /* ------------------------------ toStr ------------------------------ */

    var toStr = _.toStr = (function (exports) {
        /* Convert value to a string.
         *
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |val   |*     |Value to convert|
         * |return|string|Result string   |
         */

        /* example
         * toStr(null); // -> ''
         * toStr(1); // -> '1'
         * toStr(false); // -> 'false'
         * toStr([1, 2, 3]); // -> '1,2,3'
         */

        /* typescript
         * export declare function toStr(val: any): string;
         */
        exports = function(val) {
            return val == null ? '' : val.toString();
        };

        return exports;
    })({});

    /* ------------------------------ escapeJsStr ------------------------------ */

    var escapeJsStr = _.escapeJsStr = (function (exports) {
        /* Escape string to be a valid JavaScript string literal between quotes.
         *
         * http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
         *
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |str   |string|String to escape|
         * |return|string|Escaped string  |
         */

        /* example
         * escapeJsStr('\"\n'); // -> '\\"\\\\n'
         */

        /* typescript
         * export declare function escapeJsStr(str: string): string;
         */

        /* dependencies
         * toStr 
         */

        exports = function(str) {
            return toStr(str).replace(regEscapeChars, function(char) {
                switch (char) {
                    case '"':
                    case "'":
                    case '\\':
                        return '\\' + char;

                    case '\n':
                        return '\\n';

                    case '\r':
                        return '\\r';
                    // Line separator

                    case '\u2028':
                        return '\\u2028';
                    // Paragraph separator

                    case '\u2029':
                        return '\\u2029';
                }
            });
        };

        var regEscapeChars = /["'\\\n\r\u2028\u2029]/g;

        return exports;
    })({});

    /* ------------------------------ evalCss ------------------------------ */
    _.evalCss = (function (exports) {
        /* Load css into page.
         *
         * |Name|Type  |Desc    |
         * |----|------|--------|
         * |css |string|Css code|
         */

        /* example
         * evalCss('body{background:#08c}');
         */

        /* typescript
         * export declare function evalCss(css: string): void;
         */
        exports = function(css) {
            var style = document.createElement('style');
            style.textContent = css;
            style.type = 'text/css';
            document.head.appendChild(style);
        };

        return exports;
    })({});

    /* ------------------------------ identity ------------------------------ */

    var identity = _.identity = (function (exports) {
        /* Return the first argument given.
         *
         * |Name  |Type|Desc       |
         * |------|----|-----------|
         * |val   |*   |Any value  |
         * |return|*   |Given value|
         */

        /* example
         * identity('a'); // -> 'a'
         */

        /* typescript
         * export declare function identity<T>(val: T): T;
         */
        exports = function(val) {
            return val;
        };

        return exports;
    })({});

    /* ------------------------------ objToStr ------------------------------ */

    var objToStr = _.objToStr = (function (exports) {
        /* Alias of Object.prototype.toString.
         *
         * |Name  |Type  |Desc                                |
         * |------|------|------------------------------------|
         * |val   |*     |Source value                        |
         * |return|string|String representation of given value|
         */

        /* example
         * objToStr(5); // -> '[object Number]'
         */

        /* typescript
         * export declare function objToStr(val: any): string;
         */
        var ObjToStr = Object.prototype.toString;

        exports = function(val) {
            return ObjToStr.call(val);
        };

        return exports;
    })({});

    /* ------------------------------ isArgs ------------------------------ */

    var isArgs = _.isArgs = (function (exports) {
        /* Check if value is classified as an arguments object.
         *
         * |Name  |Type   |Desc                                |
         * |------|-------|------------------------------------|
         * |val   |*      |Value to check                      |
         * |return|boolean|True if value is an arguments object|
         */

        /* example
         * (function () {
         *     isArgs(arguments); // -> true
         * })();
         */

        /* typescript
         * export declare function isArgs(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object Arguments]';
        };

        return exports;
    })({});

    /* ------------------------------ isArr ------------------------------ */

    var isArr = _.isArr = (function (exports) {
        /* Check if value is an `Array` object.
         *
         * |Name  |Type   |Desc                              |
         * |------|-------|----------------------------------|
         * |val   |*      |Value to check                    |
         * |return|boolean|True if value is an `Array` object|
         */

        /* example
         * isArr([]); // -> true
         * isArr({}); // -> false
         */

        /* typescript
         * export declare function isArr(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports =
            Array.isArray ||
            function(val) {
                return objToStr(val) === '[object Array]';
            };

        return exports;
    })({});

    /* ------------------------------ castPath ------------------------------ */

    var castPath = _.castPath = (function (exports) {
        /* Cast value into a property path array.
         *
         * |Name  |Type        |Desc               |
         * |------|------------|-------------------|
         * |path  |string array|Value to inspect   |
         * |[obj] |object      |Object to query    |
         * |return|array       |Property path array|
         */

        /* example
         * castPath('a.b.c'); // -> ['a', 'b', 'c']
         * castPath(['a']); // -> ['a']
         * castPath('a[0].b'); // -> ['a', '0', 'b']
         * castPath('a.b.c', {'a.b.c': true}); // -> ['a.b.c']
         */

        /* typescript
         * export declare function castPath(path: string | string[], obj?: any): string[];
         */

        /* dependencies
         * has isArr 
         */

        exports = function(str, obj) {
            if (isArr(str)) return str;
            if (obj && has(obj, str)) return [str];
            var ret = [];
            str.replace(regPropName, function(match, number, quote, str) {
                ret.push(quote ? str.replace(regEscapeChar, '$1') : number || match);
            });
            return ret;
        }; // Lodash _stringToPath

        var regPropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
        var regEscapeChar = /\\(\\)?/g;

        return exports;
    })({});

    /* ------------------------------ safeGet ------------------------------ */

    var safeGet = _.safeGet = (function (exports) {
        /* Get object property, don't throw undefined error.
         *
         * |Name  |Type        |Desc                     |
         * |------|------------|-------------------------|
         * |obj   |object      |Object to query          |
         * |path  |array string|Path of property to get  |
         * |return|*           |Target value or undefined|
         */

        /* example
         * const obj = {a: {aa: {aaa: 1}}};
         * safeGet(obj, 'a.aa.aaa'); // -> 1
         * safeGet(obj, ['a', 'aa']); // -> {aaa: 1}
         * safeGet(obj, 'a.b'); // -> undefined
         */

        /* typescript
         * export declare function safeGet(obj: any, path: string | string[]): any;
         */

        /* dependencies
         * isUndef castPath 
         */

        exports = function(obj, path) {
            path = castPath(path, obj);
            var prop;
            prop = path.shift();

            while (!isUndef(prop)) {
                obj = obj[prop];
                if (obj == null) return;
                prop = path.shift();
            }

            return obj;
        };

        return exports;
    })({});

    /* ------------------------------ flatten ------------------------------ */

    var flatten = _.flatten = (function (exports) {
        /* Recursively flatten an array.
         *
         * |Name  |Type |Desc               |
         * |------|-----|-------------------|
         * |arr   |array|Array to flatten   |
         * |return|array|New flattened array|
         */

        /* example
         * flatten(['a', ['b', ['c']], 'd', ['e']]); // -> ['a', 'b', 'c', 'd', 'e']
         */

        /* typescript
         * export declare function flatten(arr: any[]): any[];
         */

        /* dependencies
         * isArr 
         */

        exports = function(arr) {
            return flat(arr, []);
        };

        function flat(arr, res) {
            var len = arr.length,
                i = -1,
                cur;

            while (len--) {
                cur = arr[++i];
                isArr(cur) ? flat(cur, res) : res.push(cur);
            }

            return res;
        }

        return exports;
    })({});

    /* ------------------------------ isFn ------------------------------ */

    var isFn = _.isFn = (function (exports) {
        /* Check if value is a function.
         *
         * |Name  |Type   |Desc                       |
         * |------|-------|---------------------------|
         * |val   |*      |Value to check             |
         * |return|boolean|True if value is a function|
         *
         * Generator function is also classified as true.
         */

        /* example
         * isFn(function() {}); // -> true
         * isFn(function*() {}); // -> true
         * isFn(async function() {}); // -> true
         */

        /* typescript
         * export declare function isFn(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            var objStr = objToStr(val);
            return (
                objStr === '[object Function]' ||
                objStr === '[object GeneratorFunction]' ||
                objStr === '[object AsyncFunction]'
            );
        };

        return exports;
    })({});

    /* ------------------------------ getProto ------------------------------ */

    var getProto = _.getProto = (function (exports) {
        /* Get prototype of an object.
         *
         * |Name  |Type|Desc                                         |
         * |------|----|---------------------------------------------|
         * |obj   |*   |Target object                                |
         * |return|*   |Prototype of given object, null if not exists|
         */

        /* example
         * const a = {};
         * getProto(Object.create(a)); // -> a
         */

        /* typescript
         * export declare function getProto(obj: any): any;
         */

        /* dependencies
         * isObj isFn 
         */

        var getPrototypeOf = Object.getPrototypeOf;
        var ObjectCtr = {}.constructor;

        exports = function(obj) {
            if (!isObj(obj)) return null;
            if (getPrototypeOf) return getPrototypeOf(obj);
            var proto = obj.__proto__;
            if (proto || proto === null) return proto;
            if (isFn(obj.constructor)) return obj.constructor.prototype;
            if (obj instanceof ObjectCtr) return ObjectCtr.prototype;
            return null;
        };

        return exports;
    })({});

    /* ------------------------------ isMiniProgram ------------------------------ */

    var isMiniProgram = _.isMiniProgram = (function (exports) {
        /* Check if running in wechat mini program.
         */

        /* example
         * console.log(isMiniProgram); // -> true if running in mini program.
         */

        /* typescript
         * export declare const isMiniProgram: boolean;
         */

        /* dependencies
         * isFn 
         */
        /* eslint-disable no-undef */

        exports = typeof wx !== 'undefined' && isFn(wx.openLocation);

        return exports;
    })({});

    /* ------------------------------ isNum ------------------------------ */

    var isNum = _.isNum = (function (exports) {
        /* Check if value is classified as a Number primitive or object.
         *
         * |Name  |Type   |Desc                                 |
         * |------|-------|-------------------------------------|
         * |val   |*      |Value to check                       |
         * |return|boolean|True if value is correctly classified|
         */

        /* example
         * isNum(5); // -> true
         * isNum(5.1); // -> true
         * isNum({}); // -> false
         */

        /* typescript
         * export declare function isNum(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object Number]';
        };

        return exports;
    })({});

    /* ------------------------------ isArrLike ------------------------------ */

    var isArrLike = _.isArrLike = (function (exports) {
        /* Check if value is array-like.
         *
         * |Name  |Type   |Desc                       |
         * |------|-------|---------------------------|
         * |val   |*      |Value to check             |
         * |return|boolean|True if value is array like|
         *
         * Function returns false.
         */

        /* example
         * isArrLike('test'); // -> true
         * isArrLike(document.body.children); // -> true;
         * isArrLike([1, 2, 3]); // -> true
         */

        /* typescript
         * export declare function isArrLike(val: any): boolean;
         */

        /* dependencies
         * isNum isFn 
         */

        var MAX_ARR_IDX = Math.pow(2, 53) - 1;

        exports = function(val) {
            if (!val) return false;
            var len = val.length;
            return isNum(len) && len >= 0 && len <= MAX_ARR_IDX && !isFn(val);
        };

        return exports;
    })({});

    /* ------------------------------ isStr ------------------------------ */

    var isStr = _.isStr = (function (exports) {
        /* Check if value is a string primitive.
         *
         * |Name  |Type   |Desc                               |
         * |------|-------|-----------------------------------|
         * |val   |*      |Value to check                     |
         * |return|boolean|True if value is a string primitive|
         */

        /* example
         * isStr('licia'); // -> true
         */

        /* typescript
         * export declare function isStr(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object String]';
        };

        return exports;
    })({});

    /* ------------------------------ isBrowser ------------------------------ */

    var isBrowser = _.isBrowser = (function (exports) {
        /* Check if running in a browser.
         */

        /* example
         * console.log(isBrowser); // -> true if running in a browser
         */

        /* typescript
         * export declare const isBrowser: boolean;
         */
        exports =
            typeof window === 'object' &&
            typeof document === 'object' &&
            document.nodeType === 9;

        return exports;
    })({});

    /* ------------------------------ root ------------------------------ */

    var root = _.root = (function (exports) {
        /* Root object reference, `global` in nodeJs, `window` in browser. */

        /* typescript
         * export declare const root: any;
         */

        /* dependencies
         * isBrowser 
         */

        exports = isBrowser ? window : global;

        return exports;
    })({});

    /* ------------------------------ detectMocha ------------------------------ */

    var detectMocha = _.detectMocha = (function (exports) {
        /* Detect if mocha is running.
         */

        /* example
         * detectMocha(); // -> True if mocha is running.
         */

        /* typescript
         * export declare function detectMocha(): boolean;
         */

        /* dependencies
         * root 
         */

        exports = function() {
            for (var i = 0, len = methods.length; i < len; i++) {
                var method = methods[i];
                if (typeof root[method] !== 'function') return false;
            }

            return true;
        };

        var methods = ['afterEach', 'after', 'beforeEach', 'before', 'describe', 'it'];

        return exports;
    })({});

    /* ------------------------------ keys ------------------------------ */

    var keys = _.keys = (function (exports) {
        /* Create an array of the own enumerable property names of object.
         *
         * |Name  |Type  |Desc                   |
         * |------|------|-----------------------|
         * |obj   |object|Object to query        |
         * |return|array |Array of property names|
         */

        /* example
         * keys({a: 1}); // -> ['a']
         */

        /* typescript
         * export declare function keys(obj: any): string[];
         */

        /* dependencies
         * has detectMocha 
         */

        if (Object.keys && !detectMocha()) {
            exports = Object.keys;
        } else {
            exports = function(obj) {
                var ret = [];

                for (var key in obj) {
                    if (has(obj, key)) ret.push(key);
                }

                return ret;
            };
        }

        return exports;
    })({});

    /* ------------------------------ each ------------------------------ */

    var each = _.each = (function (exports) {
        /* Iterate over elements of collection and invokes iterator for each element.
         *
         * |Name    |Type        |Desc                          |
         * |--------|------------|------------------------------|
         * |obj     |object array|Collection to iterate over    |
         * |iterator|function    |Function invoked per iteration|
         * |[ctx]   |*           |Function context              |
         */

        /* example
         * each({'a': 1, 'b': 2}, function (val, key) {});
         */

        /* typescript
         * export declare function each<T>(
         *     list: types.List<T>,
         *     iterator: types.ListIterator<T, void>,
         *     ctx?: any
         * ): types.List<T>;
         * export declare function each<T>(
         *     object: types.Dictionary<T>,
         *     iterator: types.ObjectIterator<T, void>,
         *     ctx?: any
         * ): types.Collection<T>;
         */

        /* eslint-disable no-unused-vars */

        /* dependencies
         * isArrLike keys optimizeCb types 
         */

        exports = function(obj, iterator, ctx) {
            iterator = optimizeCb(iterator, ctx);
            var i, len;

            if (isArrLike(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    iterator(obj[i], i, obj);
                }
            } else {
                var _keys = keys(obj);

                for (i = 0, len = _keys.length; i < len; i++) {
                    iterator(obj[_keys[i]], _keys[i], obj);
                }
            }

            return obj;
        };

        return exports;
    })({});

    /* ------------------------------ createAssigner ------------------------------ */

    var createAssigner = _.createAssigner = (function (exports) {
        /* Used to create extend, extendOwn and defaults.
         *
         * |Name    |Type    |Desc                          |
         * |--------|--------|------------------------------|
         * |keysFn  |function|Function to get object keys   |
         * |defaults|boolean |No override when set to true  |
         * |return  |function|Result function, extend...    |
         */

        /* typescript
         * export declare function createAssigner(keysFn: Function, defaults: boolean): Function;
         */

        /* dependencies
         * isUndef each 
         */

        exports = function(keysFn, defaults) {
            return function(obj) {
                each(arguments, function(src, idx) {
                    if (idx === 0) return;
                    var keys = keysFn(src);
                    each(keys, function(key) {
                        if (!defaults || isUndef(obj[key])) obj[key] = src[key];
                    });
                });
                return obj;
            };
        };

        return exports;
    })({});

    /* ------------------------------ values ------------------------------ */

    var values = _.values = (function (exports) {
        /* Create an array of the own enumerable property values of object.
         *
         * |Name  |Type  |Desc                    |
         * |------|------|------------------------|
         * |obj   |object|Object to query         |
         * |return|array |Array of property values|
         */

        /* example
         * values({one: 1, two: 2}); // -> [1, 2]
         */

        /* typescript
         * export declare function values(obj: any): any[];
         */

        /* dependencies
         * each 
         */

        exports = function(obj) {
            var ret = [];
            each(obj, function(val) {
                ret.push(val);
            });
            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ contain ------------------------------ */

    var contain = _.contain = (function (exports) {
        /* Check if the value is present in the list.
         *
         * |Name  |Type               |Desc                                |
         * |------|-------------------|------------------------------------|
         * |target|array object string|Target object                       |
         * |value |*                  |Value to check                      |
         * |return|boolean            |True if value is present in the list|
         */

        /* example
         * contain([1, 2, 3], 1); // -> true
         * contain({a: 1, b: 2}, 1); // -> true
         * contain('abc', 'a'); // -> true
         */

        /* typescript
         * export declare function contain(
         *     arr: any[] | {} | string,
         *     val: any
         * ): boolean;
         */

        /* dependencies
         * idxOf isStr isArrLike values 
         */

        exports = function(arr, val) {
            if (isStr(arr)) return arr.indexOf(val) > -1;
            if (!isArrLike(arr)) arr = values(arr);
            return idxOf(arr, val) >= 0;
        };

        return exports;
    })({});

    /* ------------------------------ extendOwn ------------------------------ */

    var extendOwn = _.extendOwn = (function (exports) {
        /* Like extend, but only copies own properties over to the destination object.
         *
         * |Name       |Type  |Desc              |
         * |-----------|------|------------------|
         * |destination|object|Destination object|
         * |...sources |object|Sources objects   |
         * |return     |object|Destination object|
         */

        /* example
         * extendOwn({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
         */

        /* typescript
         * export declare function extendOwn(destination: any, ...sources: any[]): any;
         */

        /* dependencies
         * keys createAssigner 
         */

        exports = createAssigner(keys);

        return exports;
    })({});

    /* ------------------------------ isEmpty ------------------------------ */

    var isEmpty = _.isEmpty = (function (exports) {
        /* Check if value is an empty object or array.
         *
         * |Name  |Type   |Desc                  |
         * |------|-------|----------------------|
         * |val   |*      |Value to check        |
         * |return|boolean|True if value is empty|
         */

        /* example
         * isEmpty([]); // -> true
         * isEmpty({}); // -> true
         * isEmpty(''); // -> true
         */

        /* typescript
         * export declare function isEmpty(val: any): boolean;
         */

        /* dependencies
         * isArrLike isArr isStr isArgs keys 
         */

        exports = function(val) {
            if (val == null) return true;

            if (isArrLike(val) && (isArr(val) || isStr(val) || isArgs(val))) {
                return val.length === 0;
            }

            return keys(val).length === 0;
        };

        return exports;
    })({});

    /* ------------------------------ isMatch ------------------------------ */

    var isMatch = _.isMatch = (function (exports) {
        /* Check if keys and values in src are contained in obj.
         *
         * |Name  |Type   |Desc                              |
         * |------|-------|----------------------------------|
         * |obj   |object |Object to inspect                 |
         * |src   |object |Object of property values to match|
         * |return|boolean|True if object is match           |
         */

        /* example
         * isMatch({a: 1, b: 2}, {a: 1}); // -> true
         */

        /* typescript
         * export declare function isMatch(obj: any, src: any): boolean;
         */

        /* dependencies
         * keys 
         */

        exports = function(obj, src) {
            var _keys = keys(src);

            var len = _keys.length;
            if (obj == null) return !len;
            obj = Object(obj);

            for (var i = 0; i < len; i++) {
                var key = _keys[i];
                if (src[key] !== obj[key] || !(key in obj)) return false;
            }

            return true;
        };

        return exports;
    })({});

    /* ------------------------------ isNaN ------------------------------ */

    var isNaN = _.isNaN = (function (exports) {
        /* Check if value is an NaN.
         *
         * |Name  |Type   |Desc                   |
         * |------|-------|-----------------------|
         * |val   |*      |Value to check         |
         * |return|boolean|True if value is an NaN|
         *
         * Undefined is not an NaN, different from global isNaN function.
         */

        /* example
         * isNaN(0); // -> false
         * isNaN(NaN); // -> true
         */

        /* typescript
         * export declare function isNaN(val: any): boolean;
         */

        /* dependencies
         * isNum 
         */

        exports = function(val) {
            return isNum(val) && val !== +val;
        };

        return exports;
    })({});

    /* ------------------------------ isNil ------------------------------ */

    var isNil = _.isNil = (function (exports) {
        /* Check if value is null or undefined, the same as value == null.
         *
         * |Name  |Type   |Desc                              |
         * |------|-------|----------------------------------|
         * |val   |*      |Value to check                    |
         * |return|boolean|True if value is null or undefined|
         */

        /* example
         * isNil(null); // -> true
         * isNil(void 0); // -> true
         * isNil(undefined); // -> true
         * isNil(false); // -> false
         * isNil(0); // -> false
         * isNil([]); // -> false
         */

        /* typescript
         * export declare function isNil(val: any): boolean;
         */
        exports = function(val) {
            return val == null;
        };

        return exports;
    })({});

    /* ------------------------------ isPromise ------------------------------ */

    var isPromise = _.isPromise = (function (exports) {
        /* Check if value looks like a promise.
         *
         * |Name  |Type   |Desc                              |
         * |------|-------|----------------------------------|
         * |val   |*      |Value to check                    |
         * |return|boolean|True if value looks like a promise|
         */

        /* example
         * isPromise(new Promise(function () {})); // -> true
         * isPromise({}); // -> false
         */

        /* typescript
         * export declare function isPromise(val: any): boolean;
         */

        /* dependencies
         * isObj isFn 
         */

        exports = function(val) {
            return isObj(val) && isFn(val.then);
        };

        return exports;
    })({});

    /* ------------------------------ ltrim ------------------------------ */

    var ltrim = _.ltrim = (function (exports) {
        /* Remove chars or white-spaces from beginning of string.
         *
         * |Name   |Type        |Desc              |
         * |-------|------------|------------------|
         * |str    |string      |String to trim    |
         * |[chars]|string array|Characters to trim|
         * |return |string      |Trimmed string    |
         */

        /* example
         * ltrim(' abc  '); // -> 'abc  '
         * ltrim('_abc_', '_'); // -> 'abc_'
         * ltrim('_abc_', ['a', '_']); // -> 'bc_'
         */

        /* typescript
         * export declare function ltrim(str: string, chars?: string | string[]): string;
         */
        var regSpace = /^\s+/;

        exports = function(str, chars) {
            if (chars == null) return str.replace(regSpace, '');
            var start = 0;
            var len = str.length;
            var charLen = chars.length;
            var found = true;
            var i;
            var c;

            while (found && start < len) {
                found = false;
                i = -1;
                c = str.charAt(start);

                while (++i < charLen) {
                    if (c === chars[i]) {
                        found = true;
                        start++;
                        break;
                    }
                }
            }

            return start >= len ? '' : str.substr(start, len);
        };

        return exports;
    })({});

    /* ------------------------------ matcher ------------------------------ */

    var matcher = _.matcher = (function (exports) {
        /* Return a predicate function that checks if attrs are contained in an object.
         *
         * |Name  |Type    |Desc                              |
         * |------|--------|----------------------------------|
         * |attrs |object  |Object of property values to match|
         * |return|function|New predicate function            |
         */

        /* example
         * const filter = require('licia/filter');
         *
         * const objects = [
         *     {a: 1, b: 2, c: 3 },
         *     {a: 4, b: 5, c: 6 }
         * ];
         * filter(objects, matcher({a: 4, c: 6 })); // -> [{a: 4, b: 5, c: 6}]
         */

        /* typescript
         * export declare function matcher(attrs: any): Function;
         */

        /* dependencies
         * extendOwn isMatch 
         */

        exports = function(attrs) {
            attrs = extendOwn({}, attrs);
            return function(obj) {
                return isMatch(obj, attrs);
            };
        };

        return exports;
    })({});

    /* ------------------------------ safeCb ------------------------------ */

    var safeCb = _.safeCb = (function (exports) {
        /* Create callback based on input value.
         */

        /* typescript
         * export declare function safeCb(val?: any, ctx?: any, argCount?: number): Function;
         */

        /* dependencies
         * isFn isObj optimizeCb matcher identity 
         */

        exports = function(val, ctx, argCount) {
            if (val == null) return identity;
            if (isFn(val)) return optimizeCb(val, ctx, argCount);
            if (isObj(val)) return matcher(val);
            return function(key) {
                return function(obj) {
                    return obj == null ? undefined : obj[key];
                };
            };
        };

        return exports;
    })({});

    /* ------------------------------ filter ------------------------------ */

    var filter = _.filter = (function (exports) {
        /* Iterates over elements of collection, returning an array of all the values that pass a truth test.
         *
         * |Name     |Type    |Desc                                   |
         * |---------|--------|---------------------------------------|
         * |obj      |array   |Collection to iterate over             |
         * |predicate|function|Function invoked per iteration         |
         * |[ctx]    |*       |Predicate context                      |
         * |return   |array   |Array of all values that pass predicate|
         */

        /* example
         * filter([1, 2, 3, 4, 5], function (val) {
         *     return val % 2 === 0;
         * }); // -> [2, 4]
         */

        /* typescript
         * export declare function filter<T>(
         *     list: types.List<T>,
         *     iterator: types.ListIterator<T, boolean>,
         *     context?: any
         * ): T[];
         * export declare function filter<T>(
         *     object: types.Dictionary<T>,
         *     iterator: types.ObjectIterator<T, boolean>,
         *     context?: any
         * ): T[];
         */

        /* eslint-disable no-unused-vars */

        /* dependencies
         * safeCb each types 
         */

        exports = function(obj, predicate, ctx) {
            var ret = [];
            predicate = safeCb(predicate, ctx);
            each(obj, function(val, idx, list) {
                if (predicate(val, idx, list)) ret.push(val);
            });
            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ difference ------------------------------ */

    var difference = _.difference = (function (exports) {
        /* Create an array of unique array values not included in the other given array.
         *
         * |Name     |Type |Desc                        |
         * |---------|-----|----------------------------|
         * |arr      |array|Array to inspect            |
         * |[...rest]|array|Values to exclude           |
         * |return   |array|New array of filtered values|
         */

        /* example
         * difference([3, 2, 1], [4, 2]); // -> [3, 1]
         */

        /* typescript
         * export declare function difference(arr: any[], ...rest: any[]): any[];
         */

        /* dependencies
         * restArgs flatten filter contain 
         */

        exports = restArgs(function(arr, rest) {
            rest = flatten(rest);
            return filter(arr, function(val) {
                return !contain(rest, val);
            });
        });

        return exports;
    })({});

    /* ------------------------------ unique ------------------------------ */

    var unique = _.unique = (function (exports) {
        /* Create duplicate-free version of an array.
         *
         * |Name  |Type    |Desc                         |
         * |------|--------|-----------------------------|
         * |arr   |array   |Array to inspect             |
         * |[cmp] |function|Function for comparing values|
         * |return|array   |New duplicate free array     |
         */

        /* example
         * unique([1, 2, 3, 1]); // -> [1, 2, 3]
         */

        /* typescript
         * export declare function unique(
         *     arr: any[],
         *     cmp?: (a: any, b: any) => boolean | number
         * ): any[];
         */

        /* dependencies
         * filter 
         */

        exports = function(arr, cmp) {
            cmp = cmp || isEqual;
            return filter(arr, function(item, idx, arr) {
                var len = arr.length;

                while (++idx < len) {
                    if (cmp(item, arr[idx])) return false;
                }

                return true;
            });
        };

        function isEqual(a, b) {
            return a === b;
        }

        return exports;
    })({});

    /* ------------------------------ allKeys ------------------------------ */

    var allKeys = _.allKeys = (function (exports) {
        /* Retrieve all the names of object's own and inherited properties.
         *
         * |Name     |Type  |Desc                       |
         * |---------|------|---------------------------|
         * |obj      |object|Object to query            |
         * |[options]|object|Options                    |
         * |return   |array |Array of all property names|
         *
         * Available options:
         *
         * |Name              |Type   |Desc                     |
         * |------------------|-------|-------------------------|
         * |prototype=true    |boolean|Include prototype keys   |
         * |unenumerable=false|boolean|Include unenumerable keys|
         * |symbol=false      |boolean|Include symbol keys      |
         *
         * Members of Object's prototype won't be retrieved.
         */

        /* example
         * const obj = Object.create({zero: 0});
         * obj.one = 1;
         * allKeys(obj) // -> ['zero', 'one']
         */

        /* typescript
         * export declare namespace allKeys {
         *     interface IOptions {
         *         prototype?: boolean;
         *         unenumerable?: boolean;
         *     }
         * }
         * export declare function allKeys(
         *     obj: any,
         *     options: { symbol: true } & allKeys.IOptions
         * ): Array<string | Symbol>;
         * export declare function allKeys(
         *     obj: any,
         *     options?: ({ symbol: false } & allKeys.IOptions) | allKeys.IOptions
         * ): string[];
         */

        /* dependencies
         * keys getProto unique 
         */

        var getOwnPropertyNames = Object.getOwnPropertyNames;
        var getOwnPropertySymbols = Object.getOwnPropertySymbols;

        exports = function(obj) {
            var _ref =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : {},
                _ref$prototype = _ref.prototype,
                prototype = _ref$prototype === void 0 ? true : _ref$prototype,
                _ref$unenumerable = _ref.unenumerable,
                unenumerable = _ref$unenumerable === void 0 ? false : _ref$unenumerable,
                _ref$symbol = _ref.symbol,
                symbol = _ref$symbol === void 0 ? false : _ref$symbol;

            var ret = [];

            if ((unenumerable || symbol) && getOwnPropertyNames) {
                var getKeys = keys;
                if (unenumerable && getOwnPropertyNames) getKeys = getOwnPropertyNames;

                do {
                    ret = ret.concat(getKeys(obj));

                    if (symbol && getOwnPropertySymbols) {
                        ret = ret.concat(getOwnPropertySymbols(obj));
                    }
                } while (
                    prototype &&
                    (obj = getProto(obj)) &&
                    obj !== Object.prototype
                );

                ret = unique(ret);
            } else {
                if (prototype) {
                    for (var key in obj) {
                        ret.push(key);
                    }
                } else {
                    ret = keys(obj);
                }
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ defaults ------------------------------ */

    var defaults = _.defaults = (function (exports) {
        /* Fill in undefined properties in object with the first value present in the following list of defaults objects.
         *
         * |Name  |Type  |Desc              |
         * |------|------|------------------|
         * |obj   |object|Destination object|
         * |*src  |object|Sources objects   |
         * |return|object|Destination object|
         */

        /* example
         * defaults({name: 'RedHood'}, {name: 'Unknown', age: 24}); // -> {name: 'RedHood', age: 24}
         */

        /* typescript
         * export declare function defaults(obj: any, ...src: any[]): any;
         */

        /* dependencies
         * createAssigner allKeys 
         */

        exports = createAssigner(allKeys, true);

        return exports;
    })({});

    /* ------------------------------ extend ------------------------------ */

    var extend = _.extend = (function (exports) {
        /* Copy all of the properties in the source objects over to the destination object.
         *
         * |Name       |Type  |Desc              |
         * |-----------|------|------------------|
         * |destination|object|Destination object|
         * |...sources |object|Sources objects   |
         * |return     |object|Destination object|
         */

        /* example
         * extend({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
         */

        /* typescript
         * export declare function extend(destination: any, ...sources: any[]): any;
         */

        /* dependencies
         * createAssigner allKeys 
         */

        exports = createAssigner(allKeys);

        return exports;
    })({});

    /* ------------------------------ map ------------------------------ */

    var map = _.map = (function (exports) {
        /* Create an array of values by running each element in collection through iteratee.
         *
         * |Name     |Type        |Desc                          |
         * |---------|------------|------------------------------|
         * |object   |array object|Collection to iterate over    |
         * |iterator |function    |Function invoked per iteration|
         * |[context]|*           |Function context              |
         * |return   |array       |New mapped array              |
         */

        /* example
         * map([4, 8], function (n) { return n * n; }); // -> [16, 64]
         */

        /* typescript
         * export declare function map<T, TResult>(
         *     list: types.List<T>,
         *     iterator: types.ListIterator<T, TResult>,
         *     context?: any
         * ): TResult[];
         * export declare function map<T, TResult>(
         *     object: types.Dictionary<T>,
         *     iterator: types.ObjectIterator<T, TResult>,
         *     context?: any
         * ): TResult[];
         */

        /* eslint-disable no-unused-vars */

        /* dependencies
         * safeCb keys isArrLike types 
         */

        exports = function(obj, iterator, ctx) {
            iterator = safeCb(iterator, ctx);

            var _keys = !isArrLike(obj) && keys(obj);

            var len = (_keys || obj).length;
            var results = Array(len);

            for (var i = 0; i < len; i++) {
                var curKey = _keys ? _keys[i] : i;
                results[i] = iterator(obj[curKey], curKey, obj);
            }

            return results;
        };

        return exports;
    })({});

    /* ------------------------------ decodeUriComponent ------------------------------ */

    var decodeUriComponent = _.decodeUriComponent = (function (exports) {
        /* Better decodeURIComponent that does not throw if input is invalid.
         *
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |str   |string|String to decode|
         * |return|string|Decoded string  |
         */

        /* example
         * decodeUriComponent('%%25%'); // -> '%%%'
         * decodeUriComponent('%E0%A4%A'); // -> '\xE0\xA4%A'
         */

        /* typescript
         * export declare function decodeUriComponent(str: string): string;
         */

        /* dependencies
         * each ucs2 map utf8 
         */

        exports = function(str) {
            try {
                return decodeURIComponent(str);
            } catch (e) {
                var matches = str.match(regMatcher);

                if (!matches) {
                    return str;
                }

                each(matches, function(match) {
                    str = str.replace(match, decode(match));
                });
                return str;
            }
        };

        function decode(str) {
            str = str.split('%').slice(1);
            var bytes = map(str, hexToInt);
            str = ucs2.encode(bytes);
            str = utf8.decode(str, true);
            return str;
        }

        function hexToInt(numStr) {
            return +('0x' + numStr);
        }

        var regMatcher = /(%[a-f0-9]{2})+/gi;

        return exports;
    })({});

    /* ------------------------------ cookie ------------------------------ */
    _.cookie = (function (exports) {
        /* Simple api for handling browser cookies.
         *
         * ### get
         *
         * Get cookie value.
         *
         * |Name  |Type  |Desc                      |
         * |------|------|--------------------------|
         * |key   |string|Cookie key                |
         * |return|string|Corresponding cookie value|
         *
         * ### set
         *
         * Set cookie value.
         *
         * |Name     |Type   |Desc          |
         * |---------|-------|--------------|
         * |key      |string |Cookie key    |
         * |val      |string |Cookie value  |
         * |[options]|object |Cookie options|
         * |return   |exports|Module cookie |
         *
         * ### remove
         *
         * Remove cookie value.
         *
         * |Name     |Type   |Desc          |
         * |---------|-------|--------------|
         * |key      |string |Cookie key    |
         * |[options]|object |Cookie options|
         * |return   |exports|Module cookie |
         */

        /* example
         * cookie.set('a', '1', {path: '/'});
         * cookie.get('a'); // -> '1'
         * cookie.remove('a');
         */

        /* typescript
         * export declare namespace cookie {
         *     interface IOptions {
         *         path?: string;
         *         expires?: number;
         *         domain?: string;
         *         secure?: boolean;
         *     }
         *     interface ICookie {
         *         get(key: string, options?: cookie.IOptions): string;
         *         set(key: string, val: string, options?: cookie.IOptions): ICookie;
         *         remove(key: string, options?: cookie.IOptions): ICookie;
         *     }
         * }
         * export declare const cookie: cookie.ICookie;
         */

        /* dependencies
         * defaults isNum isUndef decodeUriComponent 
         */

        var defOpts = {
            path: '/'
        };

        function setCookie(key, val, options) {
            if (!isUndef(val)) {
                options = options || {};
                options = defaults(options, defOpts);

                if (isNum(options.expires)) {
                    var expires = new Date();
                    expires.setMilliseconds(
                        expires.getMilliseconds() + options.expires * 864e5
                    );
                    options.expires = expires;
                }

                val = encodeURIComponent(val);
                key = encodeURIComponent(key);
                document.cookie = [
                    key,
                    '=',
                    val,
                    options.expires && '; expires=' + options.expires.toUTCString(),
                    options.path && '; path=' + options.path,
                    options.domain && '; domain=' + options.domain,
                    options.secure ? '; secure' : ''
                ].join('');
                return exports;
            }

            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var result = key ? undefined : {};

            for (var i = 0, len = cookies.length; i < len; i++) {
                var c = cookies[i];
                var parts = c.split('=');
                var name = decodeUriComponent(parts.shift());
                c = parts.join('=');
                c = decodeUriComponent(c);

                if (key === name) {
                    result = c;
                    break;
                }

                if (!key) result[name] = c;
            }

            return result;
        }

        exports = {
            get: setCookie,
            set: setCookie,
            remove: function(key, options) {
                options = options || {};
                options.expires = -1;
                return setCookie(key, '', options);
            }
        };

        return exports;
    })({});

    /* ------------------------------ toArr ------------------------------ */

    var toArr = _.toArr = (function (exports) {
        /* Convert value to an array.
         *
         * |Name  |Type |Desc            |
         * |------|-----|----------------|
         * |val   |*    |Value to convert|
         * |return|array|Converted array |
         */

        /* example
         * toArr({a: 1, b: 2}); // -> [{a: 1, b: 2}]
         * toArr('abc'); // -> ['abc']
         * toArr(1); // -> [1]
         * toArr(null); // -> []
         */

        /* typescript
         * export declare function toArr(val: any): any[];
         */

        /* dependencies
         * isArrLike map isArr isStr 
         */

        exports = function(val) {
            if (!val) return [];
            if (isArr(val)) return val;
            if (isArrLike(val) && !isStr(val)) return map(val);
            return [val];
        };

        return exports;
    })({});

    /* ------------------------------ Class ------------------------------ */

    var Class = _.Class = (function (exports) {
        /* Create JavaScript class.
         *
         * |Name     |Type    |Desc                             |
         * |---------|--------|---------------------------------|
         * |methods  |object  |Public methods                   |
         * |[statics]|object  |Static methods                   |
         * |return   |function|Function used to create instances|
         */

        /* example
         * const People = Class({
         *     initialize: function People(name, age) {
         *         this.name = name;
         *         this.age = age;
         *     },
         *     introduce: function () {
         *         return 'I am ' + this.name + ', ' + this.age + ' years old.';
         *     }
         * });
         *
         * const Student = People.extend({
         *     initialize: function Student(name, age, school) {
         *         this.callSuper(People, 'initialize', arguments);
         *
         *         this.school = school;
         *     },
         *     introduce: function () {
         *         return this.callSuper(People, 'introduce') + '\n I study at ' + this.school + '.';
         *     }
         * }, {
         *     is: function (obj) {
         *         return obj instanceof Student;
         *     }
         * });
         *
         * const a = new Student('allen', 17, 'Hogwarts');
         * a.introduce(); // -> 'I am allen, 17 years old. \n I study at Hogwarts.'
         * Student.is(a); // -> true
         */

        /* typescript
         * export declare namespace Class {
         *     class Base {
         *         toString(): string;
         *     }
         *     class IConstructor extends Base {
         *         constructor(...args: any[]);
         *         static extend(methods: any, statics: any): IConstructor;
         *         static inherits(Class: Function): void;
         *         static methods(methods: any): IConstructor;
         *         static statics(statics: any): IConstructor;
         *         [method: string]: any;
         *     }
         * }
         * export declare function Class(methods: any, statics?: any): Class.IConstructor;
         */

        /* dependencies
         * extend toArr inherits safeGet isMiniProgram 
         */

        exports = function(methods, statics) {
            return Base.extend(methods, statics);
        };

        function makeClass(parent, methods, statics) {
            statics = statics || {};
            var className =
                methods.className || safeGet(methods, 'initialize.name') || '';
            delete methods.className;
            var ctor;

            if (isMiniProgram) {
                ctor = function() {
                    var args = toArr(arguments);
                    return this.initialize
                        ? this.initialize.apply(this, args) || this
                        : this;
                };
            } else {
                ctor = new Function(
                    'toArr',
                    'return function ' +
                        className +
                        '()' +
                        '{' +
                        'var args = toArr(arguments);' +
                        'return this.initialize ? this.initialize.apply(this, args) || this : this;' +
                        '};'
                )(toArr);
            }

            inherits(ctor, parent);
            ctor.prototype.constructor = ctor;

            ctor.extend = function(methods, statics) {
                return makeClass(ctor, methods, statics);
            };

            ctor.inherits = function(Class) {
                inherits(ctor, Class);
            };

            ctor.methods = function(methods) {
                extend(ctor.prototype, methods);
                return ctor;
            };

            ctor.statics = function(statics) {
                extend(ctor, statics);
                return ctor;
            };

            ctor.methods(methods).statics(statics);
            return ctor;
        }

        var Base = (exports.Base = makeClass(Object, {
            className: 'Base',
            callSuper: function(parent, name, args) {
                var superMethod = parent.prototype[name];
                return superMethod.apply(this, args);
            },
            toString: function() {
                return this.constructor.name;
            }
        }));

        return exports;
    })({});

    /* ------------------------------ now ------------------------------ */

    var now = _.now = (function (exports) {
        /* Gets the number of milliseconds that have elapsed since the Unix epoch.
         */

        /* example
         * now(); // -> 1468826678701
         */

        /* typescript
         * export declare function now(): number;
         */
        exports =
            Date.now ||
            function() {
                return new Date().getTime();
            };

        return exports;
    })({});

    /* ------------------------------ rtrim ------------------------------ */

    var rtrim = _.rtrim = (function (exports) {
        /* Remove chars or white-spaces from end of string.
         *
         * |Name   |Type        |Desc              |
         * |-------|------------|------------------|
         * |str    |string      |String to trim    |
         * |[chars]|string array|Characters to trim|
         * |return |string      |Trimmed string    |
         */

        /* example
         * rtrim(' abc  '); // -> ' abc'
         * rtrim('_abc_', '_'); // -> '_abc'
         * rtrim('_abc_', ['c', '_']); // -> '_ab'
         */

        /* typescript
         * export declare function rtrim(str: string, chars?: string | string[]): string;
         */
        var regSpace = /\s+$/;

        exports = function(str, chars) {
            if (chars == null) return str.replace(regSpace, '');
            var end = str.length - 1;
            var charLen = chars.length;
            var found = true;
            var i;
            var c;

            while (found && end >= 0) {
                found = false;
                i = -1;
                c = str.charAt(end);

                while (++i < charLen) {
                    if (c === chars[i]) {
                        found = true;
                        end--;
                        break;
                    }
                }
            }

            return end >= 0 ? str.substring(0, end + 1) : '';
        };

        return exports;
    })({});

    /* ------------------------------ trim ------------------------------ */

    var trim = _.trim = (function (exports) {
        /* Remove chars or white-spaces from beginning end of string.
         *
         * |Name  |Type        |Desc              |
         * |------|------------|------------------|
         * |str   |string      |String to trim    |
         * |chars |string array|Characters to trim|
         * |return|string      |Trimmed string    |
         */

        /* example
         * trim(' abc  '); // -> 'abc'
         * trim('_abc_', '_'); // -> 'abc'
         * trim('_abc_', ['a', 'c', '_']); // -> 'b'
         */

        /* typescript
         * export declare function trim(str: string, chars?: string | string[]): string;
         */

        /* dependencies
         * ltrim rtrim 
         */

        var regSpace = /^\s+|\s+$/g;

        exports = function(str, chars) {
            if (chars == null) return str.replace(regSpace, '');
            return ltrim(rtrim(str, chars), chars);
        };

        return exports;
    })({});

    /* ------------------------------ query ------------------------------ */

    var query = _.query = (function (exports) {
        /* Parse and stringify url query strings.
         *
         * ### parse
         *
         * Parse a query string into an object.
         *
         * |Name  |Type  |Desc        |
         * |------|------|------------|
         * |str   |string|Query string|
         * |return|object|Query object|
         *
         * ### stringify
         *
         * Stringify an object into a query string.
         *
         * |Name  |Type  |Desc        |
         * |------|------|------------|
         * |obj   |object|Query object|
         * |return|string|Query string|
         */

        /* example
         * query.parse('foo=bar&eruda=true'); // -> {foo: 'bar', eruda: 'true'}
         * query.stringify({foo: 'bar', eruda: 'true'}); // -> 'foo=bar&eruda=true'
         * query.parse('name=eruda&name=eustia'); // -> {name: ['eruda', 'eustia']}
         */

        /* typescript
         * export declare const query: {
         *     parse(str: string): any;
         *     stringify(object: any): string;
         * };
         */

        /* dependencies
         * trim each isUndef isArr map isEmpty filter isObj 
         */

        exports = {
            parse: function(str) {
                var ret = {};
                str = trim(str).replace(regIllegalChars, '');
                each(str.split('&'), function(param) {
                    var parts = param.split('=');
                    var key = parts.shift(),
                        val = parts.length > 0 ? parts.join('=') : null;
                    key = decodeURIComponent(key);
                    val = decodeURIComponent(val);

                    if (isUndef(ret[key])) {
                        ret[key] = val;
                    } else if (isArr(ret[key])) {
                        ret[key].push(val);
                    } else {
                        ret[key] = [ret[key], val];
                    }
                });
                return ret;
            },
            stringify: function(obj, arrKey) {
                return filter(
                    map(obj, function(val, key) {
                        if (isObj(val) && isEmpty(val)) return '';
                        if (isArr(val)) return exports.stringify(val, key);
                        return (
                            (arrKey
                                ? encodeURIComponent(arrKey)
                                : encodeURIComponent(key)) +
                            '=' +
                            encodeURIComponent(val)
                        );
                    }),
                    function(str) {
                        return str.length > 0;
                    }
                ).join('&');
            }
        };
        var regIllegalChars = /^(\?|#|&)/g;

        return exports;
    })({});

    /* ------------------------------ ajax ------------------------------ */
    _.ajax = (function (exports) {
        /* Perform an asynchronous HTTP request.
         *
         * |Name   |Type  |Desc        |
         * |-------|------|------------|
         * |options|object|Ajax options|
         *
         * Available options:
         *
         * |Name                                         |Type         |Desc                       |
         * |---------------------------------------------|-------------|---------------------------|
         * |type=get                                     |type         |Request type               |
         * |url                                          |string       |Request url                |
         * |data                                         |string object|Request data               |
         * |dataType=json                                |string       |Response type(json, xml)   |
         * |contentType=application/x-www-form-urlencoded|string       |Request header Content-Type|
         * |success                                      |function     |Success callback           |
         * |error                                        |function     |Error callback             |
         * |complete                                     |function     |Callback after request     |
         * |timeout                                      |number       |Request timeout            |
         *
         * ### get
         *
         * Shortcut for type = GET;
         *
         * ### post
         *
         * Shortcut for type = POST;
         *
         * |Name    |Type         |Desc            |
         * |--------|-------------|----------------|
         * |url     |string       |Request url     |
         * |[data]  |string object|Request data    |
         * |success |function     |Success callback|
         * |dataType|function     |Response type   |
         */

        /* example
         * ajax({
         *     url: 'http://example.com',
         *     data: {test: 'true'},
         *     error() {},
         *     success(data) {
         *         // ...
         *     },
         *     dataType: 'json'
         * });
         *
         * ajax.get('http://example.com', {}, function (data) {
         *     // ...
         * });
         */

        /* typescript
         * export declare namespace ajax {
         *     interface IOptions {
         *         url: string;
         *         data?: string | {};
         *         dataType?: string;
         *         contentType?: string;
         *         success?: Function;
         *         error?: Function;
         *         complete?: Function;
         *         timeout?: number;
         *     }
         *     function get(url: string, data: any, success: Function, dataType?: string): XMLHttpRequest;
         *     function post(url: string, data: any, success: Function, dataType?: string): XMLHttpRequest;
         * }
         * export declare function ajax(options: ajax.IOptions): XMLHttpRequest;
         */

        /* dependencies
         * isFn noop defaults isObj query 
         */

        exports = function(options) {
            defaults(options, exports.setting);
            var type = options.type;
            var url = options.url;
            var data = options.data;
            var dataType = options.dataType;
            var success = options.success;
            var error = options.error;
            var timeout = options.timeout;
            var complete = options.complete;
            var xhr = options.xhr();
            var abortTimeout;

            xhr.onreadystatechange = function() {
                if (xhr.readyState !== 4) return;
                clearTimeout(abortTimeout);
                var result;
                var status = xhr.status;

                if ((status >= 200 && status < 300) || status === 304) {
                    result = xhr.responseText;
                    if (dataType === 'xml') result = xhr.responseXML;

                    try {
                        if (dataType === 'json') result = JSON.parse(result);
                        /* eslint-disable no-empty */
                    } catch (e) {}

                    success(result, xhr);
                } else {
                    error(xhr);
                }

                complete(xhr);
            };

            if (type === 'GET') {
                data = query.stringify(data);
                url += url.indexOf('?') > -1 ? '&' + data : '?' + data;
            } else if (options.contentType === 'application/x-www-form-urlencoded') {
                if (isObj(data)) data = query.stringify(data);
            } else if (options.contentType === 'application/json') {
                if (isObj(data)) data = JSON.stringify(data);
            }

            xhr.open(type, url, true);
            xhr.setRequestHeader('Content-Type', options.contentType);

            if (timeout > 0) {
                abortTimeout = setTimeout(function() {
                    xhr.onreadystatechange = noop;
                    xhr.abort();
                    error(xhr, 'timeout');
                    complete(xhr);
                }, timeout);
            }

            xhr.send(type === 'GET' ? null : data);
            return xhr;
        };

        exports.setting = {
            type: 'GET',
            success: noop,
            error: noop,
            complete: noop,
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',
            data: {},
            xhr: function() {
                return new XMLHttpRequest();
            },
            timeout: 0
        };

        exports.get = function() {
            return exports(parseArgs.apply(null, arguments));
        };

        exports.post = function() {
            var options = parseArgs.apply(null, arguments);
            options.type = 'POST';
            return exports(options);
        };

        function parseArgs(url, data, success, dataType) {
            if (isFn(data)) {
                dataType = success;
                success = data;
                data = {};
            }

            return {
                url: url,
                data: data,
                success: success,
                dataType: dataType
            };
        }

        return exports;
    })({});

    /* ------------------------------ type ------------------------------ */

    var type = _.type = (function (exports) {
        /* Determine the internal JavaScript [[Class]] of an object.
         *
         * |Name          |Type   |Desc             |
         * |--------------|-------|-----------------|
         * |val           |*      |Value to get type|
         * |lowerCase=true|boolean|LowerCase result |
         * |return        |string |Type of object   |
         */

        /* example
         * type(5); // -> 'number'
         * type({}); // -> 'object'
         * type(function () {}); // -> 'function'
         * type([]); // -> 'array'
         * type([], false); // -> 'Array'
         * type(async function () {}, false); // -> 'AsyncFunction'
         */

        /* typescript
         * export declare function type(val: any, lowerCase?: boolean): string;
         */

        /* dependencies
         * objToStr isNaN 
         */

        exports = function(val) {
            var lowerCase =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : true;
            if (val === null) return lowerCase ? 'null' : 'Null';
            if (val === undefined) return lowerCase ? 'undefined' : 'Undefined';
            if (isNaN(val)) return lowerCase ? 'nan' : 'NaN';
            var ret = objToStr(val).match(regObj);
            if (!ret) return '';
            return lowerCase ? ret[1].toLowerCase() : ret[1];
        };

        var regObj = /^\[object\s+(.*?)]$/;

        return exports;
    })({});

    /* ------------------------------ toSrc ------------------------------ */

    var toSrc = _.toSrc = (function (exports) {
        /* Convert function to its source code.
         *
         * |Name  |Type    |Desc               |
         * |------|--------|-------------------|
         * |fn    |function|Function to convert|
         * |return|string  |Source code        |
         */

        /* example
         * toSrc(Math.min); // -> 'function min() { [native code] }'
         * toSrc(function () {}) // -> 'function () { }'
         */

        /* typescript
         * export declare function toSrc(fn: Function): string;
         */

        /* dependencies
         * isNil 
         */

        exports = function(fn) {
            if (isNil(fn)) return '';

            try {
                return fnToStr.call(fn);
                /* eslint-disable no-empty */
            } catch (e) {}

            try {
                return fn + '';
                /* eslint-disable no-empty */
            } catch (e) {}

            return '';
        };

        var fnToStr = Function.prototype.toString;

        return exports;
    })({});

    /* ------------------------------ stringifyAll ------------------------------ */
    _.stringifyAll = (function (exports) {
        /* Stringify object into json with types.
         *
         * |Name     |Type  |Desc               |
         * |---------|------|-------------------|
         * |obj      |*     |Object to stringify|
         * |[options]|object|Stringify options  |
         * |return   |string|Stringified object |
         *
         * Available options:
         *
         * |Name              |Type   |Desc                     |
         * |------------------|-------|-------------------------|
         * |unenumerable=false|boolean|Include unenumerable keys|
         * |symbol=false      |boolean|Include symbol keys      |
         * |accessGetter=false|boolean|Access getter value      |
         * |timeout=0         |number |Timeout of stringify     |
         * |depth=0           |number |Max depth of recursion   |
         * |[ignore]          |array  |Values to ignore         |
         *
         * When time is out, all remaining values will all be "Timeout".
         */

        /* example
         * stringifyAll(function test() {}); // -> '{"value":"function test() {}","type":"Function",...}'
         */

        /* typescript
         * export declare namespace stringifyAll {
         *     interface IOptions {
         *         unenumerable?: boolean;
         *         symbol?: boolean;
         *         accessGetter?: boolean;
         *         timeout?: number;
         *         depth?: number;
         *         ignore?: any[];
         *     }
         * }
         * export declare function stringifyAll(
         *     obj: any,
         *     options?: stringifyAll.IOptions
         * ): string;
         */

        /* dependencies
         * escapeJsStr type toStr endWith toSrc keys each Class getProto difference extend isPromise filter now allKeys contain 
         */

        exports = function(obj) {
            var _ref =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : {},
                self = _ref.self,
                _ref$startTime = _ref.startTime,
                startTime = _ref$startTime === void 0 ? now() : _ref$startTime,
                _ref$timeout = _ref.timeout,
                timeout = _ref$timeout === void 0 ? 0 : _ref$timeout,
                _ref$depth = _ref.depth,
                depth = _ref$depth === void 0 ? 0 : _ref$depth,
                _ref$curDepth = _ref.curDepth,
                curDepth = _ref$curDepth === void 0 ? 1 : _ref$curDepth,
                _ref$visitor = _ref.visitor,
                visitor = _ref$visitor === void 0 ? new Visitor() : _ref$visitor,
                _ref$unenumerable = _ref.unenumerable,
                unenumerable = _ref$unenumerable === void 0 ? false : _ref$unenumerable,
                _ref$symbol = _ref.symbol,
                symbol = _ref$symbol === void 0 ? false : _ref$symbol,
                _ref$accessGetter = _ref.accessGetter,
                accessGetter = _ref$accessGetter === void 0 ? false : _ref$accessGetter,
                _ref$ignore = _ref.ignore,
                ignore = _ref$ignore === void 0 ? [] : _ref$ignore;

            var json = '';
            var options = {
                visitor: visitor,
                unenumerable: unenumerable,
                symbol: symbol,
                accessGetter: accessGetter,
                depth: depth,
                curDepth: curDepth + 1,
                timeout: timeout,
                startTime: startTime,
                ignore: ignore
            };
            var t = type(obj, false);

            if (t === 'String') {
                json = wrapStr(obj);
            } else if (t === 'Number') {
                json = toStr(obj);

                if (endWith(json, 'Infinity')) {
                    json = '{"value":"'.concat(json, '","type":"Number"}');
                }
            } else if (t === 'NaN') {
                json = '{"value":"NaN","type":"Number"}';
            } else if (t === 'Boolean') {
                json = obj ? 'true' : 'false';
            } else if (t === 'Null') {
                json = 'null';
            } else if (t === 'Undefined') {
                json = '{"type":"Undefined"}';
            } else if (t === 'Symbol') {
                var val = 'Symbol';

                try {
                    val = toStr(obj);
                    /* eslint-disable no-empty */
                } catch (e) {}

                json = '{"value":'.concat(wrapStr(val), ',"type":"Symbol"}');
            } else {
                if (timeout && now() - startTime > timeout) {
                    return wrapStr('Timeout');
                }

                if (depth && curDepth > depth) {
                    return wrapStr('{...}');
                }

                json = '{';
                var parts = [];
                var visitedObj = visitor.get(obj);
                var id;

                if (visitedObj) {
                    id = visitedObj.id;
                    parts.push('"reference":'.concat(id));
                } else {
                    id = visitor.set(obj);
                    parts.push('"id":'.concat(id));
                }

                parts.push('"type":"'.concat(t, '"'));

                if (endWith(t, 'Function')) {
                    parts.push('"value":'.concat(wrapStr(toSrc(obj))));
                } else if (t === 'RegExp') {
                    parts.push('"value":'.concat(wrapStr(obj)));
                }

                if (!visitedObj) {
                    var enumerableKeys = keys(obj);

                    if (enumerableKeys.length) {
                        parts.push(
                            iterateObj(
                                'enumerable',
                                enumerableKeys,
                                self || obj,
                                options
                            )
                        );
                    }

                    if (unenumerable) {
                        var unenumerableKeys = difference(
                            allKeys(obj, {
                                prototype: false,
                                unenumerable: true
                            }),
                            enumerableKeys
                        );

                        if (unenumerableKeys.length) {
                            parts.push(
                                iterateObj(
                                    'unenumerable',
                                    unenumerableKeys,
                                    self || obj,
                                    options
                                )
                            );
                        }
                    }

                    if (symbol) {
                        var symbolKeys = filter(
                            allKeys(obj, {
                                prototype: false,
                                symbol: true
                            }),
                            function(key) {
                                return typeof key === 'symbol';
                            }
                        );

                        if (symbolKeys.length) {
                            parts.push(
                                iterateObj('symbol', symbolKeys, self || obj, options)
                            );
                        }
                    }

                    var prototype = getProto(obj);

                    if (prototype && !contain(ignore, prototype)) {
                        var proto = '"proto":'.concat(
                            exports(
                                prototype,
                                extend(options, {
                                    self: self || obj
                                })
                            )
                        );
                        parts.push(proto);
                    }
                }

                json += parts.join(',') + '}';
            }

            return json;
        };

        function iterateObj(name, keys, obj, options) {
            var parts = [];
            each(keys, function(key) {
                var val;
                var descriptor = Object.getOwnPropertyDescriptor(obj, key);
                var hasGetter = descriptor && descriptor.get;
                var hasSetter = descriptor && descriptor.set;

                if (!options.accessGetter && hasGetter) {
                    val = '(...)';
                } else {
                    try {
                        val = obj[key];

                        if (contain(options.ignore, val)) {
                            return;
                        }

                        if (isPromise(val)) {
                            val.catch(function() {});
                        }
                    } catch (e) {
                        val = e.message;
                    }
                }

                parts.push(''.concat(wrapKey(key), ':').concat(exports(val, options)));

                if (hasGetter) {
                    parts.push(
                        ''
                            .concat(wrapKey('get ' + toStr(key)), ':')
                            .concat(exports(descriptor.get, options))
                    );
                }

                if (hasSetter) {
                    parts.push(
                        ''
                            .concat(wrapKey('set ' + toStr(key)), ':')
                            .concat(exports(descriptor.set, options))
                    );
                }
            });
            return '"'.concat(name, '":{') + parts.join(',') + '}';
        }

        function wrapKey(key) {
            return '"'.concat(escapeJsonStr(key), '"');
        }

        function wrapStr(str) {
            return '"'.concat(escapeJsonStr(toStr(str)), '"');
        }

        function escapeJsonStr(str) {
            return escapeJsStr(str)
                .replace(/\\'/g, "'")
                .replace(/\t/g, '\\t');
        }

        var Visitor = Class({
            initialize: function() {
                this.id = 0;
                this.visited = [];
            },
            set: function(val) {
                var visited = this.visited,
                    id = this.id;
                var obj = {
                    id: id,
                    val: val
                };
                visited.push(obj);
                this.id++;
                return id;
            },
            get: function(val) {
                var visited = this.visited;

                for (var i = 0, len = visited.length; i < len; i++) {
                    var obj = visited[i];
                    if (val === obj.val) return obj;
                }

                return false;
            }
        });

        return exports;
    })({});

    return _;
}));