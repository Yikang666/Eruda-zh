import NavBar from './NavBar.es6'
import util from '../lib/util'
import logger from '../lib/logger.es6'
import Tool from './Tool.es6'

export default class DevTools extends util.Emitter
{
    constructor($parent)
    {
        super();

        if (!util.isMobile()) util.evalCss(require('../style/scrollbar.css'));
        util.evalCss(require('./DevTools.scss'));

        this.$parent = $parent;
        this._isShow = false;
        this._opacity = 1;
        this._tools = {};

        this._appendTpl();
        this._initNavBar();
        this._initCfg();
    }
    show()
    {
        this._isShow = true;

        this._$el.show();
        this._navBar.resetStyle();

        // Need a delay after show to enable transition effect.
        setTimeout(() => 
        {
            this._$el.css('opacity', this._opacity)
        }, 50);

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
        let {init, show, hide} = new Tool();
        util.defaults(tool, {init, show, hide});

        let name = tool.name;
        if (!name) return logger.error('You must specify a name for a tool');
        name = name.toLowerCase();
        if (this._tools[name]) return logger.warn('Tool ' + name + ' already exists' );

        this._$tools.prepend(`<div class="eruda-${name} eruda-tool"></div>`);
        tool.init(this._$tools.find(`.eruda-${name}`), this);
        tool.active = false;
        this._tools[name] = tool;

        this._navBar.add(name);

        return this;
    }
    get(name)
    {
        let tool = this._tools[name];

        if (tool) return tool;
    }
    showTool(name)
    {
        if (this._curTool === name) return this;
        this._curTool = name;

        let tools = this._tools;

        let tool = tools[name];
        if (!tool) return;

        let lastTool = {};

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
    _initCfg()
    {
        let cfg = this.config = util.createCfg('dev-tools');

        cfg.set(util.defaults(cfg.get(), {
            transparency: '95%',
            displaySize: '80%',
            tinyNavBar: false,
            activeEruda: false
        }));

        this._setTransparency(cfg.get('transparency'));
        this._setDisplaySize(cfg.get('displaySize'));
        this.setNavBarHeight(cfg.get('tinyNavBar') ? 30 : 55);

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'transparency': return this._setTransparency(val);
                case 'displaySize': return this._setDisplaySize(val);
                case 'activeEruda': return activeEruda(val);
                case 'tinyNavBar': return this.setNavBarHeight(val ? 30 : 55);
            }
        });
    }
    setNavBarHeight(height)
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
        let $parent = this.$parent;

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

let localStore = util.safeStorage('local');

let activeEruda = flag => localStore.setItem('active-eruda', flag);

