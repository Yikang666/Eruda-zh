import Logger from './Logger.es6'
import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'
import config from '../lib/config.es6'

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

        this._appendTpl();
        this._initLogger();
        this._exposeLogger();
        this._initConfig(parent);
        this._bindEvent(parent);
    }
    show()
    {
        super.show();

        this._logger.render();
    }
    overrideConsole()
    {
        let logger = this._logger,
            origConsole = this._origConsole = {},
            winConsole = window.console;

        CONSOLE_METHOD.forEach(name =>
        {
            let origin = origConsole[name] = util.noop;
            if (winConsole[name]) origin = origConsole[name] = winConsole[name].bind(winConsole);

            winConsole[name] = (...args) =>
            {
                logger[name](...args);
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

        window.onerror = (errMsg, url, lineNum, column, errObj) => this._logger.error(errObj ? errObj : errMsg);

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
        let $el = this._$el;

        util.evalCss(require('./Console.scss'));
        $el.append(require('./Console.hbs')());

        let _$inputContainer = $el.find('.eruda-js-input'),
            _$input = _$inputContainer.find('textarea'),
            _$inputBtns = _$inputContainer.find('.eruda-buttons');

        Object.assign(this, {
            _$control: $el.find('.eruda-control'),
            _$logs: $el.find('.eruda-logs'),
            _$inputContainer, _$input, _$inputBtns
        });
    }
    _initLogger()
    {
        let $filter = this._$control.find('.filter'),
            logger = this._logger = new Logger(this._$logs, this);

        logger.on('filter', (filter) => $filter.each(function ()
        {
            let $this = util.$(this),
                isMatch = $this.data('filter') === filter;

            $this[isMatch ? 'addClass' : 'rmClass']('eruda-active');
        }));
    }
    _exposeLogger()
    {
        let logger = this._logger,
            methods = ['filter', 'html'].concat(CONSOLE_METHOD);

        methods.forEach(name => this[name] = (...args) =>
        {
            logger[name](...args);

            return this;
        });
    }
    _bindEvent(parent)
    {
        let $input = this._$input,
            $inputBtns = this._$inputBtns,
            $control = this._$control,
            logger = this._logger,
            config = this.config;

        $control.on('click', '.clear-console', () => logger.clear())
                .on('click', '.filter', function ()
                {
                    logger.filter(util.$(this).data('filter'));
                })
                .on('click', '.help', () => logger.help());

        $inputBtns.on('click', '.cancel', () => this._hideInput())
                  .on('click', '.execute', () =>
                  {
                      let jsInput = $input.val().trim();
                      if (jsInput === '') return;

                      logger.input(jsInput);
                      $input.val('').get(0).blur();
                      this._hideInput();
                  });

        $input.on('focusin', () => this._showInput());

        logger.on('viewJson', (data) =>
           {
               let sources = parent.get('sources');
               if (!sources) return;

               sources.set('json', data);
               parent.showTool('sources');
           })
           .on('insert', (log) =>
           {
               let autoShow = log.type === 'error' && config.get('displayIfErr');

               if (autoShow) parent.showTool('console').show();
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
    _initConfig(parent)
    {
        let cfg = this.config = config.create('eruda-console'),
            sources = parent.get('sources'),
            logger = this._logger;

        cfg.set(util.defaults(cfg.get(), {
            catchGlobalErr: true,
            overrideConsole: true,
            displayExtraInfo: false,
            displayUnenumerable: true,
            displayGetterVal: false,
            viewLogInSources: false,
            displayIfErr: false,
            maxLogNum: 'infinite'
        }));

        let maxLogNum = cfg.get('maxLogNum');
        maxLogNum = maxLogNum === 'infinite' ? maxLogNum : +maxLogNum;

        if (cfg.get('catchGlobalErr')) this.catchGlobalErr();
        if (cfg.get('overrideConsole')) this.overrideConsole();
        logger.displayHeader(cfg.get('displayExtraInfo'));
        logger.displayUnenumerable(cfg.get('displayUnenumerable'));
        logger.displayGetterVal(cfg.get('displayGetterVal'));
        if (sources) logger.viewLogInSources(cfg.get('viewLogInSources'));
        logger.maxNum(maxLogNum);

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'catchGlobalErr': return val ? this.catchGlobalErr() : this.ignoreGlobalErr();
                case 'overrideConsole': return val ? this.overrideConsole() : this.restoreConsole();
                case 'maxLogNum': return logger.maxNum(val === 'infinite' ? val : +val);
                case 'displayExtraInfo': return logger.displayHeader(val);
                case 'displayUnenumerable': return logger.displayUnenumerable(val);
                case 'displayGetterVal': return logger.displayGetterVal(val);
                case 'viewLogInSources': return logger.viewLogInSources(val);
            }
        });

        let settings = parent.get('settings');

        settings.text('Console')
                .switch(cfg, 'catchGlobalErr', 'Catch Global Errors')
                .switch(cfg, 'overrideConsole', 'Override Console')
                .switch(cfg, 'displayIfErr', 'Auto Display If Error Occurs')
                .switch(cfg, 'displayExtraInfo', 'Display Extra Information')
                .switch(cfg, 'displayUnenumerable', 'Display Unenumerable Properties')
                .switch(cfg, 'displayGetterVal', 'Access Getter Value');

        if (sources) settings.switch(cfg, 'viewLogInSources', 'View Log In Sources Panel');

        settings.select(cfg, 'maxLogNum', 'Max Log Number', ['infinite', '250', '125', '100', '50', '10'])
                .separator()
    }
}

const CONSOLE_METHOD = ['log', 'error', 'info', 'warn', 'dir', 'time', 'timeEnd', 'clear', 'table', 'assert', 'count', 'debug'];
