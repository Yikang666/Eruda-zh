var tool = eruda.get('snippets'),
    $tool = $('.eruda-snippets');

describe('default', function ()
{
    it('border all', function ()
    {
        expect($tool.find('.eruda-name').eq(0)).toContainText('Border All');
    });
    it('refresh page', function ()
    {
        expect($tool.find('.eruda-name').eq(1)).toContainText('Refresh Page');
    });
});

describe('basic', function ()
{
    it('clear', function ()
    {
        tool.clear();
        expect($tool.find('.eruda-name')).toHaveLength(0);
    });

    it('add', function ()
    {
        tool.add('Test', function ()
        {
            console.log('eruda');
        }, 'This is the description');
        expect($tool.find('.eruda-name')).toContainText('Test');
        expect($tool.find('.eruda-description')).toContainText('This is the description');
    });

    it('remove', function ()
    {
        tool.remove('Test');
        expect($tool.find('.eruda-name')).toHaveLength(0);
    });
});

