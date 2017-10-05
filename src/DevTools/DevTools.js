import NavBar from './NavBar'
import util from '../lib/util'
import logger from '../lib/logger'
import Tool from './Tool'

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
    initCfg(settings)
    {
        let cfg = this.config = util.createCfg('dev-tools');

        cfg.set(util.defaults(cfg.get(), {
            transparency: 0.95,
            displaySize: 80,
            tinyNavBar: !util.isMobile(),
            activeEruda: false,
            navBarBgColor: '#2196f3'
        }));

        this._setTransparency(cfg.get('transparency'));
        this._setDisplaySize(cfg.get('displaySize'));
        this.setNavBarHeight(cfg.get('tinyNavBar') ? 30 : 55);
        this._navBar.setBgColor(cfg.get('navBarBgColor'));

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'transparency': return this._setTransparency(val);
                case 'displaySize': return this._setDisplaySize(val);
                case 'activeEruda': return activeEruda(val);
                case 'tinyNavBar': return this.setNavBarHeight(val ? 30 : 55);
                case 'navBarBgColor': return this._navBar.setBgColor(val);
            }
        });

        settings.separator()
                .switch(cfg, 'activeEruda', 'Always Activated')
                .switch(cfg, 'tinyNavBar', 'Tiny Navigation Bar')
                .color(cfg, 'navBarBgColor', 'Navigation Bar Background Color')
                .range(cfg, 'transparency', 'Transparency', {min: 0.2, max: 1, step: 0.01})
                .range(cfg, 'displaySize', 'Display Size', {min: 40, max: 100, step: 1})
                .separator();
    }
    setNavBarHeight(height)
    {
        this._$el.css('paddingTop', height);
        this._navBar.setHeight(height);
    }
    _setTransparency(opacity)
    {
        if (!util.isNum(opacity)) return;

        this._opacity = opacity;
        if (this._isShow) this._$el.css({opacity});
    }
    _setDisplaySize(height)
    {
        if (!util.isNum(height)) return;
        
        this._$el.css({height: height + '%'});
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

