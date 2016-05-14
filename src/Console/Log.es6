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
        this.render();
    }
    input(jsCode)
    {
        var src = jsCode;

        jsCode = util.trim(jsCode);

        if (util.startWith(jsCode, ':'))
        {
            var cmd = jsCode.slice(1);
            this._runCmd(cmd);

            return this;
        } else if (util.startWith(jsCode, '/'))
        {
            var regexp = util.trim(jsCode.slice(1));
            return this.filter(new RegExp(util.escapeRegExp(regexp)));
        }

        this._insert({
            type: 'input',
            ignoreFilter: true,
            isCode: true,
            src: src,
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
        var src = util.isObj(val) ? extractObj(val) : val;

        this._insert({
            type: 'output',
            ignoreFilter: true,
            src,
            val: transMsg(val)
        });

        return this;
    }
    dir(obj)
    {
        var src = util.isObj(obj) ? extractObj(obj) : obj,
            msg = util.isObj(src) ? JSON.stringify(src, null, 4) : transMsg(src, true);

        this._insert({
            type: 'dir',
            isCode: true,
            src,
            val: msg
        });

        return this;
    }
    log()
    {
        var msg = transMultipleMsg(arguments),
            src = extractSrc(arguments);

        this._insert({
            type: 'log',
            src,
            val: msg
        });

        return this;
    }
    html(msg)
    {
        this._insert({
            type: 'html',
            ignoreFilter: true,
            val: msg
        });

        return this;
    }
    error(msg)
    {
        var src = msg,
            ignoreFilter = false;

        if (util.isErr(msg))
        {
            ignoreFilter = msg.ignoreFilter;
            msg = errToStr(msg);
        } else
        {
            msg = errToStr(new Error(), transMsg(msg));
        }

        this._insert({
            type: 'error',
            ignoreFilter: ignoreFilter,
            src: src,
            val: msg
        });

        return this;
    }
    info()
    {
        var msg = transMultipleMsg(arguments),
            src = arguments.length === 1 ? arguments[0] : arguments;

        this._insert({
            type: 'info',
            src,
            val: msg
        });

        return this;
    }
    warn()
    {
        var msg = transMultipleMsg(arguments),
            src = arguments.length === 1 ? arguments[0] : arguments;

        this._insert({
            type: 'warn',
            src,
            val: msg
        });

        return this;
    }
    filter(type)
    {
        this._filter = type;

        this.emit('filter', type);

        this._isUpdated = true;
        this.render();
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

        var duration = util.now() - startTime;
        this.html(`<div class="eruda-blue">${name}: ${duration}ms</div>`);
        delete  this._timer[name];

        return this;
    }
    _insert(log)
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
        this.render();
    }
    _bindEvent()
    {
        var self = this;

        this._$el.on('click', '.eruda-log-item', function ()
        {
            var idx = util.$(this).data('idx');

            var src = self._renderLogs[idx].src;

            try {
                if (!util.isObj(src)) src = JSON.parse(src);
                self.emit('viewJson', src);
            } catch (e) {}
        });
    }
    _runCmd(cmd)
    {
        cmd = util.trim(cmd);

        switch (cmd)
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

        this._$el.html(this._tpl({
            logs: logs
        }));

        this._scrollToBottom();
    }
    _filterLogs(logs)
    {
        var filter = this._filter;

        if (filter === 'all') return logs;

        var isRegexp = util.isRegExp(filter);

        return util.filter(logs, (val) =>
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
    helpMsg = require('./help.hbs')({
        commands: cmdList
    });

var libraries = require('./libraries.json');

var regJsUrl = /https?:\/\/([0-9.\-A-Za-z]+)(?::(\d+))?\/[A-Z.a-z0-9/]*\.js/g;

function evalJs(jsInput)
{
    return eval.call(window, jsInput);
}

function errToStr(err, msg)
{
    var lines = err.stack.split('\n');

    if (util.isUndef(msg)) msg = lines[0] + '<br/>';
    var stack = `<div class="eruda-stack">${lines.slice(1).join('<br/>')}</div>`;

    stack = stack.replace(regJsUrl, function (match)
    {
        return `<a href="${match}" target="_blank">${match}</a>`;
    });

    return msg + stack;
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
    }

    msg = util.toStr(msg);

    if (noEscape) return msg;

    return util.escape(msg);
}

function extractSrc(args)
{
    if (args.length !== 1) return args;

    var ret = args[0];

    if (util.isObj(ret)) ret = extractObj(ret);

    return ret;
}

function extractObj(obj)
{
    return JSON.parse(stringify(obj));
}

// Modified from: https://jsconsole.com/
function stringify(obj, simple, visited)
{
    var json = '',
        type = '',
        parts = [],
        names = [],
        circular = false,
        i, vi;

    visited = visited || [];

    try {
        type = ({}).toString.call(obj);
    } catch (e)
    {
        type = '[object Object]';
    }

    for (vi = 0; vi < visited.length; vi++)
    {
        if (obj === visited[vi])
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
        for (i = 0; i < obj.length; i++)
        {
            parts.push(`${stringify(obj[i], simple, visited)}`);
        }
        json += parts.join(', ') + ']';
    } else if (type == '[object Object]')
    {
        visited.push(obj);

        json = '{';
        for (i in obj) names.push(i);
        names.sort(sortName);
        for (i = 0; i < names.length; i++)
        {
            parts.push(`${stringify(names[i], undefined, visited)}: ${stringify(obj[ names[i] ], simple, visited)}`);
        }
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
        for (i in obj) names.push(i);
        names.sort(sortName);
        for (i = 0; i < names.length; i++)
        {
            try
            {
                parts.push(`"${names[i]}": ${stringify(obj[names[i]], true, visited)}`);
            } catch (e) {}
        }

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

function escapeJsonStr(str)
{
    return str.replace(/\n/g, '\\n')
              .replace(/\r/, '\\r')
              .replace(/"/g, '\\"')
              .replace(/\t/g, '\\t');
}

function sortName(a, b)
{
    return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
}

function transMultipleMsg(args)
{
    var ret = [];

    util.each(args, function (val)
    {
        ret.push(transMsg(val));
    });

    return ret.join(' ');
}

function txtToHtml(str)
{
    return str.replace(/\n/g, '<br/>')
              .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
}
