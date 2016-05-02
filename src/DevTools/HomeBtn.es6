import util from '../lib/util'
import Draggabilly from 'draggabilly'

require('./HomeBtn.scss');

export default class HomeBtn extends util.Emitter
{
    constructor($parent)
    {
        super();
        this._$parent = $parent;

        this._appendTpl();
        this._makeDraggable();
        this._setPos();
        this._bindEvent();
    }
    _appendTpl()
    {
        var $parent = this._$parent;

        $parent.append(require('./HomeBtn.hbs')());

        this._$el = $parent.find('.eruda-home-btn');
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
        this._draggabilly.on('staticClick', () => this.emit('click'));

        util.orientation.on('change', () => this._setPos());
    }
    _makeDraggable()
    {
        this._draggabilly = new Draggabilly(this._$el.get(0), {
            containment: true
        });
    }
};