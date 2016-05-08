require('./TreeView.scss');

export default class TreeView
{
    constructor($parent, initialData)
    {
        this._$parent = $parent;
        this._data = initialData;
    }
}