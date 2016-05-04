import HomeBtn from './EntryBtn/EntryBtn.es6'
import DevTools from './DevTools/DevTools.es6'
import Console from './Console/Console.es6'
import Network from './Network/Network.es6'
import Elements from './Elements/Elements.es6'
import Snippets from './Snippets/Snippets.es6'
import Resources from './Resources/Resources.es6'
import Info from './Info/Info.es6'
import Features from './Features/Features.es6'
import Settings from './Settings/Settings.es6'
import util from './lib/util'
import config from './lib/config.es6'

require('./style.scss');
require('./icon.css');

var $container;

appendContainer();

var devTools = new DevTools($container);

var homeBtn = new HomeBtn($container);

homeBtn.on('click', () => devTools.toggle());

var consoleTool = new Console(),
    network = new Network(),
    elements = new Elements(),
    snippets = new Snippets(),
    resources = new Resources(),
    info = new Info(),
    features = new Features(),
    settings = new Settings();

devTools.add(consoleTool)
        .add(elements)
        .add(network)
        .add(resources)
        .add(info)
        .add(snippets)
        .add(features)
        .add(settings)
        .showTool('console');

settings.separator()
        .add(devTools.config, 'activeEruda', 'Always Activated')
        .separator()
        .add(homeBtn.config, 'rememberPos', 'Remember Entry Button Position')
        .separator()
        .add(devTools.config, 'transparent', 'Transparent')
        .add(devTools.config, 'halfScreen', 'Half Screen Size')
        .separator()
        .add(consoleTool.config, 'catchGlobalErr', 'Catch Global Errors')
        .add(consoleTool.config, 'overrideConsole', 'Override Console');

function appendContainer()
{
    if (eruda) eruda.destroy();
    util.$('body').append('<div id="eruda"></div>');
    $container = util.$('#eruda');
}

module.exports = {
    get(name)
    {
        return util.isUndef(name) ? devTools : devTools.get(name);
    },
    add(tool)
    {
        devTools.add(tool);

        return this;
    },
    remove(name)
    {
        devTools.remove(name);

        return this;
    },
    show(name)
    {
        util.isUndef(name) ? devTools.show() : devTools.showTool(name);

        return this;
    },
    destroy()
    {
        devTools.destroy();
        $container.remove();
        window.eruda = undefined;
    },
    config,
    util
};

