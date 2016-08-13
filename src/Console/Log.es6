import util from '../lib/util'
import stringify from '../lib/stringify.es6'
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
        this._maxNum = 'infinite';
        this._displayExtraInfo = false;
        this._isUpdated = false;
        this._lastLog = {};
        this._timer = {};

        this._bindEvent();
    }
    setMaxNum(num)
    {
        var logs = this._logs;

        this._maxNum = num;
        if (util.isNum(num) && logs.length > num)
        {
            this._logs = logs.slice(logs.length - num);
            this._isUpdated = true;
            this.render();
        }
    }
    displayExtraInfo(flag)
    {
        this._displayExtraInfo = flag;
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
        var logs = this._logs;

        if (this._maxNum !== 'infinite' && logs.length >= this._maxNum) logs.shift();

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

        if (this._displayExtraInfo)
        {
            log.hasHeader = true;
            log.time = getCurTime();
            log.from = getFrom();
        }

        var lastLog = this._lastLog;

        if (log.type !== 'html' &&
            lastLog.type === log.type &&
            lastLog.val === log.val)
        {
            lastLog.times++;
            lastLog.showTimes = true;
            if (log.time) lastLog.time = log.time;
        } else
        {
            logs.push(log);
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

        return logs.filter(val =>
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
        msg = `<pre>${highlight(beautify.html(msg.outerHTML), 'html')}</pre>`;
        noEscape = true;
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

var extractObj = (obj, simple) => JSON.parse(stringify(obj, null, obj, simple));

var transMultipleMsg = args => args.map(val => transMsg(val)).join(' ');

var txtToHtml = str => str.replace(/\n/g, '<br/>')
                          .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
