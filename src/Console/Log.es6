import util from '../lib/util'
import stringify from '../lib/stringify.es6'
import highlight from '../lib/highlight.es6'
import beautify from 'js-beautify'

export default class Log
{
    constructor({
        type = 'log',
        args = [],
        idx = 0,
        displayHeader = false,
        ignoreFilter = false})
    {
        this.type = type;
        this.args = args;
        this.idx = idx;
        this.displayHeader = displayHeader;
        this.ignoreFilter = false;

        if (displayHeader)
        {
            this.time = getCurTime();
            this.from = getFrom();
        }
    }
    get formattedMsg()
    {
        if (!this._formattedMsg) this._formatMsg();

        return this._formattedMsg;
    }
    _needSrc()
    {
        let {type, args} = this;

        if (type === 'html') return false;

        if (args.length === 1)
        {
            let arg = args[0];
            if (util.isStr(arg)) return false;
            if (util.isBool(arg)) return false;
            if (util.isNum(arg)) return false;
        }

        return true;
    }
    _formatMsg()
    {
        let {type, idx, displayHeader, time, from, args} = this;

        if (this._needSrc())
        {
            this.src = extractObj(args.length === 1 && util.isObj(args[0]) ? args[0] : args, false);
        }

        let msg = '', icon;

        switch (type)
        {
            case 'log':
                msg = formatMsg(args);
                break;
            case 'info':
                icon = 'info-circle';
                msg = formatMsg(args);
                break;
            case 'warn':
                icon = 'exclamation-triangle';
                msg = formatMsg(args);
                break;
            case 'error':
                args = substituteStr(args);
                let err = args[0];
                icon = 'times-circle';
                err = util.isErr(err) ? err : new Error(err);
                msg = formatErr(err);
                break;
            case 'table':
                msg = formatTable(args);
                break;
            case 'html':
                msg = args[0];
                break;
            case 'input':
                msg = formatJs(args[0]);
                icon = 'chevron-right';
                break;
            case 'output':
                msg = formatMsg(args);
                icon = 'chevron-left';
                break;
        }

        msg = render({msg, type, icon, idx, displayHeader, time, from});

        delete this.args;
        this._formattedMsg = msg;
    }
}

function formatTable(args)
{
    let table = args[0],
        ret = '',
        filter = args[1],
        columns = [];

    if (util.isStr(filter)) filter = util.toArr(filter);
    if (!util.isArr(filter)) filter = null;

    if (!util.isArr(table)) return formatMsg(args);

    table.forEach(val =>
    {
        if (!util.isObj(val)) return;
        columns = columns.concat(Object.getOwnPropertyNames(val));
    });
    columns = util.unique(columns);
    if (filter) columns = columns.filter(val => util.contain(filter, val));
    if (util.isEmpty(columns)) return formatMsg(args);

    ret += '<table><thead><tr><th>(index)</th>';
    columns.forEach(val => ret += `<th>${val}</th>`);
    ret += '</tr></thead><tbody>';

    table.forEach((obj, idx) =>
    {
        if (!util.isObj(obj)) return;
        ret += `<tr><td>${idx}</td>`;
        columns.forEach(column => ret += `<td>${obj[column] || ''}</td>`);
        ret += '</tr>'
    });

    ret += '</tbody></table>';

    return ret;
}

var regJsUrl = /https?:\/\/([0-9.\-A-Za-z]+)(?::(\d+))?\/[A-Z.a-z0-9/]*\.js/g;

function formatErr(err)
{
    var lines = err.stack.split('\n'),
        msg = `${err.message || lines[0]}<br/>`;

    lines = lines.filter(val => val.indexOf('eruda') < 0);

    var stack = `<div class="eruda-stack">${lines.slice(1).join('<br/>')}</div>`;

    return msg + stack.replace(regJsUrl, match => `<a href="${match}" target="_blank">${match}</a>`);
}

function formatJs(code)
{
    return highlight(beautify(code), 'js');
}

function formatMsg(args)
{
    args = substituteStr(args);

    for (let i = 0, len = args.length; i < len; i++)
    {
        let val = args[i];

        if (util.isEl(val))
        {
            args[i] = formatEl(val);
        } else if (util.isFn(val))
        {
            args[i] = formatFn(val);
        } else if (util.isObj(val))
        {
            args[i] = formatObj(val);
        }else if (util.isUndef(val))
        {
            args[i] = 'undefined';
        } else if (util.isNull(val))
        {
            args[i] = 'null';
        } else
        {
            val = util.toStr(val);
            if (i !== 0) val = util.escape(val);
            args[i] = val;
        }
    }

    return args.join(' ');
}

function substituteStr(args)
{
    if (!util.isStr(args[0]) || args.length === 1) return args;

    var str = util.escape(args[0]),
        isInCss = false,
        newStr = '';

    args.shift();

    for (let i = 0, len = str.length; i < len; i++)
    {
        let c = str[i];

        if (c === '%' && args.length !== 0)
        {
            i++;
            let arg = args.shift();
            switch (str[i])
            {
                case 'i':
                case 'd':
                    newStr += util.toInt(arg);
                    break;
                case 'f':
                    newStr += util.toNum(arg);
                    break;
                case 's':
                    newStr += util.toStr(arg);
                    break;
                case 'O':
                    if (util.isObj(arg))
                    {
                        newStr += stringify(arg, {simple: true, keyQuotes: false, highlight: true});
                    }
                    break;
                case 'o':
                    if (util.isEl(arg))
                    {
                        newStr += formatEl(arg);
                    } else if (util.isObj(arg))
                    {
                        newStr += stringify(arg, {simple: true, keyQuotes: false, highlight: true});
                    }
                    break;
                case 'c':
                    if (isInCss) newStr += '</span>';
                    isInCss = true;
                    newStr += `<span style="${arg}">`;
                    break;
                default:
                    i--;
                    args.unshift(arg);
                    newStr += c;
            }
        } else
        {
            newStr += c;
        }
    }
    if (isInCss) newStr += '</span>';

    args.unshift(newStr);

    return args;
}

function formatObj(val)
{
    return `${getObjType(val)} ${stringify(val, {keyQuotes: false, simple: true, highlight: true})}`;
}

function formatFn(val)
{
    return val.toString();
}

function formatEl(val)
{
    return `<pre>${highlight(beautify.html(val.outerHTML), 'html')}</pre>`;
}

function getCurTime()
{
    let d = new Date();

    return `${padZero(d.getHours())}:${padZero(d.getMinutes())}:${padZero(d.getSeconds())}`;
}

function getFrom()
{
    let e = new Error(),
        ret = '',
        lines = e.stack.split('\n');

    for (let i = 0, len = lines.length; i < len; i++)
    {
        ret = lines[i];
        if (ret.indexOf('winConsole') > -1 && i < len - 1)
        {
            ret = lines[i+1];
            break;
        }
    }

    return ret;
}

function getObjType(obj)
{
    if (obj.constructor) return obj.constructor.name;

    return util.upperFirst(({}).toString.call(obj).replace(/(\[object )|]/g, ''));
}

var padZero = (num) => util.lpad(util.toStr(num), 2, '0');

var tpl = require('./Log.hbs');
var render = data => tpl(data);

var extractObj = (obj, simple) => JSON.parse(stringify(obj, {simple}));
