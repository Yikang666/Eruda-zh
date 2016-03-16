import Tool from '../DevTools/Tool.es6'
import CssStore from './CssStore.es6'
import util from '../util'

require('./Elements.scss');

function formatElName(tagName, id, className, attributes)
{
    var ret = tagName.toLowerCase();

    if (id !== '') ret += '#' + id;

    util.each(className.split(/\s+/g), (val) =>
    {
        if (util.trim(val) === '') return;

        ret += '.' + val;
    });

    util.each(attributes, (attr) =>
    {
        var name = attr.name;

        if (name === 'id' || name === 'class' || name === 'style') return;

        ret += ' ' + name + '="' + attr.value + '"';
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

function formatChildren(children)
{
    var ret = [];

    for (var i = 0, len = children.length; i < len; i++)
    {
        var child = children[i];
        if (child.id === 'eruda') break;
        ret.push(formatElName(child.tagName, child.id, child.className, child.attributes));
    }

    return ret;
}

function getAttrStyle(attribute)
{
    var ret = {
        selectorText: 'element.style',
        style: {}
    };

    for (var i = 0, len = attribute.length; i < len; i++)
    {
        var attr = attribute[i];

        if (attr.name === 'style')
        {
            var elStyle = {},
                rules = attr.value.split(';');

            util.each(rules, function (rule)
            {
                rule = rule.split(':');
                elStyle[rule[0]] = rule[1];
            });

            ret.style = elStyle;

            break;
        }
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

var noStyleTag = ['script', 'style', 'meta', 'title', 'link', 'head'];

function needNoStyle(tagName)
{
    tagName = tagName.toLowerCase();

    return noStyleTag.indexOf(tagName) > -1;
}

export default class Elements extends Tool
{
    constructor()
    {
        super();
        this.name = 'elements';
        this._tpl = require('./Elements.hbs');
        this._rmDefComputedStyle = true;
    }
    init($el)
    {
        super.init($el);

        $el.html('<div class="eruda-show-area"></div>');
        this._$showArea = $el.find('.eruda-show-area');
        $el.append(require('./BottomBar.hbs')());

        this._bindEvent();
        this._htmlEl = document.getElementsByTagName('html')[0];
        this._setEl(this._htmlEl, 0);
    }
    show()
    {
        super.show();

        this._render();
    }
    _back()
    {
        if (this._curEl === this._htmlEl) return;

        var parent = this._curEl.parentNode;

        this._setEl(parent, this._curLevel - 1);
    }
    _bindEvent()
    {
        var self = this;

        this._$el.on('click', '.eruda-child', function ()
        {
            var idx = util.$(this).data('idx');

            var el = self._curEl.children[idx],
                level = self._curLevel + 1;

            self._setEl(el, level);
        }).on('click', '.toggle-all-computed-style', () =>
        {
            this._toggleAllComputedStyle();
        });

        var $bottomBar = this._$el.find('.eruda-bottom-bar');

        $bottomBar.on('click', '.back', () => this._back())
                  .on('click', '.refresh', () => this._render())
                  .on('click', '.highlight', () => this._highlight())
                  .on('click', '.reset', () => this._setEl(this._htmlEl, 0));
    }
    _toggleAllComputedStyle()
    {
        this._rmDefComputedStyle = !this._rmDefComputedStyle;

        this._render();
    }
    _highlight()
    {
        this._$curEl.toggleClass('eruda-highlight');

        this._render();
    }
    _setEl(el, level)
    {
        if (this._$curEl) this._$curEl.rmClass('eruda-highlight');

        this._curEl = el;
        this._$curEl = util.$(el);
        this._curLevel = level;
        this._curCssStore = new CssStore(el);
        this._rmDefComputedStyle = true;

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
                children,
                attributes,
                textContent,
                tagName
            } = el;

        ret.children = formatChildren(children);
        ret.attributes = formatAttr(attributes);
        if (children.length === 0) ret.textContent = textContent;
        ret.name = formatElName(tagName, id, className, attributes) + '(' + this._curLevel + ')';

        if (needNoStyle(tagName)) return ret;

        var computedStyle = cssStore.getComputedStyle();
        if (this._rmDefComputedStyle) computedStyle = rmDefComputedStyle(computedStyle);
        ret.computedStyle = computedStyle;

        var styles = cssStore.getMatchedCSSRules();
        styles.unshift(getAttrStyle(attributes));
        ret.styles = styles;

        return ret;
    }
    _render()
    {
        this._$showArea.html(this._tpl(this._getData()));
    }
}