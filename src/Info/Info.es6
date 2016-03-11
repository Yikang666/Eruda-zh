import Tool from '../DevTools/Tool.es6'
import util from '../util'
import defInfo from './defInfo.es6'

require('./Info.scss');

export default class Info extends Tool
{
    constructor()
    {
        super();
        this.name = 'info';
        this._tpl = require('./Info.hbs');
        this._msgs = [];
    }
    init($el)
    {
        super.init($el);

        this._addDefInfo();
    }
    add(name, val)
    {
        this._msgs.push({
            name: name,
            val: val
        });

        this._render();

        return this;
    }
    _addDefInfo()
    {
        util.each(defInfo, (info) =>
        {
            this.add(info.name, info.val);
        });
    }
    _render()
    {
        this._$el.html(this._tpl({
            messages: this._msgs
        }));
    }
}