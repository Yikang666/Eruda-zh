import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'

export default class Settings extends Tool
{
    constructor()
    {
        super();

        util.evalCss(require('./Settings.scss'));

        this.name = 'settings';
        this._switchTpl = require('./switch.hbs');
        this._selectTpl = require('./select.hbs');
        this._settings = [];
    }
    init($el)
    {
        super.init($el);

        this._bindEvent();
    }
    switch(config, key, desc)
    {
        this._settings.push({config, key});

        this._$el.append(this._switchTpl({
            desc, key,
            idx: this._settings.length - 1,
            val: config.get(key)
        }));

        return this;
    }
    select(config, key, desc, selections)
    {
        this._settings.push({config, key});

        this._$el.append(this._selectTpl({
            desc, key, selections,
            idx: this._settings.length - 1,
            val: config.get(key)
        }));

        return this;
    }
    separator()
    {
        this._$el.append('<div class="eruda-separator"></div>');

        return this;
    }
    text(text)
    {
        this._$el.append(`<div class="eruda-text">${text}</div>`);

        return this;
    }
    _bindEvent()
    {
        let self = this;

        this._$el.on('click', '.eruda-checkbox', function ()
        {
            let $input = util.$(this).find('input'),
                idx = $input.data('idx'),
                val = $input.get(0).checked;

            let setting = self._settings[idx];
            setting.config.set(setting.key, val);
        }).on('click', '.eruda-select .eruda-head', function ()
        {
             util.$(this).parent().find('ul').toggleClass('eruda-open');
        }).on('click', '.eruda-select li', function ()
        {
            let $this = util.$(this),
                $ul = $this.parent(),
                val = $this.text(),
                idx = $ul.data('idx'),
                setting = self._settings[idx];

            $ul.rmClass('eruda-open');
            $ul.parent().find('.eruda-head span').text(val);

            setting.config.set(setting.key, val);
        });
    }
}