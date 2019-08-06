// Built by eustia.
/* eslint-disable */
"use strict";

var _ = {};

/* ------------------------------ inherits ------------------------------ */

export var inherits = _.inherits = (function (exports) {
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
     * var s = new Student('RedHood');
     * s.getName(); // -> 'RedHood'
     */

    /* typescript
     * export declare function inherits(Class: Function, SuperClass: Function): void;
     */
    exports = function exports(Class, SuperClass) {
        if (objCreate) return (Class.prototype = objCreate(SuperClass.prototype));
        noop.prototype = SuperClass.prototype;
        Class.prototype = new noop();
    };

    var objCreate = Object.create;

    function noop() {}

    return exports;
})({});

/* ------------------------------ has ------------------------------ */

export var has = _.has = (function (exports) {
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

    exports = function exports(obj, key) {
        return hasOwnProp.call(obj, key);
    };

    return exports;
})({});

/* ------------------------------ idxOf ------------------------------ */

export var idxOf = _.idxOf = (function (exports) {
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
    exports = function exports(arr, val, fromIdx) {
        return Array.prototype.indexOf.call(arr, val, fromIdx);
    };

    return exports;
})({});

/* ------------------------------ isUndef ------------------------------ */

export var isUndef = _.isUndef = (function (exports) {
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
    exports = function exports(val) {
        return val === void 0;
    };

    return exports;
})({});

/* ------------------------------ restArgs ------------------------------ */

export var restArgs = _.restArgs = (function (exports) {
    /* This accumulates the arguments passed into an array, after a given index.
     *
     * |Name        |Type    |Desc                                   |
     * |------------|--------|---------------------------------------|
     * |function    |function|Function that needs rest parameters    |
     * |[startIndex]|number  |The start index to accumulates         |
     * |return      |function|Generated function with rest parameters|
     */

    /* example
     * var paramArr = restArgs(function (rest) { return rest });
     * paramArr(1, 2, 3, 4); // -> [1, 2, 3, 4]
     */

    /* typescript
     * export declare function restArgs(fn: Function, startIndex?: number): Function;
     */
    exports = function exports(fn, startIdx) {
        startIdx = startIdx == null ? fn.length - 1 : +startIdx;
        return function() {
            var len = Math.max(arguments.length - startIdx, 0),
                rest = new Array(len),
                i;

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

export var optimizeCb = _.optimizeCb = (function (exports) {
    /* Used for function context binding.
     */

    /* typescript
     * export declare function optimizeCb(fn: Function, ctx: any, argCount?: number): Function;
     */

    /* dependencies
     * isUndef 
     */

    exports = function exports(fn, ctx, argCount) {
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

export var types = _.types = (function (exports) {
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

export var endWith = _.endWith = (function (exports) {
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
    exports = function exports(str, suffix) {
        var idx = str.length - suffix.length;
        return idx >= 0 && str.indexOf(suffix, idx) === idx;
    };

    return exports;
})({});

/* ------------------------------ toStr ------------------------------ */

export var toStr = _.toStr = (function (exports) {
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
    exports = function exports(val) {
        return val == null ? '' : val.toString();
    };

    return exports;
})({});

/* ------------------------------ escapeJsStr ------------------------------ */

export var escapeJsStr = _.escapeJsStr = (function (exports) {
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

    exports = function exports(str) {
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

/* ------------------------------ isObj ------------------------------ */

export var isObj = _.isObj = (function (exports) {
    function _typeof(obj) {
        if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
            _typeof = function _typeof(obj) {
                return typeof obj;
            };
        } else {
            _typeof = function _typeof(obj) {
                return obj &&
                    typeof Symbol === 'function' &&
                    obj.constructor === Symbol &&
                    obj !== Symbol.prototype
                    ? 'symbol'
                    : typeof obj;
            };
        }
        return _typeof(obj);
    }

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
    exports = function exports(val) {
        var type = _typeof(val);

        return !!val && (type === 'function' || type === 'object');
    };

    return exports;
})({});

/* ------------------------------ identity ------------------------------ */

export var identity = _.identity = (function (exports) {
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
    exports = function exports(val) {
        return val;
    };

    return exports;
})({});

/* ------------------------------ objToStr ------------------------------ */

export var objToStr = _.objToStr = (function (exports) {
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

    exports = function exports(val) {
        return ObjToStr.call(val);
    };

    return exports;
})({});

/* ------------------------------ isArr ------------------------------ */

export var isArr = _.isArr = (function (exports) {
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

export var castPath = _.castPath = (function (exports) {
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

    exports = function exports(str, obj) {
        if (isArr(str)) return str;
        if (obj && has(obj, str)) return [str];
        var ret = [];
        str.replace(regPropName, function(match, number, quote, str) {
            ret.push(quote ? str.replace(regEscapeChar, '$1') : number || match);
        });
        return ret;
    }; // Lodash _stringToPath

    var regPropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        regEscapeChar = /\\(\\)?/g;

    return exports;
})({});

/* ------------------------------ safeGet ------------------------------ */

export var safeGet = _.safeGet = (function (exports) {
    /* Get object property, don't throw undefined error.
     *
     * |Name  |Type        |Desc                     |
     * |------|------------|-------------------------|
     * |obj   |object      |Object to query          |
     * |path  |array string|Path of property to get  |
     * |return|*           |Target value or undefined|
     */

    /* example
     * var obj = {a: {aa: {aaa: 1}}};
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

    exports = function exports(obj, path) {
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

export var flatten = _.flatten = (function (exports) {
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

    exports = function exports(arr) {
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

export var isFn = _.isFn = (function (exports) {
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

    exports = function exports(val) {
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

export var getProto = _.getProto = (function (exports) {
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

    exports = function exports(obj) {
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

export var isMiniProgram = _.isMiniProgram = (function (exports) {
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

/* ------------------------------ isStr ------------------------------ */

export var isStr = _.isStr = (function (exports) {
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

    exports = function exports(val) {
        return objToStr(val) === '[object String]';
    };

    return exports;
})({});

/* ------------------------------ isNum ------------------------------ */

export var isNum = _.isNum = (function (exports) {
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

    exports = function exports(val) {
        return objToStr(val) === '[object Number]';
    };

    return exports;
})({});

/* ------------------------------ isArrLike ------------------------------ */

export var isArrLike = _.isArrLike = (function (exports) {
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

    exports = function exports(val) {
        if (!val) return false;
        var len = val.length;
        return isNum(len) && len >= 0 && len <= MAX_ARR_IDX && !isFn(val);
    };

    return exports;
})({});

/* ------------------------------ isBrowser ------------------------------ */

export var isBrowser = _.isBrowser = (function (exports) {
    function _typeof(obj) {
        if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
            _typeof = function _typeof(obj) {
                return typeof obj;
            };
        } else {
            _typeof = function _typeof(obj) {
                return obj &&
                    typeof Symbol === 'function' &&
                    obj.constructor === Symbol &&
                    obj !== Symbol.prototype
                    ? 'symbol'
                    : typeof obj;
            };
        }
        return _typeof(obj);
    }

    /* Check if running in a browser.
     */

    /* example
     * console.log(isBrowser); // -> true if running in a browser
     */

    /* typescript
     * export declare const isBrowser: boolean;
     */
    exports =
        (typeof window === 'undefined' ? 'undefined' : _typeof(window)) ===
            'object' &&
        (typeof document === 'undefined' ? 'undefined' : _typeof(document)) ===
            'object' &&
        document.nodeType === 9;

    return exports;
})({});

/* ------------------------------ root ------------------------------ */

export var root = _.root = (function (exports) {
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

export var detectMocha = _.detectMocha = (function (exports) {
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

    exports = function exports() {
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

export var keys = _.keys = (function (exports) {
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
        exports = function exports(obj) {
            var ret = [],
                key;

            for (key in obj) {
                if (has(obj, key)) ret.push(key);
            }

            return ret;
        };
    }

    return exports;
})({});

/* ------------------------------ each ------------------------------ */

export var each = _.each = (function (exports) {
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

    /* dependencies
     * isArrLike keys optimizeCb types 
     */

    exports = function exports(obj, iterator, ctx) {
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

export var createAssigner = _.createAssigner = (function (exports) {
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

    exports = function exports(keysFn, defaults) {
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

export var values = _.values = (function (exports) {
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

    exports = function exports(obj) {
        var ret = [];
        each(obj, function(val) {
            ret.push(val);
        });
        return ret;
    };

    return exports;
})({});

/* ------------------------------ contain ------------------------------ */

export var contain = _.contain = (function (exports) {
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

    exports = function exports(arr, val) {
        if (isStr(arr)) return arr.indexOf(val) > -1;
        if (!isArrLike(arr)) arr = values(arr);
        return idxOf(arr, val) >= 0;
    };

    return exports;
})({});

/* ------------------------------ extendOwn ------------------------------ */

export var extendOwn = _.extendOwn = (function (exports) {
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

/* ------------------------------ isMatch ------------------------------ */

export var isMatch = _.isMatch = (function (exports) {
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

    exports = function exports(obj, src) {
        var _keys = keys(src),
            len = _keys.length;

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

export var isNaN = _.isNaN = (function (exports) {
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

    exports = function exports(val) {
        return isNum(val) && val !== +val;
    };

    return exports;
})({});

/* ------------------------------ isNil ------------------------------ */

export var isNil = _.isNil = (function (exports) {
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
    exports = function exports(val) {
        return val == null;
    };

    return exports;
})({});

/* ------------------------------ isPromise ------------------------------ */

export var isPromise = _.isPromise = (function (exports) {
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

    exports = function exports(val) {
        return isObj(val) && isFn(val.then);
    };

    return exports;
})({});

/* ------------------------------ matcher ------------------------------ */

export var matcher = _.matcher = (function (exports) {
    /* Return a predicate function that checks if attrs are contained in an object.
     *
     * |Name  |Type    |Desc                              |
     * |------|--------|----------------------------------|
     * |attrs |object  |Object of property values to match|
     * |return|function|New predicate function            |
     */

    /* example
     * const objects = [
     *     {a: 1, b: 2, c: 3 },
     *     {a: 4, b: 5, c: 6 }
     * ];
     * // filter(objects, matcher({a: 4, c: 6 }));
     */

    /* typescript
     * export declare function matcher(attrs: any): Function;
     */

    /* dependencies
     * extendOwn isMatch 
     */

    exports = function exports(attrs) {
        attrs = extendOwn({}, attrs);
        return function(obj) {
            return isMatch(obj, attrs);
        };
    };

    return exports;
})({});

/* ------------------------------ safeCb ------------------------------ */

export var safeCb = _.safeCb = (function (exports) {
    /* Create callback based on input value.
     */

    /* typescript
     * export declare function safeCb(val?: any, ctx?: any, argCount?: number): Function;
     */

    /* dependencies
     * isFn isObj optimizeCb matcher identity 
     */

    exports = function exports(val, ctx, argCount) {
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

export var filter = _.filter = (function (exports) {
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

    /* dependencies
     * safeCb each types 
     */

    exports = function exports(obj, predicate, ctx) {
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

export var difference = _.difference = (function (exports) {
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

export var unique = _.unique = (function (exports) {
    /* Create duplicate-free version of an array.
     *
     * |Name     |Type    |Desc                         |
     * |---------|--------|-----------------------------|
     * |arr      |array   |Array to inspect             |
     * |[compare]|function|Function for comparing values|
     * |return   |array   |New duplicate free array     |
     */

    /* example
     * unique([1, 2, 3, 1]); // -> [1, 2, 3]
     */

    /* typescript
     * export declare function unique(
     *     arr: any[],
     *     compare?: (a: any, b: any) => boolean | number
     * ): any[];
     */

    /* dependencies
     * filter 
     */

    exports = function exports(arr, compare) {
        compare = compare || isEqual;
        return filter(arr, function(item, idx, arr) {
            var len = arr.length;

            while (++idx < len) {
                if (compare(item, arr[idx])) return false;
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

export var allKeys = _.allKeys = (function (exports) {
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
     * var obj = Object.create({zero: 0});
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

    exports = function exports(obj) {
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

/* ------------------------------ extend ------------------------------ */

export var extend = _.extend = (function (exports) {
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

export var map = _.map = (function (exports) {
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

    /* dependencies
     * safeCb keys isArrLike types 
     */

    exports = function exports(obj, iterator, ctx) {
        iterator = safeCb(iterator, ctx);

        var _keys = !isArrLike(obj) && keys(obj),
            len = (_keys || obj).length,
            results = Array(len);

        for (var i = 0; i < len; i++) {
            var curKey = _keys ? _keys[i] : i;
            results[i] = iterator(obj[curKey], curKey, obj);
        }

        return results;
    };

    return exports;
})({});

/* ------------------------------ toArr ------------------------------ */

export var toArr = _.toArr = (function (exports) {
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

    exports = function exports(val) {
        if (!val) return [];
        if (isArr(val)) return val;
        if (isArrLike(val) && !isStr(val)) return map(val);
        return [val];
    };

    return exports;
})({});

/* ------------------------------ Class ------------------------------ */

export var Class = _.Class = (function (exports) {
    /* Create JavaScript class.
     *
     * |Name     |Type    |Desc                             |
     * |---------|--------|---------------------------------|
     * |methods  |object  |Public methods                   |
     * |[statics]|object  |Static methods                   |
     * |return   |function|Function used to create instances|
     */

    /* example
     * var People = Class({
     *     initialize: function People(name, age) {
     *         this.name = name;
     *         this.age = age;
     *     },
     *     introduce: function () {
     *         return 'I am ' + this.name + ', ' + this.age + ' years old.';
     *     }
     * });
     *
     * var Student = People.extend({
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
     * var a = new Student('allen', 17, 'Hogwarts');
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

    exports = function exports(methods, statics) {
        return Base.extend(methods, statics);
    };

    function makeClass(parent, methods, statics) {
        statics = statics || {};
        var className =
            methods.className || safeGet(methods, 'initialize.name') || '';
        delete methods.className;
        var ctor;

        if (isMiniProgram) {
            ctor = function ctor() {
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
        callSuper: function callSuper(parent, name, args) {
            var superMethod = parent.prototype[name];
            return superMethod.apply(this, args);
        },
        toString: function toString() {
            return this.constructor.name;
        }
    }));

    return exports;
})({});

/* ------------------------------ now ------------------------------ */

export var now = _.now = (function (exports) {
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

/* ------------------------------ type ------------------------------ */

export var type = _.type = (function (exports) {
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
     * export declare function type(val: any, lowerCase: boolean): string;
     */

    /* dependencies
     * objToStr isNaN 
     */

    exports = function exports(val) {
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

export var toSrc = _.toSrc = (function (exports) {
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

    exports = function exports(fn) {
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

export var stringifyAll = _.stringifyAll = (function (exports) {
    function _typeof(obj) {
        if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
            _typeof = function _typeof(obj) {
                return typeof obj;
            };
        } else {
            _typeof = function _typeof(obj) {
                return obj &&
                    typeof Symbol === 'function' &&
                    obj.constructor === Symbol &&
                    obj !== Symbol.prototype
                    ? 'symbol'
                    : typeof obj;
            };
        }
        return _typeof(obj);
    }

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

    exports = (function(_exports) {
        function exports(_x) {
            return _exports.apply(this, arguments);
        }

        exports.toString = function() {
            return _exports.toString();
        };

        return exports;
    })(function(obj) {
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
                            return _typeof(key) === 'symbol';
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
    });

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
        initialize: function initialize() {
            this.id = 0;
            this.visited = [];
        },
        set: function set(val) {
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
        get: function get(val) {
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

export default _;