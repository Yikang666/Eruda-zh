_('startWith');

let origin = window.location.origin;

function exports(url)
{
    if (startWith(url, 'http')) return url;

    if (!startWith(url, '/')) url = '/' + url;

    return origin + url;
}
