import util from '../lib/util';
import {getType, lenToUtf8Bytes} from './util';

export default class XhrRequest extends util.Emitter
{
    constructor(xhr, method, url)
    {
        super();

        this._xhr = xhr;
        this._method = method;
        this._url = util.fullUrl(url);
        this._id = util.uniqId('request');
    }
    handleSend(data)
    {
        if (!util.isStr(data)) data = '';

        this.emit('send', this._id, {
            name: util.getFileName(this._url),
            url: this._url,
            data,
            method: this._method
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

        let resTxt = (resType === '' || resType === 'text' || resType === 'json') ? xhr.responseText : '';

        this.emit('update', this._id, {
            status: xhr.status,
            done: true,
            size: getSize(xhr, false, this._url),
            time: util.now(),
            resTxt: resTxt
        });

        delete this._xhr;
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


function getSize(xhr, headersOnly, url)
{
    let size = 0;

    function getStrSize()
    {
        if (!headersOnly)
        {
            let resType = xhr.responseType;
            let resTxt = (resType === '' || resType === 'text' || resType === 'json') ? xhr.responseText : '';
            if (resTxt) size = lenToUtf8Bytes(resTxt);
        }
    }

    if (util.isCrossOrig(url))
    {
        getStrSize();
    } else
    {
        try 
        {
            size = util.toNum(xhr.getResponseHeader('Content-Length'));
        } catch (e)
        {
            getStrSize();
        }
    }

    if (size === 0) getStrSize();

    return `${util.fileSize(size)}B`;
}
