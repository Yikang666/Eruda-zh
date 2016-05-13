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
    handleSend()
    {
        this.emit('send', this._id, {
            name: getFileName(this._url),
            url: this._url,
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
            size: formatSize(xhr.getResponseHeader('Content-Length')),
            time: util.now(),
            resHeaders: getHeaders(xhr)
        });
    }
    handleDone()
    {
        this.emit('update', this._id, {
            status: this._xhr.status,
            done: true,
            time: util.now(),
            resTxt: this._xhr.responseText
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

function getFileName(url)
{
    var ret = util.last(url.split('/'));

    if (ret.indexOf('?') > -1) ret = ret.split('?')[0];

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

function formatSize(size)
{
    size = util.toNum(size);

    if (size < 1024) return size + 'B';

    return (size / 1024).toFixed(1) + 'KB';
}