import Tool from '../DevTools/Tool';
import { evalCss, $, LocalStore } from '../lib/util';

export default class Settings extends Tool {
    constructor() {
        super();

        this._style = evalCss(require('./Settings.scss'));

        this.name = 'settings';
        this._switchTpl = require('./switch.hbs');
        this._selectTpl = require('./select.hbs');
        this._rangeTpl = require('./range.hbs');
        this._colorTpl = require('./color.hbs');
        this._settings = [];
    }
    init($el) {
        super.init($el);

        this._bindEvent();
    }
    destroy() {
        super.destroy();

        evalCss.remove(this._style);
    }
    clear() {
        this._settings = [];
        this._$el.html('');
    }
    switch(config, key, desc) {
        this._settings.push({ config, key });

        this._$el.append(
            this._switchTpl({
                desc,
                key,
                idx: this._settings.length - 1,
                val: config.get(key)
            })
        );

        return this;
    }
    color(
        config,
        key,
        desc,
        colors = ['#2196f3', '#707d8b', '#f44336', '#009688', '#ffc107']
    ) {
        this._settings.push({ config, key });

        this._$el.append(
            this._colorTpl({
                desc,
                colors,
                idx: this._settings.length - 1,
                val: config.get(key)
            })
        );

        return this;
    }
    select(config, key, desc, selections) {
        this._settings.push({ config, key });

        this._$el.append(
            this._selectTpl({
                desc,
                selections,
                idx: this._settings.length - 1,
                val: config.get(key)
            })
        );

        return this;
    }
    range(config, key, desc, { min = 0, max = 1, step = 0.1 }) {
        this._settings.push({ config, key, min, max, step });

        let val = config.get(key);

        this._$el.append(
            this._rangeTpl({
                desc,
                min,
                max,
                step,
                val,
                progress: progress(val, min, max),
                idx: this._settings.length - 1
            })
        );

        return this;
    }
    separator() {
        this._$el.append('<div class="eruda-separator"></div>');

        return this;
    }
    text(text) {
        this._$el.append(`<div class="eruda-text">${text}</div>`);

        return this;
    }
    _closeAll() {
        this._$el.find('.eruda-open').rmClass('eruda-open');
    }
    _bindEvent() {
        let self = this;

        this._$el
            .on('click', '.eruda-checkbox', function() {
                let $input = $(this).find('input'),
                    idx = $input.data('idx'),
                    val = $input.get(0).checked;

                let setting = self._settings[idx];
                setting.config.set(setting.key, val);
            })
            .on('click', '.eruda-select .eruda-head', function() {
                let $el = $(this)
                        .parent()
                        .find('ul'),
                    isOpen = $el.hasClass('eruda-open');

                self._closeAll();
                isOpen ? $el.rmClass('eruda-open') : $el.addClass('eruda-open');
            })
            .on('click', '.eruda-select li', function() {
                let $this = $(this),
                    $ul = $this.parent(),
                    val = $this.text(),
                    idx = $ul.data('idx'),
                    setting = self._settings[idx];

                $ul.rmClass('eruda-open');
                $ul.parent()
                    .find('.eruda-head span')
                    .text(val);

                setting.config.set(setting.key, val);
            })
            .on('click', '.eruda-range .eruda-head', function() {
                let $el = $(this)
                        .parent()
                        .find('.eruda-input-container'),
                    isOpen = $el.hasClass('eruda-open');

                self._closeAll();
                isOpen ? $el.rmClass('eruda-open') : $el.addClass('eruda-open');
            })
            .on('change', '.eruda-range input', function() {
                let $this = $(this),
                    $container = $this.parent(),
                    idx = $container.data('idx'),
                    val = +$this.val(),
                    setting = self._settings[idx];

                setting.config.set(setting.key, val);
            })
            .on('input', '.eruda-range input', function() {
                let $this = $(this),
                    $container = $this.parent(),
                    idx = $container.data('idx'),
                    val = +$this.val(),
                    setting = self._settings[idx],
                    { min, max } = setting;

                $container
                    .parent()
                    .find('.eruda-head span')
                    .text(val);
                $container
                    .find('.eruda-range-track-progress')
                    .css('width', progress(val, min, max) + '%');
            })
            .on('click', '.eruda-color .eruda-head', function() {
                let $el = $(this)
                        .parent()
                        .find('ul'),
                    isOpen = $el.hasClass('eruda-open');

                self._closeAll();
                isOpen ? $el.rmClass('eruda-open') : $el.addClass('eruda-open');
            })
            .on('click', '.eruda-color li', function() {
                let $this = $(this),
                    $ul = $this.parent(),
                    val = $this.css('background-color'),
                    idx = $ul.data('idx'),
                    setting = self._settings[idx];

                $ul.rmClass('eruda-open');
                $ul.parent()
                    .find('.eruda-head span')
                    .css('background-color', val);

                setting.config.set(setting.key, val);
            });
    }
    static createCfg(name, data) {
        return new LocalStore('eruda-' + name, data);
    }
}

let progress = (val, min, max) =>
    (((val - min) / (max - min)) * 100).toFixed(2);
