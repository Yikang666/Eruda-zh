import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'

export default class Settings extends Tool
{
    constructor()
    {
        super();

        require('./Settings.scss');

        this.name = 'settings';
        this._switchTpl = require('./switch.hbs');
        this._settings = [];
    }
    init($el)
    {
        super.init($el);

        this._bindEvent();
    }
    switch(config, key, desc)
    {
        this._settings.push({
            config: config,
            key: key
        });

        this._$el.append(this._switchTpl({
            desc: desc,
            key: key,
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
        var self = this;

        this._$el.on('click', '.eruda-checkbox', function ()
        {
            var $input = util.$(this).find('input'),
                idx = $input.data('idx'),
                val = $input.get(0).checked;

            var setting = self._settings[idx];
            setting.config.set(setting.key, val);
        });
    }
};