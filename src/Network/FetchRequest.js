import util from '../lib/util';
import {getType, lenToUtf8Bytes} from './util';

export default class FetchRequest extends util.Emitter 
{
    constructor(url, options = {}) 
    {
        super();

        this._url = util.fullUrl(url);
        this._id = util.uniqId('request');
        this._options = options;
        this._method = options.method || 'GET';
    }
    send(fetchResult) 
    {
        let options = this._options;

        let data = util.isStr(options.body) ? options.body : '';

        this._fetch = fetchResult;
        this.emit('send', this._id, {
            name: util.getFileName(this._url),
            url: this._url,
            data,
            method: this._method
        });

        fetchResult.then(res => 
        {
            res = res.clone();

            let type = getType(res.headers.get('Content-Type'));
            
            res.text().then(resTxt => 
            {
                this.emit('update', this._id, {
                    type: type.type,
                    subType: type.subType,
                    time: util.now(),
                    size: getSize(res, resTxt),
                    resTxt: resTxt,
                    resHeaders: getHeaders(res),
                    status: res.status,
                    done: true
                });
            });

            return res;
        });
    }
}

function getSize(res, resTxt) 
{
    let size = 0;

    let contentLen = res.headers.get('Content-length');

    if (contentLen) 
    {
        size = util.toNum(contentLen); 
    } else 
    {
        size = lenToUtf8Bytes(resTxt);
    }

    return `${util.fileSize(size)}B`;
}

function getHeaders(res) 
{
    let ret = {};

    res.headers.forEach((val, key) => ret[key] = val);

    return ret;
}