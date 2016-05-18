import util from '../lib/util'

export default class NavBar extends util.Emitter
{
    constructor($el)
    {
        super();

        require('./NavBar.scss');

        this._$el = $el;
        this._len = 0;

        this._bindEvent();
    }
    add(name)
    {
        this._len++;
        this._$el.prepend(`<li class="${name}">${name}</li>`);
        this._resetWidth();
    }
    remove(name)
    {
        this._len--;
        this._$el.find(`li.${name}`).remove();
        this._resetWidth();
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

            if ($this.text() === name)
            {
                $this.addClass('eruda-active');
            } else
            {
                $this.rmClass('eruda-active');
            }
        });
    }
    _resetWidth()
    {
        this._$el.css({width: this._len * 69});
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