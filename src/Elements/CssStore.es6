import util from '../util'

function formatStyle(style)
{
    var ret = {};

    for (var i = 0, len = style.length; i < len; i++)
    {
        var name = style[i];

        if (style[name] === 'initial') continue;

        ret[name] = style[name];
    }

    return ret;
}

export default class CssStore
{
    constructor(el)
    {
        this._el = el;
    }
    getComputedStyle()
    {
        var computedStyle = window.getComputedStyle(this._el);

        return formatStyle(computedStyle);
    }
    getMatchedCSSRules()
    {
        var ret = [];

        util.each(document.styleSheets, (styleSheet) =>
        {
            util.each(styleSheet.cssRules, (cssRule) =>
            {
                if (!this._elMatchesSel(cssRule.selectorText)) return;

                ret.push({
                    selectorText: cssRule.selectorText,
                    style: formatStyle(cssRule.style)
                });
            });
        });

        return ret;
    }
    _elMatchesSel(selText)
    {
        return this._el.webkitMatchesSelector(selText);
    }
};