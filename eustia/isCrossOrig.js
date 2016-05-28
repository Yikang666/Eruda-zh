_('startWith');

var origin = window.location.origin;

function exports(url)
{
    return !startWith(url, origin);
}