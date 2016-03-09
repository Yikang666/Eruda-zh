require('!style!css!sass!./NavBar.scss');

export default class NavBar
{
    constructor($el)
    {
        this._$el = $el;

        this.render();
    }
    render()
    {
        this._$el.append(require('./NavBar.hbs')());
    }
}