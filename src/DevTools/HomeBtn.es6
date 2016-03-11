import util from '../util'
import Draggabilly from 'draggabilly'

require('./HomeBtn.scss');

export default class HomeBtn
{
    constructor($parent)
    {
        this._$parent = $parent;

        this._appendTpl();
        this._makeDraggable();
        this._setPos();
        this._bindEvent();

        util.Emitter.mixin(this);
    }
    _appendTpl()
    {
        var $parent = this._$parent;

        $parent.append(require('./HomeBtn.hbs')());

        this._$el = $parent.find('.home-btn');
    }
    _setPos()
    {
        var wh = window.innerHeight,
            ww = window.innerWidth;

        this._$el.css({
            left: ww - 50,
            top: wh - 50
        });
    }
    _bindEvent()
    {
        this._draggabilly.on('staticClick', () => this.emit('click') );

        window.addEventListener('orientationchange', () =>
        {
            setTimeout(() =>
            {
                this._setPos();
            }, 150);
        }, false);
    }
    _makeDraggable()
    {
        this._draggabilly = new Draggabilly(this._$el.get(0), {
            containment: true
        });
    }
};