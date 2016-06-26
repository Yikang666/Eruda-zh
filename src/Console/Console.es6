import Log from './Log.es6'
import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'
import config from '../lib/config.es6'

export default class Console extends Tool
{
    constructor()
    {
        super();

        util.evalCss(require('./Console.scss'));

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
    show()
    {
        super.show();

        this._log.render();
    }
    overrideConsole()
    {
        var log = this._log,
            origConsole = this._origConsole = {},
            winConsole = window.console;

        CONSOLE_METHOD.forEach(name =>
        {
            var origin = origConsole[name] = util.noop;
            if (winConsole[name])
            {
                origin = origConsole[name] = winConsole[name].bind(winConsole);
            }

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
            var sources = parent.get('sources');
            if (!sources) return;

            sources.set('json', data);
            parent.showTool('sources');
        }).on('insert', (log) =>
        {
            if (log.type === 'error' && this.config.get('displayIfErr'))
            {
                parent.showTool('console').show();
            }
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
            overrideConsole: true,
            displayIfErr: false,
            maxLogNum: 'infinite'
        }));

        var maxLogNum = cfg.get('maxLogNum');
        maxLogNum = maxLogNum === 'infinite' ? maxLogNum : +maxLogNum;

        if (cfg.get('catchGlobalErr')) this.catchGlobalErr();
        if (cfg.get('overrideConsole')) this.overrideConsole();
        this._log.setMaxNum(maxLogNum);

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'catchGlobalErr': return val ? this.catchGlobalErr() : this.ignoreGlobalErr();
                case 'overrideConsole': return val ? this.overrideConsole() : this.restoreConsole();
                case 'maxLogNum': return this._log.setMaxNum(val === 'infinite' ? val : +val);
            }
        });

        var settings = this._parent.get('settings');

        settings.text('Console')
                .switch(cfg, 'catchGlobalErr', 'Catch Global Errors')
                .switch(cfg, 'overrideConsole', 'Override Console')
                .switch(cfg, 'displayIfErr', 'Auto Display If Error Occurs')
                .select(cfg, 'maxLogNum', 'Max Log Number', ['infinite', '250', '125', '100', '50', '10'])
                .separator()
    }
}

const CONSOLE_METHOD = ['log', 'error', 'info', 'warn', 'dir', 'time', 'timeEnd', 'clear'];
