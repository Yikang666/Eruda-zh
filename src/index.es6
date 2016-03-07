import HomeBtn from './HomeBtn/index.es6'
import util from './util'

var $container;

var isDebugMode = /debug=true/.test(window.location.search);

if (isDebugMode)
{
    appendContainer();
    var homeBtn = new HomeBtn($container);
}

function appendContainer()
{
    util.$('body').append('<div id="eruda"></div>');
    $container = util.$('#eruda');
}

