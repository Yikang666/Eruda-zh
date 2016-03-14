import HomeBtn from './DevTools/HomeBtn.es6'
import DevTools from './DevTools/DevTools.es6'
import Console from './Console/Console.es6'
import Network from './Network/Network.es6'
import Elements from './Elements/Elements.es6'
import Snippets from './Snippets/Sinppets.es6'
import Resources from './Resources/Resources.es6'
import Info from './Info/Info.es6'
import Features from './Features/Features.es6'
import Settings from './Settings/Settings.es6'
import util from './util'

require('./style.scss');

var $container;

var isDebugMode = /eruda=true/.test(window.location.search);

if (isDebugMode)
{
    appendContainer();

    var devTools = new DevTools($container);

    var homeBtn = new HomeBtn($container);

    homeBtn.on('click', () => devTools.toggle());

    devTools.add(new Console())
            .add(new Network())
            .add(new Elements())
            .add(new Snippets())
            .add(new Resources())
            .add(new Info())
            .add(new Features())
            .add(new Settings())
            .showTool('console')
            .show();
}

function appendContainer()
{
    util.$('body').append('<div id="eruda"></div>');
    $container = util.$('#eruda');
}

export default {
    get: function (name)
    {
        return devTools.get(name);
    }
};

