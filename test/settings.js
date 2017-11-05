describe('settings', function () 
{
    var tool = eruda.get('settings'),
        $tool = $('.eruda-settings');

    var cfg = eruda.config.create('eruda-test');
    cfg.set({
        testSwitch: false,
        testSelect: '1',
        testRange: 1,
        testColor: '#000'
    });

    beforeEach(function () 
    {
        tool.clear();
    });

    describe('switch', function ()
    {
        it('ui', function ()
        {
            var text = 'Test Switch';

            tool.switch(cfg, 'testSwitch', text);
            expect($tool.find('.eruda-switch')).toContainText(text);
        });
    });

    describe('separator', function ()
    {
        it('ui', function ()
        {
            tool.separator();
            expect($tool.find('.eruda-separator').length).toEqual(1);
        });
    });

    describe('select', function ()
    {
        it('ui', function ()
        {
            var text = 'Test Select';

            tool.select(cfg, 'testSelect', text, ['1', '2', '3']);
            var $el = $tool.find('.eruda-select');
            expect($el.find('ul li').length).toEqual(3);
            expect($el.find('.eruda-head')).toContainText(text);
            expect($el.find('.eruda-val')).toContainText('1');
        });
    });

    describe('range', function () 
    {
        it('ui', function () 
        {
            var text = 'Test Range';

            tool.range(cfg, 'testRange', text, {min: 0, max: 1, step: 0.1});
            var $el = $tool.find('.eruda-range');
            expect($el.find('.eruda-head')).toContainText(text);
            expect($el.find('input').length).toEqual(1);
        });
    });

    describe('color', function () 
    {
        it('ui', function () 
        {
            var text = 'Test Color';

            tool.color(cfg, 'testColor', text, ['#000', '#fff']);
            var $el = $tool.find('.eruda-color');
            expect($el.find('.eruda-head')).toContainText(text);
            expect($el.find('ul li').length).toEqual(2);
        });
    });
});