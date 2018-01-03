import Tool from '../DevTools/Tool';
import defInfo from './defInfo';
import {evalCss, each} from '../lib/util';

export default class Info extends Tool
{
    constructor()
    {
        super();

        this._style = evalCss(require('./Info.scss'));

        this.name = 'info';
        this._tpl = require('./Info.hbs');
        this._msgs = [];
    }
    init($el)
    {
        super.init($el);

        this._addDefInfo();
    }
    destroy() 
    {
        super.destroy();
        
        evalCss.remove(this._style);
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
        each(defInfo, info => this.add(info.name, info.val));
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