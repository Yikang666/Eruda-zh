import NavBar from './NavBar.es6'
import util from '../lib/util'
import Tool from './Tool.es6'
import config from '../lib/config.es6'

export default class DevTools extends util.Emitter
{
    constructor($parent)
    {
        super();

        util.evalCss(require('./DevTools.scss'));

        this.$parent = $parent;
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
        util.defaults(tool, new Tool());

        var name = tool.name;

        this._$tools.prepend(`<div class="eruda-${name} eruda-tool"></div>`);
        tool.init(this._$tools.find(`.eruda-${name}`), this);
        tool.active = false;
        this._tools[name] = tool;

        this._navBar.add(name);

        return this;
    }
    get(name)
    {
        var tool = this._tools[name];

        if (tool) return tool;
    }
    showTool(name)
    {
        if (this._curTool === name) return this;
        this._curTool = name;

        var tools = this._tools;

        var tool = tools[name];
        if (!tool) return;

        var lastTool = {};

        util.each(tools, (tool) =>
        {
            if (tool.active)
            {
                lastTool = tool;
                tool.active = false;
                tool.hide();
            }
        });

        tool.active = true;
        tool.show();

        this._navBar.activeTool(name);

        this.emit('showTool', name, lastTool);

        return this;
    }
    _initConfig()
    {
        var cfg = this.config = config.create('eruda-dev-tools');

        cfg.set(util.defaults(cfg.get(), {
            transparency: '100%',
            displaySize: '100%',
            tinyNavBar: false,
            activeEruda: false
        }));

        this._setTransparency(cfg.get('transparency'));
        this._setDisplaySize(cfg.get('displaySize'));
        this._setNavBarHeight(cfg.get('tinyNavBar') ? 30 : 55);

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'transparency': return this._setTransparency(val);
                case 'displaySize': return this._setDisplaySize(val);
                case 'activeEruda': return activeEruda(val);
                case 'tinyNavBar': return this._setNavBarHeight(val ? 30 : 55);
            }
        });
    }
    _setNavBarHeight(height)
    {
        this._$el.css('paddingTop', height);
        this._navBar.setHeight(height);
    }
    _setTransparency(opacity)
    {
        opacity = +opacity.replace('%', '') / 100;
        this._opacity = opacity;
        if (this._isShow) this._$el.css({opacity});
    }
    _setDisplaySize(height)
    {
        this._$el.css({height});
    }
    _appendTpl()
    {
        var $parent = this.$parent;

        $parent.append(require('./DevTools.hbs')());

        this._$el = $parent.find('.eruda-dev-tools');
        this._$tools = this._$el.find('.eruda-tools');
    }
    _initNavBar()
    {
        this._navBar = new NavBar(this._$el.find('.eruda-nav-bar'));
        this._navBar.on('showTool', (name) => this.showTool(name));
    }
}

var activeEruda = flag => window.localStorage.setItem('active-eruda', flag);

