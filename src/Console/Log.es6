import util from '../lib/util'
import stringify from '../lib/stringify.es6'
import highlight from '../lib/highlight.es6'
import beautify from 'js-beautify'

export default class Log
{
    constructor({type, args, idx, header})
    {
        this._type = type;
        this._args = args;
        this._idx = idx;
        this._header = header;
        this._ignoreFilter = false;

        this._preProcess();
    }
    get formattedMsg()
    {
        if (!this._formattedMsg) this._formatMsg();

        return this._formattedMsg;
    }
    get ignoreFilter()
    {
        return this._ignoreFilter;
    }
    get type()
    {
        return this._type;
    }
    _preProcess()
    {
        switch (this._type)
        {
            case 'input':
            case 'output':
                this._ignoreFilter = true;
                break;
        }

        if (this._header)
        {
            this._time = getCurTime();
            this._from = getFrom();
        }
    }
    _formatMsg()
    {
        let type = this._type,
            idx = this._idx,
            hasHeader = this._header,
            time = this._time,
            from = this._from,
            args = this._args;

        let msg = '', icon;

        switch (type)
        {
            case 'log':
            case 'info':
            case 'warn':
                msg = formatMsg(args);
                break;
            case 'error':
                let err = args[0];
                icon = 'times-circle';
                err = util.isErr(args[0]) ? args[0] : new Error(err);
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

        msg = render({msg, type, icon, idx, hasHeader, time, from});
        this.src = stringify(this._args);

        delete this._args;
        this._formattedMsg = msg;
    }
}

function formatTable(args)
{
    return '';
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
    if (util.isStr(args[0])) args = substituteStr(args);

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
            args[i] = util.escape(util.toStr(val));
        }
    }

    return args.join(' ');
}

function substituteStr(args)
{
    var str = args[0],
        newStr = '';

    args.shift();

    for (let i = 0, len = str.length; i < len; i++)
    {
        let c = str[i];

        if (c === '%')
        {
            i++;
            let arg = args.shift();
            switch (str[i])
            {
                case 'd':
                    newStr += util.toNum(arg);
                    break;
                case 's':
                    newStr += util.toStr(arg);
                    break;
                case 'o':
                    try {
                        newStr += JSON.stringify(arg);
                    } catch (e) {}
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

    args.unshift(newStr);

    return args;
}

function formatObj(val)
{
    return `${util.upperFirst(typeof val)} ${JSON.stringify(extractObj(val, true))}`;
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

var padZero = (num) => util.lpad(util.toStr(num), 2, '0');

var tpl = require('./Log.hbs');
var render = data => tpl(data);

var extractObj = (obj, simple) => JSON.parse(stringify(obj, null, obj, simple));
