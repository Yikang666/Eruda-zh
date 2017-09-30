// Built by eustia.
module.exports = (function ()
{
    var _ = {};

    /* ------------------------------ last ------------------------------ */

    var last = _.last = (function ()
    {
        /* Get the last element of array.
         *
         * |Name  |Type |Desc                     |
         * |------|-----|-------------------------|
         * |arr   |array|The array to query       |
         * |return|*    |The last element of array|
         *
         * ```javascript
         * last([1, 2]); // -> 2
         * ```
         */

        function exports(arr)
        {
            var len = arr ? arr.length : 0;

            if (len) return arr[len - 1];
        }

        return exports;
    })();

    /* ------------------------------ isUndef ------------------------------ */

    var isUndef = _.isUndef = (function ()
    {
        /* Check if value is undefined.
         *
         * |Name  |Type   |Desc                      |
         * |------|-------|--------------------------|
         * |val   |*      |Value to check            |
         * |return|boolean|True if value is undefined|
         *
         * ```javascript
         * isUndef(void 0); // -> true
         * isUndef(null); // -> false
         * ```
         */

        function exports(val)
        {
            return val === void 0;
        }

        return exports;
    })();

    /* ------------------------------ isObj ------------------------------ */

    var isObj = _.isObj = (function ()
    {
        /* Check if value is the language type of Object.
         *
         * |Name  |Type   |Desc                      |
         * |------|-------|--------------------------|
         * |val   |*      |Value to check            |
         * |return|boolean|True if value is an object|
         *
         * [Language Spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
         *
         * ```javascript
         * isObj({}); // -> true
         * isObj([]); // -> true
         * ```
         */

        function exports(val)
        {
            var type = typeof val;

            return !!val && (type === 'function' || type === 'object');
        }

        return exports;
    })();

    /* ------------------------------ startWith ------------------------------ */

    var startWith = _.startWith = (function ()
    {
        /* Check if string starts with the given target string.
         *
         * |Name  |Type   |Desc                             |
         * |------|-------|---------------------------------|
         * |str   |string |String to search                 |
         * |prefix|string |String prefix                    |
         * |return|boolean|True if string starts with prefix|
         *
         * ```javascript
         * startWith('ab', 'a'); // -> true
         * ```
         */

        function exports(str, prefix)
        {
            return str.indexOf(prefix) === 0;
        }

        return exports;
    })();

    /* ------------------------------ inherits ------------------------------ */

    var inherits = _.inherits = (function ()
    {
        /* Inherit the prototype methods from one constructor into another.
         *
         * |Name      |Type    |Desc       |
         * |----------|--------|-----------|
         * |Class     |function|Child Class|
         * |SuperClass|function|Super Class|
         *
         * ```javascript
         * function People(name)
         * {
         *     this._name = name;
         * }
         * People.prototype = {
         *     getName: function ()
         *     {
         *         return this._name;
         *     }
         * };
         * function Student(name)
         * {
         *     this._name = name;
         * }
         * inherits(Student, People);
         * var s = new Student('RedHood');
         * s.getName(); // -> 'RedHood'
         * ```
         */

        function exports(Class, SuperClass)
        {
            if (objCreate) return Class.prototype = objCreate(SuperClass.prototype);

            noop.prototype = SuperClass.prototype;
            Class.prototype = new noop();
        }

        var objCreate = Object.create;

        function noop() {}

        return exports;
    })();

    /* ------------------------------ has ------------------------------ */

    var has = _.has = (function ()
    {
        /* Checks if key is a direct property.
         *
         * |Name  |Type   |Desc                            |
         * |------|-------|--------------------------------|
         * |obj   |object |Object to query                 |
         * |key   |string |Path to check                   |
         * |return|boolean|True if key is a direct property|
         *
         * ```javascript
         * has({one: 1}, 'one'); // -> true
         * ```
         */

        var hasOwnProp = Object.prototype.hasOwnProperty;

        function exports(obj, key)
        {
            return hasOwnProp.call(obj, key);
        }

        return exports;
    })();

    /* ------------------------------ slice ------------------------------ */

    var slice = _.slice = (function ()
    {
        /* Create slice of source array or array-like object.
         *
         * |Name              |Type  |Desc                      |
         * |------------------|------|--------------------------|
         * |array             |array |Array to slice            |
         * |[start=0]         |number|Start position            |
         * |[end=array.length]|number|End position, not included|
         *
         * ```javascript
         * slice([1, 2, 3, 4], 1, 2); // -> [2]
         * ```
         */

        function exports(arr, start, end)
        {
            var len = arr.length;

            if (start == null)
            {
                start = 0;
            } else if (start < 0)
            {
                start = Math.max(len + start, 0);
            } else
            {
                start = Math.min(start, len);
            }

            if (end == null)
            {
                end = len;
            } else if (end < 0)
            {
                end = Math.max(len + end, 0);
            } else
            {
                end = Math.min(end, len);
            }

            var ret = [];
            while (start < end) ret.push(arr[start++]);

            return ret;
        }

        return exports;
    })();

    /* ------------------------------ keys ------------------------------ */

    var keys = _.keys = (function (exports)
    {
        /* Create an array of the own enumerable property names of object.
         *
         * |Name  |Type  |Desc                   |
         * |------|------|-----------------------|
         * |obj   |object|Object to query        |
         * |return|array |Array of property names|
         * 
         * ```javascript
         * keys({a: 1}); // -> ['a']
         * ```
         */

        /* dependencies
         * has 
         */

        exports = Object.keys || function (obj)
        {
            var ret = [], key;

            for (key in obj)
            {
                if (has(obj, key)) ret.push(key);
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ freeze ------------------------------ */

    var freeze = _.freeze = (function ()
    {
        /* Shortcut for Object.freeze.
         *
         * Use Object.defineProperties if Object.freeze is not supported.
         * 
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |obj   |object|Object to freeze|
         * |return|object|Object passed in|
         * 
         * ```javascript
         * var a = {b: 1};
         * freeze(a);
         * a.b = 2;
         * console.log(a); // -> {b: 1}
         * ```
         */

        /* dependencies
         * keys 
         */

        function exports(obj) 
        {
            if (Object.freeze) return Object.freeze(obj);

            keys(obj).forEach(function (prop) 
            {
                if (!Object.getOwnPropertyDescriptor(obj, prop).configurable) return;

                Object.defineProperty(obj, prop, {
                    writable: false,
                    configurable: false
                });
            });

            return obj;
        }

        return exports;
    })();

    /* ------------------------------ noop ------------------------------ */

    var noop = _.noop = (function ()
    {
        /* A no-operation function.
         *
         * ```javascript
         * noop(); // Does nothing
         * ```
         */

        function exports() {}

        return exports;
    })();

    /* ------------------------------ allKeys ------------------------------ */

    var allKeys = _.allKeys = (function ()
    {
        /* Retrieve all the names of object's own and inherited properties.
         *
         * |Name  |Type  |Desc                       |
         * |------|------|---------------------------|
         * |obj   |object|Object to query            |
         * |return|array |Array of all property names|
         *
         * > Members of Object's prototype won't be retrieved.
         *
         * ```javascript
         * var obj = Object.create({zero: 0});
         * obj.one = 1;
         * allKeys(obj) // -> ['zero', 'one']
         * ```
         */

        function exports(obj)
        {
            var ret = [], key;

            for (key in obj) ret.push(key);

            return ret;
        }

        return exports;
    })();

    /* ------------------------------ before ------------------------------ */

    var before = _.before = (function ()
    {
        /* Create a function that invokes less than n times.
         *
         * |Name  |Type    |Desc                                            |
         * |------|--------|------------------------------------------------|
         * |n     |number  |Number of calls at which fn is no longer invoked|
         * |fn    |function|Function to restrict                            |
         * |return|function|New restricted function                         |
         *
         * Subsequent calls to the created function return the result of the last fn invocation.
         *
         * ```javascript
         * $(element).on('click', before(5, function() {}));
         * // -> allow function to be call 4 times at last.
         * ```
         */

        function exports(n, fn)
        {
            var memo;

            return function ()
            {
                if (--n > 0) memo = fn.apply(this, arguments);
                if (n <= 1) fn = null;

                return memo;
            };
        }

        return exports;
    })();

    /* ------------------------------ splitCase ------------------------------ */

    var splitCase = _.splitCase = (function ()
    {
        /* Split different string case to an array.
         *
         * |Name  |Type  |Desc           |
         * |------|------|---------------|
         * |str   |string|String to split|
         * |return|array |Result array   |
         *
         * ```javascript
         * splitCase('foo-bar'); // -> ['foo', 'bar']
         * splitCase('foo bar'); // -> ['foo', 'bar']
         * splitCase('foo_bar'); // -> ['foo', 'bar']
         * splitCase('foo.bar'); // -> ['foo', 'bar']
         * splitCase('fooBar'); // -> ['foo', 'bar']
         * splitCase('foo-Bar'); // -> ['foo', 'bar']
         * ```
         */

        var regUpperCase = /([A-Z])/g,
            regSeparator = /[_.\- ]+/g,
            regTrim = /(^-)|(-$)/g;

        function exports(str)
        {
            str = str.replace(regUpperCase, '-$1')
                     .toLowerCase()
                     .replace(regSeparator, '-')
                     .replace(regTrim, '');

            return str.split('-');
        }

        return exports;
    })();

    /* ------------------------------ camelCase ------------------------------ */

    var camelCase = _.camelCase = (function ()
    {
        /* Convert string to "camelCase".
         *
         * |Name  |Type  |Desc              |
         * |------|------|------------------|
         * |str   |string|String to convert |
         * |return|string|Camel cased string|
         *
         * ```javascript
         * camelCase('foo-bar'); // -> fooBar
         * camelCase('foo bar'); // -> fooBar
         * camelCase('foo_bar'); // -> fooBar
         * camelCase('foo.bar'); // -> fooBar
         * ```
         */

        /* dependencies
         * splitCase 
         */

        function exports(str)
        {
            var arr = splitCase(str);

            var ret = arr[0];
            arr.shift();

            arr.forEach(capitalize, arr);
            ret += arr.join('');

            return ret;
        }

        function capitalize(val, idx)
        {
            this[idx] = val.replace(/\w/, function (match)
            {
                return match.toUpperCase();
            });
        }

        return exports;
    })();

    /* ------------------------------ kebabCase ------------------------------ */

    var kebabCase = _.kebabCase = (function ()
    {
        /* Convert string to "kebabCase".
         *
         * |Name  |Type  |Desc              |
         * |------|------|------------------|
         * |str   |string|String to convert |
         * |return|string|Kebab cased string|
         *
         * ```javascript
         * kebabCase('fooBar'); // -> foo-bar
         * kebabCase('foo bar'); // -> foo-bar
         * kebabCase('foo_bar'); // -> foo-bar
         * kebabCase('foo.bar'); // -> foo-bar
         * ```
         */

        /* dependencies
         * splitCase 
         */

        function exports(str)
        {
            return splitCase(str).join('-');
        }

        return exports;
    })();

    /* ------------------------------ idxOf ------------------------------ */

    var idxOf = _.idxOf = (function ()
    {
        /* Get the index at which the first occurrence of value.
         *
         * |Name       |Type  |Desc                |
         * |-----------|------|--------------------|
         * |arr        |array |Array to search     |
         * |val        |*     |Value to search for |
         * |[fromIdx=0]|number|Index to search from|
         *
         * ```javascript
         * idxOf([1, 2, 1, 2], 2, 2); // -> 3
         * ```
         */

        function exports(arr, val, fromIdx)
        {
            return Array.prototype.indexOf.call(arr, val, fromIdx);
        }

        return exports;
    })();

    /* ------------------------------ toStr ------------------------------ */

    var toStr = _.toStr = (function ()
    {
        /* Convert value to a string.
         *
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |val   |*     |Value to convert|
         * |return|string|Resulted string |
         *
         * ```javascript
         * toStr(null); // -> ''
         * toStr(1); // -> '1'
         * toStr(false); // -> 'false'
         * toStr([1, 2, 3]); // -> '1,2,3'
         * ```
         */

        function exports(val)
        {
            return val == null ? '' : val.toString();
        }

        return exports;
    })();

    /* ------------------------------ isBrowser ------------------------------ */

    var isBrowser = _.isBrowser = (function (exports)
    {
        /* Check if running in a browser.
         *
         * ```javascript
         * console.log(isBrowser); // -> true if running in a browser
         * ```
         */

        exports = typeof window === 'object' &&
                  typeof document === 'object' &&
                  document.nodeType === 9;

        return exports;
    })({});

    /* ------------------------------ optimizeCb ------------------------------ */

    var optimizeCb = _.optimizeCb = (function ()
    {
        /* Used for function context binding.
         */

        /* dependencies
         * isUndef 
         */

        function exports(fn, ctx, argCount)
        {
            if (isUndef(ctx)) return fn;

            switch (argCount == null ? 3 : argCount)
            {
                case 1: return function (val)
                {
                    return fn.call(ctx, val);
                };
                case 3: return function (val, idx, collection)
                {
                    return fn.call(ctx, val, idx, collection);
                };
                case 4: return function (accumulator, val, idx, collection)
                {
                    return fn.call(ctx, accumulator, val, idx, collection);
                }
            }

            return function ()
            {
                return fn.apply(ctx, arguments);
            };
        }

        return exports;
    })();

    /* ------------------------------ endWith ------------------------------ */

    _.endWith = (function ()
    {
        /* Check if string ends with the given target string.
         *
         * |Name  |Type   |Desc                           |
         * |------|-------|-------------------------------|
         * |str   |string |The string to search           |
         * |suffix|string |String suffix                  |
         * |return|boolean|True if string ends with target|
         *
         * ```javascript
         * endWith('ab', 'b'); // -> true
         * ```
         */

        function exports(str, suffix)
        {
            var idx = str.length - suffix.length;

            return idx >= 0 && str.indexOf(suffix, idx) === idx;
        }

        return exports;
    })();

    /* ------------------------------ escape ------------------------------ */

    _.escape = (function ()
    {
        /* Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.
         *
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |str   |string|String to escape|
         * |return|string|Escaped string  |
         *
         * ```javascript
         * escape('You & Me'); -> // -> 'You &amp; Me'
         * ```
         */

        /* dependencies
         * keys 
         */

        function exports(str)
        {
            return regTest.test(str) ? str.replace(regReplace, replaceFn) : str;
        }

        var map = exports.map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#x27;',
            '`': '&#x60;'
        };

        var regSrc = '(?:' + keys(map).join('|') + ')',
            regTest = new RegExp(regSrc),
            regReplace = new RegExp(regSrc, 'g');

        function replaceFn(match)
        {
            return map[match];
        }

        return exports;
    })();

    /* ------------------------------ escapeJsonStr ------------------------------ */

    _.escapeJsonStr = (function ()
    {
        function exports(str)
        {
            return str.replace(/\\/g, '\\\\')
                      .replace(/"/g, '\\"')
                      .replace(/\f|\n|\r|\t/g, '');
        }

        return exports;
    })();

    /* ------------------------------ escapeRegExp ------------------------------ */

    _.escapeRegExp = (function ()
    {
        /* Escape special chars to be used as literals in RegExp constructors.
         *
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |str   |string|String to escape|
         * |return|string|Escaped string  |
         *
         * ```javascript
         * escapeRegExp('[eris]'); // -> '\\[eris\\]'
         * ```
         */

        function exports(str)
        {
            return str.replace(/\W/g, '\\$&');
        }

        return exports;
    })();

    /* ------------------------------ evalCss ------------------------------ */

    _.evalCss = (function ()
    {
        var mark = [];

        function exports(css)
        {
            for (var i = 0, len = mark.length; i < len; i++)
            {
                if (mark[i] === css) return;
            }
            mark.push(css);

            var container = exports.container || document.head,
                style = document.createElement('style');

            style.type = 'text/css';
            style.textContent = css;

            container.appendChild(style);
        }

        return exports;
    })();

    /* ------------------------------ fileSize ------------------------------ */

    _.fileSize = (function ()
    {
        /* Turn bytes into human readable file size.
         * 
         * |Name  |Type  |Desc              |
         * |------|------|------------------|
         * |bytes |number|File bytes        |
         * |return|string|Readable file size|
         * 
         * ```javascript
         * fileSize(5); // -> '5'
         * fileSize(1500); // -> '1.46K'
         * fileSize(1500000); // -> '1.43M'
         * fileSize(1500000000); // -> '1.4G'
         * fileSize(1500000000000); // -> '1.36T'
         * ```
         */

        function exports(bytes) 
        {
            if (bytes <= 0) return '0';

            var suffixIdx = Math.floor(Math.log(bytes) / Math.log(1024)),
                val = bytes / Math.pow(2, suffixIdx * 10);

            return +val.toFixed(2) + suffixList[suffixIdx];
        }

        var suffixList = ['', 'K', 'M', 'G', 'T'];

        return exports;
    })();

    /* ------------------------------ upperFirst ------------------------------ */

    var upperFirst = _.upperFirst = (function ()
    {
        /* Convert the first character of string to upper case.
         *
         * |Name  |Type  |Desc             |
         * |------|------|-----------------|
         * |str   |string|String to convert|
         * |return|string|Converted string |
         *
         * ```javascript
         * upperFirst('red'); // -> Red
         * ```
         */

        function exports(str)
        {
            if (str.length < 1) return str;

            return str[0].toUpperCase() + str.slice(1);
        }

        return exports;
    })();

    /* ------------------------------ getObjType ------------------------------ */

    _.getObjType = (function ()
    {
        /* dependencies
         * upperFirst 
         */

        function exports(obj)
        {
            if (obj.constructor && obj.constructor.name) return obj.constructor.name;

            return upperFirst(({}).toString.call(obj).replace(/(\[object )|]/g, ''));
        }

        return exports;
    })();

    /* ------------------------------ identity ------------------------------ */

    var identity = _.identity = (function ()
    {
        /* Return the first argument given.
         *
         * |Name  |Type|Desc       |
         * |------|----|-----------|
         * |val   |*   |Any value  |
         * |return|*   |Given value|
         *
         * ```javascript
         * identity('a'); // -> 'a'
         * ```
         */

        function exports(val)
        {
            return val;
        }

        return exports;
    })();

    /* ------------------------------ objToStr ------------------------------ */

    var objToStr = _.objToStr = (function ()
    {
        /* Alias of Object.prototype.toString.
         *
         * |Name  |Type  |Desc                                |
         * |------|------|------------------------------------|
         * |value |*     |Source value                        |
         * |return|string|String representation of given value|
         * 
         * ```javascript
         * objToStr(5); // -> '[object Number]'
         * ```
         */

        var ObjToStr = Object.prototype.toString;

        function exports(val)
        {
            return ObjToStr.call(val);
        }

        return exports;
    })();

    /* ------------------------------ isArgs ------------------------------ */

    var isArgs = _.isArgs = (function ()
    {
        /* Check if value is classified as an arguments object.
         *
         * |Name  |Type   |Desc                                |
         * |------|-------|------------------------------------|
         * |value |*      |Value to check                      |
         * |return|boolean|True if value is an arguments object|
         *
         * ```javascript
         * (function () {
         *     isArgs(arguments); // -> true
         * })();
         * ```
         */

        /* dependencies
         * objToStr 
         */

        function exports(val)
        {
            return objToStr(val) === '[object Arguments]';
        }

        return exports;
    })();

    /* ------------------------------ isArr ------------------------------ */

    var isArr = _.isArr = (function (exports)
    {
        /* Check if value is an `Array` object.
         *
         * |Name  |Type   |Desc                              |
         * |------|-------|----------------------------------|
         * |val   |*      |The value to check                |
         * |return|boolean|True if value is an `Array` object|
         *
         * ```javascript
         * isArr([]); // -> true
         * isArr({}); // -> false
         * ```
         */

        /* dependencies
         * objToStr 
         */

        exports = Array.isArray || function (val)
        {
            return objToStr(val) === '[object Array]';
        };

        return exports;
    })({});

    /* ------------------------------ castPath ------------------------------ */

    var castPath = _.castPath = (function ()
    {
        /* Cast value into a property path array.
         *
         * |Name  |Type  |Desc               |
         * |------|------|-------------------|
         * |str   |*     |Value to inspect   |
         * |[obj] |object|Object to query    |
         * |return|array |Property path array|
         * 
         * ```javascript
         * castPath('a.b.c'); // -> ['a', 'b', 'c']
         * castPath(['a']); // -> ['a']
         * castPath('a[0].b'); // -> ['a', '0', 'b']
         * castPath('a.b.c', {'a.b.c': true}); // -> ['a.b.c']
         * ```
         */

        /* dependencies
         * has isArr 
         */

        function exports(str, obj) 
        {
            if (isArr(str)) return str;
            if (obj && has(obj, str)) return [str];

            var ret = [];

            str.replace(regPropName, function(match, number, quote, str) 
            {
                ret.push(quote ? str.replace(regEscapeChar, '$1') : (number || match));
            });

            return ret;
        }

        // Lodash _stringToPath
        var regPropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
            regEscapeChar = /\\(\\)?/g;

        return exports;
    })();

    /* ------------------------------ safeGet ------------------------------ */

    var safeGet = _.safeGet = (function ()
    {
        /* Get object property, don't throw undefined error.
         *
         * |Name  |Type        |Desc                     |
         * |------|------------|-------------------------|
         * |obj   |object      |Object to query          |
         * |path  |array string|Path of property to get  |
         * |return|*           |Target value or undefined|
         *
         * ```javascript
         * var obj = {a: {aa: {aaa: 1}}};
         * safeGet(obj, 'a.aa.aaa'); // -> 1
         * safeGet(obj, ['a', 'aa']); // -> {aaa: 1}
         * safeGet(obj, 'a.b'); // -> undefined
         * ```
         */

        /* dependencies
         * isUndef castPath 
         */

        function exports(obj, path)
        {
            path = castPath(path, obj);

            var prop;

            /* eslint-disable no-cond-assign */
            while (prop = path.shift())
            {
                obj = obj[prop];
                if (isUndef(obj)) return;
            }

            return obj;
        }

        return exports;
    })();

    /* ------------------------------ isDate ------------------------------ */

    var isDate = _.isDate = (function ()
    {
        /* Check if value is classified as a Date object.
         *
         * |Name  |Type   |Desc                          |
         * |------|-------|------------------------------|
         * |val   |*      |value to check                |
         * |return|boolean|True if value is a Date object|
         *
         * ```javascript
         * isDate(new Date()); // -> true
         * ```
         */

        /* dependencies
         * objToStr 
         */

        function exports(val)
        {
            return objToStr(val) === '[object Date]';
        }

        return exports;
    })();

    /* ------------------------------ isFn ------------------------------ */

    var isFn = _.isFn = (function ()
    {
        /* Check if value is a function.
         *
         * |Name  |Type   |Desc                       |
         * |------|-------|---------------------------|
         * |val   |*      |Value to check             |
         * |return|boolean|True if value is a function|
         *
         * Generator function is also classified as true.
         *
         * ```javascript
         * isFn(function() {}); // -> true
         * isFn(function*() {}); // -> true
         * ```
         */

        /* dependencies
         * objToStr 
         */

        function exports(val)
        {
            var objStr = objToStr(val);

            return objStr === '[object Function]' || objStr === '[object GeneratorFunction]';
        }

        return exports;
    })();

    /* ------------------------------ isNum ------------------------------ */

    var isNum = _.isNum = (function ()
    {
        /* Checks if value is classified as a Number primitive or object.
         *
         * |Name  |Type   |Desc                                 |
         * |------|-------|-------------------------------------|
         * |value |*      |Value to check                       |
         * |return|boolean|True if value is correctly classified|
         * 
         * ```javascript
         * isNum(5); // -> true
         * isNum(5.1); // -> true
         * isNum({}); // -> false
         * ```
         */

        /* dependencies
         * objToStr 
         */

        function exports(val)
        {
            return objToStr(val) === '[object Number]';
        }

        return exports;
    })();

    /* ------------------------------ isArrLike ------------------------------ */

    var isArrLike = _.isArrLike = (function ()
    {
        /* Check if value is array-like.
         *
         * |Name  |Type   |Desc                       |
         * |------|-------|---------------------------|
         * |value |*      |Value to check             |
         * |return|boolean|True if value is array like|
         *
         * > Function returns false.
         *
         * ```javascript
         * isArrLike('test'); // -> true
         * isArrLike(document.body.children); // -> true;
         * isArrLike([1, 2, 3]); // -> true
         * ```
         */

        /* dependencies
         * isNum has isFn 
         */

        var MAX_ARR_IDX = Math.pow(2, 53) - 1;

        function exports(val)
        {
            if (!has(val, 'length')) return false;

            var len = val.length;

            return isNum(len) && len >= 0 && len <= MAX_ARR_IDX && !isFn(val);
        }

        return exports;
    })();

    /* ------------------------------ each ------------------------------ */

    var each = _.each = (function ()
    {
        /* Iterates over elements of collection and invokes iteratee for each element.
         *
         * |Name    |Type        |Desc                          |
         * |--------|------------|------------------------------|
         * |obj     |object array|Collection to iterate over    |
         * |iteratee|function    |Function invoked per iteration|
         * |[ctx]   |*           |Function context              |
         *
         * ```javascript
         * each({'a': 1, 'b': 2}, function (val, key) {});
         * ```
         */

        /* dependencies
         * isArrLike keys optimizeCb 
         */

        function exports(obj, iteratee, ctx)
        {
            iteratee = optimizeCb(iteratee, ctx);

            var i, len;

            if (isArrLike(obj))
            {
                for (i = 0, len = obj.length; i < len; i++) iteratee(obj[i], i, obj);
            } else
            {
                var _keys = keys(obj);
                for (i = 0, len = _keys.length; i < len; i++)
                {
                    iteratee(obj[_keys[i]], _keys[i], obj);
                }
            }

            return obj;
        }

        return exports;
    })();

    /* ------------------------------ createAssigner ------------------------------ */

    var createAssigner = _.createAssigner = (function ()
    {
        /* Used to create extend, extendOwn and defaults.
         *
         * |Name    |Type    |Desc                          |
         * |--------|--------|------------------------------|
         * |keysFn  |function|Function to get object keys   |
         * |defaults|boolean |No override when set to true  |
         * |return  |function|Result function, extend...    |
         */

        /* dependencies
         * isUndef each 
         */

        function exports(keysFn, defaults)
        {
            return function (obj)
            {
                each(arguments, function (src, idx)
                {
                    if (idx === 0) return;

                    var keys = keysFn(src);

                    each(keys, function (key)
                    {
                        if (!defaults || isUndef(obj[key])) obj[key] = src[key];
                    });
                });

                return obj;
            };
        }

        return exports;
    })();

    /* ------------------------------ defaults ------------------------------ */

    var defaults = _.defaults = (function (exports)
    {
        /* Fill in undefined properties in object with the first value present in the following list of defaults objects.
         *
         * |Name  |Type  |Desc              |
         * |------|------|------------------|
         * |obj   |object|Destination object|
         * |*src  |object|Sources objects   |
         * |return|object|Destination object|
         *
         * ```javascript
         * defaults({name: 'RedHood'}, {name: 'Unknown', age: 24}); // -> {name: 'RedHood', age: 24}
         * ```
         */

        /* dependencies
         * createAssigner allKeys 
         */

        exports = createAssigner(allKeys, true);

        return exports;
    })({});

    /* ------------------------------ cookie ------------------------------ */

    _.cookie = (function (exports)
    {
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
         *
         * ```javascript
         * cookie.set('a', '1', {path: '/'});
         * cookie.get('a'); // -> '1'
         * cookie.remove('a');
         * ```
         */

        /* dependencies
         * defaults isNum isUndef 
         */

        var defOpts = { path: '/' };

        function setCookie(key, val, options)
        {
            if (!isUndef(val))
            {
                options = options || {};
                options = defaults(options, defOpts);

                if (isNum(options.expires))
                {
                    var expires = new Date();
                    expires.setMilliseconds(expires.getMilliseconds() + options.expires * 864e+5);
                    options.expires = expires;
                }

                val = encodeURIComponent(val);
                key = encodeURIComponent(key);

                document.cookie = [
                    key, '=', val,
                    options.expires && '; expires=' + options.expires.toUTCString(),
                    options.path && '; path=' + options.path,
                    options.domain  && '; domain=' + options.domain,
                    options.secure ? '; secure' : ''
                ].join('');

                return exports;
            }

            var cookies = document.cookie ? document.cookie.split('; ') : [],
                result = key ? undefined : {};

            for (var i = 0, len = cookies.length; i < len; i++)
            {
                var c = cookies[i],
                    parts = c.split('='),
                    name = decodeURIComponent(parts.shift());

                c = parts.join('=');
                c = decodeURIComponent(c);

                if (key === name)
                {
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
            remove: function (key, options)
            {
                options = options || {};
                options.expires = -1;

                return setCookie(key, '', options);
            }
        };

        return exports;
    })({});

    /* ------------------------------ extend ------------------------------ */

    var extend = _.extend = (function (exports)
    {
        /* Copy all of the properties in the source objects over to the destination object.
         *
         * |Name  |Type  |Desc              |
         * |------|------|------------------|
         * |obj   |object|Destination object|
         * |...src|object|Sources objects   |
         * |return|object|Destination object|
         *
         * ```javascript
         * extend({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
         * ```
         */

        /* dependencies
         * createAssigner allKeys 
         */

        exports = createAssigner(allKeys);

        return exports;
    })({});

    /* ------------------------------ clone ------------------------------ */

    var clone = _.clone = (function ()
    {
        /* Create a shallow-copied clone of the provided plain object.
         *
         * Any nested objects or arrays will be copied by reference, not duplicated.
         *
         * |Name  |Type|Desc          |
         * |------|----|--------------|
         * |val   |*   |Value to clone|
         * |return|*   |Cloned value  |
         *
         * ```javascript
         * clone({name: 'eustia'}); // -> {name: 'eustia'}
         * ```
         */

        /* dependencies
         * isObj isArr extend 
         */

        function exports(obj)
        {
            if (!isObj(obj)) return obj;

            return isArr(obj) ? obj.slice() : extend({}, obj);
        }

        return exports;
    })();

    /* ------------------------------ extendOwn ------------------------------ */

    var extendOwn = _.extendOwn = (function (exports)
    {
        /* Like extend, but only copies own properties over to the destination object.
         *
         * |Name  |Type  |Desc              |
         * |------|------|------------------|
         * |obj   |object|Destination object|
         * |*src  |object|Sources objects   |
         * |return|object|Destination object|
         *
         * ```javascript
         * extendOwn({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
         * ```
         */

        /* dependencies
         * keys createAssigner 
         */

        exports = createAssigner(keys);

        return exports;
    })({});

    /* ------------------------------ values ------------------------------ */

    var values = _.values = (function ()
    {
        /* Create an array of the own enumerable property values of object.
         *
         * |Name  |Type  |Desc                    |
         * |------|------|------------------------|
         * |obj   |object|Object to query         |
         * |return|array |Array of property values|
         *
         * ```javascript
         * values({one: 1, two: 2}); // -> [1, 2]
         * ```
         */

        /* dependencies
         * each 
         */

        function exports(obj)
        {
            var ret = [];

            each(obj, function (val) { ret.push(val) });

            return ret;
        }

        return exports;
    })();

    /* ------------------------------ contain ------------------------------ */

    var contain = _.contain = (function ()
    {
        /* Check if the value is present in the list.
         *
         * |Name  |Type        |Desc                                |
         * |------|------------|------------------------------------|
         * |array |array object|Target list                         |
         * |value |*           |Value to check                      |
         * |return|boolean     |True if value is present in the list|
         *
         * ```javascript
         * contain([1, 2, 3], 1); // -> true
         * contain({a: 1, b: 2}, 1); // -> true
         * ```
         */

        /* dependencies
         * idxOf isArrLike values 
         */

        function exports(arr, val)
        {
            if (!isArrLike(arr)) arr = values(arr);

            return idxOf(arr, val) >= 0;
        }

        return exports;
    })();

    /* ------------------------------ isStr ------------------------------ */

    var isStr = _.isStr = (function ()
    {
        /* Check if value is a string primitive.
         *
         * |Name  |Type   |Desc                               |
         * |------|-------|-----------------------------------|
         * |val   |*      |Value to check                     |
         * |return|boolean|True if value is a string primitive|
         *
         * ```javascript
         * isStr('eris'); // -> true
         * ```
         */

        /* dependencies
         * objToStr 
         */

        function exports(val)
        {
            return objToStr(val) === '[object String]';
        }

        return exports;
    })();

    /* ------------------------------ isEmpty ------------------------------ */

    var isEmpty = _.isEmpty = (function ()
    {
        /* Check if value is an empty object or array.
         *
         * |Name  |Type   |Desc                  |
         * |------|-------|----------------------|
         * |val   |*      |Value to check        |
         * |return|boolean|True if value is empty|
         *
         * ```javascript
         * isEmpty([]); // -> true
         * isEmpty({}); // -> true
         * isEmpty(''); // -> true
         * ```
         */

        /* dependencies
         * isArrLike isArr isStr isArgs keys 
         */

        function exports(val)
        {
            if (val == null) return true;

            if (isArrLike(val) && (isArr(val) || isStr(val) || isArgs(val)))
            {
                return val.length === 0;
            }

            return keys(val).length === 0;
        }

        return exports;
    })();

    /* ------------------------------ isBool ------------------------------ */

    _.isBool = (function ()
    {
        /* Check if value is a boolean primitive.
         *
         * |Name  |Type   |Desc                      |
         * |------|-------|--------------------------|
         * |val   |*      |Value to check            |
         * |return|boolean|True if value is a boolean|
         *
         * ```javascript
         * isBool(true); // -> true
         * isBool(false); // -> true
         * isBool(1); // -> false
         * ```
         */

        function exports(val)
        {
            return val === true || val === false;
        }

        return exports;
    })();

    /* ------------------------------ isCrossOrig ------------------------------ */

    _.isCrossOrig = (function ()
    {
        /* dependencies
         * startWith 
         */

        var origin = window.location.origin;

        function exports(url)
        {
            return !startWith(url, origin);
        }

        return exports;
    })();

    /* ------------------------------ isEl ------------------------------ */

    _.isEl = (function ()
    {
        /* Check if value is a DOM element.
         *
         * |Name  |Type   |Desc                          |
         * |------|-------|------------------------------|
         * |val   |*      |Value to check                |
         * |return|boolean|True if value is a DOM element|
         *
         * ```javascript
         * isEl(document.body); // -> true
         * ```
         */

        function exports(val)
        {
            return !!(val && val.nodeType === 1);
        }

        return exports;
    })();

    /* ------------------------------ isErr ------------------------------ */

    _.isErr = (function ()
    {
        /* Check if value is an error.
         *
         * |Name  |Type   |Desc                     |
         * |------|-------|-------------------------|
         * |val   |*      |Value to check           |
         * |return|boolean|True if value is an error|
         *
         * ```javascript
         * isErr(new Error()); // -> true
         * ```
         */

        /* dependencies
         * objToStr 
         */

        function exports(val)
        {
            return objToStr(val) === '[object Error]';
        }

        return exports;
    })();

    /* ------------------------------ isErudaEl ------------------------------ */

    _.isErudaEl = (function ()
    {
        function exports(el)
        {
            var parentNode = el.parentNode;

            if (!parentNode) return false;

            while (parentNode)
            {
                parentNode = parentNode.parentNode;
                if (parentNode && parentNode.id === 'eruda') return true;
            }

            return false;
        }

        return exports;
    })();

    /* ------------------------------ isMatch ------------------------------ */

    var isMatch = _.isMatch = (function ()
    {
        /* Check if keys and values in src are contained in obj.
         *
         * |Name  |Type   |Desc                              |
         * |------|-------|----------------------------------|
         * |obj   |object |Object to inspect                 |
         * |src   |object |Object of property values to match|
         * |return|boolean|True if object is match           |
         *
         * ```javascript
         * isMatch({a: 1, b: 2}, {a: 1}); // -> true
         * ```
         */

        /* dependencies
         * keys 
         */

        function exports(obj, src)
        {
            var _keys = keys(src),
                len = _keys.length;

            if (obj == null) return !len;

            obj = Object(obj);

            for (var i = 0; i < len; i++)
            {
                var key = _keys[i];
                if (src[key] !== obj[key] || !(key in obj)) return false;
            }

            return true;
        }

        return exports;
    })();

    /* ------------------------------ memoize ------------------------------ */

    var memoize = _.memoize = (function ()
    {
        /* Memoize a given function by caching the computed result.
         *
         * |Name    |Type    |Desc                                |
         * |--------|--------|------------------------------------|
         * |fn      |function|Function to have its output memoized|
         * |[hashFn]|function|Function to create cache key        |
         * |return  |function|New memoized function               |
         *
         * ```javascript
         * var fibonacci = memoize(function(n)
         * {
         *     return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
         * });
         * ```
         */

        /* dependencies
         * has 
         */

        function exports(fn, hashFn)
        {
            var memoize = function (key)
            {
                var cache = memoize.cache,
                    address = '' + (hashFn ? hashFn.apply(this, arguments) : key);

                if (!has(cache, address)) cache[address] = fn.apply(this, arguments);

                return cache[address];
            };

            memoize.cache = {};

            return memoize;
        }

        return exports;
    })();

    /* ------------------------------ isMobile ------------------------------ */

    _.isMobile = (function (exports)
    {
        /* Check whether client is using a mobile browser using ua.
         *
         * |Name                    |Type   |Desc                                 |
         * |------------------------|-------|-------------------------------------|
         * |[ua=navigator.userAgent]|string |User agent                           |
         * |return                  |boolean|True if ua belongs to mobile browsers|
         *
         * ```javascript
         * isMobile(navigator.userAgent);
         * ```
         */

        /* dependencies
         * isBrowser memoize 
         */

        var regMobileAll = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
            regMobileFour = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i;

        exports = memoize(function (ua)
        {
            ua = ua || (isBrowser ? navigator.userAgent : '');

            return regMobileAll.test(ua) || regMobileFour.test(ua.substr(0, 4));
        });

        return exports;
    })({});

    /* ------------------------------ isNull ------------------------------ */

    _.isNull = (function ()
    {
        /* Check if value is an Null.
         *
         * |Name  |Type   |Desc                   |
         * |------|-------|-----------------------|
         * |value |*      |Value to check         |
         * |return|boolean|True if value is an Null|
         *
         * ```javascript
         * isNull(null); // -> true
         * ```
         */

        function exports(val)
        {
            return val === null;
        }

        return exports;
    })();

    /* ------------------------------ isRegExp ------------------------------ */

    _.isRegExp = (function ()
    {
        /* Check if value is a regular expression.
         *
         * |Name  |Type   |Desc                                 |
         * |------|-------|-------------------------------------|
         * |val   |*      |Value to check                       |
         * |return|boolean|True if value is a regular expression|
         *
         * ```javascript
         * isRegExp(/a/); // -> true
         * ```
         */

        /* dependencies
         * objToStr 
         */

        function exports(val)
        {
            return objToStr(val) === '[object RegExp]';
        }

        return exports;
    })();

    /* ------------------------------ loadJs ------------------------------ */

    _.loadJs = (function ()
    {
        /* Inject script tag into page with given src value.
         *
         * |Name|Type    |Desc           |
         * |----|--------|---------------|
         * |src |string  |Script source  |
         * |cb  |function|Onload callback|
         *
         * ```javascript
         * loadJs('main.js', function ()
         * {
         *     // Do something...
         * });
         * ```
         */

        function exports(src, cb)
        {
            var script = document.createElement('script');
            script.src = src;
            script.onload = function ()
            {
                var isNotLoaded = script.readyState &&
                    script.readyState != 'complete' &&
                    script.readyState != 'loaded';

                cb && cb(!isNotLoaded);
            };
            document.body.appendChild(script);
        }

        return exports;
    })();

    /* ------------------------------ repeat ------------------------------ */

    var repeat = _.repeat = (function (exports)
    {
        /* Repeat string n-times.
         *
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |str   |string|String to repeat|
         * |n     |number|Repeat times    |
         * |return|string|Repeated string |
         *
         * ```javascript
         * repeat('a', 3); // -> 'aaa'
         * repeat('ab', 2); // -> 'abab'
         * repeat('*', 0); // -> ''
         * ```
         */

        exports = function (str, n)
        {
            var ret = '';

            if (n < 1) return '';

            while (n > 0)
            {
                if (n & 1) ret += str;
                n >>= 1;
                str += str;
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ lpad ------------------------------ */

    var lpad = _.lpad = (function ()
    {
        /* Pad string on the left side if it's shorter than length.
         *
         * |Name   |Type  |Desc                  |
         * |-------|------|----------------------|
         * |str    |string|String to pad         |
         * |len    |number|Padding length        |
         * |[chars]|string|String used as padding|
         * |return |string|Resulted string       |
         *
         * ```javascript
         * lpad('a', 5); // -> '    a'
         * lpad('a', 5, '-'); // -> '----a'
         * lpad('abc', 3, '-'); // -> 'abc'
         * lpad('abc', 5, 'ab'); // -> 'ababc'
         * ```
         */

        /* dependencies
         * repeat toStr 
         */

        function exports(str, len, chars)
        {
            str = toStr(str);

            var strLen = str.length;

            chars = chars || ' ';

            if (strLen < len) str = (repeat(chars, len - strLen) + str).slice(-len);

            return str;
        }

        return exports;
    })();

    /* ------------------------------ dateFormat ------------------------------ */

    _.dateFormat = (function ()
    {
        /* Simple but extremely useful date format function.
         *
         * |Name           |Type   |Desc                 |
         * |---------------|-------|---------------------|
         * |[date=new Date]|Date   |Date object to format|
         * |mask           |string |Format mask          |
         * |[utc=false]    |boolean|UTC or not           |
         * |[gmt=false]    |boolean|GMT or not           |
         *
         * |Mask|Description                                                      |
         * |----|-----------------------------------------------------------------|
         * |d   |Day of the month as digits; no leading zero for single-digit days|
         * |dd  |Day of the month as digits; leading zero for single-digit days   |
         * |ddd |Day of the week as a three-letter abbreviation                   |
         * |dddd|Day of the week as its full name                                 |
         * |m   |Month as digits; no leading zero for single-digit months         |
         * |mm  |Month as digits; leading zero for single-digit months            |
         * |mmm |Month as a three-letter abbreviation                             |
         * |mmmm|Month as its full name                                           |
         * |yy  |Year as last two digits; leading zero for years less than 10     |
         * |yyyy|Year represented by four digits                                  |
         * |h   |Hours; no leading zero for single-digit hours (12-hour clock)    |
         * |hh  |Hours; leading zero for single-digit hours (12-hour clock)       |
         * |H   |Hours; no leading zero for single-digit hours (24-hour clock)    |
         * |HH  |Hours; leading zero for single-digit hours (24-hour clock)       |
         * |M   |Minutes; no leading zero for single-digit minutes                |
         * |MM  |Minutes; leading zero for single-digit minutes                   |
         * |s   |Seconds; no leading zero for single-digit seconds                |
         * |ss  |Seconds; leading zero for single-digit seconds                   |
         * |l L |Milliseconds. l gives 3 digits. L gives 2 digits                 |
         * |t   |Lowercase, single-character time marker string: a or p           |
         * |tt  |Lowercase, two-character time marker string: am or pm            |
         * |T   |Uppercase, single-character time marker string: A or P           |
         * |TT  |Uppercase, two-character time marker string: AM or PM            |
         * |Z   |US timezone abbreviation, e.g. EST or MDT                        |
         * |o   |GMT/UTC timezone offset, e.g. -0500 or +0230                     |
         * |S   |The date's ordinal suffix (st, nd, rd, or th)                    |
         * |UTC:|Must be the first four characters of the mask                    |
         *
         * ```javascript
         * dateFormat('isoDate'); // -> 2016-11-19
         * dateFormat('yyyy-mm-dd HH:MM:ss'); // -> 2016-11-19 19:00:04
         * dateFormat(new Date(), 'yyyy-mm-dd'); // -> 2016-11-19
         * ```
         */

        /* dependencies
         * isStr isDate toStr lpad 
         */

        function exports(date, mask, utc, gmt)
        {
            if (arguments.length === 1 &&
                isStr(date) &&
                !regNum.test(date))
            {
                mask = date;
                date = undefined;
            }

            date = date || new Date;

            if (!isDate(date)) date = new Date(date);

            mask = toStr(exports.masks[mask] || mask || exports.masks['default']);

            var maskSlice = mask.slice(0, 4);

            if (maskSlice === 'UTC:' || maskSlice === 'GMT:')
            {
                mask = mask.slice(4);
                utc = true;
                if (maskSlice === 'GMT:') gmt = true;
            }

            var prefix = utc ? 'getUTC' : 'get',
                d = date[prefix + 'Date'](),
                D = date[prefix + 'Day'](),
                m = date[prefix + 'Month'](),
                y = date[prefix + 'FullYear'](),
                H = date[prefix + 'Hours'](),
                M = date[prefix + 'Minutes'](),
                s = date[prefix + 'Seconds'](),
                L = date[prefix + 'Milliseconds'](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d: d,
                    dd: padZero(d),
                    ddd: exports.i18n.dayNames[D],
                    dddd: exports.i18n.dayNames[D + 7],
                    m: m + 1,
                    mm: padZero(m + 1),
                    mmm: exports.i18n.monthNames[m],
                    mmmm: exports.i18n.monthNames[m + 12],
                    yy: toStr(y).slice(2),
                    yyyy: y,
                    h: H % 12 || 12,
                    hh: padZero(H % 12 || 12),
                    H: H,
                    HH: padZero(H),
                    M: M,
                    MM: padZero(M),
                    s: s,
                    ss: padZero(s),
                    l: padZero(L, 3),
                    L: padZero(Math.round(L / 10)),
                    t: H < 12 ? 'a'  : 'p',
                    tt: H < 12 ? 'am' : 'pm',
                    T: H < 12 ? 'A'  : 'P',
                    TT: H < 12 ? 'AM' : 'PM',
                    Z: gmt ? 'GMT' : utc ? 'UTC' : (toStr(date).match(regTimezone) || ['']).pop().replace(regTimezoneClip, ''),
                    o: (o > 0 ? '-' : '+') + padZero(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

            return mask.replace(regToken, function (match)
            {
                if (match in flags) return flags[match];

                return match.slice(1, match.length - 1);
            });
        }

        function padZero(str, len)
        {
            return lpad(toStr(str), len || 2, '0');
        }

        var regToken = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g,
            regTimezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            regNum = /\d/,
            regTimezoneClip = /[^-+\dA-Z]/g;

        exports.masks = {
            'default': 'ddd mmm dd yyyy HH:MM:ss',
            'shortDate': 'm/d/yy',
            'mediumDate': 'mmm d, yyyy',
            'longDate': 'mmmm d, yyyy',
            'fullDate': 'dddd, mmmm d, yyyy',
            'shortTime': 'h:MM TT',
            'mediumTime': 'h:MM:ss TT',
            'longTime': 'h:MM:ss TT Z',
            'isoDate': 'yyyy-mm-dd',
            'isoTime': 'HH:MM:ss',
            'isoDateTime': 'yyyy-mm-dd\'T\'HH:MM:sso',
            'isoUtcDateTime': 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
            'expiresHeaderFormat': 'ddd, dd mmm yyyy HH:MM:ss Z'
        };

        exports.i18n = {
            dayNames: [
                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
                'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
            ],
            monthNames: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
            ]
        };

        return exports;
    })();

    /* ------------------------------ ltrim ------------------------------ */

    var ltrim = _.ltrim = (function ()
    {
        /* Remove chars or white-spaces from beginning of string.
         *
         * |Name  |Type        |Desc              |
         * |------|------------|------------------|
         * |str   |string      |String to trim    |
         * |chars |string array|Characters to trim|
         * |return|string      |Trimmed string    |
         *
         * ```javascript
         * ltrim(' abc  '); // -> 'abc  '
         * ltrim('_abc_', '_'); // -> 'abc_'
         * ltrim('_abc_', ['a', '_']); // -> 'bc_'
         * ```
         */

        var regSpace = /^\s+/;

        function exports(str, chars)
        {
            if (chars == null) return str.replace(regSpace, '');

            var start = 0,
                len = str.length,
                charLen = chars.length,
                found = true,
                i, c;

            while (found && start < len)
            {
                found = false;
                i = -1;
                c = str.charAt(start);

                while (++i < charLen)
                {
                    if (c === chars[i])
                    {
                        found = true;
                        start++;
                        break;
                    }
                }
            }

            return start >= len ? '' : str.substr(start, len);
        }

        return exports;
    })();

    /* ------------------------------ matcher ------------------------------ */

    var matcher = _.matcher = (function ()
    {
        /* Return a predicate function that checks if attrs are contained in an object.
         *
         * |Name  |Type    |Desc                              |
         * |------|--------|----------------------------------|
         * |attrs |object  |Object of property values to match|
         * |return|function|New predicate function            |
         *
         * ```javascript
         * var objects = [
         *     {a: 1, b: 2, c: 3 },
         *     {a: 4, b: 5, c: 6 }
         * ];
         * filter(objects, matcher({a: 4, c: 6 })); // -> [{a: 4, b: 5, c: 6 }]
         * ```
         */

        /* dependencies
         * extendOwn isMatch 
         */

        function exports(attrs)
        {
            attrs = extendOwn({}, attrs);

            return function (obj)
            {
                return isMatch(obj, attrs);
            };
        }

        return exports;
    })();

    /* ------------------------------ safeCb ------------------------------ */

    var safeCb = _.safeCb = (function (exports)
    {
        /* Create callback based on input value.
         */

        /* dependencies
         * isFn isObj optimizeCb matcher identity 
         */

        exports = function (val, ctx, argCount)
        {
            if (val == null) return identity;

            if (isFn(val)) return optimizeCb(val, ctx, argCount);

            if (isObj(val)) return matcher(val);

            return function (key)
            {
                return function (obj)
                {
                    return obj == null ? undefined : obj[key];
                }
            };
        };

        return exports;
    })({});

    /* ------------------------------ filter ------------------------------ */

    var filter = _.filter = (function ()
    {
        /* Iterates over elements of collection, returning an array of all the values that pass a truth test.
         *
         * |Name     |Type    |Desc                                   |
         * |---------|--------|---------------------------------------|
         * |obj      |array   |Collection to iterate over             |
         * |predicate|function|Function invoked per iteration         |
         * |[ctx]    |*       |Predicate context                      |
         * |return   |array   |Array of all values that pass predicate|
         *
         * ```javascript
         * filter([1, 2, 3, 4, 5], function (val)
         * {
         *     return val % 2 === 0;
         * }); // -> [2, 4]
         * ```
         */

        /* dependencies
         * safeCb each 
         */

        function exports(obj, predicate, ctx)
        {
            var ret = [];

            predicate = safeCb(predicate, ctx);

            each(obj, function (val, idx, list)
            {
                if (predicate(val, idx, list)) ret.push(val);
            });

            return ret;
        }

        return exports;
    })();

    /* ------------------------------ map ------------------------------ */

    var map = _.map = (function ()
    {
        /* Create an array of values by running each element in collection through iteratee.
         *
         * |Name    |Type        |Desc                          |
         * |--------|------------|------------------------------|
         * |obj     |array object|Collection to iterate over    |
         * |iteratee|function    |Function invoked per iteration|
         * |[ctx]   |*           |Function context              |
         * |return  |array       |New mapped array              |
         *
         * ```javascript
         * map([4, 8], function (n) { return n * n; }); // -> [16, 64]
         * ```
         */

        /* dependencies
         * safeCb keys isArrLike 
         */

        function exports(obj, iteratee, ctx)
        {
            iteratee = safeCb(iteratee, ctx);

            var _keys = !isArrLike(obj) && keys(obj),
                len = (_keys || obj).length,
                results = Array(len);

            for (var i = 0; i < len; i++)
            {
                var curKey = _keys ? _keys[i] : i;
                results[i] = iteratee(obj[curKey], curKey, obj);
            }

            return results;
        }

        return exports;
    })();

    /* ------------------------------ toArr ------------------------------ */

    var toArr = _.toArr = (function ()
    {
        /* Convert value to an array.
         *
         * |Name  |Type |Desc            |
         * |------|-----|----------------|
         * |val   |*    |Value to convert|
         * |return|array|Converted array |
         *
         * ```javascript
         * toArr({a: 1, b: 2}); // -> [{a: 1, b: 2}]
         * toArr('abc'); // -> ['abc']
         * toArr(1); // -> [1]
         * toArr(null); // -> []
         * ```
         */

        /* dependencies
         * isArrLike map isArr isStr 
         */

        function exports(val)
        {
            if (!val) return [];

            if (isArr(val)) return val;

            if (isArrLike(val) && !isStr(val)) return map(val);

            return [val];
        }

        return exports;
    })();

    /* ------------------------------ Class ------------------------------ */

    var Class = _.Class = (function ()
    {
        /* Create JavaScript class.
         *
         * |Name     |Type    |Desc                             |
         * |---------|--------|---------------------------------|
         * |methods  |object  |Public methods                   |
         * |[statics]|object  |Static methods                   |
         * |return   |function|Function used to create instances|
         *
         * ```javascript
         * var People = Class({
         *     initialize: function People(name, age)
         *     {
         *         this.name = name;
         *         this.age = age;
         *     },
         *     introduce: function ()
         *     {
         *         return 'I am ' + this.name + ', ' + this.age + ' years old.';
         *     }
         * });
         *
         * var Student = People.extend({
         *     initialize: function Student(name, age, school)
         *     {
         *         this.callSuper(People, 'initialize', arguments);
         *
         *         this.school = school;
         *     },
         *     introduce: function ()
         *     {
         *         return this.callSuper(People, 'introduce') + '\n I study at ' + this.school + '.';
         *     }
         * }, {
         *     is: function (obj)
         *     {
         *         return obj instanceof Student;
         *     }
         * });
         *
         * var a = new Student('allen', 17, 'Hogwarts');
         * a.introduce(); // -> 'I am allen, 17 years old. \n I study at Hogwarts.'
         * Student.is(a); // -> true
         * ```
         */

        /* dependencies
         * extend toArr inherits has safeGet 
         */

        function exports(methods, statics)
        {
            return Base.extend(methods, statics);
        }

        function makeClass(parent, methods, statics)
        {
            statics = statics || {};
            var className = methods.className || safeGet(methods, 'initialize.name') || '';
            delete methods.className;

            var ctor = new Function('toArr', 'return function ' + className + '()' + 
            '{' +
                'var args = toArr(arguments);' +
                'return this.initialize ? this.initialize.apply(this, args) || this : this;' +
            '};')(toArr);

            inherits(ctor, parent);
            ctor.prototype.constructor = ctor;

            ctor.extend = function (methods, statics)
            {
                return makeClass(ctor, methods, statics);
            };
            ctor.inherits = function (Class)
            {
                inherits(ctor, Class);
            };
            ctor.methods = function (methods)
            {
                extend(ctor.prototype, methods);
                return ctor;
            };
            ctor.statics = function (statics)
            {
                extend(ctor, statics);
                return ctor;
            };

            ctor.methods(methods).statics(statics);

            return ctor;
        }

        var Base = exports.Base = makeClass(Object, {
            className: 'Base',
            callSuper: function (parent, name, args)
            {
                var superMethod = parent.prototype[name];

                return superMethod.apply(this, args);
            },
            toString: function ()
            {
                return this.constructor.name;
            }
        });

        return exports;
    })();

    /* ------------------------------ Enum ------------------------------ */

    var Enum = _.Enum = (function (exports)
    {
        /* Enum type implementation.
         *
         * ### constructor
         *
         * |Name|Type |Desc            |
         * |----|-----|----------------|
         * |arr |array|Array of strings|
         *
         * |Name|Type  |Desc                  |
         * |----|------|----------------------|
         * |obj |object|Pairs of key and value|
         *
         * ```javascript
         * var importance = new Enum([
         *     'NONE', 'TRIVIAL', 'REGULAR', 'IMPORTANT', 'CRITICAL'
         * ]);
         *
         * if (val === importance.CRITICAL)
         * {
         *     // Do something.
         * }
         * ```
         */

        /* dependencies
         * Class freeze isArr each keys 
         */

        exports = Class({
            initialize: function Enum(map)
            {
                if (isArr(map))
                {
                    this.size = map.length;
                    each(map, function (member, val)
                    {
                        this[member] = val;
                    }, this);
                } else
                {
                    this.size = keys(map).length;
                    each(map, function (val, member)
                    {
                        this[member] = val;
                    }, this);
                }

                freeze(this);
            }
        });

        return exports;
    })({});

    /* ------------------------------ Select ------------------------------ */

    var Select = _.Select = (function (exports)
    {
        /* Simple wrapper of querySelectorAll to make dom selection easier.
         *
         * ### constructor
         *
         * |Name    |Type  |Desc               |
         * |--------|------|-------------------|
         * |selector|string|Dom selector string|
         *
         * ### find
         *
         * Get desdendants of current matched elements.
         *
         * |Name    |Type  |Desc               |
         * |--------|------|-------------------|
         * |selector|string|Dom selector string|
         *
         * ### each
         *
         * Iterate over matched elements.
         *
         * |Name|Type    |Desc                                |
         * |----|--------|------------------------------------|
         * |fn  |function|Function to execute for each element|
         *
         * ```javascript
         * var $test = new Select('#test');
         * $test.find('.test').each(function (idx, element)
         * {
         *     // Manipulate dom nodes
         * });
         * ```
         */

        /* dependencies
         * Class isStr each 
         */

        exports = Class({
            className: 'Select',
            initialize: function (selector)
            {
                this.length = 0;

                if (!selector) return this;

                if (isStr(selector)) return rootSelect.find(selector);

                if (selector.nodeType)
                {
                    this[0] = selector;
                    this.length = 1;
                }
            },
            find: function (selector)
            {
                var ret = new Select;

                this.each(function ()
                {
                    mergeArr(ret, this.querySelectorAll(selector));
                });

                return ret;
            },
            each: function (fn)
            {
                each(this, function (element, idx)
                {
                    fn.call(element, idx, element);
                });

                return this;
            }
        });

        var rootSelect = new exports(document);

        function mergeArr(first, second)
        {
            var len = second.length,
                i = first.length;

            for (var j = 0; j < len; j++) first[i++] = second[j];

            first.length = i;

            return first;
        }

        return exports;
    })({});

    /* ------------------------------ $safeEls ------------------------------ */

    var $safeEls = _.$safeEls = (function ()
    {
        /* Convert value into an array, if it's a string, do querySelector.
         *
         * |Name  |Type                |Desc             |
         * |------|--------------------|-----------------|
         * |value |element array string|Value to convert |
         * |return|array               |Array of elements|
         *
         * ```javascript
         * $safeEls('.test'); // -> Array of elements with test class
         * ```
         */

        /* dependencies
         * isStr toArr Select 
         */

        function exports(val)
        {
            return toArr(isStr(val) ? new Select(val) : val);
        }

        return exports;
    })();

    /* ------------------------------ $attr ------------------------------ */

    var $attr = _.$attr = (function ()
    {
        /* Element attribute manipulation.
         *
         * Get the value of an attribute for the first element in the set of matched elements.
         *
         * |Name   |Type                |Desc                            |
         * |-------|--------------------|--------------------------------|
         * |element|string array element|Elements to manipulate          |
         * |name   |string              |Attribute name                  |
         * |return |string              |Attribute value of first element|
         *
         * Set one or more attributes for the set of matched elements.
         *
         * |Name   |Type                |Desc                  |
         * |-------|--------------------|----------------------|
         * |element|string array element|Elements to manipulate|
         * |name   |string              |Attribute name        |
         * |value  |string              |Attribute value       |
         *
         * |Name      |Type                |Desc                                  |
         * |----------|--------------------|--------------------------------------|
         * |element   |string array element|Elements to manipulate                |
         * |attributes|object              |Object of attribute-value pairs to set|
         *
         * ### remove
         *
         * Remove an attribute from each element in the set of matched elements.
         *
         * |Name   |Type                |Desc                  |
         * |-------|--------------------|----------------------|
         * |element|string array element|Elements to manipulate|
         * |name   |string              |Attribute name        |
         *
         * ```javascript
         * $attr('#test', 'attr1', 'test');
         * $attr('#test', 'attr1'); // -> test
         * $attr.remove('#test', 'attr1');
         * $attr('#test', {
         *     'attr1': 'test',
         *     'attr2': 'test'
         * });
         * ```
         */

        /* dependencies
         * toArr isObj isStr each isUndef $safeEls 
         */

        function exports(els, name, val)
        {
            els = $safeEls(els);

            var isGetter = isUndef(val) && isStr(name);
            if (isGetter) return getAttr(els[0], name);

            var attrs = name;
            if (!isObj(attrs))
            {
                attrs = {};
                attrs[name] = val;
            }

            setAttr(els, attrs);
        }

        exports.remove = function (els, names)
        {
            els = $safeEls(els);
            names = toArr(names);

            each(els, function (node)
            {
                each(names, function (name)
                {
                    node.removeAttribute(name);
                });
            });
        };

        function getAttr(el, name)
        {
            return el.getAttribute(name);
        }

        function setAttr(els, attrs)
        {
            each(els, function (el)
            {
                each(attrs, function (val, name)
                {
                    el.setAttribute(name, val);
                });
            })
        }

        return exports;
    })();

    /* ------------------------------ $data ------------------------------ */

    var $data = _.$data = (function ()
    {
        /* Wrapper of $attr, adds data- prefix to keys.
         *
         * ```javascript
         * $data('#test', 'attr1', 'eustia');
         * ```
         */

        /* dependencies
         * $attr isStr isObj each 
         */

        function exports(nodes, name, val)
        {
            var dataName = name;

            if (isStr(name)) dataName = 'data-' + name;
            if (isObj(name))
            {
                dataName = {};
                each(name, function (val, key)
                {
                    dataName['data-' + key] = val;
                });
            }

            return $attr(nodes, dataName, val);
        }

        return exports;
    })();

    /* ------------------------------ $css ------------------------------ */

    var $css = _.$css = (function ()
    {
        /* Element css manipulation.
         *
         * Get the computed style properties for the first element in the set of matched elements.
         *
         * |Name   |Type                |Desc                      |
         * |-------|--------------------|--------------------------|
         * |element|string array element|Elements to manipulate    |
         * |name   |string              |Property name             |
         * |return |string              |Css value of first element|
         *
         * Set one or more CSS properties for the set of matched elements.
         *
         * |Name   |Type                |Desc                  |
         * |-------|--------------------|----------------------|
         * |element|string array element|Elements to manipulate|
         * |name   |string              |Property name         |
         * |value  |string              |Css value             |
         *
         * |Name      |Type                |Desc                            |
         * |----------|--------------------|--------------------------------|
         * |element   |string array element|Elements to manipulate          |
         * |properties|object              |Object of css-value pairs to set|
         *
         * ```javascript
         * $css('#test', {
         *     'color': '#fff',
         *     'background': 'black'
         * });
         * $css('#test', 'display', 'block');
         * $css('#test', 'color'); // -> #fff
         * ```
         */

        /* dependencies
         * isStr isObj camelCase kebabCase isUndef contain isNum $safeEls startWith 
         */

        function exports(nodes, name, val)
        {
            nodes = $safeEls(nodes);

            var isGetter = isUndef(val) && isStr(name);
            if (isGetter) return getCss(nodes[0], name);

            var css = name;
            if (!isObj(css))
            {
                css = {};
                css[name] = val;
            }

            setCss(nodes, css);
        }

        function getCss(node, name)
        {
            return node.style[camelCase(name)] || getComputedStyle(node, '').getPropertyValue(name);
        }

        function setCss(nodes, css)
        {
            each(nodes, function (node)
            {
                var cssText = ';';
                each(css, function (val, key)
                {
                    key = dasherize(key);
                    cssText += key + ':' + addPx(key, val) + ';';
                });
                node.style.cssText += cssText;
            });
        }

        var cssNumProps = [
            'column-count',
            'columns',
            'font-weight',
            'line-weight',
            'opacity',
            'z-index',
            'zoom'
        ];

        function addPx(key, val)
        {
            var needPx = isNum(val) && !contain(cssNumProps, kebabCase(key));

            return needPx ? val + 'px' : val;
        }

        function dasherize(str) 
        {
            // -webkit- -o- 
            if (startWith(str, '-')) return str;

            return kebabCase(str);
        }

        return exports;
    })();

    /* ------------------------------ $insert ------------------------------ */

    var $insert = _.$insert = (function (exports)
    {
        /* Insert html on different position.
         *
         * ### before
         *
         * Insert content before elements.
         *
         * ### after
         *
         * Insert content after elements.
         *
         * ### prepend
         *
         * Insert content to the beginning of elements.
         *
         * ### append
         *
         * Insert content to the end of elements.
         *
         * |Name   |Type                |Desc                  |
         * |-------|--------------------|----------------------|
         * |element|string array element|Elements to manipulate|
         * |content|string              |Html strings          |
         *
         * ```javascript
         * // <div id="test"><div class="mark"></div></div>
         * $insert.before('#test', '<div>eris</div>');
         * // -> <div>eris</div><div id="test"><div class="mark"></div></div>
         * $insert.after('#test', '<div>eris</div>');
         * // -> <div id="test"><div class="mark"></div></div><div>eris</div>
         * $insert.prepend('#test', '<div>eris</div>');
         * // -> <div id="test"><div>eris</div><div class="mark"></div></div>
         * $insert.append('#test', '<div>eris</div>');
         * // -> <div id="test"><div class="mark"></div><div>eris</div></div>
         * ```
         */

        /* dependencies
         * each $safeEls 
         */

        exports = {
            before: insertFactory('beforebegin'),
            after: insertFactory('afterend'),
            append: insertFactory('beforeend'),
            prepend: insertFactory('afterbegin')
        };

        function insertFactory(type)
        {
            return function (nodes, val)
            {
                nodes = $safeEls(nodes);

                each(nodes, function (node)
                {
                    node.insertAdjacentHTML(type, val);
                });
            };
        }

        return exports;
    })({});

    /* ------------------------------ $offset ------------------------------ */

    var $offset = _.$offset = (function ()
    {
        /* Get the position of the element in document.
         *
         * |Name   |Type                |Desc                  |
         * |-------|--------------------|----------------------|
         * |element|string array element|Elements to get offset|
         *
         * ```javascript
         * $offset('#test'); // -> {left: 0, top: 0, width: 0, height: 0}
         * ```
         */

        /* dependencies
         * $safeEls 
         */

        function exports(els)
        {
            els = $safeEls(els);

            var el = els[0];

            var clientRect = el.getBoundingClientRect();

            return {
                left: clientRect.left + window.pageXOffset,
                top: clientRect.top + window.pageYOffset,
                width: Math.round(clientRect.width),
                height: Math.round(clientRect.height)
            };
        }

        return exports;
    })();

    /* ------------------------------ $property ------------------------------ */

    var $property = _.$property = (function (exports)
    {
        /* Element property html, text, val getter and setter.
         *
         * ### html
         *
         * Get the HTML contents of the first element in the set of matched elements or
         * set the HTML contents of every matched element.
         *
         * ### text
         *
         * Get the combined text contents of each element in the set of matched
         * elements, including their descendants, or set the text contents of the
         * matched elements.
         *
         * ### val
         *
         * Get the current value of the first element in the set of matched elements or
         * set the value of every matched element.
         *
         * ```javascript
         * $property.html('#test', 'eris');
         * $property.html('#test'); // -> eris
         * ```
         */

        /* dependencies
         * isUndef each $safeEls 
         */

        exports = {
            html: propFactory('innerHTML'),
            text: propFactory('textContent'),
            val: propFactory('value')
        };

        function propFactory(name)
        {
            return function (nodes, val)
            {
                nodes = $safeEls(nodes);

                if (isUndef(val)) return nodes[0][name];

                each(nodes, function (node)
                {
                    node[name] = val;
                });
            };
        }

        return exports;
    })({});

    /* ------------------------------ $remove ------------------------------ */

    var $remove = _.$remove = (function ()
    {
        /* Remove the set of matched elements from the DOM.
         *
         * |Name   |Type                |Desc              |
         * |-------|--------------------|------------------|
         * |element|string array element|Elements to delete|
         *
         * ```javascript
         * $remove('#test');
         * ```
         */

        /* dependencies
         * each $safeEls 
         */

        function exports(els)
        {
            els = $safeEls(els);

            each(els, function (el)
            {
                var parent = el.parentNode;

                if (parent) parent.removeChild(el);
            });
        }

        return exports;
    })();

    /* ------------------------------ $show ------------------------------ */

    var $show = _.$show = (function ()
    {
        /* Show elements.
         *
         * |Name   |Type                |Desc            |
         * |-------|--------------------|----------------|
         * |element|string array element|Elements to show|
         *
         * ```javascript
         * $show('#test');
         * ```
         */

        /* dependencies
         * each $safeEls 
         */

        function exports(els)
        {
            els = $safeEls(els);

            each(els, function (el)
            {
                if (isHidden(el))
                {
                    el.style.display = getDefDisplay(el.nodeName);
                }
            });
        }

        function isHidden(el)
        {
            return getComputedStyle(el, '').getPropertyValue('display') == 'none';
        }

        var elDisplay = {};

        function getDefDisplay(elName)
        {
            var el, display;

            if (!elDisplay[elName])
            {
                el = document.createElement(elName);
                document.documentElement.appendChild(el);
                display = getComputedStyle(el, '').getPropertyValue('display');
                el.parentNode.removeChild(el);
                display == 'none' && (display = 'block');
                elDisplay[elName] = display;
            }

            return elDisplay[elName];
        }

        return exports;
    })();

    /* ------------------------------ delegate ------------------------------ */

    var delegate = _.delegate = (function (exports)
    {
        /* Event delegation.
         *
         * ### add
         *
         * Add event delegation.
         *
         * |Name    |Type    |Desc          |
         * |--------|--------|--------------|
         * |el      |element |Parent element|
         * |type    |string  |Event type    |
         * |selector|string  |Match selector|
         * |cb      |function|Event callback|
         *
         * ### remove
         *
         * Remove event delegation.
         *
         * ```javascript
         * var container = document.getElementById('container');
         * function clickHandler()
         * {
         *     // Do something...
         * }
         * delegate.add(container, 'click', '.children', clickHandler);
         * delegate.remove(container, 'click', '.children', clickHandler);
         * ```
         */

        /* dependencies
         * Class contain 
         */

        function retTrue()  { return true }
        function retFalse() { return false }

        function trigger(e)
        {
            var handlers = this.events[e.type],
                handler,
                handlerQueue = formatHandlers.call(this, e, handlers);

            e = new exports.Event(e);

            var i = 0, j, matched, ret;

            while ((matched = handlerQueue[i++]) && !e.isPropagationStopped())
            {
                e.curTarget = matched.el;
                j = 0;
                while ((handler = matched.handlers[j++]) && !e.isImmediatePropagationStopped())
                {
                    ret = handler.handler.apply(matched.el, [e]);

                    if (ret === false)
                    {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }
        }

        function formatHandlers(e, handlers)
        {
            var current = e.target,
                ret = [],
                delegateCount = handlers.delegateCount,
                selector, matches, handler, i;

            if (current.nodeType)
            {
                for (; current !== this; current = current.parentNode || this)
                {
                    matches = [];
                    for (i = 0; i < delegateCount; i++)
                    {
                        handler = handlers[i];
                        selector = handler.selector + ' ';
                        if (matches[selector] === undefined)
                        {
                            matches[selector] = contain(this.querySelectorAll(selector), current);
                        }
                        if (matches[selector]) matches.push(handler);
                    }
                    if (matches.length) ret.push({ el: current, handlers: matches});
                }
            }

            if (delegateCount < handlers.length)
            {
                ret.push({
                    el: this,
                    handlers: handlers.slice(delegateCount)
                });
            }

            return ret;
        }

        exports = {
            add: function (el, type, selector, fn)
            {
                var handler = {
                        selector: selector,
                        handler: fn
                    },
                    handlers;

                if (!el.events) el.events = {};

                if (!(handlers = el.events[type]))
                {
                    handlers = el.events[type] = [];
                    handlers.delegateCount = 0;
                    el.addEventListener(type, function (e)
                    {
                        trigger.apply(el, arguments);
                    }, false);
                }

                selector ? handlers.splice(handlers.delegateCount++, 0, handler)
                         : handlers.push(handler);
            },
            remove: function (el, type, selector, fn)
            {
                var events = el.events;

                if (!events || !events[type]) return;

                var handlers = events[type],
                    i = handlers.length,
                    handler;

                while (i--)
                {
                    handler = handlers[i];

                    if ((!selector || handler.selector == selector) && handler.handler == fn)
                    {
                        handlers.splice(i, 1);
                        if (handler.selector)
                        {
                            handlers.delegateCount--;
                        }
                    }
                }
            },
            Event: Class({
                className: 'Event',
                initialize: function Event(e) { this.origEvent = e },
                isDefaultPrevented: retFalse,
                isPropagationStopped: retFalse,
                isImmediatePropagationStopped: retFalse,
                preventDefault: function ()
                {
                    var e = this.origEvent;

                    this.isDefaultPrevented = retTrue;
                    if (e && e.preventDefault) e.preventDefault();
                },
                stopPropagation: function ()
                {
                    var e = this.origEvent;

                    this.isPropagationStopped = retTrue;
                    if (e && e.stopPropagation) e.stopPropagation();
                },
                stopImmediatePropagation: function ()
                {
                    var e = this.origEvent;

                    this.isImmediatePropagationStopped = retTrue;
                    if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
                    this.stopPropagation();
                }
            })
        };

        return exports;
    })({});

    /* ------------------------------ $event ------------------------------ */

    var $event = _.$event = (function (exports)
    {
        /* bind events to certain dom elements.
         *
         * ```javascript
         * function clickHandler()
         * {
         *     // Do something...
         * }
         * $event.on('#test', 'click', clickHandler);
         * $event.off('#test', 'click', clickHandler);
         * ```
         */

        /* dependencies
         * delegate isUndef $safeEls 
         */

        exports = {
            on: eventFactory('add'),
            off: eventFactory('remove')
        };

        function eventFactory(type)
        {
            return function (nodes, event, selector, handler)
            {
                nodes = $safeEls(nodes);

                if (isUndef(handler))
                {
                    handler = selector;
                    selector = undefined;
                }

                each(nodes, function (node)
                {
                    delegate[type](node, event, selector, handler);
                });
            };
        }

        return exports;
    })({});

    /* ------------------------------ some ------------------------------ */

    var some = _.some = (function ()
    {
        /* Check if predicate return truthy for any element.
         *
         * |Name     |Type        |Desc                                          |
         * |---------|------------|----------------------------------------------|
         * |obj      |array object|Collection to iterate over                    |
         * |predicate|function    |Function to invoked per iteration             |
         * |ctx      |*           |Predicate context                             |
         * |return   |boolean     |True if any element passes the predicate check|
         *
         * ```javascript
         * some([2, 5], function (val)
         * {
         *     return val % 2 === 0;
         * }); // -> true
         * ```
         */

        /* dependencies
         * safeCb isArrLike keys 
         */

        function exports(obj, predicate, ctx)
        {
            predicate = safeCb(predicate, ctx);

            var _keys = !isArrLike(obj) && keys(obj),
                len   = (_keys || obj).length;

            for (var i = 0; i < len; i++)
            {
                var key = _keys ? _keys[i] : i;
                if (predicate(obj[key], key, obj)) return true;
            }

            return false;
        }

        return exports;
    })();

    /* ------------------------------ $class ------------------------------ */

    var $class = _.$class = (function (exports)
    {
        /* Element class manipulations.
         *
         * ### add
         *
         * Add the specified class(es) to each element in the set of matched elements.
         *
         * |Name   |Type                |Desc                  |
         * |-------|--------------------|----------------------|
         * |element|string array element|Elements to manipulate|
         * |names  |string array        |Classes to add        |
         *
         * ### has
         *
         * Determine whether any of the matched elements are assigned the given class.
         *
         * |Name   |Type                |Desc                                 |
         * |-------|--------------------|-------------------------------------|
         * |element|string array element|Elements to manipulate               |
         * |name   |string              |Class name                           |
         * |return |boolean             |True if elements has given class name|
         *
         * ### toggle
         *
         * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.
         *
         * |Name   |Type                |Desc                  |
         * |-------|--------------------|----------------------|
         * |element|string array element|Elements to manipulate|
         * |name   |string              |Class name to toggle  |
         *
         * ### remove
         *
         * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
         *
         * |Name   |Type                |Desc                  |
         * |-------|--------------------|----------------------|
         * |element|string array element|Elements to manipulate|
         * |names  |string              |Class names to remove |
         *
         * ```javascript
         * $class.add('#test', 'class1');
         * $class.add('#test', ['class1', 'class2']);
         * $class.has('#test', 'class1'); // -> true
         * $class.remove('#test', 'class1');
         * $class.has('#test', 'class1'); // -> false
         * $class.toggle('#test', 'class1');
         * $class.has('#test', 'class1'); // -> true
         * ```
         */

        /* dependencies
         * toArr some $safeEls isStr 
         */

        exports = {
            add: function (els, name)
            {
                els = $safeEls(els);
                var names = safeName(name);

                each(els, function (el)
                {
                    var classList = [];

                    each(names, function (name)
                    {
                        if (!exports.has(el, name)) classList.push(name);
                    });

                    if (classList.length !== 0) el.className += ' ' + classList.join(' ');
                });
            },
            has: function (els, name)
            {
                els = $safeEls(els);

                var regName = new RegExp('(^|\\s)' + name + '(\\s|$)');

                return some(els, function (el)
                {
                    return regName.test(el.className);
                });
            },
            toggle: function (els, name)
            {
                els = $safeEls(els);

                each(els, function (el)
                {
                    if (!exports.has(el, name)) return exports.add(el, name);

                    exports.remove(el, name);
                });
            },
            remove: function (els, name)
            {
                els = $safeEls(els);
                var names = safeName(name);

                each(els, function (el)
                {
                    each(names, function (name)
                    {
                        el.classList.remove(name);
                    });
                });
            }
        };

        function safeName(name)
        {
            return isStr(name) ? name.split(/\s+/) : toArr(name);
        }

        return exports;
    })({});

    /* ------------------------------ $ ------------------------------ */

    _.$ = (function ()
    {
        /* jQuery like style dom manipulator.
         *
         * ### Available methods
         *
         * offset, hide, show, first, last, get, eq, on, off, html, text, val, css, attr,
         * data, rmAttr, remove, addClass, rmClass, toggleClass, hasClass, append, prepend,
         * before, after
         *
         * ```javascript
         * var $btn = $('#btn');
         * $btn.html('eustia');
         * $btn.addClass('btn');
         * $btn.show();
         * $btn.on('click', function ()
         * {
         *     // Do something...
         * });
         * ```
         */

        /* dependencies
         * Select $offset $show $css $attr $property last $remove $data $event $class $insert isUndef isStr 
         */

        function exports(selector)
        {
            return new Select(selector);
        }

        Select.methods({
            offset: function ()
            {
                return $offset(this);
            },
            hide: function ()
            {
                return this.css('display', 'none');
            },
            show: function ()
            {
                $show(this);

                return this;
            },
            first: function ()
            {
                return exports(this[0]);
            },
            last: function () {
                return exports(last(this));
            },
            get: function (idx)
            {
                return this[idx];
            },
            eq: function (idx)
            {
                return exports(this[idx]);
            },
            on: function (event, selector, handler)
            {
                $event.on(this, event, selector, handler);

                return this;
            },
            off: function (event, selector, handler)
            {
                $event.off(this, event, selector, handler);

                return this;
            },
            html: function (val)
            {
                var result = $property.html(this, val);

                if (isUndef(val)) return result;

                return this;
            },
            text: function (val)
            {
                var result = $property.text(this, val);

                if (isUndef(val)) return result;

                return this;
            },
            val: function (val)
            {
                var result = $property.val(this, val);

                if (isUndef(val)) return result;

                return this;
            },
            css: function (name, val)
            {
                var result = $css(this, name, val);

                if (isGetter(name, val)) return result;

                return this;
            },
            attr: function (name, val)
            {
                var result = $attr(this, name, val);

                if (isGetter(name, val)) return result;

                return this;
            },
            data: function (name, val)
            {
                var result = $data(this, name, val);

                if (isGetter(name, val)) return result;

                return this;
            },
            rmAttr: function (name)
            {
                $attr.remove(this, name);

                return this;
            },
            remove: function ()
            {
                $remove(this);

                return this;
            },
            addClass: function (name)
            {
                $class.add(this, name);

                return this;
            },
            rmClass: function (name)
            {
                $class.remove(this, name);

                return this;
            },
            toggleClass: function (name)
            {
                $class.toggle(this, name);

                return this;
            },
            hasClass: function (name)
            {
                return $class.has(this, name);
            },
            parent: function ()
            {
                return exports(this[0].parentNode);
            },
            append: function (val)
            {
                $insert.append(this, val);

                return this;
            },
            prepend: function (val)
            {
                $insert.prepend(this, val);

                return this;
            },
            before: function (val)
            {
                $insert.before(this, val);

                return this;
            },
            after: function (val)
            {
                $insert.after(this, val);

                return this;
            }
        });

        function isGetter(name, val)
        {
            return isUndef(val) && isStr(name);
        }

        return exports;
    })();

    /* ------------------------------ memStorage ------------------------------ */

    var memStorage = _.memStorage = (function (exports)
    {
        /* Memory-backed implementation of the Web Storage API.
         *
         * A replacement for environments where localStorage or sessionStorage is not available.
         *
         * ```javascript
         * var localStorage = window.localStorage || memStorage;
         * localStorage.setItem('test', 'eris');
         * ```
         */

        /* dependencies
         * keys 
         */

        exports = {
            getItem: function (key)
            {
                return (API_KEYS[key] ? cloak[key] : this[key]) || null;
            },
            setItem: function (key, val)
            {
                API_KEYS[key] ? cloak[key] = val : this[key] = val;
            },
            removeItem: function (key)
            {
                API_KEYS[key] ? delete cloak[key] : delete this[key];
            },
            key: function (i)
            {
                var keys = enumerableKeys();

                return i >= 0 && i < keys.length ? keys[i] : null;
            },
            clear: function ()
            {
                var keys = uncloakedKeys();

                /* eslint-disable no-cond-assign */
                for (var i = 0, key; key = keys[i]; i++) delete this[key];

                keys = cloakedKeys();

                /* eslint-disable no-cond-assign */
                for (i = 0; key = keys[i]; i++) delete cloak[key];
            }
        };

        Object.defineProperty(exports, 'length', {
            enumerable: false,
            configurable: true,
            get: function ()
            {
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

        function enumerableKeys()
        {
            return uncloakedKeys().concat(cloakedKeys());
        }

        function uncloakedKeys()
        {
            return keys(exports).filter(function (key)
            {
                return !API_KEYS[key];
            });
        }

        function cloakedKeys()
        {
            return keys(cloak);
        }

        return exports;
    })({});

    /* ------------------------------ now ------------------------------ */

    _.now = (function (exports)
    {
        /* Gets the number of milliseconds that have elapsed since the Unix epoch.
         *
         * ```javascript
         * now(); // -> 1468826678701
         * ```
         */

        exports = Date.now || function ()
        {
            return new Date().getTime();
        };

        return exports;
    })({});

    /* ------------------------------ restArgs ------------------------------ */

    var restArgs = _.restArgs = (function ()
    {
        /* This accumulates the arguments passed into an array, after a given index.
         *
         * |Name      |Type    |Desc                                   |
         * |----------|--------|---------------------------------------|
         * |function  |function|Function that needs rest parameters    |
         * |startIndex|number  |The start index to accumulates         |
         * |return    |function|Generated function with rest parameters|
         *
         * ```javascript
         * var paramArr = _.restArgs(function (rest) { return rest });
         * paramArr(1, 2, 3, 4); // -> [1, 2, 3, 4]
         * ```
         */

        function exports(fn, startIdx)
        {
            startIdx = startIdx == null ? fn.length - 1 : +startIdx;

            return function ()
            {
                var len = Math.max(arguments.length - startIdx, 0),
                    rest = new Array(len),
                    i;

                for (i = 0; i < len; i++) rest[i] = arguments[i + startIdx];

                // Call runs faster than apply.
                switch (startIdx)
                {
                    case 0: return fn.call(this, rest);
                    case 1: return fn.call(this, arguments[0], rest);
                    case 2: return fn.call(this, arguments[0], arguments[1], rest);
                }

                var args = new Array(startIdx + 1);

                for (i = 0; i < startIdx; i++) args[i] = arguments[i];

                args[startIdx] = rest;

                return fn.apply(this, args);
            };
        }

        return exports;
    })();

    /* ------------------------------ partial ------------------------------ */

    var partial = _.partial = (function (exports)
    {
        /* Partially apply a function by filling in given arguments.
         *
         * |Name       |Type    |Desc                                    |
         * |-----------|--------|----------------------------------------|
         * |fn         |function|Function to partially apply arguments to|
         * |...partials|*       |Arguments to be partially applied       |
         * |return     |function|New partially applied function          |
         *
         * ```javascript
         * var sub5 = partial(function (a, b) { return b - a }, 5);
         * sub(20); // -> 15
         * ```
         */

        /* dependencies
         * restArgs toArr 
         */

        exports = restArgs(function (fn, partials)
        {
            return function ()
            {
                var args = [];

                args = args.concat(partials);
                args = args.concat(toArr(arguments));

                return fn.apply(this, args);
            };
        });

        return exports;
    })({});

    /* ------------------------------ once ------------------------------ */

    var once = _.once = (function (exports)
    {
        /* Create a function that invokes once.
         *
         * |Name  |Type    |Desc                   |
         * |------|--------|-----------------------|
         * |fn    |function|Function to restrict   |
         * |return|function|New restricted function|
         *
         * ```javascript
         * function init() {};
         * var initOnce = once(init);
         * initOnce();
         * initOnce(); // -> init is invoked once
         * ```
         */

        /* dependencies
         * partial before 
         */

        exports = partial(before, 2);

        return exports;
    })({});

    /* ------------------------------ Emitter ------------------------------ */

    var Emitter = _.Emitter = (function (exports)
    {
        /* Event emitter class which provides observer pattern.
         *
         * ### on
         *
         * Bind event.
         *
         * ### off
         *
         * Unbind event.
         *
         * ### once
         *
         * Bind event that trigger once.
         *
         * |Name    |Type    |Desc          |
         * |--------|--------|--------------|
         * |event   |string  |Event name    |
         * |listener|function|Event listener|
         *
         * ### emit
         *
         * Emit event.
         *
         * |Name   |Type  |Desc                        |
         * |-------|------|----------------------------|
         * |event  |string|Event name                  |
         * |...args|*     |Arguments passed to listener|
         *
         * ### mixin
         *
         * [static] Mixin object class methods.
         *
         * |Name|Type  |Desc           |
         * |----|------|---------------|
         * |obj |object|Object to mixin|
         *
         * ```javascript
         * var event = new Emitter();
         * event.on('test', function () { console.log('test') });
         * event.emit('test'); // Logs out 'test'.
         * Emitter.mixin({});
         * ```
         */

        /* dependencies
         * Class has each slice once 
         */

        exports = Class({
            initialize: function Emitter()
            {
                this._events = this._events || {};
            },
            on: function (event, listener)
            {
                this._events[event] = this._events[event] || [];
                this._events[event].push(listener);

                return this;
            },
            off: function (event, listener)
            {
                if (!has(this._events, event)) return;

                this._events[event].splice(this._events[event].indexOf(listener), 1);

                return this;
            },
            once: function (event, listener)
            {
                this.on(event, once(listener));

                return this;
            },
            emit: function (event)
            {
                if (!has(this._events, event)) return;

                var args = slice(arguments, 1);

                each(this._events[event], function (val)
                {
                    val.apply(this, args);
                }, this);

                return this;
            }
        }, {
            mixin: function (obj)
            {
                each(['on', 'off', 'once', 'emit'], function (val)
                {
                    obj[val] = exports.prototype[val];
                });

                obj._events = obj._events || {};
            }
        });

        return exports;
    })({});

    /* ------------------------------ Logger ------------------------------ */

    _.Logger = (function (exports)
    {
        /* Simple logger with level filter.
         *
         * ### constructor
         * 
         * |Name         |Type  |Desc        |
         * |-------------|------|------------|
         * |name         |string|Logger name |
         * |[level=DEBUG]|number|Logger level|
         * 
         * ### setLevel
         * 
         * |Name |Type         |Desc        |
         * |-----|-------------|------------|
         * |level|number string|Logger level|
         * 
         * ### getLevel
         * 
         * Get current level.
         * 
         * ### trace, debug, info, warn, error
         * 
         * Logging methods.
         * 
         * ### Log Levels
         * 
         * TRACE, DEBUG, INFO, WARN, ERROR and SILENT.
         * 
         * ```javascript
         * var logger = new Logger('eris', logger.level.ERROR);
         * logger.trace('test');
         * 
         * // Format output.
         * logger.formatter = function (type, argList)
         * {
         *     argList.push(new Date().getTime());
         * 
         *     return argList;
         * };
         * 
         * logger.on('all', function (type, argList) 
         * {
         *     // It's not affected by log level.
         * });
         * 
         * logger.on('debug', function (argList) 
         * {
         *     // Affected by log level.
         * });
         * ```
         */

        /* dependencies
         * Emitter Enum toArr isUndef clone isStr isNum 
         */

        exports = Emitter.extend({
            initialize: function Logger(name, level) 
            {
                this.name = name;

                this.setLevel(isUndef(level) ? exports.level.DEBUG : level);
                this.callSuper(Emitter, 'initialize', arguments);
            },
            setLevel: function (level) 
            {
                if (isStr(level)) 
                {
                    level = exports.level[level.toUpperCase()];
                    if (level) this._level = level;
                    return this;
                }
                if (isNum(level)) this._level = level;

                return this;
            },
            getLevel: function () 
            {
                return this._level;
            },
            formatter: function (type, argList) 
            {
                return argList;
            },
            trace: function () 
            {
                return this._log('trace', arguments);
            },
            debug: function () 
            {
                return this._log('debug', arguments);
            },
            info: function ()
            {
                return this._log('info', arguments);
            },
            warn: function () 
            {
                return this._log('warn', arguments);
            },
            error: function ()
            {
                return this._log('error', arguments);
            },
            _log: function (type, argList) 
            {
                argList = toArr(argList);
                if (argList.length === 0) return this;

                this.emit('all', type, clone(argList));

                if (exports.level[type.toUpperCase()] < this._level) return this;
                this.emit(type, clone(argList));
                /* eslint-disable no-console */
                var consoleMethod = type === 'debug' ? console.log : console[type];
                consoleMethod.apply(console, this.formatter(type, argList));

                return this;
            }
        }, {
            level: new Enum({
                TRACE: 0,
                DEBUG: 1,
                INFO: 2,
                WARN: 3,
                ERROR: 4,
                SILENT: 5
            })
        });

        return exports;
    })({});

    /* ------------------------------ orientation ------------------------------ */

    _.orientation = (function (exports)
    {
        /* Screen orientation helper.
         *
         * ### on
         *
         * Bind change event.
         *  
         * ### off 
         * 
         * Unbind change event.
         * 
         * ### get
         * 
         * Get current orientation(landscape or portrait).
         * 
         * ```javascript
         * orientation.on('change', function (direction) 
         * {
         *     console.log(direction); // -> 'portrait'
         * });
         * orientation.get(); // -> 'landscape'
         * ```
         */

        /* dependencies
         * Emitter safeGet 
         */

        var screen = window.screen;

        exports = {
            get: function () 
            {
                if (screen) 
                {
                    var orientation = safeGet(screen, 'orientation.type');
                    if (orientation) return orientation.split('-').shift();
                } 

                return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'; 
            }
        };

        Emitter.mixin(exports);

        window.addEventListener('orientationchange', function () 
        {
            setTimeout(function () 
            {
                exports.emit('change', exports.get());
            }, 200);
        }, false);

        return exports;
    })({});

    /* ------------------------------ toNum ------------------------------ */

    var toNum = _.toNum = (function (exports)
    {
        /* Convert value to a number.
         *
         * |Name  |Type  |Desc            |
         * |------|------|----------------|
         * |val   |*     |Value to process|
         * |return|number|Resulted number |
         *
         * ```javascript
         * toNum('5'); // -> 5
         * ```
         */

        /* dependencies
         * isNum isObj isFn isStr 
         */

        exports = function (val)
        {
            if (isNum(val)) return val;

            if (isObj(val))
            {
                var temp = isFn(val.valueOf) ? val.valueOf() : val;
                val = isObj(temp) ? (temp + '') : temp;
            }

            if (!isStr(val)) return val === 0 ? val : +val;

            return +val;
        };

        return exports;
    })({});

    /* ------------------------------ pxToNum ------------------------------ */

    _.pxToNum = (function ()
    {
        /* dependencies
         * toNum 
         */

        function exports(str)
        {
            return toNum(str.replace('px', ''));
        }

        return exports;
    })();

    /* ------------------------------ toInt ------------------------------ */

    var toInt = _.toInt = (function ()
    {
        /* Convert value to an integer.
         *
         * |Name  |Type  |Desc             |
         * |------|------|-----------------|
         * |val   |*     |Value to convert |
         * |return|number|Converted integer|
         *
         * ```javascript
         * toInt(1.1); // -> 1
         * toInt(undefined); // -> 0
         * ```
         */

        /* dependencies
         * toNum 
         */

        function exports(val)
        {
            if (!val) return val === 0 ? val : 0;

            val = toNum(val);

            return val - val % 1;
        }

        return exports;
    })();

    /* ------------------------------ detectBrowser ------------------------------ */

    _.detectBrowser = (function ()
    {
        /* Detect browser info using ua.
         *
         * |Name                    |Type  |Desc                              |
         * |------------------------|------|----------------------------------|
         * |[ua=navigator.userAgent]|string|Browser userAgent                 |
         * |return                  |object|Object containing name and version|
         * 
         * Browsers supported: ie, chrome, edge, firefox, opera, safari, ios(mobile safari), android(android browser)
         *
         * ```javascript
         * var browser = detectBrowser();
         * if (browser.name === 'ie' && browser.version < 9) 
         * {
         *     // Do something about old IE...
         * }
         * ```
         */

        /* dependencies
         * isBrowser toInt keys 
         */

        function exports(ua) 
        {
            ua = ua || (isBrowser ? navigator.userAgent : '');
            ua = ua.toLowerCase();

            var ieVer = getVer(ua, 'msie ');

            if (ieVer) return {
                version: ieVer,
                name: 'ie'
            };

            if (regIe11.test(ua)) return {
                version: 11,
                name: 'ie'
            };

            for (var i = 0, len = browsers.length; i < len; i++) 
            {
                var name = browsers[i],
                    match = ua.match(regBrowsers[name]);

                if (match == null) continue;

                var version = toInt(match[1].split('.')[0]);

                if (name === 'opera') version = getVer(ua, 'version/') || version;

                return {
                    name: name,
                    version: version
                };
            }

            return {
                name: 'unknown',
                version: -1
            };
        }

        var regBrowsers = {
            'edge': /edge\/([0-9._]+)/,
            'firefox': /firefox\/([0-9.]+)(?:\s|$)/,
            'opera': /opera\/([0-9.]+)(?:\s|$)/,
            'android': /android\s([0-9.]+)/,
            'ios': /version\/([0-9._]+).*mobile.*safari.*/,
            'safari': /version\/([0-9._]+).*safari/,
            'chrome': /(?!chrom.*opr)chrom(?:e|ium)\/([0-9.]+)(:?\s|$)/
        };

        var regIe11 = /trident\/7\./,
            browsers = keys(regBrowsers);

        function getVer(ua, mark) 
        {
            var idx = ua.indexOf(mark);

            if (idx > -1) return toInt(ua.substring(idx + mark.length, ua.indexOf('.', idx)));
        }

        return exports;
    })();

    /* ------------------------------ rtrim ------------------------------ */

    var rtrim = _.rtrim = (function ()
    {
        /* Remove chars or white-spaces from end of string.
         *
         * |Name  |Type        |Desc              |
         * |------|------------|------------------|
         * |str   |string      |String to trim    |
         * |chars |string array|Characters to trim|
         * |return|string      |Trimmed string    |
         *
         * ```javascript
         * rtrim(' abc  '); // -> ' abc'
         * rtrim('_abc_', '_'); // -> '_abc'
         * rtrim('_abc_', ['c', '_']); // -> '_ab'
         * ```
         */

        var regSpace = /\s+$/;

        function exports(str, chars)
        {
            if (chars == null) return str.replace(regSpace, '');

            var end = str.length - 1,
                charLen = chars.length,
                found = true,
                i, c;

            while (found && end >= 0)
            {
                found = false;
                i = -1;
                c = str.charAt(end);

                while (++i < charLen)
                {
                    if (c === chars[i])
                    {
                        found = true;
                        end--;
                        break;
                    }
                }
            }

            return (end >= 0) ? str.substring(0, end + 1) : '';
        }

        return exports;
    })();

    /* ------------------------------ trim ------------------------------ */

    var trim = _.trim = (function ()
    {
        /* Remove chars or white-spaces from beginning end of string.
         *
         * |Name  |Type        |Desc              |
         * |------|------------|------------------|
         * |str   |string      |String to trim    |
         * |chars |string array|Characters to trim|
         * |return|string      |Trimmed string    |
         *
         * ```javascript
         * trim(' abc  '); // -> 'abc'
         * trim('_abc_', '_'); // -> 'abc'
         * trim('_abc_', ['a', 'c', '_']); // -> 'b'
         * ```
         */

        /* dependencies
         * ltrim rtrim 
         */

        var regSpace = /^\s+|\s+$/g;

        function exports(str, chars)
        {
            if (chars == null) return str.replace(regSpace, '');

            return ltrim(rtrim(str, chars), chars);
        }

        return exports;
    })();

    /* ------------------------------ getFileName ------------------------------ */

    _.getFileName = (function ()
    {
        /* dependencies
         * last trim 
         */

        function exports(url)
        {
            var ret = last(url.split('/'));

            if (ret.indexOf('?') > -1) ret = trim(ret.split('?')[0]);

            return ret === '' ? 'unknown' : ret;
        }

        return exports;
    })();

    /* ------------------------------ query ------------------------------ */

    var query = _.query = (function (exports)
    {
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
         *
         * ```javascript
         * query.parse('foo=bar&eruda=true'); // -> {foo: 'bar', eruda: 'true'}
         * query.stringify({foo: 'bar', eruda: 'true'}); // -> 'foo=bar&eruda=true'
         * query.parse('name=eruda&name=eustia'); // -> {name: ['eruda', 'eustia']}
         * ```
         */

        /* dependencies
         * trim each isUndef isArr map isEmpty filter isObj 
         */

        exports = {
            parse: function (str)
            {
                var ret = {};

                str = trim(str).replace(regIllegalChars, '');

                each(str.split('&'), function (param)
                {
                    var parts = param.split('=');

                    var key = parts.shift(),
                        val = parts.length > 0 ? parts.join('=') : null;

                    key = decodeURIComponent(key);
                    val = decodeURIComponent(val);

                    if (isUndef(ret[key]))
                    {
                        ret[key] = val;
                    } else if (isArr(ret[key]))
                    {
                        ret[key].push(val);
                    } else
                    {
                        ret[key] = [ret[key], val];
                    }
                });

                return ret;
            },
            stringify: function (obj, arrKey)
            {
                return filter(map(obj, function (val, key)
                {
                    if (isObj(val) && isEmpty(val)) return '';
                    if (isArr(val)) return exports.stringify(val, key);

                    return (arrKey ? encodeURIComponent(arrKey) : encodeURIComponent(key)) + '=' + encodeURIComponent(val);
                }), function (str)
                {
                    return str.length > 0;
                }).join('&');
            }
        };

        var regIllegalChars = /^(\?|#|&)/g;

        return exports;
    })({});

    /* ------------------------------ Url ------------------------------ */

    _.Url = (function (exports)
    {
        /* Simple url manipulator.
         *
         * ### constructor
         *
         * |Name                 |Type  |Desc      |
         * |---------------------|------|----------|
         * |[url=window.location]|string|Url string|
         *
         * ### setQuery
         *
         * Set query value.
         *
         * |Name  |Type  |Desc       |
         * |------|------|-----------|
         * |name  |string|Query name |
         * |value |string|Query value|
         * |return|Url   |this       |
         *
         * |Name  |Type  |Desc        |
         * |------|------|------------|
         * |names |object|query object|
         * |return|Url   |this        |
         *
         * ### rmQuery
         *
         * Remove query value.
         *
         * |Name  |Type        |Desc      |
         * |------|------------|----------|
         * |name  |string array|Query name|
         * |return|Url         |this      |
         *
         * ### parse
         *
         * [static] Parse url into an object.
         *
         * |Name  |Type  |Desc      |
         * |------|------|----------|
         * |url   |string|Url string|
         * |return|object|Url object|
         *
         * ### stringify
         *
         * [static] Stringify url object into a string.
         *
         * |Name  |Type  |Desc      |
         * |------|------|----------|
         * |url   |object|Url object|
         * |return|string|Url string|
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
         *
         * ```javascript
         * var url = new Url('http://example.com:8080?eruda=true');
         * console.log(url.port); // -> '8080'
         * url.query.foo = 'bar';
         * url.rmQuery('eruda');
         * utl.toString(); // -> 'http://example.com:8080/?foo=bar'
         * ```
         */

        /* dependencies
         * Class extend trim query isEmpty each isArr toArr 
         */

        exports = Class({
            className: 'Url',
            initialize: function (url)
            {
                extend(this, exports.parse(url || window.location.href));
            },
            setQuery: function (name, val)
            {
                var query = this.query;

                if (isObj(name))
                {
                    each(name, function (val, key)
                    {
                        query[key] = val;
                    });
                } else
                {
                    query[name] = val;
                }

                return this;
            },
            rmQuery: function (name)
            {
                var query = this.query;

                if (!isArr(name)) name = toArr(name);
                each(name, function (key)
                {
                    delete query[key];
                });

                return this;
            },
            toString: function ()
            {
                return exports.stringify(this);
            }
        }, {
            parse: function (url)
            {
                var ret = {
                        protocol: '',
                        auth: '',
                        hostname: '',
                        hash: '',
                        query: {},
                        port: '',
                        pathname: '',
                        slashes: false
                    },
                    rest = trim(url);

                var proto = rest.match(regProto);
                if (proto)
                {
                    proto = proto[0];
                    ret.protocol = proto.toLowerCase();
                    rest = rest.substr(proto.length);
                }

                if (proto)
                {
                    var slashes = rest.substr(0, 2) === '//';
                    if (slashes)
                    {
                        rest = rest.slice(2);
                        ret.slashes = true;
                    }
                }

                if (slashes)
                {
                    var hostEnd = -1;
                    for (var i = 0, len = hostEndingChars.length; i < len; i++)
                    {
                        var pos = rest.indexOf(hostEndingChars[i]);
                        if (pos !== -1 && (hostEnd === -1 || pos < hostEnd)) hostEnd = pos;
                    }

                    var host = rest.slice(0, hostEnd);
                    rest = rest.slice(hostEnd);

                    var atSign = host.lastIndexOf('@');

                    if (atSign !== -1)
                    {
                        ret.auth = decodeURIComponent(host.slice(0, atSign));
                        host = host.slice(atSign + 1);
                    }

                    ret.hostname = host;
                    var port = host.match(regPort);
                    if (port)
                    {
                        port = port[0];
                        if (port !== ':') ret.port = port.substr(1);
                        ret.hostname = host.substr(0, host.length - port.length);
                    }
                }

                var hash = rest.indexOf('#');

                if (hash !== -1)
                {
                    ret.hash = rest.substr(hash);
                    rest = rest.slice(0, hash);
                }

                var queryMark = rest.indexOf('?');

                if (queryMark !== -1)
                {
                    ret.query = query.parse(rest.substr(queryMark + 1));
                    rest = rest.slice(0, queryMark);
                }

                ret.pathname = rest || '/';

                return ret;
            },
            stringify: function (obj)
            {
                var ret = obj.protocol +
                          (obj.slashes ? '//' : '') +
                          (obj.auth ? encodeURIComponent(obj.auth) + '@' : '') +
                          obj.hostname +
                          (obj.port ? (':' + obj.port) : '') +
                          obj.pathname;

                if (!isEmpty(obj.query)) ret += '?' + query.stringify(obj.query);
                if (obj.hash) ret += obj.hash;

                return ret;
            }
        });

        var regProto = /^([a-z0-9.+-]+:)/i,
            regPort = /:[0-9]*$/,
            hostEndingChars = ['/', '?', '#'];

        return exports;
    })({});

    /* ------------------------------ ajax ------------------------------ */

    _.ajax = (function ()
    {
        /* Perform an asynchronous HTTP request.
         *
         * |Name   |Type  |Desc        |
         * |-------|------|------------|
         * |options|object|Ajax options|
         *
         * Available options:
         *
         * |Name         |Type         |Desc                    |
         * |-------------|-------------|------------------------|
         * |url          |string       |Request url             |
         * |data         |string object|Request data            |
         * |dataType=json|string       |Response type(json, xml)|
         * |success      |function     |Success callback        |
         * |error        |function     |Error callback          |
         * |complete     |function     |Callback after request  |
         * |timeout      |number       |Request timeout         |
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
         *
         * ```javascript
         * ajax({
         *     url: 'http://example.com',
         *     data: {test: 'true'},
         *     error: function () {},
         *     success: function (data)
         *     {
         *         // ...
         *     },
         *     dataType: 'json'
         * });
         *
         * ajax.get('http://example.com', {}, function (data)
         * {
         *     // ...
         * });
         * ```
         */

        /* dependencies
         * isFn noop defaults isObj query 
         */

        function exports(options)
        {
            defaults(options, exports.setting);

            var type = options.type,
                url = options.url,
                data = options.data,
                dataType = options.dataType,
                success = options.success,
                error = options.error,
                timeout = options.timeout,
                complete = options.complete,
                xhr = options.xhr(),
                abortTimeout;

            xhr.onreadystatechange = function ()
            {
                if (xhr.readyState !== 4) return;

                clearTimeout(abortTimeout);

                var result;

                var status = xhr.status;
                if ((status >= 200 && status < 300) || status === 304)
                {
                    result = xhr.responseText;
                    if (dataType === 'xml') result = xhr.responseXML;
                    try {
                        if (dataType === 'json') result = JSON.parse(result);
                    /* eslint-disable no-empty */
                    } catch (e) {}
                    success(result, xhr);
                } else
                {
                    error(xhr);
                }

                complete(xhr);
            };

            if (type === 'GET')
            {
                data = query.stringify(data);
                url += url.indexOf('?') > -1 ? '&' + data : '?' + data;
            } else
            {
                if(isObj(data)) data = query.stringify(data);
            }

            xhr.open(type, url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            if (timeout > 0) 
            {
                abortTimeout = setTimeout(function () 
                {
                    xhr.onreadystatechange = noop;
                    xhr.abort();
                    error(xhr, 'timeout');
                    complete(xhr);
                }, timeout);
            }
            xhr.send(type === 'GET' ? null : data);

            return xhr;
        }

        exports.setting = {
            type: 'GET',
            success: noop,
            error: noop,
            complete: noop,
            dataType: 'json',
            data: {},
            xhr: function () { return new XMLHttpRequest() },
            timeout: 0
        };

        exports.get = function ()
        {
            return exports(parseArgs.apply(null, arguments));
        };

        exports.post = function ()
        {
            var options = parseArgs.apply(null, arguments);
            options.type = 'POST';

            return exports(options);
        };

        function parseArgs(url, data, success, dataType)
        {
            if (isFn(data))
            {
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
    })();

    /* ------------------------------ safeStorage ------------------------------ */

    _.safeStorage = (function ()
    {
        /* dependencies
         * isUndef memStorage 
         */

        function exports(type, memReplacement)
        {
            if (isUndef(memReplacement)) memReplacement = true;

            var ret;

            switch (type)
            {
                case 'local': ret = window.localStorage; break;
                case 'session':  ret = window.sessionStorage; break;
            }

            try
            {
                // Safari private browsing
                var x = 'test-localStorage-' + Date.now();
                ret.setItem(x, x);
                var y = ret.getItem(x);
                ret.removeItem(x);
                if (y !== x) throw new Error();
            } catch (e)
            {
                if (memReplacement) return memStorage;
                return;
            }

            return ret;
        }

        return exports;
    })();

    /* ------------------------------ stripHtmlTag ------------------------------ */

    _.stripHtmlTag = (function ()
    {
        /* Strip html tags from a string.
         *
         * |Name  |Type  |Desc           |
         * |------|------|---------------|
         * |str   |string|String to strip|
         * |return|string|Resulted string|
         *
         * ```javascript
         * stripHtmlTag('<p>Hello</p>'); // -> 'Hello'
         * ```
         */

        var regHtmlTag = /<[^>]*>/g;

        function exports(str)
        {
            return str.replace(regHtmlTag, '');
        }

        return exports;
    })();

    /* ------------------------------ uniqId ------------------------------ */

    _.uniqId = (function ()
    {
        /* Generate a globally-unique id.
         *
         * |Name  |Type  |Desc              |
         * |------|------|------------------|
         * |prefix|string|Id prefix         |
         * |return|string|Globally-unique id|
         *
         * ```javascript
         * uniqId('eusita_'); // -> 'eustia_xxx'
         * ```
         */

        var idCounter = 0;

        function exports(prefix)
        {
            var id = ++idCounter + '';

            return prefix ? prefix + id : id;
        }

        return exports;
    })();

    /* ------------------------------ unique ------------------------------ */

    _.unique = (function ()
    {
        /* Create duplicate-free version of an array.
         *
         * |Name     |Type    |Desc                         |
         * |---------|--------|-----------------------------|
         * |arr      |array   |Array to inspect             |
         * |[compare]|function|Function for comparing values|
         * |return   |array   |New duplicate free array     |
         *
         * ```javascript
         * unique([1, 2, 3, 1]); // -> [1, 2, 3]
         * ```
         */

        /* dependencies
         * filter 
         */

        function exports(arr, compare)
        {
            compare = compare || isEqual;

            return filter(arr, function (item, idx, arr)
            {
                var len = arr.length;

                while (++idx < len)
                {
                    if (compare(item, arr[idx])) return false;
                }

                return true;
            });
        }

        function isEqual(a, b)
        {
            return a === b;
        }

        return exports;
    })();

    /* ------------------------------ wrap ------------------------------ */

    _.wrap = (function ()
    {
        /* Wrap the function inside a wrapper function, passing it as the first argument.
         *
         * |Name   |Type    |Desc            |
         * |-------|--------|----------------|
         * |fn     |*       |Function to wrap|
         * |wrapper|function|Wrapper function|
         * |return |function|New function    |
         *
         * ```javascript
         * var p = wrap(escape, function(fn, text)
         * {
         *     return '<p>' + fn(text) + '</p>';
         * });
         * p('You & Me'); // -> '<p>You &amp; Me</p>'
         * ```
         */

        /* dependencies
         * partial 
         */

        function exports(fn, wrapper)
        {
            return partial(wrapper, fn);
        }

        return exports;
    })();

    return _;
})();