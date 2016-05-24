import util from '../lib/util'

export default class Request extends util.Emitter
{
    constructor(xhr, method, url)
    {
        super();

        this._xhr = xhr;
        this._method = method;
        this._url = url;
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
        var xhr = this._xhr;

        var type = getType(xhr.getResponseHeader('Content-Type'));

        this.emit('update', this._id, {
            type: type.type,
            subType: type.subType,
            size: getSize(xhr, true),
            time: util.now(),
            resHeaders: getHeaders(xhr)
        });
    }
    handleDone()
    {
        var xhr = this._xhr;

        this.emit('update', this._id, {
            status: xhr.status,
            done: true,
            size: getSize(xhr),
            time: util.now(),
            resTxt: xhr.responseText
        });
    }
};

function getHeaders(xhr)
{
    var raw = xhr.getAllResponseHeaders(),
        lines = raw.split('\n');

    var ret = {};

    util.each(lines, (line) =>
    {
        line = util.trim(line);

        if (line === '') return;

        var [key, val] = line.split(':', 2);

        ret[key] = util.trim(val);
    });

    return ret;
}

function getType(contentType)
{
    if (!contentType) return 'unknown';

    var type = contentType.split(';')[0].split('/');

    return {
        type: type[0],
        subType: util.last(type)
    }
}

function getSize(xhr, headersOnly)
{
    var size = 0;

    function getStrSize()
    {
        if (!headersOnly)
        {
            var resTxt = xhr.responseText;
            if (resTxt) size = lenToUtf8Bytes(resTxt);
        }
    }

    try {
        size = util.toNum(xhr.getResponseHeader('Content-Length'));
    } catch (e)
    {
        getStrSize();
    }

    if (size === 0) getStrSize();

    if (size < 1024) return size + 'B';

    return (size / 1024).toFixed(1) + 'KB';
}

function lenToUtf8Bytes(str)
{
    var m = encodeURIComponent(str).match(/%[89ABab]/g);

    return str.length + (m ? m.length : 0);
}