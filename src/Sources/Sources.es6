import Tool from '../DevTools/Tool.es6'

require('./Sources.scss');

export default class Sources extends Tool
{
    constructor()
    {
        super();
        this.name = 'sources';

        this._data = {
            type: ''
        };

        this._loadTpl();
    }
    init($el)
    {
        super.init($el);

        this._render();
    }
    set(data)
    {
        this._data = data;
    }
    _loadTpl()
    {
        this._emptyTpl = require('./empty.hbs');
    }
    _render()
    {
        var data = this._data;

        var tpl = this._emptyTpl;

        this._$el.html(tpl(data));
    }
}