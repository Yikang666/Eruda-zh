import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'
import defInfo from './defInfo.es6'

export default class Info extends Tool
{
    constructor()
    {
        super();

        util.evalCss(require('./Info.scss'));

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
        this._msgs.push({name, val});

        this._render();

        return this;
    }
    remove(name)
    {
        let msgs = this._msgs;

        for (let i = 0, len = msgs.length; i < len; i++)
        {
            if (msgs[i].name === name) msgs.splice(i, 1);
        }

        this._render();

        return this;
    }
    clear()
    {
        this._msgs = [];

        this._render();

        return this;
    }
    _addDefInfo()
    {
        util.each(defInfo, info => this.add(info.name, info.val));
    }
    _render()
    {
        this._renderHtml(this._tpl({messages: this._msgs}));
    }
    _renderHtml(html)
    {
        if (html === this._lastHtml) return;
        this._lastHtml = html;
        this._$el.html(html);
    }
}