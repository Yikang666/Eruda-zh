import util from '../lib/util'

export default class Select extends util.Emitter
{
    constructor()
    {
        super();

        var self = this;

        this._listener = function (e)
        {
            self.disable().emit('select', e.target);

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

const CLASS_NAME = 'eruda-elements-select';