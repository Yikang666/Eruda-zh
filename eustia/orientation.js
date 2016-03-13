_('Emitter');

orientation = {};

Emitter.mixin(orientation);

window.addEventListener('orientationchange', function ()
{
    setTimeout(function ()
    {
        orientation.emit('change');
    }, 150);
}, false);

