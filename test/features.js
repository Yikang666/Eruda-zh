describe('features', function () 
{
    var tool = eruda.get('features'),
        $tool = $('.eruda-features');

    beforeEach(function () 
    {
        eruda.show('features');
    });

    it('items', function (done) 
    {
        setTimeout(function () 
        {
            expect($tool.find('li')).toHaveLength(45);
            done();
        }, 1000);
    });
});