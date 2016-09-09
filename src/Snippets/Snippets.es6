import Tool from '../DevTools/Tool.es6'
import defSnippets from './defSnippets.es6'
import util from '../lib/util'

export default class Snippets extends Tool
{
    constructor()
    {
        super();

        util.evalCss(require('./Snippets.scss'));

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
        this._snippets.push({name, fn, desc});

        this._render();

        return this;
    }
    remove(name)
    {
        let snippets = this._snippets;

        for (let i = 0, len = snippets.length; i < len; i++)
        {
            if (snippets[i].name === name) snippets.splice(i, 1);
        }

        this._render();

        return this;
    }
    clear()
    {
        this._snippets = [];
        this._render();

        return this;
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
        this._renderHtml(this._tpl({
            snippets: this._snippets
        }));
    }
    _renderHtml(html)
    {
        if (html === this._lastHtml) return;
        this._lastHtml = html;
        this._$el.html(html);
    }
}