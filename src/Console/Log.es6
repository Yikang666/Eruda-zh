import util from '../lib/util'
import highlight from '../lib/highlight.es6'
import beautify from 'js-beautify'

require('./Log.scss');

export default class Log extends util.Emitter
{
    constructor($el, parent)
    {
        super();

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
            msg = util.isObj(src) ? JSON.stringify(src, null, 4) : transMsg(src, true);

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

        this._$el.html(this._tpl({logs: logs}));
        this._scrollToBottom();
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

var evalJs = jsInput => eval.call(window, jsInput);

function errToStr(err)
{
    var lines = err.stack.split('\n'),
        msg = `${lines[0]}<br/>`,
        stack = `<div class="eruda-stack">${lines.slice(1).join('<br/>')}</div>`;

    return msg + stack.replace(regJsUrl, match => `<a href="${match}" target="_blank">${match}</a>`);
}

function transMsg(msg, noEscape)
{
    if (util.isFn(msg))
    {
        msg = msg.toString();
    } else if (util.isObj(msg))
    {
        msg = `${util.upperFirst(typeof msg)} ${JSON.stringify(extractObj(msg))}`;
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

var extractObj = (obj) => JSON.parse(stringify(obj));

// Modified from: https://jsconsole.com/
function stringify(obj, simple, visited)
{
    var json = '',
        type = '',
        parts = [],
        names = [],
        circular = false;

    visited = visited || [];

    try {
        type = ({}).toString.call(obj);
    } catch (e)
    {
        type = '[object Object]';
    }

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
    } else if (type == '[object String]')
    {
        json = `"${escapeJsonStr(obj)}"`;
    } else if (type == '[object Array]')
    {
        visited.push(obj);

        json = '[';
        util.each(obj, val => parts.push(`${stringify(val, simple, visited)}`));
        json += parts.join(', ') + ']';
    } else if (type == '[object Object]')
    {
        visited.push(obj);

        json = '{';
        for (let key in obj) names.push(key);
        names.sort(sortName);
        util.each(names, val =>
        {
            parts.push(`${stringify(val, undefined, visited)}: ${stringify(obj[val], simple, visited)}`);
        });
        json += parts.join(', ') + '}';
    } else if (type == '[object Number]')
    {
        json = obj + '';
    } else if (type == '[object Boolean]')
    {
        json = obj ? 'true' : 'false';
    } else if (type == '[object Function]')
    {
        json = `"${escapeJsonStr(obj.toString())}"`;
    } else if (obj === null)
    {
        json = 'null';
    } else if (obj === undefined)
    {
        json = '"undefined"';
    } else if (simple == undefined)
    {
        visited.push(obj);

        json = '{\n';
        for (let key in obj) names.push(key);
        names.sort(sortName);
        util.each(names, val =>
        {
            try
            {
                parts.push(`"${val}": ${stringify(obj[val], true, visited)}`);
            } catch (e) {}
        });
        json += parts.join(',\n') + '\n}';
    } else
    {
        try
        {
            json = `"${obj}"`;
        } catch (e) {}
    }

    return json;
}

var escapeJsonStr = str => str.replace(/\\/g, '\\\\')
                              .replace(/"/g, '\\"')
                              .replace(/\f/g, '\\f')
                              .replace(/\n/g, '\\n')
                              .replace(/\r/g, '')
                              .replace(/\t/g, '');

var sortName = (a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1;

var transMultipleMsg = args => args.map(val => transMsg(val)).join(' ');

var txtToHtml = str => str.replace(/\n/g, '<br/>')
                          .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
