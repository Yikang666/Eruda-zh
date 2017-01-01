import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'
import beautify from 'js-beautify'
import highlight from '../lib/highlight.es6'
import JsonViewer from '../lib/JsonViewer.es6'
import config from '../lib/config.es6'

export default class Sources extends Tool
{
    constructor()
    {
        super();

        util.evalCss(require('./Sources.scss'));

        this.name = 'sources';
        this._showLineNum = true;
        this._formatCode = true;

        this._loadTpl();
    }
    init($el, parent)
    {
        super.init($el);

        this._parent = parent;
        this._bindEvent();
        this._initConfig();
    }
    set(type, val)
    {
        if (type === 'img')
        {
            this._isFetchingData = true;

            let img = new Image();

            let self = this;

            img.onload = function ()
            {
                self._isFetchingData = false;
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
            img.onerror = function ()
            {
                self._isFetchingData = false;
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

        if (!this._data && !this._isFetchingData)
        {
            this._renderDef();
        }

        return this;
    }
    _renderDef()
    {
        if (this._html)
        {
            this._data = {
                type: 'html',
                val: this._html
            };

            return this._render();
        }

        if (this._isGettingHtml) return;
        this._isGettingHtml = true;

        util.get(location.href, (err, data) =>
        {
            this._isGettingHtml = false;
            if (err) return;

            this._html = data;
            this._renderDef();
        });
    }
    _bindEvent()
    {
        this._parent.on('showTool', (name, lastTool) =>
        {
            if (name !== this.name && lastTool.name === this.name)
            {
                delete this._data;
            }
        });

        this._$el.on('click', '.eruda-http .eruda-response', () =>
        {
            let data = this._data.val,
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
        this._iframeTpl = require('./iframe.hbs');
    }
    _initConfig()
    {
        let cfg = this.config = config.create('eruda-sources');

        cfg.set(util.defaults(cfg.get(), {
            'showLineNum': true,
            'formatCode': true
        }));

        if (!cfg.get('showLineNum')) this._showLineNum = false;
        if (!cfg.get('formatCode')) this._formatCode = false;

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'showLineNum': this._showLineNum = val; return;
                case 'formatCode': this._formatCode = val; return;
            }
        });

        var settings = this._parent.get('settings');
        settings.text('Sources')
                .switch(cfg, 'showLineNum', 'Show Line Numbers')
                .switch(cfg, 'formatCode', 'Beautify Code')
                .separator();
    }
    _render()
    {
        this._isInit = true;

        let data = this._data;

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
            case 'iframe':
                return this._renderIframe();
        }
    }
    _renderImg()
    {
        this._renderHtml(this._imgTpl(this._data.val));
    }
    _renderHttp()
    {
        let val = this._data.val;

        if (val.resTxt.trim() === '') delete val.resTxt;
        if (util.isEmpty(val.resHeaders)) delete val.resHeaders;

        this._renderHtml(this._httpTpl(this._data.val));
    }
    _renderCode()
    {
        let data = this._data;

        let code = data.val;

        // If source code too big, don't process it.
        if (data.val.length < 100000 && this._formatCode)
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
        } else
        {
            code = util.escape(code);
        }

        if (this._showLineNum)
        {
            code = code.split('\n').map((line, idx) =>
            {
                if (util.trim(line) === '') line = '&nbsp;';

                return {
                    idx: idx + 1,
                    val: line
                };
            });
        }

        this._renderHtml(this._codeTpl({
            code,
            showLineNum: this._showLineNum
        }));
    }
    _renderJson()
    {
        // Using cache will keep binding json events to the same elements.
        this._renderHtml(this._jsonTpl(), false);

        let val = this._data.val;

        try
        {
            if (util.isStr(val)) val = JSON.parse(val);
        /* eslint-disable no-empty */
        } catch (e) {}

        new JsonViewer(val, this._$el.find('.eruda-json'));
    }
    _renderRaw()
    {
        this._renderHtml(this._rawTpl({val: this._data.val}));
    }
    _renderIframe()
    {
        this._renderHtml(this._iframeTpl({src: this._data.val}));
    }
    _renderHtml(html, cache = true)
    {
        if (cache && html === this._lastHtml) return;
        this._lastHtml = html;
        this._$el.html(html);
        // Need setTimeout to make it work
        setTimeout(() => this._$el.get(0).scrollTop = 0, 0);
    }
}
