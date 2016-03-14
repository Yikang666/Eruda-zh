import util from '../util'

require('./Log.scss');

var cmdList = require('./cmdList.json'),
    helpMsg = require('./help.hbs')({
        commands: cmdList
    });

var libraries = require('./libraries.json');

var regJsUrl = /https?:\/\/([0-9.\-A-Za-z]+)(?::(\d+))?\/[A-Za-z0-9/]*\.js/g;

function evalJs(jsInput)
{
    return eval(jsInput);
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

    return msg;
}

export default class Log
{
    constructor($el)
    {
        this._$el = $el;
        this._logs = [];
        this._tpl = require('./Log.hbs');
        this._filter = 'all';
    }
    overrideConsole()
    {
        var self = this;

        window.console.log = (msg) =>
        {
            self.log(msg);
        };
        window.console.error = (msg) =>
        {
            self.error(msg);
        };
        window.console.warn = (msg) =>
        {
            self.warn(msg);
        };

        return this;
    }
    catchGlobalErr()
    {
        var self = this;

        window.onerror = (errMsg, url, lineNum, column, errObj) =>
        {
            self.error(errObj);
        };

        return this;
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
            return this.filter(new RegExp(regexp));
        }

        this._logs.push({
            type: 'input',
            val: jsCode
        });

        try {
            this.output(evalJs(jsCode));
        } catch (e)
        {
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
            val: msg
        });

        this._render();

        return this;
    }
    log(msg)
    {
        msg = transMsg(msg);

        this._logs.push({
            type: 'log',
            val: msg
        });

        this._render();

        return this;
    }
    error(msg)
    {
        if (util.isErr(msg))
        {
            msg = errToStr(msg);
        } else
        {
            msg = errToStr(new Error(), transMsg(msg));
        }

        this._logs.push({
            type: 'error',
            val: msg
        });

        this._render();

        return this;
    }
    warn(msg)
    {
        msg = transMsg(msg);

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

        this._render();
    }
    help()
    {
        return this.log(helpMsg);
    }
    _runCmd(cmd)
    {
        cmd = util.trim(cmd);

        switch (cmd)
        {
            case 'c': return this.clear();
            case 'a': return this.filter('all');
            case 'e': return this.filter('error');
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

            return val.type === filter;
        });
    }
    _scrollToBottom()
    {
        var el = this._$el.get(0);

        el.scrollTop = el.scrollHeight;
    }
}