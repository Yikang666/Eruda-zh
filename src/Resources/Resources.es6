import Tool from '../DevTools/Tool.es6'
import util from '../util'

require('./Resources.scss');

export default class Resources extends Tool
{
    constructor()
    {
        super();
        this.name = 'resources';
        this._tpl = require('./Resources.hbs');
    }
    init($el)
    {
        super.init($el);

        this.refresh();
    }
    refresh()
    {
        var localStoreData = [],
            cookieData = [];

        util.each(localStorage, function (val, key)
        {
            localStoreData.push({
                key: key,
                val: val
            });
        });

        util.each(document.cookie.split(';'), function (val)
        {
            val = val.split('=');
            cookieData.push({
                key: val[0],
                val: decodeURIComponent(val[1])
            });
        });

        this._$el.html(this._tpl({
            localStoreData: localStoreData,
            cookieData: cookieData
        }));
    }
}