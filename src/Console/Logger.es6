import util from '../lib/util'
import stringify from '../lib/stringify.es6'
import highlight from '../lib/highlight.es6'
import beautify from 'js-beautify'
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
    filter(val)
    {
        this._filter = val;
        this.emit('filter', val);

        return this.render();
    }
    log(...args)
    {
        this.insert('log', args);

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
        return this.html(helpMsg);
    }
    render()
    {
        let html = '',
            logs = this._logs;

        logs = this._renderLogs = this._filterLogs(logs);

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
            idx: logs.length,
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

        if (this._maxNum !== 'infinite' && logs.length >= this._maxNum)
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
            if (isFn) return filter(log);
            if (isRegExp) return filter.test(util.stripHtmlTag(log.formattedMsg));

            return log.ignoreFilter || log.type === filter;
        });
    }
    _filterLog(log)
    {
        let filter = this._filter;

        if (filter === 'all') return true;

        let isRegExp = util.isRegExp(filter),
            isFn = util.isFn(filter);

        if (isFn) return filter(log);
        if (isRegExp) return filter.test(util.stripHtmlTag(log.formattedMsg));

        return log.ignoreFilter || log.type === filter;
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
                idx = $el.data('idx'),
                type = $el.data('type'),
                log = self._renderLogs[idx];

            let action = Log.click(type, log, $el);

            switch (action)
            {
                case 'viewSrc':
                    let src = log.src;
                    try {
                        if (!util.isObj(src)) src = JSON.parse(src);
                        self.emit('viewJson', src);
                    } catch (e) {}
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
