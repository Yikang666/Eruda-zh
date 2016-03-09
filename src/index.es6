import HomeBtn from './DevTools/HomeBtn.es6'
import DevTools from './DevTools/DevTools.es6'
import Console from './Console/Console.es6'
import util from './util'

require('!style!css!sass!./style.scss');

var $container;

var isDebugMode = /eruda=true/.test(window.location.search);

if (isDebugMode)
{
    appendContainer();

    var devTools = new DevTools($container);

    var homeBtn = new HomeBtn($container);

    homeBtn.on('click', () => devTools.toggle());

    devTools.add(new Console());

    devTools.show();
}

function appendContainer()
{
    util.$('body').append('<div id="eruda"></div>');
    $container = util.$('#eruda');
}

