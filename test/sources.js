describe('sources', function () 
{
    var tool = eruda.get('sources'),
        $tool = $('.eruda-sources');

    describe('highlight code', function ()
    {
        it('js', function ()
        {
            tool.set('js', '/* test */');
            expect($tool.find('.eruda-content')).toContainHtml('<span style="color:#63a35c;">/* test */</span>');
        });
    });
});