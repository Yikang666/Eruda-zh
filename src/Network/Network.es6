import Tool from '../DevTools/Tool.es6'
import Request from './Request.es6'
import util from '../lib/util'
import config from '../lib/config.es6'

export default class Network extends Tool
{
    constructor()
    {
        super();

        util.evalCss(require('./Network.scss'));

        this.name = 'network';
        this._performanceTimingData = [];
        this._performanceTiming = {};
        this._resourceTimingData = [];
        this._requests = {};
        this._tpl = require('./Network.hbs');

        var performance = this._performance = window.webkitPerformance || window.performance;
        this._hasResourceTiming = performance && util.isFn(performance.getEntries);
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

        winXhrProto.send = function (data)
        {
            var req = this.erudaRequest;
            if (req) req.handleSend(data);

            origSend.apply(this, arguments);
        };
    }
    restoreXhr()
    {
        var winXhrProto = window.XMLHttpRequest.prototype;

        if (this._origOpen) winXhrProto.open = this._origOpen;
        if (this._origSend) winXhrProto.send = this._origSend;
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
        target.displayTime = formatTime(target.time);

        if (target.done && (target.status < 200 || target >= 300)) target.hasErr = true;

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
        }).on('click', '.eruda-request', function ()
        {
            var id = util.$(this).data('id'),
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
        }).on('click', '.eruda-entry', function ()
        {
            var idx = util.$(this).data('idx'),
                data = self._resourceTimingData[Number(idx)];

            if (data.initiatorType === 'img')
            {
                showSources('img', data.url);
            }
        }).on('click', '.eruda-clear-xhr', function ()
        {
            self._requests = {};
            self._render();
        });

        function showSources(type, data)
        {
            var sources = parent.get('sources');
            if (!sources) return;

            sources.set(type, data);

            parent.showTool('sources');
        }
    }
    _getPerformanceTimingData()
    {
        var performance = this._performance;

        if (!performance) return;

        var timing = performance.timing;

        var data = [];

        /* eslint-disable no-unused-vars */
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
        data.push(getData('App Cache', fetchStart, domainLookupStart));
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
    _getResourceTimingData()
    {
        if (!this._hasResourceTiming) return;

        var entries = this._performance.getEntries(),
            hideXhr = this.config.get('hideXhrResource'),
            data = [];

        entries.forEach(entry =>
        {
            if (hideXhr && entry.initiatorType === 'xmlhttprequest') return;

            data.push({
                name: util.getFileName(entry.name),
                displayTime: formatTime(entry.duration),
                url: entry.name,
                initiatorType: entry.initiatorType
            });
        });

        this._resourceTimingData = data;
    }
    _initConfig()
    {
        var cfg = this.config = config.create('eruda-network');

        cfg.set(util.defaults(cfg.get(), {
            disablePerformance: false,
            hideXhrResource: true,
            overrideXhr: true
        }));

        if (cfg.get('overrideXhr')) this.overrideXhr();

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'overrideXhr': return val ? this.overrideXhr() : this.restoreXhr();
            }
        });

        var settings = this._parent.get('settings');
        settings.text('Network')
                .switch(cfg, 'overrideXhr', 'Catch Xhr Requests');

        if (this._hasResourceTiming) settings.switch(cfg, 'hideXhrResource', 'Hide Xhr Resource Timing');

        settings.switch(cfg, 'disablePerformance', 'Disable Performance Timing')
                .separator();
    }
    _render()
    {
        if (!this.active) return;

        var cfg = this.config;

        this._getResourceTimingData();

        var renderData = {entries: this._resourceTimingData};

        if (cfg.get('overrideXhr'))
        {
            renderData.displayReq = true;
            if (!util.isEmpty(this._requests)) renderData.requests = this._requests;
        }

        if (!cfg.get('disablePerformance'))
        {
            this._getPerformanceTimingData();
            renderData.data = this._performanceTimingData;
            renderData.timing = this._performanceTiming;
        }

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