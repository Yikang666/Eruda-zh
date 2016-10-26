import util from '../lib/util'
import Draggabilly from 'draggabilly'
import config from '../lib/config.es6'

export default class EntryBtn extends util.Emitter
{
    constructor($parent)
    {
        super();

        util.evalCss(require('./EntryBtn.scss'));

        this._$parent = $parent;
        this._appendTpl();
        this._makeDraggable();
        this._initConfig();
        this._setPos();
        this._bindEvent();
    }
    _appendTpl()
    {
        var $parent = this._$parent;

        $parent.append(require('./EntryBtn.hbs')());
        this._$el = $parent.find('.eruda-entry-btn');
    }
    _setPos(orientationChanged)
    {
        var cfg = this.config,
            pos = cfg.get('pos'),
            defPos = getDefPos();

        var outOfRange = pos.x > defPos.x + 10 ||
                         pos.x < 0 ||
                         pos.y < 0 ||
                         pos.y > defPos.y + 10;

        if (outOfRange ||
            !cfg.get('rememberPos') ||
            orientationChanged) pos = defPos;

        this._$el.css({
            left: pos.x,
            top: pos.y
        });

        cfg.set('pos', pos);
    }
    _bindEvent()
    {
        var draggabilly = this._draggabilly,
            $el = this._$el;

        draggabilly.on('staticClick', () => this.emit('click'))
                   .on('dragStart', () => $el.addClass('eruda-active'));

        draggabilly.on('dragEnd', () =>
        {
            var cfg = this.config;

            if (cfg.get('rememberPos'))
            {
                cfg.set('pos', {
                    x: util.pxToNum(this._$el.css('left')),
                    y: util.pxToNum(this._$el.css('top'))
                });
            }

            $el.rmClass('eruda-active');
        });

        util.orientation.on('change', () => this._setPos(true));
    }
    _makeDraggable()
    {
        this._draggabilly = new Draggabilly(this._$el.get(0), {containment: true});
    }
    _initConfig()
    {
        var cfg = this.config = config.create('eruda-home-button');

        cfg.set(util.defaults(cfg.get(), {
            rememberPos: true,
            pos: getDefPos()
        }));
    }
}

var getDefPos = () =>
{
    return {
        x: window.innerWidth - 50,
        y: window.innerHeight - 50
    };
};