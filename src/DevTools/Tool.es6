export default class Tool
{
    init($el)
    {
        this._$el = $el;
    }
    show()
    {
        this._$el.show();
    }
    hide()
    {
        this._$el.hide();
    }
}