import Log from './Log.es6'
import util from '../util'

require('!style!css!sass!./Console.scss');

export default class Console
{
    constructor()
    {
        this.name = 'console';
    }
    init($el)
    {
        this._$el = $el;

        this._appendTpl();
        this._initLog();
        this._bindEvent();
    }
    _appendTpl()
    {
        var $el = this._$el;

        $el.append(require('./Console.hbs')());
        this._$logs = $el.find('.logs');
        this._$jsInput = $el.find('.js-input');
    }
    _initLog()
    {
        this._log = new Log(this._$logs);
        this._log.overrideConsole().catchGlobalErr();
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
                try {
                    log.output(this._evalJs(jsInput));
                } catch (e)
                {
                    log.error(e);
                }

                $jsInput.val('');
            }
        });
    }
    _evalJs(jsInput)
    {
        var log = this._log;

        function clear()
        {
            log.clear();
        }

        return eval(jsInput);
    }
}

