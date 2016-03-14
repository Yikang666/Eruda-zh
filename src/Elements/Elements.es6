import Tool from '../DevTools/Tool.es6'
import util from '../util'

require('./Elements.scss');

export default class Elements extends Tool
{
    constructor()
    {
        super();
        this.name = 'elements';
        this._tpl = require('./Elements.hbs');
    }
    init($el)
    {
        super.init($el);

        this._curEl = document.getElementsByTagName('html')[0];

        this._render();
    }
    _getData()
    {
        var el = this._curEl;

        console.dir(el);

        return {
            classList: el.classList
        };
    }
    _render()
    {
        this._$el.html(this._tpl(this._getData()));
    }
}