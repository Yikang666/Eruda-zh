import Log from './Log.es6'
import Tool from '../DevTools/Tool.es6'
import util from '../util'

require('./Console.scss');

export default class Console extends Tool
{
    constructor()
    {
        super();
        this.name = 'console';
    }
    init($el)
    {
        super.init($el);

        this._appendTpl();
        this._initLog();
        this._bindEvent();
    }
    overrideConsole()
    {
        var log = this._log;

        window.console.log = (msg) =>
        {
            log.log(msg);
        };
        window.console.error = (msg) =>
        {
            log.error(msg);
        };
        window.console.warn = (msg) =>
        {
            log.warn(msg);
        };
        window.console.time = (name) =>
        {
            log.time(name);
        };
        window.console.timeEnd = (name) =>
        {
            log.timeEnd(name);
        };

        return this;
    }
    catchGlobalErr()
    {
        var log = this._log;

        this._origOnerror = window.onerror;
        window.onerror = (errMsg, url, lineNum, column, errObj) =>
        {
            if (errObj) return log.error(errObj);
            log.error(errMsg);
        };

        return this;
    }
    destroy()
    {
        super.destroy();

        window.onerror = this._origOnerror;
    }
    _appendTpl()
    {
        var $el = this._$el;

        $el.append(require('./Console.hbs')());
        this._$logs = $el.find('.eruda-logs');
        this._$jsInput = $el.find('.eruda-js-input');
    }
    _initLog()
    {
        this._log = new Log(this._$logs);
        this.overrideConsole().catchGlobalErr();
    }
    _bindEvent()
    {
        var $jsInput = this._$jsInput,
            log = this._log;

        $jsInput.on('keyup', (e) =>
        {
            e = e.origEvent;

            if (e.keyCode === 13)
            {
                var jsInput = $jsInput.val();

                if (util.trim(jsInput) === '') return;

                log.input(jsInput);

                $jsInput.val('');
                $jsInput.get(0).blur();
            }
        }).on('focusin', () => $jsInput.css({height: '100%'}))
          .on('focusout', () => $jsInput.css({height: '40px'}))
    }
}

