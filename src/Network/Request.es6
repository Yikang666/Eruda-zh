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
            name: getFileName(this._url)
        });
    }
    handleHeadersReceived()
    {

    }
    handleLoading()
    {

    }
    handleDone()
    {

    }
};

function getFileName(url)
{
    return util.last(url.split('/'));
}