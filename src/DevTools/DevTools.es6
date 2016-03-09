import NavBar from './NavBar.es6'

require('!style!css!sass!./DevTools.scss');

export default class DevTools
{
    constructor($parent)
    {
        this._$parent = $parent;
        this._isShow = false;
        this._tools = {};

        this._appendTpl();
        this._initNavBar();
    }
    _appendTpl()
    {
        var $parent = this._$parent;

        $parent.append(require('./DevTools.hbs')());

        this._$el = $parent.find('.dev-tools');
        this._$tools = this._$el.find('.tools');
    }
    _initNavBar()
    {
        this._navBar = new NavBar(this._$el.find('.nav-bar'));
    }
    show()
    {
        this._isShow = true;

        this._$el.addClass('show').rmClass('hide');
    }
    hide()
    {
        this._isShow = false;

        this._$el.addClass('hide').rmClass('show');
        setTimeout(() => this._$el.rmClass('hide'), 3000);
    }
    toggle()
    {
        this._isShow ? this.hide() : this.show();
    }
    add(tool)
    {
        var name = tool.name;

        this._$tools.append('<div class="' + name + ' tool"></div>');
        tool.init(this._$tools.find('.' + name));
        this._tools[name] = tool;
    }
}