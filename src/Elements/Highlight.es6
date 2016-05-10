import util from '../lib/util'

require('./Highlight.scss');

export default class Highlight
{
    constructor($container)
    {
        this._appendTpl($container);
    }
    setEl(el)
    {
        this._$target = util.$(el);
        this._target = el;
    }
    show()
    {
        this._calSizeAndPos();
        this._$el.show();
    }
    hide()
    {
        this._$el.hide();
    }
    _calSizeAndPos()
    {
        var $target = this._$target;

        var {
                left,
                width,
                top,
                height
            } = $target.offset();

        this._$el.css({
            left: left,
            top: top,
            width: width,
            height: height
        });

        var computedStyle = getComputedStyle(this._target, '');

        function getNumStyle(name)
        {
            return pxToNum(computedStyle.getPropertyValue(name));
        }

        var ml = getNumStyle('margin-left'),
            mr = getNumStyle('margin-right'),
            mt = getNumStyle('margin-top'),
            mb = getNumStyle('margin-bottom');

        this._$margin.css({
            left: -ml,
            top: -mt,
            width: width + ml + mr,
            height: height + mt + mb
        });

        var bl = getNumStyle('border-left-width'),
            br = getNumStyle('border-right-width'),
            bt = getNumStyle('border-top-width'),
            bb = getNumStyle('border-bottom-width');

        var bw = width - bl - br,
            bh = height - bt - bb;

        this._$padding.css({
            left: bl,
            top: bt,
            width: bw,
            height: bh
        });

        var pl = getNumStyle('padding-left'),
            pr = getNumStyle('padding-right'),
            pt = getNumStyle('padding-top'),
            pb = getNumStyle('padding-bottom');

        this._$content.css({
            left: bl + pl,
            top: bl + pt,
            width: bw - pl - pr,
            height: bh - pt - pb
        });
    }
    _appendTpl($container)
    {
        $container.append(require('./Highlight.hbs')());

        this._$el = util.$('.eruda-elements-highlight');
        this._$margin = this._$el.find('.eruda-margin');
        this._$padding = this._$el.find('.eruda-padding');
        this._$content = this._$el.find('.eruda-content');
    }
}

function pxToNum(str)
{
    return util.toNum(str.replace('px', ''));
}