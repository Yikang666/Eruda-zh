// Built by eustia.
(function(root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define([], factory);
    } else if (typeof module === 'object' && module.exports)
    {
        module.exports = factory();
    } else { root._ = factory(); }
}(this, function ()
{
    var _ = {};

    if (typeof window === 'object' && window._) _ = window._;

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

    /* ------------------------------ mkdir ------------------------------ */

    _.mkdir = (function ()
    {
        /* Recursively create directories.
         *
         * |Name       |Type    |Desc               |
         * |-----------|--------|-------------------|
         * |dir        |string  |Directory to create|
         * |[mode=0777]|number  |Directory mode     |
         * |callback   |function|Callback           |
         *
         * ```javascript
         * mkdir('/tmp/foo/bar/baz', function (err)
         * {
         *     if (err) console.log(err);
         *     else console.log('Done');
         * });
         * ```
         */

        /* dependencies
         * isFn noop 
         */

        var fs = require('fs'),
            path = require('path');

        var _0777 = parseInt('0777', 8);

        function exports(p, mode, cb)
        {
            if (isFn(mode))
            {
                cb = mode;
                mode = _0777;
            }
            cb = cb || noop;
            p = path.resolve(p);

            fs.mkdir(p, mode, function (err)
            {
                if (!err) return cb();

                switch (err.code)
                {
                    case 'ENOENT':
                        exports(path.dirname(p), mode, function (err)
                        {
                            if (err) return cb(err);

                            exports(p, mode, cb)
                        });
                        break;
                    default:
                        fs.stat(p, function (errStat, stat)
                        {
                            if (errStat || !stat.isDirectory()) return cb(errStat);

                            cb();
                        });
                }
            });
        }

        return exports;
    })();

    /* ------------------------------ nextTick ------------------------------ */

    var nextTick = _.nextTick = (function (exports)
    {
        /* Next tick for both node and browser.
         *
         * |Name|Type    |Desc            |
         * |----|--------|----------------|
         * |cb  |function|Function to call|
         *
         * Use process.nextTick if available.
         *
         * Otherwise setImmediate or setTimeout is used as fallback.
         *
         * ```javascript
         * nextTick(function ()
         * {
         *     // Do something...
         * });
         * ```
         */

        if (typeof process === 'object' && process.nextTick)
        {
            exports = process.nextTick;
        } else if (typeof setImmediate === 'function')
        {
            exports = function (cb) { setImmediate(ensureCallable(cb)) }
        } else
        {
            exports = function (cb) { setTimeout(ensureCallable(cb), 0) };
        }

        function ensureCallable(fn)
        {
            if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');

            return fn;
        }

        return exports;
    })({});

    /* ------------------------------ parallel ------------------------------ */

    _.parallel = (function ()
    {
        /* Run an array of functions in parallel.
         *
         * |Name |Type    |Desc                   |
         * |-----|--------|-----------------------|
         * |tasks|array   |Array of functions     |
         * |[cb] |function|Callback once completed|
         *
         * ```javascript
         * parallel([
         *     function(cb)
         *     {
         *         setTimeout(function () { cb(null, 'one') }, 200);
         *     },
         *     function(cb)
         *     {
         *         setTimeout(function () { cb(null, 'two') }, 100);
         *     }
         * ], function (err, results)
         * {
         *     // results -> ['one', 'two']
         * });
         * ```
         */

        /* dependencies
         * noop each nextTick 
         */

        function exports(tasks, cb)
        {
            cb = cb || noop;

            var results = [],
                pending = tasks.length;

            if (!pending) return done(null);

            each(tasks, function (task, i)
            {
                task(function (err, result) { taskCb(i, err, result) });
            });

            function taskCb(i, err, result)
            {
                results[i] = result;
                if (--pending === 0 || err) done(err);
            }

            function done(err)
            {
                nextTick(function ()
                {
                    cb(err, results);
                    cb = noop;
                });
            }
        }

        return exports;
    })();

    /* ------------------------------ reduce ------------------------------ */

    _.reduce = (function ()
    {
        /* Turn a list of values into a single value.
         *
         * |Name               |Type        |Desc                          |
         * |-------------------|------------|------------------------------|
         * |obj                |object array|Collection to iterate over    |
         * |[iteratee=identity]|function    |Function invoked per iteration|
         * |[initial]          |*           |Initial value                 |
         * |[ctx]              |*           |Function context              |
         * |return             |*           |Accumulated value             |
         *
         * ```javascript
         * reduce([1, 2, 3], function (sum, n) { return sum + n }, 0); // -> 6
         * ```
         */

        /* dependencies
         * optimizeCb isArrLike isUndef keys 
         */

        function exports(obj, iteratee, initial, ctx)
        {
            iteratee = optimizeCb(iteratee, ctx);

            var i = 0, len, key;

            if (isArrLike(obj))
            {
               if (isUndef(initial))
               {
                   initial = obj[0];
                   i = 1;
               }
               for (len = obj.length; i < len; i++)
               {
                   initial = iteratee(initial, obj[i], i, obj);
               }
            } else
            {
                var _keys = keys(obj);
                if (isUndef(initial))
                {
                    initial = obj[_keys[0]];
                    i = 1;
                }
                for (len = _keys.length; i < len; i++)
                {
                    key = _keys[i];
                    initial = iteratee(initial, obj[key], key, obj);
                }
            }

            return initial;
        }

        return exports;
    })();

    return _;
}));