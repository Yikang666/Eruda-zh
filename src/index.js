import EntryBtn from './EntryBtn/EntryBtn'
import DevTools from './DevTools/DevTools'
import Console from './Console/Console'
import Network from './Network/Network'
import Elements from './Elements/Elements'
import Snippets from './Snippets/Snippets'
import Resources from './Resources/Resources'
import Info from './Info/Info'
import Features from './Features/Features'
import Sources from './Sources/Sources'
import Settings from './Settings/Settings'
import util from './lib/util'
import emitter from './lib/emitter'
import config from './lib/config'
import logger from './lib/logger'
import extraUtil from './lib/extraUtil'

module.exports = {
    init({el, tool} = {})
    {
        this._isInit = true;

        this._initContainer(el);
        this._initStyle();
        this._initDevTools();
        this._initEntryBtn();
        this._initSettings();
        this._initTools(tool);
        this._registerListener();
    },
    _isInit: false,
    version: VERSION,
    config, util,
    Console, Elements, Network, Sources, Resources, Info, Snippets, Features,
    get(name)
    {
        if (!this._checkInit()) return;

        let devTools = this._devTools;

        return name ? devTools.get(name) : devTools;
    },
    add(tool)
    {
        if (!this._checkInit()) return;

        if (util.isFn(tool)) tool = tool(this);

        this._devTools.add(tool);

        return this;
    },
    show(name)
    {
        if (!this._checkInit()) return;

        let devTools = this._devTools;

        name ? devTools.showTool(name) : devTools.show();

        return this;
    },
    hide() 
    {
        if (!this._checkInit()) return;

        this._devTools.hide();

        return this;
    },
    _registerListener() 
    {
        emitter.on(emitter.ADD, (...args) => this.add(...args));
        emitter.on(emitter.SHOW, (...args) => this.show(...args));
    },
    _checkInit() 
    {
        if (!this._isInit) logger.error('Please call "eruda.init()" first');
        return this._isInit;
    },
    _initContainer(el)
    {
        if (!el)
        {
            el = document.createElement('div');
            document.documentElement.appendChild(el);
        }

        Object.assign(el, {
            id: 'eruda',
            className: 'eruda-container',
            contentEditable: false
        });

        // http://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari
        if (util.detectBrowser().name === 'ios') el.setAttribute('ontouchstart', '');

        this._$el = util.$(el);
    },
    _initDevTools()
    {
        this._devTools = new DevTools(this._$el);
    },
    _initStyle()
    {
        let className = 'eruda-style-container',
            $el = this._$el;

        $el.append(`<div class="${className}"></div>`);

        util.evalCss.container = $el.find(`.${className}`).get(0);
        util.evalCss(
            require('./style/style.scss') +
            require('./style/reset.scss') +
            require('./style/icon.css')
        );
    },
    _initEntryBtn()
    {
        this.entryBtn = new EntryBtn(this._$el);
        this.entryBtn.on('click', () => this._devTools.toggle());
    },
    _initSettings()
    {
        let devTools = this._devTools,
            settings = new Settings();

        devTools.add(settings);

        settings.separator()
                .switch(this.entryBtn.config, 'rememberPos', 'Remember Entry Button Position')
                .separator()
                .switch(devTools.config, 'activeEruda', 'Always Activated')
                .switch(devTools.config, 'tinyNavBar', 'Tiny Navigation Bar')
                .select(devTools.config, 'transparency', 'Transparency', ['100%', '95%', '90%', '85%', '80%', '75%', '70%'])
                .select(devTools.config, 'displaySize', 'Display Size', ['100%', '90%', '80%', '70%', '60%', '50%'])
                .separator();
    },
    _initTools(tool = ['console', 'elements', 'network', 'resources', 'sources', 'info', 'snippets', 'features'])
    {
        tool = util.toArr(tool).reverse();

        let devTools = this._devTools;

        tool.forEach(name =>
        {
            let Tool = this[util.upperFirst(name)];
            if (Tool) devTools.add(new Tool());
        });

        devTools.showTool(util.last(tool) || 'settings');
    }
};

extraUtil(util);
