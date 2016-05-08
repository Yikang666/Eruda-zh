import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'
import beautify from 'js-beautify'
import highlight from './highlight.es6'

require('./Sources.scss');

export default class Sources extends Tool
{
    constructor()
    {
        super();
        this.name = 'sources';
        this._isInit = false;

        this._loadTpl();
    }
    init($el)
    {
        super.init($el);
    }
    set(data)
    {
        this._data = data;

        this._render();
    }
    show()
    {
        super.show();

        if (!this._isInit) this._reset();
    }
    _reset()
    {
        if (this._html)
        {
            this._data = {
                type: 'html',
                val: this._html
            };

            return this._render();
        }
        get(location.href, (err, data) =>
        {
            if (err) return;

            this._html = data;
            this._reset();
        });
    }
    _loadTpl()
    {
        this._codeTpl = require('./code.hbs');
    }
    _render()
    {
        this._isInit = true;

        var data = this._data;

        switch (data.type)
        {
            case 'html':
            case 'js':
            case 'css':
                return this._renderCode();
        }
    }
    _renderCode()
    {
        var data = this._data;

        var code = '';

        switch (data.type)
        {
            case 'html':
                code = beautify.html(data.val);
                break;
            case 'css':
                code = beautify.css(data.val);
                break;
            case 'js':
                code = beautify(data.val);
                break;
        }

        code = highlight(code, data.type);

        this._$el.html(this._codeTpl({code: code}));
    }
}

function get(url, cb)
{
    var xhr = new window.XMLHttpRequest();

    xhr.onload = function ()
    {
        var status = xhr.status;

        if ((status >= 200 && status < 300) || status === 304)
        {
            cb(null, xhr.responseText);
        }
    };

    xhr.onerror = function () { cb(xhr) };

    xhr.open('GET', url);
    xhr.send();
}