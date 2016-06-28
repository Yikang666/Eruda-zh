import util from './util'

// Modified from: https://jsconsole.com/
export default function stringify(obj, visited, topObj, simple)
{
    let json = '',
        type = '',
        parts = [],
        names = [],
        proto,
        circular = false;

    visited = visited || [];
    topObj = topObj || obj;

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
        json = '"[circular]"';
    } else if (isStr)
    {
        json = `"${escapeJsonStr(obj)}"`;
    } else if (isArr)
    {
        visited.push(obj);

        json = '[';
        util.each(obj, val => parts.push(`${stringify(val, visited, null, simple)}`));
        json += parts.join(', ') + ']';
    } else if (isObj || isFn)
    {
        visited.push(obj);

        names = Object.getOwnPropertyNames(obj);
        proto = Object.getPrototypeOf(obj);
        if (proto === Object.prototype || isFn || simple) proto = null;
        if (proto) proto = `"erudaProto": ${stringify(proto, visited, topObj)}`;
        names.sort(sortObjName);
        if (isFn)
        {
            // We don't these properties to be display for functions.
            names = names.filter(val => ['arguments', 'caller', 'name', 'length', 'prototype'].indexOf(val) < 0);
        }
        if (names.length === 0 && isFn)
        {
            json = `"${escapeJsonStr(obj.toString())}"`;
        } else
        {
            json = '{';
            if (isFn)
            {
                // Function length is restricted to 500 for performance reason.
                var fnStr = obj.toString();
                if (fnStr.length > 500) fnStr = fnStr.slice(0, 500) + '...';
                parts.push(`"erudaObjAbstract": "${escapeJsonStr(fnStr)}"`);
            }
            util.each(names, name =>
            {
                parts.push(`"${escapeJsonStr(name)}": ${stringify(topObj[name], visited, null, simple)}`);
            });
            if (proto) parts.push(proto);
            json += parts.join(', ') + '}';
        }
    } else if (isNum)
    {
        json = obj + '';
        if (util.endWith(json, 'Infinity') || json === 'NaN') json = `"${json}"`;
    } else if (isBool)
    {
        json = obj ? 'true' : 'false';
    } else if (obj === null)
    {
        json = 'null';
    } else if (isSymbol)
    {
        json = '"Symbol"';
    } else if (obj === undefined)
    {
        json = '"undefined"';
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
            if (!simple) parts.push(`"erudaObjAbstract": "${type.replace(/(\[object )|]/g, '')}"`);
            names = Object.getOwnPropertyNames(obj);
            proto = Object.getPrototypeOf(obj);
            if (proto === Object.prototype || simple) proto = null;
            if (proto)
            {
                try
                {
                    proto = `"erudaProto": ${stringify(proto, visited, topObj)}`;
                } catch(e)
                {
                    proto = `"erudaProto": "${escapeJsonStr(e.message)}"`;
                }
            }
            names.sort(sortObjName);
            util.each(names, name =>
            {
                parts.push(`"${escapeJsonStr(name)}": ${stringify(topObj[name], visited, null, simple)}`);
            });
            if (proto) parts.push(proto);
            json += parts.join(',\n') + '\n}';
        } catch (e) {
            json = `"${obj}"`;
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
