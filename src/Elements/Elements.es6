import Tool from '../DevTools/Tool.es6'
import CssStore from './CssStore.es6'
import Highlight from './Highlight.es6'
import util from '../lib/util'

require('./Elements.scss');

export default class Elements extends Tool
{
    constructor()
    {
        super();
        this.name = 'elements';
        this._tpl = require('./Elements.hbs');
        this._rmDefComputedStyle = true;
        this._highlightElement = false;
    }
    init($el, parent)
    {
        super.init($el);

        this._parent = parent;

        $el.html('<div class="eruda-show-area"></div>');
        this._$showArea = $el.find('.eruda-show-area');
        $el.append(require('./BottomBar.hbs')());

        this._bindEvent();
        this._htmlEl = document.documentElement;
        this._initHighlight();
        this._setEl(this._htmlEl);
    }
    show()
    {
        super.show();

        this._render();
    }
    _back()
    {
        if (this._curEl === this._htmlEl) return;

        var parentQueue = this._curParentQueue;

        var parent = parentQueue.shift();
        while (!isElExist(parent)) parent = parentQueue.shift();

        this._setEl(parent);
    }
    _bindEvent()
    {
        var self = this;

        this._$el.on('click', '.eruda-child', function ()
        {
            var idx = util.$(this).data('idx');

            var curEl = self._curEl,
                el = curEl.childNodes[idx];

            if (!isElExist(el)) self._render();

            if (el.nodeType === 3)
            {
                var parent = self._parent,
                    sources = parent.get('sources');

                var curTagName = curEl.tagName,
                    type;

                switch (curTagName)
                {
                    case 'SCRIPT': type = 'js'; break;
                    case 'STYLE': type = 'css'; break;
                    default: return;
                }

                sources.set(type, el.nodeValue);

                parent.showTool('sources');
            }

            if (el.nodeType === 1) return self._setEl(el);
        }).on('click', '.toggle-all-computed-style', () =>
        {
            this._toggleAllComputedStyle();
        });

        var $bottomBar = this._$el.find('.eruda-bottom-bar');

        $bottomBar.on('click', '.back', () => this._back())
                  .on('click', '.refresh', () => this._render())
                  .on('click', '.highlight', function ()
                  {
                      util.$(this).toggleClass('eruda-active');
                      self._toggleHighlight()
                  })
                  .on('click', '.reset', () => this._setEl(this._htmlEl));
    }
    _toggleAllComputedStyle()
    {
        this._rmDefComputedStyle = !this._rmDefComputedStyle;

        this._render();
    }
    _initHighlight()
    {
        this._highlight = new Highlight(this._parent.$parent);
    }
    _toggleHighlight()
    {
        this._highlightElement = !this._highlightElement;

        this._render();
    }
    _setEl(el)
    {
        this._curEl = el;
        this._curCssStore = new CssStore(el);
        this._highlight.setEl(el);
        this._rmDefComputedStyle = true;
        window.$0 = el;

        var parentQueue = [];

        var parent = el.parentNode;
        while (parent)
        {
            parentQueue.push(parent);
            parent = parent.parentNode;
        }
        this._curParentQueue = parentQueue;

        this._render();
    }
    _getData()
    {
        var ret = {};

        var el = this._curEl,
            cssStore = this._curCssStore;

        var {
                className,
                id,
                attributes,
                tagName
            } = el;

        ret.children = formatChildNodes(el.childNodes);
        ret.attributes = formatAttr(attributes);
        ret.name = formatElName({tagName, id, className, attributes});

        if (needNoStyle(tagName)) return ret;

        var computedStyle = cssStore.getComputedStyle();
        if (this._rmDefComputedStyle) computedStyle = rmDefComputedStyle(computedStyle);
        ret.computedStyle = computedStyle;

        var styles = cssStore.getMatchedCSSRules();
        styles.unshift(getInlineStyle(el.style));
        ret.styles = styles;

        return ret;
    }
    _render()
    {
        if (!isElExist(this._curEl)) return this._back();

        this._highlight[this._highlightElement ? 'show' : 'hide']();
        this._$showArea.html(this._tpl(this._getData()));
    }
}

function isElExist(val)
{
    return util.isEl(val) && val.parentNode;
}

function formatElName(data)
{
    var {
            id,
            className,
            attributes
        } = data;

    var ret = `<span class="eruda-blue">${data.tagName.toLowerCase()}</span>`;

    if (id !== '') ret += `#${id}`;

    util.each(className.split(/\s+/g), (val) =>
    {
        if (util.trim(val) === '') return;

        ret += `.${val}`;
    });

    util.each(attributes, (attr) =>
    {
        var name = attr.name;

        if (name === 'id' || name === 'class' || name === 'style') return;

        ret += ` ' ${name}="${attr.value}"`;
    });

    return ret;
}

function formatAttr(attributes)
{
    var ret = [];

    for (var i = 0, len = attributes.length; i < len; i++)
    {
        var attr = attributes[i];
        ret.push({
            name: attr.name,
            value: attr.value
        });
    }

    return ret;
}

function formatChildNodes(nodes)
{
    var ret = [];

    for (var i = 0, len = nodes.length; i < len; i++)
    {
        var child = nodes[i];
        if (child.nodeType === 3)
        {
            var val = util.trim(child.nodeValue);
            if (val !== '') ret.push({
                text: val,
                idx: i
            });
            continue;
        }
        if (child.nodeType === 1 &&
            child.id !== 'eruda' &&
            child.className.indexOf('eruda') < 0)
        {
            ret.push({
                text: formatElName({
                    tagName: child.tagName,
                    id: child.id,
                    className: child.className,
                    attributes: child.attributes
                }),
                idx: i
            });
        }
    }

    return ret;
}

function getInlineStyle(style)
{
    var ret = {
        selectorText: 'element.style',
        style: {}
    };

    for (var i = 0, len = style.length; i < len; i++)
    {
        var s = style[i];

        ret.style[s] = style[s];
    }

    return ret;
}

var defComputedStyle = require('./defComputedStyle.json');

function rmDefComputedStyle(computedStyle)
{
    var ret = {};

    util.each(computedStyle, (val, key) =>
    {
        if (val === defComputedStyle[key]) return;

        ret[key] = val;
    });

    return ret;
}

var NO_STYLE_TAG = ['script', 'style', 'meta', 'title', 'link', 'head'];

function needNoStyle(tagName)
{
    tagName = tagName.toLowerCase();

    return NO_STYLE_TAG.indexOf(tagName) > -1;
}
