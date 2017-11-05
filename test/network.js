describe('network', function () 
{
    var tool = eruda.get('network'),
        $tool = $('.eruda-network');

    beforeEach(function () 
    {
        eruda.show('network');
    });

    describe('request', function () 
    {
        it('xhr', function (done) 
        {
            $('.eruda-clear-xhr').click();
            _.ajax.get(window.location.toString(), function () 
            {
                expect($('.eruda-requests li')).toHaveLength(1);
                done();
            });
        });
    });
});