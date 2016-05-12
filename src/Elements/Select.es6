import util from '../lib/util'

export default class Select extends util.Emitter
{
    constructor()
    {
        super();

        var self = this;

        this._listener = function (e)
        {
            self.emit('select', e.target);

            e.preventDefault();

            return false;
        };
    }
    enable()
    {
        this.disable();
        document.body.addEventListener('touchstart', this._listener, true);

        return this;
    }
    disable()
    {
        document.body.removeEventListener('touchstart', this._listener, true);

        return this;
    }
}
