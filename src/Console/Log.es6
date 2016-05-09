import util from '../lib/util'

require('./Log.scss');

export default class Log extends util.Emitter
{
    constructor($el)
    {
        super();

        this._$el = $el;
        this._logs = [];
        this._tpl = require('./Log.hbs');
        this._filter = 'all';
        this._lastLog = {};
        this._timer = {};
    }
    clear()
    {
        this._logs = [];

        this._render();
    }
    input(jsCode)
    {
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
            val: transCode(jsCode)
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
    output(msg)
    {
        msg = transMsg(msg);

        this._insert({
            type: 'output',
            ignoreFilter: true,
            val: msg
        });

        return this;
    }
    dir(obj)
    {
        var msg = util.isObj(obj) ? JSON.stringify(obj, null, 4) : transMsg(obj);

        this._insert({
            type: 'dir',
            isCode: true,
            val: msg
        });

        return this;
    }
    log()
    {
        var msg = transMultipleMsg(arguments);

        this._insert({
            type: 'log',
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
        var ignoreFilter = false;

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
            val: msg
        });

        return this;
    }
    info()
    {
        var msg = transMultipleMsg(arguments);

        this._insert({
            type: 'info',
            val: msg
        });

        return this;
    }
    warn()
    {
        var msg = transMultipleMsg(arguments);

        this._insert({
            type: 'warn',
            val: msg
        });

        return this;
    }
    filter(type)
    {
        this._filter = type;

        this.emit('filter', type);

        this._render();
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
        this.log('<div class="eruda-blue">' + name + ':' + duration + 'ms</div>');
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

        if (!log.isCode && log.type != 'html') log.val = txtToHtml(log.val);

        var lastLog = this._lastLog;

        if (lastLog.type === log.type && lastLog.val === log.val)
        {
            lastLog.times++;
            lastLog.showTimes = true;
        } else
        {
            this._logs.push(log);

            this._lastLog = log;
        }

        this._render();
    }
    _runCmd(cmd)
    {
        cmd = util.trim(cmd);

        switch (cmd)
        {
            case 'c': return this.clear();
            case 'a': return this.filter('all');
            case 'e': return this.filter('error');
            case 'i': return this.filter('info');
            case 'w': return this.filter('warn');
            case 'l': return this.filter('log');
            case 'h': return this.help();
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
            if (result) return this.log(name + ' is loaded');

            this.warn('Failed to load ' + name);
        });
    }
    _render()
    {
        var logs = this._filterLogs(this._logs);

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
    var stack = '<div class="eruda-stack">' + lines.slice(1).join('<br/>') + '</div>';

    stack = stack.replace(regJsUrl, function (match)
    {
        return '<a href="' + match + '" target="_blank">' + match + '</a>';
    });

    return msg + stack;
}

function transMsg(msg)
{
    if (util.isUndef(msg))
    {
        msg = 'undefined';
    } else if (util.isFn(msg))
    {
        msg = msg.toString();
    } else if (util.isArr(msg))
    {
        msg = JSON.stringify(msg);
    } else if (util.isObj(msg))
    {
        msg = 'Object ' + JSON.stringify(msg);
    }

    return util.escape(util.toStr(msg));
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

function transCode(code)
{
    return code.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
}

function txtToHtml(str)
{
    return str.replace(/\n/g, '<br/>')
              .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
}
