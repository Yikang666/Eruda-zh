import Log from './Log.es6'
import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'
import config from '../lib/config.es6'

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
        this._initConfig();
    }
    overrideConsole()
    {
        var log = this._log,
            winConsole = window.console;

        winConsole.log = function () { log.log.apply(log, arguments) };
        winConsole.error = function (msg) { log.error(msg) };
        winConsole.info = function () { log.info.apply(log, arguments) };
        winConsole.warn = function () { log.warn.apply(log, arguments) };
        winConsole.dir = function (obj) { log.dir(obj) };
        winConsole.time = function (name) { log.time(name) };
        winConsole.timeEnd = function (name) { log.timeEnd(name) };
        winConsole.clear = function () { log.clear() };

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
        this._$control = $el.find('.eruda-control');
        this._$logs = $el.find('.eruda-logs');
        this._$inputContainer = $el.find('.eruda-js-input');
        this._$input = this._$inputContainer.find('textarea');
        this._$inputBtns = this._$inputContainer.find('.eruda-buttons');
    }
    _initLog()
    {
        this._log = new Log(this._$logs);

        this._log.on('filter', (filter) =>
        {
            this._$control.find('.filter').each(function ()
            {
                var $this = util.$(this),
                    isMatch = $this.data('filter') === filter;

                $this[isMatch ? 'addClass' : 'rmClass']('eruda-active');
            });
        });
    }
    _bindEvent()
    {
        var $input = this._$input,
            $inputBtns = this._$inputBtns,
            $control = this._$control,
            log = this._log;

        $control.on('click', '.clear-console', () => log.clear());
        $control.on('click', '.filter', function ()
        {
            log.filter(util.$(this).data('filter'));
        }).on('click', '.help', () => log.help());

        $inputBtns.on('click', '.cancel', () => this._hideInput());
        $inputBtns.on('click', '.execute', () =>
        {
            var jsInput = $input.val();

            if (util.trim(jsInput) === '') return;

            log.input(jsInput);

            $input.val('').get(0).blur();

            this._hideInput();
        });

        $input.on('focusin', () => this._showInput());
    }
    _hideInput()
    {
        this._$inputContainer.css({
            paddingTop: 0,
            height: 40
        });

        this._$inputBtns.hide();
    }
    _showInput()
    {
        this._$inputContainer.css({
            paddingTop: 40,
            height: '100%'
        });

        this._$inputBtns.show();
    }
    _initConfig()
    {
        var cfg = this.config = config.create('eruda-console');

        cfg.set(util.defaults(cfg.get(), {
            catchGlobalErr: true,
            overrideConsole: true
        }));

        if (cfg.get('catchGlobalErr')) this.catchGlobalErr();
        if (cfg.get('overrideConsole')) this.overrideConsole();
    }
}

