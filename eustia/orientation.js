_('Emitter');

Emitter.mixin(exports);

window.addEventListener('orientationchange', function ()
{
    setTimeout(function ()
    {
        exports.emit('change');
    }, 150);
}, false);

