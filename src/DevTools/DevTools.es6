import NavBar from './NavBar.es6'
import util from '../util'
import config from '../config/config.es6'

require('./DevTools.scss');

function activeEruda(flag)
{
    window.localStorage.setItem('active-eruda', flag);
}

export default class DevTools
{
    constructor($parent)
    {
        this._$parent = $parent;
        this._isShow = false;
        this._opacity = 1;
        this._tools = {};

        this._appendTpl();
        this._initNavBar();
        this._initConfig();
    }
    show()
    {
        this._isShow = true;

        this._$el.show();
        // Need a delay after show to enable transition effect.
        setTimeout(() => this._$el.css('opacity', this._opacity), 50);

        return this;
    }
    hide()
    {
        this._isShow = false;

        this._$el.css({opacity: 0});
        setTimeout(() => this._$el.hide(), 300);

        return this;
    }
    toggle()
    {
        return this._isShow ? this.hide() : this.show();
    }
    add(tool)
    {
        var name = tool.name;

        this._$tools.append('<div class="eruda-' + name + ' eruda-tool"></div>');
        tool.init(this._$tools.find('.eruda-' + name));
        tool.active = false;
        this._tools[name] = tool;

        this._navBar.add(name);

        return this;
    }
    remove(name)
    {
        var tool = this._tools[name];

        delete this._tools[name];
        this._navBar.remove(name);

        tool.destroy();
        if (tool.active)
        {
            var keys = util.keys(this._tools);
            if (keys.length > 0) this.showTool(keys[0]);
        }

        return this;
    }
    get(name)
    {
        var tool = this._tools[name];

        if (tool) return tool;
    }
    destroy()
    {
        util.each(this._tools, (tool, key) => this.remove(key));
        this._navBar.destroy();
        this._$el.remove();
    }
    showTool(name)
    {
        var tools = this._tools;

        var tool = tools[name];
        if (!tool) return;

        util.each(tools, (tool) =>
        {
            tool.active = false;
            tool.hide();
        });

        tool.active = true;
        tool.show();

        this._navBar.activeTool(name);

        return this;
    }
    _initConfig()
    {
        var cfg = this.config = config.create('eruda-dev-tools');

        cfg.set(util.defaults(cfg.get(), {
            transparent: false,
            halfScreen: false,
            activeEruda: false
        }));

        if (cfg.get('transparent')) this._setTransparency(true);
        if (cfg.get('halfScreen')) this._setHalfScreen(true);

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'transparent': return this._setTransparency(val);
                case 'halfScreen': return this._setHalfScreen(val);
                case 'activeEruda': return activeEruda(val);
            }
        });
    }
    _setTransparency(flag)
    {
        this._opacity = flag ? 0.9 : 1;
        if (this._isShow) this._$el.css({opacity: this._opacity});
    }
    _setHalfScreen(flag)
    {
        this._$el.css({
            height: flag ? '50%': '100%'
        });
    }
    _appendTpl()
    {
        var $parent = this._$parent;

        $parent.append(require('./DevTools.hbs')());

        this._$el = $parent.find('.eruda-dev-tools');
        this._$tools = this._$el.find('.eruda-tools');
    }
    _initNavBar()
    {
        this._navBar = new NavBar(this._$el.find('.eruda-nav-bar ul'));
        this._navBar.on('showTool', (name) =>
        {
            this.showTool(name);
        });
    }
}