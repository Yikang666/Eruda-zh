// Simple version for stringify, used for displaying object abstract.
import util from './util'

// Modified from: https://jsconsole.com/
export default function getAbstract(obj, {
    visited = [],
    topObj,
    level = 0,
    getterVal = false,
    unenumerable = true
    } = {})
{
    let json = '',
        type = '',
        keyNum = 5,
        parts = [],
        names = [],
        objEllipsis = '',
        circular = false,
        i, len;

    topObj = topObj || obj;

    let passOpts = {
            visited, getterVal,
            unenumerable,
            level: level + 1
        };
    let doStringify = level === 0;

    let keyWrapper = '<span style="color: #a71d5d;">',
        fnWrapper = '<span style="color: #a71d5d;">',
        numWrapper = '<span style="color: #0086b3;">',
        nullWrapper = '<span style="color: #0086b3;">',
        strWrapper = '<span style="color: #183691;">',
        boolWrapper = '<span style="color: #0086b3;">',
        specialWrapper = '<span style="color: #707d8b;">',
        strEscape = str => util.escape(str),
        wrapperEnd = '</span>';

    let wrapKey = key => keyWrapper + strEscape(key) + wrapperEnd,
        wrapNum = num => numWrapper + num + wrapperEnd,
        wrapBool = bool => boolWrapper + bool + wrapperEnd,
        wrapNull = str => nullWrapper + str + wrapperEnd;

    function wrapStr(str)
    {
        str = util.toStr(str);

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

        return strWrapper + strEscape(`"${str}"`) + wrapperEnd;
    }
    try {
        type = ({}).toString.call(obj);
    } catch (e)
    {
        type = '[object Object]';
    }

    let isStr = (type == '[object String]'),
        isArr = (type == '[object Array]'),
        isObj = (type == '[object Object]'),
        isNum = (type == '[object Number]'),
        isSymbol = (type == '[object Symbol]'),
        isBool = (type == '[object Boolean]');

    for (i = 0, len = visited.length; i < len; i++)
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
            util.each(obj, val => parts.push(`${getAbstract(val, passOpts)}`));
            json += parts.join(', ') + ']';
        } else
        {
            json = wrapStr(`Array[${obj.length}]`);
        }
    } else if (isObj)
    {
        visited.push(obj);

        if (canBeProto(obj))
        {
            obj = Object.getPrototypeOf(obj);
        }

        names = unenumerable ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        if (doStringify)
        {
            i = 1;
            json = '{ ';
            util.each(names, name =>
            {
                if (i > keyNum)
                {
                    objEllipsis = '...';
                    return;
                }
                let key = wrapKey(escapeJsonStr(name));

                if (!getterVal)
                {
                    let descriptor = Object.getOwnPropertyDescriptor(obj, name);
                    if (descriptor.get)
                    {
                        parts.push(`${key}: ${wrapStr('(...)')}`);
                        i++;
                        return;
                    }
                }
                if (typeof topObj[name] === 'function') return;
                parts.push(`${key}: ${getAbstract(topObj[name], passOpts)}`);
                i++;
            });
            json += parts.join(', ') + objEllipsis + ' }';
        } else
        {
            json = wrapStr('Object');
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
    } else if (type === '[object HTMLDocument]' && level > 1)
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
            }

            if (doStringify)
            {
                i = 1;
                json = '{ ';
                names = unenumerable ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
                util.each(names, name =>
                {
                    if (i > keyNum)
                    {
                        objEllipsis = '...';
                        return;
                    }
                    let key = wrapKey(escapeJsonStr(name));

                    if (!getterVal)
                    {
                        let descriptor = Object.getOwnPropertyDescriptor(obj, name);
                        if (descriptor.get)
                        {
                            parts.push(`${key}: ${wrapStr('(...)')}`);
                            i++;
                            return;
                        }
                    }
                    if (typeof topObj[name] === 'function') return;
                    parts.push(`${key}: ${getAbstract(topObj[name], passOpts)}`);
                    i++;
                });
                json += parts.join(', ') + objEllipsis + ' }';
            } else
            {
                json = wrapStr(obj);
            }
        } catch (e)
        {
            json = wrapStr(obj);
        }
    }

    return json;
}

const SPECIAL_VAL = ['(...)', 'undefined', 'Symbol', 'Object'];

var escapeJsonStr = str => str.replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\f|\n|\r|\t/g, '');

function canBeProto(obj)
{
    let emptyObj = util.isEmpty(Object.getOwnPropertyNames(obj)),
        proto = Object.getPrototypeOf(obj);

    return emptyObj && proto && proto !== Object.prototype;
}
