import util from '../lib/util'

export default class JsonViewer
{
    constructor(data, $el)
    {
        this._data = [data];
        this._$el = $el;

        this._appendTpl();
        this._bindEvent();
    }
    _appendTpl()
    {
        this._$el.html(jsonToHtml(this._data));
    }
    _bindEvent()
    {
        this._$el.on('click', 'li', function (e)
        {
            var $this = util.$(this),
                $firstSpan = util.$(this).find('span').eq(0);

            if (!$firstSpan.hasClass('eruda-expanded')) return;

            e.stopPropagation();

            var $ul = $this.find('ul').eq(0);
            if ($firstSpan.hasClass('eruda-collapsed'))
            {
                $firstSpan.rmClass('eruda-collapsed');
                $ul.show();
            } else
            {
                $firstSpan.addClass('eruda-collapsed');
                $ul.hide();
            }
        });
    }
}

function jsonToHtml(data)
{
    var ret = '';

    util.each(data, (val, key) => ret += createEl(key, val));

    return ret;
}

function createEl(key, val)
{
    var type = 'object',
        open = '{',
        close = '}';

    if (util.isArr(val))
    {
        type = 'array';
        open = '[';
        close = ']';
    }

    if (val === null)
    {
        return `<li>
                   <span class="eruda-key">${encode(key)}:</span>
                   <span class="eruda-null">null</span>
               </li>`;
    }
    if (util.isObj(val))
    {
        var obj = `<li>
                       <span class="eruda-expanded"></span>
                       <span class="eruda-key">${encode(key)}</span>
                       <span class="eruda-open">${open}</span>
                       <ul class="eruda-${type}">`;
        obj += jsonToHtml(val);
        return obj + `</ul><span class="eruda-close">${close}</span></li>`;
    }
    if (util.isNum(val) || util.isBool(val))
    {
        return `<li>
                   <span class="eruda-key">${encode(key)}: </span>
                   <span class="eruda-${typeof val}">${encode(val)}</span>
                </li>`;
    }

    return `<li>
                <span class="eruda-key">${encode(key)}: </span>
                <span class="eruda-${typeof val}">"${encode(val)}"</span>
            </li>`;
}

var encode = str => util.escape(util.toStr(str));