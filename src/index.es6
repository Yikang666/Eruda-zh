import HomeBtn from './HomeBtn/index.es6'
import util from './util'

require('!style!css!sass!./style.scss');

var $container;

var isDebugMode = /eruda=true/.test(window.location.search);

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

