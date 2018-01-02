import Tool from '../DevTools/Tool';
import XhrRequest from './XhrRequest';
import FetchRequest from './FetchRequest';
import util from '../lib/util';

export default class Network extends Tool
{
    constructor()
    {
        super();

        this._style = util.evalCss(require('./Network.scss'));

        this.name = 'network';
        this._requests = {};
        this._tpl = require('./Network.hbs');
        this._isFetchSupported = false;
        if (window.fetch) this._isFetchSupported = util.isNative(window.fetch);
    }
    init($el, container)
    {
        super.init($el);

        this._container = container;
        this._bindEvent();
        this.overrideXhr();
        this.overrideFetch();
    }
    show()
    {
        super.show();

        this._render();
    }
    overrideXhr()
    {
        let winXhrProto = window.XMLHttpRequest.prototype;

        let origSend = this._origSend = winXhrProto.send,
            origOpen = this._origOpen = winXhrProto.open;

        let self = this;

        winXhrProto.open = function (method, url)
        {
            let xhr = this;

            let req = xhr.erudaRequest = new XhrRequest(xhr, method, url);

            req.on('send', (id, data) => self._addReq(id, data));
            req.on('update', (id, data) => self._updateReq(id, data));

            xhr.addEventListener('readystatechange', function ()
            {
                switch (xhr.readyState)
                {
                    case 2: return req.handleHeadersReceived();
                    case 4: return req.handleDone();
                }
            });

            origOpen.apply(this, arguments);
        };

        winXhrProto.send = function (data)
        {
            let req = this.erudaRequest;
            if (req) req.handleSend(data);

            origSend.apply(this, arguments);
        };
    }
    restoreXhr()
    {
        let winXhrProto = window.XMLHttpRequest.prototype;

        if (this._origOpen) winXhrProto.open = this._origOpen;
        if (this._origSend) winXhrProto.send = this._origSend;
    }
    overrideFetch() 
    {
        if (!this._isFetchSupported) return;

        let origFetch = this._origFetch = window.fetch;

        let self = this;

        window.fetch = function (...args) 
        {
            let req = new FetchRequest(...args);
            req.on('send', (id, data) => self._addReq(id, data));
            req.on('update', (id, data) => self._updateReq(id, data));

            let fetchResult = origFetch(...args);
            req.send(fetchResult);

            return fetchResult;
        };
    }
    restoreFetch() 
    {
        if (!this._isFetchSupported) return;

        if (this._origFetch) window.fetch = this._origFetch;
    }
    _addReq(id, data)
    {
        util.defaults(data, {
            name: '',
            url: '',
            status: 'pending',
            type: 'unknown',
            subType: 'unknown',
            size: 0,
            data: '',
            method: 'GET',
            startTime: util.now(),
            time: 0,
            resHeaders: {},
            resTxt: '',
            done: false
        });

        this._requests[id] = data;

        this._render();
    }
    _updateReq(id, data)
    {
        let target = this._requests[id];

        if (!target) return;

        util.extend(target, data);

        target.time = target.time - target.startTime;
        target.displayTime = formatTime(target.time);

        if (target.done && (target.status < 200 || target >= 300)) target.hasErr = true;

        this._render();
    }
    _bindEvent()
    {
        let $el = this._$el,
            container = this._container;

        let self = this;

        $el.on('click', '.eruda-request', function ()
        {
            let id = util.$(this).data('id'),
                data = self._requests[id];

            if (!data.done) return;

            showSources('http', {
                url: data.url,
                data: data.data,
                resTxt: data.resTxt,
                type: data.type,
                subType: data.subType,
                resHeaders: data.resHeaders
            });
        }).on('click', '.eruda-clear-request', function ()
        {
            self._requests = {};
            self._render();
        });

        function showSources(type, data)
        {
            let sources = container.get('sources');
            if (!sources) return;

            sources.set(type, data);

            container.showTool('sources');
        }
    }
    destroy() 
    {
        super.destroy();

        util.evalCss.remove(this._style);
        this.restoreXhr();
        this.restoreFetch();
    }
    _render()
    {
        if (!this.active) return;

        let renderData = {};

        if (!util.isEmpty(this._requests)) renderData.requests = this._requests;

        this._renderHtml(this._tpl(renderData));
    }
    _renderHtml(html)
    {
        if (html === this._lastHtml) return;
        this._lastHtml = html;
        this._$el.html(html);
    }
}

function formatTime(time)
{
    time = Math.round(time);

    if (time < 1000) return time + 'ms';

    return (time / 1000).toFixed(1) + 's';
}
