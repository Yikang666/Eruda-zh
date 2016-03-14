import Tool from '../DevTools/Tool.es6'

require('./Settings.scss');

export default class Settings extends Tool
{
    constructor()
    {
        super();
        this.name = 'settings';

        this._tpl = require('./Settings.hbs');
    }
    init($el)
    {
        super.init($el);
    }
}