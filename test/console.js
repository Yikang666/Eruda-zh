var tool = eruda.get('console'),
    $tool = $('.eruda-console');

describe('log', function ()
{
    it('string', function ()
    {
        var text = 'This is a log';

        tool.clear().log(text);
        expect($tool.find('.eruda-log')).toContainText(text);
    });

    it('clear', function ()
    {
        tool.clear();
        expect($tool.find('.eruda-log')).toHaveLength(0);
    });

    it('basic object', function ()
    {
        var obj = {a: 1};

        tool.clear().log(obj);
        expect($tool.find('.eruda-log')).toContainText('Object { a: 1 }');
    });

    it('dir html element', function ()
    {
        tool.clear().dir(document.createElement('script'));
        expect($tool.find('.eruda-log')).not.toContainText('<script></script>');
    });

    it('html', function ()
    {
        tool.clear().html('<span class="color-blue">Blue</span>');
        expect($tool.find('.eruda-html')).toContainElement('span.color-blue');
    });

    it('timing', function ()
    {
        tool.clear().time('eruda');
        tool.clear().timeEnd('eruda');
        expect($tool.find('.eruda-html')).toHaveText(/eruda: \d+ms/);
    });

    it('error', function ()
    {
        tool.clear().error(new Error('error test'));
        expect($tool.find('.eruda-error')).toContainElement('.eruda-stack');
    });

    it('assert', function ()
    {
        tool.clear().assert(true, 'assert');
        expect($tool.find('.eruda-log-item')).toHaveLength(0);

        tool.assert(false, 'assert');
        expect($tool.find('.eruda-error')).toHaveLength(1);
    });

    it('count', function ()
    {
        tool.clear().count('test').clear();
        tool.count('test');
        expect($tool.find('.eruda-html')).toContainText('test: 2');
    });
});

describe('substitution', function ()
{
    it('number', function ()
    {
        tool.clear().log('Eruda is %d', 1.2, 'year old');
        expect($tool.find('.eruda-log')).toContainText('Eruda is 1 year old');

        tool.clear().log('%i', 1.2, 'year old');
        expect($tool.find('.eruda-log')).toContainText('1 year old');

        tool.clear().log('%f', 1.2, 'year old');
        expect($tool.find('.eruda-log')).toContainText('1.2 year old');
    });

    it('string', function ()
    {
        tool.clear().log('My name is %s', 'eruda');
        expect($tool.find('.eruda-log')).toContainText('My name is eruda');
    });

    it('object', function ()
    {
        tool.clear().log('Object is %O', {a: 1});
        expect($tool.find('.eruda-log')).toContainText('Object is { a: 1 }');

        tool.clear().log('Dom is %o', document.createElement('script'));
        expect($tool.find('.eruda-log')).toContainText('Dom is <script></script>');
    });

    it('style', function ()
    {
        tool.clear().log('%cblue%cgreen', 'color:blue', 'color:green');
        expect($tool.find('.eruda-log')).toContainHtml('<span style="color:blue">blue</span><span style="color:green">green</span>');
    });

    it('Repeat log', function ()
    {
        tool.clear();
        for (var i = 0; i < 10; i++) tool.log(1);
        var $log = $tool.find('.eruda-log-item');
        expect($log).toHaveLength(1);
        expect($log.find('.eruda-count')).toContainText('10');
    });
});

describe('table', function ()
{
    it('wrong args', function ()
    {
        tool.clear().table('test');
        expect($tool.find('.eruda-table')).not.toContainElement('table');
    });

    it('basic', function ()
    {
        tool.clear().table([{test: 1}, {test: 2, test2: 3}]);
        expect($tool.find('.eruda-table tbody tr')).toHaveLength(2);
        expect($tool.find('.eruda-table thead th')).toHaveLength(3);
    });

    it('filter', function ()
    {
        tool.clear().table([{test: 1}, {test: 2, test2: 3}], 'test');
        expect($tool.find('.eruda-table thead th')).toHaveLength(2);
    });
});

describe('filter', function ()
{
    // Test case from https://github.com/liriliri/eruda/issues/14
    it('function', function ()
    {
        tool.clear().filter(function (log)
        {
            return log.type !== 'error';
        });

        var obj = {};
        Object.defineProperty(obj, 'a', {
            get: function ()
            {
                tool.error('deprecated');

                return 1;
            }
        });
        tool.log(obj);
        expect($tool.find('.eruda-logs li').length).toEqual(1);

        tool.filter('all');
    });

    it('all info error warn log', function ()
    {
        tool.clear().log('log').info('info').error('error').warn('warn').debug('debug');
        expect($tool.find('.eruda-log-item')).toHaveLength(5);

        tool.filter('info');
        expect($tool.find('.eruda-log-item')).toHaveLength(1);
        expect($tool.find('.eruda-info')).toHaveLength(1);

        tool.filter('error');
        expect($tool.find('.eruda-log-item')).toHaveLength(1);
        expect($tool.find('.eruda-error')).toHaveLength(1);

        tool.filter('warn');
        expect($tool.find('.eruda-log-item')).toHaveLength(1);
        expect($tool.find('.eruda-warn')).toHaveLength(1);

        tool.filter('debug');
        expect($tool.find('.eruda-log-item')).toHaveLength(1);
        expect($tool.find('.eruda-debug')).toHaveLength(1);

        tool.filter('all');
    });

    it('regex', function ()
    {
        tool.clear().log('test').log('test2');
        expect($tool.find('.eruda-log-item')).toHaveLength(2);

        tool.filter(/test2/);
        expect($tool.find('.eruda-log-item')).toHaveLength(1);
        expect($tool.find('.eruda-log')).toContainText('test2');

        tool.filter('all');
    });
});

describe('config', function ()
{
    var config = tool.config;

    it('max number', function ()
    {
        config.set('maxLogNum', '10');
        tool.clear();
        for (var i = 0; i < 20; i++) tool.log(i);
        expect($tool.find('.eruda-log-item')).toHaveLength(10);
    });

    it('override console', function ()
    {
        config.set('overrideConsole', true);
        console.clear();
        console.log('test');
        expect($tool.find('.eruda-log-item')).toContainText('test');
    });

    it('display extra info', function ()
    {
        config.set('displayExtraInfo', true);
        tool.clear().log('test');
        expect($tool.find('.eruda-logs li')).toContainElement('.eruda-header');
    });
});

