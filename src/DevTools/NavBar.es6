import util from '../lib/util'

require('./NavBar.scss');

export default class NavBar extends util.Emitter
{
    constructor($el)
    {
        super();
        this._$el = $el;
        this._len = 0;

        this._bindEvent();
    }
    add(name)
    {
        this._len++;
        this._$el.append(`<li class="${name}">${name}</li>`)
                 .css({width: this._len * 69});
    }
    remove(name)
    {
        this._len--;
        this._$el.find(`li.${name}`).remove();
        this._$el.css({width: this._len * 69});
    }
    destroy()
    {
        this._$el.remove();    
    }
    activeTool(name)
    {
        var $el = this._$el;

        $el.find('li').each(function ()
        {
            var $this = util.$(this);

            $this[$this.text() === name ? 'addClass' : 'rmClass']('eruda-active');
        });
    }
    _bindEvent()
    {
        var self = this;

        this._$el.on('click', 'li', function ()
        {
            self.emit('showTool', util.$(this).text());
        });
    }
}