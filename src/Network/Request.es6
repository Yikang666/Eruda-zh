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
            method: this._method
        });
    }
    handleHeadersReceived()
    {
        var xhr = this._xhr;

        this.emit('update', this._id, {
            type: getType(xhr.getResponseHeader('Content-Type')),
            size: xhr.getResponseHeader('Content-Length'),
            time: util.now()
        });
    }
    handleDone()
    {
        this.emit('update', this._id, {
            status: this._xhr.status,
            time: util.now()
        });
    }
};

function getFileName(url)
{
    var ret = util.last(url.split('/'));

    if (ret.indexOf('?') > -1) ret = ret.split('?')[0];

    return ret;
}

function getType(contentType)
{
    if (!contentType) return 'unknown';

    return util.last(contentType.split(';')[0].split('/'));
}