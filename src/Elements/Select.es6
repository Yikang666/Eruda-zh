import util from '../lib/util'

export default class Select extends util.Emitter
{
    constructor()
    {
        super();

        var self = this;

        this._startListener = function (e)
        {
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
    }
    enable()
    {
        this.disable();
        document.body.addEventListener('touchstart', this._startListener, true);
        document.body.addEventListener('touchmove', this._moveListener, true);

        return this;
    }
    disable()
    {
        document.body.removeEventListener('touchstart', this._startListener, true);
        document.body.removeEventListener('touchmove', this._moveListener, true);

        return this;
    }
}
