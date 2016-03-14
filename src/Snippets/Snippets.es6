import Tool from '../DevTools/Tool.es6'

require('./Snippets.scss');

export default class Snippets extends Tool
{
    constructor()
    {
        super();
        this.name = 'Snippets';

        this._snippets = [];
        this._tpl = require('./Snippets.hbs');
    }
    init($el)
    {
        super.init($el);

        this._render();
    }
    add(name, fn)
    {
        this._snippets.push({
            name: name,
            fn: fn,
            result: ''
        });

        this._render();
    }
    _render()
    {
        this._$el.html(this._tpl());
    }
}