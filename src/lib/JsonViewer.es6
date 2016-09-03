import util from './util'
import highlight from './highlight.es6'

export default class JsonViewer
{
    constructor(data, $el)
    {
        util.evalCss(require('./json.scss'));

        this._data = [data];
        this._$el = $el;

        this._appendTpl();
        this._bindEvent();
    }
    _appendTpl()
    {
        this._$el.html(jsonToHtml(this._data, true));
    }
    _bindEvent()
    {
        this._$el.on('click', 'li', function (e)
        {
            var $this = util.$(this),
                $firstSpan = util.$(this).find('span').eq(0);

            if (!$firstSpan.hasClass('eruda-expanded')) return;

            e.stopImmediatePropagation();

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

function jsonToHtml(data, firstLevel)
{
    var ret = '';

    for (let key in data)
    {
        if (key === 'erudaObjAbstract') continue;
        if (Object.hasOwnProperty.call(data, key)) ret += createEl(key, data[key], firstLevel);
    }

    return ret;
}

function createEl(key, val, firstLevel)
{
    var type = 'object',
        open = '{',
        close = '}';

    if (key === 'erudaProto') key = '__proto__';

    if (util.isArr(val))
    {
        type = 'array';
        open = '[';
        close = ']';
    }

    if (val === null)
    {
        return `<li>
                   ${wrapKey(key)}
                   <span class="eruda-null">null</span>
               </li>`;
    }
    if (util.isObj(val))
    {
        var obj = `<li>
                       <span class="eruda-expanded ${firstLevel ? '' : 'eruda-collapsed'}"></span>
                       ${firstLevel ? '' : wrapKey(key)}
                       <span class="eruda-open">${open} ${(val['erudaObjAbstract'] || '')}</span>
                       <ul class="eruda-${type}" ${firstLevel ? '' : 'style="display:none"'}>`;
        obj += jsonToHtml(val);
        return obj + `</ul><span class="eruda-close">${close}</span></li>`;
    }
    if (util.isNum(val) || util.isBool(val))
    {
        return `<li>
                   ${wrapKey(key)}
                   <span class="eruda-${typeof val}">${encode(val)}</span>
                </li>`;
    }
    if (util.isStr(val) && util.startWith(val, 'function'))
    {
        return `<li>
                   ${wrapKey(key)}
                   <span class="eruda-function">${val.length > 250 ? encode(val) : highlight(val, 'js')}</span>
                </li>`;
    }
    if (val === '(...)' || val === '[circular]' || val === 'undefined' || val === 'Symbol')
    {
        return `<li>
                   ${wrapKey(key)}
                   <span class="eruda-special">${val}</span>
                </li>`;
    }

    return `<li>
                ${wrapKey(key)}
                <span class="eruda-${typeof val}">"${encode(val)}"</span>
            </li>`;
}

function wrapKey(key)
{
    var keyClass = 'eruda-key';
    if (util.contain(LIGHTER_KEY, key)) keyClass = 'eruda-key-lighter';

    return `<span class="${keyClass}">${encode(key)}</span>: `;
}

const LIGHTER_KEY = ['__proto__', 'constructor', 'toString', 'valueOf'];

var encode = str => util.escape(util.toStr(str));