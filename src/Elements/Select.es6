import util from '../lib/util'

export default class Select extends util.Emitter
{
    constructor()
    {
        super();

        var self = this;

        this._startListener = function (e)
        {
            if (util.isErudaEl(e.target)) return;

            self._timer = setTimeout(function ()
            {
                self.emit('select', e.target);
            }, 200);

            return false;
        };

        this._moveListener = function ()
        {
            clearTimeout(self._timer);
        };

        this._clickListener = function (e)
        {
            if (util.isErudaEl(e.target)) return;

            e.preventDefault();
            e.stopImmediatePropagation();
        };
    }
    enable()
    {
        this.disable();
        function addEvent(type, listener)
        {
            document.body.addEventListener(type, listener, true);
        }
        addEvent('touchstart', this._startListener);
        addEvent('touchmove', this._moveListener);
        addEvent('click', this._clickListener);

        return this;
    }
    disable()
    {
        function rmEvent(type, listener)
        {
            document.body.removeEventListener(type, listener, true);
        }
        rmEvent('touchstart', this._startListener);
        rmEvent('touchmove', this._moveListener);
        rmEvent('click', this._clickListener);

        return this;
    }
}
