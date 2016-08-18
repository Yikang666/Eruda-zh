function boot(name)
{
    // Need a little delay to make sure width and height of webpack dev server iframe are initialized.
    setTimeout(function ()
    {
        eruda.init({
            tool: name === 'settings' ? [] : name
        });
        eruda.show().get().config.set('displaySize', '50%');

        if (name == null) return;

        loadJs('lib/boot', function ()
        {
            loadJs('lib/jasmine-jquery', function ()
            {
                // This is needed to trigger jasmine initialization.
                loadJs(name, function ()
                {
                    window.onload();
                });
            });
        });
    }, 500);
}

function loadJs(src, cb)
{
    var script = document.createElement('script');
    script.src = src + '.js';
    script.onload = cb;
    document.body.appendChild(script);
}