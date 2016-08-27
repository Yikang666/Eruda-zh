import util from '../lib/util'
import stringify from '../lib/stringify.es6'
import highlight from '../lib/highlight.es6'
import beautify from 'js-beautify'
import JsonViewer from '../lib/JsonViewer.es6'

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
        this.count = 1;
        this.displayHeader = displayHeader;
        this.ignoreFilter = ignoreFilter;

        if (displayHeader)
        {
            this.time = getCurTime();
            this.from = getFrom();
        }

        this._formatMsg();
    }
    addCount()
    {
        this.count++;
        let count = this.count,
            msg = this.formattedMsg;
        if (count === 2) msg = msg.replace('eruda-count eruda-hidden', 'eruda-count');
        msg = msg.replace(/data-mark="count">\d*/, 'data-mark="count">' + count);

        this.formattedMsg = msg;

        return this;
    }
    updateTime(time)
    {
        let msg = this.formattedMsg;

        if (this.time)
        {
            msg = msg.replace(/data-mark="time">(.*?)</, `data-mark="time">${time}<`);
            this.time = time;
            this.formattedMsg = msg;
        }

        return this;
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
            if (util.isNull(arg)) return false;
            if (util.isUndef(arg)) return false;
        }

        return true;
    }
    _formatMsg()
    {
        let {type, idx, displayHeader, time, from, args} = this;

        if (this._needSrc())
        {
            this.src = extractObj(args.length === 1 && util.isObj(args[0]) ? args[0] : args, {simple: false});
        }

        let msg = '', icon;

        switch (type)
        {
            case 'log':
                msg = formatMsg(args);
                break;
            case 'debug':
                msg = formatMsg(args);
                break;
            case 'dir':
                msg = formatDir(args);
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
                err = util.isErr(err) ? err : new Error(formatMsg(args));
                this.src = err;
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

        this.value = msg;
        msg = render({msg, type, icon, idx, displayHeader, time, from});

        delete this.args;
        this.formattedMsg = msg;
    }
    static click(type, log, $el)
    {
        switch (type)
        {
            case 'log':
            case 'warn':
            case 'info':
            case 'debug':
            case 'output':
                return 'viewSrc';
            case 'error':
                $el.find('.eruda-stack').toggleClass('eruda-hidden');
                break;
            case 'table':
            case 'dir':
                if (log.src)
                {
                    let $json = $el.find('.eruda-json');
                    if ($json.hasClass('eruda-hidden'))
                    {
                        if ($json.data('init') !== 'true')
                        {
                            new JsonViewer(log.src, $json);
                            $json.data('init', 'true');
                        }
                        $json.rmClass('eruda-hidden');
                    } else
                    {
                        $json.addClass('eruda-hidden');
                    }
                }
                break;
        }

        return 'handled';
    }
}

// Looks like es6 doesn't support static properties yet.
Log.showGetterVal = false;
Log.showUnenumerable = true;

function stringifyWrapper(obj, options = {})
{
    util.defaults(options, {
        simple: true,
        highlight: true,
        keyQuotes: false,
        specialVal: true,
        getterVal: Log.showGetterVal,
        unenumerable: Log.showUnenumerable
    });

    return stringify(obj, options);
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
    ret += '<div class="eruda-json eruda-hidden"></div>';

    return ret;
}

var regJsUrl = /https?:\/\/([0-9.\-A-Za-z]+)(?::(\d+))?\/[A-Z.a-z0-9/]*\.js/g,
    regErudaJs = /eruda(\.min)?\.js/;

function formatErr(err)
{
    var lines = err.stack.split('\n'),
        msg = `${err.message || lines[0]}<br/>`;

    lines = lines.filter(val => !regErudaJs.test(val));

    var stack = `<div class="eruda-stack eruda-hidden">${lines.slice(1).join('<br/>')}</div>`;

    return msg + stack.replace(regJsUrl, match => `<a href="${match}" target="_blank">${match}</a>`);
}

function formatJs(code)
{
    return highlight(beautify(code), 'js');
}

function formatMsg(args, {htmlForEl = true} = {})
{
    args = substituteStr(args);

    for (let i = 0, len = args.length; i < len; i++)
    {
        let val = args[i];

        if (util.isEl(val) && htmlForEl)
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

function formatDir(args)
{
    let msg = formatMsg(args, {
        htmlForEl: false
    });

    return msg + '<div class="eruda-json eruda-hidden"></div>'
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
                        newStr += stringifyWrapper(arg);
                    }
                    break;
                case 'o':
                    if (util.isEl(arg))
                    {
                        newStr += formatEl(arg);
                    } else if (util.isObj(arg))
                    {
                        newStr += stringifyWrapper(arg);
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
    return `${getObjType(val)} ${stringifyWrapper(val)}`;
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
    if (obj.constructor && obj.constructor.name) return obj.constructor.name;

    return util.upperFirst(({}).toString.call(obj).replace(/(\[object )|]/g, ''));
}

var padZero = (num) => util.lpad(util.toStr(num), 2, '0');

var tpl = require('./Log.hbs');
var render = data => tpl(data);

function extractObj(obj, options = {})
{
    util.defaults(options, {
        highlight: false,
        keyQuotes: true,
        specialVal: false
    });

    return JSON.parse(stringifyWrapper(obj, options));
}
