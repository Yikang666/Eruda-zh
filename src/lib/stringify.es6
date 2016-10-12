import util from './util'

// Modified from: https://jsconsole.com/
export default function stringify(obj, {
    visited = [],
    topObj,
    level = 0,
    getterVal = false,
    specialVal = false,
    unenumerable = true
    } = {})
{
    let json = '',
        type = '',
        parts = [],
        names = [],
        proto,
        circularId,
        allKeys, keys,
        id = '',
        circular = false;

    topObj = topObj || obj;

    let passOpts = {
            visited, specialVal, getterVal,
            unenumerable,
            level: level + 1
        },
        passProtoOpts = {
            visited, specialVal, getterVal, topObj,
            unenumerable,
            level: level + 1
        };

    let specialWrapper = '',
        fnWrapper = '',
        strEscape = str => str,
        wrapperEnd = '';

    let wrapKey = key => '"' + strEscape(key) + '"';

    function visit(value)
    {
        let id = util.uniqId('erudaJson');

        visited.push({id, value});

        return id;
    }

    function wrapStr(str)
    {
        str = util.toStr(str);

        if (specialVal)
        {
            str = str.replace(/\\/g, '');
            if (util.startWith(str, 'function'))
            {
                return fnWrapper + 'function' + wrapperEnd + ' ( )';
            }
            if (util.contain(SPECIAL_VAL, str) || util.startWith(str, 'Array['))
            {
                return specialWrapper + strEscape(str) + wrapperEnd;
            }
            if (util.startWith(str, '[circular]'))
            {
                return specialWrapper + '[circular]' + wrapperEnd;
            }
            if (util.startWith(str, '[object '))
            {
                return specialWrapper + strEscape(str.replace(/(\[object )|]/g, '')) + wrapperEnd;
            }
        }

        return strEscape(`"${str}"`);
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
        if (obj === visited[i].value)
        {
            circular = true;
            circularId = visited[i].id;
            break;
        }
    }

    if (circular)
    {
        json = wrapStr('[circular]' + ' ' + circularId);
    } else if (isStr)
    {
        json = wrapStr(escapeJsonStr(obj));
    } else if (isArr)
    {
        id = visit(obj);

        json = '[';
        util.each(obj, val => parts.push(`${stringify(val, passOpts)}`));
        parts.push(`"${id}"`);
        json += parts.join(', ') + ']';
    } else if (isObj || isFn)
    {
        id = visit(obj);

        if (canBeProto(obj))
        {
            obj = Object.getPrototypeOf(obj);
            id = visit(obj);
        }

        allKeys = Object.getOwnPropertyNames(obj);
        keys = Object.keys(obj);
        names = unenumerable ? allKeys : keys;
        proto = Object.getPrototypeOf(obj);
        if (proto) proto = `${wrapKey('erudaProto')}: ${stringify(proto, passProtoOpts)}`;
        names.sort(sortObjName);
        if (isFn)
        {
            // We don't need these properties to display for functions.
            names = names.filter(val => ['arguments', 'caller', 'prototype'].indexOf(val) < 0);
        }
        json = '{ ';
        if (isFn) parts.push(`${wrapKey('erudaObjAbstract')}: ${wrapStr(getFnAbstract(obj))}`);
        parts.push(`"erudaId": "${id}"`);
        util.each(names, name =>
        {
            let unenumerable = !util.contain(keys, name) ? 'erudaUnenumerable' : '',
                key = wrapKey(unenumerable + ' ' + escapeJsonStr(name)),
                getKey = wrapKey(unenumerable + ' ' + escapeJsonStr('get ' + name)),
                setKey = wrapKey(unenumerable + ' ' + escapeJsonStr('set ' + name));

            let descriptor = Object.getOwnPropertyDescriptor(obj, name),
                hasGetter = descriptor && descriptor.get,
                hasSetter = descriptor && descriptor.set;
            if (!getterVal && hasGetter)
            {
                parts.push(`${getKey}: ${wrapStr(escapeJsonStr(extractFnHead(descriptor.get)))}`);
            }
            if (hasSetter)
            {
                parts.push(`${setKey}: ${wrapStr(escapeJsonStr(extractFnHead(descriptor.set)))}`);
            }
            if (!getterVal && hasGetter) return;
            parts.push(`${key}: ${stringify(topObj[name], passOpts)}`);
        });
        if (proto) parts.push(proto);
        json += parts.join(', ') + ' }';
    } else if (isNum)
    {
        json = obj + '';
        if (util.endWith(json, 'Infinity') || json === 'NaN')
        {
            json = `"${json}"`;
        }
    } else if (isBool)
    {
        json = obj ? 'true' : 'false';
    } else if (obj === null)
    {
        json = 'null';
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
    } else if (type === '[object HTMLDocument]' && level > 1)
    {
        // Same as reason above.
        json = wrapStr('[object HTMLDocument]');
    } else {
        try
        {
            id = visit(obj);
            if (canBeProto(obj))
            {
                obj = Object.getPrototypeOf(obj);
                id = visit(obj);
            }

            json = '{ ';
            parts.push(`${wrapKey('erudaObjAbstract')}: "${type.replace(/(\[object )|]/g, '')}"`);
            parts.push(`"erudaId": "${id}"`);
            allKeys = Object.getOwnPropertyNames(obj);
            keys = Object.keys(obj);
            names = unenumerable ? allKeys : keys;
            proto = Object.getPrototypeOf(obj);
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
            names.sort(sortObjName);
            util.each(names, name =>
            {
                let unenumerable = !util.contain(keys, name) ? 'erudaUnenumerable' : '',
                    key = wrapKey(unenumerable + ' ' + escapeJsonStr(name)),
                    getKey = wrapKey(unenumerable + ' ' + escapeJsonStr('get ' + name)),
                    setKey = wrapKey(unenumerable + ' ' + escapeJsonStr('set ' + name));

                let descriptor = Object.getOwnPropertyDescriptor(obj, name),
                    hasGetter = descriptor && descriptor.get,
                    hasSetter = descriptor && descriptor.set;
                if (!getterVal && hasGetter)
                {
                    parts.push(`${getKey}: ${wrapStr(escapeJsonStr(extractFnHead(descriptor.get)))}`);
                }
                if (hasSetter)
                {
                    parts.push(`${setKey}: ${wrapStr(escapeJsonStr(extractFnHead(descriptor.set)))}`);
                }
                if (!getterVal && hasGetter) return;
                parts.push(`${key}: ${stringify(topObj[name], passOpts)}`);
            });
            if (proto) parts.push(proto);
            json += parts.join(', ') + ' }';
        } catch (e)
        {
            json = wrapStr(e.message);
            // json = wrapStr(obj);
        }
    }

    return json;
}

const SPECIAL_VAL = ['(...)', 'undefined', 'Symbol', 'Object'];

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
    if (code === 95) return 91;
    return code;
}

let regFnHead = /function(.*?)\((.*?)\)/;

function extractFnHead(fn)
{
    let str = fn.toString(),
        fnHead = str.match(regFnHead);

    if (fnHead) return fnHead[0];

    return str;
}

function getFnAbstract(fn)
{
    let fnStr = fn.toString();
    if (fnStr.length > 500) fnStr = fnStr.slice(0, 500) + '...';

    return escapeJsonStr(extractFnHead(fnStr).replace('function', ''));
}

function canBeProto(obj)
{
    let emptyObj = util.isEmpty(Object.getOwnPropertyNames(obj)),
        proto = Object.getPrototypeOf(obj);

    return emptyObj && proto && proto !== Object.prototype;
}

