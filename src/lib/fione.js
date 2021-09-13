// Built by eustia.
/* eslint-disable */

var _ = {};

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
     *     type Fn<T> = (...args: any[]) => T;
     *     type AnyFn = Fn<any>;
     *     type PlainObj<T> = { [name: string]: T };
     * }
     * export declare const types: {};
     */
    exports = {};

    return exports;
})({});

/* ------------------------------ isBrowser ------------------------------ */

export var isBrowser = _.isBrowser = (function (exports) {
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

/* ------------------------------ isObj ------------------------------ */

export var isObj = _.isObj = (function (exports) {
    /* Check if value is the language type of Object.
     *
     * |Name  |Desc                      |
     * |------|--------------------------|
     * |val   |Value to check            |
     * |return|True if value is an object|
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

/* ------------------------------ toStr ------------------------------ */

export var toStr = _.toStr = (function (exports) {
    /* Convert value to a string.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |val   |Value to convert|
     * |return|Result string   |
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

/* ------------------------------ has ------------------------------ */

export var has = _.has = (function (exports) {
    /* Checks if key is a direct property.
     *
     * |Name  |Desc                            |
     * |------|--------------------------------|
     * |obj   |Object to query                 |
     * |key   |Path to check                   |
     * |return|True if key is a direct property|
     */

    /* example
     * has({ one: 1 }, 'one'); // -> true
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

/* ------------------------------ keys ------------------------------ */

export var keys = _.keys = (function (exports) {
    /* Create an array of the own enumerable property names of object.
     *
     * |Name  |Desc                   |
     * |------|-----------------------|
     * |obj   |Object to query        |
     * |return|Array of property names|
     */

    /* example
     * keys({ a: 1 }); // -> ['a']
     */

    /* typescript
     * export declare function keys(obj: any): string[];
     */

    /* dependencies
     * has 
     */

    if (Object.keys && !false) {
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

/* ------------------------------ create ------------------------------ */

export var create = _.create = (function (exports) {
    /* Create new object using given object as prototype.
     *
     * |Name  |Desc                   |
     * |------|-----------------------|
     * |proto |Prototype of new object|
     * |return|Created object         |
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
        if (objCreate && !false) return objCreate(proto);

        function noop() {}

        noop.prototype = proto;
        return new noop();
    };

    var objCreate = Object.create;

    return exports;
})({});

/* ------------------------------ inherits ------------------------------ */

export var inherits = _.inherits = (function (exports) {
    /* Inherit the prototype methods from one constructor into another.
     *
     * |Name      |Desc       |
     * |----------|-----------|
     * |Class     |Child Class|
     * |SuperClass|Super Class|
     */

    /* example
     * function People(name) {
     *     this._name = name;
     * }
     * People.prototype = {
     *     getName: function() {
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
     * export declare function inherits(
     *     Class: types.AnyFn,
     *     SuperClass: types.AnyFn
     * ): void;
     */

    /* dependencies
     * create types 
     */

    exports = function(Class, SuperClass) {
        Class.prototype = create(SuperClass.prototype);
    };

    return exports;
})({});

/* ------------------------------ isUndef ------------------------------ */

export var isUndef = _.isUndef = (function (exports) {
    /* Check if value is undefined.
     *
     * |Name  |Desc                      |
     * |------|--------------------------|
     * |val   |Value to check            |
     * |return|True if value is undefined|
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

/* ------------------------------ optimizeCb ------------------------------ */

export var optimizeCb = _.optimizeCb = (function (exports) {
    /* Used for function context binding.
     */

    /* typescript
     * export declare function optimizeCb(
     *     fn: types.AnyFn,
     *     ctx: any,
     *     argCount?: number
     * ): types.AnyFn;
     */

    /* dependencies
     * isUndef types 
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

/* ------------------------------ last ------------------------------ */

export var last = _.last = (function (exports) {
    /* Get the last element of array.
     *
     * |Name  |Desc                     |
     * |------|-------------------------|
     * |arr   |The array to query       |
     * |return|The last element of array|
     */

    /* example
     * last([1, 2]); // -> 2
     */

    /* typescript
     * export declare function last(arr: any[]): any;
     */
    exports = function(arr) {
        var len = arr ? arr.length : 0;
        if (len) return arr[len - 1];
    };

    return exports;
})({});

/* ------------------------------ identity ------------------------------ */

export var identity = _.identity = (function (exports) {
    /* Return the first argument given.
     *
     * |Name  |Desc       |
     * |------|-----------|
     * |val   |Any value  |
     * |return|Given value|
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

export var objToStr = _.objToStr = (function (exports) {
    /* Alias of Object.prototype.toString.
     *
     * |Name  |Desc                                |
     * |------|------------------------------------|
     * |val   |Source value                        |
     * |return|String representation of given value|
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

export var isArgs = _.isArgs = (function (exports) {
    /* Check if value is classified as an arguments object.
     *
     * |Name  |Desc                                |
     * |------|------------------------------------|
     * |val   |Value to check                      |
     * |return|True if value is an arguments object|
     */

    /* example
     * isArgs(
     *     (function() {
     *         return arguments;
     *     })()
     * ); // -> true
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

export var isArr = _.isArr = (function (exports) {
    /* Check if value is an `Array` object.
     *
     * |Name  |Desc                              |
     * |------|----------------------------------|
     * |val   |Value to check                    |
     * |return|True if value is an `Array` object|
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

    if (Array.isArray && !false) {
        exports = Array.isArray;
    } else {
        exports = function(val) {
            return objToStr(val) === '[object Array]';
        };
    }

    return exports;
})({});

/* ------------------------------ castPath ------------------------------ */

export var castPath = _.castPath = (function (exports) {
    /* Cast value into a property path array.
     *
     * |Name  |Desc               |
     * |------|-------------------|
     * |path  |Value to inspect   |
     * |obj   |Object to query    |
     * |return|Property path array|
     */

    /* example
     * castPath('a.b.c'); // -> ['a', 'b', 'c']
     * castPath(['a']); // -> ['a']
     * castPath('a[0].b'); // -> ['a', '0', 'b']
     * castPath('a.b.c', { 'a.b.c': true }); // -> ['a.b.c']
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

export var safeGet = _.safeGet = (function (exports) {
    /* Get object property, don't throw undefined error.
     *
     * |Name  |Desc                     |
     * |------|-------------------------|
     * |obj   |Object to query          |
     * |path  |Path of property to get  |
     * |return|Target value or undefined|
     */

    /* example
     * const obj = { a: { aa: { aaa: 1 } } };
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

/* ------------------------------ isFn ------------------------------ */

export var isFn = _.isFn = (function (exports) {
    /* Check if value is a function.
     *
     * |Name  |Desc                       |
     * |------|---------------------------|
     * |val   |Value to check             |
     * |return|True if value is a function|
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

export var getProto = _.getProto = (function (exports) {
    /* Get prototype of an object.
     *
     * |Name  |Desc                                         |
     * |------|---------------------------------------------|
     * |obj   |Target object                                |
     * |return|Prototype of given object, null if not exists|
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
        if (!isObj(obj)) return;
        if (getPrototypeOf && !false) return getPrototypeOf(obj);
        var proto = obj.__proto__;
        if (proto || proto === null) return proto;
        if (isFn(obj.constructor)) return obj.constructor.prototype;
        if (obj instanceof ObjectCtr) return ObjectCtr.prototype;
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

/* ------------------------------ isNum ------------------------------ */

export var isNum = _.isNum = (function (exports) {
    /* Check if value is classified as a Number primitive or object.
     *
     * |Name  |Desc                                 |
     * |------|-------------------------------------|
     * |val   |Value to check                       |
     * |return|True if value is correctly classified|
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

export var isArrLike = _.isArrLike = (function (exports) {
    /* Check if value is array-like.
     *
     * |Name  |Desc                       |
     * |------|---------------------------|
     * |val   |Value to check             |
     * |return|True if value is array like|
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

/* ------------------------------ each ------------------------------ */

export var each = _.each = (function (exports) {
    /* Iterate over elements of collection and invokes iterator for each element.
     *
     * |Name    |Desc                          |
     * |--------|------------------------------|
     * |obj     |Collection to iterate over    |
     * |iterator|Function invoked per iteration|
     * |ctx     |Function context              |
     */

    /* example
     * each({ a: 1, b: 2 }, function(val, key) {});
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

export var createAssigner = _.createAssigner = (function (exports) {
    /* Used to create extend, extendOwn and defaults.
     *
     * |Name    |Desc                          |
     * |--------|------------------------------|
     * |keysFn  |Function to get object keys   |
     * |defaults|No override when set to true  |
     * |return  |Result function, extend...    |
     */

    /* typescript
     * export declare function createAssigner(
     *     keysFn: types.AnyFn,
     *     defaults: boolean
     * ): types.AnyFn;
     */

    /* dependencies
     * isUndef each types 
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

/* ------------------------------ extendOwn ------------------------------ */

export var extendOwn = _.extendOwn = (function (exports) {
    /* Like extend, but only copies own properties over to the destination object.
     *
     * |Name       |Desc              |
     * |-----------|------------------|
     * |destination|Destination object|
     * |...sources |Sources objects   |
     * |return     |Destination object|
     */

    /* example
     * extendOwn({ name: 'RedHood' }, { age: 24 }); // -> {name: 'RedHood', age: 24}
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

/* ------------------------------ isStr ------------------------------ */

export var isStr = _.isStr = (function (exports) {
    /* Check if value is a string primitive.
     *
     * |Name  |Desc                               |
     * |------|-----------------------------------|
     * |val   |Value to check                     |
     * |return|True if value is a string primitive|
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

/* ------------------------------ isEmpty ------------------------------ */

export var isEmpty = _.isEmpty = (function (exports) {
    /* Check if value is an empty object or array.
     *
     * |Name  |Desc                  |
     * |------|----------------------|
     * |val   |Value to check        |
     * |return|True if value is empty|
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

export var isMatch = _.isMatch = (function (exports) {
    /* Check if keys and values in src are contained in obj.
     *
     * |Name  |Desc                              |
     * |------|----------------------------------|
     * |obj   |Object to inspect                 |
     * |src   |Object of property values to match|
     * |return|True if object is match           |
     */

    /* example
     * isMatch({ a: 1, b: 2 }, { a: 1 }); // -> true
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

/* ------------------------------ ltrim ------------------------------ */

export var ltrim = _.ltrim = (function (exports) {
    /* Remove chars or white-spaces from beginning of string.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |str   |String to trim    |
     * |chars |Characters to trim|
     * |return|Trimmed string    |
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

export var matcher = _.matcher = (function (exports) {
    /* Return a predicate function that checks if attrs are contained in an object.
     *
     * |Name  |Desc                              |
     * |------|----------------------------------|
     * |attrs |Object of property values to match|
     * |return|New predicate function            |
     */

    /* example
     * const filter = require('licia/filter');
     *
     * const objects = [
     *     { a: 1, b: 2, c: 3 },
     *     { a: 4, b: 5, c: 6 }
     * ];
     * filter(objects, matcher({ a: 4, c: 6 })); // -> [{a: 4, b: 5, c: 6}]
     */

    /* typescript
     * export declare function matcher(attrs: any): types.AnyFn;
     */

    /* dependencies
     * extendOwn isMatch types 
     */

    exports = function(attrs) {
        attrs = extendOwn({}, attrs);
        return function(obj) {
            return isMatch(obj, attrs);
        };
    };

    return exports;
})({});

/* ------------------------------ memStorage ------------------------------ */

export var memStorage = _.memStorage = (function (exports) {
    /* Memory-backed implementation of the Web Storage API.
     *
     * A replacement for environments where localStorage or sessionStorage is not available.
     */

    /* example
     * const localStorage = window.localStorage || memStorage;
     * localStorage.setItem('test', 'licia');
     */

    /* typescript
     * export declare const memStorage: typeof window.localStorage;
     */

    /* dependencies
     * keys 
     */

    exports = {
        getItem: function(key) {
            return (API_KEYS[key] ? cloak[key] : this[key]) || null;
        },
        setItem: function(key, val) {
            API_KEYS[key] ? (cloak[key] = val) : (this[key] = val);
        },
        removeItem: function(key) {
            API_KEYS[key] ? delete cloak[key] : delete this[key];
        },
        key: function(i) {
            var keys = enumerableKeys();
            return i >= 0 && i < keys.length ? keys[i] : null;
        },
        clear: function() {
            var keys = uncloakedKeys();
            /* eslint-disable no-cond-assign */

            for (var i = 0, key; (key = keys[i]); i++) {
                delete this[key];
            }

            keys = cloakedKeys();
            /* eslint-disable no-cond-assign */

            for (var _i = 0, _key; (_key = keys[_i]); _i++) {
                delete cloak[_key];
            }
        }
    };
    Object.defineProperty(exports, 'length', {
        enumerable: false,
        configurable: true,
        get: function() {
            return enumerableKeys().length;
        }
    });
    var cloak = {};
    var API_KEYS = {
        getItem: 1,
        setItem: 1,
        removeItem: 1,
        key: 1,
        clear: 1,
        length: 1
    };

    function enumerableKeys() {
        return uncloakedKeys().concat(cloakedKeys());
    }

    function uncloakedKeys() {
        return keys(exports).filter(function(key) {
            return !API_KEYS[key];
        });
    }

    function cloakedKeys() {
        return keys(cloak);
    }

    return exports;
})({});

/* ------------------------------ property ------------------------------ */

export var property = _.property = (function (exports) {
    /* Return a function that will itself return the key property of any passed-in object.
     *
     * |Name  |Desc                       |
     * |------|---------------------------|
     * |path  |Path of the property to get|
     * |return|New accessor function      |
     */

    /* example
     * const obj = { a: { b: 1 } };
     * property('a')(obj); // -> {b: 1}
     * property(['a', 'b'])(obj); // -> 1
     */

    /* typescript
     * export declare function property(path: string | string[]): types.AnyFn;
     */

    /* dependencies
     * isArr safeGet types 
     */

    exports = function(path) {
        if (!isArr(path)) return shallowProperty(path);
        return function(obj) {
            return safeGet(obj, path);
        };
    };

    function shallowProperty(key) {
        return function(obj) {
            return obj == null ? void 0 : obj[key];
        };
    }

    return exports;
})({});

/* ------------------------------ safeCb ------------------------------ */

export var safeCb = _.safeCb = (function (exports) {
    /* Create callback based on input value.
     */

    /* typescript
     * export declare function safeCb(
     *     val?: any,
     *     ctx?: any,
     *     argCount?: number
     * ): types.AnyFn;
     */

    /* dependencies
     * isFn isObj isArr optimizeCb matcher identity types property 
     */

    exports = function(val, ctx, argCount) {
        if (val == null) return identity;
        if (isFn(val)) return optimizeCb(val, ctx, argCount);
        if (isObj(val) && !isArr(val)) return matcher(val);
        return property(val);
    };

    return exports;
})({});

/* ------------------------------ filter ------------------------------ */

export var filter = _.filter = (function (exports) {
    /* Iterates over elements of collection, returning an array of all the values that pass a truth test.
     *
     * |Name     |Desc                                   |
     * |---------|---------------------------------------|
     * |obj      |Collection to iterate over             |
     * |predicate|Function invoked per iteration         |
     * |ctx      |Predicate context                      |
     * |return   |Array of all values that pass predicate|
     */

    /* example
     * filter([1, 2, 3, 4, 5], function(val) {
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

/* ------------------------------ unique ------------------------------ */

export var unique = _.unique = (function (exports) {
    /* Create duplicate-free version of an array.
     *
     * |Name  |Desc                         |
     * |------|-----------------------------|
     * |arr   |Array to inspect             |
     * |cmp   |Function for comparing values|
     * |return|New duplicate free array     |
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

export var allKeys = _.allKeys = (function (exports) {
    /* Retrieve all the names of object's own and inherited properties.
     *
     * |Name   |Desc                       |
     * |-------|---------------------------|
     * |obj    |Object to query            |
     * |options|Options                    |
     * |return |Array of all property names|
     *
     * Available options:
     *
     * |Name              |Desc                     |
     * |------------------|-------------------------|
     * |prototype=true    |Include prototype keys   |
     * |unenumerable=false|Include unenumerable keys|
     * |symbol=false      |Include symbol keys      |
     *
     * Members of Object's prototype won't be retrieved.
     */

    /* example
     * const obj = Object.create({ zero: 0 });
     * obj.one = 1;
     * allKeys(obj); // -> ['zero', 'one']
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

/* ------------------------------ extend ------------------------------ */

export var extend = _.extend = (function (exports) {
    /* Copy all of the properties in the source objects over to the destination object.
     *
     * |Name       |Desc              |
     * |-----------|------------------|
     * |destination|Destination object|
     * |...sources |Sources objects   |
     * |return     |Destination object|
     */

    /* example
     * extend({ name: 'RedHood' }, { age: 24 }); // -> {name: 'RedHood', age: 24}
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
     * |Name    |Desc                          |
     * |--------|------------------------------|
     * |object  |Collection to iterate over    |
     * |iterator|Function invoked per iteration|
     * |context |Function context              |
     * |return  |New mapped array              |
     */

    /* example
     * map([4, 8], function(n) {
     *     return n * n;
     * }); // -> [16, 64]
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

/* ------------------------------ toArr ------------------------------ */

export var toArr = _.toArr = (function (exports) {
    /* Convert value to an array.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |val   |Value to convert|
     * |return|Converted array |
     */

    /* example
     * toArr({ a: 1, b: 2 }); // -> [{a: 1, b: 2}]
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

export var Class = _.Class = (function (exports) {
    /* Create JavaScript class.
     *
     * |Name   |Desc                             |
     * |-------|---------------------------------|
     * |methods|Public methods                   |
     * [statics|Static methods                   |
     * |return |Function used to create instances|
     */

    /* example
     * const People = Class({
     *     initialize: function People(name, age) {
     *         this.name = name;
     *         this.age = age;
     *     },
     *     introduce: function() {
     *         return 'I am ' + this.name + ', ' + this.age + ' years old.';
     *     }
     * });
     *
     * const Student = People.extend(
     *     {
     *         initialize: function Student(name, age, school) {
     *             this.callSuper(People, 'initialize', arguments);
     *
     *             this.school = school;
     *         },
     *         introduce: function() {
     *             return (
     *                 this.callSuper(People, 'introduce') +
     *                 '\n I study at ' +
     *                 this.school +
     *                 '.'
     *             );
     *         }
     *     },
     *     {
     *         is: function(obj) {
     *             return obj instanceof Student;
     *         }
     *     }
     * );
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
     *         static inherits(Class: types.AnyFn): void;
     *         static methods(methods: any): IConstructor;
     *         static statics(statics: any): IConstructor;
     *         [method: string]: any;
     *     }
     * }
     * export declare function Class(methods: any, statics?: any): Class.IConstructor;
     */

    /* dependencies
     * extend toArr inherits safeGet isMiniProgram types 
     */

    exports = function(methods, statics) {
        return Base.extend(methods, statics);
    };

    function makeClass(parent, methods, statics) {
        statics = statics || {};
        var className =
            methods.className || safeGet(methods, 'initialize.name') || '';
        delete methods.className;

        var ctor = function() {
            var args = toArr(arguments);
            return this.initialize
                ? this.initialize.apply(this, args) || this
                : this;
        };

        if (!isMiniProgram) {
            // unsafe-eval CSP violation
            try {
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
            } catch (e) {
                /* eslint-disable no-empty */
            }
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

/* ------------------------------ toNum ------------------------------ */

export var toNum = _.toNum = (function (exports) {
    /* Convert value to a number.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |val   |Value to process|
     * |return|Result number   |
     */

    /* example
     * toNum('5'); // -> 5
     */

    /* typescript
     * export declare function toNum(val: any): number;
     */

    /* dependencies
     * isNum isObj isFn isStr 
     */

    exports = function(val) {
        if (isNum(val)) return val;

        if (isObj(val)) {
            var temp = isFn(val.valueOf) ? val.valueOf() : val;
            val = isObj(temp) ? temp + '' : temp;
        }

        if (!isStr(val)) return val === 0 ? val : +val;
        return +val;
    };

    return exports;
})({});

/* ------------------------------ pxToNum ------------------------------ */

export var pxToNum = _.pxToNum = (function (exports) {
    /* Turn string like '0px' to number.
     */

    /* dependencies
     * toNum 
     */

    exports = function (str) {
      return toNum(str.replace('px', ''))
    }

    return exports;
})({});

/* ------------------------------ rtrim ------------------------------ */

export var rtrim = _.rtrim = (function (exports) {
    /* Remove chars or white-spaces from end of string.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |str   |String to trim    |
     * |chars |Characters to trim|
     * |return|Trimmed string    |
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

export var trim = _.trim = (function (exports) {
    /* Remove chars or white-spaces from beginning end of string.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |str   |String to trim    |
     * |chars |Characters to trim|
     * |return|Trimmed string    |
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

export var query = _.query = (function (exports) {
    /* Parse and stringify url query strings.
     *
     * ### parse
     *
     * Parse a query string into an object.
     *
     * |Name  |Desc        |
     * |------|------------|
     * |str   |Query string|
     * |return|Query object|
     *
     * ### stringify
     *
     * Stringify an object into a query string.
     *
     * |Name  |Desc        |
     * |------|------------|
     * |obj   |Query object|
     * |return|Query string|
     */

    /* example
     * query.parse('foo=bar&eruda=true'); // -> {foo: 'bar', eruda: 'true'}
     * query.stringify({ foo: 'bar', eruda: 'true' }); // -> 'foo=bar&eruda=true'
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

/* ------------------------------ Url ------------------------------ */

export var Url = _.Url = (function (exports) {
    /* Simple url manipulator.
     *
     * ### constructor
     *
     * |Name        |Desc      |
     * |------------|----------|
     * |url=location|Url string|
     *
     * ### setQuery
     *
     * Set query value.
     *
     * |Name  |Desc       |
     * |------|-----------|
     * |name  |Query name |
     * |val   |Query value|
     * |return|this       |
     *
     * |Name  |Desc        |
     * |------|------------|
     * |query |query object|
     * |return|this        |
     *
     * ### rmQuery
     *
     * Remove query value.
     *
     * |Name  |Desc      |
     * |------|----------|
     * |name  |Query name|
     * |return|this      |
     *
     * ### parse
     *
     * [static] Parse url into an object.
     *
     * |Name  |Desc      |
     * |------|----------|
     * |url   |Url string|
     * |return|Url object|
     *
     * ### stringify
     *
     * [static] Stringify url object into a string.
     *
     * |Name  |Desc      |
     * |------|----------|
     * |url   |Url object|
     * |return|Url string|
     *
     * An url object contains the following properties:
     *
     * |Name    |Desc                                                                                  |
     * |--------|--------------------------------------------------------------------------------------|
     * |protocol|The protocol scheme of the URL (e.g. http:)                                           |
     * |slashes |A boolean which indicates whether the protocol is followed by two forward slashes (//)|
     * |auth    |Authentication information portion (e.g. username:password)                           |
     * |hostname|Host name without port number                                                         |
     * |port    |Optional port number                                                                  |
     * |pathname|URL path                                                                              |
     * |query   |Parsed object containing query string                                                 |
     * |hash    |The "fragment" portion of the URL including the pound-sign (#)                        |
     */

    /* example
     * const url = new Url('http://example.com:8080?eruda=true');
     * console.log(url.port); // -> '8080'
     * url.query.foo = 'bar';
     * url.rmQuery('eruda');
     * url.toString(); // -> 'http://example.com:8080/?foo=bar'
     */

    /* typescript
     * export declare namespace Url {
     *     interface IUrl {
     *         protocol: string;
     *         auth: string;
     *         hostname: string;
     *         hash: string;
     *         query: any;
     *         port: string;
     *         pathname: string;
     *         slashes: boolean;
     *     }
     * }
     * export declare class Url {
     *     protocol: string;
     *     auth: string;
     *     hostname: string;
     *     hash: string;
     *     query: any;
     *     port: string;
     *     pathname: string;
     *     slashes: boolean;
     *     constructor(url?: string);
     *     setQuery(name: string, val: string | number): Url;
     *     setQuery(query: types.PlainObj<string | number>): Url;
     *     rmQuery(name: string | string[]): Url;
     *     toString(): string;
     *     static parse(url: string): Url.IUrl;
     *     static stringify(object: Url.IUrl): string;
     * }
     */

    /* dependencies
     * Class extend trim query isEmpty each isArr toArr isBrowser isObj types toStr 
     */

    exports = Class(
        {
            className: 'Url',
            initialize: function(url) {
                if (!url && isBrowser) url = window.location.href;
                extend(this, exports.parse(url || ''));
            },
            setQuery: function(name, val) {
                var query = this.query;

                if (isObj(name)) {
                    each(name, function(val, key) {
                        query[key] = toStr(val);
                    });
                } else {
                    query[name] = toStr(val);
                }

                return this;
            },
            rmQuery: function(name) {
                var query = this.query;
                if (!isArr(name)) name = toArr(name);
                each(name, function(key) {
                    delete query[key];
                });
                return this;
            },
            toString: function() {
                return exports.stringify(this);
            }
        },
        {
            parse: function(url) {
                var ret = {
                    protocol: '',
                    auth: '',
                    hostname: '',
                    hash: '',
                    query: {},
                    port: '',
                    pathname: '',
                    slashes: false
                };
                var rest = trim(url);
                var slashes = false;
                var proto = rest.match(regProto);

                if (proto) {
                    proto = proto[0];
                    ret.protocol = proto.toLowerCase();
                    rest = rest.substr(proto.length);
                }

                if (proto) {
                    slashes = rest.substr(0, 2) === '//';

                    if (slashes) {
                        rest = rest.slice(2);
                        ret.slashes = true;
                    }
                }

                if (slashes) {
                    var host = rest;
                    var hostEnd = -1;

                    for (var i = 0, len = hostEndingChars.length; i < len; i++) {
                        var pos = rest.indexOf(hostEndingChars[i]);
                        if (pos !== -1 && (hostEnd === -1 || pos < hostEnd))
                            hostEnd = pos;
                    }

                    if (hostEnd > -1) {
                        host = rest.slice(0, hostEnd);
                        rest = rest.slice(hostEnd);
                    }

                    var atSign = host.lastIndexOf('@');

                    if (atSign !== -1) {
                        ret.auth = decodeURIComponent(host.slice(0, atSign));
                        host = host.slice(atSign + 1);
                    }

                    ret.hostname = host;
                    var port = host.match(regPort);

                    if (port) {
                        port = port[0];
                        if (port !== ':') ret.port = port.substr(1);
                        ret.hostname = host.substr(0, host.length - port.length);
                    }
                }

                var hash = rest.indexOf('#');

                if (hash !== -1) {
                    ret.hash = rest.substr(hash);
                    rest = rest.slice(0, hash);
                }

                var queryMark = rest.indexOf('?');

                if (queryMark !== -1) {
                    ret.query = query.parse(rest.substr(queryMark + 1));
                    rest = rest.slice(0, queryMark);
                }

                ret.pathname = rest || '/';
                return ret;
            },
            stringify: function(obj) {
                var ret =
                    obj.protocol +
                    (obj.slashes ? '//' : '') +
                    (obj.auth ? encodeURIComponent(obj.auth) + '@' : '') +
                    obj.hostname +
                    (obj.port ? ':' + obj.port : '') +
                    obj.pathname;
                if (!isEmpty(obj.query)) ret += '?' + query.stringify(obj.query);
                if (obj.hash) ret += obj.hash;
                return ret;
            }
        }
    );
    var regProto = /^([a-z0-9.+-]+:)/i;
    var regPort = /:[0-9]*$/;
    var hostEndingChars = ['/', '?', '#'];

    return exports;
})({});

/* ------------------------------ getFileName ------------------------------ */

export var getFileName = _.getFileName = (function (exports) {
    /* Extract file name from url.
     */

    /* dependencies
     * last trim Url 
     */

    exports = function (url) {
      let ret = last(url.split('/'))

      if (ret.indexOf('?') > -1) ret = trim(ret.split('?')[0])

      if (ret === '') {
        url = new Url(url)
        ret = url.hostname
      }

      return ret
    }

    return exports;
})({});

/* ------------------------------ safeStorage ------------------------------ */

export var safeStorage = _.safeStorage = (function (exports) {
    /* Safe localStorage and sessionStorage.
     */

    /* dependencies
     * isUndef memStorage 
     */

    exports = function (type, memReplacement) {
      if (isUndef(memReplacement)) memReplacement = true

      let ret

      switch (type) {
        case 'local':
          ret = window.localStorage
          break
        case 'session':
          ret = window.sessionStorage
          break
      }

      try {
        // Safari private browsing
        let x = 'test-localStorage-' + Date.now()
        ret.setItem(x, x)
        let y = ret.getItem(x)
        ret.removeItem(x)
        if (y !== x) throw new Error()
      } catch (e) {
        if (memReplacement) return memStorage
        return
      }

      return ret
    }

    return exports;
})({});

export default _;