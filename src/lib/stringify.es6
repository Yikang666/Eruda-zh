import util from './util'

// Modified from: https://jsconsole.com/
export default function stringify(obj, {
    visited = [],
    topObj,
    simple = false,
    level = 0,
    keyQuotes = true,
    getterVal = false,
    highlight = false,
    specialVal = false,
    sortKeys = true,
    keyNum = 0,
    unenumerable = true
    } = {})
{
    let json = '',
        type = '',
        parts = [],
        names = [],
        objEllipsis = '',
        proto,
        circular = false;

    topObj = topObj || obj;

    let passOpts = {
            visited, specialVal, simple, getterVal, keyQuotes, highlight,
            unenumerable, keyNum, sortKeys,
            level: level + 1
        },
        passProtoOpts = {
            visited, specialVal, getterVal, topObj, keyQuotes, highlight,
            unenumerable, keyNum, sortKeys,
            level: level + 1
        };
    let dbQuotes = keyQuotes ? '"' : '',
        doStringify = !(simple && level > 0);

    let keyWrapper = '',
        numWrapper = '',
        strWrapper = '',
        nullWrapper = '',
        boolWrapper = '',
        specialWrapper = '',
        fnWrapper = '',
        strEscape = str => str,
        wrapperEnd = '';

    if (highlight)
    {
        keyWrapper = '<span style="color: #a71d5d;">';
        fnWrapper = '<span style="color: #a71d5d;">';
        numWrapper = '<span style="color: #0086b3;">';
        nullWrapper = '<span style="color: #0086b3;">';
        strWrapper = '<span style="color: #183691;">';
        boolWrapper = '<span style="color: #0086b3;">';
        specialWrapper = '<span style="color: #707d8b;">';
        strEscape = str => util.escape(str);
        wrapperEnd = '</span>';
    }

    let wrapKey = key => keyWrapper + dbQuotes + strEscape(key) + dbQuotes + wrapperEnd,
        wrapNum = num => numWrapper + num + wrapperEnd,
        wrapBool = bool => boolWrapper + bool + wrapperEnd,
        wrapNull = str => nullWrapper + str + wrapperEnd;

    function wrapStr(str)
    {
        str = util.toStr(str);

        if (specialVal)
        {
            if (util.startWith(str, 'function'))
            {
                return fnWrapper + 'function' + wrapperEnd + ' ( )';
            }
            if (util.contain(SPECIAL_VAL, str) || util.startWith(str, 'Array['))
            {
                return specialWrapper + strEscape(str) + wrapperEnd;
            }
            if (util.startWith(str, '[object '))
            {
                return specialWrapper + strEscape(str.replace(/(\[object )|]/g, '')) + wrapperEnd;
            }
        }

        return strWrapper + strEscape(`"${str}"`) + wrapperEnd;
    }
    try {
        type = ({}).toString.call(obj);
    } catch (e)
    {
        type = '[object Object]';
    }

    var isFn = (type == '[object Function]'),
        isStr = (type == '[object String]'),
        isArr = (type == '[object Array]'),
        isObj = (type == '[object Object]'),
        isNum = (type == '[object Number]'),
        isSymbol = (type == '[object Symbol]'),
        isBool = (type == '[object Boolean]');

    for (let i = 0, len = visited.length; i < len; i++)
    {
        if (obj === visited[i])
        {
            circular = true;
            break;
        }
    }

    if (circular)
    {
        json = wrapStr('[circular]');
    } else if (isStr)
    {
        json = wrapStr(escapeJsonStr(obj));
    } else if (isArr)
    {
        visited.push(obj);

        if (doStringify)
        {
            json = '[';
            util.each(obj, val => parts.push(`${stringify(val, passOpts)}`));
            json += parts.join(', ') + ']';
        } else
        {
            json = wrapStr(`Array[${obj.length}]`);
        }
    } else if (isObj || isFn)
    {
        visited.push(obj);
        if (canBeProto(obj))
        {
            obj = Object.getPrototypeOf(obj);
            visited.push(obj);
        }

        names = unenumerable ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        if (keyNum && names.length > keyNum) objEllipsis = '...';
        if (keyNum) names = names.slice(0, keyNum);
        proto = Object.getPrototypeOf(obj);
        if (proto === Object.prototype || isFn || simple) proto = null;
        if (proto) proto = `${wrapKey('erudaProto')}: ${stringify(proto, passProtoOpts)}`;
        if (sortKeys) names.sort(sortObjName);
        if (isFn)
        {
            // We don't need these properties to display for functions.
            names = names.filter(val => ['arguments', 'caller', 'name', 'length', 'prototype'].indexOf(val) < 0);
        }
        if (names.length === 0 && isFn)
        {
            json = wrapStr(escapeJsonStr(obj.toString()));
        } else
        {
            if (doStringify)
            {
                json = '{ ';
                if (isFn)
                {
                    // Function length is restricted to 500 for performance reason.
                    var fnStr = obj.toString();
                    if (fnStr.length > 500) fnStr = fnStr.slice(0, 500) + '...';
                    parts.push(`${wrapKey('erudaObjAbstract')}: ${wrapStr(escapeJsonStr(fnStr))}`);
                }
                util.each(names, name =>
                {
                    let key = wrapKey(escapeJsonStr(name));

                    if (!getterVal)
                    {
                        let descriptor = Object.getOwnPropertyDescriptor(obj, name);
                        if (descriptor.get)
                        {
                            return parts.push(`${key}: ${wrapStr('(...)')}`);
                        }
                    }
                    parts.push(`${key}: ${stringify(topObj[name], passOpts)}`);
                });
                if (proto) parts.push(proto);
                json += parts.join(', ') + objEllipsis + ' }';
            } else
            {
                json = wrapStr('Object');
            }
        }
    } else if (isNum)
    {
        json = obj + '';
        if (util.endWith(json, 'Infinity') || json === 'NaN')
        {
            json = `"${json}"`;
        } else
        {
            json = wrapNum(json);
        }
    } else if (isBool)
    {
        json = wrapBool(obj ? 'true' : 'false');
    } else if (obj === null)
    {
        json = wrapNull('null');
    } else if (isSymbol)
    {
        json = wrapStr('Symbol');
    } else if (obj === undefined)
    {
        json = wrapStr('undefined');
    } else if (type === '[object HTMLAllCollection]')
    {
        // https://docs.webplatform.org/wiki/dom/HTMLAllCollection
        // Might cause a performance issue when stringify a dom element.
        json = wrapStr('[object HTMLAllCollection]');
    } else if (type === '[object HTMLDocument]' && level > 0)
    {
        // Same as reason above.
        json = wrapStr('[object HTMLDocument]');
    } else {
        try
        {
            visited.push(obj);
            if (canBeProto(obj))
            {
                obj = Object.getPrototypeOf(obj);
                visited.push(obj);
            }

            if (doStringify)
            {
                json = '{ ';
                if (!simple) parts.push(`${wrapKey('erudaObjAbstract')}: "${type.replace(/(\[object )|]/g, '')}"`);
                names = unenumerable ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
                if (keyNum && names.length > keyNum) objEllipsis = '...';
                if (keyNum) names = names.slice(0, keyNum);
                proto = Object.getPrototypeOf(obj);
                if (proto === Object.prototype || simple) proto = null;
                if (proto)
                {
                    try
                    {
                        proto = `${wrapKey('erudaProto')}: ${stringify(proto, passProtoOpts)}`;
                    } catch(e)
                    {
                        proto = `${wrapKey('erudaProto')}: ${wrapStr(escapeJsonStr(e.message))}`;
                    }
                }
                if (sortKeys) names.sort(sortObjName);
                util.each(names, name =>
                {
                    let key = wrapKey(escapeJsonStr(name));

                    if (!getterVal)
                    {
                        let descriptor = Object.getOwnPropertyDescriptor(obj, name);
                        if (descriptor.get)
                        {
                            return parts.push(`${key}: ${wrapStr('(...)')}`);
                        }
                    }
                    parts.push(`${key}: ${stringify(topObj[name], passOpts)}`);
                });
                if (proto) parts.push(proto);
                json += parts.join(', ') + objEllipsis + ' }';
            } else
            {
                json = wrapStr(obj);
            }
        } catch (e) {
            json = wrapStr(obj);
        }
    }

    return json;
}

const SPECIAL_VAL = ['(...)', '[circular]', 'undefined', 'Symbol', 'Object'];

var escapeJsonStr = str => str.replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\f|\n|\r|\t/g, '');

// $, upperCase, lowerCase, _
var sortObjName = (a, b) =>
{
    let lenA = a.length,
        lenB = b.length,
        len = lenA > lenB ? lenB : lenA;

    for (let i = 0; i < len; i++)
    {
        let codeA = a.charCodeAt(i),
            codeB = b.charCodeAt(i),
            cmpResult = cmpCode(codeA, codeB);

        if (cmpResult !== 0) return cmpResult;
    }

    if (lenA > lenB) return 1;
    if (lenA < lenB) return -1;
    return 0;
};

function cmpCode(a, b)
{
    a = transCode(a);
    b = transCode(b);

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
}

function transCode(code)
{
    if (code === 95) return 123;
    return code;
}

function canBeProto(obj)
{
    let emptyObj = util.isEmpty(Object.getOwnPropertyNames(obj)),
        proto = Object.getPrototypeOf(obj);

    return emptyObj && proto && proto !== Object.prototype;
}

