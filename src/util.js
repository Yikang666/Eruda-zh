// Built by eustia.
module.exports = (function ()
{
    var _ = {};

    /* ------------------------------ last ------------------------------ */

    var last;

    _.last = (function ()
    {
        // TODO

        /* function
         * last: Gets the last element of array.
         * array(array): The array to query.
         * return(*): Returns the last element of array.
         */

        last = function (arr)
        {
            var len = arr ? arr.length : 0;

            return len ? arr[len - 1] : undefined;
        };

        return last;
    })();

    /* ------------------------------ isUndef ------------------------------ */

    var isUndef;

    _.isUndef = (function ()
    {
        /* function
         *
         * isUndef: Checks if value is undefined.
         * value(*): The value to check.
         * return(boolean): Returns true if value is undefined, else false.
         *
         * ```javascript
         * _.isUndef(void 0) // -> true
         * _.isUndef(null) // -> false
         * ```
         *
         * Just a shortcut for **x === undefined**, doesn't matter that much whether you
         * use it or not.
         */

        isUndef = function (value) { return value === void 0 };

        return isUndef;
    })();

    /* ------------------------------ isObj ------------------------------ */

    var isObj;

    _.isObj = (function ()
    {
        // TODO

        /* function
         * isObj: Checks if value is the language type of Object.
         * value(*): The value to check.
         * return(boolean): Returns true if value is an object, else false.
         */

        isObj = function (val)
        {
            var type = typeof val;

            return type === 'function' || type === 'object';
        };

        return isObj;
    })();

    /* ------------------------------ camelize ------------------------------ */

    var camelize;

    _.camelize = (function ()
    {
        // TODO

        /* function
         * camelCase: Convert string to "camelCase" text.
         */

        camelize = function (str, char)
        {
            char = char || '-';

            return str.replace(new RegExp(char + '+(.)?', 'g'), function (match, char)
            {
                return char ? char.toUpperCase() : '';
            });
        };

        return camelize;
    })();

    /* ------------------------------ dasherize ------------------------------ */

    var dasherize;

    _.dasherize = (function ()
    {
        // TODO

        /* function
         *
         * dasherize:  Convert string to "dashCase".
         */

        dasherize = function (str)
        {
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        };

        return dasherize;
    })();

    /* ------------------------------ inherits ------------------------------ */

    var inherits;

    _.inherits = (function ()
    {
        // TODO

        /* function
         * inherits: Inherit the prototype methods from one constructor into another.
         * Class(function): Child Class.
         * SuperClass(function): Super Class.
         */

        var objCreate = Object.create;

        function noop() {}

        inherits = function (Class, SuperClass)
        {
            if (objCreate) return Class.prototype = objCreate(SuperClass.prototype);

            noop.prototype  = SuperClass.prototype;
            Class.prototype = new noop();
        };

        return inherits;
    })();

    /* ------------------------------ has ------------------------------ */

    var has;

    _.has = (function ()
    {
        /* function
         * has: Checks if key is a direct property.
         * object(object): The object to query.
         * key(string): The path to check.
         * return(boolean): Returns true if key is a direct property, else false.
         */

        var hasOwnProp = Object.prototype.hasOwnProperty;

        has = function (obj, key)
        {
            return hasOwnProp.call(obj, key);
        };

        return has;
    })();

    /* ------------------------------ slice ------------------------------ */

    var slice;

    _.slice = (function ()
    {
        // TODO

        var arrProto = Array.prototype;

        slice = function (arr, start, end)
        {
            return arrProto.slice.call(arr, start, end);
        };

        return slice;
    })();

    /* ------------------------------ _createAssigner ------------------------------ */

    var _createAssigner;

    _._createAssigner = (function ()
    {

        _createAssigner = function (keysFunc, defaults)
        {
            return function (obj)
            {
                var len = arguments.length;

                if (defaults) obj = Object(obj);

                if (len < 2 || obj == null) return obj;

                for (var i = 1; i < len; i++)
                {
                    var src     = arguments[i],
                        keys    = keysFunc(src),
                        keysLen = keys.length;

                    for (var j = 0; j < keysLen; j++)
                    {
                        var key = keys[j];
                        if (!defaults || isUndef(obj[key])) obj[key] = src[key];
                    }
                }

                return obj;
            };
        };

        return _createAssigner;
    })();

    /* ------------------------------ allKeys ------------------------------ */

    var allKeys;

    _.allKeys = (function ()
    {
        /* function
         * allKeys: Retrieve all the names of object's own and inherited properties.
         * object(object): The object to query.
         * return(array): Returns the array of all property names.
         *
         * ```javascript
         * var obj = Object.create({ a: 0 });
         * obj.b = 1;
         * _.allKeys(obj) // -> ['a', 'b']
         * ```
         *
         * > Members of Object's prototype won't be retrieved.
         */

        allKeys = function (obj)
        {
            var ret = [], key;

            for (key in obj) ret.push(key);

            return ret;
        };

        return allKeys;
    })();

    /* ------------------------------ extend ------------------------------ */

    var extend;

    _.extend = (function ()
    {
        // TODO

        extend = _createAssigner(allKeys);

        return extend;
    })();

    /* ------------------------------ indexOf ------------------------------ */

    var indexOf;

    _.indexOf = (function ()
    {
        // TODO

        indexOf = function (arr, val)
        {
            return Array.prototype.indexOf.call(arr, val);
        };

        return indexOf;
    })();

    /* ------------------------------ defaults ------------------------------ */

    var defaults;

    _.defaults = (function ()
    {
        // TODO

        defaults = _createAssigner(allKeys, true);

        return defaults;
    })();

    /* ------------------------------ keys ------------------------------ */

    var keys;

    _.keys = (function ()
    {
        /* function
         * keys: Creates an array of the own enumerable property names of object.
         * object(object): The object to query.
         * return(array): Returns the array of property names.
         */

        keys = Object.keys || function (obj)
        {
            var ret = [], key;

            for (key in obj)
            {
                if (has(obj, key)) ret.push(key);
            }

            return ret;
        };

        return keys;
    })();

    /* ------------------------------ evalCss ------------------------------ */

    var evalCss;

    _.evalCss = (function ()
    {
        evalCss = function (css)
        {
            var style = document.createElement('style');
            style.textContent = css;
            style.type = 'text/css';
            document.body.appendChild(style);
        };

        return evalCss;
    })();

    /* ------------------------------ extendOwn ------------------------------ */

    var extendOwn;

    _.extendOwn = (function ()
    {
        // TODO

        extendOwn = _createAssigner(keys);

        return extendOwn;
    })();

    /* ------------------------------ objToStr ------------------------------ */

    var objToStr;

    _.objToStr = (function ()
    {
        /* function
         * objToStr: Alias of Object.prototype.toString.
         * value(*): The source value.
         * return(string): String representation of the given value.
         */

        var ObjToStr = Object.prototype.toString;

        objToStr = function (val)
        {
            return ObjToStr.call(val);
        };

        return objToStr;
    })();

    /* ------------------------------ isArr ------------------------------ */

    var isArr;

    _.isArr = (function ()
    {
        /* function
         * isArr: Check if value is an array.
         * value(*): The value to check.
         * return(boolean): True if value is an array, else false.
         */

        isArr = Array.isArray || function (val)
        {
            return objToStr(val) === '[object Array]';
        };

        return isArr;
    })();

    /* ------------------------------ isNum ------------------------------ */

    var isNum;

    _.isNum = (function ()
    {
        // TODO

        /* function
         * isNum: Checks if value is classified as a Number primitive or object.
         * value(*): The value to check.
         * return(boolean): Returns true if value is correctly classified, else false.
         */

        isNum = function (value) { return objToStr(value) === '[object Number]' };

        return isNum;
    })();

    /* ------------------------------ cookie ------------------------------ */

    var cookie;

    _.cookie = (function ()
    {
        // TODO

        /* module
         * cookie: Simple api for handling browser cookies.
         */

        var defOpts = { path: '/' };

        function setCookie(key, val, options)
        {
            if (arguments.length > 1)
            {
                options = extend(defOpts, options);

                if (isNum(options.expires))
                {
                    var expires = new Date();
                    expires.setMilliseconds(expires.getMilliseconds() + options.expires * 864e+5);
                    options.expires = expires;
                }

                val = encodeURIComponent(String(val));
                key = encodeURIComponent(key);

                document.cookie = [
                    key, '=', val,
                    options.expires && '; expires=' + options.expires.toUTCString(),
                    options.path    && '; path=' + options.path,
                    options.domain  && '; domain=' + options.domain,
                    options.secure ? '; secure' : ''
                ].join('');

                return cookie;
            }

            var cookies = document.cookie ? document.cookie.split('; ') : [],
                result  = key ? undefined : {};

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

        cookie = {
            /* member
             * cookie.get: Read cookie.
             * key(string): The cookie name.
             * return(string): Returns cookie value if exists, eles undefined.
             */
            get: setCookie,
            /* member
             * cookie.set: Set cookie.
             * key(string): The cookie name.
             * val(string): The cookie value.
             * options(Object): Options.
             */
            set: setCookie,
            remove: function (key, options)
            {
                options = options || {};
                options.expires = -1;
                return setCookie(key, '', options);
            }
        };

        return cookie;
    })();

    /* ------------------------------ isArrLike ------------------------------ */

    var isArrLike;

    _.isArrLike = (function ()
    {
        // TODO

        var MAX_ARR_IDX = Math.pow(2, 53) - 1;

        isArrLike = function (val)
        {
            if (!has(val, 'length')) return false;

            var len = val.length;

            return isNum(len) && len >= 0 && len <= MAX_ARR_IDX;
        };

        return isArrLike;
    })();

    /* ------------------------------ each ------------------------------ */

    var each;

    _.each = (function ()
    {
        // TODO

        each = function (obj, iteratee, ctx)
        {
            var i, len;

            if (isArrLike(obj))
            {
                for (i = 0, len = obj.length; i < len; i++) iteratee.call(ctx, obj[i], i, obj);
            } else
            {
                var _keys = keys(obj);
                for (i = 0, len = _keys.length; i < len; i++)
                {
                    iteratee.call(ctx, obj[_keys[i]], _keys[i], obj);
                }
            }

            return obj;
        };

        return each;
    })();

    /* ------------------------------ values ------------------------------ */

    var values;

    _.values = (function ()
    {
        /* function
         * values: Creates an array of the own enumerable property values of object.
         * object(object): The object to query.
         * return(array): The array of property values.
         *
         * ```javascript
         * values({one: 1, two: 2}); // -> [1, 2]
         * ```
         */

        values = function (obj)
        {
            var ret = [];

            each(obj, function (val) { ret.push(val) });

            return ret;
        };

        return values;
    })();

    /* ------------------------------ contain ------------------------------ */

    var contain;

    _.contain = (function ()
    {
        // TODO

        contain = function (arr, val)
        {
            if (!isArrLike(arr)) arr = values(arr);

            return indexOf(arr, val) >= 0;
        };

        return contain;
    })();

    /* ------------------------------ isStr ------------------------------ */

    var isStr;

    _.isStr = (function ()
    {
        // TODO

        /* function
         * isStr: Checks if value is classified as a String primitive or object.
         * value(*): The value to check.
         * return(boolean): Returns true if value is correctly classified, else false.
         */

        isStr = function (value) { return objToStr(value) === '[object String]' };

        return isStr;
    })();

    /* ------------------------------ isErr ------------------------------ */

    var isErr;

    _.isErr = (function ()
    {
        // TODO

        /* function
         * isErr: Checks if value is an Error.
         * value(*): The value to check.
         * return(boolean): Returns true if value is an error object, else false.
         */

        isErr = function (val) { return objToStr(val) === '[object Error]' };

        return isErr;
    })();

    /* ------------------------------ isFn ------------------------------ */

    var isFn;

    _.isFn = (function ()
    {
        /* function
         * isFn: Check if value is a function.
         * value(*): The value to check.
         * return(boolean): True if value is a function, else false.
         */

        isFn = function (val)
        {
            return objToStr(val) === '[object Function]';
        };

        return isFn;
    })();

    /* ------------------------------ isMatch ------------------------------ */

    var isMatch;

    _.isMatch = (function ()
    {
        // TODO

        isMatch = function (obj, attrs)
        {
            var _keys = keys(attrs),
                len   = _keys.length;

            if (obj == null) return !len;

            obj = Object(obj);

            for (var i = 0; i < len; i++)
            {
                var key = keys[i];
                if (attrs[key] !== obj[key] || !(key in obj)) return false;
            }

            return true;
        };

        return isMatch;
    })();

    /* ------------------------------ isRegExp ------------------------------ */

    var isRegExp;

    _.isRegExp = (function ()
    {
        // TODO

        isRegExp = function (value)
        {
            return objToStr(value) === '[object RegExp]';
        };

        return isRegExp;
    })();

    /* ------------------------------ loadJs ------------------------------ */

    var loadJs;

    _.loadJs = (function ()
    {
        loadJs = function (url, cb)
        {
            var script = document.createElement('script');
            script.src = url;
            script.onload = function ()
            {
                var isNotLoaded = script.readyState &&
                    script.readyState != "complete" &&
                    script.readyState != "loaded";

                cb && cb(!isNotLoaded);
            };
            document.body.appendChild(script);
        };

        return loadJs;
    })();

    /* ------------------------------ ltrim ------------------------------ */

    var ltrim;

    _.ltrim = (function ()
    {
        // TODO

        var regSpace = /^\s+/;

        ltrim = function (str, chars)
        {
            if (chars == null) return str.replace(regSpace, '');

            var start   = 0,
                len     = str.length,
                charLen = chars.length,
                found   = true,
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

            return (start >= len) ? '' : str.substr(start, len);
        };

        return ltrim;
    })();

    /* ------------------------------ matcher ------------------------------ */

    var matcher;

    _.matcher = (function ()
    {
        // TODO

        matcher = function (attrs)
        {
            attrs = extendOwn({}, attrs);

            return function (obj)
            {
                return isMatch(obj, attrs);
            };
        };

        return matcher;
    })();

    /* ------------------------------ optimizeCb ------------------------------ */

    var optimizeCb;

    _.optimizeCb = (function ()
    {

        optimizeCb = function (func, ctx, argCount)
        {
            if (isUndef(ctx)) return func;

            switch (argCount == null ? 3 : argCount)
            {
                case 1: return function (val)
                {
                    return func.call(ctx, val);
                };
                case 3: return function (val, idx, collection)
                {
                    return func.call(ctx, val, idx, collection);
                };
                case 4: return function (accumulator, val, idx, collection)
                {
                    return func.call(ctx, accumulator, val, idx, collection);
                }
            }

            return function ()
            {
                return func.apply(ctx, arguments);
            };
        };

        return optimizeCb;
    })();

    /* ------------------------------ safeCb ------------------------------ */

    var safeCb;

    _.safeCb = (function ()
    {
        /* function
         * safeCb: Create callback based on input value.
         */

        safeCb = function (val, ctx, argCount)
        {
            if (val == null) return function (val) { return val };

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

        return safeCb;
    })();

    /* ------------------------------ filter ------------------------------ */

    var filter;

    _.filter = (function ()
    {
        // TODO

        filter = function (obj, predicate, ctx)
        {
            var ret = [];

            predicate = safeCb(predicate, ctx);

            each(obj, function (val, idx, list)
            {
                if (predicate(val, idx, list)) ret.push(val);
            });

            return ret;
        };

        return filter;
    })();

    /* ------------------------------ map ------------------------------ */

    var map;

    _.map = (function ()
    {
        // TODO

        map = function (obj, iteratee, ctx)
        {
            iteratee = safeCb(iteratee, ctx);

            var _keys   = !isArrLike(obj) && keys(obj),
                len     = (_keys || obj).length,
                results = Array(len);

            for (var i = 0; i < len; i++)
            {
                var curKey = _keys ? _keys[i] : i;
                results[i] = iteratee(obj[curKey], curKey, obj);
            }

            return results;
        };

        return map;
    })();

    /* ------------------------------ toArr ------------------------------ */

    var toArr;

    _.toArr = (function ()
    {

        toArr = function (obj)
        {
            if (isArr(obj)) return obj;

            return isArrLike(obj) && !isStr(obj)
                   ? map(obj, function (val) { return val })
                   : [obj];
        };

        return toArr;
    })();

    /* ------------------------------ Class ------------------------------ */

    var Class;

    _.Class = (function ()
    {
        // TODO

        /* function
         *
         * Class: Create JavaScript class.
         * methods(object): Public methods.
         * statics(object): Static methods.
         * return(function): Return function used to create instances.
         */

        var regCallSuper = /callSuper/;

        function makeClass(parent, methods, statics)
        {
            statics = statics || {};

            var ctor = function ()
            {
                var args = toArr(arguments);

                if (has(ctor.prototype, 'initialize') &&
                    !regCallSuper.test(this.initialize.toString()) &&
                    this.callSuper)
                {
                    args.unshift('initialize');
                    this.callSuper.apply(this, args);
                    args.shift();
                }

                return this.initialize
                       ? this.initialize.apply(this, args) || this
                       : this;
            };

            inherits(ctor, parent);
            ctor.superclass = ctor.prototype.superclass = parent;

            ctor.extend   = function (methods, statics) { return makeClass(ctor, methods, statics) };
            ctor.inherits = function (Class) { inherits(Class, ctor) };
            ctor.methods  = function (methods) { extend(ctor.prototype, methods); return ctor };
            ctor.statics  = function (statics) { extend(ctor, statics); return ctor };

            ctor.methods(methods).statics(statics);

            return ctor;
        }

        Class = function (methods, statics) { return Base.extend(methods, statics) };

        var Base = Class.Base = makeClass(Object, {
            className: 'Base',
            callSuper: function (name)
            {
                var superMethod = this.superclass.prototype[name];

                if (!superMethod) return;

                return superMethod.apply(this, toArr(arguments).slice(1));
            },
            toString: function ()
            {
                return this.className;
            }
        });

        return Class;
    })();

    /* ------------------------------ Emitter ------------------------------ */

    var Emitter;

    _.Emitter = (function ()
    {

        Emitter = Class({
            initialize: function ()
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
                var fired = false;

                function g()
                {
                    this.off(event, g);
                    if (!fired)
                    {
                        fired = true;
                        listener.apply(this, arguments);
                    }
                }

                this.on(event, g);

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
                    obj[val] = Emitter.prototype[val];
                });

                obj._events = obj._events || {};
            }
        });

        return Emitter;
    })();

    /* ------------------------------ delegate ------------------------------ */

    var delegate;

    _.delegate = (function ()
    {

        function retTrue()  { return true }
        function retFalse() { return false }

        function trigger(e)
        {
            var handlers = this.events[e.type],
                handler,
                handlerQueue = formatHandlers.call(this, e, handlers);

            e = new delegate.Event(e);

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
                ret     = [],
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

        delegate = {
            add: function (el, type, selector, fn)
            {
                var handler = {
                        selector: selector,
                        handler : fn
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

        return delegate;
    })();

    /* ------------------------------ some ------------------------------ */

    var some;

    _.some = (function ()
    {
        // TODO

        some = function (obj, predicate, ctx)
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
        };

        return some;
    })();

    /* ------------------------------ Select ------------------------------ */

    var Select;

    _.Select = (function ()
    {
        // TODO

        /* class
         * Select: jQuery like dom manipulator.
         */

        function mergeArr(first, second)
        {
            var len = second.length,
                i   = first.length;

            for (var j = 0; j < len; j++) first[i++] = second[j];

            first.length = i;

            return first;
        }

        Select = Class({
            className: 'Select',
            initialize: function (selector)
            {
                this.length = 0;

                if (!selector) return this;

                if (isStr(selector)) return rootSelect.find(selector);

                if (selector.nodeType)
                {
                    this[0]     = selector;
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

        var rootSelect = new Select(document);

        return Select;
    })();

    /* ------------------------------ $safeNodes ------------------------------ */

    var $safeNodes;

    _.$safeNodes = (function ()
    {

        $safeNodes = function (nodes)
        {
            if (isStr(nodes)) return new Select(nodes);

            return toArr(nodes);
        };

        return $safeNodes;
    })();

    /* ------------------------------ $attr ------------------------------ */

    var $attr;

    _.$attr = (function ()
    {

        $attr = function (nodes, name, val)
        {
            nodes = $safeNodes(nodes);

            var isGetter = isUndef(val) && isStr(name);
            if (isGetter) return getAttr(nodes[0], name);

            var attrs = name;
            if (!isObj(attrs))
            {
                attrs = {};
                attrs[name] = val;
            }

            setAttr(nodes, attrs);
        };

        $attr.remove = function (nodes, names)
        {
            nodes = $safeNodes(nodes);
            names = toArr(names);

            each(nodes, function (node)
            {
                each(names, function (name)
                {
                    node.removeAttribute(name);
                });
            });
        };

        function getAttr(node, name)
        {
            return node.getAttribute(name);
        }

        function setAttr(nodes, attrs)
        {
            each(nodes, function (node)
            {
                each(attrs, function (val, name)
                {
                    node.setAttribute(name, val);
                });
            })
        }

        return $attr;
    })();

    /* ------------------------------ $data ------------------------------ */

    var $data;

    _.$data = (function ()
    {

        $data = function (nodes, name, val)
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
        };

        return $data;
    })();

    /* ------------------------------ $class ------------------------------ */

    var $class;

    _.$class = (function ()
    {

        $class = {
            add: function (nodes, name)
            {
                nodes = $safeNodes(nodes);
                var names = toArr(name);

                each(nodes, function (node)
                {
                    var classList = [];

                    each(names, function (name)
                    {
                        if (!$class.has(node, name)) classList.push(name);
                    });

                    if (classList.length !== 0) node.className += ' ' + classList.join(' ');
                });
            },
            has: function (nodes, name)
            {
                nodes = $safeNodes(nodes);

                var regName = new RegExp('(^|\\s)' + name + '(\\s|$)');

                return some(nodes, function (node)
                {
                    return regName.test(node.className);
                });
            },
            toggle: function (nodes, name)
            {
                nodes = $safeNodes(nodes);

                each(nodes, function (node)
                {
                    if (!$class.has(node, name)) return $class.add(node, name);

                    $class.remove(node, name);
                });
            },
            remove: function (nodes, name)
            {
                nodes = $safeNodes(nodes);
                var names = toArr(name);

                each(nodes, function (node)
                {
                    each(names, function (name)
                    {
                        node.classList.remove(name);
                    });
                });
            }
        };

        return $class;
    })();

    /* ------------------------------ $css ------------------------------ */

    var $css;

    _.$css = (function ()
    {

        $css = function (nodes, name, val)
        {
            nodes = $safeNodes(nodes);

            var isGetter = isUndef(val) && isStr(name);
            if (isGetter) return getCss(nodes[0], name);

            var css = name;
            if (!isObj(css))
            {
                css = {};
                css[name] = val;
            }

            setCss(nodes, css);
        };

        function getCss(node, name)
        {
            return node.style[camelize(name)];
        }

        function setCss(nodes, css)
        {
            each(nodes, function (node)
            {
                var cssText = ';';
                each(css, function (val, key)
                {
                    cssText += dasherize(key) + ':' + addPx(key, val) + ';';
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
            var needPx = isNum(val) && !contain(cssNumProps, dasherize(key));

            return needPx ? val + 'px' : val;
        }

        return $css;
    })();

    /* ------------------------------ $event ------------------------------ */

    var $event;

    _.$event = (function ()
    {

        $event = {
            on: eventFactory('add'),
            off: eventFactory('remove')
        };

        function eventFactory(type)
        {
            return function (nodes, event, selector, handler)
            {
                nodes = $safeNodes(nodes);

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

        return $event;
    })();

    /* ------------------------------ $insert ------------------------------ */

    var $insert;

    _.$insert = (function ()
    {

        $insert = {
            before: insertFactory('beforebegin'),
            after: insertFactory('afterend'),
            append: insertFactory('beforeend'),
            prepend: insertFactory('afterbegin')
        };

        function insertFactory(type)
        {
            return function (nodes, val)
            {
                nodes = $safeNodes(nodes);

                each(nodes, function (node)
                {
                    node.insertAdjacentHTML(type, val);
                });
            };
        }

        return $insert;
    })();

    /* ------------------------------ $offset ------------------------------ */

    var $offset;

    _.$offset = (function ()
    {

        $offset = function (nodes)
        {
            nodes = $safeNodes(nodes);

            var node = nodes[0];

            var clientRect = node.getBoundingClientRect();

            return {
                left: clientRect.left + window.pageXOffset,
                top : clientRect.top  + window.pageYOffset,
                width : Math.round(clientRect.width),
                height: Math.round(clientRect.height)
            };
        };

        return $offset;
    })();

    /* ------------------------------ $property ------------------------------ */

    var $property;

    _.$property = (function ()
    {

        $property = {
            html: propFactory('innerHTML'),
            text: propFactory('textContent'),
            val: propFactory('value')
        };

        function propFactory(name)
        {
            return function (nodes, val)
            {
                nodes = $safeNodes(nodes);

                if (isUndef(val)) return nodes[0][name];

                each(nodes, function (node)
                {
                    node[name] = val;
                });
            };
        }

        return $property;
    })();

    /* ------------------------------ $remove ------------------------------ */

    var $remove;

    _.$remove = (function ()
    {

        $remove = function (nodes)
        {
            nodes = $safeNodes(nodes);

            each(nodes, function (node)
            {
                var parent = node.parentNode;

                if (parent) parent.removeChild(node);
            });
        };

        return $remove;
    })();

    /* ------------------------------ $show ------------------------------ */

    var $show;

    _.$show = (function ()
    {

        $show = function (nodes)
        {
            nodes = $safeNodes(nodes);

            each(nodes, function (node)
            {
                if (isHidden(node))
                {
                    node.style.display = getDefDisplay(node.nodeName);
                }
            });
        };

        function isHidden(node)
        {
            return getComputedStyle(node, '').getPropertyValue('display') == 'none';
        }

        var elDisplay = {};

        function getDefDisplay(nodeName)
        {
            var el, display;

            if (!elDisplay[nodeName])
            {
                el = document.createElement(nodeName);
                document.body.appendChild(el);
                display = getComputedStyle(el, '').getPropertyValue("display");
                el.parentNode.removeChild(el);
                display == "none" && (display = "block");
                elDisplay[nodeName] = display;
            }

            return elDisplay[nodeName];
        }

        return $show;
    })();

    /* ------------------------------ $ ------------------------------ */

    var $;

    _.$ = (function ()
    {

        $ = function (selector)
        {
            return new Select(selector);
        };

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
                return $(this[0]);
            },
            last: function () {
                return $(last(this));
            },
            get: function (idx)
            {
                return this[idx];
            },
            eq: function (idx)
            {
                return $(idx);
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

        return $;
    })();

    /* ------------------------------ orientation ------------------------------ */

    var orientation;

    _.orientation = (function ()
    {

        orientation = {};

        Emitter.mixin(orientation);

        window.addEventListener('orientationchange', function ()
        {
            setTimeout(function ()
            {
                orientation.emit('change');
            }, 150);
        }, false);

        return orientation;
    })();

    /* ------------------------------ rtrim ------------------------------ */

    var rtrim;

    _.rtrim = (function ()
    {
        // TODO

        var regSpace = /\s+$/;

        rtrim = function (str, chars)
        {
            if (chars == null) return str.replace(regSpace, '');

            var end     = str.length - 1,
                charLen = chars.length,
                found   = true,
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
        };

        return rtrim;
    })();

    /* ------------------------------ startWith ------------------------------ */

    var startWith;

    _.startWith = (function ()
    {
        // TODO

        /* function
         * startWith: Checks if string starts with the given target string.
         * string(string): The string to search.
         * prefix(string): String prefix.
         * return(boolean): Returns true if string starts with prefix, else false.
         */

        startWith = function (str, prefix) { return str.indexOf(prefix) === 0 };

        return startWith;
    })();

    /* ------------------------------ trim ------------------------------ */

    var trim;

    _.trim = (function ()
    {
        // TODO

        var regSpace = /^\s+|\s+$/g;

        trim = function (str, chars)
        {
            if (chars == null) return str.replace(regSpace, '');

            return ltrim(rtrim(str, chars), chars);
        };

        return trim;
    })();

    /* ------------------------------ unique ------------------------------ */

    var unique;

    _.unique = (function ()
    {

        function isEqual(a, b) { return a === b }

        unique = function (arr, compare)
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
        };

        return unique;
    })();

    return _;
})();