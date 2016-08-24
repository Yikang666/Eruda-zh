import util from './util'

// Modified from: https://jsconsole.com/
export default function stringify(obj, {
    visited = [],
    topObj,
    simple = false,
    keyQuotes = true,
    getterVal = false,
    highlight = false
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
        strEscape = str => str,
        wrapperEnd = '';

    if (highlight)
    {
        keyWrapper = '<span style="color: #a71d5d;">';
        numWrapper = '<span style="color: #0086b3;">';
        nullWrapper = '<span style="color: #0086b3;">';
        strWrapper = '<span style="color: #183691;">';
        boolWrapper = '<span style="color: #0086b3;">';
        strEscape = str => util.escape(str);
        wrapperEnd = '</span>'
    }

    let wrapKey = key => keyWrapper + dbQuotes + strEscape(key) + dbQuotes + wrapperEnd,
        wrapNum = num => numWrapper + num + wrapperEnd,
        wrapStr = str => strWrapper + strEscape(str) + wrapperEnd,
        wrapBool = bool => boolWrapper + bool + wrapperEnd,
        wrapNull = str => nullWrapper + str + wrapperEnd;

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
        json = wrapStr('"[circular]"');
    } else if (isStr)
    {
        json = wrapStr(`"${escapeJsonStr(obj)}"`);
    } else if (isArr)
    {
        visited.push(obj);

        json = '[';
        util.each(obj, val => parts.push(`${stringify(val, {visited, simple, getterVal, keyQuotes, highlight})}`));
        json += parts.join(', ') + ']';
    } else if (isObj || isFn)
    {
        visited.push(obj);

        names = Object.getOwnPropertyNames(obj);
        proto = Object.getPrototypeOf(obj);
        if (proto === Object.prototype || isFn || simple) proto = null;
        if (proto) proto = `${wrapKey('erudaProto')}: ${stringify(proto, {visited, getterVal, topObj, keyQuotes, highlight})}`;
        names.sort(sortObjName);
        if (isFn)
        {
            // We don't need these properties to display for functions.
            names = names.filter(val => ['arguments', 'caller', 'name', 'length', 'prototype'].indexOf(val) < 0);
        }
        if (names.length === 0 && isFn)
        {
            json = wrapStr(`"${escapeJsonStr(obj.toString())}"`);
        } else
        {
            json = '{';
            if (isFn)
            {
                // Function length is restricted to 500 for performance reason.
                var fnStr = obj.toString();
                if (fnStr.length > 500) fnStr = fnStr.slice(0, 500) + '...';
                parts.push(`${wrapKey('erudaObjAbstract')}: ${wrapStr('"' + escapeJsonStr(fnStr) + '"')}`);
            }
            util.each(names, name =>
            {
                let key = wrapKey(escapeJsonStr(name));

                if (!getterVal)
                {
                    let descriptor = Object.getOwnPropertyDescriptor(obj, name);
                    if (descriptor.get)
                    {
                        return parts.push(`${key}: "(...)"`);
                    }
                }
                parts.push(`${key}: ${stringify(topObj[name], {visited, getterVal, simple, keyQuotes, highlight})}`);
            });
            if (proto) parts.push(proto);
            json += parts.join(', ') + '}';
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
        json = wrapStr('"Symbol"');
    } else if (obj === undefined)
    {
        json = wrapStr('"undefined"');
    } else if (type === '[object HTMLAllCollection]')
    {
        // https://docs.webplatform.org/wiki/dom/HTMLAllCollection
        // Might cause a performance issue when stringify a dom element.
        json = '"[object HTMLAllCollection]"';
    } else
    {
        try
        {
            visited.push(obj);

            json = '{\n';
            if (!simple) parts.push(`${wrapKey('erudaObjAbstract')}: "${type.replace(/(\[object )|]/g, '')}"`);
            names = Object.getOwnPropertyNames(obj);
            proto = Object.getPrototypeOf(obj);
            if (proto === Object.prototype || simple) proto = null;
            if (proto)
            {
                try
                {
                    proto = `${wrapKey('erudaProto')}: ${stringify(proto, {visited, topObj, getterVal, keyQuotes, highlight})}`;
                } catch(e)
                {
                    proto = `${wrapKey('erudaProto')}: ${wrapStr('"' + escapeJsonStr(e.message) + '"')}`;
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
                        return parts.push(`${key}: "(...)"`);
                    }
                }
                parts.push(`${key}: ${stringify(topObj[name], {visited, getterVal, simple, keyQuotes, highlight})}`);
            });
            if (proto) parts.push(proto);
            json += parts.join(',\n') + '\n}';
        } catch (e) {
            json = wrapStr(`"${obj}"`);
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
