import Tool from '../DevTools/Tool.es6'
import Request from './Request.es6'
import util from '../lib/util'

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
    init($el)
    {
        super.init($el);

        this._bindEvent();
        this.overrideXhr();
    }
    show()
    {
        super.show();

        this._getPerformanceTimingData();
    }
    overrideXhr()
    {
        var winXhrProto = window.XMLHttpRequest.prototype;

        var origSend = winXhrProto.send,
            origOpen = winXhrProto.open;

        var self = this;

        winXhrProto.open = function (method, url)
        {
            var xhr = this;

            var req = xhr.erudaRequest = new Request(xhr, method, url);

            req.on('send', (id, data) => self._addReq(id, data));

            xhr.addEventListener('readystatechange', function ()
            {
                switch (xhr.readyState)
                {
                    case 2: return req.handleHeadersReceived();
                    case 3: return req.handleLoading();
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
    _addReq(id, data)
    {
        util.defaults(data, {
            name: 'unknown',
            status: 'pending',
            type: 'unknown',
            size: 0,
            startTime: util.now()
        });

        this._requests[id] = data;

        this._render();
    }
    _updateReq(id, data)
    {
        if (!this._requests[id]) return;

        util.extend(this._requests[id], data);

        this._render();
    }
    _bindEvent()
    {
        var $el = this._$el;

        $el.on('click', '.eruda-performance-timing', function ()
        {
            $el.find('.eruda-performance-timing-detail').show();
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

        this._render();
    }
    _render()
    {
        this._$el.html(this._tpl({
            data: this._performanceTimingData,
            timing: this._performanceTiming,
            requests: this._requests
        }));
    }
}