import util from '../lib/util'

require('./Log.scss');

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

    return util.escape(msg);
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

export default class Log extends util.Emitter
{
    constructor($el)
    {
        super();

        this._$el = $el;
        this._logs = [];
        this._tpl = require('./Log.hbs');
        this._filter = 'all';
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

        this._logs.push({
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

        this._render();

        return this;
    }
    output(msg)
    {
        msg = transMsg(msg);

        this._logs.push({
            type: 'output',
            ignoreFilter: true,
            val: msg
        });

        this._render();

        return this;
    }
    dir(obj)
    {
        var msg = util.isObj(obj) ? JSON.stringify(obj, null, 4) : transMsg(obj);

        this._logs.push({
            type: 'dir',
            isCode: true,
            val: msg
        });

        this._render();

        return this;
    }
    log()
    {
        var msg = transMultipleMsg(arguments);

        this._logs.push({
            type: 'log',
            val: msg
        });

        this._render();

        return this;
    }
    html(msg)
    {
        this._logs.push({
            type: 'html',
            ignoreFilter: true,
            val: msg
        });

        this._render();

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

        this._logs.push({
            type: 'error',
            ignoreFilter: ignoreFilter,
            val: msg
        });

        this._render();

        return this;
    }
    info()
    {
        var msg = transMultipleMsg(arguments);

        this._logs.push({
            type: 'info',
            val: msg
        });

        this._render();

        return this;
    }
    warn()
    {
        var msg = transMultipleMsg(arguments);

        this._logs.push({
            type: 'warn',
            val: msg
        });

        this._render();

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