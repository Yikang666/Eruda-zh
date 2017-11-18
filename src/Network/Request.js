import util from '../lib/util';

export default class Request extends util.Emitter
{
    constructor(xhr, method, url)
    {
        super();

        this._xhr = xhr;
        this._method = method;
        this._url = fullUrl(url);
        this._id = util.uniqId('request');
    }
    handleSend(data)
    {
        if (!util.isStr(data)) data = '';

        this.emit('send', this._id, {
            name: util.getFileName(this._url),
            url: this._url,
            data: data,
            method: this._method,
            xhr: this._xhr
        });
    }
    handleHeadersReceived()
    {
        let xhr = this._xhr;

        let type = getType(xhr.getResponseHeader('Content-Type'));

        this.emit('update', this._id, {
            type: type.type,
            subType: type.subType,
            size: getSize(xhr, true, this._url),
            time: util.now(),
            resHeaders: getHeaders(xhr)
        });
    }
    handleDone()
    {
        let xhr = this._xhr,
            resType = xhr.responseType;

        let resTxt = (resType === '' || resType === 'text') ? xhr.responseText : '';

        this.emit('update', this._id, {
            status: xhr.status,
            done: true,
            size: getSize(xhr, false, this._url),
            time: util.now(),
            resTxt: resTxt
        });
    }
}

function getHeaders(xhr)
{
    let raw = xhr.getAllResponseHeaders(),
        lines = raw.split('\n');

    let ret = {};

    util.each(lines, (line) =>
    {
        line = util.trim(line);

        if (line === '') return;

        let [key, val] = line.split(':', 2);

        ret[key] = util.trim(val);
    });

    return ret;
}

function getType(contentType)
{
    if (!contentType) return 'unknown';

    let type = contentType.split(';')[0].split('/');

    return {
        type: type[0],
        subType: util.last(type)
    };
}

function getSize(xhr, headersOnly, url)
{
    let size = 0;

    function getStrSize()
    {
        if (!headersOnly)
        {
            let resType = xhr.responseType;
            let resTxt = (resType === '' || resType === 'text') ? xhr.responseText : '';
            if (resTxt) size = lenToUtf8Bytes(resTxt);
        }
    }

    if (util.isCrossOrig(url))
    {
        getStrSize();
    } else
    {
        try {
            size = util.toNum(xhr.getResponseHeader('Content-Length'));
        } catch (e)
        {
            getStrSize();
        }
    }

    if (size === 0) getStrSize();

    return `${util.fileSize(size)}B`;
}

function lenToUtf8Bytes(str)
{
    let m = encodeURIComponent(str).match(/%[89ABab]/g);

    return str.length + (m ? m.length : 0);
}

let origin = window.location.origin;

function fullUrl(url)
{
    if (util.startWith(url, 'http')) return url;

    if (!util.startWith(url, '/')) url = '/' + url;

    return origin + url;
}
