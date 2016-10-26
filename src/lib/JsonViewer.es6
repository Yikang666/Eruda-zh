import util from './util'

export default class JsonViewer
{
    constructor(data, $el)
    {
        util.evalCss(require('./json.scss'));

        this._data = [data];
        this._$el = $el;
        this._map = {};

        this._appendTpl();
        this._bindEvent();
    }
    _appendTpl()
    {
        this._$el.html(jsonToHtml(this._data, this._map, true));
    }
    _bindEvent()
    {
        let map = this._map;

        this._$el.on('click', 'li', function (e)
        {
            let $this = util.$(this),
                circularId = $this.data('object-id'),
                $firstSpan = util.$(this).find('span').eq(0);

            if ($this.data('first-level')) return;
            if (circularId)
            {
                $this.find('ul').html(jsonToHtml(map[circularId], map, false));
                $this.rmAttr('data-object-id');
            }

            if (!$firstSpan.hasClass('eruda-expanded')) return;

            e.stopImmediatePropagation();

            let $ul = $this.find('ul').eq(0);
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

function jsonToHtml(data, map, firstLevel)
{
    let ret = '';

    for (let key in data)
    {
        let val = data[key];

        if (key === 'erudaObjAbstract' ||
            key === 'erudaCircular' ||
            key === 'erudaId' ||
            (util.isStr(val) && util.startWith(val, 'erudaJson'))) continue;

        if (Object.hasOwnProperty.call(data, key)) ret += createEl(key, val, map, firstLevel);
    }

    return ret;
}

function createEl(key, val, map, firstLevel = false)
{
    let type = 'object',
        isUnenumerable = false,
        id;

    if (key === 'erudaProto') key = '__proto__';
    if (util.startWith(key, 'erudaUnenumerable'))
    {
        key = util.trim(key.replace('erudaUnenumerable', ''));
        isUnenumerable = true;
    }

    if (util.isArr(val)) type = 'array';

    function wrapKey(key)
    {
        if (firstLevel) return '';

        let keyClass = 'eruda-key';
        if (isUnenumerable || util.contain(LIGHTER_KEY, key)) keyClass = 'eruda-key-lighter';

        return `<span class="${keyClass}">${encode(key)}</span>: `;
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
        if (val.erudaId)
        {
            id = val.erudaId;
        } else
        {
            id = util.uniqId('erudaJson');
            val.erudaId = id;
        }
        let circularId = val.erudaCircular;
        if (id) map[id] = val;
        let objAbstract = val['erudaObjAbstract'] || util.upperFirst(type);

        let obj = `<li ${firstLevel ? 'data-first-level="true"' : ''} ${'data-object-id="' + (circularId ? circularId : id) + '"'}>
                       <span class="${firstLevel ? '' : 'eruda-expanded eruda-collapsed'}"></span>
                       ${wrapKey(key)}
                       <span class="eruda-open">${firstLevel ? '' : objAbstract}</span>
                       <ul class="eruda-${type}" ${firstLevel ? '' : 'style="display:none"'}>`;

        let jsonHtml = jsonToHtml(val, map);
        if (firstLevel) obj += jsonHtml;

        return obj + '</ul><span class="eruda-close"></span></li>';
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
                   <span class="eruda-function">${encode(val).replace('function', '')}</span>
                </li>`;
    }
    if (val === 'undefined' || val === 'Symbol' || val === '(...)')
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

const LIGHTER_KEY = ['__proto__'];

var encode = str => util.escape(util.toStr(str));