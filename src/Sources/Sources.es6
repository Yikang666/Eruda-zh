import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'
import beautify from 'js-beautify'
import highlight from '../lib/highlight.es6'

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
    init($el, parent)
    {
        super.init($el);

        this._parent = parent;
        this._bindEvent();
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
        util.get(location.href, (err, data) =>
        {
            if (err) return;

            this._html = data;
            this._reset();
        });
    }
    _bindEvent()
    {
        this._parent.on('showTool', (name, lastTool) =>
        {
            if (name !== this.name && lastTool.name === this.name) this._reset();
        });
    }
    _loadTpl()
    {
        this._codeTpl = require('./code.hbs');
        this._imgTpl = require('./image.hbs');
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
            case 'img':
                return this._renderImg();
        }
    }
    _renderImg()
    {
        this._$el.html(this._imgTpl(this._data.val));
    }
    _renderCode()
    {
        var data = this._data;

        var code = data.val;

        // If source code too big, don't process it.
        if (data.val.length < 100000)
        {
            switch (data.type)
            {
                case 'html':
                    code = beautify.html(code);
                    break;
                case 'css':
                    code = beautify.css(code);
                    break;
                case 'js':
                    code = beautify(code);
                    break;
            }

            code = highlight(code, data.type);
        }

        this._$el.html(this._codeTpl({code: code}));
    }
}