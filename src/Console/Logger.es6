import util from '../lib/util'
import Log from './Log.es6'

export default class Logger extends util.Emitter
{
    constructor($el, parent)
    {
        super();
        util.evalCss(require('./Logger.scss'));

        this._$el = $el;
        this._parent = parent;
        this._logs = [];
        this._timer = {};
        this._count = {};
        this._lastLog = {};
        this._filter = 'all';
        this._maxNum = 'infinite';
        this._displayHeader = false;

        this._bindEvent();
    }
    displayHeader(flag)
    {
        this._displayHeader = flag;
    }
    maxNum(val)
    {
        var logs = this._logs;

        this._maxNum = val;
        if (util.isNum(val) && logs.length > val)
        {
            this._logs = logs.slice(logs.length - val);
            this.render();
        }
    }
    displayUnenumerable(flag)
    {
        Log.showUnenumerable = flag;
    }
    displayGetterVal(flag)
    {
        Log.showGetterVal = flag;
    }
    viewLogInSources(flag)
    {
        Log.showSrcInSources = flag;
    }
    filter(val)
    {
        this._filter = val;
        this.emit('filter', val);

        return this.render();
    }
    count(label)
    {
        let count = this._count;

        !util.isUndef(count[label]) ? count[label]++ : count[label] = 1;

        return this.html(`<div class="eruda-blue">${label}: ${count[label]}</div>`);
    }
    assert(...args)
    {
        if (args.length === 0) return;

        let exp = args.shift();

        if (!exp)
        {
            args.unshift('Assertion failed: ');
            return this.insert('error', args);
        }
    }
    log(...args)
    {
        this.insert('log', args);

        return this;
    }
    debug(...args)
    {
        this.insert('debug', args);

        return this;
    }
    dir(...args)
    {
        this.insert('dir', args);

        return this;
    }
    table(...args)
    {
        this.insert('table', args);

        return this;
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
    clear()
    {
        this._logs = [];
        this._lastLog = {};

        return this.render();
    }
    info(...args)
    {
        return this.insert('info', args);
    }
    error(...args)
    {
        return this.insert('error', args);
    }
    warn(...args)
    {
        return this.insert('warn', args);
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
            args: [jsCode],
            ignoreFilter: true
        });

        try {
            this.output(evalJs(jsCode));
        } catch (e)
        {
            this.insert({
                type: 'error',
                ignoreFilter: true,
                args: [e]
            });
        }

        return this;
    }
    output(val)
    {
        return this.insert({
            type: 'output',
            args: [val],
            ignoreFilter: true
        });
    }
    html(...args)
    {
        return this.insert('html', args);
    }
    help()
    {
        return this.insert({
            type: 'html',
            args: [helpMsg],
            ignoreFilter: true
        });
    }
    render()
    {
        let html = '',
            logs = this._logs;

        logs = this._filterLogs(logs);

        for (let i = 0, len = logs.length; i < len; i++)
        {
            html += logs[i].formattedMsg;
        }

        this._$el.html(html);
        this.scrollToBottom();

        return this;
    }
    insert(type, args)
    {
        let logs = this._logs,
            $el = this._$el;

        let options = util.isStr(type) ? {type, args} : type;
        util.extend(options, {
            id: util.uniqId('log'),
            displayHeader: this._displayHeader
        });

        let log = new Log(options);

        let lastLog = this._lastLog;
        if (log.type !== 'html' &&
            lastLog.type === log.type &&
            lastLog.value === log.value)
        {
            lastLog.addCount();
            if (log.time) lastLog.updateTime(log.time);
            $el.find('li').last().remove();
            log = lastLog;
        } else
        {
            logs.push(log);
            this._lastLog = log;
        }

        if (this._maxNum !== 'infinite' && logs.length > this._maxNum)
        {
            $el.find('li').first().remove();
            logs.shift();
        }

        if (this._filterLog(log) && this._parent.active) $el.append(log.formattedMsg);

        this.emit('insert', log);
        this.scrollToBottom();

        return this;
    }
    scrollToBottom()
    {
        var el = this._$el.get(0);

        el.scrollTop = el.scrollHeight;
    }
    _filterLogs(logs)
    {
        var filter = this._filter;

        if (filter === 'all') return logs;

        let isRegExp = util.isRegExp(filter),
            isFn = util.isFn(filter);

        return logs.filter(log =>
        {
            if (log.ignoreFilter) return true;
            if (isFn) return filter(log);
            if (isRegExp) return filter.test(util.stripHtmlTag(log.formattedMsg));
            return log.type === filter;
        });
    }
    _filterLog(log)
    {
        let filter = this._filter;

        if (filter === 'all') return true;

        let isRegExp = util.isRegExp(filter),
            isFn = util.isFn(filter);

        if (log.ignoreFilter) return true;
        if (isFn) return filter(log);
        if (isRegExp) return filter.test(util.stripHtmlTag(log.formattedMsg));

        return log.type === filter;
    }
    _loadJs(name)
    {
        util.loadJs(libraries[name], (result) =>
        {
            if (result) return this.log(`${name} is loaded`);

            this.warn(`Failed to load ${name}`);
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
    _bindEvent()
    {
        var self = this;

        this._$el.on('click', '.eruda-log-item', function ()
        {
            let $el = util.$(this),
                id = $el.data('id'),
                type = $el.data('type'),
                logs = self._logs,
                log;

            for (let i = 0, len = logs.length; i < len; i++)
            {
                log = logs[i];
                if (log.id === id) break;
            }
            if (!log) return;

            let action = Log.click(type, log, $el);

            switch (action)
            {
                case 'viewSrc':
                    self.emit('viewJson', log.src);
                    break;
            }
        });
    }
}

var cmdList = require('./cmdList.json'),
    helpMsg = require('./help.hbs')({commands: cmdList}),
    libraries = require('./libraries.json');

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
