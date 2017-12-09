import EntryBtn from './EntryBtn/EntryBtn';
import DevTools from './DevTools/DevTools';
import Tool from './DevTools/Tool';
import Console from './Console/Console';
import Network from './Network/Network';
import Elements from './Elements/Elements';
import Snippets from './Snippets/Snippets';
import Resources from './Resources/Resources';
import Info from './Info/Info';
import Sources from './Sources/Sources';
import Settings from './Settings/Settings';
import util from './lib/util';
import emitter from './lib/emitter';
import config from './lib/config';
import logger from './lib/logger';
import extraUtil from './lib/extraUtil';

module.exports = {
    init({container, tool, autoScale = true} = {})
    {
        this._isInit = true;
        this._scale = 1;

        this._initContainer(container);
        this._initStyle();
        this._initDevTools();
        this._initEntryBtn();
        this._initSettings();
        this._initTools(tool);
        this._registerListener();

        if (autoScale) this._autoScale();
    },
    _isInit: false,
    version: VERSION,
    config, util,
    Tool, Console, Elements, Network, Sources, Resources, Info, Snippets,
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
    remove(name) 
    {
        this._devTools.remove(name);

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
    destroy() 
    {
        this._devTools.destroy();
        delete this._devTools;
        this._entryBtn.destroy();
        delete this._entryBtn;
        this._unregisterListener();
        this._$el.remove();
        util.evalCss.clear();
    },
    scale(s) 
    {
        if (util.isNum(s)) 
        {
            this._scale = s;
            emitter.emit(emitter.SCALE, s);
            return this;
        }

        return this._scale;
    },
    _autoScale() 
    {
        if (!util.isMobile()) return;

        this.scale(1 / util.viewportScale());
    },
    _registerListener() 
    {
        this._addListener = (...args) => this.add(...args);
        this._showListener = (...args) => this.show(...args);

        emitter.on(emitter.ADD, this._addListener);
        emitter.on(emitter.SHOW, this._showListener);
        emitter.on(emitter.SCALE, util.evalCss.setScale);
    },
    _unregisterListener() 
    {
        emitter.off(emitter.ADD, this._addListener);
        emitter.off(emitter.SHOW, this._showListener);
        emitter.off(emitter.SCALE, util.evalCss.setScale);
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
        this._entryBtn = new EntryBtn(this._$el);
        this._entryBtn.on('click', () => this._devTools.toggle());
    },
    _initSettings()
    {
        let devTools = this._devTools,
            settings = new Settings();

        devTools.add(settings);
        
        this._entryBtn.initCfg(settings);
        devTools.initCfg(settings);
    },
    _initTools(tool = ['console', 'elements', 'network', 'resources', 'sources', 'info', 'snippets'])
    {
        tool = util.toArr(tool).reverse();

        let devTools = this._devTools;

        tool.forEach(name =>
        {
            let Tool = this[util.upperFirst(name)];
            try 
            {
                if (Tool) devTools.add(new Tool());
            } catch (e) 
            {
                // Use nextTick to make sure it is possible to be caught by console panel.
                util.nextTick(() => 
                {
                    logger.error(`Something wrong when initializing tool ${name}:`, e.message);
                });
            }
        });

        devTools.showTool(util.last(tool) || 'settings');
    }
};

extraUtil(util);

//# sourceMappingURL=index.js.map