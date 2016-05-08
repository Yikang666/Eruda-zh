import Tool from '../DevTools/Tool.es6'
import TreeView from './TreeView.es6'
import util from '../lib/util'

require('./Sources.scss');

export default class Sources extends Tool
{
    constructor()
    {
        super();
        this.name = 'sources';

        this._loadTpl();
        this._reset();
    }
    init($el)
    {
        super.init($el);

        this._render();
    }
    set(data)
    {
        this._data = data;
    }
    _reset()
    {
        this._data = {
            type: 'html',
            val: document.documentElement
        };
    }
    _loadTpl()
    {
        this._htmlTpl = require('./html.hbs');
    }
    _render()
    {
        var data = this._data;

        switch (data.type)
        {
            case 'html': return this._renderHtml();
        }
    }
    _renderHtml()
    {
        var data = this._data;

        var rootNode = data.val;

        this._$el.html(this._htmlTpl);
        new TreeView(this._$el.find('.eruda-tree'), getNodeChildren(rootNode));
    }
}

function getNodeChildren(rootNode)
{
    var ret = [];

    var children = rootNode.childNodes;
}