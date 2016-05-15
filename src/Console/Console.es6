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
    init($el, parent)
    {
        super.init($el);

        this._parent = parent;
        this._appendTpl();
        this._initLog();
        this._bindEvent();
        this._initConfig();
    }
    overrideConsole()
    {
        var log = this._log,
            origConsole = this._origConsole = {},
            winConsole = window.console;

        CONSOLE_METHOD.forEach(name =>
        {
            var origin = origConsole[name] = winConsole[name].bind(winConsole);

            winConsole[name] = (...args) =>
            {
                log[name](...args);
                origin(...args);
            };
        });

        return this;
    }
    restoreConsole()
    {
        if (!this._origConsole) return this;

        CONSOLE_METHOD.forEach(name => window.console[name] = this._origConsole[name]);
        delete this._origConsole;

        return this;
    }
    catchGlobalErr()
    {
        this._origOnerror = window.onerror;

        window.onerror = (errMsg, url, lineNum, column, errObj) => this._log.error(errObj ? errObj : errMsg);

        return this;
    }
    ignoreGlobalErr()
    {
        if (this._origOnerror)
        {
            window.onerror = this._origOnerror;
            delete this._origOnerror;
        }

        return this;
    }
    destroy()
    {
        super.destroy();

        this.ignoreGlobalErr();
        return this.restoreConsole();
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
        this._log = new Log(this._$logs, this);

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
            parent = this._parent,
            log = this._log;

        $control.on('click', '.clear-console', () => log.clear());
        $control.on('click', '.filter', function ()
        {
            log.filter(util.$(this).data('filter'));
        }).on('click', '.help', () => log.help());

        $inputBtns.on('click', '.cancel', () => this._hideInput());
        $inputBtns.on('click', '.execute', () =>
        {
            var jsInput = $input.val().trim();
            if (jsInput === '') return;

            log.input(jsInput);
            $input.val('').get(0).blur();
            this._hideInput();
        });

        $input.on('focusin', () => this._showInput());

        log.on('viewJson', (data) =>
        {
            parent.get('sources').set('json', data);
            parent.showTool('sources');
        });
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

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'catchGlobalErr': return val ? this.catchGlobalErr() : this.ignoreGlobalErr();
                case 'overrideConsole': return val ? this.overrideConsole() : this.restoreConsole();
            }
        });
    }
}

const CONSOLE_METHOD = ['log', 'error', 'info', 'warn', 'dir', 'time', 'timeEnd', 'clear'];
