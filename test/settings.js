var tool = eruda.get('settings'),
    $tool = $('.eruda-settings');

var cfg = eruda.config.create('eruda-test');
cfg.set({
    testSwitch: false,
    testSelect: ['1']
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
        expect($el.find('.eruda-val')).toContainText('1');
    });
});
