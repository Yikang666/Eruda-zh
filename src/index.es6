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
    init(options = {})
    {
        require('./style/style.scss');
        require('./style/reset.scss');
        require('./style/icon.css');

        util.defaults(options, {
            tool: ['console', 'elements', 'network', 'resources', 'sources', 'info', 'snippets', 'features']
        });
        options.tool = util.toArr(options.tool).reverse();
        this._options = options;

        this._initContainer();
        this._initDevTools();
        this._initEntryBtn();
        this._initSettings();
        this._initTools();
    },
    config, util,
    Console, Elements, Network, Sources, Resources, Info, Snippets, Features,
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
        let el = this._options.container;

        if (!el)
        {
            el = document.createElement('div');
            document.documentElement.appendChild(el);
        }
        el.id = 'eruda';
        el.className = 'eruda-container';

        this._$el = util.$(el);
    },
    _initDevTools()
    {
        this._devTools = new DevTools(this._$el);
    },
    _initEntryBtn()
    {
        let entryBtn = this._entryBtn = new EntryBtn(this._$el);

        entryBtn.on('click', () => this._devTools.toggle());
    },
    _initSettings()
    {
        let devTools = this._devTools,
            settings = new Settings();

        devTools.add(settings);

        settings.separator()
                .switch(this._entryBtn.config, 'rememberPos', 'Remember Entry Button Position')
                .separator()
                .switch(devTools.config, 'activeEruda', 'Always Activated')
                .select(devTools.config, 'transparency', 'Transparency', ['100%', '95%', '90%', '85%', '80%', '75%', '70%'])
                .select(devTools.config, 'displaySize', 'Display Size', ['100%', '90%', '80%', '70%', '60%', '50%'])
                .separator();
    },
    _initTools()
    {
        let tool = this._options.tool,
            devTools = this._devTools;

        tool.forEach(name =>
        {
            let Tool = this[util.upperFirst(name)];
            if (Tool) devTools.add(new Tool());
        });

        devTools.showTool(util.last(tool) || 'settings');
    }
};
