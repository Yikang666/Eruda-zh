var tool = eruda.get('settings'),
    $tool = $('.eruda-settings');

var cfg = eruda.config.create('eruda-test');
cfg.set({
    testSwitch: false,
    testSelect: ['1']
});

describe('switch', function ()
{
    it('ui', function ()
    {
        var text = 'Test Switch';

        tool.switch(cfg, 'testSwitch', text);
        expect($tool.find('.eruda-switch').eq(3)).toContainText(text);
    });
});

describe('separator', function ()
{
    it('ui', function ()
    {
        tool.separator();
        expect($tool.find('.eruda-separator').length).toEqual(4);
    });
});

describe('select', function ()
{
    it('ui', function ()
    {
        var text = 'Test Select';

        tool.select(cfg, 'testSelect', text, ['1', '2', '3']);
        var $el = $tool.find('.eruda-select').eq(2);
        expect($el.find('ul li').length).toEqual(3);
        expect($el.find('.eruda-val')).toContainText('1');
    });
});
