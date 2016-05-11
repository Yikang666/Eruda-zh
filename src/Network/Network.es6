import Tool from '../DevTools/Tool.es6'
import Request from './Request.es6'
import util from '../lib/util'
import config from '../lib/config.es6'

require('./Network.scss');

export default class Network extends Tool
{
    constructor()
    {
        super();
        this.name = 'network';
        this._performanceTimingData = [];
        this._requests = {};

        this._tpl = require('./Network.hbs');
    }
    init($el, parent)
    {
        super.init($el);

        this._parent = parent;
        this._bindEvent();
        this._initConfig();
    }
    show()
    {
        super.show();

        this._getPerformanceTimingData();
        this._render();
    }
    overrideXhr()
    {
        var winXhrProto = window.XMLHttpRequest.prototype;

        var origSend = this._origSend = winXhrProto.send,
            origOpen = this._origOpen = winXhrProto.open;

        var self = this;

        winXhrProto.open = function (method, url)
        {
            var xhr = this;

            var req = xhr.erudaRequest = new Request(xhr, method, url);

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

        winXhrProto.send = function ()
        {
            var req = this.erudaRequest;
            if (req) req.handleSend();

            origSend.apply(this, arguments);
        };
    }
    restoreXhr()
    {
        var winXhrProto = window.XMLHttpRequest.prototype;

        if (this._origOpen) winXhrProto.open = this._origOpen;
        if (this._origSend) winXhrProto.send = this._origSend;
    }
    destroy()
    {
        super.destroy();
        this.restoreXhr();
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
            method: 'GET',
            startTime: util.now(),
            time: 0,
            resHeaders: {},
            resTxt: '',
            xhr: {},
            done: false
        });

        this._requests[id] = data;

        this._render();
    }
    _updateReq(id, data)
    {
        var target = this._requests[id];

        if (!target) return;

        util.extend(target, data);

        target.time = target.time - target.startTime;

        this._render();
    }
    _bindEvent()
    {
        var $el = this._$el,
            parent = this._parent;

        var self = this;

        $el.on('click', '.eruda-performance-timing', function ()
        {
            $el.find('.eruda-performance-timing-data').show();
        });

        $el.on('click', '.eruda-request', function ()
        {
            var id = util.$(this).data('id'),
                data = self._requests[id];

            if (!data.done) return;

            var sources = parent.get('sources');

            sources.set('http', {
                url: data.url,
                resTxt: data.resTxt,
                type: data.type,
                subType: data.subType,
                resHeaders: data.resHeaders
            });

            parent.showTool('sources');
        });
    }
    _getPerformanceTimingData()
    {
        var performance = window.webkitPerformance || window.performance,
            timing = performance.timing;

        var data = [];

        var {
                navigationStart,
                unloadEventStart,
                unloadEventEnd,
                redirectStart,
                redirectEnd,
                fetchStart,
                domainLookupStart,
                domainLookupEnd,
                connectStart,
                connectEnd,
                secureConnectionStart,
                requestStart,
                responseStart,
                responseEnd,
                domLoading,
                domInteractive,
                domContentLoadedEventStart,
                domContentLoadedEventEnd,
                domComplete,
                loadEventStart,
                loadEventEnd
            } = timing;

        var start = navigationStart,
            end = loadEventEnd,
            total = end - start;

        function getData(name, startTime, endTime)
        {
            var duration = endTime - startTime;

            return {
                name: name,
                start: (startTime - start) / total * 100,
                duration: duration,
                len: duration / total * 100
            };
        }

        data.push(getData('Total', navigationStart, loadEventEnd));
        data.push(getData('Network/Server', navigationStart, responseStart));
        data.push(getData('App cache', fetchStart, domainLookupStart));
        data.push(getData('DNS', domainLookupStart, domainLookupEnd));
        data.push(getData('TCP', connectStart, connectEnd));
        data.push(getData('Time to First Byte', requestStart, responseStart));
        data.push(getData('Response', responseStart, responseEnd));
        data.push(getData('Unload', unloadEventStart, unloadEventEnd));
        data.push(getData('DOM Processing', domLoading, domComplete));
        data.push(getData('DOM Construction', domLoading, domInteractive));
        data.push(getData('DOM Content Loaded Event', domContentLoadedEventStart, domContentLoadedEventEnd));
        data.push(getData('Load Event', loadEventStart, loadEventEnd));

        this._performanceTimingData = data;

        var performanceTiming = {};
        [
            'navigationStart',
            'unloadEventStart',
            'unloadEventEnd',
            'redirectStart',
            'redirectEnd',
            'fetchStart',
            'domainLookupStart',
            'domainLookupEnd',
            'connectStart',
            'connectEnd',
            'secureConnectionStart',
            'requestStart',
            'responseStart',
            'responseEnd',
            'domLoading',
            'domInteractive',
            'domContentLoadedEventStart',
            'domContentLoadedEventEnd',
            'domComplete',
            'loadEventStart',
            'loadEventEnd'
        ].forEach((val) =>
        {
            performanceTiming[val] = timing[val] === 0 ? 0 : timing[val] - start;
        });
        this._performanceTiming = performanceTiming;
    }
    _initConfig()
    {
        var cfg = this.config = config.create('eruda-network');

        cfg.set(util.defaults(cfg.get(), {
            overrideXhr: false
        }));

        if (cfg.get('overrideXhr')) this.overrideXhr();

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'overrideXhr': return val ? this.overrideXhr() : this.restoreXhr();
            }
        });
    }
    _render()
    {
        if (!this.active) return;

        this._$el.html(this._tpl({
            data: this._performanceTimingData,
            timing: this._performanceTiming,
            requests: this._requests
        }));
    }
}