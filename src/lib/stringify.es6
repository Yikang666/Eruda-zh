import util from './util'

// Modified from: https://jsconsole.com/
export default function stringify(obj, {
    visitor = new Visitor(),
    topObj,
    level = 0,
    circularMarker = false,
    getterVal = false,
    unenumerable = true
    } = {})
{
    let json = '',
        type,
        parts = [],
        names = [],
        proto,
        objAbstract,
        circularObj,
        allKeys, keys,
        id = '';

    topObj = topObj || obj;

    let passOpts = {visitor, getterVal, unenumerable, level: level + 1},
        passProtoOpts = {visitor, getterVal, topObj, unenumerable, level: level + 1};

    let wrapKey = key => `"${util.escapeJsonStr(key)}"`,
        wrapStr = str => `"${util.escapeJsonStr(util.toStr(str))}"`;

    type = getType(obj);

    var isFn = (type == '[object Function]'),
        isStr = (type == '[object String]'),
        isArr = (type == '[object Array]'),
        isObj = (type == '[object Object]'),
        isNum = (type == '[object Number]'),
        isSymbol = (type == '[object Symbol]'),
        isBool = (type == '[object Boolean]');

    circularObj = visitor.check(obj);

    if (circularObj)
    {
        json = stringify(circularObj.abstract, {circularMarker: true});
    } else if (isStr)
    {
        json = wrapStr(obj);
    } else if (isArr || isObj || isFn)
    {
        id = visitor.visit(obj);

        if (canBeProto(obj))
        {
            obj = Object.getPrototypeOf(obj);
            id = visitor.visit(obj);
        }

        allKeys = Object.getOwnPropertyNames(obj);
        keys = Object.keys(obj);
        names = unenumerable ? allKeys : keys;
        proto = Object.getPrototypeOf(obj);
        if (circularMarker && proto === Object.prototype) proto = null;
        if (proto)
        {
            proto = `${wrapKey('erudaProto')}: ${stringify(proto, passProtoOpts)}`;
        }
        names.sort(sortObjName);
        if (isFn)
        {
            // We don't need these properties to display for functions.
            names = names.filter(val => ['arguments', 'caller'].indexOf(val) < 0);
        }
        json = '{ ';
        objAbstract = getObjAbstract(obj);
        visitor.updateAbstract(id, {
            erudaObjAbstract: objAbstract,
            erudaCircular: id
        });
        parts.push(`${wrapKey('erudaObjAbstract')}: ${wrapStr(objAbstract)}`);
        if (!circularMarker) parts.push(`"erudaId": "${id}"`);
        util.each(names, objIteratee);
        if (proto) parts.push(proto);
        json += parts.join(', ') + ' }';
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
            id = visitor.visit(obj);
            if (canBeProto(obj))
            {
                obj = Object.getPrototypeOf(obj);
                id = visitor.visit(obj);
            }

            json = '{ ';
            objAbstract = getObjAbstract(obj);
            visitor.updateAbstract(id, {
                erudaObjAbstract: objAbstract,
                erudaCircular: id
            });
            parts.push(`${wrapKey('erudaObjAbstract')}: ${wrapStr(objAbstract)}`);
            if (!circularMarker) parts.push(`"erudaId": "${id}"`);
            allKeys = Object.getOwnPropertyNames(obj);
            keys = Object.keys(obj);
            names = unenumerable ? allKeys : keys;
            proto = Object.getPrototypeOf(obj);
            if (circularMarker && proto === Object.prototype) proto = null;
            if (proto)
            {
                try
                {
                    proto = `${wrapKey('erudaProto')}: ${stringify(proto, passProtoOpts)}`;
                } catch(e)
                {
                    proto = `${wrapKey('erudaProto')}: ${wrapStr(e.message)}`;
                }
            }
            names.sort(sortObjName);
            util.each(names, objIteratee);
            if (proto) parts.push(proto);
            json += parts.join(', ') + ' }';
        } catch (e)
        {
            json = wrapStr(obj);
        }
    }

    function objIteratee(name)
    {
        let unenumerable = !util.contain(keys, name) ? 'erudaUnenumerable ' : '',
            key = wrapKey(unenumerable + name),
            getKey = wrapKey(unenumerable + 'get ' + name),
            setKey = wrapKey(unenumerable + 'set ' + name);

        let descriptor = Object.getOwnPropertyDescriptor(obj, name),
            hasGetter = descriptor && descriptor.get,
            hasSetter = descriptor && descriptor.set;

        if (!getterVal && hasGetter)
        {
            parts.push(`${key}: "(...)"`);
            parts.push(`${getKey}: ${stringify(descriptor.get, passOpts)}`);
        } else
        {
            let val;
            try {
                val = topObj[name];
            } catch(e)
            {
                val = e.message;
            }
            parts.push(`${key}: ${stringify(val, passOpts)}`);
        }
        if (hasSetter)
        {
            parts.push(`${setKey}: ${stringify(descriptor.set, passOpts)}`);
        }
    }

    return json;
}

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

    return extractFnHead(fnStr).replace('function', '');
}

function canBeProto(obj)
{
    let emptyObj = util.isEmpty(Object.getOwnPropertyNames(obj)),
        proto = Object.getPrototypeOf(obj);

    return emptyObj && proto && proto !== Object.prototype;
}

function getObjAbstract(obj)
{
    if (util.isArr(obj)) return `Array[${obj.length}]`;
    if (util.isFn(obj)) return getFnAbstract(obj);
    if (util.isRegExp(obj)) return obj.toString();

    let type = getType(obj);

    return type.replace(/(\[object )|]/g, '')
}

function getType(obj)
{
    let type;

    try {
        type = ({}).toString.call(obj);
    } catch (e)
    {
        type = '[object Object]';
    }

    return type;
}

class Visitor
{
    constructor()
    {
        this._visited = [];
        this._map = {};
    }
    visit(val)
    {
        let id = util.uniqId('erudaJson');

        this._visited.push({id, val, abstract: {}});
        this._map[id] = util.last(this._visited);

        return id;
    }
    check(val)
    {
        let visited = this._visited;

        for (let i = 0, len = visited.length; i < len; i++)
        {
            if (val === visited[i].val) return visited[i];
        }

        return false;
    }
    update(id, data)
    {
        util.extend(this._map[id], data);
    }
    updateAbstract(id, abstract)
    {
        this.update(id, {abstract});
    }
}
