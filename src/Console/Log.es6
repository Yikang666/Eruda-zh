import util from '../util'

require('./Log.scss');

function errToStr(err)
{
    var lines = err.stack.split('\n');

    var msg = lines[0] + '<br/>',
        stack = '<div class="stack">' + lines.slice(1).join('<br/>') + '</div>';

    return msg + stack;
}

export default class Log
{
    constructor($el)
    {
        this._$el = $el;
        this._logs = [];
        this._tpl = require('./Log.hbs');
    }
    overrideConsole()
    {
        var self = this;

        window.console.log = (msg) =>
        {
            self.log(msg);
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
    input(msg)
    {
        this._logs.push({
            type: 'input',
            val: msg
        });

        this._render();

        return this;
    }
    output(msg)
    {
        if (util.isUndef(msg)) msg = 'undefined';

        this._logs.push({
            type: 'output',
            val: msg
        });

        this._render();

        return this;
    }
    log(msg)
    {
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

        }

        this._logs.push({
            type: 'error',
            val: msg
        });

        this._render();

        return this;
    }
    _render()
    {
        this._$el.html(this._tpl({
            logs: this._logs
        }));

        this._scrollToBottom();
    }
    _scrollToBottom()
    {
        var el = this._$el.get(0);

        el.scrollTop = el.scrollHeight;
    }
}