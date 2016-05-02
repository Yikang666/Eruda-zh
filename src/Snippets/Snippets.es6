import Tool from '../DevTools/Tool.es6'
import defSnippets from './defSnippets.es6'
import util from '../lib/util'

require('./Snippets.scss');

export default class Snippets extends Tool
{
    constructor()
    {
        super();
        this.name = 'snippets';

        this._snippets = [];
        this._tpl = require('./Snippets.hbs');
    }
    init($el)
    {
        super.init($el);

        this._bindEvent();
        this._addDefSnippets();
    }
    add(name, fn, desc)
    {
        this._snippets.push({
            name: name,
            fn: fn,
            desc: desc
        });

        this._render();
    }
    _bindEvent()
    {
        var self = this;

        this._$el.on('click', '.run', function I()
        {
            var idx = util.$(this).data('idx');

            self._run(idx);
        });
    }
    _run(idx)
    {
        this._snippets[idx].fn.call(null);
    }
    _addDefSnippets()
    {
        util.each(defSnippets, (snippet) =>
        {
            this.add(snippet.name, snippet.fn, snippet.desc);
        });
    }
    _render()
    {
        this._$el.html(this._tpl({
            snippets: this._snippets
        }));
    }
}