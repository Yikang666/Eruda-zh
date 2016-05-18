import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'
import beautify from 'js-beautify'
import highlight from '../lib/highlight.es6'
import JsonViewer from './JsonViewer.es6'

export default class Sources extends Tool
{
    constructor()
    {
        super();

        require('./Sources.scss');

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
    set(type, val)
    {
        if (type === 'img')
        {
            // _isInit is required to set true for async process.
            this._isInit = true;

            var img = new Image();

            var self = this;

            img.onload = function ()
            {
                self._data = {
                    type: 'img',
                    val: {
                        width: this.width,
                        height: this.height,
                        src: val
                    }
                };

                self._render();
            };

            img.src = val;

            return;
        }

        this._data = {type, val};

        this._render();

        return this;
    }
    show()
    {
        super.show();

        if (!this._isInit) this._reset();

        return this;
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

        this._$el.on('click', '.eruda-http .eruda-response', () =>
        {
            var data = this._data.val,
                resTxt = data.resTxt;

            switch (data.subType)
            {
                case 'css': return this.set('css', resTxt);
                case 'html': return this.set('html', resTxt);
                case 'javascript': return this.set('js', resTxt);
                case 'json': return this.set('json', resTxt);
            }
            switch (data.type)
            {
                case 'image': return this.set('img', data.url);
            }
        });
    }
    _loadTpl()
    {
        this._codeTpl = require('./code.hbs');
        this._imgTpl = require('./image.hbs');
        this._httpTpl = require('./http.hbs');
        this._jsonTpl = require('./json.hbs');
        this._rawTpl = require('./raw.hbs');
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
            case 'http':
                return this._renderHttp();
            case 'json':
                return this._renderJson();
            case 'raw':
                return this._renderRaw();
        }
    }
    _renderImg()
    {
        this._$el.html(this._imgTpl(this._data.val));
    }
    _renderHttp()
    {
        this._$el.html(this._httpTpl(this._data.val));
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
    _renderJson()
    {
        this._$el.html(this._jsonTpl());

        var val = this._data.val;

        try {
            if (util.isStr(val)) val = JSON.parse(val);
            new JsonViewer(val, this._$el.find('.eruda-json'));
        } catch (e) {}
    }
    _renderRaw()
    {
        this._$el.html(this._rawTpl({val: this._data.val}));
    }
}