import util from './util'

// Modified from: https://jsconsole.com/
export default function stringify(obj, {
    visited = [],
    topObj,
    simple = false,
    keyQuotes = true,
    getterVal = false,
    highlight = false,
    specialVal = false,
    unenumerable = true
    } = {})
{
    let json = '',
        type = '',
        parts = [],
        names = [],
        proto,
        circular = false;

    topObj = topObj || obj;
    let dbQuotes = keyQuotes ? '"' : '';

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
            if (str === '(...)' || str === '[circular]' || str === 'undefined' || str === 'Symbol')
            {
                return specialWrapper + strEscape(str) + wrapperEnd;
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

        json = '[';
        util.each(obj, val => parts.push(`${stringify(val, {visited, specialVal, simple, getterVal, keyQuotes, highlight, unenumerable})}`));
        json += parts.join(', ') + ']';
    } else if (isObj || isFn)
    {
        visited.push(obj);

        names = unenumerable ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        proto = Object.getPrototypeOf(obj);
        if (proto === Object.prototype || isFn || simple) proto = null;
        if (proto) proto = `${wrapKey('erudaProto')}: ${stringify(proto, {visited, specialVal, getterVal, topObj, keyQuotes, highlight, unenumerable})}`;
        names.sort(sortObjName);
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
                parts.push(`${key}: ${stringify(topObj[name], {visited, specialVal, getterVal, simple, keyQuotes, highlight, unenumerable})}`);
            });
            if (proto) parts.push(proto);
            json += parts.join(', ') + ' }';
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
    } else
    {
        try
        {
            visited.push(obj);

            json = '{ ';
            if (!simple) parts.push(`${wrapKey('erudaObjAbstract')}: "${type.replace(/(\[object )|]/g, '')}"`);
            names = unenumerable ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
            proto = Object.getPrototypeOf(obj);
            if (proto === Object.prototype || simple) proto = null;
            if (proto)
            {
                try
                {
                    proto = `${wrapKey('erudaProto')}: ${stringify(proto, {visited, specialVal, topObj, getterVal, keyQuotes, highlight, unenumerable})}`;
                } catch(e)
                {
                    proto = `${wrapKey('erudaProto')}: ${wrapStr(escapeJsonStr(e.message))}`;
                }
            }
            names.sort(sortObjName);
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
                parts.push(`${key}: ${stringify(topObj[name], {visited, specialVal, getterVal, simple, keyQuotes, highlight, unenumerable})}`);
            });
            if (proto) parts.push(proto);
            json += parts.join(',\n') + ' }';
        } catch (e) {
            json = wrapStr(obj);
        }
    }

    return json;
}

var escapeJsonStr = str => str.replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\f|\n|\r|\t/g, '');

var sortObjName = (a, b) =>
{
    let codeA = a.charCodeAt(0),
        codeB = b.charCodeAt(0);

    if (isLetter(codeA) && !isLetter(codeB)) return -1;
    if (!isLetter(codeA) && isLetter(codeB)) return 1;

    return a > b ? 1 : -1;
};

var isLetter = code => (code > 64 && code < 90) || (code > 96 && code < 123);
