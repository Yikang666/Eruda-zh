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
        this._filter = 'all';
        this._maxNum = 'infinite';
        this._displayExtraInfo = false;

        this._bindEvent();
    }
    displayExtraInfo(flag)
    {
        this._displayExtraInfo = flag;
    }
    maxNum(val)
    {
        var logs = this._logs;

        this._maxNum = val;
        if (util.isNum(val) && logs.length > val)
        {
            this._logs = logs.slice(logs.length - val);
            this._isUpdated = true;
            this.render();
        }
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

        this.insert('input', [jsCode]);

        try {
            this.output(evalJs(jsCode));
        } catch (e)
        {
            this.error(e);
        }

        return this;
    }
    output(val)
    {
        return this.insert('output', [val]);
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
        let logs = this._logs;

        let log = new Log({
            type, args,
            idx: logs.length,
            header: this._displayExtraInfo
        });
        logs.push(log);
        this.render();

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

        var isRegexp = util.isRegExp(filter),
            isFn = util.isFn(filter);

        return logs.filter(val =>
        {
            if (isFn) return filter(val);
            if (isRegexp) return filter.test(util.stripHtmlTag(val.val));

            return val.ignoreFilter || val.type === filter;
        });
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
            var idx = util.$(this).data('idx'),
                src = self._renderLogs[idx].src;

            try {
                if (!util.isObj(src)) src = JSON.parse(src);
                self.emit('viewJson', src);
            } catch (e) {}
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
