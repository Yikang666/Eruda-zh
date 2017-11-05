describe('elements', function () 
{
    var tool = eruda.get('elements'),
        $tool = $('.eruda-elements');

    beforeEach(function () 
    {
        eruda.show('elements');
    });

    describe('api', function ()
    {
        it('set element', function ()
        {
            tool.set(document.body);
            expect($tool.find('.eruda-parent')).toContainText('html');
            expect($tool.find('.eruda-breadcrumb')).toContainText('body');
        });
    });
});
