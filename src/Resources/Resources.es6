import Tool from '../DevTools/Tool.es6'
import util from '../util'

require('./Resources.scss');

export default class Resources extends Tool
{
    constructor()
    {
        super();
        this.name = 'resources';
        this._localStoreData = [];
        this._cookieData = [];
        this._scriptData = [];
        this._stylesheetData = [];
        this._imageData = [];
        this._tpl = require('./Resources.hbs');
    }
    init($el)
    {
        super.init($el);

        this.refreshLocalStorage()
            .refreshCookie()
            .refreshScript()
            .refreshStylesheet()
            .refreshImage();

        this._bindEvent();
    }
    refreshScript()
    {
        var scriptData = [];

        util.$('script').each(function ()
        {
            var src = this.src;

            if (src !== '') scriptData.push(src);
        });

        scriptData = util.unique(scriptData);

        this._scriptData = scriptData;
        this._render();

        return this;
    }
    refreshStylesheet()
    {
        var stylesheetData = [];

        util.$('link').each(function ()
        {
            if (this.rel !== 'stylesheet') return;

            stylesheetData.push(this.href);
        });

        stylesheetData = util.unique(stylesheetData);

        this._stylesheetData = stylesheetData;
        this._render();

        return this;
    }
    refreshLocalStorage()
    {
        var localStoreData = [];

        util.each(localStorage, function (val, key)
        {
            localStoreData.push({
                key: key,
                val: val
            });
        });

        this._localStoreData = localStoreData;
        this._render();

        return this;
    }
    refreshCookie()
    {
        var cookieData = [];

        var cookie = document.cookie;
        if (util.trim(cookie) !== '')
        {
            util.each(document.cookie.split(';'), function (val)
            {
                val = val.split('=');
                cookieData.push({
                    key: util.trim(val[0]),
                    val: decodeURIComponent(val[1])
                });
            });
        }

        this._cookieData = cookieData;
        this._render();

        return this;
    }
    refreshImage()
    {
        var imageData = [];

        util.$('img').each(function ()
        {
            var $this = util.$(this),
                src = $this.attr('src');

            if ($this.data('exclude') === 'true') return;

            imageData.push(src);
        });

        imageData = util.unique(imageData);

        this._imageData = imageData;
        this._render();

        return this;
    }
    _bindEvent()
    {
        var self = this;

        this._$el.on('click', '.refresh-local-storage', () =>
        {
            this.refreshLocalStorage();
        }).on('click', '.refresh-cookie', () =>
        {
            this.refreshCookie();
        }).on('click', '.refresh-script', () =>
        {
            this.refreshScript();
        }).on('click', '.refresh-image', () =>
        {
            this.refreshImage();
        }).on('click', '.delete-local-storage', function ()
        {
            var key = util.$(this).data('key');

            localStorage.removeItem(key);
            self.refreshLocalStorage();
        }).on('click', '.delete-cookie', function ()
        {
            var key = util.$(this).data('key');

            util.cookie.remove(key);
            self.refreshCookie();
        });

        util.orientation.on('change', () => this._render());
    }
    _render()
    {
        this._$el.html(this._tpl({
            localStoreData: this._localStoreData,
            cookieData: this._cookieData,
            scriptData: this._scriptData,
            stylesheetData: this._stylesheetData,
            imageData: this._imageData
        }));

        if (this._imageData.length === 0) return;

        setTimeout(() =>
        {
            var $li = this._$el.find('.image-list li');

            $li.css({height: $li.get(0).offsetWidth});
        }, 150);
    }
}