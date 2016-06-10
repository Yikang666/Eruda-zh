import util from '../lib/util'
import highlight from '../lib/highlight.es6'
import beautify from 'js-beautify'

export default class Log extends util.Emitter
{
    constructor($el, parent)
    {
        super();

        util.evalCss(require('./Log.scss'));

        this._$el = $el;
        this._parent = parent;
        this._logs = [];
        this._renderLogs = [];
        this._tpl = require('./Log.hbs');
        this._filter = 'all';
        this._isUpdated = false;
        this._lastLog = {};
        this._timer = {};

        this._bindEvent();
    }
    clear()
    {
        this._logs = [];
        this._lastLog = {};
        this._isUpdated = true;

        return this.render();
    }
    input(jsCode)
    {
        if (util.startWith(jsCode, ':'))
        {
            this._runCmd(jsCode.slice(1));

            return this;
        } else if (util.startWith(jsCode, '/'))
        {
            return this.filter(new RegExp(util.escapeRegExp(jsCode.slice(1))));
        }

        this.insert({
            type: 'input',
            ignoreFilter: true,
            isCode: true,
            icon: 'chevron-right',
            src: jsCode,
            val: jsCode
        });

        try {
            this.output(evalJs(jsCode));
        } catch (e)
        {
            e.ignoreFilter = true;
            this.error(e);
        }

        return this;
    }
    output(val)
    {
        return this.insert({
            type: 'output',
            ignoreFilter: true,
            icon: 'chevron-left',
            src: util.isObj(val) ? extractObj(val) : val,
            val: transMsg(val)
        });
    }
    dir(obj)
    {
        var src = util.isObj(obj) ? extractObj(obj) : obj,
            msg;

        if (util.isObj(src))
        {
            msg = JSON.stringify(src, null, 4);
            msg = msg.replace(/erudaProto/g, '__proto__')
                     .replace(/erudaObjAbstract/g, '__abstract__');

        } else
        {
            msg = transMsg(src, true);
        }

        return this.insert({
            type: 'dir',
            isCode: true,
            src,
            val: msg
        });
    }
    log(...args)
    {
        return this.insert({
            type: 'log',
            src: extractSrc(args),
            val: transMultipleMsg(args)
        });
    }
    html(val)
    {
        return this.insert({
            type: 'html',
            ignoreFilter: true,
            val
        });
    }
    error(msg)
    {
        if (util.isUndef(msg)) return;

        if (!util.isErr(msg)) msg = new Error(msg);

        return this.insert({
            type: 'error',
            ignoreFilter: msg.ignoreFilter,
            src: {
                message: msg.message || '',
                stack: msg.stack
            },
            icon: 'times-circle',
            val: errToStr(msg)
        });
    }
    info(...args)
    {
        return this.insert({
            type: 'info',
            src: extractSrc(args),
            icon: 'info-circle',
            val: transMultipleMsg(args)
        });
    }
    warn(...args)
    {
        return this.insert({
            type: 'warn',
            src: extractSrc(args),
            icon: 'exclamation-triangle',
            val: transMultipleMsg(args)
        });
    }
    filter(type)
    {
        this._filter = type;
        this.emit('filter', type);
        this._isUpdated = true;
        return this.render();
    }
    help()
    {
        return this.html(helpMsg);
    }
    time(name)
    {
        this._timer[name] = util.now();

        return this;
    }
    timeEnd(name)
    {
        var startTime = this._timer[name];

        if (!startTime) return;
        delete this._timer[name];

        return this.html(`<div class="eruda-blue">${name}: ${util.now() - startTime}ms</div>`);
    }
    insert(log)
    {
        util.defaults(log, {
            type: 'log',
            isCode: false,
            ignoreFilter: false,
            val: '',
            showTimes: false,
            times: 1
        });

        log.src = log.src || log.val;

        if (log.isCode)
        {
            log.val = highlight(beautify(log.val), 'js');
        } else if (log.type != 'html')
        {
            log.val = txtToHtml(log.val);
        }

        var lastLog = this._lastLog;

        if (log.type !== 'html' &&
            lastLog.type === log.type &&
            lastLog.val === log.val)
        {
            lastLog.times++;
            lastLog.showTimes = true;
        } else
        {
            this._logs.push(log);
            this._lastLog = log;
        }

        this.emit('insert', log);

        this._isUpdated = true;
        return this.render();
    }
    _bindEvent()
    {
        var self = this;

        this._$el.on('click', '.eruda-log-item', function ()
        {
            var idx = util.$(this).data('idx'),
                src = self._renderLogs[idx].src;

            try {
                if (!util.isObj(src)) src = JSON.parse(src);
                self.emit('viewJson', src);
            } catch (e) {}
        });
    }
    _runCmd(cmd)
    {
        switch (cmd.trim())
        {
            case '$': return this._loadJs('jQuery');
            case '_': return this._loadJs('underscore');
            default:
                this.warn('Unknown command').help();
        }
    }
    _loadJs(name)
    {
        util.loadJs(libraries[name], (result) =>
        {
            if (result) return this.log(`${name} is loaded`);

            this.warn(`Failed to load ${name}`);
        });
    }
    render()
    {
        if (!this._parent.active || !this._isUpdated) return;
        this._isUpdated = false;

        var logs = this._renderLogs = this._filterLogs(this._logs);

        this._renderHtml(this._tpl({logs: logs}));
        this._scrollToBottom();
    }
    _renderHtml(html)
    {
        if (html === this._lastHtml) return;
        this._lastHtml = html;
        this._$el.html(html);
    }
    _filterLogs(logs)
    {
        var filter = this._filter;

        if (filter === 'all') return logs;

        var isRegexp = util.isRegExp(filter);

        return logs.filter((val) =>
        {
            if (isRegexp) return filter.test(val.val);

            return val.ignoreFilter || val.type === filter;
        });
    }
    _scrollToBottom()
    {
        var el = this._$el.get(0);

        el.scrollTop = el.scrollHeight;
    }
}

var cmdList = require('./cmdList.json'),
    helpMsg = require('./help.hbs')({commands: cmdList}),
    libraries = require('./libraries.json');

var regJsUrl = /https?:\/\/([0-9.\-A-Za-z]+)(?::(\d+))?\/[A-Z.a-z0-9/]*\.js/g;

var evalJs = jsInput =>
{
    var ret;

    try {
        ret = eval.call(window, `(${jsInput})`);
    } catch (e) {
        ret = eval.call(window, jsInput);
    }

    return ret;
};

function errToStr(err)
{
    var lines = err.stack.split('\n'),
        msg = `${err.message || lines[0]}<br/>`,
        stack = `<div class="eruda-stack">${lines.slice(1).join('<br/>')}</div>`;

    return msg + stack.replace(regJsUrl, match => `<a href="${match}" target="_blank">${match}</a>`);
}

function transMsg(msg, noEscape)
{
    if (util.isEl(msg))
    {
        msg = msg.outerHTML;
    } else if (util.isFn(msg))
    {
        msg = msg.toString();
    } else if (util.isObj(msg))
    {
        msg = `${util.upperFirst(typeof msg)} ${JSON.stringify(extractObj(msg, true))}`;
    } else if (util.isUndef(msg))
    {
        msg = 'undefined';
    } else if (msg === null)
    {
        msg = 'null';
    }

    msg = util.toStr(msg);

    if (noEscape) return msg;

    return util.escape(msg);
}

function extractSrc(args)
{
    if (args.length !== 1) return args;

    return util.isObj(args[0]) ? extractObj(args[0]) : args[0];
}

var extractObj = (obj, simple) => JSON.parse(stringify(obj, null, obj, simple));

// Modified from: https://jsconsole.com/
function stringify(obj, visited, topObj, simple)
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
                parts.push(`"${escapeJsonStr(name)}": ${stringify(obj[name], visited, null, simple)}`);
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
                let val = topObj[name];

                try
                {
                    parts.push(`"${escapeJsonStr(name)}": ${stringify(val, visited, null, simple)}`);
                } catch (e)
                {
                    parts.push(`"${escapeJsonStr(name)}": "${escapeJsonStr(e.message)}"`);
                }
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


var transMultipleMsg = args => args.map(val => transMsg(val)).join(' ');

var txtToHtml = str => str.replace(/\n/g, '<br/>')
                          .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
