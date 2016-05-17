import EntryBtn from './EntryBtn/EntryBtn.es6'
import DevTools from './DevTools/DevTools.es6'
import Console from './Console/Console.es6'
import Network from './Network/Network.es6'
import Elements from './Elements/Elements.es6'
import Snippets from './Snippets/Snippets.es6'
import Resources from './Resources/Resources.es6'
import Info from './Info/Info.es6'
import Features from './Features/Features.es6'
import Sources from './Sources/Sources.es6'
import Settings from './Settings/Settings.es6'
import util from './lib/util'
import config from './lib/config.es6'

module.exports = {
    init(options)
    {
        require('./style/style.scss');
        require('./style/reset.scss');
        require('./style/icon.css');

        options = options || {};
        util.defaults(options, {
            tool: ['console', 'elements', 'network', 'resources', 'sources', 'info', 'snippets', 'features']
        });
        options.tool = util.toArr(options.tool).reverse();
        this._options = options;

        this.config = config;
        this.util = util;

        this.Console = Console;
        this.Elements = Elements;
        this.Network = Network;
        this.Sources = Sources;
        this.Resources = Resources;
        this.Info = Info;
        this.Snippets = Snippets;
        this.Features = Features;

        this._initContainer();
        this._initDevTools();
        this._initEntryBtn();
        this._initSettings();
        this._initTools();
    },
    get(name)
    {
        return util.isUndef(name) ? this._devTools : this._devTools.get(name);
    },
    add(tool)
    {
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
        util.isUndef(name) ? this._devTools.show() : this._devTools.showTool(name);

        return this;
    },
    _initContainer()
    {
        var el;

        var container = this._options.container;
        if (util.isEl(container))
        {
            el = container;
        } else
        {
            el = document.createElement('div');
            document.documentElement.appendChild(el);
            el.id = 'eruda';
            el.className = 'eruda-container'
        }

        this._$el = util.$(el);
    },
    _initDevTools()
    {
        this._devTools = new DevTools(this._$el);
    },
    _initEntryBtn()
    {
        var entryBtn = this._entryBtn = new EntryBtn(this._$el);

        entryBtn.on('click', () => this._devTools.toggle());
    },
    _initSettings()
    {
        var devTools = this._devTools;

        var settings = new Settings();
        devTools.add(settings);

        settings.separator()
                .add(this._entryBtn.config, 'rememberPos', 'Remember Entry Button Position')
                .separator()
                .add(devTools.config, 'activeEruda', 'Always Activated')
                .add(devTools.config, 'transparent', 'Transparent')
                .add(devTools.config, 'halfScreen', 'Half Screen Size')
                .separator();
    },
    _initTools()
    {
        var tool = this._options.tool,
            devTools = this._devTools;

        tool.forEach(name =>
        {
            var Tool = this[util.upperFirst(name)];

            if (Tool) devTools.add(new Tool());
        });

        devTools.showTool(util.last(tool) || 'settings');
    }
};


