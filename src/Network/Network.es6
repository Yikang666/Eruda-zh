import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'

require('./Network.scss');

export default class Network extends Tool
{
    constructor()
    {
        super();
        this.name = 'network';
        this._performanceTimingData = [];

        this._tpl = require('./Network.hbs');
    }
    show()
    {
        super.show();

        this._getPerformanceTimingData();
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
            timing: this._performanceTiming
        }));
    }
}