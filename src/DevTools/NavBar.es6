import util from '../lib/util'

export default class NavBar extends util.Emitter
{
    constructor($el)
    {
        super();

        util.evalCss(require('./NavBar.scss'));

        this._$el = $el;
        $el.html('<ul></ul><div class="eruda-bottom-bar"></div>');
        this._$ul = $el.find('ul');
        this._$bottomBar = $el.find('.eruda-bottom-bar');
        this._len = 0;
        this._height = 55;

        this._bindEvent();
    }
    add(name)
    {
        this._len++;
        this._$ul.prepend(`<li>${name}</li>`);
        this.resetStyle();
    }
    setHeight(height)
    {
        this._height = height;
        this.resetStyle();
    }
    activeTool(name)
    {
        let self = this;

        this._$ul.find('li').each(function ()
        {
            let $this = util.$(this);

            if ($this.text() === name)
            {
                $this.addClass('eruda-active');
                self._resetBottomBar();
            } else
            {
                $this.rmClass('eruda-active');
            }
        });
    }
    _resetBottomBar() 
    {
        let $bottomBar = this._$bottomBar;

        let li = this._$ul.find('.eruda-active').get(0);

        if (!li) return;
        
        $bottomBar.css({
            width: li.offsetWidth,
            left: li.offsetLeft
        });
    }
    resetStyle()
    {
        let height = this._height;

        this._$el.css('height', height);
        
        let $ul = this._$ul,
            $li = $ul.find('li');

        let ulWidth = 0;

        $li.each(function ()
        {
            ulWidth += this.offsetWidth;
        });
        $ul.css({width: ulWidth});
        this._resetBottomBar();

        $ul.find('li').css({
            'height': height,
            'lineHeight': height
        });
    }
    _bindEvent()
    {
        let self = this;

        this._$ul.on('click', 'li', function ()
        {
            self.emit('showTool', util.$(this).text());
        });
    }
}
