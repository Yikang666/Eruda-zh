import util from '../util'

var Draggabilly = require('draggabilly');

require('!style!css!sass!./HomeBtn.scss');

export default class HomeBtn
{
    constructor($parent)
    {
        this._$parent = $parent;

        this._appendTpl();
        this._makeDraggable();
        this._bindEvent();

        util.Emitter.mixin(this);
    }
    _appendTpl()
    {
        var $parent = this._$parent;

        $parent.append(require('./HomeBtn.hbs')());

        this._$el = $parent.find('.home-btn');
    }
    _bindEvent()
    {
        this._draggabilly.on('staticClick', () => this.emit('click') );
    }
    _makeDraggable()
    {
        this._draggabilly = new Draggabilly(this._$el.get(0), {
            containment: true
        });
    }
};